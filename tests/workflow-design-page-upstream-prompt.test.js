/**
 * Design Page copied prompt must instruct Copilot to consume upstream artefacts
 * from prior step outputs in conversation — not PRISM capture re-injection.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise, module: { exports: {} }, exports: {} };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  sandbox.globalThis = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  vm.runInContext(
    fs.readFileSync(path.join(repoRoot, "lib", "ld-materials-copy.js"), "utf8"),
    sandbox,
    { filename: "ld-materials-copy.js" }
  );
  vm.runInContext(
    fs.readFileSync(path.join(repoRoot, "lib", "ld-table-fidelity.js"), "utf8"),
    sandbox,
    { filename: "ld-table-fidelity.js" }
  );
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return { api };
}

const { api } = loadPrismTestApi();

const wf = {
  id: "wf-dp-upstream",
  pageEnrichmentV2: true,
  partialPageOutputs: true,
  steps: [
    {
      id: "gam_step",
      title: "Generate Activity Materials",
      outputName: "activity_materials",
      canonical_step_id: "step_generate_activity_materials"
    },
    {
      id: "page_step",
      title: "Design Page",
      outputName: "page",
      canonical_step_id: "step_design_page",
      override_prompt_body: "Assemble the learner page from upstream artefacts.",
      prompt_source_type: "local_override",
      inputBindings: [
        {
          kind: "internal",
          sourceStepId: "gam_step",
          artifactName: "activity_materials"
        }
      ]
    }
  ]
};

test("buildWorkflowStepInstructions: partial Design Page uses conversation context, not PRISM captures", () => {
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest("wf-dp-upstream");
  api.setWorkflowRunCapturedOutputsForTest({});
  api.setWorkflowRunCapturedOutputsRawForTest({});

  const instr = api.buildWorkflowStepInstructions(wf.steps[1], 1, null);
  assert.match(instr, /partial page artefact/i);
  assert.match(instr, /Use Copilot conversation context/i);
  assert.match(instr, /PRISM does not embed stored prior step outputs/i);
  assert.match(instr, /Generate Activity Materials/i);
  assert.match(instr, /Upstream binding bodies are intentionally omitted/i);
  assert.match(instr, /page_synthesis/i);
  assert.doesNotMatch(instr, /workflow capture; use this text verbatim/i);
  assert.doesNotMatch(instr, /CAPTURE MISSING:/i);
});

test("LD-DESIGN-PAGE-PARTIAL-CONTRACT: forbids chat-based materials resolution", () => {
  const partial = require("../lib/ld-design-page-partial-contract.js");
  const text = partial.buildDesignPagePartialContractBlock();
  assert.match(text, /Use Copilot conversation context for upstream instructional content/i);
  assert.match(text, /resolving activity_materials from chat/i);
  assert.match(text, /activities\[\] regeneration/i);
});

test("LD-DESIGN-PAGE-PARTIAL-CONTRACT: context access via conversation", () => {
  const partial = require("../lib/ld-design-page-partial-contract.js");
  const text = partial.buildDesignPagePartialContractBlock();
  assert.match(text, /PRISM does not embed stored prior step outputs in partial mode/i);
  assert.match(text, /activities\[\] regeneration/i);
});

test("LD-DESIGN-PAGE-PARTIAL-CONTRACT: Interactive knowledge_summary is a conceptual briefing", () => {
  const partial = require("../lib/ld-design-page-partial-contract.js");
  const text = partial.buildDesignPagePartialContractBlock();
  const shape = partial.buildCanonicalDesignPagePartialShapeSnippet();
  assert.match(text, /page_synthesis\.knowledge_summary is mandatory/i);
  assert.match(text, /opening conceptual briefing/i);
  assert.match(text, /not a recap of completed activity answers/i);
  assert.match(text, /Conceptual synthesis is required/i);
  assert.match(text, /Conditional attempt-before-complete-explanation/i);
  assert.match(text, /not a universal ban on direct instruction/i);
  assert.match(text, /Do not reveal completed results, model answers, or interpretations/i);
  assert.match(text, /activity-specific calculated statistics/i);
  assert.match(text, /signed differences/i);
  assert.match(text, /completed graphical interpretations/i);
  assert.match(text, /different evidence may be appropriate/i);
  assert.match(text, /Do not prohibit numerical examples categorically/i);
  assert.match(text, /generic topic list or learning-outcome restatement/i);
  assert.match(shape, /Substantive conceptual briefing/i);
  assert.doesNotMatch(shape, /Substantive concept synthesis — not a glossary dump/i);
  assert.match(text, /visual_affordances\[\]/);
  assert.match(text, /hide_answers/);
});
