"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { profileAPI } from "@/lib/profile";
import type { PublicProfile } from "@/lib/profile";

interface PublicProfileViewProps {
  userId: string;
  token: string;
}

export default function PublicProfileView({ userId, token }: PublicProfileViewProps) {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileAPI.getProfile(userId, token);
        setProfile(data);
        setError(null);
      } catch (err) {
        setError("Failed to load profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, token]);

  if (loading) {
    return <div className="text-center py-12">Loading profile...</div>;
  }

  if (error || !profile) {
    return (
      <div className="text-center py-12 text-red-600">
        {error || "Profile not found"}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      {/* Header */}
      <div className="flex items-start gap-6 mb-8">
        {profile.avatarUrl && (
          <div className="relative w-24 h-24 flex-shrink-0">
            <Image
              src={profile.avatarUrl}
              alt={profile.name || "Avatar"}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{profile.name || "User"}</h1>
          {profile.username && <p className="text-gray-600">@{profile.username}</p>}
          {profile.bio && <p className="text-gray-700 mt-2">{profile.bio}</p>}
        </div>
      </div>

      {/* Education */}
      {(profile.department || profile.course || profile.year) && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Education</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {profile.department && (
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-medium">{profile.department}</p>
              </div>
            )}
            {profile.course && (
              <div>
                <p className="text-sm text-gray-600">Course</p>
                <p className="font-medium">{profile.course}</p>
              </div>
            )}
            {profile.year && (
              <div>
                <p className="text-sm text-gray-600">Year</p>
                <p className="font-medium">{profile.year}st Year</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Social Links */}
      {(profile.github || profile.linkedin || profile.portfolio || profile.instagram) && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Connect</h2>
          <div className="flex flex-wrap gap-3">
            {profile.github && (
              <a
                href={`https://github.com/${profile.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
            )}
            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded transition"
              >
                <span className="text-blue-700 font-medium">LinkedIn</span>
              </a>
            )}
            {profile.portfolio && (
              <a
                href={profile.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 rounded transition"
              >
                <span className="text-purple-700 font-medium">Portfolio</span>
              </a>
            )}
            {profile.instagram && (
              <a
                href={profile.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 hover:bg-pink-200 rounded transition"
              >
                <span className="text-pink-700 font-medium">Instagram</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Skills */}
      {profile.skills && profile.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Interests */}
      {profile.interests && profile.interests.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <span
                key={interest}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
