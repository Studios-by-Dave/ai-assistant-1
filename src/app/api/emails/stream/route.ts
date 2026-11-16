import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  const userId = req.nextUrl.searchParams.get("userId");

  const stream = new ReadableStream({
    async start(controller) {
      let lastId: string | null = null;
      const send = (data: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // initial ping
      send({ type: "connected" });

      const interval = setInterval(async () => {
        try {
          const emails = await prisma.email.findMany({
            where: {
              ...(userId ? { userId } : {}),
              urgencyScore: { gte: 70 },
            },
            orderBy: { createdAt: "desc" },
            take: 5,
          });
          if (emails.length && emails[0].id !== lastId) {
            lastId = emails[0].id;
            send({ type: "urgent", emails });
          }
        } catch (e) {
          send({ type: "error", message: String(e) });
        }
      }, 5000);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
