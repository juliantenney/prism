/**
 * Sprint 96 — Resource titles must remain visible in unified shell main content.
 * Standalone vNext exports strip util-page-header; package fragments therefore arrive
 * without an in-content title. The shell must restore one without duplicating.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const ljDesign = require("../lib/learning-journey-design-page.js");
const unifiedShell = require("../lib/learning-journey-unified-shell.js");
const {
  renderLearnerResourceFragment
} = require("../lib/learner-renderer-vnext");

function assessmentPage(overrides) {
  const src = overrides && typeof overrides === "object" ? overrides : {};
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: src.title || "Independent Evidence-Informed Judgement",
    activities: [],
    metadata: {
      workflow_id: src.workflowId || "wf-s96-title",
      page_id: src.pageId || "page-s96-title"
    },
    assessment_evidence: {
      purpose: {
        role: "R1",
        visibility_claim: "Title regression.",
        stop_rationale: "A short formative stop.",
        forward_intent: "Carry forward."
      },
      learner_context: { depends_on_prior_work: false },
      pack_forward_orientation: "Use the result.",
      elicitations: [
        {
          elicitation_id: "judgement",
          order: 1,
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
            forward_orientation: "Carry the writing forward."
          }
        }
      ]
    }
  };
}

function journeyFixture(title) {
  return ljDesign.buildLearningJourneyDesignPageFixture({
    title: "Title restoration journey",
    introExposition: "Overview copy.",
    experienceTitle: title,
    experienceExposition: "Enter a response.",
    sections: [
      {
        section_id: "exp_1",
        title: title,
        order: 1,
        exposition: "Enter a response."
      }
    ],
    commissions: [
      {
        commission_id: "c5",
        section_id: "exp_1",
        order: 1,
        title: title,
        product_id: "assessment_pack",
        status: "supported",
        specification_text: "Assessment Pack"
      }
    ]
  });
}

function stripInlinePageHeader(html) {
  return String(html || "").replace(
    /<header class="util-page-header util-learning-header"[\s\S]*?<\/header>/i,
    ""
  );
}

function countResourceTitleMarks(html) {
  return (String(html || "").match(/\bdata-lj-resource-title\b/gi) || []).length;
}

test("ensureResourceTitleHeading restores title after stripped package header", () => {
  const title = "Independent Evidence-Informed Judgement";
  const rendered = renderLearnerResourceFragment(
    assessmentPage({ title, workflowId: "wf-strip", pageId: "p-strip" })
  );
  assert.equal(rendered.error, null, String(rendered.error || ""));
  assert.match(rendered.html, /util-page-header/);

  const stripped = stripInlinePageHeader(rendered.html);
  assert.doesNotMatch(stripped, /util-page-header/);
  assert.doesNotMatch(stripped, /data-lj-resource-title/);

  const restored = unifiedShell.ensureResourceTitleHeading(stripped, title);
  assert.match(
    restored,
    /<header class="util-page-header util-learning-header"><h2 data-lj-resource-title="true" tabindex="-1">Independent Evidence-Informed Judgement<\/h2><\/header>/
  );
  assert.equal(countResourceTitleMarks(restored), 1);

  // Draft controls stay ahead of the restored title (renderer body order).
  const draftAt = restored.indexOf("data-learner-draft-controls");
  const titleAt = restored.indexOf("data-lj-resource-title");
  if (draftAt >= 0) {
    assert.ok(draftAt < titleAt, "title should follow draft controls when present");
  }
});

test("ensureResourceTitleHeading does not duplicate an existing resource heading", () => {
  const title = "Independent Evidence-Informed Judgement";
  const rendered = renderLearnerResourceFragment(
    assessmentPage({ title, workflowId: "wf-keep", pageId: "p-keep" })
  );
  const demoted = unifiedShell.demoteLeadingH1(rendered.html);
  assert.match(demoted, /data-lj-resource-title="true"/);
  const once = unifiedShell.ensureResourceTitleHeading(demoted, title);
  const twice = unifiedShell.ensureResourceTitleHeading(once, title);
  assert.equal(countResourceTitleMarks(twice), 1);
  assert.equal(
    (twice.match(/Independent Evidence-Informed Judgement/g) || []).length,
    (demoted.match(/Independent Evidence-Informed Judgement/g) || []).length
  );
});

test("unified shell restores package-stripped titles into templates", () => {
  const title = "Independent Evidence-Informed Judgement";
  const journey = journeyFixture(title);
  assert.equal(journey.ok, true, (journey.errors || []).join("; "));

  const rendered = renderLearnerResourceFragment(
    assessmentPage({ title, workflowId: "wf-shell", pageId: "p-shell" })
  );
  const packageLikeHtml = stripInlinePageHeader(rendered.html);
  assert.doesNotMatch(packageLikeHtml, /util-page-header/);

  const shell = unifiedShell.buildLearningJourneyUnifiedShellHtml(journey.page, [
    { commissionId: "c5", title, html: packageLikeHtml }
  ]);
  assert.equal(shell.ok, true, shell.code);

  const templateMatch = shell.html.match(
    /<template id="lj-resource-c5">([\s\S]*?)<\/template>/
  );
  assert.ok(templateMatch, "c5 template missing");
  const template = templateMatch[1];
  assert.match(
    template,
    /<h2 data-lj-resource-title="true"[^>]*>Independent Evidence-Informed Judgement<\/h2>/
  );
  assert.equal(countResourceTitleMarks(template), 1);
  // Journey keeps the sole document h1 in the sidebar brand.
  assert.match(shell.html, /<header class="lj-shell__brand"><h1>/);
  assert.doesNotMatch(shell.html, /lj-shell__toolbar/);
  assert.doesNotMatch(template, /<h1\b/i);
});

test("prepareUnifiedShellResources + shell keeps titles from stripped package HTML", () => {
  const title = "Independent Evidence-Informed Judgement";
  const journey = journeyFixture(title);
  const rendered = renderLearnerResourceFragment(
    assessmentPage({ title, workflowId: "wf-prep", pageId: "p-prep" })
  );
  // Mimic standalone package HTML: <main data-renderer=vnext>…</main> without page header.
  const packageBody = stripInlinePageHeader(rendered.html)
    .replace(/^<article\b/i, "<main")
    .replace(/<\/article>\s*$/i, "</main>");
  const packageHtml =
    "<!DOCTYPE html><html><body>" + packageBody + "</body></html>";

  const prepared = unifiedShell.prepareUnifiedShellResources(
    [
      {
        commissionId: "c5",
        title,
        productId: "assessment_pack",
        learnerPackage: { html: packageHtml }
      }
    ],
    {}
  );
  assert.equal(
    prepared.ok,
    true,
    JSON.stringify(prepared.warnings || [], null, 2)
  );
  assert.equal(prepared.resources.length, 1);
  // prepareUnifiedShellResources restores the in-content title before seating nav.
  assert.match(prepared.resources[0].html, /util-page-header/);
  assert.match(
    prepared.resources[0].html,
    /data-lj-resource-title="true"[^>]*>Independent Evidence-Informed Judgement</
  );

  const shell = unifiedShell.buildLearningJourneyUnifiedShellHtml(
    journey.page,
    prepared.resources
  );
  assert.equal(shell.ok, true, shell.code);
  assert.match(
    shell.html,
    /<template id="lj-resource-c5">[\s\S]*data-lj-resource-title="true"[\s\S]*Independent Evidence-Informed Judgement[\s\S]*<\/template>/
  );
});
