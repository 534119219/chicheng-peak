/**
 * chicheng-peak — host half
 *
 * DeepSeek 峰谷提醒：依据官方峰谷定价时段判定当前处于「高峰期」还是「低峰期」，
 * 把状态与配置经 fenced JSON API 暴露给 client 半（边框效果 / 设置页），并且在
 * 到达高峰/低峰的指定提前量触发消息推送提醒（chicheng-push 渠道 或 messaging-core
 * 消息平台），标题与内容允许用户自定义模板。
 *
 * 官方时段（北京时间，2026-08-17 起生效）：
 *   高峰 09:00–12:00、14:00–18:00；其余为低峰（空闲）时段，价格约为高峰一半。
 *
 * 运行时仅依赖 Node 内置模块 + profile 组合提供的服务，零第三方运行时依赖。
 */
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

// ---------------------------------------------------------------- identity

const name = "chicheng-peak";
const inject = ["webServer", "webRuntime"];

// ---------------------------------------------------------------- paths

const DATA_ROOT = process.env.DSH_HOME
  ? join(process.env.DSH_HOME, "peakvalley")
  : join(homedir(), ".dsh", "peakvalley");
const CONFIG_PATH = join(DATA_ROOT, "config.json");
const FIRED_PATH = join(DATA_ROOT, "fired.json");

// ---------------------------------------------------------------- defaults

const PHASES = { PEAK: "peak", VALLEY: "valley" };

/** Official DeepSeek peak windows (Asia/Shanghai), effective 2026-08-17. */
const OFFICIAL_WINDOWS = [
  { start: "09:00", end: "12:00" },
  { start: "14:00", end: "18:00" },
];

const TIMEZONES = ["Asia/Shanghai", "Asia/Hong_Kong", "Asia/Tokyo", "Asia/Singapore", "Asia/Seoul", "UTC", "Europe/London", "Europe/Paris", "America/New_York", "America/Los_Angeles"];

const DEFAULT_CONFIG = {
  version: 1,
  enabled: true,
  timezone: "Asia/Shanghai",
  windows: structuredClone(OFFICIAL_WINDOWS),
  override: "auto", // auto | peak | valley
  pollSeconds: 15,
  edge: {
    enabled: true,
    peakColor: "#f97316",
    valleyColor: "#38bdf8",
    width: 3,
    animation: "breathing", // breathing | solid | off
    breathingSpeed: 2.6,
    glow: 22,
    opacity: 0.95,
    flow: false,
    flowSpeed: 6,
    badge: false,
  },
  localNotify: {
    enabled: false,
    onTransition: true,
    onReminder: false,
  },
  reminders: {
    peak: {
      enabled: false,
      leadMinutes: 0,
      channel: "all",
      times: "",
      title: "DeepSeek 高峰期开始",
      content: "{phase}开始：{start}～{end}\n当前时间：{time}",
    },
    valley: {
      enabled: false,
      leadMinutes: 0,
      channel: "all",
      times: "",
      title: "DeepSeek 低峰期开始",
      content: "{phase}开始：{start}～{end}\n当前时间：{time}",
    },
  },
};

const PHASE_TEXTS = {
  peak: { zh: "高峰期", en: "Peak hours" },
  valley: { zh: "低峰期", en: "Valley hours" },
};

// ---------------------------------------------------------------- store

let config = structuredClone(DEFAULT_CONFIG);
let firedKeys = new Set();
let storeDirtyTimer = null;
let tickTimer = null;
let currentCtx = null;
let tearDown = false;

async function loadJson(path, fallback) {
  try {
    const raw = await readFile(path, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function loadStore() {
  config = { ...structuredClone(DEFAULT_CONFIG), ...(await loadJson(CONFIG_PATH, {})) };
  config.edge = { ...DEFAULT_CONFIG.edge, ...(config.edge ?? {}) };
  config.localNotify = { ...DEFAULT_CONFIG.localNotify, ...(config.localNotify ?? {}) };
  config.reminders = {
    peak: { ...DEFAULT_CONFIG.reminders.peak, ...(config.reminders?.peak ?? {}) },
    valley: { ...DEFAULT_CONFIG.reminders.valley, ...(config.reminders?.valley ?? {}) },
  };
  if (!Array.isArray(config.windows) || config.windows.length === 0) config.windows = structuredClone(OFFICIAL_WINDOWS);
  try {
    const fired = await loadJson(FIRED_PATH, []);
    if (Array.isArray(fired)) firedKeys = new Set(fired.slice(-2000));
  } catch {
    firedKeys = new Set();
  }
}

function scheduleSave() {
  if (storeDirtyTimer !== null) return;
  storeDirtyTimer = setTimeout(() => {
    storeDirtyTimer = null;
    void flushConfig();
    void flushFired();
  }, 120);
}

async function flushConfig() {
  try {
    await mkdir(DATA_ROOT, { recursive: true });
    const tmp = `${CONFIG_PATH}.tmp`;
    await writeFile(tmp, JSON.stringify(config, null, 2), "utf8");
    await rename(tmp, CONFIG_PATH);
  } catch (error) {
    console.error("[chicheng-peak] config flush failed:", error);
  }
}

async function flushFired() {
  try {
    await mkdir(DATA_ROOT, { recursive: true });
    const tmp = `${FIRED_PATH}.tmp`;
    await writeFile(tmp, JSON.stringify([...firedKeys].slice(-2000), null, 0), "utf8");
    await rename(tmp, FIRED_PATH);
  } catch (error) {
    console.error("[chicheng-peak] fired flush failed:", error);
  }
}

// ---------------------------------------------------------------- timezone
//
// All schedule math works on "minutes since local midnight" in the configured
// IANA timezone. Field extraction uses Intl (no DST assembly errors); epoch
// assembly for a local wall-clock minute estimates the offset from the current
// instant, which is exact for fixed-offset zones (Asia/Shanghai etc.) and
// only off by an hour around a DST switch for zones that observe one.

const ZONED_FC = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai",
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

function zonedFormatter(timeZone) {
  if (timeZone && timeZone !== ZONED_FC.resolvedOptions().timeZone) {
    try {
      return new Intl.DateTimeFormat("en-CA", {
        timeZone,
        hourCycle: "h23",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      // invalid timezone → fall back to Asia/Shanghai
    }
  }
  return ZONED_FC;
}

/** { y, m (1-12), d, h (0-23), min, s } for a Date in the target timezone. */
function zonedParts(date, timeZone) {
  const fmt = zonedFormatter(timeZone);
  const parts = {};
  for (const p of fmt.formatToParts(date)) parts[p.type] = p.value;
  return {
    y: Number(parts.year),
    m: Number(parts.month),
    d: Number(parts.day),
    h: Number(parts.hour),
    min: Number(parts.minute),
    s: Number(parts.second),
  };
}

/** Minutes since local midnight for a Date in the target timezone. */
function zonedMinutes(date, timeZone) {
  const p = zonedParts(date, timeZone);
  return p.h * 60 + p.min;
}

/** Epoch ms for a local wall-clock (y, m, d, minuteOfDay) in the target timezone. */
function zonedEpoch(y, m, d, minuteOfDay, timeZone, refDate) {
  // Estimate the zone offset using a recent reference instant; fixed-offset
  // zones (including all of the common Asia choices) get the exact value.
  let offsetMinutes = 0;
  try {
    const ref = refDate ?? new Date();
    const p = zonedParts(ref, timeZone);
    const utcGuess = Date.UTC(p.y, p.m - 1, p.d, p.h, p.min, p.s);
    offsetMinutes = Math.round((ref.getTime() - utcGuess) / 60000);
  } catch {
    offsetMinutes = 0;
  }
  const hour = Math.floor(minuteOfDay / 60);
  const minute = minuteOfDay % 60;
  // offsetMinutes = (ref instant) − (ref wall clock as UTC) = −(zone offset east).
  // A local wall clock L with east offset O is UTC L − O, so subtract the
  // computed negation: Date.UTC(wall) + offsetMinutes.
  return Date.UTC(y, m - 1, d, hour, minute, 0) + offsetMinutes * 60000;
}

// ---------------------------------------------------------------- schedule

function parseHM(text) {
  const m = /^(\d{1,2}):([0-5]\d)$/.exec(String(text ?? "").trim());
  if (!m) return null;
  const h = Number(m[1]);
  if (h < 0 || h > 23) return null;
  return h * 60 + Number(m[2]);
}

function formatHM(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** True when `minutes` (local minute of day) is inside any [start, end) window. */
function isPeakAt(minutes, windows) {
  return windows.some((w) => {
    const s = parseHM(w.start);
    const e = parseHM(w.end);
    if (s === null || e === null || e <= s) return false;
    return minutes >= s && minutes < e;
  });
}

function phaseAt(date, cfg) {
  if (cfg.override === "peak") return PHASES.PEAK;
  if (cfg.override === "valley") return PHASES.VALLEY;
  return isPeakAt(zonedMinutes(date, cfg.timezone), cfg.windows) ? PHASES.PEAK : PHASES.VALLEY;
}

/**
 * Compute the next phase transition strictly after `now`, scanning candidate
 * boundaries over the next 3 local days. Returns { at: Date, phase } or null.
 */
function nextTransition(now, cfg) {
  // In forced mode the schedule is suspended — no transitions to report.
  if (cfg.override !== "auto") return null;
  const tz = cfg.timezone;
  const current = phaseAt(now, cfg);
  const boundaries = [];
  for (let dayOffset = 0; dayOffset <= 2; dayOffset += 1) {
    const bp = zonedParts(new Date(now.getTime() + dayOffset * 86400000), tz);
    for (const w of cfg.windows) {
      const s = parseHM(w.start);
      const e = parseHM(w.end);
      if (s === null || e === null || e <= s) continue;
      boundaries.push({ min: s, at: zonedEpoch(bp.y, bp.m, bp.d, s, tz, now) });
      boundaries.push({ min: e, at: zonedEpoch(bp.y, bp.m, bp.d, e, tz, now) });
    }
  }
  boundaries.sort((a, b) => a.at - b.at);
  for (const b of boundaries) {
    if (b.at <= now.getTime()) continue;
    const before = phaseAt(new Date(b.at - 60000), cfg);
    const after = isPeakAt(b.min, cfg.windows) ? PHASES.PEAK : PHASES.VALLEY;
    if (before !== after) return { at: new Date(b.at), phase: after };
  }
  return null;
}

/**
 * All occurrences of `phase` starting strictly after `from` (window starts and
 * ends, over the next 3 local days), for reminder scheduling.
 */
function phaseStarts(from, phase, cfg) {
  const tz = cfg.timezone;
  const out = [];
  for (let dayOffset = 0; dayOffset <= 2; dayOffset += 1) {
    const bp = zonedParts(new Date(from.getTime() + dayOffset * 86400000), tz);
    const candidates = [];
    for (const w of cfg.windows) {
      const s = parseHM(w.start);
      const e = parseHM(w.end);
      if (s === null || e === null || e <= s) continue;
      candidates.push({ min: s, phase: PHASES.PEAK });
      candidates.push({ min: e, phase: PHASES.VALLEY });
    }
    for (const c of candidates) {
      if (c.phase !== phase) continue;
      const at = zonedEpoch(bp.y, bp.m, bp.d, c.min, tz, from);
      if (at > from.getTime()) out.push({ at: new Date(at), phase });
    }
  }
  out.sort((a, b) => a.at - b.at);
  return out;
}

// ---------------------------------------------------------------- render

/** Substitute {placeholder} tokens in a template. */
function renderTemplate(template, values) {
  return String(template ?? "").replace(/\{(\w+)\}/g, (_, key) =>
    values[key] !== undefined && values[key] !== null ? String(values[key]) : `{${key}}`,
  );
}

function formatFriendly(date, timeZone) {
  try {
    return new Intl.DateTimeFormat("zh-CN", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(date);
  } catch {
    return date.toLocaleString();
  }
}

/** Build the template values for a phase transition reminder. */
function buildValues(cfg, phase, transitionAt) {
  const p = zonedParts(transitionAt, cfg.timezone);
  const windowsFor = phase === PHASES.PEAK
    ? cfg.windows.filter((w) => parseHM(w.start) !== null && parseHM(w.end) !== null && parseHM(w.end) > parseHM(w.start))
    : [];
  const label = PHASE_TEXTS[phase]?.zh ?? phase;
  const start = transitionAt ? formatHM(p.h * 60 + p.min) : "";
  let end = "";
  if (phase === PHASES.PEAK && windowsFor.length > 0) {
    const idx = windowsFor.findIndex((w) => parseHM(w.start) === p.h * 60 + p.min);
    end = formatHM(parseHM(windowsFor[Math.max(0, idx)].end));
  }
  if (phase === PHASES.VALLEY) {
    // end = next peak start (same day or next-day wrap)
    const next = nextTransition(transitionAt, cfg);
    const nextP = next ? zonedParts(next.at, cfg.timezone) : null;
    end = nextP ? formatHM(nextP.h * 60 + nextP.min) : "";
  }
  const now = new Date();
  const nowP = zonedParts(now, cfg.timezone);
  return {
    phase: label,
    phaseEn: PHASE_TEXTS[phase]?.en ?? phase,
    start,
    end,
    date: formatFriendly(now, cfg.timezone),
    time: formatHM(nowP.h * 60 + nowP.min),
    hour: String(nowP.h).padStart(2, "0"),
    minute: String(nowP.min).padStart(2, "0"),
  };
}

// ---------------------------------------------------------------- push

/** Resolve the pushNotifier service provided by chicheng-push (scope-independent). */
function resolvePushNotifier(ctx) {
  try {
    if (ctx?.pushNotifier) return ctx.pushNotifier;
  } catch {
    // fall through
  }
  try {
    const found = ctx?.get?.("pushNotifier");
    if (found) return found;
  } catch {
    // ignore
  }
  return null;
}

/** Resolve the messaging-core gateway service (scope-independent). */
function resolveMessaging(ctx) {
  try {
    if (ctx?.messaging) return ctx.messaging;
  } catch {
    // fall through
  }
  try {
    const found = ctx?.get?.("messaging");
    if (found) return found;
  } catch {
    // ignore
  }
  return null;
}

/** Send a rendered reminder through the configured channel. */
async function sendReminderMessage(ctx, cfg, phase, values, channel) {
  const title = renderTemplate(cfg.reminders[phase]?.title ?? "", values) || `${PHASE_TEXTS[phase]?.zh ?? phase}提醒`;
  const content = renderTemplate(cfg.reminders[phase]?.content ?? "", values);
  return await dispatchPush(ctx, title, content, channel);
}

/** Dispatch one push: messaging target | pushNotifier service | /push/api/send. */
async function dispatchPush(ctx, title, content, channel) {
  const raw = String(channel ?? "all").trim();
  if (raw.startsWith("messaging:")) {
    const rest = raw.slice("messaging:".length);
    const sep = rest.indexOf(":");
    if (sep <= 0) return { ok: false, error: `无效的消息平台目标 "${raw}"` };
    const platform = rest.slice(0, sep);
    const chatId = rest.slice(sep + 1);
    const messaging = resolveMessaging(ctx);
    if (!messaging || typeof messaging.send !== "function") {
      return { ok: false, error: "messaging-core 服务不可用（未安装或未挂载）" };
    }
    try {
      await messaging.send(platform, chatId, `${title}\n\n${content}`);
      return { ok: true, sent: 1, total: 1, source: "messaging", platform, chatId };
    } catch (error) {
      return { ok: false, sent: 0, total: 1, source: "messaging", error: error instanceof Error ? error.message : String(error) };
    }
  }
  const channels = raw !== "" && raw !== "all" ? [raw] : "all";
  const notifier = resolvePushNotifier(ctx);
  if (notifier && typeof notifier.send === "function") {
    try {
      const result = await notifier.send({ title, content, channels });
      return result ?? { ok: false, error: "push 服务无返回" };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : String(error) };
    }
  }
  // HTTP fallback (chicheng-push exposes /push/api/send)
  try {
    const port = ctx?.webServer?.port ?? 3080;
    const response = await fetch(`http://127.0.0.1:${port}/push/api/send`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title, content, channels }),
    });
    const parsed = await response.json().catch(() => null);
    return parsed ?? { ok: false, error: `HTTP ${response.status}` };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

/** List push channels: in-process service first, /push/api/list HTTP fallback. */
async function listPushChannels(ctx) {
  try {
    const notifier = resolvePushNotifier(ctx);
    if (notifier && typeof notifier.list === "function") {
      const channels = await notifier.list();
      if (Array.isArray(channels)) return channels;
    }
  } catch (error) {
    console.warn("[chicheng-peak] push channels (service) failed:", error instanceof Error ? error.message : String(error));
  }
  try {
    const port = ctx?.webServer?.port ?? 3080;
    const response = await fetch(`http://127.0.0.1:${port}/push/api/list`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
    });
    const parsed = await response.json().catch(() => null);
    if (parsed?.ok === true && Array.isArray(parsed.value?.channels)) return parsed.value.channels;
  } catch (error) {
    console.warn("[chicheng-peak] push channels (http) failed:", error instanceof Error ? error.message : String(error));
  }
  return [];
}

/** Enumerate messaging-core push targets via /messaging/status (+ service fallback). */
async function listMessagingTargets(ctx) {
  try {
    const port = ctx?.webServer?.port ?? 3080;
    const response = await fetch(`http://127.0.0.1:${port}/messaging/status`, {
      headers: { accept: "application/json" },
    });
    const parsed = await response.json().catch(() => null);
    if (parsed && Array.isArray(parsed.platforms)) {
      const connected = new Set(parsed.platforms.filter((p) => p.connected).map((p) => p.id));
      const targets = [];
      for (const chat of Array.isArray(parsed.chats) ? parsed.chats : []) {
        if (!chat || !chat.platform || !chat.chatId) continue;
        targets.push({
          id: `messaging:${chat.platform}:${chat.chatId}`,
          name: `${chat.platform}${chat.userName ? ` · ${chat.userName}` : ` · ${chat.chatId}`}`,
          type: "messaging",
          enabled: connected.has(chat.platform),
          source: "messaging",
        });
      }
      return { available: targets.length > 0 || connected.size > 0, targets, connectedPlatforms: [...connected] };
    }
  } catch (error) {
    console.warn("[chicheng-peak] messaging targets failed:", error instanceof Error ? error.message : String(error));
  }
  try {
    const messaging = resolveMessaging(ctx);
    if (messaging && typeof messaging.status === "function") {
      const platforms = messaging.status();
      if (Array.isArray(platforms)) {
        const connected = platforms.filter((p) => p.connected).map((p) => p.id);
        if (connected.length > 0) return { available: true, targets: [], connectedPlatforms: connected };
      }
    }
  } catch (error) {
    console.warn("[chicheng-peak] messaging status (service) failed:", error instanceof Error ? error.message : String(error));
  }
  return { available: false, targets: [], connectedPlatforms: [] };
}

// ---------------------------------------------------------------- reminders

function parseTimesList(text) {
  const out = [];
  for (const token of String(text ?? "").split(/[,，;；\s]+/)) {
    if (token === "") continue;
    const min = parseHM(token);
    if (min === null) continue;
    out.push(min);
  }
  return out;
}

/** Fire due reminders for one phase; records results in config for the UI. */
async function fireReminder(ctx, phase) {
  const r = config.reminders[phase];
  if (!r || r.enabled !== true) return null;
  const now = Date.now();
  const tz = config.timezone;

  // 1) transition reminders: phase start − leadMinutes (fires once per
  //    occurrence; catch-up window of 10 minutes covers restarts)
  const starts = phaseStarts(new Date(now - 10 * 60000), phase, config);
  for (const s of starts) {
    const lead = Number(r.leadMinutes) || 0;
    const reminderAt = s.at.getTime() - lead * 60000;
    if (reminderAt > now) continue; // not due yet
    if (now - reminderAt > 10 * 60000) continue; // stale
    if (lead > 0 && now > s.at.getTime() + 10 * 60000) continue; // transition long past
    const key = `${phase}:transition:${s.at.toISOString()}`;
    if (firedKeys.has(key)) continue;
    firedKeys.add(key);
    const values = buildValues(config, phase, s.at);
    const result = await sendReminderMessage(ctx, config, phase, values, r.channel);
    r.lastFiredAt = new Date().toISOString();
    r.lastResult = result;
    scheduleSave();
    console.info(`[chicheng-peak] reminder fired (${key}) ok=${result?.ok === true}`);
  }

  // 2) extra daily fixed times (only while the phase is active)
  const times = parseTimesList(r.times);
  if (times.length > 0) {
    const p = zonedParts(new Date(now), tz);
    const currentMin = p.h * 60 + p.min;
    const currentPhase = phaseAt(new Date(now), config);
    if (currentPhase === phase) {
      // fire when the current minute matches a configured time (or we are
      // within its 60s window and it has not fired for today)
      const todayKey = `${p.y}-${String(p.m).padStart(2, "0")}-${String(p.d).padStart(2, "0")}`;
      for (const min of times) {
        if (currentMin !== min) continue;
        const key = `${phase}:daily:${todayKey}:${min}`;
        if (firedKeys.has(key)) continue;
        firedKeys.add(key);
        const at = new Date(zonedEpoch(p.y, p.m, p.d, min, tz, new Date()));
        const values = buildValues(config, phase, at);
        const result = await sendReminderMessage(ctx, config, phase, values, r.channel);
        r.lastFiredAt = new Date().toISOString();
        r.lastResult = result;
        scheduleSave();
        console.info(`[chicheng-peak] daily reminder fired (${key}) ok=${result?.ok === true}`);
      }
    }
  }
}

async function onTick() {
  if (tearDown) return;
  try {
    if (!config.enabled) return;
    await fireReminder(currentCtx, PHASES.PEAK);
    await fireReminder(currentCtx, PHASES.VALLEY);
  } catch (error) {
    console.warn("[chicheng-peak] tick failed:", error instanceof Error ? error.message : String(error));
  }
}

// ---------------------------------------------------------------- validation

function clampInt(value, min, max, fallback) {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function clampNum(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function sanitizeWindow(w) {
  const s = parseHM(w?.start);
  const e = parseHM(w?.end);
  if (s === null || e === null || e <= s) return null;
  return { start: formatHM(s), end: formatHM(e) };
}

/** Validate + clamp a client-submitted config snapshot; returns { ok, config?, error? }. */
function sanitizeConfig(input) {
  if (!input || typeof input !== "object") return { ok: false, error: "配置格式无效" };
  const out = structuredClone(DEFAULT_CONFIG);
  out.enabled = input.enabled !== false;
  const tz = typeof input.timezone === "string" ? input.timezone : "Asia/Shanghai";
  try {
    new Intl.DateTimeFormat("en-CA", { timeZone: tz });
    out.timezone = tz;
  } catch {
    out.timezone = "Asia/Shanghai";
  }
  const windows = Array.isArray(input.windows)
    ? input.windows.map(sanitizeWindow).filter(Boolean)
    : [];
  if (windows.length === 0) return { ok: false, error: "至少需要一个有效的高峰时段（开始时间必须早于结束时间）" };
  out.windows = windows;
  out.override = ["auto", "peak", "valley"].includes(input.override) ? input.override : "auto";
  out.pollSeconds = clampInt(input.pollSeconds, 5, 120, 15);

  const edge = input.edge ?? {};
  out.edge.enabled = edge.enabled !== false;
  out.edge.peakColor = /^#[0-9a-fA-F]{6}$/.test(String(edge.peakColor ?? "")) ? edge.peakColor : DEFAULT_CONFIG.edge.peakColor;
  out.edge.valleyColor = /^#[0-9a-fA-F]{6}$/.test(String(edge.valleyColor ?? "")) ? edge.valleyColor : DEFAULT_CONFIG.edge.valleyColor;
  out.edge.width = clampInt(edge.width, 1, 14, DEFAULT_CONFIG.edge.width);
  out.edge.animation = ["breathing", "solid", "off"].includes(edge.animation) ? edge.animation : DEFAULT_CONFIG.edge.animation;
  out.edge.breathingSpeed = clampNum(edge.breathingSpeed, 0.5, 10, DEFAULT_CONFIG.edge.breathingSpeed);
  out.edge.glow = clampInt(edge.glow, 0, 80, DEFAULT_CONFIG.edge.glow);
  out.edge.opacity = clampNum(edge.opacity, 0.2, 1, DEFAULT_CONFIG.edge.opacity);
  out.edge.flow = edge.flow === true;
  out.edge.flowSpeed = clampNum(edge.flowSpeed, 2, 24, DEFAULT_CONFIG.edge.flowSpeed);
  out.edge.badge = edge.badge === true;

  const ln = input.localNotify ?? {};
  out.localNotify.enabled = ln.enabled === true;
  out.localNotify.onTransition = ln.onTransition !== false;
  out.localNotify.onReminder = ln.onReminder === true;

  for (const phase of [PHASES.PEAK, PHASES.VALLEY]) {
    const r = input.reminders?.[phase] ?? {};
    const base = DEFAULT_CONFIG.reminders[phase];
    out.reminders[phase].enabled = r.enabled === true;
    out.reminders[phase].leadMinutes = clampInt(r.leadMinutes, 0, 1440, 0);
    out.reminders[phase].channel = String(r.channel ?? "all").trim() || "all";
    out.reminders[phase].times = String(r.times ?? "");
    out.reminders[phase].title = String(r.title ?? base.title);
    out.reminders[phase].content = String(r.content ?? base.content);
  }
  return { ok: true, config: out };
}

// ---------------------------------------------------------------- API wire

const MAX_BODY_BYTES = 1 << 20;

class PeakValleyError extends Error {
  constructor(code, message, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

async function readJsonBody(req) {
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    const buffer = Buffer.from(chunk);
    total += buffer.length;
    if (total > MAX_BODY_BYTES) throw new PeakValleyError("bad-request", "request body too large", 413);
    chunks.push(buffer);
  }
  const text = Buffer.concat(chunks).toString("utf8");
  if (text.trim() === "") return {};
  try {
    return JSON.parse(text);
  } catch {
    throw new PeakValleyError("bad-request", "request body is not valid JSON");
  }
}

function writeJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-cache" });
  res.end(payload);
}

function writeOk(res, value) {
  writeJson(res, 200, { ok: true, value });
}

function writeError(res, error) {
  if (error instanceof PeakValleyError) {
    writeJson(res, error.status, { ok: false, error: { code: error.code, message: error.message } });
    return;
  }
  const message = error instanceof Error ? error.message : String(error);
  writeJson(res, 500, { ok: false, error: { code: "internal", message } });
}

function header(headers, key) {
  const value = headers[key];
  return typeof value === "string" ? value : undefined;
}

function parseAuthority(authority) {
  try {
    return new URL(`http://${authority}`);
  } catch {
    return undefined;
  }
}

function isLoopbackHostname(hostname) {
  if (hostname === "localhost" || hostname === "[::1]") return true;
  const parts = hostname.split(".");
  return parts.length === 4 && parts[0] === "127" && parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
}

function isTrustedApiRequest(request, trustedHosts) {
  const host = header(request.headers, "host");
  if (host === undefined) return false;
  const hostUrl = parseAuthority(host);
  if (hostUrl === undefined) return false;
  const hosts = Array.isArray(trustedHosts) ? trustedHosts : [];
  const trusted = hosts.some((entry) => {
    const entryUrl = parseAuthority(entry);
    if (entryUrl === undefined) return false;
    return entryUrl.hostname === hostUrl.hostname && (entryUrl.port === "" || entryUrl.port === hostUrl.port);
  });
  if (!isLoopbackHostname(hostUrl.hostname) && !trusted) return false;
  if (header(request.headers, "sec-fetch-site") === "cross-site") return false;
  const origin = header(request.headers, "origin");
  if (origin === undefined) return true;
  try {
    return new URL(origin).host === hostUrl.host;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------- API handlers

function buildApi(ctx) {
  return {
    /** Current phase + schedule status, for the client overlay/settings page. */
    status: async () => {
      const now = new Date();
      const next = nextTransition(now, config);
      const phase = phaseAt(now, config);
      return {
        now: now.toISOString(),
        enabled: config.enabled,
        timezone: config.timezone,
        windows: config.windows.map((w) => ({ ...w })),
        phase,
        phaseText: PHASE_TEXTS[phase],
        override: config.override,
        nextTransitionAt: next ? next.at.toISOString() : null,
        nextPhase: next ? next.phase : null,
        pollSeconds: config.pollSeconds,
        edge: { ...config.edge },
        localNotify: { ...config.localNotify },
        reminders: {
          peak: { ...config.reminders.peak },
          valley: { ...config.reminders.valley },
        },
      };
    },

    /** Full public config snapshot (no secrets). */
    config: async () => {
      return {
        version: config.version,
        enabled: config.enabled,
        timezone: config.timezone,
        windows: config.windows.map((w) => ({ ...w })),
        override: config.override,
        pollSeconds: config.pollSeconds,
        edge: { ...config.edge },
        localNotify: { ...config.localNotify },
        reminders: {
          peak: { ...config.reminders.peak },
          valley: { ...config.reminders.valley },
        },
        defaults: structuredClone(DEFAULT_CONFIG),
      };
    },

    /** Persist a sanitized config snapshot. */
    save: async (payload) => {
      const result = sanitizeConfig(payload?.config ?? payload);
      if (!result.ok) throw new PeakValleyError("bad-request", result.error);
      if (!result.config.enabled) {
        // master switch off: keep settings, just stop effects/reminders
      }
      config = result.config;
      scheduleSave();
      return { saved: true, config: { ...config }, defaults: structuredClone(DEFAULT_CONFIG) };
    },

    /** Restore defaults for a section (or everything when section is omitted). */
    reset: async (payload) => {
      const section = String(payload?.section ?? "").trim();
      if (section === "" || section === "all") {
        config = structuredClone(DEFAULT_CONFIG);
      } else if (section === "edge") {
        config.edge = structuredClone(DEFAULT_CONFIG.edge);
      } else if (section === "localNotify") {
        config.localNotify = structuredClone(DEFAULT_CONFIG.localNotify);
      } else if (section === "reminders") {
        config.reminders = structuredClone(DEFAULT_CONFIG.reminders);
      } else if (section === "windows") {
        config.windows = structuredClone(OFFICIAL_WINDOWS);
      } else {
        throw new PeakValleyError("bad-request", `未知的配置分区 "${section}"`);
      }
      scheduleSave();
      return { saved: true, config: { ...config } };
    },

    /** Push channels + messaging targets for the reminder channel picker. */
    pushChannels: async () => {
      const [pushList, messaging] = await Promise.all([listPushChannels(ctx), listMessagingTargets(ctx)]);
      const pushAvailable = pushList.length > 0;
      const channels = [
        ...pushList.map((channel) => ({
          id: channel?.id,
          name: channel?.name,
          type: channel?.type,
          enabled: channel?.enabled !== false,
          source: "push",
        })),
        ...messaging.targets,
      ];
      return {
        available: pushAvailable || messaging.available,
        pushAvailable,
        messagingAvailable: messaging.available,
        messagingPlatforms: messaging.connectedPlatforms,
        channels,
      };
    },

    /** Send a test reminder (renders template for peak/valley, or custom text). */
    test: async (payload) => {
      const kind = String(payload?.kind ?? "peak");
      const channel = String(payload?.channel ?? "all").trim() || "all";
      if (!["peak", "valley", "custom"].includes(kind)) throw new PeakValleyError("bad-request", `未知的测试类型 "${kind}"`);
      const transitionAt = new Date();
      const phase = kind === "custom" ? PHASES.PEAK : kind;
      const values = buildValues(config, phase, transitionAt);
      if (kind === "custom") {
        values.phase = "自定义测试";
        const title = String(payload?.title ?? "峰谷提醒测试").trim() || "峰谷提醒测试";
        const content = String(payload?.content ?? "这是一条来自峰谷提醒插件的测试消息。").trim();
        const result = await dispatchPush(ctx, title, content, channel);
        return { result, title, content };
      }
      const title = renderTemplate(String(payload?.title ?? config.reminders[phase]?.title ?? ""), values) || `${PHASE_TEXTS[phase]?.zh ?? phase}提醒`;
      const content = renderTemplate(String(payload?.content ?? config.reminders[phase]?.content ?? ""), values);
      const result = await dispatchPush(ctx, title, content, channel);
      return { result, title, content, values };
    },

    /** Manual "fire now" for a phase reminder (useful while tuning templates). */
    fireNow: async (payload) => {
      const phase = String(payload?.phase ?? "peak");
      if (![PHASES.PEAK, PHASES.VALLEY].includes(phase)) throw new PeakValleyError("bad-request", `未知的阶段 "${phase}"`);
      if (config.reminders[phase]?.enabled !== true) {
        return { skipped: true, reason: "该阶段提醒未启用" };
      }
      const transitionAt = new Date();
      const values = buildValues(config, phase, transitionAt);
      const result = await sendReminderMessage(ctx, config, phase, values, config.reminders[phase].channel);
      const r = config.reminders[phase];
      r.lastFiredAt = new Date().toISOString();
      r.lastResult = result;
      scheduleSave();
      return { result, values };
    },
  };
}

// ---------------------------------------------------------------- plugin body

async function apply(ctx, configArg) {
  await loadStore();
  currentCtx = ctx;
  const fence = (req) => {
    try {
      return isTrustedApiRequest(req, ctx.webRuntime?.trustedHosts ?? []);
    } catch {
      return false;
    }
  };
  const api = buildApi(ctx);

  ctx.effect(() => ctx.webServer.register({
    kind: "prefix",
    path: "/peakvalley/api",
    handler: async (req, res) => {
      if (!fence(req)) {
        writeJson(res, 403, { ok: false, error: { code: "forbidden", message: "forbidden" } });
        return;
      }
      if (req.method !== "POST") {
        writeJson(res, 405, { ok: false, error: { code: "method-error", message: "method not allowed" } });
        return;
      }
      const pathname = new URL(req.url ?? "/", "http://peakvalley.invalid").pathname;
      const segments = pathname.split("/").filter(Boolean);
      const method = segments[0] === "peakvalley" && segments[1] === "api" && segments.length === 3 ? segments[2] : undefined;
      if (method === undefined || method.includes("/") || method === "") {
        writeError(res, new PeakValleyError("not-found", "unknown peakvalley API method", 404));
        return;
      }
      try {
        const payload = await readJsonBody(req);
        const handler = api[method];
        if (typeof handler !== "function") throw new PeakValleyError("not-found", `unknown peakvalley API method "${method}"`, 404);
        writeOk(res, await handler(payload));
      } catch (error) {
        writeError(res, error);
      }
    },
  }), "chicheng-peak: /peakvalley/api routes");

  // 30s tick: fire due reminders (independent of any open browser page)
  tickTimer = setInterval(() => {
    void onTick();
  }, 30000);
  tickTimer.unref?.();

  ctx.effect(() => () => {
    tearDown = true;
    currentCtx = null;
    if (tickTimer !== null) clearInterval(tickTimer);
    tickTimer = null;
    if (storeDirtyTimer !== null) {
      clearTimeout(storeDirtyTimer);
      storeDirtyTimer = null;
    }
    void flushConfig();
    void flushFired();
  }, "chicheng-peak: teardown");

  ctx.logger?.info?.("[chicheng-peak] started, data root: " + DATA_ROOT);
}

export { apply, inject, name, _internals };

/** Testability surface for the scheduler primitives (stable within this version). */
const _internals = {
  DEFAULT_CONFIG,
  OFFICIAL_WINDOWS,
  PHASES,
  PHASE_TEXTS,
  parseHM,
  formatHM,
  isPeakAt,
  phaseAt,
  nextTransition,
  phaseStarts,
  renderTemplate,
  buildValues,
  sanitizeConfig,
  parseTimesList,
  isTrustedApiRequest,
};