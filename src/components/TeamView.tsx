"use client";

import { Plus } from "lucide-react";
import { t } from "@/lib/i18n";
import {
  formatDate,
  teamRoleLabels
} from "@/lib/domain";
import type {
  AccessLogRecord,
  Language,
  TeamMemberRecord
} from "@/lib/types";
import { InfoCard } from "@/components/ui";


export function TeamView({
  language,
  teamMembers,
  accessLogs,
  deactivateTeamMember,
  openTeamMemberForm
}: {
  language: Language;
  teamMembers: TeamMemberRecord[];
  accessLogs: AccessLogRecord[];
  deactivateTeamMember: (id: string) => void;
  openTeamMemberForm: () => void;
}) {
  return (
    <section className="stack">
      <div className="button-row" style={{ justifyContent: "space-between" }}>
        <h2>{t(language, "team")}</h2>
        <button className="primary-button" type="button" onClick={openTeamMemberForm}>
          <Plus size={18} />
          {t(language, "addTeamMember")}
        </button>
      </div>
      {teamMembers.length === 0 && <div className="empty">{t(language, "noTeamMembers")}</div>}
      <div className="record-grid">
        {teamMembers.map((member) => (
          <InfoCard key={member.id}>
            <div className="card-title">
              <div>
                <p className="eyebrow">{teamRoleLabels[member.role]}</p>
                <h3>{member.name}</h3>
                <p className="muted">{member.phone}</p>
              </div>
              <span className={`pill ${member.status === "active" ? "available" : "unavailable"}`}>{member.status}</span>
            </div>
            <p>{member.notes || "-"}</p>
            {member.status === "active" && (
              <button className="ghost-button" type="button" onClick={() => deactivateTeamMember(member.id)}>
                Deactivate
              </button>
            )}
          </InfoCard>
        ))}
      </div>
      <InfoCard>
        <div className="card-title">
          <h2>{t(language, "loginHistory")}</h2>
          <span className="pill available">{accessLogs.length}</span>
        </div>
        <div className="stack">
          {accessLogs.slice(0, 12).map((log) => (
            <div className="mini-card" key={log.id}>
              <div className="card-title">
                <strong>{log.teamMemberName}</strong>
                <span className="muted">{formatDate(log.timestamp)}</span>
              </div>
              <p className="muted">
                {log.phone} · {log.authProvider}
              </p>
              <p className="muted">{log.userAgent}</p>
            </div>
          ))}
          {accessLogs.length === 0 && <p className="muted">No login history yet.</p>}
        </div>
      </InfoCard>
    </section>
  );
}
