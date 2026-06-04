const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const stepPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);

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
    getAttribute() {
      return null;
    },
    addEventListener() {},
    removeEventListener() {},
    focus() {},
    click() {}
  };
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener() {},
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
    addEventListener() {},
    removeEventListener() {},
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
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return { api };
}

function assertLdMathRenderContractText(text) {
  const body = String(text || "");
  assert.match(body, /LD-MATH-RENDER \(auto-applied\)/i);
  assert.match(body, /LD-MATH-RENDER \| Layer: L7/i);
  assert.match(body, /Inline maths: use \\\(\.\.\.\\\)/);
  assert.match(body, /Display\/block equations: use \\\[\.\.\.\\\]/);
  assert.match(body, /Do NOT use \$?\.\.\.\$ or \$\$?\.\.\.\$\$/);
  assert.match(body, /activities, materials, assessment stems/i);
  assert.match(body, /escape math-delimiter backslashes/i);
  assert.equal(body.includes("\\\\(...\\\\)"), true);
  assert.equal(body.includes("\\\\[...\\\\]"), true);
  assert.match(body, /in raw JSON text/i);
  assert.match(body, /Prefer supported TeX/i);
  assert.match(body, /Do NOT wrap equations in code spans/i);
  assert.match(body, /Do NOT HTML-escape math delimiters/i);
  assert.match(body, /presentational notation only/i);
  assert.match(body, /LD-TABLE-FIDELITY/i);
}

function stepContext(canonicalStepId, title) {
  return {
    workflowGoal: "Teach algebra basics",
    desiredOutputs: "page",
    stepCanonicalTitle: title,
    stepCanonicalStepId: canonicalStepId,
    stepNotes: ""
  };
}

test("buildLdMathRenderPromptBlock: includes supported and prohibited rules", () => {
  const { api } = loadPrismTestApi();
  assertLdMathRenderContractText(api.buildLdMathRenderPromptBlock());
});

test("buildMathSafeOutputContractPromptBlock: alias returns canonical LD-MATH-RENDER block", () => {
  const { api } = loadPrismTestApi();
  assertLdMathRenderContractText(api.buildMathSafeOutputContractPromptBlock());
});

test("applyMathSafeOutputContractToDraft: appends once for DLA, GAM, Design Page, and assessment producer steps", () => {
  const { api } = loadPrismTestApi();
  const base = "Base prompt body.\n";
  const dla = api.applyMathSafeOutputContractToDraft(
    base,
    stepContext("step_design_learning_activities", "Design Learning Activities")
  );
  const gam = api.applyMathSafeOutputContractToDraft(
    base,
    stepContext("step_generate_activity_materials", "Generate Activity Materials")
  );
  const page = api.applyMathSafeOutputContractToDraft(
    base,
    stepContext("step_design_page", "Design Page")
  );
  const assessmentItems = api.applyMathSafeOutputContractToDraft(
    base,
    stepContext("step_generate_assessment_items", "Generate Assessment Items")
  );
  const feedback = api.applyMathSafeOutputContractToDraft(
    base,
    stepContext("step_design_feedback", "Design Feedback")
  );
  const rubric = api.applyMathSafeOutputContractToDraft(
    base,
    stepContext("step_design_marking_rubric", "Design Marking Rubric")
  );
  assertLdMathRenderContractText(dla);
  assertLdMathRenderContractText(gam);
  assertLdMathRenderContractText(page);
  assertLdMathRenderContractText(assessmentItems);
  assertLdMathRenderContractText(feedback);
  assertLdMathRenderContractText(rubric);
  const twice = api.applyMathSafeOutputContractToDraft(
    dla,
    stepContext("step_design_learning_activities", "Design Learning Activities")
  );
  assert.equal(
    (twice.match(/LD-MATH-RENDER \(auto-applied\)|Math notation output contract \(auto-applied\)/gi) || [])
      .length,
    1
  );
});

test("applyMathSafeOutputContractToDraft: does not append for unrelated steps", () => {
  const { api } = loadPrismTestApi();
  const base = "Construct learning sequence.\n";
  const out = api.applyMathSafeOutputContractToDraft(
    base,
    stepContext("step_construct_learning_sequence", "Construct Learning Sequence")
  );
  assert.equal(out.trim(), base.trim());
  assert.doesNotMatch(out, /LD-MATH-RENDER \(auto-applied\)/i);
});

test("domain step patterns: shared math notation contract section present", () => {
  const md = fs.readFileSync(stepPatternsPath, "utf8");
  assert.match(md, /### Math notation output contract/);
  assert.match(md, /Supported delimiters \(renderer-compatible\)/);
  assert.match(md, /Inline maths:/);
  assert.match(md, /Display\/block equations:/);
  assert.match(md, /\$\.\.\.\$/);
  assert.match(md, /\$\$\.\.\.\$\$/);
});

test("domain step patterns: DLA/GAM/Design Page prompts reference math-safe delimiters", () => {
  const md = fs.readFileSync(stepPatternsPath, "utf8");
  const dlaSection = md.match(
    /## 5\. Design Learning Activities[\s\S]*?## 6\. Generate Activity Materials/
  );
  const gamSection = md.match(
    /## 6\. Generate Activity Materials[\s\S]*?## 7\. Design Assessment/
  );
  const pageSection = md.match(/## 13\. Design Page[\s\S]*?## 14\. Generate Slide Deck/);
  assert.ok(dlaSection, "expected DLA section");
  assert.ok(gamSection, "expected GAM section");
  assert.ok(pageSection, "expected Design Page section");
  for (const section of [dlaSection[0], gamSection[0], pageSection[0]]) {
    assert.match(section, /renderer-supported TeX delimiters/i);
    assert.match(section, /Math notation output contract/i);
    assert.match(section, /\$\.\.\.\$/);
    assert.match(section, /\$\$\.\.\.\$\$/);
    assert.match(section, /code spans\/fences for equations/i);
  }
});

test("domain step patterns: assessment producer prompts reference math-safe delimiters", () => {
  const md = fs.readFileSync(stepPatternsPath, "utf8");
  const feedbackSection = md.match(/## 8\. Design Feedback[\s\S]*?## 9\. Generate Assessment Items/);
  const itemsSection = md.match(/## 9\. Generate Assessment Items[\s\S]*?## 10\. Construct Learning Sequence/);
  const rubricSection = md.match(/## 20\. Design Marking Rubric[\s\S]*?# Usage Guidelines/);
  assert.ok(feedbackSection, "expected Design Feedback section");
  assert.ok(itemsSection, "expected Generate Assessment Items section");
  assert.ok(rubricSection, "expected Design Marking Rubric section");
  for (const section of [feedbackSection[0], itemsSection[0], rubricSection[0]]) {
    assert.match(section, /\\\\\(\.\.\.\\\\\)/);
    assert.match(section, /\\\\\[\.\.\.\\\\\]/);
    assert.match(section, /\$\.\.\.\$/);
    assert.match(section, /\$\$\.\.\.\$\$/);
    assert.match(section, /code wrappers|code spans\/fences/i);
    assert.match(section, /HTML-escaped delimiters/i);
    assert.match(section, /mathematical notation|maths/i);
  }
});

test("applyWorkflowStepRuntimePromptAugmentations: includes math contract for DLA step", () => {
  const { api } = loadPrismTestApi();
  const prompt = api.applyWorkflowStepRuntimePromptAugmentations(
    "Design executable learning activities.\n",
    {
      title: "Design Learning Activities",
      canonical_title: "Design Learning Activities",
      canonical_step_id: "step_design_learning_activities",
      outputName: "learning_activities",
      notes: ""
    },
    null,
    {}
  );
  assertLdMathRenderContractText(prompt);
});

test("applyWorkflowStepRuntimePromptAugmentations: includes math contract for assessment items step", () => {
  const { api } = loadPrismTestApi();
  const prompt = api.applyWorkflowStepRuntimePromptAugmentations(
    "Generate assessment items.\n",
    {
      title: "Generate Assessment Items",
      canonical_title: "Generate Assessment Items",
      canonical_step_id: "step_generate_assessment_items",
      outputName: "assessment_items",
      notes: ""
    },
    null,
    {}
  );
  assertLdMathRenderContractText(prompt);
});

test("applyWorkflowStepRuntimePromptAugmentations: GAM contract explicitly forbids dollar delimiters and covers materials outputs", () => {
  const { api } = loadPrismTestApi();
  const prompt = api.applyWorkflowStepRuntimePromptAugmentations(
    "Generate activity materials.\n",
    {
      title: "Generate Activity Materials",
      canonical_title: "Generate Activity Materials",
      canonical_step_id: "step_generate_activity_materials",
      outputName: "activity_materials",
      notes: ""
    },
    null,
    {}
  );
  assert.match(prompt, /Do NOT use \$\.\.\.\$ or \$\$\.\.\.\$\$/);
  assert.match(prompt, /activities, materials, assessment stems/i);
  assert.match(prompt, /LD-MATH-RENDER \(auto-applied\)/i);
  assert.match(prompt, /Prefer supported TeX/i);
  assert.match(prompt, /LD-TABLE-FIDELITY/i);
});

test("visible runner text strips internal math contract wording while hidden prompt augmentation keeps it", () => {
  const { api } = loadPrismTestApi();
  const leakedNotes = [
    "When mathematical notation is needed in learner-facing text, use only \\(...\\).",
    "Do NOT use $...$ or $$...$$.",
    "Do NOT HTML-escape math delimiters.",
    "Actual visible guidance sentence."
  ].join("\n");
  api.setWorkflowStepPatternCatalogForTest([
    {
      canonical_step_id: "step_generate_assessment_items",
      title: "Generate Assessment Items",
      promptFactory: { defaultPromptNotes: leakedNotes }
    }
  ]);
  const visible = api.getRunnerInstructionsForStepForTest({
    title: "Generate Assessment Items",
    canonical_step_id: "step_generate_assessment_items"
  });
  assert.ok(visible);
  assert.equal(typeof visible.what_this_step_does, "string");
  assert.doesNotMatch(visible.what_this_step_does, /When mathematical notation is needed/i);
  assert.doesNotMatch(visible.what_this_step_does, /never \$|Do NOT use \$\.\.\.\$|\$\$\.\.\.\$\$/i);
  assert.doesNotMatch(visible.what_this_step_does, /HTML-escaped delimiters/i);
  assert.match(visible.what_this_step_does, /Actual visible guidance sentence/);

  const hidden = api.applyWorkflowStepRuntimePromptAugmentations(
    "Generate assessment items.\n",
    {
      title: "Generate Assessment Items",
      canonical_title: "Generate Assessment Items",
      canonical_step_id: "step_generate_assessment_items",
      outputName: "assessment_items",
      notes: ""
    },
    null,
    {}
  );
  assert.match(hidden, /When mathematical notation is needed/i);
  assert.match(hidden, /Do NOT use \$\.\.\.\$ or \$\$\.\.\.\$\$/);
});

test("visible runner text no-leak guard applies across DLA/GAM/Design Page/Feedback/Rubric", () => {
  const { api } = loadPrismTestApi();
  const leakedNotes = [
    "When mathematical notation is needed in learner-facing text, use only \\(...\\).",
    "Never $...$ / $$...$$.",
    "Do NOT HTML-escape math delimiters."
  ].join("\n");
  const steps = [
    ["step_design_learning_activities", "Design Learning Activities"],
    ["step_generate_activity_materials", "Generate Activity Materials"],
    ["step_design_page", "Design Page"],
    ["step_design_feedback", "Design Feedback"],
    ["step_design_marking_rubric", "Design Marking Rubric"]
  ];
  api.setWorkflowStepPatternCatalogForTest(
    steps.map(([canonicalId, title]) => ({
      canonical_step_id: canonicalId,
      title: title,
      promptFactory: { defaultPromptNotes: leakedNotes }
    }))
  );
  steps.forEach(([canonicalId, title]) => {
    const visible = api.getRunnerInstructionsForStepForTest({
      title: title,
      canonical_step_id: canonicalId
    });
    assert.ok(visible);
    assert.doesNotMatch(visible.what_this_step_does, /When mathematical notation is needed/i);
    assert.doesNotMatch(visible.what_this_step_does, /never \$|\$\$\.\.\.\$\$/i);
    assert.doesNotMatch(visible.what_this_step_does, /HTML-escaped delimiters|HTML-escape/i);
  });
});
