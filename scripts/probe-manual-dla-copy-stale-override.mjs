import fs from "fs";
import path from "path";
import vm from "vm";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templates = require(path.join(repoRoot, "lib/episode-plan-v1-templates.js"));
const integration = require(path.join(repoRoot, "lib/episode-plan-dla-integration.js"));
const validation = require(path.join(repoRoot, "lib/episode-plan-v1-validation.js"));
const strictJson = require(path.join(repoRoot, "lib/workflow-artefact-json-strict.js"));

const md = fs.readFileSync(
  path.join(repoRoot, "domains/learning-design/domain-learning-design-step-patterns.md"),
  "utf8"
);
const idx = md.indexOf("## 5. Design Learning Activities");
const rest = md.slice(idx);
const jstart = rest.indexOf("```json", rest.indexOf("### Prompt Factory"));
const jend = rest.indexOf("```", jstart + 7);
const factory = JSON.parse(rest.slice(jstart + 7, jend).trim());

const staleOverride = [
  "Context:",
  "You are provided with learning_outcomes (and optionally knowledge_model or learning_content).",
  "",
  "Task:",
  "Design executable learning_activities that are directly runnable in teaching delivery.",
  "",
  "Instructional function planning (IFP — internal reasoning only):",
  "- IFP-00 SEQUENCE: collect mapped_learning_outcomes; replan IFP-00 A–K before JSON",
  "- IFP-01 ARCHETYPE SELECTION (38I-3 LO-ARC): primary_archetype = max cognitive demand",
  "- DLA-WB-25 (38J-3 session arc): document activity_index fade in delivery_notes — ARC-01..06"
].join("\n");

const source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
const sandbox = {
  console,
  setTimeout,
  clearTimeout,
  Promise,
  module: { exports: {} },
  exports: {}
};
const documentStub = { readyState: "loading", addEventListener: () => {} };
const windowStub = { document: documentStub };
sandbox.document = documentStub;
sandbox.window = windowStub;
sandbox.globalThis = windowStub;
windowStub.window = windowStub;
windowStub.PRISM_EPISODE_PLAN_V1_TEMPLATES = templates;
windowStub.PRISM_EPISODE_PLAN_DLA_INTEGRATION = integration;
windowStub.PRISM_EPISODE_PLAN_V1_VALIDATION = validation;
windowStub.PRISM_WORKFLOW_ARTEFACT_JSON_STRICT = strictJson;
vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: "app.js" });
const api = sandbox.window.__PRISM_TEST_API;

api.setWorkflowStepPatternCatalogForTest([
  {
    title: "Design Learning Activities",
    canonicalStepId: "step_design_learning_activities",
    promptFactory: factory
  }
]);

const lo = {
  learning_outcomes: [{ id: "LO1", cognitive_level: "understand", statement: "Explain inflation." }]
};
const plans = templates.deriveEpisodePlansFromLearningOutcomes(lo);
const wf = {
  id: "wf-probe-stale",
  name: "Inflation",
  steps: [
    { id: "lo_step", title: "Define Learning Outcomes", outputName: "learning_outcomes" },
    {
      id: "ep_step",
      title: "Design Episode Plan",
      outputName: "episode_plans",
      canonical_step_id: "step_design_episode_plan"
    },
    {
      id: "dla_step",
      title: "Design Learning Activities",
      outputName: "learning_activities",
      canonical_step_id: "step_design_learning_activities",
      override_prompt_body: staleOverride,
      prompt_source_type: "local_override"
    }
  ]
};
api.setWorkflowsForTest([wf]);
api.setSelectedWorkflowIdForTest("wf-probe-stale");
api.setWorkflowRunCapturedOutputsForTest({
  lo_step: JSON.stringify(lo, null, 2),
  ep_step: JSON.stringify(plans, null, 2)
});

const instr = api.buildWorkflowStepInstructions(wf.steps[2], 2, null);
const resolved = api.resolveStepPromptText(wf.steps[2], wf);

console.log(
  JSON.stringify(
    {
      packTemplateChars: factory.promptTemplate.length,
      staleOverrideChars: staleOverride.length,
      resolvedCorePromptChars: resolved.text.length,
      manualCopyChars: instr.length,
      staleDetected: api.isStaleCatalogSeededStepOverride(staleOverride, factory.promptTemplate),
      hasObligationPopulation38S: /OBLIGATION POPULATION \(38S/i.test(instr),
      hasIfp00: /IFP-00 SEQUENCE/i.test(instr),
      hasIfp01: /IFP-01 ARCHETYPE SELECTION/i.test(instr),
      hasDlaWb25: /DLA-WB-25/i.test(instr),
      hasAuthoritativeUpstream: /### Upstream episode_plans \(authoritative/i.test(instr),
      hasPf11Missing: /PF-11: missing episode_plans upstream/i.test(instr)
    },
    null,
    2
  )
);
