"use client";

import { useEffect, useState } from "react";
import PublicPropertyPage from "./PublicPropertyPage";
import AgentLoginPage from "./AgentLoginPage";
import AgentSignupPage from "./AgentSignupPage";
import AppShell from "./AppShell";

type View = "public" | "agentLogin" | "agentSignup" | "agentDashboard";

const STORAGE_KEY = "yume_agent_session";

export default function Page() {
  const [view, setView] = useState<View>("public");
  const [ready, setReady] = useState(false);
  const [isAgentLoggedIn, setIsAgentLoggedIn] = useState(false);

  useEffect(() => {
    try {
      const session = localStorage.getItem(STORAGE_KEY);
      if (session) {
        const parsed = JSON.parse(session);
        if (parsed?.phone && parsed?.rememberMe) {
          setView("agentDashboard");
          setIsAgentLoggedIn(true);
        }
      }
    } catch {}
    setReady(true);
  }, []);

  // Expose navigation to AppShell via window
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__yumeViewPublic = () => setView("public");
    }
  }, []);

  function handleLoginSuccess(phone: string, rememberMe: boolean) {
    if (rememberMe) localStorage.setItem(STORAGE_KEY, JSON.stringify({ phone, rememberMe: true }));
    setIsAgentLoggedIn(true);
    setView("agentDashboard");
  }

  function handleSignupSuccess(phone: string) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ phone, rememberMe: true }));
    setIsAgentLoggedIn(true);
    setView("agentDashboard");
  }

  if (!ready) {
    return (
      <div style={{ minHeight: "100vh", background: "#111d2b", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "20px" }}>
        <img src="/logo-footer.png" alt="Yume Estate" style={{ width: "200px" }} />
        <div style={{ width: "32px", height: "32px", border: "3px solid #bd9468", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── PUBLIC PAGE — show "Back to Dashboard" button if agent is logged in ──
  if (view === "public") {
    return (
      <div style={{ position: "relative" }}>
        <PublicPropertyPage onAgentLoginClick={() => setView("agentLogin")} />
        {/* Back to dashboard button — only shows if agent is logged in */}
        {isAgentLoggedIn && (
          <button
            onClick={() => setView("agentDashboard")}
            style={{
              position: "fixed", bottom: "24px", right: "24px", zIndex: 999,
              background: "#111d2b", color: "#bd9468", border: "2px solid #bd9468",
              padding: "12px 20px", borderRadius: "8px", cursor: "pointer",
              fontSize: "13px", fontWeight: 700, boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              display: "flex", alignItems: "center", gap: "8px",
            }}>
            📊 Back to Dashboard
          </button>
        )}
      </div>
    );
  }

  if (view === "agentLogin") {
    return <AgentLoginPage onLogin={handleLoginSuccess} onBack={() => setView("public")} onGoToSignup={() => setView("agentSignup")} />;
  }

  if (view === "agentSignup") {
    return <AgentSignupPage onSignupSuccess={handleSignupSuccess} onBack={() => setView("public")} onGoToLogin={() => setView("agentLogin")} />;
  }

  // ── AGENT DASHBOARD ──
  return <AppShell onSignOut={() => { setIsAgentLoggedIn(false); setView("public"); }} />;
}
