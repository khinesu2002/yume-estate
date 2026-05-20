"use client";

import {
  loadAccessLogsFromFirebase,
  loadLeadsFromFirebase,
  loadPropertiesFromFirebase,
  loadRevealRequestsFromFirebase,
  loadRequirementsFromFirebase,
  loadSensitiveAccessLogsFromFirebase,
  loadShowingsFromFirebase,
  loadTeamMembersFromFirebase,
  saveAccessLogsToFirebase,
  saveAgentToFirebase,
  saveLeadsToFirebase,
  savePropertiesToFirebase,
  saveRevealRequestsToFirebase,
  saveRequirementsToFirebase,
  saveSensitiveAccessLogsToFirebase,
  saveShowingsToFirebase,
  saveTeamMembersToFirebase,
  uploadPropertyFiles
} from "@/lib/firebase";
import { normalizeProperty, normalizeShowing } from "@/lib/domain";
import {
  clearAgent,
  loadAccessLogs,
  loadAgent,
  loadLeads,
  loadProperties,
  loadRevealRequests,
  loadRequirements,
  loadSensitiveAccessLogs,
  loadShowings,
  loadTeamMembers,
  makeId,
  saveAccessLogs,
  saveAgent,
  saveLeads,
  saveProperties,
  saveRevealRequests,
  saveRequirements,
  saveSensitiveAccessLogs,
  saveShowings,
  saveTeamMembers
} from "@/lib/storage";
import type {
  AccessLogRecord,
  Agent,
  ClientRequirementRecord,
  LeadRecord,
  PropertyMedia,
  PropertyRecord,
  RevealRequestRecord,
  SensitiveAccessLogRecord,
  ShowingRecord,
  TeamMemberRecord
} from "@/lib/types";

export type RepositoryData = {
  agent: Agent | null;
  properties: PropertyRecord[];
  leads: LeadRecord[];
  requirements: ClientRequirementRecord[];
  showings: ShowingRecord[];
  teamMembers: TeamMemberRecord[];
  accessLogs: AccessLogRecord[];
  sensitiveAccessLogs: SensitiveAccessLogRecord[];
  revealRequests: RevealRequestRecord[];
};

export function makeRepositoryId(prefix: string) {
  return makeId(prefix);
}

export function clearStoredAgent() {
  clearAgent();
}

export async function persistAgent(agent: Agent) {
  saveAgent(agent);
  const saved = await saveAgentToFirebase(agent);
  saveAgent(saved);
  return saved;
}

export async function loadRepositoryData(): Promise<RepositoryData> {
  const local = loadLocalData();
  if (!local.agent) return local;

  const cloud = await loadCloudData();
  const merged = preferCloud(local, cloud);
  saveLocalData(merged);
  return merged;
}

export function persistProperties(records: PropertyRecord[]) {
  const next = records.map(normalizeProperty);
  saveProperties(next);
  void savePropertiesToFirebase(next);
}

export function persistLeads(records: LeadRecord[]) {
  saveLeads(records);
  void saveLeadsToFirebase(records);
}

export function persistRequirements(records: ClientRequirementRecord[]) {
  saveRequirements(records);
  void saveRequirementsToFirebase(records);
}

export function persistShowings(records: ShowingRecord[]) {
  const next = records.map(normalizeShowing);
  saveShowings(next);
  void saveShowingsToFirebase(next);
}

export function persistTeamMembers(records: TeamMemberRecord[]) {
  saveTeamMembers(records);
  void saveTeamMembersToFirebase(records);
}

export function persistAccessLogs(records: AccessLogRecord[]) {
  saveAccessLogs(records);
  void saveAccessLogsToFirebase(records);
}

export function persistSensitiveAccessLogs(records: SensitiveAccessLogRecord[]) {
  saveSensitiveAccessLogs(records);
  void saveSensitiveAccessLogsToFirebase(records);
}

export function persistRevealRequests(records: RevealRequestRecord[]) {
  saveRevealRequests(records);
  void saveRevealRequestsToFirebase(records);
}

export function uploadRepositoryPropertyFiles(propertyId: string, files: FileList | null): Promise<PropertyMedia[]> {
  return uploadPropertyFiles(propertyId, files);
}

function loadLocalData(): RepositoryData {
  return {
    agent: loadAgent(),
    properties: loadProperties().map(normalizeProperty),
    leads: loadLeads(),
    requirements: loadRequirements(),
    showings: loadShowings().map(normalizeShowing),
    teamMembers: loadTeamMembers(),
    accessLogs: loadAccessLogs(),
    sensitiveAccessLogs: loadSensitiveAccessLogs(),
    revealRequests: loadRevealRequests()
  };
}

async function loadCloudData(): Promise<Partial<RepositoryData>> {
  const [
    properties,
    leads,
    requirements,
    showings,
    teamMembers,
    accessLogs,
    sensitiveAccessLogs,
    revealRequests
  ] = await Promise.all([
    loadPropertiesFromFirebase(),
    loadLeadsFromFirebase(),
    loadRequirementsFromFirebase(),
    loadShowingsFromFirebase(),
    loadTeamMembersFromFirebase(),
    loadAccessLogsFromFirebase(),
    loadSensitiveAccessLogsFromFirebase(),
    loadRevealRequestsFromFirebase()
  ]);

  return {
    properties: properties.map(normalizeProperty),
    leads,
    requirements,
    showings: showings.map(normalizeShowing),
    teamMembers,
    accessLogs,
    sensitiveAccessLogs,
    revealRequests
  };
}

function preferCloud(local: RepositoryData, cloud: Partial<RepositoryData>): RepositoryData {
  return {
    agent: local.agent,
    properties: cloud.properties?.length ? cloud.properties : local.properties,
    leads: cloud.leads?.length ? cloud.leads : local.leads,
    requirements: cloud.requirements?.length ? cloud.requirements : local.requirements,
    showings: cloud.showings?.length ? cloud.showings : local.showings,
    teamMembers: cloud.teamMembers?.length ? cloud.teamMembers : local.teamMembers,
    accessLogs: cloud.accessLogs?.length ? cloud.accessLogs : local.accessLogs,
    sensitiveAccessLogs: cloud.sensitiveAccessLogs?.length ? cloud.sensitiveAccessLogs : local.sensitiveAccessLogs,
    revealRequests: cloud.revealRequests?.length ? cloud.revealRequests : local.revealRequests
  };
}

function saveLocalData(data: RepositoryData) {
  saveProperties(data.properties);
  saveLeads(data.leads);
  saveRequirements(data.requirements);
  saveShowings(data.showings);
  saveTeamMembers(data.teamMembers);
  saveAccessLogs(data.accessLogs);
  saveSensitiveAccessLogs(data.sensitiveAccessLogs);
  saveRevealRequests(data.revealRequests);
}
