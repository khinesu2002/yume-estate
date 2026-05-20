"use client";

import { Plus } from "lucide-react";
import { t } from "@/lib/i18n";
import {
  formatDate,
  getProperty,
  showingStatusLabels,
  showingStatuses
} from "@/lib/domain";
import type {
  Language,
  PropertyRecord,
  ShowingRecord,
  ShowingStatus,
  TeamMemberRecord
} from "@/lib/types";
import { InfoCard } from "@/components/ui";


export function ShowingView({
  language,
  showings,
  properties,
  teamMembers,
  updateShowingStatus,
  openShowingForm
}: {
  language: Language;
  showings: ShowingRecord[];
  properties: PropertyRecord[];
  teamMembers: TeamMemberRecord[];
  updateShowingStatus: (id: string, status: ShowingStatus) => void;
  openShowingForm: () => void;
}) {
  return (
    <section className="stack">
      <div className="button-row" style={{ justifyContent: "space-between" }}>
        <h2>{t(language, "showings")}</h2>
        <button className="primary-button" type="button" onClick={openShowingForm}>
          <Plus size={18} />
          {t(language, "addShowing")}
        </button>
      </div>
      {showings.length === 0 && <div className="empty">{t(language, "noShowings")}</div>}
      <div className="record-grid">
        {showings.map((showing) => {
          const property = getProperty(properties, showing.propertyId);
          const assignee = showing.assignedTeamMemberName || teamMembers.find((member) => member.id === showing.assignedTeamMemberId)?.name || showing.assignedAgent;
          return (
            <InfoCard key={showing.id}>
              <div className="card-title">
                <div>
                  <p className="eyebrow">{formatDate(showing.scheduledAt)}</p>
                  <h3>{showing.clientName}</h3>
                  <p className="muted">{property ? `${property.code} · ${property.location}` : "Property missing"}</p>
                  <p className="muted">
                    {t(language, "assignedTo")}: {assignee || "Unassigned"}
                  </p>
                </div>
                <span className="pill pending">{showingStatusLabels[showing.status]}</span>
              </div>
              <p>{showing.result || showing.nextAction || "No result yet."}</p>
              <label>
                <span>{t(language, "status")}</span>
                <select value={showing.status} onChange={(event) => updateShowingStatus(showing.id, event.target.value as ShowingStatus)}>
                  {showingStatuses.map((status) => (
                    <option key={status} value={status}>
                      {showingStatusLabels[status]}
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
