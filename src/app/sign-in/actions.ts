"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { getSiteUrl } from "@/lib/env";
import { getSupabaseAuthServerClient } from "@/lib/supabase/auth-server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type SignInState = {
  status: "idle" | "sent" | "error";
  message: string;
};

const emailSchema = z.email().max(254);

export async function requestMemberAccess(
  _state: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Enter the email address connected to your invitation.",
    };
  }

  const admin = getSupabaseServerClient();
  const auth = await getSupabaseAuthServerClient();
  if (!admin || !auth) {
    return {
      status: "error",
      message: "Member access is not configured yet. Please try again later.",
    };
  }

  const normalizedEmail = parsed.data.trim().toLowerCase();
  const { data: eligibleMember } = await admin
    .from("members")
    .select("id")
    .ilike("email", normalizedEmail)
    .in("status", ["invited", "active"])
    .maybeSingle();

  if (eligibleMember) {
    const requestHeaders = await headers();
    const origin =
      getSiteUrl() ??
      requestHeaders.get("origin") ??
      "http://localhost:3000";

    await auth.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/member`,
        shouldCreateUser: false,
      },
    });
  }

  return {
    status: "sent",
    message:
      "If that email is connected to an active invitation, your private access link is on its way.",
  };
}
