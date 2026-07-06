import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import type { AiConfig, AiProviderId } from "./types.js";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../.."
);

dotenv.config({ path: path.join(repoRoot, ".env") });

function parseNumber(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function getAiConfig(): AiConfig {
  const provider = (process.env.PROJECT_ANALYZER_PROVIDER ?? "deepseek") as AiProviderId;

  return {
    apiKey: process.env.DEEPSEEK_API_KEY ?? "",
    baseUrl: process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com",
    provider,
    model: process.env.PROJECT_ANALYZER_MODEL ?? "deepseek-v4-flash",
    temperature: parseNumber(process.env.PROJECT_ANALYZER_TEMPERATURE, 0.2),
    maxTokens: parseNumber(process.env.PROJECT_ANALYZER_MAX_TOKENS, 6000),
  };
}

export function getRepoRoot(): string {
  return repoRoot;
}
