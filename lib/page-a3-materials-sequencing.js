/**
 * A3 Analyse — learner-facing materials sequencing (Sprint 38-M).
 * Compose-layer: materials_order + key reorder. No body mutation.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_PAGE_A3_MATERIALS_SEQUENCING = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var A3_ANALYSE_MATERIALS_ORDER = [
    "worked_analytic_pass",
    "analysis_table",
    "scenario_maya_households",
    "checklist"
  ];

  var MATERIAL_RENDER_ALIAS_GROUPS = {
    worked_analytic_pass: ["worked_analytic_pass", "worked_example"],
    analysis_table: [
      "analysis_table",
      "worksheet",
      "classification_table",
      "impact_table",
      "comparison_table",
      "table"
    ],
    scenario_maya_households: ["scenario_maya_households", "scenario", "scenarios"],
    checklist: ["checklist", "checklist_evaluate", "verification_checklist", "evaluation_checklist"]
  };

  function markMaterialAliasGroupRendered(markFn, primaryKey) {
    var keys = MATERIAL_RENDER_ALIAS_GROUPS[primaryKey] || [primaryKey];
    keys.forEach(function (aliasKey) {
      markFn(aliasKey);
    });
  }

  var RENDER_HEADING_PATTERNS = {
    worked_analytic_pass: /Worked Analytic Pass|worked analytic pass/i,
    analysis_table: /Worksheet|Analysis table/i,
    scenario_maya_households: /Scenario Maya Households|Maya Household Inflation Scenarios/i,
    checklist: /Verification Checklist|Checklist/i
  };

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
      if (content && Array.isArray(content.content)) return content.content;
      if (content && Array.isArray(content.activities)) return content.activities;
    }
    return [];
  }

  function normalizeActivityKey(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "");
  }

  function isA3AnalyseActivityRow(row) {
    if (!row || typeof row !== "object") return false;
    var id = normalizeActivityKey(row.activity_id || row.activityId);
    var title = normalizeActivityKey(row.title || row.activity_title);
    if (id.indexOf("a3") !== -1 && id.indexOf("analys") !== -1) return true;
    if (title.indexOf("analys") !== -1 && title.indexOf("household") !== -1) return true;
    var mats = row.materials;
    if (!mats || typeof mats !== "object") return false;
    return !!(
      mats.worked_analytic_pass &&
      mats.analysis_table &&
      mats.checklist &&
      !mats.scenario_maya_strategy_menu &&
      !mats.worked_judgement_weak_strong
    );
  }

  function reorderMaterialsObject(materials, order) {
    if (!materials || typeof materials !== "object") return materials || {};
    var next = {};
    (order || []).forEach(function (key) {
      if (materials[key] != null && materials[key] !== "") {
        next[key] = materials[key];
      }
    });
    Object.keys(materials).forEach(function (key) {
      if (!Object.prototype.hasOwnProperty.call(next, key)) {
        next[key] = materials[key];
      }
    });
    return next;
  }

  function applyA3MaterialsSequencingToComposedPage(page, options) {
    if (!page || typeof page !== "object") return page;
    var next = JSON.parse(JSON.stringify(page));
    var rows = findLearningActivitiesRows(next);
    var touched = 0;
    rows.forEach(function (row) {
      if (!isA3AnalyseActivityRow(row)) return;
      row.materials_order = A3_ANALYSE_MATERIALS_ORDER.slice();
      if (row.materials && typeof row.materials === "object") {
        row.materials = reorderMaterialsObject(row.materials, row.materials_order);
      }
      touched += 1;
    });
    if (touched > 0) {
      if (!next.metadata || typeof next.metadata !== "object") next.metadata = {};
      next.metadata.a3_materials_sequencing_applied = true;
      next.metadata.a3_materials_sequencing_rows = touched;
      if (!Array.isArray(next.constraints_applied)) {
        next.constraints_applied = next.constraints_applied ? [String(next.constraints_applied)] : [];
      }
      if (
        next.constraints_applied.indexOf(
          "A3 Analyse materials_order sequencing applied (page-a3-materials-sequencing)"
        ) === -1
      ) {
        next.constraints_applied.push(
          "A3 Analyse materials_order sequencing applied (page-a3-materials-sequencing)"
        );
      }
    }
    return next;
  }

  function materialsKeyOrderMatches(materials, order) {
    if (!materials || typeof materials !== "object") return false;
    var keys = Object.keys(materials);
    for (var i = 0; i < order.length; i += 1) {
      if (keys[i] !== order[i]) return false;
    }
    return true;
  }

  function validateA3MaterialsSequencing(page, options) {
    var opts = options && typeof options === "object" ? options : {};
    var errors = [];
    var rows = findLearningActivitiesRows(page);
    var a3Row = null;
    rows.forEach(function (row) {
      if (isA3AnalyseActivityRow(row)) a3Row = row;
    });
    if (!a3Row) {
      errors.push("A3:analyse:missing:A3 Analyse activity row not found");
      return { ok: false, errors: errors };
    }
    var expected = opts.expectedOrder || A3_ANALYSE_MATERIALS_ORDER;
    var order = Array.isArray(a3Row.materials_order) ? a3Row.materials_order : [];
    if (order.length !== expected.length) {
      errors.push("A3:materials_order:G15:materials_order length mismatch");
    } else {
      for (var i = 0; i < expected.length; i += 1) {
        if (String(order[i]) !== String(expected[i])) {
          errors.push("A3:materials_order:G15:expected " + expected[i] + " at index " + i);
          break;
        }
      }
    }
    if (a3Row.materials && !materialsKeyOrderMatches(a3Row.materials, expected)) {
      errors.push("A3:materials:G16:materials object key order does not match materials_order");
    }
    if (!page.metadata || page.metadata.a3_materials_sequencing_applied !== true) {
      if (opts.requireMetadata !== false) {
        errors.push("A3:metadata:G15:a3_materials_sequencing_applied not true");
      }
    }
    return { ok: errors.length === 0, errors: errors };
  }

  function findH4MaterialHeadingPosition(html, headingPattern) {
    var re = /<(?:h4|p)[^>]*class="[^"]*(?:util-material-heading|util-supporting-label)[^"]*"[^>]*>([\s\S]*?)<\/(?:h4|p)>/gi;
    var m;
    while ((m = re.exec(String(html || ""))) !== null) {
      var inner = String(m[1] || "")
        .replace(/<[^>]+>/g, "")
        .trim();
      if (headingPattern.test(inner)) {
        return m.index;
      }
    }
    return -1;
  }

  var RENDER_H4_HEADING_PATTERNS = {
    worked_analytic_pass: /Worked analytic pass/i,
    analysis_table: /^Worksheet$/i,
    scenario_maya_households: /Scenario Maya households/i,
    checklist: /^Checklist$/i
  };

  function validateA3RenderMaterialOrder(html, options) {
    var opts = options && typeof options === "object" ? options : {};
    var text = String(html || "");
    var order = opts.expectedOrder || A3_ANALYSE_MATERIALS_ORDER;
    var errors = [];
    var positions = [];
    order.forEach(function (key) {
      var pattern = RENDER_H4_HEADING_PATTERNS[key] || RENDER_HEADING_PATTERNS[key];
      if (!pattern) return;
      var pos = findH4MaterialHeadingPosition(text, pattern);
      if (pos < 0 && key === "analysis_table") {
        var afterPos = positions.length ? positions[positions.length - 1].pos : -1;
        var tableRe =
          /<div[^>]*class="[^"]*\butil-material-table\b[^"]*"[^>]*>/gi;
        var tableMatch;
        while ((tableMatch = tableRe.exec(text)) !== null) {
          if (tableMatch.index > afterPos) {
            pos = tableMatch.index;
            break;
          }
        }
      }
      if (pos < 0) {
        errors.push("A3:render:G15:missing material label for " + key);
        positions.push({ key: key, pos: -1 });
        return;
      }
      positions.push({ key: key, pos: pos });
    });
    for (var i = 1; i < positions.length; i += 1) {
      if (positions[i].pos < 0 || positions[i - 1].pos < 0) continue;
      if (positions[i].pos <= positions[i - 1].pos) {
        errors.push(
          "A3:render:G15:" +
            positions[i - 1].key +
            " must precede " +
            positions[i].key +
            " in render output"
        );
      }
    }
    return { ok: errors.length === 0, errors: errors, positions: positions };
  }

  return {
    A3_ANALYSE_MATERIALS_ORDER: A3_ANALYSE_MATERIALS_ORDER,
    MATERIAL_RENDER_ALIAS_GROUPS: MATERIAL_RENDER_ALIAS_GROUPS,
    markMaterialAliasGroupRendered: markMaterialAliasGroupRendered,
    isA3AnalyseActivityRow: isA3AnalyseActivityRow,
    reorderMaterialsObject: reorderMaterialsObject,
    applyA3MaterialsSequencingToComposedPage: applyA3MaterialsSequencingToComposedPage,
    validateA3MaterialsSequencing: validateA3MaterialsSequencing,
    validateA3RenderMaterialOrder: validateA3RenderMaterialOrder,
    findLearningActivitiesRows: findLearningActivitiesRows
  };
});
