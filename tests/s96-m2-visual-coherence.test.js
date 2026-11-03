/**
 * Sprint 96 M2 — Visual coherence unit checks (shell chrome simplification).
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
    title: "S96 M2 visual journey",
    sections: [
      {
        section_id: "journey_intro",
        title: "About",
        order: 1,
        exposition: "Overview for visual checks."
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
      'aria-label="Stop one" data-page-kind="interactive" data-persistence-page-key="v1::s96-m2::c1">' +
      '<header class="util-learning-header"><h2 data-lj-resource-title="true">Stop one</h2></header>' +
      '<section data-region="orientation"><div id="journey-orient"><p>One.</p></div></section>' +
      '<section data-region="activities">' +
      '<article id="activity-a1" data-activity-id="a1">' +
      '<h2 class="util-activity-title">Act</h2><textarea id="ws-m2" aria-label="Notes"></textarea></article>' +
      '<article id="activity-a2" data-activity-id="a2">' +
      '<h2 class="util-activity-title">Tips</h2><p>Three.</p></article></section></article>'
  );
}

test("M2: compact icon toggle, full-height sidebar, no prev/next or title bar", () => {
  const journey = buildJourney();
  assert.equal(journey.ok, true);
  const shell = unifiedShell.buildLearningJourneyUnifiedShellHtml(journey.page, [
    { commissionId: "c1", title: "Stop one", html: multiSectionHtml() },
    {
      commissionId: "c2",
      title: "Stop two",
      html:
        '<article data-renderer="vnext" role="region"><h2 data-lj-resource-title="true">Stop two</h2><p>Body</p></article>'
    }
  ]);
  assert.equal(shell.ok, true);

  assert.match(shell.html, /lj-shell__icon-btn/);
  assert.match(shell.html, /aria-label="Hide journey contents"/);
  assert.match(shell.html, /Show journey contents/);
  assert.match(shell.html, /--lj-shell-rail-width:3\.5rem/);
  assert.match(shell.html, /grid-template-columns:var\(--lj-shell-rail-width\)/);
  assert.doesNotMatch(shell.html, /id="lj-shell-sidebar-reopen"/);
  assert.match(shell.html, /skipFocus:true/);
  assert.match(shell.html, /:focus:not\(:focus-visible\)\{outline:none\}/);
  assert.match(shell.html, /<svg class="lj-shell__icon"/);

  assert.doesNotMatch(shell.html, /Previous resource/);
  assert.doesNotMatch(shell.html, /Next resource/);
  assert.doesNotMatch(shell.html, /id="lj-shell-prev"/);
  assert.doesNotMatch(shell.html, /id="lj-shell-next"/);
  assert.doesNotMatch(shell.html, /lj-shell__toolbar/);
  assert.doesNotMatch(shell.html, /lj-shell-current-label/);
  assert.doesNotMatch(shell.html, /lj-shell__resource-step/);

  assert.match(shell.html, /\.lj-shell__sidebar\{[^}]*height:100%/);
  assert.match(shell.html, /\.lj-shell__toc-wrap\{[^}]*overflow:auto/);
  assert.match(shell.html, /--lj-shell-toolbar-height:0px/);
  assert.match(shell.html, /top:var\(--lj-shell-toolbar-height/);
  assert.match(shell.html, /--learner-reading-width:70ch/);
  assert.match(shell.html, /--learner-nav-active-bg:#dbeafe/);
  assert.match(shell.html, /util-learner-content-viewer/);
});

test("M2: assembled ZIP retains reading width token and compact chrome", () => {
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
  const html = Buffer.from(files["index.html"]).toString("utf8");
  assert.match(html, /--learner-reading-width:70ch/);
  assert.match(html, /lj-shell__icon-btn/);
  assert.doesNotMatch(html, /lj-shell__toolbar/);
  assert.doesNotMatch(html, /Previous resource/);
});
