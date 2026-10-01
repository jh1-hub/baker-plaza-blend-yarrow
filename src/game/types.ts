export type DataKind = "qualitative" | "quantitative";

export type EnemyType = "drone" | "fast" | "heavy" | "split" | "mini";

export type Screen = "title" | "howto" | "playing" | "paused" | "result";

export type RunPhase =
  | "attract"
  | "intro"
  | "wave"
  | "bossIntro"
  | "boss"
  | "finalBoss"
  | "stageClear"
  | "victory"
  | "dead";

export type Question = {
  id: string;
  label: string;
  kind: DataKind;
  explanation: string;
  trap?: boolean;
};

export type StageDef = {
  id: number;
  code: string;
  name: string;
  quota: number;
  speed: number;
  spawnInterval: number;
  maxAlive: number;
  types: EnemyType[];
  pool: string[];
  boss: Question;
};

export type Feedback = {
  title: string;
  detail: string;
  ok: boolean;
} | null;

export type BossHud = {
  name: string;
  hp: number;
  maxHp: number;
  prompt: string;
  timer: number;
  timerMax: number;
  final: boolean;
} | null;

export type WeakItem = {
  label: string;
  misses: number;
};

export type ResultStats = {
  score: number;
  accuracy: number;
  maxCombo: number;
  elapsed: number;
  stageReached: number;
  cleared: boolean;
  weak: WeakItem[];
  correct: number;
  wrong: number;
};

export type PowerupKind = "scan" | "slow" | "bomb";

export type ControlsProbe = {
  getYaw: () => number;
  getSpeed: () => number;
  setKeys: (codes: string[]) => void;
  getPos: () => { x: number; z: number };
  getEnemies?: () => { dist: number; inFront: boolean; ang: number }[];
};

declare global {
  interface Window {
    __controlsTest?: ControlsProbe;
  }
}
