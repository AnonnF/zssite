import type { ReactElement, ReactNode } from "react";

interface ProjectTechnicalVisualProps {
  slug: string;
  className?: string;
}

function VisualShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`tech-visual ${className}`} aria-hidden="true">
      {children}
    </div>
  );
}

function PipelineVisual({
  nodes,
  className = "",
}: {
  nodes: string[];
  className?: string;
}) {
  const width = 280;
  const height = 120;
  const padX = 14;
  const gap = (width - padX * 2) / Math.max(nodes.length - 1, 1);

  return (
    <VisualShell className={className}>
      <svg viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="8" width={width - 16} height={height - 16} stroke="rgba(20,19,15,0.1)" />
        {nodes.map((_, i) => {
          if (i === nodes.length - 1) return null;
          const x1 = padX + i * gap + 18;
          const x2 = padX + (i + 1) * gap - 18;
          return (
            <line
              key={`line-${i}`}
              x1={x1}
              y1={height / 2}
              x2={x2}
              y2={height / 2}
              stroke="rgba(20,19,15,0.22)"
              strokeWidth="1"
            />
          );
        })}
        {nodes.map((label, i) => {
          const x = padX + i * gap;
          const active = i === 0 || i === nodes.length - 1;
          return (
            <g key={label}>
              <rect
                x={x - 18}
                y={height / 2 - 14}
                width="36"
                height="28"
                fill={active ? "rgba(241,170,28,0.16)" : "rgba(255,255,255,0.45)"}
                stroke={active ? "#F1AA1C" : "rgba(20,19,15,0.22)"}
              />
              <text
                x={x}
                y={height / 2 + 3}
                textAnchor="middle"
                fill="#14130F"
                fontSize="7"
                fontFamily="ui-monospace, monospace"
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </VisualShell>
  );
}

function WaccVisual({ className = "" }: { className?: string }) {
  return (
    <PipelineVisual
      className={className}
      nodes={["LEX", "PARSE", "AST", "SEM", "ARM"]}
    />
  );
}

function Armv8Visual({ className = "" }: { className?: string }) {
  return (
    <VisualShell className={className}>
      <svg viewBox="0 0 280 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="8" width="264" height="104" stroke="rgba(20,19,15,0.1)" />
        <text x="18" y="28" fill="#746F65" fontSize="8" fontFamily="ui-monospace, monospace">
          INSTR / 32-BIT
        </text>
        {Array.from({ length: 16 }).map((_, i) => (
          <rect
            key={i}
            x={18 + i * 15}
            y={36}
            width="12"
            height="14"
            fill={i % 4 === 0 ? "rgba(241,170,28,0.35)" : "rgba(20,19,15,0.08)"}
            stroke="rgba(20,19,15,0.18)"
          />
        ))}
        <text x="18" y="72" fill="#746F65" fontSize="8" fontFamily="ui-monospace, monospace">
          REGS
        </text>
        {Array.from({ length: 8 }).map((_, i) => (
          <rect
            key={`r-${i}`}
            x={18 + i * 30}
            y={78}
            width="24"
            height="18"
            fill="rgba(255,255,255,0.4)"
            stroke={i === 0 ? "#F1AA1C" : "rgba(20,19,15,0.2)"}
          />
        ))}
        <rect x="230" y="70" width="32" height="32" stroke="#F1AA1C" fill="rgba(241,170,28,0.12)" />
        <text x="246" y="89" textAnchor="middle" fill="#14130F" fontSize="7" fontFamily="ui-monospace, monospace">
          MEM
        </text>
      </svg>
    </VisualShell>
  );
}

function PintosVisual({ className = "" }: { className?: string }) {
  return (
    <PipelineVisual
      className={className}
      nodes={["PROC", "SYS", "SCHED", "FS"]}
    />
  );
}

function RagVisual({ className = "" }: { className?: string }) {
  return (
    <PipelineVisual
      className={className}
      nodes={["DOC", "CHK", "EMB", "RET", "LLM"]}
    />
  );
}

function BridgeTalkVisual({ className = "" }: { className?: string }) {
  return (
    <VisualShell className={className}>
      <svg viewBox="0 0 280 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="8" width="264" height="104" stroke="rgba(20,19,15,0.1)" />
        <circle cx="70" cy="60" r="22" stroke="rgba(20,19,15,0.25)" fill="rgba(255,255,255,0.4)" />
        <circle cx="140" cy="40" r="16" stroke="#F1AA1C" fill="rgba(241,170,28,0.16)" />
        <circle cx="140" cy="80" r="16" stroke="rgba(20,19,15,0.25)" fill="rgba(255,255,255,0.4)" />
        <circle cx="210" cy="60" r="22" stroke="rgba(20,19,15,0.25)" fill="rgba(255,255,255,0.4)" />
        <path d="M90 52 L124 44" stroke="rgba(20,19,15,0.25)" />
        <path d="M90 68 L124 76" stroke="rgba(20,19,15,0.25)" />
        <path d="M156 44 L190 52" stroke="#F1AA1C" />
        <path d="M156 76 L190 68" stroke="rgba(20,19,15,0.25)" />
        <text x="140" y="112" textAnchor="middle" fill="#746F65" fontSize="8" fontFamily="ui-monospace, monospace">
          DIALOGUE · SCORE · FEEDBACK
        </text>
      </svg>
    </VisualShell>
  );
}

function UnityRpgVisual({ className = "" }: { className?: string }) {
  return (
    <VisualShell className={className}>
      <svg viewBox="0 0 280 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="8" width="264" height="104" stroke="rgba(20,19,15,0.1)" />
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 8 }).map((_, col) => (
            <rect
              key={`${row}-${col}`}
              x={20 + col * 18}
              y={22 + row * 14}
              width="16"
              height="12"
              fill={
                (row + col) % 3 === 0
                  ? "rgba(241,170,28,0.18)"
                  : "rgba(20,19,15,0.05)"
              }
              stroke="rgba(20,19,15,0.12)"
            />
          ))
        )}
        <rect x="178" y="28" width="78" height="64" stroke="rgba(20,19,15,0.22)" fill="rgba(255,255,255,0.35)" />
        <text x="217" y="48" textAnchor="middle" fill="#746F65" fontSize="8" fontFamily="ui-monospace, monospace">
          FSM
        </text>
        <circle cx="200" cy="68" r="7" stroke="#F1AA1C" fill="rgba(241,170,28,0.2)" />
        <circle cx="234" cy="68" r="7" stroke="rgba(20,19,15,0.25)" />
        <path d="M207 68 H227" stroke="rgba(20,19,15,0.3)" />
      </svg>
    </VisualShell>
  );
}

function CifarVisual({ className = "" }: { className?: string }) {
  return (
    <PipelineVisual
      className={className}
      nodes={["IN", "CONV", "POOL", "FC", "OUT"]}
    />
  );
}

function DroneVisual({ className = "" }: { className?: string }) {
  return (
    <VisualShell className={className}>
      <svg viewBox="0 0 280 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="8" width="264" height="104" stroke="rgba(20,19,15,0.1)" />
        <path
          d="M30 90 L70 55 L110 70 L150 35 L190 50 L230 28"
          stroke="#F1AA1C"
          strokeWidth="1.5"
          fill="none"
        />
        {[30, 70, 110, 150, 190, 230].map((x, i) => (
          <circle
            key={x}
            cx={x}
            cy={[90, 55, 70, 35, 50, 28][i]}
            r={i === 5 ? 4 : 3}
            fill={i === 5 ? "#F1AA1C" : "rgba(20,19,15,0.35)"}
          />
        ))}
        <text x="18" y="28" fill="#746F65" fontSize="8" fontFamily="ui-monospace, monospace">
          PATH · LLM PLAN
        </text>
      </svg>
    </VisualShell>
  );
}

function FallbackVisual({ className = "" }: { className?: string }) {
  return (
    <VisualShell className={className}>
      <svg viewBox="0 0 280 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="8" width="264" height="104" stroke="rgba(20,19,15,0.1)" />
        <rect x="24" y="28" width="80" height="64" stroke="rgba(20,19,15,0.22)" fill="rgba(255,255,255,0.35)" />
        <rect x="116" y="28" width="80" height="64" stroke="#F1AA1C" fill="rgba(241,170,28,0.12)" />
        <rect x="208" y="28" width="48" height="64" stroke="rgba(20,19,15,0.22)" fill="rgba(255,255,255,0.35)" />
        <text x="140" y="64" textAnchor="middle" fill="#746F65" fontSize="9" fontFamily="ui-monospace, monospace">
          CASE FILE
        </text>
      </svg>
    </VisualShell>
  );
}

const VISUAL_BY_SLUG: Record<
  string,
  (props: { className?: string }) => ReactElement
> = {
  "wacc-compiler": WaccVisual,
  "armv8-emulator-assembler": Armv8Visual,
  pintos: PintosVisual,
  "rag-agent": RagVisual,
  bridgetalk: BridgeTalkVisual,
  "unity-rpg": UnityRpgVisual,
  "pytorch-cifar-10": CifarVisual,
  "drone-llm-research": DroneVisual,
};

export function ProjectTechnicalVisual({
  slug,
  className = "",
}: ProjectTechnicalVisualProps) {
  const Visual = VISUAL_BY_SLUG[slug] ?? FallbackVisual;
  return <Visual className={className} />;
}
