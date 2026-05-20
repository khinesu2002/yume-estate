"use client";

import { FormEvent, useState } from "react";
import { Home, ShieldCheck } from "lucide-react";
import { statusLabel, t } from "@/lib/i18n";
import { makeRepositoryId, persistAgent } from "@/lib/repository";
import {
  blankLeadDraft,
  blankPropertyDraft,
  blankRequirementDraft,
  blankShowingDraft,
  blankTeamMemberDraft,
  contactSources,
  landTitleLabels,
  landTitleTypes,
  leadStatusLabels,
  leadStatuses,
  maskPhone,
  nextCode,
  normalizeProperty,
  propertyTypes,
  revealReasonLabels,
  revealReasons,
  showingStatusLabels,
  showingStatuses,
  sourceLabels,
  statuses,
  teamRoleLabels,
  teamRoles,
  typeLabels
} from "@/lib/domain";
import type {
  Agent,
  ClientRequirementDraft,
  ContactSource,
  LandTitleType,
  Language,
  LeadDraft,
  LeadStatus,
  ListingType,
  PropertyDraft,
  PropertyRecord,
  PropertyStatus,
  RevealReason,
  ShowingDraft,
  ShowingStatus,
  TeamMemberDraft,
  TeamMemberRecord,
  TeamMemberRole
} from "@/lib/types";
import { LanguageSwitch, ModalActions, ModalHeader, Segmented } from "@/components/ui";

export function LoginScreen({
  language,
  onLanguageChange,
  onLogin
}: {
  language: Language;
  onLanguageChange: (language: Language) => void;
  onLogin: (agent: Agent) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    const agent: Agent = {
      id: makeRepositoryId("agent"),
      name: name.trim() || "Agent",
      email: email.trim() || "agent@dream.local",
      phone: phone.trim() || "+95 9 000 000 000",
      role: "admin",
      language
    };
    const saved = await persistAgent(agent);
    onLogin(saved);
    setIsSubmitting(false);
  }

  return (
    <main className="login">
      <form className="login-panel" onSubmit={submit}>
        <div className="brand-mark">
          <Home size={28} />
        </div>
        <p className="eyebrow">{t(language, "agentOnly")}</p>
        <h1>{t(language, "signInTitle")}</h1>
        <p className="muted">{t(language, "signInCopy")}</p>
        <div className="field-grid">
          <label>
            <span>{t(language, "name")}</span>
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Daw Su" />
          </label>
          <label>
            <span>{t(language, "email")}</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="agent@company.com" />
          </label>
          <label>
            <span>{t(language, "phone")}</span>
            <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+95 9 ..." />
          </label>
        </div>
        <div className="button-row" style={{ marginTop: 16, justifyContent: "space-between" }}>
          <LanguageSwitch language={language} onChange={onLanguageChange} />
          <button className="primary-button" type="submit" disabled={isSubmitting}>
            <ShieldCheck size={18} />
            {t(language, "continue")}
          </button>
        </div>
      </form>
    </main>
  );
}

export function PropertyForm({
  language,
  initial,
  properties,
  onCancel,
  onSave
}: {
  language: Language;
  initial?: PropertyRecord;
  properties: PropertyRecord[];
  onCancel: () => void;
  onSave: (draft: PropertyDraft, files: FileList | null) => Promise<void>;
}) {
  const [draft, setDraft] = useState<PropertyDraft>(() => {
    if (!initial) return { ...blankPropertyDraft(), code: nextCode(properties) };
    const { id, createdAt, updatedAt, createdBy, ...rest } = normalizeProperty(initial);
    void id;
    void createdAt;
    void updatedAt;
    void createdBy;
    return rest;
  });
  const [pendingFiles, setPendingFiles] = useState<FileList | null>(null);

  function update<K extends keyof PropertyDraft>(key: K, value: PropertyDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSave({ ...draft, code: draft.code.trim() || nextCode(properties) }, pendingFiles);
  }

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <form className="modal-panel" onSubmit={submit}>
        <ModalHeader title={initial ? t(language, "editProperty") : t(language, "addProperty")} subtitle={draft.code} onCancel={onCancel} language={language} />

        <div className="form-grid">
          <label>
            <span>{t(language, "propertyCode")}</span>
            <input value={draft.code} onChange={(event) => update("code", event.target.value)} />
          </label>
          <label>
            <span>{t(language, "listing")}</span>
            <select value={draft.listingType} onChange={(event) => update("listingType", event.target.value as ListingType)}>
              <option value="sale">{t(language, "sale")}</option>
              <option value="rent">{t(language, "rent")}</option>
            </select>
          </label>
          <label>
            <span>{t(language, "type")}</span>
            <select value={draft.propertyType} onChange={(event) => update("propertyType", event.target.value)}>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {typeLabels[type][language]}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{t(language, "landTitleType")}</span>
            <select value={draft.landTitleType} onChange={(event) => update("landTitleType", event.target.value as LandTitleType)}>
              {landTitleTypes.map((type) => (
                <option key={type} value={type}>
                  {landTitleLabels[type][language]}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{t(language, "status")}</span>
            <select value={draft.status} onChange={(event) => update("status", event.target.value as PropertyStatus)}>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabel(language, status)}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{t(language, "developmentStatus")}</span>
            <Segmented
              firstLabel={t(language, "developed")}
              secondLabel={t(language, "notDeveloped")}
              firstActive={draft.developmentStatus === "developed"}
              onFirst={() => update("developmentStatus", "developed")}
              onSecond={() => update("developmentStatus", "not_developed")}
            />
          </label>
          <label>
            <span>{t(language, "publicListing")}</span>
            <Segmented
              firstLabel={t(language, "privateRecord")}
              secondLabel={t(language, "publicListing")}
              firstActive={draft.visibility === "private"}
              onFirst={() => update("visibility", "private")}
              onSecond={() => update("visibility", "public")}
            />
          </label>
          <label className="wide">
            <span>{t(language, "location")}</span>
            <input required value={draft.location} onChange={(event) => update("location", event.target.value)} placeholder="Yankin, Yangon" />
          </label>
          <label>
            <span>{t(language, "price")}</span>
            <input value={draft.price} onChange={(event) => update("price", event.target.value)} inputMode="numeric" />
          </label>
          <label>
            <span>Currency</span>
            <input value={draft.currency} onChange={(event) => update("currency", event.target.value)} />
          </label>
          <label>
            <span>{t(language, "bedroom")}</span>
            <input value={draft.bedrooms} onChange={(event) => update("bedrooms", event.target.value)} inputMode="numeric" />
          </label>
          <label>
            <span>{t(language, "bathroom")}</span>
            <input value={draft.bathrooms} onChange={(event) => update("bathrooms", event.target.value)} inputMode="numeric" />
          </label>
          <label className="wide">
            <span>{t(language, "size")}</span>
            <input value={draft.size} onChange={(event) => update("size", event.target.value)} placeholder="1050 sqft / 40 x 60 ft" />
          </label>
          <label className="wide">
            <span>{t(language, "description")}</span>
            <textarea value={draft.description} onChange={(event) => update("description", event.target.value)} />
          </label>
          <label className="wide">
            <span>{t(language, "internalNotes")}</span>
            <textarea value={draft.internalNotes} onChange={(event) => update("internalNotes", event.target.value)} />
          </label>
        </div>

        <div className="form-section">
          <h3>{t(language, "owner")}</h3>
          <div className="form-grid">
            <label>
              <span>{t(language, "owner")}</span>
              <input required value={draft.owner.name} onChange={(event) => update("owner", { ...draft.owner, name: event.target.value })} />
            </label>
            <label>
              <span>{t(language, "ownerPhone")}</span>
              <input required value={draft.owner.phone} onChange={(event) => update("owner", { ...draft.owner, phone: event.target.value })} />
            </label>
            <label className="wide">
              <span>{t(language, "ownerNotes")}</span>
              <textarea value={draft.owner.notes} onChange={(event) => update("owner", { ...draft.owner, notes: event.target.value })} />
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>{t(language, "photos")}</h3>
          <label>
            <span>{t(language, "photos")}</span>
            <input type="file" accept="image/*" multiple onChange={(event) => setPendingFiles(event.target.files)} />
          </label>
          {draft.media.length > 0 && (
            <div className="media-grid" style={{ marginTop: 10 }}>
              {draft.media.map((media) => (
                <img className="media-tile" key={media.id} src={media.url} alt={media.name} />
              ))}
            </div>
          )}
        </div>

        <ModalActions language={language} onCancel={onCancel} label={t(language, "save")} />
      </form>
    </div>
  );
}

export function LeadForm({
  language,
  properties,
  defaultPropertyId,
  onCancel,
  onSave
}: {
  language: Language;
  properties: PropertyRecord[];
  defaultPropertyId: string;
  onCancel: () => void;
  onSave: (draft: LeadDraft) => void;
}) {
  const [draft, setDraft] = useState<LeadDraft>(() => blankLeadDraft(defaultPropertyId));

  function update<K extends keyof LeadDraft>(key: K, value: LeadDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(draft);
  }

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <form className="modal-panel" onSubmit={submit}>
        <ModalHeader title={t(language, "addLead")} subtitle="Capture every inquiry" onCancel={onCancel} language={language} />
        <div className="form-grid">
          <label>
            <span>{t(language, "clientName")}</span>
            <input required value={draft.clientName} onChange={(event) => update("clientName", event.target.value)} />
          </label>
          <label>
            <span>{t(language, "phone")}</span>
            <input required value={draft.phone} onChange={(event) => update("phone", event.target.value)} />
          </label>
          <label>
            <span>{t(language, "source")}</span>
            <select value={draft.source} onChange={(event) => update("source", event.target.value as ContactSource)}>
              {contactSources.map((source) => (
                <option key={source} value={source}>
                  {sourceLabels[source]}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{t(language, "status")}</span>
            <select value={draft.status} onChange={(event) => update("status", event.target.value as LeadStatus)}>
              {leadStatuses.map((status) => (
                <option key={status} value={status}>
                  {leadStatusLabels[status]}
                </option>
              ))}
            </select>
          </label>
          <label className="wide">
            <span>{t(language, "propertyCode")}</span>
            <select value={draft.interestedPropertyId} onChange={(event) => update("interestedPropertyId", event.target.value)}>
              <option value="">No exact property yet</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.code} - {property.location}
                </option>
              ))}
            </select>
          </label>
          <label className="wide">
            <span>{t(language, "internalNotes")}</span>
            <textarea value={draft.notes} onChange={(event) => update("notes", event.target.value)} />
          </label>
        </div>
        <ModalActions language={language} onCancel={onCancel} label={t(language, "saveLead")} />
      </form>
    </div>
  );
}

export function RequirementForm({
  language,
  onCancel,
  onSave
}: {
  language: Language;
  onCancel: () => void;
  onSave: (draft: ClientRequirementDraft) => void;
}) {
  const [draft, setDraft] = useState<ClientRequirementDraft>(() => blankRequirementDraft());

  function update<K extends keyof ClientRequirementDraft>(key: K, value: ClientRequirementDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(draft);
  }

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <form className="modal-panel" onSubmit={submit}>
        <ModalHeader title={t(language, "addRequirement")} subtitle="Buyer / renter matching profile" onCancel={onCancel} language={language} />
        <div className="form-grid">
          <label>
            <span>{t(language, "clientName")}</span>
            <input required value={draft.clientName} onChange={(event) => update("clientName", event.target.value)} />
          </label>
          <label>
            <span>{t(language, "phone")}</span>
            <input value={draft.phone} onChange={(event) => update("phone", event.target.value)} />
          </label>
          <label>
            <span>{t(language, "listing")}</span>
            <select value={draft.listingType} onChange={(event) => update("listingType", event.target.value as ListingType | "any")}>
              <option value="any">{t(language, "all")}</option>
              <option value="sale">{t(language, "sale")}</option>
              <option value="rent">{t(language, "rent")}</option>
            </select>
          </label>
          <label>
            <span>{t(language, "type")}</span>
            <select value={draft.propertyType} onChange={(event) => update("propertyType", event.target.value)}>
              <option value="all">{t(language, "all")}</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {typeLabels[type][language]}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Township / area</span>
            <input value={draft.township} onChange={(event) => update("township", event.target.value)} placeholder="Yankin" />
          </label>
          <label>
            <span>{t(language, "bedroom")}</span>
            <input value={draft.bedrooms} onChange={(event) => update("bedrooms", event.target.value)} inputMode="numeric" />
          </label>
          <label>
            <span>Min {t(language, "budget")}</span>
            <input value={draft.minBudget} onChange={(event) => update("minBudget", event.target.value)} inputMode="numeric" />
          </label>
          <label>
            <span>Max {t(language, "budget")}</span>
            <input value={draft.maxBudget} onChange={(event) => update("maxBudget", event.target.value)} inputMode="numeric" />
          </label>
          <label>
            <span>{t(language, "landTitleType")}</span>
            <select value={draft.landTitleType} onChange={(event) => update("landTitleType", event.target.value as LandTitleType | "any")}>
              <option value="any">{t(language, "all")}</option>
              {landTitleTypes.map((type) => (
                <option key={type} value={type}>
                  {landTitleLabels[type][language]}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{t(language, "moveInDate")}</span>
            <input type="date" value={draft.moveInDate} onChange={(event) => update("moveInDate", event.target.value)} />
          </label>
          <label className="wide">
            <span>{t(language, "internalNotes")}</span>
            <textarea value={draft.notes} onChange={(event) => update("notes", event.target.value)} />
          </label>
        </div>
        <ModalActions language={language} onCancel={onCancel} label={t(language, "saveRequirement")} />
      </form>
    </div>
  );
}

export function ShowingForm({
  language,
  properties,
  teamMembers,
  defaultPropertyId,
  onCancel,
  onSave
}: {
  language: Language;
  properties: PropertyRecord[];
  teamMembers: TeamMemberRecord[];
  defaultPropertyId: string;
  onCancel: () => void;
  onSave: (draft: ShowingDraft) => void;
}) {
  const activeTeamMembers = teamMembers.filter((member) => member.status === "active");
  const [draft, setDraft] = useState<ShowingDraft>(() => blankShowingDraft(defaultPropertyId, activeTeamMembers[0]));

  function update<K extends keyof ShowingDraft>(key: K, value: ShowingDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(draft);
  }

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <form className="modal-panel" onSubmit={submit}>
        <ModalHeader title={t(language, "addShowing")} subtitle="Track owner, client, and next step" onCancel={onCancel} language={language} />
        <div className="form-grid">
          <label className="wide">
            <span>{t(language, "propertyCode")}</span>
            <select required value={draft.propertyId} onChange={(event) => update("propertyId", event.target.value)}>
              <option value="">Select property</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.code} - {property.location}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{t(language, "assignedTo")}</span>
            <select
              required
              value={draft.assignedTeamMemberId}
              onChange={(event) => {
                const member = teamMembers.find((item) => item.id === event.target.value);
                update("assignedTeamMemberId", event.target.value);
                update("assignedTeamMemberName", member?.name ?? "");
              }}
            >
              <option value="">Select team member</option>
              {activeTeamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} - {teamRoleLabels[member.role]}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{t(language, "clientName")}</span>
            <input required value={draft.clientName} onChange={(event) => update("clientName", event.target.value)} />
          </label>
          <label>
            <span>{t(language, "phone")}</span>
            <input value={draft.clientPhone} onChange={(event) => update("clientPhone", event.target.value)} />
          </label>
          <label>
            <span>{t(language, "scheduledAt")}</span>
            <input type="datetime-local" value={draft.scheduledAt} onChange={(event) => update("scheduledAt", event.target.value)} />
          </label>
          <label>
            <span>{t(language, "status")}</span>
            <select value={draft.status} onChange={(event) => update("status", event.target.value as ShowingStatus)}>
              {showingStatuses.map((status) => (
                <option key={status} value={status}>
                  {showingStatusLabels[status]}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Owner availability</span>
            <input value={draft.ownerAvailability} onChange={(event) => update("ownerAvailability", event.target.value)} />
          </label>
          <label>
            <span>Client availability</span>
            <input value={draft.clientAvailability} onChange={(event) => update("clientAvailability", event.target.value)} />
          </label>
          <label className="wide">
            <span>{t(language, "result")}</span>
            <textarea value={draft.result} onChange={(event) => update("result", event.target.value)} />
          </label>
          <label className="wide">
            <span>{t(language, "nextAction")}</span>
            <textarea value={draft.nextAction} onChange={(event) => update("nextAction", event.target.value)} />
          </label>
        </div>
        <ModalActions language={language} onCancel={onCancel} label={t(language, "saveShowing")} />
      </form>
    </div>
  );
}

export function TeamMemberForm({
  language,
  onCancel,
  onSave
}: {
  language: Language;
  onCancel: () => void;
  onSave: (draft: TeamMemberDraft) => void;
}) {
  const [draft, setDraft] = useState<TeamMemberDraft>(() => blankTeamMemberDraft());

  function update<K extends keyof TeamMemberDraft>(key: K, value: TeamMemberDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(draft);
  }

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <form className="modal-panel" onSubmit={submit}>
        <ModalHeader title={t(language, "addTeamMember")} subtitle="Phone-based staff identity" onCancel={onCancel} language={language} />
        <div className="form-grid">
          <label>
            <span>{t(language, "name")}</span>
            <input required value={draft.name} onChange={(event) => update("name", event.target.value)} />
          </label>
          <label>
            <span>{t(language, "phone")}</span>
            <input required value={draft.phone} onChange={(event) => update("phone", event.target.value)} placeholder="+95 9 ..." />
          </label>
          <label>
            <span>Role</span>
            <select value={draft.role} onChange={(event) => update("role", event.target.value as TeamMemberRole)}>
              {teamRoles.map((role) => (
                <option key={role} value={role}>
                  {teamRoleLabels[role]}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{t(language, "status")}</span>
            <select value={draft.status} onChange={(event) => update("status", event.target.value as TeamMemberDraft["status"])}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
          <label className="wide">
            <span>{t(language, "internalNotes")}</span>
            <textarea value={draft.notes} onChange={(event) => update("notes", event.target.value)} />
          </label>
        </div>
        <ModalActions language={language} onCancel={onCancel} label={t(language, "saveTeamMember")} />
      </form>
    </div>
  );
}

export function RevealOwnerPhoneForm({
  language,
  property,
  onCancel,
  onReveal
}: {
  language: Language;
  property: PropertyRecord;
  onCancel: () => void;
  onReveal: (reason: RevealReason) => void;
}) {
  const [reason, setReason] = useState<RevealReason>("showing");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onReveal(reason);
  }

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <form className="modal-panel" onSubmit={submit}>
        <ModalHeader title={t(language, "revealOwnerPhone")} subtitle={property.code} onCancel={onCancel} language={language} />
        <div className="security-warning">
          <strong>Zero-trust access</strong>
          <p>Only reveal this owner phone for a real work reason. This action is logged with your team identity, device, time, and property code.</p>
        </div>
        <div className="form-grid">
          <label>
            <span>{t(language, "owner")}</span>
            <input value={property.owner.name} readOnly />
          </label>
          <label>
            <span>{t(language, "maskedOwnerPhone")}</span>
            <input value={maskPhone(property.owner.phone)} readOnly />
          </label>
          <label className="wide">
            <span>{t(language, "revealReason")}</span>
            <select value={reason} onChange={(event) => setReason(event.target.value as RevealReason)}>
              {revealReasons.map((item) => (
                <option key={item} value={item}>
                  {revealReasonLabels[item]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <ModalActions language={language} onCancel={onCancel} label={t(language, "revealOwnerPhone")} />
      </form>
    </div>
  );
}
