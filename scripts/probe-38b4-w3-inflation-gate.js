/**
 * PR-W3-4 / 38B-6 — Inflation anchor validation (fixture + EV captures, no LLM).
 * Run: node scripts/probe-38b4-w3-inflation-gate.js
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const repoRoot = path.resolve(__dirname, "..");
const sprintDir = path.join(
  repoRoot,
  "docs/development/sprints/2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation"
);

const PATHS = {
  golden: path.join(repoRoot, "tests/fixtures/page-render/ld-inflation-workshop-page-full.json"),
  goldenMerged: null,
  ev01: path.join(sprintDir, "fixtures/ev-38b4-01-design-page.json"),
  csvBad: path.join(repoRoot, "tests/fixtures/page-render/ld-inflation-workshop-csv-worksheet-page.json"),
  upstream: path.join(
    repoRoot,
    "tests/fixtures/page-render/ld-inflation-workshop-upstream-learning-activities.json"
  ),
  gamPipeline: path.join(sprintDir, "fixtures/ev-38b4-01-pipeline-gam.txt"),
  renderExcerpt: path.join(sprintDir, "fixtures/ev-38b4-01-render-excerpt.html")
};

function mergeMaterialsIntoActivities(page) {
  const p = JSON.parse(JSON.stringify(page));
  const matSection = (p.sections || []).find((s) => s.section_id === "activity_materials");
  const actSection = findLearningActivitiesSection(p);
  if (!matSection || !actSection) return p;
  const byId = {};
  (matSection.content || []).forEach((entry) => {
    const aid = String(entry.activity_id || "").trim();
    if (!aid) return;
    if (!byId[aid]) byId[aid] = {};
    const typeKey = String(entry.type || entry.material_type || "content").replace(/\s+/g, "_");
    const payload = entry.content != null ? entry.content : entry;
    byId[aid][typeKey] = payload;
  });
  const rows = activityRowsFromSection(actSection);
  rows.forEach((row) => {
    const aid = String(row.activity_id || "").trim();
    if (byId[aid]) row.materials = Object.assign({}, byId[aid], row.materials || {});
  });
  return p;
}

function findLearningActivitiesSection(page) {
  return (page.sections || []).find(
    (s) =>
      s &&
      (s.section_id === "learning_activities" || /learning activities/i.test(String(s.heading || "")))
  );
}

function activityRowsFromSection(section) {
  if (!section) return [];
  const content = section.content;
  if (Array.isArray(content)) return content;
  if (content && Array.isArray(content.activities)) return content.activities;
  return [];
}

function analyzeMaterialValue(value, pathLabel) {
  const commaRow = /Scenario\s*\d+,,,|,,,\s*$/m;
  const headers = /^\s*Headers\s*$/im;
  const rows = /^\s*Rows\s*$/im;
  const pipeSep = /\|[^\n]+\|[\s\S]*\n\|/;
  const issues = [];
  if (value == null || value === "") {
    return { path: pathLabel, kind: "empty", issues: ["empty"], pipeOk: false, excerpt: "" };
  }
  if (Array.isArray(value)) {
    const joined = value.map((v) => String(v)).join("\n");
    if (commaRow.test(joined)) issues.push("B4-01-comma-row");
    if (!issues.length && value.every((line) => /^[^|]*,/.test(String(line)))) {
      issues.push("B4-01-csv-array");
    }
    return {
      path: pathLabel,
      kind: "array",
      issues,
      pipeOk: false,
      excerpt: joined.slice(0, 200)
    };
  }
  const s = String(value);
  if (commaRow.test(s)) issues.push("B4-01-comma-row");
  if (headers.test(s) && rows.test(s)) issues.push("B4-02-headers-rows");
  const isTablePath = /_table|comparison_table|analysis_table|impact_table|classification_table|template/i.test(
    pathLabel
  );
  const pipeOk = pipeSep.test(s);
  if (isTablePath && !pipeOk && s.length > 40) issues.push("L4-05-no-pipe");
  if (s.length < 24) issues.push("placeholder-short");
  return { path: pathLabel, kind: "string", issues, pipeOk, excerpt: s.slice(0, 220).replace(/\n/g, " ") };
}

function collectPageMaterials(page) {
  const rows = [];
  const la = findLearningActivitiesSection(page);
  if (la) {
    activityRowsFromSection(la).forEach((act) => {
      const aid = act.activity_id || "?";
      const mats = act.materials;
      if (!mats || typeof mats !== "object" || Array.isArray(mats)) {
        rows.push({
          layer: "learning_activities.materials",
          activity_id: aid,
          field: "(empty)",
          analysis: analyzeMaterialValue(null, `${aid}.materials`)
        });
        return;
      }
      Object.keys(mats).forEach((key) => {
        rows.push({
          layer: "learning_activities.materials",
          activity_id: aid,
          field: key,
          analysis: analyzeMaterialValue(mats[key], `${aid}.materials.${key}`)
        });
      });
    });
  }
  const am = (page.sections || []).find((s) => s.section_id === "activity_materials");
  if (am && Array.isArray(am.content)) {
    am.content.forEach((entry, i) => {
      const aid = entry.activity_id || "?";
      const key = entry.type || entry.material_type || `entry_${i}`;
      const val = entry.content != null ? entry.content : entry;
      rows.push({
        layer: "activity_materials.section",
        activity_id: aid,
        field: key,
        analysis: analyzeMaterialValue(val, `sections.activity_materials[${aid}].${key}`)
      });
    });
  }
  return rows;
}

function b4Summary(pageRows) {
  let b401 = false;
  let b402 = false;
  let b403 = true;
  const tableRows = pageRows.filter((r) =>
    /_table|classification_table|comparison_table|analysis_table|impact_table/i.test(r.field)
  );
  tableRows.forEach((r) => {
    if (r.analysis.issues.some((i) => i.startsWith("B4-01"))) b401 = true;
    if (r.analysis.issues.some((i) => i.startsWith("B4-02"))) b402 = true;
    if (!r.analysis.pipeOk && r.analysis.kind === "string" && r.analysis.excerpt.length > 40) {
      b403 = false;
    }
  });
  return { B4_01: b401, B4_02: b402, B4_03: !b403 && tableRows.length > 0 ? false : b403 };
}

function membershipCheck(page, upstreamIds) {
  const la = findLearningActivitiesSection(page);
  const composed = new Set(
    activityRowsFromSection(la)
      .map((r) => String(r.activity_id || "").trim())
      .filter(Boolean)
  );
  const missing = upstreamIds.filter((id) => !composed.has(id));
  return { upstream: upstreamIds, composed: [...composed], missing, pass: missing.length === 0 };
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

function loadLibs() {
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
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
  const windowStub = {
    document: documentStub,
    addEventListener: () => {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem: () => {} },
    URL: { createObjectURL: () => "", revokeObjectURL: () => {} },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    }
  };
  windowStub.window = windowStub;
  sandbox.window = windowStub;
  sandbox.document = documentStub;
  vm.createContext(sandbox);
  [
    "lib/sprint38-visual-affordances.js",
    "lib/ld-table-fidelity.js",
    "lib/ld-materials-copy.js",
    "lib/ld-math-render.js",
    "lib/ld-self-directed-rhetoric.js",
    "lib/ld-design-page-compose-contract.js"
  ].forEach((rel) => {
    vm.runInContext(fs.readFileSync(path.join(repoRoot, rel), "utf8"), sandbox, { filename: rel });
  });
  vm.runInContext(fs.readFileSync(path.join(repoRoot, "app.js"), "utf8"), sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  if (!api) throw new Error("__PRISM_TEST_API missing");
  return {
    fidelity: require(path.join(repoRoot, "lib/design-page-materials-fidelity.js")),
    s38: require(path.join(repoRoot, "lib/sprint38-visual-affordances.js")),
    api
  };
}

function validatePage(label, page, upstreamIds, libs) {
  const merged = mergeMaterialsIntoActivities(page);
  const pageRows = collectPageMaterials(merged);
  const b4 = b4Summary(pageRows);
  const mem = membershipCheck(merged, upstreamIds);
  const rich = libs.fidelity.pageActivityMaterialsHaveRichContent(merged);
  const placeholder = libs.fidelity.pageActivityMaterialsLookPlaceholderOnly(merged);
  const s38 = {
    schema: merged.visual_affordance_schema_version || null,
    reviewCount: Array.isArray(merged.activities_visual_review)
      ? merged.activities_visual_review.length
      : 0,
    affordanceCount: Array.isArray(merged.visual_affordances) ? merged.visual_affordances.length : 0
  };
  let affordanceValid = { valid: true, errors: [] };
  if (merged.visual_affordances && merged.visual_affordances.length) {
    affordanceValid = libs.s38.validatePageVisualAffordances({
      visual_affordances: merged.visual_affordances
    });
  }
  const assessment = (merged.sections || []).find(
    (s) => s.section_id === "assessment_check" || /assessment/i.test(String(s.heading || ""))
  );
  let assessmentShape = { present: false, itemsArray: null };
  if (assessment) {
    const c = assessment.content;
    if (c && typeof c === "object" && !Array.isArray(c) && Array.isArray(c.items)) {
      assessmentShape = { present: true, itemsArray: true };
    }
  }
  const pass =
    !b4.B4_01 &&
    !b4.B4_02 &&
    b4.B4_03 &&
    mem.pass &&
    rich &&
    !placeholder &&
    (s38.schema === null || s38.schema === "38.4") &&
    affordanceValid.valid;
  return {
    label,
    pass,
    b4,
    membership: mem,
    materials: { rich, placeholderOnly: placeholder },
    sprint38: s38,
    affordanceValidation: affordanceValid,
    assessmentShape,
    tableFieldCount: pageRows.filter((r) => /table/i.test(r.field)).length,
    pipeTableCount: pageRows.filter((r) => r.analysis.pipeOk).length
  };
}

function probeDesignPage(api) {
  const md = fs.readFileSync(
    path.join(repoRoot, "domains/learning-design/domain-learning-design-step-patterns.md"),
    "utf8"
  );
  const m = md.match(/## 13\. Design Page[\s\S]*?### Prompt Factory\s*```json\s*([\s\S]*?)\s*```/);
  const factory = JSON.parse(m[1].trim());
  const wf = {
    goal: "Learner self-study inflation workshop",
    desiredOutputs: "page",
    workflowBriefResolution: {
      resolvedFactors: { delivery_context: "self_directed", learning_environments: ["self_study"] }
    }
  };
  const step = { canonical_step_id: "step_design_page", title: "Design Page", outputName: "page" };
  const seeded = api.buildSeededStepPromptForWorkflowStep({
    workflowName: "Inflation gate",
    step,
    matchedPattern: { promptFactory: factory }
  });
  const augmented = api.applyWorkflowStepRuntimePromptAugmentations(seeded, step, wf, {});
  const blocks = [];
  const re = /(?:^|\n)([^\n]+ \(auto-applied\)):/gi;
  let match;
  while ((match = re.exec(augmented)) !== null) blocks.push(match[1].trim());
  return {
    seededChars: seeded.length,
    augmentedChars: augmented.length,
    blockCount: [...new Set(blocks)].length,
    blockTitles: [...new Set(blocks)],
    hasCompose: /LD-DESIGN-PAGE-COMPOSE-CONTRACT \(auto-applied\)/i.test(augmented),
    hasS38: /sprint 38 visual affordance authoring contract \(auto-applied\)/i.test(augmented)
  };
}

function main() {
  const libs = loadLibs();
  const upstream = JSON.parse(fs.readFileSync(PATHS.upstream, "utf8"));
  const upstreamIds = (upstream.activities || upstream.learning_activities || []).map((a) => a.activity_id);

  const ev01 = JSON.parse(fs.readFileSync(PATHS.ev01, "utf8"));
  const ev01Ids = activityRowsFromSection(findLearningActivitiesSection(ev01))
    .map((r) => String(r.activity_id || "").trim())
    .filter(Boolean);

  const artefacts = [
    {
      label: "golden-full-merged",
      page: mergeMaterialsIntoActivities(JSON.parse(fs.readFileSync(PATHS.golden, "utf8"))),
      upstreamIds,
      expectPass: true
    },
    { label: "ev-38b4-01-live", page: ev01, upstreamIds: ev01Ids, expectPass: true },
    {
      label: "csv-worksheet-negative",
      page: JSON.parse(fs.readFileSync(PATHS.csvBad, "utf8")),
      upstreamIds,
      expectPass: false
    }
  ];

  const validations = artefacts.map((a) => {
    const v = validatePage(a.label, a.page, a.upstreamIds, libs);
    v.expectPass = a.expectPass;
    v.gateOk = v.pass === a.expectPass;
    return v;
  });

  const probe = probeDesignPage(libs.api);
  const gatePass = validations.every((v) => v.gateOk);
  const out = {
    measuredAt: new Date().toISOString(),
    programme: "PR-W3-4 Inflation gate",
    gatePass,
    probeDesignPage: probe,
    validations,
    wave3PromptBaseline: {
      postW3_1_seeded: 7745,
      postW3_3_augmented: probe.augmentedChars,
      ev38b4_01_capture_augmented: 22560
    },
    artefacts: {
      golden: PATHS.golden,
      ev01: PATHS.ev01,
      csvBad: PATHS.csvBad,
      gamPipeline: fs.existsSync(PATHS.gamPipeline),
      renderExcerpt: fs.existsSync(PATHS.renderExcerpt)
    }
  };

  console.log(JSON.stringify(out, null, 2));
}

main();
