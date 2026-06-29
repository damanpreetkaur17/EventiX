"use client";

import FeaturePage from "../components/FeaturePage";

export default function CalendarPage() {
  return (
    <FeaturePage
      title="Calendar"
      subtitle="A focused schedule view for your upcoming events and campus commitments."
      label="Schedule"
      actionLabel="Add Reminder"
      emptyTitle="No scheduled items yet"
      emptyDescription="Saved events and reminders will appear here after calendar data is connected."
    />
  );
}
