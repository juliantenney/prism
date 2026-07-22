"use strict";

/**
 * S68-IMP-016 — Evidence-based learner-surface adequacy audit.
 *
 * Read-only analysis: does not alter rendering or composition behaviour.
 */

var path = require("path");
var fs = require("fs");

var buildPageModel = require("./build-page-model").buildPageModel;
var parseLearnerTask = require("./parse-learner-task").parseLearnerTask;
var composeActivityMoments = require("./compose-activity-moments");
var determineWorkspaceRequirement =
  require("./compose-workspace").determineWorkspaceRequirement;
var shouldComposeTableWorkspaceMaterial =
  require("./completion-table-workspace").shouldComposeTableWorkspaceMaterial;
var tableParse = require("./table-material-parse");
var parsePromptSetItems = require("./parse-prompt-set-items").parsePromptSetItems;
var parseTemplateSections = require("./parse-template-sections").parseTemplateSections;
var isWrittenTaskStep = require("./compose-response-parts").isWrittenTaskStep;

var ADEQUACY = Object.freeze({
  FULLY_SUPPORTED: "fully_supported",
  IMPERFECT: "supported_imperfectly_represented",
  MISSING: "missing_capability"
});

var ORDERING_EVIDENCE_RE =
  /\b(put in order|arrange|sequence|rank|prioriti[sz]e|earliest to latest|first to last|drag into order|reorder|put the steps in order|order the|in the correct order)\b/i;

var EXPLICIT_REORDER_RE =
  /\b(put in order|put .+ in order|arrange|drag|reorder|rearrange|move (?:the )?(?:items|steps|rows)|order the (?:following|items|steps))\b/i;

var SEQUENCED_CONTENT_RE =
  /\b(in order|sequenced|step-by-step|process walkthrough|trace .+ in order|causal order|chronolog)\b/i;

var PROMPT_SET_MATERIAL_RE = /prompt_set/i;

/**
 * Authoritative and representative workflow fixtures for surface auditing.
 * Paths are relative to repository root.
 */
var AUDIT_CORPUS = Object.freeze([
  {
    id: "videotranscripttest",
    fixturePath: "tests/fixtures/workflows/videotranscripttest-assembled-page.json",
    workflowId: "0d1c12c0-ad1c-449f-8ad9-8f90b8f01097",
    provenance: "Authoritative production VideoTranscriptTest workflow (IMP-014C)",
    whyIncluded: "Primary production-shaped RNA workflow with journey-compressed beats"
  },
  {
    id: "heteroscedasticity",
    fixturePath: "tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json",
    workflowId: null,
    provenance: "Sprint 67 vNext golden page fixture",
    whyIncluded: "Regression-critical full lesson with text_entry, table_entry, prompt_set, and assessment"
  },
  {
    id: "kitchen-sink",
    fixturePath: "tests/fixtures/page-render/learner-renderer-kitchen-sink-page.json",
    workflowId: null,
    provenance: "S68 GAM type-coverage synthetic fixture",
    whyIncluded: "Exercises all thirteen vNext material types across five archetype variants"
  },
  {
    id: "rna-episode-plan-v1",
    fixturePath: "tests/fixtures/page-render/rna-hcv-assembled-vnext-materials-page.json",
    workflowId: null,
    provenance: "S62 RNA materials page with episode-plan-v1 beat vocabulary",
    whyIncluded: "Archetype and table-routing regression corpus (IMP-014A/B)"
  },
  {
    id: "generic-moments-new01",
    fixturePath: "tests/fixtures/page-render/learner-renderer-generic-moments-new01-page.json",
    workflowId: null,
    provenance: "Minimal generic composition proof fixture (IMP-013)",
    whyIncluded: "Confirms surface assignment is activity-ID-independent"
  },
  {
    id: "authoritative-ordering",
    fixturePath: "tests/fixtures/page-render/prism-authoritative-ordering-page.json",
    workflowId: "fixture-seq-authoritative",
    provenance:
      "Authoritative PRISM sequencing schema adapted from sequencing-rollout-learner-page.json; corroborated by Sprint 59 Educational Psychology A3",
    whyIncluded: "Genuine learner ordering interaction with canonical_order and learner_display_order"
  }
]);

function readJsonFromRepo(repoRoot, relativePath) {
  var abs = path.join(repoRoot, relativePath);
  return JSON.parse(fs.readFileSync(abs, "utf8"));
}

function sourceActivityMap(sourcePage) {
  var map = Object.create(null);
  (Array.isArray(sourcePage.activities) ? sourcePage.activities : []).forEach(function (activity) {
    var id = String((activity && activity.activity_id) || "").trim();
    if (id) map[id] = activity;
  });
  return map;
}

function beatSequenceFromSource(sourceActivity) {
  var beats = sourceActivity && sourceActivity.episode_plan && sourceActivity.episode_plan.beats;
  if (!Array.isArray(beats)) return [];
  return beats.map(function (beat) {
    return String((beat && beat.function) || "").trim();
  });
}

function archetypeFromSource(sourceActivity) {
  return String(
    (sourceActivity &&
      sourceActivity.episode_plan &&
      sourceActivity.episode_plan.archetype) ||
      ""
  ).trim();
}

function materialTypesFromModel(modelActivity) {
  var types = [];
  (Array.isArray(modelActivity.beats) ? modelActivity.beats : []).forEach(function (beat) {
    (Array.isArray(beat.materials) ? beat.materials : []).forEach(function (material) {
      var type = String((material && material.type) || "").trim();
      if (type && types.indexOf(type) < 0) types.push(type);
    });
  });
  return types.sort();
}

function collectAssessmentItems(sourcePage) {
  var section = sourcePage && sourcePage.assessment_check;
  return Array.isArray(section && section.items) ? section.items : [];
}

function extractTextWorkspacesFromMoment(moment) {
  var textWorkspaces = [];
  if (!moment) return textWorkspaces;

  var workspaceList = [];
  if (Array.isArray(moment.workspaces) && moment.workspaces.length) {
    workspaceList = moment.workspaces;
  } else if (moment.workspace) {
    workspaceList = [moment.workspace];
  }

  workspaceList.forEach(function (workspace) {
    if (String((workspace && workspace.capability) || "") === "text_entry") {
      textWorkspaces.push(workspace);
    }
    if (String((workspace && workspace.capability) || "") === "ordering") {
      if (surfaces.indexOf("ordering") < 0) surfaces.push("ordering");
    }
  });

  return textWorkspaces;
}

function extractSurfacesFromMoments(doMoment, checkMoment) {
  var surfaces = [];
  var tableMaterials = [];
  var textWorkspaces = [];
  var orderingWorkspaces = [];

  [doMoment, checkMoment].forEach(function (moment) {
    if (!moment) return;
    (Array.isArray(moment.items) ? moment.items : []).forEach(function (item) {
      if (item && item.tableWorkspace && item.material) {
        if (surfaces.indexOf("table_entry") < 0) surfaces.push("table_entry");
        tableMaterials.push(String(item.material.id || ""));
      }
    });

    var workspaceList = [];
    if (Array.isArray(moment.workspaces) && moment.workspaces.length) {
      workspaceList = moment.workspaces;
    } else if (moment.workspace) {
      workspaceList = [moment.workspace];
    }

    workspaceList.forEach(function (workspace) {
      var capability = String((workspace && workspace.capability) || "");
      if (capability === "text_entry") {
        if (surfaces.indexOf("text_entry") < 0) surfaces.push("text_entry");
        textWorkspaces.push(workspace);
      }
      if (capability === "ordering") {
        if (surfaces.indexOf("ordering") < 0) surfaces.push("ordering");
        orderingWorkspaces.push(workspace);
      }
    });
  });

  var responseFieldCount =
    tableMaterials.length + textWorkspaces.length + orderingWorkspaces.length;
  (doMoment && Array.isArray(doMoment.items) ? doMoment.items : []).forEach(function (item) {
    if (!item || !item.tableWorkspace || !item.material) return;
    var table = tableParse.extractTableFromMaterial(item.material);
    if (!table) return;
    table.rows.forEach(function (row) {
      row.forEach(function (cell) {
        if (tableParse.isBlankCell(cell)) responseFieldCount += 1;
      });
    });
  });

  return {
    surfaces: surfaces,
    tableMaterials: tableMaterials,
    textWorkspaces: textWorkspaces,
    orderingWorkspaces: orderingWorkspaces,
    responseFieldCount: responseFieldCount
  };
}

function responseShapeSummary(surfaceInfo) {
  if (!surfaceInfo.surfaces.length) return "no learner workspace";
  var parts = [];
  if (surfaceInfo.surfaces.indexOf("table_entry") >= 0) {
    parts.push(
      "table_entry(" + surfaceInfo.tableMaterials.join(",") + "; blank cells editable)"
    );
  }
  if (surfaceInfo.surfaces.indexOf("text_entry") >= 0) {
    parts.push(
      "text_entry(" +
        surfaceInfo.textWorkspaces
          .map(function (workspace) {
            return String(workspace.responseLabel || workspace.sourceKind || "field");
          })
          .join(", ") +
        ")"
    );
  }
  if (surfaceInfo.surfaces.indexOf("ordering") >= 0) {
    parts.push(
      "ordering(" +
        (surfaceInfo.orderingWorkspaces || [])
          .map(function (workspace) {
            return String(workspace.label || workspace.orderingMode || "sequence");
          })
          .join(", ") +
        ")"
    );
  }
  return parts.join(" + ");
}

function inferLearnerAction(sourceActivity, taskSteps, materialTypes) {
  var taskText = String((sourceActivity && sourceActivity.learner_task) || "");
  var expected = String((sourceActivity && sourceActivity.expected_output) || "").trim();
  var steps = Array.isArray(taskSteps) ? taskSteps : [];
  var actionSteps = steps.filter(function (step) {
    return !/^(study|read|review|use the checklist|verify|compare your (?:response|thinking))/i.test(
      String(step.text || "").trim()
    );
  });

  var primary = actionSteps.length ? actionSteps[actionSteps.length - 1] : steps[steps.length - 1];
  var primaryText = String((primary && primary.text) || taskText).trim();

  if (/classification table|classify/i.test(taskText) || materialTypes.indexOf("classification_table") >= 0) {
    return "Fill genome or category values into a fixed classification table structure.";
  }
  if (/planning table|plan an|planning/i.test(taskText) || materialTypes.indexOf("planning_table") >= 0) {
    return "Complete a planning table with actions and rationales in authored row order.";
  }
  if (/decision table|judgement|judgment|evaluate|recommend/i.test(taskText)) {
    if (materialTypes.indexOf("decision_table") >= 0) {
      return "Complete a decision table and produce an evidence-based judgement.";
    }
  }
  if (/comparison|compare/i.test(taskText) && materialTypes.indexOf("comparison_table") >= 0) {
    return "Compare alternatives across fixed criteria in a comparison table.";
  }
  if (/analysis table|analyse|analyze/i.test(taskText) && materialTypes.indexOf("analysis_table") >= 0) {
    return "Complete an analysis table linking observations to evidence-based conclusions.";
  }
  if (/prompt set|each stage|chain of effects/i.test(primaryText)) {
    return "Explain multiple linked stages or prompts in an extended written response.";
  }
  if (/written judgement|recommendation|defending your reasoning/i.test(taskText)) {
    return "Write an evidence-based judgement or recommendation with justification.";
  }
  if (/Write a brief (?:explanation|summary)/i.test(taskText)) {
    return "Write a brief explanatory summary in the learner's own words.";
  }
  if (/transfer|apply.*elsewhere/i.test(taskText + " " + expected)) {
    return "Apply evaluation or analysis criteria to a transfer scenario.";
  }
  if (/reflect/i.test(taskText)) {
    return "Reflect on reasoning or criteria after completing structured work.";
  }
  if (/complete the .*table/i.test(primaryText)) {
    return "Complete blank cells in a structured table scaffold.";
  }
  if (/Write\b/i.test(primaryText)) {
    return "Produce a written learner response to the task instruction.";
  }

  if (expected) {
    return "Produce output matching: " + expected.slice(0, 120) + (expected.length > 120 ? "…" : "");
  }

  return "Engage with authored materials and verification steps as instructed.";
}

function detectOrderingEvidence(sourceActivity, taskSteps) {
  var normalizeOrdering = require("./normalize-ordering");
  var normalized = normalizeOrdering.normalizeOrderingSemantics(sourceActivity, {
    activityId: String((sourceActivity && sourceActivity.activity_id) || "")
  });

  var combined = [
    String((sourceActivity && sourceActivity.learner_task) || ""),
    String((sourceActivity && sourceActivity.expected_output) || ""),
    String((sourceActivity && sourceActivity.transfer_or_application_task) || "")
  ].join("\n");

  (Array.isArray(taskSteps) ? taskSteps : []).forEach(function (step) {
    combined += "\n" + String(step.text || "");
  });

  var explicit = EXPLICIT_REORDER_RE.test(combined);
  var evidence = ORDERING_EVIDENCE_RE.test(combined);
  var authoredOrderFixed =
    /complete the .*table|sequenced actions|in order|trace .+ in order|causal order|step-by-step|process walkthrough/i.test(
      combined
    ) && !explicit;

  var mustLearnerReorder = normalized.ok === true || (explicit && !authoredOrderFixed);
  var orderingJustified = normalized.ok === true;

  return {
    evidence: evidence ? combined.match(ORDERING_EVIDENCE_RE)[0] : null,
    explicitReorderLanguage: explicit,
    authoredOrderAlreadyFixed: authoredOrderFixed && !normalized.ok,
    mustLearnerReorder: mustLearnerReorder,
    orderingJustified: orderingJustified,
    implemented: normalized.ok === true
  };
}

function detectClassificationPattern(sourceActivity, materialTypes, learnerAction) {
  var isClassification =
    materialTypes.indexOf("classification_table") >= 0 ||
    /\bclassif/i.test(String((sourceActivity && sourceActivity.learner_task) || ""));

  return {
    isClassificationActivity: isClassification,
    fixedCategories: isClassification,
    fixedItems: isClassification,
    learnerAction: learnerAction,
    currentSurfaceAdequate: isClassification
  };
}

function countAuthoredResponseParts(doMoment, checkMoment, sourceActivity) {
  var promptItemCount = 0;
  var templateSectionCount = 0;
  var transferRequired = false;
  var reflectionRequired = false;

  [doMoment, checkMoment].forEach(function (moment) {
    if (!moment) return;
    (Array.isArray(moment.items) ? moment.items : []).forEach(function (item) {
      if (!item || item.kind !== "material" || !item.material) return;
      var material = item.material;
      var type = String(material.type || "");
      if (type === "prompt_set") {
        promptItemCount += parsePromptSetItems(material.body).length;
      }
      if (type === "template") {
        templateSectionCount += parseTemplateSections(material.body).length;
      }
      if (type === "transfer_prompt") transferRequired = true;
    });
    (Array.isArray(moment.items) ? moment.items : []).forEach(function (item) {
      if (!item || item.kind !== "prompt" || !item.prompt) return;
      var field = String(item.prompt.sourceField || "");
      if (field === "transfer_or_application_task") transferRequired = true;
      if (/reflect/i.test(field) || /reflect/i.test(String(item.prompt.text || ""))) {
        reflectionRequired = true;
      }
    });
  });

  var taskSteps = []
    .concat(Array.isArray(doMoment && doMoment.taskSteps) ? doMoment.taskSteps : [])
    .concat(Array.isArray(checkMoment && checkMoment.checkingSteps) ? checkMoment.checkingSteps : []);

  var hasTableWorkspace = [doMoment, checkMoment].some(function (moment) {
    return (
      moment &&
      (Array.isArray(moment.items) ? moment.items : []).some(function (item) {
        return item && item.tableWorkspace;
      })
    );
  });

  var writtenTaskStepCount = taskSteps.filter(function (step) {
    return isWrittenTaskStep(step.text, {
      hasPromptSetParts: promptItemCount > 0,
      hasTemplateParts: templateSectionCount > 0,
      hasTableWorkspace: hasTableWorkspace
    });
  }).length;

  if (
    String((sourceActivity && sourceActivity.transfer_or_application_task) || "").trim()
  ) {
    transferRequired = true;
  }

  return {
    promptItemCount: promptItemCount,
    templateSectionCount: templateSectionCount,
    transferRequired: transferRequired,
    reflectionRequired: reflectionRequired,
    writtenTaskStepCount: writtenTaskStepCount
  };
}

function detectMultiPartGap(sourceActivity, doMoment, checkMoment, surfaceInfo) {
  var authored = countAuthoredResponseParts(doMoment, checkMoment, sourceActivity);
  var textWorkspaceCount = surfaceInfo.textWorkspaces.length;
  var gaps = [];

  if (authored.promptItemCount > 1 && textWorkspaceCount < authored.promptItemCount) {
    gaps.push({
      kind: "compose_existing",
      detail:
        "Multiple prompt-set items share fewer text_entry workspaces than authored prompts; compose multiple text_entry fields instead of a new surface type.",
      promptCount: authored.promptItemCount,
      workspaceCount: textWorkspaceCount
    });
  }

  if (authored.templateSectionCount > 0 && textWorkspaceCount < authored.templateSectionCount) {
    gaps.push({
      kind: "compose_existing",
      detail:
        "Structured template sections lack matching text_entry workspaces; multiple labelled text_entry fields would improve fidelity.",
      sectionCount: authored.templateSectionCount,
      workspaceCount: textWorkspaceCount
    });
  }

  var transferWorkspaces = surfaceInfo.textWorkspaces.filter(function (workspace) {
    return (
      workspace.sourceKind === "transfer_prompt" ||
      /transfer/i.test(String(workspace.responseLabel || ""))
    );
  }).length;

  if (authored.transferRequired && !transferWorkspaces) {
    gaps.push({
      kind: "compose_existing",
      detail:
        "Transfer task is presented without a text_entry workspace; learner must use external notes.",
      field: "transfer_or_application_task"
    });
  }

  var reflectionWorkspaces = surfaceInfo.textWorkspaces.filter(function (workspace) {
    return (
      workspace.sourceKind === "reflection_prompt" ||
      /reflect/i.test(String(workspace.responseLabel || ""))
    );
  }).length;

  if (authored.reflectionRequired && !reflectionWorkspaces) {
    gaps.push({
      kind: "compose_existing",
      detail:
        "Reflection task is presented without a text_entry workspace; learner must use external notes.",
      field: "reflection"
    });
  }

  return gaps;
}

function inferValidationRequirement(sourceActivity, ordering) {
  var expected = String((sourceActivity && sourceActivity.expected_output) || "");
  if (ordering.orderingJustified) return "ordering_validation";
  if (/checklist|verify|revise/i.test(String(sourceActivity.learner_task || ""))) {
    return "presence_or_completion_checking";
  }
  if (/judgement|recommend|defend|justify|evidence-based/i.test(expected)) {
    return "free_response_with_rubric_guidance";
  }
  if (/table|completed/i.test(expected)) {
    return "free_response_only";
  }
  return "free_response_only";
}

function inferLifecycleNeeds(sourceActivity) {
  return {
    localDraftPersistence: true,
    localDraftPersistenceStatus: "implemented",
    crossPageRestoration: true,
    crossPageRestorationStatus: "implemented_same_page_identity",
    submission: false,
    submissionStatus: "not_implemented",
    export: true,
    teacherReview: false,
    teacherReviewStatus: "not_implemented",
    remoteSynchronisation: false,
    remoteSynchronisationStatus: "not_implemented",
    note:
      "Local draft persistence and same-page restoration are implemented for text_entry, table_entry, and ordering. Submission, teacher review, and remote synchronisation are not implemented."
  };
}

function classifyAdequacy(ctx) {
  if (ctx.ordering.orderingJustified) {
    if (ctx.surfaceInfo.surfaces.indexOf("ordering") >= 0) {
      return {
        adequacy: ADEQUACY.FULLY_SUPPORTED,
        evidence:
          "Genuine ordering interaction is represented by the ordering learner surface.",
        candidateCapability: null,
        recommendation: "retain"
      };
    }
    return {
      adequacy: ADEQUACY.MISSING,
      evidence:
        "Task requires learner reordering; neither text_entry nor table_entry supports manipulation of relative order.",
      candidateCapability: "ordering",
      recommendation: "defer"
    };
  }

  if (ctx.multiPartGaps.length) {
    var composeOnly = ctx.multiPartGaps.every(function (gap) {
      return gap.kind === "compose_existing";
    });
    if (composeOnly) {
      return {
        adequacy: ADEQUACY.IMPERFECT,
        evidence: ctx.multiPartGaps.map(function (gap) {
          return gap.detail;
        }).join(" "),
        candidateCapability: "compose_from_existing_surfaces",
        recommendation: "refine current surface"
      };
    }
    return {
      adequacy: ADEQUACY.MISSING,
      evidence: ctx.multiPartGaps[0].detail,
      candidateCapability: "multi-part response",
      recommendation: "prototype"
    };
  }

  if (!ctx.surfaceInfo.surfaces.length) {
    var studyOnly = /^(study|read|review|use the checklist|verify)/i.test(ctx.learnerAction);
    if (studyOnly) {
      return {
        adequacy: ADEQUACY.FULLY_SUPPORTED,
        evidence: "Activity is study-and-verify only; no learner workspace is required.",
        candidateCapability: null,
        recommendation: "retain"
      };
    }
  }

  return {
    adequacy: ADEQUACY.FULLY_SUPPORTED,
    evidence: "Current " + (ctx.surfaceInfo.surfaces.join(" + ") || "presentation") +
      " supports the inferred learner action without structural loss.",
    candidateCapability: null,
    recommendation: "retain"
  };
}

function auditActivityEntry(options) {
  var repoRoot = options.repoRoot;
  var corpus = options.corpus;
  var sourcePage = options.sourcePage;
  var sourceActivity = options.sourceActivity;
  var modelActivity = options.modelActivity;

  var activityId = String(modelActivity.id || "");
  var taskSteps = parseLearnerTask(sourceActivity.learner_task || "");
  var materialTypes = materialTypesFromModel(modelActivity);
  var doMoment = composeActivityMoments.composeDoMoment(modelActivity);
  var checkMoment = composeActivityMoments.composeCheckMoment(modelActivity);
  var surfaceInfo = extractSurfacesFromMoments(doMoment, checkMoment);
  var learnerAction = inferLearnerAction(sourceActivity, taskSteps, materialTypes);
  var ordering = detectOrderingEvidence(sourceActivity, taskSteps);
  var classification = detectClassificationPattern(sourceActivity, materialTypes, learnerAction);
  var multiPartGaps = detectMultiPartGap(sourceActivity, doMoment, checkMoment, surfaceInfo);
  var adequacyResult = classifyAdequacy({
    ordering: ordering,
    multiPartGaps: multiPartGaps,
    surfaceInfo: surfaceInfo,
    learnerAction: learnerAction
  });

  var checkMechanism = [];
  if (checkMoment) {
    (checkMoment.items || []).forEach(function (item) {
      if (item.kind === "material" && item.material) {
        checkMechanism.push(item.material.type);
      }
      if (item.kind === "prompt") checkMechanism.push("prompt:" + item.prompt.sourceField);
    });
  }

  return {
    workflowId: corpus.workflowId || corpus.id,
    fixtureId: corpus.id,
    activityId: activityId,
    title: String(modelActivity.title || sourceActivity.title || "").trim(),
    cognitiveLevel: archetypeFromSource(sourceActivity),
    beatSequence: beatSequenceFromSource(sourceActivity),
    learnerAction: learnerAction,
    expectedOutput: String(sourceActivity.expected_output || "").trim(),
    materialTypes: materialTypes,
    currentSurface: surfaceInfo.surfaces.length ? surfaceInfo.surfaces : ["none"],
    responseShape: responseShapeSummary(surfaceInfo),
    adequacy: adequacyResult.adequacy,
    evidence: adequacyResult.evidence,
    candidateCapability: adequacyResult.candidateCapability,
    recommendation: adequacyResult.recommendation,
    orderingAudit: ordering,
    classificationAudit: classification,
    multiPartGaps: multiPartGaps,
    validationRequirement: inferValidationRequirement(sourceActivity, ordering),
    lifecycleNeeds: inferLifecycleNeeds(sourceActivity),
    checkMechanism: checkMechanism,
    doStepCount: doMoment ? (doMoment.taskSteps || []).length : 0,
    hasDoMoment: Boolean(doMoment)
  };
}

function auditWorkflow(repoRoot, corpusEntry) {
  var sourcePage = readJsonFromRepo(repoRoot, corpusEntry.fixturePath);
  var modelResult = buildPageModel(sourcePage);
  if (!modelResult.ok) {
    throw new Error(
      "Cannot audit " +
        corpusEntry.id +
        ": page model failed — " +
        (modelResult.errors && modelResult.errors[0] && modelResult.errors[0].message)
    );
  }

  var sourceById = sourceActivityMap(sourcePage);
  var records = [];

  (modelResult.model.activities || []).forEach(function (modelActivity) {
    var activityId = String(modelActivity.id || "");
    var sourceActivity = sourceById[activityId];
    if (!sourceActivity) {
      throw new Error("Missing source activity " + activityId + " in " + corpusEntry.fixturePath);
    }
    records.push(
      auditActivityEntry({
        repoRoot: repoRoot,
        corpus: corpusEntry,
        sourcePage: sourcePage,
        sourceActivity: sourceActivity,
        modelActivity: modelActivity
      })
    );
  });

  return {
    corpus: corpusEntry,
    sourcePageTitle: String(sourcePage.title || "").trim(),
    activityCount: records.length,
    records: records,
    assessmentItems: collectAssessmentItems(sourcePage).map(function (item) {
      return {
        itemId: String(item.item_id || ""),
        itemType: String(item.item_type || ""),
        interaction: "assessment_selection",
        note: "Formative assessment MCQ — not a learner workspace surface gap."
      };
    })
  };
}

function tally(records, key) {
  var counts = Object.create(null);
  records.forEach(function (record) {
    var value = record[key];
    if (Array.isArray(value)) {
      if (!value.length) {
        counts.none = (counts.none || 0) + 1;
        return;
      }
      value.forEach(function (entry) {
        counts[entry] = (counts[entry] || 0) + 1;
      });
      return;
    }
    counts[value] = (counts[value] || 0) + 1;
  });
  return counts;
}

function activitySurfaceUsage(records) {
  var usage = {
    text_entry: 0,
    table_entry: 0,
    ordering: 0,
    no_learner_workspace: 0
  };
  records.forEach(function (record) {
    var surfaces = (record.currentSurface || []).filter(function (surface) {
      return surface !== "none";
    });
    if (!surfaces.length) {
      usage.no_learner_workspace += 1;
      return;
    }
    if (surfaces.indexOf("text_entry") >= 0) usage.text_entry += 1;
    if (surfaces.indexOf("table_entry") >= 0) usage.table_entry += 1;
    if (surfaces.indexOf("ordering") >= 0) usage.ordering += 1;
  });
  return usage;
}

function buildCapabilityMatrix(allRecords) {
  var matrix = [
    {
      capability: "text_entry",
      currentStatus: "implemented",
      evidenceCount: 0,
      representativeActivities: [],
      recommendation: "retain"
    },
    {
      capability: "table_entry",
      currentStatus: "implemented",
      evidenceCount: 0,
      representativeActivities: [],
      recommendation: "retain"
    },
    {
      capability: "ordering",
      currentStatus: "implemented",
      evidenceCount: 0,
      representativeActivities: [],
      recommendation: "retain"
    },
    {
      capability: "single_select",
      currentStatus: "assessment-only",
      evidenceCount: 0,
      representativeActivities: [],
      recommendation: "retain assessment separation"
    },
    {
      capability: "multi_select",
      currentStatus: "not implemented",
      evidenceCount: 0,
      representativeActivities: [],
      recommendation: "not justified"
    },
    {
      capability: "matching",
      currentStatus: "not implemented",
      evidenceCount: 0,
      representativeActivities: [],
      recommendation: "not justified"
    },
    {
      capability: "categorisation",
      currentStatus: "represented by table_entry",
      evidenceCount: 0,
      representativeActivities: [],
      recommendation: "compose from existing surfaces"
    },
    {
      capability: "multi-part response",
      currentStatus: "implemented via text_entry composition",
      evidenceCount: 0,
      representativeActivities: [],
      recommendation: "retain"
    }
  ];

  allRecords.forEach(function (record) {
    var key = record.fixtureId + "/" + record.activityId;
    (record.currentSurface || []).forEach(function (surface) {
      if (surface === "none") return;
      var row = matrix.find(function (entry) {
        return entry.capability === surface;
      });
      if (row) {
        row.evidenceCount += 1;
        if (row.representativeActivities.length < 4) row.representativeActivities.push(key);
      }
    });

    if (record.orderingAudit && record.orderingAudit.orderingJustified) {
      var orderingRow = matrix.find(function (entry) {
        return entry.capability === "ordering";
      });
      if ((record.currentSurface || []).indexOf("ordering") < 0) {
        orderingRow.evidenceCount += 1;
      }
      if (orderingRow.representativeActivities.indexOf(key) < 0) {
        orderingRow.representativeActivities.push(key);
      }
      orderingRow.currentStatus = "implemented";
      orderingRow.recommendation = "retain";
    }

    if (record.classificationAudit && record.classificationAudit.isClassificationActivity) {
      var catRow = matrix.find(function (entry) {
        return entry.capability === "categorisation";
      });
      catRow.evidenceCount += 1;
      if (catRow.representativeActivities.indexOf(key) < 0) {
        catRow.representativeActivities.push(key);
      }
    }

    if (record.multiPartGaps && record.multiPartGaps.length) {
      var mpRow = matrix.find(function (entry) {
        return entry.capability === "multi-part response";
      });
      mpRow.evidenceCount += 1;
      if (mpRow.representativeActivities.indexOf(key) < 0) {
        mpRow.representativeActivities.push(key);
      }
    }
  });

  return matrix;
}

function recommendNextImplementation(allRecords, matrix) {
  var missing = allRecords.filter(function (record) {
    return record.adequacy === ADEQUACY.MISSING;
  });
  if (missing.length) {
    var top = missing[0];
    return {
      justified: true,
      capability: top.candidateCapability,
      affectedActivities: missing.length,
      examples: missing.slice(0, 3).map(function (record) {
        return record.fixtureId + "/" + record.activityId + ": " + record.title;
      }),
      whyInadequate: top.evidence,
      genericInteractionModel: "Learner reorders authored items where ordering is the learning objective.",
      validationModel: "Ordered sequence comparison against rubric exemplar.",
      accessibility:
        "Keyboard-operable reorder controls with aria-posinset and live-region announcements.",
      prioritisation: "Only if explicit reorder evidence accumulates across workflows."
    };
  }

  var imperfect = allRecords.filter(function (record) {
    return record.adequacy === ADEQUACY.IMPERFECT;
  });

  return {
    justified: false,
    statement:
      "No new learner surface is currently justified. Ordering is implemented where authoritative sequencing or ranking activities are present. Fixed authored sequences remain distinct from learner ordering interactions.",
    refinement:
      "Continue composing text_entry and ordering workspaces from authoritative response-part semantics.",
    affectedActivities: imperfect.length,
    examples: imperfect.slice(0, 4).map(function (record) {
      return record.fixtureId + "/" + record.activityId;
    }),
    imperfectEvidence: imperfect.map(function (record) {
      return { activity: record.fixtureId + "/" + record.activityId, evidence: record.evidence };
    })
  };
}

function formatAuditReport(result) {
  var lines = [];
  lines.push("# Learner Surface Audit (S68-IMP-016)");
  lines.push("");
  lines.push("## Corpus");
  lines.push("");
  lines.push("| Workflow or fixture | Provenance | Activities | Why included |");
  lines.push("| ------------------- | ---------- | ---------: | ------------ |");
  result.workflows.forEach(function (workflow) {
    lines.push(
      "| " +
        workflow.corpus.id +
        " | " +
        workflow.corpus.provenance +
        " | " +
        workflow.activityCount +
        " | " +
        workflow.corpus.whyIncluded +
        " |"
    );
  });

  lines.push("");
  lines.push("## Adequacy totals");
  lines.push("");
  Object.keys(result.adequacyTotals).forEach(function (key) {
    lines.push("- " + key + ": " + result.adequacyTotals[key]);
  });

  lines.push("");
  lines.push("## Current surface usage");
  lines.push("");
  Object.keys(result.surfaceTotals).forEach(function (key) {
    lines.push("- " + key + ": " + result.surfaceTotals[key]);
  });

  lines.push("");
  lines.push("## Highest-priority gap");
  lines.push("");
  if (result.recommendation.justified) {
    lines.push("Capability: **" + result.recommendation.capability + "**");
  } else {
    lines.push(result.recommendation.statement);
    lines.push("");
    lines.push("Refinement: " + result.recommendation.refinement);
  }

  return lines.join("\n");
}

/**
 * Run the learner-surface audit across the configured corpus.
 *
 * @param {{ repoRoot?: string, corpus?: typeof AUDIT_CORPUS }} [options]
 * @returns {Object}
 */
function runLearnerSurfaceAudit(options) {
  var opts = options && typeof options === "object" ? options : {};
  var repoRoot = opts.repoRoot || path.resolve(__dirname, "..", "..");
  var corpus = Array.isArray(opts.corpus) && opts.corpus.length ? opts.corpus : AUDIT_CORPUS;

  var workflows = corpus.map(function (entry) {
    return auditWorkflow(repoRoot, entry);
  });

  var allRecords = [];
  workflows.forEach(function (workflow) {
    allRecords = allRecords.concat(workflow.records);
  });

  var adequacyTotals = tally(allRecords, "adequacy");
  var surfaceTotals = tally(allRecords, "currentSurface");
  var activitySurfaceUsageTotals = activitySurfaceUsage(allRecords);
  var capabilityMatrix = buildCapabilityMatrix(allRecords);
  var recommendation = recommendNextImplementation(allRecords, capabilityMatrix);

  return {
    generatedAt: new Date().toISOString(),
    corpus: corpus,
    workflows: workflows,
    records: allRecords,
    adequacyTotals: adequacyTotals,
    surfaceTotals: surfaceTotals,
    activitySurfaceUsage: activitySurfaceUsageTotals,
    capabilityMatrix: capabilityMatrix,
    recommendation: recommendation,
    orderingCandidates: allRecords.map(function (record) {
      return {
        activity: record.fixtureId + "/" + record.activityId,
        evidence: record.orderingAudit.evidence,
        authoredOrderAlreadyFixed: record.orderingAudit.authoredOrderAlreadyFixed,
        mustLearnerReorder: record.orderingAudit.mustLearnerReorder,
        orderingJustified: record.orderingAudit.orderingJustified
      };
    }),
    classificationAudit: allRecords
      .filter(function (record) {
        return record.classificationAudit.isClassificationActivity;
      })
      .map(function (record) {
        return {
          activity: record.fixtureId + "/" + record.activityId,
          fixedCategories: record.classificationAudit.fixedCategories,
          fixedItems: record.classificationAudit.fixedItems,
          learnerAction: record.classificationAudit.learnerAction,
          currentSurfaceAdequate: record.classificationAudit.currentSurfaceAdequate
        };
      }),
    markdown: formatAuditReport({
      workflows: workflows,
      adequacyTotals: adequacyTotals,
      surfaceTotals: surfaceTotals,
      recommendation: recommendation
    })
  };
}

module.exports = {
  ADEQUACY: ADEQUACY,
  AUDIT_CORPUS: AUDIT_CORPUS,
  ORDERING_EVIDENCE_RE: ORDERING_EVIDENCE_RE,
  EXPLICIT_REORDER_RE: EXPLICIT_REORDER_RE,
  runLearnerSurfaceAudit: runLearnerSurfaceAudit,
  auditActivityEntry: auditActivityEntry,
  inferLearnerAction: inferLearnerAction,
  detectOrderingEvidence: detectOrderingEvidence,
  detectMultiPartGap: detectMultiPartGap,
  extractSurfacesFromMoments: extractSurfacesFromMoments,
  countAuthoredResponseParts: countAuthoredResponseParts,
  buildCapabilityMatrix: buildCapabilityMatrix,
  recommendNextImplementation: recommendNextImplementation,
  formatAuditReport: formatAuditReport
};
