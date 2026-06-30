import { Router, type NextFunction, type Request, type Response } from "express";
import multer from "multer";
import { env } from "../env.js";
import { prisma } from "../prisma.js";
import { uploadImageBuffer } from "../cloudinary.js";
import { requireAuth, type AuthedRequest } from "../middleware/requireAuth.js";

export const eventsRouter = Router();

const posterUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
      return;
    }
    cb(new Error("Poster must be an image file"));
  },
});

function handlePosterUpload(req: Request, res: Response, next: NextFunction): void {
  posterUpload.single("poster")(req, res, (err) => {
    if (!err) {
      next();
      return;
    }

    const message =
      err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE"
        ? "Poster must be 5MB or smaller"
        : err instanceof Error
          ? err.message
          : "Could not upload poster";

    res.status(400).json({ error: message });
  });
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function optionalText(value: unknown): string | null {
  const trimmed = text(value);
  return trimmed || null;
}

function parseDate(value: unknown): Date | null {
  const raw = text(value);
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseCapacity(value: unknown): number | null {
  const raw = text(value);
  if (!raw) return null;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function isUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function serializeEvent(event: Awaited<ReturnType<typeof findEvents>>[number]) {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    category: event.category,
    location: event.location,
    organizerName: event.organizerName,
    startAt: event.startAt.toISOString(),
    endAt: event.endAt?.toISOString() ?? null,
    capacity: event.capacity,
    registrationUrl: event.registrationUrl,
    posterUrl: event.posterUrl,
    createdAt: event.createdAt.toISOString(),
    creator: {
      id: event.createdBy.id,
      name: event.createdBy.name,
      email: event.createdBy.email,
      avatarUrl: event.createdBy.avatarUrl,
    },
  };
}

function findEvents() {
  return prisma.event.findMany({
    orderBy: { startAt: "asc" },
    include: {
      createdBy: {
        select: { id: true, name: true, email: true, avatarUrl: true },
      },
    },
  });
}

eventsRouter.get("/", async (_req: Request, res: Response) => {
  const events = await findEvents();
  res.json({ events: events.map(serializeEvent) });
});

eventsRouter.post(
  "/",
  requireAuth,
  handlePosterUpload,
  async (req: AuthedRequest, res: Response) => {
    const title = text(req.body?.title);
    const description = text(req.body?.description);
    const category = text(req.body?.category) || "Campus";
    const location = text(req.body?.location);
    const organizerName = text(req.body?.organizerName);
    const startAt = parseDate(req.body?.startAt);
    const endAt = parseDate(req.body?.endAt);
    const capacity = parseCapacity(req.body?.capacity);
    const registrationUrl = optionalText(req.body?.registrationUrl);

    if (!title || !description || !location || !organizerName || !startAt) {
      res.status(400).json({
        error: "Title, description, location, organizer, and start date are required",
      });
      return;
    }

    if (endAt && endAt <= startAt) {
      res.status(400).json({ error: "End date must be after the start date" });
      return;
    }

    if (registrationUrl && !isUrl(registrationUrl)) {
      res.status(400).json({ error: "Registration URL must be a valid http(s) URL" });
      return;
    }

    let posterUrl: string | null = null;
    let posterPublicId: string | null = null;
    const poster = req.file;

    if (poster) {
      if (!env.cloudinary.enabled) {
        res.status(503).json({ error: "Cloudinary is not configured for poster uploads" });
        return;
      }

      const upload = await uploadImageBuffer(poster.buffer, {
        folder: env.cloudinary.folder,
        publicId: `${Date.now()}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
      });
      posterUrl = upload.secure_url;
      posterPublicId = upload.public_id;
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        category,
        location,
        organizerName,
        startAt,
        endAt,
        capacity,
        registrationUrl,
        posterUrl,
        posterPublicId,
        createdById: req.userId!,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
      },
    });

    res.status(201).json({ event: serializeEvent(event) });
  },
);
