import type { Metadata } from "next";

import { BrotherhoodView } from "@/components/member/brotherhood-view";
import { requireCurrentMemberData } from "@/data/member";

export const metadata: Metadata = {
  title: "Brotherhood",
};

export default async function BrotherhoodPage() {
  const data = await requireCurrentMemberData();
  return <BrotherhoodView data={data} />;
}
