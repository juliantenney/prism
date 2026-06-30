/**
 * Design Page — detect placeholder-only activity materials (prompt regression guard).
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_DESIGN_PAGE_MATERIALS_FIDELITY = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  /** Labels that are invalid unless paired with full learner-ready content in the same field. */
  var PLACEHOLDER_ONLY_LABEL_RES = [
    /^set of (short )?scenarios\b/i,
    /^scenario set describing\b/i,
    /^calculation table\b/i,
    /^model showing\b/i,
    /^table linking\b/i,
    /^see provided scenarios\b/i,
    /^table with basket items\b/i
  ];

  var MIN_RICH_STRING_LEN = 48;
  var MIN_SCENARIO_DETAIL_LEN = 80;

  var MATERIAL_DESCRIPTION_SYNOPSIS_RES = [
    /^example showing\b/i,
    /^scenario comparison showing\b/i,
    /\bshowing\b.+\bdifference\b/i,
    /\billustrating\b.+\b(reasoning|process|approach)\b/i,
    /^.+\bdescribing\b.+\b(scenario|example|table|process)\b/i,
    /^see full\b/i,
    /^this (note|example|scenario|table|material)\b/i,
    /\bprovided to (evaluate|complete|guide|support)\b/i,
    /^a (brief|short) (summary|overview|description)\b/i,
    /^overview of\b/i
  ];

  function looksLikeMaterialDescriptionSynopsis(text) {
    var trimmed = String(text || "").trim();
    if (!trimmed) return false;
    if (MATERIAL_DESCRIPTION_SYNOPSIS_RES.some(function (re) {
      return re.test(trimmed);
    })) {
      return trimmed.length < 500 || !/\n/.test(trimmed);
    }
    if (
      trimmed.length < 160 &&
      !/\|[^\n]+\|/.test(trimmed) &&
      !/^#{1,3}\s/m.test(trimmed) &&
      !/\*\*Step\s*\d+/i.test(trimmed) &&
      /^inflation refers to\b/i.test(trimmed)
    ) {
      return true;
    }
    return false;
  }

  var MATERIAL_CATALOGUE_META_RES = [
    /\bthis section includes\b/i,
    /\bincludes?\s+(a\s+)?worked example\b/i,
    /\bincludes?\s+(a\s+)?checklist\b/i,
    /\bworked example\b.{0,80}\bchecklist\b/i,
    /\bchecklist\b.{0,80}\btransfer prompt\b/i,
    /\blearners\s+(will\s+)?(compare|use|complete|evaluate|review)\b.+\b(provided|using the|table and prompts)\b/i,
    /\bmaterials?\s+(include|cover|contain|provide)\b/i,
    /\bprovided (table|prompts|scenarios|materials)\b/i
  ];

  function countMarkdownHeaders(text) {
    return (String(text || "").match(/^#{1,3}\s+/gm) || []).length;
  }

  function looksLikeMaterialCatalogueSynopsis(pageBody, gamBody) {
    var page = String(pageBody || "").trim();
    var gam = String(gamBody || "").trim();
    if (!page || !gam || page.length < 80) return false;
    var hasMeta = MATERIAL_CATALOGUE_META_RES.some(function (re) {
      return re.test(page);
    });
    if (!hasMeta) return false;
    var gamHeaders = countMarkdownHeaders(gam);
    var pageHeaders = countMarkdownHeaders(page);
    if (gamHeaders > 0 && pageHeaders < gamHeaders) return true;
    if (/\*\*Step\s+\d+/i.test(gam) && !/\*\*Step\s+\d+/i.test(page)) return true;
    if (gamHeaders >= 2 && page.length >= gam.length * 0.85) return true;
    return false;
  }

  function isNonEmptyString(value) {
    return typeof value === "string" && String(value).trim().length > 0;
  }

  function stringLooksPlaceholderOnly(text) {
    var trimmed = String(text || "").trim();
    if (!trimmed) return false;
    if (looksLikeMaterialDescriptionSynopsis(trimmed)) return true;
    var matchesLabel = PLACEHOLDER_ONLY_LABEL_RES.some(function (re) {
      return re.test(trimmed);
    });
    if (matchesLabel) {
      var hasRichMarkers =
        (/\|[^\n]+\|[\s\S]*\n\|/.test(trimmed)) ||
        (/###\s+/i.test(trimmed)) ||
        (trimmed.length >= 200 && /\d/.test(trimmed));
      return !hasRichMarkers;
    }
    return trimmed.length < 24;
  }

  function collectMaterialLeafStrings(value, out) {
    if (value == null) return;
    if (typeof value === "string") {
      out.push(value);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(function (item) {
        collectMaterialLeafStrings(item, out);
      });
      return;
    }
    if (typeof value === "object") {
      Object.keys(value).forEach(function (key) {
        collectMaterialLeafStrings(value[key], out);
      });
    }
  }

  function materialsObjectHasSubstantiveContent(materials) {
    if (!materials || typeof materials !== "object" || Array.isArray(materials)) {
      return false;
    }
    var leaves = [];
    collectMaterialLeafStrings(materials, leaves);
    if (!leaves.length) return false;
    var substantive = leaves.filter(function (s) {
      return !stringLooksPlaceholderOnly(s) && !looksLikeMaterialDescriptionSynopsis(s);
    });
    if (!substantive.length) return false;
    var hasTable =
      substantive.some(function (s) {
        return /\|[^\n]+\|/.test(s) && /\n\|/.test(s);
      }) ||
      Object.keys(materials).some(function (k) {
        return /table|worksheet|analysis_table|impact_table|comparison_table/i.test(k);
      });
    var hasScenarioDetail = substantive.some(function (s) {
      return (
        s.length >= MIN_SCENARIO_DETAIL_LEN &&
        (/###\s+scenario/i.test(s) ||
          /###\s+card/i.test(s) ||
          /scenario [a-d0-9]/i.test(s) ||
          /£|\$|percent|inflation|CPI/i.test(s))
      );
    });
    var hasWorked =
      Object.prototype.hasOwnProperty.call(materials, "worked_example") ||
      Object.prototype.hasOwnProperty.call(materials, "sample_output") ||
      substantive.some(function (s) {
        return /worked|step 1|sample answer/i.test(s);
      });
    if (hasTable || hasScenarioDetail || hasWorked) return true;
    return substantive.some(function (s) {
      return s.length >= MIN_RICH_STRING_LEN;
    });
  }

  function materialsObjectLooksPlaceholderOnly(materials) {
    if (!materials || typeof materials !== "object") return true;
    if (Array.isArray(materials)) {
      return (
        !materials.length ||
        materials.every(function (entry) {
          return (
            typeof entry === "string" &&
            (stringLooksPlaceholderOnly(entry) || /^[A-Za-z][\w\s]{0,40}$/.test(entry.trim()))
          );
        })
      );
    }
    var leaves = [];
    collectMaterialLeafStrings(materials, leaves);
    if (!leaves.length) return true;
    return leaves.every(stringLooksPlaceholderOnly);
  }

  function findLearningActivitiesContent(page) {
    if (!page || !Array.isArray(page.sections)) return [];
    var section = page.sections.find(function (s) {
      return s && (s.section_id === "learning_activities" || /learning activities/i.test(String(s.heading || "")));
    });
    if (!section) return [];
    var content = section.content;
    if (Array.isArray(content)) return content;
    if (content && Array.isArray(content.content)) return content.content;
    if (content && Array.isArray(content.activities)) return content.activities;
    return [];
  }

  function pageActivityMaterialsLookPlaceholderOnly(page) {
    var rows = findLearningActivitiesContent(page);
    if (!rows.length) return false;
    return rows.every(function (row) {
      return materialsObjectLooksPlaceholderOnly(row && row.materials);
    });
  }

  function pageActivityMaterialsHaveRichContent(page) {
    var rows = findLearningActivitiesContent(page);
    if (!rows.length) return false;
    return rows.some(function (row) {
      return materialsObjectHasSubstantiveContent(row && row.materials);
    });
  }

  return {
    PLACEHOLDER_ONLY_LABEL_RES: PLACEHOLDER_ONLY_LABEL_RES,
    MATERIAL_DESCRIPTION_SYNOPSIS_RES: MATERIAL_DESCRIPTION_SYNOPSIS_RES,
    looksLikeMaterialDescriptionSynopsis: looksLikeMaterialDescriptionSynopsis,
    looksLikeMaterialCatalogueSynopsis: looksLikeMaterialCatalogueSynopsis,
    countMarkdownHeaders: countMarkdownHeaders,
    stringLooksPlaceholderOnly: stringLooksPlaceholderOnly,
    materialsObjectLooksPlaceholderOnly: materialsObjectLooksPlaceholderOnly,
    materialsObjectHasSubstantiveContent: materialsObjectHasSubstantiveContent,
    pageActivityMaterialsLookPlaceholderOnly: pageActivityMaterialsLookPlaceholderOnly,
    pageActivityMaterialsHaveRichContent: pageActivityMaterialsHaveRichContent
  };
});
