/**
 * Sprint 101E — Expository generation_notes must remain structured objects.
 * Regression for String(object) → "[object Object]" during XD/EJP/XM normalize.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const contracts = require("../lib/expository-contracts.js");

const nestedNotes = {
  register: "expository",
  extent: "component",
  unicode_math: "∇ λ δr ≤ ≥ ∈ ℝ ≠",
  note: "Structured authoring notes — must remain a nested object."
};

test("normalizeGenerationNotes preserves nested objects", () => {
  const out = contracts.normalizeGenerationNotes(nestedNotes);
  assert.equal(typeof out, "object");
  assert.ok(out && !Array.isArray(out));
  assert.equal(out.register, "expository");
  assert.equal(out.unicode_math, nestedNotes.unicode_math);
  assert.doesNotMatch(JSON.stringify(out), /"generation_notes":\s*"\[object Object\]"/);
  assert.notEqual(out, "[object Object]");
});

test("XD normalize preserves nested generation_notes (no String coercion)", () => {
  const xd = contracts.normalizeExpositoryDevelopment({
    artifact_type: "expository_development",
    title: "From constrained movement to parallel gradients",
    sections: [
      {
        section_id: "S1",
        explanation_intent: "Open constrained movement.",
        exposition: "Learner-facing prose establishing ∇f·δr on the level set.",
        invitations_to_think: [],
        continuity_hooks: [],
        materials_commission: []
      }
    ],
    generation_notes: nestedNotes
  });
  assert.equal(typeof xd.generation_notes, "object");
  assert.deepEqual(xd.generation_notes.register, "expository");
  assert.equal(xd.generation_notes.note, nestedNotes.note);
  const json = JSON.stringify(xd, null, 2);
  assert.doesNotMatch(json, /"generation_notes":\s*"\[object Object\]"/);
  assert.match(json, /"register": "expository"/);
});

test("EJP and XM normalize preserve nested generation_notes", () => {
  const ejp = contracts.normalizeExpositoryJourneyPlan({
    artifact_type: "expository_journey_plan",
    commissioned_purpose: "Explain constrained extrema.",
    epistemic_form: "expository chapter",
    sections: [{ section_id: "S1", conceptual_move: "Introduce gradients." }],
    generation_notes: nestedNotes
  });
  assert.equal(typeof ejp.generation_notes, "object");
  assert.equal(ejp.generation_notes.register, "expository");

  const xm = contracts.normalizeExpositoryMaterials({
    artifact_type: "expository_materials",
    materials: [
      {
        material_id: "m1",
        commission_id: "c1",
        section_id: "S1",
        kind: "prose",
        body: "Material body."
      }
    ],
    generation_notes: nestedNotes
  });
  assert.equal(typeof xm.generation_notes, "object");
  assert.equal(xm.generation_notes.extent, "component");
});

test("validateExpositoryArtefactShape round-trips nested generation_notes into JSON", () => {
  const raw = {
    artifact_type: "expository_development",
    sections: [
      {
        section_id: "S1",
        explanation_intent: "Intent",
        exposition: "Enough learner-facing exposition for validation.",
        invitations_to_think: [],
        continuity_hooks: [],
        materials_commission: []
      }
    ],
    generation_notes: nestedNotes
  };
  const check = contracts.validateExpositoryArtefactShape(raw, "expository_development");
  assert.equal(check.ok, true, (check.errors || []).join("; "));
  const json = JSON.stringify(check.normalized, null, 2);
  const reparsed = JSON.parse(json);
  assert.equal(typeof reparsed.generation_notes, "object");
  assert.equal(reparsed.generation_notes.register, "expository");
  assert.notEqual(reparsed.generation_notes, "[object Object]");
});
