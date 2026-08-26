/**
 * Image-prompt precision-fidelity repair — late formulas, anti-invention, carve-outs.
 * Domain-generic; no subject-matter formula patches.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const precision = require("../lib/prism-image-precision-fidelity.js");
const workspace = require("../lib/utilities-visual-jobs-workspace.js");
const compiler = require("../lib/prism-image-brief-compiler.js");
const planner = require("../lib/prism-visual-jobs-planner.js");

const romanRoadsPath = path.join(
  __dirname,
  "fixtures",
  "page-assemble",
  "roman-roads-visual-jobs-valid.json"
);

const LATE_DERIVATIVE_TEX = "\\(\\lambda = \\frac{dC^*}{d\\bar q}\\)";

function longKnowledgeSummaryWithLateDerivative() {
  const pad =
    "Constrained optimisation characterises stationary points using first-order conditions on an augmented objective. ";
  let body = "";
  while (body.length < 620) body += pad;
  body +=
    "After introducing the augmented objective and taking partial derivatives with respect to the choice variables and the multiplier, the resulting first-order conditions can be solved together to characterise a candidate. ";
  body +=
    "In the firm problem, the multiplier satisfies " +
    LATE_DERIVATIVE_TEX +
    ": the local marginal change in minimum cost associated with a small change in required output.";
  return body;
}

function synthesisBriefWithKs(ksBody, overrides) {
  const opts = overrides && typeof overrides === "object" ? overrides : {};
  const brief = {
    brief_id: "vb-precision-synthesis",
    job_id: "vj-precision-synthesis",
    affordance_id: "va-page-knowledge-summary-01",
    scope: "page",
    region: "knowledge_summary",
    purpose: "synthesis",
    preferred_representation: "concept_map",
    subject: "Constrained optimisation relationships",
    context: "Synthesis visual consolidating taught firm relationships.",
    visual_slot: "knowledge-summary-after-content",
    content_requirements: {
      authored: opts.must_show || [
        "relationship between required output and minimum cost"
      ],
      derived: []
    },
    exclusion_requirements: {
      authored_must_not_show: [],
      authored_representation_avoid: []
    },
    claim_constraints: {
      allowed: opts.allowed_claims || [
        "The firm relationship links required output to minimum cost."
      ],
      disallowed: []
    },
    spoiler_constraints: { anti_spoiler: false, boundary: null },
    source_evidence: [
      {
        anchor: "page_synthesis.knowledge_summary",
        field: "knowledge_summary",
        source_kind: "knowledge_summary",
        content_text: ksBody
      }
    ],
    pedagogical_metadata: {},
    composition: {
      representation: "concept_map",
      learner_stage: "post_reasoning"
    }
  };
  if (opts.requires_exact_data_match === true) {
    brief.requires_exact_data_match = true;
  }
  return brief;
}

function compileCanonicalWithKs(ksBody, affordanceOverrides) {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Precision fidelity fixture",
    visual_affordance_schema_version: "38.4",
    page_synthesis: {
      knowledge_summary: { body: ksBody, format: "markdown" },
      learning_purpose: { body: "Understand constrained optima.", format: "markdown" }
    },
    activities: [
      {
        activity_id: "A1",
        title: "Orientation",
        learner_task: "Read the overview.",
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
          subject: "Constrained optimisation relationships",
          context: "Synthesis visual consolidating taught firm relationships.",
          evidence_anchors: ["page_synthesis.knowledge_summary"],
          must_show: ["relationship between required output and minimum cost"],
          must_not_show: ["Unrelated worksheet answer keys"],
          allowed_claims: [
            "The firm relationship links required output to minimum cost."
          ],
          disallowed_claims: ["Claims stronger than the taught model"],
          rationale: "Consolidate taught relationships.",
          pedagogical_added_value: "Integrates authorised relationships.",
          anti_spoiler: false,
          spoiler_boundary: null,
          representation_avoid: ["filled_worksheet"],
          requires_exact_data_match: false,
          source_basis: "page_synthesis.knowledge_summary",
          caption_intent: "Authorised relationships only.",
          discipline_risk_level: "high",
          reasoning_supported: "Learners consolidate authorised relationships.",
          learner_stage: "post_reasoning",
          canonical_discipline_note: "Preserve taught formal relationships.",
          alt_text: "Diagram of constrained optimisation relationships.",
          detailed_description: "Shows authorised relationships among taught variables."
        },
        affordanceOverrides || {}
      )
    ]
  };
  const planned = planner.planPrismVisualJobs(page);
  assert.equal(planned.valid, true, JSON.stringify(planned.errors || []));
  const compiled = compiler.compilePrismImageBriefs(planned);
  assert.equal(compiled.valid, true, JSON.stringify(compiled.errors || []));
  const brief = compiled.briefs.find(
    (row) => row.affordance_id === "va-page-knowledge-summary-01"
  );
  assert.ok(brief, "synthesis brief");
  return brief;
}

test("extractPrecisionCriticalClaims captures TeX inline derivative forms", () => {
  const claims = precision.extractPrecisionCriticalClaims(
    "Prose then " + LATE_DERIVATIVE_TEX + " then more prose."
  );
  assert.ok(claims.some((c) => c.indexOf("dC^*") >= 0 || c.indexOf("lambda") >= 0));
  assert.ok(claims.some((c) => c.indexOf(LATE_DERIVATIVE_TEX) >= 0 || /\\frac\{dC\^/.test(c)));
});

test("Test A — late formula preserved in human and canonical prompts", () => {
  const ks = longKnowledgeSummaryWithLateDerivative();
  assert.ok(ks.length > 560, "fixture must exceed human evidence clip");
  assert.ok(
    ks.indexOf(LATE_DERIVATIVE_TEX) > 560,
    "derivative must sit after the ordinary truncation boundary"
  );

  const humanBrief = synthesisBriefWithKs(ks);
  const humanPrompt = workspace.buildVisualJobHumanPrompt(humanBrief);
  const evidenceBlock = humanPrompt.match(
    /Authorised source evidence:[\s\S]*?(?=\nAuthorised precision-critical relationships:|\nVisual structure:|\nShow:)/
  );
  assert.ok(evidenceBlock, "evidence section present");
  assert.doesNotMatch(evidenceBlock[0], /\\frac\{dC\^/);
  assert.match(humanPrompt, /Authorised precision-critical relationships:/i);
  assert.match(humanPrompt, /\\frac\{dC\^/);
  assert.ok(
    humanPrompt.indexOf(LATE_DERIVATIVE_TEX) >= 0 ||
      /\\lambda\s*=\s*\\frac\{dC\^/.test(humanPrompt)
  );

  const compiled = compileCanonicalWithKs(ks);
  const canonical = String(compiled.generation_instruction || "");
  assert.match(canonical, /5\. Evidence basis/);
  assert.match(canonical, /5b\. Precision-critical fidelity/);
  assert.match(canonical, /\\frac\{dC\^/);
  const evidenceIdx = canonical.indexOf("5. Evidence basis");
  const precisionIdx = canonical.indexOf("5b. Precision-critical fidelity");
  const requiredIdx = canonical.indexOf("6. Required content");
  assert.ok(evidenceIdx < precisionIdx && precisionIdx < requiredIdx);
});

test("Test B — abstract must_show still accompanied by exact source formula", () => {
  const ks = longKnowledgeSummaryWithLateDerivative();
  const brief = synthesisBriefWithKs(ks, {
    must_show: ["relationship between required output and minimum cost"]
  });
  const prompt = workspace.buildVisualJobHumanPrompt(brief);
  assert.match(prompt, /Show:/);
  assert.match(prompt, /relationship between required output and minimum cost/i);
  assert.match(prompt, /Authorised precision-critical relationships:/i);
  assert.match(prompt, /\\frac\{dC\^/);
});

test("Test C — precision fidelity section when formal claims exist", () => {
  const brief = synthesisBriefWithKs(longKnowledgeSummaryWithLateDerivative());
  const prompt = workspace.buildVisualJobHumanPrompt(brief);
  assert.match(prompt, /Precision-critical fidelity:/i);
  assert.match(prompt, /Preserve authorised equations/i);
  assert.match(prompt, /Do NOT derive, invent, substitute/i);
  assert.match(prompt, /represent the connection qualitatively/i);
  const diag = workspace.diagnoseHumanPrompt(prompt, brief);
  assert.equal(diag.precision_fidelity_section_present, true);
  assert.equal(diag.precision_critical_claims_present, true);
});

test("Test D — non-mathematical visual omits maths fidelity boilerplate", () => {
  const page = JSON.parse(fs.readFileSync(romanRoadsPath, "utf8"));
  const ws = workspace.buildVisualJobsWorkspaceState(page);
  const synthesisBrief = ws.compilerResult.briefs.find(
    (b) => b.affordance_id === "va-page-knowledge-summary-01"
  );
  assert.ok(synthesisBrief);
  const prompt = workspace.buildVisualJobHumanPrompt(synthesisBrief);
  assert.doesNotMatch(prompt, /Precision-critical fidelity:/i);
  assert.doesNotMatch(prompt, /Authorised precision-critical relationships:/i);
  assert.match(
    prompt,
    /authorised only qualitatively and no exact formal relationship/i
  );
  assert.doesNotMatch(prompt, /never reproduce source materials verbatim/i);
});

test("Test E — requires_exact_data_match emits exactness language", () => {
  const brief = synthesisBriefWithKs("Roman roads supported imperial connectivity.", {
    must_show: ["road corridors"],
    allowed_claims: ["Road networks supported imperial connectivity."],
    requires_exact_data_match: true
  });
  const prompt = workspace.buildVisualJobHumanPrompt(brief);
  assert.match(prompt, /Precision-critical fidelity:/i);
  assert.match(prompt, /requires exact data match/i);
});

test("Test F — anti-verbatim carve-out for authorised formal forms", () => {
  const prompt = workspace.buildVisualJobHumanPrompt(
    synthesisBriefWithKs(longKnowledgeSummaryWithLateDerivative())
  );
  assert.match(prompt, /Do not copy source prose passages onto the image/i);
  assert.match(prompt, /authorised precision-critical formal forms/i);
  assert.match(prompt, /MAY and SHOULD be reproduced exactly/i);
  assert.doesNotMatch(
    prompt,
    /never reproduce source materials verbatim/i
  );
});

test("Test G companion — qualitative no-invented-equation rule remains on Roman roads", () => {
  const page = JSON.parse(fs.readFileSync(romanRoadsPath, "utf8"));
  const ws = workspace.buildVisualJobsWorkspaceState(page);
  const synthesisBrief = ws.compilerResult.briefs.find(
    (b) => b.affordance_id === "va-page-knowledge-summary-01"
  );
  const prompt = workspace.buildVisualJobHumanPrompt(synthesisBrief);
  assert.match(
    prompt,
    /If a relationship is authorised only qualitatively and no exact formal relationship is supplied, do not invent an equation/
  );
  const canonical = String(synthesisBrief.generation_instruction || "");
  assert.match(canonical, /do not invent an equation/i);
});
