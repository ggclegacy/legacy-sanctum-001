import Link from "next/link";

import {
  MemberPageHeader,
  MemberPanel,
  PillarMark,
} from "@/components/member/member-ui";
import type { MemberAppData, PillarKey } from "@/types/member";

export function AtlasView({ data }: { data: MemberAppData }) {
  const primary = data.objectives[0];
  const openProtocol = data.protocolItems.find(
    (item) => !item.completedToday,
  );
  const pillar: PillarKey = primary?.pillar ?? "legacy";

  return (
    <>
      <MemberPageHeader
        eyebrow="Private guidance"
        title="Atlas"
        description="A structured intelligence layer that helps you see the next meaningful action across the four pillars."
        action={<span className="member-status-badge">Guidance beta</span>}
      />
      <section className="atlas-brief">
        <div className="atlas-orb" aria-hidden="true">
          A
        </div>
        <div>
          <p className="member-panel__label">Today’s direction</p>
          <h2>
            {primary
              ? `Advance ${primary.title.toLowerCase()}.`
              : "Choose one outcome worthy of focused effort."}
          </h2>
          <p>
            {openProtocol
              ? `Complete ${openProtocol.title.toLowerCase()}, then reserve a protected block for the work that moves your ${pillar} objective forward.`
              : "Your physical protocol is clear. Use the recovered attention to move your highest-value objective forward."}
          </p>
        </div>
      </section>
      <div className="member-grid member-grid--three">
        <MemberPanel label="Observe" title="What is true now?">
          <p className="member-body-copy">
            {data.objectives.length
              ? `${data.objectives.length} active objective${data.objectives.length === 1 ? "" : "s"} currently compete for attention.`
              : "No objective has been committed to the system yet."}
          </p>
        </MemberPanel>
        <MemberPanel label="Decide" title="What matters most?">
          <div className="atlas-decision">
            <PillarMark pillar={pillar} />
            <p>
              {primary?.title ??
                "Define the single objective that should shape today."}
            </p>
          </div>
        </MemberPanel>
        <MemberPanel label="Act" title="What happens next?">
          <p className="member-body-copy">
            {openProtocol?.title ??
              "Create your first objective in the Command Center."}
          </p>
        </MemberPanel>
      </div>
      <MemberPanel label="Phase 2 boundary" title="Atlas is guidance—not theater.">
        <p className="member-body-copy">
          This beta uses transparent rules based on your own objectives,
          protocol activity, and reflections. Live generative coaching and
          voice narration will be introduced only after the experience,
          safeguards, and approved model are defined.
        </p>
        <Link href="/member/mindset" className="member-text-link">
          Reflect on today’s direction <span>→</span>
        </Link>
      </MemberPanel>
    </>
  );
}
