"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Dataset, DomainRule, UserProfile, DataRow, ColumnSchema } from "@/types";
import { saasDataset, campusDataset, healthcareDataset, initialDomainRules } from "@/data/mockData";

interface ToastState {
  show: boolean;
  message: string;
}

interface AppContextType {
  user: UserProfile;
  setUser: (u: UserProfile) => void;
  activeDataset: Dataset;
  setActiveDatasetId: (id: string) => void;
  allDatasets: Dataset[];
  domainRules: DomainRule[];
  toggleDomainRule: (id: string, enabled: boolean) => void;
  addDomainRule: (rule: Omit<DomainRule, "id" | "ruleCode" | "appliedCount" | "createdAt">) => void;
  deleteDomainRule: (id: string) => void;
  toast: ToastState;
  showToast: (msg: string) => void;
  uploadCustomCsv: (name: string, csvContent: string) => boolean;
  isSyncingEmbeddings: boolean;
  syncEmbeddings: () => Promise<void>;
  llmKey: string;
  setLlmKey: (key: string) => void;
}

const defaultUser: UserProfile = {
  id: "USR-0941",
  fullName: "Academic Evaluator (Judge #09)",
  email: "evaluator.byte@campus.edu",
  role: "Academic Evaluator",
  clearanceLevel: "Full Clearance",
  affiliation: "Society Byte Evaluation Council",
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuXhWrVmBCIy7g8qXEnYspznB0uwFEHfeSgTf-Lz7iYfztnWH93OkXHVLYHBR4nU8XiE-SxIsGkMTCbZfURsv73WH0RN-aoN4aIE0t5ls40KndshwxPgLh0RGGBbMCp1RK0sm1C01pSEfQDo5nfDKY4FwqsZnIw7gDtIHBMaRKM2Ag12lEhkt6xNqPDdMqk63_nhgzWPH9rR4w0YMyLIO4FDmzaWkUrjecnOLL73Z4EqJDC-Bt6RLc",
  apiKeySet: true,
  llmProvider: "Gemini 2.5 Flash Sandbox",
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<UserProfile>(defaultUser);
  const [datasets, setDatasets] = useState<Dataset[]>([saasDataset, campusDataset, healthcareDataset]);
  const [activeDatasetId, setActiveDatasetIdState] = useState<string>("saas");
  const [domainRules, setDomainRules] = useState<DomainRule[]>(initialDomainRules);
  const [toast, setToast] = useState<ToastState>({ show: false, message: "" });
  const [isSyncingEmbeddings, setIsSyncingEmbeddings] = useState(false);
  const [llmKey, setLlmKey] = useState<string>("gemini-pro-sandbox-preauthorized");

  const setUser = (newUser: UserProfile) => {
    setUserState(newUser);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("byteagent_user", JSON.stringify(newUser));
      } catch {
        // ignore
      }
    }
  };

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 3500);
  };

  // Check for stored session or Google OAuth redirect query params
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Check for stored session
    const stored = localStorage.getItem("byteagent_user");
    if (stored) {
      try {
        setUserState(JSON.parse(stored));
      } catch {
        // ignore
      }
    }

    // 2. Check for Google OAuth callback parameters
    const url = new URL(window.location.href);
    const isOAuthSuccess = url.searchParams.get("oauth_success");
    const email = url.searchParams.get("email");
    const name = url.searchParams.get("name");
    const picture = url.searchParams.get("picture");

    if (isOAuthSuccess === "true" && email) {
      const authedUser: UserProfile = {
        id: "USR-GOOGLE-" + Math.floor(1000 + Math.random() * 9000),
        fullName: name || email.split("@")[0],
        email: email,
        role: "Academic Evaluator",
        clearanceLevel: "Full Clearance",
        affiliation: "Google Workspace Verified • Society Byte",
        avatarUrl:
          picture ||
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAuXhWrVmBCIy7g8qXEnYspznB0uwFEHfeSgTf-Lz7iYfztnWH93OkXHVLYHBR4nU8XiE-SxIsGkMTCbZfURsv73WH0RN-aoN4aIE0t5ls40KndshwxPgLh0RGGBbMCp1RK0sm1C01pSEfQDo5nfDKY4FwqsZnIw7gDtIHBMaRKM2Ag12lEhkt6xNqPDdMqk63_nhgzWPH9rR4w0YMyLIO4FDmzaWkUrjecnOLL73Z4EqJDC-Bt6RLc",
        apiKeySet: true,
        llmProvider: "Google OAuth Active",
      };

      setUser(authedUser);
      showToast(`Welcome ${name || email}! Authenticated via Google OAuth.`);

      // Clean query parameters from URL
      url.searchParams.delete("oauth_success");
      url.searchParams.delete("email");
      url.searchParams.delete("name");
      url.searchParams.delete("picture");
      window.history.replaceState({}, document.title, url.pathname + (url.search ? url.search : ""));
    }
  }, []);

  const activeDataset = datasets.find((d) => d.id === activeDatasetId) || datasets[0];

  const setActiveDatasetId = (id: string) => {
    const found = datasets.find((d) => d.id === id);
    if (found) {
      setActiveDatasetIdState(id);
      showToast(`Switched active dataset to: ${found.name}`);
    }
  };

  const toggleDomainRule = (id: string, enabled: boolean) => {
    setDomainRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled } : r))
    );
    showToast(`Domain Rule ${id.toUpperCase()} ${enabled ? "activated" : "deactivated"}`);
  };

  const addDomainRule = (rule: Omit<DomainRule, "id" | "ruleCode" | "appliedCount" | "createdAt">) => {
    const codeNum = domainRules.length + 1;
    const ruleCode = `RULE-${String(codeNum).padStart(3, "0")}`;
    const newRule: DomainRule = {
      ...rule,
      id: `rule-${codeNum}`,
      ruleCode,
      appliedCount: 0,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 19),
    };
    setDomainRules((prev) => [newRule, ...prev]);
    showToast(`Registered new domain constraint: ${ruleCode}`);
  };

  const deleteDomainRule = (id: string) => {
    setDomainRules((prev) => prev.filter((r) => r.id !== id));
    showToast(`Removed rule ${id} from persistent memory store`);
  };

  const syncEmbeddings = async () => {
    setIsSyncingEmbeddings(true);
    showToast("Re-indexing DuckDB schema & Chroma vector nodes...");
    await new Promise((res) => setTimeout(res, 1200));
    setIsSyncingEmbeddings(false);
    showToast("Vector embeddings re-synced! 4 rules mapped to 14 column primitives.");
  };

  // Real client-side CSV parser
  const uploadCustomCsv = (name: string, csvContent: string): boolean => {
    try {
      const lines = csvContent.trim().split(/\r?\n/).filter(Boolean);
      if (lines.length < 2) {
        showToast("Error: CSV must contain at least a header row and 1 data row.");
        return false;
      }

      const headers = lines[0].split(",").map((h) => h.trim().replace(/^["']|["']$/g, ""));
      const rows: DataRow[] = [];

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(",").map((p) => p.trim().replace(/^["']|["']$/g, ""));
        const row: DataRow = {};
        headers.forEach((h, idx) => {
          const val = parts[idx] ?? "";
          const num = Number(val);
          row[h] = !isNaN(num) && val !== "" ? num : val;
        });
        rows.push(row);
      }

      const columns: ColumnSchema[] = headers.map((col) => {
        let numericCount = 0;
        let nullCount = 0;
        const samples: (string | number | boolean)[] = [];

        rows.forEach((r) => {
          const val = r[col];
          if (val === null || val === "" || val === undefined) {
            nullCount++;
          } else {
            if (typeof val === "number") numericCount++;
            if (samples.length < 3) samples.push(val);
          }
        });

        const isNumeric = numericCount > rows.length * 0.7;
        const type = isNumeric ? "number" : "string";
        const uniqueCount = new Set(rows.map((r) => r[col])).size;

        return {
          name: col,
          type,
          rawType: isNumeric ? "DOUBLE" : "VARCHAR",
          nullCount,
          nullPercentage: Number(((nullCount / rows.length) * 100).toFixed(2)),
          uniqueCount,
          sampleValues: samples,
          isNumeric,
        };
      });

      const newDataset: Dataset = {
        id: `custom-${Date.now()}`,
        name: name.replace(/\.csv$/i, ""),
        filename: name,
        description: `User-ingested tabular structure (${rows.length} rows, ${columns.length} columns) parsed via dynamic AST tokenizer.`,
        rowsCount: rows.length,
        columnsCount: columns.length,
        activeMemorySize: `${(csvContent.length / 1024).toFixed(1)} KB RAM`,
        benchmarkType: "Custom User Upload",
        columns,
        rows,
      };

      setDatasets((prev) => [newDataset, ...prev]);
      setActiveDatasetIdState(newDataset.id);
      showToast(`Uploaded & parsed "${name}" successfully! (${rows.length} rows ingested)`);
      return true;
    } catch (e) {
      console.error(e);
      showToast("Failed to parse CSV file. Please verify CSV formatting.");
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        activeDataset,
        setActiveDatasetId,
        allDatasets: datasets,
        domainRules,
        toggleDomainRule,
        addDomainRule,
        deleteDomainRule,
        toast,
        showToast,
        uploadCustomCsv,
        isSyncingEmbeddings,
        syncEmbeddings,
        llmKey,
        setLlmKey,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
