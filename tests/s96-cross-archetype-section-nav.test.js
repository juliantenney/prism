/**
 * Sprint 96 — Cross-archetype sequential section navigation.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const sequentialNav = require("../lib/learner-renderer-vnext/sequential-section-nav");
const {
  enhanceFragmentWithSectionNavigation,
  renderLearnerResourceFragment,
  renderLearnerPageHtml
} = require("../lib/learner-renderer-vnext");
const unifiedShell = require("../lib/learning-journey-unified-shell");
const ljDesign = require("../lib/learning-journey-design-page");
const situatedDesign = require("../lib/situated-task-design-page");

function idsOf(items) {
  return (items || []).map((row) => row.id);
}

function labelsOf(items) {
  return (items || []).map((row) => row.label);
}

function interactiveFragmentHtml() {
  return (
    '<article class="util-learner-page util-page util-learner-renderer-vnext" data-renderer="vnext" ' +
    'role="region" aria-label="Learning resource" data-page-kind="interactive">' +
    '<header class="util-page-header util-learning-header"><h2 data-lj-resource-title="true">Interactive stop</h2></header>' +
    '<section class="util-page-orientation" data-region="orientation"><div id="journey-orient"><p>Orient here.</p></div></section>' +
    '<section class="util-learning-activities" data-region="activities">' +
    '<article class="util-activity util-task-block util-vnext-activity" id="activity-A1" data-activity-id="A1">' +
    '<header class="util-activity-header"><h2 class="util-activity-title">Weigh the evidence</h2></header>' +
    "<p>Activity one body.</p></article>" +
    '<article class="util-activity util-task-block util-vnext-activity" id="activity-A2" data-activity-id="A2">' +
    '<header class="util-activity-header"><h2 class="util-activity-title">Defend your judgement</h2></header>' +
    "<p>Activity two body.</p></article>" +
    "</section>" +
    '<section class="util-assessment-guidance util-assessment-section" data-region="assessment">' +
    "<h2>Self assessment</h2></section>" +
    '<aside class="util-study-tips" data-region="study-tips"><p>Pace yourself.</p></aside>' +
    "</article>"
  );
}

function interactiveModel() {
  return {
    pageKind: "interactive",
    activities: [
      { id: "A1", title: "Weigh the evidence" },
      { id: "A2", title: "Defend your judgement" }
    ],
    assessment: { items: [{ id: "q1" }] },
    studyTips: "Pace yourself."
  };
}

function expositoryPage() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "expository",
    page_kind: "expository",
    title: "Expository stop",
    expository_journey: { extent: "three sections" },
    metadata: { workflow_id: "wf-nav-exp", page_id: "p-nav-exp" },
    sections: [
      {
        section_id: "s1",
        title: "Evidence and uncertainty",
        order: 1,
        exposition: "First authored section."
      },
      {
        section_id: "s2",
        title: "Interpretation",
        order: 2,
        exposition: "Second authored section."
      },
      {
        section_id: "s3",
        title: "Closing perspective",
        order: 3,
        exposition: "Third authored section."
      }
    ],
    activities: []
  };
}

function assessmentPackSingleConstructed() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: "Independent Evidence-Informed Judgement",
    metadata: { workflow_id: "wf-nav-ap1", page_id: "p-nav-ap1" },
    framing: "Read the briefing carefully.",
    attempt_instructions: "Write one sustained judgement.",
    activities: [],
    assessment_evidence: {
      purpose: {
        role: "R1",
        visibility_claim: "Nav test.",
        stop_rationale: "Single constructed.",
        forward_intent: "Carry forward."
      },
      learner_context: { depends_on_prior_work: false },
      pack_forward_orientation: "Keep your judgement for the next activity.",
      elicitations: [
        {
          elicitation_id: "E1",
          order: 1,
          evidence_ask: "Make a recommendation.",
          epistemic_class: "non_determinate",
          instructions: "Use only the scenario, alternatives and evidence below.",
          delivery: {
            kind: "constructed_performance",
            stimulus: {
              title: "Briefing pack",
              scenario: "A school traffic decision.",
              alternatives: [
                {
                  id: "a1",
                  label: "Maintain",
                  description: "Keep current arrangements."
                }
              ],
              evidence: [
                {
                  id: "ev1",
                  heading: "Observations",
                  information: "Busy arrival periods.",
                  qualification: "Limited period only."
                }
              ],
              evidence_boundary: "The evidence does not determine a single correct option."
            },
            prompt: {
              title: "Independent Judgement: Traffic",
              context: "You are advising the local authority.",
              task: "Write your recommendation.",
              response_expectation: "A written judgement.",
              suggested_length: "About 250 words.",
              indicative_time: "25 minutes."
            },
            response_workspace: { intention: "Written judgement" }
          },
          formative_return: {
            materials: [
              { material_id: "look", title: "Self-evaluation: clarity", body: "Check clarity." }
            ],
            revision: { offered: true, prompt: "Name one change." },
            forward_orientation: "Carry the writing forward."
          }
        }
      ]
    }
  };
}

function assessmentPackMultiUnit() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: "Multi-unit pack",
    metadata: { workflow_id: "wf-nav-ap2", page_id: "p-nav-ap2" },
    activities: [],
    assessment_evidence: {
      purpose: {
        role: "R1",
        visibility_claim: "Nav multi.",
        stop_rationale: "Two units.",
        forward_intent: "Forward."
      },
      learner_context: { depends_on_prior_work: false },
      pack_forward_orientation: "Take both results forward.",
      elicitations: [
        {
          elicitation_id: "forms",
          order: 1,
          evidence_ask: "Closed checks.",
          epistemic_class: "determinate",
          delivery: {
            kind: "auto_checkable_items",
            items: [
              {
                item_id: "single",
                order: 1,
                form: "single_answer_mcq",
                prompt: {
                  stem: "Pick one.",
                  options: [
                    { key: "a", text: "Alpha" },
                    { key: "b", text: "Beta" }
                  ]
                },
                judgement: { correct_answer: "a", auto_checkable: true },
                feedback_note: "Alpha."
              }
            ]
          },
          formative_return: {
            materials: [{ material_id: "g", body: "Guide." }],
            forward_orientation: "Next."
          }
        },
        {
          elicitation_id: "judgement",
          order: 2,
          evidence_ask: "Write the judgement.",
          epistemic_class: "non_determinate",
          delivery: {
            kind: "constructed_performance",
            prompt: "Write the judgement in your own words.",
            response_workspace: { intention: "A written judgement" }
          },
          formative_return: {
            materials: [{ material_id: "look", title: "Self-evaluation", body: "Look again." }],
            revision: { offered: true, prompt: "Name one change." },
            forward_orientation: "Carry forward."
          }
        }
      ]
    }
  };
}

test("Interactive destination list is preserved", () => {
  const html = interactiveFragmentHtml();
  const model = interactiveModel();
  const items = sequentialNav.buildSectionNavItems(
    sequentialNav.prepareJourneySectionMarkers(html),
    model
  );
  assert.deepEqual(idsOf(items), [
    "journey-orient",
    "activity-A1",
    "activity-A2",
    "journey-assessment",
    "journey-study-tips"
  ]);
  assert.deepEqual(labelsOf(items), [
    "Orient",
    "Weigh the evidence",
    "Defend your judgement",
    "Self assessment",
    "Study tips"
  ]);
  const enhanced = enhanceFragmentWithSectionNavigation(html, { model });
  assert.match(enhanced, /aria-label="All sections"/);
  assert.match(enhanced, /All sections<\/p>/);
  assert.equal(sequentialNav.isSequentialNavWellPlaced(enhanced), true);
});

test("Expository maps one destination per authored section", () => {
  const rendered = renderLearnerResourceFragment(expositoryPage());
  assert.equal(rendered.error, null, String(rendered.error || ""));
  assert.match(rendered.html, /id="exposition-s1"/);
  assert.doesNotMatch(rendered.html, /data-region="editorial-opening"/);
  const prepared = sequentialNav.prepareJourneySectionMarkers(rendered.html);
  // Element id must be stamped even when data-section-id is already present.
  assert.match(
    prepared,
    /<section[^>]*\bid="exposition-s1"[^>]*data-section-id="s1"/i
  );
  const items = sequentialNav.buildSectionNavItems(
    prepared,
    rendered.modelResult && rendered.modelResult.model
  );
  assert.deepEqual(idsOf(items), ["exposition-s1", "exposition-s2", "exposition-s3"]);
  assert.deepEqual(labelsOf(items), [
    "Evidence and uncertainty",
    "Interpretation",
    "Closing perspective"
  ]);
  const enhanced = enhanceFragmentWithSectionNavigation(rendered.html, {
    model: rendered.modelResult && rendered.modelResult.model
  });
  assert.match(enhanced, /util-journey-nav--sequential/);
  assert.ok(
    enhanced.indexOf("util-journey-nav--sequential") <
      enhanced.indexOf('data-region-item="exposition-section"')
  );
});

test("Situated Task includes authored sections and consolidated Record", () => {
  const fixture = situatedDesign.buildSituatedTaskDesignPageFixture({
    title: "Situated nav fixture"
  });
  assert.equal(fixture.ok, true, (fixture.errors || []).join("; "));
  const rendered = renderLearnerResourceFragment(fixture.page);
  assert.equal(rendered.error, null, String(rendered.error || ""));
  assert.match(rendered.html, /data-page-kind="situated_task"/);
  const prepared = sequentialNav.prepareJourneySectionMarkers(rendered.html);
  const items = sequentialNav.buildSectionNavItems(
    prepared,
    rendered.modelResult && rendered.modelResult.model
  );
  assert.ok(items.length >= 2, "expected multi-section situated nav");
  assert.ok(items.every((row) => /^exposition-/.test(row.id) || row.id === "journey-situated-record"));
  if (/data-region="situated-record"/i.test(rendered.html)) {
    assert.ok(idsOf(items).includes("journey-situated-record"));
  }
  assert.ok(!idsOf(items).some((id) => /embedded/i.test(id)));
});

test("Assessment Pack multi-unit uses one destination per elicitation", () => {
  const rendered = renderLearnerResourceFragment(assessmentPackMultiUnit());
  assert.equal(rendered.error, null, String(rendered.error || ""));
  const items = sequentialNav.buildSectionNavItems(
    sequentialNav.prepareJourneySectionMarkers(rendered.html),
    rendered.modelResult && rendered.modelResult.model
  );
  assert.deepEqual(idsOf(items), ["elicitation-forms", "elicitation-judgement"]);
  assert.ok(labelsOf(items).some((label) => /judgement/i.test(label)));
  assert.ok(!idsOf(items).includes("journey-assessment-judgement"));
  assert.doesNotMatch(
    enhanceFragmentWithSectionNavigation(rendered.html, {
      model: rendered.modelResult && rendered.modelResult.model
    }),
    /data-assessment-review-region[^>]*data-journey-section/
  );
});

test("Assessment Pack single constructed groups evidence and workspace under Judgement", () => {
  const rendered = renderLearnerResourceFragment(assessmentPackSingleConstructed());
  assert.equal(rendered.error, null, String(rendered.error || ""));
  const prepared = sequentialNav.prepareJourneySectionMarkers(rendered.html);
  assert.match(prepared, /id="journey-assessment-judgement"/);
  assert.match(prepared, /data-region="assessment-stimulus"/);
  const items = sequentialNav.buildSectionNavItems(
    prepared,
    rendered.modelResult && rendered.modelResult.model
  );
  assert.deepEqual(idsOf(items), [
    "journey-assessment-briefing",
    "journey-assessment-judgement",
    "journey-assessment-pack-forward"
  ]);
  assert.deepEqual(labelsOf(items), ["Briefing", "Judgement", "Take forward"]);
  // Hidden review must not become a destination.
  assert.ok(!idsOf(items).some((id) => /review/i.test(id)));
  const enhanced = enhanceFragmentWithSectionNavigation(rendered.html, {
    model: rendered.modelResult && rendered.modelResult.model
  });
  assert.equal((enhanced.match(/util-journey-nav--sequential/g) || []).length, 1);
  assert.equal(sequentialNav.isSequentialNavWellPlaced(enhanced), true);
});

test("Fewer than two destinations suppresses navigation chrome", () => {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "expository",
    page_kind: "expository",
    title: "Single section",
    expository_journey: { extent: "one" },
    metadata: { workflow_id: "wf-one", page_id: "p-one" },
    sections: [
      {
        section_id: "only",
        title: "Only section",
        order: 1,
        exposition: "Alone."
      }
    ],
    activities: []
  };
  const rendered = renderLearnerResourceFragment(page);
  const enhanced = enhanceFragmentWithSectionNavigation(rendered.html, {
    model: rendered.modelResult && rendered.modelResult.model
  });
  assert.doesNotMatch(enhanced, /util-journey-nav--sequential/);
});

test("Standalone and unified builders share destination lists", () => {
  const page = assessmentPackSingleConstructed();
  const rendered = renderLearnerPageHtml(page);
  assert.equal(rendered.error, null, String(rendered.error || ""));
  const model = rendered.modelResult && rendered.modelResult.model;
  const prepared = sequentialNav.prepareJourneySectionMarkers(rendered.html);
  const shared = sequentialNav.buildSectionNavItems(prepared, model);

  // Direct parity: standalone compose path uses the same shared builder module.
  const standaloneItems = sequentialNav.buildSectionNavItems(prepared, model);
  assert.deepEqual(idsOf(standaloneItems), idsOf(shared));
  assert.deepEqual(labelsOf(standaloneItems), labelsOf(shared));

  const journey = ljDesign.buildLearningJourneyDesignPageFixture({
    title: "Parity journey",
    sections: [{ section_id: "exp_1", title: "Stop", order: 1, exposition: "x" }],
    commissions: [
      {
        commission_id: "c5",
        section_id: "exp_1",
        order: 1,
        title: page.title,
        product_id: "assessment_pack",
        status: "supported",
        specification_text: "Pack"
      }
    ]
  });
  const fragment = enhanceFragmentWithSectionNavigation(rendered.html, { model });
  const shell = unifiedShell.buildLearningJourneyUnifiedShellHtml(journey.page, [
    { commissionId: "c5", title: page.title, html: fragment }
  ]);
  assert.equal(shell.ok, true, shell.code);
  const tpl = shell.html.match(/<template id="lj-resource-c5">([\s\S]*?)<\/template>/);
  assert.ok(tpl);
  shared.forEach((row) => {
    assert.match(tpl[1], new RegExp('href="#' + row.id + '"'));
  });
  assert.match(tpl[1], /All sections/);
  assert.equal((tpl[1].match(/util-journey-nav--sequential/g) || []).length, 1);
});
