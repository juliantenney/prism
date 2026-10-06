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
   * @param {object} [options.expandedById] — { [ljId]: boolean }; default expanded
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
        var expanded = expandedById[id] !== false;
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
        expanded: expandedById[parentId] !== false,
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
    if (!id) return true;
    var map = expandedById && typeof expandedById === "object" ? expandedById : {};
    return map[id] !== false;
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

  return {
    isLearningJourneyWorkflowRecord: isLearningJourneyWorkflowRecord,
    readSourceWorkflowId: readSourceWorkflowId,
    readSourceCommissionId: readSourceCommissionId,
    resolveLearningJourneyParentId: resolveLearningJourneyParentId,
    buildLearningJourneyWorkflowListRows: buildLearningJourneyWorkflowListRows,
    isLearningJourneyListExpanded: isLearningJourneyListExpanded,
    setLearningJourneyListExpanded: setLearningJourneyListExpanded,
    resolveSourceLearningJourneyForWorkflow: resolveSourceLearningJourneyForWorkflow
  };
});
