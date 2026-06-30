"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-black border-t border-white/10">

      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-white/5 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-8 py-16">

        <div className="grid items-center gap-12 lg:grid-cols-[1fr_520px]">

          {/* LEFT */}

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >

            <h2 className="text-5xl font-black tracking-tight text-white">
              EVENTIX
            </h2>

            <p className="mt-6 max-w-md text-lg leading-8 text-zinc-400">
              Connecting students with hackathons,
              workshops, clubs and opportunities —
              all in one intelligent platform.
            </p>

            {/* Social */}

            <div className="mt-10 flex flex-wrap gap-3">

              {["Instagram", "LinkedIn", "GitHub", "Discord"].map((item) => (

                <Link
                  key={item}
                  href="#"
                  className="
                  rounded-full
                  border
                  border-white/10
                  px-5
                  py-2.5
                  text-sm
                  text-zinc-400
                  transition-all
                  duration-300
                  hover:border-white
                  hover:bg-white
                  hover:text-black
                  "
                >
                  {item}
                </Link>

              ))}

            </div>

          </motion.div>

          {/* RIGHT */}

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="
            rounded-[28px]
            border
            border-white/10
            bg-white/[0.03]
            p-8
            backdrop-blur-xl
            "
          >

            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              STAY UPDATED
            </p>

            <h3 className="mt-4 text-3xl font-semibold leading-tight text-white">
              Never miss
              <br />
              your next event.
            </h3>

            <p className="mt-4 text-base leading-7 text-zinc-400">
              Get notified about hackathons,
              workshops and campus opportunities.
            </p>

            {/* Email */}

            <div className="mt-8 flex flex-col gap-3 md:flex-row">

              <input
                type="email"
                placeholder="Enter your university email"
                className="
                h-14
                flex-1
                rounded-full
                border
                border-white/10
                bg-transparent
                px-6
                text-white
                placeholder:text-zinc-500
                outline-none
                transition
                focus:border-white
                "
              />

              <button
                className="
                h-14
                rounded-full
                bg-white
                px-8
                font-medium
                text-black
                transition-all
                duration-300
                hover:scale-105
                hover:bg-zinc-200
                "
              >
                Subscribe
              </button>

            </div>

            <p className="mt-4 text-sm text-zinc-500">
              No spam. Unsubscribe anytime.
            </p>

          </motion.div>

        </div>

        {/* Divider */}

        <div className="my-14 h-px bg-white/10" />

        {/* Bottom */}

        <div className="flex flex-col items-center justify-between gap-4 text-sm md:flex-row">

          <p className="text-zinc-500">
            © 2026 Eventix. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-6">

            <Link
              href="/privacy"
              className="text-zinc-500 transition hover:text-white"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="text-zinc-500 transition hover:text-white"
            >
              Terms
            </Link>

            <Link
              href="/about"
              className="text-zinc-500 transition hover:text-white"
            >
              About
            </Link>

            <Link
              href="/contact"
              className="text-zinc-500 transition hover:text-white"
            >
              Contact
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}