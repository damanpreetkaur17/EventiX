import type { Response } from "express";
import type { AuthedRequest } from "../middleware/requireAuth.js";
import { env } from "../env.js";
import { uploadImageBuffer } from "../cloudinary.js";
import * as profileService from "./service.js";
import { validateProfileUpdate } from "./validation.js";

export async function getMyProfile(req: AuthedRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "User ID not found in token" });
      return;
    }

    const profile = await profileService.getCurrentUserProfile(req.userId);
    if (!profile) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }

    res.json({ data: profile });
  } catch (error) {
    console.error("[profile] Error getting profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getProfileById(req: AuthedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    const profile = await profileService.getPublicProfile(id);
    if (!profile) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ data: profile });
  } catch (error) {
    console.error("[profile] Error getting profile by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateProfile(req: AuthedRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "User ID not found in token" });
      return;
    }

    // Validate input
    const errors = validateProfileUpdate(req.body);
    if (errors.length > 0) {
      res.status(400).json({ error: "Validation failed", details: errors });
      return;
    }

    // Check username availability if it's being changed
    if (req.body.username) {
      const available = await profileService.isUsernameAvailable(req.body.username, req.userId);
      if (!available) {
        res.status(400).json({
          error: "Validation failed",
          details: [{ field: "username", message: "Username is already taken" }],
        });
        return;
      }
    }

    const updatedProfile = await profileService.updateUserProfile(req.userId, req.body);
    if (!updatedProfile) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }

    res.json({ data: updatedProfile });
  } catch (error) {
    console.error("[profile] Error updating profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function uploadAvatar(req: AuthedRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "User ID not found in token" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: "No file provided" });
      return;
    }

    // Upload to Cloudinary
    const upload = await uploadImageBuffer(req.file.buffer, {
      folder: `${env.cloudinary.folder}/avatars`,
      publicId: req.userId,
    });

    // Update profile with avatar URL
    const updatedProfile = await profileService.updateUserAvatar(req.userId, upload.secure_url);
    if (!updatedProfile) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }

    res.json({ data: updatedProfile });
  } catch (error) {
    console.error("[profile] Error uploading avatar:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
