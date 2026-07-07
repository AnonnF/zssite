/**
 * TechnicalThumbnail — original, abstract engineering diagrams rendered as inline
 * SVG. These are NOT decorative stock art: each variant sketches the actual
 * structure of a project (pipeline, ISA model, retrieval flow, scoring, FSM…)
 * using thin technical lines + brand-yellow signal marks, in line with the
 * Golden Engineering Archive visual system.
 *
 * No bitmaps, no external assets. Structural ink uses `currentColor`; signal
 * accents use the brand accent token so the whole thing adapts to the theme.
 */

export type TechnicalVisual =
  | "pipeline"
  | "emulator"
  | "kernel"
  | "rag"
  | "dialogue"
  | "statemachine"
  | "neuralnet"
  | "research"
  | "generic";

const ACCENT = "var(--color-accent)";

/** Map a project (by slug, then type) to a diagram variant. */
export function resolveTechnicalVisual(
  slug?: string,
  type?: string
): TechnicalVisual {
  switch (slug) {
    case "wacc-compiler":
      return "pipeline";
    case "armv8-emulator-assembler":
      return "emulator";
    case "pintos":
      return "kernel";
    case "rag-agent":
      return "rag";
    case "bridgetalk":
      return "dialogue";
    case "unity-rpg":
      return "statemachine";
    case "pytorch-cifar-10":
      return "neuralnet";
    case "drone-llm-research":
      return "research";
  }

  switch (type) {
    case "Compiler":
      return "pipeline";
    case "Systems":
      return "emulator";
    case "AI Application":
      return "rag";
    case "Game":
      return "statemachine";
    case "ML":
      return "neuralnet";
    case "Research":
      return "research";
    default:
      return "generic";
  }
}

interface TechnicalThumbnailProps {
  variant: TechnicalVisual;
  className?: string;
  /** Small mono label rendered in the frame corner, e.g. a project ref. */
  caption?: string;
}

const strokeProps = {
  stroke: "currentColor",
  strokeWidth: 1,
  fill: "none",
  vectorEffect: "non-scaling-stroke" as const,
};

function Label({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <text
      x={x}
      y={y}
      fill="currentColor"
      fillOpacity={0.6}
      fontSize={7}
      letterSpacing={0.5}
      fontFamily="var(--font-mono), monospace"
      textAnchor="middle"
    >
      {children}
    </text>
  );
}

/** WACC compiler: Lexer → Parser → AST → Semantic → ARM Codegen. */
function PipelineVisual() {
  const stages = ["LEX", "PARSE", "AST", "SEM", "GEN"];
  const w = 44;
  const gap = 12;
  const startX = 18;
  const y = 44;
  return (
    <g strokeOpacity={0.55}>
      {stages.map((s, i) => {
        const x = startX + i * (w + gap);
        const active = i === stages.length - 1;
        return (
          <g key={s}>
            <rect
              x={x}
              y={y}
              width={w}
              height={26}
              rx={1}
              {...strokeProps}
              fill={active ? "var(--color-accent-soft)" : "none"}
              stroke={active ? ACCENT : "currentColor"}
            />
            <Label x={x + w / 2} y={y + 17}>
              {s}
            </Label>
            {i < stages.length - 1 && (
              <>
                <line
                  x1={x + w}
                  y1={y + 13}
                  x2={x + w + gap}
                  y2={y + 13}
                  {...strokeProps}
                />
                <path
                  d={`M${x + w + gap - 3} ${y + 10} L${x + w + gap} ${y + 13} L${x + w + gap - 3} ${y + 16}`}
                  {...strokeProps}
                />
              </>
            )}
          </g>
        );
      })}
      <circle cx={startX + 4} cy={y - 8} r={2} fill={ACCENT} stroke="none" />
      <Label x={startX + w / 2} y={y + 44}>
        SOURCE
      </Label>
      <Label x={startX + 4 * (w + gap) + w / 2} y={y + 44}>
        ARM ASM
      </Label>
    </g>
  );
}

/** ARMv8 emulator: instruction bits + register file + memory blocks. */
function EmulatorVisual() {
  const bits = Array.from({ length: 16 });
  const filled = new Set([0, 1, 4, 6, 7, 11, 14]);
  return (
    <g strokeOpacity={0.55}>
      <Label x={70} y={22}>
        INSTRUCTION
      </Label>
      {bits.map((_, i) => {
        const x = 16 + i * 15;
        const on = filled.has(i);
        return (
          <rect
            key={i}
            x={x}
            y={28}
            width={12}
            height={14}
            rx={1}
            {...strokeProps}
            fill={on ? "var(--color-accent-soft)" : "none"}
            stroke={on ? ACCENT : "currentColor"}
          />
        );
      })}

      <Label x={62} y={66}>
        REGISTERS
      </Label>
      {Array.from({ length: 4 }).map((_, i) => (
        <g key={i}>
          <rect
            x={16}
            y={72 + i * 11}
            width={92}
            height={8}
            rx={1}
            {...strokeProps}
          />
          <line
            x1={40}
            y1={72 + i * 11}
            x2={40}
            y2={80 + i * 11}
            {...strokeProps}
          />
        </g>
      ))}
      <circle cx={20} cy={76} r={1.6} fill={ACCENT} stroke="none" />

      <Label x={246} y={66}>
        MEMORY
      </Label>
      {Array.from({ length: 12 }).map((_, i) => {
        const col = i % 6;
        const row = Math.floor(i / 6);
        const on = i === 3 || i === 8;
        return (
          <rect
            key={i}
            x={200 + col * 17}
            y={72 + row * 17}
            width={13}
            height={13}
            rx={1}
            {...strokeProps}
            fill={on ? "var(--color-accent-soft)" : "none"}
            stroke={on ? ACCENT : "currentColor"}
          />
        );
      })}
    </g>
  );
}

/** Pintos: user program → syscall boundary → kernel services. */
function KernelVisual() {
  const layers = [
    { label: "USER PROGRAM", accent: false },
    { label: "SYSCALL", accent: true },
    { label: "KERNEL", accent: false },
  ];
  return (
    <g strokeOpacity={0.55}>
      {layers.map((l, i) => {
        const y = 22 + i * 30;
        return (
          <g key={l.label}>
            <rect
              x={40}
              y={y}
              width={240}
              height={22}
              rx={1}
              {...strokeProps}
              fill={l.accent ? "var(--color-accent-soft)" : "none"}
              stroke={l.accent ? ACCENT : "currentColor"}
            />
            <Label x={160} y={y + 14}>
              {l.label}
            </Label>
            {i < layers.length - 1 && (
              <>
                <line
                  x1={100}
                  y1={y + 22}
                  x2={100}
                  y2={y + 30}
                  {...strokeProps}
                />
                <line
                  x1={220}
                  y1={y + 30}
                  x2={220}
                  y2={y + 22}
                  {...strokeProps}
                />
              </>
            )}
          </g>
        );
      })}
      <circle cx={46} cy={67} r={2} fill={ACCENT} stroke="none" />
    </g>
  );
}

/** RAG agent: Docs → Chunks → Vectors → Retriever → LLM. */
function RagVisual() {
  return (
    <g strokeOpacity={0.55}>
      {/* Docs */}
      <rect x={16} y={40} width={26} height={34} rx={1} {...strokeProps} />
      <rect x={20} y={36} width={26} height={34} rx={1} {...strokeProps} />
      <Label x={33} y={88}>
        DOCS
      </Label>

      {/* Chunks */}
      {Array.from({ length: 3 }).map((_, i) => (
        <rect
          key={i}
          x={70}
          y={40 + i * 11}
          width={30}
          height={8}
          rx={1}
          {...strokeProps}
        />
      ))}
      <Label x={85} y={88}>
        CHUNKS
      </Label>

      {/* Vectors */}
      {Array.from({ length: 9 }).map((_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const on = i === 4;
        return (
          <circle
            key={i}
            cx={130 + col * 12}
            cy={44 + row * 12}
            r={2.4}
            fill={on ? ACCENT : "currentColor"}
            fillOpacity={on ? 1 : 0.4}
            stroke="none"
          />
        );
      })}
      <Label x={142} y={88}>
        VECTORS
      </Label>

      {/* Retriever */}
      <path d="M182 40 L214 48 L214 66 L182 74 Z" {...strokeProps} />
      <Label x={198} y={88}>
        RETRIEVE
      </Label>

      {/* LLM */}
      <rect
        x={244}
        y={42}
        width={44}
        height={30}
        rx={1}
        {...strokeProps}
        stroke={ACCENT}
        fill="var(--color-accent-soft)"
      />
      <Label x={266} y={60}>
        LLM
      </Label>

      {[[42, 57, 70, 52], [100, 52, 126, 56], [154, 56, 182, 57], [214, 57, 244, 57]].map(
        (l, i) => (
          <line
            key={i}
            x1={l[0]}
            y1={l[1]}
            x2={l[2]}
            y2={l[3]}
            {...strokeProps}
            strokeDasharray="2 2"
          />
        )
      )}
    </g>
  );
}

/** BridgeTalk: conversation nodes + five-axis scoring radar. */
function DialogueVisual() {
  const bubbles = [
    { x: 20, y: 34, w: 60 },
    { x: 40, y: 52, w: 46 },
    { x: 20, y: 70, w: 54 },
  ];
  const cx = 236;
  const cy = 60;
  const r = 30;
  const pts = Array.from({ length: 5 }).map((_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  const inner = [0.7, 0.9, 0.5, 0.8, 0.6];
  const innerPts = pts.map((_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    const rr = r * inner[i];
    return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)];
  });
  return (
    <g strokeOpacity={0.55}>
      {bubbles.map((b, i) => (
        <g key={i}>
          <rect
            x={b.x}
            y={b.y}
            width={b.w}
            height={12}
            rx={2}
            {...strokeProps}
            stroke={i === 1 ? ACCENT : "currentColor"}
          />
          <circle
            cx={b.x + (i === 1 ? b.w + 6 : -6)}
            cy={b.y + 6}
            r={2}
            fill={i === 1 ? ACCENT : "currentColor"}
            fillOpacity={i === 1 ? 1 : 0.4}
            stroke="none"
          />
        </g>
      ))}
      <Label x={50} y={96}>
        DIALOGUE
      </Label>

      <line x1={112} y1={60} x2={150} y2={60} {...strokeProps} strokeDasharray="2 2" />

      <polygon
        points={pts.map((p) => p.join(",")).join(" ")}
        {...strokeProps}
        strokeOpacity={0.4}
      />
      {pts.map((p, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={p[0]}
          y2={p[1]}
          {...strokeProps}
          strokeOpacity={0.3}
        />
      ))}
      <polygon
        points={innerPts.map((p) => p.join(",")).join(" ")}
        stroke={ACCENT}
        strokeWidth={1}
        fill="var(--color-accent-soft)"
        vectorEffect="non-scaling-stroke"
      />
      <Label x={cx} y={106}>
        5-AXIS SCORE
      </Label>
    </g>
  );
}

/** Unity RPG: tile map + FSM loop. */
function StateMachineVisual() {
  const tiles = [];
  const solid = new Set([2, 5, 6, 9]);
  for (let i = 0; i < 12; i++) {
    const col = i % 4;
    const row = Math.floor(i / 4);
    tiles.push(
      <rect
        key={i}
        x={18 + col * 16}
        y={36 + row * 16}
        width={14}
        height={14}
        {...strokeProps}
        fill={solid.has(i) ? "var(--color-accent-soft)" : "none"}
        stroke={solid.has(i) ? ACCENT : "currentColor"}
      />
    );
  }
  const states = ["IDLE", "MOVE", "ATK"];
  const cx = 232;
  const cy = 58;
  const r = 30;
  const nodes = states.map((s, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 3;
    return { s, x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });
  return (
    <g strokeOpacity={0.55}>
      {tiles}
      <Label x={42} y={98}>
        TILE MAP
      </Label>

      <circle
        cx={cx}
        cy={cy}
        r={r}
        {...strokeProps}
        strokeOpacity={0.3}
        strokeDasharray="3 3"
      />
      {nodes.map((n, i) => {
        const next = nodes[(i + 1) % nodes.length];
        return (
          <g key={n.s}>
            <line
              x1={n.x}
              y1={n.y}
              x2={next.x}
              y2={next.y}
              {...strokeProps}
              strokeOpacity={0.4}
            />
            <circle
              cx={n.x}
              cy={n.y}
              r={11}
              {...strokeProps}
              fill={i === 1 ? "var(--color-accent-soft)" : "var(--color-bg)"}
              stroke={i === 1 ? ACCENT : "currentColor"}
            />
            <Label x={n.x} y={n.y + 3}>
              {n.s}
            </Label>
          </g>
        );
      })}
      <Label x={cx} y={104}>
        FSM LOOP
      </Label>
    </g>
  );
}

/** PyTorch CIFAR-10: layered CNN columns. */
function NeuralNetVisual() {
  const layers = [3, 5, 5, 4, 2];
  const startX = 40;
  const gap = 58;
  const midY = 58;
  const nodePos = layers.map((count, li) => {
    const x = startX + li * gap;
    const spread = 12;
    const total = (count - 1) * spread;
    return Array.from({ length: count }).map((_, ni) => ({
      x,
      y: midY - total / 2 + ni * spread,
    }));
  });
  return (
    <g strokeOpacity={0.55}>
      {nodePos.slice(0, -1).map((layer, li) =>
        layer.map((n, ni) =>
          nodePos[li + 1].map((m, mi) => (
            <line
              key={`${li}-${ni}-${mi}`}
              x1={n.x}
              y1={n.y}
              x2={m.x}
              y2={m.y}
              {...strokeProps}
              strokeOpacity={0.14}
            />
          ))
        )
      )}
      {nodePos.map((layer, li) =>
        layer.map((n, ni) => {
          const out = li === nodePos.length - 1;
          return (
            <circle
              key={`${li}-${ni}`}
              cx={n.x}
              cy={n.y}
              r={4}
              {...strokeProps}
              fill={out ? "var(--color-accent-soft)" : "var(--color-bg)"}
              stroke={out ? ACCENT : "currentColor"}
            />
          );
        })
      )}
      <Label x={startX} y={104}>
        INPUT
      </Label>
      <Label x={startX + 4 * gap} y={104}>
        CLASS
      </Label>
    </g>
  );
}

/** Drone × LLM research: waypoint path + language node. */
function ResearchVisual() {
  const path = [
    [24, 80],
    [58, 52],
    [96, 66],
    [134, 38],
    [176, 58],
  ];
  return (
    <g strokeOpacity={0.55}>
      <polyline
        points={path.map((p) => p.join(",")).join(" ")}
        {...strokeProps}
        strokeDasharray="4 3"
      />
      {path.map((p, i) => (
        <g key={i}>
          <circle
            cx={p[0]}
            cy={p[1]}
            r={i === path.length - 1 ? 4 : 3}
            {...strokeProps}
            fill={i === path.length - 1 ? ACCENT : "var(--color-bg)"}
            stroke={i === path.length - 1 ? ACCENT : "currentColor"}
          />
          <Label x={p[0]} y={p[1] - 8}>
            {`W${i + 1}`}
          </Label>
        </g>
      ))}
      <Label x={100} y={102}>
        PATH PLAN
      </Label>

      <line x1={180} y1={58} x2={224} y2={58} {...strokeProps} strokeDasharray="2 2" />
      <rect
        x={224}
        y={42}
        width={72}
        height={32}
        rx={1}
        {...strokeProps}
        stroke={ACCENT}
        fill="var(--color-accent-soft)"
      />
      <Label x={260} y={61}>
        LLM PLANNER
      </Label>
    </g>
  );
}

/** Fallback: abstract archive marker. */
function GenericVisual() {
  return (
    <g strokeOpacity={0.5}>
      {Array.from({ length: 5 }).map((_, i) => (
        <line
          key={i}
          x1={30 + i * 8}
          y1={30}
          x2={30 + i * 8}
          y2={90}
          {...strokeProps}
          strokeOpacity={0.25}
        />
      ))}
      <rect x={120} y={42} width={80} height={36} rx={1} {...strokeProps} />
      <circle cx={132} cy={52} r={2} fill={ACCENT} stroke="none" />
      <Label x={160} y={104}>
        ARCHIVE
      </Label>
    </g>
  );
}

const VARIANTS: Record<TechnicalVisual, () => React.ReactElement> = {
  pipeline: PipelineVisual,
  emulator: EmulatorVisual,
  kernel: KernelVisual,
  rag: RagVisual,
  dialogue: DialogueVisual,
  statemachine: StateMachineVisual,
  neuralnet: NeuralNetVisual,
  research: ResearchVisual,
  generic: GenericVisual,
};

export function TechnicalThumbnail({
  variant,
  className = "",
  caption,
}: TechnicalThumbnailProps) {
  const Diagram = VARIANTS[variant] ?? GenericVisual;

  return (
    <div className={`thumbnail-frame relative ${className}`} aria-hidden="true">
      {caption ? (
        <span className="absolute right-2 top-1.5 font-mono text-[0.5625rem] uppercase tracking-wider text-muted">
          {caption}
        </span>
      ) : null}
      <svg
        viewBox="0 0 320 120"
        preserveAspectRatio="xMidYMid meet"
        className="block h-full w-full text-text"
        role="presentation"
      >
        <Diagram />
      </svg>
    </div>
  );
}
