import { getAiConfig } from "../config.js";
import type { AiProvider } from "../types.js";
import { createDeepSeekProvider } from "./deepseek.js";

export function getAiProvider(): AiProvider {
  const config = getAiConfig();

  switch (config.provider) {
    case "deepseek":
      return createDeepSeekProvider(config);
    default:
      throw new Error(`Unsupported AI provider: ${config.provider}`);
  }
}

export { getAiConfig };
