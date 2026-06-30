/**
 * Sprint 53 — Design Page material closure validation gate.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");

const fidelity = require("../lib/design-page-materials-fidelity.js");
if (typeof globalThis !== "undefined") {
  globalThis.PRISM_DESIGN_PAGE_MATERIALS_FIDELITY = fidelity;
}
const preserve = require("../lib/page-gam-materials-preserve.js");

const WORKED_EXAMPLE_BODY = [
  "## What experts notice",
  "Step 1: Identify the basket components and record each item price.",
  "Step 2: Compare year-on-year prices using the same basket definition.",
  "Step 3: Explain which household is most exposed and why.",
  "**Why this works:** the comparison stays tied to evidence rather than slogans."
].join("\n");

const CHECKLIST_BODY = [
  "## Common mistakes",
  "- Forgetting to hold the basket constant across years",
  "- Treating one price spike as proof of sustained inflation",
  "### If any check is not met:",
  "Revise your comparison table before submitting your judgement."
].join("\n");

const TRANSFER_BODY =
  "Write at least 80 words evaluating how inflation affects your chosen household scenario. Use criteria from the table.";

const upstreamGam = {
  activities: [
    {
      activity_id: "A3",
      title: "Analyse household inflation effects",
      materials: [
        {
          material_id: "M8_Worked_Analytic_Pass",
          type: "worked_example",
          purpose: "worked analytic pass household inflation",
          content: WORKED_EXAMPLE_BODY
        },
        {
          material_id: "M10_Checklist",
          type: "checklist",
          purpose: "evaluate verification",
          content: CHECKLIST_BODY
        },
        {
          material_id: "M18_Transfer",
          type: "transfer_prompt",
          purpose: "transfer evaluate",
          content: TRANSFER_BODY
        }
      ]
    }
  ]
};

function basePage(materials) {
  return {
    artifact_type: "page",
    title: "Test page",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: [
          {
            activity_id: "A3",
            title: "Analyse household inflation effects",
            learner_task: "Complete the analysis.",
            materials: materials || {}
          }
        ]
      }
    ]
  };
}

function fullMaterials() {
  return {
    worked_analytic_pass: WORKED_EXAMPLE_BODY,
    checklist_evaluate: CHECKLIST_BODY,
    transfer_prompt_evaluate: TRANSFER_BODY
  };
}

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: {
      add: () => {},
      remove: () => {},
      contains: () => false,
      toggle: () => false
    },
    style: {},
    dataset: {},
    children: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute: () => null,
    addEventListener: () => {},
    removeEventListener: () => {},
    focus: () => {},
    click: () => {}
  };
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn },
    PRISM_DESIGN_PAGE_MATERIALS_FIDELITY: fidelity
  };
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener: () => {},
    createElement: () => createElementStub(),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub());
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild: () => {}, removeChild: () => {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener: () => {},
    removeEventListener: () => {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem: () => {} },
    URL: { createObjectURL: () => "blob:test", revokeObjectURL: () => {} },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    },
    PRISM_DESIGN_PAGE_MATERIALS_FIDELITY: fidelity
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  [
    "lib/page-gam-materials-preserve.js",
    "lib/sprint38-visual-affordances.js",
    "lib/ld-table-fidelity.js",
    "lib/ld-materials-copy.js",
    "lib/ld-design-page-compose-contract.js"
  ].forEach((rel) => {
    vm.runInContext(fs.readFileSync(path.join(repoRoot, rel), "utf8"), sandbox, { filename: rel });
  });
  if (sandbox.PRISM_PAGE_GAM_MATERIALS_PRESERVE) {
    windowStub.PRISM_PAGE_GAM_MATERIALS_PRESERVE = sandbox.PRISM_PAGE_GAM_MATERIALS_PRESERVE;
  }
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return api;
}

test("validatePageMaterialsClosure: pass when page materials match upstream GAM", () => {
  const page = basePage(fullMaterials());
  const result = preserve.validatePageMaterialsClosure(page, upstreamGam, {});
  assert.equal(result.validation, "page_materials_closure");
  assert.equal(result.outcome, "pass");
  assert.equal(result.issues.length, 0);
});

test("validatePageMaterialsClosure: skip when upstream GAM is unavailable", () => {
  const page = basePage(fullMaterials());
  const result = preserve.validatePageMaterialsClosure(page, null, {});
  assert.equal(result.outcome, "skip");
});

test("validatePageMaterialsClosure: fail when a material is missing", () => {
  const mats = fullMaterials();
  delete mats.checklist_evaluate;
  const page = basePage(mats);
  const result = preserve.validatePageMaterialsClosure(page, upstreamGam, {});
  assert.equal(result.outcome, "fail");
  assert.ok(
    result.issues.some((issue) => issue.code === "material_missing" && /checklist/i.test(issue.page_key || ""))
  );
});

test("validatePageMaterialsClosure: fail when material body is placeholder-only", () => {
  const mats = fullMaterials();
  mats.transfer_prompt_evaluate = "Set of short scenarios";
  const page = basePage(mats);
  const result = preserve.validatePageMaterialsClosure(page, upstreamGam, {});
  assert.equal(result.outcome, "fail");
  assert.ok(result.issues.some((issue) => issue.code === "placeholder_substitution"));
});

test("validatePageMaterialsClosure: fail when material body is replaced by synopsis", () => {
  const mats = fullMaterials();
  mats.worked_analytic_pass =
    "Example showing stepwise reasoning illustrating how to justify strategy choices.";
  const page = basePage(mats);
  const result = preserve.validatePageMaterialsClosure(page, upstreamGam, {});
  assert.equal(result.outcome, "fail");
  assert.ok(
    result.issues.some(
      (issue) =>
        issue.code === "synopsis_substitution" ||
        issue.code === "placeholder_substitution" ||
        issue.code === "body_ratio_below_threshold"
    )
  );
});

test("validatePageMaterialsClosure: fail when material body is substantially shortened", () => {
  const mats = fullMaterials();
  mats.worked_analytic_pass = WORKED_EXAMPLE_BODY.slice(0, Math.floor(WORKED_EXAMPLE_BODY.length * 0.5));
  const page = basePage(mats);
  const result = preserve.validatePageMaterialsClosure(page, upstreamGam, {});
  assert.equal(result.outcome, "fail");
  assert.ok(
    result.issues.some(
      (issue) =>
        issue.code === "body_ratio_below_threshold" || issue.code === "marker_missing"
    )
  );
});

test("validatePageMaterialsClosure: Sprint 53 failure shape — table kept, scaffold materials dropped", () => {
  const page = basePage({
    analysis_table:
      "| Household | CPI impact |\n|---|---|\n| Fixed-income household | High sensitivity to food and energy prices |",
    text: "This note shows stepwise reasoning illustrating how to justify strategy choices."
  });
  const result = preserve.validatePageMaterialsClosure(page, upstreamGam, {});
  assert.equal(result.outcome, "fail");
  assert.ok(
    result.issues.some(
      (issue) =>
        issue.code === "material_missing" ||
        issue.code === "placeholder_substitution" ||
        issue.code === "body_ratio_below_threshold"
    )
  );
  assert.ok(result.messages.length >= 2);
});

test("validatePageMaterialsClosure: merge repairs missing scaffold then closure passes", () => {
  const page = basePage({
    analysis_table:
      "| Household | CPI impact |\n|---|---|\n| Fixed-income household | High sensitivity to food and energy prices |"
  });
  const merged = preserve.applyGamMaterialsToComposedPage(page, upstreamGam);
  const result = preserve.validatePageMaterialsClosure(merged, upstreamGam, {});
  assert.equal(result.outcome, "pass");
});

test("validatePageMaterialsClosureFromLib: activity id mismatch fails via prismTestApi", () => {
  const api = loadPrismTestApi();
  const page = basePage(fullMaterials());
  page.sections[0].content[0].activity_id = "A99";
  page.sections[0].content[0].title = "Wrong activity";
  const result = api.validatePageMaterialsClosureFromLib(page, upstreamGam, {});
  assert.equal(result.outcome, "fail");
});

test("applyPageCompositionValidationForUtilitiesPage: material closure fail when activity row does not match GAM", () => {
  const api = loadPrismTestApi();
  const page = basePage(fullMaterials());
  page.sections[0].content[0].activity_id = "A99";
  page.sections[0].content[0].title = "Wrong activity";
  const validation = api.applyPageCompositionValidationForUtilitiesPage(page, {
    upstreamLearningActivities: [],
    upstreamActivityMaterials: upstreamGam
  });
  assert.equal(validation.materialsValidation.outcome, "fail");
  assert.ok(Array.isArray(page.generation_notes.limitations));
  assert.ok(
    page.generation_notes.limitations.some((line) => /page materials closure/i.test(String(line)))
  );
});

test("runUtilityPageExportPipelineForTest: blocks HTML when material closure fails after merge", () => {
  const api = loadPrismTestApi();
  const page = basePage(fullMaterials());
  page.sections[0].content[0].activity_id = "A99";
  page.sections[0].content[0].title = "Wrong activity";
  const result = api.runUtilityPageExportPipelineForTest(page, {
    compositionOptions: {
      upstreamLearningActivities: [],
      upstreamActivityMaterials: upstreamGam
    }
  });
  assert.ok(result.error);
  assert.match(result.error, /Material closure failed/i);
  assert.equal(result.html, undefined);
});

test("runUtilityPageExportPipelineForTest: passes when materials are complete", () => {
  const api = loadPrismTestApi();
  const page = basePage(fullMaterials());
  const result = api.runUtilityPageExportPipelineForTest(page, {
    compositionOptions: {
      upstreamLearningActivities: [{ activity_id: "A3", title: "Analyse household inflation effects" }],
      upstreamActivityMaterials: upstreamGam
    }
  });
  assert.equal(result.error, null);
  assert.ok(String(result.html || "").length > 0);
});

function padToLength(text, targetLen) {
  let s = String(text);
  while (s.length < targetLen) {
    s += " Continue with the same learner guidance and criteria.";
  }
  return s;
}

const LONG_CATALOGUE_SYNOPSIS =
  "This section includes a worked example, checklist, and transfer prompt for learners. " +
  "Learners compare household inflation effects using the provided table and prompts to complete the judgement task. " +
  "The activity supports evaluation criteria and decision-table reasoning throughout the session. " +
  "Additional narrative padding keeps the description readable without reproducing the upstream scaffold bodies. ".repeat(
    6
  );

test("Phase 2: limitations admitting material truncation fail closure", () => {
  const page = basePage(fullMaterials());
  page.generation_notes = {
    limitations: ["Hard output limit required shortened activity.materials bodies for A3."]
  };
  const result = preserve.validatePageMaterialsClosure(page, upstreamGam, {});
  assert.equal(result.outcome, "fail");
  assert.ok(result.issues.some((issue) => issue.code === "limitations_excuse_conflict"));
});

test("Phase 2: preservation claim conflicts when material closure fails", () => {
  const mats = fullMaterials();
  delete mats.checklist_evaluate;
  const page = basePage(mats);
  page.constraints_applied = { materials_preserved_verbatim: true };
  const result = preserve.validatePageMaterialsClosure(page, upstreamGam, {});
  assert.equal(result.outcome, "fail");
  assert.ok(result.issues.some((issue) => issue.code === "constraints_claim_conflict"));
  assert.ok(result.issues.some((issue) => issue.code === "material_missing"));
});

test("Phase 2: long catalogue synopsis fails even when length ratio is high", () => {
  const mats = fullMaterials();
  mats.worked_analytic_pass = padToLength(LONG_CATALOGUE_SYNOPSIS, WORKED_EXAMPLE_BODY.length);
  const page = basePage(mats);
  const result = preserve.validatePageMaterialsClosure(page, upstreamGam, {});
  assert.equal(result.outcome, "fail");
  assert.ok(result.issues.some((issue) => issue.code === "synopsis_substitution"));
});

test("Phase 2: near-length body missing checklist marker fails", () => {
  const mats = fullMaterials();
  mats.checklist_evaluate = padToLength(
    "Review notes for learners completing the inflation comparison task.\n" +
      "- Confirm your table is complete\n" +
      "- Submit your judgement when ready",
    CHECKLIST_BODY.length
  );
  const page = basePage(mats);
  const result = preserve.validatePageMaterialsClosure(page, upstreamGam, {});
  assert.equal(result.outcome, "fail");
  assert.ok(
    result.issues.some(
      (issue) => issue.code === "marker_missing" || issue.code === "synopsis_substitution"
    )
  );
});

test("Phase 2: near-length body missing worked example marker fails", () => {
  const mats = fullMaterials();
  mats.worked_analytic_pass = padToLength(
    "Follow these notes to compare household inflation impacts using basket evidence and year-on-year price changes. " +
      "Explain which household is most exposed and justify your answer with criteria.",
    WORKED_EXAMPLE_BODY.length
  );
  const page = basePage(mats);
  const result = preserve.validatePageMaterialsClosure(page, upstreamGam, {});
  assert.equal(result.outcome, "fail");
  assert.ok(result.issues.some((issue) => issue.code === "marker_missing"));
});

test("Phase 2: merge restores marker loss then closure passes", () => {
  const mats = fullMaterials();
  mats.checklist_evaluate = padToLength(
    "Review notes only without the upstream checklist scaffold markers.",
    CHECKLIST_BODY.length
  );
  const page = basePage(mats);
  const merged = preserve.applyGamMaterialsToComposedPage(page, upstreamGam);
  const result = preserve.validatePageMaterialsClosure(merged, upstreamGam, {});
  assert.equal(result.outcome, "pass");
});

test("Phase 2: plain materials without scaffold markers do not false-fail", () => {
  const plainTransfer =
    "Write at least 80 words explaining how inflation affects your chosen household using evidence from the comparison table.";
  const plainGam = {
    activities: [
      {
        activity_id: "A3",
        materials: [
          {
            material_id: "M_SIMPLE",
            type: "transfer_prompt",
            purpose: "transfer evaluate",
            content: plainTransfer
          }
        ]
      }
    ]
  };
  const page = basePage({ transfer_prompt_evaluate: plainTransfer });
  const result = preserve.validatePageMaterialsClosure(page, plainGam, {});
  assert.equal(result.outcome, "pass");
});

test("Phase 2: export blocks limitation excuse even when bodies match", () => {
  const api = loadPrismTestApi();
  const page = basePage(fullMaterials());
  page.generation_notes = {
    limitations: ["Hard output limit required shortened activity.materials bodies for A3."]
  };
  const result = api.runUtilityPageExportPipelineForTest(page, {
    compositionOptions: {
      upstreamLearningActivities: [{ activity_id: "A3", title: "Analyse household inflation effects" }],
      upstreamActivityMaterials: upstreamGam
    }
  });
  assert.ok(result.error);
  assert.match(result.error, /Material closure failed/i);
  assert.match(result.error, /limitations admits material-body loss/i);
});
