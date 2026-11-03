/**
 * Sprint 96 M3 — browser: unified C5/C6 guidance vs automatic artefact handoff.
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
  "m3-contextual-guidance"
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

function buildUnifiedFromStandalone() {
  const commissions = ["c5", "c6"];
  const journey = ljDesign.buildLearningJourneyDesignPageFixture({
    title: "Deciding Under Uncertainty M3",
    sections: [
      { section_id: "journey_intro", title: "About", order: 1, exposition: "Overview" },
      { section_id: "s_c5", title: "C5", order: 2, exposition: "c5" },
      { section_id: "s_c6", title: "C6", order: 3, exposition: "c6" }
    ],
    commissions: [
      {
        commission_id: "c5",
        section_id: "s_c5",
        order: 1,
        title: "Independent Judgement",
        product_id: "assessment_pack",
        status: "supported",
        specification_text: "c5",
        dependencies: ""
      },
      {
        commission_id: "c6",
        section_id: "s_c6",
        order: 2,
        title: "Self Evaluation",
        product_id: "assessment_pack",
        status: "supported",
        specification_text: "c6",
        dependencies: "Uses learner work from c5"
      }
    ]
  });
  assert.equal(journey.ok, true);

  return ljPackage.assembleLearningJourneyUnifiedShellPackage({
    page: journey.page,
    constituents: commissions.map((id) => ({
      commissionId: id,
      title: id.toUpperCase(),
      productId: "assessment_pack",
      learnerPackage: {
        html: fs.readFileSync(path.join(STANDALONE_ROOT, id, "index.html"), "utf8"),
        assets: collectAssets(id)
      }
    })),
    artefactContract: {
      produces: [
        {
          artefactId: "c5.E1",
          commissionId: "c5",
          workspaceId: "assessment-constructed-E1",
          label: "Traffic-management judgement"
        }
      ],
      references: [
        {
          artefactId: "c5.E1",
          commissionId: "c6",
          usage: "reference",
          label: "Your earlier response",
          missingMessage:
            "Your earlier response is not available yet. Complete that experience first, or continue with the activities below.",
          standaloneFallback:
            "If you are working outside the journey, keep a copy of your earlier response yourself."
        }
      ]
    },
    fflate,
    runtimeScript: fs.readFileSync(
      path.join(__dirname, "..", "lib", "learner-renderer-vnext-browser.js"),
      "utf8"
    )
  });
}

test(
  "M3 browser: unified C5/C6 neutralize transfer prose; artefact shows when present",
  {
    skip:
      process.env.PRISM_SKIP_BROWSER_E2E === "1" ||
      !fs.existsSync(path.join(STANDALONE_ROOT, "c5", "index.html"))
  },
  async (t) => {
    const playwright = loadPlaywright();
    if (!playwright || !playwright.chromium) {
      t.skip("playwright is unavailable");
      return;
    }

    const assembled = buildUnifiedFromStandalone();
    assert.equal(assembled.ok, true, assembled.error && assembled.error.message);

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "prism-s96-m3-"));
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

    try {
      const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      await context.addInitScript(() => {
        try {
          sessionStorage.setItem("prism:lj-shell:sidebar-state", "expanded");
          // Draft keys are filled after mount using the live pageKey.
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
        await page.waitForTimeout(400);
      }

      await open("c5");
      const c5 = await page.evaluate(() => {
        const main = document.querySelector("#lj-shell-main");
        const text = main ? main.textContent || "" : "";
        return {
          hasSaveCopy: /Save or copy your completed response/i.test(text),
          hasTransfer: /will not automatically transfer/i.test(text),
          hasEducational: /traffic-management judgement|self-evaluation/i.test(text),
          readingWidth: getComputedStyle(document.documentElement)
            .getPropertyValue("--learner-reading-width")
            .trim()
        };
      });
      assert.equal(c5.hasSaveCopy, false);
      assert.equal(c5.hasTransfer, false);
      assert.equal(c5.hasEducational, true);
      assert.equal(c5.readingWidth, "70ch");
      await page.screenshot({
        path: path.join(EVIDENCE_DIR, "01-unified-c5-guidance.png"),
        fullPage: false
      });

      // Ensure a draft exists under the page key the mounted C5 resource uses.
      await page.evaluate(() => {
        const root = document.querySelector('#lj-shell-main [data-persistence-page-key]');
        const pageKey =
          (root && root.getAttribute("data-persistence-page-key")) ||
          (window.__PRISM_LJ_SHELL__ &&
            window.__PRISM_LJ_SHELL__.handle &&
            window.__PRISM_LJ_SHELL__.handle.pageKey) ||
          "";
        if (!pageKey) return;
        const draft = {
          schemaVersion: 1,
          pageKey: pageKey,
          savedAt: new Date().toISOString(),
          workspaces: {
            "assessment-constructed-E1": {
              kind: "text_entry",
              value: { text: "M3 fixture judgement for C6 reference." }
            }
          }
        };
        const prefix = "learner-renderer-vnext:draft:";
        try {
          localStorage.setItem(prefix + pageKey, JSON.stringify(draft));
        } catch (_e) {}
      });

      await open("c6");
      const c6 = await page.evaluate(() => {
        const main = document.querySelector("#lj-shell-main");
        const text = main ? main.textContent || "" : "";
        const ref = main && main.querySelector("[data-lj-artefact-ref]");
        return {
          hasTransfer: /not transferred automatically|does not automatically transfer/i.test(text),
          hasRetrieveSaved: /retrieve your saved response/i.test(text),
          hasEducational: /evaluate|defensib|judgement|evidence/i.test(text),
          artefactStatus: ref ? ref.getAttribute("data-lj-artefact-status") : null,
          artefactText: ref ? ref.textContent || "" : ""
        };
      });
      assert.equal(c6.hasTransfer, false);
      assert.equal(c6.hasRetrieveSaved, false);
      assert.equal(c6.hasEducational, true);
      assert.ok(
        c6.artefactStatus === "resolved" || c6.artefactStatus === "missing",
        "artefact host should render"
      );
      if (c6.artefactStatus === "resolved") {
        assert.match(c6.artefactText, /M3 fixture judgement/);
        assert.match(c6.artefactText, /Available here for reference|Read-only/i);
      } else {
        assert.match(c6.artefactText, /not available yet/i);
      }
      await page.screenshot({
        path: path.join(EVIDENCE_DIR, "02-unified-c6-guidance.png"),
        fullPage: false
      });
    } finally {
      await browser.close();
      staticServer.server.close();
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
);
