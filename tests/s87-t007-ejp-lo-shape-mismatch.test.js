/**
 * S87-T-007 live finding — EJP must not accept/generate LO-shaped captures.
 *
 * Live C04 failure: learning_outcomes root object was validated as EJP and
 * failed sections[] + commissioned_purpose + epistemic_form together.
 * Root cause: generation/prompt shape mismatch (not a validator weakening).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const contracts = require("../lib/expository-contracts.js");
const sibling = require("../lib/expository-sibling-prompts.js");
const strictJson = require("../lib/workflow-artefact-json-strict.js");

const appJs = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");

/** Exact live C04 failure shape (learning_outcomes root — not EJP). */
const LIVE_C04_LO_SHAPED_PAYLOAD = {
  learning_outcomes: [
    {
      statement:
        "Explain how long-term structural conditions and immediate decisions interacted to produce the escalation from the Sarajevo assassination to a general European war in 1914.",
      related_concepts: ["Multi-causal historical explanation", "July Crisis"],
      cognitive_level: "Analyse",
      notes: "Connected causal explanation."
    }
  ],
  learner_level: "Second-year undergraduate history students",
  scope:
    "A focused expository resource of approximately 20 minutes addressing the causes and escalation of the First World War.",
  alignment_notes: [
    "The outcomes move beyond factual recall towards causal analysis."
  ]
};

function validEjp() {
  return {
    artifact_type: "expository_journey_plan",
    title: "Causes and escalation of the First World War",
    audience: "Second-year undergraduate history students",
    journey_intent:
      "Construct a multi-causal explanation that preserves structure, agency, and historiographical weighting.",
    commissioned_purpose:
      "Explain how long-term conditions and July Crisis decisions interacted to escalate a local confrontation into a general European war, while discriminating causal roles and historiographical weightings.",
    epistemic_form:
      "multi-causal historical explanation with structure/agency discrimination and historiographical weighting",
    sections: [
      {
        section_id: "S1",
        title: "What kind of causal problem this is",
        purpose: "Frame the intellectual task",
        knowledge_focus: "triggers vs conditions",
        conceptual_move: "establish",
        dependencies: [],
        lo_refs: [],
        elaboration_intentions: [],
        representation_needs: [],
        connections: [],
        synthesis: "Causation is relational, not a catalogue.",
        order: 1
      },
      {
        section_id: "S2",
        title: "From Sarajevo to general war",
        purpose: "Consolidate escalation",
        knowledge_focus: "July Crisis escalation",
        conceptual_move: "consolidate",
        dependencies: ["S1"],
        lo_refs: [],
        elaboration_intentions: [],
        representation_needs: [],
        connections: ["S1"],
        synthesis: "Escalation was constrained but not automatic.",
        order: 2
      }
    ]
  };
}

test("LIVE C04: LO-shaped payload fails EJP validation with EQ1 + sections errors", () => {
  const check = contracts.validateExpositoryArtefactShape(
    LIVE_C04_LO_SHAPED_PAYLOAD,
    "expository_journey_plan"
  );
  assert.equal(check.ok, false);
  const msg = (check.errors || []).join("; ");
  assert.match(msg, /sections\[\] required/i);
  assert.match(msg, /commissioned_purpose required/i);
  assert.match(msg, /epistemic_form required/i);
  assert.match(msg, /learning_outcomes-shaped capture/i);
  // Still an EJP kind — requirements not relaxed
  assert.equal(check.kind, "expository_journey_plan");
  assert.equal(check.normalized.sections.length, 0);
  assert.equal(check.normalized.commissioned_purpose, "");
  assert.equal(check.normalized.epistemic_form, "");
});

test("EJP prompt + Copy contract require sections + EQ1 at correct nesting", () => {
  const ejp = sibling.resolveTemplate("expository_journey_plan");
  assert.match(ejp, /Required envelope/i);
  assert.match(ejp, /artifact_type: \"expository_journey_plan\"/);
  assert.match(ejp, /commissioned_purpose \(required non-empty free text — EQ1\)/);
  assert.match(ejp, /epistemic_form \(required non-empty free text — EQ1/);
  assert.match(ejp, /sections \(required non-empty array/);
  assert.match(ejp, /Do NOT return a learning_outcomes root object/i);
  assert.match(ejp, /\"commissioned_purpose\": \"\.\.\.\"/);
  assert.match(ejp, /\"epistemic_form\": \"\.\.\.\"/);
  assert.match(ejp, /\"sections\": \[/);

  const contract = strictJson.buildStrictExpositoryJourneyPlanOutputContractBlock();
  assert.match(contract, /expository_journey_plan root object/i);
  assert.match(contract, /commissioned_purpose/);
  assert.match(contract, /epistemic_form/);
  assert.match(contract, /sections \(non-empty array\)/);
  assert.match(contract, /Do NOT return a learning_outcomes root object/i);

  // Live Copy path wires EJP into applyStrictJsonArtefactContractToDraft
  assert.match(appJs, /kind === \"expository_journey_plan\"/);
  assert.match(appJs, /buildStrictExpositoryJourneyPlanOutputContractBlock/);
});

test("Correctly shaped EJP still passes; EQ1 and sections remain strict", () => {
  const ok = contracts.validateExpositoryArtefactShape(validEjp(), "expository_journey_plan");
  assert.equal(ok.ok, true, (ok.errors || []).join("; "));
  assert.ok(ok.normalized.commissioned_purpose);
  assert.ok(ok.normalized.epistemic_form);
  assert.ok(ok.normalized.sections.length >= 1);

  const noPurpose = contracts.validateExpositoryArtefactShape(
    Object.assign({}, validEjp(), { commissioned_purpose: "" }),
    "expository_journey_plan"
  );
  assert.equal(noPurpose.ok, false);
  assert.match(noPurpose.errors.join("; "), /commissioned_purpose required/i);

  const noForm = contracts.validateExpositoryArtefactShape(
    Object.assign({}, validEjp(), { epistemic_form: "   " }),
    "expository_journey_plan"
  );
  assert.equal(noForm.ok, false);
  assert.match(noForm.errors.join("; "), /epistemic_form required/i);

  const noSections = contracts.validateExpositoryArtefactShape(
    Object.assign({}, validEjp(), { sections: [] }),
    "expository_journey_plan"
  );
  assert.equal(noSections.ok, false);
  assert.match(noSections.errors.join("; "), /sections\[\] required/i);
});

test("Interactive LO strict contract remains unchanged", () => {
  const lo = strictJson.buildStrictLearningOutcomesOutputContractBlock();
  assert.match(lo, /learning_outcomes root object/);
  assert.match(lo, /JSON top-level keys: learning_outcomes/);
  assert.doesNotMatch(lo, /expository_journey_plan/);
  assert.doesNotMatch(lo, /commissioned_purpose/);
});
