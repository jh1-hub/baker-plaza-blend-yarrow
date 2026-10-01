import { n as useGameStore, r as writeHighScore } from "./routes-BQ0PKT1Y.mjs";
import { A as Sprite, C as PointLight, D as Scene, E as SRGBColorSpace, F as Vector2, I as Vector3, M as TetrahedronGeometry, N as Timer, O as SphereGeometry, P as TorusGeometry, S as PlaneGeometry, T as RepeatWrapping, _ as MeshBasicMaterial, a as Color, b as OctahedronGeometry, c as DirectionalLight, d as HemisphereLight, f as IcosahedronGeometry, g as Mesh, h as MathUtils, i as CanvasTexture, j as SpriteMaterial, k as SpotLight, l as Fog, m as LineBasicMaterial, n as BoxGeometry, o as ConeGeometry, p as Line, r as BufferGeometry, s as CylinderGeometry, t as WebGLRenderer, u as Group, v as MeshStandardMaterial, w as Raycaster, x as PerspectiveCamera, y as Object3D } from "../_libs/three.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/engine-Bk7r7HJv.js
var GameAudio = class {
	ctx = null;
	master = null;
	sfx = null;
	music = null;
	muted = false;
	musicTimer = null;
	step = 0;
	unlock() {
		if (!this.ctx) {
			const AC = window.AudioContext || window.webkitAudioContext;
			this.ctx = new AC({ latencyHint: "interactive" });
			this.master = this.ctx.createGain();
			this.sfx = this.ctx.createGain();
			this.music = this.ctx.createGain();
			this.sfx.gain.value = .7;
			this.music.gain.value = .18;
			this.master.gain.value = this.muted ? 0 : .85;
			this.sfx.connect(this.master);
			this.music.connect(this.master);
			this.master.connect(this.ctx.destination);
		}
		if (this.ctx.state === "suspended") this.ctx.resume();
	}
	setMuted(muted) {
		this.muted = muted;
		if (this.master && this.ctx) this.master.gain.setTargetAtTime(muted ? 0 : .85, this.ctx.currentTime, .03);
	}
	resume() {
		if (this.ctx?.state === "suspended") this.ctx.resume();
	}
	tone(freq, dur, type, gain = .12, dest, slide) {
		if (!this.ctx || !this.sfx || !this.music) return;
		const t = this.ctx.currentTime;
		const osc = this.ctx.createOscillator();
		const g = this.ctx.createGain();
		osc.type = type;
		osc.frequency.setValueAtTime(freq, t);
		if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, slide), t + dur);
		g.gain.setValueAtTime(1e-4, t);
		g.gain.exponentialRampToValueAtTime(gain, t + .012);
		g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
		osc.connect(g);
		g.connect(dest ?? this.sfx);
		osc.start(t);
		osc.stop(t + dur + .02);
	}
	noise(dur, gain = .08, hp = 800) {
		if (!this.ctx || !this.sfx) return;
		const n = this.ctx.sampleRate * dur;
		const buf = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
		const data = buf.getChannelData(0);
		for (let i = 0; i < n; i++) data[i] = Math.random() * 2 - 1;
		const src = this.ctx.createBufferSource();
		src.buffer = buf;
		const filter = this.ctx.createBiquadFilter();
		filter.type = "highpass";
		filter.frequency.value = hp;
		const g = this.ctx.createGain();
		const t = this.ctx.currentTime;
		g.gain.setValueAtTime(gain, t);
		g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
		src.connect(filter);
		filter.connect(g);
		g.connect(this.sfx);
		src.start(t);
		src.stop(t + dur + .02);
	}
	shoot(kind) {
		const jitter = .94 + Math.random() * .12;
		if (kind === "qualitative") {
			this.tone(1480 * jitter, .09, "square", .07, void 0, 420);
			this.tone(2960 * jitter, .05, "square", .03);
		} else {
			this.tone(420 * jitter, .11, "sawtooth", .08, void 0, 180);
			this.tone(880 * jitter, .06, "square", .04);
		}
		this.noise(.04, .04, 1200);
	}
	hit() {
		this.tone(920, .07, "square", .05, void 0, 1400);
		this.noise(.05, .06, 600);
	}
	kill() {
		this.tone(240, .16, "sawtooth", .1, void 0, 70);
		this.noise(.12, .1, 300);
	}
	wrong() {
		this.tone(180, .22, "square", .1, void 0, 90);
		this.tone(190, .22, "sawtooth", .06);
	}
	damage() {
		this.tone(90, .28, "sawtooth", .14, void 0, 40);
		this.noise(.2, .12, 200);
	}
	pickup() {
		this.tone(660, .08, "square", .06);
		this.tone(990, .1, "square", .05);
		this.tone(1320, .12, "square", .04);
	}
	combo() {
		this.tone(520, .08, "square", .05);
		this.tone(780, .1, "square", .05);
		this.tone(1040, .14, "square", .05);
	}
	bomb() {
		this.tone(80, .4, "sawtooth", .16, void 0, 30);
		this.noise(.35, .18, 150);
	}
	startMusic() {
		this.stopMusic();
		if (!this.ctx || !this.music) return;
		const tick = () => {
			if (!this.ctx || !this.music) return;
			const root = this.step % 8 === 7 ? 55 : this.step % 4 === 0 ? 82 : 73;
			this.tone(root, .18, "sawtooth", .07, this.music);
			if (this.step % 2 === 0) this.tone(root * 2, .05, "square", .02, this.music);
			this.step += 1;
			this.musicTimer = window.setTimeout(tick, 220);
		};
		tick();
	}
	stopMusic() {
		if (this.musicTimer != null) {
			clearTimeout(this.musicTimer);
			this.musicTimer = null;
		}
	}
};
var QUESTIONS = {
	gender: {
		id: "gender",
		label: "性別",
		kind: "qualitative",
		explanation: "性別は分類のための属性であり、数値の大小比較に意味はない。質的データである。"
	},
	blood: {
		id: "blood",
		label: "血液型",
		kind: "qualitative",
		explanation: "血液型はA・B・Oなどのカテゴリであり、平均や合計に意味はない。質的データである。"
	},
	name: {
		id: "name",
		label: "氏名",
		kind: "qualitative",
		explanation: "氏名は識別のためのラベルであり、数値ではない。質的データである。"
	},
	hometown: {
		id: "hometown",
		label: "出身地",
		kind: "qualitative",
		explanation: "出身地は場所の分類であり、大小比較に意味はない。質的データである。"
	},
	color: {
		id: "color",
		label: "好きな色",
		kind: "qualitative",
		explanation: "好きな色はカテゴリであり、平均を取る対象ではない。質的データである。"
	},
	job: {
		id: "job",
		label: "職業",
		kind: "qualitative",
		explanation: "職業は分類ラベルであり、量の大小ではない。質的データである。"
	},
	nation: {
		id: "nation",
		label: "国籍",
		kind: "qualitative",
		explanation: "国籍はカテゴリであり、数値化しても計算対象にはならない。質的データである。"
	},
	club: {
		id: "club",
		label: "部活動",
		kind: "qualitative",
		explanation: "部活動は所属の分類であり、質的データである。"
	},
	weather: {
		id: "weather",
		label: "天気（晴／雨）",
		kind: "qualitative",
		explanation: "晴・雨はカテゴリであり、降水量とは違う。質的データである。"
	},
	rank: {
		id: "rank",
		label: "順位",
		kind: "qualitative",
		explanation: "順位は順序尺度であり、情報Ⅰでは質的データ（順序）として扱う。差に意味はない。"
	},
	grade: {
		id: "grade",
		label: "学年",
		kind: "qualitative",
		explanation: "学年はカテゴリ（1年・2年…）であり、身長のような量ではない。質的データである。"
	},
	className: {
		id: "className",
		label: "クラス名",
		kind: "qualitative",
		explanation: "クラス名は識別ラベルであり、質的データである。"
	},
	zip: {
		id: "zip",
		label: "郵便番号",
		kind: "qualitative",
		trap: true,
		explanation: "郵便番号は数字で表されるが、識別のための番号であり、大小比較に意味はない。したがって質的データである。"
	},
	attend: {
		id: "attend",
		label: "出席番号",
		kind: "qualitative",
		trap: true,
		explanation: "出席番号は数字だが、個人を識別するための番号であり、大きいほど何かが多いわけではない。質的データである。"
	},
	phone: {
		id: "phone",
		label: "電話番号",
		kind: "qualitative",
		trap: true,
		explanation: "電話番号は数字の並びだが、かけ算や平均に意味はない。識別番号なので質的データである。"
	},
	studentId: {
		id: "studentId",
		label: "学籍番号",
		kind: "qualitative",
		trap: true,
		explanation: "学籍番号は数字で書かれるが、学生を識別するための番号である。大小比較に意味はないので質的データである。"
	},
	employee: {
		id: "employee",
		label: "社員番号",
		kind: "qualitative",
		trap: true,
		explanation: "社員番号は識別コードであり、番号が大きいほど能力が高いわけではない。質的データである。"
	},
	member: {
		id: "member",
		label: "会員番号",
		kind: "qualitative",
		trap: true,
		explanation: "会員番号は識別のための番号であり、量ではない。質的データである。"
	},
	seat: {
		id: "seat",
		label: "座席番号",
		kind: "qualitative",
		trap: true,
		explanation: "座席番号は場所の識別であり、合計や平均に意味はない。質的データである。"
	},
	room: {
		id: "room",
		label: "部屋番号",
		kind: "qualitative",
		trap: true,
		explanation: "部屋番号は識別ラベルであり、数値として計算しない。質的データである。"
	},
	jersey: {
		id: "jersey",
		label: "背番号",
		kind: "qualitative",
		trap: true,
		explanation: "背番号は選手を識別する番号であり、大きさに意味はない。質的データである。"
	},
	sku: {
		id: "sku",
		label: "商品コード",
		kind: "qualitative",
		trap: true,
		explanation: "商品コードは識別記号であり、量的な測定値ではない。質的データである。"
	},
	plate: {
		id: "plate",
		label: "ナンバープレート",
		kind: "qualitative",
		trap: true,
		explanation: "ナンバープレートの数字は識別用であり、大小比較に意味はない。質的データである。"
	},
	insurance: {
		id: "insurance",
		label: "保険証番号",
		kind: "qualitative",
		trap: true,
		explanation: "保険証番号は個人を識別する番号であり、質的データである。"
	},
	height: {
		id: "height",
		label: "身長",
		kind: "quantitative",
		explanation: "身長はcmなどの単位で測れ、平均・合計・大小比較に意味がある。量的データである。"
	},
	weight: {
		id: "weight",
		label: "体重",
		kind: "quantitative",
		explanation: "体重は測定可能な量であり、平均を取れる。量的データである。"
	},
	age: {
		id: "age",
		label: "年齢",
		kind: "quantitative",
		explanation: "年齢は数値として差や平均に意味がある。量的データである。"
	},
	sales: {
		id: "sales",
		label: "売上高",
		kind: "quantitative",
		explanation: "売上高は金額という量であり、合計や比較ができる。量的データである。"
	},
	temp: {
		id: "temp",
		label: "気温",
		kind: "quantitative",
		explanation: "気温は数値で測れ、高低の比較に意味がある。量的データである。"
	},
	score: {
		id: "score",
		label: "得点",
		kind: "quantitative",
		explanation: "得点は数値であり、合計や平均が意味を持つ。量的データである。"
	},
	count: {
		id: "count",
		label: "人数",
		kind: "quantitative",
		explanation: "人数は数えられる量であり、量的データである。"
	},
	distance: {
		id: "distance",
		label: "距離",
		kind: "quantitative",
		explanation: "距離は測定可能な量であり、量的データである。"
	},
	speed: {
		id: "speed",
		label: "速度",
		kind: "quantitative",
		explanation: "速度は数値で表され、大小比較ができる。量的データである。"
	},
	area: {
		id: "area",
		label: "面積",
		kind: "quantitative",
		explanation: "面積は測定量であり、量的データである。"
	},
	rain: {
		id: "rain",
		label: "降水量",
		kind: "quantitative",
		explanation: "降水量はmmなどの単位で測る量であり、量的データである。"
	},
	sleep: {
		id: "sleep",
		label: "睡眠時間",
		kind: "quantitative",
		explanation: "睡眠時間は時間という量であり、平均できる。量的データである。"
	},
	steps: {
		id: "steps",
		label: "歩数",
		kind: "quantitative",
		explanation: "歩数は数えられる量であり、量的データである。"
	},
	bpm: {
		id: "bpm",
		label: "心拍数",
		kind: "quantitative",
		explanation: "心拍数は測定値であり、高低の比較ができる。量的データである。"
	},
	price: {
		id: "price",
		label: "価格",
		kind: "quantitative",
		explanation: "価格は金額という量であり、量的データである。"
	},
	pop: {
		id: "pop",
		label: "人口",
		kind: "quantitative",
		explanation: "人口は人数という量であり、量的データである。"
	},
	humidity: {
		id: "humidity",
		label: "湿度",
		kind: "quantitative",
		explanation: "湿度は数値で測れ、比較できる。量的データである。"
	},
	testScore: {
		id: "testScore",
		label: "テストの点数",
		kind: "quantitative",
		explanation: "テストの点数は得点という量であり、平均や合計に意味がある。量的データである。"
	},
	reaction: {
		id: "reaction",
		label: "反応時間",
		kind: "quantitative",
		explanation: "反応時間は秒という量であり、量的データである。"
	},
	calorie: {
		id: "calorie",
		label: "消費カロリー",
		kind: "quantitative",
		explanation: "消費カロリーは測定可能な量であり、量的データである。"
	}
};
var ALL_IDS = Object.keys(QUESTIONS);
var STAGES = [
	{
		id: 1,
		code: "STAGE 01",
		name: "基礎訓練",
		quota: 10,
		speed: 2.55,
		spawnInterval: 1.65,
		maxAlive: 3,
		types: ["drone"],
		pool: [
			"gender",
			"blood",
			"height",
			"weight",
			"age"
		],
		boss: {
			id: "boss1",
			label: "クラス全員の出席番号",
			kind: "qualitative",
			trap: true,
			explanation: "出席番号は数字だが識別のための番号であり、大小比較に意味はない。質的データである。"
		}
	},
	{
		id: 2,
		code: "STAGE 02",
		name: "実戦演習",
		quota: 14,
		speed: 3.35,
		spawnInterval: 1.25,
		maxAlive: 4,
		types: ["drone", "fast"],
		pool: [
			"attend",
			"zip",
			"phone",
			"height",
			"temp"
		],
		boss: {
			id: "boss2",
			label: "全国の郵便番号",
			kind: "qualitative",
			trap: true,
			explanation: "郵便番号は数字で表されるが、識別のための番号であり、大小比較に意味はない。したがって質的データである。"
		}
	},
	{
		id: 3,
		code: "STAGE 03",
		name: "データ汚染区域",
		quota: 18,
		speed: 4.05,
		spawnInterval: .95,
		maxAlive: 6,
		types: [
			"drone",
			"fast",
			"heavy"
		],
		pool: [
			"studentId",
			"sales",
			"employee",
			"weight",
			"score"
		],
		boss: {
			id: "boss3",
			label: "商品Aの売上高",
			kind: "quantitative",
			explanation: "売上高は金額という量であり、合計や比較ができる。量的データである。"
		}
	},
	{
		id: 4,
		code: "STAGE 04",
		name: "統計研究所",
		quota: 24,
		speed: 4.55,
		spawnInterval: .72,
		maxAlive: 8,
		types: [
			"drone",
			"fast",
			"heavy",
			"split"
		],
		pool: ALL_IDS,
		boss: {
			id: "boss4",
			label: "今日の最高気温",
			kind: "quantitative",
			explanation: "最高気温は数値で測れ、高低の比較に意味がある。量的データである。"
		}
	},
	{
		id: 5,
		code: "STAGE 05",
		name: "DATA CORE",
		quota: 20,
		speed: 5.15,
		spawnInterval: .55,
		maxAlive: 10,
		types: [
			"drone",
			"fast",
			"heavy",
			"split"
		],
		pool: ALL_IDS,
		boss: {
			id: "boss5",
			label: "AIデータコア",
			kind: "qualitative",
			explanation: "最終コアは連続分類で制圧する。"
		}
	}
];
var FINAL_SEQUENCE = [
	QUESTIONS.phone,
	QUESTIONS.sales,
	QUESTIONS.studentId,
	QUESTIONS.weight,
	QUESTIONS.zip,
	QUESTIONS.temp,
	QUESTIONS.attend,
	QUESTIONS.testScore,
	QUESTIONS.employee,
	QUESTIONS.height
];
function comboRank(combo) {
	if (combo >= 30) return {
		label: "DATA MASTER",
		mult: 5
	};
	if (combo >= 20) return {
		label: "EXCELLENT",
		mult: 3
	};
	if (combo >= 10) return {
		label: "GREAT",
		mult: 2
	};
	if (combo >= 5) return {
		label: "GOOD",
		mult: 1.5
	};
	return {
		label: null,
		mult: 1
	};
}
function pickQuestion(pool, avoid = []) {
	const ids = pool.filter((id) => QUESTIONS[id]);
	const fresh = ids.filter((id) => !avoid.includes(id));
	const use = fresh.length ? fresh : ids;
	return QUESTIONS[use[Math.floor(Math.random() * use.length)] ?? ids[0] ?? "height"] ?? QUESTIONS.height;
}
function pickEnemyType(types, stageId) {
	const roll = Math.random();
	if (types.includes("split") && roll > .84) return "split";
	if (types.includes("heavy") && roll > .68) return "heavy";
	if (types.includes("fast") && roll > .42) return "fast";
	if (types.includes("fast") && stageId >= 5 && roll > .28) return "fast";
	return "drone";
}
var COLOR = {
	qual: 3800967,
	quant: 3066879,
	danger: 16726862,
	warn: 16761162,
	white: 15266036,
	dim: 9149098
};
var STEP = 1 / 60;
var ARENA = 13;
var EYE = 1.64;
var QUAL = new Color(COLOR.qual);
var QUANT = new Color(COLOR.quant);
var DANGER = new Color(COLOR.danger);
function now() {
	return performance.now() / 1e3;
}
function makeGridTexture() {
	const c = document.createElement("canvas");
	c.width = 512;
	c.height = 512;
	const g = c.getContext("2d");
	g.fillStyle = "#070b10";
	g.fillRect(0, 0, 512, 512);
	g.strokeStyle = "#1a3344";
	g.lineWidth = 2;
	for (let i = 0; i <= 512; i += 64) {
		g.beginPath();
		g.moveTo(i, 0);
		g.lineTo(i, 512);
		g.stroke();
		g.beginPath();
		g.moveTo(0, i);
		g.lineTo(512, i);
		g.stroke();
	}
	g.strokeStyle = "#2ecbff";
	g.globalAlpha = .45;
	g.lineWidth = 4;
	g.strokeRect(2, 2, 508, 508);
	const t = new CanvasTexture(c);
	t.wrapS = t.wrapT = RepeatWrapping;
	t.repeat.set(18, 18);
	t.colorSpace = SRGBColorSpace;
	t.anisotropy = 8;
	return t;
}
function makeLabelTexture(text, tint) {
	const c = document.createElement("canvas");
	c.width = 768;
	c.height = 192;
	const g = c.getContext("2d");
	g.clearRect(0, 0, 768, 192);
	const pad = 18;
	g.fillStyle = "rgba(5,8,12,0.82)";
	roundRect(g, pad, 36, 732, 120, 18);
	g.fill();
	g.lineWidth = 4;
	g.strokeStyle = tint ?? "rgba(232,240,244,0.55)";
	g.stroke();
	g.fillStyle = tint ?? "#e8f0f4";
	g.font = "700 64px 'Noto Sans JP', sans-serif";
	g.textAlign = "center";
	g.textBaseline = "middle";
	g.fillText(text, 384, 96, 680);
	const tex = new CanvasTexture(c);
	tex.colorSpace = SRGBColorSpace;
	tex.needsUpdate = true;
	return tex;
}
function roundRect(g, x, y, w, h, r) {
	g.beginPath();
	g.moveTo(x + r, y);
	g.arcTo(x + w, y, x + w, y + h, r);
	g.arcTo(x + w, y + h, x, y + h, r);
	g.arcTo(x, y + h, x, y, r);
	g.arcTo(x, y, x + w, y, r);
	g.closePath();
}
var DataHunterGame = class {
	canvas;
	renderer;
	scene;
	camera;
	yawObj;
	pitchObj;
	overlayScene;
	overlayCam;
	gun;
	gunBase = new Vector3(.3, -.24, -.58);
	core;
	hologram;
	holoTex = null;
	audio = new GameAudio();
	keys = /* @__PURE__ */ new Set();
	raycaster = new Raycaster();
	clock = new Timer();
	acc = 0;
	raf = 0;
	disposed = false;
	reduced = false;
	pointerLocked = false;
	lookDx = 0;
	lookDy = 0;
	touchMove = {
		x: 0,
		y: 0
	};
	yaw = 0;
	pitch = 0;
	vel = new Vector3();
	bob = 0;
	recoil = 0;
	trauma = 0;
	hitstop = 0;
	timeScale = 1;
	muzzle = 0;
	muzzleKind = "qualitative";
	cooldown = 0;
	invuln = 0;
	fireHeld = null;
	phase = "attract";
	stageIndex = 0;
	quotaLeft = 0;
	spawnCd = 0;
	phaseT = 0;
	runTime = 0;
	score = 0;
	combo = 0;
	maxCombo = 0;
	lives = 5;
	correct = 0;
	wrong = 0;
	misses = {};
	recent = [];
	scanUntil = 0;
	slowUntil = 0;
	bannerUntil = 0;
	feedbackUntil = 0;
	comboFlashUntil = 0;
	lastComboLabel = null;
	idSeq = 1;
	enemies = [];
	pickups = [];
	sparks = [];
	tracers = [];
	bossHp = 0;
	bossMax = 0;
	finalIdx = 0;
	finalTime = 0;
	finalMax = 6.4;
	attractT = 0;
	muted = false;
	playing = false;
	tmp = new Vector3();
	tmp2 = new Vector3();
	forward = new Vector3();
	right = new Vector3();
	geoms = [];
	mats = [];
	textures = [];
	sparkGeo;
	sparkMat;
	muzzleLight;
	resizeObs;
	boundKeyDown;
	boundKeyUp;
	boundMouseMove;
	boundMouseDown;
	boundMouseUp;
	boundContext;
	boundLock;
	boundVis;
	boundBlur;
	boundPointerMove;
	constructor(canvas) {
		this.canvas = canvas;
		this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		this.renderer = new WebGLRenderer({
			canvas,
			antialias: false,
			alpha: false,
			powerPreference: "high-performance"
		});
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
		this.renderer.setClearColor(329740, 1);
		this.renderer.outputColorSpace = SRGBColorSpace;
		this.renderer.autoClear = false;
		this.renderer.toneMapping = 4;
		this.renderer.toneMappingExposure = 1.05;
		this.scene = new Scene();
		this.scene.fog = new Fog(329740, 10, 34);
		this.scene.background = new Color(329740);
		this.camera = new PerspectiveCamera(78, 1, .05, 80);
		this.yawObj = new Object3D();
		this.pitchObj = new Object3D();
		this.yawObj.position.set(0, EYE, 8);
		this.pitchObj.add(this.camera);
		this.yawObj.add(this.pitchObj);
		this.scene.add(this.yawObj);
		this.overlayScene = new Scene();
		this.overlayCam = new PerspectiveCamera(60, 1, .05, 5);
		this.gun = this.createGun();
		this.overlayScene.add(this.overlayCam);
		this.overlayCam.add(this.gun);
		const gLight = new HemisphereLight(10477567, 526344, .9);
		this.overlayScene.add(gLight);
		this.muzzleLight = new PointLight(COLOR.qual, 0, 3);
		this.gun.add(this.muzzleLight);
		this.muzzleLight.position.set(0, .02, -.55);
		this.sparkGeo = new SphereGeometry(1, 6, 6);
		this.sparkMat = new MeshBasicMaterial({
			color: 16777215,
			transparent: true,
			opacity: 1,
			depthWrite: false
		});
		this.geoms.push(this.sparkGeo);
		this.mats.push(this.sparkMat);
		this.core = this.buildWorld();
		this.hologram = this.makeHologram();
		this.scene.add(this.hologram);
		this.hologram.position.set(0, 4.15, 0);
		this.boundKeyDown = (e) => this.onKey(e, true);
		this.boundKeyUp = (e) => this.onKey(e, false);
		this.boundMouseMove = (e) => this.onMouseMove(e);
		this.boundMouseDown = (e) => this.onMouseDown(e);
		this.boundMouseUp = (e) => this.onMouseUp(e);
		this.boundContext = (e) => e.preventDefault();
		this.boundLock = () => this.onLock();
		this.boundVis = () => {
			if (document.visibilityState === "visible") this.audio.resume();
		};
		this.boundBlur = () => this.keys.clear();
		this.boundPointerMove = (e) => {
			if (!this.playing) return;
			if (e.pointerType === "touch" || e.pointerType === "pen") {
				if (e.buttons || e.pressure > 0) {
					this.lookDx += e.movementX;
					this.lookDy += e.movementY;
				}
			}
		};
		window.addEventListener("keydown", this.boundKeyDown);
		window.addEventListener("keyup", this.boundKeyUp);
		window.addEventListener("blur", this.boundBlur);
		document.addEventListener("pointerlockchange", this.boundLock);
		document.addEventListener("visibilitychange", this.boundVis);
		canvas.addEventListener("mousemove", this.boundMouseMove);
		canvas.addEventListener("mousedown", this.boundMouseDown);
		window.addEventListener("mouseup", this.boundMouseUp);
		canvas.addEventListener("contextmenu", this.boundContext);
		canvas.addEventListener("pointermove", this.boundPointerMove);
		this.resizeObs = new ResizeObserver(() => this.resize());
		this.resizeObs.observe(canvas);
		this.resize();
		const touch = window.matchMedia("(pointer: coarse)").matches;
		useGameStore.setState({
			isTouch: touch,
			highScore: useGameStore.getState().highScore
		});
		window.__controlsTest = {
			getYaw: () => this.yaw,
			getSpeed: () => Math.hypot(this.vel.x, this.vel.z),
			setKeys: (codes) => {
				this.keys.clear();
				for (const c of codes) this.keys.add(c);
			},
			getPos: () => ({
				x: this.yawObj.position.x,
				z: this.yawObj.position.z
			}),
			getEnemies: () => {
				const p = this.yawObj.position;
				const fx = -Math.sin(this.yaw);
				const fz = -Math.cos(this.yaw);
				const rx = Math.cos(this.yaw);
				const rz = -Math.sin(this.yaw);
				return this.enemies.map((e) => {
					const dx = e.group.position.x - p.x;
					const dz = e.group.position.z - p.z;
					const dist = Math.hypot(dx, dz);
					const fwd = dx * fx + dz * fz;
					const side = dx * rx + dz * rz;
					return {
						dist,
						inFront: fwd > .2,
						ang: Math.atan2(side, fwd)
					};
				});
			}
		};
		this.clock.connect(document);
		this.raf = requestAnimationFrame(this.loop);
		this.pushStore();
	}
	resize() {
		const w = Math.max(1, this.canvas.clientWidth);
		const h = Math.max(1, this.canvas.clientHeight);
		this.renderer.setSize(w, h, false);
		this.camera.aspect = w / h;
		this.camera.updateProjectionMatrix();
		this.overlayCam.aspect = w / h;
		this.overlayCam.updateProjectionMatrix();
	}
	createGun() {
		const g = new Group();
		const dark = new MeshStandardMaterial({
			color: 1185822,
			metalness: .7,
			roughness: .35
		});
		const mid = new MeshStandardMaterial({
			color: 2766144,
			metalness: .5,
			roughness: .4
		});
		const qualM = new MeshStandardMaterial({
			color: 1057304,
			emissive: QUAL,
			emissiveIntensity: .9
		});
		const quantM = new MeshStandardMaterial({
			color: 793636,
			emissive: QUANT,
			emissiveIntensity: .9
		});
		this.mats.push(dark, mid, qualM, quantM);
		const body = new Mesh(new BoxGeometry(.18, .14, .55), dark);
		body.position.set(0, 0, 0);
		const stock = new Mesh(new BoxGeometry(.1, .12, .22), mid);
		stock.position.set(.02, -.04, .32);
		const barrelL = new Mesh(new CylinderGeometry(.028, .034, .42, 8), qualM);
		barrelL.rotation.x = Math.PI / 2;
		barrelL.position.set(-.05, .03, -.38);
		const barrelR = new Mesh(new CylinderGeometry(.028, .034, .42, 8), quantM);
		barrelR.rotation.x = Math.PI / 2;
		barrelR.position.set(.05, .03, -.38);
		const mag = new Mesh(new BoxGeometry(.08, .18, .12), mid);
		mag.position.set(0, -.14, .02);
		const sight = new Mesh(new BoxGeometry(.04, .06, .08), dark);
		sight.position.set(0, .1, -.08);
		const glass = new Mesh(new BoxGeometry(.05, .04, .01), new MeshBasicMaterial({
			color: 10418120,
			transparent: true,
			opacity: .55
		}));
		glass.position.set(0, .12, -.12);
		this.mats.push(glass.material);
		g.add(body, stock, barrelL, barrelR, mag, sight, glass);
		g.position.copy(this.gunBase);
		return g;
	}
	buildWorld() {
		const grid = makeGridTexture();
		this.textures.push(grid);
		const floorMat = new MeshStandardMaterial({
			map: grid,
			roughness: .82,
			metalness: .18,
			color: 10135732
		});
		const wallMat = new MeshStandardMaterial({
			color: 857116,
			roughness: .9,
			metalness: .1
		});
		const neonQ = new MeshBasicMaterial({ color: COLOR.qual });
		const neonC = new MeshBasicMaterial({ color: COLOR.quant });
		const rack = new MeshStandardMaterial({
			color: 1383460,
			metalness: .45,
			roughness: .4,
			emissive: 266264,
			emissiveIntensity: .4
		});
		this.mats.push(floorMat, wallMat, neonQ, neonC, rack);
		const floor = new Mesh(new PlaneGeometry(40, 40), floorMat);
		floor.rotation.x = -Math.PI / 2;
		this.scene.add(floor);
		const ceil = new Mesh(new PlaneGeometry(40, 40), wallMat);
		ceil.rotation.x = Math.PI / 2;
		ceil.position.y = 6.2;
		this.scene.add(ceil);
		const wallH = 6.2;
		const wallGeo = new PlaneGeometry(40, wallH);
		this.geoms.push(wallGeo, floor.geometry, ceil.geometry);
		const walls = [
			[
				0,
				wallH / 2,
				-20,
				0
			],
			[
				0,
				wallH / 2,
				20,
				Math.PI
			],
			[
				-20,
				wallH / 2,
				0,
				Math.PI / 2
			],
			[
				20,
				wallH / 2,
				0,
				-Math.PI / 2
			]
		];
		for (const [x, y, z, rot] of walls) {
			const m = new Mesh(wallGeo, wallMat);
			m.position.set(x, y, z);
			m.rotation.y = rot;
			this.scene.add(m);
		}
		const stripGeo = new BoxGeometry(40, .06, .08);
		this.geoms.push(stripGeo);
		for (const z of [-19.7, 19.7]) {
			const s = new Mesh(stripGeo, neonC);
			s.position.set(0, .04, z);
			this.scene.add(s);
		}
		const stripZ = new BoxGeometry(.08, .06, 40);
		this.geoms.push(stripZ);
		for (const x of [-19.7, 19.7]) {
			const s = new Mesh(stripZ, neonQ);
			s.position.set(x, .04, 0);
			this.scene.add(s);
		}
		const pillarGeo = new BoxGeometry(1.2, 6.2, 1.2);
		this.geoms.push(pillarGeo);
		for (const [x, z] of [
			[-10, -10],
			[10, -10],
			[-10, 10],
			[10, 10]
		]) {
			const p = new Mesh(pillarGeo, rack);
			p.position.set(x, 3.1, z);
			this.scene.add(p);
			const edge = new Mesh(new BoxGeometry(.08, 6.2, .08), neonC);
			edge.position.set(x + .6, 3.1, z + .6);
			this.scene.add(edge);
		}
		const rackGeo = new BoxGeometry(1.4, 2.4, .7);
		this.geoms.push(rackGeo);
		for (let i = -3; i <= 3; i++) {
			if (i === 0) continue;
			const a = new Mesh(rackGeo, rack);
			a.position.set(i * 3.2, 1.2, -18.6);
			this.scene.add(a);
			const b = new Mesh(rackGeo, rack);
			b.position.set(i * 3.2, 1.2, 18.6);
			this.scene.add(b);
		}
		this.scene.add(new HemisphereLight(3824240, 526348, .55));
		const dir = new DirectionalLight(12047588, .35);
		dir.position.set(6, 12, 4);
		this.scene.add(dir);
		const p1 = new PointLight(COLOR.quant, 1.4, 18);
		p1.position.set(-8, 3.4, -8);
		const p2 = new PointLight(COLOR.qual, 1.2, 18);
		p2.position.set(8, 3.4, 8);
		this.scene.add(p1, p2);
		const spot = new SpotLight(13625599, 1.1, 28, .7, .45, 1.2);
		this.pitchObj.add(spot);
		spot.position.set(0, .1, .2);
		spot.target.position.set(0, 0, -6);
		this.pitchObj.add(spot.target);
		const core = new Group();
		const ringGeo = new TorusGeometry(1.8, .05, 8, 48);
		const ringMat = new MeshBasicMaterial({
			color: COLOR.quant,
			transparent: true,
			opacity: .55
		});
		const ringMat2 = new MeshBasicMaterial({
			color: COLOR.qual,
			transparent: true,
			opacity: .4
		});
		this.geoms.push(ringGeo);
		this.mats.push(ringMat, ringMat2);
		const r1 = new Mesh(ringGeo, ringMat);
		r1.rotation.x = Math.PI / 2;
		const r2 = new Mesh(ringGeo, ringMat2);
		r2.rotation.x = Math.PI / 3;
		const ball = new Mesh(new IcosahedronGeometry(.9, 1), new MeshStandardMaterial({
			color: 659992,
			emissive: 667712,
			emissiveIntensity: .8,
			metalness: .3,
			roughness: .35,
			wireframe: true
		}));
		this.mats.push(ball.material);
		this.geoms.push(ball.geometry);
		core.add(r1, r2, ball);
		core.position.set(0, 2.4, 0);
		core.name = "core";
		this.scene.add(core);
		return core;
	}
	makeHologram() {
		const geo = new PlaneGeometry(3.4, .9);
		this.geoms.push(geo);
		const mat = new MeshBasicMaterial({
			transparent: true,
			opacity: 0,
			depthWrite: false
		});
		this.mats.push(mat);
		const m = new Mesh(geo, mat);
		m.position.set(0, 1.6, 0);
		m.visible = false;
		return m;
	}
	setHologram(text, kind) {
		const tex = makeLabelTexture(text, kind ? kind === "qualitative" ? "#39ff87" : "#2ecbff" : "#e8f0f4");
		this.textures.push(tex);
		const mat = this.hologram.material;
		if (this.holoTex) this.holoTex.dispose();
		this.holoTex = tex;
		mat.map = tex;
		mat.opacity = 1;
		mat.needsUpdate = true;
		this.hologram.visible = true;
	}
	startRun() {
		this.audio.unlock();
		this.audio.startMusic();
		this.playing = true;
		this.phase = "intro";
		this.stageIndex = 0;
		this.score = 0;
		this.combo = 0;
		this.maxCombo = 0;
		this.lives = 5;
		this.correct = 0;
		this.wrong = 0;
		this.misses = {};
		this.recent = [];
		this.runTime = 0;
		this.scanUntil = 0;
		this.slowUntil = 0;
		this.yaw = 0;
		this.pitch = 0;
		this.vel.set(0, 0, 0);
		this.yawObj.position.set(0, EYE, 8);
		this.yawObj.quaternion.identity();
		this.pitchObj.quaternion.identity();
		this.yawObj.rotation.set(0, 0, 0);
		this.pitchObj.rotation.set(0, 0, 0);
		this.core.traverse((o) => {
			o.userData = {};
		});
		this.clearEntities();
		this.beginStage();
		this.tryLock();
		useGameStore.setState({
			screen: "playing",
			result: null
		});
		this.pushStore();
	}
	tryLock() {
		const el = this.canvas;
		try {
			const p = el.requestPointerLock({ unadjustedMovement: true });
			if (p && typeof p.catch === "function") p.catch(() => el.requestPointerLock());
		} catch {
			try {
				el.requestPointerLock();
			} catch {}
		}
	}
	pause() {
		if (!this.playing || this.phase === "victory" || this.phase === "dead") return;
		this.playing = false;
		if (document.pointerLockElement) document.exitPointerLock();
		useGameStore.setState({ screen: "paused" });
	}
	resume() {
		if (useGameStore.getState().screen !== "paused") return;
		this.playing = true;
		this.tryLock();
		useGameStore.setState({ screen: "playing" });
	}
	abortToTitle() {
		this.playing = false;
		this.phase = "attract";
		this.clearEntities();
		this.hologram.visible = false;
		this.audio.stopMusic();
		if (document.pointerLockElement) document.exitPointerLock();
		useGameStore.setState({
			screen: "title",
			banner: null,
			feedback: null,
			boss: null
		});
		this.pushStore();
	}
	setMuted(muted) {
		this.muted = muted;
		this.audio.setMuted(muted);
		useGameStore.setState({ muted });
	}
	setMoveAxis(x, y) {
		this.touchMove.x = x;
		this.touchMove.y = y;
	}
	lookDelta(dx, dy) {
		this.lookDx += dx;
		this.lookDy += dy;
	}
	fireShot(kind) {
		if (!this.playing) return;
		if (this.phase === "intro" || this.phase === "stageClear" || this.phase === "bossIntro") return;
		this.tryShoot(kind);
	}
	onKey(e, down) {
		if (down && (e.code === "Space" || e.code === "ArrowUp" || e.code === "ArrowDown" || e.code === "ArrowLeft" || e.code === "ArrowRight")) e.preventDefault();
		if (e.code === "Escape" && down) {
			if (useGameStore.getState().screen === "playing") this.pause();
			return;
		}
		if (e.repeat) return;
		if (down) this.keys.add(e.code);
		else this.keys.delete(e.code);
		if (!down || !this.playing) return;
		if (e.code === "KeyQ" || e.code === "Digit1" || e.code === "KeyZ") this.tryShoot("qualitative");
		if (e.code === "KeyE" || e.code === "Digit2" || e.code === "KeyX") this.tryShoot("quantitative");
	}
	onMouseMove(e) {
		if (!this.playing) return;
		this.lookDx += e.movementX;
		this.lookDy += e.movementY;
	}
	onMouseDown(e) {
		if (e.button === 2) e.preventDefault();
		if (!this.playing) return;
		if (e.button === 0) {
			this.fireHeld = "qualitative";
			this.tryShoot("qualitative");
		}
		if (e.button === 2) {
			this.fireHeld = "quantitative";
			this.tryShoot("quantitative");
		}
	}
	onMouseUp(e) {
		if (e.button === 0 && this.fireHeld === "qualitative") this.fireHeld = null;
		if (e.button === 2 && this.fireHeld === "quantitative") this.fireHeld = null;
	}
	onLock() {
		this.pointerLocked = document.pointerLockElement === this.canvas;
		useGameStore.setState({ locked: this.pointerLocked });
		if (!this.pointerLocked && this.playing && useGameStore.getState().screen === "playing") {}
	}
	beginStage() {
		const st = STAGES[this.stageIndex];
		this.quotaLeft = st.quota;
		this.spawnCd = .6;
		this.phase = "intro";
		this.phaseT = 1.8;
		this.bannerUntil = now() + 1.8;
		this.bossHp = 0;
		this.hologram.visible = false;
		this.core.traverse((o) => {
			o.userData = {};
		});
		useGameStore.setState({
			stage: st.id,
			stageName: st.name,
			stageCode: st.code,
			remaining: st.quota,
			banner: `${st.code}  ${st.name}`,
			boss: null
		});
	}
	clearEntities() {
		for (const e of this.enemies) this.scene.remove(e.group);
		this.enemies.length = 0;
		for (const p of this.pickups) this.scene.remove(p.group);
		this.pickups.length = 0;
		for (const s of this.sparks) this.scene.remove(s.mesh);
		this.sparks.length = 0;
		for (const t of this.tracers) this.scene.remove(t.line);
		this.tracers.length = 0;
	}
	tryShoot(kind) {
		if (this.cooldown > 0 || this.hitstop > 0) return;
		if (this.phase === "attract" || this.phase === "victory" || this.phase === "dead") return;
		this.cooldown = .16;
		this.recoil = .085;
		this.muzzle = .05;
		this.muzzleKind = kind;
		this.audio.shoot(kind);
		this.trauma = Math.min(1, this.trauma + .12);
		this.raycaster.setFromCamera(new Vector2(0, 0), this.camera);
		const hits = this.raycaster.intersectObjects(this.scene.children, true);
		let target = null;
		for (const h of hits) if (this.findTag(h.object)) {
			target = h;
			break;
		}
		const origin = this.tmp.copy(this.camera.getWorldPosition(this.tmp2));
		const dir = this.camera.getWorldDirection(new Vector3());
		const end = origin.clone().add(dir.multiplyScalar(target ? target.distance : 28));
		this.spawnTracer(origin, end, kind);
		if (!target) return;
		const tag = this.findTag(target.object);
		if (!tag) return;
		if (tag.type === "pickup") {
			this.collectPickup(tag.id);
			return;
		}
		if (tag.type === "enemy") {
			this.hitEnemy(tag.id, kind, target.point);
			return;
		}
		if (tag.type === "boss" || tag.type === "core") this.hitBoss(kind, target.point);
	}
	findTag(obj) {
		let o = obj;
		while (o) {
			const u = o.userData;
			if (u.type) return {
				type: u.type,
				id: u.eid ?? 0
			};
			o = o.parent;
		}
		return null;
	}
	spawnTracer(from, to, kind) {
		const geo = new BufferGeometry().setFromPoints([from.clone(), to.clone()]);
		const mat = new LineBasicMaterial({
			color: kind === "qualitative" ? COLOR.qual : COLOR.quant,
			transparent: true,
			opacity: .9
		});
		const line = new Line(geo, mat);
		this.scene.add(line);
		this.tracers.push({
			line,
			life: .08
		});
	}
	hitEnemy(id, kind, point) {
		const e = this.enemies.find((x) => x.id === id);
		if (!e) return;
		const ok = kind === e.question.kind;
		e.hp -= 1;
		this.flashEnemy(e, !ok);
		this.burst(point, ok ? kind === "qualitative" ? QUAL : QUANT : DANGER, ok ? 12 : 10);
		this.audio.hit();
		const dead = e.hp <= 0;
		if (ok) {
			this.registerCorrect(dead && e.type !== "mini");
			if (dead) this.killEnemy(e, true);
		} else {
			this.registerWrong(e.question);
			if (dead) this.killEnemy(e, false);
		}
	}
	hitBoss(kind, point) {
		if (this.phase === "finalBoss") {
			const q = FINAL_SEQUENCE[this.finalIdx];
			if (!q) return;
			if (kind !== q.kind) {
				this.registerWrong(q);
				this.burst(point, DANGER, 16);
				this.finalTime = this.finalMax;
				return;
			}
			this.registerCorrect(true);
			this.burst(point, kind === "qualitative" ? QUAL : QUANT, 18);
			this.audio.kill();
			this.finalIdx += 1;
			this.finalTime = this.finalMax;
			if (this.finalIdx >= FINAL_SEQUENCE.length) this.winRun();
			else {
				const nq = FINAL_SEQUENCE[this.finalIdx];
				this.setHologram(nq.label, null);
			}
			return;
		}
		if (this.phase !== "boss") return;
		const st = STAGES[this.stageIndex];
		if (kind !== st.boss.kind) {
			this.registerWrong(st.boss);
			this.burst(point, DANGER, 14);
			return;
		}
		this.bossHp -= 1;
		this.burst(point, kind === "qualitative" ? QUAL : QUANT, 16);
		this.audio.hit();
		this.registerCorrect(this.bossHp <= 0);
		if (this.bossHp <= 0) {
			this.audio.kill();
			this.clearEntities();
			this.phase = "stageClear";
			this.phaseT = 2.1;
			this.bannerUntil = now() + 2;
			this.hologram.visible = false;
			useGameStore.setState({
				banner: "STAGE CLEAR",
				boss: null
			});
		}
	}
	registerCorrect(isKill) {
		this.correct += 1;
		this.combo += 1;
		this.maxCombo = Math.max(this.maxCombo, this.combo);
		const { label, mult } = comboRank(this.combo);
		this.score += Math.round(100 * mult);
		if (isKill) this.quotaLeft = Math.max(0, this.quotaLeft - 1);
		if (label && label !== this.lastComboLabel) {
			this.lastComboLabel = label;
			this.comboFlashUntil = now() + 1.1;
			this.audio.combo();
		}
		this.hitstop = this.reduced ? 0 : .035;
		this.trauma = Math.min(1, this.trauma + (isKill ? .28 : .16));
		this.markHit(true);
	}
	registerWrong(q) {
		this.wrong += 1;
		this.combo = 0;
		this.lastComboLabel = null;
		this.misses[q.label] = (this.misses[q.label] ?? 0) + 1;
		this.hurt();
		this.feedbackUntil = now() + 1.15;
		useGameStore.setState({ feedback: {
			title: `${q.label}  —  不正解`,
			detail: q.explanation,
			ok: false
		} });
		this.audio.wrong();
		this.markHit(false);
	}
	hurt() {
		if (this.invuln > 0) return;
		this.lives -= 1;
		this.invuln = .85;
		this.trauma = 1;
		this.audio.damage();
		if (this.lives <= 0) this.failRun();
	}
	markHit(ok) {
		useGameStore.setState({ hitmarker: {
			ok,
			at: now()
		} });
	}
	killEnemy(e, scored) {
		this.burst(e.group.position, e.question.kind === "qualitative" ? QUAL : QUANT, 18);
		if (e.type === "split") {
			this.spawnChild(e, -.7);
			this.spawnChild(e, .7);
		}
		if (scored && Math.random() < .12 && this.phase === "wave") this.dropPickup(e.group.position);
		this.scene.remove(e.group);
		this.enemies = this.enemies.filter((x) => x.id !== e.id);
		this.audio.kill();
		if (scored) {}
	}
	spawnChild(parent, offset) {
		const pos = parent.group.position.clone();
		pos.x += offset;
		this.spawnEnemy("mini", parent.question, pos);
	}
	dropPickup(pos) {
		if (this.pickups.length >= 2) return;
		const kinds = [
			"scan",
			"slow",
			"bomb"
		];
		const kind = kinds[Math.floor(Math.random() * kinds.length)];
		const g = new Group();
		const color = kind === "scan" ? COLOR.qual : kind === "slow" ? COLOR.quant : COLOR.warn;
		const mat = new MeshStandardMaterial({
			color,
			emissive: color,
			emissiveIntensity: .8,
			metalness: .2,
			roughness: .3
		});
		const mesh = new Mesh(new OctahedronGeometry(.28, 0), mat);
		g.add(mesh);
		const spr = new Sprite(new SpriteMaterial({
			map: makeLabelTexture(kind === "scan" ? "SCAN" : kind === "slow" ? "SLOW" : "BOMB", null),
			transparent: true,
			depthWrite: false
		}));
		spr.scale.set(1.4, .35, 1);
		spr.position.y = .55;
		g.add(spr);
		g.position.copy(pos);
		g.position.y = 1.1;
		g.userData = {
			type: "pickup",
			eid: this.idSeq
		};
		const p = {
			id: this.idSeq++,
			kind,
			group: g,
			life: 12
		};
		this.pickups.push(p);
		this.scene.add(g);
	}
	collectPickup(id) {
		const p = this.pickups.find((x) => x.id === id);
		if (!p) return;
		this.applyPowerup(p.kind);
		this.scene.remove(p.group);
		this.pickups = this.pickups.filter((x) => x.id !== id);
	}
	applyPowerup(kind) {
		this.audio.pickup();
		const t = now();
		if (kind === "scan") this.scanUntil = t + 5;
		if (kind === "slow") this.slowUntil = t + 5;
		if (kind === "bomb") {
			this.audio.bomb();
			this.trauma = 1;
			const list = [...this.enemies];
			for (const e of list) {
				this.registerCorrect(true);
				this.killEnemy(e, true);
			}
		}
	}
	flashEnemy(e, bad) {
		e.flash = .12;
		const mat = e.body.material;
		mat.emissive.copy(bad ? DANGER : new Color(16777215));
		mat.emissiveIntensity = 1.4;
	}
	burst(pos, color, n) {
		for (let i = 0; i < n; i++) {
			const mesh = new Mesh(this.sparkGeo, this.sparkMat.clone());
			mesh.material.color.copy(color);
			mesh.position.copy(pos);
			const s = .03 + Math.random() * .05;
			mesh.scale.setScalar(s);
			const vel = new Vector3((Math.random() - .5) * 6, Math.random() * 4, (Math.random() - .5) * 6);
			this.scene.add(mesh);
			this.sparks.push({
				mesh,
				vel,
				life: .35 + Math.random() * .25,
				max: .5
			});
		}
	}
	viewBasis() {
		const fx = -Math.sin(this.yaw);
		const fz = -Math.cos(this.yaw);
		const rx = Math.cos(this.yaw);
		const rz = -Math.sin(this.yaw);
		const vFov = this.camera.fov * Math.PI / 180;
		const hFov = 2 * Math.atan(Math.tan(vFov / 2) * Math.max(.42, this.camera.aspect));
		return {
			fx,
			fz,
			rx,
			rz,
			halfH: Math.max(.2, Math.min(.72, hFov * .34))
		};
	}
	placeInView(group) {
		const p = this.yawObj.position;
		const { fx, fz, rx, rz, halfH } = this.viewBasis();
		const n = this.enemies.length;
		const lane = n === 0 ? (Math.random() * 2 - 1) * .28 : (n % 2 === 0 ? 1 : -1) * (.32 + Math.random() * .55);
		const tryAt = (yawOff, dist) => {
			const x = p.x + (fx * Math.cos(yawOff) + rx * Math.sin(yawOff)) * dist;
			const z = p.z + (fz * Math.cos(yawOff) + rz * Math.sin(yawOff)) * dist;
			const cx = MathUtils.clamp(x, -11.9, 11.9);
			const cz = MathUtils.clamp(z, -11.9, 11.9);
			return {
				x: cx,
				z: cz,
				d: Math.hypot(cx - p.x, cz - p.z)
			};
		};
		let best = tryAt(lane * halfH, 10);
		for (let i = 0; i < 14; i++) {
			const jitter = (Math.random() * 2 - 1) * halfH * .18;
			const cand = tryAt(MathUtils.clamp(lane * halfH * .92 + jitter, -halfH, halfH), 8.5 + Math.random() * 4.5);
			let crowded = false;
			for (const e of this.enemies) if (Math.hypot(e.group.position.x - cand.x, e.group.position.z - cand.z) < 1.6) {
				crowded = true;
				break;
			}
			if (!crowded && cand.d >= 7.2) {
				group.position.set(cand.x, 1.28 + Math.random() * .42, cand.z);
				return;
			}
			if (cand.d > best.d) best = cand;
		}
		for (let i = 0; i < 10; i++) {
			const cand = tryAt((Math.random() * 2 - 1) * Math.min(1.05, halfH * 2.1), 11);
			if (cand.d > best.d) best = cand;
		}
		group.position.set(best.x, 1.35, best.z);
	}
	spawnEnemy(type, question, at) {
		const st = STAGES[this.stageIndex];
		const group = new Group();
		const id = this.idSeq++;
		let radius = .55;
		let hp = 1;
		let speedMul = 1;
		let geo;
		if (type === "fast") {
			geo = new ConeGeometry(.28, .9, 5);
			speedMul = 1.55;
			radius = .45;
		} else if (type === "heavy") {
			geo = new BoxGeometry(.9, .9, .9);
			hp = 2;
			speedMul = .72;
			radius = .75;
		} else if (type === "split") {
			geo = new TetrahedronGeometry(.55);
			radius = .6;
		} else if (type === "mini") {
			geo = new OctahedronGeometry(.28, 0);
			speedMul = 1.35;
			radius = .38;
		} else geo = new OctahedronGeometry(.48, 0);
		const mat = new MeshStandardMaterial({
			color: 1713196,
			metalness: .45,
			roughness: .35,
			emissive: 1384488,
			emissiveIntensity: .6
		});
		const body = new Mesh(geo, mat);
		if (type === "fast") body.rotation.x = Math.PI / 2;
		const ring = new Mesh(new TorusGeometry(type === "heavy" ? .7 : .42, .03, 6, 20), new MeshBasicMaterial({
			color: 9149098,
			transparent: true,
			opacity: .7
		}));
		ring.rotation.x = Math.PI / 2;
		const label = new Sprite(new SpriteMaterial({
			map: makeLabelTexture(question.label, null),
			transparent: true,
			depthWrite: false
		}));
		label.scale.set(type === "mini" ? 1.5 : 2.15, type === "mini" ? .38 : .54, 1);
		label.position.y = type === "heavy" ? 1.05 : .82;
		group.add(body, ring, label);
		group.userData = {
			type: "enemy",
			eid: id
		};
		body.userData = {
			type: "enemy",
			eid: id
		};
		if (!at) this.placeInView(group);
		else group.position.copy(at);
		const e = {
			id,
			type,
			question,
			hp,
			maxHp: hp,
			speed: st.speed * speedMul,
			group,
			body,
			label,
			radius,
			phase: Math.random() * Math.PI * 2,
			flash: 0,
			born: 0
		};
		this.enemies.push(e);
		this.scene.add(group);
		this.recent.push(question.id);
		if (this.recent.length > 6) this.recent.shift();
	}
	spawnBoss() {
		const st = STAGES[this.stageIndex];
		this.clearEntities();
		this.phase = "bossIntro";
		this.phaseT = 1.6;
		this.bannerUntil = now() + 1.6;
		this.bossMax = st.id === 5 ? FINAL_SEQUENCE.length : 3;
		this.bossHp = this.bossMax;
		this.finalIdx = 0;
		this.finalTime = this.finalMax;
		this.core.userData = {
			type: st.id === 5 ? "core" : "boss",
			eid: 0
		};
		this.core.traverse((o) => {
			o.userData = {
				type: st.id === 5 ? "core" : "boss",
				eid: 0
			};
		});
		this.setHologram(st.id === 5 ? FINAL_SEQUENCE[0].label : st.boss.label, null);
		useGameStore.setState({ banner: st.id === 5 ? "FINAL  DATA CORE" : `BOSS  ${st.boss.label}` });
	}
	loop = (ts) => {
		if (this.disposed) return;
		this.raf = requestAnimationFrame(this.loop);
		this.clock.update(ts);
		const dtRaw = Math.min(this.clock.getDelta(), .1);
		this.acc += dtRaw;
		while (this.acc >= STEP) {
			this.update(STEP);
			this.acc -= STEP;
		}
		this.render();
	};
	update(dt) {
		const t = now();
		this.attractT += dt;
		this.core.rotation.y += dt * .35;
		const ring = this.core.children[1];
		if (ring) ring.rotation.z += dt * .5;
		this.hologram.position.set(0, 4.15, 0);
		this.camera.getWorldPosition(this.tmp);
		this.hologram.lookAt(this.tmp);
		if (!this.playing) {
			if (this.phase === "attract") this.attractCam(dt);
			this.updateFx(dt);
			this.pushStore();
			return;
		}
		if (this.hitstop > 0) {
			this.hitstop -= dt;
			this.updateFx(dt);
			return;
		}
		this.runTime += dt;
		this.cooldown = Math.max(0, this.cooldown - dt);
		this.invuln = Math.max(0, this.invuln - dt);
		this.recoil = MathUtils.damp(this.recoil, 0, 12, dt);
		this.muzzle = Math.max(0, this.muzzle - dt);
		this.trauma = Math.max(0, this.trauma - dt * 1.8);
		this.applyLook(dt);
		this.applyMove(dt);
		this.updateGun(dt);
		if (this.phase === "intro") {
			this.phaseT -= dt;
			if (this.phaseT <= 0) this.phase = "wave";
		} else if (this.phase === "wave") this.updateWave(dt);
		else if (this.phase === "bossIntro") {
			this.phaseT -= dt;
			if (this.phaseT <= 0) this.phase = this.stageIndex === 4 ? "finalBoss" : "boss";
		} else if (this.phase === "boss") {} else if (this.phase === "finalBoss") {
			this.finalTime -= dt;
			if (this.finalTime <= 0) {
				const q = FINAL_SEQUENCE[this.finalIdx];
				if (q) this.registerWrong(q);
				this.finalTime = this.finalMax;
			}
		} else if (this.phase === "stageClear") {
			this.phaseT -= dt;
			if (this.phaseT <= 0) {
				this.stageIndex += 1;
				if (this.stageIndex >= STAGES.length) this.winRun();
				else this.beginStage();
			}
		}
		this.updateEnemies(dt);
		this.updatePickups(dt);
		this.updateFx(dt);
		this.pushStoreThrottled(t);
	}
	attractCam(dt) {
		const r = 11;
		const a = this.attractT * .18;
		this.yawObj.position.set(Math.cos(a) * r, 2.2, Math.sin(a) * r);
		this.yawObj.lookAt(0, 1.6, 0);
		this.camera.position.set(0, 0, 0);
		this.camera.rotation.set(0, 0, 0);
	}
	applyLook(dt) {
		const sens = .0022;
		this.yaw -= this.lookDx * sens;
		this.pitch -= this.lookDy * sens;
		this.lookDx = 0;
		this.lookDy = 0;
		const lim = Math.PI / 2 - .08;
		this.pitch = MathUtils.clamp(this.pitch, -lim, lim);
		this.yawObj.rotation.set(0, this.yaw, 0);
		this.pitchObj.rotation.set(this.pitch, 0, 0);
	}
	applyMove(dt) {
		this.forward.set(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
		this.right.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
		let ax = 0;
		let az = 0;
		if (this.keys.has("KeyW") || this.keys.has("ArrowUp")) az += 1;
		if (this.keys.has("KeyS") || this.keys.has("ArrowDown")) az -= 1;
		if (this.keys.has("KeyD") || this.keys.has("ArrowRight")) ax += 1;
		if (this.keys.has("KeyA") || this.keys.has("ArrowLeft")) ax -= 1;
		ax += this.touchMove.x;
		az += this.touchMove.y;
		const wish = this.tmp.set(0, 0, 0);
		if (ax !== 0 || az !== 0) {
			wish.addScaledVector(this.forward, az);
			wish.addScaledVector(this.right, ax);
			if (wish.lengthSq() > 1) wish.normalize();
		}
		const accel = 38;
		const maxSp = this.keys.has("ShiftLeft") || this.keys.has("ShiftRight") ? 8.2 : 6.1;
		this.vel.addScaledVector(wish, accel * dt);
		this.vel.y = 0;
		const sp = this.vel.length();
		if (sp > maxSp) this.vel.multiplyScalar(maxSp / sp);
		const damp = Math.exp(-8 * dt);
		if (wish.lengthSq() < .01) this.vel.multiplyScalar(damp);
		this.yawObj.position.addScaledVector(this.vel, dt);
		this.yawObj.position.x = MathUtils.clamp(this.yawObj.position.x, -13, ARENA);
		this.yawObj.position.z = MathUtils.clamp(this.yawObj.position.z, -13, ARENA);
		this.yawObj.position.y = EYE;
		for (const [px, pz] of [
			[-10, -10],
			[10, -10],
			[-10, 10],
			[10, 10]
		]) {
			const dx = this.yawObj.position.x - px;
			const dz = this.yawObj.position.z - pz;
			const d = Math.hypot(dx, dz);
			if (d < 1.15 && d > .001) {
				this.yawObj.position.x = px + dx / d * 1.15;
				this.yawObj.position.z = pz + dz / d * 1.15;
			}
		}
		const moving = this.vel.length() > .4;
		this.bob += (moving ? 10 : 0) * dt;
	}
	updateGun(dt) {
		const bobY = this.reduced ? 0 : Math.sin(this.bob) * .016;
		const bobX = this.reduced ? 0 : Math.cos(this.bob * .5) * .01;
		this.gun.position.set(this.gunBase.x + bobX, this.gunBase.y + bobY - this.recoil * .4, this.gunBase.z + this.recoil);
		this.gun.rotation.x = this.recoil * 1.4;
		const col = this.muzzleKind === "qualitative" ? COLOR.qual : COLOR.quant;
		this.muzzleLight.color.setHex(col);
		this.muzzleLight.intensity = this.muzzle > 0 ? 6 : 0;
	}
	updateWave(dt) {
		const st = STAGES[this.stageIndex];
		if (this.quotaLeft > 0 && this.enemies.length < st.maxAlive) {
			this.spawnCd -= dt;
			if (this.spawnCd <= 0) {
				const n = st.id >= 3 && this.enemies.length < st.maxAlive - 1 && Math.random() > .55 ? 2 : 1;
				for (let i = 0; i < n; i++) {
					if (this.enemies.length >= st.maxAlive) break;
					const type = pickEnemyType(st.types, st.id);
					const q = pickQuestion(st.pool, this.recent);
					this.spawnEnemy(type, q);
				}
				this.spawnCd = st.spawnInterval;
			}
		}
		if (this.quotaLeft <= 0 && this.enemies.length === 0) this.spawnBoss();
	}
	updateEnemies(dt) {
		const slow = now() < this.slowUntil ? .5 : 1;
		const scan = now() < this.scanUntil;
		const p = this.yawObj.position;
		const { fx, fz, rx, rz, halfH } = this.viewBasis();
		const cone = Math.min(.78, halfH * 1.15);
		for (const e of [...this.enemies]) {
			e.born += dt;
			const scale = Math.min(1, e.born / .18);
			e.group.scale.setScalar(scale);
			const dx = e.group.position.x - p.x;
			const dz = e.group.position.z - p.z;
			const dist = Math.hypot(dx, dz);
			const fwd = dx * fx + dz * fz;
			const side = dx * rx + dz * rz;
			const ang = Math.atan2(side, fwd);
			let tx = p.x;
			let tz = p.z;
			if (dist > .001 && Math.abs(ang) > cone) {
				const step = Math.max(2.8, e.speed * .62) * slow * dt;
				const nextAng = ang - Math.sign(ang) * Math.min(Math.abs(ang) - cone * .85, step);
				const radius = Math.max(dist, 3.4);
				tx = p.x + (fx * Math.cos(nextAng) + rx * Math.sin(nextAng)) * radius;
				tz = p.z + (fz * Math.cos(nextAng) + rz * Math.sin(nextAng)) * radius;
			}
			const mx = tx - e.group.position.x;
			const mz = tz - e.group.position.z;
			const md = Math.hypot(mx, mz);
			if (md > .001) {
				const step = e.speed * slow * dt / md;
				e.group.position.x += mx * step;
				e.group.position.z += mz * step;
			}
			e.group.position.x = MathUtils.clamp(e.group.position.x, -13, ARENA);
			e.group.position.z = MathUtils.clamp(e.group.position.z, -13, ARENA);
			e.group.position.y += Math.sin(now() * 3 + e.phase) * .004;
			e.group.lookAt(p.x, e.group.position.y, p.z);
			if (e.flash > 0) {
				e.flash -= dt;
				if (e.flash <= 0) {
					const mat = e.body.material;
					mat.emissive.setHex(1384488);
					mat.emissiveIntensity = .6;
				}
			}
			const tint = scan ? e.question.kind === "qualitative" ? QUAL : QUANT : null;
			if (tint && e.flash <= 0) {
				const mat = e.body.material;
				mat.emissive.copy(tint);
				mat.emissiveIntensity = .95;
				e.label.material.color.copy(tint);
			} else if (!scan && e.flash <= 0) e.label.material.color.set(16777215);
			if (Math.hypot(e.group.position.x - p.x, e.group.position.z - p.z) < e.radius + .55) {
				this.combo = 0;
				this.lastComboLabel = null;
				this.hurt();
				this.feedbackUntil = now() + .9;
				useGameStore.setState({ feedback: {
					title: "接触ダメージ",
					detail: "データターゲットに接触した。分類する前に距離を取れ。",
					ok: false
				} });
				this.burst(e.group.position, DANGER, 14);
				this.scene.remove(e.group);
				this.enemies = this.enemies.filter((x) => x.id !== e.id);
			}
		}
	}
	updatePickups(dt) {
		const p = this.yawObj.position;
		for (const pk of [...this.pickups]) {
			pk.life -= dt;
			pk.group.rotation.y += dt * 2.2;
			pk.group.position.y = 1.1 + Math.sin(now() * 3 + pk.id) * .12;
			const d = pk.group.position.distanceTo(p);
			if (d < 1.3 || pk.life <= 0) {
				if (d < 1.3) this.collectPickup(pk.id);
				else {
					this.scene.remove(pk.group);
					this.pickups = this.pickups.filter((x) => x.id !== pk.id);
				}
			}
		}
	}
	updateFx(dt) {
		for (const s of this.sparks) {
			s.life -= dt;
			s.mesh.position.addScaledVector(s.vel, dt);
			s.vel.y -= 8 * dt;
			const mat = s.mesh.material;
			mat.opacity = Math.max(0, s.life / s.max);
			s.mesh.scale.multiplyScalar(.96);
		}
		this.sparks = this.sparks.filter((s) => {
			if (s.life <= 0) {
				this.scene.remove(s.mesh);
				s.mesh.material.dispose();
				return false;
			}
			return true;
		});
		for (const tr of this.tracers) {
			tr.life -= dt;
			const mat = tr.line.material;
			mat.opacity = Math.max(0, tr.life / .08);
		}
		this.tracers = this.tracers.filter((tr) => {
			if (tr.life <= 0) {
				this.scene.remove(tr.line);
				tr.line.geometry.dispose();
				tr.line.material.dispose();
				return false;
			}
			return true;
		});
	}
	lastPush = 0;
	pushStoreThrottled(t) {
		if (t - this.lastPush < .04) return;
		this.lastPush = t;
		this.pushStore();
	}
	pushStore() {
		const st = STAGES[this.stageIndex] ?? STAGES[0];
		const { label } = comboRank(this.combo);
		const t = now();
		const scan = t < this.scanUntil;
		const slow = t < this.slowUntil;
		let boss = useGameStore.getState().boss;
		if (this.phase === "boss") boss = {
			name: st.boss.label,
			hp: this.bossHp,
			maxHp: this.bossMax,
			prompt: st.boss.label,
			timer: 0,
			timerMax: 0,
			final: false
		};
		else if (this.phase === "finalBoss") {
			const q = FINAL_SEQUENCE[this.finalIdx];
			boss = {
				name: "DATA CORE",
				hp: FINAL_SEQUENCE.length - this.finalIdx,
				maxHp: FINAL_SEQUENCE.length,
				prompt: q?.label ?? "",
				timer: this.finalTime,
				timerMax: this.finalMax,
				final: true
			};
		} else if (this.phase !== "bossIntro") boss = null;
		useGameStore.setState({
			score: this.score,
			combo: this.combo,
			comboLabel: t < this.comboFlashUntil ? label : null,
			comboFlash: this.comboFlashUntil,
			lives: this.lives,
			stage: st.id,
			stageName: st.name,
			stageCode: st.code,
			remaining: Math.max(0, this.quotaLeft),
			elapsed: this.runTime,
			scan,
			slow,
			boss,
			banner: t < this.bannerUntil ? useGameStore.getState().banner : null,
			feedback: t < this.feedbackUntil ? useGameStore.getState().feedback : null,
			locked: this.pointerLocked
		});
	}
	failRun() {
		this.playing = false;
		this.phase = "dead";
		this.finish(false);
	}
	winRun() {
		this.playing = false;
		this.phase = "victory";
		this.audio.combo();
		this.finish(true);
	}
	finish(cleared) {
		if (document.pointerLockElement) document.exitPointerLock();
		this.audio.stopMusic();
		const total = this.correct + this.wrong;
		const accuracy = total === 0 ? 0 : this.correct / total;
		const weak = Object.entries(this.misses).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([label, misses]) => ({
			label,
			misses
		}));
		const result = {
			score: this.score,
			accuracy,
			maxCombo: this.maxCombo,
			elapsed: this.runTime,
			stageReached: STAGES[this.stageIndex]?.id ?? 1,
			cleared,
			weak,
			correct: this.correct,
			wrong: this.wrong
		};
		const high = writeHighScore(this.score);
		useGameStore.setState({
			screen: "result",
			result,
			highScore: high,
			banner: null,
			boss: null
		});
	}
	render() {
		const shake = this.reduced ? 0 : this.trauma * this.trauma;
		const ox = (Math.random() - .5) * shake * .12;
		const oy = (Math.random() - .5) * shake * .12;
		this.camera.position.set(ox, oy, 0);
		this.renderer.clear();
		this.renderer.render(this.scene, this.camera);
		this.renderer.clearDepth();
		this.renderer.render(this.overlayScene, this.overlayCam);
	}
	dispose() {
		if (this.disposed) return;
		this.disposed = true;
		cancelAnimationFrame(this.raf);
		this.audio.stopMusic();
		window.removeEventListener("keydown", this.boundKeyDown);
		window.removeEventListener("keyup", this.boundKeyUp);
		window.removeEventListener("blur", this.boundBlur);
		document.removeEventListener("pointerlockchange", this.boundLock);
		document.removeEventListener("visibilitychange", this.boundVis);
		this.canvas.removeEventListener("mousemove", this.boundMouseMove);
		this.canvas.removeEventListener("mousedown", this.boundMouseDown);
		window.removeEventListener("mouseup", this.boundMouseUp);
		this.canvas.removeEventListener("contextmenu", this.boundContext);
		this.canvas.removeEventListener("pointermove", this.boundPointerMove);
		this.resizeObs.disconnect();
		this.clearEntities();
		for (const g of this.geoms) g.dispose();
		for (const m of this.mats) m.dispose();
		for (const t of this.textures) t.dispose();
		this.renderer.dispose();
		this.clock.dispose();
		if (window.__controlsTest) delete window.__controlsTest;
	}
};
//#endregion
export { DataHunterGame };
