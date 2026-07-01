"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import DashboardShell from "../components/DashboardShell";
import { useAuth, type AuthUser } from "@/app/providers/AuthProvider";

/* ─── helpers ─────────────────────────────────────────────────────────────── */

function initialsOf(user: { name: string | null; email: string }) {
  const src = user.name?.trim() || user.email;
  return src.slice(0, 2).toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/* ─── sub-components ──────────────────────────────────────────────────────── */

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function FieldRow({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
  hint,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <div className="grid gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        className={[
          "w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white",
          "placeholder-white/25 outline-none transition-colors",
          disabled
            ? "cursor-not-allowed border-white/8 opacity-50"
            : "border-white/10 focus:border-white/30 focus:bg-white/[0.07]",
        ].join(" ")}
      />
      {hint && <p className="text-xs leading-5 text-white/35">{hint}</p>}
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center">
      <span className="text-xl font-semibold text-white">{value}</span>
      <span className="text-xs uppercase tracking-[0.2em] text-white/45">{label}</span>
    </div>
  );
}

function AvatarBlock({
  user,
  preview,
  onFile,
}: {
  user: AuthUser;
  preview: string | null;
  onFile: (f: File) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {preview || user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview ?? user.avatarUrl!}
            alt={user.name ?? user.email}
            className="h-24 w-24 rounded-full border border-white/20 object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white text-lg font-bold text-black">
            {initialsOf(user)}
          </div>
        )}

        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black transition-colors hover:bg-white/10"
          aria-label="Change avatar"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
          </svg>
        </button>
      </div>

      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />

      <div className="text-center">
        <p className="text-sm font-semibold text-white">{user.name ?? "EventiX member"}</p>
        <p className="text-xs text-white/45">{user.email}</p>
      </div>
    </div>
  );
}

/* ─── main page ───────────────────────────────────────────────────────────── */

export default function ProfilePage() {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFile(file: File) {
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword && newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <DashboardShell
      title="Profile"
      subtitle="Manage your identity, avatar, and security credentials."
    >
      {(user) => (
        <div className="grid gap-6">
          {/* ── Avatar + identity ── */}
          <Card>
            <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:gap-10">
              <AvatarBlock user={user} preview={avatarPreview} onFile={handleFile} />

              <div className="hidden w-px self-stretch bg-white/10 sm:block" />

              <div className="flex flex-1 flex-col gap-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-white/45">Account</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">
                    {user.name ?? "EventiX member"}
                  </h2>
                  <p className="mt-1 text-sm text-white/45">{user.email}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <StatPill
                    label="Provider"
                    value={user.provider === "local" ? "Email" : user.provider}
                  />
                  <StatPill label="Events" value="0" />
                  <StatPill label="Clubs" value="0" />
                  <StatPill
                    label="Member since"
                    value={formatDate(user.createdAt).split(",")[0]}
                  />
                </div>

                <p className="text-xs text-white/35">
                  Member since {formatDate(user.createdAt)} · ID{" "}
                  {user.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
            </div>
          </Card>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 xl:grid-cols-2">
              {/* Personal info */}
              <Card>
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">Personal</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Account Info</h3>

                <div className="mt-6 grid gap-4">
                  <FieldRow
                    id="display-name"
                    label="Display Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                  />
                  <FieldRow
                    id="email"
                    label="Email Address"
                    type="email"
                    value={user.email}
                    disabled
                    hint="Email cannot be changed here. Contact support if needed."
                  />
                  <FieldRow
                    id="provider"
                    label="Sign-in Method"
                    value={
                      user.provider === "local" ? "Email & Password" : user.provider
                    }
                    disabled
                  />
                </div>
              </Card>

              {/* Security */}
              <Card>
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">Security</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Change Password</h3>
                <p className="mt-1 text-sm text-white/40">
                  Leave blank to keep your current password.
                </p>

                <div className="mt-6 grid gap-4">
                  <FieldRow
                    id="current-password"
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={user.provider !== "local"}
                    hint={
                      user.provider !== "local"
                        ? `Signed in via ${user.provider} — no password to change.`
                        : undefined
                    }
                  />
                  <FieldRow
                    id="new-password"
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={user.provider !== "local"}
                  />
                  <FieldRow
                    id="confirm-password"
                    label="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={user.provider !== "local"}
                  />
                </div>
              </Card>
            </div>

            {/* Save bar */}
            <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-5">
              <div>
                {error ? (
                  <p className="text-sm font-medium text-red-400">{error}</p>
                ) : saved ? (
                  <p className="text-sm font-medium text-green-400">
                    ✓ Changes saved successfully.
                  </p>
                ) : (
                  <p className="text-sm text-white/40">
                    Changes are saved to your EventiX account.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setName(user.name ?? "");
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setAvatarPreview(null);
                    setError(null);
                  }}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Discard
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gray-200 disabled:opacity-60"
                >
                  {saving && (
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                  )}
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>
          </form>

          {/* ── Danger zone ── */}
          <Card>
            <p className="text-xs uppercase tracking-[0.35em] text-red-400/70">Danger Zone</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Delete Account</h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
              Permanently delete your EventiX account and all associated data. This action is
              irreversible and cannot be undone.
            </p>
            <div className="mt-5">
              <button
                type="button"
                className="rounded-xl border border-red-500/25 bg-red-500/8 px-5 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:border-red-400/40 hover:bg-red-500/12"
              >
                Delete My Account
              </button>
            </div>
          </Card>
        </div>
      )}
    </DashboardShell>
  );
}