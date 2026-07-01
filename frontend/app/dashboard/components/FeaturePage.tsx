"use client";

import DashboardShell from "./DashboardShell";

export default function FeaturePage({
  title,
  subtitle,
  label,
  actionLabel,
  emptyTitle,
  emptyDescription,
}: {
  title: string;
  subtitle: string;
  label: string;
  actionLabel: string;
  emptyTitle: string;
  emptyDescription: string;
}) {
  return (
    <DashboardShell title={title} subtitle={subtitle}>
      {() => (
        <div className="grid gap-6">
          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">{label}</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
              </div>
              <button className="self-start rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gray-200 sm:self-auto">
                {actionLabel}
              </button>
            </div>

            <div className="mt-8 rounded-xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <span className="h-2 w-2 rounded-full bg-white/50" />
              </div>
              <h3 className="text-base font-semibold text-white">{emptyTitle}</h3>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-400">
                {emptyDescription}
              </p>
            </div>
          </section>
        </div>
      )}
    </DashboardShell>
  );
}
