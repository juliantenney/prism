/**
 * Bounded Sprint 16 E2E smoke: render page fixtures through Utilities HTML path
 * and assert shape semantics (domain-agnostic).
 */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const fixturesDir = path.join(repoRoot, "tests", "fixtures", "page-render");
const outDir = path.join(repoRoot, "tests", "output", "sprint-16-e2e");

const SCENARIOS = [
  {
    id: "research-briefing",
    label: "Research briefing page",
    fixture: "shape-metadata-with-body.json",
    sectionOrder: null
  },
  {
    id: "ld-learner-page",
    label: "Learning Design learner page (structured activities)",
    fixture: "ld-learning-activities-assessment.json",
    sectionOrder: null
  },
  {
    id: "ld-facilitator-page",
    label: "Learning Design facilitator-oriented page",
    fixture: "ld-learning-activities-assessment.json",
    sectionOrder: null,
    mutate(parsed) {
      parsed.page_profile = "facilitator";
      parsed.title = "Facilitator run sheet — workshop scenarios";
      return parsed;
    }
  },
  {
    id: "assessment-oriented",
    label: "Assessment-oriented page",
    fixture: "shape-structured-assessment-mcq.json",
    sectionOrder: null
  }
];

const PAGE_METADATA_ORDER = [
  "sections",
  "source_artefacts",
  "constraints_applied",
  "generation_notes"
];

function createElementStub() {
  return {
    value: "",
    textContent: "",
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
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
  const documentStub = {
    readyState: "complete",
    addEventListener() {},
    createElement: () => createElementStub(),
    getElementById: () => createElementStub(),
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild() {}, removeChild() {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener() {},
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
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

function assertNoParagraphListNesting(html) {
  const chunks = String(html || "").split(/<\/p>/i);
  for (const chunk of chunks) {
    if (!/<p\b/i.test(chunk)) continue;
    const insideP = chunk.replace(/^[\s\S]*?<p[^>]*>/i, "");
    if (/<ul\b/i.test(insideP)) {
      throw new Error("<ul> found inside open <p>");
    }
  }
  if (/<ul\b[\s\S]*?<\/ul>\s*<\/p>/i.test(html)) {
    throw new Error("</ul> immediately before </p>");
  }
}

function assertNoOrphanListItems(html) {
  let stripped = String(html || "");
  stripped = stripped.replace(/<ul class="util-checkbox-list"[^>]*>[\s\S]*?<\/ul>/gi, "");
  stripped = stripped.replace(/<ul[^>]*>[\s\S]*?<\/ul>/gi, "");
  stripped = stripped.replace(/<ol[^>]*>[\s\S]*?<\/ol>/gi, "");
  if (/<li\b/i.test(stripped)) throw new Error("orphan <li> outside lists");
}

function assertMetadataInFoldOnly(html) {
  if (!html.includes("util-meta")) return;
  const body = html.split('<details class="util-meta"')[0];
  if (/source_artefacts|constraints_applied|generation_notes/i.test(body)) {
    throw new Error("metadata key token leaked into main body");
  }
  if (html.includes("Upstream Alpha") || html.includes("Briefing Note")) {
    if (body.includes("Upstream Alpha") || body.includes("Briefing Note")) {
      throw new Error("metadata label leaked into main body");
    }
  }
}

function assertNoDomainRendererBranching() {
  const app = fs.readFileSync(appJsPath, "utf8");
  const banned = [
    /researchRenderer/i,
    /learningDesignRenderer/i,
    /renderResearchPage/i,
    /renderLdPage/i,
    /domain\s*===\s*["']research["'][^;]*utilityRender/i
  ];
  for (const re of banned) {
    if (re.test(app)) throw new Error("possible domain-specific renderer branch: " + re);
  }
}

function inspectHtml(html, scenario) {
  const checks = [];

  if (/<ul[^>]*>[\s\S]*?<li>/i.test(html)) checks.push("plain/lists: ul/li present");
  if (/util-checkbox-list/i.test(html) || !scenario.fixture.includes("checkbox")) {
    if (html.includes("☐") || html.includes("checkbox")) {
      if (/util-checkbox-list/.test(html)) checks.push("checkbox: util-checkbox-list");
    }
  }
  if (/<table>[\s\S]*?<\/table>/i.test(html) || !scenario.fixture.includes("table")) {
    if (/<table>/i.test(html)) checks.push("table: <table> rendered");
  }
  if (scenario.id === "assessment-oriented") {
    if (/Option alpha/i.test(html) && !/util-checkbox-list[\s\S]*Option alpha/i.test(html)) {
      checks.push("mcq: options not in checkbox list");
    }
  }
  if (scenario.id === "research-briefing") {
    if (/<ul[^>]*>[\s\S]*?Body bullet/i.test(html)) checks.push("research: body bullets as ul/li");
    if (/<details class="util-meta"/i.test(html)) checks.push("metadata: util-meta fold");
  }
  if (scenario.id === "ld-learner-page" || scenario.id === "ld-facilitator-page") {
    if (/Learning activit/i.test(html) && /Scenario A/i.test(html)) {
      checks.push("ld: structured activities rendered");
    }
    if (scenario.id === "ld-facilitator-page" && /util-checkbox-list/i.test(html)) {
      checks.push("ld-facilitator: activity checklist preserved");
    }
  }

  assertNoParagraphListNesting(html);
  checks.push("semantics: no p/ul nesting");
  assertNoOrphanListItems(html);
  checks.push("semantics: no orphan li");
  assertMetadataInFoldOnly(html);
  checks.push("semantics: metadata fold");

  return checks;
}

function main() {
  fs.mkdirSync(outDir, { recursive: true });
  assertNoDomainRendererBranching();

  const api = loadApi();
  const results = [];
  let failed = false;

  for (const scenario of SCENARIOS) {
    const fixturePath = path.join(fixturesDir, scenario.fixture);
    let parsed = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
    if (typeof scenario.mutate === "function") parsed = scenario.mutate(parsed);
    const order =
      scenario.sectionOrder ||
      (parsed.source_artefacts ? PAGE_METADATA_ORDER : ["sections"]);
    const r = api.buildUtilityStructuredHtmlForTest(parsed, order);
    if (r && r.error) {
      failed = true;
      results.push({ scenario: scenario.id, ok: false, error: r.error });
      continue;
    }
    const html = String(r.html || "");
    const outPath = path.join(outDir, scenario.id + ".html");
    fs.writeFileSync(outPath, html, "utf8");
    try {
      const checks = inspectHtml(html, scenario);
      results.push({ scenario: scenario.id, label: scenario.label, ok: true, checks, outPath });
    } catch (err) {
      failed = true;
      results.push({
        scenario: scenario.id,
        label: scenario.label,
        ok: false,
        error: String(err.message || err),
        outPath
      });
    }
  }

  console.log(JSON.stringify({ failed, results }, null, 2));
  process.exit(failed ? 1 : 0);
}

main();
