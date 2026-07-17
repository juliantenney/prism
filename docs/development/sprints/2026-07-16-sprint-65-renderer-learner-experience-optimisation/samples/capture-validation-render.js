/**
 * Sprint 65 S65-BL-008 — capture current vs s65-prototype for validation corpus.
 * Does not overwrite samples/prototype/ (BL-007).
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
const outDir = path.join(packDir, "samples", "validation");
const appJsPath = path.join(repoRoot, "app.js");

const FIXTURES = [
  {
    id: "rna-hcv",
    file: "tests/fixtures/page-render/rna-hcv-assembled-vnext-materials-page.json",
    why: "Core rich reference; four archetypes; residuals/orphans"
  },
  {
    id: "rna-assessment",
    file: "tests/fixtures/page-render/ld-rna-hcv-assessment-page.json",
    why: "Assessment-heavy companion; sparse activities"
  },
  {
    id: "kitchen-sink",
    file: "tests/fixtures/page-render/renderer-kitchen-sink-page.json",
    why: "Unknown materials; cognition; KS-A4 sparse; diagnostics"
  },
  {
    id: "marx-beat",
    file: "tests/fixtures/page-render/marx-beat-render-page.json",
    why: "Beat-first; rich cognition; Marx A3 class"
  },
  {
    id: "marx-self-study",
    file: "tests/fixtures/page-render/marx-self-study-page.json",
    why: "Additional rich Marx learner page"
  },
  {
    id: "inflation",
    file: "tests/fixtures/page-render/ld-inflation-workshop-page-full.json",
    why: "Rich workshop; tables/templates"
  },
  {
    id: "climate",
    file: "tests/fixtures/page-render/ld-climate-misconception-discussion-page.json",
    why: "Discussion / prompt-set patterns"
  },
  {
    id: "self-directed",
    file: "tests/fixtures/page-render/self-directed-activity-framing-page.json",
    why: "Framing / PEL; weak or no archetype"
  },
  {
    id: "shape-metadata",
    file: "tests/fixtures/page-render/shape-production-metadata.json",
    why: "Sparse shape + metadata-heavy diagnostics"
  },
  {
    id: "confidence-multitable",
    file: "tests/fixtures/page-render/confidence-interval-a2-multitable-page.json",
    why: "Multi-table / residual-adjacent richness"
  },
  {
    id: "sequencing-rollout",
    file: "tests/fixtures/page-render/sequencing-rollout-learner-page.json",
    why: "Session timeline / sequencing presentation"
  },
  {
    id: "shape-assessment-mcq",
    file: "tests/fixtures/page-render/shape-structured-assessment-mcq.json",
    why: "Assessment-structured sparse shape"
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

function wrapDocument(title, fragmentHtml, mode) {
  const trimmed = String(fragmentHtml || "").trim();
  if (/^<!doctype html>/i.test(trimmed) || /^<html[\s>]/i.test(trimmed)) {
    return trimmed;
  }
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${title}</title>
</head>
<body>
<p style="font-family:system-ui,sans-serif;font-size:12px;background:#222;color:#eee;padding:8px 12px;margin:0">
S65-BL-008 validation capture — renderMode=<strong>${mode}</strong> — prototype unchanged — not production-ready.
</p>
${fragmentHtml}
</body>
</html>
`;
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

function count(html, re) {
  const m = String(html || "").match(re);
  return m ? m.length : 0;
}

function analyseHtml(html) {
  const h = String(html || "");
  const body = h.split('<details class="util-meta"')[0] || h;
  return {
    chars: h.length,
    brokenDiv: h.includes("<div </div>"),
    modeBadgeElements: count(h, /<span class="s65-mode-badge"/g),
    yourTask: count(h, />Your task</gi),
    produce: count(h, />Produce</gi),
    whatToDo: count(h, />What to do</gi),
    successLooksLike: count(h, />Success looks like</gi),
    yourGoal: count(h, />Your goal</gi),
    roleIdea: count(h, /Understand the idea|Idea</gi),
    roleTry: count(h, />Try it</gi),
    roleCheck: count(h, /Check your work|>Check</gi),
    roleExtend: count(h, /Extend your thinking|Apply elsewhere/gi),
    alsoAvailable: count(h, /Also available/gi),
    residualAttr: count(h, /data-s65-residual="true"/g),
    learningJourneyH2: count(h, />Learning Journey</gi),
    utilMeta: /<details class="util-meta"/i.test(h),
    utilTableScroll: count(h, /util-table-scroll/g),
    utilTaskBlock: count(h, /util-task-block/g),
    activityContract: count(h, /s65-activity-contract/g),
    bodyBeforeMetaLen: body.length
  };
}

fs.mkdirSync(outDir, { recursive: true });
const api = loadPrismTestApi();
const results = [];
const comparisons = [];

for (const item of FIXTURES) {
  const fixturePath = path.join(repoRoot, item.file);
  if (!fs.existsSync(fixturePath)) {
    results.push({ id: item.id, skipped: true, reason: "missing fixture", why: item.why });
    continue;
  }
  const page = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const pair = { id: item.id, why: item.why, file: item.file, modes: {} };
  for (const mode of ["current", "s65-prototype"]) {
    const rendered = api.buildUtilityStructuredHtmlForTest(page, ["sections"], {
      applyCompositionValidation: false,
      renderMode: mode
    });
    if (!rendered || rendered.error) {
      results.push({ id: item.id, mode, error: String(rendered && rendered.error), why: item.why });
      continue;
    }
    const outName = `${item.id}-${mode === "current" ? "current" : "s65-prototype"}.html`;
    const outPath = path.join(outDir, outName);
    const doc = wrapDocument(String(page.title || item.id), rendered.html, mode);
    fs.writeFileSync(outPath, doc, "utf8");
    const markers = analyseHtml(doc);
    results.push({
      id: item.id,
      mode,
      why: item.why,
      output: path.relative(repoRoot, outPath).replace(/\\/g, "/"),
      chars: doc.length,
      markers
    });
    pair.modes[mode] = markers;
  }
  if (pair.modes.current && pair.modes["s65-prototype"]) {
    const c = pair.modes.current;
    const p = pair.modes["s65-prototype"];
    comparisons.push({
      id: item.id,
      why: item.why,
      brokenDivEither: c.brokenDiv || p.brokenDiv,
      modeBadgesGained: p.modeBadgeElements - c.modeBadgeElements,
      yourTaskGained: p.yourTask - c.yourTask,
      produceGained: p.produce - c.produce,
      successLooksLikeLost: c.successLooksLike - p.successLooksLike,
      whatToDoLost: c.whatToDo - p.whatToDo,
      residualAttrs: p.residualAttr,
      journeyH2Delta: p.learningJourneyH2 - c.learningJourneyH2,
      taskBlocksEqual: c.utilTaskBlock === p.utilTaskBlock,
      tablesPresentBoth: c.utilTableScroll > 0 === p.utilTableScroll > 0 || (c.utilTableScroll === 0 && p.utilTableScroll === 0),
      metaBoth: c.utilMeta && p.utilMeta,
      charDelta: p.chars - c.chars
    });
  }
}

const meta = {
  task: "S65-BL-008",
  captured_at: new Date().toISOString(),
  harness: path.relative(repoRoot, __filename).replace(/\\/g, "/"),
  command:
    "node docs/development/sprints/2026-07-16-sprint-65-renderer-learner-experience-optimisation/samples/capture-validation-render.js",
  prototype_unchanged: true,
  feature_switch: {
    option: 'renderMode: "current" | "s65-prototype"',
    default: "current",
    production_default: "current (prototype off)"
  },
  git: gitState(),
  corpus_size: FIXTURES.length,
  results,
  comparisons
};
fs.writeFileSync(path.join(outDir, "capture-meta.json"), JSON.stringify(meta, null, 2), "utf8");
fs.writeFileSync(path.join(outDir, "comparison-markers.json"), JSON.stringify(comparisons, null, 2), "utf8");
console.log(JSON.stringify({ corpus: FIXTURES.length, results: results.length, comparisons: comparisons.length }, null, 2));
console.log(JSON.stringify(comparisons, null, 2));
