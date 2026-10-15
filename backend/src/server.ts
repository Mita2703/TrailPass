import express from "express";
import { env } from "./config/env";

const app = express();

app.get("/api/v1/health", (_req, res) => {
  res.json({ data: { app: "ok" }, error: null });
});

app.listen(env.PORT, () => {
  console.log(`TrailPass API berjalan di http://localhost:${env.PORT}/api/v1`);
});
