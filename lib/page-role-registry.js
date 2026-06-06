/**
 * Instructional role registry (Sprint 38-P).
 * Authoritative GAM type/purpose → role_family → canonical_key → heading → sequence.
 * Additive to 38M pageFieldKeyForMaterial — does not replace merge contract yet.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_PAGE_ROLE_REGISTRY = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var ROLE_REGISTRY_VERSION = "38P-2";

  var ARCHETYPES = ["evaluate", "analyse", "apply", "understand", "default"];

  /**
   * Static role-family definitions (heading, aliases, sequence weights, authority rules).
   * GAM matching is handled by GAM_ROLE_RULES (first match wins).
   */
  var ROLE_FAMILY_DEFINITIONS = {
    learner_task: {
      role_family: "learner_task",
      heading: "What to do",
      sequence_weight: { evaluate: 5, analyse: 5, apply: 5, understand: 5, default: 5 },
      allowed_aliases: [],
      authority_rules: { gam_wins_over: ["compose"], body_markers: [], inversion_markers: [] },
      storage: "activity_row",
      activity_row_field: "learner_task"
    },
    reasoning_orientation: {
      role_family: "reasoning_orientation",
      heading: "Reasoning orientation",
      sequence_weight: { evaluate: 8, analyse: 8, apply: 8, understand: 8, default: 8 },
      allowed_aliases: [],
      authority_rules: { gam_wins_over: ["compose"], body_markers: [], inversion_markers: [] },
      storage: "activity_row",
      activity_row_field: "reasoning_orientation"
    },
    scenario: {
      role_family: "scenario",
      heading: "Scenario",
      sequence_weight: { evaluate: 10, analyse: 30, apply: 20, understand: 15, default: 20 },
      allowed_aliases: ["scenario", "scenarios", "scenario_maya_households", "scenario_maya_strategy_menu"],
      authority_rules: { gam_wins_over: ["compose"], body_markers: ["strategy_a", "strategy_e"], inversion_markers: [] },
      storage: "materials",
      activity_row_field: null
    },
    worked_example: {
      role_family: "worked_example",
      heading: "Worked example",
      sequence_weight: { evaluate: 0, analyse: 0, apply: 0, understand: 10, default: 10 },
      allowed_aliases: ["worked_example"],
      authority_rules: { gam_wins_over: ["compose"], body_markers: [], inversion_markers: [] },
      storage: "materials",
      activity_row_field: null
    },
    worked_calculation: {
      role_family: "worked_calculation",
      heading: "Worked calculation",
      sequence_weight: { evaluate: 0, analyse: 0, apply: 15, understand: 0, default: 15 },
      allowed_aliases: ["worked_example"],
      authority_rules: { gam_wins_over: ["compose"], body_markers: [], inversion_markers: [] },
      storage: "materials",
      activity_row_field: null
    },
    worked_analytic_pass: {
      role_family: "worked_analytic_pass",
      heading: "Worked analytic pass",
      sequence_weight: { evaluate: 0, analyse: 10, apply: 0, understand: 0, default: 10 },
      allowed_aliases: ["worked_analytic_pass", "worked_example"],
      authority_rules: {
        gam_wins_over: ["compose"],
        body_markers: ["distribution_lens", "stepwise_analysis"],
        inversion_markers: []
      },
      storage: "materials",
      activity_row_field: null
    },
    model_answer: {
      role_family: "model_answer",
      heading: "Sample output",
      sequence_weight: { evaluate: 0, analyse: 0, apply: 0, understand: 12, default: 12 },
      allowed_aliases: ["sample_output"],
      authority_rules: { gam_wins_over: ["compose"], body_markers: [], inversion_markers: [] },
      storage: "materials",
      activity_row_field: null
    },
    model_calculation: {
      role_family: "model_calculation",
      heading: "Sample output",
      sequence_weight: { evaluate: 0, analyse: 0, apply: 12, understand: 0, default: 12 },
      allowed_aliases: ["sample_output"],
      authority_rules: { gam_wins_over: ["compose"], body_markers: [], inversion_markers: [] },
      storage: "materials",
      activity_row_field: null
    },
    sample_output: {
      role_family: "sample_output",
      heading: "Sample output",
      sequence_weight: { evaluate: 0, analyse: 0, apply: 12, understand: 12, default: 12 },
      allowed_aliases: ["sample_output"],
      authority_rules: { gam_wins_over: ["compose"], body_markers: [], inversion_markers: [] },
      storage: "materials",
      activity_row_field: null
    },
    explanatory_guidance: {
      role_family: "explanatory_guidance",
      heading: "Concept exposition",
      sequence_weight: { evaluate: 20, analyse: 0, apply: 0, understand: 8, default: 10 },
      allowed_aliases: ["concept_text", "concept_exposition", "criteria_text", "criteria_exposition_evaluate", "text"],
      authority_rules: {
        gam_wins_over: ["compose"],
        body_markers: ["criteria_depth", "criteria_adaptability", "criteria_transferability"],
        inversion_markers: []
      },
      storage: "materials",
      activity_row_field: null
    },
    reasoning_support: {
      role_family: "reasoning_support",
      heading: "Modelling note",
      sequence_weight: { evaluate: 0, analyse: 0, apply: 0, understand: 0, default: 0 },
      allowed_aliases: ["modelling_note"],
      authority_rules: { gam_wins_over: ["compose"], body_markers: [], inversion_markers: [] },
      storage: "materials",
      activity_row_field: null
    },
    practice_table: {
      role_family: "practice_table",
      heading: "Worksheet",
      sequence_weight: { evaluate: 0, analyse: 25, apply: 20, understand: 0, default: 20 },
      allowed_aliases: [
        "worksheet",
        "classification_table",
        "analysis_table",
        "practice_table",
        "comparison_table",
        "impact_table",
        "table"
      ],
      authority_rules: { gam_wins_over: ["compose"], body_markers: [], inversion_markers: [] },
      storage: "materials",
      activity_row_field: null
    },
    verification_checklist: {
      role_family: "verification_checklist",
      heading: "Verification checklist",
      sequence_weight: { evaluate: 60, analyse: 40, apply: 35, understand: 30, default: 35 },
      allowed_aliases: ["checklist", "checklist_evaluate", "verification_checklist", "evaluation_checklist"],
      authority_rules: { gam_wins_over: ["compose"], body_markers: [], inversion_markers: [] },
      storage: "materials",
      activity_row_field: null
    },
    worked_judgement_support: {
      role_family: "worked_judgement_support",
      heading: "Worked judgement (weak vs strong)",
      sequence_weight: { evaluate: 30, analyse: 0, apply: 0, understand: 0, default: 30 },
      allowed_aliases: ["modelling_note", "worked_judgement_weak_strong", "worked_example"],
      authority_rules: {
        gam_wins_over: ["compose"],
        body_markers: ["weak_worked_judgement", "strong_worked_judgement"],
        inversion_markers: []
      },
      storage: "materials",
      activity_row_field: null
    },
    guided_judgement_table: {
      role_family: "guided_judgement_table",
      heading: "Guided judgement table",
      sequence_weight: { evaluate: 40, analyse: 0, apply: 0, understand: 0, default: 40 },
      allowed_aliases: ["decision_table", "guided_judgement_table"],
      authority_rules: {
        gam_wins_over: ["compose"],
        body_markers: ["guided_table_exemplar"],
        inversion_markers: []
      },
      storage: "materials",
      activity_row_field: null
    },
    independent_template: {
      role_family: "independent_template",
      heading: "Independent judgement template",
      sequence_weight: { evaluate: 50, analyse: 0, apply: 0, understand: 0, default: 50 },
      allowed_aliases: ["independent_judgement_template", "template"],
      authority_rules: { gam_wins_over: ["compose"], body_markers: [], inversion_markers: [] },
      storage: "materials",
      activity_row_field: null
    },
    scaffold_hint: {
      role_family: "scaffold_hint",
      heading: "Scaffold hints",
      sequence_weight: { evaluate: 55, analyse: 35, apply: 30, understand: 25, default: 30 },
      allowed_aliases: ["scaffold_hint_sequence"],
      authority_rules: { gam_wins_over: ["compose"], body_markers: [], inversion_markers: [] },
      storage: "activity_row",
      activity_row_field: "scaffold_hint_sequence"
    },
    self_explanation_prompt: {
      role_family: "self_explanation_prompt",
      heading: "Self-explanation",
      sequence_weight: { evaluate: 65, analyse: 0, apply: 0, understand: 0, default: 65 },
      allowed_aliases: ["self_explanation_prompt"],
      authority_rules: { gam_wins_over: ["compose"], body_markers: [], inversion_markers: [] },
      storage: "activity_row",
      activity_row_field: "self_explanation_prompt"
    },
    consolidation_summary: {
      role_family: "consolidation_summary",
      heading: "Consolidation summary",
      sequence_weight: { evaluate: 70, analyse: 0, apply: 0, understand: 0, default: 70 },
      allowed_aliases: ["consolidation_summary"],
      authority_rules: {
        gam_wins_over: ["compose"],
        body_markers: ["consolidation_reflect"],
        inversion_markers: ["learner_write_prompt"]
      },
      storage: "materials",
      activity_row_field: null
    },
    transfer_prompt: {
      role_family: "transfer_prompt",
      heading: "Transfer prompt",
      sequence_weight: { evaluate: 80, analyse: 0, apply: 0, understand: 0, default: 80 },
      allowed_aliases: ["transfer_prompt", "transfer_prompt_evaluate"],
      authority_rules: {
        gam_wins_over: ["compose"],
        body_markers: ["transfer_word_band"],
        inversion_markers: []
      },
      storage: "materials",
      activity_row_field: null
    }
  };

  /**
   * GAM resolution rules — ordered most-specific-first.
   * Each rule: { types, purpose (RegExp|null), role_family, canonical_key, headingOverride? }
   */
  var GAM_ROLE_RULES = [
    {
      types: ["modelling_note"],
      purpose: /worked judg(e)?ment|judgment/i,
      role_family: "worked_judgement_support",
      canonical_key: "worked_judgement_weak_strong"
    },
    {
      types: ["modelling_note"],
      purpose: null,
      role_family: "reasoning_support",
      canonical_key: "modelling_note"
    },
    {
      types: ["decision_table"],
      purpose: null,
      role_family: "guided_judgement_table",
      canonical_key: "guided_judgement_table"
    },
    {
      types: ["worked_example"],
      purpose: /worked analytic pass|analytic pass/i,
      role_family: "worked_analytic_pass",
      canonical_key: "worked_analytic_pass"
    },
    {
      types: ["worked_example"],
      purpose: /worked judg(e)?ment|judgment/i,
      role_family: "worked_judgement_support",
      canonical_key: "worked_judgement_weak_strong"
    },
    {
      types: ["worked_example"],
      purpose: /calculation|cpi|numeric|worked calc/i,
      role_family: "worked_calculation",
      canonical_key: "worked_example"
    },
    {
      types: ["worked_example"],
      purpose: /worked thinking|thinking/i,
      role_family: "worked_example",
      canonical_key: "worked_example"
    },
    {
      types: ["worked_example"],
      purpose: null,
      role_family: "worked_example",
      canonical_key: "worked_example"
    },
    {
      types: ["sample_output"],
      purpose: /calculation|model calc|numeric/i,
      role_family: "model_calculation",
      canonical_key: "sample_output"
    },
    {
      types: ["sample_output"],
      purpose: /model answer|answer reference/i,
      role_family: "model_answer",
      canonical_key: "sample_output"
    },
    {
      types: ["sample_output"],
      purpose: null,
      role_family: "sample_output",
      canonical_key: "sample_output"
    },
    {
      types: ["text"],
      purpose: /criteria/i,
      role_family: "explanatory_guidance",
      canonical_key: "criteria_exposition_evaluate",
      headingOverride: "Criteria exposition"
    },
    {
      types: ["text"],
      purpose: /concept|exposition|elucidation/i,
      role_family: "explanatory_guidance",
      canonical_key: "concept_exposition",
      headingOverride: "Concept exposition"
    },
    {
      types: ["text"],
      purpose: null,
      role_family: "explanatory_guidance",
      canonical_key: "text"
    },
    {
      types: ["checklist"],
      purpose: /evaluate|verification/i,
      role_family: "verification_checklist",
      canonical_key: "checklist_evaluate"
    },
    {
      types: ["checklist"],
      purpose: null,
      role_family: "verification_checklist",
      canonical_key: "checklist"
    },
    {
      types: ["transfer_prompt"],
      purpose: null,
      role_family: "transfer_prompt",
      canonical_key: "transfer_prompt_evaluate"
    },
    {
      types: ["template"],
      purpose: /independent/i,
      role_family: "independent_template",
      canonical_key: "independent_judgement_template"
    },
    {
      types: ["template"],
      purpose: null,
      role_family: "independent_template",
      canonical_key: "template"
    },
    {
      types: ["scenario"],
      purpose: /strategy|menu/i,
      role_family: "scenario",
      canonical_key: "scenario_maya_strategy_menu",
      headingOverride: "Strategy menu"
    },
    {
      types: ["scenario"],
      purpose: null,
      role_family: "scenario",
      canonical_key: "scenario_maya_households"
    },
    {
      types: ["consolidation_summary"],
      purpose: null,
      role_family: "consolidation_summary",
      canonical_key: "consolidation_summary"
    },
    {
      types: ["classification_table"],
      purpose: null,
      role_family: "practice_table",
      canonical_key: "classification_table"
    },
    {
      types: ["analysis_table"],
      purpose: null,
      role_family: "practice_table",
      canonical_key: "analysis_table"
    },
    {
      types: ["comparison_table"],
      purpose: null,
      role_family: "practice_table",
      canonical_key: "comparison_table"
    },
    {
      types: ["impact_table"],
      purpose: null,
      role_family: "practice_table",
      canonical_key: "impact_table"
    }
  ];

  var PAGE_KEY_ROLE_HINTS = {
    modelling_note: { default_role_family: "reasoning_support", judgement_role_family: "worked_judgement_support" },
    worked_judgement_weak_strong: "worked_judgement_support",
    worked_example: "worked_example",
    decision_table: "guided_judgement_table",
    guided_judgement_table: "guided_judgement_table",
    transfer_prompt: "transfer_prompt",
    transfer_prompt_evaluate: "transfer_prompt",
    independent_judgement_template: "independent_template",
    template: "independent_template",
    consolidation_summary: "consolidation_summary",
    checklist_evaluate: "verification_checklist",
    checklist: "verification_checklist",
    verification_checklist: "verification_checklist",
    evaluation_checklist: "verification_checklist",
    criteria_exposition_evaluate: "explanatory_guidance",
    criteria_text: "explanatory_guidance",
    concept_exposition: "explanatory_guidance",
    concept_text: "explanatory_guidance",
    worked_analytic_pass: "worked_analytic_pass",
    analysis_table: "practice_table",
    classification_table: "practice_table",
    worksheet: "practice_table",
    scenario_maya_households: "scenario",
    scenario_maya_strategy_menu: "scenario",
    scenario: "scenario",
    scenarios: "scenario",
    sample_output: "sample_output",
    learner_task: "learner_task",
    scaffold_hint_sequence: "scaffold_hint",
    reasoning_orientation: "reasoning_orientation",
    self_explanation_prompt: "self_explanation_prompt"
  };

  var ROLE_RENDER_ALIAS_GROUPS = {};

  function normalizeTypePurpose(type, purpose) {
    return {
      type: String(type || "").toLowerCase().trim(),
      purpose: String(purpose || "").toLowerCase().trim()
    };
  }

  function normalizeArchetype(archetype) {
    var key = String(archetype || "default").toLowerCase();
    return ARCHETYPES.indexOf(key) !== -1 ? key : "default";
  }

  function gamRuleMatches(rule, type, purpose) {
    if (rule.types.indexOf(type) === -1) return false;
    if (!rule.purpose) return true;
    return rule.purpose.test(purpose);
  }

  function findGamRule(type, purpose) {
    for (var i = 0; i < GAM_ROLE_RULES.length; i += 1) {
      if (gamRuleMatches(GAM_ROLE_RULES[i], type, purpose)) {
        return GAM_ROLE_RULES[i];
      }
    }
    return null;
  }

  function getRoleFamilyDefinition(roleFamily) {
    if (!roleFamily) return null;
    return ROLE_FAMILY_DEFINITIONS[roleFamily] || null;
  }

  function buildRegistryEntry(roleFamily, rule) {
    var def = getRoleFamilyDefinition(roleFamily);
    if (!def) return null;
    return {
      role_family: roleFamily,
      gam_match: rule
        ? { types: rule.types.slice(), purpose_pattern: rule.purpose ? String(rule.purpose) : null }
        : null,
      canonical_key: rule ? rule.canonical_key : null,
      heading: rule && rule.headingOverride ? rule.headingOverride : def.heading,
      sequence_weight: Object.assign({}, def.sequence_weight),
      allowed_aliases: def.allowed_aliases.slice(),
      authority_rules: Object.assign({}, def.authority_rules),
      storage: def.storage,
      activity_row_field: def.activity_row_field
    };
  }

  function compileRoleRenderAliasGroups() {
    Object.keys(ROLE_FAMILY_DEFINITIONS).forEach(function (roleFamily) {
      var def = ROLE_FAMILY_DEFINITIONS[roleFamily];
      if (def.storage !== "materials") return;
      var canonical = resolveCanonicalRole(roleFamily);
      var keys = [canonical].concat(def.allowed_aliases || []);
      var unique = [];
      keys.forEach(function (k) {
        if (k && unique.indexOf(k) === -1) unique.push(k);
      });
      ROLE_RENDER_ALIAS_GROUPS[roleFamily] = unique;
    });
  }

  function resolveRoleFamily(type, purpose) {
    var norm = normalizeTypePurpose(type, purpose);
    if (!norm.type) return null;
    var rule = findGamRule(norm.type, norm.purpose);
    return rule ? rule.role_family : null;
  }

  function resolveCanonicalKey(type, purpose) {
    var norm = normalizeTypePurpose(type, purpose);
    if (!norm.type) return null;
    var rule = findGamRule(norm.type, norm.purpose);
    return rule ? rule.canonical_key : null;
  }

  function resolveCanonicalRole(roleFamily, options) {
    var opts = options && typeof options === "object" ? options : {};
    if (opts.type && opts.purpose != null) {
      var fromGam = resolveCanonicalKey(opts.type, opts.purpose);
      if (fromGam && resolveRoleFamily(opts.type, opts.purpose) === roleFamily) {
        return fromGam;
      }
    }
    if (opts.canonical_key) return String(opts.canonical_key);
    var def = getRoleFamilyDefinition(roleFamily);
    if (!def) return null;
    for (var i = 0; i < GAM_ROLE_RULES.length; i += 1) {
      if (GAM_ROLE_RULES[i].role_family === roleFamily) {
        return GAM_ROLE_RULES[i].canonical_key;
      }
    }
    if (def.activity_row_field) return def.activity_row_field;
    return null;
  }

  function resolveRoleHeading(roleFamily, options) {
    var opts = options && typeof options === "object" ? options : {};
    if (opts.type && opts.purpose != null) {
      var norm = normalizeTypePurpose(opts.type, opts.purpose);
      var rule = findGamRule(norm.type, norm.purpose);
      if (rule && rule.role_family === roleFamily) {
        if (rule.headingOverride) return rule.headingOverride;
      }
    }
    var def = getRoleFamilyDefinition(roleFamily);
    return def ? def.heading : null;
  }

  function resolveRoleSequence(roleFamily, archetype) {
    var def = getRoleFamilyDefinition(roleFamily);
    if (!def) return null;
    var arch = normalizeArchetype(archetype);
    var sw = def.sequence_weight || {};
    if (sw[arch] != null) return sw[arch];
    return sw.default != null ? sw.default : null;
  }

  function getSequenceForArchetype(archetype) {
    var arch = normalizeArchetype(archetype);
    var families = Object.keys(ROLE_FAMILY_DEFINITIONS);
    var ordered = families
      .map(function (roleFamily) {
        return {
          role_family: roleFamily,
          sequence_weight: resolveRoleSequence(roleFamily, arch)
        };
      })
      .filter(function (entry) {
        return entry.sequence_weight != null && entry.sequence_weight > 0;
      })
      .sort(function (a, b) {
        return a.sequence_weight - b.sequence_weight;
      });
    return ordered.map(function (entry) {
      return entry.role_family;
    });
  }

  function resolveRoleMetadata(type, purpose) {
    var norm = normalizeTypePurpose(type, purpose);
    if (!norm.type) return null;
    var rule = findGamRule(norm.type, norm.purpose);
    if (!rule) return null;
    var entry = buildRegistryEntry(rule.role_family, rule);
    if (!entry) return null;
    return {
      role_family: entry.role_family,
      canonical_key: entry.canonical_key,
      heading: entry.heading,
      sequence_weight: entry.sequence_weight,
      allowed_aliases: entry.allowed_aliases,
      authority_rules: entry.authority_rules,
      storage: entry.storage,
      activity_row_field: entry.activity_row_field,
      source: "gam",
      authority: "gam"
    };
  }

  function resolveRoleFromGam(mat) {
    if (!mat || typeof mat !== "object") return null;
    return resolveRoleMetadata(mat.type, mat.purpose);
  }

  function getAllowedAliases(roleFamily) {
    var def = getRoleFamilyDefinition(roleFamily);
    if (!def) return [];
    return def.allowed_aliases.slice();
  }

  function getAuthorityRules(roleFamily) {
    var def = getRoleFamilyDefinition(roleFamily);
    if (!def || !def.authority_rules) return null;
    return Object.assign({}, def.authority_rules);
  }

  function getRoleFamilyForPageKey(pageKey, options) {
    var key = String(pageKey || "").toLowerCase().trim();
    if (!key) return null;
    var opts = options && typeof options === "object" ? options : {};
    var hint = PAGE_KEY_ROLE_HINTS[key];
    if (typeof hint === "string") return hint;
    if (hint && typeof hint === "object") {
      if (opts.purpose && /worked judg(e)?ment|judgment/i.test(String(opts.purpose))) {
        return hint.judgement_role_family;
      }
      if (opts.prefer_judgement) return hint.judgement_role_family;
      return hint.default_role_family;
    }
    var families = Object.keys(ROLE_FAMILY_DEFINITIONS);
    for (var i = 0; i < families.length; i += 1) {
      var def = ROLE_FAMILY_DEFINITIONS[families[i]];
      var canonical = resolveCanonicalRole(families[i]);
      if (canonical === key) return families[i];
      if (def.allowed_aliases.indexOf(key) !== -1) return families[i];
    }
    return null;
  }

  function listRoleFamilies() {
    return Object.keys(ROLE_FAMILY_DEFINITIONS).slice();
  }

  function getRegistryEntry(roleFamily) {
    var def = getRoleFamilyDefinition(roleFamily);
    if (!def) return null;
    var rule = null;
    for (var i = 0; i < GAM_ROLE_RULES.length; i += 1) {
      if (GAM_ROLE_RULES[i].role_family === roleFamily) {
        rule = GAM_ROLE_RULES[i];
        break;
      }
    }
    return buildRegistryEntry(roleFamily, rule);
  }

  compileRoleRenderAliasGroups();

  return {
    ROLE_REGISTRY_VERSION: ROLE_REGISTRY_VERSION,
    ROLE_FAMILY_DEFINITIONS: ROLE_FAMILY_DEFINITIONS,
    GAM_ROLE_RULES: GAM_ROLE_RULES,
    ROLE_RENDER_ALIAS_GROUPS: ROLE_RENDER_ALIAS_GROUPS,
    ARCHETYPES: ARCHETYPES,
    resolveRoleFamily: resolveRoleFamily,
    resolveCanonicalKey: resolveCanonicalKey,
    resolveCanonicalRole: resolveCanonicalRole,
    resolveRoleHeading: resolveRoleHeading,
    resolveRoleSequence: resolveRoleSequence,
    resolveRoleMetadata: resolveRoleMetadata,
    resolveRoleFromGam: resolveRoleFromGam,
    getAllowedAliases: getAllowedAliases,
    getAuthorityRules: getAuthorityRules,
    getRoleFamilyForPageKey: getRoleFamilyForPageKey,
    getSequenceForArchetype: getSequenceForArchetype,
    getRegistryEntry: getRegistryEntry,
    listRoleFamilies: listRoleFamilies
  };
});
