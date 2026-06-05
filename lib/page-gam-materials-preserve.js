/**
 * GAM → Design Page materials preservation (L4 compose merge).
 * Overlays upstream activity_materials onto composed page JSON when LLM compose thins or placeholders.
 */
(function (root, factory) {
  "use strict";
  var api = factory(
    root && root.PRISM_DESIGN_PAGE_MATERIALS_FIDELITY
      ? root.PRISM_DESIGN_PAGE_MATERIALS_FIDELITY
      : null
  );
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_PAGE_GAM_MATERIALS_PRESERVE = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function (fidelityLib) {
  "use strict";

  var fidelity = fidelityLib || {};

  function stringLooksPlaceholderOnly(text) {
    if (fidelity.stringLooksPlaceholderOnly) {
      return fidelity.stringLooksPlaceholderOnly(text);
    }
    var trimmed = String(text || "").trim();
    return !trimmed || trimmed.length < 48;
  }

  function normalizeActivityKey(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "");
  }

  function isLearningActivitiesSection(section) {
    if (!section || typeof section !== "object") return false;
    var sid = String(section.section_id || section.id || "").toLowerCase();
    var heading = String(section.heading || section.title || "").toLowerCase();
    return sid === "learning_activities" || heading.indexOf("learning activit") !== -1;
  }

  function findLearningActivitiesRows(page) {
    if (!page || !Array.isArray(page.sections)) return [];
    for (var i = 0; i < page.sections.length; i += 1) {
      var section = page.sections[i];
      if (!isLearningActivitiesSection(section)) continue;
      var content = section.content;
      if (Array.isArray(content)) return content;
      if (content && Array.isArray(content.activities)) return content.activities;
    }
    return [];
  }

  function slugFromMaterialId(materialId) {
    return String(materialId || "")
      .replace(/^M\d+_?/i, "")
      .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  function pageFieldKeyForMaterial(mat) {
    var type = String((mat && mat.type) || "").toLowerCase();
    var purpose = String((mat && mat.purpose) || "").toLowerCase();
    if (type === "checklist") {
      if (/evaluate|verification/.test(purpose)) return "checklist_evaluate";
      return "checklist";
    }
    if (type === "worked_example") {
      if (/worked analytic pass|analytic pass/.test(purpose)) return "worked_analytic_pass";
      if (/worked judgement|judgment/.test(purpose)) return "worked_judgement_weak_strong";
      return "worked_example";
    }
    if (type === "transfer_prompt") return "transfer_prompt_evaluate";
    if (type === "template") {
      if (/independent/.test(purpose)) return "independent_judgement_template";
      return "template";
    }
    if (type === "scenario") {
      if (/strategy|menu/.test(purpose)) return "scenario_maya_strategy_menu";
      return "scenario_maya_households";
    }
    if (type === "decision_table") return "guided_judgement_table";
    if (type === "analysis_table") return "analysis_table";
    if (type === "classification_table") return "classification_table";
    if (type === "comparison_table") return "comparison_table";
    if (type === "impact_table") return "impact_table";
    if (type === "text") {
      if (/concept|exposition|elucidation/.test(purpose)) return "concept_exposition";
      if (/criteria/.test(purpose)) return "criteria_exposition_evaluate";
      return "text";
    }
    if (type === "modelling_note") {
      if (/worked judgement|judgment/.test(purpose)) return "worked_judgement_weak_strong";
      return "modelling_note";
    }
    if (type === "consolidation_summary") return "consolidation_summary";
    if (type === "sample_output") return "sample_output";
    return slugFromMaterialId(mat && mat.material_id) || type || "material";
  }

  function materialContent(mat) {
    if (!mat || typeof mat !== "object") return "";
    if (typeof mat.content === "string") return mat.content;
    if (typeof mat.body === "string") return mat.body;
    if (typeof mat.text === "string") return mat.text;
    return "";
  }

  function buildMaterialsObjectFromGamList(materialsList) {
    var out = {};
    if (!Array.isArray(materialsList)) return out;
    materialsList.forEach(function (mat) {
      var content = materialContent(mat);
      if (!String(content || "").trim()) return;
      var key = pageFieldKeyForMaterial(mat);
      if (!out[key] || String(content).length > String(out[key]).length) {
        out[key] = content;
      }
    });
    applyRendererCanonicalAliases(out);
    return out;
  }

  function applyRendererCanonicalAliases(materials) {
    if (!materials || typeof materials !== "object") return materials;
    if (materials.checklist_evaluate && !materials.checklist) {
      materials.checklist = materials.checklist_evaluate;
    }
    if (materials.checklist_evaluate && !materials.evaluation_checklist) {
      materials.evaluation_checklist = materials.checklist_evaluate;
    }
    if (materials.transfer_prompt_evaluate && !materials.transfer_prompt) {
      materials.transfer_prompt = materials.transfer_prompt_evaluate;
    }
    if (materials.worked_analytic_pass && !materials.worked_example) {
      materials.worked_example = materials.worked_analytic_pass;
    }
    if (materials.worked_judgement_weak_strong && !materials.worked_example) {
      materials.worked_example = materials.worked_judgement_weak_strong;
    }
    if (materials.scenario_maya_strategy_menu && !materials.scenario) {
      materials.scenario = materials.scenario_maya_strategy_menu;
    }
    if (materials.scenario_maya_households && !materials.scenarios) {
      materials.scenarios = [materials.scenario_maya_households];
    }
    if (materials.independent_judgement_template && !materials.template) {
      materials.template = materials.independent_judgement_template;
    }
    if (materials.guided_judgement_table && !materials.decision_table) {
      materials.decision_table = materials.guided_judgement_table;
    }
    if (materials.classification_table && !materials.worksheet) {
      materials.worksheet = materials.classification_table;
    }
    return materials;
  }

  function shouldPreferGamContent(pageVal, gamVal) {
    if (pageVal == null || pageVal === "") return true;
    if (typeof gamVal !== "string") return false;
    if (typeof pageVal !== "string") return true;
    if (stringLooksPlaceholderOnly(pageVal)) return true;
    return gamVal.length > pageVal.length * 1.1;
  }

  function mergeMaterialsObjects(pageMaterials, gamMaterials) {
    var merged = Object.assign({}, pageMaterials && typeof pageMaterials === "object" ? pageMaterials : {});
    Object.keys(gamMaterials || {}).forEach(function (key) {
      var gamVal = gamMaterials[key];
      if (shouldPreferGamContent(merged[key], gamVal)) {
        merged[key] = gamVal;
      }
    });
    return applyRendererCanonicalAliases(merged);
  }

  function normalizeGamActivitiesSource(source) {
    if (!source) return [];
    if (Array.isArray(source)) return source;
    if (Array.isArray(source.activities)) return source.activities;
    return [];
  }

  function gamMaterialsForActivity(gamActivity) {
    if (!gamActivity || typeof gamActivity !== "object") return [];
    if (Array.isArray(gamActivity.materials)) return gamActivity.materials;
    return [];
  }

  function matchGamActivity(gamActivities, pageRow, index) {
    var pageKeys = [
      normalizeActivityKey(pageRow && pageRow.activity_id),
      normalizeActivityKey(pageRow && pageRow.activityId),
      normalizeActivityKey(pageRow && pageRow.title)
    ].filter(Boolean);
    for (var i = 0; i < gamActivities.length; i += 1) {
      var g = gamActivities[i];
      var gamKeys = [
        normalizeActivityKey(g.activity_id),
        normalizeActivityKey(g.activityId),
        normalizeActivityKey(g.title)
      ].filter(Boolean);
      for (var pk = 0; pk < pageKeys.length; pk += 1) {
        for (var gk = 0; gk < gamKeys.length; gk += 1) {
          if (pageKeys[pk] && pageKeys[pk] === gamKeys[gk]) return g;
        }
      }
    }
    return gamActivities[index] || null;
  }

  function applyGamMaterialsToComposedPage(page, upstreamGam, options) {
    if (!page || typeof page !== "object") return page;
    var opts = options && typeof options === "object" ? options : {};
    var gamActivities = normalizeGamActivitiesSource(upstreamGam);
    if (!gamActivities.length) return page;
    var next = JSON.parse(JSON.stringify(page));
    var rows = findLearningActivitiesRows(next);
    var mergedCount = 0;
    rows.forEach(function (row, index) {
      if (!row || typeof row !== "object") return;
      var gamAct = matchGamActivity(gamActivities, row, index);
      if (!gamAct) return;
      if (!row.activity_id && gamAct.activity_id) row.activity_id = gamAct.activity_id;
      var gamMaterials = buildMaterialsObjectFromGamList(gamMaterialsForActivity(gamAct));
      if (!Object.keys(gamMaterials).length) return;
      row.materials = mergeMaterialsObjects(row.materials, gamMaterials);
      mergedCount += 1;
    });
    if (!next.metadata || typeof next.metadata !== "object") next.metadata = {};
    next.metadata.gam_materials_preserve_applied = true;
    next.metadata.gam_materials_preserve_rows = mergedCount;
    if (!Array.isArray(next.constraints_applied)) {
      next.constraints_applied = next.constraints_applied
        ? [String(next.constraints_applied)]
        : [];
    }
    if (next.constraints_applied.indexOf("GAM materials L4 preserve merge applied (page-gam-materials-preserve)") === -1) {
      next.constraints_applied.push("GAM materials L4 preserve merge applied (page-gam-materials-preserve)");
    }
    return next;
  }

  function materialsHasChecklist(materials) {
    if (!materials || typeof materials !== "object") return false;
    return Object.keys(materials).some(function (key) {
      return /checklist/i.test(key) && !stringLooksPlaceholderOnly(materials[key]);
    });
  }

  function materialsHasWorkedAnalyticPass(materials) {
    if (!materials || typeof materials !== "object") return false;
    if (materials.worked_analytic_pass && !stringLooksPlaceholderOnly(materials.worked_analytic_pass)) {
      return true;
    }
    return Object.keys(materials).some(function (key) {
      return /worked_analytic_pass|analytic_pass/i.test(key) && !stringLooksPlaceholderOnly(materials[key]);
    });
  }

  function materialsHasWorkedExample(materials) {
    if (!materials || typeof materials !== "object") return false;
    return Object.keys(materials).some(function (key) {
      if (!/worked_example|worked_judgement|modelling_note/i.test(key)) return false;
      return !stringLooksPlaceholderOnly(materials[key]);
    });
  }

  function materialsHasSubstantiveA4WorkedJudgement(materials) {
    if (!materials || typeof materials !== "object") return false;
    var text = String(
      materials.worked_judgement_weak_strong || materials.worked_example || materials.modelling_note || ""
    );
    return (
      text.length > 400 &&
      (/Weak Evaluation Example/i.test(text) || /Strong Evaluation Example/i.test(text))
    );
  }

  function materialsHasSubstantiveA4Scenario(materials) {
    if (!materials || typeof materials !== "object") return false;
    var text = String(materials.scenario_maya_strategy_menu || materials.scenario || "");
    return text.length > 400 && /Strategy A:/i.test(text) && /Strategy E:/i.test(text);
  }

  function materialsHasTransferPrompt(materials) {
    if (!materials || typeof materials !== "object") return false;
    return Object.keys(materials).some(function (key) {
      return /transfer_prompt/i.test(key) && !stringLooksPlaceholderOnly(materials[key]);
    });
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
      for (i = aidSpans.length - 1; i >= 0; i -= 1) {
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

  function normalizeLearningActivitiesList(source) {
    if (!source) return [];
    if (Array.isArray(source)) return source;
    if (Array.isArray(source.activities)) return source.activities;
    if (Array.isArray(source.learning_activities)) return source.learning_activities;
    return [];
  }

  function buildUpstreamGamActivitiesFromMaterials(materialsList, learningActivities) {
    var acts = normalizeLearningActivitiesList(learningActivities);
    var mats = Array.isArray(materialsList) ? materialsList : [];
    if (acts.length) {
      return acts.map(function (act) {
        var aid = act.activity_id || act.activityId;
        return {
          activity_id: aid,
          title: act.title,
          materials: mats.filter(function (m) {
            return String(m.activity_id || "") === String(aid || "");
          })
        };
      });
    }
    var byAct = {};
    mats.forEach(function (mat) {
      var key = String(mat.activity_id || "?");
      if (!byAct[key]) byAct[key] = [];
      byAct[key].push(mat);
    });
    return Object.keys(byAct).map(function (aid) {
      return { activity_id: aid, materials: byAct[aid] };
    });
  }

  function gamA4ExpectsTransferPrompt(gamSource) {
    var acts = normalizeGamActivitiesSource(gamSource);
    var a4 = acts[3] || null;
    if (!a4) {
      acts.forEach(function (act) {
        if (a4) return;
        var id = String(act.activity_id || act.title || "").toLowerCase();
        if (/a4/.test(id) || /evaluate.*household/.test(id)) a4 = act;
      });
    }
    if (!a4) return false;
    return gamMaterialsForActivity(a4).some(function (mat) {
      return String(mat.type || "").toLowerCase() === "transfer_prompt";
    });
  }

  function validate38LPageGamPreservation(page, options) {
    var opts = options && typeof options === "object" ? options : {};
    var rows = findLearningActivitiesRows(page);
    var errors = [];
    if (rows.length < 4) {
      errors.push("expected at least 4 learning activities on page");
    }
    rows.forEach(function (row, index) {
      var label = "A" + (index + 1);
      var mats = (row && row.materials) || {};
      if (!materialsHasChecklist(mats)) {
        errors.push(label + ": missing checklist material");
      }
    });
    if (rows[2]) {
      if (!materialsHasWorkedAnalyticPass(rows[2].materials)) {
        errors.push("A3: missing worked analytic pass material");
      }
    }
    if (rows[3]) {
      var a4 = rows[3].materials || {};
      if (!materialsHasSubstantiveA4WorkedJudgement(a4)) {
        errors.push("A4: missing substantive worked example / worked judgement material");
      }
      if (!materialsHasSubstantiveA4Scenario(a4)) {
        errors.push("A4: missing substantive scenario / strategy menu material");
      }
      if (!materialsHasChecklist(a4)) {
        errors.push("A4: missing checklist / debrief material");
      }
      if (gamA4ExpectsTransferPrompt(opts.gamSource) && !materialsHasTransferPrompt(a4)) {
        errors.push("A4: missing transfer_prompt material");
      }
    }
    return { ok: errors.length === 0, errors: errors };
  }

  return {
    pageFieldKeyForMaterial: pageFieldKeyForMaterial,
    buildMaterialsObjectFromGamList: buildMaterialsObjectFromGamList,
    mergeMaterialsObjects: mergeMaterialsObjects,
    parseGamMaterialsFromText: parseGamMaterialsFromText,
    buildUpstreamGamActivitiesFromMaterials: buildUpstreamGamActivitiesFromMaterials,
    applyGamMaterialsToComposedPage: applyGamMaterialsToComposedPage,
    validate38LPageGamPreservation: validate38LPageGamPreservation,
    findLearningActivitiesRows: findLearningActivitiesRows
  };
});
