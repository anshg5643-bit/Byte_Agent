"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { CyberAgentRobot } from "@/components/CyberAgentRobot";
import { memoryGraphNodes, memoryGraphLinks } from "@/data/mockData";
import { MemoryNode } from "@/types";

export default function MemoryInspectorPage() {
  const {
    domainRules,
    toggleDomainRule,
    addDomainRule,
    deleteDomainRule,
    isSyncingEmbeddings,
    syncEmbeddings,
    showToast,
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<MemoryNode | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<
    "User Correction" | "User Preference" | "Domain Logic" | "Agent Learning"
  >("Domain Logic");
  const [formDescription, setFormDescription] = useState("");
  const [formConstraint, setFormConstraint] = useState("");
  const [formConfidence, setFormConfidence] = useState(95);

  const filteredRules = domainRules.filter((r) => {
    if (categoryFilter === "all") return true;
    return r.category.toLowerCase() === categoryFilter.toLowerCase();
  });

  const handleAddRuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formDescription.trim()) {
      showToast("Please provide rule name and logic description.");
      return;
    }

    addDomainRule({
      name: formName,
      category: formCategory,
      description: formDescription,
      sqlConstraint: formConstraint || "WHERE 1=1",
      confidence: Number(formConfidence),
      enabled: true,
    });

    setIsAddModalOpen(false);
    setFormName("");
    setFormDescription("");
    setFormConstraint("");
  };

  return (
    <div className="flex flex-col w-full relative min-h-screen">
      {/* Ambient Robot Layer */}
      <div className="absolute top-0 right-0 w-full max-w-4xl h-[460px] pointer-events-none opacity-20 overflow-hidden z-0 mix-blend-multiply">
        <CyberAgentRobot opacity={0.2} />
      </div>

      {/* Hero Header Strip */}
      <div className="relative bg-surface-container-low border-b border-outline-variant/40 py-10 px-4 sm:px-6 lg:px-12 overflow-hidden">
        <div className="absolute -top-24 -left-20 w-96 h-96 rounded-full bg-primary-fixed/20 blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold tracking-wide shadow-xs">
              <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                neurology
              </span>
              Brownie Points Architecture: Non-Trivial Facts Retention
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              Graph Store Active (DuckDB + Chroma Vector Space)
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface leading-tight">
                Semantic Domain Memory &amp; Cross-Session Knowledge Graph
              </h1>
              <p className="text-on-surface-variant text-base sm:text-lg mt-2 leading-relaxed">
                Persistent episodic state machine that decouples ephemeral chat buffers from verified tabular priors.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary-container hover:text-on-primary-fixed-variant text-on-primary font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Add Domain Rule</span>
              </button>
              <button
                type="button"
                onClick={syncEmbeddings}
                disabled={isSyncingEmbeddings}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-surface border border-outline-variant/40 hover:bg-surface-container text-on-surface font-semibold text-xs sm:text-sm transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-[18px] ${isSyncingEmbeddings ? "animate-spin" : ""}`}>
                  sync
                </span>
                <span>{isSyncingEmbeddings ? "Re-indexing..." : "Re-sync Embeddings"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 py-10 flex flex-col gap-10 relative z-10">
        {/* Foundational Reasoning Principle Banner */}
        <div className="p-6 sm:p-7 rounded-2xl bg-surface-container-low border border-outline-variant/40 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-5 relative overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-tertiary-container/30 text-tertiary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[28px]">schema</span>
          </div>
          <div className="flex-1">
            <span className="text-xs uppercase tracking-wider font-bold text-tertiary">
              Foundational Reasoning Principle
            </span>
            <p className="text-on-surface font-body text-sm sm:text-base leading-relaxed mt-0.5">
              Rather than dumping raw chat transcripts, ByteAgent extracts structured domain rules, business logic corrections, user preferences, and named filters to mutate subsequent reasoning loops across different user sessions without hallucination drift.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-on-surface-variant shrink-0 bg-surface px-4 py-3 rounded-xl border border-outline-variant/30">
            <div className="flex flex-col items-center">
              <span className="font-headline text-lg font-bold text-primary">
                {domainRules.filter((r) => r.enabled).length}
              </span>
              <span>Active Rules</span>
            </div>
            <div className="w-px h-8 bg-outline-variant/40" />
            <div className="flex flex-col items-center">
              <span className="font-headline text-lg font-bold text-on-surface">99.4%</span>
              <span>Recall Precision</span>
            </div>
            <div className="w-px h-8 bg-outline-variant/40" />
            <div className="flex flex-col items-center">
              <span className="font-headline text-lg font-bold text-tertiary">34</span>
              <span>Queries Mutated</span>
            </div>
          </div>
        </div>

        {/* 2-Column: Left = Rule Registry, Right = Knowledge Graph */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Domain Rule Registry (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="font-headline text-xl sm:text-2xl font-bold text-on-surface">
                  Domain Rule Registry
                </h2>
                <p className="text-xs text-on-surface-variant">
                  Validated domain constraints actively injected into SQL and Python sandboxes.
                </p>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-on-surface-variant font-medium">Filter:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="text-xs bg-surface border border-outline-variant/40 rounded-xl px-2.5 py-1.5 font-semibold text-on-surface outline-none cursor-pointer"
                >
                  <option value="all">All Sources ({domainRules.length})</option>
                  <option value="User Correction">User Correction</option>
                  <option value="User Preference">User Preference</option>
                  <option value="Domain Logic">Domain Logic</option>
                  <option value="Agent Learning">Agent Learning</option>
                </select>
              </div>
            </div>

            {/* Rules List */}
            <div className="flex flex-col gap-4">
              {filteredRules.map((rule) => (
                <div
                  key={rule.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col gap-3 shadow-xs ${
                    rule.enabled
                      ? "bg-surface-container-low border-outline-variant/40 hover:border-primary/40"
                      : "bg-surface-container/40 border-outline-variant/20 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant">
                        {rule.ruleCode}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
                        {rule.category}
                      </span>
                      <span className="text-xs text-on-surface-variant font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-primary">verified</span>
                        Confidence: {rule.confidence}%
                      </span>
                      <span className="text-xs text-on-surface-variant font-medium">
                        Applied: {rule.appliedCount} queries
                      </span>
                    </div>

                    {/* Interactive Toggle Switch */}
                    <div className="flex items-center gap-2 shrink-0">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rule.enabled}
                          onChange={(e) => toggleDomainRule(rule.id, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-surface-container-high rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-xs" />
                      </label>
                      <button
                        type="button"
                        onClick={() => deleteDomainRule(rule.id)}
                        className="p-1 text-secondary hover:text-error transition"
                        title="Delete Rule"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-on-surface">{rule.name}</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
                      {rule.description}
                    </p>
                  </div>

                  {rule.sqlConstraint && (
                    <div className="p-2.5 rounded-xl bg-surface border border-outline-variant/30 font-mono text-[11px] text-primary flex items-center justify-between">
                      <span className="truncate">{rule.sqlConstraint}</span>
                      <span className="text-[10px] text-secondary font-sans uppercase font-bold shrink-0 pl-2">
                        SQL Predicate
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Knowledge Graph Canvas (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-headline font-bold text-lg text-on-surface">
                  Vector Space Topology
                </h3>
                <span className="text-xs text-on-surface-variant">
                  Interactive Chroma / DuckDB Vector Node Graph
                </span>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant">
                10 Vertices
              </span>
            </div>

            {/* Visual Vector Graph Canvas */}
            <div className="bg-surface-container-low border border-outline-variant/40 rounded-2xl p-4 shadow-sm flex flex-col gap-4">
              <div className="w-full h-80 bg-surface rounded-xl border border-outline-variant/30 relative overflow-hidden flex items-center justify-center p-4">
                <svg className="w-full h-full" viewBox="0 0 400 300">
                  {/* Edges */}
                  <line x1="80" y1="60" x2="200" y2="150" stroke="#74796e" strokeWidth="1.5" strokeOpacity="0.4" />
                  <line x1="80" y1="140" x2="200" y2="150" stroke="#74796e" strokeWidth="1.5" strokeOpacity="0.4" />
                  <line x1="80" y1="220" x2="200" y2="150" stroke="#74796e" strokeWidth="1.5" strokeOpacity="0.4" />
                  <line x1="200" y1="150" x2="320" y2="70" stroke="#74796e" strokeWidth="1.5" strokeOpacity="0.4" />
                  <line x1="200" y1="150" x2="320" y2="150" stroke="#74796e" strokeWidth="1.5" strokeOpacity="0.4" />
                  <line x1="200" y1="150" x2="320" y2="230" stroke="#74796e" strokeWidth="1.5" strokeOpacity="0.4" />

                  {/* Nodes */}
                  {memoryGraphNodes.map((n, i) => {
                    const coords = [
                      [80, 60],
                      [80, 140],
                      [80, 220],
                      [130, 270],
                      [200, 150],
                      [200, 70],
                      [320, 70],
                      [320, 150],
                      [320, 230],
                      [200, 240],
                    ][i] || [150, 150];

                    const isHovered = selectedNode?.id === n.id;

                    return (
                      <g
                        key={n.id}
                        onClick={() => setSelectedNode(n)}
                        className="cursor-pointer group"
                      >
                        <circle
                          cx={coords[0]}
                          cy={coords[1]}
                          r={isHovered ? "16" : "12"}
                          fill={n.color}
                          stroke="#faf6f0"
                          strokeWidth="2.5"
                          className="transition-all hover:scale-125"
                        />
                        <text
                          x={coords[0]}
                          y={coords[1] + 20}
                          fontSize="8"
                          textAnchor="middle"
                          fill="#2e3230"
                          fontWeight="bold"
                        >
                          {n.id}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Node Details Inspection */}
              <div className="p-3.5 rounded-xl bg-surface border border-outline-variant/30 text-xs">
                {selectedNode ? (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-on-surface">{selectedNode.label}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-container text-secondary">
                        {selectedNode.group.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-secondary text-[11px] leading-relaxed">
                      {selectedNode.description}
                    </p>
                  </div>
                ) : (
                  <span className="text-secondary italic text-[11px]">
                    Click any node in the vector graph above to inspect its semantic embedding and rule lineage.
                  </span>
                )}
              </div>

              {/* Graph Telemetry Stats */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-surface border border-outline-variant/30 flex flex-col">
                  <span className="text-secondary font-medium">Embedding Dimension</span>
                  <span className="font-bold text-on-surface">768-D (MiniLM)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface border border-outline-variant/30 flex flex-col">
                  <span className="text-secondary font-medium">Index Algorithm</span>
                  <span className="font-bold text-on-surface">HNSW Cosine</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Domain Rule Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">add_circle</span>
                  <h4 className="font-headline font-bold text-base text-on-surface">
                    Register New Domain Rule
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-surface-container text-secondary hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              <form onSubmit={handleAddRuleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                    Rule Name
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g., Mandatory Intervention GPA Threshold"
                    required
                    className="w-full px-3 py-2 bg-surface border border-outline-variant/40 rounded-xl text-xs text-on-surface outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                      Category Origin
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) =>
                        setFormCategory(
                          e.target.value as
                            | "User Correction"
                            | "User Preference"
                            | "Domain Logic"
                            | "Agent Learning"
                        )
                      }
                      className="w-full px-3 py-2 bg-surface border border-outline-variant/40 rounded-xl text-xs text-on-surface outline-none"
                    >
                      <option value="User Correction">User Correction</option>
                      <option value="User Preference">User Preference</option>
                      <option value="Domain Logic">Domain Logic</option>
                      <option value="Agent Learning">Agent Learning</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                      Confidence Score ({formConfidence}%)
                    </label>
                    <input
                      type="range"
                      min="70"
                      max="100"
                      value={formConfidence}
                      onChange={(e) => setFormConfidence(Number(e.target.value))}
                      className="w-full accent-primary mt-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                    Rule Constraint Description
                  </label>
                  <textarea
                    rows={2}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Describe how the agent should adjust reasoning when executing downstream queries..."
                    required
                    className="w-full px-3 py-2 bg-surface border border-outline-variant/40 rounded-xl text-xs text-on-surface outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                    SQL Predicate Expression (Optional)
                  </label>
                  <input
                    type="text"
                    value={formConstraint}
                    onChange={(e) => setFormConstraint(e.target.value)}
                    placeholder="WHERE final_gpa < 2.0"
                    className="w-full px-3 py-2 bg-surface border border-outline-variant/40 rounded-xl text-xs font-mono text-on-surface outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/30">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-surface border border-outline-variant/40 text-on-surface text-xs font-semibold hover:bg-surface-container"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container hover:text-on-primary-fixed-variant shadow-sm transition"
                  >
                    Store Rule in Memory
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
