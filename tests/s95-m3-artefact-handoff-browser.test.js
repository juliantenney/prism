/**
 * Sprint 95 M3 — browser verification of C5 → C6 artefact handoff in the unified shell.
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
    title: src.title || "Assessment stop",
    activities: [],
    metadata: {
      workflow_id: src.workflowId || "wf",
      page_id: src.pageId || "page"
    },
    assessment_evidence: {
      purpose: {
        role: "R1",
        visibility_claim: "Artefact handoff browser.",
        stop_rationale: "A short formative stop.",
        forward_intent: "Carry the judgement forward."
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
            prompt: "Write your independent judgement.",
            response_workspace: { intention: "Independent judgement" }
          },
          formative_return: {
            materials: [{ material_id: "look", body: "Look again." }],
            revision: { offered: true, prompt: "Name one change." },
            forward_orientation: "Carry the writing forward."
          }
        }
      ]
    }
  };
}

function artefactContract() {
  return {
    produces: [
      {
        artefactId: "c5.independent_judgement",
        commissionId: "c5",
        workspaceId: "assessment-constructed-judgement",
        label: "Independent judgement"
      }
    ],
    references: [
      {
        artefactId: "c5.independent_judgement",
        commissionId: "c6",
        usage: "reference",
        label: "Your earlier independent judgement",
        missingMessage:
          "Your independent judgement is not available yet. Complete that experience first, or continue with the activities below.",
        standaloneFallback:
          "If you are working outside the journey, keep a copy of your judgement yourself."
      }
    ]
  };
}

function buildJourney() {
  return ljDesign.buildLearningJourneyDesignPageFixture({
    title: "C5 to C6 artefact demonstrator",
    sections: [
      {
        section_id: "journey_intro",
        title: "About",
        order: 1,
        exposition: "Independent judgement then reflection."
      },
      {
        section_id: "exp_5",
        title: "Independent judgement",
        order: 2,
        exposition: "Write first."
      },
      {
        section_id: "exp_6",
        title: "Reflect on your judgement",
        order: 3,
        exposition: "Then reflect."
      }
    ],
    commissions: [
      {
        commission_id: "c5",
        section_id: "exp_5",
        order: 1,
        title: "Independent judgement",
        product_id: "assessment_pack",
        status: "supported",
        specification_text: "C5"
      },
      {
        commission_id: "c6",
        section_id: "exp_6",
        order: 2,
        title: "Reflect on your judgement",
        product_id: "assessment_pack",
        status: "supported",
        specification_text: "C6"
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
  "S95-T-009 browser: C5 write → C6 read-only → revise → update; missing then present; reload",
  { skip: process.env.PRISM_SKIP_BROWSER_E2E === "1" },
  async (t) => {
    const playwright = loadPlaywright();
    if (!playwright || !playwright.chromium) {
      t.skip("playwright is unavailable");
      return;
    }

    const journey = buildJourney();
    assert.equal(journey.ok, true);
    const pageC5 = assessmentPage({
      title: "Independent judgement",
      workflowId: "wf-m3-c5",
      pageId: "page-m3-c5"
    });
    const pageC6 = assessmentPage({
      title: "Reflect on your judgement",
      workflowId: "wf-m3-c6",
      pageId: "page-m3-c6"
    });
    const packC5 = learnerPackage.buildLearnerPackage({
      html: renderLearnerPageHtml(pageC5).html,
      title: pageC5.title
    });
    const packC6 = learnerPackage.buildLearnerPackage({
      html: renderLearnerPageHtml(pageC6).html,
      title: pageC6.title
    });
    assert.equal(packC5.ok, true);
    assert.equal(packC6.ok, true);

    const assembled = ljPackage.assembleLearningJourneyUnifiedShellPackage({
      page: journey.page,
      artefactContract: artefactContract(),
      constituents: [
        {
          commissionId: "c5",
          title: "Independent judgement",
          sourcePage: pageC5,
          learnerPackage: packC5.package
        },
        {
          commissionId: "c6",
          title: "Reflect on your judgement",
          sourcePage: pageC6,
          learnerPackage: packC6.package
        }
      ],
      fflate
    });
    assert.equal(assembled.ok, true, assembled.error && assembled.error.message);

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "prism-s95-m3-"));
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
          typeof window.PRISM_LEARNER_RENDERER_VNEXT.injectArtefactReferences === "function" &&
          window.__PRISM_LJ_SHELL__ &&
          window.__PRISM_LJ_SHELL__.currentId === "overview",
        { timeout: 30000 }
      );

      await page.locator('[data-lj-nav-id="c5"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c5", {
        timeout: 15000
      });

      // Missing reference before C5 has a saved response.
      await page.locator('[data-lj-nav-id="c6"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c6");
      const missing = await page.locator('[data-lj-artefact-status="missing"]').textContent();
      assert.match(String(missing || ""), /not available yet/i);
      assert.equal(await page.locator('[data-lj-artefact-status="resolved"]').count(), 0);
      // Consumer remains usable.
      assert.ok((await page.locator("#lj-shell-main textarea").count()) >= 1);

      await page.locator('[data-lj-nav-id="c5"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c5");
      const c5Textarea = page.locator("#lj-shell-main textarea").first();
      await c5Textarea.fill("Opening hours alone do not establish causation.");
      await c5Textarea.blur();
      await page.waitForTimeout(500);

      await page.locator('[data-lj-nav-id="c6"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c6");
      const resolved = page.locator('[data-lj-artefact-status="resolved"]');
      await resolved.waitFor({ timeout: 10000 });
      const refText = await page.locator(".lj-artefact-ref__text").textContent();
      assert.match(String(refText || ""), /Opening hours alone do not establish causation/);
      assert.match(
        String(await page.locator(".lj-artefact-ref__note").textContent()),
        /Read-only/i
      );
      // Reference is not editable.
      assert.equal(await page.locator('.lj-artefact-ref textarea, .lj-artefact-ref input').count(), 0);

      // Revise producer and confirm live update.
      await page.locator('[data-lj-nav-id="c5"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c5");
      await page.locator("#lj-shell-main textarea").first().fill(
        "Revised: study spaces need evidence of demand before any claim of causation."
      );
      await page.locator("#lj-shell-main textarea").first().blur();
      await page.waitForTimeout(500);
      await page.locator('[data-lj-nav-id="c6"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c6");
      await page.waitForFunction(
        () =>
          /Revised: study spaces need evidence/i.test(
            (document.querySelector(".lj-artefact-ref__text") || {}).textContent || ""
          ),
        { timeout: 10000 }
      );

      // Reload keeps the updated reference.
      await page.reload({ waitUntil: "domcontentloaded" });
      await page.waitForFunction(
        () => window.__PRISM_LJ_SHELL__ && window.__PRISM_LJ_SHELL__.currentId === "c6",
        { timeout: 30000 }
      );
      await page.waitForFunction(
        () =>
          /Revised: study spaces need evidence/i.test(
            (document.querySelector(".lj-artefact-ref__text") || {}).textContent || ""
          ),
        { timeout: 10000 }
      );

      const a11y = await page.evaluate(() => {
        const region = document.querySelector(".lj-artefact-ref__body");
        const label = document.querySelector(".lj-artefact-ref__label");
        return {
          mains: document.querySelectorAll("main").length,
          label: label ? label.textContent : "",
          ariaLabel: region ? region.getAttribute("aria-label") : "",
          tabindex: region ? region.getAttribute("tabindex") : null
        };
      });
      assert.equal(a11y.mains, 1);
      assert.match(a11y.label, /earlier independent judgement/i);
      assert.ok(a11y.ariaLabel);
      assert.equal(a11y.tabindex, "0");
    } finally {
      await browser.close();
      staticServer.server.close();
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
);
