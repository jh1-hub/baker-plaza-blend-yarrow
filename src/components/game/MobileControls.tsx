import { useRef } from "react";

type Props = {
  onMove: (x: number, y: number) => void;
  onLook: (dx: number, dy: number) => void;
  onFire: (kind: "qualitative" | "quantitative") => void;
};

export function MobileControls({ onMove, onLook, onFire }: Props) {
  const joy = useRef<HTMLDivElement>(null);
  const origin = useRef<{ x: number; y: number } | null>(null);
  const lookLast = useRef<{ x: number; y: number } | null>(null);

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <div
        className="pointer-events-auto absolute inset-0"
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest("[data-control]")) return;
          lookLast.current = { x: e.clientX, y: e.clientY };
          (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!lookLast.current) return;
          onLook(e.clientX - lookLast.current.x, e.clientY - lookLast.current.y);
          lookLast.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={() => {
          lookLast.current = null;
        }}
      />

      <div
        data-control="stick"
        ref={joy}
        className="pointer-events-auto absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))] h-28 w-28 rounded-full border border-border bg-bg-elevated/70"
        onPointerDown={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          origin.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
          e.currentTarget.setPointerCapture(e.pointerId);
          steer(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (!origin.current) return;
          steer(e.clientX, e.clientY);
        }}
        onPointerUp={() => {
          origin.current = null;
          onMove(0, 0);
        }}
      >
        <span className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg/15" />
      </div>

      <div className="pointer-events-auto absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] flex gap-3">
        <Fire
          label="質的"
          sub="Q"
          color="qual"
          onDown={() => onFire("qualitative")}
        />
        <Fire
          label="量的"
          sub="E"
          color="quant"
          onDown={() => onFire("quantitative")}
        />
      </div>
    </div>
  );

  function steer(x: number, y: number) {
    if (!origin.current) return;
    const dx = x - origin.current.x;
    const dy = y - origin.current.y;
    const r = 52;
    const nx = Math.max(-1, Math.min(1, dx / r));
    const ny = Math.max(-1, Math.min(1, -dy / r));
    onMove(nx, ny);
  }
}

function Fire({
  label,
  sub,
  color,
  onDown,
}: {
  label: string;
  sub: string;
  color: "qual" | "quant";
  onDown: () => void;
}) {
  return (
    <button
      data-control="fire"
      type="button"
      onPointerDown={(e) => {
        e.preventDefault();
        onDown();
      }}
      className={`flex h-20 w-20 flex-col items-center justify-center rounded-full border bg-bg-elevated/80 ${
        color === "qual" ? "border-qual text-qual" : "border-quant text-quant"
      }`}
    >
      <span className="text-sm font-medium">{label}</span>
      <span className="font-display text-[10px] tracking-[0.16em] opacity-70">{sub}</span>
    </button>
  );
}
