"use strict";

var ENTRY_PROMPT_FIELDS =
  require("./build-beat-content-sequence").ENTRY_PROMPT_FIELDS;
var determineWorkspaceRequirement =
  require("./compose-workspace").determineWorkspaceRequirement;
var determineWorkspaceRequirements =
  require("./compose-workspace").determineWorkspaceRequirements;
var shouldComposeTableWorkspaceMaterial =
  require("./completion-table-workspace").shouldComposeTableWorkspaceMaterial;

var A1_DO_STEP_NUMBERS = Object.freeze([2, 5]);
var A1_DO_MATERIAL_IDS = Object.freeze(["A1-M2"]);
var A1_CHECK_STEP_NUMBERS = Object.freeze([3, 4]);
var A1_CHECK_MATERIAL_IDS = Object.freeze(["A1-M3", "A1-M4"]);
var A1_LEARN_STEP_NUMBERS = Object.freeze([1]);
var A1_LEARN_MATERIAL_IDS = Object.freeze(["A1-M1"]);
var A1_CHECK_BEAT_FUNCTION = "check_understanding";
var A1_DO_BEAT_FUNCTION = A1_CHECK_BEAT_FUNCTION;
var A1_LEARN_BEAT_FUNCTION = "explanation";

var A2_LEARN_STEP_NUMBERS = Object.freeze([1]);
var A2_LEARN_MATERIAL_IDS = Object.freeze(["A2-M1"]);
var A2_LEARN_BEAT_FUNCTION = "worked_example";
var A2_DO_STEP_NUMBERS = Object.freeze([2, 3, 4]);
var A2_DO_MATERIAL_IDS_BY_STEP = Object.freeze({
  2: Object.freeze(["A2-M3"]),
  3: Object.freeze(["A2-M2"])
});
var A2_DO_BEAT_FUNCTION = "analysis";
var A2_CHECK_STEP_NUMBERS = Object.freeze([5]);
var A2_CHECK_MATERIAL_IDS = Object.freeze(["A2-M4"]);
var A2_CHECK_BEAT_FUNCTION = "check_understanding";

var A3_LEARN_STEP_NUMBERS = Object.freeze([1, 2]);
var A3_LEARN_MATERIAL_IDS = Object.freeze(["A3-M1"]);
var A3_LEARN_BEAT_FUNCTION = "worked_example";
var A3_DO_STEP_NUMBERS = Object.freeze([3, 4]);
var A3_DO_MATERIAL_IDS_BY_STEP = Object.freeze({
  3: Object.freeze(["A3-M2"]),
  4: Object.freeze(["A3-M3"])
});
var A3_DO_BEAT_FUNCTION = "practice";
var A3_CHECK_STEP_NUMBERS = Object.freeze([5]);
var A3_CHECK_MATERIAL_IDS = Object.freeze(["A3-M4"]);
var A3_CHECK_BEAT_FUNCTION = "practice";
var A3_TRANSFER_PROMPT_BEAT = "reflection";

var A4_LEARN_STEP_NUMBERS = Object.freeze([1, 2]);
var A4_LEARN_MATERIAL_IDS_BY_STEP = Object.freeze({
  1: Object.freeze(["A4-M1"]),
  2: Object.freeze(["A4-M2"])
});
var A4_LEARN_BEAT_FUNCTION = "explanation";
var A4_DO_STEP_NUMBERS = Object.freeze([3]);
var A4_DO_MATERIAL_IDS_BY_STEP = Object.freeze({
  3: Object.freeze(["A4-M3"])
});
var A4_DO_BEAT_FUNCTION = "application";
var A4_CHECK_STEP_NUMBERS = Object.freeze([4]);
var A4_CHECK_MATERIAL_IDS = Object.freeze(["A4-M4"]);
var A4_CHECK_BEAT_FUNCTION = "check_understanding";
var A4_WORKSPACE_STEP_NUMBER = 3;

var A5_LEARN_BEAT_CONFIGS = Object.freeze([
  Object.freeze({
    beatFunction: "orientation",
    stepNumbers: Object.freeze([1]),
    materialIdsByStep: Object.freeze({ 1: Object.freeze(["A5-M1"]) })
  }),
  Object.freeze({
    beatFunction: "comparison",
    stepNumbers: Object.freeze([2]),
    materialIdsByStep: Object.freeze({ 2: Object.freeze(["A5-M2", "A5-M3"]) })
  })
]);
var A5_DO_STEP_NUMBERS = Object.freeze([3, 4]);
var A5_DO_MATERIAL_IDS_BY_STEP = Object.freeze({
  3: Object.freeze(["A5-M4"]),
  4: Object.freeze(["A5-M5"])
});
var A5_DO_BEAT_FUNCTION = "evaluation";
var A5_DO_PROMPT_FIELDS = Object.freeze(["argument_structure_hint"]);
var A5_WORKSPACE_STEP_NUMBERS = Object.freeze([4]);
var A5_CHECK_BEAT_CONFIGS = Object.freeze([
  Object.freeze({
    beatFunction: "evaluation",
    stepNumbers: Object.freeze([5]),
    materialIdsByStep: Object.freeze({ 5: Object.freeze(["A5-M6"]) })
  }),
  Object.freeze({
    beatFunction: "reflection",
    stepNumbers: Object.freeze([6]),
    materialIdsByStep: Object.freeze({ 6: Object.freeze(["A5-M8", "A5-M7"]) })
  })
]);
var A5_CHECK_BEAT_FUNCTION = "evaluation";
var A5_LEARN_INJECTION_BEAT = "comparison";
var A5_OMIT_BEAT_FUNCTIONS = Object.freeze(["reflection"]);

var mergeBeatSuppressionEntry =
  require("./compose-beat-suppression").mergeBeatSuppressionEntry;

function sourceRef(activityId, details) {
  return Object.assign({ activityId: String(activityId || "") }, details || {});
}

function pushTextItem(items, role, text, sourceRefValue) {
  var value = String(text || "").trim();
  if (!value) return;
  items.push({
    kind: "compositionText",
    role: role,
    text: value,
    sourceRef: sourceRefValue
  });
}

function findBeatByFunction(modelActivity, sourceFunction) {
  var beats = Array.isArray(modelActivity && modelActivity.beats)
    ? modelActivity.beats
    : [];
  for (var i = 0; i < beats.length; i += 1) {
    if (String(beats[i].sourceFunction || "") === sourceFunction) return beats[i];
  }
  return null;
}

function findOrientationEntryPrompt(modelActivity) {
  var beat = findBeatByFunction(modelActivity, "orientation");
  if (!beat) return null;
  var prompts = Array.isArray(beat.prompts) ? beat.prompts : [];
  for (var j = 0; j < prompts.length; j += 1) {
    var prompt = prompts[j];
    var field = String((prompt && prompt.sourceField) || "").trim();
    if (ENTRY_PROMPT_FIELDS[field] && String(prompt.text || "").trim()) {
      return prompt;
    }
  }
  return null;
}

/**
 * Beat injection anchors for composed moment rendering per activity.
 *
 * @param {string} activityId
 * @returns {{ learn: string, do: string, check: string }|null}
 */
function momentBeatAnchorsForActivity(activityId) {
  var id = String(activityId || "").trim();
  if (id === "A1") {
    return {
      learn: A1_LEARN_BEAT_FUNCTION,
      do: A1_DO_BEAT_FUNCTION,
      check: A1_CHECK_BEAT_FUNCTION
    };
  }
  if (id === "A2") {
    return {
      learn: A2_LEARN_BEAT_FUNCTION,
      do: A2_DO_BEAT_FUNCTION,
      check: A2_CHECK_BEAT_FUNCTION
    };
  }
  if (id === "A3") {
    return {
      learn: A3_LEARN_BEAT_FUNCTION,
      do: A3_DO_BEAT_FUNCTION,
      check: A3_CHECK_BEAT_FUNCTION
    };
  }
  if (id === "A4") {
    return {
      learn: A4_LEARN_BEAT_FUNCTION,
      do: A4_DO_BEAT_FUNCTION,
      check: A4_CHECK_BEAT_FUNCTION
    };
  }
  if (id === "A5") {
    return {
      learn: A5_LEARN_INJECTION_BEAT,
      do: A5_DO_BEAT_FUNCTION,
      check: A5_CHECK_BEAT_FUNCTION
    };
  }
  return null;
}

/**
 * Beat functions fully consumed by composed moments and omitted from beat rendering.
 *
 * @param {string} activityId
 * @returns {string[]}
 */
function activityOmitBeatFunctions(activityId) {
  var id = String(activityId || "").trim();
  if (id === "A3") return ["reflection"];
  if (id === "A5") return A5_OMIT_BEAT_FUNCTIONS.slice();
  return [];
}

/**
 * Compose the Orient moment for one activity from authoritative model + sequence data.
 *
 * @param {import("./types").LearnerActivity} modelActivity
 * @param {{ studyPhaseByActivityId: Object.<string,string>, purposeByActivityId: Object.<string,string> }} sequenceContext
 * @returns {import("./types").CompositionMoment|null}
 */
function composeOrientMoment(modelActivity, sequenceContext) {
  var activityId = String((modelActivity && modelActivity.id) || "").trim();
  if (!activityId) return null;

  var items = [];
  var studyPhase =
    sequenceContext &&
    sequenceContext.studyPhaseByActivityId &&
    sequenceContext.studyPhaseByActivityId[activityId];
  var activityPurpose =
    sequenceContext &&
    sequenceContext.purposeByActivityId &&
    sequenceContext.purposeByActivityId[activityId];

  pushTextItem(items, "studyPhase", studyPhase, sourceRef(activityId, {
    sourceField: "learning_sequence.study_flow.phase",
    sourcePath: "learning_sequence.study_flow"
  }));

  pushTextItem(items, "activityPurpose", activityPurpose, sourceRef(activityId, {
    sourceField: "learning_sequence.timeline.purpose",
    sourcePath: "learning_sequence.timeline"
  }));

  pushTextItem(items, "activity_preamble", modelActivity.preamble, sourceRef(activityId, {
    sourceField: "activity_preamble"
  }));

  pushTextItem(
    items,
    "reasoning_orientation",
    modelActivity.reasoningOrientation,
    sourceRef(activityId, { sourceField: "reasoning_orientation" })
  );

  var entryPrompt = findOrientationEntryPrompt(modelActivity);
  if (entryPrompt && String(entryPrompt.text || "").trim()) {
    items.push({
      kind: "prompt",
      prompt: {
        sourceField: String(entryPrompt.sourceField || "self_explanation_prompt"),
        text: String(entryPrompt.text || "").trim()
      },
      sourceRef: sourceRef(activityId, {
        sourceField: String(entryPrompt.sourceField || "self_explanation_prompt"),
        beatFunction: "orientation"
      })
    });
  }

  if (!items.length) return null;

  return {
    kind: "orient",
    items: items
  };
}

/**
 * Determine semantic role for one Learn moment instruction item.
 *
 * @param {import("./types").LearnerInstruction} instruction
 * @returns {string}
 */
function learnItemRoleForInstruction(instruction) {
  void instruction;
  return "explanation";
}

/**
 * Determine semantic role for one Learn moment material item.
 *
 * @param {import("./types").LearnerMaterial} material
 * @returns {string}
 */
function learnItemRoleForMaterial(material) {
  var materialId = String((material && material.id) || "");
  if (materialId === "A1-M1") return "definition";
  if (materialId === "A4-M1") return "definition";
  var type = String((material && material.type) || "");
  if (type === "worked_example") return "example";
  if (type === "scenario") return "example";
  if (type === "sample_output") return "example";
  return "explanation";
}

/**
 * @param {import("./types").LearnerActivity} modelActivity
 * @param {{ beatFunction: string, stepNumbers: number[], materialIdsByStep: Object.<number,string[]> }} config
 * @returns {import("./types").CompositionMoment|null}
 */
function composeLearnMomentForBeat(modelActivity, config) {
  var activityId = String((modelActivity && modelActivity.id) || "").trim();
  var beat = findBeatByFunction(modelActivity, config.beatFunction);
  if (!beat) return null;

  var items = [];
  var explanatorySteps = [];
  var materials = [];
  var instructions = Array.isArray(beat.instructions) ? beat.instructions : [];
  var beatMaterials = Array.isArray(beat.materials) ? beat.materials : [];
  var materialById = Object.create(null);

  beatMaterials.forEach(function (material) {
    materialById[String(material.id || "")] = material;
  });

  config.stepNumbers.forEach(function (stepNumber) {
    var instruction = instructions.find(function (entry) {
      return Number(entry && entry.sourceStepNumber) === stepNumber;
    });
    if (!instruction) return;

    explanatorySteps.push({
      sourceStepNumber: instruction.sourceStepNumber,
      text: String(instruction.text || "").trim()
    });
    items.push({
      kind: "instruction",
      role: learnItemRoleForInstruction(instruction),
      instruction: {
        sourceStepNumber: instruction.sourceStepNumber,
        text: String(instruction.text || "").trim()
      },
      sourceRef: sourceRef(activityId, {
        sourceStepNumber: instruction.sourceStepNumber,
        beatFunction: config.beatFunction
      })
    });

    var materialIds = config.materialIdsByStep[stepNumber] || [];
    materialIds.forEach(function (materialId) {
      var material = materialById[materialId];
      if (!material) return;
      materials.push(material);
      items.push({
        kind: "material",
        role: learnItemRoleForMaterial(material),
        material: material,
        reveal: null,
        sourceRef: sourceRef(activityId, {
          materialId: material.id,
          beatFunction: config.beatFunction
        })
      });
    });
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
 * Compose Learn from multiple beat configs in authored order.
 *
 * @param {import("./types").LearnerActivity} modelActivity
 * @param {{ beatFunction: string, stepNumbers: number[], materialIdsByStep: Object.<number,string[]> }[]} beatConfigs
 * @returns {import("./types").CompositionMoment|null}
 */
function composeLearnMomentFromBeatConfigs(modelActivity, beatConfigs) {
  var items = [];
  var explanatorySteps = [];
  var materials = [];
  (Array.isArray(beatConfigs) ? beatConfigs : []).forEach(function (config) {
    var moment = composeLearnMomentForBeat(modelActivity, config);
    if (!moment) return;
    items = items.concat(moment.items || []);
    explanatorySteps = explanatorySteps.concat(moment.explanatorySteps || []);
    materials = materials.concat(moment.materials || []);
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
 * Compose the Learn moment from explanation or worked_example beat sources.
 *
 * @param {import("./types").LearnerActivity} modelActivity
 * @returns {import("./types").CompositionMoment|null}
 */
function composeLearnMoment(modelActivity) {
  var activityId = String((modelActivity && modelActivity.id) || "").trim();
  if (activityId === "A1") {
    return composeLearnMomentForBeat(modelActivity, {
      beatFunction: A1_LEARN_BEAT_FUNCTION,
      stepNumbers: A1_LEARN_STEP_NUMBERS,
      materialIdsByStep: { 1: A1_LEARN_MATERIAL_IDS }
    });
  }
  if (activityId === "A2") {
    return composeLearnMomentForBeat(modelActivity, {
      beatFunction: A2_LEARN_BEAT_FUNCTION,
      stepNumbers: A2_LEARN_STEP_NUMBERS,
      materialIdsByStep: { 1: A2_LEARN_MATERIAL_IDS }
    });
  }
  if (activityId === "A3") {
    return composeLearnMomentForBeat(modelActivity, {
      beatFunction: A3_LEARN_BEAT_FUNCTION,
      stepNumbers: A3_LEARN_STEP_NUMBERS,
      materialIdsByStep: { 1: A3_LEARN_MATERIAL_IDS }
    });
  }
  if (activityId === "A4") {
    return composeLearnMomentForBeat(modelActivity, {
      beatFunction: A4_LEARN_BEAT_FUNCTION,
      stepNumbers: A4_LEARN_STEP_NUMBERS,
      materialIdsByStep: A4_LEARN_MATERIAL_IDS_BY_STEP
    });
  }
  if (activityId === "A5") {
    return composeLearnMomentFromBeatConfigs(modelActivity, A5_LEARN_BEAT_CONFIGS);
  }
  return null;
}

function pushPromptsFromBeat(items, taskBeat, promptFields, activityId, beatFunction) {
  var prompts = Array.isArray(taskBeat && taskBeat.prompts) ? taskBeat.prompts : [];
  (Array.isArray(promptFields) ? promptFields : []).forEach(function (fieldName) {
    var prompt = prompts.find(function (entry) {
      return String((entry && entry.sourceField) || "") === String(fieldName || "");
    });
    if (!prompt || !String(prompt.text || "").trim()) return;
    items.push({
      kind: "prompt",
      prompt: {
        sourceField: String(prompt.sourceField || fieldName),
        text: String(prompt.text || "").trim()
      },
      sourceRef: sourceRef(activityId, {
        sourceField: String(prompt.sourceField || fieldName),
        beatFunction: beatFunction
      })
    });
  });
}

/**
 * @param {import("./types").LearnerActivity} modelActivity
 * @param {{ beatFunction: string, checkBeatFunction: string, stepNumbers: number[], materialIdsByStep: Object.<number,string[]>, activityId: string, includeWorkspace?: boolean, workspaceStepNumber?: number, workspaceStepNumbers?: number[], promptFieldsFromBeat?: string[] }} config
 * @returns {import("./types").CompositionMoment|null}
 */
function composeDoMomentForBeat(modelActivity, config) {
  var activityId = String(config.activityId || "");
  var taskBeat = findBeatByFunction(modelActivity, config.beatFunction);
  if (!taskBeat) return null;

  var checkBeat = findBeatByFunction(modelActivity, config.checkBeatFunction);
  var items = [];
  var taskSteps = [];
  var materials = [];
  var instructions = Array.isArray(taskBeat.instructions) ? taskBeat.instructions : [];
  var beatMaterials = Array.isArray(taskBeat.materials) ? taskBeat.materials : [];
  var materialById = Object.create(null);

  beatMaterials.forEach(function (material) {
    materialById[String(material.id || "")] = material;
  });

  pushPromptsFromBeat(
    items,
    taskBeat,
    config.promptFieldsFromBeat,
    activityId,
    config.beatFunction
  );

  config.stepNumbers.forEach(function (stepNumber) {
    var instruction = instructions.find(function (entry) {
      return Number(entry && entry.sourceStepNumber) === stepNumber;
    });
    if (!instruction) return;

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
        beatFunction: config.beatFunction
      })
    });

    var materialIds = config.materialIdsByStep[stepNumber] || [];
    materialIds.forEach(function (materialId) {
      var material = materialById[materialId];
      if (!material) return;
      materials.push(material);
      items.push({
        kind: "material",
        material: material,
        tableWorkspace: shouldComposeTableWorkspaceMaterial(material),
        sourceRef: sourceRef(activityId, {
          materialId: material.id,
          beatFunction: config.beatFunction
        })
      });
    });
  });

  var expectedOutput =
    checkBeat && checkBeat.expectedOutput && String(checkBeat.expectedOutput.text || "").trim()
      ? {
          text: String(checkBeat.expectedOutput.text || "").trim()
        }
      : null;

  if (expectedOutput) {
    items.push({
      kind: "expectedOutput",
      expectedOutput: expectedOutput,
      sourceRef: sourceRef(activityId, {
        sourceField: "expected_output",
        beatFunction: config.checkBeatFunction
      })
    });
  }

  var workspaces = [];
  if (Array.isArray(config.workspaceStepNumbers) && config.workspaceStepNumbers.length) {
    workspaces = determineWorkspaceRequirements(activityId, taskSteps, config.workspaceStepNumbers);
  } else if (config.includeWorkspace) {
    var workspaceStepNumber = Number(config.workspaceStepNumber);
    var taskStep = taskSteps.find(function (step) {
      return Number(step.sourceStepNumber) === workspaceStepNumber;
    });
    var singleWorkspace = determineWorkspaceRequirement(activityId, taskStep || null);
    if (singleWorkspace) workspaces.push(singleWorkspace);
  }

  var workspace = workspaces.length === 1 ? workspaces[0] : workspaces.length ? workspaces[0] : null;

  if (!items.length) return null;

  return {
    kind: "do",
    items: items,
    taskSteps: taskSteps,
    materials: materials,
    expectedOutput: expectedOutput,
    workspace: workspace,
    workspaces: workspaces.length ? workspaces : undefined
  };
}

/**
 * Compose the Do moment from task beat sources.
 *
 * @param {import("./types").LearnerActivity} modelActivity
 * @returns {import("./types").CompositionMoment|null}
 */
function composeDoMoment(modelActivity) {
  var activityId = String((modelActivity && modelActivity.id) || "").trim();
  if (activityId === "A1") {
    return composeDoMomentForBeat(modelActivity, {
      activityId: activityId,
      beatFunction: A1_DO_BEAT_FUNCTION,
      checkBeatFunction: A1_CHECK_BEAT_FUNCTION,
      stepNumbers: A1_DO_STEP_NUMBERS,
      materialIdsByStep: { 2: A1_DO_MATERIAL_IDS },
      includeWorkspace: true,
      workspaceStepNumber: 5
    });
  }
  if (activityId === "A2") {
    return composeDoMomentForBeat(modelActivity, {
      activityId: activityId,
      beatFunction: A2_DO_BEAT_FUNCTION,
      checkBeatFunction: A2_CHECK_BEAT_FUNCTION,
      stepNumbers: A2_DO_STEP_NUMBERS,
      materialIdsByStep: A2_DO_MATERIAL_IDS_BY_STEP,
      includeWorkspace: false
    });
  }
  if (activityId === "A3") {
    return composeDoMomentForBeat(modelActivity, {
      activityId: activityId,
      beatFunction: A3_DO_BEAT_FUNCTION,
      checkBeatFunction: A3_CHECK_BEAT_FUNCTION,
      stepNumbers: A3_DO_STEP_NUMBERS,
      materialIdsByStep: A3_DO_MATERIAL_IDS_BY_STEP,
      includeWorkspace: false
    });
  }
  if (activityId === "A4") {
    return composeDoMomentForBeat(modelActivity, {
      activityId: activityId,
      beatFunction: A4_DO_BEAT_FUNCTION,
      checkBeatFunction: A4_CHECK_BEAT_FUNCTION,
      stepNumbers: A4_DO_STEP_NUMBERS,
      materialIdsByStep: A4_DO_MATERIAL_IDS_BY_STEP,
      includeWorkspace: true,
      workspaceStepNumber: A4_WORKSPACE_STEP_NUMBER
    });
  }
  if (activityId === "A5") {
    return composeDoMomentForBeat(modelActivity, {
      activityId: activityId,
      beatFunction: A5_DO_BEAT_FUNCTION,
      checkBeatFunction: A5_CHECK_BEAT_FUNCTION,
      stepNumbers: A5_DO_STEP_NUMBERS,
      materialIdsByStep: A5_DO_MATERIAL_IDS_BY_STEP,
      promptFieldsFromBeat: A5_DO_PROMPT_FIELDS,
      workspaceStepNumbers: A5_WORKSPACE_STEP_NUMBERS
    });
  }
  return null;
}

/**
 * Determine reveal behaviour for A1 check materials.
 *
 * @param {import("./types").LearnerMaterial} material
 * @returns {import("./types").CompositionReveal|null}
 */
function revealBehaviourForCheckMaterial(material) {
  var materialId = String((material && material.id) || "");
  if (materialId === "A1-M3") {
    return {
      mode: "details",
      defaultOpen: false,
      summary: "Review the example response"
    };
  }
  return null;
}

function findTransferPrompt(modelActivity, beatFunction) {
  var beat = findBeatByFunction(modelActivity, beatFunction);
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
 * @param {import("./types").LearnerActivity} modelActivity
 * @param {{ beatFunction: string, stepNumbers: number[], materialIdsByStep: Object.<number,string[]>, activityId: string, transferPromptBeat?: string }} config
 * @returns {import("./types").CompositionMoment|null}
 */
function composeCheckMomentForBeat(modelActivity, config) {
  var activityId = String(config.activityId || "");
  var checkBeat = findBeatByFunction(modelActivity, config.beatFunction);
  if (!checkBeat) return null;

  var items = [];
  var checkingSteps = [];
  var materials = [];
  var instructions = Array.isArray(checkBeat.instructions) ? checkBeat.instructions : [];
  var beatMaterials = Array.isArray(checkBeat.materials) ? checkBeat.materials : [];
  var materialById = Object.create(null);

  beatMaterials.forEach(function (material) {
    materialById[String(material.id || "")] = material;
  });

  config.stepNumbers.forEach(function (stepNumber) {
    var instruction = instructions.find(function (entry) {
      return Number(entry && entry.sourceStepNumber) === stepNumber;
    });
    if (!instruction) return;

    checkingSteps.push({
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
        beatFunction: config.beatFunction
      })
    });

    var materialIds = config.materialIdsByStep[stepNumber] || [];
    materialIds.forEach(function (materialId) {
      var material = materialById[materialId];
      if (!material) return;
      materials.push(material);
      items.push({
        kind: "material",
        material: material,
        reveal: revealBehaviourForCheckMaterial(material),
        sourceRef: sourceRef(activityId, {
          materialId: material.id,
          beatFunction: config.beatFunction
        })
      });
    });
  });

  if (config.transferPromptBeat) {
    var transferPrompt = findTransferPrompt(modelActivity, config.transferPromptBeat);
    if (transferPrompt && String(transferPrompt.text || "").trim()) {
      items.push({
        kind: "prompt",
        prompt: {
          sourceField: "transfer_or_application_task",
          text: String(transferPrompt.text || "").trim()
        },
        sourceRef: sourceRef(activityId, {
          sourceField: "transfer_or_application_task",
          beatFunction: config.transferPromptBeat
        })
      });
    }
  }

  if (!items.length) return null;

  return {
    kind: "check",
    learnerGuidance:
      "Complete your response first, then use this material to check or improve it.",
    items: items,
    checkingSteps: checkingSteps,
    materials: materials
  };
}

/**
 * Compose Check from multiple beat configs in authored order.
 *
 * @param {import("./types").LearnerActivity} modelActivity
 * @param {{ beatFunction: string, stepNumbers: number[], materialIdsByStep: Object.<number,string[]>, activityId: string, transferPromptBeat?: string }[]} beatConfigs
 * @returns {import("./types").CompositionMoment|null}
 */
function composeCheckMomentFromBeatConfigs(modelActivity, beatConfigs) {
  var activityId = String((modelActivity && modelActivity.id) || "").trim();
  var items = [];
  var checkingSteps = [];
  var materials = [];
  (Array.isArray(beatConfigs) ? beatConfigs : []).forEach(function (config) {
    var moment = composeCheckMomentForBeat(
      modelActivity,
      Object.assign({ activityId: activityId }, config)
    );
    if (!moment) return;
    items = items.concat(moment.items || []);
    checkingSteps = checkingSteps.concat(moment.checkingSteps || []);
    materials = materials.concat(moment.materials || []);
  });
  if (!items.length) return null;
  return {
    kind: "check",
    learnerGuidance:
      "Complete your response first, then use this material to check or improve it.",
    items: items,
    checkingSteps: checkingSteps,
    materials: materials
  };
}

/**
 * Compose the Check moment from check_understanding sources.
 *
 * @param {import("./types").LearnerActivity} modelActivity
 * @returns {import("./types").CompositionMoment|null}
 */
function composeCheckMoment(modelActivity) {
  var activityId = String((modelActivity && modelActivity.id) || "").trim();
  if (activityId === "A1") {
    return composeCheckMomentForBeat(modelActivity, {
      activityId: activityId,
      beatFunction: A1_CHECK_BEAT_FUNCTION,
      stepNumbers: A1_CHECK_STEP_NUMBERS,
      materialIdsByStep: {
        3: ["A1-M3"],
        4: ["A1-M4"]
      }
    });
  }
  if (activityId === "A2") {
    return composeCheckMomentForBeat(modelActivity, {
      activityId: activityId,
      beatFunction: A2_CHECK_BEAT_FUNCTION,
      stepNumbers: A2_CHECK_STEP_NUMBERS,
      materialIdsByStep: {
        5: A2_CHECK_MATERIAL_IDS
      }
    });
  }
  if (activityId === "A3") {
    return composeCheckMomentForBeat(modelActivity, {
      activityId: activityId,
      beatFunction: A3_CHECK_BEAT_FUNCTION,
      stepNumbers: A3_CHECK_STEP_NUMBERS,
      materialIdsByStep: {
        5: A3_CHECK_MATERIAL_IDS
      },
      transferPromptBeat: A3_TRANSFER_PROMPT_BEAT
    });
  }
  if (activityId === "A4") {
    return composeCheckMomentForBeat(modelActivity, {
      activityId: activityId,
      beatFunction: A4_CHECK_BEAT_FUNCTION,
      stepNumbers: A4_CHECK_STEP_NUMBERS,
      materialIdsByStep: {
        4: A4_CHECK_MATERIAL_IDS
      }
    });
  }
  if (activityId === "A5") {
    return composeCheckMomentFromBeatConfigs(modelActivity, A5_CHECK_BEAT_CONFIGS);
  }
  return null;
}

/**
 * @param {import("./types").CompositionMoment} orientMoment
 * @returns {{ suppressFraming: boolean, omitBeatFunctions: string[] }}
 */
function orientRenderHints(orientMoment) {
  if (!orientMoment || !Array.isArray(orientMoment.items) || !orientMoment.items.length) {
    return { suppressFraming: false, omitBeatFunctions: [] };
  }
  return {
    suppressFraming: true,
    omitBeatFunctions: ["orientation"]
  };
}

/**
 * @param {import("./types").CompositionMoment} learnMoment
 * @param {string} beatFunction
 * @returns {{ suppressBeatContent: Object.<string, { omitInstructionSteps: number[], omitMaterialIds: string[], omitExpectedOutput: boolean }> }}
 */
function learnRenderHints(learnMoment, beatFunction) {
  if (
    !learnMoment ||
    learnMoment.kind !== "learn" ||
    !Array.isArray(learnMoment.items) ||
    !learnMoment.items.length
  ) {
    return { suppressBeatContent: Object.create(null) };
  }

  var suppression = Object.create(null);
  suppression[beatFunction] = {
    omitInstructionSteps: (Array.isArray(learnMoment.explanatorySteps)
      ? learnMoment.explanatorySteps
      : []
    ).map(function (step) {
      return Number(step.sourceStepNumber);
    }),
    omitMaterialIds: (Array.isArray(learnMoment.materials) ? learnMoment.materials : []).map(
      function (material) {
        return String(material.id || "");
      }
    ),
    omitExpectedOutput: false
  };

  return { suppressBeatContent: suppression };
}

/**
 * @param {import("./types").CompositionMoment} doMoment
 * @param {string} beatFunction
 * @returns {{ suppressBeatContent: Object.<string, { omitInstructionSteps: number[], omitMaterialIds: string[], omitExpectedOutput: boolean }> }}
 */
function doRenderHints(doMoment, beatFunction, checkBeatFunction) {
  if (!doMoment || doMoment.kind !== "do" || !Array.isArray(doMoment.items) || !doMoment.items.length) {
    return { suppressBeatContent: Object.create(null) };
  }

  var omitSteps = (Array.isArray(doMoment.taskSteps) ? doMoment.taskSteps : []).map(function (step) {
    return Number(step.sourceStepNumber);
  });
  var omitMaterialIds = (Array.isArray(doMoment.materials) ? doMoment.materials : []).map(function (material) {
    return String(material.id || "");
  });
  var omitPromptFields = [];
  (Array.isArray(doMoment.items) ? doMoment.items : []).forEach(function (item) {
    if (item && item.kind === "prompt" && item.prompt && item.prompt.sourceField) {
      omitPromptFields.push(String(item.prompt.sourceField));
    }
  });
  var expectedTargetBeat = String(checkBeatFunction || beatFunction || "");
  var hasExpectedOutput = !!doMoment.expectedOutput;

  var suppression = Object.create(null);
  suppression[beatFunction] = {
    omitInstructionSteps: omitSteps,
    omitMaterialIds: omitMaterialIds,
    omitExpectedOutput: hasExpectedOutput && expectedTargetBeat === beatFunction,
    omitPromptSourceFields: omitPromptFields
  };

  if (hasExpectedOutput && expectedTargetBeat && expectedTargetBeat !== beatFunction) {
    suppression[expectedTargetBeat] = mergeBeatSuppressionEntry(
      suppression[expectedTargetBeat] || null,
      {
        omitInstructionSteps: [],
        omitMaterialIds: [],
        omitExpectedOutput: true,
        omitPromptSourceFields: []
      }
    );
  }

  return { suppressBeatContent: suppression };
}

/**
 * @param {import("./types").CompositionMoment} checkMoment
 * @param {{ suppressBeatContent?: Object }} [doHints]
 * @param {string} checkBeatFunction
 * @returns {{ suppressBeatContent: Object.<string, { omitInstructionSteps: number[], omitMaterialIds: string[], omitExpectedOutput: boolean }> }}
 */
function checkRenderHints(checkMoment, doHints, checkBeatFunction) {
  var base =
    doHints && doHints.suppressBeatContent
      ? doHints.suppressBeatContent[checkBeatFunction] || null
      : null;

  if (
    !checkMoment ||
    checkMoment.kind !== "check" ||
    !Array.isArray(checkMoment.items) ||
    !checkMoment.items.length
  ) {
    if (!base) return { suppressBeatContent: Object.create(null) };
    var onlyDo = Object.create(null);
    onlyDo[checkBeatFunction] = base;
    return { suppressBeatContent: onlyDo };
  }

  var checkSuppression = {
    omitInstructionSteps: (Array.isArray(checkMoment.checkingSteps)
      ? checkMoment.checkingSteps
      : []
    ).map(function (step) {
      return Number(step.sourceStepNumber);
    }),
    omitMaterialIds: (Array.isArray(checkMoment.materials) ? checkMoment.materials : []).map(
      function (material) {
        return String(material.id || "");
      }
    ),
    omitExpectedOutput: false,
    omitPromptSourceFields: []
  };

  var suppression = Object.create(null);
  suppression[checkBeatFunction] = mergeBeatSuppressionEntry(base, checkSuppression);
  return { suppressBeatContent: suppression };
}

/**
 * Build Learn suppression from item source refs (supports multi-beat Learn moments).
 *
 * @param {import("./types").CompositionMoment} learnMoment
 * @returns {{ suppressBeatContent: Object.<string, { omitInstructionSteps: number[], omitMaterialIds: string[], omitExpectedOutput: boolean, omitPromptSourceFields: string[] }> }}
 */
function learnRenderHintsFromItems(learnMoment) {
  if (
    !learnMoment ||
    learnMoment.kind !== "learn" ||
    !Array.isArray(learnMoment.items) ||
    !learnMoment.items.length
  ) {
    return { suppressBeatContent: Object.create(null) };
  }

  var suppression = Object.create(null);
  learnMoment.items.forEach(function (item) {
    var beatFunction = item && item.sourceRef && item.sourceRef.beatFunction;
    if (!beatFunction) return;
    if (!suppression[beatFunction]) {
      suppression[beatFunction] = {
        omitInstructionSteps: [],
        omitMaterialIds: [],
        omitExpectedOutput: false,
        omitPromptSourceFields: []
      };
    }
    if (item.kind === "instruction" && item.instruction) {
      suppression[beatFunction].omitInstructionSteps.push(
        Number(item.instruction.sourceStepNumber)
      );
    }
    if (item.kind === "material" && item.material) {
      suppression[beatFunction].omitMaterialIds.push(String(item.material.id || ""));
    }
  });

  Object.keys(suppression).forEach(function (beatFunction) {
    suppression[beatFunction] = mergeBeatSuppressionEntry(null, suppression[beatFunction]);
  });

  return { suppressBeatContent: suppression };
}

/**
 * Build Check suppression from item source refs (supports multi-beat Check moments).
 *
 * @param {import("./types").CompositionMoment} checkMoment
 * @param {{ suppressBeatContent?: Object }} [doHints]
 * @param {string} checkBeatFunction
 * @returns {{ suppressBeatContent: Object.<string, { omitInstructionSteps: number[], omitMaterialIds: string[], omitExpectedOutput: boolean, omitPromptSourceFields: string[] }> }}
 */
function checkRenderHintsFromItems(checkMoment, doHints, checkBeatFunction) {
  var base =
    doHints && doHints.suppressBeatContent
      ? doHints.suppressBeatContent[checkBeatFunction] || null
      : null;

  if (
    !checkMoment ||
    checkMoment.kind !== "check" ||
    !Array.isArray(checkMoment.items) ||
    !checkMoment.items.length
  ) {
    if (!base) return { suppressBeatContent: Object.create(null) };
    var onlyDo = Object.create(null);
    onlyDo[checkBeatFunction] = base;
    return { suppressBeatContent: onlyDo };
  }

  var suppression = Object.create(null);
  checkMoment.items.forEach(function (item) {
    var beatFunction = item && item.sourceRef && item.sourceRef.beatFunction;
    if (!beatFunction) return;
    if (!suppression[beatFunction]) {
      suppression[beatFunction] = {
        omitInstructionSteps: [],
        omitMaterialIds: [],
        omitExpectedOutput: false,
        omitPromptSourceFields: []
      };
    }
    if (item.kind === "instruction" && item.instruction) {
      suppression[beatFunction].omitInstructionSteps.push(
        Number(item.instruction.sourceStepNumber)
      );
    }
    if (item.kind === "material" && item.material) {
      suppression[beatFunction].omitMaterialIds.push(String(item.material.id || ""));
    }
    if (item.kind === "prompt" && item.prompt) {
      suppression[beatFunction].omitPromptSourceFields.push(
        String(item.prompt.sourceField || "")
      );
    }
  });

  Object.keys(suppression).forEach(function (beatFunction) {
    var entry = mergeBeatSuppressionEntry(null, suppression[beatFunction]);
    if (beatFunction === checkBeatFunction) {
      entry = mergeBeatSuppressionEntry(base, entry);
    }
    suppression[beatFunction] = entry;
  });

  if (base && !suppression[checkBeatFunction]) {
    suppression[checkBeatFunction] = base;
  }

  return { suppressBeatContent: suppression };
}

/**
 * @param {{ suppressFraming?: boolean, omitBeatFunctions?: string[] }} orientHints
 * @param {{ suppressBeatContent?: Object }} learnHints
 * @param {{ suppressBeatContent?: Object }} doHints
 * @param {{ suppressBeatContent?: Object }} checkHints
 * @returns {import("./types").ComposedActivityRenderHints}
 */
function mergeActivityRenderHints(orientHints, learnHints, doHints, checkHints) {
  var suppressBeatContent = Object.create(null);
  [learnHints, doHints, checkHints].forEach(function (hintSet) {
    if (!hintSet || !hintSet.suppressBeatContent) return;
    Object.keys(hintSet.suppressBeatContent).forEach(function (beatFunction) {
      var incoming = hintSet.suppressBeatContent[beatFunction];
      suppressBeatContent[beatFunction] = mergeBeatSuppressionEntry(
        suppressBeatContent[beatFunction] || null,
        incoming
      );
    });
  });

  return {
    suppressFraming: !!(orientHints && orientHints.suppressFraming),
    omitBeatFunctions:
      orientHints && Array.isArray(orientHints.omitBeatFunctions)
        ? orientHints.omitBeatFunctions.slice()
        : [],
    suppressBeatContent: suppressBeatContent
  };
}

module.exports = {
  A1_DO_STEP_NUMBERS: A1_DO_STEP_NUMBERS,
  A1_DO_MATERIAL_IDS: A1_DO_MATERIAL_IDS,
  A1_CHECK_STEP_NUMBERS: A1_CHECK_STEP_NUMBERS,
  A1_CHECK_MATERIAL_IDS: A1_CHECK_MATERIAL_IDS,
  A1_LEARN_STEP_NUMBERS: A1_LEARN_STEP_NUMBERS,
  A1_LEARN_MATERIAL_IDS: A1_LEARN_MATERIAL_IDS,
  A2_LEARN_STEP_NUMBERS: A2_LEARN_STEP_NUMBERS,
  A2_LEARN_MATERIAL_IDS: A2_LEARN_MATERIAL_IDS,
  A2_DO_STEP_NUMBERS: A2_DO_STEP_NUMBERS,
  A2_DO_MATERIAL_IDS_BY_STEP: A2_DO_MATERIAL_IDS_BY_STEP,
  A2_CHECK_STEP_NUMBERS: A2_CHECK_STEP_NUMBERS,
  A2_CHECK_MATERIAL_IDS: A2_CHECK_MATERIAL_IDS,
  A3_LEARN_STEP_NUMBERS: A3_LEARN_STEP_NUMBERS,
  A3_LEARN_MATERIAL_IDS: A3_LEARN_MATERIAL_IDS,
  A3_DO_STEP_NUMBERS: A3_DO_STEP_NUMBERS,
  A3_DO_MATERIAL_IDS_BY_STEP: A3_DO_MATERIAL_IDS_BY_STEP,
  A3_CHECK_STEP_NUMBERS: A3_CHECK_STEP_NUMBERS,
  A3_CHECK_MATERIAL_IDS: A3_CHECK_MATERIAL_IDS,
  A4_LEARN_STEP_NUMBERS: A4_LEARN_STEP_NUMBERS,
  A4_LEARN_MATERIAL_IDS_BY_STEP: A4_LEARN_MATERIAL_IDS_BY_STEP,
  A4_DO_STEP_NUMBERS: A4_DO_STEP_NUMBERS,
  A4_DO_MATERIAL_IDS_BY_STEP: A4_DO_MATERIAL_IDS_BY_STEP,
  A4_CHECK_STEP_NUMBERS: A4_CHECK_STEP_NUMBERS,
  A4_CHECK_MATERIAL_IDS: A4_CHECK_MATERIAL_IDS,
  A5_LEARN_BEAT_CONFIGS: A5_LEARN_BEAT_CONFIGS,
  A5_DO_STEP_NUMBERS: A5_DO_STEP_NUMBERS,
  A5_DO_MATERIAL_IDS_BY_STEP: A5_DO_MATERIAL_IDS_BY_STEP,
  A5_DO_PROMPT_FIELDS: A5_DO_PROMPT_FIELDS,
  A5_WORKSPACE_STEP_NUMBERS: A5_WORKSPACE_STEP_NUMBERS,
  A5_CHECK_BEAT_CONFIGS: A5_CHECK_BEAT_CONFIGS,
  composeOrientMoment: composeOrientMoment,
  composeLearnMoment: composeLearnMoment,
  composeDoMoment: composeDoMoment,
  composeCheckMoment: composeCheckMoment,
  learnItemRoleForInstruction: learnItemRoleForInstruction,
  learnItemRoleForMaterial: learnItemRoleForMaterial,
  revealBehaviourForCheckMaterial: revealBehaviourForCheckMaterial,
  orientRenderHints: orientRenderHints,
  learnRenderHints: learnRenderHints,
  learnRenderHintsFromItems: learnRenderHintsFromItems,
  doRenderHints: doRenderHints,
  checkRenderHints: checkRenderHints,
  checkRenderHintsFromItems: checkRenderHintsFromItems,
  mergeActivityRenderHints: mergeActivityRenderHints,
  momentBeatAnchorsForActivity: momentBeatAnchorsForActivity,
  activityOmitBeatFunctions: activityOmitBeatFunctions,
  findOrientationEntryPrompt: findOrientationEntryPrompt,
  findOrientationIntroPrompt: findOrientationEntryPrompt
};

