import type { Metadata } from "next";

import { VitalityView } from "@/components/member/vitality-view";
import { requireCurrentMemberData } from "@/data/member";

export const metadata: Metadata = {
  title: "Vitality",
};

export default async function VitalityPage() {
  const data = await requireCurrentMemberData();
  return <VitalityView data={data} />;
}
