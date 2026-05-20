"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, CalendarDays, ClipboardList, DoorOpen, Languages, Plus, Search, ShieldCheck, Target, UserRound, UsersRound } from "lucide-react";
import { listingLabel, statusLabel, t } from "@/lib/i18n";
import {
  clearStoredAgent,
  loadRepositoryData,
  makeRepositoryId,
  persistAccessLogs as saveRepoAccessLogs,
  persistAgent,
  persistLeads as saveRepoLeads,
  persistProperties as saveRepoProperties,
  persistRevealRequests as saveRepoRevealRequests,
  persistRequirements as saveRepoRequirements,
  persistSensitiveAccessLogs as saveRepoSensitiveAccessLogs,
  persistShowings as saveRepoShowings,
  persistTeamMembers as saveRepoTeamMembers,
  uploadRepositoryPropertyFiles
} from "@/lib/repository";
import {
  canRevealOwnerPhone,
  getRiskFlags,
  isShowingInWindow,
  normalizeProperty,
  normalizeShowing,
  propertyMatchesSearch,
  propertyTypes,
  scoreMatch,
  statuses,
  typeLabels
} from "@/lib/domain";
import { seedLeads, seedProperties, seedTeamMembers } from "@/lib/seeds";
import type { ActiveTab, RevealState } from "@/lib/domain";
import type {
  AccessLogRecord,
  Agent,
  ClientRequirementDraft,
  ClientRequirementRecord,
  Language,
  LeadDraft,
  LeadRecord,
  LeadStatus,
  ListingType,
  PropertyDraft,
  PropertyRecord,
  PropertyStatus,
  RevealReason,
  RevealRequestRecord,
  SensitiveAccessLogRecord,
  ShowingDraft,
  ShowingRecord,
  ShowingStatus,
  TeamMemberDraft,
  TeamMemberRecord
} from "@/lib/types";
import { LanguageSwitch, Stat, TabButton } from "@/components/ui";
import { LeadForm, LoginScreen, RequirementForm, RevealOwnerPhoneForm, ShowingForm, TeamMemberForm } from "@/components/forms";
import PropertyFormEnhanced from "./PropertyFormEnhanced";
import SubscriptionPage from "./SubscriptionPage";
import { InventoryView } from "@/components/InventoryView";
import { LeadInbox } from "@/components/LeadInbox";
import { MatchingView } from "@/components/MatchingView";
import { MyScheduleView } from "@/components/MyScheduleView";
import { SecurityView } from "@/components/SecurityView";
import { ShowingView } from "@/components/ShowingView";
import { StrategyView } from "@/components/StrategyView";
import { TeamView } from "@/components/TeamView";

export default function AppShell({ onSignOut }: { onSignOut?: () => void } = {}) {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [language, setLanguage] = useState<Language>("en");
  const [activeTab, setActiveTab] = useState<ActiveTab>("inventory");
  const [companyName, setCompanyName] = useState<string>(() => {
    if (typeof window !== "undefined") return localStorage.getItem("yume_company_name") || "";
    return "";
  });
  const [showCompanySetup, setShowCompanySetup] = useState(false);
  const [companyInput, setCompanyInput] = useState("");
  const [showSubscription, setShowSubscription] = useState(false);
  const [properties, setProperties] = useState<PropertyRecord[]>([]);
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [requirements, setRequirements] = useState<ClientRequirementRecord[]>([]);
  const [showings, setShowings] = useState<ShowingRecord[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMemberRecord[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLogRecord[]>([]);
  const [sensitiveAccessLogs, setSensitiveAccessLogs] = useState<SensitiveAccessLogRecord[]>([]);
  const [revealRequests, setRevealRequests] = useState<RevealRequestRecord[]>([]);
  const [search, setSearch] = useState("");
  const [listingFilter, setListingFilter] = useState<ListingType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedRequirementId, setSelectedRequirementId] = useState<string>("");
  const [editingProperty, setEditingProperty] = useState<PropertyRecord | "new" | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showRequirementForm, setShowRequirementForm] = useState(false);
  const [showShowingForm, setShowShowingForm] = useState(false);
  const [showTeamMemberForm, setShowTeamMemberForm] = useState(false);
  const [scheduleFilter, setScheduleFilter] = useState("today");
  const [scheduleMemberId, setScheduleMemberId] = useState("");
  const [revealedOwner, setRevealedOwner] = useState<RevealState>(null);
  const [revealTarget, setRevealTarget] = useState<PropertyRecord | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      const data = await loadRepositoryData();
      if (cancelled) return;

      if (data.agent) {
        setAgent(data.agent);
        setLanguage(data.agent.language);
      }
      if (data.properties.length) {
        setProperties(data.properties);
        setSelectedId(data.properties[0].id);
      }
      if (data.leads.length) setLeads(data.leads);
      if (data.requirements.length) {
        setRequirements(data.requirements);
        setSelectedRequirementId(data.requirements[0].id);
      }
      if (data.showings.length) setShowings(data.showings);
      if (data.teamMembers.length) {
        setTeamMembers(data.teamMembers);
        setScheduleMemberId(data.agent?.teamMemberId || data.teamMembers[0].id);
      }
      if (data.accessLogs.length) setAccessLogs(data.accessLogs);
      if (data.sensitiveAccessLogs.length) setSensitiveAccessLogs(data.sensitiveAccessLogs);
      if (data.revealRequests.length) setRevealRequests(data.revealRequests);
      setHydrated(true);
    }

    hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (agent && hydrated && properties.length === 0) {
      const seededProperties = seedProperties(agent.name);
      const seededLeads = seedLeads(agent.name);
      const seededTeamMembers = seedTeamMembers(agent);
      setProperties(seededProperties);
      setSelectedId(seededProperties[0].id);
      setLeads(seededLeads);
      setTeamMembers(seededTeamMembers);
      setScheduleMemberId(agent.teamMemberId || seededTeamMembers[0].id);
      saveRepoProperties(seededProperties);
      saveRepoLeads(seededLeads);
      saveRepoTeamMembers(seededTeamMembers);
    }
  }, [agent, hydrated, properties.length]);

  useEffect(() => {
    if (agent && hydrated && teamMembers.length === 0) {
      const seededTeamMembers = seedTeamMembers(agent);
      setTeamMembers(seededTeamMembers);
      setScheduleMemberId(agent.teamMemberId || seededTeamMembers[0].id);
      saveRepoTeamMembers(seededTeamMembers);
    }
  }, [agent, hydrated, teamMembers.length]);

  function persistProperties(next: PropertyRecord[]) {
    setProperties(next);
    saveRepoProperties(next);
  }

  function persistLeads(next: LeadRecord[]) {
    setLeads(next);
    saveRepoLeads(next);
  }

  function persistRequirements(next: ClientRequirementRecord[]) {
    setRequirements(next);
    saveRepoRequirements(next);
  }

  function persistShowings(next: ShowingRecord[]) {
    setShowings(next);
    saveRepoShowings(next);
  }

  function persistTeamMembers(next: TeamMemberRecord[]) {
    setTeamMembers(next);
    saveRepoTeamMembers(next);
  }

  function persistAccessLogs(next: AccessLogRecord[]) {
    setAccessLogs(next);
    saveRepoAccessLogs(next);
  }

  function persistSensitiveAccessLogs(next: SensitiveAccessLogRecord[]) {
    setSensitiveAccessLogs(next);
    saveRepoSensitiveAccessLogs(next);
  }

  function persistRevealRequests(next: RevealRequestRecord[]) {
    setRevealRequests(next);
    saveRepoRevealRequests(next);
  }

  async function updateLanguage(next: Language) {
    setLanguage(next);
    if (agent) {
      const updated = { ...agent, language: next };
      setAgent(updated);
      await persistAgent(updated);
    }
  }

  function handleLogin(nextAgent: Agent) {
    const savedCompany = typeof window !== "undefined" ? localStorage.getItem("yume_company_name") : "";
    if (!savedCompany) setShowCompanySetup(true);
    const now = new Date().toISOString();
    const existingMember = teamMembers.find((member) => member.phone === nextAgent.phone || member.name.toLowerCase() === nextAgent.name.toLowerCase());
    const member: TeamMemberRecord =
      existingMember ??
      {
        id: makeRepositoryId("team"),
        name: nextAgent.name,
        phone: nextAgent.phone || "+95 9 000 000 000",
        role: "admin",
        status: "active",
        firebaseUid: nextAgent.id,
        notes: "Created from phone login",
        createdAt: now,
        updatedAt: now
      };
    const nextTeam = existingMember ? teamMembers : [member, ...teamMembers];
    const updatedAgent = { ...nextAgent, teamMemberId: member.id, phone: member.phone };
    const log: AccessLogRecord = {
      id: makeRepositoryId("access"),
      teamMemberId: member.id,
      teamMemberName: member.name,
      phone: member.phone,
      eventType: "login",
      timestamp: now,
      userAgent: typeof navigator === "undefined" ? "Unknown browser" : navigator.userAgent,
      authProvider: "phone_otp_demo"
    };

    setAgent(updatedAgent);
    setLanguage(updatedAgent.language);
    setScheduleMemberId(member.id);
    persistAgent(updatedAgent);
    persistTeamMembers(nextTeam);
    persistAccessLogs([log, ...accessLogs]);
  }

  function handleSignOut() {
    clearStoredAgent();
    setAgent(null);
    setSelectedId("");
    localStorage.removeItem("yume_agent_session");
    if (onSignOut) onSignOut();
  }

  async function savePropertyDraft(draft: PropertyDraft, files: FileList | null) {
    if (!agent) return;

    const now = new Date().toISOString();
    if (editingProperty && editingProperty !== "new") {
      const newMedia = await uploadRepositoryPropertyFiles(editingProperty.id, files);
      const next = properties.map((property) =>
        property.id === editingProperty.id
          ? normalizeProperty({
              ...property,
              ...draft,
              media: [...draft.media, ...newMedia],
              updatedAt: now
            })
          : property
      );
      persistProperties(next);
      setSelectedId(editingProperty.id);
    } else {
      const id = makeRepositoryId("property");
      const newMedia = await uploadRepositoryPropertyFiles(id, files);
      const property: PropertyRecord = normalizeProperty({
        ...draft,
        id,
        media: [...draft.media, ...newMedia],
        createdBy: agent.name,
        createdAt: now,
        updatedAt: now
      });
      persistProperties([property, ...properties]);
      setSelectedId(property.id);
    }
    setEditingProperty(null);
  }

  function saveLeadDraft(draft: LeadDraft) {
    if (!agent) return;
    const now = new Date().toISOString();
    persistLeads([
      {
        ...draft,
        id: makeRepositoryId("lead"),
        assignedAgent: agent.name,
        createdAt: now,
        updatedAt: now
      },
      ...leads
    ]);
    setShowLeadForm(false);
    setActiveTab("leads");
  }

  function saveRequirementDraft(draft: ClientRequirementDraft) {
    if (!agent) return;
    const now = new Date().toISOString();
    const requirement: ClientRequirementRecord = {
      ...draft,
      id: makeRepositoryId("requirement"),
      assignedAgent: agent.name,
      createdAt: now,
      updatedAt: now
    };
    persistRequirements([requirement, ...requirements]);
    setSelectedRequirementId(requirement.id);
    setShowRequirementForm(false);
    setActiveTab("matching");
  }

  function saveShowingDraft(draft: ShowingDraft) {
    if (!agent) return;
    const now = new Date().toISOString();
    const member = teamMembers.find((item) => item.id === draft.assignedTeamMemberId);
    persistShowings([
      normalizeShowing({
        ...draft,
        id: makeRepositoryId("showing"),
        assignedAgent: member?.name ?? draft.assignedTeamMemberName ?? agent.name,
        assignedTeamMemberId: member?.id ?? draft.assignedTeamMemberId,
        assignedTeamMemberName: member?.name ?? draft.assignedTeamMemberName,
        createdAt: now,
        updatedAt: now
      }),
      ...showings
    ]);
    setShowShowingForm(false);
    setActiveTab("showings");
  }

  function saveTeamMemberDraft(draft: TeamMemberDraft) {
    const now = new Date().toISOString();
    const teamMember: TeamMemberRecord = {
      ...draft,
      id: makeRepositoryId("team"),
      firebaseUid: "",
      createdAt: now,
      updatedAt: now
    };
    persistTeamMembers([teamMember, ...teamMembers]);
    if (!scheduleMemberId) setScheduleMemberId(teamMember.id);
    setShowTeamMemberForm(false);
    setActiveTab("team");
  }

  function deactivateTeamMember(id: string) {
    const now = new Date().toISOString();
    persistTeamMembers(teamMembers.map((member) => (member.id === id ? { ...member, status: "inactive", updatedAt: now } : member)));
  }

  function updatePropertyStatus(id: string, status: PropertyStatus) {
    const now = new Date().toISOString();
    persistProperties(properties.map((property) => (property.id === id ? { ...property, status, updatedAt: now } : property)));
  }

  function toggleVisibility(id: string) {
    const now = new Date().toISOString();
    persistProperties(
      properties.map((property) =>
        property.id === id ? { ...property, visibility: property.visibility === "public" ? "private" : "public", updatedAt: now } : property
      )
    );
  }

  function updateLeadStatus(id: string, status: LeadStatus) {
    const now = new Date().toISOString();
    persistLeads(leads.map((lead) => (lead.id === id ? { ...lead, status, updatedAt: now } : lead)));
  }

  function updateShowingStatus(id: string, status: ShowingStatus) {
    const now = new Date().toISOString();
    persistShowings(showings.map((showing) => (showing.id === id ? { ...showing, status, updatedAt: now } : showing)));
  }

  function requestOwnerPhoneReveal(property: PropertyRecord) {
    setRevealTarget(property);
  }

  function handleOwnerPhoneReveal(property: PropertyRecord, reason: RevealReason) {
    const now = new Date();
    const member = teamMembers.find((item) => item.id === agent?.teamMemberId) ?? teamMembers[0];
    const allowed = canRevealOwnerPhone(member, property, showings);
    const riskFlags = member ? getRiskFlags(sensitiveAccessLogs, member.id, now) : ["unknown_user"];
    if (member?.status === "inactive") riskFlags.push("inactive_staff");
    if (!allowed) riskFlags.push("blocked_by_role_or_assignment");

    const log: SensitiveAccessLogRecord = {
      id: makeRepositoryId("sensitive"),
      teamMemberId: member?.id ?? "unknown",
      teamMemberName: member?.name ?? agent?.name ?? "Unknown",
      teamMemberRole: member?.role ?? "viewer",
      propertyId: property.id,
      propertyCode: property.code,
      ownerName: property.owner.name,
      reason,
      action: "owner_phone_reveal",
      timestamp: now.toISOString(),
      userAgent: typeof navigator === "undefined" ? "Unknown browser" : navigator.userAgent,
      allowed,
      riskFlags
    };

    persistSensitiveAccessLogs([log, ...sensitiveAccessLogs]);

    if (allowed) {
      setRevealedOwner({ propertyId: property.id, expiresAt: Date.now() + 5 * 60 * 1000 });
    } else {
      const request: RevealRequestRecord = {
        id: makeRepositoryId("reveal-request"),
        teamMemberId: member?.id ?? "unknown",
        teamMemberName: member?.name ?? agent?.name ?? "Unknown",
        propertyId: property.id,
        propertyCode: property.code,
        ownerName: property.owner.name,
        reason,
        status: "pending",
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      };
      persistRevealRequests([request, ...revealRequests]);
    }

    setRevealTarget(null);
  }

  const filtered = useMemo(() => {
    return properties.filter((property) => {
      const searchMatch = !search.trim() || propertyMatchesSearch(property, search);
      const listingMatch = listingFilter === "all" || property.listingType === listingFilter;
      const statusMatch = statusFilter === "all" || property.status === statusFilter;
      const typeMatch = typeFilter === "all" || property.propertyType === typeFilter;
      return searchMatch && listingMatch && statusMatch && typeMatch;
    });
  }, [properties, search, listingFilter, statusFilter, typeFilter]);

  const selected = properties.find((property) => property.id === selectedId) ?? filtered[0] ?? properties[0];
  const selectedRequirement = requirements.find((requirement) => requirement.id === selectedRequirementId) ?? requirements[0];
  const matches = selectedRequirement
    ? properties
        .map((property) => ({ property, score: scoreMatch(selectedRequirement, property) }))
        .filter((match) => match.score >= 0)
        .sort((a, b) => b.score - a.score)
    : [];
  const availableCount = properties.filter((property) => property.status === "available").length;
  const publicCount = properties.filter((property) => property.visibility === "public").length;
  const myScheduleShowings = showings
    .filter((showing) => (!scheduleMemberId || showing.assignedTeamMemberId === scheduleMemberId))
    .filter((showing) => isShowingInWindow(showing, scheduleFilter))
    .sort((a, b) => (a.scheduledAt || "").localeCompare(b.scheduledAt || ""));
  const activeSensitiveFlags = sensitiveAccessLogs.filter((log) => log.riskFlags.length > 0).length;

  if (!agent) return null;

  // Company name setup modal
  if (showCompanySetup) {
    const ff = language === "my" ? "'Padauk','Myanmar Text',sans-serif" : "Georgia,serif";
    return (
      <div style={{position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"}}>
        <div style={{background: "#f5f0e8", borderRadius: "12px", width: "100%", maxWidth: "440px", border: "2px solid #bd9468", overflow: "hidden"}}>
          <div style={{background: "#111d2b", padding: "20px 24px"}}>
            <img src="/logo.png" alt="Yume Estate" style={{width: "120px", filter: "brightness(10)", marginBottom: "12px"}} />
            <h2 style={{color: "#f5f0e8", fontSize: "18px", fontWeight: 400, margin: 0, fontFamily: ff}}>
              {language === "my" ? "ကုမ္ပဏီ အမည် ထည့်ပါ" : "Enter Your Company Name"}
            </h2>
          </div>
          <div style={{padding: "24px"}}>
            <p style={{color: "#7a6a5a", fontSize: "13px", margin: "0 0 16px", lineHeight: 1.6, fontFamily: ff}}>
              {language === "my"
                ? "သင်၏ ကုမ္ပဏီ သို့မဟုတ် အေဂျင်စီ အမည်ကို ထည့်ပါ။ ၎င်းကို Dashboard တွင် ဖော်ပြမည်ဖြစ်သည်။"
                : "Enter your company or agency name. This will be displayed on your dashboard."}
            </p>
            <input
              value={companyInput}
              onChange={e => setCompanyInput(e.target.value)}
              placeholder={language === "my" ? "ဥပမာ Swam Mahar Real Estate Co., Ltd." : "e.g. Swam Mahar Real Estate Co., Ltd."}
              style={{width: "100%", padding: "13px 16px", borderRadius: "6px", border: "1px solid #ddd5c0", fontSize: "14px", fontFamily: ff, boxSizing: "border-box", marginBottom: "12px"}}
              onKeyDown={e => { if (e.key === "Enter" && companyInput.trim()) { localStorage.setItem("yume_company_name", companyInput.trim()); setCompanyName(companyInput.trim()); setShowCompanySetup(false); }}}
              autoFocus
            />
            <button
              onClick={() => { if (companyInput.trim()) { localStorage.setItem("yume_company_name", companyInput.trim()); setCompanyName(companyInput.trim()); setShowCompanySetup(false); }}}
              disabled={!companyInput.trim()}
              style={{width: "100%", background: companyInput.trim() ? "#111d2b" : "#ddd5c0", color: "#bd9468", border: "2px solid #bd9468", padding: "14px", borderRadius: "6px", fontSize: "14px", cursor: companyInput.trim() ? "pointer" : "not-allowed", fontFamily: ff, fontWeight: 600}}>
              {language === "my" ? "သိမ်းဆည်းရန် →" : "Save & Continue →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="app" style={{padding: 0}}>
      <div className="shell" style={{width: "100%", maxWidth: "100%"}}>
        <header style={{background: "#fbf3da", padding: "0px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "2px solid #bd9468"}}>
          <div style={{display: "flex", alignItems: "center", gap: "28px"}}>
            <img src="/logo.png" alt="Yume Estate" style={{width: "150px", height: "auto"}} />
          </div>
          <div className="button-row" style={{ justifyContent: "flex-end" }}>
            {/* View public website — goes to home page without logging out */}
            <button
              className="ghost-button"
              type="button"
              onClick={() => { if (typeof window !== "undefined") { (window as any).__yumeViewPublic?.(); } }}
              style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", padding: "6px 12px" }}
            >
              🌐 {language === "my" ? "ဝဘ်ဆိုက်" : "View Website"}
            </button>
            {/* Upgrade plan button */}
            <button
              type="button"
              onClick={() => setShowSubscription(true)}
              style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", padding: "6px 14px", background: "#bd9468", color: "#111d2b", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: 700 }}
            >
              ⭐ {language === "my" ? "အဆင့်မြှင့်" : "Upgrade Plan"}
            </button>
            <LanguageSwitch language={language} onChange={updateLanguage} />
            <button className="icon-button" type="button" onClick={handleSignOut} aria-label={t(language, "signOut")}>
              <DoorOpen size={19} />
            </button>
          </div>
        </header>

        <div style={{background: "#111d2b", padding: "12px 24px", textAlign: "center", borderBottom: "1px solid #e8dfc4"}}>
  <p style={{color: "#d4af7a", fontSize: "12px", margin: 0, letterSpacing: "5px", fontStyle: "italic", fontFamily: "Georgia, serif"}}>PREMIUM PROPERTIES · TRUSTED AGENTS</p>
</div>

        <div style={{padding: "24px 28px"}}>
        <div style={{marginBottom: "20px", borderBottom: "1px solid #e8dfc4", paddingBottom: "16px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px"}}>
          <div style={{flex: 1}}>
            <p style={{color: "#bd9468", fontSize: "10px", margin: "0 0 4px", letterSpacing: "3px"}}>
              {language === "my" ? "ဒက်ရှ်ဘုတ်" : "DASHBOARD"}
            </p>
            <h1 style={{color: "#111d2b", fontSize: "22px", fontWeight: 700, margin: "0 0 2px", display: "flex", alignItems: "center", gap: "8px"}}>
              {companyName || agent.name}
              <button onClick={() => { setCompanyInput(companyName || agent.name); setShowCompanySetup(true); }}
                style={{background: "none", border: "none", cursor: "pointer", padding: "2px", color: "#bd9468", fontSize: "14px", lineHeight: 1}}>
                ✏️
              </button>
            </h1>
            <p style={{color: "#7a6a5a", fontSize: "13px", margin: 0}}>
              {language === "my" ? "အိမ်ခြံမြေ မှတ်တမ်း" : "Property Inventory"}
            </p>
          </div>
          <div style={{textAlign: "right", flexShrink: 0}}>
            <span className="pill available" style={{fontSize: "11px", display: "block", marginBottom: "4px"}}>{agent.role}</span>
            <span style={{color: "#7a6a5a", fontSize: "11px"}}>{agent.email}</span>
          </div>
        </div>

        <section className="stats" aria-label="Operating stats">
          <Stat label={t(language, "inventory")} value={properties.length} />
          <Stat label={t(language, "available")} value={availableCount} />
          <Stat label={t(language, "leads")} value={leads.length} />
          <Stat label={t(language, "showings")} value={showings.length} />
        </section>

        <nav className="tabbar" aria-label="Agent OS">
          <TabButton active={activeTab === "inventory"} label={t(language, "inventory")} icon={<Building2 size={17} />} onClick={() => setActiveTab("inventory")} />
          <TabButton active={activeTab === "leads"} label={t(language, "leads")} icon={<UsersRound size={17} />} onClick={() => setActiveTab("leads")} />
          <TabButton active={activeTab === "matching"} label={t(language, "matching")} icon={<Target size={17} />} onClick={() => setActiveTab("matching")} />
          <TabButton active={activeTab === "showings"} label={t(language, "showings")} icon={<CalendarDays size={17} />} onClick={() => setActiveTab("showings")} />
          <TabButton active={activeTab === "mySchedule"} label={t(language, "mySchedule")} icon={<UserRound size={17} />} onClick={() => setActiveTab("mySchedule")} />
          <TabButton active={activeTab === "team"} label={t(language, "team")} icon={<UsersRound size={17} />} onClick={() => setActiveTab("team")} />
          <TabButton active={activeTab === "security"} label={t(language, "security")} icon={<ShieldCheck size={17} />} onClick={() => setActiveTab("security")} />
          <TabButton active={activeTab === "strategy"} label={t(language, "strategy")} icon={<ClipboardList size={17} />} onClick={() => setActiveTab("strategy")} />
        </nav>

        {activeTab === "inventory" && (
          <>
            <section className="toolbar">
              <div className="field-grid">
                <div className="search-wrap">
                  <Search size={18} />
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t(language, "searchPlaceholder")} />
                </div>
                <div className="filters">
                  <select value={listingFilter} onChange={(event) => setListingFilter(event.target.value as ListingType | "all")}>
                    <option value="all">{listingLabel(language, "all")}</option>
                    <option value="sale">{t(language, "sale")}</option>
                    <option value="rent">{t(language, "rent")}</option>
                  </select>
                  <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as PropertyStatus | "all")}>
                    <option value="all">{statusLabel(language, "all")}</option>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {statusLabel(language, status)}
                      </option>
                    ))}
                  </select>
                  <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
                    <option value="all">{t(language, "all")}</option>
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>
                        {typeLabels[type][language]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button className="primary-button" type="button" onClick={() => setEditingProperty("new")}>
                <Plus size={18} />
                {t(language, "addProperty")}
              </button>
            </section>
            <InventoryView
              language={language}
              filtered={filtered}
              selected={selected}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              setEditingProperty={setEditingProperty}
              updatePropertyStatus={updatePropertyStatus}
              toggleVisibility={toggleVisibility}
              revealedOwner={revealedOwner}
              showings={showings}
              requestOwnerPhoneReveal={requestOwnerPhoneReveal}
              openLeadForm={() => setShowLeadForm(true)}
              openShowingForm={() => setShowShowingForm(true)}
            />
          </>
        )}

        {activeTab === "leads" && (
          <LeadInbox
            language={language}
            leads={leads}
            properties={properties}
            updateLeadStatus={updateLeadStatus}
            openLeadForm={() => setShowLeadForm(true)}
          />
        )}

        {activeTab === "matching" && (
          <MatchingView
            language={language}
            requirements={requirements}
            selectedRequirementId={selectedRequirementId}
            setSelectedRequirementId={setSelectedRequirementId}
            matches={matches}
            openRequirementForm={() => setShowRequirementForm(true)}
          />
        )}

        {activeTab === "showings" && (
          <ShowingView
            language={language}
            showings={showings}
            properties={properties}
            teamMembers={teamMembers}
            updateShowingStatus={updateShowingStatus}
            openShowingForm={() => setShowShowingForm(true)}
          />
        )}

        {activeTab === "mySchedule" && (
          <MyScheduleView
            language={language}
            showings={myScheduleShowings}
            properties={properties}
            teamMembers={teamMembers}
            scheduleMemberId={scheduleMemberId}
            scheduleFilter={scheduleFilter}
            setScheduleMemberId={setScheduleMemberId}
            setScheduleFilter={setScheduleFilter}
            updateShowingStatus={updateShowingStatus}
          />
        )}

        {activeTab === "team" && (
          <TeamView
            language={language}
            teamMembers={teamMembers}
            accessLogs={accessLogs}
            deactivateTeamMember={deactivateTeamMember}
            openTeamMemberForm={() => setShowTeamMemberForm(true)}
          />
        )}

        {activeTab === "security" && (
          <SecurityView
            language={language}
            sensitiveAccessLogs={sensitiveAccessLogs}
            revealRequests={revealRequests}
            activeSensitiveFlags={activeSensitiveFlags}
          />
        )}

        {activeTab === "strategy" && <StrategyView publicCount={publicCount} />}

        <section className="team-panel" style={{ marginTop: 14 }}>
          <div className="button-row">
            <UserRound size={18} />
            <strong>{t(language, "team")}</strong>
            <span className="pill available">{agent.role}</span>
            <span className="muted">{agent.name}</span>
            <span className="muted">{agent.email}</span>
            <Languages size={18} />
          </div>
        </section>
        </div>
      </div>

      {showSubscription && (
        <div style={{ position: "fixed", inset: 0, zIndex: 2000, overflowY: "auto" }}>
          <SubscriptionPage
            language={language}
            currentPlan="basic"
            onClose={() => setShowSubscription(false)}
          />
        </div>
      )}

      {editingProperty && (
        <PropertyFormEnhanced
          language={language}
          initial={editingProperty === "new" ? undefined : editingProperty}
          properties={properties}
          onCancel={() => setEditingProperty(null)}
          onSave={savePropertyDraft}
        />
      )}
      {showLeadForm && (
        <LeadForm
          language={language}
          properties={properties}
          defaultPropertyId={selected?.id ?? ""}
          onCancel={() => setShowLeadForm(false)}
          onSave={saveLeadDraft}
        />
      )}
      {showRequirementForm && <RequirementForm language={language} onCancel={() => setShowRequirementForm(false)} onSave={saveRequirementDraft} />}
      {showShowingForm && (
        <ShowingForm
          language={language}
          properties={properties}
          teamMembers={teamMembers}
          defaultPropertyId={selected?.id ?? ""}
          onCancel={() => setShowShowingForm(false)}
          onSave={saveShowingDraft}
        />
      )}
      {showTeamMemberForm && <TeamMemberForm language={language} onCancel={() => setShowTeamMemberForm(false)} onSave={saveTeamMemberDraft} />}
      {revealTarget && (
        <RevealOwnerPhoneForm
          language={language}
          property={revealTarget}
          onCancel={() => setRevealTarget(null)}
          onReveal={(reason) => handleOwnerPhoneReveal(revealTarget, reason)}
        />
      )}
    </main>
  );
}
