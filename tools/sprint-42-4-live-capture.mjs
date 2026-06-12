#!/usr/bin/env node
/**
 * Sprint 42-4 — live workflow capture (OpenAI + current app.js + Sprint 42 libs).
 * Run: node tools/sprint-42-4-live-capture.mjs [marx-self-study|inflation-workshop|climate-workshop|all]
 */
import fs from "fs";
import path from "path";
import vm from "vm";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const require = createRequire(import.meta.url);
const {
  parseKnowledgeModelCapture,
  buildKmHarnessOutputContract,
  extractFencedJsonBlock,
  normalizeKnowledgeModelShape
} = require(
  "../docs/development/sprints/2026-06-05-sprint-38h-workbook-realisation-fidelity/artefacts/ev-harness-artefact-parse.js"
);
const preambleLib = require("../lib/ld-activity-preamble-exposition.js");
const eqfEval = require("../lib/educational-quality-framework-evaluator.js");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const outRoot = path.join(
  repoRoot,
  "docs/development/sprints/2026-06-11-sprint-42-authorial-quality-educational-exposition/captures/sprint-42-exposition/42-4-live-runs"
);
const model = process.env.PRISM_PROBE_MODEL || "gpt-4.1-mini";
const mdPath = path.join(repoRoot, "domains/learning-design/domain-learning-design-step-patterns.md");

const WORKFLOWS = {
  "marx-self-study": {
    id: "marx-self-study",
    brief: {
      goal:
        "Create a self-directed learning page on Karl Marx covering life phases, cause-effect links between experience and theory, comparison of The Communist Manifesto and Das Kapital, and application of core concepts to a factory scenario.",
      inputs: "Undergraduate (self-directed study)",
      desiredOutputs: "Learner-facing page",
      selectedDomains: ["learning-design"]
    },
    ctxNote: "Self-directed undergraduate learner page."
  },
  "inflation-workshop": {
    id: "inflation-workshop",
    brief: {
      goal:
        "Design a 60-minute first-year economics workshop introducing inflation, price level changes, CPI and GDP deflator comparison, and household impacts. Small-group discussion and tables.",
      inputs: "First-year undergraduate economics students",
      desiredOutputs: "Learner-facing page",
      selectedDomains: ["learning-design"]
    },
    ctxNote: "Facilitated first-year economics workshop learner handout (page_profile learner). No facilitator choreography in learner-visible fields."
  },
  "climate-workshop": {
    id: "climate-workshop",
    brief: {
      goal:
        "Using the uploaded lecture on climate change, create a misconception discussion workshop. Provide task cards of common false claims, an analysis worksheet, and discussion prompts. End with true/false diagnostic statements — learners should not see correct answers on the handout.",
      inputs:
        "Uploaded lecture transcript excerpt:\n\nGlobal mean temperature has risen since pre-industrial times, driven largely by greenhouse gases from human activity. Climate models project further warming depending on emissions pathways. Weather describes short-term atmospheric conditions; climate is long-term statistical patterns. Skeptical arguments often confuse cold snaps with disproof of warming, or treat natural variability as ruling out human influence.",
      desiredOutputs: "Learner handout page",
      startingArtefact: "provided_source_content",
      selectedDomains: ["learning-design"]
    },
    ctxNote: "Climate misconception discussion workshop learner handout. Learners must not see correct answers on the handout."
  }
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

function gitMeta() {
  let head = "";
  let dirty = "";
  try {
    head = execSync("git rev-parse HEAD", { cwd: repoRoot, encoding: "utf8" }).trim();
    dirty = execSync("git status --porcelain", { cwd: repoRoot, encoding: "utf8" }).trim();
  } catch (_) {}
  return { head, workingTreeDirty: !!dirty, dirtyFiles: dirty ? dirty.split("\n").slice(0, 30) : [] };
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
    URL: { createObjectURL: () => "", revokeObjectURL: () => {} },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    }
  };
  windowStub.window = windowStub;
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  vm.createContext(sandbox);
  const bootstrap = require(path.join(repoRoot, "tests/prism-vm-lib-bootstrap.js"));
  bootstrap.runPrismLibScriptsInSandbox(sandbox, repoRoot);
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
  if (typeof text !== "string") throw new Error("Unexpected OpenAI response shape");
  return text.trim();
}

function buildWorkflow(md, api, brief) {
  const cfgIdx = md.indexOf("### Workflow Brief Config");
  const cfgFence = md.indexOf("```json", cfgIdx);
  const cfgClose = md.indexOf("```", cfgFence + 7);
  const wfCfg = JSON.parse(md.slice(cfgFence + 7, cfgClose).trim()).workflowBriefConfig;
  const explicit = api.extractWorkflowBriefExplicitFactors(brief);
  const inferred = api.applyWorkflowBriefInferenceRules(wfCfg, brief.goal, brief.inputs);
  const resolved = api.resolveWorkflowBriefFactors(wfCfg, explicit, {}, inferred, brief).resolved;
  return {
    goal: brief.goal,
    inputs: brief.inputs,
    desiredOutputs: brief.desiredOutputs,
    workflowOutputs: ["page", "learning_activities", "activity_materials"],
    workflowOutputSpec: { goal: brief.goal, desiredOutputs: brief.desiredOutputs },
    workflowBriefResolution: { resolvedFactors: resolved }
  };
}

function augment(api, md, wf, brief, sectionHeading, stepId, title, outputName) {
  const factory = extractFactory(md, sectionHeading);
  const step = { canonical_step_id: stepId, canonical_title: title, title, outputName };
  const seeded = api.buildSeededStepPromptForWorkflowStep({
    workflowName: `Sprint42 ${wf.goal.slice(0, 40)}`,
    step,
    matchedPattern: { promptFactory: factory }
  });
  const augmented = api.applyWorkflowStepRuntimePromptAugmentations(seeded, step, wf, {});
  return { factory, step, seeded, augmented };
}

function pageActivities(page) {
  const sec = (page?.sections || []).find(
    (s) => s.section_id === "learning_activities" || /learning activities/i.test(s.heading || "")
  );
  if (!sec) return [];
  return Array.isArray(sec.content) ? sec.content : sec.content?.activities || [];
}

function narrativeAudit(page, label) {
  const acts = pageActivities(page);
  const sections = page?.sections || [];
  const hasOverview = sections.some((s) => /overview/i.test(s.section_id || s.heading || ""));
  const hasLearningPurpose = sections.some((s) => /learning_purpose/i.test(s.section_id || s.heading || ""));
  const hasStudyTips = sections.some((s) => /study_tips/i.test(s.section_id || s.heading || ""));
  const preambleCount = acts.filter((a) => a.activity_preamble).length;
  const bridgeCount = acts.filter((a) => a.intellectual_coherence_bridge).length;
  const facilitatorLeak = acts.some((a) =>
    /circulate during|minutes?\s+\d+\s*[-–]\s*\d+|offer a worked example if groups stall/i.test(
      String(a.support_note || "")
    )
  );
  const preambleEvidence = preambleLib.evaluateActivityPreambleExpositionEvidence(acts);
  const eqf = eqfEval.evaluateEducationalQualityFrameworkEvidence(page);
  return {
    label,
    centralInquiry: hasOverview || hasLearningPurpose ? "partial" : "weak",
    activityCount: acts.length,
    preambleCount,
    bridgeCount,
    hasStudyTips,
    facilitatorLeak,
    preambleExposition: preambleEvidence,
    eqfScore: eqf.score,
    eqfDimensions: eqf.dimensions
  };
}

async function runWorkflow(api, md, apiKey, wfDef) {
  const { brief, ctxNote } = wfDef;
  const wf = buildWorkflow(md, api, brief);
  const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const runDir = path.join(outRoot, `${wfDef.id}-${ts}`);
  fs.mkdirSync(runDir, { recursive: true });

  const ctxHeader = `${ctxNote}\n\n`;

  const lcAug = augment(api, md, wf, brief, "## 2. Generate Learning Content", "step_generate_learning_content", "Generate Learning Content", "learning_content");
  const kmAug = augment(api, md, wf, brief, "## 3. Model Knowledge", "step_model_knowledge", "Model Knowledge", "knowledge_model");
  const loAug = augment(api, md, wf, brief, "## 4. Define Learning Outcomes", "step_define_learning_outcomes", "Define Learning Outcomes", "learning_outcomes");
  const dlaAug = augment(api, md, wf, brief, "## 5. Design Learning Activities", "step_design_learning_activities", "Design Learning Activities", "learning_activities");
  const gamAug = augment(api, md, wf, brief, "## 6. Generate Activity Materials", "step_generate_activity_materials", "Generate Activity Materials", "activity_materials");
  const dpAug = augment(api, md, wf, brief, "## 13. Design Page", "step_design_page", "Design Page", "page");

  fs.writeFileSync(path.join(runDir, "dla-prompt-snapshot.txt"), dlaAug.augmented, "utf8");
  fs.writeFileSync(path.join(runDir, "design-page-prompt-snapshot.txt"), dpAug.augmented, "utf8");

  const contractCheck = {
    dlaHasPreambleExposition: /LD-ACTIVITY-PREAMBLE-EXPOSITION-CONTRACT/i.test(dlaAug.augmented),
    dlaHasAuthorialExposition: /LD-AUTHORIAL-EXPOSITION-CONTRACT/i.test(dlaAug.augmented),
    dpHasAuthorialExposition: /LD-AUTHORIAL-EXPOSITION-CONTRACT/i.test(dpAug.augmented),
    dlaHasLearnerFraming: /learner-page activity framing \(auto-applied\)/i.test(dlaAug.augmented)
  };
  fs.writeFileSync(path.join(runDir, "prompt-contract-check.json"), JSON.stringify(contractCheck, null, 2));

  const lcText = await callOpenAI(apiKey, "Return JSON only for learning_content.", ctxHeader + "\nBrief:\n" + JSON.stringify(brief, null, 2) + "\n\n---\n\n" + lcAug.augmented, 4000);
  let learning_content = parseJsonFromText(lcText) || { title: wfDef.id, sections: [{ title: "Overview", content: lcText.slice(0, 1500) }] };
  fs.writeFileSync(path.join(runDir, "learning-content.json"), JSON.stringify(learning_content, null, 2));

  const kmSystemPrompt = [
    "You execute the Model Knowledge workflow step.",
    "Return exactly one fenced ```json block containing the knowledge_model object.",
    "No conversational prose before the opening fence or after the closing fence.",
    "No raw JSON outside a fence. No JSON comments."
  ].join(" ");

  let knowledge_model = null;
  let kmText = "";
  for (let attempt = 1; attempt <= 3; attempt++) {
    kmText = await callOpenAI(
      apiKey,
      kmSystemPrompt,
      ctxHeader +
        "\nUpstream learning_content:\n" +
        JSON.stringify(learning_content, null, 2).slice(0, 8000) +
        "\n" +
        buildKmHarnessOutputContract(2) +
        (attempt > 1 ? "\n\nRETRY: prior output had prose outside the fence or invalid JSON. Output ONLY the fenced block." : "") +
        "\n\n---\n\n" +
        kmAug.augmented,
      4000
    );
    fs.writeFileSync(path.join(runDir, `knowledge-model-raw-attempt-${attempt}.txt`), kmText, "utf8");
    try {
      knowledge_model = parseKnowledgeModelCapture(kmText, api.sanitizePrismRunCapturedOutput);
      break;
    } catch (err) {
      const fenced = extractFencedJsonBlock(kmText);
      if (fenced) {
        try {
          const parsed = JSON.parse(fenced);
          knowledge_model = normalizeKnowledgeModelShape(
            api.sanitizePrismRunCapturedOutput ? api.sanitizePrismRunCapturedOutput(parsed) : parsed
          );
          break;
        } catch (_) {}
      }
      if (attempt === 3) throw new Error(`${err.message} (see knowledge-model-raw-attempt-*.txt)`);
    }
  }
  fs.writeFileSync(path.join(runDir, "knowledge-model.json"), JSON.stringify(knowledge_model, null, 2));

  const loText = await callOpenAI(
    apiKey,
    "Return JSON only for learning_outcomes.",
    ctxHeader + "\nUpstream knowledge_model:\n" + JSON.stringify(knowledge_model, null, 2) + "\n\n---\n\n" + loAug.augmented,
    2000
  );
  const learning_outcomes = parseJsonFromText(loText) || { learning_outcomes: [] };

  const dlaText = await callOpenAI(
    apiKey,
    "Return JSON only for learning_activities with activities array.",
    ctxHeader +
      "\nUpstream learning_outcomes:\n" +
      JSON.stringify(learning_outcomes, null, 2) +
      "\n\nUpstream knowledge_model:\n" +
      JSON.stringify(knowledge_model, null, 2) +
      "\n\n---\n\n" +
      dlaAug.augmented,
    8000
  );
  let learning_activities = parseJsonFromText(dlaText) || { activities: [] };

  const gamTextRaw = await callOpenAI(
    apiKey,
    "Return organised activity_materials text per pack structure.",
    ctxHeader +
      "\nUpstream learning_activities:\n" +
      JSON.stringify(learning_activities, null, 2) +
      "\n\nUpstream knowledge_model:\n" +
      JSON.stringify(knowledge_model, null, 2) +
      "\n\n---\n\n" +
      gamAug.augmented,
    12000
  );
  const sanitizeCtx = {
    workflowGoal: wf.goal,
    desiredOutputs: brief.desiredOutputs,
    workflowInputs: brief.inputs,
    stepCanonicalStepId: "step_generate_activity_materials",
    stepCanonicalTitle: "Generate Activity Materials",
    workflowBriefResolution: wf.workflowBriefResolution,
    upstreamActivities: learning_activities.activities || learning_activities
  };
  const sanitized = api.sanitizeSelfDirectedGamMaterialsOutput
    ? api.sanitizeSelfDirectedGamMaterialsOutput(gamTextRaw, sanitizeCtx)
    : { text: gamTextRaw };
  const gamText = String(sanitized.text != null ? sanitized.text : gamTextRaw);

  const dpText = await callOpenAI(
    apiKey,
    "Return JSON only for composed learner page with artifact_type page.",
    ctxHeader +
      "\npage_profile=learner. Preserve activity_preamble, cognition fields, bridges, materials verbatim.\n\nUpstream learning_activities:\n" +
      JSON.stringify(learning_activities, null, 2) +
      "\n\nUpstream activity_materials (excerpt):\n" +
      gamText.slice(0, 14000) +
      "\n\n---\n\n" +
      dpAug.augmented,
    10000
  );
  fs.writeFileSync(path.join(runDir, "design-page-raw.txt"), dpText, "utf8");
  let page = parseJsonFromText(dpText);

  if (page && api.applyPedagogicCognitionSemanticsToComposedPage) {
    const cfgIdx = md.indexOf("### Workflow Brief Config");
    const cfgFence = md.indexOf("```json", cfgIdx);
    const cfgClose = md.indexOf("```", cfgFence + 7);
    const wfCfg = JSON.parse(md.slice(cfgFence + 7, cfgClose).trim()).workflowBriefConfig;
    page = api.applyPedagogicCognitionSemanticsToComposedPage(page, {
      upstreamLearningActivities: learning_activities,
      resolvedFactors: wf.workflowBriefResolution.resolvedFactors,
      workflowBriefConfig: wfCfg,
      base: brief
    });
  }

  fs.writeFileSync(path.join(runDir, "learning-outcomes.json"), JSON.stringify(learning_outcomes, null, 2));
  fs.writeFileSync(path.join(runDir, "dla-learning-activities.json"), JSON.stringify(learning_activities, null, 2));
  fs.writeFileSync(path.join(runDir, "gam-activity-materials.txt"), gamText);
  fs.writeFileSync(path.join(runDir, "design-page.json"), JSON.stringify(page, null, 2));

  let html = "";
  let renderError = "";
  if (page && api.buildUtilityStructuredHtmlForTest) {
    const r = api.buildUtilityStructuredHtmlForTest(page);
    if (r.error) renderError = r.error;
    else html = r.html || "";
    fs.writeFileSync(path.join(runDir, "page-rendered.html"), html || "<!-- render error: " + renderError + " -->");
  }

  const dlaActs = learning_activities.activities || [];
  const dlaPreambleAudit = preambleLib.evaluateActivityPreambleExpositionEvidence(dlaActs);
  const pageAudit = page ? narrativeAudit(page, wfDef.id) : null;

  const manifest = {
    capturedAt: new Date().toISOString(),
    command: "node tools/sprint-42-4-live-capture.mjs " + wfDef.id,
    model,
    git: gitMeta(),
    sprint42ContractsInPrompts: contractCheck,
    brief,
    resolvedFactors: wf.workflowBriefResolution.resolvedFactors,
    outputDir: path.relative(repoRoot, runDir),
    artefacts: [
      "learning-content.json",
      "knowledge-model.json",
      "learning-outcomes.json",
      "dla-learning-activities.json",
      "gam-activity-materials.txt",
      "design-page.json",
      "page-rendered.html",
      "dla-prompt-snapshot.txt",
      "design-page-prompt-snapshot.txt",
      "prompt-contract-check.json"
    ],
    dlaPreambleAudit,
    pageAudit,
    renderError: renderError || null,
    validPost423Evidence:
      contractCheck.dlaHasPreambleExposition &&
      contractCheck.dpHasAuthorialExposition &&
      dlaPreambleAudit.preambleCount > 0
  };
  fs.writeFileSync(path.join(runDir, "provenance-manifest.json"), JSON.stringify(manifest, null, 2));
  return manifest;
}

async function main() {
  const arg = process.argv[2] || "all";
  const ids =
    arg === "all" ? Object.keys(WORKFLOWS) : arg.split(",").map((s) => s.trim());
  fs.mkdirSync(outRoot, { recursive: true });
  const api = loadApi();
  const md = fs.readFileSync(mdPath, "utf8");
  const apiKey = readEnvKey();
  const results = [];
  for (const id of ids) {
    const wfDef = WORKFLOWS[id];
    if (!wfDef) {
      console.error("Unknown workflow:", id);
      process.exit(1);
    }
    console.error("Running workflow:", id);
    results.push(await runWorkflow(api, md, apiKey, wfDef));
  }
  const summary = {
    capturedAt: new Date().toISOString(),
    command: "node tools/sprint-42-4-live-capture.mjs " + arg,
    git: gitMeta(),
    model,
    runs: results
  };
  fs.writeFileSync(path.join(outRoot, "capture-summary.json"), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
