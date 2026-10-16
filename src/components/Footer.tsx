import React from "react";

export function Footer() {
  return (
    <footer className="w-full bg-surface-container-low border-t border-outline-variant/30 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
        <div className="flex items-center gap-2 flex-wrap text-center md:text-left">
          <span className="font-headline font-semibold text-on-surface">ByteAgent</span>
          <span>—</span>
          <span>College Society Byte Tabular Intelligence Submission</span>
          <span className="hidden sm:inline">•</span>
          <span className="text-primary font-medium">Terra Organic Design System</span>
        </div>
        <div className="flex items-center gap-6 flex-wrap justify-center">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Autonomous Sandbox: Online</span>
          </span>
          <span>DuckDB WASM Runtime</span>
          <span>Academic Evaluation Build v3.1</span>
        </div>
      </div>
    </footer>
  );
}
