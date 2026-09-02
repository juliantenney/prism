/**
 * S82 — Knowledge Summary formal-fidelity hardening (Lagrangian convention).
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const precision = require("../lib/prism-image-precision-fidelity.js");
const planner = require("../lib/prism-visual-jobs-planner.js");
const compiler = require("../lib/prism-image-brief-compiler.js");
const workspace = require("../lib/utilities-visual-jobs-workspace.js");
const grounding = require("../lib/prism-visual-material-role-grounding.js");
const fs = require("node:fs");
const path = require("node:path");

const romanRoadsPath = path.join(
  __dirname,
  "fixtures",
  "page-assemble",
  "roman-roads-visual-jobs-valid.json"
);

const L_FORM = "L(x,y,λ)=f(x,y)+λ[c-g(x,y)]";
const G_FORM = "g(x,y)=c";

function buildLagrangianKsPage(ksBody, affordanceOverrides) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Lagrange Multipliers for Economic Optimisation",
    visual_affordance_schema_version: "38.4",
    page_synthesis: {
      knowledge_summary: { body: ksBody, format: "markdown" },
      learning_purpose: {
        body: "Understand constrained optimisation with the taught Lagrangian convention.",
        format: "markdown"
      }
    },
    activities: [
      {
        activity_id: "A1",
        learner_task: "Read the knowledge summary.",
        materials: []
      }
    ],
    activities_visual_review: [
      {
        activity_id: "A1",
        activity_visual_value: { decision: "low", rationale: "Page synthesis carries the visual." }
      }
    ],
    visual_affordances: [
      Object.assign(
        {
          affordance_id: "va-page-knowledge-summary-01",
          scope: "page",
          region: "knowledge_summary",
          visual_decision: "generate",
          visual_slot: "knowledge-summary-after-content",
          tier: "essential",
          purpose: "synthesis",
          preferred_representation: "concept_map",
          subject: "Knowledge Summary Lagrangian synthesis",
          context:
            "Visual brief: consolidate the taught constraint and Lagrangian convention from the knowledge summary.",
          evidence_anchors: ["page_synthesis.knowledge_summary"],
          must_show: [L_FORM, G_FORM],
          must_not_show: ["completed learner transfer workspace"],
          allowed_claims: [
            "The resource uses constraint g(x,y)=c with Lagrangian L(x,y,λ)=f(x,y)+λ[c-g(x,y)]."
          ],
          disallowed_claims: [
            "Constraint displayed as g(x,y)=0",
            "Lagrangian displayed as L=f+λg without the [c-g] term"
          ],
          rationale: "Externalises the taught Lagrangian convention after synthesis prose.",
          pedagogical_added_value: "Integrates authorised formal relationships.",
          anti_spoiler: false,
          spoiler_boundary: null,
          representation_avoid: ["filled_worksheet"],
          requires_exact_data_match: false,
          source_basis: "page_synthesis.knowledge_summary",
          caption_intent: "Taught Lagrangian convention only.",
          discipline_risk_level: "high",
          reasoning_supported: "Consolidate authorised formal relationships.",
          learner_stage: "post_reasoning",
          canonical_discipline_note: "Use the taught c-minus-g Lagrangian convention only.",
          alt_text: "Lagrangian synthesis diagram.",
          detailed_description: "Shows the taught constraint and Lagrangian forms."
        },
        affordanceOverrides || {}
      )
    ]
  };
}

function compileSynthesisBrief(page) {
  const planned = planner.planPrismVisualJobs(page);
  assert.equal(planned.valid, true, planned.errors && planned.errors.map((e) => e.message).join("; "));
  const compiled = compiler.compilePrismImageBriefs(planned);
  assert.equal(compiled.valid, true, compiled.errors && compiled.errors.map((e) => e.message).join("; "));
  const brief = compiled.briefs.find((b) => b.affordance_id === "va-page-knowledge-summary-01");
  assert.ok(brief, "synthesis brief");
  return brief;
}

function plainKsBody() {
  return (
    "Under stated regularity conditions, the binding constraint is written " +
    G_FORM +
    ". The augmented objective uses " +
    L_FORM +
    ". First-order conditions follow from partial derivatives; this identifies candidate relationships only."
  );
}

test("formal identity: plain KS and must_show promote g(x,y)=c and L=...λ[c-g]", () => {
  const claims = precision.collectPrecisionCriticalClaims({
    sourceEvidence: [{ content_text: plainKsBody() }],
    mustShowItems: [L_FORM, G_FORM]
  });
  assert.ok(claims.some((c) => c.indexOf("g(x,y)=c") >= 0), "g(x,y)=c promoted");
  assert.ok(
    claims.some((c) => c.indexOf("λ[c-g(x,y)]") >= 0 || c.indexOf("λ[c-g") >= 0),
    "L with [c-g] promoted"
  );
});

test("plain-notation synthesis: human prompt emits precision block with anti-reparameterisation", () => {
  const brief = compileSynthesisBrief(buildLagrangianKsPage(plainKsBody()));
  const human = workspace.buildVisualJobHumanPrompt(brief);

  assert.match(human, /Authorised precision-critical relationships:/i);
  assert.match(human, /g\(x,y\)=c/);
  assert.match(human, /λ\[c-g\(x,y\)\]/);
  assert.match(human, /Precision-critical fidelity:/i);
  assert.match(human, /Do not reparameterise, normalise, rearrange, or substitute/i);
  assert.match(human, /Claim discipline:/i);
  assert.match(human, /Do not strengthen qualified or conditional claims/i);
  assert.match(human, /Commissioning cues \(subordinate\):/i);
});

test("plain-notation synthesis: canonical generation_instruction agrees with human prompt", () => {
  const brief = compileSynthesisBrief(buildLagrangianKsPage(plainKsBody()));
  const human = workspace.buildVisualJobHumanPrompt(brief);
  const canonical = String(brief.generation_instruction || "");

  assert.match(canonical, /Authorised precision-critical relationships:/i);
  assert.match(canonical, /g\(x,y\)=c/);
  assert.match(canonical, /λ\[c-g\(x,y\)\]/);
  assert.match(canonical, /5b\. Precision-critical fidelity/);
  assert.ok(canonical.includes(precision.ANTI_REPARAMETERISATION_LINE));
  assert.ok(human.includes(precision.ANTI_REPARAMETERISATION_LINE));
});

test("TeX KS variant: delimited forms also appear in precision authority", () => {
  const ks =
    "Taught forms: \\( g(x,y)=c \\) and \\( L(x,y,\\lambda)=f(x,y)+\\lambda[c-g(x,y)] \\).";
  const brief = compileSynthesisBrief(
    buildLagrangianKsPage(ks, {
      must_show: ["\\( g(x,y)=c \\)", "\\( L(x,y,\\lambda)=f(x,y)+\\lambda[c-g(x,y)] \\)"]
    })
  );
  const human = workspace.buildVisualJobHumanPrompt(brief);
  assert.match(human, /g\(x,y\)=c/);
  assert.match(human, /\[c-g\(x,y\)\]/);
});

test("Gate 1 unchanged: synthesis brief remains conceptual material role", () => {
  const brief = compileSynthesisBrief(buildLagrangianKsPage(plainKsBody()));
  assert.equal(brief.material_role.effective_policy, grounding.EFFECTIVE_POLICY.CONCEPTUAL);
  const human = workspace.buildVisualJobHumanPrompt(brief);
  assert.match(human, /Do not instantiate activity-specific scenario numerics/i);
});

test("Roman roads synthesis remains without maths precision fidelity", () => {
  const page = JSON.parse(fs.readFileSync(romanRoadsPath, "utf8"));
  const ws = workspace.buildVisualJobsWorkspaceState(page);
  const synthesisBrief = ws.compilerResult.briefs.find(
    (b) => b.affordance_id === "va-page-knowledge-summary-01"
  );
  assert.ok(synthesisBrief);
  const human = workspace.buildVisualJobHumanPrompt(synthesisBrief);
  assert.doesNotMatch(human, /Authorised precision-critical relationships:/i);
  assert.doesNotMatch(human, /Do not reparameterise, normalise, rearrange, or substitute/i);
  assert.match(human, /Claim discipline:/i);
});

test("prose must_show is not promoted as precision-critical identity", () => {
  assert.equal(
    precision.promoteMustShowFormalIdentity("relationship between required output and minimum cost"),
    null
  );
  const claims = precision.collectPrecisionCriticalClaims({
    mustShowItems: ["relationship between required output and minimum cost"]
  });
  assert.equal(claims.length, 0);
});
