/**
 * Design Page material_bank packaging — renderer resolves bodies from pasted artefact only.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");
const preserve = require("../lib/page-gam-materials-preserve.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");

const CHECKLIST_BODY =
  "### Evaluation checklist\n\n" +
  "- [ ] I classified each genome type using the table criteria.\n" +
  "- [ ] I cited replication steps for positive- and negative-sense viruses.\n" +
  "- [ ] I explained why HCV requires a host microRNA for stability.";

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

function buildReferenceOnlyPage() {
  return {
    artifact_type: "page",
    title: "RNA packaging test",
    audience: "Undergraduate learners",
    page_profile: "learner",
    material_bank: {
      A2: {
        M6: {
          material_id: "M6",
          type: "checklist",
          content: CHECKLIST_BODY
        }
      }
    },
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: [
          {
            activity_id: "A2",
            title: "Classify genome types",
            learner_task: "Use the checklist to evaluate your table.",
            materials: {
              M6: {
                material_id: "M6",
                type: "checklist",
                purpose: "self-evaluation",
                content_ref: "material_bank.A2.M6"
              }
            }
          }
        ]
      }
    ]
  };
}

test("hydratePageMaterialsFromMaterialBank copies bank bodies onto activity rows", () => {
  const page = buildReferenceOnlyPage();
  preserve.hydratePageMaterialsFromMaterialBank(page);
  const row = preserve.findLearningActivitiesRows(page)[0];
  assert.match(String(row.materials.M6.content || ""), /Evaluation checklist/i);
  assert.equal(row.materials.M6.content_ref, undefined);
  assert.equal(row.materials.M6.upstream_source, undefined);
  assert.equal(preserve.validatePageArtifactMaterialPackaging(page).ok, true);
});

test("renderer produces learner-facing checklist body from material_bank alone", () => {
  const api = loadPrismTestApi();
  const page = buildReferenceOnlyPage();
  const result = api.buildUtilityStructuredHtmlForTest(page);
  assert.equal(result.error, null);
  const html = String(result.html || "");
  assert.match(html, /Evaluation checklist/i);
  assert.match(html, /classified each genome type/i);
  assert.doesNotMatch(html, /Upstream Source/i);
  assert.doesNotMatch(html, /activity_materials/i);
  assert.doesNotMatch(html, /<h4>M6<\/h4>/i);
  assert.doesNotMatch(html, /<strong>Purpose:<\/strong>/i);
  assert.doesNotMatch(html, /Material Bank/i);
});

test("reference-only page without material_bank fails packaging validation", () => {
  const page = buildReferenceOnlyPage();
  delete page.material_bank;
  const packaging = preserve.validatePageArtifactMaterialPackaging(page);
  assert.equal(packaging.ok, false);
  assert.equal(packaging.issues[0].material_id, "M6");
});
