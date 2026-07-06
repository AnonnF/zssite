import OpenAI from "openai";
import type { AiConfig } from "../types.js";
import type { AiProvider } from "../types.js";

const JSON_SYSTEM_SUFFIX =
  "Respond with a single valid JSON object only. No markdown, no code fences, no extra text.";

export function createDeepSeekProvider(config: AiConfig): AiProvider {
  const client = new OpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseUrl,
  });

  async function callCompletion(
    prompt: string,
    system?: string,
    useJsonFormat = true
  ): Promise<string> {
    const systemContent = system
      ? `${system}\n\n${JSON_SYSTEM_SUFFIX}`
      : JSON_SYSTEM_SUFFIX;

    const baseParams = {
      model: config.model,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      messages: [
        { role: "system" as const, content: systemContent },
        { role: "user" as const, content: prompt },
      ],
    };

    try {
      const response = await client.chat.completions.create({
        ...baseParams,
        ...(useJsonFormat
          ? { response_format: { type: "json_object" as const } }
          : {}),
      });

      const content = response.choices[0]?.message?.content;
      if (!content?.trim()) {
        throw new Error("DeepSeek returned empty content");
      }
      return content;
    } catch (error) {
      if (!useJsonFormat) throw error;

      const response = await client.chat.completions.create(baseParams);
      const content = response.choices[0]?.message?.content;
      if (!content?.trim()) {
        throw new Error("DeepSeek returned empty content (fallback attempt)");
      }
      return content;
    }
  }

  return {
    async generateJson(prompt, options) {
      return callCompletion(prompt, options?.system, true);
    },
  };
}
