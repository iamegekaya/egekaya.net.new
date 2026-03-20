import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    service: process.env.APP_NAME ?? "egekaya.net",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
