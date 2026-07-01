"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/app/providers/AuthProvider";
import { authApi, ApiError, type OAuthProviders } from "@/lib/api";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.8.54-1.84.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.96 10.71A5.41 5.41 0 0 1 3.68 9c0-.59.1-1.17.28-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l3-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3 2.33C4.67 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.1 3.29 9.42 7.86 10.95.58.1.79-.25.79-.56v-2.1c-3.2.7-3.88-1.36-3.88-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.53 11.53 0 0 0 23.5 12C23.5 5.74 18.27.5 12 .5Z" />
    </svg>
  );
}

type Mode = "login" | "register";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, loading, login, register } = useAuth();

  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [providers, setProviders] = useState<OAuthProviders>({ google: false, github: false });

  const redirectTo = params.get("redirect") || "/dashboard";

  useEffect(() => {
    authApi.providers().then(setProviders).catch(() => {});
  }, []);

  useEffect(() => {
    const oauthError = params.get("message");
    if (params.get("status") === "error" && oauthError) {
      setError(oauthError);
    }
  }, [params]);

  useEffect(() => {
    if (!loading && user) {
      router.replace(redirectTo);
    }
  }, [loading, user, router, redirectTo]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register({ email, password, name: name.trim() || undefined });
      }
      router.replace(redirectTo);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleOAuth(provider: "google" | "github") {
    setError(null);
    if (!providers[provider]) {
      setError(
        `${provider === "google" ? "Google" : "GitHub"} sign-in isn't configured yet. Add the API credentials to enable it.`,
      );
      return;
    }
    window.location.href = authApi.oauthUrl(provider);
  }

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-12 text-white">
      {/* Ambient glow consistent with the site's yellow accent */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(250,204,21,0.12),_transparent_60%)] blur-2xl" />
        <div className="absolute bottom-[-15%] right-[-10%] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.06),_transparent_60%)] blur-2xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-block text-sm font-semibold tracking-[0.35em] text-white transition hover:text-[#facc15]"
          >
            EVENTIX
          </Link>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </p>
          <p className="mt-2 text-sm text-gray-400">
            {mode === "login"
              ? "Sign in to connect, discover, and belong."
              : "Join the campus event ecosystem in seconds."}
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="mb-6 grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              className="col-span-1 inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              <GoogleIcon />
              <span className="hidden sm:inline">Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleOAuth("github")}
              className="col-span-2 inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              <GithubIcon />
              <span>GitHub</span>
            </button>
          </div>

          <div className="mb-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xs uppercase tracking-[0.2em] text-gray-500">or</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-gray-400">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ada Lovelace"
                  autoComplete="name"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-[#facc15]/60 focus:ring-2 focus:ring-[#facc15]/30"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-gray-400">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                autoComplete="email"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-[#facc15]/60 focus:ring-2 focus:ring-[#facc15]/30"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-gray-400">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "register" ? "At least 6 characters" : "••••••••"}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-[#facc15]/60 focus:ring-2 focus:ring-[#facc15]/30"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-300"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: submitting ? 1 : 1.01 }}
              whileTap={{ scale: submitting ? 1 : 0.99 }}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Please wait…"
                : mode === "login"
                  ? "Sign in"
                  : "Create account"}
            </motion.button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          {mode === "login" ? "New to Eventix?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError(null);
            }}
            className="font-semibold text-[#facc15] transition hover:text-yellow-300"
          >
            {mode === "login" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </motion.div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <LoginInner />
    </Suspense>
  );
}
