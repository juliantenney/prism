/**
 * Expository XM illustration commissions → existing visual-job affordances.
 *
 * A nested diagram specification (representation, layout, elements,
 * causal connections, legend) or an annotated number-line specification is an
 * unrealised illustration. A comparison table is not. Structured JSON and
 * textual construction fallbacks are not realised figures. This module does
 * not generate images.
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
      isPlainObject(body.illustration) ||
      isPlainObject(body.number_line) ||
      isPlainObject(body.numberline) ||
      isPlainObject(body.range_indicator)
    ) {
      return false;
    }
    if (Array.isArray(body.columns) && Array.isArray(body.rows)) return true;
    if (isPlainObject(body.table) && Array.isArray(body.table.rows)) return true;
    return false;
  }

  function numberLineSpecObject(material) {
    if (!material || typeof material !== "object") return null;
    if (isComparisonTableMaterial(material)) return null;
    var body = material.body;
    if (!isPlainObject(body)) return null;
    var kind = kindToken(material);
    var nested =
      (isPlainObject(body.number_line) && body.number_line) ||
      (isPlainObject(body.numberline) && body.numberline) ||
      (isPlainObject(body.axis) && body.axis) ||
      null;
    var candidate = nested || body;
    var hasRange =
      isPlainObject(candidate.range_indicator) ||
      isPlainObject(body.range_indicator) ||
      (candidate.start != null && candidate.end != null) ||
      (body.start != null && body.end != null);
    var hasMarks =
      Array.isArray(candidate.observations) ||
      Array.isArray(candidate.values) ||
      Array.isArray(candidate.points) ||
      Array.isArray(candidate.ticks) ||
      Array.isArray(candidate.tick_values) ||
      Array.isArray(candidate.segments) ||
      Array.isArray(body.observations) ||
      Array.isArray(body.values) ||
      Array.isArray(body.points) ||
      Array.isArray(body.ticks) ||
      Array.isArray(body.tick_values) ||
      Array.isArray(body.segments);
    if (kind.indexOf("numberline") !== -1 && (hasRange || hasMarks || nested)) {
      return nested || body;
    }
    if (nested && (hasRange || hasMarks)) return nested;
    if (isPlainObject(body.range_indicator) && hasMarks) return body;
    if (hasRange && hasMarks && (kind.indexOf("annotated") !== -1 || kind.indexOf("range") !== -1)) {
      return body;
    }
    return null;
  }

  function isNumberLineSpecification(material) {
    return !!numberLineSpecObject(material);
  }

  function conceptMapSpecificationObject(material) {
    if (!material || typeof material !== "object") return null;
    if (isComparisonTableMaterial(material)) return null;
    if (isNumberLineSpecification(material)) return null;
    var body = material.body;
    if (!isPlainObject(body) || !Array.isArray(body.nodes) || !body.nodes.length) return null;
    var edges = Array.isArray(body.connections)
      ? body.connections
      : Array.isArray(body.relationships)
        ? body.relationships
        : null;
    if (!edges || !edges.length) return null;
    var edgesAreLinks = edges.every(function (edge) {
      return (
        isPlainObject(edge) &&
        (edge.from != null || edge.source != null) &&
        (edge.to != null || edge.target != null)
      );
    });
    if (!edgesAreLinks) return null;
    var kind = kindToken(material);
    var representation = token(
      body.representation_type || body.representation || body.format || ""
    );
    if (kind.indexOf("conceptmap") === -1 && representation.indexOf("conceptmap") === -1) {
      return null;
    }
    return body;
  }

  function diagramSpecificationObject(material) {
    if (!material || typeof material !== "object") return null;
    if (isComparisonTableMaterial(material)) return null;
    if (isNumberLineSpecification(material)) return null;
    var conceptMap = conceptMapSpecificationObject(material);
    if (conceptMap) return conceptMap;
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

  function specificationObject(material) {
    return numberLineSpecObject(material) || diagramSpecificationObject(material);
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

  function pushExactValue(list, value) {
    if (typeof value === "number" && Number.isFinite(value)) {
      uniquePush(list, String(value));
      return;
    }
    var raw = text(value);
    if (raw) uniquePush(list, raw);
  }

  function collectNumberLineExactValues(material) {
    var values = [];
    var body = isPlainObject(material && material.body) ? material.body : {};
    var spec = numberLineSpecObject(material) || {};
    var sources = [spec, body];
    sources.forEach(function (src) {
      if (!isPlainObject(src)) return;
      var range =
        (isPlainObject(src.range_indicator) && src.range_indicator) ||
        (isPlainObject(src.range) && src.range) ||
        null;
      if (range) {
        pushExactValue(values, range.start != null ? range.start : range.from);
        pushExactValue(values, range.end != null ? range.end : range.to);
        pushExactValue(values, range.label);
        if (range.span != null) pushExactValue(values, range.span);
        if (range.width != null) pushExactValue(values, range.width);
        if (range.value != null) pushExactValue(values, range.value);
        if (range.description) pushExactValue(values, range.description);
      }
      pushExactValue(values, src.start);
      pushExactValue(values, src.end);
      pushExactValue(values, src.range);
      [
        "observations",
        "values",
        "points",
        "ticks",
        "tick_values",
        "segments",
        "marks"
      ].forEach(function (key) {
        if (!Array.isArray(src[key])) return;
        src[key].forEach(function (item) {
          if (typeof item === "string" || typeof item === "number") {
            pushExactValue(values, item);
            return;
          }
          if (!isPlainObject(item)) return;
          pushExactValue(values, item.value != null ? item.value : item.position);
          pushExactValue(values, item.start);
          pushExactValue(values, item.end);
          pushExactValue(values, item.label);
          pushExactValue(values, item.tick);
        });
      });
    });
    return values;
  }

  function readAccessibleText(body, spec) {
    return (
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
      ])
    );
  }

  function readNumberLine(material) {
    var spec = numberLineSpecObject(material);
    if (!spec) return null;
    var body = isPlainObject(material.body) ? material.body : {};
    var exactValues = collectNumberLineExactValues(material);
    return {
      kind: "number_line",
      subject:
        firstString(body, ["title"]) ||
        firstString(spec, ["title"]) ||
        text(material.title) ||
        text(material.kind) ||
        "Annotated number line",
      representation: "number_line_segments",
      layout: firstString(spec, ["layout"]) || firstString(body, ["layout"]) || "Single shared number line",
      format: firstString(body, ["format"]) || firstString(spec, ["format"]) || text(material.kind),
      caption: firstString(body, ["caption"]) || firstString(spec, ["caption"]),
      accessibleText: readAccessibleText(body, spec),
      elementLabels: exactValues.slice(),
      relationships: [],
      legendLabels: [],
      exactValues: exactValues,
      preferredRepresentation: "number_line_segments",
      requiresExactDataMatch: true
    };
  }

  function readDiagram(material) {
    var spec = diagramSpecificationObject(material);
    if (!spec) return null;
    var body = isPlainObject(material.body) ? material.body : {};
    var elements = listFrom(spec, ["elements", "nodes"]).concat(
      spec === body ? [] : listFrom(body, ["elements", "nodes"])
    );
    var labelMap = buildLabelMap(elements);
    var connections = listFrom(spec, [
      "causal_connections",
      "relationships",
      "edges",
      "connections"
    ]);
    if (spec !== body) {
      connections = connections.concat(
        listFrom(body, ["causal_connections", "relationships", "edges", "connections"])
      );
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
      kind: "diagram",
      subject:
        firstString(body, ["title"]) ||
        firstString(spec, ["title"]) ||
        text(material.title) ||
        text(material.kind),
      representation:
        firstString(spec, ["representation", "representation_type"]) ||
        firstString(body, ["representation", "representation_type"]),
      layout: firstString(spec, ["layout"]) || firstString(body, ["layout"]),
      format: firstString(body, ["format"]) || firstString(spec, ["format"]),
      caption: firstString(body, ["caption"]) || firstString(spec, ["caption"]),
      accessibleText: readAccessibleText(body, spec),
      elementLabels: elementLabels,
      relationships: relationships,
      legendLabels: legendLabels,
      exactValues: [],
      preferredRepresentation: "annotated_system",
      requiresExactDataMatch: false
    };
  }

  function readIllustration(material) {
    return readNumberLine(material) || readDiagram(material);
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

  function rowAnchorsMaterial(row, materialId) {
    var mid = token(materialId);
    if (!mid || !row) return false;
    if (token(row.material_id) === mid) return true;
    var anchors = Array.isArray(row.evidence_anchors) ? row.evidence_anchors : [];
    return anchors.some(function (anchor) {
      return token(anchor).indexOf(mid) !== -1;
    });
  }

  function materialAlreadyHasGenerate(page, sectionId, materialId) {
    var rows = Array.isArray(page.visual_affordances) ? page.visual_affordances : [];
    var sid = token(sectionId);
    return rows.some(function (row) {
      if (!row || text(row.visual_decision) !== "generate") return false;
      if (rowAnchorsMaterial(row, materialId)) return true;
      // Legacy authored section generate without material anchors still covers one
      // section-scoped illustration when it is the only generate for that section.
      if (token(row.section_id) === sid && !text(row.material_id)) {
        var anchors = Array.isArray(row.evidence_anchors) ? row.evidence_anchors : [];
        var anchorsMaterial = anchors.some(function (anchor) {
          return token(anchor).indexOf("materials") !== -1;
        });
        return !anchorsMaterial;
      }
      return false;
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
    if (view.kind === "number_line") {
      (view.exactValues || []).forEach(function (value) {
        uniquePush(mustShow, value);
      });
    } else {
      if (view.representation) uniquePush(mustShow, "Representation: " + view.representation);
      if (view.layout) uniquePush(mustShow, "Layout: " + view.layout);
    }
    if (!mustShow.length) uniquePush(mustShow, view.subject);

    var contextParts = ["Visual brief: realise this commissioned illustration."];
    if (view.representation) contextParts.push("Representation: " + view.representation);
    if (view.layout) contextParts.push("Layout: " + view.layout);
    if (view.format) contextParts.push("Format: " + view.format);
    if (view.kind === "number_line" && view.exactValues && view.exactValues.length) {
      contextParts.push("Exact source values: " + view.exactValues.join(", ") + ".");
    }

    var accessible =
      view.accessibleText ||
      view.caption ||
      view.relationships
        .map(function (edge) {
          return edge.line;
        })
        .join(" ");

    var isNumberLine = view.kind === "number_line";
    var slug = token(materialId) || "material";
    return {
      affordance_id: "va-xm-" + slug,
      scope: "section",
      section_id: text(sectionId),
      visual_decision: "generate",
      visual_slot: "section-after-content",
      tier: "essential",
      purpose: isNumberLine ? "data_pattern_reading" : view.relationships.length ? "mechanism" : "synthesis",
      preferred_representation: view.preferredRepresentation || "annotated_system",
      subject: view.subject,
      context: contextParts.join(" "),
      evidence_anchors: [text(sectionId) + ".materials." + materialId],
      rationale: isNumberLine
        ? "The commissioned number-line specification is an unrealised graphic. Exact observation and range values must appear on the generated figure; accessible text does not replace it."
        : "The commissioned illustration makes the specified elements and relationships inspectable. The accessible description supports that figure and does not replace it.",
      reasoning_supported: accessible || view.subject,
      learner_stage: "post_reasoning",
      anti_spoiler: false,
      representation_avoid: ["generic_infographic", "topic_hero_image"],
      canonical_discipline_note: isNumberLine
        ? "Show only the commissioned axis, marks and range from the source values; do not invent extra ticks or interpretive verdicts."
        : "Show only the elements, connections, legend and arrangement specified by the commissioned illustration.",
      requires_exact_data_match: !!view.requiresExactDataMatch,
      must_show: mustShow,
      must_not_show: isNumberLine
        ? [
            "Invented tick marks or endpoints absent from the commissioned values",
            "Interpretive verdict labels that the source does not state"
          ]
        : [
            "An additional setting, panel or category that the commissioned illustration does not specify."
          ],
      allowed_claims: [accessible || view.subject],
      disallowed_claims: isNumberLine
        ? ["Numeric claims or endpoints that are not in the commissioned number-line specification."]
        : [
            "Relationships, settings or categories that are not specified in the commissioned illustration."
          ],
      source_basis: text(sectionId) + ".materials." + materialId,
      caption_intent: view.caption || view.subject,
      alt_text: clipAlt(view.subject),
      detailed_description: accessible || view.subject,
      discipline_risk_level: isNumberLine ? "high" : "medium",
      xm_illustration_handoff: true,
      material_id: materialId
    };
  }

  function listUnrealizedXmMaterials(page) {
    var found = [];
    if (!page || !Array.isArray(page.sections)) return found;
    page.sections.forEach(function (section) {
      if (!section || typeof section !== "object") return;
      var sectionId = text(section.section_id);
      if (!sectionId || SHELL_SECTION_IDS[token(sectionId)]) return;
      if (!Array.isArray(section.materials)) return;
      section.materials.forEach(function (material) {
        if (!isUnrealizedIllustrationSpecification(material)) return;
        found.push({
          section_id: sectionId,
          material_id: text(material.material_id),
          material: material
        });
      });
    });
    return found;
  }

  function collectSuppressedUnrealizedXmGraphics(page) {
    var issues = [];
    var rows = Array.isArray(page && page.visual_affordances) ? page.visual_affordances : [];
    listUnrealizedXmMaterials(page).forEach(function (entry) {
      if (materialAlreadyHasGenerate(page, entry.section_id, entry.material_id)) return;
      rows.forEach(function (row, index) {
        if (!row || typeof row !== "object") return;
        var decision = text(row.visual_decision).toLowerCase();
        if (decision !== "defer" && decision !== "skip" && decision !== "reject") return;
        var sectionMatch = token(row.section_id) === token(entry.section_id);
        var materialMatch = rowAnchorsMaterial(row, entry.material_id);
        if (!sectionMatch && !materialMatch) return;
        issues.push({
          path: "visual_affordances[" + index + "]",
          section_id: entry.section_id,
          material_id: entry.material_id,
          visual_decision: decision,
          message:
            "visual_affordances[" +
            index +
            "]: " +
            decision +
            " must not suppress unrealised commissioned graphic " +
            entry.material_id +
            " in " +
            entry.section_id +
            "; structured specifications and textual fallbacks are not realised figures"
        });
      });
    });
    return issues;
  }

  function preparePageForXmIllustrationJobs(page) {
    if (!page || typeof page !== "object" || Array.isArray(page)) return page;
    if (!Array.isArray(page.sections)) return page;
    var additions = [];
    var coveredMaterials = Object.create(null);
    var suppressedMaterialIds = Object.create(null);
    listUnrealizedXmMaterials(page).forEach(function (entry) {
      var materialId = entry.material_id;
      if (!materialId || coveredMaterials[token(materialId)]) return;
      if (materialAlreadyHasGenerate(page, entry.section_id, materialId)) {
        coveredMaterials[token(materialId)] = true;
        return;
      }
      var row = affordanceFromMaterial(entry.material, entry.section_id);
      if (!row) return;
      coveredMaterials[token(materialId)] = true;
      suppressedMaterialIds[token(materialId)] = entry.section_id;
      additions.push(row);
    });
    var conflicts = collectSuppressedUnrealizedXmGraphics(page);
    if (!additions.length && !conflicts.length) return page;
    var next = JSON.parse(JSON.stringify(page));
    if (!Array.isArray(next.visual_affordances)) next.visual_affordances = [];
    // Drop defer/skip rows that would suppress a recognised unrealised graphic once a
    // generate handoff exists for that material (or will be added below).
    next.visual_affordances = next.visual_affordances.filter(function (row) {
      if (!row || typeof row !== "object") return true;
      var decision = text(row.visual_decision).toLowerCase();
      if (decision !== "defer" && decision !== "skip" && decision !== "reject") return true;
      return !Object.keys(suppressedMaterialIds).some(function (mid) {
        var sectionId = suppressedMaterialIds[mid];
        return (
          rowAnchorsMaterial(row, mid) ||
          (token(row.section_id) === token(sectionId) && !text(row.material_id))
        );
      });
    });
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
    isNumberLineSpecification: isNumberLineSpecification,
    isUnrealizedIllustrationSpecification: isUnrealizedIllustrationSpecification,
    readIllustration: readIllustration,
    collectSuppressedUnrealizedXmGraphics: collectSuppressedUnrealizedXmGraphics,
    preparePageForXmIllustrationJobs: preparePageForXmIllustrationJobs
  };
});

