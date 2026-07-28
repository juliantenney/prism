/**
 * Sprint 70 Slice 3 — Design Page → Prism visual-planning contract validation.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const vpc = require("../lib/visual-planning-contract.js");
const s38 = require("../lib/sprint38-visual-affordances.js");
const assemble = require("../lib/page-vnext-assemble.js");

const repoRoot = path.resolve(__dirname, "..");
const dpPartialWithVaPath = path.join(repoRoot, "tests", "fixtures", "page-assemble", "dp-partial-with-va.json");

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

const ACTIVITIES = [
  { activity_id: "A1", title: "Activity one" },
  { activity_id: "A2", title: "Activity two" }
];

function basePlanningEnvelope(overrides) {
  return Object.assign(
    {
      visual_affordance_schema_version: "38.4",
      activities_visual_review: [],
      visual_affordances: [],
      activities: ACTIVITIES
    },
    overrides || {}
  );
}

function validActivityGenerate(overrides) {
  return Object.assign(
    {
      affordance_id: "va-A1-generate-01",
      scope: "activity",
      activity_id: "A1",
      visual_decision: "generate",
      visual_slot: "materials-entry",
      tier: "valuable",
      purpose: "classification",
      preferred_representation: "classification_matrix",
      subject: "Inflation mechanism classification cues",
      context: "Visual brief: compare demand-pull and cost-push mechanisms.",
      evidence_anchors: ["A1.learner_task", "A1.materials.scenarios"],
      must_show: ["demand-pull pathway cues"],
      must_not_show: ["scenario answer key"],
      allowed_claims: ["Different causal mechanisms can produce inflation."],
      disallowed_claims: ["All inflation has one cause."],
      rationale: "Classify scenarios by mechanism before the analysis table.",
      anti_spoiler: true,
      spoiler_boundary: {
        hide_answers: true,
        hide_classification_keys: true,
        hide_model_solution: true,
        allow_structural_hint: true
      },
      representation_avoid: ["filled_worksheet", "summary_table"],
      requires_exact_data_match: false,
      source_basis: "A1 learner_task; A1 materials.scenarios",
      caption_intent: "Cause-type cues only.",
      discipline_risk_level: "medium",
      reasoning_supported: "Learners classify without completed classifications.",
      learner_stage: "pre_classification",
      canonical_discipline_note: "Empty labelled cause structures only."
    },
    overrides || {}
  );
}

function validPageGenerate(overrides) {
  return validActivityGenerate(
    Object.assign(
      {
        affordance_id: "va-page-knowledge-summary-01",
        scope: "page",
        region: "knowledge_summary",
        activity_id: undefined,
        visual_slot: "knowledge-summary-after-content",
        tier: "essential",
        purpose: "synthesis",
        preferred_representation: "concept_map",
        subject: "Knowledge Summary inference map",
        context: "Visual brief: synthesize demand-pull and cost-push links to CPI.",
        evidence_anchors: ["page_synthesis.knowledge_summary", "page_synthesis.learning_purpose"]
      },
      overrides || {}
    )
  );
}

function validDefer(overrides) {
  return {
    affordance_id: "va-A2-defer-01",
    scope: "activity",
    activity_id: "A2",
    visual_decision: "defer",
    defer_reason: "worked_example_sufficient_first",
    rationale: "Attempt the worked example before any visual summary."
  };
}

function validSkip(overrides) {
  return {
    affordance_id: "va-A2-skip-01",
    scope: "activity",
    activity_id: "A2",
    visual_decision: "skip",
    skip_reason: "assessment_text_sufficient",
    rationale: "Debrief text is sufficient; a visual would duplicate closure."
  };
}

function codes(result) {
  return (result.errors || []).map((row) => row.code);
}

function hasCode(result, code) {
  return codes(result).includes(code);
}

// --- Authoritative planning detection ---

test("Slice 3: page with no visual-planning fields is valid legacy input", () => {
  const page = { title: "Legacy page", activities: ACTIVITIES };
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, true);
  assert.equal(result.authoritative_planning_present, false);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.summary, {
    activity_reviews: 0,
    affordances: 0,
    generate: 0,
    defer: 0,
    skip: 0,
    page_scoped: 0,
    activity_scoped: 0
  });
});

test("Slice 3: full visual-planning fields are detected as authoritative", () => {
  const page = basePlanningEnvelope({
    activities_visual_review: [
      { activity_id: "A1", activity_visual_value: { decision: "high", rationale: "Supports matrix." } }
    ],
    visual_affordances: [validActivityGenerate()]
  });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.authoritative_planning_present, true);
  assert.equal(result.schema_version, "38.4");
  assert.equal(result.valid, true, JSON.stringify(result.errors));
});

test("Slice 3: partial visual-planning field presence is diagnosed", () => {
  const page = {
    activities: ACTIVITIES,
    visual_affordances: [validActivityGenerate()]
  };
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.authoritative_planning_present, true);
  assert.equal(result.valid, false);
  assert.ok(hasCode(result, "VPC_SCHEMA_VERSION_MISSING"));
});

// --- Schema version ---

test("Slice 3: supported version validates", () => {
  const page = basePlanningEnvelope({ visual_affordances: [validActivityGenerate()] });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, true);
  assert.equal(result.schema_version, "38.4");
});

test("Slice 3: missing version with planning present fails", () => {
  const page = {
    activities: ACTIVITIES,
    activities_visual_review: [],
    visual_affordances: [validActivityGenerate()]
  };
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, false);
  assert.ok(hasCode(result, "VPC_SCHEMA_VERSION_MISSING"));
});

test("Slice 3: malformed version fails", () => {
  const page = basePlanningEnvelope({
    visual_affordance_schema_version: "",
    visual_affordances: [validActivityGenerate()]
  });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, false);
  assert.ok(hasCode(result, "VPC_SCHEMA_VERSION_MALFORMED"));
});

test("Slice 3: unknown version is diagnosed deterministically", () => {
  const page = basePlanningEnvelope({
    visual_affordance_schema_version: "99.0",
    visual_affordances: [validActivityGenerate()]
  });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, false);
  assert.ok(hasCode(result, "VPC_SCHEMA_VERSION_UNSUPPORTED"));
  const again = vpc.validateVisualPlanningContract(page);
  assert.deepEqual(again.errors, result.errors);
});

// --- Activity review ---

test("Slice 3: valid review rows pass", () => {
  const page = basePlanningEnvelope({
    activities_visual_review: [
      { activity_id: "A1", activity_visual_value: { decision: "high", rationale: "Matrix support." } },
      { activity_id: "A2", activity_visual_value: { decision: "medium", rationale: "Comparison cues." } }
    ]
  });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, true, JSON.stringify(result.errors));
  assert.equal(result.summary.activity_reviews, 2);
});

test("Slice 3: duplicate activity review IDs fail", () => {
  const page = basePlanningEnvelope({
    activities_visual_review: [
      { activity_id: "A1", activity_visual_value: { decision: "high", rationale: "One." } },
      { activity_id: "A1", activity_visual_value: { decision: "low", rationale: "Duplicate." } }
    ]
  });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => /duplicate activity_id/i.test(e.message)));
});

test("Slice 3: unknown activity IDs in review fail", () => {
  const page = basePlanningEnvelope({
    activities_visual_review: [
      { activity_id: "A9", activity_visual_value: { decision: "high", rationale: "Missing activity." } }
    ]
  });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, false);
  assert.ok(hasCode(result, "VPC_REVIEW_UNKNOWN_ACTIVITY_ID"));
});

test("Slice 3: invalid review decision fails", () => {
  const page = basePlanningEnvelope({
    activities_visual_review: [
      { activity_id: "A1", activity_visual_value: { decision: "extreme", rationale: "Bad token." } }
    ]
  });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => /decision must be high/i.test(e.message)));
});

// --- Affordances ---

test("Slice 3: valid activity-scoped generate row passes", () => {
  const page = basePlanningEnvelope({ visual_affordances: [validActivityGenerate()] });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, true, JSON.stringify(result.errors));
  assert.equal(result.summary.generate, 1);
  assert.equal(result.summary.activity_scoped, 1);
});

test("Slice 3: valid page-scoped generate row passes", () => {
  const row = validPageGenerate();
  delete row.activity_id;
  const page = basePlanningEnvelope({ visual_affordances: [row] });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, true, JSON.stringify(result.errors));
  assert.equal(result.summary.page_scoped, 1);
});

test("Slice 3: valid defer row passes", () => {
  const page = basePlanningEnvelope({ visual_affordances: [validDefer()] });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, true, JSON.stringify(result.errors));
  assert.equal(result.summary.defer, 1);
});

test("Slice 3: valid skip row passes", () => {
  const page = basePlanningEnvelope({ visual_affordances: [validSkip()] });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, true, JSON.stringify(result.errors));
  assert.equal(result.summary.skip, 1);
});

test("Slice 3: duplicate affordance IDs fail", () => {
  const row = validActivityGenerate();
  const page = basePlanningEnvelope({
    visual_affordances: [row, clone(row)]
  });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, false);
  assert.ok(hasCode(result, "VPC_AFFORDANCE_DUPLICATE_ID"));
});

test("Slice 3: unknown visual_decision fails", () => {
  const page = basePlanningEnvelope({
    visual_affordances: [validActivityGenerate({ visual_decision: "maybe" })]
  });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => /visual_decision must be/i.test(e.message)));
});

test("Slice 3: unknown scope fails", () => {
  const page = basePlanningEnvelope({
    visual_affordances: [validActivityGenerate({ scope: "module" })]
  });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => /scope must be activity/i.test(e.message)));
});

test("Slice 3: activity scope without activity_id fails", () => {
  const row = validActivityGenerate();
  delete row.activity_id;
  const page = basePlanningEnvelope({ visual_affordances: [row] });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, false);
  assert.ok(hasCode(result, "VPC_ACTIVITY_SCOPE_MISSING_ACTIVITY_ID"));
});

test("Slice 3: activity scope with unknown activity_id fails", () => {
  const page = basePlanningEnvelope({
    visual_affordances: [validActivityGenerate({ activity_id: "A9" })]
  });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, false);
  assert.ok(hasCode(result, "VPC_ACTIVITY_SCOPE_UNKNOWN_ACTIVITY_ID"));
});

test("Slice 3: page scope does not require activity_id", () => {
  const row = validPageGenerate();
  delete row.activity_id;
  const page = basePlanningEnvelope({ visual_affordances: [row] });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, true, JSON.stringify(result.errors));
});

test("Slice 3: malformed page-scope activity linkage is diagnosed", () => {
  const page = basePlanningEnvelope({
    visual_affordances: [
      validPageGenerate({
        activity_id: "A1"
      })
    ]
  });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, false);
  assert.ok(hasCode(result, "VPC_PAGE_SCOPE_ACTIVITY_ID_FORBIDDEN"));
});

// --- Generate requirements ---

test("Slice 3: missing visual_slot fails", () => {
  const page = basePlanningEnvelope({
    visual_affordances: [validActivityGenerate({ visual_slot: "" })]
  });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => /visual_slot/i.test(e.message)));
});

test("Slice 3: missing purpose fails", () => {
  const page = basePlanningEnvelope({
    visual_affordances: [validActivityGenerate({ purpose: "" })]
  });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => /purpose/i.test(e.message)));
});

test("Slice 3: missing preferred_representation fails", () => {
  const page = basePlanningEnvelope({
    visual_affordances: [validActivityGenerate({ preferred_representation: "" })]
  });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => /preferred_representation/i.test(e.message)));
});

test("Slice 3: missing subject fails", () => {
  const page = basePlanningEnvelope({
    visual_affordances: [validActivityGenerate({ subject: "" })]
  });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, false);
  assert.ok(hasCode(result, "VPC_GENERATE_SUBJECT_REQUIRED"));
});

test("Slice 3: missing context fails", () => {
  const page = basePlanningEnvelope({
    visual_affordances: [validActivityGenerate({ context: "" })]
  });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, false);
  assert.ok(hasCode(result, "VPC_GENERATE_CONTEXT_REQUIRED"));
});

test("Slice 3: missing evidence_anchors fails", () => {
  const row = validActivityGenerate();
  delete row.evidence_anchors;
  const page = basePlanningEnvelope({ visual_affordances: [row] });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, false);
  assert.ok(hasCode(result, "VPC_GENERATE_EVIDENCE_ANCHORS_REQUIRED"));
});

test("Slice 3: empty evidence_anchors fails", () => {
  const page = basePlanningEnvelope({
    visual_affordances: [validActivityGenerate({ evidence_anchors: [] })]
  });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, false);
  assert.ok(hasCode(result, "VPC_GENERATE_EVIDENCE_ANCHORS_EMPTY"));
});

// --- Vocabularies ---

test("Slice 3: current valid visual slots pass", () => {
  for (const slot of vpc.VISUAL_SLOTS) {
    const page = basePlanningEnvelope({
      visual_affordances: [validActivityGenerate({ visual_slot: slot })]
    });
    const result = vpc.validateVisualPlanningContract(page);
    assert.equal(result.valid, true, "slot " + slot + " failed: " + JSON.stringify(result.errors));
  }
});

test("Slice 3: unsupported visual slot fails", () => {
  const page = basePlanningEnvelope({
    visual_affordances: [validActivityGenerate({ visual_slot: "hero-banner" })]
  });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => /visual_slot/i.test(e.message)));
});

test("Slice 3: current valid representations pass", () => {
  for (const rep of ["classification_matrix", "concept_map", "comparison_framework"]) {
    const page = basePlanningEnvelope({
      visual_affordances: [validActivityGenerate({ preferred_representation: rep })]
    });
    const result = vpc.validateVisualPlanningContract(page);
    assert.equal(result.valid, true, rep + ": " + JSON.stringify(result.errors));
  }
});

test("Slice 3: unsupported representation fails", () => {
  const page = basePlanningEnvelope({
    visual_affordances: [validActivityGenerate({ preferred_representation: "pie_chart" })]
  });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => /preferred_representation/i.test(e.message)));
});

test("Slice 3: current valid purposes pass", () => {
  for (const purpose of ["classification", "synthesis", "mechanism"]) {
    const page = basePlanningEnvelope({
      visual_affordances: [validActivityGenerate({ purpose: purpose })]
    });
    const result = vpc.validateVisualPlanningContract(page);
    assert.equal(result.valid, true, purpose + ": " + JSON.stringify(result.errors));
  }
});

test("Slice 3: unsupported purpose fails", () => {
  const page = basePlanningEnvelope({
    visual_affordances: [validActivityGenerate({ purpose: "decoration" })]
  });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => /purpose must be one of/i.test(e.message)));
});

// --- Evidence anchors ---

test("Slice 3: valid activity anchor syntax passes", () => {
  const page = basePlanningEnvelope({
    visual_affordances: [
      validActivityGenerate({ evidence_anchors: ["A1.learner_task", "A2.materials.debrief"] })
    ]
  });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, true, JSON.stringify(result.errors));
});

test("Slice 3: valid page_synthesis anchor syntax passes", () => {
  const page = basePlanningEnvelope({
    visual_affordances: [validPageGenerate()]
  });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, true, JSON.stringify(result.errors));
});

test("Slice 3: unknown activity root fails", () => {
  const page = basePlanningEnvelope({
    visual_affordances: [
      validActivityGenerate({ evidence_anchors: ["A9.learner_task"] })
    ]
  });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, false);
  assert.ok(hasCode(result, "VPC_EVIDENCE_ANCHOR_UNKNOWN_ACTIVITY"));
});

test("Slice 3: malformed anchor fails", () => {
  const page = basePlanningEnvelope({
    visual_affordances: [validActivityGenerate({ evidence_anchors: ["not-a-valid-anchor"] })]
  });
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, false);
  assert.ok(hasCode(result, "VPC_EVIDENCE_ANCHOR_MALFORMED"));
});

// --- Transport integrity ---

test("Slice 3: validation does not mutate the assembled page", () => {
  const page = basePlanningEnvelope({
    activities_visual_review: [
      { activity_id: "A1", activity_visual_value: { decision: "high", rationale: "Matrix." } }
    ],
    visual_affordances: [validActivityGenerate({ pedagogical_added_value: "Extra cognitive support." })]
  });
  const before = JSON.stringify(page);
  vpc.validateVisualPlanningContract(page);
  assert.equal(JSON.stringify(page), before);
});

test("Slice 3: additional authored metadata survives untouched", () => {
  const page = basePlanningEnvelope({
    visual_affordances: [
      validActivityGenerate({
        pedagogical_added_value: "Adds discriminating cues.",
        custom_future_field: "preserved"
      })
    ]
  });
  const beforeAffordances = JSON.stringify(page.visual_affordances);
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, true);
  assert.equal(JSON.stringify(page.visual_affordances), beforeAffordances);
  assert.equal(page.visual_affordances[0].custom_future_field, "preserved");
});

test("Slice 3: visual_affordance arrays remain byte-equivalent before and after validation", () => {
  const page = basePlanningEnvelope({
    visual_affordances: [validActivityGenerate(), validDefer(), validSkip()]
  });
  const bytesBefore = JSON.stringify(page.visual_affordances);
  vpc.validateVisualPlanningContract(page);
  assert.equal(JSON.stringify(page.visual_affordances), bytesBefore);
});

// --- Determinism ---

test("Slice 3: identical input produces identical validation result", () => {
  const page = basePlanningEnvelope({
    visual_affordances: [
      validActivityGenerate({ visual_slot: "" }),
      validActivityGenerate({ affordance_id: "va-dup", activity_id: "A2" })
    ]
  });
  const first = vpc.validateVisualPlanningContract(page);
  const second = vpc.validateVisualPlanningContract(clone(page));
  assert.deepEqual(second, first);
});

test("Slice 3: errors have stable ordering", () => {
  const page = basePlanningEnvelope({
    visual_affordance_schema_version: "99.0",
    activities_visual_review: [
      { activity_id: "A9", activity_visual_value: { decision: "bad", rationale: "" } }
    ],
    visual_affordances: [
      validActivityGenerate({ scope: "module", activity_id: "A9", visual_decision: "maybe" })
    ]
  });
  const a = vpc.validateVisualPlanningContract(page);
  const b = vpc.validateVisualPlanningContract(clone(page));
  assert.deepEqual(a.errors, b.errors);
});

// --- Existing behaviour / non-regression ---

test("Slice 3: assembled dp-partial-with-va fixture validates when activities are present", () => {
  const dpPartialWithVa = loadJson(dpPartialWithVaPath);
  const epShell = loadJson(path.join(repoRoot, "tests", "fixtures", "page-assemble", "ep-shell.json"));
  const assembled = assemble.assembleVNextPageFromPartials({
    episode_plan: epShell,
    design_page: dpPartialWithVa
  });
  const page = assembled.page;
  assert.ok(Array.isArray(page.visual_affordances));
  const result = vpc.validateVisualPlanningContract(page);
  assert.equal(result.valid, true, JSON.stringify(result.errors));
  assert.equal(
    JSON.stringify(page.visual_affordances),
    JSON.stringify(dpPartialWithVa.visual_affordances)
  );
});

test("Slice 3: no renderer or image-generation behaviour is introduced", () => {
  assert.equal(typeof vpc.validateVisualPlanningContract, "function");
  assert.equal(typeof s38.buildVisualAffordanceRenderPlan, "function");
  const page = basePlanningEnvelope({ visual_affordances: [validActivityGenerate()] });
  const plan = s38.buildVisualAffordanceRenderPlan(page);
  assert.equal(plan.legacy, false);
  assert.ok(plan.slotGenerate);
  assert.equal(typeof vpc.validateVisualPlanningContract(page).valid, "boolean");
});

test("Slice 3: legacy handover unchanged when planning absent", () => {
  const page = { title: "Legacy", activities: ACTIVITIES };
  assert.equal(s38.detectVisualAffordanceHandoverMode(page), "legacy");
  assert.equal(vpc.validateVisualPlanningContract(page).authoritative_planning_present, false);
});

test("Slice 3: re-exports Sprint 38 vocabularies", () => {
  assert.deepEqual(vpc.PURPOSES, s38.PURPOSES);
  assert.deepEqual(vpc.VISUAL_SLOTS, s38.VISUAL_SLOTS);
  assert.equal(vpc.SUPPORTED_SCHEMA_VERSION, "38.4");
});
