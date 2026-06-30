"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";

const stats = [
  {
    value: 150,
    suffix: "+",
    label: "Campus Events",
    description: "Hackathons, workshops and competitions every year.",
  },
  {
    value: 60,
    suffix: "+",
    label: "Student Clubs",
    description: "Technical, cultural, sports and creative communities.",
  },
  {
    value: 8500,
    suffix: "+",
    label: "Students Connected",
    description: "Building one unified campus experience.",
  },
  {
    value: 24,
    suffix: "/7",
    label: "Live Updates",
    description: "Never miss registrations or announcements.",
  },
];

export default function Stats() {
  return (
    <section className="relative overflow-hidden bg-black py-40">

      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white/5 blur-[180px]" />

      {/* Grid */}
      <div
        className="
          absolute inset-0 opacity-[0.03]
          [background-image:linear-gradient(rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.3)_1px,transparent_1px)]
          [background-size:80px_80px]
        "
      />

      <div className="relative z-10 mx-auto max-w-7xl px-8">

        {/* Small Heading */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="
            text-center
            uppercase
            tracking-[0.55em]
            text-zinc-500
            text-xs
            font-medium
          "
        >
          CAMPUS AT A GLANCE
        </motion.p>

        {/* Main Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="
            mt-6
            text-center
            text-5xl
            font-semibold
            tracking-[-0.04em]
            leading-none
            text-white
          "
        >
          Numbers that define your campus.
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="
            mx-auto
            mt-6
            max-w-2xl
            text-center
            text-[18px]
            leading-8
            font-light
            tracking-tight
            text-zinc-400
          "
        >
          Everything happening across your university,
          brought together in one intelligent platform.
        </motion.p>

        {/* Stats */}

        <div className="mt-24 grid grid-cols-1 gap-14 md:grid-cols-2 lg:grid-cols-4">

          {stats.map((item, index) => (

            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
              }}
              className="group text-center"
            >

              {/* Number */}

              <div
                className="
                  text-7xl
                  font-semibold
                  tracking-[-0.06em]
                  text-white
                "
              >
                <CountUp
                  end={item.value}
                  duration={2}
                  enableScrollSpy
                  scrollSpyOnce
                />
                {item.suffix}
              </div>

              {/* Label */}

              <h3
                className="
                  mt-5
                  text-lg
                  uppercase
                  tracking-[0.18em]
                  font-medium
                  text-zinc-200
                "
              >
                {item.label}
              </h3>

              {/* Divider */}

              <div className="mx-auto mt-5 h-px w-16 bg-white/20 transition-all duration-500 group-hover:w-28 group-hover:bg-white" />

              {/* Description */}

              <p
                className="
                  mt-5
                  text-[15px]
                  leading-7
                  font-light
                  text-zinc-500
                "
              >
                {item.description}
              </p>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}