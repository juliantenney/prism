/**
 * QA defect regression — Learning Journey Design Page shared_authoritative_material.content
 * returned as a structured JSON object instead of a string.
 *
 * Root cause: normalizeNewlines(raw.content) called String(obj) -> "[object Object]"
 * (15 chars < MIN_MATERIAL_CHARS = 40), discarding structured datasets and failing with
 * shared_authoritative_material_too_short.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const shared = require(path.join(repoRoot, "lib", "learning-journey-shared-source.js"));
const designPage = require(path.join(repoRoot, "lib", "learning-journey-design-page.js"));

function createElementStub() {
  return {
    value: "",
    textContent: "",
    innerHTML: "",
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
    click() {}
  };
}

function loadApi() {
  const source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise, _: { debounce: (fn) => fn } };
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener() {},
    createElement: () => createElementStub(),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub());
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild() {}, removeChild() {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
    setTimeout,
    clearTimeout,
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
  for (const rel of [
    "lib/first-class-workflow-family.js",
    "lib/learning-journey-sibling-prompts.js",
    "lib/learning-journey-shared-source.js",
    "lib/learning-journey-design-page.js"
  ]) {
    vm.runInContext(fs.readFileSync(path.join(repoRoot, rel), "utf8"), sandbox, {
      filename: rel
    });
  }
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return { api };
}

function buildNineEconomicDatasetsStructuredCorpus() {
  const datasets = [];
  for (let i = 1; i <= 9; i += 1) {
    const observations = [];
    for (let y = 2015; y <= 2024; y += 1) {
      observations.push({
        year: y,
        region_code: "R" + i,
        policy_index_points: Number((40 + i * 2.5 + (y - 2015) * 1.3).toFixed(2)),
        output_growth_pct: Number((1.2 + i * 0.2 + ((y % 3) - 1) * 0.4).toFixed(2)),
        confounder_rainfall_mm: 620 + i * 15 + (y - 2015) * 7
      });
    }
    datasets.push({
      dataset_id: "ECON_DS_" + i,
      title: "Illustrative Regional Economic Panel " + i + " (fictional)",
      measurement_units: {
        policy_index_points: "index points (0-100 scale)",
        output_growth_pct: "annual percentage change (%)",
        confounder_rainfall_mm: "millimetres per year (mm/yr)"
      },
      disclosure_constraint:
        i <= 3
          ? "Disclose in C1 initial correlation inspection."
          : i <= 6
            ? "Hold until C2 confounding analysis."
            : "Hold until C3 independent causal judgement.",
      integrity_notes:
        "Fictional synthetic series for correlation vs causation instruction; preserve exact values and units.",
      observations
    });
  }
  return {
    corpus_label: "Illustrative Economic Evidence Corpus: Correlation and Causation (fictional)",
    disclosure_rules: [
      "Do not reveal C2 confounders during C1 initial correlation inspection.",
      "Preserve exact measurement units across all nine datasets."
    ],
    integrity_rules: [
      "Treat all nine datasets as fictional synthetic teaching data.",
      "Do not alter numerical observations or invent causal proofs."
    ],
    datasets
  };
}

function buildDesignPageWithSharedMaterial(sharedMaterial) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "learning_journey",
    title: "Correlation and Causation in Economic Evidence",
    shared_authoritative_material: sharedMaterial,
    editorial_opening_image: {
      decision: "skip",
      subject: "",
      context: "",
      caption_intent: "",
      alt_text: "",
      detailed_description: ""
    },
    activities: [],
    sections: [
      {
        section_id: "journey_intro",
        title: "Exploring economic evidence",
        order: 1,
        exposition: "Examine how observed associations differ from causal claims."
      },
      {
        section_id: "exp_1",
        title: "Inspecting associations",
        order: 2,
        exposition: "Start by comparing regional series before testing confounders."
      }
    ],
    commissions: [
      {
        commission_id: "c1",
        section_id: "exp_1",
        order: 1,
        title: "Initial correlation inspection",
        product_id: "practice",
        status: "supported",
        specification_text:
          "Approximate learner time: 30 minutes. Learners inspect early regional panels and record an initial judgement on whether association implies causation.",
        journey_context_text:
          "Established scenario facts: fictional regional economic panels with policy index points and annual output growth percentages.",
        dependencies: ""
      }
    ],
    learning_journey: {
      design_intent: "90-minute Learning Journey on correlation and causation.",
      continuity: "Nine canonical economic datasets disclosed progressively.",
      journal: { enabled: false, title: "Your Learning Journal", entries: [] }
    },
    assembly_state: {
      current_stage: "design_page",
      enriched_by: [
        "learning_requirements",
        "learning_progression",
        "learning_elements",
        "learning_commissions",
        "design_page"
      ],
      calls_model: true
    }
  };
}

function parentJourneyWorkflow(id) {
  return {
    id,
    name: "Correlation and Causation LJ",
    product: "learning_journey",
    steps: [{ id: "s5", title: "Design Page", outputName: "page", canonical_step_id: "step_design_page" }],
    workflowBriefResolution: {
      initialBrief: { product: "learning_journey", sourceContext: "" },
      resolvedFactors: { product: "learning_journey", source_context: "" }
    },
    artefacts: ""
  };
}

test("existing valid string shared_authoritative_material.content continues to pass", () => {
  const text =
    "Illustrative economic corpus (fictional): Region A growth 2.4%, 2.8%, 3.1% with policy index 45, 48, 52. Preserve units.";
  const page = buildDesignPageWithSharedMaterial({ status: "generated", content: text });
  const extracted = shared.extractSharedAuthoritativeMaterialFromPage(page);
  assert.equal(extracted.ok, true);
  assert.equal(extracted.kind, "material");
  assert.equal(extracted.normalizedFromStructured, false);
  assert.equal(extracted.content, text);
});

test("substantial structured object (~18k+ chars, 9 datasets) is losslessly serialised and passes", () => {
  const structured = buildNineEconomicDatasetsStructuredCorpus();
  const serializedSize = JSON.stringify(structured, null, 2).length;
  assert.ok(serializedSize > 15000, "Expected substantial ~18k corpus; got " + serializedSize);

  const page = buildDesignPageWithSharedMaterial({
    status: "generated",
    content: structured
  });
  const extracted = shared.extractSharedAuthoritativeMaterialFromPage(page);
  assert.equal(extracted.ok, true, (extracted.errors || []).join("; "));
  assert.equal(extracted.kind, "material");
  assert.equal(extracted.normalizedFromStructured, true);
  assert.equal(typeof extracted.content, "string");
  assert.ok(!extracted.content.includes("[object Object]"));

  // Lossless round-trip: every dataset, observation, unit, disclosure and integrity rule preserved.
  const roundTripped = JSON.parse(extracted.content);
  assert.deepEqual(roundTripped, structured);
  assert.equal(roundTripped.datasets.length, 9);
  assert.equal(roundTripped.datasets[8].dataset_id, "ECON_DS_9");
  assert.match(extracted.content, /millimetres per year \(mm\/yr\)/);
  assert.match(extracted.content, /Hold until C3 independent causal judgement/);
});

test("empty or genuinely insufficient structured and string content still fails appropriately", () => {
  const emptyCases = [
    { status: "generated", content: "" },
    { status: "generated", content: "   " },
    { status: "generated", content: null },
    { status: "generated", content: {} },
    { status: "generated", content: [] },
    { status: "generated", content: { datasets: [], notes: "   ", rules: [null, ""] } }
  ];
  for (const sm of emptyCases) {
    const res = shared.extractSharedAuthoritativeMaterialFromPage(
      buildDesignPageWithSharedMaterial(sm)
    );
    assert.equal(res.ok, false, "Expected empty failure for " + JSON.stringify(sm));
    assert.deepEqual(res.errors, ["shared_authoritative_material_content_empty"]);
  }

  const shortCases = [
    { status: "generated", content: "too short" },
    { status: "generated", content: { note: "short" } },
    { status: "generated", content: { k1: "a", k2: "b", k3: "c" } }
  ];
  for (const sm of shortCases) {
    const res = shared.extractSharedAuthoritativeMaterialFromPage(
      buildDesignPageWithSharedMaterial(sm)
    );
    assert.equal(res.ok, false, "Expected too_short failure for " + JSON.stringify(sm));
    assert.deepEqual(res.errors, ["shared_authoritative_material_too_short"]);
  }
});

test("generated Design Page with structured content recovers without regeneration and survives persistence + commissioning handoff", () => {
  const { api } = loadApi();
  const wf = parentJourneyWorkflow("wf-lj-econ-recovery");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);

  const structured = buildNineEconomicDatasetsStructuredCorpus();
  const rawPage = buildDesignPageWithSharedMaterial({
    status: "generated",
    content: structured
  });
  const pastedCapture =
    "```json\n" +
    JSON.stringify(rawPage, null, 2) +
    "\n```\nSTEP 5 OUTPUT: learning_journey_page";

  // Exact browser paste/storage path (recovers current Design Page JSON verbatim).
  const stepRow = wf.steps[0];
  const stored = api.parseWorkflowRunPageStructureCaptureForStorage(pastedCapture, stepRow, wf);
  assert.equal(stored.ok, true, (stored.errors || []).join("; "));
  assert.ok(stored.sharedSource && stored.sharedSource.written === true);

  // Stored Design Page JSON normalises content to canonical string without data loss.
  assert.equal(typeof stored.parsed.shared_authoritative_material.content, "string");
  assert.deepEqual(JSON.parse(stored.parsed.shared_authoritative_material.content), structured);

  // Persisted onto parent workflow source_context and readable by downstream commissioning.
  const persisted = api.readLearningJourneyAuthoritativeSourceContext(wf.id);
  assert.equal(typeof persisted, "string");
  assert.deepEqual(JSON.parse(persisted), structured);
  assert.equal(wf.workflowBriefResolution.resolvedFactors.source_context, persisted);
  assert.equal(wf.workflowBriefResolution.initialBrief.sourceContext, persisted);

  // Downstream GAM handoff receives complete canonical material.
  const gamSection = shared.composeAuthoritativeSharedSourceGamHandoffSection(persisted);
  assert.match(gamSection, /ECON_DS_1/);
  assert.match(gamSection, /ECON_DS_9/);
  assert.match(gamSection, /millimetres per year \(mm\/yr\)/);
  assert.match(gamSection, /Do not reveal C2 confounders during C1/);
});

test("Design Page prompts unambiguously require shared_authoritative_material.content to be a single JSON string", () => {
  const dpPrompt = designPage.buildLearningJourneyDesignPagePrompt();
  assert.match(
    dpPrompt,
    /shared_authoritative_material\.content:.*single JSON string.*not a nested JSON object or array/i
  );

  const sectionNew = shared.composeAuthoritativeSharedSourceDesignPageSection("");
  assert.match(sectionNew, /single JSON string.*not a nested JSON object or array/i);

  const sectionExisting = shared.composeAuthoritativeSharedSourceDesignPageSection(
    "Existing canonical material with sufficient length for authoritative source."
  );
  assert.match(sectionExisting, /single JSON string.*not a nested JSON object or array/i);
});
