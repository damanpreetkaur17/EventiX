"use client";

import { useRef, useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import DashboardShell from "../components/DashboardShell";
import { useAuth, type AuthUser } from "@/app/providers/AuthProvider";
import { useProfile } from "@/lib/profile";
import type { ProfileData, UserProfile } from "@/lib/profile";

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
  const { user, accessToken } = useAuth();

  // Basic info state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Profile data state (from new API)
  const [profileData, setProfileData] = useState<ProfileData>({});
  const [fullProfile, setFullProfile] = useState<UserProfile | null>(null);

  // UI state
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use the profile hook
  const { profile, loading, fetchProfile, updateProfile, uploadAvatar } = useProfile(accessToken);

  // Load profile on mount
  useEffect(() => {
    if (accessToken) {
      fetchProfile();
    }
  }, [accessToken, fetchProfile]);

  // Update form when profile is loaded
  useEffect(() => {
    if (profile) {
      setFullProfile(profile);
      setProfileData({
        name: profile.name || "",
        username: profile.username || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        gender: profile.gender || "",
        dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split("T")[0] : "",
        department: profile.department || "",
        course: profile.course || "",
        year: profile.year || undefined,
        rollNumber: profile.rollNumber || "",
        github: profile.github || "",
        linkedin: profile.linkedin || "",
        portfolio: profile.portfolio || "",
        instagram: profile.instagram || "",
        skills: profile.skills || [],
        interests: profile.interests || [],
      });
      if (profile.avatarUrl) {
        setAvatarPreview(profile.avatarUrl);
      }
    }
  }, [profile]);

  function handleFile(file: File) {
    const preview = URL.createObjectURL(file);
    setAvatarPreview(preview);
    // Upload avatar immediately
    uploadAvatar(file);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword && newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (!accessToken) {
      setError("You are not signed in.");
      return;
    }

    setSaving(true);

    try {
      const updated = await updateProfile(profileData);
      if (!updated) {
        throw new Error("Profile update failed.");
      }

      setFullProfile(updated);
      setProfileData({
        name: updated.name || "",
        username: updated.username || "",
        phone: updated.phone || "",
        bio: updated.bio || "",
        gender: updated.gender || "",
        dateOfBirth: updated.dateOfBirth ? updated.dateOfBirth.split("T")[0] : "",
        department: updated.department || "",
        course: updated.course || "",
        rollNumber: updated.rollNumber || "",
        github: updated.github || "",
        linkedin: updated.linkedin || "",
        portfolio: updated.portfolio || "",
        instagram: updated.instagram || "",
        skills: updated.skills || [],
        interests: updated.interests || [],
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update profile";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  const handleProfileInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : value,
    }));
  };

  const handleNumberInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : parseInt(value, 10),
    }));
  };

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
                    id="name"
                    label="Display Name"
                    value={profileData.name ?? ""}
                    onChange={handleProfileInputChange}
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

              {/* Extended Profile - Education */}
              <Card>
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">Education</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Academic Info</h3>

                <div className="mt-6 grid gap-4">
                  <FieldRow
                    id="department"
                    label="Department"
                    value={profileData.department ?? ""}
                    onChange={handleProfileInputChange}
                    placeholder="e.g., Computer Science"
                  />
                  <FieldRow
                    id="course"
                    label="Course"
                    value={profileData.course ?? ""}
                    onChange={handleProfileInputChange}
                    placeholder="e.g., B.Tech"
                  />
                  <FieldRow
                    id="rollNumber"
                    label="Roll Number"
                    value={profileData.rollNumber ?? ""}
                    onChange={handleProfileInputChange}
                    placeholder="e.g., 2021A1PS001"
                  />
                </div>
              </Card>

              {/* Extended Profile - Additional Info */}
              <Card>
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">Additional</p>
                <h3 className="mt-2 text-xl font-semibold text-white">More About You</h3>

                <div className="mt-6 grid gap-4">
                  <FieldRow
                    id="username"
                    label="Username"
                    value={profileData.username ?? ""}
                    onChange={handleProfileInputChange}
                    placeholder="3-30 characters"
                  />
                  <FieldRow
                    id="phone"
                    label="Phone"
                    type="tel"
                    value={profileData.phone ?? ""}
                    onChange={handleProfileInputChange}
                    placeholder="+91 XXXXX XXXXX"
                  />
                  <FieldRow
                    id="gender"
                    label="Gender"
                    value={profileData.gender ?? ""}
                    onChange={handleProfileInputChange}
                    placeholder="Your gender"
                  />
                  <FieldRow
                    id="dateOfBirth"
                    label="Date of Birth"
                    type="date"
                    value={profileData.dateOfBirth ?? ""}
                    onChange={handleProfileInputChange}
                  />
                </div>
              </Card>

              {/* Extended Profile - Social Links */}
              <Card>
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">Connect</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Social Links</h3>

                <div className="mt-6 grid gap-4">
                  <FieldRow
                    id="github"
                    label="GitHub"
                    value={profileData.github ?? ""}
                    onChange={handleProfileInputChange}
                    placeholder="GitHub username"
                  />
                  <FieldRow
                    id="linkedin"
                    label="LinkedIn"
                    type="url"
                    value={profileData.linkedin ?? ""}
                    onChange={handleProfileInputChange}
                    placeholder="https://linkedin.com/in/..."
                  />
                  <FieldRow
                    id="portfolio"
                    label="Portfolio"
                    type="url"
                    value={profileData.portfolio ?? ""}
                    onChange={handleProfileInputChange}
                    placeholder="https://yourportfolio.com"
                  />
                  <FieldRow
                    id="instagram"
                    label="Instagram"
                    type="url"
                    value={profileData.instagram ?? ""}
                    onChange={handleProfileInputChange}
                    placeholder="https://instagram.com/..."
                  />
                </div>
              </Card>
            </div>

            {/* Extended Profile - Bio and Skills */}
            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              <Card>
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">About</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Bio</h3>

                <div className="mt-6">
                  <label htmlFor="bio" className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={profileData.bio ?? ""}
                    onChange={handleProfileInputChange}
                    placeholder="Tell us about yourself (max 500 characters)"
                    rows={4}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-colors focus:border-white/30 focus:bg-white/[0.07]"
                  />
                  <p className="mt-2 text-xs text-white/35">
                    {(profileData.bio || "").length}/500 characters
                  </p>
                </div>
              </Card>

              <Card>
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">Skills</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Your Skills</h3>

                <div className="mt-6">
                  <label htmlFor="skills" className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                    Skills (comma-separated)
                  </label>
                  <input
                    id="skills"
                    name="skills"
                    type="text"
                    value={(profileData.skills || []).join(", ")}
                    onChange={(e) => {
                      const skills = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                      handleProfileInputChange({
                        ...e,
                        target: { ...e.target, name: "skills", value: skills.join(", ") },
                      });
                      setProfileData((prev) => ({ ...prev, skills }));
                    }}
                    placeholder="React, TypeScript, Node.js"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-colors focus:border-white/30 focus:bg-white/[0.07]"
                  />
                  <p className="mt-2 text-xs text-white/35">
                    {(profileData.skills || []).length}/50 skills
                  </p>
                </div>
              </Card>
            </div>

            {/* Interests */}
            <div className="mt-6">
              <Card>
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">Interests</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Your Interests</h3>

                <div className="mt-6">
                  <label htmlFor="interests" className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                    Interests (comma-separated)
                  </label>
                  <input
                    id="interests"
                    name="interests"
                    type="text"
                    value={(profileData.interests || []).join(", ")}
                    onChange={(e) => {
                      const interests = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                      handleProfileInputChange({
                        ...e,
                        target: { ...e.target, name: "interests", value: interests.join(", ") },
                      });
                      setProfileData((prev) => ({ ...prev, interests }));
                    }}
                    placeholder="Web Development, AI, Open Source"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-colors focus:border-white/30 focus:bg-white/[0.07]"
                  />
                  <p className="mt-2 text-xs text-white/35">
                    {(profileData.interests || []).length}/50 interests
                  </p>
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
                    setProfileData((prev) => ({
                      ...prev,
                      name: user.name ?? "",
                    }));
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