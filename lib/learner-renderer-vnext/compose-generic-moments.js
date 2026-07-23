"use strict";

var classification = require("./compose-moment-classification");
var shouldComposeTableWorkspaceMaterial =
  require("./completion-table-workspace").shouldComposeTableWorkspaceMaterial;
var determineWorkspaceRequirements =
  require("./compose-workspace").determineWorkspaceRequirements;
var composeLearnerSurfaces = require("./compose-learner-surfaces").composeLearnerSurfaces;
var normalizeOrderingSemantics =
  require("./normalize-ordering").normalizeOrderingSemantics;

function sourceRef(activityId, details) {
  return Object.assign({ activityId: String(activityId || "") }, details || {});
}

function learnItemRoleForMaterial(material) {
  var type = String((material && material.type) || "");
  if (type === "text" || type === "modelling_note") return "definition";
  if (type === "worked_example" || type === "scenario" || type === "sample_output") {
    return "example";
  }
  return "explanation";
}

function revealBehaviourForCheckMaterial(material) {
  if (String((material && material.type) || "") === "sample_output") {
    return {
      mode: "details",
      defaultOpen: false,
      summary: "Review the example response"
    };
  }
  return null;
}

/**
 * @param {import("./types").LearnerBeat} beat
 * @returns {{
 *   learnInstructions: import("./types").LearnerInstruction[],
 *   doInstructions: import("./types").LearnerInstruction[],
 *   checkInstructions: import("./types").LearnerInstruction[],
 *   doMaterials: import("./types").LearnerMaterial[],
 *   checkMaterials: import("./types").LearnerMaterial[],
 *   expectedOutputForDo: import("./types").ExpectedOutputModel|null
 * }}
 */
function splitBeatDoCheckContent(beat) {
  var instructions = Array.isArray(beat.instructions) ? beat.instructions : [];
  var materials = Array.isArray(beat.materials) ? beat.materials : [];
  var learnInstructions = [];
  var doInstructions = [];
  var checkInstructions = [];
  var seenVerify = false;

  instructions.forEach(function (instruction) {
    var placement = classification.classifyInstructionPlacement(instruction);
    if (placement === "check") {
      seenVerify = true;
      checkInstructions.push(instruction);
      return;
    }
    if (placement === "learn") {
      learnInstructions.push(instruction);
      return;
    }
    if (placement === "do") {
      doInstructions.push(instruction);
      return;
    }
    if (seenVerify) checkInstructions.push(instruction);
    else doInstructions.push(instruction);
  });

  var doMaterials = [];
  var checkMaterials = [];
  materials.forEach(function (material) {
    var placement = classification.classifyMaterialPlacement(material);
    if (placement === "check") checkMaterials.push(material);
    else if (placement === "task") doMaterials.push(material);
    else if (doInstructions.length) doMaterials.push(material);
    else checkMaterials.push(material);
  });

  return {
    learnInstructions: learnInstructions,
    doInstructions: doInstructions,
    checkInstructions: checkInstructions,
    doMaterials: doMaterials,
    checkMaterials: checkMaterials,
    expectedOutputForDo: doInstructions.length ? beat.expectedOutput : null
  };
}

/**
 * Pair instructions with materials in authored step / material order.
 * Each prompt travels immediately before the content it governs.
 *
 * @param {string} activityId
 * @param {{ instruction: import("./types").LearnerInstruction, beatFunction: string, role?: string }[]} instructionEntries
 * @param {{ material: import("./types").LearnerMaterial, beatFunction: string, role?: string, reveal?: *, tableWorkspace?: boolean }[]} materialEntries
 * @returns {import("./types").CompositionMomentItem[]}
 */
function buildInterleavedInstructionMaterialItems(
  activityId,
  instructionEntries,
  materialEntries
) {
  var items = [];
  var instructions = Array.isArray(instructionEntries) ? instructionEntries : [];
  var materials = Array.isArray(materialEntries) ? materialEntries : [];
  var pairCount = Math.max(instructions.length, materials.length);
  var index;

  for (index = 0; index < pairCount; index += 1) {
    if (index < instructions.length) {
      var instructionEntry = instructions[index];
      var instruction = instructionEntry.instruction;
      items.push({
        kind: "instruction",
        role: instructionEntry.role || "explanation",
        instruction: {
          sourceStepNumber: instruction.sourceStepNumber,
          text: String(instruction.text || "").trim()
        },
        sourceRef: sourceRef(activityId, {
          sourceStepNumber: instruction.sourceStepNumber,
          beatFunction: instructionEntry.beatFunction
        })
      });
    }
    if (index < materials.length) {
      var materialEntry = materials[index];
      var material = materialEntry.material;
      var materialItem = {
        kind: "material",
        role: materialEntry.role || learnItemRoleForMaterial(material),
        material: material,
        tableWorkspace: !!materialEntry.tableWorkspace,
        sourceRef: sourceRef(activityId, {
          materialId: material.id,
          beatFunction: materialEntry.beatFunction
        })
      };
      if (materialEntry.reveal) materialItem.reveal = materialEntry.reveal;
      items.push(materialItem);
    }
  }

  return items;
}

function collectLearnInstructionEntries(modelActivity, groups) {
  var entries = [];
  var seenSteps = Object.create(null);

  function pushInstruction(instruction, beatFunction, role) {
    var stepNumber = Number(instruction && instruction.sourceStepNumber);
    if (!Number.isFinite(stepNumber) || seenSteps[stepNumber]) return;
    var placement = classification.classifyInstructionPlacement(instruction);
    if (placement !== "learn" && placement !== "neutral") return;
    // Neutral instructions only stay on learn beats (not pulled from split/do).
    if (placement === "neutral" && role !== "learn-beat") return;
    seenSteps[stepNumber] = true;
    entries.push({
      instruction: instruction,
      beatFunction: String(beatFunction || ""),
      role: "explanation"
    });
  }

  (Array.isArray(groups.learnBeats) ? groups.learnBeats : []).forEach(function (beat) {
    (Array.isArray(beat.instructions) ? beat.instructions : []).forEach(function (instruction) {
      pushInstruction(instruction, beat.sourceFunction, "learn-beat");
    });
  });

  (Array.isArray(groups.splitBeats) ? groups.splitBeats : [])
    .concat(Array.isArray(groups.doBeats) ? groups.doBeats : [])
    .forEach(function (beat) {
      (Array.isArray(beat.instructions) ? beat.instructions : []).forEach(function (instruction) {
        if (classification.classifyInstructionPlacement(instruction) === "learn") {
          pushInstruction(instruction, beat.sourceFunction, "cross-beat");
        }
      });
    });

  entries.sort(function (left, right) {
    return (
      Number(left.instruction.sourceStepNumber) - Number(right.instruction.sourceStepNumber)
    );
  });
  return entries;
}

function collectLearnMaterialEntries(groups) {
  var entries = [];
  (Array.isArray(groups.learnBeats) ? groups.learnBeats : []).forEach(function (beat) {
    (Array.isArray(beat.materials) ? beat.materials : []).forEach(function (material) {
      entries.push({
        material: material,
        beatFunction: String(beat.sourceFunction || ""),
        role: learnItemRoleForMaterial(material),
        tableWorkspace: shouldComposeTableWorkspaceMaterial(material)
      });
    });
  });
  return entries;
}

/**
 * @param {string} activityId
 * @param {import("./types").LearnerBeat} beat
 * @param {import("./types").LearnerInstruction[]} instructions
 * @param {import("./types").LearnerMaterial[]} materials
 * @param {import("./types").ExpectedOutputModel|null} expectedOutput
 * @param {{ includePrompts?: boolean, promptFields?: string[] }} [options]
 * @returns {import("./types").CompositionMomentItem[]}
 */
function buildLearnItemsFromBeatContent(
  activityId,
  beat,
  instructions,
  materials,
  expectedOutput,
  options
) {
  var opts = options || {};
  var items = [];
  var beatFunction = String(beat.sourceFunction || "");
  var materialCursor = 0;
  var materialList = Array.isArray(materials) ? materials : [];
  var instructionList = Array.isArray(instructions) ? instructions : [];

  instructionList.forEach(function (instruction) {
    items.push({
      kind: "instruction",
      role: "explanation",
      instruction: {
        sourceStepNumber: instruction.sourceStepNumber,
        text: String(instruction.text || "").trim()
      },
      sourceRef: sourceRef(activityId, {
        sourceStepNumber: instruction.sourceStepNumber,
        beatFunction: beatFunction
      })
    });

    if (materialCursor < materialList.length) {
      var material = materialList[materialCursor];
      materialCursor += 1;
      items.push({
        kind: "material",
        role: learnItemRoleForMaterial(material),
        material: material,
        tableWorkspace: shouldComposeTableWorkspaceMaterial(material),
        sourceRef: sourceRef(activityId, {
          materialId: material.id,
          beatFunction: beatFunction
        })
      });
    }
  });

  while (materialCursor < materialList.length) {
    var trailingMaterial = materialList[materialCursor];
    materialCursor += 1;
    items.push({
      kind: "material",
      role: learnItemRoleForMaterial(trailingMaterial),
      material: trailingMaterial,
      tableWorkspace: shouldComposeTableWorkspaceMaterial(trailingMaterial),
      sourceRef: sourceRef(activityId, {
        materialId: trailingMaterial.id,
        beatFunction: beatFunction
      })
    });
  }

  if (opts.includePrompts) {
    var promptFields = Object.create(null);
    (Array.isArray(opts.promptFields) ? opts.promptFields : []).forEach(function (field) {
      promptFields[String(field || "")] = true;
    });
    (Array.isArray(beat.prompts) ? beat.prompts : []).forEach(function (prompt) {
      var field = String((prompt && prompt.sourceField) || "");
      if (opts.promptFields && !promptFields[field]) return;
      if (!String(prompt.text || "").trim()) return;
      items.push({
        kind: "prompt",
        prompt: {
          sourceField: field,
          text: String(prompt.text || "").trim()
        },
        sourceRef: sourceRef(activityId, {
          sourceField: field,
          beatFunction: beatFunction
        })
      });
    });
  }

  if (expectedOutput && String(expectedOutput.text || "").trim()) {
    items.push({
      kind: "expectedOutput",
      expectedOutput: { text: String(expectedOutput.text || "").trim() },
      sourceRef: sourceRef(activityId, {
        sourceField: "expected_output",
        beatFunction: beatFunction
      })
    });
  }

  return items;
}

/**
 * @param {string} activityId
 * @param {import("./types").LearnerBeat} beat
 * @param {import("./types").LearnerInstruction[]} instructions
 * @param {import("./types").LearnerMaterial[]} materials
 * @param {import("./types").ExpectedOutputModel|null} expectedOutput
 * @param {{ includePrompts?: boolean, promptFields?: string[] }} [options]
 * @returns {{ items: import("./types").CompositionMomentItem[], taskSteps: Object[], materials: import("./types").LearnerMaterial[], expectedOutput: import("./types").ExpectedOutputModel|null }}
 */
function buildDoItemsFromBeatContent(
  activityId,
  beat,
  instructions,
  materials,
  expectedOutput,
  options
) {
  var opts = options || {};
  var items = [];
  var beatFunction = String(beat.sourceFunction || "");
  var taskSteps = [];
  var materialCursor = 0;
  var materialList = Array.isArray(materials) ? materials : [];

  (Array.isArray(instructions) ? instructions : []).forEach(function (instruction) {
    taskSteps.push({
      sourceStepNumber: instruction.sourceStepNumber,
      text: String(instruction.text || "").trim()
    });
    items.push({
      kind: "instruction",
      instruction: {
        sourceStepNumber: instruction.sourceStepNumber,
        text: String(instruction.text || "").trim()
      },
      sourceRef: sourceRef(activityId, {
        sourceStepNumber: instruction.sourceStepNumber,
        beatFunction: beatFunction
      })
    });

    if (
      classification.classifyInstructionIntent(instruction) !== "verify" &&
      materialCursor < materialList.length
    ) {
      var material = materialList[materialCursor];
      materialCursor += 1;
      items.push({
        kind: "material",
        material: material,
        tableWorkspace: shouldComposeTableWorkspaceMaterial(material),
        sourceRef: sourceRef(activityId, {
          materialId: material.id,
          beatFunction: beatFunction
        })
      });
    }
  });

  while (materialCursor < materialList.length) {
    var trailingMaterial = materialList[materialCursor];
    materialCursor += 1;
    items.push({
      kind: "material",
      material: trailingMaterial,
      tableWorkspace: shouldComposeTableWorkspaceMaterial(trailingMaterial),
      sourceRef: sourceRef(activityId, {
        materialId: trailingMaterial.id,
        beatFunction: beatFunction
      })
    });
  }

  if (opts.includePrompts) {
    var promptFields = Object.create(null);
    (Array.isArray(opts.promptFields) ? opts.promptFields : []).forEach(function (field) {
      promptFields[String(field || "")] = true;
    });
    (Array.isArray(beat.prompts) ? beat.prompts : []).forEach(function (prompt) {
      var field = String((prompt && prompt.sourceField) || "");
      if (opts.promptFields && !promptFields[field]) return;
      if (!String(prompt.text || "").trim()) return;
      items.push({
        kind: "prompt",
        prompt: {
          sourceField: field,
          text: String(prompt.text || "").trim()
        },
        sourceRef: sourceRef(activityId, {
          sourceField: field,
          beatFunction: beatFunction
        })
      });
    });
  }

  if (expectedOutput && String(expectedOutput.text || "").trim()) {
    items.push({
      kind: "expectedOutput",
      expectedOutput: { text: String(expectedOutput.text || "").trim() },
      sourceRef: sourceRef(activityId, {
        sourceField: "expected_output",
        beatFunction: beatFunction
      })
    });
  }

  return {
    items: items,
    taskSteps: taskSteps,
    materials: materialList.slice(),
    expectedOutput: expectedOutput
  };
}

/**
 * @param {import("./types").LearnerActivity} modelActivity
 * @param {import("./types").LearnerBeat[]} beats
 * @returns {import("./types").CompositionMoment|null}
 */
function composeLearnMomentFromBeats(modelActivity, beats) {
  var activityId = String((modelActivity && modelActivity.id) || "").trim();
  var groups = {
    learnBeats: Array.isArray(beats) ? beats : [],
    doBeats: [],
    checkBeats: [],
    splitBeats: []
  };
  // When called with an explicit beat list only, still allow cross-beat learn
  // prompts from the full activity classification.
  var fullGroups = classification.classifyActivityBeats(modelActivity);
  groups.splitBeats = fullGroups.splitBeats;
  groups.doBeats = fullGroups.doBeats;

  var instructionEntries = collectLearnInstructionEntries(modelActivity, groups);
  var materialEntries = collectLearnMaterialEntries(groups);
  var items = buildInterleavedInstructionMaterialItems(
    activityId,
    instructionEntries,
    materialEntries
  );

  if (!items.length) return null;

  var explanatorySteps = instructionEntries.map(function (entry) {
    return {
      sourceStepNumber: entry.instruction.sourceStepNumber,
      text: String(entry.instruction.text || "").trim()
    };
  });
  var materials = materialEntries.map(function (entry) {
    return entry.material;
  });

  return {
    kind: "learn",
    items: items,
    explanatorySteps: explanatorySteps,
    materials: materials
  };
}

/**
 * @param {import("./types").LearnerActivity} modelActivity
 * @returns {import("./types").CompositionMoment|null}
 */
function composeGenericLearnMoment(modelActivity) {
  var groups = classification.classifyActivityBeats(modelActivity);
  return composeLearnMomentFromBeats(modelActivity, groups.learnBeats);
}

/**
 * @param {import("./types").LearnerActivity} modelActivity
 * @returns {import("./types").CompositionMoment|null}
 */
function composeGenericDoMoment(modelActivity) {
  var activityId = String((modelActivity && modelActivity.id) || "").trim();
  var groups = classification.classifyActivityBeats(modelActivity);
  var instructionEntries = [];
  var materialEntries = [];
  var expectedOutput = null;
  var promptItems = [];
  var seenSteps = Object.create(null);

  function pushDoInstruction(instruction, beatFunction) {
    var stepNumber = Number(instruction && instruction.sourceStepNumber);
    if (!Number.isFinite(stepNumber) || seenSteps[stepNumber]) return;
    var placement = classification.classifyInstructionPlacement(instruction);
    if (placement !== "do" && placement !== "neutral") return;
    seenSteps[stepNumber] = true;
    instructionEntries.push({
      instruction: instruction,
      beatFunction: String(beatFunction || "")
    });
  }

  function pushDoMaterial(material, beatFunction) {
    if (!material) return;
    materialEntries.push({
      material: material,
      beatFunction: String(beatFunction || ""),
      tableWorkspace: shouldComposeTableWorkspaceMaterial(material)
    });
  }

  function collectPromptsFromBeat(beat) {
    (Array.isArray(beat.prompts) ? beat.prompts : []).forEach(function (prompt) {
      var field = String((prompt && prompt.sourceField) || "");
      if (field !== "argument_structure_hint") return;
      if (!String(prompt.text || "").trim()) return;
      promptItems.push({
        kind: "prompt",
        prompt: {
          sourceField: field,
          text: String(prompt.text || "").trim()
        },
        sourceRef: sourceRef(activityId, {
          sourceField: field,
          beatFunction: beat.sourceFunction
        })
      });
    });
  }

  groups.doBeats.forEach(function (beat) {
    (Array.isArray(beat.instructions) ? beat.instructions : []).forEach(function (instruction) {
      pushDoInstruction(instruction, beat.sourceFunction);
    });
    (Array.isArray(beat.materials) ? beat.materials : []).forEach(function (material) {
      pushDoMaterial(material, beat.sourceFunction);
    });
    if (beat.expectedOutput) expectedOutput = beat.expectedOutput;
    collectPromptsFromBeat(beat);
  });

  groups.splitBeats.forEach(function (beat) {
    var split = splitBeatDoCheckContent(beat);
    split.doInstructions.forEach(function (instruction) {
      pushDoInstruction(instruction, beat.sourceFunction);
    });
    split.doMaterials.forEach(function (material) {
      pushDoMaterial(material, beat.sourceFunction);
    });
    if (split.expectedOutputForDo) expectedOutput = split.expectedOutputForDo;
    collectPromptsFromBeat(beat);
  });

  instructionEntries.sort(function (left, right) {
    return (
      Number(left.instruction.sourceStepNumber) - Number(right.instruction.sourceStepNumber)
    );
  });

  var items = buildInterleavedInstructionMaterialItems(
    activityId,
    instructionEntries,
    materialEntries
  );

  // Defer table workspaces so guidance (EO + structure hints) can precede them.
  var deferredTableItems = [];
  items = items.filter(function (item) {
    if (item && item.kind === "material" && item.tableWorkspace) {
      deferredTableItems.push(item);
      return false;
    }
    return true;
  });

  if (!items.length && !deferredTableItems.length && !promptItems.length) {
    var orderingProbe = normalizeOrderingSemantics(
      (modelActivity && modelActivity.sourceActivity) || {
        activity_id: activityId,
        activity_interaction_type: modelActivity && modelActivity.activityInteractionType,
        ordering: modelActivity && modelActivity.ordering,
        learner_task: modelActivity && modelActivity.learnerTask,
        learner_instructions: modelActivity && modelActivity.learnerInstructions
      },
      { activityId: activityId }
    );
    if (!orderingProbe.ok && !expectedOutput) return null;
  }

  if (!expectedOutput) {
    var checkSourceBeats = groups.checkBeats.concat(groups.splitBeats);
    for (var ci = 0; ci < checkSourceBeats.length; ci += 1) {
      var candidateBeat = checkSourceBeats[ci];
      if (candidateBeat && candidateBeat.expectedOutput) {
        expectedOutput = candidateBeat.expectedOutput;
        break;
      }
    }
  }

  // Ownership order: instruction/materials → expected output → structure hint → table workspaces.
  if (expectedOutput && String(expectedOutput.text || "").trim()) {
    items.push({
      kind: "expectedOutput",
      expectedOutput: {
        text: String(expectedOutput.text || "").trim()
      },
      sourceRef: sourceRef(activityId, {
        sourceField: "expected_output",
        beatFunction:
          (groups.splitBeats[0] && groups.splitBeats[0].sourceFunction) ||
          (groups.checkBeats[0] && groups.checkBeats[0].sourceFunction) ||
          (groups.doBeats[0] && groups.doBeats[0].sourceFunction) ||
          ""
      })
    });
  }

  items = items.concat(promptItems).concat(deferredTableItems);

  var taskSteps = instructionEntries.map(function (entry) {
    return {
      sourceStepNumber: entry.instruction.sourceStepNumber,
      text: String(entry.instruction.text || "").trim()
    };
  });
  var materials = materialEntries.map(function (entry) {
    return entry.material;
  });
  var stepNumbers = taskSteps.map(function (step) {
    return Number(step.sourceStepNumber);
  });
  var surfaceResult = composeLearnerSurfaces({
    activityId: activityId,
    modelActivity: modelActivity,
    momentKind: "do",
    items: items,
    taskSteps: taskSteps,
    expectedOutput: expectedOutput
  });
  var workspaces = surfaceResult.workspaces;

  if (!workspaces.length) {
    workspaces = determineWorkspaceRequirements(taskSteps, stepNumbers);
  }

  if (!items.length && !workspaces.length) return null;

  return {
    kind: "do",
    items: items,
    taskSteps: taskSteps,
    materials: materials,
    expectedOutput: expectedOutput,
    workspace: workspaces.length === 1 ? workspaces[0] : workspaces[0] || null,
    workspaces: workspaces.length ? workspaces : undefined,
    surfaceDiagnostics: surfaceResult.diagnostics.length ? surfaceResult.diagnostics : undefined
  };
}

function findTransferPrompt(modelActivity, beatFunction) {
  var beats = Array.isArray(modelActivity && modelActivity.beats) ? modelActivity.beats : [];
  var beat = beats.find(function (entry) {
    return String(entry.sourceFunction || "") === String(beatFunction || "");
  });
  if (!beat) return null;
  var prompts = Array.isArray(beat.prompts) ? beat.prompts : [];
  for (var i = 0; i < prompts.length; i += 1) {
    var prompt = prompts[i];
    if (
      String((prompt && prompt.sourceField) || "") === "transfer_or_application_task" &&
      String(prompt.text || "").trim()
    ) {
      return prompt;
    }
  }
  return null;
}

/**
 * @param {string} activityId
 * @param {import("./types").LearnerBeat} beat
 * @param {import("./types").LearnerInstruction[]} instructions
 * @param {import("./types").LearnerMaterial[]} materials
 * @returns {import("./types").CompositionMomentItem[]}
 */
function buildCheckItemsFromBeatContent(activityId, beat, instructions, materials) {
  var items = [];
  var beatFunction = String(beat.sourceFunction || "");
  var materialCursor = 0;
  var materialList = Array.isArray(materials) ? materials : [];

  (Array.isArray(instructions) ? instructions : []).forEach(function (instruction) {
    items.push({
      kind: "instruction",
      instruction: {
        sourceStepNumber: instruction.sourceStepNumber,
        text: String(instruction.text || "").trim()
      },
      sourceRef: sourceRef(activityId, {
        sourceStepNumber: instruction.sourceStepNumber,
        beatFunction: beatFunction
      })
    });

    if (materialCursor < materialList.length) {
      var material = materialList[materialCursor];
      materialCursor += 1;
      items.push({
        kind: "material",
        material: material,
        reveal: revealBehaviourForCheckMaterial(material),
        sourceRef: sourceRef(activityId, {
          materialId: material.id,
          beatFunction: beatFunction
        })
      });
    }
  });

  while (materialCursor < materialList.length) {
    var trailingMaterial = materialList[materialCursor];
    materialCursor += 1;
    items.push({
      kind: "material",
      material: trailingMaterial,
      reveal: revealBehaviourForCheckMaterial(trailingMaterial),
      sourceRef: sourceRef(activityId, {
        materialId: trailingMaterial.id,
        beatFunction: beatFunction
      })
    });
  }

  return items;
}

/**
 * @param {import("./types").LearnerActivity} modelActivity
 * @returns {import("./types").CompositionMoment|null}
 */
function composeGenericCheckMoment(modelActivity) {
  var activityId = String((modelActivity && modelActivity.id) || "").trim();
  var groups = classification.classifyActivityBeats(modelActivity);
  var beats = Array.isArray(modelActivity && modelActivity.beats) ? modelActivity.beats : [];
  var items = [];
  var checkingSteps = [];
  var materials = [];

  beats.forEach(function (beat) {
    if (groups.splitBeats.indexOf(beat) >= 0) {
      var split = splitBeatDoCheckContent(beat);
      if (!split.checkInstructions.length && !split.checkMaterials.length) return;
      var splitItems = buildCheckItemsFromBeatContent(
        activityId,
        beat,
        split.checkInstructions,
        split.checkMaterials
      );
      items = items.concat(splitItems);
      split.checkInstructions.forEach(function (instruction) {
        checkingSteps.push({
          sourceStepNumber: instruction.sourceStepNumber,
          text: String(instruction.text || "").trim()
        });
      });
      materials = materials.concat(split.checkMaterials);
      return;
    }

    if (groups.checkBeats.indexOf(beat) < 0) return;

    var beatItems = buildCheckItemsFromBeatContent(
      activityId,
      beat,
      beat.instructions,
      beat.materials
    );
    items = items.concat(beatItems);
    (Array.isArray(beat.instructions) ? beat.instructions : []).forEach(function (instruction) {
      checkingSteps.push({
        sourceStepNumber: instruction.sourceStepNumber,
        text: String(instruction.text || "").trim()
      });
    });
    materials = materials.concat(beat.materials || []);

    if (beat.learnerRole === "transfer" || beat.sourceFunction === "reflection") {
      var transferPrompt = findTransferPrompt(modelActivity, beat.sourceFunction);
      if (transferPrompt && String(transferPrompt.text || "").trim()) {
        items.push({
          kind: "prompt",
          prompt: {
            sourceField: "transfer_or_application_task",
            text: String(transferPrompt.text || "").trim()
          },
          sourceRef: sourceRef(activityId, {
            sourceField: "transfer_or_application_task",
            beatFunction: beat.sourceFunction
          })
        });
      }
    }
  });

  if (!items.length) return null;

  var surfaceResult = composeLearnerSurfaces({
    activityId: activityId,
    modelActivity: modelActivity,
    momentKind: "check",
    items: items,
    taskSteps: checkingSteps,
    expectedOutput: null
  });

  return {
    kind: "check",
    learnerGuidance:
      "Complete your response first, then use this material to check or improve it.",
    items: items,
    checkingSteps: checkingSteps,
    materials: materials,
    workspace: surfaceResult.workspaces.length === 1 ? surfaceResult.workspaces[0] : null,
    workspaces: surfaceResult.workspaces.length ? surfaceResult.workspaces : undefined,
    surfaceDiagnostics: surfaceResult.diagnostics.length ? surfaceResult.diagnostics : undefined
  };
}

/**
 * Derive beat injection anchors from classified groups.
 *
 * @param {import("./types").LearnerActivity} modelActivity
 * @param {{ learnMoment: import("./types").CompositionMoment|null, doMoment: import("./types").CompositionMoment|null, checkMoment: import("./types").CompositionMoment|null }} moments
 * @returns {{ learn: string|null, do: string|null, check: string|null }}
 */
/**
 * @param {import("./types").LearnerActivity} modelActivity
 * @param {{ learnBeats: *, doBeats: *, checkBeats: *, splitBeats: * }} groups
 * @returns {import("./types").LearnerBeat|null}
 */
function selectCheckAnchorBeat(modelActivity, groups) {
  var beats = Array.isArray(modelActivity && modelActivity.beats)
    ? modelActivity.beats
    : [];
  for (var i = 0; i < beats.length; i += 1) {
    var beat = beats[i];
    if (groups.splitBeats.indexOf(beat) >= 0) {
      var split = splitBeatDoCheckContent(beat);
      if (split.checkInstructions.length || split.checkMaterials.length) return beat;
    }
    if (groups.checkBeats.indexOf(beat) >= 0) return beat;
  }
  return groups.checkBeats[0] || groups.splitBeats[0] || null;
}

function momentBeatAnchorsFromMoments(modelActivity, moments) {
  var groups = classification.classifyActivityBeats(modelActivity);
  var learnBeat =
    groups.learnBeats.find(function (beat) {
      return String(beat.sourceFunction || "") !== "orientation";
    }) || groups.learnBeats[0] || null;
  var learn = learnBeat ? String(learnBeat.sourceFunction || "") : null;
  var doBeat = groups.doBeats.length ? groups.doBeats[0] : groups.splitBeats[0] || null;
  var checkBeat = selectCheckAnchorBeat(modelActivity, groups);

  if (!doBeat && moments.doMoment) {
    doBeat = findFirstBeatForMomentItems(modelActivity, moments.doMoment);
  }
  if (!checkBeat && moments.checkMoment) {
    checkBeat = findFirstBeatForMomentItems(modelActivity, moments.checkMoment);
  }

  return {
    learn: learn,
    do: doBeat ? String(doBeat.sourceFunction || "") : null,
    check: checkBeat ? String(checkBeat.sourceFunction || "") : null
  };
}

/**
 * @param {import("./types").LearnerActivity} modelActivity
 * @param {import("./types").CompositionMoment} moment
 * @returns {import("./types").LearnerBeat|null}
 */
function findFirstBeatForMomentItems(modelActivity, moment) {
  var beats = Array.isArray(modelActivity && modelActivity.beats) ? modelActivity.beats : [];
  var firstFunction = null;
  (Array.isArray(moment.items) ? moment.items : []).some(function (item) {
    var beatFunction = item && item.sourceRef && item.sourceRef.beatFunction;
    if (beatFunction) {
      firstFunction = String(beatFunction);
      return true;
    }
    return false;
  });
  if (!firstFunction) return null;
  return (
    beats.find(function (beat) {
      return String(beat.sourceFunction || "") === firstFunction;
    }) || null
  );
}

/**
 * Beats fully consumed by composed moments (omit empty beat shells).
 * Only orientation is explicitly omitted; remaining beats rely on suppression hints.
 *
 * @param {import("./types").LearnerActivity} modelActivity
 * @param {{ orientMoment: *, learnMoment: *, doMoment: *, checkMoment: * }} moments
 * @returns {string[]}
 */
function consumedBeatFunctions(modelActivity, moments) {
  var omit = [];
  function collect(moment) {
    if (!moment || !Array.isArray(moment.items)) return;
    moment.items.forEach(function (item) {
      if (item && item.sourceRef && item.sourceRef.beatFunction) {
        omit.push(String(item.sourceRef.beatFunction));
      }
    });
  }
  collect(moments && moments.orientMoment);
  collect(moments && moments.learnMoment);
  collect(moments && moments.doMoment);
  collect(moments && moments.checkMoment);

  var groups = classification.classifyActivityBeats(modelActivity);
  (groups.checkBeats || []).forEach(function (beat) {
    if (beat.learnerRole === "transfer") {
      omit.push(String(beat.sourceFunction || ""));
    }
  });
  return omit.filter(function (value, index, array) {
    return value && array.indexOf(value) === index;
  });
}

module.exports = {
  composeGenericLearnMoment: composeGenericLearnMoment,
  composeGenericDoMoment: composeGenericDoMoment,
  composeGenericCheckMoment: composeGenericCheckMoment,
  momentBeatAnchorsFromMoments: momentBeatAnchorsFromMoments,
  consumedBeatFunctions: consumedBeatFunctions,
  splitBeatDoCheckContent: splitBeatDoCheckContent,
  revealBehaviourForCheckMaterial: revealBehaviourForCheckMaterial,
  learnItemRoleForMaterial: learnItemRoleForMaterial
};
