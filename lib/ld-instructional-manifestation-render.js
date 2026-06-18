/**
 * Sprint 50 — learner-page instructional manifestation grammar (renderer only).
 * Orient → Think → Study → [Explain before you check] → Do → Check → Reflect → Transfer → [Watch for this mistake]
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_LD_INSTRUCTIONAL_MANIFESTATION_RENDER = api;
  }
})(
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this,
  function () {
    "use strict";

    var MODULE_ID = "LD-INSTRUCTIONAL-MANIFESTATION-RENDER";

    var HEADINGS = {
      orient: "Why this activity",
      think: "How to approach this",
      study: "Read and model",
      reflectPreCheck: "Explain before you check",
      do: "What to do",
      check: "Check your work",
      reflectPostCheck: "What to take away",
      transfer: "Apply elsewhere",
      support: "Watch for this mistake"
    };

    var ORIENT_ROW_FIELDS = [
      "activity_preamble",
      "orienting_preamble",
      "activity_framing",
      "intellectual_coherence_bridge",
      "prior_knowledge_activation",
      "prior_knowledge_prompt",
      "purpose",
      "study_orientation"
    ];

    var THINK_ROW_FIELDS = [
      "reasoning_orientation",
      "reasoning_orientation_prompt",
      "intellectual_frame",
      "disciplinary_lens",
      "conceptual_contrast_prompt",
      "argument_structure_hint",
      "evidence_use_prompt",
      "uncertainty_tension_prompt",
      "scaffold_hint_sequence"
    ];

    var REFLECT_POST_ROW_FIELDS = [
      "reconciliation_prompt",
      "reasoning_revision_prompt",
      "initial_position_prompt",
      "revision_trigger",
      "misconception_claim",
      "evidence_contrast",
      "transformation_activity",
      "source_to_application_prompt"
    ];

    var STUDY_MATERIAL_KEYS = [
      "text",
      "scenario",
      "scenarios",
      "worked_example",
      "worked_examples",
      "worked_analytic_pass",
      "modelling_note",
      "modeling_note",
      "concept_text",
      "explanatory_text",
      "summary_text",
      "reference_table"
    ];

    var DO_MATERIAL_KEYS = [
      "analysis_table",
      "comparison_table",
      "worksheet",
      "table",
      "template",
      "templates",
      "independent_judgement_template",
      "guided_judgement_table",
      "decision_table",
      "prompt_set",
      "prompts",
      "discussion_prompts",
      "analysis_template",
      "worksheet_template",
      "task_cards",
      "cards"
    ];

    var CHECK_MATERIAL_KEYS = [
      "checklist",
      "checklists",
      "evaluation_checklist",
      "verification_checklist"
    ];

    var REFLECT_MATERIAL_KEYS = ["reflection_prompt", "consolidation_summary"];

    var TRANSFER_MATERIAL_KEYS = ["transfer_prompt", "transfer_prompt_evaluate"];

    function normalizeMaterialKey(key) {
      return String(key || "")
        .toLowerCase()
        .replace(/[\s-]+/g, "_");
    }

    function fieldHasValue(value) {
      if (value == null) return false;
      if (typeof value === "string") return !!String(value).trim();
      if (typeof value === "number" || typeof value === "boolean") return true;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "object") return Object.keys(value).length > 0;
      return false;
    }

    function firstNonEmptyScalar(values) {
      for (var i = 0; i < values.length; i += 1) {
        var v = values[i];
        if (!fieldHasValue(v)) continue;
        if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
          return String(v).trim();
        }
      }
      return "";
    }

    function shouldApplyInstructionalManifestationGrammar(renderOpts, pageArtifact) {
      var opts = renderOpts && typeof renderOpts === "object" ? renderOpts : {};
      if (opts.instructionalManifestationGrammar === false) return false;
      if (opts.instructionalManifestationGrammar === true) return true;
      var page = pageArtifact && typeof pageArtifact === "object" ? pageArtifact : {};
      var profile = String(opts.pageProfile || opts.page_profile || page.page_profile || "")
        .toLowerCase()
        .trim()
        .replace(/[\s-]+/g, "_");
      if (profile !== "learner" && profile !== "self_directed_learner") return false;
      if (opts.isLearnerWorkshopPage === true) return false;
      return true;
    }

    function activityHasPostCheckSources(row, materials) {
      var mats = materials && typeof materials === "object" ? materials : {};
      var i;
      for (i = 0; i < REFLECT_MATERIAL_KEYS.length; i += 1) {
        if (fieldHasValue(mats[REFLECT_MATERIAL_KEYS[i]])) return true;
      }
      for (i = 0; i < REFLECT_POST_ROW_FIELDS.length; i += 1) {
        if (fieldHasValue(row && row[REFLECT_POST_ROW_FIELDS[i]])) return true;
      }
      return false;
    }

    function activityNeedsPreCheckReflect(row, materials) {
      if (!fieldHasValue(row && row.self_explanation_prompt)) return false;
      var mats = materials && typeof materials === "object" ? materials : {};
      if (fieldHasValue(mats.sample_output)) return true;
      var ck;
      for (ck = 0; ck < CHECK_MATERIAL_KEYS.length; ck += 1) {
        if (fieldHasValue(mats[CHECK_MATERIAL_KEYS[ck]])) return true;
      }
      return fieldHasValue(row && row.expected_output);
    }

    function pickMaterialKeys(materials, allowedKeys, sampleOutputPlacement) {
      var mats = materials && typeof materials === "object" ? materials : {};
      var out = {};
      var allowed = {};
      (allowedKeys || []).forEach(function (k) {
        allowed[normalizeMaterialKey(k)] = k;
      });
      Object.keys(mats).forEach(function (key) {
        var nk = normalizeMaterialKey(key);
        if (nk === "sample_output") {
          if (sampleOutputPlacement === "study" || sampleOutputPlacement === "check") {
            out[key] = mats[key];
          }
          return;
        }
        if (allowed[nk]) {
          out[key] = mats[key];
          return;
        }
        if (nk.indexOf("checklist") !== -1 && sampleOutputPlacement !== "study") {
          if (
            allowedKeys === CHECK_MATERIAL_KEYS ||
            (Array.isArray(allowedKeys) &&
              allowedKeys.some(function (k) {
                return normalizeMaterialKey(k).indexOf("checklist") !== -1;
              }))
          ) {
            out[key] = mats[key];
          }
        }
      });
      return out;
    }

    function classifyRemainingMaterialKey(key) {
      var nk = normalizeMaterialKey(key);
      if (STUDY_MATERIAL_KEYS.indexOf(nk) !== -1) return "study";
      if (DO_MATERIAL_KEYS.indexOf(nk) !== -1) return "do";
      if (CHECK_MATERIAL_KEYS.indexOf(nk) !== -1 || nk.indexOf("checklist") !== -1) return "check";
      if (REFLECT_MATERIAL_KEYS.indexOf(nk) !== -1) return "reflect";
      if (TRANSFER_MATERIAL_KEYS.indexOf(nk) !== -1 || /^transfer_prompt/.test(nk)) return "transfer";
      if (/^(scenario|worked|text|summary|reference|model)/.test(nk)) return "study";
      if (/^(template|table|worksheet|prompt|card|decision|analysis|comparison)/.test(nk)) return "do";
      return "study";
    }

    function partitionActivityMaterialsForGrammar(row, materials) {
      var mats = materials && typeof materials === "object" ? materials : {};
      var preCheckReflect = activityNeedsPreCheckReflect(row, mats);
      var samplePlacement = preCheckReflect ? "study" : "check";
      var study = {};
      var doBucket = {};
      var check = {};
      var reflect = {};
      var transfer = {};
      var assigned = {};

      function assign(bucket, key) {
        if (assigned[key]) return;
        assigned[key] = true;
        bucket[key] = mats[key];
      }

      Object.keys(mats).forEach(function (key) {
        var nk = normalizeMaterialKey(key);
        if (nk === "sample_output") {
          assign(samplePlacement === "study" ? study : check, key);
          return;
        }
        if (
          CHECK_MATERIAL_KEYS.indexOf(nk) !== -1 ||
          nk.indexOf("checklist") !== -1
        ) {
          assign(check, key);
          return;
        }
        if (TRANSFER_MATERIAL_KEYS.indexOf(nk) !== -1 || /^transfer_prompt/.test(nk)) {
          assign(transfer, key);
          return;
        }
        if (REFLECT_MATERIAL_KEYS.indexOf(nk) !== -1) {
          assign(reflect, key);
          return;
        }
        if (DO_MATERIAL_KEYS.indexOf(nk) !== -1) {
          assign(doBucket, key);
          return;
        }
        if (STUDY_MATERIAL_KEYS.indexOf(nk) !== -1) {
          assign(study, key);
          return;
        }
        var bucketName = classifyRemainingMaterialKey(key);
        if (bucketName === "do") assign(doBucket, key);
        else if (bucketName === "check") assign(check, key);
        else if (bucketName === "reflect") assign(reflect, key);
        else if (bucketName === "transfer") assign(transfer, key);
        else assign(study, key);
      });

      return {
        study: study,
        do: doBucket,
        check: check,
        reflect: reflect,
        transfer: transfer,
        preCheckReflect: preCheckReflect
      };
    }

    function collectOrientTexts(row) {
      var texts = [];
      var seen = {};
      ORIENT_ROW_FIELDS.forEach(function (fieldId) {
        var text = firstNonEmptyScalar([row && row[fieldId]]);
        if (!text) return;
        var key = text.toLowerCase().replace(/\s+/g, " ").trim();
        if (seen[key]) return;
        seen[key] = true;
        texts.push({ fieldId: fieldId, text: text });
      });
      return texts;
    }

    function collectThinkTexts(row, orientSeen) {
      var texts = [];
      var seen = orientSeen || {};
      THINK_ROW_FIELDS.forEach(function (fieldId) {
        var value = row && row[fieldId];
        if (!fieldHasValue(value)) return;
        if (fieldId === "scaffold_hint_sequence" && Array.isArray(value)) {
          value.forEach(function (entry, idx) {
            var text = firstNonEmptyScalar([entry]);
            if (!text) return;
            var key = text.toLowerCase().replace(/\s+/g, " ").trim();
            if (seen[key]) return;
            seen[key] = true;
            texts.push({ fieldId: fieldId, text: text, label: "Scaffold hint " + (idx + 1) });
          });
          return;
        }
        var text = firstNonEmptyScalar([value]);
        if (!text) return;
        var key = text.toLowerCase().replace(/\s+/g, " ").trim();
        if (seen[key]) return;
        seen[key] = true;
        texts.push({ fieldId: fieldId, text: text });
      });
      return texts;
    }

    function hasTransferMaterial(materials) {
      var mats = materials && typeof materials === "object" ? materials : {};
      var keys = Object.keys(mats);
      for (var i = 0; i < keys.length; i += 1) {
        var nk = normalizeMaterialKey(keys[i]);
        if (TRANSFER_MATERIAL_KEYS.indexOf(nk) !== -1 || /^transfer_prompt/.test(nk)) {
          if (fieldHasValue(mats[keys[i]])) return true;
        }
      }
      return false;
    }

    function hasStudyMaterials(partition) {
      return !!(partition && partition.study && Object.keys(partition.study).length);
    }

    function hasDoContent(row, partition) {
      if (fieldHasValue(row && row.learner_task)) return true;
      if (fieldHasValue(row && row.learner_instructions)) return true;
      if (fieldHasValue(row && row.instructions)) return true;
      return !!(partition && partition.do && Object.keys(partition.do).length);
    }

    function hasCheckContent(row, partition) {
      if (fieldHasValue(row && row.expected_output)) return true;
      return !!(partition && partition.check && Object.keys(partition.check).length);
    }

    return {
      MODULE_ID: MODULE_ID,
      HEADINGS: HEADINGS,
      ORIENT_ROW_FIELDS: ORIENT_ROW_FIELDS,
      THINK_ROW_FIELDS: THINK_ROW_FIELDS,
      REFLECT_POST_ROW_FIELDS: REFLECT_POST_ROW_FIELDS,
      shouldApplyInstructionalManifestationGrammar: shouldApplyInstructionalManifestationGrammar,
      activityNeedsPreCheckReflect: activityNeedsPreCheckReflect,
      activityHasPostCheckSources: activityHasPostCheckSources,
      partitionActivityMaterialsForGrammar: partitionActivityMaterialsForGrammar,
      collectOrientTexts: collectOrientTexts,
      collectThinkTexts: collectThinkTexts,
      hasTransferMaterial: hasTransferMaterial,
      hasStudyMaterials: hasStudyMaterials,
      hasDoContent: hasDoContent,
      hasCheckContent: hasCheckContent,
      fieldHasValue: fieldHasValue,
      firstNonEmptyScalar: firstNonEmptyScalar
    };
  }
);
