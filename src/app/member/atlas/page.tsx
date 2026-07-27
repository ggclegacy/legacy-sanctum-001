import type { Metadata } from "next";

import { AtlasView } from "@/components/member/atlas-view";
import { requireCurrentMemberData } from "@/data/member";

export const metadata: Metadata = {
  title: "Atlas",
};

export default async function AtlasPage() {
  const data = await requireCurrentMemberData();
  return <AtlasView data={data} />;
}
