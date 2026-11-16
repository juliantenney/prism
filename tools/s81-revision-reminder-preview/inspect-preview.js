"use strict";

/**
 * Inspect a generated S81 R4 preview HTML file for reminder PE markers.
 * Defaults to the bare preview under ./out/.
 */

const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "out");
const requested = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(outDir, "heteroscedasticity-revision-reminder-bare.html");
const file = requested;
if (!fs.existsSync(file)) {
  console.error(
    "Missing preview HTML:",
    file,
    "\nRun: node tools/s81-revision-reminder-preview/regen-bare-preview.js"
  );
  process.exit(1);
}
const h = fs.readFileSync(file, "utf8");

const checks = {
  bytes: h.length,
  cssId: h.includes('id="prism-revision-reminder-css"'),
  fixedRule: h.includes("position:fixed;top:0"),
  reminderMarkup:
    h.includes('data-revision-reminder="true"') && h.includes("Revising against"),
  peTaskInView: h.includes("var taskInView=isInView(task)"),
  peGetScrollParent: h.includes("function getScrollParent"),
  peSync: h.includes("function syncReminderFromGuidance"),
  peDump: h.includes("__PRISM_R4_DUMP__"),
  scriptCount: (h.match(/<script>/g) || []).length,
  syncFnCount: (h.match(/function syncReminderFromGuidance/g) || []).length,
  runtimeSrcCount: (h.match(/data-active-revision-criterion-id/g) || []).length
};

console.log(JSON.stringify(checks, null, 2));

const cssIdx = h.indexOf("prism-revision-reminder-css");
console.log("\nCSS snippet:\n", h.slice(cssIdx, cssIdx + 320));

const peIdx = h.indexOf("function getScrollParent");
console.log("\nPE snippet:\n", h.slice(peIdx, peIdx + 400));

const remIdx = h.indexOf('data-revision-reminder="true"');
console.log("\nReminder markup snippet:\n", h.slice(Math.max(0, remIdx - 80), remIdx + 220));
