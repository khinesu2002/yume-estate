"use client";

import { t } from "@/lib/i18n";
import {
  formatDate,
  revealReasonLabels
} from "@/lib/domain";
import type {
  Language,
  RevealRequestRecord,
  SensitiveAccessLogRecord
} from "@/lib/types";
import { InfoCard, Stat } from "@/components/ui";


export function SecurityView({
  language,
  sensitiveAccessLogs,
  revealRequests,
  activeSensitiveFlags
}: {
  language: Language;
  sensitiveAccessLogs: SensitiveAccessLogRecord[];
  revealRequests: RevealRequestRecord[];
  activeSensitiveFlags: number;
}) {
  const mostViewed = Object.entries(
    sensitiveAccessLogs.reduce<Record<string, number>>((counts, log) => {
      counts[log.propertyCode] = (counts[log.propertyCode] ?? 0) + 1;
      return counts;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <section className="stack">
      <div className="security-warning">
        <strong>{t(language, "localSecurityWarning")}</strong>
      </div>
      <div className="stats">
        <Stat label={t(language, "sensitiveAccess")} value={sensitiveAccessLogs.length} />
        <Stat label={t(language, "suspiciousAccess")} value={activeSensitiveFlags} />
        <Stat label="Reveal requests" value={revealRequests.length} />
        <Stat label="Blocked reveals" value={sensitiveAccessLogs.filter((log) => !log.allowed).length} />
      </div>
      <InfoCard>
        <div className="card-title">
          <h2>{t(language, "sensitiveAccess")}</h2>
          <span className="pill pending">Append-only</span>
        </div>
        <div className="stack">
          {sensitiveAccessLogs.slice(0, 14).map((log) => (
            <div className="mini-card" key={log.id}>
              <div className="card-title">
                <strong>
                  {log.propertyCode} · {log.ownerName}
                </strong>
                <span className={`pill ${log.allowed ? "available" : "unavailable"}`}>{log.allowed ? "allowed" : "blocked"}</span>
              </div>
              <p className="muted">
                {log.teamMemberName} · {log.teamMemberRole} · {revealReasonLabels[log.reason]} · {formatDate(log.timestamp)}
              </p>
              {log.riskFlags.length > 0 && <p className="muted">Flags: {log.riskFlags.join(", ")}</p>}
            </div>
          ))}
          {sensitiveAccessLogs.length === 0 && <p className="muted">No sensitive reveals yet.</p>}
        </div>
      </InfoCard>
      <div className="record-grid">
        <InfoCard>
          <h3>Most-viewed owner contacts</h3>
          <div className="stack">
            {mostViewed.map(([code, count]) => (
              <div className="mini-card" key={code}>
                <div className="card-title">
                  <strong>{code}</strong>
                  <span className="pill pending">{count}</span>
                </div>
              </div>
            ))}
            {mostViewed.length === 0 && <p className="muted">No owner contacts revealed yet.</p>}
          </div>
        </InfoCard>
        <InfoCard>
          <h3>Pending reveal requests</h3>
          <div className="stack">
            {revealRequests.slice(0, 8).map((request) => (
              <div className="mini-card" key={request.id}>
                <div className="card-title">
                  <strong>{request.propertyCode}</strong>
                  <span className="pill pending">{request.status}</span>
                </div>
                <p className="muted">
                  {request.teamMemberName} · {revealReasonLabels[request.reason]} · {formatDate(request.createdAt)}
                </p>
              </div>
            ))}
            {revealRequests.length === 0 && <p className="muted">No blocked requests yet.</p>}
          </div>
        </InfoCard>
      </div>
    </section>
  );
}
