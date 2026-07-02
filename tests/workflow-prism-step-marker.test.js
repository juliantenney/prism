const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: {
      add() {},
      remove() {},
      contains() {
        return false;
      },
      toggle() {
        return false;
      }
    },
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
    _: {
      debounce: (fn) => fn
    }
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
  assert.ok(api, "Expected __PRISM_TEST_API");
  assert.equal(typeof api.buildWorkflowStepInstructions, "function");
  assert.equal(typeof api.sanitizePrismRunCapturedOutput, "function");
  return { api };
}

test("buildWorkflowStepInstructions: STEP N OUTPUT pattern when outputName is set", () => {
  const { api } = loadPrismTestApi();
  const step = {
    id: "s1",
    title: "Only notes",
    roleLabel: "",
    outputName: "normalized_content",
    inputKind: "text",
    notes: "Designer note for this step.",
    override_prompt_body: "",
    prompt_source_type: "none",
    prompt_source: "none",
    promptId: "",
    inputBindings: []
  };
  const instr = api.buildWorkflowStepInstructions(step, 0, null);
  assert.match(instr, /Finish the artefact in your main answer; do not include the machine artefact name inside that body/i);
  assert.match(instr, /Authoritative completion override/i);
  assert.match(
    instr,
    /At the end of your answer, restate the final output on a separate line, prefixed with 'STEP N OUTPUT:'\./
  );
  assert.match(instr, /exit any markdown or fenced code output/i);
  assert.match(instr, /plain conversational text outside the artefact block/i);
  assert.match(instr, /runner status\/footer only, not part of the markdown artefact body/i);
  assert.match(instr, /Use the exact literal line below, verbatim/i);
  assert.match(instr, /STEP\s*1\s*OUTPUT:\s*normalized_content/);
  assert.doesNotMatch(instr, /For this step, that line is:/i);
  assert.doesNotMatch(instr, /Do not prefix the response with step numbers/i);
  assert.equal(/\[\[PRISM_COMPLETE\]\]/.test(instr), false);
  assert.equal(instr.includes("Name the final result of this step as:"), false);
});

test("buildWorkflowStepInstructions: strict JSON steps include Copilot fenced contract", () => {
  const { api } = loadPrismTestApi();
  const step = {
    id: "km1",
    title: "Model Knowledge",
    canonical_step_id: "step_model_knowledge",
    roleLabel: "",
    outputName: "knowledge_model",
    inputKind: "text",
    notes: "",
    override_prompt_body: "Core prompt body.",
    prompt_source_type: "local_override",
    prompt_source: "local_override",
    promptId: "",
    inputBindings: []
  };
  const instr = api.buildWorkflowStepInstructions(step, 1, null);
  assert.match(instr, /Copilot output contract: return one pretty-printed fenced JSON block/i);
  assert.match(instr, /STEP\s*2\s*OUTPUT:\s*knowledge_model/i);
  assert.doesNotMatch(instr, /At the end of your answer, restate the final output/i);
  assert.doesNotMatch(instr, /Return only the JSON\./i);
  assert.doesNotMatch(instr, /STEP N OUTPUT:/i);
});

test("Model Knowledge assembled prompt has no contradictory footer instructions", () => {
  const { api } = loadPrismTestApi();
  const step = {
    id: "km2",
    title: "Model Knowledge",
    canonical_step_id: "step_model_knowledge",
    roleLabel: "",
    outputName: "knowledge_model",
    inputKind: "text",
    notes: "",
    override_prompt_body: "Core prompt body.",
    prompt_source_type: "local_override",
    prompt_source: "local_override",
    promptId: "",
    inputBindings: []
  };
  const instr = api.buildWorkflowStepInstructions(step, 2, null);
  assert.match(instr, /fenced JSON block/i);
  assert.match(instr, /STEP\s*3\s*OUTPUT:\s*knowledge_model/i);
  assert.match(instr, /Authoritative footer override/i);
  assert.match(instr, /ignore that text and follow the exact literal footer line below/i);
  assert.match(instr, /Use the exact literal line below, verbatim/i);
  assert.doesNotMatch(instr, /STEP N OUTPUT/i);
  assert.doesNotMatch(instr, /Do NOT prefix or suffix workflow metadata/i);
  assert.doesNotMatch(instr, /Finish the artefact in your main answer/i);
  assert.doesNotMatch(instr, /At the end of your answer, restate/i);
  assert.doesNotMatch(instr, /No prose before or after the fence/i);
});

test("Learning Outcomes assembled prompt includes exact footer and no no-footer contradiction", () => {
  const { api } = loadPrismTestApi();
  const step = {
    id: "lo2",
    title: "Define Learning Outcomes",
    canonical_step_id: "step_define_learning_outcomes",
    roleLabel: "",
    outputName: "learning_outcomes",
    inputKind: "text",
    notes: "",
    override_prompt_body: "Core prompt body.",
    prompt_source_type: "local_override",
    prompt_source: "local_override",
    promptId: "",
    inputBindings: []
  };
  const instr = api.buildWorkflowStepInstructions(step, 3, null);
  assert.match(instr, /fenced JSON block/i);
  assert.match(instr, /STEP\s*4\s*OUTPUT:\s*learning_outcomes/i);
  assert.doesNotMatch(instr, /Do not prefix the response with step numbers/i);
  assert.doesNotMatch(instr, /Return only the single fenced block/i);
});

test("Normalize Content assembled prompt requires fenced markdown block plus STEP footer", () => {
  const { api } = loadPrismTestApi();
  const step = {
    id: "n1",
    title: "Normalize Content",
    canonical_step_id: "step_normalize_content",
    roleLabel: "",
    outputName: "normalized_content",
    inputKind: "text",
    notes: "",
    override_prompt_body: "Core prompt body.",
    prompt_source_type: "local_override",
    prompt_source: "local_override",
    promptId: "",
    inputBindings: []
  };
  const instr = api.buildWorkflowStepInstructions(step, 0, null);
  assert.match(instr, /exactly one fenced markdown block/i);
  assert.match(instr, /No prose before the fence/i);
  assert.match(instr, /STEP\s*1\s*OUTPUT:\s*normalized_content/i);
});

test("Generate Learning Content assembled prompt strips contradictory core footer clauses", () => {
  const { api } = loadPrismTestApi();
  const step = {
    id: "glc2",
    title: "Generate Learning Content",
    canonical_step_id: "step_generate_learning_content",
    roleLabel: "",
    outputName: "learning_content",
    inputKind: "text",
    notes: "",
    override_prompt_body: [
      "Output:",
      "- Return only the JSON.",
      "Output contract (strict — fenced JSON block only):",
      "- After the closing ``` fence, emit exactly one plain-text runner footer line: STEP N OUTPUT: learning_content",
      "- Return the fenced block first, then the single STEP N OUTPUT footer line."
    ].join("\n"),
    prompt_source_type: "local_override",
    prompt_source: "local_override",
    promptId: "",
    inputBindings: []
  };
  const instr = api.buildWorkflowStepInstructions(step, 1, null);
  assert.match(instr, /STEP\s*2\s*OUTPUT:\s*learning_content/i);
  assert.doesNotMatch(instr, /Return only the JSON\./i);
  assert.doesNotMatch(instr, /STEP N OUTPUT:\s*learning_content/i);
  assert.doesNotMatch(instr, /single STEP N OUTPUT footer line/i);
});

test("Generate Activity Materials assembled prompt includes no-refusal completion override", () => {
  const { api } = loadPrismTestApi();
  const step = {
    id: "gam1",
    title: "Generate Activity Materials",
    canonical_step_id: "step_generate_activity_materials",
    roleLabel: "",
    outputName: "activity_materials",
    inputKind: "text",
    notes: "",
    override_prompt_body: "Core prompt body.",
    prompt_source_type: "local_override",
    prompt_source: "local_override",
    promptId: "",
    inputBindings: []
  };
  const instr = api.buildWorkflowStepInstructions(step, 6, null);
  assert.match(instr, /GAM completion override/i);
  assert.match(instr, /do NOT refuse, defer, or claim response\/context\/token limits/i);
  assert.match(instr, /STEP\s*7\s*OUTPUT:\s*activity_materials/i);
});

test("buildWorkflowStepInstructions: strict JSON artefact steps include exact STEP footer without generic footer prose", () => {
  const { api } = loadPrismTestApi();
  [
    { title: "Generate Learning Content", canonical_step_id: "step_generate_learning_content", outputName: "learning_content" },
    { title: "Model Knowledge", canonical_step_id: "step_model_knowledge", outputName: "knowledge_model" },
    { title: "Define Learning Outcomes", canonical_step_id: "step_define_learning_outcomes", outputName: "learning_outcomes" },
    { title: "Construct Learning Sequence", canonical_step_id: "step_construct_learning_sequence", outputName: "learning_sequence" },
    { title: "Design Episode Plan", canonical_step_id: "step_design_episode_plan", outputName: "episode_plans" }
  ].forEach((step, idx) => {
    const instr = api.buildWorkflowStepInstructions(
      Object.assign(
        {
          id: "strict_" + idx,
          roleLabel: "",
          inputKind: "text",
          notes: "",
          override_prompt_body: "Core prompt body.",
          prompt_source_type: "local_override",
          prompt_source: "local_override",
          promptId: "",
          inputBindings: []
        },
        step
      ),
      idx,
      null
    );
    assert.match(instr, /fenced JSON block/i);
    assert.match(instr, /STEP\s*\d+\s*OUTPUT:/i);
    assert.doesNotMatch(instr, /Finish the artefact in your main answer/i);
    assert.doesNotMatch(instr, /At the end of your answer, restate/i);
    assert.doesNotMatch(instr, /No prose before or after the fence/i);
  });
});

test("all workflow steps with outputName include exact footer without contradictions", () => {
  const { api } = loadPrismTestApi();
  const steps = [
    { title: "Normalize Content", canonical_step_id: "step_normalize_content", outputName: "normalized_content" },
    { title: "Generate Learning Content", canonical_step_id: "step_generate_learning_content", outputName: "learning_content" },
    { title: "Model Knowledge", canonical_step_id: "step_model_knowledge", outputName: "knowledge_model" },
    { title: "Define Learning Outcomes", canonical_step_id: "step_define_learning_outcomes", outputName: "learning_outcomes" },
    { title: "Design Episode Plan", canonical_step_id: "step_design_episode_plan", outputName: "episode_plans" },
    { title: "Design Learning Activities", canonical_step_id: "step_design_learning_activities", outputName: "learning_activities" },
    { title: "Generate Activity Materials", canonical_step_id: "step_generate_activity_materials", outputName: "activity_materials" },
    { title: "Construct Learning Sequence", canonical_step_id: "step_construct_learning_sequence", outputName: "learning_sequence" },
    { title: "Design Page", canonical_step_id: "step_design_page", outputName: "page" }
  ];

  steps.forEach((step, idx) => {
    const instr = api.buildWorkflowStepInstructions(
      Object.assign(
        {
          id: "all_" + idx,
          roleLabel: "",
          inputKind: "text",
          notes: "",
          override_prompt_body: "Core prompt body.",
          prompt_source_type: "local_override",
          prompt_source: "local_override",
          promptId: "",
          inputBindings: []
        },
        step
      ),
      idx,
      null
    );
    assert.match(
      instr,
      new RegExp("STEP\\s*" + (idx + 1) + "\\s*OUTPUT:\\s*" + step.outputName, "i")
    );
    assert.doesNotMatch(instr, /Do not prefix the response with step numbers/i);
    assert.doesNotMatch(instr, /No prose before or after the block/i);
    assert.doesNotMatch(instr, /before or after the fence/i);
    assert.doesNotMatch(instr, /STEP N OUTPUT:\s*<output_name>/i);
  });
});

test("Construct Learning Sequence pack prompt: no placeholder STEP N footer in notes or core", () => {
  const { api } = loadPrismTestApi();
  const md = fs.readFileSync(
    path.join(repoRoot, "domains", "learning-design", "domain-learning-design-step-patterns.md"),
    "utf8"
  );
  const idx = md.indexOf("## 10. Construct Learning Sequence");
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  const pack = JSON.parse(md.slice(fence + 7, close).trim());
  const step = {
    id: "ls",
    title: "Construct Learning Sequence",
    canonical_step_id: "step_construct_learning_sequence",
    outputName: "learning_sequence",
    roleLabel: "",
    inputKind: "text",
    notes: pack.defaultPromptNotes || "",
    override_prompt_body: pack.promptTemplate,
    prompt_source_type: "local_override",
    prompt_source: "local_override",
    promptId: "",
    inputBindings: []
  };
  const instr = api.buildWorkflowStepInstructions(step, 9, null);
  assert.match(instr, /STEP\s*10\s*OUTPUT:\s*learning_sequence/i);
  assert.doesNotMatch(instr, /emit STEP N OUTPUT:/i);
  assert.doesNotMatch(instr, /STEP N OUTPUT:/i);
  assert.doesNotMatch(instr, /Return only the single fenced block/i);
  assert.doesNotMatch(instr, /no STEP N OUTPUT lines/i);
});

test("compose assembly steps from pack: Design Page, Slide Deck, VLE omit contradictory footer clauses", () => {
  const { api } = loadPrismTestApi();
  const md = fs.readFileSync(
    path.join(repoRoot, "domains", "learning-design", "domain-learning-design-step-patterns.md"),
    "utf8"
  );
  const sections = [
    { heading: "## 13. Design Page", outputName: "page", canonical: "step_design_page" },
    { heading: "## 14. Generate Slide Deck", outputName: "slide_deck", canonical: "step_generate_slide_deck" },
    { heading: "## 15. Generate VLE Structure", outputName: "vle_structure", canonical: "step_generate_vle_structure" },
    {
      heading: "## 16. Generate Learning Object Set",
      outputName: "learning_object_set",
      canonical: "step_generate_learning_object_set"
    }
  ];
  sections.forEach((sec, idx) => {
    const start = md.indexOf(sec.heading);
    assert.ok(start >= 0, "missing section " + sec.heading);
    const fence = md.indexOf("```json", start);
    const close = md.indexOf("```", fence + 7);
    const pack = JSON.parse(md.slice(fence + 7, close).trim());
    const instr = api.buildWorkflowStepInstructions(
      {
        id: "compose_" + idx,
        title: sec.heading.replace(/^## \d+\.\s*/, ""),
        canonical_step_id: sec.canonical,
        outputName: sec.outputName,
        roleLabel: "",
        inputKind: "text",
        notes: pack.defaultPromptNotes || "",
        override_prompt_body: pack.promptTemplate,
        prompt_source_type: "local_override",
        prompt_source: "local_override",
        promptId: "",
        inputBindings: []
      },
      idx + 11,
      null
    );
    assert.match(instr, new RegExp("STEP\\s*" + (idx + 12) + "\\s*OUTPUT:\\s*" + sec.outputName, "i"));
    assert.doesNotMatch(instr, /emit STEP N OUTPUT:/i);
    assert.doesNotMatch(instr, /STEP N OUTPUT:\s*<output_name>/i);
    assert.doesNotMatch(instr, /no STEP N OUTPUT lines/i);
    assert.doesNotMatch(instr, /Return only the single fenced block/i);
  });
});

test("buildWorkflowStepInstructions: STEP number follows zero-based index", () => {
  const { api } = loadPrismTestApi();
  const step = {
    id: "s2",
    title: "Second",
    roleLabel: "",
    outputName: "out2",
    inputKind: "text",
    notes: "n",
    prompt_source_type: "none",
    prompt_source: "none",
    promptId: "",
    inputBindings: []
  };
  const instr = api.buildWorkflowStepInstructions(step, 2, null);
  assert.match(instr, /STEP\s*3\s*OUTPUT/i);
});

test("sanitizePrismRunCapturedOutput: strips trailing STEP N OUTPUT block", () => {
  const { api } = loadPrismTestApi();
  assert.equal(api.sanitizePrismRunCapturedOutput("Hello\nSTEP 1 OUTPUT: meta"), "Hello");
  assert.equal(api.sanitizePrismRunCapturedOutput("Body\n\nSTEP 2 OUTPUT:\nmore\nlines"), "Body\n");
});

test("sanitizePrismRunCapturedOutput: content before STEP line preserved exactly", () => {
  const { api } = loadPrismTestApi();
  const before = "  line1\n\tline2";
  assert.equal(api.sanitizePrismRunCapturedOutput(`${before}\nSTEP 1 OUTPUT: x`), before);
});

test("sanitizePrismRunCapturedOutput: strips trailing orphan markdown fence line", () => {
  const { api } = loadPrismTestApi();
  assert.equal(api.sanitizePrismRunCapturedOutput("body\n```"), "body");
  assert.equal(api.sanitizePrismRunCapturedOutput("body\n```markdown"), "body");
  assert.equal(api.sanitizePrismRunCapturedOutput("```"), "");
});

test("sanitizePrismRunCapturedOutput: does not strip ``` line mid-body", () => {
  const { api } = loadPrismTestApi();
  const s = "intro\n```\ncode\n```\ntrailer";
  assert.equal(api.sanitizePrismRunCapturedOutput(s), s);
});

test("sanitizePrismRunCapturedOutput: no STEP footer leaves string unchanged", () => {
  const { api } = loadPrismTestApi();
  const s = "Body\nSTEP 1 OUTPUT is a discussion phrase only when not at line start";
  assert.equal(api.sanitizePrismRunCapturedOutput(s), s);
});

test("buildWorkflowStepInstructions: upstream injection has no STEP OUTPUT footer", () => {
  const { api } = loadPrismTestApi();
  const wf = {
    id: "wf1",
    name: "Test WF",
    artefacts: "",
    tags: [],
    notes: "",
    selectedDomains: ["general"],
    workflowOutputSpec: { audience: "", goal: "", constraints: "" },
    steps: [
      {
        id: "s1",
        title: "Producer",
        roleLabel: "",
        outputName: "alpha",
        inputKind: "text",
        notes: "",
        prompt_source_type: "none",
        prompt_source: "none",
        promptId: "",
        inputBindings: [],
        canonical_step_id: "",
        domain_version: ""
      },
      {
        id: "s2",
        title: "Consumer",
        roleLabel: "",
        outputName: "",
        inputKind: "text",
        notes: "Use upstream artefact.",
        prompt_source_type: "none",
        prompt_source: "none",
        promptId: "",
        inputBindings: [{ kind: "internal", sourceStepId: "s1", artifactName: "alpha" }],
        canonical_step_id: "",
        domain_version: ""
      }
    ]
  };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest("wf1");
  api.setWorkflowRunCaptureMapsForTest(
    { s1: "ART_OK" },
    { s1: "ART_OK\nSTEP 1 OUTPUT: should not appear downstream\n" }
  );

  const consumer = wf.steps[1];
  const instr = api.buildWorkflowStepInstructions(consumer, 1, null);
  assert.match(instr, /Upstream artefact "alpha"/);
  assert.match(instr, /ART_OK/);

  const idxUp = instr.indexOf('Upstream artefact "alpha"');
  const idxTail = instr.indexOf("How to use inputs for this step (from the workflow designer):");
  assert.ok(idxUp >= 0 && idxTail > idxUp);
  const mid = instr.slice(idxUp, idxTail);
  assert.equal(/STEP\s*\d+\s*OUTPUT/i.test(mid), false);
});

test("gatherWorkflowDetailFormData step capture still excludes runStepOutput", () => {
  const src = fs.readFileSync(appJsPath, "utf8");
  const fnStart = src.indexOf("function gatherWorkflowDetailFormData()");
  assert.ok(fnStart >= 0);
  const fnSlice = src.slice(fnStart, fnStart + 20000);
  const pushIdx = fnSlice.indexOf("steps.push({");
  assert.ok(pushIdx >= 0);
  const pushBlock = fnSlice.slice(pushIdx, pushIdx + 1200);
  assert.equal(pushBlock.includes("runStepOutput"), false);
});
