import { prisma } from "../prisma.js";
import type { ProfileData, PublicProfile, UserProfile } from "./types.js";

export async function getCurrentUserProfile(userId: string): Promise<UserProfile | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      username: true,
      phone: true,
      bio: true,
      gender: true,
      dateOfBirth: true,
      department: true,
      course: true,
      year: true,
      rollNumber: true,
      github: true,
      linkedin: true,
      portfolio: true,
      instagram: true,
      skills: true,
      interests: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user as UserProfile | null;
}

export async function getPublicProfile(userId: string): Promise<PublicProfile | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      username: true,
      bio: true,
      avatarUrl: true,
      department: true,
      course: true,
      year: true,
      github: true,
      linkedin: true,
      portfolio: true,
      instagram: true,
      skills: true,
      interests: true,
    },
  });

  return user as PublicProfile | null;
}

export async function updateUserProfile(
  userId: string,
  data: ProfileData,
): Promise<UserProfile | null> {
  const updateData: Record<string, unknown> = {};

  if (data.name !== undefined) {
    updateData.name = data.name || null;
  }
  if (data.username !== undefined) {
    updateData.username = data.username || null;
  }
  if (data.phone !== undefined) {
    updateData.phone = data.phone || null;
  }
  if (data.bio !== undefined) {
    updateData.bio = data.bio || null;
  }
  if (data.gender !== undefined) {
    updateData.gender = data.gender || null;
  }
  if (data.dateOfBirth !== undefined) {
    updateData.dateOfBirth = data.dateOfBirth ? new Date(data.dateOfBirth) : null;
  }
  if (data.department !== undefined) {
    updateData.department = data.department || null;
  }
  if (data.course !== undefined) {
    updateData.course = data.course || null;
  }
  if (data.year !== undefined) {
    updateData.year = data.year || null;
  }
  if (data.rollNumber !== undefined) {
    updateData.rollNumber = data.rollNumber || null;
  }
  if (data.github !== undefined) {
    updateData.github = data.github || null;
  }
  if (data.linkedin !== undefined) {
    updateData.linkedin = data.linkedin || null;
  }
  if (data.portfolio !== undefined) {
    updateData.portfolio = data.portfolio || null;
  }
  if (data.instagram !== undefined) {
    updateData.instagram = data.instagram || null;
  }
  if (data.skills !== undefined) {
    updateData.skills = data.skills || [];
  }
  if (data.interests !== undefined) {
    updateData.interests = data.interests || [];
  }

  if (Object.keys(updateData).length === 0) {
    const existing = await getCurrentUserProfile(userId);
    return existing;
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      username: true,
      phone: true,
      bio: true,
      gender: true,
      dateOfBirth: true,
      department: true,
      course: true,
      year: true,
      rollNumber: true,
      github: true,
      linkedin: true,
      portfolio: true,
      instagram: true,
      skills: true,
      interests: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user as UserProfile;
}

export async function updateUserAvatar(userId: string, avatarUrl: string): Promise<UserProfile | null> {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { avatarUrl },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      username: true,
      phone: true,
      bio: true,
      gender: true,
      dateOfBirth: true,
      department: true,
      course: true,
      year: true,
      rollNumber: true,
      github: true,
      linkedin: true,
      portfolio: true,
      instagram: true,
      skills: true,
      interests: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user as UserProfile;
}

export async function isUsernameAvailable(username: string, excludeUserId?: string): Promise<boolean> {
  const trimmed = username.trim();
  const existing = await prisma.user.findFirst({
    where: {
      username: {
        equals: trimmed,
        mode: "insensitive",
      },
      ...(excludeUserId && { NOT: { id: excludeUserId } }),
    },
    select: { id: true },
  });

  return !existing;
}

export async function getUserByUsername(username: string): Promise<PublicProfile | null> {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username.trim(),
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      username: true,
      bio: true,
      avatarUrl: true,
      department: true,
      course: true,
      year: true,
      github: true,
      linkedin: true,
      portfolio: true,
      instagram: true,
      skills: true,
      interests: true,
    },
  });

  return user as PublicProfile | null;
}
