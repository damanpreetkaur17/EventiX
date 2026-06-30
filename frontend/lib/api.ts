const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

export const API_URL =
  configuredApiUrl && configuredApiUrl !== "/" ? configuredApiUrl.replace(/\/$/, "") : "";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  provider: string;
  createdAt: string;
}

export interface AuthResult {
  accessToken: string;
  user: AuthUser;
}

export interface OAuthProviders {
  google: boolean;
  github: boolean;
}

export interface EventCreator {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  organizerName: string;
  startAt: string;
  endAt: string | null;
  capacity: number | null;
  registrationUrl: string | null;
  posterUrl: string | null;
  createdAt: string;
  creator: EventCreator;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers ?? {}),
    },
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message =
      (data && typeof data.error === "string" && data.error) ||
      `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status);
  }

  return data as T;
}

async function requestForm<T>(
  path: string,
  formData: FormData,
  accessToken: string,
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message =
      (data && typeof data.error === "string" && data.error) ||
      `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status);
  }

  return data as T;
}

export const authApi = {
  register(input: { email: string; password: string; name?: string }) {
    return request<AuthResult>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  login(input: { email: string; password: string }) {
    return request<AuthResult>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  refresh() {
    return request<AuthResult>("/api/auth/refresh", { method: "POST" });
  },

  logout() {
    return request<void>("/api/auth/logout", { method: "POST" });
  },

  me(accessToken: string) {
    return request<{ user: AuthUser }>("/api/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  providers() {
    return request<OAuthProviders>("/api/auth/providers");
  },

  oauthUrl(provider: "google" | "github") {
    return `${API_URL}/api/auth/${provider}`;
  },
};

export const eventsApi = {
  list() {
    return request<{ events: EventItem[] }>("/api/events");
  },

  create(formData: FormData, accessToken: string) {
    return requestForm<{ event: EventItem }>("/api/events", formData, accessToken);
  },
};
