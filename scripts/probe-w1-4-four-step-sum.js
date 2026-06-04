"use strict";
const { execSync } = require("node:child_process");
const out = execSync("node scripts/probe-38b1-ld-workflow-prompt-audit.js", {
  cwd: require("node:path").join(__dirname, ".."),
  encoding: "utf8"
});
const data = JSON.parse(out);
const keys = ["dla", "gam", "assessment_items", "design_page"];
let sum = 0;
const rows = {};
for (const row of data.results) {
  const sd = row.self_directed;
  if (keys.includes(sd.key)) {
    rows[sd.key] = {
      augmentedChars: sd.augmentedChars,
      blockCount: sd.blockCount,
      blockTitles: sd.blockTitles
    };
    sum += sd.augmentedChars;
  }
}
console.log(JSON.stringify({ rows, fourStepSum: sum, target129865: sum <= 129865 }, null, 2));
