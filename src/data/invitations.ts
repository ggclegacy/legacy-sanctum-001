import "server-only";

import type {
  InvitationExperienceData,
  InviteStatus,
  NarrationSegment,
} from "@/types/invitation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type InviteVerificationRecord = {
  id: string;
  memberId: string;
  pinHash: string;
  status: InviteStatus;
  expiresAt: string | null;
  failedAttempts: number;
  maxAttempts: number;
};

export async function getInviteForVerification(tokenHash: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return { configured: false as const, record: null };

  const { data, error } = await supabase
    .from("invites")
    .select(
      "id, member_id, pin_hash, status, expires_at, failed_attempts, max_attempts",
    )
    .eq("public_token_hash", tokenHash)
    .maybeSingle();

  if (error) throw error;
  if (!data) return { configured: true as const, record: null };

  const record: InviteVerificationRecord = {
    id: data.id,
    memberId: data.member_id,
    pinHash: data.pin_hash,
    status: data.status as InviteStatus,
    expiresAt: data.expires_at,
    failedAttempts: data.failed_attempts,
    maxAttempts: data.max_attempts,
  };

  return { configured: true as const, record };
}

export async function recordFailedAttempt(record: InviteVerificationRecord) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return;

  const failedAttempts = record.failedAttempts + 1;
  const shouldLock = failedAttempts >= record.maxAttempts;

  const { error } = await supabase
    .from("invites")
    .update({
      failed_attempts: failedAttempts,
      status: shouldLock ? "locked" : record.status,
      locked_at: shouldLock ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", record.id);

  if (error) throw error;
}

export async function recordSuccessfulVerification(inviteId: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return;

  const now = new Date().toISOString();
  const { error } = await supabase
    .from("invites")
    .update({
      status: "verified",
      verified_at: now,
      first_opened_at: now,
      failed_attempts: 0,
      updated_at: now,
    })
    .eq("id", inviteId);

  if (error) throw error;
}

export async function getInvitationExperience(
  record: InviteVerificationRecord,
): Promise<InvitationExperienceData> {
  const supabase = getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase is not configured");

  const [memberResult, contentResult, productsResult, narrationResult] =
    await Promise.all([
      supabase
        .from("members")
        .select(
          "first_name, display_name, member_number, member_type",
        )
        .eq("id", record.memberId)
        .single(),
      supabase
        .from("invite_content")
        .select(
          "custom_headline, founder_message, why_selected, vision_message, founding_member_message, closing_message",
        )
        .eq("invite_id", record.id)
        .single(),
      supabase
        .from("invite_products")
        .select(
          "display_order, selection_reason, custom_usage_note, products(id, name, short_purpose, image_path, usage_note)",
        )
        .eq("invite_id", record.id)
        .order("display_order"),
      supabase
        .from("narration_segments")
        .select(
          "scene_key, script, audio_path, duration_ms, status",
        )
        .eq("invite_id", record.id)
        .in("status", ["reviewed", "published"]),
    ]);

  if (memberResult.error) throw memberResult.error;
  if (contentResult.error) throw contentResult.error;
  if (productsResult.error) throw productsResult.error;
  if (narrationResult.error) throw narrationResult.error;

  const member = memberResult.data;
  const content = contentResult.data;

  return {
    invitationId: record.id,
    firstName: member.first_name,
    displayName: member.display_name,
    memberNumber: member.member_number,
    memberType: member.member_type,
    customHeadline: content.custom_headline,
    founderMessage: content.founder_message,
    whySelected: content.why_selected,
    visionMessage: content.vision_message,
    foundingMemberMessage: content.founding_member_message,
    closingMessage: content.closing_message,
    products: (productsResult.data ?? []).flatMap((row) => {
      const product = Array.isArray(row.products)
        ? row.products[0]
        : row.products;
      if (!product) return [];
      return [
        {
          id: product.id,
          name: product.name,
          shortPurpose: product.short_purpose,
          selectionReason: row.selection_reason,
          usageNote: row.custom_usage_note ?? product.usage_note,
          imagePath: product.image_path,
        },
      ];
    }),
    narration: (narrationResult.data ?? []).map(
      (segment): NarrationSegment => ({
        sceneKey: segment.scene_key,
        script: segment.script,
        audioPath: segment.audio_path,
        durationMs: segment.duration_ms,
      }),
    ),
  };
}
