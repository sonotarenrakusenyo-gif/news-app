import { NextRequest, NextResponse } from "next/server";
import { runFetchPipeline } from "@/lib/pipeline";

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

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { results, totalNew } = await runFetchPipeline();

    return NextResponse.json({
      ok: true,
      totalNew,
      results,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cron fetch failed:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Fetch failed",
      },
      { status: 500 },
    );
  }
}
