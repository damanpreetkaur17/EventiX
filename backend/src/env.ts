import "dotenv/config";

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optional(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

const NODE_ENV = optional("NODE_ENV", "development");
const isProd = NODE_ENV === "production";

export const env = {
  nodeEnv: NODE_ENV,
  isProd,
  port: Number(optional("PORT", "4000")),

  databaseUrl: required("DATABASE_URL"),

  // Frontend origin used for CORS + OAuth redirects.
  frontendUrl: optional("FRONTEND_URL", "http://localhost:3000"),
  // Public base URL of this backend (used to build OAuth callback URLs).
  backendUrl: optional("BACKEND_URL", "http://localhost:4000"),

  jwt: {
    accessSecret: required("JWT_ACCESS_SECRET", isProd ? undefined : "dev-access-secret-change-me"),
    refreshSecret: required("JWT_REFRESH_SECRET", isProd ? undefined : "dev-refresh-secret-change-me"),
    accessTtl: optional("JWT_ACCESS_TTL", "15m"),
    refreshTtl: optional("JWT_REFRESH_TTL", "7d"),
  },

  // Cookie name for the refresh token (httpOnly).
  refreshCookieName: optional("REFRESH_COOKIE_NAME", "eventix_rt"),

  google: {
    clientId: optional("GOOGLE_CLIENT_ID"),
    clientSecret: optional("GOOGLE_CLIENT_SECRET"),
    get enabled() {
      return Boolean(this.clientId && this.clientSecret);
    },
  },

  github: {
    clientId: optional("GITHUB_CLIENT_ID"),
    clientSecret: optional("GITHUB_CLIENT_SECRET"),
    get enabled() {
      return Boolean(this.clientId && this.clientSecret);
    },
  },

  cloudinary: {
    cloudName: optional("CLOUDINARY_CLOUD_NAME"),
    apiKey: optional("CLOUDINARY_API_KEY"),
    apiSecret: optional("CLOUDINARY_API_SECRET"),
    folder: optional("CLOUDINARY_EVENT_FOLDER", "eventix/events"),
    get enabled() {
      return Boolean(this.cloudName && this.apiKey && this.apiSecret);
    },
  },
} as const;

export type Env = typeof env;
