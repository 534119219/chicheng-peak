/**
 * chicheng-peak-valley — client factory top-level load test.
 * Runs the client bundle factory with stubbed window/ModuleLoader/require to
 * catch top-level reference errors (dicts, styles, component definitions).
 */
import { readFile } from "node:fs/promises";

let failures = 0;
function assert(name, cond, extra) {
  if (cond) console.log("  ok  " + name);
  else { failures += 1; console.log("FAIL  " + name + (extra ? " :: " + extra : "")); }
}

const source = await readFile(new URL("../lib/client.js", import.meta.url), "utf8");

// Stub the browser surface so the factory body can execute.
globalThis.window = {
  __ModuleLoader__: { load(spec) { window.__loaded = spec; } },
};

// Minimal React stub: hooks must exist because component bodies only execute
// when invoked (they aren't, here) — but the factory references them at
// top level via destructuring `var useState = React.useState`, which read
// properties, so provide functions.
const reactStub = {
  createElement: (...a) => ({ __stub: true, args: a }),
  useState: () => [],
  useEffect: () => {},
  useCallback: () => {},
  useMemo: () => {},
  useRef: () => ({ current: null }),
};
const primitivesStub = {
  Button: function () {},
  StateDot: function () {},
  IconRefreshOutline16: function () {},
};

window.require = function (id) {
  if (id === "react") return reactStub;
  if (id === "@deepseek-ai/dsh-client-ui-primitives") return primitivesStub;
  throw new Error("unexpected require: " + id);
};

const evalFactory = new Function("window", "require", "module", "exports", source + "\n//# sourceURL=client.js");
const moduleStub = { exports: {} };
const exportsStub = moduleStub.exports;
evalFactory(window, window.require, moduleStub, exportsStub);

const loaded = window.__loaded;
assert("factory registered via ModuleLoader", !!loaded);
assert("module id", loaded && loaded.id === "chicheng-peak-valley");
assert("name constant", loaded && loaded.factory);
assert("locale dicts present", source.includes('nav: "峰谷提醒"') && source.includes('nav: "Peak / Valley"'));
assert("settings.section slot registered", source.includes('"settings.section"'));
assert("overlay engine started in apply", source.includes("runtime.start()"));

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);