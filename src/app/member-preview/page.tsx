import { notFound } from "next/navigation";

import { CommandCenter } from "@/components/member/command-center";
import { MemberShell } from "@/components/member/member-shell";
import { getMemberPreviewData } from "@/data/member";

export const dynamic = "force-dynamic";

export default function MemberPreviewPage() {
  const data = getMemberPreviewData();
  if (!data) notFound();

  return (
    <MemberShell identity={data.identity} preview>
      <div className="internal-preview-banner">
        Internal visual preview · no live member data
      </div>
      <CommandCenter data={data} />
    </MemberShell>
  );
}
