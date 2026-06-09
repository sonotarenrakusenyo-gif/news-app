import { NextRequest, NextResponse } from "next/server";
import { repairWeakSummaries } from "@/lib/repairSummaries";

export const runtime = "nodejs";
export const maxDuration = 300;

function isAuthorized(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return process.env.NODE_ENV === "development";
  }

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${cronSecret}`;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limitParam = request.nextUrl.searchParams.get("limit");
  const limit = Math.min(Math.max(Number(limitParam) || 6, 1), 10);

  try {
    const result = await repairWeakSummaries(limit);

    return NextResponse.json({
      ok: true,
      ...result,
      repairedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Summary repair failed:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Summary repair failed",
      },
      { status: 500 },
    );
  }
}
