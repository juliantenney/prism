/**
 * Sprint 95 M4 — browser verification of multi-type unified shell journey.
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
const { buildOrderingWorkspaceModel } = require("../lib/learner-renderer-vnext/build-ordering-workspace-model");
const { renderOrderingWorkspace } = require("../lib/learner-renderer-vnext/render-ordering-workspace");

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
        visibility_claim: "M4 browser.",
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

function orderingFragmentHtml(pageKey) {
  const built = buildOrderingWorkspaceModel(
    {
      responsePartId: "A1::ordering::ordering",
      surfaceKind: "ordering",
      label: "Order the decision steps",
      prompt: "Use the move buttons.",
      ordering: {
        mode: "sequence",
        validationMode: "exact_order",
        expectedOrder: ["s1", "s2", "s3"],
        items: [
          { itemId: "s2", content: "Weigh trade-offs", accessibleLabel: "Weigh trade-offs" },
          { itemId: "s1", content: "Frame the decision", accessibleLabel: "Frame the decision" },
          { itemId: "s3", content: "Commit and monitor", accessibleLabel: "Commit and monitor" }
        ],
        initialItems: [
          { itemId: "s2", content: "Weigh trade-offs", accessibleLabel: "Weigh trade-offs" },
          { itemId: "s1", content: "Frame the decision", accessibleLabel: "Frame the decision" },
          { itemId: "s3", content: "Commit and monitor", accessibleLabel: "Commit and monitor" }
        ]
      }
    },
    { activityId: "A1" }
  );
  const body = renderOrderingWorkspace(built.workspace);
  return (
    '<article class="util-learner-renderer-vnext" data-renderer="vnext" role="region" ' +
    'aria-label="Ordering practice" data-persistence-page-key="' +
    pageKey +
    '"><h2 data-lj-resource-title="true">Opening interactive</h2>' +
    body +
    "</article>"
  );
}

function mathFragmentHtml(pageKey) {
  return (
    '<article class="util-learner-renderer-vnext" data-renderer="vnext" role="region" ' +
    'aria-label="Math practice" data-persistence-page-key="' +
    pageKey +
    '"><h2 data-lj-resource-title="true">Quantify uncertainty</h2>' +
    '<div class="util-learner-workspace util-learner-workspace--math-entry" data-workspace-kind="text_entry" ' +
    'data-workspace-id="math-ws-1" data-input-modality="math" data-math-entry="true" ' +
    'data-math-field-id="math-ws-1-field" data-math-label-id="math-ws-1-label">' +
    '<label id="math-ws-1-label" for="math-ws-1-field">Express the prior</label>' +
    '<div data-math-entry-mount class="util-math-entry__mount" hidden></div>' +
    '<textarea id="math-ws-1-field" class="util-learner-workspace__input util-learner-workspace__input--canonical"></textarea>' +
    "</div></article>"
  );
}

function staticFragmentHtml(title, pageKey, body) {
  return (
    '<article class="util-learner-renderer-vnext" data-renderer="vnext" role="region" aria-label="' +
    title +
    '" data-persistence-page-key="' +
    pageKey +
    '"><h2 data-lj-resource-title="true">' +
    title +
    "</h2><p>" +
    body +
    "</p></article>"
  );
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
    title: "Deciding Under Uncertainty (M4 browser)",
    sections: [
      {
        section_id: "journey_intro",
        title: "About",
        order: 1,
        exposition: "Synthetic six-resource browser fixture."
      },
      { section_id: "exp_1", title: "Opening interactive", order: 2, exposition: "Order." },
      { section_id: "exp_2", title: "Expository framing", order: 3, exposition: "Read." },
      { section_id: "exp_3", title: "Situated record", order: 4, exposition: "Record." },
      { section_id: "exp_4", title: "Quantify uncertainty", order: 5, exposition: "Math." },
      { section_id: "exp_5", title: "Independent judgement", order: 6, exposition: "Write." },
      { section_id: "exp_6", title: "Reflect on your judgement", order: 7, exposition: "Reflect." }
    ],
    commissions: [
      {
        commission_id: "c1",
        section_id: "exp_1",
        order: 1,
        title: "Opening interactive",
        product_id: "interactive",
        status: "supported",
        specification_text: "C1"
      },
      {
        commission_id: "c2",
        section_id: "exp_2",
        order: 2,
        title: "Expository framing",
        product_id: "expository",
        status: "supported",
        specification_text: "C2"
      },
      {
        commission_id: "c3",
        section_id: "exp_3",
        order: 3,
        title: "Situated record",
        product_id: "situated_task",
        status: "supported",
        specification_text: "C3"
      },
      {
        commission_id: "c4",
        section_id: "exp_4",
        order: 4,
        title: "Quantify uncertainty",
        product_id: "interactive",
        status: "supported",
        specification_text: "C4"
      },
      {
        commission_id: "c5",
        section_id: "exp_5",
        order: 5,
        title: "Independent judgement",
        product_id: "assessment_pack",
        status: "supported",
        specification_text: "C5"
      },
      {
        commission_id: "c6",
        section_id: "exp_6",
        order: 6,
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
  "S95-T-010 browser: six resources, ordering, MathLive enhance, C5→C6, a11y landmarks",
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
      workflowId: "wf-m4b-c5",
      pageId: "page-m4b-c5"
    });
    const pageC6 = assessmentPage({
      title: "Reflect on your judgement",
      workflowId: "wf-m4b-c6",
      pageId: "page-m4b-c6"
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
          commissionId: "c1",
          title: "Opening interactive",
          productId: "interactive",
          fragmentHtml: orderingFragmentHtml("m4b-c1")
        },
        {
          commissionId: "c2",
          title: "Expository framing",
          productId: "expository",
          fragmentHtml: staticFragmentHtml(
            "Expository framing",
            "m4b-c2",
            "Uncertainty is a property of the decision situation."
          )
        },
        {
          commissionId: "c3",
          title: "Situated record",
          productId: "situated_task",
          fragmentHtml: staticFragmentHtml(
            "Situated record",
            "m4b-c3",
            "Record the workplace situation you will revisit."
          )
        },
        {
          commissionId: "c4",
          title: "Quantify uncertainty",
          productId: "interactive",
          fragmentHtml: mathFragmentHtml("m4b-c4")
        },
        {
          commissionId: "c5",
          title: "Independent judgement",
          productId: "assessment_pack",
          sourcePage: pageC5,
          learnerPackage: packC5.package
        },
        {
          commissionId: "c6",
          title: "Reflect on your judgement",
          productId: "assessment_pack",
          sourcePage: pageC6,
          learnerPackage: packC6.package
        }
      ],
      fflate
    });
    assert.equal(assembled.ok, true, assembled.error && assembled.error.message);

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "prism-s95-m4-"));
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

    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      await page.goto(staticServer.baseUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForFunction(
        () =>
          window.PRISM_LEARNER_RENDERER_VNEXT &&
          typeof window.PRISM_LEARNER_RENDERER_VNEXT.mountLearnerResource === "function" &&
          window.__PRISM_LJ_SHELL__ &&
          window.__PRISM_LJ_SHELL__.currentId,
        { timeout: 30000 }
      );

      const mainCount = await page.locator("main").count();
      assert.equal(mainCount, 1, "shell must keep a single main landmark");
      assert.equal(await page.locator("[data-lj-nav-id]").count(), 7);
      assert.equal(await page.evaluate(() => window.__PRISM_LJ_SHELL__.currentId), "overview");

      await page.locator('[data-lj-nav-id="c1"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c1");
      assert.equal(await page.locator("[data-lj-overview]").count(), 0);
      await page.waitForSelector(".util-ordering-workspace");
      await page.locator(".util-ordering-item__move--down").first().click();
      const status = await page.locator("[data-ordering-status]").textContent();
      assert.match(String(status || ""), /Moved/i);

      await page.locator('[data-lj-nav-id="c2"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c2");
      await page.locator('[data-lj-nav-id="c1"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c1");
      assert.equal(await page.locator("main").count(), 1);
      assert.ok(await page.locator(".util-ordering-workspace").count());

      await page.locator('[data-lj-nav-id="c4"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c4");
      await page.waitForSelector("math-field.util-math-entry__field", { timeout: 15000 });
      assert.ok(
        (await page.locator(".util-learner-workspace--math-enhanced").count()) >= 1,
        "math workspace must enhance to MathLive (fallback alone is not M4 success)"
      );
      assert.equal(await page.locator(".util-learner-workspace--math-fallback").count(), 0);
      await page.evaluate(() => {
        const field = document.querySelector("#lj-shell-main math-field.util-math-entry__field");
        if (!field || typeof field.setValue !== "function") {
          throw new Error("enhanced math-field missing");
        }
        field.setValue("P(H)");
        field.dispatchEvent(new Event("input", { bubbles: true }));
      });
      await page.waitForTimeout(400);
      await page.locator('[data-lj-nav-id="c2"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c2");
      await page.locator('[data-lj-nav-id="c4"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c4");
      await page.waitForSelector("math-field.util-math-entry__field", { timeout: 15000 });
      assert.equal(
        await page.evaluate(() => {
          const ta = document.querySelector(
            "#lj-shell-main textarea.util-learner-workspace__input"
          );
          return ta ? ta.value : "";
        }),
        "P(H)"
      );

      await page.locator('[data-lj-nav-id="c6"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c6");
      const missing = await page.locator('[data-lj-artefact-status="missing"]').textContent();
      assert.match(String(missing || ""), /not available yet/i);

      await page.locator('[data-lj-nav-id="c5"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c5");
      await page.locator("#lj-shell-main textarea").first().fill(
        "Choose the reversible option under uncertainty."
      );
      await page.locator("#lj-shell-main textarea").first().blur();
      await page.waitForTimeout(500);

      await page.locator('[data-lj-nav-id="c6"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c6");
      await page.locator('[data-lj-artefact-status="resolved"]').waitFor({ timeout: 10000 });
      const refText = await page.locator(".lj-artefact-ref__text").textContent();
      assert.match(String(refText || ""), /Choose the reversible option under uncertainty/);
      assert.equal(await page.locator(".lj-artefact-ref textarea, .lj-artefact-ref input").count(), 0);

      const live = await page.locator("#lj-shell-live").getAttribute("aria-live");
      assert.ok(live === "polite" || live === "assertive");

      await page.reload({ waitUntil: "domcontentloaded" });
      await page.waitForFunction(
        () => window.__PRISM_LJ_SHELL__ && window.__PRISM_LJ_SHELL__.currentId,
        { timeout: 30000 }
      );
      await page.locator('[data-lj-nav-id="c6"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c6");
      await page.waitForFunction(
        () =>
          /Choose the reversible option under uncertainty/i.test(
            (document.querySelector(".lj-artefact-ref__text") || {}).textContent || ""
          ),
        { timeout: 10000 }
      );
    } finally {
      await browser.close();
      staticServer.server.close();
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
);
