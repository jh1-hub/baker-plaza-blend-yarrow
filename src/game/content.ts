import type { DataKind, EnemyType, Question, StageDef } from "./types";

export const QUESTIONS: Record<string, Question> = {
  gender: {
    id: "gender",
    label: "性別",
    kind: "qualitative",
    explanation: "性別は分類のための属性であり、数値の大小比較に意味はない。質的データである。",
  },
  blood: {
    id: "blood",
    label: "血液型",
    kind: "qualitative",
    explanation: "血液型はA・B・Oなどのカテゴリであり、平均や合計に意味はない。質的データである。",
  },
  name: {
    id: "name",
    label: "氏名",
    kind: "qualitative",
    explanation: "氏名は識別のためのラベルであり、数値ではない。質的データである。",
  },
  hometown: {
    id: "hometown",
    label: "出身地",
    kind: "qualitative",
    explanation: "出身地は場所の分類であり、大小比較に意味はない。質的データである。",
  },
  color: {
    id: "color",
    label: "好きな色",
    kind: "qualitative",
    explanation: "好きな色はカテゴリであり、平均を取る対象ではない。質的データである。",
  },
  job: {
    id: "job",
    label: "職業",
    kind: "qualitative",
    explanation: "職業は分類ラベルであり、量の大小ではない。質的データである。",
  },
  nation: {
    id: "nation",
    label: "国籍",
    kind: "qualitative",
    explanation: "国籍はカテゴリであり、数値化しても計算対象にはならない。質的データである。",
  },
  club: {
    id: "club",
    label: "部活動",
    kind: "qualitative",
    explanation: "部活動は所属の分類であり、質的データである。",
  },
  weather: {
    id: "weather",
    label: "天気（晴／雨）",
    kind: "qualitative",
    explanation: "晴・雨はカテゴリであり、降水量とは違う。質的データである。",
  },
  rank: {
    id: "rank",
    label: "順位",
    kind: "qualitative",
    explanation: "順位は順序尺度であり、情報Ⅰでは質的データ（順序）として扱う。差に意味はない。",
  },
  grade: {
    id: "grade",
    label: "学年",
    kind: "qualitative",
    explanation: "学年はカテゴリ（1年・2年…）であり、身長のような量ではない。質的データである。",
  },
  className: {
    id: "className",
    label: "クラス名",
    kind: "qualitative",
    explanation: "クラス名は識別ラベルであり、質的データである。",
  },
  zip: {
    id: "zip",
    label: "郵便番号",
    kind: "qualitative",
    trap: true,
    explanation:
      "郵便番号は数字で表されるが、識別のための番号であり、大小比較に意味はない。したがって質的データである。",
  },
  attend: {
    id: "attend",
    label: "出席番号",
    kind: "qualitative",
    trap: true,
    explanation:
      "出席番号は数字だが、個人を識別するための番号であり、大きいほど何かが多いわけではない。質的データである。",
  },
  phone: {
    id: "phone",
    label: "電話番号",
    kind: "qualitative",
    trap: true,
    explanation:
      "電話番号は数字の並びだが、かけ算や平均に意味はない。識別番号なので質的データである。",
  },
  studentId: {
    id: "studentId",
    label: "学籍番号",
    kind: "qualitative",
    trap: true,
    explanation:
      "学籍番号は数字で書かれるが、学生を識別するための番号である。大小比較に意味はないので質的データである。",
  },
  employee: {
    id: "employee",
    label: "社員番号",
    kind: "qualitative",
    trap: true,
    explanation:
      "社員番号は識別コードであり、番号が大きいほど能力が高いわけではない。質的データである。",
  },
  member: {
    id: "member",
    label: "会員番号",
    kind: "qualitative",
    trap: true,
    explanation: "会員番号は識別のための番号であり、量ではない。質的データである。",
  },
  seat: {
    id: "seat",
    label: "座席番号",
    kind: "qualitative",
    trap: true,
    explanation: "座席番号は場所の識別であり、合計や平均に意味はない。質的データである。",
  },
  room: {
    id: "room",
    label: "部屋番号",
    kind: "qualitative",
    trap: true,
    explanation: "部屋番号は識別ラベルであり、数値として計算しない。質的データである。",
  },
  jersey: {
    id: "jersey",
    label: "背番号",
    kind: "qualitative",
    trap: true,
    explanation: "背番号は選手を識別する番号であり、大きさに意味はない。質的データである。",
  },
  sku: {
    id: "sku",
    label: "商品コード",
    kind: "qualitative",
    trap: true,
    explanation: "商品コードは識別記号であり、量的な測定値ではない。質的データである。",
  },
  plate: {
    id: "plate",
    label: "ナンバープレート",
    kind: "qualitative",
    trap: true,
    explanation: "ナンバープレートの数字は識別用であり、大小比較に意味はない。質的データである。",
  },
  insurance: {
    id: "insurance",
    label: "保険証番号",
    kind: "qualitative",
    trap: true,
    explanation: "保険証番号は個人を識別する番号であり、質的データである。",
  },
  height: {
    id: "height",
    label: "身長",
    kind: "quantitative",
    explanation: "身長はcmなどの単位で測れ、平均・合計・大小比較に意味がある。量的データである。",
  },
  weight: {
    id: "weight",
    label: "体重",
    kind: "quantitative",
    explanation: "体重は測定可能な量であり、平均を取れる。量的データである。",
  },
  age: {
    id: "age",
    label: "年齢",
    kind: "quantitative",
    explanation: "年齢は数値として差や平均に意味がある。量的データである。",
  },
  sales: {
    id: "sales",
    label: "売上高",
    kind: "quantitative",
    explanation: "売上高は金額という量であり、合計や比較ができる。量的データである。",
  },
  temp: {
    id: "temp",
    label: "気温",
    kind: "quantitative",
    explanation: "気温は数値で測れ、高低の比較に意味がある。量的データである。",
  },
  score: {
    id: "score",
    label: "得点",
    kind: "quantitative",
    explanation: "得点は数値であり、合計や平均が意味を持つ。量的データである。",
  },
  count: {
    id: "count",
    label: "人数",
    kind: "quantitative",
    explanation: "人数は数えられる量であり、量的データである。",
  },
  distance: {
    id: "distance",
    label: "距離",
    kind: "quantitative",
    explanation: "距離は測定可能な量であり、量的データである。",
  },
  speed: {
    id: "speed",
    label: "速度",
    kind: "quantitative",
    explanation: "速度は数値で表され、大小比較ができる。量的データである。",
  },
  area: {
    id: "area",
    label: "面積",
    kind: "quantitative",
    explanation: "面積は測定量であり、量的データである。",
  },
  rain: {
    id: "rain",
    label: "降水量",
    kind: "quantitative",
    explanation: "降水量はmmなどの単位で測る量であり、量的データである。",
  },
  sleep: {
    id: "sleep",
    label: "睡眠時間",
    kind: "quantitative",
    explanation: "睡眠時間は時間という量であり、平均できる。量的データである。",
  },
  steps: {
    id: "steps",
    label: "歩数",
    kind: "quantitative",
    explanation: "歩数は数えられる量であり、量的データである。",
  },
  bpm: {
    id: "bpm",
    label: "心拍数",
    kind: "quantitative",
    explanation: "心拍数は測定値であり、高低の比較ができる。量的データである。",
  },
  price: {
    id: "price",
    label: "価格",
    kind: "quantitative",
    explanation: "価格は金額という量であり、量的データである。",
  },
  pop: {
    id: "pop",
    label: "人口",
    kind: "quantitative",
    explanation: "人口は人数という量であり、量的データである。",
  },
  humidity: {
    id: "humidity",
    label: "湿度",
    kind: "quantitative",
    explanation: "湿度は数値で測れ、比較できる。量的データである。",
  },
  testScore: {
    id: "testScore",
    label: "テストの点数",
    kind: "quantitative",
    explanation: "テストの点数は得点という量であり、平均や合計に意味がある。量的データである。",
  },
  reaction: {
    id: "reaction",
    label: "反応時間",
    kind: "quantitative",
    explanation: "反応時間は秒という量であり、量的データである。",
  },
  calorie: {
    id: "calorie",
    label: "消費カロリー",
    kind: "quantitative",
    explanation: "消費カロリーは測定可能な量であり、量的データである。",
  },
  address: {
    id: "address",
    label: "住所",
    kind: "qualitative",
    explanation: "住所は場所の識別であり、平均や合計に意味はない。質的データである。",
  },
  prefecture: {
    id: "prefecture",
    label: "都道府県",
    kind: "qualitative",
    explanation: "都道府県は分類ラベルであり、大小比較に意味はない。質的データである。",
  },
  school: {
    id: "school",
    label: "学校名",
    kind: "qualitative",
    explanation: "学校名は識別のための名称であり、質的データである。",
  },
  subject: {
    id: "subject",
    label: "科目",
    kind: "qualitative",
    explanation: "科目は教科の分類であり、数値の大小ではない。質的データである。",
  },
  weekday: {
    id: "weekday",
    label: "曜日",
    kind: "qualitative",
    explanation: "曜日はカテゴリであり、平均を取る対象ではない。質的データである。",
  },
  zodiac: {
    id: "zodiac",
    label: "星座",
    kind: "qualitative",
    explanation: "星座は分類であり、量の測定値ではない。質的データである。",
  },
  handed: {
    id: "handed",
    label: "利き手",
    kind: "qualitative",
    explanation: "利き手は左・右などのカテゴリであり、質的データである。",
  },
  passfail: {
    id: "passfail",
    label: "合否",
    kind: "qualitative",
    explanation: "合否は分類であり、点数そのものとは違う。質的データである。",
  },
  username: {
    id: "username",
    label: "ユーザー名",
    kind: "qualitative",
    explanation: "ユーザー名は識別ラベルであり、計算対象ではない。質的データである。",
  },
  email: {
    id: "email",
    label: "メールアドレス",
    kind: "qualitative",
    explanation: "メールアドレスは識別のための文字列であり、質的データである。",
  },
  food: {
    id: "food",
    label: "好きな食べ物",
    kind: "qualitative",
    explanation: "好きな食べ物はカテゴリであり、量ではない。質的データである。",
  },
  hair: {
    id: "hair",
    label: "髪色",
    kind: "qualitative",
    explanation: "髪色は分類であり、平均に意味はない。質的データである。",
  },
  team: {
    id: "team",
    label: "チーム名",
    kind: "qualitative",
    explanation: "チーム名は識別ラベルであり、質的データである。",
  },
  brand: {
    id: "brand",
    label: "ブランド名",
    kind: "qualitative",
    explanation: "ブランド名は分類・識別のための名称であり、質的データである。",
  },
  station: {
    id: "station",
    label: "駅名",
    kind: "qualitative",
    explanation: "駅名は場所の識別であり、質的データである。",
  },
  line: {
    id: "line",
    label: "路線名",
    kind: "qualitative",
    explanation: "路線名は分類ラベルであり、質的データである。",
  },
  isbn: {
    id: "isbn",
    label: "ISBN",
    kind: "qualitative",
    trap: true,
    explanation: "ISBNは数字を含むが書籍を識別する番号であり、大小比較に意味はない。質的データである。",
  },
  mynumber: {
    id: "mynumber",
    label: "マイナンバー",
    kind: "qualitative",
    trap: true,
    explanation: "マイナンバーは個人を識別する番号であり、量ではない。質的データである。",
  },
  barcode: {
    id: "barcode",
    label: "バーコード",
    kind: "qualitative",
    trap: true,
    explanation: "バーコードの数字は商品識別用であり、合計や平均に意味はない。質的データである。",
  },
  serial: {
    id: "serial",
    label: "製造番号",
    kind: "qualitative",
    trap: true,
    explanation: "製造番号は個体を識別する番号であり、大きいほど性能が高いわけではない。質的データである。",
  },
  clinic: {
    id: "clinic",
    label: "診察券番号",
    kind: "qualitative",
    trap: true,
    explanation: "診察券番号は識別のための番号であり、質的データである。",
  },
  ip: {
    id: "ip",
    label: "IPアドレス",
    kind: "qualitative",
    trap: true,
    explanation: "IPアドレスは数字で表されるが機器の識別であり、大小比較に意味はない。質的データである。",
  },
  account: {
    id: "account",
    label: "口座番号",
    kind: "qualitative",
    trap: true,
    explanation: "口座番号は識別番号であり、量的な測定値ではない。質的データである。",
  },
  license: {
    id: "license",
    label: "免許証番号",
    kind: "qualitative",
    trap: true,
    explanation: "免許証番号は個人の識別であり、質的データである。",
  },
  modelNo: {
    id: "modelNo",
    label: "型番",
    kind: "qualitative",
    trap: true,
    explanation: "型番は製品を識別する記号であり、計算対象ではない。質的データである。",
  },
  cardNo: {
    id: "cardNo",
    label: "カード番号",
    kind: "qualitative",
    trap: true,
    explanation: "カード番号は識別のための番号であり、平均に意味はない。質的データである。",
  },
  length: {
    id: "length",
    label: "長さ",
    kind: "quantitative",
    explanation: "長さは測定可能な量であり、大小比較ができる。量的データである。",
  },
  volume: {
    id: "volume",
    label: "体積",
    kind: "quantitative",
    explanation: "体積は測定量であり、合計や比較に意味がある。量的データである。",
  },
  mass: {
    id: "mass",
    label: "質量",
    kind: "quantitative",
    explanation: "質量は測定可能な量であり、量的データである。",
  },
  duration: {
    id: "duration",
    label: "時間",
    kind: "quantitative",
    explanation: "時間は秒や分で測れ、平均できる。量的データである。",
  },
  voltage: {
    id: "voltage",
    label: "電圧",
    kind: "quantitative",
    explanation: "電圧は数値で測れ、高低の比較ができる。量的データである。",
  },
  wind: {
    id: "wind",
    label: "風速",
    kind: "quantitative",
    explanation: "風速は測定値であり、量的データである。",
  },
  pressure: {
    id: "pressure",
    label: "気圧",
    kind: "quantitative",
    explanation: "気圧は数値で測れ、比較できる。量的データである。",
  },
  bodyTemp: {
    id: "bodyTemp",
    label: "体温",
    kind: "quantitative",
    explanation: "体温は測定可能な量であり、量的データである。",
  },
  bloodPressure: {
    id: "bloodPressure",
    label: "血圧",
    kind: "quantitative",
    explanation: "血圧は数値で測れ、高低の比較に意味がある。量的データである。",
  },
  eyesight: {
    id: "eyesight",
    label: "視力",
    kind: "quantitative",
    explanation: "視力は数値で表され、大小比較ができる。量的データである。",
  },
  study: {
    id: "study",
    label: "勉強時間",
    kind: "quantitative",
    explanation: "勉強時間は時間という量であり、平均できる。量的データである。",
  },
  visitors: {
    id: "visitors",
    label: "来場者数",
    kind: "quantitative",
    explanation: "来場者数は数えられる量であり、量的データである。",
  },
  views: {
    id: "views",
    label: "閲覧数",
    kind: "quantitative",
    explanation: "閲覧数は回数という量であり、合計できる。量的データである。",
  },
  stock: {
    id: "stock",
    label: "在庫数",
    kind: "quantitative",
    explanation: "在庫数は数えられる量であり、量的データである。",
  },
  deviation: {
    id: "deviation",
    label: "偏差値",
    kind: "quantitative",
    explanation: "偏差値は数値であり、高低の比較に意味がある。量的データである。",
  },
  avgScore: {
    id: "avgScore",
    label: "平均点",
    kind: "quantitative",
    explanation: "平均点は得点の量であり、量的データである。",
  },
  minTemp: {
    id: "minTemp",
    label: "最低気温",
    kind: "quantitative",
    explanation: "最低気温は数値で測れ、比較できる。量的データである。",
  },
  density: {
    id: "density",
    label: "密度",
    kind: "quantitative",
    explanation: "密度は測定量であり、量的データである。",
  },
  mpg: {
    id: "mpg",
    label: "燃費",
    kind: "quantitative",
    explanation: "燃費は数値で表され、大小比較ができる。量的データである。",
  },
  practice: {
    id: "practice",
    label: "練習回数",
    kind: "quantitative",
    explanation: "練習回数は数えられる量であり、量的データである。",
  },
  money: {
    id: "money",
    label: "金額",
    kind: "quantitative",
    explanation: "金額はお金の量であり、合計や比較ができる。量的データである。",
  },
  noise: {
    id: "noise",
    label: "騒音レベル",
    kind: "quantitative",
    explanation: "騒音レベルはdBなどの単位で測る量であり、量的データである。",
  },
  power: {
    id: "power",
    label: "消費電力",
    kind: "quantitative",
    explanation: "消費電力は測定可能な量であり、量的データである。",
  },
};

export const ALL_IDS = Object.keys(QUESTIONS);

export const STAGES: StageDef[] = [
  {
    id: 1,
    code: "STAGE 01",
    name: "基礎訓練",
    quota: 10,
    speed: 1.45,
    spawnInterval: 2.05,
    maxAlive: 3,
    types: ["drone"],
    pool: [
      "gender",
      "blood",
      "name",
      "hometown",
      "color",
      "job",
      "school",
      "subject",
      "weekday",
      "food",
      "height",
      "weight",
      "age",
      "count",
      "sleep",
      "length",
      "duration",
    ],
    boss: {
      id: "boss1",
      label: "クラス全員の出席番号",
      kind: "qualitative",
      trap: true,
      explanation:
        "出席番号は数字だが識別のための番号であり、大小比較に意味はない。質的データである。",
    },
  },
  {
    id: 2,
    code: "STAGE 02",
    name: "実戦演習",
    quota: 14,
    speed: 2.4,
    spawnInterval: 1.48,
    maxAlive: 4,
    types: ["drone", "fast"],
    pool: [
      "attend",
      "zip",
      "phone",
      "member",
      "seat",
      "room",
      "jersey",
      "plate",
      "handed",
      "passfail",
      "height",
      "temp",
      "rain",
      "speed",
      "steps",
      "bodyTemp",
    ],
    boss: {
      id: "boss2",
      label: "全国の郵便番号",
      kind: "qualitative",
      trap: true,
      explanation:
        "郵便番号は数字で表されるが、識別のための番号であり、大小比較に意味はない。したがって質的データである。",
    },
  },
  {
    id: 3,
    code: "STAGE 03",
    name: "データ汚染区域",
    quota: 18,
    speed: 3.7,
    spawnInterval: 0.95,
    maxAlive: 6,
    types: ["drone", "fast", "heavy"],
    pool: [
      "studentId",
      "sales",
      "employee",
      "weight",
      "score",
      "insurance",
      "sku",
      "isbn",
      "serial",
      "ip",
      "mynumber",
      "account",
      "pop",
      "humidity",
      "bpm",
      "testScore",
      "area",
      "views",
    ],
    boss: {
      id: "boss3",
      label: "商品Aの売上高",
      kind: "quantitative",
      explanation: "売上高は金額という量であり、合計や比較ができる。量的データである。",
    },
  },
  {
    id: 4,
    code: "STAGE 04",
    name: "統計研究所",
    quota: 24,
    speed: 4.55,
    spawnInterval: 0.72,
    maxAlive: 8,
    types: ["drone", "fast", "heavy", "split"],
    pool: ALL_IDS,
    boss: {
      id: "boss4",
      label: "今日の最高気温",
      kind: "quantitative",
      explanation: "最高気温は数値で測れ、高低の比較に意味がある。量的データである。",
    },
  },
  {
    id: 5,
    code: "STAGE 05",
    name: "DATA CORE",
    quota: 20,
    speed: 5.15,
    spawnInterval: 0.55,
    maxAlive: 10,
    types: ["drone", "fast", "heavy", "split"],
    pool: ALL_IDS,
    boss: {
      id: "boss5",
      label: "AIデータコア",
      kind: "qualitative",
      explanation: "最終コアは連続分類で制圧する。",
    },
  },
];

export const FINAL_SEQUENCE: Question[] = [
  QUESTIONS.phone,
  QUESTIONS.sales,
  QUESTIONS.studentId,
  QUESTIONS.weight,
  QUESTIONS.zip,
  QUESTIONS.temp,
  QUESTIONS.attend,
  QUESTIONS.testScore,
  QUESTIONS.employee,
  QUESTIONS.height,
];

export function comboRank(combo: number): { label: string | null; mult: number } {
  if (combo >= 30) return { label: "DATA MASTER", mult: 5 };
  if (combo >= 20) return { label: "EXCELLENT", mult: 3 };
  if (combo >= 10) return { label: "GREAT", mult: 2 };
  if (combo >= 5) return { label: "GOOD", mult: 1.5 };
  return { label: null, mult: 1 };
}

export function kindLabel(kind: DataKind): string {
  return kind === "qualitative" ? "質的データ" : "量的データ";
}

export function pickQuestion(pool: string[], avoid: string[] = []): Question {
  const ids = pool.filter((id) => QUESTIONS[id]);
  const fresh = ids.filter((id) => !avoid.includes(id));
  const use = fresh.length ? fresh : ids;
  const id = use[Math.floor(Math.random() * use.length)] ?? ids[0] ?? "height";
  return QUESTIONS[id] ?? QUESTIONS.height;
}

export function pickEnemyType(types: EnemyType[], stageId: number): EnemyType {
  const roll = Math.random();
  if (types.includes("split") && roll > 0.84) return "split";
  if (types.includes("heavy") && roll > 0.68) return "heavy";
  if (types.includes("fast") && roll > 0.42) return "fast";
  if (types.includes("fast") && stageId >= 5 && roll > 0.28) return "fast";
  return "drone";
}

export const COLOR = {
  qual: 0x39ff87,
  quant: 0x2ecbff,
  danger: 0xff3b4e,
  warn: 0xffc14a,
  white: 0xe8f0f4,
  dim: 0x8b9aaa,
} as const;
