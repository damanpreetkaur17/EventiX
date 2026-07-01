import type { ProfileData, ValidationError } from "./types.js";

export function validateUsername(username: string): ValidationError | null {
  if (!username || username.trim().length === 0) {
    return null; // Optional field
  }

  const trimmed = username.trim();
  if (trimmed.length < 3) {
    return { field: "username", message: "Username must be at least 3 characters" };
  }
  if (trimmed.length > 30) {
    return { field: "username", message: "Username must be at most 30 characters" };
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    return {
      field: "username",
      message: "Username can only contain letters, numbers, underscores, and hyphens",
    };
  }
  return null;
}

export function validateName(name: string): ValidationError | null {
  if (!name || name.trim().length === 0) {
    return null; // Optional field
  }

  const trimmed = name.trim();
  if (trimmed.length > 100) {
    return { field: "name", message: "Name must be at most 100 characters" };
  }
  return null;
}

export function validatePhone(phone: string): ValidationError | null {
  if (!phone || phone.trim().length === 0) {
    return null; // Optional field
  }

  const trimmed = phone.trim();
  const digitsOnly = trimmed.replace(/\D/g, "");
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return { field: "phone", message: "Phone must be between 10-15 digits" };
  }
  return null;
}

export function validateBio(bio: string): ValidationError | null {
  if (!bio || bio.trim().length === 0) {
    return null; // Optional field
  }

  if (bio.length > 500) {
    return { field: "bio", message: "Bio must be at most 500 characters" };
  }
  return null;
}

export function validateYear(year: number): ValidationError | null {
  if (!year) {
    return null; // Optional field
  }

  if (!Number.isInteger(year) || year < 1 || year > 5) {
    return { field: "year", message: "Year must be between 1 and 5" };
  }
  return null;
}

export function validateDateOfBirth(dateStr: string): ValidationError | null {
  if (!dateStr || dateStr.trim().length === 0) {
    return null; // Optional field
  }

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return { field: "dateOfBirth", message: "Invalid date format. Use ISO 8601 (YYYY-MM-DD)" };
    }

    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    if (age < 13) {
      return { field: "dateOfBirth", message: "User must be at least 13 years old" };
    }
    return null;
  } catch {
    return { field: "dateOfBirth", message: "Invalid date format. Use ISO 8601 (YYYY-MM-DD)" };
  }
}

export function validateUrl(url: string, fieldName: string): ValidationError | null {
  if (!url || url.trim().length === 0) {
    return null; // Optional field
  }

  try {
    new URL(url);
    return null;
  } catch {
    return { field: fieldName, message: `${fieldName} must be a valid URL` };
  }
}

export function validateGithubUsername(username: string): ValidationError | null {
  if (!username || username.trim().length === 0) {
    return null; // Optional field
  }

  const trimmed = username.trim();
  if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(trimmed)) {
    return { field: "github", message: "Invalid GitHub username format" };
  }
  return null;
}

export function validateSkillsAndInterests(
  skills: unknown,
  fieldName: "skills" | "interests",
): ValidationError | null {
  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    return null; // Optional field
  }

  if (skills.length > 50) {
    return { field: fieldName, message: `${fieldName} must have at most 50 items` };
  }

  for (const item of skills) {
    if (typeof item !== "string") {
      return { field: fieldName, message: `All ${fieldName} items must be strings` };
    }
    if (item.length === 0 || item.length > 100) {
      return { field: fieldName, message: `Each ${fieldName} item must be 1-100 characters` };
    }
  }

  return null;
}

export function validateProfileUpdate(data: unknown): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data || typeof data !== "object") {
    return errors;
  }

  const profile = data as Record<string, unknown>;

  if ("name" in profile) {
    const err = validateName(String(profile.name || ""));
    if (err) errors.push(err);
  }

  if ("username" in profile) {
    const err = validateUsername(String(profile.username || ""));
    if (err) errors.push(err);
  }

  if ("phone" in profile) {
    const err = validatePhone(String(profile.phone || ""));
    if (err) errors.push(err);
  }

  if ("bio" in profile) {
    const err = validateBio(String(profile.bio || ""));
    if (err) errors.push(err);
  }

  if ("year" in profile) {
    const err = validateYear(Number(profile.year || 0));
    if (err) errors.push(err);
  }

  if ("dateOfBirth" in profile) {
    const err = validateDateOfBirth(String(profile.dateOfBirth || ""));
    if (err) errors.push(err);
  }

  if ("github" in profile) {
    const err = validateGithubUsername(String(profile.github || ""));
    if (err) errors.push(err);
  }

  if ("linkedin" in profile) {
    const err = validateUrl(String(profile.linkedin || ""), "linkedin");
    if (err) errors.push(err);
  }

  if ("portfolio" in profile) {
    const err = validateUrl(String(profile.portfolio || ""), "portfolio");
    if (err) errors.push(err);
  }

  if ("instagram" in profile) {
    const err = validateUrl(String(profile.instagram || ""), "instagram");
    if (err) errors.push(err);
  }

  if ("skills" in profile) {
    const err = validateSkillsAndInterests(profile.skills, "skills");
    if (err) errors.push(err);
  }

  if ("interests" in profile) {
    const err = validateSkillsAndInterests(profile.interests, "interests");
    if (err) errors.push(err);
  }

  return errors;
}
