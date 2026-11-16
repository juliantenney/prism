/**
 * Sprint 99 M3-1 — Expository planning string-lists must not coerce objects
 * via String(object) → "[object Object]".
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const contracts = require("../lib/expository-contracts.js");

test("normalizePlanningStringListItem preserves strings and drops poisoned literals", () => {
  assert.equal(contracts.normalizePlanningStringListItem("  Keep this.  "), "Keep this.");
  assert.equal(contracts.normalizePlanningStringListItem(""), "");
  assert.equal(contracts.normalizePlanningStringListItem("   "), "");
  assert.equal(contracts.normalizePlanningStringListItem("[object Object]"), "");
  assert.equal(contracts.normalizePlanningStringListItem(null), "");
  assert.equal(contracts.normalizePlanningStringListItem(undefined), "");
  assert.equal(contracts.normalizePlanningStringListItem(12), "12");
});

test("normalizePlanningStringListItem extracts supported object shapes without concatenating", () => {
  assert.equal(
    contracts.normalizePlanningStringListItem({ prompt: "What follows from the claim?" }),
    "What follows from the claim?"
  );
  assert.equal(
    contracts.normalizePlanningStringListItem({ text: "Carry the purpose frame into S2." }),
    "Carry the purpose frame into S2."
  );
  assert.equal(
    contracts.normalizePlanningStringListItem({
      invitation: "Compare the two interpretations.",
      meta: { unused: true }
    }),
    "Compare the two interpretations."
  );
  assert.equal(
    contracts.normalizePlanningStringListItem({ hook: "S3 pressure-tests the hinge." }),
    "S3 pressure-tests the hinge."
  );
  assert.equal(
    contracts.normalizePlanningStringListItem({ to: "S2", from: "S1" }),
    "S2"
  );
  assert.equal(
    contracts.normalizePlanningStringListItem({
      text: "Preferred text",
      prompt: "Secondary prompt"
    }),
    "Preferred text"
  );
  assert.equal(
    contracts.normalizePlanningStringListItem({ invitation: { text: "Nested prompt" } }),
    "Nested prompt"
  );
});

test("normalizePlanningStringListItem drops malformed / unusable values", () => {
  assert.equal(contracts.normalizePlanningStringListItem({}), "");
  assert.equal(contracts.normalizePlanningStringListItem({ meta: true, flag: 1 }), "");
  assert.equal(contracts.normalizePlanningStringListItem({ prompt: "" }), "");
  assert.equal(contracts.normalizePlanningStringListItem({ prompt: "[object Object]" }), "");
  assert.equal(contracts.normalizePlanningStringListItem(["nested", "array"]), "");
  assert.equal(contracts.normalizePlanningStringListItem({ prompt: { deeper: { text: "too deep" } } }), "");
});

test("XD normalize preserves strings, extracts objects, drops malformed, never emits [object Object]", () => {
  const xd = contracts.normalizeExpositoryDevelopment({
    artifact_type: "expository_development",
    sections: [
      {
        section_id: "S1",
        explanation_intent: "Open the frame.",
        exposition: "Learner-facing prose for S1.",
        invitations_to_think: [
          "Plain string invitation",
          { prompt: "Object invitation" },
          { text: "Text-key invitation" },
          { garbage: true },
          "",
          null,
          "[object Object]",
          { invitation: { text: "Nested invitation" } }
        ],
        continuity_hooks: [
          "Plain hook",
          { hook: "Object hook" },
          { to: "S2" },
          {},
          ["S3"]
        ],
        materials_commission: []
      }
    ]
  });

  assert.deepEqual(xd.sections[0].invitations_to_think, [
    "Plain string invitation",
    "Object invitation",
    "Text-key invitation",
    "Nested invitation"
  ]);
  assert.deepEqual(xd.sections[0].continuity_hooks, ["Plain hook", "Object hook", "S2"]);
  const blob = JSON.stringify(xd);
  assert.equal(blob.includes("[object Object]"), false);
});

test("EJP string-lists use the same safe normalisation", () => {
  const ejp = contracts.normalizeExpositoryJourneyPlan({
    artifact_type: "expository_journey_plan",
    title: "Case",
    audience: "Learners",
    journey_intent: "Build understanding",
    commissioned_purpose: "Explain the relationship",
    epistemic_form: "Mechanism and qualification",
    sections: [
      {
        section_id: "S1",
        title: "Open",
        purpose: "Frame",
        knowledge_focus: "Core idea",
        conceptual_move: "Introduce",
        dependencies: ["S0", { section_id: "pre" }, { garbage: true }],
        lo_refs: ["LO1", { id: "LO2" }],
        elaboration_intentions: ["contrast", { kind: "example" }, {}],
        representation_needs: [{ need: "diagram" }, "table"],
        connections: ["S2", { to: "S3", note: "qualifies" }, { connection: "S4" }],
        synthesis: "Holds the frame",
        order: 1
      }
    ]
  });

  const sec = ejp.sections[0];
  assert.deepEqual(sec.dependencies, ["S0", "pre"]);
  assert.deepEqual(sec.lo_refs, ["LO1", "LO2"]);
  assert.deepEqual(sec.elaboration_intentions, ["contrast", "example"]);
  assert.deepEqual(sec.representation_needs, ["diagram", "table"]);
  assert.deepEqual(sec.connections, ["S2", "S3", "S4"]);
  assert.equal(JSON.stringify(ejp).includes("[object Object]"), false);
});

test("mixed empty arrays remain empty arrays (shape preserved)", () => {
  const xd = contracts.normalizeExpositoryDevelopment({
    artifact_type: "expository_development",
    sections: [
      {
        section_id: "S1",
        explanation_intent: "x",
        exposition: "Prose",
        invitations_to_think: [],
        continuity_hooks: [],
        materials_commission: []
      }
    ]
  });
  assert.deepEqual(xd.sections[0].invitations_to_think, []);
  assert.deepEqual(xd.sections[0].continuity_hooks, []);
  assert.ok(Array.isArray(xd.sections[0].invitations_to_think));
});
