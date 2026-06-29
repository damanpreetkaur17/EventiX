"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../providers/AuthProvider";

const LINKS = [
  { label: "Events", href: "#events" },
  { label: "Clubs", href: "#clubs" },
  { label: "Communities", href: "#communities" },
  { label: "Calendar", href: "#calendar" },
  { label: "About", href: "#about" },
];

function initialsOf(user: { name: string | null; email: string }): string {
  const source = user.name?.trim() || user.email;
  return source.slice(0, 1).toUpperCase();
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeInOut" }}
      className="fixed inset-x-0 top-4 z-50 px-3 sm:px-5 lg:px-6"
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between rounded-[1.5rem] border border-white/10 bg-transparent px-4 py-3 sm:px-6 lg:px-8">
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
          {!loading && user ? (
            <div className="ml-2 flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-2">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt={user.name ?? user.email}
                    className="h-8 w-8 rounded-full border border-white/15 object-cover"
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#facc15] text-sm font-semibold text-black">
                    {initialsOf(user)}
                  </span>
                )}
                <span className="max-w-[10rem] truncate text-sm text-gray-200">
                  {user.name ?? user.email}
                </span>
              </Link>
              <button
                onClick={() => logout().then(() => router.replace("/login"))}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Logout
              </button>
            </div>
          ) : (
            <motion.div whileHover={{ y: -2, scale: 1.02 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="ml-2">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-black shadow-sm"
              >
                Login
              </Link>
            </motion.div>
          )}
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
          <div className="flex flex-col gap-2 rounded-[1.25rem] border border-white/10 bg-transparent p-4">
            {LINKS.map((link) => (
              <a key={link.label} href={link.href} className="px-2 py-2 text-sm text-gray-200 transition hover:text-white">
                {link.label}
              </a>
            ))}
            {!loading && user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="mt-2 inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    logout().then(() => router.replace("/login"));
                  }}
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white"
                >
                  Logout ({user.name ?? user.email})
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </motion.header>
  );
}
