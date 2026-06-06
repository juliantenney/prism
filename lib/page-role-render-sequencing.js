/**
 * Role-precedence learner render sequencing (Sprint 38-P).
 * Consumes material_role_index + role registry for authoritative render order.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_PAGE_ROLE_RENDER_SEQUENCING = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var roleRegistry = null;
  try {
    if (typeof require !== "undefined") {
      roleRegistry = require("./page-role-registry.js");
    }
  } catch (e) {
    roleRegistry = null;
  }

  function resolveRoleRegistry() {
    if (roleRegistry && typeof roleRegistry.getSequenceForArchetype === "function") {
      return roleRegistry;
    }
    var roots = [];
    if (typeof globalThis !== "undefined") roots.push(globalThis);
    if (typeof window !== "undefined") roots.push(window);
    var i;
    for (i = 0; i < roots.length; i += 1) {
      if (roots[i] && roots[i].PRISM_PAGE_ROLE_REGISTRY) {
        return roots[i].PRISM_PAGE_ROLE_REGISTRY;
      }
    }
    return null;
  }

  function materialHasBody(val) {
    if (val == null || val === "") return false;
    if (typeof val === "string") return String(val).trim().length > 0;
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === "object") return Object.keys(val).length > 0;
    return true;
  }

  function authorityRank(authority) {
    var ranks = { canonical: 0, compose: 1, unresolved: 2, alias: 3, superseded: 4 };
    return Object.prototype.hasOwnProperty.call(ranks, authority) ? ranks[authority] : 5;
  }

  function isRolePrecedenceActive(activityRow) {
    var index = activityRow && activityRow.material_role_index;
    return !!(index && typeof index === "object" && Object.keys(index).length > 0);
  }

  function resolveAuthoritativeKeyForRoleFamily(roleFamily, materialRoleIndex, materials) {
    if (!roleFamily || !materialRoleIndex) return null;
    var candidates = [];
    Object.keys(materialRoleIndex).forEach(function (key) {
      var entry = materialRoleIndex[key];
      if (!entry || entry.role_family !== roleFamily) return;
      if (entry.renderable === false) return;
      if (!materialHasBody(materials && materials[key])) return;
      candidates.push({ key: key, entry: entry });
    });
    if (!candidates.length) return null;
    candidates.sort(function (a, b) {
      var rankDiff = authorityRank(a.entry.authority) - authorityRank(b.entry.authority);
      if (rankDiff !== 0) return rankDiff;
      if (a.entry.canonical && !b.entry.canonical) return -1;
      if (!a.entry.canonical && b.entry.canonical) return 1;
      return 0;
    });
    return candidates[0].key;
  }

  function buildRolePrecedenceRenderPlan(activityRow, materials) {
    if (!isRolePrecedenceActive(activityRow)) return [];
    var registry = resolveRoleRegistry();
    if (!registry) return [];

    var index = activityRow.material_role_index;
    var mats = materials && typeof materials === "object" ? materials : {};
    var archetype = activityRow.activity_archetype || "default";
    var sequence = registry.getSequenceForArchetype(archetype);
    var plan = [];
    var familiesDone = {};

    sequence.forEach(function (roleFamily) {
      if (familiesDone[roleFamily]) return;
      var entry = registry.getRegistryEntry(roleFamily);
      if (entry && entry.storage === "activity_row") return;

      var key = resolveAuthoritativeKeyForRoleFamily(roleFamily, index, mats);
      if (!key) return;

      plan.push({
        role_family: roleFamily,
        key: key,
        heading: registry.resolveRoleHeading(roleFamily) || null
      });
      familiesDone[roleFamily] = true;
    });

    return plan;
  }

  function markRoleAliasGroupRendered(markFn, roleFamily) {
    var registry = resolveRoleRegistry();
    var groups = registry && registry.ROLE_RENDER_ALIAS_GROUPS ? registry.ROLE_RENDER_ALIAS_GROUPS : {};
    var keys = groups[roleFamily] || [roleFamily];
    keys.forEach(function (aliasKey) {
      markFn(aliasKey);
    });
  }

  function shouldSkipMaterialKeyForRolePrecedence(key, activityRow, wasRenderedFn) {
    if (!isRolePrecedenceActive(activityRow)) return false;
    var lower = String(key || "").toLowerCase();
    if (typeof wasRenderedFn === "function" && wasRenderedFn(lower)) return true;

    var index = activityRow.material_role_index || {};
    var entry = index[key] || index[lower];
    if (entry && entry.renderable === false) return true;

    return false;
  }

  function isMaterialRoleFamilyRendered(roleFamily, renderedFamilies) {
    if (!roleFamily || !renderedFamilies) return false;
    return !!renderedFamilies[roleFamily];
  }

  return {
    isRolePrecedenceActive: isRolePrecedenceActive,
    buildRolePrecedenceRenderPlan: buildRolePrecedenceRenderPlan,
    resolveAuthoritativeKeyForRoleFamily: resolveAuthoritativeKeyForRoleFamily,
    markRoleAliasGroupRendered: markRoleAliasGroupRendered,
    shouldSkipMaterialKeyForRolePrecedence: shouldSkipMaterialKeyForRolePrecedence,
    isMaterialRoleFamilyRendered: isMaterialRoleFamilyRendered,
    materialHasBody: materialHasBody
  };
});
