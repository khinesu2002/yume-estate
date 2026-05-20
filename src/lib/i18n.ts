import type { Language, ListingType, PropertyStatus } from "@/lib/types";

type LabelMap = Record<string, { en: string; my: string }>;

export const labels: LabelMap = {
  appName: { en: "Dream Property Inventory", my: "Dream အိမ်ခြံမြေစာရင်း" },
  appShort: { en: "Agent OS", my: "အေးဂျင့်စနစ်" },
  signInTitle: { en: "Agent login", my: "အေးဂျင့် ဝင်ရန်" },
  signInCopy: {
    en: "Private workspace for property records, owner details, media, and availability.",
    my: "အိမ်ခြံမြေ၊ ပိုင်ရှင်အချက်အလက်၊ ဓာတ်ပုံနှင့် ရနိုင်မှုအခြေအနေများကို သိမ်းရန် ကိုယ်ပိုင်နေရာ။"
  },
  name: { en: "Name", my: "အမည်" },
  email: { en: "Email", my: "အီးမေးလ်" },
  continue: { en: "Continue", my: "ဆက်ရန်" },
  searchPlaceholder: { en: "Search code, owner, location...", my: "ကုဒ်၊ ပိုင်ရှင်၊ တည်နေရာ ရှာရန်..." },
  addProperty: { en: "Add property", my: "အိမ်ခြံမြေထည့်ရန်" },
  addLead: { en: "Add lead", my: "လိဒ်ထည့်ရန်" },
  addRequirement: { en: "Add requirement", my: "လိုအပ်ချက်ထည့်ရန်" },
  addShowing: { en: "Add showing", my: "အိမ်ကြည့်ချိန်းရန်" },
  editProperty: { en: "Edit property", my: "အချက်အလက်ပြင်ရန်" },
  propertyCode: { en: "Property code", my: "အိမ်ခြံမြေကုဒ်" },
  listing: { en: "Listing", my: "အမျိုးအစား" },
  type: { en: "Property type", my: "အိမ်ခြံမြေအမျိုးအစား" },
  landTitleType: { en: "Land title / ownership type", my: "မြေအမျိုးအစား / ပိုင်ဆိုင်မှု" },
  developmentStatus: { en: "Development", my: "ဖွံ့ဖြိုးမှု" },
  developed: { en: "Developed", my: "ဖွံ့ဖြိုးပြီး" },
  notDeveloped: { en: "Not developed yet", my: "မဖွံ့ဖြိုးသေး" },
  location: { en: "Location", my: "တည်နေရာ" },
  price: { en: "Price", my: "ဈေးနှုန်း" },
  status: { en: "Status", my: "အခြေအနေ" },
  owner: { en: "Owner", my: "ပိုင်ရှင်" },
  ownerPhone: { en: "Owner phone", my: "ပိုင်ရှင်ဖုန်း" },
  ownerNotes: { en: "Owner notes", my: "ပိုင်ရှင်မှတ်ချက်" },
  description: { en: "Description", my: "အသေးစိတ်" },
  internalNotes: { en: "Internal notes", my: "အတွင်းရေးမှတ်ချက်" },
  photos: { en: "Photos / media", my: "ဓာတ်ပုံ / မီဒီယာ" },
  inventory: { en: "Inventory", my: "စာရင်း" },
  leads: { en: "Leads", my: "လိဒ်များ" },
  matching: { en: "Matching", my: "ကိုက်ညီမှု" },
  showings: { en: "Showings", my: "အိမ်ကြည့်ချိန်း" },
  strategy: { en: "Strategy", my: "မဟာဗျူဟာ" },
  security: { en: "Security", my: "လုံခြုံရေး" },
  mySchedule: { en: "My schedule", my: "ကျွန်ုပ်၏ချိန်းဆိုမှု" },
  publicListing: { en: "Public listing", my: "အများမြင်စာရင်း" },
  privateRecord: { en: "Private record", my: "ကိုယ်ပိုင်မှတ်တမ်း" },
  clientName: { en: "Client name", my: "ဖောက်သည်အမည်" },
  phone: { en: "Phone", my: "ဖုန်း" },
  source: { en: "Source", my: "ရင်းမြစ်" },
  requirement: { en: "Requirement", my: "လိုအပ်ချက်" },
  findMatches: { en: "Find matching properties", my: "ကိုက်ညီသောအိမ်ရှာရန်" },
  budget: { en: "Budget", my: "ဘတ်ဂျက်" },
  moveInDate: { en: "Move-in date", my: "နေထိုင်လိုသည့်နေ့" },
  scheduledAt: { en: "Scheduled time", my: "ချိန်းထားသည့်အချိန်" },
  result: { en: "Result", my: "ရလဒ်" },
  nextAction: { en: "Next action", my: "နောက်လုပ်ဆောင်ရန်" },
  saveLead: { en: "Save lead", my: "လိဒ်သိမ်းရန်" },
  saveRequirement: { en: "Save requirement", my: "လိုအပ်ချက်သိမ်းရန်" },
  saveShowing: { en: "Save showing", my: "ချိန်းဆိုမှုသိမ်းရန်" },
  noLeads: { en: "No leads yet. Add every inquiry here.", my: "လိဒ်မရှိသေးပါ။ စုံစမ်းမှုတိုင်းကို ဒီမှာထည့်ပါ။" },
  noRequirements: { en: "No client requirements yet.", my: "ဖောက်သည်လိုအပ်ချက် မရှိသေးပါ။" },
  noShowings: { en: "No showings scheduled yet.", my: "အိမ်ကြည့်ချိန်းဆိုမှု မရှိသေးပါ။" },
  addTeamMember: { en: "Add team member", my: "အဖွဲ့ဝင်ထည့်ရန်" },
  saveTeamMember: { en: "Save team member", my: "အဖွဲ့ဝင်သိမ်းရန်" },
  loginHistory: { en: "Login history", my: "ဝင်ရောက်မှုမှတ်တမ်း" },
  assignedTo: { en: "Assigned to", my: "တာဝန်ပေးထားသူ" },
  noTeamMembers: { en: "No team members yet.", my: "အဖွဲ့ဝင်မရှိသေးပါ။" },
  revealOwnerPhone: { en: "Reveal owner phone", my: "ပိုင်ရှင်ဖုန်းပြရန်" },
  maskedOwnerPhone: { en: "Masked owner phone", my: "ဖုံးကွယ်ထားသော ပိုင်ရှင်ဖုန်း" },
  revealReason: { en: "Reveal reason", my: "ပြသရန်အကြောင်းပြချက်" },
  sensitiveAccess: { en: "Sensitive access", my: "အရေးကြီးအချက်အလက်အသုံးပြုမှု" },
  suspiciousAccess: { en: "Suspicious access", my: "သံသယရှိသောအသုံးပြုမှု" },
  localSecurityWarning: {
    en: "Demo mode uses local browser storage. Do not store real owner data until Firebase rules, Phone Auth, App Check, and Cloud Functions are configured.",
    my: "Demo mode သည် browser local storage ကိုသုံးထားသည်။ Firebase rules, Phone Auth, App Check နှင့် Cloud Functions မပြီးမချင်း ပိုင်ရှင်အချက်အလက်အစစ် မထည့်ပါနှင့်။"
  },
  save: { en: "Save", my: "သိမ်းရန်" },
  cancel: { en: "Cancel", my: "မလုပ်တော့ပါ" },
  all: { en: "All", my: "အားလုံး" },
  sale: { en: "Sale", my: "ရောင်းရန်" },
  rent: { en: "Rent", my: "ငှားရန်" },
  available: { en: "Available", my: "ရနိုင်" },
  pending: { en: "Pending", my: "စောင့်ဆိုင်း" },
  rented: { en: "Rented", my: "ငှားပြီး" },
  sold: { en: "Sold", my: "ရောင်းပြီး" },
  unavailable: { en: "Unavailable", my: "မရနိုင်" },
  records: { en: "records", my: "ခု" },
  noResults: { en: "No properties match this search.", my: "ဤရှာဖွေမှုနှင့် ကိုက်ညီသောစာရင်း မရှိပါ။" },
  details: { en: "Details", my: "အသေးစိတ်" },
  updateStatus: { en: "Update status", my: "အခြေအနေပြောင်းရန်" },
  agentOnly: { en: "Logged-in agents only", my: "ဝင်ထားသော အေးဂျင့်များအတွက်သာ" },
  team: { en: "Team", my: "အဖွဲ့" },
  signOut: { en: "Sign out", my: "ထွက်ရန်" },
  bedroom: { en: "Bed", my: "အိပ်ခန်း" },
  bathroom: { en: "Bath", my: "ရေချိုးခန်း" },
  size: { en: "Size", my: "အရွယ်အစား" },
  lastUpdated: { en: "Last updated", my: "နောက်ဆုံးပြင်ဆင်" },
  seedHint: { en: "Sample records are included for testing.", my: "စမ်းသပ်ရန် နမူနာစာရင်းများ ထည့်ထားသည်။" }
};

export function t(language: Language, key: keyof typeof labels) {
  return labels[key][language];
}

export function listingLabel(language: Language, value: ListingType | "all") {
  if (value === "all") return t(language, "all");
  return t(language, value);
}

export function statusLabel(language: Language, value: PropertyStatus | "all") {
  if (value === "all") return t(language, "all");
  return t(language, value);
}
