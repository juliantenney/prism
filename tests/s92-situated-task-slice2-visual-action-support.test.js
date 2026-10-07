/**
 * Sprint 92 Gate 8 Slice 2 — shared action_support purpose + Situated Task visual planning.
 */
const test = require("node:test");
const assert = require("node:assert/strict");

const s38 = require("../lib/sprint38-visual-affordances.js");
const vpc = require("../lib/visual-planning-contract.js");
const planner = require("../lib/prism-visual-jobs-planner.js");
const compiler = require("../lib/prism-image-brief-compiler.js");
const workspace = require("../lib/utilities-visual-jobs-workspace.js");
const design = require("../lib/situated-task-design-page.js");
const renderer = require("../lib/learner-renderer-vnext");

const LEGACY_PURPOSES = [
  "distinction",
  "comparison",
  "classification",
  "mechanism",
  "evidence_structure",
  "data_pattern_reading",
  "synthesis"
];

function makeGenerateAffordance(purpose, overrides) {
  return Object.assign(
    {
      affordance_id: "va-test-" + purpose,
      scope: "section",
      section_id: "task",
      visual_decision: "generate",
      visual_slot: "section-after-content",
      tier: "essential",
      purpose: purpose,
      preferred_representation: "annotated_system",
      subject: "Test subject",
      context: "Visual brief: test context for " + purpose,
      evidence_anchors: ["task.exposition"],
      rationale: "Educational rationale for " + purpose + " beyond decorative illustration.",
      reasoning_supported: "Learners use the figure for " + purpose + ".",
      learner_stage: "pre_classification",
      anti_spoiler: false,
      representation_avoid: ["generic_infographic", "topic_hero_image"],
      canonical_discipline_note: "Stay within sourced claims.",
      requires_exact_data_match: false,
      must_show: ["labelled structure"],
      must_not_show: ["filled answers"],
      allowed_claims: ["Source-supported structural claim."],
      disallowed_claims: ["Unsupported verdict."],
      source_basis: "task.exposition",
      caption_intent: "Caption for " + purpose,
      alt_text: "Alt text for " + purpose,
      detailed_description: "Detailed description of the figure supporting " + purpose + ".",
      discipline_risk_level: "low"
    },
    overrides || {}
  );
}

test("action_support is accepted by shared Sprint 38 purpose vocabulary", () => {
  assert.ok(s38.PURPOSES.indexOf("action_support") !== -1);
  assert.deepEqual(vpc.PURPOSES, s38.PURPOSES);
  const row = makeGenerateAffordance("action_support");
  const page = {
    visual_affordance_schema_version: "38.4",
    activities_visual_review: [],
    visual_affordances: [row]
  };
  const gate = s38.validatePageVisualAffordances(page);
  assert.equal(gate.valid, true, gate.errors.join("; "));
});

test("existing seven purpose values remain accepted unchanged", () => {
  LEGACY_PURPOSES.forEach((purpose) => {
    const gate = s38.validatePageVisualAffordances({
      visual_affordance_schema_version: "38.4",
      activities_visual_review: [],
      visual_affordances: [makeGenerateAffordance(purpose)]
    });
    assert.equal(gate.valid, true, purpose + ": " + gate.errors.join("; "));
  });
});

test("invalid purpose values still fail", () => {
  const gate = s38.validatePageVisualAffordances({
    visual_affordance_schema_version: "38.4",
    activities_visual_review: [],
    visual_affordances: [makeGenerateAffordance("procedure_support")]
  });
  assert.equal(gate.valid, false);
  assert.ok(gate.errors.some((e) => /purpose must be one of/i.test(e)));
});

test("action_support survives planner/compiler into educational_function", () => {
  const fixture = design.buildSituatedTaskDesignPageFixture({ withActionSupportVisual: true });
  assert.equal(fixture.ok, true, (fixture.errors || []).join("; "));
  const planned = planner.planPrismVisualJobs(fixture.page);
  assert.equal(planned.valid, true, JSON.stringify(planned.errors || planned));
  assert.equal(planned.jobs.length, 1);
  assert.equal(planned.jobs[0].purpose, "action_support");
  assert.equal(planned.jobs[0].scope, "section");
  assert.equal(planned.jobs[0].visual_slot, "section-after-content");
  assert.ok(
    planned.jobs[0].resolved_sources && planned.jobs[0].resolved_sources.length,
    "evidence anchors resolve"
  );

  const compiled = compiler.compilePrismImageBriefs(planned);
  assert.equal(compiled.valid, true, JSON.stringify(compiled.errors || compiled));
  assert.equal(compiled.briefs.length, 1);
  assert.equal(compiled.briefs[0].purpose, "action_support");
  assert.equal(compiled.briefs[0].composition.educational_function, "action_support");
  assert.match(compiled.briefs[0].generation_instruction, /purpose: action_support/);
  assert.match(compiled.briefs[0].generation_instruction, /learner-owned action or process/i);
  assert.doesNotMatch(compiled.briefs[0].generation_instruction, /purpose: mechanism/);
});

test("Situated Stage 5 prompt teaches action_support without requiring graphics", () => {
  const prompt = design.buildSituatedTaskDesignPagePrompt();
  assert.match(prompt, /OPTIONAL VISUAL PLANNING/i);
  assert.match(prompt, /action_support/);
  assert.match(prompt, /Graphics are OPTIONAL/i);
  assert.match(prompt, /section-after-content/);
  assert.match(prompt, /\{section_id\}\.exposition|orient\.exposition|section_id\.path/i);
  assert.match(prompt, /Do not force every Situated figure into action_support/i);
  assert.match(prompt, /omit visual_affordance_schema_version/i);
  const bare = design.buildSituatedTaskDesignPageFixture();
  assert.equal(bare.ok, true);
  assert.equal(Object.prototype.hasOwnProperty.call(bare.page, "visual_affordances"), false);
});

test("Situated page binds section-scoped generate visual with activities: []", () => {
  const fixture = design.buildSituatedTaskDesignPageFixture({ withActionSupportVisual: true });
  assert.equal(fixture.ok, true, (fixture.errors || []).join("; "));
  assert.deepEqual(fixture.page.activities, []);
  assert.equal(fixture.page.visual_affordances[0].scope, "section");
  assert.equal(fixture.page.visual_affordances[0].section_id, "task");
  assert.deepEqual(fixture.page.visual_affordances[0].evidence_anchors, ["task.exposition"]);
  assert.equal(design.validateSituatedTaskDesignPage(fixture.page).ok, true);

  const activityScoped = design.buildSituatedTaskDesignPageFixture({ withActionSupportVisual: true });
  activityScoped.page.visual_affordances[0].scope = "activity";
  activityScoped.page.visual_affordances[0].activity_id = "A1";
  activityScoped.page.visual_affordances[0].section_id = undefined;
  assert.equal(design.validateSituatedTaskDesignPage(activityScoped.page).ok, false);
});

test("no generated visuals → zero required graphics; unsatisfied vs satisfied", () => {
  const bare = design.buildSituatedTaskDesignPageFixture().page;
  const zero = workspace.assessRequiredGraphicsJobsFromPage(bare, {});
  assert.equal(zero.determinable, true);
  assert.equal(zero.complete, true);
  assert.equal(zero.zeroRequired, true);
  assert.equal(zero.requiredCount, 0);

  const withVisual = design.buildSituatedTaskDesignPageFixture({ withActionSupportVisual: true }).page;
  const incomplete = workspace.assessRequiredGraphicsJobsFromPage(withVisual, {
    workflowResourceRefs: [],
    assetsByBriefId: {}
  });
  assert.equal(incomplete.determinable, true);
  assert.equal(incomplete.complete, false);
  assert.ok(incomplete.requiredCount >= 1);

  const planned = planner.planPrismVisualJobs(withVisual);
  const compiled = compiler.compilePrismImageBriefs(planned);
  const briefId = compiled.briefs[0].brief_id;
  const affordanceId = compiled.briefs[0].affordance_id;
  const complete = workspace.assessRequiredGraphicsJobsFromPage(withVisual, {
    workflowResourceRefs: [
      {
        resource_id: "res-1",
        affordance_id: affordanceId,
        brief_id: briefId,
        mime_type: "image/png",
        lifecycle_state: "active",
        workflow_id: "wf-st"
      }
    ],
    assetsByBriefId: {},
    expectedWorkflowId: "wf-st"
  });
  assert.equal(complete.determinable, true);
  assert.equal(complete.complete, true);
  assert.equal(complete.zeroRequired, false);
});

test("Slice 2 visual planning does not disturb shared TeX/Markdown render path", () => {
  const page = design.buildSituatedTaskDesignPageFixture({
    withActionSupportVisual: true,
    orientExposition: "Notice features of \\(x^2\\) in the field setting."
  }).page;
  const rendered = renderer.renderLearnerPageHtml(page, { compositionMode: "moments" });
  assert.equal(rendered.error, null);
  assert.match(rendered.html, /x\^2|\\\(/);
  assert.match(rendered.html, /util-exposition-sections/);
});

test("mechanism purpose meaning is unchanged (not remapped from action_support)", () => {
  const page = design.buildSituatedTaskDesignPageFixture().page;
  page.visual_affordance_schema_version = "38.4";
  page.activities_visual_review = [];
  page.visual_affordances = [
    makeGenerateAffordance("mechanism", {
      preferred_representation: "causal_model",
      rationale: "Shows how parts interact to produce an outcome in the field system."
    })
  ];
  assert.equal(design.validateSituatedTaskDesignPage(page).ok, true);
  const planned = planner.planPrismVisualJobs(page);
  const compiled = compiler.compilePrismImageBriefs(planned);
  assert.equal(compiled.briefs[0].purpose, "mechanism");
  assert.equal(compiled.briefs[0].composition.educational_function, "mechanism");
});
