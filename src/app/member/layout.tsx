import { MemberShell } from "@/components/member/member-shell";
import { requireCurrentMemberData } from "@/data/member";

export const dynamic = "force-dynamic";

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await requireCurrentMemberData();

  return <MemberShell identity={data.identity}>{children}</MemberShell>;
}
