import { Router, type NextFunction, type Request, type Response } from "express";
import multer from "multer";
import { requireAuth, type AuthedRequest } from "../middleware/requireAuth.js";
import * as controller from "./controller.js";

export const profileRouter = Router();

const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
      return;
    }
    cb(new Error("Avatar must be an image file"));
  },
});

function handleAvatarUpload(req: Request, res: Response, next: NextFunction): void {
  avatarUpload.single("avatar")(req, res, (err) => {
    if (!err) {
      next();
      return;
    }

    const message =
      err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE"
        ? "Avatar must be 5MB or smaller"
        : err instanceof Error
          ? err.message
          : "Could not upload avatar";

    res.status(400).json({ error: message });
  });
}

// Get current user's full profile
profileRouter.get("/", requireAuth, controller.getMyProfile);

// Get public profile by user ID
profileRouter.get("/:id", requireAuth, controller.getProfileById);

// Update profile
profileRouter.put("/", requireAuth, controller.updateProfile);

// Upload avatar
profileRouter.post(
  "/avatar",
  requireAuth,
  handleAvatarUpload,
  (req: AuthedRequest, res: Response) => {
    controller.uploadAvatar(req, res).catch((error) => {
      console.error("[profile] Unhandled error in avatar upload:", error);
      res.status(500).json({ error: "Internal server error" });
    });
  },
);
