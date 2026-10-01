import { i as __toESM } from "../_runtime.mjs";
import { G as require_jsx_runtime, K as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BQ0PKT1Y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var KEY = "data-hunter-v1";
function loadSave() {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return {
			version: 1,
			highScore: 0
		};
		const parsed = JSON.parse(raw);
		return {
			version: 1,
			highScore: Number(parsed.highScore) || 0
		};
	} catch {
		return {
			version: 1,
			highScore: 0
		};
	}
}
function writeHighScore(score) {
	const prev = loadSave();
	const highScore = Math.max(prev.highScore, score);
	const next = {
		version: 1,
		highScore
	};
	localStorage.setItem(KEY, JSON.stringify(next));
	return highScore;
}
var saved = loadSave();
var useGameStore = create(() => ({
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
	isTouch: false
}));
function fmtTime$1(sec) {
	return `${Math.floor(sec / 60)}:${Math.floor(sec % 60).toString().padStart(2, "0")}`;
}
function HUD({ onPause }) {
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
	const hitAge = hitmarker ? performance.now() / 1e3 - hitmarker.at : 99;
	const showHit = hitmarker && hitAge < .2;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 z-30",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3 p-4 pt-[max(1rem,env(safe-area-inset-top))]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hud-panel min-w-0 rounded-lg px-3 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-[10px] tracking-[0.22em] text-quant",
							children: stageCode
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm text-fg",
							children: stageName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-display mt-1 text-xs text-muted tabular",
							children: [
								"REST ",
								remaining,
								" · COMBO ",
								combo
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex gap-1",
							children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 w-2.5 rounded-sm ${i < lives ? "bg-danger" : "bg-border"}` }, i))
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hud-panel rounded-lg px-3 py-2 text-right",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-[10px] tracking-[0.22em] text-subtle",
							children: "SCORE"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl font-semibold tabular leading-none",
							children: score
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display mt-1 text-xs text-muted tabular",
							children: fmtTime$1(elapsed)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onPause,
							className: "pointer-events-auto mt-2 min-h-9 w-full rounded-md border border-border px-2 font-display text-[10px] tracking-[0.16em] text-fg",
							children: "PAUSE"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute left-4 top-28 flex gap-2",
				children: [scan ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hud-panel rounded-md px-2 py-1 font-display text-[10px] tracking-[0.16em] text-qual",
					children: "SCAN"
				}) : null, slow ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hud-panel rounded-md px-2 py-1 font-display text-[10px] tracking-[0.16em] text-quant",
					children: "SLOW"
				}) : null]
			}),
			boss ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mt-1 w-[min(92%,28rem)] px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hud-panel rounded-lg px-3 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-[10px] tracking-[0.2em] text-danger",
								children: boss.final ? "DATA CORE" : "BOSS"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm text-fg",
								children: boss.prompt
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 h-1.5 overflow-hidden rounded-full bg-bg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-danger",
								style: { width: `${boss.hp / Math.max(1, boss.maxHp) * 100}%` }
							})
						}),
						boss.final ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1.5 h-1 overflow-hidden rounded-full bg-bg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-quant",
								style: { width: `${boss.timer / Math.max(.01, boss.timerMax) * 100}%` }
							})
						}) : null
					]
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative h-10 w-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute left-0 top-1/2 h-px w-3 bg-qual" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute right-0 top-1/2 h-px w-3 bg-quant" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-fg/80" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute bottom-0 left-1/2 h-3 w-px -translate-x-1/2 bg-fg/80" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute left-1/2 top-1/2 h-0.5 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg" })
					]
				}), showHit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 border-2 ${hitmarker.ok ? "border-qual" : "border-danger"}`,
					style: { animation: "hit-pop 180ms var(--ease-out) both" }
				}) : null]
			}),
			banner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute left-1/2 top-[28%] w-[min(92%,28rem)] -translate-x-1/2 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-2xl font-semibold tracking-[0.18em] text-fg sm:text-3xl",
					style: { animation: "banner-in 280ms var(--ease-smooth-out) both" },
					children: banner
				})
			}) : null,
			comboLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute left-1/2 top-[38%] -translate-x-1/2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg tracking-[0.28em] text-qual sm:text-xl",
					style: { animation: "combo-burst 1100ms var(--ease-out) both" },
					children: comboLabel
				})
			}) : null,
			feedback ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-[22%] left-1/2 w-[min(92%,26rem)] -translate-x-1/2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `hud-panel rounded-xl px-4 py-3 ${feedback.ok ? "" : "border-danger/40"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `text-sm font-medium ${feedback.ok ? "text-qual" : "text-danger"}`,
						children: feedback.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs leading-relaxed text-muted text-pretty",
						children: feedback.detail
					})]
				})
			}) : null,
			!isTouch ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-0 right-0 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-display text-[10px] tracking-[0.14em] text-subtle",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-qual",
							children: "質 Q"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mx-2 text-border",
							children: "/"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-quant",
							children: "量 E"
						}),
						!locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-2 text-muted",
							children: "CLICK LOCK"
						}) : null
					]
				})
			}) : null
		]
	});
}
function HowToPlay({ onBack }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-20 overflow-y-auto bg-bg/88 px-5 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-lg pb-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xs tracking-[0.3em] text-quant",
					children: "BRIEFING"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display mt-2 text-3xl font-semibold tracking-tight",
					children: "操作説明"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-relaxed text-muted text-pretty",
					children: "迫るデータターゲットを見て、質的か量的かを瞬時に分類しろ。数字でも識別番号なら質的だ。 ターゲットは照準の正面から接近する。マウスで追えば足りる。"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-xs tracking-[0.2em] text-subtle",
						children: "CONTROLS"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "hud-panel divide-y divide-border rounded-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "マウス移動 / ドラッグ",
								v: "照準"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "左クリック / Q / 1",
								v: "質的ショット",
								accent: "qual"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "右クリック / E / 2",
								v: "量的ショット",
								accent: "quant"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "WASD",
								v: "任意（敵は正面から接近）"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Shift",
								v: "ダッシュ"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Esc",
								v: "一時停止"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hud-panel rounded-xl p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-[10px] tracking-[0.2em] text-qual",
								children: "質的データ"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-fg",
								children: "性別・血液型・郵便番号・出席番号・電話番号・学籍番号・社員番号"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs leading-relaxed text-muted",
								children: "数字でも識別のための番号なら、大小比較に意味はない。"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hud-panel rounded-xl p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-[10px] tracking-[0.2em] text-quant",
								children: "量的データ"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-fg",
								children: "身長・体重・年齢・売上高・気温・得点"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs leading-relaxed text-muted",
								children: "測れて、平均や合計、大小比較ができる数値。"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-xs tracking-[0.2em] text-subtle",
						children: "HIT RULES"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: "分類を間違えても命中すればダメージは入る。ただしライフは減り、コンボは途切れる。接触されてもライフを失う。"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-xs tracking-[0.2em] text-subtle",
						children: "POWER"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: "SCANは5秒間、質的を緑・量的を青で表示。SLOWは敵速度を半減。BOMBは画面内の敵を全撃破。"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onBack,
					className: "mt-10 w-full rounded-xl bg-fg px-6 py-3.5 font-display text-sm font-semibold tracking-[0.16em] text-bg active:scale-[0.98]",
					children: "戻る"
				})
			]
		})
	});
}
function Row({ k, v, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex items-center justify-between gap-4 px-4 py-3 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: accent === "qual" ? "text-qual" : accent === "quant" ? "text-quant" : "text-fg",
			children: v
		})]
	});
}
function MobileControls({ onMove, onLook, onFire }) {
	const joy = (0, import_react.useRef)(null);
	const origin = (0, import_react.useRef)(null);
	const lookLast = (0, import_react.useRef)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 z-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-auto absolute inset-0",
				onPointerDown: (e) => {
					if (e.target.closest("[data-control]")) return;
					lookLast.current = {
						x: e.clientX,
						y: e.clientY
					};
					e.currentTarget.setPointerCapture(e.pointerId);
				},
				onPointerMove: (e) => {
					if (!lookLast.current) return;
					onLook(e.clientX - lookLast.current.x, e.clientY - lookLast.current.y);
					lookLast.current = {
						x: e.clientX,
						y: e.clientY
					};
				},
				onPointerUp: () => {
					lookLast.current = null;
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"data-control": "stick",
				ref: joy,
				className: "pointer-events-auto absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))] h-28 w-28 rounded-full border border-border bg-bg-elevated/70",
				onPointerDown: (e) => {
					const r = e.currentTarget.getBoundingClientRect();
					origin.current = {
						x: r.left + r.width / 2,
						y: r.top + r.height / 2
					};
					e.currentTarget.setPointerCapture(e.pointerId);
					steer(e.clientX, e.clientY);
				},
				onPointerMove: (e) => {
					if (!origin.current) return;
					steer(e.clientX, e.clientY);
				},
				onPointerUp: () => {
					origin.current = null;
					onMove(0, 0);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg/15" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-auto absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fire, {
					label: "質的",
					sub: "Q",
					color: "qual",
					onDown: () => onFire("qualitative")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fire, {
					label: "量的",
					sub: "E",
					color: "quant",
					onDown: () => onFire("quantitative")
				})]
			})
		]
	});
	function steer(x, y) {
		if (!origin.current) return;
		const dx = x - origin.current.x;
		const dy = y - origin.current.y;
		const r = 52;
		onMove(Math.max(-1, Math.min(1, dx / r)), Math.max(-1, Math.min(1, -dy / r)));
	}
}
function Fire({ label, sub, color, onDown }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		"data-control": "fire",
		type: "button",
		onPointerDown: (e) => {
			e.preventDefault();
			onDown();
		},
		className: `flex h-20 w-20 flex-col items-center justify-center rounded-full border bg-bg-elevated/80 ${color === "qual" ? "border-qual text-qual" : "border-quant text-quant"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-medium",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-display text-[10px] tracking-[0.16em] opacity-70",
			children: sub
		})]
	});
}
function PauseMenu({ onResume, onHowTo, onAbort, onMute }) {
	const muted = useGameStore((s) => s.muted);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-30 flex items-center justify-center bg-bg/78 px-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hud-panel w-full max-w-sm rounded-2xl p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xs tracking-[0.3em] text-subtle",
					children: "PAUSED"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display mt-1 text-2xl font-semibold",
					children: "一時停止"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-col gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onResume,
							className: "rounded-xl bg-fg px-5 py-3 font-display text-sm font-semibold tracking-[0.14em] text-bg active:scale-[0.98]",
							children: "再開"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onHowTo,
							className: "rounded-xl border border-border px-5 py-3 font-display text-sm tracking-[0.12em] text-fg",
							children: "操作説明"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onMute,
							className: "rounded-xl border border-border px-5 py-3 font-display text-sm tracking-[0.12em] text-fg",
							children: muted ? "サウンド ON" : "サウンド OFF"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onAbort,
							className: "rounded-xl px-5 py-3 font-display text-sm tracking-[0.12em] text-danger",
							children: "ミッション中止"
						})
					]
				})
			]
		})
	});
}
function fmtTime(sec) {
	return `${Math.floor(sec / 60)}:${Math.floor(sec % 60).toString().padStart(2, "0")}`;
}
function ResultScreen({ onRetry, onTitle }) {
	const result = useGameStore((s) => s.result);
	const high = useGameStore((s) => s.highScore);
	if (!result) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-20 overflow-y-auto bg-bg/88 px-5 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xs tracking-[0.32em] text-quant",
					children: result.cleared ? "MISSION COMPLETE" : "MISSION FAILED"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display mt-2 text-3xl font-semibold tracking-tight",
					children: result.cleared ? "コア制圧" : "システム崩壊"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-8 grid grid-cols-2 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							k: "SCORE",
							v: result.score.toLocaleString()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							k: "ACCURACY",
							v: `${Math.round(result.accuracy * 100)}%`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							k: "MAX COMBO",
							v: String(result.maxCombo)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							k: "TIME",
							v: fmtTime(result.elapsed)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-display mt-4 text-xs tracking-[0.16em] text-subtle tabular",
					children: [
						"BEST ",
						high.toLocaleString(),
						" · STAGE ",
						result.stageReached,
						" · ",
						result.correct,
						" HIT / ",
						result.wrong,
						" MISS"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "hud-panel mt-8 rounded-xl p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-xs tracking-[0.2em] text-subtle",
						children: "分析結果 · 苦手問題"
					}), result.weak.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-qual",
						children: "誤分類なし。分類精度は安定している。"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-3 space-y-2",
						children: result.weak.map((w, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-baseline justify-between gap-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted",
									children: [i + 1, "位"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1 text-fg",
									children: w.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-danger tabular",
									children: w.misses
								})
							]
						}, w.label))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onRetry,
						className: "rounded-xl bg-fg px-6 py-3.5 font-display text-sm font-semibold tracking-[0.16em] text-bg active:scale-[0.98]",
						children: "再出撃"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onTitle,
						className: "rounded-xl border border-border px-6 py-3 font-display text-sm tracking-[0.14em] text-muted",
						children: "タイトルへ"
					})]
				})
			]
		})
	});
}
function Stat({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hud-panel rounded-xl px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "font-display text-[10px] tracking-[0.2em] text-subtle",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "font-display mt-1 text-2xl font-semibold tabular text-fg",
			children: v
		})]
	});
}
function TitleScreen({ onStart, onHowTo, ready }) {
	const highScore = useGameStore((s) => s.highScore);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 z-20 flex flex-col items-center justify-center px-5 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-bg/55" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex w-full max-w-lg flex-col items-center text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xs tracking-[0.42em] text-quant",
					children: "DATA RESEARCH FACILITY"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "font-display mt-4 text-[clamp(2.75rem,12vw,5.5rem)] font-semibold leading-[0.9] tracking-tight text-fg text-balance [text-shadow:0_4px_28px_rgb(5_8_12_/_0.9)]",
					children: [
						"DATA",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"HUNTER"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted text-pretty",
					children: "質的データ vs 量的データ"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs leading-relaxed text-subtle text-pretty",
					children: "ターゲットは正面から接近する。マウスで照準し、左右クリックで分類せよ。"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 grid w-full grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hud-panel rounded-lg px-3 py-3 text-left",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-[10px] tracking-[0.2em] text-qual",
								children: "LMB / Q"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm font-medium text-fg",
								children: "質的ショット"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: "分類・識別・番号"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hud-panel rounded-lg px-3 py-3 text-left",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-[10px] tracking-[0.2em] text-quant",
								children: "RMB / E"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm font-medium text-fg",
								children: "量的ショット"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: "測定・大小・平均"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: !ready,
					onClick: onStart,
					className: "mt-8 w-full rounded-xl bg-fg px-6 py-3.5 font-display text-sm font-semibold tracking-[0.18em] text-bg transition-transform duration-[var(--motion-quick)] hover:opacity-90 active:scale-[0.98] disabled:opacity-40",
					children: ready ? "ミッション開始" : "SYSTEM BOOT"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onHowTo,
					className: "mt-3 w-full rounded-xl border border-border bg-transparent px-6 py-3 font-display text-sm tracking-[0.14em] text-muted transition-colors hover:text-fg",
					children: "操作説明"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-display mt-8 text-xs tracking-[0.18em] text-subtle tabular",
					children: ["BEST ", highScore.toLocaleString()]
				})
			]
		})]
	});
}
function DataHunterApp() {
	const canvasRef = (0, import_react.useRef)(null);
	const gameRef = (0, import_react.useRef)(null);
	const screen = useGameStore((s) => s.screen);
	const isTouch = useGameStore((s) => s.isTouch);
	const muted = useGameStore((s) => s.muted);
	const [howtoFrom, setHowtoFrom] = (0, import_react.useState)("title");
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		let cancelled = false;
		let game = null;
		import("./engine-Bk7r7HJv.mjs").then(({ DataHunterGame }) => {
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
	(0, import_react.useEffect)(() => {
		const onContext = (e) => e.preventDefault();
		document.addEventListener("contextmenu", onContext);
		return () => document.removeEventListener("contextmenu", onContext);
	}, []);
	const start = () => gameRef.current?.startRun();
	const resume = () => gameRef.current?.resume();
	const pause = () => gameRef.current?.pause();
	const abort = () => gameRef.current?.abortToTitle();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: `relative h-dvh w-full overflow-hidden bg-bg text-fg ${screen === "playing" ? "cursor-none" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				className: "absolute inset-0 size-full touch-none",
				onClick: () => {
					if (screen === "playing") gameRef.current?.tryLock();
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "vignette absolute inset-0 z-[1]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "scanlines absolute inset-0 z-[2]" }),
			screen === "title" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleScreen, {
				onStart: start,
				onHowTo: () => {
					setHowtoFrom("title");
					useGameStore.setState({ screen: "howto" });
				},
				ready
			}) : null,
			screen === "howto" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HowToPlay, { onBack: () => useGameStore.setState({ screen: howtoFrom === "paused" ? "paused" : "title" }) }) : null,
			screen === "playing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HUD, { onPause: pause }), isTouch ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileControls, {
				onMove: (x, y) => gameRef.current?.setMoveAxis(x, y),
				onLook: (dx, dy) => gameRef.current?.lookDelta(dx, dy),
				onFire: (kind) => gameRef.current?.fireShot(kind)
			}) : null] }) : null,
			screen === "paused" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PauseMenu, {
				onResume: resume,
				onHowTo: () => {
					setHowtoFrom("paused");
					useGameStore.setState({ screen: "howto" });
				},
				onAbort: abort,
				onMute: () => gameRef.current?.setMuted(!muted)
			}) : null,
			screen === "result" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultScreen, {
				onRetry: start,
				onTitle: abort
			}) : null
		]
	});
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataHunterApp, {});
}
//#endregion
export { useGameStore as n, writeHighScore as r, routes_exports as t };
