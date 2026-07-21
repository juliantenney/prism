"use strict";

var ENTRY_PROMPT_FIELDS = Object.freeze({
  self_explanation_prompt: true,
  conceptual_contrast_prompt: true,
  intellectual_coherence_bridge: true,
  argument_structure_hint: true
});

var EXIT_PROMPT_FIELDS = Object.freeze({
  transfer_or_application_task: true
});

function partitionPrompts(prompts) {
  var entry = [];
  var exit = [];
  var other = [];

  (Array.isArray(prompts) ? prompts : []).forEach(function (prompt) {
    var field = String((prompt && prompt.sourceField) || "").trim();
    if (ENTRY_PROMPT_FIELDS[field]) entry.push(prompt);
    else if (EXIT_PROMPT_FIELDS[field]) exit.push(prompt);
    else other.push(prompt);
  });

  return { entry: entry, exit: exit, other: other };
}

/**
 * Build an explicit ordered beat stream for rendering.
 *
 * Alignment rule: instructions and materials are paired by positional index
 * (1:1 at each index, extras from either side are preserved in source order).
 * There is no explicit source ownership link between a step and a material.
 *
 * Prompt placement:
 * - Entry prompts (orientation/contrast/bridge/argument hint) precede interleaving.
 * - Transfer/application prompts follow interleaved content (before expected output).
 * - Unclassified prompt fields keep beat-entry placement for backward compatibility.
 *
 * @param {import("./types").LearnerBeat} beat
 * @returns {import("./types").BeatContentItem[]}
 */
function buildBeatContentSequence(beat) {
  var sequence = [];
  var instructions = Array.isArray(beat.instructions) ? beat.instructions.slice() : [];
  var materials = Array.isArray(beat.materials) ? beat.materials.slice() : [];
  var promptGroups = partitionPrompts(beat.prompts);
  var expectedOutput = beat.expectedOutput || null;
  var index = 0;

  promptGroups.entry.concat(promptGroups.other).forEach(function (prompt) {
    sequence.push({ kind: "prompt", prompt: prompt });
  });

  var pairCount = Math.max(instructions.length, materials.length);
  for (index = 0; index < pairCount; index += 1) {
    if (index < instructions.length) {
      sequence.push({ kind: "instruction", instruction: instructions[index] });
    }
    if (index < materials.length) {
      sequence.push({ kind: "material", material: materials[index] });
    }
  }

  promptGroups.exit.forEach(function (prompt) {
    sequence.push({ kind: "prompt", prompt: prompt });
  });

  if (expectedOutput) {
    sequence.push({ kind: "expectedOutput", expectedOutput: expectedOutput });
  }

  return sequence;
}

module.exports = {
  ENTRY_PROMPT_FIELDS: ENTRY_PROMPT_FIELDS,
  EXIT_PROMPT_FIELDS: EXIT_PROMPT_FIELDS,
  partitionPrompts: partitionPrompts,
  buildBeatContentSequence: buildBeatContentSequence
};
