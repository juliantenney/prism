/**
 * Sprint 58 Phase 1B — Deterministic vNext page assembly from partial stage captures.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "object" || !module.exports) {
    if (typeof root !== "undefined") {
      root.PRISM_PAGE_VNEXT_ASSEMBLE = api;
    }
    return;
  }
  module.exports = api;
})(
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this,
  function () {
    "use strict";

    var SCHEMA_VERSION = "2.0.0";
    var STAGE_ORDER = [
      "episode_plan",
      "dla",
      "gam",
      "learning_sequence",
      "assessment_design",
      "assessment_items",
      "design_page"
    ];

    var STAGE_CANONICAL_STEP_IDS = {
      episode_plan: ["step_design_episode_plan"],
      dla: ["step_design_learning_activities"],
      gam: ["step_generate_activity_materials"],
      learning_sequence: ["step_construct_learning_sequence"],
      assessment_design: ["step_design_assessment"],
      assessment_items: ["step_generate_assessment_items"],
      design_page: ["step_design_page"]
    };

    function deepClone(value) {
      if (value == null || typeof value !== "object") return value;
      if (Array.isArray(value)) return value.map(deepClone);
      var out = {};
      Object.keys(value).forEach(function (key) {
        out[key] = deepClone(value[key]);
      });
      return out;
    }

    function nonEmptyString(value) {
      return String(value == null ? "" : value).trim();
    }

    function normalizeStageName(stage) {
      return nonEmptyString(stage).toLowerCase().replace(/[\s-]+/g, "_");
    }

    function assemblyStageError(message) {
      var err = new Error(message);
      err.code = "PAGE_VNEXT_ASSEMBLY";
      return err;
    }

    function parsePageArtefact(raw, label) {
      if (raw == null) return null;
      var parsed = raw;
      if (typeof raw === "string") {
        try {
          parsed = JSON.parse(String(raw).trim());
        } catch (_) {
          throw assemblyStageError((label || "capture") + " must be valid JSON");
        }
      }
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw assemblyStageError((label || "capture") + " must be a page object");
      }
      if (String(parsed.artifact_type || "").toLowerCase() !== "page") {
        throw assemblyStageError((label || "capture") + ' must have artifact_type "page"');
      }
      if (String(parsed.schema_version || "") !== SCHEMA_VERSION) {
        throw assemblyStageError((label || "capture") + ' must have schema_version "2.0.0"');
      }
      return parsed;
    }

    function activityIdsInOrder(activities) {
      if (!Array.isArray(activities)) return [];
      return activities.map(function (row) {
        return nonEmptyString(row && row.activity_id);
      });
    }

    function indexActivitiesById(activities) {
      var map = {};
      if (!Array.isArray(activities)) return map;
      activities.forEach(function (row) {
        if (!row || typeof row !== "object") return;
        var id = nonEmptyString(row.activity_id);
        if (!id) return;
        map[id] = row;
      });
      return map;
    }

    function mergeAssemblyState(states) {
      var enriched = [];
      var seen = {};
      var lastStage = "";
      var list = Array.isArray(states) ? states : [];

      STAGE_ORDER.forEach(function (stage) {
        list.forEach(function (state) {
          if (!state || typeof state !== "object") return;
          var currentStage = normalizeStageName(state.current_stage);
          var enrichedBy = Array.isArray(state.enriched_by) ? state.enriched_by : [];
          if (currentStage === stage) {
            lastStage = stage;
          }
          enrichedBy.forEach(function (entry) {
            var normalized = normalizeStageName(entry);
            if (!normalized || seen[normalized]) return;
            if (STAGE_ORDER.indexOf(normalized) === -1) return;
            seen[normalized] = true;
            enriched.push(normalized);
          });
        });
      });

      var ordered = STAGE_ORDER.filter(function (stage) {
        return seen[stage];
      });

      return {
        enriched_by: ordered.length ? ordered : enriched,
        current_stage: lastStage || (ordered.length ? ordered[ordered.length - 1] : "")
      };
    }

    function mergeActivitiesById(baseActivities, patchActivities, options) {
      var opts = options && typeof options === "object" ? options : {};
      var stageLabel = nonEmptyString(opts.stageLabel) || "patch";
      var base = Array.isArray(baseActivities) ? deepClone(baseActivities) : [];
      var patch = Array.isArray(patchActivities) ? patchActivities : [];
      var baseIndex = indexActivitiesById(base);

      patch.forEach(function (patchRow) {
        if (!patchRow || typeof patchRow !== "object") return;
        var activityId = nonEmptyString(patchRow.activity_id);
        if (!activityId) {
          throw assemblyStageError(stageLabel + " partial activity missing activity_id");
        }
        if (!baseIndex[activityId]) {
          throw assemblyStageError(
            "Unknown activity_id in " + stageLabel + " partial: " + activityId
          );
        }
        var merged = Object.assign({}, baseIndex[activityId], deepClone(patchRow));
        merged.activity_id = activityId;
        baseIndex[activityId] = merged;
      });

      return base.map(function (row) {
        var id = nonEmptyString(row && row.activity_id);
        return id && baseIndex[id] ? baseIndex[id] : row;
      });
    }

    function mergeMaterialsById(baseMaterials, patchMaterials) {
      var base = Array.isArray(baseMaterials) ? deepClone(baseMaterials) : [];
      var patch = Array.isArray(patchMaterials) ? patchMaterials : [];
      var materialMap = {};
      base.forEach(function (material) {
        var id = nonEmptyString(material && material.material_id);
        if (id) materialMap[id] = material;
      });
      patch.forEach(function (material) {
        if (!material || typeof material !== "object") return;
        var id = nonEmptyString(material.material_id);
        if (!id) return;
        materialMap[id] = Object.assign({}, materialMap[id] || {}, deepClone(material));
      });
      var orderedIds = base
        .map(function (material) {
          return nonEmptyString(material && material.material_id);
        })
        .filter(function (id) {
          return !!id;
        });
      patch.forEach(function (material) {
        var id = nonEmptyString(material && material.material_id);
        if (id && orderedIds.indexOf(id) === -1) orderedIds.push(id);
      });
      return orderedIds
        .map(function (id) {
          return materialMap[id];
        })
        .filter(function (row) {
          return !!row;
        });
    }

    function attachMaterialsToActivities(baseActivities, gamActivities, options) {
      var opts = options && typeof options === "object" ? options : {};
      var stageLabel = nonEmptyString(opts.stageLabel) || "gam";
      var base = Array.isArray(baseActivities) ? deepClone(baseActivities) : [];
      var patch = Array.isArray(gamActivities) ? gamActivities : [];
      var baseIndex = indexActivitiesById(base);

      patch.forEach(function (patchRow) {
        if (!patchRow || typeof patchRow !== "object") return;
        var activityId = nonEmptyString(patchRow.activity_id);
        if (!activityId) {
          throw assemblyStageError(stageLabel + " partial activity missing activity_id");
        }
        if (!baseIndex[activityId]) {
          throw assemblyStageError(
            "Unknown activity_id in " + stageLabel + " partial: " + activityId
          );
        }
        var target = baseIndex[activityId];
        if (Array.isArray(patchRow.materials)) {
          target.materials = mergeMaterialsById(target.materials, patchRow.materials);
        }
        baseIndex[activityId] = target;
      });

      return base.map(function (row) {
        var id = nonEmptyString(row && row.activity_id);
        return id && baseIndex[id] ? baseIndex[id] : row;
      });
    }

    function normalizePartialsInput(partialsInput) {
      if (!partialsInput || typeof partialsInput !== "object" || Array.isArray(partialsInput)) {
        throw assemblyStageError("partials must be an object keyed by stage");
      }
      var normalized = {};
      Object.keys(partialsInput).forEach(function (key) {
        var stage = normalizeStageName(key);
        if (!stage || partialsInput[key] == null) return;
        normalized[stage] = parsePageArtefact(partialsInput[key], stage);
      });
      if (!normalized.episode_plan) {
        throw assemblyStageError("episode_plan partial is required");
      }
      return normalized;
    }

    function applyTopLevelPatch(target, partial, keys) {
      keys.forEach(function (key) {
        if (partial[key] !== undefined) {
          target[key] = deepClone(partial[key]);
        }
      });
    }

    function assembleVNextPageFromPartials(partialsInput, options) {
      var opts = options && typeof options === "object" ? options : {};
      var partials = normalizePartialsInput(partialsInput);
      var page = deepClone(partials.episode_plan);
      var assemblyStates = [page.assembly_state];

      if (partials.dla) {
        page.activities = mergeActivitiesById(page.activities, partials.dla.activities, {
          stageLabel: "dla"
        });
        applyTopLevelPatch(page, partials.dla, ["required_materials"]);
        assemblyStates.push(partials.dla.assembly_state);
      }

      if (partials.gam) {
        page.activities = attachMaterialsToActivities(page.activities, partials.gam.activities, {
          stageLabel: "gam"
        });
        assemblyStates.push(partials.gam.assembly_state);
      }

      if (partials.learning_sequence) {
        if (partials.learning_sequence.learning_sequence !== undefined) {
          page.learning_sequence = deepClone(partials.learning_sequence.learning_sequence);
        }
        assemblyStates.push(partials.learning_sequence.assembly_state);
      }

      if (partials.assessment_design) {
        applyTopLevelPatch(page, partials.assessment_design, [
          "assessment_blueprint",
          "coverage_map",
          "difficulty_profile"
        ]);
        assemblyStates.push(partials.assessment_design.assembly_state);
      }

      if (partials.assessment_items) {
        if (partials.assessment_items.assessment_items !== undefined) {
          page.assessment_items = deepClone(partials.assessment_items.assessment_items);
        }
        if (partials.assessment_items.assessment_check !== undefined) {
          page.assessment_check = deepClone(partials.assessment_items.assessment_check);
        }
        if (partials.assessment_items.sections !== undefined) {
          page.sections = deepClone(partials.assessment_items.sections);
        }
        assemblyStates.push(partials.assessment_items.assembly_state);
      }

      if (partials.design_page) {
        if (partials.design_page.page_synthesis !== undefined) {
          page.page_synthesis = deepClone(partials.design_page.page_synthesis);
        }
        if (partials.design_page.sections !== undefined) {
          page.sections = deepClone(partials.design_page.sections);
        }
        assemblyStates.push(partials.design_page.assembly_state);
      }

      page.assembly_state = mergeAssemblyState(assemblyStates);

      var validation = validateAssembledPageForRender(page);
      if (!validation.ok) {
        throw assemblyStageError(validation.errors.join("; "));
      }

      return {
        ok: true,
        page: page,
        errors: [],
        warnings: validation.warnings || []
      };
    }

    function validateAssembledPageForRender(page) {
      var errors = [];
      var warnings = [];
      if (!page || typeof page !== "object" || Array.isArray(page)) {
        return { ok: false, errors: ["assembled page must be an object"], warnings: warnings };
      }
      if (String(page.artifact_type || "").toLowerCase() !== "page") {
        errors.push('artifact_type must be "page"');
      }
      if (String(page.schema_version || "") !== SCHEMA_VERSION) {
        errors.push('schema_version must be "2.0.0"');
      }
      if (!Array.isArray(page.activities) || !page.activities.length) {
        errors.push("activities[] must contain at least one activity");
      } else {
        page.activities.forEach(function (activity, index) {
          if (!nonEmptyString(activity && activity.activity_id)) {
            errors.push("activities[" + index + "].activity_id required");
          }
        });
      }
      if (!page.assembly_state || typeof page.assembly_state !== "object") {
        errors.push("assembly_state required");
      } else if (
        !Array.isArray(page.assembly_state.enriched_by) ||
        !page.assembly_state.enriched_by.length
      ) {
        warnings.push("assembly_state.enriched_by is empty");
      }
      if (!nonEmptyString(page.title)) {
        warnings.push("title missing");
      }
      if (!nonEmptyString(page.audience)) {
        warnings.push("audience missing");
      }
      return {
        ok: errors.length === 0,
        errors: errors,
        warnings: warnings
      };
    }

    function normalizeCanonicalStepId(value) {
      return nonEmptyString(value).toLowerCase();
    }

    function stepMatchesStage(step, stage) {
      if (!step || typeof step !== "object") return false;
      var canonical = normalizeCanonicalStepId(
        step.canonical_step_id || step.canonicalStepId || ""
      );
      var ids = STAGE_CANONICAL_STEP_IDS[stage] || [];
      if (ids.indexOf(canonical) !== -1) return true;
      var title = nonEmptyString(step.title).toLowerCase();
      if (stage === "episode_plan" && title.indexOf("episode plan") !== -1) return true;
      if (stage === "dla" && title.indexOf("design learning activit") !== -1) return true;
      if (stage === "gam" && title.indexOf("generate activity material") !== -1) return true;
      if (stage === "learning_sequence" && title.indexOf("learning sequence") !== -1) return true;
      if (stage === "assessment_design" && title.indexOf("design assessment") !== -1) return true;
      if (
        stage === "assessment_items" &&
        (title.indexOf("generate assessment item") !== -1 || title.indexOf("assessment item") !== -1)
      ) {
        return true;
      }
      if (stage === "design_page" && (title.indexOf("design page") !== -1 || canonical === "step_design_page")) {
        return true;
      }
      return false;
    }

    function findStepForStage(steps, stage) {
      if (!Array.isArray(steps)) return null;
      for (var i = 0; i < steps.length; i += 1) {
        if (stepMatchesStage(steps[i], stage)) return steps[i];
      }
      return null;
    }

    function assembleVNextPageFromWorkflowCaptures(wf, options) {
      var opts = options && typeof options === "object" ? options : {};
      var workflow = wf && typeof wf === "object" ? wf : {};
      var steps = Array.isArray(opts.steps) ? opts.steps : workflow.steps || [];
      var captures = opts.captures && typeof opts.captures === "object" ? opts.captures : {};
      var readCapture =
        typeof opts.readCapture === "function"
          ? opts.readCapture
          : function (step) {
              if (!step) return null;
              var sid = nonEmptyString(step.id);
              return sid ? captures[sid] : null;
            };

      var partials = {};
      STAGE_ORDER.forEach(function (stage) {
        var step = findStepForStage(steps, stage);
        if (!step) return;
        var raw = readCapture(step);
        if (raw == null || raw === "") return;
        partials[stage] = raw;
      });

      return assembleVNextPageFromPartials(partials, opts);
    }

    return {
      SCHEMA_VERSION: SCHEMA_VERSION,
      STAGE_ORDER: STAGE_ORDER.slice(),
      mergeAssemblyState: mergeAssemblyState,
      mergeActivitiesById: mergeActivitiesById,
      attachMaterialsToActivities: attachMaterialsToActivities,
      assembleVNextPageFromPartials: assembleVNextPageFromPartials,
      assembleVNextPageFromWorkflowCaptures: assembleVNextPageFromWorkflowCaptures,
      validateAssembledPageForRender: validateAssembledPageForRender
    };
  }
);
