/**
 * S82 — graphics claim-scope hardening (A5 tangency / cost-minimisation stress).
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const grounding = require("../lib/prism-visual-material-role-grounding.js");
const planner = require("../lib/prism-visual-jobs-planner.js");
const compiler = require("../lib/prism-image-brief-compiler.js");
const workspace = require("../lib/utilities-visual-jobs-workspace.js");

const romanRoadsPath = require("node:path").join(
  __dirname,
  "fixtures",
  "page-assemble",
  "roman-roads-visual-jobs-valid.json"
);
const fs = require("node:fs");

const OVER_STRONG_SUBJECT = "Optimal choice at a cost-minimising interior solution";
const OVER_STRONG_CONTEXT =
  "Show that equality of marginal trade-offs means cost is minimised for the firm.";

function buildA5TangencyStressPage() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Lagrange Multipliers for Economic Optimisation",
    visual_affordance_schema_version: "38.4",
    page_synthesis: {
      knowledge_summary: {
        body:
          "Under stated regularity conditions, first-order conditions can correspond to a regular-interior tangency between the objective and a binding constraint. This identifies a candidate relationship between parallel gradients — not unrestricted global optimality or sufficiency on its own.",
        format: "markdown"
      }
    },
    activities: [
      {
        activity_id: "A5",
        learner_task:
          "Connect parallel gradients and tangency to the regular-interior first-order condition without stating the completed transfer response.",
        materials: [
          {
            material_id: "A5-M1",
            material_type: "text",
            title: "FOC and tangency correspondence",
            body: "At a regular interior candidate, parallel gradients can represent the tangency condition between the objective and the constraint.",
            body_format: "markdown"
          }
        ]
      }
    ],
    activities_visual_review: [
      {
        activity_id: "A5",
        activity_visual_value: {
          decision: "high",
          rationale: "Geometric tangency supports FOC interpretation before transfer production."
        }
      }
    ],
    visual_affordances: [
      {
        affordance_id: "va-A5-tangency-01",
        scope: "activity",
        activity_id: "A5",
        visual_decision: "generate",
        rationale:
          "Externalise the regular-interior tangency correspondence while preserving candidate/conditional claim strength.",
        subject: OVER_STRONG_SUBJECT,
        context: OVER_STRONG_CONTEXT,
        evidence_anchors: [
          "A5.learner_task",
          "A5.materials.text",
          "page_synthesis.knowledge_summary"
        ],
        visual_slot: "materials-entry",
        tier: "valuable",
        purpose: "mechanism",
        preferred_representation: "annotated_system",
        pedagogical_added_value: "Adds inspectable tangency structure without the transfer answer.",
        reasoning_supported: "Connect objective, constraint, and parallel gradients at tangency.",
        learner_stage: "pre_classification",
        anti_spoiler: true,
        spoiler_boundary: {
          hide_answers: true,
          hide_classification_keys: true,
          hide_model_solution: true,
          allow_structural_hint: true
        },
        representation_avoid: ["filled_worksheet", "generic_infographic"],
        canonical_discipline_note: "Regular-interior candidate / first-order correspondence only.",
        requires_exact_data_match: false,
        must_show: [
          "objective and constraint curves meeting at tangency",
          "parallel gradients at the candidate tangency point"
        ],
        must_not_show: ["completed A5 transfer workspace response", "solved Lagrangian values"],
        allowed_claims: [
          "Parallel gradients can correspond to a regular-interior tangency condition under stated conditions.",
          "First-order conditions can represent a candidate tangency relationship — not global sufficiency."
        ],
        disallowed_claims: [
          "Optimal choice is established by tangency alone.",
          "Equality of marginal trade-offs means cost is minimised.",
          "The figure establishes a cost-minimising interior solution."
        ],
        source_basis: "A5.learner_task; A5.materials.text; page_synthesis.knowledge_summary",
        caption_intent: "Show tangency structure with qualified candidate framing only.",
        alt_text: "Regular-interior tangency correspondence diagram.",
        detailed_description:
          "Diagram linking objective and constraint at a candidate tangency with parallel gradients indicated.",
        discipline_risk_level: "medium"
      }
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

function indexBefore(haystack, earlier, later) {
  const a = haystack.indexOf(earlier);
  const b = haystack.indexOf(later);
  assert.ok(a >= 0, "missing marker: " + earlier);
  assert.ok(b >= 0, "missing marker: " + later);
  assert.ok(a < b, earlier + " should precede " + later);
}

test("A5 stress: claim discipline precedes over-strong commissioning cues in human prompt", () => {
  const brief = compileFirstBrief(buildA5TangencyStressPage());
  const prompt = workspace.buildVisualJobHumanPrompt(brief);

  assert.equal(brief.material_role.effective_policy, grounding.EFFECTIVE_POLICY.CONCEPTUAL);
  assert.match(prompt, /Do not strengthen qualified or conditional claims/i);
  assert.match(prompt, /Supported claim boundary: Parallel gradients can correspond/i);
  assert.match(prompt, /Do not claim: Equality of marginal trade-offs means cost is minimised/i);
  assert.match(prompt, /Model-class scope \(canonical_discipline_note\): Regular-interior candidate/i);
  assert.match(prompt, /Commissioning cues \(subordinate\):/i);
  assert.match(prompt, new RegExp("Subject cue: " + OVER_STRONG_SUBJECT.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(
    prompt,
    /Subject and context are commissioning cues only — not authoritative on-image claim labels/i
  );

  indexBefore(prompt, "Claim discipline:", "Commissioning cues (subordinate):");
  indexBefore(prompt, "Supported claim boundary:", "Subject cue:");
  indexBefore(prompt, "Do not claim: Optimal choice is established", "Subject cue:");
});

test("A5 stress: canonical generation_instruction mirrors claim-scope hierarchy", () => {
  const brief = compileFirstBrief(buildA5TangencyStressPage());
  const canonical = String(brief.generation_instruction || "");
  const human = workspace.buildVisualJobHumanPrompt(brief);

  assert.match(canonical, /3\. Claim boundaries[\s\S]*Do not strengthen qualified or conditional claims/);
  assert.match(canonical, /4\. Commissioning cues \(subordinate\)[\s\S]*subject: Optimal choice at a cost-minimising/);
  assert.match(canonical, /disallowed_claims:[\s\S]*Equality of marginal trade-offs means cost is minimised/);
  assert.match(canonical, /canonical_discipline_note: Regular-interior candidate/);

  indexBefore(canonical, "3. Claim boundaries", "4. Commissioning cues (subordinate)");
  indexBefore(canonical, "4. Commissioning cues (subordinate)", "5. Evidence basis");
  indexBefore(canonical, "- subject: Optimal choice", "- context: Show that equality");

  assert.match(human, /Do not strengthen qualified or conditional claims/);
  assert.match(canonical, /Do not strengthen qualified or conditional claims/);
  assert.match(human, /Subject and context are commissioning cues only/);
  assert.match(canonical, /Subject and context are commissioning cues only/);
});

test("A5 stress: material-role grounding remains conceptual (Gate 1 intact)", () => {
  const brief = compileFirstBrief(buildA5TangencyStressPage());
  const prompt = workspace.buildVisualJobHumanPrompt(brief);
  assert.match(prompt, /Material role:/i);
  assert.match(prompt, /Do not instantiate activity-specific scenario numerics/i);
  assert.doesNotMatch(prompt, /Represented material \(authoritative\)/i);
});

test("non-optimisation Roman roads activity prompt remains valid and unchanged in mode", () => {
  const page = JSON.parse(fs.readFileSync(romanRoadsPath, "utf8"));
  const ws = workspace.buildVisualJobsWorkspaceState(page);
  const activityBrief = ws.compilerResult.briefs.find((b) => b.affordance_id === "va-a1-concept-map-01");
  assert.ok(activityBrief);
  const prompt = workspace.buildVisualJobHumanPrompt(activityBrief);
  assert.match(prompt, /activity learning support/i);
  assert.match(prompt, /Claim discipline:/i);
  assert.match(prompt, /Do not strengthen qualified or conditional claims/i);
  assert.match(prompt, /Commissioning cues \(subordinate\):/i);
  assert.match(prompt, /Roman road network relationships/i);
});
