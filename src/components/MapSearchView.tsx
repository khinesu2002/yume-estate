"use client";

/**
 * YUME ESTATE — MapSearchView
 *
 * Interactive map search using Leaflet.js (loaded via CDN in useEffect).
 * Shows property pins on a map of Myanmar.
 * Click a pin → see property card popup.
 * List panel on the left (desktop) / bottom sheet (mobile).
 * Filters: Sale/Rent, Type, Price range.
 *
 * Place in: src/components/MapSearchView.tsx
 * Usage in PublicPropertyPage:
 *   import MapSearchView from "@/components/MapSearchView";
 *   {mainTab === "map" && <MapSearchView properties={PROPERTIES} lang={lang} onPropertyClick={openProperty} />}
 */

import { useEffect, useRef, useState } from "react";

type Lang = "en" | "my";

interface Property {
  id: string;
  title: string;
  titleMy?: string;
  township: string;
  listing: "sale" | "rent";
  type: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  agentName: string;
  agentAvatar: string;
  agentPhone: string;
  featured?: boolean;
  images?: string[];
}

interface MapSearchViewProps {
  properties: Property[];
  lang: Lang;
  onPropertyClick: (p: Property) => void;
}

// ── Township coordinates (Yangon + key cities) ──────────────────────────────
const TOWNSHIP_COORDS: Record<string, [number, number]> = {
  // Yangon townships
  "Yankin":           [16.8226, 96.1649],
  "Bahan":            [16.8100, 96.1512],
  "Kamayut":          [16.8340, 96.1300],
  "Sanchaung":        [16.8260, 96.1380],
  "Hlaing":           [16.8450, 96.1120],
  "Tamwe":            [16.8090, 96.1788],
  "Mayangone":        [16.8780, 96.1320],
  "Insein":           [16.9220, 96.1010],
  "North Dagon":      [16.8780, 96.2100],
  "South Dagon":      [16.8380, 96.2250],
  "North Okkalapa":   [16.8600, 96.2010],
  "South Okkalapa":   [16.8420, 96.1950],
  "Thingangyun":      [16.8060, 96.2050],
  "Thaketa":          [16.7880, 96.2100],
  "Dawbon":           [16.8050, 96.2180],
  "Pabedan":          [16.7820, 96.1570],
  "Lanmadaw":         [16.7780, 96.1460],
  "Latha":            [16.7830, 96.1500],
  "Mingaladon":       [16.9480, 96.1150],
  "Hlaingtharya":     [16.9050, 96.0350],
  // Other cities
  "Chanayethazan":    [21.9762, 96.0785],
  "Amarapura":        [21.9040, 96.0440],
  "Zabuthiri":        [19.7600, 96.1200],
  "Bago":             [17.3350, 96.4800],
  "Mandalay":         [21.9588, 96.0891],
  "Taunggyi":         [20.7922, 97.0373],
};

// Default coords if township not found
const DEFAULT_COORDS: [number, number] = [16.8409, 96.1735]; // Yangon centre

function getTownshipCoords(township: string): [number, number] {
  return TOWNSHIP_COORDS[township] || DEFAULT_COORDS;
}

function formatPrice(price: number, listing: string, lang: Lang) {
  const lakh = price / 100000;
  if (listing === "rent") return `${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(1)} ${lang === "my" ? "သိန်း/လ" : "Lakh/mo"}`;
  if (lakh >= 10000) return `${(lakh / 10000).toFixed(0)} ${lang === "my" ? "ကုဋေ" : "Cr"}`;
  return `${lakh % 1 === 0 ? lakh.toLocaleString() : lakh.toFixed(0)} ${lang === "my" ? "သိန်း" : "Lakh"}`;
}

const gold = "#bd9468";
const navy = "#111d2b";

export default function MapSearchView({ properties, lang, onPropertyClick }: MapSearchViewProps) {
  const ff = lang === "my" ? "'Padauk','Myanmar Text',sans-serif" : "Georgia,serif";
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [listingFilter, setListingFilter] = useState<"all" | "sale" | "rent">("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showList, setShowList] = useState(true);

  const filtered = properties.filter(p => {
    if (listingFilter !== "all" && p.listing !== listingFilter) return false;
    if (typeFilter !== "all" && p.type.toLowerCase() !== typeFilter) return false;
    return true;
  });

  const selectedProp = filtered.find(p => p.id === selectedId) || null;

  // ── Load Leaflet + render map ──────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Load Leaflet CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(link);
    }

    // Load Leaflet JS
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.onload = () => initMap();
    document.head.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  function initMap() {
    const L = (window as any).L;
    if (!L || !mapRef.current) return;

    const map = L.map(mapRef.current, {
      center: [16.8409, 96.1735],
      zoom: 12,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 18,
    }).addTo(map);

    mapInstanceRef.current = map;
    renderMarkers(L, map, properties, "all", "all");
  }

  function renderMarkers(L: any, map: any, props: Property[], listFilter: string, typFilter: string) {
    // Clear existing markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    const shown = props.filter(p => {
      if (listFilter !== "all" && p.listing !== listFilter) return false;
      if (typFilter !== "all" && p.type.toLowerCase() !== typFilter) return false;
      return true;
    });

    shown.forEach(p => {
      const coords = getTownshipCoords(p.township);
      const isFeatured = !!p.featured;

      // Custom SVG pin icon
      const pinColor = isFeatured ? gold : navy;
      const pinSize = isFeatured ? 42 : 36;
      const iconHtml = `
        <div style="
          background: ${pinColor};
          border: 2px solid #fff;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          width: ${pinSize}px; height: ${pinSize}px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
          <span style="transform: rotate(45deg); color: #fff; font-size: ${isFeatured ? 11 : 9}px; font-weight: 700; font-family: Georgia, serif; text-align: center; line-height: 1.1;">
            ${formatPrice(p.price, p.listing, lang)}
          </span>
        </div>
      `;

      const icon = L.divIcon({
        html: iconHtml,
        className: "",
        iconSize: [pinSize, pinSize],
        iconAnchor: [pinSize / 2, pinSize],
        popupAnchor: [0, -pinSize],
      });

      const marker = L.marker(coords, { icon }).addTo(map);

      // Popup
      const title = lang === "my" ? p.titleMy || p.title : p.title;
      const popup = L.popup({
        maxWidth: 260,
        className: "yume-popup",
      }).setContent(`
        <div style="font-family: Georgia, serif; padding: 4px;">
          <div style="font-size: 11px; color: ${p.listing === "sale" ? "#2d7a3a" : "#1e4a8e"}; font-weight: 700; margin-bottom: 4px; letter-spacing: 1px;">
            ${p.listing === "sale" ? (lang === "my" ? "ရောင်းရန်" : "FOR SALE") : (lang === "my" ? "ငှားရမ်းရန်" : "FOR RENT")}
          </div>
          <p style="font-size: 14px; font-weight: 600; color: ${navy}; margin: 0 0 4px; line-height: 1.3;">${title}</p>
          <p style="font-size: 12px; color: #7a6a5a; margin: 0 0 8px;">📍 ${p.township}</p>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: ${gold}; font-size: 16px; font-weight: 700;">${formatPrice(p.price, p.listing, lang)}</span>
            <button onclick="window.__yumeSelectProp('${p.id}')" style="background: ${navy}; color: ${gold}; border: 1px solid ${gold}; padding: 6px 14px; border-radius: 6px; font-size: 12px; cursor: pointer; font-family: Georgia, serif;">
              ${lang === "my" ? "ကြည့်ရန်" : "View →"}
            </button>
          </div>
          ${p.bedrooms ? `<div style="margin-top: 8px; font-size: 11px; color: #7a6a5a;">${p.bedrooms} bed · ${p.bathrooms || 1} bath · ${p.type}</div>` : ""}
        </div>
      `);

      marker.bindPopup(popup);
      marker.on("click", () => {
        setSelectedId(p.id);
      });

      markersRef.current.push(marker);
    });
  }

  // Re-render markers when filters change
  useEffect(() => {
    const L = (window as any).L;
    const map = mapInstanceRef.current;
    if (!L || !map) return;
    renderMarkers(L, map, properties, listingFilter, typeFilter);
  }, [listingFilter, typeFilter, properties, lang]);

  // Wire popup View button to global function
  useEffect(() => {
    (window as any).__yumeSelectProp = (id: string) => {
      const prop = properties.find(p => p.id === id);
      if (prop) onPropertyClick(prop);
    };
    return () => { delete (window as any).__yumeSelectProp; };
  }, [properties, onPropertyClick]);

  const types = Array.from(new Set(properties.map(p => p.type)));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 130px)", minHeight: "500px", background: "#f8f5f0" }}>

      {/* ── Filter bar ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e0d8cc", padding: "10px 16px", display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center", flexShrink: 0 }}>
        <p style={{ color: navy, fontSize: "13px", fontWeight: 600, margin: 0, fontFamily: ff, whiteSpace: "nowrap" }}>
          {lang === "my" ? "မြေပုံ ရှာဖွေရန်" : "Map Search"}
        </p>
        <div style={{ display: "flex", gap: "6px", flex: 1, flexWrap: "wrap" }}>
          {/* Listing type */}
          <div style={{ display: "flex", background: "#f5f0e8", borderRadius: "6px", padding: "2px" }}>
            {(["all", "sale", "rent"] as const).map(v => (
              <button key={v} onClick={() => setListingFilter(v)}
                style={{ padding: "6px 12px", borderRadius: "5px", border: "none", background: listingFilter === v ? navy : "transparent", color: listingFilter === v ? gold : "#7a6a5a", fontSize: "12px", fontWeight: listingFilter === v ? 700 : 400, cursor: "pointer", fontFamily: ff, transition: "all 0.15s" }}>
                {v === "all" ? (lang === "my" ? "အားလုံး" : "All") : v === "sale" ? (lang === "my" ? "ရောင်းရန်" : "Sale") : (lang === "my" ? "ငှားရန်" : "Rent")}
              </button>
            ))}
          </div>
          {/* Type */}
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #e0d8cc", fontSize: "12px", fontFamily: ff, background: "#fff", color: navy }}>
            <option value="all">{lang === "my" ? "အမျိုးအစား အားလုံး" : "All Types"}</option>
            {types.map(t => <option key={t} value={t.toLowerCase()}>{t}</option>)}
          </select>
        </div>
        {/* Results count */}
        <p style={{ color: "#7a6a5a", fontSize: "12px", margin: 0, fontFamily: ff, whiteSpace: "nowrap" }}>
          <strong style={{ color: navy }}>{filtered.length}</strong> {lang === "my" ? "ခု" : "listings"}
        </p>
        {/* Toggle list */}
        <button onClick={() => setShowList(!showList)}
          style={{ padding: "6px 12px", borderRadius: "6px", border: `1px solid ${gold}`, background: showList ? navy : "transparent", color: showList ? gold : navy, fontSize: "12px", cursor: "pointer", fontFamily: ff, whiteSpace: "nowrap" }}>
          {showList ? (lang === "my" ? "မြေပုံသာ" : "Map only") : (lang === "my" ? "စာရင်းပြ" : "Show list")}
        </button>
      </div>

      {/* ── Main content: map + list ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>

        {/* List panel */}
        {showList && (
          <div style={{ width: "320px", flexShrink: 0, overflowY: "auto", background: "#fff", borderRight: "1px solid #e0d8cc", display: "flex", flexDirection: "column" }}>
            {filtered.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center" }}>
                <p style={{ color: "#7a6a5a", fontSize: "14px", fontFamily: ff }}>{lang === "my" ? "ရလဒ်မတွေ့ပါ" : "No properties found"}</p>
              </div>
            ) : (
              filtered.map(p => {
                const title = lang === "my" ? p.titleMy || p.title : p.title;
                const isSelected = p.id === selectedId;
                return (
                  <div key={p.id}
                    onClick={() => {
                      setSelectedId(p.id);
                      const L = (window as any).L;
                      const map = mapInstanceRef.current;
                      if (L && map) {
                        const coords = getTownshipCoords(p.township);
                        map.setView(coords, 14, { animate: true });
                      }
                    }}
                    style={{
                      padding: "14px 16px",
                      borderBottom: "1px solid #f0ece4",
                      cursor: "pointer",
                      background: isSelected ? "#faf7f2" : "#fff",
                      borderLeft: isSelected ? `3px solid ${gold}` : "3px solid transparent",
                      transition: "all 0.15s",
                    }}>
                    {/* Featured badge */}
                    {p.featured && (
                      <span style={{ display: "inline-block", background: gold, color: "#fff", fontSize: "9px", padding: "2px 8px", borderRadius: "3px", fontWeight: 700, marginBottom: "6px", letterSpacing: "1px" }}>
                        ★ {lang === "my" ? "အထူးဖော်ပြ" : "FEATURED"}
                      </span>
                    )}
                    {/* Title */}
                    <p style={{ color: navy, fontSize: "13px", fontWeight: 600, margin: "0 0 3px", fontFamily: ff, lineHeight: 1.3 }}>{title}</p>
                    {/* Location */}
                    <p style={{ color: "#7a6a5a", fontSize: "11px", margin: "0 0 8px", fontFamily: ff }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: "middle", marginRight: "3px" }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {p.township}
                    </p>
                    {/* Price + type */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: gold, fontSize: "15px", fontWeight: 700, fontFamily: ff }}>
                        {formatPrice(p.price, p.listing, lang)}
                      </span>
                      <div style={{ display: "flex", gap: "5px" }}>
                        <span style={{ background: p.listing === "sale" ? "#e8f5e9" : "#e3ecf9", color: p.listing === "sale" ? "#2d7a3a" : "#1e4a8e", fontSize: "9px", padding: "2px 7px", borderRadius: "4px", fontWeight: 700 }}>
                          {p.listing === "sale" ? (lang === "my" ? "ရောင်းရန်" : "SALE") : (lang === "my" ? "ငှားရန်" : "RENT")}
                        </span>
                        <span style={{ background: "#f5f0e8", color: "#5a4a3a", fontSize: "9px", padding: "2px 7px", borderRadius: "4px" }}>{p.type}</span>
                      </div>
                    </div>
                    {/* Beds/baths */}
                    {p.bedrooms ? (
                      <p style={{ color: "#aaa", fontSize: "11px", margin: "6px 0 0", fontFamily: ff }}>
                        {p.bedrooms} {lang === "my" ? "အိပ်ခန်း" : "bed"} · {p.bathrooms} {lang === "my" ? "ရေချိုးခန်း" : "bath"}
                        {p.area ? ` · ${p.area.toLocaleString()} sqft` : ""}
                      </p>
                    ) : null}
                    {/* View button */}
                    <button onClick={e => { e.stopPropagation(); onPropertyClick(p); }}
                      style={{ marginTop: "8px", width: "100%", background: navy, color: gold, border: `1px solid ${gold}`, padding: "7px", borderRadius: "6px", fontSize: "11px", cursor: "pointer", fontFamily: ff, fontWeight: 700 }}>
                      {lang === "my" ? "အသေးစိတ် ကြည့်ရန် →" : "View details →"}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Map container */}
        <div style={{ flex: 1, position: "relative" }}>
          <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

          {/* Loading state */}
          {!mapInstanceRef.current && (
            <div style={{ position: "absolute", inset: 0, background: "#e8dfc8", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px" }}>
              <div style={{ width: "32px", height: "32px", border: `3px solid ${gold}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              <p style={{ color: navy, fontSize: "14px", fontFamily: ff }}>{lang === "my" ? "မြေပုံ တင်နေသည်..." : "Loading map..."}</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* Leaflet popup custom style */}
          <style>{`
            .yume-popup .leaflet-popup-content-wrapper {
              border-radius: 10px;
              border-top: 3px solid ${gold};
              box-shadow: 0 8px 24px rgba(0,0,0,0.15);
              padding: 0;
            }
            .yume-popup .leaflet-popup-content {
              margin: 14px;
            }
            .yume-popup .leaflet-popup-tip {
              background: ${gold};
            }
          `}</style>

          {/* Mobile: tap a card to view details */}
          {selectedProp && (
            <div style={{
              position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)",
              background: "#fff", borderRadius: "12px", padding: "14px 16px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)", border: `2px solid ${gold}`,
              width: "min(320px, calc(100% - 32px))", zIndex: 1000,
              display: showList ? "none" : "block",
            }}>
              <button onClick={() => setSelectedId(null)}
                style={{ position: "absolute", top: "10px", right: "10px", background: "none", border: "none", cursor: "pointer", color: "#aaa" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
              <p style={{ color: navy, fontSize: "14px", fontWeight: 600, margin: "0 0 4px", fontFamily: ff, paddingRight: "20px" }}>
                {lang === "my" ? selectedProp.titleMy || selectedProp.title : selectedProp.title}
              </p>
              <p style={{ color: "#7a6a5a", fontSize: "12px", margin: "0 0 10px", fontFamily: ff }}>{selectedProp.township}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: gold, fontSize: "18px", fontWeight: 700, fontFamily: ff }}>
                  {formatPrice(selectedProp.price, selectedProp.listing, lang)}
                </span>
                <button onClick={() => onPropertyClick(selectedProp)}
                  style={{ background: navy, color: gold, border: `1px solid ${gold}`, padding: "8px 16px", borderRadius: "8px", fontSize: "12px", cursor: "pointer", fontFamily: ff, fontWeight: 700 }}>
                  {lang === "my" ? "ကြည့်ရန် →" : "View →"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
