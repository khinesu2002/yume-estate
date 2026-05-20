import type {
  AccessLogRecord,
  Agent,
  ClientRequirementRecord,
  LeadRecord,
  PropertyRecord,
  RevealRequestRecord,
  SensitiveAccessLogRecord,
  ShowingRecord,
  TeamMemberRecord
} from "@/lib/types";

const AGENT_KEY = "dream-inventory-agent";
const PROPERTY_KEY = "dream-inventory-properties";
const LEAD_KEY = "dream-inventory-leads";
const REQUIREMENT_KEY = "dream-inventory-requirements";
const SHOWING_KEY = "dream-inventory-showings";
const TEAM_MEMBER_KEY = "dream-inventory-team-members";
const ACCESS_LOG_KEY = "dream-inventory-access-logs";
const SENSITIVE_ACCESS_LOG_KEY = "dream-inventory-sensitive-access-logs";
const REVEAL_REQUEST_KEY = "dream-inventory-reveal-requests";

export function loadAgent(): Agent | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(AGENT_KEY);
  return raw ? (JSON.parse(raw) as Agent) : null;
}

export function saveAgent(agent: Agent) {
  window.localStorage.setItem(AGENT_KEY, JSON.stringify(agent));
}

export function clearAgent() {
  window.localStorage.removeItem(AGENT_KEY);
}

export function loadProperties(): PropertyRecord[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(PROPERTY_KEY);
  return raw ? (JSON.parse(raw) as PropertyRecord[]) : [];
}

export function saveProperties(properties: PropertyRecord[]) {
  window.localStorage.setItem(PROPERTY_KEY, JSON.stringify(properties));
}

export function loadLeads(): LeadRecord[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(LEAD_KEY);
  return raw ? (JSON.parse(raw) as LeadRecord[]) : [];
}

export function saveLeads(leads: LeadRecord[]) {
  window.localStorage.setItem(LEAD_KEY, JSON.stringify(leads));
}

export function loadRequirements(): ClientRequirementRecord[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(REQUIREMENT_KEY);
  return raw ? (JSON.parse(raw) as ClientRequirementRecord[]) : [];
}

export function saveRequirements(requirements: ClientRequirementRecord[]) {
  window.localStorage.setItem(REQUIREMENT_KEY, JSON.stringify(requirements));
}

export function loadShowings(): ShowingRecord[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(SHOWING_KEY);
  return raw ? (JSON.parse(raw) as ShowingRecord[]) : [];
}

export function saveShowings(showings: ShowingRecord[]) {
  window.localStorage.setItem(SHOWING_KEY, JSON.stringify(showings));
}

export function loadTeamMembers(): TeamMemberRecord[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(TEAM_MEMBER_KEY);
  return raw ? (JSON.parse(raw) as TeamMemberRecord[]) : [];
}

export function saveTeamMembers(teamMembers: TeamMemberRecord[]) {
  window.localStorage.setItem(TEAM_MEMBER_KEY, JSON.stringify(teamMembers));
}

export function loadAccessLogs(): AccessLogRecord[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(ACCESS_LOG_KEY);
  return raw ? (JSON.parse(raw) as AccessLogRecord[]) : [];
}

export function saveAccessLogs(accessLogs: AccessLogRecord[]) {
  window.localStorage.setItem(ACCESS_LOG_KEY, JSON.stringify(accessLogs));
}

export function loadSensitiveAccessLogs(): SensitiveAccessLogRecord[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(SENSITIVE_ACCESS_LOG_KEY);
  return raw ? (JSON.parse(raw) as SensitiveAccessLogRecord[]) : [];
}

export function saveSensitiveAccessLogs(logs: SensitiveAccessLogRecord[]) {
  window.localStorage.setItem(SENSITIVE_ACCESS_LOG_KEY, JSON.stringify(logs));
}

export function loadRevealRequests(): RevealRequestRecord[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(REVEAL_REQUEST_KEY);
  return raw ? (JSON.parse(raw) as RevealRequestRecord[]) : [];
}

export function saveRevealRequests(requests: RevealRequestRecord[]) {
  window.localStorage.setItem(REVEAL_REQUEST_KEY, JSON.stringify(requests));
}

export function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
