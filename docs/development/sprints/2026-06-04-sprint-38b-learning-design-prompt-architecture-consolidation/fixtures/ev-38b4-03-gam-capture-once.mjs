/**
 * EV-38B4-03 — one-shot Inflation GAM live capture (delete after evidence recorded).
 * Run: node docs/development/sprints/2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/ev-38b4-03-gam-capture-once.mjs
 */
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..", "..", "..", "..");
const outTxt = path.join(__dirname, "ev-38b4-03-inflation-gam-live.txt");
const outJson = path.join(__dirname, "ev-38b4-03-inflation-gam-analysis.json");
const model = process.env.PRISM_PROBE_MODEL || "gpt-4.1-mini";

function readEnvKey() {
  const envPath = path.join(repoRoot, ".env.local");
  const raw = fs.readFileSync(envPath, "utf8");
  const m = raw.match(/^OPENAI_API_KEY\s*=\s*(.+)$/m);
  if (!m) throw new Error("OPENAI_API_KEY missing in .env.local");
  let v = m[1].trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1);
  }
  return v;
}

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

function loadApi() {
  const sandbox = { console, setTimeout, clearTimeout, Promise, fetch };
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
    body: { appendChild() {}, removeChild() {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener: () => {},
    location: { hash: "", pathname: "/" },
    _: { debounce: (fn) => fn },
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem: () => {} },
    URL: { createObjectURL: () => "", revokeObjectURL: () => {} },
    Blob: function Blob() {}
  };
  windowStub.window = windowStub;
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  vm.createContext(sandbox);
  for (const f of [
    "ld-table-fidelity.js",
    "ld-materials-copy.js",
    "ld-math-render.js",
    "ld-self-directed-rhetoric.js"
  ]) {
    vm.runInContext(fs.readFileSync(path.join(repoRoot, "lib", f), "utf8"), sandbox, { filename: f });
  }
  vm.runInContext(fs.readFileSync(path.join(repoRoot, "app.js"), "utf8"), sandbox, {
    filename: "app.js"
  });
  return sandbox.window.__PRISM_TEST_API;
}

async function callOpenAI(apiKey, system, user, maxTokens) {
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + apiKey
    },
    body: JSON.stringify({
      model,
      input: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
      max_output_tokens: maxTokens,
      temperature: 0.35
    })
  });
  if (!res.ok) throw new Error("OpenAI " + res.status + ": " + (await res.text()).slice(0, 500));
  const data = await res.json();
  const text = data?.output?.[0]?.content?.[0]?.text;
  if (typeof text !== "string") throw new Error("Unexpected OpenAI response shape");
  return text.trim();
}

function buildInflationLearningActivities() {
  const base = JSON.parse(
    fs.readFileSync(
      path.join(repoRoot, "tests/fixtures/page-render/ld-inflation-workshop-upstream-learning-activities.json"),
      "utf8"
    )
  );
  const specs = {
    A1: [
      { material_id: "M1", type: "scenario", purpose: "Price change scenarios", specification: "Two short household scenarios with numbers." },
      { material_id: "M2", type: "task_cards", purpose: "Warm-up cards", specification: "Six task cards on defining inflation." },
      { material_id: "M3", type: "classification_table", purpose: "Item classification", specification: "Pipe table: Item, Rising price?, Affects students?" }
    ],
    A2: [
      { material_id: "M1", type: "comparison_table", purpose: "Indicator comparison", specification: "Pipe table comparing CPI, PPI, GDP deflator." },
      { material_id: "M2", type: "prompt_set", purpose: "Discussion prompts", specification: "Three discussion prompts." },
      { material_id: "M3", type: "checklist", purpose: "Submission check", specification: "Checklist before submit." }
    ],
    A3: [
      { material_id: "M1", type: "scenario", purpose: "Household scenarios", specification: "Four named household scenarios A–D." },
      { material_id: "M2", type: "analysis_table", purpose: "Worksheet table", specification: "Pipe table: Scenario, Who is affected?, Main price pressure, Policy angle." }
    ],
    A4: [
      { material_id: "M1", type: "scenario", purpose: "Cost scenarios", specification: "Three scenarios on cost/revenue pressure." },
      { material_id: "M2", type: "impact_table", purpose: "Impact grid", specification: "Pipe table: Scenario, Cost pressure, Revenue pressure, Short-run response." }
    ],
    A5: [
      { material_id: "M1", type: "prompt_set", purpose: "Wrap-up prompts", specification: "Three whole-group discussion prompts." }
    ]
  };
  base.activities = base.activities.map((a) =>
    Object.assign({}, a, { required_materials: specs[a.activity_id] || [] })
  );
  return base;
}

function analyzeGamText(text) {
  const commaRow = /^[^\n|]+,,,\s*$/gm;
  const headers = /^Headers\s*$/m;
  const rows = /^Rows\s*$/m;
  const pipeSep = /\|[^\n]+\|\s*\n\|[-:\s|]+\|/;
  const facilitator = /\bFacilitator use:/i;
  const blocks = [];
  const matRe = /Material:\s*(\S+)\s*\(([^)]+)\)[\s\S]*?Content:\s*([\s\S]*?)(?=\n---\n|\nMaterial:|\nActivity:|$)/gi;
  let m;
  let currentAid = "?";
  const head = String(text);
  const aidRe = /Activity ID:\s*(\S+)/gi;
  let aidMatch;
  const aidSpans = [];
  while ((aidMatch = aidRe.exec(head)) !== null) {
    aidSpans.push({ aid: aidMatch[1], index: aidMatch.index });
  }
  while ((m = matRe.exec(head)) !== null) {
    const index = m.index;
    let activity_id = currentAid;
    for (let i = aidSpans.length - 1; i >= 0; i--) {
      if (aidSpans[i].index <= index) {
        activity_id = aidSpans[i].aid;
        break;
      }
    }
    const material_id = m[1];
    const type = m[2];
    const content = m[3];
    const isTable = /_table\b|classification_table|comparison_table|analysis_table|impact_table|^template$/i.test(type);
    const issues = [];
    if (commaRow.test(content)) issues.push("B4-01-comma-row");
    if (headers.test(content) && rows.test(content)) issues.push("B4-02-headers-rows");
    if (isTable && !pipeSep.test(content)) issues.push("L4-05-no-pipe-separator");
    if (facilitator.test(content)) issues.push("facilitator-use-section");
    blocks.push({
      activity_id,
      material_id,
      type,
      isTable,
      pipeOk: pipeSep.test(content),
      issues,
      contentChars: content.trim().length,
      excerpt: content.trim().slice(0, 200).replace(/\n/g, " ")
    });
  }
  return {
    globalCommaRow: commaRow.test(text),
    globalHeadersRows: headers.test(text) && rows.test(text),
    globalFacilitator: facilitator.test(text),
    tableBlocks: blocks.filter((b) => b.isTable),
    badBlocks: blocks.filter((b) => b.issues.length),
    blocks
  };
}

const api = loadApi();
const md = fs.readFileSync(
  path.join(repoRoot, "domains/learning-design/domain-learning-design-step-patterns.md"),
  "utf8"
);
const wfCfg = (() => {
  const idx = md.indexOf("### Workflow Brief Config");
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).workflowBriefConfig;
})();
const gamFactory = (() => {
  const idx = md.indexOf("## 6. Generate Activity Materials");
  const fence = md.indexOf("```json", md.indexOf("### Prompt Factory", idx));
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim());
})();

const brief = {
  goal:
    "Learner self-study inflation workshop: CPI, GDP deflator, household scenarios, and policy communication for first-year economics.",
  inputs: "First-year undergraduate economics (self-directed study)",
  desiredOutputs: "Learner-facing page",
  selectedDomains: ["learning-design"]
};
const explicit = api.extractWorkflowBriefExplicitFactors(brief);
const inferred = api.applyWorkflowBriefInferenceRules(wfCfg, brief.goal, brief.inputs);
const resolved = api.resolveWorkflowBriefFactors(wfCfg, explicit, {}, inferred, brief).resolved;
const eo = { explicit, resolved, inferred };
const wf = {
  goal: brief.goal,
  inputs: brief.inputs,
  desiredOutputs:
    "learning_outcomes, learning_activities, activity_materials, page",
  workflowOutputs: ["page", "learning_activities", "activity_materials"],
  workflowBriefResolution: {
    resolvedFactors: Object.assign(
      {
        delivery_context: "self_directed",
        learning_environments: ["self_study"]
      },
      resolved
    )
  }
};
const step = {
  title: "Generate Activity Materials",
  canonical_step_id: "step_generate_activity_materials",
  canonical_title: "Generate Activity Materials"
};
const seeded = api.buildSeededStepPromptForWorkflowStep({
  workflowName: "Inflation workshop",
  step,
  matchedPattern: { promptFactory: gamFactory }
});
const gamPrompt = api.applyWorkflowStepRuntimePromptAugmentations(seeded, step, wf, {});
const learning_activities = buildInflationLearningActivities();
const apiKey = readEnvKey();

const ctxHeader =
  "Workflow: Inflation self-directed learner page (EV-38B4-03).\n" +
  "delivery_context=self_directed; page_profile=learner.\n";

let gamText = await callOpenAI(
  apiKey,
  "Follow the pack and runtime contracts; return organised materials text only.",
  ctxHeader +
    "\nUpstream learning_activities JSON:\n" +
    JSON.stringify(learning_activities, null, 2) +
    "\n\n---\n\n" +
    gamPrompt,
  6000
);

const sanitizeCtx = {
  workflowGoal: brief.goal,
  desiredOutputs: brief.desiredOutputs,
  workflowInputs: brief.inputs,
  stepCanonicalStepId: "step_generate_activity_materials",
  stepCanonicalTitle: "Generate Activity Materials",
  workflowBriefResolution: { resolvedFactors: wf.workflowBriefResolution.resolvedFactors },
  upstreamActivities: learning_activities.activities
};
const sanitized = api.sanitizeSelfDirectedGamMaterialsOutput(gamText, sanitizeCtx);
gamText = String(sanitized.text != null ? sanitized.text : gamText);

const analysis = analyzeGamText(gamText);
const report = {
  capturedAt: new Date().toISOString(),
  model,
  promptAugmentedChars: gamPrompt.length,
  gamOutputChars: gamText.length,
  sanitizeChanged: sanitized.text != null,
  analysis,
  l4_07Pass:
    analysis.tableBlocks.length > 0 &&
    analysis.tableBlocks.every((b) => b.pipeOk && !b.issues.some((i) => i.startsWith("B4"))),
  b4AtGam:
    analysis.globalCommaRow || analysis.globalHeadersRows
      ? "FAIL"
      : analysis.badBlocks.length
        ? "PARTIAL"
        : "PASS"
};

fs.writeFileSync(outTxt, gamText, "utf8");
fs.writeFileSync(outJson, JSON.stringify(report, null, 2), "utf8");
console.log(JSON.stringify(report, null, 2));
