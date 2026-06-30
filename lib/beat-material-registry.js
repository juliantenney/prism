/**
 * Beat–material registry — single source of truth for beat-aware rendering.
 * Every material type resolves to exactly one renderer beat (exclusive).
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_BEAT_MATERIAL_REGISTRY = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var REGISTRY_VERSION = "1";

  /**
   * Registry row:
   * - materialType: normalized snake_case key (materials.<key> or GAM type)
   * - beat: renderer semantic beat (READ, CHECK, EXAMPLE, …)
   * - exclusivity: when true, at most one material of this type per activity
   * - semanticIcon: icon registry key for Lucide renderer
   * - modifierClass: CSS modifier for material icon wrapper
   * - episodeFunctions: optional V1 episode-plan functions that expect this beat
   */
  var MATERIAL_BEAT_REGISTRY = [
    { materialType: "text", beat: "READ", exclusivity: false, semanticIcon: "READ", modifierClass: "util-generic-material-icon", episodeFunctions: ["explanation", "observation"] },
    { materialType: "exposition", beat: "READ", exclusivity: false, semanticIcon: "READ", modifierClass: "util-generic-material-icon", episodeFunctions: ["explanation"] },
    { materialType: "reading", beat: "READ", exclusivity: false, semanticIcon: "READ", modifierClass: "util-generic-material-icon" },
    { materialType: "reading_text", beat: "READ", exclusivity: false, semanticIcon: "READ", modifierClass: "util-generic-material-icon" },
    { materialType: "criteria_exposition", beat: "READ", exclusivity: true, semanticIcon: "READ", modifierClass: "util-generic-material-icon", episodeFunctions: ["criteria_exposition"] },
    { materialType: "scenario", beat: "READ", exclusivity: false, semanticIcon: "SCENARIO", modifierClass: "util-scenario-card-icon", episodeFunctions: ["guided_practice", "guided_inquiry", "guided_reasoning", "transfer"] },
    { materialType: "scenarios", beat: "READ", exclusivity: false, semanticIcon: "SCENARIO", modifierClass: "util-scenario-card-icon", episodeFunctions: ["guided_practice", "guided_inquiry", "guided_reasoning"] },
    { materialType: "study_scenarios", beat: "READ", exclusivity: false, semanticIcon: "SCENARIO", modifierClass: "util-scenario-card-icon", episodeFunctions: ["guided_practice", "guided_inquiry"] },
    { materialType: "worked_example", beat: "EXAMPLE", exclusivity: true, semanticIcon: "EXAMPLE", modifierClass: "util-generic-material-icon", episodeFunctions: ["example", "worked_thinking", "worked_judgement", "non_example"] },
    { materialType: "worked_examples", beat: "EXAMPLE", exclusivity: false, semanticIcon: "EXAMPLE", modifierClass: "util-generic-material-icon" },
    { materialType: "modelling_note", beat: "EXAMPLE", exclusivity: true, semanticIcon: "EXAMPLE", modifierClass: "util-generic-material-icon", episodeFunctions: ["worked_thinking", "worked_judgement"] },
    { materialType: "sample_output", beat: "EXAMPLE", exclusivity: true, semanticIcon: "EXAMPLE", modifierClass: "util-generic-material-icon", episodeFunctions: ["worked_thinking", "example"] },
    { materialType: "examples", beat: "EXAMPLE", exclusivity: false, semanticIcon: "EXAMPLE", modifierClass: "util-generic-material-icon" },
    { materialType: "checklist", beat: "CHECK", exclusivity: true, semanticIcon: "CHECKLIST", modifierClass: "util-checklist-icon", episodeFunctions: ["verification"] },
    { materialType: "checklists", beat: "CHECK", exclusivity: false, semanticIcon: "CHECKLIST", modifierClass: "util-checklist-icon" },
    { materialType: "output", beat: "CHECK", exclusivity: true, semanticIcon: "CHECK", modifierClass: "util-output-icon" },
    { materialType: "expected_output", beat: "CHECK", exclusivity: true, semanticIcon: "CHECK", modifierClass: "util-output-icon" },
    { materialType: "prompt_set", beat: "DISCUSS", exclusivity: true, semanticIcon: "DISCUSS", modifierClass: "util-prompt-set-icon", episodeFunctions: ["guided_inquiry", "misconception_confrontation"] },
    { materialType: "prompt", beat: "DISCUSS", exclusivity: false, semanticIcon: "DISCUSS", modifierClass: "util-prompt-set-icon" },
    { materialType: "prompts", beat: "DISCUSS", exclusivity: false, semanticIcon: "DISCUSS", modifierClass: "util-prompt-set-icon" },
    { materialType: "discussion", beat: "DISCUSS", exclusivity: true, semanticIcon: "DISCUSS", modifierClass: "util-prompt-set-icon" },
    { materialType: "template", beat: "CREATE", exclusivity: true, semanticIcon: "TEMPLATE", modifierClass: "util-template-icon", episodeFunctions: ["criteria_construction", "perspective_construction", "independent_performance", "evaluative_judgement", "guided_practice"] },
    { materialType: "templates", beat: "CREATE", exclusivity: false, semanticIcon: "TEMPLATE", modifierClass: "util-template-icon" },
    { materialType: "worksheet_template", beat: "CREATE", exclusivity: true, semanticIcon: "TEMPLATE", modifierClass: "util-template-icon" },
    { materialType: "task_card", beat: "PRACTICE", exclusivity: false, semanticIcon: "TASK_CARDS", modifierClass: "util-task-card-icon", episodeFunctions: ["guided_practice", "guided_reasoning", "independent_performance"] },
    { materialType: "task_cards", beat: "PRACTICE", exclusivity: false, semanticIcon: "TASK_CARDS", modifierClass: "util-task-card-icon" },
    { materialType: "cards", beat: "PRACTICE", exclusivity: false, semanticIcon: "TASK_CARDS", modifierClass: "util-task-card-icon" },
    { materialType: "what_to_do", beat: "PRACTICE", exclusivity: true, semanticIcon: "PRACTICE", modifierClass: "util-activity-task-icon" },
    { materialType: "guidance", beat: "PRACTICE", exclusivity: false, semanticIcon: "PRACTICE", modifierClass: "util-activity-task-icon" },
    { materialType: "instructions", beat: "PRACTICE", exclusivity: false, semanticIcon: "PRACTICE", modifierClass: "util-activity-task-icon" },
    { materialType: "transfer_prompt", beat: "PRACTICE", exclusivity: true, semanticIcon: "PRACTICE", modifierClass: "util-activity-task-icon", episodeFunctions: ["transfer"] },
    { materialType: "table", beat: "PRACTICE", exclusivity: false, semanticIcon: "TABLE", modifierClass: "util-table-icon", episodeFunctions: ["guided_reasoning"] },
    { materialType: "worksheet", beat: "PRACTICE", exclusivity: false, semanticIcon: "TABLE", modifierClass: "util-table-icon" },
    { materialType: "analysis_table", beat: "PRACTICE", exclusivity: true, semanticIcon: "TABLE", modifierClass: "util-table-icon" },
    { materialType: "comparison_table", beat: "PRACTICE", exclusivity: true, semanticIcon: "TABLE", modifierClass: "util-table-icon" },
    { materialType: "impact_table", beat: "PRACTICE", exclusivity: true, semanticIcon: "TABLE", modifierClass: "util-table-icon" },
    { materialType: "classification_table", beat: "PRACTICE", exclusivity: true, semanticIcon: "TABLE", modifierClass: "util-table-icon" },
    { materialType: "reference_table", beat: "READ", exclusivity: false, semanticIcon: "TABLE", modifierClass: "util-table-icon", episodeFunctions: ["criteria_exposition", "explanation"] },
    { materialType: "decision_table", beat: "PRACTICE", exclusivity: false, semanticIcon: "TABLE", modifierClass: "util-table-icon", episodeFunctions: ["guided_practice", "guided_reasoning", "evaluative_judgement"] },
    { materialType: "rubric", beat: "EVALUATE", exclusivity: true, semanticIcon: "EVALUATE", modifierClass: "util-generic-material-icon", episodeFunctions: ["evaluative_judgement", "verification"] },
    { materialType: "consolidation_summary", beat: "REFLECT", exclusivity: true, semanticIcon: "REFLECT", modifierClass: "util-generic-material-icon", episodeFunctions: ["reflection", "transfer"] },
    { materialType: "strategy", beat: "REFLECT", exclusivity: true, semanticIcon: "STRATEGY", modifierClass: "util-strategy-icon" },
    { materialType: "strategy_options", beat: "REFLECT", exclusivity: true, semanticIcon: "STRATEGY", modifierClass: "util-strategy-icon" },
    { materialType: "support_note", beat: "NOTE", exclusivity: true, semanticIcon: "NOTE", modifierClass: "util-support-note-icon" },
    { materialType: "support", beat: "NOTE", exclusivity: false, semanticIcon: "SUPPORT", modifierClass: "util-support-note-icon" },
    { materialType: "support_notes", beat: "NOTE", exclusivity: false, semanticIcon: "SUPPORT", modifierClass: "util-support-note-icon" },
    { materialType: "materials", beat: "NOTE", exclusivity: false, semanticIcon: "MATERIALS", modifierClass: "util-materials-icon" },
    { materialType: "metadata", beat: "NOTE", exclusivity: true, semanticIcon: "METADATA", modifierClass: "util-meta-icon" },
    { materialType: "production", beat: "NOTE", exclusivity: true, semanticIcon: "METADATA", modifierClass: "util-meta-icon" },
    { materialType: "video", beat: "WATCH", exclusivity: true, semanticIcon: "WATCH", modifierClass: "util-generic-material-icon" }
  ];

  var EPISODE_FUNCTION_BEATS = {
    orientation: "REFLECT",
    framing: "REFLECT",
    activation: "REFLECT",
    explanation: "READ",
    example: "EXAMPLE",
    non_example: "EXAMPLE",
    misconception_confrontation: "DISCUSS",
    criteria_exposition: "READ",
    criteria_construction: "CREATE",
    perspective_construction: "CREATE",
    worked_thinking: "EXAMPLE",
    worked_judgement: "EXAMPLE",
    guided_inquiry: "DISCUSS",
    guided_reasoning: "PRACTICE",
    guided_practice: "PRACTICE",
    independent_performance: "PRACTICE",
    evaluative_judgement: "EVALUATE",
    verification: "CHECK",
    revision: "PRACTICE",
    reflection: "REFLECT",
    transfer: "PRACTICE",
    prediction: "REFLECT",
    observation: "READ",
    transition: "NOTE"
  };

  var EPISODE_FUNCTION_LABELS = {
    explanation: "Explanation",
    observation: "Explanation",
    criteria_exposition: "Explanation",
    example: "Worked Thinking",
    worked_thinking: "Worked Thinking",
    worked_judgement: "Worked Thinking",
    non_example: "Worked Thinking",
    guided_practice: "Practice",
    guided_reasoning: "Practice",
    guided_inquiry: "Practice",
    independent_performance: "Practice",
    revision: "Practice",
    guided_judgement: "Practice",
    transfer: "Transfer",
    reflection: "Reflection",
    verification: "Check Your Thinking",
    evaluative_judgement: "Evaluate",
    misconception_confrontation: "Discuss",
    criteria_construction: "Create",
    perspective_construction: "Create",
    orientation: "Orientation",
    framing: "Framing",
    activation: "Activation",
    prediction: "Predict"
  };

  var byMaterialType = {};
  var beatToMaterialTypes = {};

  function normalizeMaterialType(value) {
    return String(value == null ? "" : value)
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, "_");
  }

  function normalizeBeat(value) {
    return String(value == null ? "" : value)
      .trim()
      .toUpperCase()
      .replace(/[\s-]+/g, "_");
  }

  function normalizeEpisodeFunction(value) {
    return String(value == null ? "" : value)
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, "_");
  }

  function buildIndexes() {
    byMaterialType = {};
    beatToMaterialTypes = {};
    MATERIAL_BEAT_REGISTRY.forEach(function (row) {
      var key = normalizeMaterialType(row.materialType);
      if (!key) return;
      if (byMaterialType[key] && byMaterialType[key].beat !== row.beat) {
        throw new Error(
          "beat-material-registry: material type " +
            key +
            " maps to multiple beats (" +
            byMaterialType[key].beat +
            " vs " +
            row.beat +
            ")"
        );
      }
      byMaterialType[key] = row;
      var beat = normalizeBeat(row.beat);
      if (!beatToMaterialTypes[beat]) beatToMaterialTypes[beat] = [];
      if (beatToMaterialTypes[beat].indexOf(key) === -1) {
        beatToMaterialTypes[beat].push(key);
      }
    });
  }

  buildIndexes();

  function getRegistryEntry(materialType) {
    var key = normalizeMaterialType(materialType);
    return key && byMaterialType[key] ? byMaterialType[key] : null;
  }

  function resolveBeatForMaterialType(materialType) {
    var entry = getRegistryEntry(materialType);
    if (!entry) return null;
    return {
      beat: normalizeBeat(entry.beat),
      exclusivity: !!entry.exclusivity,
      semanticIcon: entry.semanticIcon || "GENERIC",
      modifierClass: entry.modifierClass || "util-generic-material-icon",
      materialType: normalizeMaterialType(entry.materialType)
    };
  }

  function resolveBeatForEpisodeFunction(episodeFunction) {
    var fn = normalizeEpisodeFunction(episodeFunction);
    if (!fn) return null;
    var beat = EPISODE_FUNCTION_BEATS[fn];
    return beat ? normalizeBeat(beat) : null;
  }

  function classifyBeatFromText(text, classifyFn) {
    if (typeof classifyFn !== "function") return null;
    var beat = classifyFn(text);
    return beat ? normalizeBeat(beat) : null;
  }

  /**
   * Resolve beat for a material field. Type registry is authoritative; optional text
   * classification detects conflicts (multiple beats).
   */
  function resolveMaterialBeat(materialType, contentText, options) {
    var opts = options && typeof options === "object" ? options : {};
    var typeResolution = resolveBeatForMaterialType(materialType);
    var textBeat = classifyBeatFromText(contentText, opts.classifyFromText);
    var beats = [];
    var sources = [];
    if (typeResolution && typeResolution.beat) {
      beats.push(typeResolution.beat);
      sources.push("registry");
    }
    if (textBeat && beats.indexOf(textBeat) === -1) {
      beats.push(textBeat);
      sources.push("text");
    }
    return {
      materialType: normalizeMaterialType(materialType),
      beat: beats.length === 1 ? beats[0] : null,
      beats: beats,
      sources: sources,
      conflict: beats.length > 1,
      exclusivity: typeResolution ? typeResolution.exclusivity : false,
      registered: !!typeResolution,
      semanticIcon: typeResolution ? typeResolution.semanticIcon : "GENERIC",
      modifierClass: typeResolution ? typeResolution.modifierClass : "util-generic-material-icon"
    };
  }

  function validateRegistryIntegrity() {
    var errors = [];
    var seen = {};
    MATERIAL_BEAT_REGISTRY.forEach(function (row, index) {
      var key = normalizeMaterialType(row.materialType);
      if (!key) {
        errors.push("registry[" + index + "]: missing materialType");
        return;
      }
      if (!row.beat) {
        errors.push("registry[" + key + "]: missing beat");
      }
      if (seen[key] && seen[key] !== row.beat) {
        errors.push("registry[" + key + "]: duplicate materialType with different beat");
      }
      seen[key] = row.beat;
    });
    return { ok: errors.length === 0, errors: errors };
  }

  function materialKeysFromObject(materials) {
    if (!materials || typeof materials !== "object" || Array.isArray(materials)) return [];
    return Object.keys(materials).filter(function (key) {
      return !utilityIsEmptyish(materials[key]);
    });
  }

  function utilityIsEmptyish(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === "string") return !String(value).trim();
    if (Array.isArray(value)) return !value.length;
    if (typeof value === "object") return !Object.keys(value).length;
    return false;
  }

  function materialPreviewText(value) {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value.slice(0, 240);
    try {
      return JSON.stringify(value).slice(0, 240);
    } catch (_) {
      return String(value).slice(0, 240);
    }
  }

  function findLearningActivityRows(page) {
    if (!page || !Array.isArray(page.sections)) return [];
    var rows = [];
    page.sections.forEach(function (section) {
      if (!section || typeof section !== "object") return;
      var sid = String(section.section_id || section.id || "").toLowerCase();
      var heading = String(section.heading || section.title || "").toLowerCase();
      if (sid !== "learning_activities" && heading.indexOf("learning activit") === -1) return;
      var content = section.content;
      if (Array.isArray(content)) rows = rows.concat(content);
      else if (content && typeof content === "object" && Array.isArray(content.activities)) {
        rows = rows.concat(content.activities);
      } else if (content && typeof content === "object" && Array.isArray(content.content)) {
        rows = rows.concat(content.content);
      }
    });
    return rows;
  }

  function episodeFunctionLabel(episodeFunction) {
    var fn = normalizeEpisodeFunction(episodeFunction);
    if (!fn) return "";
    if (EPISODE_FUNCTION_LABELS[fn]) return EPISODE_FUNCTION_LABELS[fn];
    return fn
      .split("_")
      .filter(function (part) {
        return !!part;
      })
      .map(function (part) {
        return part.charAt(0).toUpperCase() + part.slice(1);
      })
      .join(" ");
  }

  function materialMatchesEpisodeFunction(materialKey, episodeFunction) {
    var fn = normalizeEpisodeFunction(episodeFunction);
    if (!fn) return false;
    var entry = getRegistryEntry(materialKey);
    if (!entry) return false;
    if (entry.episodeFunctions && entry.episodeFunctions.length) {
      return entry.episodeFunctions.indexOf(fn) !== -1;
    }
    var rendererBeat = resolveBeatForEpisodeFunction(fn);
    if (!rendererBeat) return false;
    return normalizeBeat(entry.beat) === rendererBeat;
  }

  /**
   * Resolve episode-plan beats to owning material keys (registry lookups only).
   * Returns non-empty beat groups in episode-plan order.
   */
  function resolveBeatMaterialPlan(activity) {
    var materials =
      activity && activity.materials && typeof activity.materials === "object"
        ? activity.materials
        : {};
    var keys = materialKeysFromObject(materials);
    var episodePlan =
      activity && activity.episode_plan && typeof activity.episode_plan === "object"
        ? activity.episode_plan
        : null;
    var beatRows =
      episodePlan && Array.isArray(episodePlan.beats) ? episodePlan.beats : [];
    var assigned = {};
    var groups = [];

    beatRows.forEach(function (beatRow) {
      var fn = normalizeEpisodeFunction(beatRow && beatRow.function);
      if (!fn) return;
      var matchedKeys = [];
      keys.forEach(function (key) {
        if (assigned[key]) return;
        if (!materialMatchesEpisodeFunction(key, fn)) return;
        matchedKeys.push(key);
        assigned[key] = fn;
      });
      groups.push({
        beat: fn,
        label: episodeFunctionLabel(fn),
        renderer_beat: resolveBeatForEpisodeFunction(fn),
        materials: matchedKeys.slice()
      });
    });

    keys.forEach(function (key) {
      if (assigned[key]) return;
      var entry = getRegistryEntry(key);
      if (!entry) return;
      for (var i = 0; i < groups.length; i += 1) {
        var groupFn = groups[i].beat;
        var rendererBeat = groups[i].renderer_beat;
        if (!rendererBeat) continue;
        if (entry.episodeFunctions && entry.episodeFunctions.length) continue;
        if (normalizeBeat(entry.beat) !== rendererBeat) continue;
        groups[i].materials.push(key);
        assigned[key] = groupFn;
        break;
      }
    });

    var unassigned = keys.filter(function (key) {
      return !assigned[key];
    });

    groups.forEach(function (group) {
      group.materials.sort(function (a, b) {
        return keys.indexOf(a) - keys.indexOf(b);
      });
    });

    return {
      activity_id: String((activity && activity.activity_id) || "").trim() || "activity",
      beats: groups,
      unassigned: unassigned
    };
  }

  function resolveBeatMaterials(activity) {
    var plan = resolveBeatMaterialPlan(activity);
    return plan.beats.filter(function (group) {
      return group.materials && group.materials.length;
    });
  }

  function buildBeatRenderDiagnostic(activity) {
    var plan = resolveBeatMaterialPlan(activity);
    return {
      activity: plan.activity_id,
      beats: plan.beats
        .filter(function (group) {
          return group.materials && group.materials.length;
        })
        .map(function (group) {
          return {
            beat: group.beat,
            materials: group.materials.slice()
          };
        })
    };
  }

  function diagnoseActivityBeatMaterialCoverage(activity, options) {
    var opts = options && typeof options === "object" ? options : {};
    var activityId = String((activity && activity.activity_id) || "").trim() || "activity";
    var materials =
      activity && activity.materials && typeof activity.materials === "object"
        ? activity.materials
        : {};
    var keys = materialKeysFromObject(materials);
    var beatCoverage = {};
    var unassignedMaterials = [];
    var conflicts = [];
    var assignedByBeat = {};

    keys.forEach(function (key) {
      var resolution = resolveMaterialBeat(key, materialPreviewText(materials[key]), opts);
      if (!resolution.registered) {
        unassignedMaterials.push({
          activity_id: activityId,
          material_key: key,
          reason: "material type not in beat-material registry"
        });
        return;
      }
      if (resolution.conflict) {
        conflicts.push({
          activity_id: activityId,
          material_key: key,
          beats: resolution.beats.slice(),
          sources: resolution.sources.slice(),
          message:
            "Material " +
            key +
            " resolves to multiple beats: " +
            resolution.beats.join(", ") +
            " (sources: " +
            resolution.sources.join(", ") +
            ")"
        });
        return;
      }
      var beat = resolution.beat;
      if (!beat) return;
      if (!beatCoverage[beat]) beatCoverage[beat] = [];
      beatCoverage[beat].push(key);
      if (!assignedByBeat[beat]) assignedByBeat[beat] = [];
      assignedByBeat[beat].push(key);
    });

    var emptyBeats = [];
    var plannedBeats = [];
    var episodePlan =
      activity && activity.episode_plan && typeof activity.episode_plan === "object"
        ? activity.episode_plan
        : null;
    if (episodePlan && Array.isArray(episodePlan.beats)) {
      episodePlan.beats.forEach(function (beatRow, index) {
        var fn = normalizeEpisodeFunction(beatRow && beatRow.function);
        var rendererBeat = resolveBeatForEpisodeFunction(fn);
        if (!rendererBeat) return;
        plannedBeats.push({
          index: index,
          function: fn,
          beat: rendererBeat
        });
        var covered = assignedByBeat[rendererBeat] && assignedByBeat[rendererBeat].length;
        if (!covered) {
          emptyBeats.push({
            activity_id: activityId,
            beat: rendererBeat,
            episode_function: fn,
            beat_index: index,
            message:
              "Episode plan beat " +
              fn +
              " (" +
              rendererBeat +
              ") has no assigned material on activity " +
              activityId
          });
        }
      });
    }

    return {
      activity_id: activityId,
      beat_coverage: beatCoverage,
      unassigned_materials: unassignedMaterials,
      empty_beats: emptyBeats,
      conflicts: conflicts,
      planned_beats: plannedBeats,
      material_count: keys.length
    };
  }

  function validatePageBeatMaterialClosure(page, options) {
    var opts = options && typeof options === "object" ? options : {};
    var registryCheck = validateRegistryIntegrity();
    var messages = [];
    if (!registryCheck.ok) {
      messages = messages.concat(registryCheck.errors);
    }

    var rows = findLearningActivityRows(page);
    if (!rows.length) {
      return {
        validation: "page_beat_material_closure",
        outcome: registryCheck.ok ? "skip" : "fail",
        messages: messages,
        diagnostics: {
          activities: [],
          beat_coverage: {},
          unassigned_materials: [],
          empty_beats: [],
          conflicts: []
        }
      };
    }

    var allCoverage = {};
    var allUnassigned = [];
    var allEmpty = [];
    var allConflicts = [];
    var activityDiagnostics = [];

    rows.forEach(function (row) {
      var diag = diagnoseActivityBeatMaterialCoverage(row, opts);
      activityDiagnostics.push(diag);
      allUnassigned = allUnassigned.concat(diag.unassigned_materials);
      allEmpty = allEmpty.concat(diag.empty_beats);
      allConflicts = allConflicts.concat(diag.conflicts);
      Object.keys(diag.beat_coverage).forEach(function (beat) {
        if (!allCoverage[beat]) allCoverage[beat] = [];
        diag.beat_coverage[beat].forEach(function (matKey) {
          var token = String(diag.activity_id) + ":" + matKey;
          if (allCoverage[beat].indexOf(token) === -1) allCoverage[beat].push(token);
        });
      });
    });

    allConflicts.forEach(function (c) {
      messages.push(c.message);
    });
    allUnassigned.forEach(function (u) {
      messages.push(
        "Unassigned material on activity " +
          u.activity_id +
          ": materials." +
          u.material_key +
          " (" +
          u.reason +
          ")"
      );
    });
    if (opts.requireEpisodePlanCoverage !== false) {
      allEmpty.forEach(function (e) {
        messages.push(e.message);
      });
    }

    var outcome = "pass";
    if (!registryCheck.ok || allConflicts.length) outcome = "fail";
    else if (allUnassigned.length || allEmpty.length) outcome = "warn";

    return {
      validation: "page_beat_material_closure",
      outcome: outcome,
      messages: messages,
      diagnostics: {
        activities: activityDiagnostics,
        beat_coverage: allCoverage,
        unassigned_materials: allUnassigned,
        empty_beats: allEmpty,
        conflicts: allConflicts
      }
    };
  }

  function semanticIconForMaterialType(materialType) {
    var resolved = resolveBeatForMaterialType(materialType);
    return resolved ? resolved.semanticIcon : "GENERIC";
  }

  function modifierClassForMaterialType(materialType) {
    var resolved = resolveBeatForMaterialType(materialType);
    return resolved ? resolved.modifierClass : "util-generic-material-icon";
  }

  function materialSemanticIconMap() {
    var map = {};
    MATERIAL_BEAT_REGISTRY.forEach(function (row) {
      map[normalizeMaterialType(row.materialType)] = row.semanticIcon || "GENERIC";
    });
    return map;
  }

  return {
    REGISTRY_VERSION: REGISTRY_VERSION,
    MATERIAL_BEAT_REGISTRY: MATERIAL_BEAT_REGISTRY,
    EPISODE_FUNCTION_BEATS: EPISODE_FUNCTION_BEATS,
    normalizeMaterialType: normalizeMaterialType,
    normalizeBeat: normalizeBeat,
    getRegistryEntry: getRegistryEntry,
    resolveBeatForMaterialType: resolveBeatForMaterialType,
    resolveBeatForEpisodeFunction: resolveBeatForEpisodeFunction,
    resolveMaterialBeat: resolveMaterialBeat,
    resolveBeatMaterialPlan: resolveBeatMaterialPlan,
    resolveBeatMaterials: resolveBeatMaterials,
    buildBeatRenderDiagnostic: buildBeatRenderDiagnostic,
    episodeFunctionLabel: episodeFunctionLabel,
    EPISODE_FUNCTION_LABELS: EPISODE_FUNCTION_LABELS,
    materialMatchesEpisodeFunction: materialMatchesEpisodeFunction,
    validateRegistryIntegrity: validateRegistryIntegrity,
    diagnoseActivityBeatMaterialCoverage: diagnoseActivityBeatMaterialCoverage,
    validatePageBeatMaterialClosure: validatePageBeatMaterialClosure,
    semanticIconForMaterialType: semanticIconForMaterialType,
    modifierClassForMaterialType: modifierClassForMaterialType,
    materialSemanticIconMap: materialSemanticIconMap,
    findLearningActivityRows: findLearningActivityRows
  };
});
