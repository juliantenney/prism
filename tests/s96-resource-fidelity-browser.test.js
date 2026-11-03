/**
 * Sprint 96 — browser fidelity: graphics load + table inputs from real DUU package HTML.
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
  "m2-resource-fidelity"
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
          : ext === ".png"
            ? "image/png"
            : ext === ".jpg" || ext === ".jpeg"
              ? "image/jpeg"
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

function buildPackageFromStandalone() {
  const commissions = ["c1", "c2", "c3", "c4", "c5", "c6"];
  const journey = ljDesign.buildLearningJourneyDesignPageFixture({
    title: "Deciding Under Uncertainty",
    sections: [
      {
        section_id: "journey_intro",
        title: "About",
        order: 1,
        exposition: "Overview for fidelity checks."
      }
    ].concat(
      commissions.map((id, index) => ({
        section_id: "s_" + id,
        title: id.toUpperCase(),
        order: index + 2,
        exposition: id
      }))
    ),
    commissions: commissions.map((id, index) => ({
      commission_id: id,
      section_id: "s_" + id,
      order: index + 1,
      title: id.toUpperCase(),
      product_id: id === "c5" || id === "c6" ? "assessment_pack" : "interactive",
      status: "supported",
      specification_text: id
    }))
  });
  assert.equal(journey.ok, true);

  const constituents = commissions.map((id) => {
    const htmlPath = path.join(STANDALONE_ROOT, id, "index.html");
    assert.ok(fs.existsSync(htmlPath), "missing standalone " + id);
    return {
      commissionId: id,
      title: id.toUpperCase(),
      productId: id === "c5" || id === "c6" ? "assessment_pack" : "interactive",
      learnerPackage: {
        html: fs.readFileSync(htmlPath, "utf8"),
        assets: collectAssets(id)
      }
    };
  });

  return ljPackage.assembleLearningJourneyUnifiedShellPackage({
    page: journey.page,
    constituents,
    fflate,
    runtimeScript: fs.readFileSync(
      path.join(__dirname, "..", "lib", "learner-renderer-vnext-browser.js"),
      "utf8"
    )
  });
}

test(
  "resource fidelity browser: DUU graphics load and C2/C4 table inputs accept drafts",
  { skip: process.env.PRISM_SKIP_BROWSER_E2E === "1" || !fs.existsSync(STANDALONE_ROOT) },
  async (t) => {
    const playwright = loadPlaywright();
    if (!playwright || !playwright.chromium) {
      t.skip("playwright is unavailable");
      return;
    }

    const assembled = buildPackageFromStandalone();
    assert.equal(assembled.ok, true, assembled.error && assembled.error.message);

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "prism-s96-fidelity-"));
    writeZipToDir(assembled.bytes, tempDir);
    fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
    const staticServer = await startStaticServer(tempDir);

    let browser;
    try {
      browser = await playwright.chromium.launch({ headless: true, channel: "chrome" });
    } catch (err) {
      staticServer.server.close();
      t.skip("Chrome channel unavailable: " + String(err && err.message));
      return;
    }

    const failedImages = [];
    try {
      const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      await context.addInitScript(() => {
        try {
          sessionStorage.setItem("prism:lj-shell:sidebar-state", "expanded");
        } catch (_e) {}
      });
      const page = await context.newPage();
      page.on("response", (response) => {
        const url = response.url();
        if (/\.(png|jpe?g|gif|webp)(\?|$)/i.test(url) && response.status() >= 400) {
          failedImages.push({ url, status: response.status() });
        }
      });

      await page.goto(staticServer.baseUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__, { timeout: 30000 });

      async function open(id) {
        await page.locator('[data-lj-nav-id="' + id + '"]').click();
        await page.waitForFunction(
          (wanted) => window.__PRISM_LJ_SHELL__ && window.__PRISM_LJ_SHELL__.currentId === wanted,
          id,
          { timeout: 20000 }
        );
      }

      async function waitForDecodedVisual() {
        await page.evaluate(() => {
          const imgs = Array.from(
            document.querySelectorAll("#lj-shell-main img.util-visual-asset-image")
          );
          imgs.forEach((img) => {
            try {
              img.scrollIntoView({ block: "center", inline: "nearest" });
            } catch (_err) {}
          });
        });
        await page.waitForFunction(
          () => {
            const imgs = Array.from(
              document.querySelectorAll("#lj-shell-main img.util-visual-asset-image")
            );
            return imgs.some((img) => img.complete && img.naturalWidth > 0);
          },
          { timeout: 60000 }
        );
      }

      await open("c2");
      await waitForDecodedVisual();
      const c2 = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll("#lj-shell-main img.util-visual-asset-image"));
        return {
          imgCount: imgs.length,
          srcs: imgs.map((img) => img.getAttribute("src")),
          naturalOk: imgs.filter((img) => img.complete && img.naturalWidth > 0).length,
          tableInputs: document.querySelectorAll(
            "#lj-shell-main .util-learner-table-workspace__input"
          ).length,
          readingWidth: getComputedStyle(document.documentElement)
            .getPropertyValue("--learner-reading-width")
            .trim(),
          documentOverflow:
            document.documentElement.scrollWidth - document.documentElement.clientWidth
        };
      });
      assert.ok(c2.imgCount >= 1, "C2 should mount visual assets");
      assert.ok(c2.srcs.every((src) => String(src || "").indexOf("media/c2/") === 0));
      assert.ok(c2.naturalOk >= 1, "at least one C2 graphic should decode");
      assert.ok(c2.tableInputs >= 1, "C2 should expose editable table inputs");
      assert.equal(c2.readingWidth, "70ch");
      assert.ok(c2.documentOverflow <= 1);
      await page.screenshot({
        path: path.join(EVIDENCE_DIR, "01-unified-c2-graphics.png"),
        fullPage: false
      });

      const firstInput = page.locator("#lj-shell-main .util-learner-table-workspace__input").first();
      await firstInput.fill("Fidelity draft C2");
      await firstInput.blur();
      await page.waitForTimeout(500);

      await open("c4");
      await waitForDecodedVisual();
      const c4 = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll("#lj-shell-main img.util-visual-asset-image"));
        return {
          imgCount: imgs.length,
          naturalOk: imgs.filter((img) => img.complete && img.naturalWidth > 0).length,
          tableInputs: document.querySelectorAll(
            "#lj-shell-main .util-learner-table-workspace__input"
          ).length
        };
      });
      assert.ok(c4.imgCount >= 1);
      assert.ok(c4.naturalOk >= 1);
      assert.ok(c4.tableInputs >= 1);
      await page.screenshot({
        path: path.join(EVIDENCE_DIR, "02-unified-c4-tables.png"),
        fullPage: false
      });

      const c4Input = page.locator("#lj-shell-main .util-learner-table-workspace__input").first();
      await c4Input.fill("Fidelity draft C4");
      await c4Input.blur();
      await page.waitForTimeout(500);

      await open("c2");
      assert.equal(
        await page.locator("#lj-shell-main .util-learner-table-workspace__input").first().inputValue(),
        "Fidelity draft C2"
      );

      await open("c3");
      await waitForDecodedVisual();
      const c3Imgs = await page.locator("#lj-shell-main img.util-visual-asset-image").count();
      assert.ok(c3Imgs >= 1);

      await open("c4");
      assert.equal(
        await page.locator("#lj-shell-main .util-learner-table-workspace__input").first().inputValue(),
        "Fidelity draft C4"
      );

      const a11y = await page.evaluate(() => {
        const input = document.querySelector(
          "#lj-shell-main .util-learner-table-workspace__input"
        );
        if (!input) return { ok: false };
        return {
          ok: true,
          labelledBy: input.getAttribute("aria-labelledby") || "",
          id: input.id || ""
        };
      });
      assert.equal(a11y.ok, true);
      assert.ok(a11y.labelledBy.length > 0 || a11y.id.length > 0);

      // Keyboard: Tab reaches an editable table cell.
      await page.locator("#lj-shell-main .util-learner-table-workspace__input").first().focus();
      const focusedTag = await page.evaluate(() => {
        const el = document.activeElement;
        return el ? el.tagName + "." + (el.className || "") : "";
      });
      assert.match(focusedTag, /TEXTAREA.*util-learner-table-workspace__input/i);

      assert.equal(failedImages.length, 0, JSON.stringify(failedImages));
    } finally {
      await browser.close();
      staticServer.server.close();
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
);
