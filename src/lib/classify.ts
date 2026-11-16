import { openrouter, MODELS } from "./openrouter";

export type Classification = {
  category: "sales" | "support" | "recruiting" | "marketing" | "spam" | "newsletter";
  intent: string;
  urgencyScore: number; // 1-100
  aiSummary: string;
};

export async function classifyEmail(subject: string, body: string): Promise<Classification> {
  const res = await openrouter.chat.completions.create({
    model: MODELS.classification,
    messages: [
      {
        role: "system",
        content: `You classify business emails. Return strict JSON: {"category": one of sales|support|recruiting|marketing|spam|newsletter, "intent": short snake_case, "urgencyScore": 1-100, "aiSummary": one sentence}.`,
      },
      { role: "user", content: `Subject: ${subject}\n\n${body.slice(0, 4000)}` },
    ],
    response_format: { type: "json_object" },
  });
  const text = res.choices[0]?.message?.content ?? "{}";
  return JSON.parse(text) as Classification;
}
