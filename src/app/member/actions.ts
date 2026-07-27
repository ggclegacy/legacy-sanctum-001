"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireCurrentMemberData } from "@/data/member";
import { getSupabaseAuthServerClient } from "@/lib/supabase/auth-server";

const uuidSchema = z.uuid();
const pillarSchema = z.enum([
  "vitality",
  "mindset",
  "brotherhood",
  "legacy",
]);

async function getMemberMutationContext() {
  const data = await requireCurrentMemberData();
  const supabase = await getSupabaseAuthServerClient();
  if (!supabase) throw new Error("Member access is not configured.");
  return { memberId: data.identity.id, supabase };
}

export async function addObjective(formData: FormData) {
  const parsed = z
    .object({
      title: z.string().trim().min(3).max(180),
      pillar: pillarSchema,
    })
    .safeParse({
      title: formData.get("title"),
      pillar: formData.get("pillar"),
    });
  if (!parsed.success) return;

  const { memberId, supabase } = await getMemberMutationContext();
  await supabase.from("member_objectives").insert({
    member_id: memberId,
    title: parsed.data.title,
    pillar: parsed.data.pillar,
    status: "active",
  });
  revalidatePath("/member");
}

export async function saveReflection(formData: FormData) {
  const parsed = z
    .object({
      response: z.string().trim().min(3).max(4000),
      prompt: z.string().trim().min(3).max(300),
    })
    .safeParse({
      response: formData.get("response"),
      prompt: formData.get("prompt"),
    });
  if (!parsed.success) return;

  const { memberId, supabase } = await getMemberMutationContext();
  await supabase.from("member_reflections").insert({
    member_id: memberId,
    reflection_type: "daily",
    prompt: parsed.data.prompt,
    response: parsed.data.response,
  });
  revalidatePath("/member/mindset");
}

export async function addLegacyProject(formData: FormData) {
  const parsed = z
    .object({
      title: z.string().trim().min(3).max(180),
      domain: z.enum([
        "business",
        "family",
        "wealth",
        "service",
        "leadership",
        "other",
      ]),
      purpose: z.string().trim().max(1000).optional(),
    })
    .safeParse({
      title: formData.get("title"),
      domain: formData.get("domain"),
      purpose: String(formData.get("purpose") ?? "") || undefined,
    });
  if (!parsed.success) return;

  const { memberId, supabase } = await getMemberMutationContext();
  await supabase.from("legacy_projects").insert({
    member_id: memberId,
    title: parsed.data.title,
    domain: parsed.data.domain,
    purpose: parsed.data.purpose ?? null,
    status: "active",
  });
  revalidatePath("/member/legacy");
}

export async function toggleProtocolItem(formData: FormData) {
  const parsed = z
    .object({
      itemId: uuidSchema,
      memberProtocolId: uuidSchema,
      completed: z.enum(["true", "false"]),
    })
    .safeParse({
      itemId: formData.get("itemId"),
      memberProtocolId: formData.get("memberProtocolId"),
      completed: formData.get("completed"),
    });
  if (!parsed.success) return;

  const { memberId, supabase } = await getMemberMutationContext();
  const { data: assignment } = await supabase
    .from("member_protocols")
    .select("id")
    .eq("id", parsed.data.memberProtocolId)
    .eq("member_id", memberId)
    .maybeSingle();
  if (!assignment) return;

  await supabase.from("protocol_checkins").upsert(
    {
      member_id: memberId,
      member_protocol_id: parsed.data.memberProtocolId,
      protocol_item_id: parsed.data.itemId,
      checkin_date: new Date().toISOString().slice(0, 10),
      completed: parsed.data.completed === "true",
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "member_protocol_id,protocol_item_id,checkin_date",
    },
  );
  revalidatePath("/member");
  revalidatePath("/member/vitality");
}

export async function requestIntroduction(formData: FormData) {
  const parsed = z
    .object({
      targetMemberId: uuidSchema,
      reason: z.string().trim().min(12).max(1000),
    })
    .safeParse({
      targetMemberId: formData.get("targetMemberId"),
      reason: formData.get("reason"),
    });
  if (!parsed.success) return;

  const { memberId, supabase } = await getMemberMutationContext();
  await supabase.from("introduction_requests").insert({
    requester_member_id: memberId,
    target_member_id: parsed.data.targetMemberId,
    reason: parsed.data.reason,
  });
  revalidatePath("/member/brotherhood");
}

export async function setEventRsvp(formData: FormData) {
  const parsed = z
    .object({
      eventId: uuidSchema,
      status: z.enum(["attending", "interested", "declined"]),
    })
    .safeParse({
      eventId: formData.get("eventId"),
      status: formData.get("status"),
    });
  if (!parsed.success) return;

  const { memberId, supabase } = await getMemberMutationContext();
  await supabase.from("event_rsvps").upsert(
    {
      event_id: parsed.data.eventId,
      member_id: memberId,
      status: parsed.data.status,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "event_id,member_id" },
  );
  revalidatePath("/member/brotherhood");
}

export async function signOutMember() {
  const supabase = await getSupabaseAuthServerClient();
  await supabase?.auth.signOut();
  redirect("/sign-in");
}
