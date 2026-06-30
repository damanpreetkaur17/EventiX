"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Journey() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/journey-bg.png')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Left Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-transparent" />

      {/* Content */}

      <div className="relative z-20 mx-auto flex min-h-screen max-w-7xl items-center px-8">

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >

          {/* Small Label */}

          <p className="mb-5 text-xs uppercase tracking-[0.45em] text-zinc-500">
            CAMPUS JOURNEY
          </p>

          {/* Heading */}

          <h1 className="text-6xl font-semibold leading-[0.95] tracking-[-0.05em] text-white">

            Your Journey.

            <br />

            <span className="text-zinc-300">
              Your Growth.
            </span>

            <br />

            Your Legacy.

          </h1>

          {/* Description */}

          <p className="mt-8 max-w-md text-lg leading-8 text-zinc-400">
            Every opportunity on campus,
            <br />
            connected in one place.
          </p>

          {/* Button */}

          <div className="mt-12">

            <Link
              href="/events"
              className="
              inline-flex
              items-center
              gap-3
              rounded-full
              bg-white
              px-8
              py-4
              text-black
              font-medium
              transition-all
              duration-300
              hover:scale-105
              hover:bg-zinc-200
              "
            >
              Explore Events
              <span className="text-xl">→</span>
            </Link>

          </div>

        </motion.div>

      </div>

    </section>
  );
}