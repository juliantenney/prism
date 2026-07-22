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
 * @returns {{ doInstructions: import("./types").LearnerInstruction[], checkInstructions: import("./types").LearnerInstruction[], doMaterials: import("./types").LearnerMaterial[], checkMaterials: import("./types").LearnerMaterial[], expectedOutputForDo: import("./types").ExpectedOutputModel|null }}
 */
function splitBeatDoCheckContent(beat) {
  var instructions = Array.isArray(beat.instructions) ? beat.instructions : [];
  var materials = Array.isArray(beat.materials) ? beat.materials : [];
  var doInstructions = [];
  var checkInstructions = [];
  var seenVerify = false;

  instructions.forEach(function (instruction) {
    var intent = classification.classifyInstructionIntent(instruction);
    if (intent === "verify") {
      seenVerify = true;
      checkInstructions.push(instruction);
      return;
    }
    if (intent === "task") {
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
    doInstructions: doInstructions,
    checkInstructions: checkInstructions,
    doMaterials: doMaterials,
    checkMaterials: checkMaterials,
    expectedOutputForDo: doInstructions.length ? beat.expectedOutput : null
  };
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

  instructions.forEach(function (instruction) {
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
  });

  materials.forEach(function (material) {
    items.push({
      kind: "material",
      role: learnItemRoleForMaterial(material),
      material: material,
      reveal: null,
      tableWorkspace: shouldComposeTableWorkspaceMaterial(material),
      sourceRef: sourceRef(activityId, {
        materialId: material.id,
        beatFunction: beatFunction
      })
    });
  });

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
  var items = [];
  var explanatorySteps = [];
  var materials = [];

  (Array.isArray(beats) ? beats : []).forEach(function (beat) {
    var beatItems = buildLearnItemsFromBeatContent(
      activityId,
      beat,
      beat.instructions,
      beat.materials,
      null,
      { includePrompts: false }
    );
    items = items.concat(beatItems);
    (Array.isArray(beat.instructions) ? beat.instructions : []).forEach(function (instruction) {
      explanatorySteps.push({
        sourceStepNumber: instruction.sourceStepNumber,
        text: String(instruction.text || "").trim()
      });
    });
    materials = materials.concat(beat.materials || []);
  });

  if (!items.length) return null;
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
  var items = [];
  var taskSteps = [];
  var materials = [];
  var expectedOutput = null;

  groups.doBeats.forEach(function (beat) {
    var built = buildDoItemsFromBeatContent(
      activityId,
      beat,
      beat.instructions,
      beat.materials,
      beat.expectedOutput,
      {
        includePrompts: true,
        promptFields: ["argument_structure_hint"]
      }
    );
    items = items.concat(built.items);
    taskSteps = taskSteps.concat(built.taskSteps);
    materials = materials.concat(built.materials);
    if (built.expectedOutput) expectedOutput = built.expectedOutput;
  });

  groups.splitBeats.forEach(function (beat) {
    var split = splitBeatDoCheckContent(beat);
    if (!split.doInstructions.length && !split.doMaterials.length && !split.expectedOutputForDo) {
      return;
    }
    var built = buildDoItemsFromBeatContent(
      activityId,
      beat,
      split.doInstructions,
      split.doMaterials,
      split.expectedOutputForDo,
      {
        includePrompts: true,
        promptFields: ["argument_structure_hint"]
      }
    );
    items = items.concat(built.items);
    taskSteps = taskSteps.concat(built.taskSteps);
    materials = materials.concat(built.materials);
    if (built.expectedOutput) expectedOutput = built.expectedOutput;
  });

  if (!items.length) {
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
    if (!orderingProbe.ok) return null;
  }

  if (!expectedOutput) {
    var checkSourceBeats = groups.checkBeats.concat(groups.splitBeats);
    for (var ci = 0; ci < checkSourceBeats.length; ci += 1) {
      var candidateBeat = checkSourceBeats[ci];
      if (candidateBeat && candidateBeat.expectedOutput) {
        expectedOutput = candidateBeat.expectedOutput;
        items.push({
          kind: "expectedOutput",
          expectedOutput: {
            text: String(candidateBeat.expectedOutput.text || "").trim()
          },
          sourceRef: sourceRef(activityId, {
            sourceField: "expected_output",
            beatFunction: candidateBeat.sourceFunction
          })
        });
        break;
      }
    }
  }

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
