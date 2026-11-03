/**
 * Sprint 95 M2 — Unified Learning Journey shell (Node assembly + lifecycle).
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
  renderLearnerResourceFragment,
  mountLearnerResource
} = require("../lib/learner-renderer-vnext");
const learnerPackage = require("../lib/learner-package.js");

function assessmentPage(overrides) {
  const src = overrides && typeof overrides === "object" ? overrides : {};
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: src.title || "Formative stop",
    activities: [],
    metadata: {
      workflow_id: src.workflowId || "wf-s95-m2-a",
      page_id: src.pageId || "page-s95-m2-a"
    },
    assessment_evidence: {
      purpose: {
        role: "R1",
        visibility_claim: "Shell persistence.",
        stop_rationale: "A short formative stop.",
        forward_intent: "Carry the checked distinctions forward."
      },
      learner_context: { depends_on_prior_work: false },
      pack_forward_orientation: "Use the result in the next block.",
      elicitations: [
        {
          elicitation_id: "forms",
          order: 1,
          evidence_ask: "Work through each closed check.",
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
                feedback_note: "Alpha is the named choice."
              }
            ]
          },
          formative_return: {
            materials: [{ material_id: "guide", body: "Use the check result." }],
            forward_orientation: "Take the checked result forward."
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
            forward_orientation: "Carry the writing forward."
          }
        }
      ]
    }
  };
}

function journeyWithTwoAssessmentStops() {
  return ljDesign.buildLearningJourneyDesignPageFixture({
    title: "Unified shell journey",
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

function unzipText(bytes, entry) {
  const files = fflate.unzipSync(bytes);
  const raw = files[entry];
  assert.ok(raw, "missing zip entry " + entry);
  return Buffer.from(raw).toString("utf8");
}

test("S95-T-006 shell HTML has one main, persistent TOC, and two resource templates", () => {
  const journey = journeyWithTwoAssessmentStops();
  assert.equal(journey.ok, true, (journey.errors || []).join("; "));

  const a = renderLearnerResourceFragment(
    assessmentPage({ title: "First formative stop", workflowId: "wf-a", pageId: "p-a" })
  );
  const b = renderLearnerResourceFragment(
    assessmentPage({ title: "Second formative stop", workflowId: "wf-b", pageId: "p-b" })
  );
  assert.equal(a.error, null, String(a.error || ""));
  assert.equal(b.error, null, String(b.error || ""));

  const shell = unifiedShell.buildLearningJourneyUnifiedShellHtml(journey.page, [
    { commissionId: "c1", title: "First formative stop", html: a.html },
    { commissionId: "c2", title: "Second formative stop", html: b.html }
  ]);
  assert.equal(shell.ok, true, shell.code);
  assert.match(shell.html, /data-lj-shell="unified"/);
  assert.match(shell.html, /<aside class="lj-shell__sidebar"[^>]*id="lj-shell-sidebar"/);
  assert.match(shell.html, /aria-labelledby="lj-shell-toc-label"/);
  assert.match(shell.html, /data-lj-nav-id="c1"/);
  assert.match(shell.html, /data-lj-nav-id="c2"/);
  assert.doesNotMatch(shell.html, /id="lj-shell-prev"/);
  assert.doesNotMatch(shell.html, /id="lj-shell-next"/);
  assert.doesNotMatch(shell.html, /Previous resource/);
  assert.doesNotMatch(shell.html, /Next resource/);
  assert.doesNotMatch(shell.html, /lj-shell__toolbar/);
  assert.doesNotMatch(shell.html, /lj-shell__resource-step/);
  assert.match(shell.html, /id="lj-shell-sidebar-toggle"/);
  assert.doesNotMatch(shell.html, /id="lj-shell-sidebar-reopen"/);
  assert.match(shell.html, /lj-shell__icon-btn/);
  assert.match(shell.html, /aria-label="Hide journey contents"/);
  assert.match(shell.html, /--lj-shell-rail-width:3\.5rem/);
  assert.match(shell.html, /top:var\(--lj-shell-toolbar-height/);
  assert.doesNotMatch(shell.html, /top:3\.75rem/);

  assert.match(shell.html, /id="lj-shell-live"[^>]*aria-live="polite"/);
  assert.equal((shell.html.match(/<main\b/gi) || []).length, 1);
  assert.match(shell.html, /<main id="lj-shell-main"/);
  assert.match(shell.html, /<template id="lj-resource-c1">/);
  assert.match(shell.html, /<template id="lj-resource-c2">/);
  assert.doesNotMatch(shell.html, /<iframe\b/i);
  assert.match(shell.html, /Move between two formative stops/);
  assert.equal(shell.hasOverview, true);
  assert.match(shell.html, /data-lj-nav-id="overview"[^>]*>Overview</);
  assert.match(shell.html, /<template id="lj-resource-overview">/);
  assert.match(shell.html, /data-lj-overview="true"/);
  assert.doesNotMatch(shell.html, /lj-shell__intro/);
  assert.match(
    shell.html,
    /<\/aside><div class="lj-shell__workspace"><div id="lj-shell-live"/
  );
  // Resource title demoted so journey keeps the sole document h1.
  assert.match(shell.html, /<h1>Unified shell journey<\/h1>/);
  assert.match(shell.html, /data-lj-resource-title="true"/);
});

test("unified shell Overview renders Markdown and is the default destination", () => {
  const journey = ljDesign.buildLearningJourneyDesignPageFixture({
    title: "Overview markdown journey",
    sections: [
      {
        section_id: "journey_intro",
        title: "About this journey",
        order: 1,
        exposition:
          "## Why this matters\n\nRead this first.\n\n- Point one\n- Point two\n\n1. Step A\n2. Step B"
      },
      {
        section_id: "exp_1",
        title: "First formative stop",
        order: 2,
        exposition: "Enter a response."
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
      }
    ]
  });
  assert.equal(journey.ok, true, (journey.errors || []).join("; "));
  const a = renderLearnerResourceFragment(
    assessmentPage({ title: "First formative stop", workflowId: "wf-a", pageId: "p-a" })
  );
  const shell = unifiedShell.buildLearningJourneyUnifiedShellHtml(journey.page, [
    { commissionId: "c1", title: "First formative stop", html: a.html }
  ]);
  assert.equal(shell.ok, true, shell.code);
  assert.equal(shell.navEntries[0].commissionId, "overview");
  assert.equal(shell.navEntries[1].commissionId, "c1");
  assert.doesNotMatch(shell.html, /lj-shell-current-label/);
  assert.match(shell.html, /data-lj-nav-id="overview"[^>]*aria-current="page"/);
  assert.doesNotMatch(shell.html, /## Why this matters/);
  assert.match(shell.html, /<h3[^>]*>Why this matters<\/h3>/);
  assert.match(shell.html, /<ul>[\s\S]*<li>Point one<\/li>/);
  assert.match(shell.html, /<ol>[\s\S]*<li>Step A<\/li>/);
  assert.match(shell.html, /<p>Read this first\.<\/p>/);
});

test("unified shell prefers commission metadata titles over commission-id echoes", () => {
  const journey = journeyWithTwoAssessmentStops();
  const a = renderLearnerResourceFragment(
    assessmentPage({ title: "First formative stop", workflowId: "wf-a", pageId: "p-a" })
  );
  const b = renderLearnerResourceFragment(
    assessmentPage({ title: "Second formative stop", workflowId: "wf-b", pageId: "p-b" })
  );
  const shell = unifiedShell.buildLearningJourneyUnifiedShellHtml(journey.page, [
    { commissionId: "c1", title: "c1", html: a.html },
    { commissionId: "c2", title: "c2", html: b.html }
  ]);
  assert.equal(shell.ok, true, shell.code);
  assert.equal(shell.resources[0].title, "First formative stop");
  assert.equal(shell.resources[1].title, "Second formative stop");
  assert.match(shell.html, /data-lj-nav-id="c1"[^>]*>First formative stop</);
  assert.doesNotMatch(shell.html, /lj-shell-current-label/);
  assert.match(shell.html, /data-lj-nav-id="overview"[^>]*>Overview</);
  assert.doesNotMatch(shell.html, /data-lj-nav-id="c1"[^>]*>c1</);
});

test("unified shell embeds standalone learner CSS (Node resolve or explicit)", () => {
  const journey = journeyWithTwoAssessmentStops();
  const a = renderLearnerResourceFragment(
    assessmentPage({ title: "First formative stop", workflowId: "wf-a", pageId: "p-a" })
  );
  const resolved = unifiedShell.resolveLearnerExportCss({});
  assert.match(resolved, /\.util-learner-renderer-vnext/);
  assert.match(resolved, /--learner-reading-width/);
  const shell = unifiedShell.buildLearningJourneyUnifiedShellHtml(
    journey.page,
    [{ commissionId: "c1", title: "First formative stop", html: a.html }],
    { learnerCss: resolved }
  );
  assert.equal(shell.ok, true, shell.code);
  assert.match(shell.html, /\.util-learner-renderer-vnext/);
  assert.match(shell.html, /\.lj-shell__toc-link/);
});

test("S95-T-006 unified shell ZIP is additive and multi-document assembly remains unchanged", () => {
  const journey = journeyWithTwoAssessmentStops();
  const pageA = assessmentPage({ title: "First formative stop", workflowId: "wf-a", pageId: "p-a" });
  const pageB = assessmentPage({ title: "Second formative stop", workflowId: "wf-b", pageId: "p-b" });
  const packA = learnerPackage.buildLearnerPackage({
    html: require("../lib/learner-renderer-vnext").renderLearnerPageHtml(pageA).html,
    title: pageA.title
  });
  const packB = learnerPackage.buildLearnerPackage({
    html: require("../lib/learner-renderer-vnext").renderLearnerPageHtml(pageB).html,
    title: pageB.title
  });
  assert.equal(packA.ok, true);
  assert.equal(packB.ok, true);

  const multi = ljPackage.assembleLearningJourneyLearnerPackage({
    page: journey.page,
    constituents: [
      { commissionId: "c1", learnerPackage: packA.package },
      { commissionId: "c2", learnerPackage: packB.package }
    ],
    fflate
  });
  assert.equal(multi.ok, true, multi.error && multi.error.message);
  const multiHome = unzipText(multi.bytes, "index.html");
  assert.match(multiHome, /lj-home/);
  assert.match(multiHome, /href="c1\/index\.html"/);
  assert.ok(fflate.unzipSync(multi.bytes)["c1/index.html"]);
  assert.ok(fflate.unzipSync(multi.bytes)["c2/index.html"]);

  const unified = ljPackage.assembleLearningJourneyUnifiedShellPackage({
    page: journey.page,
    constituents: [
      { commissionId: "c1", title: "First formative stop", sourcePage: pageA, learnerPackage: packA.package },
      { commissionId: "c2", title: "Second formative stop", sourcePage: pageB, learnerPackage: packB.package }
    ],
    fflate
  });
  assert.equal(unified.ok, true, unified.error && unified.error.message);
  assert.equal(unified.packageMode, "unified_shell");
  const files = fflate.unzipSync(unified.bytes);
  assert.ok(files["index.html"]);
  assert.ok(files["runtime/learner-renderer-vnext-browser.js"]);
  assert.equal(files["c1/index.html"], undefined);
  const shellHtml = Buffer.from(files["index.html"]).toString("utf8");
  assert.match(shellHtml, /data-lj-shell="unified"/);
  assert.match(shellHtml, /src="runtime\/learner-renderer-vnext-browser\.js"/);
  assert.match(shellHtml, /mountLearnerResource/);
});

test("extractRendererFragmentFromHtml strips scripts and uses article landmark", () => {
  const page = assessmentPage({ workflowId: "wf-extract", pageId: "p-extract" });
  const standalone = require("../lib/learner-renderer-vnext").renderLearnerPageHtml(page);
  assert.equal(standalone.error, null);
  assert.match(standalone.html, /^<main\b/);
  assert.match(standalone.html, /<script>/);
  const extracted = unifiedShell.extractRendererFragmentFromHtml(
    "<!DOCTYPE html><html><body>" + standalone.html + "</body></html>"
  );
  assert.equal(extracted.ok, true, extracted.code);
  assert.match(extracted.html, /^<article\b/);
  assert.doesNotMatch(extracted.html, /<script\b/i);
  assert.ok(extracted.pageKey);
});

test("known product types mount without M2-era lifecycle warnings", () => {
  const journey = journeyWithTwoAssessmentStops();
  const prepared = unifiedShell.prepareUnifiedShellResources([
    {
      commissionId: "c1",
      title: "Interactive",
      productId: "interactive",
      fragmentHtml:
        '<article data-renderer="vnext" data-persistence-page-key="x"><p>Hi</p></article>'
    }
  ]);
  assert.equal(prepared.ok, true);
  assert.equal(
    prepared.warnings.filter((row) => row.commissionId === "c1").length,
    0,
    "interactive is mountable after M4 lifecycle installs"
  );
  const unknown = unifiedShell.prepareUnifiedShellResources([
    {
      commissionId: "c9",
      title: "Unknown",
      productId: "future_product",
      fragmentHtml:
        '<article data-renderer="vnext" data-persistence-page-key="y"><p>Hi</p></article>'
    }
  ]);
  assert.ok(
    unknown.warnings.some(
      (row) => row.commissionId === "c9" && /Unknown product_id/i.test(row.reason)
    )
  );
  const shell = unifiedShell.buildLearningJourneyUnifiedShellHtml(
    journey.page,
    prepared.resources
  );
  assert.equal(shell.ok, true);
});
