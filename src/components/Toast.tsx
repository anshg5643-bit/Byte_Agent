"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

export function Toast() {
  const { toast } = useApp();

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 pointer-events-none bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2.5 max-w-md ${
        toast.show
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-12 opacity-0 scale-95"
      }`}
    >
      <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
        check_circle
      </span>
      <span>{toast.message}</span>
    </div>
  );
}
