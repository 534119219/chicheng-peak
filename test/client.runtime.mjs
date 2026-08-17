/**
 * chicheng-peak-valley — client runtime execution test.
 * Loads the client factory, runs apply() against stub services with a minimal
 * DOM stub, then drives one status poll so applyOverlay() actually executes —
 * this catches runtime ReferenceErrors (e.g. a dangling element reference)
 * that a top-level load test cannot see.
 */
import { readFile } from "node:fs/promises";

let failures = 0;
function assert(name, cond, extra) {
  if (cond) console.log("  ok  " + name);
  else { failures += 1; console.log("FAIL  " + name + (extra ? " :: " + extra : "")); }
}

// ------------------------------------------------------------- DOM stub
const attached = []; // elements appended to document.documentElement
let elementSeq = 0;

function makeElement(tag) {
  const el = {
    __tag: tag,
    __children: [],
    style: {
      cssText: "",
      setProperty(k, v) { this[k] = v; },
    },
    setAttribute() {},
    getAttribute() { return null; },
    appendChild(child) {
      this.__children.push(child);
      if (child.id) byId.set(child.id, child);
    },
    childNodes: [],
    textContent: "",
    id: "",
  };
  return el;
}

const byId = new Map();
const documentStub = {
  visibilityState: "visible",
  createElement(tag) {
    const el = makeElement(tag);
    elementSeq += 1;
    return el;
  },
  getElementById(id) {
    return byId.get(id) || null;
  },
  addEventListener() {},
  removeEventListener() {},
  documentElement: {
    appendChild(el) {
      attached.push(el);
      if (el.id) byId.set(el.id, el);
    },
  },
  head: { appendChild(el) { if (el.id) byId.set(el.id, el); } },
};
globalThis.document = documentStub;

const windowStub = {
  __ModuleLoader__: { load(spec) { windowStub.__loaded = spec; } },
};
globalThis.window = windowStub;

// ------------------------------------------------------------- fetch stub
const statusPayload = {
  ok: true,
  value: {
    enabled: true,
    timezone: "Asia/Shanghai",
    windows: [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "18:00" }],
    phase: "peak",
    phaseText: { zh: "高峰期", en: "Peak" },
    override: "auto",
    nextTransitionAt: null,
    pollSeconds: 15,
    edge: {
      enabled: true, peakColor: "#f97316", valleyColor: "#38bdf8", width: 3,
      animation: "breathing", breathingSpeed: 2.6, glow: 22, opacity: 0.95,
      flow: true, flowSpeed: 6, badge: true,
    },
    localNotify: { enabled: false, onTransition: true, onReminder: false },
    reminders: {
      peak: { lastFiredAt: null, lastResult: null },
      valley: { lastFiredAt: null, lastResult: null },
    },
  },
};

let fetchCalls = 0;
globalThis.fetch = function () {
  fetchCalls += 1;
  return Promise.resolve({ json: () => Promise.resolve(statusPayload) });
};

// ------------------------------------------------------------- module under test
const source = await readFile(new URL("../lib/client.js", import.meta.url), "utf8");

const reactStub = {
  createElement: (...a) => ({ __stub: true, args: a }),
  useState: () => [],
  useEffect: () => {},
  useCallback: () => {},
  useMemo: () => {},
  useRef: () => ({ current: null }),
};
const primitivesStub = {
  Button: function () {}, StateDot: function () {}, IconRefreshOutline16: function () {},
};
globalThis.window.require = function (id) {
  if (id === "react") return reactStub;
  if (id === "@deepseek-ai/dsh-client-ui-primitives") return primitivesStub;
  throw new Error("unexpected require: " + id);
};

const evalFactory = new Function("window", "require", "module", "exports", source + "\n//# sourceURL=client.js");
const moduleStub = { exports: {} };
evalFactory(windowStub, windowStub.require, moduleStub, moduleStub.exports);

const exportsObj = windowStub.__loaded.factory(windowStub.require);
assert("apply exported", typeof exportsObj.apply === "function");

// ------------------------------------------------------------- stub services
const registeredSections = [];
const ctx = {
  effect(fn, label) {
    const disposer = fn();
    if (typeof disposer === "function") ctx._disposers.push(disposer);
  },
  _disposers: [],
  locale: {
    register(ns, dicts) { ctx._locales = dicts; return () => {}; },
    bind(ns) { return (key) => (ctx._locales && ctx._locales.zh && ctx._locales.zh[key]) || key; },
  },
  slots: {
    inject(name, provider) {
      if (name === "settings.section") {
        registeredSections.push(provider());
      }
    },
    register(spec, component) {
      ctx._sectionSpec = spec;
      ctx._sectionComponent = component;
      return () => {};
    },
  },
};

// ------------------------------------------------------------- run apply + poll
let applyError = null;
try {
  exportsObj.apply(ctx);
} catch (e) {
  applyError = e;
}
assert("apply() runs without throwing", applyError === null, applyError && applyError.message);

await new Promise((resolve) => setTimeout(resolve, 50));

// ------------------------------------------------------------- section label asserted after apply
assert("section label localized", ctx._sectionSpec && typeof ctx._sectionSpec.label === "function" && ctx._sectionSpec.label() === "峰谷提醒", "spec=" + (ctx._sectionSpec && ctx._sectionSpec.id));

const rootEl = attached.find((el) => el.__tag === "div" && elementHasId(el, "dsh-pv-overlay"));

function elementHasId(el, id) {
  // byId was populated on append; find by identity
  return byId.has(id) && byId.get(id) === el;
}

assert("overlay root appended to document", attached.length >= 2, "attached=" + attached.length);
assert("overlay root registered by id", byId.has("dsh-pv-overlay"));
assert("badge appended", byId.has("dsh-pv-badge"));
assert("style element registered", byId.has("dsh-pv-overlay-style"));
assert("status fetched ≥ 1 time", fetchCalls >= 1, "fetchCalls=" + fetchCalls);

const ring = byId.get("dsh-pv-ring");
assert("ring exists", !!ring);
assert("ring got border", ring && typeof ring.style.border === "string" && ring.style.border.includes("#f97316"), ring && ring.style.border);
assert("breathing animation applied", ring && typeof ring.style.animation === "string" && ring.style.animation.includes("dsh-pv-breathe"), ring && ring.style.animation);
const comet = byId.get("dsh-pv-comet-1");
assert("comet visible when flow on", comet && comet.style.visibility === "visible", comet && comet.style.visibility);

// ------------------------------------------------------------- cleanup
for (const fn of ctx._disposers) { try { fn(); } catch { /* ignore */ } }

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);