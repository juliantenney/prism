const test = require("node:test");
const assert = require("node:assert/strict");

const rhetoric = require("../lib/ld-self-directed-rhetoric.js");

test("LD-SELF-DIRECTED-RHETORIC: module metadata", () => {
  assert.equal(rhetoric.MODULE_ID, "LD-SELF-DIRECTED-RHETORIC");
  assert.match(rhetoric.MARKER, /LD-SELF-DIRECTED-RHETORIC/);
});

test("LD-SELF-DIRECTED-RHETORIC: core block preserves behavioural anchors", () => {
  const text = rhetoric.buildLdSelfDirectedRhetoricPromptBlock();
  assert.match(text, /LD-SELF-DIRECTED-RHETORIC \(auto-applied\)/i);
  assert.match(text, /LD-MATERIALS-COPY \/ LD-TABLE-FIDELITY/i);
  assert.match(text, /PRESERVATION BOUNDARY/i);
  assert.match(text, /describing evidence of completion/i);
  assert.match(text, /Check your thinking:/i);
  assert.match(text, /step → meaning/i);
  assert.match(text, /coherent intellectual journey/i);
  assert.match(text, /OUTPUT CONTRACT on Design Learning Activities/i);
  assert.match(text, /GAM-PRES-08 transfer\/closure minima/i);
  assert.match(text, /interpretive ambiguity/i);
  assert.match(text, /do not repeat the overview tension verbatim/i);
  assert.match(text, /what should now be clearer/i);
  assert.match(text, /named move \+ changed context/i);
  assert.match(text, /mechanism evidence does not transfer to policy/i);
  assert.match(text, /Explicitly avoid: reflect on your learning/i);
  assert.doesNotMatch(text, /complete pipe table with header row/i);
});

test("49-C3b: design_page rhetoric is wrapper-only and respects preservation boundary", () => {
  const text = rhetoric.buildLdSelfDirectedRhetoricPromptBlock({ role: "design_page" });
  assert.match(text, /wrapper\/page-level prose/i);
  assert.match(text, /LD-AUTHORIAL-EXPOSITION PRESERVATION BOUNDARY/i);
  assert.match(text, /does not rewrite, restyle, assimilate, or improve preserved fields/i);
  assert.match(text, /coherent intellectual journey/i);
  assert.doesNotMatch(
    text,
    /Scope: overview, learning_purpose, study_tips, activity_preamble, learner_task, expected_output, support_note/i
  );
  assert.doesNotMatch(text, /activity_preamble orients without duplicating learner_task/i);
  assert.doesNotMatch(text, /preserve bridges, study_tips, closure\/debrief, transfer_or_application_task, support_note verbatim/i);
  assert.doesNotMatch(text, /mechanism evidence does not transfer to policy/i);
  assert.doesNotMatch(text, /do not repeat the overview tension verbatim/i);
});

test("49-C3b: DLA rhetoric retains field authoring guidance", () => {
  const text = rhetoric.buildLdSelfDirectedRhetoricPromptBlock({ role: "dla" });
  assert.match(text, /Scope \(DLA authoring\)/i);
  assert.match(text, /activity_preamble orients without duplicating learner_task/i);
  assert.match(text, /intellectual_coherence_bridge and cognition-orientation field definitions/i);
});

test("56C: lib design_page rhetoric rider retained for evaluators but not DP runtime injection", () => {
  const libText = rhetoric.buildLdSelfDirectedRhetoricPromptBlock({ role: "design_page" });
  assert.match(libText, /Design Page rider/i);
  const fs = require("node:fs");
  const path = require("node:path");
  const vm = require("node:vm");
  const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");
  const repoRoot = path.resolve(__dirname, "..");
  const sandbox = { console, setTimeout, clearTimeout, Promise };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  vm.runInContext(fs.readFileSync(path.join(repoRoot, "app.js"), "utf8"), sandbox, {
    filename: "app.js"
  });
  const api = sandbox.window.__PRISM_TEST_API;
  const runtimePrompt = api.applyWorkflowStepRuntimePromptAugmentations(
    "Assemble learner page.\n",
    {
      canonical_step_id: "step_design_page",
      canonical_title: "Design Page",
      title: "Design Page"
    },
    {
      goal: "Self-directed study page.",
      desiredOutputs: "Learner-facing page",
      workflowOutputSpec: { goal: "Self-directed study page." }
    }
  );
  assert.doesNotMatch(runtimePrompt, /LD-SELF-DIRECTED-RHETORIC \(auto-applied\)/i);
});

test("LD-SELF-DIRECTED-RHETORIC: design_page role rider", () => {
  const text = rhetoric.buildLdSelfDirectedRhetoricPromptBlock({ role: "design_page" });
  assert.match(text, /Design Page rider/i);
});

test("LD-SELF-DIRECTED-RHETORIC: rhetoricAlreadyPresent detects legacy markers", () => {
  assert.ok(
    rhetoric.rhetoricAlreadyPresent("Learner-action rhetoric (auto-applied):\n- foo")
  );
  assert.ok(rhetoric.rhetoricAlreadyPresent("LD-SELF-DIRECTED-RHETORIC (auto-applied):\n"));
  assert.ok(!rhetoric.rhetoricAlreadyPresent("Base prompt only.\n"));
});
