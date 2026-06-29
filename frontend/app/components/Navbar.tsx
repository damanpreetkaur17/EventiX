"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const LINKS = [
  { label: "Events", href: "#events" },
  { label: "Clubs", href: "#clubs" },
  { label: "Communities", href: "#communities" },
  { label: "Calendar", href: "#calendar" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeInOut" }}
      className="fixed inset-x-0 top-4 z-50 px-3 sm:px-5 lg:px-6"
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between rounded-[1.5rem] border border-white/10 bg-black/40 px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-sm font-semibold tracking-[0.35em] text-white">EVENTIX</div>
          <div className="hidden text-sm text-gray-300 md:block">Connect • Discover • Belong</div>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {LINKS.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              whileHover={{ y: -2, scale: 1.02 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="text-sm text-gray-200 transition hover:text-white"
            >
              {link.label}
            </motion.a>
          ))}
          <motion.a
            href="#login"
            whileHover={{ y: -2, scale: 1.02 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="text-sm text-gray-200 transition hover:text-white"
          >
            Login
          </motion.a>
          <motion.a
            href="#get-started"
            whileHover={{ y: -2, scale: 1.02 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="ml-2 inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-black shadow-sm"
          >
            Get Started
          </motion.a>
        </nav>

        <div className="md:hidden">
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 p-2 text-white transition hover:bg-white/20"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="mx-auto mt-3 max-w-7xl px-0 md:hidden">
          <div className="flex flex-col gap-2 rounded-[1.25rem] border border-white/10 bg-black/60 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl">
            {LINKS.map((link) => (
              <a key={link.label} href={link.href} className="px-2 py-2 text-sm text-gray-200 transition hover:text-white">
                {link.label}
              </a>
            ))}
            <a href="#login" className="px-2 py-2 text-sm text-gray-200 transition hover:text-white">
              Login
            </a>
            <a href="#get-started" className="mt-2 inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">
              Get Started
            </a>
          </div>
        </div>
      )}
    </motion.header>
  );
}
