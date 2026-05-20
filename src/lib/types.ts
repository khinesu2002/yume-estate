export type Language = "en" | "my";
export type AgentRole = "admin" | "agent";
export type ListingType = "sale" | "rent";
export type PropertyStatus = "available" | "pending" | "rented" | "sold" | "unavailable";
export type LandTitleType =
  | "none"
  | "grant"
  | "permit"
  | "ancestral"
  | "farmland"
  | "garden"
  | "freehold"
  | "leasehold"
  | "other";
export type DevelopmentStatus = "developed" | "not_developed";
export type LeadStatus = "new" | "contacted" | "viewing_scheduled" | "negotiating" | "closed" | "lost";
export type ContactSource = "facebook" | "phone" | "referral" | "website" | "walk_in" | "imyanmarhouse" | "shweproperty" | "other";
export type ShowingStatus = "scheduled" | "completed" | "cancelled" | "no_show";
export type TeamMemberRole = "admin" | "seniorAgent" | "agent" | "viewer";
export type TeamMemberStatus = "active" | "inactive";
export type SensitiveAction = "owner_phone_reveal" | "owner_phone_call" | "copy_attempt" | "export_attempt" | "owner_edit";
export type RevealReason = "showing" | "owner_update" | "contract" | "emergency";

export type Agent = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: AgentRole;
  language: Language;
  teamMemberId?: string;
};

export type Owner = {
  name: string;
  phone: string;
  notes: string;
};

export type PropertyMedia = {
  id: string;
  url: string;
  name: string;
  caption: string;
};

export type PropertyRecord = {
  id: string;
  code: string;
  listingType: ListingType;
  propertyType: string;
  landTitleType: LandTitleType;
  developmentStatus: DevelopmentStatus;
  location: string;
  price: string;
  currency: string;
  bedrooms: string;
  bathrooms: string;
  size: string;
  description: string;
  status: PropertyStatus;
  visibility: "private" | "public";
  internalNotes: string;
  owner: Owner;
  media: PropertyMedia[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type PropertyDraft = Omit<PropertyRecord, "id" | "createdAt" | "updatedAt" | "createdBy">;

export type LeadRecord = {
  id: string;
  clientName: string;
  phone: string;
  source: ContactSource;
  status: LeadStatus;
  interestedPropertyId: string;
  notes: string;
  assignedAgent: string;
  createdAt: string;
  updatedAt: string;
};

export type LeadDraft = Omit<LeadRecord, "id" | "createdAt" | "updatedAt" | "assignedAgent">;

export type ClientRequirementRecord = {
  id: string;
  clientName: string;
  phone: string;
  listingType: ListingType | "any";
  propertyType: string;
  township: string;
  minBudget: string;
  maxBudget: string;
  bedrooms: string;
  landTitleType: LandTitleType | "any";
  moveInDate: string;
  notes: string;
  assignedAgent: string;
  createdAt: string;
  updatedAt: string;
};

export type ClientRequirementDraft = Omit<ClientRequirementRecord, "id" | "createdAt" | "updatedAt" | "assignedAgent">;

export type ShowingRecord = {
  id: string;
  propertyId: string;
  clientName: string;
  clientPhone: string;
  scheduledAt: string;
  ownerAvailability: string;
  clientAvailability: string;
  assignedAgent: string;
  assignedTeamMemberId: string;
  assignedTeamMemberName: string;
  status: ShowingStatus;
  result: string;
  nextAction: string;
  createdAt: string;
  updatedAt: string;
};

export type ShowingDraft = Omit<ShowingRecord, "id" | "createdAt" | "updatedAt" | "assignedAgent">;

export type TeamMemberRecord = {
  id: string;
  name: string;
  phone: string;
  role: TeamMemberRole;
  status: TeamMemberStatus;
  firebaseUid: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type TeamMemberDraft = Omit<TeamMemberRecord, "id" | "firebaseUid" | "createdAt" | "updatedAt">;

export type AccessLogRecord = {
  id: string;
  teamMemberId: string;
  teamMemberName: string;
  phone: string;
  eventType: "login";
  timestamp: string;
  userAgent: string;
  authProvider: "phone_otp" | "phone_otp_demo";
};

export type SensitiveAccessLogRecord = {
  id: string;
  teamMemberId: string;
  teamMemberName: string;
  teamMemberRole: TeamMemberRole;
  propertyId: string;
  propertyCode: string;
  ownerName: string;
  reason: RevealReason;
  action: SensitiveAction;
  timestamp: string;
  userAgent: string;
  allowed: boolean;
  riskFlags: string[];
};

export type RevealRequestRecord = {
  id: string;
  teamMemberId: string;
  teamMemberName: string;
  propertyId: string;
  propertyCode: string;
  ownerName: string;
  reason: RevealReason;
  status: "pending" | "approved" | "denied";
  createdAt: string;
  updatedAt: string;
};
