import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { isInternalPreviewEnabled } from "@/lib/env";
import { getSupabaseAuthServerClient } from "@/lib/supabase/auth-server";
import type {
  DirectoryMember,
  LegacyProject,
  MemberAppData,
  MemberEvent,
  MemberIdentity,
  MemberObjective,
  PillarKey,
  ProtocolItem,
  Reflection,
} from "@/types/member";

type MemberRow = {
  id: string;
  first_name: string;
  display_name: string;
  member_number: string;
  member_type: string;
  headline: string | null;
  current_focus: string | null;
};

type ObjectiveRow = {
  id: string;
  pillar: PillarKey;
  title: string;
  status: string;
  target_date: string | null;
};

type ReflectionRow = {
  id: string;
  prompt: string;
  response: string;
  created_at: string;
};

type LegacyProjectRow = {
  id: string;
  title: string;
  domain: string;
  purpose: string | null;
  status: string;
  target_date: string | null;
};

type DirectoryRow = {
  member_id: string;
  display_name: string;
  member_number: string;
  headline: string | null;
  expertise: string[];
  seeking: string[];
  offering: string[];
};

type EventRow = {
  id: string;
  title: string;
  summary: string;
  starts_at: string;
  location_label: string | null;
  is_virtual: boolean;
};

type MemberProtocolRow = {
  id: string;
  protocols:
    | {
        protocol_items:
          | {
              id: string;
              title: string;
              guidance: string | null;
              display_order: number;
            }[]
          | null;
      }
    | {
        protocol_items:
          | {
              id: string;
              title: string;
              guidance: string | null;
              display_order: number;
            }[]
          | null;
      }[]
    | null;
};

type CheckinRow = {
  protocol_item_id: string;
  completed: boolean;
};

type RsvpRow = {
  event_id: string;
  status: string;
};

function toIdentity(row: MemberRow): MemberIdentity {
  return {
    id: row.id,
    firstName: row.first_name,
    displayName: row.display_name,
    memberNumber: row.member_number,
    memberType: row.member_type,
    headline: row.headline,
    currentFocus: row.current_focus,
  };
}

export const getCurrentMemberData = cache(
  async (): Promise<MemberAppData | null> => {
    const supabase = await getSupabaseAuthServerClient();
    if (!supabase) return null;

    const { data: claimsData } = await supabase.auth.getClaims();
    const userId =
      typeof claimsData?.claims?.sub === "string"
        ? claimsData.claims.sub
        : null;
    if (!userId) return null;

    const { data: memberData } = await supabase
      .from("members")
      .select(
        "id, first_name, display_name, member_number, member_type, headline, current_focus",
      )
      .eq("auth_user_id", userId)
      .eq("status", "active")
      .maybeSingle();

    const member = memberData as MemberRow | null;
    if (!member) return null;

    const today = new Date().toISOString().slice(0, 10);
    const [
      objectivesResult,
      protocolsResult,
      checkinsResult,
      reflectionsResult,
      projectsResult,
      directoryResult,
      eventsResult,
      rsvpsResult,
    ] = await Promise.all([
      supabase
        .from("member_objectives")
        .select("id, pillar, title, status, target_date")
        .eq("member_id", member.id)
        .neq("status", "archived")
        .order("created_at", { ascending: false })
        .limit(12),
      supabase
        .from("member_protocols")
        .select(
          "id, protocols!inner(protocol_items(id, title, guidance, display_order))",
        )
        .eq("member_id", member.id)
        .eq("status", "active"),
      supabase
        .from("protocol_checkins")
        .select("protocol_item_id, completed")
        .eq("member_id", member.id)
        .eq("checkin_date", today),
      supabase
        .from("member_reflections")
        .select("id, prompt, response, created_at")
        .eq("member_id", member.id)
        .order("created_at", { ascending: false })
        .limit(4),
      supabase
        .from("legacy_projects")
        .select("id, title, domain, purpose, status, target_date")
        .eq("member_id", member.id)
        .neq("status", "archived")
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("member_directory_profiles")
        .select(
          "member_id, display_name, member_number, headline, expertise, seeking, offering",
        )
        .eq("is_visible", true)
        .neq("member_id", member.id)
        .order("display_name")
        .limit(24),
      supabase
        .from("member_events")
        .select("id, title, summary, starts_at, location_label, is_virtual")
        .eq("status", "scheduled")
        .gte("starts_at", new Date().toISOString())
        .order("starts_at")
        .limit(8),
      supabase
        .from("event_rsvps")
        .select("event_id, status")
        .eq("member_id", member.id),
    ]);

    const objectives = (objectivesResult.data ?? []) as ObjectiveRow[];
    const checkins = (checkinsResult.data ?? []) as CheckinRow[];
    const completedItemIds = new Set(
      checkins
        .filter((checkin) => checkin.completed)
        .map((checkin) => checkin.protocol_item_id),
    );

    const protocolItems: ProtocolItem[] = (
      (protocolsResult.data ?? []) as MemberProtocolRow[]
    ).flatMap((assignment) => {
      const protocol = Array.isArray(assignment.protocols)
        ? assignment.protocols[0]
        : assignment.protocols;
      return (protocol?.protocol_items ?? [])
        .sort((a, b) => a.display_order - b.display_order)
        .map((item) => ({
          id: item.id,
          memberProtocolId: assignment.id,
          title: item.title,
          guidance: item.guidance,
          completedToday: completedItemIds.has(item.id),
        }));
    });

    const rsvpMap = new Map(
      ((rsvpsResult.data ?? []) as RsvpRow[]).map((rsvp) => [
        rsvp.event_id,
        rsvp.status,
      ]),
    );

    return {
      identity: toIdentity(member),
      objectives: objectives.map(
        (row): MemberObjective => ({
          id: row.id,
          pillar: row.pillar,
          title: row.title,
          status: row.status,
          targetDate: row.target_date,
        }),
      ),
      protocolItems,
      reflections: ((reflectionsResult.data ?? []) as ReflectionRow[]).map(
        (row): Reflection => ({
          id: row.id,
          prompt: row.prompt,
          response: row.response,
          createdAt: row.created_at,
        }),
      ),
      legacyProjects: (
        (projectsResult.data ?? []) as LegacyProjectRow[]
      ).map(
        (row): LegacyProject => ({
          id: row.id,
          title: row.title,
          domain: row.domain,
          purpose: row.purpose,
          status: row.status,
          targetDate: row.target_date,
        }),
      ),
      directory: ((directoryResult.data ?? []) as DirectoryRow[]).map(
        (row): DirectoryMember => ({
          memberId: row.member_id,
          displayName: row.display_name,
          memberNumber: row.member_number,
          headline: row.headline,
          expertise: row.expertise,
          seeking: row.seeking,
          offering: row.offering,
        }),
      ),
      events: ((eventsResult.data ?? []) as EventRow[]).map(
        (row): MemberEvent => ({
          id: row.id,
          title: row.title,
          summary: row.summary,
          startsAt: row.starts_at,
          locationLabel: row.location_label,
          isVirtual: row.is_virtual,
          rsvpStatus: rsvpMap.get(row.id) ?? null,
        }),
      ),
      isPreview: false,
    };
  },
);

export async function requireCurrentMemberData() {
  const data = await getCurrentMemberData();
  if (!data) redirect("/sign-in?reason=membership");
  return data;
}

export function getMemberPreviewData(): MemberAppData | null {
  if (!isInternalPreviewEnabled()) return null;

  return {
    identity: {
      id: "preview-member",
      firstName: "Founding Member",
      displayName: "Founding Member Preview",
      memberNumber: "—",
      memberType: "founding_member",
      headline: "Private member application preview",
      currentFocus: null,
    },
    objectives: [],
    protocolItems: [],
    reflections: [],
    legacyProjects: [],
    directory: [],
    events: [],
    isPreview: true,
  };
}
