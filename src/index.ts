import express from "express";
import type { NextFunction, Request, Response } from "express";
import analyzeRouter from "./server/analyze-route.js";

const app = express();

app.get("/", (_request, response) => {
  response.redirect(302, "/index.html");
});

// Keep JSON as raw bytes so Express can parse it consistently in local Node
// and Vercel's function adapter.
app.use(express.raw({ type: "application/json", limit: "50kb" }));
app.use("/api", analyzeRouter);
app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  const status =
    typeof error === "object" && error !== null && "status" in error && typeof error.status === "number"
      ? error.status
      : 500;
  response.status(status).json({ status: "analysis_failed" });
});

export default app;
