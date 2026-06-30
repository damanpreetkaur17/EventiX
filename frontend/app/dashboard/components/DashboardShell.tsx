"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { useAuth, type AuthUser } from "@/app/providers/AuthProvider";

const sidebarLinks = [
  { label: "Overview", href: "/dashboard" },
  { label: "Events", href: "/events" },
  { label: "Clubs", href: "/dashboard/clubs" },
  { label: "Communities", href: "/dashboard/communities" },
  { label: "Calendar", href: "/dashboard/calendar" },
  { label: "Settings", href: "/dashboard/settings" },
];

function initialsOf(user: { name: string | null; email: string }) {
  const source = user.name?.trim() || user.email;
  return source.slice(0, 1).toUpperCase();
}

export default function DashboardShell({
  children,
  title,
  subtitle,
}: {
  children: (user: AuthUser) => ReactNode;
  title: string | ((user: AuthUser) => string);
  subtitle: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [loading, pathname, router, user]);

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-white" />
          <p className="text-sm text-gray-400">Loading your dashboard...</p>
        </div>
      </main>
    );
  }

  const resolvedTitle = typeof title === "function" ? title(user) : title;

  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_78%_22%,rgba(255,255,255,0.05),transparent_30%),linear-gradient(135deg,#000_0%,#111_48%,#030303_100%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="relative grid min-h-screen lg:grid-cols-[280px_1fr]">
        <motion.aside
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="border-b border-white/10 bg-black/70 px-4 py-5 shadow-[0_0_60px_rgba(255,255,255,0.08)] backdrop-blur-2xl lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:px-5"
        >
          <div className="flex h-full flex-col">
            <Link href="/" className="text-3xl font-black tracking-[0.12em] text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.35)]">
              EVENTIX
            </Link>
            <p className="mt-2 text-xs uppercase tracking-[0.35em] text-white/45">Command Center</p>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
              className="mt-8 flex items-center gap-3 rounded-3xl border border-white/15 bg-white/10 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_18px_45px_rgba(0,0,0,0.35)]"
            >
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt={user.name ?? user.email}
                  className="h-12 w-12 rounded-full border border-white/25 object-cover shadow-[0_0_22px_rgba(255,255,255,0.18)]"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-[radial-gradient(circle_at_30%_20%,white,rgba(255,255,255,0.78)_45%,rgba(120,120,120,0.35)_100%)] text-sm font-bold text-black shadow-[0_0_28px_rgba(255,255,255,0.18)]">
                  {initialsOf(user)}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{user.name ?? "EventiX member"}</p>
                <p className="truncate text-xs text-white/45">{user.email}</p>
              </div>
            </motion.div>

            <nav className="mt-8 grid gap-2">
              {sidebarLinks.map((link, index) => {
                const active = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.12 + index * 0.04, ease: "easeOut" }}
                    whileHover={{ x: 4 }}
                  >
                    <Link
                      href={link.href}
                      className={[
                        "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                        active
                          ? "border border-white/25 bg-white/15 text-white shadow-[0_0_24px_rgba(255,255,255,0.10)]"
                          : "border border-transparent text-gray-300 hover:border-white/15 hover:bg-white/10 hover:text-white",
                      ].join(" ")}
                    >
                      <span className={[
                        "h-2 w-2 rounded-full transition",
                        active ? "bg-white shadow-[0_0_14px_rgba(255,255,255,0.65)]" : "bg-white/25 group-hover:bg-white",
                      ].join(" ")} />
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <div className="mt-8 grid gap-3 lg:mt-auto">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Back to Home
              </Link>
              <button
                onClick={() => logout().then(() => router.replace("/login"))}
                className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black shadow-[0_0_28px_rgba(255,255,255,0.14)] transition hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          </div>
        </motion.aside>

        <section className="relative overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
          <div className="relative mx-auto flex w-full max-w-[1180px] flex-col gap-8">
            <motion.header
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.07] px-5 py-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:px-7"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.10),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.07),transparent_28%)]" />
              <div className="relative">
              <p className="text-sm uppercase tracking-[0.35em] text-white/45">Dashboard</p>
              <h1 className="mt-3 text-xl font-semibold tracking-tight text-white drop-shadow-[0_0_16px_rgba(255,255,255,0.18)] sm:text-3xl">
                Hey, {resolvedTitle}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base">{subtitle}</p>
              </div>
            </motion.header>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.06, ease: "easeOut" }}
            >
              {children(user)}
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  );
}
