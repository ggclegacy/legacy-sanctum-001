import type { NextRequest } from "next/server";

import { refreshMemberSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return refreshMemberSession(request);
}

export const config = {
  matcher: ["/member/:path*", "/sign-in"],
};
