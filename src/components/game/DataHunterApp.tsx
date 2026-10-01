import { useEffect, useRef, useState } from "react";
import type { DataHunterGame } from "@/game/engine";
import { useGameStore } from "@/game/store";
import { HUD } from "./HUD";
import { HowToPlay } from "./HowToPlay";
import { MobileControls } from "./MobileControls";
import { PauseMenu } from "./PauseMenu";
import { ResultScreen } from "./ResultScreen";
import { TitleScreen } from "./TitleScreen";

export function DataHunterApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<DataHunterGame | null>(null);
  const screen = useGameStore((s) => s.screen);
  const isTouch = useGameStore((s) => s.isTouch);
  const muted = useGameStore((s) => s.muted);
  const [howtoFrom, setHowtoFrom] = useState<"title" | "paused">("title");

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    let game: DataHunterGame | null = null;
    void import("@/game/engine").then(({ DataHunterGame }) => {
      if (cancelled || !canvas.isConnected) return;
      game = new DataHunterGame(canvas);
      gameRef.current = game;
      setReady(true);
    });
    return () => {
      cancelled = true;
      game?.dispose();
      gameRef.current?.dispose();
      gameRef.current = null;
    };
  }, []);

  useEffect(() => {
    const onContext = (e: Event) => e.preventDefault();
    document.addEventListener("contextmenu", onContext);
    return () => document.removeEventListener("contextmenu", onContext);
  }, []);

  const start = () => gameRef.current?.startRun();
  const resume = () => gameRef.current?.resume();
  const pause = () => gameRef.current?.pause();
  const abort = () => gameRef.current?.abortToTitle();

  return (
    <main
      className={`relative h-dvh w-full overflow-hidden bg-bg text-fg ${screen === "playing" ? "cursor-none" : ""}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 size-full touch-none"
        onClick={() => {
          if (screen === "playing") gameRef.current?.tryLock();
        }}
      />
      <div className="vignette absolute inset-0 z-[1]" />
      <div className="scanlines absolute inset-0 z-[2]" />

      {screen === "title" ? (
        <TitleScreen
          onStart={start}
          onHowTo={() => {
            setHowtoFrom("title");
            useGameStore.setState({ screen: "howto" });
          }}
          ready={ready}
        />
      ) : null}

      {screen === "howto" ? (
        <HowToPlay
          onBack={() =>
            useGameStore.setState({ screen: howtoFrom === "paused" ? "paused" : "title" })
          }
        />
      ) : null}

      {screen === "playing" ? (
        <>
          <HUD onPause={pause} />
          {isTouch ? (
            <MobileControls
              onMove={(x, y) => gameRef.current?.setMoveAxis(x, y)}
              onLook={(dx, dy) => gameRef.current?.lookDelta(dx, dy)}
              onFire={(kind) => gameRef.current?.fireShot(kind)}
            />
          ) : null}
        </>
      ) : null}

      {screen === "paused" ? (
        <PauseMenu
          onResume={resume}
          onHowTo={() => {
            setHowtoFrom("paused");
            useGameStore.setState({ screen: "howto" });
          }}
          onAbort={abort}
          onMute={() => gameRef.current?.setMuted(!muted)}
        />
      ) : null}

      {screen === "result" ? <ResultScreen onRetry={start} onTitle={abort} /> : null}
    </main>
  );
}
