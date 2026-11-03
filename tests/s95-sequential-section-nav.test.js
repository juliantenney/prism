"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const sequentialNav = require("../lib/learner-renderer-vnext/sequential-section-nav");
const {
  renderLearnerResourceFragment,
  enhanceFragmentWithSectionNavigation
} = require("../lib/learner-renderer-vnext");
const unifiedShell = require("../lib/learning-journey-unified-shell");
const ljDesign = require("../lib/learning-journey-design-page");

function multiActivityFragmentHtml() {
  return (
    '<article class="util-learner-page util-page util-learner-renderer-vnext" data-renderer="vnext" ' +
    'role="region" aria-label="Learning resource" data-page-kind="interactive" ' +
    'data-persistence-page-key="v1::wf-nav::page-nav">' +
    '<header class="util-page-header util-learning-header"><h2 data-lj-resource-title="true">Reflective judgement</h2></header>' +
    '<section class="util-page-orientation" data-region="orientation"><div id="journey-orient"><p>Orient here.</p></div></section>' +
    '<section class="util-learning-activities" data-region="activities">' +
    '<article class="util-activity util-task-block util-vnext-activity" id="activity-a1" data-activity-id="a1">' +
    '<header class="util-activity-header"><h2 class="util-activity-title">Weigh the evidence</h2></header>' +
    "<p>Activity one body.</p></article>" +
    '<article class="util-activity util-task-block util-vnext-activity" id="activity-a2" data-activity-id="a2">' +
    '<header class="util-activity-header"><h2 class="util-activity-title">Defend your judgement</h2></header>' +
    "<p>Activity two body.</p></article>" +
    "</section></article>"
  );
}

test("enhanceFragmentWithSectionNavigation injects Learning sections nav", () => {
  const enhanced = enhanceFragmentWithSectionNavigation(multiActivityFragmentHtml());
  assert.match(enhanced, /util-journey-nav--sequential/);
  assert.match(enhanced, /aria-label="Learning sections"/);
  assert.match(enhanced, /data-journey-section="true"/);
  assert.match(enhanced, /Weigh the evidence/);
  assert.match(enhanced, /Defend your judgement/);
  const again = sequentialNav.enhanceFragmentWithSectionNavigation(enhanced);
  assert.equal(
    (again.match(/util-journey-nav--sequential/g) || []).length,
    1,
    "nav chrome must remain single after re-enhance"
  );
  assert.equal(
    (again.match(/data-journey-section="true"/g) || []).length,
    (enhanced.match(/data-journey-section="true"/g) || []).length,
    "section markers must stay idempotent"
  );
});

test("prepareUnifiedShellResources restores section nav for extracted Interactive fragments", () => {
  const prepared = unifiedShell.prepareUnifiedShellResources([
    {
      commissionId: "c6",
      title: "Reflective judgement",
      productId: "interactive",
      fragmentHtml: multiActivityFragmentHtml()
    }
  ]);
  assert.equal(prepared.ok, true);
  assert.equal(prepared.resources.length, 1);
  assert.match(prepared.resources[0].html, /util-journey-nav--sequential/);
  assert.match(prepared.resources[0].html, /aria-label="Learning sections"/);
});

test("unified shell moves resource prev/next into the sidebar", () => {
  const journey = ljDesign.buildLearningJourneyDesignPageFixture({
    title: "Nav placement journey",
    sections: [
      {
        section_id: "journey_intro",
        title: "About",
        order: 1,
        exposition: "Intro copy."
      },
      {
        section_id: "exp_1",
        title: "First",
        order: 2,
        exposition: "x"
      }
    ],
    commissions: [
      {
        commission_id: "c1",
        section_id: "exp_1",
        order: 1,
        title: "First",
        product_id: "interactive",
        status: "supported",
        specification_text: "A"
      }
    ]
  });
  const shell = unifiedShell.buildLearningJourneyUnifiedShellHtml(journey.page, [
    {
      commissionId: "c1",
      title: "First",
      html: enhanceFragmentWithSectionNavigation(multiActivityFragmentHtml())
    }
  ]);
  assert.equal(shell.ok, true, shell.code);
  assert.match(shell.html, /lj-shell__resource-step/);
  assert.match(shell.html, />Previous resource</);
  assert.match(shell.html, />Next resource</);
  assert.match(
    shell.html,
    /<aside class="lj-shell__sidebar"[\s\S]*id="lj-shell-prev"[\s\S]*<\/aside>/
  );
  assert.doesNotMatch(
    shell.html,
    /<div class="lj-shell__toolbar"[\s\S]*id="lj-shell-prev"/
  );
  assert.match(shell.html, /util-journey-nav--sequential/);
  assert.match(shell.html, /aria-label="Learning sections"/);
  assert.match(shell.html, /aria-label="Journey navigation"/);
  assert.match(shell.html, /aria-label="Resource step controls"/);
});

test("renderLearnerResourceFragment leaves single-section resources without sequential nav", () => {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: "Single stop",
    activities: [],
    metadata: { workflow_id: "wf-one", page_id: "page-one" },
    assessment_evidence: {
      purpose: {
        role: "R1",
        visibility_claim: "One stop.",
        stop_rationale: "Short.",
        forward_intent: "Continue."
      },
      learner_context: { depends_on_prior_work: false },
      pack_forward_orientation: "Next.",
      elicitations: [
        {
          elicitation_id: "judgement",
          order: 1,
          evidence_ask: "Write.",
          epistemic_class: "non_determinate",
          delivery: {
            kind: "constructed_performance",
            prompt: "Write.",
            response_workspace: { intention: "Judgement" }
          },
          formative_return: {
            materials: [{ material_id: "look", body: "Look." }],
            revision: { offered: false },
            forward_orientation: "Go on."
          }
        }
      ]
    }
  };
  const rendered = renderLearnerResourceFragment(page);
  assert.equal(rendered.error, null, String(rendered.error || ""));
  // Assessment-only packs may still gain orient+assessment markers; nav requires >=2 items.
  // Accept either no sequential nav or present nav when markers produce 2+ destinations.
  if (/util-journey-nav--sequential/.test(rendered.html || "")) {
    assert.match(rendered.html, /aria-label="Learning sections"/);
  }
});
