/**
 * Learning Design workflow orchestration — Generate Learning Content inclusion and ordering.
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
  assert.ok(idx !== -1, "LD pack should contain Workflow Policy section");
  const fence = md.indexOf("```json", idx);
  assert.ok(fence !== -1);
  const close = md.indexOf("```", fence + 7);
  assert.ok(close !== -1);
  const parsed = JSON.parse(md.slice(fence + 7, close).trim());
  return parsed.workflowPolicy;
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise
  };
  const documentStub = {
    readyState: "loading",
    addEventListener: () => {}
  };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
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
const ldWorkflowPolicy = extractLdWorkflowPolicy(fs.readFileSync(ldPatternsPath, "utf8"));

const WORKSHOP_MODEL_CHAIN = {
  steps: [
    { title: "Model Knowledge", role: "" },
    { title: "Generate Learning Content", role: "" },
    { title: "Define Learning Outcomes", role: "" },
    { title: "Design Learning Activities", role: "" },
    { title: "Generate Activity Materials", role: "" },
    { title: "Construct Learning Sequence", role: "" },
    { title: "Design Page", role: "" }
  ]
};

test("LD workshop heuristics: Generate Learning Content before Model Knowledge", () => {
  const out = applyLdHeuristics(api, ldWorkflowPolicy, WORKSHOP_MODEL_CHAIN, {
    goal:
      "Design a 60-minute workshop on inflation for undergraduate students with activities and formative assessment questions.",
    inputs:
      "Include group discussion, a short case study, and facilitator pacing notes for a single session.",
    desiredOutputs: "learner-facing page",
    resolvedBriefFactors: {
      topic: "inflation",
      design_scope: "session",
      session_materials: ["page"],
      input_strategy: "generate_from_topic",
      delivery_pattern: "face_to_face"
    }
  });
  const titles = stepTitles(out);
  const glcIdx = indexOfTitle(titles, "Generate Learning Content");
  const mkIdx = indexOfTitle(titles, "Model Knowledge");
  assert.ok(glcIdx !== -1, "workshop workflow should include Generate Learning Content");
  assert.ok(mkIdx !== -1, "workshop workflow should include Model Knowledge");
  assert.ok(glcIdx < mkIdx, "Generate Learning Content should precede Model Knowledge");
  assert.equal(
    titles.filter((t) => t.toLowerCase() === "generate learning content").length,
    1,
    "only one Generate Learning Content step"
  );
  const gamIdx = indexOfTitle(titles, "Generate Activity Materials");
  const dpIdx = indexOfTitle(titles, "Design Page");
  assert.ok(glcIdx < gamIdx, "instructional content should precede activity materials");
  assert.ok(gamIdx < dpIdx, "activity materials should precede Design Page");
  assert.equal(
    titles.some((t) => t.toLowerCase() === "normalize content"),
    false,
    "generate_from_topic workshop should not include Normalize Content"
  );
});

test("LD self-study page heuristics: includes Generate Learning Content in coherent order", () => {
  const out = applyLdHeuristics(api, ldWorkflowPolicy, {
    steps: [
      { title: "Model Knowledge", role: "" },
      { title: "Define Learning Outcomes", role: "" },
      { title: "Design Learning Activities", role: "" },
      { title: "Design Page", role: "" }
    ]
  }, {
    goal: "Design self-study module reading with explanatory sections and practice tasks for online learners.",
    inputs: "Topic-led module; no uploaded source documents.",
    desiredOutputs: "online module page",
    resolvedBriefFactors: {
      topic: "research methods",
      design_scope: "module",
      delivery_context: "self_directed",
      session_materials: ["page"],
      input_strategy: "generate_from_topic"
    }
  });
  const titles = stepTitles(out);
  const glcIdx = indexOfTitle(titles, "Generate Learning Content");
  const mkIdx = indexOfTitle(titles, "Model Knowledge");
  const dpIdx = indexOfTitle(titles, "Design Page");
  assert.ok(glcIdx !== -1, "self-study workflow should include Generate Learning Content");
  assert.ok(mkIdx === -1 || glcIdx < mkIdx, "GLC should precede Model Knowledge when both present");
  assert.ok(glcIdx < dpIdx, "GLC should precede Design Page");
  assert.equal(
    titles.some((t) => t.toLowerCase() === "normalize content"),
    false,
    "topic-only self-study wording should not trigger Normalize Content"
  );
  const dloIdx = indexOfTitle(titles, "Define Learning Outcomes");
  assert.ok(dloIdx === -1 || mkIdx === -1 || mkIdx < dloIdx, "Model Knowledge should precede Define Learning Outcomes");
  assert.equal(
    titles.some((t) => t.toLowerCase() === "generate vle structure"),
    false,
    "self-directed page/session flow should not include Generate VLE Structure"
  );
});

test("LD provided-source ingest: Normalize then Generate Learning Content before Model Knowledge", () => {
  const out = applyLdHeuristics(api, ldWorkflowPolicy, {
    steps: [
      { title: "Normalize Content", role: "" },
      { title: "Model Knowledge", role: "" },
      { title: "Define Learning Outcomes", role: "" },
      { title: "Design Page", role: "" }
    ]
  }, {
    goal: "Design a face-to-face workshop from the provided negotiation case study PDF.",
    inputs: "Provided: facilitator notes and case study PDF.",
    startingArtefact: "provided_source_content",
    resolvedBriefFactors: {
      design_scope: "session",
      input_strategy: "provided_source_content",
      session_materials: ["page"]
    }
  });
  const titles = stepTitles(out);
  const normIdx = indexOfTitle(titles, "Normalize Content");
  const glcIdx = indexOfTitle(titles, "Generate Learning Content");
  const mkIdx = indexOfTitle(titles, "Model Knowledge");
  assert.ok(
    titles.some((t) => t.toLowerCase() === "normalize content"),
    "provided-source ingest should include Normalize Content"
  );
  assert.ok(glcIdx !== -1, "ingest workflows should include Generate Learning Content");
  assert.ok(normIdx !== -1 && glcIdx !== -1 && mkIdx !== -1, "expected Normalize, GLC, and Model Knowledge");
  assert.ok(normIdx < glcIdx, "Normalize Content should precede Generate Learning Content");
  assert.ok(glcIdx < mkIdx, "Generate Learning Content should precede Model Knowledge");
});

test("LD lean assessment pack: excludes Generate Learning Content", () => {
  const out = applyLdHeuristics(api, ldWorkflowPolicy, {
    steps: [
      { title: "Generate Assessment Items", role: "" },
      { title: "Design Page", role: "" }
    ]
  }, {
    goal: "Create a formative assessment pack with 10 MCQs and a printable quiz for tutors.",
    inputs: "",
    resolvedBriefFactors: {
      design_scope: "single_activity",
      input_strategy: "generate_from_topic"
    }
  });
  const titles = stepTitles(out);
  assert.equal(
    titles.some((t) => t.toLowerCase() === "generate learning content"),
    false,
    "lean assessment-pack workflows should not include Generate Learning Content"
  );
  assert.equal(
    titles.some((t) => t.toLowerCase() === "normalize content"),
    false,
    "topic-only assessment-pack workflows should not include Normalize Content"
  );
});

test("LD generate_from_topic with negated source wording excludes Normalize Content", () => {
  const out = applyLdHeuristics(api, ldWorkflowPolicy, {
    steps: [
      { title: "Model Knowledge", role: "" },
      { title: "Define Learning Outcomes", role: "" },
      { title: "Design Learning Activities", role: "" }
    ]
  }, {
    goal: "Design a workshop from topic only with no uploaded documents.",
    inputs: "No uploaded files or source transcripts; generate from topic.",
    resolvedBriefFactors: {
      topic: "inflation",
      design_scope: "session",
      input_strategy: "generate_from_topic"
    },
    startingArtefact: "generate_from_topic"
  });
  const titles = stepTitles(out);
  const glcIdx = indexOfTitle(titles, "Generate Learning Content");
  const mkIdx = indexOfTitle(titles, "Model Knowledge");
  const dloIdx = indexOfTitle(titles, "Define Learning Outcomes");
  assert.equal(
    titles.some((t) => t.toLowerCase() === "normalize content"),
    false,
    "negated source wording must not trigger Normalize Content"
  );
  assert.ok(glcIdx !== -1, "topic-only flow should include Generate Learning Content");
  assert.ok(mkIdx !== -1, "topic-only flow should include Model Knowledge");
  assert.ok(dloIdx !== -1, "topic-only flow should include Define Learning Outcomes");
  assert.ok(glcIdx < mkIdx, "Generate Learning Content should precede Model Knowledge");
  assert.ok(mkIdx < dloIdx, "Model Knowledge should precede Define Learning Outcomes");
});

test("LD VLE environment alone does not trigger Generate VLE Structure", () => {
  const out = applyLdHeuristics(api, ldWorkflowPolicy, {
    steps: [
      { title: "Generate Learning Content", role: "" },
      { title: "Model Knowledge", role: "" },
      { title: "Define Learning Outcomes", role: "" },
      { title: "Design Learning Activities", role: "" },
      { title: "Generate Activity Materials", role: "" },
      { title: "Construct Learning Sequence", role: "" },
      { title: "Generate VLE Structure", role: "" },
      { title: "Design Page", role: "" }
    ]
  }, {
    goal: "Create a self-directed learner-facing page for a VLE.",
    inputs: "Topic-led resource only.",
    desiredOutputs: "Learner-facing page",
    resolvedBriefFactors: {
      topic: "photosynthesis",
      design_scope: "session",
      delivery_context: "self_directed",
      delivery_mode: "async",
      delivery_pattern: "mostly_online",
      learning_environments: ["vle"],
      session_materials: ["page"],
      input_strategy: "generate_from_topic"
    },
    startingArtefact: "generate_from_topic"
  });
  const titles = stepTitles(out);
  assert.equal(indexOfTitle(titles, "Generate VLE Structure"), -1);
  assert.ok(indexOfTitle(titles, "Design Page") !== -1, "Design Page should remain included");
});

test("LD explicit Moodle course shell request keeps Generate VLE Structure", () => {
  const out = applyLdHeuristics(api, ldWorkflowPolicy, {
    steps: [
      { title: "Generate Learning Content", role: "" },
      { title: "Model Knowledge", role: "" },
      { title: "Define Learning Outcomes", role: "" },
      { title: "Design Learning Activities", role: "" },
      { title: "Generate Activity Materials", role: "" },
      { title: "Construct Learning Sequence", role: "" },
      { title: "Design Page", role: "" }
    ]
  }, {
    goal: "Build a Moodle course shell with weekly blocks for a module.",
    inputs: "Generate from topic and include course navigation structure.",
    desiredOutputs: "VLE structure and learner page",
    resolvedBriefFactors: {
      topic: "cell biology",
      design_scope: "module",
      learning_environments: ["vle"],
      session_materials: ["page"],
      input_strategy: "generate_from_topic"
    },
    startingArtefact: "generate_from_topic"
  });
  const titles = stepTitles(out);
  assert.ok(indexOfTitle(titles, "Generate VLE Structure") !== -1);
  const clsIdx = indexOfTitle(titles, "Construct Learning Sequence");
  const dpIdx = indexOfTitle(titles, "Design Page");
  assert.ok(clsIdx !== -1 && dpIdx !== -1 && clsIdx < dpIdx, "Construct Learning Sequence should precede Design Page");
});

test("LD explicit session_materials vle_structure keeps Generate VLE Structure", () => {
  const out = applyLdHeuristics(api, ldWorkflowPolicy, {
    steps: [
      { title: "Generate Learning Content", role: "" },
      { title: "Model Knowledge", role: "" },
      { title: "Define Learning Outcomes", role: "" },
      { title: "Design Learning Activities", role: "" },
      { title: "Generate Activity Materials", role: "" },
      { title: "Construct Learning Sequence", role: "" },
      { title: "Design Page", role: "" }
    ]
  }, {
    goal: "Create structured outputs for VLE deployment.",
    inputs: "",
    desiredOutputs: "vle structure",
    explicitBriefFactors: {
      session_materials: ["vle_structure"]
    },
    resolvedBriefFactors: {
      topic: "immunology",
      design_scope: "module",
      session_materials: ["vle_structure"],
      input_strategy: "generate_from_topic"
    }
  });
  const titles = stepTitles(out);
  assert.ok(indexOfTitle(titles, "Generate VLE Structure") !== -1);
  assert.equal(indexOfTitle(titles, "Design Page"), -1, "explicit delivery override should not require Design Page");
});
