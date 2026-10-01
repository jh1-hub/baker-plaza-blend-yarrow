type Props = {
  onBack: () => void;
};

export function HowToPlay({ onBack }: Props) {
  return (
    <div className="absolute inset-0 z-20 overflow-y-auto bg-bg/88 px-5 py-10">
      <div className="mx-auto w-full max-w-lg pb-10">
        <p className="font-display text-xs tracking-[0.3em] text-quant">BRIEFING</p>
        <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight">操作説明</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted text-pretty">
          迫るデータターゲットを見て、質的か量的かを瞬時に分類しろ。数字でも識別番号なら質的だ。
          ターゲットは照準の正面から接近する。マウスで追えば足りる。
        </p>

        <section className="mt-8 space-y-3">
          <h3 className="font-display text-xs tracking-[0.2em] text-subtle">CONTROLS</h3>
          <ul className="hud-panel divide-y divide-border rounded-xl">
            <Row k="マウス移動 / ドラッグ" v="照準" />
            <Row k="左クリック / Q / 1" v="質的ショット" accent="qual" />
            <Row k="右クリック / E / 2" v="量的ショット" accent="quant" />
            <Row k="WASD" v="任意（敵は正面から接近）" />
            <Row k="Shift" v="ダッシュ" />
            <Row k="Esc" v="一時停止" />
          </ul>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="hud-panel rounded-xl p-4">
            <p className="font-display text-[10px] tracking-[0.2em] text-qual">質的データ</p>
            <p className="mt-2 text-sm leading-relaxed text-fg">
              性別・血液型・郵便番号・出席番号・電話番号・学籍番号・社員番号・住所・曜日・ISBN
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              数字でも識別のための番号なら、大小比較に意味はない。
            </p>
          </div>
          <div className="hud-panel rounded-xl p-4">
            <p className="font-display text-[10px] tracking-[0.2em] text-quant">量的データ</p>
            <p className="mt-2 text-sm leading-relaxed text-fg">
              身長・体重・年齢・売上高・気温・得点・時間・在庫数・偏差値
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              測れて、平均や合計、大小比較ができる数値。
            </p>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="font-display text-xs tracking-[0.2em] text-subtle">HIT RULES</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            分類を間違えても命中すればダメージは入る。ただしライフは減り、コンボは途切れる。接触されてもライフを失う。
          </p>
        </section>

        <section className="mt-8">
          <h3 className="font-display text-xs tracking-[0.2em] text-subtle">POWER</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            SCANは5秒間、質的を緑・量的を青で表示。SLOWは敵速度を半減。BOMBは画面内の敵を全撃破。
          </p>
        </section>

        <button
          type="button"
          onClick={onBack}
          className="mt-10 w-full rounded-xl bg-fg px-6 py-3.5 font-display text-sm font-semibold tracking-[0.16em] text-bg active:scale-[0.98]"
        >
          戻る
        </button>
      </div>
    </div>
  );
}

function Row({
  k,
  v,
  accent,
}: {
  k: string;
  v: string;
  accent?: "qual" | "quant";
}) {
  return (
    <li className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
      <span className="text-muted">{k}</span>
      <span className={accent === "qual" ? "text-qual" : accent === "quant" ? "text-quant" : "text-fg"}>
        {v}
      </span>
    </li>
  );
}
