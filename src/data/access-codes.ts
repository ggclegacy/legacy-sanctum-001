import "server-only";

import { createHash } from "node:crypto";

import { defaultSmsTemplate } from "@/data/post-demonstration/bridge-data";
import { getFounderPhoneNumber } from "@/lib/founding/founder-contact";
import type { InvitationExperienceData } from "@/types/invitation";

type BuiltInAccessRecord = {
  invitation: InvitationExperienceData;
  preview: boolean;
};

const standardProducts = [
  {
    id: "fortius-aqua",
    name: "FORTIUS AQUA",
    shortPurpose: "Daily hydration + performance",
    selectionReason:
      "Chosen to make foundational hydration a deliberate part of the day—not an afterthought.",
    usageNote: "Use only as directed on the product label.",
    imagePath: null,
    pillar: "vitality" as const,
  },
  {
    id: "restoria",
    name: "RESTORIA",
    shortPurpose: "Nightly restoration",
    selectionReason:
      "Chosen to reinforce the discipline of recovery after days defined by responsibility and demand.",
    usageNote: "Use only as directed on the product label.",
    imagePath: null,
    pillar: "vitality" as const,
  },
  {
    id: "nexus",
    name: "NEXUS",
    shortPurpose: "Resilience + sustained capability",
    selectionReason:
      "Chosen to support the long view: consistent energy, resilience, and the ability to keep building.",
    usageNote: "Use only as directed on the product label.",
    imagePath: null,
    pillar: "vitality" as const,
  },
];

const previewInvitation: InvitationExperienceData = {
  invitationId: "founder-preview-000",
  firstName: "Neil",
  displayName: "Neil",
  memberNumber: "000",
  memberType: "Founder Preview",
  customHeadline: "A private entry into what comes next.",
  founderMessage:
    "This is the complete Legacy Sanctum invitation protocol—built to turn a package into a personal induction, and an induction into the beginning of a lasting member experience.",
  whySelected:
    "Preview mode uses the same pacing, scenes, product reveal, and future-platform experience as a live invitation. It exists so every new chapter can be reviewed before it reaches a founding member.",
  visionMessage:
    "Legacy Sanctum is becoming a private operating system for men building lives, companies, families, and legacies that demand strength for the long horizon.",
  foundingMemberMessage:
    "Founding members enter before public membership opens. Their early access remains complimentary, and their perspective helps shape the standard, the platform, and the circle around it.",
  postDemonstrationFounderMessage:
    "Neil,\n\nThis is the bridge between the demonstration and the decision: a measured close that gives the vision weight without turning it into a pitch.\n\nLegacy Sanctum is still early. Every detail should make that beginning feel intentional, credible, and worth entering.\n\n— Neil",
  founderPhoneNumber: getFounderPhoneNumber(),
  smsTemplate: defaultSmsTemplate,
  closingMessage:
    "The invitation is ready. Continue refining the experience, then enter again whenever the next chapter is built.",
  products: standardProducts,
  narration: [
    {
      sceneKey: "recognition",
      script:
        "Access recognized. Welcome, Neil. Founder preview designation zero zero zero.",
      audioPath: null,
      durationMs: null,
    },
    {
      sceneKey: "founder",
      script:
        "This experience is the front door to Legacy Sanctum: personal, intentional, and built to become more valuable with every member who enters.",
      audioPath: null,
      durationMs: null,
    },
    {
      sceneKey: "selection",
      script:
        "Every invitation will recognize the man receiving it, the standard he represents, and the reason his presence matters.",
      audioPath: null,
      durationMs: null,
    },
    {
      sceneKey: "pillars",
      script:
        "Legacy Sanctum is built on four disciplines: Vitality, Mindset, Brotherhood, and Legacy.",
      audioPath: null,
      durationMs: null,
    },
    {
      sceneKey: "products",
      script:
        "The products are the first tangible tools in a larger system designed for sustained capability.",
      audioPath: null,
      durationMs: null,
    },
    {
      sceneKey: "platform",
      script:
        "Beyond the box is a private member operating system: protocol, direction, trusted relationships, and the long view in one place.",
      audioPath: null,
      durationMs: null,
    },
    {
      sceneKey: "founding",
      script:
        "Founding access is not a discount. It is a permanent place at the beginning—and a voice in what Legacy Sanctum becomes.",
      audioPath: null,
      durationMs: null,
    },
    {
      sceneKey: "response",
      script:
        "The final step is intentional. Accept your place, leave private feedback, or request a conversation.",
      audioPath: null,
      durationMs: null,
    },
    {
      sceneKey: "completion",
      script:
        "The Sanctum is still being forged. This preview will evolve with every chapter we build.",
      audioPath: null,
      durationMs: null,
    },
  ],
};

const blairInvitation: InvitationExperienceData = {
  invitationId: "blair-vidrine-001",
  firstName: "Blair",
  displayName: "Blair Vidrine",
  memberNumber: "001",
  memberType: "Founding Member",
  customHeadline: "You were selected intentionally.",
  founderMessage:
    "Blair, I wanted you to be one of the first men to experience what I am building with Legacy Sanctum. This is bigger than the products in the box. It is the beginning of a private platform for men who carry real responsibility and intend to build something that lasts.",
  whySelected:
    "You were selected because of the way you lead, the responsibility you carry, and the standard you represent. Legacy Sanctum is being built around men who understand that achievement means more when strength, character, brotherhood, and long-term impact rise together.",
  visionMessage:
    "Legacy Sanctum is becoming a private operating system designed to strengthen the man, sharpen his direction, connect him to the right people, and support the legacy he is still building.",
  foundingMemberMessage:
    "As Founding Member 001, you will receive complimentary early access to the member platform before public membership opens. You are not simply being shown what is coming—your perspective will help shape it.",
  postDemonstrationFounderMessage:
    "Blair,\n\nI selected you intentionally.\n\nI respect what you have built, the responsibility you carry, and the standard you represent.\n\nLegacy Sanctum is still early, but I believe it can become something meaningful for men who carry real weight and are building something beyond themselves.\n\nI wanted you among the first to see it.\n\n— Neil",
  founderPhoneNumber: getFounderPhoneNumber(),
  smsTemplate: defaultSmsTemplate,
  closingMessage:
    "This is the beginning, Blair. I am honored to have you among the first men invited inside.",
  products: standardProducts,
  narration: [
    {
      sceneKey: "recognition",
      script:
        "Identity confirmed. Welcome, Blair. You have been selected as Legacy Sanctum Founding Member Zero Zero One. The Atlas Demonstration is ready.",
      audioPath: null,
      durationMs: null,
    },
    {
      sceneKey: "founder",
      script:
        "Blair, this invitation was created specifically for you. The products in your box are only the first expression of something much larger.",
      audioPath: null,
      durationMs: null,
    },
    {
      sceneKey: "selection",
      script:
        "You were selected because of the way you lead, the responsibility you carry, and the standard you represent.",
      audioPath: null,
      durationMs: null,
    },
    {
      sceneKey: "pillars",
      script:
        "Legacy Sanctum is built on four disciplines: Vitality, Mindset, Brotherhood, and Legacy. Together, they strengthen the whole man.",
      audioPath: null,
      durationMs: null,
    },
    {
      sceneKey: "products",
      script:
        "Each product was chosen as a practical tool for the work ahead—supporting the energy, recovery, and resilience required to keep building.",
      audioPath: null,
      durationMs: null,
    },
    {
      sceneKey: "platform",
      script:
        "Beyond the box, Legacy Sanctum is becoming a private operating system for your protocol, direction, relationships, and long-term legacy.",
      audioPath: null,
      durationMs: null,
    },
    {
      sceneKey: "founding",
      script:
        "As Founding Member zero zero one, you will enter first. Your access will remain complimentary, and your perspective will help shape what comes next.",
      audioPath: null,
      durationMs: null,
    },
    {
      sceneKey: "response",
      script:
        "Your place has been reserved. The final decision is yours.",
      audioPath: null,
      durationMs: null,
    },
    {
      sceneKey: "completion",
      script:
        "This is the beginning, Blair. Welcome to Legacy Sanctum.",
      audioPath: null,
      durationMs: null,
    },
  ],
};

const builtInAccessRecords: Record<string, BuiltInAccessRecord> = {
  "3770adfd5bc7ba1cef6417a7500f979be5b0aa2c2ea0d380030cac196d7f8cce":
    {
      invitation: previewInvitation,
      preview: true,
    },
  "55467c6eb94f5550b6954f5a0b3c3f365ff3276b81ef7201562d1a3cb9c92bb0":
    {
      invitation: blairInvitation,
      preview: false,
    },
};

export function hashAccessCode(accessCode: string) {
  return createHash("sha256")
    .update(accessCode.trim().toUpperCase())
    .digest("hex");
}

export function getBuiltInAccessRecord(accessCodeHash: string) {
  return builtInAccessRecords[accessCodeHash] ?? null;
}
