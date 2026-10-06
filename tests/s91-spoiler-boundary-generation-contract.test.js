/**
 * Sprint 91 — Design Page spoiler_boundary generation contract (schema 38.4).
 *
 * Live failure: anti_spoiler true with prose-only
 *   spoiler_boundary: { must_not_reveal: "..." }
 * missing required boolean fields.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const s38 = require("../lib/sprint38-visual-affordances.js");
const dpPartial = require("../lib/ld-design-page-partial-contract.js");
const expo = require("../lib/expository-sibling-prompts.js");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const records = JSON.parse(
  fs.readFileSync(path.join(repoRoot, "tests/fixtures/sprint-38/affordance-records.json"), "utf8")
);

function liveFailureIncompleteSpoilerBoundary() {
  return {
    affordance_id: "va-A2-evidence-01",
    scope: "activity",
    activity_id: "A2",
    visual_decision: "generate",
    visual_slot: "materials-entry",
    tier: "valuable",
    purpose: "evidence_structure",
    preferred_representation: "evidence_t_chart",
    rationale:
      "Makes case-specific uncertainty structure inspectable before learners classify evidence and decide.",
    subject: "Evidence uncertainty structure",
    context:
      "Visual brief: show structural evidence categories without classifying S1-S6 or revealing a preferred decision.",
    evidence_anchors: ["A2.learner_task", "A2.materials.scenarios"],
    reasoning_supported: "Learners inspect evidence structure before classifying.",
    learner_stage: "pre_classification",
    anti_spoiler: true,
    spoiler_boundary: {
      must_not_reveal:
        "Do not classify S1-S6, rank the case-specific uncertainties, recommend evidence for the case, or identify a preferred decision."
    },
    representation_avoid: ["filled_worksheet", "summary_table", "assessment_answer_visual"],
    canonical_discipline_note: "Structural evidence cues only.",
    requires_exact_data_match: false,
    must_show: ["evidence categories", "uncertainty structure cues"],
    must_not_show: ["completed classifications", "preferred decision"],
    allowed_claims: ["Evidence can be organised by uncertainty structure."],
    disallowed_claims: ["One preferred decision is already warranted."],
    source_basis: "A2.learner_task; A2.materials.scenarios",
    caption_intent: "Evidence structure without answers.",
    alt_text: "Evidence structure cues; detailed description follows.",
    detailed_description:
      "An evidence chart shows labelled structural categories without filled answers.",
    discipline_risk_level: "medium"
  };
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

function loadPrismTestApi() {
  const source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
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
    getElementById(id) {
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
    localStorage: { getItem() { return null; }, setItem() {} },
    URL: { createObjectURL() { return "blob:test"; }, revokeObjectURL() {} },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries() {
        return Promise.resolve({ added: 0, updated: 0, skipped: 0 });
      },
      getAllPrompts() {
        return Promise.resolve([]);
      }
    }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot, null, {
    skipLearnerRendererVNextInject: true
  });
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

test("canonical spoiler_boundary requires the four schema 38.4 boolean keys", () => {
  assert.deepEqual(s38.SPOILER_BOUNDARY_BOOLEAN_KEYS, [
    "hide_answers",
    "hide_classification_keys",
    "hide_model_solution",
    "allow_structural_hint"
  ]);
  const lines = s38.buildSpoilerBoundaryAuthoringContractLines().join("\n");
  s38.SPOILER_BOUNDARY_BOOLEAN_KEYS.forEach((key) => {
    assert.match(lines, new RegExp(key));
  });
  assert.match(lines, /must_not_reveal/);
  assert.match(lines, /Do NOT emit a prose-only spoiler_boundary/i);
  assert.match(lines, /When anti_spoiler is false, omit spoiler_boundary/i);
});

test("validator rejects live incomplete spoiler_boundary { must_not_reveal only }", () => {
  const page = {
    visual_affordance_schema_version: "38.4",
    visual_affordances: [liveFailureIncompleteSpoilerBoundary()]
  };
  const result = s38.validatePageVisualAffordances(page);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => /spoiler_boundary\.allow_structural_hint must be boolean/i.test(e)));
  assert.ok(result.errors.some((e) => /spoiler_boundary\.hide_answers must be boolean/i.test(e)));
  assert.ok(
    result.errors.some((e) => /spoiler_boundary\.hide_classification_keys must be boolean/i.test(e))
  );
  assert.ok(result.errors.some((e) => /spoiler_boundary\.hide_model_solution must be boolean/i.test(e)));
});

test("validator accepts complete spoiler_boundary and non-anti-spoiler without spoiler_boundary", () => {
  const complete = JSON.parse(JSON.stringify(records.inflation_a3_generate));
  assert.equal(complete.anti_spoiler, true);
  assert.equal(typeof complete.spoiler_boundary.hide_answers, "boolean");
  const ok = s38.validatePageVisualAffordances({ visual_affordances: [complete] });
  assert.equal(ok.valid, true, ok.errors.join("; "));

  const nonAnti = JSON.parse(JSON.stringify(complete));
  nonAnti.affordance_id = "va-A3-non-anti-01";
  nonAnti.anti_spoiler = false;
  delete nonAnti.spoiler_boundary;
  const okOmit = s38.validatePageVisualAffordances({ visual_affordances: [nonAnti] });
  assert.equal(okOmit.valid, true, okOmit.errors.join("; "));
});

test("Sprint 38 Design Page prompt contract requires complete booleans and rejects must_not_reveal-only shape", () => {
  const api = loadPrismTestApi();
  const block = api.buildSprint38VisualAffordanceDesignPagePromptBlock();
  assert.match(block, /hide_answers/);
  assert.match(block, /hide_classification_keys/);
  assert.match(block, /hide_model_solution/);
  assert.match(block, /allow_structural_hint/);
  assert.match(block, /literal JSON boolean/i);
  assert.match(block, /Do NOT emit a prose-only spoiler_boundary/i);
  assert.match(block, /must_not_reveal/);
  assert.doesNotMatch(
    block,
    /spoiler_boundary object when anti_spoiler is true(?!;)/
  );
  // Examples still show the complete canonical object, not prose-only.
  assert.match(
    block,
    /"spoiler_boundary": \{"hide_answers": true, "hide_classification_keys": true, "hide_model_solution": true, "allow_structural_hint": true\}/
  );
  assert.doesNotMatch(block, /"spoiler_boundary": \{"must_not_reveal"/);
});

test("Interactive and Expository Design Page contracts share the complete spoiler_boundary requirement", () => {
  const interactive = dpPartial.buildDesignPagePartialContractBlock();
  assert.match(interactive, /hide_answers/);
  assert.match(interactive, /hide_classification_keys/);
  assert.match(interactive, /hide_model_solution/);
  assert.match(interactive, /allow_structural_hint/);
  assert.match(interactive, /must_not_reveal/);
  assert.doesNotMatch(interactive, /spoiler_boundary when anti_spoiler is true/);

  const expository = expo.resolveTemplate("design_page");
  assert.match(expository, /hide_answers/);
  assert.match(expository, /hide_classification_keys/);
  assert.match(expository, /hide_model_solution/);
  assert.match(expository, /allow_structural_hint/);
  assert.match(expository, /must_not_reveal/);
  assert.doesNotMatch(expository, /spoiler_boundary when anti_spoiler is true/);
});
