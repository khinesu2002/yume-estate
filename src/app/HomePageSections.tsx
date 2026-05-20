
"use client";

import { useState } from "react";

// ── Yume Estate Design System ──
// Rule: White background everywhere except hero (navy)
// Navy = primary brand, Gold = price/accent, White = all sections
// No cream, no dark green, no alternating colors

const gold = "#bd9468";
const navy = "#111d2b";
const white = "#ffffff";
const grey = "#f7f7f7";  // cards, inputs
const border = "#eeeeee"; // section dividers
const textPrimary = "#111d2b";
const textSecondary = "#666666";
const textMuted = "#999999";

type Lang = "en" | "my";

interface Props {
  lang: Lang;
  listingType: "sale" | "rent";
  onPropertyClick?: (id: string) => void;
  onViewMore?: (categoryId: string) => void;
}

// ── Section Wrapper — white bg, navy border top & bottom ──
function Section({ children, last }: { children: React.ReactNode; last?: boolean }) {
  return (
    <section style={{
      background: "#ffffff",
      padding: "clamp(32px, 5vw, 64px) 0",
      borderBottom: `1px solid #f0f0f0`,
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>
        {children}
      </div>
    </section>
  );
}

// ── Section Header — DD Property style ──
function SectionHead({ en, my, suben, submy, lang, onViewMore }: {
  en: string; my: string; suben?: string; submy?: string; lang: Lang; onViewMore?: () => void;
}) {
  const ff = lang === "my" ? "'Padauk','Myanmar Text',sans-serif" : "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
      <div>
        <h2 style={{ color: "#111111", fontSize: "26px", fontWeight: 700, margin: "0 0 4px", fontFamily: ff, letterSpacing: "-0.5px", lineHeight: 1.2 }}>
          {lang === "my" ? my : en}
        </h2>
        {suben && (
          <p style={{ color: "#888888", fontSize: "14px", margin: 0, fontFamily: ff, fontWeight: 400 }}>
            {lang === "my" ? submy : suben}
          </p>
        )}
      </div>
      {onViewMore && (
        <button onClick={onViewMore}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#111111", fontSize: "14px", fontWeight: 600, fontFamily: ff, display: "flex", alignItems: "center", gap: "2px", whiteSpace: "nowrap", textDecoration: "underline", textDecorationColor: "#cccccc", textUnderlineOffset: "3px" }}>
          {lang === "my" ? "အားလုံးကြည့်ရန်" : "View More"} ›
        </button>
      )}
    </div>
  );
}

// ── Property Card — clean white, Silicon Valley style ──
function PropCard({ gradient, badge, badgeColor, title, titleMy, sub, subMy, price, priceLabel, priceLabelMy, beds, baths, tag, tagMy, lang, onClick, listingType }: any) {
  const ff = lang === "my" ? "'Padauk','Myanmar Text',sans-serif" : "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: "12px", overflow: "hidden",
        border: `1px solid ${hovered ? "#111d2b" : "#111d2b"}`,
        borderTop: `3px solid ${gold}`,
        cursor: "pointer", background: "#ffffff",
        transition: "all 0.18s ease",
        boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.12)" : "0 2px 8px rgba(0,0,0,0.08)",
        transform: hovered ? "translateY(-3px)" : "none",
      }}>
      {/* Photo area */}
      <div style={{ height: "168px", background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ opacity: 0.25 }}>
          <path d="M6 20L24 6L42 20V42H30V30H18V42H6V20Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
        </svg>
        </div>
        {/* Badge top left */}
        {badge && (
          <div style={{ position: "absolute", top: "10px", left: "10px" }}>
            <span style={{ background: badgeColor || navy, color: white, fontSize: "10px", padding: "3px 10px", borderRadius: "4px", fontWeight: 700, letterSpacing: "0.3px" }}>
              {badge}
            </span>
          </div>
        )}
        {/* Tag bottom left */}
        {tag && (
          <div style={{ position: "absolute", bottom: "10px", left: "10px" }}>
            <span style={{ background: "rgba(0,0,0,0.52)", color: white, fontSize: "11px", padding: "3px 9px", borderRadius: "4px", fontFamily: ff }}>
              {lang === "my" && tagMy ? tagMy : tag}
            </span>
          </div>
        )}
        {/* Save heart */}
        <button onClick={e => e.stopPropagation()}
          style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }}>
          ♡
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: "14px 16px" }}>
        <p style={{ color: "#111111", fontSize: "15px", fontWeight: 600, margin: "0 0 3px", fontFamily: ff, lineHeight: 1.35, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {lang === "my" && titleMy ? titleMy : title}
        </p>
        {sub && (
          <p style={{ color: "#888888", fontSize: "12px", margin: "0 0 10px", fontFamily: ff, display: "flex", alignItems: "center", gap: "3px" }}>
             {lang === "my" && subMy ? subMy : sub}
          </p>
        )}
        {(beds || baths) && (
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            {beds && <span style={{ color: "#888888", fontSize: "12px" }}>{beds} Bed</span>}
            {baths && <span style={{ color: "#888888", fontSize: "12px" }}>{baths} Bath</span>}
          </div>
        )}
        <div style={{ borderTop: "1px solid #f5f5f5", paddingTop: "10px", marginTop: "4px" }}>
          <p style={{ color: "#111d2b", fontSize: "17px", fontWeight: 700, margin: "0 0 2px", fontFamily: ff }}>{price}</p>
          {priceLabel && (
            <p style={{ color: "#aaaaaa", fontSize: "11px", margin: 0, fontFamily: ff }}>
              {lang === "my" && priceLabelMy ? priceLabelMy : priceLabel}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── 4-card grid — responsive: 2 cols on mobile, 4 on desktop ──
function CardGrid({ items, lang, listingType, onPropertyClick }: { items: any[]; lang: Lang; listingType: string; onPropertyClick?: (id: string) => void }) {
  return (
    <div className="yume-card-grid">
        {items.slice(0, 4).map((item, i) => (
          <PropCard key={i} {...item} lang={lang} listingType={listingType} onClick={() => onPropertyClick?.(item.id || String(i))} />
        ))}
      </div>
  );
}

export default function HomePageSections({ lang, listingType, onPropertyClick, onViewMore }: Props) {
  const ff = lang === "my" ? "'Padauk','Myanmar Text',sans-serif" : "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  const isBuy = listingType === "sale";
  const [askQ, setAskQ] = useState("");
  const [askA, setAskA] = useState("");
  const [askLoading, setAskLoading] = useState(false);

  async function handleAsk() {
    if (!askQ.trim()) return;
    setAskLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const q = askQ.toLowerCase();
    let a = lang === "my" ? "ကျွန်ုပ်တို့ ကျွမ်းကျင်သော အေးဂျင့်မှ မကြာမီ ဆက်သွယ်ပေးပါမည်။" : "Our expert agents will reach out to you shortly with a personalized answer.";
    if (q.includes("price") || q.includes("ဈေး")) a = lang === "my" ? "ရန်ကုန်တွင် ကွန်ဒို ဈေးနှုန်းများသည် သိန်း ၁,၀၀၀ မှ ၂၀,၀၀၀ ကျပ်အထိ ကွာဟမှု ရှိပါသည်။" : "Condo prices in Yangon range from 1,000 to 20,000 Lakh Kyats depending on location and developer.";
    if (q.includes("invest") || q.includes("ရင်းနှီး")) a = lang === "my" ? "ရင်းနှီးမြှုပ်နှံမှုအတွက် ရန်ကင်း၊ ဗဟန်းနှင့် လှိုင်းသည် နှစ်စဉ် ၈-၁၂% ငှားရမ်းနှုန်း အမြတ်ရနိုင်သည်။" : "Yankin, Bahan and Hlaing offer 8-12% annual rental yields — top picks for investors.";
    if (q.includes("school") || q.includes("ကျောင်း")) a = lang === "my" ? "နိုင်ငံတကာ ကျောင်းနီးသော မြို့နယ်များအတွက် ဗဟန်း၊ မရမ်းကုန်းနှင့် ကမာရွတ် ကောင်းမွန်ပါသည်။" : "Bahan, Mayangone and Kamayut are top picks for families — close to ISY, ILBC and YIS.";
    setAskA(a);
    setAskLoading(false);
  }

  // ── Projects data ──
  const projects = [
    { id:"p1", title: "The Grand Yankin Tower", titleMy: "ဂရမ်းဒ် ရန်ကင်းတာဝါ", sub: "Yankin, Yangon", subMy: "ရန်ကင်း၊ ရန်ကုန်", price: isBuy ? "From 1,500 Lakh" : "8 Lakh/mo", priceLabel: isBuy ? "Freehold · Condo" : "Condo · Rent", badge: "NEW", badgeColor: "#16a34a", beds: 1, baths: 1, gradient: ["#4a6fa5","#6b8cba"], tag: "Launching June 2026" },
    { id:"p2", title: "Mandalay Royal Residences", titleMy: "မန္တလေး ရိုင်ယယ်လ်", sub: "Chanayethazan, Mandalay", subMy: "ချမ်းအေးသာဇံ၊ မန္တလေး", price: isBuy ? "From 1,200 Lakh" : "6 Lakh/mo", priceLabel: isBuy ? "Leasehold · Apartment" : "Apartment · Rent", badge: "HOT", badgeColor: "#dc2626", beds: 2, baths: 2, gradient: ["#92400e","#b45309"], tag: "Selling Fast" },
    { id:"p3", title: "Hlaing Garden Villas", titleMy: "လှိုင်း ဥယျာဉ် ဗီလာ", sub: "Hlaing, Yangon", subMy: "လှိုင်း၊ ရန်ကုန်", price: isBuy ? "From 3,500 Lakh" : "15 Lakh/mo", priceLabel: isBuy ? "Freehold · Villa" : "Villa · Rent", badge: "FEATURED", badgeColor: gold, beds: 3, baths: 2, gradient: ["#166534","#15803d"], tag: "Garden Views" },
    { id:"p4", title: "Naypyidaw Sky Condos", titleMy: "နေပြည်တော် Sky ကွန်ဒို", sub: "Zabuthiri, Naypyidaw", subMy: "ဇဗ္ဗူသီရိ၊ နေပြည်တော်", price: isBuy ? "From 800 Lakh" : "4 Lakh/mo", priceLabel: isBuy ? "Freehold · Condo" : "Condo · Rent", badge: "NEW", badgeColor: "#16a34a", beds: 1, baths: 1, gradient: ["#1e3a5f","#2d5a8e"], tag: "Pre-Sale" },
    { id:"p5", title: "Taunggyi Highland Condo", titleMy: "တောင်ကြီး မြင့်မားသောနေရာ", sub: "Taunggyi, Shan State", subMy: "တောင်ကြီး၊ ရှမ်းပြည်နယ်", price: isBuy ? "From 600 Lakh" : "3 Lakh/mo", priceLabel: isBuy ? "Freehold · Condo" : "Condo · Rent", badge: "SOON", badgeColor: "#7c3aed", beds: 1, baths: 1, gradient: ["#78350f","#92400e"], tag: "Mountain Views" },
    { id:"p6", title: "Sanchaung Premium Tower", titleMy: "စမ်းချောင်း ပရီမီယမ် တာဝါ", sub: "Sanchaung, Yangon", subMy: "စမ်းချောင်း၊ ရန်ကုန်", price: isBuy ? "From 2,200 Lakh" : "10 Lakh/mo", priceLabel: isBuy ? "Freehold · Condo" : "Condo · Rent", badge: "NEW", badgeColor: "#16a34a", beds: 2, baths: 2, gradient: ["#581c87","#7c3aed"], tag: "City Views" },
    { id:"p7", title: "Bahan Signature Residences", titleMy: "ဗဟန်း Signature နေအိမ်", sub: "Bahan, Yangon", subMy: "ဗဟန်း၊ ရန်ကုန်", price: isBuy ? "From 4,000 Lakh" : "18 Lakh/mo", priceLabel: isBuy ? "Freehold · Apartment" : "Apartment · Rent", badge: "PREMIUM", badgeColor: "#111d2b", beds: 3, baths: 2, gradient: ["#1e3a5f","#0f2a4a"], tag: "Lake Views" },
    { id:"p8", title: "Hlaingtharya Smart City", titleMy: "လှိုင်သာယာ Smart City", sub: "Hlaingtharya, Yangon", subMy: "လှိုင်သာယာ၊ ရန်ကုန်", price: isBuy ? "From 300 Lakh" : "2 Lakh/mo", priceLabel: isBuy ? "Freehold · Apartment" : "Apartment · Rent", badge: "VALUE", badgeColor: "#16a34a", beds: 1, baths: 1, gradient: ["#065f46","#047857"], tag: "Smart Home" },
  ];

  const nearSchools = [
    { id:"ns1", title: "Kamayut Studio Hub", titleMy: "ကမာရွတ် စတူဒီယို", sub: "Near Yangon University", subMy: "ရန်ကုန် တက္ကသိုလ်နီး", price: isBuy ? "380 Lakh" : "3 Lakh/mo", priceLabel: isBuy ? "Studio · For Sale" : "Studio · For Rent", gradient: ["#1e3a5f","#2d5a8e"], tag: "5 min to YU", tagMy: "YU မှ ၅ မိနစ်" },
    { id:"ns2", title: "Hlaing Academic Apt", titleMy: "လှိုင်း ပညာရေး အပါတ်မန့်", sub: "Near MIT Yangon", subMy: "MIT ရန်ကုန် နီး", price: isBuy ? "650 Lakh" : "4.5 Lakh/mo", priceLabel: isBuy ? "Apt · For Sale" : "Apt · For Rent", gradient: ["#92400e","#b45309"], tag: "10 min ILBC", tagMy: "ILBC မှ ၁၀ မိနစ်" },
    { id:"ns3", title: "Bahan ISY Zone Condo", titleMy: "ဗဟန်း ISY ဇုန် ကွန်ဒို", sub: "Near Int'l School Yangon", subMy: "ISY နီး", price: isBuy ? "1,200 Lakh" : "6 Lakh/mo", priceLabel: isBuy ? "Condo · For Sale" : "Condo · For Rent", gradient: ["#581c87","#7c3aed"], tag: "ISY Zone", tagMy: "ISY ဇုန်" },
    { id:"ns4", title: "Mayangone Campus Condo", titleMy: "မရမ်းကုန်း ကျောင်းဝင်းနီး", sub: "Near ILBC Mayangone", subMy: "ILBC မရမ်းကုန်း နီး", price: isBuy ? "900 Lakh" : "5 Lakh/mo", priceLabel: isBuy ? "Condo · For Sale" : "Condo · For Rent", gradient: ["#065f46","#047857"], tag: "ILBC Zone", tagMy: "ILBC ဇုန်" },
  ];

  const petFriendly = [
    { id:"pf1", title: "Yankin Pet Garden Condo", titleMy: "ရန်ကင်း တိရစ္ဆာန်ချစ်သူ", sub: "Yankin · Dog Park 2 min", subMy: "ရန်ကင်း · ၂ မိနစ်", price: isBuy ? "720 Lakh" : "5 Lakh/mo", priceLabel: isBuy ? "Condo · For Sale" : "Condo · For Rent", gradient: ["#166534","#15803d"], badge: "PETS OK", badgeColor: "#16a34a" },
    { id:"pf2", title: "Hlaing Green Condo", titleMy: "လှိုင်း အစိမ်းရောင် ကွန်ဒို", sub: "Hlaing · Near Vet", subMy: "လှိုင်း · တိရစ္ဆာန်ဆေးနီး", price: isBuy ? "850 Lakh" : "6 Lakh/mo", priceLabel: isBuy ? "Condo · For Sale" : "Condo · For Rent", gradient: ["#065f46","#047857"], badge: "PETS OK", badgeColor: "#16a34a" },
    { id:"pf3", title: "Tamwe Garden Home", titleMy: "တာမွေ ဥယျာဉ်အိမ်", sub: "Tamwe · Private Garden", subMy: "တာမွေ · ကိုယ်ပိုင်ဥယျာဉ်", price: isBuy ? "550 Lakh" : "4 Lakh/mo", priceLabel: isBuy ? "House · For Sale" : "House · For Rent", gradient: ["#1c4532","#166534"], badge: "GARDEN", badgeColor: "#15803d" },
    { id:"pf4", title: "Mayangone Pet Apt", titleMy: "မရမ်းကုန်း တိရစ္ဆာန်နှင့်", sub: "Mayangone · Ground Floor", subMy: "မရမ်းကုန်း · မြေညီ", price: isBuy ? "620 Lakh" : "4.5 Lakh/mo", priceLabel: isBuy ? "Apt · For Sale" : "Apt · For Rent", gradient: ["#1e3a5f","#2d5a8e"], badge: "PETS OK", badgeColor: "#16a34a" },
  ];

  const luxury = [
    { id:"lx1", title: "The Bahan Grand Penthouse", titleMy: "ဗဟန်း ဂရမ်းဒ် ပင်ထောင်", sub: "Bahan, Yangon", subMy: "ဗဟန်း၊ ရန်ကုန်", price: isBuy ? "18,000 Lakh" : "80 Lakh/mo", priceLabel: isBuy ? "Penthouse · Freehold" : "Penthouse · Rent", gradient: ["#111d2b","#1e3a5f"], badge: "ULTRA LUXURY", badgeColor: "#7c3aed", beds: 5, baths: 4 },
    { id:"lx2", title: "Sanchaung Sky Villa", titleMy: "စမ်းချောင်း Sky ဗီလာ", sub: "Sanchaung, Yangon", subMy: "စမ်းချောင်း၊ ရန်ကုန်", price: isBuy ? "12,000 Lakh" : "55 Lakh/mo", priceLabel: isBuy ? "Villa · Branded" : "Villa · Rent", gradient: ["#78350f","#92400e"], badge: "BRANDED", badgeColor: gold, beds: 4, baths: 3 },
    { id:"lx3", title: "Yankin Tower Penthouse", titleMy: "ရန်ကင်း တာဝါ ပင်ထောင်", sub: "Yankin, Yangon", subMy: "ရန်ကင်း၊ ရန်ကုန်", price: isBuy ? "9,500 Lakh" : "42 Lakh/mo", priceLabel: isBuy ? "Penthouse · City View" : "Penthouse · Rent", gradient: ["#1e3a5f","#0f2a4a"], badge: "PREMIUM", badgeColor: "#111d2b", beds: 3, baths: 3 },
    { id:"lx4", title: "Inya Lake Estate", titleMy: "အင်းယားကန် အိမ်ရာ", sub: "Kamayut, Yangon", subMy: "ကမာရွတ်၊ ရန်ကုန်", price: isBuy ? "25,000 Lakh" : "110 Lakh/mo", priceLabel: isBuy ? "Estate · Lake View" : "Estate · Rent", gradient: ["#0c4a6e","#075985"], badge: "ESTATE", badgeColor: "#111d2b", beds: 6, baths: 5 },
  ];

  const resort = [
    { id:"rv1", title: "Ngwe Saung Beach Villa", titleMy: "ငွေဆောင် ကမ်းခြေ ဗီလာ", sub: "Ngwe Saung Beach", subMy: "ငွေဆောင် ကမ်းခြေ", price: isBuy ? "5,000 Lakh" : "22 Lakh/mo", priceLabel: isBuy ? "Beachfront Villa" : "Beachfront · Rent", gradient: ["#065f46","#047857"], badge: "BEACHFRONT", badgeColor: "#0369a1" },
    { id:"rv2", title: "Chaungtha Resort Villa", titleMy: "ချောင်းသာ ရီဆော့တ် ဗီလာ", sub: "Chaungtha Beach", subMy: "ချောင်းသာ ကမ်းခြေ", price: isBuy ? "3,500 Lakh" : "16 Lakh/mo", priceLabel: isBuy ? "Ocean View Villa" : "Ocean View · Rent", gradient: ["#0c4a6e","#075985"], badge: "SEA VIEW", badgeColor: "#0369a1" },
    { id:"rv3", title: "Inle Lake Villa", titleMy: "အင်းလေး ကန် ဗီလာ", sub: "Inle Lake, Shan State", subMy: "အင်းလေးကန်၊ ရှမ်းပြည်နယ်", price: isBuy ? "2,800 Lakh" : "12 Lakh/mo", priceLabel: isBuy ? "Lake Villa" : "Lake Villa · Rent", gradient: ["#166534","#15803d"], badge: "LAKE VIEW", badgeColor: "#15803d" },
    { id:"rv4", title: "Bagan Heritage Villa", titleMy: "ပုဂံ မွေးမြူရာ ဗီလာ", sub: "Bagan, Mandalay Region", subMy: "ပုဂံ၊ မန္တလေးတိုင်း", price: isBuy ? "4,200 Lakh" : "18 Lakh/mo", priceLabel: isBuy ? "Heritage Villa" : "Heritage · Rent", gradient: ["#78350f","#92400e"], badge: "HERITAGE", badgeColor: "#92400e" },
  ];

  const sustainable = [
    { id:"su1", title: "Hlaing Eco Garden Condo", titleMy: "လှိုင်း Eco ဥယျာဉ် ကွန်ဒို", sub: "Hlaing · Solar + Garden", subMy: "လှိုင်း · နေရောင်ခြည် + ဥယျာဉ်", price: isBuy ? "580 Lakh" : "3.5 Lakh/mo", priceLabel: isBuy ? "Eco · Condo" : "Eco · Rent", gradient: ["#166534","#15803d"], badge: "ECO", badgeColor: "#16a34a" },
    { id:"su2", title: "Riverside Nature Home", titleMy: "မြစ်ဘေး သဘာဝ အိမ်", sub: "Hlaingthaya · Riverside", subMy: "လှိုင်သာယာ · မြစ်ဘေး", price: isBuy ? "420 Lakh" : "2.8 Lakh/mo", priceLabel: isBuy ? "House · Riverside" : "House · Rent", gradient: ["#0c4a6e","#075985"], badge: "RIVERSIDE", badgeColor: "#0369a1" },
    { id:"su3", title: "Mayangone Green Villa", titleMy: "မရမ်းကုန်း အစိမ်းရောင် ဗီလာ", sub: "Mayangone · Garden Views", subMy: "မရမ်းကုန်း · ဥယျာဉ်မြင်ကွင်း", price: isBuy ? "5,500 Lakh" : "24 Lakh/mo", priceLabel: isBuy ? "Villa · Garden" : "Villa · Rent", gradient: ["#1c4532","#166534"], badge: "GARDEN", badgeColor: "#15803d" },
    { id:"su4", title: "Insein Solar Home", titleMy: "အင်းစိန် နေရောင်ခြည် အိမ်", sub: "Insein · Solar Powered", subMy: "အင်းစိန် · နေရောင်ခြည်", price: isBuy ? "380 Lakh" : "2.2 Lakh/mo", priceLabel: isBuy ? "House · Solar" : "House · Rent", gradient: ["#78350f","#b45309"], badge: "SOLAR", badgeColor: "#d97706" },
  ];

  const handpicked = [
    { id:"hp1", title: isBuy ? "Best Value in Yankin" : "Best Rental in Yankin", titleMy: isBuy ? "ရန်ကင်းတွင် အကောင်းဆုံးတန်ဖိုး" : "ရန်ကင်းတွင် အကောင်းဆုံးငှားရမ်းမှု", sub: "Yankin · 128 listings", subMy: "ရန်ကင်း · ၁၂၈ ခု", price: isBuy ? "From 800 Lakh" : "From 4 Lakh/mo", gradient: ["#1e3a5f","#2d5a8e"], badge: "TRENDING", badgeColor: "#dc2626" },
    { id:"hp2", title: isBuy ? "Family Homes Near Schools" : "Family Rentals Near Schools", titleMy: isBuy ? "ကျောင်းနီး မိသားစုအိမ်" : "ကျောင်းနီး မိသားစုငှားရမ်းမှု", sub: "Bahan & Kamayut · 89 listings", subMy: "ဗဟန်း နှင့် ကမာရွတ် · ၈၉ ခု", price: isBuy ? "From 1,200 Lakh" : "From 5 Lakh/mo", gradient: ["#166534","#15803d"], badge: "FAMILY", badgeColor: "#16a34a" },
    { id:"hp3", title: isBuy ? "CBD Investment Units" : "CBD Short-Term Rentals", titleMy: isBuy ? "CBD ရင်းနှီးမြှုပ်နှံမှု" : "CBD ငှားရမ်းမှု", sub: "Pabedan & Latha · 234 listings", subMy: "ပဗေဒါ နှင့် လသာ · ၂၃၄ ခု", price: isBuy ? "From 500 Lakh" : "From 6 Lakh/mo", gradient: ["#111d2b","#1e3a5f"], badge: "WORK ZONE", badgeColor: "#111d2b" },
    { id:"hp4", title: isBuy ? "Affordable First Homes" : "Budget-Friendly Rentals", titleMy: isBuy ? "စတင်ဝယ်ယူနိုင်သော အိမ်" : "ဈေးသင့်တင့်သော ငှားရမ်းမှု", sub: "Tamwe & Thaketa · 312 listings", subMy: "တာမွေ နှင့် သာကေတ · ၃၁၂ ခု", price: isBuy ? "From 200 Lakh" : "From 1.5 Lakh/mo", gradient: ["#065f46","#047857"], badge: "AFFORDABLE", badgeColor: "#16a34a" },
  ];

  return (
    <div style={{ background: white }}>

      {/* ══ 1. LATEST PROJECTS ══ */}
      <Section>
        <SectionHead
          en={isBuy ? "Latest Projects for Sale" : "Latest Projects for Rent"}
          my={isBuy ? "ရောင်းရန် စီမံကိန်းသစ်များ" : "ငှားရမ်းရန် စီမံကိန်းများ"}
          suben={isBuy ? "Brand new developments across Myanmar" : "New rental developments across Myanmar"}
          submy={isBuy ? "မြန်မာနိုင်ငံတစ်ဝှမ်း ရောင်းချနေသော စီမံကိန်းများ" : "မြန်မာနိုင်ငံတစ်ဝှမ်း ငှားရမ်းနေသော စီမံကိန်းများ"}
          lang={lang}
          onViewMore={() => onViewMore?.("latestProjects")}
        />
        <CardGrid items={projects} lang={lang} listingType={listingType} onPropertyClick={onPropertyClick} />
      </Section>

      {/* ══ 2. BUY/RENT NEAR ══ */}
      <Section>
        <SectionHead
          en={isBuy ? "Buy Near Top Locations" : "Rent Near Top Locations"}
          my={isBuy ? "အဓိက နေရာများနီး ဝယ်ရန်" : "အဓိက နေရာများနီး ငှားရမ်းရန်"}
          suben="Find your perfect neighborhood in Yangon"
          submy="ရန်ကုန်တွင် သင်၏ အကောင်းဆုံး ရပ်ကွက် ရှာပါ"
          lang={lang}
        />
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "12px",
          width: "100%",
          overflowX: "hidden",
        }}
        className="yume-loc-grid">
          {[
            { en: "Universities", my: "တက္ကသိုလ်", count: 284, top: "#111d2b" },
            { en: "Int'l Schools", my: "နိုင်ငံတကာ ကျောင်း", count: 156, top: "#166534" },
            { en: "Hospitals", my: "ဆေးရုံ", count: 198, top: "#991b1b" },
            { en: "Malls", my: "ဈေးဆိုင်ကြီး", count: 312, top: "#581c87" },
            { en: "Airport", my: "လေဆိပ်", count: 87, top: "#1e3a5f" },
            { en: "Inya Lake", my: "အင်းယားကန်", count: 64, top: "#0f766e" },
          ].map((loc, i) => {
            // Custom SVG icons per category — no emoji
            const icons = [
              // University — graduation hat
              <svg key={0} width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 4L2 9l9 5 9-5-9-5z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/><path d="M6 11.5v4c0 1.5 2 3 5 3s5-1.5 5-3v-4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><line x1="20" y1="9" x2="20" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>,
              // School — building
              <svg key={1} width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="9" width="16" height="11" rx="1" stroke="white" strokeWidth="1.5"/><path d="M1 9l10-7 10 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="8" y="14" width="6" height="6" rx="0.5" stroke="white" strokeWidth="1.5"/></svg>,
              // Hospital — cross
              <svg key={2} width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="3" width="16" height="16" rx="2" stroke="white" strokeWidth="1.5"/><line x1="11" y1="7" x2="11" y2="15" stroke="white" strokeWidth="2" strokeLinecap="round"/><line x1="7" y1="11" x2="15" y2="11" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>,
              // Mall — shopping bag
              <svg key={3} width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M5 7h12l-1.5 11H6.5L5 7z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 7V6a3 3 0 016 0v1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>,
              // Airport — plane
              <svg key={4} width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M19 9l-7 4-1-7-2 1 1 7-5 3 1 2 6-2 1 5 2-1-1-5 5-3V9z" stroke="white" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
              // Lake — waves
              <svg key={5} width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M2 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><path d="M2 13c2-2 4-2 6 0s4 2 6 0 4-2 6 0" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><path d="M2 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>,
            ];
            return (
              <button key={i}
                style={{ background: "#ffffff", border: "1px solid #111d2b", borderTop: `3px solid ${loc.top}`, borderRadius: "12px", padding: "20px 10px", cursor: "pointer", textAlign: "center", transition: "all 0.2s", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "none"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: loc.top, margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {icons[i]}
                </div>
                <p style={{ color: "#111111", fontSize: "13px", fontWeight: 700, margin: "0 0 4px", fontFamily: ff }}>{lang === "my" ? loc.my : loc.en}</p>
                <p style={{ color: loc.top, fontSize: "12px", fontWeight: 600, margin: 0, fontFamily: ff }}>{loc.count} {lang === "my" ? "ခု" : "listings"}</p>
              </button>
            );
          })}
        </div>
      </Section>

      {/* ══ 3. FIND BY LIFESTYLE ══ */}
      <Section>
        <SectionHead
          en="Find by Lifestyle"
          my="နေထိုင်မှုပုံစံဖြင့် ရှာပါ"
          suben="Filter by what matters most to you"
          submy="သင်အတွက် အရေးကြီးဆုံးကို ရွေးပါ"
          lang={lang}
        />
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {[
            { en: "Pet-Friendly", my: "တိရစ္ဆာန်ချစ်သူ", count: "2.4K", bg: "#166534",
              icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="4" cy="4" r="1.5" stroke="white" strokeWidth="1.2"/><circle cx="10" cy="4" r="1.5" stroke="white" strokeWidth="1.2"/><circle cx="2" cy="8" r="1.5" stroke="white" strokeWidth="1.2"/><circle cx="12" cy="8" r="1.5" stroke="white" strokeWidth="1.2"/><path d="M7 6c-2 0-4 1.5-4 4 0 1 1 2 4 2s4-1 4-2c0-2.5-2-4-4-4z" stroke="white" strokeWidth="1.2" strokeLinejoin="round"/></svg> },
            { en: "Luxury", my: "ဇိမ်ခံ", count: "892", bg: "#92400e",
              icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><polygon points="7,2 8.5,5.5 12,6 9.5,8.5 10,12 7,10.5 4,12 4.5,8.5 2,6 5.5,5.5" stroke="white" strokeWidth="1.2" strokeLinejoin="round"/></svg> },
            { en: "Near Schools", my: "ကျောင်းနီး", count: "1.8K", bg: "#111d2b",
              icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2L1 5.5l6 3.5 6-3.5L7 2z" stroke="white" strokeWidth="1.2" strokeLinejoin="round"/><path d="M4 7.5v3c0 1 1.5 2 3 2s3-1 3-2v-3" stroke="white" strokeWidth="1.2" strokeLinecap="round"/></svg> },
            { en: "Eco-Friendly", my: "သဘာဝပတ်ဝန်းကျင်", count: "345", bg: "#14532d",
              icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 12V7" stroke="white" strokeWidth="1.2" strokeLinecap="round"/><path d="M7 7c0-3 3-5 5-5-1 3-3 5-5 5z" stroke="white" strokeWidth="1.2" strokeLinejoin="round"/><path d="M7 7c0-2-2-4-5-4 1 2 3 4 5 4z" stroke="white" strokeWidth="1.2" strokeLinejoin="round"/></svg> },
            { en: "Resort Villas", my: "ရီဆော့တ် ဗီလာ", count: "128", bg: "#0f766e",
              icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 8c1.5-2 2.5-2 4 0s2.5 2 4 0" stroke="white" strokeWidth="1.2" strokeLinecap="round"/><path d="M2 11c1.5-2 2.5-2 4 0s2.5 2 4 0" stroke="white" strokeWidth="1.2" strokeLinecap="round"/><path d="M4 5L7 2l3 3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
            { en: "Branded", my: "အမှတ်တံဆိပ်", count: "67", bg: "#581c87",
              icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="2" width="10" height="10" rx="2" stroke="white" strokeWidth="1.2"/><path d="M2 7h4l1.5-3 1.5 6L11 7h1" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
            { en: "Near CBD", my: "စီးပွားဗဟိုနီး", count: "2.1K", bg: "#1e3a5f",
              icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="5" width="5" height="8" stroke="white" strokeWidth="1.2"/><rect x="7" y="2" width="5" height="11" stroke="white" strokeWidth="1.2"/><line x1="4" y1="7" x2="4" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><line x1="9" y1="5" x2="9" y2="5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg> },
          ].map((l, i) => (
            <button key={i}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", borderRadius: "999px", border: "none", background: l.bg, cursor: "pointer", transition: "all 0.2s", fontFamily: ff, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 16px rgba(0,0,0,0.25)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "none"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)"; }}>
              <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {l.icon}
              </div>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff" }}>{lang === "my" ? l.my : l.en}</span>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>({l.count})</span>
            </button>
          ))}
        </div>
      </Section>

      {/* ══ 4. NEAR UNIVERSITIES ══ */}
      <Section>
        <SectionHead
          en={isBuy ? "Buy Near Universities & Schools" : "Rent Near Universities & Schools"}
          my={isBuy ? "တက္ကသိုလ်နှင့် ကျောင်းနီး — ဝယ်ရန်" : "တက္ကသိုလ်နှင့် ကျောင်းနီး — ငှားရမ်းရန်"}
          suben="Ideal for students and academic families"
          submy="ကျောင်းသားများနှင့် မိသားစုများအတွက် အကောင်းဆုံး"
          lang={lang}
          onViewMore={() => onViewMore?.("nearUniversities")}
        />
        <CardGrid items={nearSchools} lang={lang} listingType={listingType} onPropertyClick={onPropertyClick} />
      </Section>

      {/* ══ 5. PET FRIENDLY ══ */}
      <Section>
        <SectionHead
          en={isBuy ? "Buy Pet-Friendly Properties" : "Rent Pet-Friendly Properties"}
          my={isBuy ? "တိရစ္ဆာန်ချစ်သူ — ဝယ်ရန်" : "တိရစ္ဆာန်ချစ်သူ — ငှားရမ်းရန်"}
          suben="Homes that welcome your furry family members"
          submy="သင်၏ တိရစ္ဆာန်မိသားစုကို ကြိုဆိုသော နေအိမ်များ"
          lang={lang}
          onViewMore={() => onViewMore?.("petFriendly")}
        />
        <CardGrid items={petFriendly} lang={lang} listingType={listingType} onPropertyClick={onPropertyClick} />
      </Section>

      {/* ══ 6. LUXURY ══ */}
      <Section>
        <SectionHead
          en={isBuy ? "Luxury Estates & Branded Residences" : "Luxury Rental Properties"}
          my={isBuy ? "ဇိမ်ခံ အိမ်ရာများနှင့် Branded နေထိုင်မှု" : "ဇိမ်ခံ ငှားရမ်းမှုများ"}
          suben="Myanmar's most exclusive addresses"
          submy="မြန်မာ၏ အထူးသီးသန့် ဇိမ်ခံ နေရပ်များ"
          lang={lang}
          onViewMore={() => onViewMore?.("luxury")}
        />
        <CardGrid items={luxury} lang={lang} listingType={listingType} onPropertyClick={onPropertyClick} />
      </Section>

      {/* ══ 7. RESORT VILLAS ══ */}
      <Section>
        <SectionHead
          en={isBuy ? "Resort Villas for Sale" : "Resort Villas for Rent"}
          my={isBuy ? "ရီဆော့တ် ဗီလာ — ဝယ်ရန်" : "ရီဆော့တ် ဗီလာ — ငှားရမ်းရန်"}
          suben="Vacation-style living in Myanmar's finest destinations"
          submy="မြန်မာ၏ အကောင်းဆုံး ကျန်းမာနားနေမှု"
          lang={lang}
          onViewMore={() => onViewMore?.("resortVillas")}
        />
        <CardGrid items={resort} lang={lang} listingType={listingType} onPropertyClick={onPropertyClick} />
      </Section>

      {/* ══ 8. SUSTAINABLE ══ */}
      <Section>
        <SectionHead
          en={isBuy ? "Sustainable & Eco Living" : "Eco-Friendly Rentals"}
          my={isBuy ? "သဘာဝပတ်ဝန်းကျင်နှင့် ညီညွတ်သော — ဝယ်ရန်" : "သဘာဝပတ်ဝန်းကျင်နှင့် ညီညွတ်သော — ငှားရမ်းရန်"}
          suben="Eco-friendly homes with gardens and green spaces"
          submy="သဘာဝပတ်ဝန်းကျင်ကို ချစ်မြတ်နိုးသူများအတွက်"
          lang={lang}
          onViewMore={() => onViewMore?.("sustainable")}
        />
        <CardGrid items={sustainable} lang={lang} listingType={listingType} onPropertyClick={onPropertyClick} />
      </Section>

      {/* ══ 9. HANDPICKED ══ */}
      <Section>
        <SectionHead
          en="Handpicked For You"
          my="သင့်အတွက် ကျွမ်းကျင်စွာ ရွေးချယ်ထားသည်"
          suben="Curated based on what Myanmar buyers love right now"
          submy="မြန်မာ ဝယ်သူများ ယခု အကြိုက်ဆုံးကို အခြေခံ၍"
          lang={lang}
          onViewMore={() => onViewMore?.("handpicked")}
        />
        <CardGrid items={handpicked} lang={lang} listingType={listingType} onPropertyClick={onPropertyClick} />
      </Section>

      {/* ══ 10. ASK YUME ══ */}
      <section style={{ background: "#111d2b", padding: "72px 0" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 32px", textAlign: "center" }}>
          <p style={{ color: gold, fontSize: "11px", letterSpacing: "3px", margin: "0 0 10px", fontFamily: ff }}>AI PROPERTY ASSISTANT</p>
          <h2 style={{ color: "#ffffff", fontSize: "32px", fontWeight: 700, margin: "0 0 8px", fontFamily: ff, letterSpacing: "-0.5px" }}>
            {lang === "my" ? "Yume ကို မေးပါ" : "Ask Yume"}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "15px", margin: "0 0 28px", fontFamily: ff }}>
            {lang === "my" ? "ဈေးနှုန်း၊ ရင်းနှီးမြှုပ်နှံမှု — မည်သည့် မေးခွန်းမဆို ကူညီပေးမည်" : "Ask about prices, areas, investment — get expert answers instantly"}
          </p>

          {/* Search bar */}
          <div style={{ display: "flex", background: white, borderRadius: "12px", overflow: "hidden", marginBottom: "14px", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
            <input value={askQ} onChange={e => setAskQ(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAsk()}
              placeholder={lang === "my" ? "ဥပမာ: ရန်ကင်း ကွန်ဒို ဈေးနှုန်း ဘယ်လောက်?" : "e.g. What is the average condo price in Yankin?"}
              style={{ flex: 1, padding: "16px 20px", border: "none", outline: "none", fontSize: "14px", fontFamily: ff, color: textPrimary }} />
            <button onClick={handleAsk} disabled={askLoading}
              style={{ background: gold, border: "none", padding: "16px 28px", cursor: "pointer", color: white, fontSize: "14px", fontWeight: 700, fontFamily: ff, transition: "opacity 0.2s" }}>
              {askLoading ? "..." : (lang === "my" ? "မေးရန်" : "Ask")}
            </button>
          </div>

          {/* Quick chips */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginBottom: "20px" }}>
            {[{en:"Best area to invest?",my:"ရင်းနှီးမြှုပ်နှံရန် အကောင်းဆုံး?"},{en:"Price near schools?",my:"ကျောင်းနီး ဈေးနှုန်း?"},{en:"Rental yields?",my:"ငှားရမ်းနှုန်း?"},{en:"Best for families?",my:"မိသားစုအတွက် အကောင်းဆုံး?"}].map((q, i) => (
              <button key={i} onClick={() => setAskQ(lang === "my" ? q.my : q.en)}
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)", padding: "7px 16px", borderRadius: "999px", cursor: "pointer", fontSize: "12px", fontFamily: ff }}>
                {lang === "my" ? q.my : q.en}
              </button>
            ))}
          </div>

          {/* Answer */}
          {askA && (
            <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", padding: "20px 24px", textAlign: "left" }}>
              <p style={{ color: gold, fontSize: "10px", letterSpacing: "2px", margin: "0 0 8px", fontFamily: ff }}>YUME ANSWER</p>
              <p style={{ color: white, fontSize: "14px", margin: 0, lineHeight: 1.8, fontFamily: ff }}>{askA}</p>
            </div>
          )}
        </div>
      </section>

      {/* ══ 11. NEWS ══ */}
      <Section last>
        <SectionHead
          en="Property News & Market Insights"
          my="အိမ်ခြံမြေ သတင်းနှင့် ကဏ္ဍ ထိုးထွင်းသိမြင်မှုများ"
          suben="Stay ahead of Myanmar's real estate market"
          submy="မြန်မာ အိမ်ခြံမြေ ကဏ္ဍကို ဆက်လက် သိရှိပါ"
          lang={lang}
          onViewMore={() => {}}
        />
        <div className="yume-card-grid" style={{ width: "100%", overflowX: "hidden" }}>
          {[
            { title: "Yangon Property Market Report Q1 2026", titleMy: "ရန်ကုန် ကဏ္ဍ Q1 2026", date: "May 15, 2026", cat: "Market Report", catMy: "ကဏ္ဍ အစီရင်ခံ", top: "#111d2b" },
            { title: "Top 5 Townships to Invest 2026", titleMy: "ရင်းနှီးမြှုပ်နှံမှု မြို့နယ် ထိပ်ဆုံး ၅", date: "May 10, 2026", cat: "Investment", catMy: "ရင်းနှီးမြှုပ်နှံမှု", top: "#bd9468" },
            { title: "New Condo Projects in Mandalay", titleMy: "မန္တလေး ကွန်ဒို စီမံကိန်းသစ်", date: "May 5, 2026", cat: "New Launch", catMy: "စီမံကိန်းသစ်", top: "#166534" },
            { title: "Rental Yield Guide: Yangon 2026", titleMy: "ငှားရမ်းနှုန်း လမ်းညွှန် ၂၀၂၆", date: "May 1, 2026", cat: "Rental Guide", catMy: "ငှားရမ်းမှု လမ်းညွှန်", top: "#581c87" },
          ].map((n, i) => (
            <div key={i} style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #111d2b", borderTop: `3px solid ${n.top}`, cursor: "pointer", background: "#ffffff", transition: "all 0.18s", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; (e.currentTarget as HTMLDivElement).style.transform = "none"; }}>
              {/* Colored header banner */}
              <div style={{ height: "110px", background: n.top, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ opacity: 0.6 }}>
                  <rect x="4" y="6" width="28" height="24" rx="2" stroke="white" strokeWidth="2"/>
                  <line x1="9" y1="13" x2="27" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="9" y1="18" x2="27" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="9" y1="23" x2="20" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div style={{ padding: "14px 16px" }}>
                <span style={{ background: n.top, color: "#ffffff", fontSize: "10px", padding: "3px 10px", borderRadius: "4px", fontWeight: 700, fontFamily: ff }}>
                  {lang === "my" ? n.catMy : n.cat}
                </span>
                <p style={{ color: "#111111", fontSize: "13px", fontWeight: 600, margin: "10px 0 6px", lineHeight: 1.4, fontFamily: ff }}>
                  {lang === "my" ? n.titleMy : n.title}
                </p>
                <p style={{ color: "#aaaaaa", fontSize: "11px", margin: 0, fontFamily: ff }}>{n.date}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

    </div>
  );
}
