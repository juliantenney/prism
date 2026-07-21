"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  buildBeatContentSequence,
  partitionPrompts
} = require("../lib/learner-renderer-vnext/build-beat-content-sequence");

function beat(overrides) {
  return Object.assign(
    {
      instructions: [],
      prompts: [],
      materials: [],
      expectedOutput: null
    },
    overrides || {}
  );
}

function instruction(step, text) {
  return { sourceStepNumber: step, text: text };
}

function material(id, type) {
  return { id: id, type: type, title: id, body: "body", bodyFormat: "markdown", sourceOrder: 1 };
}

function prompt(field, text) {
  return { sourceField: field, text: text || field };
}

function kinds(sequence) {
  return sequence.map(function (item) {
    if (item.kind === "instruction") return "instruction:" + item.instruction.sourceStepNumber;
    if (item.kind === "material") return "material:" + item.material.id;
    if (item.kind === "prompt") return "prompt:" + item.prompt.sourceField;
    if (item.kind === "expectedOutput") return "expectedOutput";
    return item.kind;
  });
}

test("beat sequence: one instruction to one material", () => {
  const sequence = buildBeatContentSequence(
    beat({
      instructions: [instruction(1, "Step 1")],
      materials: [material("m1", "text")]
    })
  );
  assert.deepEqual(kinds(sequence), ["instruction:1", "material:m1"]);
});

test("beat sequence: one instruction to multiple materials", () => {
  const sequence = buildBeatContentSequence(
    beat({
      instructions: [instruction(1, "Step 1")],
      materials: [material("m1", "text"), material("m2", "checklist")]
    })
  );
  assert.deepEqual(kinds(sequence), ["instruction:1", "material:m1", "material:m2"]);
});

test("beat sequence: multiple instructions to one material", () => {
  const sequence = buildBeatContentSequence(
    beat({
      instructions: [instruction(1, "Step 1"), instruction(2, "Step 2")],
      materials: [material("m1", "analysis_table")]
    })
  );
  assert.deepEqual(kinds(sequence), ["instruction:1", "material:m1", "instruction:2"]);
});

test("beat sequence: material with no instruction", () => {
  const sequence = buildBeatContentSequence(
    beat({
      materials: [material("m1", "scenario"), material("m2", "analysis_table")]
    })
  );
  assert.deepEqual(kinds(sequence), ["material:m1", "material:m2"]);
});

test("beat sequence: instruction with no material", () => {
  const sequence = buildBeatContentSequence(
    beat({
      instructions: [instruction(1, "Step 1"), instruction(2, "Step 2")]
    })
  );
  assert.deepEqual(kinds(sequence), ["instruction:1", "instruction:2"]);
});

test("beat sequence: entry prompt before instruction/material interleave", () => {
  const sequence = buildBeatContentSequence(
    beat({
      prompts: [prompt("self_explanation_prompt")],
      instructions: [instruction(1, "Step 1")],
      materials: [material("m1", "text")]
    })
  );
  assert.deepEqual(kinds(sequence), [
    "prompt:self_explanation_prompt",
    "instruction:1",
    "material:m1"
  ]);
});

test("beat sequence: transfer prompt after interleaved content", () => {
  const sequence = buildBeatContentSequence(
    beat({
      prompts: [prompt("transfer_or_application_task")],
      instructions: [instruction(1, "Step 1")],
      materials: [material("m1", "consolidation_summary")]
    })
  );
  assert.deepEqual(kinds(sequence), [
    "instruction:1",
    "material:m1",
    "prompt:transfer_or_application_task"
  ]);
});

test("beat sequence: expected output remains last", () => {
  const sequence = buildBeatContentSequence(
    beat({
      instructions: [instruction(1, "Step 1")],
      materials: [material("m1", "checklist")],
      prompts: [prompt("transfer_or_application_task")],
      expectedOutput: { text: "Expected" }
    })
  );
  assert.deepEqual(kinds(sequence), [
    "instruction:1",
    "material:m1",
    "prompt:transfer_or_application_task",
    "expectedOutput"
  ]);
});

test("beat sequence: unmatched content is never dropped", () => {
  const sequence = buildBeatContentSequence(
    beat({
      prompts: [
        prompt("conceptual_contrast_prompt"),
        prompt("transfer_or_application_task"),
        prompt("custom_future_field")
      ],
      instructions: [instruction(1, "A"), instruction(2, "B"), instruction(3, "C")],
      materials: [material("m1", "text")]
    })
  );
  assert.equal(sequence.length, 7);
  assert.equal(
    sequence.filter(function (item) {
      return item.kind === "instruction";
    }).length,
    3
  );
  assert.equal(
    sequence.filter(function (item) {
      return item.kind === "material";
    }).length,
    1
  );
  assert.equal(
    sequence.filter(function (item) {
      return item.kind === "prompt";
    }).length,
    3
  );
});

test("partitionPrompts: classifies known pedagogical fields", () => {
  const groups = partitionPrompts([
    prompt("self_explanation_prompt"),
    prompt("transfer_or_application_task"),
    prompt("unknown_prompt")
  ]);
  assert.equal(groups.entry.length, 1);
  assert.equal(groups.exit.length, 1);
  assert.equal(groups.other.length, 1);
});
