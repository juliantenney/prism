/**
 * Sprint 101E — C3 markdown-only selection materials must not reach learners.
 * Fixtures mirror the failing "Evaluate what multiplier solutions establish" generation.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const gamEnrich = require("../lib/page-gam-enrich.js");
const gamContract = require("../lib/ld-gam-page-enrich-contract.js");
const practiceContracts = require("../lib/ld-practice-presentation-contracts.js");
const selectionContract = require("../lib/selection-material-contract.js");
const normalizeSelection =
  require("../lib/learner-renderer-vnext/normalize-selection.js").normalizeSelectionSemantics;
const { buildPageModel } = require("../lib/learner-renderer-vnext/build-page-model.js");
const { renderPage } = require("../lib/learner-renderer-vnext/render-page.js");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext/render-learner-page.js");
const assessmentRuntime = require("../lib/learner-renderer-vnext/assessment-runtime.js");
const draftAdapters = require("../lib/learner-renderer-vnext/learner-draft-adapters.js");

/** Exact failing C3 selection bodies (assembled JSON). */
const C3_SELECTION_FIXTURES = [
  {
    material_id: "A1-M2",
    activity_id: "A1",
    title: "Judge Claim A",
    body:
      "Does the evidence stated in Claim A justify its conclusion?\n\n" +
      "Form: single_select. Choose one response before checking.\n\n" +
      "- A. Justified by the stated evidence\n" +
      "- B. Conclusion may be correct, but the reasoning is insufficient\n" +
      "- C. Conclusion contradicted by the stated evidence\n\n" +
      "<details><summary>Check your judgement — reveal after selecting</summary>\n\n" +
      "Correct answer: A. Justified by the stated evidence.\n\n" +
      "The listed points satisfy the constraint and the multiplier equations, so they are feasible stationary candidates. Claim A does not assert that stationarity proves optimality. Its conclusion stays within what the equations establish.\n\n" +
      "</details>",
    correct: "A"
  },
  {
    material_id: "A1-M3",
    activity_id: "A1",
    title: "Judge Claim B",
    body:
      "Does the evidence stated in Claim B justify its conclusion?\n\n" +
      "Form: single_select. Choose one response before checking.\n\n" +
      "- A. Justified by the stated evidence\n" +
      "- B. Conclusion may be correct, but the reasoning is insufficient\n" +
      "- C. Conclusion contradicted by the stated evidence\n\n" +
      "<details><summary>Check your judgement — reveal after selecting</summary>\n\n" +
      "Correct answer: B. Conclusion may be correct, but the reasoning is insufficient.\n\n" +
      "The proposed maximum and minimum are indeed correctly identified for this circle problem, but the multiplier equations alone do not establish that classification.\n\n" +
      "</details>",
    correct: "B"
  },
  {
    material_id: "A1-M4",
    activity_id: "A1",
    title: "Judge Claim C",
    body:
      "Does the evidence stated in Claim C justify its conclusion?\n\n" +
      "Form: single_select. Choose one response before checking.\n\n" +
      "- A. Justified by the stated evidence\n" +
      "- B. Conclusion may be correct, but the reasoning is insufficient\n" +
      "- C. Conclusion contradicted by the stated evidence\n\n" +
      "<details><summary>Check your judgement — reveal after selecting</summary>\n\n" +
      "Correct answer: A. Justified by the stated evidence.\n\n" +
      "The bound applies to every feasible point, not only to the stationary candidates.\n\n" +
      "</details>",
    correct: "A"
  },
  {
    material_id: "A3-M2",
    activity_id: "A3",
    title: "Does the origin satisfy the multiplier condition?",
    body:
      "For \\(f(x,y)=x^3\\) subject to \\(y=0\\), does \\((0,0)\\) satisfy \\(\\nabla f=\\lambda\\nabla g\\) for some scalar \\(\\lambda\\)?\n\n" +
      "Form: single_select. Choose one response before checking.\n\n" +
      "- A. Yes\n" +
      "- B. No\n\n" +
      "<details><summary>Check your judgement — reveal after selecting</summary>\n\n" +
      "Correct answer: A. Yes.\n\n" +
      "At the origin, \\(\\nabla f(0,0)=(0,0)\\) and \\(\\nabla g(0,0)=(0,1)\\). Choosing \\(\\lambda=0\\) gives the multiplier equation.\n\n" +
      "</details>",
    correct: "A"
  },
  {
    material_id: "A3-M3",
    activity_id: "A3",
    title: "Classify the origin along the feasible line",
    body:
      "For the same constrained problem, is \\((0,0)\\) a local maximum, a local minimum or neither?\n\n" +
      "Form: single_select. Choose one response before checking.\n\n" +
      "- A. Local maximum\n" +
      "- B. Local minimum\n" +
      "- C. Neither\n\n" +
      "<details><summary>Check your judgement — reveal after selecting</summary>\n\n" +
      "Correct answer: C. Neither.\n\n" +
      "Nearby feasible points have both smaller and larger objective values.\n\n" +
      "</details>",
    correct: "C"
  }
];

function markdownOnlyMaterial(fixture) {
  return {
    material_id: fixture.material_id,
    material_type: "selection",
    activity_id: fixture.activity_id,
    title: fixture.title,
    body_format: "markdown",
    body: fixture.body
  };
}

function pageFromMaterials(materials) {
  const byActivity = {};
  materials.forEach((m) => {
    const aid = m.activity_id;
    if (!byActivity[aid]) byActivity[aid] = [];
    byActivity[aid].push(m);
  });
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Evaluate what multiplier solutions establish",
    product_id: "practice",
    page_kind: "practice",
    page_synthesis: {
      overview: { body: "Practice claim judgements.", format: "markdown" }
    },
    activities: Object.keys(byActivity).map((activityId) => ({
      activity_id: activityId,
      title: activityId === "A1" ? "Judge the multiplier claims" : "Test stationarity",
      learner_task: "Judge the claims.",
      expected_output: "Selections.",
      activity_preamble: "Use the stated evidence.",
      episode_plan: {
        archetype: "apply",
        beats: [
          { id: "orient", function: "framing" },
          { id: "model", function: "worked_thinking" },
          { id: "do", function: "guided_practice" },
          { id: "check", function: "verification" }
        ]
      },
      required_materials: byActivity[activityId].map((m) => ({
        material_id: m.material_id,
        material_type: "selection",
        purpose: "Capture judgement",
        specification: "single_select"
      })),
      materials: byActivity[activityId]
    })),
    learning_outcomes: [{ outcome_id: "LO1", statement: "Evaluate claims." }],
    episode_plans: Object.keys(byActivity).map((activityId) => ({
      activity_id: activityId,
      mapped_learning_outcome_ids: ["LO1"],
      episode_plan: {
        archetype: "apply",
        beats: [
          { id: "orient", function: "framing" },
          { id: "model", function: "worked_thinking" },
          { id: "do", function: "guided_practice" },
          { id: "check", function: "verification" }
        ]
      }
    })),
    source_artefacts: [{ artefact_type: "learning_outcomes", role: "structural" }],
    assembly_state: {
      current_stage: "gam",
      enriched_by: ["episode_plan", "dla", "gam"]
    }
  };
}

test("101E C3 fixtures: markdown-only selection yields SELECTION_PAYLOAD_MISSING", () => {
  C3_SELECTION_FIXTURES.forEach((fixture) => {
    const result = normalizeSelection(markdownOnlyMaterial(fixture), {
      materialId: fixture.material_id
    });
    assert.equal(result.ok, false, fixture.material_id);
    assert.equal(result.diagnostics[0].code, "SELECTION_PAYLOAD_MISSING");
    assert.match(result.diagnostics[0].message, /sibling selection object/i);
  });
});

test("101E C3 fixtures: GAM validation rejects markdown-only selection (GAM-SEL-01)", () => {
  const page = pageFromMaterials(C3_SELECTION_FIXTURES.map(markdownOnlyMaterial));
  const check = gamEnrich.validateGamPartialPageCapture(page, { baseline: null });
  assert.equal(check.ok, false);
  assert.ok(
    (check.errors || []).some((e) => /GAM-SEL-01|selection object/i.test(e)),
    (check.errors || []).join("\n")
  );
  assert.equal(
    (check.errors || []).filter((e) => /A1-M2|A1-M3|A1-M4|A3-M2|A3-M3/.test(e)).length,
    5
  );
});

test("101E C3 fixtures: packaging renderLearnerPageHtml fails closed", () => {
  const page = pageFromMaterials(C3_SELECTION_FIXTURES.map(markdownOnlyMaterial));
  const rendered = renderLearnerPageHtml(page, { includeRuntimeScripts: true });
  assert.equal(rendered.html, null);
  assert.match(String(rendered.error || ""), /GAM-SEL-01|selection object/i);
  assert.doesNotMatch(String(rendered.error || ""), /Selection form must be/);
});

test("101E C3 fixtures: hydrate + repair restores structured selection", () => {
  C3_SELECTION_FIXTURES.forEach((fixture) => {
    const hydrated = selectionContract.hydrateSelectionFromMarkdownBody(fixture.body);
    assert.ok(hydrated, fixture.material_id);
    assert.equal(hydrated.selection.form, "single_select");
    assert.ok(hydrated.selection.options.length >= 2);
    assert.equal(hydrated.selection.correct_answer, fixture.correct);
    assert.ok(hydrated.selection.feedback);
    assert.doesNotMatch(hydrated.body, /Form:\s*single_select/i);
  });

  const broken = pageFromMaterials(C3_SELECTION_FIXTURES.map(markdownOnlyMaterial));
  const repaired = selectionContract.repairPageSelectionMaterials(broken);
  assert.equal(repaired.ok, true, repaired.errors.join("\n"));
  assert.deepEqual(repaired.repairedIds.sort(), [
    "A1-M2",
    "A1-M3",
    "A1-M4",
    "A3-M2",
    "A3-M3"
  ]);

  const gate = selectionContract.validatePageSelectionMaterials(repaired.page);
  assert.equal(gate.ok, true, gate.errors.join("\n"));
});

test("101E C3 fixtures: repaired materials render native radios, check, and drafts", () => {
  const broken = pageFromMaterials(C3_SELECTION_FIXTURES.map(markdownOnlyMaterial));
  const repaired = selectionContract.repairPageSelectionMaterials(broken);
  assert.equal(repaired.ok, true);

  const packaged = renderLearnerPageHtml(repaired.page, { includeRuntimeScripts: true });
  assert.equal(packaged.error, null, packaged.error);
  assert.ok(packaged.html);
  assert.doesNotMatch(packaged.html, /data-selection-invalid/);
  assert.doesNotMatch(packaged.html, /Selection form must be/);
  assert.ok((packaged.html.match(/data-practice-selection="true"/g) || []).length >= 5);
  assert.ok((packaged.html.match(/type="radio"/g) || []).length >= 14);
  assert.match(packaged.html, /data-assessment-check/);
  assert.equal(typeof assessmentRuntime, "object");
  assert.equal(typeof draftAdapters.serializeWorkspaceState, "function");

  const built = buildPageModel(repaired.page);
  assert.equal(built.ok, true);
  const html = renderPage(built.model, { includeRuntimeScripts: true });
  assert.match(html, /Justified by the stated evidence/);
  assert.match(html, /Neither/);
});

test("101E contracts: GAM + Practice forbid markdown-only selection encoding", () => {
  const gam = gamContract.buildGamPageEnrichContractBlock();
  assert.match(gam, /sibling field/);
  assert.match(gam, /single_select/);
  assert.match(gam, /Do NOT encode Form:/i);
  const shape = gamContract.buildCanonicalGamMaterialShapeSnippet();
  assert.match(shape, /"material_type": "selection"/);
  assert.match(shape, /"form": "single_select"/);
  assert.match(shape, /without a sibling selection object/);

  const practiceGam = practiceContracts.buildPracticePresentationContractBlock("gam");
  assert.match(practiceGam, /FORBIDDEN for selection/);
  assert.match(practiceGam, /GAM-SEL-01/);
});

test("101E structured selection still validates at GAM", () => {
  const material = {
    material_id: "A1-M2",
    material_type: "selection",
    activity_id: "A1",
    title: "Judge Claim A",
    body_format: "markdown",
    body: "Does the evidence stated in Claim A justify its conclusion?",
    selection: {
      form: "single_select",
      prompt: "Does the evidence stated in Claim A justify its conclusion?",
      options: [
        { key: "A", text: "Justified by the stated evidence" },
        { key: "B", text: "Conclusion may be correct, but the reasoning is insufficient" },
        { key: "C", text: "Conclusion contradicted by the stated evidence" }
      ],
      correct_answer: "A",
      feedback: "Claim A stays within what the equations establish."
    }
  };
  const page = pageFromMaterials([material]);
  const check = gamEnrich.validateGamPartialPageCapture(page, { baseline: null });
  assert.equal(check.ok, true, (check.errors || []).join("\n"));
});
