"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth, type AuthUser } from "@/app/providers/AuthProvider";

const sidebarLinks = [
  { label: "Overview", href: "/dashboard" },
  { label: "Registered Events", href: "/dashboard/registered-events" },
  { label: "Communities", href: "/dashboard/communities" },
  { label: "Calendar", href: "/dashboard/calendar" },
  { label: "Settings", href: "/dashboard/settings" },
  { label: "Profile", href: "/dashboard/profile" },
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
    <main className="min-h-screen bg-black text-white">
      <div className="relative grid min-h-screen lg:grid-cols-[280px_1fr]">
        {/* ── Sidebar ── */}
        <aside className="border-b border-white/10 bg-[#0a0a0a] px-4 py-5 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:px-5">
          <div className="flex h-full flex-col">
            <Link
              href="/"
              className="text-3xl font-black tracking-[0.12em] text-white"
            >
              EVENTIX
            </Link>
            <p className="mt-2 text-xs uppercase tracking-[0.35em] text-white/45">
              Command Center
            </p>

            {/* User card */}
            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt={user.name ?? user.email}
                  className="h-12 w-12 rounded-full border border-white/20 object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white text-sm font-bold text-black">
                  {initialsOf(user)}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {user.name ?? "EventiX member"}
                </p>
                <p className="truncate text-xs text-white/45">{user.email}</p>
              </div>
            </div>

            {/* Nav links */}
            <nav className="mt-8 grid gap-1">
              {sidebarLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={[
                      "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-white/10 text-white"
                        : "text-gray-400 hover:bg-white/5 hover:text-white",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "h-1.5 w-1.5 rounded-full",
                        active ? "bg-white" : "bg-white/25",
                      ].join(" ")}
                    />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom actions */}
            <div className="mt-8 grid gap-3 lg:mt-auto">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Back to Home
              </Link>
              <button
                onClick={() => logout().then(() => router.replace("/login"))}
                className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <section className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-8">
            {/* Page header */}
            <header className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-5 sm:px-7">
              <p className="text-xs uppercase tracking-[0.35em] text-white/45">Dashboard</p>
              <h1 className="mt-3 text-xl font-semibold tracking-tight text-white sm:text-3xl">
                Hey, {resolvedTitle}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
                {subtitle}
              </p>
            </header>

            {children(user)}
          </div>
        </section>
      </div>
    </main>
  );
}
