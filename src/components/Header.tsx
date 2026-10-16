"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";

export function Header() {
  const pathname = usePathname();
  const { user, activeDataset, allDatasets, setActiveDatasetId } = useApp();
  const [datasetDropdownOpen, setDatasetDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Agent Studio", path: "/" },
    { name: "Data Ingestion & Tables", path: "/data-ingestion" },
    { name: "Visual Analytics", path: "/visual-analytics" },
    { name: "Memory Inspector", path: "/memory-inspector" },
    { name: "Auth & Settings", path: "/auth" },
  ];

  const isCurrent = (path: string) => {
    if (path === "/") {
      return pathname === "/" || pathname === "/agent-studio";
    }
    return pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-[#faf6f0]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(46,50,48,0.05)] border-b border-[#e4e0d8]">
      <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-4">
        {/* Brand & Left Indicators */}
        <div className="flex items-center gap-4 lg:gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px]">smart_toy</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline text-lg font-bold tracking-tight text-on-surface leading-tight">
                ByteAgent
              </span>
              <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                Society Byte
              </span>
            </div>
          </Link>

          {/* Active Tools & Dataset Pill */}
          <div className="hidden xl:flex items-center gap-2 pl-4 border-l border-outline-variant/40">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-container text-on-primary-fixed-variant text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>5 Agent Tools Active</span>
            </div>

            {/* Dataset Dropdown Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDatasetDropdownOpen(!datasetDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-container-high hover:bg-surface-variant text-xs font-medium text-on-surface-variant transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-tertiary">database</span>
                <span className="max-w-[140px] truncate">{activeDataset.filename}</span>
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </button>

              {datasetDropdownOpen && (
                <div
                  className="absolute left-0 mt-2 w-64 rounded-xl bg-surface-container-lowest shadow-xl border border-outline-variant/40 p-2 z-50 flex flex-col gap-1"
                  onMouseLeave={() => setDatasetDropdownOpen(false)}
                >
                  <span className="text-[10px] uppercase font-bold text-secondary px-2 py-1 tracking-wider">
                    Switch Active Tabular Model
                  </span>
                  {allDatasets.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        setActiveDatasetId(d.id);
                        setDatasetDropdownOpen(false);
                      }}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left transition ${
                        d.id === activeDataset.id
                          ? "bg-primary-container text-on-primary-fixed-variant font-bold"
                          : "hover:bg-surface-container text-on-surface"
                      }`}
                    >
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="truncate">{d.name}</span>
                        <span className="text-[10px] text-secondary font-normal truncate">
                          {d.rowsCount.toLocaleString()} rows • {d.columnsCount} cols
                        </span>
                      </div>
                      {d.id === activeDataset.id && (
                        <span className="material-symbols-outlined text-[16px] text-primary">check</span>
                      )}
                    </button>
                  ))}
                  <div className="border-t border-outline-variant/40 mt-1 pt-1">
                    <Link
                      href="/data-ingestion"
                      onClick={() => setDatasetDropdownOpen(false)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-primary font-semibold hover:bg-surface-container transition"
                    >
                      <span className="material-symbols-outlined text-[16px]">upload_file</span>
                      <span>Upload Custom Dataset...</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = isCurrent(link.path);
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`px-3.5 py-2 text-xs xl:text-sm transition-all rounded-lg font-medium ${
                  active
                    ? "bg-primary-container text-on-primary-fixed-variant font-bold shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions & User Profile */}
        <div className="flex items-center gap-3">
          <Link
            href="/auth"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary-container hover:bg-surface-container-high text-on-secondary-container text-xs font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">
              {user.role === "Academic Evaluator" ? "verified_user" : "badge"}
            </span>
            <span className="hidden md:inline">{user.clearanceLevel}</span>
          </Link>

          {/* User Profile Pill */}
          <Link href="/auth" className="flex items-center gap-2.5 pl-2 group">
            <div className="relative">
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/60 transition-all"
                src={user.avatarUrl}
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-surface" />
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold leading-tight text-on-surface group-hover:text-primary transition-colors">
                {user.fullName.split(" ")[0]}
              </span>
              <span className="text-[10px] text-primary font-medium">{user.role}</span>
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-surface-container text-on-surface"
            aria-label="Toggle Navigation"
          >
            <span className="material-symbols-outlined text-[20px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container-low border-b border-outline-variant/40 p-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                isCurrent(link.path)
                  ? "bg-primary-container text-on-primary-fixed-variant"
                  : "text-on-surface hover:bg-surface-container"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="border-t border-outline-variant/30 pt-3 mt-1 flex flex-col gap-2">
            <span className="text-xs text-secondary font-semibold">Active Model: {activeDataset.name}</span>
            <Link
              href="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold text-center"
            >
              Switch Role / Auth Settings
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
