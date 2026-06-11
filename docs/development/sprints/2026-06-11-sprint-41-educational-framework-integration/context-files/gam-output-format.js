/**
 * Sprint 38-S — GAM pack text output format validation (compose-compatible bodies).
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.PRISM_GAM_OUTPUT_FORMAT = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  var VERSION = "38S-GAM1";
  var MIN_CHECKLIST_BODY = 80;
  var MIN_TEACHING_BODY = 120;
  var MIN_A4_COMPOSE_BODY = 400;
  var MIN_MATERIALS_DEFAULT = 12;

  function parseJsonSlice(text) {
    var trimmed = String(text || "").trim();
    if (!trimmed) return null;
    var slice = trimmed;
    if (slice.startsWith("```")) {
      var start = slice.indexOf("{");
      var end = slice.lastIndexOf("}");
      if (start !== -1 && end > start) slice = slice.slice(start, end + 1);
    }
    try {
      return JSON.parse(slice);
    } catch (_e) {
      var s = trimmed.indexOf("{");
      var e = trimmed.lastIndexOf("}");
      if (s !== -1 && e > s) {
        try {
          return JSON.parse(trimmed.slice(s, e + 1));
        } catch (_e2) {
          return null;
        }
      }
      return null;
    }
  }

  function detectGamJsonStubOutput(text) {
    var trimmed = String(text || "").trim();
    if (!trimmed.startsWith("{") && trimmed.indexOf("{") === -1) return false;
    var parsed = parseJsonSlice(trimmed);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return false;
    if (parsed.pack && Array.isArray(parsed.pack.activities)) return true;
    if (Array.isArray(parsed.activities)) return true;
    if (Array.isArray(parsed.required_materials)) return true;
    return false;
  }

  function isPackTextGamFormat(text) {
    var head = String(text || "");
    return /Material:\s*\S+\s*\([^)]+\)/i.test(head) && /Content:/i.test(head);
  }

  function parseGamMaterialsFromText(text) {
    var head = String(text || "");
    var materials = [];
    var aidSpans = [];
    var aidMatch;
    var aidRe = /Activity ID:\s*(\S+)/gi;
    while ((aidMatch = aidRe.exec(head)) !== null) {
      aidSpans.push({ aid: aidMatch[1], index: aidMatch.index });
    }
    var matRe =
      /Material:\s*(\S+)\s*\(([^)]+)\)[\s\S]*?Purpose:\s*([^\n]*)\nContent:\s*([\s\S]*?)(?=\n---\n|\nMaterial:|\nActivity:|$)/gi;
    var m;
    while ((m = matRe.exec(head)) !== null) {
      var activity_id = "?";
      var i;
      for (i = aidSpans.length - 1; i >= 0; i--) {
        if (aidSpans[i].index <= m.index) {
          activity_id = aidSpans[i].aid;
          break;
        }
      }
      var content = m[4].trim();
      materials.push({
        activity_id: activity_id,
        material_id: m[1],
        type: m[2].trim(),
        purpose: m[3].trim(),
        content: content,
        contentLen: content.length
      });
    }
    return materials;
  }

  function parseGamMaterialsExtended(gamText) {
    var fromText = parseGamMaterialsFromText(gamText);
    if (fromText.length) return fromText;
    var parsed = parseJsonSlice(gamText);
    if (!parsed || typeof parsed !== "object") return fromText;
    var materials = [];
    var acts = (parsed.pack && parsed.pack.activities) || parsed.activities || [];
    acts.forEach(function (act) {
      (act.required_materials || []).forEach(function (m) {
        var content = m.content || m.specification || m.body || "";
        materials.push({
          activity_id: act.activity_id,
          material_id: m.material_id,
          type: m.type,
          purpose: m.purpose || "",
          content: String(content),
          contentLen: String(content).length
        });
      });
    });
    return materials;
  }

  function minBodyForType(type) {
    var t = String(type || "").toLowerCase();
    if (/checklist|retrieval|self_check/.test(t)) return MIN_CHECKLIST_BODY;
    return MIN_TEACHING_BODY;
  }

  function semanticMarkerSatisfied(markerId, text) {
    var body = String(text || "");
    if (!body) return false;
    switch (markerId) {
      case "strategy_a":
        return /Strategy\s+A\s*:/i.test(body);
      case "strategy_e":
        return /Strategy\s+E\s*:/i.test(body);
      case "weak_worked_judgement":
        return (
          /Weak\s+Judgement/i.test(body) ||
          /Weak\s+Evaluation\s+Example/i.test(body) ||
          /Slogan[- ]style/i.test(body)
        );
      case "strong_worked_judgement":
        return (
          /Strong\s+Judgement/i.test(body) ||
          /Strong\s+Evaluation\s+Example/i.test(body) ||
          /Criteria[- ]led/i.test(body)
        );
      case "transfer_word_band":
        return /at\s+least\s+80\s+words/i.test(body);
      default:
        return body.indexOf(markerId) !== -1;
    }
  }

  function normalizeLearningActivitiesList(source) {
    if (!source) return [];
    if (Array.isArray(source)) return source;
    if (Array.isArray(source.activities)) return source.activities;
    if (Array.isArray(source.learning_activities)) return source.learning_activities;
    return [];
  }

  function resolveA4ActivityId(materials, learningActivities) {
    var acts = normalizeLearningActivitiesList(learningActivities);
    var i;
    for (i = 0; i < acts.length; i += 1) {
      var id = String(acts[i].activity_id || acts[i].activityId || "");
      if (/a4|evaluate.*household/i.test(id)) return id;
    }
    if (acts[3]) {
      return String(acts[3].activity_id || acts[3].activityId || "");
    }
    var seen = [];
    materials.forEach(function (m) {
      var aid = String(m.activity_id || "");
      if (aid && aid !== "?" && seen.indexOf(aid) === -1) seen.push(aid);
    });
    return seen[3] || "";
  }

  function findA4Material(materials, a4Id, matchers) {
    var pool = materials.filter(function (m) {
      return !a4Id || String(m.activity_id || "") === String(a4Id);
    });
    var i;
    for (i = 0; i < pool.length; i += 1) {
      var mat = pool[i];
      var mid = String(mat.material_id || "");
      var type = String(mat.type || "").toLowerCase();
      var purpose = String(mat.purpose || "").toLowerCase();
      var j;
      for (j = 0; j < matchers.length; j += 1) {
        if (matchers[j](mid, type, purpose, mat)) return mat;
      }
    }
    return null;
  }

  /**
   * A4 compose contract — mirrors validate38LPageGamPreservation Tier-A checks pre-compose.
   * @param {Array} materials
   * @param {*} [learningActivities]
   */
  function validateGamActivityCoverage(materials, learningActivities) {
    var acts = normalizeLearningActivitiesList(learningActivities);
    var requiredIds = acts
      .map(function (act) {
        return String(act.activity_id || act.activityId || "");
      })
      .filter(Boolean);
    if (requiredIds.length < 2) return { ok: true, errors: [] };
    var seen = {};
    materials.forEach(function (m) {
      var aid = String(m.activity_id || "");
      if (!aid || aid === "?") return;
      seen[aid] = (seen[aid] || 0) + 1;
    });
    var missing = requiredIds.filter(function (id) {
      return !seen[id];
    });
    if (missing.length) {
      return {
        ok: false,
        errors: ["GAM-FMT-05: missing materials for activities: " + missing.join(", ")]
      };
    }
    return { ok: true, errors: [] };
  }

  function validateGamA4ComposeContract(materials, learningActivities) {
    var errors = [];
    var a4Id = resolveA4ActivityId(materials, learningActivities);
    var scenario = findA4Material(materials, a4Id, [
      function (mid) {
        return /M12|scenario_maya_strategy_menu|A4-scenario/i.test(mid);
      },
      function (_mid, type, purpose, mat) {
        if (type !== "scenario") return false;
        if (/strategy|menu/.test(purpose)) return true;
        var body = String((mat && mat.content) || "");
        return (
          semanticMarkerSatisfied("strategy_a", body) &&
          semanticMarkerSatisfied("strategy_e", body)
        );
      }
    ]);
    var worked = findA4Material(materials, a4Id, [
      function (mid) {
        return /M14|worked_judgement/i.test(mid);
      },
      function (_mid, type, purpose) {
        return (
          (type === "modelling_note" || type === "worked_example") &&
          /worked judgement|worked judgment|weak.*strong/i.test(purpose)
        );
      }
    ]);

    if (!scenario) {
      errors.push("GAM-FMT-06: A4 missing M12 scenario / strategy menu material");
    } else {
      var scenarioBody = String(scenario.content || "");
      var scenarioPurpose = String(scenario.purpose || "").toLowerCase();
      if (!/strategy|menu/.test(scenarioPurpose)) {
        errors.push(
          "GAM-FMT-06: A4 scenario Purpose must mention strategy menu (compose maps scenario_maya_strategy_menu)"
        );
      }
      if (scenarioBody.length < MIN_A4_COMPOSE_BODY) {
        errors.push(
          "GAM-FMT-06: A4 scenario menu body too thin (" + scenarioBody.length + "ch, need >= " + MIN_A4_COMPOSE_BODY + ")"
        );
      }
      if (!semanticMarkerSatisfied("strategy_a", scenarioBody)) {
        errors.push("GAM-FMT-06: A4 scenario missing Strategy A: marker");
      }
      if (!semanticMarkerSatisfied("strategy_e", scenarioBody)) {
        errors.push("GAM-FMT-06: A4 scenario missing Strategy E: marker");
      }
    }

    if (!worked) {
      errors.push("GAM-FMT-07: A4 missing M14 worked judgement weak/strong material");
    } else {
      var workedBody = String(worked.content || "");
      if (workedBody.length < MIN_A4_COMPOSE_BODY) {
        errors.push(
          "GAM-FMT-07: A4 worked judgement body too thin (" + workedBody.length + "ch, need >= " + MIN_A4_COMPOSE_BODY + ")"
        );
      }
      if (!semanticMarkerSatisfied("weak_worked_judgement", workedBody)) {
        errors.push("GAM-FMT-07: A4 worked judgement missing weak evaluation marker");
      }
      if (!semanticMarkerSatisfied("strong_worked_judgement", workedBody)) {
        errors.push("GAM-FMT-07: A4 worked judgement missing strong evaluation marker");
      }
    }

    return { ok: errors.length === 0, errors: errors };
  }

  function normalizeGamPackTextForCompose(text) {
    var out = String(text || "");
    out = out.replace(
      /(Material:\s*A4-scenario\s*\(scenario\)\s*\nPurpose:\s*)scenario(\s*\nContent:)/i,
      "$1Maya household scenario with neutral strategy menu A–E$2"
    );
    out = out.replace(
      /(Material:\s*M12[^\n]*\(scenario\)\s*\nPurpose:\s*)(?!.*strategy)([^\n]*)(\s*\nContent:)/i,
      function (_m, head, purpose, tail) {
        if (/strategy|menu/i.test(purpose)) return _m;
        return head + "Maya household scenario with neutral strategy menu A–E" + tail;
      }
    );
    out = out.replace(
      /(Material:\s*\S+\s*\(transfer_prompt\)\s*\nPurpose:[^\n]*\nContent:\s*)([\s\S]*?)(?=\n---\n|\nMaterial:|\nActivity:|$)/gi,
      function (_m, head, body) {
        var text = String(body || "").trim();
        if (/at\s+least\s+80\s+words/i.test(text)) return _m;
        return (
          head +
          text +
          "\n\nWrite at least 80 words applying the evaluation criteria to your own household or inflation context."
        );
      }
    );
    return out;
  }

  function validateGamTransferPrompts(materials) {
    var errors = [];
    materials.forEach(function (m) {
      var type = String(m.type || "").toLowerCase();
      if (type !== "transfer_prompt" && !/transfer_prompt/.test(type)) return;
      if (!semanticMarkerSatisfied("transfer_word_band", m.content)) {
        errors.push(
          "GAM-FMT-08: " +
            (m.material_id || "transfer_prompt") +
            ' missing "at least 80 words" transfer word-band'
        );
      }
    });
    return { ok: errors.length === 0, errors: errors };
  }

  /**
   * @param {string} text
   * @param {{ minMaterials?: number, minActivities?: number, learningActivities?: * }} [options]
   */
  function validateGamPackTextOutput(text, options) {
    var opts = options || {};
    var errors = [];
    var warnings = [];

    if (detectGamJsonStubOutput(text)) {
      errors.push("GAM-FMT-01: JSON specification stub detected — pack text Material/Content required");
    }

    if (!isPackTextGamFormat(text)) {
      errors.push("GAM-FMT-02: missing Material:/Content: pack text structure");
    }

    var materials = parseGamMaterialsFromText(text);
    var minMaterials = typeof opts.minMaterials === "number" ? opts.minMaterials : MIN_MATERIALS_DEFAULT;
    if (materials.length < minMaterials) {
      errors.push(
        "GAM-FMT-03: parsed " + materials.length + " materials (need >= " + minMaterials + ")"
      );
    }

    var thin = [];
    materials.forEach(function (m) {
      var minLen = minBodyForType(m.type);
      if ((m.contentLen || 0) < minLen) {
        thin.push(m.material_id + ":" + m.contentLen + "ch");
      }
    });
    if (thin.length) {
      errors.push("GAM-FMT-04: thin Content bodies — " + thin.slice(0, 6).join(", "));
    }

    var activityBlocks = (String(text || "").match(/Activity ID:\s*\S+/gi) || []).length;
    var minActs = typeof opts.minActivities === "number" ? opts.minActivities : 4;
    if (opts.learningActivities) {
      var coverage = validateGamActivityCoverage(materials, opts.learningActivities);
      if (!coverage.ok) {
        errors = errors.concat(coverage.errors);
      }
    } else if (activityBlocks < minActs) {
      errors.push("GAM-FMT-05: expected >= " + minActs + " Activity ID blocks, found " + activityBlocks);
    }

    if (errors.length === 0 && materials.length >= minMaterials) {
      var transferCheck = validateGamTransferPrompts(materials);
      if (!transferCheck.ok) {
        errors = errors.concat(transferCheck.errors);
      }
      var a4Check = validateGamA4ComposeContract(materials, opts.learningActivities);
      if (!a4Check.ok) {
        errors = errors.concat(a4Check.errors);
      }
    }

    return {
      ok: errors.length === 0,
      errors: errors,
      warnings: warnings,
      metrics: {
        material_count: materials.length,
        activity_blocks: activityBlocks,
        thin_count: thin.length,
        json_stub: detectGamJsonStubOutput(text)
      }
    };
  }

  function buildGamOutputContractSystemPrompt() {
    return [
      "You execute Generate Activity Materials for a self-directed learner workbook.",
      "Return ONLY pack text format. Do NOT return JSON. Do NOT return a DLA object or fenced JSON block.",
      "Use this exact structure for every material:",
      "Activity: <title>",
      "Activity ID: <activity_id matching upstream A1, A2, A3, A4>",
      "Mapped outcomes: <outcomes>",
      "",
      "Emit ALL four activities — one Activity ID block per upstream activity before its materials.",
      "",
      "Material: <material_id> (<type>)",
      "Purpose: <purpose>",
      "Content:",
      "<full learner-facing body>",
      "---",
      "Realise every DLA specification into substantive Content — not specification restatement.",
      "Checklists >= 80 characters with repair instructions. Teaching materials >= 120 words when depth_floor L3.",
      "A4 Evaluate (M12 / A4-scenario): scenario Purpose must include 'strategy menu'; Content must include Strategy A: through Strategy E: with Maya household context (>= 400 chars).",
      "A4 Evaluate (M14): worked judgement must contrast Weak Evaluation Example and Strong Evaluation Example (>= 400 chars).",
      "All transfer_prompt materials must include: Write at least 80 words ...",
      "Preserve DLA required_materials order within each activity.",
      "Forbidden: { \"pack\": ... }, required_materials[] JSON arrays, or Content that only repeats the specification."
    ].join("\n");
  }

  function buildGamOutputContractRetryHint(validation) {
    var errs = (validation && validation.errors) || [];
    return (
      "OUTPUT REJECTED — " +
      errs.join("; ") +
      ". Return ONLY pack text with Activity ID, Material:, Purpose:, Content: blocks and full realised bodies. NO JSON."
    );
  }

  return {
    VERSION: VERSION,
    detectGamJsonStubOutput: detectGamJsonStubOutput,
    isPackTextGamFormat: isPackTextGamFormat,
    parseGamMaterialsFromText: parseGamMaterialsFromText,
    parseGamMaterialsExtended: parseGamMaterialsExtended,
    validateGamActivityCoverage: validateGamActivityCoverage,
    validateGamA4ComposeContract: validateGamA4ComposeContract,
    normalizeGamPackTextForCompose: normalizeGamPackTextForCompose,
    validateGamPackTextOutput: validateGamPackTextOutput,
    buildGamOutputContractSystemPrompt: buildGamOutputContractSystemPrompt,
    buildGamOutputContractRetryHint: buildGamOutputContractRetryHint
  };
});
