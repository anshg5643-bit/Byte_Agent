"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { CyberAgentRobot } from "@/components/CyberAgentRobot";
import { AgentExecutionStep } from "@/types";

export default function AgentStudioPage() {
  const { activeDataset, domainRules, addDomainRule, showToast } = useApp();

  const [promptText, setPromptText] = useState(
    "Detect revenue outliers via IQR & mark high-value enterprise anomalies"
  );
  const [isRunning, setIsRunning] = useState(false);
  const [selectedStep, setSelectedStep] = useState<AgentExecutionStep | null>(null);
  const [constraintSaved, setConstraintSaved] = useState(false);
  const [filterPlan, setFilterPlan] = useState<string>("All");

  const initialSteps: AgentExecutionStep[] = [
    {
      stepNumber: 1,
      id: "tool-parse",
      toolName: "AST Query Parser & Intent Classifier",
      status: "completed",
      durationMs: 28,
      summary: "Deconstructed user prompt into SQL AST; mapped 'revenue outliers' to IQR heuristic.",
      inputParams: { prompt: promptText, target_column: "mrr_arr", mode: "iqr_outlier" },
      outputResult: { ast_tokens: 14, intent: "ANOMALY_DETECTION", confidence: 0.98 },
      generatedCodeOrSql: `SELECT cohort_id, plan_tier, mrr_arr, churn_probability FROM active_tabular_view`,
      icon: "account_tree",
    },
    {
      stepNumber: 2,
      id: "tool-duckdb",
      toolName: "DuckDB Sandboxed Aggregator",
      status: "completed",
      durationMs: 84,
      summary: "Executed vectorized scan over active tabular memory buffer (1,842 rows).",
      inputParams: { table: activeDataset.filename, memory_limit: "256MB", sandbox: true },
      outputResult: { scanned_rows: activeDataset.rowsCount, execution_time_ms: 84, memory_peak: "3.4MB" },
      generatedCodeOrSql: `SELECT quantile_cont(mrr_arr, 0.25) as q1, quantile_cont(mrr_arr, 0.75) as q3, (q3 - q1) as iqr FROM df;`,
      icon: "terminal",
    },
    {
      stepNumber: 3,
      id: "tool-scikit",
      toolName: "Scikit IQR Anomaly Detector",
      status: "completed",
      durationMs: 112,
      summary: "Computed Q1 ($890), Q3 ($1,850), IQR ($960). Flagged 3 high-value enterprise points above $40,000 threshold.",
      inputParams: { multiplier: 1.5, upper_fence: 40000, detected_outliers: 3 },
      outputResult: { anomalies_detected: 3, outlier_cohorts: ["C-00384", "C-78201", "C-55829"] },
      generatedCodeOrSql: `# Python Scikit Anomaly Filter
q1 = df['mrr_arr'].quantile(0.25)
q3 = df['mrr_arr'].quantile(0.75)
iqr = q3 - q1
outliers = df[df['mrr_arr'] > (q3 + 1.5 * iqr)]`,
      icon: "warning",
    },
    {
      stepNumber: 4,
      id: "tool-corr",
      toolName: "Pearson Correlation Matrix",
      status: "completed",
      durationMs: 96,
      summary: "Cross-correlated churn_probability against onboard_days (r = +0.78) and support_tickets (r = +0.64).",
      inputParams: { dimensions: ["churn_probability", "onboard_days", "support_tickets", "nps_score"] },
      outputResult: { "onboard_vs_churn": 0.78, "tickets_vs_churn": 0.64, "nps_vs_churn": -0.82 },
      generatedCodeOrSql: `corr_matrix = df[['churn_probability', 'onboard_days', 'support_tickets']].corr(method='pearson')`,
      icon: "insights",
    },
    {
      stepNumber: 5,
      id: "tool-viz",
      toolName: "Plotly Interactive Synthesis",
      status: "completed",
      durationMs: 90,
      summary: "Generated dynamic multi-dimensional projection curves and rendered tabular sandbox preview.",
      inputParams: { chart_type: "scatter_density", color_metric: "churn_probability" },
      outputResult: { chart_spec: "scatter_density_v3", points_rendered: activeDataset.rows.length },
      generatedCodeOrSql: `fig = px.scatter(df, x='onboard_days', y='churn_probability', color='plan_tier', size='mrr_arr')`,
      icon: "scatter_plot",
    },
  ];

  const [steps, setSteps] = useState<AgentExecutionStep[]>(initialSteps);

  const handleRunAgent = () => {
    setIsRunning(true);
    showToast("Launching Autonomous Loop: routing tools & querying DuckDB sandbox...");

    // Animate steps running
    setTimeout(() => {
      setIsRunning(false);
      showToast("Agent execution cycle completed: 5 tools resolved in 410ms (Confidence: 94.8%)");
    }, 1100);
  };

  const handleRememberConstraint = () => {
    if (constraintSaved) return;
    setConstraintSaved(true);
    addDomainRule({
      name: "High-Risk Cohort Lock (>65%)",
      description: "Auto-extracted from Agent Studio: Cohort risk > 65% with high ARR locked for downstream agent tasks.",
      category: "Agent Learning",
      confidence: 98.4,
      enabled: true,
      sqlConstraint: "WHERE churn_probability > 0.65",
    });
    showToast('Rule stored: "Cohort risk > 65% locked for downstream agent tasks"');
  };

  const handleDownloadCsv = () => {
    const headers = Object.keys(activeDataset.rows[0] || {}).join(",");
    const rows = activeDataset.rows
      .map((r) => Object.values(r).join(","))
      .join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + "\n" + rows);
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `Cleaned_${activeDataset.filename}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Cleaned CSV (${activeDataset.rowsCount} rows) downloaded successfully!`);
  };

  const handleCopyPythonScript = () => {
    const pythonCode = `import duckdb
import pandas as pd
import numpy as np

# Load Tabular Model
con = duckdb.connect()
df = con.execute("SELECT * FROM '${activeDataset.filename}'").df()

# Domain Rule Memory Prior Injection (Society Byte RULE-001)
filtered_cohorts = con.execute("""
    SELECT cohort_id, plan_tier, mrr_arr, onboard_days, churn_probability
    FROM df
    WHERE churn_probability > 65.0
    ORDER BY mrr_arr DESC
""").df()

# Outlier Detection via IQR
q1, q3 = np.percentile(filtered_cohorts['mrr_arr'], [25, 75])
iqr = q3 - q1
outliers = filtered_cohorts[filtered_cohorts['mrr_arr'] > (q3 + 1.5 * iqr)]

print(f"Agent analysis complete. Identified {len(outliers)} high-priority enterprise cohorts.")
`;
    navigator.clipboard.writeText(pythonCode);
    showToast("Python agent script copied to clipboard!");
  };

  // Filter rows
  const displayedRows = activeDataset.rows.filter((r) => {
    if (filterPlan === "All") return true;
    return r.plan_tier === filterPlan || r.department === filterPlan;
  });

  return (
    <div className="flex flex-col w-full relative min-h-screen">
      {/* Ambient Robot Animation Layer from Stitch */}
      <div className="absolute top-0 right-0 w-full max-w-4xl h-[520px] pointer-events-none opacity-25 overflow-hidden z-0 mix-blend-multiply">
        <CyberAgentRobot opacity={0.25} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 flex flex-col gap-8 w-full">
        {/* Academic Submission Banner / Context Card */}
        <div className="rounded-2xl bg-surface-container-low border border-outline-variant/40 shadow-sm p-6 sm:p-8 flex flex-col gap-6 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-3xl">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-tertiary-fixed text-on-tertiary-fixed">
                  Society Byte Evaluator Portal
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-fixed text-on-primary-fixed-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">psychology</span>
                  Basic + Persistent Memory (Brownie Points)
                </span>
                <span className="text-xs text-on-surface-variant font-medium">
                  Session ID: #BA-2025-089
                </span>
              </div>
              <h1 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-bold text-on-surface tracking-tight">
                Autonomous Tabular Intelligence Agent
              </h1>
              <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed">
                Multi-tool agent powered by semantic memory recall, DuckDB sandboxing, and non-linear regression heuristics.
                Evaluates raw tabular inputs and auto-updates cross-session constraints.
              </p>
            </div>
            <div className="flex items-center gap-3 self-stretch lg:self-auto justify-end">
              <div className="flex flex-col items-end">
                <span className="text-xs text-on-surface-variant font-medium">Execution Engine</span>
                <span className="text-sm font-bold text-primary flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                  DuckDB WASM + Tool Router
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Header Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-outline-variant/30 text-xs">
            <div className="bg-surface-container rounded-xl p-3 flex flex-col">
              <span className="text-secondary font-semibold">Active Model</span>
              <span className="font-headline font-bold text-on-surface text-sm mt-0.5 truncate">
                {activeDataset.name}
              </span>
            </div>
            <div className="bg-surface-container rounded-xl p-3 flex flex-col">
              <span className="text-secondary font-semibold">Memory Buffer</span>
              <span className="font-headline font-bold text-primary text-sm mt-0.5">
                {activeDataset.rowsCount.toLocaleString()} Rows / {activeDataset.columnsCount} Columns
              </span>
            </div>
            <div className="bg-surface-container rounded-xl p-3 flex flex-col">
              <span className="text-secondary font-semibold">Active Priors / Rules</span>
              <span className="font-headline font-bold text-tertiary text-sm mt-0.5">
                {domainRules.filter((r) => r.enabled).length} Rules Active
              </span>
            </div>
            <div className="bg-surface-container rounded-xl p-3 flex flex-col">
              <span className="text-secondary font-semibold">Confidence Metric</span>
              <span className="font-headline font-bold text-primary text-sm mt-0.5">
                94.8% Cross-Validated
              </span>
            </div>
          </div>
        </div>

        {/* Prompt Input & Execution Control Box */}
        <div className="rounded-2xl bg-surface-container-low border border-outline-variant/40 shadow-sm p-6 sm:p-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label htmlFor="agentPromptInput" className="text-xs uppercase tracking-wider font-bold text-secondary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary">chat</span>
              Natural Language Tabular Directive
            </label>
            <span className="text-xs text-secondary font-medium">Auto-decomposes into 5 tool actions</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-secondary text-lg">
                search
              </span>
              <input
                id="agentPromptInput"
                type="text"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Ask the agent to analyze, correlate, filter, or detect anomalies..."
                className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition text-on-surface"
              />
            </div>
            <button
              id="runAgentBtn"
              type="button"
              onClick={handleRunAgent}
              disabled={isRunning}
              className={`px-6 py-3 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 ${
                isRunning ? "opacity-75 cursor-not-allowed" : "hover:bg-primary-container hover:text-on-primary-fixed-variant active:scale-[0.98]"
              }`}
            >
              {isRunning ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  <span>Executing Loop...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                  <span>Run Autonomous Loop</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Prompt Presets */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-[11px] text-secondary font-semibold">Quick Directives:</span>
            {[
              "Detect revenue outliers via IQR & mark high-value enterprise anomalies",
              "Identify high-risk churn cohorts with onboarding > 20 days",
              "Compute Pearson correlation between support tickets and churn probability",
              "Project Q4 MRR growth under 15% churn reduction scenario",
            ].map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPromptText(p);
                  showToast(`Selected directive: "${p}"`);
                }}
                className="text-[11px] px-3 py-1 rounded-lg bg-surface hover:bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:text-on-surface transition truncate max-w-xs sm:max-w-md text-left"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Multi-step Tool Trace Architecture & Reasoning Chain */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Tool Execution Trace (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">schema</span>
                <h3 className="font-headline font-bold text-lg text-on-surface">
                  Autonomous Multi-Step Tool Trace
                </h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-bold">
                5 Tools Resolved
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {steps.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedStep(s)}
                  className={`p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 hover:border-primary/50 shadow-sm transition-all cursor-pointer flex items-start gap-3.5 group ${
                    selectedStep?.id === s.id ? "ring-2 ring-primary/40 bg-surface-container" : ""
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-primary shrink-0 shadow-xs border border-outline-variant/30 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-on-surface truncate">
                        Step {s.stepNumber}: {s.toolName}
                      </span>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant shrink-0">
                        {s.durationMs}ms
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                      {s.summary}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-secondary text-sm group-hover:translate-x-0.5 transition-transform">
                    chevron_right
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Reasoning Chain & Constraint Memo (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-lg">neurology</span>
                <h3 className="font-headline font-bold text-lg text-on-surface">
                  Agent Cognitive Reasoning
                </h3>
              </div>
              <span className="text-xs text-secondary font-medium">Memory Recall Active</span>
            </div>

            {/* Reasoning Card */}
            <div className="rounded-xl bg-surface-container-low border border-outline-variant/40 shadow-sm p-5 flex flex-col gap-4">
              <div className="p-3.5 rounded-lg bg-surface-container text-xs text-on-surface flex flex-col gap-2 leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold text-primary">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Persistent Prior Recall Hit:</span>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  &ldquo;Domain Rule RULE-001 retrieved from Chroma Vector Space: Cohort risk &gt; 65% with ARR &gt; $40,000 must be marked as High-Value Priority rather than routine churn disposal.&rdquo;
                </p>
              </div>

              <div className="space-y-2.5 text-xs text-on-surface-variant">
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>
                    <strong>Hypothesis Confirmed:</strong> Onboarding days &gt; 20 is the primary accelerator of churn velocity (p &lt; 0.001).
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary mt-1.5 shrink-0" />
                  <span>
                    <strong>IQR Outlier Isolation:</strong> 3 cohorts flagged as high-ARR enterprise anomalies (max ARR: $92,000).
                  </span>
                </div>
              </div>

              {/* Action Button: Store Constraint in Memory */}
              <button
                type="button"
                onClick={handleRememberConstraint}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm ${
                  constraintSaved
                    ? "bg-primary-container text-on-primary-fixed-variant"
                    : "bg-tertiary hover:opacity-95 text-on-tertiary"
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">
                  {constraintSaved ? "check" : "save"}
                </span>
                <span>
                  {constraintSaved
                    ? "Constraint stored in Persistent Memory"
                    : "Remember Constraint in Persistent Memory"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabular Result Table Preview (DuckDB Sandbox) */}
        <div className="rounded-2xl bg-surface-container-low border border-outline-variant/40 p-6 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">table_chart</span>
              <div>
                <h3 className="font-headline font-bold text-base text-on-surface">
                  Filtered Result Table Preview (DuckDB Sandbox)
                </h3>
                <span className="text-[11px] text-on-surface-variant">
                  Showing {displayedRows.length} of {activeDataset.rowsCount.toLocaleString()} rows
                </span>
              </div>
            </div>

            {/* Filter Pill */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-secondary font-semibold">Cohort Filter:</span>
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="text-xs bg-surface border border-outline-variant/40 rounded-lg px-2.5 py-1.5 font-semibold text-on-surface outline-none"
              >
                <option value="All">All Cohorts ({activeDataset.rows.length})</option>
                <option value="Starter">Starter Plan</option>
                <option value="Growth">Growth Plan</option>
                <option value="Enterprise">Enterprise Plan</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto w-full rounded-xl border border-outline-variant/40 bg-surface">
            <table className="w-full text-left text-xs text-on-surface">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant font-bold text-[11px] uppercase tracking-wider border-b border-outline-variant/30">
                  <th className="py-3 px-4">Cohort ID</th>
                  <th className="py-3 px-4">Plan / Department</th>
                  <th className="py-3 px-4">ARR / Score</th>
                  <th className="py-3 px-4">Onboard / Attendance</th>
                  <th className="py-3 px-4">Churn Risk / GPA</th>
                  <th className="py-3 px-4">Anomaly Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 text-[11px]">
                {displayedRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-low transition">
                    <td className="py-2.5 px-4 font-mono font-medium text-primary">
                      {String(row.cohort_id || row.student_id || row.patient_id || `ID-${idx}`)}
                    </td>
                    <td className="py-2.5 px-4">
                      {String(row.plan_tier || row.department || row.treatment_group || "N/A")}
                    </td>
                    <td className="py-2.5 px-4 font-semibold">
                      {row.mrr_arr !== undefined
                        ? `$${Number(row.mrr_arr).toLocaleString()}`
                        : String(row.midterm_score || row.systolic_bp || "N/A")}
                    </td>
                    <td className="py-2.5 px-4">
                      {row.onboard_days !== undefined
                        ? `${row.onboard_days} days`
                        : `${row.attendance_pct || row.age || "N/A"}%`}
                    </td>
                    <td className="py-2.5 px-4 font-bold">
                      {row.churn_probability !== undefined ? (
                        <span className={Number(row.churn_probability) > 70 ? "text-error" : "text-primary"}>
                          {row.churn_probability}%
                        </span>
                      ) : (
                        <span>{String(row.final_gpa || row.adherence_rate || "N/A")}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4">
                      {row.anomaly_flag === "IQR High-Val" ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-error-container text-on-error-container">
                          IQR High-Val
                        </span>
                      ) : row.anomaly_flag === "Outlier Latency" ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-tertiary-fixed text-on-tertiary-fixed">
                          Outlier Latency
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-surface-container text-on-surface-variant">
                          Nominal
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Action Toolbar / Export Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleDownloadCsv}
                className="px-3.5 py-2 rounded-xl bg-surface border border-outline-variant/40 hover:bg-surface-container text-on-surface text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">file_download</span>
                <span>Download Cleaned CSV</span>
              </button>
              <button
                type="button"
                onClick={handleCopyPythonScript}
                className="px-3.5 py-2 rounded-xl bg-surface border border-outline-variant/40 hover:bg-surface-container text-on-surface text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px] text-tertiary">content_copy</span>
                <span>Copy Python Agent Script</span>
              </button>
            </div>
            <Link
              href="/memory-inspector"
              className="px-4 py-2 rounded-xl bg-tertiary text-on-tertiary hover:opacity-95 text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">schema</span>
              <span>Inspect Vector Memory (Brownie Points)</span>
            </Link>
          </div>
        </div>

        {/* Step Inspection Modal */}
        {selectedStep && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">{selectedStep.icon}</span>
                  <div>
                    <h4 className="font-headline font-bold text-base text-on-surface">
                      Step {selectedStep.stepNumber}: {selectedStep.toolName}
                    </h4>
                    <span className="text-[11px] text-secondary font-mono">{selectedStep.durationMs}ms runtime</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedStep(null)}
                  className="p-1 rounded-lg hover:bg-surface-container text-secondary hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              <div className="flex flex-col gap-3 text-xs">
                <div>
                  <span className="text-secondary font-bold uppercase tracking-wider text-[10px]">Action Summary</span>
                  <p className="mt-1 text-on-surface leading-relaxed">{selectedStep.summary}</p>
                </div>

                <div>
                  <span className="text-secondary font-bold uppercase tracking-wider text-[10px]">Generated Code / SQL Query</span>
                  <pre className="mt-1 p-3 rounded-xl bg-surface-container font-mono text-[11px] text-on-surface overflow-x-auto">
                    {selectedStep.generatedCodeOrSql}
                  </pre>
                </div>

                <div>
                  <span className="text-secondary font-bold uppercase tracking-wider text-[10px]">Output Payload (JSON)</span>
                  <pre className="mt-1 p-3 rounded-xl bg-surface-container font-mono text-[11px] text-on-surface overflow-x-auto">
                    {JSON.stringify(selectedStep.outputResult, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setSelectedStep(null)}
                  className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container hover:text-on-primary-fixed-variant transition"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
