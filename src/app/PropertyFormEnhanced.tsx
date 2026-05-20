"use client";

import { useState } from "react";

/**
 * YUME ESTATE — Enhanced Property Form
 *
 * PRIVATE (never shown publicly):
 *   - Full street address
 *   - Owner name
 *   - Owner phone number
 *
 * PUBLIC (shown on yumeestate.com when Available):
 *   - Description
 *   - Property type, listing type
 *   - Bedrooms, bathrooms, floor area
 *   - Price
 *   - Township/Area only (not full address)
 *   - Agent name + agent phone
 *   - Photos
 */

const gold = "#bd9468";
const navy = "#111d2b";
const cream = "#f5f0e8";

type Language = "en" | "my";

interface PropertyFormProps {
  language: Language;
  initial?: any;
  properties?: any[];
  onCancel: () => void;
  onSave: (draft: any, files: FileList | null) => void;
}

const TOWNSHIPS = [
  "Yankin", "Bahan", "Kamayut", "Sanchaung", "Hlaing", "Tamwe",
  "Mayangone", "Insein", "North Dagon", "South Dagon",
  "North Okkalapa", "South Okkalapa", "Thingangyun", "Thaketa",
  "Dawbon", "Pabedan", "Lanmadaw", "Latha", "Mingaladon", "Hlaingtharya",
  "Aungmyethazan", "Chanayethazan", "Chanmyathazi", "Mahaaungmye",
  "Zabuthiri", "Dekkhinathiri", "Pobbathiri", "Ottarathiri",
  "Bago", "Taungoo", "Pyay", "Monywa", "Sagaing", "Shwebo",
];

const PROPERTY_TYPES = ["Condo", "Apartment", "House", "Land", "Penthouse", "Studio", "Office", "Shop"];

export default function PropertyFormEnhanced({ language, initial, onCancel, onSave }: PropertyFormProps) {
  const lang = language;
  const ff = lang === "my" ? "'Padauk','Myanmar Text',sans-serif" : "Georgia,serif";

  // ── PUBLIC FIELDS ──
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [propertyType, setPropertyType] = useState(initial?.propertyType || "Condo");
  const [listingType, setListingType] = useState<"sale" | "rent">(initial?.listingType || "sale");
  const [township, setTownship] = useState(initial?.location?.township || "");
  const [price, setPrice] = useState(initial?.price?.toString() || "");
  const [bedrooms, setBedrooms] = useState(initial?.bedrooms?.toString() || "");
  const [bathrooms, setBathrooms] = useState(initial?.bathrooms?.toString() || "");
  const [floorArea, setFloorArea] = useState(initial?.floorArea?.toString() || "");
  const [floor, setFloor] = useState(initial?.floor?.toString() || "");
  const [totalFloors, setTotalFloors] = useState(initial?.totalFloors?.toString() || "");
  const [furnished, setFurnished] = useState<"yes" | "no" | "partial">(initial?.furnished || "no");
  const [status, setStatus] = useState<"available" | "not_available">(initial?.status || "not_available");

  // ── PRIVATE FIELDS (never shown publicly) ──
  const [fullAddress, setFullAddress] = useState(initial?.privateData?.fullAddress || "");
  const [ownerName, setOwnerName] = useState(initial?.owner?.name || "");
  const [ownerPhone, setOwnerPhone] = useState(initial?.owner?.phone || "");
  const [ownerNotes, setOwnerNotes] = useState(initial?.privateData?.ownerNotes || "");

  const [files, setFiles] = useState<FileList | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<"public" | "private">("public");

  const inp: React.CSSProperties = {
    width: "100%", padding: "11px 14px", borderRadius: "6px",
    border: "1px solid #ddd5c0", background: "#fff",
    fontSize: "14px", fontFamily: ff, boxSizing: "border-box", color: navy,
  };
  const lbl: React.CSSProperties = {
    display: "block", color: "#5a4a3a", fontSize: "11px",
    letterSpacing: "1px", marginBottom: "6px", fontFamily: ff, fontWeight: 600,
  };
  const privateInp: React.CSSProperties = {
    ...inp, background: "#fff8f0", border: "1px solid #f0c080",
  };

  function validate() {
    const errs: string[] = [];
    if (!title.trim()) errs.push(lang === "my" ? "ခေါင်းစဉ် ထည့်ပါ" : "Title is required");
    if (!township) errs.push(lang === "my" ? "မြို့နယ် ရွေးပါ" : "Township is required");
    if (!price) errs.push(lang === "my" ? "ဈေးနှုန်း ထည့်ပါ" : "Price is required");
    if (!ownerPhone.trim()) errs.push(lang === "my" ? "ပိုင်ရှင် ဖုန်းနံပါတ် ထည့်ပါ" : "Owner phone is required");
    setErrors(errs);
    return errs.length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    const draft = {
      title,
      description,
      propertyType,
      listingType,
      location: { township, city: "Yangon" },
      price: parseFloat(price) || 0,
      bedrooms: parseInt(bedrooms) || 0,
      bathrooms: parseInt(bathrooms) || 0,
      floorArea: parseFloat(floorArea) || 0,
      floor: parseInt(floor) || 0,
      totalFloors: parseInt(totalFloors) || 0,
      furnished,
      status,
      // Private — stored but never sent to public page
      owner: { name: ownerName, phone: ownerPhone },
      privateData: { fullAddress, ownerNotes },
      media: initial?.media || [],
    };
    onSave(draft, files);
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div style={{ background: cream, borderRadius: "8px", width: "100%", maxWidth: "680px", maxHeight: "92vh", overflowY: "auto", border: `2px solid ${gold}`, fontFamily: ff }}>

        {/* Header */}
        <div style={{ background: navy, padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
          <div>
            <p style={{ color: gold, fontSize: "10px", letterSpacing: "2px", margin: "0 0 2px", fontFamily: ff }}>
              {initial ? (lang === "my" ? "ပြင်ဆင်ရန်" : "EDIT PROPERTY") : (lang === "my" ? "အသစ်ထည့်ရန်" : "ADD PROPERTY")}
            </p>
            <h2 style={{ color: cream, fontSize: "18px", fontWeight: 400, margin: 0, fontFamily: ff }}>
              {lang === "my" ? "အိမ်ခြံမြေ မှတ်တမ်း" : "Property Record"}
            </h2>
          </div>
          <button onClick={onCancel} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", fontSize: "18px" }}>✕</button>
        </div>

        {/* Available toggle — prominent at top */}
        <div style={{ padding: "16px 24px", background: status === "available" ? "#f0faf2" : "#fff8f0", borderBottom: `1px solid ${gold}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ color: status === "available" ? "#2d7a3a" : "#7a5a2a", fontSize: "13px", fontWeight: 700, margin: "0 0 2px", fontFamily: ff }}>
              {status === "available"
                ? (lang === "my" ? "✅ ရရှိနိုင်သည် — ဝဘ်ဆိုက်တွင် ဖော်ပြနေသည်" : "✅ AVAILABLE — Visible on yumeestate.com")
                : (lang === "my" ? "⏸ မရရှိနိုင်ပါ — ဖော်ပြမထားပါ" : "⏸ NOT AVAILABLE — Hidden from public")}
            </p>
            <p style={{ color: "#7a6a5a", fontSize: "11px", margin: 0, fontFamily: ff }}>
              {lang === "my" ? "ဖော်ပြသောအခါ လိပ်စာနှင့် ပိုင်ရှင်အချက်အလက်များ ဝှက်ထားမည်" : "When visible: address & owner details are always hidden from public"}
            </p>
          </div>
          <button onClick={() => setStatus(status === "available" ? "not_available" : "available")}
            style={{ background: status === "available" ? "#2d7a3a" : "#ddd5c0", border: "none", borderRadius: "999px", width: "52px", height: "28px", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
            <div style={{ position: "absolute", top: "3px", left: status === "available" ? "26px" : "4px", width: "22px", height: "22px", borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
          </button>
        </div>

        {/* Section tabs */}
        <div style={{ display: "flex", borderBottom: `1px solid #e0d8cc` }}>
          <button onClick={() => setActiveSection("public")}
            style={{ flex: 1, padding: "12px", background: activeSection === "public" ? "#fff" : "#faf7f2", border: "none", borderBottom: activeSection === "public" ? `2px solid ${gold}` : "2px solid transparent", color: activeSection === "public" ? navy : "#7a6a5a", fontSize: "13px", fontWeight: activeSection === "public" ? 700 : 400, cursor: "pointer", fontFamily: ff }}>
            🌐 {lang === "my" ? "အများသိမြင်နိုင်သော အချက်အလက်" : "Public Information"}
          </button>
          <button onClick={() => setActiveSection("private")}
            style={{ flex: 1, padding: "12px", background: activeSection === "private" ? "#fff8f0" : "#faf7f2", border: "none", borderBottom: activeSection === "private" ? `2px solid #f0a060` : "2px solid transparent", color: activeSection === "private" ? "#7a3a0a" : "#7a6a5a", fontSize: "13px", fontWeight: activeSection === "private" ? 700 : 400, cursor: "pointer", fontFamily: ff }}>
            🔒 {lang === "my" ? "လျှို့ဝှက် အချက်အလက်" : "Private — Never Public"}
          </button>
        </div>

        <div style={{ padding: "24px" }}>

          {/* ── PUBLIC SECTION ── */}
          {activeSection === "public" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              <div style={{ background: "#f0faf2", border: "1px solid #2d7a3a", borderRadius: "6px", padding: "10px 14px" }}>
                <p style={{ color: "#2d7a3a", fontSize: "12px", margin: 0, fontFamily: ff }}>
                  🌐 {lang === "my" ? "ဤအချက်အလက်များကို ဖောက်သည်များ မြင်ရမည်" : "This information will be visible to customers when marked Available"}
                </p>
              </div>

              {/* Title */}
              <div>
                <label style={lbl}>{lang === "my" ? "ခေါင်းစဉ်" : "TITLE"} *</label>
                <input value={title} onChange={e => setTitle(e.target.value)}
                  placeholder={lang === "my" ? "ဥပမာ - ရန်ကင်းတွင် ခေတ်မီ ကွန်ဒို" : "e.g. Modern Condo in Yankin"}
                  style={inp} />
              </div>

              {/* Listing type */}
              <div>
                <label style={lbl}>{lang === "my" ? "ရောင်းရန် / ငှားရန်" : "LISTING TYPE"} *</label>
                <div style={{ display: "flex", border: `1px solid #ddd5c0`, borderRadius: "6px", overflow: "hidden" }}>
                  {(["sale", "rent"] as const).map(v => (
                    <button key={v} onClick={() => setListingType(v)}
                      style={{ flex: 1, padding: "11px", background: listingType === v ? navy : "#fff", color: listingType === v ? gold : "#5a4a3a", border: "none", cursor: "pointer", fontSize: "13px", fontFamily: ff, fontWeight: listingType === v ? 700 : 400, borderRight: v === "sale" ? `1px solid #ddd5c0` : "none" }}>
                      {v === "sale" ? (lang === "my" ? "ရောင်းရန်" : "For Sale") : (lang === "my" ? "ငှားရန်" : "For Rent")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property type + Township */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={lbl}>{lang === "my" ? "အမျိုးအစား" : "PROPERTY TYPE"} *</label>
                  <select value={propertyType} onChange={e => setPropertyType(e.target.value)} style={inp}>
                    {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>{lang === "my" ? "မြို့နယ်" : "TOWNSHIP"} *</label>
                  <select value={township} onChange={e => setTownship(e.target.value)} style={inp}>
                    <option value="">{lang === "my" ? "မြို့နယ် ရွေးပါ" : "Select township"}</option>
                    {TOWNSHIPS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Price */}
              <div>
                <label style={lbl}>{lang === "my" ? "ဈေးနှုန်း (ကျပ်)" : "PRICE (KYATS)"} *</label>
                <input value={price} onChange={e => setPrice(e.target.value)} type="number"
                  placeholder={lang === "my" ? "ဥပမာ - 350000000" : "e.g. 350000000"}
                  style={inp} />
                {price && (
                  <p style={{ color: gold, fontSize: "12px", margin: "4px 0 0", fontFamily: ff }}>
                    = {(parseFloat(price) / 100000).toFixed(0)} {lang === "my" ? "သိန်း" : "Lakh Kyats"}
                  </p>
                )}
              </div>

              {/* Floor plan */}
              <div>
                <label style={lbl}>{lang === "my" ? "အိမ်အကြောင်း အသေးစိတ်" : "FLOOR PLAN & DETAILS"}</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                  <div>
                    <p style={{ color: "#7a6a5a", fontSize: "11px", margin: "0 0 4px", fontFamily: ff }}>{lang === "my" ? "🛏 အိပ်ခန်း" : "🛏 Beds"}</p>
                    <input value={bedrooms} onChange={e => setBedrooms(e.target.value)} type="number" min="0" placeholder="0" style={inp} />
                  </div>
                  <div>
                    <p style={{ color: "#7a6a5a", fontSize: "11px", margin: "0 0 4px", fontFamily: ff }}>{lang === "my" ? "🚿 ရေချိုးခန်း" : "🚿 Baths"}</p>
                    <input value={bathrooms} onChange={e => setBathrooms(e.target.value)} type="number" min="0" placeholder="0" style={inp} />
                  </div>
                  <div>
                    <p style={{ color: "#7a6a5a", fontSize: "11px", margin: "0 0 4px", fontFamily: ff }}>{lang === "my" ? "📐 စတုရန်းပေ" : "📐 Sqft"}</p>
                    <input value={floorArea} onChange={e => setFloorArea(e.target.value)} type="number" min="0" placeholder="0" style={inp} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "10px" }}>
                  <div>
                    <p style={{ color: "#7a6a5a", fontSize: "11px", margin: "0 0 4px", fontFamily: ff }}>{lang === "my" ? "🏢 ထပ်" : "🏢 Floor No."}</p>
                    <input value={floor} onChange={e => setFloor(e.target.value)} type="number" min="0" placeholder="e.g. 5" style={inp} />
                  </div>
                  <div>
                    <p style={{ color: "#7a6a5a", fontSize: "11px", margin: "0 0 4px", fontFamily: ff }}>{lang === "my" ? "🏢 စုစုပေါင်း ထပ်" : "🏢 Total Floors"}</p>
                    <input value={totalFloors} onChange={e => setTotalFloors(e.target.value)} type="number" min="0" placeholder="e.g. 20" style={inp} />
                  </div>
                </div>
              </div>

              {/* Furnished */}
              <div>
                <label style={lbl}>{lang === "my" ? "ပရိဘောဂ" : "FURNISHED"}</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {(["yes", "partial", "no"] as const).map(v => (
                    <button key={v} onClick={() => setFurnished(v)}
                      style={{ flex: 1, padding: "10px", borderRadius: "6px", border: `1px solid ${furnished === v ? gold : "#ddd5c0"}`, background: furnished === v ? navy : "#fff", color: furnished === v ? gold : "#5a4a3a", fontSize: "12px", cursor: "pointer", fontFamily: ff }}>
                      {v === "yes" ? (lang === "my" ? "ပါသည်" : "Furnished") : v === "partial" ? (lang === "my" ? "တစ်စိတ်" : "Partial") : (lang === "my" ? "မပါ" : "Unfurnished")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={lbl}>{lang === "my" ? "ဖော်ပြချက်" : "DESCRIPTION"}</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
                  placeholder={lang === "my" ? "အိမ်ခြံမြေအကြောင်း ဖော်ပြပါ (လိပ်စာ မထည့်ပါနှင့်)" : "Describe the property (do NOT include address here)"}
                  style={{ ...inp, resize: "vertical" }} />
                <p style={{ color: "#a32d2d", fontSize: "11px", margin: "4px 0 0", fontFamily: ff }}>
                  ⚠️ {lang === "my" ? "လိပ်စာ မထည့်ပါနှင့် — ဖောက်သည်များ မြင်ရမည်" : "Do NOT include address — customers will see this"}
                </p>
              </div>

              {/* Photos */}
              <div>
                <label style={lbl}>{lang === "my" ? "ဓာတ်ပုံများ" : "PHOTOS"}</label>
                <input type="file" multiple accept="image/*" onChange={e => setFiles(e.target.files)}
                  style={{ ...inp, padding: "8px" }} />
              </div>

            </div>
          )}

          {/* ── PRIVATE SECTION ── */}
          {activeSection === "private" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              <div style={{ background: "#fff8f0", border: "1px solid #f0a060", borderRadius: "6px", padding: "12px 14px" }}>
                <p style={{ color: "#7a3a0a", fontSize: "13px", fontWeight: 700, margin: "0 0 4px", fontFamily: ff }}>
                  🔒 {lang === "my" ? "လျှို့ဝှက် အချက်အလက်" : "Private Data — Never Shown Publicly"}
                </p>
                <p style={{ color: "#7a5a3a", fontSize: "12px", margin: 0, fontFamily: ff }}>
                  {lang === "my"
                    ? "ဤနေရာမှ အချက်အလက်များကို ဖောက်သည်များ လုံးဝ မမြင်ရပါ။ အေးဂျင့်များသာ ကြည့်နိုင်သည်။"
                    : "This information is NEVER visible to customers. Only you and your team can see it."}
                </p>
              </div>

              {/* Full address */}
              <div>
                <label style={{ ...lbl, color: "#7a3a0a" }}>
                  📍 {lang === "my" ? "အပြည့်အစုံ လိပ်စာ" : "FULL ADDRESS"} 🔒
                </label>
                <textarea value={fullAddress} onChange={e => setFullAddress(e.target.value)} rows={3}
                  placeholder={lang === "my" ? "ဥပမာ - အမှတ် ၁၂၃၊ ဗိုလ်ချုပ်လမ်း၊ ရပ်ကွက် ၅၊ ရန်ကင်းမြို့နယ်" : "e.g. No. 123, Bogyoke Road, Quarter 5, Yankin Township"}
                  style={{ ...privateInp, resize: "vertical" }} />
                <p style={{ color: "#f0a060", fontSize: "11px", margin: "4px 0 0", fontFamily: ff }}>
                  🔒 {lang === "my" ? "ဖောက်သည်များထံ ဘယ်တော့မှ မပေးပို့ပါ" : "Never shared with customers"}
                </p>
              </div>

              {/* Owner name */}
              <div>
                <label style={{ ...lbl, color: "#7a3a0a" }}>
                  👤 {lang === "my" ? "ပိုင်ရှင် အမည်" : "OWNER NAME"} 🔒
                </label>
                <input value={ownerName} onChange={e => setOwnerName(e.target.value)}
                  placeholder={lang === "my" ? "ဥပမာ - ဦးအောင်" : "e.g. U Aung"}
                  style={privateInp} />
              </div>

              {/* Owner phone */}
              <div>
                <label style={{ ...lbl, color: "#7a3a0a" }}>
                  📞 {lang === "my" ? "ပိုင်ရှင် ဖုန်းနံပါတ်" : "OWNER PHONE NUMBER"} 🔒 *
                </label>
                <input value={ownerPhone} onChange={e => setOwnerPhone(e.target.value)}
                  placeholder="09-xxxxxxxxx" type="tel"
                  style={privateInp} />
                <p style={{ color: "#f0a060", fontSize: "11px", margin: "4px 0 0", fontFamily: ff }}>
                  🔒 {lang === "my" ? "ဖောက်သည်များထံ လုံးဝ မပြပါ — အေးဂျင့်ဖုန်းသာ ပြမည်" : "NEVER shown to customers — only agent phone is shown publicly"}
                </p>
              </div>

              {/* Owner notes */}
              <div>
                <label style={{ ...lbl, color: "#7a3a0a" }}>
                  📝 {lang === "my" ? "ပိုင်ရှင် မှတ်ချက်" : "PRIVATE NOTES"} 🔒
                </label>
                <textarea value={ownerNotes} onChange={e => setOwnerNotes(e.target.value)} rows={3}
                  placeholder={lang === "my" ? "ပိုင်ရှင်နှင့် ပတ်သက်သော မှတ်ချက်များ..." : "Notes about owner, negotiation, key details..."}
                  style={{ ...privateInp, resize: "vertical" }} />
              </div>

            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <div style={{ background: "#fff0f0", border: "1px solid #f09595", borderRadius: "6px", padding: "12px 16px", marginTop: "16px" }}>
              {errors.map((e, i) => <p key={i} style={{ color: "#a32d2d", fontSize: "13px", margin: i === 0 ? 0 : "4px 0 0", fontFamily: ff }}>• {e}</p>)}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
            <button onClick={onCancel}
              style={{ flex: 1, padding: "13px", borderRadius: "6px", border: "1px solid #ddd5c0", background: "#fff", color: "#5a4a3a", fontSize: "14px", cursor: "pointer", fontFamily: ff }}>
              {lang === "my" ? "ပယ်ဖျက်ရန်" : "Cancel"}
            </button>
            <button onClick={handleSave}
              style={{ flex: 2, padding: "13px", borderRadius: "6px", border: `2px solid ${gold}`, background: navy, color: gold, fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: ff }}>
              {lang === "my" ? "သိမ်းဆည်းရန်" : "Save Property"} ✓
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
