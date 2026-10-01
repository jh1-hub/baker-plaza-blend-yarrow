const KEY = "data-hunter-v1";

type SaveData = {
  version: 1;
  highScore: number;
};

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { version: 1, highScore: 0 };
    const parsed = JSON.parse(raw) as Partial<SaveData>;
    return { version: 1, highScore: Number(parsed.highScore) || 0 };
  } catch {
    return { version: 1, highScore: 0 };
  }
}

export function writeHighScore(score: number) {
  const prev = loadSave();
  const highScore = Math.max(prev.highScore, score);
  const next: SaveData = { version: 1, highScore };
  localStorage.setItem(KEY, JSON.stringify(next));
  return highScore;
}
