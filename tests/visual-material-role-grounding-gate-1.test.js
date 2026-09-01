"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const grounding = require("../lib/prism-visual-material-role-grounding.js");
const planner = require("../lib/prism-visual-jobs-planner.js");
const compiler = require("../lib/prism-image-brief-compiler.js");
const workspace = require("../lib/utilities-visual-jobs-workspace.js");

const A4_M2_BODY = [
  "## Simulated capacity scenario",
  "",
  "**This is a simulated instructional scenario.**",
  "A small producer chooses two outputs to maximise weekly profit.",
  "Weekly production capacity is **120 machine-hours**.",
  "The binding equality constraint uses machine-hours per week.",
  "The supplied multiplier is \\( \\lambda = 18 \\).",
  "Profit is measured in **pounds per week**."
].join("\n");

const A4_M1_BODY = [
  "## Worked shadow-price walkthrough",
  "",
  "**Worked example — a different capacity setting.**",
  "Capacity is **100 machine-hours** with \\( \\lambda = 12 \\).",
  "Profit is measured in pounds per week."
].join("\n");

function buildA4Page(affordanceOverrides) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Lagrange Multipliers for Economic Optimisation",
    visual_affordance_schema_version: "38.4",
    page_synthesis: {
      knowledge_summary: {
        body:
          "Under stated regularity conditions, a Lagrange multiplier can represent the marginal change in the optimised objective from a small relaxation of its associated constraint.",
        format: "markdown"
      }
    },
    activities: [
      {
        activity_id: "A4",
        learner_task:
          "Use the supplied economic scenario and multiplier value to state what a small relaxation of the constraint represents.",
        materials: [
          {
            material_id: "A4-M1",
            material_type: "worked_example",
            title: "Shadow-price walkthrough",
            body: A4_M1_BODY,
            body_format: "markdown",
            practice_independence: {
              attempt_operand_material_ids: ["A4-M2"]
            }
          },
          {
            material_id: "A4-M2",
            material_type: "scenario",
            title: "Simulated capacity scenario",
            body: A4_M2_BODY,
            body_format: "markdown"
          },
          {
            material_id: "A4-M3",
            material_type: "text",
            title: "Lambda as a shadow price",
            body: "The Lagrange multiplier can carry a shadow-price interpretation under regularity conditions.",
            body_format: "markdown"
          }
        ]
      }
    ],
    activities_visual_review: [
      {
        activity_id: "A4",
        activity_visual_value: {
          decision: "high",
          rationale: "Mechanism visual supports shadow-price interpretation."
        }
      }
    ],
    visual_affordances: [
      Object.assign(
        {
          affordance_id: "va-A4-shadow-price-01",
          scope: "activity",
          activity_id: "A4",
          visual_decision: "generate",
          rationale:
            "Externalise the marginal interpretation while preserving conditionality.",
          subject: "Shadow-price interpretation of the multiplier",
          context:
            "Represent the taught relationship between a binding equality constraint, a small relaxation, and the multiplier under stated regularity conditions.",
          evidence_anchors: [
            "A4.learner_task",
            "A4.materials.text",
            "A4.materials.scenario",
            "page_synthesis.knowledge_summary"
          ],
          visual_slot: "materials-entry",
          tier: "valuable",
          purpose: "mechanism",
          preferred_representation: "annotated_system",
          pedagogical_added_value: "Adds inspectable mechanism structure.",
          reasoning_supported: "Connect multiplier, relaxation, and objective change.",
          learner_stage: "pre_classification",
          anti_spoiler: true,
          spoiler_boundary: {
            hide_answers: true,
            hide_classification_keys: true,
            hide_model_solution: true,
            allow_structural_hint: true
          },
          representation_avoid: ["filled_worksheet", "generic_infographic"],
          canonical_discipline_note: "Marginal and conditional interpretation only.",
          requires_exact_data_match: false,
          must_show: [
            "a specific equality constraint associated with \\( \\lambda \\)",
            "a small relaxation of the constrained resource"
          ],
          must_not_show: ["a completed response to the activity's shadow-price workspace"],
          allowed_claims: [
            "The multiplier can represent the marginal change in the optimised objective from a small relaxation of its associated constraint."
          ],
          disallowed_claims: ["The shadow-price interpretation is unconditional."],
          source_basis: "A4.learner_task; A4.materials.text; page_synthesis.knowledge_summary",
          caption_intent: "Show how relaxation connects through \\( \\lambda \\) to objective change.",
          alt_text: "Shadow-price mechanism diagram.",
          detailed_description: "Mechanism diagram linking constraint relaxation and multiplier.",
          discipline_risk_level: "medium"
        },
        affordanceOverrides || {}
      )
    ]
  };
}

function compileFirstBrief(page) {
  const planned = planner.planPrismVisualJobs(page);
  assert.equal(planned.valid, true, planned.errors && planned.errors.map((e) => e.message).join("; "));
  const compiled = compiler.compilePrismImageBriefs(planned);
  assert.equal(compiled.valid, true, compiled.errors && compiled.errors.map((e) => e.message).join("; "));
  assert.equal(compiled.briefs.length, 1);
  return compiled.briefs[0];
}

function humanPromptForBrief(brief) {
  return workspace.buildVisualJobHumanPrompt(brief);
}

test("CASE A — conceptual: no material_anchor excludes attempt operand precision", () => {
  const brief = compileFirstBrief(buildA4Page());
  assert.equal(brief.material_role.effective_policy, grounding.EFFECTIVE_POLICY.CONCEPTUAL);
  const prompt = humanPromptForBrief(brief);
  assert.match(prompt, /Material role:/i);
  assert.match(prompt, /Do not instantiate activity-specific scenario numerics/i);
  assert.doesNotMatch(prompt, /Authorised precision-critical relationships:[\s\S]*\\lambda\s*=\s*18/i);
  assert.doesNotMatch(prompt, /120 machine-hours/i);
});

test("CASE B — worked example: anchor A4-M1 excludes A4-M2 particulars", () => {
  const brief = compileFirstBrief(buildA4Page({ material_anchor: "A4-M1" }));
  assert.equal(brief.material_role.effective_policy, grounding.EFFECTIVE_POLICY.WORKED_EXAMPLE);
  assert.deepEqual(brief.material_role.excluded_attempt_material_ids, ["A4-M2"]);
  assert.equal(brief.material_role.represented_material.material_id, "A4-M1");
  const prompt = humanPromptForBrief(brief);
  assert.match(prompt, /Represented worked example/i);
  assert.match(prompt, /Worked example/i);
  assert.match(prompt, /100 machine-hours/i);
  assert.match(prompt, /\\lambda\s*=\s*12/i);
  assert.doesNotMatch(prompt, /120 machine-hours/i);
  assert.doesNotMatch(prompt, /\\lambda\s*=\s*18/i);
  assert.match(prompt, /Caption guidance:[\s\S]*Worked example/i);
});

test("CASE C — grounded source: anchor A4-M2 with full material and exact-data", () => {
  const brief = compileFirstBrief(buildA4Page({ material_anchor: "A4-M2" }));
  assert.equal(brief.material_role.effective_policy, grounding.EFFECTIVE_POLICY.GROUNDED_SOURCE);
  assert.equal(brief.requires_exact_data_match, true);
  const prompt = humanPromptForBrief(brief);
  assert.match(prompt, /Represented material \(authoritative\):/i);
  assert.match(prompt, /120 machine-hours/i);
  assert.match(prompt, /\\lambda\s*=\s*18/i);
  assert.match(prompt, /pounds per week/i);
  assert.match(prompt, /Do not substitute or invent alternative numerical/i);
  assert.match(prompt, /exact data match/i);
});

test("CASE D — invalid anchor fails closed", () => {
  const planned = planner.planPrismVisualJobs(
    buildA4Page({ material_anchor: "unknown-material" })
  );
  assert.equal(planned.valid, false);
  assert.ok(
    planned.errors.some((err) => err.code === "VPC_MATERIAL_ANCHOR_UNRESOLVED"),
    "expected unresolved anchor diagnostic"
  );
});

test("CASE E — backwards compatibility: non-scenario comparison visual unchanged in role", () => {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Consumer trade-offs",
    visual_affordance_schema_version: "38.4",
    page_synthesis: {
      knowledge_summary: {
        body: "Interior consumer conditions can relate marginal rates of substitution to relative prices.",
        format: "markdown"
      }
    },
    activities: [
      {
        activity_id: "A3",
        learner_task: "Compare the preference-side and market-side trade-offs.",
        materials: [
          {
            material_id: "A3-M1",
            material_type: "text",
            title: "Trade-off definitions",
            body: "Define \\(U_x/U_y\\) and \\(p_x/p_y\\).",
            body_format: "markdown"
          }
        ]
      }
    ],
    activities_visual_review: [
      {
        activity_id: "A3",
        activity_visual_value: { decision: "high", rationale: "Comparison benefits from parallel layout." }
      }
    ],
    visual_affordances: [
      {
        affordance_id: "va-A3-tradeoffs-01",
        scope: "activity",
        activity_id: "A3",
        visual_decision: "generate",
        rationale: "Parallel comparison supports discrimination.",
        subject: "Preference and market marginal trade-offs",
        context: "Compare \\(U_x/U_y\\) with \\(p_x/p_y\\) at an interior optimum.",
        evidence_anchors: ["A3.learner_task", "A3.materials.text", "page_synthesis.knowledge_summary"],
        visual_slot: "materials-entry",
        tier: "valuable",
        purpose: "comparison",
        preferred_representation: "labelled_contrast_panel",
        pedagogical_added_value: "Adds simultaneous comparison.",
        reasoning_supported: "Distinguish preference-side and market-side origins.",
        learner_stage: "pre_classification",
        anti_spoiler: true,
        spoiler_boundary: {
          hide_answers: true,
          hide_classification_keys: true,
          hide_model_solution: true,
          allow_structural_hint: true
        },
        representation_avoid: ["filled_worksheet"],
        canonical_discipline_note: "Taught interior consumer model only.",
        requires_exact_data_match: false,
        must_show: ["preference-side ratio \\(U_x/U_y\\)", "market-side ratio \\(p_x/p_y\\)"],
        must_not_show: ["completed learner workspace"],
        allowed_claims: ["The first-order conditions can imply \\(U_x/U_y=p_x/p_y\\)."],
        disallowed_claims: ["Every consumer optimum must satisfy the interior equality."],
        source_basis: "A3.learner_task; A3.materials.text",
        caption_intent: "Contrast the two marginal trade-offs.",
        alt_text: "Trade-off comparison.",
        detailed_description: "Parallel comparison of preference and market trade-offs.",
        discipline_risk_level: "medium"
      }
    ]
  };
  const brief = compileFirstBrief(page);
  assert.equal(brief.material_role.effective_policy, grounding.EFFECTIVE_POLICY.CONCEPTUAL);
  const prompt = humanPromptForBrief(brief);
  assert.match(prompt, /Concept boundary:/i);
  assert.match(prompt, /Material role:/i);
  assert.doesNotMatch(prompt, /Represented material \(authoritative\)/i);
});

test("scenario grounding language without material_anchor fails commissioning validation at planning", () => {
  const planned = planner.planPrismVisualJobs(
    buildA4Page({
      context:
        "Use the activity's simulated capacity setting as contextual grounding while showing the mechanism."
    })
  );
  assert.equal(planned.valid, false);
  assert.ok(
    planned.errors.some((err) => err.code === "VPC_SCENARIO_GROUNDING_WITHOUT_ANCHOR")
  );
});
