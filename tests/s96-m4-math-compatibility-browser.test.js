/**
 * Sprint 96 M4 — offline browser acceptance for unified maths journey.
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
const learnerPackage = require("../lib/learner-package.js");

const PLAYWRIGHT_CANDIDATES = [
  path.join(__dirname, "fixtures", "sequential-nav-qa", "node_modules", "playwright"),
  "playwright"
];

const repoRoot = path.join(__dirname, "..");
const runtimeScript = fs.readFileSync(
  path.join(repoRoot, "lib", "learner-renderer-vnext-browser.js"),
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

function journeyPage() {
  return ljDesign.buildLearningJourneyDesignPageFixture({
    title: "S96 M4 maths browser fixture",
    sections: [
      {
        section_id: "journey_intro",
        title: "About",
        order: 1,
        exposition: "Technical maths compatibility fixture."
      },
      { section_id: "s1", title: "Display maths", order: 2, exposition: "Jax." },
      { section_id: "s2", title: "Math entry", order: 3, exposition: "Live." },
      { section_id: "s3", title: "Plain stop", order: 4, exposition: "None." }
    ],
    commissions: [
      {
        commission_id: "c1",
        section_id: "s1",
        order: 1,
        title: "Display maths",
        product_id: "expository",
        status: "supported",
        specification_text: "MathJax"
      },
      {
        commission_id: "c2",
        section_id: "s2",
        order: 2,
        title: "Math entry",
        product_id: "interactive",
        status: "supported",
        specification_text: "MathLive"
      },
      {
        commission_id: "c3",
        section_id: "s3",
        order: 3,
        title: "Plain stop",
        product_id: "expository",
        status: "supported",
        specification_text: "Plain"
      }
    ]
  });
}

function mathJaxFragment() {
  return (
    '<article class="util-learner-renderer-vnext" data-renderer="vnext" role="region" ' +
    'aria-label="Display maths" data-persistence-page-key="v1::s96-m4-browser::c1">' +
    '<h2 data-lj-resource-title="true">Display maths</h2>' +
    "<p>Identity \\(e^{i\\\\pi}+1=0\\) must typeset.</p>" +
    "<p>\\[a^2+b^2=c^2\\]</p></article>"
  );
}

function mathLiveFragment() {
  return (
    '<article class="util-learner-renderer-vnext" data-renderer="vnext" role="region" ' +
    'aria-label="Math entry" data-persistence-page-key="v1::s96-m4-browser::c2">' +
    '<h2 data-lj-resource-title="true">Math entry</h2>' +
    '<div class="util-learner-workspace util-learner-workspace--math-entry" data-workspace-kind="text_entry" ' +
    'data-workspace-id="math-ws-1" data-input-modality="math" data-math-entry="true" ' +
    'data-math-field-id="math-ws-1-field" data-math-label-id="math-ws-1-label">' +
    '<label id="math-ws-1-label" for="math-ws-1-field">Express the prior</label>' +
    '<div data-math-entry-mount class="util-math-entry__mount" hidden></div>' +
    '<textarea id="math-ws-1-field" class="util-learner-workspace__input util-learner-workspace__input--canonical"></textarea>' +
    "</div></article>"
  );
}

function plainFragment() {
  return (
    '<article class="util-learner-renderer-vnext" data-renderer="vnext" role="region" ' +
    'aria-label="Plain stop" data-persistence-page-key="v1::s96-m4-browser::c3">' +
    '<h2 data-lj-resource-title="true">Plain stop</h2>' +
    "<p>No mathematical requirements on this stop.</p></article>"
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
  if (/\.woff2?$/i.test(filePath)) return "font/woff2";
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

function buildMathsPackage() {
  const journey = journeyPage();
  assert.equal(journey.ok, true);
  const assembled = ljPackage.assembleLearningJourneyUnifiedShellPackage({
    page: journey.page,
    constituents: [
      {
        commissionId: "c1",
        title: "Display maths",
        productId: "expository",
        fragmentHtml: mathJaxFragment()
      },
      {
        commissionId: "c2",
        title: "Math entry",
        productId: "interactive",
        fragmentHtml: mathLiveFragment()
      },
      {
        commissionId: "c3",
        title: "Plain stop",
        productId: "expository",
        fragmentHtml: plainFragment()
      }
    ],
    fflate,
    runtimeScript
  });
  assert.equal(assembled.ok, true, assembled.error && assembled.error.message);
  assert.equal(assembled.mathRequirements.needsMathJax, true);
  assert.equal(assembled.mathRequirements.needsMathLive, true);
  return assembled;
}

test(
  "M4 browser: offline MathJax typeset, MathLive enhance, remount, reload, no CDN",
  { skip: process.env.PRISM_SKIP_BROWSER_E2E === "1" },
  async (t) => {
    const playwright = loadPlaywright();
    if (!playwright || !playwright.chromium) {
      t.skip("playwright is unavailable");
      return;
    }

    const assembled = buildMathsPackage();
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "prism-s96-m4-"));
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

    const DISTINCTIVE_TEX = String.raw`\frac{a}{b}+c`;
    const failedRequests = [];

    try {
      const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      await context.route("**/*", async (route) => {
        const url = route.request().url();
        if (/cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|unpkg\.com|jsdelivr\.net/i.test(url)) {
          failedRequests.push(url);
          await route.abort();
          return;
        }
        await route.continue();
      });

      const page = await context.newPage();
      page.on("requestfailed", (req) => {
        const url = req.url();
        if (/cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|unpkg\.com/i.test(url)) {
          failedRequests.push(url);
        }
      });

      await page.goto(staticServer.baseUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForFunction(
        () =>
          window.PRISM_LEARNER_RENDERER_VNEXT &&
          typeof window.PRISM_LEARNER_RENDERER_VNEXT.mountLearnerResource === "function" &&
          window.__PRISM_LJ_SHELL__ &&
          window.__PRISM_LJ_SHELL__.currentId,
        { timeout: 30000 }
      );

      // MathJax display resource
      await page.locator('[data-lj-nav-id="c1"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c1");
      await page.waitForFunction(
        () => document.querySelectorAll("mjx-container").length >= 1,
        { timeout: 20000 }
      );
      const rawDelimVisible = await page.evaluate(() => {
        const main = document.getElementById("lj-shell-main");
        const text = main ? main.textContent || "" : "";
        return /\\\(|\\\[/.test(text);
      });
      assert.equal(rawDelimVisible, false, "MathJax should consume TeX delimiters");

      // MathLive entry resource
      await page.locator('[data-lj-nav-id="c2"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c2");
      await page.waitForSelector("math-field.util-math-entry__field", { timeout: 15000 });
      assert.equal(await page.locator(".util-learner-workspace--math-enhanced").count(), 1);
      assert.equal(await page.locator(".util-learner-workspace--math-fallback").count(), 0);

      await page.evaluate((tex) => {
        const field = document.querySelector("math-field.util-math-entry__field");
        if (!field || typeof field.setValue !== "function") {
          throw new Error("math-field missing setValue");
        }
        field.setValue(tex);
        field.dispatchEvent(new Event("input", { bubbles: true }));
      }, DISTINCTIVE_TEX);
      await page.waitForTimeout(500);

      const savedOnce = await page.evaluate(() => {
        const ta = document.querySelector(
          "#lj-shell-main textarea.util-learner-workspace__input"
        );
        return ta ? ta.value : "";
      });
      assert.equal(savedOnce, DISTINCTIVE_TEX);

      // Switch away and return twice
      await page.locator('[data-lj-nav-id="c3"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c3");
      await page.locator('[data-lj-nav-id="c2"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c2");
      await page.waitForSelector("math-field.util-math-entry__field", { timeout: 15000 });
      assert.equal(
        await page.evaluate(() => {
          const ta = document.querySelector(
            "#lj-shell-main textarea.util-learner-workspace__input"
          );
          return ta ? ta.value : "";
        }),
        DISTINCTIVE_TEX
      );

      await page.locator('[data-lj-nav-id="c1"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c1");
      await page.waitForFunction(
        () => document.querySelectorAll("#lj-shell-main mjx-container").length >= 1,
        { timeout: 20000 }
      );
      await page.locator('[data-lj-nav-id="c2"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c2");
      await page.waitForSelector("math-field.util-math-entry__field", { timeout: 15000 });
      assert.equal(
        await page.evaluate(() => {
          const ta = document.querySelector(
            "#lj-shell-main textarea.util-learner-workspace__input"
          );
          return ta ? ta.value : "";
        }),
        DISTINCTIVE_TEX
      );

      // Reload persistence
      await page.reload({ waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForFunction(
        () => window.__PRISM_LJ_SHELL__ && window.__PRISM_LJ_SHELL__.currentId,
        { timeout: 30000 }
      );
      await page.locator('[data-lj-nav-id="c2"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c2");
      await page.waitForSelector("math-field.util-math-entry__field", { timeout: 15000 });
      assert.equal(
        await page.evaluate(() => {
          const ta = document.querySelector(
            "#lj-shell-main textarea.util-learner-workspace__input"
          );
          return ta ? ta.value : "";
        }),
        DISTINCTIVE_TEX
      );

      // Layout / nav smoke
      assert.equal(await page.locator("main#lj-shell-main").count(), 1);
      assert.ok((await page.locator("[data-lj-nav-id]").count()) >= 4);
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      }));
      assert.ok(
        overflow.scrollWidth <= overflow.clientWidth + 1,
        "no horizontal page overflow"
      );

      assert.equal(
        failedRequests.length,
        0,
        "CDN requests must not occur: " + failedRequests.join(", ")
      );

      // Standalone MathLive package parity (packaging only — offline assets present)
      const standaloneHtml =
        "<!DOCTYPE html><html><head>" +
        '<link rel="stylesheet" href="lib/mathlive/mathlive-fonts.css">' +
        '<script src="lib/mathlive/mathlive.min.js"></script>' +
        "</head><body>" +
        mathLiveFragment() +
        "</body></html>";
      const standalone = learnerPackage.buildLearnerPackage({
        html: standaloneHtml,
        title: "Standalone maths parity",
        repoRoot
      });
      assert.equal(standalone.ok, true, standalone.error && standalone.error.message);
      assert.ok(
        standalone.package.assets.some((a) => a.path === "lib/mathlive/mathlive.min.js")
      );
    } finally {
      await browser.close();
      staticServer.server.close();
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
);
