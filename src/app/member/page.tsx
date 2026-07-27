import type { Metadata } from "next";

import { CommandCenter } from "@/components/member/command-center";
import { requireCurrentMemberData } from "@/data/member";

export const metadata: Metadata = {
  title: "Command Center",
};

export default async function MemberCommandPage() {
  const data = await requireCurrentMemberData();
  return <CommandCenter data={data} />;
}
