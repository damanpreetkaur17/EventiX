import { Router, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import { env } from "../env.js";
import { prisma } from "../prisma.js";
import {
  clearRefreshCookie,
  issueRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken,
  setRefreshCookie,
  signAccessToken,
  signOAuthState,
  verifyOAuthState,
} from "../tokens.js";
import { requireAuth, type AuthedRequest } from "../middleware/requireAuth.js";
import { publicUser } from "./serialize.js";
import {
  buildGithubAuthUrl,
  buildGoogleAuthUrl,
  exchangeGithubCode,
  exchangeGoogleCode,
  type OAuthProfile,
} from "./oauth.js";

export const authRouter = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: unknown): email is string {
  return typeof email === "string" && EMAIL_RE.test(email);
}

/** Builds the response body returned after any successful authentication. */
async function authResponse(res: Response, user: { id: string; email: string }) {
  const accessToken = signAccessToken(user);
  const refreshToken = await issueRefreshToken(user.id);
  setRefreshCookie(res, refreshToken);
  return accessToken;
}

authRouter.get("/providers", (_req, res) => {
  res.json({ google: env.google.enabled, github: env.github.enabled });
});

authRouter.post("/register", async (req: Request, res: Response) => {
  const { email, password, name } = req.body ?? {};

  if (!isValidEmail(email)) {
    res.status(400).json({ error: "A valid email is required" });
    return;
  }
  if (typeof password !== "string" || password.length < 6) {
    res.status(400).json({ error: "Password must be at least 6 characters" });
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ error: "An account with this email already exists" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: typeof name === "string" && name.trim() ? name.trim() : null,
      provider: "CREDENTIALS",
    },
  });

  const accessToken = await authResponse(res, user);
  res.status(201).json({ accessToken, user: publicUser(user) });
});

authRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};

  if (!isValidEmail(email) || typeof password !== "string") {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const accessToken = await authResponse(res, user);
  res.json({ accessToken, user: publicUser(user) });
});

authRouter.post("/refresh", async (req: Request, res: Response) => {
  const token = req.cookies?.[env.refreshCookieName];
  console.log(
    "[refresh] cookieNames=%o hasRefreshCookie=%s origin=%s",
    Object.keys(req.cookies ?? {}),
    Boolean(token),
    req.headers.origin ?? req.headers.referer ?? "n/a",
  );
  if (!token) {
    res.status(401).json({ error: "No refresh token provided" });
    return;
  }

  try {
    const { userId, token: newToken } = await rotateRefreshToken(token);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      clearRefreshCookie(res);
      res.status(401).json({ error: "User no longer exists" });
      return;
    }
    setRefreshCookie(res, newToken);
    const accessToken = signAccessToken(user);
    res.json({ accessToken, user: publicUser(user) });
  } catch (err) {
    console.log("[refresh] rotation failed:", (err as Error).message);
    clearRefreshCookie(res);
    res.status(401).json({ error: "Invalid or expired refresh token" });
  }
});

authRouter.post("/logout", async (req: Request, res: Response) => {
  const token = req.cookies?.[env.refreshCookieName];
  if (token) {
    await revokeRefreshToken(token);
  }
  clearRefreshCookie(res);
  res.status(204).end();
});

authRouter.get("/me", requireAuth, async (req: AuthedRequest, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({ user: publicUser(user) });
});

// ---------------------------------------------------------------------------
// OAuth (Google + GitHub) — authorization code flow
// ---------------------------------------------------------------------------

function redirectToFrontend(res: Response, ok: boolean, errorMsg?: string): void {
  const url = new URL("/auth/callback", env.frontendUrl);
  url.searchParams.set("status", ok ? "success" : "error");
  if (errorMsg) url.searchParams.set("message", errorMsg);
  res.redirect(url.toString());
}

/** Finds or creates a user from an OAuth profile, linking by email when possible. */
async function upsertOAuthUser(profile: OAuthProfile) {
  const byProvider = await prisma.user.findUnique({
    where: {
      provider_providerId: {
        provider: profile.provider,
        providerId: profile.providerId,
      },
    },
  });
  if (byProvider) return byProvider;

  const byEmail = await prisma.user.findUnique({ where: { email: profile.email } });
  if (byEmail) {
    return prisma.user.update({
      where: { id: byEmail.id },
      data: {
        provider: byProvider ? byEmail.provider : profile.provider,
        providerId: profile.providerId,
        avatarUrl: byEmail.avatarUrl ?? profile.avatarUrl,
        name: byEmail.name ?? profile.name,
      },
    });
  }

  return prisma.user.create({
    data: {
      email: profile.email,
      name: profile.name,
      avatarUrl: profile.avatarUrl,
      provider: profile.provider,
      providerId: profile.providerId,
    },
  });
}

authRouter.get("/google", (_req, res) => {
  if (!env.google.enabled) {
    res.status(503).json({ error: "Google login is not configured" });
    return;
  }
  res.redirect(buildGoogleAuthUrl(signOAuthState("google")));
});

authRouter.get("/google/callback", async (req: Request, res: Response) => {
  if (!env.google.enabled) {
    redirectToFrontend(res, false, "Google login is not configured");
    return;
  }
  const stateOk = verifyOAuthState(req.query.state as string | undefined, "google");
  console.log(
    "[google/callback] error=%s hasCode=%s stateOk=%s",
    req.query.error ?? "none",
    typeof req.query.code === "string",
    stateOk,
  );
  if (req.query.error || typeof req.query.code !== "string" || !stateOk) {
    redirectToFrontend(res, false, "Google authorization failed");
    return;
  }
  try {
    const profile = await exchangeGoogleCode(req.query.code);
    const user = await upsertOAuthUser(profile);
    const refreshToken = await issueRefreshToken(user.id);
    setRefreshCookie(res, refreshToken);
    console.log("[google/callback] success, refresh cookie set for", user.email);
    redirectToFrontend(res, true);
  } catch (err) {
    console.log("[google/callback] failed:", (err as Error).message);
    redirectToFrontend(res, false, "Could not sign in with Google");
  }
});

authRouter.get("/github", (_req, res) => {
  if (!env.github.enabled) {
    res.status(503).json({ error: "GitHub login is not configured" });
    return;
  }
  res.redirect(buildGithubAuthUrl(signOAuthState("github")));
});

authRouter.get("/github/callback", async (req: Request, res: Response) => {
  if (!env.github.enabled) {
    redirectToFrontend(res, false, "GitHub login is not configured");
    return;
  }
  if (
    req.query.error ||
    typeof req.query.code !== "string" ||
    !verifyOAuthState(req.query.state as string | undefined, "github")
  ) {
    redirectToFrontend(res, false, "GitHub authorization failed");
    return;
  }
  try {
    const profile = await exchangeGithubCode(req.query.code);
    const user = await upsertOAuthUser(profile);
    const refreshToken = await issueRefreshToken(user.id);
    setRefreshCookie(res, refreshToken);
    redirectToFrontend(res, true);
  } catch {
    redirectToFrontend(res, false, "Could not sign in with GitHub");
  }
});
