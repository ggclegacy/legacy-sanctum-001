import type { InvitationProduct } from "@/types/invitation";

export type PostDemonstrationStage =
  | "transition"
  | "debrief"
  | "member-reveal"
  | "founding-position"
  | "product-connection"
  | "next-steps"
  | "founder-message"
  | "final-induction"
  | "sms-ready";

export type FoundingPrivilegeId =
  | "enter-first"
  | "shape-what-comes-next"
  | "remain-foundation";

export type FoundingPrivilege = {
  id: FoundingPrivilegeId;
  number: string;
  title: string;
  shortLabel: string;
  description: string;
  atlasResponse: string;
};

export type MemberNextStep = {
  id: "now" | "next" | "opens";
  number: string;
  label: string;
  title: string;
  description: string;
};

export const foundingPrivileges: readonly FoundingPrivilege[] = [
  {
    id: "enter-first",
    number: "01",
    title: "Enter First",
    shortLabel: "Private founding phase",
    description:
      "Receive complimentary founding-member access when the private Legacy Sanctum platform begins opening.",
    atlasResponse:
      "Your invitation places you inside the private founding phase before public membership.",
  },
  {
    id: "shape-what-comes-next",
    number: "02",
    title: "Help Shape What Comes Next",
    shortLabel: "Direct perspective",
    description:
      "Early members may be invited to provide direct perspective on the platform, member experience, products, trusted partnerships, and future direction.",
    atlasResponse:
      "Your perspective may inform the standard, the experience, and the direction of what is built next.",
  },
  {
    id: "remain-foundation",
    number: "03",
    title: "Remain Part of the Foundation",
    shortLabel: "Founding designation",
    description:
      "The founding-member designation remains connected to the earliest chapter of Legacy Sanctum as the platform grows.",
    atlasResponse:
      "Your designation remains connected to the earliest chapter—not as ownership, but as part of the institution’s origin.",
  },
] as const;

export const memberNextSteps: readonly MemberNextStep[] = [
  {
    id: "now",
    number: "01",
    label: "Now",
    title: "Experience the products and the vision.",
    description:
      "Nothing more is required tonight. Begin with what has already been placed in your hands.",
  },
  {
    id: "next",
    number: "02",
    label: "Next",
    title: "Receive private founding-member updates.",
    description:
      "Platform previews and selected early invitations will arrive as the next chapter becomes ready.",
  },
  {
    id: "opens",
    number: "03",
    label: "When the Sanctum Opens",
    title: "Enter before public membership.",
    description:
      "Experience the first live version of the private Legacy Sanctum platform during the founding phase.",
  },
] as const;

export const defaultSmsTemplate =
  "Neil — I just completed the Legacy Sanctum experience. The vision is strong, the execution is impressive, and I’m honored to be among the first men selected. I’m in. Looking forward to what’s next.\n\n— {{firstName}}";

export const postDemonstrationNarration: Record<
  PostDemonstrationStage,
  string
> = {
  transition: "The demonstration is complete.",
  debrief:
    "What you have seen is the direction of Legacy Sanctum. Not the finished platform.",
  "member-reveal":
    "{{firstName}}, you were not invited simply to observe what is being built. You were selected to be among the first men inside it.",
  "founding-position":
    "Founding membership is not a discount. It is a position in the earliest chapter of what is being built.",
  "product-connection":
    "The products you received are not the entirety of Legacy Sanctum. They are the first physical expression of it.",
  "next-steps":
    "There is nothing more required of you tonight. Your next step is simply to experience what has been placed in your hands. When the next chapter is ready, you will hear from the founder.",
  "founder-message": "One final message comes directly from the founder.",
  "final-induction":
    "Your invitation has been delivered. Your position has been reserved. The final decision is yours.",
  "sms-ready":
    "Your message is ready. Review it in Messages before deciding whether to send.",
};

export function resolveProductPillar(product: InvitationProduct) {
  return product.pillar ?? "vitality";
}
