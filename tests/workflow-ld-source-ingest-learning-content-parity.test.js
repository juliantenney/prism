/**
 * Sprint 42-10 — source ingest converges on learning_content before Model Knowledge.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);

function extractLdWorkflowPolicy(md) {
  const idx = md.indexOf("### Workflow Policy");
  assert.ok(idx !== -1);
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).workflowPolicy;
}

function extractGlcPromptFactory(md) {
  const idx = md.indexOf("## 2. Generate Learning Content");
  assert.ok(idx !== -1);
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim());
}

function extractNormalizePromptFactory(md) {
  const idx = md.indexOf("## 1. Normalize Content");
  assert.ok(idx !== -1);
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim());
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return api;
}

function stepTitles(out) {
  return (out.steps || []).map((s) => String(s.title || "").trim());
}

function indexOfTitle(titles, name) {
  return titles.findIndex((t) => t.toLowerCase() === String(name).toLowerCase());
}

function applyLdHeuristics(api, workflowPolicy, parsed, hints) {
  return api.applyWorkflowDesignHeuristics(JSON.parse(JSON.stringify(parsed)), {
    selectedDomains: ["general", "learning-design"],
    workflowPolicy,
    stepPatternCatalog: [],
    resolvedBriefFactors: hints.resolvedBriefFactors || {},
    explicitBriefFactors: hints.explicitBriefFactors || {},
    goal: hints.goal || "",
    inputs: hints.inputs || "",
    desiredOutputs: hints.desiredOutputs || "",
    startingArtefact: hints.startingArtefact || ""
  });
}

const api = loadPrismTestApi();
const ldMd = fs.readFileSync(ldPatternsPath, "utf8");
const ldWorkflowPolicy = extractLdWorkflowPolicy(ldMd);
const glcPf = extractGlcPromptFactory(ldMd);
const normalizePf = extractNormalizePromptFactory(ldMd);

const SOURCE_INGEST_CHAIN = {
  steps: [
    { title: "Normalize Content", role: "" },
    { title: "Model Knowledge", role: "" },
    { title: "Define Learning Outcomes", role: "" },
    { title: "Design Page", role: "" }
  ]
};

test("source ingest workflow includes Normalize then Generate Learning Content", () => {
  const out = applyLdHeuristics(api, ldWorkflowPolicy, SOURCE_INGEST_CHAIN, {
    goal: "Design a learner page from the uploaded lecture transcript.",
    inputs: "Uploaded lecture transcript PDF.",
    startingArtefact: "provided_source_content",
    resolvedBriefFactors: {
      input_strategy: "provided_source_content",
      session_materials: ["page"],
      delivery_context: "self_directed"
    }
  });
  const titles = stepTitles(out);
  assert.ok(indexOfTitle(titles, "Normalize Content") !== -1);
  assert.ok(indexOfTitle(titles, "Generate Learning Content") !== -1);
});

test("Generate Learning Content is not stripped after Normalize on ingest", () => {
  const out = applyLdHeuristics(api, ldWorkflowPolicy, SOURCE_INGEST_CHAIN, {
    goal: "Extract and model learning outcomes from the provided facilitator notes document.",
    inputs: "Provided facilitator notes and uploaded PDF.",
    startingArtefact: "provided_source_content",
    resolvedBriefFactors: {
      input_strategy: "provided_source_content",
      design_scope: "session"
    }
  });
  const titles = stepTitles(out);
  const normIdx = indexOfTitle(titles, "Normalize Content");
  const glcIdx = indexOfTitle(titles, "Generate Learning Content");
  const mkIdx = indexOfTitle(titles, "Model Knowledge");
  assert.ok(normIdx !== -1 && glcIdx !== -1 && mkIdx !== -1);
  assert.ok(normIdx < glcIdx, titles.join(" -> "));
  assert.ok(glcIdx < mkIdx, titles.join(" -> "));
});

test("topic route unchanged: GLC without Normalize", () => {
  const out = applyLdHeuristics(api, ldWorkflowPolicy, {
    steps: [
      { title: "Model Knowledge", role: "" },
      { title: "Define Learning Outcomes", role: "" },
      { title: "Design Page", role: "" }
    ]
  }, {
    goal: "Design a self-study page on inflation from topic only.",
    inputs: "No uploaded files.",
    startingArtefact: "generate_from_topic",
    resolvedBriefFactors: {
      topic: "inflation",
      input_strategy: "generate_from_topic",
      session_materials: ["page"],
      delivery_context: "self_directed"
    }
  });
  const titles = stepTitles(out);
  const glcIdx = indexOfTitle(titles, "Generate Learning Content");
  const mkIdx = indexOfTitle(titles, "Model Knowledge");
  assert.equal(indexOfTitle(titles, "Normalize Content"), -1);
  assert.ok(glcIdx !== -1 && mkIdx !== -1);
  assert.ok(glcIdx < mkIdx);
});

test("workflow policy: GLC requires normalized_content or topic; MK accepts learning_content", () => {
  const glcDep = ldWorkflowPolicy.dependencies["Generate Learning Content"];
  const mkDep = ldWorkflowPolicy.dependencies["Model Knowledge"];
  assert.ok(glcDep.requiresAnyOf.includes("normalized_content"));
  assert.ok(glcDep.requiresAnyOf.includes("topic"));
  assert.ok(mkDep.requiresAnyOf.includes("learning_content"));
  assert.ok(mkDep.requiresAnyOf.includes("normalized_content"));
  const precedence = ldWorkflowPolicy.precedenceRules || [];
  assert.ok(
    precedence.some(
      (pair) =>
        pair[0] === "Normalize Content" && pair[1] === "Generate Learning Content"
    )
  );
});

test("Normalize output remains normalized_content fidelity contract", () => {
  assert.equal(normalizePf.preferredOutputFormat, "structured_markdown");
  assert.match(normalizePf.promptTemplate, /do not introduce new ideas/i);
  assert.match(normalizePf.promptTemplate, /normalized_content/i);
  assert.doesNotMatch(normalizePf.promptTemplate, /learning_content/i);
});

test("GLC prompt tightens canonical learning_content JSON when source is normalized_content", () => {
  const tpl = glcPf.promptTemplate;
  assert.match(tpl, /normalized_content/i);
  assert.match(tpl, /governing question|central inquiry/i);
  assert.match(tpl, /intellectual progression/i);
  assert.match(tpl, /do not invent ideas unsupported/i);
  assert.match(tpl, /title, sections, key_concepts, examples/i);
  assert.match(tpl, /examples: array of objects, each with title \(string\) and description \(string\)/i);
  assert.deepEqual(glcPf.defaultOutputStructure.keys, [
    "title",
    "sections",
    "key_concepts",
    "examples"
  ]);
});

test("Model Knowledge prompt prefers learning_content when both are bound", () => {
  const mkIdx = ldMd.indexOf("## 3. Model Knowledge");
  const fence = ldMd.indexOf("```json", mkIdx);
  const close = ldMd.indexOf("```", fence + 7);
  const mkPf = JSON.parse(ldMd.slice(fence + 7, close).trim());
  assert.match(mkPf.promptTemplate, /When learning_content is provided, treat it as the primary structured source/i);
});
