(function () {
  "use strict";

  // Toggle to help diagnose API/model issues.
  var DEBUG_OPENAI = true;
  // Toggle temporary workflow-generation trace logs.
  var DEBUG_WORKFLOW_TRACE = false;

  function logWorkflowTrace() {
    if (!DEBUG_WORKFLOW_TRACE) return;
    try {
      var args = Array.prototype.slice.call(arguments);
      console.info.apply(console, args);
    } catch (_e) {}
  }

  // -----------------------------
  // System prompt (required text)
  // -----------------------------

  var SYSTEM_PROMPT =
    "You are an expert prompt\u2011refinement assistant.\n\n" +
    "Objective: iteratively ask one concise follow\u2011up question at a time to clarify the user\u2019s task and turn the brief into a high\u2011quality, reusable prompt.\n\n" +
    "Before finalizing, you MUST internally check that the prompt includes (when relevant):\n" +
    "- Role/persona and audience\n" +
    "- Clear task + success criteria\n" +
    "- Inputs the user should provide (and how to use them)\n" +
    "- Constraints / must-haves / do-not-do\n" +
    "- Output format and structure (e.g. headings, bullets, JSON schema)\n" +
    "- Tone/voice and depth/length guidance\n" +
    "- Edge cases / ambiguity handling (what to do if info is missing)\n" +
    "- A short self-check rubric for the model (optional but often helpful)\n\n" +
    "Ask one question at a time until the checklist is sufficiently satisfied. Prefer questions that materially improve output quality (avoid generic or redundant questions).\n\n" +
    "When you have enough information to propose a strong prompt, you may internally draft and critique it, but you must NOT return the completion JSON until you are satisfied that the prompt is clear, complete, and aligned with the brief and constraints.\n\n" +
    "When you are ready to finalize, return ONLY the following JSON:\n\n" +
    "{\n" +
    '  \"status\": \"complete\",\n' +
    '  \"final_prompt\": \"...\",\n' +
    '  \"summary\": \"...\"\n' +
    "}\n\n" +
    "Rules:\n" +
    "- Ask exactly one follow\u2011up question per turn while information is missing or ambiguous.\n" +
    "- Be specific about missing parameters.\n" +
    "- If user input is ambiguous, ask for clarification.\n" +
    "- You may critique your own draft prompts and, if you find issues, ask further questions instead of finalizing.\n" +
    "- Ensure the final_prompt is a single, self\u2011contained prompt that a separate model can run directly.\n" +
    "- When complete, return ONLY the JSON above with no extra text.";

  var WORKFLOW_DESIGN_SYSTEM_PROMPT =
    "You are a workflow design assistant.\n\n" +
    "Use the provided platform/domain context to design workflows.\n\n" +
    "Return JSON ONLY with this shape:\n\n" +
    "{\n" +
    '  \"status\": \"complete\",\n' +
    '  \"summary\": \"One short sentence describing the workflow.\",\n' +
    '  \"steps\": [\n' +
    "    {\n" +
    '      \"title\": \"Short step title\",\n' +
    '      \"role\": \"Very short purpose label\",\n' +
    '      \"depends_on\": [1]\n' +
    "    }\n" +
    "  ]\n" +
    "}\n\n" +
    "Compactness rules:\n" +
    "- Be concise.\n" +
    "- Return only workflow structure, not rationale.\n" +
    "- Do not explain your reasoning unless explicitly asked.\n" +
    "- Keep summary to one short sentence.\n" +
    "- Keep each step role/purpose very short.\n" +
    "- For small requests, return the smallest valid workflow.\n" +
    "- If scope indicates single_activity, do not add session or module framing.\n\n" +
    "Do not include commentary outside JSON.";
  var REVIEW_SYSTEM_PROMPT =
    "You are an expert prompt reviewer. You will be given a structured brief, a draft summary, and a draft prompt.\n\n" +
    "Your job is to:\n" +
    "1) Critically review the draft prompt for clarity, completeness, and alignment with the brief and constraints.\n" +
    "2) Identify any additional information or clarifications that, if provided by the user, would materially improve quality, robustness, and usability.\n\n" +
    "DEFAULT BEHAVIOUR (IMPORTANT): assume the draft can almost always be improved.\n" +
    "- If ANY meaningful improvement is possible, ask follow\u2011up questions.\n" +
    "- Ask 2\u20135 high-value questions when possible (one per line).\n" +
    "- Only respond with NO_FURTHER_QUESTIONS when the draft already includes all critical details and would perform well without further clarification.\n\n" +
    "High-value question checklist (use only what is missing):\n" +
    "- Missing inputs (what the user will paste/upload/link) and how to use them\n" +
    "- Missing output structure (headings, sections, JSON schema) and examples\n" +
    "- Missing constraints / do-nots / must-haves\n" +
    "- Missing success criteria (what a good answer looks like)\n" +
    "- Missing tone/voice and level of depth\n" +
    "- Edge cases (what to do if key info is missing or contradictory)\n\n" +
    "Rules:\n" +
    "- One question per line.\n" +
    "- Questions must be specific and actionable.\n" +
    "- Avoid yes/no when a short constrained answer would be better.\n" +
    "- Do NOT include bullets, numbering, or any extra commentary.\n\n" +
    "Respond with either:\n" +
    "- 2\u20135 follow\u2011up questions (one per line), OR\n" +
    "- The exact text NO_FURTHER_QUESTIONS.\n";


  // Rough pricing estimates (USD per 1M tokens, input vs output).
  // Used only for developer-facing cost hints; your actual account pricing applies.
  var MODEL_PRICING = {
    // 5.x chat
    "gpt-5.2": { inputPerM: 1.75, outputPerM: 14.0 },
    "gpt-5-mini": { inputPerM: 0.25, outputPerM: 2.0 },
    "gpt-5.1-mini": { inputPerM: 0.25, outputPerM: 2.0 },

    // 4.x
    "gpt-4.1": { inputPerM: 2.0, outputPerM: 8.0 },
    "gpt-4.1-mini": { inputPerM: 0.4, outputPerM: 1.6 },
    "gpt-4o-mini": { inputPerM: 0.15, outputPerM: 0.6 },

    // Legacy
    "gpt-3.5-turbo": { inputPerM: 0.5, outputPerM: 1.0 }
  };

  // -----------------------------
  // DOM references
  // -----------------------------

  var els = {};
  // Prompt Studio canonical state boundaries:
  // - brief state: user-authored refinement inputs from Prompt Studio fields
  // - runtime session state: transient conversation/refinement lifecycle fields
  // - prompt asset state: durable Prompt Library entities and selection
  var state = {
    apiKey: null,
    messages: [],
    // Refinement runtime lifecycle flags (Prompt Studio).
    // These model conversation phase only; they are not durable prompt assets.
    sessionActive: false,
    // Finalized runtime refinement result currently shown in Final Prompt.
    finalResult: null,
    // Draft/refined candidate awaiting a lifecycle decision (review/confirm/finalize).
    pendingFinal: null,
    // User is reviewing candidate final text and can accept ("no") or add changes.
    awaitingFinalConfirmation: false,
    // Reviewer follow-up questions are active and waiting for user answers.
    awaitingReviewAnswer: false,
    // Marks that current final JSON pass is post-review (used to branch apply flow).
    fromReview: false,
    // Runtime displayed refinement outputs (draft/refined) for current session only.
    promptVersions: null,
    // Which runtime refinement version is currently displayed in Final Prompt textarea.
    selectedPromptVersion: null,
    // Waiting for yes/no on whether to run reviewer pass against pendingFinal.
    awaitingReviewOptIn: false,
    // Remaining queued reviewer questions for current review phase.
    reviewQuestions: [],
    // Prompt Asset Lifecycle Contract (durable/canonical Prompt Library state):
    // - canonical durable state in app runtime: state.prompts + state.selectedPromptId
    // - user-authored fields: title, body, notes, tags
    // - system-derived fields: id, createdAt, updatedAt, usageCount, versions
    // - Prompt Studio runtime/brief state remains separate (non-durable)
    // - library filters/detail panes are derived projections of canonical prompt assets
    prompts: [],
    selectedPromptId: null,
    workflows: [],
    selectedWorkflowId: null,
    tokenUsage: {
      sessionPrompt: 0,
      sessionCompletion: 0,
      sessionTotal: 0,
      lastPrompt: 0,
      lastCompletion: 0,
      lastTotal: 0,
      sessionCost: 0,
      lastCost: 0
    },
    currentWorkflowRunIndex: 0,
    workflowRunVisibleStepId: "",
    workflowRunCopiedStepId: "",
    workflowDesignResult: null,
    workflowDesignVersions: null,
    workflowSelectedVersion: "refined",
    workflowAwaitingRefineOptIn: false,
    workflowAwaitingSuggestionAnswer: false,
    workflowReviewSuggestions: null,
    workflowReviewIndex: 0,
    workflowAwaitingDeepRefineOptIn: false,
    workflowDeepRefineContext: null,
    workflowBriefElicitation: null,
    workflowDomainSuggestionPending: null,
    workflowBriefInferenceConfirmation: null,
    workflowBriefResolved: null,
    workflowBriefShowDefaults: false,
    workflowSelectedDomains: ["general"],
    workflowDomainOptions: [],
    workflowStepPatternCatalog: [],
    workflowDomainUiConfig: null,
    promptFactoryWorkflowContext: null,
    workflowStepGeneratedDraft: "",
    assessmentItemsShowAdvancedOptions: false,
    utilitiesLastHtml: "",
    utilitiesLastFileName: "",
    utilitiesPresentationMode: "single_page"
  };

  var WORKFLOW_STORAGE_KEY = "promptr.workflows.v1";

  function cacheElements() {
    els.apiKeyFile = document.getElementById("apiKeyFile");
    els.apiKeyStatus = document.getElementById("apiKeyStatus");
    els.apiKeyHelperText = document.getElementById("apiKeyHelperText");
    els.apiSettings = document.getElementById("apiSettings");
    els.apiKeyControls = document.querySelector(".api-key-controls");

    els.outputType = document.getElementById("outputType");
    els.outputTypeGroup = document.getElementById("outputTypeGroup");
    els.creativitySelect = document.getElementById("creativitySelect");
    els.responseDetailSelect = document.getElementById("responseDetailSelect");

    els.promptAudience = document.getElementById("promptAudience");
    els.promptRole = document.getElementById("promptRole");
    els.promptTone = document.getElementById("promptTone");
    els.promptContext = document.getElementById("promptContext");
    els.promptGoal = document.getElementById("promptGoal");
    els.promptFormat = document.getElementById("promptFormat");
    els.promptLength = document.getElementById("promptLength");
    els.promptLengthGroup = document.getElementById("promptLengthGroup");
    els.promptConstraints = document.getElementById("promptConstraints");
    els.promptAudienceGroup = document.getElementById("promptAudienceGroup");
    els.promptRoleGroup = document.getElementById("promptRoleGroup");
    els.promptGoalGroup = document.getElementById("promptGoalGroup");
    els.promptContextGroup = document.getElementById("promptContextGroup");
    els.promptToneGroup = document.getElementById("promptToneGroup");
    els.promptFormatGroup = document.getElementById("promptFormatGroup");
    els.promptConstraintsGroup = document.getElementById("promptConstraintsGroup");
    els.textReadingLevelGroup = document.getElementById("textReadingLevelGroup");
    els.codeFrameworkGroup = document.getElementById("codeFrameworkGroup");
    els.codeStyleGroup = document.getElementById("codeStyleGroup");
    els.imageSubjectGroup = document.getElementById("imageSubjectGroup");
    els.imageCompositionGroup = document.getElementById("imageCompositionGroup");
    els.imageLightingGroup = document.getElementById("imageLightingGroup");
    els.imageSizeGroup = document.getElementById("imageSizeGroup");
    els.imagePaletteGroup = document.getElementById("imagePaletteGroup");
    els.imageTextGroup = document.getElementById("imageTextGroup");
    els.imageSceneGroup = document.getElementById("imageSceneGroup");
    els.structuredValidationGroup = document.getElementById("structuredValidationGroup");
    els.workflowPromptWizardNotice = document.getElementById("workflowPromptWizardNotice");
    els.workflowPromptWizardTitle = document.getElementById("workflowPromptWizardTitle");
    els.workflowPromptWizardHint = document.getElementById("workflowPromptWizardHint");
    els.workflowStepConfigPanel = document.getElementById("workflowStepConfigPanel");
    els.workflowStepConfigTitle = document.getElementById("workflowStepConfigTitle");
    els.workflowStepConfigHint = document.getElementById("workflowStepConfigHint");
    els.workflowStepConfigOptions = document.getElementById("workflowStepConfigOptions");
    els.exitWorkflowPromptWizardBtn = document.getElementById("exitWorkflowPromptWizardBtn");

    // Type-specific brief fields
    els.typeFieldsText = document.getElementById("typeFieldsText");
    els.typeFieldsCode = document.getElementById("typeFieldsCode");
    els.typeFieldsImage = document.getElementById("typeFieldsImage");
    els.typeFieldsStructured = document.getElementById("typeFieldsStructured");

    els.textReadingLevel = document.getElementById("textReadingLevel");

    els.codeLanguage = document.getElementById("codeLanguage");
    els.codeFramework = document.getElementById("codeFramework");
    els.codeEnvironment = document.getElementById("codeEnvironment");
    els.codeStyle = document.getElementById("codeStyle");

    els.imageSubject = document.getElementById("imageSubject");
    els.imageStyle = document.getElementById("imageStyle");
    els.imageComposition = document.getElementById("imageComposition");
    els.imageLighting = document.getElementById("imageLighting");
    els.imageAspectRatio = document.getElementById("imageAspectRatio");
    els.imageSize = document.getElementById("imageSize");
    els.imagePalette = document.getElementById("imagePalette");
    els.imageText = document.getElementById("imageText");
    els.imageScene = document.getElementById("imageScene");

    els.structuredSchema = document.getElementById("structuredSchema");
    els.structuredValidation = document.getElementById("structuredValidation");

    els.initialPrompt = document.getElementById("initialPrompt");
    els.startRefinementBtn = document.getElementById("startRefinementBtn");
    els.copyBriefForCopilotBtn = document.getElementById("copyBriefForCopilotBtn");
    els.newBriefBtn = document.getElementById("newBriefBtn");

    els.tabRefiner = document.getElementById("tabRefiner");
    els.tabLibrary = document.getElementById("tabLibrary");
    els.tabWorkflowFactory = document.getElementById("tabWorkflowFactory");
    els.tabWorkflows = document.getElementById("tabWorkflows");
    els.tabUtilities = document.getElementById("tabUtilities");
    els.refinementPanel = document.getElementById("refinementPanel");
    els.libraryPanel = document.getElementById("libraryPanel");
    els.workflowFactoryPanel = document.getElementById("workflowFactoryPanel");
    els.workflowsPanel = document.getElementById("workflowsPanel");
    els.utilitiesPanel = document.getElementById("utilitiesPanel");

    // Workflow Factory elements
    els.wfDesignName = document.getElementById("wfDesignName");
    els.wfDesignIntent = document.getElementById("wfDesignIntent");
    els.wfDesignAudience = document.getElementById("wfDesignAudience");
    els.wfDesignScale = document.getElementById("wfDesignScale");
    els.wfDesignInputs = document.getElementById("wfDesignInputs");
    els.wfDesignInputsLabel = document.getElementById("wfDesignInputsLabel");
    els.wfDesignStartingArtefact = document.getElementById("wfDesignStartingArtefact");
    els.wfDesignDesiredOutputs = document.getElementById("wfDesignDesiredOutputs");
    els.wfDesignScopeConstraints = document.getElementById("wfDesignScopeConstraints");
    els.wfDesignIntentHint = document.getElementById("wfDesignIntentHint");
    els.wfDesignAudienceHint = document.getElementById("wfDesignAudienceHint");
    els.wfDesignScaleHint = document.getElementById("wfDesignScaleHint");
    els.wfDesignInputsHint = document.getElementById("wfDesignInputsHint");
    els.wfDesignStartingArtefactHint = document.getElementById("wfDesignStartingArtefactHint");
    els.wfDesignDesiredOutputsHint = document.getElementById("wfDesignDesiredOutputsHint");
    els.wfDesignConstraintsHint = document.getElementById("wfDesignConstraintsHint");
    els.wfDomainExtraFields = document.getElementById("wfDomainExtraFields");
    els.wfDesignDomainSelect = document.getElementById("wfDesignDomainSelect");
    els.wfDesignStartBtn = document.getElementById("wfDesignStartBtn");
    els.wfDesignStatus = document.getElementById("wfDesignStatus");
    els.wfDesignLog = document.getElementById("wfDesignLog");
    els.wfDesignSummary = document.getElementById("wfDesignSummary");
    els.wfDesignSteps = document.getElementById("wfDesignSteps");
    els.wfDesignVersionSelect = document.getElementById("wfDesignVersionSelect");
    els.wfDesignSaveBtn = document.getElementById("wfDesignSaveBtn");
    els.wfDesignReviewBtn = document.getElementById("wfDesignReviewBtn");
    els.wfDesignAnswer = document.getElementById("wfDesignAnswer");
    els.wfDesignSendBtn = document.getElementById("wfDesignSendBtn");
    els.wfBriefResolvedDetails = document.getElementById("wfBriefResolvedDetails");
    els.wfBriefResolvedSummary = document.getElementById("wfBriefResolvedSummary");
    els.wfBriefResolvedContent = document.getElementById("wfBriefResolvedContent");

    els.sessionStatus = document.getElementById("sessionStatus");
    els.conversationLog = document.getElementById("conversationLog");
    els.followUpContainer = document.getElementById("followUpContainer");
    els.followUpAnswer = document.getElementById("followUpAnswer");
    els.sendFollowUpBtn = document.getElementById("sendFollowUpBtn");
    els.finishRefinementBtn = document.getElementById("finishRefinementBtn");

    els.finalPrompt = document.getElementById("finalPrompt");
    els.finalSummary = document.getElementById("finalSummary");
    els.promptVersionSelect = document.getElementById("promptVersionSelect");
    els.copyFinalPromptBtn = document.getElementById("copyFinalPromptBtn");
    els.saveToLibraryBtn = document.getElementById("saveToLibraryBtn");

    els.tokenUsage = document.getElementById("tokenUsage");

    els.libraryList = document.getElementById("libraryList");
    els.libraryDetail = document.getElementById("libraryDetail");
    els.librarySearch = document.getElementById("librarySearch");
    els.tagFilter = document.getElementById("tagFilter");
    els.libraryWorkflowFilter = document.getElementById("libraryWorkflowFilter");
    els.sortSelect = document.getElementById("sortSelect");
    els.newPromptBtn = document.getElementById("newPromptBtn");
    els.exportAllBtn = document.getElementById("exportAllBtn");
    els.importFileInput = document.getElementById("importFileInput");

    els.detailTitle = document.getElementById("detailTitle");
    els.detailModel = null;
    els.detailTemperature = null;
    els.detailMaxTokens = null;
    els.detailTags = document.getElementById("detailTags");
    els.detailNotes = document.getElementById("detailNotes");
    els.detailBody = document.getElementById("detailBody");
    els.detailMetaCreated = document.getElementById("detailMetaCreated");
    els.detailMetaUpdated = document.getElementById("detailMetaUpdated");
    els.detailMetaUsage = document.getElementById("detailMetaUsage");

    els.duplicatePromptBtn = document.getElementById("duplicatePromptBtn");

    // Workflow run-mode summary elements
    els.workflowRunName = document.getElementById("workflowRunName");
    els.workflowRunText = document.getElementById("workflowRunText");
    els.renamePromptBtn = document.getElementById("renamePromptBtn");
    els.deletePromptBtn = document.getElementById("deletePromptBtn");
    els.savePromptChangesBtn = document.getElementById("savePromptChangesBtn");
    els.usePromptBtn = document.getElementById("usePromptBtn");
    els.exportPromptBtn = document.getElementById("exportPromptBtn");
    els.copyPromptBodyBtn = document.getElementById("copyPromptBodyBtn");
    els.versionsList = document.getElementById("versionsList");

    // Workflows
    els.workflowList = document.getElementById("workflowList");
    els.workflowDetail = document.getElementById("workflowDetail");
    els.workflowName = document.getElementById("workflowName");
    els.workflowArtefacts = document.getElementById("workflowArtefacts");
    els.workflowOutputs = document.getElementById("workflowOutputs");
    els.workflowStartingArtefact = document.getElementById("workflowStartingArtefact");
    els.workflowScopeConstraints = null;
    els.workflowAudience = document.getElementById("workflowAudience");
    els.workflowGoal = document.getElementById("workflowGoal");
    els.workflowConstraints = document.getElementById("workflowConstraints");
    els.workflowNameHint = document.getElementById("workflowNameHint");
    els.workflowGoalHint = document.getElementById("workflowGoalHint");
    els.workflowConstraintsHint = document.getElementById("workflowConstraintsHint");
    els.workflowAudienceHint = document.getElementById("workflowAudienceHint");
    els.workflowArtefactsHint = document.getElementById("workflowArtefactsHint");
    els.workflowOutputsHint = document.getElementById("workflowOutputsHint");
    els.workflowValidationPanel = document.getElementById("workflowValidationPanel");
    els.workflowSteps = document.getElementById("workflowSteps");
    els.newWorkflowBtn = document.getElementById("newWorkflowBtn");
    els.duplicateWorkflowBtn = document.getElementById("duplicateWorkflowBtn");
    els.renameWorkflowBtn = document.getElementById("renameWorkflowBtn");
    els.addWorkflowStepBtn = document.getElementById("addWorkflowStepBtn");
    els.saveWorkflowBtn = document.getElementById("saveWorkflowBtn");
    els.saveWorkflowBtnBottom = document.getElementById("saveWorkflowBtnBottom");
    els.deleteWorkflowBtn = document.getElementById("deleteWorkflowBtn");
    els.copyWorkflowSummaryBtn = document.getElementById("copyWorkflowSummaryBtn");
    els.exportAllWorkflowsBtn = document.getElementById("exportAllWorkflowsBtn");
    els.exportWorkflowBtn = document.getElementById("exportWorkflowBtn");
    els.importWorkflowsInput = document.getElementById("importWorkflowsInput");
    els.workflowModeEditBtn = document.getElementById("workflowModeEditBtn");
    els.workflowModeRunBtn = document.getElementById("workflowModeRunBtn");
    els.workflowRunStatus = document.getElementById("workflowRunStatus");
    els.workflowPrevStepBtn = document.getElementById("workflowPrevStepBtn");
    els.workflowNextStepBtn = document.getElementById("workflowNextStepBtn");

    // Utilities
    els.utilitiesOutputFormat = document.getElementById("utilitiesOutputFormat");
    els.utilitiesPresentationMode = document.getElementById("utilitiesPresentationMode");
    els.utilitiesFileName = document.getElementById("utilitiesFileName");
    els.utilitiesJsonInput = document.getElementById("utilitiesJsonInput");
    els.utilitiesGenerateBtn = document.getElementById("utilitiesGenerateBtn");
    els.utilitiesDownloadBtn = document.getElementById("utilitiesDownloadBtn");
    els.utilitiesOpenTabBtn = document.getElementById("utilitiesOpenTabBtn");
    els.utilitiesClearBtn = document.getElementById("utilitiesClearBtn");
    els.utilitiesPreviewPanel = document.getElementById("utilitiesPreviewPanel");
    els.utilitiesPreviewError = document.getElementById("utilitiesPreviewError");
    els.utilitiesPreviewFrame = document.getElementById("utilitiesPreviewFrame");

    els.toastContainer = document.getElementById("toastContainer");
  }

  // -----------------------------
  // Toast notifications
  // -----------------------------

  function showToast(message, type) {
    if (!els.toastContainer) return;
    var toast = document.createElement("div");
    toast.className =
      "toast" +
      (type === "error"
        ? " toast-error"
        : type === "success"
        ? " toast-success"
        : type === "warning"
        ? " toast-warning"
        : "");

    var msgSpan = document.createElement("span");
    msgSpan.className = "toast-message";
    msgSpan.textContent = message;

    var closeBtn = document.createElement("button");
    closeBtn.className = "toast-close";
    closeBtn.setAttribute("aria-label", "Dismiss notification");
    closeBtn.textContent = "×";
    closeBtn.addEventListener("click", function () {
      hideToast(toast);
    });

    toast.appendChild(msgSpan);
    toast.appendChild(closeBtn);
    els.toastContainer.appendChild(toast);

    setTimeout(function () {
      hideToast(toast);
    }, 4000);
  }

  function hideToast(toast) {
    if (!toast || !toast.parentNode) return;
    toast.style.animation = "toast-out 0.2s forwards";
    setTimeout(function () {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 210);
  }

  function updateTokenUsage(usage, modelId) {
    if (!usage) return;
    var u = state.tokenUsage;
    u.lastPrompt = usage.prompt_tokens || 0;
    u.lastCompletion = usage.completion_tokens || 0;
    u.lastTotal = usage.total_tokens || u.lastPrompt + u.lastCompletion;

    // Cost estimates, if we have pricing for this model.
    u.lastCost = 0;
    var pricing = modelId && MODEL_PRICING[modelId] ? MODEL_PRICING[modelId] : null;
    if (pricing) {
      var inRate = pricing.inputPerM || 0;
      var outRate = pricing.outputPerM || 0;
      var promptCost = (u.lastPrompt / 1e6) * inRate;
      var completionCost = (u.lastCompletion / 1e6) * outRate;
      u.lastCost = promptCost + completionCost;
    } else {
      u.lastCost = null;
    }

    u.sessionPrompt += u.lastPrompt;
    u.sessionCompletion += u.lastCompletion;
    u.sessionTotal += u.lastTotal;
    if (u.lastCost != null) {
      u.sessionCost += u.lastCost;
    }

    if (els.tokenUsage) {
      var sessionCostStr =
        u.lastCost != null ? "$" + u.sessionCost.toFixed(4) : "$0.0000";
      els.tokenUsage.textContent =
        "Input: " +
        u.sessionPrompt +
        "; Output: " +
        u.sessionCompletion +
        "; Total: " +
        u.sessionTotal +
        "; Approx cost: " +
        sessionCostStr;
    }
  }

  function updateOutputTypeVisibility() {
    var outputType = getSelectedOutputType();
    if (els.typeFieldsText) {
      els.typeFieldsText.classList.toggle("hidden", outputType !== "text");
    }
    if (els.typeFieldsCode) {
      els.typeFieldsCode.classList.toggle("hidden", outputType !== "code");
    }
    if (els.typeFieldsImage) {
      els.typeFieldsImage.classList.toggle("hidden", outputType !== "image");
    }
    if (els.typeFieldsStructured) {
      els.typeFieldsStructured.classList.toggle("hidden", outputType !== "structured");
    }
    if (els.promptLengthGroup) {
      els.promptLengthGroup.classList.toggle("hidden", outputType !== "text");
    }
    // Contextualize format placeholder by output type to guide users.
    if (els.promptFormat && els.promptFormat.placeholder != null) {
      if (outputType === "text") {
        els.promptFormat.placeholder =
          "e.g. content format (bullets, email, JSON) or file format (CSV, PDF, markdown)";
      } else if (outputType === "code") {
        els.promptFormat.placeholder = "e.g. function snippet, full script, diff, config file";
      } else if (outputType === "image") {
        els.promptFormat.placeholder = "e.g. PNG 1:1 social post, JPG 16:9 banner";
      } else if (outputType === "structured") {
        els.promptFormat.placeholder = "e.g. JSON array of objects, CSV table";
      } else {
        els.promptFormat.placeholder =
          "e.g. content format (bullets, email, JSON) or file format (CSV, PDF, markdown)";
      }
    }
    updateWorkflowPromptModeVisibility();
  }

  function updateWorkflowPromptModeVisibility() {
    var inWorkflowMode = !!state.promptFactoryWorkflowContext;
    function toggle(el, hide) {
      if (!el || !el.classList) return;
      el.classList.toggle("hidden", !!hide);
    }

    // In workflow-step prompt mode, keep only step-essential fields.
    toggle(els.outputTypeGroup, inWorkflowMode);
    toggle(els.promptAudienceGroup, inWorkflowMode);
    toggle(els.promptRoleGroup, inWorkflowMode);
    toggle(els.promptGoalGroup, inWorkflowMode);
    toggle(els.promptContextGroup, inWorkflowMode);
    toggle(els.promptToneGroup, inWorkflowMode);
    toggle(els.promptFormatGroup, inWorkflowMode);
    toggle(els.promptLengthGroup, inWorkflowMode);
    toggle(els.promptConstraintsGroup, inWorkflowMode);
    toggle(els.textReadingLevelGroup, inWorkflowMode);

    // Keep minimal type-specific fields.
    // Code: keep language + environment, hide framework/style.
    toggle(els.codeFrameworkGroup, inWorkflowMode);
    toggle(els.codeStyleGroup, inWorkflowMode);

    // Image: keep style + aspect ratio, hide the rest.
    toggle(els.imageSubjectGroup, inWorkflowMode);
    toggle(els.imageCompositionGroup, inWorkflowMode);
    toggle(els.imageLightingGroup, inWorkflowMode);
    toggle(els.imageSizeGroup, inWorkflowMode);
    toggle(els.imagePaletteGroup, inWorkflowMode);
    toggle(els.imageTextGroup, inWorkflowMode);
    toggle(els.imageSceneGroup, inWorkflowMode);

    // Structured: keep schema, hide validation in minimal mode.
    toggle(els.structuredValidationGroup, inWorkflowMode);
  }

  function normalizeWorkflowStepPromptConfig(rawConfig) {
    var raw = rawConfig && typeof rawConfig === "object" ? rawConfig : {};
    var mode = String(raw.configurationMode || "advanced").toLowerCase();
    if (mode !== "none" && mode !== "simple" && mode !== "advanced") {
      mode = "advanced";
    }
    var options = Array.isArray(raw.userOptions)
      ? raw.userOptions
          .map(function (opt) {
            if (!opt || typeof opt !== "object") return null;
            var id = String(opt.id || "").trim();
            var label = String(opt.label || id).trim();
            var type = String(opt.type || "text").toLowerCase();
            if (type !== "select" && type !== "boolean" && type !== "number" && type !== "text") {
              type = "text";
            }
            var choices = Array.isArray(opt.choices)
              ? opt.choices
                  .map(function (c) {
                    if (!c || typeof c !== "object") return null;
                    return {
                      value: String(c.value || "").trim(),
                      label: String(c.label || c.value || "").trim(),
                      promptInstruction: String(c.promptInstruction || "").trim(),
                      summaryLabel: String(c.summaryLabel || "").trim()
                    };
                  })
                  .filter(function (c) {
                    return !!(c && c.value && c.label);
                  })
              : [];
            return {
              id: id,
              label: label,
              type: type,
              default: opt.default,
              description: String(opt.description || opt.helpText || "").trim(),
              promptInstructionTemplate: String(opt.promptInstructionTemplate || "").trim(),
              promptInstructionWhenTrue: String(opt.promptInstructionWhenTrue || "").trim(),
              promptInstructionWhenFalse: String(opt.promptInstructionWhenFalse || "").trim(),
              summaryTemplate: String(opt.summaryTemplate || "").trim(),
              min: typeof opt.min === "number" ? opt.min : null,
              max: typeof opt.max === "number" ? opt.max : null,
              choices: choices
            };
          })
          .filter(function (opt) {
            return !!(opt && opt.id);
          })
      : [];
    var preferredOutputFormat = String(raw.preferredOutputFormat || "").trim();
    var rawStructureStyle = String(raw.structureStyle || "").toLowerCase();
    var normalizedStructureStyle =
      rawStructureStyle === "schema_structured" || rawStructureStyle === "text_structured"
        ? rawStructureStyle
        : preferredOutputFormat === "json"
        ? "schema_structured"
        : "text_structured";
    function normalizeArtefactSchemas(rawSchemas) {
      var list = Array.isArray(rawSchemas) ? rawSchemas : [];
      return list
        .map(function (row) {
          if (!row || typeof row !== "object") return null;
          var artefact = String(row.artefact || "").trim();
          var type = String(row.type || artefact || "").trim();
          if (!type) return null;
          var schema = row.schema && typeof row.schema === "object" ? row.schema : null;
          if (!schema) return null;
          return {
            type: type,
            artefact: artefact || type,
            schema: schema
          };
        })
        .filter(function (row) {
          return !!row;
        });
    }
    return {
      configurationMode: mode,
      askForCustomSchema: raw.askForCustomSchema === true,
      allowWorkflowGoalContext: raw.allowWorkflowGoalContext === true,
      promptScope:
        String(raw.promptScope || "step_only").toLowerCase() === "step_only"
          ? "step_only"
          : "workflow_aware",
      structureStyle:
        normalizedStructureStyle,
      defaultPromptStrategy: String(raw.defaultPromptStrategy || "default_template"),
      defaultPromptNotes: String(raw.defaultPromptNotes || "").trim(),
      promptTemplate: String(raw.promptTemplate || ""),
      defaultPromptVariables:
        raw.defaultPromptVariables && typeof raw.defaultPromptVariables === "object"
          ? raw.defaultPromptVariables
          : null,
      preferredOutputFormat: preferredOutputFormat,
      inputPriority:
        raw.inputPriority && typeof raw.inputPriority === "object"
          ? raw.inputPriority
          : null,
      inputArtefactSchemas: normalizeArtefactSchemas(raw.inputArtefactSchemas),
      defaultOutputStructure:
        raw.defaultOutputStructure && typeof raw.defaultOutputStructure === "object"
          ? raw.defaultOutputStructure
          : null,
      canonicalStepId: String(raw.canonical_step_id || raw.canonicalStepId || "").trim(),
      domainVersion: String(raw.domain_version || raw.domainVersion || "").trim(),
      userOptions: options
    };
  }

  function isWorkflowRecommendationsEnabled() {
    return true;
  }

  function parseWorkflowStepParamBlock(text) {
    var src = String(text || "");
    var startTag = "[PRISM_STEP_PARAMS]";
    var endTag = "[/PRISM_STEP_PARAMS]";
    var start = src.indexOf(startTag);
    var end = src.indexOf(endTag);
    var out = {};
    if (start === -1 || end === -1 || end <= start) return out;
    var body = src.slice(start + startTag.length, end).trim();
    if (!body) return out;
    body.split(/\r?\n/).forEach(function (line) {
      var row = String(line || "").trim();
      if (!row) return;
      var idx = row.indexOf("=");
      if (idx <= 0) return;
      var key = row.slice(0, idx).trim();
      var value = row.slice(idx + 1).trim();
      if (!key) return;
      out[key] = value;
    });
    return out;
  }

  function stripWorkflowStepParamBlock(text) {
    var src = String(text || "");
    var startTag = "[PRISM_STEP_PARAMS]";
    var endTag = "[/PRISM_STEP_PARAMS]";
    var start = src.indexOf(startTag);
    var end = src.indexOf(endTag);
    if (start === -1 || end === -1 || end <= start) return src.trim();
    return (src.slice(0, start) + src.slice(end + endTag.length)).trim();
  }

  function getRunnerInstructionsForStep(step) {
    var s = step && typeof step === "object" ? step : null;
    if (!s) return null;
    var catalog = Array.isArray(state.workflowStepPatternCatalog)
      ? state.workflowStepPatternCatalog
      : [];
    var pattern = null;
    var canonicalId = String((s && s.canonical_step_id) || "").trim();
    if (canonicalId) {
      pattern = getPatternByCanonicalStepId(canonicalId, catalog);
    }
    if (!pattern) {
      var canonicalTitle = pickCanonicalWorkflowStepTitle(String((s && s.title) || ""), catalog);
      pattern = getPatternByCanonicalWorkflowTitle(canonicalTitle || String((s && s.title) || ""), catalog);
    }
    var pf = pattern && pattern.promptFactory && typeof pattern.promptFactory === "object"
      ? pattern.promptFactory
      : null;
    var ri = pf && pf.runnerInstructions && typeof pf.runnerInstructions === "object"
      ? pf.runnerInstructions
      : null;
    var out = ri
      ? {
          what_this_step_does: String(ri.what_this_step_does || "").trim(),
          what_to_expect: String(ri.what_to_expect || "").trim(),
          what_to_check: String(ri.what_to_check || "").trim()
        }
      : {
          what_this_step_does: "",
          what_to_expect: "",
          what_to_check: ""
        };
    if (!out.what_this_step_does && pf && pf.defaultPromptNotes) {
      out.what_this_step_does = String(pf.defaultPromptNotes || "").trim();
    }
    if (!out.what_this_step_does) {
      var roleText = String((s && s.roleLabel) || "").trim();
      var titleText = String((s && s.title) || "this step").trim();
      out.what_this_step_does = roleText || ("Complete " + titleText + " using the available workflow artefacts.");
    }
    if (!out.what_to_expect && s && s.outputName) {
      out.what_to_expect = 'A result suitable for artefact "' + String(s.outputName) + '".';
    }
    if (!out.what_to_expect) {
      out.what_to_expect = "A structured output that can be used by downstream workflow steps.";
    }
    if (!out.what_to_check) {
      out.what_to_check = "Output is complete, internally consistent, and aligned with this step's purpose.";
    }
    if (!out.what_this_step_does && !out.what_to_expect && !out.what_to_check) return null;
    return out;
  }

  function formatRunnerInstructionsText(step) {
    var ri = getRunnerInstructionsForStep(step);
    if (!ri) return "";
    var lines = [];
    if (ri.what_this_step_does) lines.push("What this step does: " + ri.what_this_step_does);
    if (ri.what_to_expect) lines.push("What to expect: " + ri.what_to_expect);
    if (ri.what_to_check) lines.push("What to check: " + ri.what_to_check);
    return lines.join("\n");
  }

  function getRunnerWhatThisStepDoes(step) {
    var ri = getRunnerInstructionsForStep(step);
    if (!ri) return "";
    return String(ri.what_this_step_does || "").trim();
  }

  function upsertWorkflowStepParamBlock(existingText, selectedOptions) {
    var src = String(existingText || "");
    var startTag = "[PRISM_STEP_PARAMS]";
    var endTag = "[/PRISM_STEP_PARAMS]";
    var start = src.indexOf(startTag);
    var end = src.indexOf(endTag);
    var withoutBlock = src;
    if (start !== -1 && end !== -1 && end > start) {
      withoutBlock = (src.slice(0, start) + src.slice(end + endTag.length)).trim();
    }
    var rows = [];
    (Array.isArray(selectedOptions) ? selectedOptions : []).forEach(function (opt) {
      if (!opt || !opt.id) return;
      rows.push(opt.id + "=" + String(opt.value == null ? "" : opt.value));
    });
    if (!rows.length) return withoutBlock;
    var block = startTag + "\n" + rows.join("\n") + "\n" + endTag;
    return withoutBlock ? withoutBlock + "\n\n" + block : block;
  }

  function isGenerateAssessmentItemsContext(context) {
    var title = String(
      (context && (context.stepCanonicalTitle || context.stepTitle)) || ""
    ).toLowerCase();
    var canonicalId = String((context && context.stepCanonicalStepId) || "").toLowerCase();
    return (
      canonicalId === "step_generate_assessment_items" ||
      title === "generate assessment items" ||
      title.indexOf("generate assessment") !== -1
    );
  }

  function normalizeAssessmentItemCount(value) {
    var text = String(value == null ? "" : value).trim();
    if (!text) return "";
    var n = Number(text);
    if (!isFinite(n) || n <= 0) return "";
    return String(Math.max(1, Math.round(n)));
  }

  function mapDesignAssessmentActivityTypeToResponseFormats(value) {
    var v = String(value || "").trim().toLowerCase();
    if (!v) return "";
    var map = {
      mcq: "single_answer_mcq",
      short_answer: "short_answer",
      essay: "essay",
      problem: "short_answer",
      case_study: "essay",
      mixed: "all_formats_mix"
    };
    return map[v] || "";
  }

  function mapDesignAssessmentDifficultyToItemsDifficultyProfile(value) {
    var v = String(value || "").trim().toLowerCase();
    if (!v) return "";
    var map = {
      introductory: "foundational",
      moderate: "balanced",
      advanced: "higher_order"
    };
    return map[v] || "";
  }

  function mapDesignAssessmentCoverageToItemsCoverageMode(value) {
    var v = String(value || "").trim().toLowerCase();
    if (!v) return "";
    var map = {
      narrow: "selected_themes",
      balanced: "balanced",
      broad: "broad_coverage"
    };
    return map[v] || "";
  }

  function readWorkflowStepParamsObject(step) {
    if (!step || typeof step !== "object") return {};
    var parsed = parseWorkflowStepParamBlock(step.notes || "");
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
    return {};
  }

  function resolveAssessmentItemsInheritedOptions(context, currentStep5Params, opts) {
    if (!isGenerateAssessmentItemsContext(context)) return {};
    var options = opts && typeof opts === "object" ? opts : {};
    var allowInheritedOverrides = options.allowInheritedOverrides !== false;
    var currentParams =
      currentStep5Params && typeof currentStep5Params === "object" ? currentStep5Params : {};
    var wf = findWorkflowById((context && context.workflowId) || state.selectedWorkflowId || "");
    if (!wf || !Array.isArray(wf.steps)) return Object.assign({}, currentParams);

    var briefPatch =
      wf.workflowBriefResolution &&
      wf.workflowBriefResolution.mappedBindings &&
      wf.workflowBriefResolution.mappedBindings.stepParamPatch &&
      typeof wf.workflowBriefResolution.mappedBindings.stepParamPatch === "object"
        ? wf.workflowBriefResolution.mappedBindings.stepParamPatch
        : {};
    var step5BriefMapped =
      briefPatch[normalizeCanonicalStepId("step_generate_assessment_items")] &&
      typeof briefPatch[normalizeCanonicalStepId("step_generate_assessment_items")] === "object"
        ? briefPatch[normalizeCanonicalStepId("step_generate_assessment_items")]
        : {};

    var resolved = {};
    Object.keys(step5BriefMapped).forEach(function (k) {
      var v = String(step5BriefMapped[k] == null ? "" : step5BriefMapped[k]).trim();
      if (!v) return;
      resolved[k] = v;
    });

    var currentStepId = String((context && context.stepId) || "");
    var currentIdx = wf.steps.findIndex(function (s) {
      return String((s && s.id) || "") === currentStepId;
    });
    if (currentIdx === -1) currentIdx = wf.steps.length;
    var step4 = null;
    for (var i = currentIdx - 1; i >= 0; i -= 1) {
      var row = wf.steps[i] || {};
      var canonicalId = String((row && row.canonical_step_id) || "").toLowerCase().trim();
      var title = String((row && row.title) || "").toLowerCase().trim();
      if (canonicalId === "step_design_assessment" || title === "design assessment") {
        step4 = row;
        break;
      }
    }
    if (step4) {
      var step4Params = readWorkflowStepParamsObject(step4);
      var translated = {
        response_formats: mapDesignAssessmentActivityTypeToResponseFormats(step4Params.activity_type),
        number_of_items: normalizeAssessmentItemCount(step4Params.total_items),
        difficulty_profile: mapDesignAssessmentDifficultyToItemsDifficultyProfile(step4Params.difficulty_level),
        coverage_mode: mapDesignAssessmentCoverageToItemsCoverageMode(step4Params.coverage_breadth)
      };
      Object.keys(translated).forEach(function (k) {
        var v = String(translated[k] == null ? "" : translated[k]).trim();
        if (!v) return;
        resolved[k] = v;
      });
    }

    var inheritedKeys = {
      response_formats: true,
      number_of_items: true,
      difficulty_profile: true,
      coverage_mode: true
    };
    Object.keys(currentParams).forEach(function (k) {
      if (!allowInheritedOverrides && inheritedKeys[k]) return;
      var currentValue = String(currentParams[k] == null ? "" : currentParams[k]).trim();
      if (!currentValue) return;
      var mappedValue = String(step5BriefMapped[k] == null ? "" : step5BriefMapped[k]).trim();
      // Explicit Step 5 values should win. If value equals mapped brief value,
      // treat it as brief-derived rather than explicit.
      if (!mappedValue || currentValue !== mappedValue) {
        resolved[k] = currentValue;
      } else if (!Object.prototype.hasOwnProperty.call(resolved, k)) {
        resolved[k] = currentValue;
      }
    });

    return resolved;
  }

  function renderWorkflowStepPromptConfigUI() {
    var ctx = state.promptFactoryWorkflowContext || null;
    var hasCtx = !!ctx;
    if (!els.workflowStepConfigPanel || !els.workflowStepConfigOptions) return;
    els.workflowStepConfigPanel.classList.toggle("hidden", !hasCtx);
    els.workflowStepConfigOptions.innerHTML = "";
    if (!hasCtx) return;

    var cfg = normalizeWorkflowStepPromptConfig(ctx.stepPromptFactoryConfig);
    var existingParams = parseWorkflowStepParamBlock(ctx.stepNotes || "");
    var step4CanonicalId = String((ctx && ctx.stepCanonicalStepId) || "").toLowerCase().trim();
    var step4Title = String((ctx && (ctx.stepCanonicalTitle || ctx.stepTitle)) || "").toLowerCase().trim();
    if (els.workflowStepConfigTitle) {
      els.workflowStepConfigTitle.textContent =
        "Step configuration: " + (ctx.stepCanonicalTitle || ctx.stepTitle || "Current step");
    }
    if (els.workflowStepConfigHint) {
      if (cfg.configurationMode === "none") {
        var stepTitle = String(ctx.stepCanonicalTitle || ctx.stepTitle || "").toLowerCase();
        els.workflowStepConfigHint.textContent =
          stepTitle === "generate assessment items"
            ? "This step generates assessment items from the available learning design artefacts."
            : "A ready draft is available for this step. Review or refine only if needed.";
      } else if (cfg.configurationMode === "simple") {
        els.workflowStepConfigHint.textContent =
          "Parameters are stored on the step and applied implicitly (single source of truth).";
      } else {
        els.workflowStepConfigHint.textContent =
          "This step allows standard prompt customization.";
      }
    }
    if (cfg.configurationMode !== "simple" || !cfg.userOptions.length) return;

    var isAssessmentItemsStep = isGenerateAssessmentItemsContext(ctx);
    var inheritedAssessmentOptionIds = {
      response_formats: true,
      number_of_items: true,
      difficulty_profile: true,
      coverage_mode: true
    };
    if (isAssessmentItemsStep) {
      var inheritedNotice = document.createElement("div");
      inheritedNotice.className = "form-group small";
      inheritedNotice.innerHTML =
        '<div class="muted">Core assessment settings are inherited from <strong>Design Assessment</strong> by default.</div>';
      els.workflowStepConfigOptions.appendChild(inheritedNotice);

      var toggleWrap = document.createElement("div");
      toggleWrap.className = "form-group small";
      var toggleLabel = document.createElement("label");
      toggleLabel.style.display = "inline-flex";
      toggleLabel.style.alignItems = "center";
      toggleLabel.style.gap = "8px";
      var toggle = document.createElement("input");
      toggle.type = "checkbox";
      toggle.checked = !!state.assessmentItemsShowAdvancedOptions;
      toggle.addEventListener("change", function () {
        state.assessmentItemsShowAdvancedOptions = !!toggle.checked;
        renderWorkflowStepPromptConfigUI();
        applyWorkflowStepPromptDefaults({
          source: "workflow_step_config_toggle_change"
        });
      });
      var toggleText = document.createElement("span");
      toggleText.textContent = "Show advanced options (including inherited overrides)";
      toggleLabel.appendChild(toggle);
      toggleLabel.appendChild(toggleText);
      toggleWrap.appendChild(toggleLabel);
      els.workflowStepConfigOptions.appendChild(toggleWrap);
    } else {
      state.assessmentItemsShowAdvancedOptions = false;
    }

    var effectiveParams = isAssessmentItemsStep
      ? resolveAssessmentItemsInheritedOptions(ctx, existingParams, {
          allowInheritedOverrides: !!state.assessmentItemsShowAdvancedOptions
        })
      : Object.assign({}, existingParams);

    cfg.userOptions.forEach(function (opt) {
      if (
        isAssessmentItemsStep &&
        !state.assessmentItemsShowAdvancedOptions &&
        inheritedAssessmentOptionIds[String((opt && opt.id) || "")]
      ) {
        return;
      }
      var group = document.createElement("div");
      group.className = "form-group small";
      var label = document.createElement("label");
      label.textContent = opt.label;
      group.appendChild(label);

      var input = null;
      if (opt.type === "select") {
        input = document.createElement("select");
        opt.choices.forEach(function (c) {
          var option = document.createElement("option");
          option.value = c.value;
          option.textContent = c.label;
          input.appendChild(option);
        });
        var defaultValue = String(opt.default == null ? "" : opt.default);
        if (defaultValue) input.value = defaultValue;
        if (Object.prototype.hasOwnProperty.call(effectiveParams, opt.id)) {
          input.value = String(effectiveParams[opt.id]);
        }
      } else if (opt.type === "boolean") {
        input = document.createElement("select");
        var yes = document.createElement("option");
        yes.value = "true";
        yes.textContent = "Yes";
        var no = document.createElement("option");
        no.value = "false";
        no.textContent = "No";
        input.appendChild(yes);
        input.appendChild(no);
        input.value = opt.default === false ? "false" : "true";
        if (Object.prototype.hasOwnProperty.call(effectiveParams, opt.id)) {
          input.value =
            String(effectiveParams[opt.id]).toLowerCase() === "false" ? "false" : "true";
        }
      } else if (opt.type === "number") {
        input = document.createElement("input");
        input.type = "number";
        if (typeof opt.min === "number") input.min = String(opt.min);
        if (typeof opt.max === "number") input.max = String(opt.max);
        if (opt.default != null) input.value = String(opt.default);
        if (Object.prototype.hasOwnProperty.call(effectiveParams, opt.id)) {
          input.value = String(effectiveParams[opt.id]);
        }
      } else {
        input = document.createElement("input");
        input.type = "text";
        if (opt.default != null) input.value = String(opt.default);
        if (Object.prototype.hasOwnProperty.call(effectiveParams, opt.id)) {
          input.value = String(effectiveParams[opt.id]);
        }
      }
      input.autocomplete = "off";
      input.setAttribute("data-workflow-step-option", "1");
      input.setAttribute("data-option-id", opt.id);
      input.setAttribute("data-option-label", opt.label);
      input.addEventListener("change", function () {
        applyWorkflowStepPromptDefaults({
          source: "workflow_step_config_option_change"
        });
      });
      input.addEventListener("input", function () {
        if (opt.type === "number" || opt.type === "text") {
          applyWorkflowStepPromptDefaults({
            source: "workflow_step_config_option_input"
          });
        }
      });
      group.appendChild(input);
      els.workflowStepConfigOptions.appendChild(group);
    });
  }

  function collectWorkflowStepPromptOptionSelections(options) {
    if (!isWorkflowRecommendationsEnabled()) return [];
    var opts = options && typeof options === "object" ? options : {};
    var includeDefaults = opts.includeDefaults !== false;
    var rows = [];
    var ctx = state.promptFactoryWorkflowContext || null;
    var cfg = normalizeWorkflowStepPromptConfig(ctx && ctx.stepPromptFactoryConfig);
    var map = {};
    if (els.workflowStepConfigOptions) {
      var nodes = els.workflowStepConfigOptions.querySelectorAll("[data-workflow-step-option='1']");
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var id = node.getAttribute("data-option-id") || "";
        var label = node.getAttribute("data-option-label") || id;
        var value = typeof node.value === "string" ? node.value.trim() : "";
        if (!id || !label) continue;
        map[id] = {
          id: id,
          label: label,
          value: value
        };
      }
    }
    if (includeDefaults) {
      (cfg.userOptions || []).forEach(function (opt) {
        if (!opt || !opt.id) return;
        if (!map[opt.id] || !String(map[opt.id].value || "").trim()) {
          var fallback = opt.default;
          if (typeof fallback === "boolean") fallback = fallback ? "true" : "false";
          if (fallback == null) fallback = "";
          map[opt.id] = {
            id: opt.id,
            label: opt.label || opt.id,
            value: String(fallback)
          };
        }
      });
    } else {
      Object.keys(map).forEach(function (k) {
        if (!map[k] || !String(map[k].value || "").trim()) {
          delete map[k];
        }
      });
    }
    Object.keys(map).forEach(function (k) {
      var row = map[k];
      if (!row || !row.id) return;
      rows.push(row);
    });
    return rows;
  }

  function resolveWorkflowStepPromptTemplate(cfg) {
    var template = String(cfg && cfg.promptTemplate ? cfg.promptTemplate : "").trim();
    if (template) return template;
    var fallback = String(
      cfg && cfg.domainFallbackPromptTemplate ? cfg.domainFallbackPromptTemplate : ""
    ).trim();
    if (fallback) return fallback;
    return "";
  }

  function buildWorkflowStepPromptOptionMap(selectedOptions) {
    var map = {};
    (Array.isArray(selectedOptions) ? selectedOptions : []).forEach(function (row) {
      if (!row || !row.id) return;
      map[row.id] = row.value != null ? String(row.value) : "";
    });
    return map;
  }

  function normalizeArtefactKey(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  function normalizeWorkflowDesignArtefactKey(value) {
    var key = normalizeArtefactKey(value);
    if (key === "mcq_items") return "assessment_items";
    return key;
  }

  function resolveStepInputArtefactSchemas(knownSchemas, inputArtefactNames) {
    var schemas = Array.isArray(knownSchemas) ? knownSchemas : [];
    var names = Array.isArray(inputArtefactNames) ? inputArtefactNames : [];
    if (!schemas.length) return [];
    if (!names.length) return schemas.slice();
    var nameMap = {};
    names.forEach(function (n) {
      var key = normalizeArtefactKey(n);
      if (key) nameMap[key] = true;
    });
    var out = schemas.filter(function (row) {
      if (!row) return false;
      var keys = [
        normalizeArtefactKey(row.type),
        normalizeArtefactKey(row.artefact)
      ].filter(function (k) {
        return !!k;
      });
      for (var i = 0; i < keys.length; i += 1) {
        if (nameMap[keys[i]]) return true;
      }
      return false;
    });
    return out.length ? out : schemas.slice();
  }

  function applyWorkflowStepPromptTemplate(template, vars) {
    var src = String(template || "");
    var values = vars && typeof vars === "object" ? vars : {};
    var rendered = src.replace(/\{\{\s*([^}]+?)\s*\}\}/g, function (_m, rawKey) {
      var key = String(rawKey || "").trim();
      if (!key) return "";
      if (Object.prototype.hasOwnProperty.call(values, key)) {
        var v = values[key];
        return v == null ? "" : String(v);
      }
      return "";
    });
    // Remove empty optional lines (e.g. "- Step notes:") after substitution.
    return rendered
      .split("\n")
      .filter(function (line) {
        var trimmed = String(line || "").trim();
        if (!trimmed) return true;
        if (/^-\s*[^:]+:\s*$/.test(trimmed)) return false;
        if (/^[^:-][^:]*:\s*$/.test(trimmed) && /step notes/i.test(trimmed)) return false;
        return true;
      })
      .join("\n");
  }

  function buildWorkflowStepPromptFallback(cfg, ctx, selectedOptions) {
    var lines = [];
    var canonical = ctx.stepCanonicalTitle || ctx.stepTitle || "Current step";
    lines.push("Context:");
    lines.push(
      "You are provided with the required inputs for the workflow step \"" +
        canonical +
        "\"."
    );
    if (Array.isArray(ctx.stepInputArtefacts) && ctx.stepInputArtefacts.length) {
      lines.push("The following artefacts are provided as input:");
      ctx.stepInputArtefacts.forEach(function (item) {
        lines.push("- " + item);
      });
    }
    if (ctx.stepOutputName) {
      lines.push("Produce the named artefact: " + ctx.stepOutputName + ".");
    }
    lines.push("");
    lines.push("Task:");
    lines.push("Perform the \"" + canonical + "\" transformation directly.");
    lines.push("");
    lines.push("Instructions:");
    if (ctx.stepOutputName) {
      lines.push("- Ensure the result is suitable for artefact \"" + ctx.stepOutputName + "\".");
    }
    if (cfg.defaultPromptNotes) {
      lines.push("- " + cfg.defaultPromptNotes);
    }
    if (cfg.preferredOutputFormat) {
      lines.push("- Follow output format: " + cfg.preferredOutputFormat + ".");
    }
    if (cfg.defaultOutputStructure) {
      lines.push("- Structure the output using: " + JSON.stringify(cfg.defaultOutputStructure) + ".");
    }
    if (cfg.structureStyle === "schema_structured") {
      lines.push(
        "- Use explicit structured output (for example, JSON objects/arrays with named keys)."
      );
    } else {
      lines.push(
        "- Use structured text with clear sections/headings and coherent prose."
      );
    }
    if (selectedOptions.length) {
      lines.push("");
      lines.push("Constraints:");
      selectedOptions.forEach(function (opt) {
        lines.push("- " + opt.label + ": " + opt.value);
      });
    }
    var visibleStepNotes = stripWorkflowStepParamBlock(ctx.stepNotes || "");
    if (visibleStepNotes) {
      lines.push("");
      lines.push("Additional step guidance:");
      lines.push(visibleStepNotes);
    }
    lines.push("");
    lines.push("Output:");
    if (cfg.preferredOutputFormat) {
      lines.push("- Return only the final output in " + cfg.preferredOutputFormat + ".");
    } else {
      lines.push("- Return only the final output.");
    }
    if (ctx.stepOutputName) {
      lines.push("- Ensure the output can be used as artefact \"" + ctx.stepOutputName + "\".");
    }
    return lines.join("\n");
  }

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

  function applyWorkflowStepPromptDefaults(triggerMeta) {
    var ctx = state.promptFactoryWorkflowContext || null;
    if (!ctx) return;
    var trigger = triggerMeta && typeof triggerMeta === "object" ? triggerMeta : {};
    var triggerSource = String(trigger.source || "unknown");
    var cfg = normalizeWorkflowStepPromptConfig(ctx.stepPromptFactoryConfig);
    if (!els.initialPrompt) return;
    var uiSelectedOptions = collectWorkflowStepPromptOptionSelections({ includeDefaults: false });
    var effectiveSelectedOptions = collectWorkflowStepPromptOptionSelections({ includeDefaults: true });
    if (isGenerateAssessmentItemsContext(ctx)) {
      var selectedMap = {};
      (Array.isArray(effectiveSelectedOptions) ? effectiveSelectedOptions : []).forEach(function (row) {
        if (!row || !row.id) return;
        selectedMap[row.id] = row.value;
      });
      var effective = resolveAssessmentItemsInheritedOptions(ctx, selectedMap, {
        allowInheritedOverrides: !!state.assessmentItemsShowAdvancedOptions
      });
      var byId = {};
      (Array.isArray(effectiveSelectedOptions) ? effectiveSelectedOptions : []).forEach(function (row) {
        if (!row || !row.id) return;
        byId[row.id] = Object.assign({}, row);
      });
      Object.keys(effective).forEach(function (id) {
        if (byId[id]) byId[id].value = String(effective[id]);
        else byId[id] = { id: id, label: id, value: String(effective[id]) };
      });
      effectiveSelectedOptions = Object.keys(byId).map(function (id) {
        return byId[id];
      });
    }
    var template = resolveWorkflowStepPromptTemplate(cfg);
    var usedFallbackTemplate = false;
    var isOpenPrefill = triggerSource === "workflow_step_open_prefill";
    var stepPromptSourceType = normalizePromptSourceType(ctx.stepPromptSource || "");
    if (stepPromptSourceType === "local_override") {
      var overrideBody = String(ctx.stepOverridePromptBody || "").trim();
      var overrideLooksFallback =
        /perform the ["']?.+?["']? transformation directly/i.test(overrideBody) ||
        /you are provided with the required inputs for the workflow step/i.test(overrideBody);
      var overrideMuchShorterThanTemplate =
        !!template &&
        overrideBody.length > 0 &&
        overrideBody.length < Math.max(220, Math.floor(template.length * 0.7));
      var bypassOverrideForIntegrity =
        !!template &&
        (
          overrideBody.length < 120 ||
          overrideMuchShorterThanTemplate ||
          overrideLooksFallback ||
          /from the previous step\s*"?\s*$/i.test(overrideBody)
        );
      if (bypassOverrideForIntegrity) {
        try {
          console.warn("[PRISM] Ignoring local override; using domain template.", {
            step: ctx.stepCanonicalTitle || ctx.stepTitle || "",
            overrideLength: overrideBody.length,
            templateLength: template.length,
            overrideLooksFallback: overrideLooksFallback
          });
        } catch (_e) {}
      } else {
      els.initialPrompt.value = overrideBody;
      if (els.finalPrompt) {
        var current = String(els.finalPrompt.value || "");
        if (!current || current === String(state.workflowStepGeneratedDraft || "")) {
          els.finalPrompt.value = overrideBody;
          state.workflowStepGeneratedDraft = overrideBody;
        }
      }
      return;
      }
    }
    var optionMap = buildWorkflowStepPromptOptionMap(effectiveSelectedOptions);
    function getOptionDefMap() {
      var map = {};
      (cfg.userOptions || []).forEach(function (opt) {
        if (!opt || !opt.id) return;
        map[String(opt.id)] = opt;
      });
      return map;
    }
    function formatOptionValueForPrompt(optDef, rawValue) {
      var value = rawValue == null ? "" : String(rawValue).trim();
      if (!value) return "";
      var def = optDef && typeof optDef === "object" ? optDef : null;
      var type = String((def && def.type) || "").toLowerCase();
      if (type === "boolean") {
        if (value.toLowerCase() === "true") return "Yes";
        if (value.toLowerCase() === "false") return "No";
        return value;
      }
      if (type === "select" && Array.isArray(def.choices)) {
        var match = def.choices.find(function (c) {
          if (c && typeof c === "object") {
            return String(c.value == null ? "" : c.value) === value;
          }
          return String(c || "") === value;
        });
        if (match && typeof match === "object") {
          return String(match.label || match.value || value);
        }
      }
      return value;
    }
    function applyConfigToDraftText(draftText, rawTemplate, selectedRows) {
      var text = String(draftText || "");
      var templateSrc = String(rawTemplate || "");
      var optionDefMap = getOptionDefMap();
      var selected = Array.isArray(selectedRows) ? selectedRows : [];
      var referenced = {};
      templateSrc.replace(/\{\{\s*option:([^}\s]+)\s*\}\}/g, function (_m, id) {
        var key = String(id || "").trim();
        if (key) referenced[key] = true;
        return _m;
      });

      // Include/omit behaviour for boolean include_* toggles:
      // if user disables one, remove matching instruction lines instead of
      // adding heavy negative phrasing.
      selected.forEach(function (row) {
        var id = String((row && row.id) || "").trim();
        var value = String((row && row.value) || "").toLowerCase().trim();
        if (!id || value !== "false") return;
        if (id.indexOf("include_") !== 0) return;
        var optDef = optionDefMap[id] || null;
        var label = String((optDef && optDef.label) || id).toLowerCase();
        var tokens = label
          .replace(/include|if present|when present|optional|or workflows?|concept/gi, " ")
          .split(/[^a-z0-9]+/)
          .filter(function (t) {
            return t && t.length >= 4;
          });
        if (!tokens.length) return;
        text = text
          .split("\n")
          .filter(function (line) {
            var lower = String(line || "").toLowerCase();
            if (!lower.trim()) return true;
            return !tokens.some(function (t) {
              return lower.indexOf(t) !== -1;
            });
          })
          .join("\n");
      });

      function fillTemplateVars(template, vars) {
        var src = String(template || "");
        var values = vars && typeof vars === "object" ? vars : {};
        return src.replace(/\{\{\s*([^}]+?)\s*\}\}/g, function (_m, rawKey) {
          var key = String(rawKey || "").trim();
          if (!key) return "";
          if (Object.prototype.hasOwnProperty.call(values, key)) {
            var v = values[key];
            return v == null ? "" : String(v);
          }
          return "";
        }).trim();
      }
      function resolveMetadataInstruction(optDef, row, displayValue) {
        if (!optDef || !row) return "";
        var type = String(optDef.type || "").toLowerCase();
        var rawValue = String(row.value == null ? "" : row.value).trim();
        var display = String(displayValue || "").trim();
        if (!rawValue) return "";
        if (type === "boolean") {
          if (rawValue.toLowerCase() === "true" && optDef.promptInstructionWhenTrue) {
            return fillTemplateVars(optDef.promptInstructionWhenTrue, {
              value: display || "Yes",
              rawValue: rawValue,
              label: row.label || optDef.label || row.id || ""
            });
          }
          if (rawValue.toLowerCase() === "false" && optDef.promptInstructionWhenFalse) {
            return fillTemplateVars(optDef.promptInstructionWhenFalse, {
              value: display || "No",
              rawValue: rawValue,
              label: row.label || optDef.label || row.id || ""
            });
          }
          return "";
        }
        if (type === "select" && Array.isArray(optDef.choices)) {
          var choice = optDef.choices.find(function (c) {
            return String((c && c.value) || "") === rawValue;
          });
          if (choice && String(choice.promptInstruction || "").trim()) {
            return fillTemplateVars(choice.promptInstruction, {
              value: display || String(choice.label || choice.value || rawValue),
              rawValue: rawValue,
              label: row.label || optDef.label || row.id || ""
            });
          }
        }
        if (optDef.promptInstructionTemplate) {
          return fillTemplateVars(optDef.promptInstructionTemplate, {
            value: display || rawValue,
            rawValue: rawValue,
            label: row.label || optDef.label || row.id || ""
          });
        }
        return "";
      }
      function injectInstructionBullets(source, bullets) {
        var body = String(source || "").trim();
        if (!Array.isArray(bullets) || !bullets.length) return body;
        var unique = [];
        var seen = {};
        bullets.forEach(function (b) {
          var line = String(b || "").trim();
          if (!line) return;
          var key = line.toLowerCase();
          if (seen[key]) return;
          seen[key] = true;
          unique.push("- " + line);
        });
        if (!unique.length) return body;
        var outLines = body.split("\n");
        var outputIdx = outLines.findIndex(function (line) {
          return String(line || "").trim().toLowerCase() === "output:";
        });
        if (outputIdx > 0) {
          var before = outLines.slice(0, outputIdx);
          var after = outLines.slice(outputIdx);
          return before.join("\n").trim() + "\n" + unique.join("\n") + "\n\n" + after.join("\n").trim();
        }
        return body + "\n\n" + unique.join("\n");
      }
      function getSelectedOptionValue(rows, id) {
        var target = String(id || "").trim();
        if (!target) return "";
        var match = (Array.isArray(rows) ? rows : []).find(function (r) {
          return String((r && r.id) || "").trim() === target;
        });
        return match && match.value != null ? String(match.value).trim() : "";
      }
      function resolveAllowedFormats(rawValue) {
        var val = String(rawValue || "").trim().toLowerCase();
        if (!val) return [];
        var comboMap = {
          single_mcq_and_true_false: ["single_answer_mcq", "true_false"],
          objective_mix_all: ["single_answer_mcq", "multiple_answer_mcq", "true_false"],
          constructed_mix: ["short_answer", "essay"],
          all_formats_mix: [
            "single_answer_mcq",
            "multiple_answer_mcq",
            "true_false",
            "short_answer",
            "essay"
          ]
        };
        if (Object.prototype.hasOwnProperty.call(comboMap, val)) {
          return comboMap[val].slice();
        }
        return [val];
      }
      function pruneConfigSpecificBranches(sourceText, rows) {
        var body = String(sourceText || "");
        if (!body.trim()) return "";
        var responseFormatsRaw = getSelectedOptionValue(rows, "response_formats");
        var compositionMode = getSelectedOptionValue(rows, "composition_mode").toLowerCase();
        var stimulusMode = getSelectedOptionValue(rows, "stimulus_mode").toLowerCase();
        var scenarioScope = getSelectedOptionValue(rows, "scenario_scope").toLowerCase();
        var allowedFormats = resolveAllowedFormats(responseFormatsRaw);
        var allowedFormatSet = {};
        allowedFormats.forEach(function (f) {
          if (f) allowedFormatSet[f] = true;
        });
        var hasMultipleFormats = allowedFormats.length > 1;
        var isMixedSet = compositionMode === "mixed_set";
        var isDirect = stimulusMode === "direct_questions";
        var isScenarioFamily =
          stimulusMode === "scenario_based" ||
          stimulusMode === "problem_based" ||
          stimulusMode === "case_based";

        var formatLineRules = [
          { key: "single_answer_mcq", re: /\b(single_answer_mcq|single-answer mcq)\b/i },
          { key: "multiple_answer_mcq", re: /\b(multiple_answer_mcq|multiple-answer mcq|select-all-that-apply)\b/i },
          { key: "true_false", re: /\b(true_false|true\/false)\b/i },
          { key: "short_answer", re: /\bshort_answer|short-answer\b/i },
          { key: "essay", re: /\bessay\b/i }
        ];
        var lines = body.split("\n").filter(function (line) {
          var lower = String(line || "").toLowerCase();
          var trimmed = lower.trim();
          if (!trimmed) return true;

          if (!hasMultipleFormats || !isMixedSet) {
            if (
              /\bmultiple response formats\b/.test(lower) ||
              /\bmixed-format\b/.test(lower) ||
              /\bmixed set\b/.test(lower) ||
              /\binclude item_type per item\b/.test(lower)
            ) {
              return false;
            }
          }

          if (allowedFormats.length) {
            var matchedRule = formatLineRules.find(function (rule) {
              return rule.re.test(line);
            });
            if (matchedRule && !allowedFormatSet[matchedRule.key]) {
              return false;
            }
          }

          if (isDirect) {
            if (
              /\bscenario\b/.test(lower) ||
              /\bproblem-based\b/.test(lower) ||
              /\bcase-based\b/.test(lower) ||
              /\bstimulus_/.test(lower) ||
              /\bshared_stimulus_ref\b/.test(lower)
            ) {
              return false;
            }
          }
          if (isScenarioFamily && /\bdirect_questions\b/.test(lower)) {
            return false;
          }
          if (isScenarioFamily) {
            if (
              stimulusMode !== "scenario_based" && /\bscenario-based\b/.test(lower) && !/\bproblem-based\b|\bcase-based\b/.test(lower)
            ) {
              return false;
            }
            if (stimulusMode !== "problem_based" && /\bproblem-based\b/.test(lower)) {
              return false;
            }
            if (stimulusMode !== "case_based" && /\bcase-based\b/.test(lower)) {
              return false;
            }
            if (
              scenarioScope === "shared_scenario_for_set" &&
              /\bscenario_per_item\b/.test(lower)
            ) {
              return false;
            }
            if (
              scenarioScope === "scenario_per_item" &&
              /\bshared_scenario_for_set\b/.test(lower)
            ) {
              return false;
            }
          } else {
            if (/\bscenario scope\b/.test(lower) || /\bshared_scenario_for_set\b|\bscenario_per_item\b/.test(lower)) {
              return false;
            }
          }
          return true;
        });
        return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
      }
      function cleanConfigSpecificPrompt(sourceText, rows) {
        var body = String(sourceText || "");
        if (!body.trim()) return "";
        var responseFormatsRaw = getSelectedOptionValue(rows, "response_formats");
        var compositionMode = getSelectedOptionValue(rows, "composition_mode").toLowerCase();
        var stimulusMode = getSelectedOptionValue(rows, "stimulus_mode").toLowerCase();
        var allowedFormats = resolveAllowedFormats(responseFormatsRaw);
        var singleFormat =
          allowedFormats.length === 1 ? String(allowedFormats[0] || "").toLowerCase() : "";
        var isDirect = stimulusMode === "direct_questions";

        var lines = body.split("\n").filter(function (line) {
          var lower = String(line || "").toLowerCase().trim();
          if (!lower) return true;
          if (/^-\s*respect configured response formats, composition mode, stimulus mode, and feedback mode/.test(lower)) {
            return false;
          }
          if (isDirect) {
            if (
              /\bscenario_based\b|\bproblem_based\b|\bcase_based\b/.test(lower) ||
              /\bstimulus mode\b/.test(lower) ||
              /\bscenario scope\b/.test(lower)
            ) {
              return false;
            }
          }
          return true;
        });

        function hasLine(re) {
          return lines.some(function (l) {
            return re.test(String(l || ""));
          });
        }
        function dropLines(re) {
          lines = lines.filter(function (l) {
            return !re.test(String(l || ""));
          });
        }

        var detailedByFormat = {
          single_answer_mcq: /for single_answer_mcq items,/i,
          multiple_answer_mcq: /for multiple_answer_mcq items,/i,
          true_false: /for true_false items,/i,
          short_answer: /for short_answer items,/i,
          essay: /for essay items,/i
        };
        var allowByFormat = {
          single_answer_mcq: /allow single-answer mcq items only\./i,
          multiple_answer_mcq: /allow multiple-answer mcq items only/i,
          true_false: /allow true\/false items only\./i,
          short_answer: /allow short-answer items only\./i,
          essay: /allow essay items only/i
        };
        Object.keys(detailedByFormat).forEach(function (fmt) {
          if (hasLine(detailedByFormat[fmt])) {
            dropLines(allowByFormat[fmt]);
          }
        });

        if (
          hasLine(/for per-item feedback modes, provide learner-facing feedback/i) &&
          hasLine(/include concise learner-facing feedback for each item/i)
        ) {
          dropLines(/for per-item feedback modes, provide learner-facing feedback/i);
        }

        if (
          singleFormat &&
          compositionMode === "single_format" &&
          hasLine(/generate exactly \d+ assessment items\./i)
        ) {
          var formatLabelMap = {
            single_answer_mcq: "single-answer MCQ",
            multiple_answer_mcq: "multiple-answer MCQ",
            true_false: "true/false",
            short_answer: "short-answer",
            essay: "essay"
          };
          var label = formatLabelMap[singleFormat] || "";
          if (label) {
            lines = lines.map(function (line) {
              var m = String(line || "").match(/^-\s*Generate exactly\s+(\d+)\s+assessment items\.\s*$/i);
              if (!m) return line;
              return "- Generate exactly " + m[1] + " " + label + " items.";
            });
          }
        }

        var deduped = [];
        var seen = {};
        lines.forEach(function (line) {
          var key = String(line || "")
            .toLowerCase()
            .replace(/\s+/g, " ")
            .replace(/[.,;:!?]+$/g, "")
            .trim();
          if (!key) {
            deduped.push(line);
            return;
          }
          if (seen[key]) return;
          seen[key] = true;
          deduped.push(line);
        });
        return deduped.join("\n").replace(/\n{3,}/g, "\n\n").trim();
      }
      var extraInstructions = [];
      selected.forEach(function (row) {
        var id = String((row && row.id) || "").trim();
        if (!id || referenced[id]) return;
        var optDef = optionDefMap[id] || null;
        var display = formatOptionValueForPrompt(optDef, row && row.value);
        if (!display) return;
        var mapped = resolveMetadataInstruction(optDef, row, display);
        if (!mapped) return;
        extraInstructions.push(mapped);
      });
      text = injectInstructionBullets(text, extraInstructions);
      text = pruneConfigSpecificBranches(text, selected);
      text = cleanConfigSpecificPrompt(text, selected);
      return text.trim();
    }

    // Step stores parameter values as source-of-truth.
    // Skip persistence during open prefill to keep Prompt Studio non-destructive.
    if (ctx.stepId && !isOpenPrefill) {
      var stepEl = document.querySelector(
        '.workflow-step[data-step-id="' + String(ctx.stepId).replace(/"/g, '\\"') + '"]'
      );
      if (stepEl) {
        var notesEl = stepEl.querySelector('[data-field="notes"]');
        if (notesEl) {
          var existingStoredParams = parseWorkflowStepParamBlock(notesEl.value || "");
          var persistedParamMap = {};
          Object.keys(existingStoredParams || {}).forEach(function (k) {
            persistedParamMap[k] = existingStoredParams[k];
          });
          (Array.isArray(uiSelectedOptions) ? uiSelectedOptions : []).forEach(function (row) {
            if (!row || !row.id) return;
            var value = row.value == null ? "" : String(row.value).trim();
            if (!value) return;
            persistedParamMap[row.id] = value;
          });
          var persistedOptions = Object.keys(persistedParamMap).map(function (id) {
            return { id: id, value: persistedParamMap[id] };
          });
          var nextNotes = upsertWorkflowStepParamBlock(notesEl.value, persistedOptions);
          notesEl.value = nextNotes;
          ctx.stepNotes = nextNotes;
          var wf = findWorkflowById(ctx.workflowId || state.selectedWorkflowId || "");
          if (wf && Array.isArray(wf.steps)) {
            var target = wf.steps.find(function (s) {
              return String(s && s.id ? s.id : "") === String(ctx.stepId || "");
            });
            if (target) {
              target.notes = nextNotes;
              wf.updatedAt = Date.now();
              saveWorkflows();
            }
          }
        }
      }
    }

    function isGenerateAssessmentItemsStep(context) {
      var title = String(
        (context && (context.stepCanonicalTitle || context.stepTitle)) || ""
      ).toLowerCase();
      var canonicalId = String((context && context.stepCanonicalStepId) || "").toLowerCase();
      return (
        canonicalId === "step_generate_assessment_items" ||
        title === "generate assessment items" ||
        title.indexOf("generate assessment") !== -1
      );
    }
    function isDesignLearningActivitiesStep(context) {
      var title = String(
        (context && (context.stepCanonicalTitle || context.stepTitle)) || ""
      ).toLowerCase();
      var canonicalId = String((context && context.stepCanonicalStepId) || "").toLowerCase();
      return (
        canonicalId === "step_design_learning_activities" ||
        title === "design learning activities" ||
        title.indexOf("design learning activit") !== -1
      );
    }
    function isMcqLikeAssessmentContext(context, optionValues, draftText) {
      var bits = [];
      bits.push(String((draftText || "")).toLowerCase());
      bits.push(String((context && context.stepNotes) || "").toLowerCase());
      bits.push(String((context && context.workflowGoal) || "").toLowerCase());
      if (context && Array.isArray(context.workflowOutputs)) {
        bits.push(context.workflowOutputs.join(" ").toLowerCase());
      }
      if (context && Array.isArray(context.workflowInputs)) {
        bits.push(context.workflowInputs.join(" ").toLowerCase());
      }
      if (optionValues && typeof optionValues === "object") {
        Object.keys(optionValues).forEach(function (k) {
          bits.push(String(optionValues[k] || "").toLowerCase());
        });
      }
      var blob = bits.join("\n");
      var mcqLike = /\b(mcq|multiple choice|quiz|question bank|objective questions?)\b/.test(blob);
      var explicitlyNonMcqOnly = /\b(essay|case_study|case study|problem|short_answer|short answer)\b/.test(blob) &&
        !/\bmixed\b/.test(blob) &&
        !mcqLike;
      return mcqLike && !explicitlyNonMcqOnly;
    }
    function withMcqDefaultFeedbackScaffold(draftText, context, optionValues) {
      var draftBody = String(draftText || "").trim();
      if (!isGenerateAssessmentItemsStep(context)) return draftBody;
      if (!isMcqLikeAssessmentContext(context, optionValues, draftBody)) return draftBody;
      if (/incorrect[- ]answer feedback|incorrect-response guidance|learner-facing feedback/i.test(draftBody)) {
        return draftBody;
      }
      var guidance = [
        "",
        "Default quality guidance for MCQ-style items (editable):",
        "- For each item, include a clear correct_answer and a concise explanation_or_rationale for why it is correct.",
        "- For each incorrect option, include learner-facing incorrect-response guidance that explains why it is wrong and what to review next.",
        "- Keep incorrect-response guidance brief, specific, and supportive (no long tutoring scripts).",
        "- Where useful, note the likely misconception behind each distractor in plain language.",
        "- Keep this guidance practical; users may reduce it for answer-key-only or summative use."
      ].join("\n");
      return (draftBody + "\n" + guidance).trim();
    }
    function withPageTaskModeScaffold(draftText, context, optionValues) {
      var draftBody = String(draftText || "").trim();
      if (!isDesignLearningActivitiesStep(context)) return draftBody;
      if (/page-task mode guidance \(auto-applied\)/i.test(draftBody)) return draftBody;
      var bits = [];
      bits.push(String((draftBody || "")).toLowerCase());
      bits.push(String((context && context.stepNotes) || "").toLowerCase());
      bits.push(String((context && context.workflowGoal) || "").toLowerCase());
      if (context && Array.isArray(context.workflowOutputs)) {
        bits.push(context.workflowOutputs.join(" ").toLowerCase());
      }
      if (context && Array.isArray(context.workflowInputs)) {
        bits.push(context.workflowInputs.join(" ").toLowerCase());
      }
      if (optionValues && typeof optionValues === "object") {
        Object.keys(optionValues).forEach(function (k) {
          bits.push(String(optionValues[k] || "").toLowerCase());
        });
      }
      var blob = bits.join("\n");
      var pageIntent = /\b(page|learner page|student page|content page|readable page)\b/.test(blob);
      var taskIntent = /\b(task|learner tasks?|short tasks?|reflection prompts?|self-?check)\b/.test(blob);
      var classroomSignals =
        /\b(classroom|seminar|workshop|whole[ -]?class|group work|pair work|report back|facilitator-?led|teacher-?led|in class|60[- ]?minute|lesson)\b/.test(blob);
      if (!(pageIntent && taskIntent) || classroomSignals) return draftBody;
      var guidance = [
        "",
        "Page-task mode guidance (auto-applied):",
        "- Default to concise embedded learner tasks suitable for direct use on a readable page.",
        "- Prefer individual or self-directed prompts (short written response, explain/compare/calculate, scenario application, reflection, self-check).",
        "- Avoid group choreography, whole-class reporting, and facilitator-led orchestration unless explicitly requested."
      ].join("\n");
      return (draftBody + "\n" + guidance).trim();
    }

    var draft = "";
    if (!template) {
      usedFallbackTemplate = true;
      draft = buildWorkflowStepPromptFallback(cfg, ctx, effectiveSelectedOptions);
    } else {
      var effectiveTemplate = template;
      var templateVars = {};
      templateVars.stepTitle = ctx.stepCanonicalTitle || ctx.stepTitle || "";
      templateVars.stepOutputName = ctx.stepOutputName || "";
      templateVars.preferredOutputFormat = cfg.preferredOutputFormat || "";
      templateVars.stepNotes = stripWorkflowStepParamBlock(ctx.stepNotes || "");
      templateVars.inputArtefactTypes = Array.isArray(ctx.stepInputArtefactSchemas)
        ? ctx.stepInputArtefactSchemas
            .map(function (row) {
              return String((row && (row.type || row.artefact)) || "").trim();
            })
            .filter(function (s) {
              return !!s;
            })
            .join(", ")
        : "";
      if (cfg.defaultPromptVariables && typeof cfg.defaultPromptVariables === "object") {
        Object.keys(cfg.defaultPromptVariables).forEach(function (k) {
          if (!k) return;
          if (!Object.prototype.hasOwnProperty.call(templateVars, k)) {
            var v = cfg.defaultPromptVariables[k];
            templateVars[k] = v == null ? "" : String(v);
          }
        });
      }
      (cfg.userOptions || []).forEach(function (opt) {
        if (!opt || !opt.id) return;
        var raw = Object.prototype.hasOwnProperty.call(optionMap, opt.id)
          ? optionMap[opt.id]
          : "";
        var formatted = formatOptionValueForPrompt(opt, raw);
        templateVars["option:" + opt.id] = formatted;
      });
      draft = applyWorkflowStepPromptTemplate(effectiveTemplate, templateVars).trim();
      draft = applyConfigToDraftText(draft, template, effectiveSelectedOptions);
    }
    if (template && String(cfg.configurationMode || "").toLowerCase() === "none") {
      var missingInstructions =
        /instructions:/i.test(template) && !/instructions:/i.test(draft);
      var missingOutput =
        /output:/i.test(template) && !/output:/i.test(draft);
      var suspiciouslyShort =
        draft.length > 0 && draft.length < Math.max(120, Math.floor(template.length * 0.35));
      var trailingHalfSentence = /from the previous step\s*"?\s*$/i.test(draft);
      if (missingInstructions || missingOutput || suspiciouslyShort || trailingHalfSentence) {
        draft = applyWorkflowStepPromptTemplate(template, templateVars).trim();
        draft = applyConfigToDraftText(draft, template, effectiveSelectedOptions);
      }
    }
    draft = withMcqDefaultFeedbackScaffold(draft, ctx, optionMap);
    draft = withPageTaskModeScaffold(draft, ctx, optionMap);

    els.initialPrompt.value = draft;

    // Keep draft generation side-effect free. Step prompt persistence is explicit
    // when users save as local override or choose a library prompt.
    if (els.finalPrompt) {
      var currentFinal = String(els.finalPrompt.value || "");
      if (!currentFinal || currentFinal === String(state.workflowStepGeneratedDraft || "")) {
        els.finalPrompt.value = draft;
        state.workflowStepGeneratedDraft = draft;
        if (els.saveToLibraryBtn) {
          els.saveToLibraryBtn.disabled = !draft;
        }
      }
    }
  }

  function isFullySpecifiedCanonicalWorkflowStep() {
    if (!state.promptFactoryWorkflowContext) return false;
    var ctx = state.promptFactoryWorkflowContext;
    var cfg = normalizeWorkflowStepPromptConfig(
      ctx.stepPromptFactoryConfig
    );
    if (cfg.configurationMode !== "none") return false;
    if (!String(cfg.promptTemplate || "").trim()) return false;
    var hasResolvedInputs =
      (Array.isArray(ctx.stepInputArtefacts) && ctx.stepInputArtefacts.length > 0) ||
      (Array.isArray(ctx.stepInputArtefactNames) && ctx.stepInputArtefactNames.length > 0) ||
      (Array.isArray(ctx.stepInputArtefactSchemas) && ctx.stepInputArtefactSchemas.length > 0);
    return hasResolvedInputs;
  }

  function hasMissingRequiredWorkflowStepOptions(cfg, selectedOptions) {
    var defs = cfg && Array.isArray(cfg.userOptions) ? cfg.userOptions : [];
    if (!defs.length) return false;
    var selected = Array.isArray(selectedOptions) ? selectedOptions : [];
    var valueById = {};
    selected.forEach(function (row) {
      if (!row || !row.id) return;
      valueById[String(row.id)] = row.value;
    });
    for (var i = 0; i < defs.length; i += 1) {
      var opt = defs[i];
      if (!opt || !opt.id) continue;
      var required = opt.required === true;
      if (!required) continue;
      var v = Object.prototype.hasOwnProperty.call(valueById, opt.id)
        ? valueById[opt.id]
        : opt.default;
      if (v == null || String(v).trim() === "") return true;
    }
    return false;
  }

  function shouldSkipWorkflowStepRefinement(cfg, ctx, selectedOptions) {
    var stepCfg = cfg && typeof cfg === "object" ? cfg : null;
    var stepCtx = ctx && typeof ctx === "object" ? ctx : null;
    if (!stepCfg || !stepCtx) return false;
    if (String(stepCfg.configurationMode || "").toLowerCase() !== "none") return false;
    if (!String(stepCfg.promptTemplate || "").trim()) return false;
    // Strong bypass condition: no-config step + explicit wired inputs + scaffold.
    if (
      Array.isArray(stepCtx.stepInputArtefacts) &&
      stepCtx.stepInputArtefacts.length &&
      !hasMissingRequiredWorkflowStepOptions(stepCfg, selectedOptions)
    ) {
      return true;
    }
    var hasResolvedInputs =
      (Array.isArray(stepCtx.stepInputArtefacts) && stepCtx.stepInputArtefacts.length > 0) ||
      (Array.isArray(stepCtx.stepInputArtefactNames) && stepCtx.stepInputArtefactNames.length > 0) ||
      (Array.isArray(stepCtx.stepInputArtefactSchemas) && stepCtx.stepInputArtefactSchemas.length > 0);
    if (!hasResolvedInputs) return false;
    if (hasMissingRequiredWorkflowStepOptions(stepCfg, selectedOptions)) return false;
    return true;
  }

  function isWorkflowStepLowFrictionMode() {
    if (!state.promptFactoryWorkflowContext) return false;
    var selectedOptions = collectWorkflowStepPromptOptionSelections();
    var cfg = normalizeWorkflowStepPromptConfig(
      state.promptFactoryWorkflowContext.stepPromptFactoryConfig
    );
    if (shouldSkipWorkflowStepRefinement(cfg, state.promptFactoryWorkflowContext, selectedOptions)) {
      return true;
    }
    return cfg.configurationMode === "simple" || cfg.configurationMode === "none";
  }
  function getSelectedModelId() {
    // Product decision: PRISM standardises on one model.
    return "gpt-4.1-mini";
  }

  function getCreativityPreset() {
    var val =
      els.creativitySelect && els.creativitySelect.value
        ? String(els.creativitySelect.value)
        : "balanced";
    if (val === "focused" || val === "balanced" || val === "exploratory") {
      return val;
    }
    return "balanced";
  }

  function getResponseDetailPreset() {
    var val =
      els.responseDetailSelect && els.responseDetailSelect.value
        ? String(els.responseDetailSelect.value)
        : "standard";
    if (val === "short" || val === "standard" || val === "detailed") {
      return val;
    }
    return "standard";
  }

  function getTemperatureFromCreativity() {
    var preset = getCreativityPreset();
    if (preset === "focused") return 0.2;
    if (preset === "exploratory") return 1.0;
    return 0.7;
  }

  function getTokenBudgets() {
    var preset = getResponseDetailPreset();
    if (preset === "short") {
      return {
        refinementQa: 160,
        refinementFinal: 900,
        refinementReview: 256,
        workflowDesign: 1800,
        workflowReview: 320
      };
    }
    if (preset === "detailed") {
      return {
        refinementQa: 384,
        refinementFinal: 2400,
        refinementReview: 640,
        workflowDesign: 3600,
        workflowReview: 768
      };
    }
    return {
      refinementQa: 256,
      refinementFinal: 1600,
      refinementReview: 384,
      workflowDesign: 2600,
      workflowReview: 512
    };
  }

  function getRefinementMaxOutputTokens(isFinal) {
    var budgets = getTokenBudgets();
    return isFinal ? budgets.refinementFinal : budgets.refinementQa;
  }

  function getReviewMaxOutputTokens() {
    return getTokenBudgets().refinementReview;
  }

  function getWorkflowDesignMaxOutputTokens() {
    return getTokenBudgets().workflowDesign;
  }

  function getWorkflowReviewMaxOutputTokens() {
    return getTokenBudgets().workflowReview;
  }

  function debugOpenAI(msg) {
    if (!DEBUG_OPENAI) return;
    try {
      console.log("[PRISM][OpenAI DEBUG] " + msg);
    } catch (e) {}
    try {
      showToast(msg, "success");
    } catch (e2) {}
  }

  function renderWorkflowDesignResult(options) {
    var promptRefine =
      options && typeof options.promptRefine === "boolean"
        ? options.promptRefine
        : false;
    var versions = state.workflowDesignVersions;
    var selected = state.workflowSelectedVersion || "refined";
    var parsed =
      (versions && versions[selected]) ||
      (versions && versions.refined) ||
      (versions && versions.draft) ||
      state.workflowDesignResult ||
      null;
    if (!parsed) return;

    if (els.wfDesignStatus) {
      els.wfDesignStatus.textContent = "Complete";
      els.wfDesignStatus.className = "badge badge-success";
    }

    if (els.wfDesignSummary) {
      var summaryText = String(parsed.summary || "").trim();
      if (!summaryText && els.wfDesignIntent) {
        summaryText = String(els.wfDesignIntent.value || "").trim();
      }
      if (!summaryText) {
        summaryText =
          "The assistant proposed a workflow with " +
          (Array.isArray(parsed.steps) ? parsed.steps.length : 0) +
          " step(s).";
      }
      summaryText = summaryText.split(/\r?\n/)[0].trim();
      els.wfDesignSummary.textContent = summaryText;
      els.wfDesignSummary.classList.toggle("empty", !summaryText);
    }

    if (els.wfDesignSteps) {
      els.wfDesignSteps.innerHTML = "";
      (parsed.steps || []).forEach(function (step, index) {
        var li = document.createElement("li");
        li.className = "workflow-step";
        li.setAttribute("data-wf-step-index", String(index));

        var header = document.createElement("div");
        header.className = "workflow-step-header";

        var label = document.createElement("div");
        label.className = "workflow-step-header-title";
        label.textContent = "Step " + (index + 1);

        var actions = document.createElement("div");
        actions.className = "workflow-step-header-actions";

        var deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "btn small danger";
        deleteBtn.textContent = "Delete";
        deleteBtn.setAttribute("data-action", "delete-wf-step");
        actions.appendChild(deleteBtn);

        header.appendChild(label);
        header.appendChild(actions);
        li.appendChild(header);

        var fields = document.createElement("div");
        fields.className = "workflow-step-fields";

        var titleGroup = document.createElement("div");
        titleGroup.className = "form-group small";
        var titleLabel = document.createElement("label");
        titleLabel.textContent = "Title";
        var titleInput = document.createElement("input");
        titleInput.type = "text";
        titleInput.value = step.title || "";
        titleInput.autocomplete = "off";
        titleInput.setAttribute("data-field", "title");
        titleGroup.appendChild(titleLabel);
        titleGroup.appendChild(titleInput);

        var roleGroup = document.createElement("div");
        roleGroup.className = "form-group small";
        var roleLabel = document.createElement("label");
        roleLabel.textContent = "Role / purpose";
        var roleInput = document.createElement("input");
        roleInput.type = "text";
        var displayRole = String(step.role || "").trim() || deriveWorkflowStepRoleFromMetadata(
          step,
          state.workflowStepPatternCatalog,
          null
        );
        roleInput.value = displayRole;
        roleInput.autocomplete = "off";
        roleInput.setAttribute("data-field", "role");
        roleGroup.appendChild(roleLabel);
        roleGroup.appendChild(roleInput);

        fields.appendChild(titleGroup);
        fields.appendChild(roleGroup);
        li.appendChild(fields);

        els.wfDesignSteps.appendChild(li);
      });
    }

    if (els.wfDesignSaveBtn) {
      els.wfDesignSaveBtn.disabled = false;
    }
    if (els.wfDesignReviewBtn) {
      var hasDraft =
        !!(
          versions &&
          versions.draft &&
          versions.draft.steps &&
          versions.draft.steps.length
        );
      els.wfDesignReviewBtn.disabled = !hasDraft;
    }
    if (els.wfDesignVersionSelect) {
      els.wfDesignVersionSelect.value = selected;
    }

    if (promptRefine) {
      var hasPostGenerationQueue =
        !!(
          state.workflowBriefElicitation &&
          String(state.workflowBriefElicitation.stage || "") === "post_generation_refinement" &&
          Array.isArray(state.workflowBriefElicitation.queue) &&
          state.workflowBriefElicitation.queue.length
        );
      if (hasPostGenerationQueue) {
        return;
      }
      // After the initial design, prompt the user about refinement.
      state.workflowAwaitingRefineOptIn = true;
      state.workflowAwaitingSuggestionAnswer = false;
      state.workflowReviewSuggestions = null;
      state.workflowReviewIndex = 0;
      appendWorkflowDesignLog(
        "assistant",
        "I’ve designed a workflow with " +
          (parsed.steps ? parsed.steps.length : 0) +
          " step(s), shown below. Would you like to refine it further? (yes/no)"
      );
    }
  }

  function getSelectedWorkflowDesign() {
    var versions = state.workflowDesignVersions;
    var selected = state.workflowSelectedVersion || "refined";
    return (
      (versions && versions[selected]) ||
      (versions && versions.refined) ||
      (versions && versions.draft) ||
      state.workflowDesignResult ||
      null
    );
  }

  function normalizeDependsAfterDelete(steps, deletedIndexZeroBased) {
    if (!Array.isArray(steps)) return;
    var deletedOneBased = deletedIndexZeroBased + 1;
    steps.forEach(function (s) {
      if (!s || !Array.isArray(s.depends_on)) return;
      var next = [];
      s.depends_on.forEach(function (n) {
        if (typeof n !== "number") return;
        if (n === deletedOneBased) return; // drop reference to deleted step
        if (n > deletedOneBased) next.push(n - 1);
        else next.push(n);
      });
      // Deduplicate while preserving order.
      var seen = {};
      s.depends_on = next.filter(function (n) {
        if (seen[n]) return false;
        seen[n] = true;
        return true;
      });
    });
  }

  function updateWorkflowDesignStepField(index, field, value) {
    var versions = state.workflowDesignVersions;
    var selected = state.workflowSelectedVersion || "refined";
    var design = getSelectedWorkflowDesign();
    if (!design || !Array.isArray(design.steps)) return;
    if (index < 0 || index >= design.steps.length) return;
    if (field !== "title" && field !== "role") return;

    design.steps[index][field] = value;

    // Keep versions in sync when editing: edits apply to the selected version only.
    if (versions && versions[selected] === design) {
      // already editing selected version object
    } else if (versions && versions[selected]) {
      versions[selected] = design;
    }
  }

  function deleteWorkflowDesignStep(index) {
    var design = getSelectedWorkflowDesign();
    if (!design || !Array.isArray(design.steps)) return;
    if (index < 0 || index >= design.steps.length) return;

    design.steps.splice(index, 1);
    normalizeDependsAfterDelete(design.steps, index);

    renderWorkflowDesignResult({ promptRefine: false });
  }

  function appendWorkflowDesignLog(role, content) {
    if (!els.wfDesignLog) return;
    var item = document.createElement("div");
    item.className = "conversation-item " + (role === "assistant" ? "assistant" : "user");
    var roleLabel = document.createElement("div");
    roleLabel.className = "conversation-role";
    roleLabel.textContent = role === "assistant" ? "Assistant" : "You";
    var body = document.createElement("div");
    body.textContent = content;
    item.appendChild(roleLabel);
    item.appendChild(body);
    els.wfDesignLog.appendChild(item);
    els.wfDesignLog.scrollTop = els.wfDesignLog.scrollHeight;
  }

  function tryParseWorkflowDesignJson(text) {
    if (!text) return null;
    var trimmed = String(text).trim();
    if (trimmed.startsWith("```")) {
      var start = trimmed.indexOf("{");
      var end = trimmed.lastIndexOf("}");
      if (start !== -1 && end !== -1 && end > start) {
        trimmed = trimmed.slice(start, end + 1);
      }
    }
    try {
      return JSON.parse(trimmed);
    } catch (e) {
      var s = trimmed.indexOf("{");
      var eIdx = trimmed.lastIndexOf("}");
      if (s !== -1 && eIdx !== -1 && eIdx > s) {
        var candidate = trimmed.slice(s, eIdx + 1);
        try {
          return JSON.parse(candidate);
        } catch (e2) {
          return null;
        }
      }
      return null;
    }
  }

  function extractResponsesText(data) {
    if (!data || !Array.isArray(data.output)) return "";
    var parts = [];
    data.output.forEach(function (entry) {
      if (!entry || !Array.isArray(entry.content)) return;
      entry.content.forEach(function (c) {
        if (c && typeof c.text === "string" && c.text.trim()) {
          parts.push(c.text.trim());
        }
      });
    });
    return parts.join("\n").trim();
  }

  function getSelectedWorkflowDomains() {
    if (!Array.isArray(state.workflowSelectedDomains)) {
      return ["general"];
    }
    var selected = [];
    if (state.workflowSelectedDomains.indexOf("general") !== -1) {
      selected.push("general");
    } else {
      selected = ["general"];
    }
    var extra = state.workflowSelectedDomains.find(function (d) {
      return d && d !== "general";
    });
    if (extra) selected.push(extra);
    return selected;
  }

  function renderWorkflowDomainSelector(options) {
    if (!els.wfDesignDomainSelect) return;
    var opts = options && typeof options === "object" ? options : {};
    var domains = Array.isArray(opts.domains) ? opts.domains : [];
    state.workflowDomainOptions = domains.slice();
    var selected = getSelectedWorkflowDomains();
    var selectedExtra = selected.find(function (d) {
      return d !== "general";
    }) || "general";
    els.wfDesignDomainSelect.innerHTML = "";

    if (!domains.length) {
      var fallback = document.createElement("option");
      fallback.value = "general";
      fallback.textContent = "General";
      els.wfDesignDomainSelect.appendChild(fallback);
      els.wfDesignDomainSelect.value = "general";
      return;
    }

    var generalOption = document.createElement("option");
    generalOption.value = "general";
    generalOption.textContent = "General";
    els.wfDesignDomainSelect.appendChild(generalOption);

    domains.forEach(function (domain) {
      if (!domain || !domain.id) return;
      if (domain.alwaysOn) return;
      var option = document.createElement("option");
      option.value = domain.id;
      option.textContent = domain.label || domain.id;
      els.wfDesignDomainSelect.appendChild(option);
    });

    if (!els.wfDesignDomainSelect.querySelector('option[value="' + selectedExtra + '"]')) {
      selectedExtra = "general";
    }
    els.wfDesignDomainSelect.value = selectedExtra;
    els.wfDesignDomainSelect.onchange = handleWorkflowDomainSelectionChange;
  }

  function renderWorkflowFactoryDomainUiHints(uiHints) {
    var hints = uiHints && typeof uiHints === "object" ? uiHints : {};
    var scopeScaleHint = String(
      hints.scope_scale || "e.g. single task, short session, multi-step workflow, or programme"
    );
    if (els.wfDesignIntentHint) {
      els.wfDesignIntentHint.textContent =
        String(hints.design_intent || "State the primary design intent in one line.");
    }
    if (els.wfDesignAudienceHint) {
      els.wfDesignAudienceHint.textContent =
        String(hints.audience || "Primary target users or learners.");
    }
    if (els.wfDesignScaleHint) {
      els.wfDesignScaleHint.textContent = scopeScaleHint;
    }
    if (els.wfDesignScale) {
      var scalePlaceholder = String(
        hints.scope_scale_placeholder || "e.g. 30 mins, 1 day, 1 week, ongoing"
      );
      els.wfDesignScale.placeholder = scalePlaceholder;
    }
    if (els.wfDesignInputsHint) {
      els.wfDesignInputsHint.textContent =
        String(hints.inputs || "Source content or artefacts available at start.");
    }
    if (els.wfDesignDesiredOutputsHint) {
      els.wfDesignDesiredOutputsHint.textContent =
        String(hints.desired_outputs || "What the workflow should produce.");
    }
    if (els.wfDesignConstraintsHint) {
      els.wfDesignConstraintsHint.textContent =
        String(hints.constraints || "Hard requirements: time, tools, policy, accessibility, delivery conditions.");
    }
  }

  function renderWorkflowFactoryDomainExtraFields(extraFields) {
    if (!els.wfDomainExtraFields) return;
    var extras = Array.isArray(extraFields) ? extraFields : [];
    els.wfDomainExtraFields.innerHTML = "";
    if (!extras.length) {
      els.wfDomainExtraFields.classList.add("hidden");
      return;
    }
    extras.forEach(function (f) {
      if (!f || !f.id) return;
      var factorId = String(f.id || "");
      function getDisplayChoiceLabel(rawChoice) {
        if (rawChoice && typeof rawChoice === "object") {
          var label = rawChoice.label != null ? String(rawChoice.label) : "";
          var value = rawChoice.value != null ? String(rawChoice.value) : "";
          return label || value;
        }
        return String(rawChoice || "");
      }
      function getChoiceValue(rawChoice) {
        if (rawChoice && typeof rawChoice === "object") {
          return rawChoice.value != null ? String(rawChoice.value) : "";
        }
        return String(rawChoice || "");
      }
      var group = document.createElement("div");
      group.className = "form-group";
      group.setAttribute("data-domain-extra-factor", String(f.id));
      var label = document.createElement("label");
      label.textContent = f.label || f.id;
      label.setAttribute("for", "wfDomainExtra_" + f.id);
      group.appendChild(label);
      var t = String(f.type || "text").toLowerCase();
      var input;
      if (t === "textarea") {
        input = document.createElement("textarea");
        input.rows = 2;
      } else if (t === "select") {
        input = document.createElement("select");
        var isRequired = !!f.required;
        if (!isRequired) {
          var emptyOpt = document.createElement("option");
          emptyOpt.value = "";
          emptyOpt.textContent = "Select (optional)";
          input.appendChild(emptyOpt);
        }
        var choices = Array.isArray(f.choices) ? f.choices : [];
        choices.forEach(function (choice) {
          var choiceValue = getChoiceValue(choice);
          var opt = document.createElement("option");
          opt.value = choiceValue;
          opt.textContent = getDisplayChoiceLabel(choice);
          input.appendChild(opt);
        });
      } else {
        input = document.createElement("input");
        input.type = "text";
      }
      input.id = "wfDomainExtra_" + f.id;
      input.setAttribute("data-factor-id", String(f.id));
      input.autocomplete = "off";
      if (f.placeholder) input.placeholder = String(f.placeholder);
      if (
        Object.prototype.hasOwnProperty.call(f, "default") &&
        input.value === "" &&
        !!f.required
      ) {
        input.value = String(f.default == null ? "" : f.default);
      }
      group.appendChild(input);
      var helpText = f.helpText ? String(f.helpText) : "";
      if (helpText) {
        var hint = document.createElement("p");
        hint.className = "helper-text";
        hint.textContent = helpText;
        group.appendChild(hint);
      }
      els.wfDomainExtraFields.appendChild(group);
    });
    els.wfDomainExtraFields.classList.remove("hidden");
  }

  function collectWorkflowDomainExtraFieldValues() {
    var out = {};
    if (!els.wfDomainExtraFields) return out;
    var nodes = els.wfDomainExtraFields.querySelectorAll("[data-factor-id]");
    nodes.forEach(function (node) {
      var id = String(node.getAttribute("data-factor-id") || "").trim();
      if (!id) return;
      var value = String(node.value || "").trim();
      if (!value) return;
      out[id] = value;
    });
    return out;
  }

  function renderWorkflowFactoryDomainUiConfig(selectedDomains) {
    var domains = Array.isArray(selectedDomains) ? selectedDomains : getSelectedWorkflowDomains();
    var requestedSignature = JSON.stringify((domains || []).slice().sort());
    state.workflowFactoryDomainRequestSignature = requestedSignature;
    if (
      !window.WorkflowGenerationContext ||
      typeof window.WorkflowGenerationContext.getWorkflowBriefConfig !== "function"
    ) {
      state.workflowDomainUiConfig = null;
      renderWorkflowFactoryDomainUiHints({});
      renderWorkflowFactoryDomainExtraFields([]);
      renderWorkflowFactoryStartingArtefactOptions(domains);
      return;
    }
    window.WorkflowGenerationContext
      .getWorkflowBriefConfig({ selectedDomains: domains })
      .then(function (result) {
        var currentSignature = JSON.stringify((getSelectedWorkflowDomains() || []).slice().sort());
        if (state.workflowFactoryDomainRequestSignature !== requestedSignature || currentSignature !== requestedSignature) {
          return;
        }
        var cfg = result && result.config ? result.config : null;
        state.workflowDomainUiConfig = cfg;
        var hints = cfg && cfg.uiHints && typeof cfg.uiHints === "object" ? cfg.uiHints : {};
        var extras = cfg && Array.isArray(cfg.extraFields) ? cfg.extraFields : [];
        renderWorkflowFactoryDomainUiHints(hints);
        renderWorkflowFactoryDomainExtraFields(extras);
        renderWorkflowFactoryStartingArtefactOptions(domains);
        updateWorkflowFactoryInputsCopyFromStartingPoint();
      })
      .catch(function () {
        var currentSignature = JSON.stringify((getSelectedWorkflowDomains() || []).slice().sort());
        if (state.workflowFactoryDomainRequestSignature !== requestedSignature || currentSignature !== requestedSignature) {
          return;
        }
        state.workflowDomainUiConfig = null;
        renderWorkflowFactoryDomainUiHints({});
        renderWorkflowFactoryDomainExtraFields([]);
        renderWorkflowFactoryStartingArtefactOptions(domains);
        updateWorkflowFactoryInputsCopyFromStartingPoint();
      });
  }

  function updateWorkflowFactoryInputsCopyFromStartingPoint() {
    if (!els.wfDesignInputs) return;
    var selected = els.wfDesignStartingArtefact
      ? String(els.wfDesignStartingArtefact.value || "").trim()
      : "";
    var sourceMaterialMode = !selected;
    if (els.wfDesignInputsLabel) {
      els.wfDesignInputsLabel.textContent = sourceMaterialMode
        ? "Source material / inputs"
        : "Input details (optional)";
    }
    if (els.wfDesignInputsHint) {
      els.wfDesignInputsHint.textContent = sourceMaterialMode
        ? "Describe the source content or inputs available at the start."
        : "Describe or provide the selected starting point.";
    }
    els.wfDesignInputs.placeholder = sourceMaterialMode
      ? "e.g. PDF, notes, transcript, list of topics..."
      : "e.g. paste or describe the selected starting point, or note where it comes from";
  }

  function renderWorkflowFactoryStartingArtefactOptions(selectedDomains) {
    if (!els.wfDesignStartingArtefact) return;
    var current = String(els.wfDesignStartingArtefact.value || "").trim();
    function normalizeChoiceRow(choice) {
      if (choice && typeof choice === "object") {
        var value = choice.value != null ? String(choice.value).trim() : "";
        var label = choice.label != null ? String(choice.label).trim() : value;
        if (!value) return null;
        return { value: value, label: label || value };
      }
      var raw = String(choice == null ? "" : choice).trim();
      if (!raw) return null;
      return { value: raw, label: raw };
    }
    function renderInputStrategyOptions(choices) {
      var opts = (Array.isArray(choices) ? choices : [])
        .map(normalizeChoiceRow)
        .filter(function (row) { return !!row; });
      els.wfDesignStartingArtefact.innerHTML = "";
      var placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "Select starting point…";
      els.wfDesignStartingArtefact.appendChild(placeholder);
      opts.forEach(function (row) {
        var opt = document.createElement("option");
        opt.value = row.value;
        opt.textContent = row.label;
        els.wfDesignStartingArtefact.appendChild(opt);
      });
      els.wfDesignStartingArtefact.value =
        els.wfDesignStartingArtefact.querySelector('option[value="' + current + '"]')
          ? current
          : "";
      updateWorkflowFactoryInputsCopyFromStartingPoint();
    }
    var STARTING_ARTEFACT_ALLOWLIST = {
      general: [
        "normalized_content",
        "summary",
        "key_points",
        "structured_data",
        "analysis",
        "entities",
        "relationships"
      ],
      "learning-design": [
        "normalized_content",
        "knowledge_model",
        "learning_outcomes",
        "learning_activities",
        "activity_materials",
        "assessment_blueprint",
        "mcq_items",
        "learning_sequence",
        "marking_rubric"
      ]
    };
    function getVisibleDomainId() {
      var domains = Array.isArray(selectedDomains) ? selectedDomains : [];
      var structured = domains.find(function (id) {
        return String(id || "").toLowerCase() !== "general";
      });
      return String(structured || "general").toLowerCase();
    }
    function getAllowSetForDomain(domainId) {
      var list = STARTING_ARTEFACT_ALLOWLIST[String(domainId || "").toLowerCase()];
      if (!Array.isArray(list) || !list.length) return null;
      var set = {};
      list.forEach(function (id) {
        var key = String(id || "").toLowerCase().trim();
        if (key) set[key] = true;
      });
      return set;
    }
    function renderLearningDesignStartingPointOptions() {
      var learningDesignOptions = [
        { id: "generate_from_topic", label: "Generate from topic" },
        { id: "provided_source_content", label: "Use existing source content" },
        { id: "mixed", label: "Both source content and generated content" }
      ];
      els.wfDesignStartingArtefact.innerHTML = "";
      var placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "Select starting point…";
      els.wfDesignStartingArtefact.appendChild(placeholder);
      learningDesignOptions.forEach(function (item) {
        var opt = document.createElement("option");
        opt.value = String(item.id);
        opt.textContent = String(item.label);
        els.wfDesignStartingArtefact.appendChild(opt);
      });
      els.wfDesignStartingArtefact.value =
        els.wfDesignStartingArtefact.querySelector('option[value="' + current + '"]')
          ? current
          : "";
      updateWorkflowFactoryInputsCopyFromStartingPoint();
    }
    function renderOptions(items) {
      var opts = Array.isArray(items) ? items : [];
      var visibleDomainId = getVisibleDomainId();
      var allowSet = getAllowSetForDomain(visibleDomainId);
      opts = opts.filter(function (item) {
        if (!item || !item.id) return false;
        var itemDomain = String((item.domainId || "")).toLowerCase();
        if (visibleDomainId && itemDomain && itemDomain !== visibleDomainId) return false;
        if (!allowSet) return true;
        return !!allowSet[String(item.id).toLowerCase().trim()];
      });
      els.wfDesignStartingArtefact.innerHTML = "";
      var placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "Select starting point…";
      els.wfDesignStartingArtefact.appendChild(placeholder);
      opts.forEach(function (item) {
        if (!item || !item.id) return;
        var opt = document.createElement("option");
        opt.value = String(item.id);
        opt.textContent = String(item.label || item.id);
        els.wfDesignStartingArtefact.appendChild(opt);
      });
      els.wfDesignStartingArtefact.value =
        els.wfDesignStartingArtefact.querySelector('option[value="' + current + '"]')
          ? current
          : "";
      updateWorkflowFactoryInputsCopyFromStartingPoint();
    }
    function renderFromBriefConfig() {
      if (
        !window.WorkflowGenerationContext ||
        typeof window.WorkflowGenerationContext.getWorkflowBriefConfig !== "function"
      ) {
        return Promise.resolve(false);
      }
      return window.WorkflowGenerationContext
        .getWorkflowBriefConfig({ selectedDomains: selectedDomains })
        .then(function (result) {
          var cfg = result && result.config ? normalizeWorkflowBriefConfig(result.config) : null;
          if (!cfg) return false;
          var factors = (cfg.requiredFactors || []).concat(cfg.optionalFactors || []);
          var inputStrategyFactor = factors.find(function (f) {
            return String((f && f.id) || "").trim() === "input_strategy";
          });
          var choices = inputStrategyFactor && Array.isArray(inputStrategyFactor.choices)
            ? inputStrategyFactor.choices
            : [];
          if (!choices.length) return false;
          renderInputStrategyOptions(choices);
          return true;
        })
        .catch(function () {
          return false;
        });
    }
    renderFromBriefConfig().then(function (usedBriefConfigOptions) {
      var visibleDomainId = getVisibleDomainId();
      if (visibleDomainId === "learning-design") {
        renderLearningDesignStartingPointOptions();
        return;
      }
      if (usedBriefConfigOptions) return;
      if (
        !window.WorkflowGenerationContext ||
        typeof window.WorkflowGenerationContext.getDomainArtefactOptions !== "function"
      ) {
        renderOptions([]);
        return;
      }
      window.WorkflowGenerationContext
        .getDomainArtefactOptions({ selectedDomains: selectedDomains })
        .then(function (items) {
          renderOptions(items);
        })
        .catch(function () {
          renderOptions([]);
        });
    });
  }

  function renderWorkflowDetailDomainUiHints(selectedDomains) {
    var defaults = {
      goal: "Describe the final result this workflow should deliver.",
      audience: "Primary end users or learners for this workflow output.",
      constraints: "Non-negotiables such as policy, compliance, style, or delivery constraints.",
      inputs: "Source materials this workflow expects at runtime.",
      desired_outputs: "Comma-separated artefact names this workflow should produce."
    };
    function apply(hints) {
      var h = hints && typeof hints === "object" ? hints : {};
      if (els.workflowGoalHint) {
        els.workflowGoalHint.textContent = String(h.design_intent || h.goal || defaults.goal);
      }
      if (els.workflowAudienceHint) {
        els.workflowAudienceHint.textContent = String(h.audience || defaults.audience);
      }
      if (els.workflowConstraintsHint) {
        els.workflowConstraintsHint.textContent = String(h.constraints || defaults.constraints);
      }
      if (els.workflowArtefactsHint) {
        els.workflowArtefactsHint.textContent = String(h.inputs || defaults.inputs);
      }
      if (els.workflowOutputsHint) {
        els.workflowOutputsHint.textContent = String(h.desired_outputs || defaults.desired_outputs);
      }
      if (els.workflowNameHint) {
        els.workflowNameHint.textContent = "A clear internal name for this saved workflow.";
      }
    }
    var domains = Array.isArray(selectedDomains) ? selectedDomains : ["general"];
    if (
      !window.WorkflowGenerationContext ||
      typeof window.WorkflowGenerationContext.getWorkflowBriefConfig !== "function"
    ) {
      apply({});
      return;
    }
    window.WorkflowGenerationContext
      .getWorkflowBriefConfig({ selectedDomains: domains })
      .then(function (result) {
        var cfg = result && result.config ? result.config : null;
        var hints = cfg && cfg.uiHints && typeof cfg.uiHints === "object" ? cfg.uiHints : {};
        apply(hints);
      })
      .catch(function () {
        apply({});
      });
  }

  function handleWorkflowDomainSelectionChange() {
    if (!els.wfDesignDomainSelect) return;
    var selectedValue = els.wfDesignDomainSelect.value || "general";
    var next = ["general"];
    if (selectedValue !== "general") next.push(selectedValue);
    state.workflowSelectedDomains = next;
    if (
      window.WorkflowGenerationContext &&
      typeof window.WorkflowGenerationContext.persistSelectedDomains === "function"
    ) {
      window.WorkflowGenerationContext.persistSelectedDomains(next);
    }
    // Clear previous domain overlay immediately to avoid stale leakage while loading new config.
    renderWorkflowFactoryDomainUiHints({});
    renderWorkflowFactoryDomainExtraFields([]);
    renderWorkflowFactoryDomainUiConfig(next);
  }

  function isGeneralOnlySelection(selectedDomains) {
    var domains = Array.isArray(selectedDomains) ? selectedDomains : [];
    var structured = domains.find(function (d) {
      return String(d || "").toLowerCase().trim() && String(d || "").toLowerCase().trim() !== "general";
    });
    return !structured;
  }

  function initWorkflowDomainSelector() {
    var fallbackDomains = [
      { id: "general", label: "General", alwaysOn: true },
      { id: "learning-design", label: "Learning Design", alwaysOn: false },
      { id: "research", label: "Research", alwaysOn: false }
    ];

    // Always default to General on load.
    state.workflowSelectedDomains = ["general"];

    if (
      !window.WorkflowGenerationContext ||
      typeof window.WorkflowGenerationContext.getDomainOptions !== "function"
    ) {
      renderWorkflowDomainSelector({ domains: fallbackDomains });
      renderWorkflowFactoryDomainUiConfig(getSelectedWorkflowDomains());
      return;
    }

    window.WorkflowGenerationContext.getDomainOptions()
      .then(function (domains) {
        renderWorkflowDomainSelector({ domains: domains });
        renderWorkflowFactoryDomainUiConfig(getSelectedWorkflowDomains());
      })
      .catch(function () {
        renderWorkflowDomainSelector({ domains: fallbackDomains });
        renderWorkflowFactoryDomainUiConfig(getSelectedWorkflowDomains());
      });
  }

  function refreshWorkflowStepPatternCatalogForDomains(selectedDomains) {
    var domains = Array.isArray(selectedDomains) && selectedDomains.length
      ? selectedDomains
      : getSelectedWorkflowDomains();
    if (
      !window.WorkflowGenerationContext ||
      typeof window.WorkflowGenerationContext.getStepPatternCatalog !== "function"
    ) {
      return Promise.resolve(state.workflowStepPatternCatalog || []);
    }
    return window.WorkflowGenerationContext
      .getStepPatternCatalog({ selectedDomains: domains })
      .then(function (catalog) {
        state.workflowStepPatternCatalog = Array.isArray(catalog) ? catalog : [];
        return state.workflowStepPatternCatalog;
      })
      .catch(function () {
        return state.workflowStepPatternCatalog || [];
      });
  }

  function workflowHasRunnerGuidanceInCatalog(workflow, catalog) {
    var wf = workflow && typeof workflow === "object" ? workflow : null;
    var pool = Array.isArray(catalog) ? catalog : [];
    if (!wf || !Array.isArray(wf.steps) || !wf.steps.length || !pool.length) return false;
    for (var i = 0; i < wf.steps.length; i += 1) {
      var step = wf.steps[i] || {};
      var pattern = null;
      var canonicalId = String(step.canonical_step_id || "").trim();
      if (canonicalId) {
        pattern = getPatternByCanonicalStepId(canonicalId, pool);
      }
      if (!pattern) {
        var canonicalTitle = pickCanonicalWorkflowStepTitle(String(step.title || ""), pool);
        pattern = getPatternByCanonicalWorkflowTitle(canonicalTitle || String(step.title || ""), pool);
      }
      var pf = pattern && pattern.promptFactory && typeof pattern.promptFactory === "object"
        ? pattern.promptFactory
        : null;
      var ri = pf && pf.runnerInstructions && typeof pf.runnerInstructions === "object"
        ? pf.runnerInstructions
        : null;
      if (ri && String(ri.what_this_step_does || "").trim()) return true;
    }
    return false;
  }

  function getFirstStructuredDomainId(selectedDomains) {
    var domains = Array.isArray(selectedDomains) ? selectedDomains : [];
    for (var i = 0; i < domains.length; i++) {
      var id = String(domains[i] || "").trim();
      if (id && id.toLowerCase() !== "general") return id;
    }
    return "";
  }

  function shouldRecommendLearningDesignDomain(designIntent, goal, selectedDomains) {
    var domains = Array.isArray(selectedDomains) ? selectedDomains : [];
    var hasStructured = domains.some(function (d) {
      return String(d || "").toLowerCase().trim() !== "general";
    });
    if (hasStructured) return false;
    var blob = [String(designIntent || ""), String(goal || "")].join(" ").toLowerCase();
    return /\b(workshop|lesson|teaching|assessment|learners?|course|module)\b/.test(blob);
  }

  function getGeneralFallbackBriefConfig() {
    return {
      version: "1",
      requiredFactors: [
        {
          id: "design_intent",
          label: "Design intent",
          question: "What are you trying to design or produce?",
          type: "text",
          required: true
        },
        {
          id: "audience",
          label: "Audience",
          question: "Who is this workflow for?",
          type: "text",
          required: true
        },
        {
          id: "scope_scale",
          label: "Scope / scale",
          question: "What is the scale (for example: 1-hour session, short course)?",
          type: "text",
          required: true
        }
      ],
      optionalFactors: [],
      inferenceRules: [],
      mappingRules: [
        { factor: "audience", mapsTo: ["workflow.workflowOutputSpec.audience"] },
        { factor: "scope_scale", mapsTo: ["workflow.workflowOutputSpec.constraints.scope_scale"] },
        { factor: "design_intent", mapsTo: ["workflow.workflowOutputSpec.goal"] }
      ],
      stopConditions: ["all_required_factors_resolved"],
      questionPolicy: { maxDefaultQuestions: 5, askOptionalByDefault: false }
    };
  }

  function normalizeWorkflowBriefConfig(raw) {
    var cfg = raw && typeof raw === "object" ? raw : {};
    var qp =
      cfg.questionPolicy && typeof cfg.questionPolicy === "object"
        ? cfg.questionPolicy
        : {};
    return {
      version: String(cfg.version || "1"),
      requiredFactors: Array.isArray(cfg.requiredFactors) ? cfg.requiredFactors : [],
      optionalFactors: Array.isArray(cfg.optionalFactors) ? cfg.optionalFactors : [],
      refinementFactors: Array.isArray(cfg.refinementFactors) ? cfg.refinementFactors : [],
      inferenceRules: Array.isArray(cfg.inferenceRules) ? cfg.inferenceRules : [],
      mappingRules: Array.isArray(cfg.mappingRules) ? cfg.mappingRules : [],
      intentClasses: cfg.intentClasses && typeof cfg.intentClasses === "object" ? cfg.intentClasses : {},
      stopConditions: Array.isArray(cfg.stopConditions) ? cfg.stopConditions : [],
      questionPolicy: {
        maxDefaultQuestions: Number(qp.maxDefaultQuestions || 4),
        askOptionalByDefault: !!qp.askOptionalByDefault,
        maxRefinementQuestions: Number(qp.maxRefinementQuestions || 6),
        askRefinementByDefault:
          Object.prototype.hasOwnProperty.call(qp, "askRefinementByDefault")
            ? !!qp.askRefinementByDefault
            : true
      }
    };
  }

  function resolveAssessmentIntentClassMetadata(config, base, resolved, design) {
    var cfg = normalizeWorkflowBriefConfig(config);
    var classes = cfg.intentClasses && typeof cfg.intentClasses === "object" ? cfg.intentClasses : {};
    var meta = classes.assessment_pack && typeof classes.assessment_pack === "object"
      ? classes.assessment_pack
      : null;
    if (!meta) return null;
    var generatedStepIds = getGeneratedWorkflowStepIds(design);
    var stepIncludes = Array.isArray(meta.stepIncludes) ? meta.stepIncludes : [];
    if (stepIncludes.length) {
      var hasIncludedStep = stepIncludes.some(function (sid) {
        var normalized = normalizeCanonicalStepId(sid);
        if (!normalized) return false;
        return !!generatedStepIds[normalized] || !!generatedStepIds["step_" + normalized];
      });
      if (!hasIncludedStep) return null;
    } else if (!generatedStepIds.step_generate_assessment_items && !generatedStepIds.generate_assessment_items) {
      return null;
    }
    var detection = meta.detection && typeof meta.detection === "object" ? meta.detection : {};
    var resolvedFactors = resolved && typeof resolved === "object" ? resolved : {};
    var baseObj = base && typeof base === "object" ? base : {};
    var goalBlob = String([
      baseObj.designIntent || "",
      baseObj.goal || "",
      baseObj.desiredOutputs || ""
    ].join(" ")).toLowerCase();
    var inputsBlob = String([
      baseObj.inputs || "",
      baseObj.scopeConstraints || "",
      baseObj.audience || ""
    ].join(" ")).toLowerCase();
    var factorRules = detection.whenResolvedFactorsInclude && typeof detection.whenResolvedFactorsInclude === "object"
      ? detection.whenResolvedFactorsInclude
      : {};
    var factorMatch = Object.keys(factorRules).every(function (k) {
      return String(resolvedFactors[k]) === String(factorRules[k]);
    });
    var goalTerms = Array.isArray(detection.whenGoalMentionsAnyOf) ? detection.whenGoalMentionsAnyOf : [];
    var inputTerms = Array.isArray(detection.whenInputsMentionAnyOf) ? detection.whenInputsMentionAnyOf : [];
    var goalHit = !goalTerms.length || goalTerms.some(function (kw) {
      return goalBlob.indexOf(String(kw || "").toLowerCase()) !== -1;
    });
    var inputHit = !inputTerms.length || inputTerms.some(function (kw) {
      return inputsBlob.indexOf(String(kw || "").toLowerCase()) !== -1;
    });
    if (!factorMatch || !goalHit || !inputHit) return null;
    return meta;
  }

  function extractSessionMaterialsFromBriefText(text) {
    var t = String(text || "").toLowerCase();
    if (!t) return [];
    // Normalize light punctuation/plural variants so phrasing like
    // "facilitator's guide" / "facilitators guide" still matches.
    t = t
      .replace(/['’`"]/g, "")
      .replace(/[^a-z0-9\s_-]+/g, " ")
      .replace(/\bfacilitators\b/g, "facilitator")
      .replace(/\binstructors\b/g, "instructor")
      .replace(/\bteachers\b/g, "teacher")
      .replace(/\bguides\b/g, "guide")
      .replace(/\bstudents\b/g, "student")
      .replace(/\blearners\b/g, "learner")
      .replace(/\bparticipants\b/g, "participant")
      .replace(/\bhandouts\b/g, "handout")
      .replace(/\bworksheets\b/g, "worksheet")
      .replace(/\bpacks\b/g, "pack")
      .replace(/\bsheets\b/g, "sheet")
      .replace(/\bmaterials\b/g, "material")
      .replace(/\btake[\s-]?away\b/g, "takeaway")
      .replace(/\s+/g, " ")
      .trim();
    var out = [];
    function pushUnique(v) {
      if (out.indexOf(v) === -1) out.push(v);
    }
    if (
      /\b(facilitator guide|teacher guide|instructor guide|teaching guide|session guide|runbook|run guide|run the session)\b/.test(t)
    ) {
      pushUnique("page");
    }
    var participantHandoutSignals = [
      /\bhandout\b/,
      /\bstudent handout\b/,
      /\blearner handout\b/,
      /\bparticipant handout\b/,
      /\bhandout for student\b/,
      /\bany handout\b/,
      /\bany handout for student\b/,
      /\bmaterial for student\b/,
      /\bsomething for student to takeaway\b/,
      /\btakeaway sheet\b/,
      /\bstudy pack\b/,
      /\bstudent pack\b/,
      /\blearner pack\b/,
      /\bworksheet\b/,
      /\bworksheet for learner\b/
    ];
    if (participantHandoutSignals.some(function (re) { return re.test(t); })) {
      pushUnique("page");
    }
    if (
      /\b(learner page|student page|moodle page|vle page|online content page|learner-facing page|student-facing page)\b/.test(t)
    ) {
      pushUnique("page");
    }
    if (
      /\b(slides?|slide deck|presentation)\b/.test(t)
    ) {
      pushUnique("slide_deck");
    }
    if (
      /\b(vle structure|moodle structure|moodle course structure|course structure in moodle|vle layout)\b/.test(t)
    ) {
      pushUnique("vle_structure");
    }
    if (!out.length) {
      if (/\b(page|content page|readable output)\b/.test(t)) pushUnique("page");
    }
    return out;
  }

  function extractLearningEnvironmentsFromBriefText(text) {
    var t = String(text || "").toLowerCase();
    if (!t) return [];
    var out = [];
    function pushUnique(v) {
      if (out.indexOf(v) === -1) out.push(v);
    }
    if (/\b(vle|moodle|course site|online course space|moodle course|vle structure|moodle structure|moodle course structure)\b/.test(t)) {
      pushUnique("vle");
    }
    if (/\b(xerte|interactive learning object|learning object set|digital learning object)\b/.test(t)) {
      pushUnique("xerte");
    }
    return out;
  }

  function mergeUniqueStringList(baseList, addList) {
    var out = Array.isArray(baseList) ? baseList.slice() : [];
    (Array.isArray(addList) ? addList : []).forEach(function (v) {
      var s = String(v || "").trim();
      if (!s) return;
      if (out.indexOf(s) === -1) out.push(s);
    });
    return out;
  }

  function interpretWorkflowBriefText(briefText) {
    var text = String(briefText || "");
    var out = {};
    var sessionMaterials = extractSessionMaterialsFromBriefText(text);
    if (sessionMaterials.length) out.session_materials = sessionMaterials;
    var environments = extractLearningEnvironmentsFromBriefText(text);
    if (environments.length) out.learning_environments = environments;
    return out;
  }

  function extractWorkflowBriefExplicitFactors(base) {
    var goal = String((base && base.goal) || "").trim();
    var designIntent = String((base && base.designIntent) || "").trim();
    var audience = String((base && base.audience) || "").trim();
    var scopeScale = String((base && base.scopeScale) || "").trim();
    var inputs = String((base && base.inputs) || "").trim();
    var desiredOutputs = String((base && base.desiredOutputs) || "").trim();
    var scope = String((base && base.scopeConstraints) || "").trim();
    var blob = [goal, designIntent, audience, scopeScale, inputs, desiredOutputs, scope].join("\n").toLowerCase();
    var interpreted = interpretWorkflowBriefText(
      [
        "What are you trying to design: " + designIntent,
        "Goal: " + goal,
        "Desired outputs: " + desiredOutputs,
        "Inputs: " + inputs,
        "Constraints: " + scope
      ].join("\n")
    );
    var out = {};
    var inputStrategy = String((base && base.startingArtefact) || "").trim();
    if (designIntent) out.design_intent = designIntent;
    if (audience) out.audience = audience;
    if (scopeScale) out.scope_scale = scopeScale;
    if (desiredOutputs) out.desired_outputs = desiredOutputs;
    if (inputStrategy) {
      out.input_strategy = inputStrategy;
    }
    if (inputs && !out.input_strategy) {
      out.input_strategy = "provided_source_content";
    }
    var domainExtraValues = base && base.domainExtraValues && typeof base.domainExtraValues === "object"
      ? base.domainExtraValues
      : {};
    Object.keys(domainExtraValues).forEach(function (k) {
      if (!k) return;
      var v = domainExtraValues[k];
      if (v == null) return;
      if (!Array.isArray(v) && String(v).trim() === "") return;
      out[k] = v;
    });
    if (Array.isArray(interpreted.session_materials) && interpreted.session_materials.length) {
      out.session_materials = interpreted.session_materials.slice();
    }
    if (Array.isArray(interpreted.learning_environments) && interpreted.learning_environments.length) {
      out.learning_environments = mergeUniqueStringList(out.learning_environments, interpreted.learning_environments);
    }

    var generalOnly = isGeneralOnlySelection(base && base.selectedDomains);
    if (generalOnly) {
      return out;
    }

    var durationMatch = blob.match(/(\d{1,3})\s*(?:minutes?|mins?|min)\b/i);
    if (durationMatch && durationMatch[1]) {
      var minutes = Number(durationMatch[1]);
      if (isFinite(minutes) && minutes > 0) out.duration_minutes = minutes;
    }

    if (/\b(beginner|intermediate|advanced|undergraduate|postgraduate)\b/.test(blob)) {
      var lv = blob.match(/\b(beginner|intermediate|advanced|undergraduate|postgraduate)\b/);
      if (lv && lv[1]) out.learner_level = lv[1];
    }

    if (/\b(async|asynchronous)\b/.test(blob)) out.delivery_mode = "async";
    else if (/\b(seminar)\b/.test(blob)) out.delivery_mode = "seminar";
    else if (/\b(workshop|live session|classroom|class)\b/.test(blob)) out.delivery_mode = "live_workshop";

    var mcqTypeCueRe = /\b(mcq|mcqs|multiple[ -]?choice(?:\s+questions?)?)\b/;
    if (/\b(quiz|assessment|test)\b/.test(blob) || mcqTypeCueRe.test(blob)) out.assessment_required = true;
    if (/\b(no assessment|without assessment)\b/.test(blob)) out.assessment_required = false;
    // Priority: assessment > facilitator > learner
    if (/\b(assessment page|assessment pack|quiz pack|quiz|mcq|mcqs|multiple choice|knowledge check|formative question|formative questions|assessment document|assessment booklet|tutor assessment|marking guidance)\b/.test(blob)) {
      out.page_profile = "assessment";
    } else if (/\b(facilitator guide|teaching guide|runbook|facilitator-facing|facilitator)\b/.test(blob)) {
      out.page_profile = "facilitator";
    } else if (/\b(learner page|student page|moodle page|vle page|participant handout|learner handout|learner pack|student-facing)\b/.test(blob)) {
      out.page_profile = "learner";
    }
    // Prefer explicit non-MCQ type mentions over generic quiz wording.
    if (/\bessay|essays\b/.test(blob)) out.assessment_type = "essay";
    else if (/\b(short answer|short-answer)\b/.test(blob)) out.assessment_type = "short_answer";
    else if (/\bcase study|case-study\b/.test(blob)) out.assessment_type = "case_study";
    else if (/\bproblem( solving)?\b/.test(blob)) out.assessment_type = "problem";
    else if (mcqTypeCueRe.test(blob)) out.assessment_type = "mcq";
    var explicitIncludeAnswersCueRe =
      /\b(model answers?|answer key|correct answers?|worked answers?)\b/;
    var explicitIncludeFeedbackCueRe =
      /\b(brief feedback|item[- ]level feedback|explanations?)\b/;
    var explicitHideAnswersCueRe =
      /\b(no answers?|without answers?|hide answers?|do not include answers?|answers?\s+(?:only\s+)?after submission|reveal answers?\s+after submission|post[- ]submission answers?)\b/;
    if (explicitHideAnswersCueRe.test(blob)) {
      out.include_answers = false;
      out.include_feedback_guidance = false;
      out.feedback_required = "none";
    } else {
      if (explicitIncludeAnswersCueRe.test(blob)) {
        out.include_answers = true;
      }
      if (explicitIncludeFeedbackCueRe.test(blob)) {
        out.include_feedback_guidance = true;
        out.feedback_required = "item_level";
      }
    }

    function parseCountToken(token) {
      var t = String(token || "").trim().toLowerCase();
      if (!t) return NaN;
      if (/^\d+$/.test(t)) return Number(t);
      var wordMap = {
        one: 1,
        two: 2,
        three: 3,
        four: 4,
        five: 5,
        six: 6,
        seven: 7,
        eight: 8,
        nine: 9,
        ten: 10,
        eleven: 11,
        twelve: 12,
        thirteen: 13,
        fourteen: 14,
        fifteen: 15,
        sixteen: 16,
        seventeen: 17,
        eighteen: 18,
        nineteen: 19,
        twenty: 20
      };
      return Object.prototype.hasOwnProperty.call(wordMap, t) ? wordMap[t] : NaN;
    }
    function firstAssessmentItemCountFromText(text) {
      var src = String(text || "").toLowerCase();
      if (!src) return NaN;
      var countToken = "(\\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty)";
      var patterns = [
        new RegExp("\\b(?:exactly\\s+|about\\s+|around\\s+|approximately\\s+)?"+ countToken + "\\s+(?:mcq(?:s)?|multiple[ -]?choice\\s+questions?|quiz\\s+questions?|formative\\s+questions?|assessment\\s+items?|questions?)\\b", "i"),
        new RegExp("\\b(?:create|generate|produce|write|build|make)\\s+(?:a\\s+page\\s+with\\s+)?(?:exactly\\s+)?"+ countToken + "\\s+(?:mcq(?:s)?|multiple[ -]?choice\\s+questions?|quiz\\s+questions?|questions?|assessment\\s+items?)\\b", "i")
      ];
      for (var i = 0; i < patterns.length; i += 1) {
        var match = src.match(patterns[i]);
        if (!match || !match[1]) continue;
        var n = parseCountToken(match[1]);
        if (isFinite(n) && n > 0) {
          return n;
        }
      }
      return NaN;
    }
    var inferredAssessmentItems = firstAssessmentItemCountFromText(blob);
    if (isFinite(inferredAssessmentItems) && inferredAssessmentItems > 0) {
      out.assessment_total_items = Math.max(1, Math.round(inferredAssessmentItems));
    }

    var goalLower = [goal, designIntent].join(" ").toLowerCase();
    var subjectMatch =
      goalLower.match(/\b(?:workshop|session|class|quiz|assessment|lesson|module)\s+(?:on|about)\s+([^.,;\n]+)/i) ||
      goalLower.match(/\bon\s+([^.,;\n]+)/i) ||
      goalLower.match(/\babout\s+([^.,;\n]+)/i);
    if (subjectMatch && subjectMatch[1]) {
      var subject = String(subjectMatch[1] || "").trim();
      if (subject) {
        out.topic = subject;
        out.workshop_subject = subject; // Backward-compatible alias for older domain configs.
      }
    }

    if (!Array.isArray(out.session_materials) || !out.session_materials.length) {
      var mats = extractSessionMaterialsFromBriefText(blob);
      if (mats.length) out.session_materials = mats;
    }

    if (/\b(summary|summarise)\b/.test(blob)) out.objective_type = "summary";
    if (/\b(analysis|analyze|analyse)\b/.test(blob)) out.objective_type = "analysis";
    if (/\b(briefing|briefing note|brief)\b/.test(blob)) out.objective_type = "briefing";
    if (/\b(research question|questions)\b/.test(blob)) out.objective_type = "questions";

    if (/\b(concise|short)\b/.test(blob)) out.output_depth = "concise";
    else if (/\b(detailed|deep)\b/.test(blob)) out.output_depth = "detailed";
    else if (/\b(standard|balanced)\b/.test(blob)) out.output_depth = "standard";

    if (!out.input_strategy && /\b(no source content|generate from topic|topic only|from topic)\b/.test(blob)) {
      out.input_strategy = "generate_from_topic";
    } else if (!out.input_strategy && /\b(transcript|article|notes|document|pdf|slides)\b/.test(blob)) {
      out.input_strategy = "provided_source_content";
    }

    return out;
  }

  function applyWorkflowBriefInferenceRules(config, goalText, inputText) {
    var cfg = normalizeWorkflowBriefConfig(config);
    var goal = String(goalText || "").toLowerCase();
    var inputs = String(inputText || "").toLowerCase();
    var inferred = {};
    (cfg.inferenceRules || []).forEach(function (rule) {
      if (!rule || typeof rule !== "object") return;
      var goalTerms = Array.isArray(rule.whenGoalMentionsAnyOf) ? rule.whenGoalMentionsAnyOf : [];
      var inputTerms = Array.isArray(rule.whenInputsMentionAnyOf) ? rule.whenInputsMentionAnyOf : [];
      var goalHit = !goalTerms.length || goalTerms.some(function (kw) {
        return goal.indexOf(String(kw || "").toLowerCase()) !== -1;
      });
      var inputHit = !inputTerms.length || inputTerms.some(function (kw) {
        return inputs.indexOf(String(kw || "").toLowerCase()) !== -1;
      });
      if (!(goalHit && inputHit)) return;
      var setObj = rule.set && typeof rule.set === "object" ? rule.set : {};
      Object.keys(setObj).forEach(function (k) {
        if (!k) return;
        var nextVal = setObj[k];
        if (Array.isArray(nextVal) && Array.isArray(inferred[k])) {
          inferred[k] = mergeUniqueStringList(inferred[k], nextVal);
          return;
        }
        inferred[k] = nextVal;
      });
    });
    return inferred;
  }

  function factorHasRelevancePredicates(factor) {
    if (!factor || typeof factor !== "object") return false;
    return (
      (Array.isArray(factor.askWhenGoalMentionsAnyOf) && factor.askWhenGoalMentionsAnyOf.length > 0) ||
      (Array.isArray(factor.askWhenInputsMentionAnyOf) && factor.askWhenInputsMentionAnyOf.length > 0) ||
      (Array.isArray(factor.askWhenDesignScopeIn) && factor.askWhenDesignScopeIn.length > 0) ||
      (factor.askWhenResolvedFactorEquals &&
        typeof factor.askWhenResolvedFactorEquals === "object" &&
        Object.keys(factor.askWhenResolvedFactorEquals).length > 0)
    );
  }

  function resolveWorkflowBriefFactors(config, explicitValues, elicitedValues, inferredValues, baseBrief) {
    var cfg = normalizeWorkflowBriefConfig(config);
    var explicit = explicitValues && typeof explicitValues === "object" ? explicitValues : {};
    var elicited = elicitedValues && typeof elicitedValues === "object" ? elicitedValues : {};
    var inferred = inferredValues && typeof inferredValues === "object" ? inferredValues : {};
    var base = baseBrief && typeof baseBrief === "object" ? baseBrief : {};
    var resolved = {};
    var sources = {};
    var missing = [];
    var allFactors = (cfg.requiredFactors || [])
      .concat(cfg.optionalFactors || [])
      .concat(cfg.refinementFactors || []);
    allFactors.forEach(function (factor) {
      if (!factor || !factor.id) return;
      var id = factor.id;
      var value;
      var source = "";
      if (Object.prototype.hasOwnProperty.call(explicit, id) && explicit[id] !== "") {
        value = explicit[id];
        source = "explicit";
      } else if (Object.prototype.hasOwnProperty.call(elicited, id) && elicited[id] !== "") {
        value = elicited[id];
        source = "elicited";
      } else {
        var hasRelevancePredicates = factorHasRelevancePredicates(factor);
        var isRelevant =
          !hasRelevancePredicates || isWorkflowRefinementFactorRelevant(factor, base, resolved);
        if (isRelevant && Object.prototype.hasOwnProperty.call(inferred, id) && inferred[id] !== "") {
          value = inferred[id];
          source = "inferred";
        } else if (isRelevant && Object.prototype.hasOwnProperty.call(factor, "default")) {
          value = factor.default;
          source = "default";
        } else {
          value = "";
          source = "";
        }
      }
      if (value !== "") {
        resolved[id] = value;
        sources[id] = source;
      }
      if (factor.required && (value === "" || value == null)) {
        missing.push(factor);
      }
    });
    // Preserve explicit visibility-control flags even if they are not declared
    // as formal domain refinement factors yet. This keeps explicit brief intent
    // (for example "with model answers and brief feedback") alive through
    // resolved -> mapped -> stepParamPatch flow.
    ["include_answers", "include_feedback_guidance"].forEach(function (id) {
      if (
        Object.prototype.hasOwnProperty.call(explicit, id) &&
        explicit[id] !== "" &&
        explicit[id] != null
      ) {
        resolved[id] = explicit[id];
        sources[id] = "explicit";
        return;
      }
      if (
        Object.prototype.hasOwnProperty.call(elicited, id) &&
        elicited[id] !== "" &&
        elicited[id] != null
      ) {
        resolved[id] = elicited[id];
        sources[id] = "elicited";
      }
    });
    return { resolved: resolved, sources: sources, missing: missing };
  }

  function isWorkflowRefinementFactorRelevant(factor, base, resolved) {
    if (!factor || !factor.id) return false;
    var b = base && typeof base === "object" ? base : {};
    var r = resolved && typeof resolved === "object" ? resolved : {};
    var goalBlob = String([
      b.designIntent || "",
      b.goal || "",
      b.desiredOutputs || ""
    ].join("\n")).toLowerCase();
    var inputBlob = String([
      b.inputs || "",
      b.scopeConstraints || "",
      b.audience || "",
      b.scopeScale || ""
    ].join("\n")).toLowerCase();

    var goalTerms = Array.isArray(factor.askWhenGoalMentionsAnyOf) ? factor.askWhenGoalMentionsAnyOf : [];
    if (goalTerms.length) {
      var goalHit = goalTerms.some(function (kw) {
        return goalBlob.indexOf(String(kw || "").toLowerCase()) !== -1;
      });
      if (!goalHit) return false;
    }

    var inputTerms = Array.isArray(factor.askWhenInputsMentionAnyOf) ? factor.askWhenInputsMentionAnyOf : [];
    if (inputTerms.length) {
      var inputHit = inputTerms.some(function (kw) {
        return inputBlob.indexOf(String(kw || "").toLowerCase()) !== -1;
      });
      if (!inputHit) return false;
    }

    var scopeList = Array.isArray(factor.askWhenDesignScopeIn) ? factor.askWhenDesignScopeIn : [];
    if (scopeList.length) {
      var scope = String(r.design_scope || "").toLowerCase();
      if (!scope || scopeList.map(function (v) { return String(v || "").toLowerCase(); }).indexOf(scope) === -1) {
        return false;
      }
    }

    var requiredFlags = factor.askWhenResolvedFactorEquals && typeof factor.askWhenResolvedFactorEquals === "object"
      ? factor.askWhenResolvedFactorEquals
      : {};
    var flagKeys = Object.keys(requiredFlags);
    for (var i = 0; i < flagKeys.length; i += 1) {
      var k = flagKeys[i];
      if (!k) continue;
      if (String(r[k]) !== String(requiredFlags[k])) return false;
    }
    return true;
  }

  function getWorkflowRefinementQueue(config, base, resolved, elicitedValues, resolvedSources, options) {
    var cfg = normalizeWorkflowBriefConfig(config);
    var b = base && typeof base === "object" ? base : {};
    var r = resolved && typeof resolved === "object" ? resolved : {};
    var elicited = elicitedValues && typeof elicitedValues === "object" ? elicitedValues : {};
    var sourceMap = resolvedSources && typeof resolvedSources === "object" ? resolvedSources : {};
    var opts = options && typeof options === "object" ? options : {};
    var includePresetValues = !!opts.includePresetValues;
    var includePromptLevelQuestions = !!opts.includePromptLevelQuestions;
    var qp = cfg.questionPolicy || {};
    var askRefinement = !!qp.askRefinementByDefault;
    if (!askRefinement) return [];
    var PROMPT_LEVEL_ASSESSMENT_FACTOR_IDS = {
      coverage_scope: true,
      cognitive_demand: true,
      question_style_mix: true,
      assessment_type: true,
      feedback_required: true,
      difficulty_profile: true,
      assessment_total_items: true
    };
    function shouldSuppressPromptLevelFactor(factor) {
      if (includePromptLevelQuestions) return false;
      var id = String((factor && factor.id) || "").trim();
      if (!id) return false;
      return !!PROMPT_LEVEL_ASSESSMENT_FACTOR_IDS[id];
    }
    function hasResolvedValueForFactor(id) {
      if (!id) return false;
      return (
        Object.prototype.hasOwnProperty.call(r, id) &&
        r[id] !== "" &&
        r[id] != null
      );
    }
    function isGenericContextResolvedCategory(factor) {
      var blob = String(
        [
          factor && factor.id,
          factor && factor.label,
          factor && factor.question,
          factor && factor.plainEnglish,
          factor && factor.gloss
        ]
          .join(" ")
          .toLowerCase()
      );
      if (!blob.trim()) return false;
      var asksLengthDetail =
        /\b(length|detail|granularity|depth|duration|time)\b/.test(blob);
      var asksStructureFormat =
        /\b(structure|sections?|format|formatting|layout|agenda|sequence)\b/.test(blob);
      var asksAudienceLevel =
        /\b(audience|learner|level|reading level)\b/.test(blob);

      var hasAudienceContext =
        !!String((b && b.audience) || "") ||
        !!String((r && r.audience) || "") ||
        !!String((r && r.learner_level) || "");
      var hasLengthDetailContext =
        !!String((b && b.scopeScale) || "") ||
        !!String((r && r.duration_minutes) || "") ||
        !!String((r && r.scope_scale) || "") ||
        !!String((r && r.design_scope) || "");
      var hasStructureFormatContext =
        !!String((r && r.design_scope) || "") ||
        !!String((r && r.delivery_mode) || "") ||
        (Array.isArray(r && r.learning_environments) && r.learning_environments.length > 0) ||
        !!String((r && r.sequencing_granularity) || "");

      return (
        (asksLengthDetail && hasLengthDetailContext) ||
        (asksStructureFormat && hasStructureFormatContext) ||
        (asksAudienceLevel && hasAudienceContext)
      );
    }
    var list = [];
    (cfg.refinementFactors || []).forEach(function (factor) {
      if (!factor || !factor.id) return;
      if (shouldSuppressPromptLevelFactor(factor)) return;
      var id = String(factor.id || "");
      if (!id) return;
      if (Object.prototype.hasOwnProperty.call(elicited, id) && elicited[id] !== "") return;
      var src = String(sourceMap[id] || "");
      var skipIfContextResolved = factor.skipIfContextResolved === true;
      if (
        hasResolvedValueForFactor(id) &&
        (src === "inferred" || src === "default") &&
        (skipIfContextResolved || isGenericContextResolvedCategory(factor))
      ) {
        return;
      }
      var mustAsk = !!factor.mustAsk;
      if (includePresetValues) {
        // Deep refinement: ask unless user already gave explicit/elicited value.
        if (src === "explicit" || src === "elicited") return;
      } else {
        // Phase-2 behavior: ask only unresolved factors, plus must-ask factors.
        // Must-ask factors are still asked when they are only inferred/default.
        if (mustAsk) {
          if (src === "explicit" || src === "elicited") return;
        } else {
          if (src === "explicit" || src === "elicited" || src === "inferred" || src === "default") return;
        }
      }
      if (!isWorkflowRefinementFactorRelevant(factor, b, r)) return;
      list.push(factor);
    });
    var maxN = Number(qp.maxRefinementQuestions || 0);
    if (isFinite(maxN) && maxN > 0 && list.length > maxN) {
      return list.slice(0, maxN);
    }
    return list;
  }

  function parseWorkflowBriefAnswerByType(rawAnswer, factor) {
    var text = String(rawAnswer || "").trim();
    var f = factor && typeof factor === "object" ? factor : {};
    var fid = String(f.id || "").trim();
    var parseHints = getActiveRefinementParseHints(fid);
    var t = String(f.type || "text").toLowerCase();
    if (!text) return "";
    if (t === "number") {
      var shouldExtractNumber = !parseHints || parseHints.numberExtraction !== false;
      var lowerText = text.toLowerCase();
      var n = Number(text);
      if (!isFinite(n) && shouldExtractNumber) {
        var hourWord = lowerText.match(/\b(one|two|three|four|five|six|seven|eight|nine|ten)\s+hour/);
        var hourMap = {
          one: 1,
          two: 2,
          three: 3,
          four: 4,
          five: 5,
          six: 6,
          seven: 7,
          eight: 8,
          nine: 9,
          ten: 10
        };
        if (hourWord && hourWord[1] && hourMap[hourWord[1]]) {
          n = hourMap[hourWord[1]] * 60;
        } else {
          var hMatch = lowerText.match(/(\d+(?:\.\d+)?)\s*(hours?|hrs?|h)\b/);
          if (hMatch && hMatch[1]) {
            n = Number(hMatch[1]) * 60;
          } else {
            var mMatch = lowerText.match(/(\d+(?:\.\d+)?)\s*(minutes?|mins?|min|m)\b/);
            if (mMatch && mMatch[1]) {
              n = Number(mMatch[1]);
            } else {
              var firstNum = lowerText.match(/(\d+(?:\.\d+)?)/);
              if (firstNum && firstNum[1]) {
                n = Number(firstNum[1]);
              }
            }
          }
        }
      }
      if (!isFinite(n)) return "";
      n = Math.round(n);
      if (isFinite(Number(f.min)) && n < Number(f.min)) n = Number(f.min);
      if (isFinite(Number(f.max)) && n > Number(f.max)) n = Number(f.max);
      return n;
    }
    if (t === "boolean") {
      var lower = text.toLowerCase();
      if (["yes", "y", "true", "1"].indexOf(lower) !== -1) return true;
      if (["no", "n", "false", "0"].indexOf(lower) !== -1) return false;
      return "";
    }
    if (t === "multi_select") {
      return text
        .split(/[,\n]/)
        .map(function (x) { return String(x || "").trim(); })
        .filter(function (x) { return !!x; });
    }
    if (t === "select") {
      var choices = Array.isArray(f.choices) ? f.choices : [];
      if (!choices.length) return text;
      var normalized = text.toLowerCase().replace(/[\s-]+/g, "_").trim();
      if (parseHints && parseHints.booleanAliases && typeof parseHints.booleanAliases === "object") {
        var bAliases = parseHints.booleanAliases;
        if (Object.prototype.hasOwnProperty.call(bAliases, normalized)) {
          return bAliases[normalized];
        }
      }
      if (parseHints && parseHints.aliases && typeof parseHints.aliases === "object") {
        var aliases = parseHints.aliases;
        var aliasKeys = Object.keys(aliases);
        for (var ai = 0; ai < aliasKeys.length; ai += 1) {
          var aliasKey = String(aliasKeys[ai] || "");
          if (!aliasKey) continue;
          var aliasNorm = aliasKey.toLowerCase().replace(/[\s-]+/g, "_").trim();
          if (aliasNorm === normalized) {
            return aliases[aliasKeys[ai]];
          }
        }
      }
      if (fid === "feedback_required") {
        if (["yes", "y", "true", "1"].indexOf(normalized) !== -1) return "item_level";
        if (["no", "n", "false", "0"].indexOf(normalized) !== -1) return "none";
      }
      function scoreChoice(choice) {
        var value = "";
        var label = "";
        if (choice && typeof choice === "object") {
          value = choice.value == null ? "" : String(choice.value);
          label = choice.label == null ? "" : String(choice.label);
        } else {
          value = String(choice || "");
        }
        var candidates = [value, label].filter(function (x) { return !!x; });
        var answerTokens = normalized.split(/[^a-z0-9]+/).filter(Boolean);
        var best = 0;
        candidates.forEach(function (cand) {
          var candNorm = String(cand || "").toLowerCase().replace(/[\s-]+/g, "_").trim();
          if (!candNorm) return;
          if (candNorm === normalized) {
            best = Math.max(best, 1);
            return;
          }
          var candTokens = candNorm.split(/[^a-z0-9]+/).filter(Boolean);
          if (!candTokens.length || !answerTokens.length) return;
          var overlap = answerTokens.filter(function (tok) {
            return candTokens.indexOf(tok) !== -1;
          }).length;
          var score = overlap / Math.max(1, Math.min(answerTokens.length, candTokens.length));
          if (score > best) best = score;
        });
        return best;
      }
      var exact = choices.find(function (choice) {
        var value = "";
        var label = "";
        if (choice && typeof choice === "object") {
          value = choice.value == null ? "" : String(choice.value);
          label = choice.label == null ? "" : String(choice.label);
        } else {
          value = String(choice || "");
        }
        var candidates = [value, label].filter(function (x) { return !!x; });
        return candidates.some(function (cand) {
          var lower = cand.toLowerCase();
          return lower === text.toLowerCase() || lower.replace(/[\s-]+/g, "_") === normalized;
        });
      });
      if (exact) {
        if (exact && typeof exact === "object") {
          return exact.value != null ? String(exact.value) : text;
        }
        return exact;
      }
      // Natural-language fallback for select inputs.
      var bestChoice = null;
      var bestScore = 0;
      choices.forEach(function (choice) {
        var s = scoreChoice(choice);
        if (s > bestScore) {
          bestScore = s;
          bestChoice = choice;
        }
      });
      if (bestChoice && bestScore >= 0.5) {
        if (bestChoice && typeof bestChoice === "object") {
          return bestChoice.value != null ? String(bestChoice.value) : "";
        }
        return String(bestChoice || "");
      }
      // For selects, keep questioning until we have a valid option.
      return "";
    }
    return text;
  }

  function applyWorkflowBriefMappings(config, resolvedFactors) {
    var cfg = normalizeWorkflowBriefConfig(config);
    var values = resolvedFactors && typeof resolvedFactors === "object" ? resolvedFactors : {};
    var out = {
      workflowOutputSpecPatch: {},
      workflowConstraintPatch: {},
      stepParamPatch: {},
      mapped: [],
      warnings: []
    };
    function warn(msg) {
      out.warnings.push(msg);
      try { console.warn("[PRISM brief mapping]", msg); } catch (_e) {}
    }
    function parseBooleanLike(value) {
      var v = String(value == null ? "" : value).toLowerCase().trim();
      if (!v) return null;
      if (["true", "1", "yes", "y"].indexOf(v) !== -1) return true;
      if (["false", "0", "no", "n"].indexOf(v) !== -1) return false;
      return null;
    }
    function normalizeMappedFactorValue(factor, value) {
      // Preserve explicit MCQ intent against optional response-mix drift:
      // if assessment_type is MCQ, constrain question_style_mix to MCQ-compatible mode.
      if (
        String(factor || "") === "question_style_mix" &&
        String(values.assessment_type || "").toLowerCase().trim() === "mcq"
      ) {
        var qsm = String(value == null ? "" : value).toLowerCase().trim();
        if (
          qsm === "mixed_response_modes" ||
          qsm === "constructed_response_only" ||
          qsm === "integrative_performance_oriented"
        ) {
          return "selected_response_only";
        }
      }
      return value;
    }
    (cfg.mappingRules || []).forEach(function (rule) {
      if (!rule || !rule.factor) return;
      var factor = String(rule.factor || "").trim();
      if (!factor) return;
      if (!Object.prototype.hasOwnProperty.call(values, factor)) return;
      var value = normalizeMappedFactorValue(factor, values[factor]);
      var targets = Array.isArray(rule.mapsTo) ? rule.mapsTo : [];
      targets.forEach(function (target) {
        var t = String(target || "").trim();
        if (!t) return;
        if (t.indexOf("workflow.workflowOutputSpec.") === 0) {
          var sub = t.slice("workflow.workflowOutputSpec.".length);
          if (sub.indexOf("constraints.") === 0) {
            var ck = sub.slice("constraints.".length);
            if (!ck) {
              warn("Skipped unknown mapsTo target: " + t);
              return;
            }
            out.workflowConstraintPatch[ck] = value;
            out.mapped.push({ factor: factor, target: t, value: value });
            return;
          }
          if (sub === "audience" || sub === "goal" || sub === "constraints") {
            out.workflowOutputSpecPatch[sub] = value;
            out.mapped.push({ factor: factor, target: t, value: value });
            return;
          }
          warn("Skipped unknown mapsTo target: " + t);
          return;
        }
        if (t.indexOf("stepParams.") === 0) {
          var bits = t.split(".");
          if (bits.length < 3) {
            warn("Skipped unknown mapsTo target: " + t);
            return;
          }
          var stepId = normalizeCanonicalStepId(bits[1]);
          var paramKey = bits.slice(2).join(".");
          if (!stepId || !paramKey) {
            warn("Skipped unknown mapsTo target: " + t);
            return;
          }
          if (!out.stepParamPatch[stepId]) out.stepParamPatch[stepId] = {};
          out.stepParamPatch[stepId][paramKey] = value;
          out.mapped.push({ factor: factor, target: t, value: value });
          return;
        }
        warn("Skipped unknown mapsTo target: " + t);
      });
    });
    var feedbackMode = String(values.feedback_required || "").toLowerCase().trim();
    var assessmentType = String(values.assessment_type || "").toLowerCase().trim();
    var explicitIncludeAnswers = parseBooleanLike(values.include_answers);
    var explicitIncludeFeedback = parseBooleanLike(values.include_feedback_guidance);
    var needsItemLevelFeedback =
      feedbackMode === "item_level" || feedbackMode === "hybrid" || feedbackMode === "summary_only";
    if (
      needsItemLevelFeedback ||
      assessmentType === "mcq" ||
      explicitIncludeAnswers !== null ||
      explicitIncludeFeedback !== null
    ) {
      var designPageId = normalizeCanonicalStepId("step_design_page");
      if (!out.stepParamPatch[designPageId]) out.stepParamPatch[designPageId] = {};
      // Ensure assessment pages can surface answer keys/model answers when requested.
      if (explicitIncludeAnswers === true) {
        out.stepParamPatch[designPageId].include_answers = "true";
      } else if (explicitIncludeAnswers === false) {
        out.stepParamPatch[designPageId].include_answers = "false";
      } else if (needsItemLevelFeedback || assessmentType === "mcq") {
        out.stepParamPatch[designPageId].include_answers = "true";
      }
      if (explicitIncludeFeedback === true) {
        out.stepParamPatch[designPageId].include_feedback_guidance = "true";
      } else if (explicitIncludeFeedback === false) {
        out.stepParamPatch[designPageId].include_feedback_guidance = "false";
      } else if (needsItemLevelFeedback) {
        out.stepParamPatch[designPageId].include_feedback_guidance = "true";
      }
    }
    if (assessmentType === "mcq") {
      var genItemsId = normalizeCanonicalStepId("step_generate_assessment_items");
      if (!out.stepParamPatch[genItemsId]) out.stepParamPatch[genItemsId] = {};
      // Explicit MCQ means single-best-answer MCQ only (no format mixing).
      out.stepParamPatch[genItemsId].response_formats = "single_answer_mcq";
      out.stepParamPatch[genItemsId].composition_mode = "single_format";
    }
    return out;
  }

  function renderWorkflowBriefResolvedPanel(resolvedState) {
    if (!els.wfBriefResolvedDetails || !els.wfBriefResolvedSummary || !els.wfBriefResolvedContent) return;
    if (!resolvedState || typeof resolvedState !== "object") {
      els.wfBriefResolvedDetails.classList.add("hidden");
      els.wfBriefResolvedContent.textContent = "";
      return;
    }
    els.wfBriefResolvedDetails.classList.remove("hidden");
    var missingCount = Array.isArray(resolvedState.missing) ? resolvedState.missing.length : 0;
    els.wfBriefResolvedSummary.textContent =
      "Resolved workflow brief (" + (missingCount ? "missing: " + missingCount : "complete") + ")";
    var askedCount = Array.isArray(resolvedState.askedFactors) ? resolvedState.askedFactors.length : 0;
    var inferredCount = Object.keys(resolvedState.inferredFactors || {}).length;
    var confirmedCount = Object.keys(resolvedState.confirmedInferredFactors || {}).length;
    var resolvedCount = Object.keys(resolvedState.resolvedFactors || {}).length;
    var sourceCounts = { explicit: 0, elicited: 0, inferred: 0, default: 0 };
    Object.keys(resolvedState.resolvedSources || {}).forEach(function (id) {
      var src = String((resolvedState.resolvedSources || {})[id] || "");
      if (sourceCounts[src] != null) sourceCounts[src] += 1;
    });
    var mappedCount = Array.isArray(resolvedState.mappedBindings && resolvedState.mappedBindings.mapped)
      ? resolvedState.mappedBindings.mapped.length
      : 0;
    var warningCount = Array.isArray(resolvedState.warnings) ? resolvedState.warnings.length : 0;
    var lines = [];
    lines.push("Asked factors: " + askedCount);
    lines.push("Inferred factors: " + inferredCount + (confirmedCount ? " (" + confirmedCount + " confirmed)" : ""));
    lines.push(
      "Resolved factors: " +
        resolvedCount +
        " (explicit " + sourceCounts.explicit +
        ", elicited " + sourceCounts.elicited +
        ", inferred " + sourceCounts.inferred +
        ", default " + sourceCounts.default + ")"
    );
    lines.push("Mapped bindings: " + mappedCount);
    if (warningCount) lines.push("Warnings: " + warningCount);
    if (missingCount) {
      lines.push("Still needed: " + (resolvedState.missing || []).join(", "));
    } else {
      lines.push("Ready: all required factors resolved.");
    }
    function stableValueText(v) {
      if (Array.isArray(v)) return JSON.stringify(v);
      if (v && typeof v === "object") return JSON.stringify(v);
      if (typeof v === "string") return v;
      return String(v);
    }
    function pushSourceBlock(title, pairs) {
      if (!pairs.length) return;
      lines.push("");
      lines.push(title + ":");
      pairs
        .sort(function (a, b) { return a.id.localeCompare(b.id); })
        .forEach(function (row) {
          lines.push("- " + row.id + ": " + stableValueText(row.value));
        });
    }
    var resolvedFactors = resolvedState.resolvedFactors && typeof resolvedState.resolvedFactors === "object"
      ? resolvedState.resolvedFactors
      : {};
    var resolvedSources = resolvedState.resolvedSources && typeof resolvedState.resolvedSources === "object"
      ? resolvedState.resolvedSources
      : {};
    var explicitPairs = [];
    var inferredPairs = [];
    var defaultPairs = [];
    var elicitedPairs = [];
    Object.keys(resolvedFactors).forEach(function (id) {
      var src = String(resolvedSources[id] || "").trim();
      var row = { id: id, value: resolvedFactors[id] };
      if (src === "explicit") explicitPairs.push(row);
      else if (src === "inferred") inferredPairs.push(row);
      else if (src === "default") defaultPairs.push(row);
      else if (src === "elicited") elicitedPairs.push(row);
    });
    // Compact trust-oriented rendering:
    // 1) User-provided values first (explicit + elicited)
    // 2) Inferred assumptions second
    // 3) Defaulted values collapsed to reduce low-value noise
    var userProvidedPairs = explicitPairs.concat(elicitedPairs);
    userProvidedPairs.sort(function (a, b) {
      return a.id.localeCompare(b.id);
    });
    pushSourceBlock("User-provided values", userProvidedPairs);
    pushSourceBlock("Inferred assumptions", inferredPairs);
    els.wfBriefResolvedContent.innerHTML = "";
    var primary = document.createElement("div");
    primary.textContent = lines.join("\n");
    els.wfBriefResolvedContent.appendChild(primary);

    if (defaultPairs.length) {
      var wrap = document.createElement("div");
      wrap.className = "muted";
      wrap.style.marginTop = "8px";

      var toggleBtn = document.createElement("button");
      toggleBtn.type = "button";
      toggleBtn.className = "btn small";
      toggleBtn.textContent = state.workflowBriefShowDefaults
        ? "Hide defaults \u25be"
        : "Defaulted values hidden (" + defaultPairs.length + ") \u25b8";

      var defaultsList = document.createElement("div");
      defaultsList.className = "muted";
      defaultsList.style.marginTop = "6px";
      defaultsList.style.display = state.workflowBriefShowDefaults ? "block" : "none";
      if (state.workflowBriefShowDefaults) {
        var listLines = [];
        defaultPairs
          .slice()
          .sort(function (a, b) { return a.id.localeCompare(b.id); })
          .forEach(function (row) {
            listLines.push("- " + row.id + ": " + stableValueText(row.value));
          });
        defaultsList.textContent = listLines.join("\n");
      }

      toggleBtn.addEventListener("click", function () {
        state.workflowBriefShowDefaults = !state.workflowBriefShowDefaults;
        renderWorkflowBriefResolvedPanel(resolvedState);
      });

      wrap.appendChild(toggleBtn);
      wrap.appendChild(defaultsList);
      els.wfBriefResolvedContent.appendChild(wrap);
    }
  }

  function buildWorkflowBriefQuestionText(factor) {
    if (!factor || !factor.id) return "Please provide the missing value.";
    var fid = String(factor.id || "").trim();
    var profileOverride = getActiveRefinementQuestionOverride(fid);
    if (profileOverride) return profileOverride;
    var assessmentOverrides = {
      assessment_type:
        "What assessment type should this use?\nChoose one: MCQ, short answer, essay, case study, problem-based, or mixed.\nIf you're unsure, say 'recommend'.",
      assessment_total_items:
        "How many assessment items should be generated?\nFor example: 8, 10, or 20.",
      difficulty_profile:
        "What difficulty level should the items target?\nChoose one: introductory, balanced, or challenging.",
      coverage_scope:
        "What should the questions cover?\nChoose one: broad coverage, selected themes, or key concepts only.",
      feedback_required:
        "Should the pack include feedback or model answers?\nAnswer yes or no.",
      question_style_mix:
        "Should the question style be consistent or varied?\nChoose one: consistent, varied, or mixed.",
      cognitive_demand:
        "What cognitive level should the questions target?\nChoose one: recall, application, analysis, or mixed."
    };
    if (assessmentOverrides[fid]) return assessmentOverrides[fid];
    var choices = Array.isArray(factor.choices) ? factor.choices : [];
    var q = String(factor.question || factor.label || factor.id || "Provide value").trim();
    var gloss = String(factor.plainEnglish || factor.gloss || "").trim();
    if (gloss) {
      q += " In plain English: " + gloss;
    }
    if (choices.length) {
      var choiceLabels = choices.map(function (choice) {
        if (choice && typeof choice === "object") {
          var label = choice.label != null ? String(choice.label) : "";
          var value = choice.value != null ? String(choice.value) : "";
          return value || label;
        }
        return String(choice || "");
      }).filter(function (c) { return !!c; });
      var choiceDetails = choices.map(function (choice) {
        if (!choice || typeof choice !== "object") return "";
        var value = choice.value != null ? String(choice.value).trim() : "";
        var label = choice.label != null ? String(choice.label).trim() : "";
        var desc = String(
          choice.description ||
          choice.plainEnglish ||
          choice.explanation ||
          choice.helpText ||
          choice.gloss ||
          ""
        ).trim();
        if (!value && !label) return "";
        var key = value || label;
        var title = label && label.toLowerCase() !== key.toLowerCase()
          ? " (" + label + ")"
          : "";
        return "- " + key + title + (desc ? ": " + desc : "");
      }).filter(function (line) { return !!line; });
      if (choiceLabels.length) {
        q += "\nYou can answer with: " + choiceLabels.join(" | ");
        if (choiceDetails.length) {
          q += "\nOption meanings:";
          q += "\n" + choiceDetails.join("\n");
        }
        q += "\nIf you're unsure, reply 'recommend' and I'll suggest a good default.";
      }
    }
    return q;
  }

  function buildWorkflowBriefOptionHelpText(factor, options) {
    var f = factor && typeof factor === "object" ? factor : {};
    var opts = options && typeof options === "object" ? options : {};
    var choices = Array.isArray(f.choices) ? f.choices : [];
    if (!choices.length) return "";
    var lines = [];
    var question = String(f.question || f.label || f.id || "").trim();
    if (question) lines.push(question);
    lines.push("You can choose:");
    choices.forEach(function (choice) {
      var value = "";
      var label = "";
      var desc = "";
      if (choice && typeof choice === "object") {
        value = choice.value != null ? String(choice.value).trim() : "";
        label = choice.label != null ? String(choice.label).trim() : "";
        desc = String(
          choice.description ||
          choice.plainEnglish ||
          choice.explanation ||
          choice.helpText ||
          choice.gloss ||
          ""
        ).trim();
      } else {
        value = String(choice || "").trim();
      }
      if (!value && !label) return;
      var key = value || label;
      var tail = label && label.toLowerCase() !== key.toLowerCase() ? " (" + label + ")" : "";
      lines.push("- " + key + tail + (desc ? ": " + desc : ""));
    });
    var recommended = String(
      opts.recommendedValue != null
        ? opts.recommendedValue
        : (Object.prototype.hasOwnProperty.call(f, "default") ? f.default : "")
    ).trim();
    if (recommended) {
      lines.push("");
      lines.push("Recommendation: use '" + recommended + "' for this workflow.");
      lines.push("Reply 'yes' to use this recommendation, or reply with another option value.");
    } else {
      lines.push("");
      lines.push("Reply with one of the option values above.");
    }
    return lines.join("\n");
  }

  function isWorkflowOptionHelpIntent(rawText) {
    var text = String(rawText || "").toLowerCase().trim();
    if (!text) return false;
    if (text === "help" || text === "?") return true;
    if (/\b(what can i choose|what are my options|what are the options|what do you mean|which options|show options)\b/.test(text)) {
      return true;
    }
    return false;
  }

  function isRecommendIntent(rawText) {
    var text = String(rawText || "").toLowerCase().trim();
    if (!text) return false;
    var compact = text.replace(/[^a-z]/g, "");
    if (!compact) return false;
    if (/^(suggest|default|bestguess|youdecide)$/.test(compact)) return true;
    // Typo-tolerant handling for "recommend" variants:
    // recommend, recomend, reccommend, recomnd, etc.
    if (/^re+c+o*m+e*n+d*$/.test(compact)) return true;
    if (compact.indexOf("recommend") !== -1 || compact.indexOf("recomend") !== -1) return true;
    return false;
  }

  function getWorkflowElicitationRemainingFactors(elicit) {
    var e = elicit && typeof elicit === "object" ? elicit : {};
    var queue = Array.isArray(e.queue) ? e.queue : [];
    var idx = Number(e.index || 0);
    if (idx < 0) idx = 0;
    if (idx >= queue.length) return [];
    return queue.slice(idx).filter(function (f) {
      return !!(f && f.id);
    });
  }

  function getWorkflowBriefFactorById(config, id) {
    var cfg = normalizeWorkflowBriefConfig(config);
    var target = String(id || "");
    var all = (cfg.requiredFactors || [])
      .concat(cfg.optionalFactors || [])
      .concat(cfg.refinementFactors || []);
    for (var i = 0; i < all.length; i += 1) {
      var f = all[i];
      if (!f || !f.id) continue;
      if (String(f.id) === target) return f;
    }
    return null;
  }

  function getWorkflowBriefAllFactors(config) {
    var cfg = normalizeWorkflowBriefConfig(config);
    return (cfg.requiredFactors || [])
      .concat(cfg.optionalFactors || [])
      .concat(cfg.refinementFactors || []);
  }

  function isWorkflowFactorExplicitlyMentionedInText(factor, rawText) {
    var f = factor && typeof factor === "object" ? factor : {};
    var text = String(rawText || "").toLowerCase();
    if (!text) return false;
    var id = String(f.id || "").toLowerCase();
    var label = String(f.label || "").toLowerCase();
    var q = String(f.question || "").toLowerCase();
    var keys = [];
    if (id) keys.push(id.replace(/_/g, " "));
    if (label) keys.push(label);
    if (q) {
      // Take a compact hint phrase from the start of question text.
      keys.push(q.split("?")[0].trim());
    }
    var compact = keys
      .map(function (k) { return String(k || "").trim(); })
      .filter(function (k) { return k.length >= 4; });
    return compact.some(function (k) {
      return text.indexOf(k) !== -1;
    });
  }

  function tryParseWorkflowBriefExtractionJson(text) {
    var parsed = tryParseWorkflowDesignJson(text);
    if (!parsed || typeof parsed !== "object") return null;
    if (Array.isArray(parsed.captures)) return parsed;
    if (parsed.values && typeof parsed.values === "object") {
      return {
        captures: Object.keys(parsed.values).map(function (k) {
          return { id: k, value: parsed.values[k], confidence: 0.75 };
        })
      };
    }
    return null;
  }

  function callOpenAIForWorkflowBriefExtraction(rawAnswer, elicit, remainingFactors) {
    var apiKey = state.apiKey;
    if (!apiKey) return Promise.resolve({});
    var text = String(rawAnswer || "").trim();
    if (!text) return Promise.resolve({});
    var e = elicit && typeof elicit === "object" ? elicit : {};
    var factors = Array.isArray(remainingFactors) ? remainingFactors : [];
    if (!factors.length) return Promise.resolve({});

    var model = getSelectedModelId();
    var normalizedFactors = factors.map(function (factor) {
      var f = factor && typeof factor === "object" ? factor : {};
      var choices = Array.isArray(f.choices) ? f.choices : [];
      var mappedChoices = choices.map(function (choice) {
        if (choice && typeof choice === "object") {
          return {
            value: choice.value != null ? String(choice.value) : "",
            label: choice.label != null ? String(choice.label) : ""
          };
        }
        return { value: String(choice || ""), label: "" };
      });
      return {
        id: String(f.id || ""),
        type: String(f.type || "text"),
        question: String(f.question || f.label || f.id || ""),
        plainEnglish: String(f.plainEnglish || f.gloss || ""),
        required: !!f.required,
        choices: mappedChoices
      };
    }).filter(function (f) { return !!f.id; });
    if (!normalizedFactors.length) return Promise.resolve({});

    var contextState = resolveWorkflowBriefFactors(
      e.config,
      e.explicitValues || {},
      e.elicitedValues || {},
      e.inferredValues || {},
      e.base || {}
    );

    var instruction =
      "You extract workflow brief factor values from one user message.\n" +
      "Return JSON only with this shape:\n" +
      "{\n" +
      '  "captures": [\n' +
      '    { "id": "factor_id", "value": "raw captured value", "confidence": 0.0 }\n' +
      "  ]\n" +
      "}\n" +
      "Rules:\n" +
      "- Capture multiple factors if the message answers them.\n" +
      "- For factor 'topic', capture only the core subject.\n" +
      "- For 'topic', do NOT include learner level/audience, quantities, exclusions, delivery constraints, or assessment/activity qualifiers.\n" +
      "- Do not invent values not present in user message.\n" +
      "- For select factors, prefer one of allowed choice values/labels when clear.\n" +
      "- If unsure, omit the factor (do not guess).\n" +
      "- Confidence must be 0..1.\n" +
      "- Return only JSON.";

    var userPayload = {
      user_message: text,
      unresolved_factors: normalizedFactors,
      currently_resolved_factors: contextState && contextState.resolved ? contextState.resolved : {}
    };

    return fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey
      },
      body: JSON.stringify({
        model: model,
        input: [
          { role: "system", content: instruction },
          { role: "user", content: JSON.stringify(userPayload) }
        ],
        max_output_tokens: 500,
        temperature: 0
      })
    })
      .then(function (res) {
        if (!res.ok) return {};
        return res.json().catch(function () { return {}; });
      })
      .then(function (data) {
        if (data && data.usage) {
          var extractionUsage = {
            prompt_tokens: data.usage.input_tokens,
            completion_tokens: data.usage.output_tokens,
            total_tokens: data.usage.total_tokens
          };
          updateTokenUsage(extractionUsage, model);
        }
        if (
          !data ||
          !Array.isArray(data.output) ||
          !data.output[0] ||
          !data.output[0].content ||
          !data.output[0].content[0] ||
          typeof data.output[0].content[0].text !== "string"
        ) {
          return {};
        }
        var parsed = tryParseWorkflowBriefExtractionJson(
          String(data.output[0].content[0].text || "")
        );
        if (!parsed || !Array.isArray(parsed.captures)) return {};
        var out = {};
        parsed.captures.forEach(function (row) {
          if (!row || !row.id) return;
          var id = String(row.id || "").trim();
          if (!id) return;
          var confidence = Number(row.confidence);
          if (!isFinite(confidence)) confidence = 0.75;
          if (confidence < 0.35) return;
          out[id] = {
            value: row.value,
            confidence: confidence
          };
        });
        return out;
      })
      .catch(function () {
        return {};
      });
  }

  function callOpenAIForWorkflowIntentInterpretation(base, config, domainId) {
    var apiKey = state.apiKey;
    if (!apiKey) return Promise.resolve({ factors: {}, intent: {}, confidence: 0 });
    var cfg = normalizeWorkflowBriefConfig(config);
    var allFactors = getWorkflowBriefAllFactors(cfg);
    if (!allFactors.length) return Promise.resolve({ factors: {}, intent: {}, confidence: 0 });
    var model = getSelectedModelId();
    var b = base && typeof base === "object" ? base : {};
    var normalizedFactors = allFactors.map(function (factor) {
      var f = factor && typeof factor === "object" ? factor : {};
      var choices = Array.isArray(f.choices) ? f.choices : [];
      return {
        id: String(f.id || ""),
        type: String(f.type || "text"),
        label: String(f.label || f.id || ""),
        question: String(f.question || ""),
        required: !!f.required,
        choices: choices.map(function (choice) {
          if (choice && typeof choice === "object") {
            return {
              value: choice.value != null ? String(choice.value) : "",
              label: choice.label != null ? String(choice.label) : ""
            };
          }
          return { value: String(choice || ""), label: "" };
        })
      };
    }).filter(function (f) { return !!f.id; });
    if (!normalizedFactors.length) return Promise.resolve({ factors: {}, intent: {}, confidence: 0 });

    var instruction =
      "You are an intent interpreter for workflow design.\n" +
      "Infer likely factor values from a loose user brief.\n" +
      "Return JSON only with this shape:\n" +
      "{\n" +
      '  "intent_summary": "short summary",\n' +
      '  "confidence": 0.0,\n' +
      '  "factors": [\n' +
      '    { "id": "factor_id", "value": "suggested value", "confidence": 0.0 }\n' +
      "  ]\n" +
      "}\n" +
      "Rules:\n" +
      "- Use only factor ids provided.\n" +
      "- Prefer provided choice values for select factors when clear.\n" +
      "- Do not invent unsupported values.\n" +
      "- If unsure, omit that factor.\n" +
      "- Confidence is 0..1.\n" +
      "- Return JSON only.";

    var payload = {
      domain_id: String(domainId || ""),
      brief: {
        name: String(b.name || ""),
        design_intent: String(b.designIntent || ""),
        goal: String(b.goal || ""),
        audience: String(b.audience || ""),
        scope_scale: String(b.scopeScale || ""),
        inputs: String(b.inputs || ""),
        desired_outputs: String(b.desiredOutputs || ""),
        constraints: String(b.scopeConstraints || ""),
        domain_extra_values: b.domainExtraValues && typeof b.domainExtraValues === "object" ? b.domainExtraValues : {}
      },
      factors: normalizedFactors
    };

    return fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey
      },
      body: JSON.stringify({
        model: model,
        input: [
          { role: "system", content: instruction },
          { role: "user", content: JSON.stringify(payload) }
        ],
        max_output_tokens: 900,
        temperature: 0.1
      })
    })
      .then(function (res) {
        if (!res.ok) return {};
        return res.json().catch(function () { return {}; });
      })
      .then(function (data) {
        if (data && data.usage) {
          var intentUsage = {
            prompt_tokens: data.usage.input_tokens,
            completion_tokens: data.usage.output_tokens,
            total_tokens: data.usage.total_tokens
          };
          updateTokenUsage(intentUsage, model);
        }
        var text = extractResponsesText(data);
        var parsed = tryParseWorkflowDesignJson(text);
        if (!parsed || typeof parsed !== "object") return { factors: {}, intent: {}, confidence: 0 };
        var outFactors = {};
        var rows = Array.isArray(parsed.factors) ? parsed.factors : [];
        rows.forEach(function (row) {
          if (!row || !row.id) return;
          var id = String(row.id || "").trim();
          if (!id) return;
          var factor = getWorkflowBriefFactorById(cfg, id);
          if (!factor) return;
          var conf = Number(row.confidence);
          if (!isFinite(conf)) conf = 0.7;
          if (conf < 0.45) return;
          var parsedVal = parseWorkflowBriefAnswerByType(row.value, factor);
          if (parsedVal === "" || parsedVal == null) return;
          outFactors[id] = parsedVal;
        });
        return {
          factors: outFactors,
          intent: {
            summary: String(parsed.intent_summary || "").trim()
          },
          confidence: isFinite(Number(parsed.confidence)) ? Number(parsed.confidence) : 0
        };
      })
      .catch(function () {
        return { factors: {}, intent: {}, confidence: 0 };
      });
  }

  function getCapturedValue(entry) {
    if (entry && typeof entry === "object" && Object.prototype.hasOwnProperty.call(entry, "value")) {
      return entry.value;
    }
    return entry;
  }

  function getCapturedConfidence(entry) {
    if (entry && typeof entry === "object" && Object.prototype.hasOwnProperty.call(entry, "confidence")) {
      var c = Number(entry.confidence);
      if (isFinite(c)) return c;
    }
    return 0.75;
  }

  function normalizeCapturedTopic(rawValue) {
    var original = rawValue == null ? "" : String(rawValue);
    var topic = original.trim();
    if (!topic) return original;

    // Examples:
    // - "inflation for undergraduate students with 5 MCQs and no answers" -> "inflation"
    // - "photosynthesis for beginners with two learner tasks" -> "photosynthesis"
    var originalClean = topic;
    var originalTokens = originalClean.split(/\s+/).filter(function (t) { return !!t; });
    var strippedByStrongCue = false;
    var strippedByWeakBoundary = false;
    var strippedTail = "";

    var forBoundary = /\s+for\s+(.+)$/i;
    var forMatch = topic.match(forBoundary);
    if (forMatch && typeof forMatch.index === "number" && forMatch.index > 0) {
      var forRhs = String(forMatch[1] || "").trim().toLowerCase();
      var forLooksAudienceLike =
        /\b(students?|learners?|beginner|beginners|undergraduate|postgraduate|novice|advanced|cohort|group|class|year\s*\d+)\b/i.test(forRhs);
      if (forLooksAudienceLike) {
        strippedTail = "for " + forRhs;
        topic = topic.slice(0, forMatch.index).trim();
        strippedByStrongCue = true;
      }
    }

    var withBoundary = /\s+with\s+(.+)$/i;
    var withMatch = topic.match(withBoundary);
    if (withMatch && typeof withMatch.index === "number" && withMatch.index > 0) {
      var withRhs = String(withMatch[1] || "").trim().toLowerCase();
      var withLooksConstraintLike =
        /\b(mcq|mcqs|quiz|question|questions|task|tasks|worksheet|feedback|answer|answers|worked examples|hints?|rubric|no\b|without\b)\b/i.test(withRhs);
      if (withLooksConstraintLike) {
        strippedTail = "with " + withRhs;
        topic = topic.slice(0, withMatch.index).trim();
        strippedByStrongCue = true;
      }
    }

    var remainingBoundary =
      /\s+(?:without|excluding|except|using|across|aligned to|at)\s+/i;
    var boundaryMatch = topic.match(remainingBoundary);
    if (boundaryMatch && typeof boundaryMatch.index === "number" && boundaryMatch.index > 0) {
      strippedTail = String(topic.slice(boundaryMatch.index) || "").toLowerCase();
      topic = topic.slice(0, boundaryMatch.index).trim();
      strippedByWeakBoundary = true;
    }

    var noConstraintMatch = topic.match(/\s+no\s+(?:answers?|feedback|hints?|rubric|mark(?:ing)? scheme)\b/i);
    if (noConstraintMatch && typeof noConstraintMatch.index === "number" && noConstraintMatch.index > 0) {
      topic = topic.slice(0, noConstraintMatch.index).trim();
    }

    topic = topic
      .replace(/[.,;:!?]+$/g, "")
      .replace(/^[\s"'`([{]+|[\s"'`)\]}]+$/g, "")
      .replace(/\s+/g, " ")
      .trim();

    // Keep legitimate short subjects and avoid unsafe empty collapse.
    if (!topic) return original;
    var finalTokens = topic.split(/\s+/).filter(function (t) { return !!t; });
    var isSingleToken = finalTokens.length === 1;
    var hadLongOriginal = originalTokens.length >= 3;
    var tailHadExplicitCues =
      /\b(students?|learners?|beginner|beginners|undergraduate|postgraduate|novice|advanced|cohort|group|class|year\s*\d+|mcq|mcqs|quiz|question|questions|task|tasks|worksheet|feedback|answer|answers|worked examples|hints?|rubric|no\b|without\b)\b/i.test(strippedTail);
    if (
      isSingleToken &&
      hadLongOriginal &&
      strippedByWeakBoundary &&
      !strippedByStrongCue &&
      !tailHadExplicitCues
    ) {
      return originalClean;
    }
    return topic;
  }

  function shouldApplyCapturedFactor(factor, rawUserText, capturedEntry) {
    var confidence = getCapturedConfidence(capturedEntry);
    if (confidence >= 0.75) return true;
    if (confidence < 0.45) return false;
    // Medium confidence: accept if factor is clearly mentioned or not a select.
    var t = String((factor && factor.type) || "text").toLowerCase();
    if (t !== "select") return true;
    return isWorkflowFactorExplicitlyMentionedInText(factor, rawUserText);
  }

  function getHighImpactFactorIds() {
    return {
      topic: true,
      workshop_subject: true,
      subject: true,
      domain: true,
      design_scope: true
    };
  }

  function getPendingHighImpactInferredFactors(config, explicitValues, elicitedValues, inferredValues) {
    var cfg = normalizeWorkflowBriefConfig(config);
    var explicit = explicitValues && typeof explicitValues === "object" ? explicitValues : {};
    var elicited = elicitedValues && typeof elicitedValues === "object" ? elicitedValues : {};
    var inferred = inferredValues && typeof inferredValues === "object" ? inferredValues : {};
    var hi = getHighImpactFactorIds();
    var all = (cfg.requiredFactors || []).concat(cfg.optionalFactors || []);
    var pending = [];
    all.forEach(function (f) {
      if (!f || !f.id) return;
      var id = String(f.id);
      if (!hi[id]) return;
      if (!Object.prototype.hasOwnProperty.call(inferred, id)) return;
      if (Object.prototype.hasOwnProperty.call(explicit, id) && explicit[id] !== "") return;
      if (Object.prototype.hasOwnProperty.call(elicited, id) && elicited[id] !== "") return;
      pending.push({
        id: id,
        label: f.label || id,
        value: inferred[id]
      });
    });
    return pending;
  }

  function getResolvedOrPendingFactorValue(id, pendingList, resolvedFactors) {
    var pending = Array.isArray(pendingList) ? pendingList : [];
    for (var i = 0; i < pending.length; i += 1) {
      var p = pending[i];
      if (p && p.id === id) return p.value;
    }
    var resolved = resolvedFactors && typeof resolvedFactors === "object" ? resolvedFactors : {};
    return resolved[id];
  }

  function buildFriendlyInferenceConfirmationMessage(pendingList, baseBrief, resolvedFactors) {
    var pending = Array.isArray(pendingList) ? pendingList : [];
    var base = baseBrief && typeof baseBrief === "object" ? baseBrief : {};
    var resolved = resolvedFactors && typeof resolvedFactors === "object" ? resolvedFactors : {};
    var designScope = String(getResolvedOrPendingFactorValue("design_scope", pending, resolved) || "").toLowerCase();
    var learnerLevel = String(getResolvedOrPendingFactorValue("learner_level", pending, resolved) || "").toLowerCase();
    var topic = String(
      getResolvedOrPendingFactorValue("topic", pending, resolved) ||
      getResolvedOrPendingFactorValue("workshop_subject", pending, resolved) ||
      ""
    ).trim();
    var audienceRaw = String(base.audience || "").trim();
    var intentBlob = String([base.designIntent || "", base.goal || "", base.desiredOutputs || ""].join(" ")).toLowerCase();
    var mentionsQuiz = /\b(quiz|mcq|question set|question bank|knowledge check)\b/.test(intentBlob);

    var scopePhrase = "a learning workflow";
    if (designScope === "single_activity") {
      scopePhrase = mentionsQuiz ? "a single quiz activity" : "a single activity";
    } else if (designScope === "session") {
      scopePhrase = "a session-based learning workflow";
    } else if (designScope === "sequence") {
      scopePhrase = "a sequence-level learning workflow";
    } else if (designScope === "module") {
      scopePhrase = "a module-level learning workflow";
    }

    var audiencePhrase = "";
    if (learnerLevel === "undergraduate") audiencePhrase = " for undergraduate students";
    else if (learnerLevel === "postgraduate") audiencePhrase = " for postgraduate students";
    else if (learnerLevel === "beginner") audiencePhrase = " for beginner learners";
    else if (learnerLevel === "intermediate") audiencePhrase = " for intermediate learners";
    else if (learnerLevel === "advanced") audiencePhrase = " for advanced learners";
    else if (audienceRaw) audiencePhrase = " for " + audienceRaw;

    var topicPhrase = topic ? " on " + topic : "";
    return (
      "This will create " +
      scopePhrase +
      audiencePhrase +
      topicPhrase +
      ".\nReply 'yes' to continue, or tell me what you'd like to change."
    );
  }

  function parseInferenceOverrides(raw, pendingList) {
    var text = String(raw || "").trim();
    var pending = Array.isArray(pendingList) ? pendingList : [];
    var out = {};
    if (!text) return out;
    var lines = text.split(/\r?\n/).map(function (l) { return String(l || "").trim(); }).filter(Boolean);
    lines.forEach(function (line) {
      var m = line.match(/^([a-zA-Z0-9_:-]+)\s*[:=]\s*(.+)$/);
      if (m && m[1]) {
        out[String(m[1]).trim()] = String(m[2] || "").trim();
      }
    });
    // If no key/value syntax and only one pending factor, treat full text as override.
    if (!Object.keys(out).length && pending.length === 1) {
      out[pending[0].id] = text;
    }
    return out;
  }

  function buildAskedFactorMap(askedFactors) {
    var out = {};
    (Array.isArray(askedFactors) ? askedFactors : []).forEach(function (row) {
      if (!row || !row.id) return;
      out[String(row.id)] = row.value;
    });
    return out;
  }

  function getGeneratedWorkflowStepIds(design) {
    var ids = {};
    var steps = design && Array.isArray(design.steps) ? design.steps : [];
    steps.forEach(function (s) {
      var sid = normalizeCanonicalStepId((s && s.canonical_step_id) || "");
      if (!sid) sid = normalizeCanonicalStepId((s && s.title) || "");
      if (sid) {
        ids[sid] = true;
        if (sid.indexOf("step_") === 0) {
          ids[sid.slice(5)] = true;
        } else {
          ids["step_" + sid] = true;
        }
      }
    });
    return ids;
  }

  function hasGeneratedAssessmentItemsStep(design) {
    var generatedStepIds = getGeneratedWorkflowStepIds(design);
    return !!(
      generatedStepIds.step_generate_assessment_items ||
      generatedStepIds.generate_assessment_items
    );
  }

  function hasGeneratedDesignPageStep(design) {
    var generatedStepIds = getGeneratedWorkflowStepIds(design);
    return !!(generatedStepIds.step_design_page || generatedStepIds.design_page);
  }

  function isClearlyLearnerPageBrief(base) {
    var baseObj = base && typeof base === "object" ? base : {};
    var blob = String([
      baseObj.designIntent || "",
      baseObj.goal || "",
      baseObj.desiredOutputs || "",
      baseObj.inputs || ""
    ].join(" ")).toLowerCase();
    return /\b(learner[-\s]*facing page|student[-\s]*facing page|learner page|student page|revision page|resource page|tutor page|content page|readable page)\b/.test(blob);
  }

  function resolveRefinementProfile(config, profileId) {
    var cfg = normalizeWorkflowBriefConfig(config);
    var profiles =
      cfg.stepRefinementProfiles && typeof cfg.stepRefinementProfiles === "object"
        ? cfg.stepRefinementProfiles
        : {};
    var pid = String(profileId || "").trim();
    if (!pid) return null;
    var raw = profiles[pid] && typeof profiles[pid] === "object"
      ? profiles[pid]
      : null;
    if (!raw) return null;
    var tiers = raw.tiers && typeof raw.tiers === "object" ? raw.tiers : {};
    var requiredRows = Array.isArray(tiers.required) ? tiers.required : [];
    var optionalRows = Array.isArray(tiers.optional) ? tiers.optional : [];
    var requiredIds = [];
    var optionalIds = [];
    var questionTextById = {};
    var parseHintsById = {};
    function absorbRows(rows, targetIds) {
      rows.forEach(function (row) {
        if (!row || typeof row !== "object") return;
        var fid = String(row.factorId || "").trim();
        if (!fid) return;
        if (targetIds.indexOf(fid) === -1) targetIds.push(fid);
        if (typeof row.questionText === "string" && String(row.questionText).trim()) {
          questionTextById[fid] = String(row.questionText);
        }
        if (row.parseHints && typeof row.parseHints === "object") {
          parseHintsById[fid] = JSON.parse(JSON.stringify(row.parseHints));
        }
      });
    }
    absorbRows(requiredRows, requiredIds);
    absorbRows(optionalRows, optionalIds);
    if (!requiredIds.length && !optionalIds.length) return null;
    return {
      profileId: pid,
      requiredIds: requiredIds,
      optionalIds: optionalIds,
      questionTextById: questionTextById,
      parseHintsById: parseHintsById,
      optionalOptInPrompt: String(raw.optionalOptInPrompt || "").trim()
    };
  }

  function resolveAssessmentRefinementProfile(config) {
    return resolveRefinementProfile(config, "assessment_pack");
  }

  function resolveDesignPageRefinementProfile(config) {
    return resolveRefinementProfile(config, "design_page");
  }

  function resolveLearnerPageRefinementProfile(config) {
    return resolveRefinementProfile(config, "learner_page_pack");
  }

  function getActiveRefinementQuestionOverride(factorId) {
    var fid = String(factorId || "").trim();
    if (!fid) return "";
    var elicit = state.workflowBriefElicitation && typeof state.workflowBriefElicitation === "object"
      ? state.workflowBriefElicitation
      : null;
    if (!elicit) return "";
    var map = elicit.refinementQuestionTextById && typeof elicit.refinementQuestionTextById === "object"
      ? elicit.refinementQuestionTextById
      : {};
    var txt = String(map[fid] || "").trim();
    return txt;
  }

  function getActiveRefinementParseHints(factorId) {
    var fid = String(factorId || "").trim();
    if (!fid) return null;
    var elicit = state.workflowBriefElicitation && typeof state.workflowBriefElicitation === "object"
      ? state.workflowBriefElicitation
      : null;
    if (!elicit) return null;
    var map = elicit.refinementParseHintsById && typeof elicit.refinementParseHintsById === "object"
      ? elicit.refinementParseHintsById
      : {};
    var hints = map[fid];
    if (!hints || typeof hints !== "object") return null;
    return hints;
  }

  function isClearlyAssessmentBrief(base, resolved) {
    var baseObj = base && typeof base === "object" ? base : {};
    var resolvedObj = resolved && typeof resolved === "object" ? resolved : {};
    if (resolvedObj.assessment_required === true) return true;
    var blob = String([
      baseObj.designIntent || "",
      baseObj.goal || "",
      baseObj.desiredOutputs || "",
      baseObj.inputs || ""
    ].join(" ")).toLowerCase();
    return /\b(assessment|assessment pack|quiz|mcq|exam|test|question set)\b/.test(blob);
  }

  function filterRefinementFactorsByGeneratedSteps(config, factors, design) {
    var cfg = normalizeWorkflowBriefConfig(config);
    var all = Array.isArray(factors) ? factors : [];
    var stepsPresent = getGeneratedWorkflowStepIds(design);
    return all.filter(function (factor) {
      if (!factor || !factor.id) return false;
      var fid = String(factor.id || "");
      var targets = [];
      (cfg.mappingRules || []).forEach(function (rule) {
        if (!rule || String(rule.factor || "") !== fid) return;
        (Array.isArray(rule.mapsTo) ? rule.mapsTo : []).forEach(function (t) {
          targets.push(String(t || ""));
        });
      });
      var stepTargets = targets
        .filter(function (t) { return t.indexOf("stepParams.") === 0; })
        .map(function (t) {
          var bits = t.split(".");
          return bits.length >= 3 ? normalizeCanonicalStepId(bits[1]) : "";
        })
        .filter(function (x) { return !!x; });
      // Keep workflow-level refinement factors (no step target),
      // and keep step factors only when the target step exists in generated workflow.
      var hasWorkflowTarget = targets.some(function (t) {
        return t.indexOf("workflow.") === 0;
      });
      if (hasWorkflowTarget) return true;
      if (!stepTargets.length) return true;
      return stepTargets.some(function (sid) {
        return !!stepsPresent[sid];
      });
    });
  }

  function getAssessmentPostGenerationElicitationQueue(config, base, resolved, elicitedValues, resolvedSources, design) {
    var cfg = normalizeWorkflowBriefConfig(config);
    var r = resolved && typeof resolved === "object" ? resolved : {};
    var elicited = elicitedValues && typeof elicitedValues === "object" ? elicitedValues : {};
    var sourceMap = resolvedSources && typeof resolvedSources === "object" ? resolvedSources : {};
    var intentMeta = resolveAssessmentIntentClassMetadata(cfg, base, r, design);
    var usingIntentClass = !!intentMeta;
    var mustAskIds = {};
    var candidateIds = [];
    if (intentMeta) {
      var elicitCfg = intentMeta.elicitation && typeof intentMeta.elicitation === "object"
        ? intentMeta.elicitation
        : {};
      var ordered = Array.isArray(elicitCfg.orderedFactors) ? elicitCfg.orderedFactors : [];
      var optional = Array.isArray(elicitCfg.optionalFactors) ? elicitCfg.optionalFactors : [];
      var optionalHighValue = Array.isArray(elicitCfg.optionalHighValueFactors)
        ? elicitCfg.optionalHighValueFactors
        : [];
      var allOrdered = ordered.concat(optional).concat(optionalHighValue);
      allOrdered.forEach(function (id) {
        var key = String(id || "").trim();
        if (!key) return;
        if (candidateIds.indexOf(key) === -1) candidateIds.push(key);
      });
      (Array.isArray(elicitCfg.mustAskFactors) ? elicitCfg.mustAskFactors : []).forEach(function (id) {
        var key = String(id || "").trim();
        if (key) mustAskIds[key] = true;
      });
      logWorkflowTrace("[PRISM][IntentClass] detected", "assessment_pack");
    } else {
      if (!hasGeneratedAssessmentItemsStep(design)) {
        return [];
      }
      mustAskIds = {
        assessment_type: true,
        assessment_total_items: true
      };
      candidateIds = [
        "assessment_type",
        "assessment_total_items",
        "question_style_mix",
        "difficulty_profile",
        "feedback_required",
        "coverage_scope",
        "cognitive_demand"
      ];
    }
    var ordered = [];
    var seen = {};
    function pushById(id) {
      if (!id || seen[id]) return;
      var factor = getWorkflowBriefFactorById(cfg, id);
      if (!factor) return;
      var hasResolvedValue =
        Object.prototype.hasOwnProperty.call(r, id) &&
        r[id] !== "" &&
        r[id] != null;
      var src = String(sourceMap[id] || "");
      var userProvided =
        Object.prototype.hasOwnProperty.call(elicited, id) ||
        src === "explicit" ||
        src === "elicited";
      if (userProvided) return;
      // Must-ask assessment controls should be explicitly collected unless
      // already user-provided.
      if (mustAskIds[id]) {
        seen[id] = true;
        ordered.push(factor);
        return;
      }
      if (!isWorkflowRefinementFactorRelevant(factor, base, r)) return;
      // Optional controls: ask only when unresolved or merely defaulted.
      if (!hasResolvedValue || src === "default") {
        seen[id] = true;
        ordered.push(factor);
      }
    }
    candidateIds.forEach(pushById);
    // Safeguard: if this is clearly an assessment workflow and assessment-item
    // generation is present, ensure missing must-ask controls are queued before
    // the generic deep-refinement fallback can run.
    if (
      !ordered.length &&
      hasGeneratedAssessmentItemsStep(design) &&
      (usingIntentClass || isClearlyAssessmentBrief(base, r))
    ) {
      Object.keys(mustAskIds).forEach(function (id) {
        if (!id || seen[id]) return;
        var factor = getWorkflowBriefFactorById(cfg, id);
        if (!factor) return;
        var src = String(sourceMap[id] || "");
        var userProvided =
          Object.prototype.hasOwnProperty.call(elicited, id) ||
          src === "explicit" ||
          src === "elicited";
        if (userProvided) return;
        seen[id] = true;
        ordered.push(factor);
      });
      logWorkflowTrace(
        "[PRISM][WizardFlow] forced assessment must-ask queue",
        ordered.map(function (f) { return String(f && f.id ? f.id : ""); }).filter(Boolean)
      );
    }
    logWorkflowTrace(
      "[PRISM][IntentClass] assessment factors selected",
      ordered.map(function (f) { return String(f && f.id ? f.id : ""); }).filter(Boolean),
      usingIntentClass ? "(domain-pack intent class)" : "(fallback)"
    );
    return ordered;
  }

  function getPostGenerationElicitationQueueFromProfile(config, profileMeta, base, resolved, elicitedValues, resolvedSources) {
    var cfg = normalizeWorkflowBriefConfig(config);
    var meta = profileMeta && typeof profileMeta === "object" ? profileMeta : null;
    if (!meta) return { requiredQueue: [], optionalQueue: [] };
    var r = resolved && typeof resolved === "object" ? resolved : {};
    var elicited = elicitedValues && typeof elicitedValues === "object" ? elicitedValues : {};
    var sourceMap = resolvedSources && typeof resolvedSources === "object" ? resolvedSources : {};
    function buildQueue(ids, forceAsk) {
      var out = [];
      var seen = {};
      (Array.isArray(ids) ? ids : []).forEach(function (id) {
        var fid = String(id || "").trim();
        if (!fid || seen[fid]) return;
        var factor = getWorkflowBriefFactorById(cfg, fid);
        if (!factor) return;
        var src = String(sourceMap[fid] || "");
        var hasResolvedValue =
          Object.prototype.hasOwnProperty.call(r, fid) &&
          r[fid] !== "" &&
          r[fid] != null;
        var userProvided =
          Object.prototype.hasOwnProperty.call(elicited, fid) ||
          src === "explicit" ||
          src === "elicited";
        if (userProvided) return;
        if (!forceAsk && !isWorkflowRefinementFactorRelevant(factor, base, r)) return;
        if (forceAsk || !hasResolvedValue || src === "default") {
          seen[fid] = true;
          out.push(factor);
        }
      });
      return out;
    }
    return {
      requiredQueue: buildQueue(meta.requiredIds, true),
      optionalQueue: buildQueue(meta.optionalIds, false)
    };
  }

  function resolveActivePostGenerationRefinementProfile(config, base, resolved, design) {
    // Keep assessment precedence to preserve existing behavior and fallback.
    if (hasGeneratedAssessmentItemsStep(design)) {
      var assessment = resolveAssessmentRefinementProfile(config);
      if (assessment) return assessment;
    }
    if (hasGeneratedDesignPageStep(design)) {
      var designPage = resolveDesignPageRefinementProfile(config);
      if (designPage) return designPage;
      var learnerPage = resolveLearnerPageRefinementProfile(config);
      if (learnerPage) return learnerPage;
    }
    return null;
  }
  function isGraphAffectingPostGenerationFactorId(factorId) {
    var fid = String(factorId || "").trim().toLowerCase();
    if (!fid) return false;
    return (
      fid === "input_strategy" ||
      fid === "design_scope" ||
      fid === "assessment_required" ||
      fid === "session_materials" ||
      fid === "learning_environments"
    );
  }

  function continueWorkflowDesignGeneration(base, resolvedState, configForPostRefinement, options) {
    var opts = options && typeof options === "object" ? options : {};
    var skipPostGenerationRefinement = !!opts.skipPostGenerationRefinement;
    var name = String((base && base.name) || "").trim();
    var goal = String((base && base.goal) || "").trim();
    var designIntent = String((base && base.designIntent) || "").trim();
    var audience = String((base && base.audience) || "").trim();
    var scopeScale = String((base && base.scopeScale) || "").trim();
    var inputs = String((base && base.inputs) || "").trim();
    var startingArtefact = String((base && base.startingArtefact) || "").trim();
    var resolvedStartingArtefact =
      resolvedState &&
      resolvedState.resolvedFactors &&
      typeof resolvedState.resolvedFactors === "object"
        ? String(resolvedState.resolvedFactors.input_strategy || "").trim()
        : "";
    var effectiveStartingArtefact = startingArtefact || resolvedStartingArtefact;
    var desiredOutputs = String((base && base.desiredOutputs) || "").trim();
    var scopeConstraints = String((base && base.scopeConstraints) || "").trim();
    var selectedDomains = Array.isArray(base && base.selectedDomains) ? base.selectedDomains : getSelectedWorkflowDomains();

    var mappedConstraints = (resolvedState && resolvedState.mappedBindings && resolvedState.mappedBindings.workflowConstraintPatch)
      ? resolvedState.mappedBindings.workflowConstraintPatch
      : {};
    var constraintLines = [];
    Object.keys(mappedConstraints || {}).forEach(function (k) {
      constraintLines.push(k + ": " + mappedConstraints[k]);
    });
    var mergedConstraints = [scopeConstraints, constraintLines.join("; ")].filter(function (s) {
      return !!String(s || "").trim();
    }).join("; ");

    var briefLines = [];
    briefLines.push("Name: " + name);
    if (designIntent) briefLines.push("Task / design intent: " + designIntent);
    briefLines.push("Goal / outcome: " + (goal || designIntent));
    if (audience) briefLines.push("Audience: " + audience);
    if (scopeScale) briefLines.push("Scope / scale: " + scopeScale);
    if (inputs) briefLines.push("Inputs / artefacts: " + inputs);
    if (effectiveStartingArtefact) briefLines.push("Starting artefact: " + effectiveStartingArtefact);
    if (desiredOutputs) briefLines.push("Desired outputs: " + desiredOutputs);
    if (mergedConstraints) {
      var compressedForDesign = compressWorkflowConstraints(mergedConstraints);
      if (compressedForDesign.compact) {
        briefLines.push("Scope and constraints (compressed): " + compressedForDesign.compact);
      }
    }
    var brief = briefLines.join("\n");
    appendWorkflowDesignLog("assistant", "Designing workflow from your brief and resolved essentials.");

    var buildContext =
      window.WorkflowGenerationContext &&
      typeof window.WorkflowGenerationContext.buildWorkflowGenerationContext === "function"
        ? window.WorkflowGenerationContext.buildWorkflowGenerationContext({
            selectedDomains: selectedDomains,
            brief: brief
          })
        : Promise.resolve({
            promptContext: brief,
            loadedFiles: [],
            missingFiles: [],
            selectedDomains: selectedDomains
          });
    var patternCatalogPromise =
      window.WorkflowGenerationContext &&
      typeof window.WorkflowGenerationContext.getStepPatternCatalog === "function"
        ? window.WorkflowGenerationContext.getStepPatternCatalog({
            selectedDomains: selectedDomains
          }).catch(function () {
            return [];
          })
        : Promise.resolve([]);
    var workflowPolicyPromise =
      window.WorkflowGenerationContext &&
      typeof window.WorkflowGenerationContext.getWorkflowPolicy === "function"
        ? window.WorkflowGenerationContext.getWorkflowPolicy({
            selectedDomains: selectedDomains
          }).catch(function () {
            return null;
          })
        : Promise.resolve(null);

    Promise.all([buildContext, patternCatalogPromise, workflowPolicyPromise])
      .then(function (results) {
        var ctx = results[0] || {};
        var stepPatternCatalog = Array.isArray(results[1]) ? results[1] : [];
        var workflowPolicy = results[2] && typeof results[2] === "object" ? results[2] : null;
        state.workflowStepGenerationContext = ctx;
        state.workflowStepPatternCatalog = stepPatternCatalog;
        if (ctx && Array.isArray(ctx.missingFiles) && ctx.missingFiles.length) {
          showToast(
            "Some context files could not be loaded: " + ctx.missingFiles.join(", "),
            "error"
          );
        }
        return callOpenAIForWorkflowDesign(
          ctx && ctx.promptContext ? ctx.promptContext : brief,
          {
            goal: goal || designIntent,
            inputs: inputs,
            desiredOutputs: desiredOutputs,
            startingArtefact: effectiveStartingArtefact,
            selectedDomains: selectedDomains,
            stepPatternCatalog: stepPatternCatalog,
            workflowPolicy: workflowPolicy,
            explicitBriefFactors: extractWorkflowBriefExplicitFactors(base),
            resolvedBriefFactors: resolvedState ? resolvedState.resolvedFactors : {},
            mappedBindings: resolvedState ? resolvedState.mappedBindings : {}
          }
        );
      })
      .then(function (design) {
        var queuedDesign = design;
        logWorkflowTrace("[PRISM][Trace][QueueDesignSource]", {
          designArgStepsCount: Array.isArray(design && design.steps) ? design.steps.length : 0,
          designArgStepIds: getGeneratedWorkflowStepIds(design),
          workflowDesignResultStepsCount:
            Array.isArray(state.workflowDesignResult && state.workflowDesignResult.steps)
              ? state.workflowDesignResult.steps.length
              : 0,
          workflowDesignResultStepIds: getGeneratedWorkflowStepIds(state.workflowDesignResult)
        });
        logWorkflowTrace("[PRISM][Trace][GenerationStart]", {
          loadedFiles:
            state.workflowStepGenerationContext &&
            Array.isArray(state.workflowStepGenerationContext.loadedFiles)
              ? state.workflowStepGenerationContext.loadedFiles
              : [],
          selectedDomains: Array.isArray(base && base.selectedDomains)
            ? base.selectedDomains
            : getSelectedWorkflowDomains(),
          goal: String((base && base.goal) || (base && base.designIntent) || ""),
          resolvedBriefFactors:
            resolvedState && resolvedState.resolvedFactors
              ? resolvedState.resolvedFactors
              : {},
          stepsBeforePostRefinement: Array.isArray(queuedDesign && queuedDesign.steps)
            ? queuedDesign.steps.map(function (s) { return String((s && s.title) || ""); })
            : [],
          generatedStepIds: getGeneratedWorkflowStepIds(queuedDesign)
        });
        var cfg = configForPostRefinement ? normalizeWorkflowBriefConfig(configForPostRefinement) : null;
        if (!cfg) return;
        if (skipPostGenerationRefinement) {
          state.workflowAwaitingDeepRefineOptIn = false;
          state.workflowDeepRefineContext = null;
          appendWorkflowDesignLog(
            "assistant",
            "Your workflow is ready. You can adjust Settings at any time."
          );
          if (els.wfDesignStatus) {
            els.wfDesignStatus.textContent = "Ready";
            els.wfDesignStatus.className = "badge badge-success";
          }
          return;
        }
        var askedMap = buildAskedFactorMap(resolvedState && resolvedState.askedFactors);
        var resolvedSnapshot = {
          resolved: (resolvedState && resolvedState.resolvedFactors) || {},
          sources: (resolvedState && resolvedState.resolvedSources) || {}
        };
        var assessmentQueue = getAssessmentPostGenerationElicitationQueue(
          cfg,
          base,
          resolvedSnapshot.resolved,
          askedMap,
          resolvedSnapshot.sources,
          queuedDesign
        );
        var postQueue = getWorkflowRefinementQueue(
          cfg,
          base,
          resolvedSnapshot.resolved,
          askedMap,
          resolvedSnapshot.sources
        );
        postQueue = filterRefinementFactorsByGeneratedSteps(cfg, postQueue, queuedDesign);
        var activeProfileMeta = resolveActivePostGenerationRefinementProfile(
          cfg,
          base,
          resolvedSnapshot.resolved,
          queuedDesign
        );
        var activeProfileId = String((activeProfileMeta && activeProfileMeta.profileId) || "");
        var profileQueue = getPostGenerationElicitationQueueFromProfile(
          cfg,
          activeProfileMeta,
          base,
          resolvedSnapshot.resolved,
          askedMap,
          resolvedSnapshot.sources
        );
        var profileRequiredQueue = Array.isArray(profileQueue.requiredQueue)
          ? profileQueue.requiredQueue
          : [];
        var profileOptionalQueue = Array.isArray(profileQueue.optionalQueue)
          ? profileQueue.optionalQueue
          : [];
        var usingAssessmentProfile = activeProfileId === "assessment_pack";
        var assessmentMustAskIds = { assessment_type: true, assessment_total_items: true };
        var assessmentOptionalIds = {
          difficulty_profile: true,
          coverage_scope: true,
          feedback_required: true,
          question_style_mix: true,
          cognitive_demand: true
        };
        var refinementQuestionTextById = {};
        var refinementParseHintsById = {};
        var optionalOptInPrompt =
          "Do you want to refine the assessment further? I can ask about difficulty, coverage, feedback/model answers, and question mix. (yes/no)";
        if (activeProfileMeta) {
          assessmentMustAskIds = {};
          assessmentOptionalIds = {};
          activeProfileMeta.requiredIds.forEach(function (id) {
            assessmentMustAskIds[String(id)] = true;
          });
          activeProfileMeta.optionalIds.forEach(function (id) {
            assessmentOptionalIds[String(id)] = true;
          });
          refinementQuestionTextById = activeProfileMeta.questionTextById || {};
          refinementParseHintsById = activeProfileMeta.parseHintsById || {};
          if (activeProfileMeta.optionalOptInPrompt) {
            optionalOptInPrompt = activeProfileMeta.optionalOptInPrompt;
          }
        }
        logWorkflowTrace("[PRISM][Trace][Queues]", {
          assessmentQueueIds: assessmentQueue
            .map(function (f) { return String(f && f.id ? f.id : ""); })
            .filter(Boolean),
          postQueueIdsBeforeMerge: postQueue
            .map(function (f) { return String(f && f.id ? f.id : ""); })
            .filter(Boolean)
        });
        if (activeProfileMeta) {
          postQueue = profileRequiredQueue;
          state.workflowAssessmentOptionalQueueSeed = null;
        } else if (assessmentQueue.length) {
          var essentialQueue = assessmentQueue.filter(function (factor) {
            return !!(factor && factor.id && assessmentMustAskIds[String(factor.id)]);
          });
          // Assessment fallback queue: essentials only during generation.
          postQueue = essentialQueue;
          state.workflowAssessmentOptionalQueueSeed = null;
        }
        if (!postQueue.length) {
          logWorkflowTrace("[PRISM][WizardFlow] no required post-generation queue; finalizing current draft");
          state.workflowAwaitingDeepRefineOptIn = false;
          state.workflowDeepRefineContext = null;
          appendWorkflowDesignLog(
            "assistant",
            "Your workflow is ready. You can adjust Settings at any time."
          );
          if (els.wfDesignStatus) {
            els.wfDesignStatus.textContent = "Ready";
            els.wfDesignStatus.className = "badge badge-success";
          }
          return;
        }
        state.workflowBriefElicitation = {
          base: base,
          domainId: getFirstStructuredDomainId(base && base.selectedDomains),
          config: cfg,
          explicitValues: extractWorkflowBriefExplicitFactors(base),
          inferredValues: (resolvedState && resolvedState.inferredFactors) || {},
          elicitedValues: askedMap,
          queue: postQueue,
          index: 0,
          stage: "post_generation_refinement",
          regenerateAfterComplete: false,
          answeredFactorIdsPostGen: {},
          assessmentTwoTier: !!(activeProfileMeta || assessmentQueue.length > 0),
          activeRefinementProfileId: activeProfileId,
          assessmentOptionalQueue: [],
          awaitingAssessmentOptionalOptIn: false,
          assessmentOptionalAsked: false,
          optionalOptInPrompt: optionalOptInPrompt,
          refinementQuestionTextById: refinementQuestionTextById,
          refinementParseHintsById: refinementParseHintsById
        };
        state.workflowAssessmentOptionalQueueSeed = null;
        logWorkflowTrace(
          "[PRISM][WizardFlow] required post-generation queue active",
          postQueue.map(function (f) { return String(f && f.id ? f.id : ""); }).filter(Boolean)
        );
        appendWorkflowDesignLog(
          "assistant",
          (activeProfileMeta || assessmentQueue.length)
            ? ((activeProfileId === "design_page" || activeProfileId === "learner_page_pack")
              ? "I’ve drafted the workflow. Quick page setup: I’ll ask only missing high-value page settings, then finalize."
              : "I’ve drafted the workflow. Quick assessment setup: I’ll ask only missing high-value assessment settings, then finalize.")
            : "I’ve drafted the workflow. I’ll ask only essential setup questions, then finalize."
        );
        appendWorkflowDesignLog("assistant", buildWorkflowBriefQuestionText(postQueue[0]));
        if (els.wfDesignStatus) {
          els.wfDesignStatus.textContent = "Refining quality";
          els.wfDesignStatus.className = "badge badge-muted";
        }
      })
      .catch(function (err) {
        showToast(err.message || "Error designing workflow.", "error");
        if (els.wfDesignStatus) {
          els.wfDesignStatus.textContent = "Error";
          els.wfDesignStatus.className = "badge badge-danger";
        }
      });
  }

  function handleStartWorkflowDesign() {
    if (!els.wfDesignName || !els.wfDesignIntent || !els.wfDesignInputs) return;
    var name = (els.wfDesignName.value || "").trim();
    var designIntent = (els.wfDesignIntent.value || "").trim();
    var audience = els.wfDesignAudience ? (els.wfDesignAudience.value || "").trim() : "";
    var scopeScale = els.wfDesignScale ? (els.wfDesignScale.value || "").trim() : "";
    var inputs = (els.wfDesignInputs.value || "").trim();
    var startingArtefact = els.wfDesignStartingArtefact
      ? String(els.wfDesignStartingArtefact.value || "").trim()
      : "";
    var desiredOutputs = els.wfDesignDesiredOutputs ? (els.wfDesignDesiredOutputs.value || "").trim() : "";
    var goal = designIntent;
    if (!name || !designIntent) {
      showToast("Enter at least workflow name and design intent.", "error");
      return;
    }
    if (!state.apiKey) {
      showToast("Load an API key first to design workflows.", "error");
      return;
    }

    if (els.wfDesignStatus) {
      els.wfDesignStatus.textContent = "Designing…";
      els.wfDesignStatus.className = "badge badge-success";
    }
    if (els.wfDesignLog) {
      els.wfDesignLog.innerHTML = "";
    }
    if (els.wfDesignSummary) {
      els.wfDesignSummary.textContent =
        "When the assistant designs a workflow, its summary and steps will appear here.";
      els.wfDesignSummary.classList.add("empty");
    }
    if (els.wfDesignSteps) {
      els.wfDesignSteps.innerHTML = "";
    }
    if (els.wfDesignSaveBtn) {
      // Keep save clickable so users always get explicit feedback/toasts.
      els.wfDesignSaveBtn.disabled = false;
    }
    state.workflowDesignResult = null;
    state.workflowDesignVersions = null;
    state.workflowSelectedVersion = "refined";

    var scopeConstraints = els.wfDesignScopeConstraints ? (els.wfDesignScopeConstraints.value || "").trim() : "";
    state.workflowAwaitingRefineOptIn = false;
    state.workflowAwaitingSuggestionAnswer = false;
    state.workflowReviewSuggestions = null;
    state.workflowReviewIndex = 0;
    state.workflowAwaitingDeepRefineOptIn = false;
    state.workflowDeepRefineContext = null;
    state.workflowBriefElicitation = null;
    state.workflowDomainSuggestionPending = null;
    state.workflowBriefInferenceConfirmation = null;
    state.workflowBriefResolved = null;
    renderWorkflowBriefResolvedPanel(null);

    var selectedDomains = getSelectedWorkflowDomains();
    if (shouldRecommendLearningDesignDomain(designIntent, goal, selectedDomains)) {
      state.workflowDomainSuggestionPending = {
        name: name,
        designIntent: designIntent,
        audience: audience,
        scopeScale: scopeScale,
        inputs: inputs,
        startingArtefact: startingArtefact,
        desiredOutputs: desiredOutputs,
        scopeConstraints: els.wfDesignScopeConstraints ? (els.wfDesignScopeConstraints.value || "").trim() : ""
      };
      if (els.wfDesignStatus) {
        els.wfDesignStatus.textContent = "Domain suggestion";
        els.wfDesignStatus.className = "badge badge-muted";
      }
      appendWorkflowDesignLog(
        "assistant",
        "This looks like a Learning Design task. Switch to Learning Design domain? (recommended) Reply yes/no."
      );
      return;
    }

    var base = {
      name: name,
      goal: goal,
      designIntent: designIntent,
      audience: audience,
      scopeScale: scopeScale,
      inputs: inputs,
      startingArtefact: startingArtefact,
      desiredOutputs: desiredOutputs,
      domainExtraValues: collectWorkflowDomainExtraFieldValues(),
      scopeConstraints: scopeConstraints,
      selectedDomains: selectedDomains
    };
    var briefConfigPromise =
      window.WorkflowGenerationContext &&
      typeof window.WorkflowGenerationContext.getWorkflowBriefConfig === "function"
        ? window.WorkflowGenerationContext.getWorkflowBriefConfig({
            selectedDomains: selectedDomains
          }).catch(function () {
            return { domainId: "", config: null };
          })
        : Promise.resolve({ domainId: "", config: null });

    briefConfigPromise
      .then(function (briefCfgResult) {
        var domainId = String((briefCfgResult && briefCfgResult.domainId) || "").trim();
        var briefConfig = briefCfgResult && briefCfgResult.config ? briefCfgResult.config : null;
        var structuredDomainId = getFirstStructuredDomainId(selectedDomains);

        var effectiveConfig = briefConfig;
        var effectiveDomainId = domainId;
        if (!structuredDomainId || !domainId || !briefConfig) {
          effectiveConfig = getGeneralFallbackBriefConfig();
          effectiveDomainId = "general";
        }
        if (!effectiveConfig) {
          var passthroughResolved = {
            initialBrief: base,
            askedFactors: [],
            inferredFactors: {},
            resolvedFactors: {},
            mappedBindings: {
              workflowOutputSpecPatch: {},
              workflowConstraintPatch: {},
              stepParamPatch: {},
              mapped: [],
              warnings: []
            },
            missing: []
          };
          state.workflowBriefResolved = passthroughResolved;
          renderWorkflowBriefResolvedPanel(passthroughResolved);
          continueWorkflowDesignGeneration(base, passthroughResolved, effectiveConfig);
          return;
        }

        var config = normalizeWorkflowBriefConfig(effectiveConfig);
        var explicitValues = extractWorkflowBriefExplicitFactors(base);
        var ruleInferredValues = applyWorkflowBriefInferenceRules(
          config,
          [designIntent, goal, desiredOutputs].join("\n"),
          [inputs, scopeConstraints, audience, scopeScale].join("\n")
        );

        callOpenAIForWorkflowIntentInterpretation(base, config, effectiveDomainId)
          .then(function (aiIntent) {
            var aiFactors =
              aiIntent && aiIntent.factors && typeof aiIntent.factors === "object"
                ? aiIntent.factors
                : {};
            // AI-first semantic interpretation merged with deterministic domain inference.
            // Keep deterministic rule inference authoritative when both provide a value,
            // so clear user wording (e.g. "mcq") is not flipped by softer AI guesses.
            // explicit > elicited > inferred > default precedence is preserved downstream.
            var inferredValues = Object.assign({}, aiFactors, ruleInferredValues);
            var firstPass = resolveWorkflowBriefFactors(config, explicitValues, {}, inferredValues, base);
            if (firstPass.missing.length) {
              // Ask unresolved required factors first.
              var queue = firstPass.missing.slice();
              state.workflowBriefElicitation = {
                base: base,
                domainId: effectiveDomainId,
                config: config,
                explicitValues: explicitValues,
                inferredValues: inferredValues,
                elicitedValues: {},
                queue: queue,
                index: 0,
                stage: "required"
              };
              state.workflowBriefResolved = {
                initialBrief: base,
                askedFactors: [],
                inferredFactors: inferredValues,
                resolvedSources: firstPass.sources || {},
                resolvedFactors: firstPass.resolved,
                mappedBindings: {
                  workflowOutputSpecPatch: {},
                  workflowConstraintPatch: {},
                  stepParamPatch: {},
                  mapped: [],
                  warnings: []
                },
                missing: queue.map(function (q) { return q.id; })
              };
              renderWorkflowBriefResolvedPanel(state.workflowBriefResolved);
              appendWorkflowDesignLog(
                "assistant",
                "Great start. I’ll fill the missing essentials, and you can answer naturally (one message can cover multiple details)."
              );
              if (els.wfDesignStatus) {
                els.wfDesignStatus.textContent = "Needs essentials";
                els.wfDesignStatus.className = "badge badge-muted";
              }
              appendWorkflowDesignLog("assistant", buildWorkflowBriefQuestionText(queue[0]));
              return;
            }

            // Auto-accept inferred high-impact factors to keep flow fast:
            // essentials -> generate -> step refinement.
            var pendingHighImpact = getPendingHighImpactInferredFactors(
              config,
              explicitValues,
              {},
              inferredValues
            );
            var confirmedInferredAuto = {};
            pendingHighImpact.forEach(function (p) {
              if (!p || !p.id) return;
              confirmedInferredAuto[p.id] = p.value;
            });

            var mapped = applyWorkflowBriefMappings(config, firstPass.resolved);
            var resolvedState = {
              initialBrief: base,
              askedFactors: [],
              inferredFactors: inferredValues,
              confirmedInferredFactors: confirmedInferredAuto,
              resolvedSources: firstPass.sources || {},
              resolvedFactors: firstPass.resolved,
              mappedBindings: mapped,
              missing: []
            };
            state.workflowBriefResolved = resolvedState;
            renderWorkflowBriefResolvedPanel(resolvedState);
            continueWorkflowDesignGeneration(base, resolvedState, config);
          });
      })
      .catch(function (err) {
        showToast(err.message || "Error preparing workflow brief.", "error");
        if (els.wfDesignStatus) {
          els.wfDesignStatus.textContent = "Error";
          els.wfDesignStatus.className = "badge badge-danger";
        }
      });
  }

  // -----------------------------
  // API key loading
  // -----------------------------

  function normalizeWorkflowTitleTokens(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .split(/\s+/)
      .filter(function (t) { return !!t; });
  }

  function scoreWorkflowTitleMatch(a, b) {
    var ta = normalizeWorkflowTitleTokens(a);
    var tb = normalizeWorkflowTitleTokens(b);
    if (!ta.length || !tb.length) return 0;
    var inB = {};
    tb.forEach(function (t) { inB[t] = true; });
    var overlap = 0;
    ta.forEach(function (t) {
      if (inB[t]) overlap++;
    });
    return overlap / Math.max(ta.length, tb.length);
  }

  function getCanonicalTitleOrderMap(stepPatternCatalog) {
    var map = {};
    (Array.isArray(stepPatternCatalog) ? stepPatternCatalog : []).forEach(function (p, idx) {
      var title = String(p && p.title ? p.title : "").trim();
      if (!title) return;
      map[title.toLowerCase()] =
        typeof p.order === "number" ? p.order : idx + 1;
    });
    return map;
  }

  function normalizeCanonicalStepId(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_:-]+/g, "_");
  }

  function isStructuredDomainSelection(selectedDomains) {
    var domains = Array.isArray(selectedDomains) ? selectedDomains : [];
    return domains.some(function (d) {
      var id = String(d || "").toLowerCase().trim();
      return !!id && id !== "general";
    });
  }

  function getPatternByCanonicalStepId(canonicalStepId, stepPatternCatalog) {
    var target = normalizeCanonicalStepId(canonicalStepId);
    if (!target) return null;
    var pool = Array.isArray(stepPatternCatalog) ? stepPatternCatalog : [];
    for (var i = 0; i < pool.length; i++) {
      var p = pool[i] || {};
      var pid = normalizeCanonicalStepId(
        p.canonicalStepId ||
        p.canonical_step_id ||
        (p.promptFactory && (p.promptFactory.canonical_step_id || p.promptFactory.canonicalStepId))
      );
      if (pid && pid === target) return p;
    }
    return null;
  }

  function pickCanonicalWorkflowStepTitle(rawTitle, stepPatternCatalog) {
    var title = String(rawTitle || "").trim();
    var pool = Array.isArray(stepPatternCatalog) ? stepPatternCatalog : [];
    if (!title || !pool.length) return title;

    var lowerTitle = title.toLowerCase();
    // 1) Exact canonical title match
    for (var i = 0; i < pool.length; i++) {
      var p = pool[i] || {};
      var pTitle = String(p.title || "").trim();
      if (pTitle && pTitle.toLowerCase() === lowerTitle) {
        return pTitle;
      }
    }
    // 2) Alias match
    for (var j = 0; j < pool.length; j++) {
      var pat = pool[j] || {};
      var aliases = Array.isArray(pat.aliases) ? pat.aliases : [];
      for (var k = 0; k < aliases.length; k++) {
        if (String(aliases[k] || "").trim().toLowerCase() === lowerTitle) {
          return String(pat.title || "").trim() || title;
        }
      }
    }
    // 3) Token similarity fallback
    var best = title;
    var bestScore = 0;
    pool.forEach(function (pattern) {
      var candidate = String(pattern && pattern.title ? pattern.title : "").trim();
      if (!candidate) return;
      var s = scoreWorkflowTitleMatch(title, candidate);
      if (s > bestScore) {
        bestScore = s;
        best = candidate;
      }
    });
    return bestScore >= 0.4 ? best : title;
  }

  function getPatternByCanonicalWorkflowTitle(title, stepPatternCatalog) {
    var t = String(title || "").trim().toLowerCase();
    if (!t) return null;
    var pool = Array.isArray(stepPatternCatalog) ? stepPatternCatalog : [];
    for (var i = 0; i < pool.length; i++) {
      var pTitle = String(pool[i] && pool[i].title ? pool[i].title : "").trim().toLowerCase();
      if (pTitle && pTitle === t) return pool[i];
    }
    for (var j = 0; j < pool.length; j++) {
      var p = pool[j] || {};
      var aliases = Array.isArray(p.aliases) ? p.aliases : [];
      for (var k = 0; k < aliases.length; k++) {
        if (String(aliases[k] || "").trim().toLowerCase() === t) return p;
      }
    }
    var best = null;
    var bestScore = 0;
    pool.forEach(function (pattern) {
      var candidate = String(pattern && pattern.title ? pattern.title : "").trim();
      if (!candidate) return;
      var s = scoreWorkflowTitleMatch(String(title || ""), candidate);
      if (s > bestScore) {
        bestScore = s;
        best = pattern;
      }
    });
    if (best && bestScore >= 0.45) return best;
    return null;
  }

  function pickSuggestedOutputNameFromPattern(pattern) {
    if (!pattern || typeof pattern !== "object") return "";
    var candidates = [];
    if (Array.isArray(pattern.outputs)) {
      candidates = pattern.outputs.slice();
    } else if (pattern.output != null) {
      candidates = [pattern.output];
    }
    var normalized = candidates
      .map(function (x) { return String(x || "").trim(); })
      .filter(function (x) { return !!x; });
    if (!normalized.length) return "";
    for (var i = 0; i < normalized.length; i++) {
      if (/^[a-z][a-z0-9_]*$/.test(normalized[i]) && normalized[i].indexOf("_") !== -1) {
        return normalized[i];
      }
    }
    for (var j = 0; j < normalized.length; j++) {
      if (/^[a-z][a-z0-9_]*$/.test(normalized[j])) {
        return normalized[j];
      }
    }
    return "";
  }

  function suggestWorkflowOutputNameForStepTitle(stepTitle, stepPatternCatalog) {
    var canonical = pickCanonicalWorkflowStepTitle(stepTitle, stepPatternCatalog);
    var pattern = getPatternByCanonicalWorkflowTitle(canonical, stepPatternCatalog);
    return pickSuggestedOutputNameFromPattern(pattern);
  }

  function deriveWorkflowStepRoleFromMetadata(step, stepPatternCatalog, stepRoleAnchors) {
    var s = step && typeof step === "object" ? step : {};
    var existing = String(s.role || s.roleLabel || "").trim();
    if (existing) return existing;
    var title = String(s.title || "").trim();
    if (!title) return "";
    var anchors = stepRoleAnchors && typeof stepRoleAnchors === "object" ? stepRoleAnchors : {};
    var anchor = String(anchors[title] || "").trim();
    if (anchor) return anchor;
    var catalog = Array.isArray(stepPatternCatalog) ? stepPatternCatalog : [];
    var pattern = null;
    var canonicalId = String(s.canonical_step_id || s.canonicalStepId || "").trim();
    if (canonicalId) {
      pattern = getPatternByCanonicalStepId(canonicalId, catalog);
    }
    if (!pattern) {
      var canonicalTitle = pickCanonicalWorkflowStepTitle(title, catalog);
      pattern = getPatternByCanonicalWorkflowTitle(canonicalTitle || title, catalog);
    }
    var pf = pattern && pattern.promptFactory && typeof pattern.promptFactory === "object"
      ? pattern.promptFactory
      : null;
    var ri = pf && pf.runnerInstructions && typeof pf.runnerInstructions === "object"
      ? pf.runnerInstructions
      : null;
    var fromRunner = String((ri && ri.what_this_step_does) || "").trim();
    if (fromRunner) return fromRunner;
    var fromNotes = String((pf && pf.defaultPromptNotes) || "").trim();
    if (fromNotes) return fromNotes;
    return "";
  }

  function getStructuredDomainVersionForWorkflow(selectedDomains, stepPatternCatalog) {
    var domains = Array.isArray(selectedDomains) ? selectedDomains : [];
    var primary = domains.find(function (d) {
      return String(d || "").toLowerCase() !== "general";
    });
    if (!primary) return "1";
    var catalog = Array.isArray(stepPatternCatalog) ? stepPatternCatalog : [];
    var hit = catalog.find(function (p) {
      return String(p && p.domainId ? p.domainId : "") === String(primary);
    });
    return String(
      (hit && hit.domainVersion) ||
        "1"
    );
  }

  function inferPatternKind(pattern) {
    if (!pattern || typeof pattern !== "object") return "generate";
    var explicit = String(pattern.kind || "").trim().toLowerCase();
    if (explicit) return explicit;

    var title = String(pattern.title || "").toLowerCase();
    var type = String(pattern.type || "").toLowerCase();
    var output = String(pattern.output || "").toLowerCase();
    var outputs = Array.isArray(pattern.outputs)
      ? pattern.outputs.join(" ").toLowerCase()
      : "";
    var blob = [title, type, output, outputs].join(" ");

    if (blob.indexOf("generate learning content") !== -1 || blob.indexOf("learning_content") !== -1) {
      return "foundation";
    }
    if (blob.indexOf("format") !== -1) return "format";
    if (blob.indexOf("evaluate") !== -1 || blob.indexOf("validate") !== -1) return "evaluate";
    if (
      blob.indexOf("analysis") !== -1 ||
      blob.indexOf("analy") !== -1 ||
      blob.indexOf("evidence") !== -1 ||
      blob.indexOf("theme") !== -1 ||
      blob.indexOf("finding") !== -1 ||
      blob.indexOf("argument") !== -1
    ) {
      return "analyze";
    }
    if (
      blob.indexOf("feedback") !== -1 ||
      blob.indexOf("guidance") !== -1 ||
      blob.indexOf("rubric") !== -1 ||
      blob.indexOf("facilitator") !== -1 ||
      blob.indexOf("instruction") !== -1
    ) {
      return "support";
    }
    if (
      blob.indexOf("outcome") !== -1 ||
      blob.indexOf("specif") !== -1 ||
      blob.indexOf("blueprint") !== -1 ||
      blob.indexOf("plan") !== -1
    ) {
      return "specify";
    }
    if (blob.indexOf("model") !== -1 || blob.indexOf("knowledge") !== -1) return "model";
    if (blob.indexOf("normalize") !== -1) return "normalize";
    return "generate";
  }

  function inferStepKind(step, matchedPattern) {
    if (matchedPattern) return inferPatternKind(matchedPattern);
    var title = String(step && step.title ? step.title : "").toLowerCase();
    var role = String(step && step.role ? step.role : "").toLowerCase();
    var blob = title + " " + role;

    if (blob.indexOf("generate learning content") !== -1 || blob.indexOf("learning_content") !== -1) {
      return "foundation";
    }
    if (blob.indexOf("format") !== -1) return "format";
    if (blob.indexOf("validate") !== -1 || blob.indexOf("evaluation") !== -1) return "evaluate";
    if (
      blob.indexOf("analysis") !== -1 ||
      blob.indexOf("analy") !== -1 ||
      blob.indexOf("evidence") !== -1 ||
      blob.indexOf("theme") !== -1 ||
      blob.indexOf("finding") !== -1 ||
      blob.indexOf("argument") !== -1
    ) {
      return "analyze";
    }
    if (
      blob.indexOf("feedback") !== -1 ||
      blob.indexOf("guidance") !== -1 ||
      blob.indexOf("rubric") !== -1 ||
      blob.indexOf("facilitator") !== -1 ||
      blob.indexOf("instruction") !== -1
    ) {
      return "support";
    }
    if (
      blob.indexOf("outcome") !== -1 ||
      blob.indexOf("specif") !== -1 ||
      blob.indexOf("blueprint") !== -1 ||
      blob.indexOf("plan") !== -1
    ) {
      return "specify";
    }
    if (blob.indexOf("model") !== -1 || blob.indexOf("knowledge") !== -1) return "model";
    if (blob.indexOf("normalize") !== -1) return "normalize";
    return "generate";
  }
  function applyWorkflowDesignHeuristics(parsed, hints) {
    if (!parsed || !Array.isArray(parsed.steps)) return parsed;
    var out = JSON.parse(JSON.stringify(parsed));
    var h = hints && typeof hints === "object" ? hints : {};
    var stepPatternCatalog = Array.isArray(h.stepPatternCatalog) ? h.stepPatternCatalog : [];
    var canonicalOrderMap = getCanonicalTitleOrderMap(stepPatternCatalog);
    var inputs = String(h.inputs || "").toLowerCase();
    var goalText = String(h.goal || "").toLowerCase();
    var desiredOutputsText = String(h.desiredOutputs || "").toLowerCase();
    var resolvedBriefFactors =
      h.resolvedBriefFactors && typeof h.resolvedBriefFactors === "object"
        ? h.resolvedBriefFactors
        : {};
    var explicitBriefFactors =
      h.explicitBriefFactors && typeof h.explicitBriefFactors === "object"
        ? h.explicitBriefFactors
        : {};
    var selectedStartingArtefact = String(h.startingArtefact || "").toLowerCase().trim();
    var resolvedBriefFactors =
      h.resolvedBriefFactors && typeof h.resolvedBriefFactors === "object"
        ? h.resolvedBriefFactors
        : {};
    // IMPORTANT: explicit session-material overrides must come only from
    // explicitly captured brief inputs, not resolved/default values.
    var explicitSessionMaterials = Array.isArray(explicitBriefFactors.session_materials)
      ? explicitBriefFactors.session_materials
          .map(function (v) { return String(v || "").toLowerCase().trim(); })
          .filter(function (v) { return !!v; })
      : [];
    var hasExplicitSessionMaterials = explicitSessionMaterials.length > 0;
    var sourceContentTerms = [
      "pdf",
      "document",
      "article",
      "transcript",
      "notes",
      "text",
      "source material",
      "uploaded file",
      "reading",
      "manifesto",
      "chapter",
      "paper",
      "file"
    ];
    function hasSourceContentSignal() {
      if (!String(inputs || "").trim()) return false;
      return sourceContentTerms.some(function (kw) {
        return inputs.indexOf(kw) !== -1;
      }) || !!String(inputs || "").trim();
    }
    function hasExplicitGenerationOnlySignal() {
      var blob = (goalText + "\n" + inputs).toLowerCase();
      return (
        /\b(no source content|without source content|from topic only|create content|generate content)\b/.test(blob) &&
        !/\b(pdf|document|article|transcript|notes|uploaded file|source material|reading|manifesto|chapter|paper)\b/.test(blob)
      );
    }
    function isIngestTransformationIntent() {
      var blob = (goalText + "\n" + inputs).toLowerCase();
      return /\b(extract|transform|model|normalize|summari[sz]e|define learning outcomes|learning outcomes)\b/.test(blob);
    }
    var hasSourceInput = hasSourceContentSignal();
    var explicitGenerationOnly = hasExplicitGenerationOnlySignal();
    var explicitRegenerateSelectedArtefact = (function () {
      if (!selectedStartingArtefact) return false;
      var blob = [goalText, inputs, desiredOutputsText].join("\n");
      var asksRegeneration = /\b(revise|regenerate|improve|refine|update|rework)\b/.test(blob);
      if (!asksRegeneration) return false;
      var artefactWords = selectedStartingArtefact.replace(/_/g, " ");
      return (
        blob.indexOf(selectedStartingArtefact) !== -1 ||
        blob.indexOf(artefactWords) !== -1 ||
        blob.indexOf("starting artefact") !== -1
      );
    })();
    var intentBlob = [goalText, desiredOutputsText, inputs].join("\n");
    function hasIntent(regex) {
      return regex.test(intentBlob);
    }
    var explicitFeedbackRequested = hasIntent(
      /\b(feedback pack|design feedback|learner feedback|feedback guidance|formative feedback)\b/
    );
    var explicitQaRequested = hasIntent(
      /\b(validate|quality assurance|qa|review quality|alignment audit|alignment check|quality audit|check the assessment|review the assessment)\b/
    );
    var explicitRubricRequested = hasIntent(
      /\b(rubric|marking rubric|grading criteria|mark scheme|tutor marking)\b/
    );
    var explicitItemBankOrMcqRequested = hasIntent(
      /\b(question bank|item bank|mcq|mcqs|multiple choice)\b/
    );
    var assessmentItemsRequested = hasIntent(
      /\b(assessment questions?|question pack|question set|question bank|item bank|mcq|mcqs|multiple choice|quiz|test|formative questions?|formative assessment|assessment items?)\b/
    );
    var assessmentBlueprintRequested = hasIntent(
      /\b(assessment blueprint|blueprint|distribution|difficulty profile|assessment plan|coverage map|specification)\b/
    );
    var explicitPageRequested = hasIntent(
      /\b(learner page|student page|moodle page|vle page|online content page|learner-facing page|student-facing page|content page|readable page)\b/
    );
    var explicitSessionOrActivityRequested = hasIntent(
      /\b(session|lesson|workshop|class|activities?|tasks?|exercise|learning outcomes?|learning sequence)\b/
    );
    var leanAssessmentItemIntent =
      assessmentItemsRequested &&
      explicitItemBankOrMcqRequested &&
      !assessmentBlueprintRequested &&
      !explicitPageRequested &&
      !explicitSessionOrActivityRequested;
    // Normalize plain "formative assessment" requests onto the same lean
    // default path as assessment-pack intent, unless the user explicitly
    // asks for page/session/activity/blueprint/rubric or MCQ-item-bank-only.
    var formativeAssessmentPackDefaultIntent =
      hasIntent(/\bformative assessment\b/) &&
      !assessmentBlueprintRequested &&
      !explicitRubricRequested &&
      !explicitPageRequested &&
      !explicitSessionOrActivityRequested &&
      !explicitItemBankOrMcqRequested;
    var hasTimedSessionCue = hasIntent(
      /\b(\d{1,3}\s*[- ]?(?:minute|min)\b|timed session|timed workshop|timed seminar|60[- ]?minute|90[- ]?minute)\b/
    );
    var hasSessionDeliveryCue = hasIntent(
      /\b(workshop|teaching session|seminar|lesson|classroom session|class session)\b/
    );
    var hasActivityFlowCue = hasIntent(
      /\b(activities?|activity flow|transitions?|pacing|facilitator flow|run[- ]?of[- ]?show)\b/
    );
    var draftHasActivitiesStep = Array.isArray(out.steps) && out.steps.some(function (s) {
      var t = String((s && s.title) || "").toLowerCase();
      return t.indexOf("design learning activities") !== -1;
    });
    var sequenceRequested = hasIntent(
      /\b(sequence|session|lesson|seminar|workshop|workshop run|run[- ]?of[- ]?show|timed plan|schedule)\b/
    ) ||
      /\blearning_sequence\b/.test(desiredOutputsText) ||
      (hasSessionDeliveryCue && hasTimedSessionCue) ||
      (hasSessionDeliveryCue && (hasActivityFlowCue || draftHasActivitiesStep));
    // Workshop delivery guardrail:
    // when the brief clearly asks for a timed live session with activities and
    // assessment, prefer the richer pedagogical chain over thin item/page paths.
    var workshopRichWorkflowIntent =
      hasSessionDeliveryCue &&
      hasTimedSessionCue &&
      explicitSessionOrActivityRequested &&
      assessmentItemsRequested;
    var allowGenerateLearningContent =
      explicitGenerationOnly || (!hasSourceInput && /\b(create|generate)\b/.test(goalText));
    var hasIngestionInput =
      inputs.indexOf("pdf") !== -1 ||
      inputs.indexOf("file") !== -1 ||
      inputs.indexOf("url") !== -1 ||
      inputs.indexOf("document") !== -1;
    out.steps = out.steps.map(function (step, idx) {
      var s = Object.assign({}, step || {});
      var originalTitle = String(s.title || "").trim();
      var canonicalized = pickCanonicalWorkflowStepTitle(originalTitle, stepPatternCatalog);
      var matchedPattern = getPatternByCanonicalWorkflowTitle(canonicalized, stepPatternCatalog);
      s.title = canonicalized || originalTitle;
      if (matchedPattern) {
        s.canonical_step_id = String(
          matchedPattern.canonicalStepId ||
          matchedPattern.canonical_step_id ||
          (matchedPattern.promptFactory &&
            (matchedPattern.promptFactory.canonical_step_id ||
              matchedPattern.promptFactory.canonicalStepId)) ||
          ""
        ).trim();
        s.domain_version = String(
          matchedPattern.domainVersion ||
          matchedPattern.domain_version ||
          (matchedPattern.promptFactory &&
            (matchedPattern.promptFactory.domain_version ||
              matchedPattern.promptFactory.domainVersion)) ||
          "1"
        ).trim();
      }
      s.__kind = inferStepKind(s, matchedPattern);
      s.__originalIndex = idx;
      return s;
    });

    function normalizeWorkflowPolicy(raw, catalog) {
      var policy = raw && typeof raw === "object" ? JSON.parse(JSON.stringify(raw)) : null;
      if (!policy) return null;
      policy.canonicalSteps = Array.isArray(policy.canonicalSteps) ? policy.canonicalSteps : [];
      var aliases = policy.aliases && typeof policy.aliases === "object" ? policy.aliases : {};
      (Array.isArray(catalog) ? catalog : []).forEach(function (p) {
        var title = String(p && p.title ? p.title : "").trim();
        if (!title) return;
        var arr = Array.isArray(aliases[title]) ? aliases[title] : [];
        (Array.isArray(p.aliases) ? p.aliases : []).forEach(function (a) {
          if (arr.indexOf(a) === -1) arr.push(a);
        });
        aliases[title] = arr;
      });
      policy.aliases = aliases;
      policy.maxOccurrences =
        policy.maxOccurrences && typeof policy.maxOccurrences === "object"
          ? policy.maxOccurrences
          : {};
      policy.dependencies =
        policy.dependencies && typeof policy.dependencies === "object"
          ? policy.dependencies
          : {};
      policy.precedenceRules = Array.isArray(policy.precedenceRules) ? policy.precedenceRules : [];
      policy.triggerRules = Array.isArray(policy.triggerRules) ? policy.triggerRules : [];
      policy.finalSteps = Array.isArray(policy.finalSteps) ? policy.finalSteps : [];
      policy.stepRoleAnchors =
        policy.stepRoleAnchors && typeof policy.stepRoleAnchors === "object"
          ? policy.stepRoleAnchors
          : {};
      return policy;
    }

    var policy = normalizeWorkflowPolicy(h.workflowPolicy, stepPatternCatalog);
    if (policy && policy.canonicalSteps.length) {
      var canonicalSet = {};
      var canonicalOrder = {};
      policy.canonicalSteps.forEach(function (t, idx) {
        var k = String(t || "").toLowerCase().trim();
        if (!k) return;
        canonicalSet[k] = t;
        canonicalOrder[k] = idx + 1;
      });
      var aliasToCanonical = {};
      Object.keys(policy.aliases || {}).forEach(function (canonical) {
        var key = String(canonical || "").toLowerCase().trim();
        var values = Array.isArray(policy.aliases[canonical]) ? policy.aliases[canonical] : [];
        values.forEach(function (a) {
          var ak = String(a || "").toLowerCase().trim();
          if (ak) aliasToCanonical[ak] = canonical;
        });
        if (key) aliasToCanonical[key] = canonical;
      });

      function canonicalizeFromPolicy(title) {
        var t = String(title || "").trim();
        if (!t) return "";
        var lower = t.toLowerCase();
        if (canonicalSet[lower]) return canonicalSet[lower];
        if (aliasToCanonical[lower]) return aliasToCanonical[lower];
        var best = "";
        var bestScore = 0;
        policy.canonicalSteps.forEach(function (c) {
          var s = scoreWorkflowTitleMatch(t, c);
          if (s > bestScore) {
            bestScore = s;
            best = c;
          }
        });
        return bestScore >= 0.5 ? best : "";
      }

      function matchesResolvedFactorRules(ruleObj) {
        if (!ruleObj || typeof ruleObj !== "object") return true;
        if (!Object.keys(ruleObj).length) return true;
        return Object.keys(ruleObj).every(function (factorId) {
          var required = ruleObj[factorId];
          var actual = resolvedBriefFactors[factorId];
          if (Array.isArray(required)) {
            if (Array.isArray(actual)) {
              var actualSet = actual.map(function (v) {
                return String(v || "").toLowerCase().trim();
              });
              return required.every(function (rv) {
                return actualSet.indexOf(String(rv || "").toLowerCase().trim()) !== -1;
              });
            }
            var actualSingle = String(actual || "").toLowerCase().trim();
            return required.every(function (rv) {
              return actualSingle === String(rv || "").toLowerCase().trim();
            });
          }
          return String(actual || "").toLowerCase().trim() === String(required || "").toLowerCase().trim();
        });
      }

      var normalizeCanonical = canonicalizeFromPolicy("Normalize Content");
      if (hasIngestionInput && normalizeCanonical) {
        var hasNormalize = out.steps.some(function (s) {
          return canonicalizeFromPolicy(s && s.title) === normalizeCanonical;
        });
        if (!hasNormalize) {
          out.steps.unshift({
            title: normalizeCanonical,
            role: "Normalize and structure source content"
          });
        }
      }

      out.steps = out.steps
        .map(function (s) {
          var row = Object.assign({}, s || {});
          var c = canonicalizeFromPolicy(row.title);
          if (!c) return null;
          row.title = c;
          return row;
        })
        .filter(function (x) { return !!x; });

      function normalizeSessionMaterials(value) {
        if (!Array.isArray(value)) return [];
        var seen = {};
        var outMats = [];
        value.forEach(function (v) {
          var key = String(v || "").toLowerCase().trim();
          if (!key) return;
          if (key !== "page" && key !== "slide_deck" && key !== "vle_structure") {
            return;
          }
          if (seen[key]) return;
          seen[key] = true;
          outMats.push(key);
        });
        return outMats;
      }

      function buildRequestedDeliverySteps(materials) {
        var names = [];
        var byMaterial = {
          page: "Design Page",
          slide_deck: "Generate Slide Deck",
          vle_structure: "Generate VLE Structure"
        };
        materials.forEach(function (mat) {
          var title = byMaterial[mat];
          if (!title) return;
          var c = canonicalizeFromPolicy(title);
          if (!c) return;
          if (names.indexOf(c) === -1) names.push(c);
        });
        return names;
      }

      var explicitSessionMaterials = normalizeSessionMaterials(explicitBriefFactors.session_materials);
      var resolvedSessionMaterials = normalizeSessionMaterials(resolvedBriefFactors.session_materials);
      var sessionMaterialsForInclusion = explicitSessionMaterials.length
        ? explicitSessionMaterials
        : resolvedSessionMaterials;
      var requestedDeliverySteps = buildRequestedDeliverySteps(sessionMaterialsForInclusion);
      var explicitDeliveryOverride = explicitSessionMaterials.length > 0;
      var selfDirectedPageNeedsSequence =
        String((resolvedBriefFactors && resolvedBriefFactors.delivery_context) || "").toLowerCase().trim() === "self_directed" &&
        sessionMaterialsForInclusion.indexOf("page") !== -1;
      var __prismTriggerTrace = [];
      var __prismStepsAfterTriggerRules = [];

      // Trigger rules (goal/input driven) for step inclusion.
      (policy.triggerRules || []).forEach(function (rule) {
        if (!rule || typeof rule !== "object") return;
        // Explicit session_materials from the brief is authoritative for delivery outputs.
        // Skip delivery trigger defaults so we do not auto-include contradictory outputs.
        if (hasExplicitSessionMaterials) {
          var includeTitles = Array.isArray(rule.include) ? rule.include : [];
          var isDeliveryRule = includeTitles.some(function (title) {
            var t = String(title || "").toLowerCase().trim();
            return (
              t === "design page" ||
              t === "generate slide deck" ||
              t === "generate vle structure"
            );
          });
          if (isDeliveryRule) return;
        }
        var goalTerms = Array.isArray(rule.whenGoalMentionsAnyOf)
          ? rule.whenGoalMentionsAnyOf
          : [];
        var inputTerms = Array.isArray(rule.whenInputsMentionAnyOf)
          ? rule.whenInputsMentionAnyOf
          : [];
        var factorRules = rule.whenResolvedFactorsInclude && typeof rule.whenResolvedFactorsInclude === "object"
          ? rule.whenResolvedFactorsInclude
          : null;
        var goalHit = !goalTerms.length || goalTerms.some(function (kw) {
          return goalText.indexOf(String(kw || "").toLowerCase()) !== -1;
        });
        var inputHit = !inputTerms.length || inputTerms.some(function (kw) {
          return inputs.indexOf(String(kw || "").toLowerCase()) !== -1;
        });
        var factorHit = matchesResolvedFactorRules(factorRules);
        if (!(goalHit && inputHit && factorHit)) return;
        __prismTriggerTrace.push({
          idx: __prismTriggerTrace.length + 1,
          whenGoalMentionsAnyOf: goalTerms.slice(),
          whenInputsMentionAnyOf: inputTerms.slice(),
          whenResolvedFactorsInclude: factorRules || {},
          include: Array.isArray(rule.include) ? rule.include.slice() : [],
          exclude: Array.isArray(rule.exclude) ? rule.exclude.slice() : []
        });
        (Array.isArray(rule.exclude) ? rule.exclude : []).forEach(function (title) {
          var c = canonicalizeFromPolicy(title);
          if (!c) return;
          out.steps = out.steps.filter(function (s) {
            return String((s && s.title) || "").toLowerCase() !== c.toLowerCase();
          });
        });
        (Array.isArray(rule.include) ? rule.include : []).forEach(function (title) {
          var c = canonicalizeFromPolicy(title);
          if (!c) return;
          if (
            String(c).toLowerCase() === "generate learning content" &&
            !allowGenerateLearningContent
          ) {
            return;
          }
          var exists = out.steps.some(function (s) {
            return String((s && s.title) || "").toLowerCase() === c.toLowerCase();
          });
          if (!exists) out.steps.push({ title: c, role: "" });
        });
      });
      __prismStepsAfterTriggerRules = out.steps.map(function (s) {
        return String((s && s.title) || "");
      });

      // Deterministic delivery-step inclusion from explicit session_materials.
      if (hasExplicitSessionMaterials) {
        var materialToStep = {
          page: "Design Page",
          slide_deck: "Generate Slide Deck",
          vle_structure: "Generate VLE Structure"
        };
        var requestedSteps = {};
        explicitSessionMaterials.forEach(function (m) {
          var stepTitle = materialToStep[m];
          if (!stepTitle) return;
          var canonical = canonicalizeFromPolicy(stepTitle);
          if (canonical) requestedSteps[String(canonical).toLowerCase()] = canonical;
        });
        Object.keys(requestedSteps).forEach(function (key) {
          var canonical = requestedSteps[key];
          var exists = out.steps.some(function (s) {
            return String((s && s.title) || "").toLowerCase() === key;
          });
          if (!exists) out.steps.push({ title: canonical, role: "" });
        });
        out.steps = out.steps.filter(function (s) {
          var t = String((s && s.title) || "").toLowerCase().trim();
          if (t === "design page") return !!requestedSteps[t];
          if (t === "generate slide deck") return !!requestedSteps[t];
          if (t === "generate vle structure") return !!requestedSteps[t];
          return true;
        });
      }

      // Structured brief interpretation is authoritative when present:
      // include requested delivery outputs deterministically, and override
      // delivery-pattern/default delivery inclusions when explicit.
      if (requestedDeliverySteps.length) {
        requestedDeliverySteps.forEach(function (title) {
          var exists = out.steps.some(function (s) {
            return String((s && s.title) || "").toLowerCase() === String(title || "").toLowerCase();
          });
          if (!exists) out.steps.push({ title: title, role: "" });
        });
      }
      // Self-directed pages should usually be built from an explicit learner progression.
      if (selfDirectedPageNeedsSequence) {
        var sequenceStepTitle = canonicalizeFromPolicy("Construct Learning Sequence");
        if (sequenceStepTitle) {
          var hasSequenceStep = out.steps.some(function (s) {
            return String((s && s.title) || "").toLowerCase() === String(sequenceStepTitle).toLowerCase();
          });
          if (!hasSequenceStep) out.steps.push({ title: sequenceStepTitle, role: "" });
        }
      }
      if (workshopRichWorkflowIntent) {
        [
          "Define Learning Outcomes",
          "Design Learning Activities",
          "Generate Activity Materials",
          "Design Assessment",
          "Construct Learning Sequence",
          "Design Page"
        ].forEach(function (title) {
          var canonical = canonicalizeFromPolicy(title);
          if (!canonical) return;
          var exists = out.steps.some(function (s) {
            return String((s && s.title) || "").toLowerCase() === String(canonical).toLowerCase();
          });
          if (!exists) out.steps.push({ title: canonical, role: "" });
        });
      }
      if (explicitDeliveryOverride) {
        var allowed = {};
        requestedDeliverySteps.forEach(function (t) {
          allowed[String(t || "").toLowerCase()] = true;
        });
        var pageTitle = String(canonicalizeFromPolicy("Design Page") || "").toLowerCase();
        var slideDeckTitle = String(canonicalizeFromPolicy("Generate Slide Deck") || "").toLowerCase();
        var vleStructureTitle = String(canonicalizeFromPolicy("Generate VLE Structure") || "").toLowerCase();
        out.steps = out.steps.filter(function (s) {
          var title = String((s && s.title) || "").toLowerCase();
          var isDelivery =
            title === pageTitle ||
            title === slideDeckTitle ||
            title === vleStructureTitle;
          if (!isDelivery) return true;
          return !!allowed[title];
        });
      }

      // Strong fail-safe: when source content exists, do not keep Generate Learning Content
      // unless user explicitly asked for generation-only behavior.
      if (hasSourceInput && !explicitGenerationOnly) {
        out.steps = out.steps.filter(function (s) {
          return String((s && s.title) || "").toLowerCase() !== "generate learning content";
        });
      }

      // Structural safety for ingest workflows:
      // never place Generate Learning Content into Normalize->Model transformation flows.
      if (hasSourceInput && isIngestTransformationIntent()) {
        out.steps = out.steps.filter(function (s) {
          return String((s && s.title) || "").toLowerCase() !== "generate learning content";
        });
      }

      // Max occurrence / merge duplicates by canonical title.
      var grouped = {};
      out.steps.forEach(function (s) {
        var key = String((s && s.title) || "").toLowerCase().trim();
        if (!key) return;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(s);
      });
      var compact = [];
      Object.keys(grouped).forEach(function (key) {
        var title = grouped[key][0].title;
        var maxN = Number(policy.maxOccurrences[title]);
        if (!isFinite(maxN) || maxN <= 0) maxN = 1;
        grouped[key].slice(0, maxN).forEach(function (s) {
          compact.push(s);
        });
      });
      out.steps = compact;

      // Baseline ordering before constraints: canonical order, then original order.
      out.steps.sort(function (a, b) {
        var at = String(a && a.title ? a.title : "").toLowerCase();
        var bt = String(b && b.title ? b.title : "").toLowerCase();
        var ao = Object.prototype.hasOwnProperty.call(canonicalOrder, at)
          ? canonicalOrder[at]
          : (Object.prototype.hasOwnProperty.call(canonicalOrderMap, at) ? canonicalOrderMap[at] : 9999);
        var bo = Object.prototype.hasOwnProperty.call(canonicalOrder, bt)
          ? canonicalOrder[bt]
          : (Object.prototype.hasOwnProperty.call(canonicalOrderMap, bt) ? canonicalOrderMap[bt] : 9999);
        if (ao !== bo) return ao - bo;
        var ai = typeof a.__originalIndex === "number" ? a.__originalIndex : 0;
        var bi = typeof b.__originalIndex === "number" ? b.__originalIndex : 0;
        return ai - bi;
      });

      // Dependencies by artefact: add missing producer steps until closure.
      var producerByArtefact = {};
      var providedArtefacts = {};
      if (selectedStartingArtefact) {
        providedArtefacts[normalizeWorkflowDesignArtefactKey(selectedStartingArtefact)] = true;
      }
      if (String(goalText || "").trim()) {
        providedArtefacts.topic = true;
      }
      // Demo-safety heuristic: only explicit MCQ/item-bank briefs with no
      // explicit starting-point selection should bypass prerequisite chain
      // generation by treating outcomes as already provided.
      // If a starting point is selected (e.g. generate_from_topic), keep
      // dependency enrichment based on that starting point.
      if (
        leanAssessmentItemIntent &&
        explicitItemBankOrMcqRequested &&
        !selectedStartingArtefact
      ) {
        providedArtefacts.learning_outcomes = true;
      }
      // Input-strategy starting points are not artefacts, so map them to the
      // nearest provided artefact baseline for dependency closure.
      if (selectedStartingArtefact === "provided_source_content") {
        providedArtefacts.learning_content = true;
      }
      Object.keys(policy.dependencies || {}).forEach(function (stepTitle) {
        var canonicalStep = canonicalizeFromPolicy(stepTitle);
        if (!canonicalStep) return;
        var dep = policy.dependencies[stepTitle] || {};
        (Array.isArray(dep.produces) ? dep.produces : []).forEach(function (art) {
          var k = normalizeWorkflowDesignArtefactKey(art);
          if (k) producerByArtefact[k] = canonicalStep;
        });
      });
      // If users explicitly describe having an artefact in free text inputs,
      // treat it as provided at workflow start.
      Object.keys(producerByArtefact).forEach(function (artKey) {
        var plain = String(artKey || "").replace(/_/g, " ").trim();
        if (!plain) return;
        if (inputs.indexOf(artKey) !== -1 || inputs.indexOf(plain) !== -1) {
          providedArtefacts[artKey] = true;
        }
      });
      function hasStepTitle(title) {
        var lower = String(title || "").toLowerCase();
        return out.steps.some(function (s) {
          return String((s && s.title) || "").toLowerCase() === lower;
        });
      }
      function getStepDependency(title) {
        var canonical = canonicalizeFromPolicy(title);
        if (!canonical) return {};
        return policy.dependencies[canonical] || policy.dependencies[String(title || "")] || {};
      }
      function collectRequiredStepsClosure(targetStepTitles) {
        var required = {};
        var visiting = {};
        function markStep(stepTitle) {
          var canonical = canonicalizeFromPolicy(stepTitle);
          if (!canonical) return;
          var key = String(canonical).toLowerCase().trim();
          if (!key) return;
          if (required[key]) return;
          required[key] = true;
          if (visiting[key]) return;
          visiting[key] = true;
          var dep = getStepDependency(canonical);
          var req = Array.isArray(dep.requires) ? dep.requires : [];
          req.forEach(function (art) {
            var artKey = normalizeWorkflowDesignArtefactKey(art);
            if (!artKey || providedArtefacts[artKey]) return;
            var producer = producerByArtefact[artKey];
            if (producer) markStep(producer);
          });
          var anyOf = Array.isArray(dep.requiresAnyOf) ? dep.requiresAnyOf : [];
          if (anyOf.length) {
            var hasProvidedAny = anyOf.some(function (art) {
              var artKey = normalizeWorkflowDesignArtefactKey(art);
              return !!(artKey && providedArtefacts[artKey]);
            });
            if (!hasProvidedAny) {
              var chosenProducer = "";
              anyOf.some(function (art) {
                var artKey = normalizeWorkflowDesignArtefactKey(art);
                if (!artKey) return false;
                var producer = producerByArtefact[artKey];
                if (!producer) return false;
                chosenProducer = producer;
                return true;
              });
              if (chosenProducer) markStep(chosenProducer);
            }
          }
          delete visiting[key];
        }
        (Array.isArray(targetStepTitles) ? targetStepTitles : []).forEach(function (title) {
          markStep(title);
        });
        return required;
      }
      function scoreProducerReadiness(stepTitle) {
        var dep = getStepDependency(stepTitle);
        var req = Array.isArray(dep.requires) ? dep.requires : [];
        var matched = 0;
        req.forEach(function (art) {
          var producer = producerByArtefact[normalizeWorkflowDesignArtefactKey(art)];
          if (producer && hasStepTitle(producer)) matched += 1;
        });
        return matched;
      }
      var depChanged = true;
      var depGuard = 0;
      while (depChanged && depGuard < 24) {
        depChanged = false;
        depGuard += 1;
        for (var di = 0; di < out.steps.length; di += 1) {
          var stepRow = out.steps[di] || {};
          var title = String(stepRow.title || "");
          var dep = getStepDependency(title);
          var required = Array.isArray(dep.requires) ? dep.requires.slice() : [];
          if (Array.isArray(dep.requiresAnyOf) && dep.requiresAnyOf.length) {
            var hasAny = dep.requiresAnyOf.some(function (art) {
              var artKey = normalizeWorkflowDesignArtefactKey(art);
              if (providedArtefacts[artKey]) return true;
              var producer = producerByArtefact[artKey];
              return producer && hasStepTitle(producer);
            });
            if (!hasAny) {
              var bestArt = "";
              var bestScore = -1;
              dep.requiresAnyOf.forEach(function (art) {
                var artKey = normalizeWorkflowDesignArtefactKey(art);
                if (providedArtefacts[artKey]) {
                  bestArt = "";
                  bestScore = 999;
                  return;
                }
                var producer = producerByArtefact[artKey];
                if (!producer) return;
                var score = scoreProducerReadiness(producer);
                if (score > bestScore) {
                  bestScore = score;
                  bestArt = String(art || "");
                }
              });
              if (!bestArt) bestArt = String(dep.requiresAnyOf[0] || "");
              if (bestArt) required.push(bestArt);
            }
          }
          for (var ri = 0; ri < required.length; ri += 1) {
            var art = required[ri];
            var artKey = normalizeWorkflowDesignArtefactKey(art);
            if (providedArtefacts[artKey]) continue;
            var canonicalProducer = producerByArtefact[artKey];
            if (!canonicalProducer || hasStepTitle(canonicalProducer)) continue;
            var insertBeforeIdx = out.steps.findIndex(function (row) {
              return String((row && row.title) || "").toLowerCase() === title.toLowerCase();
            });
            var newRow = { title: canonicalProducer, role: "" };
            if (insertBeforeIdx >= 0) {
              out.steps.splice(insertBeforeIdx, 0, newRow);
            } else {
              out.steps.unshift(newRow);
            }
            depChanged = true;
          }
        }
      }

      // Authoritative starting artefact:
      // remove producer step for selected artefact and its upstream dependency chain.
      if (selectedStartingArtefact && !explicitRegenerateSelectedArtefact) {
        var blockedSteps = {};
        function markUpstreamProducersFromArtefact(artefactId) {
          var artKey = normalizeWorkflowDesignArtefactKey(artefactId);
          if (!artKey) return;
          var producer = producerByArtefact[artKey];
          if (!producer) return;
          var producerKey = String(producer || "").toLowerCase().trim();
          if (!producerKey || blockedSteps[producerKey]) return;
          blockedSteps[producerKey] = true;
          var dep = getStepDependency(producer);
          var req = Array.isArray(dep.requires) ? dep.requires : [];
          req.forEach(function (a) { markUpstreamProducersFromArtefact(a); });
          var anyOf = Array.isArray(dep.requiresAnyOf) ? dep.requiresAnyOf : [];
          anyOf.forEach(function (a) { markUpstreamProducersFromArtefact(a); });
        }
        markUpstreamProducersFromArtefact(selectedStartingArtefact);
        if (Object.keys(blockedSteps).length) {
          out.steps = out.steps.filter(function (s) {
            var key = String((s && s.title) || "").toLowerCase().trim();
            return !blockedSteps[key];
          });
        }
      }
      var explicitlyRequiredStepSet = collectRequiredStepsClosure(requestedDeliverySteps);
      // For topic-start assessment flows, protect the assessment prerequisite
      // chain from optional-pruning so Generate Assessment Items remains viable.
      if (
        selectedStartingArtefact === "generate_from_topic" &&
        assessmentItemsRequested
      ) {
        var assessmentRequiredSet = collectRequiredStepsClosure(["Generate Assessment Items"]);
        Object.keys(assessmentRequiredSet).forEach(function (k) {
          explicitlyRequiredStepSet[k] = true;
        });
      }

      // Optional-step pruning from explicit intent signals.
      out.steps = out.steps.filter(function (s) {
        var title = String((s && s.title) || "").toLowerCase().trim();
        if (!title) return false;
        if (explicitlyRequiredStepSet[title]) {
          return true;
        }
        if (title === "design feedback" && !explicitFeedbackRequested) {
          return false;
        }
        if (
          title === "validate learning design" &&
          (assessmentItemsRequested || formativeAssessmentPackDefaultIntent) &&
          !explicitQaRequested
        ) {
          return false;
        }
        if (
          title === "design assessment" &&
          (assessmentItemsRequested || formativeAssessmentPackDefaultIntent) &&
          !assessmentBlueprintRequested &&
          !workshopRichWorkflowIntent
        ) {
          return false;
        }
        if (
          title === "design marking rubric" &&
          formativeAssessmentPackDefaultIntent &&
          !explicitRubricRequested
        ) {
          return false;
        }
        if (
          title === "construct learning sequence" &&
          !sequenceRequested &&
          !selfDirectedPageNeedsSequence &&
          !workshopRichWorkflowIntent
        ) {
          return false;
        }
        // Keep non-pack item-generation briefs lean by default unless the
        // user explicitly asks for page/session/activity scaffolding.
        if (
          leanAssessmentItemIntent &&
          (
            title === "define learning outcomes" ||
            title === "design learning activities" ||
            title === "generate activity materials" ||
            title === "generate learning content" ||
            title === "model knowledge" ||
            title === "construct learning sequence" ||
            title === "design page"
          )
        ) {
          return false;
        }
        if (
          formativeAssessmentPackDefaultIntent &&
          (
            title === "design learning activities" ||
            title === "generate activity materials" ||
            title === "construct learning sequence"
          )
        ) {
          return false;
        }
        return true;
      });
      logWorkflowTrace("[PRISM][Trace][Heuristics]", {
        goal: String(h.goal || ""),
        inputs: String(h.inputs || ""),
        desiredOutputs: String(h.desiredOutputs || ""),
        resolvedBriefFactors: resolvedBriefFactors,
        matchedTriggerRules: __prismTriggerTrace,
        stepsAfterTriggerRules: __prismStepsAfterTriggerRules,
        stepsAfterPruning: out.steps.map(function (s) {
          return String((s && s.title) || "");
        }),
        leanAssessmentItemIntent: !!leanAssessmentItemIntent
      });

      // Enforce precedence rules.
      function indexOfTitle(title) {
        var lower = String(title || "").toLowerCase();
        return out.steps.findIndex(function (s) {
          return String((s && s.title) || "").toLowerCase() === lower;
        });
      }
      function moveAfter(a, b) {
        var ia = indexOfTitle(a);
        var ib = indexOfTitle(b);
        if (ia === -1 || ib === -1 || ia > ib) return;
        var step = out.steps.splice(ia, 1)[0];
        var ib2 = indexOfTitle(b);
        out.steps.splice(ib2 + 1, 0, step);
      }
      for (var p = 0; p < 4; p += 1) {
        (policy.precedenceRules || []).forEach(function (pair) {
          if (!Array.isArray(pair) || pair.length < 2) return;
          var first = canonicalizeFromPolicy(pair[0]);
          var second = canonicalizeFromPolicy(pair[1]);
          if (!first || !second) return;
          moveAfter(second, first);
        });
      }

      // Final steps must be last.
      (policy.finalSteps || []).forEach(function (title) {
        var c = canonicalizeFromPolicy(title);
        var idx = indexOfTitle(c);
        if (idx !== -1 && idx !== out.steps.length - 1) {
          var step = out.steps.splice(idx, 1)[0];
          out.steps.push(step);
        }
      });

      // Dependency-authoritative pass:
      // keep only steps whose inputs are available; order by satisfiable progression.
      function requirementsSatisfiedForStep(title, available) {
        var dep = getStepDependency(title);
        var req = Array.isArray(dep.requires) ? dep.requires : [];
        for (var i = 0; i < req.length; i += 1) {
          var reqKey = normalizeWorkflowDesignArtefactKey(req[i]);
          if (!reqKey) continue;
          if (!available[reqKey]) return false;
        }
        var anyOf = Array.isArray(dep.requiresAnyOf) ? dep.requiresAnyOf : [];
        if (anyOf.length) {
          var ok = anyOf.some(function (a) {
            var k = normalizeWorkflowDesignArtefactKey(a);
            return !!(k && available[k]);
          });
          if (!ok) return false;
        }
        return true;
      }
      function artefactsProducedByStep(title) {
        var dep = getStepDependency(title);
        return (Array.isArray(dep.produces) ? dep.produces : [])
          .map(function (a) { return normalizeWorkflowDesignArtefactKey(a); })
          .filter(function (a) { return !!a; });
      }
      function buildPrecedencePrereqMap(includedSteps) {
        var includedSet = {};
        (Array.isArray(includedSteps) ? includedSteps : []).forEach(function (row) {
          var key = String((row && row.title) || "").toLowerCase().trim();
          if (key) includedSet[key] = true;
        });
        var prereqMap = {};
        (policy.precedenceRules || []).forEach(function (pair) {
          if (!Array.isArray(pair) || pair.length < 2) return;
          var first = canonicalizeFromPolicy(pair[0]);
          var second = canonicalizeFromPolicy(pair[1]);
          var firstKey = String(first || "").toLowerCase().trim();
          var secondKey = String(second || "").toLowerCase().trim();
          if (!firstKey || !secondKey) return;
          if (!includedSet[firstKey] || !includedSet[secondKey]) return;
          if (!prereqMap[secondKey]) prereqMap[secondKey] = {};
          prereqMap[secondKey][firstKey] = true;
        });
        return prereqMap;
      }
      function precedenceSatisfiedForStep(title, placedSet, prereqMap) {
        var key = String(title || "").toLowerCase().trim();
        if (!key) return true;
        var prereqs = prereqMap && prereqMap[key] ? Object.keys(prereqMap[key]) : [];
        for (var i = 0; i < prereqs.length; i += 1) {
          if (!placedSet[prereqs[i]]) return false;
        }
        return true;
      }
      var availableArtefacts = Object.assign({}, providedArtefacts);
      var pendingSteps = out.steps.slice();
      var orderedValid = [];
      var placedStepSet = {};
      var precedencePrereqMap = buildPrecedencePrereqMap(pendingSteps);
      var progress = true;
      while (pendingSteps.length && progress) {
        progress = false;
        for (var pi = 0; pi < pendingSteps.length; pi += 1) {
          var candidate = pendingSteps[pi] || {};
          var title = String(candidate.title || "");
          if (!title) {
            pendingSteps.splice(pi, 1);
            pi -= 1;
            progress = true;
            continue;
          }
          if (!requirementsSatisfiedForStep(title, availableArtefacts)) {
            continue;
          }
          if (!precedenceSatisfiedForStep(title, placedStepSet, precedencePrereqMap)) {
            continue;
          }
          orderedValid.push(candidate);
          placedStepSet[String(title || "").toLowerCase().trim()] = true;
          artefactsProducedByStep(title).forEach(function (k) {
            availableArtefacts[k] = true;
          });
          pendingSteps.splice(pi, 1);
          pi -= 1;
          progress = true;
        }
      }
      out.steps = orderedValid;

      // Optional role anchors from domain policy plus canonical metadata fallback.
      out.steps = out.steps.map(function (row) {
        var next = Object.assign({}, row || {});
        var existingRole = String(next.role || "").trim();
        if (!existingRole) {
          var backfilledRole = deriveWorkflowStepRoleFromMetadata(
            next,
            stepPatternCatalog,
            policy.stepRoleAnchors
          );
          if (backfilledRole) {
            next.role = String(backfilledRole).trim();
          }
        }
        return next;
      });

      // Build explicit depends_on links from artefact dependencies so saved
      // workflows can derive inputBindings from actual upstream producers.
      var stepIndexByTitle = {};
      out.steps.forEach(function (row, idx) {
        var key = String((row && row.title) || "").toLowerCase().trim();
        if (!key) return;
        if (!Object.prototype.hasOwnProperty.call(stepIndexByTitle, key)) {
          stepIndexByTitle[key] = idx;
        }
      });
      out.steps = out.steps.map(function (row, idx) {
        var next = Object.assign({}, row || {});
        var dep = getStepDependency(next.title);
        var required = Array.isArray(dep.requires) ? dep.requires : [];
        var anyOf = Array.isArray(dep.requiresAnyOf) ? dep.requiresAnyOf : [];
        var optional = Array.isArray(dep.optionalRequires) ? dep.optionalRequires : [];
        var depends = [];
        required.forEach(function (art) {
          var producer = producerByArtefact[normalizeWorkflowDesignArtefactKey(art)];
          if (!producer) return;
          var producerIdx = stepIndexByTitle[String(producer || "").toLowerCase().trim()];
          if (typeof producerIdx !== "number") return;
          if (producerIdx >= idx) return;
          depends.push(producerIdx + 1);
        });
        if (anyOf.length) {
          var hasProvided = anyOf.some(function (art) {
            var k = normalizeWorkflowDesignArtefactKey(art);
            return !!(k && providedArtefacts[k]);
          });
          if (!hasProvided) {
            var chosenProducerIdx = -1;
            anyOf.forEach(function (art) {
              if (chosenProducerIdx !== -1) return;
              var producer = producerByArtefact[normalizeWorkflowDesignArtefactKey(art)];
              if (!producer) return;
              var pi = stepIndexByTitle[String(producer || "").toLowerCase().trim()];
              if (typeof pi !== "number" || pi >= idx) return;
              chosenProducerIdx = pi;
            });
            if (chosenProducerIdx !== -1) depends.push(chosenProducerIdx + 1);
          }
        }
        // Optional artefact dependencies should improve explicit input wiring
        // only when those producer steps are already present upstream.
        optional.forEach(function (art) {
          var producer = producerByArtefact[normalizeWorkflowDesignArtefactKey(art)];
          if (!producer) return;
          var producerIdx = stepIndexByTitle[String(producer || "").toLowerCase().trim()];
          if (typeof producerIdx !== "number") return;
          if (producerIdx >= idx) return;
          depends.push(producerIdx + 1);
        });
        next.__dependsOn = Array.from(new Set(depends)).sort(function (a, b) {
          return a - b;
        });
        return next;
      });
    } else {
      // Generic fallback without domain policy: semantic + canonical sorting.
      var kindOrder = {
        foundation: 0,
        normalize: 1,
        model: 2,
        analyze: 3,
        specify: 4,
        generate: 5,
        support: 6,
        evaluate: 7,
        format: 8
      };
      out.steps.sort(function (a, b) {
        var ak = kindOrder[String(a && a.__kind ? a.__kind : "generate")] || 99;
        var bk = kindOrder[String(b && b.__kind ? b.__kind : "generate")] || 99;
        if (ak !== bk) return ak - bk;
        var at = String(a && a.title ? a.title : "").toLowerCase();
        var bt = String(b && b.title ? b.title : "").toLowerCase();
        var ao = Object.prototype.hasOwnProperty.call(canonicalOrderMap, at) ? canonicalOrderMap[at] : 9999;
        var bo = Object.prototype.hasOwnProperty.call(canonicalOrderMap, bt) ? canonicalOrderMap[bt] : 9999;
        if (ao !== bo) return ao - bo;
        var ai = typeof a.__originalIndex === "number" ? a.__originalIndex : 0;
        var bi = typeof b.__originalIndex === "number" ? b.__originalIndex : 0;
        return ai - bi;
      });
    }

    // Final fail-safe (applies with or without policy):
    // if source content exists, do not include Generate Learning Content unless
    // user explicitly asked for generation-only behavior.
    if (hasSourceInput && !explicitGenerationOnly) {
      out.steps = out.steps.filter(function (s) {
        return String((s && s.title) || "").toLowerCase() !== "generate learning content";
      });
    }

    // Rebuild depends_on linearly to keep generated steps consistent.
    out.steps = out.steps.map(function (s, idx) {
      var row = Object.assign({}, s || {});
      delete row.__kind;
      delete row.__originalIndex;
      var explicitDeps = Array.isArray(row.__dependsOn) ? row.__dependsOn.slice() : null;
      delete row.__dependsOn;
      if (explicitDeps) {
        row.depends_on = explicitDeps;
      } else if (idx <= 0) {
        row.depends_on = [];
      } else {
        row.depends_on = [idx];
      }
      return row;
    });

    return out;
  }

  function handleApiKeyFileChange(event) {
    var file = event.target.files && event.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onerror = function () {
      state.apiKey = null;
      updateApiKeyStatus(false);
      showToast("Could not read API key file.", "error");
    };
    reader.onload = function (e) {
      var content = String(e.target.result || "").trim();
      if (!content) {
        state.apiKey = null;
        updateApiKeyStatus(false);
        showToast("API key file was empty.", "error");
        return;
      }
      state.apiKey = content;
      updateApiKeyStatus(true);
      showToast("API key loaded into memory.", "success");
    };
    reader.readAsText(file);
  }

  function updateApiKeyStatus(loaded) {
    if (!els.apiKeyStatus) return;
    els.apiKeyStatus.textContent = loaded ? "Loaded" : "Not loaded";
    els.apiKeyStatus.classList.toggle("badge-success", loaded);
    els.apiKeyStatus.classList.toggle("badge-danger", !loaded);
    if (els.apiKeyControls) {
      // Hide the file picker and status pill once a key is loaded.
      els.apiKeyControls.classList.toggle("hidden", loaded);
    }
    if (els.apiSettings) {
      els.apiSettings.classList.toggle("hidden", !loaded);
    }
    if (els.apiKeyHelperText) {
      els.apiKeyHelperText.classList.toggle("hidden", loaded);
    }
    if (els.startRefinementBtn) {
      els.startRefinementBtn.disabled = !loaded;
    }
    if (els.wfDesignStartBtn) {
      els.wfDesignStartBtn.disabled = !loaded;
    }
  }

  // -----------------------------
  // Refinement conversation logic
  // -----------------------------

  function hasActiveRefinementSession() {
    return !!(state.sessionActive && state.messages && state.messages.length);
  }

  function hasPendingFinalCandidate() {
    return !!state.pendingFinal;
  }

  function syncSavePromptAssetButtonFromFinalPrompt() {
    if (!els.saveToLibraryBtn || !els.finalPrompt) return;
    // Save readiness belongs to prompt-asset operations, but this value is driven
    // by Prompt Studio editor/runtime output text.
    els.saveToLibraryBtn.disabled = !(els.finalPrompt.value || "").trim();
  }

  function resetConversationState() {
    // Runtime-only reset: keep brief fields and saved library assets unchanged.
    // Lifecycle after reset:
    // - idle/no active refinement
    // - no pending candidate
    // - no review or confirmation sub-phases
    // - no displayed runtime draft/refined versions
    state.messages = [];
    state.sessionActive = false;
    state.finalResult = null;
    state.pendingFinal = null;
    state.awaitingFinalConfirmation = false;
    state.awaitingReviewAnswer = false;
    state.fromReview = false;
    state.awaitingReviewOptIn = false;
    state.reviewQuestions = [];
    state.promptVersions = null;
    state.selectedPromptVersion = null;

    els.sessionStatus.textContent = "Idle";
    els.sessionStatus.className = "badge badge-muted";
    els.conversationLog.innerHTML = "";
    els.followUpAnswer.value = "";
    els.followUpAnswer.disabled = true;
    els.sendFollowUpBtn.disabled = true;
    els.finishRefinementBtn.disabled = true;

    els.finalPrompt.value = "";
    els.finalSummary.textContent =
      "The summary of this prompt will appear here once refinement is complete.";
    els.finalSummary.classList.add("empty");
    els.saveToLibraryBtn.disabled = true;

    state.tokenUsage = {
      sessionPrompt: 0,
      sessionCompletion: 0,
      sessionTotal: 0,
      lastPrompt: 0,
      lastCompletion: 0,
      lastTotal: 0,
      sessionCost: 0,
      lastCost: 0
    };
    if (els.tokenUsage) {
      els.tokenUsage.textContent =
        "Input: 0; Output: 0; Total: 0; Approx cost: $0.0000";
    }
  }

  function clearBriefFields() {
    // Generic brief fields (textual)
    if (els.promptAudience) els.promptAudience.value = "";
    if (els.promptRole) els.promptRole.value = "";
    if (els.promptTone) els.promptTone.value = "";
    if (els.promptContext) els.promptContext.value = "";
    if (els.promptGoal) els.promptGoal.value = "";
    if (els.promptFormat) els.promptFormat.value = "";
    if (els.promptLength) els.promptLength.value = "";
    if (els.promptConstraints) els.promptConstraints.value = "";
    if (els.initialPrompt) els.initialPrompt.value = "";

    // Type-specific fields
    if (els.textReadingLevel) els.textReadingLevel.value = "";

    if (els.codeLanguage) els.codeLanguage.value = "";
    if (els.codeFramework) els.codeFramework.value = "";
    if (els.codeEnvironment) els.codeEnvironment.value = "";
    if (els.codeStyle) els.codeStyle.value = "";

    if (els.imageSubject) els.imageSubject.value = "";
    if (els.imageStyle) els.imageStyle.value = "";
    if (els.imageComposition) els.imageComposition.value = "";
    if (els.imageLighting) els.imageLighting.value = "";
    if (els.imageAspectRatio) els.imageAspectRatio.value = "";
    if (els.imageSize) els.imageSize.value = "";
    if (els.imagePalette) els.imagePalette.value = "";
    if (els.imageText) els.imageText.value = "";
    if (els.imageScene) els.imageScene.value = "";

    if (els.structuredSchema) els.structuredSchema.value = "";
    if (els.structuredValidation) els.structuredValidation.value = "";
  }

  function setWorkflowManagedBriefMode(enabled) {
    var managedIds = [
      "promptAudience",
      "promptGoal",
      "promptConstraints"
    ];
    managedIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.disabled = !!enabled;
    });
  }

  function renderWorkflowPromptWizardNotice() {
    var hasCtx = !!state.promptFactoryWorkflowContext;
    if (!els.workflowPromptWizardNotice) return;

    els.workflowPromptWizardNotice.classList.toggle("hidden", !hasCtx);
    setWorkflowManagedBriefMode(hasCtx);
    if (!hasCtx) {
      if (els.startRefinementBtn) {
        els.startRefinementBtn.textContent = "Start refinement";
      }
      if (els.saveToLibraryBtn) {
        els.saveToLibraryBtn.textContent = "Save to library";
      }
      return;
    }

    var ctx = state.promptFactoryWorkflowContext || {};
    var title = "Workflow prompt mode";
    if (ctx.workflowName && ctx.stepTitle) {
      title = 'Workflow prompt mode: "' + ctx.workflowName + '" -> "' + ctx.stepTitle + '"';
    } else if (ctx.stepTitle) {
      title = 'Workflow prompt mode: "' + ctx.stepTitle + '"';
    }
    if (els.workflowPromptWizardTitle) {
      els.workflowPromptWizardTitle.textContent = title;
    }
    if (els.workflowPromptWizardHint) {
      var inherited = [];
      if (ctx.workflowOutputSpec && ctx.workflowOutputSpec.audience) {
        inherited.push("Audience: " + ctx.workflowOutputSpec.audience);
      }
      if (ctx.workflowOutputSpec && ctx.workflowOutputSpec.goal) {
        inherited.push("Goal: " + ctx.workflowOutputSpec.goal);
      }
      if (ctx.workflowOutputSpec && ctx.workflowOutputSpec.constraints) {
        var compressedForHint = compressWorkflowConstraints(ctx.workflowOutputSpec.constraints);
        if (compressedForHint.compact) {
          inherited.push("Constraints: " + compressedForHint.compact);
        }
      }
      var source = String(ctx.stepPromptSource || "none").toLowerCase();
      var modeLabel =
        source === "local_override"
          ? "Local override"
          : source === "library_prompt"
          ? "Saved library prompt"
          : "Draft prompt";
      inherited.unshift("Prompt status: " + modeLabel);
      if (source === "local_override") {
        inherited.unshift("Editor content: current draft");
      } else if (source === "library_prompt") {
        inherited.unshift("Editor content: saved library prompt");
      }
      if (inherited.length) {
        els.workflowPromptWizardHint.textContent =
          "Based on this workflow step and brief: " +
          inherited.join(" | ") +
          ". You can use the draft as is or tweak it.";
      } else {
        els.workflowPromptWizardHint.textContent =
          "This draft is based on your workflow step. You can use it as is or tweak it.";
      }
    }
    if (els.startRefinementBtn) {
      els.startRefinementBtn.textContent = isWorkflowStepLowFrictionMode()
        ? "Review or refine"
        : "Refine prompt";
    }
    if (els.saveToLibraryBtn) {
      els.saveToLibraryBtn.textContent = "Save to step";
    }
    renderWorkflowStepPromptConfigUI();
    updateWorkflowPromptModeVisibility();
  }

  function clearWorkflowPromptContext() {
    state.promptFactoryWorkflowContext = null;
    state.workflowStepGeneratedDraft = "";
    renderWorkflowPromptWizardNotice();
    if (els.saveToLibraryBtn) {
      els.saveToLibraryBtn.textContent = "Save to library";
    }
  }

  function handleNewBrief() {
    resetConversationState();
    clearBriefFields();
    clearWorkflowPromptContext();
    updateOutputTypeVisibility();
    showToast("New brief ready.", "success");
  }

  function applyPromptEntryToBrief(entry) {
    if (!entry) return;

    // Core body into task description.
    if (els.initialPrompt) {
      els.initialPrompt.value = entry.body || "";
    }

    var brief = entry.brief && typeof entry.brief === "object" ? entry.brief : null;
    if (!brief) return;

    // Output type, if stored and valid.
    if (els.outputType && typeof brief.outputType === "string") {
      var ot = brief.outputType;
      if (
        ot === "text" ||
        ot === "code" ||
        ot === "image" ||
        ot === "structured"
      ) {
        els.outputType.value = ot;
      }
    }

    // Generic brief fields.
    if (els.promptAudience && typeof brief.audience === "string") {
      els.promptAudience.value = brief.audience;
    }
    if (els.promptRole && typeof brief.role === "string") {
      els.promptRole.value = brief.role;
    }
    if (els.promptTone && typeof brief.tone === "string") {
      els.promptTone.value = brief.tone;
    }
    if (els.promptContext && typeof brief.context === "string") {
      els.promptContext.value = brief.context;
    }
    if (els.promptGoal && typeof brief.goal === "string") {
      els.promptGoal.value = brief.goal;
    }
    if (els.promptFormat && typeof brief.format === "string") {
      els.promptFormat.value = brief.format;
    }
    if (els.promptLength && typeof brief.length === "string") {
      els.promptLength.value = brief.length;
    }
    if (els.promptConstraints && typeof brief.constraints === "string") {
      els.promptConstraints.value = brief.constraints;
    }

    // Text-specific.
    if (els.textReadingLevel && typeof brief.textReadingLevel === "string") {
      els.textReadingLevel.value = brief.textReadingLevel;
    }

    // Code-specific.
    if (els.codeLanguage && typeof brief.codeLanguage === "string") {
      els.codeLanguage.value = brief.codeLanguage;
    }
    if (els.codeFramework && typeof brief.codeFramework === "string") {
      els.codeFramework.value = brief.codeFramework;
    }
    if (els.codeEnvironment && typeof brief.codeEnvironment === "string") {
      els.codeEnvironment.value = brief.codeEnvironment;
    }
    if (els.codeStyle && typeof brief.codeStyle === "string") {
      els.codeStyle.value = brief.codeStyle;
    }

    // Image-specific.
    if (els.imageSubject && typeof brief.imageSubject === "string") {
      els.imageSubject.value = brief.imageSubject;
    }
    if (els.imageStyle && typeof brief.imageStyle === "string") {
      els.imageStyle.value = brief.imageStyle;
    }
    if (els.imageComposition && typeof brief.imageComposition === "string") {
      els.imageComposition.value = brief.imageComposition;
    }
    if (els.imageLighting && typeof brief.imageLighting === "string") {
      els.imageLighting.value = brief.imageLighting;
    }
    if (els.imageAspectRatio && typeof brief.imageAspectRatio === "string") {
      els.imageAspectRatio.value = brief.imageAspectRatio;
    }
    if (els.imageSize && typeof brief.imageSize === "string") {
      els.imageSize.value = brief.imageSize;
    }
    if (els.imagePalette && typeof brief.imagePalette === "string") {
      els.imagePalette.value = brief.imagePalette;
    }
    if (els.imageText && typeof brief.imageText === "string") {
      els.imageText.value = brief.imageText;
    }
    if (els.imageScene && typeof brief.imageScene === "string") {
      els.imageScene.value = brief.imageScene;
    }

    // Structured-specific.
    if (els.structuredSchema && typeof brief.structuredSchema === "string") {
      els.structuredSchema.value = brief.structuredSchema;
    }
    if (els.structuredValidation && typeof brief.structuredValidation === "string") {
      els.structuredValidation.value = brief.structuredValidation;
    }
  }

  function resetSession() {
    // Full Prompt Studio reset: runtime session + authored brief state.
    // Does not mutate saved prompt assets in the library.
    resetConversationState();

    // Clear brief fields so each reset starts from a clean slate.
    if (els.outputType) {
      els.outputType.value = "text";
    }
    if (els.creativitySelect) {
      els.creativitySelect.value = "balanced";
    }
    if (els.responseDetailSelect) {
      els.responseDetailSelect.value = "standard";
    }

    clearBriefFields();
    clearWorkflowPromptContext();

    updateOutputTypeVisibility();
  }

  // -----------------------------
  // Prompt Studio brief model (canonical vs derived)
  // -----------------------------

  function getCurrentTaskDescription() {
    // User-authored task text is part of the authored brief intent,
    // but remains a separate input from structured brief fields.
    return els.initialPrompt && typeof els.initialPrompt.value === "string"
      ? els.initialPrompt.value.trim()
      : "";
  }

  function getCurrentBriefSnapshot() {
    // Canonical authored brief snapshot.
    // This is the inspectable source-of-truth capture of Prompt Studio brief fields.
    // Derived/runtime formatting happens in separate builder helpers.
    var outputType = getSelectedOutputType();

    function getTrimmed(el) {
      return el && typeof el.value === "string" ? el.value.trim() : "";
    }

    return {
      outputType: outputType,
      audience: getTrimmed(els.promptAudience),
      role: getTrimmed(els.promptRole),
      tone: getTrimmed(els.promptTone),
      context: getTrimmed(els.promptContext),
      goal: getTrimmed(els.promptGoal),
      format: getTrimmed(els.promptFormat),
      length: getTrimmed(els.promptLength),
      constraints: getTrimmed(els.promptConstraints),
      textReadingLevel: getTrimmed(els.textReadingLevel),
      codeLanguage: getTrimmed(els.codeLanguage),
      codeFramework: getTrimmed(els.codeFramework),
      codeEnvironment: getTrimmed(els.codeEnvironment),
      codeStyle: getTrimmed(els.codeStyle),
      imageSubject: getTrimmed(els.imageSubject),
      imageStyle: getTrimmed(els.imageStyle),
      imageComposition: getTrimmed(els.imageComposition),
      imageLighting: getTrimmed(els.imageLighting),
      imageAspectRatio: getTrimmed(els.imageAspectRatio),
      imageSize: getTrimmed(els.imageSize),
      imagePalette: getTrimmed(els.imagePalette),
      imageText: getTrimmed(els.imageText),
      imageScene: getTrimmed(els.imageScene),
      structuredSchema: getTrimmed(els.structuredSchema),
      structuredValidation: getTrimmed(els.structuredValidation)
    };
  }

  function buildRefinementBriefParts(brief) {
    // Derived refinement context lines from canonical brief snapshot.
    // This is model-facing runtime shaping, not canonical state.
    var parts = [];
    var outputType = brief && brief.outputType ? brief.outputType : "text";
    if (!brief || typeof brief !== "object") return parts;

    if (brief.audience) parts.push("Audience: " + brief.audience);
    if (brief.role) parts.push("AI role / persona (act as): " + brief.role);
    if (brief.context) parts.push("Context: " + brief.context);
    if (brief.goal) parts.push("Goal / outcome: " + brief.goal);
    if (brief.tone && outputType !== "code") parts.push("Tone / voice: " + brief.tone);
    if (brief.format) parts.push("Desired output format: " + brief.format);
    if (outputType === "text" && brief.length) parts.push("Length / depth: " + brief.length);
    if (brief.constraints) parts.push("Constraints & must-haves: " + brief.constraints);

    if (outputType === "text") {
      if (brief.textReadingLevel) parts.push("Reading level: " + brief.textReadingLevel);
    } else if (outputType === "code") {
      if (brief.codeLanguage) parts.push("Code language: " + brief.codeLanguage);
      if (brief.codeFramework) parts.push("Framework / libraries: " + brief.codeFramework);
      if (brief.codeEnvironment) parts.push("Environment / constraints: " + brief.codeEnvironment);
      if (brief.codeStyle) parts.push("Code style: " + brief.codeStyle);
    } else if (outputType === "image") {
      if (brief.imageSubject) parts.push("Image subject: " + brief.imageSubject);
      if (brief.imageStyle) parts.push("Image style: " + brief.imageStyle);
      if (brief.imageComposition) parts.push("Image composition / camera: " + brief.imageComposition);
      if (brief.imageLighting) parts.push("Image lighting / mood: " + brief.imageLighting);
      if (brief.imageAspectRatio) parts.push("Image aspect ratio: " + brief.imageAspectRatio);
      if (brief.imageSize) parts.push("Image size / usage: " + brief.imageSize);
      if (brief.imagePalette) parts.push("Image colour palette: " + brief.imagePalette);
      if (brief.imageText) parts.push("Text in image: " + brief.imageText);
      if (brief.imageScene) parts.push("Scene / setting: " + brief.imageScene);
    } else if (outputType === "structured") {
      if (brief.structuredSchema) parts.push("Structured schema / fields: " + brief.structuredSchema);
      if (brief.structuredValidation) parts.push("Structured validation rules: " + brief.structuredValidation);
    }

    return parts;
  }

  function buildRefinementUserContentFromBrief(taskDescription, brief) {
    // Compose model-visible refinement context from:
    // - authored task description
    // - canonical brief snapshot
    // - derived brief lines for runtime prompt assembly
    var safeTaskDescription = String(taskDescription || "").trim();
    var safeBrief = brief && typeof brief === "object" ? brief : {};
    var outputType = safeBrief.outputType || "text";
    var briefParts = buildRefinementBriefParts(safeBrief);

    var userContent = "Output type: " + outputType + "\n\nTask description: " + safeTaskDescription;
    if (briefParts.length) {
      userContent += "\n\nAdditional brief:\n- " + briefParts.join("\n- ");
    }
    return userContent;
  }

  function buildBriefSummaryForExternalTool() {
    // Display-oriented formatting for manual external refinement workflows.
    // This is intentionally presentation text, not canonical brief storage.
    var brief = getCurrentBriefSnapshot();
    var lines = [];

    // Overall instruction
    lines.push(
      "Please help me refine a high‑quality AI prompt based on these parameters. Focus on turning them into one clear, well‑structured prompt."
    );
    lines.push("");

    // Output type label
    var outputLabel = "text";
    if (brief.outputType === "code") outputLabel = "code";
    else if (brief.outputType === "image") outputLabel = "image";
    else if (brief.outputType === "structured") outputLabel = "structured data (e.g. JSON/table)";
    lines.push("Output type: " + outputLabel);

    // Core brief fields
    if (brief.audience) lines.push("Audience: " + brief.audience);
    if (brief.role) lines.push("AI role / persona (act as): " + brief.role);
    if (brief.goal) lines.push("Goal / outcome: " + brief.goal);
    if (brief.context) lines.push("Context: " + brief.context);
    if (brief.tone && brief.outputType !== "code") lines.push("Tone / voice: " + brief.tone);
    if (brief.format) lines.push("Desired output format: " + brief.format);
    if (brief.outputType === "text" && brief.length) {
      lines.push("Length / depth: " + brief.length);
    }
    if (brief.constraints) lines.push("Constraints & must‑haves: " + brief.constraints);

    // Type‑specific details
    if (brief.outputType === "text") {
      if (brief.textReadingLevel) lines.push("Reading level: " + brief.textReadingLevel);
    } else if (brief.outputType === "code") {
      if (brief.codeLanguage) lines.push("Code language: " + brief.codeLanguage);
      if (brief.codeFramework) lines.push("Framework / libraries: " + brief.codeFramework);
      if (brief.codeEnvironment) lines.push("Environment / constraints: " + brief.codeEnvironment);
      if (brief.codeStyle) lines.push("Code style: " + brief.codeStyle);
    } else if (brief.outputType === "image") {
      if (brief.imageSubject) lines.push("Image subject: " + brief.imageSubject);
      if (brief.imageStyle) lines.push("Image style: " + brief.imageStyle);
      if (brief.imageComposition) lines.push("Composition / camera: " + brief.imageComposition);
      if (brief.imageLighting) lines.push("Lighting / mood: " + brief.imageLighting);
      if (brief.imageAspectRatio) lines.push("Aspect ratio: " + brief.imageAspectRatio);
      if (brief.imageSize) lines.push("Size / usage: " + brief.imageSize);
      if (brief.imagePalette) lines.push("Colour palette: " + brief.imagePalette);
      if (brief.imageText) lines.push("Text in image: " + brief.imageText);
      if (brief.imageScene) lines.push("Scene / setting: " + brief.imageScene);
    } else if (brief.outputType === "structured") {
      if (brief.structuredSchema) lines.push("Schema / fields: " + brief.structuredSchema);
      if (brief.structuredValidation) lines.push("Validation rules: " + brief.structuredValidation);
    }

    // Task description from textarea, if present
    var taskDescription = getCurrentTaskDescription();
    if (taskDescription) {
      lines.push("");
      lines.push("Current task description (if any):");
      lines.push(taskDescription);
    }

    // Fallback if user has not filled much in
    var nonEmpty = lines.filter(function (l) {
      return l && l.trim().length > 0;
    });
    if (nonEmpty.length <= 2) {
      return "";
    }

    return lines.join("\n");
  }

  function handleCopyBriefForCopilot() {
    var summary = buildBriefSummaryForExternalTool();
    if (!summary) {
      showToast("Add some brief details first, then try again.", "error");
      return;
    }
    if (!window.Utils || !window.Utils.copyText) {
      showToast("Clipboard helper is not available.", "error");
      return;
    }
    window.Utils
      .copyText(summary)
      .then(function (ok) {
        if (ok) {
          showToast("Brief copied. Paste it into Copilot to refine.", "success");
        } else {
          showToast("Unable to copy brief to clipboard.", "error");
        }
      })
      .catch(function () {
        showToast("Unable to copy brief to clipboard.", "error");
      });
  }

  function getSelectedOutputType() {
    if (!els.outputType) return "text";
    var value = els.outputType.value || "text";
    return value === "code" || value === "image" || value === "structured" ? value : "text";
  }

  function appendMessage(role, content) {
    state.messages.push({ role: role, content: content });
    renderConversation();
  }

  function renderConversation() {
    els.conversationLog.innerHTML = "";
    state.messages.forEach(function (m) {
      if (m.role === "system") return;
      var item = document.createElement("div");
      var isAssistantLike = m.role === "assistant" || m.role === "reviewer";
      item.className = "conversation-item " + (isAssistantLike ? "assistant" : "user");

      var roleLabel = document.createElement("div");
      roleLabel.className = "conversation-role";
      if (m.role === "assistant") {
        roleLabel.textContent = "Assistant";
      } else if (m.role === "reviewer") {
        roleLabel.textContent = "Reviewer";
      } else {
        roleLabel.textContent = "You";
      }

      var body = document.createElement("div");
      body.textContent = m.content;

      item.appendChild(roleLabel);
      item.appendChild(body);
      els.conversationLog.appendChild(item);
    });
    els.conversationLog.scrollTop = els.conversationLog.scrollHeight;
  }

  function updateWorkflowStepInteractivity() {
    if (!els.workflowSteps) return;
    var isRun = els.workflowModeRunBtn && els.workflowModeRunBtn.classList.contains("active");

    Array.prototype.forEach.call(els.workflowSteps.children, function (li) {
      if (!li.classList || !li.classList.contains("workflow-step")) return;
      var stepId = String(li.getAttribute("data-step-id") || "").trim();
      var wfForRun = findWorkflowById(state.selectedWorkflowId || "");
      var stepForRun = wfForRun && Array.isArray(wfForRun.steps)
        ? wfForRun.steps.find(function (row) {
            return String(row && row.id ? row.id : "").trim() === stepId;
          }) || null
        : null;
      var runnerSummary = getRunnerWhatThisStepDoes(stepForRun || {});
      var summaryPanel = li.querySelector('[data-role="runner-summary"]');
      var summaryBody = li.querySelector('[data-role="runner-summary-body"]');
      if (summaryPanel && summaryBody) {
        summaryPanel.classList.toggle("hidden", !(isRun && runnerSummary));
        summaryBody.textContent = isRun ? String(runnerSummary || "") : "";
      }
      var notesLabelEl = li.querySelector('[data-role="notes-label"]');
      if (notesLabelEl) {
        notesLabelEl.textContent = "Notes";
      }

      // Inputs and selects are read-only/disabled in run mode.
      var fields = li.querySelectorAll("input, select, textarea");
      fields.forEach(function (el) {
        if (el.tagName === "INPUT" && el.type === "button") return;
        if (el.tagName === "TEXTAREA") {
          el.readOnly = isRun;
          if (String(el.getAttribute("data-field") || "") === "notes") {
            if (isRun) {
              if (!el.hasAttribute("data-run-raw-notes")) {
                el.setAttribute("data-run-raw-notes", String(el.value || ""));
              }
              var stripped = stripWorkflowStepParamBlock(String(el.getAttribute("data-run-raw-notes") || el.value || ""));
              el.value = stripped;
            } else if (el.hasAttribute("data-run-raw-notes")) {
              el.value = String(el.getAttribute("data-run-raw-notes") || "");
              el.removeAttribute("data-run-raw-notes");
            }
          }
        } else {
          el.disabled = isRun;
        }
      });

      // Move / remove buttons are disabled in run mode, copy stays active.
      var moveAndRemove = li.querySelectorAll(
        ".workflow-step-move-btn, .workflow-step-remove-btn"
      );
      moveAndRemove.forEach(function (btn) {
        btn.disabled = isRun;
      });
    });

    // Add-step and save/delete behaviour.
    if (els.addWorkflowStepBtn) {
      els.addWorkflowStepBtn.disabled = isRun;
    }
    if (els.saveWorkflowBtn) {
      els.saveWorkflowBtn.disabled = false; // keep save available in both modes
    }
    if (els.saveWorkflowBtnBottom) {
      els.saveWorkflowBtnBottom.disabled = isRun; // bottom save hidden in run mode via detail-buttons
    }
    if (els.deleteWorkflowBtn) {
      els.deleteWorkflowBtn.disabled = false;
    }
  }

  function resetWorkflowRunNavigationState(options) {
    var opts = options && typeof options === "object" ? options : {};
    if (opts.resetIndex === true) {
      state.currentWorkflowRunIndex = 0;
    }
    state.workflowRunVisibleStepId = "";
    state.workflowRunCopiedStepId = "";
  }

  // Workflow runtime lifecycle model (transient navigation state):
  // - run mode source-of-truth: workflow detail run-mode class + active mode buttons
  // - transient run navigation: currentWorkflowRunIndex/workflowRunVisibleStepId/workflowRunCopiedStepId
  // - definition state remains canonical in state.workflows/state.selectedWorkflowId
  function updateWorkflowRunView() {
    if (!els.workflowDetail || !els.workflowSteps) return;

    var isRun =
      els.workflowModeRunBtn &&
      els.workflowModeRunBtn.classList.contains("active") &&
      els.workflowDetail.classList.contains("run-mode");

    var liSteps = [];
    Array.prototype.forEach.call(els.workflowSteps.children, function (child) {
      if (child.classList && child.classList.contains("workflow-step")) {
        liSteps.push(child);
      }
    });

    var total = liSteps.length;

    // If not in run mode, or nothing to step through, show everything and hide controls.
    if (!isRun || total === 0) {
      liSteps.forEach(function (li) {
        li.classList.remove("hidden");
        var copyBtn = li.querySelector(".workflow-step-copy-btn");
        if (copyBtn) {
          copyBtn.textContent = "Copy";
        }
      });
      resetWorkflowRunNavigationState();
      if (els.workflowRunStatus) {
        els.workflowRunStatus.textContent = "";
      }
      if (els.workflowPrevStepBtn) {
        els.workflowPrevStepBtn.disabled = true;
      }
      if (els.workflowNextStepBtn) {
        els.workflowNextStepBtn.disabled = true;
      }
      return;
    }

    // Clamp current index.
    if (state.currentWorkflowRunIndex < 0) {
      state.currentWorkflowRunIndex = 0;
    } else if (state.currentWorkflowRunIndex > total - 1) {
      state.currentWorkflowRunIndex = total - 1;
    }

    var idx = state.currentWorkflowRunIndex;
    var currentStepLi = liSteps[idx] || null;
    var currentStepId = currentStepLi
      ? String(currentStepLi.getAttribute("data-step-id") || "")
      : "";
    if (state.workflowRunVisibleStepId !== currentStepId) {
      state.workflowRunVisibleStepId = currentStepId;
      state.workflowRunCopiedStepId = "";
    }

    // Show only the current step.
    liSteps.forEach(function (li, i) {
      li.classList.toggle("hidden", i !== idx);
      var copyBtn = li.querySelector(".workflow-step-copy-btn");
      if (!copyBtn) return;
      var stepId = String(li.getAttribute("data-step-id") || "");
      var shouldShowCopied =
        stepId &&
        stepId === state.workflowRunVisibleStepId &&
        stepId === state.workflowRunCopiedStepId;
      copyBtn.textContent = shouldShowCopied ? "✓ Copied" : "Copy";
    });

    // Status text, e.g. "Step 1 of 4".
    if (els.workflowRunStatus) {
      var displayIndex = idx + 1; // show steps as 1-based
      var displayTotal = total;
      els.workflowRunStatus.textContent =
        "Step " + displayIndex + " of " + displayTotal;
    }

    // Prev/next buttons.
    if (els.workflowPrevStepBtn) {
      els.workflowPrevStepBtn.disabled = idx === 0;
    }
    if (els.workflowNextStepBtn) {
      els.workflowNextStepBtn.disabled = idx === total - 1;
    }
  }

  function setWorkflowMode(mode) {
    if (!els.workflowModeEditBtn || !els.workflowModeRunBtn) return;

    var isRun = mode === "run";

    // Toggle active button styling.
    if (isRun) {
      els.workflowModeRunBtn.classList.add("active");
      els.workflowModeEditBtn.classList.remove("active");
    } else {
      els.workflowModeEditBtn.classList.add("active");
      els.workflowModeRunBtn.classList.remove("active");
    }

    // Add a mode class on the detail container so CSS can hide edit-only UI in Run mode.
    if (els.workflowDetail) {
      if (isRun) {
        els.workflowDetail.classList.add("run-mode");
      } else {
        els.workflowDetail.classList.remove("run-mode");
      }
    }

    // Top-level workflow fields: read-only in run mode.
    if (els.workflowName) {
      els.workflowName.readOnly = isRun;
    }
    if (els.workflowArtefacts) {
      els.workflowArtefacts.readOnly = isRun;
    }
    if (els.workflowOutputs) {
      els.workflowOutputs.readOnly = isRun;
    }
    if (els.workflowAudience) {
      els.workflowAudience.readOnly = isRun;
    }
    if (els.workflowGoal) {
      els.workflowGoal.readOnly = isRun;
    }
    if (els.workflowConstraints) {
      els.workflowConstraints.readOnly = isRun;
    }

    // Update run-mode summary header (read-only view in Run mode).
    if (els.workflowRunName && els.workflowRunText) {
      if (isRun) {
        var name =
          (els.workflowName && typeof els.workflowName.value === "string"
            ? els.workflowName.value
            : ""
          ).trim();
        var artefacts =
          els.workflowArtefacts &&
          typeof els.workflowArtefacts.value === "string"
            ? els.workflowArtefacts.value.trim()
            : "";
        var wfAudience =
          els.workflowAudience &&
          typeof els.workflowAudience.value === "string"
            ? els.workflowAudience.value.trim()
            : "";
        var wfGoal =
          els.workflowGoal &&
          typeof els.workflowGoal.value === "string"
            ? els.workflowGoal.value.trim()
            : "";
        var wfConstraints =
          els.workflowConstraints &&
          typeof els.workflowConstraints.value === "string"
            ? els.workflowConstraints.value.trim()
            : "";

        els.workflowRunName.textContent = name || "Untitled workflow";

        var parts = [];
        parts.push(
          "Run this workflow in a single Copilot conversation. Copy each step prompt in sequence. Previous outputs remain in context as you go."
        );
        if (artefacts) parts.push("Inputs / artefacts: " + artefacts);
        if (wfAudience) parts.push("Audience: " + wfAudience);
        if (wfGoal) parts.push("Goal / outcome: " + wfGoal);
        if (wfConstraints) parts.push("Output constraints: " + wfConstraints);
        els.workflowRunText.textContent = parts.join("\n\n");
      } else {
        els.workflowRunName.textContent = "";
        els.workflowRunText.textContent = "";
      }
    }

    // Per-step controls and Add step button + run view.
    updateWorkflowStepInteractivity();

    // Re-label step headers for the selected mode (Run mode includes titles and
    // shifts numbering because the summary card is Step 1).
    renumberWorkflowSteps();
    if (isRun) {
      resetWorkflowRunNavigationState({ resetIndex: true });
    }
    updateWorkflowRunView();
  }

  function updatePromptVersionUI() {
    if (!els.finalPrompt || !els.finalSummary) return;
    var versions = state.promptVersions || {};
    var selected = state.selectedPromptVersion;

    // Decide which displayed refinement version to show (draft/refined only).
    // This selector is separate from durable Prompt Library version history.
    if (!selected) {
      if (versions.refined) selected = "refined";
      else if (versions.draft) selected = "draft";
    }
    state.selectedPromptVersion = selected;

    var current =
      (selected && versions[selected]) ||
      versions.refined ||
      versions.draft ||
      null;

    if (current) {
      var renderedPrompt = decodeLikelyEscapedPromptText(current.prompt || "");
      els.finalPrompt.value = renderedPrompt;
      els.finalSummary.textContent = current.summary || "";
      els.finalSummary.classList.toggle(
        "empty",
        !current.summary || !current.summary.trim()
      );
    }

    // Enable "Save to library" whenever a final prompt is present (including manual edits).
    syncSavePromptAssetButtonFromFinalPrompt();

    // Configure the displayed-version selector visibility and options.
    if (els.promptVersionSelect) {
      // Show selector only if we have at least a draft or refined version.
      var hasDraft = !!versions.draft;
      var hasRefined = !!versions.refined;
      if (!hasDraft && !hasRefined) {
        els.promptVersionSelect.classList.add("hidden");
      } else {
        els.promptVersionSelect.classList.remove("hidden");
        // Update options text/state but keep it simple: two static options.
        els.promptVersionSelect.value = selected || (hasRefined ? "refined" : "draft");
        // Disable refined option if it doesn't exist yet.
        for (var i = 0; i < els.promptVersionSelect.options.length; i++) {
          var opt = els.promptVersionSelect.options[i];
          if (opt.value === "refined") {
            opt.disabled = !hasRefined;
          }
          if (opt.value === "draft") {
            opt.disabled = !hasDraft;
          }
        }
      }
    }

    // Keep pendingFinal in sync with the selected displayed version for finalization.
    if (current) {
      state.pendingFinal = {
        status: "complete",
        final_prompt: decodeLikelyEscapedPromptText(current.prompt || ""),
        summary: current.summary || ""
      };
    }
  }

  function handleStartRefinement() {
    if (!state.apiKey) {
      showToast("Load your OpenAI API key first.", "error");
      return;
    }
    var initial = getCurrentTaskDescription();
    if (!initial) {
      showToast("Enter a task description to refine.", "error");
      return;
    }

    // Build model-visible refinement context from canonical authored brief + task text.
    var brief = getCurrentBriefSnapshot();
    var combinedUserContent = buildRefinementUserContentFromBrief(initial, brief);
    // Workflow-step policy below applies only when Prompt Factory is opened
    // from Workflow Designer (step prompt generation mode).
    var workflowStepCfg = null;
    if (state.promptFactoryWorkflowContext) {
      var stepCfg = normalizeWorkflowStepPromptConfig(
        state.promptFactoryWorkflowContext.stepPromptFactoryConfig
      );
      workflowStepCfg = stepCfg;
      var selectedOptions = collectWorkflowStepPromptOptionSelections();
      var workflowContextText = buildPromptFactoryWorkflowContextText(
        state.promptFactoryWorkflowContext,
        {
          includeWorkflowGoalContext: stepCfg.allowWorkflowGoalContext,
          promptScope: stepCfg.promptScope
        }
      );
      if (workflowContextText) {
        combinedUserContent += "\n\nWorkflow step context:\n" + workflowContextText;
      }
      if (
        Array.isArray(state.promptFactoryWorkflowContext.stepInputArtefacts) &&
        state.promptFactoryWorkflowContext.stepInputArtefacts.length
      ) {
        combinedUserContent += "\n\nGuaranteed input artefacts for this step:";
        state.promptFactoryWorkflowContext.stepInputArtefacts.forEach(function (item) {
          combinedUserContent += "\n- " + item;
        });
      }
      combinedUserContent += "\n\nWorkflow-step prompt policy (from domain pack):";
      combinedUserContent +=
        "\n- configurationMode: " + stepCfg.configurationMode;
      combinedUserContent +=
        "\n- askForCustomSchema: " + (stepCfg.askForCustomSchema ? "true" : "false");
      combinedUserContent +=
        "\n- allowWorkflowGoalContext: " + (stepCfg.allowWorkflowGoalContext ? "true" : "false");
      combinedUserContent += "\n- promptScope: " + stepCfg.promptScope;
      combinedUserContent += "\n- structureStyle: " + stepCfg.structureStyle;
      combinedUserContent += "\n- recommendationPlacement: step_config";
      if (stepCfg.defaultPromptStrategy) {
        combinedUserContent +=
          "\n- defaultPromptStrategy: " + stepCfg.defaultPromptStrategy;
      }
      if (stepCfg.preferredOutputFormat) {
        combinedUserContent +=
          "\n- preferredOutputFormat: " + stepCfg.preferredOutputFormat;
      }
      if (stepCfg.defaultPromptNotes) {
        combinedUserContent +=
          "\n- defaultPromptNotes: " + stepCfg.defaultPromptNotes;
      }
      if (stepCfg.defaultOutputStructure) {
        combinedUserContent +=
          "\n- defaultOutputStructure: " + JSON.stringify(stepCfg.defaultOutputStructure);
      }
      if (stepCfg.inputPriority) {
        combinedUserContent +=
          "\n- inputPriority: " + JSON.stringify(stepCfg.inputPriority);
      }
      if (
        Array.isArray(state.promptFactoryWorkflowContext.stepInputArtefactSchemas) &&
        state.promptFactoryWorkflowContext.stepInputArtefactSchemas.length
      ) {
        var knownSchemaTypes = state.promptFactoryWorkflowContext.stepInputArtefactSchemas
          .map(function (row) {
            return String((row && (row.type || row.artefact)) || "").trim();
          })
          .filter(function (s) {
            return !!s;
          });
        if (knownSchemaTypes.length) {
          combinedUserContent +=
            "\n- inputArtefactTypesWithKnownSchemas: " + knownSchemaTypes.join(", ");
        }
      }
      if (
        Array.isArray(state.promptFactoryWorkflowContext.stepInputArtefacts) &&
        state.promptFactoryWorkflowContext.stepInputArtefacts.length
      ) {
        combinedUserContent +=
          "\n\nWorkflow refinement directive: Listed step input artefacts are already workflow-wired and available at runtime. Do NOT ask the user to restate artefact content, confirm artefact availability, or choose alternate upstream artefacts.";
      }
      if (selectedOptions.length) {
        combinedUserContent += "\n- selectedUserOptionsHiddenContext:";
        selectedOptions.forEach(function (opt) {
          combinedUserContent += "\n  - " + opt.id + ": " + opt.value;
        });
        combinedUserContent +=
          "\n\nWorkflow refinement directive: Parameters are sourced from step configuration and should influence behavior, but should not be rendered as explicit parameter lines in the prompt text.";
      }
      if (!stepCfg.askForCustomSchema) {
        combinedUserContent +=
          "\n\nWorkflow refinement directive: Do NOT ask the user to design fields, schema, or output structure. Use canonical domain defaults unless an explicit option above overrides them.";
      }
      if (Array.isArray(stepCfg.inputArtefactSchemas) && stepCfg.inputArtefactSchemas.length) {
        combinedUserContent +=
          "\n\nWorkflow refinement directive: Declared input artefacts have known schemas. Do NOT ask the user to describe input artefact format or fields.";
      }
      if (
        stepCfg.configurationMode === "none" &&
        Array.isArray(state.promptFactoryWorkflowContext.stepInputArtefacts) &&
        state.promptFactoryWorkflowContext.stepInputArtefacts.length
      ) {
        combinedUserContent +=
          "\n\nWorkflow refinement directive: Declared input artefacts are guaranteed to be available at runtime. Do NOT ask the user to supply content, confirm artefact availability, or choose artefact priority.";
      }
      if (stepCfg.configurationMode === "none") {
        combinedUserContent +=
          "\n\nWorkflow refinement directive: This is a no-configuration step. Do not ask follow-up questions; produce the final prompt directly.";
      } else if (stepCfg.configurationMode === "simple") {
        combinedUserContent +=
          "\n\nWorkflow refinement directive: Ask zero follow-up questions unless a truly critical detail is missing for correctness or safety. Prefer producing the final prompt directly.";
      } else {
        combinedUserContent +=
          "\n\nWorkflow refinement directive: In this mode, ask at most one high-value clarification question. If the step intent is clear enough, produce the final prompt without extra rounds.";
      }
      if (!stepCfg.allowWorkflowGoalContext || stepCfg.promptScope === "step_only") {
        combinedUserContent +=
          "\n\nWorkflow refinement directive: Keep the prompt strictly step-scoped. Do not mention downstream steps, end deliverables, or workflow end goals unless explicitly required by step policy.";
      }
      if (stepCfg.preferredOutputFormat) {
        combinedUserContent +=
          "\n\nWorkflow refinement directive: Enforce preferred output format exactly as configured: " +
          stepCfg.preferredOutputFormat +
          ". Do not ask whether to use another format.";
      }
      if (stepCfg.structureStyle === "text_structured") {
        combinedUserContent +=
          "\n\nWorkflow refinement directive: Use text-structured language (sections/headings/coherent prose). Do not ask for or propose schema/field design.";
      } else if (stepCfg.structureStyle === "schema_structured") {
        combinedUserContent +=
          "\n\nWorkflow refinement directive: Use schema-structured language with explicit JSON-style structure.";
      }
    }

    if (state.promptFactoryWorkflowContext && workflowStepCfg) {
      if (isWorkflowStepLowFrictionMode()) {
        resetConversationState();
        var instantDraft = String(els.initialPrompt && els.initialPrompt.value ? els.initialPrompt.value : "").trim();
        if (!instantDraft) {
          showToast("No workflow-step draft was generated yet.", "error");
          return;
        }
        state.promptVersions = {
          draft: {
            prompt: instantDraft,
            summary: "Draft prompt ready. Based on your workflow step and brief."
          }
        };
        state.selectedPromptVersion = "draft";
        updatePromptVersionUI();
        state.pendingFinal = {
          status: "complete",
          final_prompt: instantDraft,
          summary: "Draft prompt ready. Based on your workflow step and brief."
        };
        state.awaitingReviewOptIn = false;
        state.awaitingFinalConfirmation = false;
        state.finalResult = state.pendingFinal;
        if (els.finalPrompt) els.finalPrompt.value = instantDraft;
        if (els.finalSummary) {
          els.finalSummary.textContent =
            "Draft prompt ready — you can use it as is or tweak it.";
          els.finalSummary.classList.remove("empty");
        }
        if (els.saveToLibraryBtn) {
          els.saveToLibraryBtn.disabled = false;
        }
        els.sessionStatus.textContent = "Workflow step draft ready";
        els.sessionStatus.className = "badge badge-success";
        els.followUpAnswer.disabled = true;
        els.sendFollowUpBtn.disabled = true;
        els.finishRefinementBtn.disabled = true;
        appendMessage(
          "assistant",
          "Draft prompt ready. This step already has a usable draft, so no extra refinement is needed unless you want to adjust it."
        );
        return;
      }
    }

    var beginRefinement = function (domainContextText) {
      var finalUserContent = combinedUserContent;
      if (domainContextText) {
        finalUserContent += "\n\nDomain and platform context:\n" + domainContextText;
      }
      // Clear conversation state, but keep the brief/model selections.
      resetConversationState();

      var systemMessage = { role: "system", content: SYSTEM_PROMPT };
      var userMessage = { role: "user", content: finalUserContent };
      state.messages = [systemMessage, userMessage];
      state.sessionActive = true;
      els.sessionStatus.textContent = "Waiting for assistant…";
      els.sessionStatus.className = "badge badge-success";
      renderConversation();

      els.followUpAnswer.disabled = true;
      els.sendFollowUpBtn.disabled = true;
      els.finishRefinementBtn.disabled = false;

      callOpenAI(false).catch(function (err) {
        showToast(err.message || "Error calling OpenAI API.", "error");
      });
    };

    // Keep standalone Prompt Studio refinement concise.
    // Domain/platform context injection is retained only for workflow-step prompt mode,
    // where step-scoped policy and artefact naming conventions are relevant.
    var shouldInjectDomainContext = !!state.promptFactoryWorkflowContext;
    var contextApi =
      shouldInjectDomainContext &&
      window.WorkflowGenerationContext &&
      typeof window.WorkflowGenerationContext.buildPromptRefinementContext === "function"
        ? window.WorkflowGenerationContext
        : null;
    if (!contextApi) {
      beginRefinement("");
      return;
    }

    contextApi
      .buildPromptRefinementContext({
        selectedDomains: state.workflowSelectedDomains || ["general"],
        promptTask: state.promptFactoryWorkflowContext
          ? "Workflow step prompt refinement. Apply domain prompt rules and artefact naming conventions."
          : combinedUserContent,
        leanMode: !!state.promptFactoryWorkflowContext
      })
      .then(function (ctx) {
        beginRefinement(ctx && ctx.promptContext ? ctx.promptContext : "");
      })
      .catch(function () {
        // Fallback to no file-driven context if loading fails.
        beginRefinement("");
      });
  }

  function handleSendFollowUp() {
    if (!hasActiveRefinementSession()) return;
    var answer = (els.followUpAnswer.value || "").trim();
    if (!answer) {
      showToast("Please type an answer first.", "error");
      return;
    }

    // Lifecycle branch: candidate exists and we're waiting for final user confirmation.
    if (state.awaitingFinalConfirmation && hasPendingFinalCandidate()) {
      var lower = answer.toLowerCase();
      var isNo =
        lower === "no" ||
        lower === "nope" ||
        lower === "nothing" ||
        lower === "that's all" ||
        lower === "thats all" ||
        lower === "all good" ||
        lower === "looks good" ||
        lower === "good" ||
        lower === "done";

      els.followUpAnswer.value = "";

      if (isNo) {
        // User accepted the proposed final prompt.
        finalizeFromPending(state.pendingFinal);
        return;
      }

      // User provided extra details; continue refinement with a final JSON request.
      els.followUpAnswer.disabled = true;
      els.sendFollowUpBtn.disabled = true;
      appendMessage("user", answer);
      state.awaitingFinalConfirmation = false;
      state.pendingFinal = null;
      els.sessionStatus.textContent = "Waiting for assistant…";
      els.sessionStatus.className = "badge badge-success";

      callOpenAI(true).catch(function (err) {
        showToast(err.message || "Error calling OpenAI API.", "error");
      });
      return;
    }

    // Lifecycle branch: candidate exists and we're waiting for review opt-in.
    // If we're waiting to know whether the user wants to run a review step,
    // interpret this as a yes/no answer.
    if (state.awaitingReviewOptIn && hasPendingFinalCandidate()) {
      var ans = answer.toLowerCase();
      var wantsReview = !(
        ans === "no" ||
        ans === "nope" ||
        ans === "skip" ||
        ans === "skip review"
      );

      els.followUpAnswer.value = "";
      state.awaitingReviewOptIn = false;

      if (wantsReview) {
        // Proceed to reviewer phase using the draft result.
        runPromptReview(state.pendingFinal);
        return;
      }

      // Skip review: go straight to final confirmation using the draft.
      appendMessage(
        "reviewer",
        "Skipping additional review. A complete final prompt is shown below. " +
          "If you'd still like to adjust anything, you can type more details, or reply with \"no\" to finalize."
      );
      state.awaitingFinalConfirmation = true;
      els.sessionStatus.textContent = "Review the proposed final prompt…";
      els.sessionStatus.className = "badge badge-success";
      els.followUpAnswer.disabled = false;
      els.sendFollowUpBtn.disabled = false;
      els.finishRefinementBtn.disabled = false;
      els.followUpAnswer.focus();
      return;
    }

    // Lifecycle branch: reviewer Q&A phase (state.reviewQuestions queue may continue).
    // If we're waiting for the user's response to reviewer suggestions,
    // treat this answer as additional detail to feed into a final JSON request.
    if (state.awaitingReviewAnswer) {
      var reviewHelpIntent = isWorkflowOptionHelpIntent(answer) || /^(i\s+don'?t\s+know|dont\s+know|not\s+sure|unsure)$/i.test(answer);
      var reviewRecommendIntent = isRecommendIntent(answer);
      if (reviewHelpIntent || reviewRecommendIntent) {
        var currentReviewerQuestion = "";
        for (var qi = state.messages.length - 1; qi >= 0; qi -= 1) {
          var msg = state.messages[qi];
          if (msg && msg.role === "reviewer" && String(msg.content || "").trim()) {
            currentReviewerQuestion = String(msg.content || "").trim();
            break;
          }
        }
        if (reviewRecommendIntent) {
          appendMessage(
            "assistant",
            "Recommended default: keep the current draft/domain defaults for this point and continue. Reply 'yes' to use that, or provide a specific preference.\n\nCurrent question:\n" +
              (currentReviewerQuestion || "Please answer the current question in your own words.")
          );
          return;
        }
        appendMessage(
          "assistant",
          "You can answer briefly in plain language. If you have no preference, reply 'recommend' and I will suggest a default.\n\nCurrent question:\n" +
            (currentReviewerQuestion || "Please answer the current question in your own words.")
        );
        return;
      }
      els.followUpAnswer.value = "";
      appendMessage("user", answer);

      // If there are more reviewer questions queued, ask the next one.
      if (state.reviewQuestions && state.reviewQuestions.length) {
        var nextQ = state.reviewQuestions.shift();
        appendMessage("reviewer", nextQ);
        els.followUpAnswer.disabled = false;
        els.sendFollowUpBtn.disabled = false;
        els.finishRefinementBtn.disabled = false;
        els.followUpAnswer.focus();
        return;
      }

      // No more reviewer questions: run a final completion request.
      els.followUpAnswer.disabled = true;
      els.sendFollowUpBtn.disabled = true;
      state.awaitingReviewAnswer = false;
      state.fromReview = true;
      els.sessionStatus.textContent = "Waiting for assistant…";
      els.sessionStatus.className = "badge badge-success";

      callOpenAI(true).catch(function (err) {
        showToast(err.message || "Error calling OpenAI API.", "error");
      });
      return;
    }

    els.followUpAnswer.value = "";
    els.followUpAnswer.disabled = true;
    els.sendFollowUpBtn.disabled = true;

    appendMessage("user", answer);
    els.sessionStatus.textContent = "Waiting for assistant…";
    els.sessionStatus.className = "badge badge-success";
    callOpenAI(false).catch(function (err) {
      showToast(err.message || "Error calling OpenAI API.", "error");
    });
  }

  function handleFinishRefinement() {
    if (!hasActiveRefinementSession()) {
      showToast("Start a refinement conversation first.", "error");
      return;
    }
    // Let the assistant know we consider the brief complete.
    var finalInstruction =
      "I am satisfied with the information provided so far. Using everything in this conversation, please now stop asking questions and return ONLY the JSON object described in the system prompt.";
    appendMessage("user", finalInstruction);

    els.followUpAnswer.disabled = true;
    els.sendFollowUpBtn.disabled = true;
    els.finishRefinementBtn.disabled = true;
    els.sessionStatus.textContent = "Generating final prompt…";
    els.sessionStatus.className = "badge badge-success";

    callOpenAI(true).catch(function (err) {
      showToast(err.message || "Error calling OpenAI API.", "error");
      // Allow the user to continue the conversation if finalization failed.
      els.finishRefinementBtn.disabled = false;
      els.followUpAnswer.disabled = false;
      els.sendFollowUpBtn.disabled = false;
    });
  }

  /**
   * Invoke OpenAI Chat Completions API for the current message history.
   * Handles both follow-up questions (isFinal = false) and completion JSON (isFinal = true).
   */
  function callOpenAI(isFinal) {
    var apiKey = state.apiKey;
    if (!apiKey) {
      return Promise.reject(new Error("API key not loaded"));
    }
    var model = getSelectedModelId();
    var temperature = getTemperatureFromCreativity();
    var maxTokens = getRefinementMaxOutputTokens(isFinal);

    // Build Responses API input from our conversation state.
    // Map any internal "reviewer" role we use for UI purposes back to "assistant"
    // so that the API only ever sees supported roles.
    var input = state.messages.map(function (m) {
      var apiRole = m.role === "reviewer" ? "assistant" : m.role;
      return { role: apiRole, content: m.content };
    });

    var body = {
      model: model,
      input: input,
      max_output_tokens: maxTokens
    };

    body.temperature = temperature;

    debugOpenAI(
      "Calling Responses API with model='" +
        model +
        "', creativity='" +
        getCreativityPreset() +
        "', detail='" +
        getResponseDetailPreset() +
        "'"
    );

    return fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey
      },
      body: JSON.stringify(body)
    })
      .then(function (res) {
        if (!res.ok) {
          return res.json().catch(function () {
            return {};
          }).then(function (errBody) {
            var msg = "Request failed";
            if (errBody && errBody.error && errBody.error.message) {
              msg = mapOpenAIError(errBody.error.message, res.status);
            } else {
              msg = "OpenAI responded with status " + res.status;
            }
            throw new Error(msg);
          });
        }
        return res.json();
      })
      .then(function (data) {
        if (data && data.usage) {
          // Map Responses usage into the shape our tracker expects.
          var usage = {
            prompt_tokens: data.usage.input_tokens,
            completion_tokens: data.usage.output_tokens,
            total_tokens: data.usage.total_tokens
          };
          updateTokenUsage(usage, model);
        }
        if (
          !data ||
          !Array.isArray(data.output) ||
          !data.output[0] ||
          !data.output[0].content ||
          !data.output[0].content[0] ||
          typeof data.output[0].content[0].text !== "string"
        ) {
          throw new Error("Unexpected OpenAI response format.");
        }
        var content = String(data.output[0].content[0].text || "").trim();

        // Try to interpret any assistant message as a potential completion JSON.
        var parsed = tryParseCompletionJson(content);
        if (parsed && parsed.status === "complete") {
          var previousValidPrompt =
            (state.pendingFinal && state.pendingFinal.final_prompt) ||
            (state.finalResult && state.finalResult.final_prompt) ||
            (state.promptVersions &&
              ((state.promptVersions.refined && state.promptVersions.refined.prompt) ||
                (state.promptVersions.draft && state.promptVersions.draft.prompt))) ||
            (els.finalPrompt && els.finalPrompt.value) ||
            (els.initialPrompt && els.initialPrompt.value) ||
            "";
          var sanitizedRefinement = sanitizeRefinedPromptPayload(parsed, previousValidPrompt);
          if (!sanitizedRefinement.ok) {
            try {
              console.warn("[PRISM] Rejected malformed refinement payload", {
                reason: sanitizedRefinement.reason,
                previousLength: String(previousValidPrompt || "").length
              });
            } catch (_e0) {}
            showToast(
              "Refinement output looked malformed (" +
                sanitizedRefinement.reason +
                "). Keeping the previous prompt.",
              "warning"
            );
            if (isFinal) {
              els.sessionStatus.textContent =
                "Refinement output was malformed. Previous prompt retained.";
              els.sessionStatus.className = "badge badge-warning";
              els.finishRefinementBtn.disabled = false;
              els.followUpAnswer.disabled = false;
              els.sendFollowUpBtn.disabled = false;
            }
            return;
          }
          parsed = sanitizedRefinement.parsed;
          if (isFinal) {
            // If this completion comes from the reviewer phase, treat it as a new draft
            // and ask the user for a final "anything else?" confirmation instead of
            // immediately finalizing.
            if (state.fromReview) {
              state.fromReview = false;

              // Store refined version and switch selection to refined.
              state.promptVersions = state.promptVersions || {};
              state.promptVersions.refined = {
                prompt: parsed.final_prompt || "",
                summary: parsed.summary || ""
              };
              state.selectedPromptVersion = "refined";
              updatePromptVersionUI();

              state.awaitingFinalConfirmation = true;
              els.saveToLibraryBtn.disabled = true;

              appendMessage(
                "reviewer",
                "I've updated the prompt based on your answers. A revised final prompt is shown below. " +
                  "Is there anything else you’d like to change or add? If not, you can reply with \"no\" and we'll finalize this prompt."
              );

              els.sessionStatus.textContent = "Review the proposed final prompt…";
              els.sessionStatus.className = "badge badge-success";
              els.followUpAnswer.disabled = false;
              els.sendFollowUpBtn.disabled = false;
              els.finishRefinementBtn.disabled = false;
              els.followUpAnswer.focus();
              return;
            }

            finalizeFromPending(parsed);
            return;
          }

          // The refinement agent believes it has enough information and is returning
          // a draft final prompt.
          state.promptVersions = {
            draft: {
              prompt: parsed.final_prompt || "",
              summary: parsed.summary || ""
            }
          };
          state.selectedPromptVersion = "draft";
          updatePromptVersionUI();

          els.saveToLibraryBtn.disabled = true;

          state.pendingFinal = {
            status: "complete",
            final_prompt: parsed.final_prompt || "",
            summary: parsed.summary || ""
          };
          if (isWorkflowStepLowFrictionMode()) {
            state.awaitingReviewOptIn = false;
            state.awaitingFinalConfirmation = false;
            state.finalResult = state.pendingFinal;
            if (els.saveToLibraryBtn) {
              els.saveToLibraryBtn.disabled = false;
            }
            appendMessage(
              "assistant",
              "Generated a workflow-step draft prompt. You can tweak it and save."
            );
            els.sessionStatus.textContent = "Workflow step draft ready";
            els.sessionStatus.className = "badge badge-success";
            els.followUpAnswer.disabled = true;
            els.sendFollowUpBtn.disabled = true;
            els.finishRefinementBtn.disabled = true;
            return;
          }
          state.awaitingReviewOptIn = true;

          appendMessage(
            "assistant",
            "I now have enough information to construct a complete prompt, and a draft is shown below. " +
              "Would you like me to run an additional review step to look for further improvements? (yes/no)"
          );

          els.sessionStatus.textContent = "Decide whether to run review…";
          els.sessionStatus.className = "badge badge-success";
          els.followUpAnswer.disabled = false;
          els.sendFollowUpBtn.disabled = false;
          els.finishRefinementBtn.disabled = false;
          els.followUpAnswer.focus();
          return;
        }

        if (isFinal) {
          // Assistant did not follow finalization instructions; show raw content and keep session open.
          appendMessage("assistant", content);
          els.sessionStatus.textContent =
            "Assistant did not return valid JSON. You can adjust your answers and try Finish again.";
          els.sessionStatus.className = "badge badge-danger";
          els.finishRefinementBtn.disabled = false;
          els.followUpAnswer.disabled = false;
          els.sendFollowUpBtn.disabled = false;
          return;
        }

        // Question / answer mode: continue conversation with follow-up question.
        state.sessionActive = true;
        appendMessage("assistant", content);

        els.followUpAnswer.disabled = false;
        els.sendFollowUpBtn.disabled = false;
        els.finishRefinementBtn.disabled = false;
        els.followUpAnswer.focus();
        els.sessionStatus.textContent = "Awaiting your answer…";
        els.sessionStatus.className = "badge badge-success";
      });
  }

  // -----------------------------
  // Prompt Studio <-> Prompt Library boundary operations
  // -----------------------------

  function callOpenAIForWorkflowDesign(promptContext, hints) {
    var apiKey = state.apiKey;
    if (!apiKey) {
      return Promise.reject(new Error("API key not loaded"));
    }
    var model = getSelectedModelId();
    var temperature = getTemperatureFromCreativity();
    var maxTokens = getWorkflowDesignMaxOutputTokens();
    var maxWorkflowDesignRetryTokens = 7000;
    var hintsObj = hints && typeof hints === "object" ? hints : {};
    var resolvedFactors = hintsObj.resolvedBriefFactors && typeof hintsObj.resolvedBriefFactors === "object"
      ? hintsObj.resolvedBriefFactors
      : {};
    var designScope = String(resolvedFactors.design_scope || "").toLowerCase();
    var responseDetailPreset = String(getResponseDetailPreset() || "").toLowerCase();
    var preferCompactByDefault = true;

    function buildWorkflowCompactDirective(mode) {
      var compactMode = mode === "compact";
      var lines = [];
      lines.push("Output mode: " + (compactMode ? "compact" : "standard") + ".");
      lines.push("Return only the required JSON object and no extra text.");
      lines.push("Keep step titles canonical and concise.");
      lines.push("Keep each role value under 8 words.");
      lines.push("Keep summary to one short sentence.");
      if (designScope === "single_activity") {
        lines.push("Scope is single_activity: return the smallest valid workflow.");
        lines.push("Do not include broader session/sequence/module framing.");
      }
      lines.push("Keep JSON compact: short strings, no commentary fields, no repeated rationale.");
      return lines.join("\n");
    }

    function requestWorkflowDesign(tokens, mode, isRetry) {
      var input = [
        { role: "system", content: WORKFLOW_DESIGN_SYSTEM_PROMPT },
        {
          role: "user",
          content: String(promptContext || "") + "\n\n" + buildWorkflowCompactDirective(mode)
        }
      ];
      var body = {
        model: model,
        input: input,
        max_output_tokens: tokens
      };
      body.temperature = temperature;
      debugOpenAI(
        "Calling Workflow Design with model='" +
          model +
          "', creativity='" +
          getCreativityPreset() +
          "', detail='" +
          getResponseDetailPreset() +
          "', mode='" +
          mode +
          "', max_output_tokens=" +
          tokens +
          (isRetry ? " (retry)" : "")
      );
      return fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + apiKey
        },
        body: JSON.stringify(body)
      });
    }

    function requestJson(tokens, mode, isRetry) {
      return requestWorkflowDesign(tokens, mode, isRetry)
        .then(function (res) {
          if (!res.ok) {
            return res.json().catch(function () {
              return {};
            }).then(function (errBody) {
              var msg = "Request failed";
              if (errBody && errBody.error && errBody.error.message) {
                msg = mapOpenAIError(errBody.error.message, res.status);
              } else {
                msg = "OpenAI responded with status " + res.status;
              }
              throw new Error(msg);
            });
          }
          return res.json();
        });
    }

    function repairWorkflowJsonFromRaw(rawText) {
      var raw = String(rawText || "").trim();
      if (!raw) return Promise.resolve(null);
      var repairBody = {
        model: model,
        input: [
          {
            role: "system",
            content:
              "You repair malformed workflow JSON. Return ONLY valid JSON. " +
              'Required shape: {"status":"complete","summary":"string","steps":[{"title":"string","role":"string"}]}. ' +
              "Do not add markdown, comments, or prose."
          },
          {
            role: "user",
            content:
              "Repair this into valid JSON with the required shape:\n\n" + raw
          }
        ],
        max_output_tokens: 1200,
        temperature: 0
      };
      return fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + apiKey
        },
        body: JSON.stringify(repairBody)
      })
        .then(function (res) {
          if (!res.ok) return null;
          return res.json().catch(function () { return null; });
        })
        .then(function (repairData) {
          if (!repairData) return null;
          if (repairData && repairData.usage) {
            var wfRepairUsage = {
              prompt_tokens: repairData.usage.input_tokens,
              completion_tokens: repairData.usage.output_tokens,
              total_tokens: repairData.usage.total_tokens
            };
            updateTokenUsage(wfRepairUsage, model);
          }
          var repairedText = extractResponsesText(repairData);
          var parsed = tryParseWorkflowDesignJson(repairedText);
          if (
            !parsed ||
            parsed.status !== "complete" ||
            !Array.isArray(parsed.steps)
          ) {
            return null;
          }
          return parsed;
        })
        .catch(function () {
          return null;
        });
    }

    function isTokenLimitIncomplete(data) {
      return !!(
        data &&
        data.status === "incomplete" &&
        data.incomplete_details &&
        data.incomplete_details.reason === "max_output_tokens"
      );
    }

    function requestWithRetryPlan() {
      var initialMode = preferCompactByDefault ? "compact" : "standard";
      var steps = [
        { tokens: maxTokens, mode: initialMode, retry: false }
      ];
      if (initialMode !== "compact") {
        // First retry strategy: compact response mode at same budget.
        steps.push({ tokens: maxTokens, mode: "compact", retry: true });
      }
      var retryTokens = Math.min(
        Math.max(maxTokens + 1200, Math.round(maxTokens * 1.8)),
        maxWorkflowDesignRetryTokens
      );
      if (retryTokens > maxTokens) {
        // Second retry strategy: compact mode with larger token budget.
        steps.push({ tokens: retryTokens, mode: "compact", retry: true });
      }
      var chain = Promise.resolve(null);
      steps.forEach(function (step) {
        chain = chain.then(function (prevData) {
          if (prevData && !isTokenLimitIncomplete(prevData)) return prevData;
          return requestJson(step.tokens, step.mode, step.retry);
        });
      });
      return chain.then(function (data) {
        if (isTokenLimitIncomplete(data)) {
          throw new Error(
            "The model hit its output token limit before finishing the workflow design. Try a shorter brief or focused scope."
          );
        }
        return data;
      });
    }

    function parseWorkflowDesignFromData(data) {
      var content = extractResponsesText(data);
      var parsed = tryParseWorkflowDesignJson(content);
      if (
        !parsed ||
        parsed.status !== "complete" ||
        !Array.isArray(parsed.steps)
      ) {
        return null;
      }
      return parsed;
    }

    return requestWithRetryPlan()
      .then(function (data) {
        // Track token usage for Workflow Factory design calls, same as prompt refinement.
        if (data && data.usage) {
          var wfUsage = {
            prompt_tokens: data.usage.input_tokens,
            completion_tokens: data.usage.output_tokens,
            total_tokens: data.usage.total_tokens
          };
          updateTokenUsage(wfUsage, model);
        }

        try {
          console.log("[PRISM][Workflow Design raw response]", data);
        } catch (e) {}
        return data;
      })
      .then(function (data) {
        var parsed = parseWorkflowDesignFromData(data);
        logWorkflowTrace("[PRISM][Trace][ModelParse]", {
          rawModelStepsCount: Array.isArray(parsed && parsed.steps) ? parsed.steps.length : 0,
          rawGeneratedStepIds: getGeneratedWorkflowStepIds(parsed)
        });
        if (parsed) return parsed;
        // Recovery path: repair malformed JSON from returned text (cheap, deterministic).
        var rawText = extractResponsesText(data);
        return repairWorkflowJsonFromRaw(rawText).then(function (repaired) {
          if (!repaired) {
            throw new Error("The assistant returned malformed workflow JSON. Please rerun; compact recovery failed.");
          }
          return repaired;
        });
      })
      .then(function (parsed) {
        parsed = applyWorkflowDesignHeuristics(parsed, hints);
        logWorkflowTrace("[PRISM][Trace][PostHeuristics]", {
          stepsAfterHeuristicsCount: Array.isArray(parsed && parsed.steps) ? parsed.steps.length : 0,
          generatedStepIdsAfterHeuristics: getGeneratedWorkflowStepIds(parsed)
        });
        // Store versions so users can compare draft vs refined, like prompt versions.
        state.workflowDesignVersions = {
          draft: JSON.parse(JSON.stringify(parsed)),
          refined: JSON.parse(JSON.stringify(parsed))
        };
        state.workflowSelectedVersion = "draft";
        state.workflowDesignResult = parsed; // backward compat
        renderWorkflowDesignResult({ promptRefine: false });
        // IMPORTANT: return parsed design so post-generation queueing receives
        // the finalized, heuristics-applied step list.
        return parsed;
      });
  }

  function tryParseWorkflowReviewJson(text) {
    if (!text) return null;
    var trimmed = String(text).trim();
    if (trimmed.startsWith("```")) {
      var start = trimmed.indexOf("{");
      var end = trimmed.lastIndexOf("}");
      if (start !== -1 && end !== -1 && end > start) {
        trimmed = trimmed.slice(start, end + 1);
      }
    }
    try {
      return JSON.parse(trimmed);
    } catch (e) {
      var s = trimmed.indexOf("{");
      var eIdx = trimmed.lastIndexOf("}");
      if (s !== -1 && eIdx !== -1 && eIdx > s) {
        var candidate = trimmed.slice(s, eIdx + 1);
        try {
          return JSON.parse(candidate);
        } catch (e2) {
          return null;
        }
      }
      return null;
    }
  }

  function callOpenAIForWorkflowReview(design) {
    var apiKey = state.apiKey;
    if (!apiKey) {
      return Promise.reject(new Error("API key not loaded"));
    }
    if (!design || !Array.isArray(design.steps)) {
      return Promise.reject(new Error("Design a workflow first."));
    }

    var model = getSelectedModelId();
    var temperature = getTemperatureFromCreativity();
    var maxTokens = getWorkflowReviewMaxOutputTokens();

    var reviewerPrompt =
      "You are reviewing an existing workflow.\n\n" +
      "The workflow is provided as JSON with a summary and steps.\n" +
      "Each step has a 1-based index in the array order.\n\n" +
      "Your job is to suggest only high-value improvements, such as:\n" +
      "- Adding explicit review/refine/QA steps after major generation steps.\n" +
      "- Adding missing steps that significantly improve clarity or robustness.\n" +
      "- Avoiding unnecessary bloat.\n\n" +
      "Respond with JSON ONLY, of the form:\n" +
      "{\n" +
      '  \"status\": \"review\",\n' +
      '  \"proposed_changes\": [\n' +
      "    {\n" +
      '      \"description\": \"Short description of the change.\",\n' +
      '      \"after_step\": 3,\n' +
      "      \"step\": { \"title\": \"New step title\", \"role\": \"Optional role\", \"depends_on\": [3] }\n" +
      "    }\n" +
      "  ]\n" +
      "}\n\n" +
      "If you have no suggestions, return:\n" +
      "{ \"status\": \"review\", \"proposed_changes\": [] }";

    var input = [
      { role: "system", content: reviewerPrompt },
      { role: "user", content: JSON.stringify(design) }
    ];

    var body = {
      model: model,
      input: input,
      max_output_tokens: maxTokens
    };
    body.temperature = temperature;

    debugOpenAI(
      "Calling Workflow Review with model='" +
        model +
        "', creativity='" +
        getCreativityPreset() +
        "', detail='" +
        getResponseDetailPreset() +
        "'"
    );

    return fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey
      },
      body: JSON.stringify(body)
    })
      .then(function (res) {
        if (!res.ok) {
          return res
            .json()
            .catch(function () {
              return {};
            })
            .then(function (errBody) {
              var msg = "Request failed";
              if (errBody && errBody.error && errBody.error.message) {
                msg = mapOpenAIError(errBody.error.message, res.status);
              } else {
                msg = "OpenAI responded with status " + res.status;
              }
              throw new Error(msg);
            });
        }
        return res.json();
    })
      .then(function (data) {
        // Track token usage for Workflow Factory review calls as well.
        if (data && data.usage) {
          var wfReviewUsage = {
            prompt_tokens: data.usage.input_tokens,
            completion_tokens: data.usage.output_tokens,
            total_tokens: data.usage.total_tokens
          };
          updateTokenUsage(wfReviewUsage, model);
        }

        try {
          console.log("[PRISM][Workflow Review raw response]", data);
        } catch (e) {}

        if (
          data &&
          data.status === "incomplete" &&
          data.incomplete_details &&
          data.incomplete_details.reason === "max_output_tokens"
        ) {
          throw new Error(
            "The model hit its output token limit while reviewing the workflow. Try lowering max tokens or switching models."
          );
        }

        if (
          !data ||
          !Array.isArray(data.output) ||
          !data.output[0] ||
          !data.output[0].content ||
          !data.output[0].content[0] ||
          typeof data.output[0].content[0].text !== "string"
        ) {
          throw new Error("Unexpected OpenAI response format for review.");
        }

        var content = String(data.output[0].content[0].text || "").trim();
        var parsed = tryParseWorkflowReviewJson(content);
        if (
          !parsed ||
          parsed.status !== "review" ||
          !Array.isArray(parsed.proposed_changes)
        ) {
          throw new Error("The reviewer did not return valid review JSON.");
        }
        return parsed.proposed_changes;
      });
  }

  function finalizeFromPending(parsed) {
    if (!parsed) return;
    var safePrompt = decodeLikelyEscapedPromptText(parsed.final_prompt || "").trim();
    if (!safePrompt) {
      showToast("Final prompt was empty/malformed. Keeping previous prompt.", "warning");
      return;
    }
    state.sessionActive = false;
    // Runtime lifecycle reaches finalized state; keep finalResult for save/copy actions.
    state.finalResult = {
      status: "complete",
      final_prompt: safePrompt,
      summary: parsed.summary || ""
    };
    state.pendingFinal = null;
    state.awaitingFinalConfirmation = false;

    appendMessage("assistant", parsed.summary || "Completed.");

    els.finalPrompt.value = safePrompt;
    els.finalSummary.textContent = parsed.summary || "";
    els.finalSummary.classList.toggle(
      "empty",
      !parsed.summary || !parsed.summary.trim()
    );
    // Save button readiness derives from finalized prompt text presence.
    els.saveToLibraryBtn.disabled = !safePrompt;
    els.sessionStatus.textContent = "Complete";
    els.sessionStatus.className = "badge badge-success";
    els.followUpAnswer.disabled = true;
    els.sendFollowUpBtn.disabled = true;
    els.finishRefinementBtn.disabled = true;
  }

  function mapOpenAIError(message, status) {
    var lower = String(message || "").toLowerCase();
    if (status === 401 || lower.indexOf("api key") !== -1) {
      return "Authentication failed. Check that your API key is valid.";
    }
    if (status === 404 || lower.indexOf("model") !== -1) {
      return "Model not found. Ensure the selected model is available to your account.";
    }
    if (status === 429 || lower.indexOf("rate") !== -1) {
      return "Rate limit reached. Wait a moment and try again.";
    }
    if (status >= 500) {
      return "OpenAI service is currently unavailable. Try again in a bit.";
    }
    return message || "OpenAI returned an error.";
  }

  function tryParseCompletionJson(text) {
    if (!text) return null;
    var trimmed = text.trim();
    // If the assistant wrapped JSON in backticks, remove them.
    if (trimmed.startsWith("```")) {
      var fencedStart = trimmed.indexOf("{");
      var fencedEnd = trimmed.lastIndexOf("}");
      if (fencedStart !== -1 && fencedEnd !== -1 && fencedEnd > fencedStart) {
        trimmed = trimmed.slice(fencedStart, fencedEnd + 1);
      }
    }
    // First, try to parse the whole content as JSON.
    try {
      return JSON.parse(trimmed);
    } catch (e) {
      // If that fails, look for a JSON object embedded in surrounding text.
      var start = trimmed.indexOf("{");
      var end = trimmed.lastIndexOf("}");
      if (start !== -1 && end !== -1 && end > start) {
        var candidate = trimmed.slice(start, end + 1);
        try {
          return JSON.parse(candidate);
        } catch (e2) {
          return null;
        }
      }
      return tryParseCompletionJsonLoose(trimmed);
    }
  }

  function tryParseCompletionJsonLoose(text) {
    if (!text) return null;
    var source = String(text || "").trim();

    // If the assistant wrapped JSON in backticks, trim to the likely object region.
    if (source.startsWith("```")) {
      var fencedStart = source.indexOf("{");
      var fencedEnd = source.lastIndexOf("}");
      if (fencedStart !== -1 && fencedEnd !== -1 && fencedEnd > fencedStart) {
        source = source.slice(fencedStart, fencedEnd + 1);
      }
    }

    function readQuotedValue(src, startIdx) {
      if (!src || startIdx < 0 || startIdx >= src.length) return null;
      var quote = src[startIdx];
      if (quote !== '"' && quote !== "'") return null;
      var i = startIdx + 1;
      var out = "";
      var escaped = false;
      while (i < src.length) {
        var ch = src[i];
        if (escaped) {
          // Handle common escapes in JSON-ish output.
          if (ch === "n") out += "\n";
          else if (ch === "r") out += "\r";
          else if (ch === "t") out += "\t";
          else out += ch;
          escaped = false;
          i += 1;
          continue;
        }
        if (ch === "\\") {
          escaped = true;
          i += 1;
          continue;
        }
        if (ch === quote) {
          return { value: out, end: i + 1 };
        }
        out += ch;
        i += 1;
      }
      return null;
    }

    function extractField(src, key) {
      var re = new RegExp('["\\\']' + key + '["\\\']\\s*:\\s*', "i");
      var m = re.exec(src);
      if (!m) return "";
      var idx = m.index + m[0].length;
      while (idx < src.length && /\s/.test(src[idx])) idx += 1;
      var quoted = readQuotedValue(src, idx);
      if (quoted) return quoted.value;
      var nextComma = src.indexOf(",", idx);
      var nextBrace = src.indexOf("}", idx);
      var end = nextComma === -1 ? nextBrace : nextBrace === -1 ? nextComma : Math.min(nextComma, nextBrace);
      if (end === -1) end = src.length;
      return src.slice(idx, end).trim().replace(/^["']|["']$/g, "");
    }

    var status = extractField(source, "status").toLowerCase();
    if (status !== "complete") return null;
    var finalPrompt = extractField(source, "final_prompt");
    var summary = extractField(source, "summary");
    if (!finalPrompt) return null;
    return {
      status: "complete",
      final_prompt: finalPrompt,
      summary: summary || ""
    };
  }

  function decodeLikelyEscapedPromptText(rawPrompt) {
    var raw = String(rawPrompt == null ? "" : rawPrompt);
    var trimmed = raw.trim();
    if (!trimmed) return "";
    if (
      ((trimmed[0] === '"' && trimmed[trimmed.length - 1] === '"') ||
        (trimmed[0] === "'" && trimmed[trimmed.length - 1] === "'")) &&
      (/\\n|\\r|\\t|\\"/.test(trimmed))
    ) {
      try {
        var decoded = JSON.parse(trimmed);
        if (typeof decoded === "string") return decoded;
      } catch (_e) {}
    }
    if (/\\n|\\r|\\t|\\"/.test(trimmed) && !/\n/.test(trimmed)) {
      return trimmed
        .replace(/\\r\\n/g, "\n")
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "\n")
        .replace(/\\t/g, "\t")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\");
    }
    return raw;
  }

  function summarizePromptEdge(text) {
    var src = String(text || "");
    return {
      head: src.slice(0, 200),
      tail: src.slice(Math.max(0, src.length - 200))
    };
  }

  function sanitizeRefinedPromptPayload(parsed, previousPrompt) {
    var p = parsed && typeof parsed === "object" ? parsed : null;
    if (!p || String(p.status || "").toLowerCase() !== "complete") {
      return { ok: false, reason: "invalid_status", parsed: parsed };
    }
    var prev = String(previousPrompt || "");
    var raw = p.final_prompt == null ? "" : String(p.final_prompt);
    var normalized = decodeLikelyEscapedPromptText(raw);
    var trimmed = normalized.trim();
    var looksEscaped = /\\"/.test(trimmed) || (/\\n/.test(trimmed) && !/\n/.test(trimmed));
    var suspiciousShort =
      !!prev &&
      trimmed.length > 0 &&
      trimmed.length < Math.max(160, Math.floor(prev.length * 0.45));
    var trailingHalfSentence = /\b(?:to|for|with|and|or|the|a|an)\s*$/.test(trimmed.toLowerCase());
    var obviouslyCut = /your objective is to build a timed\s*$/i.test(trimmed);
    var malformed = !trimmed || looksEscaped || suspiciousShort || trailingHalfSentence || obviouslyCut;
    var result = {
      ok: !malformed,
      reason: malformed
        ? (looksEscaped
            ? "escaped_text"
            : suspiciousShort
            ? "suspiciously_short"
            : trailingHalfSentence || obviouslyCut
            ? "truncated_text"
            : "empty_prompt")
        : "",
      parsed: Object.assign({}, p, { final_prompt: trimmed }),
      diagnostics: {
        rawLength: raw.length,
        normalizedLength: trimmed.length,
        previousLength: prev.length,
        looksEscaped: looksEscaped,
        suspiciousShort: suspiciousShort,
        trailingHalfSentence: trailingHalfSentence || obviouslyCut,
        rawEdges: summarizePromptEdge(raw),
        normalizedEdges: summarizePromptEdge(trimmed)
      }
    };
    try {
      console.info("[PRISM] Refinement payload integrity", result.diagnostics);
    } catch (_e2) {}
    return result;
  }

  function runPromptReview(draftResult) {
    if (isWorkflowStepLowFrictionMode()) {
      state.awaitingReviewOptIn = false;
      state.awaitingReviewAnswer = false;
      state.reviewQuestions = [];
      state.fromReview = false;
      state.awaitingFinalConfirmation = true;
      appendMessage("assistant", "Draft prompt ready. No refinement needed.");
      if (els.sessionStatus) {
        els.sessionStatus.textContent = "Draft prompt ready";
        els.sessionStatus.className = "badge badge-success";
      }
      if (els.followUpAnswer) els.followUpAnswer.disabled = false;
      if (els.sendFollowUpBtn) els.sendFollowUpBtn.disabled = false;
      if (els.finishRefinementBtn) els.finishRefinementBtn.disabled = false;
      return;
    }
    var apiKey = state.apiKey;
    if (!apiKey) {
      showToast("API key is not loaded; skipping review step.", "error");
      return;
    }
    if (!draftResult || !draftResult.final_prompt) {
      showToast("No draft prompt available for review.", "error");
      return;
    }

    var model = getSelectedModelId();
    var temperature = getTemperatureFromCreativity();
    var maxTokens = getReviewMaxOutputTokens();

    // Build a compact representation of the brief and draft so the reviewer
    // can suggest targeted follow-up questions.
    var briefSummary = buildBriefSummaryForExternalTool();
    var parts = [];
    if (briefSummary) {
      parts.push("BRIEF:\n" + briefSummary);
    }
    if (draftResult.summary) {
      parts.push("DRAFT SUMMARY:\n" + draftResult.summary);
    }
    parts.push("DRAFT PROMPT:\n" + draftResult.final_prompt);
    var userContent = parts.join("\n\n");

    var body = {
      model: model,
      input: [
        { role: "system", content: REVIEW_SYSTEM_PROMPT },
        { role: "user", content: userContent }
      ],
      max_output_tokens: maxTokens
    };

    els.sessionStatus.textContent = "Reviewer is thinking…";
    els.sessionStatus.className = "badge badge-success";

    body.temperature = temperature;

    debugOpenAI(
      "Calling REVIEW with model='" +
        model +
        "', creativity='" +
        getCreativityPreset() +
        "', detail='" +
        getResponseDetailPreset() +
        "'"
    );

    function filterReviewerQuestions(lines) {
      var items = Array.isArray(lines) ? lines : [];
      if (!items.length) return [];
      var ctx = state.promptFactoryWorkflowContext || null;
      var cfg = normalizeWorkflowStepPromptConfig(ctx && ctx.stepPromptFactoryConfig);
      var hasScaffold = !!String((cfg && cfg.promptTemplate) || "").trim();
      var hasResolvedInputs =
        !!(ctx && Array.isArray(ctx.stepInputArtefacts) && ctx.stepInputArtefacts.length);
      var hasKnownAudience = !!String(
        (ctx &&
          ctx.workflowOutputSpec &&
          ctx.workflowOutputSpec.audience) ||
          (ctx && ctx.workflowGoalAudience) ||
          ""
      ).trim();
      var blockedPatterns = [
        /\bwhat sections?\b/i,
        /\bheadings?\b/i,
        /\btone\b/i,
        /\bstyle\b/i,
        /\bformat(?:ting)? preferences?\b/i,
        /\bambigu(?:ity|ous)\b/i,
        /\bprovide an example\b/i,
        /\bprovide (?:a )?template\b/i,
        /\bexact (?:format|structure|content)\b.*\bartefact\b/i,
        /\bwhat types of content\b/i,
        /\bmissing|incomplete information\b/i,
        /\bhow should .*handled\b/i,
        /\bhallucinat|assum(?:e|ption)|uncertain input\b/i,
        /\bconstraints?\b.*\bprohibited elements?\b/i,
        /\bprohibited elements?\b/i,
        /\brobust(?:ness)?\b/i,
        /\bsafety policy\b/i,
        /\bexact content of\b.*\bartefact\b/i,
        /\binput artefact content\b/i,
        /\bupstream artefact format\b/i,
        /\bhow .*should be structured\b/i
      ];
      function isLowValuePromptHygieneQuestion(q) {
        var text = String(q || "").trim();
        if (!text) return true;
        var lower = text.toLowerCase();
        if (
          /\bmissing\b|\bincomplete\b|\bambiguous\b|\buncertain\b/.test(lower) &&
          /\bhandle|handling|assume|assumption|fallback|default\b/.test(lower)
        ) {
          return true;
        }
        if (
          /\bconstraints?\b|\bprohibited\b|\bforbidden\b|\bdisallow\b/.test(lower) &&
          !/\blearner|activity|assessment|pedagog|outcome|material|difficulty|coverage\b/.test(lower)
        ) {
          return true;
        }
        if (
          /\bformat|tone|style|sections?|headings?\b/.test(lower) &&
          cfg &&
          String(cfg.configurationMode || "").toLowerCase() === "none" &&
          hasScaffold
        ) {
          return true;
        }
        if (
          /\baudience\b/.test(lower) &&
          hasKnownAudience
        ) {
          return true;
        }
        return false;
      }
      function isCompoundQuestion(q) {
        var s = String(q || "").trim();
        if (!s) return true;
        if ((s.match(/\?/g) || []).length > 1) return true;
        var lower = s.toLowerCase();
        var separators = 0;
        [/\band\b/g, /\bor\b/g, /,/g, /;/g].forEach(function (re) {
          var m = lower.match(re);
          if (m) separators += m.length;
        });
        return separators >= 3;
      }
      return items.filter(function (q) {
        var text = String(q || "").trim();
        if (!text) return false;
        if (isCompoundQuestion(text)) return false;
        if (isLowValuePromptHygieneQuestion(text)) return false;
        if (blockedPatterns.some(function (re) { return re.test(text); })) return false;
        if (
          cfg &&
          String(cfg.configurationMode || "").toLowerCase() === "none" &&
          hasScaffold &&
          hasResolvedInputs
        ) {
          return false;
        }
        return true;
      });
    }

    fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey
      },
      body: JSON.stringify(body)
    })
      .then(function (res) {
        if (!res.ok) {
          return res
            .json()
            .catch(function () {
              return {};
            })
            .then(function (errBody) {
              var msg = "Request failed";
              if (errBody && errBody.error && errBody.error.message) {
                msg = mapOpenAIError(errBody.error.message, res.status);
              } else {
                msg = "OpenAI responded with status " + res.status;
              }
              throw new Error(msg);
            });
        }
        return res.json();
      })
      .then(function (data) {
        if (data && data.usage) {
          var usage = {
            prompt_tokens: data.usage.input_tokens,
            completion_tokens: data.usage.output_tokens,
            total_tokens: data.usage.total_tokens
          };
          updateTokenUsage(usage, model);
        }
        if (
          !data ||
          !Array.isArray(data.output) ||
          !data.output[0] ||
          !data.output[0].content ||
          !data.output[0].content[0] ||
          typeof data.output[0].content[0].text !== "string"
        ) {
          throw new Error("Unexpected OpenAI review response format.");
        }
        var text = String(data.output[0].content[0].text || "").trim();

        if (text === "NO_FURTHER_QUESTIONS") {
          // Go straight to final confirmation using the draft result.
          state.pendingFinal = draftResult;
          state.awaitingFinalConfirmation = true;

          appendMessage(
            "reviewer",
            "My review suggests no further questions are needed. A complete final prompt is shown below. " +
              "If you'd still like to adjust anything, you can type more details, or reply with \"no\" to finalize."
          );

          els.sessionStatus.textContent = "Review the proposed final prompt…";
          els.sessionStatus.className = "badge badge-success";
          els.followUpAnswer.disabled = false;
          els.sendFollowUpBtn.disabled = false;
          els.finishRefinementBtn.disabled = false;
          els.followUpAnswer.focus();
          return;
        }

        // Otherwise, treat the reviewer's response as a set of follow-up
        // questions (one per line), and ask them one at a time.
        var lines = text.split(/\r?\n/).map(function (l) {
          return l.trim();
        }).filter(function (l) {
          return l.length > 0;
        });
        state.reviewQuestions = filterReviewerQuestions(lines);

        if (!state.reviewQuestions.length) {
          // Nothing usable came back; fall back to draft.
          state.pendingFinal = draftResult;
          state.awaitingFinalConfirmation = true;
          appendMessage(
            "reviewer",
            "The review step did not return any clear questions. A complete final prompt is shown below. " +
              "If you'd like to adjust anything, type more details, or reply with \"no\" to finalize."
          );

          els.sessionStatus.textContent = "Review the proposed final prompt…";
          els.sessionStatus.className = "badge badge-success";
          els.followUpAnswer.disabled = false;
          els.sendFollowUpBtn.disabled = false;
          els.finishRefinementBtn.disabled = false;
          els.followUpAnswer.focus();
          return;
        }

        var firstQ = state.reviewQuestions.shift();
        appendMessage("reviewer", firstQ);

        state.awaitingReviewAnswer = true;
        els.sessionStatus.textContent = "Answer the reviewer’s suggestions…";
        els.sessionStatus.className = "badge badge-success";
        els.followUpAnswer.disabled = false;
        els.sendFollowUpBtn.disabled = false;
        els.finishRefinementBtn.disabled = false;
        els.followUpAnswer.focus();
      })
      .catch(function (err) {
        showToast(err.message || "Review step failed.", "error");
        // If review fails, fall back to treating the draft as final for confirmation.
        state.pendingFinal = draftResult;
        state.awaitingFinalConfirmation = true;

        appendMessage(
          "reviewer",
          "The automatic review step failed, so I'm showing the draft final prompt. " +
            "Review it below and reply with any changes, or reply with \"no\" to finalize."
        );

        els.sessionStatus.textContent = "Review the proposed final prompt…";
        els.sessionStatus.className = "badge badge-danger";
        els.followUpAnswer.disabled = false;
        els.sendFollowUpBtn.disabled = false;
        els.finishRefinementBtn.disabled = false;
        els.followUpAnswer.focus();
      });
  }

  // -----------------------------
  // Prompt library UI behaviour
  // -----------------------------

  function loadLibrary() {
    // Canonical durable prompt-asset hydration into app state.
    // UI list/detail are re-derived from state.prompts/state.selectedPromptId.
    if (!window.Library || !window.Library.getAllPrompts) {
      return Promise.resolve();
    }
    return window.Library.getAllPrompts().then(function (prompts) {
      state.prompts = Array.isArray(prompts) ? prompts : [];
      renderLibraryList();
      if (state.selectedPromptId) {
        selectPrompt(state.selectedPromptId);
      } else if (state.prompts.length) {
        selectPrompt(state.prompts[0].id);
      } else {
        clearDetailForm();
      }
    });
  }

  function getActiveFilters() {
    // Derived UI-only projection state (not canonical/durable prompt-asset state).
    var tagInput = (els.tagFilter.value || "").trim();
    var tagList = tagInput
      ? tagInput.split(",").map(function (t) {
          return t.trim().toLowerCase();
        }).filter(Boolean)
      : [];
    return {
      query: (els.librarySearch.value || "").trim().toLowerCase(),
      tag: tagList,
      workflowId: String((els.libraryWorkflowFilter && els.libraryWorkflowFilter.value) || "").trim(),
      sort: els.sortSelect.value || "updatedDesc"
    };
  }

  function renderLibraryWorkflowFilterOptions() {
    if (!els.libraryWorkflowFilter) return;
    var select = els.libraryWorkflowFilter;
    var previous = String(select.value || "");
    var workflows = (Array.isArray(state.workflows) ? state.workflows : []).slice();
    workflows.sort(function (a, b) {
      return String((a && a.name) || "").localeCompare(String((b && b.name) || ""));
    });
    select.innerHTML = "";
    var all = document.createElement("option");
    all.value = "";
    all.textContent = "All workflows";
    select.appendChild(all);
    workflows.forEach(function (wf) {
      if (!wf || !wf.id) return;
      var option = document.createElement("option");
      option.value = String(wf.id);
      option.textContent = String(wf.name || "Untitled workflow");
      select.appendChild(option);
    });
    var exists = workflows.some(function (wf) {
      return String((wf && wf.id) || "") === previous;
    });
    select.value = exists ? previous : "";
  }

  function buildPromptIdSetForWorkflow(workflowId) {
    var set = {};
    var targetId = String(workflowId || "").trim();
    if (!targetId) return set;
    var wf = findWorkflowById(targetId);
    if (!wf || !Array.isArray(wf.steps)) return set;
    wf.steps.forEach(function (step) {
      var pid = String((step && step.promptId) || "").trim();
      if (!pid) return;
      set[pid] = true;
    });
    return set;
  }

  function applyLibraryFilters() {
    var filters = getActiveFilters();
    var items = state.prompts.slice();

    if (filters.workflowId) {
      var workflowPromptIds = buildPromptIdSetForWorkflow(filters.workflowId);
      items = items.filter(function (p) {
        return !!workflowPromptIds[String((p && p.id) || "")];
      });
    }

    if (filters.query) {
      items = items.filter(function (p) {
        var haystack =
          (p.title || "") +
          " " +
          (p.body || "") +
          " " +
          (Array.isArray(p.tags) ? p.tags.join(" ") : "");
        return haystack.toLowerCase().indexOf(filters.query) !== -1;
      });
    }

    if (filters.tag && filters.tag.length) {
      items = items.filter(function (p) {
        var promptTags = (p.tags || []).map(function (t) {
          return String(t).toLowerCase();
        });
        return filters.tag.every(function (ft) {
          return promptTags.some(function (pt) {
            return pt.indexOf(ft) !== -1;
          });
        });
      });
    }

    if (filters.sort === "createdDesc") {
      items.sort(function (a, b) {
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
    } else if (filters.sort === "title") {
      items.sort(function (a, b) {
        return String(a.title || "").localeCompare(String(b.title || ""));
      });
    } else if (filters.sort === "usage") {
      items.sort(function (a, b) {
        return (b.usageCount || 0) - (a.usageCount || 0);
      });
    } else {
      // updatedDesc
      items.sort(function (a, b) {
        return (b.updatedAt || 0) - (a.updatedAt || 0);
      });
    }

    return items;
  }

  function buildPromptWorkflowUsageIndex() {
    var used = {};
    var workflows = Array.isArray(state.workflows) ? state.workflows : [];
    workflows.forEach(function (wf) {
      (wf.steps || []).forEach(function (step) {
        if (step && step.promptId) {
          used[String(step.promptId)] = true;
        }
      });
    });
    return used;
  }

  function renderLibraryList() {
    var items = applyLibraryFilters();
    var usedByWorkflows = buildPromptWorkflowUsageIndex();
    els.libraryList.innerHTML = "";
    if (!items.length) {
      var empty = document.createElement("div");
      empty.className = "library-list-empty";
      empty.textContent = "No prompts saved yet.";
      els.libraryList.appendChild(empty);
      return;
    }

    items.forEach(function (p) {
      var item = document.createElement("button");
      item.type = "button";
      item.className =
        "library-item" +
        (p.id === state.selectedPromptId ? " selected" : "");
      item.setAttribute("data-id", p.id);

      var title = document.createElement("div");
      title.className = "library-item-title";
      title.textContent = p.title || "Untitled prompt";

      var meta = document.createElement("div");
      meta.className = "library-item-meta";
      var updated = window.Utils
        ? window.Utils.formatDate(p.updatedAt)
        : "";
      var metaText = document.createElement("span");
      metaText.textContent =
        "Updated " + updated + " · Used " + (p.usageCount || 0) + "×";
      meta.appendChild(metaText);

      if (usedByWorkflows && usedByWorkflows[p.id]) {
        var pill = document.createElement("span");
        pill.className = "tag-pill in-workflow-pill";
        pill.textContent = "In workflow";
        meta.appendChild(pill);
      }

      var tagsWrap = document.createElement("div");
      tagsWrap.className = "library-item-tags";
      (p.tags || []).slice(0, 4).forEach(function (tag) {
        var span = document.createElement("span");
        span.className = "tag-pill";
        span.textContent = tag;
        tagsWrap.appendChild(span);
      });

      item.appendChild(title);
      item.appendChild(meta);
      if ((p.tags || []).length) {
        item.appendChild(tagsWrap);
      }
      item.addEventListener("click", function () {
        selectPrompt(p.id);
      });

      els.libraryList.appendChild(item);
    });
  }

  function findPromptById(id) {
    return state.prompts.find(function (p) {
      return p.id === id;
    });
  }

  function findPromptAssetById(id) {
    // Alias keeps existing findPromptById behavior while clarifying prompt-asset intent.
    return findPromptById(id);
  }

  function buildPromptAssetFromDetailForm(existingAsset) {
    var title = (els.detailTitle.value || "").trim();
    var tagsRaw = els.detailTags.value;
    var notes = (els.detailNotes.value || "").trim();
    var body = (els.detailBody.value || "").trim();
    var tags =
      tagsRaw && tagsRaw.trim()
        ? tagsRaw.split(",").map(function (t) {
            return t.trim();
          }).filter(Boolean)
        : [];
    return {
      id: state.selectedPromptId || (existingAsset && existingAsset.id ? existingAsset.id : null),
      title: title || "Untitled prompt",
      tags: tags,
      notes: notes,
      body: body
    };
  }

  function appendPromptAssetVersion(asset, body, note) {
    if (!asset) return asset;
    var target = asset;
    target.versions = Array.isArray(target.versions) ? target.versions : [];
    var timestamp = typeof target.updatedAt === "number" ? target.updatedAt : Date.now();
    target.versions.push({
      id: (window.Utils && window.Utils.uuid ? window.Utils.uuid() : String(timestamp)) + "-v",
      timestamp: timestamp,
      body: body,
      notes: note || ""
    });
    return target;
  }

  function updatePromptAssetMetadata(asset, metadata) {
    if (!asset || !metadata) return asset;
    var target = asset;
    if (Object.prototype.hasOwnProperty.call(metadata, "createdAt")) {
      target.createdAt = metadata.createdAt;
    }
    if (Object.prototype.hasOwnProperty.call(metadata, "updatedAt")) {
      target.updatedAt = metadata.updatedAt;
    }
    if (Object.prototype.hasOwnProperty.call(metadata, "usageCount")) {
      target.usageCount = metadata.usageCount;
    }
    return target;
  }

  function hydratePromptStudioFromPromptAsset(asset) {
    // Keep Prompt Studio runtime reset/hydration sequence unchanged for template use.
    resetConversationState();
    clearBriefFields();
    applyPromptEntryToBrief(asset);
    updateOutputTypeVisibility();
  }

  function clearDetailForm() {
    state.selectedPromptId = null;
    els.detailTitle.value = "";
    els.detailTags.value = "";
    els.detailNotes.value = "";
    els.detailBody.value = "";
    els.detailMetaCreated.textContent = "Created: —";
    els.detailMetaUpdated.textContent = "Updated: —";
    els.detailMetaUsage.textContent = "Usage: 0";
    els.versionsList.innerHTML = "";

    els.duplicatePromptBtn.disabled = true;
    els.renamePromptBtn.disabled = true;
    els.deletePromptBtn.disabled = true;
    els.usePromptBtn.disabled = true;
    els.exportPromptBtn.disabled = true;
    if (els.copyPromptBodyBtn) {
      els.copyPromptBodyBtn.disabled = true;
    }
  }

  function populateDetailForm(promptAsset) {
    state.selectedPromptId = promptAsset.id;
    els.detailTitle.value = promptAsset.title || "";
    els.detailTags.value = (promptAsset.tags || []).join(", ");
    els.detailNotes.value = promptAsset.notes || "";
    els.detailBody.value = promptAsset.body || "";
    els.detailMetaCreated.textContent =
      "Created: " +
      (window.Utils ? window.Utils.formatDate(promptAsset.createdAt) : "");
    els.detailMetaUpdated.textContent =
      "Updated: " +
      (window.Utils ? window.Utils.formatDate(promptAsset.updatedAt) : "");
    els.detailMetaUsage.textContent =
      "Usage: " + (promptAsset.usageCount || 0);

    els.duplicatePromptBtn.disabled = false;
    els.renamePromptBtn.disabled = false;
    els.deletePromptBtn.disabled = false;
    els.usePromptBtn.disabled = false;
    els.exportPromptBtn.disabled = false;
    if (els.copyPromptBodyBtn) {
      els.copyPromptBodyBtn.disabled = false;
    }

    renderVersions(promptAsset);
  }

  function renderVersions(promptAsset) {
    els.versionsList.innerHTML = "";
    // Durable Prompt Library asset history (distinct from displayed draft/refined selector).
    (promptAsset.versions || [])
      .slice()
      .sort(function (a, b) {
        return (b.timestamp || 0) - (a.timestamp || 0);
      })
      .forEach(function (v) {
        var li = document.createElement("li");
        var time = document.createElement("time");
        time.textContent =
          (window.Utils ? window.Utils.formatDate(v.timestamp) : "") +
          (v.notes ? " · " + v.notes : "");
        var preview = document.createElement("span");
        var body = String(v.body || "");
        preview.textContent =
          body.length > 120 ? body.slice(0, 117) + "..." : body;
        li.appendChild(time);
        li.appendChild(preview);
        els.versionsList.appendChild(li);
      });
  }

  function selectPrompt(id) {
    var promptAsset = findPromptAssetById(id);
    if (!promptAsset) {
      clearDetailForm();
      renderLibraryList();
      return;
    }
    populateDetailForm(promptAsset);
    renderLibraryList();
  }

  function handleSavePromptChanges() {
    // Prompt Library lifecycle op: save/edit durable prompt asset.
    // Canonical state update: persist via Library API, then upsert state.prompts + selection.
    var existingAsset = findPromptAssetById(state.selectedPromptId);
    var data = buildPromptAssetFromDetailForm(existingAsset);
    if (!data.body) {
      showToast("Prompt body cannot be empty.", "error");
      return;
    }

    var savePromise;
    if (state.selectedPromptId) {
      savePromise = window.Library.updatePrompt(data);
    } else {
      data.source = "manual";
      savePromise = window.Library.savePrompt(data);
    }

    savePromise
      .then(function (saved) {
        var idx = state.prompts.findIndex(function (p) {
          return p.id === saved.id;
        });
        if (idx >= 0) {
          state.prompts[idx] = saved;
        } else {
          state.prompts.push(saved);
        }
        state.selectedPromptId = saved.id;
        populateDetailForm(saved);
        renderLibraryList();
        refreshWorkflowPromptOptions();
        showToast("Prompt saved to library.", "success");
      })
      .catch(function (err) {
        showToast(err.message || "Could not save prompt.", "error");
      });
  }

  function handleNewPrompt() {
    clearDetailForm();
    els.detailTitle.focus();
  }

  function handleDeletePrompt() {
    // Prompt Library lifecycle op: delete durable prompt asset.
    if (!state.selectedPromptId) return;
    var promptAsset = findPromptAssetById(state.selectedPromptId);
    var title = promptAsset ? promptAsset.title || "this prompt" : "this prompt";
    var confirmed = window.confirm(
      "Delete \"" + title + "\" from the library? This cannot be undone."
    );
    if (!confirmed) return;

    window.Library.deletePrompt(state.selectedPromptId).then(function () {
      state.prompts = state.prompts.filter(function (p) {
        return p.id !== state.selectedPromptId;
      });
      state.selectedPromptId = null;
      clearDetailForm();
      renderLibraryList();
      showToast("Prompt deleted.", "success");
    });
  }

  function handleDuplicatePrompt() {
    // Prompt Library lifecycle op: duplicate durable prompt asset.
    // User-authored content is copied; system-derived metadata is regenerated.
    if (!state.selectedPromptId) return;
    var promptAsset = findPromptAssetById(state.selectedPromptId);
    if (!promptAsset) return;
    var now = Date.now();
    var clone = JSON.parse(JSON.stringify(promptAsset));
    clone.id = window.Utils && window.Utils.uuid ? window.Utils.uuid() : String(now);
    clone.title = clone.title + " (copy)";
    updatePromptAssetMetadata(clone, {
      createdAt: now,
      updatedAt: now,
      usageCount: 0
    });
    // Keep versions but append a marker version.
    appendPromptAssetVersion(
      clone,
      clone.body,
      "Duplicated from " + (promptAsset.title || "another prompt")
    );

    window.Library.savePrompt(clone).then(function (saved) {
      state.prompts.push(saved);
      selectPrompt(saved.id);
      renderLibraryList();
      refreshWorkflowPromptOptions();
      showToast("Prompt duplicated.", "success");
    });
  }

  function handleRenamePrompt() {
    if (!state.selectedPromptId) return;
    var promptAsset = findPromptAssetById(state.selectedPromptId);
    if (!promptAsset) return;
    var newTitle = (els.detailTitle.value || "").trim();
    if (!newTitle) {
      showToast("Prompt title cannot be empty.", "error");
      return;
    }
    window.Library
      .updatePrompt({ id: promptAsset.id, title: newTitle })
      .then(function (saved) {
        var idx = state.prompts.findIndex(function (p) {
          return p.id === saved.id;
        });
        if (idx >= 0) state.prompts[idx] = saved;
        populateDetailForm(saved);
        renderLibraryList();
        refreshWorkflowPromptOptions();
        showToast("Prompt renamed.", "success");
      });
  }

  function handleUsePrompt() {
    // Prompt Library -> Prompt Studio boundary:
    // read selected durable prompt asset and hydrate Prompt Studio runtime/brief fields.
    // This does not merge Prompt Studio runtime state into canonical library state.
    if (!state.selectedPromptId) return;
    var promptAsset = findPromptAssetById(state.selectedPromptId);
    if (!promptAsset) return;

    // Start from a clean Prompt Studio state for the selected library asset:
    // - wipe any existing refinement conversation
    // - clear all brief fields
    // Then hydrate the brief/task fields from the asset body + brief metadata.
    hydratePromptStudioFromPromptAsset(promptAsset);

    // Lifecycle metadata update on use: increment system-derived usageCount.
    var currentCount = promptAsset.usageCount || 0;
    window.Library
      .updatePrompt({ id: promptAsset.id, usageCount: currentCount + 1 })
      .then(function (saved) {
        var idx = state.prompts.findIndex(function (p) {
          return p.id === saved.id;
        });
        if (idx >= 0) state.prompts[idx] = saved;
        populateDetailForm(saved);
        renderLibraryList();
        // Accessibility: move focus out of Library before the panel is hidden.
        var activeEl = document.activeElement;
        var focusWasInLibrary = !!(
          els.libraryPanel &&
          activeEl &&
          typeof els.libraryPanel.contains === "function" &&
          els.libraryPanel.contains(activeEl)
        );
        if (focusWasInLibrary && els.tabRefiner && typeof els.tabRefiner.focus === "function") {
          els.tabRefiner.focus();
        }
        // Switch back to Prompt Studio so the user can edit the template.
        switchTab("promptFactory");
        if (els.initialPrompt && typeof els.initialPrompt.focus === "function") {
          els.initialPrompt.focus();
        }
      });
    showToast("Prompt inserted into initial prompt field.", "success");
  }

  function handleExportAll() {
    exportAllData();
  }

  function handleExportPrompt() {
    // Prompt Library lifecycle op: export selected durable prompt asset JSON.
    if (!state.selectedPromptId) return;
    window.Library
      .exportPrompts([state.selectedPromptId])
      .then(function (entries) {
        if (!entries || !entries.length) return;
        var name = entries[0].title || "prompt";
        triggerDownload(entries, "prompt-" + slugify(name));
        showToast("Exported prompt as JSON.", "success");
      });
  }

  function triggerDownload(data, baseName) {
    var json = JSON.stringify(data, null, 2);
    var blob = new Blob([json], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = baseName + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function exportAllData() {
    // Prompt Library lifecycle op: export full durable bundle (prompts + workflows).
    var promptsPromise = window.Library && window.Library.getAllPrompts
      ? window.Library.getAllPrompts()
      : Promise.resolve([]);
    promptsPromise.then(function (prompts) {
      var bundle = {
        version: 1,
        prompts: Array.isArray(prompts) ? prompts : [],
        workflows: Array.isArray(state.workflows) ? state.workflows : []
      };
      triggerDownload(bundle, "prism-export");
      var pCount = bundle.prompts.length;
      var wCount = bundle.workflows.length;
      showToast(
        "Exported " + pCount + " prompt(s) and " + wCount + " workflow(s).",
        "success"
      );
    });
  }

  // -----------------------------
  // Workflows (design-only, no API execution)
  // -----------------------------

  function findWorkflowById(id) {
    return state.workflows.find(function (w) {
      return w.id === id;
    }) || null;
  }

  function loadWorkflows() {
    var raw = null;
    try {
      raw = window.localStorage.getItem(WORKFLOW_STORAGE_KEY);
    } catch (e) {
      raw = null;
    }
    if (!raw) {
      state.workflows = [];
      state.selectedWorkflowId = null;
      renderWorkflowList();
      clearWorkflowDetail();
      return Promise.resolve();
    }
    try {
      var data = JSON.parse(raw);
      var source = Array.isArray(data) ? data : [];
      state.workflows = source.map(function (wf) {
        return normalizeWorkflowForV1(wf, []);
      });
    } catch (e) {
      state.workflows = [];
    }
    if (state.workflows.length) {
      state.selectedWorkflowId = state.workflows[0].id;
    } else {
      state.selectedWorkflowId = null;
    }
    renderWorkflowList();
    if (state.selectedWorkflowId) {
      selectWorkflow(state.selectedWorkflowId);
    } else {
      clearWorkflowDetail();
    }
    // Workflows can reference prompts; re-render library so "In workflow" indicators update.
    renderLibraryList();
    return Promise.resolve();
  }

  function saveWorkflows() {
    try {
      var json = JSON.stringify(state.workflows || []);
      window.localStorage.setItem(WORKFLOW_STORAGE_KEY, json);
    } catch (e) {
      // Ignore storage errors; workflows just won't persist.
    }
  }

  function renderWorkflowList() {
    if (!els.workflowList) return;
    renderLibraryWorkflowFilterOptions();
    els.workflowList.innerHTML = "";
    if (!state.workflows.length) {
      var empty = document.createElement("div");
      empty.className = "workflow-list-empty";
      empty.textContent = "No workflows yet. Click \"New workflow\" to create one.";
      els.workflowList.appendChild(empty);
      return;
    }
    state.workflows.forEach(function (wf) {
      var item = document.createElement("div");
      item.className =
        "workflow-item" + (wf.id === state.selectedWorkflowId ? " selected" : "");
      item.setAttribute("data-workflow-id", wf.id);

      var title = document.createElement("div");
      title.className = "workflow-item-title";
      title.textContent = wf.name || "Untitled workflow";

      var meta = document.createElement("div");
      meta.className = "workflow-item-meta";
      var stepsLabel =
        (wf.steps && wf.steps.length ? wf.steps.length : 0) + " step" +
        ((wf.steps && wf.steps.length) === 1 ? "" : "s");
      meta.textContent = stepsLabel;

      item.appendChild(title);
      item.appendChild(meta);
      els.workflowList.appendChild(item);
    });
  }

  function clearWorkflowDetail() {
    if (!els.workflowDetail) return;
    state.selectedWorkflowId = null;
    if (els.workflowName) els.workflowName.value = "";
    if (els.workflowArtefacts) els.workflowArtefacts.value = "";
    if (els.workflowOutputs) els.workflowOutputs.value = "";
    if (els.workflowStartingArtefact) els.workflowStartingArtefact.value = "";
    if (els.workflowAudience) els.workflowAudience.value = "";
    if (els.workflowGoal) els.workflowGoal.value = "";
    if (els.workflowConstraints) els.workflowConstraints.value = "";
    renderWorkflowDetailDomainUiHints(["general"]);
    renderWorkflowValidationWarnings([]);
    if (els.workflowSteps) {
      els.workflowSteps.innerHTML = "";
      var li = document.createElement("li");
      li.className = "workflow-steps-empty";
      li.textContent = "No steps yet. Add your first step.";
      els.workflowSteps.appendChild(li);
    }
    if (els.deleteWorkflowBtn) els.deleteWorkflowBtn.disabled = true;
    if (els.duplicateWorkflowBtn) els.duplicateWorkflowBtn.disabled = true;
    if (els.renameWorkflowBtn) els.renameWorkflowBtn.disabled = true;
  }

  function selectWorkflow(id) {
    var wf = findWorkflowById(id);
    if (!wf) {
      clearWorkflowDetail();
      renderWorkflowList();
      return;
    }
    state.selectedWorkflowId = wf.id;
    populateWorkflowDetail(wf);
    renderWorkflowList();
    if (els.exportWorkflowBtn) {
      els.exportWorkflowBtn.disabled = false;
    }
  }

  function populateWorkflowDetail(wf) {
    if (!els.workflowDetail) return;
    var selectedDomains = Array.isArray(wf.selectedDomains) ? wf.selectedDomains : ["general"];
    renderWorkflowDetailDomainUiHints(selectedDomains);
    refreshWorkflowStepPatternCatalogForDomains(selectedDomains).then(function (catalog) {
      if (workflowHasRunnerGuidanceInCatalog(wf, catalog)) {
        updateWorkflowStepInteractivity();
        updateWorkflowRunView();
        return;
      }
      if (
        !window.WorkflowGenerationContext ||
        typeof window.WorkflowGenerationContext.getDomainOptions !== "function"
      ) {
        updateWorkflowStepInteractivity();
        updateWorkflowRunView();
        return;
      }
      window.WorkflowGenerationContext
        .getDomainOptions()
        .then(function (domains) {
          var ids = Array.isArray(domains)
            ? domains
                .map(function (d) { return String((d && d.id) || "").trim(); })
                .filter(function (id) { return !!id; })
            : [];
          if (!ids.length) {
            updateWorkflowStepInteractivity();
            updateWorkflowRunView();
            return;
          }
          if (ids.indexOf("general") === -1) ids.unshift("general");
          return refreshWorkflowStepPatternCatalogForDomains(ids).then(function () {
            updateWorkflowStepInteractivity();
            updateWorkflowRunView();
          });
        })
        .catch(function () {
          updateWorkflowStepInteractivity();
          updateWorkflowRunView();
        });
    });

    if (els.workflowName) els.workflowName.value = wf.name || "";
    if (els.workflowArtefacts) els.workflowArtefacts.value = wf.artefacts || "";
    if (els.workflowOutputs) els.workflowOutputs.value = formatStringList(wf.workflowOutputs || []);
    if (els.workflowStartingArtefact) {
      els.workflowStartingArtefact.value = String(wf.startingArtefact || "").trim();
    }
    var outputSpec = normalizeWorkflowOutputSpec(wf.workflowOutputSpec);
    if (els.workflowAudience) els.workflowAudience.value = outputSpec.audience;
    if (els.workflowGoal) els.workflowGoal.value = outputSpec.goal;
    if (els.workflowConstraints) els.workflowConstraints.value = outputSpec.constraints;

    if (els.workflowSteps) {
      els.workflowSteps.innerHTML = "";
      var steps = wf.steps && wf.steps.length ? wf.steps : [];
      if (!steps.length) {
        var li = document.createElement("li");
        li.className = "workflow-steps-empty";
        li.textContent = "No steps yet. Add your first step.";
        els.workflowSteps.appendChild(li);
      } else {
        steps.forEach(function (step, index) {
          var li = createWorkflowStepElement(step, index);
          els.workflowSteps.appendChild(li);
        });
        renumberWorkflowSteps();
        updateWorkflowStepInteractivity();
        refreshWorkflowPromptOptions();
      }
    }
    if (els.deleteWorkflowBtn) els.deleteWorkflowBtn.disabled = false;
    if (els.duplicateWorkflowBtn) els.duplicateWorkflowBtn.disabled = false;
    if (els.renameWorkflowBtn) els.renameWorkflowBtn.disabled = false;

    // Reset transient run navigation when loading/selecting a workflow.
    resetWorkflowRunNavigationState({ resetIndex: true });
    updateWorkflowRunView();
    renderWorkflowValidationWarnings(validateWorkflow(wf));
  }

  function renumberWorkflowSteps() {
    if (!els.workflowSteps) return;
    var inRunMode =
      !!(
        els.workflowDetail &&
        els.workflowDetail.classList &&
        els.workflowDetail.classList.contains("run-mode")
      );
    var index = 0;
    Array.prototype.forEach.call(els.workflowSteps.children, function (child) {
      if (!child.classList || !child.classList.contains("workflow-step")) {
        return;
      }
      index += 1;
      var label = child.querySelector(".workflow-step-header-title");
      if (label) {
        var stepNumber = index;
        if (inRunMode) {
          var titleInput = child.querySelector('[data-field="title"]');
          var title =
            titleInput && typeof titleInput.value === "string"
              ? titleInput.value.trim()
              : "";
          if (!title) title = "Untitled step";
          label.textContent = "Step " + stepNumber + " – " + title;
        } else {
          label.textContent = "Step " + stepNumber;
        }
      }
      var inputKindLabel = child.querySelector(".workflow-input-kind-label");
      if (inputKindLabel) {
        inputKindLabel.textContent =
          index === 1 ? "Initial input" : "Additional input";
      }
    });
    refreshWorkflowInputSources();
  }

  function readStepInputBindings(li) {
    if (!li) return [];
    var raw = li.getAttribute("data-input-bindings");
    if (!raw) return [];
    try {
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function normalizeStepInputBindings(bindings) {
    if (!Array.isArray(bindings)) return [];
    return bindings
      .map(function (b) {
        if (!b || typeof b !== "object") return null;
        var kind = b.kind === "internal" ? "internal" : "external";
        var artifactName = String(b.artifactName || "").trim();
        if (!artifactName) return null;
        var sourceStepId = kind === "internal" ? String(b.sourceStepId || "").trim() : "";
        if (kind === "internal" && !sourceStepId) return null;
        return {
          kind: kind,
          artifactName: artifactName,
          sourceStepId: sourceStepId
        };
      })
      .filter(Boolean);
  }

  function writeStepInputBindings(li, bindings) {
    if (!li) return;
    var normalized = normalizeStepInputBindings(bindings);
    li.setAttribute("data-input-bindings", JSON.stringify(normalized));
  }

  function getWorkflowStepElements() {
    if (!els.workflowSteps) return [];
    var out = [];
    Array.prototype.forEach.call(els.workflowSteps.children, function (child) {
      if (child.classList && child.classList.contains("workflow-step")) {
        out.push(child);
      }
    });
    return out;
  }

  function getStepTitleFromElement(li) {
    if (!li) return "Untitled step";
    var titleInput = li.querySelector('[data-field="title"]');
    var title = titleInput && titleInput.value ? String(titleInput.value).trim() : "";
    return title || "Untitled step";
  }

  function getStepOutputNameFromElement(li) {
    if (!li) return "";
    var outputInput = li.querySelector('[data-field="outputName"]');
    return outputInput && outputInput.value ? String(outputInput.value).trim() : "";
  }

  function getAvailableInputArtefactsForStep(targetLi) {
    var steps = getWorkflowStepElements();
    var available = [];
    for (var i = 0; i < steps.length; i++) {
      var li = steps[i];
      if (li === targetLi) break;
      var stepId = li.getAttribute("data-step-id") || "";
      if (!stepId) continue;
      var title = getStepTitleFromElement(li);
      var outputName = getStepOutputNameFromElement(li);
      // Only explicit named outputs are eligible as reusable artefacts.
      if (!outputName) continue;
      var artifactName = outputName;
      available.push({
        sourceStepId: stepId,
        sourceStepTitle: title,
        artifactName: artifactName
      });
    }
    return available;
  }

  function getStepTitleById(stepId) {
    if (!stepId || !els.workflowSteps) return "";
    var steps = getWorkflowStepElements();
    for (var i = 0; i < steps.length; i++) {
      var li = steps[i];
      if ((li.getAttribute("data-step-id") || "") === stepId) {
        return getStepTitleFromElement(li);
      }
    }
    return "";
  }

  function getStepNumberById(stepId) {
    if (!stepId || !els.workflowSteps) return 0;
    var steps = getWorkflowStepElements();
    for (var i = 0; i < steps.length; i++) {
      var li = steps[i];
      if ((li.getAttribute("data-step-id") || "") === stepId) {
        return i + 1;
      }
    }
    return 0;
  }

  function refreshWorkflowInputSources() {
    var steps = getWorkflowStepElements();
    steps.forEach(function (li) {
      var select = li.querySelector('[data-field="inputBindingSource"]');
      if (!select) return;
      var previousValue = select.value || "";
      while (select.firstChild) {
        select.removeChild(select.firstChild);
      }
      var placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "Select named output from prior step…";
      select.appendChild(placeholder);

      var available = getAvailableInputArtefactsForStep(li);
      available.forEach(function (a) {
        var opt = document.createElement("option");
        opt.value = a.sourceStepId + "::" + a.artifactName;
        opt.textContent = a.artifactName;
        select.appendChild(opt);
      });
      if (previousValue) select.value = previousValue;

      var currentBindings = readStepInputBindings(li);
      var validStepIds = {};
      available.forEach(function (a) {
        validStepIds[a.sourceStepId] = true;
      });
      var pruned = currentBindings.filter(function (b) {
        if (b.kind !== "internal") return true;
        return !!validStepIds[b.sourceStepId];
      });
      if (pruned.length !== currentBindings.length) {
        writeStepInputBindings(li, pruned);
        var render = li.__renderInputBindings;
        if (typeof render === "function") render();
      }
    });
  }

  function refreshWorkflowPromptOptions() {
    if (!els.workflowSteps) return;

    var children = els.workflowSteps.children;
    for (var i = 0; i < children.length; i++) {
      var li = children[i];
      if (!li.classList || !li.classList.contains("workflow-step")) continue;
      var select = li.querySelector('[data-field="promptId"]');
      if (!select) continue;

      var currentPromptId = select.value || "";

      while (select.firstChild) {
        select.removeChild(select.firstChild);
      }

      var noneOpt = document.createElement("option");
      noneOpt.value = "";
      var titleEl = li.querySelector('[data-field="title"]');
      noneOpt.textContent = getStepPromptEmptyOptionLabel({
        promptSource: li.getAttribute("data-prompt-source") || "",
        promptId: currentPromptId,
        canonicalStepId: li.getAttribute("data-canonical-step-id") || "",
        promptInstance: "",
        stepTitle: titleEl && typeof titleEl.value === "string" ? titleEl.value : ""
      });
      select.appendChild(noneOpt);

      (state.prompts || []).forEach(function (p) {
        var opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = p.title || "(untitled)";
        select.appendChild(opt);
      });

      // Restore selection if still present.
      if (currentPromptId) {
        select.value = currentPromptId;
      }
      if (!select.value) {
        select.value = "";
      }
    }
  }

  function normalizePromptSourceType(raw) {
    var src = String(raw || "").trim().toLowerCase();
    if (src === "local_override" || src === "override") return "local_override";
    if (src === "library_prompt" || src === "library") return "library_prompt";
    return "none";
  }

  function getStepPromptSourceType(step) {
    if (!step || typeof step !== "object") return "none";
    var explicit = normalizePromptSourceType(step.prompt_source_type || step.promptSourceType || "");
    if (explicit !== "none") return explicit;
    if (step.override_prompt_body || step.overridePromptBody) return "local_override";
    if (step.promptId) return "library_prompt";
    return "none";
  }

  function resolveLibraryPromptBody(promptId) {
    var id = String(promptId || "").trim();
    if (!id) return "";
    var p = findPromptById(id);
    return p && typeof p.body === "string" ? String(p.body || "").trim() : "";
  }

  function resolveStepPromptText(step) {
    var sourceType = getStepPromptSourceType(step);
    if (sourceType === "local_override") {
      var body = String(
        (step && (step.override_prompt_body || step.overridePromptBody)) || ""
      ).trim();
      if (!body) {
        return {
          sourceType: sourceType,
          text: "",
          error: "Local override selected, but prompt body is empty."
        };
      }
      return { sourceType: sourceType, text: body, error: "" };
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
      return { sourceType: sourceType, text: libraryBody, error: "" };
    }
    return {
      sourceType: "none",
      text: "",
      error: "No prompt configured for this step."
    };
  }

  function getStepPromptEmptyOptionLabel(info) {
    var row = info && typeof info === "object" ? info : {};
    var promptSource = normalizePromptSourceType(row.promptSource || "");
    var promptId = row.promptId == null ? "" : String(row.promptId).trim();
    if (promptSource === "local_override") {
      return "Using local override prompt";
    }
    if (promptSource === "library_prompt" && !!promptId) {
      return "Using library prompt";
    }
    return "No prompt configured";
  }

  function createWorkflowStepElement(step, index) {
    var li = document.createElement("li");
    li.className = "workflow-step";
    li.setAttribute("data-step-id", step.id);
    li.setAttribute("data-canonical-step-id", String(step.canonical_step_id || ""));
    li.setAttribute("data-prompt-source", getStepPromptSourceType(step));
    li.setAttribute("data-domain-version", String(step.domain_version || ""));
    var initialBindings = Array.isArray(step.inputBindings) ? step.inputBindings.slice() : [];
    writeStepInputBindings(li, initialBindings);

    var header = document.createElement("div");
    header.className = "workflow-step-header";

    var label = document.createElement("div");
    label.className = "workflow-step-header-title";
    label.textContent = "Step " + (index + 1);

    var headerActions = document.createElement("div");
    headerActions.className = "workflow-step-header-actions";

    var newPromptBtn = document.createElement("button");
    newPromptBtn.type = "button";
    newPromptBtn.className = "btn small workflow-step-new-prompt";
    newPromptBtn.textContent = "Settings...";
    newPromptBtn.addEventListener("click", function () {
      if (!els || !els.refinementPanel) return;

      // Switch to Prompt Factory and seed the brief based on this step + workflow.
      switchTab("promptFactory");

      // Reset any existing brief so we start clean for this step.
      resetConversationState();
      clearBriefFields();

      var stepTitleInput = li.querySelector('[data-field="title"]');
      var stepRoleInput = li.querySelector('[data-field="roleLabel"]');
      var stepKindInput = li.querySelector('[data-field="inputKind"]');
      var stepOutputInput = li.querySelector('[data-field="outputName"]');
      var stepNotesInput = li.querySelector('[data-field="notes"]');

      var stepRole =
        stepRoleInput && typeof stepRoleInput.value === "string"
          ? stepRoleInput.value.trim()
          : "";
      var stepTitle =
        stepTitleInput && typeof stepTitleInput.value === "string"
          ? stepTitleInput.value.trim()
          : "";
      var stepOutputName =
        stepOutputInput && typeof stepOutputInput.value === "string"
          ? stepOutputInput.value.trim()
          : "";
      var stepNotesDomValue =
        stepNotesInput && typeof stepNotesInput.value === "string"
          ? stepNotesInput.value.trim()
          : "";
      var hasStepNotesRawAttr =
        !!(stepNotesInput && stepNotesInput.hasAttribute("data-run-raw-notes"));
      var stepNotesRawAttr = hasStepNotesRawAttr
        ? String(stepNotesInput.getAttribute("data-run-raw-notes") || "").trim()
        : "";
      var stepNotes = stepNotesDomValue;
      var stepKind =
        stepKindInput && typeof stepKindInput.value === "string"
          ? stepKindInput.value.trim()
          : "text";
      var stepKindLabel =
        stepKind === "file"
          ? "Upload file"
          : stepKind === "url"
          ? "Provide URL"
          : stepKind === "none"
          ? "None"
          : "Paste text";
      var wf = gatherWorkflowDetailFormData();
      var outputSpec = normalizeWorkflowOutputSpec(wf.workflowOutputSpec);
      var openWithCatalog = function (stepPatternCatalog) {
        var stepIdForCtx = li.getAttribute("data-step-id") || "";
        var wfStep = null;
        if (wf && Array.isArray(wf.steps) && stepIdForCtx) {
          wfStep = wf.steps.find(function (row) {
            return String(row && row.id ? row.id : "") === String(stepIdForCtx);
          }) || null;
        }
        var workflowStepNotes =
          wfStep && typeof wfStep.notes === "string" ? wfStep.notes.trim() : "";
        function hasWorkflowStepParamBlock(text) {
          return Object.keys(parseWorkflowStepParamBlock(String(text || ""))).length > 0;
        }
        var stepNotesForContext = stepNotesDomValue;
        if (hasStepNotesRawAttr) {
          stepNotesForContext = stepNotesRawAttr;
        } else if (hasWorkflowStepParamBlock(stepNotesDomValue)) {
          stepNotesForContext = stepNotesDomValue;
        } else if (hasWorkflowStepParamBlock(workflowStepNotes)) {
          stepNotesForContext = workflowStepNotes;
        } else {
          stepNotesForContext = stepNotesDomValue;
        }
        stepNotes = stepNotesForContext;
        var structuredWorkflow = isStructuredDomainSelection(wf && wf.selectedDomains);
        var matchedPattern = getPatternByCanonicalStepId(
          wfStep && wfStep.canonical_step_id ? wfStep.canonical_step_id : "",
          stepPatternCatalog
        );
        function normalizeStepTitleForLocalMatch(value) {
          return String(value || "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, " ")
            .trim()
            .replace(/\s+/g, " ");
        }
        var canonicalStepTitle = "";
        if (matchedPattern && matchedPattern.title) {
          canonicalStepTitle = String(matchedPattern.title || "").trim();
        } else {
          canonicalStepTitle = pickCanonicalWorkflowStepTitle(stepTitle, stepPatternCatalog);
          matchedPattern = getPatternByCanonicalWorkflowTitle(
            canonicalStepTitle,
            stepPatternCatalog
          );
          if (!matchedPattern) {
            // One more recovery path using the raw step title.
            matchedPattern = getPatternByCanonicalWorkflowTitle(
              stepTitle,
              stepPatternCatalog
            );
          }
          if (!matchedPattern) {
            // Targeted local recovery for Construct Learning Sequence only.
            var stepNorm = normalizeStepTitleForLocalMatch(stepTitle);
            if (stepNorm.indexOf("construct learning sequence") !== -1) {
              matchedPattern = (Array.isArray(stepPatternCatalog) ? stepPatternCatalog : []).find(function (p) {
                return normalizeStepTitleForLocalMatch(p && p.title ? p.title : "") === "construct learning sequence";
              }) || null;
            }
          }
          if (!matchedPattern) {
            // Final fallback for legacy/partially-normalized workflows.
            canonicalStepTitle = stepTitle;
          } else if (!canonicalStepTitle) {
            canonicalStepTitle = String(matchedPattern.title || stepTitle || "").trim();
          }
        }
        var stepInputBindings = normalizeStepInputBindings(readStepInputBindings(li));
        writeStepInputBindings(li, stepInputBindings);
        var inputArtefactNames = stepInputBindings
          .map(function (b) {
            return String(b && b.artifactName ? b.artifactName : "").trim();
          })
          .filter(function (name) {
            return !!name;
          });
        var inputArtefacts = stepInputBindings.map(function (b) {
          if (b.kind === "internal") {
            var sourceTitle = getStepTitleById(b.sourceStepId) || "earlier step";
            return '"' + b.artifactName + '" from "' + sourceTitle + '"';
          }
          return 'External "' + b.artifactName + '"';
        });
        var matchedCfg = normalizeWorkflowStepPromptConfig(
          matchedPattern && matchedPattern.promptFactory ? matchedPattern.promptFactory : null
        );
        var inputArtefactSchemas = resolveStepInputArtefactSchemas(
          matchedCfg.inputArtefactSchemas,
          inputArtefactNames
        );

        if (els.initialPrompt) {
          var promptTask = [];
          if (stepRole) promptTask.push(stepRole);
          if (stepTitle) promptTask.push('Create a prompt for step "' + stepTitle + '"');
          if (stepOutputName) promptTask.push('target output artefact "' + stepOutputName + '"');
          els.initialPrompt.value = promptTask.join(". ");
        }

        var promptCfg =
          matchedPattern && matchedPattern.promptFactory
            ? matchedPattern.promptFactory
            : null;
        var isConstructLearningSequenceStep =
          normalizeStepTitleForLocalMatch(stepTitle) === "construct learning sequence" ||
          normalizeStepTitleForLocalMatch(canonicalStepTitle) === "construct learning sequence";
        var normalizedCfg = normalizeWorkflowStepPromptConfig(promptCfg);
        var canonicalStepId =
          (wfStep && wfStep.canonical_step_id) ||
          normalizedCfg.canonicalStepId ||
          (matchedPattern && matchedPattern.canonicalStepId) ||
          "";
        var domainVersion =
          (wfStep && wfStep.domain_version) ||
          normalizedCfg.domainVersion ||
          (matchedPattern && matchedPattern.domainVersion) ||
          "1";
        var promptSource = getStepPromptSourceType(wfStep || {});
        state.promptFactoryWorkflowContext = {
          workflowId: wf.id || state.selectedWorkflowId || "",
          workflowName: wf.name || "",
          workflowGoal: outputSpec.goal || "",
          workflowArtefacts: wf.artefacts || "",
          workflowInputs: wf.workflowInputs || [],
          workflowOutputs: wf.workflowOutputs || [],
          workflowOutputSpec: outputSpec,
          stepId: stepIdForCtx,
          stepTitle: stepTitle,
          stepCanonicalTitle: canonicalStepTitle || stepTitle,
          stepCanonicalStepId: canonicalStepId,
          domainVersion: domainVersion,
          stepPromptSource: promptSource,
          stepOverridePromptBody:
            wfStep && typeof wfStep.override_prompt_body === "string"
              ? wfStep.override_prompt_body
              : "",
          stepPromptFactoryConfig:
            promptCfg,
          stepRoleLabel: stepRole,
          stepOutputName: stepOutputName,
          stepAdditionalInput: stepKindLabel,
          stepInputArtefactNames: inputArtefactNames,
          stepInputArtefacts: inputArtefacts,
          stepInputArtefactSchemas: inputArtefactSchemas,
          stepNotes: stepNotes
        };

        renderWorkflowPromptWizardNotice();
        applyWorkflowStepPromptDefaults({
          source: "workflow_step_open_prefill"
        });
        updateOutputTypeVisibility();
        showToast("Prompt Studio prefilled from this workflow step.", "success");
      };

      var domainsForStep = Array.isArray(wf.selectedDomains) && wf.selectedDomains.length
        ? wf.selectedDomains
        : state.workflowSelectedDomains;
      var stepPatternCatalog = Array.isArray(state.workflowStepPatternCatalog)
        ? state.workflowStepPatternCatalog
        : [];
      var isConstructLearningSequence =
        String(stepTitle || "").trim().toLowerCase() === "construct learning sequence";
      if (isConstructLearningSequence) {
        var clsDomains = Array.isArray(domainsForStep) ? domainsForStep.slice() : [];
        var hasLearningDesign = clsDomains.some(function (d) {
          return String(d || "").trim().toLowerCase() === "learning-design";
        });
        if (!hasLearningDesign) clsDomains.push("learning-design");
        if (!clsDomains.some(function (d) { return String(d || "").trim().toLowerCase() === "general"; })) {
          clsDomains.unshift("general");
        }
        refreshWorkflowStepPatternCatalogForDomains(clsDomains).then(function (loadedCatalog) {
          openWithCatalog(Array.isArray(loadedCatalog) ? loadedCatalog : []);
        });
        return;
      }
      if (!stepPatternCatalog.length) {
        refreshWorkflowStepPatternCatalogForDomains(domainsForStep).then(function (loadedCatalog) {
          openWithCatalog(Array.isArray(loadedCatalog) ? loadedCatalog : []);
        });
        return;
      }
      openWithCatalog(stepPatternCatalog);
    });

    var copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.className = "btn primary small workflow-step-copy-btn";
    copyBtn.textContent = "Copy";
    var copyBtnDefaultLabel = "Copy";
    var copyBtnCopiedLabel = "✓ Copied";
    var copyBtnResetTimer = null;
    function setCopyBtnCopiedState(persistUntilStepChange) {
      copyBtn.textContent = copyBtnCopiedLabel;
      if (persistUntilStepChange) {
        if (copyBtnResetTimer) {
          clearTimeout(copyBtnResetTimer);
          copyBtnResetTimer = null;
        }
        return;
      }
      if (copyBtnResetTimer) {
        clearTimeout(copyBtnResetTimer);
      }
      copyBtnResetTimer = setTimeout(function () {
        copyBtn.textContent = copyBtnDefaultLabel;
        copyBtnResetTimer = null;
      }, 1800);
    }
    copyBtn.addEventListener("click", function () {
      // Build a fresh view of the step from the DOM so Copy always reflects
      // the latest edits (title/role/prompt selection/etc).
      var effectiveStep = {
        id: step && step.id ? step.id : li.getAttribute("data-step-id") || "",
        title: "",
        roleLabel: "",
        promptId: "",
        prompt_source_type: normalizePromptSourceType(li.getAttribute("data-prompt-source") || ""),
        override_prompt_body: "",
        inputKind: "",
        outputName: "",
        notes: "",
        inputBindings: readStepInputBindings(li)
      };
      var titleEl = li.querySelector('[data-field="title"]');
      var roleEl = li.querySelector('[data-field="roleLabel"]');
      var promptEl = li.querySelector('[data-field="promptId"]');
      var kindEl = li.querySelector('[data-field="inputKind"]');
      var outputEl = li.querySelector('[data-field="outputName"]');
      var notesEl = li.querySelector('[data-field="notes"]');
      effectiveStep.title =
        titleEl && typeof titleEl.value === "string" ? titleEl.value : "";
      effectiveStep.roleLabel =
        roleEl && typeof roleEl.value === "string" ? roleEl.value : "";
      effectiveStep.promptId =
        promptEl && typeof promptEl.value === "string" ? promptEl.value : "";
      effectiveStep.inputKind =
        kindEl && typeof kindEl.value === "string" ? kindEl.value : "";
      effectiveStep.outputName =
        outputEl && typeof outputEl.value === "string" ? outputEl.value : "";
      effectiveStep.notes =
        notesEl && typeof notesEl.value === "string" ? notesEl.value : "";
      var liveWf = findWorkflowById(state.selectedWorkflowId || "");
      if (liveWf && Array.isArray(liveWf.steps)) {
        var liveStep = liveWf.steps.find(function (row) {
          return String(row && row.id ? row.id : "") === String(effectiveStep.id || "");
        });
        if (liveStep) {
          effectiveStep.override_prompt_body = String(liveStep.override_prompt_body || "").trim();
          if (!effectiveStep.prompt_source_type) {
            effectiveStep.prompt_source_type = getStepPromptSourceType(liveStep);
          }
        }
      }

      var inRunMode =
        !!(
          els.workflowDetail &&
          els.workflowDetail.classList &&
          els.workflowDetail.classList.contains("run-mode")
        );

      // In Run mode, explicitly check for a prompt and give feedback when none is set.
      if (inRunMode) {
        var resolved = resolveStepPromptText(effectiveStep);
        if (!resolved.text) {
          showToast(
            resolved.error || "No prompt configured for this step.",
            "error"
          );
          return;
        }
      }

      // Determine this step's current index based on DOM order so that
      // instructions always match the visible step numbers after reordering.
      var zeroBasedIndex = 0;
      if (els.workflowSteps && els.workflowSteps.children) {
        var children = els.workflowSteps.children;
        var seen = 0;
        for (var i = 0; i < children.length; i++) {
          var child = children[i];
          if (!child.classList || !child.classList.contains("workflow-step")) {
            continue;
          }
          if (child === li) {
            zeroBasedIndex = seen;
            break;
          }
          seen++;
        }
      }

      // Build the base instructions for this step.
      var textToCopy = buildWorkflowStepInstructions(
        effectiveStep,
        zeroBasedIndex,
        li
      );

      // In Run mode, prepend compact global workflow context to the FIRST step only.
      if (inRunMode && zeroBasedIndex === 0) {
        if (state.selectedWorkflowId) {
          var wf = findWorkflowById(state.selectedWorkflowId);
          if (wf) {
            var runtimeContext = buildWorkflowRuntimeContextText(wf, effectiveStep);
            if (runtimeContext) {
              textToCopy = runtimeContext + "\n\n---\n\n" + textToCopy;
            }
          }
        }
      }

      if (!textToCopy) {
        showToast("Add a library prompt or details to this step first.", "error");
        return;
      }
      if (!window.Utils || !window.Utils.copyText) {
        showToast("Clipboard helper is not available.", "error");
        return;
      }

      // When copying from a workflow, allow users to fill any {{Variable}} placeholders first.
      var filled = fillTemplateVariables(textToCopy);
      if (filled === null) {
        // User cancelled; do not copy anything.
        return;
      }

      window.Utils
        .copyText(filled)
        .then(function (ok) {
          if (ok) {
            if (inRunMode) {
              var copiedStepId = String(
                effectiveStep.id || li.getAttribute("data-step-id") || ""
              );
              state.workflowRunCopiedStepId = copiedStepId;
              setCopyBtnCopiedState(true);
            } else {
              setCopyBtnCopiedState(false);
            }
            showToast("Step instructions copied to clipboard.", "success");
          } else {
            showToast("Unable to copy step instructions to clipboard.", "error");
          }
        })
        .catch(function () {
          showToast("Unable to copy step instructions to clipboard.", "error");
        });
    });

    var moveUpBtn = document.createElement("button");
    moveUpBtn.type = "button";
    moveUpBtn.className = "btn small workflow-step-move-btn";
    moveUpBtn.textContent = "Move up";
    moveUpBtn.addEventListener("click", function () {
      if (!els.workflowSteps) return;
      var current = li;
      var prev = current.previousElementSibling;
      while (prev && !prev.classList.contains("workflow-step")) {
        prev = prev.previousElementSibling;
      }
      if (!prev) return;
      els.workflowSteps.insertBefore(current, prev);
      renumberWorkflowSteps();
    });

    var moveDownBtn = document.createElement("button");
    moveDownBtn.type = "button";
    moveDownBtn.className = "btn small workflow-step-move-btn";
    moveDownBtn.textContent = "Move down";
    moveDownBtn.addEventListener("click", function () {
      if (!els.workflowSteps) return;
      var current = li;
      var next = current.nextElementSibling;
      while (next && !next.classList.contains("workflow-step")) {
        next = next.nextElementSibling;
      }
      if (!next) return;
      var afterNext = next.nextSibling;
      els.workflowSteps.insertBefore(current, afterNext);
      renumberWorkflowSteps();
    });

    var removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "btn small danger workflow-step-remove-btn";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", function () {
      if (!els.workflowSteps) return;
      var stepTitle = (step && step.title ? step.title : "this step");
      var confirmed = window.confirm(
        'Remove "' + stepTitle + '" from this workflow? This cannot be undone.'
      );
      if (!confirmed) return;
      els.workflowSteps.removeChild(li);
      if (!els.workflowSteps.children.length) {
        var empty = document.createElement("li");
        empty.className = "workflow-steps-empty";
        empty.textContent = "No steps yet. Add your first step.";
        els.workflowSteps.appendChild(empty);
      }
      renumberWorkflowSteps();
    });

    // Always show step configuration so users can redesign a step prompt easily.
    headerActions.appendChild(newPromptBtn);
    headerActions.appendChild(copyBtn);
    headerActions.appendChild(moveUpBtn);
    headerActions.appendChild(moveDownBtn);
    headerActions.appendChild(removeBtn);

    header.appendChild(label);
    header.appendChild(headerActions);

    var fields = document.createElement("div");
    fields.className = "workflow-step-fields";

    var titleGroup = document.createElement("div");
    titleGroup.className = "form-group small";
    var titleLabel = document.createElement("label");
    titleLabel.textContent = "Step title";
    var titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.value = step.title || "";
    titleInput.setAttribute("data-field", "title");
    titleInput.autocomplete = "off";
    titleGroup.appendChild(titleLabel);
    titleGroup.appendChild(titleInput);

    var roleGroup = document.createElement("div");
    roleGroup.className = "form-group small";
    var roleLabel = document.createElement("label");
    roleLabel.textContent = "Role / purpose";
    var roleInput = document.createElement("input");
    roleInput.type = "text";
    roleInput.value = step.roleLabel || "";
    roleInput.setAttribute("data-field", "roleLabel");
    roleInput.placeholder = "e.g. Summarise, Generate quiz, Critique";
    roleInput.autocomplete = "off";
    roleGroup.appendChild(roleLabel);
    roleGroup.appendChild(roleInput);

    var promptGroup = document.createElement("div");
    promptGroup.className = "form-group small";
    var promptLabel = document.createElement("label");
    promptLabel.textContent = "Step prompt";
    var promptSelect = document.createElement("select");
    promptSelect.setAttribute("data-field", "promptId");
    var source = getStepPromptSourceType(step);
    var canonicalStepRef = String(step.canonical_step_id || "").trim();
    var liveWorkflowForPrompt = findWorkflowById(state.selectedWorkflowId || "");
    var liveStepForPrompt = null;
    if (liveWorkflowForPrompt && Array.isArray(liveWorkflowForPrompt.steps)) {
      liveStepForPrompt = liveWorkflowForPrompt.steps.find(function (row) {
        return String(row && row.id ? row.id : "") === String(step && step.id ? step.id : "");
      }) || null;
    }
    if (liveStepForPrompt) {
      source = String(
        liveStepForPrompt.prompt_source_type != null
          ? liveStepForPrompt.prompt_source_type
          : (liveStepForPrompt.prompt_source != null ? liveStepForPrompt.prompt_source : source)
      ).toLowerCase();
      source = normalizePromptSourceType(source);
      canonicalStepRef = String(
        liveStepForPrompt.canonical_step_id != null
          ? liveStepForPrompt.canonical_step_id
          : canonicalStepRef
      ).trim();
    }
    var noneOpt = document.createElement("option");
    noneOpt.value = "";
    var rawPromptIdValue =
      liveStepForPrompt && Object.prototype.hasOwnProperty.call(liveStepForPrompt, "promptId")
        ? liveStepForPrompt.promptId
        : step.promptId;
    var effectivePromptId = rawPromptIdValue == null ? "" : String(rawPromptIdValue).trim();
    var promptInstanceValue = "";
    noneOpt.textContent = getStepPromptEmptyOptionLabel({
      promptSource: source,
      promptId: effectivePromptId,
      canonicalStepId: canonicalStepRef,
      promptInstance: promptInstanceValue,
      stepTitle: step.title || ""
    });
    promptSelect.appendChild(noneOpt);
    state.prompts.forEach(function (p) {
      var opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = p.title || "(untitled)";
      if (step.promptId && step.promptId === p.id) {
        opt.selected = true;
      }
      promptSelect.appendChild(opt);
    });
    promptGroup.appendChild(promptLabel);
    promptGroup.appendChild(promptSelect);
    promptSelect.addEventListener("change", function () {
      var nextSource = promptSelect.value ? "library_prompt" : "none";
      li.setAttribute("data-prompt-source", nextSource);
      noneOpt.textContent = getStepPromptEmptyOptionLabel({
        promptSource: li.getAttribute("data-prompt-source") || "",
        promptId: promptSelect.value || "",
        canonicalStepId: li.getAttribute("data-canonical-step-id") || "",
        promptInstance: promptInstanceValue,
        stepTitle: step.title || ""
      });
    });

    var inputTypeGroup = document.createElement("div");
    inputTypeGroup.className = "form-group small";
    var inputTypeLabel = document.createElement("label");
    inputTypeLabel.className = "workflow-input-kind-label";
    inputTypeLabel.textContent = index === 0 ? "Initial input" : "Additional input";
    var inputTypeSelect = document.createElement("select");
    inputTypeSelect.setAttribute("data-field", "inputKind");
    var optText = document.createElement("option");
    optText.value = "text";
    optText.textContent = "Paste text";
    var optFile = document.createElement("option");
    optFile.value = "file";
    optFile.textContent = "Upload file";
    var optUrl = document.createElement("option");
    optUrl.value = "url";
    optUrl.textContent = "Provide URL";
    var optNone = document.createElement("option");
    optNone.value = "none";
    optNone.textContent = "None";
    inputTypeSelect.appendChild(optText);
    inputTypeSelect.appendChild(optFile);
    inputTypeSelect.appendChild(optUrl);
    inputTypeSelect.appendChild(optNone);
    var kind = step.inputKind || "text";
    if (kind !== "text" && kind !== "file" && kind !== "url" && kind !== "none") {
      kind = "text";
    }
    inputTypeSelect.value = kind;
    inputTypeGroup.appendChild(inputTypeLabel);
    inputTypeGroup.appendChild(inputTypeSelect);

    var inputBindingsGroup = document.createElement("div");
    inputBindingsGroup.className = "form-group workflow-input-bindings-group";
    var inputBindingsLabel = document.createElement("label");
    inputBindingsLabel.textContent = "Input artefacts";
    var inputBindingsControls = document.createElement("div");
    inputBindingsControls.className = "workflow-input-bindings-controls";

    var inputSourceSelect = document.createElement("select");
    inputSourceSelect.setAttribute("data-field", "inputBindingSource");
    var addInternalBtn = document.createElement("button");
    addInternalBtn.type = "button";
    addInternalBtn.className = "btn small";
    addInternalBtn.textContent = "Add";

    var externalInput = document.createElement("input");
    externalInput.type = "text";
    externalInput.placeholder = "Add external artefact...";
    externalInput.autocomplete = "off";
    var addExternalBtn = document.createElement("button");
    addExternalBtn.type = "button";
    addExternalBtn.className = "btn small";
    addExternalBtn.textContent = "Add external";

    inputBindingsControls.appendChild(inputSourceSelect);
    inputBindingsControls.appendChild(addInternalBtn);
    inputBindingsControls.appendChild(externalInput);
    inputBindingsControls.appendChild(addExternalBtn);

    var inputBindingsList = document.createElement("div");
    inputBindingsList.className = "workflow-input-bindings-list";

    function renderInputBindings() {
      inputBindingsList.innerHTML = "";
      var bindings = readStepInputBindings(li);
      if (!bindings.length) {
        var empty = document.createElement("span");
        empty.className = "helper-text";
        empty.textContent = "No input artefacts selected.";
        inputBindingsList.appendChild(empty);
        return;
      }
      bindings.forEach(function (binding, idx) {
        var chip = document.createElement("span");
        chip.className = "tag-pill";
        var label = "";
        if (binding.kind === "internal") {
          var sourceStepNumber = getStepNumberById(binding.sourceStepId);
          if (sourceStepNumber > 0) {
            label = "Step " + sourceStepNumber + ": " + binding.artifactName;
          } else {
            label = binding.artifactName;
          }
        } else {
          label = binding.artifactName;
        }
        chip.textContent = label;
        var remove = document.createElement("button");
        remove.type = "button";
        remove.className = "workflow-input-chip-remove";
        remove.textContent = "×";
        remove.setAttribute("aria-label", "Remove input artefact");
        remove.addEventListener("click", function () {
          var next = readStepInputBindings(li);
          next.splice(idx, 1);
          writeStepInputBindings(li, next);
          renderInputBindings();
        });
        chip.appendChild(remove);
        inputBindingsList.appendChild(chip);
      });
    }
    li.__renderInputBindings = renderInputBindings;

    addInternalBtn.addEventListener("click", function () {
      var raw = inputSourceSelect.value || "";
      if (!raw) return;
      var split = raw.split("::");
      if (split.length < 2) return;
      var sourceStepId = split[0];
      var artifactName = split.slice(1).join("::");
      var next = readStepInputBindings(li);
      var exists = next.some(function (b) {
        return b.kind === "internal" && b.sourceStepId === sourceStepId && b.artifactName === artifactName;
      });
      if (exists) return;
      next.push({ kind: "internal", sourceStepId: sourceStepId, artifactName: artifactName });
      writeStepInputBindings(li, next);
      renderInputBindings();
    });

    addExternalBtn.addEventListener("click", function () {
      var name = (externalInput.value || "").trim();
      if (!name) return;
      var next = readStepInputBindings(li);
      var exists = next.some(function (b) {
        return b.kind === "external" && b.artifactName === name;
      });
      if (!exists) {
        next.push({ kind: "external", sourceStepId: "", artifactName: name });
        writeStepInputBindings(li, next);
        renderInputBindings();
      }
      externalInput.value = "";
    });

    inputBindingsGroup.appendChild(inputBindingsLabel);
    inputBindingsGroup.appendChild(inputBindingsControls);
    inputBindingsGroup.appendChild(inputBindingsList);

    var outputGroup = document.createElement("div");
    outputGroup.className = "form-group small";
    var outputLabel = document.createElement("label");
    outputLabel.textContent = "Output name";
    var outputInput = document.createElement("input");
    outputInput.type = "text";
    outputInput.value = step.outputName || "";
    outputInput.setAttribute("data-field", "outputName");
    outputInput.placeholder = "e.g. summary, quizQuestions";
    outputInput.autocomplete = "off";
    outputGroup.appendChild(outputLabel);
    outputGroup.appendChild(outputInput);

    titleInput.addEventListener("input", function () {
      refreshWorkflowInputSources();
    });
    outputInput.addEventListener("input", function () {
      refreshWorkflowInputSources();
    });

    fields.appendChild(titleGroup);
    fields.appendChild(roleGroup);
    fields.appendChild(promptGroup);
    fields.appendChild(inputTypeGroup);
    fields.appendChild(inputBindingsGroup);
    fields.appendChild(outputGroup);

    var notesGroup = document.createElement("div");
    notesGroup.className = "form-group workflow-step-notes";
    var notesLabel = document.createElement("label");
    notesLabel.setAttribute("data-role", "notes-label");
    notesLabel.textContent = "Notes";
    var notesArea = document.createElement("textarea");
    notesArea.rows = 2;
    notesArea.setAttribute("data-field", "notes");
    notesArea.placeholder =
      "Optional: add runner-specific notes, such as external resources to paste in or checks before running this step.";
    notesArea.autocomplete = "off";
    notesArea.value = step.notes || "";
    var runSummary = document.createElement("div");
    runSummary.className = "workflow-step-run-summary hidden";
    runSummary.setAttribute("data-role", "runner-summary");
    var runSummaryBody = document.createElement("div");
    runSummaryBody.className = "small muted";
    runSummaryBody.setAttribute("data-role", "runner-summary-body");
    runSummary.appendChild(runSummaryBody);
    notesGroup.appendChild(runSummary);
    notesGroup.appendChild(notesLabel);
    notesGroup.appendChild(notesArea);

    li.appendChild(header);
    li.appendChild(fields);
    li.appendChild(notesGroup);
    renderInputBindings();
    return li;
  }

  function gatherWorkflowDetailFormData() {
    var name = (els.workflowName && els.workflowName.value) || "";
    var artefacts = (els.workflowArtefacts && els.workflowArtefacts.value) || "";
    var workflowOutputs = (els.workflowOutputs && els.workflowOutputs.value) || "";
    var workflowOutputSpec = normalizeWorkflowOutputSpec({
      audience: (els.workflowAudience && els.workflowAudience.value) || "",
      goal: (els.workflowGoal && els.workflowGoal.value) || "",
      constraints: (els.workflowConstraints && els.workflowConstraints.value) || ""
    });

    var steps = [];
    if (els.workflowSteps) {
      Array.prototype.forEach.call(els.workflowSteps.children, function (child) {
        if (!child.classList.contains("workflow-step")) return;
        var id = child.getAttribute("data-step-id") ||
          (window.Utils && window.Utils.uuid ? window.Utils.uuid() : String(Date.now()));
        var inputBindings = readStepInputBindings(child);
        var titleInput = child.querySelector('[data-field="title"]');
        var roleInput = child.querySelector('[data-field="roleLabel"]');
        var promptSelect = child.querySelector('[data-field="promptId"]');
        var inputKindSelect = child.querySelector('[data-field="inputKind"]');
        var outputInput = child.querySelector('[data-field="outputName"]');
        var notesArea = child.querySelector('[data-field="notes"]');
        var existingWf = findWorkflowById(state.selectedWorkflowId || "");
        var existingStep = null;
        if (existingWf && Array.isArray(existingWf.steps)) {
          existingStep = existingWf.steps.find(function (row) {
            return String(row && row.id ? row.id : "") === String(id || "");
          }) || null;
        }
        var promptIdValue = promptSelect ? promptSelect.value || "" : "";
        var existingSource =
          String(child.getAttribute("data-prompt-source") || "").trim() ||
          (existingStep && existingStep.prompt_source_type ? existingStep.prompt_source_type : "") ||
          (existingStep && existingStep.prompt_source ? existingStep.prompt_source : "");
        var sourceType = normalizePromptSourceType(existingSource);
        if (promptIdValue) {
          sourceType = "library_prompt";
        } else if (sourceType === "library_prompt") {
          sourceType = "none";
        }
        var overrideBodyValue =
          existingStep && typeof existingStep.override_prompt_body === "string"
            ? existingStep.override_prompt_body
            : "";
        var finalPromptId = sourceType === "library_prompt" ? promptIdValue : "";
        steps.push({
          id: id,
          title: titleInput ? titleInput.value : "",
          roleLabel: roleInput ? roleInput.value : "",
          promptId: finalPromptId,
          prompt_source_type: sourceType,
          prompt_source: sourceType,
          canonical_step_id:
            String(child.getAttribute("data-canonical-step-id") || "").trim() ||
            (existingStep && existingStep.canonical_step_id ? existingStep.canonical_step_id : ""),
          domain_version:
            String(child.getAttribute("data-domain-version") || "").trim() ||
            (existingStep && existingStep.domain_version ? existingStep.domain_version : ""),
          prompt_instance: "",
          prompt_bindings:
            existingStep && existingStep.prompt_bindings && typeof existingStep.prompt_bindings === "object"
              ? JSON.parse(JSON.stringify(existingStep.prompt_bindings))
              : null,
          override_prompt_body: overrideBodyValue,
          inputKind: inputKindSelect ? (inputKindSelect.value || "text") : "text",
          outputName: outputInput ? outputInput.value : "",
          notes: notesArea
            ? (
                notesArea.hasAttribute("data-run-raw-notes")
                  ? String(notesArea.getAttribute("data-run-raw-notes") || "")
                  : notesArea.value
              )
            : "",
          inputBindings: inputBindings
        });
      });
    }

    return {
      id: state.selectedWorkflowId,
      name: name.trim() || "Untitled workflow",
      selectedDomains: getSelectedWorkflowDomains(),
      artefacts: artefacts.trim(),
      workflowInputs: parseStringList(artefacts),
      workflowOutputs: parseStringList(workflowOutputs),
      workflowOutputSpec: workflowOutputSpec,
      steps: steps
    };
  }

  function handleNewWorkflow() {
    clearWorkflowDetail();
    if (els.workflowName) {
      els.workflowName.focus();
    }
  }

  function handleAddWorkflowStep() {
    if (!els.workflowSteps) return;
    // Remove empty placeholder if present.
    var empties = els.workflowSteps.querySelectorAll(".workflow-steps-empty");
    empties.forEach(function (n) {
      els.workflowSteps.removeChild(n);
    });
    var step = {
      id: window.Utils && window.Utils.uuid ? window.Utils.uuid() : String(Date.now()),
      title: "",
      roleLabel: "",
      promptId: "",
      inputKind: "text",
      outputName: "",
      notes: "",
      inputBindings: []
    };
    var index = els.workflowSteps.children.length;
    var li = createWorkflowStepElement(step, index);
    els.workflowSteps.appendChild(li);
    renumberWorkflowSteps();
  }

  function handleSaveWorkflow() {
    if (!els.workflowName) return;
    var data = gatherWorkflowDetailFormData();
    data.steps = (Array.isArray(data.steps) ? data.steps : []).map(function (step) {
      var s = Object.assign({}, step || {});
      var sourceType = getStepPromptSourceType(s);
      if (s.promptId) sourceType = "library_prompt";
      s.prompt_source_type = sourceType;
      s.prompt_source = sourceType;
      if (sourceType === "library_prompt") {
        s.override_prompt_body = String(s.override_prompt_body || "").trim();
      } else if (sourceType === "local_override") {
        s.promptId = "";
      } else {
        s.promptId = "";
        s.override_prompt_body = "";
      }
      s.prompt_instance = "";
      s.prompt_bindings =
        s.prompt_bindings && typeof s.prompt_bindings === "object"
          ? s.prompt_bindings
          : {};
      return s;
    });
    if (!data.name || !data.name.trim()) {
      showToast("Workflow name cannot be empty.", "error");
      return;
    }

    var warnings = validateWorkflow(data);
    renderWorkflowValidationWarnings(warnings);
    if (warnings.length) {
      showToast(
        "Workflow saved with " + warnings.length + " warning(s). Check Validation warnings.",
        "warning"
      );
    }

    var existingIdx = data.id
      ? state.workflows.findIndex(function (w) {
          return w.id === data.id;
        })
      : -1;

    var now = Date.now();
    if (existingIdx >= 0) {
      var existing = state.workflows[existingIdx];
      data.id = existing.id;
      data.createdAt = typeof existing.createdAt === "number" ? existing.createdAt : now;
      data.updatedAt = now;
      state.workflows[existingIdx] = data;
    } else {
      data.id =
        window.Utils && window.Utils.uuid ? window.Utils.uuid() : String(Date.now());
      data.createdAt = now;
      data.updatedAt = now;
      state.workflows.push(data);
    }

    state.selectedWorkflowId = data.id;
    saveWorkflows();
    renderWorkflowList();
    selectWorkflow(data.id);
    renderLibraryList();
    if (!warnings.length) {
      showToast("Workflow saved.", "success");
    }
  }

  function handleDuplicateWorkflow() {
    if (!state.selectedWorkflowId) return;
    var wf = findWorkflowById(state.selectedWorkflowId);
    if (!wf) return;
    var now = Date.now();
    var clone = JSON.parse(JSON.stringify(wf));
    clone.id = window.Utils && window.Utils.uuid ? window.Utils.uuid() : String(now);
    clone.name = (clone.name || "Untitled workflow") + " (copy)";
    clone.createdAt = now;
    clone.updatedAt = now;
    var oldToNew = {};
    (clone.steps || []).forEach(function (step) {
      var newId = window.Utils && window.Utils.uuid ? window.Utils.uuid() : String(now + Math.random());
      oldToNew[step.id] = newId;
    });
    clone.steps = (clone.steps || []).map(function (step) {
      var s = Object.assign({}, step);
      s.id = oldToNew[step.id] || s.id;
      s.inputBindings = normalizeStepInputBindings(step.inputBindings || []).map(function (b) {
        if (b.kind !== "internal") return b;
        return {
          kind: "internal",
          artifactName: b.artifactName,
          sourceStepId: oldToNew[b.sourceStepId] || b.sourceStepId
        };
      });
      return s;
    });
    state.workflows.push(clone);
    saveWorkflows();
    renderWorkflowList();
    selectWorkflow(clone.id);
    renderLibraryList();
    showToast("Workflow duplicated.", "success");
  }

  function handleRenameWorkflow() {
    if (!state.selectedWorkflowId) return;
    var wf = findWorkflowById(state.selectedWorkflowId);
    if (!wf) return;

    var currentName = wf.name || "Untitled workflow";
    var suggested = currentName + " (copy)";
    var nextName = window.prompt("New name for the duplicated workflow:", suggested);
    if (nextName === null) {
      // User cancelled.
      return;
    }

    nextName = String(nextName || "").trim();
    if (!nextName) {
      showToast("Workflow name cannot be empty.", "error");
      return;
    }

    var now = Date.now();
    var clone = JSON.parse(JSON.stringify(wf));
    clone.id = window.Utils && window.Utils.uuid ? window.Utils.uuid() : String(now);
    clone.name = nextName;
    clone.createdAt = now;
    clone.updatedAt = now;

    var oldToNew = {};
    (clone.steps || []).forEach(function (step) {
      var newId =
        window.Utils && window.Utils.uuid
          ? window.Utils.uuid()
          : String(now + Math.random());
      oldToNew[step.id] = newId;
    });

    clone.steps = (clone.steps || []).map(function (step) {
      var s = Object.assign({}, step);
      s.id = oldToNew[step.id] || s.id;
      s.inputBindings = normalizeStepInputBindings(step.inputBindings || []).map(function (b) {
        if (b.kind !== "internal") return b;
        return {
          kind: "internal",
          artifactName: b.artifactName,
          sourceStepId: oldToNew[b.sourceStepId] || b.sourceStepId
        };
      });
      return s;
    });

    state.workflows.push(clone);
    saveWorkflows();
    renderWorkflowList();
    selectWorkflow(clone.id);
    renderLibraryList();
    showToast("Workflow duplicated and renamed.", "success");
  }

  function handleDeleteWorkflow() {
    if (!state.selectedWorkflowId) return;
    var wf = findWorkflowById(state.selectedWorkflowId);
    var title = wf ? wf.name || "this workflow" : "this workflow";
    var confirmed = window.confirm(
      'Delete "' + title + "\"? This cannot be undone."
    );
    if (!confirmed) return;

    state.workflows = state.workflows.filter(function (w) {
      return w.id !== state.selectedWorkflowId;
    });
    state.selectedWorkflowId = null;
    saveWorkflows();
    renderWorkflowList();
    clearWorkflowDetail();
    renderLibraryList();
    showToast("Workflow deleted.", "success");
    if (els.exportWorkflowBtn) {
      els.exportWorkflowBtn.disabled = true;
    }
  }

  function handleWorkflowListClick(event) {
    var target = event.target;
    while (target && target !== els.workflowList) {
      if (target.classList && target.classList.contains("workflow-item")) {
        var id = target.getAttribute("data-workflow-id");
        if (id) {
          selectWorkflow(id);
        }
        return;
      }
      target = target.parentNode;
    }
  }

  function buildWorkflowSummaryText(wf) {
    if (!wf) return "";
    var lines = [];
    lines.push("Workflow: " + (wf.name || "Untitled workflow"));
    if (Array.isArray(wf.selectedDomains) && wf.selectedDomains.length) {
      lines.push("Domain: " + wf.selectedDomains.join(", "));
    }
    if (wf.artefacts) {
      lines.push("");
      lines.push("Workflow inputs / artefacts:");
      lines.push(wf.artefacts);
    }
    if (wf.startingArtefact) {
      lines.push("Starting artefact: " + wf.startingArtefact);
    }
    if (Array.isArray(wf.workflowOutputs) && wf.workflowOutputs.length) {
      lines.push("");
      lines.push("Workflow outputs (list):");
      lines.push(wf.workflowOutputs.join(", "));
    }
    var outputSpec = normalizeWorkflowOutputSpec(wf.workflowOutputSpec);
    if (
      outputSpec.audience ||
      outputSpec.goal ||
      outputSpec.constraints
    ) {
      lines.push("");
      lines.push("Workflow output spec:");
      if (outputSpec.audience) lines.push("Audience: " + outputSpec.audience);
      if (outputSpec.goal) lines.push("Goal / outcome: " + outputSpec.goal);
      if (outputSpec.constraints) lines.push("Constraints and must haves: " + outputSpec.constraints);
    }
    if (wf.steps && wf.steps.length) {
      lines.push("");
      lines.push("Steps:");
      wf.steps.forEach(function (step, index) {
        lines.push("");
        lines.push("Step " + (index + 1) + ": " + (step.title || "Untitled step"));
        if (step.roleLabel) {
          lines.push("  Role / purpose: " + step.roleLabel);
        }
        if (step.inputKind) {
          var kindLabel =
            step.inputKind === "file"
              ? "Upload file"
              : step.inputKind === "url"
              ? "Provide URL"
              : step.inputKind === "none"
              ? "None"
              : "Paste text";
          lines.push("  Additional input: " + kindLabel);
        }
        if (step.outputName) {
          lines.push("  Output name: " + step.outputName);
        }
        if (step.promptId) {
          var p = findPromptById(step.promptId);
          if (p) {
            lines.push("  Uses library prompt: " + (p.title || p.id));
          }
        }
        if (step.notes) {
          lines.push("  Inputs & how to use them:");
          lines.push("  " + step.notes);
        }
      });
    }
    return lines.join("\n");
  }

  function isFoundationUpstreamStep(step) {
    var canonicalId = normalizeCanonicalStepId(step && step.canonical_step_id ? step.canonical_step_id : "");
    var title = String((step && step.title) || "").toLowerCase();
    return !!(
      canonicalId === "step_generate_learning_content" ||
      canonicalId === "generate_learning_content" ||
      canonicalId === "step_model_knowledge" ||
      canonicalId === "model_knowledge" ||
      canonicalId === "step_define_learning_outcomes" ||
      canonicalId === "define_learning_outcomes" ||
      title === "generate learning content" ||
      title === "model knowledge" ||
      title === "define learning outcomes"
    );
  }

  function sanitizeAssessmentCuesForUpstreamContext(text) {
    var raw = String(text || "").trim();
    if (!raw) return "";
    var s = " " + raw + " ";
    // Remove the most common assessment-item generation tails while preserving topic context.
    s = s.replace(/\b(generate|create|produce|write|build)\s+\d+\s+(mcq|mcqs|multiple[ -]?choice(?:\s+questions?)?)\b[^.:\n;]*/gi, " ");
    s = s.replace(/\b(with|including)\s+(model answers?|answer key|brief feedback|feedback guidance)\b[^.:\n;]*/gi, " ");
    // Remove standalone high-leak assessment cues.
    s = s.replace(/\b(mcq|mcqs|multiple[ -]?choice(?:\s+questions?)?|question bank|item bank|assessment items?|model answers?|answer key|total_items?|number of items?)\b/gi, " ");
    s = s.replace(/\s{2,}/g, " ").trim();
    return s;
  }

  function isAssessmentLeakLine(text) {
    var l = String(text || "").toLowerCase();
    return /\b(mcq|mcqs|multiple[ -]?choice|question bank|item bank|assessment items?|model answers?|answer key|total_items?|number of items?)\b/.test(l);
  }

  function buildWorkflowRuntimeContextText(wf, step) {
    if (!wf || typeof wf !== "object") return "";
    var lines = [];
    var name = String(wf.name || "").trim();
    var outputSpec = normalizeWorkflowOutputSpec(wf.workflowOutputSpec);
    var inputs = Array.isArray(wf.workflowInputs) ? wf.workflowInputs : parseStringList(wf.artefacts || "");
    var outputs = Array.isArray(wf.workflowOutputs) ? wf.workflowOutputs : [];
    var suppressAssessmentCues = isFoundationUpstreamStep(step);
    if (name) lines.push("Workflow: " + name);
    var goalText = suppressAssessmentCues
      ? sanitizeAssessmentCuesForUpstreamContext(outputSpec.goal)
      : outputSpec.goal;
    if (goalText) lines.push("Goal: " + goalText);
    if (outputSpec.audience) lines.push("Audience: " + outputSpec.audience);
    var constraintsText = String(outputSpec.constraints || "").trim();
    if (constraintsText) {
      if (suppressAssessmentCues) {
        var keptConstraintLines = constraintsText
          .split(/\r?\n|[;]+/)
          .map(function (line) { return String(line || "").trim(); })
          .filter(function (line) { return !!line && !isAssessmentLeakLine(line); });
        constraintsText = keptConstraintLines.join("; ");
      }
      if (constraintsText) lines.push("Constraints: " + constraintsText);
    }
    if (inputs.length) lines.push("Inputs: " + inputs.join(", "));
    if (outputs.length) {
      var effectiveOutputs = suppressAssessmentCues
        ? outputs.filter(function (o) { return !isAssessmentLeakLine(o); })
        : outputs.slice();
      if (effectiveOutputs.length) {
        lines.push("Desired outputs: " + effectiveOutputs.join(", "));
      }
    }
    if (suppressAssessmentCues) {
      lines.push(
        "Step boundary: For this upstream step, do not generate assessment items/questions/options/model answers yet."
      );
    }
    return lines.join("\n");
  }

  function buildWorkflowStepInstructions(step, index, domElement) {
    if (!step) return "";
    var lines = [];

    var stepNumber = index + 1;

    lines.push(
      "Execution mode: autonomous. Do not ask the user follow-up questions. If something is ambiguous, choose the most reasonable interpretation from provided workflow context and continue."
    );

    lines.push(
      "This step is titled: " + (step.title || "Untitled step") + "."
    );
    if (step.roleLabel) {
      lines.push("Role / purpose of this step: " + step.roleLabel + ".");
    }
    var runnerInstructions = getRunnerInstructionsForStep(step);
    if (runnerInstructions) {
      lines.push("");
      lines.push("Runner guidance:");
      if (runnerInstructions.what_this_step_does) {
        lines.push("- What this step does: " + runnerInstructions.what_this_step_does);
      }
      if (runnerInstructions.what_to_expect) {
        lines.push("- What to expect: " + runnerInstructions.what_to_expect);
      }
      if (runnerInstructions.what_to_check) {
        lines.push("- What to check: " + runnerInstructions.what_to_check);
      }
    }
    var kindLabel =
      step.inputKind === "file"
        ? "Upload file"
        : step.inputKind === "url"
        ? "Provide URL"
        : step.inputKind === "none"
        ? "None"
        : "Paste text";
    lines.push("Optional additional input for this step: " + kindLabel + ".");
    if (step.outputName) {
      lines.push(
        "Name the final result of this step as: " + step.outputName + "."
      );
      lines.push(
        'At the end of your answer, restate the final output on a separate line, prefixed with "STEP ' +
          stepNumber +
          ' OUTPUT:".'
      );
    }

    var bindings = [];
    if (domElement) {
      bindings = readStepInputBindings(domElement);
    } else if (Array.isArray(step.inputBindings)) {
      bindings = normalizeStepInputBindings(step.inputBindings);
    }

    if (bindings.length) {
      lines.push("");
      lines.push("Input artefacts for this step:");
      bindings.forEach(function (b) {
        if (b.kind === "internal") {
          var sourceTitle = getStepTitleById(b.sourceStepId) || "an earlier step";
          lines.push(
            '- "' + b.artifactName + '" from step "' + sourceTitle + '".'
          );
        } else {
          lines.push('- External artefact: "' + b.artifactName + '".');
        }
      });
    }

    var visibleNotes = stripWorkflowStepParamBlock(step.notes || "");
    if (visibleNotes) {
      lines.push("");
      lines.push("How to use inputs for this step (from the workflow designer):");
      lines.push(visibleNotes);
    }

    var resolvedPrompt = resolveStepPromptText(step);
    var promptBody = resolvedPrompt && resolvedPrompt.text ? String(resolvedPrompt.text) : "";
    if (!promptBody && !step.notes) {
      // Not enough information to be useful.
      return "";
    }

    if (promptBody) {
      lines.push("");
      lines.push("Here is the core prompt for this step:");
      lines.push("");
      lines.push(promptBody);
    }

    return lines.join("\n");
  }

  function handleCopyWorkflowSummary() {
    if (!state.selectedWorkflowId) {
      showToast("Select or create a workflow first.", "error");
      return;
    }
    var wf = findWorkflowById(state.selectedWorkflowId);
    if (!wf) {
      showToast("Workflow not found.", "error");
      return;
    }
    var summary = buildWorkflowSummaryText(wf);
    if (!summary) {
      showToast("Nothing to copy yet. Add some details to the workflow first.", "error");
      return;
    }
    if (!window.Utils || !window.Utils.copyText) {
      showToast("Clipboard helper is not available.", "error");
      return;
    }
    window.Utils
      .copyText(summary)
      .then(function (ok) {
        if (ok) {
          showToast("Workflow summary copied to clipboard.", "success");
        } else {
          showToast("Unable to copy workflow summary to clipboard.", "error");
        }
      })
      .catch(function () {
        showToast("Unable to copy workflow summary to clipboard.", "error");
      });
  }

  function parseStringList(text) {
    return String(text || "")
      .split(/[\n,]/)
      .map(function (s) {
        return s.trim();
      })
      .filter(function (s) {
        return !!s;
      });
  }

  function formatStringList(list) {
    if (!Array.isArray(list)) return "";
    return list
      .map(function (s) {
        return String(s || "").trim();
      })
      .filter(function (s) {
        return !!s;
      })
      .join(", ");
  }

  function normalizeWorkflowOutputSpec(spec) {
    var s = spec && typeof spec === "object" ? spec : {};
    return {
      audience: String(s.audience || "").trim(),
      goal: String(s.goal || "").trim(),
      constraints: String(s.constraints || "").trim()
    };
  }

  function compressWorkflowConstraints(rawText) {
    var text = String(rawText || "").trim();
    if (!text) return { critical: [], secondary: [], compact: "" };
    var criticalKeys = [
      "duration",
      "time",
      "audience",
      "learner",
      "level",
      "required output",
      "output",
      "format",
      "must",
      "deadline"
    ];
    var secondaryKeys = [
      "style",
      "tone",
      "example",
      "pedagog",
      "illustrat",
      "voice",
      "readability"
    ];
    var rows = text
      .split(/\r?\n|[;]+/)
      .map(function (line) {
        return String(line || "").trim();
      })
      .map(function (line) {
        return line.replace(/^[-*]\s+/, "").trim();
      })
      .filter(function (line) {
        return !!line;
      });
    var critical = [];
    var secondary = [];
    function isLikelyCritical(line) {
      var l = String(line || "").toLowerCase();
      return criticalKeys.some(function (k) {
        return l.indexOf(k) !== -1;
      });
    }
    function isLikelySecondary(line) {
      var l = String(line || "").toLowerCase();
      return secondaryKeys.some(function (k) {
        return l.indexOf(k) !== -1;
      });
    }
    rows.forEach(function (line) {
      if (isLikelyCritical(line)) {
        critical.push(line);
      } else if (isLikelySecondary(line)) {
        secondary.push(line);
      } else {
        // Default unknown constraints to critical so important intent is preserved.
        critical.push(line);
      }
    });
    function dedupe(list) {
      var seen = {};
      return list.filter(function (x) {
        var k = String(x || "").toLowerCase();
        if (!k || seen[k]) return false;
        seen[k] = true;
        return true;
      });
    }
    critical = dedupe(critical).slice(0, 5);
    secondary = dedupe(secondary).slice(0, 3);
    var parts = [];
    if (critical.length) parts.push("critical: " + critical.join(" | "));
    if (secondary.length) parts.push("secondary: " + secondary.join(" | "));
    return {
      critical: critical,
      secondary: secondary,
      compact: parts.join(" ; ")
    };
  }

  function buildPromptFactoryWorkflowContextText(ctx, options) {
    if (!ctx || typeof ctx !== "object") return "";
    var opts = options && typeof options === "object" ? options : {};
    var includeWorkflowGoalContext = opts.includeWorkflowGoalContext !== false;
    var promptScope = String(opts.promptScope || "step_only").toLowerCase();
    var stepOnly = promptScope === "step_only";
    var lines = [];
    if (ctx.workflowName) lines.push("Workflow: " + ctx.workflowName);
    if (includeWorkflowGoalContext && ctx.workflowGoal) lines.push("Workflow goal: " + ctx.workflowGoal);
    if (!stepOnly && ctx.workflowArtefacts) {
      lines.push("Workflow inputs / artefacts: " + ctx.workflowArtefacts);
    } else if (!stepOnly && Array.isArray(ctx.workflowInputs) && ctx.workflowInputs.length) {
      lines.push("Workflow inputs: " + ctx.workflowInputs.join(", "));
    }
    if (!stepOnly && Array.isArray(ctx.workflowOutputs) && ctx.workflowOutputs.length) {
      lines.push("Workflow outputs: " + ctx.workflowOutputs.join(", "));
    }
    if (ctx.stepTitle) lines.push("Current step title: " + ctx.stepTitle);
    if (ctx.stepCanonicalTitle) lines.push("Canonical step title: " + ctx.stepCanonicalTitle);
    if (ctx.stepCanonicalStepId) lines.push("Canonical step id: " + ctx.stepCanonicalStepId);
    if (ctx.domainVersion) lines.push("Domain version: " + ctx.domainVersion);
    if (ctx.stepPromptSource) lines.push("Prompt source: " + ctx.stepPromptSource);
    if (ctx.stepRoleLabel) lines.push("Current step role/purpose: " + ctx.stepRoleLabel);
    if (ctx.stepOutputName) lines.push("Current step output artefact: " + ctx.stepOutputName);
    if (ctx.stepAdditionalInput) lines.push("Current step additional input: " + ctx.stepAdditionalInput);
    if (Array.isArray(ctx.stepInputArtefacts) && ctx.stepInputArtefacts.length) {
      lines.push("Current step input artefacts:");
      ctx.stepInputArtefacts.forEach(function (item) {
        lines.push("- " + item);
      });
    }
    if (Array.isArray(ctx.stepInputArtefactSchemas) && ctx.stepInputArtefactSchemas.length) {
      lines.push("Known typed input artefacts with system schemas:");
      ctx.stepInputArtefactSchemas.forEach(function (row) {
        if (!row) return;
        var t = String(row.type || row.artefact || "").trim();
        if (t) lines.push("- " + t);
      });
    }
    var visibleStepNotes = stripWorkflowStepParamBlock(ctx.stepNotes || "");
    if (visibleStepNotes) lines.push("Step instructions from workflow: " + visibleStepNotes);
    if (
      includeWorkflowGoalContext &&
      !stepOnly &&
      ctx.workflowOutputSpec &&
      typeof ctx.workflowOutputSpec === "object"
    ) {
      lines.push("Workflow-owned brief parameters:");
      if (ctx.workflowOutputSpec.audience) lines.push("- Audience: " + ctx.workflowOutputSpec.audience);
      if (ctx.workflowOutputSpec.goal) lines.push("- Goal / outcome: " + ctx.workflowOutputSpec.goal);
      if (ctx.workflowOutputSpec.constraints) {
        var compressed = compressWorkflowConstraints(ctx.workflowOutputSpec.constraints);
        if (compressed.compact) {
          lines.push("- Constraints (compressed): " + compressed.compact);
        }
      }
    }
    return lines.join("\n");
  }

  function normalizeWorkflowForV1(rawWorkflow, warningTarget) {
    if (!Array.isArray(warningTarget)) warningTarget = [];
    if (!rawWorkflow || typeof rawWorkflow !== "object") return rawWorkflow;
    var wf = Object.assign({}, rawWorkflow);
    var rawSteps = Array.isArray(rawWorkflow.steps) ? rawWorkflow.steps : [];
    var normalizedSteps = [];
    var outputNameByStepId = {};
    var outputNameByStepIndex = {};

    rawSteps.forEach(function (step, index) {
      var s = Object.assign({}, step || {});
      s.id =
        String(s.id || "").trim() ||
        (window.Utils && window.Utils.uuid ? window.Utils.uuid() : String(Date.now() + index));
      s.outputName = String(s.outputName || "").trim();
      s.prompt_source = String(s.prompt_source || s.promptSource || "").trim().toLowerCase();
      s.prompt_source_type = normalizePromptSourceType(
        s.prompt_source_type || s.promptSourceType || s.prompt_source || s.promptSource || ""
      );
      s.canonical_step_id = String(s.canonical_step_id || s.canonicalStepId || "").trim();
      s.domain_version = String(s.domain_version || s.domainVersion || "").trim();
      if (s.prompt_source_type === "none") {
        if (s.override_prompt_body || s.overridePromptBody) {
          s.prompt_source_type = "local_override";
        } else if (s.promptId) {
          s.prompt_source_type = "library_prompt";
        }
      }
      s.override_prompt_body = String(s.override_prompt_body || s.overridePromptBody || "").trim();
      if (s.prompt_source_type === "library_prompt") {
        s.override_prompt_body = String(s.override_prompt_body || "").trim();
      } else if (s.prompt_source_type === "local_override") {
        s.promptId = "";
      } else {
        s.promptId = "";
        s.override_prompt_body = "";
      }
      s.prompt_source = s.prompt_source_type;
      s.prompt_instance = "";
      delete s.canonical_prompt_id;
      delete s.canonicalPromptId;
      delete s.canonical_prompt_version;
      delete s.canonicalPromptVersion;
      s.prompt_bindings =
        s.prompt_bindings && typeof s.prompt_bindings === "object"
          ? JSON.parse(JSON.stringify(s.prompt_bindings))
          : null;
      outputNameByStepId[s.id] = s.outputName || "";
      outputNameByStepIndex[index + 1] = s.outputName || "";
      normalizedSteps.push(s);
    });

    normalizedSteps.forEach(function (s, index) {
      var inputBindings = normalizeStepInputBindings(s.inputBindings || []);
      if (!inputBindings.length && Array.isArray(s.depends_on) && s.depends_on.length) {
        s.depends_on.forEach(function (dep) {
          var sourceStepId = "";
          var sourceIndex = null;
          if (typeof dep === "number") {
            sourceIndex = dep;
            var fromStep = normalizedSteps[dep - 1];
            sourceStepId = fromStep && fromStep.id ? String(fromStep.id) : "";
          } else if (typeof dep === "string") {
            sourceStepId = dep.trim();
            var idx = normalizedSteps.findIndex(function (row) {
              return row.id === sourceStepId;
            });
            sourceIndex = idx >= 0 ? idx + 1 : null;
          }
          if (!sourceStepId) {
            warningTarget.push(
              "Step " + (index + 1) + " has unresolved depends_on reference: " + String(dep)
            );
            return;
          }
          var sourceOutput = outputNameByStepId[sourceStepId];
          if (!sourceOutput && sourceIndex && outputNameByStepIndex[sourceIndex]) {
            sourceOutput = outputNameByStepIndex[sourceIndex];
          }
          var artifactName =
            sourceOutput ||
            ("step_" +
              (sourceIndex || "?") +
              "_output");
          if (!sourceOutput) {
            warningTarget.push(
              "Step " +
                (index + 1) +
                " depends on step " +
                (sourceIndex || sourceStepId) +
                " with no outputName; using '" +
                artifactName +
                "'."
            );
          }
          inputBindings.push({
            kind: "internal",
            sourceStepId: sourceStepId,
            artifactName: artifactName
          });
        });
      }
      s.inputBindings = normalizeStepInputBindings(inputBindings);
      delete s.depends_on;
      normalizedSteps[index] = s;
    });

    wf.workflowInputs = Array.isArray(wf.workflowInputs)
      ? wf.workflowInputs
      : parseStringList(wf.workflowInputs || "");
    wf.workflowOutputs = Array.isArray(wf.workflowOutputs)
      ? wf.workflowOutputs
      : parseStringList(wf.workflowOutputs || "");
    var normalizedDomains = Array.isArray(wf.selectedDomains)
      ? wf.selectedDomains.filter(function (d) {
          return typeof d === "string" && d.trim();
        })
      : [];
    var existingExtra = normalizedDomains.find(function (d) {
      return d && d !== "general";
    });
    wf.selectedDomains = existingExtra ? ["general", existingExtra] : ["general"];
    wf.workflowOutputSpec = normalizeWorkflowOutputSpec(wf.workflowOutputSpec);
    if (
      !wf.workflowOutputSpec.constraints &&
      typeof wf.scopeAndConstraints === "string" &&
      wf.scopeAndConstraints.trim()
    ) {
      wf.workflowOutputSpec.constraints = wf.scopeAndConstraints.trim();
    }
    if (!wf.workflowOutputSpec.goal && typeof wf.description === "string") {
      wf.workflowOutputSpec.goal = String(wf.description || "").trim();
    }
    delete wf.scopeAndConstraints;
    delete wf.description;
    wf.steps = normalizedSteps;
    return wf;
  }

  function validateWorkflow(wf) {
    var warnings = [];
    if (!wf || typeof wf !== "object") return warnings;
    var steps = Array.isArray(wf.steps) ? wf.steps : [];
    var stepById = {};
    steps.forEach(function (s, i) {
      stepById[s.id] = { step: s, index: i };
    });
    steps.forEach(function (s, i) {
      var promptResolved = resolveStepPromptText(s);
      if (!promptResolved.text) {
        warnings.push(
          "Step " + (i + 1) + " has no runnable prompt configured (" +
          (promptResolved.error || "No prompt configured") +
          ")."
        );
      }
      var bindings = normalizeStepInputBindings(s.inputBindings || []);
      bindings.forEach(function (b) {
        if (b.kind !== "internal") return;
        var ref = stepById[b.sourceStepId];
        if (!ref) {
          warnings.push("Step " + (i + 1) + " references missing source step.");
          return;
        }
        if (ref.index >= i) {
          warnings.push("Step " + (i + 1) + " depends on same/later step.");
        }
        if (!String(ref.step.outputName || "").trim()) {
          warnings.push(
            "Step " +
              (i + 1) +
              " depends on step " +
              (ref.index + 1) +
              " which has no outputName."
          );
        }
      });
    });
    return dedupeWarnings(warnings);
  }

  function dedupeWarnings(items) {
    var seen = {};
    var out = [];
    (Array.isArray(items) ? items : []).forEach(function (item) {
      var key = String(item || "").trim();
      if (!key || seen[key]) return;
      seen[key] = true;
      out.push(key);
    });
    return out;
  }

  function renderWorkflowValidationWarnings(warnings) {
    if (!els.workflowValidationPanel) return;
    var items = dedupeWarnings(warnings);
    if (!items.length) {
      els.workflowValidationPanel.classList.add("hidden");
      els.workflowValidationPanel.innerHTML = "";
      return;
    }
    var html = '<strong>Validation warnings</strong><ul>';
    items.forEach(function (w) {
      html += "<li>" + String(w).replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</li>";
    });
    html += "</ul>";
    els.workflowValidationPanel.innerHTML = html;
    els.workflowValidationPanel.classList.remove("hidden");
  }

  function collectPromptsForWorkflows(workflows) {
    if (!Array.isArray(workflows) || !workflows.length) {
      return [];
    }
    var ids = {};
    workflows.forEach(function (wf) {
      (wf.steps || []).forEach(function (step) {
        if (step && step.promptId) {
          ids[step.promptId] = true;
        }
      });
    });
    var promptIds = Object.keys(ids);
    if (!promptIds.length || !Array.isArray(state.prompts)) {
      return [];
    }
    return state.prompts.filter(function (p) {
      return promptIds.indexOf(p.id) !== -1;
    });
  }

  function buildWorkflowBundle(workflows) {
    var wfArray = Array.isArray(workflows) ? workflows.slice() : [];
    return {
      version: 1,
      workflows: wfArray,
      prompts: collectPromptsForWorkflows(wfArray)
    };
  }

  function handleExportAllWorkflows() {
    exportAllData();
  }

  function handleExportWorkflow() {
    if (!state.selectedWorkflowId) {
      showToast("Select a workflow to export.", "error");
      return;
    }
    var wf = findWorkflowById(state.selectedWorkflowId);
    if (!wf) {
      showToast("Selected workflow not found.", "error");
      return;
    }
    var bundle = buildWorkflowBundle([wf]);
    var baseName = wf.name ? "workflow-" + slugify(wf.name) : "workflow-export";
    triggerDownload(bundle, baseName);
    showToast("Exported workflow and its prompts.", "success");
  }

  function handleImportChange(event) {
    // Prompt Library lifecycle op: import durable asset JSON and rehydrate canonical state.
    var file = event.target.files && event.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onerror = function () {
      showToast("Unable to read file.", "error");
      event.target.value = "";
    };
    reader.onload = function (e) {
      try {
        var text = String(e.target.result || "").trim();
        if (!text) {
          showToast("Import file was empty.", "error");
          event.target.value = "";
          return;
        }
        var data = JSON.parse(text);

        var workflows = [];
        var prompts = [];
        var useNewerWins = false;

        if (data && typeof data === "object" && !Array.isArray(data)) {
          if (Array.isArray(data.workflows)) workflows = data.workflows;
          if (Array.isArray(data.prompts)) prompts = data.prompts;
          useNewerWins = true;
        } else if (Array.isArray(data) && data.length > 0) {
          var first = data[0];
          if (first && typeof first === "object") {
            if (Array.isArray(first.steps)) {
              workflows = data;
              useNewerWins = true;
            } else if (first.title != null && first.body != null) {
              prompts = data;
              useNewerWins = true;
            } else {
              showToast("Import file format not recognized.", "error");
              event.target.value = "";
              return;
            }
          }
        }

        if (workflows.length || prompts.length) {
          importWorkflowsAndPrompts(workflows, prompts, {
            newerWins: useNewerWins
          });
        } else {
          showToast("Nothing to import.", "error");
        }
      } catch (err) {
        showToast("Invalid JSON file.", "error");
      } finally {
        event.target.value = "";
      }
    };
    reader.readAsText(file);
  }

  function importWorkflowsAndPrompts(workflows, prompts, options) {
    var newerWins = options && options.newerWins === true;
    var importedWorkflows = Array.isArray(workflows) ? workflows : [];
    var importedPrompts = Array.isArray(prompts) ? prompts : [];

    var promptMergeOptions = { newerWins: newerWins };
    var promptsPromise =
      importedPrompts.length && window.Library && window.Library.importPromptsFromEntries
        ? window.Library.importPromptsFromEntries(importedPrompts, promptMergeOptions)
        : Promise.resolve({ added: 0, updated: 0, skipped: 0 });

    promptsPromise
      .then(function (promptSummary) {
        loadLibrary();
        renderLibraryList();

        var existingById = {};
        (state.workflows || []).forEach(function (w) {
          existingById[w.id] = w;
        });

        var addedCount = 0;
        var updatedCount = 0;
        var skippedCount = 0;
        var workflowWarnings = [];

        importedWorkflows.forEach(function (wf) {
          if (!wf || typeof wf !== "object") return;
          var normalizeWarnings = [];
          var normalizedWorkflow = normalizeWorkflowForV1(wf, normalizeWarnings);
          var validationWarnings = validateWorkflow(normalizedWorkflow);
          if (normalizeWarnings.length || validationWarnings.length) {
            workflowWarnings = workflowWarnings.concat(
              dedupeWarnings(normalizeWarnings.concat(validationWarnings))
            );
          }
          var wfId = normalizedWorkflow.id && String(normalizedWorkflow.id);
          if (!wfId) {
            wfId = window.Utils && window.Utils.uuid ? window.Utils.uuid() : String(Date.now());
            normalizedWorkflow.id = wfId;
          }

          var existing = existingById[wfId];
          if (existing && newerWins) {
            var existingTime =
              typeof existing.updatedAt === "number" ? existing.updatedAt : 0;
            var importedTime =
              typeof normalizedWorkflow.updatedAt === "number" ? normalizedWorkflow.updatedAt : 0;
            if (importedTime <= existingTime) {
              skippedCount += 1;
              return;
            }
          }

          var idx = state.workflows.findIndex(function (w) {
            return w.id === wfId;
          });
          if (idx >= 0) {
            state.workflows[idx] = normalizedWorkflow;
            updatedCount += 1;
          } else {
            state.workflows.push(normalizedWorkflow);
            addedCount += 1;
          }
        });

        saveWorkflows();
        renderWorkflowList();

        var pAdd = promptSummary.added || 0;
        var pUp = promptSummary.updated || 0;
        var pSkip = promptSummary.skipped || 0;
        var pTotal = pAdd + pUp;
        var wTotal = addedCount + updatedCount;

        var parts = [];
        if (pTotal > 0) {
          parts.push(
            pTotal +
              " prompt(s) (" +
              pAdd +
              " added, " +
              pUp +
              " updated" +
              (pSkip ? ", " + pSkip + " skipped (newer local)" : "") +
              ")"
          );
        }
        if (wTotal > 0) {
          parts.push(
            wTotal +
              " workflow(s) (" +
              addedCount +
              " added, " +
              updatedCount +
              " updated" +
              (skippedCount ? ", " + skippedCount + " skipped (newer local)" : "") +
              ")"
          );
        }
        showToast(
          "Imported " + (parts.length ? parts.join(" and ") : "nothing") + ".",
          "success"
        );
        if (workflowWarnings.length) {
          workflowWarnings = dedupeWarnings(workflowWarnings);
          showToast(
            "Imported with " + workflowWarnings.length + " workflow warning(s). Open a workflow to review.",
            "warning"
          );
        }
      })
      .catch(function () {
        showToast("Unable to import.", "error");
      });
  }

  function slugify(str) {
    return String(str || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .substring(0, 40) || "export";
  }


  // -----------------------------
  // Misc UI handlers
  // -----------------------------

  // Detect {{Variable}} placeholders in a template string.
  function extractTemplateVariables(text) {
    var names = [];
    var seen = {};
    if (!text) return names;
    var re = /\{\{([^}]+)\}\}/g;
    var match;
    while ((match = re.exec(text)) !== null) {
      var raw = match[1];
      if (!raw) continue;
      var name = String(raw).trim();
      if (!name || seen[name]) continue;
      seen[name] = true;
      names.push(name);
    }
    return names;
  }

  // Prompt the user for values for each placeholder and return a filled template.
  // Returns null if the user cancels.
  function fillTemplateVariables(text) {
    var names = extractTemplateVariables(text);
    if (!names.length) return text;

    var values = {};
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      var value = window.prompt('Enter a value for "' + name + '"');
      if (value === null) {
        // User cancelled the entire operation.
        return null;
      }
      values[name] = value;
    }

    return text.replace(/\{\{([^}]+)\}\}/g, function (_, raw) {
      var key = String(raw).trim();
      return Object.prototype.hasOwnProperty.call(values, key)
        ? values[key]
        : "{{" + raw + "}}";
    });
  }

  function handleCopyFinalPrompt() {
    var text = els.finalPrompt.value || "";
    if (!text.trim()) {
      showToast("There is no final prompt to copy yet.", "error");
      return;
    }
    // In the Factory tab we leave any {{Variable}} placeholders as-is.
    window.Utils
      .copyText(text)
      .then(function (ok) {
        if (ok) {
          showToast("Final prompt copied to clipboard.", "success");
        } else {
          showToast("Unable to copy to clipboard.", "error");
        }
      })
      .catch(function () {
        showToast("Unable to copy to clipboard.", "error");
      });
  }

  function handleCopyPromptBody() {
    // Read-only lifecycle utility: copy selected durable prompt-asset body.
    if (!els.detailBody) return;
    var text = els.detailBody.value || "";
    if (!text.trim()) {
      showToast("There is no prompt body to copy yet.", "error");
      return;
    }
    if (!window.Utils || !window.Utils.copyText) {
      showToast("Clipboard helper is not available.", "error");
      return;
    }

    var filled = fillTemplateVariables(text);
    if (filled === null) {
      // User cancelled from one of the prompts; do not copy anything.
      return;
    }

    window.Utils
      .copyText(filled)
      .then(function (ok) {
        if (ok) {
          showToast("Prompt body copied to clipboard.", "success");
        } else {
          showToast("Unable to copy prompt body to clipboard.", "error");
        }
      })
      .catch(function () {
        showToast("Unable to copy prompt body to clipboard.", "error");
      });
  }

  function handleSaveDesignedWorkflow() {
    try {
      if (els.wfDesignStatus) {
        els.wfDesignStatus.textContent = "Saving…";
        els.wfDesignStatus.className = "badge badge-muted";
      }
    var versions = state.workflowDesignVersions;
    var selected = state.workflowSelectedVersion || "refined";
    var design =
      (versions && versions[selected]) ||
      (versions && versions.refined) ||
      (versions && versions.draft) ||
      state.workflowDesignResult ||
      null;

    if (!design || !design.steps || !Array.isArray(design.steps)) {
      showToast("Design a workflow first.", "error");
      return;
    }
    var name = els.wfDesignName ? (els.wfDesignName.value || "").trim() : "";
    var designIntent = els.wfDesignIntent ? (els.wfDesignIntent.value || "").trim() : "";
    var audienceSeed = els.wfDesignAudience ? (els.wfDesignAudience.value || "").trim() : "";
    var scopeScaleSeed = els.wfDesignScale ? (els.wfDesignScale.value || "").trim() : "";
    var artefacts = els.wfDesignInputs ? (els.wfDesignInputs.value || "").trim() : "";
    var startingArtefact = els.wfDesignStartingArtefact
      ? String(els.wfDesignStartingArtefact.value || "").trim()
      : "";
    var desiredOutputsSeed = els.wfDesignDesiredOutputs ? (els.wfDesignDesiredOutputs.value || "").trim() : "";
    var scopeAndConstraints = els.wfDesignScopeConstraints ? (els.wfDesignScopeConstraints.value || "").trim() : "";
    if (!name) {
      showToast("Enter a workflow name before saving.", "error");
      return;
    }

    var now = Date.now();
    var wfId = window.Utils && window.Utils.uuid ? window.Utils.uuid() : String(now);

    var steps = [];
    var stepIdByIndex = {};
    var stepPatternCatalog = Array.isArray(state.workflowStepPatternCatalog)
      ? state.workflowStepPatternCatalog
      : [];
    var briefResolved = state.workflowBriefResolved && typeof state.workflowBriefResolved === "object"
      ? state.workflowBriefResolved
      : null;
    var mappedBindings = briefResolved && briefResolved.mappedBindings && typeof briefResolved.mappedBindings === "object"
      ? briefResolved.mappedBindings
      : { workflowOutputSpecPatch: {}, workflowConstraintPatch: {}, stepParamPatch: {} };
    var canonicalStepIdByTitle = {};
    (Array.isArray(stepPatternCatalog) ? stepPatternCatalog : []).forEach(function (p) {
      var titleKey = String((p && p.title) || "").toLowerCase().trim();
      var cid = String(
        (p && p.canonicalStepId) ||
        (p && p.promptFactory && (p.promptFactory.canonical_step_id || p.promptFactory.canonicalStepId)) ||
        ""
      ).trim();
      if (!titleKey || !cid) return;
      canonicalStepIdByTitle[titleKey] = normalizeCanonicalStepId(cid);
    });
    design.steps.forEach(function (s, idx) {
      var stepId = window.Utils && window.Utils.uuid ? window.Utils.uuid() : String(Date.now() + idx);
      stepIdByIndex[idx + 1] = stepId;
      var canonicalTitle = pickCanonicalWorkflowStepTitle(
        s.title || "",
        stepPatternCatalog
      );
      var matchedPattern = getPatternByCanonicalWorkflowTitle(canonicalTitle, stepPatternCatalog);
      var isStructuredCanonical =
        !!matchedPattern && isStructuredDomainSelection(getSelectedWorkflowDomains());
      var canonicalStepId = matchedPattern
        ? String(
            matchedPattern.canonicalStepId ||
              (matchedPattern.promptFactory &&
                (matchedPattern.promptFactory.canonical_step_id ||
                  matchedPattern.promptFactory.canonicalStepId)) ||
              ""
          ).trim()
        : "";
      var suggestedOutputName = suggestWorkflowOutputNameForStepTitle(
        s.title || "",
        stepPatternCatalog
      );
      var step = {
        id: stepId,
        title: canonicalTitle || s.title || "Step " + (idx + 1),
        roleLabel: s.role || "",
        promptId: null,
        prompt_source_type: "none",
        prompt_source: "none",
        canonical_step_id: canonicalStepId,
        domain_version: getStructuredDomainVersionForWorkflow(getSelectedWorkflowDomains(), stepPatternCatalog),
        prompt_instance: "",
        prompt_bindings: null,
        override_prompt_body: "",
        inputKind: "text",
        inputBindings: [],
        outputName: suggestedOutputName,
        notes: s.notes || "",
        depends_on: Array.isArray(s.depends_on) ? s.depends_on.slice() : []
      };
      if (isStructuredCanonical && matchedPattern) {
        var parsedSeed = parseWorkflowStepParamBlock(step.notes || "");
        var stepParamSeed = [];
        if (Array.isArray(parsedSeed)) {
          stepParamSeed = parsedSeed.slice();
        } else if (parsedSeed && typeof parsedSeed === "object") {
          Object.keys(parsedSeed).forEach(function (key) {
            stepParamSeed.push({ id: key, value: parsedSeed[key] });
          });
        }
        var mappedParams = mappedBindings.stepParamPatch
          ? mappedBindings.stepParamPatch[normalizeCanonicalStepId(canonicalStepId || "")]
          : null;
        var mappedParamsKey = normalizeCanonicalStepId(canonicalStepId || "");
        var mappedParamsMissing =
          !mappedParams ||
          typeof mappedParams !== "object" ||
          !Object.keys(mappedParams).length;
        if (mappedParamsMissing) {
          var fallbackCanonicalId = canonicalStepIdByTitle[String(canonicalTitle || "").toLowerCase().trim()] || "";
          if (fallbackCanonicalId && fallbackCanonicalId !== mappedParamsKey) {
            var fallbackMapped = mappedBindings.stepParamPatch
              ? mappedBindings.stepParamPatch[fallbackCanonicalId]
              : null;
            if (fallbackMapped && typeof fallbackMapped === "object" && Object.keys(fallbackMapped).length) {
              mappedParams = fallbackMapped;
              mappedParamsKey = fallbackCanonicalId;
            }
          }
        }
        if (mappedParams && typeof mappedParams === "object") {
          Object.keys(mappedParams).forEach(function (k) {
            var existing = null;
            for (var si = 0; si < stepParamSeed.length; si++) {
              var opt = stepParamSeed[si];
              if (String((opt && opt.id) || "") === String(k)) {
                existing = opt;
                break;
              }
            }
            if (existing) existing.value = mappedParams[k];
            else stepParamSeed.push({ id: k, value: mappedParams[k] });
          });
          step.notes = upsertWorkflowStepParamBlock(step.notes || "", stepParamSeed);
        }
        step.prompt_bindings = {
          selectedOptions: parseWorkflowStepParamBlock(step.notes || ""),
          outputName: step.outputName || "",
          notes: stripWorkflowStepParamBlock(step.notes || "")
        };
      }
      var seededPromptBody = buildSeededStepPromptForWorkflowStep({
        workflowName: name,
        workflowGoal: designIntent,
        workflowInputs: parseStringList(artefacts),
        workflowOutputs: parseStringList(desiredOutputsSeed),
        workflowOutputSpec: normalizeWorkflowOutputSpec({
          audience: audienceSeed,
          goal: designIntent,
          constraints: scopeAndConstraints
        }),
        step: step,
        matchedPattern: matchedPattern
      });
      if (seededPromptBody) {
        step.override_prompt_body = seededPromptBody;
        step.prompt_source_type = "local_override";
        step.prompt_source = "local_override";
        step.promptId = "";
      }
      steps.push(step);
    });

    var now = Date.now();
    var workflowOutputSpec = normalizeWorkflowOutputSpec({ goal: designIntent });
    if (audienceSeed && !workflowOutputSpec.audience) {
      workflowOutputSpec.audience = audienceSeed;
    }
    var mappedSpecPatch = mappedBindings.workflowOutputSpecPatch || {};
    if (mappedSpecPatch.audience && !workflowOutputSpec.audience) {
      workflowOutputSpec.audience = String(mappedSpecPatch.audience);
    }
    var scopeAndConstraintsCombined = scopeAndConstraints;
    var constraintPatch = mappedBindings.workflowConstraintPatch || {};
    var extraConstraintLines = [];
    Object.keys(constraintPatch).forEach(function (k) {
      extraConstraintLines.push(k + ": " + constraintPatch[k]);
    });
    if (extraConstraintLines.length) {
      scopeAndConstraintsCombined = [scopeAndConstraints, extraConstraintLines.join("; ")]
        .filter(function (s) { return !!String(s || "").trim(); })
        .join("; ");
    }
    if (scopeScaleSeed) {
      scopeAndConstraintsCombined = [scopeAndConstraintsCombined, "scope_scale: " + scopeScaleSeed]
        .filter(function (s) { return !!String(s || "").trim(); })
        .join("; ");
    }
    var wf = {
      id: wfId,
      name: name,
      selectedDomains: getSelectedWorkflowDomains(),
      artefacts: artefacts,
      startingArtefact: startingArtefact,
      workflowInputs: parseStringList(artefacts),
      workflowOutputs: parseStringList(desiredOutputsSeed),
      workflowOutputSpec: workflowOutputSpec,
      scopeAndConstraints: scopeAndConstraintsCombined,
      workflowBriefResolution: briefResolved,
      steps: steps,
      createdAt: now,
      updatedAt: now
    };

    var normalizeWarnings = [];
    wf = normalizeWorkflowForV1(wf, normalizeWarnings);

    state.workflows = state.workflows || [];
    state.workflows.push(wf);
    saveWorkflows();
    renderWorkflowList();
    renderLibraryList();
    showToast("Workflow scaffold created. You can now add prompts and refine steps in the Workflows tab.", "success");
    if (normalizeWarnings.length) {
      showToast(
        "Generated workflow loaded with " + normalizeWarnings.length + " warning(s).",
        "warning"
      );
    }

    // Switch to Workflows tab and select the new workflow.
    switchTab("workflows");
    selectWorkflow(wfId);
    } catch (err) {
      try {
        console.error("[PRISM] handleSaveDesignedWorkflow failed", err);
      } catch (_e) {}
      showToast("Could not save workflow: " + (err && err.message ? err.message : "unknown error"), "error");
      if (els.wfDesignStatus) {
        els.wfDesignStatus.textContent = "Error";
        els.wfDesignStatus.className = "badge badge-danger";
      }
    }
  }

  function handleWorkflowReview() {
    var versions = state.workflowDesignVersions;
    if (!versions || !versions.draft || !Array.isArray(versions.draft.steps)) {
      showToast("Design a workflow first.", "error");
      return;
    }

    // Ensure we have a refined copy to modify, leaving draft intact.
    if (!versions.refined) {
      versions.refined = JSON.parse(JSON.stringify(versions.draft));
    }
    state.workflowSelectedVersion = "refined";

    callOpenAIForWorkflowReview(versions.refined)
      .then(function (changes) {
        if (!changes || !changes.length) {
          appendWorkflowDesignLog(
            "assistant",
            "The reviewer did not find any changes to suggest. You can save this workflow or adjust it manually."
          );
          showToast("Reviewer did not find any changes to suggest.", "success");
          state.workflowAwaitingSuggestionAnswer = false;
          state.workflowReviewSuggestions = null;
          state.workflowReviewIndex = 0;
          return;
        }

        state.workflowReviewSuggestions = changes;
        state.workflowReviewIndex = 0;
        state.workflowAwaitingSuggestionAnswer = true;

        var first = changes[0];
        appendWorkflowDesignLog(
          "assistant",
          "Suggestion 1: " + first.description + " Apply this change? (yes/no)"
        );
      })
      .catch(function (err) {
        showToast(err.message || "Error reviewing workflow.", "error");
      });
  }

  function handleWorkflowAnswer() {
    if (!els.wfDesignAnswer) return;
    var raw = (els.wfDesignAnswer.value || "").trim();
    if (!raw) return;
    els.wfDesignAnswer.value = "";

    appendWorkflowDesignLog("user", raw);
    var answer = raw.toLowerCase();

    if (state.workflowDomainSuggestionPending) {
      var pendingDomain = state.workflowDomainSuggestionPending;
      var yesSwitch =
        answer === "yes" || answer === "y" || answer === "switch" || answer === "ok";
      state.workflowDomainSuggestionPending = null;
      if (yesSwitch) {
        if (els.wfDesignDomainSelect) {
          els.wfDesignDomainSelect.value = "learning-design";
          handleWorkflowDomainSelectionChange();
        }
        appendWorkflowDesignLog("assistant", "Switched to Learning Design. Click Design workflow again.");
      } else {
        appendWorkflowDesignLog("assistant", "Okay, keeping current domain. Click Design workflow to continue.");
      }
      return;
    }

    if (
      state.workflowBriefElicitation &&
      String(state.workflowBriefElicitation.stage || "") === "post_generation_refinement" &&
      state.workflowBriefElicitation.awaitingAssessmentOptionalOptIn
    ) {
      var assessElicit = state.workflowBriefElicitation;
      var activeProfileId = String(assessElicit.activeRefinementProfileId || "");
      var profileCaptureMessage =
        (activeProfileId === "design_page" || activeProfileId === "learner_page_pack")
        ? "Thanks — page settings captured. Regenerating the workflow once with these values."
        : "Thanks — assessment settings captured. Regenerating the workflow once with these values.";
      assessElicit.awaitingAssessmentOptionalOptIn = false;
      var finalResolvedNow =
        assessElicit.pendingFinalResolved && typeof assessElicit.pendingFinalResolved === "object"
          ? assessElicit.pendingFinalResolved
          : state.workflowBriefResolved;
      state.workflowBriefElicitation = null;
      appendWorkflowDesignLog(
        "assistant",
        profileCaptureMessage
      );
      var postGenAnsweredIds = assessElicit.answeredFactorIdsPostGen && typeof assessElicit.answeredFactorIdsPostGen === "object"
        ? Object.keys(assessElicit.answeredFactorIdsPostGen)
        : [];
      var mustRegenerate = postGenAnsweredIds.some(isGraphAffectingPostGenerationFactorId);
      if (mustRegenerate) {
        if (els.wfDesignStatus) {
          els.wfDesignStatus.textContent = "Designing…";
          els.wfDesignStatus.className = "badge badge-success";
        }
        continueWorkflowDesignGeneration(
          assessElicit.base,
          finalResolvedNow,
          assessElicit.config,
          { skipPostGenerationRefinement: true }
        );
      } else {
        renderWorkflowDesignResult({ promptRefine: false });
        appendWorkflowDesignLog(
          "assistant",
          "Workflow updated with step-specific settings. No graph changes required."
        );
        if (els.wfDesignStatus) {
          els.wfDesignStatus.textContent = "Ready";
          els.wfDesignStatus.className = "badge badge-success";
        }
      }
      return;
    }

    var hasActivePostGenerationQueue =
      !!(
        state.workflowBriefElicitation &&
        Array.isArray(state.workflowBriefElicitation.queue) &&
        Number(state.workflowBriefElicitation.index || 0) <
          state.workflowBriefElicitation.queue.length
      );
    if (hasActivePostGenerationQueue && state.workflowAwaitingDeepRefineOptIn) {
      // Required post-generation questions take precedence over optional deep refinement.
      state.workflowAwaitingDeepRefineOptIn = false;
      state.workflowDeepRefineContext = null;
    }

    if (state.workflowAwaitingDeepRefineOptIn && !hasActivePostGenerationQueue) {
      state.workflowAwaitingDeepRefineOptIn = false;
      state.workflowDeepRefineContext = null;
      appendWorkflowDesignLog(
        "assistant",
        "Your workflow is ready. You can adjust Settings at any time."
      );
      if (els.wfDesignStatus) {
        els.wfDesignStatus.textContent = "Ready";
        els.wfDesignStatus.className = "badge badge-success";
      }
      return;
    }

    if (state.workflowBriefInferenceConfirmation && state.workflowBriefInferenceConfirmation.pending) {
      var inf = state.workflowBriefInferenceConfirmation;
      var pending = Array.isArray(inf.pending) ? inf.pending : [];
      var isConfirm =
        answer === "yes" ||
        answer === "y" ||
        answer === "confirm" ||
        answer === "ok" ||
        answer === "looks good" ||
        answer === "fine" ||
        answer === "go ahead";
      function finalizeInferenceResponse(extraOverrides) {
        var elicitedOverrides = extraOverrides && typeof extraOverrides === "object" ? extraOverrides : {};
        var resolvedElicited = Object.assign({}, inf.elicitedValues || {}, elicitedOverrides);
        var currentResolved = resolveWorkflowBriefFactors(
          inf.config,
          inf.explicitValues,
          resolvedElicited,
          inf.inferredValues,
          inf.base
        );
        var confirmedInferred = {};
        pending.forEach(function (p) {
          if (!p || !p.id) return;
          if (Object.prototype.hasOwnProperty.call(resolvedElicited, p.id)) return;
          confirmedInferred[p.id] = p.value;
        });
        var mappedInf = applyWorkflowBriefMappings(inf.config, currentResolved.resolved);
        var finalInfResolved = {
          initialBrief: inf.base,
          askedFactors: Object.keys(resolvedElicited).map(function (id) {
            return { id: id, value: resolvedElicited[id] };
          }),
          inferredFactors: inf.inferredValues,
          confirmedInferredFactors: confirmedInferred,
          pendingInferredConfirmation: {},
          resolvedSources: currentResolved.sources || {},
          resolvedFactors: currentResolved.resolved,
          mappedBindings: mappedInf,
          missing: currentResolved.missing.map(function (m) { return m.id; }),
          warnings: mappedInf.warnings || []
        };
        state.workflowBriefResolved = finalInfResolved;
        state.workflowBriefInferenceConfirmation = null;
        renderWorkflowBriefResolvedPanel(finalInfResolved);
        if (finalInfResolved.missing.length) {
          appendWorkflowDesignLog(
            "assistant",
            "Still missing required factors: " + finalInfResolved.missing.join(", ")
          );
          return;
        }
        // In post-generation refinement stage, never regenerate workflow.
        if (String(inf.stage || "") === "post_generation_refinement") {
          appendWorkflowDesignLog(
            "assistant",
            "Great — confirmed. Continuing with step-specific configuration."
          );
          if (els.wfDesignStatus) {
            els.wfDesignStatus.textContent = "Refining quality";
            els.wfDesignStatus.className = "badge badge-muted";
          }
          return;
        }
        appendWorkflowDesignLog("assistant", "Inferred factors confirmed. Generating workflow now.");
        if (els.wfDesignStatus) {
          els.wfDesignStatus.textContent = "Designing…";
          els.wfDesignStatus.className = "badge badge-success";
        }
        continueWorkflowDesignGeneration(inf.base, finalInfResolved, inf.config);
      }

      if (isConfirm) {
        finalizeInferenceResponse({});
        return;
      }

      var pendingFactors = pending
        .map(function (p) {
          return getWorkflowBriefFactorById(inf.config, p && p.id);
        })
        .filter(function (f) { return !!(f && f.id); });
      var fallbackOverrides = parseInferenceOverrides(raw, pending);
      if (els.wfDesignStatus) {
        els.wfDesignStatus.textContent = "Understanding updates";
        els.wfDesignStatus.className = "badge badge-muted";
      }
      callOpenAIForWorkflowBriefExtraction(raw, {
        config: inf.config,
        explicitValues: inf.explicitValues,
        elicitedValues: inf.elicitedValues,
        inferredValues: inf.inferredValues
      }, pendingFactors)
        .then(function (capturedRaw) {
          var captured = capturedRaw && typeof capturedRaw === "object" ? capturedRaw : {};
          var normalizedCaptured = {};
          Object.keys(captured).forEach(function (id) {
            var factor = getWorkflowBriefFactorById(inf.config, id);
            if (!factor) return;
            var entry = captured[id];
            if (!shouldApplyCapturedFactor(factor, raw, entry)) return;
            var capturedValue = getCapturedValue(entry);
            if (String(id) === "topic") {
              var normalizedTopic = normalizeCapturedTopic(capturedValue);
              if (String(normalizedTopic || "").trim()) {
                capturedValue = normalizedTopic;
              }
            }
            normalizedCaptured[id] = capturedValue;
          });
          var merged = Object.assign({}, fallbackOverrides, normalizedCaptured);
          var validated = {};
          Object.keys(merged).forEach(function (id) {
            var factor = getWorkflowBriefFactorById(inf.config, id);
            if (!factor) return;
            var rawValue = merged[id];
            if (String(id) === "topic") {
              var normalizedTopic = normalizeCapturedTopic(rawValue);
              if (String(normalizedTopic || "").trim()) {
                rawValue = normalizedTopic;
              }
            }
            var parsed = parseWorkflowBriefAnswerByType(rawValue, factor);
            if (parsed === "" || parsed == null) return;
            validated[id] = parsed;
          });
          if (!Object.keys(validated).length) {
            appendWorkflowDesignLog(
              "assistant",
              "Tell me what to change in plain language (for example: 'use single activity and beginner level'), or reply 'yes' to keep the inferred values."
            );
            if (els.wfDesignStatus) {
              els.wfDesignStatus.textContent = "Confirm inferred";
              els.wfDesignStatus.className = "badge badge-muted";
            }
            return;
          }
          finalizeInferenceResponse(validated);
        })
        .catch(function () {
          if (!Object.keys(fallbackOverrides).length) {
            appendWorkflowDesignLog(
              "assistant",
              "Tell me what to change in plain language, or reply 'yes' to keep the inferred values."
            );
            if (els.wfDesignStatus) {
              els.wfDesignStatus.textContent = "Confirm inferred";
              els.wfDesignStatus.className = "badge badge-muted";
            }
            return;
          }
          finalizeInferenceResponse(fallbackOverrides);
        });
      return;
    }

    if (state.workflowBriefElicitation && state.workflowBriefElicitation.queue) {
      var elicit = state.workflowBriefElicitation;
      var queue = Array.isArray(elicit.queue) ? elicit.queue : [];
      var idxQ = Number(elicit.index || 0);
      var factor = queue[idxQ] || null;
      var remaining = getWorkflowElicitationRemainingFactors(elicit);
      var remainingMap = {};
      remaining.forEach(function (f) {
        if (f && f.id) remainingMap[String(f.id)] = f;
      });

      if (els.wfDesignStatus) {
        els.wfDesignStatus.textContent = "Understanding brief";
        els.wfDesignStatus.className = "badge badge-muted";
      }

      callOpenAIForWorkflowBriefExtraction(raw, elicit, remaining)
        .then(function (capturedRaw) {
          var captured = capturedRaw && typeof capturedRaw === "object" ? capturedRaw : {};
          var capturedIds = Object.keys(captured);
          var appliedCount = 0;

          if (
            factor &&
            factor.id &&
            elicit.pendingRecommendation &&
            String(elicit.pendingRecommendation.factorId || "") === String(factor.id)
          ) {
            var yesLike = /^(yes|y|ok|okay|use that|use default|recommended|go with that)$/i.test(
              String(raw || "").trim()
            );
            if (yesLike) {
              var recVal = elicit.pendingRecommendation.value;
              if (recVal != null && String(recVal).trim()) {
                elicit.elicitedValues[factor.id] = String(recVal).trim();
                if (String(elicit.stage || "") === "post_generation_refinement") {
                  if (!elicit.answeredFactorIdsPostGen || typeof elicit.answeredFactorIdsPostGen !== "object") {
                    elicit.answeredFactorIdsPostGen = {};
                  }
                  elicit.answeredFactorIdsPostGen[String(factor.id)] = true;
                }
                appliedCount = 1;
              }
            }
            elicit.pendingRecommendation = null;
          }

          capturedIds.forEach(function (id) {
            var f = remainingMap[id];
            if (!f) return;
            var capturedEntry = captured[id];
            // Guard against over-capture: only auto-accept non-current factors
            // when user message explicitly mentions that factor.
            if (factor && factor.id && String(id) !== String(factor.id)) {
              if (!isWorkflowFactorExplicitlyMentionedInText(f, raw)) {
                return;
              }
            }
            if (!shouldApplyCapturedFactor(f, raw, capturedEntry)) return;
            var capturedValue = getCapturedValue(capturedEntry);
            if (String(id) === "topic") {
              var normalizedTopic = normalizeCapturedTopic(capturedValue);
              if (String(normalizedTopic || "").trim()) {
                capturedValue = normalizedTopic;
              }
            }
            var parsedVal = parseWorkflowBriefAnswerByType(capturedValue, f);
            if (parsedVal === "" || parsedVal == null) return;
            elicit.elicitedValues[id] = parsedVal;
            if (String(elicit.stage || "") === "post_generation_refinement") {
              if (!elicit.answeredFactorIdsPostGen || typeof elicit.answeredFactorIdsPostGen !== "object") {
                elicit.answeredFactorIdsPostGen = {};
              }
              elicit.answeredFactorIdsPostGen[String(id)] = true;
            }
            appliedCount += 1;
          });

          if (!appliedCount && factor && factor.id) {
            var factorType = String((factor && factor.type) || "").toLowerCase();
            var unsure = /^(i\s+don'?t\s+know|dont\s+know|not\s+sure|unsure|help)$/i.test(raw);
            var helpIntent = isWorkflowOptionHelpIntent(raw) || unsure;
            var recommend = isRecommendIntent(raw);
            var activeParseHints = getActiveRefinementParseHints(factor && factor.id);
            var recommendEnabled =
              !activeParseHints ||
              !Object.prototype.hasOwnProperty.call(activeParseHints, "recommendEnabled") ||
              !!activeParseHints.recommendEnabled;
            if (factorType === "select" && recommend && recommendEnabled) {
              var recChoices = Array.isArray(factor.choices) ? factor.choices : [];
              var recDefault = factor.default != null ? String(factor.default) : "";
              var recValue = "";
              if (recDefault) {
                recValue = recDefault;
              } else if (recChoices.length) {
                var first = recChoices[0];
                recValue = first && typeof first === "object"
                  ? String(first.value != null ? first.value : "")
                  : String(first || "");
              }
              if (recValue) {
                elicit.pendingRecommendation = {
                  factorId: String(factor.id || ""),
                  value: String(recValue || "")
                };
                appendWorkflowDesignLog(
                  "assistant",
                  buildWorkflowBriefOptionHelpText(factor, { recommendedValue: recValue })
                );
                return;
              }
            }
            if (factorType === "select" && helpIntent) {
              appendWorkflowDesignLog(
                "assistant",
                buildWorkflowBriefOptionHelpText(factor, {})
              );
              return;
            }
            var parsed = parseWorkflowBriefAnswerByType(raw, factor);
            if (parsed === "" || parsed == null) {
              var hint = "";
              if (factorType === "number") {
                hint = " You can answer like: 60, 60 minutes, 1 hour.";
              } else if (factorType === "select") {
                hint = " If unsure, reply 'help' and I’ll restate the options more simply.";
              }
              appendWorkflowDesignLog(
                "assistant",
                "I couldn't read that answer yet. " + buildWorkflowBriefQuestionText(factor) + hint
              );
              return;
            }
            elicit.elicitedValues[factor.id] = parsed;
            if (String(elicit.stage || "") === "post_generation_refinement") {
              if (!elicit.answeredFactorIdsPostGen || typeof elicit.answeredFactorIdsPostGen !== "object") {
                elicit.answeredFactorIdsPostGen = {};
              }
              elicit.answeredFactorIdsPostGen[String(factor.id)] = true;
            }
            appliedCount = 1;
          }

          var current = resolveWorkflowBriefFactors(
            elicit.config,
            elicit.explicitValues,
            elicit.elicitedValues,
            elicit.inferredValues,
            elicit.base
          );
          function shouldAskQueuedFactorNow(factorItem) {
            if (!factorItem || !factorItem.id) return false;
            var fid = String(factorItem.id);
            var srcNow = String((current.sources && current.sources[fid]) || "");
            var mustAskNow = !!factorItem.mustAsk;
            if (String(elicit.stage || "") === "post_generation_refinement") {
              // Post-generation queued questions (required + optional profile tiers)
              // should continue until each queued factor is explicitly answered
              // by user input or elicitation in this session.
              return !(srcNow === "explicit" || srcNow === "elicited");
            }
            // For mustAsk factors, keep asking until user explicitly/elicitedly sets them.
            if (mustAskNow) {
              return !(srcNow === "explicit" || srcNow === "elicited");
            }
            // Non-mustAsk factors are considered settled once any source exists.
            return !(srcNow === "explicit" || srcNow === "elicited" || srcNow === "inferred" || srcNow === "default");
          }
          while (elicit.index < queue.length) {
            var qf = queue[elicit.index];
            if (!shouldAskQueuedFactorNow(qf)) {
              elicit.index += 1;
              continue;
            }
            break;
          }
          if (elicit.index < queue.length) {
            var nextFactor = queue[elicit.index];
            var provisional = {
              initialBrief: elicit.base,
              askedFactors: Object.keys(elicit.elicitedValues).map(function (id) {
                return { id: id, value: elicit.elicitedValues[id] };
              }),
              inferredFactors: elicit.inferredValues,
              resolvedSources: current.sources || {},
              resolvedFactors: current.resolved,
              mappedBindings: {
                workflowOutputSpecPatch: {},
                workflowConstraintPatch: {},
                stepParamPatch: {},
                mapped: [],
                warnings: []
              },
              missing: current.missing.map(function (m) { return m.id; })
            };
            state.workflowBriefResolved = provisional;
            renderWorkflowBriefResolvedPanel(provisional);
            if (appliedCount > 1) {
              appendWorkflowDesignLog(
                "assistant",
                "Great — I captured " + appliedCount + " details from that message."
              );
            }
            appendWorkflowDesignLog("assistant", buildWorkflowBriefQuestionText(nextFactor));
            if (els.wfDesignStatus) {
              els.wfDesignStatus.textContent = "Needs essentials";
              els.wfDesignStatus.className = "badge badge-muted";
            }
            return;
          }

          var mapped = applyWorkflowBriefMappings(elicit.config, current.resolved);
          var finalResolved = {
            initialBrief: elicit.base,
            askedFactors: Object.keys(elicit.elicitedValues).map(function (id) {
              return { id: id, value: elicit.elicitedValues[id] };
            }),
            inferredFactors: elicit.inferredValues,
            confirmedInferredFactors: {},
            resolvedSources: current.sources || {},
            resolvedFactors: current.resolved,
            mappedBindings: mapped,
            missing: current.missing.map(function (m) { return m.id; }),
            warnings: mapped.warnings || []
          };
          if (finalResolved.missing.length) {
            state.workflowBriefResolved = finalResolved;
            state.workflowBriefElicitation = null;
            renderWorkflowBriefResolvedPanel(finalResolved);
            appendWorkflowDesignLog(
              "assistant",
              "Required factors still unresolved after elicitation: " +
                finalResolved.missing.join(", ") +
                ". Please add them in the Workflow Factory fields and click Design workflow again."
            );
            if (els.wfDesignStatus) {
              els.wfDesignStatus.textContent = "Needs essentials";
              els.wfDesignStatus.className = "badge badge-muted";
            }
            return;
          }
          var pendingAfterElicit = getPendingHighImpactInferredFactors(
            elicit.config,
            elicit.explicitValues,
            elicit.elicitedValues,
            elicit.inferredValues
          );
          state.workflowBriefResolved = finalResolved;
          state.workflowBriefElicitation = null;
          if (pendingAfterElicit.length) {
            // Auto-accept inferred high-impact factors here as well
            // so we do not interrupt with a yes/no confirmation hop.
            var confirmedAfter = {};
            pendingAfterElicit.forEach(function (p) {
              if (!p || !p.id) return;
              confirmedAfter[p.id] = p.value;
            });
            finalResolved.confirmedInferredFactors = confirmedAfter;
          }
          renderWorkflowBriefResolvedPanel(finalResolved);
          if (String(elicit.stage || "") === "post_generation_refinement") {
            var answeredIdsPostGen = elicit.answeredFactorIdsPostGen && typeof elicit.answeredFactorIdsPostGen === "object"
              ? Object.keys(elicit.answeredFactorIdsPostGen)
              : [];
            var requiresGraphRegeneration = answeredIdsPostGen.some(isGraphAffectingPostGenerationFactorId);
            if (requiresGraphRegeneration) {
              var activeProfileIdForComplete = String(elicit.activeRefinementProfileId || "");
              var captureMessage =
                (activeProfileIdForComplete === "design_page" || activeProfileIdForComplete === "learner_page_pack")
                  ? "Thanks — page settings captured. Regenerating the workflow once with these values."
                  : "Thanks — assessment settings captured. Regenerating the workflow once with these values.";
              logWorkflowTrace("[PRISM][IntentClass] regeneration triggered after elicitation");
              appendWorkflowDesignLog(
                "assistant",
                captureMessage
              );
              if (els.wfDesignStatus) {
                els.wfDesignStatus.textContent = "Designing…";
                els.wfDesignStatus.className = "badge badge-success";
              }
              continueWorkflowDesignGeneration(
                elicit.base,
                finalResolved,
                elicit.config,
                { skipPostGenerationRefinement: true }
              );
              return;
            }
            renderWorkflowDesignResult({ promptRefine: false });
            appendWorkflowDesignLog(
              "assistant",
              "Thanks — those step-specific settings are captured. You can review, tweak, and save this workflow."
            );
            if (els.wfDesignStatus) {
              els.wfDesignStatus.textContent = "Ready";
              els.wfDesignStatus.className = "badge badge-success";
            }
            return;
          }
          appendWorkflowDesignLog("assistant", "Brief essentials and quality factors resolved. Generating workflow now.");
          if (els.wfDesignStatus) {
            els.wfDesignStatus.textContent = "Designing…";
            els.wfDesignStatus.className = "badge badge-success";
          }
          continueWorkflowDesignGeneration(elicit.base, finalResolved, elicit.config);
        })
        .catch(function () {
          appendWorkflowDesignLog(
            "assistant",
            "I couldn't interpret that fully yet. " + (factor ? buildWorkflowBriefQuestionText(factor) : "Please rephrase.")
          );
          if (els.wfDesignStatus) {
            els.wfDesignStatus.textContent = "Needs essentials";
            els.wfDesignStatus.className = "badge badge-muted";
          }
        });
      return;
    }

    // First: opt-in to refinement?
    if (state.workflowAwaitingRefineOptIn) {
      state.workflowAwaitingRefineOptIn = false;
      var isNo =
        answer === "no" ||
        answer === "nope" ||
        answer === "skip" ||
        answer === "skip review";
      if (isNo) {
        appendWorkflowDesignLog(
          "assistant",
          "Great, you can now save this workflow or fine-tune it manually in the Workflows tab."
        );
        return;
      }

      appendWorkflowDesignLog(
        "assistant",
        "Okay, I’ll review the workflow and suggest a few improvements."
      );
      handleWorkflowReview();
      return;
    }

    // Stepping through individual review suggestions.
    if (state.workflowAwaitingSuggestionAnswer && state.workflowReviewSuggestions) {
      var idx = state.workflowReviewIndex || 0;
      if (idx < 0 || idx >= state.workflowReviewSuggestions.length) {
        state.workflowAwaitingSuggestionAnswer = false;
        return;
      }

      var apply =
        answer !== "no" &&
        answer !== "nope" &&
        answer !== "skip" &&
        answer !== "reject";

      if (apply) {
        var change = state.workflowReviewSuggestions[idx];
        if (change && change.step) {
          var versions = state.workflowDesignVersions;
          if (!versions || !versions.refined || !Array.isArray(versions.refined.steps)) {
            showToast("No refined workflow is available to update.", "error");
            state.workflowAwaitingSuggestionAnswer = false;
            return;
          }
          var steps = versions.refined.steps || [];
          var after = typeof change.after_step === "number" ? change.after_step : steps.length;
          var insertIndex = steps.length;
          // after_step is 1-based index of the step after which we insert.
          if (after >= 0 && after <= steps.length) {
            insertIndex = after;
          }

          var newStep = {
            title: change.step.title || "New step",
            role: change.step.role || "",
            depends_on: Array.isArray(change.step.depends_on)
              ? change.step.depends_on.slice()
              : []
          };

          steps.splice(insertIndex, 0, newStep);
          versions.refined.steps = steps;
          renderWorkflowDesignResult({ promptRefine: false });
        }
      }

      // Move to the next suggestion.
      state.workflowReviewIndex = idx + 1;
      var nextIdx = state.workflowReviewIndex;
      if (
        nextIdx < state.workflowReviewSuggestions.length &&
        state.workflowReviewSuggestions[nextIdx]
      ) {
        var next = state.workflowReviewSuggestions[nextIdx];
        appendWorkflowDesignLog(
          "assistant",
          "Suggestion " +
            (nextIdx + 1) +
            ": " +
            next.description +
            " Apply this change? (yes/no)"
        );
      } else {
        state.workflowAwaitingSuggestionAnswer = false;
        appendWorkflowDesignLog(
          "assistant",
          "All review suggestions have been processed. You can now save this workflow or adjust it manually."
        );
      }

      return;
    }

    // Fallback: if we're not expecting an answer, gently guide the user.
    if (state.workflowDesignResult && state.workflowDesignResult.steps) {
      appendWorkflowDesignLog(
        "assistant",
        "Workflow draft is ready. If no question is visible, use Save workflow, or click Design workflow again to rerun elicitation."
      );
      return;
    }
    appendWorkflowDesignLog(
      "assistant",
      "I’m not expecting an answer right now. Click Design workflow to begin."
    );
  }

  function handleSaveRefinedToLibrary() {
    // Save target boundary:
    // - workflow step mode: write runtime editor prompt into selected step config
    // - standalone Prompt Studio: persist a durable prompt asset in Prompt Library
    var wfCtx = state.promptFactoryWorkflowContext || null;
    var inWorkflowStepMode = !!(wfCtx && wfCtx.workflowId && wfCtx.stepId);

    var manualBody =
      els.finalPrompt && typeof els.finalPrompt.value === "string"
        ? els.finalPrompt.value.trim()
        : "";

    if (inWorkflowStepMode) {
      if (!manualBody) {
        showToast(
          "There is no final prompt to save yet. Paste or refine a prompt first.",
          "error"
        );
        return;
      }
      var targetWorkflowId = String(wfCtx.workflowId || "").trim();
      var targetStepId = String(wfCtx.stepId || "").trim();
      if (!targetWorkflowId || !targetStepId) {
        showToast("Workflow step context is missing.", "error");
        return;
      }
      var wf = findWorkflowById(targetWorkflowId);
      if (!wf || !Array.isArray(wf.steps)) {
        showToast("Workflow not found.", "error");
        return;
      }
      var step = wf.steps.find(function (s) {
        return String(s && s.id ? s.id : "") === targetStepId;
      });
      if (!step) {
        showToast("Workflow step not found.", "error");
        return;
      }
      // Workflow-step outcome A: persist prompt text directly on the step
      // as a local runtime override (no library asset link).
      step.override_prompt_body = manualBody;
      step.prompt_source_type = "local_override";
      step.prompt_source = "local_override";
      step.prompt_instance = "";
      step.promptId = "";
      wf.updatedAt = Date.now();
      saveWorkflows();
      renderWorkflowList();
      renderLibraryList();
      refreshWorkflowPromptOptions();
      if (state.selectedWorkflowId === wf.id) {
        populateWorkflowDetail(wf);
      }
      showToast("Prompt saved to workflow step.", "success");
      return;
    }
    var promptAssetDraft;

    if (state.finalResult && state.finalResult.final_prompt) {
      // Normal path: save the refined prompt from the API.
      var now = Date.now();
      var body = state.finalResult.final_prompt;
      var summary = state.finalResult.summary || "";
      var defaultTitle =
        "Refined prompt " + (window.Utils ? window.Utils.formatDate(now) : "");
      var chosenTitle = window.prompt("Name this prompt:", defaultTitle);
      if (chosenTitle == null) return; // user cancelled
      chosenTitle = String(chosenTitle || "").trim();
      if (!chosenTitle) {
        showToast("Prompt name cannot be empty.", "error");
        return;
      }
      promptAssetDraft = {
        title: chosenTitle,
        body: body,
        tags: [],
        source: "refined",
        notes: summary,
        // Persist the authored brief so loading this prompt can restore inputs.
        brief: getCurrentBriefSnapshot()
      };
    } else if (manualBody) {
      // Manual path: user pasted or edited a final prompt directly.
      var now2 = Date.now();
      var defaultTitle2 =
        "Prompt " + (window.Utils ? window.Utils.formatDate(now2) : "");
      var chosenTitle2 = window.prompt("Name this prompt:", defaultTitle2);
      if (chosenTitle2 == null) return; // user cancelled
      chosenTitle2 = String(chosenTitle2 || "").trim();
      if (!chosenTitle2) {
        showToast("Prompt name cannot be empty.", "error");
        return;
      }
      promptAssetDraft = {
        title: chosenTitle2,
        body: manualBody,
        tags: [],
        source: "manual",
        notes: "",
        brief: getCurrentBriefSnapshot()
      };
    } else {
      showToast(
        "There is no final prompt to save yet. Paste or refine a prompt first.",
        "error"
      );
      return;
    }

    // Keep explicit system-derived defaults at the handler boundary.
    // Library.savePrompt applies the same default when omitted.
    updatePromptAssetMetadata(promptAssetDraft, { usageCount: 0 });

    // Prompt Studio -> Prompt Library boundary:
    // persist runtime final prompt as a durable prompt asset, then refresh canonical library state.
    // Ownership split:
    // - user-authored payload: title/body/notes/tags (+ brief snapshot)
    // - system-derived metadata is assigned/maintained by Library persistence.
    window.Library
      .savePrompt(promptAssetDraft)
      .then(function (saved) {
        state.prompts.push(saved);
        selectPrompt(saved.id);
        if (state.promptFactoryWorkflowContext) {
          var wfCtx = state.promptFactoryWorkflowContext;
          var targetWorkflowId = String(wfCtx.workflowId || "").trim();
          var targetStepId = String(wfCtx.stepId || "").trim();
          if (targetWorkflowId && targetStepId) {
            var wf = findWorkflowById(targetWorkflowId);
            if (wf && Array.isArray(wf.steps)) {
              var step = wf.steps.find(function (s) {
                return String(s && s.id ? s.id : "") === targetStepId;
              });
              if (step) {
                // Workflow-step outcome B: link the step to the newly saved
                // Prompt Library asset (library_prompt source), clearing local override.
                step.promptId = saved.id;
                step.prompt_source_type = "library_prompt";
                step.prompt_source = "library_prompt";
                step.override_prompt_body = "";
                step.prompt_instance = "";
                wf.updatedAt = Date.now();
                saveWorkflows();
                if (state.selectedWorkflowId === wf.id) {
                  populateWorkflowDetail(wf);
                }
                switchTab("workflows");
                showToast("Prompt linked to workflow step.", "success");
              }
            }
          }
        }
        renderLibraryList();
        refreshWorkflowPromptOptions();
        showToast("Prompt saved to library.", "success");
      })
      .catch(function (err) {
        showToast(err.message || "Could not save prompt.", "error");
      });
  }

  function switchTab(name) {
    if (!els.tabRefiner || !els.tabLibrary || !els.refinementPanel || !els.libraryPanel) {
      return;
    }
    var showPromptFactory = name === "promptFactory";
    var showPromptLibrary = name === "promptLibrary";
    var showWorkflowFactory = name === "workflowFactory";
    var showWorkflows = name === "workflows";
    var showUtilities = name === "utilities";

    els.tabRefiner.classList.toggle("active", showPromptFactory);
    els.tabLibrary.classList.toggle("active", showPromptLibrary);
    if (els.tabWorkflowFactory) {
      els.tabWorkflowFactory.classList.toggle("active", showWorkflowFactory);
    }
    if (els.tabWorkflows) {
      els.tabWorkflows.classList.toggle("active", showWorkflows);
    }
    if (els.tabUtilities) {
      els.tabUtilities.classList.toggle("active", showUtilities);
    }

    els.tabRefiner.setAttribute("aria-selected", showPromptFactory ? "true" : "false");
    els.tabLibrary.setAttribute("aria-selected", showPromptLibrary ? "true" : "false");
    if (els.tabWorkflowFactory) {
      els.tabWorkflowFactory.setAttribute(
        "aria-selected",
        showWorkflowFactory ? "true" : "false"
      );
    }
    if (els.tabWorkflows) {
      els.tabWorkflows.setAttribute(
        "aria-selected",
        showWorkflows ? "true" : "false"
      );
    }
    if (els.tabUtilities) {
      els.tabUtilities.setAttribute(
        "aria-selected",
        showUtilities ? "true" : "false"
      );
    }

    els.refinementPanel.classList.toggle("hidden", !showPromptFactory);
    els.libraryPanel.classList.toggle("hidden", !showPromptLibrary);
    if (els.workflowFactoryPanel) {
      els.workflowFactoryPanel.classList.toggle("hidden", !showWorkflowFactory);
    }
    if (els.workflowsPanel) {
      els.workflowsPanel.classList.toggle("hidden", !showWorkflows);
    }
    if (els.utilitiesPanel) {
      els.utilitiesPanel.classList.toggle("hidden", !showUtilities);
    }

    els.refinementPanel.setAttribute("aria-hidden", showPromptFactory ? "false" : "true");
    els.libraryPanel.setAttribute("aria-hidden", showPromptLibrary ? "false" : "true");
    if (els.workflowFactoryPanel) {
      els.workflowFactoryPanel.setAttribute(
        "aria-hidden",
        showWorkflowFactory ? "false" : "true"
      );
    }
    if (els.workflowsPanel) {
      els.workflowsPanel.setAttribute(
        "aria-hidden",
        showWorkflows ? "false" : "true"
      );
    }
    if (els.utilitiesPanel) {
      els.utilitiesPanel.setAttribute(
        "aria-hidden",
        showUtilities ? "false" : "true"
      );
    }
    if (showWorkflowFactory && els.wfDesignSaveBtn) {
      els.wfDesignSaveBtn.disabled = false;
      els.wfDesignSaveBtn.removeAttribute("disabled");
    }
  }

  function normalizeUtilityFormatToken(value) {
    var token = String(value || "").trim().toLowerCase();
    return token === "html" ? "html" : "";
  }

  function utilityEscapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function utilityLabelFromKey(key) {
    return String(key || "")
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, function (ch) {
        return ch.toUpperCase();
      });
  }

  function utilityIsEmptyValue(value) {
    if (value == null) return true;
    if (typeof value === "string") return !String(value).trim();
    if (Array.isArray(value)) {
      return value.every(function (item) { return utilityIsEmptyValue(item); });
    }
    if (typeof value === "object") {
      var keys = Object.keys(value);
      if (!keys.length) return true;
      return keys.every(function (k) { return utilityIsEmptyValue(value[k]); });
    }
    return false;
  }

  function utilityNormalizeRenderOpts(opts) {
    return opts && typeof opts === "object" ? opts : {};
  }

  function utilityCleanupInlineMarkdownMarkers(text) {
    var input = String(text == null ? "" : text);
    if (!input) return "";
    var out = input;
    // Remove lightweight markdown emphasis wrappers for learner-facing text.
    out = out.replace(/\*\*([A-Za-z0-9][^*\n]{0,160}?)\*\*/g, "$1");
    out = out.replace(/\*([A-Za-z0-9][^*\n]{0,160}?)\*/g, "$1");
    return out;
  }

  function utilityEscapeHtmlAttribute(text) {
    return utilityEscapeHtml(text).replace(/`/g, "&#96;");
  }

  function utilityRenderMarkdownInline(text) {
    var raw = String(text == null ? "" : text);
    if (!raw) return "";
    var blankTokens = [];
    raw = raw.replace(/_{3,}/g, function (m) {
      var token = "@@PRISMBLANK" + blankTokens.length + "@@";
      blankTokens.push(m);
      return token;
    });
    var escaped = utilityEscapeHtml(raw);
    escaped = escaped.replace(/`([^`\n]+)`/g, "<code>$1</code>");
    escaped = escaped.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
    escaped = escaped.replace(/__([^_\n]+)__/g, "<strong>$1</strong>");
    escaped = escaped.replace(/(^|[^\*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
    escaped = escaped.replace(/(^|[^_])_([^_\n]+)_/g, "$1<em>$2</em>");
    escaped = escaped.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, function (_m, label, href) {
      return '<a href="' + utilityEscapeHtmlAttribute(href) + '" target="_blank" rel="noopener noreferrer">' + label + "</a>";
    });
    blankTokens.forEach(function (m, idx) {
      var tokenEsc = utilityEscapeHtml("@@PRISMBLANK" + idx + "@@");
      escaped = escaped.replace(new RegExp(tokenEsc, "g"), utilityEscapeHtml(m));
    });
    return escaped;
  }

  function utilityIsMarkdownTableDivider(line) {
    var t = String(line || "").trim();
    if (!t) return false;
    return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(t);
  }

  function utilityParseMarkdownTableRow(line) {
    var t = String(line || "").trim();
    if (!t) return [];
    if (t.charAt(0) === "|") t = t.slice(1);
    if (t.charAt(t.length - 1) === "|") t = t.slice(0, -1);
    return t.split("|").map(function (cell) { return String(cell || "").trim(); });
  }

  function utilityRenderMarkdownTable(lines, startIdx) {
    var header = utilityParseMarkdownTableRow(lines[startIdx]);
    if (!header.length) return null;
    var dividerIdx = startIdx + 1;
    if (dividerIdx >= lines.length || !utilityIsMarkdownTableDivider(lines[dividerIdx])) {
      return null;
    }
    var rows = [];
    var i = dividerIdx + 1;
    while (i < lines.length) {
      var line = String(lines[i] || "");
      if (!String(line || "").trim()) break;
      if (line.indexOf("|") === -1) break;
      rows.push(utilityParseMarkdownTableRow(line));
      i += 1;
    }
    var headHtml = "<tr>" + header.map(function (cell) {
      return "<th>" + utilityRenderMarkdownInline(cell) + "</th>";
    }).join("") + "</tr>";
    var bodyHtml = rows.map(function (row) {
      return "<tr>" + row.map(function (cell) {
        return "<td>" + utilityRenderMarkdownInline(cell) + "</td>";
      }).join("") + "</tr>";
    }).join("");
    return {
      html: "<table><thead>" + headHtml + "</thead>" + (bodyHtml ? ("<tbody>" + bodyHtml + "</tbody>") : "") + "</table>",
      nextIdx: i
    };
  }

  function utilityRenderMarkdownBlock(text) {
    var raw = String(text == null ? "" : text).replace(/\r\n/g, "\n").trim();
    if (!raw) return "";
    var lines = raw.split("\n");
    var i = 0;
    var parts = [];
    while (i < lines.length) {
      var line = String(lines[i] || "");
      var trimmed = line.trim();
      if (!trimmed) {
        i += 1;
        continue;
      }
      var table = utilityRenderMarkdownTable(lines, i);
      if (table) {
        parts.push(table.html);
        i = table.nextIdx;
        continue;
      }
      if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
        parts.push("<hr />");
        i += 1;
        continue;
      }
      var headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        var tag = "h" + String(headingMatch[1].length);
        parts.push("<" + tag + ">" + utilityRenderMarkdownInline(headingMatch[2]) + "</" + tag + ">");
        i += 1;
        continue;
      }
      var bulletMatch = trimmed.match(/^[-*]\s+(.+)$/);
      if (bulletMatch) {
        var ulItems = [];
        while (i < lines.length) {
          var bl = String(lines[i] || "").trim().match(/^[-*]\s+(.+)$/);
          if (!bl) break;
          ulItems.push("<li>" + utilityRenderMarkdownInline(bl[1]) + "</li>");
          i += 1;
        }
        parts.push("<ul>" + ulItems.join("") + "</ul>");
        continue;
      }
      var orderedMatch = trimmed.match(/^\d+[\)\.]\s+(.+)$/);
      if (orderedMatch) {
        var olItems = [];
        while (i < lines.length) {
          var ol = String(lines[i] || "").trim().match(/^\d+[\)\.]\s+(.+)$/);
          if (!ol) break;
          olItems.push("<li>" + utilityRenderMarkdownInline(ol[1]) + "</li>");
          i += 1;
        }
        parts.push("<ol>" + olItems.join("") + "</ol>");
        continue;
      }
      var paraLines = [trimmed];
      i += 1;
      while (i < lines.length) {
        var next = String(lines[i] || "").trim();
        if (!next) break;
        if (/^(#{1,6})\s+/.test(next)) break;
        if (/^[-*]\s+/.test(next) || /^\d+[\)\.]\s+/.test(next)) break;
        if (/^(-{3,}|\*{3,}|_{3,})$/.test(next)) break;
        if (utilityIsMarkdownTableDivider(next)) break;
        if (next.indexOf("|") !== -1 && i + 1 < lines.length && utilityIsMarkdownTableDivider(lines[i + 1])) break;
        paraLines.push(next);
        i += 1;
      }
      parts.push("<p>" + utilityRenderMarkdownInline(paraLines.join(" ")) + "</p>");
    }
    return parts.join("");
  }

  function utilityDetectStructuredObjectShape(obj) {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return "";
    var keys = Object.keys(obj).filter(function (key) {
      return !utilityIsEmptyValue(obj[key]);
    });
    if (!keys.length) return "";
    var lookup = {};
    keys.forEach(function (key) {
      lookup[String(key || "").toLowerCase()] = true;
    });
    var has = function (k) {
      return !!lookup[String(k || "").toLowerCase()];
    };
    if (has("term") && has("definition")) {
      return "term_definition";
    }
    if (has("misconception") && has("clarification")) {
      return "misconception_clarification";
    }
    if (has("question") && has("task")) {
      return "question_task";
    }
    return "";
  }

  function utilityExtractHeadingBodyPair(obj) {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return null;
    var keys = Object.keys(obj).filter(function (key) {
      return !utilityIsEmptyValue(obj[key]);
    });
    var scaffoldingKeys = {
      id: true,
      item_id: true,
      itemid: true,
      task_id: true,
      taskid: true,
      question_id: true,
      questionid: true,
      type: true,
      item_type: true,
      task_type: true,
      format: true,
      index: true,
      order: true,
      position: true
    };
    var meaningfulKeys = keys.filter(function (key) {
      var lower = String(key || "").toLowerCase();
      return !scaffoldingKeys[lower];
    });
    if (meaningfulKeys.length !== 2) return null;
    var headingKeys = ["title", "name", "term", "heading"];
    var bodyKeys = ["content", "body", "description", "definition", "explanation"];
    var lowerToOriginal = {};
    meaningfulKeys.forEach(function (key) {
      lowerToOriginal[String(key || "").toLowerCase()] = key;
    });
    var headingKey = "";
    var bodyKey = "";
    headingKeys.some(function (k) {
      if (Object.prototype.hasOwnProperty.call(lowerToOriginal, k)) {
        headingKey = lowerToOriginal[k];
        return true;
      }
      return false;
    });
    bodyKeys.some(function (k) {
      if (Object.prototype.hasOwnProperty.call(lowerToOriginal, k)) {
        bodyKey = lowerToOriginal[k];
        return true;
      }
      return false;
    });
    if (!headingKey || !bodyKey) return null;
    if (String(headingKey).toLowerCase() === String(bodyKey).toLowerCase()) return null;
    return {
      headingKey: headingKey,
      bodyKey: bodyKey
    };
  }

  function utilityRenderStructuredObjectShape(obj, depth, opts, ctx) {
    var shape = utilityDetectStructuredObjectShape(obj);
    if (!shape) return "";
    var renderOpts = utilityNormalizeRenderOpts(opts);
    var context = ctx && typeof ctx === "object" ? ctx : {};
    var titleTag = depth === 0 ? "h3" : depth === 1 ? "h4" : "h5";
    function clean(value) {
      var text = String(value == null ? "" : value).trim();
      if (!text) return "";
      return renderOpts.cleanupInlineMarkdown ? utilityCleanupInlineMarkdownMarkers(text) : text;
    }
    var headingBodyPair = utilityExtractHeadingBodyPair(obj);
    if (headingBodyPair) {
      var headingText = clean(obj[headingBodyPair.headingKey]);
      var bodyValue = obj[headingBodyPair.bodyKey];
      if (!headingText || utilityIsEmptyValue(bodyValue)) return "";
      var bodyHtml = Array.isArray(bodyValue)
        ? utilityRenderArray(bodyValue, renderOpts)
        : bodyValue && typeof bodyValue === "object"
        ? utilityRenderObject(bodyValue, depth + 1, renderOpts)
        : utilityRenderPrimitive(clean(bodyValue), renderOpts);
      if (!String(bodyHtml || "").trim()) return "";
      return (
        "<article class=\"util-structured-block\">" +
          "<" + titleTag + ">" + utilityEscapeHtml(headingText) + "</" + titleTag + ">" +
          bodyHtml +
        "</article>"
      );
    }
    if (shape === "term_definition") {
      var term = clean(obj.term);
      var definition = clean(obj.definition);
      if (!term || !definition) return "";
      return (
        "<article class=\"util-structured-block\">" +
          "<" + titleTag + ">" + utilityEscapeHtml(term) + "</" + titleTag + ">" +
          utilityRenderPrimitive(definition, renderOpts) +
        "</article>"
      );
    }
    if (shape === "misconception_clarification") {
      var misconception = clean(obj.misconception);
      var clarification = clean(obj.clarification);
      if (!misconception && !clarification) return "";
      var misconceptionHtml = misconception
        ? ("<" + titleTag + ">Misconception</" + titleTag + ">" + utilityRenderPrimitive(misconception, renderOpts))
        : "";
      var clarificationHtml = clarification
        ? ("<p><strong>Clarification</strong></p>" + utilityRenderPrimitive(clarification, renderOpts))
        : "";
      return "<article class=\"util-structured-block\">" + misconceptionHtml + clarificationHtml + "</article>";
    }
    if (shape === "question_task") {
      var question = clean(obj.question);
      var task = clean(obj.task);
      var index = Number.isFinite(context.arrayIndex) ? (context.arrayIndex + 1) : null;
      var title = index ? ("Reflection Task " + index) : "Reflection Task";
      var isScaffoldingTask = /^\s*(reflection|task)\s*\d*\s*$/i.test(task);
      var body = "";
      if (question) body += utilityRenderPrimitive(question, renderOpts);
      if (task && !isScaffoldingTask && task.toLowerCase() !== question.toLowerCase()) {
        body += utilityRenderPrimitive(task, renderOpts);
      }
      if (!body) return "";
      return (
        "<article class=\"util-structured-block\">" +
          "<" + titleTag + ">" + utilityEscapeHtml(title) + "</" + titleTag + ">" +
          body +
        "</article>"
      );
    }
    return "";
  }

  function utilityRenderPrimitive(value, opts) {
    var renderOpts = utilityNormalizeRenderOpts(opts);
    if (utilityIsEmptyValue(value)) return "";
    var text = String(value == null ? "" : value).replace(/\r\n/g, "\n").trim();
    if (renderOpts.humanizeEnumValues && /^[a-z][a-z0-9]*(?:_[a-z0-9]+)+$/.test(text)) {
      text = text.replace(/_/g, " ");
    }
    if (renderOpts.cleanupInlineMarkdown) {
      text = utilityCleanupInlineMarkdownMarkers(text);
    }
    if (!text) return "";
    return utilityRenderMarkdownBlock(text);
  }

  function utilityRenderArray(values, opts) {
    var renderOpts = utilityNormalizeRenderOpts(opts);
    var arr = Array.isArray(values) ? values : [];
    var filtered = arr.filter(function (row) { return !utilityIsEmptyValue(row); });
    if (!filtered.length) return "";
    var items = filtered.map(function (row, idx) {
      if (row && typeof row === "object" && !Array.isArray(row)) {
        var shaped = utilityRenderStructuredObjectShape(row, 0, renderOpts, { arrayIndex: idx });
        if (shaped) return shaped;
        var renderedObj = utilityRenderObject(row, 0, renderOpts);
        if (/^\s*<article class="util-structured-block">/.test(String(renderedObj || ""))) {
          return renderedObj;
        }
        return "<li>" + renderedObj + "</li>";
      }
      var text = String(row == null ? "" : row);
      if (renderOpts.cleanupInlineMarkdown) {
        text = utilityCleanupInlineMarkdownMarkers(text);
      }
      return "<li>" + utilityEscapeHtml(text) + "</li>";
    }).filter(function (item) { return !!String(item || "").trim(); });
    if (!items.length) return "";
    var allStructured = items.every(function (item) {
      return /^\s*<article class="util-structured-block">/.test(String(item || ""));
    });
    if (allStructured) return items.join("");
    return "<ul>" + items.join("") + "</ul>";
  }

  function formatMinutesIfBare(value) {
    if (value === null || value === undefined || value === "") return "";
    if (typeof value === "number" && Number.isFinite(value)) return String(value) + " mins";
    var text = String(value).trim();
    if (!text) return "";
    if (/^\d+$/.test(text)) return text + " mins";
    if (/^\d+\s*(min|mins|minute|minutes)$/i.test(text)) {
      return text.replace(/\bminutes?\b/i, "mins");
    }
    return text;
  }

  function utilityRenderObject(obj, level, opts, ctx) {
    var renderOpts = utilityNormalizeRenderOpts(opts);
    var depth = Number.isFinite(level) ? level : 0;
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
      return utilityRenderPrimitive(obj, renderOpts);
    }
    function renderColumnRowsTable(tableObj) {
      if (!tableObj || typeof tableObj !== "object" || Array.isArray(tableObj)) return "";
      var columns = Array.isArray(tableObj.columns) ? tableObj.columns.filter(function (c) { return !utilityIsEmptyValue(c); }) : [];
      var rows = Array.isArray(tableObj.rows) ? tableObj.rows.filter(function (r) { return !utilityIsEmptyValue(r); }) : [];
      if (!columns.length || !rows.length) return "";
      var rowsAreArrays = rows.every(function (r) { return Array.isArray(r); });
      var rowsAreObjects = rows.every(function (r) { return r && typeof r === "object" && !Array.isArray(r); });
      if (!rowsAreArrays && !rowsAreObjects) return "";
      var headerLabels = columns.map(function (c) {
        return String(c == null ? "" : c).trim();
      }).filter(function (c) { return !!c; });
      if (!headerLabels.length) return "";
      function renderCellValue(v) {
        if (v == null) return "";
        if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
          return utilityRenderMarkdownInline(String(v));
        }
        return utilityEscapeHtml(JSON.stringify(v));
      }
      function normalizedKey(s) {
        return String(s == null ? "" : s).toLowerCase().replace(/[^a-z0-9]+/g, "");
      }
      var bodyHtml = rows.map(function (row) {
        var cells = [];
        if (rowsAreArrays) {
          for (var ci = 0; ci < headerLabels.length; ci += 1) {
            cells.push("<td>" + renderCellValue(row[ci]) + "</td>");
          }
          if (row.length > headerLabels.length) {
            for (var ei = headerLabels.length; ei < row.length; ei += 1) {
              cells.push("<td>" + renderCellValue(row[ei]) + "</td>");
            }
          }
        } else {
          var rowKeyMap = {};
          Object.keys(row).forEach(function (rk) {
            rowKeyMap[normalizedKey(rk)] = rk;
          });
          for (var hi = 0; hi < headerLabels.length; hi += 1) {
            var header = headerLabels[hi];
            var direct = Object.prototype.hasOwnProperty.call(row, header) ? row[header] : undefined;
            var mappedKey = rowKeyMap[normalizedKey(header)];
            var mapped = mappedKey && Object.prototype.hasOwnProperty.call(row, mappedKey) ? row[mappedKey] : undefined;
            var val = direct !== undefined ? direct : mapped;
            cells.push("<td>" + renderCellValue(val) + "</td>");
          }
        }
        return "<tr>" + cells.join("") + "</tr>";
      }).join("");
      if (!bodyHtml) return "";
      var headHtml = "<tr>" + headerLabels.map(function (h) {
        return "<th>" + utilityEscapeHtml(h) + "</th>";
      }).join("") + "</tr>";
      return "<table><thead>" + headHtml + "</thead><tbody>" + bodyHtml + "</tbody></table>";
    }
    var tableHtml = renderColumnRowsTable(obj);
    if (tableHtml) return tableHtml;
    var suppressedKeyLookup = {};
    var defaultSuppressedKeys = renderOpts.suppressInternalMetadata
      ? ["material_type", "type", "schema", "source_id", "internal_id", "material_id", "activity_id"]
      : [];
    var humanKeyLabels = {
      start_minute: "Time",
      start_time: "Time",
      timing: "Time",
      duration_minutes: "Time",
      duration: "Time",
      phase_type: "Phase",
      learner_actions: "Learner Task",
      facilitator_actions: "Facilitator Notes",
      purpose: "Purpose",
      expected_output: "What you will produce",
      support_note: "Support note",
      support_notes: "Support note"
    };
    var suppressedKeys = Array.isArray(renderOpts.suppressedKeys)
      ? defaultSuppressedKeys.concat(renderOpts.suppressedKeys)
      : defaultSuppressedKeys;
    suppressedKeys.forEach(function (key) {
      suppressedKeyLookup[String(key || "").toLowerCase()] = true;
    });
    var shaped = utilityRenderStructuredObjectShape(obj, depth, renderOpts, ctx);
    if (shaped) return shaped;
    var keys = Object.keys(obj).filter(function (key) {
      var lower = String(key || "").toLowerCase();
      if (suppressedKeyLookup[lower]) return false;
      return !utilityIsEmptyValue(obj[key]);
    });
    function extractPurposeText(value) {
      if (value == null) return "";
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        return String(value).trim();
      }
      if (value && typeof value === "object" && !Array.isArray(value)) {
        return firstNonEmpty([
          value.statement,
          value.purpose,
          value.summary,
          value.objective,
          value.aim,
          value.description,
          value.content,
          value.text,
          value.body
        ]);
      }
      return "";
    }
    if (!keys.length) return "";
    var lowerToOriginal = {};
    keys.forEach(function (key) {
      lowerToOriginal[String(key || "").toLowerCase()] = key;
    });
    var pairCandidates = [
      ["title", "content"],
      ["title", "body"],
      ["title", "summary"],
      ["name", "description"],
      ["name", "content"],
      ["term", "explanation"],
      ["term", "definition"],
      ["heading", "body"],
      ["heading", "content"],
      ["concept", "summary"]
    ];
    var selectedPair = null;
    pairCandidates.some(function (pair) {
      var hk = lowerToOriginal[pair[0]];
      var bk = lowerToOriginal[pair[1]];
      if (!hk || !bk) return false;
      if (utilityIsEmptyValue(obj[hk]) || utilityIsEmptyValue(obj[bk])) return false;
      selectedPair = { headingKey: hk, bodyKey: bk };
      return true;
    });
    if (selectedPair) {
      var titleTagForPair = depth === 0 ? "h3" : depth === 1 ? "h4" : "h5";
      var headingText = String(obj[selectedPair.headingKey] == null ? "" : obj[selectedPair.headingKey]).trim();
      if (renderOpts.cleanupInlineMarkdown) {
        headingText = utilityCleanupInlineMarkdownMarkers(headingText);
      }
      var bodyValueForPair = obj[selectedPair.bodyKey];
      var bodyHtmlForPair = Array.isArray(bodyValueForPair)
        ? utilityRenderArray(bodyValueForPair, renderOpts)
        : bodyValueForPair && typeof bodyValueForPair === "object"
        ? utilityRenderObject(bodyValueForPair, depth + 1, renderOpts)
        : utilityRenderPrimitive(bodyValueForPair, renderOpts);
      var extraObj = {};
      keys.forEach(function (k) {
        if (k === selectedPair.headingKey || k === selectedPair.bodyKey) return;
        extraObj[k] = obj[k];
      });
      var extraHtmlForPair = utilityRenderObject(extraObj, depth + 1, renderOpts);
      if (headingText && String(bodyHtmlForPair || "").trim()) {
        if (
          String(selectedPair.headingKey || "").toLowerCase() === "concept" &&
          String(selectedPair.bodyKey || "").toLowerCase() === "summary"
        ) {
          return (
            "<article class=\"util-structured-block\">" +
              "<p><strong>" + utilityEscapeHtml(headingText) + ":</strong> " + bodyHtmlForPair.replace(/^<p>|<\/p>$/g, "") + "</p>" +
              extraHtmlForPair +
            "</article>"
          );
        }
        return (
          "<article class=\"util-structured-block\">" +
            "<" + titleTagForPair + ">" + utilityEscapeHtml(headingText) + "</" + titleTagForPair + ">" +
            bodyHtmlForPair +
            extraHtmlForPair +
          "</article>"
        );
      }
    }
    var titleTag = depth === 0 ? "h3" : depth === 1 ? "h4" : "h5";
    return keys
      .map(function (key) {
        var value = obj[key];
        var lowerKey = String(key || "").toLowerCase();
        if (lowerKey === "items" || lowerKey === "fields") {
          return Array.isArray(value)
            ? utilityRenderArray(value, renderOpts)
            : value && typeof value === "object"
            ? utilityRenderObject(value, depth + 1, renderOpts)
            : utilityRenderPrimitive(value, renderOpts);
        }
        if (lowerKey === "table") {
          return Array.isArray(value)
            ? utilityRenderArray(value, renderOpts)
            : value && typeof value === "object"
            ? utilityRenderObject(value, depth + 1, renderOpts)
            : utilityRenderPrimitive(value, renderOpts);
        }
        if (lowerKey === "description" || lowerKey === "summary" || lowerKey === "body" || lowerKey === "content") {
          var desc = utilityRenderPrimitive(value, renderOpts);
          return desc ? ("<p>" + desc.replace(/^<p>|<\/p>$/g, "") + "</p>") : "";
        }
        if ((lowerKey === "title" || lowerKey === "heading" || lowerKey === "name") && (typeof value === "string" || typeof value === "number")) {
          var headingValue = String(value == null ? "" : value).trim();
          if (!headingValue) return "";
          return "<" + titleTag + ">" + utilityEscapeHtml(headingValue) + "</" + titleTag + ">";
        }
        if (lowerKey === "duration" || lowerKey === "duration_minutes" || lowerKey === "timing" || lowerKey === "start_time" || lowerKey === "start_minute") {
          return "<p><strong>Time:</strong> " + utilityRenderMarkdownInline(formatMinutesIfBare(value)) + "</p>";
        }
        if (lowerKey === "purpose") {
          var purposeText = extractPurposeText(value);
          if (purposeText) return "<p><strong>Purpose:</strong> " + utilityRenderMarkdownInline(String(purposeText)) + "</p>";
          if (value && typeof value === "object") {
            var purposeFallback = utilityRenderObject(value, depth + 1, renderOpts);
            return purposeFallback ? ("<h4>Purpose</h4>" + purposeFallback) : "";
          }
          return "";
        }
        if (lowerKey === "expected_output") {
          return "<p><strong>What you will produce:</strong> " + utilityRenderMarkdownInline(String(value == null ? "" : value)) + "</p>";
        }
        if (lowerKey === "support_note" || lowerKey === "support_notes") {
          return '<p class="util-support-note"><strong>Support note:</strong> ' + utilityRenderMarkdownInline(String(value == null ? "" : value)) + "</p>";
        }
        var headingLabel = humanKeyLabels[lowerKey] || utilityLabelFromKey(key);
        var heading = "<" + titleTag + ">" + utilityEscapeHtml(headingLabel) + "</" + titleTag + ">";
        var body = Array.isArray(value)
          ? utilityRenderArray(value, renderOpts)
          : value && typeof value === "object"
          ? utilityRenderObject(value, depth + 1, renderOpts)
          : utilityRenderPrimitive(value, renderOpts);
        if (!String(body || "").trim()) return "";
        return heading + body;
      })
      .filter(function (block) { return !!String(block || "").trim(); })
      .join("");
  }

  function utilityRenderPageSections(sectionsValue, labels, sectionOrder, opts) {
    var renderOpts = utilityNormalizeRenderOpts(opts);
    var labelsMap = labels && typeof labels === "object" ? labels : {};
    var orderedKeys = Array.isArray(sectionOrder) ? sectionOrder.slice() : [];
    function firstNonEmpty(values) {
      for (var i = 0; i < values.length; i += 1) {
        if (values[i] == null) continue;
        var text = String(values[i]).trim();
        if (text) return text;
      }
      return "";
    }
    function looksLearningSequenceSection(name) {
      var t = String(name || "").toLowerCase();
      return /\b(learning[_\s-]?sequence|workshop schedule|session plan|timeline)\b/.test(t);
    }
    function looksAssessmentItemsSection(name) {
      var t = String(name || "").toLowerCase();
      return /\b(assessment[_\s-]?items|formative[_\s-]?(assessment|questions|check)|questions?)\b/.test(t);
    }
    function looksLearningActivitiesSection(name) {
      var t = String(name || "").toLowerCase();
      return /\b(learning[_\s-]?activities|workshop[_\s-]?activities|activities)\b/.test(t);
    }
    function looksActivityResourcesSection(name) {
      var t = String(name || "").toLowerCase();
      return /\b(activity[_\s-]?resources|activity[_\s-]?materials|resources|materials)\b/.test(t);
    }
    function looksKnowledgeSummarySection(name) {
      var t = String(name || "").toLowerCase();
      return /\b(knowledge[_\s-]?summary|knowledge[_\s-]?model|key[_\s-]?concepts?|concept[_\s-]?summary)\b/.test(t);
    }
    function looksLearningPurposeOrOutcomesSection(name) {
      var t = String(name || "").toLowerCase();
      return /\b(learning[_\s-]?purpose|learning[_\s-]?outcomes?|outcomes?)\b/.test(t);
    }
    function activitySectionHeadingForCount(count) {
      return count === 1 ? "Learning Activity" : "Learning Activities";
    }
    function sectionIconClass(sectionId, headingText) {
      var sid = String(sectionId || "").toLowerCase().trim();
      var heading = String(headingText || "").toLowerCase().trim();
      if (!sid) {
        if (looksLearningActivitiesSection(heading)) sid = "learning_activities";
        else if (looksLearningPurposeOrOutcomesSection(heading)) sid = "learning_purpose";
        else if (looksKnowledgeSummarySection(heading)) sid = "knowledge_summary";
        else if (looksAssessmentItemsSection(heading)) sid = "assessment_check";
        else if (/\b(support|facilitator notes?)\b/.test(heading)) sid = "support_notes";
        else if (/\b(overview|introduction|intro)\b/.test(heading)) sid = "overview";
      }
      if (sid === "overview") return "fa-circle-info";
      if (sid === "learning_purpose") return "fa-bullseye";
      if (sid === "knowledge_summary") return "fa-lightbulb";
      if (sid === "learning_activities") return "fa-puzzle-piece";
      if (sid === "assessment_check") return "fa-clipboard-check";
      if (sid === "support_notes") return "fa-life-ring";
      return "fa-file-lines";
    }
    function renderSectionHeadingH2(headingText, sectionId) {
      var heading = utilityEscapeHtml(String(headingText || ""));
      var iconClass = sectionIconClass(sectionId, headingText);
      return '<h2><i class="fa-solid ' + utilityEscapeHtml(iconClass) + ' util-section-icon" aria-hidden="true"></i><span>' + heading + "</span></h2>";
    }
    function renderLearningPurposeOutcomes(value) {
      if (utilityIsEmptyValue(value)) return "";
      if (typeof value === "string") return "<p>" + utilityRenderMarkdownInline(String(value)) + "</p>";
      if (Array.isArray(value)) {
        var arr = value.filter(function (x) { return !utilityIsEmptyValue(x); });
        if (!arr.length) return "";
        var allStrings = arr.every(function (x) {
          return typeof x === "string" || typeof x === "number" || typeof x === "boolean";
        });
        if (allStrings) {
          var list = arr.map(function (x) { return "<li>" + utilityRenderMarkdownInline(String(x)) + "</li>"; }).join("");
          return "<ul>" + list + "</ul>";
        }
        return utilityRenderArray(arr, renderOpts);
      }
      if (value && typeof value === "object") {
        var statement = firstNonEmpty([value.statement, value.purpose, value.summary, value.intro, value.description]);
        var outcomes = Array.isArray(value.outcomes) ? value.outcomes.filter(function (x) { return !utilityIsEmptyValue(x); }) : [];
        var parts = [];
        if (statement) parts.push("<p>" + utilityRenderMarkdownInline(String(statement)) + "</p>");
        if (outcomes.length) {
          var outcomesLis = outcomes.map(function (outcome) {
            if (typeof outcome === "string" || typeof outcome === "number" || typeof outcome === "boolean") {
              return "<li>" + utilityRenderMarkdownInline(String(outcome)) + "</li>";
            }
            if (outcome && typeof outcome === "object") {
              var txt = firstNonEmpty([outcome.outcome, outcome.statement, outcome.text, outcome.description, outcome.title, outcome.name]);
              return txt ? ("<li>" + utilityRenderMarkdownInline(String(txt)) + "</li>") : "";
            }
            return "";
          }).filter(function (x) { return !!x; }).join("");
          if (outcomesLis) parts.push("<ul>" + outcomesLis + "</ul>");
        }
        return parts.join("");
      }
      return utilityRenderPrimitive(value, renderOpts);
    }
    function renderKnowledgeSummaryBlocks(value) {
      var rows = Array.isArray(value)
        ? value
        : value && typeof value === "object" && Array.isArray(value.items)
        ? value.items
        : [];
      rows = rows.filter(function (row) { return !utilityIsEmptyValue(row); });
      if (!rows.length) return "";
      return rows
        .map(function (row) {
          if (!row || typeof row !== "object" || Array.isArray(row)) return "";
          var concept = firstNonEmpty([row.concept, row.term, row.title, row.name, row.key_concept]);
          var summary = firstNonEmpty([row.summary, row.explanation, row.definition, row.description, row.details, row.content, row.body]);
          if (!concept && !summary) return "";
          if (concept && summary) {
            return '<article class="util-structured-block"><p><strong>' + utilityEscapeHtml(concept) + ":</strong> " + utilityRenderMarkdownInline(summary) + "</p></article>";
          }
          if (concept) return '<article class="util-structured-block"><p><strong>' + utilityEscapeHtml(concept) + "</strong></p></article>";
          return '<article class="util-structured-block"><p>' + utilityRenderMarkdownInline(summary) + "</p></article>";
        })
        .filter(function (x) { return !!x; })
        .join("");
    }
    function summarizeOneSentence(text) {
      var raw = String(text == null ? "" : text).trim();
      if (!raw) return "";
      var firstLine = raw.split(/\r?\n/)[0].trim();
      var sentence = firstLine.match(/^(.+?[.!?])(?:\s|$)/);
      return sentence ? sentence[1] : firstLine;
    }
    function normalizeComparableText(text) {
      return String(text == null ? "" : text)
        .toLowerCase()
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201c\u201d]/g, '"')
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
    }
    function friendlySessionStepTitle(phaseType, fallbackIndex) {
      var phase = String(phaseType == null ? "" : phaseType).toLowerCase().trim();
      if (/\b(intro|introduction|opening|warm[ -]?up|starter|launch)\b/.test(phase)) return "Getting Started";
      if (/\b(develop|main|core|practice|activity|explore|body)\b/.test(phase)) return "Key Ideas";
      if (/\b(plenary|closure|close|closing|wrap|wrap[ -]?up|summary|debrief|check)\b/.test(phase)) return "Final Check / Wrap Up";
      return fallbackIndex <= 1 ? "Getting Started" : "Next Step";
    }
    function normalizeActivityLookupKey(value) {
      return String(value == null ? "" : value).trim().toLowerCase();
    }
    function buildLearningActivityLookup(container) {
      var lookup = {};
      var rows = [];
      if (Array.isArray(container)) {
        rows = container.slice();
      } else if (container && typeof container === "object" && !Array.isArray(container)) {
        if (Array.isArray(container.items)) rows = container.items.slice();
        else if (Array.isArray(container.activities)) rows = container.activities.slice();
      }
      rows.forEach(function (row) {
        if (!row || typeof row !== "object" || Array.isArray(row)) return;
        var id = firstNonEmpty([row.activity_id, row.activityId, row.id]);
        var title = firstNonEmpty([row.title, row.activity_title, row.name, row.activity_name]);
        var key = normalizeActivityLookupKey(id);
        if (!key || !title) return;
        lookup[key] = String(title);
      });
      return lookup;
    }
    function renderActivityResourcesSection(sectionValue) {
      function renderResourceObject(obj) {
        if (!obj || typeof obj !== "object" || Array.isArray(obj)) return "";
        var title = firstNonEmpty([obj.title, obj.card_title, obj.name, obj.label]);
        var bodyPrimary = firstNonEmpty([obj.content, obj.text, obj.body, obj.prompt, obj.description]);
        var html = [];
        if (title) html.push("<h3>" + utilityEscapeHtml(String(title)) + "</h3>");
        if (bodyPrimary) {
          html.push("<p>" + utilityRenderMarkdownInline(String(bodyPrimary)) + "</p>");
        }
        var listCandidates = [];
        if (Array.isArray(obj.cards)) listCandidates = listCandidates.concat(obj.cards);
        if (Array.isArray(obj.items)) listCandidates = listCandidates.concat(obj.items);
        if (Array.isArray(obj.prompts)) listCandidates = listCandidates.concat(obj.prompts);
        if (listCandidates.length) {
          var items = listCandidates.map(function (entry) {
            if (utilityIsEmptyValue(entry)) return "";
            if (typeof entry === "string" || typeof entry === "number" || typeof entry === "boolean") {
              return "<li>" + utilityRenderMarkdownInline(String(entry)) + "</li>";
            }
            if (entry && typeof entry === "object" && !Array.isArray(entry)) {
              var lineTitle = firstNonEmpty([entry.title, entry.card_title, entry.name, entry.label]);
              var lineBody = firstNonEmpty([entry.content, entry.text, entry.body, entry.prompt, entry.description]);
              var line = "";
              if (lineTitle && lineBody) line = "<strong>" + utilityEscapeHtml(String(lineTitle)) + ":</strong> " + utilityRenderMarkdownInline(String(lineBody));
              else if (lineBody) line = utilityRenderMarkdownInline(String(lineBody));
              else if (lineTitle) line = utilityEscapeHtml(String(lineTitle));
              return line ? ("<li>" + line + "</li>") : "";
            }
            return "";
          }).filter(function (x) { return !!x; });
          if (items.length) html.push("<ul>" + items.join("") + "</ul>");
        }
        return html.join("");
      }
      if (Array.isArray(sectionValue)) {
        var blocks = sectionValue.map(function (item) {
          if (utilityIsEmptyValue(item)) return "";
          if (item && typeof item === "object" && !Array.isArray(item)) return renderResourceObject(item);
          return "<p>" + utilityRenderMarkdownInline(String(item)) + "</p>";
        }).filter(function (x) { return !!String(x || "").trim(); });
        return blocks.join("");
      }
      if (sectionValue && typeof sectionValue === "object") {
        var top = [];
        Object.keys(sectionValue).forEach(function (key) {
          var value = sectionValue[key];
          if (utilityIsEmptyValue(value)) return;
          if (Array.isArray(value)) {
            var listHtml = value
              .map(function (entry) {
                if (utilityIsEmptyValue(entry)) return "";
                if (entry && typeof entry === "object" && !Array.isArray(entry)) {
                  var t = firstNonEmpty([entry.title, entry.card_title, entry.name, entry.label]);
                  var c = firstNonEmpty([entry.content, entry.text, entry.body, entry.prompt, entry.description]);
                  if (t && c) return "<li><strong>" + utilityEscapeHtml(String(t)) + ":</strong> " + utilityRenderMarkdownInline(String(c)) + "</li>";
                  if (c) return "<li>" + utilityRenderMarkdownInline(String(c)) + "</li>";
                  if (t) return "<li>" + utilityEscapeHtml(String(t)) + "</li>";
                  return "";
                }
                return "<li>" + utilityRenderMarkdownInline(String(entry)) + "</li>";
              })
              .filter(function (x) { return !!x; })
              .join("");
            if (listHtml) {
              top.push("<h3>" + utilityEscapeHtml(utilityLabelFromKey(key)) + "</h3>");
              top.push("<ul>" + listHtml + "</ul>");
            }
            return;
          }
          if (value && typeof value === "object" && !Array.isArray(value)) {
            var nested = renderResourceObject(value);
            if (nested) {
              top.push("<h3>" + utilityEscapeHtml(utilityLabelFromKey(key)) + "</h3>");
              top.push(nested);
            }
            return;
          }
          top.push("<h3>" + utilityEscapeHtml(utilityLabelFromKey(key)) + "</h3>");
          top.push("<p>" + utilityRenderMarkdownInline(String(value)) + "</p>");
        });
        return top.join("");
      }
      return utilityRenderPrimitive(sectionValue, renderOpts);
    }
    function renderLearningActivitiesBlocks(activityRows) {
      var rows = Array.isArray(activityRows) ? activityRows.filter(function (row) { return !utilityIsEmptyValue(row); }) : [];
      if (!rows.length) return "";
      function firstNonEmptyRaw(values) {
        for (var i = 0; i < values.length; i += 1) {
          var v = values[i];
          if (!utilityIsEmptyValue(v)) return v;
        }
        return null;
      }
      function renderCardScopedMarkdown(text) {
        var raw = String(text == null ? "" : text).replace(/\r\n/g, "\n");
        if (!raw.trim()) return "";
        // Generation separator lines are not learner-facing instructions.
        raw = raw.replace(/(?:\n|^)\s*---\s*$/g, "");
        // If renderer already provides "What to do", suppress leading markdown "Task" heading.
        raw = raw.replace(/^\s*#{1,3}\s*task\s*$/im, "").trim();
        function parseWorksheetLine(line) {
          var ln = String(line == null ? "" : line).trim();
          if (!ln) return "";
          var matches = ln.match(/\d+[\)\.]\s*_{3,}/g);
          if (!matches || matches.length < 2) return "";
          var normalized = matches.map(function (token) {
            var m = String(token).match(/^(\d+)[\)\.]\s*_{3,}$/);
            if (!m) return "";
            return m[1] + ". _____";
          }).filter(function (x) { return !!x; });
          if (!normalized.length) return "";
          return '<p class="util-worksheet-line">' + utilityEscapeHtml(normalized.join("   ")) + "</p>";
        }
        var lines = raw.split("\n");
        var chunks = [];
        var mdBuffer = [];
        function flushMdBuffer() {
          if (!mdBuffer.length) return;
          var mdText = mdBuffer.join("\n").trim();
          mdBuffer = [];
          if (!mdText) return;
          chunks.push(utilityRenderMarkdownBlock(mdText));
        }
        lines.forEach(function (line) {
          var worksheetHtml = parseWorksheetLine(line);
          if (worksheetHtml) {
            flushMdBuffer();
            chunks.push(worksheetHtml);
            return;
          }
          mdBuffer.push(line);
        });
        flushMdBuffer();
        var html = chunks.join("");
        // Demote large headings within activity cards.
        html = html
          .replace(/<h2>/g, '<h4 class="util-card-subheading">')
          .replace(/<\/h2>/g, "</h4>")
          .replace(/<h3>/g, '<h4 class="util-card-subheading">')
          .replace(/<\/h3>/g, "</h4>");
        return html;
      }
      function renderListFromInstructions(value) {
        if (utilityIsEmptyValue(value)) return "";
        if (Array.isArray(value)) {
          var items = value
            .map(function (entry) {
              if (utilityIsEmptyValue(entry)) return "";
              if (typeof entry === "string") {
                return "<li>" + utilityRenderMarkdownInline(String(entry).replace(/^[-*\d\.\)\s]+/, "").trim()) + "</li>";
              }
              if (entry && typeof entry === "object") {
                var text = firstNonEmpty([entry.step, entry.instruction, entry.text, entry.content, entry.prompt, entry.title]);
                return text ? ("<li>" + utilityRenderMarkdownInline(String(text)) + "</li>") : "";
              }
              return "<li>" + utilityRenderMarkdownInline(String(entry)) + "</li>";
            })
            .filter(function (x) { return !!x; });
          return items.length ? ("<ul>" + items.join("") + "</ul>") : "";
        }
        var text = String(value || "").trim();
        if (!text) return "";
        if (/\n|^[-*]\s+|^\d+[\)\.]\s+/m.test(text)) {
          return renderCardScopedMarkdown(text);
        }
        return "<ul><li>" + utilityRenderMarkdownInline(text) + "</li></ul>";
      }
      function renderMaterialsForActivity(materials) {
        if (utilityIsEmptyValue(materials)) return "";
        try {
          console.log("[PRISM TRACE] renderMaterialsForActivity: materials keys =", materials && typeof materials === "object" ? Object.keys(materials) : typeof materials);
        } catch (_) {}
        // Content preservation rule:
        // - Never mark a key as consumed unless that value is definitely rendered.
        // - For unknown object/array shapes, always fall back to renderMaterialValue/generic rendering.
        // - Prefer duplicate labels over dropping learner-facing content.
          function isCardLikeMaterialKey(key) {
            var k = String(key || "").toLowerCase().trim();
            if (!k) return false;
            if (/\b(prompt|template|example|scenario|task[_\s-]?card|checklist|cards?)\b/.test(k)) return true;
            return (
              k === "task_cards" ||
              k === "cards" ||
              k === "prompts" ||
              k === "scenarios" ||
              k === "study_scenarios" ||
              k === "examples" ||
              k === "templates" ||
              k === "template" ||
              k === "checklist" ||
              k === "checklists"
            );
          }
        function prettyMaterialHeading(key) {
          var k = String(key || "").toLowerCase().trim();
          if (k === "scenarios" || k === "study_scenarios") return "Scenarios";
          if (k === "analysis_table") return "Analysis table";
          if (k === "strategy_options") return "Strategy options";
          if (k === "reflection_prompt") return "Reflection";
          if (k === "instructions" || k === "instruction" || k === "learner_instructions") return "What to do";
          return utilityLabelFromKey(key);
        }
        function renderScenarioBlocks(items) {
          var arr = Array.isArray(items) ? items : [];
          function extractScenarioLabelAndBody(rawText) {
            var raw = String(rawText == null ? "" : rawText).trim();
            if (!raw) return { label: "", body: "" };
            var m = raw.match(/^scenario\s+([a-z0-9]+)\s*[:\-]\s*(.+)$/i);
            if (m) {
              return { label: "Scenario " + String(m[1]).toUpperCase(), body: String(m[2] || "").trim() };
            }
            return { label: "", body: raw };
          }
          function stripScenarioPrefix(text) {
            var raw = String(text == null ? "" : text).trim();
            if (!raw) return "";
            return raw.replace(/^scenario\s+[a-z0-9]+\s*[:\-]\s*/i, "").trim();
          }
          function bodyStartsWithScenarioHeading(text) {
            var raw = String(text == null ? "" : text).trim();
            if (!raw) return false;
            return /^(?:#{1,6}\s*)?scenario\s+[a-z0-9]+\b[:\-]?\s*/i.test(raw);
          }
          function formatStageHeading(stageTitle, stageIdx) {
            var raw = String(stageTitle == null ? "" : stageTitle).trim();
            if (!raw) return "Stage " + (stageIdx + 1);
            var m = raw.match(/^(?:stage\s*)?(\d+|[a-z])\s*[:\-]\s*(.+)$/i);
            if (m) {
              return "Stage " + String(m[1]).toUpperCase() + " \u2013 " + String(m[2]).trim();
            }
            if (/^stage\s+\d+$/i.test(raw)) return raw;
            return /^stage\b/i.test(raw) ? raw : ("Stage " + (stageIdx + 1) + " \u2013 " + raw);
          }
          var listItems = arr.map(function (entry, idx) {
            if (utilityIsEmptyValue(entry)) return "";
            if (typeof entry === "string") {
              var parsed = extractScenarioLabelAndBody(entry);
              var fallbackLabel = "Scenario " + (idx + 1);
              var label = parsed.label || fallbackLabel;
              var suppressAuto = bodyStartsWithScenarioHeading(parsed.body);
              var block = utilityRenderMarkdownBlock(parsed.body);
              return block
                ? ('<div class="util-scenario-inline">' + (suppressAuto ? "" : ('<p class="util-scenario-title"><strong>' + utilityEscapeHtml(label) + "</strong></p>")) + block + "</div>")
                : "";
            }
            if (entry && typeof entry === "object") {
              var fallbackLabelText = "Scenario " + (idx + 1);
              var rawTitle = firstNonEmpty([entry.title, entry.name, entry.label, entry.scenario_title]);
              var titleParsed = extractScenarioLabelAndBody(rawTitle || "");
              var labelText = titleParsed.label || fallbackLabelText;
              var displayTitle = stripScenarioPrefix(rawTitle || "");
              var showTitle = !!displayTitle;
              var bodyRaw = firstNonEmpty([entry.content, entry.text, entry.body, entry.description, entry.prompt]);
              var suppressAutoObj = bodyStartsWithScenarioHeading(bodyRaw);
              if (!suppressAutoObj && !bodyRaw && /^(?:#{1,6}\s*)?scenario\s+[a-z0-9]+\s*[:\-]/i.test(String(rawTitle || ""))) {
                suppressAutoObj = true;
              }
              var stages = Array.isArray(entry.stages) ? entry.stages.filter(function (s) { return !utilityIsEmptyValue(s); }) : [];
              var stageHtml = "";
              if (stages.length) {
                var hasAnyStageLabel = stages.some(function (stage) {
                  return stage && typeof stage === "object" && !Array.isArray(stage) &&
                    !!firstNonEmpty([stage.stage, stage.stage_title, stage.title, stage.name, stage.heading, stage.label]);
                });
                stageHtml = '<div class="util-stage-list">' + stages.map(function (stage, stageIdx) {
                  if (utilityIsEmptyValue(stage)) return "";
                  if (typeof stage === "string") {
                    var rawStage = String(stage == null ? "" : stage).trim();
                    var parsedStageHeading = "";
                    var parsedStageBody = rawStage;
                    var stageMatch = rawStage.match(/^\s*stage\s*(\d+|[a-z])\s*(?:[:\-–]\s*)?(.+)$/i);
                    if (stageMatch) {
                      var stageOrdinal = String(stageMatch[1] || "").toUpperCase();
                      var rest = String(stageMatch[2] || "").trim();
                      var split = rest.match(/^([^:]{1,120})\s*:\s*(.+)$/);
                      if (split) {
                        parsedStageHeading = "Stage " + stageOrdinal + " \u2013 " + String(split[1] || "").trim();
                        parsedStageBody = String(split[2] || "").trim();
                      } else {
                        parsedStageHeading = "Stage " + stageOrdinal;
                        parsedStageBody = rest;
                      }
                    }
                    var plainBody = utilityRenderMarkdownBlock(parsedStageBody || rawStage);
                    return '<article class="util-stage-card"><h5>' + utilityEscapeHtml(parsedStageHeading || ("Stage " + (stageIdx + 1))) + "</h5>" + plainBody + "</article>";
                  }
                  if (!stage || typeof stage !== "object" || Array.isArray(stage)) return "";
                  var stageTitle = firstNonEmpty([stage.stage, stage.stage_title, stage.title, stage.name, stage.heading, stage.label]);
                  var stageBodyRaw = firstNonEmpty([stage.content, stage.text, stage.body, stage.description, stage.prompt]);
                  var stageBody = stageBodyRaw ? utilityRenderMarkdownBlock(String(stageBodyRaw)) : utilityRenderObject(stage, 1, renderOpts);
                  if (!stageBody) return "";
                  var headingHtml = stageTitle
                    ? ("<h5>" + utilityEscapeHtml(formatStageHeading(stageTitle, stageIdx)) + "</h5>")
                    : ("<h5>Stage " + (stageIdx + 1) + "</h5>");
                  return '<article class="util-stage-card">' + headingHtml + stageBody + "</article>";
                }).filter(function (x) { return !!x; }).join("") + "</div>";
              }
              var body = stageHtml || (bodyRaw ? utilityRenderMarkdownBlock(String(bodyRaw)) : utilityRenderObject(entry, 0, renderOpts));
              var compactLabel = showTitle ? (labelText + ": " + displayTitle) : labelText;
              return body
                ? ('<div class="util-scenario-inline">' + (suppressAutoObj ? "" : ('<p class="util-scenario-title"><strong>' + utilityEscapeHtml(compactLabel) + "</strong></p>")) + body + "</div>")
                : "";
            }
            return "";
          }).filter(function (x) { return !!x; });
          return listItems.length ? ('<div class="util-scenario-list">' + listItems.join("") + "</div>") : "";
        }
        function scenarioItemsAreSelfLabeled(items) {
          var arr = Array.isArray(items) ? items.filter(function (x) { return !utilityIsEmptyValue(x); }) : [];
          if (!arr.length) return false;
          function startsWithLabel(text) {
            var raw = String(text == null ? "" : text).trim();
            return /^(?:#{1,6}\s*)?(scenario|case|example|task)\s+[a-z0-9]+\b[:\-]?\s*/i.test(raw);
          }
          return arr.every(function (entry) {
            if (typeof entry === "string") return startsWithLabel(entry);
            if (entry && typeof entry === "object") {
              var title = firstNonEmpty([entry.title, entry.name, entry.label, entry.scenario_title]);
              var body = firstNonEmpty([entry.content, entry.text, entry.body, entry.description, entry.prompt]);
              return startsWithLabel(title || body || "");
            }
            return false;
          });
        }
        function renderBulletArray(arr, opts) {
          var cfg = opts && typeof opts === "object" ? opts : {};
          var plainLabels = cfg.plainLabels === true;
          var stripStandaloneBold = cfg.stripStandaloneBold === true;
          var rows = [];
          function stripHeadingMarkersLocal(s) {
            return String(s == null ? "" : s)
              .replace(/^\s*#{1,3}\s+/gm, "")
              .replace(/\s+#{1,3}\s+/g, " ")
              .trim();
          }
          function parseCheckboxToken(textLine) {
            var raw = String(textLine == null ? "" : textLine).trim().replace(/^\s*[-*]\s+/, "");
            var m = raw.match(/^(☐|☑|☒|\[(?: |x|X)\])\s+(.+)$/);
            if (!m) return null;
            var token = String(m[1] || "").trim();
            if (/^\[(x|X)\]$/.test(token)) token = "☑";
            if (/^\[\s\]$/.test(token)) token = "☐";
            return { token: token, text: String(m[2] || "").trim() };
          }
          function isPlaceholderOnly(textLine) {
            var t = String(textLine == null ? "" : textLine).trim();
            if (!t) return true;
            return /^(?:--|-|—|___|\.{3})$/.test(t);
          }
          (Array.isArray(arr) ? arr : []).forEach(function (entry) {
            if (utilityIsEmptyValue(entry)) return;
            if (typeof entry === "string") {
              var raw = String(entry);
              var lines = raw.split(/\r?\n/);
              var bulletLines = lines
                .map(function (ln) {
                  var m = String(ln || "").match(/^\s*[-*]\s+(.+)$/);
                  return m ? String(m[1] || "").trim() : "";
                })
                .filter(function (x) { return !!x; });
              if (bulletLines.length >= 1) {
                // Split inline prompt runs like "- one - Two" into multiple list entries.
                var splitBullets = [];
                bulletLines.forEach(function (b) {
                  var parts = String(b || "").split(/\s+-\s+(?=(?:[A-Z0-9]|\*\*|<strong>|☐|☑|☒|\[(?: |x|X)\]))/);
                  parts.forEach(function (p) {
                    var t = String(p || "").trim();
                    if (t) splitBullets.push(t);
                  });
                });
                bulletLines.forEach(function (b) {
                  var cleanBullet = stripHeadingMarkersLocal(String(b));
                  if (isPlaceholderOnly(cleanBullet)) return;
                  rows.push("<li>" + utilityRenderMarkdownInline(cleanBullet) + "</li>");
                });
                if (splitBullets.length && splitBullets.length !== bulletLines.length) {
                  rows = rows.slice(0, Math.max(0, rows.length - bulletLines.length));
                  splitBullets.forEach(function (b2) {
                    var cleanSplit = stripHeadingMarkersLocal(String(b2));
                    if (isPlaceholderOnly(cleanSplit)) return;
                    rows.push("<li>" + utilityRenderMarkdownInline(cleanSplit) + "</li>");
                  });
                }
                var para = lines
                  .filter(function (ln) { return !/^\s*[-*]\s+/.test(String(ln || "")); })
                  .join(" ")
                  .trim();
                if (para && !isPlaceholderOnly(stripHeadingMarkersLocal(para))) {
                  rows.push("<li>" + utilityRenderMarkdownInline(stripHeadingMarkersLocal(para)) + "</li>");
                }
                return;
              }
              var single = String(raw || "").trim();
              if (/^\s*[-*]\s+/.test(single)) {
                single = single.replace(/^\s*[-*]\s+/, "").trim();
              }
              single = stripHeadingMarkersLocal(single);
              if (isPlaceholderOnly(single)) return;
              rows.push("<li>" + utilityRenderMarkdownInline(single) + "</li>");
              return;
            }
            if (entry && typeof entry === "object") {
              var t = firstNonEmpty([entry.title, entry.name, entry.label, entry.option]);
              var d = firstNonEmpty([entry.description, entry.text, entry.content, entry.value]);
              if (t && d) {
                if (plainLabels) {
                  rows.push("<li>" + utilityEscapeHtml(String(t)) + ": " + utilityRenderMarkdownInline(String(d)) + "</li>");
                } else {
                  rows.push("<li><strong>" + utilityEscapeHtml(String(t)) + ":</strong> " + utilityRenderMarkdownInline(String(d)) + "</li>");
                }
                return;
              }
              if (d) {
                if (!isPlaceholderOnly(d)) rows.push("<li>" + utilityRenderMarkdownInline(String(d)) + "</li>");
                return;
              }
              if (t) {
                if (!isPlaceholderOnly(t)) rows.push("<li>" + utilityEscapeHtml(String(t)) + "</li>");
              }
            }
          });
          if (stripStandaloneBold) {
            rows = rows.map(function (line) {
              return String(line || "").replace(
                /^<li>\s*<strong>([^<]+)<\/strong>\s*<\/li>$/i,
                "<li>$1</li>"
              );
            });
          }
          if (!rows.length) return "";
          var out = [];
          var normalOpen = false;
          var checkboxOpen = false;
          rows.forEach(function (line) {
            var m = String(line || "").match(/^<li>([\s\S]*)<\/li>$/i);
            var inner = m ? String(m[1] || "").trim() : "";
            var checkbox = parseCheckboxToken(inner);
            if (checkbox) {
              if (normalOpen) {
                out.push("</ul>");
                normalOpen = false;
              }
              if (!checkboxOpen) {
                out.push('<ul class="util-checkbox-list">');
                checkboxOpen = true;
              }
              out.push('<li><span class="util-checkbox" aria-hidden="true">' + utilityEscapeHtml(checkbox.token) + '</span><span>' + utilityRenderMarkdownInline(checkbox.text) + "</span></li>");
            } else {
              if (checkboxOpen) {
                out.push("</ul>");
                checkboxOpen = false;
              }
              if (!normalOpen) {
                out.push("<ul>");
                normalOpen = true;
              }
              out.push(line);
            }
          });
          if (normalOpen || checkboxOpen) out.push("</ul>");
          return out.join("");
        }
        function renderMaterialValue(value, keyHint, opts) {
          var cfg = opts && typeof opts === "object" ? opts : {};
          if (utilityIsEmptyValue(value)) return "";
          var hint = String(keyHint || "").toLowerCase().trim();
          function renderPlainStructuredText(rawText, textOpts) {
            var ro = textOpts && typeof textOpts === "object" ? textOpts : {};
            var text = String(rawText == null ? "" : rawText).replace(/\r\n/g, "\n").trim();
            if (!text) return "";
            text = text.replace(/:\s+-\s+/g, ":\n- ");
            function splitMarkdownTableRow(line) {
              var raw = String(line == null ? "" : line).trim();
              if (!raw || raw.indexOf("|") === -1) return [];
              if (raw.charAt(0) === "|") raw = raw.slice(1);
              if (raw.charAt(raw.length - 1) === "|") raw = raw.slice(0, -1);
              return raw.split("|").map(function (cell) { return String(cell == null ? "" : cell).trim(); });
            }
            function isMarkdownTableDivider(line) {
              var cells = splitMarkdownTableRow(line);
              if (!cells.length) return false;
              return cells.every(function (cell) {
                return /^:?-{3,}:?$/.test(String(cell || "").trim());
              });
            }
            function renderMarkdownTableBlock(blockText) {
              var lines = String(blockText == null ? "" : blockText)
                .split("\n")
                .map(function (ln) { return String(ln || "").trim(); })
                .filter(function (ln) { return !!ln; });
              if (lines.length < 3) return "";
              var sepIdx = -1;
              for (var i = 1; i < lines.length; i += 1) {
                if (isMarkdownTableDivider(lines[i])) { sepIdx = i; break; }
              }
              if (sepIdx !== 1) return "";
              if (lines[0].indexOf("|") === -1) return "";
              var headerCells = splitMarkdownTableRow(lines[0]);
              if (!headerCells.length) return "";
              var bodyLines = lines.slice(2).filter(function (ln) { return ln.indexOf("|") !== -1; });
              if (!bodyLines.length) return "";
              var headHtml = "<tr>" + headerCells.map(function (h) {
                return "<th>" + utilityRenderMarkdownInline(h) + "</th>";
              }).join("") + "</tr>";
              var bodyHtml = bodyLines.map(function (ln) {
                var cells = splitMarkdownTableRow(ln);
                return "<tr>" + headerCells.map(function (_h, idx) {
                  return "<td>" + utilityRenderMarkdownInline(String(cells[idx] == null ? "" : cells[idx])) + "</td>";
                }).join("") + "</tr>";
              }).join("");
              return "<table><thead>" + headHtml + "</thead><tbody>" + bodyHtml + "</tbody></table>";
            }
            function renderInlineBulletRun(blockText) {
              var raw = String(blockText == null ? "" : blockText).trim();
              if (!raw || raw.indexOf(" - ") === -1) return "";
              function isPlaceholderOnly(textLine) {
                var t = String(textLine == null ? "" : textLine).trim();
                if (!t) return true;
                return /^(?:--|-|—|___|\.{3})$/.test(t);
              }
              function renderList(items) {
                var clean = (Array.isArray(items) ? items : [])
                  .map(function (x) { return String(x == null ? "" : x).trim(); })
                  .filter(function (x) { return !!x && !isPlaceholderOnly(x); });
                if (!clean.length) return "";
                return "<ul>" + clean.map(function (x) {
                  return "<li>" + utilityRenderMarkdownInline(x) + "</li>";
                }).join("") + "</ul>";
              }
              // Label pattern: "Label: - item - item"
              var labelMatch = raw.match(/^([^:\n]{1,220}:)\s*-\s+(.+)$/);
              if (labelMatch) {
                var labelText = String(labelMatch[1] || "").trim();
                var labelBody = String(labelMatch[2] || "").trim();
                var labelItems = labelBody.split(/\s+-\s+/).map(function (x) { return String(x || "").trim(); });
                var labelList = renderList(labelItems);
                if (labelList) {
                  return '<p class="util-line-label"><strong>' + utilityRenderMarkdownInline(labelText.replace(/:\s*$/, "")) + ":</strong></p>" + labelList;
                }
              }
              // Intro + bullets pattern: "Intro sentence - item - item"
              var introMatch = raw.match(/^(.+?)\s+-\s+(.+)$/);
              if (!introMatch) return "";
              var intro = String(introMatch[1] || "").trim();
              var tail = String(introMatch[2] || "").trim();
              var items = tail.split(/\s+-\s+/).map(function (x) { return String(x || "").trim(); });
              // Require a real run to avoid over-triggering.
              if (items.length < 2) return "";
              var list = renderList(items);
              if (!list) return "";
              return "<p>" + utilityRenderMarkdownInline(intro) + "</p>" + list;
            }
            function parseHeadingWithTail(line, marker) {
              var m = String(line || "").match(new RegExp("^" + marker + "\\s+(.+)$"));
              if (!m) return null;
              var body = String(m[1] || "").trim();
              if (!body) return { heading: "", tail: "" };
              if (/^step\s*\d+\s*:/i.test(body)) {
                return { heading: body, tail: "" };
              }
              var split = body.match(/^(.{1,120}?)\s+((?:Consider|Use|Then|Next|Now|After|Before|Review|Discuss|Complete|Answer|Write|Reflect|Identify|Apply)\b.*)$/);
              if (split) {
                return { heading: String(split[1] || "").trim(), tail: String(split[2] || "").trim() };
              }
              return { heading: body, tail: "" };
            }
            function extractBoldOnlyHeading(textLine) {
              var raw = String(textLine || "").trim();
              var m = raw.match(/^(?:\*\*|<strong>)([^*<][\s\S]*?)(?:\*\*|<\/strong>)$/i);
              if (!m) return "";
              var inner = String(m[1] || "").trim();
              if (!inner) return "";
              if (/[.!?]$/.test(inner)) return "";
              return inner;
            }
            function renderWorksheetPromptLine(labelText) {
              var clean = String(labelText == null ? "" : labelText).trim().replace(/:\s*$/, "");
              if (!clean) return "";
              return '<label class="util-line-label">' + utilityRenderMarkdownInline(clean) + '</label><div class="util-template-note-line" aria-hidden="true"></div>';
            }
            function parseCheckboxItem(textLine) {
              var raw = String(textLine == null ? "" : textLine).trim().replace(/^\s*[-*]\s+/, "");
              if (!raw) return null;
              var m = raw.match(/^(☐|☑|☒|\[(?: |x|X)\])\s+(.+)$/);
              if (!m) return null;
              var token = String(m[1] || "").trim();
              if (/^\[(x|X)\]$/.test(token)) token = "☑";
              if (/^\[\s\]$/.test(token)) token = "☐";
              return { token: token, text: String(m[2] || "").trim() };
            }
            function renderCheckboxList(items) {
              var rows = (Array.isArray(items) ? items : [])
                .map(function (entry) {
                  if (!entry || !entry.text) return "";
                  return '<li><span class="util-checkbox" aria-hidden="true">' +
                    utilityEscapeHtml(String(entry.token || "☐")) +
                    '</span><span>' + utilityRenderMarkdownInline(String(entry.text)) + "</span></li>";
                })
                .filter(function (x) { return !!x; });
              return rows.length ? ('<ul class="util-checkbox-list">' + rows.join("") + "</ul>") : "";
            }
            function cleanResidualHeadingMarkers(s) {
              return String(s == null ? "" : s)
                .replace(/^\s*#{1,3}\s+/gm, "")
                .replace(/\s+#{1,3}\s+/g, " ")
                .trim();
            }
            function splitInlineDashPromptItems(lineText) {
              var raw = String(lineText == null ? "" : lineText).trim();
              if (!raw) return [];
              var content = raw.replace(/^\s*[-*]\s+/, "").trim();
              if (!content) return [];
              var parts = content.split(/\s+-\s+(?=(?:[A-Z]|[0-9]|\*\*|<strong>))/);
              var clean = parts.map(function (p) { return String(p || "").trim(); }).filter(function (p) { return !!p; });
              return clean.length ? clean : [content];
            }
            var blocks = text.split(/\n\s*\n/);
            var html = [];
            blocks.forEach(function (block) {
              var tableHtml = renderMarkdownTableBlock(block);
              if (tableHtml) {
                html.push(tableHtml);
                return;
              }
              var lines = String(block || "").split("\n");
              var expandedLines = [];
              lines.forEach(function (ln) {
                var rawLn = String(ln || "");
                if (/^\s*[-*]\s+/.test(rawLn)) {
                  var splitItems = splitInlineDashPromptItems(rawLn);
                  if (splitItems.length > 1) {
                    splitItems.forEach(function (item) {
                      expandedLines.push("- " + item);
                    });
                    return;
                  }
                }
                expandedLines.push(rawLn);
              });
              lines = expandedLines;
              var trimmedLines = lines.map(function (ln) { return String(ln || "").trim(); }).filter(function (ln) { return !!ln; });
              var worksheetMode =
                ro.materialHint === "template" ||
                ro.materialHint === "checklist" ||
                ro.materialHint === "prompt_set";
              var checkboxLines = trimmedLines
                .map(function (ln) { return parseCheckboxItem(ln); })
                .filter(function (x) { return !!x; });
              if (checkboxLines.length && checkboxLines.length === trimmedLines.length) {
                html.push(renderCheckboxList(checkboxLines));
                return;
              }
              var bulletLines = lines
                .map(function (ln) {
                  var m = String(ln || "").match(/^\s*[-*]\s+(.+)$/);
                  return m ? String(m[1] || "").trim() : "";
                })
                .filter(function (x) { return !!x; });
              if (!bulletLines.length && trimmedLines.length === 1) {
                var inlineBulletRun = String(trimmedLines[0] || "").match(/^\s*[-*]\s+(.+?)\s+-\s+(.+)$/);
                if (inlineBulletRun) {
                  bulletLines = [String(inlineBulletRun[1] || "").trim(), String(inlineBulletRun[2] || "").trim()];
                }
              }
              if (worksheetMode && trimmedLines.length) {
                var wsParts = [];
                trimmedLines.forEach(function (ln) {
                  var lnNoBullet = String(ln || "").replace(/^\s*[-*]\s+/, "").trim();
                  var lnClean = cleanResidualHeadingMarkers(lnNoBullet);
                  var heading3 = parseHeadingWithTail(lnNoBullet, "###");
                  if (heading3 && heading3.heading) {
                    wsParts.push('<h5 class="util-card-subheading">' + utilityRenderMarkdownInline(heading3.heading) + "</h5>");
                    if (heading3.tail) wsParts.push("<p>" + utilityRenderMarkdownInline(heading3.tail) + "</p>");
                    return;
                  }
                  var heading2 = parseHeadingWithTail(lnNoBullet, "##");
                  if (heading2 && heading2.heading) {
                    wsParts.push('<h4 class="util-card-subheading">' + utilityRenderMarkdownInline(heading2.heading) + "</h4>");
                    if (heading2.tail) wsParts.push("<p>" + utilityRenderMarkdownInline(heading2.tail) + "</p>");
                    return;
                  }
                  var numbered = lnClean.match(/^\d+[\.\)]\s+(.+)$/);
                  if (numbered) {
                    wsParts.push('<h5 class="util-card-subheading">' + utilityRenderMarkdownInline(String(numbered[1] || "").trim()) + "</h5>");
                    wsParts.push('<div class="util-template-note-line" aria-hidden="true"></div>');
                    return;
                  }
                  var labelDash = lnClean.match(/^([^:\n]{1,220}):\s*-\s*$/);
                  if (labelDash) {
                    wsParts.push(renderWorksheetPromptLine(labelDash[1]));
                    return;
                  }
                  if (/^-\s*$/.test(lnClean)) {
                    wsParts.push('<div class="util-template-note-line" aria-hidden="true"></div>');
                    return;
                  }
                  if (/:$/.test(lnClean)) {
                    wsParts.push(renderWorksheetPromptLine(lnClean));
                    return;
                  }
                  var lineBullet = lnClean.match(/^\s*[-*]\s+(.+)$/);
                  if (lineBullet) {
                    wsParts.push("<ul><li>" + utilityRenderMarkdownInline(String(lineBullet[1] || "").trim()) + "</li></ul>");
                    return;
                  }
                  wsParts.push("<p>" + utilityRenderMarkdownInline(lnClean) + "</p>");
                });
                if (wsParts.length) {
                  html.push(wsParts.join(""));
                  return;
                }
              }
              if (trimmedLines.length >= 1 && /^(###|##)\s+/.test(trimmedLines[0])) {
                var firstHeading = /^###\s+/.test(trimmedLines[0])
                  ? parseHeadingWithTail(trimmedLines[0], "###")
                  : parseHeadingWithTail(trimmedLines[0], "##");
                if (firstHeading && firstHeading.heading) {
                  html.push(
                    (/^###\s+/.test(trimmedLines[0]) ? '<h5 class="util-card-subheading">' : '<h4 class="util-card-subheading">') +
                    utilityRenderMarkdownInline(firstHeading.heading) +
                    (/^###\s+/.test(trimmedLines[0]) ? "</h5>" : "</h4>")
                  );
                  if (firstHeading.tail) html.push("<p>" + utilityRenderMarkdownInline(firstHeading.tail) + "</p>");
                }
                var remaining = lines.slice(1).map(function (x) { return String(x || "").trim(); }).filter(function (x) { return !!x; }).join(" ");
                if (remaining) {
                  var remainingInline = renderInlineBulletRun(remaining);
                  html.push(remainingInline || ("<p>" + utilityRenderMarkdownInline(cleanResidualHeadingMarkers(remaining)) + "</p>"));
                }
                return;
              }
              if (bulletLines.length >= 1 && bulletLines.length === trimmedLines.length) {
                var grouped = [];
                var listOpen = false;
                var checkboxOpen = false;
                bulletLines.forEach(function (b) {
                  var headingBullet3 = String(b || "").match(/^###\s+(.+)$/);
                  if (headingBullet3) {
                    if (checkboxOpen) {
                      grouped.push("</ul>");
                      checkboxOpen = false;
                    }
                    if (listOpen) {
                      grouped.push("</ul>");
                      listOpen = false;
                    }
                    var hb3 = cleanResidualHeadingMarkers(String(headingBullet3[1] || "").trim());
                    var hb3Split = hb3.match(/^(.{1,120}?)\s+((?:Consider|Use|Then|Next|Now|After|Before|Review|Discuss|Complete|Answer|Write|Reflect|Identify|Apply)\b.*)$/);
                    grouped.push('<h5 class="util-card-subheading">' + utilityRenderMarkdownInline(hb3Split ? hb3Split[1] : hb3) + "</h5>");
                    if (hb3Split && hb3Split[2]) grouped.push("<p>" + utilityRenderMarkdownInline(hb3Split[2]) + "</p>");
                    return;
                  }
                  var headingBullet2 = String(b || "").match(/^##\s+(.+)$/);
                  if (headingBullet2) {
                    if (checkboxOpen) {
                      grouped.push("</ul>");
                      checkboxOpen = false;
                    }
                    if (listOpen) {
                      grouped.push("</ul>");
                      listOpen = false;
                    }
                    var hb2 = cleanResidualHeadingMarkers(String(headingBullet2[1] || "").trim());
                    var hb2Split = hb2.match(/^(.{1,120}?)\s+((?:Consider|Use|Then|Next|Now|After|Before|Review|Discuss|Complete|Answer|Write|Reflect|Identify|Apply)\b.*)$/);
                    grouped.push('<h4 class="util-card-subheading">' + utilityRenderMarkdownInline(hb2Split ? hb2Split[1] : hb2) + "</h4>");
                    if (hb2Split && hb2Split[2]) grouped.push("<p>" + utilityRenderMarkdownInline(hb2Split[2]) + "</p>");
                    return;
                  }
                  var checkbox = parseCheckboxItem(b);
                  var headingOnly = extractBoldOnlyHeading(b);
                  if (headingOnly) {
                    if (checkboxOpen) {
                      grouped.push("</ul>");
                      checkboxOpen = false;
                    }
                    if (listOpen) {
                      grouped.push("</ul>");
                      listOpen = false;
                    }
                    grouped.push('<h5 class="util-card-subheading">' + utilityRenderMarkdownInline(headingOnly) + "</h5>");
                    return;
                  }
                  if (checkbox) {
                    if (listOpen) {
                      grouped.push("</ul>");
                      listOpen = false;
                    }
                    if (!checkboxOpen) {
                      grouped.push('<ul class="util-checkbox-list">');
                      checkboxOpen = true;
                    }
                    grouped.push('<li><span class="util-checkbox" aria-hidden="true">' + utilityEscapeHtml(checkbox.token) + '</span><span>' + utilityRenderMarkdownInline(checkbox.text) + "</span></li>");
                    return;
                  }
                  if (/^-\s*$/.test(String(b || "").trim())) {
                    if (checkboxOpen) {
                      grouped.push("</ul>");
                      checkboxOpen = false;
                    }
                    if (listOpen) {
                      grouped.push("</ul>");
                      listOpen = false;
                    }
                    grouped.push('<div class="util-template-note-line" aria-hidden="true"></div>');
                    return;
                  }
                  var labelDashBullet = String(b || "").match(/^([^:\n]{1,220}):\s*-\s*$/);
                  if (labelDashBullet) {
                    if (checkboxOpen) {
                      grouped.push("</ul>");
                      checkboxOpen = false;
                    }
                    if (listOpen) {
                      grouped.push("</ul>");
                      listOpen = false;
                    }
                    grouped.push(renderWorksheetPromptLine(labelDashBullet[1]));
                    return;
                  }
                  if (!listOpen) {
                    if (checkboxOpen) {
                      grouped.push("</ul>");
                      checkboxOpen = false;
                    }
                    grouped.push("<ul>");
                    listOpen = true;
                  }
                  grouped.push("<li>" + utilityRenderMarkdownInline(cleanResidualHeadingMarkers(String(b))) + "</li>");
                });
                if (listOpen) grouped.push("</ul>");
                if (checkboxOpen) grouped.push("</ul>");
                html.push(grouped.join(""));
              } else if (trimmedLines.length === 1 && /^###\s+/.test(trimmedLines[0])) {
                var h3Split = parseHeadingWithTail(trimmedLines[0], "###");
                if (h3Split && h3Split.heading) {
                  html.push('<h5 class="util-card-subheading">' + utilityRenderMarkdownInline(h3Split.heading) + "</h5>");
                  if (h3Split.tail) html.push("<p>" + utilityRenderMarkdownInline(h3Split.tail) + "</p>");
                }
              } else if (trimmedLines.length === 1 && /^##\s+/.test(trimmedLines[0])) {
                var h2Split = parseHeadingWithTail(trimmedLines[0], "##");
                if (h2Split && h2Split.heading) {
                  html.push('<h4 class="util-card-subheading">' + utilityRenderMarkdownInline(h2Split.heading) + "</h4>");
                  if (h2Split.tail) html.push("<p>" + utilityRenderMarkdownInline(h2Split.tail) + "</p>");
                }
              } else if (trimmedLines.length === 1 && /^([^:\n]{1,220}):\s*-\s*$/.test(trimmedLines[0])) {
                var labelOnly = trimmedLines[0].replace(/:\s*-\s*$/, "");
                html.push(renderWorksheetPromptLine(labelOnly));
              } else if (trimmedLines.length === 1 && /^-\s*$/.test(trimmedLines[0])) {
                html.push('<div class="util-template-note-line" aria-hidden="true"></div>');
              } else if (trimmedLines.length >= 1 && trimmedLines.every(function (ln) { return /^\d+[\.\)]\s+/.test(ln); })) {
                html.push("<ol>" + trimmedLines.map(function (ln) {
                  return "<li>" + utilityRenderMarkdownInline(String(ln).replace(/^\d+[\.\)]\s+/, "")) + "</li>";
                }).join("") + "</ol>");
              } else if (trimmedLines.length === 1 && /:$/.test(trimmedLines[0])) {
                html.push('<p class="util-line-label"><strong>' + utilityRenderMarkdownInline(trimmedLines[0].replace(/:\s*$/, "")) + ":</strong></p>");
              } else {
                var para = lines.join(" ").trim();
                if (para) {
                  var bulletLine = para.match(/^\s*[-*]\s+(.+)$/);
                  if (bulletLine) {
                    var checkboxSingle = parseCheckboxItem(String(bulletLine[1] || "").trim());
                    if (checkboxSingle) {
                      html.push(renderCheckboxList([checkboxSingle]));
                    } else {
                      html.push("<ul><li>" + utilityRenderMarkdownInline(cleanResidualHeadingMarkers(String(bulletLine[1] || "").trim())) + "</li></ul>");
                    }
                    return;
                  }
                  var inlineBulletsHtml = renderInlineBulletRun(para);
                  html.push(inlineBulletsHtml || ("<p>" + utilityRenderMarkdownInline(cleanResidualHeadingMarkers(para)) + "</p>"));
                }
              }
            });
            var built = html.join("");
            if (ro.suppressFirstHeadingText) {
              var headingTextEscaped = String(ro.suppressFirstHeadingText)
                .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
              var headingPattern = new RegExp("^\\s*<h[45][^>]*>\\s*" + headingTextEscaped + "\\s*<\\/h[45]>\\s*", "i");
              built = built.replace(headingPattern, "");
            }
            return built;
          }
          function renderColumnRowsTable(tableObj) {
            if (!tableObj || typeof tableObj !== "object" || Array.isArray(tableObj)) return "";
            var columns = Array.isArray(tableObj.columns) ? tableObj.columns.filter(function (c) { return !utilityIsEmptyValue(c); }) : [];
            var rows = Array.isArray(tableObj.rows) ? tableObj.rows.filter(function (r) { return !utilityIsEmptyValue(r); }) : [];
            if (!columns.length || !rows.length) return "";
            var rowsAreArrays = rows.every(function (r) { return Array.isArray(r); });
            var rowsAreObjects = rows.every(function (r) { return r && typeof r === "object" && !Array.isArray(r); });
            if (!rowsAreArrays && !rowsAreObjects) return "";
            var headers = columns.map(function (c) { return String(c == null ? "" : c).trim(); }).filter(function (c) { return !!c; });
            if (!headers.length) return "";
            function cellHtml(v) {
              if (v == null) return "";
              if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
                return utilityRenderMarkdownInline(String(v));
              }
              return utilityEscapeHtml(JSON.stringify(v));
            }
            function norm(s) {
              return String(s == null ? "" : s).toLowerCase().replace(/[^a-z0-9]+/g, "");
            }
            var bodyRows = rows.map(function (row) {
              var tds = [];
              if (rowsAreArrays) {
                for (var i = 0; i < headers.length; i += 1) {
                  tds.push("<td>" + cellHtml(row[i]) + "</td>");
                }
              } else {
                var rowKeys = {};
                Object.keys(row).forEach(function (rk) { rowKeys[norm(rk)] = rk; });
                for (var h = 0; h < headers.length; h += 1) {
                  var hd = headers[h];
                  var direct = Object.prototype.hasOwnProperty.call(row, hd) ? row[hd] : undefined;
                  var mappedKey = rowKeys[norm(hd)];
                  var mapped = mappedKey && Object.prototype.hasOwnProperty.call(row, mappedKey) ? row[mappedKey] : undefined;
                  var val = direct !== undefined ? direct : mapped;
                  tds.push("<td>" + cellHtml(val) + "</td>");
                }
              }
              return "<tr>" + tds.join("") + "</tr>";
            }).join("");
            if (!bodyRows) return "";
            var head = "<tr>" + headers.map(function (h) { return "<th>" + utilityEscapeHtml(h) + "</th>"; }).join("") + "</tr>";
            return "<table><thead>" + head + "</thead><tbody>" + bodyRows + "</tbody></table>";
          }
          try {
            console.log("[PRISM TRACE] renderMaterialValue:", {
              hint: hint || "(none)",
              valueType: Array.isArray(value) ? "array" : typeof value,
              objectKeys: value && typeof value === "object" && !Array.isArray(value) ? Object.keys(value) : null
            });
          } catch (_) {}
          var tableLikeKey = hint === "table" || hint === "observation_table" || hint === "observations_table" || hint === "data_table";
          if (value && typeof value === "object" && !Array.isArray(value)) {
            var tableHtml = renderColumnRowsTable(value);
            if (tableHtml && (tableLikeKey || (Array.isArray(value.columns) && Array.isArray(value.rows)))) {
              return tableHtml;
            }
          }
          if (typeof value === "string") {
            var structured = renderPlainStructuredText(value, { materialHint: hint });
            return structured || renderCardScopedMarkdown(String(value));
          }
          if (Array.isArray(value)) {
            if (hint === "stages") {
              var stageCards = value
                .map(function (entry, idx) {
                  if (utilityIsEmptyValue(entry)) return "";
                  if (typeof entry === "string") {
                    var stageText = String(entry || "").trim();
                    if (!stageText) return "";
                    return '<article class="util-stage-card"><h5>Stage ' + (idx + 1) + "</h5>" + utilityRenderMarkdownBlock(stageText) + "</article>";
                  }
                  if (!entry || typeof entry !== "object" || Array.isArray(entry)) return "";
                  var stageLabel = firstNonEmpty([entry.stage, entry.stage_title, entry.title, entry.name, entry.heading, entry.label]);
                  var stageBodyRaw = firstNonEmpty([entry.content, entry.text, entry.body, entry.description, entry.prompt]);
                  var stageBody = stageBodyRaw ? utilityRenderMarkdownBlock(String(stageBodyRaw)) : utilityRenderObject(entry, 1, renderOpts);
                  if (!stageBody) return "";
                  var stageHeading = stageLabel ? utilityEscapeHtml(String(stageLabel)) : ("Stage " + (idx + 1));
                  return '<article class="util-stage-card"><h5>' + stageHeading + "</h5>" + stageBody + "</article>";
                })
                .filter(function (x) { return !!x; })
                .join("");
              if (stageCards) return '<div class="util-stage-list">' + stageCards + "</div>";
            }
            if (hint === "key_messages" || hint === "key_message" || hint === "key_points") {
              var compactItems = value
                .map(function (entry) {
                  if (utilityIsEmptyValue(entry)) return "";
                  if (typeof entry === "string" || typeof entry === "number" || typeof entry === "boolean") {
                    var txt = String(entry).trim();
                    if (!txt) return "";
                    return '<li><span aria-hidden="true">✓</span> ' + utilityRenderMarkdownInline(txt) + "</li>";
                  }
                  if (entry && typeof entry === "object" && !Array.isArray(entry)) {
                    var kmt = firstNonEmpty([entry.title, entry.name, entry.label]);
                    var kmb = firstNonEmpty([entry.content, entry.text, entry.body, entry.description, entry.value]);
                    if (kmt && kmb) return '<li><span aria-hidden="true">✓</span> <strong>' + utilityEscapeHtml(kmt) + ":</strong> " + utilityRenderMarkdownInline(kmb) + "</li>";
                    if (kmb) return '<li><span aria-hidden="true">✓</span> ' + utilityRenderMarkdownInline(kmb) + "</li>";
                    if (kmt) return '<li><span aria-hidden="true">✓</span> ' + utilityEscapeHtml(kmt) + "</li>";
                  }
                  return "";
                })
                .filter(function (x) { return !!x; });
              if (compactItems.length) return '<ul class="util-check-list">' + compactItems.join("") + "</ul>";
            }
            var objectMiniCards = value.filter(function (entry) {
              return entry && typeof entry === "object" && !Array.isArray(entry);
            });
            if (objectMiniCards.length === value.length) {
              var cardsHtml = objectMiniCards.map(function (entry) {
                var t = firstNonEmpty([entry.title, entry.name, entry.label, entry.heading]);
                var d = firstNonEmpty([entry.content, entry.text, entry.body, entry.description, entry.prompt, entry.value]);
                if (!t && !d) return "";
                return '<article class="util-mini-card">' +
                  (t ? ("<h5>" + utilityEscapeHtml(String(t)) + "</h5>") : "") +
                  (d ? (renderPlainStructuredText(d) || ("<p>" + utilityRenderMarkdownInline(String(d)) + "</p>")) : "") +
                  "</article>";
              }).filter(function (x) { return !!x; }).join("");
              if (cardsHtml) return cardsHtml;
            }
            if (hint === "strategy_options" || hint === "options" || hint === "strategies") {
              return renderBulletArray(value, { plainLabels: true, stripStandaloneBold: true });
            }
            var onlyStrings = value.every(function (entry) {
              return typeof entry === "string" || typeof entry === "number" || typeof entry === "boolean";
            });
            if (onlyStrings) {
              var asBlocks = value
                .map(function (entry) {
                  var raw = String(entry == null ? "" : entry).trim();
                  if (!raw) return "";
                  return renderPlainStructuredText(raw, { materialHint: hint }) || utilityRenderMarkdownBlock(raw);
                })
                .filter(function (x) { return !!String(x || "").trim(); });
              if (asBlocks.length) return asBlocks.join("");
            }
            return renderBulletArray(value) || utilityRenderArray(value, renderOpts);
          }
          if (value && typeof value === "object") {
            var keys = Object.keys(value).filter(function (k) { return !utilityIsEmptyValue(value[k]); });
            if (!keys.length) return "";
            var valueHeading = firstNonEmpty([value.heading, value.title]);
            if (!utilityIsEmptyValue(value.prompt) && Array.isArray(value.options)) {
              var promptHtml = renderPlainStructuredText(value.prompt) || ("<p>" + utilityRenderMarkdownInline(String(value.prompt)) + "</p>");
              var optionsHtml = renderBulletArray(value.options, { plainLabels: true, stripStandaloneBold: true });
              var promptOptionsCombined = promptHtml + (optionsHtml || "");
              if (promptOptionsCombined) return promptOptionsCombined;
            }
            if (Array.isArray(value.sections) && (hint === "checklist" || hint === "checklists")) {
              var checklistSections = value.sections
                .map(function (sec) {
                  if (utilityIsEmptyValue(sec)) return "";
                  if (typeof sec === "string") return renderPlainStructuredText(sec);
                  if (!sec || typeof sec !== "object" || Array.isArray(sec)) return "";
                  var secTitle = firstNonEmpty([sec.heading, sec.title, sec.name, sec.label, sec.section]);
                  var secItems = renderBulletArray(firstNonEmptyRaw([sec.items, sec.prompts, sec.points, sec.lines]), { plainLabels: true, stripStandaloneBold: true });
                  var secBody = secItems || renderMaterialValue(firstNonEmptyRaw([sec.content, sec.text, sec.body]), "content");
                  if (!secBody) return "";
                  return (secTitle ? ("<h5>" + utilityEscapeHtml(String(secTitle)) + "</h5>") : "") + secBody;
                })
                .filter(function (x) { return !!String(x || "").trim(); })
                .join("");
              if (checklistSections) return checklistSections;
            }
            if (Array.isArray(value.sections) && (hint === "template" || hint === "templates" || hint === "escalation_template")) {
              var templateSections = value.sections
                .map(function (sec) {
                  if (utilityIsEmptyValue(sec)) return "";
                  if (typeof sec === "string") {
                    var secHeading = String(sec).trim();
                    if (!secHeading) return "";
                    return '<article class="util-template-block"><h5>' +
                      utilityEscapeHtml(secHeading) +
                      '</h5><div class="util-template-note-line" aria-hidden="true"></div></article>';
                  }
                  if (!sec || typeof sec !== "object" || Array.isArray(sec)) return "";
                  var secTitle = firstNonEmpty([sec.heading, sec.title, sec.name, sec.label, sec.section]);
                  var secLines = firstNonEmptyRaw([sec.lines, sec.items, sec.fields, sec.prompts, sec.entries]);
                  var secBody = renderBulletArray(secLines, { plainLabels: true, stripStandaloneBold: true });
                  if (!secBody) secBody = renderMaterialValue(firstNonEmptyRaw([sec.content, sec.text, sec.body]), "content");
                  if (!secBody) return "";
                  return '<article class="util-template-block">' +
                    (secTitle ? ("<h5>" + utilityEscapeHtml(String(secTitle)) + "</h5>") : "") +
                    secBody +
                    '<div class="util-template-note-line" aria-hidden="true"></div>' +
                    "</article>";
                })
                .filter(function (x) { return !!String(x || "").trim(); })
                .join("");
              if (templateSections) return templateSections;
            }
            if (hint === "escalation_template" && !Array.isArray(value.sections)) {
              var sbKeys = [
                ["situation", "Situation"],
                ["background", "Background"],
                ["assessment", "Assessment"],
                ["recommendation", "Recommendation"]
              ];
              var sbBlocks = sbKeys
                .map(function (pair) {
                  var rawVal = value[pair[0]];
                  if (utilityIsEmptyValue(rawVal)) return "";
                  var sectionBody = renderMaterialValue(rawVal, pair[0]);
                  if (!sectionBody) return "";
                  return '<article class="util-template-block"><h5>' +
                    utilityEscapeHtml(pair[1]) +
                    "</h5>" +
                    sectionBody +
                    '<div class="util-template-note-line" aria-hidden="true"></div></article>';
                })
                .filter(function (x) { return !!String(x || "").trim(); })
                .join("");
              if (sbBlocks) return sbBlocks;
            }
            var consumed = {
              material_id: true,
              materialId: true,
              title: true,
              heading: true,
              items: true,
              table: true
            };
            var preface = [];
            if (!utilityIsEmptyValue(value.items)) {
              preface.push(renderMaterialValue(value.items, "items"));
            }
            if (!utilityIsEmptyValue(value.table)) {
              preface.push(renderMaterialValue(value.table, "table"));
            }
            var nested = keys
              .map(function (k) {
                if (consumed[k]) return "";
                var nestedValue = value[k];
                var lowerNestedKey = String(k || "").toLowerCase();
                var nestedSimpleArray = Array.isArray(nestedValue) && nestedValue.every(function (entry) {
                  return typeof entry === "string" || typeof entry === "number" || typeof entry === "boolean";
                });
                var nestedHeading = nestedValue && typeof nestedValue === "object" && !Array.isArray(nestedValue)
                  ? firstNonEmpty([nestedValue.heading, nestedValue.title])
                  : "";
                var forceBulletList =
                  nestedSimpleArray &&
                  (
                    (hint === "prompt_set" && lowerNestedKey === "prompts") ||
                    (hint === "checklist" && lowerNestedKey === "items")
                  );
                var inner = forceBulletList
                  ? renderBulletArray(nestedValue)
                  : (nestedHeading
                    ? renderMaterialValue(nestedValue, k, { suppressOwnHeading: true })
                    : renderMaterialValue(nestedValue, k));
                if (!String(inner || "").trim()) return "";
                if (k === "items" || k === "table") return inner;
                if (lowerNestedKey === "content" && valueHeading) {
                  var innerRaw = nestedValue;
                  if (typeof innerRaw === "string") {
                    return renderPlainStructuredText(innerRaw, { suppressFirstHeadingText: valueHeading }) || inner;
                  }
                  return inner;
                }
                var headingText = nestedHeading || prettyMaterialHeading(k);
                var heading = "<h5>" + utilityEscapeHtml(String(headingText)) + "</h5>";
                if (isCardLikeMaterialKey(k)) {
                  return '<article class="util-material-card">' + heading + inner + "</article>";
                }
                return heading + inner;
              })
              .filter(function (x) { return !!x; })
              .join("");
            var combined = preface.filter(function (x) { return !!String(x || "").trim(); }).join("") + nested;
            if (combined) {
              if (valueHeading && !cfg.suppressOwnHeading) {
                return "<h5>" + utilityEscapeHtml(String(valueHeading)) + "</h5>" + combined;
              }
              return combined;
            }
            return utilityRenderObject(value, 0, renderOpts);
          }
          return utilityRenderPrimitive(value, renderOpts);
        }
        if (typeof materials === "string") {
          return utilityRenderMarkdownBlock(materials);
        }
        if (Array.isArray(materials)) {
          return renderBulletArray(materials);
        }
        if (!materials || typeof materials !== "object") return "";
        var parts = [];
        var scenarios = firstNonEmptyRaw([materials.scenarios, materials.study_scenarios, materials.scenario_set]);
        try {
          console.log("[PRISM TRACE] scenarios encountered:", {
            hasScenariosKey: Object.prototype.hasOwnProperty.call(materials, "scenarios"),
            scenariosType: Array.isArray(scenarios) ? "array" : typeof scenarios,
            scenariosKeys: scenarios && typeof scenarios === "object" && !Array.isArray(scenarios) ? Object.keys(scenarios) : null
          });
        } catch (_) {}
        var scenariosRendered = false;
        if (Array.isArray(scenarios) && scenarios.length) {
          try {
            console.log("[PRISM TRACE] scenarios render helper = renderScenarioBlocks (array path), count =", scenarios.length);
          } catch (_) {}
          var scenarioHtml = renderScenarioBlocks(scenarios);
          if (scenarioHtml) {
            var hideScenariosHeading = scenarioItemsAreSelfLabeled(scenarios);
            parts.push((hideScenariosHeading ? "" : "<h4>Scenarios</h4>") + scenarioHtml);
            scenariosRendered = true;
            try {
              console.log("[PRISM TRACE] scenarios rendered via renderScenarioBlocks");
            } catch (_) {}
          } else {
            try {
              console.log("[PRISM TRACE] scenarios array path produced empty HTML");
            } catch (_) {}
          }
        } else if (!utilityIsEmptyValue(scenarios)) {
          try {
            console.log("[PRISM TRACE] scenarios present but not array; array path skipped");
          } catch (_) {}
        }
        var analysisTable = firstNonEmptyRaw([materials.analysis_table, materials.table]);
        if (!utilityIsEmptyValue(analysisTable)) {
          var tableSource = analysisTable;
          if (typeof tableSource === "string") {
            var lines = String(tableSource || "").split(/\r?\n/);
            var headerIdx = -1;
            var dividerIdx = -1;
            for (var li = 0; li < lines.length; li += 1) {
              if (lines[li].indexOf("|") !== -1) {
                headerIdx = li;
                if (li + 1 < lines.length && utilityIsMarkdownTableDivider(lines[li + 1])) dividerIdx = li + 1;
                break;
              }
            }
            var scenarioCount = Array.isArray(scenarios) ? scenarios.length : 0;
            if (headerIdx !== -1 && dividerIdx !== -1 && scenarioCount > 1) {
              var existingRows = 0;
              for (var ri = dividerIdx + 1; ri < lines.length; ri += 1) {
                var rowLine = String(lines[ri] || "").trim();
                if (!rowLine || rowLine.indexOf("|") === -1) break;
                existingRows += 1;
              }
              var headerCells = utilityParseMarkdownTableRow(lines[headerIdx]);
              if (headerCells.length >= 2 && existingRows < scenarioCount) {
                var blanksNeeded = scenarioCount - existingRows;
                var blankRow = "| " + headerCells.map(function () { return " "; }).join(" | ") + " |";
                var insertion = [];
                for (var bi = 0; bi < blanksNeeded; bi += 1) insertion.push(blankRow);
                Array.prototype.splice.apply(lines, [dividerIdx + 1 + existingRows, 0].concat(insertion));
                tableSource = lines.join("\n");
              }
            }
          }
          var tableHtml = "";
          if (typeof tableSource === "string") {
            tableHtml = utilityRenderMarkdownBlock(String(tableSource));
          } else {
            tableHtml = renderMaterialValue(tableSource, "analysis_table");
          }
          if (tableHtml) {
            parts.push(
              "<h4>Worksheet</h4>" +
              "<p>Use this table to record your group's decision for each scenario.</p>" +
              tableHtml
            );
          }
        }
        var strategyOptions = firstNonEmptyRaw([materials.strategy_options, materials.options, materials.strategies]);
        var strategyHtml = renderMaterialValue(strategyOptions, "strategy_options");
        if (strategyHtml) parts.push("<h4>Strategy options</h4>" + strategyHtml);
        Object.keys(materials).forEach(function (k) {
          var lowerK = String(k || "").toLowerCase();
          if (lowerK === "scenarios" && !scenariosRendered) {
            var scenariosVal = materials[k];
            if (scenariosVal && typeof scenariosVal === "object" && !Array.isArray(scenariosVal)) {
              var scenariosFallback = renderMaterialValue(scenariosVal, "Scenarios");
              if (scenariosFallback) {
                parts.push("<h4>Scenarios</h4>" + scenariosFallback);
                scenariosRendered = true;
                try {
                  console.log("[PRISM TRACE] scenarios rendered via renderMaterialValue fallback (object path)");
                } catch (_) {}
              } else {
                try {
                  console.log("[PRISM TRACE] scenarios object fallback attempted but produced empty HTML");
                } catch (_) {}
              }
            }
            if (scenariosRendered) {
              try {
                console.log("[PRISM TRACE] material key skipped in remainder loop after render:", k);
              } catch (_) {}
              return;
            }
          }
          if (lowerK === "scenarios" && !scenariosRendered) {
            try {
              console.log("[PRISM TRACE] scenarios not yet rendered; allowing generic remainder render:", k);
            } catch (_) {}
          } else if (["study_scenarios", "scenario_set", "analysis_table", "table", "strategy_options", "options", "strategies", "material_id", "materialId", "title", "heading", "items"].indexOf(String(k || "")) !== -1 || (lowerK === "scenarios" && scenariosRendered)) {
            try {
              console.log("[PRISM TRACE] material key skipped in remainder loop:", k);
            } catch (_) {}
            return;
          }
          var val = materials[k];
          if (utilityIsEmptyValue(val)) return;
          var rendered = renderMaterialValue(val, k);
          if (!rendered) return;
          var subsectionTitle = "";
          if (val && typeof val === "object" && !Array.isArray(val)) {
            subsectionTitle = firstNonEmpty([val.heading, val.title]);
            if (subsectionTitle) {
              rendered = renderMaterialValue(val, k, { suppressOwnHeading: true });
              if (!rendered) return;
            }
          }
          var title = "<h4>" + utilityEscapeHtml(String(subsectionTitle || prettyMaterialHeading(k))) + "</h4>";
          if (String(k || "").toLowerCase() === "table") title = "";
          if (isCardLikeMaterialKey(k)) {
            parts.push('<article class="util-material-card">' + title + rendered + "</article>");
          } else {
            parts.push(title + rendered);
          }
        });
        if (parts.length === 1) {
          parts[0] = String(parts[0] || "").replace(/^<h4>[^<]+<\/h4>/, "");
        }
        return parts.join("");
      }
      return rows
        .map(function (row, idx) {
          if (!row || typeof row !== "object" || Array.isArray(row)) {
            var primitive = utilityRenderPrimitive(row, renderOpts);
            if (!String(primitive || "").trim()) return "";
            return '<article class="util-task-block"><h3>' + utilityEscapeHtml("Activity " + (idx + 1)) + "</h3>" + primitive + "</article>";
          }
          var title = firstNonEmpty([
            row.title,
            row.activity_title,
            row.name,
            row.activity_name,
            row.activity
          ]) || ("Activity " + (idx + 1));
          var purposeFromRow = "";
          function asPurposeScalar(value) {
            if (value == null) return "";
            if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
              return String(value).trim();
            }
            return "";
          }
          if (!utilityIsEmptyValue(row.purpose)) {
            if (typeof row.purpose === "string" || typeof row.purpose === "number" || typeof row.purpose === "boolean") {
              purposeFromRow = String(row.purpose).trim();
            } else if (row.purpose && typeof row.purpose === "object" && !Array.isArray(row.purpose)) {
              var purposeCandidates = [
                row.purpose.purpose,
                row.purpose.statement,
                row.purpose.summary,
                row.purpose.objective,
                row.purpose.aim,
                row.purpose.description,
                row.purpose.content,
                row.purpose.text,
                row.purpose.body
              ];
              for (var pi = 0; pi < purposeCandidates.length; pi += 1) {
                var candidate = asPurposeScalar(purposeCandidates[pi]);
                if (candidate) {
                  purposeFromRow = candidate;
                  break;
                }
              }
            }
          }
          var purposeTask = purposeFromRow;
          var timing = firstNonEmpty([
            row.timing,
            row.time,
            row.timing_minutes
          ]);
          var duration = firstNonEmpty([row.duration_minutes, row.duration, row.minutes]);
          function prettyGroupingValue(v) {
            var raw = String(v == null ? "" : v).trim().toLowerCase();
            if (!raw) return "";
            if (raw === "small_group") return "Small group";
            if (raw === "whole_group") return "Whole group";
            if (raw === "pair") return "Pair";
            if (raw === "individual") return "Individual";
            return utilityLabelFromKey(raw);
          }
          var grouping = firstNonEmpty([
            row.grouping,
            row.group_size,
            row.grouping_mode,
            row.pairing,
            row.team_structure
          ]);
          var expectedOutput = firstNonEmpty([
            row.expected_output,
            row.output,
            row.deliverable,
            row.artefact
          ]);
          var learnerTaskRaw = firstNonEmptyRaw([
            row.learner_task,
            row.task,
            row.instructions
          ]);
          var instructions = firstNonEmptyRaw([row.learner_instructions, row.instructions, row.instruction, row.steps, row.concise_instructions]);
          var materials = firstNonEmptyRaw([row.materials, row.activity_materials, row.resources]);
          var supportNote = firstNonEmpty([row.support_note, row.support_notes, row.facilitator_note, row.facilitator_notes]);
          var parts = [];
          var headerBadges = [];
          if (timing || duration) {
            if (timing) headerBadges.push('<span class="util-badge util-badge-time">' + utilityEscapeHtml("Time: " + formatMinutesIfBare(timing)) + "</span>");
            if (duration) headerBadges.push('<span class="util-badge">' + utilityEscapeHtml("Duration: " + String(duration) + (/\bmin\b/i.test(String(duration)) ? "" : " mins")) + "</span>");
          }
          if (grouping) {
            headerBadges.push('<span class="util-badge util-badge-group">' + utilityEscapeHtml("Grouping: " + prettyGroupingValue(grouping)) + "</span>");
          }
          parts.push('<div class="util-activity-header"><h3>' + utilityEscapeHtml(title) + "</h3>" + (headerBadges.length ? ('<div class="util-badge-row">' + headerBadges.join("") + "</div>") : "") + "</div>");
          if (purposeTask) {
            parts.push("<p><strong>Task:</strong> " + utilityRenderMarkdownInline(summarizeOneSentence(String(purposeTask))) + "</p>");
          }
          var learnerTaskHtml = renderListFromInstructions(learnerTaskRaw);
          if (learnerTaskHtml) {
            parts.push('<div class="util-activity-task"><h4>What to do</h4>' + learnerTaskHtml + "</div>");
          }
          var instructionHtml = renderListFromInstructions(instructions);
          if (instructionHtml && normalizeComparableText(String(instructionHtml)) !== normalizeComparableText(String(learnerTaskHtml || ""))) {
            parts.push("<h4>Guidance</h4>" + instructionHtml);
          }
          var materialsHtml = renderMaterialsForActivity(materials);
          if (materialsHtml) {
            parts.push("<h4>Materials</h4>" + materialsHtml);
          }
          if (expectedOutput) {
            parts.push("<h4>Output</h4><p>" + utilityRenderMarkdownInline(String(expectedOutput)) + "</p>");
          }
          if (supportNote) {
            parts.push('<p class="util-support-note"><strong>Support note:</strong> ' + utilityRenderMarkdownInline(String(supportNote)) + "</p>");
          }
          if (parts.length <= 1) return "";
          return '<article class="util-task-block">' + parts.join("") + "</article>";
        })
        .filter(function (x) { return !!String(x || "").trim(); })
        .join("");
    }
    function renderLearningSequenceBlocks(sequenceRows, activityLookup) {
      var rows = Array.isArray(sequenceRows) ? sequenceRows.filter(function (row) { return !utilityIsEmptyValue(row); }) : [];
      if (!rows.length) return { timelineHtml: "", facilitatorHtml: "" };
      var timeline = [];
      var facilitatorNotes = [];
      var lookup = activityLookup && typeof activityLookup === "object" ? activityLookup : {};
      rows.forEach(function (row, idx) {
        if (!row || typeof row !== "object" || Array.isArray(row)) return;
        var minute = firstNonEmpty([row.start_minute, row.startMinute, row.time, row.start_time]);
        var duration = firstNonEmpty([row.duration_minutes, row.duration, row.minutes]);
        var phase = firstNonEmpty([row.phase_type, row.phase, row.segment_type]);
        var learnerTask = firstNonEmpty([row.learner_actions, row.learner_task, row.task, row.instructions, row.activity]);
        var facilitator = firstNonEmpty([row.facilitator_actions, row.facilitator_notes, row.notes]);
        var mappedTitle = lookup[normalizeActivityLookupKey(firstNonEmpty([row.activity_id, row.activityId]))] || "";
        var title = firstNonEmpty([mappedTitle, row.title, row.activity_title, row.name]) || ("Activity " + (idx + 1));
        var metaLine = [];
        if (minute) metaLine.push("Time: " + formatMinutesIfBare(minute));
        if (duration) metaLine.push("Duration: " + String(duration) + (/\bmin\b/i.test(String(duration)) ? "" : " mins"));
        if (phase) metaLine.push("Phase: " + String(phase));
        var body = [];
        if (metaLine.length) body.push("<p><strong>" + utilityEscapeHtml(metaLine.join(" | ")) + "</strong></p>");
        body.push("<h3>" + utilityEscapeHtml(title) + "</h3>");
        if (learnerTask) body.push("<p><strong>Learner task:</strong> " + utilityRenderMarkdownInline(String(learnerTask)) + "</p>");
        timeline.push('<article class="util-task-block">' + body.join("") + "</article>");
        if (facilitator) {
          facilitatorNotes.push(
            "<li><strong>" + utilityEscapeHtml(title) + ":</strong> " + utilityRenderMarkdownInline(String(facilitator)) + "</li>"
          );
        }
      });
      return {
        timelineHtml: timeline.join(""),
        facilitatorHtml: facilitatorNotes.length
          ? ("<section><h2>Facilitator Notes</h2><ul>" + facilitatorNotes.join("") + "</ul></section>")
          : ""
      };
    }
    function getLearningActivitiesRows(value) {
      if (Array.isArray(value)) return value.filter(function (row) { return !utilityIsEmptyValue(row); });
      if (value && typeof value === "object") {
        if (Array.isArray(value.items)) return value.items.filter(function (row) { return !utilityIsEmptyValue(row); });
        if (Array.isArray(value.activities)) return value.activities.filter(function (row) { return !utilityIsEmptyValue(row); });
      }
      return [];
    }
    function buildLearningActivityRowLookup(value) {
      var map = {};
      getLearningActivitiesRows(value).forEach(function (row) {
        if (!row || typeof row !== "object" || Array.isArray(row)) return;
        var id = normalizeActivityLookupKey(firstNonEmpty([row.activity_id, row.activityId, row.id]));
        if (!id) return;
        map[id] = row;
      });
      return map;
    }
    function pickActivityResourcesForId(resourcesValue, activityId, usedResourceKeys) {
      var aid = normalizeActivityLookupKey(activityId);
      if (!aid || utilityIsEmptyValue(resourcesValue)) return null;
      var used = usedResourceKeys && typeof usedResourceKeys === "object" ? usedResourceKeys : {};
      function resourceKeyFor(entry) {
        if (entry && typeof entry === "object" && !Array.isArray(entry)) {
          return normalizeActivityLookupKey(
            firstNonEmpty([
              entry.material_id,
              entry.materialId,
              entry.id,
              entry.title,
              entry.card_title,
              entry.name,
              entry.prompt,
              entry.text,
              entry.content
            ])
          );
        }
        return normalizeActivityLookupKey(String(entry == null ? "" : entry));
      }
      function entryMatchesActivity(entry) {
        if (!entry || typeof entry !== "object" || Array.isArray(entry)) return false;
        var id = normalizeActivityLookupKey(firstNonEmpty([entry.activity_id, entry.activityId, entry.for_activity, entry.parent_activity_id]));
        return !!id && id === aid;
      }
      function dedupeEntries(entries) {
        return (Array.isArray(entries) ? entries : []).filter(function (entry) {
          if (utilityIsEmptyValue(entry)) return false;
          var key = resourceKeyFor(entry);
          if (!key) return true;
          if (used[key]) return false;
          used[key] = true;
          return true;
        });
      }
      if (resourcesValue && typeof resourcesValue === "object" && !Array.isArray(resourcesValue)) {
        Object.keys(resourcesValue).forEach(function (k) {
          if (normalizeActivityLookupKey(k) !== aid) return;
          var direct = resourcesValue[k];
          if (Array.isArray(direct)) {
            var directList = dedupeEntries(direct);
            if (directList.length) resourcesValue = { items: directList };
          } else if (!utilityIsEmptyValue(direct)) {
            resourcesValue = direct;
          }
        });
      }
      if (Array.isArray(resourcesValue)) {
        var arr = dedupeEntries(
          resourcesValue.filter(function (entry) { return entryMatchesActivity(entry); })
        );
        return arr.length ? arr : null;
      }
      if (resourcesValue && typeof resourcesValue === "object") {
        if (Object.prototype.hasOwnProperty.call(resourcesValue, aid)) {
          var directVal = resourcesValue[aid];
          if (Array.isArray(directVal)) {
            var directFiltered = dedupeEntries(directVal);
            return directFiltered.length ? directFiltered : null;
          }
          return utilityIsEmptyValue(directVal) ? null : directVal;
        }
        var candidateArrays = ["items", "materials", "cards", "prompts", "resources"];
        for (var i = 0; i < candidateArrays.length; i += 1) {
          var key = candidateArrays[i];
          if (!Array.isArray(resourcesValue[key])) continue;
          var matched = dedupeEntries(
            resourcesValue[key].filter(function (entry) { return entryMatchesActivity(entry); })
          );
          if (matched.length) return matched;
        }
      }
      return null;
    }
    function renderActivityFlowBlocks(sequenceRows, learningActivitiesValue, resourcesValue) {
      var rows = Array.isArray(sequenceRows) ? sequenceRows.filter(function (row) { return !utilityIsEmptyValue(row); }) : [];
      if (!rows.length) return { html: "", facilitatorHtml: "" };
      var activityTitleLookup = buildLearningActivityLookup(learningActivitiesValue);
      var activityRowLookup = buildLearningActivityRowLookup(learningActivitiesValue);
      var usedResourceKeys = {};
      var facilitatorNotes = [];
      function renderActionableResourceSnippet(resourcesForActivity) {
        var flattened = [];
        function pushEntry(entry, hintedType) {
          if (utilityIsEmptyValue(entry)) return;
          if (Array.isArray(entry)) {
            entry.forEach(function (x) { pushEntry(x, hintedType); });
            return;
          }
          if (entry && typeof entry === "object") {
            var type = String(firstNonEmpty([
              entry.type,
              entry.material_type,
              entry.kind,
              hintedType
            ]) || "").toLowerCase();
            var title = firstNonEmpty([entry.title, entry.card_title, entry.name, entry.label]);
            var content = firstNonEmpty([entry.content, entry.text, entry.body, entry.prompt, entry.description]);
            flattened.push({
              type: type,
              title: title,
              content: content,
              source: entry
            });
            if (Array.isArray(entry.cards)) pushEntry(entry.cards, type || "task_cards");
            if (Array.isArray(entry.items)) pushEntry(entry.items, type || "checklist");
            if (Array.isArray(entry.prompts)) pushEntry(entry.prompts, type || "prompt_set");
            return;
          }
          flattened.push({ type: String(hintedType || ""), title: "", content: String(entry), source: null });
        }
        if (resourcesForActivity && typeof resourcesForActivity === "object" && !Array.isArray(resourcesForActivity)) {
          Object.keys(resourcesForActivity).forEach(function (k) {
            pushEntry(resourcesForActivity[k], String(k || "").toLowerCase());
          });
        } else {
          pushEntry(resourcesForActivity, "");
        }
        function pick(predicate) {
          for (var i = 0; i < flattened.length; i += 1) {
            var item = flattened[i];
            if (!item || utilityIsEmptyValue(item.content)) continue;
            if (predicate(item)) return item;
          }
          return null;
        }
        var chosen =
          pick(function (x) { return /\btask[_\s-]?cards?\b/.test(x.type); }) ||
          pick(function (x) { return /\bchecklist\b/.test(x.type); }) ||
          pick(function (x) { return /\bscenario\b/.test(x.type); }) ||
          pick(function (x) { return /\btemplate|worksheet\b/.test(x.type); }) ||
          pick(function (_x) { return true; });
        if (!chosen) return "";
        var bodyText = String(chosen.content || "").trim();
        if (!bodyText) return "";
        var lines = bodyText.split(/\r?\n/).map(function (l) { return String(l || "").trim(); }).filter(Boolean);
        var firstLine = lines.length ? lines[0] : bodyText;
        var lower = firstLine.toLowerCase();
        var modeHeading = "Try this";
        if (/\breflect|reflection\b/.test(lower)) modeHeading = "Reflect";
        else if (/\bdiscuss|discussion\b/.test(lower)) modeHeading = "Discuss";
        var excerpt = summarizeOneSentence(firstLine);
        var resourcesLabel = chosen.title || utilityLabelFromKey(chosen.type || "resource");
        var html = [];
        html.push("<h4>" + utilityEscapeHtml(modeHeading) + "</h4>");
        html.push("<p>" + utilityRenderMarkdownInline(excerpt) + "</p>");
        if (lines.length > 1) {
          var bullets = lines.slice(1, 4).map(function (line) {
            return "<li>" + utilityRenderMarkdownInline(line.replace(/^[-*]\s+/, "")) + "</li>";
          }).join("");
          if (bullets) html.push("<ul>" + bullets + "</ul>");
        }
        html.push("<h4>Resources</h4><ul><li>" + utilityEscapeHtml(resourcesLabel) + "</li></ul>");
        return html.join("");
      }
      var blocks = rows.map(function (row, idx) {
        if (!row || typeof row !== "object" || Array.isArray(row)) return "";
        var activityId = firstNonEmpty([row.activity_id, row.activityId]);
        var aid = normalizeActivityLookupKey(activityId);
        var activityRow = aid ? (activityRowLookup[aid] || null) : null;
        var mappedTitle = aid ? (activityTitleLookup[aid] || "") : "";
        var hasActivityId = !!aid;
        var title = firstNonEmpty([
          mappedTitle,
          activityRow && activityRow.title,
          activityRow && activityRow.activity_title,
          row.title,
          row.activity_title,
          row.name
        ]) || (hasActivityId ? ("Activity " + (idx + 1)) : friendlySessionStepTitle(row.phase_type || row.phase, idx + 1));
        var minute = firstNonEmpty([row.start_minute, row.startMinute, row.time, row.start_time]);
        var duration = firstNonEmpty([row.duration_minutes, row.duration, row.minutes, activityRow && activityRow.duration_minutes]);
        var learnerTaskRaw = firstNonEmpty([
          activityRow && activityRow.learner_task,
          row.learner_actions,
          row.learner_task,
          row.task,
          row.instructions,
          activityRow && activityRow.instructions
        ]);
        var intro = summarizeOneSentence(learnerTaskRaw);
        var expectedOutput = firstNonEmpty([
          activityRow && activityRow.expected_output,
          row.expected_output,
          row.output
        ]);
        var reflectionPrompt = firstNonEmpty([
          activityRow && activityRow.reflection_prompt,
          row.reflection_prompt
        ]);
        var grouping = firstNonEmpty([
          activityRow && activityRow.grouping,
          row.grouping
        ]);
        var facilitatorTip = firstNonEmpty([
          row.facilitator_actions,
          activityRow && activityRow.facilitator_moves
        ]);
        var parts = [];
        if (minute || duration) {
          var timingBits = [];
          if (minute) timingBits.push("Time: " + formatMinutesIfBare(minute));
          if (duration) timingBits.push("Duration: " + String(duration) + (/\bmin\b/i.test(String(duration)) ? "" : " mins"));
          parts.push("<p><strong>" + utilityEscapeHtml(timingBits.join(" | ")) + "</strong></p>");
        }
        parts.push("<h3>" + utilityEscapeHtml(title) + "</h3>");
        var introNorm = normalizeComparableText(intro);
        var taskNorm = normalizeComparableText(learnerTaskRaw);
        var showTaskDetail = !!learnerTaskRaw && taskNorm && taskNorm !== introNorm;
        if (intro) parts.push("<p>" + utilityRenderMarkdownInline(intro) + "</p>");
        if (showTaskDetail) parts.push("<p><strong>Learner task:</strong> " + utilityRenderMarkdownInline(String(learnerTaskRaw)) + "</p>");
        if (hasActivityId && grouping) parts.push("<p><strong>Grouping:</strong> " + utilityRenderMarkdownInline(
          (function () {
            var raw = String(grouping == null ? "" : grouping).trim().toLowerCase();
            if (!raw) return "";
            if (raw === "small_group") return "Small group";
            if (raw === "whole_group") return "Whole group";
            if (raw === "pair") return "Pair";
            if (raw === "individual") return "Individual";
            return utilityLabelFromKey(raw);
          })()
        ) + "</p>");
        var activityResources = hasActivityId ? pickActivityResourcesForId(resourcesValue, aid, usedResourceKeys) : null;
        if (!utilityIsEmptyValue(activityResources)) {
          var actionableSnippet = renderActionableResourceSnippet(activityResources);
          if (actionableSnippet) parts.push(actionableSnippet);
        }
        if (hasActivityId && expectedOutput) parts.push("<p><strong>Expected output:</strong> " + utilityRenderMarkdownInline(String(expectedOutput)) + "</p>");
        if (hasActivityId && reflectionPrompt) parts.push("<p><strong>Reflection prompt:</strong> " + utilityRenderMarkdownInline(String(reflectionPrompt)) + "</p>");
        if (facilitatorTip) {
          var subtleTip = summarizeOneSentence(facilitatorTip);
          facilitatorNotes.push("<li><strong>" + utilityEscapeHtml(title) + ":</strong> " + utilityRenderMarkdownInline(String(facilitatorTip)) + "</li>");
        }
        if (parts.length <= 1) return "";
        var blockClass = hasActivityId ? "util-task-block" : "util-task-block util-session-step";
        return '<article class="' + blockClass + '">' + parts.join("") + "</article>";
      }).filter(function (x) { return !!String(x || "").trim(); });
      return {
        html: blocks.join(""),
        facilitatorHtml: facilitatorNotes.length
          ? ("<section><h2>Facilitator Notes</h2><ul>" + facilitatorNotes.join("") + "</ul></section>")
          : ""
      };
    }
    function buildLinkedItemIndexFromSectionsObject(sectionsObj, skipKey) {
      var index = {};
      function add(key, value) {
        var k = normalizeActivityLookupKey(key);
        if (!k || utilityIsEmptyValue(value)) return;
        if (!index[k]) index[k] = [];
        index[k].push(value);
      }
      function walk(node) {
        if (utilityIsEmptyValue(node)) return;
        if (Array.isArray(node)) {
          node.forEach(walk);
          return;
        }
        if (node && typeof node === "object") {
          add(firstNonEmpty([node.activity_id, node.activityId]), node);
          add(firstNonEmpty([node.item_id, node.itemId]), node);
          add(firstNonEmpty([node.material_id, node.materialId]), node);
          add(firstNonEmpty([node.id]), node);
          Object.keys(node).forEach(function (k) {
            var val = node[k];
            if (utilityIsEmptyValue(val)) return;
            if (typeof val === "object") walk(val);
          });
        }
      }
      var src = sectionsObj && typeof sectionsObj === "object" ? sectionsObj : {};
      Object.keys(src).forEach(function (key) {
        if (skipKey && key === skipKey) return;
        walk(src[key]);
      });
      return index;
    }
    function pickLinkedResourcesForIds(resourcesValue, idCandidates, usedResourceKeys) {
      var ids = Array.isArray(idCandidates)
        ? idCandidates.map(normalizeActivityLookupKey).filter(function (x) { return !!x; })
        : [];
      if (!ids.length || utilityIsEmptyValue(resourcesValue)) return null;
      var used = usedResourceKeys && typeof usedResourceKeys === "object" ? usedResourceKeys : {};
      function resourceKeyFor(entry) {
        if (entry && typeof entry === "object" && !Array.isArray(entry)) {
          return normalizeActivityLookupKey(
            firstNonEmpty([
              entry.material_id,
              entry.materialId,
              entry.id,
              entry.title,
              entry.card_title,
              entry.name,
              entry.prompt,
              entry.text,
              entry.content
            ])
          );
        }
        return normalizeActivityLookupKey(String(entry == null ? "" : entry));
      }
      function matches(entry) {
        if (!entry || typeof entry !== "object" || Array.isArray(entry)) return false;
        var refs = [
          firstNonEmpty([entry.activity_id, entry.activityId, entry.for_activity, entry.parent_activity_id]),
          firstNonEmpty([entry.item_id, entry.itemId, entry.for_item, entry.parent_item_id]),
          firstNonEmpty([entry.material_id, entry.materialId, entry.for_material, entry.parent_material_id]),
          firstNonEmpty([entry.id])
        ].map(normalizeActivityLookupKey).filter(function (x) { return !!x; });
        return refs.some(function (r) { return ids.indexOf(r) !== -1; });
      }
      function dedupe(entries) {
        return (Array.isArray(entries) ? entries : []).filter(function (entry) {
          if (utilityIsEmptyValue(entry)) return false;
          var key = resourceKeyFor(entry);
          if (!key) return true;
          if (used[key]) return false;
          used[key] = true;
          return true;
        });
      }
      if (Array.isArray(resourcesValue)) {
        var arr = dedupe(resourcesValue.filter(matches));
        return arr.length ? arr : null;
      }
      if (resourcesValue && typeof resourcesValue === "object") {
        var direct = [];
        ids.forEach(function (id) {
          if (Object.prototype.hasOwnProperty.call(resourcesValue, id)) {
            var val = resourcesValue[id];
            if (Array.isArray(val)) direct = direct.concat(val);
            else if (!utilityIsEmptyValue(val)) direct.push(val);
          }
        });
        direct = dedupe(direct);
        if (direct.length) return direct;
        var keyLists = ["items", "materials", "cards", "prompts", "resources"];
        for (var i = 0; i < keyLists.length; i += 1) {
          var key = keyLists[i];
          if (!Array.isArray(resourcesValue[key])) continue;
          var matched = dedupe(resourcesValue[key].filter(matches));
          if (matched.length) return matched;
        }
      }
      return null;
    }
    function renderLinkedJourneyBlocks(sequenceRows, linkedIndex, resourcesValue) {
      var rows = Array.isArray(sequenceRows) ? sequenceRows.filter(function (row) { return !utilityIsEmptyValue(row); }) : [];
      if (!rows.length) return { html: "", facilitatorHtml: "" };
      var usedResourceKeys = {};
      var facilitatorNotes = [];
      function linkedEntries(ids) {
        var out = [];
        (Array.isArray(ids) ? ids : []).forEach(function (id) {
          var key = normalizeActivityLookupKey(id);
          if (!key) return;
          var list = linkedIndex[key] || [];
          list.forEach(function (entry) {
            if (entry && typeof entry === "object") out.push(entry);
          });
        });
        return out;
      }
      function firstLinked(ids, keyCandidates) {
        for (var i = 0; i < ids.length; i += 1) {
          var list = linkedIndex[ids[i]] || [];
          for (var j = 0; j < list.length; j += 1) {
            var entry = list[j];
            var val = firstNonEmpty(keyCandidates.map(function (k) { return entry && entry[k]; }));
            if (val) return val;
          }
        }
        return "";
      }
      function firstLinkedFromEntries(entries, keyCandidates) {
        for (var i = 0; i < entries.length; i += 1) {
          var row = entries[i];
          var val = firstNonEmpty((Array.isArray(keyCandidates) ? keyCandidates : []).map(function (k) { return row && row[k]; }));
          if (val) return val;
        }
        return "";
      }
      function renderInstructionList(value) {
        if (utilityIsEmptyValue(value)) return "";
        if (Array.isArray(value)) {
          var items = value
            .map(function (v) {
              if (utilityIsEmptyValue(v)) return "";
              if (typeof v === "string") return "<li>" + utilityRenderMarkdownInline(String(v).replace(/^[-*\d\.\)\s]+/, "").trim()) + "</li>";
              if (typeof v === "object") {
                var txt = firstNonEmpty([v.step, v.instruction, v.text, v.content, v.prompt, v.title]);
                return txt ? ("<li>" + utilityRenderMarkdownInline(String(txt)) + "</li>") : "";
              }
              return "<li>" + utilityRenderMarkdownInline(String(v)) + "</li>";
            })
            .filter(function (x) { return !!x; })
            .slice(0, 8);
          return items.length ? ("<ul>" + items.join("") + "</ul>") : "";
        }
        var text = String(value || "").trim();
        if (!text) return "";
        if (/\n|^[-*]\s+|^\d+[\)\.]\s+/m.test(text)) {
          return utilityRenderMarkdownBlock(text);
        }
        return "<ul><li>" + utilityRenderMarkdownInline(text) + "</li></ul>";
      }
      function renderScenarioBlocks(items) {
        var arr = Array.isArray(items) ? items : [];
        function startsWithScenarioLabel(text) {
          var raw = String(text == null ? "" : text).trim();
          if (!raw) return false;
          return /^(?:#{1,6}\s*)?scenario\s+[a-z0-9]+\s*[:\-]/i.test(raw);
        }
        var blocks = arr
          .map(function (entry, idx) {
            if (utilityIsEmptyValue(entry)) return "";
            if (typeof entry === "string") {
              var raw = String(entry == null ? "" : entry);
              var body = utilityRenderMarkdownBlock(raw);
              if (!body) return "";
              var parentHeading = startsWithScenarioLabel(raw)
                ? ""
                : ('<h4>Scenario ' + (idx + 1) + "</h4>");
              return '<article class="util-task-block util-session-step">' + parentHeading + body + "</article>";
            }
            if (entry && typeof entry === "object") {
              var title = firstNonEmpty([entry.title, entry.name, entry.label, entry.scenario_title]) || ("Scenario " + (idx + 1));
              var bodyRaw = firstNonEmpty([entry.content, entry.text, entry.body, entry.description, entry.prompt]);
              var stages = Array.isArray(entry.stages) ? entry.stages.filter(function (s) { return !utilityIsEmptyValue(s); }) : [];
              var body = "";
              if (stages.length) {
                body = '<div class="util-stage-list">' + stages.map(function (stage, stageIdx) {
                  if (utilityIsEmptyValue(stage)) return "";
                  if (typeof stage === "string") {
                    return '<article class="util-stage-card"><h5>Stage ' + (stageIdx + 1) + "</h5>" + utilityRenderMarkdownBlock(String(stage)) + "</article>";
                  }
                  if (!stage || typeof stage !== "object" || Array.isArray(stage)) return "";
                  var stageTitleRaw = firstNonEmpty([stage.stage, stage.stage_title, stage.title, stage.name, stage.heading, stage.label]);
                  var stageTitle = stageTitleRaw ? formatStageHeading(stageTitleRaw, stageIdx) : ("Stage " + (stageIdx + 1));
                  var stageBodyRaw = firstNonEmpty([stage.content, stage.text, stage.body, stage.description, stage.prompt]);
                  var stageBody = stageBodyRaw ? utilityRenderMarkdownBlock(String(stageBodyRaw)) : utilityRenderObject(stage, 1, renderOpts);
                  if (!stageBody) return "";
                  return '<article class="util-stage-card"><h5>' + utilityEscapeHtml(stageTitle) + "</h5>" + stageBody + "</article>";
                }).filter(function (x) { return !!x; }).join("") + "</div>";
              } else {
                body = bodyRaw ? utilityRenderMarkdownBlock(String(bodyRaw)) : utilityRenderObject(entry, 0, renderOpts);
              }
              if (!body) return "";
              var parentTitle = startsWithScenarioLabel(title) && startsWithScenarioLabel(bodyRaw) ? "" : ("<h4>" + utilityEscapeHtml(title) + "</h4>");
              return '<article class="util-task-block util-session-step">' + parentTitle + body + "</article>";
            }
            return "";
          })
          .filter(function (x) { return !!x; });
        return blocks.join("");
      }
      function renderStrategyBullets(value) {
        if (utilityIsEmptyValue(value)) return "";
        var arr = Array.isArray(value) ? value : [value];
        var items = arr
          .map(function (entry) {
            if (utilityIsEmptyValue(entry)) return "";
            if (typeof entry === "string") return "<li>" + utilityRenderMarkdownInline(String(entry)) + "</li>";
            if (entry && typeof entry === "object") {
              var title = firstNonEmpty([entry.title, entry.name, entry.label, entry.option]);
              var body = firstNonEmpty([entry.description, entry.text, entry.content, entry.rationale, entry.value]);
              if (title && body) return "<li><strong>" + utilityEscapeHtml(String(title)) + ":</strong> " + utilityRenderMarkdownInline(String(body)) + "</li>";
              if (body) return "<li>" + utilityRenderMarkdownInline(String(body)) + "</li>";
              if (title) return "<li>" + utilityEscapeHtml(String(title)) + "</li>";
            }
            return "";
          })
          .filter(function (x) { return !!x; });
        return items.length ? ("<ul>" + items.join("") + "</ul>") : "";
      }
      function renderRichMaterials(materialsValue) {
        if (utilityIsEmptyValue(materialsValue)) return "";
        var chunks = [];
        if (typeof materialsValue === "string") {
          var block = utilityRenderMarkdownBlock(materialsValue);
          return block ? ("<h4>Materials</h4>" + block) : "";
        }
        if (Array.isArray(materialsValue)) {
          var list = renderStrategyBullets(materialsValue);
          return list ? ("<h4>Materials</h4>" + list) : "";
        }
        if (!materialsValue || typeof materialsValue !== "object") return "";
        // Keep linked-journey materials rendering aligned with the primary
        // activity materials path so stage labels/template worksheets stay consistent.
        var activePathMaterials = renderMaterialsForActivity(materialsValue);
        if (String(activePathMaterials || "").trim()) {
          return activePathMaterials;
        }
        var scenarios = firstNonEmpty([
          materialsValue.scenarios,
          materialsValue.study_scenarios,
          materialsValue.scenario_set
        ]);
        if (Array.isArray(scenarios) && scenarios.length) {
          var scHtml = renderScenarioBlocks(scenarios);
          if (scHtml) chunks.push("<h4>Scenarios</h4>" + scHtml);
        }
        var analysisTable = firstNonEmpty([materialsValue.analysis_table, materialsValue.table]);
        if (!utilityIsEmptyValue(analysisTable)) {
          var tableHtml = typeof analysisTable === "string"
            ? utilityRenderMarkdownBlock(String(analysisTable))
            : utilityRenderObject(analysisTable, 0, renderOpts);
          if (tableHtml) chunks.push("<h4>Analysis Table</h4>" + tableHtml);
        }
        var strategies = firstNonEmpty([materialsValue.strategy_options, materialsValue.options, materialsValue.strategies]);
        var stratHtml = renderStrategyBullets(strategies);
        if (stratHtml) chunks.push("<h4>Strategy Options</h4>" + stratHtml);
        var remainderKeys = Object.keys(materialsValue).filter(function (k) {
          return ["scenarios", "study_scenarios", "scenario_set", "analysis_table", "table", "strategy_options", "options", "strategies"].indexOf(String(k || "")) === -1;
        });
        remainderKeys.forEach(function (k) {
          var val = materialsValue[k];
          if (utilityIsEmptyValue(val)) return;
          if (typeof val === "string") {
            var md = utilityRenderMarkdownBlock(String(val));
            if (md) chunks.push("<h4>" + utilityEscapeHtml(utilityLabelFromKey(k)) + "</h4>" + md);
            return;
          }
          if (Array.isArray(val)) {
            var arrHtml = renderStrategyBullets(val) || utilityRenderArray(val, renderOpts);
            if (arrHtml) chunks.push("<h4>" + utilityEscapeHtml(utilityLabelFromKey(k)) + "</h4>" + arrHtml);
            return;
          }
          if (val && typeof val === "object") {
            var objHtml = utilityRenderObject(val, 0, renderOpts);
            if (objHtml) chunks.push("<h4>" + utilityEscapeHtml(utilityLabelFromKey(k)) + "</h4>" + objHtml);
          }
        });
        if (!chunks.length) return "";
        return '<div class="util-materials-stack"><h4>Materials</h4>' + chunks.join("") + "</div>";
      }
      var cards = rows.map(function (row, idx) {
        if (!row || typeof row !== "object" || Array.isArray(row)) return "";
        var ids = [
          firstNonEmpty([row.activity_id, row.activityId]),
          firstNonEmpty([row.item_id, row.itemId]),
          firstNonEmpty([row.material_id, row.materialId]),
          firstNonEmpty([row.id])
        ].map(normalizeActivityLookupKey).filter(function (x) { return !!x; });
        var linkedRows = linkedEntries(ids);
        var linkedTitle = firstLinked(ids, ["title", "activity_title", "name", "label", "material_title"]);
        var title = firstNonEmpty([linkedTitle, row.title, row.activity_title, row.name]) || friendlySessionStepTitle(row.phase_type || row.phase, idx + 1);
        var minute = firstNonEmpty([row.start_minute, row.startMinute, row.time, row.start_time]);
        var duration = firstNonEmpty([row.duration_minutes, row.duration, row.minutes, firstLinked(ids, ["duration_minutes", "duration"])]);
        var purposeRaw = !utilityIsEmptyValue(row.purpose)
          ? row.purpose
          : firstLinkedFromEntries(linkedRows, ["purpose", "activity_purpose", "objective", "aim"]);
        var purpose = "";
        if (typeof purposeRaw === "string" || typeof purposeRaw === "number" || typeof purposeRaw === "boolean") {
          purpose = String(purposeRaw).trim();
        } else if (purposeRaw && typeof purposeRaw === "object" && !Array.isArray(purposeRaw)) {
          purpose = firstNonEmpty([
            purposeRaw.statement,
            purposeRaw.purpose,
            purposeRaw.summary,
            purposeRaw.objective,
            purposeRaw.aim,
            purposeRaw.description,
            purposeRaw.content,
            purposeRaw.text,
            purposeRaw.body
          ]);
        }
        var learnerTask = firstNonEmpty([
          row.learner_actions,
          row.learner_task,
          firstLinked(ids, ["learner_task", "instructions", "instruction", "task", "prompt", "question"]),
          row.task,
          row.instructions
        ]);
        var learnerInstructions = firstNonEmpty([
          row.learner_instructions,
          row.instructions,
          firstLinkedFromEntries(linkedRows, ["learner_instructions", "instructions", "instruction_steps", "steps"])
        ]);
        var materialsInline = firstNonEmpty([
          row.materials,
          firstLinkedFromEntries(linkedRows, ["materials", "activity_materials", "resources", "resource_pack"])
        ]);
        var intro = summarizeOneSentence(learnerTask);
        var expectedOutput = firstNonEmpty([row.expected_output, firstLinked(ids, ["expected_output", "output", "deliverable", "artefact"])]);
        var reflectionPrompt = firstNonEmpty([row.reflection_prompt, firstLinked(ids, ["reflection_prompt"])]);
        var facilitatorTip = firstNonEmpty([
          row.support_note,
          row.support_notes,
          row.facilitator_actions,
          firstLinkedFromEntries(linkedRows, ["support_note", "support_notes", "facilitator_moves", "facilitator_notes", "notes"])
        ]);
        var parts = [];
        if (minute || duration) {
          var timing = [];
          if (minute) timing.push("Time: " + formatMinutesIfBare(minute));
          if (duration) timing.push("Duration: " + String(duration) + (/\bmin\b/i.test(String(duration)) ? "" : " mins"));
          parts.push("<p><strong>" + utilityEscapeHtml(timing.join(" | ")) + "</strong></p>");
        }
        parts.push("<h3>" + utilityEscapeHtml(title) + "</h3>");
        if (purpose) parts.push("<p><strong>Purpose:</strong> " + utilityRenderMarkdownInline(String(purpose)) + "</p>");
        if (intro) parts.push("<p>" + utilityRenderMarkdownInline(intro) + "</p>");
        if (learnerTask && normalizeComparableText(learnerTask) !== normalizeComparableText(intro)) {
          parts.push("<p><strong>Learner task:</strong> " + utilityRenderMarkdownInline(String(learnerTask)) + "</p>");
        }
        var learnerInstructionsHtml = renderInstructionList(learnerInstructions);
        if (learnerInstructionsHtml) parts.push("<h4>Learner Instructions</h4>" + learnerInstructionsHtml);
        var inlineMaterialsHtml = renderRichMaterials(materialsInline);
        if (inlineMaterialsHtml) parts.push(inlineMaterialsHtml);
        var linkedResources = pickLinkedResourcesForIds(resourcesValue, ids, usedResourceKeys);
        if (!utilityIsEmptyValue(linkedResources)) {
          var resHtml = renderActivityResourcesSection(linkedResources);
          if (String(resHtml || "").trim()) parts.push("<h4>Resources</h4>" + resHtml);
        }
        if (expectedOutput) parts.push("<p><strong>Expected output:</strong> " + utilityRenderMarkdownInline(String(expectedOutput)) + "</p>");
        if (reflectionPrompt) parts.push("<p><strong>Reflection prompt:</strong> " + utilityRenderMarkdownInline(String(reflectionPrompt)) + "</p>");
        if (facilitatorTip) facilitatorNotes.push("<li><strong>" + utilityEscapeHtml(title) + ":</strong> " + utilityRenderMarkdownInline(String(facilitatorTip)) + "</li>");
        if (parts.length <= 1) return "";
        return '<article class="util-task-block">' + parts.join("") + "</article>";
      }).filter(function (x) { return !!String(x || "").trim(); });
      return {
        html: cards.join(""),
        facilitatorHtml: facilitatorNotes.length
          ? ("<section><h2>Facilitator Notes</h2><ul>" + facilitatorNotes.join("") + "</ul></section>")
          : ""
      };
    }
    function looksTaskLikeSection(sectionName, sectionValue) {
      if (!Array.isArray(sectionValue) || !sectionValue.length) return false;
      var nameHint = String(sectionName || "").toLowerCase();
      var hasTaskNameHint = /\b(task|tasks|exercise|exercises|prompt|prompts|question|questions|self_check|self-check|reflection)\b/.test(nameHint);
      var nonEmptyRows = sectionValue.filter(function (row) { return !utilityIsEmptyValue(row); });
      if (!nonEmptyRows.length) return false;
      var taskLikeRows = nonEmptyRows.filter(function (row) {
        if (!row || typeof row !== "object" || Array.isArray(row)) return false;
        return !!firstNonEmpty([
          row.learner_task,
          row.instructions,
          row.instruction,
          row.prompt,
          row.question,
          row.stem,
          row.task_id,
          row.taskId,
          row.task_type,
          row.taskType,
          row.type
        ]);
      });
      var mostlyTaskLike = taskLikeRows.length >= Math.max(1, Math.ceil(nonEmptyRows.length * 0.6));
      return hasTaskNameHint || mostlyTaskLike;
    }
    function collectQuestionRowsFromObject(sectionValue) {
      if (!sectionValue || typeof sectionValue !== "object" || Array.isArray(sectionValue)) return null;
      var candidateKeys = ["items", "questions", "tasks", "prompts"];
      for (var i = 0; i < candidateKeys.length; i += 1) {
        var key = candidateKeys[i];
        if (!Array.isArray(sectionValue[key])) continue;
        var rows = sectionValue[key].filter(function (row) { return !utilityIsEmptyValue(row); });
        if (rows.length) return rows;
      }
      return null;
    }
    function isQuestionLikeRow(row) {
      if (!row || typeof row !== "object" || Array.isArray(row)) return false;
      var typeBlob = String(
        firstNonEmpty([
          row.item_type,
          row.type,
          row.task_type,
          row.format
        ]) || ""
      ).toLowerCase();
      var hasPrompt = !!firstNonEmpty([row.stem, row.question, row.prompt, row.learner_task, row.instructions]);
      var hasOptions = Array.isArray(row.options) && row.options.length > 0;
      return (
        /\b(mcq|multiple choice|single_answer_mcq|multiple_answer_mcq|short_answer|essay|true_false|question)\b/.test(typeBlob) ||
        hasPrompt ||
        hasOptions
      );
    }
    function extractRenderableMcqOptions(row) {
      if (!row || typeof row !== "object" || Array.isArray(row)) return [];
      function normalizeOptionsValue(value) {
        if (Array.isArray(value)) return value.slice();
        if (value && typeof value === "object") {
          return Object.keys(value)
            .filter(function (k) { return !utilityIsEmptyValue(value[k]); })
            .map(function (k) {
              var key = String(k || "").trim();
              var v = value[k];
              if (v && typeof v === "object" && !Array.isArray(v)) {
                return Object.assign({ key: key, label: key }, v);
              }
              return { key: key, label: key, text: String(v == null ? "" : v).trim() };
            });
        }
        return [];
      }
      var candidates = [];
      candidates = normalizeOptionsValue(row.options);
      if (!candidates.length) candidates = normalizeOptionsValue(row.choices);
      if (!candidates.length) candidates = normalizeOptionsValue(row.distractors);
      if (!candidates.length && row.response_structure && typeof row.response_structure === "object") {
        candidates = normalizeOptionsValue(row.response_structure.options);
      }
      return candidates.filter(function (opt) {
        return !utilityIsEmptyValue(opt);
      });
    }
    function isMcqLikeType(row) {
      if (!row || typeof row !== "object" || Array.isArray(row)) return false;
      var typeBlob = String(
        firstNonEmpty([
          row.item_type,
          row.type,
          row.task_type,
          row.format
        ]) || ""
      ).toLowerCase();
      return /\bmcq|multiple choice|single_answer_mcq|multiple_answer_mcq\b/.test(typeBlob);
    }
    function renderMcqMissingOptionsWarning(row) {
      if (!isMcqLikeType(row)) return "";
      var itemRef = firstNonEmpty([row.item_id, row.itemId, row.question_id, row.questionId, row.id]) || "unknown";
      try {
        console.warn("[PRISM][RenderWarning] MCQ item missing options", {
          itemRef: itemRef
        });
      } catch (_e) {}
      return "<p><strong>Warning:</strong> MCQ options are missing for this item in the source artefact.</p>";
    }
    function renderMcqOptionsList(optionsValue) {
      var arr = Array.isArray(optionsValue) ? optionsValue : [];
      var items = arr
        .map(function (opt, idx) {
          var letter = String.fromCharCode(65 + Math.max(0, idx));
          if (opt == null) return "";
          if (typeof opt === "string" || typeof opt === "number" || typeof opt === "boolean") {
            var raw = String(opt).trim();
            if (!raw) return "";
            return "<li>" + utilityEscapeHtml(/^[A-Z]\s*[\)\.\-:]\s*/i.test(raw) ? raw : (letter + ". " + raw)) + "</li>";
          }
          if (typeof opt === "object") {
            var label = firstNonEmpty([opt.label, opt.option_label, opt.key]);
            var text = firstNonEmpty([opt.text, opt.option_text, opt.value, opt.content, opt.body]);
            if (!label && !text) return "";
            var optionLabel = label || letter;
            var optionText = text || "";
            var combined = optionText ? (optionLabel + ". " + optionText) : optionLabel;
            return "<li>" + utilityEscapeHtml(combined) + "</li>";
          }
          return "";
        })
        .filter(function (x) { return !!x; });
      if (!items.length) return "";
      return "<ul>" + items.join("") + "</ul>";
    }
    function normalizeFeedbackComparableText(text) {
      var raw = String(text == null ? "" : text);
      if (!raw) return "";
      var cleaned = renderOpts.cleanupInlineMarkdown
        ? utilityCleanupInlineMarkdownMarkers(raw)
        : raw;
      return cleaned
        .toLowerCase()
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201c\u201d]/g, '"')
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
    }
    function areNearDuplicateFeedbackTexts(a, b) {
      var na = normalizeFeedbackComparableText(a);
      var nb = normalizeFeedbackComparableText(b);
      if (!na || !nb) return false;
      if (na === nb) return true;
      if (na.length >= 24 && nb.indexOf(na) !== -1) return true;
      if (nb.length >= 24 && na.indexOf(nb) !== -1) return true;
      return false;
    }
    function renderQuestionBlocks(questionRows, overrides) {
      var rows = Array.isArray(questionRows) ? questionRows.filter(function (row) { return !utilityIsEmptyValue(row); }) : [];
      if (!rows.length) return "";
      var localOpts = overrides && typeof overrides === "object" ? overrides : {};
      var feedbackDisplayModeRaw = String(
        !utilityIsEmptyValue(localOpts.feedbackDisplay) ? localOpts.feedbackDisplay : renderOpts.feedbackDisplay || ""
      ).toLowerCase().trim();
      var feedbackDisplayMode = feedbackDisplayModeRaw;
      if (
        feedbackDisplayModeRaw === "answer_grid_end" ||
        /\banswer\s*grid\b/.test(feedbackDisplayModeRaw)
      ) {
        feedbackDisplayMode = "answer_grid_end";
      } else if (
        feedbackDisplayModeRaw === "answers_explanations" ||
        /\banswers?\b/.test(feedbackDisplayModeRaw) && /\bexplanations?\b/.test(feedbackDisplayModeRaw)
      ) {
        feedbackDisplayMode = "answers_explanations";
      } else if (feedbackDisplayModeRaw === "none" || /\bnone|off\b/.test(feedbackDisplayModeRaw)) {
        feedbackDisplayMode = "none";
      }
      var localPageProfile = !utilityIsEmptyValue(localOpts.pageProfile) ? String(localOpts.pageProfile) : String(renderOpts.pageProfile || "");
      var modeApplies =
        feedbackDisplayMode === "none" ||
        feedbackDisplayMode === "answer_grid_end" ||
        feedbackDisplayMode === "answers_explanations";
      var hideAnswers = modeApplies && feedbackDisplayMode === "none";
      var gridAtEnd = modeApplies && (feedbackDisplayMode === "answer_grid_end" || feedbackDisplayMode === "answers_explanations");
      var includeRationalesInGrid = modeApplies && feedbackDisplayMode === "answers_explanations";
      var answerRows = [];
      var cardsHtml = rows.map(function (row, idx) {
        if (!row || typeof row !== "object" || Array.isArray(row)) {
          var primitiveBody = utilityRenderPrimitive(row, renderOpts);
          if (!String(primitiveBody || "").trim()) return "";
          return '<article class="util-task-block"><h3>' + utilityEscapeHtml("Question " + (idx + 1)) + "</h3>" + primitiveBody + "</article>";
        }
        var promptText = firstNonEmpty([
          row.stem,
          row.question,
          row.prompt,
          row.learner_task,
          row.instructions,
          row.instruction,
          row.text,
          row.content,
          row.body
        ]);
        var parts = [];
        if (promptText) {
          var promptOut = renderOpts.cleanupInlineMarkdown
            ? utilityCleanupInlineMarkdownMarkers(promptText)
            : promptText;
          parts.push("<p>" + utilityRenderMarkdownInline(promptOut) + "</p>");
        }
        var resolvedOptions = extractRenderableMcqOptions(row);
        if (resolvedOptions.length) {
          var resolvedOptionsHtml = renderMcqOptionsList(resolvedOptions);
          if (resolvedOptionsHtml) parts.push(resolvedOptionsHtml);
        } else {
          var missingOptionsWarning = renderMcqMissingOptionsWarning(row);
          if (missingOptionsWarning) parts.push(missingOptionsWarning);
        }
        var answerLabel = firstNonEmpty([
          row.correct_answer,
          row.answer,
          row.model_answer,
          row.true_false_answer
        ]);
        if (answerLabel && !hideAnswers && !gridAtEnd) {
          parts.push("<p><strong>Correct answer:</strong> " + utilityEscapeHtml(String(answerLabel)) + "</p>");
        }
        var multiAnswers = Array.isArray(row.correct_answers)
          ? row.correct_answers.filter(function (x) { return !utilityIsEmptyValue(x); })
          : [];
        if (multiAnswers.length && !hideAnswers && !gridAtEnd) {
          parts.push(
            "<p><strong>Correct answers:</strong> " +
              utilityEscapeHtml(multiAnswers.map(function (x) { return String(x); }).join(", ")) +
              "</p>"
          );
        }
        var explanationOnlyText = firstNonEmpty([
          row.explanation_or_rationale,
          row.answer_or_guidance,
          row.model_answer_guidance,
          row.rationale
        ]);
        var feedbackText = firstNonEmpty([row.feedback, row.feedback_text]);
        var detailText = feedbackText || explanationOnlyText;
        if (
          feedbackText &&
          explanationOnlyText &&
          areNearDuplicateFeedbackTexts(feedbackText, explanationOnlyText)
        ) {
          detailText = feedbackText;
        } else if (feedbackText && explanationOnlyText) {
          // Keep both only when genuinely different.
          detailText = feedbackText + "\n\n" + explanationOnlyText;
        }
        if (detailText && !hideAnswers && !gridAtEnd) {
          var detailLabel =
            feedbackText || localPageProfile.toLowerCase() === "assessment"
              ? "Feedback"
              : "Explanation";
          parts.push(
            "<p><strong>" + detailLabel + ":</strong> " +
              utilityRenderMarkdownInline(
                renderOpts.cleanupInlineMarkdown
                  ? utilityCleanupInlineMarkdownMarkers(detailText)
                  : detailText
              ) +
              "</p>"
          );
        }
        var consumed = {
          item_id: true, itemId: true, question_id: true, questionId: true, id: true,
          title: true, activity_title: true, heading: true, name: true, label: true,
          item_type: true, type: true, task_type: true, format: true,
          stem: true, question: true, prompt: true, learner_task: true, instructions: true,
          instruction: true, text: true, content: true, body: true, task: true, options: true,
          correct_answer: true, correct_answers: true, answer: true, answer_key: true,
          answer_or_guidance: true, model_answer: true, model_answer_guidance: true, true_false_answer: true,
          explanation_or_rationale: true, rationale: true, feedback: true, feedback_text: true
        };
        var extra = {};
        Object.keys(row).forEach(function (k) {
          if (consumed[k]) return;
          if (utilityIsEmptyValue(row[k])) return;
          extra[k] = row[k];
        });
        var extraHtml = utilityRenderObject(extra, 0, renderOpts);
        if (!String(parts.join("") || "").trim() && !String(extraHtml || "").trim()) return "";
        if (modeApplies) {
          var qTitle = "Question " + (idx + 1);
          var qPrompt = promptText ? String(promptText) : qTitle;
          var ansText = answerLabel
            ? String(answerLabel)
            : (multiAnswers.length ? multiAnswers.map(function (x) { return String(x); }).join(", ") : "");
          answerRows.push({
            question: qPrompt,
            answer: ansText,
            rationale: detailText ? String(detailText) : ""
          });
        }
        return '<article class="util-task-block"><h3>' + utilityEscapeHtml("Question " + (idx + 1)) + "</h3>" + parts.join("") + extraHtml + "</article>";
      }).filter(function (x) { return !!String(x || "").trim(); }).join("");
      if (gridAtEnd && (answerRows.length || feedbackDisplayMode === "answer_grid_end")) {
        if (feedbackDisplayMode === "answer_grid_end") {
          var placeholderCount = rows.length;
          var placeholderRows = [];
          for (var pi = 1; pi <= placeholderCount; pi += 1) {
            placeholderRows.push("<p>Q" + utilityEscapeHtml(String(pi)) + " ___</p>");
          }
          if (!placeholderRows.length) return cardsHtml;
          cardsHtml += '<section><h3>Answer Grid</h3>' + placeholderRows.join("") + "</section>";
        } else {
          var headCells = ["Question", "Answer"];
          if (includeRationalesInGrid) headCells.push("Explanation");
          var headHtml = "<tr>" + headCells.map(function (h) {
            return "<th>" + utilityEscapeHtml(h) + "</th>";
          }).join("") + "</tr>";
          var bodyHtml = answerRows.map(function (row) {
            return "<tr>" +
              "<td>" + utilityRenderMarkdownInline(String(row.question || "")) + "</td>" +
              "<td>" + utilityRenderMarkdownInline(String(row.answer || "")) + "</td>" +
              (includeRationalesInGrid ? ("<td>" + utilityRenderMarkdownInline(String(row.rationale || "")) + "</td>") : "") +
              "</tr>";
          }).join("");
          cardsHtml += '<section><h3>Answer Key</h3><table><thead>' + headHtml + "</thead><tbody>" + bodyHtml + "</tbody></table></section>";
        }
      }
      return cardsHtml;
    }
    function resolveSectionFeedbackDisplay(sectionValue) {
      if (!sectionValue || typeof sectionValue !== "object" || Array.isArray(sectionValue)) return "";
      return firstNonEmpty([
        sectionValue.feedback_display,
        sectionValue.feedbackDisplay,
        sectionValue.metadata && sectionValue.metadata.feedback_display,
        sectionValue.blueprint && sectionValue.blueprint.feedback_display,
        sectionValue.assessment_blueprint && sectionValue.assessment_blueprint.feedback_display
      ]) || "";
    }
    function renderTaskBlocks(taskRows) {
      var rows = Array.isArray(taskRows) ? taskRows.filter(function (row) { return !utilityIsEmptyValue(row); }) : [];
      if (!rows.length) return "";
      function normalizeOptionText(option, index) {
        if (option == null) return "";
        var letter = String.fromCharCode(65 + Math.max(0, index));
        if (typeof option === "string" || typeof option === "number" || typeof option === "boolean") {
          var raw = String(option).trim();
          if (!raw) return "";
          return /^[A-D]\s*[\)\.\-:]\s*/i.test(raw) ? raw : (letter + ". " + raw);
        }
        if (typeof option === "object") {
          var label = firstNonEmpty([
            option.label,
            option.option_label,
            option.key
          ]);
          var text = firstNonEmpty([
            option.text,
            option.option_text,
            option.value,
            option.content,
            option.body
          ]);
          if (!label && !text) return "";
          var optionLabel = label || letter;
          var optionText = text || "";
          return optionText ? (optionLabel + ". " + optionText) : optionLabel;
        }
        return "";
      }
      function renderMcqOptionsList(optionsValue) {
        var arr = Array.isArray(optionsValue) ? optionsValue : [];
        var items = arr
          .map(function (opt, idx) {
            var text = normalizeOptionText(opt, idx);
            return text ? ("<li>" + utilityEscapeHtml(text) + "</li>") : "";
          })
          .filter(function (x) { return !!x; });
        if (!items.length) return "";
        return "<ul>" + items.join("") + "</ul>";
      }
      function isMcqLikeRow(row) {
        if (!row || typeof row !== "object" || Array.isArray(row)) return false;
        var typeBlob = String(
          firstNonEmpty([
            row.item_type,
            row.type,
            row.task_type,
            row.format
          ]) || ""
        ).toLowerCase();
        var hasOptions = extractRenderableMcqOptions(row).length > 0;
        var hasStem = !!firstNonEmpty([row.stem, row.question, row.prompt]);
        return /\bmcq|multiple choice|single_answer_mcq|multiple_answer_mcq\b/.test(typeBlob) || (hasOptions && hasStem);
      }
      return rows.map(function (row, idx) {
        var defaultTitle = "Task " + (idx + 1);
        var defaultQuestionTitle = "Question " + (idx + 1);
        if (!row || typeof row !== "object" || Array.isArray(row)) {
          var simpleBody = utilityRenderPrimitive(row, renderOpts);
          if (!String(simpleBody || "").trim()) return "";
          return '<article class="util-task-block"><h3>' + utilityEscapeHtml(defaultTitle) + "</h3>" + simpleBody + "</article>";
        }
        var rowTypeBlob = String(
          firstNonEmpty([row.item_type, row.type, row.task_type, row.taskType, row.format]) || ""
        ).toLowerCase();
        var reflectionPrompt = firstNonEmpty([
          row.learner_task,
          row.prompt,
          row.question,
          row.stem,
          row.instructions,
          row.instruction,
          row.content,
          row.body,
          row.text,
          row.task
        ]);
        var reflectionLabel = firstNonEmpty([row.task, row.title, row.task_title, row.label, row.name]);
        var isScaffoldLabel = /^\s*(task|question)\s*\d*\s*$/i.test(String(reflectionLabel || "").trim());
        var reflectionLike =
          !!reflectionPrompt &&
          (
            /\breflection|self[_ -]?check\b/.test(rowTypeBlob) ||
            isScaffoldLabel
          ) &&
          !(Array.isArray(row.options) && row.options.length);
        if (reflectionLike) {
          var reflectionBody = utilityRenderPrimitive(reflectionPrompt, renderOpts);
          if (!String(reflectionBody || "").trim()) return "";
          return (
            '<article class="util-task-block"><h3>' +
            utilityEscapeHtml("Reflection Task " + (idx + 1)) +
            "</h3>" +
            reflectionBody +
            "</article>"
          );
        }
        if (isQuestionLikeRow(row)) {
          var preferredTitle = firstNonEmpty([row.title, row.name, row.activity_title, row.label]);
          var usePreferredTitle = !!preferredTitle && !/^\s*(question|task)\s*\d*\s*$/i.test(String(preferredTitle || ""));
          var headingText = usePreferredTitle ? String(preferredTitle) : ("Question " + (idx + 1));
          return renderQuestionBlocks([row]).replace(
            /^<article class="util-task-block"><h3>Question 1<\/h3>/,
            '<article class="util-task-block"><h3>' + utilityEscapeHtml(headingText) + "</h3>"
          );
        }
        if (isMcqLikeRow(row)) {
          var questionText = firstNonEmpty([row.stem, row.question, row.prompt, row.text, row.content, row.body]);
          var resolvedMcqOptions = extractRenderableMcqOptions(row);
          var optionsHtml = renderMcqOptionsList(resolvedMcqOptions);
          var bodyParts = [];
          if (questionText) {
            var questionOut = renderOpts.cleanupInlineMarkdown
              ? utilityCleanupInlineMarkdownMarkers(questionText)
              : questionText;
            bodyParts.push("<p>" + utilityRenderMarkdownInline(questionOut) + "</p>");
          }
          if (optionsHtml) bodyParts.push(optionsHtml);
          if (!optionsHtml) {
            var rowWarning = renderMcqMissingOptionsWarning(row);
            if (rowWarning) bodyParts.push(rowWarning);
          }
          var mcqBody = bodyParts.join("");
          if (!mcqBody) return "";
          return '<article class="util-task-block"><h3>' + utilityEscapeHtml(defaultQuestionTitle) + "</h3>" + mcqBody + "</article>";
        }
        var headingBase = firstNonEmpty([row.title, row.activity_title, row.heading, row.task_title, row.name, row.label]) || defaultTitle;
        var typeValue = firstNonEmpty([row.type, row.task_type, row.taskType, row.kind, row.response_type]);
        var heading = headingBase;
        if (typeValue) heading += " \u2014 " + utilityLabelFromKey(typeValue);
        var scalarBits = [];
        var scalarTime = firstNonEmpty([row.timing, row.time, row.duration_minutes, row.duration, row.minutes]);
        if (scalarTime) scalarBits.push("<p><strong>Time:</strong> " + utilityRenderMarkdownInline(formatMinutesIfBare(scalarTime)) + "</p>");
        var scalarPurpose = "";
        if (!utilityIsEmptyValue(row.purpose)) {
          if (typeof row.purpose === "string" || typeof row.purpose === "number" || typeof row.purpose === "boolean") {
            scalarPurpose = String(row.purpose).trim();
          } else if (row.purpose && typeof row.purpose === "object" && !Array.isArray(row.purpose)) {
            scalarPurpose = firstNonEmpty([
              row.purpose.statement,
              row.purpose.purpose,
              row.purpose.summary,
              row.purpose.objective,
              row.purpose.aim,
              row.purpose.description,
              row.purpose.content,
              row.purpose.text,
              row.purpose.body
            ]);
          }
        }
        if (scalarPurpose) scalarBits.push("<p><strong>Purpose:</strong> " + utilityRenderMarkdownInline(String(scalarPurpose)) + "</p>");

        var bodyValue = firstNonEmpty([
          row.learner_task,
          row.instructions,
          row.instruction,
          row.prompt,
          row.question,
          row.stem,
          row.content,
          row.body,
          row.text,
          row.task
        ]);
        var bodyHtml = utilityRenderPrimitive(bodyValue, renderOpts);
        var scalarOutput = firstNonEmpty([row.expected_output, row.output, row.deliverable, row.artefact]);
        if (scalarOutput) scalarBits.push("<p><strong>What you will produce:</strong> " + utilityRenderMarkdownInline(String(scalarOutput)) + "</p>");
        var scalarSupport = firstNonEmpty([row.support_note, row.support_notes]);
        if (scalarSupport) scalarBits.push('<p class="util-support-note"><strong>Support note:</strong> ' + utilityRenderMarkdownInline(String(scalarSupport)) + "</p>");
        var consumed = {
          title: true,
          activity_title: true,
          heading: true,
          task_title: true,
          name: true,
          label: true,
          type: true,
          task_type: true,
          taskType: true,
          kind: true,
          response_type: true,
          timing: true,
          time: true,
          duration_minutes: true,
          duration: true,
          minutes: true,
          purpose: true,
          expected_output: true,
          output: true,
          deliverable: true,
          artefact: true,
          support_note: true,
          support_notes: true,
          learner_task: true,
          instructions: true,
          instruction: true,
          prompt: true,
          question: true,
          stem: true,
          content: true,
          body: true,
          text: true,
          task: true,
          item_id: true,
          itemId: true,
          question_id: true,
          questionId: true,
          item_type: true,
          correct_answer: true,
          correct_answers: true,
          answer: true,
          answer_key: true,
          answer_or_guidance: true,
          model_answer: true,
          model_answer_guidance: true,
          true_false_answer: true,
          task_id: true,
          taskId: true,
          id: true
        };
        var extra = {};
        Object.keys(row).forEach(function (k) {
          if (consumed[k]) return;
          if (utilityIsEmptyValue(row[k])) return;
          extra[k] = row[k];
        });
        var extraHtml = utilityRenderObject(extra, 0, renderOpts);
        if (!String(bodyHtml || "").trim()) bodyHtml = "";
        var scalarHtml = scalarBits.join("");
        if (!bodyHtml && !extraHtml && !scalarHtml) return "";
        return '<article class="util-task-block"><h3>' + utilityEscapeHtml(heading) + "</h3>" + scalarHtml + bodyHtml + extraHtml + "</article>";
      }).filter(function (x) { return !!String(x || "").trim(); }).join("");
    }

    // Object form: { overview: "...", intro: "...", ... }
    if (sectionsValue && typeof sectionsValue === "object" && !Array.isArray(sectionsValue)) {
      var keys = [];
      orderedKeys.forEach(function (key) {
        if (Object.prototype.hasOwnProperty.call(sectionsValue, key)) keys.push(key);
      });
      Object.keys(sectionsValue).forEach(function (key) {
        if (keys.indexOf(key) === -1) keys.push(key);
      });
      var activityIdx = -1;
      var resourcesIdx = -1;
      var learningActivitiesValue = null;
      var learningSequenceValue = null;
      var resourcesValue = null;
      keys.forEach(function (key, idx) {
        if (activityIdx === -1 && looksLearningActivitiesSection(key)) activityIdx = idx;
        if (resourcesIdx === -1 && looksActivityResourcesSection(key)) resourcesIdx = idx;
        if (!learningActivitiesValue && looksLearningActivitiesSection(key)) learningActivitiesValue = sectionsValue[key];
        if (!learningSequenceValue && looksLearningSequenceSection(key)) learningSequenceValue = sectionsValue[key];
        if (!resourcesValue && looksActivityResourcesSection(key)) resourcesValue = sectionsValue[key];
      });
      var activityLookup = buildLearningActivityLookup(learningActivitiesValue);
      var linkedIndex = buildLinkedItemIndexFromSectionsObject(sectionsValue, null);
      var activityFlowState = { rendered: false };
      if (activityIdx !== -1 && resourcesIdx !== -1 && activityIdx > resourcesIdx) {
        var activityKey = keys.splice(activityIdx, 1)[0];
        keys.splice(resourcesIdx, 0, activityKey);
      }
      var facilitatorAppendix = [];
      var renderedSections = keys.map(function (sectionName) {
        var sectionValue = sectionsValue[sectionName];
        if (utilityIsEmptyValue(sectionValue)) return "";
        var sectionHeading = labelsMap[sectionName] || utilityLabelFromKey(sectionName);
        if (looksLearningActivitiesSection(sectionName)) {
          if (activityFlowState.rendered) return "";
          var activityRows = Array.isArray(sectionValue)
            ? sectionValue
            : (sectionValue && Array.isArray(sectionValue.items) ? sectionValue.items : []);
          var activitiesHtml = renderLearningActivitiesBlocks(activityRows);
          if (!String(activitiesHtml || "").trim()) return "";
          return "<section>" + renderSectionHeadingH2(activitySectionHeadingForCount(activityRows.length || 0), "learning_activities") + activitiesHtml + "</section>";
        }
        if (looksLearningSequenceSection(sectionName)) {
          var sequenceRows = Array.isArray(sectionValue)
            ? sectionValue
            : (sectionValue && Array.isArray(sectionValue.timeline) ? sectionValue.timeline : []);
          var flow = renderLinkedJourneyBlocks(sequenceRows, linkedIndex, resourcesValue);
          if (String(flow.html || "").trim()) {
            activityFlowState.rendered = true;
            if (flow.facilitatorHtml) facilitatorAppendix.push(flow.facilitatorHtml);
            return "<section>" + renderSectionHeadingH2(activitySectionHeadingForCount(sequenceRows.length || 0), "learning_activities") + flow.html + "</section>";
          }
          var renderedSequence = renderLearningSequenceBlocks(sequenceRows, activityLookup);
          if (renderedSequence.facilitatorHtml) facilitatorAppendix.push(renderedSequence.facilitatorHtml);
          if (!String(renderedSequence.timelineHtml || "").trim()) return "";
          return "<section>" + renderSectionHeadingH2(activitySectionHeadingForCount(sequenceRows.length || 0), "learning_activities") + renderedSequence.timelineHtml + "</section>";
        }
        if (looksLearningPurposeOrOutcomesSection(sectionName)) {
          var lpoHtml = renderLearningPurposeOutcomes(sectionValue);
          if (String(lpoHtml || "").trim()) {
            return "<section>" + renderSectionHeadingH2(sectionHeading, sectionName) + lpoHtml + "</section>";
          }
        }
        if (looksAssessmentItemsSection(sectionName)) {
          function resolveAssessmentRowsFromToken(rawValue) {
            if (!rawValue) return [];
            if (Array.isArray(rawValue)) return rawValue;
            if (rawValue && typeof rawValue === "object") return collectQuestionRowsFromObject(rawValue) || [];
            return [];
          }
          var assessmentRows = Array.isArray(sectionValue)
            ? sectionValue
            : collectQuestionRowsFromObject(sectionValue);
          if ((!assessmentRows || !assessmentRows.length) && typeof sectionValue === "string" && String(sectionValue).trim().toLowerCase() === "assessment_check" && sectionsValue && typeof sectionsValue === "object" && !Array.isArray(sectionsValue)) {
            assessmentRows = resolveAssessmentRowsFromToken(sectionsValue.assessment_check);
            if ((!assessmentRows || !assessmentRows.length) && sectionsValue.sections && typeof sectionsValue.sections === "object") {
              assessmentRows = resolveAssessmentRowsFromToken(sectionsValue.sections.assessment_check);
            }
          }
          var sectionFeedbackDisplay = "";
          if (sectionValue && typeof sectionValue === "object" && !Array.isArray(sectionValue)) {
            sectionFeedbackDisplay = firstNonEmpty([
              sectionValue.feedback_display,
              sectionValue.feedbackDisplay,
              sectionValue.metadata && sectionValue.metadata.feedback_display,
              sectionValue.blueprint && sectionValue.blueprint.feedback_display,
              sectionValue.assessment_blueprint && sectionValue.assessment_blueprint.feedback_display
            ]);
          }
          var assessmentHtml = renderQuestionBlocks(assessmentRows || [], {
            feedbackDisplay: sectionFeedbackDisplay || renderOpts.feedbackDisplay
          });
          if (!String(assessmentHtml || "").trim()) {
            if (typeof sectionValue === "string" && String(sectionValue).trim().toLowerCase() === "assessment_check") return "";
            return "<section>" + renderSectionHeadingH2("Formative Assessment Check", "assessment_check") + "<p>Self-check questions will appear here.</p></section>";
          }
          return "<section>" + renderSectionHeadingH2("Formative Assessment Check", "assessment_check") + assessmentHtml + "</section>";
        }
        if (looksKnowledgeSummarySection(sectionName)) {
          var ksHtml = renderKnowledgeSummaryBlocks(sectionValue);
          if (String(ksHtml || "").trim()) {
            return "<section>" + renderSectionHeadingH2(sectionHeading, sectionName) + ksHtml + "</section>";
          }
        }
        if (looksActivityResourcesSection(sectionName)) {
          if (activityFlowState.rendered) return "";
          var resourcesHtml = renderActivityResourcesSection(sectionValue);
          if (!String(resourcesHtml || "").trim()) return "";
          return "<section>" + renderSectionHeadingH2(sectionHeading, sectionName) + resourcesHtml + "</section>";
        }
        var nestedQuestionRows = collectQuestionRowsFromObject(sectionValue);
        var nestedFeedbackDisplay = resolveSectionFeedbackDisplay(sectionValue);
        var sectionBody = Array.isArray(sectionValue)
          ? (looksTaskLikeSection(sectionName, sectionValue)
              ? (sectionValue.some(function (r) { return isQuestionLikeRow(r); })
                  ? renderQuestionBlocks(sectionValue, { feedbackDisplay: nestedFeedbackDisplay || renderOpts.feedbackDisplay })
                  : renderTaskBlocks(sectionValue))
              : utilityRenderArray(sectionValue, renderOpts))
          : nestedQuestionRows
          ? renderQuestionBlocks(nestedQuestionRows, { feedbackDisplay: nestedFeedbackDisplay || renderOpts.feedbackDisplay })
          : sectionValue && typeof sectionValue === "object"
          ? utilityRenderObject(sectionValue, 0, renderOpts)
          : utilityRenderPrimitive(sectionValue, renderOpts);
        if (!String(sectionBody || "").trim()) return "";
        return "<section>" + renderSectionHeadingH2(sectionHeading, sectionName) + sectionBody + "</section>";
      }).filter(function (x) { return !!String(x || "").trim(); });
      return renderedSections.join("") + facilitatorAppendix.join("");
    }

    // Array form: [{ title, content }, ...]
    if (Array.isArray(sectionsValue)) {
      var arrayLearningActivitiesValue = null;
      var arrayResourcesValue = null;
      sectionsValue.forEach(function (item, idx) {
        if (!item || typeof item !== "object" || Array.isArray(item)) return;
        var orderedKeyProbe = orderedKeys[idx] || "";
        var headingProbe = firstNonEmpty([
          item.title,
          item.heading,
          item.name,
          item.section_title,
          item.section_heading,
          item.label,
          item.section
        ]);
        if (!arrayLearningActivitiesValue && (looksLearningActivitiesSection(headingProbe) || looksLearningActivitiesSection(orderedKeyProbe))) {
          var probeContent =
            item.content != null ? item.content :
            item.body != null ? item.body :
            item.text != null ? item.text :
            "";
          arrayLearningActivitiesValue = probeContent;
        }
        if (!arrayResourcesValue && (looksActivityResourcesSection(headingProbe) || looksActivityResourcesSection(orderedKeyProbe))) {
          var probeResources =
            item.content != null ? item.content :
            item.body != null ? item.body :
            item.text != null ? item.text :
            "";
          arrayResourcesValue = probeResources;
        }
      });
      var arrayActivityLookup = buildLearningActivityLookup(arrayLearningActivitiesValue);
      var arraySectionsObj = {};
      sectionsValue.forEach(function (item, idx) {
        var orderedKeyProbe = orderedKeys[idx] || ("section_" + String(idx + 1));
        if (item && typeof item === "object" && !Array.isArray(item)) {
          var headingProbe = firstNonEmpty([
            item.title, item.heading, item.name, item.section_title, item.section_heading, item.label, item.section
          ]);
          var key = normalizeActivityLookupKey(headingProbe) || orderedKeyProbe;
          var content =
            item.content != null ? item.content :
            item.body != null ? item.body :
            item.text != null ? item.text :
            item;
          arraySectionsObj[key] = content;
        } else {
          arraySectionsObj[orderedKeyProbe] = item;
        }
      });
      var arrayLinkedIndex = buildLinkedItemIndexFromSectionsObject(arraySectionsObj, null);
      var arrayFlowState = { rendered: false };
      var renderedArraySections = sectionsValue.map(function (item, idx) {
        if (utilityIsEmptyValue(item)) return "";
        if (!item || typeof item !== "object") {
          var fallbackBody = utilityRenderPrimitive(item, renderOpts);
          if (!String(fallbackBody || "").trim()) return "";
          var orderedKeyForIndex = orderedKeys[idx] || "";
          var fallbackHeading =
            labelsMap[orderedKeyForIndex] ||
            utilityLabelFromKey(orderedKeyForIndex) ||
            ("Section " + (idx + 1));
          return "<section>" + renderSectionHeadingH2(fallbackHeading, orderedKeyForIndex) + fallbackBody + "</section>";
        }
        var headingValue = firstNonEmpty([
          item.title,
          item.heading,
          item.name,
          item.section_title,
          item.section_heading,
          item.label,
          item.section
        ]);
        var contentValue =
          item.content != null ? item.content :
          item.body != null ? item.body :
          item.text != null ? item.text :
          "";
        if (utilityIsEmptyValue(contentValue)) {
          var contentKeys = Object.keys(item).filter(function (k) {
            return [
              "title",
              "heading",
              "name",
              "section_title",
              "section_heading",
              "label",
              "section",
              "content",
              "body",
              "text"
            ].indexOf(String(k || "")) === -1 && !utilityIsEmptyValue(item[k]);
          });
          if (contentKeys.length === 1) {
            if (!headingValue) headingValue = utilityLabelFromKey(contentKeys[0]);
            contentValue = item[contentKeys[0]];
          } else if (!contentKeys.length) {
            contentValue = item;
          }
        }
        var orderedKey = orderedKeys[idx] || "";
        var sectionHeading =
          String(headingValue || "").trim() ||
          labelsMap[orderedKey] ||
          utilityLabelFromKey(orderedKey) ||
          ("Section " + (idx + 1));
        if (looksLearningActivitiesSection(sectionHeading) || looksLearningActivitiesSection(orderedKey)) {
          if (arrayFlowState.rendered) return "";
          var arrActivityRows = Array.isArray(contentValue)
            ? contentValue
            : (contentValue && Array.isArray(contentValue.items) ? contentValue.items : []);
          var arrActivitiesHtml = renderLearningActivitiesBlocks(arrActivityRows);
          if (!String(arrActivitiesHtml || "").trim()) return "";
          return {
            kind: "activities",
            html: "<section>" + renderSectionHeadingH2(activitySectionHeadingForCount(arrActivityRows.length || 0), "learning_activities") + arrActivitiesHtml + "</section>"
          };
        }
        if (looksLearningSequenceSection(sectionHeading) || looksLearningSequenceSection(orderedKey)) {
          var arrSeqRows = Array.isArray(contentValue)
            ? contentValue
            : (contentValue && Array.isArray(contentValue.timeline) ? contentValue.timeline : []);
          var arrFlow = renderLinkedJourneyBlocks(arrSeqRows, arrayLinkedIndex, arrayResourcesValue);
          if (String(arrFlow.html || "").trim()) {
            arrayFlowState.rendered = true;
            var arrFlowSection = "<section>" + renderSectionHeadingH2(activitySectionHeadingForCount(arrSeqRows.length || 0), "learning_activities") + arrFlow.html + "</section>";
            if (arrFlow.facilitatorHtml) arrFlowSection += arrFlow.facilitatorHtml;
            return { kind: "other", html: arrFlowSection };
          }
          var arrRenderedSequence = renderLearningSequenceBlocks(arrSeqRows, arrayActivityLookup);
          if (!String(arrRenderedSequence.timelineHtml || "").trim()) return "";
          var arrSequenceSection = "<section>" + renderSectionHeadingH2(activitySectionHeadingForCount(arrSeqRows.length || 0), "learning_activities") + arrRenderedSequence.timelineHtml + "</section>";
          if (arrRenderedSequence.facilitatorHtml) {
            arrSequenceSection += arrRenderedSequence.facilitatorHtml;
          }
          return { kind: "other", html: arrSequenceSection };
        }
        if (looksLearningPurposeOrOutcomesSection(sectionHeading) || looksLearningPurposeOrOutcomesSection(orderedKey)) {
          var arrLpoHtml = renderLearningPurposeOutcomes(contentValue);
          if (String(arrLpoHtml || "").trim()) {
            return { kind: "other", html: "<section>" + renderSectionHeadingH2(sectionHeading, orderedKey) + arrLpoHtml + "</section>" };
          }
        }
        if (looksAssessmentItemsSection(sectionHeading) || looksAssessmentItemsSection(orderedKey)) {
          var arrAssessmentRows = Array.isArray(contentValue)
            ? contentValue
            : collectQuestionRowsFromObject(contentValue);
          var arrAssessmentFeedbackDisplay = resolveSectionFeedbackDisplay(contentValue);
          var arrAssessmentHtml = renderQuestionBlocks(arrAssessmentRows || [], {
            feedbackDisplay: arrAssessmentFeedbackDisplay || renderOpts.feedbackDisplay
          });
          if (!String(arrAssessmentHtml || "").trim()) return "";
          return { kind: "other", html: "<section>" + renderSectionHeadingH2("Formative Assessment Check", "assessment_check") + arrAssessmentHtml + "</section>" };
        }
        if (looksKnowledgeSummarySection(sectionHeading) || looksKnowledgeSummarySection(orderedKey)) {
          var arrKsHtml = renderKnowledgeSummaryBlocks(contentValue);
          if (String(arrKsHtml || "").trim()) {
            return { kind: "other", html: "<section>" + renderSectionHeadingH2(sectionHeading, orderedKey) + arrKsHtml + "</section>" };
          }
        }
        if (looksActivityResourcesSection(sectionHeading) || looksActivityResourcesSection(orderedKey)) {
          if (arrayFlowState.rendered) return "";
          var arrResourcesHtml = renderActivityResourcesSection(contentValue);
          if (!String(arrResourcesHtml || "").trim()) return "";
          return {
            kind: "resources",
            html: "<section>" + renderSectionHeadingH2(sectionHeading, orderedKey) + arrResourcesHtml + "</section>"
          };
        }
        var sectionKind = looksActivityResourcesSection(sectionHeading) || looksActivityResourcesSection(orderedKey)
          ? "resources"
          : "other";
        var sectionBody = Array.isArray(contentValue)
          ? (looksTaskLikeSection(sectionHeading, contentValue)
              ? renderTaskBlocks(contentValue)
              : utilityRenderArray(contentValue, renderOpts))
          : contentValue && typeof contentValue === "object"
          ? utilityRenderObject(contentValue, 0, renderOpts)
          : utilityRenderPrimitive(contentValue, renderOpts);
        if (!String(sectionBody || "").trim()) return "";
        return {
          kind: sectionKind,
          html: "<section>" + renderSectionHeadingH2(sectionHeading, orderedKey) + sectionBody + "</section>"
        };
      }).filter(function (x) {
        return x && !!String(x.html || "").trim();
      });
      var arrActivitiesIdx = -1;
      var arrResourcesIdx = -1;
      renderedArraySections.forEach(function (entry, idx) {
        if (arrActivitiesIdx === -1 && entry.kind === "activities") arrActivitiesIdx = idx;
        if (arrResourcesIdx === -1 && entry.kind === "resources") arrResourcesIdx = idx;
      });
      if (arrActivitiesIdx !== -1 && arrResourcesIdx !== -1 && arrActivitiesIdx > arrResourcesIdx) {
        var arrActivityEntry = renderedArraySections.splice(arrActivitiesIdx, 1)[0];
        renderedArraySections.splice(arrResourcesIdx, 0, arrActivityEntry);
      }
      return renderedArraySections.map(function (entry) { return entry.html; }).join("");
    }

    return "";
  }

  function buildUtilityLearningObjectHtml(title, audience, sectionHtmlBlocks, metadataHtmlBlocks) {
    var sections = Array.isArray(sectionHtmlBlocks) ? sectionHtmlBlocks.filter(function (x) { return !!String(x || "").trim(); }) : [];
    if (!sections.length) {
      return { error: "No renderable sections found for learning object mode." };
    }
    var metadata = Array.isArray(metadataHtmlBlocks) ? metadataHtmlBlocks.filter(function (x) { return !!String(x || "").trim(); }) : [];
    var navLinks = sections.map(function (_s, idx) {
      return '<a href="#" data-lo-index="' + idx + '">' + (idx + 1) + "</a>";
    }).join(" ");
    var screensHtml = sections.map(function (sectionHtml, idx) {
      var active = idx === 0 ? " active" : "";
      return '<section class="lo-screen' + active + '" data-lo-screen="' + idx + '">' + sectionHtml + "</section>";
    }).join("");
    var metadataHtml = metadata.length
      ? (
          '<details class="util-meta lo-meta"><summary>Production Metadata</summary>' +
            metadata.join("") +
          "</details>"
        )
      : "";
    var htmlDoc = [
      "<!doctype html>",
      "<html lang=\"en\">",
      "<head>",
      "<meta charset=\"utf-8\" />",
      "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />",
      "<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css\" crossorigin=\"anonymous\" referrerpolicy=\"no-referrer\" />",
      "<title>" + utilityEscapeHtml(title) + "</title>",
      "<style>body{font-family:Segoe UI,Arial,sans-serif;margin:24px auto;padding:0 8px;max-width:980px;color:#111827;line-height:1.65}h1{margin:0 0 10px;font-size:1.9rem;line-height:1.25}h2{margin:0 0 10px;font-size:1.2rem;line-height:1.35}h3{margin:18px 0 8px;font-size:1rem}h4{margin:12px 0 8px;font-size:.95rem;color:#374151}p{margin:0 0 12px}ul{margin:0 0 14px 20px;padding:0}li{margin:0 0 6px}section{margin:0 0 16px}table{width:100%;border-collapse:collapse;margin:10px 0 16px}th,td{border:1px solid #d1d5db;padding:8px;text-align:left;vertical-align:top}th{background:#f3f4f6;font-weight:600}tbody tr{min-height:2.2rem}.util-task-block{border:1px solid #dbe4f0;border-radius:12px;padding:16px;margin:14px 0;background:#fff;box-shadow:0 2px 6px rgba(17,24,39,.04)}.util-task-block p strong{line-height:1.4}.util-activity-header{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap;margin-bottom:6px}.util-activity-header h3{margin:0}.util-activity-task{margin:0 0 12px}.util-badge-row{display:flex;gap:6px;flex-wrap:wrap}.util-badge{display:inline-block;border:1px solid #dbe4f0;background:#f8fafc;color:#374151;border-radius:999px;padding:2px 10px;font-size:.78rem;font-weight:600}.util-badge-time{background:#eff6ff;border-color:#bfdbfe;color:#1d4ed8}.util-badge-group{background:#f0fdf4;border-color:#bbf7d0;color:#166534}.util-section-icon{font-size:.9em;color:#64748b;margin-right:.45rem}.util-line-label{margin:0 0 6px;color:#334155}.util-card-subheading{margin:8px 0 6px;font-size:.95rem;color:#374151;font-weight:600}.util-session-step{border-style:dashed;background:#f9fafb}.util-slide{border:1px solid #e5e7eb;border-radius:8px;padding:12px;margin:10px 0}.util-scenario-list{margin:8px 0 14px;padding-left:0}.util-scenario-inline{margin:0 0 12px;padding:14px 16px;border:1px solid #e5e7eb;border-radius:8px;background:#fafafa}.util-scenario-inline:last-child{margin-bottom:0}.util-scenario-inline h3,.util-scenario-inline h4{margin:0 0 8px;font-size:1rem}.util-scenario-title{margin:0 0 8px;font-size:1rem;line-height:1.35;color:#374151;font-weight:600}.util-stage-list{display:grid;gap:10px}.util-stage-card{border-left:3px solid #93c5fd;background:#fff;border-radius:8px;padding:10px 12px}.util-stage-card h5{margin:0 0 6px}.util-materials-stack{display:flex;flex-direction:column;gap:8px}.util-materials-stack>h4{margin:6px 0 2px}.util-material-card{margin:0 0 12px;padding:12px 14px;border:1px solid #e5e7eb;border-radius:8px;background:#fafafa}.util-material-card:last-child{margin-bottom:0}.util-material-card h4,.util-material-card h5{margin:0 0 8px}.util-mini-card{margin:0 0 10px;padding:10px 12px;border:1px solid #e5e7eb;border-radius:8px;background:#fff}.util-mini-card h5{margin:0 0 6px}.util-check-list{margin-left:18px}.util-check-list li span{color:#16a34a;font-weight:700;margin-right:6px}.util-template-block{margin:0 0 10px;padding:10px 12px;border:1px dashed #cbd5e1;border-radius:8px;background:#fff}.util-template-block h5{margin:0 0 6px}.util-template-note-line{height:1.1rem;border-bottom:1px dotted #cbd5e1;margin-top:8px}.util-structured-block{margin:0 0 12px;padding:12px 14px;border:1px solid #e5e7eb;border-radius:8px;background:#fafafa}.util-structured-block:last-child{margin-bottom:0}.util-scenario-inline p{margin:6px 0}.util-worksheet-line{margin:6px 0 10px;font-family:Segoe UI,Arial,sans-serif;letter-spacing:.02em}.util-support-note{font-size:.9rem;color:#6b7280;border-top:1px solid #e5e7eb;padding-top:8px;margin-top:10px}.util-meta{margin-top:26px;padding-top:10px;border-top:1px solid #e5e7eb;color:#4b5563}.util-meta summary{cursor:pointer;font-weight:600;color:#374151;margin-bottom:8px}.util-meta section{margin-bottom:10px}.util-meta h2{font-size:.98rem;margin:12px 0 6px}.util-meta p,.util-meta li{font-size:.92rem}.lo-shell{display:flex;flex-direction:column;gap:12px}.lo-top{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap}.lo-progress{font-size:.92rem;color:#4b5563;white-space:nowrap}.lo-nav{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;align-items:center}.lo-nav a{font-size:.88rem;color:#2563eb;text-decoration:none;border:1px solid #dbeafe;border-radius:999px;padding:4px 10px}.lo-nav a.active{background:#eff6ff;color:#1d4ed8}.lo-stage{border:1px solid #e5e7eb;border-radius:10px;background:#fff;padding:14px}.lo-screen{display:none}.lo-screen.active{display:block}.lo-controls{display:flex;justify-content:center;align-items:center;gap:10px;flex-wrap:wrap;margin-top:8px}.lo-controls button{border:1px solid #d1d5db;background:#fff;border-radius:8px;padding:8px 12px;cursor:pointer}.lo-controls button:disabled{opacity:.45;cursor:not-allowed}</style>",
      "</head>",
      "<body>",
      '<div class="lo-shell">',
      '<div class="lo-top"><div><h1>' + utilityEscapeHtml(title) + '</h1>' + (audience ? ('<p><strong>Audience:</strong> ' + utilityEscapeHtml(audience) + "</p>") : "") + '</div><div id="loProgress" class="lo-progress">1 of ' + sections.length + "</div></div>",
      '<main class="lo-stage" id="loStage">' + screensHtml + "</main>",
      '<div class="lo-controls"><button id="loPrevBtn" type="button">Previous</button><nav class="lo-nav" id="loNav">' + navLinks + '</nav><button id="loNextBtn" type="button">Next</button></div>',
      metadataHtml,
      "</div>",
      "<script>(function(){var screens=[].slice.call(document.querySelectorAll('[data-lo-screen]'));var nav=[].slice.call(document.querySelectorAll('#loNav [data-lo-index]'));var progress=document.getElementById('loProgress');var prev=document.getElementById('loPrevBtn');var next=document.getElementById('loNextBtn');var idx=0;function render(){if(!screens.length)return;idx=Math.max(0,Math.min(idx,screens.length-1));screens.forEach(function(s,i){s.classList.toggle('active',i===idx);});nav.forEach(function(a,i){a.classList.toggle('active',i===idx);});if(progress)progress.textContent=(idx+1)+' of '+screens.length;if(prev)prev.disabled=idx<=0;if(next)next.disabled=idx>=screens.length-1;}if(prev)prev.addEventListener('click',function(){idx-=1;render();});if(next)next.addEventListener('click',function(){idx+=1;render();});nav.forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();var n=parseInt(a.getAttribute('data-lo-index'),10);if(!isNaN(n)){idx=n;render();}});});render();})();</script>",
      "</body>",
      "</html>"
    ].join("");
    return { html: htmlDoc };
  }

  function buildUtilityStructuredHtml(parsed, plan, _baseName, renderOptions) {
    var options = renderOptions && typeof renderOptions === "object" ? renderOptions : {};
    var presentationMode = String(options.presentationMode || "single_page").toLowerCase();
    var hints = plan && plan.renderHints && typeof plan.renderHints === "object"
      ? plan.renderHints
      : {};
    var cfg = hints.renderConfig && typeof hints.renderConfig === "object"
      ? hints.renderConfig
      : null;
    if (!cfg) {
      return { error: 'Renderable artefact "' + String(plan.artefactType || "") + '" is missing renderConfig.' };
    }

    var labels = cfg.labels && typeof cfg.labels === "object" ? cfg.labels : {};
    var omitIfMissing = Array.isArray(cfg.omitIfMissing) ? cfg.omitIfMissing.map(function (k) {
      return String(k || "");
    }) : [];
    var sectionOrder = Array.isArray(cfg.sectionOrder) && cfg.sectionOrder.length
      ? cfg.sectionOrder.slice()
      : [];
    var artefactType = String((plan && plan.artefactType) || "").toLowerCase();
    var isPageArtefact = artefactType === "page";

    var htmlParts = [];
    var title = String((parsed && (parsed.title || parsed.name)) || utilityLabelFromKey(plan.artefactType || "Artefact"));
    htmlParts.push("<h1>" + utilityEscapeHtml(title) + "</h1>");

    if (parsed && !utilityIsEmptyValue(parsed.audience)) {
      htmlParts.push("<p><strong>Audience:</strong> " + utilityEscapeHtml(parsed.audience) + "</p>");
    }

    var itemKeyMap = cfg.itemKeyMap && typeof cfg.itemKeyMap === "object" ? cfg.itemKeyMap : {};
    var primaryBlocks = [];
    var metadataBlocks = [];
    var metadataKeys = {
      source_artefacts: true,
      constraints_applied: true,
      generation_notes: true
    };
    function buildLearningObjectSectionBlocksFromPageSections() {
      if (!isPageArtefact || !parsed || utilityIsEmptyValue(parsed.sections)) return [];
      var blocks = [];
      var sectionRenderOpts = {
        cleanupInlineMarkdown: true,
        suppressInternalMetadata: true,
        pageProfile: parsed && parsed.page_profile ? String(parsed.page_profile) : "",
        feedbackDisplay:
          parsed && !utilityIsEmptyValue(parsed.feedback_display)
            ? String(parsed.feedback_display)
            : (parsed && parsed.metadata && !utilityIsEmptyValue(parsed.metadata.feedback_display)
                ? String(parsed.metadata.feedback_display)
                : (parsed && parsed.assessment_blueprint && !utilityIsEmptyValue(parsed.assessment_blueprint.feedback_display)
                    ? String(parsed.assessment_blueprint.feedback_display)
                    : ""))
      };
      if (Array.isArray(parsed.sections)) {
        parsed.sections.forEach(function (entry) {
          if (utilityIsEmptyValue(entry)) return;
          var rendered = utilityRenderPageSections([entry], labels, sectionOrder, sectionRenderOpts);
          if (String(rendered || "").trim()) blocks.push(rendered);
        });
        return blocks;
      }
      if (parsed.sections && typeof parsed.sections === "object") {
        var orderedKeys = [];
        if (Array.isArray(sectionOrder) && sectionOrder.length) {
          sectionOrder.forEach(function (k) {
            if (Object.prototype.hasOwnProperty.call(parsed.sections, k)) orderedKeys.push(k);
          });
        }
        Object.keys(parsed.sections).forEach(function (k) {
          if (orderedKeys.indexOf(k) === -1) orderedKeys.push(k);
        });
        orderedKeys.forEach(function (k) {
          if (utilityIsEmptyValue(parsed.sections[k])) return;
          var single = {};
          single[k] = parsed.sections[k];
          var rendered = utilityRenderPageSections(single, labels, sectionOrder, sectionRenderOpts);
          if (String(rendered || "").trim()) blocks.push(rendered);
        });
      }
      return blocks;
    }

    function renderSectionKey(sectionKey) {
      var key = String(sectionKey || "").trim();
      if (!key) return "";
      var value = parsed && parsed[key];
      if (utilityIsEmptyValue(value) && omitIfMissing.indexOf(key) !== -1) {
        return "";
      }
      if (utilityIsEmptyValue(value)) return "";
      if (isPageArtefact && key === "page_profile") return "";
      var heading = labels[key] || utilityLabelFromKey(key);
      if (isPageArtefact && key === "sections") {
        return utilityRenderPageSections(value, labels, sectionOrder, {
          cleanupInlineMarkdown: true,
          suppressInternalMetadata: true,
          pageProfile: parsed && parsed.page_profile ? String(parsed.page_profile) : "",
          feedbackDisplay:
            parsed && !utilityIsEmptyValue(parsed.feedback_display)
              ? String(parsed.feedback_display)
              : (parsed && parsed.metadata && !utilityIsEmptyValue(parsed.metadata.feedback_display)
                  ? String(parsed.metadata.feedback_display)
                  : (parsed && parsed.assessment_blueprint && !utilityIsEmptyValue(parsed.assessment_blueprint.feedback_display)
                      ? String(parsed.assessment_blueprint.feedback_display)
                      : ""))
        });
      }
      if (isPageArtefact && key === "source_artefacts" && value && typeof value === "object" && !Array.isArray(value)) {
        var trueKeys = Object.keys(value).filter(function (k) {
          return value[k] === true;
        });
        if (trueKeys.length) {
          var list = trueKeys.map(function (k) {
            return "<li>" + utilityEscapeHtml(utilityLabelFromKey(k)) + "</li>";
          }).join("");
          return "<section><h2>" + utilityEscapeHtml(heading) + "</h2><ul>" + list + "</ul></section>";
        }
      }
      if (Array.isArray(value) && key === "slides") {
        var slideTitleKey = String(itemKeyMap.slideTitle || "slide_title");
        var slideContentKey = String(itemKeyMap.slideContent || "content");
        var slideNotesKey = String(itemKeyMap.slideNotes || "facilitator_notes");
        var slidesHtml = value.map(function (slide, idx) {
          var titleText = slide && slide[slideTitleKey] != null ? slide[slideTitleKey] : "Slide " + (idx + 1);
          var content = slide ? slide[slideContentKey] : "";
          var notes = slide ? slide[slideNotesKey] : "";
          var body = Array.isArray(content)
            ? utilityRenderArray(content, { cleanupInlineMarkdown: false })
            : utilityRenderPrimitive(content, { cleanupInlineMarkdown: false });
          var notesHtml = utilityIsEmptyValue(notes) ? "" : "<p><strong>Notes:</strong> " + utilityEscapeHtml(notes) + "</p>";
          if (!String(body || "").trim() && !String(notesHtml || "").trim()) return "";
          return "<article class=\"util-slide\"><h3>" + utilityEscapeHtml(titleText) + "</h3>" + body + notesHtml + "</article>";
        }).filter(function (x) { return !!String(x || "").trim(); }).join("");
        if (!slidesHtml) return "";
        return "<section><h2>" + utilityEscapeHtml(heading) + "</h2>" + slidesHtml + "</section>";
      }
      var cleanupInlineMarkdown = isPageArtefact && !metadataKeys[key];
      var humanizeEnumValues = isPageArtefact && !!metadataKeys[key];
      var bodyHtml = Array.isArray(value)
        ? utilityRenderArray(value, {
            cleanupInlineMarkdown: cleanupInlineMarkdown,
            suppressInternalMetadata: cleanupInlineMarkdown,
            humanizeEnumValues: humanizeEnumValues
          })
        : value && typeof value === "object"
        ? utilityRenderObject(value, 0, {
            cleanupInlineMarkdown: cleanupInlineMarkdown,
            suppressInternalMetadata: cleanupInlineMarkdown,
            humanizeEnumValues: humanizeEnumValues
          })
        : utilityRenderPrimitive(value, {
            cleanupInlineMarkdown: cleanupInlineMarkdown,
            suppressInternalMetadata: cleanupInlineMarkdown,
            humanizeEnumValues: humanizeEnumValues
          });
      if (!String(bodyHtml || "").trim()) return "";
      return "<section><h2>" + utilityEscapeHtml(heading) + "</h2>" + bodyHtml + "</section>";
    }

    if (sectionOrder.length) {
      sectionOrder.forEach(function (key) {
        var rendered = renderSectionKey(key);
        if (!rendered) return;
        if (metadataKeys[key]) metadataBlocks.push(rendered);
        else primaryBlocks.push(rendered);
      });
    }

    Object.keys(parsed || {}).forEach(function (key) {
      if (key === "artifact_type" || key === "title" || key === "audience" || key === "page_profile") return;
      if (sectionOrder.indexOf(key) !== -1) return;
      var rendered = renderSectionKey(key);
      if (!rendered) return;
      if (metadataKeys[key]) metadataBlocks.push(rendered);
      else primaryBlocks.push(rendered);
    });
    htmlParts = htmlParts.concat(primaryBlocks);
    if (isPageArtefact && presentationMode === "learning_object") {
      var loBlocks = buildLearningObjectSectionBlocksFromPageSections();
      if (!loBlocks.length) loBlocks = primaryBlocks.slice();
      return buildUtilityLearningObjectHtml(title, parsed && parsed.audience, loBlocks, metadataBlocks);
    }
    if (metadataBlocks.length) {
      htmlParts.push(
        "<details class=\"util-meta\"><summary>Production Metadata</summary>" +
          metadataBlocks.join("") +
          "</details>"
      );
    }
    function sanitizeUtilityHtmlOutput(html) {
      var out = String(html || "");
      function splitDashPromptItems(text) {
        var raw = String(text == null ? "" : text).trim();
        if (!raw) return [];
        var clean = raw.replace(/^\s*-\s+/, "").trim();
        if (!clean) return [];
        var parts = clean.split(/\s+-\s+(?=(?:[A-Z0-9]|\*\*|<strong>|☐|☑|☒|\[(?: |x|X)\]))/);
        return parts.map(function (p) { return String(p || "").trim(); }).filter(function (p) { return !!p; });
      }
      function parseCheckboxInner(innerHtml) {
        var raw = String(innerHtml == null ? "" : innerHtml).trim();
        var m = raw.match(/^(☐|☑|☒|\[(?: |x|X)\])\s+([\s\S]+)$/);
        if (!m) return null;
        var token = String(m[1] || "").trim();
        if (/^\[(x|X)\]$/.test(token)) token = "☑";
        if (/^\[\s\]$/.test(token)) token = "☐";
        return { token: token, textHtml: String(m[2] || "").trim() };
      }
      out = out.replace(/<p>\s*([^:<]{1,220}):\s*-\s*<\/p>/gi, function (_, label) {
        return '<label class="util-line-label">' + utilityRenderMarkdownInline(String(label || "").trim()) + '</label><div class="util-template-note-line" aria-hidden="true"></div>';
      });
      out = out.replace(/<p>\s*<strong>\s*([^<]{1,220}:)\s*<\/strong>\s*-\s*([\s\S]*?)<\/p>/gi, function (_, label, prompt) {
        var cleanLabel = String(label || "").trim();
        var cleanPrompt = String(prompt || "").trim();
        if (!cleanLabel) return "";
        var promptHtml = cleanPrompt ? ("<p>" + utilityRenderMarkdownInline(cleanPrompt) + "</p>") : "";
        return '<p class="util-line-label"><strong>' + utilityRenderMarkdownInline(cleanLabel) + "</strong></p>" + promptHtml + '<div class="util-template-note-line" aria-hidden="true"></div>';
      });
      var placeholderToken = "(?:--|-|—|___|\\.\\.\\.)";
      var placeholderTokenRe = new RegExp(placeholderToken);
      out = out.replace(new RegExp("<ul>\\s*<li>\\s*" + placeholderToken + "\\s*<\\/li>\\s*<\\/ul>", "gi"), "");
      out = out.replace(new RegExp("<p>\\s*" + placeholderToken + "\\s*<\\/p>", "gi"), "");
      out = out.replace(new RegExp("<li>\\s*" + placeholderToken + "\\s*<\\/li>", "gi"), "");
      out = out.replace(/<p>\s*assessment_check\s*<\/p>/gi, "");
      out = out.replace(/<li>\s*-\s*<\/li>/gi, '<div class="util-template-note-line" aria-hidden="true"></div>');
      out = out.replace(/<p>\s*-\s*([^<][\s\S]*?)<\/p>/gi, function (_, content) {
        var parts = splitDashPromptItems(content);
        if (!parts.length) return '<div class="util-template-note-line" aria-hidden="true"></div>';
        return "<ul>" + parts.map(function (p) {
          return "<li>" + utilityRenderMarkdownInline(p) + "</li>";
        }).join("") + "</ul>";
      });
      out = out.replace(/<p>\s*([^<]*?)\s*<\/p>/gi, function (full, text) {
        var t = String(text || "").trim();
        if (!/^\s*-\s+/.test(t)) return full;
        var parts = splitDashPromptItems(t);
        if (!parts.length) return '<div class="util-template-note-line" aria-hidden="true"></div>';
        return "<ul>" + parts.map(function (p) {
          return "<li>" + utilityRenderMarkdownInline(p) + "</li>";
        }).join("") + "</ul>";
      });
      out = out.replace(/<ul>([\s\S]*?)<\/ul>/gi, function (full, inner) {
        var liMatches = [];
        inner.replace(/<li>([\s\S]*?)<\/li>/gi, function (_m, liInner) {
          liMatches.push(String(liInner || "").trim());
          return _m;
        });
        if (!liMatches.length) return full;
        var parsed = liMatches.map(parseCheckboxInner);
        if (!parsed.every(function (x) { return !!x; })) return full;
        var rows = parsed.map(function (entry) {
          return '<li><span class="util-checkbox" aria-hidden="true">' +
            utilityEscapeHtml(entry.token) +
            '</span><span>' + entry.textHtml + "</span></li>";
        }).join("");
        return '<ul class="util-checkbox-list">' + rows + "</ul>";
      });
      out = out.replace(/<li>\s*#{2,3}\s*([^<]+?)\s*<\/li>/gi, function (_, heading) {
        return '<h5 class="util-card-subheading">' + utilityRenderMarkdownInline(String(heading || "").trim()) + "</h5>";
      });
      out = out.replace(/(<(?:p|li|h4|h5)[^>]*>\s*)#{2,3}\s+/gi, "$1");
      // Merge adjacent bullet lists when no content in between.
      for (var mergeIdx = 0; mergeIdx < 4; mergeIdx += 1) {
        var merged = out.replace(/<\/ul>\s*<ul>/gi, "");
        if (merged === out) break;
        out = merged;
      }
      out = out.replace(/<section>([\s\S]*?)<\/section>/gi, function (full, inner) {
        var body = String(inner || "");
        body = body
          .replace(/<h2[\s\S]*?<\/h2>/gi, "")
          .replace(/<p>\s*<\/p>/gi, "")
          .replace(/<ul>\s*<\/ul>/gi, "")
          .replace(/<div class="util-template-note-line"[^>]*>\s*<\/div>/gi, "")
          .replace(new RegExp("<p>\\s*" + placeholderToken + "\\s*<\\/p>", "gi"), "")
          .replace(new RegExp("<li>\\s*" + placeholderToken + "\\s*<\\/li>", "gi"), "")
          .replace(new RegExp("<ul>\\s*<li>\\s*" + placeholderToken + "\\s*<\\/li>\\s*<\\/ul>", "gi"), "")
          .replace(/<p>\s*assessment_check\s*<\/p>/gi, "")
          .trim();
        var textOnly = body.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
        if (!textOnly) return "";
        return full;
      });
      return out;
    }
    htmlParts.unshift(
      "<style>.util-checkbox-list{list-style:none;margin-left:0;padding-left:0}.util-checkbox-list li{display:flex;gap:.5rem;align-items:flex-start}.util-checkbox{flex:0 0 auto}</style>"
    );

    var htmlDoc = [
      "<!doctype html>",
      "<html lang=\"en\">",
      "<head>",
      "<meta charset=\"utf-8\" />",
      "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />",
      "<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css\" crossorigin=\"anonymous\" referrerpolicy=\"no-referrer\" />",
      "<title>" + utilityEscapeHtml(title) + "</title>",
      "<style>body{font-family:Segoe UI,Arial,sans-serif;margin:24px auto;padding:0 8px;max-width:920px;color:#111827;line-height:1.65}h1{margin:0 0 10px;font-size:1.9rem;line-height:1.25}h2{margin:28px 0 10px;font-size:1.2rem;line-height:1.35}h3{margin:18px 0 8px;font-size:1rem}h4{margin:12px 0 8px;font-size:.95rem;color:#374151}p{margin:0 0 12px}ul{margin:0 0 14px 20px;padding:0}li{margin:0 0 6px}section{margin:0 0 16px}table{width:100%;border-collapse:collapse;margin:10px 0 16px}th,td{border:1px solid #d1d5db;padding:8px;text-align:left;vertical-align:top}th{background:#f3f4f6;font-weight:600}tbody tr{min-height:2.2rem}.util-task-block{border:1px solid #dbe4f0;border-radius:12px;padding:16px;margin:14px 0;background:#fff;box-shadow:0 2px 6px rgba(17,24,39,.04)}.util-task-block p strong{line-height:1.4}.util-activity-header{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap;margin-bottom:6px}.util-activity-header h3{margin:0}.util-activity-task{margin:0 0 12px}.util-badge-row{display:flex;gap:6px;flex-wrap:wrap}.util-badge{display:inline-block;border:1px solid #dbe4f0;background:#f8fafc;color:#374151;border-radius:999px;padding:2px 10px;font-size:.78rem;font-weight:600}.util-badge-time{background:#eff6ff;border-color:#bfdbfe;color:#1d4ed8}.util-badge-group{background:#f0fdf4;border-color:#bbf7d0;color:#166534}.util-section-icon{font-size:.9em;color:#64748b;margin-right:.45rem}.util-line-label{margin:0 0 6px;color:#334155}.util-card-subheading{margin:8px 0 6px;font-size:.95rem;color:#374151;font-weight:600}.util-session-step{border-style:dashed;background:#f9fafb}.util-slide{border:1px solid #e5e7eb;border-radius:8px;padding:12px;margin:10px 0}.util-scenario-list{margin:8px 0 14px;padding-left:0}.util-scenario-inline{margin:0 0 12px;padding:14px 16px;border:1px solid #e5e7eb;border-radius:8px;background:#fafafa}.util-scenario-inline:last-child{margin-bottom:0}.util-scenario-inline h3,.util-scenario-inline h4{margin:0 0 8px;font-size:1rem}.util-scenario-title{margin:0 0 8px;font-size:1rem;line-height:1.35;color:#374151;font-weight:600}.util-stage-list{display:grid;gap:10px}.util-stage-card{border-left:3px solid #93c5fd;background:#fff;border-radius:8px;padding:10px 12px}.util-stage-card h5{margin:0 0 6px}.util-material-card{margin:0 0 12px;padding:12px 14px;border:1px solid #e5e7eb;border-radius:8px;background:#fafafa}.util-material-card:last-child{margin-bottom:0}.util-material-card h4,.util-material-card h5{margin:0 0 8px}.util-mini-card{margin:0 0 10px;padding:10px 12px;border:1px solid #e5e7eb;border-radius:8px;background:#fff}.util-mini-card h5{margin:0 0 6px}.util-template-block{margin:0 0 10px;padding:10px 12px;border:1px dashed #cbd5e1;border-radius:8px;background:#fff}.util-template-block h5{margin:0 0 6px}.util-template-note-line{height:1.1rem;border-bottom:1px dotted #cbd5e1;margin-top:8px}.util-structured-block{margin:0 0 12px;padding:12px 14px;border:1px solid #e5e7eb;border-radius:8px;background:#fafafa}.util-structured-block:last-child{margin-bottom:0}.util-scenario-inline p{margin:6px 0}.util-worksheet-line{margin:6px 0 10px;font-family:Segoe UI,Arial,sans-serif;letter-spacing:.02em}.util-support-note{font-size:.9rem;color:#6b7280;border-top:1px solid #e5e7eb;padding-top:8px;margin-top:10px}.util-meta{margin-top:26px;padding-top:10px;border-top:1px solid #e5e7eb;color:#4b5563}.util-meta summary{cursor:pointer;font-weight:600;color:#374151;margin-bottom:8px}.util-meta section{margin-bottom:10px}.util-meta h2{font-size:.98rem;margin:12px 0 6px}.util-meta p,.util-meta li{font-size:.92rem}</style>",
      "</head>",
      "<body>",
      htmlParts.join(""),
      "</body>",
      "</html>"
    ].join("");
    htmlDoc = sanitizeUtilityHtmlOutput(htmlDoc);
    return { html: htmlDoc };
  }

  function applyUtilityPreviewError(message) {
    if (els.utilitiesPreviewPanel) {
      els.utilitiesPreviewPanel.classList.remove("hidden");
    }
    if (els.utilitiesPreviewError) {
      els.utilitiesPreviewError.classList.remove("hidden");
      els.utilitiesPreviewError.textContent = String(message || "Could not render HTML preview.");
    }
    if (els.utilitiesPreviewFrame) {
      els.utilitiesPreviewFrame.srcdoc = "";
    }
    if (els.utilitiesDownloadBtn) {
      els.utilitiesDownloadBtn.disabled = true;
    }
    if (els.utilitiesOpenTabBtn) {
      els.utilitiesOpenTabBtn.disabled = true;
    }
  }

  function applyUtilityPreviewHtml(html) {
    if (els.utilitiesPreviewPanel) {
      els.utilitiesPreviewPanel.classList.remove("hidden");
    }
    if (els.utilitiesPreviewError) {
      els.utilitiesPreviewError.classList.add("hidden");
      els.utilitiesPreviewError.textContent = "";
    }
    if (els.utilitiesPreviewFrame) {
      els.utilitiesPreviewFrame.srcdoc = String(html || "");
    }
    if (els.utilitiesDownloadBtn) {
      els.utilitiesDownloadBtn.disabled = !String(html || "").trim();
    }
    if (els.utilitiesOpenTabBtn) {
      els.utilitiesOpenTabBtn.disabled = !String(html || "").trim();
    }
  }

  // Render architecture:
  // A) Intermediate artefacts: reusable workflow outputs, not always exportable.
  // B) Assembled deliverable artefacts: user-facing structured outputs (e.g. page).
  // C) Rendered files: browser-native HTML previews/downloads.
  //
  // Domain packs declare render intent via artefact renderHints.
  // The app owns a small renderer registry and invokes by renderer type/variant.
  var UTILITY_RENDERER_REGISTRY = {
    document: {
      defaultVariant: "generic_document",
      variants: {
        page: buildUtilityStructuredHtml,
        generic_document: buildUtilityStructuredHtml
      }
    },
    slides: {
      defaultVariant: "slide_deck",
      variants: {
        slide_deck: buildUtilityStructuredHtml
      }
    },
    assessment: {
      defaultVariant: "generic_assessment",
      variants: {
        generic_assessment: buildUtilityStructuredHtml
      }
    }
  };

  function resolveUtilityRenderPlan(parsed, selectedFormat) {
    var artefactType = String(
      parsed && parsed.artifact_type != null ? parsed.artifact_type : ""
    )
      .trim()
      .toLowerCase();
    if (!artefactType) {
      return Promise.resolve({ error: 'Include top-level "artifact_type" in your JSON.' });
    }
    if (
      !window.WorkflowGenerationContext ||
      typeof window.WorkflowGenerationContext.getArtefactRenderCatalog !== "function"
    ) {
      return Promise.resolve({ error: "Render metadata catalog is unavailable." });
    }
    var selectedToken = String(selectedFormat || "").trim().toLowerCase();
    var requestedFormat = normalizeUtilityFormatToken(selectedFormat);
    if (selectedToken && selectedToken !== "html") {
      return Promise.resolve({ error: 'Unsupported utility format token "' + selectedToken + '". Use html.' });
    }
    return window.WorkflowGenerationContext.getArtefactRenderCatalog({})
      .then(function (catalog) {
        var rows = Array.isArray(catalog) ? catalog : [];
        var match = rows.find(function (row) {
          return String((row && row.id) || "").trim().toLowerCase() === artefactType;
        });
        if (!match) {
          return { error: 'No artefact definition found for "' + artefactType + '".' };
        }
        var hints = match && match.renderHints && typeof match.renderHints === "object"
          ? match.renderHints
          : null;
        if (!hints || hints.renderable !== true) {
          return { error: 'Artefact "' + artefactType + '" is not marked renderable.' };
        }
        var cfg = hints.renderConfig && typeof hints.renderConfig === "object"
          ? hints.renderConfig
          : null;
        if (!cfg) {
          return { error: 'Renderable artefact "' + artefactType + '" is missing renderConfig.' };
        }
        if (!Array.isArray(cfg.sectionOrder) || !cfg.sectionOrder.length) {
          return { error: 'Renderable artefact "' + artefactType + '" has invalid renderConfig.sectionOrder.' };
        }
        if (!cfg.labels || typeof cfg.labels !== "object") {
          return { error: 'Renderable artefact "' + artefactType + '" has invalid renderConfig.labels.' };
        }
        if (!Array.isArray(cfg.omitIfMissing)) {
          return { error: 'Renderable artefact "' + artefactType + '" has invalid renderConfig.omitIfMissing.' };
        }
        if (typeof cfg.grouping !== "string" || !String(cfg.grouping).trim()) {
          return { error: 'Renderable artefact "' + artefactType + '" has invalid renderConfig.grouping.' };
        }
        if (!cfg.itemKeyMap || typeof cfg.itemKeyMap !== "object") {
          return { error: 'Renderable artefact "' + artefactType + '" has invalid renderConfig.itemKeyMap.' };
        }
        var supportedFormats = Array.isArray(hints.supportedFormats)
          ? hints.supportedFormats
              .map(normalizeUtilityFormatToken)
              .filter(function (f) { return !!f; })
          : [];
        // HTML is the only supported utility format. If metadata is stale/partial,
        // keep renderable artefacts usable by defaulting to html.
        if (!supportedFormats.length) {
          supportedFormats = ["html"];
        }
        if (requestedFormat && supportedFormats.indexOf(requestedFormat) === -1) {
          return {
            error:
              'Requested format is unsupported for "' +
              artefactType +
              '". Supported: ' +
              supportedFormats.join(", ")
          };
        }
        var chosenFormat = requestedFormat || supportedFormats[0];
        var rendererType = String(hints.rendererType || "").trim().toLowerCase();
        var rendererVariant = String(hints.rendererVariant || "").trim().toLowerCase();
        if (!rendererType) {
          return { error: 'Artefact "' + artefactType + '" does not declare renderer type.' };
        }
        return {
          artefactType: artefactType,
          format: chosenFormat,
          fileExtension: "html",
          rendererType: rendererType,
          rendererVariant: rendererVariant || "",
          renderHints: hints
        };
      })
      .catch(function () {
        return { error: "Could not load artefact render metadata." };
      });
  }

  function getUtilityOutputBaseName(parsed, userProvidedName) {
    var rawName = String(userProvidedName || "").trim();
    if (rawName) return slugify(rawName);
    var artefactType = String(
      parsed && parsed.artifact_type != null ? parsed.artifact_type : "artifact"
    ).trim();
    return slugify(artefactType || "artifact");
  }

  function runUtilityRendererByPlan(plan, parsed, baseName, renderOptions) {
    var rendererType = String((plan && plan.rendererType) || "").trim().toLowerCase();
    var rendererVariant = String((plan && plan.rendererVariant) || "").trim().toLowerCase();
    var family = UTILITY_RENDERER_REGISTRY[rendererType];
    if (!family || !family.variants) {
      throw new Error('No renderer family for type "' + rendererType + '".');
    }
    var variantKey = rendererVariant && family.variants[rendererVariant]
      ? rendererVariant
      : String(family.defaultVariant || "");
    var renderer = family.variants[variantKey];
    if (typeof renderer !== "function") {
      throw new Error(
        'No renderer variant "' + (rendererVariant || variantKey || "default") +
          '" for type "' + rendererType + '".'
      );
    }
    return renderer(parsed, plan, baseName, renderOptions);
  }

  function triggerHtmlDownload(htmlText, fileName) {
    var blob = new Blob([String(htmlText || "")], { type: "text/html;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function getUtilityHtmlDownloadName(baseName) {
    var safeBase = String(baseName || "").trim() || "rendered-output";
    return slugify(safeBase) + ".html";
  }

  function handleUtilitiesGenerate() {
    var raw = String(els.utilitiesJsonInput ? els.utilitiesJsonInput.value : "").trim();
    if (!raw) {
      showToast("Paste JSON first.", "error");
      return;
    }
    // Be tolerant of markdown-escaped JSON snippets (e.g. \_, \[, \]).
    var normalizedRaw = raw.replace(/\\([_\[\]])/g, "$1");
    var parsed;
    try {
      parsed = JSON.parse(normalizedRaw);
    } catch (_) {
      showToast("Invalid JSON. Please check the structure.", "error");
      return;
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      showToast("JSON root must be an object.", "error");
      return;
    }
    if (!parsed.artifact_type) {
      showToast('Include top-level "artifact_type" in your JSON.', "error");
      return;
    }
    var presentationMode = String(
      (els.utilitiesPresentationMode && els.utilitiesPresentationMode.value) ||
      state.utilitiesPresentationMode ||
      "single_page"
    ).toLowerCase();
    state.utilitiesPresentationMode = presentationMode === "learning_object" ? "learning_object" : "single_page";
    var baseName = getUtilityOutputBaseName(
      parsed,
      els.utilitiesFileName ? els.utilitiesFileName.value : ""
    );
    resolveUtilityRenderPlan(
      parsed,
      els.utilitiesOutputFormat ? els.utilitiesOutputFormat.value : "html"
    )
      .then(function (plan) {
        if (!plan || plan.error) {
          applyUtilityPreviewError((plan && plan.error) || "Could not resolve renderer.");
          return null;
        }
        var rendered = runUtilityRendererByPlan(plan, parsed, baseName, {
          presentationMode: state.utilitiesPresentationMode
        });
        if (!rendered || rendered.error) {
          applyUtilityPreviewError((rendered && rendered.error) || "Could not render HTML output.");
          return null;
        }
        var htmlText = String(rendered.html || "").trim();
        if (!htmlText) {
          applyUtilityPreviewError("Rendered output is empty.");
          return null;
        }
        state.utilitiesLastHtml = htmlText;
        state.utilitiesLastFileName = getUtilityHtmlDownloadName(baseName);
        applyUtilityPreviewHtml(htmlText);
        return true;
      })
      .then(function (ok) {
        if (ok) showToast("HTML preview generated.", "success");
      })
      .catch(function (err) {
        applyUtilityPreviewError((err && err.message) || "Could not render HTML output.");
        showToast(
          (err && err.message) || "Could not render HTML output.",
          "error"
        );
      });
  }

  function handleUtilitiesDownloadHtml() {
    var htmlText = String(state.utilitiesLastHtml || "").trim();
    if (!htmlText) {
      showToast("Preview HTML first, then download.", "error");
      return;
    }
    var fileName = String(state.utilitiesLastFileName || "rendered-output.html").trim();
    triggerHtmlDownload(htmlText, fileName);
    showToast("HTML downloaded.", "success");
  }

  function handleUtilitiesOpenInNewTab() {
    var htmlText = String(state.utilitiesLastHtml || "").trim();
    if (!htmlText) {
      showToast("Preview HTML first, then open in new tab.", "error");
      return;
    }
    var newTab = window.open("", "_blank");
    if (!newTab || !newTab.document) {
      showToast("Popup blocked. Allow popups and try again.", "error");
      return;
    }
    newTab.document.open();
    newTab.document.write(htmlText);
    newTab.document.close();
    showToast("Opened HTML in a new tab.", "success");
  }

  function handleUtilitiesClear() {
    if (els.utilitiesJsonInput) els.utilitiesJsonInput.value = "";
    if (els.utilitiesFileName) els.utilitiesFileName.value = "";
    if (els.utilitiesOutputFormat) els.utilitiesOutputFormat.value = "html";
    if (els.utilitiesPresentationMode) els.utilitiesPresentationMode.value = "single_page";
    if (els.utilitiesPreviewFrame) els.utilitiesPreviewFrame.srcdoc = "";
    if (els.utilitiesPreviewError) {
      els.utilitiesPreviewError.classList.add("hidden");
      els.utilitiesPreviewError.textContent = "";
    }
    if (els.utilitiesPreviewPanel) {
      els.utilitiesPreviewPanel.classList.add("hidden");
    }
    if (els.utilitiesDownloadBtn) {
      els.utilitiesDownloadBtn.disabled = true;
    }
    if (els.utilitiesOpenTabBtn) {
      els.utilitiesOpenTabBtn.disabled = true;
    }
    state.utilitiesLastHtml = "";
    state.utilitiesLastFileName = "";
    state.utilitiesPresentationMode = "single_page";
  }

  function ensureWorkflowFactorySaveBinding() {
    if (!els.wfDesignSaveBtn) return;
    els.wfDesignSaveBtn.disabled = false;
    els.wfDesignSaveBtn.removeAttribute("disabled");
  }

  // -----------------------------
  // Initialisation
  // -----------------------------

  function attachEventListeners() {
    // Prompt Studio wiring: brief capture, refinement orchestration, runtime controls.
    els.apiKeyFile.addEventListener("change", handleApiKeyFileChange);

    els.startRefinementBtn.addEventListener("click", handleStartRefinement);
    if (els.newBriefBtn) {
      els.newBriefBtn.addEventListener("click", handleNewBrief);
    }
    if (els.exitWorkflowPromptWizardBtn) {
      els.exitWorkflowPromptWizardBtn.addEventListener("click", function () {
        clearWorkflowPromptContext();
        showToast("Exited workflow prompt mode.", "success");
      });
    }
    els.sendFollowUpBtn.addEventListener("click", handleSendFollowUp);
        els.finishRefinementBtn.addEventListener("click", handleFinishRefinement);

    // Allow pressing Enter in the follow-up textarea to submit the answer.
    if (els.followUpAnswer) {
      els.followUpAnswer.addEventListener("keydown", function (event) {
        if (
          event.key === "Enter" &&
          !event.shiftKey &&
          !els.sendFollowUpBtn.disabled
        ) {
          event.preventDefault();
          handleSendFollowUp();
        }
      });
    }

    els.copyFinalPromptBtn.addEventListener("click", handleCopyFinalPrompt);
    els.saveToLibraryBtn.addEventListener("click", handleSaveRefinedToLibrary);

    // Prompt asset save readiness in Prompt Studio panel.
    if (els.finalPrompt && els.saveToLibraryBtn) {
      els.finalPrompt.addEventListener("input", function () {
        syncSavePromptAssetButtonFromFinalPrompt();
      });
    }
    if (els.promptVersionSelect) {
      els.promptVersionSelect.addEventListener("change", function () {
        if (!state.promptVersions) return;
        var val = els.promptVersionSelect.value;
        if (val !== "draft" && val !== "refined") return;
        state.selectedPromptVersion = val;
        updatePromptVersionUI();
      });
    }

    // Prompt Library wiring: durable asset browse/filter/edit operations.
    var debouncedFilter = window.Utils.debounce(function () {
      renderLibraryList();
    }, 200);
    els.librarySearch.addEventListener("input", debouncedFilter);
    els.tagFilter.addEventListener("input", debouncedFilter);
    if (els.libraryWorkflowFilter) {
      els.libraryWorkflowFilter.addEventListener("change", renderLibraryList);
    }
    els.sortSelect.addEventListener("change", renderLibraryList);

    els.newPromptBtn.addEventListener("click", handleNewPrompt);
    els.savePromptChangesBtn.addEventListener("click", handleSavePromptChanges);
    els.deletePromptBtn.addEventListener("click", handleDeletePrompt);
    els.duplicatePromptBtn.addEventListener("click", handleDuplicatePrompt);
    els.renamePromptBtn.addEventListener("click", handleRenamePrompt);
    els.usePromptBtn.addEventListener("click", handleUsePrompt);
    els.exportAllBtn.addEventListener("click", handleExportAll);
    els.exportPromptBtn.addEventListener("click", handleExportPrompt);
    if (els.copyPromptBodyBtn) {
      els.copyPromptBodyBtn.addEventListener("click", handleCopyPromptBody);
    }
        els.importFileInput.addEventListener("change", handleImportChange);

        if (els.outputType) {
          els.outputType.addEventListener("change", updateOutputTypeVisibility);
        }

        if (els.copyBriefForCopilotBtn) {
          els.copyBriefForCopilotBtn.addEventListener("click", handleCopyBriefForCopilot);
        }

    // Prompt Studio tuning controls.
    if (els.creativitySelect) {
      els.creativitySelect.addEventListener("change", function () {
        debugOpenAI("Creativity changed to '" + getCreativityPreset() + "'");
      });
    }
    if (els.responseDetailSelect) {
      els.responseDetailSelect.addEventListener("change", function () {
        debugOpenAI(
          "Response detail changed to '" + getResponseDetailPreset() + "'"
        );
      });
    }

    // Workflow Factory / Workflow panels wiring (kept separate from Prompt Studio concerns).
    if (els.wfDesignStartBtn) {
      els.wfDesignStartBtn.addEventListener("click", handleStartWorkflowDesign);
    }
    if (els.wfDesignSaveBtn) {
      // Never leave this action silent due to disabled button state.
      els.wfDesignSaveBtn.disabled = false;
      els.wfDesignSaveBtn.addEventListener("click", handleSaveDesignedWorkflow);
    }
    if (els.wfDesignReviewBtn) {
      els.wfDesignReviewBtn.addEventListener("click", handleWorkflowReview);
    }
    if (els.wfDesignSendBtn) {
      els.wfDesignSendBtn.addEventListener("click", handleWorkflowAnswer);
    }
    if (els.wfDesignAnswer) {
      els.wfDesignAnswer.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          handleWorkflowAnswer();
        }
      });
    }

    if (els.wfDesignVersionSelect) {
      els.wfDesignVersionSelect.addEventListener("change", function () {
        var val = els.wfDesignVersionSelect.value;
        if (val !== "draft" && val !== "refined") return;
        state.workflowSelectedVersion = val;
        renderWorkflowDesignResult({ promptRefine: false });
      });
    }
    if (els.wfDesignStartingArtefact) {
      els.wfDesignStartingArtefact.addEventListener("change", function () {
        updateWorkflowFactoryInputsCopyFromStartingPoint();
      });
    }

    if (els.wfDesignSteps) {
      els.wfDesignSteps.addEventListener("input", function (event) {
        var target = event.target;
        if (!target || !target.getAttribute) return;
        var field = target.getAttribute("data-field");
        if (field !== "title" && field !== "role") return;
        var li = target.closest ? target.closest(".workflow-step") : null;
        if (!li) return;
        var idxStr = li.getAttribute("data-wf-step-index");
        var idx = parseInt(idxStr, 10);
        if (!Number.isFinite(idx)) return;
        updateWorkflowDesignStepField(idx, field, target.value || "");
      });

      els.wfDesignSteps.addEventListener("click", function (event) {
        var target = event.target;
        if (!target || !target.getAttribute) return;
        if (target.getAttribute("data-action") !== "delete-wf-step") return;
        var li = target.closest ? target.closest(".workflow-step") : null;
        if (!li) return;
        var idxStr = li.getAttribute("data-wf-step-index");
        var idx = parseInt(idxStr, 10);
        if (!Number.isFinite(idx)) return;

        var confirmed = window.confirm("Delete this step from the suggested workflow?");
        if (!confirmed) return;
        deleteWorkflowDesignStep(idx);
      });
    }

    ensureWorkflowFactorySaveBinding();


    // Main tab navigation wiring.
    if (els.tabRefiner) {
      els.tabRefiner.addEventListener("click", function () {
        switchTab("promptFactory");
      });
    }
    if (els.tabLibrary) {
      els.tabLibrary.addEventListener("click", function () {
        switchTab("promptLibrary");
      });
    }
    if (els.tabWorkflowFactory) {
      els.tabWorkflowFactory.addEventListener("click", function () {
        switchTab("workflowFactory");
      });
    }
    if (els.tabWorkflows) {
      els.tabWorkflows.addEventListener("click", function () {
        switchTab("workflows");
      });
    }
    if (els.tabUtilities) {
      els.tabUtilities.addEventListener("click", function () {
        switchTab("utilities");
      });
    }

    // Utilities panel wiring.
    if (els.utilitiesGenerateBtn) {
      els.utilitiesGenerateBtn.addEventListener("click", handleUtilitiesGenerate);
    }
    if (els.utilitiesDownloadBtn) {
      els.utilitiesDownloadBtn.addEventListener("click", handleUtilitiesDownloadHtml);
    }
    if (els.utilitiesOpenTabBtn) {
      els.utilitiesOpenTabBtn.addEventListener("click", handleUtilitiesOpenInNewTab);
    }
    if (els.utilitiesClearBtn) {
      els.utilitiesClearBtn.addEventListener("click", handleUtilitiesClear);
    }

    // Workflow run/edit wiring and keyboard shortcuts.
    if (els.workflowList) {
      els.workflowList.addEventListener("click", handleWorkflowListClick);
    }
    if (els.newWorkflowBtn) {
      els.newWorkflowBtn.addEventListener("click", handleNewWorkflow);
    }
    if (els.duplicateWorkflowBtn) {
      els.duplicateWorkflowBtn.addEventListener("click", handleDuplicateWorkflow);
    }
    if (els.renameWorkflowBtn) {
      els.renameWorkflowBtn.addEventListener("click", handleRenameWorkflow);
    }
    if (els.addWorkflowStepBtn) {
      els.addWorkflowStepBtn.addEventListener("click", handleAddWorkflowStep);
    }
    if (els.saveWorkflowBtn) {
      els.saveWorkflowBtn.addEventListener("click", handleSaveWorkflow);
    }
    if (els.saveWorkflowBtnBottom) {
      els.saveWorkflowBtnBottom.addEventListener("click", handleSaveWorkflow);
    }
    if (els.deleteWorkflowBtn) {
      els.deleteWorkflowBtn.addEventListener("click", handleDeleteWorkflow);
    }
    if (els.copyWorkflowSummaryBtn) {
      els.copyWorkflowSummaryBtn.addEventListener("click", handleCopyWorkflowSummary);
    }

    if (els.exportAllWorkflowsBtn) {
      els.exportAllWorkflowsBtn.addEventListener("click", handleExportAllWorkflows);
    }
    if (els.exportWorkflowBtn) {
      els.exportWorkflowBtn.addEventListener("click", handleExportWorkflow);
    }
    if (els.importWorkflowsInput) {
      els.importWorkflowsInput.addEventListener("change", handleImportChange);
    }

    if (els.workflowPrevStepBtn) {
      els.workflowPrevStepBtn.addEventListener("click", function () {
        state.currentWorkflowRunIndex -= 1;
        updateWorkflowRunView();
      });
    }
    if (els.workflowNextStepBtn) {
      els.workflowNextStepBtn.addEventListener("click", function () {
        state.currentWorkflowRunIndex += 1;
        updateWorkflowRunView();
      });
    }
    if (els.workflowModeEditBtn) {
      els.workflowModeEditBtn.addEventListener("click", function () {
        setWorkflowMode("edit");
      });
    }
    if (els.workflowModeRunBtn) {
      els.workflowModeRunBtn.addEventListener("click", function () {
        setWorkflowMode("run");
      });
    }
    if (els.workflowDetail) {
      els.workflowDetail.addEventListener("input", function () {
        if (!state.selectedWorkflowId) return;
        var draft = gatherWorkflowDetailFormData();
        renderWorkflowValidationWarnings(validateWorkflow(draft));
      });
    }

    function isEditableKeyboardTarget(target) {
      if (!target || typeof target !== "object") return false;
      if (target.isContentEditable) return true;
      var tag = String(target.tagName || "").toLowerCase();
      if (tag === "textarea" || tag === "select") return true;
      if (tag === "input") {
        var inputType = String(target.type || "").toLowerCase();
        return inputType !== "button" && inputType !== "submit" && inputType !== "reset";
      }
      return false;
    }
    document.addEventListener("keydown", function (event) {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        if (els.workflowFactoryPanel && !els.workflowFactoryPanel.classList.contains("hidden")) {
          handleSaveDesignedWorkflow();
        } else if (els.workflowsPanel && !els.workflowsPanel.classList.contains("hidden")) {
          handleSaveWorkflow();
        } else if (els.refinementPanel && !els.refinementPanel.classList.contains("hidden")) {
          handleSaveRefinedToLibrary();
        } else if (els.libraryPanel && !els.libraryPanel.classList.contains("hidden")) {
          handleSavePromptChanges();
        }
        return;
      }
      if (event.key === "Delete" && !event.ctrlKey && !event.metaKey && !event.altKey) {
        if (isEditableKeyboardTarget(event.target)) return;
        if (els.libraryPanel && !els.libraryPanel.classList.contains("hidden") && state.selectedPromptId) {
          event.preventDefault();
          handleDeletePrompt();
          return;
        }
        if (els.workflowsPanel && !els.workflowsPanel.classList.contains("hidden") && state.selectedWorkflowId) {
          event.preventDefault();
          handleDeleteWorkflow();
        }
      }
    });

  }

  function finalizeInitialUiSetup() {
    attachEventListeners();
    updateOutputTypeVisibility();
    updateWorkflowFactoryInputsCopyFromStartingPoint();
    renderWorkflowPromptWizardNotice();
    setWorkflowMode("edit");
    switchTab("workflowFactory");
  }

  function init() {
    cacheElements();
    initWorkflowDomainSelector();
    updateApiKeyStatus(false);
    resetSession();
    loadLibrary()
      .then(function () {
        return loadWorkflows();
      })
      .then(function () {
        finalizeInitialUiSetup();
      })
      .catch(function () {
        // If anything fails during initial async setup, still attach listeners
        // so the user can interact with whatever did load.
        finalizeInitialUiSetup();
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

