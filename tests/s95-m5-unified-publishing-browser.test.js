/**
 * Sprint 95 M5 — browser coverage for author-facing Unified Learning Journey control
 * and AP→Interactive artefact handoff after automatic contract proposal.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const fflate = require("fflate");

const ljDesign = require("../lib/learning-journey-design-page.js");
const ljPackage = require("../lib/learning-journey-learner-package.js");
const {
  proposeArtefactContractFromLearningJourney
} = require("../lib/learner-renderer-vnext/learner-artefact-contract");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");
const learnerPackage = require("../lib/learner-package.js");

const PLAYWRIGHT_CANDIDATES = [
  path.join(__dirname, "fixtures", "sequential-nav-qa", "node_modules", "playwright"),
  "playwright"
];

function loadPlaywright() {
  for (let i = 0; i < PLAYWRIGHT_CANDIDATES.length; i += 1) {
    try {
      return require(PLAYWRIGHT_CANDIDATES[i]);
    } catch (_err) {
      // try next
    }
  }
  return null;
}

function assessmentProducerPage() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: "Constructed judgement",
    activities: [],
    metadata: { workflow_id: "wf-m5-c5", page_id: "page-m5-c5" },
    assessment_evidence: {
      purpose: {
        role: "R1",
        visibility_claim: "M5 browser.",
        stop_rationale: "Write a judgement.",
        forward_intent: "Review later."
      },
      learner_context: { depends_on_prior_work: false },
      pack_forward_orientation: "Use in the next stop.",
      elicitations: [
        {
          elicitation_id: "judgement",
          order: 1,
          evidence_ask: "Write the judgement.",
          epistemic_class: "non_determinate",
          delivery: {
            kind: "constructed_performance",
            prompt: "Write your independent judgement.",
            response_workspace: { intention: "Independent judgement" }
          },
          formative_return: {
            materials: [{ material_id: "look", body: "Look again." }],
            revision: { offered: true, prompt: "Name one change." },
            forward_orientation: "Carry forward."
          }
        }
      ]
    }
  };
}

function interactiveConsumerHtml() {
  return (
    '<article class="util-learner-renderer-vnext" data-renderer="vnext" role="region" ' +
    'aria-label="Review your judgement" data-persistence-page-key="v1::wf-m5-c6::review">' +
    "<h1>Review your judgement</h1>" +
    "<p>Compare your earlier response with the activities below.</p>" +
    '<textarea aria-label="Reflection notes"></textarea>' +
    "</article>"
  );
}

function writeZipToDir(bytes, dir) {
  const files = fflate.unzipSync(bytes);
  Object.keys(files).forEach((entry) => {
    const outPath = path.join(dir, entry);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, files[entry]);
  });
}

function contentTypeFor(filePath) {
  if (/\.html?$/i.test(filePath)) return "text/html; charset=utf-8";
  if (/\.js$/i.test(filePath)) return "text/javascript; charset=utf-8";
  if (/\.css$/i.test(filePath)) return "text/css; charset=utf-8";
  return "application/octet-stream";
}

function startStaticServer(rootDir) {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(String((req.url || "/").split("?")[0] || "/"));
    const relative = urlPath === "/" ? "index.html" : urlPath.replace(/^\//, "");
    const filePath = path.normalize(path.join(rootDir, relative));
    if (!filePath.startsWith(path.normalize(rootDir))) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": contentTypeFor(filePath) });
    res.end(fs.readFileSync(filePath));
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolve({
        server,
        baseUrl: "http://127.0.0.1:" + address.port + "/"
      });
    });
  });
}

test(
  "M5 browser: author control on PRISM UI; auto AP→Interactive handoff in served unified ZIP",
  { skip: process.env.PRISM_SKIP_BROWSER_E2E === "1" },
  async (t) => {
    const playwright = loadPlaywright();
    if (!playwright || !playwright.chromium) {
      t.skip("playwright is unavailable");
      return;
    }

    const journey = ljDesign.buildLearningJourneyDesignPageFixture({
      title: "M5 Unified Publishing Browser",
      sections: [
        {
          section_id: "journey_intro",
          title: "About",
          order: 1,
          exposition: "Overview for the M5 publishing browser check."
        },
        { section_id: "s5", title: "Judgement", order: 2, exposition: "Write." },
        { section_id: "s6", title: "Review", order: 3, exposition: "Review." }
      ],
      commissions: [
        {
          commission_id: "c5",
          section_id: "s5",
          order: 1,
          title: "Constructed judgement",
          product_id: "assessment_pack",
          status: "supported",
          specification_text: "Write a judgement."
        },
        {
          commission_id: "c6",
          section_id: "s6",
          order: 2,
          title: "Review your judgement",
          product_id: "interactive",
          status: "supported",
          specification_text: "Review the judgement from c5.",
          dependencies: "Requires the learner's completed response from c5."
        }
      ]
    });
    assert.equal(journey.ok, true, (journey.errors || []).join("; "));

    const pageC5 = assessmentProducerPage();
    const packC5 = learnerPackage.buildLearnerPackage({
      html: renderLearnerPageHtml(pageC5).html,
      title: pageC5.title
    });
    const packC6 = learnerPackage.buildLearnerPackage({
      html: interactiveConsumerHtml(),
      title: "Review your judgement"
    });
    assert.equal(packC5.ok, true);
    assert.equal(packC6.ok, true);

    const constituents = [
      {
        commissionId: "c5",
        title: "Constructed judgement",
        productId: "assessment_pack",
        sourcePage: pageC5,
        learnerPackage: packC5.package
      },
      {
        commissionId: "c6",
        title: "Review your judgement",
        productId: "interactive",
        sourcePage: { product_id: "interactive", title: "Review your judgement" },
        learnerPackage: packC6.package
      }
    ];

    const proposal = proposeArtefactContractFromLearningJourney({
      page: journey.page,
      constituents
    });
    assert.equal(proposal.ok, true, JSON.stringify(proposal.gaps || []));
    assert.equal(proposal.contract.produces[0].commissionId, "c5");
    assert.equal(proposal.contract.references[0].commissionId, "c6");
    assert.match(proposal.contract.produces[0].workspaceId, /assessment-constructed-judgement/);

    const assembled = ljPackage.assembleLearningJourneyUnifiedShellPackage({
      page: journey.page,
      constituents,
      artefactContract: proposal.contract,
      fflate,
      runtimeScript: fs.readFileSync(
        path.join(__dirname, "..", "lib", "learner-renderer-vnext-browser.js"),
        "utf8"
      )
    });
    assert.equal(assembled.ok, true, assembled.error && assembled.error.message);

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "prism-s95-m5-"));
    writeZipToDir(assembled.bytes, tempDir);

    const repoRoot = path.resolve(__dirname, "..");
    const uiServer = await startStaticServer(repoRoot);
    const packageServer = await startStaticServer(tempDir);

    let browser;
    try {
      browser = await playwright.chromium.launch({
        headless: true,
        channel: "chrome"
      });
    } catch (err) {
      uiServer.server.close();
      packageServer.server.close();
      fs.rmSync(tempDir, { recursive: true, force: true });
      t.skip("Chrome channel unavailable for Playwright: " + String(err && err.message));
      return;
    }

    try {
      const context = await browser.newContext();
      const uiPage = await context.newPage();
      await uiPage.goto(uiServer.baseUrl + "index.html", {
        waitUntil: "domcontentloaded",
        timeout: 60000
      });
      const control = uiPage.locator("#utilitiesDownloadUnifiedJourneyBtn");
      await control.waitFor({ state: "attached", timeout: 30000 });
      assert.equal(await control.getAttribute("aria-label"), "Download Unified Learning Journey");
      assert.match(
        String((await control.textContent()) || "").trim(),
        /Download Unified Learning Journey/
      );
      const hiddenAttr = await control.getAttribute("hidden");
      const hasHiddenClass = await control.evaluate((el) => el.classList.contains("hidden"));
      assert.ok(hiddenAttr !== null || hasHiddenClass);

      const shellPage = await context.newPage();
      await shellPage.goto(packageServer.baseUrl, {
        waitUntil: "domcontentloaded",
        timeout: 60000
      });
      await shellPage.waitForFunction(
        () =>
          window.PRISM_LEARNER_RENDERER_VNEXT &&
          typeof window.PRISM_LEARNER_RENDERER_VNEXT.injectArtefactReferences === "function" &&
          window.__PRISM_LJ_SHELL__ &&
          window.__PRISM_LJ_SHELL__.currentId === "overview",
        { timeout: 30000 }
      );

      await shellPage.locator('[data-lj-nav-id="c5"]').click();
      await shellPage.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c5", {
        timeout: 15000
      });
      const c5Textarea = shellPage.locator("#lj-shell-main textarea").first();
      await c5Textarea.fill("M5 constructed judgement under uncertainty.");
      await c5Textarea.blur();
      await shellPage.waitForTimeout(500);

      await shellPage.locator('[data-lj-nav-id="c6"]').click();
      await shellPage.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c6");
      const resolved = shellPage.locator('[data-lj-artefact-status="resolved"]');
      await resolved.waitFor({ timeout: 10000 });
      const refText = await shellPage.locator(".lj-artefact-ref__text").textContent();
      assert.match(String(refText || ""), /M5 constructed judgement under uncertainty/);
      assert.equal(
        await shellPage.locator(".lj-artefact-ref textarea, .lj-artefact-ref input").count(),
        0
      );

      await shellPage.reload({ waitUntil: "domcontentloaded" });
      await shellPage.waitForFunction(
        () => window.__PRISM_LJ_SHELL__ && window.__PRISM_LJ_SHELL__.currentId === "c6",
        { timeout: 30000 }
      );
      await shellPage.waitForFunction(
        () =>
          /M5 constructed judgement under uncertainty/i.test(
            (document.querySelector(".lj-artefact-ref__text") || {}).textContent || ""
          ),
        { timeout: 10000 }
      );

      const mains = await shellPage.locator("main").count();
      assert.equal(mains, 1);
      assert.ok(await shellPage.locator('[data-lj-nav-id="overview"]').count());
      assert.ok(await shellPage.locator('[data-lj-nav-id="c5"]').count());
      assert.ok(await shellPage.locator('[data-lj-nav-id="c6"]').count());
    } finally {
      await browser.close();
      uiServer.server.close();
      packageServer.server.close();
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
);
