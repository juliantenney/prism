/**
 * Sprint 104 — Five bounded learner presentation & integration refinements:
 * 1. Timing guidance ("Suggested study time", no shaded callout / left border, TOC durations intact).
 * 2. Saved-response information (concise subordinate guidance + accessible backup disclosure).
 * 3. Learning Journal navigation (pinned immediately below journey title, above scrollable TOC).
 * 4. Earlier-response presentation (after overview & learning outcomes, never above nav/editorial image; concise read-only note).
 * 5. Learning Journey editorial opening image discovery, fulfilment, unified overview rendering, packaging, and graceful omission.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fflate = require("fflate");

const unifiedShell = require("../lib/learning-journey-unified-shell.js");
const ljDesign = require("../lib/learning-journey-design-page.js");
const artefactContract = require("../lib/learner-renderer-vnext/learner-artefact-contract.js");
const assessmentOutput = require("../lib/learner-renderer-vnext/assessment-output.js");
const editorialOpening = require("../lib/expository-editorial-opening.js");
const visualWorkspace = require("../lib/utilities-visual-jobs-workspace.js");

const TINY_PNG_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

function makeJourneyPage(overrides) {
  const base = ljDesign.buildLearningJourneyDesignPageFixture({
    title: "Economics Learning Journey"
  }).page;
  base.learning_journey = Object.assign({}, base.learning_journey || {}, {
    allocated_minutes: 90,
    journal: {
      enabled: true,
      title: "Learning Journal",
      entries: [
        {
          entry_id: "j1",
          order: 1,
          title: "Initial claim",
          framing: "Your initial claim.",
          artefact_id: "comm_1.E1"
        }
      ]
    }
  });
  if (Array.isArray(base.commissions) && base.commissions.length) {
    base.commissions[0] = Object.assign({}, base.commissions[0], {
      commission_id: "comm_1",
      status: "supported",
      allocated_minutes: 20
    });
    base.commissions = [base.commissions[0]];
  }
  return Object.assign(base, overrides || {});
}

test("1. Timing guidance uses 'Suggested study time' without shaded callout/left border while preserving TOC durations", () => {
  const page = makeJourneyPage();
  const built = unifiedShell.buildLearningJourneyUnifiedShellHtml(page, [
    {
      commissionId: "comm_1",
      title: "C1 Foundations",
      html: "<main class=\"util-learner-renderer-vnext\"><p>Content</p></main>",
      pageKey: "page-c1",
      productId: "expository"
    }
  ]);
  assert.equal(built.ok, true);
  assert.match(built.html, /Suggested study time: /);
  assert.doesNotMatch(built.html, /Indicative duration:/);
  assert.match(
    built.html,
    /\.lj-shell-overview__timing\{[^}]*border:0;background:transparent/
  );
  assert.match(built.html, /class="lj-shell__toc-duration"/);
});

test("2. Saved-response information is concise, visually subordinate, and preserves backup disclosure", () => {
  const contract = {
    produces: [{ artefactId: "comm_4.E4", commissionId: "comm_4", workspaceId: "learner-constructed-E4" }],
    references: [{ artefactId: "comm_4.E4", commissionId: "comm_5", usage: "reference" }]
  };
  const resources = [
    { commissionId: "comm_4", title: "C4 Advertising Task" },
    { commissionId: "comm_5", title: "C5 Alternative Explanations" }
  ];
  const withJournal = artefactContract.buildProducerSignpostHtml(contract, "comm_4", resources, {
    journalSpec: { entries: [{ artefact_id: "comm_4.E4" }] }
  });
  assert.match(withJournal, /Saved work on this device can appear for reference in 'C5 Alternative Explanations' and the Learning Journal\./);
  assert.match(withJournal, /<details class="lj-artefact-signpost__more">/);
  assert.match(withJournal, /About saving and backup/);

  const help = assessmentOutput.buildAssessmentOutputRetentionHelp({
    deliveryContext: "unified",
    isProducer: true,
    journalListed: true
  });
  assert.match(help, /Saved on this device for later activities and the Learning Journal/);
  assert.match(help, /backup/i);

  const standaloneHelp = assessmentOutput.buildAssessmentOutputRetentionHelp({
    deliveryContext: "standalone"
  });
  assert.match(standaloneHelp, /kept on this page only/i);
});

test("3. Learning Journal section heading and nav item sit immediately below journey title, pinned above scrollable Contents", () => {
  const page = makeJourneyPage();
  const built = unifiedShell.buildLearningJourneyUnifiedShellHtml(page, [
    {
      commissionId: "comm_1",
      title: "C1 Foundations",
      html: "<main class=\"util-learner-renderer-vnext\"><p>Content</p></main>",
      pageKey: "page-c1",
      productId: "expository"
    }
  ]);
  assert.equal(built.ok, true);
  const brandIdx = built.html.indexOf('class="lj-shell__brand"');
  const journalWrapIdx = built.html.indexOf('class="lj-shell__journal-nav-wrap"');
  const journalHeadingIdx = built.html.indexOf('id="lj-shell-journal-label"');
  const journalListIdx = built.html.indexOf('class="lj-shell__toc lj-shell__toc--journal"');
  const tocWrapIdx = built.html.indexOf('class="lj-shell__toc-wrap"');
  assert.ok(
    brandIdx > -1 &&
      journalWrapIdx > brandIdx &&
      journalHeadingIdx > journalWrapIdx &&
      journalListIdx > journalHeadingIdx &&
      tocWrapIdx > journalListIdx
  );
  assert.match(built.html, /<nav aria-labelledby="lj-shell-journal-label">/);
  assert.match(built.html, /data-lj-journal-nav="true"/);
  assert.match(built.html, /data-lj-journal-count/);
});

test("4. Earlier-response panel inserts after overview & learning outcomes (never above nav/editorial image) with concise read-only note", () => {
  function makeEl(tag, attrs) {
    const el = {
      tag,
      attrs: attrs || {},
      children: [],
      parentNode: null,
      nextSibling: null,
      insertBefore(node, ref) {
        node.parentNode = this;
        const idx = ref ? this.children.indexOf(ref) : -1;
        if (idx === -1) this.children.push(node);
        else this.children.splice(idx, 0, node);
        for (let i = 0; i < this.children.length; i += 1) {
          this.children[i].nextSibling = this.children[i + 1] || null;
        }
        return node;
      },
      appendChild(node) {
        return this.insertBefore(node, null);
      }
    };
    return el;
  }

  const root = makeEl("main");
  const header = makeEl("header", { class: "util-page-header" });
  const nav = makeEl("nav", { class: "util-journey-nav" });
  const editorial = makeEl("div", { "data-region": "editorial-opening" });
  const orientation = makeEl("section", { "data-region": "orientation" });
  const outcomes = makeEl("section", { "data-orientation-type": "learning_outcomes" });
  const activities = makeEl("section", { "data-region": "activities" });
  [header, nav, editorial, orientation, outcomes, activities].forEach((n) => root.appendChild(n));

  root.querySelector = (sel) => {
    if (sel === '[data-orientation-type="learning_outcomes"]') return outcomes;
    if (sel === '[data-region="orientation"]') return orientation;
    if (sel === '[data-region="editorial-opening"]') return editorial;
    if (sel === ".util-journey-nav") return nav;
    if (sel === '[data-region="activities"]') return activities;
    if (sel === ".util-page-header") return header;
    return null;
  };
  root.querySelectorAll = () => [];
  root.ownerDocument = {
    createElement(tag) {
      const n = makeEl(tag);
      n.setAttribute = (k, v) => {
        n.attrs[k] = String(v);
      };
      return n;
    }
  };

  const contract = {
    produces: [{ artefactId: "comm_7.E7", commissionId: "comm_7", workspaceId: "assessment-output-judgement" }],
    references: [{ artefactId: "comm_7.E7", commissionId: "comm_8", usage: "reference", label: "Your earlier response" }]
  };
  const result = artefactContract.injectArtefactReferences(root, {
    contract,
    commissionId: "comm_8",
    resources: [
      { commissionId: "comm_7", title: "C7 Independent Evaluation", pageKey: "page-c7" },
      { commissionId: "comm_8", title: "C8 Companion Feedback", pageKey: "page-c8" }
    ]
  });
  assert.equal(result.ok, true);
  assert.equal(result.insertionReason, "learning_outcomes");
  const hostIdx = root.children.findIndex((c) => c.className === "lj-artefact-ref-host");
  const navIdx = root.children.indexOf(nav);
  const editorialIdx = root.children.indexOf(editorial);
  const outcomesIdx = root.children.indexOf(outcomes);
  const activitiesIdx = root.children.indexOf(activities);
  assert.ok(hostIdx > navIdx && hostIdx > editorialIdx && hostIdx === outcomesIdx + 1 && hostIdx < activitiesIdx);

  const refHtml = artefactContract.renderArtefactReferenceHtml(
    { ok: true, status: "resolved", artefactId: "comm_7.E7", text: "My retained judgement." },
    { artefactId: "comm_7.E7", label: "Your earlier response" },
    { producerTitle: "C7 Independent Evaluation" }
  );
  assert.match(refHtml, /From 'C7 Independent Evaluation'\. Available here for reference \(read-only\)\./);
  assert.doesNotMatch(refHtml, /because you saved it earlier in this Learning Journey/i);
});

test("5. Learning Journey editorial opening image: discovery, fulfilment, unified overview placement, packaging, and graceful omission", () => {
  const page = makeJourneyPage({
    editorial_opening_image: {
      decision: "generate",
      subject: "Commuters walking past a regional railway station at morning light",
      context: "Editorial opening scene for an economics inquiry.",
      caption_intent: "Evoke regional transport and employment without charts or text.",
      alt_text: "",
      detailed_description: "Clean editorial illustration of a coastal railway station at morning light, no text or labels."
    }
  });

  // Discovery in Graphics authoring tab
  assert.equal(editorialOpening.isLearningJourneyPage(page), true);
  const ws = visualWorkspace.buildVisualJobsWorkspaceState(page);
  assert.equal(visualWorkspace.countAuthoringGraphicsJobs(ws), 1);
  assert.equal(ws.compilerResult.briefs[0].brief_id, "brief-editorial-opening");

  // Fulfilment via existing attachment mechanism
  const attached = visualWorkspace.attachVisualAssetToWorkspace(ws, "brief-editorial-opening", {
    filename: "editorial-opening.png",
    mime_type: "image/png",
    byte_size: 68,
    width: 1200,
    height: 675,
    render_source: { kind: "data_url", value: TINY_PNG_DATA_URL }
  });
  assert.equal(attached.ok, true);

  const constituentStub = [
    {
      commissionId: "comm_1",
      title: "C1 Foundations",
      learnerPackage: {
        html: '<!DOCTYPE html><html><body><main class="util-learner-renderer-vnext" data-renderer="vnext"><p>Content</p></main></body></html>',
        assets: []
      },
      pageKey: "page-c1",
      productId: "expository"
    }
  ];

  // Unified package assembly: packages media/editorial-opening.png and renders before overview prose
  const pkg = unifiedShell.assembleLearningJourneyUnifiedShellPackage({
    page,
    constituents: constituentStub,
    fflate,
    runtimeScript: "/* runtime stub */",
    visualAssets: ws.visualAssetManifest
  });
  assert.equal(pkg.ok, true, JSON.stringify(pkg.error || {}));
  assert.ok(pkg.entryPaths.includes("media/editorial-opening.png"));

  const unzipped = fflate.unzipSync(pkg.bytes);
  const indexHtml = Buffer.from(unzipped["index.html"]).toString("utf8");
  const editorialIdx = indexHtml.indexOf('data-region="editorial-opening"');
  const overviewBodyIdx = indexHtml.indexOf('class="lj-shell-overview__body"');
  assert.ok(editorialIdx > -1 && overviewBodyIdx > editorialIdx);
  assert.match(indexHtml, /src="media\/editorial-opening\.png"/);
  assert.match(indexHtml, /alt=""/);

  // Unfulfilled optional image omits gracefully
  const unfulfilledPkg = unifiedShell.assembleLearningJourneyUnifiedShellPackage({
    page,
    constituents: constituentStub,
    fflate,
    runtimeScript: "/* runtime stub */",
    visualAssets: { assets: [] }
  });
  assert.equal(unfulfilledPkg.ok, true);
  assert.equal(unfulfilledPkg.entryPaths.includes("media/editorial-opening.png"), false);
  const unfulfilledHtml = Buffer.from(fflate.unzipSync(unfulfilledPkg.bytes)["index.html"]).toString("utf8");
  assert.doesNotMatch(unfulfilledHtml, /data-region="editorial-opening"/);

  // Editorial synthesis prompts favour generate by default and distinguish editorial imagery from instructional diagrams
  const stage5Prompt = ljDesign.buildProgressiveLearningJourneyDesignPagePrompt();
  const legacyPrompt = ljDesign.buildLearningJourneyDesignPagePrompt();
  assert.match(stage5Prompt, /favour "generate" by default/i);
  assert.match(stage5Prompt, /conflate editorial imagery with instructional diagrams/i);
  assert.match(stage5Prompt, /exceptional circumstances/i);
  assert.match(legacyPrompt, /favour decision "generate" by default/i);
  assert.match(legacyPrompt, /conflate editorial opening imagery with instructional graphical representations/i);
});

test("6. Unified sidebar footer hosts collapsed-by-default 'Saving your work' disclosure and removes repeated saving signposts from component orientation", () => {
  const page = makeJourneyPage();
  const built = unifiedShell.buildLearningJourneyUnifiedShellHtml(page, [
    {
      commissionId: "comm_1",
      title: "C1 Foundations",
      html: '<main class="util-learner-renderer-vnext"><p>Content</p></main>',
      pageKey: "page-c1",
      productId: "expository"
    }
  ]);
  assert.equal(built.ok, true);

  // Pinned footer sits inside sidebar panel immediately beneath scrollable TOC wrap
  const tocWrapIdx = built.html.indexOf('class="lj-shell__toc-wrap"');
  const footerIdx = built.html.indexOf('class="lj-shell__sidebar-footer"');
  const sidebarCloseIdx = built.html.indexOf("</aside>", footerIdx);
  assert.ok(tocWrapIdx > -1 && footerIdx > tocWrapIdx && sidebarCloseIdx > footerIdx);

  // Collapsed by default (no open attribute), small decorative info icon, keyboard-accessible <details>/<summary>
  assert.match(built.html, /<details class="lj-shell__saving-info" data-lj-saving-info="true">/);
  assert.doesNotMatch(built.html, /<details class="lj-shell__saving-info"[^>]*\bopen\b/);
  assert.match(built.html, /class="lj-shell__saving-info-summary"/);
  assert.match(built.html, /class="lj-shell__saving-info-icon"[^>]*aria-hidden="true"/);
  assert.match(built.html, /<span>Saving your work<\/span>/);
  assert.match(
    built.html,
    /Your responses are saved in this browser on this device\. Saved work can appear in your Learning Journal\. Keep your own copy if you need to access your work elsewhere\./
  );

  // CSS pins footer beneath scrollable TOC and keeps keyboard focus visible
  assert.match(built.html, /\.lj-shell__sidebar-footer\{flex:0 0 auto;/);
  assert.match(built.html, /\.lj-shell__saving-info-summary:focus-visible\{outline:2px solid #2563eb/);

  // Non-journal journey omits Learning Journal sentence
  const noJournalPage = makeJourneyPage();
  noJournalPage.learning_journey = Object.assign({}, noJournalPage.learning_journey, { journal: { enabled: false, entries: [] } });
  const builtNoJournal = unifiedShell.buildLearningJourneyUnifiedShellHtml(noJournalPage, [
    {
      commissionId: "comm_1",
      title: "C1 Foundations",
      html: '<main class="util-learner-renderer-vnext"><p>Content</p></main>',
      pageKey: "page-c1",
      productId: "expository"
    }
  ]);
  assert.equal(builtNoJournal.ok, true);
  assert.match(
    builtNoJournal.html,
    /Your responses are saved in this browser on this device\. Keep your own copy if you need to access your work elsewhere\./
  );
  assert.doesNotMatch(builtNoJournal.html, /Saved work can appear in your Learning Journal\./);

  // Unified shell runtime suppresses repeated producer saving signposts in component orientation
  assert.match(built.html, /injectArtefactReferences\([^)]*includeProducerSignpost:false/);

  // Direct verification of injectArtefactReferences with includeProducerSignpost:false:
  // producer-only component injects 0 orientation signposts; consumer+producer retains earlier-response panel without producer saving signpost
  function makeHostMockRoot() {
    const children = [];
    const doc = {
      createElement(tag) {
        const el = {
          tagName: String(tag).toUpperCase(),
          attrs: {},
          className: "",
          innerHTML: "",
          setAttribute(k, v) { this.attrs[k] = String(v); },
          getAttribute(k) { return this.attrs[k] || null; }
        };
        return el;
      }
    };
    return {
      ownerDocument: doc,
      firstChild: null,
      children,
      querySelector() { return null; },
      querySelectorAll() { return []; },
      insertBefore(node) {
        children.unshift(node);
        this.firstChild = children[0];
        return node;
      },
      appendChild(node) {
        children.push(node);
        this.firstChild = children[0];
        return node;
      }
    };
  }

  const contract = {
    produces: [
      { artefactId: "c1.E1", commissionId: "c1", workspaceId: "w1", label: "Initial claim" },
      { artefactId: "c2.E1", commissionId: "c2", workspaceId: "w2", label: "Revised claim" }
    ],
    references: [{ artefactId: "c1.E1", commissionId: "c2", usage: "reference", label: "Your earlier response" }]
  };
  const resources = [
    { commissionId: "c1", title: "C1 Initial", pageKey: "page-c1" },
    { commissionId: "c2", title: "C2 Revise", pageKey: "page-c2" }
  ];

  const c1Root = makeHostMockRoot();
  const c1Res = artefactContract.injectArtefactReferences(c1Root, {
    contract,
    commissionId: "c1",
    resources,
    includeProducerSignpost: false
  });
  assert.equal(c1Res.ok, true);
  assert.equal(c1Res.injected, 0);
  assert.equal(c1Root.children.length, 0);

  const c2Root = makeHostMockRoot();
  const c2Res = artefactContract.injectArtefactReferences(c2Root, {
    contract,
    commissionId: "c2",
    resources,
    includeProducerSignpost: false,
    storage: { getItem() { return "Saved draft from C1"; } }
  });
  assert.equal(c2Res.ok, true);
  assert.equal(c2Res.injected, 1);
  assert.equal(c2Res.signposted, false);
  assert.equal(c2Root.children.length, 1);
  assert.match(c2Root.children[0].innerHTML, /class="lj-artefact-ref/);
  assert.doesNotMatch(c2Root.children[0].innerHTML, /data-lj-artefact-signpost="producer"/);
  assert.doesNotMatch(c2Root.children[0].innerHTML, /About saving and backup/);
});
