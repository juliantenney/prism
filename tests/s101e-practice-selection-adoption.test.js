/**
 * Sprint 101E — Option B selection adoption using C3 A1 claim-judgement shape.
 * Demonstrates DLA fulfilment + packaged learner HTML (not live model behaviour).
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const dlaEnrich = require("../lib/page-dla-enrich.js");
const fulfilment = require("../lib/dla-production-fulfilment.js");
const practiceContracts = require("../lib/ld-practice-presentation-contracts.js");
const dlaContract = require("../lib/ld-dla-page-enrich-contract.js");
const { buildPageModel } = require("../lib/learner-renderer-vnext/build-page-model.js");
const { renderPage } = require("../lib/learner-renderer-vnext/render-page.js");
const assessmentRuntime = require("../lib/learner-renderer-vnext/assessment-runtime.js");
const draftAdapters = require("../lib/learner-renderer-vnext/learner-draft-adapters.js");

function claimSelection(id, claimLabel, correct, feedback) {
  return {
    material_id: id,
    material_type: "selection",
    purpose:
      "Capture a discrete judgement of whether " +
      claimLabel +
      "'s stated evidence supports its conclusion.",
    specification:
      "Author a single_select with options Supported / Unsupported inference / Incomplete argument. Do not prefill the answer. Keep the stem free of the correct key.",
    response_fulfilment: {
      kind: "learner_workspace",
      response_kind: "selection_choose",
      binds_production_steps: [1],
      allows_partial_exemplar: false
    },
    selection: {
      form: "single_select",
      prompt:
        "Does the stated evidence in " + claimLabel + " justify its conclusion?",
      options: [
        { key: "supported", text: "Supported" },
        { key: "unsupported", text: "Unsupported inference" },
        { key: "incomplete", text: "Incomplete argument" }
      ],
      correct_answer: correct,
      feedback: feedback
    }
  };
}

function c3A1CompoundActivity() {
  return {
    activity_id: "A1",
    title: "Judge what multiplier equations prove",
    grouping: "individual",
    duration_minutes: 3,
    learning_outcome_ids: ["LO1"],
    learner_task:
      "Inspect the three claims. Use the selection controls to decide whether each claim's stated evidence supports its conclusion. Then briefly name the missing reasoning where needed. Check your work after attempting the judgements.",
    expected_output:
      "Three selection judgements distinguishing supported, unsupported and incomplete claims, plus a short note of missing evidence where required.",
    activity_preamble:
      "Use earlier distinctions between feasibility, stationarity and optimality.",
    intellectual_coherence_bridge: "Judge the logical strength of multiplier evidence.",
    reasoning_orientation:
      "Separate feasibility, stationarity and justified optimality.",
    task_material_decision: {
      separate_inputs_required: true,
      task_input_material_ids: ["A1-M1"]
    },
    evidence_decision: {
      required: true,
      reason: "Learners inspect three mathematical claims as grounds for judgement.",
      provider_material_ids: ["A1-M1"]
    },
    required_materials: [
      {
        material_id: "A1-M1",
        material_type: "scenario",
        purpose: "Supply three inspectable mathematical claims.",
        specification:
          "Present C1–C3 with premises and conclusions labelled as claims for evaluation.",
        evidence_requirement: {
          kind: "learner_evidence",
          purpose: "Provide claim premises and conclusions for evaluation.",
          learner_action: "Inspect each claim before selecting a judgement.",
          observable_features: [
            "Premise and conclusion of each claim",
            "Candidate coordinates and objective values"
          ],
          provenance: "system_generated_simulation",
          evidence_layout: "separate_provider"
        }
      },
      claimSelection(
        "A1-M2",
        "C1",
        "supported",
        "C1 only claims feasible stationary candidacy; the stated evidence supports that."
      ),
      claimSelection(
        "A1-M3",
        "C2",
        "unsupported",
        "Multiplier equations do not automatically prove extrema."
      ),
      claimSelection(
        "A1-M4",
        "C3",
        "incomplete",
        "Comparing candidates alone does not cover the full feasible set."
      ),
      {
        material_id: "A1-M5",
        material_type: "template",
        purpose: "Capture a brief note of missing evidence where a claim is incomplete.",
        specification:
          "One **Missing evidence:** field for concise reasons; not essay-length.",
        response_fields: [{ label: "Missing evidence", input_modality: "text" }],
        response_fulfilment: {
          kind: "learner_text_production",
          response_kind: "text_compose",
          binds_production_steps: [2],
          allows_partial_exemplar: false
        }
      },
      {
        material_id: "A1-M6",
        material_type: "sample_output",
        purpose: "Post-attempt evaluations of C1–C3.",
        specification: "Reveal after completing your judgements."
      },
      {
        material_id: "A1-M7",
        material_type: "checklist",
        purpose: "Criterion-based self-review of the claim judgements.",
        specification:
          "Four diagnostic dimensions covering separation of feasibility/stationarity, necessary vs sufficient, global scope, and repair.",
        diagnostic_review: {
          covers_response_material_ids: ["A1-M2", "A1-M3", "A1-M4", "A1-M5"]
        }
      }
    ],
    materials: [],
    episode_plan: {
      archetype: "understand",
      beats: [
        { function: "orientation" },
        { function: "framing" },
        { function: "activation" },
        { function: "explanation" },
        { function: "example" },
        { function: "guided_practice" },
        { function: "independent_performance" },
        { function: "verification" },
        { function: "reflection" },
        { function: "transition" }
      ]
    }
  };
}

function buildPartialPage(activity) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "practice",
    page_kind: "practice",
    assembly_state: { current_stage: "dla", enriched_by: ["dla"] },
    activities: [activity]
  };
}

function buildLearnerPage(activity) {
  const materials = [
    {
      material_id: "A1-M1",
      material_type: "scenario",
      title: "Three claims",
      body_format: "markdown",
      body:
        "### Claim C1\nBoth points are feasible multiplier solutions and therefore stationary candidates.\n\n### Claim C2\nBecause both points satisfy the multiplier equations, they must be a maximum and a minimum.\n\n### Claim C3\nComparing their objective values alone establishes the global extrema."
    },
    {
      material_id: "A1-M2",
      material_type: "selection",
      title: "C1 judgement",
      selection: activity.required_materials[1].selection
    },
    {
      material_id: "A1-M3",
      material_type: "selection",
      title: "C2 judgement",
      selection: activity.required_materials[2].selection
    },
    {
      material_id: "A1-M4",
      material_type: "selection",
      title: "C3 judgement",
      selection: activity.required_materials[3].selection
    },
    {
      material_id: "A1-M5",
      material_type: "template",
      title: "Missing evidence",
      body_format: "markdown",
      body: "**Missing evidence:**\n\nName the additional reasoning required where a claim is incomplete."
    },
    {
      material_id: "A1-M6",
      material_type: "sample_output",
      title: "Check the reasoning",
      body_format: "markdown",
      body: "Reveal after completing your judgements.\n\nC1 supported; C2 unsupported; C3 incomplete."
    },
    {
      material_id: "A1-M7",
      material_type: "checklist",
      title: "Review your claim judgements",
      body_format: "json",
      body: {
        mode: "diagnostic_review",
        criteria: [
          {
            statement: "Have you distinguished feasibility from stationarity?",
            look_for: ["Separate decisions"],
            if_missing: ["Revisit C1"],
            why_it_matters: "Collapsing claims hides unsupported leaps."
          },
          {
            statement: "Have you distinguished necessary from sufficient conditions?",
            look_for: ["Stationarity vs optimality"],
            if_missing: ["Revisit C2"],
            why_it_matters: "Reversing necessity is the core error."
          }
        ]
      }
    }
  ];
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "practice",
    page_kind: "practice",
    title: "Evaluate what multiplier solutions establish",
    page_synthesis: {
      overview: { body: "Practice claim evaluation.", format: "markdown" }
    },
    activities: [
      Object.assign({}, activity, {
        materials: materials
      })
    ],
    learning_outcomes: [
      {
        outcome_id: "LO1",
        statement: "Evaluate mathematical claims about multiplier solutions."
      }
    ],
    episode_plans: [
      {
        activity_id: "A1",
        mapped_learning_outcome_ids: ["LO1"],
        episode_plan: activity.episode_plan
      }
    ],
    assembly_state: {
      current_stage: "design_page",
      enriched_by: ["episode_plan", "dla", "gam", "design_page"]
    }
  };
}

test("101E adoption: selection_choose is a recognised DLA fulfilment kind for selection", () => {
  assert.ok(fulfilment.RESPONSE_KINDS.includes("selection_choose"));
  assert.equal(
    fulfilment.materialTypeCompatibleWithResponseKind("selection", "selection_choose"),
    true
  );
  assert.equal(
    fulfilment.materialTypeCompatibleWithResponseKind("analysis_table", "selection_choose"),
    false
  );
  const contract = dlaContract.assembleDlaCanonicalContract().text;
  assert.match(contract, /selection_choose/);
  assert.match(contract, /material_type "selection"/);
});

test("101E adoption: C3 A1-style DLA with selection_choose validates", () => {
  const activity = c3A1CompoundActivity();
  // Avoid unbound text_compose from "briefly name" by keeping production on
  // selection steps + explicit text_compose template already bound.
  const page = buildPartialPage(activity);
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, true, (check.errors || []).join("\n"));
});

test("101E adoption: Practice contracts prefer selection for discrete claim judgements", () => {
  assert.match(practiceContracts.CONTRACT_VERSION, /101[EFG]-/);
  const dla = practiceContracts.buildPracticePresentationContractBlock("dla");
  assert.match(dla, /response_kind: "selection_choose"/);
  assert.match(dla, /prefer material_type "selection"/i);
  assert.match(dla, /rather than an analysis_table/i);
  const gam = practiceContracts.buildPracticePresentationContractBlock("gam");
  assert.match(gam, /Selection GAM shape/);
  assert.match(gam, /"form": "single_select"/);
});

test("101E adoption: packaged A1 HTML renders selection radios + guided review + check", () => {
  const page = buildLearnerPage(c3A1CompoundActivity());
  const built = buildPageModel(page);
  assert.equal(built.ok, true, JSON.stringify(built.diagnostics || built.error || {}));
  const html = renderPage(built.model, { includeRuntimeScripts: true });

  assert.match(html, /data-practice-selection="true"/);
  assert.match(html, /data-assessment-form="single_answer_mcq"/);
  assert.ok((html.match(/data-practice-selection="true"/g) || []).length >= 3);
  assert.match(html, /type="radio"/);
  assert.match(html, /Does the stated evidence in C2/);
  assert.match(html, /data-guided-review="true"/);
  assert.match(html, /Missing evidence/);
  assert.ok(
    (html.match(/type="radio"/g) || []).length >= 9,
    "expected three single_select groups with three options each"
  );
  assert.match(html, /data-assessment-check/);
  assert.match(html, /data-workspace-kind="assessment_selection"/);
  assert.equal(typeof assessmentRuntime, "object");
  assert.equal(typeof draftAdapters.serializeWorkspaceState, "function");
});
