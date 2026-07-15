const test = require("node:test");
const assert = require("node:assert/strict");
const archetype = require("../lib/ld-instructional-archetype.js");

test("process token only → process block selected", () => {
  const selection = archetype.resolveS59DlaTestSelection("Enzymes — S59_PROCESS_TEST");
  assert.equal(selection.mechanism_requested, false);
  assert.equal(selection.process_requested, true);
  assert.equal(selection.selected_dla_test, "process");
  assert.equal(selection.conflict, false);

  const draft = archetype.applyDlaProcessTestEmissionBlockToDraft("DLA BASE", {
    isDesignLearningActivitiesStep: true,
    processTestOptIn: selection.selected_dla_test === "process"
  });
  assert.match(draft, /LD-INSTRUCTIONAL-ARCHETYPE-DLA-PROCESS-TEST/);
  assert.match(draft, /S59_PROCESS_TEST is active/);
  assert.doesNotMatch(draft, /LD-INSTRUCTIONAL-ARCHETYPE-DLA-MECHANISM-TEST/);
  assert.doesNotMatch(draft, /S59_MECHANISM_TEST is active/);
});

test("mechanism token only → mechanism block selected", () => {
  const selection = archetype.resolveS59DlaTestSelection(
    "Enzymes — S59_MECHANISM_TEST"
  );
  assert.equal(selection.mechanism_requested, true);
  assert.equal(selection.process_requested, false);
  assert.equal(selection.selected_dla_test, "mechanism");
  assert.equal(selection.conflict, false);

  const draft = archetype.applyDlaMechanismTestEmissionBlockToDraft("DLA BASE", {
    isDesignLearningActivitiesStep: true,
    mechanismTestOptIn: selection.selected_dla_test === "mechanism"
  });
  assert.match(draft, /LD-INSTRUCTIONAL-ARCHETYPE-DLA-MECHANISM-TEST/);
  assert.match(draft, /S59_MECHANISM_TEST is active/);
  assert.doesNotMatch(draft, /LD-INSTRUCTIONAL-ARCHETYPE-DLA-PROCESS-TEST/);
  assert.doesNotMatch(draft, /S59_PROCESS_TEST is active/);
});

test("neither token → no Sprint 59 test block", () => {
  const selection = archetype.resolveS59DlaTestSelection("Enzymes investigation");
  assert.equal(selection.selected_dla_test, "none");
  assert.equal(selection.conflict, false);

  const processDraft = archetype.applyDlaProcessTestEmissionBlockToDraft("DLA", {
    isDesignLearningActivitiesStep: true,
    processTestOptIn: false
  });
  const mechanismDraft = archetype.applyDlaMechanismTestEmissionBlockToDraft("DLA", {
    isDesignLearningActivitiesStep: true,
    mechanismTestOptIn: false
  });
  assert.equal(processDraft, "DLA");
  assert.equal(mechanismDraft, "DLA");
  assert.equal(archetype.estimateRoutingPromptGrowth({ activities: [] }).chars, 0);
});

test("both tokens → fail closed / select neither", () => {
  const selection = archetype.resolveS59DlaTestSelection(
    "S59_MECHANISM_TEST and S59_PROCESS_TEST"
  );
  assert.equal(selection.mechanism_requested, true);
  assert.equal(selection.process_requested, true);
  assert.equal(selection.conflict, true);
  assert.equal(selection.selected_dla_test, "none");

  const snapshot = archetype.buildS59DlaTestActivationSnapshot({
    goal: "S59_MECHANISM_TEST and S59_PROCESS_TEST"
  });
  assert.equal(snapshot.selected_dla_test, "none");
  assert.equal(snapshot.conflict, true);
  assert.match(snapshot.workflow_goal, /S59_PROCESS_TEST/);
  assert.equal(snapshot.loaded_archetype_script_version, archetype.SCRIPT_VERSION);
});

test("mental_model with mechanism fails closed", () => {
  const selection = archetype.resolveS59DlaTestSelection(
    "S59_MECHANISM_TEST and S59_MENTAL_MODEL_TEST"
  );
  assert.equal(selection.conflict, true);
  assert.equal(selection.selected_dla_test, "none");
  assert.equal(selection.mental_model_requested, true);
});

test("mental_model token only → mental_model block selected", () => {
  const selection = archetype.resolveS59DlaTestSelection(
    "Heating — S59_MENTAL_MODEL_TEST"
  );
  assert.equal(selection.selected_dla_test, "mental_model");
  const draft = archetype.applyDlaMentalModelTestEmissionBlockToDraft("DLA BASE", {
    isDesignLearningActivitiesStep: true,
    mentalModelTestOptIn: true
  });
  assert.match(draft, /LD-INSTRUCTIONAL-ARCHETYPE-DLA-MENTAL-MODEL-TEST/);
  assert.doesNotMatch(draft, /LD-INSTRUCTIONAL-ARCHETYPE-DLA-PROCESS-TEST/);
});

test("process block never emits mechanism fields", () => {
  const block = archetype.buildDlaProcessTestEmissionBlock();
  assert.match(block, /"instructional_archetype": "process_walkthrough"/);
  assert.doesNotMatch(block, /"instructional_archetype": "mechanism_explanation"/);
  assert.doesNotMatch(block, /required_links/);
  assert.doesNotMatch(block, /S59_MECHANISM_TEST/);
});

test("mechanism block never emits process fields", () => {
  const block = archetype.buildDlaMechanismTestEmissionBlock();
  assert.match(block, /"instructional_archetype": "mechanism_explanation"/);
  assert.doesNotMatch(block, /"instructional_archetype": "process_walkthrough"/);
  assert.doesNotMatch(block, /process_goal/);
  assert.doesNotMatch(block, /S59_PROCESS_TEST/);
});

test("activation snapshot shape is compact and stable", () => {
  const snapshot = archetype.buildS59DlaTestActivationSnapshot({
    goal: "Enzymes — S59_PROCESS_TEST"
  });
  assert.deepEqual(Object.keys(snapshot).sort(), [
    "conflict",
    "loaded_archetype_script_version",
    "mechanism_requested",
    "mental_model_requested",
    "process_requested",
    "selected_dla_test",
    "workflow_goal"
  ]);
  assert.equal(snapshot.selected_dla_test, "process");
  assert.equal(snapshot.loaded_archetype_script_version, "20260715-5");
});
