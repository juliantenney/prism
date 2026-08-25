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

function hasAuthoredResponseIntent(modelActivity) {
  var sourceActivity =
    modelActivity && modelActivity.sourceActivity && typeof modelActivity.sourceActivity === "object"
      ? modelActivity.sourceActivity
      : null;
  var learnerTask = String(
    (sourceActivity && sourceActivity.learner_task) || (modelActivity && modelActivity.learnerTask) || ""
  ).trim();
  if (!learnerTask) return false;
  var studyOnlyRe = /^(study|read|review|use the checklist|verify|check the|complete the self-check|complete the checklist|complete the verification)\b/i;
  var responseIntentRe =
    /^(write|explain|justify|record|summari[sz]e|draft|produce|analyse|analyze|identify|compare|evaluate|respond|complete the (?:table|template|prompt set|response))/i;
  var steps = learnerTask
    .split(/\r?\n+/)
    .map(function (line) {
      return String(line || "")
        .replace(/^\s*(?:[-*]|\d+[\.\)])\s*/, "")
        .trim();
    })
    .filter(Boolean);
  for (var i = 0; i < steps.length; i += 1) {
    if (studyOnlyRe.test(steps[i])) continue;
    if (responseIntentRe.test(steps[i])) return true;
  }
  return false;
}

function buildRequiredMaterialRank(modelActivity) {
  var rank = Object.create(null);
  var cursor = 0;
  var source =
    modelActivity &&
    modelActivity.sourceActivity &&
    typeof modelActivity.sourceActivity === "object"
      ? modelActivity.sourceActivity
      : null;
  var required = source && Array.isArray(source.required_materials) ? source.required_materials : [];
  required.forEach(function (row) {
    var id = String((row && row.material_id) || "").trim();
    if (!id || rank[id] != null) return;
    rank[id] = cursor;
    cursor += 1;
  });
  var materials = source && Array.isArray(source.materials) ? source.materials : [];
  materials.forEach(function (row) {
    var id = String((row && row.material_id) || "").trim();
    if (!id || rank[id] != null) return;
    rank[id] = cursor;
    cursor += 1;
  });
  return rank;
}

function sortMaterialsByRequiredOrder(materials, materialRank) {
  return (Array.isArray(materials) ? materials.slice() : []).sort(function (left, right) {
    var leftId = String((left && left.id) || "");
    var rightId = String((right && right.id) || "");
    var leftRank = materialRank[leftId];
    var rightRank = materialRank[rightId];
    var leftKnown = Number.isFinite(leftRank);
    var rightKnown = Number.isFinite(rightRank);
    if (leftKnown && rightKnown) return leftRank - rightRank;
    if (leftKnown) return -1;
    if (rightKnown) return 1;
    return leftId.localeCompare(rightId);
  });
}

function sortCheckMaterialsByPriorityAndOrder(materials, materialRank) {
  return (Array.isArray(materials) ? materials.slice() : []).sort(function (left, right) {
    var priorityDelta = checkMaterialPriority(left) - checkMaterialPriority(right);
    if (priorityDelta) return priorityDelta;
    var leftId = String((left && left.id) || "");
    var rightId = String((right && right.id) || "");
    var leftRank = materialRank[leftId];
    var rightRank = materialRank[rightId];
    var leftKnown = Number.isFinite(leftRank);
    var rightKnown = Number.isFinite(rightRank);
    if (leftKnown && rightKnown) return leftRank - rightRank;
    if (leftKnown) return -1;
    if (rightKnown) return 1;
    return leftId.localeCompare(rightId);
  });
}

function checkMaterialPriority(material) {
  var type = String((material && material.type) || "").trim();
  if (type === "checklist") return 1;
  if (type === "sample_output") return 2;
  if (type === "consolidation_summary") return 3;
  if (type === "transfer_prompt") return 4;
  return 5;
}

function checkInstructionGroupCount(materials) {
  var hasSampleOutput = false;
  var hasVerifyBundle = false;
  (Array.isArray(materials) ? materials : []).forEach(function (material) {
    var type = String((material && material.type) || "").trim();
    if (type === "sample_output") hasSampleOutput = true;
    if (type === "checklist") hasVerifyBundle = true;
  });
  var count = 0;
  if (hasSampleOutput) count += 1;
  if (hasVerifyBundle) count += 1;
  return count;
}

function instructionCheckSurfaceAffinity(instruction) {
  var text = String((instruction && instruction.text) || "").toLowerCase();
  if (!text) return "";
  if (/sample output|example response/.test(text)) return "sample_output";
  if (/checklist|self-check|self check|verify|revision|revise/.test(text)) return "checklist";
  return "";
}

function instructionSurfaceAffinity(instruction) {
  var text = String((instruction && instruction.text) || "").toLowerCase();
  if (!text) return "";
  var checkAffinity = instructionCheckSurfaceAffinity(instruction);
  if (checkAffinity) return checkAffinity;
  if (/worked example|worked judgement/.test(text)) return "worked_example";
  if (/scenario|case-study|case study/.test(text)) return "scenario";
  return "";
}

function materialSurfaceAffinity(material) {
  var type = String((material && material.type) || "").trim();
  if (
    type === "sample_output" ||
    type === "checklist" ||
    type === "consolidation_summary" ||
    type === "transfer_prompt"
  ) {
    return type;
  }
  return "";
}

function isTransferMaterialType(type) {
  return type === "transfer_prompt" || type === "consolidation_summary";
}

/** S78-T-055: non-transfer host vessels for ### Page learner-resource closure are Study-tips transport, not Transfer moment content. */
function isPageLearnerResourceClosureHostMaterial(material) {
  var type = String((material && material.type) || "").trim();
  if (type === "transfer_prompt") return false;
  var body = String((material && material.body) || "");
  return /###\s*Page learner-resource closure/i.test(body);
}

function transferMaterialPriority(material) {
  var type = String((material && material.type) || "").trim();
  if (type === "consolidation_summary") return 1;
  if (type === "transfer_prompt") return 2;
  return 3;
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
  var checkCandidates = [];
  var diagnostics = [];

  instructions.forEach(function (instruction, index) {
    var placement = classification.classifyInstructionPlacement(instruction);
    var stepNumber = Number(instruction && instruction.sourceStepNumber);
    var entry = {
      instruction: instruction,
      placement: placement,
      index: index,
      sourceStepNumber: Number.isFinite(stepNumber) ? stepNumber : index + 1
    };
    var affinity = instructionSurfaceAffinity(instruction);
    if (
      placement === "check" ||
      affinity === "sample_output" ||
      affinity === "checklist" ||
      affinity === "consolidation_summary" ||
      affinity === "transfer_prompt"
    ) {
      checkInstructions.push(entry);
      checkCandidates.push(entry);
      return;
    }
    if (
      placement === "learn" &&
      affinity !== "transfer_prompt" &&
      affinity !== "consolidation_summary"
    ) {
      learnInstructions.push(entry);
      return;
    }
    if (placement === "do" || placement === "neutral" || placement === "learn") {
      doInstructions.push(entry);
      checkCandidates.push(entry);
      return;
    }
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

  if (checkMaterials.length) {
    checkMaterials.sort(function (left, right) {
      return checkMaterialPriority(left) - checkMaterialPriority(right);
    });
    var desiredCheckInstructions = Math.max(
      checkInstructions.length,
      checkInstructionGroupCount(checkMaterials)
    );
    if (desiredCheckInstructions > checkInstructions.length) {
      var already = Object.create(null);
      checkInstructions.forEach(function (entry) {
        already[String(entry.index)] = true;
      });
      var extras = checkCandidates
        .filter(function (entry) {
          return !already[String(entry.index)];
        })
        .sort(function (left, right) {
          return right.sourceStepNumber - left.sourceStepNumber;
        });
      while (checkInstructions.length < desiredCheckInstructions && extras.length) {
        var moved = extras.shift();
        checkInstructions.push(moved);
        doInstructions = doInstructions.filter(function (entry) {
          return entry.index !== moved.index;
        });
        diagnostics.push({
          code: "MOMENT_ASSOC_REASSIGNED_TO_CHECK",
          source_step_number: moved.sourceStepNumber,
          beat_function: String((beat && beat.sourceFunction) || ""),
          reason: "check_material_coverage"
        });
      }
    }
  }

  checkInstructions.sort(function (left, right) {
    return left.sourceStepNumber - right.sourceStepNumber;
  });
  doInstructions.sort(function (left, right) {
    return left.sourceStepNumber - right.sourceStepNumber;
  });
  learnInstructions.sort(function (left, right) {
    return left.sourceStepNumber - right.sourceStepNumber;
  });

  if (checkMaterials.length > checkInstructions.length) {
    diagnostics.push({
      code: "MOMENT_ASSOC_UNPAIRED_CHECK_MATERIAL",
      beat_function: String((beat && beat.sourceFunction) || ""),
      material_count: checkMaterials.length,
      instruction_count: checkInstructions.length
    });
  }
  if (doInstructions.length > doMaterials.length + 1) {
    diagnostics.push({
      code: "MOMENT_ASSOC_UNPAIRED_DO_INSTRUCTION",
      beat_function: String((beat && beat.sourceFunction) || ""),
      instruction_count: doInstructions.length,
      material_count: doMaterials.length
    });
  }

  var remainingCheckInstructions = checkInstructions.slice();
  var checkPairs = checkMaterials.map(function (material) {
    var materialAffinity = materialSurfaceAffinity(material);
    var instructionIndex = -1;
    if (materialAffinity) {
      instructionIndex = remainingCheckInstructions.findIndex(function (entry) {
        return instructionSurfaceAffinity(entry.instruction) === materialAffinity;
      });
    }
    var instructionEntry =
      instructionIndex >= 0 ? remainingCheckInstructions.splice(instructionIndex, 1)[0] : null;
    if (!instructionEntry) {
      diagnostics.push({
        code: "MOMENT_ASSOC_UNPAIRED_CHECK_MATERIAL",
        beat_function: String((beat && beat.sourceFunction) || ""),
        material_id: String((material && material.id) || ""),
        material_type: String((material && material.type) || "")
      });
    }
    return {
      instruction: instructionEntry ? instructionEntry.instruction : null,
      material: material
    };
  });

  remainingCheckInstructions.forEach(function (entry) {
    diagnostics.push({
      code: "MOMENT_ASSOC_UNPAIRED_CHECK_INSTRUCTION",
      beat_function: String((beat && beat.sourceFunction) || ""),
      source_step_number: entry.sourceStepNumber
    });
    doInstructions = doInstructions.filter(function (candidate) {
      return candidate.index !== entry.index;
    });
  });

  return {
    learnInstructions: learnInstructions.map(function (entry) {
      return entry.instruction;
    }),
    doInstructions: doInstructions.map(function (entry) {
      return entry.instruction;
    }),
    checkInstructions: checkInstructions.map(function (entry) {
      return entry.instruction;
    }),
    doMaterials: doMaterials,
    checkMaterials: checkMaterials,
    checkPairs: checkPairs,
    expectedOutputForDo: doInstructions.length ? beat.expectedOutput : null,
    diagnostics: diagnostics
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
    var affinity = instructionSurfaceAffinity(instruction);
    if (placement !== "learn" && placement !== "neutral") return;
    if (
      affinity === "sample_output" ||
      affinity === "checklist" ||
      affinity === "transfer_prompt" ||
      affinity === "consolidation_summary"
    ) {
      return;
    }
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

  // Learn-classified steps may be allocated onto do/split beats when the
  // archetype assigns take:"rest" to independent_performance. Pull those
  // study instructions back beside Learn materials so beat↔task association
  // is preserved (definitive owner: compose-generic-moments Learn path).
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

function collectLearnMaterialEntries(modelActivity, groups) {
  var materialRank = buildRequiredMaterialRank(modelActivity);
  var entries = [];
  (Array.isArray(groups.learnBeats) ? groups.learnBeats : []).forEach(function (beat) {
    sortMaterialsByRequiredOrder(beat.materials, materialRank).forEach(function (material) {
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
  var materialEntries = collectLearnMaterialEntries(modelActivity, groups);
  if (instructionEntries.length > materialEntries.length && materialEntries.length) {
    // Cross-beat learn instructions only annotate available learn materials.
    instructionEntries = instructionEntries.slice(0, materialEntries.length);
  }
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
  var authoredResponseIntent = hasAuthoredResponseIntent(modelActivity);
  var materialRank = buildRequiredMaterialRank(modelActivity);
  var groups = classification.classifyActivityBeats(modelActivity);
  var instructionEntries = [];
  var materialEntries = [];
  var expectedOutput = null;
  var promptItems = [];
  var seenSteps = Object.create(null);
  var associationDiagnostics = [];

  function pushDoInstruction(instruction, beatFunction) {
    var stepNumber = Number(instruction && instruction.sourceStepNumber);
    if (!Number.isFinite(stepNumber) || seenSteps[stepNumber]) return;
    var placement = classification.classifyInstructionPlacement(instruction);
    var affinity = instructionSurfaceAffinity(instruction);
    var beatMoment = classification.SOURCE_FUNCTION_MOMENT_MAP[String(beatFunction || "").trim()] || "";
    var doOwnedBeat = beatMoment === "do";
    var text = String((instruction && instruction.text) || "");
    if (/\btransfer\b|\bconsolidation\b|key takeaways/i.test(text)) return;
    if (placement === "check") return;
    // Learn-classified steps belong in the Learn moment (see
    // collectLearnInstructionEntries), even when archetype allocation parked
    // them on a do-owned beat. Do not re-aggregate them under "Your task".
    if (placement === "learn") return;
    if (affinity && placement !== "do" && !doOwnedBeat) return;
    if (placement !== "do" && placement !== "neutral") {
      return;
    }
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
    sortMaterialsByRequiredOrder(beat.materials, materialRank).forEach(function (material) {
      pushDoMaterial(material, beat.sourceFunction);
    });
    if (beat.expectedOutput) expectedOutput = beat.expectedOutput;
    collectPromptsFromBeat(beat);
  });

  groups.splitBeats.forEach(function (beat) {
    var split = splitBeatDoCheckContent(beat);
    associationDiagnostics = associationDiagnostics.concat(split.diagnostics || []);
    split.doInstructions.forEach(function (instruction) {
      pushDoInstruction(instruction, beat.sourceFunction);
    });
    sortMaterialsByRequiredOrder(split.doMaterials, materialRank).forEach(function (material) {
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

  if (!expectedOutput) {
    var hasDoSignal =
      instructionEntries.length > 0 ||
      materialEntries.length > 0 ||
      promptItems.length > 0 ||
      authoredResponseIntent;
    if (hasDoSignal) {
      var checkSourceBeats = groups.checkBeats.concat(groups.splitBeats);
      for (var ci = 0; ci < checkSourceBeats.length; ci += 1) {
        var candidateBeat = checkSourceBeats[ci];
        if (candidateBeat && candidateBeat.expectedOutput) {
          expectedOutput = candidateBeat.expectedOutput;
          break;
        }
      }
    }
  }
  if (!expectedOutput && authoredResponseIntent) {
    var sourceExpectedOutput = String(
      (modelActivity &&
        modelActivity.sourceActivity &&
        modelActivity.sourceActivity.expected_output) ||
        ""
    ).trim();
    if (sourceExpectedOutput) {
      expectedOutput = { text: sourceExpectedOutput };
    }
  }
  if (!items.length && !promptItems.length) {
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

  // Ownership order: authored instruction/material sequence → expected output → structure hint.
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

  items = items.concat(promptItems);

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
    surfaceDiagnostics: surfaceResult.diagnostics.length ? surfaceResult.diagnostics : undefined,
    associationDiagnostics: associationDiagnostics.length ? associationDiagnostics : undefined
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

function buildCheckPairsFromInstructionEntries(instructionEntries, materialEntries, diagnostics) {
  var remainingInstructions = Array.isArray(instructionEntries) ? instructionEntries.slice() : [];
  var pairs = [];
  (Array.isArray(materialEntries) ? materialEntries : []).forEach(function (materialEntry) {
    var material = materialEntry.material;
    var beatFunction = String(materialEntry.beatFunction || "");
    var materialAffinity = materialSurfaceAffinity(material);
    var instructionIndex = -1;
    if (materialAffinity) {
      instructionIndex = remainingInstructions.findIndex(function (entry) {
        return instructionSurfaceAffinity(entry.instruction) === materialAffinity;
      });
    }
    var instructionEntry =
      instructionIndex >= 0 ? remainingInstructions.splice(instructionIndex, 1)[0] : null;
    if (!instructionEntry) {
      if (Array.isArray(diagnostics)) {
        diagnostics.push({
          code: "MOMENT_ASSOC_UNPAIRED_CHECK_MATERIAL",
          beat_function: beatFunction,
          material_id: String((material && material.id) || ""),
          material_type: String((material && material.type) || "")
        });
      }
    }
    pairs.push({
      instruction: instructionEntry ? instructionEntry.instruction : null,
      instructionBeatFunction: instructionEntry
        ? String(instructionEntry.beatFunction || "")
        : "",
      material: material,
      materialBeatFunction: beatFunction
    });
  });
  remainingInstructions.forEach(function (entry) {
    if (Array.isArray(diagnostics)) {
      diagnostics.push({
        code: "MOMENT_ASSOC_UNPAIRED_CHECK_INSTRUCTION",
        beat_function: String(entry.beatFunction || ""),
        source_step_number: Number(entry.instruction && entry.instruction.sourceStepNumber)
      });
    }
  });
  return pairs;
}

/**
 * Collect check-surface instructions and materials across split + check beats.
 * Task steps often land on independent_performance while check materials sit on
 * verification/reflection; pairing must span those beats.
 *
 * @param {import("./types").LearnerActivity} modelActivity
 * @param {{ learnBeats: *, doBeats: *, checkBeats: *, splitBeats: * }} groups
 * @param {Object.<string, number>} materialRank
 * @returns {{
 *   instructionEntries: { instruction: import("./types").LearnerInstruction, beatFunction: string }[],
 *   materialEntries: { material: import("./types").LearnerMaterial, beatFunction: string }[],
 *   diagnostics: Object[]
 * }}
 */
function collectActivityCheckAssociation(modelActivity, groups, materialRank) {
  var instructionEntries = [];
  var materialEntries = [];
  var seenSteps = Object.create(null);
  var seenMaterialIds = Object.create(null);
  var diagnostics = [];

  function pushInstruction(instruction, beatFunction) {
    var stepNumber = Number(instruction && instruction.sourceStepNumber);
    if (!Number.isFinite(stepNumber) || seenSteps[stepNumber]) return;
    seenSteps[stepNumber] = true;
    instructionEntries.push({
      instruction: instruction,
      beatFunction: String(beatFunction || "")
    });
  }

  function pushMaterial(material, beatFunction) {
    var materialId = String((material && material.id) || "");
    if (!materialId || seenMaterialIds[materialId]) return;
    if (isTransferMaterialType(String((material && material.type) || "").trim())) return;
    seenMaterialIds[materialId] = true;
    materialEntries.push({
      material: material,
      beatFunction: String(beatFunction || "")
    });
  }

  (Array.isArray(groups.splitBeats) ? groups.splitBeats : []).forEach(function (beat) {
    var split = splitBeatDoCheckContent(beat);
    diagnostics = diagnostics.concat(split.diagnostics || []);
    split.checkInstructions.forEach(function (instruction) {
      pushInstruction(instruction, beat.sourceFunction);
    });
    split.checkMaterials.forEach(function (material) {
      pushMaterial(material, beat.sourceFunction);
    });
  });

  (Array.isArray(groups.checkBeats) ? groups.checkBeats : []).forEach(function (beat) {
    sortCheckMaterialsByPriorityAndOrder(beat.materials, materialRank).forEach(function (material) {
      pushMaterial(material, beat.sourceFunction);
    });
  });

  (Array.isArray(modelActivity.beats) ? modelActivity.beats : []).forEach(function (beat) {
    (Array.isArray(beat.instructions) ? beat.instructions : []).forEach(function (instruction) {
      var placement = classification.classifyInstructionPlacement(instruction);
      var affinity = instructionSurfaceAffinity(instruction);
      if (placement === "check" || affinity === "sample_output" || affinity === "checklist") {
        pushInstruction(instruction, beat.sourceFunction);
      }
    });
  });

  instructionEntries.sort(function (left, right) {
    return (
      Number(left.instruction.sourceStepNumber) - Number(right.instruction.sourceStepNumber)
    );
  });

  var orderedMaterials = sortCheckMaterialsByPriorityAndOrder(
    materialEntries.map(function (entry) {
      return entry.material;
    }),
    materialRank
  );
  materialEntries = orderedMaterials.map(function (material) {
    var source = materialEntries.find(function (entry) {
      return String((entry.material && entry.material.id) || "") === String(material.id || "");
    });
    return source || { material: material, beatFunction: "" };
  });

  return {
    instructionEntries: instructionEntries,
    materialEntries: materialEntries,
    diagnostics: diagnostics
  };
}

function collectActivityTransferAssociation(modelActivity, groups, materialRank) {
  var beats = Array.isArray(modelActivity && modelActivity.beats) ? modelActivity.beats : [];
  var instructionEntries = [];
  var materialEntries = [];
  var seenSteps = Object.create(null);
  var seenMaterialIds = Object.create(null);
  var transferPromptText = "";

  function pushInstruction(instruction, beatFunction) {
    var stepNumber = Number(instruction && instruction.sourceStepNumber);
    if (!Number.isFinite(stepNumber) || seenSteps[stepNumber]) return;
    seenSteps[stepNumber] = true;
    instructionEntries.push({
      instruction: instruction,
      beatFunction: String(beatFunction || "")
    });
  }

  function pushMaterial(material, beatFunction) {
    var materialId = String((material && material.id) || "");
    if (!materialId || seenMaterialIds[materialId]) return;
    seenMaterialIds[materialId] = true;
    materialEntries.push({
      material: material,
      beatFunction: String(beatFunction || "")
    });
  }

  beats.forEach(function (beat) {
    var beatFunction = String((beat && beat.sourceFunction) || "");
    (Array.isArray(beat.prompts) ? beat.prompts : []).forEach(function (prompt) {
      var field = String((prompt && prompt.sourceField) || "").trim();
      var text = String((prompt && prompt.text) || "").trim();
      if (!text) return;
      if (field === "transfer_or_application_task" && !transferPromptText) {
        transferPromptText = text;
      }
    });
    (Array.isArray(beat.instructions) ? beat.instructions : []).forEach(function (instruction) {
      var affinity = instructionSurfaceAffinity(instruction);
      if (affinity === "transfer_prompt" || affinity === "consolidation_summary") {
        pushInstruction(instruction, beatFunction);
      }
    });
    sortMaterialsByRequiredOrder(beat.materials, materialRank).forEach(function (material) {
      var type = String((material && material.type) || "").trim();
      if (!isTransferMaterialType(type)) return;
      // Closure host vessels are transported to Study tips; do not also render them under Transfer.
      if (isPageLearnerResourceClosureHostMaterial(material)) return;
      pushMaterial(material, beatFunction);
    });
  });

  instructionEntries.sort(function (left, right) {
    return Number(left.instruction.sourceStepNumber) - Number(right.instruction.sourceStepNumber);
  });
  materialEntries.sort(function (left, right) {
    var priorityDelta = transferMaterialPriority(left.material) - transferMaterialPriority(right.material);
    if (priorityDelta) return priorityDelta;
    var leftId = String((left.material && left.material.id) || "");
    var rightId = String((right.material && right.material.id) || "");
    var leftRank = materialRank[leftId];
    var rightRank = materialRank[rightId];
    var leftKnown = Number.isFinite(leftRank);
    var rightKnown = Number.isFinite(rightRank);
    if (leftKnown && rightKnown) return leftRank - rightRank;
    if (leftKnown) return -1;
    if (rightKnown) return 1;
    return leftId.localeCompare(rightId);
  });

  return {
    instructionEntries: instructionEntries,
    materialEntries: materialEntries,
    transferPromptText: transferPromptText
  };
}

function buildCheckItemsFromPairs(activityId, beatFunction, pairs) {
  var items = [];
  var resolvedBeatFunction = String(beatFunction || "");
  (Array.isArray(pairs) ? pairs : []).forEach(function (pair) {
    var instruction = pair && pair.instruction ? pair.instruction : null;
    var material = pair && pair.material ? pair.material : null;
    var instructionBeatFunction = String(
      (pair && pair.instructionBeatFunction) || resolvedBeatFunction
    );
    var materialBeatFunction = String(
      (pair && pair.materialBeatFunction) ||
        (pair && pair.beatFunction) ||
        resolvedBeatFunction
    );
    if (instruction) {
      items.push({
        kind: "instruction",
        instruction: {
          sourceStepNumber: instruction.sourceStepNumber,
          text: String(instruction.text || "").trim()
        },
        sourceRef: sourceRef(activityId, {
          sourceStepNumber: instruction.sourceStepNumber,
          beatFunction: instructionBeatFunction
        })
      });
    }
    if (material) {
      items.push({
        kind: "material",
        material: material,
        reveal: revealBehaviourForCheckMaterial(material),
        sourceRef: sourceRef(activityId, {
          materialId: material.id,
          beatFunction: materialBeatFunction
        })
      });
    }
  });
  return items;
}

/**
 * @param {import("./types").LearnerActivity} modelActivity
 * @returns {import("./types").CompositionMoment|null}
 */
function composeGenericCheckMoment(modelActivity) {
  var activityId = String((modelActivity && modelActivity.id) || "").trim();
  var materialRank = buildRequiredMaterialRank(modelActivity);
  var groups = classification.classifyActivityBeats(modelActivity);
  var beats = Array.isArray(modelActivity && modelActivity.beats) ? modelActivity.beats : [];
  var association = collectActivityCheckAssociation(modelActivity, groups, materialRank);
  var associationDiagnostics = association.diagnostics.slice();
  var checkPairs = buildCheckPairsFromInstructionEntries(
    association.instructionEntries,
    association.materialEntries,
    associationDiagnostics
  );
  var checkAnchorBeat = selectCheckAnchorBeat(modelActivity, groups);
  var anchorBeatFunction = checkAnchorBeat
    ? String(checkAnchorBeat.sourceFunction || "")
    : "";
  var items = buildCheckItemsFromPairs(activityId, anchorBeatFunction, checkPairs);
  var checkingSteps = [];
  var materials = [];
  checkPairs.forEach(function (pair) {
    if (!pair || !pair.material) return;
    materials.push(pair.material);
    if (!pair.instruction) return;
    checkingSteps.push({
      sourceStepNumber: pair.instruction.sourceStepNumber,
      text: String(pair.instruction.text || "").trim()
    });
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
    surfaceDiagnostics: surfaceResult.diagnostics.length ? surfaceResult.diagnostics : undefined,
    associationDiagnostics: associationDiagnostics.length ? associationDiagnostics : undefined
  };
}

function composeGenericTransferMoment(modelActivity) {
  var activityId = String((modelActivity && modelActivity.id) || "").trim();
  var materialRank = buildRequiredMaterialRank(modelActivity);
  var groups = classification.classifyActivityBeats(modelActivity);
  var association = collectActivityTransferAssociation(modelActivity, groups, materialRank);
  var instructionEntries = association.instructionEntries;
  var materialEntries = association.materialEntries;
  var transferPromptText = String(association.transferPromptText || "").trim();
  var checkAnchorBeat = selectCheckAnchorBeat(modelActivity, groups);
  var anchorBeatFunction = checkAnchorBeat ? String(checkAnchorBeat.sourceFunction || "") : "";

  var transferPairs = buildCheckPairsFromInstructionEntries(instructionEntries, materialEntries, []);
  var items = buildCheckItemsFromPairs(activityId, anchorBeatFunction, transferPairs);

  var hasTransferPromptMaterial = materialEntries.some(function (entry) {
    return String((entry.material && entry.material.type) || "") === "transfer_prompt";
  });
  if (transferPromptText && !hasTransferPromptMaterial) {
    items.push({
      kind: "prompt",
      prompt: {
        sourceField: "transfer_or_application_task",
        text: transferPromptText
      },
      sourceRef: sourceRef(activityId, {
        sourceField: "transfer_or_application_task",
        beatFunction: anchorBeatFunction
      })
    });
  }

  if (!items.length) return null;

  var transferSteps = instructionEntries.map(function (entry) {
    return {
      sourceStepNumber: entry.instruction.sourceStepNumber,
      text: String(entry.instruction.text || "").trim()
    };
  });
  var transferMaterials = materialEntries.map(function (entry) {
    return entry.material;
  });

  var surfaceResult = composeLearnerSurfaces({
    activityId: activityId,
    modelActivity: modelActivity,
    momentKind: "transfer",
    items: items,
    taskSteps: transferSteps,
    expectedOutput: null
  });

  return {
    kind: "transfer",
    items: items,
    checkingSteps: transferSteps,
    materials: transferMaterials,
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
  composeGenericTransferMoment: composeGenericTransferMoment,
  momentBeatAnchorsFromMoments: momentBeatAnchorsFromMoments,
  consumedBeatFunctions: consumedBeatFunctions,
  splitBeatDoCheckContent: splitBeatDoCheckContent,
  revealBehaviourForCheckMaterial: revealBehaviourForCheckMaterial,
  learnItemRoleForMaterial: learnItemRoleForMaterial
};
