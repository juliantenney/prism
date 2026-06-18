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

  function shouldMergeGamBody(pageBody, gamBody, pageKey, spec) {
    if (pageBody == null || pageBody === "") return true;
    if (typeof gamBody !== "string" || !gamBody) return false;
    if (typeof pageBody !== "string") return true;
    if (bodiesEquivalent(pageBody, gamBody)) return false;
    if (stringLooksPlaceholderOnly(pageBody)) return true;
    if (pageBodyLooksLikeDescriptionSynopsis(pageBody)) return true;
    if (tableShellCollapse(pageBody, pageKey, gamBody)) return true;
    if (isAuthoritativeGamPageKey(pageKey)) {
      if (isSynopsisOrShell(pageBody, gamBody, pageKey, spec)) return true;
      if (pedagogicRichnessLoss(pageBody, gamBody)) return true;
      if (gamBody.length > pageBody.length) return true;
      if (spec && spec.markers && spec.markers.length && !markersPresent(pageBody, spec.markers)) {
        return true;
      }
      return true;
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
      if (shouldMergeGamBody(merged[pageKey], gamBody, pageKey, spec)) {
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
      if (
        fidelity.materialsObjectLooksPlaceholderOnly &&
        fidelity.materialsObjectLooksPlaceholderOnly(existingMaterials)
      ) {
        row.materials = buildMaterialsObjectFromGamList(gamMatList);
      } else {
        row.materials = mergeMaterialsFromGamList(existingMaterials, gamMatList);
      }
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

  function parseUpstreamActivityMaterialsCapture(raw, learningActivitiesUpstream) {
    if (raw == null || raw === "") return null;
    var parsed = raw;
    if (typeof raw === "string") {
      var trimmed = String(raw).trim();
      if (!trimmed) return null;
      try {
        parsed = JSON.parse(trimmed);
      } catch (_) {
        parsed = null;
      }
      if (!parsed) {
        var flatOnly = parseGamMaterialsFromText(trimmed);
        if (!flatOnly.length) return null;
        return buildUpstreamGamActivitiesFromMaterials(flatOnly, learningActivitiesUpstream);
      }
    }
    if (Array.isArray(parsed)) {
      if (parsed.length && parsed[0] && parsed[0].materials) {
        return parsed;
      }
      return buildUpstreamGamActivitiesFromMaterials(parsed, learningActivitiesUpstream);
    }
    if (parsed && typeof parsed === "object") {
      if (Array.isArray(parsed.activities)) {
        return parsed.activities;
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
    if (typeof raw === "string") {
      var flat = parseGamMaterialsFromText(raw);
      if (!flat.length) return null;
      return buildUpstreamGamActivitiesFromMaterials(flat, learningActivitiesUpstream);
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
    parseUpstreamActivityMaterialsCapture: parseUpstreamActivityMaterialsCapture,
    buildUpstreamGamActivitiesFromMaterials: buildUpstreamGamActivitiesFromMaterials,
    applyGamMaterialsToComposedPage: applyGamMaterialsToComposedPage,
    buildMaterialRoleIndex: buildMaterialRoleIndex,
    applyRoleSupersessionToActivityRow: applyRoleSupersessionToActivityRow,
    measureRoleSupersession: measureRoleSupersession,
    inferActivityArchetype: inferActivityArchetype,
    ROLE_AUTHORITY: ROLE_AUTHORITY,
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
