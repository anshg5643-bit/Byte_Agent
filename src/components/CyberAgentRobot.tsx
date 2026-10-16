"use client";

import React from "react";

interface CyberAgentRobotProps {
  className?: string;
  opacity?: number;
}

export function CyberAgentRobot({ className = "w-full h-full object-contain", opacity = 0.2 }: CyberAgentRobotProps) {
  return (
    <div className={className} style={{ display: "block" }}>
      <svg
        height="100%"
        width="100%"
        viewBox="0 0 1200 800"
        style={{ background: "transparent", opacity, pointerEvents: "none" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="cyberGrid" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#4a7c59" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8ae9b3" stopOpacity="0.05" />
          </linearGradient>
          <filter height="140%" id="glow" width="140%" x="-20%" y="-20%">
            <feGaussianBlur result="blur" stdDeviation="6" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background Data Grid / Matrix lines */}
        <g opacity="0.3" stroke="#4a7c59" strokeWidth="0.5">
          <line x1="100" x2="100" y1="0" y2="800" />
          <line x1="300" x2="300" y1="0" y2="800" />
          <line x1="500" x2="500" y1="0" y2="800" />
          <line x1="700" x2="700" y1="0" y2="800" />
          <line x1="900" x2="900" y1="0" y2="800" />
          <line x1="1100" x2="1100" y1="0" y2="800" />
          <line x1="0" x2="1200" y1="150" y2="150" />
          <line x1="0" x2="1200" y1="350" y2="350" />
          <line x1="0" x2="1200" y1="550" y2="550" />
          <line x1="0" x2="1200" y1="750" y2="750" />
        </g>

        {/* Technical Circuit traces */}
        <path className="circuit-line" d="M 50 200 L 250 200 L 320 270 L 600 270" fill="none" stroke="#4a7c59" strokeWidth="1.5" />
        <circle cx="600" cy="270" fill="#4a7c59" r="4" />
        <path className="circuit-line" d="M 400 680 L 720 680 L 800 600 L 950 600" fill="none" stroke="#2d553e" strokeWidth="1.5" />
        <circle cx="400" cy="680" fill="#2d553e" r="4" />

        {/* Scanning Radar / Data Ring */}
        <circle cx="920" cy="380" fill="none" opacity="0.4" r="240" stroke="#4a7c59" strokeDasharray="6 8" strokeWidth="1" />
        <circle cx="920" cy="380" fill="none" opacity="0.3" r="180" stroke="#8ae9b3" strokeDasharray="14 10" strokeWidth="1.5" />
        <circle cx="920" cy="380" fill="none" opacity="0.5" r="120" stroke="#4a7c59" strokeWidth="0.8" />

        {/* TECHNICAL ROBOT VECTOR (Geometric AI Agent) */}
        <g className="floating-bot" id="cyber-bot">
          {/* Antenna & Signal waves */}
          <line stroke="#8ae9b3" strokeLinecap="round" strokeWidth="3" x1="920" x2="920" y1="210" y2="140" />
          <circle cx="920" cy="135" fill="#8ae9b3" filter="url(#glow)" r="7" />
          <path d="M 900 120 A 25 25 0 0 1 940 120" fill="none" opacity="0.7" stroke="#8ae9b3" strokeLinecap="round" strokeWidth="2" />
          <path d="M 890 105 A 40 40 0 0 1 950 105" fill="none" opacity="0.4" stroke="#8ae9b3" strokeLinecap="round" strokeWidth="1.5" />

          {/* Head Chassis */}
          <rect fill="#1b3325" height="130" rx="28" stroke="#4a7c59" strokeWidth="3.5" width="180" x="830" y="210" />
          <rect fill="#0d1c14" height="100" rx="18" stroke="#2d553e" strokeWidth="2" width="150" x="845" y="225" />

          {/* Optic Visor Screen */}
          <rect fill="#142c1f" height="48" rx="12" stroke="#8ae9b3" strokeWidth="1.5" width="124" x="858" y="245" />

          {/* Glowing Eyes */}
          <circle className="pulse-optic" cx="890" cy="269" r="7" />
          <circle className="pulse-optic" cx="950" cy="269" r="7" />

          {/* Visor Scan Wave */}
          <line opacity="0.6" stroke="#8ae9b3" strokeLinecap="round" strokeWidth="2" x1="865" x2="875" y1="269" y2="269" />
          <line opacity="0.6" stroke="#8ae9b3" strokeLinecap="round" strokeWidth="2" x1="965" x2="975" y1="269" y2="269" />

          {/* Audio / Voice grille */}
          <line stroke="#4a7c59" strokeLinecap="round" strokeWidth="3" x1="900" x2="940" y1="308" y2="308" />
          <line stroke="#4a7c59" strokeLinecap="round" strokeWidth="2" x1="906" x2="934" y1="314" y2="314" />

          {/* Neck Gimbal */}
          <rect fill="#2d553e" height="18" rx="4" width="40" x="900" y="340" />
          <line stroke="#8ae9b3" strokeWidth="2" x1="904" x2="936" y1="349" y2="349" />

          {/* Main Torso Chassis */}
          <path d="M 810 365 L 1030 365 L 1005 520 L 835 520 Z" fill="#1b3325" stroke="#4a7c59" strokeWidth="3" />

          {/* Data Core Chamber in Chest */}
          <polygon fill="#0d1c14" filter="url(#glow)" points="920,385 965,410 965,465 920,490 875,465 875,410" stroke="#8ae9b3" strokeWidth="2" />

          {/* Inner Core Symbol */}
          <circle cx="920" cy="437" fill="#2d553e" r="14" stroke="#8ae9b3" strokeWidth="2" />
          <text fill="#ffffff" fontFamily="monospace" fontSize="11" fontWeight="bold" textAnchor="middle" x="920" y="442">
            &lt;/&gt;
          </text>

          {/* Side Sensor Pods / Arms */}
          <rect fill="#203d2c" height="90" rx="14" stroke="#4a7c59" strokeWidth="2" width="36" x="765" y="380" />
          <line stroke="#8ae9b3" strokeDasharray="4 4" strokeWidth="2" x1="783" x2="783" y1="400" y2="450" />
          <rect fill="#203d2c" height="90" rx="14" stroke="#4a7c59" strokeWidth="2" width="36" x="1039" y="380" />
          <line stroke="#8ae9b3" strokeDasharray="4 4" strokeWidth="2" x1="1057" x2="1057" y1="400" y2="450" />

          {/* Floating Thruster Glow Rings */}
          <ellipse cx="920" cy="535" fill="#2d553e" opacity="0.6" rx="55" ry="12" />
          <ellipse cx="920" cy="542" fill="#8ae9b3" filter="url(#glow)" opacity="0.8" rx="35" ry="8" />
        </g>

        {/* HUD Coordinates & Engineering telemetry */}
        <g fill="#4a7c59" fontFamily="monospace" fontSize="10" opacity="0.6">
          <text x="50" y="770">SYS_CORE: AGENT_ACTIVE // REPO_READY</text>
          <text x="50" y="785">TOOLS_LOADED: [STAT_SUMMARY, OUTLIER_DETECT, SQL_ENGINE, CORRELATION, FORECAST]</text>
          <text x="950" y="785">MEMORY_VECTORS: PERSISTED</text>
        </g>
      </svg>
    </div>
  );
}
