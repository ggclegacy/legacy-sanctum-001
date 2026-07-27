import "server-only";

import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function saveInvitationEvent(
  inviteId: string,
  eventType: string,
  sceneKey: string | null,
) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return false;

  const { error } = await supabase.from("invite_events").insert({
    invite_id: inviteId,
    event_type: eventType,
    scene_key: sceneKey,
  });
  if (error) throw error;

  return true;
}
