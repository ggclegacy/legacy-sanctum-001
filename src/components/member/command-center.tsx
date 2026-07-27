import Link from "next/link";

import { addObjective, toggleProtocolItem } from "@/app/member/actions";
import {
  EmptyState,
  MemberPageHeader,
  MemberPanel,
  PillarMark,
} from "@/components/member/member-ui";
import type { MemberAppData, PillarKey } from "@/types/member";

const pillars: { key: PillarKey; statement: string }[] = [
  { key: "vitality", statement: "Strengthen the foundation." },
  { key: "mindset", statement: "Direct attention with intent." },
  { key: "brotherhood", statement: "Build the right circle." },
  { key: "legacy", statement: "Advance what will endure." },
];

export function CommandCenter({ data }: { data: MemberAppData }) {
  const firstOpenProtocol = data.protocolItems.find(
    (item) => !item.completedToday,
  );
  const primaryObjective = data.objectives.find(
    (objective) => objective.status === "active",
  );

  return (
    <>
      <MemberPageHeader
        eyebrow="Member command"
        title={`Good ${getDayPart()}, ${data.identity.firstName}.`}
        description="A clear view of what deserves your attention now—without noise, scores, or manufactured urgency."
        action={
          <span className="member-number-chip">
            Founding Member {data.identity.memberNumber}
          </span>
        }
      />

      <section className="member-briefing">
        <div>
          <p className="member-panel__label">Atlas briefing</p>
          <h2>
            {primaryObjective
              ? `Move “${primaryObjective.title}” forward.`
              : "Choose the objective that matters most now."}
          </h2>
          <p>
            {firstOpenProtocol
              ? `Begin by completing ${firstOpenProtocol.title.toLowerCase()}. Then protect one uninterrupted block for your highest-priority work.`
              : "Your protocol is clear. Protect one uninterrupted block for your highest-priority work."}
          </p>
        </div>
        <Link href="/member/atlas" className="member-text-link">
          Open Atlas guidance <span>↗</span>
        </Link>
      </section>

      <div className="member-grid member-grid--command">
        <MemberPanel label="Today" title="Protocol">
          {data.protocolItems.length ? (
            <div className="protocol-list">
              {data.protocolItems.slice(0, 4).map((item) => (
                <form action={toggleProtocolItem} key={item.id}>
                  <input type="hidden" name="itemId" value={item.id} />
                  <input
                    type="hidden"
                    name="memberProtocolId"
                    value={item.memberProtocolId}
                  />
                  <input
                    type="hidden"
                    name="completed"
                    value={String(!item.completedToday)}
                  />
                  <button
                    type="submit"
                    className={
                      item.completedToday
                        ? "protocol-item is-complete"
                        : "protocol-item"
                    }
                  >
                    <span className="protocol-check" aria-hidden="true">
                      {item.completedToday ? "✓" : ""}
                    </span>
                    <span>
                      <strong>{item.title}</strong>
                      {item.guidance ? <small>{item.guidance}</small> : null}
                    </span>
                  </button>
                </form>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No protocol assigned"
              body="Your approved daily protocol will appear here once it is assigned."
            />
          )}
          <Link href="/member/vitality" className="member-text-link">
            View Vitality <span>→</span>
          </Link>
        </MemberPanel>

        <MemberPanel label="Current direction" title="Active objectives">
          {data.objectives.length ? (
            <div className="objective-list">
              {data.objectives.slice(0, 4).map((objective) => (
                <article key={objective.id} className="objective-row">
                  <PillarMark pillar={objective.pillar} />
                  <div>
                    <strong>{objective.title}</strong>
                    <small>{objective.pillar}</small>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Set your first objective"
              body="Name one clear outcome. Legacy Sanctum will organize the work around it."
            />
          )}
          {!data.isPreview ? (
            <form action={addObjective} className="member-inline-form">
              <input
                name="title"
                placeholder="Add a focused objective"
                minLength={3}
                maxLength={180}
                required
              />
              <select name="pillar" defaultValue="legacy">
                {pillars.map((pillar) => (
                  <option key={pillar.key} value={pillar.key}>
                    {pillar.key}
                  </option>
                ))}
              </select>
              <button type="submit" aria-label="Add objective">
                +
              </button>
            </form>
          ) : null}
        </MemberPanel>
      </div>

      <section className="pillar-overview">
        {pillars.map((pillar) => {
          const count = data.objectives.filter(
            (objective) => objective.pillar === pillar.key,
          ).length;
          return (
            <Link href={`/member/${pillar.key}`} key={pillar.key}>
              <PillarMark pillar={pillar.key} />
              <span>
                <strong>{pillar.key}</strong>
                <small>{pillar.statement}</small>
              </span>
              <em>{count ? `${count} active` : "Begin"}</em>
            </Link>
          );
        })}
      </section>
    </>
  );
}

function getDayPart() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}
