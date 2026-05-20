"use client";

/**
 * YUME ESTATE — Available Toggle Component
 *
 * Shows a clear Available / Not Available toggle on each property card.
 * When Available → property shows on public yumeestate.com
 * When Not Available → property hidden from public (still in agent inventory)
 */

interface AvailableToggleProps {
  propertyId: string;
  propertyTitle: string;
  currentStatus: string;
  liveSlots: number; // how many slots used
  maxSlots: number; // plan limit (20 basic, 50 pro, unlimited agency)
  language: "en" | "my";
  onToggle: (id: string, newStatus: string) => void;
}

export default function AvailableToggle({
  propertyId,
  propertyTitle,
  currentStatus,
  liveSlots,
  maxSlots,
  language,
  onToggle,
}: AvailableToggleProps) {
  const lang = language;
  const ff = lang === "my" ? "'Padauk','Myanmar Text',sans-serif" : "Georgia,serif";
  const isAvailable = currentStatus === "available";
  const slotsLeft = maxSlots - liveSlots;
  const atLimit = !isAvailable && slotsLeft <= 0;

  function handleToggle() {
    if (atLimit) return; // can't make available if at limit
    const newStatus = isAvailable ? "not_available" : "available";
    onToggle(propertyId, newStatus);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>

      {/* Main toggle button */}
      <button
        onClick={handleToggle}
        disabled={atLimit}
        title={atLimit
          ? (lang === "my" ? `အများဆုံး ${maxSlots} ခု ပြည့်နေပြီ — အဆင့်မြှင့်ပါ` : `Limit reached (${maxSlots} live) — upgrade plan`)
          : undefined}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
          padding: "8px 12px",
          borderRadius: "6px",
          border: isAvailable ? "2px solid #2d7a3a" : "2px solid #ddd5c0",
          background: isAvailable ? "#f0faf2" : "#faf7f2",
          cursor: atLimit ? "not-allowed" : "pointer",
          opacity: atLimit ? 0.6 : 1,
          transition: "all 0.2s",
          width: "100%",
        }}
      >
        {/* Status label */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "10px", height: "10px", borderRadius: "50%",
            background: isAvailable ? "#2d7a3a" : "#ccc",
            boxShadow: isAvailable ? "0 0 6px rgba(45,122,58,0.6)" : "none",
            transition: "all 0.2s",
          }} />
          <span style={{
            fontSize: "12px",
            fontWeight: 700,
            fontFamily: ff,
            color: isAvailable ? "#2d7a3a" : "#7a6a5a",
          }}>
            {isAvailable
              ? (lang === "my" ? "ရရှိနိုင်သည်" : "AVAILABLE")
              : (lang === "my" ? "မရရှိနိုင်ပါ" : "NOT AVAILABLE")}
          </span>
        </div>

        {/* Toggle switch */}
        <div style={{
          width: "40px", height: "22px", borderRadius: "11px",
          background: isAvailable ? "#2d7a3a" : "#ddd5c0",
          position: "relative",
          transition: "background 0.2s",
          flexShrink: 0,
        }}>
          <div style={{
            position: "absolute",
            top: "3px",
            left: isAvailable ? "20px" : "3px",
            width: "16px", height: "16px",
            borderRadius: "50%",
            background: "#fff",
            transition: "left 0.2s",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }} />
        </div>
      </button>

      {/* Public visibility indicator */}
      {isAvailable && (
        <div style={{ display: "flex", alignItems: "center", gap: "5px", padding: "4px 8px", background: "#e8f5e9", borderRadius: "4px" }}>
          <span style={{ fontSize: "10px" }}>🌐</span>
          <span style={{ color: "#2d7a3a", fontSize: "10px", fontFamily: ff }}>
            {lang === "my" ? "yumeestate.com တွင် ဖော်ပြနေသည်" : "Live on yumeestate.com"}
          </span>
        </div>
      )}

      {/* At limit warning */}
      {atLimit && (
        <div style={{ display: "flex", alignItems: "center", gap: "5px", padding: "4px 8px", background: "#fff8e0", borderRadius: "4px", border: "1px solid #f0c060" }}>
          <span style={{ fontSize: "10px" }}>⚠️</span>
          <span style={{ color: "#7a5a00", fontSize: "10px", fontFamily: ff }}>
            {lang === "my" ? `${maxSlots} ခု ပြည့်နေပြီ — အဆင့်မြှင့်ပါ` : `${maxSlots} slot limit reached — upgrade`}
          </span>
        </div>
      )}
    </div>
  );
}


/**
 * Live Slots Banner — shows at top of inventory
 * Warns agent how many slots are used and when they're near the limit
 */
interface LiveSlotsBannerProps {
  liveSlots: number;
  maxSlots: number;
  planName: string;
  language: "en" | "my";
  onUpgrade?: () => void;
}

export function LiveSlotsBanner({
  liveSlots,
  maxSlots,
  planName,
  language,
  onUpgrade,
}: LiveSlotsBannerProps) {
  const lang = language;
  const ff = lang === "my" ? "'Padauk','Myanmar Text',sans-serif" : "Georgia,serif";
  const pct = maxSlots === Infinity ? 0 : (liveSlots / maxSlots) * 100;
  const isUnlimited = maxSlots === Infinity;
  const nearLimit = pct >= 80;
  const atLimit = pct >= 100;

  const barColor = atLimit ? "#a32d2d" : nearLimit ? "#f0a060" : "#2d7a3a";

  if (isUnlimited) return null; // Agency plan — no need to show

  return (
    <div style={{
      margin: "0 0 16px",
      padding: "12px 16px",
      borderRadius: "8px",
      background: atLimit ? "#fff0f0" : nearLimit ? "#fffbf0" : "#f0faf2",
      border: `1px solid ${atLimit ? "#f09595" : nearLimit ? "#f0c060" : "#2d7a3a"}`,
      fontFamily: ff,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <div>
          <span style={{ color: "#111d2b", fontSize: "13px", fontWeight: 700, fontFamily: ff }}>
            {lang === "my" ? "တိုက်ရိုက် ဖော်ပြမှု" : "Live Listings"}
          </span>
          <span style={{ color: "#7a6a5a", fontSize: "12px", marginLeft: "8px", fontFamily: ff }}>
            {lang === "my" ? `(${planName} အစီအစဉ်)` : `(${planName} Plan)`}
          </span>
        </div>
        <span style={{ color: barColor, fontSize: "13px", fontWeight: 700, fontFamily: ff }}>
          {liveSlots} / {maxSlots}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ background: "#e0d8cc", borderRadius: "999px", height: "8px", overflow: "hidden", marginBottom: "8px" }}>
        <div style={{ background: barColor, width: `${Math.min(pct, 100)}%`, height: "100%", borderRadius: "999px", transition: "width 0.3s" }} />
      </div>

      {/* Message */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ color: "#7a6a5a", fontSize: "11px", margin: 0, fontFamily: ff }}>
          {atLimit
            ? (lang === "my" ? "⚠️ အများဆုံးသို့ ရောက်နေပြီ — ပိုမိုဖော်ပြရန် အဆင့်မြှင့်ပါ" : "⚠️ Limit reached — upgrade to show more listings")
            : nearLimit
              ? (lang === "my" ? `⚡ ${maxSlots - liveSlots} ခန်းသာ ကျန်တော့သည်` : `⚡ Only ${maxSlots - liveSlots} slots remaining`)
              : (lang === "my" ? `✅ ${maxSlots - liveSlots} ခန်း ကျန်သေးသည်` : `✅ ${maxSlots - liveSlots} slots available`)}
        </p>
        {(atLimit || nearLimit) && onUpgrade && (
          <button onClick={onUpgrade}
            style={{ background: "#111d2b", color: "#bd9468", border: "1px solid #bd9468", padding: "4px 12px", borderRadius: "4px", fontSize: "11px", cursor: "pointer", fontFamily: ff, fontWeight: 600 }}>
            {lang === "my" ? "အဆင့်မြှင့်ရန်" : "Upgrade →"}
          </button>
        )}
      </div>
    </div>
  );
}
