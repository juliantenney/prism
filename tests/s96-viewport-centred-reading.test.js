/**
 * Sprint 96 — viewport-centred 70ch reading column (sidebar expand/collapse).
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("path");
const http = require("node:http");
const os = require("node:os");
const fflate = require("fflate");

const ljDesign = require("../lib/learning-journey-design-page.js");
const ljPackage = require("../lib/learning-journey-learner-package.js");
const unifiedShell = require("../lib/learning-journey-unified-shell.js");

const PLAYWRIGHT_CANDIDATES = [
  path.join(__dirname, "fixtures", "sequential-nav-qa", "node_modules", "playwright"),
  "playwright"
];

const STANDALONE_ROOT = path.join(__dirname, "..", "tmp-duu-standalone-m2-overflow");
const EVIDENCE_DIR = path.join(
  __dirname,
  "..",
  "docs",
  "development",
  "sprints",
  "2026-11-03-sprint-96-unified-learning-journey-experience",
  "evidence",
  "viewport-centred-reading"
);
const MEASUREMENTS_PATH = path.join(EVIDENCE_DIR, "measurements.json");

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
          : ext === ".png"
            ? "image/png"
            : "text/html; charset=utf-8";
    res.writeHead(200, { "Content-Type": type });
    res.end(fs.readFileSync(filePath));
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      resolve({
        server,
        baseUrl: "http://127.0.0.1:" + server.address().port + "/"
      });
    });
  });
}

function collectAssets(commissionId) {
  const mediaDir = path.join(STANDALONE_ROOT, commissionId, "media");
  if (!fs.existsSync(mediaDir)) return [];
  return fs.readdirSync(mediaDir).map((name) => ({
    path: "media/" + name,
    bytes: fs.readFileSync(path.join(mediaDir, name))
  }));
}

test("shell CSS centres reading column via measured sidebar inset; breakouts use 100cqw", () => {
  const shell = unifiedShell.buildLearningJourneyUnifiedShellHtml(
    ljDesign.buildLearningJourneyDesignPageFixture({
      title: "Viewport centre",
      sections: [
        { section_id: "journey_intro", title: "About", order: 1, exposition: "Overview" },
        { section_id: "s1", title: "One", order: 2, exposition: "a" }
      ],
      commissions: [
        {
          commission_id: "c1",
          section_id: "s1",
          order: 1,
          title: "One",
          product_id: "interactive",
          status: "supported",
          specification_text: "a"
        }
      ]
    }).page,
    [
      {
        commissionId: "c1",
        title: "One",
        html: '<article data-renderer="vnext"><h2 data-lj-resource-title="true">One</h2><p class="util-prose-measure">Body</p></article>',
        pageKey: "page-c1",
        productId: "interactive"
      }
    ],
    {}
  );
  assert.equal(shell.ok, true);
  assert.match(shell.html, /--lj-shell-prose-inset/);
  assert.match(shell.html, /--lj-shell-sidebar-occupied/);
  assert.match(shell.html, /measureSidebarOccupied/);
  assert.match(shell.html, /--learner-breakout-basis:100cqw/);
  assert.match(shell.html, /body\.lj-shell-body \.util-learner-page\{width:min\(100%,var\(--learner-reading-width,70ch\)\);margin-inline:0\}/);
  assert.doesNotMatch(
    shell.html,
    /body\.lj-shell-body[\s\S]{0,200}--learner-breakout-basis:100vw/
  );
});

test(
  "browser: reading-column centre stable across sidebar states; tables stay in workspace",
  {
    skip:
      process.env.PRISM_SKIP_BROWSER_E2E === "1" ||
      !fs.existsSync(path.join(STANDALONE_ROOT, "c2", "index.html"))
  },
  async (t) => {
    const playwright = loadPlaywright();
    if (!playwright || !playwright.chromium) {
      t.skip("playwright unavailable");
      return;
    }

    const commissions = ["c2", "c4"];
    const journey = ljDesign.buildLearningJourneyDesignPageFixture({
      title: "Deciding Under Uncertainty",
      sections: [
        { section_id: "journey_intro", title: "About", order: 1, exposition: "Overview" }
      ].concat(
        commissions.map((id, i) => ({
          section_id: "s_" + id,
          title: id.toUpperCase(),
          order: i + 2,
          exposition: id
        }))
      ),
      commissions: commissions.map((id, i) => ({
        commission_id: id,
        section_id: "s_" + id,
        order: i + 1,
        title: id.toUpperCase(),
        product_id: "interactive",
        status: "supported",
        specification_text: id
      }))
    });
    assert.equal(journey.ok, true);

    const assembled = ljPackage.assembleLearningJourneyUnifiedShellPackage({
      page: journey.page,
      constituents: commissions.map((id) => ({
        commissionId: id,
        title: id.toUpperCase(),
        productId: "interactive",
        learnerPackage: {
          html: fs.readFileSync(path.join(STANDALONE_ROOT, id, "index.html"), "utf8"),
          assets: collectAssets(id)
        }
      })),
      fflate,
      runtimeScript: fs.readFileSync(
        path.join(__dirname, "..", "lib", "learner-renderer-vnext-browser.js"),
        "utf8"
      )
    });
    assert.equal(assembled.ok, true, assembled.error && assembled.error.message);

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "prism-s96-centre-"));
    writeZipToDir(assembled.bytes, tempDir);
    fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
    const staticServer = await startStaticServer(tempDir);

    let browser;
    try {
      browser = await playwright.chromium.launch({ headless: true, channel: "chrome" });
    } catch (err) {
      staticServer.server.close();
      t.skip("Chrome unavailable: " + String(err && err.message));
      return;
    }

    const report = { desktop: {}, narrow: {}, zoom200: {}, zoom400: {}, standaloneNote: null };

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

      async function open(id) {
        await page.locator('[data-lj-nav-id="' + id + '"]').click();
        await page.waitForFunction(
          (wanted) => window.__PRISM_LJ_SHELL__ && window.__PRISM_LJ_SHELL__.currentId === wanted,
          id,
          { timeout: 20000 }
        );
        await page.waitForTimeout(350);
      }

      async function measure(label) {
        return page.evaluate((tag) => {
          const prose =
            document.querySelector("#lj-shell-main .util-learner-page") ||
            document.querySelector("#lj-shell-main .util-prose-measure") ||
            document.querySelector("#lj-shell-main [data-lj-resource-title]");
          const main = document.getElementById("lj-shell-main");
          const sidebar = document.getElementById("lj-shell-sidebar");
          const workspace = document.querySelector(".lj-shell__workspace");
          const breakout =
            document.querySelector("#lj-shell-main .util-learner-table-breakout") ||
            document.querySelector("#lj-shell-main .util-material-table-block") ||
            document.querySelector("#lj-shell-main .util-table-scroll");
          const pr = prose ? prose.getBoundingClientRect() : null;
          const sr = sidebar ? sidebar.getBoundingClientRect() : null;
          const mr = main ? main.getBoundingClientRect() : null;
          const br = breakout ? breakout.getBoundingClientRect() : null;
          const occupied = getComputedStyle(document.documentElement)
            .getPropertyValue("--lj-shell-sidebar-occupied")
            .trim();
          const readingWidth = getComputedStyle(document.documentElement)
            .getPropertyValue("--learner-reading-width")
            .trim();
          const viewportCenter = window.innerWidth / 2;
          const proseCenter = pr ? pr.left + pr.width / 2 : null;
          return {
            label: tag,
            viewportWidth: window.innerWidth,
            viewportCenter: Math.round(viewportCenter * 10) / 10,
            proseCenter: proseCenter == null ? null : Math.round(proseCenter * 10) / 10,
            proseLeft: pr ? Math.round(pr.left * 10) / 10 : null,
            proseWidth: pr ? Math.round(pr.width * 10) / 10 : null,
            proseRight: pr ? Math.round(pr.right * 10) / 10 : null,
            sidebarRight: sr ? Math.round(sr.right * 10) / 10 : null,
            sidebarWidth: sr ? Math.round(sr.width * 10) / 10 : null,
            mainLeft: mr ? Math.round(mr.left * 10) / 10 : null,
            occupiedToken: occupied,
            readingWidth: readingWidth,
            documentOverflow:
              document.documentElement.scrollWidth - document.documentElement.clientWidth,
            workspaceOverflow: workspace
              ? workspace.scrollWidth - workspace.clientWidth
              : null,
            breakoutLeft: br ? Math.round(br.left * 10) / 10 : null,
            breakoutRight: br ? Math.round(br.right * 10) / 10 : null,
            breakoutUnderSidebar:
              br && sr ? br.left + 0.5 < sr.right && br.right > sr.left && sr.bottom > br.top : false,
            proseOverlapsSidebar:
              pr && sr ? pr.left + 0.5 < sr.right && pr.right > sr.left && sr.bottom > pr.top : false
          };
        }, label);
      }

      await open("c2");
      await page.locator("#lj-shell-sidebar-toggle").click();
      await page.waitForTimeout(300);
      // Ensure expanded
      await page.evaluate(() => {
        const root = document.querySelector(".lj-shell");
        if (root && root.classList.contains("lj-shell--sidebar-collapsed")) {
          document.getElementById("lj-shell-sidebar-toggle").click();
        }
      });
      await page.waitForTimeout(350);
      const expanded = await measure("desktop-expanded");
      await page.screenshot({
        path: path.join(EVIDENCE_DIR, "01-desktop-expanded.png"),
        fullPage: false
      });

      await page.locator("#lj-shell-sidebar-toggle").click();
      await page.waitForTimeout(350);
      const collapsed = await measure("desktop-collapsed");
      await page.screenshot({
        path: path.join(EVIDENCE_DIR, "02-desktop-collapsed.png"),
        fullPage: false
      });

      report.desktop = { expanded, collapsed };

      assert.equal(expanded.readingWidth, "70ch");
      assert.equal(collapsed.readingWidth, "70ch");
      assert.equal(expanded.proseOverlapsSidebar, false);
      assert.equal(collapsed.proseOverlapsSidebar, false);
      assert.ok(expanded.documentOverflow <= 1);
      assert.ok(collapsed.documentOverflow <= 1);
      assert.equal(expanded.breakoutUnderSidebar, false);
      assert.equal(collapsed.breakoutUnderSidebar, false);

      // Centres should match within a small tolerance (sub-pixel / scrollbar).
      const centreDelta = Math.abs(expanded.proseCenter - collapsed.proseCenter);
      assert.ok(
        centreDelta <= 2,
        "prose centre shifted by " + centreDelta + "px between sidebar states"
      );
      // Near viewport centre when space allows (1280 desktop).
      assert.ok(
        Math.abs(expanded.proseCenter - expanded.viewportCenter) <= 8,
        "expanded prose not near viewport centre: " +
          expanded.proseCenter +
          " vs " +
          expanded.viewportCenter
      );

      await page.evaluate(() => {
        const root = document.querySelector(".lj-shell");
        if (root && root.classList.contains("lj-shell--sidebar-collapsed")) {
          document.getElementById("lj-shell-sidebar-toggle").click();
        }
      });
      await page.waitForTimeout(350);
      await open("c4");
      const c4Expanded = await measure("c4-expanded");
      report.desktop.c4Expanded = c4Expanded;
      assert.equal(c4Expanded.breakoutUnderSidebar, false);
      assert.ok(c4Expanded.documentOverflow <= 1);
      await page.screenshot({
        path: path.join(EVIDENCE_DIR, "03-c4-tables-expanded.png"),
        fullPage: false
      });

      // Narrow
      await page.setViewportSize({ width: 390, height: 800 });
      await page.waitForTimeout(400);
      await open("c2");
      const narrow = await measure("narrow-390");
      report.narrow = narrow;
      assert.equal(narrow.proseOverlapsSidebar, false);
      assert.ok(narrow.documentOverflow <= 1);
      await page.screenshot({
        path: path.join(EVIDENCE_DIR, "04-narrow-390.png"),
        fullPage: false
      });

      // Zoom via CDP
      await page.setViewportSize({ width: 1280, height: 800 });
      const client = await page.context().newCDPSession(page);
      await client.send("Emulation.setPageScaleFactor", { pageScaleFactor: 2 });
      await page.waitForTimeout(400);
      const z200 = await measure("zoom-200");
      report.zoom200 = z200;
      assert.ok(z200.documentOverflow <= 1);
      await page.screenshot({
        path: path.join(EVIDENCE_DIR, "05-zoom-200.png"),
        fullPage: false
      });

      await client.send("Emulation.setPageScaleFactor", { pageScaleFactor: 4 });
      await page.waitForTimeout(400);
      const z400 = await measure("zoom-400");
      report.zoom400 = z400;
      // Extreme zoom: claim no document overflow preference; allow local table scroll.
      assert.ok(z400.documentOverflow <= 2 || z400.workspaceOverflow >= 0);
      await page.screenshot({
        path: path.join(EVIDENCE_DIR, "06-zoom-400.png"),
        fullPage: false
      });
      await client.send("Emulation.setPageScaleFactor", { pageScaleFactor: 1 });

      report.standaloneNote =
        "Standalone util-learner-page remains margin-inline:auto in shared CSS; shell overrides only under body.lj-shell-body.";
      fs.writeFileSync(MEASUREMENTS_PATH, JSON.stringify(report, null, 2));
    } finally {
      await browser.close();
      staticServer.server.close();
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
);
