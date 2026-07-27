import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getPublicSupabaseEnv } from "@/lib/env";

export async function refreshMemberSession(request: NextRequest) {
  const env = getPublicSupabaseEnv();
  let response = NextResponse.next({ request });

  if (!env) {
    if (request.nextUrl.pathname.startsWith("/member")) {
      const url = request.nextUrl.clone();
      url.pathname = "/sign-in";
      url.searchParams.set("reason", "configuration");
      return NextResponse.redirect(url);
    }
    return response;
  }

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const isMemberRoute = request.nextUrl.pathname.startsWith("/member");
  const isSignInRoute = request.nextUrl.pathname === "/sign-in";

  if (!data?.claims && isMemberRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set(
      "next",
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );
    return NextResponse.redirect(url);
  }

  if (data?.claims && isSignInRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/member";
    url.search = "";
    return NextResponse.redirect(url);
  }

  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
