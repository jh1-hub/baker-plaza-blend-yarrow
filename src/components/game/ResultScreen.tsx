import { useGameStore } from "@/game/store";

type Props = {
  onRetry: () => void;
  onTitle: () => void;
};

function fmtTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function ResultScreen({ onRetry, onTitle }: Props) {
  const result = useGameStore((s) => s.result);
  const high = useGameStore((s) => s.highScore);
  if (!result) return null;

  return (
    <div className="absolute inset-0 z-20 overflow-y-auto bg-bg/88 px-5 py-10">
      <div className="mx-auto w-full max-w-lg">
        <p className="font-display text-xs tracking-[0.32em] text-quant">
          {result.cleared ? "MISSION COMPLETE" : "MISSION FAILED"}
        </p>
        <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight">
          {result.cleared ? "コア制圧" : "システム崩壊"}
        </h2>

        <dl className="mt-8 grid grid-cols-2 gap-2">
          <Stat k="SCORE" v={result.score.toLocaleString()} />
          <Stat k="ACCURACY" v={`${Math.round(result.accuracy * 100)}%`} />
          <Stat k="MAX COMBO" v={String(result.maxCombo)} />
          <Stat k="TIME" v={fmtTime(result.elapsed)} />
        </dl>

        <p className="font-display mt-4 text-xs tracking-[0.16em] text-subtle tabular">
          BEST {high.toLocaleString()} · STAGE {result.stageReached} · {result.correct} HIT / {result.wrong} MISS
        </p>

        <section className="hud-panel mt-8 rounded-xl p-4">
          <h3 className="font-display text-xs tracking-[0.2em] text-subtle">分析結果 · 苦手問題</h3>
          {result.weak.length === 0 ? (
            <p className="mt-3 text-sm text-qual">誤分類なし。分類精度は安定している。</p>
          ) : (
            <ol className="mt-3 space-y-2">
              {result.weak.map((w, i) => (
                <li key={w.label} className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="text-muted">{i + 1}位</span>
                  <span className="flex-1 text-fg">{w.label}</span>
                  <span className="font-display text-danger tabular">{w.misses}</span>
                </li>
              ))}
            </ol>
          )}
        </section>

        <div className="mt-8 flex flex-col gap-2">
          <button
            type="button"
            onClick={onRetry}
            className="rounded-xl bg-fg px-6 py-3.5 font-display text-sm font-semibold tracking-[0.16em] text-bg active:scale-[0.98]"
          >
            再出撃
          </button>
          <button
            type="button"
            onClick={onTitle}
            className="rounded-xl border border-border px-6 py-3 font-display text-sm tracking-[0.14em] text-muted"
          >
            タイトルへ
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="hud-panel rounded-xl px-4 py-3">
      <dt className="font-display text-[10px] tracking-[0.2em] text-subtle">{k}</dt>
      <dd className="font-display mt-1 text-2xl font-semibold tabular text-fg">{v}</dd>
    </div>
  );
}
