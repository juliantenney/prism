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

const lo = {
  learning_outcomes: [{ id: "LO1", cognitive_level: "understand", statement: "Explain inflation." }]
};
const plans = templates.deriveEpisodePlansFromLearningOutcomes(lo);
const seeded = api.buildSeededStepPromptForWorkflowStep({
  workflowName: "Inflation",
  step: {
    id: "dla_step",
    title: "Design Learning Activities",
    canonical_step_id: "step_design_learning_activities",
    outputName: "learning_activities"
  },
  matchedPattern: { promptFactory: factory }
});

const wf = {
  id: "wf-pf11-sanitized",
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
      override_prompt_body: seeded,
      prompt_source_type: "local_override"
    }
  ]
};
api.setWorkflowsForTest([wf]);
api.setSelectedWorkflowIdForTest("wf-pf11-sanitized");
api.setWorkflowRunCapturedOutputsForTest({
  lo_step: JSON.stringify(lo, null, 2),
  ep_step: JSON.stringify(plans, null, 2)
});

const instr = api.buildWorkflowStepInstructions(wf.steps[2], 2, null);
const resolved = api.resolveEpisodePlansForDlaPopulation({ workflow: wf, diagnostic: true });
const aug = api.applyEpisodePlanDlaPopulationPromptBlockToDraft(
  seeded,
  {
    stepCanonicalStepId: "step_design_learning_activities",
    stepCanonicalTitle: "Design Learning Activities"
  },
  wf
);

console.log(
  JSON.stringify(
    {
      resolverReason: resolved.reason,
      resolverOk: !!resolved.episodePlans,
      packHasHashUpstream: /### Upstream episode_plans/i.test(seeded),
      augHasAuthoritative: /### Upstream episode_plans \(authoritative/i.test(aug),
      augHasPf11Missing: /PF-11: missing episode_plans upstream/.test(aug),
      copyHasBindingEmbed: /Upstream artefact "episode_plans"/.test(instr),
      copyHasAuthoritative: /### Upstream episode_plans \(authoritative/i.test(instr),
      copyHasPf11Missing: /PF-11: missing episode_plans upstream/.test(instr),
      copyHasEpisodePlansJson: /"episode_plans"\s*:\s*\[/i.test(instr)
    },
    null,
    2
  )
);
