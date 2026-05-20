"use client";

import { useState } from "react";

interface ReferralTrackerProps {
  agentPhone: string;
  language: "en" | "my";
}

// Simulated data — in real app this comes from your database
const MOCK_REFERRALS = [
  { name: "Ko Zaw", phone: "09-111111111", joinedDate: "2026-04-01", active: true },
  { name: "Ma Aye", phone: "09-222222222", joinedDate: "2026-04-15", active: true },
  { name: "Ko Htun", phone: "09-333333333", joinedDate: "2026-05-01", active: true },
];

const REQUIRED = 5; // referrals needed for boost
const BOOST_POSTS = 2; // number of listings boosted
const BOOST_DAYS = 30; // days of boost

export default function ReferralTracker({ agentPhone, language }: ReferralTrackerProps) {
  const [copied, setCopied] = useState(false);
  const lang = language;
  const myCode = `YUME-${agentPhone.replace(/\D/g, "").slice(-4)}`;
  const referred = MOCK_REFERRALS.length;
  const progress = Math.min(referred, REQUIRED);
  const remaining = REQUIRED - progress;
  const earned = Math.floor(referred / REQUIRED); // how many boosts earned total
  const progressPct = (progress / REQUIRED) * 100;

  function handleCopy() {
    navigator.clipboard.writeText(myCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const gold = "#bd9468";
  const navy = "#111d2b";
  const ff = lang === "my" ? "'Padauk','Myanmar Text',sans-serif" : "Georgia,serif";

  const t = {
    en: {
      title: "Referral Program",
      yourCode: "YOUR REFERRAL CODE",
      copy: "Copy",
      copied: "Copied! ✓",
      shareViber: "Share on Viber",
      progress: "Referral Progress",
      progressSub: `Refer ${REQUIRED} agents → earn Priority Listing boost for ${BOOST_POSTS} properties (${BOOST_DAYS} days)`,
      referred: "referred",
      remaining: `${remaining} more to earn boost`,
      completed: `🏆 Boost earned! ${BOOST_POSTS} listings will be prioritized this month.`,
      whoJoined: "Agents You Referred",
      noReferrals: "No referrals yet. Share your code to get started!",
      joined: "Joined",
      active: "Active",
      inactive: "Inactive",
      totalEarned: "Total Boosts Earned",
      howItWorks: "How it works",
      step1: `Share your code with fellow agents`,
      step2: `They sign up using your code`,
      step3: `Every 5 referrals = ${BOOST_POSTS} of your listings go to the TOP of yumeestate.com for ${BOOST_DAYS} days`,
      step4: "More visibility = more buyers = faster sales",
    },
    my: {
      title: "ရည်ညွှန်း အစီအစဉ်",
      yourCode: "သင်၏ ရည်ညွှန်းကုဒ်",
      copy: "ကူးယူ",
      copied: "ကူးယူပြီး! ✓",
      shareViber: "Viber တွင် မျှဝေ",
      progress: "ရည်ညွှန်းမှု တိုးတက်မှု",
      progressSub: `အေးဂျင့် ${REQUIRED} ဦး ရည်ညွှန်းပါ → သင်၏ အိမ်ခြံမြေ ${BOOST_POSTS} ခု (${BOOST_DAYS} ရက်) ထိပ်တန်းတွင် ဖော်ပြပေးမည်`,
      referred: "ရည်ညွှန်းပြီး",
      remaining: `${remaining} ဦးထပ်မံ ရည်ညွှန်းရန်`,
      completed: `🏆 ချီးမြှင့်ချက် ရရှိပြီး! ဤလတွင် ${BOOST_POSTS} ခု ဦးစားပေး ဖော်ပြမည်။`,
      whoJoined: "သင် ရည်ညွှန်းသော အေးဂျင့်များ",
      noReferrals: "မည်သူမျှ မရည်ညွှန်းရသေး။ ကုဒ်မျှဝေပြီး စတင်ပါ!",
      joined: "ဝင်ရောက်သည်",
      active: "တက်ကြွ",
      inactive: "တက်ကြွမဟုတ်",
      totalEarned: "စုစုပေါင်း ရရှိသော ချီးမြှင့်ချက်",
      howItWorks: "မည်သို့ အလုပ်လုပ်သနည်း",
      step1: "သင်၏ ကုဒ်ကို အေးဂျင့်မိတ်ဆွေများနှင့် မျှဝေပါ",
      step2: "သူတို့ သင်၏ ကုဒ်ဖြင့် စာရင်းသွင်းသည်",
      step3: `ရည်ညွှန်း ${REQUIRED} ဦး တိုင်း = yumeestate.com ၏ ထိပ်ဆုံးတွင် ${BOOST_POSTS} ခု ${BOOST_DAYS} ရက်ကြာ ဖော်ပြပေးမည်`,
      step4: "ပိုမိုမြင်သောကြောင့် ဝယ်သူပိုများ၍ ပိုမြန်မြန် ရောင်းနိုင်မည်",
    },
  }[lang];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", fontFamily: ff }}>

      {/* Your referral code */}
      <div style={{ background: navy, borderRadius: "8px", padding: "24px" }}>
        <p style={{ color: gold, fontSize: "10px", letterSpacing: "3px", margin: "0 0 10px", fontFamily: ff }}>{t.yourCode}</p>
        <p style={{ color: "#fff", fontSize: "32px", fontWeight: 700, margin: "0 0 16px", letterSpacing: "5px" }}>{myCode}</p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={handleCopy}
            style={{ background: copied ? "#2d7a3a" : "transparent", border: `1px solid ${gold}`, color: copied ? "#fff" : gold, padding: "9px 20px", borderRadius: "4px", cursor: "pointer", fontSize: "13px", fontFamily: ff, transition: "all 0.2s" }}>
            {copied ? t.copied : t.copy}
          </button>
          <button
            style={{ background: "#1e6e3c", border: "none", color: "#fff", padding: "9px 20px", borderRadius: "4px", cursor: "pointer", fontSize: "13px", fontFamily: ff }}>
            📲 {t.shareViber}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: "8px", padding: "20px" }}>
        <p style={{ color: navy, fontSize: "14px", fontWeight: 600, margin: "0 0 4px", fontFamily: ff }}>{t.progress}</p>
        <p style={{ color: "#7a6a5a", fontSize: "12px", margin: "0 0 16px", fontFamily: ff }}>{t.progressSub}</p>

        {/* Progress bar */}
        <div style={{ background: "#e8dfc4", borderRadius: "999px", height: "10px", marginBottom: "10px", overflow: "hidden" }}>
          <div style={{ background: progress >= REQUIRED ? "#2d7a3a" : gold, height: "100%", width: `${progressPct}%`, borderRadius: "999px", transition: "width 0.5s ease" }} />
        </div>

        {/* Dots */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          {Array.from({ length: REQUIRED }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: "28px", borderRadius: "4px", background: i < progress ? (progress >= REQUIRED ? "#2d7a3a" : gold) : "#e8dfc4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: i < progress ? "#fff" : "#aaa", fontWeight: 700 }}>
              {i < progress ? "✓" : i + 1}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ color: navy, fontSize: "15px", fontWeight: 700, margin: 0, fontFamily: ff }}>
            {progress}/{REQUIRED} <span style={{ color: "#7a6a5a", fontWeight: 400, fontSize: "13px" }}>{t.referred}</span>
          </p>
          {progress < REQUIRED
            ? <p style={{ color: "#7a6a5a", fontSize: "12px", margin: 0, fontFamily: ff }}>{t.remaining}</p>
            : <p style={{ color: "#2d7a3a", fontSize: "12px", margin: 0, fontWeight: 600, fontFamily: ff }}>{t.completed}</p>
          }
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: "8px", padding: "16px", textAlign: "center" }}>
          <p style={{ color: gold, fontSize: "28px", fontWeight: 700, margin: "0 0 4px", fontFamily: ff }}>{referred}</p>
          <p style={{ color: "#7a6a5a", fontSize: "12px", margin: 0, fontFamily: ff }}>{t.referred}</p>
        </div>
        <div style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: "8px", padding: "16px", textAlign: "center" }}>
          <p style={{ color: "#2d7a3a", fontSize: "28px", fontWeight: 700, margin: "0 0 4px", fontFamily: ff }}>{earned}</p>
          <p style={{ color: "#7a6a5a", fontSize: "12px", margin: 0, fontFamily: ff }}>{t.totalEarned}</p>
        </div>
      </div>

      {/* Who joined */}
      <div style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: "8px", padding: "20px" }}>
        <p style={{ color: navy, fontSize: "14px", fontWeight: 600, margin: "0 0 14px", fontFamily: ff }}>{t.whoJoined}</p>
        {MOCK_REFERRALS.length === 0 ? (
          <p style={{ color: "#7a6a5a", fontSize: "13px", margin: 0, fontFamily: ff }}>{t.noReferrals}</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {MOCK_REFERRALS.map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#faf7f2", borderRadius: "6px", border: "1px solid #e8dfc4" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: navy, display: "flex", alignItems: "center", justifyContent: "center", color: gold, fontSize: "13px", fontWeight: 700 }}>
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ color: navy, fontSize: "13px", fontWeight: 600, margin: "0 0 2px", fontFamily: ff }}>{r.name}</p>
                    <p style={{ color: "#7a6a5a", fontSize: "11px", margin: 0, fontFamily: ff }}>{t.joined} {r.joinedDate}</p>
                  </div>
                </div>
                <span style={{ background: r.active ? "#f0faf2" : "#fff0f0", color: r.active ? "#2d7a3a" : "#a32d2d", fontSize: "11px", padding: "3px 10px", borderRadius: "999px", border: `1px solid ${r.active ? "#2d7a3a" : "#f09595"}`, fontFamily: ff }}>
                  {r.active ? t.active : t.inactive}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How it works */}
      <div style={{ background: "#faf7f2", border: `1px solid ${gold}`, borderRadius: "8px", padding: "20px" }}>
        <p style={{ color: navy, fontSize: "13px", fontWeight: 600, margin: "0 0 14px", letterSpacing: "1px", fontFamily: ff }}>🏆 {t.howItWorks}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[t.step1, t.step2, t.step3, t.step4].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#fff", fontWeight: 700, flexShrink: 0, marginTop: "1px" }}>{i + 1}</div>
              <p style={{ color: "#5a4a3a", fontSize: "13px", margin: 0, lineHeight: 1.5, fontFamily: ff }}>{s}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
