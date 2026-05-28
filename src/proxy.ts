import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

const SKIP_PREFIXES = ["/_next", "/favicon"];
const SKIP_EXT = /\.(svg|png|jpg|jpeg|gif|webp|ico)$/i;

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (SKIP_PREFIXES.some((p) => path.startsWith(p)) || SKIP_EXT.test(path)) {
    return NextResponse.next();
  }
  return updateSession(request);
}
