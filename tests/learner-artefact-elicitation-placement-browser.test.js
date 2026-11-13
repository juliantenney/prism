/**
 * Browser: learner-facing reading order for artefact elicitation placement,
 * plus draft persistence / Journal hydration from the inline workspace.
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

function loadPlaywright() {
  for (const candidate of PLAYWRIGHT_CANDIDATES) {
    try {
      return require(candidate);
    } catch (_err) {
      // continue
    }
  }
  return null;
}

function interactivePlacementPage() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "interactive",
    title: "The Missing Aster Notebook: Weighing the Evidence",
    metadata: {
      workflow_id: "wf-placement-c1",
      page_id: "page-placement-c1"
    },
    learner_artefacts: {
      produces: [
        {
          elicitation_id: "E1",
          response_kind: "constructed_text",
          label: "My initial judgement about the Aster Notebook",
          prompt:
            "State your provisional position on whether Mara Vale removed the Aster Notebook."
        }
      ]
    },
    activities: [
      {
        activity_id: "A1",
        title: "What exactly is being claimed?",
        learner_task: "1. Establish exactly what proposition P claims.",
        expected_output: "A clear statement of P.",
        episode_plan: {
          archetype: "apply",
          beats: [
            { function: "orientation" },
            { function: "framing" },
            { function: "activation" },
            { function: "criteria_exposition" },
            { function: "worked_thinking" },
            { function: "guided_practice" },
            { function: "independent_performance" },
            { function: "verification" },
            { function: "revision" },
            { function: "reflection" },
            { function: "transfer" },
            { function: "transition" }
          ]
        },
        materials: [
          {
            material_id: "A1-M1",
            material_type: "text",
            activity_id: "A1",
            title: "Proposition P",
            body_format: "markdown",
            body: "Establish exactly what proposition P claims."
          }
        ]
      },
      {
        activity_id: "A2",
        title: "What does the evidence establish?",
        learner_task: "1. Examine and evaluate the available evidence.",
        expected_output: "An evaluation of the evidence.",
        episode_plan: {
          archetype: "apply",
          beats: [
            { function: "orientation" },
            { function: "framing" },
            { function: "activation" },
            { function: "criteria_exposition" },
            { function: "worked_thinking" },
            { function: "guided_practice" },
            { function: "independent_performance" },
            { function: "verification" },
            { function: "revision" },
            { function: "reflection" },
            { function: "transfer" },
            { function: "transition" }
          ]
        },
        materials: [
          {
            material_id: "A2-M1",
            material_type: "text",
            activity_id: "A2",
            title: "Evidence",
            body_format: "markdown",
            body: "Examine and evaluate the available evidence."
          }
        ]
      },
      {
        activity_id: "A3",
        title: "Make your first judgement",
        learner_task: "1. Formulate your provisional judgement using the template.",
        expected_output: "A constructed initial judgement.",
        episode_plan: {
          archetype: "apply",
          beats: [
            { function: "orientation" },
            { function: "framing" },
            { function: "activation" },
            { function: "criteria_exposition" },
            { function: "worked_thinking" },
            { function: "guided_practice" },
            { function: "independent_performance" },
            { function: "verification" },
            { function: "revision" },
            { function: "reflection" },
            { function: "transfer" },
            { function: "transition" }
          ]
        },
        required_materials: [
          {
            material_id: "A3-M3",
            material_type: "template",
            title: "Your initial Learning Journal judgement",
            purpose: "Capture the initial judgement",
            specification: "Learner writes a constructed judgement.",
            response_fulfilment: {
              kind: "learner_text_production",
              response_kind: "text_compose",
              artefact_elicitation_id: "E1"
            }
          }
        ],
        materials: [
          {
            material_id: "A3-M3",
            material_type: "template",
            activity_id: "A3",
            title: "Your initial Learning Journal judgement",
            body_format: "markdown",
            body:
              "**My provisional position on P:**\nWrite your position.\n\n**My strongest reason:**\nExplain your strongest reason.\n"
          }
        ]
      }
    ]
  };
}

function writeZipToDir(bytes, destDir) {
  const unzipped = fflate.unzipSync(bytes);
  Object.keys(unzipped).forEach((name) => {
    const target = path.join(destDir, name);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, unzipped[name]);
  });
}

function startStaticServer(rootDir) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
      const rel = urlPath === "/" ? "/index.html" : urlPath;
      const filePath = path.join(rootDir, rel.replace(/^\//, ""));
      if (!filePath.startsWith(rootDir)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
      }
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end("Not found");
          return;
        }
        const ext = path.extname(filePath).toLowerCase();
        const type =
          ext === ".html"
            ? "text/html; charset=utf-8"
            : ext === ".js"
              ? "application/javascript; charset=utf-8"
              : ext === ".css"
                ? "text/css; charset=utf-8"
                : "application/octet-stream";
        res.writeHead(200, { "Content-Type": type });
        res.end(data);
      });
    });
    server.listen(0, "127.0.0.1", () => {
      const addr = server.address();
      resolve({
        server,
        baseUrl: "http://127.0.0.1:" + addr.port + "/"
      });
    });
    server.on("error", reject);
  });
}

test("browser: E1 appears in Activity 3 after A1/A2; persists and hydrates Journal", async (t) => {
  const playwright = loadPlaywright();
  if (!playwright) {
    t.skip("Playwright not available");
    return;
  }

  const pageC1 = interactivePlacementPage();
  const journey = ljDesign.buildLearningJourneyDesignPageFixture({
    title: "Placement journey",
    sections: [
      {
        section_id: "exp_1",
        title: "Weighing the Evidence",
        order: 1,
        exposition: "C1"
      },
      {
        section_id: "journal_sec",
        title: "Journal",
        order: 2,
        exposition: "Reflect."
      }
    ],
    commissions: [
      {
        commission_id: "c1",
        section_id: "exp_1",
        order: 1,
        title: pageC1.title,
        product_id: "interactive",
        status: "supported",
        specification_text: "C1"
      }
    ]
  });
  journey.page.learning_journey.journal = {
    enabled: true,
    title: "My Learning Journal",
    entries: [
      {
        entry_id: "j1",
        order: 1,
        title: "Initial judgement",
        framing: "Your first written position.",
        artefact_id: "c1.E1"
      }
    ]
  };

  const rendered = renderLearnerPageHtml(pageC1);
  assert.ok(!rendered.error, rendered.error);
  assert.equal(
    (rendered.html.match(/data-workspace-id="learner-constructed-E1"/g) || []).length,
    1
  );
  assert.equal(rendered.html.includes("journey-learner-artefacts"), false);

  const packC1 = learnerPackage.buildLearnerPackage({
    html: rendered.html,
    title: pageC1.title
  });
  assert.equal(packC1.ok, true);

  const proposal = proposeArtefactContractFromLearningJourney({
    page: journey.page,
    constituents: [
      {
        commissionId: "c1",
        productId: "interactive",
        title: pageC1.title,
        sourcePage: pageC1,
        learnerPackage: packC1.package
      }
    ]
  });
  assert.equal(proposal.ok, true, JSON.stringify(proposal.gaps));
  assert.equal(proposal.contract.produces[0].artefactId, "c1.E1");

  const assembled = ljPackage.assembleLearningJourneyUnifiedShellPackage({
    page: journey.page,
    artefactContract: proposal.contract,
    journalSpec: journey.page.learning_journey.journal,
    constituents: [
      {
        commissionId: "c1",
        productId: "interactive",
        title: pageC1.title,
        sourcePage: pageC1,
        learnerPackage: packC1.package
      }
    ],
    fflate
  });
  assert.equal(assembled.ok, true, assembled.error && assembled.error.message);

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "prism-artefact-placement-"));
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

    await page.locator('[data-lj-nav-id="c1"]').click();
    await page.waitForFunction(
      () => window.__PRISM_LJ_SHELL__.currentId === "c1",
      { timeout: 15000 }
    );

    // Learner-facing order from the rendered commission HTML (full page DOM).
    const commissionHtml = rendered.html;
    const idxA1 = commissionHtml.indexOf('id="activity-A1"');
    const idxA2 = commissionHtml.indexOf('id="activity-A2"');
    const idxA3 = commissionHtml.indexOf('id="activity-A3"');
    const idxE1 = commissionHtml.indexOf('data-workspace-id="learner-constructed-E1"');
    assert.ok(idxA1 >= 0 && idxA2 > idxA1 && idxA3 > idxA2);
    assert.ok(idxE1 > idxA3, "E1 workspace must follow Activity 3 in reading order");
    assert.ok(idxE1 > idxA2, "E1 workspace must follow evidence Activity 2");
    assert.equal(commissionHtml.includes("journey-learner-artefacts"), false);
    assert.match(
      commissionHtml.slice(idxE1, idxE1 + 200),
      /data-response-part-id="E1"/
    );

    // Live shell may sequentialise sections; require a single inline E1 after A3 title.
    const order = await page.evaluate(() => {
      const root = document.querySelector("#lj-shell-main") || document;
      const workspaces = Array.from(
        root.querySelectorAll('[data-workspace-id="learner-constructed-E1"]')
      );
      const earlyRegion = root.querySelector("#journey-learner-artefacts");
      const titles = Array.from(root.querySelectorAll(".util-activity-title")).map(function (node) {
        return String(node.textContent || "").trim();
      });
      const workspace = workspaces[0] || null;
      let nearestTitle = "";
      if (workspace) {
        let cursor = workspace;
        while (cursor && cursor !== root) {
          const header = cursor.querySelector && cursor.querySelector(".util-activity-title");
          if (header) {
            nearestTitle = String(header.textContent || "").trim();
            break;
          }
          cursor = cursor.parentElement;
        }
      }
      function precedesText(left, right) {
        const li = titles.indexOf(left);
        const ri = titles.indexOf(right);
        return li >= 0 && ri >= 0 && li < ri;
      }
      return {
        workspaceCount: workspaces.length,
        hasEarlyRegion: !!earlyRegion,
        responsePartId: workspace ? workspace.getAttribute("data-response-part-id") : null,
        nearestActivityTitle: nearestTitle,
        titles: titles,
        a1BeforeA3: precedesText("What exactly is being claimed?", "Make your first judgement"),
        a2BeforeA3: precedesText("What does the evidence establish?", "Make your first judgement")
      };
    });

    assert.equal(order.workspaceCount, 1, JSON.stringify(order));
    assert.equal(order.hasEarlyRegion, false, JSON.stringify(order));
    assert.equal(order.responsePartId, "E1", JSON.stringify(order));
    assert.equal(order.nearestActivityTitle, "Make your first judgement", JSON.stringify(order));
    assert.equal(order.a1BeforeA3, true, JSON.stringify(order));
    assert.equal(order.a2BeforeA3, true, JSON.stringify(order));

    const judgement =
      "Provisional: the available evidence does not yet establish that Mara removed the notebook.";
    const textarea = page.locator('#lj-shell-main [data-workspace-id="learner-constructed-E1"] textarea');
    await textarea.waitFor({ timeout: 10000 });
    await textarea.fill(judgement);
    await textarea.blur();
    await page.waitForTimeout(700);

    await page.reload({ waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForFunction(
      () => window.__PRISM_LJ_SHELL__ && window.PRISM_LEARNER_RENDERER_VNEXT,
      { timeout: 30000 }
    );
    await page.locator('[data-lj-nav-id="c1"]').click();
    await page.waitForFunction(
      () => window.__PRISM_LJ_SHELL__.currentId === "c1",
      { timeout: 15000 }
    );
    await textarea.waitFor({ timeout: 10000 });
    assert.equal(await textarea.inputValue(), judgement);

    await page.locator('[data-lj-nav-id="journal"]').click();
    await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "journal", {
      timeout: 15000
    });
    await page.waitForFunction(
      () =>
        /Provisional: the available evidence does not yet establish/i.test(
          document.body.innerText
        ),
      { timeout: 15000 }
    );
  } finally {
    await browser.close();
    staticServer.server.close();
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
