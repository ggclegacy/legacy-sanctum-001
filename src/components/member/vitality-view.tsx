import { toggleProtocolItem } from "@/app/member/actions";
import {
  EmptyState,
  MemberPageHeader,
  MemberPanel,
} from "@/components/member/member-ui";
import type { MemberAppData } from "@/types/member";

export function VitalityView({ data }: { data: MemberAppData }) {
  const completed = data.protocolItems.filter(
    (item) => item.completedToday,
  ).length;

  return (
    <>
      <MemberPageHeader
        eyebrow="Pillar 01"
        title="Vitality"
        description="The physical foundation: intentional protocols, daily consistency, and access to approved wellness guidance."
        action={
          <span className="member-number-chip">
            {data.protocolItems.length
              ? `${completed} of ${data.protocolItems.length} complete`
              : "Awaiting protocol"}
          </span>
        }
      />
      <div className="member-grid member-grid--split">
        <MemberPanel label="Member protocol" title="Today">
          {data.protocolItems.length ? (
            <div className="protocol-list protocol-list--expanded">
              {data.protocolItems.map((item) => (
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
                      <small>
                        {item.guidance ??
                          "Complete according to your approved protocol."}
                      </small>
                    </span>
                  </button>
                </form>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No protocol assigned"
              body="This surface will contain only approved, member-specific guidance—not generic medical recommendations."
            />
          )}
        </MemberPanel>
        <div className="member-stack">
          <MemberPanel label="Principle" title="Measure consistency, not worth.">
            <p className="member-body-copy">
              Vitality records what you intentionally complete. It does not
              diagnose conditions, create clinical scores, or replace a
              qualified professional.
            </p>
          </MemberPanel>
          <MemberPanel label="Professional access" title="Trusted network">
            <p className="member-body-copy">
              Approved practitioners and resources will appear here as the
              Legacy Wellness Network is established.
            </p>
            <span className="member-status-badge">Planned access layer</span>
          </MemberPanel>
        </div>
      </div>
    </>
  );
}
