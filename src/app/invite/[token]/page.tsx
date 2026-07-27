import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InviteGate } from "@/components/invitation/invite-gate";
import { inviteTokenSchema } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Private Invitation",
};

export default async function InvitePage({
  params,
}: PageProps<"/invite/[token]">) {
  const { token } = await params;
  const parsed = inviteTokenSchema.safeParse(token);

  if (!parsed.success) notFound();

  return <InviteGate token={parsed.data} />;
}
