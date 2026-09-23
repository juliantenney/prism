const fs = require("fs");
const path = require("path");
const planner = require("../lib/prism-visual-jobs-planner.js");
const compiler = require("../lib/prism-image-brief-compiler.js");
const workspace = require("../lib/utilities-visual-jobs-workspace.js");

const va = JSON.parse(
  fs.readFileSync(
    path.resolve(".tmp-f4-probe/va-s5-base-rate-comparison-01.json"),
    "utf8"
  )
);

const page = {
  artifact_type: "page",
  schema_version: "2.0.0",
  title: "Bayes Theorem",
  visual_affordance_schema_version: "38.4",
  sections: [
    {
      section_id: "S5",
      title: "Why context changes what the same evidence means",
      exposition:
        "When prevalence is 1% the posterior after a positive result is about 15.4%. When prevalence is 20% the posterior is about 81.8%. The test stays at 90% sensitivity and 5% false-positive rate.",
      knowledge_focus: "base-rate comparison",
      synthesis: "same evidence, different prior",
      representation_needs: "matched comparison"
    }
  ],
  visual_affordances: [va]
};

const planned = planner.planVisualJobsFromPage
  ? planner.planVisualJobsFromPage(page)
  : planner.planPrismVisualJobs(page);

console.log("planner keys", Object.keys(planned || {}));
console.log(
  "ok",
  planned && planned.ok,
  "jobs",
  planned && planned.jobs && planned.jobs.length,
  "errors",
  planned && planned.errors
);

const job =
  (planned && planned.jobs && planned.jobs[0]) ||
  (planned && planned.visual_jobs && planned.visual_jobs[0]);
if (!job) {
  console.log("no job", JSON.stringify(planned, null, 2).slice(0, 2000));
  process.exit(1);
}

console.log("job.must_show", job.must_show);
console.log("job.requires_exact_data_match", job.requires_exact_data_match);
console.log("job.material_role", job.material_role);

const compiled = compiler.compilePrismImageBriefs(planned);
console.log("compile ok", compiled.ok, "briefs", (compiled.briefs || []).length);
const brief = compiled.briefs && compiled.briefs[0];
if (!brief) {
  console.log(JSON.stringify(compiled, null, 2).slice(0, 3000));
  process.exit(1);
}

const gen = String(brief.generation_instruction || "");
const human = workspace.buildVisualJobHumanPrompt(brief);

fs.writeFileSync(
  path.resolve(".tmp-f4-probe/compiled-gen.txt"),
  gen
);
fs.writeFileSync(
  path.resolve(".tmp-f4-probe/compiled-human.txt"),
  human
);

const checks = [
  "1%",
  "15.4%",
  "20%",
  "81.8%",
  "90%",
  "5%",
  "prevalence is the quantity that changes",
  "exact data match",
];
console.log("\n=== generation_instruction ===");
for (const c of checks) {
  console.log(c, gen.includes(c));
}
console.log("\n=== human_prompt ===");
for (const c of checks) {
  console.log(c, human.includes(c));
}
console.log("\n--- gen Show/Required excerpt ---");
const reqIdx = gen.indexOf("6. Required content");
console.log(gen.slice(reqIdx, reqIdx + 800));
console.log("\n--- human Show excerpt ---");
const showIdx = human.search(/Show:/i);
console.log(human.slice(showIdx, showIdx + 800));
