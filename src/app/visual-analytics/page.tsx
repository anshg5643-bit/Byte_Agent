"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { CyberAgentRobot } from "@/components/CyberAgentRobot";

type ChartType = "line" | "bar" | "heatmap" | "scatter" | "radar";

export default function VisualAnalyticsPage() {
  const { activeDataset, showToast } = useApp();

  const [activeChart, setActiveChart] = useState<ChartType>("line");
  const [selectedCohort, setSelectedCohort] = useState<string>("All Cohorts");
  const [selectedMetric, setSelectedMetric] = useState<string>("Net Retention");
  const [excludeHighChurn, setExcludeHighChurn] = useState(false);
  const [isGeneratingAiSummary, setIsGeneratingAiSummary] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(
    "Autonomous telemetry confirms high sensitivity to onboarding delay. Across all tiers, customer cohorts onboarding beyond 20 days encounter a 3.2x churn velocity multiplier. Enterprise tier exhibits 91.4% retention resiliency."
  );

  const handleGenerateAiExplanation = () => {
    setIsGeneratingAiSummary(true);
    showToast("AI Agent synthesizing natural language insights from active tabular parameters...");
    setTimeout(() => {
      setIsGeneratingAiSummary(false);
      setAiSummary(
        `Dynamic Analysis for ${selectedCohort} (${selectedMetric}):\n` +
          `• Regression Slope: β = +0.78 between onboarding latency and churn probability.\n` +
          `• Anomaly Flag: Enterprise cohorts (e.g. C-00384, C-78201) generate 78% of total ARR with minimal ticket load.\n` +
          `• Recommendation: Applying Rule RULE-001 locks high-value accounts into priority outreach, mitigating $124,000 in projected Q4 revenue loss.`
      );
      showToast("Natural language explanation generated successfully!");
    }, 900);
  };

  // Mock time-series projection points
  const projectionPoints = [
    { month: "Jan", actual: 42, projected: 42, churn: 18 },
    { month: "Feb", actual: 48, projected: 49, churn: 17 },
    { month: "Mar", actual: 55, projected: 54, churn: 16 },
    { month: "Apr", actual: 61, projected: 63, churn: 14 },
    { month: "May", actual: 68, projected: 70, churn: 15 },
    { month: "Jun", actual: 75, projected: 78, churn: 13 },
    { month: "Jul", actual: null, projected: 86, churn: 12 },
    { month: "Aug", actual: null, projected: 94, churn: 11 },
    { month: "Sep", actual: null, projected: 104, churn: 10 },
  ];

  // Correlation Matrix
  const corrFeatures = ["Churn Prob", "Onboard Days", "Tickets", "NPS Score", "MRR ARR"];
  const corrValues = [
    [1.0, 0.78, 0.64, -0.82, -0.42],
    [0.78, 1.0, 0.52, -0.68, -0.31],
    [0.64, 0.52, 1.0, -0.45, -0.18],
    [-0.82, -0.68, -0.45, 1.0, 0.58],
    [-0.42, -0.31, -0.18, 0.58, 1.0],
  ];

  return (
    <div className="flex flex-col w-full relative min-h-screen">
      {/* Ambient Robot Layer */}
      <div className="absolute top-0 right-0 w-full max-w-4xl h-[460px] pointer-events-none opacity-20 overflow-hidden z-0 mix-blend-multiply">
        <CyberAgentRobot opacity={0.2} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 py-10 flex flex-col gap-8">
        {/* Top Header & Telemetry Badges */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
              <span>Tabular Intelligence Sandbox • Telemetry Engine v3.1</span>
            </div>
            <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold text-on-surface tracking-tight leading-tight">
              Autonomous Visualizations &amp; Metric Synthesis
            </h1>
            <p className="font-body text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Real-time dynamic synthesis generated directly from active tabular models, cross-correlated with automated agent anomaly sweeps and predictive regression pipelines.
            </p>
          </div>

          {/* Telemetry Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-surface-container rounded-xl px-4 py-3 shadow-xs border border-outline-variant/30 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">insights</span>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
                  Agent Confidence
                </span>
                <span className="font-headline font-bold text-lg text-on-surface">94.8%</span>
              </div>
            </div>

            <div className="bg-surface-container rounded-xl px-4 py-3 shadow-xs border border-outline-variant/30 flex items-center gap-3">
              <span className="material-symbols-outlined text-tertiary text-2xl">bubble_chart</span>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
                  Outliers Flagged
                </span>
                <span className="font-headline font-bold text-lg text-error">3 / {activeDataset.rowsCount}</span>
              </div>
            </div>

            <div className="bg-surface-container rounded-xl px-4 py-3 shadow-xs border border-outline-variant/30 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">autorenew</span>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
                  Refresh Cadence
                </span>
                <span className="font-headline font-bold text-lg text-on-surface">30s Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Customizer Control Ribbon */}
        <div className="bg-surface-container-high border border-outline-variant/40 rounded-2xl p-5 shadow-sm flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-primary">tune</span>
              Pivot Dimensions:
            </span>

            {/* Cohort Selector Button */}
            <button
              type="button"
              onClick={() => {
                const cohorts = ["All Cohorts", "Enterprise Tier", "Growth Tier", "Starter Tier"];
                const next = cohorts[(cohorts.indexOf(selectedCohort) + 1) % cohorts.length];
                setSelectedCohort(next);
                showToast(`Pivoted dimension: Cohort = ${next}`);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-surface border border-outline-variant/40 text-on-surface font-semibold text-xs shadow-xs hover:bg-surface-bright transition flex items-center gap-1.5 cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>Cohort: {selectedCohort}</span>
            </button>

            {/* Target Metric Button */}
            <button
              type="button"
              onClick={() => {
                const metrics = ["Net Retention", "MRR Velocity", "Churn Probability", "NPS Quality"];
                const next = metrics[(metrics.indexOf(selectedMetric) + 1) % metrics.length];
                setSelectedMetric(next);
                showToast(`Pivoted dimension: Target = ${next}`);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-surface border border-outline-variant/40 text-on-surface font-semibold text-xs shadow-xs hover:bg-surface-bright transition flex items-center gap-1.5 cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-tertiary" />
              <span>Target: {selectedMetric}</span>
            </button>

            {/* Exclude High Churn Filter */}
            <button
              type="button"
              onClick={() => {
                setExcludeHighChurn(!excludeHighChurn);
                showToast(excludeHighChurn ? "Filter reset: Showing all rows" : "Filter applied: Excluded Churn > 80%");
              }}
              className={`px-3.5 py-1.5 rounded-xl border border-outline-variant/40 font-semibold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer ${
                excludeHighChurn ? "bg-primary text-on-primary" : "bg-surface text-on-surface hover:bg-surface-bright"
              }`}
            >
              <span className="material-symbols-outlined text-xs">filter_list</span>
              <span>Exclude Churn &gt; 80%</span>
            </button>
          </div>

          {/* Chart Types & Agent Trigger */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-surface border border-outline-variant/40 p-1 rounded-xl shadow-xs">
              <button
                type="button"
                onClick={() => setActiveChart("line")}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  activeChart === "line" ? "bg-primary text-on-primary shadow-xs" : "text-on-surface-variant hover:text-on-surface"
                }`}
                title="Area / Line View"
              >
                <span className="material-symbols-outlined text-[18px]">show_chart</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveChart("bar")}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  activeChart === "bar" ? "bg-primary text-on-primary shadow-xs" : "text-on-surface-variant hover:text-on-surface"
                }`}
                title="Segmented Bars"
              >
                <span className="material-symbols-outlined text-[18px]">bar_chart</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveChart("heatmap")}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  activeChart === "heatmap" ? "bg-primary text-on-primary shadow-xs" : "text-on-surface-variant hover:text-on-surface"
                }`}
                title="Correlation Matrix"
              >
                <span className="material-symbols-outlined text-[18px]">grid_view</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveChart("scatter")}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  activeChart === "scatter" ? "bg-primary text-on-primary shadow-xs" : "text-on-surface-variant hover:text-on-surface"
                }`}
                title="Anomaly Scatter"
              >
                <span className="material-symbols-outlined text-[18px]">scatter_plot</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveChart("radar")}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  activeChart === "radar" ? "bg-primary text-on-primary shadow-xs" : "text-on-surface-variant hover:text-on-surface"
                }`}
                title="Radar Breakdown"
              >
                <span className="material-symbols-outlined text-[18px]">radar</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleGenerateAiExplanation}
              disabled={isGeneratingAiSummary}
              className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span className={`material-symbols-outlined text-base ${isGeneratingAiSummary ? "animate-spin" : "group-hover:rotate-12"} transition-transform`}>
                {isGeneratingAiSummary ? "progress_activity" : "smart_toy"}
              </span>
              <span>{isGeneratingAiSummary ? "Synthesizing..." : "Generate Natural Language Explanation"}</span>
            </button>
          </div>
        </div>

        {/* AI Explanation Banner */}
        {aiSummary && (
          <div className="rounded-2xl bg-surface-container-low border border-primary/30 p-5 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-fixed-variant flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-xs uppercase font-bold text-primary tracking-wider">
                Agent Synthesized Natural Language Insight
              </span>
              <p className="text-xs text-on-surface whitespace-pre-line mt-1 leading-relaxed">
                {aiSummary}
              </p>
            </div>
          </div>
        )}

        {/* Active Chart Showcase Grid (Bento Matrix) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Chart Card (8 cols) */}
          <div className="lg:col-span-8 bg-surface-container-low border border-outline-variant/40 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-primary-container text-on-primary-fixed-variant">
                    {activeChart.toUpperCase()} Projection
                  </span>
                  <span className="text-xs text-on-surface-variant font-mono">
                    Model: Polynomial Ridge α=0.15
                  </span>
                </div>
                <h3 className="font-headline font-bold text-xl text-on-surface mt-1">
                  {activeChart === "line" && "MRR Growth ($k) vs Projected Churn (%)"}
                  {activeChart === "bar" && "Cohort Value Distribution & Risk Tiers"}
                  {activeChart === "heatmap" && "Pearson Feature Correlation Matrix"}
                  {activeChart === "scatter" && "Onboarding Latency vs Churn Hazard (IQR Outliers)"}
                  {activeChart === "radar" && "Multi-Dimensional Feature Importance Radar"}
                </h3>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span>Growth ($k)</span>
                </div>
                <div className="flex items-center gap-1.5 text-tertiary">
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
                  <span>Projected</span>
                </div>
              </div>
            </div>

            {/* Dynamic Chart Visual Rendering */}
            <div className="w-full h-72 sm:h-80 bg-surface rounded-xl p-4 border border-outline-variant/30 flex items-center justify-center relative overflow-hidden">
              {activeChart === "line" && (
                <svg className="w-full h-full" viewBox="0 0 600 240">
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4a7c59" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#4a7c59" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Grid lines */}
                  {[40, 90, 140, 190].map((y) => (
                    <line key={y} x1="40" y1={y} x2="580" y2={y} stroke="#c4c8bc" strokeOpacity="0.4" strokeDasharray="4 4" />
                  ))}
                  {/* Area fill */}
                  <polygon
                    points="40,200 40,150 100,135 170,115 240,100 310,80 380,65 450,45 520,32 580,20 580,200"
                    fill="url(#areaGrad)"
                  />
                  {/* Actual curve */}
                  <polyline
                    fill="none"
                    stroke="#4a7c59"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    points="40,150 100,135 170,115 240,100 310,80 380,65"
                  />
                  {/* Projected curve (dashed) */}
                  <polyline
                    fill="none"
                    stroke="#705c30"
                    strokeWidth="3"
                    strokeDasharray="6 6"
                    strokeLinecap="round"
                    points="380,65 450,45 520,32 580,20"
                  />
                  {/* Data points */}
                  {[
                    [40, 150, "$42k"],
                    [100, 135, "$48k"],
                    [170, 115, "$55k"],
                    [240, 100, "$61k"],
                    [310, 80, "$68k"],
                    [380, 65, "$75k"],
                    [450, 45, "$86k proj"],
                    [520, 32, "$94k proj"],
                    [580, 20, "$104k proj"],
                  ].map(([x, y, label], i) => (
                    <g key={i}>
                      <circle cx={x} cy={y} r="5" fill="#faf6f0" stroke={Number(x) <= 380 ? "#4a7c59" : "#705c30"} strokeWidth="2.5" />
                      <text x={x} y={Number(y) - 9} fontSize="9" textAnchor="middle" fill="#2e3230" fontWeight="bold">
                        {label}
                      </text>
                    </g>
                  ))}
                </svg>
              )}

              {activeChart === "bar" && (
                <div className="w-full h-full flex items-end justify-around gap-4 px-6 pb-4">
                  {[
                    { tier: "Starter", mrr: 680, risk: "81%", height: 35, color: "#6b6358" },
                    { tier: "Growth", mrr: 1650, risk: "48%", height: 55, color: "#78a886" },
                    { tier: "Enterprise", mrr: 64000, risk: "18%", height: 95, color: "#4a7c59" },
                    { tier: "Legacy SMB", mrr: 920, risk: "74%", height: 40, color: "#c4a66a" },
                  ].map((b) => (
                    <div key={b.tier} className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                      <span className="text-[10px] font-bold text-on-surface">{b.risk} Risk</span>
                      <div
                        className="w-full max-w-[60px] rounded-t-xl transition-all hover:opacity-90 shadow-sm"
                        style={{ height: `${b.height}%`, backgroundColor: b.color }}
                      />
                      <span className="text-xs font-semibold text-on-surface truncate">{b.tier}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeChart === "heatmap" && (
                <div className="w-full h-full flex flex-col justify-center items-center overflow-x-auto">
                  <div className="grid grid-cols-6 gap-1 text-[10px] font-mono">
                    <span className="font-bold text-secondary text-right pr-2">Metric</span>
                    {corrFeatures.map((f) => (
                      <span key={f} className="font-bold text-on-surface text-center truncate">{f.split(" ")[0]}</span>
                    ))}
                    {corrFeatures.map((rowF, rIdx) => (
                      <React.Fragment key={rowF}>
                        <span className="font-bold text-on-surface-variant truncate pr-2 text-right">{rowF.split(" ")[0]}</span>
                        {corrValues[rIdx].map((val, cIdx) => {
                          const bg = val > 0.5 ? "bg-primary text-on-primary" : val < -0.5 ? "bg-error text-on-error" : "bg-surface-container text-on-surface";
                          return (
                            <div key={cIdx} className={`p-2 rounded-lg text-center font-bold shadow-xs ${bg}`}>
                              {val.toFixed(2)}
                            </div>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              {activeChart === "scatter" && (
                <svg className="w-full h-full" viewBox="0 0 500 220">
                  {/* Axis */}
                  <line x1="40" y1="190" x2="480" y2="190" stroke="#74796e" strokeWidth="1" />
                  <line x1="40" y1="20" x2="40" y2="190" stroke="#74796e" strokeWidth="1" />
                  {/* IQR threshold line */}
                  <line x1="40" y1="70" x2="480" y2="70" stroke="#b83230" strokeWidth="1.5" strokeDasharray="4 4" />
                  <text x="470" y="65" textAnchor="end" fill="#b83230" fontSize="10" fontWeight="bold">
                    IQR High-Risk Threshold (&gt;65%)
                  </text>
                  {/* Points */}
                  {[
                    [60, 160, false],
                    [90, 140, false],
                    [130, 150, false],
                    [180, 120, false],
                    [220, 110, false],
                    [260, 95, false],
                    [310, 85, false],
                    [350, 55, true], // Outlier
                    [390, 48, true], // Outlier
                    [440, 35, true], // Outlier
                  ].map(([x, y, outlier], i) => (
                    <circle
                      key={i}
                      cx={x as number}
                      cy={y as number}
                      r={outlier ? "7" : "5"}
                      fill={outlier ? "#b83230" : "#4a7c59"}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  ))}
                  <text x="260" y="210" textAnchor="middle" fill="#74796e" fontSize="10">
                    Onboarding Latency (Days)
                  </text>
                </svg>
              )}

              {activeChart === "radar" && (
                <div className="flex items-center justify-center flex-col gap-2">
                  <div className="w-40 h-40 rounded-full border-2 border-primary/30 relative flex items-center justify-center">
                    <div className="w-28 h-28 rounded-full border border-primary/20 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary/20" />
                    </div>
                    <span className="absolute top-1 text-[10px] font-bold text-primary">Onboarding (0.84)</span>
                    <span className="absolute bottom-1 text-[10px] font-bold text-tertiary">Support (0.62)</span>
                    <span className="absolute left-1 text-[10px] font-bold text-on-surface">NPS (0.76)</span>
                    <span className="absolute right-1 text-[10px] font-bold text-primary">ARR (0.91)</span>
                  </div>
                  <span className="text-xs text-secondary font-medium">Model Feature Importance Weighting</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30 text-xs text-secondary">
              <span>Telemetry Timestamp: 2026-10-16 17:34:00</span>
              <span className="font-semibold text-primary">Confidence Interval: 95%</span>
            </div>
          </div>

          {/* Right Column: Anomaly Radar & Cohort Summary (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            {/* Outlier Watchlist Card */}
            <div className="bg-surface-container-low border border-outline-variant/40 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-headline font-bold text-sm text-on-surface">
                  High-Priority Anomaly Watchlist
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-error-container text-on-error-container">
                  3 Flagged
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-surface border border-outline-variant/30 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-mono font-bold text-primary">C-00384 (Enterprise)</span>
                    <span className="text-[10px] text-secondary">ARR: $48,000 • Risk: 66.5%</span>
                  </div>
                  <span className="text-[10px] font-bold text-tertiary">Priority 1</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface border border-outline-variant/30 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-mono font-bold text-primary">C-78201 (Enterprise)</span>
                    <span className="text-[10px] text-secondary">ARR: $62,000 • Risk: 22.4%</span>
                  </div>
                  <span className="text-[10px] font-bold text-primary">Retained</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface border border-outline-variant/30 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-mono font-bold text-primary">C-55829 (Enterprise)</span>
                    <span className="text-[10px] text-secondary">ARR: $74,500 • Risk: 14.8%</span>
                  </div>
                  <span className="text-[10px] font-bold text-primary">Retained</span>
                </div>
              </div>
            </div>

            {/* Regression Model Diagnostics */}
            <div className="bg-surface-container-low border border-outline-variant/40 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
              <span className="font-headline font-bold text-sm text-on-surface">
                Regression Diagnostics
              </span>
              <div className="space-y-2 text-xs text-on-surface-variant">
                <div className="flex justify-between">
                  <span>R-Squared (R²):</span>
                  <span className="font-mono font-bold text-on-surface">0.864</span>
                </div>
                <div className="flex justify-between">
                  <span>Mean Squared Error (MSE):</span>
                  <span className="font-mono font-bold text-on-surface">0.041</span>
                </div>
                <div className="flex justify-between">
                  <span>P-Value Significance:</span>
                  <span className="font-mono font-bold text-primary">&lt; 0.0001</span>
                </div>
                <div className="flex justify-between">
                  <span>Cross-Validation Folds:</span>
                  <span className="font-mono font-bold text-on-surface">10-Fold Stratified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
