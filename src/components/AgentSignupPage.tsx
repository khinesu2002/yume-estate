"use client";

import { useState } from "react";

type Lang = "en" | "my";
type Step = "form" | "payment" | "success";

const txt = {
  en: {
    backToLogin: "← Back to Login",
    tagline: "PREMIUM PROPERTIES · TRUSTED AGENTS",
    title: "Create Agent Account",
    phone: "Phone Number",
    phonePlaceholder: "09-xxxxxxxxx",
    password: "Password",
    passwordPlaceholder: "Create a password (min. 6 characters)",
    referral: "Referral Code",
    referralPlaceholder: "Enter referral code (optional)",
    referralValid: "✓ Referral code applied",
    referralInvalid: "✕ Invalid referral code",
    continue: "Continue →",
    alreadyHave: "Already have an account?",
    signIn: "Sign in",
    errPhone: "Please enter a valid phone number (e.g. 09-xxxxxxxxx)",
    errPassword: "Password must be at least 6 characters",
    payTitle: "Subscription Payment",
    plan: "Agent Monthly Plan",
    perMonth: "/ month",
    confirmPay: "Confirm & Activate Account",
    payNote: "Your account will be activated immediately after confirmation.",
    successTitle: "Welcome to Yume Estate!",
    successSub: "Your agent account is now active. Start uploading your properties!",
    yourCode: "YOUR REFERRAL CODE",
    shareHint: "Refer 5 agents using your code → earn Priority Listing boost for 2 of your properties for 1 month. Your listings appear at the top — more buyers, faster sales.",
    copyCode: "Copy Code",
    copied: "Copied! ✓",
    goToDashboard: "Go to My Dashboard →",
  },
  my: {
    backToLogin: "← လော့ဂ်အင်သို့ ပြန်သွားရန်",
    tagline: "အဆင့်မြင့် အိမ်ခြံမြေ · ယုံကြည်ရသော အေးဂျင့်များ",
    title: "အေးဂျင့် အကောင့် ဖွင့်ရန်",
    phone: "ဖုန်းနံပါတ်",
    phonePlaceholder: "၀၉-xxxxxxxxx",
    password: "စကားဝှက်",
    passwordPlaceholder: "စကားဝှက် ဖန်တီးပါ (အနည်းဆုံး ၆ လုံး)",
    referral: "ရည်ညွှန်းကုဒ်",
    referralPlaceholder: "ရည်ညွှန်းကုဒ် ထည့်ပါ (ရွေးချယ်နိုင်)",
    referralValid: "✓ ရည်ညွှန်းကုဒ် အသုံးပြုပြီး",
    referralInvalid: "✕ ရည်ညွှန်းကုဒ် မမှန်ပါ",
    continue: "ဆက်သွားရန် →",
    alreadyHave: "အကောင့် ရှိပြီးသားလား?",
    signIn: "ဝင်ရောက်ရန်",
    errPhone: "ဖုန်းနံပါတ် မှန်ကန်စွာ ထည့်ပါ",
    errPassword: "စကားဝှက် အနည်းဆုံး ၆ လုံး ထည့်ပါ",
    payTitle: "စာရင်းသွင်းကြေး ပေးချေမှု",
    plan: "အေးဂျင့် လစဉ် အစီအစဉ်",
    perMonth: "/ လ",
    confirmPay: "အတည်ပြု၍ အကောင့် အသက်သွင်းရန်",
    payNote: "အတည်ပြုပြီးနောက် သင်၏ အကောင့်ကို ချက်ချင်း အသက်သွင်းပေးမည်။",
    successTitle: "Yume Estate သို့ ကြိုဆိုပါသည်!",
    successSub: "သင်၏ အေးဂျင့် အကောင့် အသက်ဝင်နေပါပြီ။ အိမ်ခြံမြေများ တင်သွင်းစတင်ပါ!",
    yourCode: "သင်၏ ရည်ညွှန်းကုဒ်",
    shareHint: "သင်၏ ကုဒ်ဖြင့် အေးဂျင့် ၅ ဦး ရည်ညွှန်းပါ → သင်၏ အိမ်ခြံမြေ ၂ ခုကို ၁ လ ကြာ ထိပ်တန်းတွင် ဖော်ပြပေးမည်။ ဝယ်သူပိုမိုမြင်သောကြောင့် ပိုမြန်မြန် ရောင်းနိုင်မည်။",
    copyCode: "ကုဒ် ကူးယူရန်",
    copied: "ကူးယူပြီး! ✓",
    goToDashboard: "ကျွန်ုပ်၏ ဒက်ရှ်ဘုတ်သို့ →",
  },
};

const VALID_CODES = ["YUME-AUNG01", "YUME-THIDA02", "YUME-KHIN03"];

function makeReferralCode(phone: string): string {
  const digits = phone.replace(/\D/g, "").slice(-4);
  return `YUME-${digits}`;
}

interface Props {
  onSignupSuccess: (phone: string) => void;
  onGoToLogin?: () => void;
  onBack?: () => void;
}

export default function AgentSignupPage({ onSignupSuccess, onGoToLogin, onBack }: Props) {
  const [lang, setLang] = useState<Lang>("my");
  const [step, setStep] = useState<Step>("form");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [referral, setReferral] = useState("");
  const [referralStatus, setReferralStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [errors, setErrors] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const t = txt[lang];
  const ff = lang === "my" ? "'Padauk','Myanmar Text',sans-serif" : "Georgia,serif";
  const gold = "#bd9468";
  const navy = "#111d2b";
  const cream = "#f5f0e8";
  const myCode = makeReferralCode(phone);

  function checkReferral(val: string) {
    setReferral(val);
    if (!val.trim()) { setReferralStatus("idle"); return; }
    setReferralStatus(VALID_CODES.includes(val.trim().toUpperCase()) ? "valid" : "invalid");
  }

  function handleSubmit() {
    const errs: string[] = [];
    if (phone.replace(/\D/g, "").length < 9) errs.push(t.errPhone);
    if (!companyName.trim()) errs.push(lang === "en" ? "Company name is required" : "ကုမ္ပဏီ အမည် ထည့်ပါ");
    if (password.length < 6) errs.push(t.errPassword);
    setErrors(errs);
    if (errs.length === 0) setStep("payment");
  }

  function handleCopy() {
    navigator.clipboard.writeText(myCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const inp: React.CSSProperties = {
    width: "100%", padding: "14px 16px", borderRadius: "6px",
    border: "1px solid #ddd5c0", background: "#fff",
    fontSize: "15px", fontFamily: ff, boxSizing: "border-box", color: navy,
  };
  const lbl: React.CSSProperties = {
    display: "block", color: "#5a4a3a", fontSize: "12px",
    letterSpacing: "1px", marginBottom: "7px", fontFamily: ff,
  };

  return (
    <div style={{ minHeight: "100vh", background: cream, fontFamily: ff }}>

      {/* Header */}
      <header style={{ background: "#fbf3da", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `2px solid ${gold}` }}>
        <img src="/logo.png" alt="Yume Estate" style={{ width: "140px", height: "auto" }} />
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          <div style={{ display: "flex", border: `1px solid ${gold}`, borderRadius: "4px", overflow: "hidden" }}>
            <button onClick={() => setLang("en")} style={{ padding: "6px 14px", background: lang === "en" ? gold : "transparent", color: lang === "en" ? "#fff" : gold, border: "none", cursor: "pointer", fontSize: "12px", fontWeight: 700 }}>EN</button>
            <button onClick={() => setLang("my")} style={{ padding: "6px 14px", background: lang === "my" ? gold : "transparent", color: lang === "my" ? "#fff" : gold, border: "none", cursor: "pointer", fontSize: "12px", fontFamily: ff }}>မြန်မာ</button>
          </div>
          <button onClick={step !== "form" ? () => setStep("form") : onBack}
            style={{ background: "none", border: "none", color: navy, fontSize: "13px", cursor: "pointer", fontFamily: ff }}>
            {t.backToLogin}
          </button>
        </div>
      </header>

      {/* Tagline */}
      <div style={{ background: navy, padding: "9px 24px", textAlign: "center" }}>
        <p style={{ color: "#d4af7a", fontSize: "11px", margin: 0, letterSpacing: lang === "en" ? "5px" : "1px", fontStyle: "italic", fontFamily: ff }}>{t.tagline}</p>
      </div>

      {/* Card */}
      <div style={{ maxWidth: "440px", margin: "48px auto", padding: "0 20px 48px" }}>
        <div style={{ background: "#fff", borderRadius: "8px", border: "1px solid #e0d8cc", overflow: "hidden" }}>

          <div style={{ background: navy, padding: "24px 28px" }}>
            <img src="/logo.png" alt="Yume Estate" style={{ width: "110px", filter: "brightness(10)", marginBottom: "12px" }} />
            <h1 style={{ color: cream, fontSize: "20px", fontWeight: 400, margin: 0, fontFamily: ff }}>{t.title}</h1>
          </div>

          <div style={{ padding: "28px" }}>

            {/* ── STEP 1: FORM ── */}
            {step === "form" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

                <div>
                  <label style={lbl}>{t.phone} *</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder={t.phonePlaceholder} type="tel" style={inp} />
                </div>

                <div>
                  <label style={lbl}>{lang === "en" ? "COMPANY / AGENCY NAME" : "ကုမ္ပဏီ / အေဂျင်စီ အမည်"} *</label>
                  <input value={companyName} onChange={e => setCompanyName(e.target.value)}
                    placeholder={lang === "en" ? "e.g. Swam Mahar Real Estate Co., Ltd." : "ဥပမာ Swam Mahar အိမ်ခြံမြေ ကုမ္ပဏီ လီမိတက်"}
                    style={inp} />
                </div>

                <div>
                  <label style={lbl}>{t.password} *</label>
                  <div style={{ position: "relative" }}>
                    <input value={password} onChange={e => setPassword(e.target.value)}
                      placeholder={t.passwordPlaceholder}
                      type={showPassword ? "text" : "password"}
                      style={{ ...inp, paddingRight: "48px" }} />
                    <button onClick={() => setShowPassword(!showPassword)}
                      style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "#7a6a5a" }}>
                    <button onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#7a6a5a", display: "flex", alignItems: "center", padding: "4px" }}>
                      {showPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Referral — optional, no benefit mentioned */}
                <div>
                  <label style={lbl}>{t.referral}</label>
                  <input value={referral} onChange={e => checkReferral(e.target.value)}
                    placeholder={t.referralPlaceholder}
                    style={{ ...inp, borderColor: referralStatus === "valid" ? "#2d7a3a" : referralStatus === "invalid" ? "#a32d2d" : "#ddd5c0" }} />
                  {referralStatus === "valid" && <p style={{ color: "#2d7a3a", fontSize: "12px", margin: "6px 0 0", fontFamily: ff }}>{t.referralValid}</p>}
                  {referralStatus === "invalid" && <p style={{ color: "#a32d2d", fontSize: "12px", margin: "6px 0 0", fontFamily: ff }}>{t.referralInvalid}</p>}
                </div>

                {errors.length > 0 && (
                  <div style={{ background: "#fff0f0", border: "1px solid #f09595", borderRadius: "6px", padding: "12px 16px" }}>
                    {errors.map((e, i) => <p key={i} style={{ color: "#a32d2d", fontSize: "13px", margin: i === 0 ? 0 : "4px 0 0", fontFamily: ff }}>• {e}</p>)}
                  </div>
                )}

                <button onClick={handleSubmit}
                  style={{ background: navy, color: gold, border: `2px solid ${gold}`, padding: "15px", borderRadius: "6px", fontSize: "14px", cursor: "pointer", fontFamily: ff, fontWeight: 600 }}>
                  {t.continue}
                </button>

                <p style={{ textAlign: "center", color: "#7a6a5a", fontSize: "13px", margin: 0, fontFamily: ff }}>
                  {t.alreadyHave}{" "}
                  <button onClick={onGoToLogin} style={{ background: "none", border: "none", color: gold, cursor: "pointer", fontSize: "13px", fontFamily: ff, textDecoration: "underline" }}>{t.signIn}</button>
                </p>
              </div>
            )}

            {/* ── STEP 2: PAYMENT — same for everyone ── */}
            {step === "payment" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <h2 style={{ color: navy, fontSize: "18px", fontWeight: 400, margin: 0, fontFamily: ff }}>{t.payTitle}</h2>

                <div style={{ background: navy, borderRadius: "8px", padding: "28px", textAlign: "center" }}>
                  <p style={{ color: gold, fontSize: "11px", letterSpacing: "2px", margin: "0 0 10px", fontFamily: ff }}>{t.plan}</p>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "8px" }}>
                    <span style={{ color: "#fff", fontSize: "46px", fontWeight: 700, fontFamily: ff }}>10,000</span>
                    <span style={{ color: "#8fafc8", fontSize: "16px", fontFamily: ff }}>MMK</span>
                  </div>
                  <p style={{ color: "#4a6a8a", fontSize: "13px", margin: "6px 0 0", fontFamily: ff }}>{t.perMonth}</p>
                </div>

                <div style={{ background: "#faf7f2", border: "1px solid #e0d8cc", borderRadius: "6px", padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#7a6a5a", fontSize: "13px", fontFamily: ff }}>Phone</span>
                    <span style={{ color: navy, fontSize: "13px", fontWeight: 600, fontFamily: ff }}>{phone}</span>
                  </div>
                </div>

                <p style={{ color: "#7a6a5a", fontSize: "12px", textAlign: "center", margin: 0, fontFamily: ff }}>{t.payNote}</p>

                <button onClick={() => setStep("success")}
                  style={{ background: gold, color: "#fff", border: "none", padding: "16px", borderRadius: "6px", fontSize: "15px", cursor: "pointer", fontFamily: ff, fontWeight: 600 }}>
                  {t.confirmPay}
                </button>
              </div>
            )}

            {/* ── STEP 3: SUCCESS — same for everyone ── */}
            {step === "success" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "52px" }}>✓</div>
                <div>
                  <h2 style={{ color: navy, fontSize: "20px", fontWeight: 400, margin: "0 0 6px", fontFamily: ff }}>{t.successTitle}</h2>
                  <p style={{ color: "#7a6a5a", fontSize: "14px", margin: 0, fontFamily: ff }}>{t.successSub}</p>
                </div>

                {/* Referral code — everyone gets one */}
                <div style={{ background: navy, borderRadius: "8px", padding: "20px" }}>
                  <p style={{ color: gold, fontSize: "10px", letterSpacing: "3px", margin: "0 0 10px", fontFamily: ff }}>{t.yourCode}</p>
                  <p style={{ color: "#fff", fontSize: "28px", fontWeight: 700, margin: "0 0 14px", letterSpacing: "4px" }}>{myCode}</p>
                  <button onClick={handleCopy}
                    style={{ background: copied ? "#2d7a3a" : "rgba(189,148,104,0.15)", border: `1px solid ${gold}`, color: copied ? "#fff" : gold, padding: "8px 24px", borderRadius: "4px", cursor: "pointer", fontSize: "13px", fontFamily: ff, transition: "all 0.2s" }}>
                    {copied ? t.copied : t.copyCode}
                  </button>

                  {/* Priority listing reward explained here for the first time */}
                  <div style={{ marginTop: "14px", padding: "12px", background: "rgba(189,148,104,0.1)", borderRadius: "6px", border: `1px solid rgba(189,148,104,0.3)` }}>
                    <p style={{ color: gold, fontSize: "11px", fontWeight: 700, margin: "0 0 4px", letterSpacing: "1px", fontFamily: ff }}>★ PRIORITY LISTING REWARD</p>
                    <p style={{ color: "#8fafc8", fontSize: "12px", margin: 0, lineHeight: 1.6, fontFamily: ff }}>{t.shareHint}</p>
                  </div>
                </div>

                <button onClick={() => onSignupSuccess(phone)}
                  style={{ background: navy, color: gold, border: `2px solid ${gold}`, padding: "15px", borderRadius: "6px", fontSize: "14px", cursor: "pointer", fontFamily: ff, fontWeight: 600 }}>
                  {t.goToDashboard}
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
