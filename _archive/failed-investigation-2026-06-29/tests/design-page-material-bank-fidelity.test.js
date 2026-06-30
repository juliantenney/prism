/**
 * Design Page material_bank fidelity — full GAM bodies, no condensation, renderer depth.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");
const compose = require("../lib/ld-design-page-compose-contract.js");
const preserve = require("../lib/page-gam-materials-preserve.js");
const fidelity = require("../lib/design-page-materials-fidelity.js");

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

const ABBREV_M6_TABLE = "| Criterion | Evidence | Judgement |\n| --- | --- | --- |";

const FULL_M17_SCENARIO =
  "### Digital platform scenario\n\n" +
  "Platform owners extract surplus value while workers face algorithmic management, wage theft, and fragmented contracts. " +
  "Learners must cite platform evidence when applying Marxian criteria to this contemporary case.";

const FULL_M19_DECISION =
  "### Evaluation decision table\n\n" +
  "Use each row to weigh evidence and counter-evidence before stating a criterion-linked judgement.\n\n" +
  "| Criterion | Evidence | Counter-evidence | Judgement |\n| --- | --- | --- | --- |\n| Relevance | | | |";

const ABBREV_M19_DECISION = "Use this checklist to evaluate your judgement: ...";

const upstreamRnaFidelity = {
  A1: [{ material_id: "M1", type: "worked_example", content: FULL_M1_WORKED }],
  A4: [{ material_id: "M6", type: "analysis_table", content: FULL_M6_TABLE }],
  A5: [
    { material_id: "M17", type: "scenario", content: FULL_M17_SCENARIO },
    { material_id: "M19", type: "decision_table", content: FULL_M19_DECISION }
  ]
};

function buildFullMaterialBankPage() {
  return {
    artifact_type: "page",
    title: "RNA fidelity — full material_bank",
    page_profile: "learner",
    audience: "Undergraduate learners",
    material_bank: {
      A1: {
        M1: { material_id: "M1", type: "worked_example", content: FULL_M1_WORKED }
      },
      A4: {
        M6: { material_id: "M6", type: "analysis_table", content: FULL_M6_TABLE }
      },
      A5: {
        M17: { material_id: "M17", type: "scenario", content: FULL_M17_SCENARIO },
        M19: { material_id: "M19", type: "decision_table", content: FULL_M19_DECISION }
      }
    },
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: [
          {
            activity_id: "A1",
            learner_task: "Study the worked example.",
            materials: {
              M1: {
                material_id: "M1",
                type: "worked_example",
                content_ref: "material_bank.A1.M1"
              }
            }
          },
          {
            activity_id: "A4",
            learner_task: "Complete the analysis table.",
            materials: {
              M6: {
                material_id: "M6",
                type: "analysis_table",
                content_ref: "material_bank.A4.M6"
              }
            }
          },
          {
            activity_id: "A5",
            learner_task: "Evaluate using scenario and decision table.",
            materials: {
              M17: {
                material_id: "M17",
                type: "scenario",
                content_ref: "material_bank.A5.M17"
              },
              M19: {
                material_id: "M19",
                type: "decision_table",
                content_ref: "material_bank.A5.M19"
              }
            }
          }
        ]
      }
    ]
  };
}

function buildAbbreviatedMaterialBankPage() {
  const page = buildFullMaterialBankPage();
  page.material_bank.A1.M1.content = ABBREV_M1_WORKED;
  page.material_bank.A4.M6.content = ABBREV_M6_TABLE;
  page.material_bank.A5.M19.content = ABBREV_M19_DECISION;
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

test("compose contract prompt requires verbatim material_bank copy and forbids condensation notes", () => {
  const text = compose.buildLdDesignPageComposePromptBlock();
  assert.match(text, /MATERIAL_BANK FIDELITY/i);
  assert.match(text, /verbatim copies of discovered GAM/i);
  assert.match(text, /condensed due to output size/i);
});

test("validateDesignPageComposeMaterialBodies accepts full material_bank bodies via content_ref", () => {
  const page = buildFullMaterialBankPage();
  const result = compose.validateDesignPageComposeMaterialBodies(page, upstreamRnaFidelity);
  assert.equal(result.ok, true);
  assert.equal(preserve.validatePageArtifactMaterialFidelity(page, upstreamRnaFidelity).ok, true);
});

test("validateDesignPageComposeMaterialBodies rejects abbreviated material_bank bodies", () => {
  const page = buildAbbreviatedMaterialBankPage();
  const result = compose.validateDesignPageComposeMaterialBodies(page, upstreamRnaFidelity);
  assert.equal(result.ok, false);
  assert.equal(result.failure.reason, "inline_material_body_defect");
  const ids = result.issues.map((issue) => issue.material_id).sort();
  assert.deepEqual(ids, ["M1", "M19", "M6"]);
});

test("content_ref without resolvable material_bank body fails packaging validation", () => {
  const page = buildFullMaterialBankPage();
  delete page.material_bank.A5.M19;
  const packaging = preserve.validatePageArtifactMaterialPackaging(page);
  assert.equal(packaging.ok, false);
  assert.equal(packaging.issues[0].material_id, "M19");
});

test("generation_notes condensation excuse fails fidelity validation", () => {
  const page = buildFullMaterialBankPage();
  page.generation_notes = { note: "Bodies condensed due to output size for M6." };
  const result = compose.validateDesignPageComposeMaterialBodies(page, upstreamRnaFidelity);
  assert.equal(result.ok, false);
  assert.equal(result.issues[0].defect, "condensed_limitation_note");
});

test("renderer preserves full instructional depth from material_bank without wrapper labels", () => {
  const api = loadPrismTestApi();
  const page = buildFullMaterialBankPage();
  const result = api.buildUtilityStructuredHtmlForTest(page);
  assert.equal(result.error, null);
  const html = String(result.html || "");
  assert.match(html, /receptor-mediated endocytosis/i);
  assert.match(html, /Complete each row using evidence/i);
  assert.match(html, /algorithmic management/i);
  assert.match(html, /weigh evidence and counter-evidence/i);
  assert.doesNotMatch(html, /\bMat\d\b/i);
  assert.doesNotMatch(html, /<h4>M1<\/h4>/i);
  assert.doesNotMatch(html, /<h4>M6<\/h4>/i);
  assert.doesNotMatch(html, /<strong>Type:<\/strong>/i);
  assert.doesNotMatch(html, /<strong>Purpose:<\/strong>/i);
  assert.doesNotMatch(html, /Upstream Source/i);
  assert.doesNotMatch(html, /content_ref/i);
  assert.doesNotMatch(html, /activity_materials/i);
});

test("skeletal outline detector flags four-step ellipsis worked example", () => {
  assert.equal(fidelity.materialBodyLooksAbbreviated(ABBREV_M1_WORKED), true);
  assert.equal(fidelity.materialBodyLooksAbbreviated(ABBREV_M6_TABLE), true);
  assert.equal(fidelity.materialBodyLooksAbbreviated(FULL_M1_WORKED), false);
  assert.equal(fidelity.materialBodyLooksAbbreviated(FULL_M6_TABLE), false);
});
