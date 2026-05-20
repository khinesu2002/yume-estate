"use client";

import { useState, useMemo } from "react";

const gold = "#bd9468";
const navy = "#111d2b";
const cream = "#f5f0e8";

type Lang = "en" | "my";

interface CategoryPageProps {
  category: {
    id: string;
    icon: string;
    titleEn: string;
    titleMy: string;
    descEn: string;
    descMy: string;
    filter: (p: any) => boolean;
  };
  lang: Lang;
  defaultListingType?: "sale" | "rent";
  onBack: () => void;
  onPropertyClick: (p: any) => void;
  allProperties: any[];
}

function formatPrice(price: number, listing: string, lang: Lang) {
  const lakh = price / 100000;
  if (listing === "rent") return `${lakh.toFixed(0)} ${lang === "my" ? "သိန်း/လ" : "Lakh/mo"}`;
  return `${Math.round(lakh).toLocaleString()} ${lang === "my" ? "သိန်း" : "Lakh"}`;
}

export default function CategoryPage({
  category, lang, defaultListingType = "sale", onBack, onPropertyClick, allProperties
}: CategoryPageProps) {
  const ff = lang === "my" ? "'Padauk','Myanmar Text',sans-serif" : "Georgia,serif";
  const [listingType, setListingType] = useState<"sale" | "rent">(defaultListingType);

  // Filter by category + listing type, featured agents on top
  const results = useMemo(() => {
    const matched = allProperties.filter(p =>
      p.status === "available" &&
      p.listing === listingType &&
      category.filter(p)
    );
    // Featured/boosted agents first, then the rest
    const featured = matched.filter(p => p.featured || p.boosted || p.agentPlan === "agency" || p.agentPlan === "pro");
    const normal = matched.filter(p => !p.featured && !p.boosted && p.agentPlan !== "agency" && p.agentPlan !== "pro");
    return [...featured, ...normal];
  }, [allProperties, listingType, category]);

  const saleCount = allProperties.filter(p => p.status === "available" && p.listing === "sale" && category.filter(p)).length;
  const rentCount = allProperties.filter(p => p.status === "available" && p.listing === "rent" && category.filter(p)).length;

  return (
    <div style={{ minHeight: "100vh", background: "#f8f6f2", fontFamily: ff }}>

      {/* ── STICKY HEADER ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e0d8cc", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: "16px", height: "64px" }}>

          {/* Back */}
          <button onClick={onBack}
            style={{ background: "#f5f0e8", border: "1px solid #e0d8cc", borderRadius: "8px", cursor: "pointer", color: navy, fontSize: "14px", padding: "8px 14px", display: "flex", alignItems: "center", gap: "6px", fontFamily: ff, fontWeight: 600, flexShrink: 0 }}>
            ← {lang === "my" ? "နောက်သို့" : "Back"}
          </button>

          {/* Title */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
            <span style={{ fontSize: "26px" }}>{category.icon}</span>
            <div>
              <h1 style={{ color: navy, fontSize: "18px", fontWeight: 700, margin: 0, fontFamily: ff }}>
                {lang === "my" ? category.titleMy : category.titleEn}
              </h1>
              <p style={{ color: "#7a6a5a", fontSize: "12px", margin: 0, fontFamily: ff }}>
                {lang === "my" ? category.descMy : category.descEn}
              </p>
            </div>
          </div>

          {/* Logo */}
          <img src="/logo.png" alt="Yume Estate" style={{ height: "30px", opacity: 0.7, flexShrink: 0 }} />
        </div>

        {/* ── SALE / RENT TABS ── */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px 0", display: "flex", borderTop: "1px solid #f0ece4" }}>
          {([["sale", "🏠", lang === "my" ? "ရောင်းရန်" : "For Sale", saleCount],
             ["rent", "🔑", lang === "my" ? "ငှားရမ်းရန်" : "For Rent", rentCount]] as const).map(([type, icon, label, count]) => (
            <button key={type} onClick={() => setListingType(type as "sale" | "rent")}
              style={{
                padding: "14px 28px", border: "none", background: "transparent", cursor: "pointer",
                borderBottom: listingType === type ? `3px solid ${gold}` : "3px solid transparent",
                color: listingType === type ? navy : "#7a6a5a",
                fontSize: "14px", fontWeight: listingType === type ? 700 : 400,
                fontFamily: ff, display: "flex", alignItems: "center", gap: "8px",
                transition: "all 0.15s",
              }}>
              {icon} {label}
              <span style={{
                background: listingType === type ? navy : "#f0ece4",
                color: listingType === type ? gold : "#7a6a5a",
                fontSize: "11px", padding: "2px 8px", borderRadius: "999px", fontWeight: 700,
              }}>
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── RESULTS ── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "28px 24px" }}>

        {/* Results count */}
        <p style={{ color: "#5a4a3a", fontSize: "14px", margin: "0 0 20px", fontFamily: ff }}>
          <strong style={{ color: navy, fontSize: "16px" }}>{results.length}</strong>{" "}
          {lang === "my" ? "ခု တွေ့ရှိသည်" : "properties found"}
        </p>

        {results.length === 0 ? (
          /* ── EMPTY STATE ── */
          <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e0d8cc", padding: "80px 24px", textAlign: "center" }}>
            <span style={{ fontSize: "56px", display: "block", marginBottom: "20px" }}>🔍</span>
            <p style={{ color: navy, fontSize: "20px", fontWeight: 700, margin: "0 0 8px", fontFamily: ff }}>
              {lang === "my" ? "ရလဒ်မတွေ့ပါ" : "No properties yet"}
            </p>
            <p style={{ color: "#7a6a5a", fontSize: "14px", margin: "0 0 24px", lineHeight: 1.6, fontFamily: ff }}>
              {lang === "my"
                ? "ဤအမျိုးအစားတွင် ယခု အိမ်ခြံမြေမရှိသေးပါ။ နောက်မှ ပြန်လာကြည့်ပါ။"
                : "No properties in this category yet. Check back soon as agents add more listings."}
            </p>
            <button onClick={onBack}
              style={{ background: navy, color: gold, border: `2px solid ${gold}`, padding: "12px 32px", borderRadius: "8px", fontSize: "14px", cursor: "pointer", fontFamily: ff, fontWeight: 600 }}>
              {lang === "my" ? "ပင်မ စာမျက်နှာ" : "Back to Home"}
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {results.map((p, i) => (
              <div key={p.id || i} onClick={() => onPropertyClick(p)}
                style={{
                  background: "#fff", borderRadius: "14px", overflow: "hidden", cursor: "pointer",
                  border: p.featured || p.boosted ? `2px solid ${gold}` : "1px solid #e0d8cc",
                  boxShadow: p.featured || p.boosted ? `0 4px 20px rgba(189,148,104,0.15)` : "0 1px 4px rgba(0,0,0,0.05)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = "none";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = p.featured || p.boosted ? "0 4px 20px rgba(189,148,104,0.15)" : "0 1px 4px rgba(0,0,0,0.05)";
                }}>

                {/* Featured banner */}
                {(p.featured || p.boosted) && (
                  <div style={{ background: gold, padding: "5px 14px" }}>
                    <span style={{ color: "#fff", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", fontFamily: ff }}>
                      ⭐ {lang === "my" ? "အထူးဖော်ပြ" : "FEATURED LISTING"}
                    </span>
                  </div>
                )}

                {/* Photo */}
                <div style={{ height: "200px", background: `linear-gradient(135deg, #4a6fa5, #6b8cba)`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: "52px", opacity: 0.25 }}>🏠</span>
                  )}

                  {/* Listing badge */}
                  <div style={{ position: "absolute", top: "12px", left: "12px" }}>
                    <span style={{
                      background: listingType === "sale" ? "#2d7a3a" : "#1e4a8e",
                      color: "#fff", fontSize: "11px", padding: "4px 12px",
                      borderRadius: "4px", fontWeight: 700, letterSpacing: "0.5px",
                    }}>
                      {listingType === "sale"
                        ? (lang === "my" ? "ရောင်းရန်" : "FOR SALE")
                        : (lang === "my" ? "ငှားရမ်းရန်" : "FOR RENT")}
                    </span>
                  </div>

                  {/* View count */}
                  {(p.views || 0) > 0 && (
                    <div style={{ position: "absolute", bottom: "10px", left: "12px", background: "rgba(0,0,0,0.55)", borderRadius: "4px", padding: "3px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ fontSize: "10px" }}>👁</span>
                      <span style={{ color: "#fff", fontSize: "11px" }}>{p.views}</span>
                    </div>
                  )}

                  {/* Save */}
                  <button
                    onClick={e => e.stopPropagation()}
                    style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(255,255,255,0.92)", border: "none", borderRadius: "50%", width: "34px", height: "34px", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    🤍
                  </button>
                </div>

                {/* Content */}
                <div style={{ padding: "16px" }}>
                  <p style={{ color: navy, fontSize: "16px", fontWeight: 700, margin: "0 0 6px", fontFamily: ff, lineHeight: 1.3 }}>
                    {lang === "my" ? p.titleMy || p.title : p.title}
                  </p>
                  <p style={{ color: "#7a6a5a", fontSize: "13px", margin: "0 0 12px", fontFamily: ff }}>
                    📍 {p.township}{p.city ? `, ${p.city}` : ""}
                  </p>

                  {/* Floor plan */}
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
                    {p.bedrooms > 0 && (
                      <span style={{ background: "#f5f0e8", color: "#5a4a3a", fontSize: "12px", padding: "4px 10px", borderRadius: "6px", fontFamily: ff }}>
                        🛏 {p.bedrooms} {lang === "my" ? "ခန်း" : "Bed"}
                      </span>
                    )}
                    {p.bathrooms > 0 && (
                      <span style={{ background: "#f5f0e8", color: "#5a4a3a", fontSize: "12px", padding: "4px 10px", borderRadius: "6px", fontFamily: ff }}>
                        🚿 {p.bathrooms} {lang === "my" ? "ခန်း" : "Bath"}
                      </span>
                    )}
                    {p.size && (
                      <span style={{ background: "#f5f0e8", color: "#5a4a3a", fontSize: "12px", padding: "4px 10px", borderRadius: "6px", fontFamily: ff }}>
                        📐 {p.size}
                      </span>
                    )}
                    {(p.type || p.propertyType) && (
                      <span style={{ background: "#f5f0e8", color: "#5a4a3a", fontSize: "12px", padding: "4px 10px", borderRadius: "6px", fontFamily: ff }}>
                        {p.type || p.propertyType}
                      </span>
                    )}
                  </div>

                  {/* Price + Agent */}
                  <div style={{ borderTop: "1px solid #f0ece4", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ color: gold, fontSize: "20px", fontWeight: 700, margin: "0 0 3px", fontFamily: ff }}>
                        {formatPrice(p.price, listingType, lang)}
                      </p>
                      {/* Agent name */}
                      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: navy, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", color: gold, fontWeight: 700, flexShrink: 0 }}>
                          {(p.agentName || "A")[0]}
                        </div>
                        <span style={{ color: "#7a6a5a", fontSize: "11px", fontFamily: ff }}>
                          {p.agentName || (lang === "my" ? "အေးဂျင့်" : "Agent")}
                        </span>
                        <span style={{ color: "#2d7a3a", fontSize: "10px" }}>✓</span>
                      </div>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); onPropertyClick(p); }}
                      style={{ background: navy, color: gold, border: `1px solid ${gold}`, padding: "10px 20px", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontFamily: ff, fontWeight: 600, whiteSpace: "nowrap" }}>
                      {lang === "my" ? "ကြည့်ရန် →" : "View →"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
