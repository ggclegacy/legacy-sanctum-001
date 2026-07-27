import type { AtlasDemonstrationMember } from "@/lib/preview/preview-types";

export function MemberCore({
  member,
  active,
  onReset,
}: {
  member: AtlasDemonstrationMember;
  active: boolean;
  onReset: () => void;
}) {
  return (
    <button
      className={`connected-member-core${active ? " is-active" : ""}`}
      type="button"
      onClick={onReset}
      aria-label="Return to the complete Connected Man view"
    >
      <i aria-hidden="true" />
      <span>{member.firstName.slice(0, 1).toUpperCase()}</span>
      <strong>{member.firstName}</strong>
      <small>{member.memberType}</small>
    </button>
  );
}
