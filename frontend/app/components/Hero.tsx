"use client";

import { motion } from "framer-motion";

const headingLines = ["Every Event.", "Every Connection.", "One Platform."];

export default function Hero() {
  return (
    <section aria-label="Hero" className="relative isolate min-h-screen overflow-hidden bg-[#000] text-white">
      <div className="absolute inset-0 bg-black" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1600px] items-center px-8 py-28 sm:px-10 lg:px-12 xl:px-16">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,0.5fr)_minmax(0,0.5fr)] lg:gap-0">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="relative z-40 max-w-2xl pr-0 lg:pr-10 lg:mr-[-20vw]"
          >
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: "easeInOut" }}
              className="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-gray-400"
            >
              Welcome to Eventix
            </motion.p>

            <h1 className="text-4xl font-semibold leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {headingLines.map((line, index) => (
                <motion.span
                  key={line}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 + index * 0.15, ease: "easeInOut" }}
                  className="block"
                >
                  {line}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: "easeInOut" }}
              className="mt-6 max-w-xl text-base leading-8 text-gray-300 sm:text-lg"
            >
              The modern platform that connects students with clubs, workshops, competitions, cultural festivals, and every opportunity on campus.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeInOut" }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <motion.a
                href="/events"
                whileHover={{ scale: 1.03, y: -2 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white px-6 py-3 text-sm font-semibold text-black transition"
              >
                Explore Events
              </motion.a>

              <motion.a
                href="/events#create"
                whileHover={{ scale: 1.03, y: -2 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Create Event
              </motion.a>
            </motion.div>
          </motion.div>

          {/* left content column only; video handled as absolute full-right panel below */}
        </div>
      </div>
      
      {/* Absolute right-side video panel that reaches the viewport edge */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
        className="absolute inset-y-0 right-[-14vw] z-10 w-[82vw] lg:right-[-14vw] lg:w-[82vw]"
      >
        <div className="relative h-full w-full overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/hero.jpg"
            className="absolute right-0 bottom-0 h-full w-auto max-w-none object-cover object-right transition-transform duration-700 ease-in-out"
          >
            <source src="/video.mp4" type="video/mp4" />
          </video>
          {/* Blend the left edge into black so text can overlap naturally */}
          <div className="absolute left-0 top-0 h-full w-[28%] bg-gradient-to-r from-black to-transparent pointer-events-none" />
        </div>
      </motion.div>
    </section>
  );
}
