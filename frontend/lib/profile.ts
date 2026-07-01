import axios from "axios";
import { API_URL } from "./api";

const apiHost = API_URL || "http://localhost:4000";
const API_BASE = apiHost.replace(/\/$/, "") + "/api";

// Types
export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  username: string | null;
  phone: string | null;
  bio: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  department: string | null;
  course: string | null;
  year: number | null;
  rollNumber: string | null;
  github: string | null;
  linkedin: string | null;
  portfolio: string | null;
  instagram: string | null;
  skills: string[];
  interests: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PublicProfile {
  id: string;
  name: string | null;
  username: string | null;
  bio: string | null;
  avatarUrl: string | null;
  department: string | null;
  course: string | null;
  year: number | null;
  github: string | null;
  linkedin: string | null;
  portfolio: string | null;
  instagram: string | null;
  skills: string[];
  interests: string[];
}

export interface ProfileData {
  name?: string;
  username?: string;
  phone?: string;
  bio?: string;
  gender?: string;
  dateOfBirth?: string;
  department?: string;
  course?: string;
  year?: number;
  rollNumber?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  instagram?: string;
  skills?: string[];
  interests?: string[];
}

// API Service
export const profileAPI = {
  // Get current user's full profile
  async getMyProfile(token: string): Promise<UserProfile> {
    const response = await axios.get(`${API_BASE}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  // Get another user's public profile
  async getProfile(userId: string, token: string): Promise<PublicProfile> {
    const response = await axios.get(`${API_BASE}/profile/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  // Update profile
  async updateProfile(data: ProfileData, token: string): Promise<UserProfile> {
    const response = await axios.put(`${API_BASE}/profile`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  // Upload avatar
  async uploadAvatar(file: File, token: string): Promise<UserProfile> {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await axios.post(`${API_BASE}/profile/avatar`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },
};

// React Hook
import { useCallback, useState } from "react";

export function useProfile(token: string | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!token) {
      setError("Not authenticated");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await profileAPI.getMyProfile(token);
      setProfile(data);
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateProfile = useCallback(
    async (data: ProfileData) => {
      if (!token) {
        setError("Not authenticated");
        return null;
      }

      setLoading(true);
      setError(null);
      try {
        const updated = await profileAPI.updateProfile(data, token);
        setProfile(updated);
        return updated;
      } catch (err) {
        const message = axios.isAxiosError(err)
          ? err.response?.data?.error || err.message
          : String(err);
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const uploadAvatar = useCallback(
    async (file: File) => {
      if (!token) {
        setError("Not authenticated");
        return null;
      }

      setLoading(true);
      setError(null);
      try {
        const updated = await profileAPI.uploadAvatar(file, token);
        setProfile(updated);
        return updated;
      } catch (err) {
        const message = axios.isAxiosError(err)
          ? err.response?.data?.error || err.message
          : String(err);
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    uploadAvatar,
  };
}
