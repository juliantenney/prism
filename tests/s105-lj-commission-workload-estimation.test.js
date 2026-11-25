/**
 * Focused regression suite for Learning Journey commission-level workload estimation.
 * Uses the live Sprint 105 Economics Stage 4 commissioning JSON directly as fixture.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const adapter = require(path.join(
  repoRoot,
  "lib",
  "learning-journey-workload-feasibility-adapter.js"
));
const practiceContracts = require(path.join(
  repoRoot,
  "lib",
  "ld-practice-presentation-contracts.js"
));
const stage4 = JSON.parse(
  fs.readFileSync(
    path.join(repoRoot, "tests", "fixtures", "s105-economics-stage4-commissions.json"),
    "utf8"
  )
);

function assessEconomicsStage4() {
  return adapter.assessLearningJourneyWorkload(
    {
      learning_journey: { allocated_minutes: 90 },
      commissions: stage4.commissions
    },
    { authoritativeParentDurationMinutes: 90 }
  );
}

function findingById(res, id) {
  const row = res.findings.find((f) => f.commissionId === id);
  assert.ok(row, `Expected finding for ${id}`);
  return row;
}

test("Economics Stage 4: C03 and C06 false-positive warnings are resolved without suppressing conceptual discrimination", () => {
  const res = assessEconomicsStage4();
  assert.equal(res.journey.envelopeMinutes, 90);
  assert.equal(res.journey.allocatedSum, 90);
  assert.equal(res.journey.arithmeticOk, true);
  assert.equal(res.findings.length, 10);

  // C03: bounded selected-response conceptual discrimination on familiar Dataset A, 8 min
  const c03 = findingById(res, "comm_3");
  assert.ok(c03.mapped && c03.estimate);
  assert.equal(c03.mapped.input.newEvidenceCount || 0, 0, "negated 'rather than introducing a new evidence set' must not add new evidence");
  assert.equal(c03.mapped.input.readingDemand, "familiar");
  assert.equal(c03.mapped.input.activityType, "mcq");
  assert.equal(c03.mapped.input.reasoningDemand, "application");
  assert.equal(c03.mapped.input.requiresFeedbackInterpretation, true);
  assert.equal(c03.estimate.plausiblyInsufficient, false);
  assert.ok(c03.estimate.indicativeEffortMinutes.low <= 8);

  // C06: concise retrieval practice with conceptual discrimination, 5 min
  const c06 = findingById(res, "comm_6");
  assert.ok(c06.mapped && c06.estimate);
  assert.equal(c06.mapped.input.newEvidenceCount || 0, 0, "negated 'rather than introducing a substantial new dataset' must not add new evidence");
  assert.equal(c06.mapped.input.workedExampleCount || 0, 0, "'before presenting ... worked examples' must not add worked examples");
  assert.equal(c06.mapped.input.activityType, "mcq");
  assert.equal(c06.mapped.input.reasoningDemand, "comprehension", "conceptual discrimination retrieval maps to comprehension, not mere recall or essay analysis");
  assert.equal(c06.mapped.input.requiresFeedbackInterpretation, true);
  assert.equal(c06.estimate.plausiblyInsufficient, false);
  assert.ok(c06.estimate.indicativeEffortMinutes.low <= 5);

  // Pure factual-recall retrieval still supports the recall tier
  const pureRecall = adapter.mapCommissionToEstimatorInput({
    commission_id: "c_recall_only",
    title: "Quick term recall",
    product_id: "practice",
    allocated_minutes: 4,
    specification_text:
      "Create a four-minute retrieval practice activity using concise questions to recall core definitions. Include immediate explanatory feedback."
  });
  assert.ok(pureRecall);
  assert.equal(pureRecall.input.reasoningDemand, "recall");
});

test("Economics Stage 4: C05, C08, C09, C10 retain genuine constructed-response, new-evidence, evaluation, and revision demands", () => {
  const res = assessEconomicsStage4();

  // C05: genuine constructed response (E5) on familiar Dataset D + feedback
  const c05 = findingById(res, "comm_5");
  assert.ok(c05.mapped && c05.estimate, "C05 must no longer be unmapped");
  assert.equal(c05.mapped.input.constructedResponseCount, 1);
  assert.equal(c05.mapped.input.readingDemand, "familiar");
  assert.equal(c05.mapped.input.reasoningDemand, "analysis");
  assert.equal(c05.mapped.input.requiresFeedbackInterpretation, true);
  assert.ok(c05.estimate.components.production.low > 0);

  // C08: genuine new supplementary evidence + revision-as-performance (no CR+revision double-count) + feedback
  const c08 = findingById(res, "comm_8");
  assert.ok(c08.mapped && c08.estimate);
  assert.equal(c08.mapped.input.newEvidenceCount, 1);
  assert.equal(c08.mapped.input.requiresRevision, true);
  assert.equal(c08.mapped.input.constructedResponseCount || 0, 0, "revision-as-performance must not double-count constructedResponse + revision");
  assert.equal(c08.mapped.input.requiresFeedbackInterpretation, true);
  assert.ok(c08.estimate.components.evidenceInspection.low > 0);
  assert.ok(c08.estimate.components.revision.low > 0);

  // C09: genuine unfamiliar Dataset E + independent constructed evaluation (E9), NO deferred feedback / prerequisite revision
  const c09 = findingById(res, "comm_9");
  assert.ok(c09.mapped && c09.estimate);
  assert.equal(c09.mapped.input.newEvidenceCount, 1);
  assert.equal(c09.mapped.input.constructedResponseCount, 1);
  assert.equal(c09.mapped.input.reasoningDemand, "evaluation");
  assert.equal(c09.mapped.input.requiresFeedbackInterpretation, false, "feedback deferred to comm_10 must not be charged in comm_9");
  assert.equal(c09.mapped.input.requiresRevision, false, "prerequisite 'reconsidered' must not charge revision in comm_9");
  assert.equal(c09.estimate.plausiblyInsufficient, false);

  // C10: familiar Dataset E + evaluation + refinement (E10) + feedback, NO false new evidence from 'proposal for additional evidence'
  const c10 = findingById(res, "comm_10");
  assert.ok(c10.mapped && c10.estimate);
  assert.equal(c10.mapped.input.newEvidenceCount || 0, 0);
  assert.equal(c10.mapped.input.readingDemand, "familiar");
  assert.equal(c10.mapped.input.reasoningDemand, "evaluation");
  assert.equal(c10.mapped.input.requiresRevision, true);
  assert.equal(c10.mapped.input.requiresFeedbackInterpretation, true);
});

test("Context contamination: prior/subsequent descriptions in journey_context_text do not inflate current commission demand", () => {
  const mapped = adapter.mapCommissionToEstimatorInput({
    commission_id: "c_ctx_clean",
    title: "Short concept check",
    product_id: "practice",
    allocated_minutes: 5,
    specification_text:
      "Create a five-minute practice activity with concise selected-response questions checking whether learners recognise correlation versus causation. Include brief explanatory feedback.",
    journey_context_text:
      "Earlier commissions introduced two unfamiliar datasets and required a 300-word analytical essay and revision after feedback. Later commissions will release a complete evidence dossier."
  });
  assert.ok(mapped);
  assert.equal(mapped.input.suggestedLengthWords, null);
  assert.equal(mapped.input.newEvidenceCount || 0, 0);
  assert.equal(mapped.input.requiresRevision, false);
  assert.notEqual(mapped.input.readingDemand, "dossier");
});

test("Genuinely overloaded control commission continues to warn", () => {
  const res = adapter.assessLearningJourneyWorkload(
    {
      learning_journey: { allocated_minutes: 6 },
      commissions: [
        {
          commission_id: "c_overloaded_control",
          section_id: "exp_ctrl",
          order: 1,
          title: "Unrealistic multi-dataset argument and revision",
          product_id: "assessment_pack",
          status: "supported",
          allocated_minutes: 6,
          specification_text:
            "Introduce 2 unfamiliar datasets and require learners to write a 300–400 word evidence-based policy recommendation defending their position, interpret criterion-referenced feedback, and then revise their response."
        }
      ]
    },
    { authoritativeParentDurationMinutes: 6 }
  );
  assert.equal(res.findings.length, 1);
  assert.equal(res.findings[0].estimate.plausiblyInsufficient, true);
  assert.ok(res.findings[0].estimate.indicativeEffortMinutes.low > 6);
  assert.ok(res.warnings.length >= 1);
});

test("Integrated performances avoid additive double-counting while preserving cognitive demand and sequential distinctions", () => {
  const res = assessEconomicsStage4();

  // comm_2: 2 unfamiliar datasets preserved (4-8), analysis preserved, integrated production avoids full 4-9 double-count
  const c02 = findingById(res, "comm_2");
  assert.equal(c02.mapped.input.reasoningDemand, "analysis");
  assert.equal(c02.mapped.input.integratedReasoningProduction, true);
  assert.equal(c02.estimate.components.evidenceInspection.low, 4);
  assert.equal(c02.estimate.components.production.low, 1);
  assert.equal(c02.estimate.indicativeEffortMinutes.low, 11);
  assert.equal(c02.estimate.plausiblyInsufficient, true, "tight 2-unfamiliar-dataset 10-min commission retains honest advisory warning");

  // comm_5: analysis preserved, integrated production avoids full double-count
  const c05 = findingById(res, "comm_5");
  assert.equal(c05.mapped.input.reasoningDemand, "analysis");
  assert.equal(c05.mapped.input.integratedReasoningProduction, true);
  assert.equal(c05.estimate.components.production.low, 1);

  // comm_8: unfamiliar supplement cost preserved (2-4), familiar revisit integrated (1-2), revision-as-performance integrated (1-3)
  const c08 = findingById(res, "comm_8");
  assert.equal(c08.mapped.input.integratedRevisionAsPerformance, true);
  assert.equal(c08.mapped.input.integratedEvidenceInspection, true);
  assert.equal(c08.estimate.components.evidenceInspection.low, 2);
  assert.equal(c08.estimate.components.reading.low, 1);
  assert.equal(c08.estimate.components.revision.low, 1);

  // comm_10: evaluation preserved, integrated feedback/self-evaluation + refinement avoids triple-counting
  const c10 = findingById(res, "comm_10");
  assert.equal(c10.mapped.input.reasoningDemand, "evaluation");
  assert.equal(c10.mapped.input.integratedRevisionAsPerformance, true);
  assert.equal(c10.mapped.input.integratedFeedbackSelfEvaluation, true);
  assert.equal(c10.estimate.plausiblyInsufficient, false);
  assert.ok(c10.estimate.indicativeEffortMinutes.low <= 10);

  // Genuinely sequential commission (write response, interpret feedback, then revise) stays higher than integrated revision-as-performance
  const sequentialRes = adapter.assessLearningJourneyWorkload(
    {
      learning_journey: { allocated_minutes: 10 },
      commissions: [
        {
          commission_id: "c_sequential_control",
          section_id: "exp_seq",
          order: 1,
          title: "Write analysis, review feedback, and then revise",
          product_id: "practice",
          status: "supported",
          allocated_minutes: 10,
          specification_text:
            "Revisit the familiar dataset and ask learners to write a 200-word analytical explanation, interpret criterion-referenced feedback, and then revise their response."
        }
      ]
    },
    { authoritativeParentDurationMinutes: 10 }
  );
  const seq = sequentialRes.findings[0];
  assert.equal(seq.mapped.input.integratedRevisionAsPerformance || false, false);
  assert.equal(seq.mapped.input.integratedFeedbackSelfEvaluation || false, false);
  assert.equal(seq.estimate.plausiblyInsufficient, true);
  assert.ok(seq.estimate.indicativeEffortMinutes.low > c10.estimate.indicativeEffortMinutes.low);
});

test("Clause filtering preserves genuine obligations occurring later in an activity sequence", () => {
  const mapped = adapter.mapCommissionToEstimatorInput({
    commission_id: "c_later_seq",
    title: "Sequenced attempt before feedback and revision",
    product_id: "practice",
    allocated_minutes: 8,
    specification_text:
      "Ask learners to produce a learner-authored explanation before revealing criterion-referenced feedback and asking them to revise their response."
  });
  assert.ok(mapped);
  assert.equal(
    mapped.input.requiresFeedbackInterpretation,
    true,
    "later-in-sequence feedback after 'before revealing' must not be stripped"
  );
  assert.equal(
    mapped.input.requiresRevision,
    true,
    "later-in-sequence revision after 'before revealing' must not be stripped"
  );
});

test("Practice feedback authoring guidance is consistent across Episode Plan, DLA, and GAM", () => {
  const ep = practiceContracts.buildPracticePresentationContractBlock("episode_plan");
  const dla = practiceContracts.buildPracticePresentationContractBlock("dla");
  const gam = practiceContracts.buildPracticePresentationContractBlock("gam");

  assert.ok(/coherent improvement experience within the authoritative duration/i.test(ep));
  assert.ok(/complement rather than duplicate/i.test(dla));
  assert.ok(/complement rather than duplicate/i.test(gam));
  assert.ok(/Collective feedback economy/i.test(dla));
  assert.ok(/Collective feedback economy/i.test(gam));
  assert.ok(/without imposing fixed word limits, criterion counts, duration tiers, or rigid activity structures/i.test(dla));
  assert.ok(/without imposing fixed word limits, criterion counts, duration tiers, or rigid activity structures/i.test(gam));
});
