import { useGameStore } from "@/game/store";

type Props = {
  onResume: () => void;
  onHowTo: () => void;
  onAbort: () => void;
  onMute: () => void;
};

export function PauseMenu({ onResume, onHowTo, onAbort, onMute }: Props) {
  const muted = useGameStore((s) => s.muted);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-bg/78 px-5">
      <div className="hud-panel w-full max-w-sm rounded-2xl p-6">
        <p className="font-display text-xs tracking-[0.3em] text-subtle">PAUSED</p>
        <h2 className="font-display mt-1 text-2xl font-semibold">一時停止</h2>
        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={onResume}
            className="rounded-xl bg-fg px-5 py-3 font-display text-sm font-semibold tracking-[0.14em] text-bg active:scale-[0.98]"
          >
            再開
          </button>
          <button
            type="button"
            onClick={onHowTo}
            className="rounded-xl border border-border px-5 py-3 font-display text-sm tracking-[0.12em] text-fg"
          >
            操作説明
          </button>
          <button
            type="button"
            onClick={onMute}
            className="rounded-xl border border-border px-5 py-3 font-display text-sm tracking-[0.12em] text-fg"
          >
            {muted ? "サウンド ON" : "サウンド OFF"}
          </button>
          <button
            type="button"
            onClick={onAbort}
            className="rounded-xl px-5 py-3 font-display text-sm tracking-[0.12em] text-danger"
          >
            ミッション中止
          </button>
        </div>
      </div>
    </div>
  );
}
