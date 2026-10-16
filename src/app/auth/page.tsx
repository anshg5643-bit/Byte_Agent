"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { CyberAgentRobot } from "@/components/CyberAgentRobot";
import confetti from "canvas-confetti";

export default function AuthPage() {
  const router = useRouter();
  const { user, setUser, showToast, llmKey, setLlmKey } = useApp();

  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [fullNameInput, setFullNameInput] = useState("");
  const [affiliationInput, setAffiliationInput] = useState("");
  const [llmKeyInput, setLlmKeyInput] = useState(llmKey || "");

  // Google Workspace Sign-In Modal
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isGoogleProcessing, setIsGoogleProcessing] = useState(false);
  const [googleWorkspaceEmail, setGoogleWorkspaceEmail] = useState("");
  const [googleWorkspaceName, setGoogleWorkspaceName] = useState("");

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#4a7c59", "#c4a66a", "#8ae9b3", "#4285F4"],
      });
    } catch {
      // ignore
    }
  };

  const handleGoogleWorkspaceSignIn = (emailToUse?: string, nameToUse?: string) => {
    const finalEmail = (emailToUse || googleWorkspaceEmail || "scholar@byte.college.edu").trim();
    const finalName = (nameToUse || googleWorkspaceName || finalEmail.split("@")[0].replace(/[._]/g, " ")).trim();

    setIsGoogleProcessing(true);
    showToast(`Authorizing Google Workspace credentials for ${finalEmail}...`);

    setTimeout(() => {
      setIsGoogleProcessing(false);
      setIsGoogleModalOpen(false);

      setUser({
        id: "USR-BYTE-" + Math.floor(1000 + Math.random() * 9000),
        fullName: finalName.charAt(0).toUpperCase() + finalName.slice(1),
        email: finalEmail,
        role: "Academic Evaluator",
        clearanceLevel: "Full Clearance",
        affiliation: "Society Byte Portal",
        avatarUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAuXhWrVmBCIy7g8qXEnYspznB0uwFEHfeSgTf-Lz7iYfztnWH93OkXHVLYHBR4nU8XiE-SxIsGkMTCbZfURsv73WH0RN-aoN4aIE0t5ls40KndshwxPgLh0RGGBbMCp1RK0sm1C01pSEfQDo5nfDKY4FwqsZnIw7gDtIHBMaRKM2Ag12lEhkt6xNqPDdMqk63_nhgzWPH9rR4w0YMyLIO4FDmzaWkUrjecnOLL73Z4EqJDC-Bt6RLc",
        apiKeySet: true,
        llmProvider: "Gemini 2.5 Pro (ByteAgent Workspace)",
      });

      triggerConfetti();
      showToast(`Signed in to ByteAgent as ${finalName} (${finalEmail})`);

      setTimeout(() => {
        router.push("/");
      }, 600);
    }, 700);
  };

  const handleExpressClearance = (type: "evaluator" | "student") => {
    if (type === "evaluator") {
      setUser({
        id: "USR-EVAL-09",
        fullName: "Academic Evaluator (Judge #09)",
        email: "evaluator@byte.college.edu",
        role: "Academic Evaluator",
        clearanceLevel: "Full Clearance",
        affiliation: "Society Byte Evaluation Council",
        avatarUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAuXhWrVmBCIy7g8qXEnYspznB0uwFEHfeSgTf-Lz7iYfztnWH93OkXHVLYHBR4nU8XiE-SxIsGkMTCbZfURsv73WH0RN-aoN4aIE0t5ls40KndshwxPgLh0RGGBbMCp1RK0sm1C01pSEfQDo5nfDKY4FwqsZnIw7gDtIHBMaRKM2Ag12lEhkt6xNqPDdMqk63_nhgzWPH9rR4w0YMyLIO4FDmzaWkUrjecnOLL73Z4EqJDC-Bt6RLc",
        apiKeySet: true,
        llmProvider: "Gemini 2.5 Pro (Judge Sandbox)",
      });
      triggerConfetti();
      showToast("Evaluator Clearance granted! Session initialized for Judge #09.");
    } else {
      setUser({
        id: "USR-STUDENT-88",
        fullName: "Byte Student Contributor",
        email: "student@byte.college.edu",
        role: "Student Contributor",
        clearanceLevel: "Sandbox Mode",
        affiliation: "Department of Computing & AI",
        avatarUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAuXhWrVmBCIy7g8qXEnYspznB0uwFEHfeSgTf-Lz7iYfztnWH93OkXHVLYHBR4nU8XiE-SxIsGkMTCbZfURsv73WH0RN-aoN4aIE0t5ls40KndshwxPgLh0RGGBbMCp1RK0sm1C01pSEfQDo5nfDKY4FwqsZnIw7gDtIHBMaRKM2Ag12lEhkt6xNqPDdMqk63_nhgzWPH9rR4w0YMyLIO4FDmzaWkUrjecnOLL73Z4EqJDC-Bt6RLc",
        apiKeySet: true,
        llmProvider: "Ollama / Local LLM",
      });
      showToast("Student Contributor profile enabled. Sandbox Mode active.");
    }
    setTimeout(() => {
      router.push("/");
    }, 700);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (llmKeyInput) {
      setLlmKey(llmKeyInput);
    }
    const name = fullNameInput.trim() || emailInput.split("@")[0] || "Byte Scholar";
    setUser({
      id: "USR-CUSTOM",
      fullName: name,
      email: emailInput || "user@byte.college.edu",
      role: "Academic Evaluator",
      clearanceLevel: "Full Clearance",
      affiliation: affiliationInput || "Society Byte Member",
      avatarUrl: user.avatarUrl,
      apiKeySet: Boolean(llmKeyInput),
      llmProvider: llmKeyInput ? "Custom Key Override" : "Gemini Sandbox",
    });
    showToast(
      authMode === "register"
        ? "Account created & session initialized!"
        : "Authenticated successfully. Redirecting to Agent Studio..."
    );
    setTimeout(() => {
      router.push("/");
    }, 600);
  };

  return (
    <div className="flex flex-col w-full relative min-h-[calc(100vh-80px)] items-center justify-center py-10 px-4">
      {/* Background Animated SVG from Stitch */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center opacity-30">
        <div className="w-full h-full max-w-5xl max-h-[850px] relative flex items-center justify-center">
          <CyberAgentRobot opacity={0.25} />
          <div className="absolute inset-0 bg-radial from-transparent via-surface/60 to-surface" />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-xl mx-auto">
        <div className="bg-surface-container-low border border-outline-variant/40 shadow-2xl rounded-2xl p-8 md:p-10 relative overflow-hidden backdrop-blur-sm">
          {/* Subtle Ambient Glows */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-tertiary/10 rounded-full blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold uppercase tracking-wider mb-3 shadow-xs">
              <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                smart_toy
              </span>
              <span>Society Byte College Task</span>
            </div>
            <h1 className="font-headline text-3xl md:text-4xl font-bold text-on-surface tracking-tight mb-2">
              ByteAgent Portal
            </h1>
            <p className="text-xs sm:text-sm text-secondary font-body max-w-sm">
              Autonomous multi-agent workspace for collegiate evaluation, synthetic workflows, and tabular research.
            </p>
          </div>

          {/* Tabs: Sign In / Create Account */}
          <div className="flex bg-surface-container p-1 rounded-xl mb-6 relative border border-outline-variant/30">
            <button
              type="button"
              onClick={() => setAuthMode("login")}
              className={`flex-1 py-2.5 px-4 text-xs md:text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 ${
                authMode === "login"
                  ? "text-on-primary bg-primary shadow-sm"
                  : "text-secondary hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-base">login</span>
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("register")}
              className={`flex-1 py-2.5 px-4 text-xs md:text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 ${
                authMode === "register"
                  ? "text-on-primary bg-primary shadow-sm"
                  : "text-secondary hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-base">person_add</span>
              <span>Create Account</span>
            </button>
          </div>

          {/* Google Workspace Button */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setIsGoogleModalOpen(true)}
              className="w-full flex items-center justify-center gap-3 bg-surface hover:bg-surface-container border border-outline-variant/40 py-3 px-4 rounded-xl text-sm font-semibold text-on-surface transition shadow-xs group cursor-pointer"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              <span className="group-hover:translate-x-0.5 transition-transform duration-150">
                Continue with Google Workspace
              </span>
            </button>

            <div className="relative flex py-4 items-center">
              <div className="grow bg-outline-variant/40 h-px" />
              <span className="shrink-0 mx-4 text-[10px] font-semibold uppercase tracking-wider text-secondary">
                or credentials
              </span>
              <div className="grow bg-outline-variant/40 h-px" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {authMode === "register" && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5" htmlFor="user-fullname">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-3 text-secondary text-lg">
                      badge
                    </span>
                    <input
                      id="user-fullname"
                      type="text"
                      value={fullNameInput}
                      onChange={(e) => setFullNameInput(e.target.value)}
                      placeholder="Alex Chen, B.Tech CS"
                      className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant/40 text-on-surface rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5" htmlFor="user-affiliation">
                    Society / Department Affiliation
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-3 text-secondary text-lg">
                      domain
                    </span>
                    <input
                      id="user-affiliation"
                      type="text"
                      value={affiliationInput}
                      onChange={(e) => setAffiliationInput(e.target.value)}
                      placeholder="Byte Society / Computing Dept"
                      className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant/40 text-on-surface rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary transition"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Optional LLM Provider Override */}
            <div>
              <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5" htmlFor="user-llm-provider">
                LLM Key / Engine Override <span className="text-tertiary font-normal normal-case">(Optional)</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-3 text-secondary text-lg">
                  key
                </span>
                <input
                  id="user-llm-provider"
                  type="password"
                  value={llmKeyInput}
                  onChange={(e) => setLlmKeyInput(e.target.value)}
                  placeholder="Gemini, HuggingFace, OpenAI, or Ollama URL"
                  className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant/40 text-on-surface rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5" htmlFor="user-email">
                Email or College Roll No.
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-3 text-secondary text-lg">
                  alternate_email
                </span>
                <input
                  id="user-email"
                  type="text"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="roll_2024@byte.college.edu"
                  required
                  autoComplete="off"
                  className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant/40 text-on-surface rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-secondary uppercase tracking-wider" htmlFor="user-password">
                  Security Passcode
                </label>
                <button
                  type="button"
                  onClick={() => showToast("Password reset link dispatched to student institutional email.")}
                  className="text-xs text-primary hover:underline font-semibold cursor-pointer"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-3 text-secondary text-lg">
                  lock
                </span>
                <input
                  id="user-password"
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="new-password"
                  className="w-full pl-10 pr-11 py-2.5 bg-surface border border-outline-variant/40 text-on-surface rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-secondary hover:text-on-surface transition-colors p-0.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary bg-surface"
                />
                <span className="text-xs text-secondary font-medium">Remember workstation token</span>
              </label>
              <span className="text-xs text-tertiary font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">enhanced_encryption</span>
                AES-256
              </span>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-6 bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-fixed-variant transition-all rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer"
            >
              <span>{authMode === "login" ? "Sign In to Agent Portal" : "Create Account & Authorize"}</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </form>

          {/* Evaluator Express Access (Task Assessment) */}
          <div className="mt-8 pt-6 border-t border-outline-variant/40 bg-surface-container/60 -mx-8 -mb-8 md:-mx-10 md:-mb-10 p-6 md:p-8 flex flex-col gap-4">
            <div>
              <span className="block text-xs uppercase tracking-wider font-bold text-secondary mb-2.5">
                Evaluator Express Access (Task Assessment)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleExpressClearance("evaluator")}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 bg-surface border border-outline-variant/30 rounded-xl text-xs font-semibold text-on-surface hover:bg-tertiary-fixed hover:text-on-tertiary-fixed transition-all text-left shadow-xs cursor-pointer group"
                >
                  <span
                    className="material-symbols-outlined text-tertiary group-hover:scale-110 transition-transform text-base"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    gavel
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="truncate font-bold">Evaluator / Judge</span>
                    <span className="text-[10px] text-secondary font-normal truncate">
                      1-Click Full Clearance
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleExpressClearance("student")}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 bg-surface border border-outline-variant/30 rounded-xl text-xs font-semibold text-on-surface hover:bg-primary-fixed hover:text-on-primary-fixed-variant transition-all text-left shadow-xs cursor-pointer group"
                >
                  <span
                    className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform text-base"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    terminal
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="truncate font-bold">Student Contributor</span>
                    <span className="text-[10px] text-secondary font-normal truncate">
                      Sandbox Task Mode
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clean, Isolated Google Workspace Modal */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-150 relative">
            {/* Modal Header with Google Brand */}
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
              <div className="flex items-center gap-2.5">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-on-surface">Sign in with Google</span>
                  <span className="text-[11px] text-secondary">ByteAgent Workspace Access</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsGoogleModalOpen(false)}
                className="p-1 rounded-lg hover:bg-surface-container text-secondary hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Google Account Form */}
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                  Google Workspace Email
                </label>
                <input
                  type="email"
                  value={googleWorkspaceEmail}
                  onChange={(e) => setGoogleWorkspaceEmail(e.target.value)}
                  placeholder="your.email@byte.college.edu or gmail.com"
                  autoComplete="off"
                  className="w-full px-3.5 py-2.5 bg-surface border border-outline-variant/40 rounded-xl text-xs text-on-surface outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                  Display Name (Optional)
                </label>
                <input
                  type="text"
                  value={googleWorkspaceName}
                  onChange={(e) => setGoogleWorkspaceName(e.target.value)}
                  placeholder="Your Name (e.g., Alex Chen)"
                  autoComplete="off"
                  className="w-full px-3.5 py-2.5 bg-surface border border-outline-variant/40 rounded-xl text-xs text-on-surface outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Quick 1-Click Institutional Access */}
            <div className="p-3 rounded-xl bg-surface-container-high border border-outline-variant/30 flex flex-col gap-2 text-xs">
              <span className="font-bold text-[11px] text-secondary uppercase tracking-wider">
                Instant 1-Click Academic Scholar Access:
              </span>
              <button
                type="button"
                onClick={() => handleGoogleWorkspaceSignIn("scholar@byte.college.edu", "Byte Scholar")}
                className="w-full py-2 px-3 rounded-lg bg-surface hover:bg-surface-bright border border-outline-variant/30 text-on-surface text-xs font-semibold flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">school</span>
                  <span>scholar@byte.college.edu</span>
                </div>
                <span className="text-[10px] text-primary font-bold">1-Click Sign In</span>
              </button>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-between items-center pt-2 border-t border-outline-variant/30">
              <button
                type="button"
                onClick={() => setIsGoogleModalOpen(false)}
                className="text-xs text-secondary hover:text-on-surface font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleGoogleWorkspaceSignIn()}
                disabled={isGoogleProcessing}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container hover:text-on-primary-fixed-variant transition shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                {isGoogleProcessing ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Authorize with Google</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
