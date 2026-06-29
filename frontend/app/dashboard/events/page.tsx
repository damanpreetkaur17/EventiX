"use client";

import FeaturePage from "../components/FeaturePage";

export default function EventsPage() {
  return (
    <FeaturePage
      title="Events"
      subtitle="Discover, track, and manage the campus events that matter to you."
      label="Event Board"
      actionLabel="Create Event"
      emptyTitle="No events yet"
      emptyDescription="Events created or saved by this user will appear here once real event data is connected."
    />
  );
}
