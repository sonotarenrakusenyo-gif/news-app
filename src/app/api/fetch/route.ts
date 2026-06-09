import { NextResponse } from "next/server";
import { runFetchPipeline } from "@/lib/pipeline";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST() {
  try {
    const { results, totalNew } = await runFetchPipeline();

    return NextResponse.json({
      ok: true,
      totalNew,
      results,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Manual fetch failed:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Fetch failed",
      },
      { status: 500 },
    );
  }
}
