/**

 * Sprint 38-S — Continue proof pipeline from captured raw DLA (38S-R1 single-lane).

 * Re-merge with additive population contract → GAM → Page → 38P compose → replay metrics.

 * Deprecated dual-lane fidelity fork removed.

 */

import fs from "fs";

import { captureGamPackText, gamFormat } from "./ev-38s-gam-capture-helper.mjs";

import path from "path";

import vm from "vm";

import { createRequire } from "module";

import { fileURLToPath } from "url";



const __dirname = path.dirname(fileURLToPath(import.meta.url));

const repoRoot = path.resolve(__dirname, "..", "..", "..", "..", "..");

const require = createRequire(import.meta.url);

const outDir = path.resolve(

  __dirname,

  "../../2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts"

);

const RUN_PREFIX = process.env.PRISM_RUN_PREFIX || "EV-38S-AFTER";

const model = process.env.PRISM_PROBE_MODEL || "gpt-4.1-mini";

const HARNESS_VERSION = "38S-GAM1";



const episodePlanDla = require(path.join(repoRoot, "lib", "episode-plan-dla-integration.js"));

const episodePlanContract = require(path.join(repoRoot, "lib", "episode-plan-population-contract.js"));

const { validateDla38LObligations } = require(path.join(repoRoot, "lib", "dla-38l-obligation-check.js"));

const {
  applyGamMaterialsToComposedPage,
  validate38MPageFidelity,
  validate38LPageGamPreservation,
  findLearningActivitiesRows
} = require(path.join(repoRoot, "lib", "page-gam-materials-preserve.js"));

const {

  applyA3MaterialsSequencingToComposedPage,

  validateA3MaterialsSequencing,

  validateA3RenderMaterialOrder

} = require(path.join(repoRoot, "lib", "page-a3-materials-sequencing.js"));



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

    materials.push({

      activity_id,

      material_id: m[1],

      type: m[2].trim(),

      purpose: m[3].trim(),

      content: m[4].trim(),

      contentLen: m[4].trim().length

    });

  }

  return materials;

}



function readEnvKey() {

  const raw = fs.readFileSync(path.join(repoRoot, ".env.local"), "utf8");

  const m = raw.match(/^OPENAI_API_KEY\s*=\s*(.+)$/m);

  if (!m) throw new Error("OPENAI_API_KEY missing");

  let v = m[1].trim();

  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);

  return v;

}



function parseJsonFromText(text) {

  const trimmed = String(text || "").trim();

  let slice = trimmed;

  if (slice.startsWith("```")) {

    const start = slice.indexOf("{");

    const end = slice.lastIndexOf("}");

    if (start !== -1 && end > start) slice = slice.slice(start, end + 1);

  }

  return JSON.parse(slice);

}



async function callOpenAI(apiKey, system, user, maxTokens) {

  const res = await fetch("https://api.openai.com/v1/responses", {

    method: "POST",

    headers: { "Content-Type": "application/json", Authorization: "Bearer " + apiKey },

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

  if (typeof text !== "string") throw new Error("Unexpected OpenAI response");

  return text.trim();

}



function loadApi() {

  const sandbox = { console, setTimeout, clearTimeout, Promise, fetch: globalThis.fetch };

  const elementStore = new Map();

  const documentStub = {

    readyState: "complete",

    addEventListener: () => {},

    createElement: () => ({

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

    }),

    getElementById: (id) => {

      if (!elementStore.has(id)) elementStore.set(id, documentStub.createElement());

      return elementStore.get(id);

    },

    querySelector: () => documentStub.createElement(),

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

    "sprint38-visual-affordances.js",

    "ld-table-fidelity.js",

    "ld-materials-copy.js",

    "ld-math-render.js",

    "ld-self-directed-rhetoric.js",

    "ld-design-page-compose-contract.js",

    "design-page-materials-fidelity.js",

    "page-gam-materials-preserve.js",

    "page-role-registry.js",

    "page-role-render-sequencing.js",

    "page-role-fidelity.js",

    "page-a3-materials-sequencing.js",

    "episode-plan-population-contract.js",

    "episode-plan-v1-templates.js",

    "episode-plan-dla-integration.js"

  ]) {

    vm.runInContext(fs.readFileSync(path.join(repoRoot, "lib", f), "utf8"), sandbox, { filename: f });

  }

  vm.runInContext(fs.readFileSync(path.join(repoRoot, "app.js"), "utf8"), sandbox, { filename: "app.js" });

  return sandbox.window.__PRISM_TEST_API;

}



function normalizePageForGamCompose(page, learningActivities) {
  if (!page || typeof page !== "object") page = {};
  if (findLearningActivitiesRows(page).length >= 4) return page;
  const acts =
    (Array.isArray(page.activities) && page.activities.length ? page.activities : null) ||
    learningActivities.activities ||
    learningActivities.learning_activities ||
    [];
  const content = acts.map((act) => ({
    activity_id: act.activity_id,
    title: act.title,
    duration_minutes: act.duration_minutes,
    learner_task: act.learner_task,
    expected_output: act.expected_output,
    activity_preamble: act.activity_preamble,
    materials: act.materials && typeof act.materials === "object" ? act.materials : {}
  }));
  const sections = Array.isArray(page.sections) ? page.sections.slice() : [];
  const withoutLa = sections.filter(
    (s) => !/learning.?activit/i.test(String(s.section_id || s.heading || ""))
  );
  return Object.assign({}, page, {
    sections: withoutLa.concat([
      {
        section_id: "learning_activities",
        heading: "Learning Activities",
        content
      }
    ])
  });
}

function extractActivityHtmlBlock(html, page, activityIndex) {

  const text = String(html || "");

  const section = (page?.sections || []).find((s) =>

    /learning.?activit/i.test(String(s.section_id || s.heading || ""))

  );

  const rows = Array.isArray(section?.content) ? section.content : [];

  const row = rows[activityIndex];

  if (!row) return text;

  const title = String(row.title || row.activity_title || "");

  if (!title) return text;

  const start = text.indexOf(title);

  if (start < 0) return text;

  const nextRow = rows[activityIndex + 1];

  const nextTitle = nextRow ? String(nextRow.title || nextRow.activity_title || "") : "";

  const end = nextTitle ? text.indexOf(nextTitle, start + title.length) : text.length;

  return text.substring(start, end > start ? end : text.length);

}



const rawPath = path.join(outDir, `${RUN_PREFIX}-dla-learning-activities-raw.txt`);

const plansPath = path.join(outDir, `${RUN_PREFIX}-episode-plans.json`);

const kmPath = path.join(outDir, `${RUN_PREFIX}-knowledge-model.json`);

const loPath = path.join(outDir, "ev-38l-frozen-learning-outcomes.json");



const rawLlm = parseJsonFromText(fs.readFileSync(rawPath, "utf8"));

const episode_plans = JSON.parse(fs.readFileSync(plansPath, "utf8"));

const knowledge_model = JSON.parse(fs.readFileSync(kmPath, "utf8"));

const learning_outcomes = JSON.parse(fs.readFileSync(loPath, "utf8"));



const merged = episodePlanDla.applyPopulationContractToLearningActivities(rawLlm, episode_plans);

if (!merged.ok) throw new Error("merge failed: " + merged.errors.join("; "));



const learning_activities = merged.learning_activities;

const populationValidation = episodePlanDla.validateLearningActivitiesPopulationContract(

  learning_activities,

  episode_plans

);

const dla38lCheck = validateDla38LObligations(learning_activities);



if (!populationValidation.ok) {

  throw new Error("population contract failed: " + populationValidation.errors.join("; "));

}

if (!dla38lCheck.ok) {

  throw new Error("38L obligations failed: " + dla38lCheck.errors.join("; "));

}



fs.writeFileSync(

  path.join(outDir, `${RUN_PREFIX}-dla-learning-activities.json`),

  JSON.stringify(learning_activities, null, 2),

  "utf8"

);



const apiKey = readEnvKey();

const api = loadApi();

const ctxHeader =
  "Workflow: Inflation self-directed learner workbook (Sprint 38-L — same topic domain as EV-38G-AFTER / EV-38J-AFTER; Evaluate benchmark aligned to 38I-4 A4 household strategy judgement).\n" +
  "page_profile=learner; apply pack IFP (38J-3 + 38L-2/38L-4 §5): IFP-09 depth floors, IFP-10 emission gates, INF-EVAL-01 household Evaluate anchor, EV-CAP-04 termination gate, DLA-WB-26..31.\n" +
  "GAM-PRES (38J-4 + 38L-3/38L-4 §6): preserve function order; GAM-PRES-08/09 depth-shaped bodies; GAM-PRES-10 Evaluate completion termination; GAM-WB-26..31.\n";

const sanitizeCtx = {
  workflowGoal: "Inflation workbook proof",
  desiredOutputs: "page",
  stepCanonicalStepId: "step_generate_activity_materials",
  stepCanonicalTitle: "Generate Activity Materials",
  upstreamActivities: learning_activities.activities || learning_activities
};

const gamAugStub = { augmented: "" };
let gamCapture;
try {
  gamCapture = await captureGamPackText({
    callOpenAI,
    apiKey,
    api,
    ctxHeader,
    gamAugmented: gamAugStub.augmented,
    learningActivities: learning_activities,
    knowledgeModel: knowledge_model,
    sanitizeCtx,
    maxAttempts: Number(process.env.PRISM_GAM_MAX_ATTEMPTS || 3),
    minMaterials: 12
  });
} catch (err) {
  if (err.gamTextRaw) {
    fs.writeFileSync(path.join(outDir, `${RUN_PREFIX}-gam-raw-rejected.txt`), err.gamTextRaw, "utf8");
  }
  throw err;
}

const gamText = gamCapture.gamText;
const gamValidation = gamCapture.validation;

const dpText = await callOpenAI(

  apiKey,

  "Return JSON only for composed learner page.",

  ctxHeader +

    "\nUpstream learning_outcomes:\n" +

    JSON.stringify(learning_outcomes, null, 2) +

    "\n\nUpstream learning_activities:\n" +

    JSON.stringify(learning_activities, null, 2) +

    "\n\nUpstream activity_materials excerpt:\n" +

    gamText.slice(0, 16000),

  12000

);



let page = parseJsonFromText(dpText);

const gamMaterials = gamFormat.parseGamMaterialsFromText(gamText);

const acts = learning_activities.activities || [];

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



page = normalizePageForGamCompose(page, learning_activities);

page = applyGamMaterialsToComposedPage(page, gamJson);

page = applyA3MaterialsSequencingToComposedPage(page);



const pagePreserveCheck = validate38LPageGamPreservation(page, { gamSource: gamJson });

const render = api.buildUtilityStructuredHtmlForTest(page, ["sections"]);

const renderHtml = String(render?.html || "");

const a3Block = extractActivityHtmlBlock(renderHtml, page, 2);

const fidelityCheck = validate38MPageFidelity(page, { gamSource: gamJson });

const a3SeqCheck = validateA3MaterialsSequencing(page);

const a3RenderCheck = validateA3RenderMaterialOrder(a3Block);

const proofDims = api.computeProofDimensionsForTest(page, { gamSource: gamJson, renderHtml });



fs.writeFileSync(path.join(outDir, `${RUN_PREFIX}-gam.txt`), gamText, "utf8");

fs.writeFileSync(path.join(outDir, `${RUN_PREFIX}-design-page.json`), JSON.stringify(page, null, 2), "utf8");

fs.writeFileSync(path.join(outDir, `${RUN_PREFIX}-gam.json`), JSON.stringify(gamJson, null, 2), "utf8");



const proofReplay = {

  harnessVersion: HARNESS_VERSION,

  singleLane: true,

  gamOutputValidation: gamValidation,
  gamCaptureAttempts: gamCapture.attempts,

  populationContract: populationValidation.ok,

  dla38l: dla38lCheck.ok,

  proofOk: proofDims.proofOk,

  roleOk: proofDims.roleOk,

  fullOk: proofDims.fullOk,

  validation38M: { ok: fidelityCheck.ok, errors: fidelityCheck.errors },

  validation38L: { ok: pagePreserveCheck.ok, errors: pagePreserveCheck.errors },

  validation38P: { ok: proofDims.validation38P?.ok, errors: proofDims.validation38P?.errors || [] },

  a3Sequencing: { ok: a3SeqCheck.ok && a3RenderCheck.ok }

};

fs.writeFileSync(path.join(outDir, `${RUN_PREFIX}-proof-replay.json`), JSON.stringify(proofReplay, null, 2), "utf8");



console.log(JSON.stringify(proofReplay, null, 2));

process.exit(proofReplay.fullOk ? 0 : 1);


