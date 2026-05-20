"use client";

import { Plus } from "lucide-react";
import { t } from "@/lib/i18n";
import {
  getProperty,
  leadStatusLabels,
  leadStatuses,
  sourceLabels
} from "@/lib/domain";
import type {
  Language,
  LeadRecord,
  LeadStatus,
  PropertyRecord
} from "@/lib/types";
import { InfoCard } from "@/components/ui";


export function LeadInbox({
  language,
  leads,
  properties,
  updateLeadStatus,
  openLeadForm
}: {
  language: Language;
  leads: LeadRecord[];
  properties: PropertyRecord[];
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  openLeadForm: () => void;
}) {
  return (
    <section className="stack">
      <div className="button-row" style={{ justifyContent: "space-between" }}>
        <h2>{t(language, "leads")}</h2>
        <button className="primary-button" type="button" onClick={openLeadForm}>
          <Plus size={18} />
          {t(language, "addLead")}
        </button>
      </div>
      {leads.length === 0 && <div className="empty">{t(language, "noLeads")}</div>}
      <div className="record-grid">
        {leads.map((lead) => {
          const property = getProperty(properties, lead.interestedPropertyId);
          return (
            <InfoCard key={lead.id}>
              <div className="card-title">
                <div>
                  <p className="eyebrow">{sourceLabels[lead.source]}</p>
                  <h3>{lead.clientName}</h3>
                  <p className="muted">{lead.phone}</p>
                </div>
                <span className="pill pending">{leadStatusLabels[lead.status]}</span>
              </div>
              <p className="muted">{property ? `${property.code} · ${property.location}` : "No exact property yet"}</p>
              <p>{lead.notes || "-"}</p>
              <label>
                <span>{t(language, "status")}</span>
                <select value={lead.status} onChange={(event) => updateLeadStatus(lead.id, event.target.value as LeadStatus)}>
                  {leadStatuses.map((status) => (
                    <option key={status} value={status}>
                      {leadStatusLabels[status]}
                    </option>
                  ))}
                </select>
              </label>
            </InfoCard>
          );
        })}
      </div>
    </section>
  );
}
