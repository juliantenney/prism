/**
 * Regression: Design Page visual_affordances must keep mandatory rationale
 * after textbook figure-description fields (alt_text, detailed_description) were added.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const s38 = require("../lib/sprint38-visual-affordances.js");
const vpc = require("../lib/visual-planning-contract.js");
const planner = require("../lib/prism-visual-jobs-planner.js");
const compiler = require("../lib/prism-image-brief-compiler.js");
const figureContract = require("../lib/learner-figure-description-contract.js");

const RNA_LIKE = path.join(
  __dirname,
  "fixtures",
  "page-assemble",
  "rna-hcv-visual-affordances-with-figure-desc.json"
);

function extractExampleJson(appSource, varName) {
  const marker = "var " + varName + " =";
  const start = appSource.indexOf(marker);
  assert.ok(start >= 0, "missing " + varName);
  let i = appSource.indexOf("'", start) + 1;
  let out = "";
  while (i < appSource.length) {
    const c = appSource[i];
    if (c === "\\") {
      out += c + appSource[i + 1];
      i += 2;
      continue;
    }
    if (c === "'") break;
    out += c;
    i += 1;
  }
  return JSON.parse(
    out
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\")
  );
}

test("1. substantive generate affordance requires rationale", () => {
  const row = {
    affordance_id: "va-a1-rna-classification",
    scope: "activity",
    activity_id: "A1",
    visual_decision: "generate",
    visual_slot: "materials-entry",
    tier: "valuable",
    purpose: "classification",
    preferred_representation: "classification_matrix",
    subject: "RNA virus classification cues",
    context: "Visual brief: compare virus families by genome and entry traits.",
    evidence_anchors: ["A1.learner_task", "A1.materials.scenarios"],
    reasoning_supported: "Classify without answer key.",
    learner_stage: "pre_classification",
    anti_spoiler: true,
    spoiler_boundary: {
      hide_answers: true,
      hide_classification_keys: true,
      hide_model_solution: true,
      allow_structural_hint: true
    },
    representation_avoid: ["filled_worksheet", "summary_table"],
    canonical_discipline_note: "Empty labelled cues only.",
    requires_exact_data_match: false,
    must_show: ["genome type cues", "entry route cues"],
    must_not_show: ["completed classifications"],
    allowed_claims: ["RNA viruses differ by genome and entry traits."],
    disallowed_claims: ["All RNA viruses enter identically."],
    source_basis: "A1.learner_task; A1.materials.scenarios",
    caption_intent: "Classification cues only.",
    alt_text: "RNA virus classification cues by genome and entry; detailed description follows.",
    detailed_description:
      "A matrix contrasts virus examples by genome organisation and entry route labels. Cells stay empty for learner classification.",
    discipline_risk_level: "medium"
    // rationale intentionally omitted
  };
  const errors = s38.validateAffordanceEnvelope(row, 0);
  assert.ok(errors.some((e) => /rationale is required/i.test(e)));
});

test("2. canonical examples contain rationale, alt_text, and detailed_description together", () => {
  const appSource = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  const generate = extractExampleJson(appSource, "exampleGenerate");
  const ks = extractExampleJson(appSource, "exampleKnowledgeSummary");
  for (const ex of [generate, ks]) {
    assert.ok(String(ex.rationale || "").trim(), "rationale present");
    assert.ok(String(ex.alt_text || "").trim(), "alt_text present");
    assert.ok(String(ex.detailed_description || "").trim(), "detailed_description present");
    assert.ok(String(ex.caption_intent || "").trim(), "caption_intent present");
  }
});

test("3. rationale guidance explains instructional value rather than repeating title", () => {
  const appSource = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  assert.match(appSource, /rationale \(mandatory on every row\)/i);
  assert.match(appSource, /making a sequence inspectable/i);
  assert.match(appSource, /Do not merely restate the title, visual type, or activity topic/i);
  assert.match(
    appSource,
    /Do not omit rationale when authoring alt_text\/detailed_description/i
  );
  assert.match(
    appSource,
    /Hard requirement reminder: every generate\/defer\/skip visual_affordances\[] row must still include non-empty rationale/i
  );
  const generate = extractExampleJson(appSource, "exampleGenerate");
  assert.doesNotMatch(String(generate.rationale), /^Inflation mechanism classification cues$/i);
  assert.match(String(generate.rationale), /inspectable|discriminat|pathway|before completing/i);
  const domain = fs.readFileSync(
    path.join(repoRoot, "domains", "learning-design", "domain-learning-design-step-patterns.md"),
    "utf8"
  );
  assert.match(domain, /do not omit rationale when adding those fields/i);
});

test("4. rationale + figure fields survive planning and image-brief compilation", () => {
  const page = JSON.parse(fs.readFileSync(RNA_LIKE, "utf8"));
  const planned = planner.planPrismVisualJobs(page);
  assert.ok(planned.jobs && planned.jobs.length >= 3);
  const job = planned.jobs.find((j) => j.affordance_id === "va-a1-rna-classification");
  assert.ok(job);
  assert.ok(String(job.rationale || "").trim());
  assert.ok(String(job.alt_text || "").trim());
  assert.ok(String(job.detailed_description || "").trim());
  const compiled = compiler.compilePrismImageBriefs(planned);
  const brief = compiled.briefs.find((b) => b.affordance_id === "va-a1-rna-classification");
  assert.ok(brief);
  assert.equal(brief.alt_text, job.alt_text);
  assert.equal(brief.detailed_description, job.detailed_description);
  assert.match(String(brief.generation_instruction || ""), /Learner-facing figure copy/i);
});

test("5. missing rationale still fails VPC validation", () => {
  const page = JSON.parse(fs.readFileSync(RNA_LIKE, "utf8"));
  delete page.visual_affordances[0].rationale;
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, false);
  const messages = (result.errors || []).map((e) => String(e.message || e));
  assert.ok(
    messages.some((m) => /rationale is required/i.test(m)),
    "expected VPC rationale failure, got: " + messages.join(" | ")
  );
  assert.ok(
    (result.errors || []).some((e) => e.code === "VPC_AFFORDANCE_ROW_INVALID"),
    "expected VPC_AFFORDANCE_ROW_INVALID"
  );
});

test("6. RNA-like affordance shape with rationale + figure fields passes VPC", () => {
  const page = JSON.parse(fs.readFileSync(RNA_LIKE, "utf8"));
  const ids = page.visual_affordances.map((r) => r.affordance_id);
  assert.deepEqual(ids, [
    "va-a1-rna-classification",
    "va-a3-entry-process",
    "va-a4-replication-system"
  ]);
  page.visual_affordances.forEach((row) => {
    assert.ok(String(row.rationale || "").trim());
    assert.ok(String(row.alt_text || "").trim());
    assert.ok(String(row.detailed_description || "").trim());
    assert.ok(String(row.caption_intent || "").trim());
  });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, true, JSON.stringify(result.errors || [], null, 2));
});

test("figure-description contract guidance keeps rationale mandatory", () => {
  const lines = figureContract.buildFigureDescriptionAuthoringGuidanceLines().join("\n");
  assert.match(lines, /CRITICAL: also keep a non-empty rationale/i);
  assert.match(lines, /NOT replaced by alt_text/i);
  assert.match(lines, /Do NOT copy detailed_description into rationale/i);
});

test("partial contract mentions rationale with figure fields", () => {
  const partial = require("../lib/ld-design-page-partial-contract.js");
  const block = partial.buildDesignPagePartialContractBlock();
  assert.match(block, /non-empty rationale/i);
  assert.match(block, /FAIL-CLOSED: every visual_affordances\[] row MUST include a non-empty rationale/i);
  assert.match(block, /pedagogically\/usefully warranted/i);
  assert.match(block, /alt_text/);
  assert.match(block, /detailed_description/);
  const envelopeRequired = [
    "affordance_id",
    "scope",
    "activity_id",
    "region",
    "visual_decision",
    "rationale",
    "subject",
    "context",
    "evidence_anchors"
  ];
  const generateRequired = [
    "visual_slot",
    "tier",
    "purpose",
    "preferred_representation",
    "reasoning_supported",
    "learner_stage",
    "anti_spoiler",
    "spoiler_boundary",
    "representation_avoid",
    "canonical_discipline_note",
    "requires_exact_data_match",
    "must_show",
    "must_not_show",
    "allowed_claims",
    "disallowed_claims",
    "source_basis",
    "caption_intent",
    "discipline_risk_level"
  ];
  for (const field of envelopeRequired.concat(generateRequired)) {
    assert.match(block, new RegExp(field), "partial contract missing required child: " + field);
  }
  assert.match(block, /defer also requires defer_reason/i);
  assert.match(block, /skip also requires skip_reason/i);
});

test("FAIL-CLOSED rationale is model-visible in Sprint 38 authoring contract", () => {
  const appSource = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  assert.match(
    appSource,
    /FAIL-CLOSED: every visual_affordances\[] row MUST include a non-empty rationale explaining why that visual is pedagogically\/usefully warranted/i
  );
  assert.match(
    appSource,
    /Every visual_affordances\[] row must include non-empty rationale \(pedagogically warranted\) plus the Sprint 38 required children/i
  );
});

test("validators and schema still fail-closed on rationale (unchanged)", () => {
  const s38Src = fs.readFileSync(path.join(repoRoot, "lib", "sprint38-visual-affordances.js"), "utf8");
  const vpcSrc = fs.readFileSync(path.join(repoRoot, "lib", "visual-planning-contract.js"), "utf8");
  assert.match(s38Src, /var SCHEMA_VERSION = "38\.4"/);
  assert.match(s38Src, /errors\.push\(prefix \+ "rationale is required"\)/);
  assert.match(s38Src, /purpose/);
  assert.match(s38Src, /preferred_representation/);
  assert.match(s38Src, /canonical_discipline_note/);
  assert.match(vpcSrc, /VPC_GENERATE_SUBJECT_REQUIRED/);
  assert.match(vpcSrc, /evidence_anchors array is required for generate/);
  const row = {
    affordance_id: "va-x",
    scope: "activity",
    activity_id: "A1",
    visual_decision: "generate",
    visual_slot: "materials-entry",
    tier: "valuable",
    purpose: "classification",
    preferred_representation: "classification_matrix",
    subject: "Cues",
    context: "Visual brief: compare families.",
    evidence_anchors: ["A1.learner_task"],
    reasoning_supported: "Classify.",
    learner_stage: "pre_classification",
    anti_spoiler: true,
    spoiler_boundary: {
      hide_answers: true,
      hide_classification_keys: true,
      hide_model_solution: true,
      allow_structural_hint: true
    },
    representation_avoid: ["filled_worksheet"],
    canonical_discipline_note: "Empty cues.",
    requires_exact_data_match: false,
    must_show: ["cue a"],
    must_not_show: ["answers"],
    allowed_claims: ["Families differ."],
    disallowed_claims: ["All identical."],
    source_basis: "A1.learner_task",
    caption_intent: "Cues only.",
    discipline_risk_level: "low"
  };
  assert.ok(s38.validateAffordanceEnvelope(row, 0).some((e) => /rationale is required/i.test(e)));
});
