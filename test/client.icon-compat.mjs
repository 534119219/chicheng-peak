/**
 * chicheng-peak — cross-version primitives contract check.
 *
 * The settings panel went blank under dsh 0.2 because client.js bound a
 * primitives export that 0.2 had renamed (IconRefreshOutline16). The factory
 * destructures freely, so a missing name yields `undefined` and React throws
 * "Element type is invalid" the moment the component renders — the section
 * disappears with no obvious console output.
 *
 * This test reads the REAL export list out of the installed primitives package
 * and fails if client.js references any name that is not actually exported.
 *
 * Skips (exit 0) when the package cannot be located, so it stays portable.
 */
import { readFile } from "node:fs/promises";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

let failures = 0;
function assert(name, cond, extra) {
  if (cond) console.log("  ok  " + name);
  else { failures += 1; console.log("FAIL  " + name + (extra ? " :: " + extra : "")); }
}

/** Locate the installed @deepseek-ai/dsh-client-ui-primitives package. */
function findPrimitives() {
  const candidates = [
    process.env.DSH_PRIMITIVES_DIR,
    join(process.env.APPDATA ?? "", "npm", "node_modules"),
    "D:/ProgramFiles/Node/node_modules",
  ].filter(Boolean);

  const roots = [];
  for (const base of candidates) {
    const deep = join(base, "@deepseek-ai", "dsh", "node_modules", "@deepseek-ai");
    if (existsSync(deep)) roots.push(deep);
    const direct = join(base, "@deepseek-ai");
    if (existsSync(direct)) roots.push(direct);
  }
  // profile node_modules (npm/pnpm layouts)
  const home = process.env.USERPROFILE ?? process.env.HOME ?? "";
  if (home) {
    const prof = join(home, ".dsh", "profiles");
    if (existsSync(prof)) {
      for (const p of readdirSync(prof)) {
        for (const nm of ["node_modules"]) {
          const b = join(prof, p, nm, "@deepseek-ai");
          if (existsSync(b)) roots.push(b);
          const b2 = join(prof, p, nm, "@deepseek-ai", "dsh", "node_modules", "@deepseek-ai");
          if (existsSync(b2)) roots.push(b2);
        }
      }
    }
  }

  for (const root of roots) {
    const lib = join(root, "dsh-client-ui-primitives", "lib", "index.js");
    if (existsSync(lib)) return lib;
  }
  return null;
}

/** Parse the exported names from the primitives bundle's final export block. */
function exportedNames(source) {
  const names = new Set();
  for (const m of source.matchAll(/export\s*\{([^}]*)\}/g)) {
    for (const part of m[1].split(",")) {
      const n = part.split(/\s+as\s+/).pop().trim();
      if (n) names.add(n);
    }
  }
  return names;
}

const libPath = findPrimitives();
if (libPath === null) {
  console.log("  skip primitives package not found (set DSH_PRIMITIVES_DIR to enable)");
  console.log("\nALL PASS (skipped)");
  process.exit(0);
}
console.log("  using " + libPath);

const primitivesSource = await readFile(libPath, "utf8");
const exported = exportedNames(primitivesSource);
assert("parsed a non-empty export list", exported.size > 50, exported.size + " names");

const clientSource = await readFile(new URL("../lib/client.js", import.meta.url), "utf8");

// Every name the plugin pulls off the primitives namespace, excluding the
// dynamic lookup table used by pickPrimitive (those are probed, not required).
const direct = new Set();
for (const m of clientSource.matchAll(/primitives\.([A-Za-z0-9_$]+)/g)) direct.add(m[1]);
for (const m of clientSource.matchAll(/primitives\[\s*"([A-Za-z0-9_$]+)"\s*\]/g)) direct.add(m[1]);

console.log("  referenced: " + [...direct].sort().join(", "));

// Names probed through pickPrimitive are allowed to be absent by design; they
// are resolved at runtime and only the first hit is used.
const probed = new Set();
for (const m of clientSource.matchAll(/pickPrimitive\(\[([^\]]*)\]/g)) {
  for (const q of m[1].matchAll(/"([A-Za-z0-9_$]+)"/g)) probed.add(q[1]);
}

const required = [...direct].filter((n) => !probed.has(n));
const missing = required.filter((n) => !exported.has(n));
assert("every directly-required primitives export exists", missing.length === 0, missing.join(", "));

// The panel-blanking regression: at least one refresh icon must resolve.
const refreshCandidates = [...probed].filter((n) => n.startsWith("IconRefresh"));
const resolvable = refreshCandidates.filter((n) => exported.has(n));
assert(
  "a refresh icon is resolvable in this dsh version",
  resolvable.length > 0,
  "probed: " + refreshCandidates.join(", "),
);

console.log("  refresh icon candidates present: " + (resolvable.join(", ") || "none"));
console.log("  legacy IconRefreshOutline16 exported: " + exported.has("IconRefreshOutline16"));

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
