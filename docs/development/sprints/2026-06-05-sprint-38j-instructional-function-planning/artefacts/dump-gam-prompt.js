const fs = require("node:fs");
const path = require("node:path");
const ldPath = path.join(
  path.resolve(__dirname, "..", "..", "..", "..", ".."),
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);
const md = fs.readFileSync(ldPath, "utf8");
const idx = md.indexOf("## 6. Generate Activity Materials");
const sub = md.slice(idx);
const pf = sub.indexOf("### Prompt Factory");
const jsonStart = sub.indexOf("```json", pf) + 7;
const jsonEnd = sub.indexOf("```", jsonStart);
const gam = JSON.parse(sub.slice(jsonStart, jsonEnd).trim());
const t = gam.promptTemplate;
const markers = [
  "Self-study workbook",
  "GAM-WB-01",
  "GAM-WB-02",
  "GAM-WB-06",
  "GAM-WB-06b",
  "GAM-WB-10",
  "GAM-WB-21",
  "Material-type guidance",
  "do not redesign",
  "Constraints:",
  "Output:",
];
for (const m of markers) {
  const i = t.indexOf(m);
  console.log(m, i >= 0 ? i : "MISSING");
}
fs.writeFileSync(
  path.join(__dirname, "gam-prompt-baseline.txt"),
  t,
  "utf8"
);
console.log("Wrote gam-prompt-baseline.txt", t.length, "chars");
console.log("NOTES:", gam.defaultPromptNotes);
