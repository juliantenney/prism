/**
 * Assessment Pack publishing: exact-data stimulus realisation and sibling assembly.
 * Does not use activity or page visual_affordances, and does not call an image model.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.PRISM_ASSESSMENT_PACK_PUBLISH = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var KIND = "data_figure";

  function escapeXml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function forbiddenList(representation) {
    var raw = representation && representation.must_not_show;
    if (!Array.isArray(raw)) return [];
    return raw
      .map(function (item) {
        return String(item == null ? "" : item).trim();
      })
      .filter(Boolean);
  }

  function containsForbidden(text, forbidden) {
    var hay = String(text || "");
    var i;
    for (i = 0; i < forbidden.length; i += 1) {
      if (hay.indexOf(forbidden[i]) !== -1) return forbidden[i];
    }
    return "";
  }

  function pointsFromData(data) {
    if (!data || typeof data !== "object") return [];
    var rows = Array.isArray(data) ? data : data.points || data.series || data.values;
    if (!Array.isArray(rows)) return [];
    return rows
      .map(function (row) {
        if (!row || typeof row !== "object") return null;
        var label = String(row.label == null ? "" : row.label).trim();
        var value = Number(row.value);
        if (!label || !isFinite(value)) return null;
        return { label: label, value: value };
      })
      .filter(Boolean);
  }

  function realiseDataFigure(component) {
    var representation = component.representation;
    if (!representation || representation === null) return { ok: true, asset: null };
    if (representation.required !== true) return { ok: true, asset: null };
    if (String(representation.kind || "").trim() !== KIND) {
      return { ok: false, code: "representation_unrealised", componentId: String(component.id || "") };
    }
    var points = pointsFromData(representation.authoritative_data);
    if (!points.length) {
      return { ok: false, code: "representation_unrealised", componentId: String(component.id || "") };
    }
    var unit =
      representation.authoritative_data && representation.authoritative_data.unit
        ? String(representation.authoritative_data.unit)
        : "";
    var forbidden = forbiddenList(representation);
    var alt = String(representation.alt_text || "").trim();
    if (!alt || containsForbidden(alt, forbidden)) {
      return { ok: false, code: "representation_unrealised", componentId: String(component.id || "") };
    }
    var max = points.reduce(function (peak, point) {
      return Math.max(peak, point.value);
    }, 0);
    if (max <= 0) max = 1;
    var width = 360;
    var height = 40 + points.length * 36;
    var bars = points
      .map(function (point, index) {
        var hit = containsForbidden(point.label, forbidden);
        if (hit) return { error: hit };
        var y = 24 + index * 36;
        var bar = Math.round((point.value / max) * 180);
        var valueText = String(point.value) + (unit ? " " + unit : "");
        return {
          markup:
            '<text x="8" y="' +
            (y + 16) +
            '" font-size="14">' +
            escapeXml(point.label) +
            "</text>" +
            '<rect x="140" y="' +
            y +
            '" width="' +
            bar +
            '" height="20" fill="#1f4e79"></rect>' +
            '<text x="' +
            (148 + bar) +
            '" y="' +
            (y + 15) +
            '" font-size="13">' +
            escapeXml(valueText) +
            "</text>"
        };
      });
    var bad = bars.filter(function (bar) {
      return bar && bar.error;
    })[0];
    if (bad) {
      return { ok: false, code: "representation_unrealised", componentId: String(component.id || "") };
    }
    var markup =
      '<svg xmlns="http://www.w3.org/2000/svg" role="img" width="' +
      width +
      '" height="' +
      height +
      '" viewBox="0 0 ' +
      width +
      " " +
      height +
      '"><title>' +
      escapeXml(alt) +
      "</title>" +
      bars
        .map(function (bar) {
          return bar.markup;
        })
        .join("") +
      "</svg>";
    if (containsForbidden(alt, forbidden)) {
      return { ok: false, code: "representation_unrealised", componentId: String(component.id || "") };
    }
    return {
      ok: true,
      asset: {
        component_id: String(component.id || ""),
        kind: KIND,
        media: { format: "svg", markup: markup },
        alt_text: alt
      }
    };
  }

  function judgementOf(component) {
    return component && component.judgement && typeof component.judgement === "object"
      ? component.judgement
      : {};
  }

  function promptOf(component) {
    var prompt = component && component.prompt;
    if (prompt && typeof prompt === "object") return prompt;
    return { stem: String(prompt || "") };
  }

  function cloneStructured(value) {
    if (value == null || typeof value !== "object") return value;
    return JSON.parse(JSON.stringify(value));
  }

  function outcomeIds(component) {
    var raw = component && (component.mapped_learning_outcomes || component.learning_outcome_ids);
    if (!Array.isArray(raw)) return [];
    return raw.map(function (id) {
      return String(id || "").trim();
    }).filter(Boolean);
  }

  function mapItem(component, asset) {
    var judgement = judgementOf(component);
    var prompt = promptOf(component);
    var form = String(component.form || "").trim();
    var representation = null;
    if (asset) {
      representation = {
        component_id: String(asset.component_id || component.id || ""),
        kind: KIND,
        media: asset.media,
        alt_text: String(asset.alt_text || "")
      };
      var sourceRepresentation =
        component && component.representation && typeof component.representation === "object"
          ? component.representation
          : null;
      if (sourceRepresentation && sourceRepresentation.authoritative_data != null) {
        representation.authoritative_data = cloneStructured(sourceRepresentation.authoritative_data);
      }
    }
    var item = {
      id: String(component.id || ""),
      item_type: form,
      stem: String(prompt.stem || prompt.text || ""),
      auto_checkable: judgement.auto_checkable === true,
      feedback_note: String(component.feedback_note || ""),
      mapped_learning_outcomes: outcomeIds(component),
      prompt: cloneStructured(prompt),
      judgement: cloneStructured(judgement),
      representation: representation
    };
    if (form === "single_answer_mcq" || form === "multiple_answer_mcq") {
      item.options = Array.isArray(prompt.options) ? cloneStructured(prompt.options) : [];
      item.correct_answer = judgement.correct_answer == null ? "" : String(judgement.correct_answer);
      if (Array.isArray(judgement.correct_answers)) {
        item.correct_answers = cloneStructured(judgement.correct_answers);
      }
      item.explanation_or_rationale = item.feedback_note;
    }
    return item;
  }

  function outcomeRows(source) {
    var list = null;
    if (Array.isArray(source)) list = source;
    else if (source && Array.isArray(source.learning_outcomes)) list = source.learning_outcomes;
    else if (source && Array.isArray(source.outcomes)) list = source.outcomes;
    if (!list) return [];
    var rows = [];
    var i;
    for (i = 0; i < list.length; i += 1) {
      var row = list[i];
      if (!row || typeof row !== "object") continue;
      var id = String(row.id || row.outcome_id || "").trim();
      var statement = String(row.statement || row.text || "").trim();
      if (!id || !statement || statement === id) continue;
      rows.push({ id: id, statement: statement });
    }
    return rows;
  }

  function learningOutcomesForPack(pack, upstream) {
    var byId = {};
    outcomeRows(upstream).forEach(function (row) {
      byId[row.id] = row.statement;
    });
    outcomeRows(pack && pack.learning_outcomes).forEach(function (row) {
      if (!byId[row.id]) byId[row.id] = row.statement;
    });
    var seen = {};
    var ordered = [];
    var components = pack && Array.isArray(pack.components) ? pack.components : [];
    var i;
    for (i = 0; i < components.length; i += 1) {
      outcomeIds(components[i]).forEach(function (id) {
        if (seen[id] || !byId[id]) return;
        seen[id] = true;
        ordered.push({ id: id, statement: byId[id] });
      });
    }
    return ordered;
  }

  function assembleAssessmentPackPage(input) {
    var design = input && input.designPage && typeof input.designPage === "object" ? input.designPage : {};
    var pack = input && input.assessmentPack && typeof input.assessmentPack === "object" ? input.assessmentPack : null;
    if (!pack || !Array.isArray(pack.components)) {
      return { ok: false, code: "assessment_pack_required" };
    }
    var items = [];
    var assets = [];
    var i;
    for (i = 0; i < pack.components.length; i += 1) {
      var component = pack.components[i];
      var realised = realiseDataFigure(component || {});
      if (!realised.ok) return realised;
      if (realised.asset) assets.push(realised.asset);
      items.push(mapItem(component, realised.asset));
    }
    var intent = String(
      (design && design.assessment_intent) ||
        (pack.evidence_plan_ref && pack.evidence_plan_ref.assessment_intent) ||
        ""
    ).trim();
    var framing = String(design.framing || "").trim();
    var timing = String((input && input.feedbackTiming) || "per_component").trim();
    if (timing !== "end_of_pack") timing = "per_component";
    return {
      ok: true,
      assets: assets,
      page: {
        artifact_type: "page",
        schema_version: "2.0.0",
        page_kind: "assessment",
        title: String(design.title || "").trim() || "Assessment Pack",
        attempt_instructions: String(design.attempt_instructions || "").trim(),
        framing: framing,
        assessment_intent: intent,
        feedback_timing: timing,
        learning_outcomes: learningOutcomesForPack(
          pack,
          input && input.learningOutcomes
        ),
        section_heading: String(design.section_heading || "").trim(),
        activities: [],
        assessment_check: { items: items },
        assembly_state: {
          current_stage: "design_page",
          enriched_by: ["assessment_pack", "design_page"]
        }
      }
    };
  }

  return {
    DATA_FIGURE_KIND: KIND,
    realiseDataFigure: realiseDataFigure,
    assembleAssessmentPackPage: assembleAssessmentPackPage
  };
});
