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

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  username: string | null;
  phone: string | null;
  bio: string | null;
  gender: string | null;
  dateOfBirth: Date | null;
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
  createdAt: Date;
  updatedAt: Date;
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

export interface ValidationError {
  field: string;
  message: string;
}
