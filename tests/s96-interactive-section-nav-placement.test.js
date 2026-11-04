/**
 * Sprint 96 — Interactive section nav must sit at the resource top in unified shell.
 * Standalone packages keep sticky nav outside <main>; extracted fragments lose it.
 * Re-injection must not anchor on util-activity-header (first </header> after strip).
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const sequentialNav = require("../lib/learner-renderer-vnext/sequential-section-nav");
const {
  enhanceFragmentWithSectionNavigation
} = require("../lib/learner-renderer-vnext");
const unifiedShell = require("../lib/learning-journey-unified-shell");

function stripInlinePageHeader(html) {
  return String(html || "").replace(
    /<header class="util-page-header util-learning-header"[\s\S]*?<\/header>/i,
    ""
  );
}

function packageLikeInteractiveFragment() {
  return (
    '<article class="util-learner-page util-page util-learner-renderer-vnext" data-renderer="vnext" ' +
    'role="region" aria-label="Learning resource" data-page-kind="interactive">' +
    '<div class="util-learner-draft-controls" data-learner-draft-controls="true">' +
    '<p data-learner-draft-status>Draft not saved</p>' +
    '<button type="button" data-learner-draft-clear>Clear saved responses</button></div>' +
    '<section class="util-page-orientation" data-region="orientation">' +
    '<div id="journey-orient"><p>Orient here.</p></div></section>' +
    '<section class="util-learning-activities" data-region="activities">' +
    '<article class="util-activity util-task-block util-vnext-activity" id="activity-A1" data-activity-id="A1">' +
    '<header class="util-activity-header"><h2 class="util-activity-title">Weigh the evidence</h2></header>' +
    "<p>Activity one body.</p></article>" +
    '<article class="util-activity util-task-block util-vnext-activity" id="activity-A2" data-activity-id="A2">' +
    '<header class="util-activity-header"><h2 class="util-activity-title">Defend your judgement</h2></header>' +
    "<p>Activity two body.</p></article>" +
    "</section></article>"
  );
}

function navIndex(html) {
  return String(html || "").search(/<nav\b[^>]*\butil-journey-nav--sequential\b/i);
}

function activityIndex(html) {
  return String(html || "").search(/<article\b[^>]*\bid=["']activity-/i);
}

test("enhance injects section nav before activities when page header is absent", () => {
  const enhanced = enhanceFragmentWithSectionNavigation(packageLikeInteractiveFragment());
  assert.match(enhanced, /util-journey-nav--sequential/);
  assert.equal(sequentialNav.isSequentialNavWellPlaced(enhanced), true);
  assert.ok(navIndex(enhanced) > 0);
  assert.ok(navIndex(enhanced) < activityIndex(enhanced));
  // Prefer seating after draft controls when no page header.
  const draftAt = enhanced.indexOf("data-learner-draft-controls");
  assert.ok(draftAt >= 0 && draftAt < navIndex(enhanced));
});

test("enhance relocates nav previously buried after activity header", () => {
  const buried =
    '<article class="util-learner-page" data-renderer="vnext" data-page-kind="interactive">' +
    '<section class="util-page-orientation" data-region="orientation">' +
    '<div id="journey-orient"><p>Orient.</p></div></section>' +
    '<section class="util-learning-activities" data-region="activities">' +
    '<article class="util-activity" id="activity-A1" data-activity-id="A1">' +
    '<header class="util-activity-header"><h2 class="util-activity-title">One</h2></header>' +
    '<nav class="util-journey-nav util-journey-nav--sequential" aria-label="Learning sections" data-journey-total="3">' +
    '<div class="util-journey-sequential"><div class="util-journey-sequential__row">' +
    '<button type="button" class="util-journey-all-btn" aria-expanded="false">All</button>' +
    '<div class="util-journey-current-wrap"><span data-journey-current-title="true">Orient</span></div>' +
    "</div>" +
    '<div id="util-journey-all-panel" class="util-journey-all-panel" hidden>' +
    '<a class="util-journey-all-link" href="#journey-orient">Orient</a>' +
    '<a class="util-journey-all-link" href="#activity-A1">One</a>' +
    '<a class="util-journey-all-link" href="#activity-A2">Two</a>' +
    "</div></div></nav>" +
    "<p>Body one.</p></article>" +
    '<article class="util-activity" id="activity-A2" data-activity-id="A2">' +
    '<header class="util-activity-header"><h2 class="util-activity-title">Two</h2></header>' +
    "<p>Body two.</p></article></section></article>";

  assert.equal(sequentialNav.isSequentialNavWellPlaced(buried), false);
  const fixed = enhanceFragmentWithSectionNavigation(buried);
  assert.equal(sequentialNav.isSequentialNavWellPlaced(fixed), true);
  assert.equal((fixed.match(/util-journey-nav--sequential/g) || []).length, 1);
  assert.ok(navIndex(fixed) < activityIndex(fixed));
  assert.match(fixed, /href="#journey-orient"/);
  assert.match(fixed, /href="#activity-A2"/);
});

test("shell builder reseats package-stripped Interactive nav above activities", () => {
  const journey = require("../lib/learning-journey-design-page").buildLearningJourneyDesignPageFixture({
    title: "Nav placement",
    sections: [
      { section_id: "exp_1", title: "Interactive stop", order: 1, exposition: "x" }
    ],
    commissions: [
      {
        commission_id: "c2",
        section_id: "exp_1",
        order: 1,
        title: "Evaluating and Weighing Evidence",
        product_id: "interactive",
        status: "supported",
        specification_text: "Interactive"
      }
    ]
  });
  assert.equal(journey.ok, true, (journey.errors || []).join("; "));

  const shell = unifiedShell.buildLearningJourneyUnifiedShellHtml(journey.page, [
    {
      commissionId: "c2",
      title: "Evaluating and Weighing Evidence",
      html: packageLikeInteractiveFragment()
    }
  ]);
  assert.equal(shell.ok, true, shell.code);
  const tpl = shell.html.match(/<template id="lj-resource-c2">([\s\S]*?)<\/template>/);
  assert.ok(tpl);
  const body = tpl[1];
  assert.match(body, /util-journey-nav--sequential/);
  assert.equal(sequentialNav.isSequentialNavWellPlaced(body), true);
  assert.ok(navIndex(body) < activityIndex(body));
  assert.match(body, /data-lj-resource-title="true"/);
  // Title then nav (not nav buried under activity).
  const titleAt = body.search(/data-lj-resource-title/);
  assert.ok(titleAt >= 0 && titleAt < navIndex(body));
});

test("standalone Deciding Under Uncertainty Interactive packages keep external sticky nav", () => {
  const standalonePath = path.join(
    __dirname,
    "..",
    ".tmp-artefact-inspect-14",
    "standalone-pkg",
    "c2",
    "index.html"
  );
  if (!fs.existsSync(standalonePath)) {
    // Optional fixture from Downloads extract — skip if absent.
    return;
  }
  const html = fs.readFileSync(standalonePath, "utf8");
  assert.match(html, /util-journey-nav--sequential/);
  const extracted = unifiedShell.extractRendererFragmentFromHtml(html);
  assert.equal(extracted.ok, true, extracted.code);
  // Fragment alone loses sticky chrome (expected standalone packaging).
  assert.doesNotMatch(extracted.html, /util-journey-nav--sequential/);
  const restored = enhanceFragmentWithSectionNavigation(
    stripInlinePageHeader(extracted.html)
  );
  assert.match(restored, /util-journey-nav--sequential/);
  assert.equal(sequentialNav.isSequentialNavWellPlaced(restored), true);
  assert.ok(navIndex(restored) < activityIndex(restored));
});
