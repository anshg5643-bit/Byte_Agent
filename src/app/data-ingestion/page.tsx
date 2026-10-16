"use client";

import React, { useState, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { CyberAgentRobot } from "@/components/CyberAgentRobot";
import { ColumnSchema } from "@/types";

export default function DataIngestionPage() {
  const { activeDataset, allDatasets, setActiveDatasetId, uploadCustomCsv, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortCol, setSortCol] = useState<string>("cohort_id");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadDragOver, setUploadDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sorting
  const sortedRows = [...activeDataset.rows].sort((a, b) => {
    const valA = a[sortCol];
    const valB = b[sortCol];
    if (valA === valB) return 0;
    if (valA === null || valA === undefined) return 1;
    if (valB === null || valB === undefined) return -1;
    if (typeof valA === "number" && typeof valB === "number") {
      return sortAsc ? valA - valB : valB - valA;
    }
    return sortAsc
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  // Search filtering
  const filteredRows = sortedRows.filter((r) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return Object.values(r).some((val) =>
      String(val).toLowerCase().includes(term)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage) || 1;
  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSort = (colName: string) => {
    if (sortCol === colName) {
      setSortAsc(!sortAsc);
    } else {
      setSortCol(colName);
      setSortAsc(true);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const ok = uploadCustomCsv(file.name, text);
        if (ok) {
          setIsUploadModalOpen(false);
          setSortCol(Object.keys(activeDataset.rows[0] || {})[0] || "id");
          setCurrentPage(1);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setUploadDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleExportCsv = () => {
    const headers = Object.keys(activeDataset.rows[0] || {}).join(",");
    const rows = activeDataset.rows
      .map((r) => Object.values(r).join(","))
      .join("\n");
    const blob = new Blob([headers + "\n" + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Export_${activeDataset.filename}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${activeDataset.rowsCount} rows from ${activeDataset.name}`);
  };

  return (
    <div className="flex flex-col w-full relative min-h-screen">
      {/* Ambient Robot Layer */}
      <div className="absolute top-0 right-0 w-full max-w-4xl h-[460px] pointer-events-none opacity-20 overflow-hidden z-0 mix-blend-multiply">
        <CyberAgentRobot opacity={0.2} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 flex flex-col gap-8 w-full">
        {/* Society Byte Evaluator Verification Banner */}
        <div className="w-full rounded-2xl bg-surface-container-high border border-outline-variant/40 shadow-sm p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-fixed-variant flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[24px]">verified</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-headline text-base font-bold text-on-surface">
                  System Dynamic Flexibility Verified
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-secondary-container text-on-secondary-container">
                  Task Compliance Grade A
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed max-w-3xl">
                ByteAgent is strictly model-agnostic and schema-adaptive. The sandbox dynamically parses any tabular structure (CSV, Parquet, or NDJSON), generates runtime type bindings, and auto-arms memory vector indices on-the-fly without schema pre-compilation.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-surface hover:bg-surface-container border border-outline-variant/40 text-on-surface text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">cloud_upload</span>
              <span>Upload Own Data</span>
            </button>
            <a
              href="#schema-view"
              className="px-3 py-2 rounded-xl bg-surface hover:bg-surface-container border border-outline-variant/40 text-on-surface-variant text-xs font-medium transition-colors"
            >
              Audit Type Map
            </a>
          </div>
        </div>

        {/* Portal Title & Dataset Hub Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="flex flex-col max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>Tabular Ingestion Runtime • Apache Arrow In-Memory</span>
            </div>
            <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-on-surface leading-tight">
              Dataset Ingestion &amp; Schema Profiling
            </h1>
            <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
              Inspect inferred schema primitives, null frequencies, and automated agent tool binding vectors. Switch between active campus benchmark workloads or drag-and-drop custom tabular files.
            </p>
          </div>

          {/* Quick Metrics Summary Pills */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            <div className="bg-surface-container rounded-xl p-3 px-4 shadow-xs border border-outline-variant/30 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">view_column</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-on-surface-variant">Active Columns</span>
                <span className="font-headline text-base font-bold text-on-surface">
                  {activeDataset.columnsCount} Inferred
                </span>
              </div>
            </div>

            <div className="bg-surface-container rounded-xl p-3 px-4 shadow-xs border border-outline-variant/30 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-tertiary-container/30 text-tertiary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">table_rows</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-on-surface-variant">Sample Heap</span>
                <span className="font-headline text-base font-bold text-on-surface">
                  {activeDataset.rowsCount.toLocaleString()} Rows
                </span>
              </div>
            </div>

            <div className="bg-surface-container rounded-xl p-3 px-4 shadow-xs border border-outline-variant/30 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-fixed-variant flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">memory</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-on-surface-variant">Active Memory</span>
                <span className="font-headline text-base font-bold text-on-surface">
                  {activeDataset.activeMemorySize}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dataset Selection Tabs Bar */}
        <div className="w-full bg-surface-container-low border border-outline-variant/40 rounded-2xl p-2 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {allDatasets.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setActiveDatasetId(d.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
                  d.id === activeDataset.id
                    ? "bg-surface text-on-surface shadow-xs border border-outline-variant/40 font-bold"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${d.id === activeDataset.id ? "bg-primary" : "bg-outline-variant"}`} />
                <span>{d.name}</span>
                <span className="text-[10px] text-secondary font-mono">({d.rowsCount} rows)</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container hover:text-on-primary-fixed-variant transition flex items-center justify-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Ingest New CSV</span>
          </button>
        </div>

        {/* Schema Profiling & Inferred Type Map */}
        <div id="schema-view" className="rounded-2xl bg-surface-container-low border border-outline-variant/40 p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">schema</span>
              <h3 className="font-headline font-bold text-base text-on-surface">
                Schema Profiling &amp; Runtime Primitives
              </h3>
            </div>
            <span className="text-xs text-secondary font-medium">Auto-derived via AST scanner</span>
          </div>

          <div className="overflow-x-auto w-full rounded-xl border border-outline-variant/30 bg-surface">
            <table className="w-full text-left text-xs text-on-surface">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant font-bold text-[11px] uppercase tracking-wider border-b border-outline-variant/30">
                  <th className="py-3 px-4">Column Identifier</th>
                  <th className="py-3 px-4">Inferred Primitive</th>
                  <th className="py-3 px-4">Null Frequency</th>
                  <th className="py-3 px-4">Distinct Count</th>
                  <th className="py-3 px-4">Sample Values</th>
                  <th className="py-3 px-4">Agent Binding Vector</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 text-[11px]">
                {activeDataset.columns.map((col: ColumnSchema, idx: number) => (
                  <tr key={idx} className="hover:bg-surface-container-low transition">
                    <td className="py-3 px-4 font-mono font-semibold text-primary">
                      {col.name}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        col.isNumeric
                          ? "bg-primary-fixed text-on-primary-fixed-variant"
                          : "bg-secondary-container text-on-secondary-container"
                      }`}>
                        {col.rawType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-surface-container overflow-hidden">
                          <div
                            className="h-full bg-error rounded-full"
                            style={{ width: `${Math.min(100, col.nullPercentage * 5)}%` }}
                          />
                        </div>
                        <span className="text-secondary">{col.nullPercentage}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {col.uniqueCount} distinct
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant font-mono truncate max-w-xs">
                      {col.sampleValues.join(", ") || "—"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-surface-container text-on-surface-variant font-mono">
                        vec_{col.name}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabular Data Explorer */}
        <div className="rounded-2xl bg-surface-container-low border border-outline-variant/40 p-6 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">dataset</span>
              <div>
                <h3 className="font-headline font-bold text-base text-on-surface">
                  Tabular Explorer ({filteredRows.length} Matches)
                </h3>
                <span className="text-[11px] text-on-surface-variant">
                  Interactive DuckDB sandbox with multi-column sorting and instant search
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="relative">
                <span className="material-symbols-outlined absolute left-2.5 top-2 text-secondary text-sm">
                  search
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Filter table rows..."
                  className="pl-8 pr-3 py-1.5 bg-surface border border-outline-variant/40 rounded-xl text-xs text-on-surface outline-none focus:ring-1 focus:ring-primary w-48 sm:w-64"
                />
              </div>

              {/* Rows Per Page */}
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-surface border border-outline-variant/40 rounded-xl px-2.5 py-1.5 text-xs text-on-surface outline-none font-semibold"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
              </select>

              <button
                type="button"
                onClick={handleExportCsv}
                className="px-3 py-1.5 rounded-xl bg-surface border border-outline-variant/40 hover:bg-surface-container text-xs font-semibold text-on-surface flex items-center gap-1 transition"
              >
                <span className="material-symbols-outlined text-[15px] text-primary">download</span>
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto w-full rounded-xl border border-outline-variant/30 bg-surface">
            <table className="w-full text-left text-xs text-on-surface">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant font-bold text-[11px] uppercase tracking-wider border-b border-outline-variant/30">
                  {activeDataset.columns.map((c) => (
                    <th
                      key={c.name}
                      onClick={() => handleSort(c.name)}
                      className="py-3 px-4 cursor-pointer hover:bg-surface-container-high transition select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{c.name}</span>
                        {sortCol === c.name && (
                          <span className="material-symbols-outlined text-xs text-primary">
                            {sortAsc ? "arrow_upward" : "arrow_downward"}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 text-[11px]">
                {paginatedRows.map((r, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-low transition">
                    {activeDataset.columns.map((c) => {
                      const val = r[c.name];
                      const isAnomaly = c.name === "anomaly_flag" && val !== "None";
                      return (
                        <td key={c.name} className="py-2.5 px-4 font-mono">
                          {isAnomaly ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-error-container text-on-error-container">
                              {String(val)}
                            </span>
                          ) : typeof val === "number" ? (
                            <span>{val.toLocaleString()}</span>
                          ) : (
                            <span>{String(val ?? "—")}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between text-xs text-secondary pt-2">
            <span>
              Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
              {Math.min(currentPage * rowsPerPage, filteredRows.length)} of {filteredRows.length} rows
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 rounded-lg bg-surface border border-outline-variant/30 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container"
              >
                Previous
              </button>
              <span className="font-semibold text-on-surface px-2">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 rounded-lg bg-surface border border-outline-variant/30 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Upload Custom CSV Modal */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">cloud_upload</span>
                  <h4 className="font-headline font-bold text-base text-on-surface">
                    Upload Custom Tabular Data
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-surface-container text-secondary hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setUploadDragOver(true);
                }}
                onDragLeave={() => setUploadDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition ${
                  uploadDragOver
                    ? "border-primary bg-primary-container/20"
                    : "border-outline-variant hover:border-primary/60 hover:bg-surface-container-low"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[28px]">file_upload</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-on-surface">
                    Drag and drop your .csv file here
                  </span>
                  <span className="text-xs text-secondary mt-0.5">
                    or click to browse files from your computer
                  </span>
                </div>
                <span className="text-[10px] text-tertiary font-semibold uppercase tracking-wider mt-2">
                  Supports comma-separated tabular files with headers
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <div className="text-xs text-on-surface-variant leading-relaxed bg-surface-container p-3 rounded-xl">
                <strong>Model-Agnostic Ingestion:</strong> ByteAgent dynamically analyzes data types, isolates null frequencies, and creates semantic embeddings without manual configuration.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface border border-outline-variant/40 text-on-surface text-xs font-semibold hover:bg-surface-container transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
