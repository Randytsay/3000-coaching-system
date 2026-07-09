import { createSign } from "node:crypto";

const SPREADSHEET_ID = process.env.TEAM_TALENT_SPREADSHEET_ID || "1_qUkPpUqg_dzE9q7aJtxvhVoYYGO9hwKoIfCsE5pCr0";
const SHEET_NAME = process.env.TEAM_TALENT_SHEET_NAME || "工作表1";
const SHEET_GID = process.env.TEAM_TALENT_SHEET_GID || "0";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

const headers = ["時間", "姓名", "主修天賦", "副修天賦", "關係分數", "工具分數", "零售分數", "招募分數", "自媒體分數", "AI意願"];
const powers = ["關係教練", "工具教練", "零售教練", "招募教練", "自媒體/IP教練"];

type RawRow = Record<string, string>;

export type TalentPerson = {
  submittedAt: string;
  displayTime: string;
  name: string;
  primaryTalent: string;
  secondaryTalent: string;
  scores: Record<string, number>;
  aiInterest: string;
};

export type TalentDashboard = {
  people: TalentPerson[];
  totalResponses: number;
  duplicateCount: number;
  latestUpdate: string | null;
  primaryDistribution: Array<{ talent: string; count: number; names: string[] }>;
  secondaryDistribution: Array<{ talent: string; count: number; names: string[] }>;
  aiDistribution: Array<{ answer: string; count: number; names: string[] }>;
  scoreAverages: Array<{ label: string; average: number; max: number; names: string[] }>;
  analysis: {
    source: "llm" | "rule" | "setup";
    title: string;
    summary: string;
    strengths: string[];
    blindSpots: string[];
    suggestions: string[];
    setupMissing: string[];
  };
};

function base64Url(input: Buffer | string) {
  return Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function normalizePrivateKey(value: string) {
  return value.replace(/\\n/g, "\n");
}

async function getGoogleAccessToken() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !privateKey) return null;

  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64Url(JSON.stringify({
    iss: email,
    scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }));
  const signingInput = `${header}.${claim}`;
  const signer = createSign("RSA-SHA256");
  signer.update(signingInput);
  signer.end();
  const signature = signer.sign(normalizePrivateKey(privateKey));
  const assertion = `${signingInput}.${base64Url(signature)}`;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!response.ok) {
    throw new Error(`Google token request failed: ${response.status}`);
  }

  const data = await response.json() as { access_token?: string };
  return data.access_token || null;
}

async function fetchPrivateSheetRows() {
  const token = await getGoogleAccessToken();
  if (!token) return null;

  const range = encodeURIComponent(`${SHEET_NAME}!A:J`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?majorDimension=ROWS`;
  const response = await fetch(url, {
    headers: { authorization: `Bearer ${token}` },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Google Sheets API failed: ${response.status}`);
  }

  const data = await response.json() as { values?: string[][] };
  return data.values || [];
}

function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.length > 0)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell);
  if (row.some((value) => value.length > 0)) rows.push(row);
  return rows;
}

async function fetchPublicSheetRows() {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&gid=${SHEET_GID}`;
  const response = await fetch(url, { next: { revalidate: 300 } });

  if (!response.ok) {
    throw new Error(`Public CSV export failed: ${response.status}`);
  }

  return parseCsv(await response.text());
}

function rowsToRecords(rows: string[][]) {
  const [headerRow, ...body] = rows;
  const activeHeaders = headerRow?.length ? headerRow : headers;

  return body
    .filter((row) => row.some((cell) => `${cell || ""}`.trim()))
    .map((row) => activeHeaders.reduce<RawRow>((record, header, index) => {
      record[header] = `${row[index] || ""}`.trim();
      return record;
    }, {}));
}

function splitTalents(value: string) {
  return value
    .split(/[、,，]/)
    .map((item) => item.trim())
    .filter((item) => item && item !== "無（並列主修）");
}

function toPerson(row: RawRow): TalentPerson | null {
  const name = row["姓名"]?.trim();
  const submittedAt = row["時間"]?.trim();
  if (!name || !submittedAt) return null;

  const date = new Date(submittedAt);
  const displayTime = Number.isNaN(date.getTime())
    ? submittedAt
    : new Intl.DateTimeFormat("zh-TW", { timeZone: "Asia/Taipei", dateStyle: "medium", timeStyle: "short" }).format(date);

  return {
    submittedAt,
    displayTime,
    name,
    primaryTalent: row["主修天賦"] || "未分類",
    secondaryTalent: row["副修天賦"] || "未分類",
    scores: {
      "關係": Number(row["關係分數"] || 0),
      "工具": Number(row["工具分數"] || 0),
      "零售": Number(row["零售分數"] || 0),
      "招募": Number(row["招募分數"] || 0),
      "自媒體": Number(row["自媒體分數"] || 0),
    },
    aiInterest: row["AI意願"] || "未填寫",
  };
}

function dedupeLatest(records: RawRow[]) {
  const latest = new Map<string, TalentPerson>();
  let total = 0;

  for (const record of records) {
    const person = toPerson(record);
    if (!person) continue;
    total += 1;
    const current = latest.get(person.name);
    if (!current || Date.parse(person.submittedAt) >= Date.parse(current.submittedAt)) {
      latest.set(person.name, person);
    }
  }

  const people = [...latest.values()].sort((a, b) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt));
  return { people, totalResponses: total, duplicateCount: total - people.length };
}

function buildDistribution(people: TalentPerson[], field: "primaryTalent" | "secondaryTalent") {
  const grouped = new Map<string, Set<string>>();

  for (const person of people) {
    for (const talent of splitTalents(person[field])) {
      if (!grouped.has(talent)) grouped.set(talent, new Set());
      grouped.get(talent)?.add(person.name);
    }
  }

  return [...grouped.entries()]
    .map(([talent, names]) => ({ talent, count: names.size, names: [...names].sort((a, b) => a.localeCompare(b, "zh-Hant")) }))
    .sort((a, b) => b.count - a.count || a.talent.localeCompare(b.talent, "zh-Hant"));
}

function buildAiDistribution(people: TalentPerson[]) {
  const grouped = new Map<string, Set<string>>();
  for (const person of people) {
    if (!grouped.has(person.aiInterest)) grouped.set(person.aiInterest, new Set());
    grouped.get(person.aiInterest)?.add(person.name);
  }
  return [...grouped.entries()]
    .map(([answer, names]) => ({ answer, count: names.size, names: [...names].sort((a, b) => a.localeCompare(b, "zh-Hant")) }))
    .sort((a, b) => b.count - a.count || a.answer.localeCompare(b.answer, "zh-Hant"));
}

function buildScoreAverages(people: TalentPerson[]) {
  return Object.keys(people[0]?.scores || { "關係": 0, "工具": 0, "零售": 0, "招募": 0, "自媒體": 0 }).map((label) => {
    const total = people.reduce((sum, person) => sum + (person.scores[label] || 0), 0);
    const max = Math.max(0, ...people.map((person) => person.scores[label] || 0));
    const names = people.filter((person) => (person.scores[label] || 0) === max && max > 0).map((person) => person.name);
    return { label, average: people.length ? Number((total / people.length).toFixed(1)) : 0, max, names };
  }).sort((a, b) => b.average - a.average);
}

function fallbackAnalysis(dashboard: Omit<TalentDashboard, "analysis">) {
  const top = dashboard.primaryDistribution[0];
  const missing = powers.filter((power) => !dashboard.primaryDistribution.some((item) => item.talent === power));
  const aiHot = dashboard.aiDistribution.find((item) => item.answer.includes("很想"));

  return {
    source: "rule" as const,
    title: "團隊解析待 LLM 啟用，先提供規則版觀察",
    summary: top ? `目前團隊最集中的主修是「${top.talent}」，共有 ${top.count} 位。這表示第一版陪跑可以先從既有人才較多的角色啟動，再補足較稀缺的能力。` : "目前尚未讀到有效問卷資料。",
    strengths: [
      top ? `${top.talent} 有 ${top.names.join("、")}，可以作為第一批任務分工的核心。` : "尚未形成明確主修分佈。",
      aiHot ? `${aiHot.names.join("、")} 對 AI 工具有高度熱情，可先邀請參與工具化與內容產出。` : "AI 意願目前較分散，適合先用小任務試水溫。",
    ],
    blindSpots: [
      missing.length ? `目前沒有明確主修：${missing.join("、")}，這些領域需要副修支援或後續培養。` : "五力主修都有出現，下一步重點是建立實作能力標準。",
      "問卷代表天賦傾向，不等於教練資格，仍需要實習、觀察與督導。",
    ],
    suggestions: [
      "先依主修建立人才池，再用副修補位，不要要求每個人五力全會。",
      "每月重新讀取問卷結果，針對新增與重填者更新分工名單。",
      "把高 AI 意願者安排成內容整理、流程自動化與教學素材小組。",
    ],
    setupMissing: ["OPENAI_API_KEY"],
  };
}

async function generateLlmAnalysis(dashboard: Omit<TalentDashboard, "analysis">) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return fallbackAnalysis(dashboard);

  const payload = {
    totalPeople: dashboard.people.length,
    totalResponses: dashboard.totalResponses,
    duplicateCount: dashboard.duplicateCount,
    primaryDistribution: dashboard.primaryDistribution,
    secondaryDistribution: dashboard.secondaryDistribution,
    aiDistribution: dashboard.aiDistribution,
    scoreAverages: dashboard.scoreAverages,
    people: dashboard.people.map((person) => ({
      name: person.name,
      primaryTalent: person.primaryTalent,
      secondaryTalent: person.secondaryTalent,
      scores: person.scores,
      aiInterest: person.aiInterest,
    })),
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "你是團隊教練制度顧問。請用繁體中文，客觀、溫暖、務實地解析五力教練團隊分佈。不可誇大測驗效度，不可把問卷結果說成教練資格。只輸出 JSON。",
        },
        {
          role: "user",
          content: `根據以下團隊問卷統計，輸出 JSON，格式為 {"title": string, "summary": string, "strengths": string[], "blindSpots": string[], "suggestions": string[]}。每個陣列 3 點以內，每點 35 字以內。資料：${JSON.stringify(payload)}`,
        },
      ],
    }),
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    return { ...fallbackAnalysis(dashboard), title: "LLM 暫時無法產生解析，先顯示規則版觀察", setupMissing: [] };
  }

  const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content || "{}";

  try {
    const parsed = JSON.parse(content) as Partial<TalentDashboard["analysis"]>;
    return {
      source: "llm" as const,
      title: parsed.title || "團隊天賦解析",
      summary: parsed.summary || fallbackAnalysis(dashboard).summary,
      strengths: parsed.strengths?.slice(0, 3) || [],
      blindSpots: parsed.blindSpots?.slice(0, 3) || [],
      suggestions: parsed.suggestions?.slice(0, 3) || [],
      setupMissing: [],
    };
  } catch {
    return { ...fallbackAnalysis(dashboard), title: "LLM 回傳格式需調整，先顯示規則版觀察", setupMissing: [] };
  }
}

export async function getTeamTalentDashboard(): Promise<TalentDashboard> {
  let rows = await fetchPrivateSheetRows();
  if (!rows) rows = await fetchPublicSheetRows();

  const records = rowsToRecords(rows);
  const { people, totalResponses, duplicateCount } = dedupeLatest(records);
  const latestUpdate = people[0]?.displayTime || null;
  const base = {
    people,
    totalResponses,
    duplicateCount,
    latestUpdate,
    primaryDistribution: buildDistribution(people, "primaryTalent"),
    secondaryDistribution: buildDistribution(people, "secondaryTalent"),
    aiDistribution: buildAiDistribution(people),
    scoreAverages: buildScoreAverages(people),
  };
  const analysis = await generateLlmAnalysis(base);

  return { ...base, analysis };
}
