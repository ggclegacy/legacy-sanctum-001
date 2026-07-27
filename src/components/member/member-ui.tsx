import type { PillarKey } from "@/types/member";

export function MemberPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="member-page-header">
      <div>
        <p className="micro-label">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action ? <div>{action}</div> : null}
    </header>
  );
}

export function MemberPanel({
  label,
  title,
  children,
  className = "",
}: {
  label?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`member-panel ${className}`.trim()}>
      {label ? <p className="member-panel__label">{label}</p> : null}
      {title ? <h2>{title}</h2> : null}
      {children}
    </section>
  );
}

export function EmptyState({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="member-empty">
      <span aria-hidden="true">◇</span>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

export function PillarMark({ pillar }: { pillar: PillarKey }) {
  return (
    <span className={`pillar-mark pillar-mark--${pillar}`} aria-hidden="true">
      {pillar.slice(0, 1).toUpperCase()}
    </span>
  );
}
