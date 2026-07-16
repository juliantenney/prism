/**
 * Beat–material registry — integrity, exclusivity, diagnostics, renderer integration.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const registry = require("../lib/beat-material-registry.js");

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
    }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

function activityPage(materials, episodePlan) {
  return {
    artifact_type: "page",
    title: "Beat registry test",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: [
          {
            activity_id: "A1",
            title: "Test activity",
            materials: materials || {},
            episode_plan: episodePlan || null
          }
        ]
      }
    ]
  };
}

test("registry integrity: every material type maps to exactly one beat", () => {
  const check = registry.validateRegistryIntegrity();
  assert.equal(check.ok, true, check.errors.join("; "));
  const seen = {};
  registry.MATERIAL_BEAT_REGISTRY.forEach((row) => {
    const key = registry.normalizeMaterialType(row.materialType);
    assert.ok(key, "materialType required");
    assert.ok(row.beat, "beat required for " + key);
    assert.equal(seen[key], undefined, "duplicate material type: " + key);
    seen[key] = row.beat;
    const resolved = registry.resolveBeatForMaterialType(key);
    assert.equal(resolved.beat, registry.normalizeBeat(row.beat));
    assert.equal(typeof resolved.exclusivity, "boolean");
  });
});

test("resolveMaterialBeat: conflict when registry beat disagrees with text classification", () => {
  const beats = require("../lib/utility-pedagogical-beats.js");
  const resolution = registry.resolveMaterialBeat("checklist", "Reflect on your answer", {
    classifyFromText: beats.classifyPedagogicalBeat
  });
  assert.equal(resolution.conflict, true);
  assert.deepEqual(resolution.beats.sort(), ["CHECK", "REFLECT"]);
  assert.equal(resolution.beat, null);
});

test("diagnostics: beat coverage, unassigned materials, empty beats", () => {
  const page = activityPage(
    {
      worked_example: "Step 1: model the thinking.",
      mystery_material: "Unknown content",
      checklist: "Check your understanding"
    },
    {
      archetype: "guided_inquiry",
      beats: [
        { function: "explanation" },
        { function: "example" },
        { function: "verification" },
        { function: "guided_inquiry" }
      ]
    }
  );
  const beats = require("../lib/utility-pedagogical-beats.js");
  const result = registry.validatePageBeatMaterialClosure(page, {
    classifyFromText: beats.classifyPedagogicalBeat
  });
  assert.equal(result.outcome, "warn");
  assert.ok(result.diagnostics.beat_coverage.EXAMPLE);
  assert.ok(result.diagnostics.beat_coverage.EXAMPLE.some((t) => t === "A1:worked_example"));
  assert.equal(result.diagnostics.unassigned_materials.length, 1);
  assert.equal(result.diagnostics.unassigned_materials[0].material_key, "mystery_material");
  const emptyFns = result.diagnostics.empty_beats.map((e) => e.episode_function);
  assert.ok(emptyFns.includes("explanation"));
  assert.ok(emptyFns.includes("guided_inquiry"));
});

test("validatePageBeatMaterialClosure: fails on multi-beat material conflicts", () => {
  const page = activityPage({
    checklist: "Reflect on your understanding"
  });
  const beats = require("../lib/utility-pedagogical-beats.js");
  const result = registry.validatePageBeatMaterialClosure(page, {
    classifyFromText: beats.classifyPedagogicalBeat
  });
  assert.equal(result.outcome, "fail");
  assert.ok(result.diagnostics.conflicts.length >= 1);
  assert.match(result.messages.join(" "), /multiple beats/i);
});

test("renderer uses registry lookups for material type beat and icon modifier", () => {
  const api = loadPrismTestApi();
  const classify = api.utilityClassifyPedagogicalBeatForTest;
  assert.equal(classify("", "task_card"), "PRACTICE");
  assert.equal(classify("", "checklist"), "CHECK");
  assert.equal(classify("", "scenario"), "READ");
  const icons = api.getUtilityPedagogicalIconRendererForTest();
  assert.equal(icons.modifierClassForMaterialType("task_card"), "util-task-card-icon");
  assert.equal(icons.modifierClassForMaterialType("checklist"), "util-checklist-icon");
  assert.equal(icons.semanticIconForMaterialType("task_card"), "TASK_CARDS");
});

test("page composition wires beat-material closure validation", () => {
  const api = loadPrismTestApi();
  const page = activityPage({
    worked_example: "Worked example content",
    unknown_key: "Some text"
  });
  const result = api.validatePageBeatMaterialClosureFromLib(page, {
    classifyFromText: api.utilityClassifyPedagogicalBeatForTest
  });
  assert.equal(result.validation, "page_beat_material_closure");
  assert.equal(result.outcome, "warn");
  assert.ok(result.diagnostics.unassigned_materials.length >= 1);
  api.appendPageCompositionBeatMaterialClosureWarnings(page, result);
  assert.ok(
    page.generation_notes.limitations.some((line) =>
      String(line).includes("[PRISM page beat-material closure]")
    )
  );
});

test("materialKeysFromObject excludes renderer metadata sidecars", () => {
  const keys = registry.materialKeysFromObject({
    text: "Body",
    _material_ids: { text: "A1-M1" },
    _material_types: { text: "text" },
    _render_sequence: [{ key: "text", material_id: "A1-M1", material_type: "text" }]
  });
  assert.deepEqual(keys, ["text"]);
  assert.equal(registry.isRendererMaterialMetaKey("_material_ids"), true);
  assert.equal(registry.isRendererMaterialMetaKey("_material_types"), true);
  assert.equal(registry.isRendererMaterialMetaKey("_render_sequence"), true);
  assert.equal(registry.isRendererMaterialMetaKey("text"), false);
});

test("diagnostics: no warnings for renderer metadata sidecars on vNext materials object", () => {
  const page = activityPage(
    {
      text: { title: "Intro", body: "Exposition body." },
      worked_example: "Step 1: model.",
      checklist: "- item one",
      _material_ids: { text: "A1-M1", worked_example: "A1-M2", checklist: "A1-M3" },
      _material_types: { text: "text", worked_example: "worked_example", checklist: "checklist" },
      _render_sequence: [
        { key: "text", material_id: "A1-M1", material_type: "text" },
        { key: "worked_example", material_id: "A1-M2", material_type: "worked_example" },
        { key: "checklist", material_id: "A1-M3", material_type: "checklist" }
      ]
    },
    {
      archetype: "understand",
      beats: [{ function: "explanation" }, { function: "worked_thinking" }, { function: "verification" }]
    }
  );
  const beats = require("../lib/utility-pedagogical-beats.js");
  const result = registry.validatePageBeatMaterialClosure(page, {
    classifyFromText: beats.classifyPedagogicalBeat
  });
  const joined = result.messages.join(" ");
  assert.equal(joined.includes("_material_ids"), false, joined);
  assert.equal(joined.includes("_material_types"), false, joined);
  assert.equal(joined.includes("_render_sequence"), false, joined);
  assert.equal(result.diagnostics.unassigned_materials.length, 0);
  assert.equal(result.diagnostics.empty_beats.length, 0);
  assert.equal(result.diagnostics.conflicts.length, 0);
});

test("diagnostics: storage key with _material_types sidecar is not falsely unassigned", () => {
  const page = activityPage(
    {
      a1_m1: { title: "Intro", body: "Exposition body." },
      _material_types: { a1_m1: "text" },
      _material_ids: { a1_m1: "A1-M1" }
    },
    {
      archetype: "understand",
      beats: [{ function: "explanation" }]
    }
  );
  const beats = require("../lib/utility-pedagogical-beats.js");
  const result = registry.validatePageBeatMaterialClosure(page, {
    classifyFromText: beats.classifyPedagogicalBeat
  });
  const unassignedKeys = result.diagnostics.unassigned_materials.map((row) => row.material_key);
  assert.equal(unassignedKeys.includes("a1_m1"), false);
  assert.equal(unassignedKeys.includes("A1-M1"), false);
});

test("diagnostics: render-assigned table is not reported as conflict or empty-beat false positive", () => {
  const page = activityPage(
    {
      text: "RNA overview.",
      classification_table:
        "| Genome type | Example virus |\n| --- | --- | --- |\n| Positive-sense | HCV |",
      checklist: "- criterion one",
      _material_types: {
        text: "text",
        classification_table: "classification_table",
        checklist: "checklist"
      }
    },
    {
      archetype: "understand",
      beats: [
        { function: "explanation" },
        { function: "guided_practice" },
        { function: "verification" }
      ]
    }
  );
  const beats = require("../lib/utility-pedagogical-beats.js");
  const result = registry.validatePageBeatMaterialClosure(page, {
    classifyFromText: beats.classifyPedagogicalBeat
  });
  assert.equal(result.diagnostics.conflicts.length, 0);
  const emptyFns = result.diagnostics.empty_beats.map((row) => row.episode_function);
  assert.equal(emptyFns.includes("guided_practice"), false);
});

test("diagnostics: unknown material type remains reported when genuinely unassigned", () => {
  const page = activityPage(
    {
      planning_table: "| Step | Action |\n| --- | --- |",
      _material_types: { planning_table: "planning_table" }
    },
    {
      archetype: "analyse",
      beats: [{ function: "guided_practice" }]
    }
  );
  const beats = require("../lib/utility-pedagogical-beats.js");
  const result = registry.validatePageBeatMaterialClosure(page, {
    classifyFromText: beats.classifyPedagogicalBeat
  });
  assert.equal(result.outcome, "warn");
  assert.equal(result.diagnostics.unassigned_materials.length, 1);
  assert.equal(result.diagnostics.unassigned_materials[0].material_key, "planning_table");
});
