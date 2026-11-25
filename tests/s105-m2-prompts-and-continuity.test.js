/**
 * Sprint 105 Milestone 2 — Economical Stage 1–5 prompts aligned to M1 contracts,
 * authoritative inter-stage handoff, Step 5 Interactive runner-guidance leak fix
 * (S105-AD-002), learner artefact continuity reconciliation (S105-AD-003), and
 * legacy LJ + non-LJ product family preservation.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const ljAssemble = require("../lib/learning-journey-assemble.js");
const ljDesign = require("../lib/learning-journey-design-page.js");
const ljPrompts = require("../lib/learning-journey-sibling-prompts.js");
const ljShared = require("../lib/learning-journey-shared-source.js");
const family = require("../lib/first-class-workflow-family.js");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

function makeSampleStoredCaptures() {
  return {
    learning_requirements: {
      artifact_type: "learning_journey_stage",
      schema_version: "1.0.0",
      stage: "learning_requirements",
      journey_allocated_minutes: 90,
      learning_outcomes: {
        learning_outcomes: [
          {
            statement: "Interpret marginal cost and marginal benefit in a pricing decision.",
            related_concepts: ["marginal analysis", "opportunity cost"],
            cognitive_level: "apply"
          },
          {
            statement: "Evaluate trade-offs across competing municipal transit policy options.",
            related_concepts: ["trade-offs", "externalities"],
            cognitive_level: "evaluate"
          }
        ],
        learner_level: "First-year undergraduate"
      },
      learner_profile: "Introductory economics students with basic algebra.",
      purpose: "Build practical marginal-decision fluency in real policy contexts.",
      body_of_knowledge: ["Marginal cost", "Opportunity cost", "Externalities"],
      constraints_and_tradeoffs: "Strictly 90 minutes total; favour depth over formulaic drill.",
      journal_orientation: "Developmental visibility across initial and revised policy judgements."
    },
    learning_progression: {
      artifact_type: "learning_journey_stage",
      schema_version: "1.0.0",
      stage: "learning_progression",
      journey_structure: {
        mode: "single",
        rationale: "Single 90-minute arc moving from concept grounding to policy judgement."
      },
      developmental_phases: [
        {
          phase_id: "P1",
          title: "Concept Grounding",
          purpose: "Establish marginal vs average reasoning.",
          indicative_minutes: 30,
          scaffolding_and_evidence: "Worked examples with immediate check prompts.",
          dependencies: []
        },
        {
          phase_id: "P2",
          title: "Policy Trade-off Application",
          purpose: "Apply marginal reasoning to an authentic transit choice.",
          indicative_minutes: 60,
          scaffolding_and_evidence: "Guided practice followed by situated policy recommendation.",
          dependencies: ["P1"]
        }
      ],
      developmental_arc: "Progresses from conceptual distinction to defended policy judgement.",
      journal_note: "Track learner policy rationale from initial estimate to final recommendation."
    },
    learning_elements: {
      artifact_type: "learning_journey_stage",
      schema_version: "1.0.0",
      stage: "learning_elements",
      elements: [
        {
          element_id: "E1",
          phase_id: "P1",
          title: "Marginal vs Average Cost",
          educational_job: "Explain marginal cost using worked fare increments.",
          knowledge_focus: "Marginal cost and sunk cost.",
          indicative_minutes: 30,
          scaffolding_and_feedback: "Worked contrast with conceptual checks.",
          dependencies: [],
          journal_producer_candidate: false
        },
        {
          element_id: "E2",
          phase_id: "P2",
          title: "Initial Fare Decision",
          educational_job: "Practise applying marginal reasoning to draft a fare stance (elicitation E1).",
          knowledge_focus: "Marginal benefit and ridership elasticity.",
          indicative_minutes: 30,
          scaffolding_and_feedback: "Stepwise feedback on marginal comparison.",
          dependencies: ["E1"],
          journal_producer_candidate: true
        },
        {
          element_id: "E3",
          phase_id: "P2",
          title: "Transit Policy Brief",
          educational_job: "Revisit initial fare stance with new externality evidence (elicitation E2).",
          knowledge_focus: "Externalities and policy trade-offs.",
          indicative_minutes: 30,
          scaffolding_and_feedback: "Rubric criteria on trade-off justification.",
          dependencies: ["E2"],
          journal_producer_candidate: true
        }
      ],
      boundary_notes: "Split between conceptual grounding, guided practice, and final synthesis."
    },
    learning_commissions: {
      artifact_type: "learning_journey_stage",
      schema_version: "1.0.0",
      stage: "learning_commissions",
      shared_authoritative_material: {
        status: "provided"
      },
      commissions: [
        {
          commission_id: "comm_1",
          section_id: "exp_1",
          order: 1,
          title: "Understanding Marginal Cost",
          product_id: "expository",
          status: "supported",
          allocated_minutes: 30,
          specification_text:
            "SECRET_SPEC_TEXT_SHOULD_NOT_LEAK_TO_STAGE_5\n<<<COMPONENT_LEARNING_OUTCOMES_BEGIN>>>\n{\"learning_outcomes\":[{\"statement\":\"Distinguish marginal cost from average cost.\"}]}\n<<<COMPONENT_LEARNING_OUTCOMES_END>>>",
          journey_context_text: "SECRET_JOURNEY_CONTEXT_SHOULD_NOT_LEAK_TO_STAGE_5",
          dependencies: [],
          element_ids: ["E1"],
          relevant_journey_outcome_numbers: [1]
        },
        {
          commission_id: "comm_2",
          section_id: "exp_2",
          order: 2,
          title: "Drafting a Fare Stance",
          product_id: "practice",
          status: "supported",
          allocated_minutes: 30,
          specification_text:
            "SECOND_SPEC_TEXT\n<<<COMPONENT_LEARNING_OUTCOMES_BEGIN>>>\n{\"learning_outcomes\":[{\"statement\":\"Apply marginal analysis to fare options.\"}]}\n<<<COMPONENT_LEARNING_OUTCOMES_END>>>",
          journey_context_text: "SECOND_CONTEXT_TEXT",
          dependencies: ["comm_1"],
          element_ids: ["E2"],
          relevant_journey_outcome_numbers: [1]
        },
        {
          commission_id: "comm_3",
          section_id: "exp_3",
          order: 3,
          title: "Defending a Transit Policy",
          product_id: "situated_task",
          status: "supported",
          allocated_minutes: 30,
          specification_text:
            "THIRD_SPEC_TEXT\n<<<COMPONENT_LEARNING_OUTCOMES_BEGIN>>>\n{\"learning_outcomes\":[{\"statement\":\"Evaluate competing transit policy trade-offs.\"}]}\n<<<COMPONENT_LEARNING_OUTCOMES_END>>>",
          journey_context_text: "THIRD_CONTEXT_TEXT",
          dependencies: ["comm_2"],
          element_ids: ["E3"],
          relevant_journey_outcome_numbers: [1, 2]
        }
      ],
      continuity: "Learners build from conceptual grounding to initial stance and final policy defence.",
      journal: {
        enabled: true,
        decision_basis: "Developmental visibility across initial and revised policy stances.",
        title: "Policy Reasoning Journal",
        entries: [
          {
            entry_id: "j1",
            order: 1,
            title: "Initial Fare Stance",
            artefact_id: "comm_2.E1",
            framing: "Your initial marginal fare judgement before externality evidence."
          },
          {
            entry_id: "j2",
            order: 2,
            title: "Final Policy Brief",
            artefact_id: "comm_3.E2",
            framing: "Your revised policy defence integrating externalities."
          }
        ]
      },
      feasibility_note: "Tight 90-minute envelope; keep reading concise."
    }
  };
}

function loadVmHarness() {
  const loaded = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/learning-journey-assemble.js",
      "lib/learning-journey-shared-source.js",
      "lib/learning-journey-design-page.js",
      "lib/learning-journey-sibling-prompts.js"
    ]
  });
  const host = loaded.window || loaded.sandbox;
  if (host) {
    host.PRISM_LEARNING_JOURNEY_ASSEMBLE = ljAssemble;
    host.PRISM_LEARNING_JOURNEY_SHARED_SOURCE = ljShared;
    host.PRISM_LEARNING_JOURNEY_DESIGN_PAGE = ljDesign;
    host.PrismLearningJourneySiblingPrompts = ljPrompts;
  }
  if (loaded.sandbox && loaded.sandbox.globalThis) {
    loaded.sandbox.globalThis.PRISM_LEARNING_JOURNEY_ASSEMBLE = ljAssemble;
    loaded.sandbox.globalThis.PRISM_LEARNING_JOURNEY_SHARED_SOURCE = ljShared;
    loaded.sandbox.globalThis.PRISM_LEARNING_JOURNEY_DESIGN_PAGE = ljDesign;
    loaded.sandbox.globalThis.PrismLearningJourneySiblingPrompts = ljPrompts;
  }
  return loaded;
}

function makeWorkflow(id, progressive, sourceContext) {
  const wf = {
    id: id,
    name: "Economics – Marginal Transit Decisions",
    product: "learning_journey",
    steps: [
      {
        id: "s1",
        title: "Requirements",
        outputName: "learning_requirements",
        canonical_step_id: "step_journey_requirements"
      },
      {
        id: "s2",
        title: "Progression",
        outputName: "learning_progression",
        canonical_step_id: "step_journey_progression",
        inputBindings: [{ kind: "internal", sourceStepId: "s1", artifactName: "learning_requirements" }]
      },
      {
        id: "s3",
        title: "Elements",
        outputName: "learning_elements",
        canonical_step_id: "step_journey_elements",
        inputBindings: [{ kind: "internal", sourceStepId: "s2", artifactName: "learning_progression" }]
      },
      {
        id: "s4",
        title: "Commissioning",
        outputName: "learning_commissions",
        canonical_step_id: "step_journey_commissioning",
        inputBindings: [{ kind: "internal", sourceStepId: "s3", artifactName: "learning_elements" }]
      },
      {
        id: "s5",
        title: "Design Page",
        outputName: "learning_journey_page",
        canonical_step_id: "step_design_page",
        inputBindings: [
          { kind: "internal", sourceStepId: "s1", artifactName: "learning_requirements" },
          { kind: "internal", sourceStepId: "s2", artifactName: "learning_progression" },
          { kind: "internal", sourceStepId: "s3", artifactName: "learning_elements" },
          { kind: "internal", sourceStepId: "s4", artifactName: "learning_commissions" }
        ]
      }
    ],
    workflowBriefResolution: {
      initialBrief: {
        topic: "Marginal analysis in municipal transit",
        allocated_minutes: 90,
        sourceContext: sourceContext || ""
      },
      resolvedFactors: {
        topic: "Marginal analysis in municipal transit",
        allocated_minutes: 90,
        source_context: sourceContext || ""
      }
    }
  };
  if (progressive) {
    wf.progressive_capture_version = ljAssemble.PROGRESSIVE_CAPTURE_VERSION;
    wf.outputSpec = {
      partialPageOutputs: true,
      progressiveCaptureVersion: ljAssemble.PROGRESSIVE_CAPTURE_VERSION
    };
  }
  return wf;
}

test("S105 M2: all 5 progressive prompts align verbatim to M1 stage contracts and omit legacy prose reporting bloat", () => {
  const s1 = ljPrompts.resolveTemplate("learning_requirements", { progressive: true });
  const s2 = ljPrompts.resolveTemplate("learning_progression", { progressive: true });
  const s3 = ljPrompts.resolveTemplate("learning_elements", { progressive: true });
  const s4 = ljPrompts.resolveTemplate("learning_commissions", { progressive: true });
  const s5 = ljPrompts.resolveTemplate("design_page", { progressive: true });

  // Stage 1 exact M1 keys
  assert.match(s1, /\{\{ORIGINAL_BRIEF\}\}/);
  assert.match(s1, /"artifact_type": "learning_journey_stage"/);
  assert.match(s1, /"stage": "learning_requirements"/);
  for (const k of [
    "journey_allocated_minutes",
    "learning_outcomes",
    "learner_profile",
    "purpose",
    "body_of_knowledge",
    "constraints_and_tradeoffs",
    "journal_orientation"
  ]) {
    assert.ok(s1.includes(`"${k}"`), `Stage 1 prompt missing M1 key ${k}`);
  }
  assert.doesNotMatch(s1, /<<<JOURNEY_LEARNING_OUTCOMES_BEGIN>>>/);

  // Stage 2 exact M1 keys & handoff
  assert.match(s2, /\{\{AUTHORITATIVE_STAGE_HANDOFF\}\}/);
  assert.match(s2, /"stage": "learning_progression"/);
  for (const k of [
    "journey_structure",
    "developmental_phases",
    "phase_id",
    "indicative_minutes",
    "scaffolding_and_evidence",
    "developmental_arc",
    "journal_note"
  ]) {
    assert.ok(s2.includes(`"${k}"`), `Stage 2 prompt missing M1 key ${k}`);
  }

  // Stage 3 exact M1 keys & handoff
  assert.match(s3, /\{\{AUTHORITATIVE_STAGE_HANDOFF\}\}/);
  assert.match(s3, /"stage": "learning_elements"/);
  for (const k of [
    "elements",
    "element_id",
    "phase_id",
    "educational_job",
    "knowledge_focus",
    "indicative_minutes",
    "scaffolding_and_feedback",
    "dependencies",
    "journal_producer_candidate",
    "boundary_notes"
  ]) {
    assert.ok(s3.includes(`"${k}"`), `Stage 3 prompt missing M1 key ${k}`);
  }

  // Stage 4 exact M1 keys, Sprint 104 M4 principles, deterministic DLO & shared-source transport
  assert.match(s4, /\{\{AUTHORITATIVE_STAGE_HANDOFF\}\}/);
  assert.match(s4, /\{\{AUTHORITATIVE_SHARED_SOURCE\}\}/);
  assert.match(s4, /"stage": "learning_commissions"/);
  for (const k of [
    "shared_authoritative_material",
    "commissions",
    "commission_id",
    "section_id",
    "order",
    "product_id",
    "status",
    "allocated_minutes",
    "specification_text",
    "journey_context_text",
    "dependencies",
    "element_ids",
    "relevant_journey_outcome_numbers",
    "continuity",
    "journal",
    "enabled",
    "decision_basis",
    "entries",
    "entry_id",
    "artefact_id",
    "feasibility_note"
  ]) {
    assert.ok(s4.includes(`"${k}"`), `Stage 4 prompt missing M1 key ${k}`);
  }
  assert.match(s4, /<<<COMPONENT_LEARNING_OUTCOMES_BEGIN>>>/);
  assert.match(s4, /Do NOT manually embed a <<<JOURNEY_LEARNING_OUTCOMES_BEGIN>>> block/i);
  assert.match(s4, /first-pass unfamiliar or familiar revisiting/i);
  assert.match(s4, /Do NOT select product_id "interactive" for new Learning Journey commissions/i);
  assert.match(s4, /no fixed duration tiers|do not apply fixed duration tiers/i);
  assert.match(s4, /arbitrary word-count limits/i);
  assert.doesNotMatch(s4, /<<<COMMISSION_DURATIONS_BEGIN>>>/);

  // Stage 5 genuinely thin partial prompt matching M1 Stage 5 schema
  assert.match(s5, /\{\{AUTHORITATIVE_STAGE_HANDOFF\}\}/);
  assert.match(s5, /"artifact_type": "page"/);
  assert.match(s5, /"schema_version": "2.0.0"/);
  assert.match(s5, /"product_id": "learning_journey"/);
  assert.match(s5, /"editorial_opening_image"/);
  assert.match(s5, /"sections"/);
  assert.match(s5, /"design_intent"/);
  assert.match(s5, /"assembly_state"/);
  assert.match(s5, /STRICTLY FORBIDDEN FIELDS/);
  assert.match(s5, /commissions \(owned by Stage 4 — NEVER emit/i);
  assert.match(s5, /shared_authoritative_material \(owned by Stage 4/i);
  assert.match(s5, /OMIT learning_journey\.journal completely/i);
  assert.doesNotMatch(s5, /\{\{AUTHORITATIVE_SHARED_SOURCE\}\}/);

  // Stage 5 copy instructions also enforce thin partial mode
  const s5Copy = ljDesign.buildProgressiveLearningJourneyDesignPageCopyInstructions();
  assert.match(s5Copy, /progressive thin-partial mode/i);
  assert.match(s5Copy, /NEVER emit commissions\[\]/i);
  assert.match(s5Copy, /page_synthesis/);

  // Legacy default resolveTemplate() still returns legacy templates untouched
  const legacyS1 = ljPrompts.resolveTemplate("learning_requirements");
  const legacyS5 = ljPrompts.resolveTemplate("design_page");
  assert.notEqual(legacyS1, s1);
  assert.notEqual(legacyS5, s5);
  assert.match(legacyS5, /commissions\[\]/);
});

test("S105 M2: progressive shared-source prompt enforces deterministic brief-provided transport without retranscription", () => {
  const withBrief = ljShared.composeProgressiveAuthoritativeSharedSourcePromptSection(
    "Authoritative Transit Dataset: Route A 1200 pax/hr, Route B 850 pax/hr."
  );
  assert.match(withBrief, /deterministic transport/i);
  assert.match(withBrief, /"status": "provided"/);
  assert.match(withBrief, /omit "content"/i);
  // Economical transport: do not redundantly echo the full brief corpus in Step 4 prompt
  assert.doesNotMatch(withBrief, /Route A 1200 pax\/hr/);

  const withoutBrief = ljShared.composeProgressiveAuthoritativeSharedSourcePromptSection("");
  assert.match(withoutBrief, /"status": "generated"/);
  assert.match(withoutBrief, /"status": "none"/);
  assert.doesNotMatch(withoutBrief, /<<<SHARED_AUTHORITATIVE_MATERIAL_BEGIN>>>/);
});

test("S105 M2: authoritative stage handoff projects minimal anchors, honours author edits, and never leaks Stage 4 specs into Stage 5", () => {
  const captures = makeSampleStoredCaptures();
  // Simulate author editing Stage 1 minutes & outcome before copying Stage 4
  captures.learning_requirements.journey_allocated_minutes = 75;
  captures.learning_requirements.learning_outcomes.learning_outcomes[0].statement =
    "EDITED_OUTCOME_ONE: Evaluate marginal transit pricing.";

  const h2 = ljAssemble.buildAuthoritativeStageHandoffSection("learning_progression", captures);
  assert.match(h2, /AUTHORITATIVE STORED UPSTREAM CAPTURES/i);
  assert.match(h2, /take precedence over earlier conversational context/i);
  assert.match(h2, /journey_allocated_minutes: 75/);
  assert.match(h2, /1\. EDITED_OUTCOME_ONE/);

  const h3 = ljAssemble.buildAuthoritativeStageHandoffSection("learning_elements", captures);
  assert.match(h3, /P1 \(30 min\)/);
  assert.match(h3, /P2 \(60 min\)/);
  assert.doesNotMatch(h3, /EDITED_OUTCOME_ONE/);

  const h4 = ljAssemble.buildAuthoritativeStageHandoffSection("learning_commissions", captures);
  assert.match(h4, /1\. EDITED_OUTCOME_ONE/);
  assert.match(h4, /E2 \[P2, 30 min, journal_producer_candidate\]/);

  const h5 = ljAssemble.buildAuthoritativeStageHandoffSection("design_page", captures);
  assert.match(h5, /order 1 \| comm_1 -> section_id: "exp_1"/);
  assert.match(h5, /Understanding Marginal Cost/);
  assert.match(h5, /Policy Reasoning Journal/);
  assert.match(h5, /entry_id: "j1" \| Initial Fare Stance \(comm_2\.E1\)/);
  assert.match(h5, /Tight 90-minute envelope/);
  // Must NEVER embed Stage 4 commission specifications, journey context, or shared source in Stage 5 handoff
  assert.doesNotMatch(h5, /SECRET_SPEC_TEXT_SHOULD_NOT_LEAK_TO_STAGE_5/);
  assert.doesNotMatch(h5, /SECRET_JOURNEY_CONTEXT_SHOULD_NOT_LEAK_TO_STAGE_5/);
  assert.doesNotMatch(h5, /COMPONENT_LEARNING_OUTCOMES_BEGIN/);
});

test("S105 M2: reconciled continuity guidance & validator allow declared read-only runtime artefacts while still rejecting automatic-transfer and inspection claims", () => {
  const s4Prog = ljPrompts.resolveTemplate("learning_commissions", { progressive: true });
  const s5Prog = ljPrompts.resolveTemplate("design_page", { progressive: true });
  const s5Legacy = ljDesign.buildLearningJourneyDesignPagePrompt();

  for (const text of [s4Prog, s5Prog, s5Legacy]) {
    assert.match(text, /\{commission_id\}\.\{elicitation_id\}/);
    assert.match(text, /read-only/i);
    assert.match(text, /Learning Journal/);
    assert.match(text, /response-aware/i);
  }

  // Validator accepts legitimate declared read-only runtime / Journal bring-forward description
  const validPage = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "learning_journey",
    title: "Transit Economics",
    activities: [],
    sections: [
      { section_id: "journey_intro", title: "Overview", order: 1, exposition: "Intro." },
      { section_id: "exp_1", title: "Step 1", order: 2, exposition: "First." },
      { section_id: "exp_2", title: "Step 2", order: 3, exposition: "Second." }
    ],
    commissions: [
      {
        commission_id: "comm_1",
        section_id: "exp_1",
        order: 1,
        title: "Initial Stance",
        product_id: "practice",
        status: "supported",
        allocated_minutes: 25,
        specification_text: "Learners draft an initial fare stance (E1).",
        journey_context_text: "No recurring scenario.",
        dependencies: ""
      },
      {
        commission_id: "comm_2",
        section_id: "exp_2",
        order: 2,
        title: "Policy Brief",
        product_id: "situated_task",
        status: "supported",
        allocated_minutes: 35,
        specification_text: "Learners revise their stance into a policy brief.",
        journey_context_text:
          "Established scenario facts: municipal bus network with 20% off-peak shortfall. Earlier in comm_1 learners drafted an initial fare stance (E1). Learners bring forward their own declared read-only learner artefact comm_1.E1 available in the Learning Journal and unified runtime to reconsider their decision.",
        dependencies: "comm_1"
      }
    ],
    learning_journey: {
      design_intent: "Build policy judgement.",
      continuity: "Learners revisit their own earlier stance."
    }
  };
  assert.deepEqual(ljDesign.collectLearningJourneyContinuityErrors(validPage), []);

  // Validator STILL rejects positive automatic transfer, authoring-time inspection, and response-aware adaptation claims
  const badTransfer = JSON.parse(JSON.stringify(validPage));
  badTransfer.commissions[1].journey_context_text =
    "Established scenario facts: bus network. Earlier in comm_1 learners drafted a stance. PRISM automatically transfers stored answers from comm_1 into comm_2.";
  assert.ok(
    ljDesign.collectLearningJourneyContinuityErrors(badTransfer).includes("commissions[comm_2].automatic_response_access")
  );

  const badAdaptive = JSON.parse(JSON.stringify(validPage));
  badAdaptive.commissions[1].journey_context_text =
    "Established scenario facts: bus network. Earlier in comm_1 learners drafted a stance. This component adapts based on previous answers to tailor difficulty.";
  assert.ok(
    ljDesign.collectLearningJourneyContinuityErrors(badAdaptive).includes("commissions[comm_2].automatic_response_access")
  );
});

test("S105 M2 (app.js VM): Step 5 Interactive runner-guidance leak fixed for both progressive & legacy LJ, progressive handoff wired, legacy LJ & Interactive preserved", () => {
  const { api } = loadVmHarness();
  const captures = makeSampleStoredCaptures();
  const briefSource = "AUTHORITATIVE_BRIEF_TRANSIT_CORPUS: Fare $2.50, Peak load 1200.";

  // 1) Progressive LJ workflow
  const progWf = makeWorkflow("wf_lj_prog_m2", true, briefSource);
  progWf.stageCaptures = captures;
  api.setWorkflowsForTest([progWf]);
  api.setSelectedWorkflowIdForTest(progWf.id);

  // Step 4 prompt uses progressive template + deterministic brief-provided source transport + Stage 1/3 handoff
  const s4Resolved = api.resolveStepPromptText(progWf.steps[3], progWf);
  assert.match(s4Resolved.text, /"stage": "learning_commissions"/);
  assert.match(s4Resolved.text, /deterministic transport/i);
  assert.match(s4Resolved.text, /"status": "provided"/);
  assert.match(s4Resolved.text, /omit "content"/i);
  assert.match(s4Resolved.text, /AUTHORITATIVE STORED UPSTREAM CAPTURES/i);
  assert.doesNotMatch(s4Resolved.text, /\{\{AUTHORITATIVE_STAGE_HANDOFF\}\}/);
  assert.doesNotMatch(s4Resolved.text, /\{\{AUTHORITATIVE_SHARED_SOURCE\}\}/);

  // Step 5 prompt uses thin progressive partial + compact Stage 4 manifest (no spec/context/source leak)
  const s5Resolved = api.resolveStepPromptText(progWf.steps[4], progWf);
  assert.match(s5Resolved.text, /progressive Learning Journey workflow/i);
  assert.match(s5Resolved.text, /STRICTLY FORBIDDEN FIELDS/);
  assert.match(s5Resolved.text, /order 1 \| comm_1 -> section_id: "exp_1"/);
  assert.doesNotMatch(s5Resolved.text, /SECRET_SPEC_TEXT_SHOULD_NOT_LEAK_TO_STAGE_5/);
  assert.doesNotMatch(s5Resolved.text, /AUTHORITATIVE_BRIEF_TRANSIT_CORPUS/);
  assert.doesNotMatch(s5Resolved.text, /\{\{AUTHORITATIVE_STAGE_HANDOFF\}\}/);

  // Step 5 Copy instructions: ZERO generic Interactive runner-guidance leak (S105-AD-002), thin partial copy notes, no raw capture dump
  const s5ProgInstr = api.buildWorkflowStepInstructions(progWf.steps[4], 4, null);
  assert.match(s5ProgInstr, /progressive thin-partial mode/i);
  assert.doesNotMatch(s5ProgInstr, /Runner guidance:/);
  assert.doesNotMatch(s5ProgInstr, /activities\[\]\.materials\[\]/);
  assert.doesNotMatch(s5ProgInstr, /Sprint 58 Design Page partial/);
  assert.doesNotMatch(s5ProgInstr, /Upstream artefact "learning_commissions"/);
  assert.doesNotMatch(s5ProgInstr, /SECRET_SPEC_TEXT_SHOULD_NOT_LEAK_TO_STAGE_5/);

  // 2) Legacy LJ workflow (no progressive_capture_version): keeps legacy prompts AND ALSO gets S105-AD-002 leak fix!
  const legacyWf = makeWorkflow("wf_lj_legacy_m2", false, briefSource);
  api.setWorkflowsForTest([legacyWf]);
  api.setSelectedWorkflowIdForTest(legacyWf.id);
  const legacyS5Resolved = api.resolveStepPromptText(legacyWf.steps[4], legacyWf);
  assert.match(legacyS5Resolved.text, /same-chat|ONE continuous chat/i);
  assert.match(legacyS5Resolved.text, /commissions\[\]/);

  const legacyS5Instr = api.buildWorkflowStepInstructions(legacyWf.steps[4], 4, null);
  assert.match(legacyS5Instr, /Learning Journey Design Page \(same-chat constrained synthesis\)/);
  assert.doesNotMatch(legacyS5Instr, /Runner guidance:/);
  assert.doesNotMatch(legacyS5Instr, /activities\[\]\.materials\[\]/);

  // 3) Non-LJ product family protection: Interactive Design Page keeps its runner guidance & contract
  const interBuilt = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "self_study_resource",
    focus: "Bayes theorem",
    startingArtefact: "generate_from_topic"
  });
  assert.equal(interBuilt.ok, true);
  const dpIndex = interBuilt.steps.findIndex(
    (st) =>
      st.canonical_step_id === "step_design_page" ||
      st.canonicalStepId === "step_design_page" ||
      st.title === "Design Page"
  );
  assert.ok(dpIndex >= 0);
  const interWf = {
    id: "wf_inter_m2",
    name: "Interactive Bayes",
    product: "interactive",
    pageEnrichmentV2: true,
    outputSpec: { partialPageOutputs: true },
    steps: interBuilt.steps.map((st, idx) =>
      Object.assign(
        {
          id: "is_" + idx,
          canonical_step_id: st.canonical_step_id || st.canonicalStepId || ""
        },
        st
      )
    )
  };
  api.setWorkflowsForTest([interWf]);
  api.setSelectedWorkflowIdForTest(interWf.id);
  const interDpInstr = api.buildWorkflowStepInstructions(interWf.steps[dpIndex], dpIndex, null);
  assert.match(interDpInstr, /Design Page/i);
  assert.match(interDpInstr, /Runner guidance:/);
  assert.match(interDpInstr, /episode_plans/);
  assert.doesNotMatch(interDpInstr, /progressive thin-partial mode/i);
});
