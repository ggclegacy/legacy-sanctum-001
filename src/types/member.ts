export type PillarKey = "vitality" | "mindset" | "brotherhood" | "legacy";

export type MemberIdentity = {
  id: string;
  firstName: string;
  displayName: string;
  memberNumber: string;
  memberType: string;
  headline: string | null;
  currentFocus: string | null;
};

export type MemberObjective = {
  id: string;
  pillar: PillarKey;
  title: string;
  status: string;
  targetDate: string | null;
};

export type ProtocolItem = {
  id: string;
  memberProtocolId: string;
  title: string;
  guidance: string | null;
  completedToday: boolean;
};

export type Reflection = {
  id: string;
  prompt: string;
  response: string;
  createdAt: string;
};

export type LegacyProject = {
  id: string;
  title: string;
  domain: string;
  purpose: string | null;
  status: string;
  targetDate: string | null;
};

export type DirectoryMember = {
  memberId: string;
  displayName: string;
  memberNumber: string;
  headline: string | null;
  expertise: string[];
  seeking: string[];
  offering: string[];
};

export type MemberEvent = {
  id: string;
  title: string;
  summary: string;
  startsAt: string;
  locationLabel: string | null;
  isVirtual: boolean;
  rsvpStatus: string | null;
};

export type MemberAppData = {
  identity: MemberIdentity;
  objectives: MemberObjective[];
  protocolItems: ProtocolItem[];
  reflections: Reflection[];
  legacyProjects: LegacyProject[];
  directory: DirectoryMember[];
  events: MemberEvent[];
  isPreview: boolean;
};
