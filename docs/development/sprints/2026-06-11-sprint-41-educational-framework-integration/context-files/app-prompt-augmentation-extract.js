/**
 * Sprint 41 extract — prompt assembly entry points from app.js
 * Source: app.js (full file ~36k lines; not copied in full)
 *
 * Injection target for Educational Quality Framework:
 * applyWorkflowStepRuntimePromptAugmentations is the central runtime chain.
 */

// --- buildSeededStepPromptForWorkflowStep (source: app.js L4383–L4467) ---
  function buildSeededStepPromptForWorkflowStep(input) {
    var seed = input && typeof input === "object" ? input : {};
    var step = seed.step && typeof seed.step === "object" ? seed.step : {};
    var matchedPattern =
      seed.matchedPattern && typeof seed.matchedPattern === "object"
        ? seed.matchedPattern
        : null;
    var cfg = normalizeWorkflowStepPromptConfig(
      matchedPattern && matchedPattern.promptFactory ? matchedPattern.promptFactory : null
    );
    var inputBindings = normalizeStepInputBindings(step.inputBindings || []);
    var inputArtefactNames = inputBindings
      .map(function (b) {
        return String((b && b.artifactName) || "").trim();
      })
      .filter(function (name) {
        return !!name;
      });
    var syntheticCtx = {
      workflowName: String(seed.workflowName || "").trim(),
      workflowGoal: String(seed.workflowGoal || "").trim(),
      workflowInputs: Array.isArray(seed.workflowInputs) ? seed.workflowInputs.slice() : [],
      workflowOutputs: Array.isArray(seed.workflowOutputs) ? seed.workflowOutputs.slice() : [],
      workflowOutputSpec:
        seed.workflowOutputSpec && typeof seed.workflowOutputSpec === "object"
          ? seed.workflowOutputSpec
          : normalizeWorkflowOutputSpec({}),
      stepId: String(step.id || "").trim(),
      stepTitle: String(step.title || "").trim(),
      stepCanonicalTitle: String(step.title || "").trim(),
      stepCanonicalStepId: String(step.canonical_step_id || "").trim(),
      stepRoleLabel: String(step.roleLabel || "").trim(),
      stepOutputName: String(step.outputName || "").trim(),
      stepNotes: String(step.notes || "").trim(),
      stepInputArtefactNames: inputArtefactNames,
      stepInputArtefacts: inputBindings
        .map(function (b) {
          if (!b || !b.artifactName) return "";
          if (b.kind === "internal") return '"' + b.artifactName + '" from earlier step';
          return 'External "' + b.artifactName + '"';
        })
        .filter(function (item) {
          return !!item;
        }),
      stepInputArtefactSchemas: resolveStepInputArtefactSchemas(
        cfg.inputArtefactSchemas,
        inputArtefactNames
      )
    };
    var selectedOptions = [];
    var template = resolveWorkflowStepPromptTemplate(cfg);
    var draft = "";
    if (template) {
      var templateVars = {
        stepTitle: syntheticCtx.stepCanonicalTitle || syntheticCtx.stepTitle || "",
        stepOutputName: syntheticCtx.stepOutputName || "",
        preferredOutputFormat: cfg.preferredOutputFormat || "",
        stepNotes: stripWorkflowStepParamBlock(syntheticCtx.stepNotes || ""),
        inputArtefactTypes: Array.isArray(syntheticCtx.stepInputArtefactSchemas)
          ? syntheticCtx.stepInputArtefactSchemas
              .map(function (row) {
                return String((row && (row.type || row.artefact)) || "").trim();
              })
              .filter(function (s) {
                return !!s;
              })
              .join(", ")
          : ""
      };
      if (cfg.defaultPromptVariables && typeof cfg.defaultPromptVariables === "object") {
        Object.keys(cfg.defaultPromptVariables).forEach(function (k) {
          if (!k) return;
          if (!Object.prototype.hasOwnProperty.call(templateVars, k)) {
            var v = cfg.defaultPromptVariables[k];
            templateVars[k] = v == null ? "" : String(v);
          }
        });
      }
      draft = applyWorkflowStepPromptTemplate(template, templateVars).trim();
    }
    if (!draft) {
      draft = buildWorkflowStepPromptFallback(cfg, syntheticCtx, selectedOptions).trim();
    }
    return String(draft || "").trim();
  }

// --- resolvePedagogicEnrichmentContractIds (source: app.js L9848–L9879) ---
  function resolvePedagogicEnrichmentContractIds(context) {
    var briefCtx = resolvePedagogicCognitionBriefContextForPrompt(context);
    var resolved =
      briefCtx && briefCtx.resolved && typeof briefCtx.resolved === "object"
        ? briefCtx.resolved
        : {};
    var base = {
      goal: String(
        (context && context.workflowGoal) ||
          (briefCtx && briefCtx.explicit && briefCtx.explicit.goal) ||
          ""
      ).trim(),
      desiredOutputs: String(
        (context && context.desiredOutputs) ||
          (briefCtx && briefCtx.explicit && briefCtx.explicit.desiredOutputs) ||
          ""
      ).trim(),
      inputs: String(
        (briefCtx && briefCtx.explicit && briefCtx.explicit.inputs) ||
          (context && context.workflowInputs) ||
          ""
      ).trim()
    };
    var blob = workflowBriefPedagogicTextBlob(base);
    if (isWorkflowBriefFacilitatedDeliveryIntent(blob, resolved)) {
      return [];
    }
    if (!shouldApplySelfDirectedLearnerPageScaffoldBase(context, resolved, base)) {
      return [];
    }
    return SPRINT_30_PEC_IDS.slice();
  }

// --- applyPedagogicEnrichmentContractScaffoldToDraft (source: app.js L9881–L9911) ---
  function applyPedagogicEnrichmentContractScaffoldToDraft(draftText, context) {
    var draftBody = String(draftText || "").trim();
    var contractIds = resolvePedagogicEnrichmentContractIds(context);
    if (!contractIds.length) return draftBody;
    var isDla = isWorkflowStepDesignLearningActivities(context);
    var isDesignPage = isWorkflowStepDesignPage(context);
    var isGam = isWorkflowStepGenerateActivityMaterials(context);
    if (!isDla && !isDesignPage && !isGam) return draftBody;
    if (
      contractIds.indexOf(SPRINT_30_PEC_ORIENTATION_CONTRACT_ID) !== -1 &&
      isDla &&
      !/pedagogic enrichment — orientation contract \(auto-applied\)/i.test(draftBody)
    ) {
      draftBody = (draftBody + buildPelOrientationContractPromptBlock()).trim();
    }
    if (
      contractIds.indexOf(SPRINT_30_PEC_REASONING_CONTRACT_ID) !== -1 &&
      isDla &&
      !/pedagogic enrichment — reasoning contract \(auto-applied\)/i.test(draftBody)
    ) {
      draftBody = (draftBody + buildPelReasoningContractPromptBlock()).trim();
    }
    if (
      contractIds.indexOf(SPRINT_30_PEC_REASONING_CONTRACT_ID) !== -1 &&
      isGam &&
      !/self-directed learner-page reasoning materials \(auto-applied\)/i.test(draftBody)
    ) {
      draftBody = (draftBody + buildSelfDirectedGamPelReasoningMaterialPromptBlock()).trim();
    }
    return draftBody;
  }

// --- buildWorkflowStepPromptAugmentContextFromStep (source: app.js L9913–L9951) ---
  function buildWorkflowStepPromptAugmentContextFromStep(step, wf) {
    var wfRec = wf && typeof wf === "object" ? wf : null;
    if (!wfRec && state.selectedWorkflowId) {
      wfRec = findWorkflowById(state.selectedWorkflowId);
    }
    var stepRow = step && typeof step === "object" ? step : {};
    var outputSpec = wfRec
      ? normalizeWorkflowOutputSpec(wfRec.workflowOutputSpec)
      : normalizeWorkflowOutputSpec({});
    var ctx = {
      workflowId: wfRec ? String(wfRec.id || "") : "",
      workflowGoal: String(outputSpec.goal || (wfRec && wfRec.goal) || "").trim(),
      desiredOutputs: Array.isArray(wfRec && wfRec.workflowOutputs)
        ? wfRec.workflowOutputs.join(", ")
        : String((wfRec && wfRec.desiredOutputs) || "").trim(),
      workflowOutputs: Array.isArray(wfRec && wfRec.workflowOutputs)
        ? wfRec.workflowOutputs.slice()
        : [],
      workflowOutputSpec: outputSpec,
      stepTitle: String(stepRow.title || "").trim(),
      stepCanonicalTitle: String(
        stepRow.canonical_title || stepRow.title || ""
      ).trim(),
      stepCanonicalStepId: String(stepRow.canonical_step_id || "").trim(),
      stepOutputName: String(stepRow.outputName || "").trim(),
      stepNotes: String(stepRow.notes || "").trim()
    };
    if (
      wfRec &&
      wfRec.workflowBriefResolution &&
      wfRec.workflowBriefResolution.resolvedFactors &&
      typeof wfRec.workflowBriefResolution.resolvedFactors === "object"
    ) {
      ctx.workflowBriefResolution = {
        resolvedFactors: wfRec.workflowBriefResolution.resolvedFactors
      };
    }
    return ctx;
  }

// --- applyWorkflowStepRuntimePromptAugmentations (source: app.js L9953–L9969) ---
  function applyWorkflowStepRuntimePromptAugmentations(draftText, step, wf, optionMap) {
    var draft = String(draftText || "").trim();
    if (!draft) return "";
    var ctx = buildWorkflowStepPromptAugmentContextFromStep(step, wf);
    var map = optionMap && typeof optionMap === "object" ? optionMap : {};
    draft = applyPedagogicCognitionContractScaffoldToDraft(draft, ctx);
    draft = applySelfDirectedLearnerPageStepScaffoldsToDraft(draft, ctx);
    draft = applyLdTableFidelityContractToDraft(draft, ctx);
    draft = applyLdMaterialsCopyContractToDraft(draft, ctx);
    draft = applyPedagogicEnrichmentContractScaffoldToDraft(draft, ctx);
    draft = applyLdDesignPageComposeContractToDraft(draft, ctx);
    draft = applySprint38VisualAffordanceContractToDraft(draft, ctx);
    draft = applyMathSafeOutputContractToDraft(draft, ctx);
    draft = applyStrictJsonArtefactContractToDraft(draft, ctx);
    draft = applyEpisodePlanDlaPopulationPromptBlockToDraft(draft, ctx, wf);
    return String(draft || "").trim();
  }

// --- resolveStepPromptText (source: app.js L21897–L21943) ---
  function resolveStepPromptText(step, wf) {
    var sourceType = getStepPromptSourceType(step);
    var wfRec = wf && typeof wf === "object" ? wf : null;
    if (!wfRec && state.selectedWorkflowId) {
      wfRec = findWorkflowById(state.selectedWorkflowId);
    }
    function finalizePromptBody(body) {
      var raw = String(body || "").trim();
      if (!raw) return "";
      return applyWorkflowStepRuntimePromptAugmentations(raw, step, wfRec, {});
    }
    if (sourceType === "local_override") {
      var body = String(
        (step && (step.override_prompt_body || step.overridePromptBody)) || ""
      ).trim();
      var liveCatalogBody = resolveLiveCatalogStepPromptBody(step, wfRec);
      if (liveCatalogBody) body = liveCatalogBody;
      if (!body) {
        return {
          sourceType: sourceType,
          text: "",
          error: "Local override selected, but prompt body is empty."
        };
      }
      return { sourceType: sourceType, text: finalizePromptBody(body), error: "" };
    }
    if (sourceType === "library_prompt") {
      var libraryBody = resolveLibraryPromptBody(step && step.promptId);
      if (!libraryBody) {
        return {
          sourceType: sourceType,
          text: "",
          error: "Library prompt selected, but prompt body could not be resolved."
        };
      }
      return {
        sourceType: sourceType,
        text: finalizePromptBody(libraryBody),
        error: ""
      };
    }
    return {
      sourceType: "none",
      text: "",
      error: "No prompt configured for this step."
    };
  }
