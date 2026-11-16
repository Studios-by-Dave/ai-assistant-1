import { Inngest } from "inngest";
import { Redis } from "@upstash/redis";

export const inngest = new Inngest({ id: "ai-assistant" });

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL ?? "",
  token: process.env.UPSTASH_REDIS_TOKEN ?? "",
});
