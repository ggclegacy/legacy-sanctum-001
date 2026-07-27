import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseAuthServerClient } from "@/lib/supabase/auth-server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const requestedNext = request.nextUrl.searchParams.get("next");
  const nextPath =
    requestedNext?.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : "/member";
  const signInUrl = new URL("/sign-in", request.url);

  if (!code) {
    signInUrl.searchParams.set("error", "invalid-link");
    return NextResponse.redirect(signInUrl);
  }

  const auth = await getSupabaseAuthServerClient();
  const admin = getSupabaseServerClient();
  if (!auth || !admin) {
    signInUrl.searchParams.set("reason", "configuration");
    return NextResponse.redirect(signInUrl);
  }

  const { error } = await auth.auth.exchangeCodeForSession(code);
  if (error) {
    signInUrl.searchParams.set("error", "invalid-link");
    return NextResponse.redirect(signInUrl);
  }

  const {
    data: { user },
  } = await auth.auth.getUser();
  const email = user?.email?.trim().toLowerCase();
  if (!user || !email) {
    await auth.auth.signOut();
    signInUrl.searchParams.set("error", "not-member");
    return NextResponse.redirect(signInUrl);
  }

  const { data: member } = await admin
    .from("members")
    .select("id, status, auth_user_id")
    .ilike("email", email)
    .in("status", ["invited", "active"])
    .maybeSingle();

  if (!member || (member.auth_user_id && member.auth_user_id !== user.id)) {
    await auth.auth.signOut();
    signInUrl.searchParams.set("error", "not-member");
    return NextResponse.redirect(signInUrl);
  }

  const { error: linkError } = await admin
    .from("members")
    .update({
      auth_user_id: user.id,
      status: "active",
      last_active_at: new Date().toISOString(),
    })
    .eq("id", member.id);

  if (linkError) {
    await auth.auth.signOut();
    signInUrl.searchParams.set("error", "not-member");
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.redirect(new URL(nextPath, request.url));
}
