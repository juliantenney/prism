/**
 * My Workflows list presentation helpers: product type label and compact status.
 * Status is derived from persisted/live run captures and required authoring evidence —
 * not from the currently selected step index alone.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(typeof globalThis !== "undefined" ? globalThis : root);
  } else {
    root.PRISM_WORKFLOW_LIST_PRESENTATION = factory(root);
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  "use strict";

  var STATUS = {
    NO_DATA: "no_data",
    INCOMPLETE: "incomplete",
    AUTHORING: "authoring",
    COMPLETED: "completed"
  };

  var STATUS_LABEL = {
    no_data: "No data",
    incomplete: "Incomplete",
    authoring: "Authoring",
    completed: "Completed"
  };

  var STATUS_ICON = {
    no_data: "○",
    incomplete: "◐",
    authoring: "✎",
    completed: "✓"
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

  function resolveProductionStatusMod(options) {
    var opts = options && typeof options === "object" ? options : {};
    if (opts.productionStatusMod) return opts.productionStatusMod;
    if (typeof require === "function") {
      try {
        return require("./learning-journey-commission-production-status.js");
      } catch (_err) {}
    }
    var host = root || (typeof globalThis !== "undefined" ? globalThis : null);
    return host && host.PRISM_LEARNING_JOURNEY_COMMISSION_PRODUCTION_STATUS
      ? host.PRISM_LEARNING_JOURNEY_COMMISSION_PRODUCTION_STATUS
      : null;
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

  function tryParseJsonObject(raw) {
    var body = text(raw);
    if (!body) return null;
    try {
      var parsed = JSON.parse(body);
      return asObject(parsed);
    } catch (_err) {
      return null;
    }
  }

  function resolvePageFromRunRecord(runRecord, terminalId) {
    var rec = asObject(runRecord) || {};
    if (asObject(rec.authoritativeAssembledPage)) return rec.authoritativeAssembledPage;
    if (asObject(rec.page)) return rec.page;
    var sid = text(terminalId);
    if (!sid) return null;
    var finals = asObject(rec.capturedOutputs) || {};
    var raws = asObject(rec.capturedOutputsRaw) || {};
    var parsed = tryParseJsonObject(finals[sid]) || tryParseJsonObject(raws[sid]);
    if (!parsed) return null;
    if (String(parsed.artifact_type || "").toLowerCase() === "page") return parsed;
    if (asObject(parsed.page)) return parsed.page;
    return parsed;
  }

  /**
   * Required authoring = existing Graphics(N) / required-graphics completion rules.
   * Optional authoring opportunities are not treated as mandatory.
   * When the page body is unavailable, completion is not claimed.
   */
  function assessRequiredAuthoringOutstanding(workflow, runRecord, options) {
    var opts = options && typeof options === "object" ? options : {};
    var terminal = findTerminalAuthoringStep(workflow);
    var terminalId = text(terminal && terminal.id);
    var page = resolvePageFromRunRecord(runRecord, terminalId);
    if (!page) {
      return {
        outstanding: true,
        determinable: false,
        reason: "page_unavailable",
        requiredCount: -1,
        attachedCount: 0
      };
    }
    var productionMod = resolveProductionStatusMod(opts);
    if (
      productionMod &&
      typeof productionMod.assessRequiredGraphicsCompletion === "function"
    ) {
      var graphics = productionMod.assessRequiredGraphicsCompletion(page, runRecord, {
        visualJobsWorkspaceMod: opts.visualJobsWorkspaceMod || null,
        expectedWorkflowId: text(workflow && workflow.id)
      });
      return {
        outstanding: !(graphics && graphics.determinable && graphics.complete),
        determinable: !!(graphics && graphics.determinable),
        reason: (graphics && graphics.reason) || "",
        requiredCount: graphics ? graphics.requiredCount : -1,
        attachedCount: graphics ? graphics.attachedCount : 0,
        zeroRequired: !!(graphics && graphics.zeroRequired)
      };
    }
    return {
      outstanding: true,
      determinable: false,
      reason: "assessor_unavailable",
      requiredCount: -1,
      attachedCount: 0
    };
  }

  function statusPayload(status, extras) {
    var label = STATUS_LABEL[status] || STATUS_LABEL.no_data;
    var detail =
      status === STATUS.COMPLETED
        ? "Completed — pipeline finished and required authoring satisfied"
        : status === STATUS.AUTHORING
          ? "Authoring — pipeline finished; required authoring still outstanding"
          : status === STATUS.INCOMPLETE
            ? "Incomplete — saved step output exists; pipeline not finished"
            : "No data — no saved step outputs or completed authoring artefact";
    return Object.assign(
      {
        status: status,
        label: label,
        icon: STATUS_ICON[status] || STATUS_ICON.no_data,
        title: detail,
        ariaLabel: "Workflow status: " + label
      },
      extras && typeof extras === "object" ? extras : {}
    );
  }

  /**
   * Derive compact My Workflows status for one workflow from its own run record.
   * Parent Learning Journey and constituent products each use their own evidence.
   */
  function deriveWorkflowListAuthoringStatus(workflow, runRecord, options) {
    var opts = options && typeof options === "object" ? options : {};
    var savedIds = collectSavedStepIds(runRecord);
    var terminal = findTerminalAuthoringStep(workflow);
    var terminalId = text(terminal && terminal.id);
    var terminalSaved = terminalId ? stepHasSavedAuthoringOutput(runRecord, terminalId) : false;

    if (!savedIds.length) {
      return statusPayload(STATUS.NO_DATA, {
        terminalStepId: terminalId || "",
        savedStepCount: 0
      });
    }
    if (!terminalSaved) {
      return statusPayload(STATUS.INCOMPLETE, {
        terminalStepId: terminalId || "",
        savedStepCount: savedIds.length
      });
    }

    var authoring = assessRequiredAuthoringOutstanding(workflow, runRecord, opts);
    if (authoring.outstanding) {
      return statusPayload(STATUS.AUTHORING, {
        terminalStepId: terminalId || "",
        savedStepCount: savedIds.length,
        authoringReason: authoring.reason || "",
        requiredGraphicsCount: authoring.requiredCount,
        attachedGraphicsCount: authoring.attachedCount
      });
    }
    return statusPayload(STATUS.COMPLETED, {
      terminalStepId: terminalId || "",
      savedStepCount: savedIds.length,
      authoringReason: authoring.reason || "",
      requiredGraphicsCount: authoring.requiredCount,
      attachedGraphicsCount: authoring.attachedCount
    });
  }

  function mergeRunRecordForListStatus(durableRecord, liveOverlay) {
    var durable = asObject(durableRecord) || {};
    var hasLive = liveOverlay != null && typeof liveOverlay === "object";
    var live = hasLive ? asObject(liveOverlay) || {} : {};
    var durableRefs = Array.isArray(durable.workflowResourceRefs)
      ? durable.workflowResourceRefs
      : [];
    var liveRefs = Array.isArray(live.workflowResourceRefs) ? live.workflowResourceRefs : [];
    return {
      capturedOutputs: Object.assign(
        {},
        asObject(durable.capturedOutputs) || {},
        asObject(live.capturedOutputs) || {}
      ),
      capturedOutputsRaw: Object.assign(
        {},
        asObject(durable.capturedOutputsRaw) || {},
        asObject(live.capturedOutputsRaw) || {}
      ),
      captureRefs: Object.assign(
        {},
        asObject(durable.captureRefs) || {},
        asObject(live.captureRefs) || {}
      ),
      // When a live overlay is present (selected workflow), its refs are authoritative —
      // including an empty array after a required graphic was removed.
      workflowResourceRefs: hasLive ? liveRefs.slice() : durableRefs.slice(),
      assetsByBriefId: hasLive
        ? Object.assign({}, asObject(live.assetsByBriefId) || {})
        : Object.assign({}, asObject(durable.assetsByBriefId) || {}),
      // Prefer live Authoring page snapshot / hydrated assemble, then durable cache.
      authoritativeAssembledPage:
        asObject(live.authoritativeAssembledPage) ||
        asObject(durable.authoritativeAssembledPage) ||
        null,
      page: asObject(live.page) || asObject(durable.page) || null
    };
  }

  return {
    STATUS: STATUS,
    STATUS_LABEL: STATUS_LABEL,
    resolveWorkflowListProductLabel: resolveWorkflowListProductLabel,
    deriveWorkflowListAuthoringStatus: deriveWorkflowListAuthoringStatus,
    assessRequiredAuthoringOutstanding: assessRequiredAuthoringOutstanding,
    findTerminalAuthoringStep: findTerminalAuthoringStep,
    stepHasSavedAuthoringOutput: stepHasSavedAuthoringOutput,
    mergeRunRecordForListStatus: mergeRunRecordForListStatus
  };
});
