import { Router } from "express";
import type { AnalyzeRequest, AnalyzeResponse, ModelResponse } from "../shared/analysis-types";
import { analyzeWithGemini } from "./gemini.js";
import { parseModelResponse, toAnalysisResult } from "./validate-analysis.js";

const router = Router();

router.post("/analyze", async (request, response) => {
  let body: unknown = request.body;
  if (Buffer.isBuffer(body) || typeof body === "string") {
    try {
      body = JSON.parse(Buffer.isBuffer(body) ? body.toString("utf8") : body);
    } catch {
      body = undefined;
    }
  }
  if (
    typeof body !== "object" ||
    body === null ||
    !("message" in body) ||
    typeof (body as AnalyzeRequest).message !== "string" ||
    !(body as AnalyzeRequest).message.trim()
  ) {
    response.status(400).json({ status: "analysis_failed" } satisfies AnalyzeResponse);
    return;
  }

  const message = (body as AnalyzeRequest).message;

  try {
    const rawModelResponse = await analyzeWithGemini(message);
    const modelResponse: ModelResponse = parseModelResponse(JSON.stringify(rawModelResponse));

    if (modelResponse.status !== "complete") {
      response.status(422).json({ status: modelResponse.status } satisfies AnalyzeResponse);
      return;
    }

    const result = toAnalysisResult(modelResponse, message);
    response.json({ status: "complete", result } satisfies AnalyzeResponse);
  } catch {
    // Keep the submitted message, API key, and raw model output out of application logs.
    response.status(502).json({ status: "analysis_failed" } satisfies AnalyzeResponse);
  }
});

export default router;
