/**
 * Sprint 105 — Expository representational necessity and workload proportionality
 * across EJP, XD, and XM sibling prompts (no arbitrary counts, word limits,
 * representation bans, or duration tiers; no Interactive semantics leakage).
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const sibling = require("../lib/expository-sibling-prompts.js");

test("EJP, XD, and XM carry the representational necessity and workload proportionality principle", () => {
  assert.match(
    sibling.REPRESENTATIONAL_NECESSITY_MARKER,
    /REPRESENTATIONAL NECESSITY AND WORKLOAD PROPORTIONALITY/i
  );

  ["expository_journey_plan", "expository_development", "expository_materials"].forEach(
    function (stage) {
      const prompt = sibling.resolveTemplate(stage);
      assert.match(prompt, /REPRESENTATIONAL NECESSITY AND WORKLOAD PROPORTIONALITY/i, stage);
      assert.match(
        prompt,
        /contribute meaningfully to the commissioned educational purpose and be proportionate to the authoritative learning duration/i,
        stage
      );
      assert.match(prompt, /Authoritative evidence and required representations/i, stage);
      assert.match(
        prompt,
        /Accessible equivalents necessary to support equivalent learner reasoning/i,
        stage
      );
      assert.match(
        prompt,
        /Additional representations that introduce unnecessary reading, interpretation or cognitive workload/i,
        stage
      );
      assert.match(
        prompt,
        /Do not invent auxiliary mathematical transformations, derived numerical series or parallel analytical representations unless they serve a clear commissioned educational purpose/i,
        stage
      );
      assert.match(
        prompt,
        /plot, authoritative paired-observation data and appropriate explanatory prose will frequently provide sufficient accessible equivalence/i,
        stage
      );
      assert.match(
        prompt,
        /Determine sufficiency in relation to the educational task rather than establishing a universally fixed representation bundle/i,
        stage
      );
      assert.match(
        prompt,
        /Preserve accessibility, disciplinary rigour, authoritative source material and meaningful conceptual explanation/i,
        stage
      );
      assert.match(
        prompt,
        /Avoid arbitrary material counts, word limits, representation bans or duration tiers/i,
        stage
      );
      assert.deepEqual(
        sibling.assertNoInteractiveSemantics(sibling.REPRESENTATIONAL_NECESSITY),
        { ok: true, hits: [] },
        "REPRESENTATIONAL_NECESSITY must not introduce Interactive semantics"
      );
      // Guard against accidental arbitrary numeric caps or duration tiers
      assert.doesNotMatch(
        prompt,
        /\b(at most \d+ materials|maximum of \d+ tables|short\/medium\/long tier|tier 1|tier 2)\b/i,
        stage + " must not introduce arbitrary caps or duration tiers"
      );
    }
  );
});

test("XD carries proportionality into commission constraints and XM prevents parallel duplicate tables", () => {
  const xd = sibling.resolveTemplate("expository_development");
  const xm = sibling.resolveTemplate("expository_materials");
  assert.match(
    xd,
    /Carry clear representational scope and proportionality constraints into materials_commission\[\]\.constraints/i
  );
  assert.match(
    xm,
    /Do not duplicate the same dataset or comparison across multiple parallel tables, summary lists or auxiliary breakdowns/i
  );
});

test("Runtime Expository augmentation preserves representational necessity on EJP, XD, and XM", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/ld-self-directed-rhetoric.js",
      "lib/ld-gam-instructional-depth.js",
      "lib/ld-materials-copy.js",
      "lib/ld-table-fidelity.js",
      "lib/ld-learner-facing-prose-typography.js",
      "lib/first-class-workflow-family.js",
      "lib/expository-sibling-prompts.js"
    ]
  });

  [
    { id: "step_expository_journey_plan", title: "Expository Journey Plan" },
    { id: "step_expository_development", title: "Expository Development" },
    { id: "step_expository_materials", title: "Expository Materials" }
  ].forEach(function (step) {
    const base = sibling.resolveTemplate({ canonical_step_id: step.id });
    const augmented = api.applyWorkflowStepRuntimePromptAugmentations(
      base,
      {
        canonical_step_id: step.id,
        canonical_title: step.title,
        title: step.title
      },
      {
        product: "expository",
        goal: "Explain correlation in economic data.",
        desiredOutputs: "Expository resource",
        selectedDomains: ["learning-design"]
      }
    );
    assert.match(
      augmented,
      /REPRESENTATIONAL NECESSITY AND WORKLOAD PROPORTIONALITY/i,
      step.id
    );
    assert.match(
      augmented,
      /Do not invent auxiliary mathematical transformations, derived numerical series or parallel analytical representations/i,
      step.id
    );
  });
});
