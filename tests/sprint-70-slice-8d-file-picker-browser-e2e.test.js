"use strict";

/**
 * Sprint 70 Slice 8D — browser E2E: real file input → learner iframe.
 * Classification: browser E2E (mandatory acceptance path).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {
  runPrismLibScriptsInSandbox,
  DEFAULT_LIBS,
  PEDAGOGICAL_ICON_LIBS,
  loadLearnerRendererVNextBrowserInSandbox
} = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const wgcPath = path.join(repoRoot, "workflowGenerationContext.js");
const heteroPagePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);
const romanRoadsPath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-assemble",
  "roman-roads-visual-jobs-valid.json"
);
const workspace = require("../lib/utilities-visual-jobs-workspace.js");

const PNG_1X1_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
const PNG_1X1_DATA_URL = "data:image/png;base64," + PNG_1X1_BASE64;
const DEV_SERVER_URL = process.env.PRISM_DEV_SERVER_URL || "http://127.0.0.1:8787/";

function buildE2EPageWithVisualJobs() {
  const page = JSON.parse(fs.readFileSync(heteroPagePath, "utf8"));
  const roman = JSON.parse(fs.readFileSync(romanRoadsPath, "utf8"));
  page.visual_affordance_schema_version = "38.4";
  page.visual_affordances = [
    {
      affordance_id: "va-a1-e2e-01",
      scope: "activity",
      activity_id: "A1",
      visual_decision: "generate",
      visual_slot: "materials-entry",
      tier: "valuable",
      purpose: "classification",
      preferred_representation: "concept_map",
      subject: "Residual variance relationships",
      context: "E2E visual brief for file-picker path.",
      evidence_anchors: ["A1.learner_task", "A1.materials.worked_example"],
      must_show: ["residual spread cues"],
      must_not_show: ["answer key"],
      allowed_claims: ["Residual spread can change."],
      disallowed_claims: ["All regressions fail."],
      rationale: "Support reasoning before classification.",
      pedagogical_added_value: "Scaffold only.",
      anti_spoiler: true,
      spoiler_boundary: {
        hide_answers: true,
        hide_classification_keys: true,
        hide_model_solution: true,
        allow_structural_hint: true
      },
      representation_avoid: ["filled_worksheet"],
      requires_exact_data_match: false,
      source_basis: "A1 learner_task",
      caption_intent: "Structural cues only.",
      discipline_risk_level: "medium",
      reasoning_supported: "Inspect spread before concluding.",
      learner_stage: "pre_classification",
      canonical_discipline_note: "Empty labelled structure only."
    },
    JSON.parse(JSON.stringify(roman.visual_affordances.find((row) => row.scope === "page")))
  ];
  page.activities_visual_review = [
    {
      activity_id: "A1",
      activity_visual_value: { decision: "high", rationale: "E2E activity visual." }
    }
  ];
  return page;
}

function getBriefIdForActivity(page, activityId) {
  const ws = workspace.buildVisualJobsWorkspaceState(page, { activeView: "visual_jobs" });
  const brief = ws.compilerResult.briefs.find((row) => row.activity_id === activityId);
  assert.ok(brief, "expected brief for " + activityId);
  return brief.brief_id;
}

function createPngFile(name) {
  const bytes = Buffer.from(PNG_1X1_BASE64, "base64");
  return {
    name: name || "e2e-a1.png",
    type: "image/png",
    size: bytes.length
  };
}

function createElementStub(id) {
  return {
    id: id || "",
    value: "",
    textContent: "",
    innerHTML: "",
    srcdoc: "",
    className: "",
    classList: {
      add() {},
      remove() {},
      contains() {
        return false;
      },
      toggle() {
        return false;
      }
    },
    style: {},
    dataset: {},
    children: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute() {
      return null;
    },
    addEventListener() {},
    removeEventListener() {},
    focus() {},
    click() {},
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    }
  };
}

function loadPrismHarness() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener() {},
    createElement: () => createElementStub(),
    getElementById: (id) => {
      if (!elementStore.has(id)) {
        const el = createElementStub(id);
        if (id === "utilitiesPreviewFrame") {
          el.contentDocument = null;
          el.contentWindow = { document: null };
        }
        elementStore.set(id, el);
      }
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild() {}, removeChild() {} }
  };
  const pngBuffer = Buffer.from(PNG_1X1_BASE64, "base64");
  const manifestFsPath = path.join(repoRoot, "domains", "domain-manifest.json");
  const manifestJson = JSON.parse(fs.readFileSync(manifestFsPath, "utf8"));
  const windowStub = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    navigator: { clipboard: { writeText: () => Promise.resolve() } },
    URL: {
      createObjectURL(file) {
        return "blob:e2e-" + String((file && file.name) || "image");
      },
      revokeObjectURL() {}
    },
    Blob: function Blob(parts, meta) {
      this.parts = parts;
      this.type = (meta && meta.type) || "";
    },
    File: function File(parts, name, meta) {
      this.parts = parts;
      this.name = name;
      this.type = (meta && meta.type) || "";
      this.size = pngBuffer.length;
    },
    FileReader: function FileReader() {
      const self = this;
      this.onload = null;
      this.onerror = null;
      this.result = "";
      this.readAsDataURL = function () {
        self.result = PNG_1X1_DATA_URL;
        if (typeof self.onload === "function") {
          self.onload({ target: { result: PNG_1X1_DATA_URL } });
        }
      };
    },
    Image: function Image() {
      const self = this;
      Object.defineProperty(this, "src", {
        configurable: true,
        set(value) {
          self._src = value;
          self.naturalWidth = 1;
          self.naturalHeight = 1;
          self.width = 1;
          self.height = 1;
          if (typeof self.onload === "function") self.onload();
        },
        get() {
          return self._src || "";
        }
      });
    },
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  sandbox.Image = windowStub.Image;
  sandbox.FileReader = windowStub.FileReader;
  sandbox.File = windowStub.File;
  sandbox.Blob = windowStub.Blob;
  sandbox.URL = windowStub.URL;
  sandbox.fetch = function fetchImpl(url) {
    const normalized = String(url || "").replace(/\\/g, "/");
    if (normalized.indexOf("domains/domain-manifest.json") !== -1) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(manifestJson)
      });
    }
    return Promise.reject(new Error("Unexpected fetch: " + url));
  };
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot, DEFAULT_LIBS.concat(PEDAGOGICAL_ICON_LIBS));
  loadLearnerRendererVNextBrowserInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return { api, sandbox, elementStore };
}

async function waitFor(conditionFn, timeoutMs) {
  const deadline = Date.now() + (timeoutMs || 5000);
  while (Date.now() < deadline) {
    if (conditionFn()) return;
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  throw new Error("Timed out waiting for condition.");
}

test("Slice 8D integration: unversioned preview write cannot overwrite asset-aware iframe revision", async () => {
  const { api } = loadPrismHarness();
  const page = buildE2EPageWithVisualJobs();
  const briefId = getBriefIdForActivity(page, "A1");
  api.refreshUtilitiesOutputWorkspaceFromPageForTest(page, { activeView: "learner_page" });

  api.applyUtilityPreviewHtmlForTest("<html><body>baseline-no-assets</body></html>", {
    previewRevision: 1,
    reason: "baseline"
  });

  await api.simulateVisualJobFilePickerChangeForTest(
    briefId,
    createPngFile("race-test.png")
  );

  const withAssetSrcdoc = api.getUtilitiesPreviewSrcdocForTest();
  assert.match(withAssetSrcdoc, /util-visual-asset/);

  api.applyUtilityPreviewHtmlForTest("<html><body>stale-generate-without-assets</body></html>");

  const afterStale = api.getUtilitiesPreviewSrcdocForTest();
  assert.match(afterStale, /util-visual-asset/);
  assert.doesNotMatch(afterStale, /stale-generate-without-assets/);
});

test("Slice 8D integration: real file-picker path commits data_url asset and refreshes iframe", async () => {
  const { api } = loadPrismHarness();
  const page = buildE2EPageWithVisualJobs();
  const a1BriefId = getBriefIdForActivity(page, "A1");
  api.refreshUtilitiesOutputWorkspaceFromPageForTest(page, { activeView: "learner_page" });
  api.selectVisualJobForTest(a1BriefId);

  const attachResult = await api.simulateVisualJobFilePickerChangeForTest(
    a1BriefId,
    createPngFile("a1-real-picker.png")
  );
  assert.equal(attachResult.ok, true, attachResult.error || "attach failed");

  const asset = api.getVisualJobAssetRecordForTest(a1BriefId);
  assert.ok(asset);
  assert.equal(asset.render_source.kind, "data_url");
  assert.match(asset.render_source.value, /^data:image\/png;base64,/);

  const manifest = api.getVisualAssetManifestForTest();
  assert.ok(manifest.assets.some((row) => row.brief_id === a1BriefId));

  const revisions = api.getUtilitiesPreviewRevisionStateForTest();
  assert.ok(revisions.utilitiesPreviewLastAppliedRevision >= revisions.visualAssetPreviewRevision);

  const srcdoc = api.getUtilitiesPreviewSrcdocForTest();
  const exportHtml = api.getUtilitiesLastHtmlForTest
    ? api.getUtilitiesLastHtmlForTest()
    : "";
  assert.match(srcdoc, /util-visual-asset/);
  assert.ok(
    /data:image\/png;base64,/i.test(srcdoc) || /src="blob:/i.test(srcdoc),
    "iframe srcdoc should use blob or data URL for attached image"
  );
  if (exportHtml) {
    assert.match(exportHtml, /data:image\/png;base64,/);
  }
});

test("Slice 8D integration: hook-driven attach cannot bypass data_url requirement vs file-picker path", async () => {
  const { api } = loadPrismHarness();
  const page = buildE2EPageWithVisualJobs();
  const briefId = getBriefIdForActivity(page, "A1");
  api.refreshUtilitiesOutputWorkspaceFromPageForTest(page, { activeView: "learner_page" });
  api.selectVisualJobForTest(briefId);

  await api.simulateVisualJobFilePickerChangeForTest(briefId, createPngFile("parity-ui.png"));
  const uiAsset = api.getVisualJobAssetRecordForTest(briefId);
  assert.ok(uiAsset, "expected ui asset from file-picker path");

  api.refreshUtilitiesOutputWorkspaceFromPageForTest(page, { activeView: "learner_page" });
  api.selectVisualJobForTest(briefId);
  const hookResult = api.attachVisualImageForTest(briefId, {
    filename: "parity-hook.png",
    mime_type: "image/png",
    byte_size: 100,
    width: 1,
    height: 1,
    render_source: { kind: "data_url", value: PNG_1X1_DATA_URL },
    preview_source: { kind: "object_url", value: "blob:hook" }
  });
  assert.equal(hookResult.ok, true);
  const hookAsset = api.getVisualJobAssetRecordForTest(briefId);

  for (const field of [
    "brief_id",
    "job_id",
    "affordance_id",
    "scope",
    "activity_id",
    "visual_slot"
  ]) {
    assert.equal(uiAsset[field], hookAsset[field], field);
  }
  assert.equal(uiAsset.render_source.kind, hookAsset.render_source.kind);
  assert.match(uiAsset.render_source.value, /^data:image\/png;base64,/);
  assert.match(hookAsset.render_source.value, /^data:image\/png;base64,/);
});

test("Slice 8D browser E2E: Choose image → learner iframe shows decoded PNG", { skip: process.env.PRISM_SKIP_BROWSER_E2E === "1" }, async (t) => {
  let puppeteer;
  try {
    puppeteer = require("puppeteer");
  } catch (err) {
    t.skip("puppeteer is unavailable: " + String(err && err.message));
    return;
  }

  const pageJson = buildE2EPageWithVisualJobs();
  const pngPath = path.join(repoRoot, "tests", "fixtures", "visual-jobs-e2e-1x1.png");
  fs.writeFileSync(pngPath, Buffer.from(PNG_1X1_BASE64, "base64"));

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  try {
    const page = await browser.newPage();
    await page.goto(DEV_SERVER_URL, { waitUntil: "networkidle0", timeout: 60000 });

    await page.waitForFunction(() => typeof window.__PRISM_TEST_API !== "undefined", {
      timeout: 30000
    });

    await page.evaluate((jsonText) => {
      const input = document.getElementById("utilitiesJsonInput");
      if (!input) throw new Error("utilitiesJsonInput missing");
      input.value = jsonText;
    }, JSON.stringify(pageJson, null, 2));

    await page.click("#utilitiesGenerateBtn");
    await page.waitForFunction(() => {
      const frame = document.getElementById("utilitiesPreviewFrame");
      return frame && String(frame.srcdoc || "").length > 100;
    }, { timeout: 60000 });

    await page.click("#utilitiesOutputViewVisualJobsBtn");
    await page.waitForSelector("[data-image-file-input-brief-id]", { timeout: 30000 });

    const a1BriefId = await page.evaluate(() => {
      const btn = document.querySelector('[data-brief-select-id][aria-selected="true"]') ||
        document.querySelector("[data-brief-select-id]");
      return btn ? btn.getAttribute("data-brief-select-id") : "";
    });
    assert.ok(a1BriefId, "expected A1 brief to be selectable");

    const fileInput = await page.$('[data-image-file-input-brief-id="' + a1BriefId + '"]');
    assert.ok(fileInput, "expected Choose image file input");
    await fileInput.uploadFile(pngPath);

    await page.evaluate((briefId) => {
      const input = document.querySelector(
        '[data-image-file-input-brief-id="' + briefId + '"]'
      );
      if (!input) throw new Error("file input missing for change dispatch");
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }, a1BriefId);

    await page.waitForFunction(
      (briefId) => {
        const api = window.__PRISM_TEST_API;
        if (!api) return false;
        const asset = api.getVisualJobAssetRecordForTest(briefId);
        return asset && asset.render_source && asset.render_source.kind === "data_url";
      },
      { timeout: 30000 },
      a1BriefId
    );

    await page.click('[data-view-learner-page="1"]');
    await page.waitForFunction(() => {
      const frame = document.getElementById("utilitiesPreviewFrame");
      return frame && !frame.classList.contains("hidden");
    });

    const iframeMetrics = await page.evaluate(() => {
      const frame = document.getElementById("utilitiesPreviewFrame");
      const srcdoc = String(frame && frame.srcdoc ? frame.srcdoc : "");
      const doc = frame && frame.contentDocument;
      const img = doc ? doc.querySelector("img.util-visual-asset-image") : null;
      return {
        srcdocHasFigure: /util-visual-asset/.test(srcdoc),
        srcdocHasImageSrc:
          /data:image\/png;base64,/i.test(srcdoc) || /src="blob:/i.test(srcdoc),
        imgExists: !!img,
        imgSrc: img ? String(img.getAttribute("src") || "") : "",
        naturalWidth: img ? img.naturalWidth : 0,
        naturalHeight: img ? img.naturalHeight : 0
      };
    });

    assert.equal(iframeMetrics.srcdocHasFigure, true);
    assert.equal(iframeMetrics.srcdocHasImageSrc, true);
    assert.equal(iframeMetrics.imgExists, true);
    assert.ok(
      /^data:image\/png;base64,/.test(iframeMetrics.imgSrc) ||
        /^blob:/.test(iframeMetrics.imgSrc),
      "expected data or blob image src"
    );
    assert.ok(iframeMetrics.naturalWidth > 0);
    assert.ok(iframeMetrics.naturalHeight > 0);
  } finally {
    await browser.close();
    try {
      fs.unlinkSync(pngPath);
    } catch (_) {}
  }
});
