/**
 * Sprint 38-M — Inflation evaluation capture (38M-5 proof run harness).
 * Run: node docs/development/sprints/2026-06-05-sprint-38m-page-composition-fidelity/artefacts/ev-38m-inflation-pipeline-capture-once.mjs
 *
 * Pipeline: Brief → Learning Content → Knowledge Model → frozen LO → DLA (IFP §5 + 38L) → GAM (GAM-PRES §6 + 38L) → Design Page (+ 38M compose merge) → workbook.md
 * Writes EV-38M-AFTER-* to this artefacts folder. Comparator baseline: EV-38L-AFTER (38L sprint artefacts).
 *
 * Partial rerun:
 *   PRISM_HARNESS_KM_ONLY=1 node .../ev-38m-inflation-pipeline-capture-once.mjs
 *   PRISM_HARNESS_RESUME_FROM=km node .../ev-38m-inflation-pipeline-capture-once.mjs
 */
import fs from "fs";
import path from "path";
import vm from "vm";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..", "..", "..", "..");
const require = createRequire(import.meta.url);
const { validateDla38LObligations } = require(
  path.join(repoRoot, "lib", "dla-38l-obligation-check.js")
);
const {
  validate38LPageGamPreservation,
  validate38MPageFidelity,
  measurePageGamFidelity
} = require(path.join(repoRoot, "lib", "page-gam-materials-preserve.js"));
const { validateA3MaterialsSequencing, validateA3RenderMaterialOrder } = require(
  path.join(repoRoot, "lib", "page-a3-materials-sequencing.js")
);
const { parseKnowledgeModelCapture, buildKmHarnessOutputContract } = require(
  path.join(
    repoRoot,
    "docs",
    "development",
    "sprints",
    "2026-06-05-sprint-38h-workbook-realisation-fidelity",
    "artefacts",
    "ev-harness-artefact-parse.js"
  )
);
const outDir = __dirname;
const sprint38lDir = path.resolve(
  __dirname,
  "../../2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts"
);
const RUN_PREFIX = process.env.PRISM_RUN_PREFIX || "EV-38M-AFTER";
const model = process.env.PRISM_PROBE_MODEL || "gpt-4.1-mini";
const HARNESS_VERSION = "38M-5";
const KM_PIPELINE_STEP_NUM = 2;
const KM_ONLY = process.env.PRISM_HARNESS_KM_ONLY === "1";
const RESUME_FROM = String(process.env.PRISM_HARNESS_RESUME_FROM || "").trim().toLowerCase();
const FROZEN_LO_PATH = path.join(sprint38lDir, "ev-38l-frozen-learning-outcomes.json");

const BRIEF = {
  goal:
    "Learner self-study inflation workshop: CPI, GDP deflator, household budget scenarios (fixed- and variable-income), and household strategy evaluation under inflation. Policy communication may appear as macro context only — the capstone evaluates household budget strategies, not policy summaries.",
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

function loadFrozenLearningOutcomes() {
  const raw = fs.readFileSync(FROZEN_LO_PATH, "utf8");
  const parsed = JSON.parse(raw);
  const lo4 = parsed.learning_outcomes?.[3];
  if (!lo4 || lo4.cognitive_level !== "Evaluate") {
    throw new Error("Frozen LO contract: fourth outcome must be cognitive_level Evaluate");
  }
  if (!/household/i.test(lo4.statement)) {
    throw new Error("Frozen LO contract: fourth outcome must anchor household strategy Evaluate (38I-4 A4)");
  }
  return parsed;
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
    "ld-design-page-compose-contract.js",
    "design-page-materials-fidelity.js",
    "page-gam-materials-preserve.js",
    "page-a3-materials-sequencing.js"
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

function findActivityTitles(page) {
  const titles = { a3: "", a4: "" };
  const section = (page?.sections || []).find((s) =>
    /learning.?activit/i.test(String(s.section_id || s.heading || ""))
  );
  const content = section?.content;
  const list = Array.isArray(content) ? content : page?.learning_activities || [];
  list.forEach((row) => {
    const id = String(row.activity_id || "");
    const title = String(row.title || row.activity_title || "");
    if (/A3|analyse/i.test(id)) titles.a3 = title;
    if (/A4|evaluate/i.test(id)) titles.a4 = title;
  });
  return titles;
}

function extractA3HtmlBlock(html, page) {
  const text = String(html || "");
  const { a3, a4 } = findActivityTitles(page);
  if (!a3) return text;
  const a3Start = text.indexOf(a3);
  if (a3Start < 0) return text;
  const a4Start = a4 ? text.indexOf(a4, a3Start + a3.length) : text.length;
  return text.substring(a3Start, a4Start > a3Start ? a4Start : text.length);
}

function aggregateFidelityByActivity(metrics) {
  const byAct = new Map();
  metrics.forEach((m) => {
    const aid = m.activity_id || "unknown";
    if (!byAct.has(aid)) byAct.set(aid, { gamLen: 0, pageLen: 0, count: 0, substantive: 0 });
    const row = byAct.get(aid);
    row.gamLen += m.gamLen || 0;
    row.pageLen += m.pageLen || 0;
    row.count += 1;
    if (m.substantive) row.substantive += 1;
  });
  const out = {};
  byAct.forEach((row, aid) => {
    out[aid] = {
      materialCount: row.count,
      aggregateRatio: row.gamLen ? Math.round((row.pageLen / row.gamLen) * 100) : 100,
      substantiveCount: row.substantive
    };
  });
  return out;
}

function load38LComparator() {
  const gamPath = path.join(sprint38lDir, "EV-38L-AFTER-gam.json");
  const pagePath = path.join(sprint38lDir, "EV-38L-AFTER-design-page.json");
  if (!fs.existsSync(gamPath) || !fs.existsSync(pagePath)) {
    return { available: false };
  }
  const gam38l = JSON.parse(fs.readFileSync(gamPath, "utf8"));
  const page38l = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const gamSource = { activities: gam38l.activities || gam38l };
  const metrics38l = measurePageGamFidelity(page38l, { gamSource });
  const validate38l = validate38MPageFidelity(page38l, { gamSource });
  const a3Seq38l = validateA3MaterialsSequencing(page38l, { requireMetadata: false });
  return {
    available: true,
    runId: "EV-38L-AFTER",
    fidelityMetrics: metrics38l,
    aggregateByActivity: aggregateFidelityByActivity(metrics38l),
    validate38M: { ok: validate38l.ok, errors: validate38l.errors, warnings: validate38l.warnings },
    a3Sequencing: { ok: a3Seq38l.ok, errors: a3Seq38l.errors }
  };
}

function buildWorkbookMd(page, gamText, learning_activities) {
  const lines = ["# Inflation Self-Study Workbook", "", `*Captured: ${RUN_PREFIX} · Sprint 38-M proof run*`, ""];
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
  "Workflow: Inflation self-directed learner workbook (Sprint 38-M proof — same topic domain as EV-38L-AFTER; Evaluate benchmark aligned to 38I-4 A4 household strategy judgement).\n" +
  "page_profile=learner; apply pack IFP (38J-3 + 38L-2/38L-4 §5): IFP-09 depth floors, IFP-10 emission gates, INF-EVAL-01 household Evaluate anchor, EV-CAP-04 termination gate, DLA-WB-26..31.\n" +
  "GAM-PRES (38J-4 + 38L-3/38L-4 §6): preserve function order; GAM-PRES-08/09 depth-shaped bodies; GAM-PRES-10 Evaluate completion termination; GAM-WB-26..31.\n" +
  "Also apply DLA-WB (38E-8 + 38F-2 + 38G-3 + 38J-3) and GAM-WB (38E-9 + 38F-2 + 38G-3 + 38H-2 + 38J-4).\n" +
  "Design Page: 38H-3 table-adjunct fidelity. A4 Evaluate must measure household strategy depth (Maya scenario, criteria rubric, worked/guided/independent judgement, verification, transfer) — NOT policy communication summary quality.\n";

const lcAug = augment(api, md, wf, "## 2. Generate Learning Content", "step_generate_learning_content", "Generate Learning Content", "learning_content");
const kmAug = augment(api, md, wf, "## 3. Model Knowledge", "step_model_knowledge", "Model Knowledge", "knowledge_model");
const dlaAug = augment(api, md, wf, "## 5. Design Learning Activities", "step_design_learning_activities", "Design Learning Activities", "learning_activities");
const gamAug = augment(api, md, wf, "## 6. Generate Activity Materials", "step_generate_activity_materials", "Generate Activity Materials", "activity_materials");
const dpAug = augment(api, md, wf, "## 13. Design Page", "step_design_page", "Design Page", "page");

function loadJsonArtefact(filename) {
  const p = path.join(outDir, filename);
  if (!fs.existsSync(p)) {
    throw new Error(`Missing artefact for resume: ${filename}`);
  }
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

let learning_content;
let knowledge_model;
let learning_outcomes;

if (RESUME_FROM === "km") {
  learning_content = loadJsonArtefact(`${RUN_PREFIX}-learning-content.json`);
  knowledge_model = loadJsonArtefact(`${RUN_PREFIX}-knowledge-model.json`);
  learning_outcomes = loadFrozenLearningOutcomes();
  console.log(
    JSON.stringify(
      {
        phase: HARNESS_VERSION,
        resumeFrom: "km",
        runPrefix: RUN_PREFIX,
        skipped: ["generate_learning_content", "model_knowledge", "frozen_learning_outcomes_load_only"],
        knowledgeModelConceptCount: kmConceptCount(knowledge_model),
        dlaPromptChars: dlaAug.augmented.length
      },
      null,
      2
    )
  );
} else {
const lcText = await callOpenAI(
  apiKey,
  "Return JSON only for learning_content.",
  ctxHeader +
    "\n\nBrief goal: " +
    BRIEF.goal +
    "\nAudience/inputs: " +
    BRIEF.inputs +
    "\n\nGenerate teaching-ready learning_content covering inflation, CPI, GDP deflator contrast, household budget impacts (fixed vs variable income), and brief macro policy context only where relevant — household strategy evaluation is the capstone anchor.\n\n---\n\n" +
    lcAug.augmented,
  4000
);
learning_content = parseJsonFromText(lcText);
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
  "No conversational prose before the opening fence or after the closing fence.",
  "No raw JSON outside a fence. No JSON comments."
].join(" ");

const kmText = await callOpenAI(
  apiKey,
  kmSystemPrompt,
  ctxHeader +
    "\n\nUpstream learning_content:\n" +
    JSON.stringify(learning_content, null, 2) +
    "\n\nInclude concepts for inflation, CPI, GDP deflator (as contrast if brief-relevant), household budget impacts (KM-T05 anchor), and policy communication as macro context only (KM-T08 — not Evaluate driver).\n\n" +
    buildKmHarnessOutputContract(KM_PIPELINE_STEP_NUM) +
    "\n\n---\n\n" +
    kmAug.augmented,
  4000
);
try {
  knowledge_model = parseKnowledgeModelCapture(kmText, api.sanitizePrismRunCapturedOutput);
} catch (err) {
  fs.writeFileSync(path.join(outDir, `${RUN_PREFIX}-knowledge-model-raw.txt`), kmText, "utf8");
  throw new Error(`${err.message} (raw capture: ${RUN_PREFIX}-knowledge-model-raw.txt)`);
}

if (KM_ONLY) {
  const kmPath = path.join(outDir, `${RUN_PREFIX}-knowledge-model.json`);
  fs.writeFileSync(kmPath, JSON.stringify(knowledge_model, null, 2), "utf8");
  JSON.parse(fs.readFileSync(kmPath, "utf8"));
  console.log(
    JSON.stringify(
      {
        phase: HARNESS_VERSION,
        kmOnly: true,
        runPrefix: RUN_PREFIX,
        knowledgeModelConceptCount: kmConceptCount(knowledge_model),
        written: `${RUN_PREFIX}-knowledge-model.json`,
        nextStep:
          "PRISM_HARNESS_RESUME_FROM=km node .../ev-38l-inflation-pipeline-capture-once.mjs"
      },
      null,
      2
    )
  );
  process.exit(0);
}

learning_outcomes = loadFrozenLearningOutcomes();
}

const dlaText = await callOpenAI(
  apiKey,
  "Return JSON only for learning_activities with delivery_notes object.",
  ctxHeader +
    "\n\nMandatory: 60-minute self_study_workbook. delivery_notes: resource_intent self_study_workbook, session_duration_target_minutes 60, consolidation_requirement, workbook_contract_applied true.\n\nExecute IFP per activity (38J-3 + 38L-2/38L-4): archetype selection, function sequence, KM triggers (KM-T05 household Evaluate anchor; KM-T08 policy context only), INF-EVAL-01, inference, anti-shell, anti-spoiler, IFP-09 depth floors, IFP-10 emission gates before learner_task/required_materials.\n\nFour activities A1 Understand, A2 Apply (CPI calculation worked thinking), A3 Analyse (household comparison + worked analytic pass per DLA-WB-27), A4 Evaluate (household strategy judgement — Maya-style scenario, strategy menu A–E, 38I-4 A4 benchmark; NOT policy communication summary).\n\nA4 Evaluate completion pack (DLA-WB-28/31, EV-CAP-04): perspectives + criteria + worked judgement + guided judgement + independent judgement template + verification checklist + transfer_prompt — guided comparison alone CANNOT terminate; consolidation_summary is closure only.\n\n38E-8 + 38F-2 + 38G-3 + 38J-3 + 38L mandatory rows (all coexist): early worked_example+sample_output; practice table (DLA-WB-06a); scenario (DLA-WB-18); verification checklist every activity (DLA-WB-26); final consolidation_summary.\n\nUpstream learning_outcomes (frozen — authoritative fourth LO is household Evaluate):\n" +
    JSON.stringify(learning_outcomes, null, 2) +
    "\n\nUpstream knowledge_model:\n" +
    JSON.stringify(knowledge_model, null, 2) +
    "\n\n---\n\n" +
    dlaAug.augmented,
  12000
);
let learning_activities = parseJsonFromText(dlaText) || { activities: [] };
const dlaObligationCheck = validateDla38LObligations(learning_activities);
if (!dlaObligationCheck.ok) {
  fs.writeFileSync(
    path.join(outDir, `${RUN_PREFIX}-dla-learning-activities-raw.txt`),
    dlaText,
    "utf8"
  );
  throw new Error(
    `DLA missing mandatory 38L obligations (pack §5 IFP-10 / DLA-WB-26..31): ${dlaObligationCheck.errors.join("; ")} (raw: ${RUN_PREFIX}-dla-learning-activities-raw.txt)`
  );
}

const gamTextRaw = await callOpenAI(
  apiKey,
  "Return organised materials text per pack structure.",
  ctxHeader +
    "\n\nMandatory GAM-PRES (38J-4 + 38L-3/38L-4): preserve DLA required_materials order; one Material per row; no function collapse; GAM-PRES-10 Evaluate completion — guided judgement insufficient without independent memo scaffold + verification checklist + transfer_prompt realised separately.\n\nEvaluate A4 household benchmark (38I-4): Maya/fixed-income perspectives, operational criteria rubric, weak/strong worked judgement, guided partial table, independent memo scaffold, verification rubric, transfer to learner household; policy communication at most one perspective lens — not capstone substance.\n\nGAM-WB-06b scaffold when learner-write; GAM-PRES-08/09 depth-shaped bodies; EV-GAM-FAIL-07 if guided-only Evaluate.\n\nUpstream learning_activities:\n" +
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
const gamMaterials = parseGamMaterials(gamText);
const acts = learning_activities.activities || learning_activities.learning_activities || [];
const gamJsonForPage = {
  activities: acts.map((act) => ({
    activity_id: act.activity_id,
    title: act.title,
    materials: gamMaterials.filter((m) => m.activity_id === act.activity_id)
  }))
};

let page = parseJsonFromText(dpText);
if (!page) {
  fs.writeFileSync(path.join(outDir, `${RUN_PREFIX}-design-page-raw.txt`), dpText, "utf8");
  throw new Error(`Design Page JSON parse failed (raw: ${RUN_PREFIX}-design-page-raw.txt)`);
}
fs.writeFileSync(path.join(outDir, `${RUN_PREFIX}-design-page-raw.txt`), dpText, "utf8");
const pageRaw = JSON.parse(JSON.stringify(page));

if (page && page.sections && api.applyPedagogicCognitionSemanticsToComposedPage) {
  page = api.applyPedagogicCognitionSemanticsToComposedPage(page, {
    upstreamLearningActivities: learning_activities,
    upstreamActivityMaterials: gamJsonForPage.activities,
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

const fidelityMetricsRaw = measurePageGamFidelity(pageRaw, { gamSource: gamJsonForPage });
const fidelityCheck = validate38MPageFidelity(page, { gamSource: gamJsonForPage });
const pagePreserveCheck = validate38LPageGamPreservation(page, { gamSource: gamJsonForPage });
const a3SeqCheck = validateA3MaterialsSequencing(page);

let renderHtml = "";
let a3RenderCheck = { ok: false, errors: ["render not built"] };
if (api.buildUtilityStructuredHtmlForTest) {
  const render = api.buildUtilityStructuredHtmlForTest(page, ["sections"]);
  renderHtml = String(render?.html || "");
  const a3Block = extractA3HtmlBlock(renderHtml, page);
  a3RenderCheck = validateA3RenderMaterialOrder(a3Block);
}

const proofOk =
  fidelityCheck.ok && pagePreserveCheck.ok && a3SeqCheck.ok && a3RenderCheck.ok;

const fidelityMetrics = measurePageGamFidelity(page, { gamSource: gamJsonForPage });
const comparator38l = load38LComparator();
const workbookMd = buildWorkbookMd(page, gamText, learning_activities);

const gamJson = {
  runId: RUN_PREFIX,
  capturedAt: new Date().toISOString(),
  activities: gamJsonForPage.activities,
  all_materials: gamMaterials
};

const report = {
  capturedAt: new Date().toISOString(),
  sprint: "38-M",
  runId: RUN_PREFIX,
  phase: "38M-5",
  harnessVersion: HARNESS_VERSION,
  frozenLearningOutcomes: FROZEN_LO_PATH,
  evaluateBenchmark: "38I-4 A4 household strategy Evaluate",
  priorRuns: ["EV-38L-AFTER"],
  comparators: ["EV-38L-AFTER", "38I-4-target-state", "38I-4-A4-episode"],
  model,
  brief: BRIEF,
  pipelinePath: [
    "brief",
    "generate_learning_content",
    "model_knowledge",
    "frozen_learning_outcomes",
    "design_learning_activities",
    "generate_activity_materials",
    "design_page",
    "applyPedagogicCognitionSemanticsToComposedPage",
    "validate38MPageFidelity",
    "validateA3MaterialsSequencing",
    "validateA3RenderMaterialOrder"
  ],
  artefactsWritten: [
    `${RUN_PREFIX}-learning-content.json`,
    `${RUN_PREFIX}-knowledge-model.json`,
    `${RUN_PREFIX}-learning-outcomes.json`,
    `${RUN_PREFIX}-learning-objectives.json`,
    `${RUN_PREFIX}-dla-learning-activities.json`,
    `${RUN_PREFIX}-gam.json`,
    `${RUN_PREFIX}-gam.txt`,
    `${RUN_PREFIX}-workbook.md`,
    `${RUN_PREFIX}-design-page-raw.txt`,
    `${RUN_PREFIX}-design-page.json`,
    `${RUN_PREFIX}-render.html`,
    `${RUN_PREFIX}-run-log.json`
  ],
  knowledgeModelConceptCount: kmConceptCount(knowledge_model),
  promptChars: {
    learning_content: lcAug.augmented.length,
    knowledge_model: kmAug.augmented.length,
    learning_outcomes: 0,
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
  })),
  proofOk,
  validation38M: {
    ok: fidelityCheck.ok,
    errors: fidelityCheck.errors,
    warnings: fidelityCheck.warnings,
    gatesPassed: fidelityCheck.ok ? "G1-G10" : []
  },
  validation38LRegression: {
    ok: pagePreserveCheck.ok,
    errors: pagePreserveCheck.errors
  },
  a3Sequencing: {
    pageJson: { ok: a3SeqCheck.ok, errors: a3SeqCheck.errors },
    render: { ok: a3RenderCheck.ok, errors: a3RenderCheck.errors, positions: a3RenderCheck.positions }
  },
  pageMetadata: {
    gam_materials_preserve_applied: page?.metadata?.gam_materials_preserve_applied === true,
    gam_materials_preserve_schema: page?.metadata?.gam_materials_preserve_schema || null,
    a3_materials_sequencing_applied: page?.metadata?.a3_materials_sequencing_applied === true
  },
  fidelityMetrics,
  fidelityAggregateByActivity: aggregateFidelityByActivity(fidelityMetrics),
  fidelityMetricsPreMerge: fidelityMetricsRaw,
  fidelityAggregatePreMerge: aggregateFidelityByActivity(fidelityMetricsRaw),
  comparator38L: comparator38l
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
if (renderHtml) {
  fs.writeFileSync(path.join(outDir, `${RUN_PREFIX}-render.html`), renderHtml, "utf8");
}
fs.writeFileSync(path.join(outDir, `${RUN_PREFIX}-run-log.json`), JSON.stringify(report, null, 2), "utf8");

console.log(JSON.stringify(report, null, 2));

if (!proofOk) {
  const parts = [];
  if (!fidelityCheck.ok) parts.push(`38M fidelity: ${fidelityCheck.errors.join("; ")}`);
  if (!pagePreserveCheck.ok) parts.push(`38L regression: ${pagePreserveCheck.errors.join("; ")}`);
  if (!a3SeqCheck.ok) parts.push(`A3 sequencing: ${a3SeqCheck.errors.join("; ")}`);
  if (!a3RenderCheck.ok) parts.push(`A3 render: ${a3RenderCheck.errors.join("; ")}`);
  process.exitCode = 1;
  console.error("EV-38M proof validation failed:", parts.join(" | "));
}
