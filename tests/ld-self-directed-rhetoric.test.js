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

test("LD-SELF-DIRECTED-RHETORIC: design_page role rider includes journey assimilation", () => {
  const text = rhetoric.buildLdSelfDirectedRhetoricPromptBlock({ role: "design_page" });
  assert.match(text, /Journey assimilation/i);
  assert.match(text, /LD-JOURNEY-ASSIMILATION/i);
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
