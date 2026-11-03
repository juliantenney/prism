/**
 * Sprint 95 M2 — real-browser verification of the unified Learning Journey shell.
 *
 * Uses Playwright against system Chrome (channel: "chrome") with a file:// package.
 * Skips cleanly when Playwright or Chrome is unavailable.
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
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");
const learnerPackage = require("../lib/learner-package.js");

const PLAYWRIGHT_CANDIDATES = [
  path.join(__dirname, "fixtures", "sequential-nav-qa", "node_modules", "playwright"),
  "playwright"
];

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
      workflow_id: src.workflowId || "wf-s95-m2-browser-a",
      page_id: src.pageId || "page-s95-m2-browser-a"
    },
    assessment_evidence: {
      purpose: {
        role: "R1",
        visibility_claim: "Browser shell persistence.",
        stop_rationale: "A short formative stop.",
        forward_intent: "Carry the checked distinctions forward."
      },
      learner_context: { depends_on_prior_work: false },
      pack_forward_orientation: "Use the result in the next block.",
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

function buildJourney() {
  return ljDesign.buildLearningJourneyDesignPageFixture({
    title: "Browser shell journey",
    sections: [
      {
        section_id: "journey_intro",
        title: "About this journey",
        order: 1,
        exposition: "Two stops in one document."
      },
      {
        section_id: "exp_1",
        title: "First stop",
        order: 2,
        exposition: "Write here first."
      },
      {
        section_id: "exp_2",
        title: "Second stop",
        order: 3,
        exposition: "Then visit the second stop."
      }
    ],
    commissions: [
      {
        commission_id: "c1",
        section_id: "exp_1",
        order: 1,
        title: "First stop",
        product_id: "assessment_pack",
        status: "supported",
        specification_text: "A"
      },
      {
        commission_id: "c2",
        section_id: "exp_2",
        order: 2,
        title: "Second stop",
        product_id: "assessment_pack",
        status: "supported",
        specification_text: "B"
      }
    ]
  });
}

function loadPlaywright() {
  for (let i = 0; i < PLAYWRIGHT_CANDIDATES.length; i += 1) {
    try {
      return require(PLAYWRIGHT_CANDIDATES[i]);
    } catch (_err) {}
  }
  return null;
}

function writeZipToDir(bytes, dir) {
  const files = fflate.unzipSync(bytes);
  Object.keys(files).forEach((entry) => {
    const outPath = path.join(dir, entry);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, files[entry]);
  });
  return path.join(dir, "index.html");
}

function contentTypeFor(filePath) {
  if (/\.html?$/i.test(filePath)) return "text/html; charset=utf-8";
  if (/\.js$/i.test(filePath)) return "text/javascript; charset=utf-8";
  if (/\.css$/i.test(filePath)) return "text/css; charset=utf-8";
  if (/\.json$/i.test(filePath)) return "application/json; charset=utf-8";
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
  "S95-T-007 browser: navigation, focus, persistence, reload, no duplicate mounts",
  { skip: process.env.PRISM_SKIP_BROWSER_E2E === "1" },
  async (t) => {
    const playwright = loadPlaywright();
    if (!playwright || !playwright.chromium) {
      t.skip("playwright is unavailable");
      return;
    }

    const journey = buildJourney();
    assert.equal(journey.ok, true, (journey.errors || []).join("; "));
    const pageA = assessmentPage({
      title: "First stop",
      workflowId: "wf-browser-a",
      pageId: "page-browser-a"
    });
    const pageB = assessmentPage({
      title: "Second stop",
      workflowId: "wf-browser-b",
      pageId: "page-browser-b"
    });
    const packA = learnerPackage.buildLearnerPackage({
      html: renderLearnerPageHtml(pageA).html,
      title: pageA.title
    });
    const packB = learnerPackage.buildLearnerPackage({
      html: renderLearnerPageHtml(pageB).html,
      title: pageB.title
    });
    assert.equal(packA.ok, true);
    assert.equal(packB.ok, true);

    const assembled = ljPackage.assembleLearningJourneyUnifiedShellPackage({
      page: journey.page,
      constituents: [
        {
          commissionId: "c1",
          title: "First stop",
          sourcePage: pageA,
          learnerPackage: packA.package
        },
        {
          commissionId: "c2",
          title: "Second stop",
          sourcePage: pageB,
          learnerPackage: packB.package
        }
      ],
      fflate
    });
    assert.equal(assembled.ok, true, assembled.error && assembled.error.message);

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "prism-s95-m2-"));
    writeZipToDir(assembled.bytes, tempDir);
    const staticServer = await startStaticServer(tempDir);

    let browser;
    try {
      browser = await playwright.chromium.launch({
        headless: true,
        channel: "chrome"
      });
    } catch (err) {
      staticServer.server.close();
      t.skip("Chrome channel unavailable for Playwright: " + String(err && err.message));
      return;
    }

    try {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(staticServer.baseUrl, { waitUntil: "domcontentloaded", timeout: 60000 });

      await page.waitForFunction(
        () =>
          window.PRISM_LEARNER_RENDERER_VNEXT &&
          typeof window.PRISM_LEARNER_RENDERER_VNEXT.mountLearnerResource === "function" &&
          window.__PRISM_LJ_SHELL__ &&
          window.__PRISM_LJ_SHELL__.currentId === "overview",
        { timeout: 30000 }
      );

      const landmarkCount = await page.locator("main").count();
      assert.equal(landmarkCount, 1);

      const tocCount = await page.locator("[data-lj-nav-id]").count();
      assert.equal(tocCount, 3);
      assert.equal(await page.locator("[data-lj-overview]").count(), 1);
      assert.equal(await page.locator(".lj-shell__intro").count(), 0);

      assert.match(
        await page.locator("#lj-shell-next").textContent(),
        /Next resource/i
      );
      assert.ok(
        await page.locator(".lj-shell__sidebar #lj-shell-next").count(),
        "resource next control lives in the journey sidebar"
      );

      await page.locator("#lj-shell-next").click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c1", {
        timeout: 15000
      });
      assert.equal(await page.locator("[data-lj-overview]").count(), 0);

      const textarea = page.locator('#lj-shell-main textarea').first();
      await textarea.waitFor({ timeout: 15000 });
      await textarea.fill("Browser draft from resource A");
      // Default draft debounce is 400ms; flush via blur + short wait before unmount.
      await textarea.blur();
      await page.waitForTimeout(500);

      const mountCountAfterFirst = await page.evaluate(() => window.__PRISM_LJ_SHELL__.mountCount);

      await page.locator('[data-lj-nav-id="c2"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c2", {
        timeout: 15000
      });

      await page.waitForFunction(
        () => /Now showing:\s*Second stop/i.test(
          (document.getElementById("lj-shell-live") || {}).textContent || ""
        ),
        { timeout: 5000 }
      );

      const focusedTag = await page.evaluate(() => {
        const el = document.activeElement;
        return el ? { tag: el.tagName, resourceTitle: el.getAttribute("data-lj-resource-title") } : null;
      });
      assert.ok(focusedTag);
      assert.equal(focusedTag.tag, "H2");

      await page.locator("#lj-shell-prev").click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c1", {
        timeout: 15000
      });

      const restored = await page.locator("#lj-shell-main textarea").first().inputValue();
      assert.equal(restored, "Browser draft from resource A");

      const mountCountAfterReturn = await page.evaluate(() => window.__PRISM_LJ_SHELL__.mountCount);
      assert.ok(mountCountAfterReturn > mountCountAfterFirst);

      // Keyboard: Tab to Next, activate with Enter.
      await page.locator("#lj-shell-next").focus();
      await page.keyboard.press("Enter");
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c2", {
        timeout: 15000
      });

      // Return to Overview from TOC, then hash-reload a resource.
      await page.locator('[data-lj-nav-id="overview"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "overview", {
        timeout: 15000
      });
      assert.equal(await page.locator("[data-lj-overview]").count(), 1);

      await page.evaluate(() => {
        location.hash = "#c1";
      });
      await page.reload({ waitUntil: "domcontentloaded" });
      await page.waitForFunction(
        () => window.__PRISM_LJ_SHELL__ && window.__PRISM_LJ_SHELL__.currentId === "c1",
        { timeout: 30000 }
      );
      const afterReload = await page.locator("#lj-shell-main textarea").first().inputValue();
      assert.equal(afterReload, "Browser draft from resource A");

      // Navigate away and back again — mount count increases once per show, not duplicated handlers.
      const beforeCycle = await page.evaluate(() => window.__PRISM_LJ_SHELL__.mountCount);
      await page.locator('[data-lj-nav-id="c2"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c2");
      await page.locator('[data-lj-nav-id="c1"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c1");
      const afterCycle = await page.evaluate(() => window.__PRISM_LJ_SHELL__.mountCount);
      assert.equal(afterCycle, beforeCycle + 2);

      const activeOnly = await page.evaluate(() => {
        const main = document.getElementById("lj-shell-main");
        const templates = document.querySelector(".lj-shell__templates");
        return {
          mainRoots: main.querySelectorAll('[data-renderer="vnext"]').length,
          mainTextareas: main.querySelectorAll("textarea").length,
          templateHidden: templates ? templates.hasAttribute("hidden") : false,
          templateAriaHidden: templates
            ? templates.getAttribute("aria-hidden") === "true"
            : false,
          mains: document.querySelectorAll("main").length
        };
      });
      assert.equal(activeOnly.mains, 1);
      assert.equal(activeOnly.mainRoots, 1);
      assert.ok(activeOnly.mainTextareas >= 1);
      assert.equal(activeOnly.templateHidden, true);
      assert.equal(activeOnly.templateAriaHidden, true);
    } finally {
      await browser.close();
      staticServer.server.close();
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
);
