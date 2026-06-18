#!/usr/bin/env node
/**
 * Sprint 50 — automated MarxEduQSelfStudy verification run.
 *
 * Loads the workflow from a one-time UI export (workflow lives in browser localStorage only).
 * Executes steps via __PRISM_TEST_API + OpenAI (.env.local), same prompt chain as Run-mode Copy.
 *
 * Usage:
 *   node tools/sprint-50-marx-verification-run.mjs
 *   node tools/sprint-50-marx-verification-run.mjs --dry-run
 *   node tools/sprint-50-marx-verification-run.mjs --export path/to/MarxEduQSelfStudy.bundle.json
 */
import fs from "fs";
import path from "path";
import vm from "vm";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const require = createRequire(import.meta.url);
const { runPrismLibScriptsInSandbox } = require("../tests/prism-vm-lib-bootstrap.js");
const {
  parseKnowledgeModelCapture,
  buildKmHarnessOutputContract,
  extractFencedJsonBlock,
  normalizeKnowledgeModelShape
} = require(
  "../docs/development/sprints/2026-06-05-sprint-38h-workbook-realisation-fidelity/artefacts/ev-harness-artefact-parse.js"
);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const WORKFLOW_NAME = "MarxEduQSelfStudy";
const DEFAULT_EXPORT = path.join(
  repoRoot,
  "docs/development/sprints/2026-06-20-sprint-50-pedagogic-manifestation/marx_export/workflow-marxeduqselfstudy.json"
);
const RUN_DIR = path.join(
  repoRoot,
  "docs/development/sprints/2026-06-20-sprint-50-pedagogic-manifestation/verification-runs/2026-06-18-marx-self-study"
);
const PROVIDER = "openai";
const API_ENDPOINT = "https://api.openai.com/v1/responses";
const model = process.env.PRISM_PROBE_MODEL || "gpt-4.1-mini";

const STEP_MAX_TOKENS = {
  learning_content: 4000,
  knowledge_model: 4000,
  learning_outcomes: 2500,
  episode_plans: 2000,
  learning_activities: 9000,
  activity_materials: 14000,
  learning_sequence: 3000,
  page: 12000,
  default: 6000
};

function parseArgs(argv) {
  const out = { dryRun: false, exportPath: DEFAULT_EXPORT, runDir: RUN_DIR };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--dry-run") out.dryRun = true;
    else if (a === "--export" && argv[i + 1]) {
      out.exportPath = path.resolve(argv[++i]);
    } else if (a === "--help" || a === "-h") {
      console.log(`Usage: node tools/sprint-50-marx-verification-run.mjs [--dry-run]`);
      process.exit(0);
    }
  }
  if (path.resolve(out.exportPath) !== path.resolve(DEFAULT_EXPORT)) {
    throw new Error(
      `This verification runner only accepts the Sprint 50 Marx export:\n  ${DEFAULT_EXPORT}\nGot: ${out.exportPath}`
    );
  }
  return out;
}

function readOpenAiKey() {
  for (const name of [".env.local", ".env"]) {
    const envPath = path.join(repoRoot, name);
    if (!fs.existsSync(envPath)) continue;
    const raw = fs.readFileSync(envPath, "utf8");
    const m = raw.match(/^OPENAI_API_KEY\s*=\s*(.+)$/m);
    if (!m) continue;
    let v = m[1].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (v) return { key: v, source: name };
  }
  throw new Error("OPENAI_API_KEY not found in repo-root .env.local or .env");
}

function gitMeta() {
  try {
    const dirtyRaw = execSync("git status --porcelain", { cwd: repoRoot, encoding: "utf8" }).trim();
    return {
      commit: execSync("git rev-parse HEAD", { cwd: repoRoot, encoding: "utf8" }).trim(),
      dirty: !!dirtyRaw,
      dirtyFiles: dirtyRaw ? dirtyRaw.split("\n").slice(0, 40) : []
    };
  } catch {
    return { commit: "", dirty: false, dirtyFiles: [] };
  }
}

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: { add() {}, remove() {}, contains: () => false, toggle: () => false },
    style: {},
    dataset: {},
    children: [],
    options: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute: () => null,
    addEventListener() {},
    removeEventListener() {},
    focus() {},
    click() {},
    querySelector: () => null,
    querySelectorAll: () => []
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
    location: { hostname: "127.0.0.1" },
    localStorage: { getItem: () => null, setItem: () => {} },
    _: { debounce: (fn) => fn },
    Utils: { debounce: (fn) => fn },
    Library: { importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }) }
  };
  windowStub.window = windowStub;
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  vm.createContext(sandbox);

  const epTemplates = require(path.join(repoRoot, "lib/episode-plan-v1-templates.js"));
  const epIntegration = require(path.join(repoRoot, "lib/episode-plan-dla-integration.js"));
  const epValidation = require(path.join(repoRoot, "lib/episode-plan-v1-validation.js"));
  const strictJson = require(path.join(repoRoot, "lib/workflow-artefact-json-strict.js"));
  windowStub.PRISM_EPISODE_PLAN_V1_TEMPLATES = epTemplates;
  windowStub.PRISM_EPISODE_PLAN_DLA_INTEGRATION = epIntegration;
  windowStub.PRISM_EPISODE_PLAN_V1_VALIDATION = epValidation;
  windowStub.PRISM_WORKFLOW_ARTEFACT_JSON_STRICT = strictJson;

  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  vm.runInContext(fs.readFileSync(path.join(repoRoot, "app.js"), "utf8"), sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  if (!api) throw new Error("__PRISM_TEST_API missing");
  return api;
}

function loadWorkflowBundle(exportPath) {
  if (!fs.existsSync(exportPath)) {
    throw new Error(
      `Workflow export not found: ${exportPath}\n` +
        `Export MarxEduQSelfStudy once from PRISM (Workflows → Export selected) and save as:\n` +
        `  ${DEFAULT_EXPORT}\n` +
        `Or pass --export <path>. See SPRINT-50-AUTOMATED-VERIFICATION-STRATEGY.md.`
    );
  }
  const data = JSON.parse(fs.readFileSync(exportPath, "utf8"));
  const workflows = Array.isArray(data.workflows)
    ? data.workflows
    : Array.isArray(data)
      ? data
      : [];
  const prompts = Array.isArray(data.prompts) ? data.prompts : [];
  const wf =
    workflows.find((w) => String(w.name || "").trim() === WORKFLOW_NAME) ||
    workflows.find((w) => /marx.*self.*study/i.test(String(w.name || "")));
  if (!wf) {
    const names = workflows.map((w) => w.name).filter(Boolean);
    throw new Error(
      `Workflow "${WORKFLOW_NAME}" not in export. Found: ${names.length ? names.join(", ") : "(none)"}`
    );
  }
  return { wf, prompts, exportPath };
}

function makeStepLi(step) {
  const bindings = Array.isArray(step.inputBindings) ? step.inputBindings : [];
  return {
    getAttribute: (name) => {
      if (name === "data-step-id") return String(step.id || "");
      if (name === "data-input-bindings") return JSON.stringify(bindings);
      if (name === "data-canonical-step-id") return String(step.canonical_step_id || "");
      return "";
    },
    querySelector: () => null
  };
}

function artifactKey(step) {
  const out = String(step.outputName || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
  if (out) return out;
  const title = String(step.title || "").toLowerCase();
  if (title.includes("learning content")) return "learning_content";
  if (title.includes("model knowledge")) return "knowledge_model";
  if (title.includes("learning outcomes")) return "learning_outcomes";
  if (title.includes("episode plan")) return "episode_plans";
  if (title.includes("design learning activit")) return "learning_activities";
  if (title.includes("activity material")) return "activity_materials";
  if (title.includes("learning sequence")) return "learning_sequence";
  if (title.includes("design page")) return "page";
  return "step_" + String(step.id || "unknown");
}

function isEpisodePlanStep(api, step) {
  return api.isWorkflowStepDesignEpisodePlan({
    stepCanonicalStepId: step.canonical_step_id || step.canonicalStepId || "",
    stepCanonicalTitle: step.title || "",
    stepTitle: step.title || ""
  });
}

function parseJsonFromText(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
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
  }
  return null;
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
  if (!res.ok) throw new Error("OpenAI " + res.status + ": " + (await res.text()).slice(0, 600));
  const data = await res.json();
  const text = data?.output?.[0]?.content?.[0]?.text;
  if (typeof text !== "string") throw new Error("Unexpected OpenAI response shape");
  return text.trim();
}

function processCapture(api, wf, step, raw) {
  const sid = String(step.id || "");
  const stubLi = makeStepLi(step);
  let body = String(raw || "");

  if (isEpisodePlanStep(api, step)) {
    body = api.applyEpisodePlanCaptureCanonicalEnforcement(body, step, sid) || body;
  }

  if (api.isWorkflowStepDesignPageRow(step) && body.trim()) {
    const pageNorm = api.normalizePageWorkflowRunCapture(body, sid);
    if (pageNorm.ok && pageNorm.json) body = pageNorm.json;
  }

  const ctx = api.buildWorkflowStepPromptAugmentContextFromStep(step, wf);
  let sanitized = api.sanitizePrismRunCapturedOutput(body);
  if (api.shouldSanitizeSelfDirectedGamMaterialsOutput(ctx)) {
    const gam = api.sanitizeSelfDirectedGamMaterialsOutput(sanitized, ctx);
    sanitized = String(gam.text != null ? gam.text : sanitized);
  }

  let capture = api.applyLearnerPageDlaFramingValidationToCapture(
    api.applyEpisodePlanPopulationEnforcementToDlaCapture(sanitized, ctx, sid),
    ctx,
    sid
  );

  const outKey = artifactKey(step);
  if (outKey === "page" || api.isWorkflowStepDesignPageRow(step)) {
    const composed = api.applyPageCompositionValidationForCapturedPage(stubLi, body);
    if (composed && composed.json) {
      body = composed.json;
      capture = api.sanitizePrismRunCapturedOutput(body);
    }
  }

  return { raw: body, sanitized: capture, artifactKey: outKey };
}

function setupWorkflow(api, wf, prompts) {
  const normalized =
    typeof api.normalizeWorkflowForV1 === "function"
      ? api.normalizeWorkflowForV1(wf, [])
      : wf;
  api.setPromptsForTest(prompts);
  api.setWorkflowsForTest([normalized]);
  api.setSelectedWorkflowIdForTest(normalized.id);
  if (typeof api.syncWorkflowSelectedDomainsFromWorkflowRecord === "function") {
    api.syncWorkflowSelectedDomainsFromWorkflowRecord(normalized);
  }
  api.setWorkflowRunCaptureMapsForTest({}, {});
  return normalized;
}

function persistCaptures(api, captures) {
  const sanitized = {};
  const raw = {};
  captures.forEach((c) => {
    sanitized[c.stepId] = c.sanitized;
    raw[c.stepId] = c.raw;
  });
  api.setWorkflowRunCaptureMapsForTest(sanitized, raw);
}

function fileNameForArtifact(key) {
  const map = {
    learning_content: "learning-content.json",
    knowledge_model: "knowledge-model.json",
    learning_outcomes: "learning-outcomes.json",
    episode_plans: "episode-plans.json",
    learning_activities: "learning_activities.json",
    activity_materials: "activity_materials.md",
    learning_sequence: "learning_sequence.json",
    page: "page.json"
  };
  return map[key] || `${key}.txt`;
}

async function runKnowledgeModel(apiKey, prompt, upstreamLc) {
  const kmSystem = [
    "You execute the Model Knowledge workflow step.",
    "Return exactly one fenced ```json block containing the knowledge_model object.",
    "No prose outside the fence."
  ].join(" ");
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const kmText = await callOpenAI(
      apiKey,
      kmSystem,
      (upstreamLc ? "\nUpstream learning_content:\n" + upstreamLc.slice(0, 8000) + "\n" : "") +
        buildKmHarnessOutputContract(2) +
        (attempt > 1 ? "\n\nRETRY: output ONLY the fenced JSON block." : "") +
        "\n\n---\n\n" +
        prompt,
      STEP_MAX_TOKENS.knowledge_model
    );
    try {
      return {
        text: kmText,
        parsed: parseKnowledgeModelCapture(kmText, (x) => x)
      };
    } catch (err) {
      const fenced = extractFencedJsonBlock(kmText);
      if (fenced) {
        try {
          const parsed = JSON.parse(fenced);
          return {
            text: JSON.stringify(normalizeKnowledgeModelShape(parsed), null, 2),
            parsed: normalizeKnowledgeModelShape(parsed)
          };
        } catch (_) {}
      }
      if (attempt === 3) throw err;
    }
  }
  return { text: "", parsed: null };
}

function learningActivityRows(page) {
  const sec = (page?.sections || []).find((s) => s.section_id === "learning_activities");
  if (!sec) return [];
  return Array.isArray(sec.content) ? sec.content : sec.content?.activities || [];
}

function writeVerificationSummary(runDir, manifest) {
  const lines = [
    "# Sprint 50 — MarxEduQSelfStudy verification summary",
    "",
    `**Run:** ${manifest.timestamp}`,
    `**Workflow:** ${manifest.workflowName}`,
    `**Git:** ${manifest.git.commit || "unknown"}${manifest.git.dirty ? " (dirty working tree)" : ""}`,
    "",
    "## Verification checks",
    "",
    "| Check | Result | Evidence |",
    "| --- | --- | --- |"
  ];
  const checks = manifest.verificationChecks || {};
  const order = [
    "learning_activities_generated",
    "activity_materials_generated",
    "page_json_generated",
    "page_html_generated",
    "activity_preamble_in_dla",
    "activity_preamble_in_page_json",
    "why_this_activity_in_html",
    "reasoning_orientation_in_dla",
    "reasoning_orientation_in_page_json",
    "how_to_approach_in_html",
    "study_before_do",
    "check_unified",
    "expected_output_in_check",
    "compass_progress_only"
  ];
  const labels = {
    learning_activities_generated: "learning_activities generated",
    activity_materials_generated: "activity_materials generated",
    page_json_generated: "page.json generated",
    page_html_generated: "page.html generated from page.json",
    activity_preamble_in_dla: "activity_preamble present in learning_activities",
    activity_preamble_in_page_json: "activity_preamble persisted into page.json",
    why_this_activity_in_html: "Why this activity rendered in HTML",
    reasoning_orientation_in_dla: "reasoning_orientation present in learning_activities",
    reasoning_orientation_in_page_json: "reasoning_orientation persisted into page.json",
    how_to_approach_in_html: "How to approach this rendered in HTML",
    study_before_do: "Study appears before Do",
    check_unified: "Check combines checklist and expected_output",
    expected_output_in_check: "Expected output appears inside Check",
    compass_progress_only: "Compass is progress-only"
  };
  order.forEach((key) => {
    const c = checks[key] || { result: "No", evidence: "not evaluated" };
    lines.push(`| ${labels[key]} | ${c.result} | ${c.evidence} |`);
  });
  if (manifest.failure) {
    lines.push("", "## Run failure", "", `- **Step:** ${manifest.failure.stepTitle || manifest.failure.stepIndex || "unknown"}`, `- **Error:** ${manifest.failure.message}`, `- **Suspected cause:** ${manifest.failure.suspectedCause || "see run.log"}`);
  }
  fs.writeFileSync(path.join(runDir, "verification-summary.md"), lines.join("\n") + "\n", "utf8");
}

function evaluateVerificationChecks(runDir) {
  const checks = {};
  const file = (name) => path.join(runDir, name);
  const exists = (name) => fs.existsSync(file(name));

  checks.learning_activities_generated = {
    result: exists("learning_activities.json") ? "Yes" : "No",
    evidence: exists("learning_activities.json") ? "learning_activities.json present" : "missing file"
  };
  checks.activity_materials_generated = {
    result: exists("activity_materials.md") ? "Yes" : "No",
    evidence: exists("activity_materials.md") ? "activity_materials.md present" : "missing file"
  };
  checks.page_json_generated = {
    result: exists("page.json") ? "Yes" : "No",
    evidence: exists("page.json") ? "page.json present" : "missing file"
  };
  checks.page_html_generated = {
    result: exists("page.html") ? "Yes" : "No",
    evidence: exists("page.html") ? "page.html present" : "missing file"
  };

  let dla = null;
  let page = null;
  try {
    if (exists("learning_activities.json")) {
      dla = JSON.parse(fs.readFileSync(file("learning_activities.json"), "utf8"));
    }
  } catch (e) {
    checks.activity_preamble_in_dla = { result: "No", evidence: `DLA parse error: ${e.message}` };
  }
  try {
    if (exists("page.json")) {
      page = JSON.parse(fs.readFileSync(file("page.json"), "utf8"));
    }
  } catch (e) {
    checks.activity_preamble_in_page_json = { result: "No", evidence: `page.json parse error: ${e.message}` };
  }

  const dlaActs = dla?.activities || dla?.learning_activities || [];
  const preambleDla = dlaActs.filter((a) => a.activity_preamble).length;
  checks.activity_preamble_in_dla = {
    result: preambleDla > 0 ? "Yes" : "No",
    evidence: `${preambleDla}/${dlaActs.length} activities with activity_preamble`
  };
  const pageActs = page ? learningActivityRows(page) : [];
  const preamblePage = pageActs.filter((a) => a.activity_preamble).length;
  checks.activity_preamble_in_page_json = {
    result: preamblePage > 0 ? "Yes" : preamblePage === 0 && preambleDla > 0 ? "No" : preamblePage > 0 ? "Yes" : "No",
    evidence: `${preamblePage}/${pageActs.length} page rows with activity_preamble`
  };
  const reasoningDla = dlaActs.filter((a) => a.reasoning_orientation).length;
  checks.reasoning_orientation_in_dla = {
    result: reasoningDla > 0 ? "Yes" : "No",
    evidence: `${reasoningDla}/${dlaActs.length} activities with reasoning_orientation`
  };
  const reasoningPage = pageActs.filter((a) => a.reasoning_orientation).length;
  checks.reasoning_orientation_in_page_json = {
    result: reasoningPage > 0 ? "Yes" : reasoningPage === 0 && reasoningDla > 0 ? "No" : reasoningPage > 0 ? "Yes" : "No",
    evidence: `${reasoningPage}/${pageActs.length} page rows with reasoning_orientation`
  };

  let html = "";
  if (exists("page.html")) html = fs.readFileSync(file("page.html"), "utf8");
  checks.why_this_activity_in_html = {
    result: html.includes("Why this activity") ? "Yes" : "No",
    evidence: html.includes("Why this activity") ? "util-instructional-heading text found" : "heading absent"
  };
  checks.how_to_approach_in_html = {
    result: html.includes("How to approach this") ? "Yes" : "No",
    evidence: html.includes("How to approach this") ? "util-instructional-heading text found" : "heading absent"
  };

  const studyIdx = html.indexOf("util-instructional-study");
  const doIdx = html.indexOf("util-instructional-do");
  checks.study_before_do = {
    result: studyIdx >= 0 && doIdx >= 0 && studyIdx < doIdx ? "Yes" : studyIdx < 0 || doIdx < 0 ? "Partial" : "No",
    evidence:
      studyIdx < 0 || doIdx < 0
        ? `study=${studyIdx >= 0}, do=${doIdx >= 0}`
        : `study index ${studyIdx} < do index ${doIdx}`
  };

  const checkSection = html.includes("util-instructional-check");
  const outputBlock = html.includes("util-output-block");
  checks.check_unified = {
    result: checkSection && !outputBlock ? "Yes" : checkSection && outputBlock ? "Partial" : "No",
    evidence: checkSection
      ? outputBlock
        ? "Check section present but separate util-output-block also present"
        : "util-instructional-check present, no util-output-block"
      : "no util-instructional-check section"
  };
  const checkPos = html.indexOf("util-instructional-check");
  const checkChunk = checkPos >= 0 ? html.slice(checkPos, checkPos + 4000) : "";
  checks.expected_output_in_check = {
    result: checkChunk && /expected output|Check your work/i.test(checkChunk) ? "Yes" : "Partial",
    evidence: checkChunk ? (checkChunk.length > 100 ? "content inside Check section" : "Check section empty") : "no Check section"
  };

  const compassSignals = (html.match(/util-journey-compass__signal-label/g) || []).length;
  const progressOnly = html.includes("util-activity-progress") && compassSignals === 0;
  checks.compass_progress_only = {
    result: progressOnly ? "Yes" : compassSignals > 0 ? "No" : html.includes("util-activity-progress") ? "Partial" : "No",
    evidence: `progress=${html.includes("util-activity-progress")}, signalLabels=${compassSignals}`
  };

  return checks;
}

function writeManifest(runDir, manifest) {
  fs.writeFileSync(path.join(runDir, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
}

async function main() {
  const args = parseArgs(process.argv);
  const command = `node tools/sprint-50-marx-verification-run.mjs${args.dryRun ? " --dry-run" : ""}`;
  const runDir = args.runDir;
  fs.mkdirSync(runDir, { recursive: true });

  const git = gitMeta();
  const api = loadApi();
  const loaded = loadWorkflowBundle(args.exportPath);
  const wf = setupWorkflow(api, loaded.wf, loaded.prompts);
  const { exportPath } = loaded;
  const steps = Array.isArray(wf.steps) ? wf.steps : [];
  if (!steps.length) throw new Error("Workflow has no steps");

  const baseManifest = {
    timestamp: new Date().toISOString(),
    command,
    workflowFile: path.relative(repoRoot, exportPath).replace(/\\/g, "/"),
    workflowName: wf.name,
    workflowId: wf.id,
    git,
    code: {
      appJs: path.relative(repoRoot, path.join(repoRoot, "app.js")).replace(/\\/g, "/"),
      runner: path.relative(repoRoot, path.join(repoRoot, "tools/sprint-50-marx-verification-run.mjs")).replace(/\\/g, "/")
    },
    provider: PROVIDER,
    apiEndpoint: API_ENDPOINT,
    model,
    outputDir: path.relative(repoRoot, runDir).replace(/\\/g, "/"),
    steps: steps.map((s, i) => ({
      index: i + 1,
      stepId: s.id,
      title: s.title,
      canonicalStepId: s.canonical_step_id || "",
      artifactKey: artifactKey(s),
      outputFile: fileNameForArtifact(artifactKey(s))
    })),
    outputFiles: {},
    status: "running"
  };
  writeManifest(runDir, baseManifest);

  console.error(`Workflow: ${wf.name} (${steps.length} steps)`);
  console.error(`Export: ${exportPath}`);
  console.error(`Output: ${runDir}`);
  console.error(`Git: ${git.commit}${git.dirty ? " (dirty)" : ""}`);

  if (args.dryRun) {
    steps.forEach((step, i) => {
      const prompt = api.buildWorkflowStepInstructions(step, i, makeStepLi(step));
      const key = artifactKey(step);
      const deterministic = isEpisodePlanStep(api, step);
      console.log(`${i + 1}. ${step.title} → ${key}${deterministic ? " (deterministic)" : ""} promptChars=${prompt.length}`);
    });
    baseManifest.status = "dry_run";
    writeManifest(runDir, baseManifest);
    console.log(JSON.stringify({ dryRun: true, runDir, stepCount: steps.length }, null, 2));
    return;
  }

  const { key: apiKey, source: apiKeySource } = readOpenAiKey();
  baseManifest.apiKeySource = apiKeySource;
  writeManifest(runDir, baseManifest);

  const captures = [];
  const artefacts = {};
  const stepLog = [];
  const logPath = path.join(runDir, "run.log");
  fs.writeFileSync(
    logPath,
    `Sprint 50 Marx verification run started ${new Date().toISOString()}\n`,
    "utf8"
  );
  const log = (msg) => {
    fs.appendFileSync(logPath, msg + "\n", "utf8");
    console.error(msg);
  };

  try {
    for (let i = 0; i < steps.length; i += 1) {
      const step = steps[i];
      const key = artifactKey(step);
      const prompt = api.buildWorkflowStepInstructions(step, i, makeStepLi(step));
      if (!prompt.trim()) throw new Error(`Empty prompt for step: ${step.title}`);

      const promptFile = `prompt-${String(i + 1).padStart(2, "0")}-${key}.txt`;
      fs.writeFileSync(path.join(runDir, promptFile), prompt, "utf8");

      let raw;
      let processing = "live_api";
      if (isEpisodePlanStep(api, step)) {
        processing = "deterministic_derive";
        raw = api.deriveDesignEpisodePlanCaptureJson(wf);
        if (!raw) throw new Error(`Episode plan derive failed at step: ${step.title}`);
        log(`[${i + 1}/${steps.length}] ${step.title} (deterministic)`);
      } else if (key === "knowledge_model") {
        processing = "live_api_km_retry";
        const lcCap = captures.find((c) => c.artifactKey === "learning_content");
        const km = await runKnowledgeModel(apiKey, prompt, lcCap ? lcCap.raw : "");
        raw = km.text;
        log(`[${i + 1}/${steps.length}] ${step.title} (KM)`);
      } else {
        const system =
          key === "activity_materials"
            ? "Return organised activity_materials markdown per the prompt. No JSON wrapper."
            : key === "page"
              ? "Return JSON only for composed learner page with artifact_type page."
              : "Return JSON only for the requested artefact. One fenced ```json block when applicable.";
        raw = await callOpenAI(apiKey, system, prompt, STEP_MAX_TOKENS[key] || STEP_MAX_TOKENS.default);
        log(`[${i + 1}/${steps.length}] ${step.title} (live API)`);
      }

      persistCaptures(api, captures);
      const processed = processCapture(api, wf, step, raw);
      captures.push({
        stepId: step.id,
        title: step.title,
        artifactKey: processed.artifactKey,
        raw: processed.raw,
        sanitized: processed.sanitized
      });
      persistCaptures(api, captures);

      const fname = fileNameForArtifact(processed.artifactKey);
      const outPath = path.join(runDir, fname);
      if (processed.artifactKey === "page") {
        try {
          fs.writeFileSync(outPath, JSON.stringify(JSON.parse(processed.raw), null, 2), "utf8");
        } catch {
          fs.writeFileSync(outPath, processed.raw, "utf8");
        }
      } else {
        fs.writeFileSync(outPath, processed.raw, "utf8");
      }
      artefacts[processed.artifactKey] = fname;
      stepLog.push({
        index: i + 1,
        stepId: step.id,
        title: step.title,
        artifactKey: processed.artifactKey,
        outputFile: fname,
        promptFile,
        processing,
        rawBytes: Buffer.byteLength(processed.raw, "utf8")
      });
      baseManifest.steps[i].processing = processing;
      baseManifest.steps[i].outputFile = fname;
      baseManifest.outputFiles[fname] = path.relative(repoRoot, outPath).replace(/\\/g, "/");
      writeManifest(runDir, { ...baseManifest, stepLog, artefacts, status: "in_progress" });
    }

    const pageFile = path.join(runDir, "page.json");
    if (fs.existsSync(pageFile)) {
      const page = JSON.parse(fs.readFileSync(pageFile, "utf8"));
      const render = api.buildUtilityStructuredHtmlForTest(page);
      if (render.error) {
        fs.writeFileSync(path.join(runDir, "page.html"), `<!-- render error: ${render.error} -->`, "utf8");
        stepLog.push({ index: steps.length + 1, title: "Render page.html", processing: "local_render", error: render.error });
      } else {
        fs.writeFileSync(path.join(runDir, "page.html"), render.html || "", "utf8");
        artefacts.page_html = "page.html";
        baseManifest.outputFiles["page.html"] = path.relative(repoRoot, path.join(runDir, "page.html")).replace(/\\/g, "/");
        stepLog.push({ index: steps.length + 1, title: "Render page.html", processing: "local_render", rawBytes: Buffer.byteLength(render.html || "", "utf8") });
      }
    }

    baseManifest.status = "completed";
    baseManifest.stepLog = stepLog;
    baseManifest.artefacts = artefacts;
    baseManifest.verificationChecks = evaluateVerificationChecks(runDir);
    writeManifest(runDir, baseManifest);
    writeVerificationSummary(runDir, baseManifest);
    console.log(JSON.stringify(baseManifest, null, 2));
  } catch (err) {
    const message = err?.message || String(err);
    log(`FAILED: ${message}`);
    baseManifest.status = "failed";
    baseManifest.failure = {
      stepIndex: stepLog.length + 1,
      stepTitle: steps[stepLog.length]?.title || "unknown",
      message,
      suspectedCause: message.includes("OpenAI") ? "API error or token limit" : "see run.log",
      partialOutputs: Object.keys(artefacts)
    };
    baseManifest.stepLog = stepLog;
    baseManifest.artefacts = artefacts;
    baseManifest.verificationChecks = evaluateVerificationChecks(runDir);
    writeManifest(runDir, baseManifest);
    writeVerificationSummary(runDir, baseManifest);
    throw err;
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
