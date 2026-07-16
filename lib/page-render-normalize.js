/**
 * Sprint 56F Phase 8 — Renderer compatibility layer for vNext page shape.
 * Produces a non-mutating render view: legacy sections[] + object-map materials.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_PAGE_RENDER_NORMALIZE = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var VNEXT_SCHEMA_VERSION = "2.0.0";

  var SECTION_DISPLAY_ORDER = [
    "knowledge_summary",
    "learning_journey",
    "learning_sequence",
    "learning_activities",
    "assessment_check",
    "support_notes",
    "study_tips",
    "overview",
    "learning_purpose"
  ];

  var SECTION_HEADINGS = {
    overview: "Overview",
    learning_purpose: "Learning Purpose",
    knowledge_summary: "Knowledge Summary",
    learning_journey: "Learning Journey",
    learning_activities: "Learning Activities",
    learning_sequence: "Learning Journey",
    assessment_check: "Assessment Check",
    support_notes: "Support Notes",
    study_tips: "Study Tips"
  };

  function isEmptyValue(value) {
    if (value == null) return true;
    if (typeof value === "string") return !String(value).trim();
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "object") return Object.keys(value).length === 0;
    return false;
  }

  function isVNextPage(page) {
    if (!page || typeof page !== "object" || Array.isArray(page)) return false;
    if (String(page.schema_version || "") === VNEXT_SCHEMA_VERSION) return true;
    if (page.page_synthesis && typeof page.page_synthesis === "object" && !Array.isArray(page.page_synthesis)) {
      return true;
    }
    if (Array.isArray(page.activities) && page.activities.length > 0) {
      if (!Array.isArray(page.sections) || page.sections.length === 0) return true;
      if (String(page.schema_version || "")) return true;
    }
    if (page.learning_sequence && typeof page.learning_sequence === "object" && !Array.isArray(page.learning_sequence)) {
      if (!Array.isArray(page.sections) || !page.sections.some(function (sec) {
        return sec && String(sec.section_id || sec.id || "").toLowerCase() === "learning_sequence";
      })) {
        return true;
      }
    }
    if (page.assessment_check && typeof page.assessment_check === "object" && !Array.isArray(page.assessment_check)) {
      if (!Array.isArray(page.sections) || !page.sections.some(function (sec) {
        return sec && String(sec.section_id || sec.id || "").toLowerCase() === "assessment_check";
      })) {
        return true;
      }
    }
    return false;
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

  function canonicalSectionId(section) {
    if (!section || typeof section !== "object") return "";
    return String(section.section_id || section.id || "")
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, "_");
  }

  function sectionHeading(sectionId, existingHeading) {
    if (existingHeading && String(existingHeading).trim()) return String(existingHeading).trim();
    return SECTION_HEADINGS[sectionId] || sectionId;
  }

  function materialTypeToRenderKey(type) {
    var t = String(type || "")
      .toLowerCase()
      .trim()
      .replace(/[\s-]+/g, "_");
    if (t === "scenario") return "scenarios";
    if (t === "task_card") return "task_cards";
    if (t === "prompt" || t === "prompts") return "prompt_set";
    if (t === "discussion_prompts" || t === "discussion_prompt" || t === "wrap_up_prompts") {
      return "prompt_set";
    }
    if (t === "analysis_template" || t === "worksheet_template") return "template";
    if (t === "evaluation_checklist") return "checklist";
    if (t === "tables") return "impact_table";
    if (t === "table") return "table";
    if (t === "worked_example") return "worked_example";
    if (t === "transfer_prompt") return "transfer_prompt";
    if (t === "consolidation_summary") return "consolidation_summary";
    if (t === "reflection_prompt") return "reflection_prompt";
    if (t === "modelling_note") return "modelling_note";
    if (t === "sample_output") return "sample_output";
    return t || "text";
  }

  function slugFromMaterialId(materialId) {
    return String(materialId || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  function appendMaterialBucket(target, key, value) {
    if (!key || isEmptyValue(value)) return;
    var listKeys = { scenarios: true, task_cards: true, cards: true, checklist: true, prompt_set: true };
    if (listKeys[key]) {
      if (!Array.isArray(target[key])) target[key] = [];
      if (Array.isArray(value)) {
        value.forEach(function (entry) {
          target[key].push(entry);
        });
      } else {
        target[key].push(value);
      }
      return;
    }
    if (isEmptyValue(target[key])) {
      target[key] = value;
    }
  }

  function uniqueMaterialStorageKey(typeKey, materialId, index, usedKeys) {
    var base = typeKey || "text";
    if (materialId && usedKeys[base]) {
      base = slugFromMaterialId(materialId);
    }
    if (!usedKeys[base]) return base;
    if (materialId) {
      var slugKey = slugFromMaterialId(materialId);
      if (!usedKeys[slugKey]) return slugKey;
    }
    var suffix = 2;
    var candidate = base + "_" + suffix;
    while (usedKeys[candidate]) {
      suffix += 1;
      candidate = base + "_" + suffix;
    }
    return candidate;
  }

  function convertMaterialsArrayToObjectMap(materials) {
    if (!Array.isArray(materials)) return materials;
    var out = {};
    var usedKeys = {};
    var sequence = [];
    materials.forEach(function (entry, index) {
      if (isEmptyValue(entry)) return;
      if (typeof entry === "string") {
        var textKey = uniqueMaterialStorageKey("text", "", index, usedKeys);
        usedKeys[textKey] = true;
        out[textKey] = entry;
        sequence.push({ key: textKey, material_id: "", material_type: "text" });
        return;
      }
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) return;
      var materialId = String(entry.material_id || "").trim();
      var typeKey = materialTypeToRenderKey(
        entry.material_type || entry.type || entry.materialType || entry.kind
      );
      var payload =
        entry.body != null
          ? entry.body
          : entry.content != null
          ? entry.content
          : entry.text != null
          ? entry.text
          : entry;
      var materialTitle = String(entry.title || "").trim();
      var materialPurpose = String(entry.purpose || "").trim();
      if (materialTitle) {
        var payloadBody = payload;
        if (payloadBody && typeof payloadBody === "object" && !Array.isArray(payloadBody)) {
          payloadBody =
            payloadBody.body != null
              ? payloadBody.body
              : payloadBody.content != null
              ? payloadBody.content
              : payloadBody.text != null
              ? payloadBody.text
              : payloadBody;
        }
        payload = {
          title: materialTitle,
          body: payloadBody
        };
        if (materialPurpose) payload.purpose = materialPurpose;
      }
      var renderKey = uniqueMaterialStorageKey(typeKey, materialId, index, usedKeys);
      usedKeys[renderKey] = true;
      if (materialId) {
        out._material_ids = out._material_ids || {};
        out._material_ids[renderKey] = materialId;
      }
      out._material_types = out._material_types || {};
      out._material_types[renderKey] = typeKey;
      sequence.push({
        key: renderKey,
        material_id: materialId,
        material_type: typeKey
      });
      out[renderKey] = payload;
    });
    if (sequence.length) {
      out._render_sequence = sequence;
    }
    return out;
  }

  function normalizeActivityRowForRender(activity) {
    if (!activity || typeof activity !== "object" || Array.isArray(activity)) return activity;
    var row = deepClone(activity);
    if (Array.isArray(row.materials)) {
      row.materials = convertMaterialsArrayToObjectMap(row.materials);
    }
    return row;
  }

  function normalizeActivitiesForRender(activities) {
    if (!Array.isArray(activities)) return [];
    return activities
      .filter(function (row) {
        return row && typeof row === "object" && !Array.isArray(row);
      })
      .map(normalizeActivityRowForRender);
  }

  function synthesisSlotToSectionContent(slot) {
    if (slot == null) return null;
    if (typeof slot === "string") return slot;
    if (typeof slot !== "object" || Array.isArray(slot)) return null;
    if (Array.isArray(slot.concepts) && slot.concepts.length) {
      return {
        concepts: deepClone(slot.concepts),
        relationships: slot.relationships || "",
        use_in_activities: slot.use_in_activities || "",
        body: slot.body || ""
      };
    }
    if (!isEmptyValue(slot.body)) return slot.body;
    if (!isEmptyValue(slot.blocks)) return slot;
    return null;
  }

  function synthesisSlotHeading(sectionId, slot) {
    if (slot && typeof slot === "object" && !Array.isArray(slot) && slot.heading) {
      return String(slot.heading).trim();
    }
    return SECTION_HEADINGS[sectionId] || sectionId;
  }

  function buildSectionEntry(sectionId, content, headingOverride) {
    if (isEmptyValue(content)) return null;
    return {
      section_id: sectionId,
      heading: headingOverride || sectionHeading(sectionId),
      content: content
    };
  }

  function mergeSectionMaps(baseMap, overlayMap) {
    var merged = deepClone(baseMap || {});
    Object.keys(overlayMap || {}).forEach(function (key) {
      if (overlayMap[key]) merged[key] = overlayMap[key];
    });
    return merged;
  }

  function sectionsArrayToMap(sections) {
    var map = {};
    if (!Array.isArray(sections)) return map;
    sections.forEach(function (sec) {
      var sid = canonicalSectionId(sec);
      if (!sid) return;
      map[sid] = {
        section_id: sid,
        heading: sectionHeading(sid, sec.heading || sec.title || sec.name),
        content: sec.content
      };
    });
    return map;
  }

  function topLevelKeysToSectionMap(page, keys) {
    var map = {};
    keys.forEach(function (sid) {
      if (!isEmptyValue(page[sid])) {
        map[sid] = buildSectionEntry(sid, page[sid]);
      }
    });
    return map;
  }

  function pageSynthesisToSectionMap(pageSynthesis) {
    var map = {};
    if (!pageSynthesis || typeof pageSynthesis !== "object" || Array.isArray(pageSynthesis)) {
      return map;
    }
    ["overview", "learning_purpose", "knowledge_summary", "support_notes", "study_tips"].forEach(function (key) {
      var content = synthesisSlotToSectionContent(pageSynthesis[key]);
      if (!isEmptyValue(content)) {
        map[key] = buildSectionEntry(key, content, synthesisSlotHeading(key, pageSynthesis[key]));
      }
    });
    return map;
  }

  function buildRenderSections(page) {
    var synthesisKeys = ["overview", "learning_purpose", "knowledge_summary", "support_notes", "study_tips"];
    var sectionMap = sectionsArrayToMap(page.sections);
    sectionMap = mergeSectionMaps(sectionMap, topLevelKeysToSectionMap(page, synthesisKeys));
    sectionMap = mergeSectionMaps(sectionMap, pageSynthesisToSectionMap(page.page_synthesis));

    var normalizedActivities = normalizeActivitiesForRender(page.activities);
    if (normalizedActivities.length) {
      sectionMap.learning_activities = buildSectionEntry(
        "learning_activities",
        normalizedActivities
      );
    }

    if (!isEmptyValue(page.learning_sequence)) {
      sectionMap.learning_sequence = buildSectionEntry("learning_sequence", page.learning_sequence);
    }

    if (
      !isEmptyValue(sectionMap.learning_sequence) ||
      !isEmptyValue(sectionMap.overview) ||
      !isEmptyValue(sectionMap.learning_purpose)
    ) {
      sectionMap.learning_journey = buildSectionEntry("learning_journey", {
        overview: sectionMap.overview ? sectionMap.overview.content : "",
        learning_purpose: sectionMap.learning_purpose ? sectionMap.learning_purpose.content : "",
        learning_sequence: sectionMap.learning_sequence ? sectionMap.learning_sequence.content : ""
      });
    }

    if (!isEmptyValue(page.assessment_check)) {
      sectionMap.assessment_check = buildSectionEntry("assessment_check", page.assessment_check);
    }

    return SECTION_DISPLAY_ORDER.filter(function (sid) {
      return !!sectionMap[sid];
    }).map(function (sid) {
      return sectionMap[sid];
    });
  }

  function resolveOverviewTextForCompass(page) {
    if (!page || typeof page !== "object") return "";
    var synthesis = page.page_synthesis;
    if (synthesis && synthesis.overview && typeof synthesis.overview === "object") {
      var body = synthesis.overview.body;
      if (!isEmptyValue(body)) return String(body).trim();
    }
    if (!isEmptyValue(page.overview)) {
      return typeof page.overview === "string" ? String(page.overview).trim() : "";
    }
    return "";
  }

  function normalizePageForRender(page) {
    if (!page || typeof page !== "object" || Array.isArray(page)) return page;
    if (page.__prismRenderNormalized === true) return page;
    if (!isVNextPage(page)) return page;

    var clone = deepClone(page);
    var sections = buildRenderSections(clone);
    var normalizedActivities = normalizeActivitiesForRender(clone.activities);

    if (normalizedActivities.length) {
      clone.activities = normalizedActivities;
    }

    if (sections.length) {
      clone.sections = sections;
    }

    clone.__prismRenderNormalized = true;
    return clone;
  }

  return {
    VNEXT_SCHEMA_VERSION: VNEXT_SCHEMA_VERSION,
    SECTION_DISPLAY_ORDER: SECTION_DISPLAY_ORDER,
    isVNextPage: isVNextPage,
    isEmptyValue: isEmptyValue,
    materialTypeToRenderKey: materialTypeToRenderKey,
    convertMaterialsArrayToObjectMap: convertMaterialsArrayToObjectMap,
    normalizeActivitiesForRender: normalizeActivitiesForRender,
    synthesisSlotToSectionContent: synthesisSlotToSectionContent,
    resolveOverviewTextForCompass: resolveOverviewTextForCompass,
    normalizePageForRender: normalizePageForRender
  };
});
