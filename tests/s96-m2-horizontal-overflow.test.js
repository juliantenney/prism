/**
 * Sprint 96 M2 — unified shell horizontal overflow (table breakout vs sidebar).
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const os = require("node:os");
const fflate = require("fflate");

const ljDesign = require("../lib/learning-journey-design-page.js");
const ljPackage = require("../lib/learning-journey-learner-package.js");
const unifiedShell = require("../lib/learning-journey-unified-shell.js");
const {
  enhanceFragmentWithSectionNavigation
} = require("../lib/learner-renderer-vnext/sequential-section-nav");

const PLAYWRIGHT_CANDIDATES = [
  path.join(__dirname, "fixtures", "sequential-nav-qa", "node_modules", "playwright"),
  "playwright"
];

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
    const ext = path.extname(filePath).toLowerCase();
    const type =
      ext === ".js"
        ? "text/javascript; charset=utf-8"
        : ext === ".css"
          ? "text/css; charset=utf-8"
          : "text/html; charset=utf-8";
    res.writeHead(200, { "Content-Type": type });
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

function wideTableFragment() {
  const cols = Array.from({ length: 8 }, (_, i) => "<th>Col " + (i + 1) + "</th>").join("");
  const cells = Array.from({ length: 8 }, (_, i) => "<td>Cell " + (i + 1) + "</td>").join("");
  return enhanceFragmentWithSectionNavigation(
    '<article class="util-learner-page util-page util-learner-renderer-vnext" data-renderer="vnext" ' +
      'role="region" aria-label="Wide table stop" data-page-kind="interactive" ' +
      'data-persistence-page-key="v1::s96-overflow::c1">' +
      '<header class="util-page-header util-learning-header">' +
      '<h2 data-lj-resource-title="true">Wide table stop</h2></header>' +
      '<section class="util-page-orientation" data-region="orientation">' +
      '<div id="journey-orient"><p>Orient copy.</p></div></section>' +
      '<section class="util-learning-activities" data-region="activities">' +
      '<article class="util-activity" id="activity-a1" data-activity-id="a1">' +
      '<h2 class="util-activity-title">Compare options</h2>' +
      '<article class="util-material-block util-material-table-block">' +
      '<div class="util-table-scroll util-material-table">' +
      "<table><thead><tr>" +
      cols +
      "</tr></thead><tbody><tr>" +
      cells +
      "</tr></tbody></table></div></article>" +
      '<div class="util-learner-workspace" data-workspace-kind="text_entry" data-workspace-id="ws-ov">' +
      '<label for="ws-ov">Notes</label>' +
      '<textarea id="ws-ov" class="util-learner-workspace__input"></textarea></div>' +
      "</article></section></article>"
  );
}

test("M2 overflow: shell CSS rebases table breakouts onto main container width", () => {
  const journey = ljDesign.buildLearningJourneyDesignPageFixture({
    title: "Overflow journey",
    sections: [
      {
        section_id: "journey_intro",
        title: "About",
        order: 1,
        exposition: "Overview"
      },
      { section_id: "s1", title: "Wide table stop", order: 2, exposition: "A." }
    ],
    commissions: [
      {
        commission_id: "c1",
        section_id: "s1",
        order: 1,
        title: "Wide table stop",
        product_id: "interactive",
        status: "supported",
        specification_text: "A"
      }
    ]
  });
  assert.equal(journey.ok, true);
  const shell = unifiedShell.buildLearningJourneyUnifiedShellHtml(journey.page, [
    { commissionId: "c1", title: "Wide table stop", html: wideTableFragment() }
  ]);
  assert.equal(shell.ok, true);
  assert.match(shell.html, /container-type:inline-size/);
  assert.match(shell.html, /--learner-breakout-basis:100cqw/);
  assert.match(
    shell.html,
    /body\.lj-shell-body[\s\S]*util-material-table-block[\s\S]*100cqw/
  );
  // Shell breakouts stay on 100cqw (not unrestricted 100vw). Shared learner CSS may still mention 100vw.
  assert.match(shell.html, /--lj-shell-prose-inset/);
  assert.match(shell.html, /--learner-reading-width:70ch/);
});

test(
  "M2 overflow browser: no workspace horizontal scrollbar with wide table breakout",
  { skip: process.env.PRISM_SKIP_BROWSER_E2E === "1" },
  async (t) => {
    const playwright = loadPlaywright();
    if (!playwright || !playwright.chromium) {
      t.skip("playwright is unavailable");
      return;
    }

    const journey = ljDesign.buildLearningJourneyDesignPageFixture({
      title: "Overflow browser journey",
      sections: [
        {
          section_id: "journey_intro",
          title: "About",
          order: 1,
          exposition: "Overview"
        },
        { section_id: "s1", title: "Wide table stop", order: 2, exposition: "A." }
      ],
      commissions: [
        {
          commission_id: "c1",
          section_id: "s1",
          order: 1,
          title: "Wide table stop",
          product_id: "interactive",
          status: "supported",
          specification_text: "A"
        }
      ]
    });
    assert.equal(journey.ok, true);

    const assembled = ljPackage.assembleLearningJourneyUnifiedShellPackage({
      page: journey.page,
      constituents: [
        {
          commissionId: "c1",
          title: "Wide table stop",
          productId: "interactive",
          fragmentHtml: wideTableFragment()
        }
      ],
      fflate,
      runtimeScript: fs.readFileSync(
        path.join(__dirname, "..", "lib", "learner-renderer-vnext-browser.js"),
        "utf8"
      )
    });
    assert.equal(assembled.ok, true, assembled.error && assembled.error.message);

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "prism-s96-overflow-"));
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
      const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      await context.addInitScript(() => {
        try {
          sessionStorage.setItem("prism:lj-shell:sidebar-state", "expanded");
        } catch (_e) {}
      });
      const page = await context.newPage();
      await page.goto(staticServer.baseUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__, { timeout: 30000 });
      await page.locator('[data-lj-nav-id="c1"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c1", {
        timeout: 15000
      });
      await page.waitForSelector(".util-material-table-block");
      await page.waitForTimeout(150);

      const metrics = await page.evaluate(() => {
        const workspace = document.querySelector(".lj-shell__workspace");
        const breakout = document.querySelector(".util-material-table-block");
        const table = breakout ? breakout.querySelector("table") : null;
        return {
          readingWidth: getComputedStyle(document.documentElement)
            .getPropertyValue("--learner-reading-width")
            .trim(),
          documentOverflow:
            document.documentElement.scrollWidth - document.documentElement.clientWidth,
          workspaceOverflow: workspace
            ? workspace.scrollWidth - workspace.clientWidth
            : null,
          breakoutOverflowX: breakout ? getComputedStyle(breakout).overflowX : null,
          breakoutRight: breakout ? breakout.getBoundingClientRect().right : null,
          viewportWidth: window.innerWidth,
          tableScrollWidth: table ? table.scrollWidth : null,
          breakoutClientWidth: breakout ? breakout.clientWidth : null
        };
      });

      assert.equal(metrics.readingWidth, "70ch");
      assert.ok(metrics.documentOverflow <= 1);
      assert.ok(
        metrics.workspaceOverflow <= 1,
        "workspace must not grow a document-level horizontal scrollbar"
      );
      assert.equal(metrics.breakoutOverflowX, "auto");
      assert.ok(metrics.breakoutRight <= metrics.viewportWidth + 1);
      assert.ok(metrics.tableScrollWidth > 0);
      assert.ok(metrics.breakoutClientWidth > 0);

      // Wide table remains reachable via local scroll on the breakout/scroll host.
      const localScroll = await page.evaluate(() => {
        const host =
          document.querySelector(".util-material-table-block .util-table-scroll") ||
          document.querySelector(".util-material-table-block");
        if (!host) return null;
        const canScroll = host.scrollWidth > host.clientWidth + 1;
        if (!canScroll) return { canScroll: false, scrollLeft: host.scrollLeft };
        host.scrollLeft = 40;
        return { canScroll: true, scrollLeft: host.scrollLeft, overflowX: getComputedStyle(host).overflowX };
      });
      assert.ok(localScroll);
      if (localScroll.canScroll) {
        assert.ok(localScroll.scrollLeft >= 40);
      }

      await page.locator("#ws-ov").fill("overflow draft");
      await page.locator("#ws-ov").blur();
      await page.waitForTimeout(500);
      await page.locator('[data-lj-nav-id="overview"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "overview");
      await page.locator('[data-lj-nav-id="c1"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c1");
      assert.equal(await page.locator("#ws-ov").inputValue(), "overflow draft");
    } finally {
      await browser.close();
      staticServer.server.close();
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
);
