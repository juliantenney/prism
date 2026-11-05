/**
 * Sprint 96 M5.3 — skip-to-main link and named main landmark (unified shell).
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
const unifiedShell = require("../lib/learning-journey-unified-shell.js");

const PLAYWRIGHT_CANDIDATES = [
  path.join(__dirname, "fixtures", "sequential-nav-qa", "node_modules", "playwright"),
  "playwright"
];

const runtimeScript = fs.readFileSync(
  path.join(__dirname, "..", "lib", "learner-renderer-vnext-browser.js"),
  "utf8"
);

function loadPlaywright() {
  for (const candidate of PLAYWRIGHT_CANDIDATES) {
    try {
      return require(candidate);
    } catch (_err) {}
  }
  return null;
}

function buildJourney() {
  return ljDesign.buildLearningJourneyDesignPageFixture({
    title: "S96 M5.3 a11y journey",
    sections: [
      {
        section_id: "journey_intro",
        title: "About",
        order: 1,
        exposition: "Overview for skip-link checks."
      },
      { section_id: "s1", title: "Expository stop", order: 2, exposition: "Static." },
      { section_id: "s2", title: "Interactive stop", order: 3, exposition: "Controls." }
    ],
    commissions: [
      {
        commission_id: "c1",
        section_id: "s1",
        order: 1,
        title: "Expository stop",
        product_id: "expository",
        status: "supported",
        specification_text: "A"
      },
      {
        commission_id: "c2",
        section_id: "s2",
        order: 2,
        title: "Interactive stop",
        product_id: "interactive",
        status: "supported",
        specification_text: "B"
      }
    ]
  });
}

function expositoryHtml() {
  return (
    '<article class="util-learner-renderer-vnext" data-renderer="vnext" role="region" ' +
    'aria-label="Expository stop" data-persistence-page-key="v1::s96-m53::c1">' +
    '<h2 data-lj-resource-title="true" tabindex="-1">Expository stop</h2>' +
    "<p>Static prose for the learning stop. No interactive controls here.</p></article>"
  );
}

function interactiveHtml() {
  return (
    '<article class="util-learner-renderer-vnext" data-renderer="vnext" role="region" ' +
    'aria-label="Interactive stop" data-persistence-page-key="v1::s96-m53::c2">' +
    '<h2 data-lj-resource-title="true" tabindex="-1">Interactive stop</h2>' +
    '<nav class="util-journey-nav util-journey-nav--sequential" aria-label="Learning sections">' +
    '<button type="button" class="util-journey-all-btn" aria-expanded="false">All sections</button>' +
    "</nav>" +
    '<label for="m53-notes">Notes</label>' +
    '<textarea id="m53-notes" aria-label="Notes"></textarea></article>'
  );
}

function writeZipToDir(bytes, rootDir) {
  const files = fflate.unzipSync(bytes);
  Object.keys(files).forEach((entry) => {
    const outPath = path.join(rootDir, entry);
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

test("M5.3 unit: skip link precedes shell chrome; main is named Learning content", () => {
  const journey = buildJourney();
  assert.equal(journey.ok, true);
  const shell = unifiedShell.buildLearningJourneyUnifiedShellHtml(journey.page, [
    { commissionId: "c1", title: "Expository stop", html: expositoryHtml() },
    { commissionId: "c2", title: "Interactive stop", html: interactiveHtml() }
  ]);
  assert.equal(shell.ok, true);

  const skipAt = shell.html.indexOf('data-lj-skip-main="true"');
  const sidebarAt = shell.html.indexOf('id="lj-shell-sidebar"');
  const toggleAt = shell.html.indexOf('id="lj-shell-sidebar-toggle"');
  assert.ok(skipAt >= 0, "skip link missing");
  assert.ok(sidebarAt > skipAt, "skip link must precede sidebar");
  assert.ok(toggleAt > skipAt, "skip link must precede sidebar toggle");
  assert.match(
    shell.html,
    /<a class="lj-shell__skip-link" href="#lj-shell-main" data-lj-skip-main="true">Skip to main content<\/a>/
  );
  assert.match(
    shell.html,
    /<main id="lj-shell-main"[^>]*aria-label="Learning content"[^>]*tabindex="-1"/
  );
  assert.match(shell.html, /activateSkipToMain/);
  assert.match(shell.html, /\.lj-shell__skip-link:focus/);
  // Existing focus / announce machinery preserved.
  assert.match(shell.html, /function focusResource/);
  assert.match(shell.html, /Now showing:/);
  assert.match(shell.html, /skipFocus:true/);
});

test(
  "M5.3 browser: skip link focuses resource title; named main; TOC and controls remain usable",
  { skip: process.env.PRISM_SKIP_BROWSER_E2E === "1" },
  async (t) => {
    const playwright = loadPlaywright();
    if (!playwright || !playwright.chromium) {
      t.skip("playwright is unavailable");
      return;
    }

    const journey = buildJourney();
    assert.equal(journey.ok, true);
    const assembled = ljPackage.assembleLearningJourneyUnifiedShellPackage({
      page: journey.page,
      constituents: [
        {
          commissionId: "c1",
          title: "Expository stop",
          productId: "expository",
          fragmentHtml: expositoryHtml()
        },
        {
          commissionId: "c2",
          title: "Interactive stop",
          productId: "interactive",
          fragmentHtml: interactiveHtml()
        }
      ],
      fflate,
      runtimeScript
    });
    assert.equal(assembled.ok, true, assembled.error && assembled.error.message);

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "prism-s96-m53-"));
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
      const page = await context.newPage();
      await page.goto(staticServer.baseUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForFunction(
        () => window.__PRISM_LJ_SHELL__ && window.__PRISM_LJ_SHELL__.currentId,
        { timeout: 30000 }
      );

      const mainLabel = await page.getAttribute("#lj-shell-main", "aria-label");
      assert.equal(mainLabel, "Learning content");

      const skip = page.locator('[data-lj-skip-main="true"]');
      assert.equal(await skip.count(), 1);
      await skip.focus();
      await page.keyboard.press("Enter");
      await page.waitForFunction(() => {
        const active = document.activeElement;
        return !!(
          active &&
          (active.getAttribute("data-lj-resource-title") === "true" ||
            active.id === "lj-shell-main")
        );
      });

      // Resource transition still focuses title and keeps a single main.
      await page.locator('[data-lj-nav-id="c2"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c2");
      await page.waitForFunction(() => {
        const active = document.activeElement;
        return !!(active && active.getAttribute("data-lj-resource-title") === "true");
      });
      assert.equal(await page.locator("main#lj-shell-main").count(), 1);
      assert.ok(await page.locator("#m53-notes").count());
      await page.locator("#m53-notes").focus();
      assert.equal(
        await page.evaluate(() => document.activeElement && document.activeElement.id),
        "m53-notes"
      );

      // Sidebar toggle remains keyboard operable.
      await page.locator("#lj-shell-sidebar-toggle").focus();
      await page.keyboard.press("Enter");
      await page.waitForFunction(() =>
        document.querySelector(".lj-shell").classList.contains("lj-shell--sidebar-collapsed")
      );
    } finally {
      await browser.close();
      staticServer.server.close();
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
);
