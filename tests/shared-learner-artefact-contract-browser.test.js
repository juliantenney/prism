/**
 * Browser E2E: Interactive constructed text → shared artefact → Learning Journal,
 * with Assessment Pack producers in the same journal sequence.
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
const {
  renderLearnerPageHtml,
  proposeArtefactContractFromLearningJourney
} = require("../lib/learner-renderer-vnext");

const PLAYWRIGHT_CANDIDATES = [
  path.join(__dirname, "fixtures", "sequential-nav-qa", "node_modules", "playwright"),
  "playwright"
];

function interactivePage() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "interactive",
    title: "Initial judgement",
    activities: [],
    metadata: {
      workflow_id: "wf-shared-artefact-c1",
      page_id: "page-shared-artefact-c1"
    },
    learner_artefacts: {
      produces: [
        {
          elicitation_id: "E1",
          response_kind: "constructed_text",
          label: "Initial judgement",
          prompt: "Write your initial judgement about the case."
        }
      ]
    }
  };
}

function assessmentPage(title, workflowId, pageId) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: title,
    activities: [],
    metadata: {
      workflow_id: workflowId,
      page_id: pageId
    },
    assessment_evidence: {
      purpose: {
        role: "R1",
        visibility_claim: "Judgement quality.",
        stop_rationale: "Formative stop.",
        forward_intent: "Carry forward."
      },
      learner_context: { depends_on_prior_work: false },
      pack_forward_orientation: "Use later.",
      elicitations: [
        {
          elicitation_id: "E1",
          order: 1,
          evidence_ask: "Write the judgement.",
          epistemic_class: "non_determinate",
          delivery: {
            kind: "constructed_performance",
            prompt: "Write your " + title.toLowerCase() + ".",
            response_workspace: { intention: "sustained_written_judgement" }
          },
          formative_return: {
            materials: [{ material_id: "look", body: "Look again." }],
            forward_orientation: "Carry forward."
          }
        }
      ]
    }
  };
}

function buildJourney() {
  return ljDesign.buildLearningJourneyDesignPageFixture({
    title: "Shared artefact journal demonstrator",
    sections: [
      {
        section_id: "journey_intro",
        title: "About",
        order: 1,
        exposition: "Three authentic contributions."
      },
      {
        section_id: "exp_1",
        title: "Initial judgement",
        order: 2,
        exposition: "Write first."
      },
      {
        section_id: "exp_7",
        title: "Reconsidered judgement",
        order: 3,
        exposition: "Write again."
      },
      {
        section_id: "exp_8",
        title: "Final argument",
        order: 4,
        exposition: "Write finally."
      }
    ],
    commissions: [
      {
        commission_id: "c1",
        section_id: "exp_1",
        order: 1,
        title: "Initial judgement",
        product_id: "interactive",
        status: "supported",
        specification_text: "C1"
      },
      {
        commission_id: "c7",
        section_id: "exp_7",
        order: 2,
        title: "Reconsidered judgement",
        product_id: "assessment_pack",
        status: "supported",
        specification_text: "C7"
      },
      {
        commission_id: "c8",
        section_id: "exp_8",
        order: 3,
        title: "Final argument",
        product_id: "assessment_pack",
        status: "supported",
        specification_text: "C8"
      }
    ]
  });
}

function journalSpec() {
  return {
    enabled: true,
    title: "My Learning Journal",
    entries: [
      {
        entry_id: "j1",
        order: 1,
        title: "Initial judgement",
        framing: "Your first written position.",
        artefact_id: "c1.E1"
      },
      {
        entry_id: "j2",
        order: 2,
        title: "Reconsidered judgement",
        framing: "Your revised position.",
        artefact_id: "c7.E1"
      },
      {
        entry_id: "j3",
        order: 3,
        title: "Final argument",
        framing: "Your final argument.",
        artefact_id: "c8.E1"
      }
    ]
  };
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
  "browser: Interactive + Assessment Pack constructed text → shared artefact → Journal",
  { skip: process.env.PRISM_SKIP_BROWSER_E2E === "1" },
  async (t) => {
    const playwright = loadPlaywright();
    if (!playwright || !playwright.chromium) {
      t.skip("playwright is unavailable");
      return;
    }

    const journey = buildJourney();
    assert.equal(journey.ok, true, journey.error && journey.error.message);
    journey.page.learning_journey.journal = journalSpec();

    const pageC1 = interactivePage();
    const pageC7 = assessmentPage(
      "Reconsidered judgement",
      "wf-shared-artefact-c7",
      "page-shared-artefact-c7"
    );
    const pageC8 = assessmentPage(
      "Final argument",
      "wf-shared-artefact-c8",
      "page-shared-artefact-c8"
    );

    const packC1 = learnerPackage.buildLearnerPackage({
      html: renderLearnerPageHtml(pageC1).html,
      title: pageC1.title
    });
    const packC7 = learnerPackage.buildLearnerPackage({
      html: renderLearnerPageHtml(pageC7).html,
      title: pageC7.title
    });
    const packC8 = learnerPackage.buildLearnerPackage({
      html: renderLearnerPageHtml(pageC8).html,
      title: pageC8.title
    });
    assert.equal(packC1.ok, true);
    assert.equal(packC7.ok, true);
    assert.equal(packC8.ok, true);

    const constituents = [
      {
        commissionId: "c1",
        productId: "interactive",
        title: "Initial judgement",
        sourcePage: pageC1,
        learnerPackage: packC1.package
      },
      {
        commissionId: "c7",
        productId: "assessment_pack",
        title: "Reconsidered judgement",
        sourcePage: pageC7,
        learnerPackage: packC7.package
      },
      {
        commissionId: "c8",
        productId: "assessment_pack",
        title: "Final argument",
        sourcePage: pageC8,
        learnerPackage: packC8.package
      }
    ];

    const proposal = proposeArtefactContractFromLearningJourney({
      page: journey.page,
      constituents
    });
    assert.equal(proposal.ok, true, JSON.stringify(proposal.gaps));
    assert.deepEqual(
      proposal.contract.produces.map((row) => row.artefactId),
      ["c1.E1", "c7.E1", "c8.E1"]
    );
    assert.equal(proposal.contract.produces[0].workspaceId, "learner-constructed-E1");

    const assembled = ljPackage.assembleLearningJourneyUnifiedShellPackage({
      page: journey.page,
      artefactContract: proposal.contract,
      journalSpec: journalSpec(),
      constituents,
      fflate
    });
    assert.equal(assembled.ok, true, assembled.error && assembled.error.message);

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "prism-shared-artefact-"));
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
      await page.goto(staticServer.baseUrl, {
        waitUntil: "domcontentloaded",
        timeout: 60000
      });
      await page.waitForFunction(
        () =>
          window.PRISM_LEARNER_RENDERER_VNEXT &&
          typeof window.PRISM_LEARNER_RENDERER_VNEXT.populateLearningJournal === "function" &&
          window.__PRISM_LJ_SHELL__,
        { timeout: 30000 }
      );

      async function writeCommission(commissionId, text) {
        await page.locator('[data-lj-nav-id="' + commissionId + '"]').click();
        await page.waitForFunction(
          (id) => window.__PRISM_LJ_SHELL__.currentId === id,
          commissionId,
          { timeout: 15000 }
        );
        const textarea = page.locator("#lj-shell-main textarea").first();
        await textarea.waitFor({ timeout: 10000 });
        await textarea.fill(text);
        await textarea.blur();
        await page.waitForTimeout(600);
      }

      await writeCommission("c1", "Initial IR judgement: the claim is slippery.");
      await writeCommission("c7", "Reconsidered AP judgement: evidence is incomplete.");
      await writeCommission("c8", "Final AP argument: withhold assent.");

      await page.locator('[data-lj-nav-id="journal"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "journal", {
        timeout: 15000
      });
      await page.waitForFunction(
        () =>
          /Initial IR judgement: the claim is slippery/i.test(document.body.innerText) &&
          /Reconsidered AP judgement: evidence is incomplete/i.test(document.body.innerText) &&
          /Final AP argument: withhold assent/i.test(document.body.innerText),
        { timeout: 15000 }
      );

      const statuses = await page.evaluate(() => {
        return Array.prototype.map.call(
          document.querySelectorAll("[data-lj-journal-entry]"),
          (node) => ({
            entry: node.getAttribute("data-lj-journal-entry"),
            resolved: !!node.querySelector('[data-lj-journal-artefact-status="resolved"]'),
            missing: !!node.querySelector('[data-lj-journal-artefact-status="missing"]')
          })
        );
      });
      assert.equal(statuses.length, 3);
      statuses.forEach((row) => {
        assert.equal(row.resolved, true, JSON.stringify(row));
        assert.equal(row.missing, false, JSON.stringify(row));
      });

      // Reload must keep authentic Interactive contribution without re-entry.
      await page.reload({ waitUntil: "domcontentloaded" });
      await page.waitForFunction(
        () => window.__PRISM_LJ_SHELL__ && window.PRISM_LEARNER_RENDERER_VNEXT,
        { timeout: 30000 }
      );
      await page.locator('[data-lj-nav-id="journal"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "journal");
      await page.waitForFunction(
        () => /Initial IR judgement: the claim is slippery/i.test(document.body.innerText),
        { timeout: 15000 }
      );
    } finally {
      await browser.close();
      staticServer.server.close();
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
);
