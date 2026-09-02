/**
 * Sprint 70 Slice 5 — provider-neutral image-brief compiler.
 */
const test = require("node:test");
const assert = require("node:assert/strict");

const compiler = require("../lib/prism-image-brief-compiler.js");
const planner = require("../lib/prism-visual-jobs-planner.js");
const vpc = require("../lib/visual-planning-contract.js");
const s38 = require("../lib/sprint38-visual-affordances.js");

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

const ACTIVITIES = [
  {
    activity_id: "A1",
    learner_task: "Compare inflation drivers using evidence.",
    instructions: "Work through the scenario cards in order.",
    materials: [
      {
        material_id: "A1-M1",
        material_type: "scenarios",
        body: "## Scenarios\n\nDemand-pull vs cost-push cases."
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
      analysis_table: { rows: [{ measure: "CPI" }], columns: ["measure"] }
    }
  }
];

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
      source_basis: "A1 learner_task",
      caption_intent: "Cause-type cues only.",
      discipline_risk_level: "medium",
      reasoning_supported: "Learners classify without completed classifications.",
      learner_stage: "pre_classification",
      canonical_discipline_note: "Empty labelled cause structures only.",
      custom_future_field: "keep-me"
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
        learner_stage: "post_reasoning",
        custom_future_field: undefined
      },
      overrides || {}
    )
  );
  delete row.activity_id;
  delete row.custom_future_field;
  return row;
}

function basePage(overrides) {
  return Object.assign(
    {
      title: "Inflation workshop",
      visual_affordance_schema_version: "38.4",
      activities_visual_review: [
        { activity_id: "A1", activity_visual_value: { decision: "high", rationale: "Matrix." } },
        { activity_id: "A2", activity_visual_value: { decision: "medium", rationale: "Compare." } }
      ],
      visual_affordances: [validActivityGenerate()],
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

function plan(page) {
  return planner.planPrismVisualJobs(page);
}

function codes(result) {
  return (result.errors || []).map((row) => row.code);
}

function hasCode(result, code) {
  return codes(result).includes(code);
}

// --- Input boundary ---

test("Slice 5: valid Slice 4 planner result is accepted", () => {
  const planned = plan(basePage());
  assert.equal(planned.valid, true);
  const result = compiler.compilePrismImageBriefs(planned);
  assert.equal(result.valid, true, JSON.stringify(result.errors));
  assert.equal(result.compiler_version, "70.5");
  assert.equal(result.planner_version, "70.4");
  assert.equal(result.schema_version, "38.4");
  assert.equal(result.briefs.length, 1);
});

test("Slice 5: invalid planner result produces no executable briefs", () => {
  const planned = plan(
    basePage({
      visual_affordances: [
        validActivityGenerate({ evidence_anchors: ["A1.materials.missing"] })
      ]
    })
  );
  assert.equal(planned.valid, false);
  const result = compiler.compilePrismImageBriefs(planned);
  assert.equal(result.valid, false);
  assert.deepEqual(result.briefs, []);
  assert.ok(result.diagnostics.planner_errors_retained > 0);
});

test("Slice 5: unsupported planner version is diagnosed", () => {
  const planned = plan(basePage());
  planned.planner_version = "0.0";
  const result = compiler.compilePrismImageBriefs(planned);
  assert.equal(result.valid, false);
  assert.deepEqual(result.briefs, []);
  assert.ok(hasCode(result, "PIC_PLANNER_VERSION_UNSUPPORTED"));
});

test("Slice 5: unsupported schema version is diagnosed", () => {
  const planned = plan(basePage());
  planned.schema_version = "99.0";
  const result = compiler.compilePrismImageBriefs(planned);
  assert.equal(result.valid, false);
  assert.ok(hasCode(result, "PIC_SCHEMA_VERSION_UNSUPPORTED"));
});

test("Slice 5: missing jobs array is diagnosed", () => {
  const planned = plan(basePage());
  delete planned.jobs;
  const result = compiler.compilePrismImageBriefs(planned);
  assert.equal(result.valid, false);
  assert.ok(hasCode(result, "PIC_JOBS_REQUIRED"));
});

test("Slice 5: compiler does not call page validation or crawl assembled page", () => {
  const planned = plan(basePage());
  // Strip page-like keys if any leaked; compiler must work from jobs alone
  const envelope = {
    valid: true,
    planner_version: "70.4",
    schema_version: "38.4",
    authoritative_planning_present: true,
    jobs: clone(planned.jobs),
    errors: [],
    warnings: [],
    diagnostics: planned.diagnostics
  };
  const result = compiler.compilePrismImageBriefs(envelope);
  assert.equal(result.valid, true, JSON.stringify(result.errors));
  assert.equal(result.briefs.length, 1);
  // No validateVisualPlanningContract dependency on a page object in this call path
  assert.equal(typeof vpc.validateVisualPlanningContract, "function");
});

// --- One-to-one compilation ---

test("Slice 5: one canonical job produces one brief", () => {
  const result = compiler.compilePrismImageBriefs(plan(basePage()));
  assert.equal(result.briefs.length, 1);
  assert.equal(result.briefs[0].job_id, plan(basePage()).jobs[0].job_id);
});

test("Slice 5: multiple jobs produce the same number of briefs in planner order", () => {
  const planned = plan(
    basePage({
      visual_affordances: [validActivityGenerate(), validPageGenerate()]
    })
  );
  const result = compiler.compilePrismImageBriefs(planned);
  assert.equal(result.briefs.length, planned.jobs.length);
  assert.deepEqual(
    result.briefs.map((b) => b.job_id),
    planned.jobs.map((j) => j.job_id)
  );
});

test("Slice 5: activity scope and activity_id survive; page scope omits activity_id", () => {
  const planned = plan(
    basePage({
      visual_affordances: [validActivityGenerate(), validPageGenerate()]
    })
  );
  const result = compiler.compilePrismImageBriefs(planned);
  const activityBrief = result.briefs.find((b) => b.scope === "activity");
  const pageBrief = result.briefs.find((b) => b.scope === "page");
  assert.equal(activityBrief.activity_id, "A1");
  assert.equal(pageBrief.activity_id, undefined);
  assert.equal(pageBrief.scope, "page");
});

// --- Identity ---

test("Slice 5: deterministic brief_id derives from job identity", () => {
  const planned = plan(basePage());
  const result = compiler.compilePrismImageBriefs(planned);
  assert.equal(
    result.briefs[0].brief_id,
    compiler.briefIdFromJobId(planned.jobs[0].job_id)
  );
  assert.match(result.briefs[0].brief_id, /^vb-/);
  assert.ok(!/T\d{2}:|uuid|random/i.test(result.briefs[0].brief_id));
});

test("Slice 5: identical input produces identical brief_id and instruction", () => {
  const planned = plan(basePage());
  const a = compiler.compilePrismImageBriefs(planned);
  const b = compiler.compilePrismImageBriefs(clone(planned));
  assert.equal(a.briefs[0].brief_id, b.briefs[0].brief_id);
  assert.equal(a.briefs[0].generation_instruction, b.briefs[0].generation_instruction);
  assert.equal(JSON.stringify(a), JSON.stringify(b));
});

test("Slice 5: duplicate brief IDs are diagnosed", () => {
  const planned = plan(basePage());
  const twin = clone(planned.jobs[0]);
  twin.affordance_id = "other";
  // Force identical job_id → identical brief_id
  planned.jobs = [planned.jobs[0], twin];
  const result = compiler.compilePrismImageBriefs(planned);
  assert.equal(result.valid, false);
  assert.ok(hasCode(result, "PIC_DUPLICATE_BRIEF_ID"));
});

// --- Field preservation ---

test("Slice 5: authored semantic fields survive unchanged", () => {
  const planned = plan(basePage());
  const job = planned.jobs[0];
  const brief = compiler.compilePrismImageBriefs(planned).briefs[0];
  assert.equal(brief.visual_slot, job.visual_slot);
  assert.equal(brief.purpose, job.purpose);
  assert.equal(brief.preferred_representation, job.preferred_representation);
  assert.equal(brief.subject, job.subject);
  assert.equal(brief.context, job.context);
  assert.deepEqual(brief.content_requirements.authored, job.must_show);
  assert.deepEqual(brief.exclusion_requirements.authored_must_not_show, job.must_not_show);
  assert.deepEqual(brief.claim_constraints.allowed, job.allowed_claims);
  assert.deepEqual(brief.claim_constraints.disallowed, job.disallowed_claims);
  assert.equal(brief.spoiler_constraints.anti_spoiler, true);
  assert.deepEqual(brief.spoiler_constraints.boundary, job.spoiler_boundary);
  assert.deepEqual(brief.representation_constraints.avoid, job.representation_avoid);
  assert.equal(brief.caption_guidance, job.caption_intent);
  assert.equal(brief.discipline_guidance.risk_level, job.discipline_risk_level);
  assert.equal(brief.discipline_guidance.canonical_note, job.canonical_discipline_note);
  assert.deepEqual(brief.provenance, job.provenance);
  assert.equal(brief.authored_passthrough.custom_future_field, "keep-me");
  assert.equal(
    brief.pedagogical_metadata.pedagogical_added_value,
    job.pedagogical_added_value
  );
});

// --- Source evidence ---

test("Slice 5: resolved source boundaries remain separate and classified", () => {
  const brief = compiler.compilePrismImageBriefs(plan(basePage())).briefs[0];
  assert.equal(brief.source_evidence.length, 2);
  assert.equal(brief.source_evidence[0].source_kind, "learner_task");
  assert.equal(brief.source_evidence[1].source_type, "activity_material");
  assert.ok(!brief.source_evidence.some((s) => s.anchor === "page_synthesis.overview"));
});

test("Slice 5: page synthesis source is classified correctly", () => {
  const brief = compiler.compilePrismImageBriefs(
    plan(basePage({ visual_affordances: [validPageGenerate()] }))
  ).briefs[0];
  assert.ok(brief.source_evidence.some((s) => s.source_kind === "knowledge_summary"));
  assert.ok(brief.source_evidence.some((s) => s.source_type === "page_synthesis"));
});

test("Slice 5: structured source retains structured and deterministic text forms", () => {
  const planned = plan(
    basePage({
      visual_affordances: [
        validActivityGenerate({
          affordance_id: "va-A2-struct",
          activity_id: "A2",
          preferred_representation: "comparison_framework",
          purpose: "comparison",
          evidence_anchors: ["A2.materials.analysis_table"],
          learner_stage: "post_reasoning"
        })
      ]
    })
  );
  const brief = compiler.compilePrismImageBriefs(planned).briefs[0];
  const src = brief.source_evidence[0];
  assert.ok(src.content_structured);
  assert.equal(typeof src.content_text, "string");
  assert.deepEqual(JSON.parse(src.content_text), src.content_structured);
});

// --- Representation templates ---

test("Slice 5: every currently supported representation compiles", () => {
  for (const rep of compiler.REPRESENTATIONS) {
    const planned = plan(
      basePage({
        visual_affordances: [
          validActivityGenerate({
            affordance_id: "va-rep-" + rep,
            preferred_representation: rep,
            evidence_anchors: ["A1.learner_task"],
            requires_exact_data_match: rep === "number_line_segments"
          })
        ]
      })
    );
    assert.equal(planned.valid, true, rep + " plan failed: " + JSON.stringify(planned.errors));
    const result = compiler.compilePrismImageBriefs(planned);
    assert.equal(result.valid, true, rep + ": " + JSON.stringify(result.errors));
    assert.equal(result.briefs[0].preferred_representation, rep);
    assert.ok(result.briefs[0].composition.structural_guidance.length >= 1);
    assert.ok(!/photorealistic|cinematic|watercolour|3d render|vector art/i.test(
      result.briefs[0].generation_instruction
    ));
  }
});

test("Slice 5: unsupported representation is diagnosed", () => {
  const planned = plan(basePage());
  planned.jobs[0].preferred_representation = "pie_chart";
  const result = compiler.compilePrismImageBriefs(planned);
  assert.equal(result.valid, false);
  assert.ok(hasCode(result, "PIC_REPRESENTATION_UNSUPPORTED"));
  assert.deepEqual(result.briefs, []);
});

test("Slice 5: classification / concept_map templates receive structural guidance", () => {
  const classification = compiler.compilePrismImageBriefs(plan(basePage())).briefs[0];
  assert.ok(
    classification.composition.structural_guidance.some((g) => /categor/i.test(g))
  );
  const concept = compiler.compilePrismImageBriefs(
    plan(basePage({ visual_affordances: [validPageGenerate()] }))
  ).briefs[0];
  assert.ok(
    concept.composition.structural_guidance.some((g) => /relationship/i.test(g))
  );
});

// --- Generation instruction ---

test("Slice 5: instruction has stable labelled section order and required content", () => {
  const brief = compiler.compilePrismImageBriefs(plan(basePage())).briefs[0];
  const text = brief.generation_instruction;
  const markers = [
    "1. Educational objective",
    "2. Representation",
    "3. Claim boundaries",
    "4. Commissioning cues (subordinate)",
    "5. Evidence basis",
    "6. Required content",
    "7. Excluded content",
    "8. Spoiler boundary",
    "9. Discipline guidance",
    "10. Caption guidance",
    "11. Resource visual language",
    "12. Learner-facing figure copy"
  ];
  let last = -1;
  markers.forEach((marker) => {
    const idx = text.indexOf(marker);
    assert.ok(idx > last, "missing or out of order: " + marker);
    last = idx;
  });
  assert.match(text, /university-level educational illustration/i);
  assert.match(text, /same visual family/i);
  assert.match(text, /classification/);
  assert.match(text, /Inflation mechanism classification cues/);
  assert.match(text, /demand-pull pathway cues/);
  assert.match(text, /Do not strengthen qualified or conditional claims/);
  assert.match(text, /Commissioning cues \(subordinate\)/);
  assert.match(text, /Subject and context are commissioning cues only/);
  assert.match(text, /scenario answer key/);
  assert.match(text, /Different causal mechanisms/);
  assert.match(text, /anti_spoiler: true/);
  assert.match(text, /Empty labelled cause structures/);
  assert.ok(!/openai|flux|ideogram|dall-?e|api key|aspect.?ratio/i.test(text));
});

// --- Claim safety ---

test("Slice 5: empty allowed_claims is preserved; context not promoted to claim", () => {
  const planned = plan(basePage());
  assert.equal(planned.valid, true);
  // Generate rows normally require non-empty allowed_claims at contract time;
  // compiler must still preserve an empty list when present on a job.
  planned.jobs[0].allowed_claims = [];
  const brief = compiler.compilePrismImageBriefs(planned).briefs[0];
  assert.deepEqual(brief.claim_constraints.allowed, []);
  assert.ok(
    !brief.claim_constraints.allowed.includes(
      "Visual brief: compare demand-pull and cost-push mechanisms."
    )
  );
});

// --- Spoiler safety ---

test("Slice 5: anti-spoiler job with learner-visible sources compiles", () => {
  const result = compiler.compilePrismImageBriefs(plan(basePage()));
  assert.equal(result.valid, true);
  assert.equal(result.briefs[0].spoiler_constraints.anti_spoiler, true);
});

test("Slice 5: anti-spoiler job referencing answer content is diagnosed", () => {
  const planned = plan(basePage());
  planned.jobs[0].resolved_sources.push({
    anchor: "A1.materials.answer_key",
    source_type: "activity_material",
    source_kind: "answer",
    scope: "activity",
    activity_id: "A1",
    field: "materials.answer_key",
    content: "Completed key",
    content_text: "Completed key",
    content_type: "markdown"
  });
  const result = compiler.compilePrismImageBriefs(planned);
  assert.equal(result.valid, false);
  assert.ok(hasCode(result, "PIC_SPOILER_CONFLICT"));
  assert.equal(result.diagnostics.spoiler_conflicts, 1);
  assert.deepEqual(result.briefs, []);
});

test("Slice 5: spoiler conflict on one job does not invent substitute sources", () => {
  const planned = plan(
    basePage({
      visual_affordances: [validActivityGenerate(), validPageGenerate()]
    })
  );
  planned.jobs[0].resolved_sources.push({
    anchor: "A1.answer",
    source_type: "activity_field",
    source_kind: "answer",
    scope: "activity",
    activity_id: "A1",
    field: "answer",
    content: "secret",
    content_text: "secret",
    content_type: "text"
  });
  const result = compiler.compilePrismImageBriefs(planned);
  assert.equal(result.valid, false);
  assert.equal(result.briefs.length, 1);
  assert.equal(result.briefs[0].affordance_id, "va-page-knowledge-summary-01");
  assert.equal(result.diagnostics.partial_compilation, true);
  assert.ok(
    !result.briefs[0].source_evidence.some((s) => s.source_kind === "answer")
  );
});

// --- Diagnostics ---

test("Slice 5: diagnostics counts and representations_used are deterministic", () => {
  const planned = plan(
    basePage({
      visual_affordances: [validActivityGenerate(), validPageGenerate()]
    })
  );
  const result = compiler.compilePrismImageBriefs(planned);
  assert.equal(result.diagnostics.jobs_received, 2);
  assert.equal(result.diagnostics.briefs_created, 2);
  assert.equal(result.diagnostics.briefs_failed, 0);
  assert.equal(result.diagnostics.activity_scoped, 1);
  assert.equal(result.diagnostics.page_scoped, 1);
  assert.deepEqual(result.diagnostics.representations_used, [
    "classification_matrix",
    "concept_map"
  ]);
});

test("Slice 5: errors have stable codes and ordering", () => {
  const planned = plan(basePage());
  planned.jobs[0].preferred_representation = "pie_chart";
  const a = compiler.compilePrismImageBriefs(planned);
  const b = compiler.compilePrismImageBriefs(clone(planned));
  assert.deepEqual(a.errors, b.errors);
});

// --- Legacy ---

test("Slice 5: no-authoritative-planning result returns zero briefs", () => {
  const planned = plan({ title: "Legacy", activities: ACTIVITIES });
  const result = compiler.compilePrismImageBriefs(planned);
  assert.equal(result.valid, true);
  assert.equal(result.authoritative_planning_present, false);
  assert.deepEqual(result.briefs, []);
  assert.equal(result.diagnostics.legacy_path_applicable, true);
  assert.equal(s38.detectVisualAffordanceHandoverMode({ title: "Legacy" }), "legacy");
});

// --- Non-mutation ---

test("Slice 5: planner result / jobs / resolved sources remain byte-equivalent", () => {
  const planned = plan(basePage());
  const before = JSON.stringify(planned);
  const beforeSources = JSON.stringify(planned.jobs[0].resolved_sources);
  compiler.compilePrismImageBriefs(planned);
  assert.equal(JSON.stringify(planned), before);
  assert.equal(JSON.stringify(planned.jobs[0].resolved_sources), beforeSources);
});

test("Slice 5: nested structured content remains byte-equivalent", () => {
  const planned = plan(
    basePage({
      visual_affordances: [
        validActivityGenerate({
          affordance_id: "va-A2-struct",
          activity_id: "A2",
          preferred_representation: "comparison_framework",
          purpose: "comparison",
          evidence_anchors: ["A2.materials.analysis_table"],
          learner_stage: "post_reasoning"
        })
      ]
    })
  );
  const before = JSON.stringify(planned.jobs[0].resolved_sources[0].content_structured);
  compiler.compilePrismImageBriefs(planned);
  assert.equal(
    JSON.stringify(planned.jobs[0].resolved_sources[0].content_structured),
    before
  );
});

test("Slice 5: no provider, image, asset, persistence, or renderer behaviour is introduced", () => {
  assert.equal(typeof compiler.compilePrismImageBriefs, "function");
  const brief = compiler.compilePrismImageBriefs(plan(basePage())).briefs[0];
  assert.ok(brief.generation_instruction);
  assert.ok(!("provider" in brief));
  assert.ok(!("image_url" in brief));
  assert.ok(!("asset_id" in brief));
  assert.ok(!("request_payload" in brief));
});
