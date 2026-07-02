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

  var roleRegistry = null;
  try {
    // eslint-disable-next-line global-require
    roleRegistry = require("./page-role-registry.js");
  } catch (registryRequireErr) {
    roleRegistry = null;
  }
  if (!roleRegistry && typeof globalThis !== "undefined" && globalThis.PRISM_PAGE_ROLE_REGISTRY) {
    roleRegistry = globalThis.PRISM_PAGE_ROLE_REGISTRY;
  }
  if (
    !roleRegistry &&
    typeof window !== "undefined" &&
    window.PRISM_PAGE_ROLE_REGISTRY
  ) {
    roleRegistry = window.PRISM_PAGE_ROLE_REGISTRY;
  }

  var ROLE_AUTHORITY = {
    CANONICAL: "canonical",
    COMPOSE: "compose",
    ALIAS: "alias",
    SUPERSEDED: "superseded",
    UNRESOLVED: "unresolved"
  };

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
      if (content && Array.isArray(content.content)) return content.content;
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

  function normalizeMaterialTypeToken(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/\\_/g, "_")
      .trim();
  }

  function pageFieldKeyForMaterial(mat) {
    var type = normalizeMaterialTypeToken(mat && mat.type);
    var purpose = normalizeMaterialTypeToken(mat && mat.purpose);
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
      if (/criteria/.test(purpose)) return "criteria_exposition_evaluate";
      if (/concept|exposition|elucidation/.test(purpose)) return "concept_exposition";
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

  function specificationLooksLikeRealisedBody(text) {
    var trimmed = String(text || "").trim();
    if (trimmed.length < 200) return false;
    if (/^#{1,3}\s/m.test(trimmed)) return true;
    if (/\*\*Step\s*\d+/i.test(trimmed)) return true;
    if (/\|[^\n]+\|[\s\S]*\n\|[^\n]+\|/.test(trimmed)) return true;
    return trimmed.length >= 400;
  }

  function materialContent(mat) {
    if (!mat || typeof mat !== "object") return "";
    if (typeof mat.content === "string" && String(mat.content).trim()) return mat.content;
    if (mat.content && typeof mat.content === "object" && !Array.isArray(mat.content)) {
      var nestedContent = firstNonEmptyMaterialValue(mat.content, [
        "content",
        "body",
        "text",
        "markdown",
        "value",
        "prompt",
        "description",
        "learner_facing_content",
        "renderable_content"
      ]);
      if (nestedContent) return nestedContent;
    }
    if (typeof mat.learner_facing_content === "string" && String(mat.learner_facing_content).trim()) {
      return mat.learner_facing_content;
    }
    if (typeof mat.renderable_content === "string" && String(mat.renderable_content).trim()) {
      return mat.renderable_content;
    }
    if (typeof mat.body === "string" && String(mat.body).trim()) return mat.body;
    if (typeof mat.text === "string" && String(mat.text).trim()) return mat.text;
    if (typeof mat.markdown === "string" && String(mat.markdown).trim()) return mat.markdown;
    if (typeof mat.value === "string" && String(mat.value).trim()) return mat.value;
    if (typeof mat.prompt === "string" && String(mat.prompt).trim()) return mat.prompt;
    if (typeof mat.description === "string" && String(mat.description).trim()) return mat.description;
    if (
      typeof mat.specification === "string" &&
      String(mat.specification).trim() &&
      specificationLooksLikeRealisedBody(mat.specification)
    ) {
      return mat.specification;
    }
    return "";
  }

  function buildMaterialsObjectFromGamList(materialsList) {
    var out = {};
    if (!Array.isArray(materialsList)) return out;
    materialsList.forEach(function (mat) {
      var content = materialContent(mat);
      if (!String(content || "").trim()) return;
      var key = pageFieldKeyForMaterial(mat);
      var typeKey = normalizeMaterialTypeToken(mat && mat.type);
      // Preserve full upstream learner-facing body on canonical page key.
      out[key] = content;
      // Also preserve by material_id to avoid losing distinct bodies
      // when multiple upstream materials map to the same canonical page key.
      var materialIdKey = String(mat && mat.material_id ? mat.material_id : "").trim();
      if (materialIdKey) out[materialIdKey] = content;
      // LLM compose often emits shorthand type keys (text, worked_example) with reference tokens.
      if (typeKey) out[typeKey] = content;
    });
    applyRendererCanonicalAliases(out);
    return out;
  }

  function purgeMaterialReferenceTokensFromMaterials(materials) {
    if (!materials || typeof materials !== "object" || Array.isArray(materials)) return materials;
    var hasSubstantive = materialsObjectHasSubstantiveContent(materials);
    if (!hasSubstantive) return materials;
    Object.keys(materials).forEach(function (key) {
      var val = materials[key];
      if (typeof val !== "string") return;
      if (!stringLooksPlaceholderOnly(val) && !looksLikeMaterialReferenceToken(val)) return;
      delete materials[key];
    });
    return materials;
  }

  function looksLikeMaterialReferenceToken(text) {
    if (fidelity.looksLikeMaterialReferenceToken) {
      return fidelity.looksLikeMaterialReferenceToken(text);
    }
    return /^[A-Z]\d+_(?:TEXT|WORKED|SAMPLE|CHECK)/i.test(String(text || "").trim());
  }

  function materialsObjectHasSubstantiveContent(materials) {
    if (fidelity.materialsObjectHasSubstantiveContent) {
      return fidelity.materialsObjectHasSubstantiveContent(materials);
    }
    if (!materials || typeof materials !== "object") return false;
    return Object.keys(materials).some(function (key) {
      var val = materials[key];
      if (typeof val !== "string") return false;
      return !stringLooksPlaceholderOnly(val) && String(val).trim().length > 0;
    });
  }

  function preferAliasFromCanonical(materials, canonicalKey, aliasKey) {
    var canonical = materials[canonicalKey];
    if (typeof canonical !== "string" || !String(canonical).trim()) return;
    var alias = materials[aliasKey];
    if (alias == null || alias === "" || String(canonical) !== String(alias)) {
      if (!alias || String(canonical).length >= String(alias).length) {
        materials[aliasKey] = canonical;
      }
    }
  }

  function applyRendererCanonicalAliases(materials) {
    if (!materials || typeof materials !== "object") return materials;
    preferAliasFromCanonical(materials, "checklist_evaluate", "checklist");
    preferAliasFromCanonical(materials, "checklist_evaluate", "evaluation_checklist");
    preferAliasFromCanonical(materials, "transfer_prompt_evaluate", "transfer_prompt");
    preferAliasFromCanonical(materials, "worked_analytic_pass", "worked_example");
    preferAliasFromCanonical(materials, "worked_judgement_weak_strong", "worked_example");
    preferAliasFromCanonical(materials, "scenario_maya_strategy_menu", "scenario");
    if (materials.scenario_maya_households && !materials.scenarios) {
      materials.scenarios = [materials.scenario_maya_households];
    }
    preferAliasFromCanonical(materials, "independent_judgement_template", "template");
    preferAliasFromCanonical(materials, "guided_judgement_table", "decision_table");
    preferAliasFromCanonical(materials, "classification_table", "worksheet");
    return materials;
  }

  function shouldPreferGamContent(pageVal, gamVal) {
    if (pageVal == null || pageVal === "") return true;
    if (typeof gamVal !== "string") return false;
    if (typeof pageVal !== "string") return true;
    if (stringLooksPlaceholderOnly(pageVal)) return true;
    return gamVal.length > pageVal.length * 1.1;
  }

  var CATALOGUE_SYNOPSIS_RES = [
    /are provided to evaluate/i,
    /\bprovided to evaluate\b/i,
    /\b(?:five|neutral).{0,40}strateg(?:y|ies).{0,40}(?:are|is) provided/i,
    /This note shows stepwise reasoning/i,
    /illustrating how to justify strategy choices/i,
    /contrasting weak.{0,20}strong evaluations?, illustrating/i
  ];

  var FIDELITY_CONTRACTS = {
    scenario_maya_strategy_menu: {
      material_id: "M12_Scenario_Maya_Strategy_Menu",
      tier: "A",
      minRatio: 0.9,
      markers: ["strategy_a", "strategy_e"]
    },
    worked_judgement_weak_strong: {
      material_id: "M14_Worked_Judgement_Weak_Strong",
      tier: "A",
      minRatio: 0.9,
      markers: ["weak_worked_judgement", "strong_worked_judgement"]
    },
    guided_judgement_table: {
      material_id: "M15_Guided_Judgement_Table",
      tier: "A",
      minRatio: 0.9,
      markers: ["guided_table_exemplar"]
    },
    transfer_prompt_evaluate: {
      material_id: "M18_Transfer_Prompt_Evaluate",
      tier: "B",
      minRatio: 0.8,
      markers: ["transfer_word_band"]
    },
    consolidation_summary: {
      material_id: "M19_Consolidation_Summary",
      tier: "B2",
      minRatio: 0.7,
      markers: ["consolidation_reflect"]
    },
    criteria_exposition_evaluate: {
      material_id: "M13_Criteria_Exposition_Evaluate",
      tier: "C",
      minRatio: 0.85,
      markers: ["Depth", "Adaptability", "Transferability"]
    },
    independent_judgement_template: {
      material_id: "M16_Independent_Judgement_Template",
      tier: "C",
      minRatio: 0.85,
      markers: []
    },
    worked_analytic_pass: {
      material_id: "M8_Worked_Analytic_Pass_Household_Inflation",
      tier: "D",
      minRatio: 0.99,
      markers: ["Distribution Lens", "Stepwise Analysis"]
    },
    scenario_maya_households: {
      material_id: "M9_Scenario_Maya_Households",
      tier: "D",
      minRatio: 0.99,
      markers: ["Fixed-Income Household"]
    },
    analysis_table: {
      material_id: "M10_Analysis_Table_Household_Comparison",
      tier: "D",
      minRatio: 0.99,
      markers: ["Learner Entry"]
    },
    comparison_table: {
      tier: "D",
      minRatio: 0.99,
      markers: []
    },
    worked_example: {
      tier: "D",
      minRatio: 0.99,
      markers: ["what_experts_notice"]
    },
    sample_output: {
      tier: "D",
      minRatio: 0.99,
      markers: ["why_this_works"]
    },
    checklist: {
      tier: "B",
      minRatio: 0.99,
      markers: ["common_mistakes", "revise_if_not_met"]
    },
    checklist_evaluate: {
      tier: "B",
      minRatio: 0.99,
      markers: ["common_mistakes", "revise_if_not_met"]
    },
    prompt_set: {
      tier: "B",
      minRatio: 0.99,
      markers: []
    }
  };

  var TIER_DEFAULT_MIN_RATIO = { A: 0.9, B: 0.8, B2: 0.7, C: 0.85, D: 0.99, E: 0 };

  var PAGE_MATERIAL_KEY_ALIASES = {
    scenario_maya_strategy_menu: ["scenario_maya_strategy_menu", "scenario", "scenarios"],
    worked_judgement_weak_strong: [
      "worked_judgement_weak_strong",
      "worked_example",
      "modelling_note"
    ],
    guided_judgement_table: ["guided_judgement_table", "decision_table"],
    criteria_exposition_evaluate: ["criteria_exposition_evaluate", "criteria_text", "criteria"],
    independent_judgement_template: ["independent_judgement_template", "template"],
    transfer_prompt_evaluate: ["transfer_prompt_evaluate", "transfer_prompt"],
    scenario_maya_households: ["scenario_maya_households", "scenario", "scenarios"],
    worked_analytic_pass: ["worked_analytic_pass", "worked_example"],
    checklist: ["checklist", "checklist_evaluate", "verification_checklist", "evaluation_checklist"]
  };

  function firstNonEmptyMaterialValue(materials, keys) {
    if (!materials || typeof materials !== "object") return "";
    var i;
    for (i = 0; i < keys.length; i += 1) {
      var key = keys[i];
      if (materials[key] == null || materials[key] === "") continue;
      var val = materials[key];
      if (Array.isArray(val)) {
        var joined = val
          .map(function (entry) {
            return String(entry || "").trim();
          })
          .filter(function (s) {
            return !!s;
          })
          .join("\n\n");
        if (joined) return joined;
        continue;
      }
      var text = String(val || "").trim();
      if (text) return text;
    }
    return "";
  }

  function pageMaterialText(materials, pageKey) {
    var key = String(pageKey || "");
    var aliases = PAGE_MATERIAL_KEY_ALIASES[key] || [key];
    return firstNonEmptyMaterialValue(materials, aliases);
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
      case "guided_table_exemplar":
        return hasGuidedTableExemplar(body);
      case "transfer_word_band":
        return /at\s+least\s+80\s+words/i.test(body);
      case "consolidation_reflect":
        return (
          /Reflect on/i.test(body) ||
          (body.match(/\n-\s/g) || []).length >= 3 ||
          /consolidat/i.test(body)
        );
      case "what_experts_notice":
        return /## What experts notice/i.test(body);
      case "why_this_works":
        return /## Why this works/i.test(body);
      case "common_mistakes":
        return /## Common mistakes/i.test(body);
      case "revise_if_not_met":
        return /### If any check is not met:/i.test(body);
      default:
        return body.indexOf(markerId) !== -1;
    }
  }

  function hasGuidedTableExemplar(text) {
    var body = String(text || "");
    if (!/\|[^\n]+\|/.test(body)) return false;
    if (/Partial example/i.test(body) && !/Strategy\s+[A-E]/i.test(body)) return false;
    if (/Budget\s+Tightening/i.test(body) && /Moderate:|Focuses on spending/i.test(body)) {
      return true;
    }
    if (/Strategy\s+[A-E]\s*:/i.test(body)) return true;
    return /[A-E]\s*\|[^\n]{12,}/i.test(body);
  }

  function evaluateMaterialMarkers(body, markers) {
    var found = [];
    var missing = [];
    (markers || []).forEach(function (marker) {
      if (semanticMarkerSatisfied(marker, body)) found.push(marker);
      else missing.push(marker);
    });
    return { found: found, missing: missing };
  }

  function resolveFidelityContract(pageKey, mat) {
    if (FIDELITY_CONTRACTS[pageKey]) {
      return FIDELITY_CONTRACTS[pageKey];
    }
    var type = String((mat && mat.type) || "").toLowerCase();
    if (type === "checklist") {
      return {
        material_id: mat && mat.material_id,
        tier: "B",
        minRatio: 0.99,
        markers: ["common_mistakes", "revise_if_not_met"]
      };
    }
    if (type === "worked_example") {
      return {
        material_id: mat && mat.material_id,
        tier: "D",
        minRatio: 0.99,
        markers: ["what_experts_notice"]
      };
    }
    if (type === "sample_output") {
      return {
        material_id: mat && mat.material_id,
        tier: "D",
        minRatio: 0.99,
        markers: ["why_this_works"]
      };
    }
    if (type === "prompt_set") {
      return { material_id: mat && mat.material_id, tier: "B", minRatio: 0.99, markers: [] };
    }
    return { material_id: mat && mat.material_id, tier: "D", minRatio: 0.99, markers: [] };
  }

  function markersPresent(body, markers) {
    if (!markers || !markers.length) return true;
    return evaluateMaterialMarkers(body, markers).missing.length === 0;
  }

  function catalogueSynopsis(pageBody, spec) {
    if (!pageBody || !spec) return false;
    var text = String(pageBody);
    var hasCat = CATALOGUE_SYNOPSIS_RES.some(function (re) {
      return re.test(text);
    });
    if (!hasCat) return false;
    if (spec.markers && spec.markers.length) {
      return !markersPresent(text, spec.markers);
    }
    return true;
  }

  function countMarkdownTableRows(text) {
    var lines = String(text || "").split(/\n/);
    var count = 0;
    lines.forEach(function (line) {
      if (/^\s*\|[^\n|]+\|/.test(line) && !/^\s*\|[\s\-:|]+\|\s*$/.test(line)) {
        count += 1;
      }
    });
    return count;
  }

  function tableShellCollapse(pageBody, pageKey, gamBody) {
    var key = String(pageKey || "");
    var text = String(pageBody || "");
    var gam = String(gamBody || "");
    if (/guided_judgement_table|decision_table/.test(key)) {
      if (!/\|[^\n]+\|/.test(text)) return false;
      if (!/Partial example/i.test(text)) return false;
      if (hasGuidedTableExemplar(text)) return false;
      return true;
    }
    if (/analysis_table|comparison_table/.test(key) && gam && /\|[^\n]+\|/.test(text) && /\|[^\n]+\|/.test(gam)) {
      var pageRows = countMarkdownTableRows(text);
      var gamRows = countMarkdownTableRows(gam);
      if (gamRows >= 3 && pageRows > 0 && pageRows < gamRows) return true;
      if (gam.length > text.length * 1.15) return true;
    }
    return false;
  }

  function metaReplacement(pageBody, pageKey) {
    var key = String(pageKey || "");
    if (!/independent_judgement_template/.test(key) && key !== "template") return false;
    var text = String(pageBody || "");
    var hasMeta =
      /Use this scaffold to write/i.test(text) ||
      (/Strategy choice/i.test(text) && /trade-offs/i.test(text));
    if (!hasMeta) return false;
    if (/\*\*To:\*\*/.test(text) || /\*\*Subject:\*\*/.test(text)) return false;
    return true;
  }

  function severeCompression(pageBody, gamBody, pageKey) {
    var key = String(pageKey || "");
    if (!/transfer_prompt|consolidation_summary/.test(key)) return false;
    var page = String(pageBody || "");
    var gam = String(gamBody || "");
    if (!gam || page.length >= gam.length * 0.5) return false;
    var missing = 0;
    gam.split(/\n/).forEach(function (line) {
      var trimmed = line.trim();
      if ((/^- /.test(trimmed) || /^\d+\. /.test(trimmed)) && page.indexOf(trimmed) === -1) {
        missing += 1;
      }
    });
    return missing >= 2;
  }

  function isSynopsisOrShell(pageBody, gamBody, pageKey, spec) {
    return (
      catalogueSynopsis(pageBody, spec) ||
      tableShellCollapse(pageBody, pageKey, gamBody) ||
      metaReplacement(pageBody, pageKey) ||
      severeCompression(pageBody, gamBody, pageKey)
    );
  }

  function pageBodyLooksLikeDescriptionSynopsis(pageBody) {
    if (fidelity.looksLikeMaterialDescriptionSynopsis) {
      return fidelity.looksLikeMaterialDescriptionSynopsis(pageBody);
    }
    return false;
  }

  var AUTHORITATIVE_GAM_PAGE_KEYS_RE =
    /^(worked_example|worked_analytic_pass|worked_judgement_weak_strong|sample_output|checklist|checklist_evaluate|evaluation_checklist|analysis_table|guided_judgement_table|decision_table|comparison_table|impact_table|classification_table|prompt_set|transfer_prompt|transfer_prompt_evaluate|consolidation_summary|modelling_note)$/;

  var PEDAGOGIC_SECTION_PATTERNS = [
    /## What experts notice/i,
    /## Why this works/i,
    /## Common mistakes/i,
    /### If any check is not met:/i
  ];

  function isAuthoritativeGamPageKey(pageKey) {
    return AUTHORITATIVE_GAM_PAGE_KEYS_RE.test(String(pageKey || ""));
  }

  function normalizeBodyForCompare(text) {
    return String(text || "")
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+\n/g, "\n")
      .trim();
  }

  function bodiesEquivalent(pageBody, gamBody) {
    return normalizeBodyForCompare(pageBody) === normalizeBodyForCompare(gamBody);
  }

  function countSectionBullets(body, sectionRe) {
    var text = String(body || "");
    var match = sectionRe.exec(text);
    if (!match) return 0;
    var start = match.index + match[0].length;
    var rest = text.slice(start);
    var nextHeading = rest.search(/\n#{1,3}\s/);
    var section = nextHeading === -1 ? rest : rest.slice(0, nextHeading);
    var bullets = section.match(/(?:^|\n)\s*[-•*]\s+/g);
    return bullets ? bullets.length : 0;
  }

  function pedagogicRichnessLoss(pageBody, gamBody) {
    var page = String(pageBody || "");
    var gam = String(gamBody || "");
    if (!gam || bodiesEquivalent(page, gam)) return false;
    var i;
    for (i = 0; i < PEDAGOGIC_SECTION_PATTERNS.length; i += 1) {
      var re = PEDAGOGIC_SECTION_PATTERNS[i];
      var gamHas = re.test(gam);
      var pageHas = re.test(page);
      if (gamHas && !pageHas) return true;
      if (gamHas && pageHas) {
        var gamBullets = countSectionBullets(gam, re);
        var pageBullets = countSectionBullets(page, re);
        if (gamBullets > pageBullets) return true;
      }
    }
    if (gam.length > page.length * 1.02) return true;
    return false;
  }

  function shouldMergeGamBody(pageBody, gamBody, pageKey, spec, mat) {
    if (pageBody == null || pageBody === "") return true;
    if (typeof gamBody !== "string" || !gamBody) return false;
    if (typeof pageBody !== "string") return true;
    if (bodiesEquivalent(pageBody, gamBody)) return false;
    var markerEval = evaluateClosureScaffoldMarkers(pageBody, gamBody, pageKey, mat || {});
    if (stringLooksPlaceholderOnly(pageBody)) return true;
    if (pageBodyLooksLikeDescriptionSynopsis(pageBody)) return true;
    if (pageBodyLooksLikeMaterialCatalogueSynopsis(pageBody, gamBody)) return true;
    if (tableShellCollapse(pageBody, pageKey, gamBody)) return true;
    if (isAuthoritativeGamPageKey(pageKey)) {
      if (isSynopsisOrShell(pageBody, gamBody, pageKey, spec)) return true;
      if (pedagogicRichnessLoss(pageBody, gamBody)) return true;
      if (markerEval.missing.length) return true;
      if (gamBody.length > pageBody.length) return true;
      if (pageBody.length < gamBody.length * 0.99) return true;
      if (/^(worked_example|sample_output|text)$/.test(String(pageKey || ""))) {
        if (!bodiesEquivalent(pageBody, gamBody)) return true;
      }
      if (spec && spec.markers && spec.markers.length && !markersPresent(pageBody, spec.markers)) {
        return true;
      }
      return false;
    }
    var tier = (spec && spec.tier) || "D";
    var minRatio =
      spec && spec.minRatio != null
        ? spec.minRatio
        : TIER_DEFAULT_MIN_RATIO[tier] != null
          ? TIER_DEFAULT_MIN_RATIO[tier]
          : 0.99;
    if (gamBody.length > pageBody.length) return true;
    if (gamBody.length > pageBody.length * 1.1) return true;
    if (minRatio > 0 && pageBody.length < gamBody.length * minRatio) return true;
    if (isSynopsisOrShell(pageBody, gamBody, pageKey, spec)) return true;
    if (pedagogicRichnessLoss(pageBody, gamBody)) return true;
    if (markerEval.missing.length) return true;
    return false;
  }

  function classifyLossType(pageBody, gamBody, pageKey, spec) {
    var page = String(pageBody || "");
    var gam = String(gamBody || "");
    if (!gam || page === gam) return "none";
    if (!page) return "severe_compression";
    if (catalogueSynopsis(page, spec)) return "synopsis_replacement";
    if (tableShellCollapse(page, pageKey, gam)) return "table_shell_collapse";
    if (metaReplacement(page, pageKey)) return "meta_replacement";
    if (severeCompression(page, gam, pageKey)) return "severe_compression";
    var ratio = gam.length ? page.length / gam.length : 1;
    if (ratio >= 0.99) return "minor_whitespace";
    if (ratio >= 0.85) return "moderate_compression";
    return "severe_compression";
  }

  function mergeMaterialsFromGamList(pageMaterials, gamMaterialsList) {
    var merged = Object.assign(
      {},
      pageMaterials && typeof pageMaterials === "object" ? pageMaterials : {}
    );
    var seenKeys = {};
    if (!Array.isArray(gamMaterialsList)) return applyRendererCanonicalAliases(merged);
    gamMaterialsList.forEach(function (mat) {
      var gamBody = materialContent(mat);
      if (!String(gamBody || "").trim()) return;
      var pageKey = pageFieldKeyForMaterial(mat);
      if (seenKeys[pageKey]) {
        var slugKey = slugFromMaterialId(mat && mat.material_id);
        if (slugKey && slugKey !== pageKey && !seenKeys[slugKey]) {
          pageKey = slugKey;
        } else if (mat && mat.material_id && !seenKeys[String(mat.material_id)]) {
          pageKey = String(mat.material_id);
        } else {
          return;
        }
      }
      seenKeys[pageKey] = true;
      var spec = resolveFidelityContract(pageKey, mat);
      if (shouldMergeGamBody(merged[pageKey], gamBody, pageKey, spec, mat)) {
        merged[pageKey] = gamBody;
      }
    });
    return applyRendererCanonicalAliases(merged);
  }

  function mergeMaterialsObjects(pageMaterials, gamMaterials) {
    var merged = Object.assign(
      {},
      pageMaterials && typeof pageMaterials === "object" ? pageMaterials : {}
    );
    Object.keys(gamMaterials || {}).forEach(function (key) {
      if (/^(checklist|worked_example|scenario|transfer_prompt|template|decision_table|worksheet|scenarios|evaluation_checklist)$/.test(key)) {
        return;
      }
      var gamVal = gamMaterials[key];
      var spec = resolveFidelityContract(key, { material_id: key, type: key });
      if (shouldMergeGamBody(merged[key], gamVal, key, spec)) {
        merged[key] = gamVal;
      }
    });
    return applyRendererCanonicalAliases(merged);
  }

  function looksLikeActivityIdKeyedMap(obj) {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return false;
    var keys = Object.keys(obj);
    if (!keys.length) return false;
    return keys.every(function (key) {
      return /^(?:LO|A)\d+$/i.test(String(key || "").trim()) || /^act[_-]/i.test(String(key || ""));
    });
  }

  function gamActivitiesFromActivityIdKeyedMap(map) {
    return Object.keys(map || {}).map(function (aid) {
      var node = map[aid];
      if (Array.isArray(node)) {
        return { activity_id: aid, materials: node };
      }
      if (!node || typeof node !== "object") {
        return { activity_id: aid, materials: [] };
      }
      if (Array.isArray(node.materials)) {
        return {
          activity_id: aid,
          title: node.title,
          materials: node.materials
        };
      }
      if (Array.isArray(node.required_materials)) {
        return {
          activity_id: aid,
          title: node.title,
          materials: node.required_materials
        };
      }
      var mats = Object.keys(node)
        .filter(function (key) {
          return !/^(activity_id|activityId|title|grouping|duration_minutes)$/i.test(key);
        })
        .map(function (materialId) {
          var source = node[materialId];
          if (source && typeof source === "object" && !Array.isArray(source)) {
            return Object.assign({ material_id: materialId }, source);
          }
          return { material_id: materialId, type: materialId, content: source };
        });
      return { activity_id: aid, title: node.title, materials: mats };
    });
  }

  function normalizeGamActivityRow(act) {
    if (!act || typeof act !== "object") return act;
    if (Array.isArray(act.materials) && act.materials.length) return act;
    if (Array.isArray(act.required_materials) && act.required_materials.length) {
      return Object.assign({}, act, { materials: act.required_materials });
    }
    return act;
  }

  function extractGamActivitiesFromParsedRoot(parsed) {
    if (!parsed) return null;
    if (Array.isArray(parsed)) {
      if (
        parsed.length &&
        parsed[0] &&
        (parsed[0].materials || parsed[0].required_materials)
      ) {
        return parsed.map(normalizeGamActivityRow);
      }
      return null;
    }
    if (typeof parsed !== "object") return null;
    if (parsed.pack && Array.isArray(parsed.pack.activities)) {
      return parsed.pack.activities.map(normalizeGamActivityRow);
    }
    if (Array.isArray(parsed.activities)) {
      return parsed.activities.map(normalizeGamActivityRow);
    }
    if (
      parsed.content &&
      typeof parsed.content === "object" &&
      Array.isArray(parsed.content.activities)
    ) {
      return parsed.content.activities.map(normalizeGamActivityRow);
    }
    if (parsed.activity_materials && typeof parsed.activity_materials === "object") {
      var am = parsed.activity_materials;
      if (!Array.isArray(am)) {
        if (Array.isArray(am.activities)) {
          return am.activities.map(normalizeGamActivityRow);
        }
        if (
          am.content &&
          typeof am.content === "object" &&
          Array.isArray(am.content.activities)
        ) {
          return am.content.activities.map(normalizeGamActivityRow);
        }
        if (Array.isArray(am.content)) {
          return am.content.map(normalizeGamActivityRow);
        }
        if (looksLikeActivityIdKeyedMap(am)) {
          return gamActivitiesFromActivityIdKeyedMap(am);
        }
      }
    }
    if (Array.isArray(parsed.sections)) {
      var i;
      for (i = 0; i < parsed.sections.length; i += 1) {
        var section = parsed.sections[i];
        var sid = String(section.section_id || section.id || "").toLowerCase();
        var heading = String(section.heading || section.title || "").toLowerCase();
        if (
          sid.indexOf("activity_material") === -1 &&
          sid.indexOf("learning_activit") === -1 &&
          heading.indexOf("activity material") === -1 &&
          heading.indexOf("learning activit") === -1
        ) {
          continue;
        }
        var sectionContent = section.content;
        if (Array.isArray(sectionContent)) {
          return sectionContent.map(normalizeGamActivityRow);
        }
        if (
          sectionContent &&
          typeof sectionContent === "object" &&
          Array.isArray(sectionContent.activities)
        ) {
          return sectionContent.activities.map(normalizeGamActivityRow);
        }
      }
    }
    return null;
  }

  function collectMaterialTypePageKeys(mat) {
    var keys = [];
    var canonical = pageFieldKeyForMaterial(mat);
    var typeKey = normalizeMaterialTypeToken(mat && mat.type);
    if (canonical) keys.push(canonical);
    if (typeKey) keys.push(typeKey);
    if (mat && mat.material_id) keys.push(String(mat.material_id));
    if (
      typeKey === "comparison_table" ||
      typeKey === "analysis_table" ||
      typeKey === "classification_table" ||
      typeKey === "impact_table"
    ) {
      keys.push("comparison_table", "analysis_table", "classification_table", "impact_table");
    }
    return keys.filter(function (key, index, arr) {
      return key && arr.indexOf(key) === index;
    });
  }

  function shouldForceGamContentOntoPage(pageVal, gamBody, pageKey, mat) {
    if (pageVal == null || pageVal === "") return true;
    if (typeof pageVal !== "string") return true;
    if (typeof gamBody !== "string" || !String(gamBody).trim()) return false;
    if (stringLooksPlaceholderOnly(pageVal)) return true;
    if (looksLikeMaterialReferenceToken(pageVal)) return true;
    if (pageBodyLooksLikeDescriptionSynopsis(pageVal)) return true;
    if (tableShellCollapse(pageVal, pageKey, gamBody)) return true;
    if (pageBodyLooksLikeMaterialCatalogueSynopsis(pageVal, gamBody)) return true;
    if (gamBody.length > pageVal.length) return true;
    return pageVal !== gamBody;
  }

  function authoritativeOverlayGamMaterials(pageMaterials, gamMatList) {
    var result = Object.assign({}, pageMaterials && typeof pageMaterials === "object" ? pageMaterials : {});
    if (!Array.isArray(gamMatList)) return applyRendererCanonicalAliases(result);
    gamMatList.forEach(function (mat) {
      var gamBody = materialContent(mat);
      if (!String(gamBody || "").trim()) return;
      collectMaterialTypePageKeys(mat).forEach(function (key) {
        if (shouldForceGamContentOntoPage(result[key], gamBody, key, mat)) {
          result[key] = gamBody;
        }
      });
    });
    Object.assign(result, buildMaterialsObjectFromGamList(gamMatList));
    return applyRendererCanonicalAliases(result);
  }

  function normalizeGamActivitiesSource(source) {
    if (!source) return [];
    if (typeof source === "string") {
      var fromPack = tryParsePackTextUpstreamFromAnyRaw(source, null);
      if (fromPack && fromPack.length) return fromPack;
    }
    var extracted = extractGamActivitiesFromParsedRoot(source);
    if (extracted && extracted.length) return extracted;
    if (Array.isArray(source)) return source;
    if (Array.isArray(source.activities)) return source.activities.map(normalizeGamActivityRow);
    if (
      source.content &&
      typeof source.content === "object" &&
      Array.isArray(source.content.activities)
    ) {
      return source.content.activities.map(normalizeGamActivityRow);
    }
    if (Array.isArray(source.content)) return source.content.map(normalizeGamActivityRow);
    if (
      source.activity_materials &&
      typeof source.activity_materials === "object" &&
      !Array.isArray(source.activity_materials)
    ) {
      var am = source.activity_materials;
      if (Array.isArray(am.activities)) return am.activities.map(normalizeGamActivityRow);
      if (
        am.content &&
        typeof am.content === "object" &&
        Array.isArray(am.content.activities)
      ) {
        return am.content.activities.map(normalizeGamActivityRow);
      }
      if (Array.isArray(am.content)) return am.content.map(normalizeGamActivityRow);
      if (looksLikeActivityIdKeyedMap(am)) return gamActivitiesFromActivityIdKeyedMap(am);
    }
    return [];
  }

  function gamMaterialsForActivity(gamActivity) {
    if (!gamActivity || typeof gamActivity !== "object") return [];
    if (Array.isArray(gamActivity.materials)) return gamActivity.materials;
    if (Array.isArray(gamActivity.required_materials)) return gamActivity.required_materials;
    if (
      gamActivity.materials &&
      typeof gamActivity.materials === "object" &&
      !Array.isArray(gamActivity.materials)
    ) {
      return Object.keys(gamActivity.materials).map(function (materialId) {
        var source = gamActivity.materials[materialId];
        if (source && typeof source === "object" && !Array.isArray(source)) {
          return Object.assign({ material_id: materialId }, source);
        }
        return { material_id: materialId, content: source };
      });
    }
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

  function materialHasBody(val) {
    if (val == null || val === "") return false;
    if (Array.isArray(val)) {
      for (var i = 0; i < val.length; i += 1) {
        if (materialHasBody(val[i])) return true;
      }
      return false;
    }
    var text = String(val || "").trim();
    return text.length > 0 && !stringLooksPlaceholderOnly(text);
  }

  function inferActivityArchetype(row, gamAct) {
    var id = normalizeActivityKey(row && row.activity_id);
    var title = String((row && row.title) || "").toLowerCase();
    var mats = row && row.materials;
    if (id.indexOf("a4") !== -1 || title.indexOf("evaluat") !== -1) return "evaluate";
    if (mats && (mats.worked_judgement_weak_strong || mats.scenario_maya_strategy_menu)) {
      return "evaluate";
    }
    if (id.indexOf("a3") !== -1 || (title.indexOf("analys") !== -1 && title.indexOf("household") !== -1)) {
      return "analyse";
    }
    if (mats && mats.worked_analytic_pass) return "analyse";
    if (id.indexOf("a2") !== -1 || title.indexOf("apply") !== -1 || title.indexOf("cpi") !== -1) {
      return "apply";
    }
    if (id.indexOf("a1") !== -1 || title.indexOf("understand") !== -1) return "understand";
    if (gamAct && normalizeActivityKey(gamAct.activity_id).indexOf("a4") !== -1) return "evaluate";
    return "default";
  }

  function roleRegistryAvailable() {
    return !!(roleRegistry && typeof roleRegistry.resolveRoleFromGam === "function");
  }

  function aliasKeysForRoleFamily(roleFamily) {
    if (!roleRegistryAvailable()) return [];
    if (roleRegistry.ROLE_RENDER_ALIAS_GROUPS && roleRegistry.ROLE_RENDER_ALIAS_GROUPS[roleFamily]) {
      return roleRegistry.ROLE_RENDER_ALIAS_GROUPS[roleFamily].slice();
    }
    return roleRegistry.getAllowedAliases(roleFamily);
  }

  var ROLE_FAMILY_CANONICAL_PRECEDENCE = {
    explanatory_guidance: [
      "criteria_exposition_evaluate",
      "concept_exposition",
      "concept_text",
      "criteria_text",
      "text"
    ]
  };

  function canonicalPrecedenceRank(roleFamily, key) {
    var order = ROLE_FAMILY_CANONICAL_PRECEDENCE[roleFamily];
    if (!order) return 50;
    var idx = order.indexOf(key);
    return idx === -1 ? 100 : idx;
  }

  function demoteGamCanonicalEntries(index, roleFamily, supersededBy, exceptPageKey) {
    Object.keys(index).forEach(function (key) {
      if (key === exceptPageKey) return;
      var entry = index[key];
      if (!entry || entry.role_family !== roleFamily) return;
      if (entry.authority !== ROLE_AUTHORITY.CANONICAL || entry.source !== "gam") return;
      index[key] = {
        role_family: roleFamily,
        canonical_key: supersededBy,
        authority: ROLE_AUTHORITY.ALIAS,
        source: "gam",
        canonical: false,
        renderable: true,
        superseded_by: supersededBy,
        material_id: entry.material_id || null
      };
    });
  }

  function buildMaterialRoleIndex(preMergeMaterials, mergedMaterials, gamMatList) {
    var index = {};
    var canonicalByFamily = {};
    var pre = preMergeMaterials && typeof preMergeMaterials === "object" ? preMergeMaterials : {};
    var merged = mergedMaterials && typeof mergedMaterials === "object" ? mergedMaterials : {};
    var gamList = Array.isArray(gamMatList) ? gamMatList : [];

    if (!roleRegistryAvailable()) {
      return index;
    }

    Object.keys(pre).forEach(function (key) {
      if (!materialHasBody(pre[key])) return;
      var roleFamily = roleRegistry.getRoleFamilyForPageKey(key);
      if (!roleFamily) {
        index[key] = {
          role_family: null,
          canonical_key: key,
          authority: ROLE_AUTHORITY.UNRESOLVED,
          source: "compose",
          canonical: false,
          renderable: true,
          superseded_by: null
        };
        return;
      }
      index[key] = {
        role_family: roleFamily,
        canonical_key: roleRegistry.resolveCanonicalRole(roleFamily) || key,
        authority: ROLE_AUTHORITY.COMPOSE,
        source: "compose",
        canonical: false,
        renderable: true,
        superseded_by: null
      };
    });

    gamList.forEach(function (mat) {
      if (!mat || typeof mat !== "object") return;
      var meta = roleRegistry.resolveRoleFromGam(mat);
      if (!meta) return;
      var pageKey = pageFieldKeyForMaterial(mat);
      var familyCanonical = meta.canonical_key || pageKey;
      var roleFamily = meta.role_family;
      var existingCanonical = canonicalByFamily[roleFamily];
      if (existingCanonical) {
        var existingRank = canonicalPrecedenceRank(roleFamily, existingCanonical);
        var newRank = canonicalPrecedenceRank(roleFamily, familyCanonical);
        if (newRank > existingRank) {
          index[pageKey] = {
            role_family: roleFamily,
            canonical_key: existingCanonical,
            authority: ROLE_AUTHORITY.ALIAS,
            source: "gam",
            canonical: false,
            renderable: true,
            superseded_by: existingCanonical,
            material_id: mat.material_id || null
          };
          return;
        }
        if (newRank < existingRank) {
          demoteGamCanonicalEntries(index, roleFamily, familyCanonical, pageKey);
        }
      }
      canonicalByFamily[roleFamily] = familyCanonical;
      index[pageKey] = {
        role_family: roleFamily,
        canonical_key: familyCanonical,
        authority: ROLE_AUTHORITY.CANONICAL,
        source: "gam",
        canonical: true,
        renderable: true,
        superseded_by: null,
        material_id: mat.material_id || null
      };
    });

    Object.keys(canonicalByFamily).forEach(function (roleFamily) {
      var canonicalKey = canonicalByFamily[roleFamily];
      var aliases = aliasKeysForRoleFamily(roleFamily);
      aliases.forEach(function (aliasKey) {
        if (aliasKey === canonicalKey) return;
        if (!materialHasBody(merged[aliasKey])) return;
        var wasPreMerge = materialHasBody(pre[aliasKey]);
        var existing = index[aliasKey] || {};
        index[aliasKey] = {
          role_family: roleFamily,
          canonical_key: canonicalKey,
          authority: wasPreMerge ? ROLE_AUTHORITY.SUPERSEDED : ROLE_AUTHORITY.ALIAS,
          source: wasPreMerge ? "compose" : existing.source || "merge_alias",
          canonical: false,
          renderable: false,
          superseded_by: canonicalKey,
          material_id: existing.material_id || null
        };
      });
    });

    Object.keys(merged).forEach(function (key) {
      if (!materialHasBody(merged[key])) return;
      if (index[key]) return;
      var roleFamily = roleRegistry.getRoleFamilyForPageKey(key);
      if (!roleFamily) {
        index[key] = {
          role_family: null,
          canonical_key: key,
          authority: ROLE_AUTHORITY.UNRESOLVED,
          source: "compose",
          canonical: false,
          renderable: true,
          superseded_by: null
        };
        return;
      }
      var canonicalKey = canonicalByFamily[roleFamily] || roleRegistry.resolveCanonicalRole(roleFamily) || key;
      if (canonicalByFamily[roleFamily] && key !== canonicalByFamily[roleFamily]) {
        index[key] = {
          role_family: roleFamily,
          canonical_key: canonicalKey,
          authority: ROLE_AUTHORITY.ALIAS,
          source: "merge_alias",
          canonical: false,
          renderable: false,
          superseded_by: canonicalKey
        };
        return;
      }
      index[key] = {
        role_family: roleFamily,
        canonical_key: canonicalKey,
        authority: ROLE_AUTHORITY.COMPOSE,
        source: "compose",
        canonical: key === canonicalKey,
        renderable: true,
        superseded_by: null
      };
    });

    return index;
  }

  function applyRoleSupersessionToActivityRow(row, gamMatList, preMergeMaterials, gamAct) {
    if (!row || typeof row !== "object") return row;
    if (!roleRegistryAvailable()) return row;
    row.material_role_index = buildMaterialRoleIndex(
      preMergeMaterials,
      row.materials,
      gamMatList
    );
    row.activity_archetype = inferActivityArchetype(row, gamAct);
    return row;
  }

  function measureRoleSupersession(page, options) {
    var opts = options && typeof options === "object" ? options : {};
    var rows = findLearningActivitiesRows(page);
    var report = {
      ok: true,
      activities: [],
      totals: {
        canonical: 0,
        superseded: 0,
        alias: 0,
        compose: 0,
        unresolved: 0
      }
    };

    rows.forEach(function (row, index) {
      var indexMap = (row && row.material_role_index) || {};
      var activityReport = {
        activity_id: row && row.activity_id,
        index: index,
        canonical: [],
        superseded: [],
        alias: [],
        compose: [],
        unresolved: []
      };

      Object.keys(indexMap).forEach(function (key) {
        var entry = indexMap[key];
        var item = {
          key: key,
          role_family: entry.role_family,
          canonical_key: entry.canonical_key,
          authority: entry.authority,
          renderable: entry.renderable,
          superseded_by: entry.superseded_by || null
        };
        if (entry.authority === ROLE_AUTHORITY.CANONICAL) {
          activityReport.canonical.push(item);
          report.totals.canonical += 1;
        } else if (entry.authority === ROLE_AUTHORITY.SUPERSEDED) {
          activityReport.superseded.push(item);
          report.totals.superseded += 1;
        } else if (entry.authority === ROLE_AUTHORITY.ALIAS) {
          activityReport.alias.push(item);
          report.totals.alias += 1;
        } else if (entry.authority === ROLE_AUTHORITY.COMPOSE) {
          activityReport.compose.push(item);
          report.totals.compose += 1;
        } else {
          activityReport.unresolved.push(item);
          report.totals.unresolved += 1;
        }
      });

      report.activities.push(activityReport);
    });

    if (opts.requireIndex === true) {
      report.ok = report.activities.every(function (act) {
        return act.canonical.length > 0 || act.compose.length > 0 || act.unresolved.length >= 0;
      });
    }

    return report;
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
      var gamMatList = gamMaterialsForActivity(gamAct);
      if (!gamMatList.length) return;
      var preMergeMaterials = row.materials
        ? JSON.parse(JSON.stringify(row.materials))
        : {};
      var existingMaterials =
        row.materials && typeof row.materials === "object" ? row.materials : {};
      row.materials = authoritativeOverlayGamMaterials(existingMaterials, gamMatList);
      purgeMaterialReferenceTokensFromMaterials(row.materials);
      applyRoleSupersessionToActivityRow(row, gamMatList, preMergeMaterials, gamAct);
      mergedCount += 1;
    });
    if (!next.metadata || typeof next.metadata !== "object") next.metadata = {};
    next.metadata.gam_materials_preserve_applied = true;
    next.metadata.gam_materials_preserve_schema = "38M-2";
    next.metadata.gam_materials_preserve_rows = mergedCount;
    if (roleRegistryAvailable()) {
      next.metadata.role_supersession_applied = true;
      next.metadata.role_supersession_schema = "38P-3";
      next.metadata.role_registry_version = roleRegistry.ROLE_REGISTRY_VERSION;
    }
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
    var text = pageMaterialText(materials, "worked_judgement_weak_strong");
    return (
      text.length > 400 &&
      semanticMarkerSatisfied("weak_worked_judgement", text) &&
      semanticMarkerSatisfied("strong_worked_judgement", text)
    );
  }

  function materialsHasSubstantiveA4Scenario(materials) {
    if (!materials || typeof materials !== "object") return false;
    var text = pageMaterialText(materials, "scenario_maya_strategy_menu");
    return (
      text.length > 400 &&
      semanticMarkerSatisfied("strategy_a", text) &&
      semanticMarkerSatisfied("strategy_e", text)
    );
  }

  function materialsHasTransferPrompt(materials) {
    if (!materials || typeof materials !== "object") return false;
    return Object.keys(materials).some(function (key) {
      return /transfer_prompt/i.test(key) && !stringLooksPlaceholderOnly(materials[key]);
    });
  }

  function stripRunnerFooterFromPackCapture(text) {
    var s = String(text || "");
    var re = /\r?\nSTEP\s*\d+\s*OUTPUT:[\s\S]*$/i;
    var prev;
    do {
      prev = s;
      s = s.replace(re, "");
    } while (s !== prev);
    return s.trim();
  }

  function unwrapMarkdownFenceCapture(text) {
    var s = String(text || "").trim();
    if (!s.startsWith("```")) return s;
    var firstNl = s.indexOf("\n");
    if (firstNl === -1) return s;
    var body = s.slice(firstNl + 1);
    var close = body.lastIndexOf("```");
    if (close !== -1) body = body.slice(0, close);
    return body.trim();
  }

  function normalizePackTextCaptureInput(text) {
    return stripRunnerFooterFromPackCapture(unwrapMarkdownFenceCapture(text));
  }

  function isPackTextActivityMaterialsCapture(text) {
    var head = normalizePackTextCaptureInput(text);
    if (!head) return false;
    return (
      /Activity ID:\s*\S+/i.test(head) &&
      /Material:\s*\S+\s*\([^)]+\)/i.test(head) &&
      /Content:/i.test(head)
    );
  }

  function extractPackTextFromArtefactObject(parsed) {
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return "";
    var keys = [
      "content",
      "text",
      "body",
      "pack_text",
      "materials_text",
      "activity_materials_text",
      "activity_materials"
    ];
    var i;
    for (i = 0; i < keys.length; i += 1) {
      var val = parsed[keys[i]];
      if (typeof val === "string" && isPackTextActivityMaterialsCapture(val)) {
        return normalizePackTextCaptureInput(val);
      }
    }
    return "";
  }

  function parsePackTextUpstreamActivities(text, learningActivitiesUpstream) {
    var normalized = normalizePackTextCaptureInput(text);
    if (!isPackTextActivityMaterialsCapture(normalized)) return null;
    var flat = parseGamMaterialsFromText(normalized);
    if (!flat.length) return null;
    return buildUpstreamGamActivitiesFromMaterials(flat, learningActivitiesUpstream);
  }

  function tryParsePackTextUpstreamFromAnyRaw(raw, learningActivitiesUpstream) {
    if (raw == null || raw === "") return null;
    if (typeof raw === "string") {
      var fromString = parsePackTextUpstreamActivities(raw, learningActivitiesUpstream);
      if (fromString && fromString.length) return fromString;
      var trimmed = String(raw).trim();
      try {
        var parsedJson = JSON.parse(trimmed);
        if (parsedJson && typeof parsedJson === "object") {
          var embedded = extractPackTextFromArtefactObject(parsedJson);
          if (embedded) {
            var fromEmbedded = parsePackTextUpstreamActivities(embedded, learningActivitiesUpstream);
            if (fromEmbedded && fromEmbedded.length) return fromEmbedded;
          }
        }
      } catch (_) {}
      return null;
    }
    if (typeof raw === "object" && !Array.isArray(raw)) {
      var embeddedObj = extractPackTextFromArtefactObject(raw);
      if (embeddedObj) {
        var fromObj = parsePackTextUpstreamActivities(embeddedObj, learningActivitiesUpstream);
        if (fromObj && fromObj.length) return fromObj;
      }
    }
    return null;
  }

  function parseUpstreamActivityMaterialsCapture(raw, learningActivitiesUpstream) {
    if (raw == null || raw === "") return null;
    var originalRaw = typeof raw === "string" ? String(raw) : "";
    var packUpstream = tryParsePackTextUpstreamFromAnyRaw(raw, learningActivitiesUpstream);
    if (packUpstream && packUpstream.length) return packUpstream;
    var parsed = raw;
    if (typeof raw === "string") {
      var trimmed = originalRaw.trim();
      if (!trimmed) return null;
      parsed = null;
      try {
        parsed = JSON.parse(trimmed);
      } catch (_) {
        parsed = null;
      }
      if (!parsed) {
        return tryParsePackTextUpstreamFromAnyRaw(trimmed, learningActivitiesUpstream);
      }
    } else {
      parsed = raw;
    }
    if (Array.isArray(parsed)) {
      if (
        parsed.length &&
        parsed[0] &&
        (parsed[0].materials || parsed[0].required_materials)
      ) {
        return parsed.map(normalizeGamActivityRow);
      }
      return buildUpstreamGamActivitiesFromMaterials(parsed, learningActivitiesUpstream);
    }
    if (parsed && typeof parsed === "object") {
      packUpstream = tryParsePackTextUpstreamFromAnyRaw(parsed, learningActivitiesUpstream);
      if (packUpstream && packUpstream.length) return packUpstream;
      var extractedActivities = extractGamActivitiesFromParsedRoot(parsed);
      if (extractedActivities && extractedActivities.length) {
        return extractedActivities;
      }
      if (Array.isArray(parsed.activities)) {
        return parsed.activities.map(normalizeGamActivityRow);
      }
      if (
        parsed.content &&
        typeof parsed.content === "object" &&
        Array.isArray(parsed.content.activities)
      ) {
        return parsed.content.activities.map(normalizeGamActivityRow);
      }
      if (Array.isArray(parsed.content)) {
        return buildUpstreamGamActivitiesFromMaterials(parsed.content, learningActivitiesUpstream);
      }
      if (
        parsed.activity_materials &&
        typeof parsed.activity_materials === "object" &&
        !Array.isArray(parsed.activity_materials)
      ) {
        var am = parsed.activity_materials;
        if (Array.isArray(am.activities)) {
          return am.activities;
        }
        if (
          am.content &&
          typeof am.content === "object" &&
          Array.isArray(am.content.activities)
        ) {
          return am.content.activities;
        }
        if (Array.isArray(am.content)) {
          return am.content;
        }
        if (Array.isArray(am.materials)) {
          return buildUpstreamGamActivitiesFromMaterials(am.materials, learningActivitiesUpstream);
        }
      }
      if (Array.isArray(parsed.activity_materials)) {
        return buildUpstreamGamActivitiesFromMaterials(
          parsed.activity_materials,
          learningActivitiesUpstream
        );
      }
      if (Array.isArray(parsed.materials)) {
        return buildUpstreamGamActivitiesFromMaterials(parsed.materials, learningActivitiesUpstream);
      }
    }
    if (originalRaw) {
      packUpstream = tryParsePackTextUpstreamFromAnyRaw(originalRaw, learningActivitiesUpstream);
      if (packUpstream && packUpstream.length) return packUpstream;
    }
    return null;
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

  function pageBodyLooksLikeDescriptionSynopsis(pageBody) {
    if (fidelity.looksLikeMaterialDescriptionSynopsis) {
      return fidelity.looksLikeMaterialDescriptionSynopsis(pageBody);
    }
    return false;
  }

  function pageBodyLooksLikeMaterialCatalogueSynopsis(pageBody, gamBody) {
    if (fidelity.looksLikeMaterialCatalogueSynopsis) {
      return fidelity.looksLikeMaterialCatalogueSynopsis(pageBody, gamBody);
    }
    return false;
  }

  function pageBodyLooksLikeSynopsisSubstitution(pageBody, gamBody, pageKey, spec) {
    return (
      isSynopsisOrShell(pageBody, gamBody, pageKey, spec) ||
      pageBodyLooksLikeDescriptionSynopsis(pageBody) ||
      pageBodyLooksLikeMaterialCatalogueSynopsis(pageBody, gamBody)
    );
  }

  var MATERIAL_LIMITATION_EXCUSE_RES = [
    /\btruncat(?:e|ed|ion)\b.+\bmaterial/i,
    /\bmaterial(?:s)?\s+(?:were\s+)?(?:truncat|shorten|compress|omit)/i,
    /\bshorten(?:ed)?\s+activity\.materials/i,
    /\bomitted?\s+(?:the\s+)?(?:scaffold|worked example|checklist|prompt set|transfer prompt)/i,
    /\bpartial\s+material\s+preservation/i,
    /\boutput[- ]limit\b.+\bmaterial/i,
    /\bwhere possible\b.+\bpreserv/i,
    /\bcould not preserve\b.+\bmaterial/i,
    /\bmaterial[- ]body\b.+\b(limit|reduc|compress|truncat)/i,
    /\bfeasibility\b.+\bmaterial/i,
    /\breduced?\s+(?:the\s+)?material(?:s)?\s+(?:bodies|content)/i
  ];

  var PRESERVATION_CLAIM_RES = [
    /materials?_preserved_verbatim/i,
    /\bpreserved\s+verbatim\b/i,
    /\bfull\s+preservation\b/i,
    /\ball\s+materials?\s+retained\b/i,
    /\bmaterials?\s+preserved\b/i,
    /\bmaterials?_copy_verbatim\b/i
  ];

  function collectPageLimitationTexts(page) {
    var texts = [];
    if (!page || typeof page !== "object") return texts;
    var gn = page.generation_notes;
    if (gn && Array.isArray(gn.limitations)) {
      gn.limitations.forEach(function (line) {
        texts.push(String(line));
      });
    } else if (gn && gn.limitations != null) {
      texts.push(String(gn.limitations));
    }
    return texts;
  }

  function detectMaterialLimitationExcuses(page) {
    var hits = [];
    collectPageLimitationTexts(page).forEach(function (line) {
      if (/\[PRISM page materials closure\]/i.test(line)) return;
      MATERIAL_LIMITATION_EXCUSE_RES.forEach(function (re) {
        if (re.test(line) && hits.indexOf(line) === -1) hits.push(line);
      });
    });
    return hits;
  }

  function collectPreservationClaimStrings(page) {
    var claims = [];
    if (!page || typeof page !== "object") return claims;
    function scanValue(value) {
      var text = String(value == null ? "" : value);
      if (text && PRESERVATION_CLAIM_RES.some(function (re) {
        return re.test(text);
      })) {
        claims.push(text);
      }
    }
    var ca = page.constraints_applied;
    if (ca && typeof ca === "object") {
      if (Array.isArray(ca)) {
        ca.forEach(scanValue);
      } else {
        Object.keys(ca).forEach(function (key) {
          scanValue(key);
          scanValue(ca[key]);
        });
      }
    }
    var gn = page.generation_notes;
    if (gn && gn.constraints_applied && typeof gn.constraints_applied === "object") {
      Object.keys(gn.constraints_applied).forEach(function (key) {
        scanValue(key);
        scanValue(gn.constraints_applied[key]);
      });
    }
    return claims;
  }

  function escapeRegExp(text) {
    return String(text || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function resolveClosureMarkerContract(pageKey, mat) {
    var type = String((mat && mat.type) || "").toLowerCase();
    if (type === "checklist") {
      return { markers: ["common_mistakes", "revise_if_not_met"] };
    }
    if (type === "worked_example") {
      return { markers: ["what_experts_notice"] };
    }
    if (type === "sample_output") {
      return { markers: ["why_this_works"] };
    }
    if (type === "prompt_set" || type === "transfer_prompt") {
      return { markers: [] };
    }
    return { markers: [] };
  }

  function deriveClosureScaffoldMarkers(gamBody, pageKey, mat) {
    var markers = [];
    var seen = {};
    var text = String(gamBody || "");
    var markerContract = resolveClosureMarkerContract(pageKey, mat);
    (markerContract.markers || []).forEach(function (markerId) {
      if (seen[markerId]) return;
      if (!semanticMarkerSatisfied(markerId, text)) return;
      seen[markerId] = true;
      markers.push({ id: markerId, kind: "contract" });
    });
    if (text.length < 80) return markers;
    var headerRe = /^#{1,3}\s+(.+)$/gm;
    var match;
    while ((match = headerRe.exec(text)) !== null) {
      var heading = String(match[1] || "").trim();
      if (heading.length < 4 || seen[heading]) continue;
      seen[heading] = true;
      markers.push({ id: heading, kind: "heading", re: new RegExp(escapeRegExp(heading), "i") });
    }
    if (/\*\*Step\s+\d+/i.test(text) && !seen.step_sequence) {
      seen.step_sequence = true;
      markers.push({ id: "step_sequence", kind: "pattern", re: /\*\*Step\s+\d+/i });
    }
    if (/^-\s+\S/m.test(text) && (markerContract.markers || []).indexOf("common_mistakes") === -1) {
      var bulletCount = (text.match(/^-\s+/gm) || []).length;
      if (bulletCount >= 2 && !seen.bullet_scaffold) {
        seen.bullet_scaffold = true;
        markers.push({ id: "bullet_scaffold", kind: "pattern", re: /^-\s+\S/m });
      }
    }
    return markers;
  }

  function closureScaffoldMarkerPresent(marker, pageBody) {
    var body = String(pageBody || "");
    if (!body) return false;
    if (marker.kind === "contract") return semanticMarkerSatisfied(marker.id, body);
    if (marker.re) return marker.re.test(body);
    return body.indexOf(marker.id) !== -1;
  }

  function evaluateClosureScaffoldMarkers(pageBody, gamBody, pageKey, mat) {
    var markers = deriveClosureScaffoldMarkers(gamBody, pageKey, mat);
    var missing = [];
    markers.forEach(function (marker) {
      if (!closureScaffoldMarkerPresent(marker, pageBody)) missing.push(marker);
    });
    return { markers: markers, missing: missing };
  }

  function substantiveMaterialKeyCount(materials) {
    if (!materials || typeof materials !== "object") return 0;
    var count = 0;
    Object.keys(materials).forEach(function (key) {
      if (materialHasBody(materials[key])) count += 1;
    });
    return count;
  }

  var MATERIAL_CLOSURE_MIN_RATIO = 0.99;
  var MATERIAL_CLOSURE_MIN_BODY_LEN = 48;

  function gamMaterialIsSubstantive(mat) {
    var body = String(materialContent(mat) || "").trim();
    if (!body) return false;
    if (body.length < MATERIAL_CLOSURE_MIN_BODY_LEN) {
      return !stringLooksPlaceholderOnly(body);
    }
    return true;
  }

  function pageRowMatchesGamActivity(pageRow, gamAct) {
    if (!pageRow || !gamAct) return false;
    var pageActId = normalizeActivityKey(pageRow.activity_id || pageRow.activityId);
    var gamActId = normalizeActivityKey(gamAct.activity_id || gamAct.activityId);
    if (pageActId && gamActId) {
      return pageActId === gamActId;
    }
    var pageTitle = normalizeActivityKey(pageRow.title);
    var gamTitle = normalizeActivityKey(gamAct.title);
    if (pageTitle && gamTitle) {
      return pageTitle === gamTitle;
    }
    return false;
  }

  function findPageRowForGamActivity(pageRows, gamAct) {
    if (!Array.isArray(pageRows) || !gamAct) return null;
    for (var i = 0; i < pageRows.length; i += 1) {
      if (pageRowMatchesGamActivity(pageRows[i], gamAct)) return pageRows[i];
    }
    return null;
  }

  function resolveGamActivitiesFromUpstream(upstreamActivityMaterials, upstreamLearningActivities) {
    if (upstreamActivityMaterials == null || upstreamActivityMaterials === "") return [];
    var parsed = parseUpstreamActivityMaterialsCapture(
      upstreamActivityMaterials,
      upstreamLearningActivities
    );
    return normalizeGamActivitiesSource(parsed);
  }

  function pushMaterialClosureIssue(issues, messages, issue) {
    issues.push(issue);
    if (issue.message) messages.push(issue.message);
  }

  function validatePageMaterialsClosure(page, upstreamActivityMaterials, options) {
    var opts = options && typeof options === "object" ? options : {};
    var minRatio =
      opts.minRatio != null && !isNaN(Number(opts.minRatio))
        ? Number(opts.minRatio)
        : MATERIAL_CLOSURE_MIN_RATIO;
    var gamActivities = resolveGamActivitiesFromUpstream(
      upstreamActivityMaterials,
      opts.upstreamLearningActivities
    );
    if (!gamActivities.length) {
      return {
        validation: "page_materials_closure",
        outcome: "skip",
        issues: [],
        messages: ["No upstream GAM available for material closure check."],
        materials_expected: 0,
        materials_checked: 0
      };
    }

    var pageRows = findLearningActivitiesRows(page);
    var issues = [];
    var messages = [];
    var materialsExpected = 0;
    var materialsChecked = 0;

    gamActivities.forEach(function (gamAct, index) {
      var substantiveMats = gamMaterialsForActivity(gamAct).filter(gamMaterialIsSubstantive);
      if (!substantiveMats.length) return;

      var activityId = String(
        gamAct.activity_id || gamAct.activityId || gamAct.title || "A" + (index + 1)
      );
      var pageRow = findPageRowForGamActivity(pageRows, gamAct);

      if (!pageRow) {
        substantiveMats.forEach(function (mat) {
          materialsExpected += 1;
          var materialId = String(mat.material_id || pageFieldKeyForMaterial(mat) || "?");
          pushMaterialClosureIssue(issues, messages, {
            code: "activity_row_missing",
            severity: "error",
            activity_id: activityId,
            material_id: materialId,
            page_key: pageFieldKeyForMaterial(mat),
            gam_len: materialContent(mat).length,
            page_len: 0,
            ratio: null,
            message:
              "Activity " +
              activityId +
              " material " +
              materialId +
              " has upstream GAM body but no matching page learning_activities row."
          });
        });
        return;
      }

      var pageMats = (pageRow && pageRow.materials) || {};
      substantiveMats.forEach(function (mat) {
        materialsExpected += 1;
        materialsChecked += 1;
        var pageKey = pageFieldKeyForMaterial(mat);
        var materialId = String(mat.material_id || pageKey || "?");
        var gamBody = materialContent(mat);
        var pageBody = pageMaterialText(pageMats, pageKey);
        var gamLen = gamBody.length;
        var pageLen = String(pageBody || "").length;
        var spec = resolveFidelityContract(pageKey, mat);
        var ratio = gamLen ? Math.round((pageLen / gamLen) * 100) / 100 : 1;
        var baseIssue = {
          severity: "error",
          activity_id: activityId,
          material_id: materialId,
          page_key: pageKey,
          gam_len: gamLen,
          page_len: pageLen,
          ratio: ratio
        };

        if (!String(pageBody || "").trim()) {
          pushMaterialClosureIssue(issues, messages, Object.assign({}, baseIssue, {
            code: "material_missing",
            message:
              activityId +
              " / " +
              materialId +
              ": missing page material body for key " +
              pageKey +
              "."
          }));
          return;
        }

        if (stringLooksPlaceholderOnly(pageBody)) {
          pushMaterialClosureIssue(issues, messages, Object.assign({}, baseIssue, {
            code: "placeholder_substitution",
            message:
              activityId +
              " / " +
              materialId +
              ": page material is placeholder-only (" +
              pageKey +
              ")."
          }));
          return;
        }

        if (pageBodyLooksLikeSynopsisSubstitution(pageBody, gamBody, pageKey, spec)) {
          pushMaterialClosureIssue(issues, messages, Object.assign({}, baseIssue, {
            code: "synopsis_substitution",
            message:
              activityId +
              " / " +
              materialId +
              ": page material looks like synopsis or shell (" +
              pageKey +
              ")."
          }));
          return;
        }

        var markerEval = evaluateClosureScaffoldMarkers(pageBody, gamBody, pageKey, mat);
        if (markerEval.missing.length) {
          pushMaterialClosureIssue(issues, messages, Object.assign({}, baseIssue, {
            code: "marker_missing",
            message:
              activityId +
              " / " +
              materialId +
              ": missing scaffold marker(s) " +
              markerEval.missing
                .map(function (marker) {
                  return marker.id;
                })
                .join(", ") +
              " (" +
              pageKey +
              ")."
          }));
          return;
        }

        if (gamLen > 0 && pageLen < gamLen * minRatio) {
          pushMaterialClosureIssue(issues, messages, Object.assign({}, baseIssue, {
            code: "body_ratio_below_threshold",
            message:
              activityId +
              " / " +
              materialId +
              ": material body length " +
              pageLen +
              " is below " +
              Math.round(minRatio * 100) +
              "% of upstream GAM (" +
              gamLen +
              " chars, key " +
              pageKey +
              ")."
          }));
        }
      });
    });

    detectMaterialLimitationExcuses(page).forEach(function (line) {
      pushMaterialClosureIssue(issues, messages, {
        code: "limitations_excuse_conflict",
        severity: "error",
        activity_id: null,
        material_id: null,
        page_key: null,
        gam_len: null,
        page_len: null,
        ratio: null,
        message:
          "generation_notes.limitations admits material-body loss and cannot satisfy material closure: " +
          String(line).slice(0, 240)
      });
    });

    var hasMaterialFailure = issues.some(function (issue) {
      return issue.code !== "limitations_excuse_conflict" && issue.code !== "constraints_claim_conflict";
    });
    if (hasMaterialFailure) {
      collectPreservationClaimStrings(page).forEach(function (claim) {
        pushMaterialClosureIssue(issues, messages, {
          code: "constraints_claim_conflict",
          severity: "error",
          activity_id: null,
          material_id: null,
          page_key: null,
          gam_len: null,
          page_len: null,
          ratio: null,
          message:
            "Page claims material preservation (" +
            String(claim).slice(0, 120) +
            ") but material closure failed."
        });
      });
    }

    var outcome = issues.length ? "fail" : "pass";
    return {
      validation: "page_materials_closure",
      outcome: outcome,
      issues: issues,
      messages: messages,
      materials_expected: materialsExpected,
      materials_checked: materialsChecked,
      limitations_excuse_conflict: issues.some(function (issue) {
        return issue.code === "limitations_excuse_conflict";
      }),
      constraints_claim_conflict: issues.some(function (issue) {
        return issue.code === "constraints_claim_conflict";
      })
    };
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

  function findA4GamActivity(gamSource) {
    var acts = normalizeGamActivitiesSource(gamSource);
    var a4 = acts[3] || null;
    if (!a4) {
      acts.forEach(function (act) {
        if (a4) return;
        var id = String(act.activity_id || act.title || "").toLowerCase();
        if (/a4/.test(id) || /evaluate.*household/.test(id)) a4 = act;
      });
    }
    return a4;
  }

  function measurePageGamFidelity(page, options) {
    var opts = options && typeof options === "object" ? options : {};
    var gamActivities = normalizeGamActivitiesSource(opts.gamSource);
    var rows = findLearningActivitiesRows(page);
    var metrics = [];

    rows.forEach(function (row, index) {
      var gamAct = matchGamActivity(gamActivities, row, index);
      if (!gamAct) return;
      var pageMats = (row && row.materials) || {};
      gamMaterialsForActivity(gamAct).forEach(function (mat) {
        var pageKey = pageFieldKeyForMaterial(mat);
        var gamBody = materialContent(mat);
        var pageBody = pageMaterialText(pageMats, pageKey);
        var gamLen = gamBody.length;
        var pageLen = pageBody.length;
        var spec = resolveFidelityContract(pageKey, mat);
        var ratio = gamLen ? Math.round((pageLen / gamLen) * 100) : 100;
        var markerEval = evaluateMaterialMarkers(pageBody, spec.markers || []);
        var markersFound = markerEval.found;
        var markersMissing = markerEval.missing;
        var lossType = classifyLossType(pageBody, gamBody, pageKey, spec);
        var substantive =
          gamLen > 0 &&
          pageLen >= gamLen * (spec.minRatio || TIER_DEFAULT_MIN_RATIO[spec.tier] || 0.99) &&
          markersMissing.length === 0 &&
          !isSynopsisOrShell(pageBody, gamBody, pageKey, spec);
        metrics.push({
          activity_id: gamAct.activity_id || row.activity_id || "A" + (index + 1),
          material_id: spec.material_id || mat.material_id,
          page_key: pageKey,
          tier: spec.tier,
          gamLen: gamLen,
          pageLen: pageLen,
          ratio: ratio,
          markersFound: markersFound,
          markersMissing: markersMissing,
          lossType: lossType,
          mergeApplied: page.metadata && page.metadata.gam_materials_preserve_applied === true,
          substantive: substantive
        });
      });
    });
    return metrics;
  }

  function validate38MPageFidelity(page, options) {
    var opts = options && typeof options === "object" ? options : {};
    var errors = [];
    var warnings = [];
    var metrics = measurePageGamFidelity(page, opts);
    var rows = findLearningActivitiesRows(page);

    function metricFor(materialId) {
      for (var i = 0; i < metrics.length; i += 1) {
        if (metrics[i].material_id === materialId) return metrics[i];
      }
      return null;
    }

    function gateError(activity, materialId, gateId, detail) {
      errors.push(activity + ":" + materialId + ":" + gateId + ":" + detail);
    }

    var m14 = metricFor("M14_Worked_Judgement_Weak_Strong");
    if (m14) {
      if (m14.ratio < 90) {
        gateError("A4", m14.material_id, "G1", "ratio " + m14.ratio + "% < 90%");
      }
      if (m14.markersMissing.indexOf("weak_worked_judgement") !== -1) {
        gateError("A4", m14.material_id, "G4", "missing weak worked judgement exemplar");
      }
      if (m14.markersMissing.indexOf("strong_worked_judgement") !== -1) {
        gateError("A4", m14.material_id, "G4", "missing strong worked judgement exemplar");
      }
    }

    var m15 = metricFor("M15_Guided_Judgement_Table");
    if (m15) {
      if (m15.ratio < 90) {
        gateError("A4", m15.material_id, "G2", "ratio " + m15.ratio + "% < 90%");
      }
      var guidedBody = "";
      if (rows[3] && rows[3].materials) {
        guidedBody = pageMaterialText(rows[3].materials, "guided_judgement_table");
      }
      if (tableShellCollapse(guidedBody, "guided_judgement_table", "")) {
        gateError("A4", m15.material_id, "G5", "table shell collapse detected");
      }
      if (m15.markersMissing.indexOf("guided_table_exemplar") !== -1) {
        gateError("A4", m15.material_id, "G5", "missing guided table exemplar");
      }
    }

    var m12 = metricFor("M12_Scenario_Maya_Strategy_Menu");
    if (m12) {
      if (m12.markersMissing.indexOf("strategy_a") !== -1) {
        gateError("A4", m12.material_id, "G3", "missing Strategy A");
      }
      if (m12.markersMissing.indexOf("strategy_e") !== -1) {
        gateError("A4", m12.material_id, "G3", "missing Strategy E");
      }
    }

    var m18 = metricFor("M18_Transfer_Prompt_Evaluate");
    if (m18) {
      if (m18.ratio < 80) {
        gateError("A4", m18.material_id, "G6", "ratio " + m18.ratio + "% < 80%");
      }
      if (m18.markersMissing.indexOf("transfer_word_band") !== -1) {
        gateError("A4", m18.material_id, "G6", "missing transfer word-band marker");
      }
    }

    ["M8_Worked_Analytic_Pass_Household_Inflation", "M9_Scenario_Maya_Households", "M10_Analysis_Table_Household_Comparison"].forEach(function (mid) {
      var m = metricFor(mid);
      if (m && m.ratio < 99) {
        gateError("A3", mid, "G7", "ratio " + m.ratio + "% < 99%");
      }
    });

    rows.forEach(function (row, index) {
      var mats = (row && row.materials) || {};
      var hasChecklist = Object.keys(mats).some(function (key) {
        return /checklist/i.test(key) && String(mats[key]).length >= 80;
      });
      if (!hasChecklist) {
        gateError("A" + (index + 1), "checklist", "G8", "missing checklist >= 80 chars");
      }
    });

    if (!page.metadata || page.metadata.gam_materials_preserve_applied !== true) {
      errors.push("page:metadata:G9:gam_materials_preserve_applied not true");
    }

    ["M12_Scenario_Maya_Strategy_Menu", "M14_Worked_Judgement_Weak_Strong", "M15_Guided_Judgement_Table"].forEach(function (mid) {
      var m = metricFor(mid);
      if (!m || !rows[3]) return;
      var pageKey = m.page_key;
      var pageBody = rows[3].materials ? pageMaterialText(rows[3].materials, pageKey) : "";
      var gamAct = findA4GamActivity(opts.gamSource);
      var gamBody = "";
      if (gamAct) {
        gamMaterialsForActivity(gamAct).forEach(function (mat) {
          if (mat.material_id === mid) gamBody = materialContent(mat);
        });
      }
      var spec = resolveFidelityContract(pageKey, { material_id: mid });
      if (isSynopsisOrShell(pageBody, gamBody, pageKey, spec)) {
        gateError("A4", mid, "G10", "synopsis or shell on Tier-A material");
      }
    });

    var m13 = metricFor("M13_Criteria_Exposition_Evaluate");
    if (m13 && m13.ratio < 85) {
      warnings.push("A4:M13_Criteria_Exposition_Evaluate:G11:ratio " + m13.ratio + "% < 85%");
    }

    var m19 = metricFor("M19_Consolidation_Summary");
    if (m19 && m19.ratio < 70) {
      warnings.push("A4:M19_Consolidation_Summary:G12:ratio " + m19.ratio + "% < 70%");
    }

    var m16 = metricFor("M16_Independent_Judgement_Template");
    if (m16 && rows[3] && rows[3].materials) {
      var tpl = String(
        rows[3].materials.independent_judgement_template || rows[3].materials.template || ""
      );
      if (tpl.length < 300 && !/\*\*To:\*\*/.test(tpl) && !/\*\*Subject:\*\*/.test(tpl)) {
        warnings.push("A4:M16_Independent_Judgement_Template:G13:independent template depth gap");
      }
    }

    if (opts.strict === false) {
      return { ok: errors.length === 0, errors: errors, warnings: warnings, metrics: metrics };
    }

    return { ok: errors.length === 0, errors: errors, warnings: warnings, metrics: metrics };
  }

  return {
    pageFieldKeyForMaterial: pageFieldKeyForMaterial,
    buildMaterialsObjectFromGamList: buildMaterialsObjectFromGamList,
    mergeMaterialsObjects: mergeMaterialsObjects,
    mergeMaterialsFromGamList: mergeMaterialsFromGamList,
    parseGamMaterialsFromText: parseGamMaterialsFromText,
    normalizePackTextCaptureInput: normalizePackTextCaptureInput,
    isPackTextActivityMaterialsCapture: isPackTextActivityMaterialsCapture,
    parsePackTextUpstreamActivities: parsePackTextUpstreamActivities,
    parseUpstreamActivityMaterialsCapture: parseUpstreamActivityMaterialsCapture,
    buildUpstreamGamActivitiesFromMaterials: buildUpstreamGamActivitiesFromMaterials,
    applyGamMaterialsToComposedPage: applyGamMaterialsToComposedPage,
    buildMaterialRoleIndex: buildMaterialRoleIndex,
    applyRoleSupersessionToActivityRow: applyRoleSupersessionToActivityRow,
    measureRoleSupersession: measureRoleSupersession,
    inferActivityArchetype: inferActivityArchetype,
    ROLE_AUTHORITY: ROLE_AUTHORITY,
    validatePageMaterialsClosure: validatePageMaterialsClosure,
    validate38LPageGamPreservation: validate38LPageGamPreservation,
    validate38MPageFidelity: validate38MPageFidelity,
    measurePageGamFidelity: measurePageGamFidelity,
    pageMaterialText: pageMaterialText,
    semanticMarkerSatisfied: semanticMarkerSatisfied,
    hasGuidedTableExemplar: hasGuidedTableExemplar,
    evaluateMaterialMarkers: evaluateMaterialMarkers,
    PAGE_MATERIAL_KEY_ALIASES: PAGE_MATERIAL_KEY_ALIASES,
    isSynopsisOrShell: isSynopsisOrShell,
    tableShellCollapse: tableShellCollapse,
    findLearningActivitiesRows: findLearningActivitiesRows,
    shouldMergeGamBody: shouldMergeGamBody,
    pedagogicRichnessLoss: pedagogicRichnessLoss,
    isAuthoritativeGamPageKey: isAuthoritativeGamPageKey
  };
});
