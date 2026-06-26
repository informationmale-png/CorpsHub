import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ── Simple in-memory rate limiter ───────────────────────────────────────────
// On Vercel Edge, memory persists between requests on the same instance but
// resets when the instance cold-starts. This is a soft limit — prevents casual
// scraping. For hard limits, add Vercel WAF (Pro) or Supabase RLS rate caps.

type Bucket = { count: number; resetAt: number };

const rateMap = new Map<string, Bucket>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 120;

function check(key: string): boolean {
  const now = Date.now();
  const b = rateMap.get(key);
  if (!b || now > b.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  b.count++;
  return b.count <= MAX_PER_WINDOW;
}

export function middleware(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip")
    ?? "unknown";
  const key = `${ip}:${request.nextUrl.pathname}`;

  if (!check(key)) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: { "Retry-After": "60", "Content-Type": "text/plain" },
    });
  }

  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon).*)",
};
