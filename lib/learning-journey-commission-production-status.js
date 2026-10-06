/**
 * Sprint 91 — Learning Journey constituent production status (derived).
 *
 * Production state is derived from durable constituent workflow provenance and
 * existing Run/Authoring evidence. It is not stored on the Learning Journey page.
 *
 * Status ladder for supported commissions:
 *   not_commissioned → production → authoring → complete
 *
 * Unsupported commissions remain unsupported (non-actionable).
 */
(function (root, factory) {
  var api = factory(root);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.PRISM_LEARNING_JOURNEY_COMMISSION_PRODUCTION_STATUS = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  "use strict";

  var STATUS = {
    NOT_COMMISSIONED: "not_commissioned",
    PRODUCTION: "production",
    AUTHORING: "authoring",
    COMPLETE: "complete",
    UNSUPPORTED: "unsupported",
    AMBIGUOUS: "ambiguous"
  };

  function asText(value) {
    return String(value == null ? "" : value).trim();
  }

  function resolveVisualJobsWorkspaceMod() {
    if (typeof require === "function") {
      try {
        return require("./utilities-visual-jobs-workspace.js");
      } catch (_err) {
        try {
          return require("../lib/utilities-visual-jobs-workspace.js");
        } catch (_err2) {}
      }
    }
    var roots = [root, typeof globalThis !== "undefined" ? globalThis : null, typeof window !== "undefined" ? window : null];
    var i;
    for (i = 0; i < roots.length; i += 1) {
      if (roots[i] && roots[i].PRISM_UTILITIES_VISUAL_JOBS_WORKSPACE) {
        return roots[i].PRISM_UTILITIES_VISUAL_JOBS_WORKSPACE;
      }
    }
    return null;
  }

  function findDesignPageStep(workflow) {
    var steps = workflow && Array.isArray(workflow.steps) ? workflow.steps : [];
    var i;
    for (i = 0; i < steps.length; i += 1) {
      var step = steps[i];
      var cid = asText(step && (step.canonical_step_id || step.canonicalStepId)).toLowerCase();
      var title = asText(step && step.title).toLowerCase();
      if (cid === "step_design_page" || title === "design page") return step;
    }
    return null;
  }

  function findAssessmentTerminalStep(workflow) {
    var steps = workflow && Array.isArray(workflow.steps) ? workflow.steps : [];
    var i;
    for (i = 0; i < steps.length; i += 1) {
      var step = steps[i];
      var cid = asText(step && (step.canonical_step_id || step.canonicalStepId)).toLowerCase();
      var title = asText(step && step.title).toLowerCase();
      var oname = asText(step && (step.outputName || step.output_name)).toLowerCase();
      if (
        cid === "step_author_assessment_components" ||
        cid === "step_generate_assessment_items" ||
        title === "author assessment components" ||
        oname === "assessment_pack" ||
        oname === "assessment_items"
      ) {
        return step;
      }
    }
    return steps.length ? steps[steps.length - 1] : null;
  }

  function findRequiredFinalCaptureStep(workflow) {
    var design = findDesignPageStep(workflow);
    if (design) return { step: design, kind: "design_page" };
    var product = asText(workflow && workflow.product).toLowerCase();
    if (product === "assessment_pack") {
      var terminal = findAssessmentTerminalStep(workflow);
      if (terminal) return { step: terminal, kind: "assessment_terminal" };
    }
    return null;
  }

  function capturePresentForStep(step, runRecord) {
    if (!step || !step.id) return false;
    var sid = String(step.id);
    var rec = runRecord && typeof runRecord === "object" ? runRecord : {};
    var outputs = rec.capturedOutputs && typeof rec.capturedOutputs === "object" ? rec.capturedOutputs : {};
    if (asText(outputs[sid])) return true;
    var raw =
      rec.capturedOutputsRaw && typeof rec.capturedOutputsRaw === "object"
        ? rec.capturedOutputsRaw
        : {};
    if (asText(raw[sid])) return true;
    var refs = rec.captureRefs && typeof rec.captureRefs === "object" ? rec.captureRefs : {};
    var ref = refs[sid] && typeof refs[sid] === "object" ? refs[sid] : null;
    if (ref && ref.final && asText(ref.final.resource_id)) return true;
    if (ref && asText(ref.finalResourceId || ref.resource_id)) return true;
    return false;
  }

  function readCaptureTextForStep(step, runRecord) {
    if (!step || !step.id) return "";
    var sid = String(step.id);
    var rec = runRecord && typeof runRecord === "object" ? runRecord : {};
    var outputs = rec.capturedOutputs && typeof rec.capturedOutputs === "object" ? rec.capturedOutputs : {};
    if (asText(outputs[sid])) return String(outputs[sid]);
    var raw =
      rec.capturedOutputsRaw && typeof rec.capturedOutputsRaw === "object"
        ? rec.capturedOutputsRaw
        : {};
    if (asText(raw[sid])) return String(raw[sid]);
    return "";
  }

  function tryParsePageJson(raw) {
    var text = asText(raw);
    if (!text) return null;
    var body = text;
    var fence = text.match(/```json\s*\r?\n([\s\S]*?)\r?\n```/i);
    if (fence && fence[1]) body = fence[1];
    try {
      var parsed = JSON.parse(body);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
      return parsed;
    } catch (_err) {
      return null;
    }
  }

  function hasFinalDesignPageEvidence(workflow, runRecord) {
    var found = findRequiredFinalCaptureStep(workflow);
    if (!found || !found.step) return { ok: false, page: null, kind: "" };
    if (!capturePresentForStep(found.step, runRecord)) {
      return { ok: false, page: null, kind: found.kind };
    }
    var text = readCaptureTextForStep(found.step, runRecord);
    var page = tryParsePageJson(text);
    // Capture ref without hydrated body still counts as Design Page existence.
    if (!page && found.kind === "design_page") {
      return { ok: true, page: null, kind: found.kind, capturePresentWithoutBody: true };
    }
    if (found.kind === "design_page") {
      if (!page || asText(page.artifact_type).toLowerCase() !== "page") {
        // Non-empty capture that is not yet a page object: treat as present for Production→Authoring
        // only when it looks like page JSON; otherwise presence of capture still means workflow
        // produced the Design Page step output.
        return { ok: true, page: page, kind: found.kind, capturePresentWithoutBody: !page };
      }
      return { ok: true, page: page, kind: found.kind };
    }
    // Assessment terminal capture.
    return { ok: true, page: page, kind: found.kind };
  }

  function collectGenerateAffordanceIds(page) {
    var rows = page && Array.isArray(page.visual_affordances) ? page.visual_affordances : [];
    var ids = [];
    rows.forEach(function (row) {
      if (!row || typeof row !== "object") return;
      if (asText(row.visual_decision).toLowerCase() !== "generate") return;
      var id = asText(row.affordance_id || row.affordanceId);
      if (id) ids.push(id);
    });
    return ids;
  }

  /**
   * Required graphics = Authoring "Graphics (N)" = compiler briefs.
   * Never treat "could not determine" as zero-required Complete.
   */
  function summarizeResourceRefForDiagnostics(ref) {
    if (!ref || typeof ref !== "object") return null;
    return {
      workflow_id: asText(ref.workflow_id || ref.workflowId),
      resource_id: asText(ref.resource_id || ref.resourceId),
      affordance_id: asText(ref.affordance_id || ref.affordanceId),
      brief_id: asText(ref.brief_id || ref.briefId),
      lifecycle_state: asText(ref.lifecycle_state || ref.lifecycleState),
      mime_type: asText(ref.mime_type || ref.mimeType),
      resource_type: asText(ref.resource_type || ref.resourceType),
      slot_key: asText(ref.slot_key || ref.slotKey)
    };
  }

  function assessRequiredGraphicsCompletion(page, runRecord, options) {
    var opts = options && typeof options === "object" ? options : {};
    if (!page || typeof page !== "object") {
      return {
        ok: false,
        complete: false,
        determinable: false,
        requiredCount: -1,
        attachedCount: 0,
        zeroRequired: false,
        reason: "page_unavailable",
        requiredJobs: [],
        jobMatches: [],
        durableResources: []
      };
    }

    var workspaceMod = opts.visualJobsWorkspaceMod || resolveVisualJobsWorkspaceMod();
    var durableResources = (
      runRecord && Array.isArray(runRecord.workflowResourceRefs)
        ? runRecord.workflowResourceRefs
        : []
    )
      .map(summarizeResourceRefForDiagnostics)
      .filter(Boolean);
    var evidence = {
      workflowResourceRefs:
        runRecord && Array.isArray(runRecord.workflowResourceRefs)
          ? runRecord.workflowResourceRefs
          : [],
      assetsByBriefId:
        runRecord && runRecord.assetsByBriefId && typeof runRecord.assetsByBriefId === "object"
          ? runRecord.assetsByBriefId
          : {},
      expectedWorkflowId: asText(opts.expectedWorkflowId || "")
    };

    if (
      workspaceMod &&
      typeof workspaceMod.assessRequiredGraphicsJobsFromPage === "function"
    ) {
      var shared = workspaceMod.assessRequiredGraphicsJobsFromPage(page, evidence, opts);
      var sharedJobs = Array.isArray(shared.jobMatches)
        ? shared.jobMatches
        : Array.isArray(shared.briefs)
          ? shared.briefs.map(function (brief) {
              return {
                affordance_id: asText(brief && (brief.affordance_id || brief.affordanceId)),
                brief_id: asText(brief && (brief.brief_id || brief.briefId)),
                matched: false,
                matchVia: "",
                matchedResourceId: ""
              };
            })
          : [];
      return {
        ok: !!shared.ok && !!shared.determinable,
        complete: !!(shared.determinable && shared.complete),
        determinable: !!shared.determinable,
        requiredCount: shared.requiredCount,
        attachedCount: shared.attachedCount,
        zeroRequired: !!(shared.determinable && shared.zeroRequired),
        reason: shared.reason || "",
        workspaceStatus: shared.workspaceStatus || "",
        requiredJobs: sharedJobs.map(function (row) {
          return {
            affordance_id: asText(row && row.affordance_id),
            brief_id: asText(row && row.brief_id)
          };
        }),
        jobMatches: sharedJobs,
        durableResources: durableResources
      };
    }

    // Workspace module unavailable: cannot share Authoring Graphics(N) semantics.
    // Fall back only when generate affordances are explicitly enumerable; otherwise Authoring.
    if (!workspaceMod || typeof workspaceMod.buildVisualJobsWorkspaceState !== "function") {
      var affordanceIds = collectGenerateAffordanceIds(page);
      if (!affordanceIds.length) {
        // Missing module + no enumerable generate affordances: do not claim Complete.
        return {
          ok: false,
          complete: false,
          determinable: false,
          requiredCount: -1,
          attachedCount: 0,
          zeroRequired: false,
          reason: "visual_jobs_workspace_unavailable",
          requiredJobs: [],
          jobMatches: [],
          durableResources: durableResources
        };
      }
      var refs =
        runRecord && Array.isArray(runRecord.workflowResourceRefs)
          ? runRecord.workflowResourceRefs
          : [];
      var attached = 0;
      var affordanceMatches = [];
      affordanceIds.forEach(function (id) {
        var matchedResourceId = "";
        var covered = refs.some(function (ref) {
          if (!ref) return false;
          var lifecycle = asText(ref.lifecycle_state || ref.lifecycleState).toLowerCase();
          if (lifecycle && lifecycle !== "active") return false;
          if (!asText(ref.resource_id || ref.resourceId)) return false;
          var slot = asText(ref.slot_key || ref.slotKey).toLowerCase();
          if (slot === "page_video_embed" || slot.indexOf("additional") !== -1) return false;
          if (asText(ref.affordance_id || ref.affordanceId) !== id) return false;
          matchedResourceId = asText(ref.resource_id || ref.resourceId);
          return true;
        });
        if (covered) attached += 1;
        affordanceMatches.push({
          affordance_id: id,
          brief_id: "",
          matched: covered,
          matchVia: covered ? "affordance_id" : "",
          matchedResourceId: matchedResourceId
        });
      });
      return {
        ok: true,
        complete: attached >= affordanceIds.length,
        determinable: true,
        requiredCount: affordanceIds.length,
        attachedCount: attached,
        zeroRequired: false,
        reason: "affordance_fallback",
        requiredJobs: affordanceMatches.map(function (row) {
          return { affordance_id: row.affordance_id, brief_id: "" };
        }),
        jobMatches: affordanceMatches,
        durableResources: durableResources
      };
    }

    // Older workspace module without shared assessor: build state and mirror Authoring count.
    try {
      var ws = workspaceMod.buildVisualJobsWorkspaceState(page, {});
      var briefs =
        ws && ws.compilerResult && Array.isArray(ws.compilerResult.briefs)
          ? ws.compilerResult.briefs
          : [];
      var planner = ws && ws.plannerResult ? ws.plannerResult : {};
      var generateCount =
        planner.diagnostics && typeof planner.diagnostics.generate === "number"
          ? planner.diagnostics.generate
          : Array.isArray(planner.jobs)
            ? planner.jobs.length
            : 0;
      if (generateCount > 0 && !briefs.length) {
        return {
          ok: false,
          complete: false,
          determinable: false,
          requiredCount: -1,
          attachedCount: 0,
          zeroRequired: false,
          reason: "generate_jobs_without_briefs",
          requiredJobs: [],
          jobMatches: [],
          durableResources: durableResources
        };
      }
      if (!briefs.length) {
        return {
          ok: true,
          complete: true,
          determinable: true,
          requiredCount: 0,
          attachedCount: 0,
          zeroRequired: true,
          reason: "zero_required_graphics_jobs",
          requiredJobs: [],
          jobMatches: [],
          durableResources: durableResources
        };
      }
      var imageRefs =
        runRecord && Array.isArray(runRecord.workflowResourceRefs)
          ? runRecord.workflowResourceRefs
          : [];
      var attachedLegacy = 0;
      var legacyMatches = [];
      briefs.forEach(function (brief) {
        var briefAid = asText(brief && (brief.affordance_id || brief.affordanceId));
        var briefBid = asText(brief && (brief.brief_id || brief.briefId));
        var matchRow = {
          affordance_id: briefAid,
          brief_id: briefBid,
          matched: false,
          matchVia: "",
          matchedResourceId: ""
        };
        var covered = imageRefs.some(function (ref) {
          if (!ref || !brief) return false;
          var lifecycle = asText(ref.lifecycle_state || ref.lifecycleState).toLowerCase();
          if (lifecycle && lifecycle !== "active") return false;
          if (!asText(ref.resource_id || ref.resourceId)) return false;
          var slot = asText(ref.slot_key || ref.slotKey).toLowerCase();
          if (slot === "page_video_embed" || slot.indexOf("additional") !== -1) return false;
          var refAid = asText(ref.affordance_id || ref.affordanceId);
          var refBid = asText(ref.brief_id || ref.briefId);
          if (refAid && briefAid && refAid === briefAid) {
            matchRow.matched = true;
            matchRow.matchVia = "affordance_id";
            matchRow.matchedResourceId = asText(ref.resource_id || ref.resourceId);
            return true;
          }
          if (refBid && briefBid && refBid === briefBid) {
            matchRow.matched = true;
            matchRow.matchVia = "brief_id";
            matchRow.matchedResourceId = asText(ref.resource_id || ref.resourceId);
            return true;
          }
          return false;
        });
        if (covered) attachedLegacy += 1;
        legacyMatches.push(matchRow);
      });
      return {
        ok: true,
        complete: attachedLegacy >= briefs.length,
        determinable: true,
        requiredCount: briefs.length,
        attachedCount: attachedLegacy,
        zeroRequired: false,
        reason: "legacy_workspace_briefs",
        requiredJobs: legacyMatches.map(function (row) {
          return { affordance_id: row.affordance_id, brief_id: row.brief_id };
        }),
        jobMatches: legacyMatches,
        durableResources: durableResources
      };
    } catch (_err) {
      return {
        ok: false,
        complete: false,
        determinable: false,
        requiredCount: -1,
        attachedCount: 0,
        zeroRequired: false,
        reason: "workspace_build_failed",
        requiredJobs: [],
        jobMatches: [],
        durableResources: durableResources
      };
    }
  }

  function findConstituentWorkflows(workflows, learningJourneyWorkflowId, commissionId) {
    var sourceId = asText(learningJourneyWorkflowId);
    var cid = asText(commissionId);
    var rows = Array.isArray(workflows) ? workflows : [];
    if (!sourceId || !cid) return [];
    return rows.filter(function (wf) {
      if (!wf || typeof wf !== "object") return false;
      return (
        asText(wf.sourceWorkflowId || wf.source_workflow_id) === sourceId &&
        asText(wf.sourceCommissionId || wf.source_commission_id) === cid
      );
    });
  }

  function statusLabel(status) {
    if (status === STATUS.PRODUCTION) return "Production";
    if (status === STATUS.AUTHORING) return "Authoring";
    if (status === STATUS.COMPLETE) return "Complete";
    if (status === STATUS.AMBIGUOUS) return "Ambiguous";
    if (status === STATUS.UNSUPPORTED) return "Unsupported";
    return "";
  }

  /**
   * Derive production status for every commission on an LJ page.
   *
   * @param {object} input
   * @param {string} input.learningJourneyWorkflowId
   * @param {object} input.page — authoritative LJ page
   * @param {object[]} input.workflows — all persisted workflows
   * @param {object} [input.runStateByWorkflowId] — { [workflowId]: runRecord }
   * @param {function} [input.productAcceptsCommission]
   * @param {object} [input.visualJobsWorkspaceMod]
   */
  function deriveLearningJourneyCommissionProductionStatuses(input) {
    var src = input && typeof input === "object" ? input : {};
    var page = src.page && typeof src.page === "object" ? src.page : null;
    var learningJourneyWorkflowId = asText(src.learningJourneyWorkflowId || src.sourceWorkflowId);
    var workflows = Array.isArray(src.workflows) ? src.workflows : [];
    var runStateByWorkflowId =
      src.runStateByWorkflowId && typeof src.runStateByWorkflowId === "object"
        ? src.runStateByWorkflowId
        : {};
    var acceptsFn =
      typeof src.productAcceptsCommission === "function" ? src.productAcceptsCommission : null;
    var commissions = page && Array.isArray(page.commissions) ? page.commissions : [];
    var byCommissionId = {};
    var ordered = [];

    commissions.forEach(function (commission, index) {
      if (!commission || typeof commission !== "object") return;
      var commissionId = asText(commission.commission_id || commission.commissionId);
      if (!commissionId) return;
      var productId = asText(commission.product_id || commission.productId).toLowerCase();
      var commissionStatus = asText(commission.status).toLowerCase();
      if (!commissionStatus) {
        commissionStatus = productId ? "supported" : "unsupported";
      }
      var acceptsCommission = acceptsFn
        ? !!acceptsFn(productId)
        : productId === "interactive" ||
          productId === "expository" ||
          productId === "assessment_pack";

      var result = {
        commissionId: commissionId,
        sectionId: asText(commission.section_id),
        productId: productId,
        acceptsCommission: acceptsCommission,
        status: STATUS.NOT_COMMISSIONED,
        statusLabel: "",
        action: "none",
        openWorkflowId: "",
        constituentWorkflowId: "",
        constituentWorkflowIds: [],
        hasFinalDesignPage: false,
        graphicsComplete: false,
        graphicsDeterminable: false,
        requiredGraphicsCount: 0,
        attachedGraphicsCount: 0,
        zeroRequiredGraphics: false,
        graphicsReason: "",
        diagnostics: null,
        order: typeof commission.order === "number" ? commission.order : index + 1
      };

      if (commissionStatus === "unsupported" || !productId) {
        result.status = STATUS.UNSUPPORTED;
        result.statusLabel = statusLabel(STATUS.UNSUPPORTED);
        result.action = "none";
        byCommissionId[commissionId] = result;
        ordered.push(result);
        return;
      }

      if (!acceptsCommission) {
        result.status = STATUS.NOT_COMMISSIONED;
        result.action = "none";
        byCommissionId[commissionId] = result;
        ordered.push(result);
        return;
      }

      var matches = findConstituentWorkflows(workflows, learningJourneyWorkflowId, commissionId);
      result.constituentWorkflowIds = matches.map(function (wf) {
        return asText(wf.id);
      });

      if (!matches.length) {
        result.status = STATUS.NOT_COMMISSIONED;
        result.action = "create";
        byCommissionId[commissionId] = result;
        ordered.push(result);
        return;
      }

      if (matches.length > 1) {
        result.status = STATUS.AMBIGUOUS;
        result.statusLabel = statusLabel(STATUS.AMBIGUOUS);
        result.action = "open";
        result.openWorkflowId = asText(matches[0].id);
        result.constituentWorkflowId = result.openWorkflowId;
        byCommissionId[commissionId] = result;
        ordered.push(result);
        return;
      }

      var constituent = matches[0];
      var constituentId = asText(constituent.id);
      result.constituentWorkflowId = constituentId;
      result.openWorkflowId = constituentId;
      result.action = "open";

      var runRecord = runStateByWorkflowId[constituentId] || {};
      var designEvidence = hasFinalDesignPageEvidence(constituent, runRecord);
      result.hasFinalDesignPage = !!designEvidence.ok;
      var designPageBodyHydrated = !!(designEvidence.page && typeof designEvidence.page === "object");
      var diagnostics = {
        sourceLearningJourneyWorkflowId: learningJourneyWorkflowId,
        sourceCommissionId: commissionId,
        constituentWorkflowId: constituentId,
        designPageEvidenceFound: !!designEvidence.ok,
        designPageBodyHydrated: designPageBodyHydrated,
        designPageKind: asText(designEvidence.kind),
        designPageCapturePresentWithoutBody: !!designEvidence.capturePresentWithoutBody,
        graphicsPageSource: "",
        authoritativePageSource: asText(runRecord.authoritativePageSource),
        authoritativePageAssembleError: asText(runRecord.authoritativePageAssembleError),
        graphicsEvidenceSource: asText(runRecord.graphicsEvidenceSource),
        requiredGraphicsCount: -1,
        requiredJobs: [],
        durableImageResources: [],
        durableImageResourceCount: 0,
        jobMatches: [],
        assessor: {
          required: -1,
          attached: 0,
          outstanding: -1,
          determinable: false,
          complete: false,
          reason: ""
        },
        finalStatus: ""
      };

      if (!designEvidence.ok) {
        result.status = STATUS.PRODUCTION;
        result.statusLabel = statusLabel(STATUS.PRODUCTION);
        diagnostics.finalStatus = result.status;
        result.diagnostics = diagnostics;
        byCommissionId[commissionId] = result;
        ordered.push(result);
        return;
      }

      // Design Page / terminal capture exists. Assess required graphics from the same
      // authoritative assembled page Authoring uses (not Design Page capture alone).
      var graphics = {
        complete: false,
        determinable: false,
        requiredCount: -1,
        attachedCount: 0,
        zeroRequired: false,
        reason: "graphics_not_assessed",
        requiredJobs: [],
        jobMatches: [],
        durableResources: []
      };
      var pageForGraphics = null;
      if (
        runRecord.authoritativeAssembledPage &&
        typeof runRecord.authoritativeAssembledPage === "object" &&
        !Array.isArray(runRecord.authoritativeAssembledPage)
      ) {
        pageForGraphics = runRecord.authoritativeAssembledPage;
        diagnostics.graphicsPageSource =
          asText(runRecord.authoritativePageSource) || "authoritative_assembled_page";
      } else if (designEvidence.page) {
        pageForGraphics = designEvidence.page;
        diagnostics.graphicsPageSource = "design_page_capture";
      }

      if (pageForGraphics) {
        graphics = assessRequiredGraphicsCompletion(pageForGraphics, runRecord, {
          visualJobsWorkspaceMod: src.visualJobsWorkspaceMod,
          expectedWorkflowId: constituentId
        });
      } else if (designEvidence.capturePresentWithoutBody) {
        // Capture exists but body not hydrated: cannot prove outstanding graphics.
        // Remain in Authoring until page body is available to confirm zero/complete.
        graphics = {
          complete: false,
          determinable: false,
          requiredCount: -1,
          attachedCount: 0,
          zeroRequired: false,
          reason: "design_page_body_unhydrated",
          requiredJobs: [],
          jobMatches: [],
          durableResources: (
            Array.isArray(runRecord.workflowResourceRefs) ? runRecord.workflowResourceRefs : []
          )
            .map(summarizeResourceRefForDiagnostics)
            .filter(Boolean)
        };
        diagnostics.graphicsPageSource = "unhydrated_design_page_capture";
      }

      result.graphicsComplete = !!(graphics.determinable && graphics.complete);
      result.graphicsDeterminable = !!graphics.determinable;
      result.requiredGraphicsCount = graphics.requiredCount;
      result.attachedGraphicsCount = graphics.attachedCount;
      result.zeroRequiredGraphics = !!(graphics.determinable && graphics.zeroRequired);
      result.graphicsReason = graphics.reason || "";

      diagnostics.requiredGraphicsCount = graphics.requiredCount;
      diagnostics.requiredJobs = Array.isArray(graphics.requiredJobs) ? graphics.requiredJobs : [];
      diagnostics.durableImageResources = Array.isArray(graphics.durableResources)
        ? graphics.durableResources
        : [];
      diagnostics.durableImageResourceCount = diagnostics.durableImageResources.length;
      diagnostics.jobMatches = Array.isArray(graphics.jobMatches) ? graphics.jobMatches : [];
      diagnostics.assessor = {
        required: graphics.requiredCount,
        attached: graphics.attachedCount,
        outstanding:
          graphics.determinable && graphics.requiredCount >= 0
            ? Math.max(0, graphics.requiredCount - graphics.attachedCount)
            : -1,
        determinable: !!graphics.determinable,
        complete: !!(graphics.determinable && graphics.complete),
        reason: graphics.reason || ""
      };

      // Only A (zero required) and D (all required complete) may be Complete.
      // B/C outstanding and E indeterminate remain Authoring.
      if (graphics.determinable && graphics.complete) {
        result.status = STATUS.COMPLETE;
        result.statusLabel = statusLabel(STATUS.COMPLETE);
      } else {
        result.status = STATUS.AUTHORING;
        result.statusLabel = statusLabel(STATUS.AUTHORING);
      }
      diagnostics.finalStatus = result.status;
      result.diagnostics = diagnostics;

      byCommissionId[commissionId] = result;
      ordered.push(result);
    });

    return {
      ok: true,
      learningJourneyWorkflowId: learningJourneyWorkflowId,
      byCommissionId: byCommissionId,
      ordered: ordered,
      diagnostics: {
        learningJourneyWorkflowId: learningJourneyWorkflowId,
        commissions: ordered.map(function (row) {
          return row && row.diagnostics ? row.diagnostics : null;
        }).filter(Boolean)
      }
    };
  }

  function countCompleteSupportedCommissions(derivation) {
    var rows = derivation && Array.isArray(derivation.ordered) ? derivation.ordered : [];
    var complete = 0;
    var supported = 0;
    rows.forEach(function (row) {
      if (!row) return;
      if (row.status === STATUS.UNSUPPORTED) return;
      supported += 1;
      if (row.status === STATUS.COMPLETE) complete += 1;
    });
    return { complete: complete, supported: supported };
  }

  return {
    STATUS: STATUS,
    deriveLearningJourneyCommissionProductionStatuses: deriveLearningJourneyCommissionProductionStatuses,
    findConstituentWorkflows: findConstituentWorkflows,
    hasFinalDesignPageEvidence: hasFinalDesignPageEvidence,
    assessRequiredGraphicsCompletion: assessRequiredGraphicsCompletion,
    countCompleteSupportedCommissions: countCompleteSupportedCommissions,
    statusLabel: statusLabel
  };
});
