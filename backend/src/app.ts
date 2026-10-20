import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env";
import { prisma } from "./lib/prisma";
import { errorHandler, notFound } from "./middleware/errors";
import authRoutes from "./modules/auth/auth.routes";
import mountainRoutes from "./modules/mountains/mountains.routes";
import trailRoutes from "./modules/trails/trails.routes";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/v1/health", async (_req, res) => {
    let database = "up";
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      database = "down";
    }
    res.json({ data: { app: "ok", database }, error: null });
  });

  app.use("/api/v1", authRoutes);
  app.use("/api/v1", mountainRoutes);
  app.use("/api/v1", trailRoutes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
