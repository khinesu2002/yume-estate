"use client";

import type { ReactNode } from "react";
import { Plus, X } from "lucide-react";
import { t } from "@/lib/i18n";
import { maskPhone } from "@/lib/domain";
import type { Language } from "@/lib/types";

export function LanguageSwitch({ language, onChange }: { language: Language; onChange: (language: Language) => void }) {
  return (
    <div className="language-switch" aria-label="Language">
      <button className={language === "en" ? "active" : ""} type="button" onClick={() => onChange("en")}>
        EN
      </button>
      <button className={language === "my" ? "active" : ""} type="button" onClick={() => onChange("my")}>
        မြန်
      </button>
    </div>
  );
}

export function ModalHeader({ title, subtitle, onCancel, language }: { title: string; subtitle: string; onCancel: () => void; language: Language }) {
  return (
    <div className="topbar">
      <div>
        <p className="eyebrow">{title}</p>
        <h2>{subtitle}</h2>
      </div>
      <button className="icon-button" type="button" onClick={onCancel} aria-label={t(language, "cancel")}>
        <X size={18} />
      </button>
    </div>
  );
}

export function ModalActions({ language, label, onCancel }: { language: Language; label: string; onCancel: () => void }) {
  return (
    <div className="button-row" style={{ justifyContent: "flex-end", marginTop: 16 }}>
      <button className="ghost-button" type="button" onClick={onCancel}>
        {t(language, "cancel")}
      </button>
      <button className="primary-button" type="submit">
        <Plus size={18} />
        {label}
      </button>
    </div>
  );
}

export function Segmented({
  firstLabel,
  secondLabel,
  firstActive,
  onFirst,
  onSecond
}: {
  firstLabel: string;
  secondLabel: string;
  firstActive: boolean;
  onFirst: () => void;
  onSecond: () => void;
}) {
  return (
    <div className="segmented">
      <button className={firstActive ? "active" : ""} type="button" onClick={onFirst}>
        {firstLabel}
      </button>
      <button className={!firstActive ? "active" : ""} type="button" onClick={onSecond}>
        {secondLabel}
      </button>
    </div>
  );
}

export function InfoCard({ children }: { children: ReactNode }) {
  return <div className="detail-panel">{children}</div>;
}

export function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="stat">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function TabButton({ active, icon, label, onClick }: { active: boolean; icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button className={`tab-button ${active ? "active" : ""}`} type="button" onClick={onClick}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

export function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail-item">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function RevealedOwnerPhone({ phone, visible }: { phone: string; visible: boolean }) {
  return <>{visible ? phone : maskPhone(phone)}</>;
}
