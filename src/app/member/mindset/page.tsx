import type { Metadata } from "next";

import { MindsetView } from "@/components/member/mindset-view";
import { requireCurrentMemberData } from "@/data/member";

export const metadata: Metadata = {
  title: "Mindset",
};

export default async function MindsetPage() {
  const data = await requireCurrentMemberData();
  return <MindsetView data={data} />;
}
