"use client";

import { t } from "@/lib/i18n";
import type {
  ClientRequirementDraft,
  ClientRequirementRecord,
  ContactSource,
  DevelopmentStatus,
  LandTitleType,
  Language,
  LeadDraft,
  LeadStatus,
  ListingType,
  PropertyDraft,
  PropertyRecord,
  PropertyStatus,
  RevealReason,
  SensitiveAccessLogRecord,
  ShowingDraft,
  ShowingRecord,
  ShowingStatus,
  TeamMemberDraft,
  TeamMemberRecord,
  TeamMemberRole
} from "@/lib/types";

export type ActiveTab = "inventory" | "leads" | "matching" | "showings" | "mySchedule" | "team" | "security" | "strategy";
export type RevealState = { propertyId: string; expiresAt: number } | null;

export const propertyTypes = ["condo", "house", "land", "commercial", "apartment", "shop"];
export const statuses: PropertyStatus[] = ["available", "pending", "rented", "sold", "unavailable"];
export const landTitleTypes: LandTitleType[] = ["none", "grant", "permit", "ancestral", "farmland", "garden", "freehold", "leasehold", "other"];
export const leadStatuses: LeadStatus[] = ["new", "contacted", "viewing_scheduled", "negotiating", "closed", "lost"];
export const contactSources: ContactSource[] = ["facebook", "phone", "referral", "website", "walk_in", "imyanmarhouse", "shweproperty", "other"];
export const showingStatuses: ShowingStatus[] = ["scheduled", "completed", "cancelled", "no_show"];
export const teamRoles: TeamMemberRole[] = ["admin", "seniorAgent", "agent", "viewer"];
export const revealReasons: RevealReason[] = ["showing", "owner_update", "contract", "emergency"];

export const typeLabels: Record<string, { en: string; my: string }> = {
  condo: { en: "Condo", my: "ကွန်ဒို" },
  house: { en: "House", my: "အိမ်" },
  land: { en: "Land", my: "မြေ" },
  commercial: { en: "Commercial", my: "စီးပွားရေး" },
  apartment: { en: "Apartment", my: "တိုက်ခန်း" },
  shop: { en: "Shop", my: "ဆိုင်ခန်း" }
};

export const landTitleLabels: Record<LandTitleType, { en: string; my: string }> = {
  none: { en: "Not land / not set", my: "မြေမဟုတ် / မသတ်မှတ်ရသေး" },
  grant: { en: "Grant land", my: "ဂရန်မြေ" },
  permit: { en: "Permit land", my: "ပါမစ်မြေ" },
  ancestral: { en: "Ancestral land", my: "ဘိုးဘွားပိုင်မြေ" },
  farmland: { en: "Farmland", my: "လယ်ယာမြေ" },
  garden: { en: "Garden land", my: "ဥယျာဉ်ခြံမြေ" },
  freehold: { en: "Freehold land", my: "အပိုင်မြေ" },
  leasehold: { en: "Leasehold land", my: "ငှားရမ်းမြေ" },
  other: { en: "Other / verify", my: "အခြား / စစ်ဆေးရန်" }
};

export const sourceLabels: Record<ContactSource, string> = {
  facebook: "Facebook",
  phone: "Phone",
  referral: "Referral",
  website: "Website",
  walk_in: "Walk-in",
  imyanmarhouse: "iMyanmarHouse",
  shweproperty: "ShweProperty",
  other: "Other"
};

export const leadStatusLabels: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  viewing_scheduled: "Viewing scheduled",
  negotiating: "Negotiating",
  closed: "Closed",
  lost: "Lost"
};

export const showingStatusLabels: Record<ShowingStatus, string> = {
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No-show"
};

export const teamRoleLabels: Record<TeamMemberRole, string> = {
  admin: "Admin",
  seniorAgent: "Senior agent",
  agent: "Agent",
  viewer: "Viewer"
};

export const revealReasonLabels: Record<RevealReason, string> = {
  showing: "Showing",
  owner_update: "Owner update",
  contract: "Contract",
  emergency: "Emergency"
};

export function developmentLabel(language: Language, value: DevelopmentStatus) {
  return value === "developed" ? t(language, "developed") : t(language, "notDeveloped");
}

export function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const tail = digits.slice(-3) || "***";
  if (phone.startsWith("+95")) return `+95 9 *** *** ${tail}`;
  return `*** *** ${tail}`;
}

export function isAfterHours(date: Date) {
  const hour = date.getHours();
  return hour < 7 || hour >= 21;
}

export function getRiskFlags(logs: SensitiveAccessLogRecord[], teamMemberId: string, now: Date) {
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const todayReveals = logs.filter((log) => log.teamMemberId === teamMemberId && new Date(log.timestamp).getTime() >= dayStart).length;
  const flags: string[] = [];
  if (todayReveals >= 5) flags.push("many_reveals_today");
  if (isAfterHours(now)) flags.push("after_hours");
  return flags;
}

export function canRevealOwnerPhone(member: TeamMemberRecord | undefined, property: PropertyRecord, showings: ShowingRecord[]) {
  if (!member || member.status !== "active") return false;
  if (member.role === "admin" || member.role === "seniorAgent") return true;
  if (member.role === "viewer") return false;
  return showings.some((showing) => showing.propertyId === property.id && showing.assignedTeamMemberId === member.id);
}

export function blankPropertyDraft(): PropertyDraft {
  return {
    code: "",
    listingType: "sale",
    propertyType: "condo",
    landTitleType: "none",
    developmentStatus: "developed",
    location: "",
    price: "",
    currency: "MMK",
    bedrooms: "",
    bathrooms: "",
    size: "",
    description: "",
    status: "available",
    visibility: "private",
    internalNotes: "",
    owner: { name: "", phone: "", notes: "" },
    media: []
  };
}

export function blankLeadDraft(propertyId = ""): LeadDraft {
  return {
    clientName: "",
    phone: "",
    source: "phone",
    status: "new",
    interestedPropertyId: propertyId,
    notes: ""
  };
}

export function blankRequirementDraft(): ClientRequirementDraft {
  return {
    clientName: "",
    phone: "",
    listingType: "any",
    propertyType: "all",
    township: "",
    minBudget: "",
    maxBudget: "",
    bedrooms: "",
    landTitleType: "any",
    moveInDate: "",
    notes: ""
  };
}

export function blankShowingDraft(propertyId = "", teamMember?: TeamMemberRecord): ShowingDraft {
  return {
    propertyId,
    clientName: "",
    clientPhone: "",
    scheduledAt: "",
    ownerAvailability: "",
    clientAvailability: "",
    assignedTeamMemberId: teamMember?.id ?? "",
    assignedTeamMemberName: teamMember?.name ?? "",
    status: "scheduled",
    result: "",
    nextAction: ""
  };
}

export function blankTeamMemberDraft(): TeamMemberDraft {
  return {
    name: "",
    phone: "",
    role: "agent",
    status: "active",
    notes: ""
  };
}

export function normalizeProperty(property: PropertyRecord): PropertyRecord {
  return {
    ...property,
    landTitleType: property.landTitleType ?? "none",
    developmentStatus: property.developmentStatus ?? "developed",
    visibility: property.visibility ?? "private"
  };
}

export function normalizeShowing(showing: ShowingRecord): ShowingRecord {
  return {
    ...showing,
    assignedTeamMemberId: showing.assignedTeamMemberId ?? "",
    assignedTeamMemberName: showing.assignedTeamMemberName ?? showing.assignedAgent ?? "Unassigned"
  };
}

export function formatPrice(property: PropertyRecord) {
  if (!property.price) return "Price not set";
  const asNumber = Number(property.price);
  if (Number.isNaN(asNumber)) return `${property.price} ${property.currency}`;
  return `${new Intl.NumberFormat("en-US").format(asNumber)} ${property.currency}`;
}

export function formatDate(value: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function nextCode(properties: PropertyRecord[]) {
  return `MMR-${String(properties.length + 1).padStart(3, "0")}`;
}

export function propertyMatchesSearch(property: PropertyRecord, search: string) {
  const haystack = [
    property.code,
    property.location,
    property.propertyType,
    property.landTitleType,
    property.developmentStatus,
    property.description,
    property.internalNotes,
    property.owner.name
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(search.trim().toLowerCase());
}

export function getProperty(properties: PropertyRecord[], propertyId: string) {
  return properties.find((property) => property.id === propertyId);
}

export function isShowingInWindow(showing: ShowingRecord, filter: string) {
  if (filter === "all") return true;
  if (!showing.scheduledAt) return filter === "all";

  const scheduled = new Date(showing.scheduledAt);
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const tomorrow = new Date(start);
  tomorrow.setDate(start.getDate() + 1);
  const afterTomorrow = new Date(start);
  afterTomorrow.setDate(start.getDate() + 2);
  const weekEnd = new Date(start);
  weekEnd.setDate(start.getDate() + 7);

  if (filter === "today") return scheduled >= start && scheduled < tomorrow;
  if (filter === "tomorrow") return scheduled >= tomorrow && scheduled < afterTomorrow;
  if (filter === "week") return scheduled >= start && scheduled < weekEnd;
  return true;
}

export function scoreMatch(requirement: ClientRequirementRecord, property: PropertyRecord) {
  let score = 0;
  if (property.status !== "available") return -1;
  if (requirement.listingType !== "any" && property.listingType !== requirement.listingType) return -1;
  if (requirement.propertyType !== "all" && property.propertyType !== requirement.propertyType) return -1;
  if (requirement.landTitleType !== "any" && property.landTitleType !== requirement.landTitleType) return -1;

  if (requirement.township && property.location.toLowerCase().includes(requirement.township.toLowerCase())) score += 30;
  if (requirement.bedrooms && Number(property.bedrooms || 0) >= Number(requirement.bedrooms)) score += 15;

  const price = Number(property.price || 0);
  const min = Number(requirement.minBudget || 0);
  const max = Number(requirement.maxBudget || 0);
  if (price && (!min || price >= min) && (!max || price <= max)) score += 35;
  if (!price || (!min && !max)) score += 10;

  score += property.visibility === "public" ? 5 : 0;
  score += property.media.length ? 5 : 0;
  return score;
}
