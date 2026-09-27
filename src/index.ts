import express from "express";
import type { NextFunction, Request, Response } from "express";
import analyzeRouter from "./server/analyze-route";

const app = express();

app.use(express.json({ limit: "50kb" }));
app.use("/api", analyzeRouter);
app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  const status =
    typeof error === "object" && error !== null && "status" in error && typeof error.status === "number"
      ? error.status
      : 500;
  response.status(status).json({ status: "analysis_failed" });
});

export default app;
