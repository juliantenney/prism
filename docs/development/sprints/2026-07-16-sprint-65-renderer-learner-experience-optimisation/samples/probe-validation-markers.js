const fs = require("fs");
const path = require("path");
const dir =
  "docs/development/sprints/2026-07-16-sprint-65-renderer-learner-experience-optimisation/samples/validation/";

const ids = [
  "rna-hcv",
  "rna-assessment",
  "kitchen-sink",
  "marx-beat",
  "marx-self-study",
  "inflation",
  "climate",
  "self-directed",
  "shape-metadata",
  "confidence-multitable",
  "sequencing-rollout",
  "shape-assessment-mcq"
];

function sliceAround(html, needle, before, after) {
  const i = html.search(needle);
  if (i < 0) return null;
  return html.slice(Math.max(0, i - before), Math.min(html.length, i + after));
}

for (const id of ids) {
  const c = fs.readFileSync(path.join(dir, id + "-current.html"), "utf8");
  const p = fs.readFileSync(path.join(dir, id + "-s65-prototype.html"), "utf8");
  console.log("\n===", id, "===");
  console.log({
    equal: c === p,
    charDelta: p.length - c.length,
    badgeP: (p.match(/<span class="s65-mode-badge"/g) || []).length,
    yourTaskP: (p.match(/>Your task</gi) || []).length,
    produceP: (p.match(/>Produce</gi) || []).length,
    successC: (c.match(/>Success looks like</gi) || []).length,
    residualP: (p.match(/data-s65-residual/g) || []).length,
    tryItP: (p.match(/>Try it</gi) || []).length,
    alsoP: (p.match(/Also available/gi) || []).length,
    contractP: (p.match(/s65-activity-contract/g) || []).length
  });
}

// RNA A3 residual order check
const rnaP = fs.readFileSync(path.join(dir, "rna-hcv-s65-prototype.html"), "utf8");
const rnaC = fs.readFileSync(path.join(dir, "rna-hcv-current.html"), "utf8");
const a3p = rnaP.search(/Plan an Outbreak/i);
const a3c = rnaC.search(/Plan an Outbreak/i);
const a3Proto = rnaP.slice(a3p, a3p + 8000);
const a3Curr = rnaC.slice(a3c, a3c + 8000);
const planP = a3Proto.search(/Planning Table/i);
const checkP = a3Proto.search(/Check your work|Checklist/i);
const planC = a3Curr.search(/Planning Table/i);
const checkC = a3Curr.search(/Check your work|Checklist/i);
console.log("\nRNA A3 order", {
  protoPlanningBeforeCheck: planP > -1 && checkP > -1 && planP < checkP,
  currPlanningBeforeCheck: planC > -1 && checkC > -1 && planC < checkC,
  planP,
  checkP,
  planC,
  checkC
});

// A4 orphan text visibility
const a4p = rnaP.search(/Analyse Immune Evasion/i);
const a4slice = rnaP.slice(a4p, a4p + 9000);
console.log("\nRNA A4 orphan text visible", /S62-RNA-A4-M1-BODY|delay innate immune/i.test(a4slice));

// A6 transfer
const a6p = rnaP.search(/Evaluate Outbreak Priorities/i);
const a6slice = rnaP.slice(a6p, a6p + 12000);
console.log("\nRNA A6", {
  evaluateBadge: /s65-mode-badge">Evaluate/i.test(a6slice),
  extend: /Extend your thinking|Transfer Prompt/i.test(a6slice),
  produce: />Produce</i.test(a6slice)
});

// Kitchen-sink KS-A4
const ksP = fs.readFileSync(path.join(dir, "kitchen-sink-s65-prototype.html"), "utf8");
const ksMin = ksP.search(/Minimal activity row/i);
console.log("\nKS-A4 slice markers", {
  found: ksMin > -1,
  yourTask: />Your task</i.test(ksP.slice(ksMin, ksMin + 2000)),
  whatToDo: />What to do</i.test(ksP.slice(ksMin, ksMin + 2000)),
  unknownReading: /Reading Text|experimental_unknown|Also available/i.test(ksP)
});
