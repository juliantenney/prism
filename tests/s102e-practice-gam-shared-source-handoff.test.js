/**
 * Sprint 102E — LJ-commissioned Practice GAM must embed canonical shared
 * source text (not merely CSSP section references) so source-fidelity
 * verification does not depend on Copilot conversation memory.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const sharedSource = require("../lib/learning-journey-shared-source.js");
const assembler = require("../lib/gam-canonical-assembler.js");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const CSSP_01 = [
  "CSSP-01 — Criterion-referenced feedback pack (illustrative).",
  "",
  "Section A — Assignment brief",
  "Write a short evaluative judgement of the student response against the five descriptive criteria.",
  "",
  "Section B — Five descriptive criteria",
  "1. Accuracy of claim",
  "2. Use of evidence",
  "3. Clarity of reasoning",
  "4. Fairness of tone",
  "5. Actionable next step",
  "",
  "Section C — Student submission",
  "I think the experiment worked because the tablet dissolved faster in warm water, so temperature must cause dissolution. The numbers look different enough.",
  "",
  "Section D — Feedback A",
  "Feedback A: You notice the timing difference, but the causal claim is stronger than the evidence supports.",
  "",
  "Section E — Feedback B and Feedback C",
  "Feedback B: Link at least one criterion to a concrete phrase in the student submission.",
  "Feedback C: Offer one actionable revision the student could make without inventing data.",
  "",
  "Section F — Canonical reference interpretation (post-attempt only)",
  "Model reading: the submission observes a difference but overclaims causation; strongest feedback pairs evidence restraint with an actionable revision."
].join("\n");

const DLA_PAGE = {
  artifact_type: "page",
  schema_version: "2.0.0",
  activities: [
    {
      activity_id: "A1",
      required_materials: [
        {
          material_id: "A1-M1",
          material_type: "scenario_set",
          purpose: "Provide the CSSP-01 assignment brief and criteria for judgement practice.",
          specification: "Reproduce CSSP-01 Sections A–B exactly.",
          evidence_requirement: {
            provenance: "conversation_attachment",
            target: "CSSP-01 Sections A–B"
          }
        },
        {
          material_id: "A1-M2",
          material_type: "evidence_provider",
          purpose: "Provide the student submission and Feedback A–C wording.",
          specification: "Reproduce CSSP-01 Sections C–E verbatim, including Feedback A–C.",
          evidence_requirement: {
            provenance: "conversation_attachment",
            target: "CSSP-01 Sections C–E"
          }
        },
        {
          material_id: "A1-M3",
          material_type: "sample_output",
          purpose: "Post-attempt model reading only.",
          specification: "Use CSSP-01 Section F after the learner attempt.",
          evidence_requirement: {
            provenance: "conversation_attachment",
            target: "CSSP-01 Section F"
          }
        }
      ]
    }
  ]
};

function loadApi() {
  return loadPrismAppJsTestApi({
    extraLibs: [
      "lib/learning-journey-shared-source.js",
      "lib/gam-canonical-assembler.js",
      "lib/ld-gam-page-enrich-contract.js"
    ]
  });
}

test("shared-source GAM handoff embeds full corpus and splits Section F as post-attempt only", () => {
  const parted = sharedSource.partitionAuthoritativeSharedSourceForGam(CSSP_01);
  assert.equal(parted.split, true);
  assert.match(parted.evidenceBody, /Feedback A:/);
  assert.match(parted.evidenceBody, /Feedback B:/);
  assert.match(parted.evidenceBody, /Feedback C:/);
  assert.match(parted.evidenceBody, /Assignment brief/);
  assert.match(parted.evidenceBody, /Student submission/);
  assert.doesNotMatch(parted.evidenceBody, /Section F/);
  assert.match(parted.postAttemptBody, /Section F/);
  assert.match(parted.postAttemptBody, /Canonical reference interpretation/);

  const block = sharedSource.composeAuthoritativeSharedSourceGamHandoffSection(CSSP_01);
  assert.match(block, /AUTHORITATIVE SHARED SOURCE MATERIAL \(read-only\)/);
  assert.match(block, /<<<AUTHORITATIVE_SHARED_SOURCE_BEGIN>>>/);
  assert.match(block, /Feedback A: You notice the timing difference/);
  assert.match(block, /CANONICAL REFERENCE INTERPRETATION \(post-attempt only\)/);
  assert.match(block, /<<<POST_ATTEMPT_CANONICAL_REFERENCE_BEGIN>>>/);
  assert.match(block, /Model reading: the submission observes a difference/);
});

test("assembler injects shared source after DLA commission only when supplied", () => {
  const without = assembler.assembleGamCanonicalPrompt({
    profile: assembler.PROFILES.COPY_V2_PARTIAL,
    dlaPage: DLA_PAGE,
    stepIndex: 5,
    outputName: "page",
    authoritativeSharedSourceText: ""
  });
  assert.match(without.text, /AUTHORITATIVE DLA MATERIAL COMMISSION/);
  assert.doesNotMatch(without.text, /AUTHORITATIVE SHARED SOURCE MATERIAL \(read-only\)/);

  const withSource = assembler.assembleGamCanonicalPrompt({
    profile: assembler.PROFILES.COPY_V2_PARTIAL,
    dlaPage: DLA_PAGE,
    stepIndex: 5,
    outputName: "page",
    authoritativeSharedSourceText: CSSP_01
  });
  assert.match(withSource.text, /AUTHORITATIVE DLA MATERIAL COMMISSION/);
  assert.match(withSource.text, /AUTHORITATIVE SHARED SOURCE MATERIAL \(read-only\)/);
  assert.match(withSource.text, /Feedback A: You notice the timing difference/);
  assert.match(withSource.text, /post-attempt only/i);
  const commissionAt = withSource.text.indexOf("AUTHORITATIVE DLA MATERIAL COMMISSION");
  const sourceAt = withSource.text.indexOf("AUTHORITATIVE SHARED SOURCE MATERIAL (read-only)");
  assert.ok(commissionAt >= 0 && sourceAt > commissionAt);
});

test("LJ-commissioned Practice GAM Copy prompt embeds CSSP-01 and survives verification repair", () => {
  const { api } = loadApi();
  const gamStep = {
    id: "s-gam",
    title: "Generate Activity Materials",
    canonical_step_id: "step_generate_activity_materials",
    outputName: "page"
  };
  const dlaStep = {
    id: "s-dla",
    title: "Design Learning Activities",
    canonical_step_id: "step_design_learning_activities",
    outputName: "page"
  };
  const wf = {
    id: "wf-practice-cssp-gam",
    product: "practice",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    steps: [dlaStep, gamStep],
    workflowBriefResolution: {
      resolvedFactors: {
        topic: "Criterion-referenced feedback judgements",
        commission_specification:
          "Educational job: Practise criterion-referenced feedback using CSSP-01.",
        journey_context: "Builds on the journey's shared CSSP-01 pack.",
        source_journey_workflow_id: "wf-lj-parent",
        source_commission_id: "c2",
        source_context: CSSP_01
      },
      initialBrief: {
        topic: "Criterion-referenced feedback judgements",
        commissionSpecification:
          "Educational job: Practise criterion-referenced feedback using CSSP-01.",
        journeyContextText: "Builds on the journey's shared CSSP-01 pack.",
        sourceJourneyWorkflowId: "wf-lj-parent",
        sourceCommissionId: "c2",
        sourceContext: CSSP_01
      }
    }
  };

  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest({
    [dlaStep.id]: JSON.stringify(DLA_PAGE, null, 2)
  });

  const prompt = api.buildLiveGamV2CopyPromptViaCanonicalAssembler(
    gamStep,
    1,
    null,
    wf,
    "page"
  );

  assert.match(prompt, /AUTHORITATIVE DLA MATERIAL COMMISSION/);
  assert.match(prompt, /AUTHORITATIVE SHARED SOURCE MATERIAL \(read-only\)/);
  assert.match(prompt, /Write a short evaluative judgement/);
  assert.match(prompt, /Feedback A: You notice the timing difference/);
  assert.match(prompt, /Feedback B: Link at least one criterion/);
  assert.match(prompt, /Feedback C: Offer one actionable revision/);
  assert.match(prompt, /CANONICAL REFERENCE INTERPRETATION \(post-attempt only\)/);
  assert.match(prompt, /Model reading: the submission observes a difference/);
  assert.equal(api.resolveAuthoritativeSharedSourceTextForGamPrompt(wf), CSSP_01);

  const repairedPrompt = api.appendGamVerificationRepairSectionToGenerationPromptForTest(
    prompt,
    [
      {
        label: "A1-M2",
        reason: "Omits exact Feedback A–C wording from CSSP-01."
      }
    ]
  );
  assert.match(repairedPrompt, /AUTHORITATIVE SHARED SOURCE MATERIAL \(read-only\)/);
  assert.match(repairedPrompt, /Feedback A: You notice the timing difference/);
  assert.match(repairedPrompt, /PRISM VERIFICATION REPAIR/);
  assert.ok(repairedPrompt.startsWith(prompt.replace(/\s+$/, "")));
});
test("standalone Practice GAM prompt without commission context stays free of shared-source handoff", () => {
  const { api } = loadApi();
  const gamStep = {
    id: "s-gam",
    title: "Generate Activity Materials",
    canonical_step_id: "step_generate_activity_materials",
    outputName: "page"
  };
  const wf = {
    id: "wf-practice-standalone",
    product: "practice",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    steps: [gamStep],
    workflowBriefResolution: {
      resolvedFactors: { topic: "Feedback practice" },
      initialBrief: { topic: "Feedback practice" }
    }
  };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  assert.equal(api.resolveAuthoritativeSharedSourceTextForGamPrompt(wf), "");
  const assembled = assembler.assembleGamCanonicalPrompt({
    profile: assembler.PROFILES.COPY_V2_PARTIAL,
    dlaPage: DLA_PAGE,
    authoritativeSharedSourceText: api.resolveAuthoritativeSharedSourceTextForGamPrompt(wf),
    stepIndex: 1,
    outputName: "page"
  });
  assert.doesNotMatch(assembled.text, /AUTHORITATIVE SHARED SOURCE MATERIAL \(read-only\)/);
});
