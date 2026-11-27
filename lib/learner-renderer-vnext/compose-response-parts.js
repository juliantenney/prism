"use strict";

var types = require("./response-part-types");
var responseFields = require("../dla-response-fields");
var parsePromptSetItems = require("./parse-prompt-set-items").parsePromptSetItems;
var parseTemplateSections = require("./parse-template-sections").parseTemplateSections;
var normalizeOrderingSemantics =
  require("./normalize-ordering").normalizeOrderingSemantics;
var normalizeSelection =
  require("./normalize-selection");
var normalizeSelectionSemantics = normalizeSelection.normalizeSelectionSemantics;
var expandFlattenedSingleSelectSelection =
  normalizeSelection.expandFlattenedSingleSelectSelection;
var artefactProducers = require("./learner-artefact-producers");

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
    inputModality: fields.inputModality || types.INPUT_MODALITY.TEXT,
    order: order,
    provenance: Object.assign({ activityId: activityId }, fields.provenance || {}),
    sourceStepNumber: fields.sourceStepNumber == null ? null : Number(fields.sourceStepNumber),
    sequenceOrder: fields.sequenceOrder == null ? null : Number(fields.sequenceOrder),
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

function stripPromptSetJournalChrome(text) {
  return String(text || "")
    .replace(/^\s*#{1,6}\s*Your Learning Journal response:\s*E\d+\s*/im, "")
    .replace(/^\s*E\d+\s*[—–-]\s*[^\n]+\n+/im, "")
    .trim();
}

function partsFromPromptSetMaterial(activityId, material, options) {
  var opts = options && typeof options === "object" ? options : {};
  var items = parsePromptSetItems(material.body);
  var parts = items.map(function (item) {
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
  // Artefact-bound prompt_set bodies are often continuous prose (not numbered
  // lists). parsePromptSetItems then returns [], the material renders as static
  // markdown, and a generic task-step workspace captures learner text under the
  // wrong id — breaking Learning Journal handoff. Emit one constructed-text
  // surface from the authored body when a journal binding is present.
  if (!parts.length && opts.artefactBinding) {
    var promptText =
      stripPromptSetJournalChrome(material.body) ||
      String(material.title || "").trim() ||
      "Record your response";
    var fallback = buildResponsePart(activityId, {
      sourceKind: types.SOURCE_KIND.PROMPT_ITEM,
      sourceId: String(material.id || "prompt-set") + "-item-1",
      order: 1,
      label: "Your response",
      prompt: promptText,
      provenance: {
        materialId: material.id,
        materialType: material.type,
        promptSetFallback: "artefact_bound_unparsed"
      }
    });
    fallback.rows = 8;
    parts.push(fallback);
  }
  return parts;
}

function requiredMaterialsFromContext(context) {
  var modelActivity = context && context.modelActivity;
  var sourceActivity =
    modelActivity &&
    modelActivity.sourceActivity &&
    typeof modelActivity.sourceActivity === "object"
      ? modelActivity.sourceActivity
      : null;
  return sourceActivity && Array.isArray(sourceActivity.required_materials)
    ? sourceActivity.required_materials
    : [];
}

function artefactBindingForMaterial(requiredMaterials, materialId) {
  var id = String(materialId || "").trim();
  if (!id) return null;
  var rows = Array.isArray(requiredMaterials) ? requiredMaterials : [];
  for (var i = 0; i < rows.length; i += 1) {
    var row = rows[i];
    if (!row || typeof row !== "object") continue;
    var rowId = String(row.material_id || row.materialId || "").trim();
    if (rowId !== id) continue;
    var fulfilment =
      row.response_fulfilment &&
      typeof row.response_fulfilment === "object" &&
      !Array.isArray(row.response_fulfilment)
        ? row.response_fulfilment
        : null;
    if (!fulfilment) return null;
    var elicitationId = String(
      fulfilment.artefact_elicitation_id || fulfilment.artefactElicitationId || ""
    ).trim();
    if (!elicitationId) return null;
    return {
      elicitationId: elicitationId,
      workspaceId: artefactProducers.constructedTextWorkspaceId(elicitationId)
    };
  }
  return null;
}

function applyArtefactBindingToParts(parts, binding) {
  if (!binding || !Array.isArray(parts) || !parts.length) return parts;
  var applied = false;
  return parts.map(function (part) {
    if (applied) return part;
    if (!part || part.surfaceKind !== types.SURFACE_KIND.TEXT_ENTRY) return part;
    applied = true;
    return Object.assign({}, part, {
      workspaceId: binding.workspaceId,
      artefactElicitationId: binding.elicitationId,
      // Stable elicitation identity for Journal / shared contract (e.g. E1).
      responsePartId: binding.elicitationId
    });
  });
}

function partsFromTemplateMaterial(activityId, material, options) {
  var opts = options || {};
  var diagnostics = Array.isArray(opts.diagnostics) ? opts.diagnostics : null;
  var materialId = String(material.id || "");
  var requiredMaterials = opts.requiredMaterials || [];
  var commissionedFields = responseFields.getResponseFieldsForMaterial(requiredMaterials, materialId);
  var modalityIndex = responseFields.buildModalityIndexForMaterial(requiredMaterials, materialId);
  var sections = parseTemplateSections(material.body);

  if (commissionedFields.length && diagnostics) {
    responseFields.appendComposeAlignmentDiagnostics(
      sections.map(function (section) {
        return section.label;
      }),
      commissionedFields,
      materialId,
      diagnostics
    );
  }

  return sections.map(function (section) {
    var resolved = responseFields.resolveInputModalityForLabel(section.label, modalityIndex, {
      materialId: materialId,
      hasCommissionedFields: commissionedFields.length > 0
    });
    if (resolved.diagnostic && diagnostics) {
      diagnostics.push(resolved.diagnostic);
    }
    var part = buildResponsePart(activityId, {
      sourceKind: types.SOURCE_KIND.TEMPLATE_SECTION,
      sourceId: material.id + "-section-" + slugify(section.label),
      order: section.order,
      label: section.label,
      prompt: section.prompt,
      inputModality: resolved.inputModality,
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
    sequenceOrder: opts.sequenceOrder,
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
  // When prompt-set response parts exist, they own ordinary write/explain
  // production. Keep distinct transfer/reflection task steps.
  if (
    options &&
    options.hasPromptSetParts &&
    WRITTEN_TASK_STEP_RE.test(text) &&
    !/^(Reflect on|Complete the transfer|Identify another)\b/i.test(text)
  ) {
    return false;
  }
  if (options && options.hasTemplateParts && TEMPLATE_STEP_RE.test(text) && TABLE_STEP_RE.test(text)) {
    return false;
  }
  if (options && options.hasTemplateParts && /^Use the response template\b/i.test(text)) return false;
  return WRITTEN_TASK_STEP_RE.test(text);
}

function partsFromTaskSteps(activityId, taskSteps, options) {
  var parts = [];
  var coveredSteps =
    options && options.coveredTaskStepNumbers && typeof options.coveredTaskStepNumbers === "object"
      ? options.coveredTaskStepNumbers
      : Object.create(null);
  var maxCoveredStep = 0;
  Object.keys(coveredSteps).forEach(function (stepKey) {
    var stepNumber = Number(stepKey);
    if (Number.isFinite(stepNumber) && stepNumber > maxCoveredStep) {
      maxCoveredStep = stepNumber;
    }
  });
  (Array.isArray(taskSteps) ? taskSteps : []).forEach(function (step) {
    var text = String(step.text || "").trim();
    if (!text) return;
    var stepNumber = Number(step.sourceStepNumber);
    var stepCoveredBySurface = !!coveredSteps[stepNumber];
    var includeAsTextPart = isWrittenTaskStep(text, options);
    if (
      !includeAsTextPart &&
      options &&
      options.allowUncoveredTaskStepWorkspaces &&
      !stepCoveredBySurface &&
      !options.hasTemplateParts &&
      !options.hasPromptSetParts &&
      stepNumber > maxCoveredStep
    ) {
      includeAsTextPart = true;
    }
    if (!includeAsTextPart) return;
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

function partFromSelectionMaterial(activityId, material, order) {
  var materialId = String((material && (material.id || material.material_id)) || "selection");
  var payload =
    material && material.selection && typeof material.selection === "object"
      ? material.selection
      : material;
  var isCluster = normalizeSelection.hasSelectionItems(payload);
  var expanded = expandFlattenedSingleSelectSelection(payload || {});
  if (!expanded.length) expanded = [payload || material];
  var diagnostics = [];
  var parts = [];
  var baseOrder = Number.isFinite(Number(order)) ? Number(order) : 1;
  var clusterIntro = isCluster
    ? String(
        (typeof material.body === "string" && material.body) ||
          (payload && payload.prompt) ||
          ""
      ).trim()
    : "";
  expanded.forEach(function (selectionRow, index) {
    var itemSuffix = isCluster
      ? "-q-" + String(selectionRow.item_id || "item-" + String(index + 1))
      : expanded.length > 1
        ? "-q" + String(index + 1)
        : "";
    var rowMaterial =
      !isCluster && expanded.length === 1
        ? material
        : Object.assign({}, material, {
            selection: selectionRow,
            // Cluster items keep the cluster title as their heading (the item prompt
            // is the fieldset legend); legacy flattened rows use their own stem.
            title: isCluster
              ? String(selectionRow.label || material.title || "").trim()
              : selectionRow.label || selectionRow.prompt || material.title,
            id: materialId + itemSuffix,
            material_id: materialId + itemSuffix
          });
    var rowId = String(
      (rowMaterial && (rowMaterial.id || rowMaterial.material_id)) || materialId
    );
    var normalized = normalizeSelectionSemantics(rowMaterial, {
      activityId: activityId,
      materialId: rowId
    });
    if (!normalized.ok) {
      diagnostics = diagnostics.concat(normalized.diagnostics || []);
      return;
    }
    var model = normalized.model;
    var part = buildResponsePart(activityId, {
      sourceKind: types.SOURCE_KIND.SELECTION,
      sourceId: rowId,
      order: baseOrder + index,
      label: model.label,
      prompt: model.prompt,
      surfaceKind: model.surfaceKind,
      provenance: {
        materialId: rowId,
        parentMaterialId: isCluster || expanded.length > 1 ? materialId : rowId,
        materialType: String((material && material.type) || "selection"),
        selectionForm: model.form,
        selectionSplitIndex: isCluster || expanded.length > 1 ? index + 1 : 0,
        selectionSplitCount: expanded.length
      }
    });
    if (isCluster) {
      // Stable, order-independent identity scoped to activity + material + item_id, so
      // answer state, correct key, feedback and drafts never depend on item position.
      part.responsePartId =
        String(activityId || "activity") + "-selection-" + slugify(rowId);
      part.provenance.selectionItemId = String(selectionRow.source_item_id || selectionRow.item_id || "");
      part.provenance.selectionCluster = {
        materialId: materialId,
        itemId: String(selectionRow.item_id || ""),
        index: index + 1,
        count: expanded.length,
        intro: index === 0 ? clusterIntro : ""
      };
    }
    part.selection = model;
    parts.push(part);
  });
  if (!parts.length) {
    return { part: null, parts: [], diagnostics: diagnostics };
  }
  return {
    part: parts[0],
    parts: parts,
    diagnostics: diagnostics
  };
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

var SELECTION_STEP_RE =
  /^(?:Select|Choose|Pick|Match|Classify|Decide|Indicate|Tick|Mark|Complete the (?:decision|selection|matching)|Make (?:your )?(?:selection|decision|appraisal|choice)|For each\b[^.]*\b(?:select|choose|match|classify|decide))\b/i;

var CONSTRUCTED_STEP_RE =
  /^(?:Write|Explain|Justify|Record|Summari[sz]e|Draft|Produce|Complete the prompt set|Use the response template|Construct|State|Formulate|Articulate)\b/i;

function classifyTaskStepModality(stepText) {
  var text = String(stepText || "").trim();
  if (!text) return "";
  if (CONSTRUCTED_STEP_RE.test(text)) return "constructed";
  if (SELECTION_STEP_RE.test(text)) return "selection";
  return "";
}

function buildStepSequencePlan(items, taskSteps) {
  var stepItemIndexByNumber = Object.create(null);
  (Array.isArray(items) ? items : []).forEach(function (item, idx) {
    if (item && item.kind === "instruction" && item.instruction) {
      var stepNum = Number(item.instruction.sourceStepNumber);
      if (Number.isFinite(stepNum) && stepItemIndexByNumber[stepNum] == null) {
        stepItemIndexByNumber[stepNum] = idx;
      }
    }
  });

  var selectionSteps = [];
  var constructedSteps = [];
  (Array.isArray(taskSteps) ? taskSteps : []).forEach(function (step) {
    var stepNum = Number(step && step.sourceStepNumber);
    if (!Number.isFinite(stepNum)) return;
    var kind = classifyTaskStepModality(step.text);
    if (kind === "selection") selectionSteps.push(stepNum);
    else if (kind === "constructed") constructedSteps.push(stepNum);
  });

  return {
    stepItemIndexByNumber: stepItemIndexByNumber,
    selectionSteps: selectionSteps,
    constructedSteps: constructedSteps,
    useExplicitStepAnchors: selectionSteps.length > 0 && constructedSteps.length > 0
  };
}

function assignGroupSequenceOrder(groupParts, anchor, baseOffset) {
  var offset = Number(baseOffset) || 0;
  return (Array.isArray(groupParts) ? groupParts : []).map(function (part, idx) {
    if (!part || typeof part !== "object") return part;
    part.sequenceOrder = Number(anchor) * 1000 + offset + idx;
    return part;
  });
}

function partSequenceSortKey(part) {
  if (part && part.sequenceOrder != null && Number.isFinite(Number(part.sequenceOrder))) {
    return Number(part.sequenceOrder);
  }
  return Number(part && part.order) || 0;
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
  var requiredMaterials = requiredMaterialsFromContext(context);
  var seqPlan = buildStepSequencePlan(items, taskSteps);
  var selectionMaterialCursor = 0;
  var constructedMaterialCursor = 0;

  function anchorForMaterialKind(kind, itemIndex) {
    if (seqPlan.useExplicitStepAnchors) {
      if (kind === "selection") {
        var selStep =
          seqPlan.selectionSteps[
            Math.min(selectionMaterialCursor, seqPlan.selectionSteps.length - 1)
          ];
        selectionMaterialCursor += 1;
        return { anchor: selStep, offset: (selectionMaterialCursor - 1) * 50 };
      }
      if (kind === "constructed") {
        var conStep =
          seqPlan.constructedSteps[
            Math.min(constructedMaterialCursor, seqPlan.constructedSteps.length - 1)
          ];
        constructedMaterialCursor += 1;
        return { anchor: conStep, offset: (constructedMaterialCursor - 1) * 50 };
      }
    }
    return { anchor: itemIndex, offset: 0 };
  }

  if (momentKind === "do" && context.modelActivity) {
    var orderingResult = partFromOrderingActivity(activityId, context.modelActivity);
    diagnostics = diagnostics.concat(orderingResult.diagnostics || []);
    if (orderingResult.part) {
      orderingResult.part.sequenceOrder = 0;
      parts.push(orderingResult.part);
    }
  }

  items.forEach(function (item, itemIndex) {
    if (!item || item.kind !== "material" || !item.material) return;
    var material = item.material;
    var type = String(material.type || "");

    if (type === "prompt_set") {
      var promptSetBinding = artefactBindingForMaterial(requiredMaterials, material.id);
      var promptParts = applyArtefactBindingToParts(
        partsFromPromptSetMaterial(activityId, material, {
          artefactBinding: promptSetBinding
        }),
        promptSetBinding
      );
      var promptAnchor = anchorForMaterialKind("constructed", itemIndex);
      parts = parts.concat(
        assignGroupSequenceOrder(promptParts, promptAnchor.anchor, promptAnchor.offset)
      );
      return;
    }

    if (type === "selection" || type === "decision") {
      var selectionOrdinal =
        parts.filter(function (part) {
          return part && part.sourceKind === types.SOURCE_KIND.SELECTION;
        }).length + 1;
      var selectionResult = partFromSelectionMaterial(
        activityId,
        material,
        selectionOrdinal
      );
      diagnostics = diagnostics.concat(selectionResult.diagnostics || []);
      var selectionParts =
        Array.isArray(selectionResult.parts) && selectionResult.parts.length
          ? selectionResult.parts
          : selectionResult.part
            ? [selectionResult.part]
            : [];
      if (selectionParts.length) {
        var boundSelectionParts = applyArtefactBindingToParts(
          selectionParts,
          artefactBindingForMaterial(requiredMaterials, material.id)
        );
        var selAnchor = anchorForMaterialKind("selection", itemIndex);
        parts = parts.concat(
          assignGroupSequenceOrder(boundSelectionParts, selAnchor.anchor, selAnchor.offset)
        );
      }
      return;
    }

    if (type === "template") {
      var templateParts = applyArtefactBindingToParts(
        partsFromTemplateMaterial(activityId, material, {
          requiredMaterials: requiredMaterials,
          diagnostics: diagnostics
        }),
        artefactBindingForMaterial(requiredMaterials, material.id)
      );
      var tmplAnchor = anchorForMaterialKind("constructed", itemIndex);
      parts = parts.concat(
        assignGroupSequenceOrder(templateParts, tmplAnchor.anchor, tmplAnchor.offset)
      );
      return;
    }

    if (type === "transfer_prompt") {
      coveredTransfer = true;
      var transferPart = partFromTransferText(activityId, material.id, material.body, {
        order: 910,
        sequenceOrder: 910000,
        provenance: { materialId: material.id, materialType: type }
      });
      var transferBound = applyArtefactBindingToParts(
        [transferPart],
        artefactBindingForMaterial(requiredMaterials, material.id)
      );
      parts.push(transferBound[0]);
    }

    if (type === "task_card") {
      var taskCardBinding = artefactBindingForMaterial(requiredMaterials, material.id);
      if (taskCardBinding) {
        var taskCardPrompt = String(material.body || material.title || "").trim();
        var taskCardPart = buildResponsePart(activityId, {
          sourceKind: types.SOURCE_KIND.TASK_STEP,
          sourceId: String(material.id || "task-card"),
          order: 200,
          label: "Your response",
          prompt: taskCardPrompt || "Record your response",
          provenance: { materialId: material.id, materialType: type }
        });
        taskCardPart.rows = rowsForPart(taskCardPart);
        var boundTaskCard = applyArtefactBindingToParts([taskCardPart], taskCardBinding);
        var tcAnchor = anchorForMaterialKind("constructed", itemIndex);
        parts = parts.concat(
          assignGroupSequenceOrder(boundTaskCard, tcAnchor.anchor, tcAnchor.offset)
        );
      }
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
          sequenceOrder: 905000,
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
          sequenceOrder: 920000,
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
  var hasSelectionParts = parts.some(function (part) {
    return (
      part.surfaceKind === types.SURFACE_KIND.SINGLE_SELECT ||
      part.surfaceKind === types.SURFACE_KIND.MULTI_SELECT ||
      part.surfaceKind === types.SURFACE_KIND.MATCHING
    );
  });
  var hasTableWorkspace = items.some(function (item) {
    return item && item.tableWorkspace;
  });
  var coveredTaskStepNumbers = Object.create(null);
  var activeInstructionStepNumber = null;
  items.forEach(function (item) {
    if (!item || typeof item !== "object") return;
    if (item.kind === "instruction" && item.instruction) {
      activeInstructionStepNumber = Number(item.instruction.sourceStepNumber);
      if (!Number.isFinite(activeInstructionStepNumber)) {
        activeInstructionStepNumber = null;
      }
      return;
    }
    if (item.kind !== "material" || !item.material || !Number.isFinite(activeInstructionStepNumber)) {
      return;
    }
    var materialType = String(item.material.type || "");
    var materialOwnsResponseSurface =
      !!item.tableWorkspace ||
      materialType === "prompt_set" ||
      materialType === "template" ||
      materialType === "selection" ||
      materialType === "decision";
    if (materialOwnsResponseSurface) {
      coveredTaskStepNumbers[activeInstructionStepNumber] = true;
    }
  });

  if (!hasOrderingParts) {
    var stepParts = partsFromTaskSteps(activityId, taskSteps, {
      hasPromptSetParts: hasPromptSetParts,
      hasTemplateParts: hasTemplateParts,
      hasTableWorkspace: hasTableWorkspace,
      coveredTaskStepNumbers: coveredTaskStepNumbers,
      allowUncoveredTaskStepWorkspaces: hasTableWorkspace
    });
    stepParts.forEach(function (part) {
      var stepNum = Number(part.sourceStepNumber);
      if (seqPlan.useExplicitStepAnchors && Number.isFinite(stepNum)) {
        part.sequenceOrder = stepNum * 1000;
      } else if (
        Number.isFinite(stepNum) &&
        seqPlan.stepItemIndexByNumber[stepNum] != null
      ) {
        part.sequenceOrder = seqPlan.stepItemIndexByNumber[stepNum] * 1000;
      } else {
        part.sequenceOrder = (items.length + (Number.isFinite(stepNum) ? stepNum : 0)) * 1000;
      }
    });
    parts = parts.concat(stepParts);
  }

  if (
    !parts.some(function (part) {
      return (
        part.surfaceKind === types.SURFACE_KIND.TEXT_ENTRY ||
        part.surfaceKind === types.SURFACE_KIND.ORDERING ||
        part.surfaceKind === types.SURFACE_KIND.SINGLE_SELECT ||
        part.surfaceKind === types.SURFACE_KIND.MULTI_SELECT ||
        part.surfaceKind === types.SURFACE_KIND.MATCHING
      );
    }) &&
    context.expectedOutput &&
    !hasTableWorkspace &&
    !hasSelectionParts
  ) {
    var fallback = partFromExpectedOutput(activityId, context.expectedOutput, 960);
    if (fallback) {
      fallback.sequenceOrder = 960000;
      parts.push(fallback);
    }
  }

  if (context.activityPrompts && context.activityPrompts.transfer && !coveredTransfer) {
    parts.push(
      partFromTransferText(activityId, "transfer_or_application_task", context.activityPrompts.transfer, {
        order: 905,
        sequenceOrder: 905000,
        provenance: { sourceField: "transfer_or_application_task" }
      })
    );
  }

  return {
    parts: parts.sort(function (a, b) {
      var delta = partSequenceSortKey(a) - partSequenceSortKey(b);
      if (delta) return delta;
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
  partFromSelectionMaterial: partFromSelectionMaterial,
  partsFromPromptSetMaterial: partsFromPromptSetMaterial,
  partsFromTemplateMaterial: partsFromTemplateMaterial,
  isWrittenTaskStep: isWrittenTaskStep,
  rowsForPart: rowsForPart
};
