/**
 * S78-T-041 — Culminating learner transfer production commissioning / transport / render.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const dlaContract = require(path.join(repoRoot, "lib", "ld-dla-page-enrich-contract.js"));
const gamContract = require(path.join(repoRoot, "lib", "ld-gam-page-enrich-contract.js"));
const designPagePartial = require(path.join(repoRoot, "lib", "ld-design-page-partial-contract.js"));
const gamEnrich = require(path.join(repoRoot, "lib", "page-gam-enrich.js"));
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS,
  injectLearnerRendererVNextInSandbox
} = require("./prism-vm-lib-bootstrap.js");

const owenFixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "owen-a1-assembled-shape.json"
);

const TRANSFER_MARKER = /S78-T-041/;
const CLOSURE_HEADING = gamContract.PAGE_LEARNER_RESOURCE_CLOSURE_HEADING;

function loadPrismTestApi(extraLibs) {
  const source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
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
    createElement: () => ({
      value: "",
      textContent: "",
      className: "",
      classList: { add() {}, remove() {}, contains() { return false; }, toggle() { return false; } },
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
      click() {}
    }),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, documentStub.createElement());
      return elementStore.get(id);
    },
    querySelector: () => documentStub.createElement(),
    querySelectorAll: () => [],
    body: { appendChild() {}, removeChild() {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem() {} },
    URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  const libs = Array.isArray(extraLibs) ? extraLibs : [];
  runPrismLibScriptsInSandbox(
    sandbox,
    repoRoot,
    PEDAGOGICAL_ICON_LIBS.concat(libs)
  );
  if (libs.some((lib) => /page-vnext-assemble/.test(lib))) {
    injectLearnerRendererVNextInSandbox(sandbox, repoRoot);
  }
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return { api };
}

function loadFullPrismTestApi() {
  const source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return { api };
}

function buildGamV2Workflow() {
  return {
    id: "wf-s78-t041-gam",
    goal: "Learner page",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    steps: [
      { id: "lo_step", title: "Define Learning Outcomes", outputName: "learning_outcomes" },
      {
        id: "ep_step",
        title: "Design Episode Plan",
        outputName: "page",
        canonical_step_id: "step_design_episode_plan"
      },
      {
        id: "dla_step",
        title: "Design Learning Activities",
        outputName: "page",
        canonical_step_id: "step_design_learning_activities"
      },
      {
        id: "gam_step",
        title: "Generate Activity Materials",
        outputName: "page",
        canonical_step_id: "step_generate_activity_materials",
        override_prompt_body: "Populate materials[] from required_materials[]."
      }
    ]
  };
}

function pageWithTransferAndStudyTips() {
  const page = JSON.parse(fs.readFileSync(owenFixturePath, "utf8"));
  const activity = page.activities[0];
  activity.transfer_or_application_task =
    "Apply the experience→representation chain to a contemporary conflict poet who did not serve on the front line.";
  activity.required_materials = (activity.required_materials || []).concat([
    {
      material_id: "A1-M5",
      type: "transfer_prompt",
      purpose: "Learner transfer production on a changed poetic context.",
      specification: "Short production prompt; no worked answer; Depth_floor L3."
    }
  ]);
  activity.materials = (activity.materials || []).concat([
    {
      material_id: "A1-M5",
      material_type: "transfer_prompt",
      activity_id: "A1",
      title: "Transfer: a different poetic vantage",
      body_format: "markdown",
      body:
        "Choose one contemporary conflict poem written by someone without battlefield service. " +
        "In 80–120 words, explain how that poet's vantage might shape thematic focus differently from Owen's, " +
        "using the experience→perspective→representation chain. Do not invent a model answer key."
    }
  ]);
  page.page_synthesis = page.page_synthesis || {};
  page.page_synthesis.study_tips = {
    format: "markdown",
    body:
      "- Reconnect experience, perspective, and representation before you leave the page.\n" +
      "- Keep claim strength matched to the evidence you actually used.\n" +
      "- Return to one poem with a changed vantage when you revise."
  };
  return page;
}

test("T-041 DLA production commissions culminating transfer production", () => {
  const production = dlaContract.assembleDlaCanonicalContract().sections.production;
  assert.match(production, TRANSFER_MARKER);
  assert.match(production, /culminating transfer production/i);
  assert.match(production, /transfer_prompt/);
  assert.match(production, /meaningfully changed/i);
  assert.match(production, /learner production/i);
  assert.match(production, /study_tips|page learner-resource closure/i);
  assert.doesNotMatch(production, /Lagrange|shadow price|first-order condition/i);
});

test("T-041 DLA commissioning requires transfer_prompt on culminating activity", () => {
  const commissioning = dlaContract.assembleDlaCanonicalContract().sections.commissioning;
  assert.match(commissioning, /S78-T-041 \(commissioning\)/);
  assert.match(commissioning, /transfer_prompt/);
  assert.match(commissioning, /culminating\/final activity/i);
  assert.match(commissioning, /changed context/i);
  assert.doesNotMatch(commissioning, /Study tips as the transfer/i);
});

test("T-041 DLA workbook G2 links culminating transfer to transfer_prompt", () => {
  const overlayText = dlaContract.buildDlaWorkbookOverlayBlock();
  assert.match(overlayText, /S78-T-041/);
  assert.match(overlayText, /transfer_prompt/);
  assert.match(overlayText, /closure ≠ transfer|closure.*transfer/i);
  const assembled = dlaContract.assembleDlaCanonicalContract({
    workbookOverlay: true,
    overlayText
  });
  assert.match(assembled.sections.overlay, /S78-T-041/);
});

test("T-041 GAM enrich contract fulfils transfer_prompt as production distinct from closure", () => {
  const block = gamContract.buildGamPageEnrichContractBlock();
  assert.match(block, /S78-T-041 transfer_prompt fulfilment/i);
  assert.match(block, /meaningfully changed context/i);
  assert.match(block, /learner response/i);
  assert.match(block, /Do not embed ### Page learner-resource closure/i);
  assert.match(block, /page learner-resource closure \/ study_tips is consolidation only/i);
  assert.match(block, /Do not author boilerplate headings such as ### Transfer task/i);
  assert.match(block, /NEVER host ### Page learner-resource closure inside a transfer_prompt/i);
  assert.doesNotMatch(block, /Prefer a consolidation_summary, transfer_prompt/i);
  assert.doesNotMatch(block, /Lagrange|shadow price/i);
});

test("T-041 live GAM V2 Copy / buildWorkflowStepInstructions receives transfer salience", () => {
  const { api } = loadFullPrismTestApi();
  const brief = api.buildGamV2CopyMaterialAuthoringBrief();
  assert.match(brief, /S78-T-041 transfer_prompt/i);
  assert.match(brief, /meaningfully changed context/i);
  assert.match(brief, /Distinct from ### Page learner-resource closure/i);
  assert.match(brief, /NEVER host this section inside a transfer_prompt/i);
  assert.match(brief, /Do not author ### Transfer task boilerplate/i);
  assert.match(brief, /S78-D04 page learner-resource closure/i);
  assert.doesNotMatch(brief, /Prefer consolidation\/transfer\/closure materials/i);

  const wf = buildGamV2Workflow();
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const gamStep = wf.steps.find((s) => s.id === "gam_step");
  const copy = api.buildWorkflowStepInstructions(gamStep, 3, null);
  assert.match(copy, /S78-T-041 transfer_prompt/i);
  assert.match(copy, /### Page learner-resource closure/);
  assert.doesNotMatch(copy, /final_synthesis|next_steps/i);

  const dlaLive = api.assembleLiveDlaCanonicalPrompt(
    { canonical_step_id: "step_design_learning_activities" },
    wf
  );
  assert.match(dlaLive, /S78-T-041 culminating transfer production/i);
  assert.match(dlaLive, /S78-T-041 \(commissioning\)/);
  assert.match(dlaLive, /transfer_prompt/);
});

test("T-041 Design Page remains transport-only for study_tips and does not author transfer", () => {
  const block = designPagePartial.buildDesignPagePartialContractBlock();
  assert.match(block, /TRANSPORT ONLY \(S78-D04\)/);
  assert.match(block, /Page learner-resource closure/);
  assert.match(block, /Do not invent final_synthesis or next_steps/i);
  assert.doesNotMatch(block, /S78-T-041/);
  assert.doesNotMatch(block, /commission.*transfer_prompt|author.*transfer_prompt/i);
});

test("T-041 GAM capture preserves transfer_prompt materials; study_tips still forbidden on GAM partial", () => {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "gam", enriched_by: ["gam"] },
    activities: [
      {
        activity_id: "A5",
        materials: [
          {
            material_id: "A5-M1",
            material_type: "transfer_prompt",
            activity_id: "A5",
            title: "Transfer production",
            body_format: "markdown",
            body:
              "Apply the taught method to a changed case with different constraints. Produce a short response.\n\n" +
              CLOSURE_HEADING +
              "\n\n- Reconnect the sequence before leaving.\n- Keep claim strength scoped."
          }
        ]
      }
    ]
  };
  const check = gamEnrich.validateGamPartialPageCapture(page);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.equal(page.activities[0].materials[0].material_type, "transfer_prompt");
  assert.ok(gamEnrich.GAM_DLA_OWNED_STRING_FIELDS.includes("transfer_or_application_task"));
});

test("T-041 live vNext export renders transfer production distinct from Study tips", () => {
  const { api } = loadPrismTestApi(["lib/page-vnext-assemble.js"]);
  const page = pageWithTransferAndStudyTips();
  const result = api.renderLearnerPageForTest(page, {
    rendererVersion: "vnext",
    applyCompositionValidation: false
  });
  assert.ok(result && !result.error, result && result.error);
  const html = String(result.html || "");

  assert.match(html, /data-composition-moment="transfer"/);
  assert.match(html, /Transfer your learning|Transfer response|different poetic vantage/i);
  assert.match(html, /experience→perspective→representation|contemporary conflict poem/i);
  assert.match(html, /Study tips/i);
  assert.match(html, /Reconnect experience, perspective, and representation/i);

  const transferIdx = html.indexOf('data-composition-moment="transfer"');
  const studySectionIdx = html.lastIndexOf("util-study-tips__content");
  assert.ok(transferIdx >= 0 && studySectionIdx > transferIdx, "transfer should precede Study tips section");

  const transferSlice = html.slice(transferIdx, studySectionIdx);
  assert.doesNotMatch(transferSlice, /Reconnect experience, perspective, and representation/);
  assert.doesNotMatch(html, /Lagrange|shadow price|first-order condition/i);
});

test("T-041 activities without transfer remain valid when transfer is not commissioned", () => {
  const page = JSON.parse(fs.readFileSync(owenFixturePath, "utf8"));
  const { api } = loadPrismTestApi(["lib/page-vnext-assemble.js"]);
  const result = api.renderLearnerPageForTest(page, {
    rendererVersion: "vnext",
    applyCompositionValidation: false
  });
  assert.ok(result && !result.error, result && result.error);
  const html = String(result.html || "");
  assert.match(html, /Experience Shapes Representation/);
  assert.doesNotMatch(html, /data-composition-moment="transfer"/);
});

test("T-041 T-032 study_tips closure transport path remains unchanged", () => {
  const block = gamContract.buildGamPageEnrichContractBlock();
  assert.match(block, /S78-D04 page learner-resource closure packaging/i);
  assert.match(block, /Page learner-resource closure/);
  assert.match(block, /page_synthesis\.study_tips/i);
  assert.match(block, /2–4 compact bullets/i);

  const dp = designPagePartial.buildDesignPagePartialContractBlock();
  assert.match(dp, /Omit study_tips when that designated section is absent/i);
  assert.match(dp, /Do not synthesise study_tips/i);
});
