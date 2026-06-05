const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..", "..", "..", "..", "..");
const ldPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);

const md = fs.readFileSync(ldPath, "utf8");
const m = md.match(
  /## 5\. Design Learning Activities[\s\S]*?### Prompt Factory\s*```json\s*([\s\S]*?)\s*```/
);
const factory = JSON.parse(m[1].trim());
let t = factory.promptTemplate;

const bundleLine =
  "- Apply LO cognitive-demand component bundles in activity design: Understand => orientation + concept elucidation + check; Apply => worked example + guided practice + verification; Analyse => comparison/classification + reasoning scaffold + verification + transition; Evaluate => trade-offs + judgement + justification + reflection + transition\n";
if (t.includes(bundleLine)) {
  t = t.replace(bundleLine, "");
  console.log("Removed old bundle line");
}

t = t.replace(/\r\n/g, "\n");

const gamRef =
  "include in material specification: GAM scaffold-not-answer per GAM-WB-06b when learner-production required";
const gamFix =
  "material specifications must require scaffold-not-answer bodies when learner-production is required (38H-2 discipline — GAM realises in §6)";
if (t.includes(gamRef)) {
  t = t.replace(gamRef, gamFix);
  console.log("Fixed GAM-WB reference in IFP-06");
}

factory.promptTemplate = t;
const newJson = JSON.stringify(factory, null, 2);
const newMd = md.replace(m[1], "\n" + newJson + "\n");
fs.writeFileSync(ldPath, newMd, "utf8");
console.log("Saved §5");
