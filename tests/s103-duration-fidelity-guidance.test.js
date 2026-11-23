/**
 * Sprint 103 — PB-FA-025 duration fidelity guidance (familiar revisit + commissioning).
 *
 * Refines the Sprint 100 advisory stack; does not invent a new estimation engine
 * and does not change authoritative commissioned durations.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const estimator = require(path.join(repoRoot, "lib", "workload-feasibility-estimator.js"));
const assessmentAdapter = require(path.join(
  repoRoot,
  "lib",
  "assessment-pack-workload-feasibility-adapter.js"
));
const journeyAdapter = require(path.join(
  repoRoot,
  "lib",
  "learning-journey-workload-feasibility-adapter.js"
));
const siblingPrompts = require(path.join(repoRoot, "lib", "learning-journey-sibling-prompts.js"));

test("estimator exposes a familiar reading band lighter than moderate / dossier", () => {
  assert.equal(estimator.SCHEMA_VERSION, "100A.2");
  assert.ok(estimator.READING_BANDS.familiar);
  assert.ok(estimator.READING_BANDS.familiar.high < estimator.READING_BANDS.moderate.high);
  assert.ok(estimator.READING_BANDS.familiar.high < estimator.READING_BANDS.dossier.low);
  assert.equal(
    estimator.normalizeReadingDemand("", "constructed_response", { familiarMaterial: true }),
    "familiar"
  );
  assert.equal(
    estimator.normalizeReadingDemand("", "constructed_response", {
      familiarMaterial: true,
      dossierReview: true
    }),
    "familiar"
  );
});

test("familiar revisit estimate is lower than first-pass moderate reading for the same task", () => {
  const base = {
    activityType: "argumentative_writing",
    suggestedLengthWords: { min: 500, max: 700 },
    reasoningDemand: "evaluation",
    requiresFeedbackInterpretation: true,
    declaredDurationMinutes: 40
  };
  const firstPass = estimator.estimateActivityWorkload(
    Object.assign({}, base, { readingDemand: "moderate" })
  );
  const revisit = estimator.estimateActivityWorkload(
    Object.assign({}, base, { readingDemand: "familiar", familiarMaterial: true })
  );
  assert.equal(firstPass.sufficientEvidence, true);
  assert.equal(revisit.sufficientEvidence, true);
  assert.ok(revisit.indicativeEffortMinutes.low < firstPass.indicativeEffortMinutes.low);
  assert.ok(revisit.indicativeEffortMinutes.high < firstPass.indicativeEffortMinutes.high);
  assert.match(revisit.factors.join(" "), /familiar/i);
});

test("Assessment Pack adapter treats bring-forward / earlier evidence as familiar, not dossier", () => {
  const elicitation = {
    elicitation_id: "E_FINAL",
    indicative_duration_minutes: 40,
    evidence_ask:
      "Elicit an independent clinical judgement that revisits earlier evidence and bring-forward notes.",
    stimulus: "Complete fictional evidence dossier for the clinical case.",
    delivery: {
      kind: "constructed_performance",
      prompt: {
        title: "Independent clinical judgement",
        context:
          "Revisit the familiar evidence from earlier commissions and your prior judgement before composing.",
        task:
          "Write a 500–700 word evaluative argument using the earlier evidence. Include formative feedback engagement.",
        suggested_length: "Approximately 500–700 words.",
        indicative_time: "Approximately 40 minutes."
      }
    },
    formative_return: {
      materials: [{ material_id: "F1", body: "Compare your argument with the criteria." }]
    }
  };
  const mapped = assessmentAdapter.mapElicitationToEstimatorInput(elicitation);
  assert.ok(mapped);
  assert.equal(mapped.input.readingDemand, "familiar");
  assert.equal(mapped.input.familiarMaterial, true);
  assert.equal(mapped.input.dossierReview, false);
  assert.deepEqual(mapped.input.suggestedLengthWords, { min: 500, max: 700 });

  const assessed = assessmentAdapter.assessAssessmentPackWorkload({
    elicitations: [elicitation]
  });
  assert.ok(assessed.findings.length >= 1);
  assert.equal(assessed.findings[0].input.readingDemand, "familiar");
  if (assessed.warnings.length) {
    assert.match(assessed.warnings[0], /planning aid|not a measured completion time/);
    assert.match(assessed.warnings[0], /staging|feedback engagement|revisiting/i);
  }
});

test("Learning Journey adapter treats revisit/bring-forward commissions as familiar reading", () => {
  const commission = {
    commission_id: "c_final",
    title: "Independent judgement",
    product_id: "assessment_pack",
    specification_text:
      "Create an Assessment Pack. Approximate learner time: 40 minutes. Require a 500–700 word evaluative argument. Learners should revisit earlier evidence and bring-forward their prior judgement; do not charge a full first-pass dossier reading.",
    journey_context_text: "Final commission building on earlier Practice and Expository work.",
    dependencies: "c1,c2"
  };
  const mapped = journeyAdapter.mapCommissionToEstimatorInput(commission);
  assert.ok(mapped);
  assert.equal(mapped.input.readingDemand, "familiar");
  assert.equal(mapped.input.familiarMaterial, true);
  assert.equal(mapped.allocatedMinutes, 40);

  const assessed = journeyAdapter.assessLearningJourneyWorkload(
    { commissions: [commission] },
    { learningTimeEnvelopeMinutes: 180 }
  );
  assert.ok(assessed.findings.length >= 1);
  assert.ok(assessed.findings[0].mapped);
  assert.equal(assessed.findings[0].mapped.input.readingDemand, "familiar");
  if (assessed.warnings.some((w) => /commission/i.test(w))) {
    const warning = assessed.warnings.find((w) => /commission/i.test(w));
    assert.match(warning, /planning aid|not a measured completion time/);
    assert.match(warning, /double-counting|first-pass|staging|feedback engagement/i);
  }
});

test("Journey commissioning prompt includes duration-fidelity guidance without changing allocations", () => {
  const body = siblingPrompts.resolveTemplate({
    canonical_step_id: "step_journey_commissioning"
  });
  const text = String(typeof body === "string" ? body : (body && body.prompt) || body);
  assert.match(text, /DURATION FIDELITY \(indicative planning guidance\)/);
  assert.match(text, /Authoritative commissioned time allocations/);
  assert.match(text, /not measured learner completion times/);
  assert.match(text, /purposeful revisiting/i);
  assert.match(text, /word-count-to-time/i);
  assert.match(text, /avoid double-counting/i);
  assert.match(text, /Prefer proportionate adjustments/i);
  // Authoritative envelope language is preserved; guidance must not rewrite totals.
  assert.match(text, /TIME CHECK/);
  assert.doesNotMatch(text, /change the journey's authoritative 180/);
});
