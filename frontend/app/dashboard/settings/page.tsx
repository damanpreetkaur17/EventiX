"use client";

import FeaturePage from "../components/FeaturePage";

export default function SettingsPage() {
  return (
    <FeaturePage
      title="Settings"
      subtitle="Manage your account, notifications, and privacy preferences."
      label="Preferences"
      actionLabel="Save Changes"
      emptyTitle="No settings fields yet"
      emptyDescription="Profile, notification, and privacy controls will appear here once those forms are implemented."
    />
  );
}
