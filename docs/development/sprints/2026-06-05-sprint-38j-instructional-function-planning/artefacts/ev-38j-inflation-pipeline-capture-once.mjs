/**
 * Sprint 38-J — Inflation evaluation capture (38J-5 proof run).
 * Run: node docs/development/sprints/2026-06-05-sprint-38j-instructional-function-planning/artefacts/ev-38j-inflation-pipeline-capture-once.mjs
 *
 * Pipeline: Brief → Learning Content → Knowledge Model → LO → DLA (IFP §5) → GAM (GAM-PRES §6) → Design Page → workbook.md
 * Writes EV-38J-AFTER-* to this artefacts folder. Does not overwrite EV-38G-AFTER or EV-38H-AFTER comparators.
 */
import fs from "fs";
import path from "path";
import vm from "vm";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const { parseKnowledgeModelCapture, buildKmHarnessOutputContract } = require(
  path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "..",
    "2026-06-05-sprint-38h-workbook-realisation-fidelity",
    "artefacts",
    "ev-harness-artefact-parse.js"
  )
);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..", "..", "..", "..");
const outDir = __dirname;
const RUN_PREFIX = process.env.PRISM_RUN_PREFIX || "EV-38J-AFTER";
const model = process.env.PRISM_PROBE_MODEL || "gpt-4.1-mini";
const HARNESS_VERSION = "38J-5";
const KM_PIPELINE_STEP_NUM = 2;

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
    desiredOutputs: "learning_content, knowledge_model, learning_outcomes, learning_activities, activity_materials, page",
    workflowOutputs: ["page", "learning_activities", "activity_materials"],
    workflowOutputSpec: { goal: BRIEF.goal, desiredOutputs: BRIEF.desiredOutputs },
    workflowBriefResolution: { resolvedFactors: resolved }
  };
}

function augment(api, md, wf, sectionHeading, stepId, title, outputName) {
  const factory = extractFactory(md, sectionHeading);
  const step = { canonical_step_id: stepId, canonical_title: title, title, outputName };
  const seeded = api.buildSeededStepPromptForWorkflowStep({
    workflowName: `Inflation ${RUN_PREFIX}`,
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
    /Material:\s*(\S+)\s*\(([^)]+)\)[\s\S]*?Purpose:\s*([^\n]*)\nContent:\s*([\s\S]*?)(?=\n---\n|\nMaterial:|\nActivity:|$)/gi;
  let m;
  while ((m = matRe.exec(head)) !== null) {
    let activity_id = "?";
    for (let i = aidSpans.length - 1; i >= 0; i--) {
      if (aidSpans[i].index <= m.index) {
        activity_id = aidSpans[i].aid;
        break;
      }
    }
    const content = m[4].trim();
    materials.push({
      activity_id,
      material_id: m[1],
      type: m[2].trim(),
      purpose: m[3].trim(),
      content,
      contentLen: content.length
    });
  }
  return materials;
}

function buildWorkbookMd(page, gamText, learning_activities) {
  const lines = ["# Inflation Self-Study Workbook", "", `*Captured: ${RUN_PREFIX} · Sprint 38-J proof run*`, ""];
  const acts = learning_activities.activities || [];
  const byAct = new Map();
  for (const mat of parseGamMaterials(gamText)) {
    if (!byAct.has(mat.activity_id)) byAct.set(mat.activity_id, []);
    byAct.get(mat.activity_id).push(mat);
  }
  acts.forEach((act, i) => {
    const aid = act.activity_id || `activity_${i + 1}`;
    lines.push(`## Activity ${i + 1}: ${act.title || aid}`, "");
    if (act.activity_preamble) {
      lines.push(act.activity_preamble, "");
    }
    if (act.learner_task) {
      lines.push("### Learner task", "", act.learner_task, "");
    }
    const mats = byAct.get(aid) || [];
    mats.forEach((mat) => {
      lines.push(`### Material: ${mat.material_id} (${mat.type})`, "");
      if (mat.purpose) lines.push(`*Purpose:* ${mat.purpose}`, "");
      lines.push(mat.content, "");
    });
    if (act.expected_output) {
      lines.push("### Expected output", "", act.expected_output, "");
    }
    lines.push("---", "");
  });
  if (page && page.sections && Array.isArray(page.sections)) {
    lines.push("## Composed page sections (reference)", "");
    page.sections.forEach((sec) => {
      if (sec.heading) lines.push(`### ${sec.heading}`, "");
      if (sec.content) {
        const c =
          typeof sec.content === "string"
            ? sec.content
            : JSON.stringify(sec.content, null, 2).slice(0, 4000);
        lines.push(c, "");
      }
    });
  }
  return lines.join("\n");
}

function kmConceptCount(knowledge_model) {
  if (!knowledge_model || typeof knowledge_model !== "object") return 0;
  const c = knowledge_model.concepts;
  if (Array.isArray(c)) return c.length;
  return 0;
}

const api = loadApi();
const md = fs.readFileSync(
  path.join(repoRoot, "domains/learning-design/domain-learning-design-step-patterns.md"),
  "utf8"
);
const wf = buildWorkflow(md, api);
const apiKey = readEnvKey();
const ctxHeader =
  "Workflow: Inflation self-directed learner workbook (Sprint 38-J — same topic/brief as EV-38G-AFTER).\n" +
  "page_profile=learner; apply pack IFP (38J-3 §5) mandatory instructional function planning per activity; GAM-PRES (38J-4 §6) preserve function order and depth.\n" +
  "Also apply DLA-WB (38E-8 + 38F-2 + 38G-3 + 38J-3) and GAM-WB (38E-9 + 38F-2 + 38G-3 + 38H-2 + 38J-4).\n" +
  "Design Page: 38H-3 table-adjunct fidelity. Build instructional episodes not LO->task shells.\n";

const lcAug = augment(api, md, wf, "## 2. Generate Learning Content", "step_generate_learning_content", "Generate Learning Content", "learning_content");
const kmAug = augment(api, md, wf, "## 3. Model Knowledge", "step_model_knowledge", "Model Knowledge", "knowledge_model");
const loAug = augment(api, md, wf, "## 4. Define Learning Outcomes", "step_define_learning_outcomes", "Define Learning Outcomes", "learning_outcomes");
const dlaAug = augment(api, md, wf, "## 5. Design Learning Activities", "step_design_learning_activities", "Design Learning Activities", "learning_activities");
const gamAug = augment(api, md, wf, "## 6. Generate Activity Materials", "step_generate_activity_materials", "Generate Activity Materials", "activity_materials");
const dpAug = augment(api, md, wf, "## 13. Design Page", "step_design_page", "Design Page", "page");

const lcText = await callOpenAI(
  apiKey,
  "Return JSON only for learning_content.",
  ctxHeader +
    "\n\nBrief goal: " +
    BRIEF.goal +
    "\nAudience/inputs: " +
    BRIEF.inputs +
    "\n\nGenerate teaching-ready learning_content covering inflation, CPI, GDP deflator contrast, household budget impacts, and policy communication themes from the brief.\n\n---\n\n" +
    lcAug.augmented,
  4000
);
let learning_content = parseJsonFromText(lcText);
if (!learning_content) {
  learning_content = {
    title: "Inflation and Household Finances",
    sections: [{ title: "Overview", content: lcText.slice(0, 2000) }],
    key_concepts: ["inflation", "CPI", "household budgets"],
    examples: []
  };
}

const kmSystemPrompt = [
  "You execute the Model Knowledge workflow step.",
  "Return exactly one fenced ```json block containing the knowledge_model object.",
  "No conversational prose before the opening fence.",
  `After the closing fence, on its own line only: STEP ${KM_PIPELINE_STEP_NUM} OUTPUT: knowledge_model`
].join(" ");

const kmText = await callOpenAI(
  apiKey,
  kmSystemPrompt,
  ctxHeader +
    "\n\nUpstream learning_content:\n" +
    JSON.stringify(learning_content, null, 2) +
    "\n\nInclude concepts for inflation, CPI, GDP deflator (as contrast/misconception if brief-relevant), household impacts, and policy communication where supported by content.\n\n" +
    buildKmHarnessOutputContract(KM_PIPELINE_STEP_NUM) +
    "\n\n---\n\n" +
    kmAug.augmented,
  4000
);
let knowledge_model;
try {
  knowledge_model = parseKnowledgeModelCapture(kmText, api.sanitizePrismRunCapturedOutput);
} catch (err) {
  fs.writeFileSync(path.join(outDir, `${RUN_PREFIX}-knowledge-model-raw.txt`), kmText, "utf8");
  throw new Error(`${err.message} (raw capture: ${RUN_PREFIX}-knowledge-model-raw.txt)`);
}

const loText = await callOpenAI(
  apiKey,
  "Return JSON only for learning_outcomes derived from knowledge_model.",
  ctxHeader +
    "\n\nUpstream knowledge_model:\n" +
    JSON.stringify(knowledge_model, null, 2) +
    "\n\nUpstream learning_content (reference):\n" +
    JSON.stringify(learning_content, null, 2).slice(0, 6000) +
    "\n\n---\n\n" +
    loAug.augmented,
  2000
);
const learning_outcomes = parseJsonFromText(loText) || { learning_outcomes: [] };

const dlaText = await callOpenAI(
  apiKey,
  "Return JSON only for learning_activities with delivery_notes object.",
  ctxHeader +
    "\n\nMandatory: 60-minute self_study_workbook. delivery_notes: resource_intent self_study_workbook, session_duration_target_minutes 60, consolidation_requirement, workbook_contract_applied true.\n\nExecute IFP per activity (38J-3): archetype selection, function sequence, KM triggers, inference, anti-shell, anti-spoiler before learner_task/required_materials.\n\nFour activities A1 Understand, A2 Apply (CPI calculation worked thinking), A3 Analyse (household comparison), A4 Evaluate (strategy judgement — dedicated Evaluate-shaped activity per DLA-WB-22/EV-CAP).\n\n38E-8 + 38F-2 + 38G-3 + 38J-3 mandatory rows (all coexist): early worked_example+sample_output; practice table (DLA-WB-06a); scenario (DLA-WB-18); final consolidation_summary; Evaluate materials: criteria, perspectives, worked judgement contrast, guided judgement table, transfer.\n\nUpstream learning_outcomes:\n" +
    JSON.stringify(learning_outcomes, null, 2) +
    "\n\nUpstream knowledge_model:\n" +
    JSON.stringify(knowledge_model, null, 2) +
    "\n\n---\n\n" +
    dlaAug.augmented,
  12000
);
let learning_activities = parseJsonFromText(dlaText) || { activities: [] };

const gamTextRaw = await callOpenAI(
  apiKey,
  "Return organised materials text per pack structure.",
  ctxHeader +
    "\n\nMandatory GAM-PRES (38J-4): preserve DLA required_materials order; one Material per row; no function collapse; Evaluate A4 depths (perspectives, criteria, weak/strong judgement, guided partial table, independent memo scaffold, verification, transfer); GAM-WB-06b scaffold when learner-write.\n\nUpstream learning_activities:\n" +
    JSON.stringify(learning_activities, null, 2) +
    "\n\nUpstream knowledge_model:\n" +
    JSON.stringify(knowledge_model, null, 2) +
    "\n\n---\n\n" +
    gamAug.augmented,
  16000
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
    "\n\npage_profile=learner. Preserve activity_preamble, learner_task, cognition fields, and full materials verbatim including table-adjunct prose (38H-3).\n\nUpstream learning_outcomes:\n" +
    JSON.stringify(learning_outcomes, null, 2) +
    "\n\nUpstream knowledge_model:\n" +
    JSON.stringify(knowledge_model, null, 2) +
    "\n\nUpstream learning_activities:\n" +
    JSON.stringify(learning_activities, null, 2) +
    "\n\nUpstream activity_materials (excerpt):\n" +
    gamText.slice(0, 16000) +
    "\n\n---\n\n" +
    dpAug.augmented,
  12000
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
const workbookMd = buildWorkbookMd(page, gamText, learning_activities);

const gamJson = {
  runId: RUN_PREFIX,
  capturedAt: new Date().toISOString(),
  activities: acts.map((act) => ({
    activity_id: act.activity_id,
    title: act.title,
    materials: gamMaterials.filter((m) => m.activity_id === act.activity_id)
  })),
  all_materials: gamMaterials
};

const report = {
  capturedAt: new Date().toISOString(),
  sprint: "38-J",
  runId: RUN_PREFIX,
  phase: "38J-5",
  harnessVersion: HARNESS_VERSION,
  priorRuns: ["EV-38G-AFTER", "EV-38H-AFTER-knowledge-model"],
  comparators: ["EV-38G-AFTER", "38I-4-target-state", "38I-4-A4-episode"],
  model,
  brief: BRIEF,
  pipelinePath: [
    "brief",
    "generate_learning_content",
    "model_knowledge",
    "define_learning_outcomes",
    "design_learning_activities",
    "generate_activity_materials",
    "design_page"
  ],
  artefactsWritten: [
    `${RUN_PREFIX}-knowledge-model.json`,
    `${RUN_PREFIX}-learning-objectives.json`,
    `${RUN_PREFIX}-dla-learning-activities.json`,
    `${RUN_PREFIX}-gam.json`,
    `${RUN_PREFIX}-gam.txt`,
    `${RUN_PREFIX}-workbook.md`,
    `${RUN_PREFIX}-design-page.json`,
    `${RUN_PREFIX}-run-log.json`
  ],
  knowledgeModelConceptCount: kmConceptCount(knowledge_model),
  promptChars: {
    learning_content: lcAug.augmented.length,
    knowledge_model: kmAug.augmented.length,
    learning_outcomes: loAug.augmented.length,
    dla: dlaAug.augmented.length,
    gam: gamAug.augmented.length,
    design_page: dpAug.augmented.length
  },
  activityCount: acts.length,
  gamMaterialCount: gamMaterials.length,
  gamTypes: [...new Set(gamMaterials.map((m) => m.type))],
  materials: gamMaterials.map((m) => ({
    activity_id: m.activity_id,
    material_id: m.material_id,
    type: m.type,
    contentLen: m.contentLen,
    contentPreview: m.content.slice(0, 160).replace(/\s+/g, " ")
  }))
};

fs.writeFileSync(path.join(outDir, `${RUN_PREFIX}-learning-content.json`), JSON.stringify(learning_content, null, 2), "utf8");
fs.writeFileSync(path.join(outDir, `${RUN_PREFIX}-knowledge-model.json`), JSON.stringify(knowledge_model, null, 2), "utf8");
fs.writeFileSync(path.join(outDir, `${RUN_PREFIX}-learning-outcomes.json`), JSON.stringify(learning_outcomes, null, 2), "utf8");
fs.writeFileSync(path.join(outDir, `${RUN_PREFIX}-learning-objectives.json`), JSON.stringify(learning_outcomes, null, 2), "utf8");
fs.writeFileSync(path.join(outDir, `${RUN_PREFIX}-dla-learning-activities.json`), JSON.stringify(learning_activities, null, 2), "utf8");
fs.writeFileSync(path.join(outDir, `${RUN_PREFIX}-gam.txt`), gamText, "utf8");
fs.writeFileSync(path.join(outDir, `${RUN_PREFIX}-gam.json`), JSON.stringify(gamJson, null, 2), "utf8");
fs.writeFileSync(path.join(outDir, `${RUN_PREFIX}-workbook.md`), workbookMd, "utf8");
fs.writeFileSync(path.join(outDir, `${RUN_PREFIX}-design-page.json`), JSON.stringify(page, null, 2), "utf8");
fs.writeFileSync(path.join(outDir, `${RUN_PREFIX}-run-log.json`), JSON.stringify(report, null, 2), "utf8");

console.log(JSON.stringify(report, null, 2));
