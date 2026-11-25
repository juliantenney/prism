/**
 * Sprint 101E — Practice Design Page visual-planning contract integration.
 *
 * Practice must receive the shared Sprint 38 / VPC authoring contract, produce
 * schema-valid generate|defer|skip rows, keep mathematical/anti-spoiler imagery
 * available, and not misreport Graphics (N) while VPC is invalid.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");

const { loadPrismAppJsTestApi, DEFAULT_LIBS } = require("./prism-vm-lib-bootstrap.js");
const practiceContracts = require("../lib/ld-practice-presentation-contracts.js");
const s38 = require("../lib/sprint38-visual-affordances.js");
const vpc = require("../lib/visual-planning-contract.js");
const workspace = require("../lib/utilities-visual-jobs-workspace.js");
const editorial = require("../lib/expository-editorial-opening.js");

const records = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "fixtures", "sprint-38", "affordance-records.json"),
    "utf8"
  )
);

function boot() {
  return loadPrismAppJsTestApi({
    libs: DEFAULT_LIBS.slice()
  });
}

function practiceDesignPageWf() {
  return {
    product: "practice",
    startingPoint: "generate_from_topic",
    goal: "Formulate and solve multiplier equations through practice.",
    desiredOutputs: "Practice learner page",
    selectedDomains: ["learning-design"],
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    workflowOutputSpec: { pageEnrichmentV2: true, partialPageOutputs: true }
  };
}

function interactiveDesignPageWf() {
  return {
    product: "interactive",
    variant: "self_study",
    startingPoint: "generate_from_topic",
    goal: "Self-directed learner page",
    desiredOutputs: "Learner-facing page",
    selectedDomains: ["learning-design"],
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    workflowOutputSpec: { pageEnrichmentV2: true, partialPageOutputs: true }
  };
}

function designPageStep() {
  return {
    canonical_step_id: "step_design_page",
    canonical_title: "Design Page",
    title: "Design Page"
  };
}

function practicePageEnvelope(affordances, extras) {
  return Object.assign(
    {
      artifact_type: "page",
      schema_version: "2.0.0",
      product_id: "practice",
      page_kind: "practice",
      title: "Formulate and Solve Multiplier Equations",
      page_synthesis: {
        overview: { body: "Optional practice hook.", format: "markdown" }
      },
      activities: [
        {
          activity_id: "A2",
          title: "Multiplier equations",
          learner_task: "Formulate and solve."
        }
      ],
      visual_affordance_schema_version: "38.4",
      activities_visual_review: [
        {
          activity_id: "A2",
          activity_visual_value: {
            decision: "high",
            rationale: "Conceptual diagram supports multiplier formulation."
          }
        }
      ],
      visual_affordances: affordances,
      editorial_opening_image: {
        decision: "generate",
        subject: "Constrained optimisation practice atmosphere",
        context: "Decorative opening only; no solution spoilers.",
        caption_intent: "Atmosphere for practice.",
        alt_text: "",
        detailed_description: "A restrained scene suggesting equations without revealing answers."
      },
      assembly_state: {
        current_stage: "design_page",
        enriched_by: ["design_page"],
        calls_model: true
      }
    },
    extras || {}
  );
}

function validGenerateMath() {
  const row = {
    ...records.inflation_a2_generate,
    affordance_id: "va-A2-multiplier-formulation",
    activity_id: "A2",
    purpose: "mechanism",
    preferred_representation: "annotated_system",
    visual_slot: "materials-entry",
    anti_spoiler: true,
    spoiler_boundary: {
      hide_answers: true,
      hide_classification_keys: true,
      hide_model_solution: true,
      allow_structural_hint: true
    },
    reasoning_supported: "Show structural roles of multipliers without solving the learner task.",
    must_show: ["constraint surface cue", "multiplier as structural role"],
    must_not_show: ["completed solution values", "answered classification"],
    allowed_claims: ["Multipliers encode constraint structure in the taught model."],
    disallowed_claims: ["Numeric solution to the Practice item."],
    source_basis: "A2.learner_task",
    evidence_anchors: ["A2.learner_task"],
    subject: "Multiplier structural roles",
    context:
      "Visual brief: show how a multiplier attaches to a constraint without disclosing the worked solution learners must produce.",
    caption_intent: "Structural roles only — no solved values.",
    scope: "activity",
    rationale:
      "Makes multiplier–constraint structure inspectable before learners formulate equations."
  };
  delete row.material_anchor;
  return row;
}

function validDefer() {
  return {
    affordance_id: "va-A2-defer-worked-first",
    scope: "activity",
    activity_id: "A2",
    visual_decision: "defer",
    defer_reason: "worked_example_sufficient_first",
    rationale: "Attempt the worked formulation steps before any diagram summary.",
    subject: "Multiplier formulation sequence",
    context: "Visual brief: defer diagram until baseline algebraic attempt is established.",
    evidence_anchors: ["A2.learner_task"]
  };
}

function validSkip() {
  return {
    affordance_id: "va-A2-skip-text-sufficient",
    scope: "activity",
    activity_id: "A2",
    visual_decision: "skip",
    skip_reason: "assessment_text_sufficient",
    rationale: "Prompt text already carries the discrimination; a figure would duplicate it.",
    subject: "Text-sufficient discrimination",
    context: "Visual brief: no additional visual warranted.",
    evidence_anchors: ["A2.learner_task"]
  };
}

test("101E: Practice presentation contract points at shared Sprint 38 VA + forbids invented slots", () => {
  const block = practiceContracts.buildPracticePresentationContractBlock();
  assert.match(block, /Sprint 38 visual-affordance authoring contract/i);
  assert.match(block, /materials-entry/);
  assert.match(block, /Never invent slots such as materials-after-feedback/i);
  assert.match(block, /Purpose-driven page_synthesis furniture/i);
  assert.match(block, /page_synthesis: \{\} or partial omissions are valid/i);
  const shape = practiceContracts.buildCanonicalPracticeDesignPageShapeSnippet();
  assert.match(shape, /visual_affordance_schema_version": "38.4"/);
  assert.match(shape, /"visual_affordances": \[\]/);
});

test("101E: Practice Design Page runtime augmentation includes Sprint 38 VA authoring contract", () => {
  const { api } = boot();
  const augmented = api.applyWorkflowStepRuntimePromptAugmentations(
    "Assemble Practice Design Page partial JSON.\n",
    designPageStep(),
    practiceDesignPageWf(),
    {}
  );

  assert.match(augmented, /LD-PRACTICE-PRESENTATION-CONTRACTS \(auto-applied\)/i);
  assert.match(augmented, /Sprint 38 visual affordance authoring contract \(auto-applied\):/i);
  assert.match(augmented, /visual_affordance_schema_version/i);
  assert.match(augmented, /activities_visual_review/i);
  assert.equal(api.countSprint38VisualAffordanceAuthoringBlocks(augmented), 1);

  assert.match(augmented, /Every visual_affordances\[\] row requires affordance_id/i);
  assert.match(augmented, /generate rows must include:[\s\S]*allowed_claims[\s\S]*disallowed_claims/i);
  assert.match(augmented, /anti_spoiler/);
  assert.match(augmented, /canonical_discipline_note/);
  assert.match(augmented, /discipline_risk_level/);
  assert.match(augmented, /preferred_representation/);
  assert.match(augmented, /reasoning_supported/);
  assert.match(augmented, /representation_avoid/);
  assert.match(augmented, /requires_exact_data_match/);
  assert.match(augmented, /source_basis/);
  assert.match(augmented, /defer_reason \(defer only\)/i);
  assert.match(augmented, /skip_reason \(skip only\)/i);
  assert.match(
    augmented,
    /defer rows:[\s\S]*omit purpose, preferred_representation, visual_slot/i
  );
  assert.match(
    augmented,
    /skip rows:[\s\S]*omit purpose, preferred_representation, visual_slot/i
  );

  assert.match(augmented, /materials-entry/);
  assert.match(augmented, /annotated_system|causal_model|concept_map/);
  assert.match(augmented, /Never invent slots such as materials-after-feedback/i);
  // Invented slot must not appear inside the Sprint 38 allowed-slot enumeration.
  assert.doesNotMatch(
    augmented,
    /visual_slot \(activity-after-header \| materials-entry \| materials-card-grid-after \| materials-table-pair-between \| assessment-before-checkpoint \| knowledge-summary-after-content\).*materials-after-feedback/
  );

  assert.doesNotMatch(augmented, /LD-DESIGN-PAGE-PARTIAL-CONTRACT \(auto-applied\)/i);
  assert.doesNotMatch(augmented, /page_synthesis\.knowledge_summary is mandatory/i);
  assert.match(augmented, /Purpose-driven page_synthesis furniture/i);
  assert.match(augmented, /page_synthesis: \{\} or partial omissions are valid/i);
});

test("101E: Practice non-Design-Page steps do not receive Sprint 38 VA contract", () => {
  const { api } = boot();
  const gam = api.applyWorkflowStepRuntimePromptAugmentations(
    "Generate Practice activity materials.\n",
    {
      canonical_step_id: "step_generate_activity_materials",
      canonical_title: "Generate Activity Materials",
      title: "Generate Activity Materials"
    },
    practiceDesignPageWf(),
    {}
  );
  assert.doesNotMatch(gam, /Sprint 38 visual affordance authoring contract \(auto-applied\):/i);
  assert.match(gam, /LD-PRACTICE-PRESENTATION-CONTRACTS \(auto-applied\)/i);
});

test("101E: Interactive Design Page still receives Sprint 38 VA contract", () => {
  const { api } = boot();
  const augmented = api.applyWorkflowStepRuntimePromptAugmentations(
    "Assemble Interactive Design Page partial JSON.\n",
    designPageStep(),
    interactiveDesignPageWf(),
    {}
  );
  assert.match(augmented, /Sprint 38 visual affordance authoring contract \(auto-applied\):/i);
  assert.match(augmented, /LD-DESIGN-PAGE-PARTIAL-CONTRACT \(auto-applied\)/i);
  assert.doesNotMatch(augmented, /LD-PRACTICE-PRESENTATION-CONTRACTS \(auto-applied\)/i);
});

test("101E: generate / defer / skip structures validate under Sprint 38 + VPC", () => {
  const generate = validGenerateMath();
  const defer = validDefer();
  const skip = validSkip();

  assert.equal(s38.validateAffordanceEnvelope(generate, 0).length, 0);
  assert.equal(s38.validateAffordanceEnvelope(defer, 1).length, 0);
  assert.equal(s38.validateAffordanceEnvelope(skip, 2).length, 0);

  const page = practicePageEnvelope([generate, defer, skip]);
  const capture = vpc.validateVisualPlanningCaptureShape(page);
  assert.equal(capture.valid, true, JSON.stringify(capture.errors));
  const contract = vpc.validateVisualPlanningContract(page);
  assert.equal(contract.valid, true, JSON.stringify(contract.errors));

  assert.ok(s38.VISUAL_SLOTS.includes("materials-entry"));
  assert.ok(s38.REPRESENTATIONS.includes("annotated_system"));
  assert.equal(generate.anti_spoiler, true);
  assert.equal(generate.spoiler_boundary.hide_model_solution, true);
});

function c3PageSummarySkip(overrides) {
  return Object.assign(
    {
      affordance_id: "va-page-summary-skip-01",
      scope: "page",
      visual_decision: "skip",
      skip_reason: "spoiler_risk",
      rationale:
        "A completed concept map distinguishing multiplier necessity, sufficiency, global proof and counterexample evidence would reveal central judgements before learners have attempted them.",
      subject: "Logical relationships between multiplier conditions and extremum claims",
      context:
        "Visual brief: the page introduces feasibility, multiplier stationarity and justified optimality as separate questions. A completed synthesis diagram at the start would prematurely disclose the reasoning they are commissioned to construct.",
      evidence_anchors: [
        "page_synthesis.knowledge_summary",
        "page_synthesis.learning_purpose",
        "A1.learner_task",
        "A2.learner_task",
        "A3.learner_task"
      ]
    },
    overrides || {}
  );
}

test("101E C3: page-scope skip without region fails; region knowledge_summary validates", () => {
  // Live failure: visual_affordances[4] page skip omitted region.
  const missingRegion = c3PageSummarySkip();
  const missingErrors = s38.validateAffordanceEnvelope(missingRegion, 4);
  assert.ok(
    missingErrors.some((e) => /region is required for page scope/i.test(e)),
    missingErrors.join("; ")
  );

  const withRegion = c3PageSummarySkip({ region: "knowledge_summary" });
  assert.deepEqual(s38.validateAffordanceEnvelope(withRegion, 4), []);

  const pageMissing = practicePageEnvelope([validGenerateMath(), missingRegion], {
    page_synthesis: {
      overview: { body: "Optional practice hook.", format: "markdown" },
      knowledge_summary: {
        body: "Keep feasibility, stationarity and optimality separate.",
        format: "markdown"
      },
      learning_purpose: {
        body: "Judge what multiplier solutions prove.",
        format: "markdown"
      }
    }
  });
  const captureMissing = vpc.validateVisualPlanningCaptureShape(pageMissing);
  assert.equal(captureMissing.valid, false);
  assert.ok(
    (captureMissing.errors || []).some(
      (e) =>
        e.code === "VPC_AFFORDANCE_ROW_INVALID" ||
        /region is required for page scope/i.test(String(e.message || e))
    )
  );

  const pageOk = practicePageEnvelope([validGenerateMath(), withRegion], {
    page_synthesis: pageMissing.page_synthesis,
    editorial_opening_image: pageMissing.editorial_opening_image
  });
  const captureOk = vpc.validateVisualPlanningCaptureShape(pageOk);
  assert.equal(captureOk.valid, true, JSON.stringify(captureOk.errors));
});

test("101E: Design Page Sprint 38 prompt requires region on page-scope skip/defer", () => {
  const { api } = boot();
  const augmented = api.applyWorkflowStepRuntimePromptAugmentations(
    "Assemble Practice Design Page partial JSON.\n",
    designPageStep(),
    practiceDesignPageWf(),
    {}
  );
  assert.match(augmented, /page scope rows require region/i);
  assert.match(
    augmented,
    /Omitting region on a page-scoped skip\/defer\/generate row is invalid/i
  );
  assert.match(
    augmented,
    /skip rows:[\s\S]*region "knowledge_summary" \(page scope\)/i
  );
  assert.match(
    augmented,
    /Page Knowledge Summary example shape:[\s\S]*"region":"knowledge_summary"/i
  );
  assert.match(
    augmented,
    /Example page-scope Knowledge Summary skip[\s\S]*"region":"knowledge_summary"/i
  );

  const practiceBlock = practiceContracts.buildPracticePresentationContractBlock("design_page");
  assert.match(
    practiceBlock,
    /Page-scoped rows[\s\S]*region "knowledge_summary"/i
  );
});

test("101E: live-failure shapes fail capture and VPC; invented slot rejected", () => {
  const invalidSlot = {
    ...validGenerateMath(),
    visual_slot: "materials-after-feedback"
  };
  const missingId = { ...validGenerateMath() };
  delete missingId.affordance_id;
  const deferWithSlot = {
    ...validDefer(),
    preferred_representation: "annotated_system",
    visual_slot: "materials-entry"
  };

  const badPage = practicePageEnvelope([invalidSlot, missingId, deferWithSlot]);
  const capture = vpc.validateVisualPlanningCaptureShape(badPage);
  assert.equal(capture.valid, false);
  assert.ok(capture.errors.some((e) => e.code === "VPC_AFFORDANCE_ROW_INVALID"));

  const { api } = boot();
  const gate = api.validateDesignPagePartialPageCapture(badPage, practiceDesignPageWf());
  assert.equal(gate.ok, false);
  assert.ok(gate.errors.some((msg) => /visual_slot|affordance_id|preferred_representation/i.test(msg)));
});

test("101E: Practice pages are not treated as Interactive for editorial opening", () => {
  const page = practicePageEnvelope([validGenerateMath()]);
  assert.equal(editorial.isPracticePage(page), true);
  assert.equal(editorial.isInteractivePage(page), false);
  const brief = editorial.buildEditorialOpeningBrief(page);
  assert.ok(brief);
  assert.equal(brief.editorial_product, "practice");
});

test("101E: Graphics tab withholds jobs and counts 0 while VPC is invalid", () => {
  const invalid = {
    ...validGenerateMath(),
    visual_slot: "materials-after-feedback"
  };
  delete invalid.affordance_id;
  const page = practicePageEnvelope([invalid]);
  const ws = workspace.buildVisualJobsWorkspaceState(page);
  assert.equal(ws.contractResult.valid, false);
  assert.ok(
    (ws.contractResult.errors || []).some((e) => e.code === "VPC_AFFORDANCE_ROW_INVALID")
  );
  assert.equal(workspace.countAuthoringGraphicsJobs(ws), 0);
  assert.deepEqual(ws.compilerResult.briefs || [], []);
  const html = workspace.renderVisualJobsWorkspaceHtml(ws);
  assert.match(html, /Visual planning is invalid/i);
  assert.match(html, /Graphics jobs are withheld/i);
  assert.match(html, /VPC_AFFORDANCE_ROW_INVALID/);
  assert.doesNotMatch(html, /data-brief-select-id=/);
});

test("101E: valid Practice plan yields graphics jobs without Interactive KS mandate", () => {
  const page = practicePageEnvelope([validGenerateMath()]);
  const ws = workspace.buildVisualJobsWorkspaceState(page);
  assert.equal(ws.contractResult.valid, true, JSON.stringify(ws.contractResult.errors));
  assert.ok(workspace.countAuthoringGraphicsJobs(ws) >= 2);
  const editorialBriefs = (ws.compilerResult.briefs || []).filter(
    (b) => b && b.editorial_opening === true
  );
  assert.equal(editorialBriefs.length, 1);
  const html = workspace.renderVisualJobsWorkspaceHtml(ws);
  assert.doesNotMatch(html, /Visual planning is invalid/i);
  assert.match(html, /data-brief-select-id=/);
});

test("101E / 104M3: Practice Design Page requires editorial_opening_image generate and rejects skip/omission", () => {
  const { api } = boot();
  const skippedWithReason = practicePageEnvelope([], {
    editorial_opening_image: {
      decision: "skip",
      skip_reason: "Journey framing already provides orientation."
    }
  });
  const skipGate = api.validateDesignPagePartialPageCapture(skippedWithReason, practiceDesignPageWf());
  assert.equal(skipGate.ok, false);
  assert.ok(
    skipGate.errors.some((msg) => /editorial_opening_image\.decision must be "generate"/i.test(String(msg))),
    skipGate.errors.join("; ")
  );

  const omitted = practicePageEnvelope([]);
  delete omitted.editorial_opening_image;
  const omittedGate = api.validateDesignPagePartialPageCapture(omitted, practiceDesignPageWf());
  assert.equal(omittedGate.ok, false);
  assert.ok(
    omittedGate.errors.some((msg) => /editorial_opening_image is required/i.test(String(msg))),
    omittedGate.errors.join("; ")
  );

  const nonEmptyAlt = practicePageEnvelope([], {
    editorial_opening_image: {
      decision: "generate",
      subject: "Constrained optimisation practice atmosphere",
      context: "Decorative opening only; no solution spoilers.",
      caption_intent: "Atmosphere for practice.",
      alt_text: "Should be empty string",
      detailed_description: "A restrained scene suggesting equations without revealing answers."
    }
  });
  const altGate = api.validateDesignPagePartialPageCapture(nonEmptyAlt, practiceDesignPageWf());
  assert.equal(altGate.ok, false);
  assert.ok(
    altGate.errors.some((msg) => /editorial_opening_image\.alt_text must be ""/i.test(String(msg))),
    altGate.errors.join("; ")
  );

  const generated = practicePageEnvelope([]);
  const okGate = api.validateDesignPagePartialPageCapture(generated, practiceDesignPageWf());
  assert.equal(okGate.ok, true, (okGate.errors || []).join("; "));
});

test("C02 live Practice Design Page regression: supplied skip output and omitted editorial_opening_image are rejected; valid generate is accepted", () => {
  const { api } = boot();
  const c02SuppliedSkip = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "practice",
    page_kind: "practice",
    title: "Interpreting contrasting statistical relationships",
    page_synthesis: {
      knowledge_summary: {
        format: "markdown",
        body: "Pearson correlation measures the direction and strength of linear association between two quantitative variables. Its coefficient ranges from −1 to +1."
      }
    },
    visual_affordance_schema_version: "38.4",
    activities_visual_review: [
      {
        activity_id: "A1",
        activity_visual_value: {
          decision: "high",
          rationale: "Visual inspection of paired economic observations is central to both statistical interpretations; already fulfilled by exact-data scatterplots in A1-M1 and A1-M3."
        }
      }
    ],
    visual_affordances: [
      {
        affordance_id: "va-A1-statistical-evidence-01",
        scope: "activity",
        activity_id: "A1",
        visual_decision: "skip",
        skip_reason: "duplicate_existing_structure",
        rationale: "The existing scatterplots and accessible data tables provide the representations required for both interpretation tasks.",
        subject: "Paired economic observations and linear correlation",
        context: "Learners examine temperature and household energy expenditure observations, followed by advertising expenditure and sales revenue observations.",
        evidence_anchors: ["A1.learner_task", "A1.expected_output", "A1.materials.A1-M1", "A1.materials.A1-M3", "A1.materials.A1-M5"]
      },
      {
        affordance_id: "va-page-knowledge-summary-01",
        scope: "page",
        region: "knowledge_summary",
        visual_decision: "skip",
        skip_reason: "spoiler_risk",
        rationale: "A conceptual contrast diagram illustrating non-linear relationships and unusual observations would anticipate conclusions learners must derive.",
        subject: "Observed statistical patterns and correlation summaries",
        context: "The opening conceptual briefing establishes Pearson correlation as a measure of linear association without disclosing answers.",
        evidence_anchors: ["page_synthesis.knowledge_summary", "A1.learner_task", "A1.reasoning_orientation", "A1.materials.A1-M5"]
      }
    ],
    editorial_opening_image: {
      decision: "skip",
      skip_reason: "The resource follows established prior learning and moves directly into statistical interpretation. A contextual opening image would add no substantive reasoning support within the ten-minute practice episode."
    },
    assembly_state: {
      current_stage: "design_page",
      enriched_by: ["design_page"],
      calls_model: true
    }
  };

  // Supplied C02 with decision "skip" must be rejected
  const skipRes = api.validateDesignPagePartialPageCapture(c02SuppliedSkip, practiceDesignPageWf());
  assert.equal(skipRes.ok, false);
  assert.ok(
    skipRes.errors.some((e) => /editorial_opening_image\.decision must be "generate"/i.test(String(e))),
    skipRes.errors.join("; ")
  );

  // Omitting editorial_opening_image must also be rejected
  const c02Omitted = Object.assign({}, c02SuppliedSkip);
  delete c02Omitted.editorial_opening_image;
  const omitRes = api.validateDesignPagePartialPageCapture(c02Omitted, practiceDesignPageWf());
  assert.equal(omitRes.ok, false);
  assert.ok(
    omitRes.errors.some((e) => /editorial_opening_image is required/i.test(String(e))),
    omitRes.errors.join("; ")
  );

  // Valid generate editorial_opening_image is accepted while preserving skip visual_affordances and partial page_synthesis
  const c02Generate = Object.assign({}, c02SuppliedSkip, {
    editorial_opening_image: {
      decision: "generate",
      subject: "Seasonal household energy and small-shop retail environments",
      context: "A decorative, text-free opening illustration evoking ordinary household energy use across changing seasons and independent small-business retail life without showing charts, numbers, or statistical relationships.",
      caption_intent: "Atmospheric opening setting for contrasting economic relationships.",
      alt_text: "",
      detailed_description: "A calm, contemporary text-free editorial illustration in wide landscape format showing residential homes transitioning across crisp winter and warm summer light beside a quiet row of independent small shops. No numbers, charts, scatterplots, labels, signs, or overlays appear anywhere in the scene."
    }
  });
  const okRes = api.validateDesignPagePartialPageCapture(c02Generate, practiceDesignPageWf());
  assert.equal(okRes.ok, true, (okRes.errors || []).join("; "));
});

test("101E / 104M3: Practice Design Page prompt requires editorial_opening_image generate while keeping page_synthesis optional", () => {
  const { api } = boot();
  const augmented = api.applyWorkflowStepRuntimePromptAugmentations(
    "Assemble Practice Design Page partial JSON.\n",
    designPageStep(),
    practiceDesignPageWf(),
    {}
  );
  assert.match(augmented, /LD-PRACTICE-PRESENTATION-CONTRACTS \(auto-applied\)/i);
  assert.match(augmented, /editorial_opening_image: REQUIRED/i);
  assert.match(augmented, /Do not use decision "skip"/i);
  assert.match(augmented, /Purpose-driven page_synthesis furniture: every page_synthesis element/i);
  assert.doesNotMatch(augmented, /editorial_opening_image: optional and purpose-driven/i);

  const block = practiceContracts.buildPracticePresentationContractBlock("design_page");
  assert.match(block, /editorial_opening_image: REQUIRED/i);
  assert.doesNotMatch(block, /editorial_opening_image: optional and purpose-driven/i);
  const shape = practiceContracts.buildCanonicalPracticeDesignPageShapeSnippet();
  assert.match(shape, /"page_synthesis": \{\}/);
  assert.match(shape, /"editorial_opening_image": \{ "decision": "generate"/);

  const wf = Object.assign({ id: "wf-practice-editorial-copy", steps: [designPageStep()] }, practiceDesignPageWf());
  wf.steps[0] = Object.assign({}, designPageStep(), {
    id: "dp_step",
    outputName: "page"
  });
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const instr = api.buildWorkflowStepInstructions(wf.steps[0], 0, null);
  assert.match(
    instr,
    /Mandatory editorial_opening_image \(Practice\): required at page root/i
  );
  assert.match(instr, /Always emit decision "generate"/i);
  assert.match(instr, /Do not use decision "skip" and do not omit editorial_opening_image/i);
  assert.match(instr, /Purpose-driven page_synthesis \(Practice\)/i);
  assert.doesNotMatch(instr, /Purpose-driven editorial_opening_image \(Practice\): optional/i);
});
