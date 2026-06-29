"use client";

import { motion, type Variants } from "framer-motion";
import DashboardShell from "./components/DashboardShell";

const stats = [
  { label: "Saved Events", value: "0", helper: "Events you bookmark will count here." },
  { label: "Club Invites", value: "0", helper: "Incoming club invitations will appear here." },
  { label: "Upcoming", value: "0", helper: "Registered upcoming events will appear here." },
  { label: "Communities", value: "0", helper: "Joined communities will count here." },
];

const bars = ["Events", "Clubs", "Calendar"];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function DashboardPage() {
  return (
    <DashboardShell
      title={(user) => user.name ?? "EventiX member"}
      subtitle="A clean command center for events, clubs, communities, and campus activity."
    >
      {(user) => (
        <div className="grid gap-6">
          <section>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  custom={index}
                  initial="hidden"
                  animate="show"
                  variants={cardVariants}
                  whileHover={{ y: -6, scale: 1.015 }}
                  className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/[0.07] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.28)] backdrop-blur-xl"
                >
                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/12 blur-2xl" />
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-white/55">{stat.label}</p>
                      <p className="mt-3 text-5xl font-semibold tracking-tight text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.18)]">{stat.value}</p>
                    </div>
                    <div className="relative flex h-14 w-14 items-center justify-center">
                      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 64 64" aria-hidden>
                        <path
                          d="M32 4 56 18v28L32 60 8 46V18L32 4Z"
                          fill="rgba(255,255,255,0.05)"
                          stroke="rgba(255,255,255,0.65)"
                          strokeWidth="1.4"
                        />
                      </svg>
                      <span className="h-2 w-2 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.75)]" />
                    </div>
                  </div>
                  <p className="mt-5 text-xs leading-5 text-gray-400">{stat.helper}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16, ease: "easeOut" }}
              className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.07] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-8"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.08),transparent_32%),radial-gradient(circle_at_84%_72%,rgba(255,255,255,0.06),transparent_34%)]" />
              <div className="relative">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-white/45">Analytics</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Activity Overview</h2>
                </div>
                <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70">
                  No data yet
                </span>
              </div>

              <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-black/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <div className="relative h-72">
                  <div className="absolute inset-0 grid grid-rows-5 opacity-70">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="border-t border-white/10" />
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_55%,rgba(255,255,255,0.10),transparent_28%),radial-gradient(circle_at_72%_48%,rgba(255,255,255,0.07),transparent_32%)]" />
                  <svg className="absolute inset-0 h-full w-full" viewBox="0 0 760 280" preserveAspectRatio="none" aria-hidden>
                    <path
                      d="M30 220 C90 150 140 115 205 150 C260 178 285 60 348 112 C410 165 438 118 490 135 C550 153 570 225 620 168 C665 116 700 180 735 202"
                      fill="url(#activityFill)"
                      opacity="0.48"
                    />
                    <motion.path
                      d="M30 220 C90 150 140 115 205 150 C260 178 285 60 348 112 C410 165 438 118 490 135 C550 153 570 225 620 168 C665 116 700 180 735 202"
                      fill="none"
                      stroke="url(#activityStroke)"
                      strokeWidth="3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.4, ease: "easeInOut" }}
                    />
                    <defs>
                      <linearGradient id="activityStroke" x1="0" x2="1" y1="0" y2="0">
                        <stop stopColor="#ffffff" />
                        <stop offset="0.52" stopColor="#d4d4d4" />
                        <stop offset="1" stopColor="#737373" />
                      </linearGradient>
                      <linearGradient id="activityFill" x1="0" x2="0" y1="0" y2="1">
                        <stop stopColor="rgba(255,255,255,0.35)" />
                        <stop offset="1" stopColor="rgba(255,255,255,0)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-2xl border border-white/10 bg-black/75 px-5 py-4 text-center shadow-[0_0_34px_rgba(255,255,255,0.08)] backdrop-blur">
                      <p className="text-sm font-semibold text-white">No activity to chart yet</p>
                      <p className="mt-1 text-xs text-white/45">Real event engagement will render here.</p>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </motion.div>

            <div className="grid gap-6">
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.22, ease: "easeOut" }}
                className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.07] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.28)] backdrop-blur-xl"
              >
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
                <p className="relative text-sm uppercase tracking-[0.35em] text-white/45">Distribution</p>
                <div className="mt-8 flex items-center justify-center">
                  <motion.div
                    className="relative flex h-52 w-52 items-center justify-center rounded-full border border-white/10 bg-[conic-gradient(from_180deg,rgba(255,255,255,0.65)_0deg,rgba(180,180,180,0.55)_90deg,rgba(255,255,255,0.08)_90deg,rgba(255,255,255,0.08)_360deg)] shadow-[0_0_55px_rgba(255,255,255,0.08)]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="absolute h-40 w-40 rounded-full border border-white/10 bg-black" />
                    <div className="relative flex h-28 w-28 flex-col items-center justify-center rounded-full border border-white/10 bg-black">
                      <span className="text-4xl font-semibold text-white">0</span>
                      <span className="mt-1 text-xs uppercase tracking-[0.25em] text-white/45">Total</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.28, ease: "easeOut" }}
                className="rounded-[2rem] border border-white/15 bg-white/[0.07] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.28)] backdrop-blur-xl"
              >
                <p className="text-sm uppercase tracking-[0.35em] text-white/45">Progress</p>
                <div className="mt-6 grid gap-4">
                  {bars.map((label, index) => (
                    <div key={label}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-gray-300">{label}</span>
                        <span className="text-white/45">0%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-white via-gray-200 to-gray-500"
                          initial={{ width: 0 }}
                          animate={{ width: 0 }}
                          transition={{ duration: 0.7, delay: 0.35 + index * 0.08 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          <motion.section
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.34, ease: "easeOut" }}
            className="rounded-[2rem] border border-white/15 bg-white/[0.07] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-8"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-white/45">Your timeline</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Upcoming events</h2>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-white/20 bg-white/[0.04] p-8 text-center">
              <h3 className="text-lg font-semibold text-white">No upcoming events yet</h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-400">
                Your saved and registered events will appear here once real event data is connected.
              </p>
            </div>
          </motion.section>
        </div>
      )}
    </DashboardShell>
  );
}
