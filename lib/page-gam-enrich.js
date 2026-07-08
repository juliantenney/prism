/**
 * Sprint 56F Phase 4 — GAM enrich-in-place for vNext page artefacts.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "object" || !module.exports) {
    if (typeof root !== "undefined") {
      root.PRISM_PAGE_GAM_ENRICH = api;
    }
    return;
  }
  module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var ENRICH_VERSION = "56F-GAM-ENRICH-1";
  var SCHEMA_VERSION = "2.0.0";
  var BODY_FORMAT = "markdown";

  var GAM_DLA_OWNED_STRING_FIELDS = [
    "learner_task",
    "expected_output",
    "activity_preamble",
    "reasoning_orientation",
    "self_explanation_prompt",
    "evidence_use_prompt",
    "argument_structure_hint",
    "conceptual_contrast_prompt",
    "disciplinary_lens",
    "transfer_or_application_task",
    "uncertainty_tension_prompt",
    "prior_knowledge_activation",
    "study_orientation",
    "intellectual_frame",
    "intellectual_coherence_bridge",
    "support_note"
  ];

  var GAM_DLA_OWNED_JSON_FIELDS = [
    "scaffold_hint_sequence",
    "required_materials",
    "learning_outcome_ids",
    "episode_plan"
  ];

  var GAM_PRESERVED_TOP_LEVEL_KEYS = [
    "artifact_type",
    "schema_version",
    "title",
    "audience",
    "page_profile",
    "learning_outcomes",
    "episode_plans"
  ];

  function deepClone(value) {
    if (value == null || typeof value !== "object") return value;
    if (Array.isArray(value)) return value.map(deepClone);
    var out = {};
    Object.keys(value).forEach(function (key) {
      out[key] = deepClone(value[key]);
    });
    return out;
  }

  function nonEmptyString(value, fallback) {
    var text = String(value == null ? "" : value).trim();
    return text || fallback;
  }

  function hasNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
  }

  function normalizeMaterialType(required) {
    return nonEmptyString(
      required.material_type || required.type || required.materialType,
      "text"
    );
  }

  function humanizeMaterialType(type) {
    return String(type || "material")
      .replace(/_/g, " ")
      .replace(/\b\w/g, function (ch) {
        return ch.toUpperCase();
      });
  }

  function titleFromRequired(required) {
    var purpose = nonEmptyString(required.purpose || required.specification, "");
    if (purpose) {
      var trimmed = purpose.replace(/\.$/, "");
      return trimmed.length > 96 ? trimmed.slice(0, 93) + "..." : trimmed;
    }
    return humanizeMaterialType(normalizeMaterialType(required));
  }

  function bodyForTextMaterial(required, activity, loStatement) {
    var purpose = nonEmptyString(required.purpose || required.specification, loStatement);
    return (
      "## " +
      titleFromRequired(required) +
      "\n\n" +
      purpose +
      "\n\n### What to notice\n\n" +
      "- Connect the ideas to **" +
      loStatement +
      "**.\n" +
      "- Use evidence from this material when completing **" +
      nonEmptyString(activity.learner_task, "the activity task") +
      "**."
    );
  }

  function bodyForWorkedExample(required, activity, loStatement) {
    return (
      "## Worked example\n\n" +
      "This worked example models expert reasoning for: " +
      loStatement +
      ".\n\n" +
      "### Step 1 — Orient\n\n" +
      nonEmptyString(required.purpose, "Identify what the example is demonstrating.") +
      "\n\n" +
      "### Step 2 — Reasoning walkthrough\n\n" +
      "1. State the claim.\n" +
      "2. Cite supporting evidence.\n" +
      "3. Explain the mechanism linking evidence to the claim.\n\n" +
      "### Step 3 — Compare with your attempt\n\n" +
      "Before independent practice, explain one difference between the model reasoning and your first attempt."
    );
  }

  function bodyForModellingNote(required, activity, loStatement) {
    return (
      "## Modelling note\n\n" +
      "Expert reasoning orientation for **" +
      activity.title +
      "**:\n\n" +
      nonEmptyString(required.purpose, "Walk through how an expert approaches " + loStatement + ".") +
      "\n\n" +
      "> Think aloud: name the criterion, select evidence, and justify the inference before drafting your response."
    );
  }

  function bodyForChecklist(required) {
    return (
      "## Self-check checklist\n\n" +
      nonEmptyString(required.purpose, "Verify your response before submitting.") +
      "\n\n" +
      "- [ ] My response addresses the activity task directly.\n" +
      "- [ ] I cited specific evidence from the teaching materials.\n" +
      "- [ ] My reasoning explains how evidence supports the claim.\n" +
      "- [ ] I identified one limitation or uncertainty in my answer."
    );
  }

  function bodyForScenario(required) {
    return (
      "## Scenario\n\n" +
      nonEmptyString(required.purpose, "Use these cases to ground your analysis.") +
      "\n\n" +
      "### Case A\n\n" +
      "A realistic context with specific names, figures, and constraints that require judgement.\n\n" +
      "### Case B\n\n" +
      "A contrasting context that tests the same concept under different conditions."
    );
  }

  function bodyForTable(required) {
    return (
      "## Analysis framework\n\n" +
      nonEmptyString(required.purpose, "Complete the table using evidence from the activity.") +
      "\n\n" +
      "| Factor | Evidence | Your interpretation |\n" +
      "| --- | --- | --- |\n" +
      "| Example row | Modelled evidence | *Learner completes* |\n" +
      "|  |  |  |\n" +
      "|  |  |  |"
    );
  }

  function bodyForTransfer(required, loStatement) {
    return (
      "## Transfer task\n\n" +
      nonEmptyString(
        required.purpose,
        "Apply what you learned about " + loStatement + " to a new context."
      ) +
      "\n\n" +
      "1. Choose a context different from the teaching examples.\n" +
      "2. Explain which ideas transfer and which need adjustment.\n" +
      "3. Submit a short justification referencing criteria from the activity."
    );
  }

  function bodyForConsolidation(required, activity) {
    return (
      "## Activity recap\n\n" +
      nonEmptyString(required.purpose, "Consolidate the key ideas from this activity.") +
      "\n\n" +
      "Reflect on **" +
      activity.title +
      "**:\n\n" +
      "- What is the most important idea to remember?\n" +
      "- What evidence best supports your conclusion?\n" +
      "- What would you revise if you repeated the task?"
    );
  }

  function bodyForMaterial(required, activity, loStatement) {
    var type = normalizeMaterialType(required).toLowerCase();
    if (type === "worked_example" || type === "sample_output") {
      return bodyForWorkedExample(required, activity, loStatement);
    }
    if (type === "modelling_note") return bodyForModellingNote(required, activity, loStatement);
    if (type === "checklist" || type === "rubric") return bodyForChecklist(required);
    if (type === "scenario") return bodyForScenario(required);
    if (
      type.indexOf("table") !== -1 ||
      type === "template" ||
      type === "task_cards" ||
      type === "prompt_set"
    ) {
      return bodyForTable(required);
    }
    if (type === "transfer_prompt") return bodyForTransfer(required, loStatement);
    if (type === "consolidation_summary") return bodyForConsolidation(required, activity);
    return bodyForTextMaterial(required, activity, loStatement);
  }

  function buildMaterialFromRequired(required, activity, loStatement) {
    var materialId = nonEmptyString(required.material_id, "");
    if (!materialId) {
      throw new Error("buildMaterialFromRequired: material_id required");
    }
    var materialType = normalizeMaterialType(required);
    return {
      material_id: materialId,
      material_type: materialType,
      title: titleFromRequired(required),
      body: bodyForMaterial(required, activity, loStatement),
      body_format: BODY_FORMAT
    };
  }

  function resolveLoStatementForActivity(activity, loIndex) {
    var ids = Array.isArray(activity.learning_outcome_ids)
      ? activity.learning_outcome_ids
      : [];
    var i;
    for (i = 0; i < ids.length; i += 1) {
      var lo = loIndex[ids[i]];
      if (!lo) continue;
      var statement = nonEmptyString(lo.statement || lo.text || lo.description, "");
      if (statement) return statement;
    }
    return nonEmptyString(activity.title, "the learning outcome");
  }

  function learningOutcomesIndex(page) {
    var map = {};
    var rows = Array.isArray(page && page.learning_outcomes) ? page.learning_outcomes : [];
    rows.forEach(function (row, index) {
      if (typeof row === "string") {
        map["LO" + (index + 1)] = { outcome_id: "LO" + (index + 1), statement: row };
        return;
      }
      if (!row || typeof row !== "object") return;
      var id = nonEmptyString(row.outcome_id || row.id, "LO" + (index + 1));
      map[id] = row;
    });
    return map;
  }

  function snapshotActivityWithoutMaterials(activity) {
    var snap = deepClone(activity || {});
    delete snap.materials;
    return snap;
  }

  function activitiesMatchExceptMaterials(before, after) {
    var left = JSON.stringify(snapshotActivityWithoutMaterials(before));
    var right = JSON.stringify(snapshotActivityWithoutMaterials(after));
    return left === right;
  }

  function findBaselineActivityIdForMaterialId(baseline, materialId) {
    var mid = String(materialId || "").trim();
    if (!mid || !baseline || !Array.isArray(baseline.activities)) return "";
    var i;
    for (i = 0; i < baseline.activities.length; i += 1) {
      var activity = baseline.activities[i];
      var required = Array.isArray(activity.required_materials) ? activity.required_materials : [];
      var j;
      for (j = 0; j < required.length; j += 1) {
        if (String(required[j].material_id || "") === mid) {
          return String(activity.activity_id || "");
        }
      }
    }
    return "";
  }

  function isGamActivitySkeleton(activity) {
    if (!activity || typeof activity !== "object") return true;
    if (!hasNonEmptyString(activity.title)) return true;
    if (!hasNonEmptyString(activity.learner_task)) return true;
    if (!hasNonEmptyString(activity.expected_output)) return true;
    if (!hasNonEmptyString(activity.activity_preamble)) return true;
    if (!Array.isArray(activity.required_materials) || !activity.required_materials.length) return true;
    if (!activity.episode_plan || typeof activity.episode_plan !== "object") return true;
    return false;
  }

  function mergeMaterialsFromCaptureOntoBaseline(baseline, capturePage) {
    if (!baseline || !capturePage) return null;
    var out = deepClone(baseline);
    var baselineActivityIds = {};
    (baseline.activities || []).forEach(function (activity) {
      if (activity && activity.activity_id) {
        baselineActivityIds[String(activity.activity_id)] = true;
      }
    });
    var captureActivities = Array.isArray(capturePage.activities) ? capturePage.activities : [];
    var captureIdsMatchBaseline =
      !captureActivities.length ||
      captureActivities.every(function (activity) {
        var id = String((activity && activity.activity_id) || "");
        return !id || baselineActivityIds[id];
      });
    var materialsByBaselineActivityId = {};

    if (captureIdsMatchBaseline) {
      var captureById = {};
      captureActivities.forEach(function (activity) {
        if (activity && activity.activity_id) {
          captureById[String(activity.activity_id)] = activity;
        }
      });
      out.activities = out.activities.map(function (activity) {
        var merged = deepClone(activity);
        var incoming = captureById[String(activity.activity_id || "")];
        if (incoming && Array.isArray(incoming.materials)) {
          merged.materials = incoming.materials.map(deepClone);
        } else {
          merged.materials = [];
        }
        return merged;
      });
      return out;
    }

    captureActivities.forEach(function (captureActivity) {
      (captureActivity.materials || []).forEach(function (material) {
        var targetId = findBaselineActivityIdForMaterialId(baseline, material.material_id);
        if (!targetId) return;
        materialsByBaselineActivityId[targetId] = materialsByBaselineActivityId[targetId] || [];
        materialsByBaselineActivityId[targetId].push(deepClone(material));
      });
    });
    if (!Object.keys(materialsByBaselineActivityId).length) {
      return null;
    }
    out.activities = out.activities.map(function (activity) {
      var merged = deepClone(activity);
      merged.materials = materialsByBaselineActivityId[String(activity.activity_id || "")] || [];
      return merged;
    });
    return out;
  }

  function restoreGamBaselinePreservation(baseline, page) {
    if (!baseline) return null;
    return mergeMaterialsFromCaptureOntoBaseline(baseline, page || { activities: [] });
  }

  function activityFieldDriftMessage(index, field, baselineValue, currentValue) {
    if (
      typeof baselineValue === "string" &&
      typeof currentValue === "string" &&
      currentValue.length < baselineValue.length
    ) {
      return (
        "activities[" +
        index +
        "]." +
        field +
        " was shortened at GAM stage (baseline length " +
        baselineValue.length +
        ", got " +
        currentValue.length +
        ")"
      );
    }
    return "activities[" + index + "]." + field + " must match upstream DLA page at GAM stage";
  }

  function validateGamActivityFieldPreservation(baselineActivity, activity, index, errors) {
    if (!baselineActivity || !activity) return;
    var field;
    for (field = 0; field < GAM_DLA_OWNED_STRING_FIELDS.length; field += 1) {
      var fieldName = GAM_DLA_OWNED_STRING_FIELDS[field];
      if (!(fieldName in baselineActivity)) continue;
      var baseVal = baselineActivity[fieldName];
      var curVal = activity[fieldName];
      if (baseVal == null && curVal == null) continue;
      if (String(baseVal) !== String(curVal)) {
        errors.push(activityFieldDriftMessage(index, fieldName, baseVal, curVal));
      }
    }
    for (field = 0; field < GAM_DLA_OWNED_JSON_FIELDS.length; field += 1) {
      var jsonField = GAM_DLA_OWNED_JSON_FIELDS[field];
      if (!(jsonField in baselineActivity)) continue;
      if (JSON.stringify(baselineActivity[jsonField]) !== JSON.stringify(activity[jsonField])) {
        errors.push(
          activityFieldDriftMessage(
            index,
            jsonField,
            JSON.stringify(baselineActivity[jsonField]),
            JSON.stringify(activity[jsonField])
          )
        );
      }
    }
    if (String(baselineActivity.activity_id || "") !== String(activity.activity_id || "")) {
      errors.push("activities[" + index + "].activity_id must match upstream DLA page");
    }
    if (String(baselineActivity.title || "") !== String(activity.title || "")) {
      errors.push("activities[" + index + "].title must match upstream DLA page");
    }
  }

  function enrichActivityWithGam(activity, loStatement, options) {
    if (!activity || typeof activity !== "object") {
      throw new Error("enrichActivityWithGam: activity required");
    }
    var required = Array.isArray(activity.required_materials) ? activity.required_materials : [];
    if (!required.length) {
      throw new Error(
        "enrichActivityWithGam: activities[" +
          nonEmptyString(activity.activity_id, "?") +
          "].required_materials required"
      );
    }
    var enriched = deepClone(activity);
    enriched.materials = required.map(function (row) {
      return buildMaterialFromRequired(row, activity, loStatement);
    });
    return enriched;
  }

  function appendGamSourceArtefact(sourceArtefacts) {
    var rows = Array.isArray(sourceArtefacts) ? sourceArtefacts.slice() : [];
    var hasGam = rows.some(function (row) {
      return row && row.artefact_type === "generate_activity_materials";
    });
    if (!hasGam) {
      rows.push({
        artefact_type: "generate_activity_materials",
        source_label: "Generate Activity Materials",
        role: "materials"
      });
    }
    return rows;
  }

  function buildGamValidationReport(activityCount, materialCount) {
    return {
      activity_coverage: activityCount > 0 ? "gam_enriched" : "none",
      material_coverage: materialCount > 0 ? "authored" : "none",
      episode_plan_attachment: "attached",
      self_containment: "gam_enriched",
      schema_compliance: "gam_boundary",
      known_issues: materialCount > 0 ? [] : ["No materials authored at GAM stage"]
    };
  }

  function finalizeGamPage(page, materialCount, baseline) {
    var out = baseline ? restoreGamBaselinePreservation(baseline, page) : deepClone(page);
    out.page_synthesis = {};
    var priorEnrichedBy = Array.isArray(out.assembly_state && out.assembly_state.enriched_by)
      ? out.assembly_state.enriched_by.slice()
      : ["episode_plan", "dla"];
    if (priorEnrichedBy.indexOf("gam") === -1) priorEnrichedBy.push("gam");
    out.assembly_state = Object.assign({}, out.assembly_state || {}, {
      current_stage: "gam",
      enriched_by: priorEnrichedBy
    });
    out.source_artefacts = appendGamSourceArtefact(out.source_artefacts);
    out.generation_notes = Object.assign({}, out.generation_notes || {}, {
      validation: buildGamValidationReport(
        Array.isArray(out.activities) ? out.activities.length : 0,
        materialCount
      ),
      notes:
        "Sprint 56F GAM page enrichment (" +
        ENRICH_VERSION +
        ") — page_synthesis pending finalise_page"
    });
    return out;
  }

  function enrichPageWithGam(pageInput, options) {
    if (!pageInput || typeof pageInput !== "object" || Array.isArray(pageInput)) {
      throw new Error("enrichPageWithGam: page required");
    }
    if (String(pageInput.artifact_type || "") !== "page") {
      throw new Error('enrichPageWithGam: artifact_type must be "page"');
    }
    if (!Array.isArray(pageInput.activities) || !pageInput.activities.length) {
      throw new Error("enrichPageWithGam: activities[] required");
    }
    var baseline = deepClone(pageInput);
    var out = deepClone(pageInput);
    var loIndex = learningOutcomesIndex(out);
    var materialCount = 0;
    out.activities = out.activities.map(function (activity) {
      var loStatement = resolveLoStatementForActivity(activity, loIndex);
      var enriched = enrichActivityWithGam(activity, loStatement, options || {});
      materialCount += enriched.materials.length;
      return enriched;
    });
    return finalizeGamPage(out, materialCount, baseline);
  }

  function mergeGamMaterialsIntoPage(baseline, capturePage) {
    if (!baseline || !capturePage) return null;
    var out = mergeMaterialsFromCaptureOntoBaseline(baseline, capturePage);
    if (!out) return null;
    var materialCount = 0;
    (out.activities || []).forEach(function (activity) {
      materialCount += Array.isArray(activity.materials) ? activity.materials.length : 0;
    });
    return finalizeGamPage(out, materialCount, baseline);
  }

  function normalizeGamCaptureToPage(baseline, capture) {
    if (!capture || typeof capture !== "object") return null;
    if (!baseline || typeof baseline !== "object" || Array.isArray(baseline)) return null;
    return mergeGamMaterialsIntoPage(baseline, capture);
  }

  function pageSynthesisHasContent(pageSynthesis) {
    if (!pageSynthesis || typeof pageSynthesis !== "object") return false;
    return ["overview", "learning_purpose", "knowledge_summary", "study_tips", "support_notes"].some(
      function (key) {
        var slot = pageSynthesis[key];
        if (!slot) return false;
        if (typeof slot === "string") return hasNonEmptyString(slot);
        if (typeof slot === "object" && hasNonEmptyString(slot.body)) return true;
        if (key === "knowledge_summary" && slot && Array.isArray(slot.concepts) && slot.concepts.length) {
          return true;
        }
        return false;
      }
    );
  }

  function activityIdsInOrder(page) {
    return (page.activities || []).map(function (row) {
      return String(row.activity_id || "");
    });
  }

  function validateGamEnrichedPage(page, baseline) {
    var errors = [];
    if (!page || typeof page !== "object" || Array.isArray(page)) {
      return { ok: false, errors: ["page must be an object"] };
    }
    if (page.artifact_type !== "page") errors.push('artifact_type must be "page"');
    if (page.schema_version !== SCHEMA_VERSION) {
      errors.push('schema_version must be "' + SCHEMA_VERSION + '"');
    }
    if (page.sections != null) errors.push("sections[] must not be written at GAM stage");
    if (page.learning_sequence != null) {
      errors.push("learning_sequence must not be present at GAM stage");
    }
    if (page.assessment_check != null) {
      errors.push("assessment_check must not be present at GAM stage");
    }
    if (pageSynthesisHasContent(page.page_synthesis)) {
      errors.push("page_synthesis must remain empty at GAM stage");
    } else if (!page.page_synthesis || typeof page.page_synthesis !== "object") {
      errors.push("page_synthesis must be an object");
    }
    if (!page.assembly_state || typeof page.assembly_state !== "object") {
      errors.push("assembly_state required");
    } else {
      if (page.assembly_state.current_stage !== "gam") {
        errors.push('assembly_state.current_stage must be "gam"');
      }
      var enrichedBy = Array.isArray(page.assembly_state.enriched_by)
        ? page.assembly_state.enriched_by
        : [];
      if (enrichedBy.indexOf("gam") === -1) {
        errors.push('assembly_state.enriched_by must include "gam"');
      }
    }
    if (!Array.isArray(page.learning_outcomes) || !page.learning_outcomes.length) {
      errors.push("learning_outcomes[] required at GAM boundary");
    }
    if (!Array.isArray(page.episode_plans) || !page.episode_plans.length) {
      errors.push("episode_plans[] required at GAM boundary");
    }
    if (!Array.isArray(page.source_artefacts)) {
      errors.push("source_artefacts required at GAM boundary");
    }
    if (baseline) {
      if (activityIdsInOrder(page).join("|") !== activityIdsInOrder(baseline).join("|")) {
        errors.push("activity_id order must match upstream DLA page");
      }
      if (JSON.stringify(page.episode_plans || []) !== JSON.stringify(baseline.episode_plans || [])) {
        errors.push("episode_plans[] must match upstream DLA page (GAM must not strip nested episode_plan objects)");
      }
      if (
        JSON.stringify(page.learning_outcomes || []) !== JSON.stringify(baseline.learning_outcomes || [])
      ) {
        errors.push("learning_outcomes[] must match upstream DLA page");
      }
      GAM_PRESERVED_TOP_LEVEL_KEYS.forEach(function (key) {
        if (key === "episode_plans" || key === "learning_outcomes") return;
        if (!(key in baseline)) return;
        if (JSON.stringify(page[key]) !== JSON.stringify(baseline[key])) {
          errors.push(key + " must match upstream DLA page at GAM stage");
        }
      });
    }
    (page.activities || []).forEach(function (activity, index) {
      if (!activity || typeof activity !== "object") {
        errors.push("activities[" + index + "] must be an object");
        return;
      }
      if (isGamActivitySkeleton(activity)) {
        errors.push(
          "activities[" +
            index +
            "] missing DLA-owned fields — GAM output must preserve the full DLA activity row"
        );
        return;
      }
      var required = Array.isArray(activity.required_materials) ? activity.required_materials : [];
      var materials = Array.isArray(activity.materials) ? activity.materials : [];
      if (!required.length) {
        errors.push("activities[" + index + "].required_materials required at GAM boundary");
      }
      if (!materials.length) {
        errors.push("activities[" + index + "].materials must be populated at GAM stage");
      }
      if (required.length !== materials.length) {
        errors.push(
          "activities[" +
            index +
            "] materials count must match required_materials count (" +
            materials.length +
            " vs " +
            required.length +
            ")"
        );
      }
      var requiredIds = required.map(function (row) {
        return String(row.material_id || "");
      });
      var materialIds = materials.map(function (row) {
        return String(row.material_id || "");
      });
      requiredIds.forEach(function (id, reqIndex) {
        if (!id) {
          errors.push("activities[" + index + "].required_materials[" + reqIndex + "].material_id required");
          return;
        }
        if (materialIds.indexOf(id) === -1) {
          errors.push("activities[" + index + "] missing material for required_material_id " + id);
        }
      });
      materials.forEach(function (material, mIndex) {
        if (!material || typeof material !== "object") {
          errors.push("activities[" + index + "].materials[" + mIndex + "] must be an object");
          return;
        }
        if (!hasNonEmptyString(material.material_id)) {
          errors.push("activities[" + index + "].materials[" + mIndex + "].material_id required");
        } else if (requiredIds.indexOf(String(material.material_id)) === -1) {
          errors.push(
            "activities[" +
              index +
              "].materials[" +
              mIndex +
              "] material_id " +
              material.material_id +
              " has no matching required_material"
          );
        }
        if (!hasNonEmptyString(material.title)) {
          errors.push("activities[" + index + "].materials[" + mIndex + "].title required");
        }
        if (!hasNonEmptyString(material.body)) {
          errors.push("activities[" + index + "].materials[" + mIndex + "].body required");
        }
        if (String(material.body_format || "") !== BODY_FORMAT) {
          errors.push(
            "activities[" + index + "].materials[" + mIndex + '].body_format must be "markdown"'
          );
        }
        if (!hasNonEmptyString(material.material_type)) {
          errors.push("activities[" + index + "].materials[" + mIndex + "].material_type required");
        }
      });
      if (baseline && baseline.activities && baseline.activities[index]) {
        validateGamActivityFieldPreservation(baseline.activities[index], activity, index, errors);
        if (!activitiesMatchExceptMaterials(baseline.activities[index], activity)) {
          errors.push("activities[" + index + "] DLA-owned fields were modified at GAM stage");
        }
        var baseRequired = JSON.stringify(baseline.activities[index].required_materials || []);
        var nextRequired = JSON.stringify(activity.required_materials || []);
        if (baseRequired !== nextRequired) {
          errors.push("activities[" + index + "].required_materials must not be modified at GAM stage");
        }
      }
      if (activity.materials && !Array.isArray(activity.materials) && typeof activity.materials === "object") {
        errors.push("activities[" + index + "].materials must be an array, not an object-map");
      }
    });
    return { ok: errors.length === 0, errors: errors };
  }

  function isVNextPageAtGamStage(page) {
    return (
      page &&
      page.artifact_type === "page" &&
      page.schema_version === SCHEMA_VERSION &&
      page.assembly_state &&
      page.assembly_state.current_stage === "gam"
    );
  }

  return {
    ENRICH_VERSION: ENRICH_VERSION,
    SCHEMA_VERSION: SCHEMA_VERSION,
    BODY_FORMAT: BODY_FORMAT,
    GAM_DLA_OWNED_STRING_FIELDS: GAM_DLA_OWNED_STRING_FIELDS.slice(),
    GAM_DLA_OWNED_JSON_FIELDS: GAM_DLA_OWNED_JSON_FIELDS.slice(),
    buildMaterialFromRequired: buildMaterialFromRequired,
    enrichActivityWithGam: enrichActivityWithGam,
    enrichPageWithGam: enrichPageWithGam,
    normalizeGamCaptureToPage: normalizeGamCaptureToPage,
    isGamActivitySkeleton: isGamActivitySkeleton,
    restoreGamBaselinePreservation: restoreGamBaselinePreservation,
    validateGamEnrichedPage: validateGamEnrichedPage,
    validateGamActivityFieldPreservation: validateGamActivityFieldPreservation,
    isVNextPageAtGamStage: isVNextPageAtGamStage,
    activitiesMatchExceptMaterials: activitiesMatchExceptMaterials
  };
});
