/**
 * chicheng-peak-valley — host half smoke test.
 * Mounts apply() with stub services, then exercises the /peakvalley/api routes
 * through a fake HTTP request/response pair.
 */
import { createServer } from "node:http";
import { apply, _internals as I } from "../lib/index.js";

let failures = 0;
function assert(name, cond, extra) {
  if (cond) console.log("  ok  " + name);
  else { failures += 1; console.log("FAIL  " + name + (extra ? " :: " + extra : "")); }
}

// ---- stub services mirroring the web profile composition
const registered = [];
const ctx = {
  webServer: {
    register(spec) {
      registered.push(spec);
      return () => {};
    },
    port: 3080,
  },
  webRuntime: { trustedHosts: [] },
  logger: { info() {}, warn() {}, error() {} },
  get() { return null; },
  effect(fn, label) {
    const dispose = fn();
    if (typeof dispose === "function") ctx._disposers.push(dispose);
  },
  _disposers: [],
};

// simulate loopback HTTP request through the registered prefix handler
async function callApi(method, payload) {
  const spec = registered.find((r) => r.path === "/peakvalley/api");
  if (!spec) throw new Error("route not registered");
  const reqUrl = `/peakvalley/api/${method}`;
  const req = new ReadableStreamRequest(reqUrl, JSON.stringify(payload ?? {}));
  const res = new FakeResponse();
  await spec.handler(req, res);
  let parsed = {};
  try { parsed = JSON.parse(res.body); } catch { parsed = {}; }
  return { status: res.status, ok: parsed.ok === true, value: parsed.value, error: parsed.error, body: parsed };
}

class ReadableStreamRequest {
  constructor(url, bodyText) {
    this.url = url;
    this.method = "POST";
    this.headers = { host: "127.0.0.1:3080", "sec-fetch-site": "same-origin" };
    this._body = bodyText;
    this._idx = 0;
  }
  async *[Symbol.asyncIterator]() {
    if (this._body) yield Buffer.from(this._body, "utf8");
  }
}

class FakeResponse {
  constructor() { this.status = 200; this.headers = {}; this.body = ""; }
  writeHead(status, headers) { this.status = status; this.headers = headers || {}; }
  end(payload) { this.body = payload; }
}

// ---- run
await apply(ctx, {});

assert("route registered", registered.some((r) => r.path === "/peakvalley/api"));

const cfgResp = await callApi("config");
assert("config default windows", cfgResp.value && cfgResp.value.windows.length === 2, cfgResp.status + " " + JSON.stringify(cfgResp.body).slice(0, 200));

const st = (await callApi("status")).value;
assert("status has phase", ["peak", "valley"].includes(st.phase));
assert("status has nextTransition", typeof st.nextTransitionAt === "string");

const saved = (await callApi("save", { config: {
  enabled: true,
  timezone: "Asia/Shanghai",
  windows: [{ start: "09:00", end: "12:00" }],
  edge: { enabled: true, peakColor: "#ff0000", valleyColor: "#00ff00", width: 5, animation: "breathing", breathingSpeed: 2, glow: 30, opacity: 0.8, flow: true, flowSpeed: 8, badge: true },
  reminders: { peak: { enabled: true, leadMinutes: 10, channel: "all", title: "T {phase}", content: "C {time}", times: "08:00" }, valley: { enabled: false, leadMinutes: 0, channel: "all", title: "", content: "", times: "" } },
} })).value;
assert("save clamps width 5", saved.config.edge.width === 5);

const bad = await callApi("save", { config: { windows: [] } });
assert("save rejects empty windows", bad.status === 400, bad.status + " " + JSON.stringify(bad.body));

const reset = (await callApi("reset", { section: "windows" })).value;
assert("reset windows → official", reset.config.windows.length === 2 && reset.config.windows[0].start === "09:00");

// cross-origin guard: host header not loopback → 403
const spec = registered.find((r) => r.path === "/peakvalley/api");
const evilReq = new ReadableStreamRequest("/peakvalley/api/status", "{}");
evilReq.headers.host = "evil.example.com";
const evilRes = new FakeResponse();
await spec.handler(evilReq, evilRes);
assert("forbidden for non-loopback host", evilRes.status === 403, evilRes.status);

// cleanup
for (const fn of ctx._disposers) { try { fn(); } catch { /* ignore */ } }

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);