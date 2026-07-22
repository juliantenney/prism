"use strict";

var types = require("./response-part-types");
var parsePromptSetItems = require("./parse-prompt-set-items").parsePromptSetItems;
var parseTemplateSections = require("./parse-template-sections").parseTemplateSections;
var normalizeOrderingSemantics =
  require("./normalize-ordering").normalizeOrderingSemantics;

var WRITTEN_TASK_STEP_RE =
  /^(Write|Explain|Justify|Record|Summari[sz]e|Draft|Produce|Complete the transfer|Reflect on|Identify another|Complete the transfer prompt)/i;

var INSTRUCTIONAL_TASK_STEP_RE =
  /^(Read|Review|Study|Compare your|Check the|Use the checklist|Verify|Complete the verification|Analyse the provided scenarios using|Follow the process|Work through|Complete the final verification)/i;

var PROMPT_SET_STEP_RE = /^Complete the prompt set\b/i;
var TEMPLATE_STEP_RE = /\btemplate\b/i;
var TABLE_STEP_RE = /^Complete the .*table\b/i;

function slugify(value) {
  return (
    String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "part"
  );
}

/**
 * @param {string} activityId
 * @param {import("./response-part-types")} fields
 * @returns {import("./types").ResponsePart}
 */
function buildResponsePart(activityId, fields) {
  var sourceKind = fields.sourceKind;
  var sourceId = String(fields.sourceId || "");
  var order = Number(fields.order) || 0;
  var responsePartId =
    String(activityId || "activity") +
    "-" +
    slugify(sourceKind) +
    "-" +
    slugify(sourceId) +
    "-" +
    String(order);

  return {
    responsePartId: responsePartId,
    sourceKind: sourceKind,
    sourceId: sourceId,
    label: String(fields.label || "Your response").trim(),
    prompt: String(fields.prompt || "").trim(),
    guidance: fields.guidance || "",
    expectedOutput: fields.expectedOutput || "",
    surfaceKind: fields.surfaceKind || types.SURFACE_KIND.TEXT_ENTRY,
    order: order,
    provenance: Object.assign({ activityId: activityId }, fields.provenance || {}),
    sourceStepNumber: fields.sourceStepNumber == null ? null : Number(fields.sourceStepNumber),
    rows: fields.rows == null ? null : Number(fields.rows)
  };
}

function rowsForPart(part) {
  if (part.sourceKind === types.SOURCE_KIND.PROMPT_ITEM) return 4;
  if (/claim|judgement|judgment|recommendation|memo/i.test(part.label || "")) return 5;
  if (/reflect|transfer/i.test(part.label || "")) return 5;
  if (/extended|memo/i.test(part.prompt || "")) return 8;
  return 6;
}

function partsFromPromptSetMaterial(activityId, material) {
  var items = parsePromptSetItems(material.body);
  return items.map(function (item) {
    var part = buildResponsePart(activityId, {
      sourceKind: types.SOURCE_KIND.PROMPT_ITEM,
      sourceId: material.id + "-item-" + item.order,
      order: item.order,
      label: item.label,
      prompt: item.prompt,
      provenance: { materialId: material.id, materialType: material.type }
    });
    part.rows = rowsForPart(part);
    return part;
  });
}

function partsFromTemplateMaterial(activityId, material) {
  var sections = parseTemplateSections(material.body);
  return sections.map(function (section) {
    var part = buildResponsePart(activityId, {
      sourceKind: types.SOURCE_KIND.TEMPLATE_SECTION,
      sourceId: material.id + "-section-" + slugify(section.label),
      order: section.order,
      label: section.label,
      prompt: section.prompt,
      provenance: { materialId: material.id, materialType: material.type }
    });
    part.rows = rowsForPart(part);
    return part;
  });
}

function partFromTransferText(activityId, sourceId, text, options) {
  var opts = options || {};
  var part = buildResponsePart(activityId, {
    sourceKind: opts.reflection ? types.SOURCE_KIND.REFLECTION_PROMPT : types.SOURCE_KIND.TRANSFER_PROMPT,
    sourceId: sourceId,
    order: opts.order || 900,
    label: opts.label || "Transfer response",
    prompt: String(text || "").trim(),
    sourceStepNumber: opts.sourceStepNumber,
    provenance: opts.provenance || {}
  });
  part.rows = rowsForPart(part);
  return part;
}

function isWrittenTaskStep(stepText, options) {
  var text = String(stepText || "").trim();
  if (!text) return false;
  if (INSTRUCTIONAL_TASK_STEP_RE.test(text)) return false;
  if (options && options.hasTableWorkspace && /^Record whether/i.test(text)) return false;
  if (options && options.hasPromptSetParts && PROMPT_SET_STEP_RE.test(text)) return false;
  if (options && options.hasTemplateParts && TEMPLATE_STEP_RE.test(text) && TABLE_STEP_RE.test(text)) {
    return false;
  }
  if (options && options.hasTemplateParts && /^Use the response template\b/i.test(text)) return false;
  return WRITTEN_TASK_STEP_RE.test(text);
}

function partsFromTaskSteps(activityId, taskSteps, options) {
  var parts = [];
  (Array.isArray(taskSteps) ? taskSteps : []).forEach(function (step) {
    var text = String(step.text || "").trim();
    if (!isWrittenTaskStep(text, options)) return;
    if (options && options.hasTemplateParts) return;
    var label = "Your response";
    if (/^Reflect on/i.test(text)) label = "Reflection";
    if (/^Complete the transfer/i.test(text) || /^Identify another/i.test(text)) {
      label = "Transfer response";
    }
    if (/^Produce an independent written judgement/i.test(text)) label = "Final judgement";
    if (/^Write a brief (?:explanation|summary)/i.test(text)) label = "Your response";
    var part = buildResponsePart(activityId, {
      sourceKind: types.SOURCE_KIND.TASK_STEP,
      sourceId: "step-" + step.sourceStepNumber,
      order: Number(step.sourceStepNumber),
      label: label,
      prompt: text,
      sourceStepNumber: step.sourceStepNumber,
      provenance: { sourceStepNumber: step.sourceStepNumber }
    });
    part.rows = rowsForPart(part);
    parts.push(part);
  });
  return parts;
}

function partFromExpectedOutput(activityId, expectedOutput, order) {
  if (!expectedOutput || !String(expectedOutput.text || "").trim()) return null;
  var part = buildResponsePart(activityId, {
    sourceKind: types.SOURCE_KIND.EXPECTED_OUTPUT,
    sourceId: "expected_output",
    order: order || 950,
    label: "Your response",
    prompt: String(expectedOutput.text || "").trim(),
    provenance: { sourceField: "expected_output" }
  });
  part.rows = 8;
  return part;
}

function partFromOrderingActivity(activityId, modelActivity) {
  var source =
    (modelActivity && modelActivity.sourceActivity) ||
    {
      activity_id: activityId,
      activity_interaction_type: modelActivity && modelActivity.activityInteractionType,
      ordering: modelActivity && modelActivity.ordering,
      learner_task: modelActivity && modelActivity.learnerTask,
      learner_instructions: modelActivity && modelActivity.learnerInstructions
    };
  var normalized = normalizeOrderingSemantics(source, {
    activityId: activityId,
    seedKey:
      (modelActivity &&
        modelActivity.ordering &&
        modelActivity.ordering.shuffle_seed_key) ||
      activityId
  });
  if (!normalized.ok) {
    return { part: null, diagnostics: normalized.diagnostics || [] };
  }
  var model = normalized.model;
  var part = buildResponsePart(activityId, {
    sourceKind: types.SOURCE_KIND.ORDERING,
    sourceId: "ordering",
    order: 100,
    label: model.label,
    prompt: model.prompt,
    surfaceKind: types.SURFACE_KIND.ORDERING,
    provenance: {
      activityInteractionType: source.activity_interaction_type || "",
      orderingMode: model.mode
    }
  });
  part.ordering = {
    mode: model.mode,
    items: model.items,
    initialItems: model.initialItems,
    expectedOrder: model.expectedOrder,
    validationMode: model.validationMode,
    shuffleSeedKey: model.shuffleSeedKey,
    presentationStrategy: model.presentationStrategy
  };
  return { part: part, diagnostics: normalized.diagnostics || [] };
}

/**
 * Collect response parts from a composed moment context.
 *
 * @param {{
 *   activityId: string,
 *   momentKind: string,
 *   items: import("./types").CompositionItem[],
 *   taskSteps: { sourceStepNumber: number, text: string }[],
 *   expectedOutput: import("./types").ExpectedOutputModel|null,
 *   activityPrompts?: { transfer?: string },
 *   modelActivity?: import("./types").LearnerActivity
 * }} context
 * @returns {{ parts: import("./types").ResponsePart[], diagnostics: Object[] }}
 */
function collectResponseParts(context) {
  var activityId = String(context.activityId || "");
  var items = Array.isArray(context.items) ? context.items : [];
  var taskSteps = Array.isArray(context.taskSteps) ? context.taskSteps : [];
  var parts = [];
  var diagnostics = [];
  var coveredTransfer = false;
  var momentKind = String(context.momentKind || "");

  if (momentKind === "do" && context.modelActivity) {
    var orderingResult = partFromOrderingActivity(activityId, context.modelActivity);
    diagnostics = diagnostics.concat(orderingResult.diagnostics || []);
    if (orderingResult.part) parts.push(orderingResult.part);
  }

  items.forEach(function (item) {
    if (!item || item.kind !== "material" || !item.material) return;
    var material = item.material;
    var type = String(material.type || "");

    if (type === "prompt_set") {
      parts = parts.concat(partsFromPromptSetMaterial(activityId, material));
      return;
    }

    if (type === "template") {
      parts = parts.concat(partsFromTemplateMaterial(activityId, material));
      return;
    }

    if (type === "transfer_prompt") {
      coveredTransfer = true;
      parts.push(
        partFromTransferText(activityId, material.id, material.body, {
          order: 910,
          provenance: { materialId: material.id, materialType: type }
        })
      );
    }
  });

  items.forEach(function (item) {
    if (!item || item.kind !== "prompt" || !item.prompt) return;
    var field = String(item.prompt.sourceField || "");
    var text = String(item.prompt.text || "").trim();
    if (!text) return;
    if (field === "transfer_or_application_task") {
      if (coveredTransfer) return;
      coveredTransfer = true;
      parts.push(
        partFromTransferText(activityId, field, text, {
          order: 905,
          provenance: { sourceField: field }
        })
      );
      return;
    }
    if (/reflect/i.test(field) || /reflect/i.test(text)) {
      parts.push(
        partFromTransferText(activityId, field, text, {
          reflection: true,
          label: "Reflection",
          order: 920,
          provenance: { sourceField: field }
        })
      );
    }
  });

  var hasPromptSetParts = parts.some(function (part) {
    return part.sourceKind === types.SOURCE_KIND.PROMPT_ITEM;
  });
  var hasTemplateParts = parts.some(function (part) {
    return part.sourceKind === types.SOURCE_KIND.TEMPLATE_SECTION;
  });
  var hasOrderingParts = parts.some(function (part) {
    return part.surfaceKind === types.SURFACE_KIND.ORDERING;
  });
  var hasTableWorkspace = items.some(function (item) {
    return item && item.tableWorkspace;
  });

  if (!hasOrderingParts) {
    parts = parts.concat(
      partsFromTaskSteps(activityId, taskSteps, {
        hasPromptSetParts: hasPromptSetParts,
        hasTemplateParts: hasTemplateParts,
        hasTableWorkspace: hasTableWorkspace
      })
    );
  }

  if (
    !parts.some(function (part) {
      return (
        part.surfaceKind === types.SURFACE_KIND.TEXT_ENTRY ||
        part.surfaceKind === types.SURFACE_KIND.ORDERING
      );
    }) &&
    context.expectedOutput &&
    !hasTableWorkspace
  ) {
    var fallback = partFromExpectedOutput(activityId, context.expectedOutput, 960);
    if (fallback) parts.push(fallback);
  }

  if (context.activityPrompts && context.activityPrompts.transfer && !coveredTransfer) {
    parts.push(
      partFromTransferText(activityId, "transfer_or_application_task", context.activityPrompts.transfer, {
        order: 905,
        provenance: { sourceField: "transfer_or_application_task" }
      })
    );
  }

  return {
    parts: parts.sort(function (a, b) {
      return Number(a.order) - Number(b.order);
    }),
    diagnostics: diagnostics
  };
}

module.exports = {
  WRITTEN_TASK_STEP_RE: WRITTEN_TASK_STEP_RE,
  INSTRUCTIONAL_TASK_STEP_RE: INSTRUCTIONAL_TASK_STEP_RE,
  buildResponsePart: buildResponsePart,
  collectResponseParts: collectResponseParts,
  partFromOrderingActivity: partFromOrderingActivity,
  partsFromPromptSetMaterial: partsFromPromptSetMaterial,
  partsFromTemplateMaterial: partsFromTemplateMaterial,
  isWrittenTaskStep: isWrittenTaskStep,
  rowsForPart: rowsForPart
};
