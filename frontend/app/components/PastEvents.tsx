"use client";

import { motion } from "framer-motion";
import EventCard from "./EventCard";

const events = [
  {
    image: "/events/hackhazards.jpg",
    title: "Hack Hazards 2026",
    university: "Chandigarh University",
    date: "March 2026",
    category: "Hackathon",
  },
  {
    image: "/events/google.jpg",
    title: "Google Solution Challenge",
    university: "Google DSC",
    date: "February 2026",
    category: "Competition",
  },
  {
    image: "/events/workshop.jpg",
    title: "AI Bootcamp",
    university: "Chitkara University",
    date: "January 2026",
    category: "Workshop",
  },
  {
    image: "/events/musicnight.jpg",
    title: "Music Night",
    university: "PEC Chandigarh",
    date: "December 2025",
    category: "Cultural",
  },
  {
    image: "/events/culturalfest.jpg",
    title: "Cultural Fest",
    university: "IIT Delhi",
    date: "October 2025",
    category: "Festival",
  },
  {
    image: "/events/startup.jpg",
    title: "Startup Expo",
    university: "IIT Bombay",
    date: "August 2025",
    category: "Startup",
  },
];

const row1 = [...events, ...events];
const row2 = [...events].reverse();
const row2Loop = [...row2, ...row2];

export default function PastEvents() {
  return (
    <section className="relative overflow-hidden bg-black py-24">

      {/* Glow */}
      <div className="absolute left-1/2 top-20 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-white/5 blur-[150px]" />

      {/* Grid */}
      <div
        className="
        absolute inset-0 opacity-[0.025]
        [background-image:linear-gradient(rgba(255,255,255,.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.2)_1px,transparent_1px)]
        [background-size:70px_70px]
      "
      />

      <div className="relative z-10">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .7 }}
          className="mx-auto max-w-7xl px-8 mb-14"
        >
          <p className="text-center uppercase tracking-[0.45em] text-xs text-zinc-500">
            CAMPUS MOMENTS
          </p>

          <h2 className="mt-4 text-center text-5xl font-semibold tracking-tight text-white">
            Events That Made An Impact
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-center text-lg leading-8 text-zinc-400">
            Relive hackathons, cultural festivals and unforgettable
            experiences from universities across India.
          </p>
        </motion.div>

        {/* Left Fade */}

        <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-48 bg-gradient-to-r from-black to-transparent" />

        {/* Right Fade */}

        <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-48 bg-gradient-to-l from-black to-transparent" />

        {/* Top Row */}

        <div className="overflow-hidden">

          <div className="animate-marquee">

            {row1.map((event, index) => (
              <EventCard
                key={index}
                image={event.image}
                title={event.title}
                university={event.university}
                date={event.date}
                category={event.category}
              />
            ))}

          </div>

        </div>

        {/* Bottom Row */}

        <div className="overflow-hidden mt-8">

          <div className="animate-marquee-reverse">

            {row2Loop.map((event, index) => (
              <EventCard
                key={index}
                image={event.image}
                title={event.title}
                university={event.university}
                date={event.date}
                category={event.category}
              />
            ))}

          </div>

        </div>

      </div>

    </section>
  );
}