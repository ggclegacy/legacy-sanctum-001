import { saveReflection } from "@/app/member/actions";
import {
  EmptyState,
  MemberPageHeader,
  MemberPanel,
} from "@/components/member/member-ui";
import type { MemberAppData } from "@/types/member";

const dailyPrompt =
  "What deserves your full attention today—and what must you refuse to protect it?";

export function MindsetView({ data }: { data: MemberAppData }) {
  return (
    <>
      <MemberPageHeader
        eyebrow="Pillar 02"
        title="Mindset"
        description="Clarify your direction, examine your decisions, and maintain standards under pressure."
      />
      <div className="member-grid member-grid--split">
        <MemberPanel label="Daily reflection" title={dailyPrompt}>
          {data.isPreview ? (
            <EmptyState
              title="Private reflection space"
              body="Authenticated members can write and preserve their response here."
            />
          ) : (
            <form action={saveReflection} className="reflection-form">
              <input type="hidden" name="prompt" value={dailyPrompt} />
              <textarea
                name="response"
                placeholder="Write with clarity. This remains private to your member account."
                rows={7}
                minLength={3}
                maxLength={4000}
                required
              />
              <button type="submit" className="member-primary-button">
                Preserve reflection
              </button>
            </form>
          )}
        </MemberPanel>
        <MemberPanel label="Recent entries" title="Reflection archive">
          {data.reflections.length ? (
            <div className="reflection-list">
              {data.reflections.map((reflection) => (
                <article key={reflection.id}>
                  <time dateTime={reflection.createdAt}>
                    {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(reflection.createdAt))}
                  </time>
                  <strong>{reflection.prompt}</strong>
                  <p>{reflection.response}</p>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No entries yet"
              body="Your preserved reflections will form a private record of how your thinking evolves."
            />
          )}
        </MemberPanel>
      </div>
    </>
  );
}
