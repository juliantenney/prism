/**
 * Sprint 38-S — Production pipeline chase (deterministic Episode Plan V1 + fidelity replay).
 * Validates frozen V1 taxonomy on derive, then replays EV-38S-AFTER artefacts through page fidelity.
 */
import fs from "fs";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..", "..", "..", "..");
const require = createRequire(import.meta.url);
const sprint38lDir = path.resolve(
  __dirname,
  "../../2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts"
);

const RUN_PREFIX = process.env.PRISM_RUN_PREFIX || "EV-38S-AFTER-4";
const outDir = sprint38lDir;

const templates = require(path.join(repoRoot, "lib", "episode-plan-v1-templates.js"));
const validation = require(path.join(repoRoot, "lib", "episode-plan-v1-validation.js"));
const integration = require(path.join(repoRoot, "lib", "episode-plan-dla-integration.js"));

function loadJson(name) {
  const p = path.join(outDir, `${RUN_PREFIX}-${name}`);
  if (!fs.existsSync(p)) throw new Error(`Missing artefact: ${p}`);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

const report = {
  runPrefix: RUN_PREFIX,
  steps: [],
  proofOk: false,
  roleOk: false,
  fullOk: false
};

function step(name, ok, detail) {
  report.steps.push({ name, ok, detail });
  console.log(ok ? "PASS" : "FAIL", name, detail || "");
}

// 1 — Episode Plan V1 from frozen LO (same path as production derive)
const loPath = path.join(outDir, `${RUN_PREFIX.replace(/-4$/, "")}-frozen-learning-outcomes.json`);
let lo;
if (fs.existsSync(loPath)) {
  lo = JSON.parse(fs.readFileSync(loPath, "utf8"));
} else {
  lo = loadJson("episode-plans.json");
  lo = { learning_outcomes: [] };
}
if (fs.existsSync(path.join(outDir, `${RUN_PREFIX}-episode-plans.json`))) {
  const savedPlans = loadJson("episode-plans.json");
  const v1 = validation.validateEpisodePlansContainerV1(savedPlans);
  step("Episode Plan artefact V1 taxonomy", v1.ok, v1.errors?.join("; "));
  report.episodePlanArchetypes = (savedPlans.episode_plans || []).map(
    (r) => r.episode_plan?.archetype
  );
} else {
  const frozenLoFile = path.join(
    sprint38lDir,
    "EV-38S-AFTER-frozen-learning-outcomes.json"
  );
  if (fs.existsSync(frozenLoFile)) {
    lo = JSON.parse(fs.readFileSync(frozenLoFile, "utf8"));
  }
  const derived = templates.deriveEpisodePlansFromLearningOutcomes(lo, {
    activity_ids: ["A1", "A2", "A3", "A4"]
  });
  const v1 = validation.validateEpisodePlansContainerV1(derived);
  step("deriveEpisodePlansFromLearningOutcomes V1", v1.ok, v1.errors?.join("; "));
  report.episodePlanArchetypes = derived.episode_plans.map((r) => r.episode_plan.archetype);
}

// 2 — DLA population contract on saved artefact
try {
  const dla = loadJson("dla-learning-activities.json");
  const plans = loadJson("episode-plans.json");
  const pop = integration.validateLearningActivitiesPopulationContract(dla, plans);
  step("DLA population contract", pop.ok, pop.errors?.join("; "));
} catch (e) {
  step("DLA population contract", false, String(e.message));
}

// 3 — GAM pack text (not JSON stub)
try {
  const gamTxt = fs.readFileSync(path.join(outDir, `${RUN_PREFIX}-gam.txt`), "utf8");
  const hasStub = /^\s*\{\s*"materials"/m.test(gamTxt);
  step("GAM pack text bodies", !hasStub && gamTxt.length > 500, `len=${gamTxt.length}`);
} catch (e) {
  step("GAM pack text bodies", false, String(e.message));
}

// 4 — Fidelity replay
const replay = spawnSync(
  process.execPath,
  [path.join(__dirname, "ev-38s-proof-replay.mjs")],
  {
    cwd: repoRoot,
    env: { ...process.env, PRISM_RUN_PREFIX: RUN_PREFIX.replace(/-4$/, "-4") },
    encoding: "utf8"
  }
);
if (replay.stdout) console.log(replay.stdout);
if (replay.stderr) console.error(replay.stderr);
step("EV-38S proof replay", replay.status === 0, `exit=${replay.status}`);

try {
  const log = JSON.parse(
    fs.readFileSync(path.join(__dirname, `${RUN_PREFIX}-run-log.json`), "utf8")
  );
  report.proofOk = !!log.proofOk;
  report.roleOk = !!log.roleOk;
  report.fullOk = !!log.fullOk;
} catch (_) {
  const altLog = path.join(sprint38lDir, `${RUN_PREFIX}-run-log.json`);
  if (fs.existsSync(altLog)) {
    const log = JSON.parse(fs.readFileSync(altLog, "utf8"));
    report.proofOk = !!log.proofOk;
    report.roleOk = !!log.roleOk;
    report.fullOk = !!log.fullOk;
  }
}

const outReport = path.join(__dirname, "EV-38S-PRODUCTION-CHASE-report.json");
fs.writeFileSync(outReport, JSON.stringify(report, null, 2), "utf8");
console.log("\nReport:", outReport);
console.log(JSON.stringify(report, null, 2));

const allOk = report.steps.every((s) => s.ok) && report.fullOk;
process.exit(allOk ? 0 : 1);
