import {
  requestIntroduction,
  setEventRsvp,
} from "@/app/member/actions";
import {
  EmptyState,
  MemberPageHeader,
  MemberPanel,
} from "@/components/member/member-ui";
import type { MemberAppData } from "@/types/member";

export function BrotherhoodView({ data }: { data: MemberAppData }) {
  return (
    <>
      <MemberPageHeader
        eyebrow="Pillar 03"
        title="Brotherhood"
        description="A curated circle built around useful relationships, intentional introductions, and trusted access."
      />
      <MemberPanel label="Sanctum Circle" title="Curated members">
        {data.directory.length ? (
          <div className="directory-grid">
            {data.directory.map((member) => (
              <article className="directory-card" key={member.memberId}>
                <span className="directory-card__number">
                  {member.memberNumber}
                </span>
                <h3>{member.displayName}</h3>
                <p>{member.headline ?? "Private member"}</p>
                {member.expertise.length ? (
                  <div className="member-tags">
                    {member.expertise.slice(0, 3).map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                ) : null}
                {!data.isPreview ? (
                  <details>
                    <summary>Request an introduction</summary>
                    <form action={requestIntroduction}>
                      <input
                        type="hidden"
                        name="targetMemberId"
                        value={member.memberId}
                      />
                      <textarea
                        name="reason"
                        placeholder="Why would this introduction be valuable to both men?"
                        minLength={12}
                        maxLength={1000}
                        required
                      />
                      <button type="submit">Send for review</button>
                    </form>
                  </details>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="The circle is being curated"
            body="Only approved, opted-in member profiles will appear here. Phase 2 does not include open messaging."
          />
        )}
      </MemberPanel>
      <MemberPanel label="Private experiences" title="Upcoming">
        {data.events.length ? (
          <div className="event-list">
            {data.events.map((event) => (
              <article key={event.id}>
                <time dateTime={event.startsAt}>
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  }).format(new Date(event.startsAt))}
                </time>
                <div>
                  <h3>{event.title}</h3>
                  <p>{event.summary}</p>
                  <small>
                    {event.isVirtual
                      ? "Private virtual gathering"
                      : event.locationLabel ?? "Location shared with attendees"}
                  </small>
                </div>
                {!data.isPreview ? (
                  <form action={setEventRsvp}>
                    <input type="hidden" name="eventId" value={event.id} />
                    <input type="hidden" name="status" value="interested" />
                    <button type="submit">
                      {event.rsvpStatus === "interested"
                        ? "Interest recorded"
                        : "I’m interested"}
                    </button>
                  </form>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No experiences announced"
            body="Approved gatherings and private sessions will appear here when scheduled."
          />
        )}
      </MemberPanel>
    </>
  );
}
