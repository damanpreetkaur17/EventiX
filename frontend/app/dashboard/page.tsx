"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useAuth } from "@/app/providers/AuthProvider";

const stats = [
  { label: "Saved Events", value: "12" },
  { label: "Club Invites", value: "4" },
  { label: "Upcoming", value: "7" },
];

const upcomingEvents = [
  {
    title: "AI Builders Night",
    meta: "Tomorrow • Innovation Lab",
  },
  {
    title: "Cultural Fest Planning",
    meta: "Friday • Student Arena",
  },
  {
    title: "Hackathon Orientation",
    meta: "Next Monday • Auditorium",
  },
];

function initialsOf(user: { name: string | null; email: string }) {
  const source = user.name?.trim() || user.email;
  return source.slice(0, 1).toUpperCase();
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/dashboard");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-[#facc15]" />
          <p className="text-sm text-gray-400">Loading your dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-16rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(250,204,21,0.14),_transparent_60%)] blur-2xl" />
        <div className="absolute bottom-[-14rem] right-[-10rem] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.07),_transparent_60%)] blur-2xl" />
      </div>

      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          className="flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between"
        >
          <Link href="/" className="text-sm font-semibold tracking-[0.35em] text-white transition hover:text-[#facc15]">
            EVENTIX
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Home
            </Link>
            <button
              onClick={() => logout().then(() => router.replace("/login"))}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeInOut" }}
          className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"
        >
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt={user.name ?? user.email}
                  className="h-20 w-20 rounded-full border border-white/15 object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#facc15] text-3xl font-semibold text-black">
                  {initialsOf(user)}
                </div>
              )}

              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-[#facc15]">Welcome back</p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {user.name ?? "EventiX member"}
                </h1>
                <p className="mt-2 text-sm text-gray-400">{user.email}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-3xl font-semibold text-white">{stat.value}</p>
                  <p className="mt-1 text-sm text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Account</p>
            <div className="mt-5 space-y-4 text-sm">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <span className="text-gray-400">Provider</span>
                <span className="font-medium text-white">{user.provider}</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <span className="text-gray-400">Member Since</span>
                <span className="font-medium text-white">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-400">Status</span>
                <span className="rounded-full bg-[#facc15]/15 px-3 py-1 text-xs font-semibold text-[#facc15]">
                  Active
                </span>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08, ease: "easeInOut" }}
          className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-8"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#facc15]">Your timeline</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Upcoming events</h2>
            </div>
            <Link href="/" className="text-sm font-semibold text-gray-300 transition hover:text-white">
              Explore more
            </Link>
          </div>

          <div className="mt-6 grid gap-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.title}
                className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-white">{event.title}</p>
                  <p className="mt-1 text-sm text-gray-400">{event.meta}</p>
                </div>
                <button className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
                  View
                </button>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </main>
  );
}
