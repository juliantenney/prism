/**
 * Sprint 38-G — Inflation AFTER re-run (38G-5) post 38G-3 ACM pack.
 * Run: node docs/development/sprints/2026-06-04-sprint-38g-activity-component-quality/artefacts/ev-38g-inflation-pipeline-capture-once.mjs
 *
 * Writes EV-38G-AFTER-* only. Does not overwrite EV-01, EV-38E*, or EV-38F-AFTER.
 */
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..", "..", "..", "..");
const outDir = __dirname;
const RUN_PREFIX = "EV-38G-AFTER";
const model = process.env.PRISM_PROBE_MODEL || "gpt-4.1-mini";

const BRIEF = {
  goal:
    "Learner self-study inflation workshop: CPI, GDP deflator, household scenarios, and policy communication for first-year economics.",
  inputs: "First-year undergraduate economics (self-directed study)",
  desiredOutputs: "Learner-facing page",
  selectedDomains: ["learning-design"]
};

function readEnvKey() {
  const raw = fs.readFileSync(path.join(repoRoot, ".env.local"), "utf8");
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
  const sandbox = { console, setTimeout, clearTimeout, Promise, fetch: globalThis.fetch };
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener: () => {},
    createElement: createElementStub,
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
    URL: { createObjectURL: () => "", revokeObjectURL: () => "" },
    Blob: function Blob() {}
  };
  windowStub.window = windowStub;
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  vm.createContext(sandbox);
  for (const f of [
    "sprint38-visual-affordances.js",
    "ld-table-fidelity.js",
    "ld-materials-copy.js",
    "ld-math-render.js",
    "ld-self-directed-rhetoric.js",
    "ld-design-page-compose-contract.js"
  ]) {
    vm.runInContext(fs.readFileSync(path.join(repoRoot, "lib", f), "utf8"), sandbox, { filename: f });
  }
  vm.runInContext(fs.readFileSync(path.join(repoRoot, "app.js"), "utf8"), sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

function extractFactory(md, sectionHeading) {
  const idx = md.indexOf(sectionHeading);
  const fence = md.indexOf("```json", md.indexOf("### Prompt Factory", idx));
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim());
}

function parseJsonFromText(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return null;
  let slice = trimmed;
  if (slice.startsWith("```")) {
    const start = slice.indexOf("{");
    const end = slice.lastIndexOf("}");
    if (start !== -1 && end > start) slice = slice.slice(start, end + 1);
  }
  try {
    return JSON.parse(slice);
  } catch {
    const s = trimmed.indexOf("{");
    const e = trimmed.lastIndexOf("}");
    if (s !== -1 && e > s) {
      try {
        return JSON.parse(trimmed.slice(s, e + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
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
  if (!res.ok) throw new Error("OpenAI " + res.status + ": " + (await res.text()).slice(0, 800));
  const data = await res.json();
  const text = data?.output?.[0]?.content?.[0]?.text;
  if (typeof text !== "string") throw new Error("Unexpected OpenAI response shape");
  return text.trim();
}

function buildWorkflow(md, api) {
  const cfgIdx = md.indexOf("### Workflow Brief Config");
  const cfgFence = md.indexOf("```json", cfgIdx);
  const cfgClose = md.indexOf("```", cfgFence + 7);
  const wfCfg = JSON.parse(md.slice(cfgFence + 7, cfgClose).trim()).workflowBriefConfig;
  const explicit = api.extractWorkflowBriefExplicitFactors(BRIEF);
  const inferred = api.applyWorkflowBriefInferenceRules(wfCfg, BRIEF.goal, BRIEF.inputs);
  const resolved = Object.assign(
    { delivery_context: "self_directed", learning_environments: ["self_study"] },
    api.resolveWorkflowBriefFactors(wfCfg, explicit, {}, inferred, BRIEF).resolved
  );
  return {
    goal: BRIEF.goal,
    inputs: BRIEF.inputs,
    desiredOutputs: "learning_outcomes, learning_activities, activity_materials, page",
    workflowOutputs: ["page", "learning_activities", "activity_materials"],
    workflowOutputSpec: { goal: BRIEF.goal, desiredOutputs: BRIEF.desiredOutputs },
    workflowBriefResolution: { resolvedFactors: resolved }
  };
}

function augment(api, md, wf, sectionHeading, stepId, title, outputName) {
  const factory = extractFactory(md, sectionHeading);
  const step = { canonical_step_id: stepId, canonical_title: title, title, outputName };
  const seeded = api.buildSeededStepPromptForWorkflowStep({
    workflowName: "Inflation EV-38G-AFTER",
    step,
    matchedPattern: { promptFactory: factory }
  });
  const augmented = api.applyWorkflowStepRuntimePromptAugmentations(seeded, step, wf, {});
  return { factory, step, seeded, augmented };
}

function parseGamMaterials(text) {
  const head = String(text);
  const materials = [];
  const aidSpans = [];
  let aidMatch;
  const aidRe = /Activity ID:\s*(\S+)/gi;
  while ((aidMatch = aidRe.exec(head)) !== null) aidSpans.push({ aid: aidMatch[1], index: aidMatch.index });
  const matRe =
    /Material:\s*(\S+)\s*\(([^)]+)\)[\s\S]*?Content:\s*([\s\S]*?)(?=\n---\n|\nMaterial:|\nActivity:|$)/gi;
  let m;
  while ((m = matRe.exec(head)) !== null) {
    let activity_id = "?";
    for (let i = aidSpans.length - 1; i >= 0; i--) {
      if (aidSpans[i].index <= m.index) {
        activity_id = aidSpans[i].aid;
        break;
      }
    }
    materials.push({
      activity_id,
      material_id: m[1],
      type: m[2].trim(),
      contentLen: m[3].trim().length,
      contentPreview: m[3].trim().slice(0, 160).replace(/\s+/g, " ")
    });
  }
  return materials;
}

const api = loadApi();
const md = fs.readFileSync(
  path.join(repoRoot, "domains/learning-design/domain-learning-design-step-patterns.md"),
  "utf8"
);
const wf = buildWorkflow(md, api);
const apiKey = readEnvKey();
const ctxHeader =
  "Workflow: Inflation self-directed learner workbook (Sprint 38-G-5 — same topic/brief as EV-38F-AFTER).\n" +
  "page_profile=learner; apply pack DLA-WB (38E-8 + 38F-2 + 38G-3 ACM) and GAM-WB (38E-9 + 38F-2 + 38G-3 ACM).\n" +
  "Build coached instructional episodes per Activity Component Model — not LO->task shells.\n";

const loAug = augment(api, md, wf, "## 4. Define Learning Outcomes", "step_define_learning_outcomes", "Define Learning Outcomes", "learning_outcomes");
const dlaAug = augment(api, md, wf, "## 5. Design Learning Activities", "step_design_learning_activities", "Design Learning Activities", "learning_activities");
const gamAug = augment(api, md, wf, "## 6. Generate Activity Materials", "step_generate_activity_materials", "Generate Activity Materials", "activity_materials");
const dpAug = augment(api, md, wf, "## 13. Design Page", "step_design_page", "Design Page", "page");

const loText = await callOpenAI(
  apiKey,
  "Return JSON only.",
  ctxHeader + "\n\nTask: Return { learning_outcomes: [4 outcomes on inflation, CPI, household impacts, evaluate strategies] }.\n",
  1200
);
const learning_outcomes = parseJsonFromText(loText) || { learning_outcomes: [] };

const dlaText = await callOpenAI(
  apiKey,
  "Return JSON only for learning_activities with delivery_notes object.",
  ctxHeader +
    "\n\nMandatory: 60-minute self_study_workbook. delivery_notes: resource_intent self_study_workbook, session_duration_target_minutes 60, consolidation_requirement, workbook_contract_applied true.\n\n38E-8 + 38F-2 + 38G-3 ACM mandatory rows (all coexist): (1) early activity: worked_example AND sample_output; (2) final activity: consolidation_summary; (3) practice activity: analysis_table or comparison_table (DLA-WB-06a); (4) practice activity with household scenarios: type scenario with ≥2 cases (DLA-WB-18). Include activity_preamble, cognition fields, checklist/prompt_set on ≥2 activities (DLA-WB-11), KM-aware specifications (DLA-WB-21).\n\nApply ALL DLA-WB rules below.\n\nUpstream learning_outcomes:\n" +
    JSON.stringify(learning_outcomes, null, 2) +
    "\n\n---\n\n" +
    dlaAug.augmented,
  8000
);
let learning_activities = parseJsonFromText(dlaText) || { activities: [] };

const gamTextRaw = await callOpenAI(
  apiKey,
  "Return organised materials text per pack structure.",
  ctxHeader +
    "\n\nMandatory 38E-9 + 38F-2 + 38G-3 ACM: Material bodies for worked_example, sample_output, consolidation_summary; scenario when DLA lists scenario; pipe-table Material for DLA table types; realise DLA component intent (GAM-WB-21); checklist/prompt_set when DLA lists retrieval types.\n\nUpstream learning_activities:\n" +
    JSON.stringify(learning_activities, null, 2) +
    "\n\n---\n\n" +
    gamAug.augmented,
  12000
);
const sanitizeCtx = {
  workflowGoal: wf.goal,
  desiredOutputs: BRIEF.desiredOutputs,
  workflowInputs: BRIEF.inputs,
  stepCanonicalStepId: "step_generate_activity_materials",
  stepCanonicalTitle: "Generate Activity Materials",
  workflowBriefResolution: wf.workflowBriefResolution,
  upstreamActivities: learning_activities.activities || learning_activities
};
const sanitized = api.sanitizeSelfDirectedGamMaterialsOutput(gamTextRaw, sanitizeCtx);
const gamText = String(sanitized.text != null ? sanitized.text : gamTextRaw);

const dpText = await callOpenAI(
  apiKey,
  "Return JSON only for composed learner page.",
  ctxHeader +
    "\n\npage_profile=learner. Preserve activity_preamble, learner_task, cognition fields, and full materials verbatim.\n\nUpstream learning_activities:\n" +
    JSON.stringify(learning_activities, null, 2) +
    "\n\nUpstream activity_materials (excerpt):\n" +
    gamText.slice(0, 14000) +
    "\n\n---\n\n" +
    dpAug.augmented,
  10000
);
let page = parseJsonFromText(dpText);

if (page && page.sections && api.applyPedagogicCognitionSemanticsToComposedPage) {
  page = api.applyPedagogicCognitionSemanticsToComposedPage(page, {
    upstreamLearningActivities: learning_activities,
    resolvedFactors: wf.workflowBriefResolution.resolvedFactors,
    workflowBriefConfig: (() => {
      const cfgIdx = md.indexOf("### Workflow Brief Config");
      const cfgFence = md.indexOf("```json", cfgIdx);
      const cfgClose = md.indexOf("```", cfgFence + 7);
      return JSON.parse(md.slice(cfgFence + 7, cfgClose).trim()).workflowBriefConfig;
    })(),
    base: BRIEF
  });
}

const gamMaterials = parseGamMaterials(gamText);
const acts = learning_activities.activities || learning_activities.learning_activities || [];

const report = {
  capturedAt: new Date().toISOString(),
  sprint: "38-G",
  runId: RUN_PREFIX,
  phase: "38G-5",
  priorRuns: ["EV-38F-AFTER", "EV-38E10-AFTER"],
  model,
  brief: BRIEF,
  promptChars: {
    dla: dlaAug.augmented.length,
    gam: gamAug.augmented.length,
    design_page: dpAug.augmented.length
  },
  activityCount: acts.length,
  gamMaterialCount: gamMaterials.length,
  gamTypes: [...new Set(gamMaterials.map((m) => m.type))],
  materials: gamMaterials
};

fs.writeFileSync(path.join(outDir, `${RUN_PREFIX}-gam.txt`), gamText, "utf8");
fs.writeFileSync(path.join(outDir, `${RUN_PREFIX}-design-page.json`), JSON.stringify(page, null, 2), "utf8");
fs.writeFileSync(
  path.join(outDir, `${RUN_PREFIX}-dla-learning-activities.json`),
  JSON.stringify(learning_activities, null, 2),
  "utf8"
);
fs.writeFileSync(path.join(outDir, `${RUN_PREFIX}-run-log.json`), JSON.stringify(report, null, 2), "utf8");

console.log(JSON.stringify(report, null, 2));
