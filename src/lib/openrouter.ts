import OpenAI from "openai";

export const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const MODELS = {
  chat: "openai/gpt-4o",
  classification: "anthropic/claude-3.5-sonnet",
} as const;
