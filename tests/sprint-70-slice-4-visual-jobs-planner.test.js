/**
 * Sprint 70 Slice 4 — Prism visual-jobs planner (evidence resolution + canonical jobs).
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const planner = require("../lib/prism-visual-jobs-planner.js");
const vpc = require("../lib/visual-planning-contract.js");
const s38 = require("../lib/sprint38-visual-affordances.js");

const ACTIVITIES = [
  {
    activity_id: "A1",
    learner_task: "Compare inflation drivers using evidence.",
    instructions: "Work through the scenario cards in order.",
    materials: [
      {
        material_id: "A1-M1",
        material_type: "scenarios",
        title: "Inflation scenarios",
        body: "## Scenarios\n\nDemand-pull vs cost-push cases.",
        body_format: "markdown"
      },
      {
        material_id: "A1-M2",
        material_type: "text",
        body: "Concept grounding prose."
      }
    ]
  },
  {
    activity_id: "A2",
    learner_task: "Apply CPI calculations to a scenario.",
    materials: {
      comparison_table: "| Measure | Coverage |\n| --- | --- |\n| CPI | Consumer |",
      debrief: "Discuss which measure to report.",
      analysis_table: { rows: [{ measure: "CPI", note: "basket" }], columns: ["measure", "note"] }
    }
  }
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
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
      pedagogical_added_value: "Adds discriminating cause-type cues.",
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
  const row = validActivityGenerate(
    Object.assign(
      {
        affordance_id: "va-page-knowledge-summary-01",
        scope: "page",
        region: "knowledge_summary",
        visual_slot: "knowledge-summary-after-content",
        tier: "essential",
        purpose: "synthesis",
        preferred_representation: "concept_map",
        subject: "Knowledge Summary inference map",
        context: "Visual brief: synthesize demand-pull and cost-push links.",
        evidence_anchors: ["page_synthesis.knowledge_summary", "page_synthesis.learning_purpose"],
        learner_stage: "post_reasoning"
      },
      overrides || {}
    )
  );
  delete row.activity_id;
  return row;
}

function validDefer() {
  return {
    affordance_id: "va-A2-defer-01",
    scope: "activity",
    activity_id: "A2",
    visual_decision: "defer",
    defer_reason: "worked_example_sufficient_first",
    rationale: "Attempt the worked example before any visual summary.",
    subject: "CPI index discrimination",
    context: "Defer visual until after baseline work.",
    evidence_anchors: ["A2.learner_task"]
  };
}

function validSkip() {
  return {
    affordance_id: "va-A2-skip-01",
    scope: "activity",
    activity_id: "A2",
    visual_decision: "skip",
    skip_reason: "assessment_text_sufficient",
    rationale: "Debrief text is sufficient.",
    subject: "Debrief-only closure",
    context: "No additional visual needed.",
    evidence_anchors: ["A2.materials.debrief"]
  };
}

function basePage(overrides) {
  return Object.assign(
    {
      title: "Inflation workshop",
      visual_affordance_schema_version: "38.4",
      activities_visual_review: [
        {
          activity_id: "A1",
          activity_visual_value: { decision: "high", rationale: "Matrix support." }
        },
        {
          activity_id: "A2",
          activity_visual_value: { decision: "medium", rationale: "Comparison cues." }
        }
      ],
      visual_affordances: [],
      activities: clone(ACTIVITIES),
      page_synthesis: {
        overview: { body: "Workshop overview prose.", format: "markdown" },
        learning_purpose: { body: "Compare CPI and inflation drivers.", format: "markdown" },
        knowledge_summary: {
          body: "Core inflation concepts include demand-pull and cost-push dynamics.",
          format: "markdown"
        },
        study_tips: { body: "Pace the comparison carefully.", format: "markdown" }
      }
    },
    overrides || {}
  );
}

function codes(result) {
  return (result.errors || []).map((row) => row.code);
}

function hasCode(result, code) {
  return codes(result).includes(code);
}

// --- Validation boundary ---

test("Slice 4: planner delegates to validateVisualPlanningContract", () => {
  const page = basePage({ visual_affordances: [validActivityGenerate()] });
  const contract = vpc.validateVisualPlanningContract(page);
  const result = planner.planPrismVisualJobs(page);
  assert.equal(contract.valid, true);
  assert.equal(result.contract.valid, true);
  assert.equal(result.schema_version, "38.4");
  assert.equal(result.planner_version, "70.4");
});

test("Slice 4: invalid authoritative planning does not produce visual jobs", () => {
  const page = basePage({
    visual_affordance_schema_version: undefined,
    visual_affordances: [validActivityGenerate()]
  });
  delete page.visual_affordance_schema_version;
  const result = planner.planPrismVisualJobs(page);
  assert.equal(result.valid, false);
  assert.deepEqual(result.jobs, []);
  assert.ok(hasCode(result, "VPC_SCHEMA_VERSION_MISSING"));
});

test("Slice 4: supported schema version passes through", () => {
  const page = basePage({ visual_affordances: [validActivityGenerate()] });
  const result = planner.planPrismVisualJobs(page);
  assert.equal(result.valid, true, JSON.stringify(result.errors));
  assert.equal(result.schema_version, "38.4");
  assert.equal(result.jobs[0].schema_version, "38.4");
});

test("Slice 4: unsupported schema version fails through the canonical validator", () => {
  const page = basePage({
    visual_affordance_schema_version: "99.0",
    visual_affordances: [validActivityGenerate()]
  });
  const result = planner.planPrismVisualJobs(page);
  assert.equal(result.valid, false);
  assert.deepEqual(result.jobs, []);
  assert.ok(hasCode(result, "VPC_SCHEMA_VERSION_UNSUPPORTED"));
});

// --- Authoritative planning ---

test("Slice 4: valid authoritative page produces planner result", () => {
  const page = basePage({
    visual_affordances: [validActivityGenerate(), validDefer(), validSkip(), validPageGenerate()]
  });
  const result = planner.planPrismVisualJobs(page);
  assert.equal(result.valid, true, JSON.stringify(result.errors));
  assert.equal(result.authoritative_planning_present, true);
  assert.equal(result.jobs.length, 2);
});

test("Slice 4: generate affordance produces exactly one job", () => {
  const page = basePage({ visual_affordances: [validActivityGenerate()] });
  const result = planner.planPrismVisualJobs(page);
  assert.equal(result.jobs.length, 1);
  assert.equal(result.jobs[0].affordance_id, "va-A1-generate-01");
});

test("Slice 4: defer affordance produces no job", () => {
  const page = basePage({ visual_affordances: [validDefer()] });
  const result = planner.planPrismVisualJobs(page);
  assert.equal(result.jobs.length, 0);
  assert.equal(result.diagnostics.defer, 1);
  assert.equal(result.diagnostics.deferred[0].affordance_id, "va-A2-defer-01");
});

test("Slice 4: skip affordance produces no job", () => {
  const page = basePage({ visual_affordances: [validSkip()] });
  const result = planner.planPrismVisualJobs(page);
  assert.equal(result.jobs.length, 0);
  assert.equal(result.diagnostics.skip, 1);
});

test("Slice 4: all decision counts appear in diagnostics", () => {
  const page = basePage({
    visual_affordances: [validActivityGenerate(), validDefer(), validSkip()]
  });
  const result = planner.planPrismVisualJobs(page);
  assert.equal(result.diagnostics.generate, 1);
  assert.equal(result.diagnostics.defer, 1);
  assert.equal(result.diagnostics.skip, 1);
  assert.equal(result.diagnostics.jobs_created, 1);
});

// --- Job metadata ---

test("Slice 4: activity-scoped job preserves activity_id", () => {
  const page = basePage({ visual_affordances: [validActivityGenerate()] });
  const job = planner.planPrismVisualJobs(page).jobs[0];
  assert.equal(job.activity_id, "A1");
  assert.equal(job.provenance.activity_id, "A1");
});

test("Slice 4: page-scoped job contains no required activity_id", () => {
  const page = basePage({ visual_affordances: [validPageGenerate()] });
  const job = planner.planPrismVisualJobs(page).jobs[0];
  assert.equal(job.scope, "page");
  assert.equal(job.activity_id, undefined);
  assert.equal(job.provenance.page_scope, true);
});

test("Slice 4: authored visual_slot / purpose / representation / subject / context survive", () => {
  const page = basePage({ visual_affordances: [validActivityGenerate()] });
  const job = planner.planPrismVisualJobs(page).jobs[0];
  assert.equal(job.visual_slot, "materials-entry");
  assert.equal(job.purpose, "classification");
  assert.equal(job.preferred_representation, "classification_matrix");
  assert.equal(job.subject, "Inflation mechanism classification cues");
  assert.equal(
    job.context,
    "Visual brief: compare demand-pull and cost-push mechanisms."
  );
});

test("Slice 4: constraint arrays and spoiler metadata survive unchanged", () => {
  const row = validActivityGenerate();
  const page = basePage({ visual_affordances: [row] });
  const job = planner.planPrismVisualJobs(page).jobs[0];
  assert.deepEqual(job.must_show, row.must_show);
  assert.deepEqual(job.must_not_show, row.must_not_show);
  assert.deepEqual(job.allowed_claims, row.allowed_claims);
  assert.deepEqual(job.disallowed_claims, row.disallowed_claims);
  assert.deepEqual(job.representation_avoid, row.representation_avoid);
  assert.equal(job.anti_spoiler, true);
  assert.deepEqual(job.spoiler_boundary, row.spoiler_boundary);
});

test("Slice 4: additional authored metadata is not silently lost", () => {
  const page = basePage({
    visual_affordances: [validActivityGenerate({ custom_future_field: "keep-me" })]
  });
  const job = planner.planPrismVisualJobs(page).jobs[0];
  assert.equal(job.authored_passthrough.custom_future_field, "keep-me");
});

// --- Evidence resolution ---

test("Slice 4: activity learner-task anchor resolves", () => {
  const page = basePage({
    visual_affordances: [validActivityGenerate({ evidence_anchors: ["A1.learner_task"] })]
  });
  const job = planner.planPrismVisualJobs(page).jobs[0];
  assert.equal(job.resolved_sources.length, 1);
  assert.equal(job.resolved_sources[0].source_type, "activity_field");
  assert.equal(job.resolved_sources[0].field, "learner_task");
  assert.match(job.resolved_sources[0].content, /Compare inflation drivers/);
});

test("Slice 4: activity material anchor resolves", () => {
  const page = basePage({
    visual_affordances: [validActivityGenerate({ evidence_anchors: ["A1.materials.scenarios"] })]
  });
  const job = planner.planPrismVisualJobs(page).jobs[0];
  assert.equal(job.resolved_sources[0].source_type, "activity_material");
  assert.match(job.resolved_sources[0].content_text, /Demand-pull/);
});

test("Slice 4: current valid activity instruction anchor resolves", () => {
  const page = basePage({
    visual_affordances: [validActivityGenerate({ evidence_anchors: ["A1.instructions"] })]
  });
  const result = planner.planPrismVisualJobs(page);
  assert.equal(result.valid, true, JSON.stringify(result.errors));
  assert.equal(result.jobs[0].resolved_sources[0].field, "instructions");
});

test("Slice 4: page overview / learning-purpose / Knowledge Summary anchors resolve", () => {
  const page = basePage({
    visual_affordances: [
      validPageGenerate({
        evidence_anchors: [
          "page_synthesis.overview",
          "page_synthesis.learning_purpose",
          "page_synthesis.knowledge_summary"
        ]
      })
    ]
  });
  const job = planner.planPrismVisualJobs(page).jobs[0];
  assert.equal(job.resolved_sources.length, 3);
  assert.equal(job.resolved_sources[0].field, "overview");
  assert.equal(job.resolved_sources[1].field, "learning_purpose");
  assert.equal(job.resolved_sources[2].source_kind, "knowledge_summary");
});

test("Slice 4: multiple anchors remain separate resolved source records", () => {
  const page = basePage({ visual_affordances: [validActivityGenerate()] });
  const job = planner.planPrismVisualJobs(page).jobs[0];
  assert.equal(job.resolved_sources.length, 2);
  assert.equal(job.resolved_sources[0].anchor, "A1.learner_task");
  assert.equal(job.resolved_sources[1].anchor, "A1.materials.scenarios");
});

test("Slice 4: original evidence_anchors remain present", () => {
  const anchors = ["A1.learner_task", "A1.materials.scenarios"];
  const page = basePage({
    visual_affordances: [validActivityGenerate({ evidence_anchors: anchors })]
  });
  const job = planner.planPrismVisualJobs(page).jobs[0];
  assert.deepEqual(job.evidence_anchors, anchors);
});

test("Slice 4: structured source content is represented deterministically", () => {
  const page = basePage({
    visual_affordances: [
      validActivityGenerate({
        affordance_id: "va-A2-generate-struct",
        activity_id: "A2",
        evidence_anchors: ["A2.materials.analysis_table"]
      })
    ]
  });
  const job = planner.planPrismVisualJobs(page).jobs[0];
  const src = job.resolved_sources[0];
  assert.equal(src.content_type, "json");
  assert.ok(src.content_structured);
  assert.equal(typeof src.content_text, "string");
  assert.deepEqual(JSON.parse(src.content_text), src.content_structured);
});

test("Slice 4: only explicitly referenced content is resolved", () => {
  const page = basePage({
    visual_affordances: [validActivityGenerate({ evidence_anchors: ["A1.learner_task"] })]
  });
  const job = planner.planPrismVisualJobs(page).jobs[0];
  assert.equal(job.resolved_sources.length, 1);
  assert.ok(!job.resolved_sources.some((s) => /materials/.test(s.anchor)));
});

// --- Failure behaviour ---

test("Slice 4: missing resolved field produces stable error code", () => {
  const page = basePage({
    visual_affordances: [
      validActivityGenerate({ evidence_anchors: ["A1.materials.missing_thing"] })
    ]
  });
  const result = planner.planPrismVisualJobs(page);
  assert.equal(result.valid, false);
  assert.deepEqual(result.jobs, []);
  assert.ok(hasCode(result, "VPC_PLANNER_SOURCE_UNRESOLVED"));
});

test("Slice 4: empty resolved content is handled deterministically", () => {
  const page = basePage({
    activities: [
      {
        activity_id: "A1",
        learner_task: "   ",
        materials: [{ material_type: "scenarios", body: "ok" }]
      },
      ACTIVITIES[1]
    ],
    visual_affordances: [
      validActivityGenerate({ evidence_anchors: ["A1.learner_task"] })
    ]
  });
  const result = planner.planPrismVisualJobs(page);
  assert.equal(result.valid, false);
  assert.ok(hasCode(result, "VPC_PLANNER_SOURCE_EMPTY"));
});

test("Slice 4: unknown activity content path produces stable error", () => {
  const page = basePage({
    visual_affordances: [
      validActivityGenerate({ evidence_anchors: ["A1.nonexistent_field"] })
    ]
  });
  const result = planner.planPrismVisualJobs(page);
  assert.equal(result.valid, false);
  assert.ok(hasCode(result, "VPC_PLANNER_SOURCE_UNRESOLVED"));
});

test("Slice 4: prohibited spoiler source is diagnosed", () => {
  const page = basePage({
    activities: [
      {
        activity_id: "A1",
        learner_task: "Task",
        materials: [
          { material_type: "scenarios", body: "Scenario body" },
          { material_type: "answer_key", body: "Completed classifications: all demand-pull." }
        ]
      },
      ACTIVITIES[1]
    ],
    visual_affordances: [
      validActivityGenerate({
        evidence_anchors: ["A1.materials.answer_key"]
      })
    ]
  });
  const result = planner.planPrismVisualJobs(page);
  assert.equal(result.valid, false);
  assert.ok(hasCode(result, "VPC_PLANNER_SPOILER_SOURCE_PROHIBITED"));
  assert.deepEqual(result.jobs, []);
});

test("Slice 4: no nearby source is silently substituted", () => {
  const page = basePage({
    visual_affordances: [
      validActivityGenerate({ evidence_anchors: ["A1.materials.comparison_table"] })
    ]
  });
  const result = planner.planPrismVisualJobs(page);
  assert.equal(result.valid, false);
  assert.ok(hasCode(result, "VPC_PLANNER_SOURCE_UNRESOLVED"));
  assert.ok(!result.jobs.some((j) => j.resolved_sources && j.resolved_sources.length));
});

test("Slice 4: unresolved generate does not block sibling jobs (partial planning)", () => {
  const page = basePage({
    visual_affordances: [
      validActivityGenerate({
        affordance_id: "va-bad",
        evidence_anchors: ["A1.materials.nope"]
      }),
      validPageGenerate()
    ]
  });
  const result = planner.planPrismVisualJobs(page);
  assert.equal(result.valid, false);
  assert.equal(result.jobs.length, 1);
  assert.equal(result.jobs[0].affordance_id, "va-page-knowledge-summary-01");
  assert.equal(result.diagnostics.partial_planning, true);
});

// --- Deterministic IDs ---

test("Slice 4: identical input produces identical job_id", () => {
  const page = basePage({ visual_affordances: [validActivityGenerate()] });
  const a = planner.planPrismVisualJobs(page);
  const b = planner.planPrismVisualJobs(clone(page));
  assert.equal(a.jobs[0].job_id, b.jobs[0].job_id);
  assert.ok(!/T\d{2}:|uuid|random/i.test(a.jobs[0].job_id));
});

test("Slice 4: two affordances produce distinct IDs", () => {
  const page = basePage({
    visual_affordances: [
      validActivityGenerate(),
      validPageGenerate()
    ]
  });
  const result = planner.planPrismVisualJobs(page);
  assert.equal(result.jobs.length, 2);
  assert.notEqual(result.jobs[0].job_id, result.jobs[1].job_id);
});

test("Slice 4: duplicate derived IDs are diagnosed", () => {
  const row = validActivityGenerate();
  // Distinct affordance_id for Slice 3 uniqueness, but slug-equivalent for job_id collision
  const twin = validActivityGenerate({
    affordance_id: "va.A1.generate.01",
    evidence_anchors: ["A1.learner_task"]
  });
  const page = basePage({ visual_affordances: [row, twin] });
  const result = planner.planPrismVisualJobs(page);
  assert.equal(result.valid, false);
  assert.ok(hasCode(result, "VPC_PLANNER_DUPLICATE_JOB_ID"));
});

// --- Ordering ---

test("Slice 4: jobs follow canonical visual-slot order", () => {
  const page = basePage({
    visual_affordances: [
      validPageGenerate(),
      validActivityGenerate({ visual_slot: "materials-entry" })
    ]
  });
  const result = planner.planPrismVisualJobs(page);
  assert.equal(result.jobs[0].visual_slot, "materials-entry");
  assert.equal(result.jobs[1].visual_slot, "knowledge-summary-after-content");
});

test("Slice 4: same-slot jobs preserve authoritative order", () => {
  const page = basePage({
    visual_affordances: [
      validActivityGenerate({
        affordance_id: "va-first",
        visual_slot: "materials-entry",
        evidence_anchors: ["A1.learner_task"]
      }),
      validActivityGenerate({
        affordance_id: "va-second",
        activity_id: "A2",
        visual_slot: "materials-entry",
        evidence_anchors: ["A2.learner_task"]
      })
    ]
  });
  const result = planner.planPrismVisualJobs(page);
  assert.deepEqual(
    result.jobs.map((j) => j.affordance_id),
    ["va-first", "va-second"]
  );
});

test("Slice 4: page-scoped and activity-scoped jobs order deterministically", () => {
  const page = basePage({
    visual_affordances: [validPageGenerate(), validActivityGenerate()]
  });
  const a = planner.planPrismVisualJobs(page);
  const b = planner.planPrismVisualJobs(clone(page));
  assert.deepEqual(
    a.jobs.map((j) => j.job_id),
    b.jobs.map((j) => j.job_id)
  );
});

// --- Legacy ---

test("Slice 4: page with no authoritative planning returns zero authoritative jobs", () => {
  const page = { title: "Legacy", activities: ACTIVITIES };
  const result = planner.planPrismVisualJobs(page);
  assert.equal(result.valid, true);
  assert.equal(result.authoritative_planning_present, false);
  assert.deepEqual(result.jobs, []);
  assert.equal(result.diagnostics.legacy_path_applicable, true);
});

test("Slice 4: planner does not invoke legacy heuristics", () => {
  const page = { title: "Legacy", activities: ACTIVITIES };
  const result = planner.planPrismVisualJobs(page);
  assert.equal(s38.detectVisualAffordanceHandoverMode(page), "legacy");
  assert.equal(result.jobs.length, 0);
  assert.equal(s38.buildVisualAffordanceRenderPlan(page).legacy, true);
});

// --- Non-mutation ---

test("Slice 4: planner does not mutate assembled page / affordances / nested source content", () => {
  const page = basePage({
    visual_affordances: [validActivityGenerate({ custom_future_field: "x" })]
  });
  const before = JSON.stringify(page);
  const beforeMaterials = JSON.stringify(page.activities[0].materials);
  planner.planPrismVisualJobs(page);
  assert.equal(JSON.stringify(page), before);
  assert.equal(JSON.stringify(page.activities[0].materials), beforeMaterials);
});

test("Slice 4: repeated planning returns byte-equivalent output", () => {
  const page = basePage({
    visual_affordances: [validActivityGenerate(), validDefer(), validPageGenerate()]
  });
  const a = planner.planPrismVisualJobs(page);
  const b = planner.planPrismVisualJobs(clone(page));
  assert.equal(JSON.stringify(a), JSON.stringify(b));
});

test("Slice 4: no image-generation or renderer behaviour is introduced", () => {
  assert.equal(typeof planner.planPrismVisualJobs, "function");
  assert.equal(typeof planner.buildJobId, "function");
  const page = basePage({ visual_affordances: [validActivityGenerate()] });
  const result = planner.planPrismVisualJobs(page);
  assert.ok(result.jobs[0].job_id);
  assert.ok(!("prompt" in result.jobs[0]));
  assert.ok(!("image_url" in result.jobs[0]));
  assert.ok(!("asset_id" in result.jobs[0]));
});
