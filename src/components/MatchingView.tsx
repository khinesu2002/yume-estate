"use client";

import { Plus } from "lucide-react";
import { listingLabel, t } from "@/lib/i18n";
import {
  formatPrice,
  typeLabels
} from "@/lib/domain";
import type {
  ClientRequirementRecord,
  Language,
  PropertyRecord
} from "@/lib/types";
import { InfoCard } from "@/components/ui";


export function MatchingView({
  language,
  requirements,
  selectedRequirementId,
  setSelectedRequirementId,
  matches,
  openRequirementForm
}: {
  language: Language;
  requirements: ClientRequirementRecord[];
  selectedRequirementId: string;
  setSelectedRequirementId: (id: string) => void;
  matches: Array<{ property: PropertyRecord; score: number }>;
  openRequirementForm: () => void;
}) {
  const selectedRequirement = requirements.find((requirement) => requirement.id === selectedRequirementId) ?? requirements[0];

  return (
    <section className="stack">
      <div className="button-row" style={{ justifyContent: "space-between" }}>
        <h2>{t(language, "matching")}</h2>
        <button className="primary-button" type="button" onClick={openRequirementForm}>
          <Plus size={18} />
          {t(language, "addRequirement")}
        </button>
      </div>
      {requirements.length === 0 && <div className="empty">{t(language, "noRequirements")}</div>}
      {requirements.length > 0 && (
        <div className="property-layout">
          <div className="property-list">
            {requirements.map((requirement) => (
              <button
                className={`property-card requirement-card ${requirement.id === selectedRequirement?.id ? "selected" : ""}`}
                type="button"
                key={requirement.id}
                onClick={() => setSelectedRequirementId(requirement.id)}
              >
                <div className="card-body">
                  <div className="card-title">
                    <span className="code">{requirement.clientName}</span>
                    <span className="pill available">{requirement.listingType}</span>
                  </div>
                  <div className="meta-row">{requirement.township || "Any township"}</div>
                  <div className="meta-row">
                    {requirement.propertyType === "all" ? "Any type" : requirement.propertyType} · {requirement.maxBudget || "No max"} MMK
                  </div>
                </div>
              </button>
            ))}
          </div>
          <InfoCard>
            <p className="eyebrow">{t(language, "findMatches")}</p>
            <h2>{selectedRequirement?.clientName}</h2>
            <div className="record-grid">
              {matches.map(({ property, score }) => (
                <div className="mini-card" key={property.id}>
                  <div className="card-title">
                    <strong>{property.code}</strong>
                    <span className="pill available">{score}%</span>
                  </div>
                  <p className="muted">{property.location}</p>
                  <p>
                    {listingLabel(language, property.listingType)} · {typeLabels[property.propertyType]?.[language] ?? property.propertyType} · {formatPrice(property)}
                  </p>
                </div>
              ))}
            </div>
          </InfoCard>
        </div>
      )}
    </section>
  );
}
