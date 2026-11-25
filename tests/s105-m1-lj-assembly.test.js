"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const ljAssemble = require("../lib/learning-journey-assemble.js");
const ljDesignPage = require("../lib/learning-journey-design-page.js");
const ljSharedSource = require("../lib/learning-journey-shared-source.js");
const ljUnifiedShell = require("../lib/learning-journey-unified-shell.js");
const ljWorkload = require("../lib/learning-journey-workload-feasibility-adapter.js");
const commissionIntake = require("../lib/first-class-commission-intake.js");
const workflowFamily = require("../lib/first-class-workflow-family.js");
const vnextAssemble = require("../lib/page-vnext-assemble.js");
const loBind = require("../lib/commission-native-lo-bind.js");

function makeComponentLoBlock(statement, concepts) {
  return [
    "<<<COMPONENT_LEARNING_OUTCOMES_BEGIN>>>",
    JSON.stringify(
      {
        learning_outcomes: [
          {
            statement: statement,
            related_concepts: concepts || ["causation", "correlation"],
            cognitive_level: "analyse",
            notes: "Component-scoped outcome."
          }
        ],
        learner_level: "introductory undergraduate",
        scope: "single commissioned experience",
        alignment_notes: "Advances journey outcomes without repeating settled exposition."
      },
      null,
      2
    ),
    "<<<COMPONENT_LEARNING_OUTCOMES_END>>>"
  ].join("\n");
}

function makeSamplePartials(overrides) {
  const o = overrides || {};
  const sharedCorpus =
    "Illustrative fictional dataset (Northshore Regional Indicators, synthetic for teaching): " +
    "10 districts recorded monthly bus ridership index and retail footfall index across 2024. " +
    "District A: ridership 102, footfall 110. District B: ridership 118, footfall 124. " +
    "Progressive disclosure: c1 introduces Districts A-E; c2 reveals seasonal holiday tourism confounders; c3 asks for an independent causal evaluation.";

  const stage1 = {
    artifact_type: "learning_journey_stage",
    schema_version: "1.0.0",
    stage: "learning_requirements",
    journey_allocated_minutes: 60,
    learning_outcomes: {
      learning_outcomes: [
        {
          statement: "Distinguish observed correlation from supported causal claims in regional economic data.",
          related_concepts: ["correlation", "causation"],
          cognitive_level: "understand",
          notes: "Foundation distinction."
        },
        {
          statement: "Evaluate competing causal explanations by identifying plausible confounding factors.",
          related_concepts: ["confounding", "alternative explanations"],
          cognitive_level: "evaluate",
          notes: "Applied judgement."
        }
      ],
      learner_level: "introductory undergraduate",
      scope: "60-minute self-directed Learning Journey",
      alignment_notes: "Proportionate to 60 minutes total study time."
    },
    learner_profile: "First-year economics students familiar with reading simple tables and scatterplots.",
    purpose: "Build disciplined scepticism and evidence-based reasoning when interpreting economic claims.",
    body_of_knowledge: [
      "Correlation versus causation",
      "Confounding variables and reverse causality",
      "Evaluating competing explanations against data"
    ],
    constraints_and_tradeoffs: "60 minutes total; focuses on two core conceptual moves rather than formal econometrics.",
    journal_orientation: "Lightweight Journal worthwhile for developmental visibility across initial claim and final evaluation."
  };

  const stage2 = {
    artifact_type: "learning_journey_stage",
    schema_version: "1.0.0",
    stage: "learning_progression",
    journey_structure: {
      mode: "single",
      rationale: "60 minutes forms one cohesive developmental arc from conceptual distinction to independent evaluation."
    },
    developmental_phases: [
      {
        phase_id: "P1",
        title: "Establish the correlation-causation distinction",
        purpose: "Clarify why co-movement alone cannot establish a causal link.",
        indicative_minutes: 20,
        scaffolding_and_evidence: "Structured explanation with worked contrast; brief comprehension check.",
        dependencies: "Builds on basic chart literacy."
      },
      {
        phase_id: "P2",
        title: "Diagnose confounders and evaluate competing explanations",
        purpose: "Move from guided confounder diagnosis to independent causal evaluation.",
        indicative_minutes: 40,
        scaffolding_and_evidence: "Guided practice fading to independent constructed judgement with diagnostic criteria.",
        dependencies: ["P1"]
      }
    ],
    developmental_arc: "Learners first anchor the core conceptual distinction, then test competing explanations on shared regional data, and finally defend an independent judgement.",
    journal_note: "Developmental visibility across c2 diagnosis and c3 independent evaluation."
  };

  const stage3 = {
    artifact_type: "learning_journey_stage",
    schema_version: "1.0.0",
    stage: "learning_elements",
    elements: [
      {
        element_id: "E1",
        phase_id: "P1",
        title: "Why correlation does not prove causation",
        educational_job: "Explain co-movement, confounding, and reverse causality using concise economic contrasts.",
        knowledge_focus: ["correlation", "confounding", "reverse causality"],
        indicative_minutes: 20,
        scaffolding_and_feedback: "High explanatory support with brief self-check.",
        dependencies: [],
        journal_producer_candidate: false
      },
      {
        element_id: "E2",
        phase_id: "P2",
        title: "Testing competing explanations on Northshore data",
        educational_job: "Practise identifying confounders and testing two rival causal stories on shared district data.",
        knowledge_focus: ["confounding", "rival hypotheses"],
        indicative_minutes: 20,
        scaffolding_and_feedback: "Moderate scaffolding; targeted feedback on confounder identification.",
        dependencies: ["E1"],
        journal_producer_candidate: true
      },
      {
        element_id: "E3",
        phase_id: "P2",
        title: "Independent evaluation of a policy claim",
        educational_job: "Produce a concise written evaluation judging whether the data justify a causal policy claim.",
        knowledge_focus: ["evidence evaluation", "causal restraint"],
        indicative_minutes: 20,
        scaffolding_and_feedback: "Low scaffolding; interpretable rubric feedback.",
        dependencies: ["E1", "E2"],
        journal_producer_candidate: true
      }
    ],
    boundary_notes: "E2 and E3 split guided practice from independent evaluation so scaffolding fades cleanly."
  };

  const stage4 = {
    artifact_type: "learning_journey_stage",
    schema_version: "1.0.0",
    stage: "learning_commissions",
    shared_authoritative_material: {
      status: "generated",
      content: sharedCorpus
    },
    commissions: [
      {
        commission_id: "c1",
        section_id: "exp_1",
        order: 1,
        title: "Why Co-Movement Is Not Proof",
        product_id: "expository",
        status: "supported",
        allocated_minutes: 20,
        specification_text:
          "Explain correlation vs causation, confounding, and reverse causality using Northshore Districts A-E as an introductory anchor.\n\n" +
          makeComponentLoBlock(
            "Explain why observed correlation between economic indicators does not by itself establish causation.",
            ["correlation", "causation", "confounding"]
          ),
        journey_context_text:
          "Established scenario facts: Northshore Regional Indicators synthetic dataset (Districts A-E introduced here). First experience in the journey.",
        dependencies: "",
        element_ids: ["E1"],
        relevant_journey_outcome_numbers: [1]
      },
      {
        commission_id: "c2",
        section_id: "exp_2",
        order: 2,
        title: "Spotting Confounders in Northshore",
        product_id: "practice",
        status: "supported",
        allocated_minutes: 20,
        specification_text:
          "Assume c1 settled the basic correlation-causation distinction. Have learners diagnose holiday tourism confounders in Northshore data and record a short provisional diagnosis (elicitation_id: E1).\n\n" +
          makeComponentLoBlock(
            "Diagnose plausible confounding variables in a bivariate regional economic dataset.",
            ["confounding", "alternative explanations"]
          ),
        journey_context_text:
          "Established scenario facts: Preserve Northshore Regional Indicators (Districts A-E from c1) and reveal seasonal holiday tourism confounders. Preceding activity: In c1 learners read structured exposition distinguishing correlation from causation. Bring-forward: Apply the distinction established in c1 when proposing a rival explanation.",
        dependencies: "c1",
        element_ids: ["E2"]
      },
      {
        commission_id: "c3",
        section_id: "exp_3",
        order: 3,
        title: "Evaluating a Transport Policy Claim",
        product_id: "assessment_pack",
        status: "supported",
        allocated_minutes: 20,
        specification_text:
          "Elicit an independent written causal evaluation (elicitation_id: E1) judging whether Northshore ridership data justify expanding bus subsidies.\n\n" +
          makeComponentLoBlock(
            "Evaluate a causal economic policy claim by weighing evidence against plausible confounders.",
            ["causation", "confounding", "evidence evaluation"]
          ),
        journey_context_text:
          "Established scenario facts: Preserve Northshore Regional Indicators and the seasonal tourism confounder from c1-c2. Preceding activities: In c1 learners established core causal distinctions; in c2 learners diagnosed confounders and drafted a provisional diagnosis (c2.E1). Bring-forward: Revisit your provisional diagnosis from c2.E1 to test and defend your independent policy evaluation.",
        dependencies: "c1, c2",
        element_ids: ["E3"],
        relevant_journey_outcome_numbers: [1, 2]
      }
    ],
    continuity: "Northshore Regional Indicators runs progressively across c1 exposition, c2 confounder practice (producing c2.E1), and c3 independent policy evaluation (producing c3.E1).",
    journal: {
      enabled: true,
      decision_basis: "both — functional continuity (c2.E1 -> c3) and developmental visibility across diagnosis and evaluation",
      entries: [
        {
          entry_id: "j1",
          order: 1,
          title: "Provisional Confounder Diagnosis",
          artefact_id: "c2.E1"
        },
        {
          entry_id: "j2",
          order: 2,
          title: "Independent Policy Evaluation",
          artefact_id: "c3.E1"
        }
      ]
    },
    feasibility_note: "60 minutes cleanly accommodates exposition (20m), focused confounder practice (20m), and one constructed evaluation (20m)."
  };

  const stage5 = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "learning_journey",
    title: "Making Sense of Economic Claims",
    editorial_opening_image: {
      decision: "generate",
      subject: "Commuter buses moving past a busy coastal high street at morning light",
      context: "Editorial opening scene for a regional economics inquiry",
      caption_intent: "Evoke everyday regional transport and retail activity without charts or text",
      alt_text: "",
      detailed_description: "Clean documentary illustration of a coastal town high street with commuter buses and pedestrian footfall, warm daylight, no text overlays or signs."
    },
    sections: [
      {
        section_id: "journey_intro",
        title: "Why Evidence Needs Careful Reading",
        order: 1,
        exposition: "Headline claims often treat two rising numbers as proof of cause and effect. Across three connected experiences you will sharpen how you separate co-movement from credible causal evidence."
      },
      {
        section_id: "exp_1",
        title: "Why Co-Movement Is Not Proof",
        order: 2,
        exposition: "Start by unpacking why correlated economic indicators can mislead and what confounding looks like in practice."
      },
      {
        section_id: "exp_2",
        title: "Spotting Confounders in Northshore",
        order: 3,
        exposition: "Put the distinction to work on regional transport and retail data, diagnosing rival explanations."
      },
      {
        section_id: "exp_3",
        title: "Evaluating a Transport Policy Claim",
        order: 4,
        exposition: "Bring your earlier diagnosis forward to deliver a concise, evidence-grounded policy evaluation."
      }
    ],
    learning_journey: {
      design_intent: "Moves learners from conceptual clarity (c1) through guided confounder diagnosis (c2) to independent policy evaluation (c3) within a proportionate 60-minute arc.",
      journal: {
        title: "Economic Reasoning Journal",
        entries: [
          {
            entry_id: "j1",
            framing: "Your provisional confounder diagnosis from Northshore practice."
          },
          {
            entry_id: "j2",
            framing: "Your independent causal evaluation of the transport subsidy claim."
          }
        ]
      }
    },
    assembly_state: {
      current_stage: "design_page",
      enriched_by: ["design_page"],
      calls_model: true
    }
  };

  return Object.assign(
    {
      learning_requirements: stage1,
      learning_progression: stage2,
      learning_elements: stage3,
      learning_commissions: stage4,
      design_page: stage5
    },
    o
  );
}

test("S105 M1: complete 5-stage progressive assembly produces immutable final LJ Design Page with zero intermediate leakage", () => {
  const partials = makeSamplePartials();
  const res = ljAssemble.assembleLearningJourneyPageFromPartials(partials, {
    parentAuthoritativeMinutes: 60
  });

  assert.equal(res.ok, true, "Assembly errors: " + JSON.stringify(res.errors));
  assert.ok(res.page);
  const page = res.page;

  // Canonical immutable top-level contract
  const topKeys = Object.keys(page).sort();
  assert.deepEqual(topKeys, [
    "activities",
    "artifact_type",
    "assembly_state",
    "commissions",
    "editorial_opening_image",
    "learning_journey",
    "product_id",
    "schema_version",
    "sections",
    "shared_authoritative_material",
    "title"
  ]);
  assert.equal(page.artifact_type, "page");
  assert.equal(page.schema_version, "2.0.0");
  assert.equal(page.product_id, "learning_journey");
  assert.deepEqual(page.activities, []);
  assert.equal(page.title, "Making Sense of Economic Claims");
  assert.equal(page.learning_journey.allocated_minutes, 60);
  assert.equal(page.learning_journey.design_intent.length > 0, true);
  assert.equal(page.learning_journey.continuity.length > 0, true);
  assert.deepEqual(Object.keys(page.learning_journey).sort(), [
    "allocated_minutes",
    "continuity",
    "design_intent",
    "journal"
  ]);

  // Journal merges Stage 4 structure + Stage 5 framing, stripping decision_basis
  assert.deepEqual(Object.keys(page.learning_journey.journal).sort(), [
    "enabled",
    "entries",
    "title"
  ]);
  assert.equal(page.learning_journey.journal.enabled, true);
  assert.equal(page.learning_journey.journal.title, "Economic Reasoning Journal");
  assert.equal(page.learning_journey.journal.entries.length, 2);
  assert.equal(page.learning_journey.journal.entries[0].artefact_id, "c2.E1");
  assert.equal(page.learning_journey.journal.entries[1].artefact_id, "c3.E1");
  assert.equal(
    page.learning_journey.journal.entries[0].framing,
    "Your provisional confounder diagnosis from Northshore practice."
  );

  // Zero intermediate-only keys on commissions
  page.commissions.forEach((c) => {
    assert.deepEqual(Object.keys(c).sort(), [
      "allocated_minutes",
      "commission_id",
      "dependencies",
      "journey_context_text",
      "order",
      "product_id",
      "section_id",
      "specification_text",
      "status",
      "title"
    ]);
    assert.equal("element_ids" in c, false);
    assert.equal("relevant_journey_outcome_numbers" in c, false);
  });

  // Deterministic Stage 1 JOURNEY_LEARNING_OUTCOMES injection (subset on c1, full on c2 & c3)
  const c1JourneyLo = loBind.extractJourneyLearningOutcomes(page.commissions[0].journey_context_text);
  assert.equal(c1JourneyLo.ok, true);
  assert.equal(c1JourneyLo.value.learning_outcomes.length, 1);
  assert.match(c1JourneyLo.value.learning_outcomes[0].statement, /Distinguish observed correlation/);

  const c2JourneyLo = loBind.extractJourneyLearningOutcomes(page.commissions[1].journey_context_text);
  assert.equal(c2JourneyLo.ok, true);
  assert.equal(c2JourneyLo.value.learning_outcomes.length, 2);

  // Immutable final LJ Design Page validator passes verbatim
  const dpGate = ljDesignPage.validateLearningJourneyDesignPageForCapture(page, {
    parentAuthoritativeMinutes: 60,
    requireStructuredDurations: true
  });
  assert.equal(dpGate.ok, true, "Final DP validation errors: " + JSON.stringify(dpGate.errors));

  // assembly_state records all 5 stages
  assert.deepEqual(page.assembly_state, {
    current_stage: "design_page",
    enriched_by: [
      "learning_requirements",
      "learning_progression",
      "learning_elements",
      "learning_commissions",
      "design_page"
    ],
    calls_model: true
  });
});

test("S105 M1: all five stages are mandatory — omitting Stage 2 or Stage 3 fails closed", () => {
  for (const omitted of ljAssemble.STAGE_ORDER) {
    const partials = makeSamplePartials();
    delete partials[omitted];
    const res = ljAssemble.assembleLearningJourneyPageFromPartials(partials, {
      parentAuthoritativeMinutes: 60
    });
    assert.equal(res.ok, false, "Expected failure when omitting " + omitted);
    assert.ok(
      res.errors.some((e) => e === "missing_required_stage:" + omitted),
      "Expected missing_required_stage:" + omitted + ", got " + JSON.stringify(res.errors)
    );
  }
});

test("S105 M1: deterministic transport of brief-provided authoritative source material & conflict rejection", () => {
  const briefSource =
    "Authoritative brief-supplied regional case file: Midlands Water Authority 2024 Leakage Report " +
    "(District 1: 14% loss; District 2: 9% loss; District 3: 18% loss; capital budget £4.2M).";

  // Happy path: Stage 4 declares status "provided" with content omitted; assembler injects brief source verbatim
  const partials = makeSamplePartials();
  partials.learning_commissions.shared_authoritative_material = { status: "provided" };
  const okRes = ljAssemble.assembleLearningJourneyPageFromPartials(partials, {
    parentAuthoritativeMinutes: 60,
    briefProvidedSourceContext: briefSource
  });
  assert.equal(okRes.ok, true, "Errors: " + JSON.stringify(okRes.errors));
  assert.deepEqual(okRes.page.shared_authoritative_material, {
    status: "provided",
    content: briefSource
  });

  // Fail closed: Stage 4 attempts status "generated" when brief supplied source
  const genOverride = makeSamplePartials();
  const genFail = ljAssemble.assembleLearningJourneyPageFromPartials(genOverride, {
    parentAuthoritativeMinutes: 60,
    briefProvidedSourceContext: briefSource
  });
  assert.equal(genFail.ok, false);
  assert.ok(genFail.errors.some((e) => /brief_provided_source_must_be_preserved_as_provided/.test(e)));

  // Fail closed: Stage 4 emits conflicting content under status "provided"
  const conflictPartials = makeSamplePartials();
  conflictPartials.learning_commissions.shared_authoritative_material = {
    status: "provided",
    content: "Altered synthetic corpus that does not match the brief source."
  };
  const conflictFail = ljAssemble.assembleLearningJourneyPageFromPartials(conflictPartials, {
    parentAuthoritativeMinutes: 60,
    briefProvidedSourceContext: briefSource
  });
  assert.equal(conflictFail.ok, false);
  assert.ok(conflictFail.errors.some((e) => /shared_material_conflicts_with_brief_source/.test(e)));

  // Fail closed: Stage 4 claims status "provided" when no brief source exists
  const noBriefPartials = makeSamplePartials();
  noBriefPartials.learning_commissions.shared_authoritative_material = { status: "provided" };
  const noBriefFail = ljAssemble.assembleLearningJourneyPageFromPartials(noBriefPartials, {
    parentAuthoritativeMinutes: 60
  });
  assert.equal(noBriefFail.ok, false);
  assert.ok(noBriefFail.errors.some((e) => /shared_material_provided_without_brief_source/.test(e)));
});

test("S105 M1: single-stage ownership & cross-stage integrity enforcement across Stages 1-5", () => {
  // Stage 1 rejects downstream fields
  const s1Bad = makeSamplePartials();
  s1Bad.learning_requirements.commissions = [];
  let res = ljAssemble.assembleLearningJourneyPageFromPartials(s1Bad, { parentAuthoritativeMinutes: 60 });
  assert.equal(res.ok, false);
  assert.ok(res.errors.some((e) => /disallowed_field:commissions/.test(e)));

  // Stage 2 rejects re-emitted Stage 1 learning_outcomes and enforces phase-minute sum
  const s2BadField = makeSamplePartials();
  s2BadField.learning_progression.learning_outcomes = s2BadField.learning_requirements.learning_outcomes;
  res = ljAssemble.assembleLearningJourneyPageFromPartials(s2BadField, { parentAuthoritativeMinutes: 60 });
  assert.equal(res.ok, false);
  assert.ok(res.errors.some((e) => /disallowed_field:learning_outcomes/.test(e)));

  const s2BadMinutes = makeSamplePartials();
  s2BadMinutes.learning_progression.developmental_phases[1].indicative_minutes = 35;
  res = ljAssemble.assembleLearningJourneyPageFromPartials(s2BadMinutes, { parentAuthoritativeMinutes: 60 });
  assert.equal(res.ok, false);
  assert.ok(res.errors.some((e) => /progression_phase_minutes_mismatch/.test(e)));

  // Stage 3 rejects unknown phase_id and per-phase minute mismatch
  const s3BadPhase = makeSamplePartials();
  s3BadPhase.learning_elements.elements[2].phase_id = "P99";
  res = ljAssemble.assembleLearningJourneyPageFromPartials(s3BadPhase, { parentAuthoritativeMinutes: 60 });
  assert.equal(res.ok, false);
  assert.ok(res.errors.some((e) => /unknown_in_progression:P99/.test(e)));

  // Stage 4 rejects uncovered Stage 3 element, interactive product, and conflicting Stage 1 outcomes
  const s4Uncovered = makeSamplePartials();
  s4Uncovered.learning_commissions.commissions[2].element_ids = ["E2"];
  res = ljAssemble.assembleLearningJourneyPageFromPartials(s4Uncovered, { parentAuthoritativeMinutes: 60 });
  assert.equal(res.ok, false);
  assert.ok(res.errors.some((e) => /learning_element_uncovered_by_commissions:E3/.test(e)));

  const s4Interactive = makeSamplePartials();
  s4Interactive.learning_commissions.commissions[1].product_id = "interactive";
  res = ljAssemble.assembleLearningJourneyPageFromPartials(s4Interactive, { parentAuthoritativeMinutes: 60 });
  assert.equal(res.ok, false);
  assert.ok(res.errors.some((e) => /interactive_forbidden_for_new_learning_journey/.test(e)));

  const s4BadContext = makeSamplePartials();
  s4BadContext.learning_commissions.commissions[1].journey_context_text = "Continue the previous scenario.";
  res = ljAssemble.assembleLearningJourneyPageFromPartials(s4BadContext, { parentAuthoritativeMinutes: 60 });
  assert.equal(res.ok, false);
  assert.ok(res.errors.some((e) => /generic_continuation/.test(e)));

  const s4OutcomeConflict = makeSamplePartials();
  s4OutcomeConflict.learning_commissions.commissions[0].journey_context_text +=
    "\n<<<JOURNEY_LEARNING_OUTCOMES_BEGIN>>>\n" +
    JSON.stringify({ learning_outcomes: [{ statement: "Invented conflicting outcome." }] }) +
    "\n<<<JOURNEY_LEARNING_OUTCOMES_END>>>";
  res = ljAssemble.assembleLearningJourneyPageFromPartials(s4OutcomeConflict, { parentAuthoritativeMinutes: 60 });
  assert.equal(res.ok, false);
  assert.ok(res.errors.some((e) => /journey_outcomes_conflict_with_stage1/.test(e)));

  // Stage 5 rejects commissions[], allocated_minutes, page_synthesis, altered journal artefact_id, or section order mismatch
  const s5Alloc = makeSamplePartials();
  s5Alloc.design_page.learning_journey.allocated_minutes = 60;
  res = ljAssemble.assembleLearningJourneyPageFromPartials(s5Alloc, { parentAuthoritativeMinutes: 60 });
  assert.equal(res.ok, false);
  assert.ok(res.errors.some((e) => /disallowed_field:allocated_minutes/.test(e)));

  const s5JournalHijack = makeSamplePartials();
  s5JournalHijack.design_page.learning_journey.journal.entries[0].artefact_id = "c1.E1";
  res = ljAssemble.assembleLearningJourneyPageFromPartials(s5JournalHijack, { parentAuthoritativeMinutes: 60 });
  assert.equal(res.ok, false);
  assert.ok(res.errors.some((e) => /disallowed_field:artefact_id/.test(e)));

  const s5SectionMismatch = makeSamplePartials();
  s5SectionMismatch.design_page.sections[1].section_id = "exp_2";
  s5SectionMismatch.design_page.sections[2].section_id = "exp_1";
  res = ljAssemble.assembleLearningJourneyPageFromPartials(s5SectionMismatch, { parentAuthoritativeMinutes: 60 });
  assert.equal(res.ok, false);
  assert.ok(res.errors.some((e) => /design_page_section_order_mismatch/.test(e)));
});

test("S105 M1: strict legacy separation — progressive workflows reject monolithic capture bypass; legacy workflows remain supported", () => {
  const built = workflowFamily.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "learning_journey",
    focus: "Making Sense of Economic Claims",
    audience: "First-year economics students",
    learningTime: "60 minutes",
    duration: "1 week",
    sourceContext: "Brief-provided regional dataset context for testing."
  });
  assert.equal(built.ok, true);
  assert.equal(built.deliverySeed.duration_contract_version, "s104_m1");
  assert.equal(built.deliverySeed.progressive_capture_version, "s105_v1");
  assert.equal(built.deliverySeed.source_context_origin, "brief_provided");
  assert.deepEqual(built.outputSpec, {
    partialPageOutputs: true,
    progressiveCaptureVersion: "s105_v1"
  });

  const progressiveWf = {
    id: "wf-prog-1",
    identity: built.identity,
    outputSpec: built.outputSpec,
    deliverySeed: built.deliverySeed,
    steps: built.steps
  };
  assert.equal(ljAssemble.isProgressiveLearningJourneyWorkflow(progressiveWf), true);
  assert.equal(ljAssemble.classifyLearningJourneyWorkflowMode(progressiveWf), "progressive");

  // Build a valid monolithic page (using assembled output as a realistic monolithic fixture)
  const assembled = ljAssemble.assembleLearningJourneyPageFromPartials(makeSamplePartials(), {
    parentAuthoritativeMinutes: 60
  });
  assert.equal(assembled.ok, true);
  const monolithicPage = assembled.page;

  // Progressive workflow MUST REJECT monolithic capture directly or inside { design_page }
  const directBypass = ljAssemble.resolveLearningJourneyPageByMode(progressiveWf, monolithicPage, {
    parentAuthoritativeMinutes: 60
  });
  assert.equal(directBypass.ok, false);
  assert.equal(directBypass.mode, "progressive");
  assert.ok(directBypass.errors.includes("monolithic_capture_rejected_for_progressive_workflow"));

  const step5Bypass = ljAssemble.resolveLearningJourneyPageByMode(
    progressiveWf,
    makeSamplePartials({ design_page: monolithicPage }),
    { parentAuthoritativeMinutes: 60 }
  );
  assert.equal(step5Bypass.ok, false);
  assert.ok(step5Bypass.errors.includes("monolithic_capture_rejected_for_progressive_workflow"));

  // Legacy pre-105 workflow (no progressive flag) continues working with monolithic Step 5 capture
  const legacyWf = {
    id: "wf-legacy-1",
    identity: { product: "learning_journey", ldCreateOutputType: "learning_journey" },
    deliverySeed: { product: "learning_journey", duration_contract_version: "s104_m1" },
    steps: built.steps
  };
  assert.equal(ljAssemble.isProgressiveLearningJourneyWorkflow(legacyWf), false);
  assert.equal(ljAssemble.classifyLearningJourneyWorkflowMode(legacyWf), "legacy_monolithic");

  const legacyRes = ljAssemble.resolveLearningJourneyPageByMode(legacyWf, monolithicPage, {
    parentAuthoritativeMinutes: 60
  });
  assert.equal(legacyRes.ok, true, "Legacy errors: " + JSON.stringify(legacyRes.errors));
  assert.equal(legacyRes.mode, "legacy_monolithic");
  assert.equal(legacyRes.page.title, monolithicPage.title);
});

test("S105 M1: lib/page-vnext-assemble.js delegates LJ progressive bundles and validates assembled LJ pages", () => {
  const partials = makeSamplePartials();
  const viaVnext = vnextAssemble.assembleVNextPageFromPartials(partials, {
    parentAuthoritativeMinutes: 60
  });
  assert.equal(viaVnext.ok, true);
  assert.equal(viaVnext.mode, "learning_journey");
  assert.equal(viaVnext.page.product_id, "learning_journey");

  const renderCheck = vnextAssemble.validateAssembledPageForRender(viaVnext.page);
  assert.equal(renderCheck.ok, true, "Render check errors: " + JSON.stringify(renderCheck.errors));

  // assembleVNextPageFromWorkflowCaptures also works with standard LEARNING_JOURNEY_STEPS
  const built = workflowFamily.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "learning_journey",
    focus: "Making Sense of Economic Claims",
    learningTime: "60 minutes"
  });
  const wfSteps = built.steps.map((s, idx) => Object.assign({ id: "s" + (idx + 1) }, s));
  const captureByStepId = {
    s1: JSON.stringify(partials.learning_requirements),
    s2: JSON.stringify(partials.learning_progression),
    s3: JSON.stringify(partials.learning_elements),
    s4: JSON.stringify(partials.learning_commissions),
    s5: JSON.stringify(partials.design_page)
  };
  const viaWf = vnextAssemble.assembleVNextPageFromWorkflowCaptures(
    { steps: wfSteps },
    { captures: captureByStepId, parentAuthoritativeMinutes: 60 }
  );
  assert.equal(viaWf.ok, true);
  assert.equal(viaWf.mode, "learning_journey");
  assert.deepEqual(viaWf.page, viaVnext.page);
});

test("S105 M1: constituent journey structure and disabled journal contracts enforce cross-stage integrity", () => {
  const partials = makeSamplePartials();
  partials.learning_progression.journey_structure = {
    mode: "constituent",
    rationale: "Two distinct developmental arcs warrant constituent structure.",
    constituent_journeys: [
      {
        constituent_id: "CJ1",
        title: "Foundations",
        purpose: "Establish the core distinction.",
        indicative_minutes: 20
      },
      {
        constituent_id: "CJ2",
        title: "Application and Evaluation",
        purpose: "Apply and independently evaluate.",
        indicative_minutes: 40
      }
    ]
  };
  partials.learning_progression.developmental_phases[0].constituent_id = "CJ1";
  partials.learning_progression.developmental_phases[1].constituent_id = "CJ2";
  partials.learning_commissions.journal = {
    enabled: false,
    decision_basis: "not_justified — short journey without cumulative artefact arc"
  };
  delete partials.design_page.learning_journey.journal;

  const okRes = ljAssemble.assembleLearningJourneyPageFromPartials(partials, {
    parentAuthoritativeMinutes: 60
  });
  assert.equal(okRes.ok, true, "Constituent + disabled journal errors: " + JSON.stringify(okRes.errors));
  assert.equal(okRes.page.learning_journey.journal.enabled, false);
  assert.deepEqual(okRes.page.learning_journey.journal.entries, []);

  // Stage 5 trying to supply journal framing when Stage 4 disabled journal fails closed
  const badJournalDp = makeSamplePartials();
  badJournalDp.learning_commissions.journal = { enabled: false };
  const badRes = ljAssemble.assembleLearningJourneyPageFromPartials(badJournalDp, {
    parentAuthoritativeMinutes: 60
  });
  assert.equal(badRes.ok, false);
  assert.ok(badRes.errors.some((e) => /design_page_journal_forbidden_when_disabled/.test(e)));
});

test("S105 M1: assembled LJ Design Page is 100% compatible with unchanged downstream consumers", () => {
  const res = ljAssemble.assembleLearningJourneyPageFromPartials(makeSamplePartials(), {
    parentAuthoritativeMinutes: 60
  });
  assert.equal(res.ok, true);
  const page = res.page;

  // 1. Shared source extractor
  const sharedRes = ljSharedSource.extractAndSanitizeSharedAuthoritativeMaterialFromPage(page);
  assert.equal(sharedRes.ok, true);
  assert.equal(sharedRes.kind, "material");
  assert.equal(sharedRes.status, "generated");

  // 2. Commission intake across Expository, Practice, and Assessment Pack
  for (const commission of page.commissions) {
    const intake = commissionIntake.intakeCommission({
      productId: commission.product_id,
      focus: commission.title,
      specificationText: commission.specification_text,
      journeyContextText: commission.journey_context_text,
      dependencies: commission.dependencies,
      sourceContext: sharedRes.content,
      sourceJourneyWorkflowId: "wf-lj-s105-m1",
      sourceCommissionId: commission.commission_id,
      allocatedMinutes: commission.allocated_minutes,
      journeyAllocatedMinutes: page.learning_journey.allocated_minutes
    });
    assert.equal(intake.ok, true, "Intake failed for " + commission.commission_id + ": " + JSON.stringify(intake));
    assert.equal(intake.createSeed.commissionedDurationMinutes, 20);
    assert.equal(intake.createSeed.commissionNativeBound, true);
    assert.ok(intake.createSeed.commissionedLearningOutcomes);
  }

  // 3. Unified shell builder (home + experience list + Learning Journal)
  const shell = ljUnifiedShell.buildLearningJourneyUnifiedShellHtml(
    page,
    page.commissions.map((c) => ({
      commissionId: c.commission_id,
      title: c.title,
      productId: c.product_id,
      html: "<h1>" + c.title + "</h1><p>Experience content.</p>"
    })),
    {}
  );
  assert.equal(shell.ok, true, "Unified shell failed: " + JSON.stringify(shell.errors || shell));
  assert.equal(shell.hasJournal, true);
  assert.equal(shell.journalSpec.entries.length, 2);
  assert.match(shell.html, /Economic Reasoning Journal/);

  // 4. Workload feasibility adapter (Sprint 104 M5)
  const workloadRes = ljWorkload.assessLearningJourneyWorkload(page, {
    authoritativeParentDurationMinutes: 60,
    requireAuthoritativeDuration: true
  });
  assert.equal(workloadRes.journey.durationStatus, "available");
  assert.equal(workloadRes.journey.arithmeticOk, true);
  assert.equal(workloadRes.journey.allocatedSum, 60);
});
