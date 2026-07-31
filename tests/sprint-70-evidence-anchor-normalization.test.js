/**
 * Evidence-anchor normalization / canonicalization for visual planning.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const vpc = require("../lib/visual-planning-contract.js");
const planner = require("../lib/prism-visual-jobs-planner.js");
const compiler = require("../lib/prism-image-brief-compiler.js");
const workspace = require("../lib/utilities-visual-jobs-workspace.js");

const repoRoot = path.resolve(__dirname, "..");
const romanRoadsPath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-assemble",
  "roman-roads-visual-jobs-valid.json"
);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadRomanRoads() {
  return JSON.parse(fs.readFileSync(romanRoadsPath, "utf8"));
}

function basePage(overrides) {
  return Object.assign(
    {
      visual_affordance_schema_version: "38.4",
      activities_visual_review: [],
      visual_affordances: [],
      activities: [
        {
          activity_id: "A1",
          learner_task: "Classify scenarios.",
          materials: [
            {
              material_id: "A1-M1",
              material_type: "scenarios",
              body: "Scenario cards."
            }
          ]
        },
        {
          activity_id: "A2",
          learner_task: "Compare cases.",
          materials: {
            debrief: "Debrief notes."
          }
        }
      ],
      page_synthesis: {
        knowledge_summary: { body: "Summary body.", format: "markdown" },
        learning_purpose: { body: "Purpose body.", format: "markdown" },
        overview: { body: "Overview body.", format: "markdown" }
      }
    },
    overrides || {}
  );
}

function generateRow(overrides) {
  return Object.assign(
    {
      affordance_id: "va-A1-classification-01",
      scope: "activity",
      activity_id: "A1",
      visual_decision: "generate",
      visual_slot: "materials-entry",
      tier: "valuable",
      purpose: "classification",
      preferred_representation: "classification_matrix",
      subject: "Mechanism classification cues",
      context: "Visual brief: compare mechanisms before the table.",
      evidence_anchors: ["A1.learner_task", "A1.materials.scenarios"],
      must_show: ["demand-pull pathway cues"],
      must_not_show: ["scenario answer key"],
      allowed_claims: ["Different causal mechanisms can produce inflation."],
      disallowed_claims: ["All inflation has one cause."],
      rationale: "Classify before completing the table.",
      anti_spoiler: true,
      spoiler_boundary: {
        hide_answers: true,
        hide_classification_keys: true,
        hide_model_solution: true,
        allow_structural_hint: true
      },
      representation_avoid: ["filled_worksheet", "summary_table"],
      requires_exact_data_match: false,
      source_basis: "A1.learner_task; A1.materials.scenarios",
      caption_intent: "Cause-type cues only.",
      discipline_risk_level: "medium",
      reasoning_supported: "Learners classify without completed classifications.",
      learner_stage: "pre_classification",
      canonical_discipline_note: "Empty labelled cause structures only."
    },
    overrides || {}
  );
}

test("canonical syntax helper accepts activity and page_synthesis forms", () => {
  assert.equal(vpc.isCanonicalEvidenceAnchorSyntax("A1.learner_task"), true);
  assert.equal(vpc.isCanonicalEvidenceAnchorSyntax("A1.materials.scenarios"), true);
  assert.equal(vpc.isCanonicalEvidenceAnchorSyntax("page_synthesis.knowledge_summary"), true);
  assert.equal(vpc.isCanonicalEvidenceAnchorSyntax("page_synthesis.learning_purpose"), true);
});

test("valid activity anchors normalize unchanged and validate", () => {
  const page = basePage({
    visual_affordances: [
      generateRow({ evidence_anchors: ["A1.learner_task", "A1.materials.scenarios"] })
    ]
  });
  const before = JSON.stringify(page.visual_affordances[0].evidence_anchors);
  const normalized = vpc.normalizeVisualPlanningEvidenceAnchors(page);
  assert.equal(JSON.stringify(page.visual_affordances[0].evidence_anchors), before);
  assert.deepEqual(normalized.page.visual_affordances[0].evidence_anchors, [
    "A1.learner_task",
    "A1.materials.scenarios"
  ]);
  assert.equal(normalized.errors.length, 0);
  const contract = vpc.validateVisualPlanningContract(normalized.page);
  assert.equal(contract.valid, true, JSON.stringify(contract.errors));
});

test("valid page_synthesis anchors normalize unchanged and validate", () => {
  const page = basePage({
    visual_affordances: [
      generateRow({
        affordance_id: "va-A6-synthesis-01",
        scope: "page",
        region: "knowledge_summary",
        activity_id: undefined,
        visual_slot: "knowledge-summary-after-content",
        purpose: "synthesis",
        preferred_representation: "concept_map",
        evidence_anchors: ["page_synthesis.knowledge_summary", "page_synthesis.learning_purpose"],
        source_basis: "page_synthesis.knowledge_summary",
        learner_stage: "post_reasoning"
      })
    ]
  });
  delete page.visual_affordances[0].activity_id;
  const normalized = vpc.normalizeVisualPlanningEvidenceAnchors(page);
  assert.deepEqual(normalized.page.visual_affordances[0].evidence_anchors, [
    "page_synthesis.knowledge_summary",
    "page_synthesis.learning_purpose"
  ]);
  assert.equal(normalized.errors.length, 0);
  const contract = vpc.validateVisualPlanningContract(normalized.page);
  assert.equal(contract.valid, true, JSON.stringify(contract.errors));
});

test("malformed free-text anchors are rejected and not invented into paths", () => {
  const page = basePage({
    visual_affordances: [
      generateRow({
        evidence_anchors: ["Imperial Expansion", "Roman Roads", "Trade Networks"],
        source_basis: "topic labels only"
      })
    ]
  });
  const normalized = vpc.normalizeVisualPlanningEvidenceAnchors(page);
  assert.ok(normalized.errors.some((e) => e.code === "VPC_EVIDENCE_ANCHOR_MALFORMED"));
  assert.deepEqual(normalized.page.visual_affordances[0].evidence_anchors, [
    "Imperial Expansion",
    "Roman Roads",
    "Trade Networks"
  ]);
  const contract = vpc.validateVisualPlanningContract(normalized.page);
  assert.equal(contract.valid, false);
  assert.ok(contract.errors.some((e) => e.code === "VPC_EVIDENCE_ANCHOR_MALFORMED"));
});

test("missing path / incomplete activity id is malformed", () => {
  const page = basePage({
    visual_affordances: [generateRow({ evidence_anchors: ["A1"], source_basis: "" })]
  });
  const normalized = vpc.normalizeVisualPlanningEvidenceAnchors(page);
  assert.ok(normalized.errors.some((e) => e.code === "VPC_EVIDENCE_ANCHOR_MALFORMED"));
  const contract = vpc.validateVisualPlanningContract(page);
  assert.equal(contract.valid, false);
  assert.ok(contract.errors.some((e) => e.code === "VPC_EVIDENCE_ANCHOR_MALFORMED"));
});

test("nonexistent activity id remains invalid", () => {
  const page = basePage({
    visual_affordances: [
      generateRow({ evidence_anchors: ["A9.learner_task"], source_basis: "" })
    ]
  });
  const normalized = vpc.normalizeVisualPlanningEvidenceAnchors(page);
  // Already-canonical anchors are preserved for VPC/planner diagnosis.
  assert.deepEqual(normalized.page.visual_affordances[0].evidence_anchors, ["A9.learner_task"]);
  const contract = vpc.validateVisualPlanningContract(page);
  assert.equal(contract.valid, false);
  assert.ok(contract.errors.some((e) => e.code === "VPC_EVIDENCE_ANCHOR_UNKNOWN_ACTIVITY"));
});

test("nonexistent field path stays canonical for planner diagnosis (not invented away)", () => {
  const page = basePage({
    visual_affordances: [
      generateRow({
        evidence_anchors: ["A1.materials.nonexistent_field"],
        source_basis: ""
      })
    ]
  });
  const normalized = vpc.normalizeVisualPlanningEvidenceAnchors(page);
  assert.deepEqual(normalized.page.visual_affordances[0].evidence_anchors, [
    "A1.materials.nonexistent_field"
  ]);
  assert.equal(normalized.errors.length, 0);
  const planned = planner.planPrismVisualJobs(page);
  assert.ok(
    planned.valid === false ||
      (planned.diagnostics && planned.diagnostics.failed_generate && planned.diagnostics.failed_generate.length) ||
      (planned.errors || []).some((e) => /UNRESOLVED|SOURCE|missing/i.test(String(e.code || e.message || "")))
  );
});

test("near-miss space form and path fragments canonicalize against real artefacts", () => {
  const page = basePage({
    visual_affordances: [
      generateRow({
        evidence_anchors: ["A1 learner_task", "materials.scenarios", "learner_task"],
        source_basis: "A1 learner_task; A1 materials.scenarios"
      })
    ]
  });
  const normalized = vpc.normalizeVisualPlanningEvidenceAnchors(page);
  assert.deepEqual(normalized.page.visual_affordances[0].evidence_anchors, [
    "A1.learner_task",
    "A1.materials.scenarios"
  ]);
  assert.equal(normalized.errors.length, 0);
  assert.ok(normalized.changes.length > 0);
  const contract = vpc.validateVisualPlanningContract(normalized.page);
  assert.equal(contract.valid, true, JSON.stringify(contract.errors));
});

test("object-shaped anchors canonicalize when path resolves", () => {
  const page = basePage({
    visual_affordances: [
      generateRow({
        evidence_anchors: [
          { activity_id: "A1", field: "learner_task" },
          { path: "materials.scenarios", activity_id: "A1" }
        ]
      })
    ]
  });
  const normalized = vpc.normalizeVisualPlanningEvidenceAnchors(page);
  assert.deepEqual(normalized.page.visual_affordances[0].evidence_anchors, [
    "A1.learner_task",
    "A1.materials.scenarios"
  ]);
  assert.equal(normalized.errors.length, 0);
});

test("free-text anchors recover from resolvable source_basis without inventing labels", () => {
  const page = basePage({
    visual_affordances: [
      generateRow({
        evidence_anchors: ["Imperial Expansion", "Trade Networks"],
        source_basis: "A1 learner_task; A1 materials.scenarios"
      })
    ]
  });
  const normalized = vpc.normalizeVisualPlanningEvidenceAnchors(page);
  assert.deepEqual(normalized.page.visual_affordances[0].evidence_anchors, [
    "A1.learner_task",
    "A1.materials.scenarios"
  ]);
  assert.equal(normalized.errors.length, 0);
  assert.ok(normalized.changes.some((c) => c.reason === "recovered_from_source_basis"));
});

test("end-to-end: malformed roman-roads anchors normalize then plan and compile", () => {
  const page = loadRomanRoads();
  // Simulate live Design Page free-text / near-miss authoring on known affordances.
  page.visual_affordances.forEach((row) => {
    if (!row || !Array.isArray(row.evidence_anchors)) return;
    if (row.scope === "page") {
      row.evidence_anchors = ["Knowledge Summary", "Learning Purpose"];
      row.source_basis = "page_synthesis.knowledge_summary; page_synthesis.learning_purpose";
      return;
    }
    const aid = String(row.activity_id || "A1");
    row.evidence_anchors = [aid + " learner_task", "materials " + (aid === "A3" ? "comparison_table" : "scenarios")];
    if (aid === "A2") {
      row.evidence_anchors = ["A2 learner_task", "materials worked_example"];
    }
    row.source_basis = row.evidence_anchors.join("; ");
  });

  const pipeline = workspace.buildVisualJobsPipelineFromPage(page);
  assert.equal(
    pipeline.contractResult.valid,
    true,
    JSON.stringify(pipeline.contractResult.errors)
  );
  assert.equal(pipeline.plannerResult.valid, true, JSON.stringify(pipeline.plannerResult.errors));
  assert.ok(pipeline.plannerResult.jobs.length > 0);
  assert.equal(
    pipeline.compilerResult.valid,
    true,
    JSON.stringify(pipeline.compilerResult.errors)
  );
  assert.ok(pipeline.compilerResult.briefs.length > 0);

  const planned = planner.planPrismVisualJobs(page);
  assert.equal(planned.valid, true, JSON.stringify(planned.errors));
  const compiled = compiler.compilePrismImageBriefs(planned);
  assert.equal(compiled.valid, true, JSON.stringify(compiled.errors));
  assert.ok(compiled.briefs.length > 0);
});

test("input page is not mutated by normalizeVisualPlanningEvidenceAnchors", () => {
  const page = basePage({
    visual_affordances: [
      generateRow({ evidence_anchors: ["A1 learner_task", "materials.scenarios"] })
    ]
  });
  const before = JSON.stringify(page);
  vpc.normalizeVisualPlanningEvidenceAnchors(page);
  assert.equal(JSON.stringify(page), before);
});

test("activities_visual_review recovers rationale from alternate gate key", () => {
  const page = basePage({
    activities_visual_review: [
      {
        activity_id: "A1",
        activity_visual_value: { decision: "high", reason: "Matrix supports typing." }
      }
    ],
    visual_affordances: [generateRow()]
  });
  const normalized = vpc.normalizeActivitiesVisualReview(page);
  assert.equal(
    normalized.page.activities_visual_review[0].activity_visual_value.rationale,
    "Matrix supports typing."
  );
  assert.equal(normalized.errors.length, 0);
  const contract = vpc.validateVisualPlanningContract(normalized.page);
  assert.equal(contract.valid, true, JSON.stringify(contract.errors));
});

test("activities_visual_review recovers rationale from matching visual_affordances row", () => {
  const page = basePage({
    activities_visual_review: [
      { activity_id: "A1", activity_visual_value: { decision: "high" } }
    ],
    visual_affordances: [
      generateRow({ rationale: "Classify scenarios by mechanism before the table." })
    ]
  });
  assert.equal(vpc.validateVisualPlanningContract(page).valid, false);
  const normalized = vpc.normalizeVisualPlanningAuthoredFields(page);
  assert.equal(
    normalized.page.activities_visual_review[0].activity_visual_value.rationale,
    "Classify scenarios by mechanism before the table."
  );
  assert.equal(normalized.errors.length, 0);
  const planned = planner.planPrismVisualJobs(page);
  assert.equal(planned.valid, true, JSON.stringify(planned.errors));
});

test("activities_visual_review missing rationale with no recovery remains invalid", () => {
  const page = basePage({
    activities_visual_review: [
      { activity_id: "A1", activity_visual_value: { decision: "high" } },
      { activity_id: "A2", activity_visual_value: { decision: "medium" } }
    ],
    visual_affordances: [
      generateRow({ activity_id: "A1", rationale: "" }),
      generateRow({
        affordance_id: "va-A2-x",
        activity_id: "A2",
        evidence_anchors: ["A2.learner_task"],
        rationale: ""
      })
    ]
  });
  // Empty rationale strings should not count as recovery.
  page.visual_affordances.forEach((row) => {
    row.rationale = "";
  });
  const normalized = vpc.normalizeActivitiesVisualReview(page);
  assert.ok(normalized.errors.length >= 2);
  assert.ok(
    normalized.errors.every((e) => e.code === "VPC_ACTIVITY_REVIEW_INVALID")
  );
  const contract = vpc.validateVisualPlanningContract(page);
  assert.equal(contract.valid, false);
  assert.ok(contract.errors.some((e) => e.code === "VPC_ACTIVITY_REVIEW_INVALID"));
});
