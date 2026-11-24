/**
 * Sprint 104 Milestone 4 — Proportionate Learning Journey commissioning (Principle D)
 * and four-product duration-aware design calibration.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const siblingLj = require(path.join(repoRoot, "lib", "learning-journey-sibling-prompts.js"));
const designLj = require(path.join(repoRoot, "lib", "learning-journey-design-page.js"));
const family = require(path.join(repoRoot, "lib", "first-class-workflow-family.js"));
const intake = require(path.join(repoRoot, "lib", "first-class-commission-intake.js"));
const siblingExpo = require(path.join(repoRoot, "lib", "expository-sibling-prompts.js"));
const siblingSt = require(path.join(repoRoot, "lib", "situated-task-sibling-prompts.js"));
const practiceEp = require(path.join(repoRoot, "lib", "practice-episode-plan.js"));
const { loadPrismAppJsTestApi, DEFAULT_LIBS } = require("./prism-vm-lib-bootstrap.js");

function loadAppTestApi() {
  const loaded = loadPrismAppJsTestApi({
    libs: DEFAULT_LIBS.slice(),
    extraLibs: ["lib/expository-contracts.js", "lib/expository-sibling-prompts.js"]
  });
  const expoLib =
    (loaded.sandbox && loaded.sandbox.PrismExpositorySiblingPrompts) || siblingExpo;
  if (loaded.window) loaded.window.PrismExpositorySiblingPrompts = expoLib;
  if (loaded.sandbox && loaded.sandbox.globalThis) {
    loaded.sandbox.globalThis.PrismExpositorySiblingPrompts = expoLib;
  }
  return loaded.api;
}

function makeCommissionedWorkflow(api, productId, allocatedMinutes, stepOverride) {
  const commission = {
    commission_id: "c2",
    section_id: "exp_2",
    order: 2,
    title: "Commissioned test activity",
    product_id: productId,
    status: "supported",
    allocated_minutes: allocatedMinutes,
    specification_text:
      [
        "Examine the evidence carefully and produce a clear response.",
        "",
        "<<<COMPONENT_LEARNING_OUTCOMES_BEGIN>>>",
        JSON.stringify({
          learning_outcomes: [
            {
              id: "LO1",
              statement: "Evaluate evidence strength accurately.",
              related_concepts: ["evidence evaluation"],
              cognitive_level: "evaluate"
            }
          ]
        }),
        "<<<COMPONENT_LEARNING_OUTCOMES_END>>>"
      ].join("\n"),
    journey_context_text:
      "Established scenario facts: Clinic A vs Clinic B outcomes. Preceding activities: learners examined basic error concepts in c1. Bring-forward: use your earlier prediction.",
    dependencies: "c1"
  };
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "learning_journey",
    title: "Evidence and Inference",
    sections: [
      { section_id: "journey_intro", title: "Overview", order: 1, exposition: "Intro" },
      { section_id: "exp_1", title: "Causal Foundations", order: 2, exposition: "First step" },
      { section_id: "exp_2", title: "Commissioned test activity", order: 3, exposition: "Second step" }
    ],
    commissions: [
      {
        commission_id: "c1",
        section_id: "exp_1",
        order: 1,
        title: "Causal Foundations",
        product_id: "expository",
        status: "supported",
        allocated_minutes: 10,
        specification_text: "Establish foundations."
      },
      commission
    ],
    learning_journey: {
      allocated_minutes: 10 + allocatedMinutes,
      design_intent: "Test journey",
      continuity: "Continuous evidence thread"
    }
  };
  const env = designLj.commissionToIntakeEnvelope(commission, page, {
    audience: "First-year economics students"
  });
  assert.ok(env && env.productId === productId, "expected intake envelope for " + productId);
  const res = intake.intakeCommission(env);
  assert.equal(res.ok, true);
  const applied = api.applyAcceptedCommissionIntakeForTest(res);
  assert.equal(applied.ok, true);
  const stepsRaw = (applied.built && applied.built.steps) || (res.family && res.family.steps) || [];
  const seed = Object.assign(
    {},
    (applied.built && applied.built.deliverySeed) || (res.family && res.family.deliverySeed) || {},
    {
      audience: "First-year economics students",
      commissioned_duration_minutes: allocatedMinutes,
      duration_minutes: allocatedMinutes
    }
  );
  const initialBrief = Object.assign(
    {},
    res.envelope,
    (applied.built && applied.built.initialBriefPatch) || {},
    {
      product: productId,
      audience: "First-year economics students",
      commissionedDurationMinutes: allocatedMinutes,
      allocatedMinutes: allocatedMinutes
    }
  );
  const wf = api.normalizeWorkflowForV1(
    {
      id: "wf-" + productId,
      name: "Commissioned " + productId,
      goal: "Test commissioned calibration",
      product: productId,
      promptRoute: productId,
      pageEnrichmentV2: productId === "practice",
      partialPageOutputs: false,
      steps: stepsRaw.map((s, idx) =>
        Object.assign(
          { id: "s" + (idx + 1) },
          s,
          s && s.promptBody && !s.overridePromptBody
            ? { promptSourceType: "local_override", overridePromptBody: s.promptBody }
            : null,
          stepOverride && idx === 0 ? stepOverride : null
        )
      ),
      workflowBriefResolution: {
        initialBrief,
        resolvedFactors: seed
      },
      workflowOutputSpec: {
        audience: "First-year economics students",
        pageEnrichmentV2: productId === "practice"
      }
    },
    []
  );
  return wf;
}

test("M4: LJ Steps 1-5 enforce proportionate commissioning without forbidden quotas or tiers", () => {
  const req = siblingLj.TEMPLATES.learning_requirements;
  const prog = siblingLj.TEMPLATES.learning_progression;
  const el = siblingLj.TEMPLATES.learning_elements;
  const comm = siblingLj.TEMPLATES.learning_commissions;
  const dpPrompt = designLj.buildLearningJourneyDesignPagePrompt();
  const dpCopy = designLj.buildLearningJourneyDesignPageCopyInstructions();

  // Distributed pedagogical functions across journey
  assert.match(prog, /Distribute pedagogical functions across the journey/i);
  assert.match(comm, /Distribute pedagogical functions across the journey/i);
  assert.match(comm, /Avoid commissioning the full pedagogical repertoire inside each individual component/i);

  // Achievable performance reasoning across prior learning, evidence inspection, responses, feedback
  assert.match(req, /reading\/evidence inspection, reasoning, response construction, and feedback engagement/i);
  assert.match(prog, /charging familiar evidence revisiting more lightly/i);
  assert.match(el, /distinguishing first-pass inspection of unfamiliar evidence from revisiting familiar material/i);
  assert.match(comm, /Commission achievable learner performances within each component's authoritative `allocated_minutes`/i);
  assert.match(comm, /State clearly what earlier learning and evidence a later commission assumes/i);

  // Consequential reuse without inventing response-aware adaptation or snapshot versions
  assert.match(comm, /so earlier learner work has genuine educational consequence/i);
  assert.match(comm, /Do not invent response-aware runtime adaptation or imply that an earlier version\/snapshot/i);
  assert.match(dpPrompt, /do not invent response-aware adaptation or snapshot versions/i);

  // Journal discipline: purposeful consequences, never extra writing obligations
  assert.match(prog, /arise as purposeful consequences of needed learning performances/i);
  assert.match(el, /Do not invent elements or extra writing obligations solely for journalling/i);
  assert.match(comm, /Journal contributions must arise as purposeful consequences of genuinely needed learning performances — never extra writing quotas/i);
  assert.match(dpPrompt, /Do not invent commissions or extra writing obligations solely to feed the journal/i);

  // Surfacing infeasibility rather than silently mutating duration or outcomes
  assert.match(req, /surface that infeasibility explicitly here rather than silently changing authoritative outcomes or available time/i);
  assert.match(prog, /surface that infeasibility explicitly rather than silently changing authoritative outcomes or total learning time/i);
  assert.match(comm, /Surface infeasible commissions explicitly rather than hiding overload or mutating authoritative parameters/i);
  assert.match(comm, /explicitly flag that infeasibility and its cause rather than silently mutating `journey_allocated_minutes` or authoritative outcomes/i);
  assert.match(dpPrompt, /Where Step 4 surfaced feasibility tension or an infeasible commission/i);
  assert.match(dpCopy, /preserve that warning concisely in learning_journey\.design_intent/i);

  // Explicit prohibition of fixed duration tiers, component quotas, outcome caps, word-count rules
  assert.match(comm, /fixed duration tiers, component quotas, or outcome-count caps/i);
  assert.doesNotMatch(comm, /\bmax\s+\d+\s+outcomes?\b/i);
  assert.doesNotMatch(comm, /\bmaximum\s+\d+\s+components?\b/i);
});

test("M4: Commissioned duration informs design calibration across all four product families", () => {
  const api = loadAppTestApi();

  // 1. Practice
  const wfPractice = makeCommissionedWorkflow(api, "practice", 12);
  const epStep = wfPractice.steps.find((s) => /Design Episode Plan/i.test(s.title));
  const dlaStep = wfPractice.steps.find((s) => /Design Learning Activities/i.test(s.title));
  const epRes = api.resolveStepPromptText(epStep, wfPractice);
  const dlaRes = api.resolveStepPromptText(
    Object.assign({}, dlaStep, {
      promptSourceType: "local_override",
      overridePromptBody: "Design learning activities for the commissioned Practice resource."
    }),
    wfPractice
  );
  assert.match(epRes.text, /Authoritative allocated duration: 12 minutes/);
  assert.match(epRes.text, /Authoritative commissioned duration.*12-minute budget/i);
  assert.match(dlaRes.text, /Authoritative commissioned duration.*12-minute budget/i);
  assert.match(api.composeCommissionedContextHonourInstruction(wfPractice), /12-minute budget/i);
  assert.match(
    api.buildEffectiveWorkflowContextBlock(wfPractice, epStep),
    /Duration: 12 minutes/
  );

  // 2. Expository (context projection + EJP/XD/XM sibling prompts; zero Interactive semantics)
  const wfExpo = makeCommissionedWorkflow(api, "expository", 15);
  const ejpStep = wfExpo.steps.find((s) => /Expository Journey Plan/i.test(s.title));
  const xdStep = wfExpo.steps.find((s) => /Expository Development/i.test(s.title));
  const ejpRes = api.resolveStepPromptText(ejpStep, wfExpo);
  const xdRes = api.resolveStepPromptText(xdStep, wfExpo);
  assert.match(
    api.buildEffectiveWorkflowContextBlock(wfExpo, ejpStep),
    /Duration: 15 minutes/
  );
  assert.match(ejpRes.text, /Authoritative commissioned duration.*15-minute budget/i);
  assert.match(ejpRes.text, /authoritative commissioned Duration \(minutes\) is supplied in workflow parameters/i);
  assert.match(xdRes.text, /authoritative commissioned Duration in workflow parameters/i);
  assert.match(siblingExpo.TEMPLATES.expository_materials, /authoritative commissioned Duration calibration/i);
  assert.equal(siblingExpo.assertNoInteractiveSemantics(siblingExpo.TEMPLATES.expository_journey_plan).ok, true);
  assert.equal(siblingExpo.assertNoInteractiveSemantics(siblingExpo.TEMPLATES.expository_development).ok, true);
  assert.equal(
    siblingExpo.assertNoInteractiveSemantics(
      "- Stay within EJP/XD extent allocation and any authoritative commissioned Duration calibration — do not independently expand resource scope or add uncommissioned elaborations"
    ).ok,
    true
  );

  // 3. Assessment Pack
  const wfAp = makeCommissionedWorkflow(api, "assessment_pack", 14);
  const purposeStep = wfAp.steps.find((s) => /Interpret Evidence Purpose/i.test(s.title));
  const elicitStep = wfAp.steps.find((s) => /Design Evidence Elicitation/i.test(s.title));
  const formStep = wfAp.steps.find((s) => /Author Formative Return/i.test(s.title));
  const purposeRes = api.resolveStepPromptText(purposeStep, wfAp);
  const elicitRes = api.resolveStepPromptText(elicitStep, wfAp);
  const formRes = api.resolveStepPromptText(formStep, wfAp);
  assert.match(
    api.buildEffectiveWorkflowContextBlock(wfAp, purposeStep),
    /Duration: 14 minutes/
  );
  assert.match(purposeRes.text, /Authoritative commissioned duration.*14-minute budget/i);
  assert.match(purposeRes.text, /Authoritative duration calibration \(when Duration is supplied in workflow parameters\)/);
  assert.match(elicitRes.text, /Authoritative duration calibration \(when Duration is supplied in workflow parameters\)/);
  assert.match(formRes.text, /Authoritative duration calibration \(when Duration is supplied in workflow parameters\)/);

  // Standalone Assessment Pack retains isolation (no AUTHORITATIVE COMMISSION CONTEXT)
  const standaloneAp = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "assessment_pack",
    focus: "Diagnostic check",
    startingPoint: "topic"
  });
  assert.doesNotMatch(standaloneAp.steps[3].promptBody, /AUTHORITATIVE COMMISSION CONTEXT/);
  assert.match(standaloneAp.steps[3].promptBody, /Authoritative duration calibration/);

  // 4. Situated Task
  const wfSt = makeCommissionedWorkflow(api, "situated_task", 20);
  const sitStep = wfSt.steps.find((s) => /^Situation$/i.test(s.title));
  const actStep = wfSt.steps.find((s) => /^Activity$/i.test(s.title));
  const supStep = wfSt.steps.find((s) => /^Support$/i.test(s.title));
  const retStep = wfSt.steps.find((s) => /^Learning Return$/i.test(s.title));
  assert.match(
    api.buildEffectiveWorkflowContextBlock(wfSt, actStep),
    /Duration: 20 minutes/
  );
  assert.match(siblingSt.resolveTemplate(sitStep), /authoritative Duration is supplied in workflow parameters/i);
  assert.match(siblingSt.resolveTemplate(actStep), /authoritative Duration is supplied in workflow parameters/i);
  assert.match(siblingSt.resolveTemplate(supStep), /authoritative Duration supplied in workflow parameters/i);
  assert.match(siblingSt.resolveTemplate(retStep), /authoritative Duration supplied in workflow parameters/i);
  assert.match(
    api.resolveStepPromptText(sitStep, wfSt).text,
    /Authoritative commissioned duration.*20-minute budget/i
  );
});
