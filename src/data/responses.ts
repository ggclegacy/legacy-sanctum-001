import "server-only";

import { getSupabaseServerClient } from "@/lib/supabase/server";

type ResponseInput = {
  responseType: string;
  message: string;
  preferredContactMethod: string;
};

export async function saveInvitationResponse(
  inviteId: string,
  input: ResponseInput,
) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return false;

  const { error } = await supabase.from("responses").insert({
    invite_id: inviteId,
    response_type: input.responseType,
    message: input.message || null,
    preferred_contact_method: input.preferredContactMethod,
  });
  if (error) throw error;

  if (input.responseType === "accepted") {
    const now = new Date().toISOString();
    const { error: inviteError } = await supabase
      .from("invites")
      .update({
        status: "accepted",
        accepted_at: now,
        updated_at: now,
      })
      .eq("id", inviteId);
    if (inviteError) throw inviteError;
  }

  return true;
}
