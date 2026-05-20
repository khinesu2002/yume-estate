"use client";

import { InfoCard } from "@/components/ui";


export function StrategyView({ publicCount }: { publicCount: number }) {
  return (
    <section className="stack">
      <InfoCard>
        <p className="eyebrow">First-principles strategy</p>
        <h2>Beat portals by owning the operating system</h2>
        <p className="muted">
          iMyanmarHouse and ShweProperty own traffic and public listings. This app should first own the cleaner asset: verified inventory, owner context,
          client demand, lead history, and showing follow-up.
        </p>
      </InfoCard>
      <div className="record-grid">
        <InfoCard>
          <h3>1. Inventory OS</h3>
          <p className="muted">Make property data fast, structured, searchable, and private by default.</p>
        </InfoCard>
        <InfoCard>
          <h3>2. Lead Inbox</h3>
          <p className="muted">Capture every Facebook, phone, referral, website, iMyanmarHouse, and ShweProperty inquiry.</p>
        </InfoCard>
        <InfoCard>
          <h3>3. Matching Engine</h3>
          <p className="muted">Turn client requirements into shortlists agents can send quickly.</p>
        </InfoCard>
        <InfoCard>
          <h3>4. Toll Bridge Later</h3>
          <p className="muted">{publicCount} properties are marked public-ready, but phone numbers stay controlled inside the agent workspace.</p>
        </InfoCard>
      </div>
    </section>
  );
}
