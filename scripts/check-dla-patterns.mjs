import fs from "fs";
const md = fs.readFileSync("domains/learning-design/domain-learning-design-step-patterns.md", "utf8");
const idx = md.indexOf("## 5. Design Learning Activities");
const rest = md.slice(idx);
const jstart = rest.indexOf("```json");
const jend = rest.indexOf("```", jstart + 7);
const j = JSON.parse(rest.slice(jstart + 7, jend));
const t = j.promptTemplate;
const n = j.defaultPromptNotes;
console.log({
  INF_EVAL: /INF-EVAL-01.*38L-4/i.test(t),
  KM_T05: /KM-T05.*primary Evaluate anchor household/i.test(t),
  ARC01: /ARC-01/i.test(t),
  IFP07: /IFP-07 SESSION/i.test(t),
  notesIFP04: /IFP-04/i.test(n),
  notes38S: /38S-2A/i.test(n),
  notesLOarc: /LO→archetype/i.test(n)
});
