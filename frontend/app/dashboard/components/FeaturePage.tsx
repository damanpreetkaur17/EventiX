"use client";

import { motion } from "framer-motion";
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
          <motion.section
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.07] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-8"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_86%_20%,rgba(255,255,255,0.06),transparent_28%)]" />
            <div className="relative">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-white/45">{label}</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">{title}</h2>
              </div>
              <motion.button
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black shadow-[0_0_28px_rgba(255,255,255,0.14)] transition hover:bg-gray-200"
              >
                {actionLabel}
              </motion.button>
            </div>

            <div className="mt-8 rounded-2xl border border-dashed border-white/20 bg-white/[0.04] p-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-black/70 shadow-[0_0_34px_rgba(255,255,255,0.08)]">
                <span className="h-2 w-2 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.75)]" />
              </div>
              <h3 className="text-lg font-semibold text-white">{emptyTitle}</h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-400">
                {emptyDescription}
              </p>
            </div>
            </div>
          </motion.section>
        </div>
      )}
    </DashboardShell>
  );
}
