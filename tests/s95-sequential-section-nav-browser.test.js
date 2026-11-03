/**
 * Sprint 95 — Interactive section navigation inside the unified shell.
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
const { enhanceFragmentWithSectionNavigation } = require("../lib/learner-renderer-vnext");

const PLAYWRIGHT_CANDIDATES = [
  path.join(__dirname, "fixtures", "sequential-nav-qa", "node_modules", "playwright"),
  "playwright"
];

function multiActivityFragmentHtml() {
  return (
    '<article class="util-learner-page util-page util-learner-renderer-vnext" data-renderer="vnext" ' +
    'role="region" aria-label="Learning resource" data-page-kind="interactive" ' +
    'data-persistence-page-key="v1::wf-nav-browser::page-nav">' +
    '<header class="util-page-header util-learning-header"><h2 data-lj-resource-title="true">Reflective judgement</h2></header>' +
    '<section class="util-page-orientation" data-region="orientation"><div id="journey-orient"><p>Orient here.</p></div></section>' +
    '<section class="util-learning-activities" data-region="activities">' +
    '<article class="util-activity util-task-block util-vnext-activity" id="activity-a1" data-activity-id="a1">' +
    '<header class="util-activity-header"><h2 class="util-activity-title">Weigh the evidence</h2></header>' +
    '<div class="util-learner-workspace" data-workspace-kind="text_entry" data-workspace-id="ws-a1">' +
    '<label for="ws-a1">Notes</label><textarea id="ws-a1" class="util-learner-workspace__input"></textarea></div>' +
    "</article>" +
    '<article class="util-activity util-task-block util-vnext-activity" id="activity-a2" data-activity-id="a2">' +
    '<header class="util-activity-header"><h2 class="util-activity-title">Defend your judgement</h2></header>' +
    '<div class="util-learner-workspace" data-workspace-kind="text_entry" data-workspace-id="ws-a2">' +
    '<label for="ws-a2">Defence</label><textarea id="ws-a2" class="util-learner-workspace__input"></textarea></div>' +
    "</article>" +
    "</section></article>"
  );
}

function buildJourney() {
  return ljDesign.buildLearningJourneyDesignPageFixture({
    title: "Section nav shell journey",
    sections: [
      {
        section_id: "journey_intro",
        title: "About",
        order: 1,
        exposition: "Overview then interactive resource."
      },
      {
        section_id: "exp_1",
        title: "Reflective judgement",
        order: 2,
        exposition: "Internal sections."
      },
      {
        section_id: "exp_2",
        title: "Follow-up",
        order: 3,
        exposition: "Another stop."
      }
    ],
    commissions: [
      {
        commission_id: "c6",
        section_id: "exp_1",
        order: 1,
        title: "Reflective judgement",
        product_id: "interactive",
        status: "supported",
        specification_text: "Interactive"
      },
      {
        commission_id: "c2",
        section_id: "exp_2",
        order: 2,
        title: "Follow-up",
        product_id: "expository",
        status: "supported",
        specification_text: "Expository"
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
}

function contentTypeFor(filePath) {
  if (/\.html?$/i.test(filePath)) return "text/html; charset=utf-8";
  if (/\.js$/i.test(filePath)) return "text/javascript; charset=utf-8";
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
  "S95 browser: Interactive section nav remounts and preserves journey hash",
  { skip: process.env.PRISM_SKIP_BROWSER_E2E === "1" },
  async (t) => {
    const playwright = loadPlaywright();
    if (!playwright || !playwright.chromium) {
      t.skip("playwright is unavailable");
      return;
    }

    const journey = buildJourney();
    assert.equal(journey.ok, true, (journey.errors || []).join("; "));
    const interactiveHtml = enhanceFragmentWithSectionNavigation(multiActivityFragmentHtml());
    const followUpHtml =
      '<article class="util-learner-renderer-vnext" data-renderer="vnext" role="region" ' +
      'aria-label="Follow-up" data-persistence-page-key="v1::wf-nav-browser::follow">' +
      '<h2 data-lj-resource-title="true">Follow-up</h2><p>Static follow-up.</p></article>';

    const assembled = ljPackage.assembleLearningJourneyUnifiedShellPackage({
      page: journey.page,
      constituents: [
        {
          commissionId: "c6",
          title: "Reflective judgement",
          productId: "interactive",
          fragmentHtml: interactiveHtml
        },
        {
          commissionId: "c2",
          title: "Follow-up",
          productId: "expository",
          fragmentHtml: followUpHtml
        }
      ],
      fflate
    });
    assert.equal(assembled.ok, true, assembled.error && assembled.error.message);

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "prism-s95-section-nav-"));
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
        () => window.__PRISM_LJ_SHELL__ && window.__PRISM_LJ_SHELL__.currentId === "overview",
        { timeout: 30000 }
      );

      await page.locator('[data-lj-nav-id="c6"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c6", {
        timeout: 15000
      });
      assert.equal(await page.locator("main").count(), 1);
      assert.equal(await page.locator(".util-journey-nav--sequential").count(), 1);
      assert.equal(
        await page.locator('.util-journey-nav--sequential[aria-label="Learning sections"]').count(),
        1
      );

      const hashBefore = await page.evaluate(() => location.hash);
      assert.equal(hashBefore, "#c6");

      await page.locator("a.util-journey-adjacent--next").click();
      await page.waitForTimeout(200);
      const hashAfterSection = await page.evaluate(() => location.hash);
      assert.equal(hashAfterSection, "#c6", "section navigation must not change journey hash");
      assert.equal(await page.evaluate(() => window.__PRISM_LJ_SHELL__.currentId), "c6");

      const notes = page.locator("#ws-a1");
      await notes.fill("Draft across remount");
      await notes.blur();
      await page.waitForTimeout(500);

      await page.locator('[data-lj-nav-id="c2"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c2");
      assert.equal(await page.locator(".util-journey-nav--sequential").count(), 0);

      await page.locator('[data-lj-nav-id="c6"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c6");
      assert.equal(await page.locator(".util-journey-nav--sequential").count(), 1);
      assert.equal(await page.locator("#ws-a1").inputValue(), "Draft across remount");

      assert.match(await page.locator("#lj-shell-prev").textContent(), /Previous resource/i);
      await page.locator("#lj-shell-prev").click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "overview");
    } finally {
      await browser.close();
      staticServer.server.close();
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
);
