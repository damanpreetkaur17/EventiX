"use client";

import { CalendarDays, MapPin } from "lucide-react";

interface EventCardProps {
  image: string;
  title: string;
  university: string;
  date: string;
  category: string;
}

export default function EventCard({
  image,
  title,
  university,
  date,
  category,
}: EventCardProps) {
  return (
    <div
      onMouseEnter={(e) => {
        const marquee = e.currentTarget.closest(".animate-marquee");
        const reverse = e.currentTarget.closest(".animate-marquee-reverse");

        if (marquee) {
          (marquee as HTMLElement).style.animationPlayState = "paused";
        }

        if (reverse) {
          (reverse as HTMLElement).style.animationPlayState = "paused";
        }
      }}
      onMouseLeave={(e) => {
        const marquee = e.currentTarget.closest(".animate-marquee");
        const reverse = e.currentTarget.closest(".animate-marquee-reverse");

        if (marquee) {
          (marquee as HTMLElement).style.animationPlayState = "running";
        }

        if (reverse) {
          (reverse as HTMLElement).style.animationPlayState = "running";
        }
      }}
      className="
        group
        relative
        w-[340px]
        overflow-hidden
        rounded-[28px]
        border
        border-white/10
        bg-[#090909]
        transition-all
        duration-500
        hover:-translate-y-2
        hover:border-white/25
        hover:shadow-[0_20px_60px_rgba(255,255,255,0.08)]
        flex-shrink-0
      "
    >
      {/* Image */}
      <div className="relative h-[220px] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-700
            group-hover:scale-110
          "
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        {/* Category */}
        <span
          className="
            absolute
            left-5
            top-5
            rounded-full
            border
            border-white/20
            bg-black/60
            px-4
            py-1.5
            text-[11px]
            uppercase
            tracking-[0.25em]
            text-white
            backdrop-blur-xl
          "
        >
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3
          className="
            text-2xl
            font-semibold
            tracking-tight
            text-white
            transition-colors
            group-hover:text-zinc-100
          "
        >
          {title}
        </h3>

        <div className="mt-5 space-y-3 text-sm text-zinc-400">
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-zinc-500" />
            <span>{date}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-zinc-500" />
            <span>{university}</span>
          </div>
        </div>

        <div
          className="
            mt-6
            h-px
            w-12
            bg-white/20
            transition-all
            duration-500
            group-hover:w-full
            group-hover:bg-white/60
          "
        />
      </div>
    </div>
  );
}