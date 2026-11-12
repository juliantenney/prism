/**
 * Sprint 97 M2 Task 1 — Learning Journal navigation and read-only view.
 * Fixture journal specs only; no artefact population or notifications.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const ljDesign = require("../lib/learning-journey-design-page.js");
const unifiedShell = require("../lib/learning-journey-unified-shell.js");

function resourceFragment(title) {
  return (
    '<div class="util-learner-renderer-vnext" data-product-id="assessment_pack">' +
    '<header class="util-page-header"><h2 data-lj-resource-title="true">' +
    title +
    "</h2></header>" +
    "<p>Fixture resource body.</p></div>"
  );
}

function journeyWithTwoStops() {
  return ljDesign.buildLearningJourneyDesignPageFixture({
    title: "Journal navigation journey",
    introExposition: "Move between two formative stops without leaving this document.",
    experienceTitle: "First formative stop",
    experienceExposition: "Enter a response, then continue.",
    sections: [
      {
        section_id: "journey_intro",
        title: "About this journey",
        order: 1,
        exposition: "Move between two formative stops without leaving this document."
      },
      {
        section_id: "exp_1",
        title: "First formative stop",
        order: 2,
        exposition: "Enter a response, then continue."
      },
      {
        section_id: "exp_2",
        title: "Second formative stop",
        order: 3,
        exposition: "A second stop with its own draft identity."
      }
    ],
    commissions: [
      {
        commission_id: "c1",
        section_id: "exp_1",
        order: 1,
        title: "First formative stop",
        product_id: "assessment_pack",
        status: "supported",
        specification_text: "Assessment Pack A"
      },
      {
        commission_id: "c2",
        section_id: "exp_2",
        order: 2,
        title: "Second formative stop",
        product_id: "assessment_pack",
        status: "supported",
        specification_text: "Assessment Pack B"
      }
    ]
  });
}

function buildShell(page, journalSpec) {
  const opts = {};
  if (arguments.length >= 2) {
    opts.journalSpec = journalSpec;
  }
  return unifiedShell.buildLearningJourneyUnifiedShellHtml(
    page,
    [
      {
        commissionId: "c1",
        title: "First formative stop",
        html: resourceFragment("First formative stop")
      },
      {
        commissionId: "c2",
        title: "Second formative stop",
        html: resourceFragment("Second formative stop")
      }
    ],
    opts
  );
}

function fixtureJournal() {
  return {
    enabled: true,
    title: "My Learning Journal",
    entries: [
      {
        entry_id: "j2",
        order: 2,
        title: "Second look <script>alert(1)</script>",
        framing: "Revisit **judgement** after the second stop.\n\n<script>x</script>",
        artefact_id: "c2.E1"
      },
      {
        entry_id: "j1",
        order: 1,
        title: "First reflection",
        framing: "Look back at your opening evidence.",
        artefact_id: "c1.E1"
      }
    ]
  };
}

test("S97-T-003 normalizeLearningJournalSpec respects enabled and declared order", () => {
  const disabled = unifiedShell.normalizeLearningJournalSpec({
    enabled: false,
    title: "Hidden",
    entries: [{ entry_id: "j1", order: 1, title: "A", artefact_id: "c1.E1" }]
  });
  assert.equal(disabled.enabled, false);
  assert.deepEqual(disabled.entries, []);

  const absent = unifiedShell.normalizeLearningJournalSpec(null);
  assert.equal(absent.enabled, false);

  const ordered = unifiedShell.normalizeLearningJournalSpec(fixtureJournal());
  assert.equal(ordered.enabled, true);
  assert.equal(ordered.title, "My Learning Journal");
  assert.equal(ordered.entries.length, 2);
  assert.equal(ordered.entries[0].entryId, "j1");
  assert.equal(ordered.entries[1].entryId, "j2");
});

test("S97-T-003 enabled journal sits outside Contents with configured title", () => {
  const journey = journeyWithTwoStops();
  assert.equal(journey.ok, true, (journey.errors || []).join("; "));

  const shell = buildShell(journey.page, fixtureJournal());
  assert.equal(shell.ok, true, shell.code);
  assert.equal(shell.hasJournal, true);
  assert.equal(shell.journalId, "journal");

  assert.match(shell.html, /id="lj-shell-toc-label"[^>]*>Contents</);
  assert.match(
    shell.html,
    /id="lj-shell-journal-label"[^>]*>Learning Journal</
  );
  assert.match(
    shell.html,
    /data-lj-nav-id="journal"[^>]*data-lj-journal-title="My Learning Journal"/
  );
  assert.match(shell.html, /lj-shell__toc-link-text">My Learning Journal</);

  const contentsClose = shell.html.indexOf("</ol></nav>");
  const journalLabel = shell.html.indexOf('id="lj-shell-journal-label"');
  assert.ok(contentsClose > 0, "contents nav should close");
  assert.ok(journalLabel > contentsClose, "Learning Journal heading must follow Contents");

  assert.match(shell.html, /data-lj-nav-id="overview"/);
  assert.match(shell.html, /data-lj-nav-id="c1"/);
  assert.match(shell.html, /data-lj-nav-id="c2"/);
  assert.match(shell.html, /<template id="lj-resource-journal">/);
  assert.match(shell.html, /data-lj-journal="true"/);
  assert.match(shell.html, /id="lj-shell-journal-spec"/);
  assert.doesNotMatch(shell.html, /product_id":"learning_journal"/);
});

test("S97-T-003 journal entries render ordered, escaped, with missing placeholders", () => {
  const journey = journeyWithTwoStops();
  assert.equal(journey.ok, true, (journey.errors || []).join("; "));

  const shell = buildShell(journey.page, fixtureJournal());
  assert.equal(shell.ok, true, shell.code);

  const journalHtml = unifiedShell.buildJournalTemplateHtml(fixtureJournal());
  assert.match(journalHtml, /data-lj-journal-entry="j1"/);
  assert.match(journalHtml, /data-lj-journal-entry="j2"/);
  assert.match(journalHtml, /data-lj-journal-artefact="c1\.E1"/);
  assert.match(journalHtml, /data-lj-journal-artefact="c2\.E1"/);
  assert.match(journalHtml, /First reflection/);
  assert.match(journalHtml, /Second look &lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(journalHtml, /<script>alert\(1\)<\/script>/);
  assert.match(journalHtml, /<strong>judgement<\/strong>/);
  assert.doesNotMatch(journalHtml, /<script>x<\/script>/);
  assert.match(
    journalHtml,
    /data-lj-journal-artefact-status="missing"[^>]*>[\s\S]*Your work for this entry is not available yet\./
  );

  const firstIdx = journalHtml.indexOf('data-lj-journal-entry="j1"');
  const secondIdx = journalHtml.indexOf('data-lj-journal-entry="j2"');
  assert.ok(firstIdx >= 0 && secondIdx > firstIdx, "entries must follow declared order");

  assert.match(shell.html, /id="lj-shell-journal-heading"[^>]*>My Learning Journal</);
  assert.match(shell.html, /data-lj-journal-entry="j1"/);
  assert.match(shell.html, /Your work for this entry is not available yet\./);
});

test("S97-T-003 / S97-T-006 absent or disabled journal preserves Sprint 96 shell behaviour", () => {
  const journey = journeyWithTwoStops();
  assert.equal(journey.ok, true, (journey.errors || []).join("; "));

  const absent = buildShell(journey.page);
  assert.equal(absent.ok, true, absent.code);
  assert.equal(absent.hasJournal, false);
  assert.doesNotMatch(absent.html, /lj-shell-journal-label/);
  assert.doesNotMatch(absent.html, /data-lj-nav-id="journal"/);
  assert.doesNotMatch(absent.html, /data-lj-journal=/);
  assert.doesNotMatch(absent.html, /id="lj-shell-journal-spec"/);
  assert.match(absent.html, /data-lj-nav-id="overview"/);
  assert.match(absent.html, /data-lj-nav-id="c1"/);
  assert.match(absent.html, /data-lj-nav-id="c2"/);

  const disabled = buildShell(journey.page, {
    enabled: false,
    title: "My Learning Journal",
    entries: [{ entry_id: "j1", order: 1, title: "Hidden", artefact_id: "c1.E1" }]
  });
  assert.equal(disabled.ok, true, disabled.code);
  assert.equal(disabled.hasJournal, false);
  assert.doesNotMatch(disabled.html, /lj-shell-journal-label/);
  assert.doesNotMatch(disabled.html, /data-lj-nav-id="journal"/);

  const fromPage = journeyWithTwoStops();
  assert.equal(fromPage.ok, true);
  fromPage.page.learning_journey = Object.assign({}, fromPage.page.learning_journey || {}, {
    journal: fixtureJournal()
  });
  const pageShell = unifiedShell.buildLearningJourneyUnifiedShellHtml(fromPage.page, [
    {
      commissionId: "c1",
      title: "First formative stop",
      html: resourceFragment("First formative stop")
    },
    {
      commissionId: "c2",
      title: "Second formative stop",
      html: resourceFragment("Second formative stop")
    }
  ]);
  assert.equal(pageShell.ok, true, pageShell.code);
  assert.equal(pageShell.hasJournal, true);
  assert.match(
    pageShell.html,
    /data-lj-nav-id="journal"[^>]*data-lj-journal-title="My Learning Journal"/
  );
});
