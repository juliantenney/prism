/**
 * Sprint 101H — Image brief precision: exact expressions + completeness gate.
 * C4 transfer equations are regression fixtures only (not hard-coded into production).
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const precision = require("../lib/prism-image-precision-fidelity.js");
const workspace = require("../lib/utilities-visual-jobs-workspace.js");
const compiler = require("../lib/prism-image-brief-compiler.js");
const planner = require("../lib/prism-visual-jobs-planner.js");
const dpPartial = require("../lib/ld-design-page-partial-contract.js");

/** C4 regression fixtures — authored mathematical content for Transfer between equivalent constraints. */
const C4 = {
  I: "x^2 + y^2 - 1 = 0",
  II: "2(x^2 + y^2 - 1) = 0",
  III: "(x^2 + y^2 - 1)^2 = 0",
  f: "f(x,y) = x + y",
  grad: "∇f = (1,1)"
};

test("101H: extractPrecisionCriticalClaims captures spaced polynomial and parenthesized forms", () => {
  for (const eq of [C4.I, C4.II, C4.III, C4.f, C4.grad]) {
    const claims = precision.extractPrecisionCriticalClaims("Authorised form: " + eq + ".");
    assert.ok(
      claims.some((c) => c.replace(/\s+/g, "").includes(eq.replace(/\s+/g, "")) || c.includes(eq)),
      "expected to extract " + eq + " from " + JSON.stringify(claims)
    );
  }
  const unicode = precision.extractPrecisionCriticalClaims("Panel I: x² + y² − 1 = 0");
  assert.ok(unicode.length >= 1, "unicode superscript equation");
  assert.ok(precision.isSpecificFormalClaim(C4.I));
  assert.equal(precision.isGenericFormalPlaceholder("g(x,y)=0"), true);
  assert.equal(precision.isGenericFormalPlaceholder("∇f=λ∇g"), true);
  assert.equal(precision.isGenericFormalPlaceholder(C4.I), false);
});

test("101H: nabla identities preserve leading ∇ (do not strip to f=…)", () => {
  const claims = precision.extractPrecisionCriticalClaims("Stationarity: ∇f=λ∇g on the surface.");
  assert.ok(claims.some((c) => /∇f/.test(c) || /\\nabla/.test(c)));
  assert.ok(!claims.some((c) => /^f\s*=/.test(c) && !/∇/.test(c)));
});

test("101H: collect prefers specific authored equations over generic placeholders", () => {
  const claims = precision.collectPrecisionCriticalClaims({
    mustShowItems: [
      "three panels I–III with corresponding constraint equations",
      "g(x,y)=0",
      "∇f=λ∇g",
      "common objective-gradient direction"
    ],
    sourceEvidence: [
      {
        source_type: "activity_material",
        material_type: "text",
        content_text:
          "Representation I: " +
          C4.I +
          ". Representation II: " +
          C4.II +
          ". Representation III: " +
          C4.III +
          ". Objective " +
          C4.f +
          " with " +
          C4.grad +
          "."
      }
    ],
    materialRole: { effective_policy: "conceptual" },
    additionalTexts: []
  });
  assert.ok(claims.some((c) => c.includes("x^2") || c.includes("x^{2}") || /x\^2/.test(c)));
  assert.ok(claims.some((c) => /\(x\^2/.test(c) || c.includes("(x^2")));
  assert.ok(
    !claims.every((c) => precision.isGenericFormalPlaceholder(c)),
    "must not leave only generic placeholders"
  );
});

test("101H: completeness fails when Show demands three equations but only generics are authorised", () => {
  const assessment = precision.assessPrecisionBriefCompleteness({
    mustShowItems: [
      "Three coordinate planes labelled I, II and III",
      "The same unit circle in each panel",
      "three distinct constraint equations, one per panel",
      "g(x,y)=0",
      "∇f=λ∇g",
      "common objective-gradient direction"
    ],
    claims: ["g(x,y)=0", "∇f=λ∇g"]
  });
  assert.equal(assessment.ok, false);
  assert.ok(assessment.gaps.some((g) => /insufficient_specific|generic_placeholder/i.test(g.code)));
});

test("101H: completeness passes when specific C4 forms are authorised", () => {
  const assessment = precision.assessPrecisionBriefCompleteness({
    mustShowItems: [
      "three distinct constraint equations, one per panel",
      C4.I,
      C4.II,
      C4.III,
      C4.grad
    ],
    claims: [C4.I, C4.II, C4.III, C4.f, C4.grad]
  });
  assert.equal(assessment.ok, true, JSON.stringify(assessment.gaps));
});

test("101H: human prompt carries exact equations from materials; incomplete generics flagged", () => {
  const materialBody =
    "Equivalent constraints sharing the unit circle.\n" +
    "I: " +
    C4.I +
    "\nII: " +
    C4.II +
    "\nIII: " +
    C4.III +
    "\nObjective " +
    C4.f +
    "; gradient " +
    C4.grad +
    ".";

  const readyBrief = {
    brief_id: "vb-c4-ready",
    job_id: "vj-c4-ready",
    affordance_id: "va-A1-equivalent-constraints-01",
    scope: "activity",
    activity_id: "A1",
    purpose: "distinction",
    preferred_representation: "comparison",
    subject: "Equivalent constraint representations",
    context: "Three panels of the same feasible circle under rewritten constraints.",
    visual_slot: "materials-entry",
    content_requirements: {
      authored: [
        "Three panels labelled I, II and III with the same unit circle",
        "Panel I constraint: " + C4.I,
        "Panel II constraint: " + C4.II,
        "Panel III constraint: " + C4.III,
        "Objective gradient direction " + C4.grad + " (not the objective function alone)"
      ],
      derived: []
    },
    exclusion_requirements: { authored_must_not_show: [], authored_representation_avoid: [] },
    claim_constraints: {
      allowed: ["Equivalent constraints share the feasible set when regular."],
      disallowed: []
    },
    spoiler_constraints: { anti_spoiler: false, boundary: null },
    source_evidence: [
      {
        anchor: "A1.materials.A1-M1",
        source_type: "activity_material",
        material_type: "text",
        material_id: "A1-M1",
        content_text: materialBody
      }
    ],
    pedagogical_metadata: {},
    composition: { representation: "comparison", learner_stage: "pre_classification" }
  };

  const readyPrompt = workspace.buildVisualJobHumanPrompt(readyBrief);
  assert.match(readyPrompt, /Authorised precision-critical relationships:/i);
  assert.match(readyPrompt, /x\^2 \+ y\^2 - 1 = 0|x\^2\+y\^2-1=0/);
  assert.match(readyPrompt, /\(x\^2 \+ y\^2 - 1\)\^2 = 0|\(x\^2\+y\^2-1\)\^2=0/);
  assert.match(readyPrompt, /∇f = \(1,1\)|∇f=\(1,1\)/);
  assert.doesNotMatch(readyPrompt, /incomplete for precision-critical generation/i);
  const readyDiag = workspace.diagnoseHumanPrompt(readyPrompt, readyBrief);
  assert.equal(readyDiag.precision_brief_completeness_ok, true);

  const incompleteBrief = Object.assign({}, readyBrief, {
    brief_id: "vb-c4-incomplete",
    content_requirements: {
      authored: [
        "Three panels labelled I, II and III with the same unit circle",
        "three distinct constraint equations",
        "g(x,y)=0",
        "∇f=λ∇g",
        "common objective-gradient direction"
      ],
      derived: []
    },
    source_evidence: [
      {
        anchor: "page_synthesis.knowledge_summary",
        source_kind: "knowledge_summary",
        content_text: "Constraints take the form g(x,y)=0 and stationarity requires ∇f=λ∇g."
      }
    ]
  });
  const incompletePrompt = workspace.buildVisualJobHumanPrompt(incompleteBrief);
  assert.match(incompletePrompt, /Precision-brief completeness:/i);
  assert.match(incompletePrompt, /Do NOT invent missing equations/i);
  const incompleteDiag = workspace.diagnoseHumanPrompt(incompletePrompt, incompleteBrief);
  assert.equal(incompleteDiag.precision_brief_completeness_ok, false);
});

test("101H: operand materials with formal maths remain available when Show demands exact expressions", () => {
  const claims = precision.collectPrecisionCriticalClaims({
    mustShowItems: ["three distinct constraint equations", "Panel I equation", "Panel II equation", "Panel III equation"],
    sourceEvidence: [
      {
        source_type: "activity_material",
        material_type: "scenario",
        material_id: "A1-S1",
        content_text: "I: " + C4.I + " II: " + C4.II + " III: " + C4.III
      }
    ],
    materialRole: { effective_policy: "conceptual" }
  });
  assert.ok(
    claims.filter((c) => precision.isSpecificFormalClaim(c)).length >= 2,
    "expected specific equations from scenario when Show demands them: " + JSON.stringify(claims)
  );
});

test("101H: Design Page contract requires exact Show expressions", () => {
  const block = dpPartial.buildDesignPagePartialContractBlock();
  assert.match(block, /Precision-critical Show items/i);
  assert.match(block, /exact authored expression/i);
  assert.match(block, /Do not invent missing expressions/i);
});

test("101H: end-to-end planner/compiler preserves C4 forms in generation_instruction", () => {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Transfer between equivalent constraints",
    product_id: "practice",
    page_kind: "practice",
    visual_affordance_schema_version: "38.4",
    page_synthesis: {
      knowledge_summary: {
        body: "Equivalent constraints share a feasible set when regularity holds.",
        format: "markdown"
      },
      learning_purpose: { body: "Transfer across equivalent constraints.", format: "markdown" }
    },
    activities: [
      {
        activity_id: "A1",
        title: "Compare equivalent constraints",
        learner_task: "Compare the three representations.",
        materials: [
          {
            material_id: "A1-M1",
            material_type: "text",
            title: "Three representations",
            body:
              "I: " +
              C4.I +
              "\nII: " +
              C4.II +
              "\nIII: " +
              C4.III +
              "\n" +
              C4.f +
              "\n" +
              C4.grad
          }
        ]
      }
    ],
    activities_visual_review: [
      {
        activity_id: "A1",
        activity_visual_value: { decision: "high", rationale: "Needs a comparison figure." }
      }
    ],
    visual_affordances: [
      {
        affordance_id: "va-A1-equivalent-constraints-01",
        scope: "activity",
        activity_id: "A1",
        visual_decision: "generate",
        visual_slot: "materials-entry",
        tier: "essential",
        purpose: "distinction",
        preferred_representation: "comparison",
        subject: "Equivalent constraint panels",
        context: "Three panels of the unit circle under rewritten constraints.",
        evidence_anchors: ["A1.materials.A1-M1"],
        must_show: [
          "Panel I: " + C4.I,
          "Panel II: " + C4.II,
          "Panel III: " + C4.III,
          "Objective gradient " + C4.grad
        ],
        must_not_show: ["Worked solutions for later activities"],
        allowed_claims: ["The three forms share the same feasible circle when defined."],
        disallowed_claims: ["Claims that regularity always holds"],
        rationale: "Makes equivalent constraint rewriting inspectable.",
        pedagogical_added_value: "Shows shared geometry under rewritten equations.",
        anti_spoiler: false,
        spoiler_boundary: null,
        representation_avoid: ["filled_worksheet"],
        requires_exact_data_match: true,
        source_basis: "A1.materials.A1-M1",
        caption_intent: "Three equivalent constraint representations.",
        discipline_risk_level: "high",
        reasoning_supported: "Learners compare rewritten constraints.",
        learner_stage: "pre_classification",
        canonical_discipline_note: "Preserve exact constraint equations and ∇f.",
        alt_text: "Three panels of equivalent constraints on the unit circle.",
        detailed_description:
          "Panels I–III show the unit circle with equations " +
          C4.I +
          ", " +
          C4.II +
          ", and " +
          C4.III +
          ", with objective gradient " +
          C4.grad +
          "."
      }
    ]
  };

  const planned = planner.planPrismVisualJobs(page);
  assert.equal(planned.valid, true, JSON.stringify(planned.errors || []));
  const compiled = compiler.compilePrismImageBriefs(planned);
  assert.equal(compiled.valid, true, JSON.stringify(compiled.errors || []));
  const brief = compiled.briefs.find(
    (row) => row.affordance_id === "va-A1-equivalent-constraints-01"
  );
  assert.ok(brief);
  const instruction = String(brief.generation_instruction || "");
  assert.match(instruction, /5b\. Precision-critical fidelity/);
  assert.match(instruction, /x\^2 \+ y\^2 - 1 = 0|x\^2\+y\^2-1=0/);
  assert.match(instruction, /\(x\^2/);
  assert.match(instruction, /∇f = \(1,1\)|∇f=\(1,1\)/);
  assert.doesNotMatch(instruction, /incomplete for precision-critical generation/i);
});
