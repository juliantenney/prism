/**
 * My Workflows list presentation helpers: product type label and compact authoring status.
 * Status is derived from persisted run captures / capture refs — not step index or visit count.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.PRISM_WORKFLOW_LIST_PRESENTATION = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var STATUS = {
    NO_DATA: "no_data",
    IN_PROGRESS: "in_progress",
    COMPLETE: "complete"
  };

  var STATUS_LABEL = {
    no_data: "No data",
    in_progress: "In progress",
    complete: "Complete"
  };

  var STATUS_ICON = {
    no_data: "○",
    in_progress: "◐",
    complete: "✓"
  };

  var PRODUCT_LABELS = {
    interactive: "Interactive",
    expository: "Expository",
    assessment_pack: "Assessment Pack",
    learning_journey: "Learning Journey",
    situated_task: "Situated Task"
  };

  function text(value) {
    return String(value == null ? "" : value).trim();
  }

  function asObject(value) {
    return value && typeof value === "object" && !Array.isArray(value) ? value : null;
  }

  /**
   * Resolve a list product label from authoritative workflow identity metadata.
   * Does not infer from the workflow title. Unknown → "Type unknown".
   */
  function resolveWorkflowListProductLabel(workflow, options) {
    var opts = options && typeof options === "object" ? options : {};
    var family = opts.familyMod || null;
    if (family && typeof family.readFirstClassIdentity === "function") {
      var identity = family.readFirstClassIdentity(workflow);
      var productId = text(identity && identity.product).toLowerCase();
      if (productId && PRODUCT_LABELS[productId]) return PRODUCT_LABELS[productId];
      if (productId) return productId;
    }
    var stored = text(workflow && workflow.product).toLowerCase();
    if (stored && PRODUCT_LABELS[stored]) return PRODUCT_LABELS[stored];
    if (stored) return stored;
    var legacyType = text(workflow && workflow.ldCreateOutputType);
    if (legacyType === "self_study_resource" || legacyType === "workshop") {
      return PRODUCT_LABELS.interactive;
    }
    if (legacyType === "expository_resource") return PRODUCT_LABELS.expository;
    if (legacyType === "assessment_pack") return PRODUCT_LABELS.assessment_pack;
    if (legacyType === "learning_journey") return PRODUCT_LABELS.learning_journey;
    if (legacyType === "situated_task") return PRODUCT_LABELS.situated_task;
    return "Type unknown";
  }

  function captureRefHasResource(entry) {
    var row = asObject(entry);
    if (!row) return false;
    return !!(text(row.resource_id) || text(row.resourceId));
  }

  function stepHasSavedAuthoringOutput(runRecord, stepId) {
    var sid = text(stepId);
    if (!sid) return false;
    var rec = asObject(runRecord) || {};
    var finals = asObject(rec.capturedOutputs) || {};
    var raws = asObject(rec.capturedOutputsRaw) || {};
    if (text(finals[sid]) || text(raws[sid])) return true;
    var refs = asObject(rec.captureRefs) || {};
    var row = asObject(refs[sid]);
    if (!row) return false;
    if (captureRefHasResource(row.final) || captureRefHasResource(row.raw)) return true;
    // Some older rows stored resource_id directly on the step ref.
    return captureRefHasResource(row);
  }

  function collectSavedStepIds(runRecord) {
    var rec = asObject(runRecord) || {};
    var ids = {};
    function markMap(map) {
      var source = asObject(map) || {};
      Object.keys(source).forEach(function (key) {
        if (stepHasSavedAuthoringOutput(rec, key)) ids[key] = true;
      });
    }
    markMap(rec.capturedOutputs);
    markMap(rec.capturedOutputsRaw);
    markMap(rec.captureRefs);
    return Object.keys(ids);
  }

  function findTerminalAuthoringStep(workflow) {
    var steps = workflow && Array.isArray(workflow.steps) ? workflow.steps : [];
    var i;
    for (i = 0; i < steps.length; i += 1) {
      var step = steps[i];
      var cid = text(step && (step.canonical_step_id || step.canonicalStepId)).toLowerCase();
      var title = text(step && step.title).toLowerCase();
      if (cid === "step_design_page" || title === "design page") return step;
    }
    if (!steps.length) return null;
    return steps[steps.length - 1] || null;
  }

  /**
   * Derive compact authoring status for a My Workflows list item.
   * Complete = final required authoring output saved (Design Page when present;
   * otherwise the workflow's last step). stepCompleted / runIndex alone never prove completion.
   */
  function deriveWorkflowListAuthoringStatus(workflow, runRecord) {
    var savedIds = collectSavedStepIds(runRecord);
    var terminal = findTerminalAuthoringStep(workflow);
    var terminalId = text(terminal && terminal.id);
    var terminalSaved = terminalId ? stepHasSavedAuthoringOutput(runRecord, terminalId) : false;

    var status = STATUS.NO_DATA;
    if (terminalSaved) {
      status = STATUS.COMPLETE;
    } else if (savedIds.length) {
      status = STATUS.IN_PROGRESS;
    }

    var label = STATUS_LABEL[status];
    var detail =
      status === STATUS.COMPLETE
        ? "Complete — final authoring output saved (not QA, publication or deployment)"
        : status === STATUS.IN_PROGRESS
          ? "In progress — saved step output exists; authoring not complete"
          : "No data — no saved step outputs or completed authoring artefact";

    return {
      status: status,
      label: label,
      icon: STATUS_ICON[status],
      title: detail,
      ariaLabel: "Authoring status: " + label,
      terminalStepId: terminalId || "",
      savedStepCount: savedIds.length
    };
  }

  function mergeRunRecordForListStatus(durableRecord, liveOverlay) {
    var durable = asObject(durableRecord) || {};
    var live = asObject(liveOverlay) || {};
    return {
      capturedOutputs: Object.assign({}, asObject(durable.capturedOutputs) || {}, asObject(live.capturedOutputs) || {}),
      capturedOutputsRaw: Object.assign(
        {},
        asObject(durable.capturedOutputsRaw) || {},
        asObject(live.capturedOutputsRaw) || {}
      ),
      captureRefs: Object.assign({}, asObject(durable.captureRefs) || {}, asObject(live.captureRefs) || {})
    };
  }

  return {
    STATUS: STATUS,
    STATUS_LABEL: STATUS_LABEL,
    resolveWorkflowListProductLabel: resolveWorkflowListProductLabel,
    deriveWorkflowListAuthoringStatus: deriveWorkflowListAuthoringStatus,
    findTerminalAuthoringStep: findTerminalAuthoringStep,
    stepHasSavedAuthoringOutput: stepHasSavedAuthoringOutput,
    mergeRunRecordForListStatus: mergeRunRecordForListStatus
  };
});
