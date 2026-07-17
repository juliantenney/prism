/**
 * LD-BEAT-ASSIGNMENT-COMPOSE — authoritative learner-facing beat assembly.
 *
 * Source-of-truth hierarchy:
 * 1. activity.episode_plan.beats — exact beat count and order
 * 2. activity.learner_task — numbered instruction units and relative material order
 * 3. activity.materials[] — content by material_id / material_type (never array index alone)
 * 4. prompt fields — orientation / reflection content (do not invent beats)
 *
 * Do not merge top-level episode_plans[] into activity.episode_plan.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_LD_BEAT_ASSIGNMENT_COMPOSE = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var MODULE_ID = "LD-BEAT-ASSIGNMENT-COMPOSE";

  var BEAT_LABELS = {
    orientation: "Reflect",
    explanation: "Understand",
    observation: "Understand",
    worked_example: "See it modelled",
    worked_thinking: "See it modelled",
    worked_judgement: "See it modelled",
    example: "See it modelled",
    comparison: "See it modelled",
    analysis: "Your turn",
    practice: "Your turn",
    application: "Your turn",
    evaluation: "Your turn",
    guided_practice: "Your turn",
    check_understanding: "Check your work",
    verification: "Check your work",
    reflection: "Apply elsewhere",
    transfer: "Apply elsewhere"
  };

  /** Preferred material types for each episode-plan function. */
  var BEAT_MATERIAL_TYPES = {
    orientation: ["text", "exposition", "criteria_exposition", "reading", "reference_table"],
    explanation: ["text", "exposition", "reading", "modelling_note", "reference_table"],
    worked_example: ["worked_example", "sample_output", "modelling_note"],
    worked_thinking: ["worked_example", "sample_output", "modelling_note"],
    comparison: ["scenario", "sample_output", "worked_example", "text"],
    analysis: ["scenario", "analysis_table", "decision_table", "classification_table"],
    practice: ["scenario", "decision_table", "analysis_table", "checklist", "task_card", "template"],
    guided_practice: [
      "decision_table",
      "template",
      "analysis_table",
      "comparison_table",
      "checklist",
      "task_card"
    ],
    guided_inquiry: ["prompt_set", "prompt"],
    application: ["prompt_set", "prompt", "prompts"],
    evaluation: ["comparison_table", "template", "checklist", "scenario", "sample_output"],
    check_understanding: ["checklist", "worked_example", "sample_output"],
    verification: ["checklist"],
    reflection: ["transfer_prompt", "consolidation_summary"],
    transfer: ["transfer_prompt", "consolidation_summary"]
  };

  var CHECK_LIKE = {
    check_understanding: true,
    verification: true,
    evaluation: true,
    practice: true
  };

  var MODEL_LIKE = {
    worked_example: true,
    worked_thinking: true,
    worked_judgement: true,
    example: true,
    comparison: true
  };

  function normalizeFn(value) {
    return String(value == null ? "" : value)
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, "_");
  }

  function normalizeType(value) {
    var t = String(value == null ? "" : value)
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, "_");
    if (t === "scenarios") return "scenario";
    if (t === "task_cards") return "task_card";
    if (t === "prompts" || t === "prompt") return "prompt_set";
    if (t === "checklists") return "checklist";
    if (t === "examples") return "worked_example";
    return t;
  }

  function beatLabel(fn) {
    var key = normalizeFn(fn);
    if (BEAT_LABELS[key]) return BEAT_LABELS[key];
    return key
      .split("_")
      .filter(Boolean)
      .map(function (part) {
        return part.charAt(0).toUpperCase() + part.slice(1);
      })
      .join(" ");
  }

  function parseNumberedSteps(learnerTask) {
    var text = String(learnerTask == null ? "" : learnerTask).trim();
    if (!text) return [];
    if (!/(?:^|\n)\s*\d+[.)]\s+/.test(text)) {
      return text ? [{ number: 1, text: text, clauses: [text] }] : [];
    }
    var parts = text.split(/(?:^|\n)\s*\d+[.)]\s+/).filter(function (p) {
      return !!String(p || "").trim();
    });
    return parts.map(function (part, idx) {
      var stepText = String(part || "").trim().replace(/^\s*[-*•]\s+/, "").trim();
      return {
        number: idx + 1,
        text: stepText,
        clauses: splitCompoundClauses(stepText)
      };
    });
  }

  function capitalizeClause(text) {
    var raw = String(text || "").trim();
    if (!raw) return "";
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }

  function splitCompoundClauses(stepText) {
    var raw = String(stepText || "").trim();
    if (!raw) return [];
    var m2 = raw.match(
      /^(complete the final verification checklist)\s+and\s+(read the session consolidation summary\.?)$/i
    );
    if (m2) {
      return [capitalizeClause(m2[1]), capitalizeClause(m2[2])].filter(Boolean);
    }
    return [raw];
  }

  function flattenAuthoredInstruction(value) {
    if (value == null || value === "") return [];
    if (typeof value === "string") {
      var text = String(value).trim();
      return text ? [text] : [];
    }
    if (Array.isArray(value)) {
      return value.reduce(function (acc, entry) {
        return acc.concat(flattenAuthoredInstruction(entry));
      }, []);
    }
    if (typeof value === "object") {
      return Object.keys(value).reduce(function (acc, key) {
        return acc.concat(flattenAuthoredInstruction(value[key]));
      }, []);
    }
    return [String(value)];
  }

  function listMaterialsFromActivity(activity) {
    var materials = activity && activity.materials;
    var out = [];
    if (Array.isArray(materials)) {
      materials.forEach(function (entry, index) {
        if (!entry || typeof entry !== "object") return;
        out.push({
          material_id: String(entry.material_id || "").trim(),
          material_type: normalizeType(
            entry.material_type || entry.type || entry.materialType || entry.kind
          ),
          title: String(entry.title || "").trim(),
          storageKey: "",
          index: index
        });
      });
      return out;
    }
    if (!materials || typeof materials !== "object") return out;
    var sequence = Array.isArray(materials._render_sequence)
      ? materials._render_sequence
      : null;
    if (sequence && sequence.length) {
      sequence.forEach(function (entry, index) {
        if (!entry) return;
        var key = String(entry.key || "").trim();
        if (!key) return;
        out.push({
          material_id: String(
            entry.material_id || (materials._material_ids && materials._material_ids[key]) || ""
          ).trim(),
          material_type: normalizeType(
            entry.material_type ||
              (materials._material_types && materials._material_types[key]) ||
              key
          ),
          title: "",
          storageKey: key,
          index: index
        });
      });
      return out;
    }
    Object.keys(materials).forEach(function (key, index) {
      if (key.charAt(0) === "_") return;
      out.push({
        material_id:
          (materials._material_ids && materials._material_ids[key]) || "",
        material_type: normalizeType(
          (materials._material_types && materials._material_types[key]) || key
        ),
        title: "",
        storageKey: key,
        index: index
      });
    });
    return out;
  }

  function hasBeat(groups, fn) {
    var key = normalizeFn(fn);
    for (var i = 0; i < groups.length; i += 1) {
      if (groups[i].beat === key) return true;
    }
    return false;
  }

  function findBeatIndexes(groups, pred) {
    var idxs = [];
    groups.forEach(function (g, i) {
      if (pred(g, i)) idxs.push(i);
    });
    return idxs;
  }

  function scoreMaterialForBeat(materialType, beatFn, groups) {
    var type = normalizeType(materialType);
    var fn = normalizeFn(beatFn);
    var preferred = BEAT_MATERIAL_TYPES[fn] || [];
    var score = 0;
    var prefIdx = preferred.indexOf(type);
    if (prefIdx !== -1) score += 100 - prefIdx;

    if (
      (type === "worked_example" || type === "sample_output" || type === "modelling_note") &&
      CHECK_LIKE[fn]
    ) {
      var hasModelBeat = groups.some(function (g) {
        return MODEL_LIKE[g.beat];
      });
      if (hasModelBeat) score -= 80;
      else score += 25;
    }

    if (type === "checklist" && CHECK_LIKE[fn]) score += 40;
    if (type === "transfer_prompt" && (fn === "reflection" || fn === "transfer")) score += 80;
    if (type === "consolidation_summary" && (fn === "reflection" || fn === "transfer")) score += 80;
    if (type === "prompt_set" && (fn === "application" || fn === "guided_inquiry")) score += 80;
    if (type === "template" && (fn === "guided_practice" || fn === "practice" || fn === "evaluation")) {
      score += 50;
    }
    if (type === "decision_table" && (fn === "guided_practice" || fn === "practice" || fn === "analysis")) {
      score += 50;
    }
    if (type === "reference_table" && fn === "explanation") score += 50;
    if (
      (type === "text" || type === "exposition") &&
      fn === "orientation" &&
      !hasBeat(groups, "explanation")
    ) {
      score += 30;
    }
    if ((type === "text" || type === "exposition") && fn === "explanation") score += 20;
    if (type === "modelling_note" && fn === "explanation") score += 50;
    return score;
  }

  function chooseSinkBeatIndex(groups, materialType) {
    var type = normalizeType(materialType);
    var priority = [
      "check_understanding",
      "evaluation",
      "practice",
      "analysis",
      "application",
      "reflection",
      "explanation",
      "worked_example"
    ];
    if (type === "worked_example" || type === "sample_output") {
      priority = [
        "worked_example",
        "worked_thinking",
        "comparison",
        "check_understanding",
        "evaluation",
        "practice"
      ];
    }
    if (type === "checklist") {
      priority = ["check_understanding", "verification", "evaluation", "practice", "guided_practice"];
    }
    if (type === "transfer_prompt" || type === "consolidation_summary") {
      priority = ["transfer", "reflection"];
    }
    if (type === "template" || type === "decision_table") {
      priority = ["guided_practice", "practice", "evaluation", "analysis"];
    }
    for (var p = 0; p < priority.length; p += 1) {
      for (var i = 0; i < groups.length; i += 1) {
        if (groups[i].beat === priority[p]) return i;
      }
    }
    for (var j = groups.length - 1; j >= 0; j -= 1) {
      if (groups[j].beat !== "orientation") return j;
    }
    return groups.length ? groups.length - 1 : -1;
  }

  function scoreClauseForBeat(clauseText, beatFn, materialTypesOnBeat) {
    var text = String(clauseText || "").toLowerCase();
    var fn = normalizeFn(beatFn);
    var score = 0;
    var hints = [
      {
        re: /explanatory text|explanation of how|mechanism linking|why economists care|how the problem affects/i,
        beats: ["explanation"]
      },
      {
        re: /worked example|worked analytical|modelled economic|process walkthrough|worked judgement|research scenarios/i,
        beats: ["worked_example", "worked_thinking", "comparison"]
      },
      {
        re: /sample response|sample output|sample explanation/i,
        beats: ["worked_example", "check_understanding", "comparison"]
      },
      {
        re: /residual plot scenarios|analysis table|decision table|provided scenarios|economic scenarios|comparison and decision framework|independent written judgement|judgement template|evaluation framework|record whether the evidence|suggests heteroscedasticity and explain/i,
        beats: ["analysis", "practice", "evaluation"]
      },
      {
        re: /prompt set|chain of effects/i,
        beats: ["application"]
      },
      {
        re: /checklist|self-check|verify your|verification checklist|analysis verification|application check|inference check|evaluation checklist/i,
        beats: ["check_understanding", "verification", "evaluation", "practice"]
      },
      {
        re: /criteria reminder|review the criteria reminder/i,
        beats: ["explanation", "orientation"]
      },
      {
        re: /judgement memo|decision table|complete the judgement|template independently/i,
        beats: ["guided_practice", "practice", "evaluation"]
      },
      {
        re: /transfer prompt|consolidation summary|take forward/i,
        beats: ["transfer", "reflection"]
      },
      {
        re: /transfer task|key takeaways|another economic variable/i,
        beats: ["reflection", "transfer"]
      },
      {
        re: /write a brief explanation|in your own words/i,
        beats: ["check_understanding", "verification", "practice"]
      },
      {
        re: /study the criteria|detection and remedy/i,
        beats: ["orientation", "explanation"]
      },
      {
        re: /decide whether each case|identifying patterns in residual spread/i,
        beats: ["analysis", "practice"]
      }
    ];
    hints.forEach(function (hint) {
      if (!hint.re.test(text)) return;
      if (hint.beats.indexOf(fn) !== -1) score += 20;
    });
    (materialTypesOnBeat || []).forEach(function (mt) {
      var t = normalizeType(mt);
      if (t === "worked_example" && /worked|expert example|modelled|analytical pass/i.test(text)) {
        score += 15;
      }
      if (t === "sample_output" && /sample/i.test(text)) score += 15;
      if (t === "checklist" && /checklist|self-check|verify/i.test(text)) score += 15;
      if (t === "scenario" && /scenario|cases|plot/i.test(text)) score += 12;
      if (t === "analysis_table" && /analysis table/i.test(text)) score += 12;
      if (t === "decision_table" && /decision table|table/i.test(text)) score += 12;
      if (t === "prompt_set" && /prompt set|chain/i.test(text)) score += 15;
      if (t === "text" && /explanatory text|criteria|explanation/i.test(text)) score += 12;
      if (t === "transfer_prompt" && /transfer/i.test(text)) score += 15;
      if (t === "consolidation_summary" && /consolidation|takeaway/i.test(text)) score += 15;
      if (t === "comparison_table" && /framework|comparison/i.test(text)) score += 12;
      if (t === "template" && /template|written judgement/i.test(text)) score += 12;
    });
    return score;
  }

  function earliestStepMention(steps, materialType, title) {
    var type = normalizeType(materialType);
    var titleLower = String(title || "").toLowerCase();
    var best = Number.MAX_SAFE_INTEGER;
    steps.forEach(function (step) {
      var clauses = step.clauses || [step.text];
      clauses.forEach(function (clause) {
        var text = String(clause || "").toLowerCase();
        var hit = false;
        if (type === "worked_example" && /worked|expert example|analytical pass|modelled/i.test(text)) {
          hit = true;
        }
        if (type === "sample_output" && /sample/i.test(text)) hit = true;
        if (type === "checklist" && /checklist|self-check|verify/i.test(text)) hit = true;
        if (type === "scenario" && /scenario|cases|plot scenarios/i.test(text)) hit = true;
        if (type === "analysis_table" && /analysis table/i.test(text)) hit = true;
        if (type === "decision_table" && /decision table/i.test(text)) hit = true;
        if (type === "text" && /explanatory text|criteria|explanation of how|why economists/i.test(text)) {
          hit = true;
        }
        if (type === "prompt_set" && /prompt set|chain of effects/i.test(text)) hit = true;
        if (type === "transfer_prompt" && /transfer/i.test(text)) hit = true;
        if (type === "consolidation_summary" && /consolidation|takeaway/i.test(text)) hit = true;
        if (type === "comparison_table" && /framework|comparison and decision/i.test(text)) hit = true;
        if (type === "template" && /template|written judgement/i.test(text)) hit = true;
        if (type === "modelling_note" && /mechanism|linking changing/i.test(text)) hit = true;
        if (titleLower && text.indexOf(titleLower.slice(0, 24)) !== -1) hit = true;
        if (hit) best = Math.min(best, step.number);
      });
    });
    return best;
  }

  function resolvePromptField(activity, beatFn) {
    var fn = normalizeFn(beatFn);
    if (fn === "orientation") {
      if (activity.self_explanation_prompt) {
        return { field: "self_explanation_prompt", text: String(activity.self_explanation_prompt) };
      }
      if (activity.conceptual_contrast_prompt) {
        return {
          field: "conceptual_contrast_prompt",
          text: String(activity.conceptual_contrast_prompt)
        };
      }
      return null;
    }
    if (fn === "reflection" || fn === "transfer") {
      if (activity.transfer_or_application_task) {
        return {
          field: "transfer_or_application_task",
          text: String(activity.transfer_or_application_task)
        };
      }
    }
    return null;
  }

  function composeActivityBeatAssignments(activity) {
    var activityId = String((activity && (activity.activity_id || activity.id)) || "").trim();
    var episodePlan =
      activity && activity.episode_plan && typeof activity.episode_plan === "object"
        ? activity.episode_plan
        : null;
    var beatRows =
      episodePlan && Array.isArray(episodePlan.beats) ? episodePlan.beats : [];
    if (!beatRows.length) {
      return { activityId: activityId, beats: [], module: MODULE_ID };
    }

    var groups = beatRows.map(function (row) {
      var fn = normalizeFn(row && row.function);
      var rowTitle = row && row.title ? String(row.title).trim() : "";
      return {
        beat: fn,
        label: rowTitle || beatLabel(fn),
        title: rowTitle,
        taskStepNumbers: [],
        materialIds: [],
        storageKeys: [],
        materialTypes: [],
        instructions: [],
        promptField: null,
        promptText: null,
        includeExpectedOutput: false,
        authoredInstruction:
          row && (row.what_to_do || row.whatToDo || row.instruction || row.instructions)
            ? row.what_to_do || row.whatToDo || row.instruction || row.instructions
            : null
      };
    });

    var materials = listMaterialsFromActivity(activity);
    var steps = parseNumberedSteps(activity && activity.learner_task);
    var assignedMaterial = {};

    groups.forEach(function (group) {
      var prompt = resolvePromptField(activity, group.beat);
      if (!prompt) return;
      group.promptField = prompt.field;
      group.promptText = prompt.text;
    });

    materials.forEach(function (mat) {
      if (!mat.material_id && !mat.storageKey) return;
      var bestIdx = -1;
      var bestScore = 0;
      groups.forEach(function (group, idx) {
        var score = scoreMaterialForBeat(mat.material_type, group.beat, groups);
        if (score > bestScore) {
          bestScore = score;
          bestIdx = idx;
        }
      });
      if (bestIdx < 0 || bestScore <= 0) {
        bestIdx = chooseSinkBeatIndex(groups, mat.material_type);
      }
      if (bestIdx < 0) return;
      var id = mat.material_id || mat.storageKey;
      if (assignedMaterial[id]) return;
      assignedMaterial[id] = true;
      groups[bestIdx].materialIds.push(mat.material_id || "");
      if (mat.storageKey) groups[bestIdx].storageKeys.push(mat.storageKey);
      groups[bestIdx].materialTypes.push(mat.material_type);
    });

    groups.forEach(function (group) {
      var enriched = [];
      for (var i = 0; i < group.materialIds.length; i += 1) {
        var mid = group.materialIds[i];
        var sk = group.storageKeys[i] || "";
        var mt = group.materialTypes[i] || "";
        var src = null;
        for (var m = 0; m < materials.length; m += 1) {
          if (mid && materials[m].material_id === mid) {
            src = materials[m];
            break;
          }
          if (sk && materials[m].storageKey === sk) {
            src = materials[m];
            break;
          }
        }
        enriched.push({
          material_id: mid,
          storageKey: sk || (src && src.storageKey) || "",
          material_type: mt || (src && src.material_type) || "",
          title: (src && src.title) || "",
          mention: earliestStepMention(steps, mt || (src && src.material_type), src && src.title),
          sourceIndex: src ? src.index : i
        });
      }
      enriched.sort(function (a, b) {
        var aCheck = a.material_type === "checklist" ? 1 : 0;
        var bCheck = b.material_type === "checklist" ? 1 : 0;
        if (aCheck !== bCheck) return aCheck - bCheck;
        if (a.mention !== b.mention) return a.mention - b.mention;
        return a.sourceIndex - b.sourceIndex;
      });
      group.materialIds = enriched.map(function (e) {
        return e.material_id;
      });
      group.storageKeys = enriched.map(function (e) {
        return e.storageKey;
      });
      group.materialTypes = enriched.map(function (e) {
        return e.material_type;
      });
    });

    var usedClauses = {};
    steps.forEach(function (step) {
      (step.clauses || [step.text]).forEach(function (clause, clauseIdx) {
        var clauseKey = step.number + ":" + clauseIdx;
        var bestIdx = -1;
        var bestScore = 0;
        groups.forEach(function (group, idx) {
          var score = scoreClauseForBeat(clause, group.beat, group.materialTypes);
          if (group.beat === "orientation" && group.promptText && score < 25) {
            score -= 5;
          }
          if (score > bestScore) {
            bestScore = score;
            bestIdx = idx;
          }
        });
        if (bestIdx < 0 || bestScore <= 0) {
          var contentIdxs = findBeatIndexes(groups, function (g) {
            return g.beat !== "orientation" || g.materialIds.length;
          });
          if (!contentIdxs.length) {
            contentIdxs = findBeatIndexes(groups, function () {
              return true;
            });
          }
          if (step.number <= 1) bestIdx = contentIdxs[0];
          else bestIdx = contentIdxs[contentIdxs.length - 1];
        }
        if (bestIdx < 0 || usedClauses[clauseKey]) return;
        usedClauses[clauseKey] = true;
        groups[bestIdx].instructions.push(String(clause || "").trim());
        if (groups[bestIdx].taskStepNumbers.indexOf(step.number) === -1) {
          groups[bestIdx].taskStepNumbers.push(step.number);
        }
      });
    });

    groups.forEach(function (group) {
      var authored = flattenAuthoredInstruction(group.authoredInstruction);
      if (authored.length) {
        group.instructions = authored;
        return;
      }
      if (group.promptText && group.beat === "orientation") {
        group.instructions = [String(group.promptText).trim()];
        return;
      }
      if (group.promptText && (group.beat === "reflection" || group.beat === "transfer")) {
        // Prefer the authored transfer/application prompt over stray learner-task clauses.
        if (!group.materialIds.length) {
          group.instructions = [String(group.promptText).trim()];
          return;
        }
      }
      if (!group.instructions.length && group.promptText) {
        group.instructions.push(String(group.promptText).trim());
      }
    });

    var expected = activity && activity.expected_output;
    if (expected && String(expected).trim()) {
      var checklistBeat = -1;
      groups.forEach(function (g, idx) {
        if (g.materialTypes.indexOf("checklist") !== -1) checklistBeat = idx;
      });
      if (checklistBeat >= 0) {
        groups[checklistBeat].includeExpectedOutput = true;
      } else {
        for (var c = 0; c < groups.length; c += 1) {
          if (CHECK_LIKE[groups[c].beat]) {
            groups[c].includeExpectedOutput = true;
            break;
          }
        }
      }
    }

    var matsObj =
      activity && activity.materials && !Array.isArray(activity.materials)
        ? activity.materials
        : null;
    if (matsObj && matsObj._material_ids) {
      groups.forEach(function (group) {
        group.storageKeys = group.materialIds.map(function (mid, idx) {
          if (group.storageKeys[idx]) return group.storageKeys[idx];
          var found = "";
          Object.keys(matsObj._material_ids).forEach(function (key) {
            if (matsObj._material_ids[key] === mid) found = key;
          });
          return found;
        });
      });
    }

    return {
      activityId: activityId,
      module: MODULE_ID,
      beats: groups
    };
  }

  return {
    MODULE_ID: MODULE_ID,
    BEAT_LABELS: BEAT_LABELS,
    beatLabel: beatLabel,
    parseNumberedSteps: parseNumberedSteps,
    composeActivityBeatAssignments: composeActivityBeatAssignments
  };
});
