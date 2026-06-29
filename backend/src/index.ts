import express, { type NextFunction, type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { env } from "./env.js";
import { authRouter } from "./auth/routes.js";

const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "eventix-backend" });
});

app.use("/api/auth", authRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Centralized error handler so unexpected throws don't leak stack traces.
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[error]", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(env.port, () => {
  console.log(`EventiX backend listening on ${env.backendUrl} (port ${env.port})`);
});
