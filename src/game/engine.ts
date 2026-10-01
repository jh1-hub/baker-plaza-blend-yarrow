import * as THREE from "three";
import { GameAudio } from "./audio";
import {
  COLOR,
  FINAL_SEQUENCE,
  STAGES,
  comboRank,
  pickEnemyType,
  pickQuestion,
} from "./content";
import { writeHighScore } from "./save";
import { useGameStore } from "./store";
import type {
  DataKind,
  EnemyType,
  PowerupKind,
  Question,
  ResultStats,
  RunPhase,
  WeakItem,
} from "./types";

const STEP = 1 / 60;
const ARENA = 13;
const EYE = 1.64;
const QUAL = new THREE.Color(COLOR.qual);
const QUANT = new THREE.Color(COLOR.quant);
const DANGER = new THREE.Color(COLOR.danger);

function now() {
  return performance.now() / 1000;
}

function makeGridTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d")!;
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
  g.globalAlpha = 0.45;
  g.lineWidth = 4;
  g.strokeRect(2, 2, 508, 508);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(18, 18);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function makeLabelTexture(text: string, tint: string | null) {
  const c = document.createElement("canvas");
  c.width = 768;
  c.height = 192;
  const g = c.getContext("2d")!;
  g.clearRect(0, 0, 768, 192);
  const pad = 18;
  g.fillStyle = "rgba(5,8,12,0.82)";
  roundRect(g, pad, 36, 768 - pad * 2, 120, 18);
  g.fill();
  g.lineWidth = 4;
  g.strokeStyle = tint ?? "rgba(232,240,244,0.55)";
  g.stroke();
  g.fillStyle = tint ?? "#e8f0f4";
  g.font = "700 64px 'Noto Sans JP', sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(text, 384, 96, 680);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function roundRect(
  g: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

type Enemy = {
  id: number;
  type: EnemyType;
  question: Question;
  hp: number;
  maxHp: number;
  speed: number;
  group: THREE.Group;
  hull: THREE.Group;
  body: THREE.Mesh;
  label: THREE.Sprite;
  radius: number;
  phase: number;
  spin: number;
  flash: number;
  born: number;
};

type Pickup = {
  id: number;
  kind: PowerupKind;
  group: THREE.Group;
  life: number;
};

type Spark = {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  life: number;
  max: number;
};

export class DataHunterGame {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private yawObj: THREE.Object3D;
  private pitchObj: THREE.Object3D;
  private overlayScene: THREE.Scene;
  private overlayCam: THREE.PerspectiveCamera;
  private gun: THREE.Group;
  private gunBase = new THREE.Vector3(0.3, -0.24, -0.58);
  private core: THREE.Group;
  private hologram: THREE.Mesh;
  private holoTex: THREE.CanvasTexture | null = null;

  private audio = new GameAudio();
  private keys = new Set<string>();
  private raycaster = new THREE.Raycaster();
  private clock = new THREE.Timer();
  private acc = 0;
  private raf = 0;
  private disposed = false;
  private reduced = false;
  private pointerLocked = false;
  private lookDx = 0;
  private lookDy = 0;
  private touchMove = { x: 0, y: 0 };
  private yaw = 0;
  private pitch = 0;
  private vel = new THREE.Vector3();
  private bob = 0;
  private recoil = 0;
  private trauma = 0;
  private hitstop = 0;
  private timeScale = 1;
  private muzzle = 0;
  private muzzleKind: DataKind = "qualitative";
  private cooldown = 0;
  private invuln = 0;
  private fireHeld: DataKind | null = null;

  private phase: RunPhase = "attract";
  private stageIndex = 0;
  private quotaLeft = 0;
  private spawnCd = 0;
  private phaseT = 0;
  private runTime = 0;
  private score = 0;
  private combo = 0;
  private maxCombo = 0;
  private lives = 5;
  private correct = 0;
  private wrong = 0;
  private misses: Record<string, number> = {};
  private recent: string[] = [];
  private scanUntil = 0;
  private slowUntil = 0;
  private bannerUntil = 0;
  private feedbackUntil = 0;
  private comboFlashUntil = 0;
  private lastComboLabel: string | null = null;
  private idSeq = 1;
  private enemies: Enemy[] = [];
  private pickups: Pickup[] = [];
  private sparks: Spark[] = [];
  private tracers: { line: THREE.Line; life: number }[] = [];
  private bossHp = 0;
  private bossMax = 0;
  private finalIdx = 0;
  private finalTime = 0;
  private finalMax = 6.4;
  private attractT = 0;
  private muted = false;
  private playing = false;
  private tmp = new THREE.Vector3();
  private tmp2 = new THREE.Vector3();
  private forward = new THREE.Vector3();
  private right = new THREE.Vector3();
  private geoms: THREE.BufferGeometry[] = [];
  private mats: THREE.Material[] = [];
  private textures: THREE.Texture[] = [];
  private sparkGeo: THREE.SphereGeometry;
  private sparkMat: THREE.MeshBasicMaterial;
  private muzzleLight: THREE.PointLight;
  private resizeObs: ResizeObserver;
  private boundKeyDown: (e: KeyboardEvent) => void;
  private boundKeyUp: (e: KeyboardEvent) => void;
  private boundMouseMove: (e: MouseEvent) => void;
  private boundMouseDown: (e: MouseEvent) => void;
  private boundMouseUp: (e: MouseEvent) => void;
  private boundContext: (e: Event) => void;
  private boundLock: () => void;
  private boundVis: () => void;
  private boundBlur: () => void;
  private boundPointerMove: (e: PointerEvent) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    this.renderer.setClearColor(0x05080c, 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.autoClear = false;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x05080c, 10, 34);
    this.scene.background = new THREE.Color(0x05080c);

    this.camera = new THREE.PerspectiveCamera(78, 1, 0.05, 80);
    this.yawObj = new THREE.Object3D();
    this.pitchObj = new THREE.Object3D();
    this.yawObj.position.set(0, EYE, 8);
    this.pitchObj.add(this.camera);
    this.yawObj.add(this.pitchObj);
    this.scene.add(this.yawObj);

    this.overlayScene = new THREE.Scene();
    this.overlayCam = new THREE.PerspectiveCamera(60, 1, 0.05, 5);
    this.gun = this.createGun();
    this.overlayScene.add(this.overlayCam);
    this.overlayCam.add(this.gun);
    const gLight = new THREE.HemisphereLight(0x9fdfff, 0x080808, 0.9);
    this.overlayScene.add(gLight);
    this.muzzleLight = new THREE.PointLight(COLOR.qual, 0, 3);
    this.gun.add(this.muzzleLight);
    this.muzzleLight.position.set(0, 0.02, -0.55);

    this.sparkGeo = new THREE.SphereGeometry(1, 6, 6);
    this.sparkMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1,
      depthWrite: false,
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
    useGameStore.setState({ isTouch: touch, highScore: useGameStore.getState().highScore });

    window.__controlsTest = {
      getYaw: () => this.yaw,
      getSpeed: () => Math.hypot(this.vel.x, this.vel.z),
      setKeys: (codes) => {
        this.keys.clear();
        for (const c of codes) this.keys.add(c);
      },
      getPos: () => ({ x: this.yawObj.position.x, z: this.yawObj.position.z }),
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
          return { dist, inFront: fwd > 0.2, ang: Math.atan2(side, fwd) };
        });
      },
    };

    this.clock.connect(document);
    this.raf = requestAnimationFrame(this.loop);
    this.pushStore();
  }

  private resize() {
    const w = Math.max(1, this.canvas.clientWidth);
    const h = Math.max(1, this.canvas.clientHeight);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.overlayCam.aspect = w / h;
    this.overlayCam.updateProjectionMatrix();
  }

  private createGun() {
    const g = new THREE.Group();
    const dark = new THREE.MeshStandardMaterial({
      color: 0x12181e,
      metalness: 0.7,
      roughness: 0.35,
    });
    const mid = new THREE.MeshStandardMaterial({
      color: 0x2a3540,
      metalness: 0.5,
      roughness: 0.4,
    });
    const qualM = new THREE.MeshStandardMaterial({
      color: 0x102218,
      emissive: QUAL,
      emissiveIntensity: 0.9,
    });
    const quantM = new THREE.MeshStandardMaterial({
      color: 0x0c1c24,
      emissive: QUANT,
      emissiveIntensity: 0.9,
    });
    this.mats.push(dark, mid, qualM, quantM);
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.55), dark);
    body.position.set(0, 0, 0);
    const stock = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.22), mid);
    stock.position.set(0.02, -0.04, 0.32);
    const barrelL = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.034, 0.42, 8), qualM);
    barrelL.rotation.x = Math.PI / 2;
    barrelL.position.set(-0.05, 0.03, -0.38);
    const barrelR = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.034, 0.42, 8), quantM);
    barrelR.rotation.x = Math.PI / 2;
    barrelR.position.set(0.05, 0.03, -0.38);
    const mag = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.12), mid);
    mag.position.set(0, -0.14, 0.02);
    const sight = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.08), dark);
    sight.position.set(0, 0.1, -0.08);
    const glass = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.04, 0.01),
      new THREE.MeshBasicMaterial({ color: 0x9ef7c8, transparent: true, opacity: 0.55 }),
    );
    glass.position.set(0, 0.12, -0.12);
    this.mats.push(glass.material as THREE.Material);
    g.add(body, stock, barrelL, barrelR, mag, sight, glass);
    g.position.copy(this.gunBase);
    return g;
  }

  private buildWorld() {
    const grid = makeGridTexture();
    this.textures.push(grid);
    const floorMat = new THREE.MeshStandardMaterial({
      map: grid,
      roughness: 0.82,
      metalness: 0.18,
      color: 0x9aa8b4,
    });
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x0d141c,
      roughness: 0.9,
      metalness: 0.1,
    });
    const neonQ = new THREE.MeshBasicMaterial({ color: COLOR.qual });
    const neonC = new THREE.MeshBasicMaterial({ color: COLOR.quant });
    const rack = new THREE.MeshStandardMaterial({
      color: 0x151c24,
      metalness: 0.45,
      roughness: 0.4,
      emissive: 0x041018,
      emissiveIntensity: 0.4,
    });
    this.mats.push(floorMat, wallMat, neonQ, neonC, rack);

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), floorMat);
    floor.rotation.x = -Math.PI / 2;
    this.scene.add(floor);
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), wallMat);
    ceil.rotation.x = Math.PI / 2;
    ceil.position.y = 6.2;
    this.scene.add(ceil);

    const wallH = 6.2;
    const wallGeo = new THREE.PlaneGeometry(40, wallH);
    this.geoms.push(wallGeo, floor.geometry, ceil.geometry);
    const walls: [number, number, number, number][] = [
      [0, wallH / 2, -20, 0],
      [0, wallH / 2, 20, Math.PI],
      [-20, wallH / 2, 0, Math.PI / 2],
      [20, wallH / 2, 0, -Math.PI / 2],
    ];
    for (const [x, y, z, rot] of walls) {
      const m = new THREE.Mesh(wallGeo, wallMat);
      m.position.set(x, y, z);
      m.rotation.y = rot;
      this.scene.add(m);
    }

    const stripGeo = new THREE.BoxGeometry(40, 0.06, 0.08);
    this.geoms.push(stripGeo);
    for (const z of [-19.7, 19.7]) {
      const s = new THREE.Mesh(stripGeo, neonC);
      s.position.set(0, 0.04, z);
      this.scene.add(s);
    }
    const stripZ = new THREE.BoxGeometry(0.08, 0.06, 40);
    this.geoms.push(stripZ);
    for (const x of [-19.7, 19.7]) {
      const s = new THREE.Mesh(stripZ, neonQ);
      s.position.set(x, 0.04, 0);
      this.scene.add(s);
    }

    const pillarGeo = new THREE.BoxGeometry(1.2, 6.2, 1.2);
    this.geoms.push(pillarGeo);
    for (const [x, z] of [
      [-10, -10],
      [10, -10],
      [-10, 10],
      [10, 10],
    ]) {
      const p = new THREE.Mesh(pillarGeo, rack);
      p.position.set(x, 3.1, z);
      this.scene.add(p);
      const edge = new THREE.Mesh(new THREE.BoxGeometry(0.08, 6.2, 0.08), neonC);
      edge.position.set(x + 0.6, 3.1, z + 0.6);
      this.scene.add(edge);
    }

    const rackGeo = new THREE.BoxGeometry(1.4, 2.4, 0.7);
    this.geoms.push(rackGeo);
    for (let i = -3; i <= 3; i++) {
      if (i === 0) continue;
      const a = new THREE.Mesh(rackGeo, rack);
      a.position.set(i * 3.2, 1.2, -18.6);
      this.scene.add(a);
      const b = new THREE.Mesh(rackGeo, rack);
      b.position.set(i * 3.2, 1.2, 18.6);
      this.scene.add(b);
    }

    this.scene.add(new THREE.HemisphereLight(0x3a5a70, 0x08080c, 0.55));
    const dir = new THREE.DirectionalLight(0xb7d4e4, 0.35);
    dir.position.set(6, 12, 4);
    this.scene.add(dir);
    const p1 = new THREE.PointLight(COLOR.quant, 1.4, 18);
    p1.position.set(-8, 3.4, -8);
    const p2 = new THREE.PointLight(COLOR.qual, 1.2, 18);
    p2.position.set(8, 3.4, 8);
    this.scene.add(p1, p2);
    const spot = new THREE.SpotLight(0xcfe8ff, 1.1, 28, 0.7, 0.45, 1.2);
    this.pitchObj.add(spot);
    spot.position.set(0, 0.1, 0.2);
    spot.target.position.set(0, 0, -6);
    this.pitchObj.add(spot.target);

    const core = new THREE.Group();
    const ringGeo = new THREE.TorusGeometry(1.8, 0.05, 8, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: COLOR.quant,
      transparent: true,
      opacity: 0.55,
    });
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: COLOR.qual,
      transparent: true,
      opacity: 0.4,
    });
    this.geoms.push(ringGeo);
    this.mats.push(ringMat, ringMat2);
    const r1 = new THREE.Mesh(ringGeo, ringMat);
    r1.rotation.x = Math.PI / 2;
    const r2 = new THREE.Mesh(ringGeo, ringMat2);
    r2.rotation.x = Math.PI / 3;
    const ball = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.9, 1),
      new THREE.MeshStandardMaterial({
        color: 0x0a1218,
        emissive: 0x0a3040,
        emissiveIntensity: 0.8,
        metalness: 0.3,
        roughness: 0.35,
        wireframe: true,
      }),
    );
    this.mats.push(ball.material as THREE.Material);
    this.geoms.push(ball.geometry);
    core.add(r1, r2, ball);
    core.position.set(0, 2.4, 0);
    core.name = "core";
    this.scene.add(core);
    return core;
  }

  private makeHologram() {
    const geo = new THREE.PlaneGeometry(3.4, 0.9);
    this.geoms.push(geo);
    const mat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    this.mats.push(mat);
    const m = new THREE.Mesh(geo, mat);
    m.position.set(0, 1.6, 0);
    m.visible = false;
    return m;
  }

  private setHologram(text: string, kind: DataKind | null) {
    const tex = makeLabelTexture(text, kind ? (kind === "qualitative" ? "#39ff87" : "#2ecbff") : "#e8f0f4");
    this.textures.push(tex);
    const mat = this.hologram.material as THREE.MeshBasicMaterial;
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
    useGameStore.setState({ screen: "playing", result: null });
    this.pushStore();
  }

  tryLock() {
    const el = this.canvas as HTMLCanvasElement & {
      requestPointerLock: (opts?: { unadjustedMovement?: boolean }) => Promise<void> | void;
    };
    try {
      const p = el.requestPointerLock({ unadjustedMovement: true });
      if (p && typeof (p as Promise<void>).catch === "function") {
        (p as Promise<void>).catch(() => el.requestPointerLock());
      }
    } catch {
      try {
        el.requestPointerLock();
      } catch {
        /* iframe may block */
      }
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
    useGameStore.setState({ screen: "title", banner: null, feedback: null, boss: null });
    this.pushStore();
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    this.audio.setMuted(muted);
    useGameStore.setState({ muted });
  }

  setMoveAxis(x: number, y: number) {
    this.touchMove.x = x;
    this.touchMove.y = y;
  }

  lookDelta(dx: number, dy: number) {
    this.lookDx += dx;
    this.lookDy += dy;
  }

  fireShot(kind: DataKind) {
    if (!this.playing) return;
    if (this.phase === "intro" || this.phase === "stageClear" || this.phase === "bossIntro") return;
    this.tryShoot(kind);
  }

  private onKey(e: KeyboardEvent, down: boolean) {
    if (
      down &&
      (e.code === "Space" ||
        e.code === "ArrowUp" ||
        e.code === "ArrowDown" ||
        e.code === "ArrowLeft" ||
        e.code === "ArrowRight")
    ) {
      e.preventDefault();
    }
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

  private onMouseMove(e: MouseEvent) {
    if (!this.playing) return;
    this.lookDx += e.movementX;
    this.lookDy += e.movementY;
  }

  private onMouseDown(e: MouseEvent) {
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

  private onMouseUp(e: MouseEvent) {
    if (e.button === 0 && this.fireHeld === "qualitative") this.fireHeld = null;
    if (e.button === 2 && this.fireHeld === "quantitative") this.fireHeld = null;
  }

  private onLock() {
    this.pointerLocked = document.pointerLockElement === this.canvas;
    useGameStore.setState({ locked: this.pointerLocked });
    if (!this.pointerLocked && this.playing && useGameStore.getState().screen === "playing") {
      // Don't auto-pause if lock never engaged (iframe). Only pause on explicit ESC.
    }
  }

  private beginStage() {
    const st = STAGES[this.stageIndex]!;
    this.quotaLeft = st.quota;
    this.spawnCd = 0.6;
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
      boss: null,
    });
  }

  private clearEntities() {
    for (const e of this.enemies) this.scene.remove(e.group);
    this.enemies.length = 0;
    for (const p of this.pickups) this.scene.remove(p.group);
    this.pickups.length = 0;
    for (const s of this.sparks) this.scene.remove(s.mesh);
    this.sparks.length = 0;
    for (const t of this.tracers) this.scene.remove(t.line);
    this.tracers.length = 0;
  }

  private tryShoot(kind: DataKind) {
    if (this.cooldown > 0 || this.hitstop > 0) return;
    if (this.phase === "attract" || this.phase === "victory" || this.phase === "dead") return;
    this.cooldown = 0.16;
    this.recoil = 0.085;
    this.muzzle = 0.05;
    this.muzzleKind = kind;
    this.audio.shoot(kind);
    this.trauma = Math.min(1, this.trauma + 0.12);

    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    const hits = this.raycaster.intersectObjects(this.scene.children, true);
    let target: THREE.Intersection | null = null;
    for (const h of hits) {
      const tag = this.findTag(h.object);
      if (tag) {
        target = h;
        break;
      }
    }
    const origin = this.tmp.copy(this.camera.getWorldPosition(this.tmp2));
    const dir = this.camera.getWorldDirection(new THREE.Vector3());
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
    if (tag.type === "boss" || tag.type === "core") {
      this.hitBoss(kind, target.point);
    }
  }

  private findTag(obj: THREE.Object3D): { type: string; id: number } | null {
    let o: THREE.Object3D | null = obj;
    while (o) {
      const u = o.userData as { type?: string; eid?: number };
      if (u.type) return { type: u.type, id: u.eid ?? 0 };
      o = o.parent;
    }
    return null;
  }

  private spawnTracer(from: THREE.Vector3, to: THREE.Vector3, kind: DataKind) {
    const geo = new THREE.BufferGeometry().setFromPoints([from.clone(), to.clone()]);
    const mat = new THREE.LineBasicMaterial({
      color: kind === "qualitative" ? COLOR.qual : COLOR.quant,
      transparent: true,
      opacity: 0.9,
    });
    const line = new THREE.Line(geo, mat);
    this.scene.add(line);
    this.tracers.push({ line, life: 0.08 });
  }

  private hitEnemy(id: number, kind: DataKind, point: THREE.Vector3) {
    const e = this.enemies.find((x) => x.id === id);
    if (!e) return;
    const ok = kind === e.question.kind;
    e.hp -= 1;
    this.flashEnemy(e, !ok);
    this.burst(point, ok ? (kind === "qualitative" ? QUAL : QUANT) : DANGER, ok ? 12 : 10);
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

  private hitBoss(kind: DataKind, point: THREE.Vector3) {
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
      if (this.finalIdx >= FINAL_SEQUENCE.length) {
        this.winRun();
      } else {
        const nq = FINAL_SEQUENCE[this.finalIdx]!;
        this.setHologram(nq.label, null);
      }
      return;
    }
    if (this.phase !== "boss") return;
    const st = STAGES[this.stageIndex]!;
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
      useGameStore.setState({ banner: "STAGE CLEAR", boss: null });
    }
  }

  private registerCorrect(isKill: boolean) {
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
    this.hitstop = this.reduced ? 0 : 0.035;
    this.trauma = Math.min(1, this.trauma + (isKill ? 0.28 : 0.16));
    this.markHit(true);
  }

  private registerWrong(q: Question) {
    this.wrong += 1;
    this.combo = 0;
    this.lastComboLabel = null;
    this.misses[q.label] = (this.misses[q.label] ?? 0) + 1;
    this.hurt();
    this.feedbackUntil = now() + 1.15;
    useGameStore.setState({
      feedback: {
        title: `${q.label}  —  不正解`,
        detail: q.explanation,
        ok: false,
      },
    });
    this.audio.wrong();
    this.markHit(false);
  }

  private hurt() {
    if (this.invuln > 0) return;
    this.lives -= 1;
    this.invuln = 0.85;
    this.trauma = 1;
    this.audio.damage();
    if (this.lives <= 0) this.failRun();
  }

  private markHit(ok: boolean) {
    useGameStore.setState({ hitmarker: { ok, at: now() } });
  }

  private killEnemy(e: Enemy, scored: boolean) {
    this.burst(e.group.position, e.question.kind === "qualitative" ? QUAL : QUANT, 18);
    if (e.type === "split") {
      this.spawnChild(e, -0.7);
      this.spawnChild(e, 0.7);
    }
    if (scored && Math.random() < 0.12 && this.phase === "wave") this.dropPickup(e.group.position);
    this.scene.remove(e.group);
    this.enemies = this.enemies.filter((x) => x.id !== e.id);
    this.audio.kill();
    if (scored) {
      /* quota already handled in registerCorrect for last hit */
    }
  }

  private spawnChild(parent: Enemy, offset: number) {
    const pos = parent.group.position.clone();
    pos.x += offset;
    this.spawnEnemy("mini", parent.question, pos);
  }

  private dropPickup(pos: THREE.Vector3) {
    if (this.pickups.length >= 2) return;
    const kinds: PowerupKind[] = ["scan", "slow", "bomb"];
    const kind = kinds[Math.floor(Math.random() * kinds.length)]!;
    const g = new THREE.Group();
    const color = kind === "scan" ? COLOR.qual : kind === "slow" ? COLOR.quant : COLOR.warn;
    const mat = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.8,
      metalness: 0.2,
      roughness: 0.3,
    });
    const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), mat);
    g.add(mesh);
    const spr = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: makeLabelTexture(kind === "scan" ? "SCAN" : kind === "slow" ? "SLOW" : "BOMB", null),
        transparent: true,
        depthWrite: false,
      }),
    );
    spr.scale.set(1.4, 0.35, 1);
    spr.position.y = 0.55;
    g.add(spr);
    g.position.copy(pos);
    g.position.y = 1.1;
    g.userData = { type: "pickup", eid: this.idSeq };
    const p: Pickup = { id: this.idSeq++, kind, group: g, life: 12 };
    this.pickups.push(p);
    this.scene.add(g);
  }

  private collectPickup(id: number) {
    const p = this.pickups.find((x) => x.id === id);
    if (!p) return;
    this.applyPowerup(p.kind);
    this.scene.remove(p.group);
    this.pickups = this.pickups.filter((x) => x.id !== id);
  }

  private applyPowerup(kind: PowerupKind) {
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

  private flashEnemy(e: Enemy, bad: boolean) {
    e.flash = 0.12;
    const mat = e.body.material as THREE.MeshStandardMaterial;
    mat.emissive.copy(bad ? DANGER : new THREE.Color(0xffffff));
    mat.emissiveIntensity = 1.4;
  }

  private burst(pos: THREE.Vector3, color: THREE.Color, n: number) {
    for (let i = 0; i < n; i++) {
      const mesh = new THREE.Mesh(this.sparkGeo, this.sparkMat.clone());
      (mesh.material as THREE.MeshBasicMaterial).color.copy(color);
      mesh.position.copy(pos);
      const s = 0.03 + Math.random() * 0.05;
      mesh.scale.setScalar(s);
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 6,
        Math.random() * 4,
        (Math.random() - 0.5) * 6,
      );
      this.scene.add(mesh);
      this.sparks.push({ mesh, vel, life: 0.35 + Math.random() * 0.25, max: 0.5 });
    }
  }

  private viewBasis() {
    const fx = -Math.sin(this.yaw);
    const fz = -Math.cos(this.yaw);
    const rx = Math.cos(this.yaw);
    const rz = -Math.sin(this.yaw);
    const vFov = (this.camera.fov * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * Math.max(0.42, this.camera.aspect));
    const halfH = Math.max(0.2, Math.min(0.72, hFov * 0.34));
    return { fx, fz, rx, rz, halfH };
  }

  private placeInView(group: THREE.Group) {
    const p = this.yawObj.position;
    const { fx, fz, rx, rz, halfH } = this.viewBasis();
    const n = this.enemies.length;
    const lane =
      n === 0
        ? (Math.random() * 2 - 1) * 0.28
        : ((n % 2 === 0 ? 1 : -1) * (0.32 + Math.random() * 0.55));
    const tryAt = (yawOff: number, dist: number) => {
      const x = p.x + (fx * Math.cos(yawOff) + rx * Math.sin(yawOff)) * dist;
      const z = p.z + (fz * Math.cos(yawOff) + rz * Math.sin(yawOff)) * dist;
      const cx = THREE.MathUtils.clamp(x, -ARENA + 1.1, ARENA - 1.1);
      const cz = THREE.MathUtils.clamp(z, -ARENA + 1.1, ARENA - 1.1);
      return { x: cx, z: cz, d: Math.hypot(cx - p.x, cz - p.z) };
    };

    let best = tryAt(lane * halfH, 10);
    for (let i = 0; i < 14; i++) {
      const jitter = (Math.random() * 2 - 1) * halfH * 0.18;
      const yawOff = THREE.MathUtils.clamp(lane * halfH * 0.92 + jitter, -halfH, halfH);
      const dist = 8.5 + Math.random() * 4.5;
      const cand = tryAt(yawOff, dist);
      let crowded = false;
      for (const e of this.enemies) {
        if (Math.hypot(e.group.position.x - cand.x, e.group.position.z - cand.z) < 1.6) {
          crowded = true;
          break;
        }
      }
      if (!crowded && cand.d >= 7.2) {
        group.position.set(cand.x, 1.28 + Math.random() * 0.42, cand.z);
        return;
      }
      if (cand.d > best.d) best = cand;
    }
    for (let i = 0; i < 10; i++) {
      const yawOff = (Math.random() * 2 - 1) * Math.min(1.05, halfH * 2.1);
      const cand = tryAt(yawOff, 11);
      if (cand.d > best.d) best = cand;
    }
    group.position.set(best.x, 1.35, best.z);
  }

  private makeHull(type: EnemyType): { hull: THREE.Group; body: THREE.Mesh; radius: number } {
    const hull = new THREE.Group();
    const size =
      type === "heavy" ? 1.3 : type === "mini" ? 0.54 : type === "fast" ? 0.88 : type === "split" ? 1.06 : 1;
    const paints = [0x1a242c, 0x1b1a26, 0x152226, 0x231c18, 0x171e28];
    const rims = [0x8b9aaa, 0x6a8898, 0x9a8e6a, 0x7a9488, 0x8a7a96];
    const paint = paints[Math.floor(Math.random() * paints.length)]!;
    const rimCol = rims[Math.floor(Math.random() * rims.length)]!;
    const mat = new THREE.MeshStandardMaterial({
      color: paint,
      metalness: 0.42 + Math.random() * 0.22,
      roughness: 0.28 + Math.random() * 0.22,
      emissive: 0x152028,
      emissiveIntensity: 0.6,
    });
    const rim = new THREE.MeshBasicMaterial({
      color: rimCol,
      transparent: true,
      opacity: 0.72,
    });
    const wire = new THREE.MeshBasicMaterial({
      color: rimCol,
      wireframe: true,
      transparent: true,
      opacity: 0.32,
    });
    this.mats.push(mat, rim, wire);
    const add = (g: THREE.BufferGeometry) => {
      this.geoms.push(g);
      return g;
    };

    const style = Math.floor(Math.random() * 12);
    let body: THREE.Mesh;
    if (style === 0) {
      body = new THREE.Mesh(add(new THREE.OctahedronGeometry(0.48 * size, 0)), mat);
    } else if (style === 1) {
      body = new THREE.Mesh(add(new THREE.IcosahedronGeometry(0.44 * size, 0)), mat);
    } else if (style === 2) {
      body = new THREE.Mesh(add(new THREE.DodecahedronGeometry(0.4 * size, 0)), mat);
    } else if (style === 3) {
      body = new THREE.Mesh(add(new THREE.ConeGeometry(0.3 * size, 0.92 * size, 5)), mat);
      body.rotation.x = Math.PI / 2;
    } else if (style === 4) {
      body = new THREE.Mesh(add(new THREE.BoxGeometry(0.72 * size, 0.72 * size, 0.72 * size)), mat);
    } else if (style === 5) {
      body = new THREE.Mesh(add(new THREE.TetrahedronGeometry(0.58 * size)), mat);
    } else if (style === 6) {
      body = new THREE.Mesh(add(new THREE.SphereGeometry(0.4 * size, 10, 8)), mat);
    } else if (style === 7) {
      body = new THREE.Mesh(add(new THREE.CylinderGeometry(0.28 * size, 0.28 * size, 0.72 * size, 6)), mat);
    } else if (style === 8) {
      body = new THREE.Mesh(add(new THREE.CapsuleGeometry(0.22 * size, 0.46 * size, 4, 8)), mat);
      body.rotation.z = Math.PI / 2;
    } else if (style === 9) {
      body = new THREE.Mesh(add(new THREE.TorusGeometry(0.32 * size, 0.12 * size, 8, 18)), mat);
      body.rotation.x = Math.PI / 2;
    } else if (style === 10) {
      body = new THREE.Mesh(add(new THREE.TorusKnotGeometry(0.26 * size, 0.07 * size, 48, 8)), mat);
    } else {
      const g = add(new THREE.OctahedronGeometry(0.5 * size, 0));
      body = new THREE.Mesh(g, mat);
      body.scale.set(0.7, 1.25, 0.7);
    }
    hull.add(body);

    const ornament = Math.floor(Math.random() * 5);
    if (ornament === 0) {
      const ring = new THREE.Mesh(add(new THREE.TorusGeometry(0.52 * size, 0.028 * size, 6, 22)), rim);
      ring.rotation.x = Math.PI / 2;
      hull.add(ring);
    } else if (ornament === 1) {
      const ring = new THREE.Mesh(add(new THREE.TorusGeometry(0.5 * size, 0.025 * size, 6, 20)), rim);
      ring.rotation.x = Math.PI / 3;
      hull.add(ring);
    } else if (ornament === 2) {
      const w = new THREE.Mesh(body.geometry, wire);
      w.scale.copy(body.scale).multiplyScalar(1.08);
      w.rotation.copy(body.rotation);
      hull.add(w);
    } else if (ornament === 3) {
      const fin = new THREE.Mesh(add(new THREE.BoxGeometry(0.08 * size, 0.42 * size, 0.22 * size)), rim);
      fin.position.y = 0.28 * size;
      hull.add(fin);
    } else {
      const disk = new THREE.Mesh(add(new THREE.CylinderGeometry(0.46 * size, 0.46 * size, 0.05 * size, 12)), rim);
      disk.position.y = -0.12 * size;
      hull.add(disk);
    }

    const radius =
      type === "heavy" ? 0.78 : type === "mini" ? 0.38 : type === "fast" ? 0.48 : type === "split" ? 0.62 : 0.55;
    return { hull, body, radius };
  }

  private spawnEnemy(type: EnemyType, question: Question, at?: THREE.Vector3) {
    const st = STAGES[this.stageIndex]!;
    const group = new THREE.Group();
    const id = this.idSeq++;
    const hp = type === "heavy" ? 2 : 1;
    const speedMul =
      type === "fast" ? 1.55 : type === "heavy" ? 0.72 : type === "mini" ? 1.35 : 1;
    const { hull, body, radius } = this.makeHull(type);
    const label = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: makeLabelTexture(question.label, null),
        transparent: true,
        depthWrite: false,
      }),
    );
    label.scale.set(type === "mini" ? 1.5 : 2.15, type === "mini" ? 0.38 : 0.54, 1);
    label.position.y = type === "heavy" ? 1.05 : 0.82;
    group.add(hull, label);
    group.userData = { type: "enemy", eid: id };
    body.userData = { type: "enemy", eid: id };
    hull.userData = { type: "enemy", eid: id };

    if (!at) {
      this.placeInView(group);
    } else {
      group.position.copy(at);
    }

    const e: Enemy = {
      id,
      type,
      question,
      hp,
      maxHp: hp,
      speed: st.speed * speedMul,
      group,
      hull,
      body,
      label,
      radius,
      phase: Math.random() * Math.PI * 2,
      spin: 0.6 + Math.random() * 1.8,
      flash: 0,
      born: 0,
    };
    this.enemies.push(e);
    this.scene.add(group);
    this.recent.push(question.id);
    if (this.recent.length > 6) this.recent.shift();
  }

  private spawnBoss() {
    const st = STAGES[this.stageIndex]!;
    this.clearEntities();
    this.phase = "bossIntro";
    this.phaseT = 1.6;
    this.bannerUntil = now() + 1.6;
    this.bossMax = st.id === 5 ? FINAL_SEQUENCE.length : 3;
    this.bossHp = this.bossMax;
    this.finalIdx = 0;
    this.finalTime = this.finalMax;
    this.core.userData = { type: st.id === 5 ? "core" : "boss", eid: 0 };
    this.core.traverse((o) => {
      o.userData = { type: st.id === 5 ? "core" : "boss", eid: 0 };
    });
    this.setHologram(st.id === 5 ? FINAL_SEQUENCE[0]!.label : st.boss.label, null);
    useGameStore.setState({
      banner: st.id === 5 ? "FINAL  DATA CORE" : `BOSS  ${st.boss.label}`,
    });
  }

  private loop = (ts?: number) => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);
    this.clock.update(ts);
    const dtRaw = Math.min(this.clock.getDelta(), 0.1);
    this.acc += dtRaw;
    while (this.acc >= STEP) {
      this.update(STEP);
      this.acc -= STEP;
    }
    this.render();
  };

  private update(dt: number) {
    const t = now();
    this.attractT += dt;
    this.core.rotation.y += dt * 0.35;
    const ring = this.core.children[1];
    if (ring) ring.rotation.z += dt * 0.5;
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
    this.recoil = THREE.MathUtils.damp(this.recoil, 0, 12, dt);
    this.muzzle = Math.max(0, this.muzzle - dt);
    this.trauma = Math.max(0, this.trauma - dt * 1.8);

    this.applyLook(dt);
    this.applyMove(dt);
    this.updateGun(dt);

    if (this.phase === "intro") {
      this.phaseT -= dt;
      if (this.phaseT <= 0) this.phase = "wave";
    } else if (this.phase === "wave") {
      this.updateWave(dt);
    } else if (this.phase === "bossIntro") {
      this.phaseT -= dt;
      if (this.phaseT <= 0) this.phase = this.stageIndex === 4 ? "finalBoss" : "boss";
    } else if (this.phase === "boss") {
      /* wait for shots */
    } else if (this.phase === "finalBoss") {
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

  private attractCam(dt: number) {
    const r = 11;
    const a = this.attractT * 0.18;
    this.yawObj.position.set(Math.cos(a) * r, 2.2, Math.sin(a) * r);
    this.yawObj.lookAt(0, 1.6, 0);
    this.camera.position.set(0, 0, 0);
    this.camera.rotation.set(0, 0, 0);
  }

  private applyLook(dt: number) {
    const sens = 0.0022;
    this.yaw -= this.lookDx * sens;
    this.pitch -= this.lookDy * sens;
    this.lookDx = 0;
    this.lookDy = 0;
    const lim = Math.PI / 2 - 0.08;
    this.pitch = THREE.MathUtils.clamp(this.pitch, -lim, lim);
    this.yawObj.rotation.set(0, this.yaw, 0);
    this.pitchObj.rotation.set(this.pitch, 0, 0);
    void dt;
  }

  private applyMove(dt: number) {
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
    if (wish.lengthSq() < 0.01) this.vel.multiplyScalar(damp);
    this.yawObj.position.addScaledVector(this.vel, dt);
    this.yawObj.position.x = THREE.MathUtils.clamp(this.yawObj.position.x, -ARENA, ARENA);
    this.yawObj.position.z = THREE.MathUtils.clamp(this.yawObj.position.z, -ARENA, ARENA);
    this.yawObj.position.y = EYE;
    for (const [px, pz] of [
      [-10, -10],
      [10, -10],
      [-10, 10],
      [10, 10],
    ]) {
      const dx = this.yawObj.position.x - px;
      const dz = this.yawObj.position.z - pz;
      const d = Math.hypot(dx, dz);
      if (d < 1.15 && d > 0.001) {
        this.yawObj.position.x = px + (dx / d) * 1.15;
        this.yawObj.position.z = pz + (dz / d) * 1.15;
      }
    }
    const moving = this.vel.length() > 0.4;
    this.bob += (moving ? 10 : 0) * dt;
  }

  private updateGun(dt: number) {
    const bobY = this.reduced ? 0 : Math.sin(this.bob) * 0.016;
    const bobX = this.reduced ? 0 : Math.cos(this.bob * 0.5) * 0.01;
    this.gun.position.set(
      this.gunBase.x + bobX,
      this.gunBase.y + bobY - this.recoil * 0.4,
      this.gunBase.z + this.recoil,
    );
    this.gun.rotation.x = this.recoil * 1.4;
    const col = this.muzzleKind === "qualitative" ? COLOR.qual : COLOR.quant;
    this.muzzleLight.color.setHex(col);
    this.muzzleLight.intensity = this.muzzle > 0 ? 6 : 0;
    void dt;
  }

  private updateWave(dt: number) {
    const st = STAGES[this.stageIndex]!;
    if (this.quotaLeft > 0 && this.enemies.length < st.maxAlive) {
      this.spawnCd -= dt;
      if (this.spawnCd <= 0) {
        const n = st.id >= 3 && this.enemies.length < st.maxAlive - 1 && Math.random() > 0.55 ? 2 : 1;
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

  private updateEnemies(dt: number) {
    const slow = now() < this.slowUntil ? 0.5 : 1;
    const scan = now() < this.scanUntil;
    const p = this.yawObj.position;
    const { fx, fz, rx, rz, halfH } = this.viewBasis();
    const cone = Math.min(0.78, halfH * 1.15);
    for (const e of [...this.enemies]) {
      e.born += dt;
      const scale = Math.min(1, e.born / 0.18);
      e.group.scale.setScalar(scale);
      const dx = e.group.position.x - p.x;
      const dz = e.group.position.z - p.z;
      const dist = Math.hypot(dx, dz);
      const fwd = dx * fx + dz * fz;
      const side = dx * rx + dz * rz;
      const ang = Math.atan2(side, fwd);
      let tx = p.x;
      let tz = p.z;
      if (dist > 0.001 && Math.abs(ang) > cone) {
        const orbit = Math.max(2.8, e.speed * 0.62);
        const step = orbit * slow * dt;
        const nextAng = ang - Math.sign(ang) * Math.min(Math.abs(ang) - cone * 0.85, step);
        const radius = Math.max(dist, 3.4);
        tx = p.x + (fx * Math.cos(nextAng) + rx * Math.sin(nextAng)) * radius;
        tz = p.z + (fz * Math.cos(nextAng) + rz * Math.sin(nextAng)) * radius;
      }
      const mx = tx - e.group.position.x;
      const mz = tz - e.group.position.z;
      const md = Math.hypot(mx, mz);
      if (md > 0.001) {
        const step = (e.speed * slow * dt) / md;
        e.group.position.x += mx * step;
        e.group.position.z += mz * step;
      }
      e.group.position.x = THREE.MathUtils.clamp(e.group.position.x, -ARENA, ARENA);
      e.group.position.z = THREE.MathUtils.clamp(e.group.position.z, -ARENA, ARENA);
      e.group.position.y += Math.sin(now() * 3 + e.phase) * 0.004;
      e.group.lookAt(p.x, e.group.position.y, p.z);
      e.hull.rotation.y += e.spin * dt;
      if (e.flash > 0) {
        e.flash -= dt;
        if (e.flash <= 0) {
          const mat = e.body.material as THREE.MeshStandardMaterial;
          mat.emissive.setHex(0x152028);
          mat.emissiveIntensity = 0.6;
        }
      }
      const tint = scan ? (e.question.kind === "qualitative" ? QUAL : QUANT) : null;
      if (tint && e.flash <= 0) {
        const mat = e.body.material as THREE.MeshStandardMaterial;
        mat.emissive.copy(tint);
        mat.emissiveIntensity = 0.95;
        e.label.material.color.copy(tint);
      } else if (!scan && e.flash <= 0) {
        e.label.material.color.set(0xffffff);
      }
      const hitDist = Math.hypot(e.group.position.x - p.x, e.group.position.z - p.z);
      if (hitDist < e.radius + 0.55) {
        this.combo = 0;
        this.lastComboLabel = null;
        this.hurt();
        this.feedbackUntil = now() + 0.9;
        useGameStore.setState({
          feedback: {
            title: "接触ダメージ",
            detail: "データターゲットに接触した。分類する前に距離を取れ。",
            ok: false,
          },
        });
        this.burst(e.group.position, DANGER, 14);
        this.scene.remove(e.group);
        this.enemies = this.enemies.filter((x) => x.id !== e.id);
      }
    }
  }

  private updatePickups(dt: number) {
    const p = this.yawObj.position;
    for (const pk of [...this.pickups]) {
      pk.life -= dt;
      pk.group.rotation.y += dt * 2.2;
      pk.group.position.y = 1.1 + Math.sin(now() * 3 + pk.id) * 0.12;
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

  private updateFx(dt: number) {
    for (const s of this.sparks) {
      s.life -= dt;
      s.mesh.position.addScaledVector(s.vel, dt);
      s.vel.y -= 8 * dt;
      const mat = s.mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, s.life / s.max);
      s.mesh.scale.multiplyScalar(0.96);
    }
    this.sparks = this.sparks.filter((s) => {
      if (s.life <= 0) {
        this.scene.remove(s.mesh);
        (s.mesh.material as THREE.Material).dispose();
        return false;
      }
      return true;
    });
    for (const tr of this.tracers) {
      tr.life -= dt;
      const mat = tr.line.material as THREE.LineBasicMaterial;
      mat.opacity = Math.max(0, tr.life / 0.08);
    }
    this.tracers = this.tracers.filter((tr) => {
      if (tr.life <= 0) {
        this.scene.remove(tr.line);
        tr.line.geometry.dispose();
        (tr.line.material as THREE.Material).dispose();
        return false;
      }
      return true;
    });
  }

  private lastPush = 0;
  private pushStoreThrottled(t: number) {
    if (t - this.lastPush < 0.04) return;
    this.lastPush = t;
    this.pushStore();
  }

  private pushStore() {
    const st = STAGES[this.stageIndex] ?? STAGES[0]!;
    const { label } = comboRank(this.combo);
    const t = now();
    const scan = t < this.scanUntil;
    const slow = t < this.slowUntil;
    let boss = useGameStore.getState().boss;
    if (this.phase === "boss") {
      boss = {
        name: st.boss.label,
        hp: this.bossHp,
        maxHp: this.bossMax,
        prompt: st.boss.label,
        timer: 0,
        timerMax: 0,
        final: false,
      };
    } else if (this.phase === "finalBoss") {
      const q = FINAL_SEQUENCE[this.finalIdx];
      boss = {
        name: "DATA CORE",
        hp: FINAL_SEQUENCE.length - this.finalIdx,
        maxHp: FINAL_SEQUENCE.length,
        prompt: q?.label ?? "",
        timer: this.finalTime,
        timerMax: this.finalMax,
        final: true,
      };
    } else if (this.phase !== "bossIntro") {
      boss = null;
    }
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
      locked: this.pointerLocked,
    });
  }

  private failRun() {
    this.playing = false;
    this.phase = "dead";
    this.finish(false);
  }

  private winRun() {
    this.playing = false;
    this.phase = "victory";
    this.audio.combo();
    this.finish(true);
  }

  private finish(cleared: boolean) {
    if (document.pointerLockElement) document.exitPointerLock();
    this.audio.stopMusic();
    const total = this.correct + this.wrong;
    const accuracy = total === 0 ? 0 : this.correct / total;
    const weak: WeakItem[] = Object.entries(this.misses)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([label, misses]) => ({ label, misses }));
    const result: ResultStats = {
      score: this.score,
      accuracy,
      maxCombo: this.maxCombo,
      elapsed: this.runTime,
      stageReached: STAGES[this.stageIndex]?.id ?? 1,
      cleared,
      weak,
      correct: this.correct,
      wrong: this.wrong,
    };
    const high = writeHighScore(this.score);
    useGameStore.setState({ screen: "result", result, highScore: high, banner: null, boss: null });
  }

  private render() {
    const shake = this.reduced ? 0 : this.trauma * this.trauma;
    const ox = (Math.random() - 0.5) * shake * 0.12;
    const oy = (Math.random() - 0.5) * shake * 0.12;
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
}