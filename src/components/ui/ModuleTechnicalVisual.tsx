import type { ReactElement, ReactNode } from "react";

interface ModuleTechnicalVisualProps {
  moduleId: string;
  className?: string;
}

function Shell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`tech-visual h-full min-h-[7.5rem] ${className}`} aria-hidden="true">
      {children}
    </div>
  );
}

function ArchiveVisual({ className = "" }: { className?: string }) {
  return (
    <Shell className={className}>
      <svg viewBox="0 0 220 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <rect x="10" y="12" width="200" height="116" stroke="rgba(20,19,15,0.1)" />
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x={24}
            y={28 + i * 28}
            width="172"
            height="20"
            fill={i === 1 ? "rgba(241,170,28,0.14)" : "rgba(255,255,255,0.35)"}
            stroke={i === 1 ? "#F1AA1C" : "rgba(20,19,15,0.18)"}
          />
        ))}
        <rect x="24" y="28" width="3" height="76" fill="#F1AA1C" />
        <text x="110" y="122" textAnchor="middle" fill="#746F65" fontSize="8" fontFamily="ui-monospace, monospace">
          PROJECT INDEX
        </text>
      </svg>
    </Shell>
  );
}

function AnalyzerVisual({ className = "" }: { className?: string }) {
  return (
    <Shell className={className}>
      <svg viewBox="0 0 220 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <rect x="10" y="12" width="64" height="116" stroke="rgba(20,19,15,0.18)" fill="rgba(247,243,236,0.7)" />
        <rect x="84" y="12" width="126" height="52" stroke="rgba(20,19,15,0.18)" fill="rgba(255,255,255,0.4)" />
        <rect x="84" y="72" width="126" height="56" stroke="rgba(20,19,15,0.18)" fill="#221F1A" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x="18"
            y={24 + i * 18}
            width="48"
            height="10"
            fill={i === 2 ? "rgba(241,170,28,0.3)" : "rgba(20,19,15,0.08)"}
            stroke={i === 2 ? "#F1AA1C" : "transparent"}
          />
        ))}
        <line x1="94" y1="28" x2="190" y2="28" stroke="rgba(20,19,15,0.2)" />
        <line x1="94" y1="40" x2="170" y2="40" stroke="rgba(20,19,15,0.15)" />
        <line x1="94" y1="88" x2="190" y2="88" stroke="rgba(232,228,220,0.25)" />
        <line x1="94" y1="100" x2="160" y2="100" stroke="rgba(241,170,28,0.55)" />
      </svg>
    </Shell>
  );
}

function ProfileVisual({ className = "" }: { className?: string }) {
  return (
    <Shell className={className}>
      <svg viewBox="0 0 220 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <rect x="10" y="12" width="200" height="116" stroke="rgba(20,19,15,0.1)" />
        <circle cx="56" cy="56" r="22" stroke="#F1AA1C" fill="rgba(241,170,28,0.12)" />
        <rect x="96" y="36" width="96" height="10" fill="rgba(20,19,15,0.12)" />
        <rect x="96" y="54" width="72" height="8" fill="rgba(20,19,15,0.08)" />
        <rect x="24" y="92" width="52" height="18" stroke="rgba(20,19,15,0.2)" fill="rgba(255,255,255,0.4)" />
        <rect x="84" y="92" width="52" height="18" stroke="#F1AA1C" fill="rgba(241,170,28,0.14)" />
        <rect x="144" y="92" width="52" height="18" stroke="rgba(20,19,15,0.2)" fill="rgba(255,255,255,0.4)" />
      </svg>
    </Shell>
  );
}

const VISUAL_BY_MODULE: Record<
  string,
  (props: { className?: string }) => ReactElement
> = {
  "project-archive": ArchiveVisual,
  "repository-analyzer": AnalyzerVisual,
  "about-resume": ProfileVisual,
};

export function ModuleTechnicalVisual({
  moduleId,
  className = "",
}: ModuleTechnicalVisualProps) {
  const Visual = VISUAL_BY_MODULE[moduleId] ?? ArchiveVisual;
  return <Visual className={className} />;
}
