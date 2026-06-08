/**
 * Sprint 38-S — Proof evaluation on captured artefacts (38S-4).
 * Run after ev-38l-inflation-pipeline-capture-once.mjs with PRISM_RUN_PREFIX=EV-38S-AFTER
 */
import fs from "fs";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..", "..", "..", "..");
const require = createRequire(import.meta.url);
const sprint38lDir = path.resolve(
  __dirname,
  "../../2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts"
);
const sprint38mDir = path.resolve(
  __dirname,
  "../../2026-06-05-sprint-38m-page-composition-fidelity/artefacts"
);

const RUN_PREFIX = process.env.PRISM_RUN_PREFIX || "EV-38S-AFTER";
const outDir = process.env.PRISM_PROOF_OUT_DIR || __dirname;

const contract = require(path.join(repoRoot, "lib", "episode-plan-population-contract.js"));
const integration = require(path.join(repoRoot, "lib", "episode-plan-dla-integration.js"));
const proofMetrics = require(path.join(repoRoot, "lib", "episode-plan-proof-metrics.js"));

function loadJson(p) {
  if (!fs.existsSync(p)) throw new Error("Missing: " + p);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

const dlaPath = path.join(sprint38lDir, `${RUN_PREFIX}-dla-learning-activities.json`);
const plansPath = path.join(sprint38lDir, `${RUN_PREFIX}-episode-plans.json`);

const learningActivities = loadJson(dlaPath);
const episodePlans = fs.existsSync(plansPath)
  ? loadJson(plansPath)
  : integration.deriveEpisodePlansFromLearningOutcomes(
      loadJson(path.join(sprint38lDir, "ev-38l-frozen-learning-outcomes.json")),
      { activity_ids: ["A1", "A2", "A3", "A4"] }
    );

const T3_MICRO_PLAN = {
  archetype: "understand",
  beats: [
    { function: "framing" },
    { function: "prediction" },
    { function: "observation" },
    { function: "revision" },
    { function: "reflection" }
  ]
};

const t3Scaffold = contract.applyPopulationScaffoldToActivity(
  { activity_id: "T3-MICRO" },
  T3_MICRO_PLAN
);

const evaluation = proofMetrics.evaluateProofSuite(learningActivities, episodePlans, {
  t3Micro: { plan: T3_MICRO_PLAN, activity: t3Scaffold }
});

let ev38mDla = null;
try {
  ev38mDla = loadJson(path.join(sprint38mDir, "EV-38M-AFTER-dla-learning-activities.json"));
} catch (_) {}

const comparative = {
  ev38m: {},
  ev38s: {}
};
["A1", "A2", "A3", "A4"].forEach(function (id) {
  const act38s = (learningActivities.activities || []).find((a) => a.activity_id === id);
  const act38m = ev38mDla
    ? (ev38mDla.activities || []).find((a) => a.activity_id === id)
    : null;
  comparative.ev38s[id] = {
    material_count: act38s ? (act38s.required_materials || []).length : 0,
    tagged: act38s
      ? (act38s.required_materials || []).filter((m) => m.instructional_function).length
      : 0,
    episode_plan_ref: !!(act38s && act38s.episode_plan_ref)
  };
  comparative.ev38m[id] = {
    material_count: act38m ? (act38m.required_materials || []).length : 0,
    tagged: act38m
      ? (act38m.required_materials || []).filter((m) => m.instructional_function).length
      : 0
  };
});

const report = {
  capturedAt: new Date().toISOString(),
  sprint: "38-S",
  runId: RUN_PREFIX,
  phase: "38S-4",
  sources: {
    dla: dlaPath,
    episode_plans: plansPath,
    ev38m_baseline: path.join(sprint38mDir, "EV-38M-AFTER-dla-learning-activities.json")
  },
  evaluation,
  comparative,
  t3Micro: {
    plan: T3_MICRO_PLAN,
    scaffold_obl_m: t3Scaffold.required_materials.length,
    transition: evaluation.transitionFamilies.T3
  }
};

fs.writeFileSync(path.join(outDir, `${RUN_PREFIX}-proof-metrics.json`), JSON.stringify(report, null, 2), "utf8");
console.log(JSON.stringify(report, null, 2));

const gateFail =
  !evaluation.M01.pass ||
  !evaluation.M02_all_pass ||
  !evaluation.M03_all_pass ||
  !evaluation.M05_pass ||
  !evaluation.M07_pass ||
  !evaluation.transitionFamilies.T1.pass ||
  !evaluation.transitionFamilies.T2.pass;

process.exit(gateFail ? 1 : 0);
