"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useAuth } from "../providers/AuthProvider";
import { ApiError, eventsApi, type EventItem } from "@/lib/api";

const categories = ["Workshop", "Cultural", "Competition", "Seminar", "Sports", "Community"];

function formatEventDate(value: string): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function initialStartAt(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setMinutes(0, 0, 0);
  return date.toISOString().slice(0, 16);
}

function EventCard({ event }: { event: EventItem }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] shadow-[0_20px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-white/[0.04]">
        {event.posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.posterUrl}
            alt={`${event.title} poster`}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_35%_20%,rgba(250,204,21,0.18),transparent_32%),linear-gradient(135deg,#111,#030303)]">
            <span className="rounded-full border border-white/15 bg-black/50 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/55">
              EventiX
            </span>
          </div>
        )}
        <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/65 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          {event.category}
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div>
          <p className="text-sm text-[#facc15]">{formatEventDate(event.startAt)}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">{event.title}</h2>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-400">{event.description}</p>
        </div>

        <div className="grid gap-3 rounded-2xl border border-white/10 bg-black/35 p-4 text-sm text-gray-300">
          <div className="flex items-center justify-between gap-4">
            <span className="text-white/45">Location</span>
            <span className="text-right text-white">{event.location}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-white/45">Organizer</span>
            <span className="text-right text-white">{event.organizerName}</span>
          </div>
          {event.capacity && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-white/45">Capacity</span>
              <span className="text-right text-white">{event.capacity} seats</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-gray-500">Posted by {event.creator.name ?? event.creator.email}</p>
          {event.registrationUrl ? (
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-200"
            >
              Register
            </a>
          ) : (
            <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/55">
              RSVP soon
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function EventsPage() {
  const { user, accessToken, loading } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [now] = useState(() => Date.now());

  const upcomingCount = useMemo(
    () => events.filter((event) => new Date(event.startAt).getTime() >= now).length,
    [events, now],
  );

  useEffect(() => {
    eventsApi
      .list()
      .then(({ events }) => setEvents(events))
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Could not load events right now."),
      )
      .finally(() => setFetching(false));
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!accessToken) {
      setError("Please sign in before creating an event.");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const poster = formData.get("poster");
    if (poster instanceof File && poster.size === 0) {
      formData.delete("poster");
    }

    setSubmitting(true);
    try {
      const { event: created } = await eventsApi.create(formData, accessToken);
      setEvents((current) => [...current, created].sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt)));
      form.reset();
      setSuccess("Event published with poster storage ready on Cloudinary.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create this event.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      <Navbar />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(250,204,21,0.14),transparent_28%),radial-gradient(circle_at_82%_24%,rgba(255,255,255,0.08),transparent_30%),linear-gradient(135deg,#000_0%,#111_48%,#030303_100%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:48px_48px]" />

      <section id="events" className="relative mx-auto w-full max-w-[1500px] px-5 py-10 sm:px-8 lg:px-12">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-white/45">Live Feed</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Events</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-gray-400">
            Sorted by start date so the next opportunity is always closest.
          </p>
        </div>

        {fetching ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-10 text-center text-gray-400">
            Loading events...
          </div>
        ) : events.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-white/20 bg-white/[0.04] p-10 text-center">
            <h3 className="text-xl font-semibold text-white">No events published yet</h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-400">
              Be the first to launch the board with a workshop, club meetup, or cultural night.
            </p>
          </div>
        )}
      </section>

    </main>
  );
}
