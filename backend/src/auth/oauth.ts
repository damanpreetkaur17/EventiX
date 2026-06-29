import { env } from "../env.js";
import type { AuthProvider } from "../../generated/prisma/enums.js";

export interface OAuthProfile {
  provider: Exclude<AuthProvider, "CREDENTIALS">;
  providerId: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
}

// Callbacks go through the frontend's Next.js proxy so all Set-Cookie headers
// are issued for the frontend origin — this avoids SameSite=Lax cross-origin
// cookie issues when the browser sends fetch() requests from the frontend.
export function googleCallbackUrl(): string {
  return `${env.frontendUrl}/api/auth/google/callback`;
}

export function githubCallbackUrl(): string {
  return `${env.frontendUrl}/api/auth/github/callback`;
}

export function buildGoogleAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: env.google.clientId,
    redirect_uri: googleCallbackUrl(),
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "offline",
    prompt: "select_account",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export function buildGithubAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: env.github.clientId,
    redirect_uri: githubCallbackUrl(),
    scope: "read:user user:email",
    state,
    allow_signup: "true",
  });
  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

export async function exchangeGoogleCode(code: string): Promise<OAuthProfile> {
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env.google.clientId,
      client_secret: env.google.clientSecret,
      redirect_uri: googleCallbackUrl(),
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    throw new Error(`Google token exchange failed: ${await tokenRes.text()}`);
  }

  const { access_token } = (await tokenRes.json()) as { access_token: string };

  const profileRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (!profileRes.ok) {
    throw new Error(`Google profile fetch failed: ${await profileRes.text()}`);
  }

  const profile = (await profileRes.json()) as {
    sub: string;
    email: string;
    name?: string;
    picture?: string;
  };

  return {
    provider: "GOOGLE",
    providerId: profile.sub,
    email: profile.email,
    name: profile.name ?? null,
    avatarUrl: profile.picture ?? null,
  };
}

export async function exchangeGithubCode(code: string): Promise<OAuthProfile> {
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      code,
      client_id: env.github.clientId,
      client_secret: env.github.clientSecret,
      redirect_uri: githubCallbackUrl(),
    }),
  });

  if (!tokenRes.ok) {
    throw new Error(`GitHub token exchange failed: ${await tokenRes.text()}`);
  }

  const { access_token } = (await tokenRes.json()) as { access_token?: string };
  if (!access_token) {
    throw new Error("GitHub token exchange returned no access token");
  }

  const headers = {
    Authorization: `Bearer ${access_token}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "EventiX-Auth",
  };

  const profileRes = await fetch("https://api.github.com/user", { headers });
  if (!profileRes.ok) {
    throw new Error(`GitHub profile fetch failed: ${await profileRes.text()}`);
  }

  const profile = (await profileRes.json()) as {
    id: number;
    name?: string;
    login: string;
    email?: string | null;
    avatar_url?: string;
  };

  let email = profile.email ?? null;
  if (!email) {
    const emailsRes = await fetch("https://api.github.com/user/emails", { headers });
    if (emailsRes.ok) {
      const emails = (await emailsRes.json()) as Array<{
        email: string;
        primary: boolean;
        verified: boolean;
      }>;
      const primary = emails.find((e) => e.primary && e.verified) ?? emails.find((e) => e.verified);
      email = primary?.email ?? null;
    }
  }

  if (!email) {
    throw new Error("Unable to determine a verified email from GitHub account");
  }

  return {
    provider: "GITHUB",
    providerId: String(profile.id),
    email,
    name: profile.name ?? profile.login,
    avatarUrl: profile.avatar_url ?? null,
  };
}
