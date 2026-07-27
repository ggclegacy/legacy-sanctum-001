import { addLegacyProject } from "@/app/member/actions";
import {
  EmptyState,
  MemberPageHeader,
  MemberPanel,
} from "@/components/member/member-ui";
import type { MemberAppData } from "@/types/member";

const domains = [
  "business",
  "family",
  "wealth",
  "service",
  "leadership",
  "other",
] as const;

export function LegacyView({ data }: { data: MemberAppData }) {
  return (
    <>
      <MemberPageHeader
        eyebrow="Pillar 04"
        title="Legacy"
        description="Define what you are building, why it matters, and the next meaningful movement toward it."
      />
      <div className="member-grid member-grid--split">
        <MemberPanel label="Long horizon" title="Active legacy work">
          {data.legacyProjects.length ? (
            <div className="legacy-projects">
              {data.legacyProjects.map((project) => (
                <article key={project.id}>
                  <div>
                    <span>{project.domain}</span>
                    <h3>{project.title}</h3>
                    {project.purpose ? <p>{project.purpose}</p> : null}
                  </div>
                  <small>{project.status}</small>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Name what must endure"
              body="Create a project around the business, family, leadership, service, or ownership work you intend to advance."
            />
          )}
        </MemberPanel>
        <MemberPanel label="Create" title="Define a legacy project">
          {data.isPreview ? (
            <p className="member-body-copy">
              Authenticated founding members can create and privately maintain
              their legacy work here.
            </p>
          ) : (
            <form action={addLegacyProject} className="member-form">
              <label>
                Project
                <input
                  name="title"
                  placeholder="What are you building?"
                  minLength={3}
                  maxLength={180}
                  required
                />
              </label>
              <label>
                Domain
                <select name="domain" defaultValue="business">
                  {domains.map((domain) => (
                    <option value={domain} key={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Purpose
                <textarea
                  name="purpose"
                  placeholder="Why must this exist, grow, or endure?"
                  maxLength={1000}
                  rows={5}
                />
              </label>
              <button type="submit" className="member-primary-button">
                Create project
              </button>
            </form>
          )}
        </MemberPanel>
      </div>
    </>
  );
}
