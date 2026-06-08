import fs from "fs";

const md = fs.readFileSync("domains/learning-design/domain-learning-design-step-patterns.md", "utf8");
const idx = md.indexOf("## 6. Design Learning Activities");
const rest = md.slice(idx);
const jstart = rest.indexOf("```json");
const jend = rest.indexOf("```", jstart + 7);
const j = JSON.parse(rest.slice(jstart + 7, jend));
const t = j.promptTemplate;
const i = t.indexOf("Instructional function planning");
console.log(t.slice(i, i + 12000));
console.log("\n---TOTAL IFP to DLA-WB---");
const wb = t.indexOf("Self-study workbook contract");
console.log("IFP len:", wb - i, "total template:", t.length);
