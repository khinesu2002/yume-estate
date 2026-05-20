"use client";

import { useState } from "react";
import { Building2, CalendarDays, Camera, Home, MapPin, Pencil, UsersRound } from "lucide-react";
import { listingLabel, t } from "@/lib/i18n";
import {
  formatDate,
  formatPrice,
  typeLabels
} from "@/lib/domain";
import type {
  Language,
  PropertyRecord,
  PropertyStatus,
  ShowingRecord,
} from "@/lib/types";
import type { RevealState } from "@/lib/domain";

export function InventoryView({
  language,
  filtered,
  selected,
  selectedId,
  setSelectedId,
  setEditingProperty,
  updatePropertyStatus,
  toggleVisibility,
  revealedOwner,
  requestOwnerPhoneReveal,
  openLeadForm,
  openShowingForm
}: {
  language: Language;
  filtered: PropertyRecord[];
  selected?: PropertyRecord;
  selectedId: string;
  setSelectedId: (id: string) => void;
  setEditingProperty: (property: PropertyRecord | "new") => void;
  updatePropertyStatus: (id: string, status: PropertyStatus) => void;
  toggleVisibility: (id: string) => void;
  revealedOwner: RevealState;
  showings: ShowingRecord[];
  requestOwnerPhoneReveal: (property: PropertyRecord) => void;
  openLeadForm: () => void;
  openShowingForm: () => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const gold = "#bd9468";
  const navy = "#111d2b";
  const ff = language === "my" ? "'Padauk','Myanmar Text',sans-serif" : "Georgia,serif";

  function openDetail(id: string) {
    setSelectedId(id);
    setModalOpen(true);
  }

  return (
    <>
      {/* ── PROPERTY LIST ── */}
      <div className="property-list">
        {filtered.length === 0 && (
          <div className="empty">{t(language, "noResults")}</div>
        )}
        {filtered.map((property) => (
          <button
            className={`property-card ${property.id === selectedId ? "selected" : ""}`}
            type="button"
            key={property.id}
            onClick={() => openDetail(property.id)}
          >
            {property.media[0] ? (
              <img className="thumb" src={property.media[0].url} alt={property.media[0].name} />
            ) : (
              <div className="thumb thumb-fallback">
                <Building2 size={30} />
              </div>
            )}
            <div className="card-body">
              <div className="card-title">
                <span className="code">{property.code}</span>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "5px",
                  padding: "2px 10px", borderRadius: "999px",
                  border: `1px solid ${property.status === "available" ? "#2d7a3a" : "#ddd5c0"}`,
                  background: property.status === "available" ? "#f0faf2" : "#f5f0e8",
                  fontSize: "11px", fontWeight: 700,
                  color: property.status === "available" ? "#2d7a3a" : "#7a6a5a",
                }}>
                  <span style={{
                    width: "7px", height: "7px", borderRadius: "50%", flexShrink: 0,
                    background: property.status === "available" ? "#2d7a3a" : "#ccc",
                    boxShadow: property.status === "available" ? "0 0 4px rgba(45,122,58,0.7)" : "none",
                  }} />
                  {property.status === "available"
                    ? (language === "my" ? "ရရှိနိုင်သည်" : "Available")
                    : (language === "my" ? "မရရှိနိုင်ပါ" : "Not Available")}
                </span>
              </div>
              <div className="meta-row"><MapPin size={15} />{property.location}</div>
              <div className="meta-row"><Home size={15} />{listingLabel(language, property.listingType)} · {typeLabels[property.propertyType]?.[language] ?? property.propertyType}</div>
              {property.status === "available" && (
                <div className="meta-row" style={{ color: "#2d7a3a", fontSize: "11px" }}>
                  🌐 {language === "my" ? "yumeestate.com တွင် ဖော်ပြနေသည်" : "Live on yumeestate.com"}
                </div>
              )}
              {/* View count */}
              {(() => {
                const counts = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("yume_view_counts") || "{}") : {};
                const views = counts[property.id] || 0;
                return views > 0 ? (
                  <div className="meta-row" style={{ color: "#5a4a3a", fontSize: "11px" }}>
                    👁 {views.toLocaleString()} {language === "my" ? "ကြိမ် ကြည့်ရှုခဲ့သည်" : "views"}
                  </div>
                ) : null;
              })()}
              <strong>{formatPrice(property)}</strong>
            </div>
          </button>
        ))}
      </div>

      {/* ── FULL SCREEN MODAL ── */}
      {modalOpen && selected && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.75)",
          display: "flex", alignItems: "flex-start", justifyContent: "center",
          overflowY: "auto", padding: "16px",
        }}
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div style={{
            background: "#f5f0e8", borderRadius: "12px",
            width: "100%", maxWidth: "560px",
            border: `2px solid ${gold}`,
            margin: "auto",
          }}>

            {/* Header */}
            <div style={{ background: navy, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: "10px 10px 0 0" }}>
              <div>
                <p style={{ color: gold, fontSize: "10px", letterSpacing: "2px", margin: "0 0 2px", fontFamily: ff }}>
                  {language === "my" ? "အိမ်ခြံမြေ အချက်အလက်" : "PROPERTY DETAILS"}
                </p>
                <h2 style={{ color: "#fff", fontSize: "18px", fontWeight: 600, margin: "0 0 4px", fontFamily: ff }}>{selected.code}</h2>
                {/* View count from public website */}
                {(() => {
                  const counts = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("yume_view_counts") || "{}") : {};
                  const views = counts[selected.id] || 0;
                  return (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "13px" }}>👁</span>
                      <span style={{ color: views > 0 ? "#4cd964" : "#4a6a8a", fontSize: "13px", fontWeight: 700, fontFamily: ff }}>
                        {views.toLocaleString()}
                      </span>
                      <span style={{ color: "#4a6a8a", fontSize: "11px", fontFamily: ff }}>
                        {language === "my" ? "ကြိမ် ကြည့်ရှုခဲ့သည်" : "views on yumeestate.com"}
                      </span>
                    </div>
                  );
                })()}
              </div>
              <button onClick={() => setModalOpen(false)}
                style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", width: "36px", height: "36px", borderRadius: "50%", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                ✕
              </button>
            </div>

            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>

              {/* Photo */}
              {selected.media[0] ? (
                <img src={selected.media[0].url} alt={selected.media[0].name}
                  style={{ width: "100%", borderRadius: "8px", maxHeight: "200px", objectFit: "cover" }} />
              ) : (
                <div style={{ height: "100px", background: `linear-gradient(135deg, ${navy}, #2d4a6e)`, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Camera size={36} color={gold} />
                </div>
              )}

              {/* Available toggle */}
              <button type="button"
                onClick={() => updatePropertyStatus(selected.id, selected.status === "available" ? "not_available" : "available")}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 16px", borderRadius: "8px", cursor: "pointer", width: "100%",
                  border: `2px solid ${selected.status === "available" ? "#2d7a3a" : "#ddd5c0"}`,
                  background: selected.status === "available" ? "#f0faf2" : "#faf7f2",
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: selected.status === "available" ? "#2d7a3a" : "#ccc", boxShadow: selected.status === "available" ? "0 0 6px rgba(45,122,58,0.7)" : "none", flexShrink: 0 }} />
                  <div style={{ textAlign: "left" }}>
                    <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: selected.status === "available" ? "#2d7a3a" : "#7a6a5a", fontFamily: ff }}>
                      {selected.status === "available" ? (language === "my" ? "ရရှိနိုင်သည်" : "Available") : (language === "my" ? "မရရှိနိုင်ပါ" : "Not Available")}
                    </p>
                    <p style={{ margin: 0, fontSize: "11px", color: "#7a6a5a", fontFamily: ff }}>
                      {selected.status === "available"
                        ? (language === "my" ? "🌐 yumeestate.com တွင် ဖော်ပြနေသည်" : "🌐 Visible on yumeestate.com")
                        : (language === "my" ? "ဖောက်သည်များ မမြင်ရပါ" : "Hidden from customers")}
                    </p>
                  </div>
                </div>
                <div style={{ width: "46px", height: "26px", borderRadius: "13px", background: selected.status === "available" ? "#2d7a3a" : "#ddd5c0", position: "relative", flexShrink: 0 }}>
                  <div style={{ position: "absolute", top: "3px", left: selected.status === "available" ? "23px" : "3px", width: "20px", height: "20px", borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                </div>
              </button>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "8px" }}>
                <button className="ghost-button" type="button" style={{ flex: 1 }}
                  onClick={() => { setEditingProperty(selected); setModalOpen(false); }}>
                  <Pencil size={15} /> {language === "my" ? "ပြင်ဆင်" : "Edit"}
                </button>
                <button className="ghost-button" type="button" style={{ flex: 1 }} onClick={openLeadForm}>
                  <UsersRound size={15} /> {t(language, "addLead")}
                </button>
                <button className="ghost-button" type="button" style={{ flex: 1 }} onClick={openShowingForm}>
                  <CalendarDays size={15} /> {t(language, "addShowing")}
                </button>
              </div>

              {/* Property info */}
              <div style={{ background: "#fff", borderRadius: "8px", border: "1px solid #e0d8cc" }}>
                <div style={{ background: navy, padding: "8px 14px", borderRadius: "8px 8px 0 0" }}>
                  <p style={{ color: gold, fontSize: "10px", letterSpacing: "1px", margin: 0, fontFamily: ff }}>📋 {language === "my" ? "အချက်အလက်" : "PROPERTY INFO"}</p>
                </div>
                <div style={{ padding: "14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {[
                    [t(language, "listing"), listingLabel(language, selected.listingType)],
                    [t(language, "type"), typeLabels[selected.propertyType]?.[language] ?? selected.propertyType],
                    [t(language, "price"), formatPrice(selected)],
                    [t(language, "size"), selected.size || "-"],
                    [t(language, "bedroom"), String(selected.bedrooms || "-")],
                    [t(language, "bathroom"), String(selected.bathrooms || "-")],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p style={{ color: "#7a6a5a", fontSize: "11px", margin: "0 0 2px", fontFamily: ff }}>{label}</p>
                      <p style={{ color: navy, fontSize: "14px", fontWeight: 600, margin: 0, fontFamily: ff }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              {selected.description && (
                <div style={{ background: "#fff", borderRadius: "8px", border: "1px solid #e0d8cc" }}>
                  <div style={{ background: navy, padding: "8px 14px", borderRadius: "8px 8px 0 0" }}>
                    <p style={{ color: gold, fontSize: "10px", letterSpacing: "1px", margin: 0, fontFamily: ff }}>📝 {language === "my" ? "ဖော်ပြချက်" : "DESCRIPTION"}</p>
                  </div>
                  <p style={{ padding: "12px 14px", color: "#5a4a3a", fontSize: "14px", margin: 0, lineHeight: 1.6, fontFamily: ff }}>{selected.description}</p>
                </div>
              )}

              {/* 🔒 PRIVATE INFO */}
              <div style={{ background: "#fff8f0", borderRadius: "8px", border: "2px solid #f0a060" }}>
                <div style={{ background: "#7a3a0a", padding: "8px 14px", borderRadius: "8px 8px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ color: "#fff", fontSize: "10px", letterSpacing: "1px", margin: 0, fontFamily: ff }}>🔒 {language === "my" ? "လျှို့ဝှက် အချက်အလက်" : "PRIVATE — AGENT ONLY"}</p>
                  <span style={{ background: "#a32d2d", color: "#fff", fontSize: "9px", padding: "2px 8px", borderRadius: "999px", fontWeight: 700 }}>
                    {language === "my" ? "ဖောက်သည်ထံ လုံးဝ မပြ" : "NEVER PUBLIC"}
                  </span>
                </div>
                <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <p style={{ color: "#7a5a3a", fontSize: "11px", letterSpacing: "1px", margin: "0 0 3px", fontFamily: ff }}>📍 {language === "my" ? "အပြည့်အစုံ လိပ်စာ" : "FULL ADDRESS"}</p>
                    <p style={{ color: navy, fontSize: "14px", fontWeight: 600, margin: 0, lineHeight: 1.5, fontFamily: ff }}>
                      {(selected as any).privateData?.fullAddress || selected.location || "-"}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: "#7a5a3a", fontSize: "11px", letterSpacing: "1px", margin: "0 0 3px", fontFamily: ff }}>👤 {language === "my" ? "ပိုင်ရှင် အမည်" : "OWNER NAME"}</p>
                    <p style={{ color: navy, fontSize: "14px", fontWeight: 600, margin: 0, fontFamily: ff }}>{selected.owner.name || "-"}</p>
                  </div>
                  <div>
                    <p style={{ color: "#7a5a3a", fontSize: "11px", letterSpacing: "1px", margin: "0 0 6px", fontFamily: ff }}>📞 {language === "my" ? "ပိုင်ရှင် ဖုန်းနံပါတ်" : "OWNER PHONE"}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <p style={{ color: navy, fontSize: "20px", fontWeight: 700, margin: 0, fontFamily: ff }}>{selected.owner.phone || "-"}</p>
                      {selected.owner.phone && (
                        <a href={`tel:${selected.owner.phone}`}
                          style={{ background: navy, color: gold, border: `1px solid ${gold}`, padding: "6px 16px", borderRadius: "6px", fontSize: "13px", textDecoration: "none", fontWeight: 600, fontFamily: ff }}>
                          📞 {language === "my" ? "ခေါ်ဆိုရန်" : "Call"}
                        </a>
                      )}
                    </div>
                  </div>
                  {(selected.owner.notes || (selected as any).privateData?.ownerNotes) && (
                    <div>
                      <p style={{ color: "#7a5a3a", fontSize: "11px", letterSpacing: "1px", margin: "0 0 3px", fontFamily: ff }}>📝 {language === "my" ? "မှတ်ချက်" : "NOTES"}</p>
                      <p style={{ color: "#5a4a3a", fontSize: "13px", margin: 0, lineHeight: 1.5, fontFamily: ff }}>
                        {selected.owner.notes || (selected as any).privateData?.ownerNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Photos */}
              {selected.media.length > 0 && (
                <div style={{ background: "#fff", borderRadius: "8px", border: "1px solid #e0d8cc" }}>
                  <div style={{ background: navy, padding: "8px 14px", borderRadius: "8px 8px 0 0" }}>
                    <p style={{ color: gold, fontSize: "10px", letterSpacing: "1px", margin: 0, fontFamily: ff }}>🖼 {language === "my" ? "ဓာတ်ပုံများ" : "PHOTOS"}</p>
                  </div>
                  <div style={{ padding: "12px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px" }}>
                    {selected.media.map((media) => (
                      <img key={media.id} src={media.url} alt={media.name}
                        style={{ width: "100%", borderRadius: "4px", aspectRatio: "1", objectFit: "cover" }} />
                    ))}
                  </div>
                </div>
              )}

              <p style={{ color: "#7a6a5a", fontSize: "12px", textAlign: "center", margin: 0, fontFamily: ff }}>
                {t(language, "lastUpdated")}: {formatDate(selected.updatedAt)}
              </p>

              <button onClick={() => setModalOpen(false)}
                style={{ width: "100%", background: navy, color: gold, border: `2px solid ${gold}`, padding: "14px", borderRadius: "8px", fontSize: "14px", cursor: "pointer", fontFamily: ff, fontWeight: 600 }}>
                {language === "my" ? "ပိတ်ရန်" : "Close"}
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
