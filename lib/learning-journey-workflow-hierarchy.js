/**
 * Sprint 91 — Learning Journey parent/child presentation (derived).
 *
 * Hierarchy is derived from durable provenance only:
 *   child.sourceWorkflowId === learningJourney.id
 *
 * Does not persist parent.children[] or nest execution.
 */
(function (root, factory) {
  var api = factory(root);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.PRISM_LEARNING_JOURNEY_WORKFLOW_HIERARCHY = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  "use strict";

  function asText(value) {
    return String(value == null ? "" : value).trim();
  }

  function resolveFamilyMod() {
    if (typeof require === "function") {
      try {
        return require("./first-class-workflow-family.js");
      } catch (_err) {
        try {
          return require("../lib/first-class-workflow-family.js");
        } catch (_err2) {}
      }
    }
    var roots = [root, typeof globalThis !== "undefined" ? globalThis : null, typeof window !== "undefined" ? window : null];
    var i;
    for (i = 0; i < roots.length; i += 1) {
      if (roots[i] && roots[i].PRISM_FIRST_CLASS_WORKFLOW_FAMILY) {
        return roots[i].PRISM_FIRST_CLASS_WORKFLOW_FAMILY;
      }
    }
    return null;
  }

  function isLearningJourneyWorkflowRecord(workflow, options) {
    var opts = options && typeof options === "object" ? options : {};
    if (typeof opts.isLearningJourney === "function") {
      return !!opts.isLearningJourney(workflow);
    }
    if (!workflow || typeof workflow !== "object") return false;
    if (asText(workflow.product).toLowerCase() === "learning_journey") return true;
    var family = opts.familyMod || resolveFamilyMod();
    if (family && typeof family.publishRouteForWorkflow === "function") {
      return asText(family.publishRouteForWorkflow(workflow)).toLowerCase() === "learning_journey_page";
    }
    if (family && typeof family.promptRouteForWorkflow === "function") {
      return asText(family.promptRouteForWorkflow(workflow)).toLowerCase() === "learning_journey";
    }
    return false;
  }

  function readSourceWorkflowId(workflow) {
    if (!workflow || typeof workflow !== "object") return "";
    return asText(workflow.sourceWorkflowId || workflow.source_workflow_id);
  }

  function readSourceCommissionId(workflow) {
    if (!workflow || typeof workflow !== "object") return "";
    return asText(workflow.sourceCommissionId || workflow.source_commission_id);
  }

  /**
   * Valid LJ parent id for nesting, or "" if the workflow must remain top-level.
   * Missing parent / non-LJ parent ⇒ "" (child stays accessible as ordinary top-level).
   */
  function resolveLearningJourneyParentId(workflow, workflowsById, options) {
    var sourceId = readSourceWorkflowId(workflow);
    if (!sourceId) return "";
    var map = workflowsById && typeof workflowsById === "object" ? workflowsById : {};
    var parent = map[sourceId] || null;
    if (!parent) return "";
    if (!isLearningJourneyWorkflowRecord(parent, options)) return "";
    return sourceId;
  }

  function indexWorkflowsById(workflows) {
    var map = {};
    (Array.isArray(workflows) ? workflows : []).forEach(function (wf) {
      var id = asText(wf && wf.id);
      if (id) map[id] = wf;
    });
    return map;
  }

  function compareChildrenStable(a, b) {
    var ca = readSourceCommissionId(a);
    var cb = readSourceCommissionId(b);
    if (ca && cb && ca !== cb) {
      return ca.localeCompare(cb, undefined, { numeric: true, sensitivity: "base" });
    }
    if (ca && !cb) return -1;
    if (!ca && cb) return 1;
    var na = asText(a && a.name);
    var nb = asText(b && b.name);
    if (na !== nb) {
      return na.localeCompare(nb, undefined, { sensitivity: "base", numeric: true });
    }
    return asText(a && a.id).localeCompare(asText(b && b.id), undefined, {
      numeric: true,
      sensitivity: "base"
    });
  }

  /**
   * Build presentation rows for My Workflows.
   *
   * @param {object[]} visibleWorkflows — already filtered/sorted list
   * @param {object[]} allWorkflows — full catalogue (for parent lookup)
   * @param {object} [options]
   * @param {object} [options.expandedById] — { [ljId]: boolean }; default collapsed
   * @returns {{ rows: object[], childWorkflowIds: object, orderingNote: string }}
   */
  function buildLearningJourneyWorkflowListRows(visibleWorkflows, allWorkflows, options) {
    var opts = options && typeof options === "object" ? options : {};
    var visible = Array.isArray(visibleWorkflows) ? visibleWorkflows : [];
    var all = Array.isArray(allWorkflows) ? allWorkflows : visible;
    var byId = indexWorkflowsById(all);
    var expandedById =
      opts.expandedById && typeof opts.expandedById === "object" ? opts.expandedById : {};

    var childrenByParent = {};
    var nestedChildIds = {};
    visible.forEach(function (wf) {
      if (!wf || !asText(wf.id)) return;
      var parentId = resolveLearningJourneyParentId(wf, byId, opts);
      if (!parentId) return;
      nestedChildIds[asText(wf.id)] = parentId;
      if (!childrenByParent[parentId]) childrenByParent[parentId] = [];
      childrenByParent[parentId].push(wf);
    });

    Object.keys(childrenByParent).forEach(function (parentId) {
      childrenByParent[parentId].sort(compareChildrenStable);
    });

    var rows = [];
    var emittedParents = {};

    visible.forEach(function (wf) {
      if (!wf || !asText(wf.id)) return;
      var id = asText(wf.id);
      if (nestedChildIds[id]) return;

      if (isLearningJourneyWorkflowRecord(wf, opts)) {
        var kids = childrenByParent[id] || [];
        var expanded = expandedById[id] === true;
        rows.push({
          type: "lj_parent",
          workflow: wf,
          children: kids.slice(),
          expanded: expanded,
          hasChildren: kids.length > 0
        });
        emittedParents[id] = true;
        return;
      }

      rows.push({
        type: "standalone",
        workflow: wf,
        children: [],
        expanded: false,
        hasChildren: false
      });
    });

    // Visible children whose LJ parent was filtered out: still group under parent
    // so they do not appear as unrelated top-level rows.
    Object.keys(childrenByParent).forEach(function (parentId) {
      if (emittedParents[parentId]) return;
      var parent = byId[parentId];
      if (!parent || !isLearningJourneyWorkflowRecord(parent, opts)) return;
      var kids = childrenByParent[parentId] || [];
      rows.push({
        type: "lj_parent",
        workflow: parent,
        children: kids.slice(),
        expanded: expandedById[parentId] === true,
        hasChildren: kids.length > 0,
        parentOutsideFilter: true
      });
      emittedParents[parentId] = true;
    });

    return {
      rows: rows,
      childWorkflowIds: nestedChildIds,
      orderingNote:
        "Within a Learning Journey, children are ordered by sourceCommissionId when present, then name/id. Top-level order follows the existing My Workflows sort/filter. Commission array order from the LJ Design Page is not read in the list path."
    };
  }

  function isLearningJourneyListExpanded(expandedById, learningJourneyId) {
    var id = asText(learningJourneyId);
    if (!id) return false;
    var map = expandedById && typeof expandedById === "object" ? expandedById : {};
    return map[id] === true;
  }

  function setLearningJourneyListExpanded(expandedById, learningJourneyId, expanded) {
    var id = asText(learningJourneyId);
    var map =
      expandedById && typeof expandedById === "object" ? Object.assign({}, expandedById) : {};
    if (!id) return map;
    map[id] = !!expanded;
    return map;
  }

  function resolveSourceLearningJourneyForWorkflow(workflow, workflows, options) {
    var opts = options && typeof options === "object" ? options : {};
    var all = Array.isArray(workflows) ? workflows : [];
    var byId = indexWorkflowsById(all);
    var parentId = resolveLearningJourneyParentId(workflow, byId, opts);
    if (!parentId) {
      return { ok: false, code: "no_valid_learning_journey_parent", parent: null, parentId: "" };
    }
    return {
      ok: true,
      code: "ok",
      parentId: parentId,
      parent: byId[parentId] || null
    };
  }

  /**
   * Direct owned constituents of a Learning Journey.
   *
   * Ownership is durable provenance only: child.sourceWorkflowId === parent.id
   * (also accepts source_workflow_id). Does not use names, list order, adjacency,
   * or commission-array membership. Empty/missing source ids are not owned.
   * Non–Learning Journey parents yield [].
   */
  function listOwnedConstituentWorkflows(parentWorkflow, workflows, options) {
    var opts = options && typeof options === "object" ? options : {};
    if (!isLearningJourneyWorkflowRecord(parentWorkflow, opts)) return [];
    var parentId = asText(parentWorkflow && parentWorkflow.id);
    if (!parentId) return [];
    var rows = Array.isArray(workflows) ? workflows : [];
    var owned = [];
    rows.forEach(function (wf) {
      if (!wf || typeof wf !== "object") return;
      var id = asText(wf.id);
      if (!id || id === parentId) return;
      if (readSourceWorkflowId(wf) !== parentId) return;
      owned.push(wf);
    });
    owned.sort(compareChildrenStable);
    return owned;
  }

  /**
   * Cascade delete plan for deleting a Learning Journey.
   *
   * Includes the parent and every workflow transitively owned via sourceWorkflowId
   * (nested LJ children included). Workflows that only reference the journey in
   * content/commissions, or that point at a different/missing parent id, are excluded.
   *
   * @returns {{
   *   cascade: boolean,
   *   parent: object|null,
   *   constituents: object[],
   *   deleteIds: string[],
   *   deleteWorkflows: object[]
   * }}
   */
  function planLearningJourneyCascadeDeletion(parentWorkflow, workflows, options) {
    var opts = options && typeof options === "object" ? options : {};
    var all = Array.isArray(workflows) ? workflows : [];
    var empty = {
      cascade: false,
      parent: parentWorkflow && typeof parentWorkflow === "object" ? parentWorkflow : null,
      constituents: [],
      deleteIds: [],
      deleteWorkflows: []
    };
    if (!isLearningJourneyWorkflowRecord(parentWorkflow, opts)) {
      return empty;
    }
    var rootId = asText(parentWorkflow.id);
    if (!rootId) return empty;

    var byId = indexWorkflowsById(all);
    var deleteIdSet = {};
    var queue = [rootId];
    deleteIdSet[rootId] = true;

    while (queue.length) {
      var currentId = queue.shift();
      var current = byId[currentId] || (currentId === rootId ? parentWorkflow : null);
      if (!isLearningJourneyWorkflowRecord(current, opts)) continue;
      listOwnedConstituentWorkflows(current, all, opts).forEach(function (child) {
        var childId = asText(child && child.id);
        if (!childId || deleteIdSet[childId]) return;
        deleteIdSet[childId] = true;
        queue.push(childId);
      });
    }

    var constituents = [];
    Object.keys(deleteIdSet).forEach(function (id) {
      if (id === rootId) return;
      var wf = byId[id];
      if (wf) constituents.push(wf);
    });
    constituents.sort(compareChildrenStable);

    var deleteWorkflows = [parentWorkflow].concat(constituents);
    var deleteIds = deleteWorkflows.map(function (wf) {
      return asText(wf && wf.id);
    }).filter(Boolean);

    return {
      cascade: constituents.length > 0,
      parent: parentWorkflow,
      constituents: constituents,
      deleteIds: deleteIds,
      deleteWorkflows: deleteWorkflows
    };
  }

  function readWorkflowUpdatedAtMs(workflow) {
    var n = Number(workflow && workflow.updatedAt);
    if (typeof n === "number" && isFinite(n) && n > 0) return n;
    return 0;
  }

  /**
   * Transitive owned constituents via sourceWorkflowId (same ownership as cascade delete).
   * Excludes the parent itself. Ignores unrelated / ambiguous ownership.
   */
  function listOwnedConstituentWorkflowsTransitively(parentWorkflow, workflows, options) {
    var opts = options && typeof options === "object" ? options : {};
    var plan = planLearningJourneyCascadeDeletion(parentWorkflow, workflows, opts);
    return Array.isArray(plan.constituents) ? plan.constituents.slice() : [];
  }

  /**
   * Display/sort timestamp for My Workflows.
   *
   * Standalone: stored updatedAt (0 when missing/invalid).
   * Learning Journey: max(parent.updatedAt, ...transitive owned constituents.updatedAt).
   * Does not mutate stored workflow records.
   */
  function resolveWorkflowEffectiveUpdatedAt(workflow, workflows, options) {
    var opts = options && typeof options === "object" ? options : {};
    var own = readWorkflowUpdatedAtMs(workflow);
    if (!workflow || typeof workflow !== "object") return 0;
    if (!isLearningJourneyWorkflowRecord(workflow, opts)) return own;
    var max = own;
    listOwnedConstituentWorkflowsTransitively(workflow, workflows, opts).forEach(function (child) {
      var childMs = readWorkflowUpdatedAtMs(child);
      if (childMs > max) max = childMs;
    });
    return max;
  }

  return {
    isLearningJourneyWorkflowRecord: isLearningJourneyWorkflowRecord,
    readSourceWorkflowId: readSourceWorkflowId,
    readSourceCommissionId: readSourceCommissionId,
    resolveLearningJourneyParentId: resolveLearningJourneyParentId,
    buildLearningJourneyWorkflowListRows: buildLearningJourneyWorkflowListRows,
    isLearningJourneyListExpanded: isLearningJourneyListExpanded,
    setLearningJourneyListExpanded: setLearningJourneyListExpanded,
    resolveSourceLearningJourneyForWorkflow: resolveSourceLearningJourneyForWorkflow,
    listOwnedConstituentWorkflows: listOwnedConstituentWorkflows,
    listOwnedConstituentWorkflowsTransitively: listOwnedConstituentWorkflowsTransitively,
    planLearningJourneyCascadeDeletion: planLearningJourneyCascadeDeletion,
    readWorkflowUpdatedAtMs: readWorkflowUpdatedAtMs,
    resolveWorkflowEffectiveUpdatedAt: resolveWorkflowEffectiveUpdatedAt
  };
});
