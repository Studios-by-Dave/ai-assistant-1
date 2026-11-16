import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const emails = await prisma.email.findMany({
    orderBy: [{ urgencyScore: "desc" }, { createdAt: "desc" }],
    take: 50,
  });
  return NextResponse.json(emails);
}
