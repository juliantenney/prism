/**
 * Sprint 96 M1 — Navigation and layout (sticky contract + collapsible sidebar).
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fflate = require("fflate");
const path = require("node:path");
const fs = require("node:fs");

const ljDesign = require("../lib/learning-journey-design-page.js");
const ljPackage = require("../lib/learning-journey-learner-package.js");
const unifiedShell = require("../lib/learning-journey-unified-shell.js");
const {
  enhanceFragmentWithSectionNavigation
} = require("../lib/learner-renderer-vnext/sequential-section-nav");

function buildJourney() {
  return ljDesign.buildLearningJourneyDesignPageFixture({
    title: "S96 M1 layout journey",
    sections: [
      {
        section_id: "journey_intro",
        title: "About",
        order: 1,
        exposition: "Overview for layout checks."
      },
      { section_id: "s1", title: "Stop one", order: 2, exposition: "A." },
      { section_id: "s2", title: "Stop two", order: 3, exposition: "B." }
    ],
    commissions: [
      {
        commission_id: "c1",
        section_id: "s1",
        order: 1,
        title: "Stop one",
        product_id: "interactive",
        status: "supported",
        specification_text: "A"
      },
      {
        commission_id: "c2",
        section_id: "s2",
        order: 2,
        title: "Stop two",
        product_id: "expository",
        status: "supported",
        specification_text: "B"
      }
    ]
  });
}

function multiSectionHtml() {
  return enhanceFragmentWithSectionNavigation(
    '<article class="util-learner-page util-learner-renderer-vnext" data-renderer="vnext" role="region" ' +
      'aria-label="Stop one" data-page-kind="interactive" data-persistence-page-key="v1::s96-m1::c1">' +
      '<header class="util-learning-header"><h2 data-lj-resource-title="true">Stop one</h2></header>' +
      '<section data-region="orientation"><div id="journey-orient"><p>One.</p></div></section>' +
      '<section data-region="activities">' +
      '<article id="activity-a1" data-activity-id="a1">' +
      '<h2 class="util-activity-title">Act</h2><textarea id="ws-m1" aria-label="Notes"></textarea></article>' +
      '<article id="activity-a2" data-activity-id="a2">' +
      '<h2 class="util-activity-title">Tips</h2><p>Three.</p></article></section></article>'
  );
}

test("M1: shell CSS uses measured toolbar variable instead of hard-coded 3.75rem", () => {
  const journey = buildJourney();
  assert.equal(journey.ok, true);
  const shell = unifiedShell.buildLearningJourneyUnifiedShellHtml(journey.page, [
    {
      commissionId: "c1",
      title: "Stop one",
      html: multiSectionHtml()
    },
    {
      commissionId: "c2",
      title: "Stop two",
      html:
        '<article data-renderer="vnext" role="region"><h2 data-lj-resource-title="true">Stop two</h2><p>Body</p></article>'
    }
  ]);
  assert.equal(shell.ok, true);
  assert.match(shell.html, /--lj-shell-toolbar-height/);
  assert.match(shell.html, /top:var\(--lj-shell-toolbar-height/);
  assert.doesNotMatch(shell.html, /top:3\.75rem/);
  assert.doesNotMatch(shell.html, /\+ 3\.75rem/);
  assert.match(shell.html, /id="lj-shell-sidebar-toggle"/);
  assert.doesNotMatch(shell.html, /id="lj-shell-sidebar-reopen"/);
  assert.match(shell.html, /aria-controls="lj-shell-toc-panel"/);
  assert.match(shell.html, /--lj-shell-rail-width/);
  assert.match(shell.html, /skipFocus:true/);
  assert.doesNotMatch(shell.html, /lj-shell__resource-step/);
  assert.doesNotMatch(shell.html, /lj-shell__toolbar/);
  assert.match(shell.html, /syncShellLayoutMetrics|lj-shell-toolbar-height/);
  assert.match(shell.html, /SIDEBAR_STORAGE_KEY|prism:lj-shell:sidebar-state/);
  assert.match(shell.html, /--lj-shell-toolbar-height:0px/);
});

test("M1: assemble still produces additive unified ZIP", () => {
  const journey = buildJourney();
  assert.equal(journey.ok, true);
  const assembled = ljPackage.assembleLearningJourneyUnifiedShellPackage({
    page: journey.page,
    constituents: [
      {
        commissionId: "c1",
        title: "Stop one",
        productId: "interactive",
        fragmentHtml: multiSectionHtml()
      },
      {
        commissionId: "c2",
        title: "Stop two",
        productId: "expository",
        fragmentHtml:
          '<article data-renderer="vnext" role="region"><h2 data-lj-resource-title="true">Stop two</h2><p>Body</p></article>'
      }
    ],
    fflate,
    runtimeScript: fs.readFileSync(
      path.join(__dirname, "..", "lib", "learner-renderer-vnext-browser.js"),
      "utf8"
    )
  });
  assert.equal(assembled.ok, true, assembled.error && assembled.error.message);
  const files = fflate.unzipSync(assembled.bytes);
  assert.ok(files["index.html"]);
  const html = Buffer.from(files["index.html"]).toString("utf8");
  assert.match(html, /lj-shell--sidebar-collapsed/);
  assert.match(html, /Hide journey contents/);
});
