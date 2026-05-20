"use client";

import { useState } from "react";

type Lang = "en" | "my";

const txt = {
  en: {
    backToSite: "← Back to Properties",
    tagline: "PREMIUM PROPERTIES · TRUSTED AGENTS",
    welcomeBack: "Welcome Back",
    agentPortal: "Agent Portal",
    subtitle: "Manage your properties, leads, and clients",
    phone: "Phone Number",
    password: "Password",
    rememberMe: "Remember me — stay logged in",
    signIn: "SIGN IN TO AGENT PORTAL",
    forgotPassword: "Forgot password?",
    noAccount: "Don't have an account?",
    subscribe: "Subscribe for 10,000 MMK/month →",
    phonePlaceholder: "09-xxxxxxxxx",
    passwordPlaceholder: "Enter your password",
    errorEmpty: "Please enter your phone number and password.",
    errorInvalid: "Invalid phone number or password. Please try again.",
    signingIn: "Signing in...",
    agentBenefits: "Why subscribe?",
    benefit1: "Upload & manage unlimited properties",
    benefit2: "Your available listings shown publicly on yumeestate.com",
    benefit3: "Instant search across all your inventory",
    benefit4: "See owner contacts anytime",
    benefit5: "Receive leads from interested customers",
    perMonth: "10,000 MMK / month",
  },
  my: {
    backToSite: "← အိမ်ခြံမြေများသို့ ပြန်သွားရန်",
    tagline: "အဆင့်မြင့် အိမ်ခြံမြေ · ယုံကြည်ရသော အေးဂျင့်များ",
    welcomeBack: "ကြိုဆိုပါသည်",
    agentPortal: "အေးဂျင့် ပေါ်တယ်",
    subtitle: "သင်၏ အိမ်ခြံမြေ၊ လိဒ်များနှင့် ဖောက်သည်များကို စီမံပါ",
    phone: "ဖုန်းနံပါတ်",
    password: "စကားဝှက်",
    rememberMe: "မှတ်သားထားပါ — ဆက်လက် ဝင်ရောက်နေပါ",
    signIn: "အေးဂျင့် ပေါ်တယ်သို့ ဝင်ရောက်ရန်",
    forgotPassword: "စကားဝှက် မေ့သွားသလား?",
    noAccount: "အကောင့် မရှိသေးဘူးလား?",
    subscribe: "တစ်လ ၁၀,၀၀၀ ကျပ်ဖြင့် စာရင်းသွင်းရန် →",
    phonePlaceholder: "09-xxxxxxxxx",
    passwordPlaceholder: "စကားဝှက် ထည့်ပါ",
    errorEmpty: "အီးမေးလ်နှင့် စကားဝှက် ထည့်ပါ။",
    errorInvalid: "အီးမေးလ် သို့မဟုတ် စကားဝှက် မှားနေသည်။ ထပ်မံ ကြိုးစားပါ။",
    signingIn: "ဝင်ရောက်နေသည်...",
    agentBenefits: "အဘယ်ကြောင့် စာရင်းသွင်းသင့်သနည်း?",
    benefit1: "အကန့်အသတ်မရှိ အိမ်ခြံမြေများ တင်၍ စီမံနိုင်သည်",
    benefit2: "ရရှိနိုင်သော လစ်ဆင်းများကို yumeestate.com တွင် အများသူငှာ ပြသသည်",
    benefit3: "သင်၏ မှတ်တမ်းအားလုံးကို ချက်ချင်း ရှာဖွေနိုင်သည်",
    benefit4: "ပိုင်ရှင်၏ ဆက်သွယ်ရေးကို အချိန်မရွေး ကြည့်နိုင်သည်",
    benefit5: "စိတ်ဝင်စားသော ဖောက်သည်များထံမှ လိဒ်များ ရရှိနိုင်သည်",
    perMonth: "တစ်လ ၁၀,၀၀၀ ကျပ်",
  },
};

interface AgentLoginPageProps {
  onLogin: (phone: string, rememberMe: boolean) => void;
  onBack?: () => void;
  onGoToSignup?: () => void;
}

export default function AgentLoginPage({ onLogin, onBack, onGoToSignup }: AgentLoginPageProps) {
  const [lang, setLang] = useState<Lang>("en");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const t = txt[lang];
  const fontFamily = lang === "my" ? "'Padauk', 'Myanmar Text', sans-serif" : "Georgia, serif";

  async function handleSignIn() {
    setError("");
    if (!phone.trim() || !password.trim()) {
      setError(t.errorEmpty);
      return;
    }
    setLoading(true);
    // Simulate auth — replace with real auth logic
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    if (password.length < 4) {
      setError(t.errorInvalid);
      return;
    }
    if (rememberMe) {
      localStorage.setItem("yume_agent_phone", phone);
      localStorage.setItem("yume_remember_me", "true");
    }
    onLogin(phone, rememberMe);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSignIn();
  }

  const benefits = [t.benefit1, t.benefit2, t.benefit3, t.benefit4, t.benefit5];

  return (
    <div style={{ minHeight: "100vh", background: "#f5f0e8", fontFamily, display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <header style={{ background: "#fbf3da", padding: "0px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "2px solid #bd9468" }}>
        <img src="/logo.png" alt="Yume Estate" style={{ width: "150px", height: "auto" }} />
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <div style={{ display: "flex", border: "1px solid #bd9468", borderRadius: "4px", overflow: "hidden" }}>
            <button onClick={() => setLang("en")}
              style={{ padding: "6px 14px", background: lang === "en" ? "#bd9468" : "transparent", color: lang === "en" ? "#fff" : "#bd9468", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>
              EN
            </button>
            <button onClick={() => setLang("my")}
              style={{ padding: "6px 14px", background: lang === "my" ? "#bd9468" : "transparent", color: lang === "my" ? "#fff" : "#bd9468", border: "none", cursor: "pointer", fontSize: "13px", fontFamily }}>
              မြန်မာ
            </button>
          </div>
          <button onClick={onBack} style={{ color: "#111d2b", fontSize: "13px", background: "none", border: "none", cursor: "pointer", fontFamily }}>{t.backToSite}</button>
        </div>
      </header>

      {/* Tagline */}
      <div style={{ background: "#111d2b", padding: "10px 24px", textAlign: "center" }}>
        <p style={{ color: "#d4af7a", fontSize: "12px", margin: 0, letterSpacing: lang === "en" ? "4px" : "1px", fontStyle: "italic", fontFamily }}>{t.tagline}</p>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", alignItems: "stretch", minHeight: "calc(100vh - 120px)" }}>

        {/* Left — benefits panel */}
        <div style={{ background: "#1a2e45", flex: 1, padding: "56px 48px", display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0 }}>
          <img src="/logo.png" alt="Yume Estate" style={{ width: "160px", height: "auto", marginBottom: "32px", filter: "brightness(10)" }} />
          <h2 style={{ color: "#bd9468", fontSize: "13px", letterSpacing: "3px", margin: "0 0 24px", fontFamily }}>{t.agentBenefits}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {benefits.map((b, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span style={{ color: "#bd9468", fontSize: "18px", lineHeight: 1 }}>✓</span>
                <p style={{ color: "#c8d8e8", fontSize: "15px", margin: 0, lineHeight: 1.5, fontFamily }}>{b}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "40px", background: "rgba(189,148,104,0.15)", border: "1px solid #bd9468", borderRadius: "4px", padding: "20px" }}>
            <p style={{ color: "#bd9468", fontSize: "22px", fontWeight: 700, margin: "0 0 4px", fontFamily }}>{t.perMonth}</p>
            <p style={{ color: "#8fafc8", fontSize: "13px", margin: 0, fontFamily }}>{t.noAccount}</p>
            <a href="/subscribe" style={{ color: "#bd9468", fontSize: "14px", fontFamily, textDecoration: "underline" }} onClick={e => { e.preventDefault(); onGoToSignup?.(); }}>{t.subscribe}</a>
          </div>
        </div>

        {/* Right — login form */}
        <div style={{ flex: 1, padding: "56px 48px", display: "flex", flexDirection: "column", justifyContent: "center", background: "#f5f0e8", minWidth: 0 }}>
          <p style={{ color: "#bd9468", fontSize: "12px", letterSpacing: "3px", margin: "0 0 8px", fontFamily }}>AGENT ONLY</p>
          <h1 style={{ color: "#111d2b", fontSize: "30px", fontWeight: 400, margin: "0 0 6px", fontFamily }}>{t.welcomeBack}</h1>
          <h2 style={{ color: "#111d2b", fontSize: "18px", fontWeight: 400, margin: "0 0 6px", fontFamily }}>{t.agentPortal}</h2>
          <p style={{ color: "#7a6a5a", fontSize: "14px", margin: "0 0 36px", fontFamily }}>{t.subtitle}</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "400px" }}>

            {/* Email */}
            <div>
              <label style={{ display: "block", color: "#5a4a3a", fontSize: "13px", marginBottom: "6px", letterSpacing: "1px", fontFamily }}>{t.phone}</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.phonePlaceholder}
                style={{ width: "100%", padding: "13px 16px", borderRadius: "4px", border: "1px solid #ddd5c0", background: "#fff", fontSize: "15px", fontFamily, boxSizing: "border-box" }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", color: "#5a4a3a", fontSize: "13px", marginBottom: "6px", letterSpacing: "1px", fontFamily }}>{t.password}</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t.passwordPlaceholder}
                  style={{ width: "100%", padding: "13px 48px 13px 16px", borderRadius: "4px", border: "1px solid #ddd5c0", background: "#fff", fontSize: "15px", fontFamily, boxSizing: "border-box" }}
                />
                <button onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#7a6a5a", display: "flex", alignItems: "center", padding: "4px" }}>
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "#bd9468" }}
              />
              <label htmlFor="rememberMe" style={{ color: "#5a4a3a", fontSize: "14px", cursor: "pointer", fontFamily }}>{t.rememberMe}</label>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: "#fff0f0", border: "1px solid #f09595", borderRadius: "4px", padding: "10px 14px" }}>
                <p style={{ color: "#a32d2d", fontSize: "13px", margin: 0, fontFamily }}>{error}</p>
              </div>
            )}

            {/* Sign in button */}
            <button
              onClick={handleSignIn}
              disabled={loading}
              style={{ background: loading ? "#7a6a5a" : "#111d2b", color: "#bd9468", border: "2px solid #bd9468", padding: "15px", borderRadius: "4px", fontSize: "14px", letterSpacing: lang === "en" ? "2px" : "0", cursor: loading ? "not-allowed" : "pointer", fontFamily, transition: "background 0.2s" }}>
              {loading ? t.signingIn : t.signIn}
            </button>

            {/* Forgot password */}
            <div style={{ textAlign: "center" }}>
              <a href="/forgot-password" style={{ color: "#7a6a5a", fontSize: "13px", fontFamily }}>{t.forgotPassword}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
