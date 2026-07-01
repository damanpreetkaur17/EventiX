"use client";

import DashboardShell from "./components/DashboardShell";

const stats = [
  { label: "Saved Events", value: "0", helper: "Events you bookmark will count here." },
  { label: "Club Invites", value: "0", helper: "Incoming club invitations will appear here." },
  { label: "Upcoming", value: "0", helper: "Registered upcoming events will appear here." },
  { label: "Communities", value: "0", helper: "Joined communities will count here." },
];

const bars = ["Events", "Clubs", "Calendar"];

export default function DashboardPage() {
  return (
    <DashboardShell
      title={(user) => user.name ?? "EventiX member"}
      subtitle="A clean command center for events, clubs, communities, and campus activity."
    >
      {() => (
        <div className="grid gap-6">
          {/* Stats row */}
          <section>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                >
                  <p className="text-sm text-white/55">{stat.label}</p>
                  <p className="mt-3 text-5xl font-semibold tracking-tight text-white">
                    {stat.value}
                  </p>
                  <p className="mt-4 text-xs leading-5 text-gray-400">{stat.helper}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Activity + side panels */}
          <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            {/* Activity chart */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-white/45">Analytics</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Activity Overview</h2>
                </div>
                <span className="self-start rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/60 sm:self-auto">
                  No data yet
                </span>
              </div>

              <div className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-black/60 p-4">
                <div className="relative h-72">
                  {/* Grid lines */}
                  <div className="absolute inset-0 grid grid-rows-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="border-t border-white/8" />
                    ))}
                  </div>
                  {/* Placeholder chart line */}
                  <svg
                    className="absolute inset-0 h-full w-full"
                    viewBox="0 0 760 280"
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    <path
                      d="M30 220 C90 150 140 115 205 150 C260 178 285 60 348 112 C410 165 438 118 490 135 C550 153 570 225 620 168 C665 116 700 180 735 202"
                      fill="rgba(255,255,255,0.06)"
                    />
                    <path
                      d="M30 220 C90 150 140 115 205 150 C260 178 285 60 348 112 C410 165 438 118 490 135 C550 153 570 225 620 168 C665 116 700 180 735 202"
                      fill="none"
                      stroke="rgba(255,255,255,0.35)"
                      strokeWidth="2"
                    />
                  </svg>
                  {/* Empty state overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-xl border border-white/10 bg-black/80 px-5 py-4 text-center">
                      <p className="text-sm font-semibold text-white">No activity to chart yet</p>
                      <p className="mt-1 text-xs text-white/45">
                        Real event engagement will render here.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              {/* Distribution ring */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">Distribution</p>
                <div className="mt-8 flex items-center justify-center">
                  <div className="relative flex h-52 w-52 items-center justify-center rounded-full border border-white/10 bg-[conic-gradient(from_180deg,rgba(255,255,255,0.35)_0deg,rgba(180,180,180,0.25)_90deg,rgba(255,255,255,0.05)_90deg,rgba(255,255,255,0.05)_360deg)]">
                    <div className="absolute h-40 w-40 rounded-full border border-white/10 bg-black" />
                    <div className="relative flex h-28 w-28 flex-col items-center justify-center rounded-full border border-white/10 bg-black">
                      <span className="text-4xl font-semibold text-white">0</span>
                      <span className="mt-1 text-xs uppercase tracking-[0.25em] text-white/45">
                        Total
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress bars */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">Progress</p>
                <div className="mt-6 grid gap-4">
                  {bars.map((label) => (
                    <div key={label}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-gray-300">{label}</span>
                        <span className="text-white/45">0%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-0 rounded-full bg-gradient-to-r from-white via-gray-200 to-gray-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Upcoming events */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/45">Your timeline</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Upcoming events</h2>
            </div>

            <div className="mt-6 rounded-xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center">
              <h3 className="text-base font-semibold text-white">No upcoming events yet</h3>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-400">
                Your saved and registered events will appear here once real event data is connected.
              </p>
            </div>
          </section>
        </div>
      )}
    </DashboardShell>
  );
}
