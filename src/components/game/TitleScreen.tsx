import { useGameStore } from "@/game/store";

type Props = {
  onStart: () => void;
  onHowTo: () => void;
  ready: boolean;
};

export function TitleScreen({ onStart, onHowTo, ready }: Props) {
  const highScore = useGameStore((s) => s.highScore);

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-5 py-10">
      <div className="absolute inset-0 bg-bg/55" />
      <div className="relative flex w-full max-w-lg flex-col items-center text-center">
        <p className="font-display text-xs tracking-[0.42em] text-quant">DATA RESEARCH FACILITY</p>
        <h1 className="font-display mt-4 text-[clamp(2.75rem,12vw,5.5rem)] font-semibold leading-[0.9] tracking-tight text-fg text-balance [text-shadow:0_4px_28px_rgb(5_8_12_/_0.9)]">
          DATA
          <br />
          HUNTER
        </h1>
        <p className="mt-4 text-sm text-muted text-pretty">質的データ vs 量的データ</p>
        <p className="mt-2 text-xs leading-relaxed text-subtle text-pretty">
          ターゲットは正面から接近する。マウスで照準し、左右クリックで分類せよ。
        </p>

        <div className="mt-8 grid w-full grid-cols-2 gap-2">
          <div className="hud-panel rounded-lg px-3 py-3 text-left">
            <p className="font-display text-[10px] tracking-[0.2em] text-qual">LMB / Q</p>
            <p className="mt-1 text-sm font-medium text-fg">質的ショット</p>
            <p className="mt-1 text-xs text-muted">分類・識別・番号</p>
          </div>
          <div className="hud-panel rounded-lg px-3 py-3 text-left">
            <p className="font-display text-[10px] tracking-[0.2em] text-quant">RMB / E</p>
            <p className="mt-1 text-sm font-medium text-fg">量的ショット</p>
            <p className="mt-1 text-xs text-muted">測定・大小・平均</p>
          </div>
        </div>

        <button
          type="button"
          disabled={!ready}
          onClick={onStart}
          className="mt-8 w-full rounded-xl bg-fg px-6 py-3.5 font-display text-sm font-semibold tracking-[0.18em] text-bg transition-transform duration-[var(--motion-quick)] hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
        >
          {ready ? "ミッション開始" : "SYSTEM BOOT"}
        </button>
        <button
          type="button"
          onClick={onHowTo}
          className="mt-3 w-full rounded-xl border border-border bg-transparent px-6 py-3 font-display text-sm tracking-[0.14em] text-muted transition-colors hover:text-fg"
        >
          操作説明
        </button>

        <p className="font-display mt-8 text-xs tracking-[0.18em] text-subtle tabular">
          BEST {highScore.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
