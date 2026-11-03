/**
 * Sprint 96 M2 — browser evidence for visual coherence (toggle, full-height, sticky, zoom).
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

const EVIDENCE_DIR = path.join(
  __dirname,
  "..",
  "docs",
  "development",
  "sprints",
  "2026-11-03-sprint-96-unified-learning-journey-experience",
  "evidence",
  "m2-visual-coherence"
);

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
    title: "S96 M2 browser journey",
    sections: [
      {
        section_id: "journey_intro",
        title: "About",
        order: 1,
        exposition: "Overview body for visual coherence."
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
      'data-persistence-page-key="v1::s96-m2-browser::c1">' +
      '<header class="util-page-header util-learning-header">' +
      '<h2 data-lj-resource-title="true">Interactive stop</h2></header>' +
      '<section class="util-page-orientation" data-region="orientation">' +
      '<div id="journey-orient"><p>' +
      "Opening paragraph. ".repeat(40) +
      "</p></div></section>" +
      '<section class="util-learning-activities" data-region="activities">' +
      '<article class="util-activity util-task-block util-vnext-activity" id="activity-a1" data-activity-id="a1">' +
      '<header class="util-activity-header"><h2 class="util-activity-title">Weigh the evidence</h2></header>' +
      '<div class="util-learner-workspace" data-workspace-kind="text_entry" data-workspace-id="ws-m2">' +
      '<label for="ws-m2">Notes</label>' +
      '<textarea id="ws-m2" class="util-learner-workspace__input"></textarea></div>' +
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
    'aria-label="Follow-up" data-persistence-page-key="v1::s96-m2-browser::c2">' +
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

test(
  "M2 browser: compact toggle, full-height sidebar, reading width, sticky, zoom",
  { skip: process.env.PRISM_SKIP_BROWSER_E2E === "1" },
  async (t) => {
    const playwright = loadPlaywright();
    if (!playwright || !playwright.chromium) {
      t.skip("playwright is unavailable");
      return;
    }

    const assembled = buildPackage();
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "prism-s96-m2-"));
    writeZipToDir(assembled.bytes, tempDir);
    const staticServer = await startStaticServer(tempDir);
    fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

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

      assert.equal(await page.locator("#lj-shell-prev").count(), 0);
      assert.equal(await page.locator("#lj-shell-next").count(), 0);
      assert.equal(await page.locator(".lj-shell__toolbar").count(), 0);
      assert.equal(await page.locator("#lj-shell-sidebar-reopen").count(), 0);

      const initialFocus = await page.evaluate(() => {
        const heading = document.querySelector(
          "#lj-shell-main [data-lj-resource-title], #lj-shell-main h2, #lj-shell-main h1"
        );
        const active = document.activeElement;
        const outline =
          heading && active === heading ? getComputedStyle(heading).outlineStyle : "none";
        return {
          activeId: active && active.id,
          activeTag: active && active.tagName,
          headingFocused: !!(heading && active === heading),
          outlineStyle: outline
        };
      });
      assert.equal(initialFocus.headingFocused, false, "initial load must not focus resource title");
      assert.notEqual(initialFocus.outlineStyle, "auto");

      const toggleBox = await page.locator("#lj-shell-sidebar-toggle").boundingBox();
      assert.ok(toggleBox);
      assert.ok(toggleBox.width >= 34 && toggleBox.width <= 44, "toggle ~36–40px wide");
      assert.ok(toggleBox.height >= 34 && toggleBox.height <= 44, "toggle ~36–40px tall");
      assert.equal(
        await page.locator("#lj-shell-sidebar-toggle").getAttribute("aria-label"),
        "Hide journey contents"
      );

      await page.locator('[data-lj-nav-id="c1"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c1", {
        timeout: 15000
      });
      await page.waitForSelector(".util-journey-nav--sequential");
      await page.waitForTimeout(150);

      const afterNavFocus = await page.evaluate(() => {
        const heading = document.querySelector(
          "#lj-shell-main [data-lj-resource-title], #lj-shell-main h2, #lj-shell-main h1"
        );
        return {
          headingIsActive: !!(heading && document.activeElement === heading),
          headingTabIndex: heading ? heading.getAttribute("tabindex") : null
        };
      });
      assert.equal(afterNavFocus.headingIsActive, true, "resource nav should move focus to title");
      assert.equal(afterNavFocus.headingTabIndex, "-1");

      const layout = await page.evaluate(() => {
        const sidebar = document.getElementById("lj-shell-sidebar");
        const learnerPage = document.querySelector(".util-learner-page");
        const sectionNav = document.querySelector(".util-journey-nav--sequential");
        const toc = document.querySelector(".lj-shell__toc-link[aria-current='page']");
        const allBtn = document.querySelector(".util-journey-all-btn");
        const current = document.querySelector(".util-journey-current");
        const readingWidth = getComputedStyle(document.documentElement).getPropertyValue(
          "--learner-reading-width"
        );
        const toolbarHeight = parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue("--lj-shell-toolbar-height")
        );
        const stickyNav = parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue("--learner-sticky-nav-height")
        );
        const sidebarRect = sidebar.getBoundingClientRect();
        const navRect = sectionNav ? sectionNav.getBoundingClientRect() : null;
        const pageRect = learnerPage ? learnerPage.getBoundingClientRect() : null;
        const tocStyle = toc ? getComputedStyle(toc) : null;
        const allBtnStyle = allBtn ? getComputedStyle(allBtn) : null;
        const currentStyle = current ? getComputedStyle(current) : null;
        return {
          readingWidth: String(readingWidth || "").trim(),
          toolbarHeight,
          stickyNav,
          sidebarHeight: sidebarRect.height,
          sidebarWidth: sidebarRect.width,
          viewportHeight: window.innerHeight,
          navTop: navRect ? navRect.top : null,
          pageWidth: pageRect ? pageRect.width : null,
          bodyScrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          tocRadius: tocStyle ? tocStyle.borderRadius : null,
          tocBg: tocStyle ? tocStyle.backgroundColor : null,
          allBtnWidth: allBtnStyle ? parseFloat(allBtnStyle.width) : null,
          allBtnRadius: allBtnStyle ? allBtnStyle.borderRadius : null,
          allBtnBorder: allBtnStyle ? allBtnStyle.borderColor : null,
          currentBg: currentStyle ? currentStyle.backgroundColor : null,
          currentWeight: currentStyle ? currentStyle.fontWeight : null
        };
      });

      assert.equal(layout.readingWidth, "70ch");
      assert.equal(layout.toolbarHeight, 0);
      assert.ok(layout.stickyNav > 0);
      assert.ok(
        Math.abs(layout.sidebarHeight - layout.viewportHeight) <= 2,
        "sidebar should span viewport height"
      );
      assert.ok(layout.navTop != null && layout.navTop >= -1);
      assert.ok(layout.bodyScrollWidth <= layout.clientWidth + 1);
      assert.ok(layout.pageWidth > 200);
      assert.ok(layout.allBtnWidth >= 34 && layout.allBtnWidth <= 44);
      assert.equal(layout.tocRadius, layout.allBtnRadius);
      assert.match(String(layout.currentBg), /rgb\(219,\s*234,\s*254\)/);
      assert.match(String(layout.tocBg), /rgb\(219,\s*234,\s*254\)/);

      await page.screenshot({
        path: path.join(EVIDENCE_DIR, "01-desktop-expanded.png"),
        fullPage: false
      });

      await page.locator("#lj-shell-sidebar-toggle").click();
      await page.waitForFunction(() =>
        document.querySelector(".lj-shell").classList.contains("lj-shell--sidebar-collapsed")
      );
      assert.equal(await page.locator("#lj-shell-sidebar-toggle").isVisible(), true);
      assert.equal(
        await page.locator("#lj-shell-sidebar-toggle").getAttribute("aria-label"),
        "Show journey contents"
      );
      const collapsedRail = await page.evaluate(() => {
        const sidebar = document.getElementById("lj-shell-sidebar");
        const panel = document.getElementById("lj-shell-toc-panel");
        const brand = document.querySelector(".lj-shell__brand");
        const rect = sidebar.getBoundingClientRect();
        const toggle = document.getElementById("lj-shell-sidebar-toggle").getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          viewportHeight: window.innerHeight,
          panelHidden: panel ? panel.hasAttribute("hidden") : true,
          brandHidden: brand ? brand.hasAttribute("hidden") || brand.getAttribute("aria-hidden") === "true" : true,
          toggleTop: toggle.top,
          toggleLeft: toggle.left,
          bodyScrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth
        };
      });
      assert.ok(collapsedRail.width >= 50 && collapsedRail.width <= 64);
      assert.ok(Math.abs(collapsedRail.height - collapsedRail.viewportHeight) <= 2);
      assert.equal(collapsedRail.panelHidden, true);
      assert.equal(collapsedRail.brandHidden, true);
      assert.ok(collapsedRail.toggleTop < 40);
      assert.ok(collapsedRail.bodyScrollWidth <= collapsedRail.clientWidth + 1);
      await page.screenshot({
        path: path.join(EVIDENCE_DIR, "02-desktop-collapsed.png"),
        fullPage: false
      });

      await page.locator("#lj-shell-sidebar-toggle").click();
      await page.waitForFunction(
        () => !document.querySelector(".lj-shell").classList.contains("lj-shell--sidebar-collapsed")
      );

      await page.locator("#lj-shell-sidebar-toggle").focus();
      await page.keyboard.press("Tab");
      const keyboardFocus = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return null;
        const style = getComputedStyle(el);
        return {
          id: el.id,
          className: el.className,
          outlineStyle: style.outlineStyle,
          outlineWidth: style.outlineWidth
        };
      });
      assert.ok(keyboardFocus);
      assert.notEqual(keyboardFocus.outlineStyle, "none");

      await page.locator("#ws-m2").fill("M2 draft persists");
      await page.locator("#ws-m2").blur();
      await page.waitForTimeout(500);
      await page.locator('[data-lj-nav-id="c2"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c2");
      await page.locator('[data-lj-nav-id="c1"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c1");
      assert.equal(await page.locator("#ws-m2").inputValue(), "M2 draft persists");

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
      const narrowRail = await page.evaluate(
        () => document.getElementById("lj-shell-sidebar").getBoundingClientRect().width
      );
      assert.ok(narrowRail >= 50 && narrowRail <= 64);
      await page.locator("#lj-shell-sidebar-toggle").click();
      await page.waitForFunction(
        () => !document.querySelector(".lj-shell").classList.contains("lj-shell--sidebar-collapsed")
      );
      await page.locator('[data-lj-nav-id="c1"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c1");
      const narrow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        readingWidth: getComputedStyle(document.documentElement)
          .getPropertyValue("--learner-reading-width")
          .trim()
      }));
      assert.ok(narrow.scrollWidth <= narrow.clientWidth + 1);
      assert.equal(narrow.readingWidth, "70ch");
      await page.screenshot({
        path: path.join(EVIDENCE_DIR, "03-narrow-screen.png"),
        fullPage: false
      });

      await page.setViewportSize({ width: 1280, height: 800 });
      await page.evaluate(() => {
        sessionStorage.setItem("prism:lj-shell:sidebar-state", "expanded");
        if (window.__PRISM_LJ_SHELL_LAYOUT__) {
          window.__PRISM_LJ_SHELL_LAYOUT__.setSidebarCollapsed(false);
          window.__PRISM_LJ_SHELL_LAYOUT__.sync();
        }
        document.documentElement.style.zoom = "2";
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
      const zoom200 = await page.evaluate(() => {
        const nav = document.querySelector(".util-journey-nav--sequential");
        const navRect = nav ? nav.getBoundingClientRect() : null;
        return {
          navTop: navRect ? navRect.top : null,
          toolbarHeight: parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue("--lj-shell-toolbar-height")
          ),
          readingWidth: getComputedStyle(document.documentElement)
            .getPropertyValue("--learner-reading-width")
            .trim(),
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth
        };
      });
      assert.equal(zoom200.toolbarHeight, 0);
      assert.equal(zoom200.readingWidth, "70ch");
      assert.ok(zoom200.navTop != null && zoom200.navTop >= -2);
      assert.ok(zoom200.scrollWidth <= zoom200.clientWidth + 2);
      await page.screenshot({
        path: path.join(EVIDENCE_DIR, "04-zoom-200.png"),
        fullPage: false
      });

      await page.evaluate(() => {
        document.documentElement.style.zoom = "4";
      });
      await page.waitForTimeout(100);
      const zoom400 = await page.evaluate(() => {
        const nav = document.querySelector(".util-journey-nav--sequential");
        const navRect = nav ? nav.getBoundingClientRect() : null;
        return {
          navTop: navRect ? navRect.top : null,
          toolbarHeight: parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue("--lj-shell-toolbar-height")
          ),
          readingWidth: getComputedStyle(document.documentElement)
            .getPropertyValue("--learner-reading-width")
            .trim()
        };
      });
      assert.equal(zoom400.toolbarHeight, 0);
      assert.equal(zoom400.readingWidth, "70ch");
      assert.ok(zoom400.navTop != null);
      await page.screenshot({
        path: path.join(EVIDENCE_DIR, "05-zoom-400.png"),
        fullPage: false
      });

      await page.evaluate(() => {
        document.documentElement.style.zoom = "1";
      });
      await page.locator("#lj-shell-sidebar-toggle").focus();
      await page.keyboard.press("Escape");
      await page.waitForFunction(() =>
        document.querySelector(".lj-shell").classList.contains("lj-shell--sidebar-collapsed")
      );
      assert.equal(
        await page.evaluate(() => document.activeElement && document.activeElement.id),
        "lj-shell-sidebar-toggle"
      );
    } finally {
      await browser.close();
      staticServer.server.close();
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
);
