/**
 * Live app.js paths — material fidelity enforcement on capture, preview, prompt refresh, render.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");
const compose = require("../lib/ld-design-page-compose-contract.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");

const FULL_M1_WORKED =
  "### Worked Example: Applying the Replication Cycle\n\n" +
  "1. Attachment and entry via receptor-mediated endocytosis — the virion binds a host receptor and is internalised.\n" +
  "2. Uncoating releases genomic RNA into the cytoplasm where ribosomes can access positive-sense templates.\n" +
  "3. Translation produces replicase and structural proteins that reorganise cellular membranes.\n" +
  "4. Replication generates complementary RNA strands via RNA-dependent RNA polymerase activity.\n" +
  "5. Assembly and budding release new virions that can infect neighbouring cells.";

const ABBREV_M1_WORKED =
  "### Worked Example: Applying the Replication Cycle...\n\n" +
  "1. Attach.\n2. Uncoat.\n3. Translate.\n4. Replicate.";

const FULL_M6_TABLE =
  "### Analysis table guidance\n\n" +
  "Complete each row using evidence from the genome-type reference table. Name the criterion, cite replication steps, and state a reasoned judgement.\n\n" +
  "| Genome type | Replication steps | Host dependency | Judgement |\n| --- | --- | --- | --- |\n| Positive-sense | | | |\n| Negative-sense | | | |";

const FULL_M17_SCENARIO =
  "### Digital platform scenario\n\n" +
  "Platform owners extract surplus value while workers face algorithmic management, wage theft, and fragmented contracts. " +
  "Learners must cite platform evidence when applying Marxian criteria to this contemporary case.";

const FULL_M19_DECISION =
  "### Evaluation decision table\n\n" +
  "Use each row to weigh evidence and counter-evidence before stating a criterion-linked judgement.\n\n" +
  "| Criterion | Evidence | Counter-evidence | Judgement |\n| --- | --- | --- | --- |\n| Relevance | | | |";

function gamUpstreamActivities() {
  return [
    {
      activity_id: "A1",
      materials: [{ material_id: "M1", type: "worked_example", content: FULL_M1_WORKED }]
    },
    {
      activity_id: "A4",
      materials: [{ material_id: "M6", type: "analysis_table", content: FULL_M6_TABLE }]
    },
    {
      activity_id: "A5",
      materials: [
        { material_id: "M17", type: "scenario", content: FULL_M17_SCENARIO },
        { material_id: "M19", type: "decision_table", content: FULL_M19_DECISION }
      ]
    }
  ];
}

function buildAbbreviatedMaterialBankPage() {
  return {
    artifact_type: "page",
    title: "RNA abbreviated live enforcement",
    page_profile: "learner",
    source_artefacts: { activity_materials: true },
    material_bank: {
      A1: { M1: { material_id: "M1", type: "worked_example", content: ABBREV_M1_WORKED } },
      A4: { M6: { material_id: "M6", type: "analysis_table", content: "| A | B |\n| --- | --- |" } },
      A5: {
        M17: { material_id: "M17", type: "scenario", content: FULL_M17_SCENARIO },
        M19: { material_id: "M19", type: "decision_table", content: "Use this checklist to evaluate your judgement: ..." }
      }
    },
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: [
          {
            activity_id: "A1",
            materials: {
              M1: { material_id: "M1", type: "worked_example", content_ref: "material_bank.A1.M1" }
            }
          },
          {
            activity_id: "A4",
            materials: {
              M6: { material_id: "M6", type: "analysis_table", content_ref: "material_bank.A4.M6" }
            }
          },
          {
            activity_id: "A5",
            materials: {
              M17: { material_id: "M17", type: "scenario", content_ref: "material_bank.A5.M17" },
              M19: { material_id: "M19", type: "decision_table", content_ref: "material_bank.A5.M19" }
            }
          }
        ]
      }
    ]
  };
}

function buildFullMaterialBankPage() {
  const page = buildAbbreviatedMaterialBankPage();
  page.title = "RNA full material_bank live enforcement";
  page.material_bank.A1.M1.content = FULL_M1_WORKED;
  page.material_bank.A4.M6.content = FULL_M6_TABLE;
  page.material_bank.A5.M19.content = FULL_M19_DECISION;
  return page;
}

function buildMissingBankPage() {
  const page = buildFullMaterialBankPage();
  delete page.material_bank.A5.M19;
  return page;
}

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => false },
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
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  vm.runInContext(fs.readFileSync(appJsPath, "utf8"), sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

test("A: captured Design Page with abbreviated material_bank fails live validation", () => {
  const api = loadPrismTestApi();
  const page = buildAbbreviatedMaterialBankPage();
  const raw = JSON.stringify(page);
  const result = api.applyPageCompositionValidationForCapturedPage(null, raw, {
    upstreamActivityMaterials: gamUpstreamActivities()
  });
  assert.equal(result.fidelityValidation.outcome, "fail");
  assert.equal(result.fidelityValidation.reason, "page_artifact_material_fidelity_failed");
  const parsed = JSON.parse(result.json);
  assert.equal(parsed.generation_notes.materials_fidelity.outcome, "fail");
  assert.equal(parsed.metadata.page_material_fidelity_debug.outcome, "fail");
  assert.equal(parsed.metadata.page_materials_closure_debug.fidelity_claim_allowed, false);
});

test("B: utilities preview/export pipeline blocks abbreviated material_bank before render", () => {
  const api = loadPrismTestApi();
  const page = buildAbbreviatedMaterialBankPage();
  api.applyPageCompositionValidationForUtilitiesPage(page, {
    upstreamActivityMaterials: gamUpstreamActivities()
  });
  assert.equal(api.pageMaterialFidelityBlocksRender(page), true);
  const rendered = api.runUtilityPageExportPipelineForTest(page, {
    applyCompositionValidation: false,
    blockOnMaterialFidelityFailure: true
  });
  assert.ok(rendered.error);
  assert.equal(rendered.fidelityBlocked, true);
});

test("C: content_ref without material_bank body fails live validation", () => {
  const api = loadPrismTestApi();
  const page = buildMissingBankPage();
  api.applyPageCompositionValidationForUtilitiesPage(page, {
    upstreamActivityMaterials: gamUpstreamActivities()
  });
  assert.equal(page.generation_notes.materials_fidelity.outcome, "fail");
  const codes = page.generation_notes.materials_fidelity.issues.map((i) => i.reason_code);
  assert.ok(codes.includes("content_ref_unresolved"));
});

test("D: stale prompt with old compose marker is refreshed to v3-material-fidelity contract", () => {
  const api = loadPrismTestApi();
  const stale =
    "Design Page task body.\n\nLD-DESIGN-PAGE-COMPOSE-CONTRACT (auto-applied):\n- old rule\n";
  const refreshed = api.applyLdDesignPageComposeContractToDraft(stale, {
    stepCanonicalStepId: "step_design_page",
    stepTitle: "Design Page"
  });
  assert.match(refreshed, /LD-DESIGN-PAGE-COMPOSE-CONTRACT:v3-material-fidelity \(auto-applied\)/i);
  assert.match(refreshed, /MATERIAL_BANK FIDELITY/i);
  assert.doesNotMatch(refreshed, /\n- old rule\n/);
});

test("E: rendered HTML from material_bank page preserves depth without wrapper labels", () => {
  const api = loadPrismTestApi();
  const page = buildFullMaterialBankPage();
  api.applyPageCompositionValidationForUtilitiesPage(page, {
    upstreamActivityMaterials: gamUpstreamActivities()
  });
  assert.equal(api.pageMaterialFidelityBlocksRender(page), false);
  const result = api.runUtilityPageExportPipelineForTest(page, {
    applyCompositionValidation: false
  });
  assert.equal(result.error, null);
  const html = String(result.html || "");
  assert.match(html, /receptor-mediated endocytosis/i);
  assert.match(html, /Complete each row using evidence/i);
  assert.match(html, /weigh evidence and counter-evidence/i);
  assert.doesNotMatch(html, /\bMat\d\b/i);
  assert.doesNotMatch(html, /<h4>M1<\/h4>/i);
  assert.doesNotMatch(html, /<strong>Type:<\/strong>/i);
  assert.doesNotMatch(html, /<strong>Purpose:<\/strong>/i);
  assert.doesNotMatch(html, /content_ref/i);
  assert.doesNotMatch(html, /upstream_source/i);
});

test("F: timeline renderRichMaterials fallback does not leak metadata labels", () => {
  const api = loadPrismTestApi();
  const html = api.utilityRenderPageSectionsForTest(
    [
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: [
          {
            activity_id: "A1",
            title: "RNA activity",
            learner_task: "Study materials.",
            materials: {
              M1: {
                material_id: "M1",
                type: "worked_example",
                purpose: "orientation",
                content_ref: "material_bank.A1.M1",
                upstream_source: "activity_materials"
              }
            }
          }
        ]
      }
    ],
    {
      suppressInternalMetadata: true,
      materialBank: {
        A1: {
          M1: { material_id: "M1", type: "worked_example", content: FULL_M1_WORKED }
        }
      }
    }
  );
  assert.match(String(html), /receptor-mediated endocytosis/i);
  assert.doesNotMatch(String(html), /<strong>Purpose:<\/strong>/i);
  assert.doesNotMatch(String(html), /content_ref/i);
  assert.doesNotMatch(String(html), /upstream_source/i);
  assert.doesNotMatch(String(html), /<h4>M1<\/h4>/i);
});

test("condensation note in generation_notes fails live validation", () => {
  const api = loadPrismTestApi();
  const page = buildFullMaterialBankPage();
  page.generation_notes = { note: "Bodies condensed due to output size for M6." };
  api.applyPageCompositionValidationForUtilitiesPage(page, {
    upstreamActivityMaterials: gamUpstreamActivities()
  });
  const codes = page.generation_notes.materials_fidelity.issues.map((i) => i.reason_code);
  assert.ok(codes.includes("material_bank_generation_notes_condensation"));
});

test("compose contract prompt includes v3 material fidelity marker", () => {
  const text = compose.buildLdDesignPageComposePromptBlock();
  assert.match(text, /LD-DESIGN-PAGE-COMPOSE-CONTRACT:v3-material-fidelity \(auto-applied\)/i);
});
