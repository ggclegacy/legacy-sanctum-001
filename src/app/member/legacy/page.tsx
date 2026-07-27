import type { Metadata } from "next";

import { LegacyView } from "@/components/member/legacy-view";
import { requireCurrentMemberData } from "@/data/member";

export const metadata: Metadata = {
  title: "Legacy",
};

export default async function LegacyPage() {
  const data = await requireCurrentMemberData();
  return <LegacyView data={data} />;
}
