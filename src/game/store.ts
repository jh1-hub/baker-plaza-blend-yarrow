import { create } from "zustand";
import type { BossHud, Feedback, ResultStats, Screen } from "./types";
import { loadSave } from "./save";

export type GameUI = {
  screen: Screen;
  score: number;
  combo: number;
  comboLabel: string | null;
  comboFlash: number;
  lives: number;
  stage: number;
  stageName: string;
  stageCode: string;
  remaining: number;
  elapsed: number;
  feedback: Feedback;
  banner: string | null;
  scan: boolean;
  slow: boolean;
  boss: BossHud;
  hitmarker: { ok: boolean; at: number } | null;
  locked: boolean;
  muted: boolean;
  highScore: number;
  result: ResultStats | null;
  isTouch: boolean;
};

const saved = loadSave();

export const useGameStore = create<GameUI>(() => ({
  screen: "title",
  score: 0,
  combo: 0,
  comboLabel: null,
  comboFlash: 0,
  lives: 5,
  stage: 1,
  stageName: "基礎訓練",
  stageCode: "STAGE 01",
  remaining: 0,
  elapsed: 0,
  feedback: null,
  banner: null,
  scan: false,
  slow: false,
  boss: null,
  hitmarker: null,
  locked: false,
  muted: false,
  highScore: saved.highScore,
  result: null,
  isTouch: false,
}));
