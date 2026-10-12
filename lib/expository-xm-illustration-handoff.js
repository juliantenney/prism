/**
 * Expository XM illustration commissions → existing visual-job affordances.
 *
 * A nested diagram specification (representation, layout, elements,
 * causal connections, legend) is an unrealised illustration. A comparison
 * table is not. This module does not generate images.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.PRISM_EXPOSITORY_XM_ILLUSTRATION_HANDOFF = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var SCHEMA_VERSION = "38.4";
  var SHELL_SECTION_IDS = {
    learning_activities: true,
    activity_materials: true,
    learning_sequence: true,
    assessment_check: true,
    knowledge_summary: true
  };
  var SPEC_SIGNALS = {
    representation: true,
    layout: true,
    elements: true,
    legend: true,
    causalconnections: true
  };

  function text(value) {
    return String(value == null ? "" : value).trim();
  }

  function isPlainObject(value) {
    return !!value && typeof value === "object" && !Array.isArray(value);
  }

  function token(value) {
    return text(value).toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  function kindToken(material) {
    return token(material && (material.kind || material.material_type || material.type));
  }

  function signalCount(obj) {
    if (!isPlainObject(obj)) return 0;
    var n = 0;
    Object.keys(obj).forEach(function (key) {
      if (SPEC_SIGNALS[token(key)]) n += 1;
    });
    return n;
  }

  function isComparisonTableMaterial(material) {
    var kind = kindToken(material);
    if (kind.indexOf("comparisontable") !== -1) return true;
    var body = material && material.body;
    if (!isPlainObject(body)) return false;
    if (
      isPlainObject(body.diagram) ||
      isPlainObject(body.figure) ||
      isPlainObject(body.illustration)
    ) {
      return false;
    }
    if (Array.isArray(body.columns) && Array.isArray(body.rows)) return true;
    if (isPlainObject(body.table) && Array.isArray(body.table.rows)) return true;
    return false;
  }

  function specificationObject(material) {
    if (!material || typeof material !== "object") return null;
    if (isComparisonTableMaterial(material)) return null;
    var body = material.body;
    if (!isPlainObject(body)) return null;
    var nested = [body.diagram, body.figure, body.illustration];
    var i;
    for (i = 0; i < nested.length; i += 1) {
      if (signalCount(nested[i]) >= 2) return nested[i];
    }
    if (
      signalCount(body) >= 2 &&
      (Array.isArray(body.elements) || Array.isArray(body.causal_connections))
    ) {
      return body;
    }
    return null;
  }

  function isUnrealizedIllustrationSpecification(material) {
    return !!specificationObject(material);
  }

  function firstString(obj, keys) {
    if (!isPlainObject(obj)) return "";
    var i;
    for (i = 0; i < keys.length; i += 1) {
      var value = text(obj[keys[i]]);
      if (value) return value;
    }
    return "";
  }

  function listFrom(obj, keys) {
    if (!isPlainObject(obj)) return [];
    var i;
    for (i = 0; i < keys.length; i += 1) {
      if (Array.isArray(obj[keys[i]])) return obj[keys[i]];
    }
    return [];
  }

  function elementLabel(node, labelMap) {
    if (typeof node === "string" || typeof node === "number") return text(node);
    if (!isPlainObject(node)) return "";
    var label = firstString(node, ["label", "name", "title", "heading"]);
    if (label) return label;
    var id = text(node.id);
    if (id && labelMap && labelMap[id]) return labelMap[id];
    return "";
  }

  function buildLabelMap(elements) {
    var map = Object.create(null);
    elements.forEach(function (node) {
      if (!isPlainObject(node)) return;
      var label = firstString(node, ["label", "name", "title", "heading"]);
      var id = text(node.id);
      if (id && label) map[id] = label;
    });
    return map;
  }

  function endpointLabel(value, labelMap) {
    if (isPlainObject(value)) return elementLabel(value, labelMap);
    var raw = text(value);
    if (!raw) return "";
    return (labelMap && labelMap[raw]) || raw;
  }

  function readIllustration(material) {
    var spec = specificationObject(material);
    if (!spec) return null;
    var body = isPlainObject(material.body) ? material.body : {};
    var elements = listFrom(spec, ["elements"]).concat(
      spec === body ? [] : listFrom(body, ["elements"])
    );
    var labelMap = buildLabelMap(elements);
    var connections = listFrom(spec, ["causal_connections", "relationships", "edges"]);
    if (spec !== body) {
      connections = connections.concat(listFrom(body, ["causal_connections", "relationships"]));
    }
    var relationships = [];
    connections.forEach(function (edge) {
      if (!isPlainObject(edge)) return;
      var from = endpointLabel(
        edge.from != null ? edge.from : edge.source != null ? edge.source : edge.cause,
        labelMap
      );
      var to = endpointLabel(
        edge.to != null ? edge.to : edge.target != null ? edge.target : edge.effect,
        labelMap
      );
      if (!from || !to) return;
      var meaning = firstString(edge, ["meaning", "label", "relation", "description"]);
      relationships.push({
        from: from,
        to: to,
        meaning: meaning,
        line: meaning ? from + " → " + to + " (" + meaning + ")" : from + " → " + to
      });
    });
    var legend = listFrom(spec, ["legend"]);
    if (spec !== body) legend = legend.concat(listFrom(body, ["legend"]));
    var legendLabels = [];
    legend.forEach(function (item) {
      if (typeof item === "string" || typeof item === "number") {
        if (text(item)) legendLabels.push(text(item));
        return;
      }
      var label = elementLabel(item, labelMap);
      if (label) legendLabels.push(label);
    });
    var elementLabels = [];
    elements.forEach(function (node) {
      var label = elementLabel(node, labelMap);
      if (label && elementLabels.indexOf(label) === -1) elementLabels.push(label);
    });
    return {
      subject:
        firstString(body, ["title"]) ||
        firstString(spec, ["title"]) ||
        text(material.title) ||
        text(material.kind),
      representation: firstString(spec, ["representation"]) || firstString(body, ["representation"]),
      layout: firstString(spec, ["layout"]) || firstString(body, ["layout"]),
      format: firstString(body, ["format"]) || firstString(spec, ["format"]),
      caption: firstString(body, ["caption"]) || firstString(spec, ["caption"]),
      accessibleText:
        firstString(body, [
          "text_alternative",
          "text_equivalent",
          "accessible_text_equivalent",
          "accessible_description",
          "detailed_description"
        ]) ||
        firstString(spec, [
          "text_alternative",
          "text_equivalent",
          "accessible_text_equivalent",
          "accessible_description",
          "detailed_description"
        ]),
      elementLabels: elementLabels,
      relationships: relationships,
      legendLabels: legendLabels
    };
  }

  function uniquePush(list, value) {
    var item = text(value);
    if (!item || list.indexOf(item) !== -1) return;
    list.push(item);
  }

  function clipAlt(subject) {
    var base = text(subject).replace(/[.]+$/g, "");
    var suffix = "; detailed description follows.";
    if (!base) base = "Commissioned illustration";
    var alt = base + suffix;
    if (alt.length <= 140) return alt;
    return base.slice(0, Math.max(1, 140 - suffix.length)).trim() + suffix;
  }

  function sectionAlreadyHasGenerate(page, sectionId, materialId) {
    var rows = Array.isArray(page.visual_affordances) ? page.visual_affordances : [];
    var sid = token(sectionId);
    var mid = token(materialId);
    return rows.some(function (row) {
      if (!row || text(row.visual_decision) !== "generate") return false;
      if (token(row.section_id) === sid) return true;
      var anchors = Array.isArray(row.evidence_anchors) ? row.evidence_anchors : [];
      return anchors.some(function (anchor) {
        return mid && token(anchor).indexOf(mid) !== -1;
      });
    });
  }

  function affordanceFromMaterial(material, sectionId) {
    var view = readIllustration(material);
    if (!view) return null;
    var materialId = text(material.material_id);
    if (!materialId || !text(sectionId)) return null;
    var mustShow = [];
    view.elementLabels.forEach(function (label) {
      uniquePush(mustShow, label);
    });
    view.relationships.forEach(function (edge) {
      uniquePush(mustShow, edge.line);
    });
    view.legendLabels.forEach(function (label) {
      uniquePush(mustShow, "Legend: " + label);
    });
    if (view.representation) uniquePush(mustShow, "Representation: " + view.representation);
    if (view.layout) uniquePush(mustShow, "Layout: " + view.layout);
    if (!mustShow.length) uniquePush(mustShow, view.subject);

    var contextParts = ["Visual brief: realise this commissioned illustration."];
    if (view.representation) contextParts.push("Representation: " + view.representation);
    if (view.layout) contextParts.push("Layout: " + view.layout);
    if (view.format) contextParts.push("Format: " + view.format);

    var accessible =
      view.accessibleText ||
      view.caption ||
      view.relationships
        .map(function (edge) {
          return edge.line;
        })
        .join(" ");

    var slug = token(materialId) || "material";
    return {
      affordance_id: "va-xm-" + slug,
      scope: "section",
      section_id: text(sectionId),
      visual_decision: "generate",
      visual_slot: "section-after-content",
      tier: "essential",
      purpose: view.relationships.length ? "mechanism" : "synthesis",
      preferred_representation: "annotated_system",
      subject: view.subject,
      context: contextParts.join(" "),
      evidence_anchors: [text(sectionId) + ".materials." + materialId],
      rationale:
        "The commissioned illustration makes the specified elements and relationships inspectable. The accessible description supports that figure and does not replace it.",
      reasoning_supported: accessible || view.subject,
      learner_stage: "post_reasoning",
      anti_spoiler: false,
      representation_avoid: ["generic_infographic", "topic_hero_image"],
      canonical_discipline_note:
        "Show only the elements, connections, legend and arrangement specified by the commissioned illustration.",
      requires_exact_data_match: false,
      must_show: mustShow,
      must_not_show: [
        "An additional setting, panel or category that the commissioned illustration does not specify."
      ],
      allowed_claims: [accessible || view.subject],
      disallowed_claims: [
        "Relationships, settings or categories that are not specified in the commissioned illustration."
      ],
      source_basis: text(sectionId) + ".materials." + materialId,
      caption_intent: view.caption || view.subject,
      alt_text: clipAlt(view.subject),
      detailed_description: accessible || view.subject,
      discipline_risk_level: "medium",
      xm_illustration_handoff: true,
      material_id: materialId
    };
  }

  function preparePageForXmIllustrationJobs(page) {
    if (!page || typeof page !== "object" || Array.isArray(page)) return page;
    if (!Array.isArray(page.sections)) return page;
    var additions = [];
    var coveredSections = Object.create(null);
    page.sections.forEach(function (section) {
      if (!section || typeof section !== "object") return;
      var sectionId = text(section.section_id);
      if (!sectionId || SHELL_SECTION_IDS[token(sectionId)]) return;
      if (!Array.isArray(section.materials)) return;
      section.materials.forEach(function (material) {
        if (!isUnrealizedIllustrationSpecification(material)) return;
        var materialId = text(material.material_id);
        var sectionKey = token(sectionId);
        if (coveredSections[sectionKey]) return;
        if (sectionAlreadyHasGenerate(page, sectionId, materialId)) return;
        var row = affordanceFromMaterial(material, sectionId);
        if (!row) return;
        coveredSections[sectionKey] = true;
        additions.push(row);
      });
    });
    if (!additions.length) return page;
    var next = JSON.parse(JSON.stringify(page));
    if (!Array.isArray(next.visual_affordances)) next.visual_affordances = [];
    additions.forEach(function (row) {
      next.visual_affordances.push(row);
    });
    if (!text(next.visual_affordance_schema_version)) {
      next.visual_affordance_schema_version = SCHEMA_VERSION;
    }
    if (!Array.isArray(next.activities_visual_review)) next.activities_visual_review = [];
    return next;
  }

  return {
    SCHEMA_VERSION: SCHEMA_VERSION,
    isComparisonTableMaterial: isComparisonTableMaterial,
    isUnrealizedIllustrationSpecification: isUnrealizedIllustrationSpecification,
    readIllustration: readIllustration,
    preparePageForXmIllustrationJobs: preparePageForXmIllustrationJobs
  };
});
