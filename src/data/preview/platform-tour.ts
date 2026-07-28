export type PlatformTourChapterId =
  | "command-center"
  | "vitality"
  | "hormones"
  | "bloodwork"
  | "protocols"
  | "training"
  | "atlas-intelligence"
  | "mindset"
  | "brotherhood"
  | "vision"
  | "legacy-vault"
  | "integrated-system";

export type PlatformTourChapter = {
  id: PlatformTourChapterId;
  number: string;
  navLabel: string;
  eyebrow: string;
  title: string;
  narration: string;
  silentDurationMs: number;
  disclosure?: string;
};

export const platformTourPrologue = {
  narration:
    "{firstName}, what you are about to see is an application now in development. Legacy Sanctum is being built as a private member operating system—one place for the signals, decisions, relationships, and legacy that shape the whole man. Step inside.",
  silentDurationMs: 10_500,
} as const;

export const platformTourChapters: readonly PlatformTourChapter[] = [
  {
    id: "command-center",
    number: "01",
    navLabel: "Command",
    eyebrow: "The member operating system",
    title: "Everything important. One field of view.",
    narration:
      "{firstName}, this is the future Legacy Sanctum Command Center. One private view connects today’s priorities, your four pillars, active protocols, key relationships, and the decisions that deserve your attention.",
    silentDurationMs: 12_000,
    disclosure: "Simulated future platform",
  },
  {
    id: "vitality",
    number: "02",
    navLabel: "Vitality",
    eyebrow: "Whole-system vitality",
    title: "Signals become context.",
    narration:
      "Vitality brings sleep, recovery, movement, stress, nutrition, and wearable signals into one living system. Atlas does not reduce the man to a score. It shows what changed, what may be connected, and what deserves a closer look.",
    silentDurationMs: 13_000,
    disclosure: "Demonstration data · not medical analysis",
  },
  {
    id: "hormones",
    number: "03",
    navLabel: "Hormones",
    eyebrow: "Longitudinal hormone intelligence",
    title: "Beyond the single snapshot.",
    narration:
      "Hormone tracking becomes a longitudinal record, not an isolated lab result. Clinician-provided markers, symptoms, protocol notes, and testing history can be viewed together, with every interpretation reserved for the member and his qualified care team.",
    silentDurationMs: 13_000,
    disclosure: "Clinician-coordinated tracking concept",
  },
  {
    id: "bloodwork",
    number: "04",
    navLabel: "Labs",
    eyebrow: "Bloodwork intelligence",
    title: "See the movement, not just the number.",
    narration:
      "Bloodwork becomes a clear timeline across metabolic health, inflammation, nutrients, cardiovascular markers, and hormones. Atlas can surface meaningful movement and prepare better questions, without diagnosing or replacing a physician.",
    silentDurationMs: 13_000,
    disclosure: "Illustrative markers · future capability",
  },
  {
    id: "protocols",
    number: "05",
    navLabel: "Protocol",
    eyebrow: "Protocol stewardship",
    title: "The plan stays accountable.",
    narration:
      "Daily protocols, prescriptions, supplements, recovery practices, and clinician-directed peptide programs can live in one accountable timeline. The system tracks schedule, adherence, notes, and care-team context. Atlas never prescribes, doses, or changes a clinician’s plan.",
    silentDurationMs: 14_000,
    disclosure: "Tracking only · no prescribing or dosing",
  },
  {
    id: "training",
    number: "06",
    navLabel: "Training",
    eyebrow: "Performance and training",
    title: "Training meets the rest of the day.",
    narration:
      "Training is connected to recovery, schedule demand, and long-term progression. The member sees the current block, today’s session, movement quality, and recovery emphasis while Atlas explains why the plan may need to adapt.",
    silentDurationMs: 12_000,
    disclosure: "Simulated performance plan",
  },
  {
    id: "atlas-intelligence",
    number: "07",
    navLabel: "Atlas",
    eyebrow: "Atlas · Whole-man intelligence",
    title: "The intelligence behind the whole man.",
    narration:
      "{firstName}, now meet Atlas. Atlas is the intelligence layer connecting every part of Legacy Sanctum. It tracks the signals you choose to bring into the system: vitality, hormones, bloodwork, protocols, training, mindset, relationships, schedule, vision, and legacy. It does not see isolated data. It understands how the parts affect the whole. Atlas observes what changed, connects the context, explains what matters, anticipates where friction may appear, and helps you decide what to do next. It never replaces your judgment or your physician. It gives you one transparent intelligence built around the life you are actually leading.",
    silentDurationMs: 35_000,
    disclosure: "Simulated intelligence · member-controlled context",
  },
  {
    id: "mindset",
    number: "08",
    navLabel: "Mindset",
    eyebrow: "Clarity and growth",
    title: "A private record of how you operate.",
    narration:
      "Mindset turns reflection into an operating advantage. Decisions, lessons, principles, and weekly reviews create a private record of how the member thinks, where attention is going, and what growth requires next.",
    silentDurationMs: 12_000,
  },
  {
    id: "brotherhood",
    number: "09",
    navLabel: "Brotherhood",
    eyebrow: "The private circle",
    title: "The right man. The right moment.",
    narration:
      "Brotherhood is not a social feed. It is a verified private network built around trusted introductions, small circles, relevant events, shared standards, and access to members or experts who can genuinely move the mission forward.",
    silentDurationMs: 13_000,
    disclosure: "Illustrative member network",
  },
  {
    id: "vision",
    number: "10",
    navLabel: "Vision",
    eyebrow: "Vision and growth",
    title: "Turn the horizon into an operating plan.",
    narration:
      "Vision and Growth connects the long horizon to the present week. Business, family, vitality, contribution, and personal objectives become one evolving map, so daily action remains aligned with what the member is actually building.",
    silentDurationMs: 13_000,
  },
  {
    id: "legacy-vault",
    number: "11",
    navLabel: "Vault",
    eyebrow: "The Legacy Vault",
    title: "Preserve what should outlive you.",
    narration:
      "Legacy extends beyond achievement. The Vault protects letters, voice recordings, family principles, milestones, hard-earned lessons, and the wisdom meant for future generations—organized privately, in the member’s own words.",
    silentDurationMs: 13_000,
    disclosure: "Encrypted vault concept",
  },
  {
    id: "integrated-system",
    number: "12",
    navLabel: "System",
    eyebrow: "One connected life",
    title: "The platform learns the whole man.",
    narration:
      "This is the future of Legacy Sanctum. Vitality, mindset, brotherhood, and legacy operating as one private system. Not more noise. More clarity. Not another app to manage. An intelligence designed to help the man protect what matters and build what lasts.",
    silentDurationMs: 15_000,
  },
] as const;

export function personalizeTourNarration(
  narration: string,
  firstName: string,
) {
  return narration.replaceAll("{firstName}", firstName);
}
