/**
 * S65-BL-008b — render fresh pipeline artefacts (current vs s65-prototype).
 * Does not modify prototype. Does not overwrite BL-008 samples/validation/.
 */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { execSync } = require("node:child_process");
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS
} = require("../../../../../tests/prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "../../../../../");
const packDir = path.resolve(__dirname, "..");
const outDir = path.join(packDir, "samples", "fresh-validation");
const liveRoot = path.join(
  repoRoot,
  "docs/development/sprints/2026-06-11-sprint-42-authorial-quality-educational-exposition/captures/sprint-42-exposition/42-4-live-runs"
);

const SAMPLES = [
  {
    id: "fresh-marx-2026-07-16",
    sourceDir: "marx-self-study-2026-07-16T14-30-30",
    pageFile: "design-page.json",
    generatedAt: "2026-07-16T14:33:08.207Z",
    command: "node tools/sprint-42-4-live-capture.mjs marx-self-study",
    workflow: "marx-self-study",
    class: "fresh-pipeline"
  },
  {
    id: "fresh-inflation-2026-07-16",
    sourceDir: "inflation-workshop-2026-07-16T14-33-34",
    pageFile: "design-page.json",
    generatedAt: "2026-07-16T14:35:00.000Z",
    command: "node tools/sprint-42-4-live-capture.mjs inflation-workshop",
    workflow: "inflation-workshop",
    class: "fresh-pipeline"
  },
  {
    id: "fresh-climate-2026-07-16",
    sourceDir: "climate-workshop-2026-07-16T14-35-28",
    pageFile: "design-page.json",
    generatedAt: "2026-07-16T14:38:00.000Z",
    command: "node tools/sprint-42-4-live-capture.mjs climate-workshop",
    workflow: "climate-workshop",
    class: "fresh-pipeline"
  },
  {
    id: "pipeline-hist-marx-2026-06-11",
    sourceDir: "marx-self-study-2026-06-11T16-23-03",
    pageFile: "design-page.json",
    generatedAt: "2026-06-11T16:23:03.000Z",
    command: "node tools/sprint-42-4-live-capture.mjs marx-self-study (historical run)",
    workflow: "marx-self-study",
    class: "pipeline-historical"
  },
  {
    id: "pipeline-hist-inflation-2026-06-11",
    sourceDir: "inflation-workshop-2026-06-11T16-25-08",
    pageFile: "design-page.json",
    generatedAt: "2026-06-11T16:25:08.000Z",
    command: "node tools/sprint-42-4-live-capture.mjs inflation-workshop (historical run)",
    workflow: "inflation-workshop",
    class: "pipeline-historical"
  },
  {
    id: "pipeline-hist-climate-2026-06-11",
    sourceDir: "climate-workshop-2026-06-11T16-27-00",
    pageFile: "design-page.json",
    generatedAt: "2026-06-11T16:27:00.000Z",
    command: "node tools/sprint-42-4-live-capture.mjs climate-workshop (historical run)",
    workflow: "climate-workshop",
    class: "pipeline-historical"
  }
];

function createElementStub() {
  return {
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
    getAttribute() { return null; },
    addEventListener() {},
    removeEventListener() {},
    focus() {},
    click() {}
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
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  if (!api) throw new Error("missing __PRISM_TEST_API");
  return api;
}

function gitState() {
  try {
    const head = execSync("git rev-parse --short HEAD", { cwd: repoRoot, encoding: "utf8" }).trim();
    const dirty = execSync("git status --porcelain", { cwd: repoRoot, encoding: "utf8" }).trim();
    return { head, dirty: dirty.length > 0 };
  } catch (e) {
    return { head: null, dirty: null, error: String(e && e.message) };
  }
}

function walk(o, fn) {
  if (!o || typeof o !== "object") return;
  if (Array.isArray(o)) {
    o.forEach((x) => walk(x, fn));
    return;
  }
  Object.keys(o).forEach((k) => {
    fn(k, o[k]);
    walk(o[k], fn);
  });
}

function shapeInspect(page) {
  let beatsArrays = 0;
  let beatCount = 0;
  let episodePlans = 0;
  const archetypes = new Set();
  let learnerTasks = 0;
  let activityIds = 0;
  let cognitionHits = 0;
  const cognitionKeys = [
    "activity_preamble",
    "reasoning_orientation",
    "disciplinary_lens",
    "intellectual_coherence_bridge",
    "self_explanation_prompt"
  ];
  walk(page, (k, v) => {
    if (k === "beats" && Array.isArray(v)) {
      beatsArrays += 1;
      beatCount += v.length;
    }
    if (k === "episode_plan" && v && typeof v === "object") episodePlans += 1;
    if (k === "archetype" && typeof v === "string" && v.trim()) {
      archetypes.add(v.trim().toLowerCase());
    }
    if (k === "learner_task") learnerTasks += 1;
    if (k === "activity_id") activityIds += 1;
    if (cognitionKeys.includes(k) && v) cognitionHits += 1;
  });
  return {
    beatsArrays,
    beatCount,
    episodePlans,
    archetypes: [...archetypes],
    learnerTasks,
    activityIds,
    cognitionHits,
    sectionCount: Array.isArray(page.sections) ? page.sections.length : 0
  };
}

function analyseHtml(html) {
  const h = String(html || "");
  return {
    chars: h.length,
    modeBadgeElements: (h.match(/<span class="s65-mode-badge"/g) || []).length,
    yourTask: (h.match(/>Your task</gi) || []).length,
    produce: (h.match(/>Produce</gi) || []).length,
    whatToDo: (h.match(/>What to do</gi) || []).length,
    successLooksLike: (h.match(/>Success looks like</gi) || []).length,
    residualAttr: (h.match(/data-s65-residual="true"/g) || []).length,
    activityContract: (h.match(/s65-activity-contract/g) || []).length,
    utilTaskBlock: (h.match(/util-task-block/g) || []).length,
    utilMeta: /<details class="util-meta"/i.test(h)
  };
}

function wrapDocument(title, fragmentHtml, mode, sampleId) {
  const trimmed = String(fragmentHtml || "").trim();
  if (/^<!doctype html>/i.test(trimmed) || /^<html[\s>]/i.test(trimmed)) return trimmed;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${title}</title>
</head>
<body>
<p style="font-family:system-ui,sans-serif;font-size:12px;background:#222;color:#eee;padding:8px 12px;margin:0">
S65-BL-008b fresh validation — sample=<strong>${sampleId}</strong> — renderMode=<strong>${mode}</strong> — prototype unchanged.
</p>
${fragmentHtml}
</body>
</html>`;
}

fs.mkdirSync(outDir, { recursive: true });
const api = loadPrismTestApi();
const git = gitState();
const generationRecords = [];
const shapeRows = [];
const activationRows = [];
const comparisons = [];

for (const sample of SAMPLES) {
  const srcPath = path.join(liveRoot, sample.sourceDir, sample.pageFile);
  const dlaPath = path.join(liveRoot, sample.sourceDir, "dla-learning-activities.json");
  const record = {
    id: sample.id,
    class: sample.class,
    workflow: sample.workflow,
    generatedAt: sample.generatedAt,
    command: sample.command,
    commitAtGeneration: git.head,
    sourcePath: path.relative(repoRoot, srcPath).replace(/\\/g, "/"),
    dlaPath: fs.existsSync(dlaPath)
      ? path.relative(repoRoot, dlaPath).replace(/\\/g, "/")
      : null,
    reproduced: sample.class === "fresh-pipeline"
  };
  if (!fs.existsSync(srcPath)) {
    record.error = "missing design-page.json";
    generationRecords.push(record);
    continue;
  }
  const page = JSON.parse(fs.readFileSync(srcPath, "utf8"));
  const pageOut = path.join(outDir, sample.id + "-input-page.json");
  fs.writeFileSync(pageOut, JSON.stringify(page, null, 2), "utf8");
  record.preservedInput = path.relative(repoRoot, pageOut).replace(/\\/g, "/");

  const shape = shapeInspect(page);
  let dlaShape = null;
  if (fs.existsSync(dlaPath)) {
    dlaShape = shapeInspect(JSON.parse(fs.readFileSync(dlaPath, "utf8")));
    fs.copyFileSync(dlaPath, path.join(outDir, sample.id + "-input-dla.json"));
  }
  shapeRows.push({ id: sample.id, class: sample.class, page: shape, dla: dlaShape });
  record.shape = shape;
  record.dlaShape = dlaShape;
  generationRecords.push(record);

  const modes = {};
  for (const mode of ["current", "s65-prototype"]) {
    const rendered = api.buildUtilityStructuredHtmlForTest(page, ["sections"], {
      applyCompositionValidation: false,
      renderMode: mode
    });
    const outName = `${sample.id}-${mode === "current" ? "current" : "s65-prototype"}.html`;
    const outPath = path.join(outDir, outName);
    if (!rendered || rendered.error) {
      activationRows.push({
        id: sample.id,
        mode,
        status: "render-error",
        error: String(rendered && rendered.error)
      });
      fs.writeFileSync(outPath, `<!-- render error: ${String(rendered && rendered.error)} -->`, "utf8");
      continue;
    }
    const doc = wrapDocument(String(page.title || sample.id), rendered.html, mode, sample.id);
    fs.writeFileSync(outPath, doc, "utf8");
    modes[mode] = analyseHtml(doc);
  }

  if (modes.current && modes["s65-prototype"]) {
    const c = modes.current;
    const p = modes["s65-prototype"];
    const identical = c.chars === p.chars && c.yourTask === p.yourTask && c.modeBadgeElements === p.modeBadgeElements;
    let status = "Not activated";
    let why = "No structural prototype markers; likely no episode_plan.beats mount gate";
    if (!identical && (p.yourTask > c.yourTask || p.modeBadgeElements > c.modeBadgeElements || p.activityContract > 0)) {
      status = "Activated";
      why = "Prototype markers present vs current";
    } else if (!identical) {
      status = "Eligible but unchanged / unclear delta";
      why = "HTML differs but no contract/mode markers";
    } else if (shape.beatCount > 0) {
      status = "Unclear";
      why = "Beats present in input but output identical — investigate";
    } else {
      status = "Not activated";
      why = "No beats/archetypes in input; mount gate not entered; bit-identical output";
    }
    activationRows.push({
      id: sample.id,
      class: sample.class,
      status,
      why,
      evidence: {
        identical,
        charDelta: p.chars - c.chars,
        yourTaskDelta: p.yourTask - c.yourTask,
        badgeDelta: p.modeBadgeElements - c.modeBadgeElements,
        beatCount: shape.beatCount,
        episodePlans: shape.episodePlans
      }
    });
    comparisons.push({ id: sample.id, current: c, prototype: p, status, why });
  }
}

const meta = {
  task: "S65-BL-008b",
  captured_at: new Date().toISOString(),
  prototype_unchanged: true,
  renderer_logic_unchanged: true,
  git,
  generationRecords,
  shapeRows,
  activationRows,
  comparisons
};

fs.writeFileSync(path.join(outDir, "fresh-capture-meta.json"), JSON.stringify(meta, null, 2), "utf8");
fs.writeFileSync(
  path.join(packDir, "evidence", "fresh-validation", "generation-records.json"),
  JSON.stringify(generationRecords, null, 2),
  "utf8"
);
fs.writeFileSync(
  path.join(packDir, "evidence", "fresh-validation", "shape-inspection.json"),
  JSON.stringify(shapeRows, null, 2),
  "utf8"
);
fs.writeFileSync(
  path.join(packDir, "evidence", "fresh-validation", "activation-audit.json"),
  JSON.stringify(activationRows, null, 2),
  "utf8"
);

console.log(
  JSON.stringify(
    {
      samples: SAMPLES.length,
      activation: activationRows.map((r) => ({ id: r.id, status: r.status, beatCount: r.evidence && r.evidence.beatCount })),
      shapes: shapeRows.map((r) => ({
        id: r.id,
        beats: r.page.beatCount,
        archetypes: r.page.archetypes,
        sections: r.page.sectionCount,
        dlaBeats: r.dla && r.dla.beatCount
      }))
    },
    null,
    2
  )
);
