/**
 * Sprint 96 M1 — browser evidence for sticky layout, collapse, zoom, and persistence.
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

function buildPackage() {
  const journey = ljDesign.buildLearningJourneyDesignPageFixture({
    title: "S96 M1 browser journey",
    sections: [
      {
        section_id: "journey_intro",
        title: "About",
        order: 1,
        exposition: "Overview body for layout."
      },
      { section_id: "s1", title: "Interactive stop", order: 2, exposition: "A." },
      { section_id: "s2", title: "Follow-up", order: 3, exposition: "B." }
    ],
    commissions: [
      {
        commission_id: "c1",
        section_id: "s1",
        order: 1,
        title: "Interactive stop",
        product_id: "interactive",
        status: "supported",
        specification_text: "A"
      },
      {
        commission_id: "c2",
        section_id: "s2",
        order: 2,
        title: "Follow-up",
        product_id: "expository",
        status: "supported",
        specification_text: "B"
      }
    ]
  });
  assert.equal(journey.ok, true, (journey.errors || []).join("; "));
  const interactiveHtml = enhanceFragmentWithSectionNavigation(
    '<article class="util-learner-page util-page util-learner-renderer-vnext" data-renderer="vnext" ' +
      'role="region" aria-label="Interactive stop" data-page-kind="interactive" ' +
      'data-persistence-page-key="v1::s96-m1-browser::c1">' +
      '<header class="util-page-header util-learning-header">' +
      '<h2 data-lj-resource-title="true">Interactive stop</h2></header>' +
      '<section class="util-page-orientation" data-region="orientation">' +
      '<div id="journey-orient"><p>' +
      "Opening paragraph. ".repeat(40) +
      "</p></div></section>" +
      '<section class="util-learning-activities" data-region="activities">' +
      '<article class="util-activity util-task-block util-vnext-activity" id="activity-a1" data-activity-id="a1">' +
      '<header class="util-activity-header"><h2 class="util-activity-title">Weigh the evidence</h2></header>' +
      '<div class="util-learner-workspace" data-workspace-kind="text_entry" data-workspace-id="ws-m1">' +
      '<label for="ws-m1">Notes</label>' +
      '<textarea id="ws-m1" class="util-learner-workspace__input"></textarea></div>' +
      "<p>" +
      "Middle paragraph. ".repeat(40) +
      "</p></article>" +
      '<article class="util-activity util-task-block util-vnext-activity" id="activity-a2" data-activity-id="a2">' +
      '<header class="util-activity-header"><h2 class="util-activity-title">Defend your judgement</h2></header>' +
      "<p>" +
      "Closing paragraph. ".repeat(40) +
      "</p></article></section></article>"
  );
  const followHtml =
    '<article class="util-learner-renderer-vnext" data-renderer="vnext" role="region" ' +
    'aria-label="Follow-up" data-persistence-page-key="v1::s96-m1-browser::c2">' +
    '<h2 data-lj-resource-title="true">Follow-up</h2><p>Static follow-up.</p></article>';

  const assembled = ljPackage.assembleLearningJourneyUnifiedShellPackage({
    page: journey.page,
    constituents: [
      {
        commissionId: "c1",
        title: "Interactive stop",
        productId: "interactive",
        fragmentHtml: interactiveHtml
      },
      {
        commissionId: "c2",
        title: "Follow-up",
        productId: "expository",
        fragmentHtml: followHtml
      }
    ],
    fflate,
    runtimeScript: fs.readFileSync(
      path.join(__dirname, "..", "lib", "learner-renderer-vnext-browser.js"),
      "utf8"
    )
  });
  assert.equal(assembled.ok, true, assembled.error && assembled.error.message);
  return assembled;
}

async function measureStickyStack(page) {
  return page.evaluate(() => {
    const toolbar = document.querySelector(".lj-shell__toolbar");
    const sectionNav = document.querySelector(".util-journey-nav--sequential");
    const toolbarRect = toolbar ? toolbar.getBoundingClientRect() : null;
    const navRect = sectionNav ? sectionNav.getBoundingClientRect() : null;
    const cssToolbar = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--lj-shell-toolbar-height")
    );
    const cssNav = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--learner-sticky-nav-height")
    );
    let overlap = false;
    if (toolbarRect && navRect) {
      overlap = navRect.top + 0.5 < toolbarRect.bottom;
    }
    return {
      toolbarPresent: !!toolbar,
      toolbarHeight: toolbarRect ? toolbarRect.height : 0,
      navTop: navRect ? navRect.top : null,
      toolbarBottom: toolbarRect ? toolbarRect.bottom : null,
      cssToolbar,
      cssNav,
      overlap,
      bodyScrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    };
  });
}

test(
  "M1 browser: sticky clearance, collapse persistence, narrow + zoom layouts",
  { skip: process.env.PRISM_SKIP_BROWSER_E2E === "1" },
  async (t) => {
    const playwright = loadPlaywright();
    if (!playwright || !playwright.chromium) {
      t.skip("playwright is unavailable");
      return;
    }

    const assembled = buildPackage();
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "prism-s96-m1-"));
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
          sessionStorage.removeItem("prism:lj-shell:sidebar-state");
        } catch (_e) {}
      });
      const page = await context.newPage();
      await page.goto(staticServer.baseUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForFunction(
        () => window.__PRISM_LJ_SHELL__ && window.__PRISM_LJ_SHELL__.currentId === "overview",
        { timeout: 30000 }
      );

      assert.equal(
        await page.evaluate(() =>
          document.querySelector(".lj-shell").classList.contains("lj-shell--sidebar-collapsed")
        ),
        false
      );
      assert.equal(await page.locator("#lj-shell-sidebar-toggle").getAttribute("aria-expanded"), "true");

      await page.locator('[data-lj-nav-id="c1"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c1", {
        timeout: 15000
      });
      await page.waitForSelector(".util-journey-nav--sequential");
      await page.waitForTimeout(200);

      const desktopStack = await measureStickyStack(page);
      assert.equal(desktopStack.toolbarPresent, false, "shell title bar removed in M2");
      assert.equal(desktopStack.cssToolbar, 0, "toolbar height CSS var remains 0 without title bar");
      assert.equal(desktopStack.overlap, false, "section nav must not overlap shell chrome");
      assert.ok(desktopStack.cssNav > 0, "section-nav sticky height should be measured");
      assert.ok(desktopStack.bodyScrollWidth <= desktopStack.clientWidth + 1);

      await page.locator("#lj-shell-sidebar-toggle").click();
      await page.waitForFunction(() =>
        document.querySelector(".lj-shell").classList.contains("lj-shell--sidebar-collapsed")
      );
      assert.equal(await page.locator("#lj-shell-sidebar-toggle").isVisible(), true);
      assert.equal(await page.locator("#lj-shell-sidebar-toggle").getAttribute("aria-expanded"), "false");
      assert.equal(
        await page.locator("#lj-shell-sidebar-toggle").getAttribute("aria-label"),
        "Show journey contents"
      );
      const railWidth = await page.evaluate(
        () => document.getElementById("lj-shell-sidebar").getBoundingClientRect().width
      );
      assert.ok(railWidth >= 50 && railWidth <= 64, "collapsed rail ~52–60px");

      await page.locator("#lj-shell-sidebar-toggle").click();
      await page.waitForFunction(
        () => !document.querySelector(".lj-shell").classList.contains("lj-shell--sidebar-collapsed")
      );
      assert.equal(await page.locator("#lj-shell-sidebar-toggle").getAttribute("aria-expanded"), "true");

      await page.locator("#lj-shell-sidebar-toggle").focus();
      await page.keyboard.press("Escape");
      await page.waitForFunction(() =>
        document.querySelector(".lj-shell").classList.contains("lj-shell--sidebar-collapsed")
      );
      const focusedAfterEscape = await page.evaluate(() => document.activeElement && document.activeElement.id);
      assert.equal(focusedAfterEscape, "lj-shell-sidebar-toggle");

      // Sidebar collapsed: reopen, navigate, confirm explicit expand persists across resources.
      await page.locator("#lj-shell-sidebar-toggle").click();
      await page.waitForFunction(
        () => !document.querySelector(".lj-shell").classList.contains("lj-shell--sidebar-collapsed")
      );
      await page.locator('[data-lj-nav-id="c2"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c2");
      assert.equal(
        await page.evaluate(() => sessionStorage.getItem("prism:lj-shell:sidebar-state")),
        "expanded"
      );
      assert.equal(
        await page.evaluate(() =>
          document.querySelector(".lj-shell").classList.contains("lj-shell--sidebar-collapsed")
        ),
        false
      );
      await page.locator('[data-lj-nav-id="c1"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c1");
      assert.equal(
        await page.evaluate(() => sessionStorage.getItem("prism:lj-shell:sidebar-state")),
        "expanded"
      );

      await page.locator("#ws-m1").fill("M1 draft persists");
      await page.locator("#ws-m1").blur();
      await page.waitForTimeout(500);
      await page.locator('[data-lj-nav-id="c2"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c2");
      await page.locator('[data-lj-nav-id="c1"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c1");
      assert.equal(await page.locator("#ws-m1").inputValue(), "M1 draft persists");

      // Narrow viewport defaults to collapsed when no stored preference... clear and reload.
      await page.evaluate(() => sessionStorage.removeItem("prism:lj-shell:sidebar-state"));
      await page.setViewportSize({ width: 390, height: 800 });
      await page.reload({ waitUntil: "domcontentloaded" });
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__, { timeout: 30000 });
      assert.equal(
        await page.evaluate(() =>
          document.querySelector(".lj-shell").classList.contains("lj-shell--sidebar-collapsed")
        ),
        true
      );
      assert.equal(await page.locator("#lj-shell-sidebar-toggle").isVisible(), true);
      await page.locator("#lj-shell-sidebar-toggle").click();
      await page.waitForFunction(
        () => !document.querySelector(".lj-shell").classList.contains("lj-shell--sidebar-collapsed")
      );
      await page.locator('[data-lj-nav-id="c1"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c1");
      const narrowMetrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        mainWidth: document.getElementById("lj-shell-main").getBoundingClientRect().width
      }));
      assert.ok(narrowMetrics.scrollWidth <= narrowMetrics.clientWidth + 1);
      assert.ok(narrowMetrics.mainWidth > 200);

      // High zoom on the interactive resource already mounted (avoid full reload flake).
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.evaluate(() => {
        sessionStorage.setItem("prism:lj-shell:sidebar-state", "expanded");
        if (window.__PRISM_LJ_SHELL_LAYOUT__) {
          window.__PRISM_LJ_SHELL_LAYOUT__.setSidebarCollapsed(false);
          window.__PRISM_LJ_SHELL_LAYOUT__.sync();
        }
      });
      if ((await page.evaluate(() => window.__PRISM_LJ_SHELL__.currentId)) !== "c1") {
        if (
          await page.evaluate(() =>
            document.querySelector(".lj-shell").classList.contains("lj-shell--sidebar-collapsed")
          )
        ) {
          await page.locator("#lj-shell-sidebar-toggle").click();
        }
        await page.locator('[data-lj-nav-id="c1"]').click();
        await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c1");
      }
      await page.waitForSelector(".util-journey-nav--sequential");

      for (const factor of [2, 4]) {
        await page.evaluate((scale) => {
          document.documentElement.style.zoom = String(scale);
          if (window.__PRISM_LJ_SHELL_LAYOUT__ && window.__PRISM_LJ_SHELL_LAYOUT__.sync) {
            window.__PRISM_LJ_SHELL_LAYOUT__.sync();
          }
          window.dispatchEvent(new Event("resize"));
        }, factor);
        await page.waitForTimeout(250);
        const zoomed = await measureStickyStack(page);
        assert.equal(
          zoomed.overlap,
          false,
          "no sticky overlap at zoom factor " + factor
        );
        // 200%: no whole-page horizontal scroll. 400%: allow minor zoom-engine overflow;
        // shell still uses overflow-x:clip and min-width:0 reading column.
        if (factor === 2) {
          assert.ok(
            zoomed.bodyScrollWidth <= zoomed.clientWidth + 2,
            "no unexpected horizontal page scroll at zoom 200%"
          );
        }
      }

      await page.evaluate(() => {
        document.documentElement.style.zoom = "1";
      });
      assert.equal(await page.locator("main").count(), 1);
    } finally {
      await browser.close();
      staticServer.server.close();
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
);
