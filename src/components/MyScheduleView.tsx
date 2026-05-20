"use client";

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


export function MyScheduleView({
  language,
  showings,
  properties,
  teamMembers,
  scheduleMemberId,
  scheduleFilter,
  setScheduleMemberId,
  setScheduleFilter,
  updateShowingStatus
}: {
  language: Language;
  showings: ShowingRecord[];
  properties: PropertyRecord[];
  teamMembers: TeamMemberRecord[];
  scheduleMemberId: string;
  scheduleFilter: string;
  setScheduleMemberId: (id: string) => void;
  setScheduleFilter: (filter: string) => void;
  updateShowingStatus: (id: string, status: ShowingStatus) => void;
}) {
  const activeTeamMembers = teamMembers.filter((member) => member.status === "active");
  const selectedMember = teamMembers.find((member) => member.id === scheduleMemberId);

  return (
    <section className="stack">
      <div className="button-row" style={{ justifyContent: "space-between" }}>
        <h2>{t(language, "mySchedule")}</h2>
        <span className="pill available">{selectedMember?.name ?? "No team member"}</span>
      </div>
      <div className="filters">
        <select value={scheduleMemberId} onChange={(event) => setScheduleMemberId(event.target.value)}>
          {activeTeamMembers.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
        <select value={scheduleFilter} onChange={(event) => setScheduleFilter(event.target.value)}>
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
          <option value="week">This week</option>
          <option value="all">All upcoming</option>
        </select>
      </div>
      {showings.length === 0 && <div className="empty">{t(language, "noShowings")}</div>}
      <div className="record-grid">
        {showings.map((showing) => {
          const property = getProperty(properties, showing.propertyId);
          return (
            <InfoCard key={showing.id}>
              <div className="card-title">
                <div>
                  <p className="eyebrow">{formatDate(showing.scheduledAt)}</p>
                  <h3>{showing.clientName}</h3>
                  <p className="muted">{showing.clientPhone || "-"}</p>
                  <p className="muted">{property ? `${property.code} · ${property.location}` : "Property missing"}</p>
                </div>
                <span className="pill pending">{showingStatusLabels[showing.status]}</span>
              </div>
              <p>{showing.nextAction || showing.result || "No next action yet."}</p>
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
