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
      // Sprint 85 — Expository sibling stages (additive; Interactive order unchanged)
      "expository_journey_plan",
      "expository_development",
      "expository_materials",
      "design_page"
    ];

    var STAGE_CANONICAL_STEP_IDS = {
      episode_plan: ["step_design_episode_plan"],
      dla: ["step_design_learning_activities"],
      gam: ["step_generate_activity_materials"],
      learning_sequence: ["step_construct_learning_sequence"],
      assessment_design: ["step_design_assessment"],
      assessment_items: ["step_generate_assessment_items"],
      expository_journey_plan: ["step_expository_journey_plan"],
      expository_development: ["step_expository_development"],
      expository_materials: ["step_expository_materials"],
      design_page: ["step_design_page"]
    };

    /** Design Page partial owns learner-facing title, synthesis, and visual planning. */
    var DESIGN_PAGE_OWNED_TOP_LEVEL_FIELDS = [
      "title",
      "page_synthesis",
      "sections",
      "visual_affordance_schema_version",
      "activities_visual_review",
      "visual_affordances"
    ];

    /**
     * Expository Design Page ownership (S87-T-003 / T-011).
     * Authoritative exposition `sections` come from EJP/XD/XM only — DP must not patch them.
     */
    var EXPOSITORY_DESIGN_PAGE_OWNED_TOP_LEVEL_FIELDS = [
      "title",
      "page_synthesis",
      "visual_affordance_schema_version",
      "activities_visual_review",
      "visual_affordances"
    ];

    /** Prospectus / dual-close furniture omitted from first-class Expository by default. */
    var EXPOSITORY_OMITTED_PAGE_SYNTHESIS_FIELDS = [
      "overview",
      "learning_purpose",
      "knowledge_summary",
      "closing_paragraph"
    ];

    function sanitizeExpositoryPageSynthesis(page) {
      if (!page || typeof page !== "object") return page;
      if (!page.page_synthesis || typeof page.page_synthesis !== "object" || Array.isArray(page.page_synthesis)) {
        page.page_synthesis = {};
        return page;
      }
      EXPOSITORY_OMITTED_PAGE_SYNTHESIS_FIELDS.forEach(function (key) {
        if (Object.prototype.hasOwnProperty.call(page.page_synthesis, key)) {
          delete page.page_synthesis[key];
        }
      });
      return page;
    }

    /**
     * First-class Expository chapter form (EQ7): do not expose LO lists as
     * learner-facing orientation furniture. Preserve on expository_journey metadata.
     */
    function relocateExpositoryLearningOutcomesToMetadata(page) {
      if (!page || typeof page !== "object") return page;
      if (!page.expository_journey || typeof page.expository_journey !== "object") {
        page.expository_journey = page.expository_journey || {};
      }
      if (Array.isArray(page.learning_outcomes) && page.learning_outcomes.length) {
        page.expository_journey.learning_outcomes = deepClone(page.learning_outcomes);
      }
      page.learning_outcomes = [];
      return page;
    }

    function finalizeExpositoryChapterForm(page) {
      sanitizeExpositoryPageSynthesis(page);
      relocateExpositoryLearningOutcomesToMetadata(page);
      return page;
    }

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

    function parseFiniteDurationMinutes(value) {
      if (value == null || value === "") return null;
      var minutes = Number(value);
      return Number.isFinite(minutes) ? minutes : null;
    }

    /**
     * Prefer the shared vNext timing helper when Node/require is available so
     * assemble and render stay on one normalisation rule. Browser script loads
     * keep a local fallback with identical precedence.
     */
    function resolveSharedTimelineDurationHelpers() {
      if (typeof require === "function") {
        try {
          return require("./learner-renderer-vnext/project-timeline-durations.js");
        } catch (_err) {}
      }
      return null;
    }

    var sharedTimelineDurations = resolveSharedTimelineDurationHelpers();

    /**
     * Timeline entry minutes: duration_minutes, else estimated_minutes.
     * Learning Sequence remains the generated timing source; this is transport only.
     */
    function parseTimelineEntryMinutes(entry) {
      if (sharedTimelineDurations && typeof sharedTimelineDurations.parseTimelineEntryMinutes === "function") {
        return sharedTimelineDurations.parseTimelineEntryMinutes(entry);
      }
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null;
      var fromDuration = parseFiniteDurationMinutes(entry.duration_minutes);
      if (fromDuration != null) return fromDuration;
      return parseFiniteDurationMinutes(entry.estimated_minutes);
    }

    /**
     * Copy timeline entry minutes onto matching activities[].duration_minutes
     * when the activity duration is absent.
     */
    function projectTimelineDurationsOntoActivities(page) {
      if (
        sharedTimelineDurations &&
        typeof sharedTimelineDurations.projectTimelineDurationsOntoActivities === "function"
      ) {
        return sharedTimelineDurations.projectTimelineDurationsOntoActivities(page);
      }
      if (!page || typeof page !== "object" || Array.isArray(page)) return page;
      var activities = page.activities;
      if (!Array.isArray(activities) || !activities.length) return page;
      var sequence = page.learning_sequence;
      if (!sequence || !Array.isArray(sequence.timeline)) return page;
      var byId = {};
      sequence.timeline.forEach(function (entry) {
        var activityId = nonEmptyString(entry && entry.activity_id);
        if (!activityId || Object.prototype.hasOwnProperty.call(byId, activityId)) return;
        var minutes = parseTimelineEntryMinutes(entry);
        if (minutes == null) return;
        byId[activityId] = minutes;
      });
      activities.forEach(function (activity) {
        if (!activity || typeof activity !== "object" || Array.isArray(activity)) return;
        if (parseFiniteDurationMinutes(activity.duration_minutes) != null) return;
        var activityId = nonEmptyString(activity.activity_id);
        if (!activityId || !Object.prototype.hasOwnProperty.call(byId, activityId)) return;
        activity.duration_minutes = byId[activityId];
      });
      return page;
    }

    function parseJsonObject(raw, label) {
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
        throw assemblyStageError((label || "capture") + " must be a JSON object");
      }
      return parsed;
    }

    function parsePageArtefact(raw, label) {
      var parsed = parseJsonObject(raw, label);
      if (String(parsed.artifact_type || "").toLowerCase() !== "page") {
        throw assemblyStageError((label || "capture") + ' must have artifact_type "page"');
      }
      if (String(parsed.schema_version || "") !== SCHEMA_VERSION) {
        throw assemblyStageError((label || "capture") + ' must have schema_version "2.0.0"');
      }
      return parsed;
    }

    function resolveExpositoryContracts() {
      if (typeof require === "function") {
        try {
          return require("./expository-contracts.js");
        } catch (_err) {}
      }
      var roots = [
        typeof globalThis !== "undefined" ? globalThis : null,
        typeof window !== "undefined" ? window : null,
        typeof root !== "undefined" ? root : null
      ];
      for (var i = 0; i < roots.length; i += 1) {
        if (roots[i] && roots[i].PrismExpositoryContracts) return roots[i].PrismExpositoryContracts;
      }
      return null;
    }

    function parseExpositoryArtefact(raw, stage) {
      var parsed = parseJsonObject(raw, stage);
      var contracts = resolveExpositoryContracts();
      if (!contracts || typeof contracts.validateExpositoryArtefactShape !== "function") {
        throw assemblyStageError("Expository contracts module unavailable for " + stage);
      }
      var check = contracts.validateExpositoryArtefactShape(parsed, stage);
      if (!check || !check.ok || !check.normalized) {
        var detail =
          check && Array.isArray(check.errors) && check.errors.length
            ? check.errors.join("; ")
            : stage + " capture failed shape validation";
        throw assemblyStageError(detail);
      }
      if (String(check.normalized.artifact_type || "") !== stage) {
        throw assemblyStageError(stage + ' must have artifact_type "' + stage + '"');
      }
      return check.normalized;
    }

    function isExpositoryStageName(stage) {
      return (
        stage === "expository_journey_plan" ||
        stage === "expository_development" ||
        stage === "expository_materials"
      );
    }

    function pageHasExpositoryEnrichment(page) {
      var enriched =
        page &&
        page.assembly_state &&
        Array.isArray(page.assembly_state.enriched_by)
          ? page.assembly_state.enriched_by
          : [];
      return enriched.some(function (entry) {
        return isExpositoryStageName(normalizeStageName(entry));
      });
    }

    function buildPageShellFromExpositoryJourneyPlan(ejp) {
      var plan = ejp && typeof ejp === "object" ? ejp : {};
      var sections = Array.isArray(plan.sections)
        ? plan.sections.map(function (sec, idx) {
            var row = sec && typeof sec === "object" ? sec : {};
            return {
              section_id: nonEmptyString(row.section_id) || "section_" + (idx + 1),
              title: nonEmptyString(row.title) || "Section " + (idx + 1),
              purpose: nonEmptyString(row.purpose),
              knowledge_focus: nonEmptyString(row.knowledge_focus),
              conceptual_move: nonEmptyString(row.conceptual_move),
              order: typeof row.order === "number" ? row.order : idx + 1,
              materials: [],
              explanation_intent: "",
              exposition: "",
              invitations_to_think: [],
              continuity_hooks: []
            };
          })
        : [];
      return {
        artifact_type: "page",
        schema_version: SCHEMA_VERSION,
        title: nonEmptyString(plan.title),
        audience: nonEmptyString(plan.audience),
        page_profile: { profile_type: "learner" },
        page_synthesis: {},
        activities: [],
        sections: sections,
        learning_outcomes: Array.isArray(plan.learning_outcomes) ? deepClone(plan.learning_outcomes) : [],
        episode_plans: [],
        source_artefacts: [
          {
            artefact_type: "expository_journey_plan",
            source_label: "Expository Journey Plan",
            role: "structural"
          }
        ],
        generation_notes: {},
        assembly_state: {
          current_stage: "expository_journey_plan",
          enriched_by: ["expository_journey_plan"]
        },
        expository_extent: plan.extent ? deepClone(plan.extent) : null,
        // EQ1 metadata (S87-T-002): inspectable downstream; not learner-facing orientation furniture.
        expository_journey: {
          journey_intent: nonEmptyString(plan.journey_intent),
          commissioned_purpose: nonEmptyString(plan.commissioned_purpose),
          epistemic_form: nonEmptyString(plan.epistemic_form),
          extent: plan.extent ? deepClone(plan.extent) : null
        }
      };
    }

    function mergeExpositoryDevelopmentOntoPage(page, xd) {
      if (!xd || !Array.isArray(xd.sections)) return page;
      var byId = {};
      (Array.isArray(page.sections) ? page.sections : []).forEach(function (sec) {
        var id = nonEmptyString(sec && sec.section_id);
        if (id) byId[id] = sec;
      });
      xd.sections.forEach(function (row) {
        if (!row || typeof row !== "object") return;
        var id = nonEmptyString(row.section_id);
        if (!id || !byId[id]) return;
        byId[id].explanation_intent = nonEmptyString(row.explanation_intent);
        byId[id].exposition = nonEmptyString(row.exposition);
        byId[id].invitations_to_think = Array.isArray(row.invitations_to_think)
          ? deepClone(row.invitations_to_think)
          : [];
        byId[id].continuity_hooks = Array.isArray(row.continuity_hooks)
          ? deepClone(row.continuity_hooks)
          : [];
        byId[id].materials_commission = Array.isArray(row.materials_commission)
          ? deepClone(row.materials_commission)
          : [];
      });
      return page;
    }

    function mergeExpositoryMaterialsOntoPage(page, xm) {
      if (!xm || !Array.isArray(xm.materials)) return page;
      var byId = {};
      (Array.isArray(page.sections) ? page.sections : []).forEach(function (sec) {
        var id = nonEmptyString(sec && sec.section_id);
        if (!id) return;
        if (!Array.isArray(sec.materials)) sec.materials = [];
        byId[id] = sec;
      });
      xm.materials.forEach(function (mat) {
        if (!mat || typeof mat !== "object") return;
        var sectionId = nonEmptyString(mat.section_id);
        if (!sectionId || !byId[sectionId]) return;
        byId[sectionId].materials.push(deepClone(mat));
      });
      return page;
    }

    function assembleExpositoryPageFromPartials(partials, options) {
      var opts = options && typeof options === "object" ? options : {};
      var page = buildPageShellFromExpositoryJourneyPlan(partials.expository_journey_plan);
      var assemblyStates = [page.assembly_state];

      if (partials.expository_development) {
        mergeExpositoryDevelopmentOntoPage(page, partials.expository_development);
        assemblyStates.push({
          current_stage: "expository_development",
          enriched_by: ["expository_development"]
        });
      }
      if (partials.expository_materials) {
        mergeExpositoryMaterialsOntoPage(page, partials.expository_materials);
        assemblyStates.push({
          current_stage: "expository_materials",
          enriched_by: ["expository_materials"]
        });
      }
      if (partials.design_page) {
        // Preserve authoritative XD/XM sections before DP patch (DP must not own sections).
        var authoritativeSections = deepClone(page.sections);
        applyTopLevelPatch(page, partials.design_page, EXPOSITORY_DESIGN_PAGE_OWNED_TOP_LEVEL_FIELDS);
        page.sections = authoritativeSections;
        assemblyStates.push(partials.design_page.assembly_state);
      }

      finalizeExpositoryChapterForm(page);

      page.assembly_state = mergeAssemblyState(assemblyStates);
      if (!page.activities) page.activities = [];

      var validation = validateAssembledPageForRender(page);
      if (!validation.ok) {
        throw assemblyStageError(validation.errors.join("; "));
      }
      return {
        ok: true,
        page: page,
        errors: [],
        warnings: (validation.warnings || []).slice(),
        diagnostics: [],
        mode: "expository"
      };
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

    /**
     * Activity fields owned exclusively by the Episode Plan shell.
     * Downstream partials (DLA/GAM/Design Page) may enrich activities but must not
     * replace canonical archetype / beat choreography.
     */
    var EPISODE_PLAN_OWNED_ACTIVITY_FIELDS = ["episode_plan"];

    /**
     * After DLA, activities[].title is immutable. Downstream stages may omit or
     * repeat it; attempted renames are ignored with a diagnostic.
     */
    function mergeActivitiesById(baseActivities, patchActivities, options) {
      var opts = options && typeof options === "object" ? options : {};
      var stageLabel = nonEmptyString(opts.stageLabel) || "patch";
      var preserveEpisodePlan = opts.preserveEpisodePlan !== false;
      var preserveActivityTitle = opts.preserveActivityTitle !== false;
      var diagnostics = Array.isArray(opts.diagnostics) ? opts.diagnostics : null;
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
        var canonical = baseIndex[activityId];
        var patchClone = deepClone(patchRow);
        if (preserveEpisodePlan) {
          EPISODE_PLAN_OWNED_ACTIVITY_FIELDS.forEach(function (field) {
            if (!Object.prototype.hasOwnProperty.call(patchClone, field)) return;
            if (diagnostics) {
              diagnostics.push({
                code: "DOWNSTREAM_EPISODE_PLAN_OVERWRITE_IGNORED",
                activityId: activityId,
                stage: stageLabel,
                field: field,
                message:
                  "Ignored " +
                  stageLabel +
                  " attempt to replace activity.episode_plan for " +
                  activityId +
                  "; Episode Plan capture remains authoritative."
              });
            }
            delete patchClone[field];
          });
        }
        if (preserveActivityTitle && Object.prototype.hasOwnProperty.call(patchClone, "title")) {
          var canonicalTitle = nonEmptyString(canonical && canonical.title);
          var incomingTitle = nonEmptyString(patchClone.title);
          if (!incomingTitle || (canonicalTitle && incomingTitle === canonicalTitle)) {
            delete patchClone.title;
          } else if (canonicalTitle && incomingTitle !== canonicalTitle) {
            if (diagnostics) {
              diagnostics.push({
                code: "DOWNSTREAM_ACTIVITY_TITLE_OVERWRITE_IGNORED",
                activityId: activityId,
                stage: stageLabel,
                field: "title",
                message:
                  "Ignored " +
                  stageLabel +
                  " attempt to rename activity.title for " +
                  activityId +
                  "; Design Learning Activities title remains authoritative."
              });
            }
            delete patchClone.title;
          }
        }
        var merged = Object.assign({}, canonical, patchClone);
        merged.activity_id = activityId;
        if (preserveEpisodePlan && canonical && canonical.episode_plan) {
          merged.episode_plan = deepClone(canonical.episode_plan);
        }
        if (preserveActivityTitle && canonical && nonEmptyString(canonical.title)) {
          merged.title = canonical.title;
        }
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
        if (isExpositoryStageName(stage)) {
          normalized[stage] = parseExpositoryArtefact(partialsInput[key], stage);
          return;
        }
        normalized[stage] = parsePageArtefact(partialsInput[key], stage);
      });
      if (!normalized.episode_plan && !normalized.expository_journey_plan) {
        throw assemblyStageError("episode_plan or expository_journey_plan partial is required");
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
      if (!partials.episode_plan && partials.expository_journey_plan) {
        return assembleExpositoryPageFromPartials(partials, opts);
      }
      var page = deepClone(partials.episode_plan);
      var assemblyStates = [page.assembly_state];
      var mergeDiagnostics = [];

      if (partials.dla) {
        page.activities = mergeActivitiesById(page.activities, partials.dla.activities, {
          stageLabel: "dla",
          preserveEpisodePlan: true,
          preserveActivityTitle: false,
          diagnostics: mergeDiagnostics
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
        applyTopLevelPatch(page, partials.design_page, DESIGN_PAGE_OWNED_TOP_LEVEL_FIELDS);
        if (Array.isArray(partials.design_page.activities) && partials.design_page.activities.length) {
          page.activities = mergeActivitiesById(page.activities, partials.design_page.activities, {
            stageLabel: "design_page",
            preserveEpisodePlan: true,
            preserveActivityTitle: true,
            diagnostics: mergeDiagnostics
          });
        }
        assemblyStates.push(partials.design_page.assembly_state);
      }

      page.assembly_state = mergeAssemblyState(assemblyStates);
      projectTimelineDurationsOntoActivities(page);

      var validation = validateAssembledPageForRender(page);
      if (!validation.ok) {
        throw assemblyStageError(validation.errors.join("; "));
      }

      var warnings = (validation.warnings || []).slice();
      mergeDiagnostics.forEach(function (row) {
        if (row && row.message) warnings.push(row.message);
      });

      return {
        ok: true,
        page: page,
        errors: [],
        warnings: warnings,
        diagnostics: mergeDiagnostics
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
      var expositoryMode = pageHasExpositoryEnrichment(page);
      if (expositoryMode) {
        if (!Array.isArray(page.sections) || !page.sections.length) {
          errors.push("sections[] must contain at least one section for Expository assembly");
        } else {
          page.sections.forEach(function (section, index) {
            if (!nonEmptyString(section && section.section_id)) {
              errors.push("sections[" + index + "].section_id required");
            }
          });
        }
        if (Array.isArray(page.activities) && page.activities.length) {
          warnings.push("Expository assembled page unexpectedly contains activities[]");
        }
      } else if (!Array.isArray(page.activities) || !page.activities.length) {
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

    /**
     * Match vNext build-page-model placeholder omission semantics.
     * Shell / unfinished activities are structural only — not learner-ready content.
     */
    function isEmptyOrDashPlaceholder(value) {
      var text = String(value == null ? "" : value).trim();
      return !text || text === "—" || text === "-" || text === "–";
    }

    function isPlaceholderLearnerActivity(activity) {
      if (!activity || typeof activity !== "object") return true;
      var materials = Array.isArray(activity.materials) ? activity.materials : [];
      var required = Array.isArray(activity.required_materials)
        ? activity.required_materials
        : [];
      if (materials.length > 0 || required.length > 0) return false;
      return (
        isEmptyOrDashPlaceholder(activity.learner_task) &&
        isEmptyOrDashPlaceholder(activity.expected_output) &&
        isEmptyOrDashPlaceholder(activity.activity_preamble)
      );
    }

    function countNonPlaceholderLearnerActivities(page) {
      var activities = Array.isArray(page && page.activities) ? page.activities : [];
      var count = 0;
      activities.forEach(function (activity) {
        if (!isPlaceholderLearnerActivity(activity)) count += 1;
      });
      return count;
    }

    /**
     * Structural shells (Episode Plan) can pass validateAssembledPageForRender
     * while still lacking learner-facing activity content.
     * Learner-ready = at least one non-placeholder activity (renderer semantics).
     */
    function isLearnerReadyAssembledPage(page) {
      if (pageHasExpositoryEnrichment(page)) {
        var sections = Array.isArray(page && page.sections) ? page.sections : [];
        if (!sections.length) return false;
        var enriched =
          page.assembly_state && Array.isArray(page.assembly_state.enriched_by)
            ? page.assembly_state.enriched_by
            : [];
        if (enriched.indexOf("expository_materials") !== -1) {
          return sections.some(function (sec) {
            return Array.isArray(sec && sec.materials) && sec.materials.some(function (m) {
              return nonEmptyString(m && m.body);
            });
          });
        }
        // Structural Expository shell (EJP/XD) is not yet learner-ready content.
        return false;
      }
      return countNonPlaceholderLearnerActivities(page) > 0;
    }

    /**
     * True when page.activities is a non-empty all-placeholder shell
     * (the Authoring defect class: outcomes-only after vNext omission).
     */
    function isPlaceholderOnlyActivitiesPage(page) {
      var activities = Array.isArray(page && page.activities) ? page.activities : [];
      if (!activities.length) return false;
      return countNonPlaceholderLearnerActivities(page) === 0;
    }

    function buildLearnerAssemblyIncompleteMessage(options) {
      var opts = options && typeof options === "object" ? options : {};
      var missingLabels = [];
      if (opts.missingDla) missingLabels.push("Learning Activities");
      if (opts.missingGam) missingLabels.push("Activity Materials");
      var base =
        "This workflow run does not yet contain the learner activity content needed to assemble the page.";
      if (!missingLabels.length) return base;
      if (missingLabels.length === 1) {
        return base + " Missing stage: " + missingLabels[0] + ".";
      }
      return base + " Missing stages: " + missingLabels.join(" / ") + ".";
    }

    /**
     * Authoring/preview readiness: Episode Plan shells are not learner-ready.
     * options.partialsPresent: { dla?: boolean, gam?: boolean } when known from captures.
     * options.mode:
     *   - "assembly" (default): require ≥1 non-placeholder activity
     *   - "export_gate": only reject non-empty all-placeholder activities[] shells
     *     (do not block legacy pages that omit activities[] / use sections)
     */
    function assessAssembledPageLearnerReady(page, options) {
      var opts = options && typeof options === "object" ? options : {};
      var mode = String(opts.mode || "assembly").toLowerCase();
      var ready =
        mode === "export_gate"
          ? !isPlaceholderOnlyActivitiesPage(page)
          : isLearnerReadyAssembledPage(page);
      if (ready) {
        return {
          ok: true,
          errors: [],
          warnings: [],
          message: "",
          code: "",
          missingDla: false,
          missingGam: false
        };
      }
      var partialsPresent =
        opts.partialsPresent && typeof opts.partialsPresent === "object" ? opts.partialsPresent : null;
      var missingDla = partialsPresent ? !partialsPresent.dla : true;
      var missingGam = partialsPresent ? !partialsPresent.gam : true;
      var message = buildLearnerAssemblyIncompleteMessage({
        missingDla: missingDla,
        missingGam: missingGam
      });
      return {
        ok: false,
        errors: [message],
        warnings: [],
        message: message,
        code: "PAGE_NOT_LEARNER_READY",
        missingDla: missingDla,
        missingGam: missingGam
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
      if (stage === "expository_journey_plan" && title.indexOf("expository journey") !== -1) return true;
      if (stage === "expository_development" && title.indexOf("expository development") !== -1) return true;
      if (stage === "expository_materials" && title.indexOf("expository material") !== -1) return true;
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
      STAGE_CANONICAL_STEP_IDS: Object.keys(STAGE_CANONICAL_STEP_IDS).reduce(function (acc, key) {
        acc[key] = STAGE_CANONICAL_STEP_IDS[key].slice();
        return acc;
      }, {}),
      mergeAssemblyState: mergeAssemblyState,
      mergeActivitiesById: mergeActivitiesById,
      attachMaterialsToActivities: attachMaterialsToActivities,
      DESIGN_PAGE_OWNED_TOP_LEVEL_FIELDS: DESIGN_PAGE_OWNED_TOP_LEVEL_FIELDS.slice(),
      EXPOSITORY_DESIGN_PAGE_OWNED_TOP_LEVEL_FIELDS: EXPOSITORY_DESIGN_PAGE_OWNED_TOP_LEVEL_FIELDS.slice(),
      EXPOSITORY_OMITTED_PAGE_SYNTHESIS_FIELDS: EXPOSITORY_OMITTED_PAGE_SYNTHESIS_FIELDS.slice(),
      sanitizeExpositoryPageSynthesis: sanitizeExpositoryPageSynthesis,
      finalizeExpositoryChapterForm: finalizeExpositoryChapterForm,
      assembleVNextPageFromPartials: assembleVNextPageFromPartials,
      assembleVNextPageFromWorkflowCaptures: assembleVNextPageFromWorkflowCaptures,
      projectTimelineDurationsOntoActivities: projectTimelineDurationsOntoActivities,
      validateAssembledPageForRender: validateAssembledPageForRender,
      isEmptyOrDashPlaceholder: isEmptyOrDashPlaceholder,
      isPlaceholderLearnerActivity: isPlaceholderLearnerActivity,
      countNonPlaceholderLearnerActivities: countNonPlaceholderLearnerActivities,
      isLearnerReadyAssembledPage: isLearnerReadyAssembledPage,
      isPlaceholderOnlyActivitiesPage: isPlaceholderOnlyActivitiesPage,
      buildLearnerAssemblyIncompleteMessage: buildLearnerAssemblyIncompleteMessage,
      assessAssembledPageLearnerReady: assessAssembledPageLearnerReady,
      pageHasExpositoryEnrichment: pageHasExpositoryEnrichment,
      buildPageShellFromExpositoryJourneyPlan: buildPageShellFromExpositoryJourneyPlan
    };
  }
);
