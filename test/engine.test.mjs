/**
 * chicheng-peak-valley — schedule engine smoke test
 * Runs the pure primitives from lib/index.js against the official 2026-08-17
 * schedule (peak 09:00-12:00 / 14:00-18:00, Asia/Shanghai).
 */
import { _internals as I } from "../lib/index.js";

let failures = 0;
function assert(name, cond) {
  if (cond) {
    console.log("  ok  " + name);
  } else {
    failures += 1;
    console.log("FAIL  " + name);
  }
}

const cfg = {
  override: "auto",
  timezone: "Asia/Shanghai",
  windows: I.OFFICIAL_WINDOWS.map((w) => ({ ...w })),
};

// parseHM / formatHM
assert("parseHM 09:00", I.parseHM("09:00") === 540);
assert("parseHM invalid 25:00", I.parseHM("25:00") === null);
assert("formatHM roundtrip", I.formatHM(540) === "09:00" && I.formatHM(0) === "00:00" && I.formatHM(1380) === "23:00");

// phase at fixed instants (UTC+8, no DST)
const at = (iso) => new Date(iso);
assert("04:00 is valley", I.phaseAt(at("2026-08-17T04:00:00+08:00"), cfg) === "valley");
assert("09:00 is peak (inclusive start)", I.phaseAt(at("2026-08-17T09:00:00+08:00"), cfg) === "peak");
assert("11:59 is peak", I.phaseAt(at("2026-08-17T11:59:00+08:00"), cfg) === "peak");
assert("12:00 is valley (exclusive end)", I.phaseAt(at("2026-08-17T12:00:00+08:00"), cfg) === "valley");
assert("13:59 is valley", I.phaseAt(at("2026-08-17T13:59:00+08:00"), cfg) === "valley");
assert("14:00 is peak", I.phaseAt(at("2026-08-17T14:00:00+08:00"), cfg) === "peak");
assert("17:59 is peak", I.phaseAt(at("2026-08-17T17:59:00+08:00"), cfg) === "peak");
assert("18:00 is valley", I.phaseAt(at("2026-08-17T18:00:00+08:00"), cfg) === "valley");
assert("23:00 is valley", I.phaseAt(at("2026-08-17T23:00:00+08:00"), cfg) === "valley");

// isPeakAt
assert("isPeakAt 540 in window", I.isPeakAt(540, I.OFFICIAL_WINDOWS) === true);
assert("isPeakAt 400 not in window", I.isPeakAt(400, I.OFFICIAL_WINDOWS) === false);

// nextTransition
{
  const n1 = I.nextTransition(at("2026-08-17T04:00:00+08:00"), cfg);
  assert("next from 04:00 → 09:00 peak", n1 && n1.at.toISOString() === "2026-08-17T01:00:00.000Z" && n1.phase === "peak", JSON.stringify(n1));
  const n2 = I.nextTransition(at("2026-08-17T10:00:00+08:00"), cfg);
  assert("next from 10:00 → 12:00 valley", n2 && n2.at.toISOString() === "2026-08-17T04:00:00.000Z" && n2.phase === "valley", JSON.stringify(n2));
  const n3 = I.nextTransition(at("2026-08-17T13:00:00+08:00"), cfg);
  assert("next from 13:00 → 14:00 peak", n3 && n3.at.toISOString() === "2026-08-17T06:00:00.000Z" && n3.phase === "peak", JSON.stringify(n3));
  const n4 = I.nextTransition(at("2026-08-17T19:00:00+08:00"), cfg);
  assert("next from 19:00 → next-day 09:00 peak", n4 && n4.at.toISOString() === "2026-08-18T01:00:00.000Z", JSON.stringify(n4));
  // forced override → no transitions
  const forced = { ...cfg, override: "peak" };
  assert("forced peak → no transition", I.nextTransition(at("2026-08-17T10:00:00+08:00"), forced) === null);
}

// phaseStarts (3-day lookahead → 2 occurrences per day)
{
  const starts = I.phaseStarts(at("2026-08-17T04:00:00+08:00"), "peak", cfg);
  assert("peak starts from 04:00 → 6 over 3 days, first two 09:00/14:00", starts.length === 6 && starts[0].at.toISOString() === "2026-08-17T01:00:00.000Z" && starts[1].at.toISOString() === "2026-08-17T06:00:00.000Z", JSON.stringify(starts.map((s) => s.at.toISOString())));
  const vStarts = I.phaseStarts(at("2026-08-17T10:00:00+08:00"), "valley", cfg);
  assert("valley starts from 10:00 → first 12:00, then 18:00", vStarts.length === 6 && vStarts[0].at.toISOString() === "2026-08-17T04:00:00.000Z" && vStarts[1].at.toISOString() === "2026-08-17T10:00:00.000Z", JSON.stringify(vStarts.map((s) => s.at.toISOString())));
}

// renderTemplate
{
  const values = { phase: "高峰期", start: "09:00", end: "12:00", time: "08:50" };
  assert("renderTemplate", I.renderTemplate("{phase}开始：{start}～{end}（{time}）", values) === "高峰期开始：09:00～12:00（08:50）");
  assert("renderTemplate unknown token kept", I.renderTemplate("{nope} {phase}", values) === "{nope} 高峰期");
}

// buildValues
{
  const v = I.buildValues(cfg, "peak", at("2026-08-17T09:00:00+08:00"));
  assert("buildValues peak start/end", v.start === "09:00" && v.end === "12:00" && v.phase === "高峰期");
  const v2 = I.buildValues(cfg, "valley", at("2026-08-17T12:00:00+08:00"));
  assert("buildValues valley end = next peak", v2.start === "12:00" && v2.end === "14:00");
}

// sanitizeConfig
{
  const bad = I.sanitizeConfig({ windows: [{ start: "14:00", end: "09:00" }] });
  assert("sanitize rejects empty/invalid windows", bad.ok === false);
  const good = I.sanitizeConfig({
    enabled: true,
    timezone: "Asia/Shanghai",
    windows: [{ start: "09:00", end: "12:00" }],
    pollSeconds: 3,
    edge: { width: 99, opacity: 5, peakColor: "#ff0000", valleyColor: "#00ff00", glow: -5, flow: true, badge: true },
    reminders: { peak: { enabled: true, leadMinutes: 30, channel: "messaging:tg:123", title: "T", content: "C" } },
  });
  assert("sanitize clamps edge values", good.ok === true && good.config.edge.width === 14 && good.config.edge.opacity === 1 && good.config.edge.glow === 0 && good.config.edge.flow === true && good.config.edge.badge === true);
  assert("sanitize clamps pollSeconds", good.config.pollSeconds === 5);
  assert("sanitize keeps reminder", good.config.reminders.peak.leadMinutes === 30 && good.config.reminders.peak.channel === "messaging:tg:123");
}

// parseTimesList
{
  const times = I.parseTimesList("08:00, 20:30；23:00");
  assert("parseTimesList", times.length === 3 && times[0] === 480 && times[1] === 1230 && times[2] === 1380);
}

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);