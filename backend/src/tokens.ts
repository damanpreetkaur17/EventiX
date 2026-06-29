import crypto from "node:crypto";
import jwt, { type SignOptions } from "jsonwebtoken";
import type { Response } from "express";
import { env } from "./env.js";
import { prisma } from "./prisma.js";

export interface AccessTokenPayload {
  sub: string;
  email: string;
  type: "access";
}

interface RefreshTokenPayload {
  sub: string;
  jti: string;
  type: "refresh";
}

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function signAccessToken(user: { id: string; email: string }): string {
  const payload: AccessTokenPayload = {
    sub: user.id,
    email: user.email,
    type: "access",
  };
  return jwt.sign(payload, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessTtl as SignOptions["expiresIn"],
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.jwt.accessSecret) as AccessTokenPayload;
  if (decoded.type !== "access") {
    throw new Error("Invalid token type");
  }
  return decoded;
}

/**
 * Issues a refresh token (JWT) and persists its hash so it can be rotated and
 * revoked server-side. Returns the raw token to be sent to the client.
 */
export async function issueRefreshToken(userId: string): Promise<string> {
  const jti = crypto.randomUUID();
  const payload: RefreshTokenPayload = { sub: userId, jti, type: "refresh" };
  const token = jwt.sign(payload, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshTtl as SignOptions["expiresIn"],
  });

  const decoded = jwt.decode(token) as { exp: number };
  await prisma.refreshToken.create({
    data: {
      tokenHash: sha256(token),
      userId,
      expiresAt: new Date(decoded.exp * 1000),
    },
  });

  return token;
}

/**
 * Validates a refresh token against the DB record and rotates it: the old
 * token is revoked and a brand new one is issued. Throws on any failure.
 */
export async function rotateRefreshToken(
  token: string,
): Promise<{ userId: string; token: string }> {
  const decoded = jwt.verify(token, env.jwt.refreshSecret) as RefreshTokenPayload;
  if (decoded.type !== "refresh") {
    throw new Error("Invalid token type");
  }

  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash: sha256(token) },
  });

  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw new Error("Refresh token is no longer valid");
  }

  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });

  const newToken = await issueRefreshToken(decoded.sub);
  return { userId: decoded.sub, token: newToken };
}

/** Revokes a single refresh token (used on logout). Never throws. */
export async function revokeRefreshToken(token: string): Promise<void> {
  try {
    await prisma.refreshToken.updateMany({
      where: { tokenHash: sha256(token), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  } catch {
    // Best-effort: a malformed/expired token simply has nothing to revoke.
  }
}

function refreshTtlMs(): number {
  const decoded = jwt.decode(
    jwt.sign({ t: 1 }, env.jwt.refreshSecret, {
      expiresIn: env.jwt.refreshTtl as SignOptions["expiresIn"],
    }),
  ) as { iat: number; exp: number };
  return (decoded.exp - decoded.iat) * 1000;
}

export function setRefreshCookie(res: Response, token: string): void {
  res.cookie(env.refreshCookieName, token, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? "none" : "lax",
    path: "/",
    maxAge: refreshTtlMs(),
  });
}

export function clearRefreshCookie(res: Response): void {
  res.clearCookie(env.refreshCookieName, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? "none" : "lax",
    path: "/",
  });
}

interface OAuthStatePayload {
  nonce: string;
  provider: string;
  type: "oauth_state";
}

/**
 * Stateless CSRF state: a short-lived signed token instead of a cookie, so it
 * survives the cross-site OAuth redirect chain (and the dev proxy) reliably.
 */
export function signOAuthState(provider: string): string {
  const payload: OAuthStatePayload = {
    nonce: crypto.randomUUID(),
    provider,
    type: "oauth_state",
  };
  return jwt.sign(payload, env.jwt.accessSecret, { expiresIn: "10m" });
}

export function verifyOAuthState(
  state: string | undefined,
  provider: string,
): boolean {
  if (!state) return false;
  try {
    const decoded = jwt.verify(state, env.jwt.accessSecret) as OAuthStatePayload;
    return decoded.type === "oauth_state" && decoded.provider === provider;
  } catch {
    return false;
  }
}
