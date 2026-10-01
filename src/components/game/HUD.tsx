import { useGameStore } from "@/game/store";

function fmtTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function HUD({ onPause }: { onPause: () => void }) {
  const score = useGameStore((s) => s.score);
  const combo = useGameStore((s) => s.combo);
  const comboLabel = useGameStore((s) => s.comboLabel);
  const lives = useGameStore((s) => s.lives);
  const stageCode = useGameStore((s) => s.stageCode);
  const stageName = useGameStore((s) => s.stageName);
  const remaining = useGameStore((s) => s.remaining);
  const elapsed = useGameStore((s) => s.elapsed);
  const feedback = useGameStore((s) => s.feedback);
  const banner = useGameStore((s) => s.banner);
  const scan = useGameStore((s) => s.scan);
  const slow = useGameStore((s) => s.slow);
  const boss = useGameStore((s) => s.boss);
  const hitmarker = useGameStore((s) => s.hitmarker);
  const locked = useGameStore((s) => s.locked);
  const isTouch = useGameStore((s) => s.isTouch);

  const hitAge = hitmarker ? performance.now() / 1000 - hitmarker.at : 99;
  const showHit = hitmarker && hitAge < 0.2;

  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      <div className="flex items-start justify-between gap-3 p-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="hud-panel min-w-0 rounded-lg px-3 py-2">
          <p className="font-display text-[10px] tracking-[0.22em] text-quant">{stageCode}</p>
          <p className="truncate text-sm text-fg">{stageName}</p>
          <p className="font-display mt-1 text-xs text-muted tabular">
            REST {remaining} · COMBO {combo}
          </p>
          <div className="mt-2 flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-2.5 rounded-sm ${i < lives ? "bg-danger" : "bg-border"}`}
              />
            ))}
          </div>
        </div>
        <div className="hud-panel rounded-lg px-3 py-2 text-right">
          <p className="font-display text-[10px] tracking-[0.22em] text-subtle">SCORE</p>
          <p className="font-display text-xl font-semibold tabular leading-none">{score}</p>
          <p className="font-display mt-1 text-xs text-muted tabular">{fmtTime(elapsed)}</p>
          <button
            type="button"
            onClick={onPause}
            className="pointer-events-auto mt-2 min-h-9 w-full rounded-md border border-border px-2 font-display text-[10px] tracking-[0.16em] text-fg"
          >
            PAUSE
          </button>
        </div>
      </div>

      <div className="absolute left-4 top-28 flex gap-2">
        {scan ? (
          <span className="hud-panel rounded-md px-2 py-1 font-display text-[10px] tracking-[0.16em] text-qual">
            SCAN
          </span>
        ) : null}
        {slow ? (
          <span className="hud-panel rounded-md px-2 py-1 font-display text-[10px] tracking-[0.16em] text-quant">
            SLOW
          </span>
        ) : null}
      </div>

      {boss ? (
        <div className="mx-auto mt-1 w-[min(92%,28rem)] px-4">
          <div className="hud-panel rounded-lg px-3 py-2">
            <div className="flex items-center justify-between gap-3">
              <p className="font-display text-[10px] tracking-[0.2em] text-danger">
                {boss.final ? "DATA CORE" : "BOSS"}
              </p>
              <p className="truncate text-sm text-fg">{boss.prompt}</p>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg">
              <div
                className="h-full rounded-full bg-danger"
                style={{ width: `${(boss.hp / Math.max(1, boss.maxHp)) * 100}%` }}
              />
            </div>
            {boss.final ? (
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-bg">
                <div
                  className="h-full rounded-full bg-quant"
                  style={{ width: `${(boss.timer / Math.max(0.01, boss.timerMax)) * 100}%` }}
                />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative h-10 w-10">
          <span className="absolute left-0 top-1/2 h-px w-3 bg-qual" />
          <span className="absolute right-0 top-1/2 h-px w-3 bg-quant" />
          <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-fg/80" />
          <span className="absolute bottom-0 left-1/2 h-3 w-px -translate-x-1/2 bg-fg/80" />
          <span className="absolute left-1/2 top-1/2 h-0.5 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg" />
        </div>
        {showHit ? (
          <div
            className={`absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 border-2 ${hitmarker.ok ? "border-qual" : "border-danger"}`}
            style={{ animation: "hit-pop 180ms var(--ease-out) both" }}
          />
        ) : null}
      </div>

      {banner ? (
        <div className="absolute left-1/2 top-[28%] w-[min(92%,28rem)] -translate-x-1/2 text-center">
          <p
            className="font-display text-2xl font-semibold tracking-[0.18em] text-fg sm:text-3xl"
            style={{ animation: "banner-in 280ms var(--ease-smooth-out) both" }}
          >
            {banner}
          </p>
        </div>
      ) : null}

      {comboLabel ? (
        <div className="absolute left-1/2 top-[38%] -translate-x-1/2">
          <p
            className="font-display text-lg tracking-[0.28em] text-qual sm:text-xl"
            style={{ animation: "combo-burst 1100ms var(--ease-out) both" }}
          >
            {comboLabel}
          </p>
        </div>
      ) : null}

      {feedback ? (
        <div className="absolute bottom-[22%] left-1/2 w-[min(92%,26rem)] -translate-x-1/2">
          <div className={`hud-panel rounded-xl px-4 py-3 ${feedback.ok ? "" : "border-danger/40"}`}>
            <p className={`text-sm font-medium ${feedback.ok ? "text-qual" : "text-danger"}`}>
              {feedback.title}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted text-pretty">{feedback.detail}</p>
          </div>
        </div>
      ) : null}

      {!isTouch ? (
        <div className="absolute bottom-0 right-0 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <p className="font-display text-[10px] tracking-[0.14em] text-subtle">
            <span className="text-qual">質 Q</span>
            <span className="mx-2 text-border">/</span>
            <span className="text-quant">量 E</span>
            {!locked ? <span className="ml-2 text-muted">CLICK LOCK</span> : null}
          </p>
        </div>
      ) : null}
    </div>
  );
}
