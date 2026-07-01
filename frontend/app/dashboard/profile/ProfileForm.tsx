"use client";

import { useState, useEffect } from "react";
import { useProfile } from "@/lib/profile";
import type { ProfileData, UserProfile } from "@/lib/profile";

interface ProfileFormProps {
  token: string;
  onSuccess?: (profile: UserProfile) => void;
  onError?: (error: string) => void;
}

export default function ProfileForm({ token, onSuccess, onError }: ProfileFormProps) {
  const { profile, loading, error, fetchProfile, updateProfile } = useProfile(token);

  const [formData, setFormData] = useState<ProfileData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      setFormData({
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
    }
  }, [profile]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : parseInt(value, 10),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");

    const result = await updateProfile(formData);
    setIsSubmitting(false);

    if (result) {
      setSuccessMessage("Profile updated successfully!");
      onSuccess?.(result);
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      onError?.(error || "Failed to update profile");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}

      {successMessage && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">{successMessage}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username || ""}
            onChange={handleInputChange}
            placeholder="3-30 characters"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone || ""}
            onChange={handleInputChange}
            placeholder="10-15 digits"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select
            name="gender"
            value={formData.gender || ""}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth || ""}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Department</label>
          <input
            type="text"
            name="department"
            value={formData.department || ""}
            onChange={handleInputChange}
            placeholder="e.g., Computer Science"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Course</label>
          <input
            type="text"
            name="course"
            value={formData.course || ""}
            onChange={handleInputChange}
            placeholder="e.g., B.Tech"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Year</label>
          <select
            name="year"
            value={formData.year || ""}
            onChange={handleNumberChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select...</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
            <option value="5">5th Year</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Roll Number</label>
          <input
            type="text"
            name="rollNumber"
            value={formData.rollNumber || ""}
            onChange={handleInputChange}
            placeholder="e.g., 2021A1PS001"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">GitHub</label>
          <input
            type="text"
            name="github"
            value={formData.github || ""}
            onChange={handleInputChange}
            placeholder="GitHub username"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">LinkedIn</label>
          <input
            type="url"
            name="linkedin"
            value={formData.linkedin || ""}
            onChange={handleInputChange}
            placeholder="https://linkedin.com/in/username"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Portfolio</label>
          <input
            type="url"
            name="portfolio"
            value={formData.portfolio || ""}
            onChange={handleInputChange}
            placeholder="https://yourportfolio.com"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Instagram</label>
          <input
            type="url"
            name="instagram"
            value={formData.instagram || ""}
            onChange={handleInputChange}
            placeholder="https://instagram.com/username"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          name="bio"
          value={formData.bio || ""}
          onChange={handleInputChange}
          placeholder="Tell us about yourself (max 500 characters)"
          rows={4}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <p className="text-xs text-gray-500 mt-1">{(formData.bio || "").length}/500 characters</p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded"
      >
        {isSubmitting ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}
