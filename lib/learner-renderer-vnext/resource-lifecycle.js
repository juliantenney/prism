"use strict";

/**
 * Sprint 95 M1 — mount / unmount a learner resource into a DOM container.
 *
 * Reuses existing draft persistence and Assessment Pack runtimes.
 * Does not change Learning Journey publishing.
 */

var renderLearnerPageHtml = require("./render-learner-page").renderLearnerPageHtml;
var initializeLearnerDraftPersistence =
  require("./learner-draft-persistence").initializeLearnerDraftPersistence;
var disposeLearnerDraftPersistence =
  require("./learner-draft-persistence").disposeLearnerDraftPersistence;
var installAssessmentRuntime = require("./assessment-runtime").installAssessmentRuntime;
var disposeAssessmentRuntime = require("./assessment-runtime").disposeAssessmentRuntime;
var installGuidedReviewRuntime = require("./guided-review-runtime").installGuidedReviewRuntime;
var disposeGuidedReviewRuntime = require("./guided-review-runtime").disposeGuidedReviewRuntime;
var installAssessmentOutput = require("./assessment-output").installAssessmentOutput;
var disposeAssessmentOutput = require("./assessment-output").disposeAssessmentOutput;
var installOrderingRuntime = require("./ordering-runtime").installOrderingRuntime;
var disposeOrderingRuntime = require("./ordering-runtime").disposeOrderingRuntime;
var installMathEntryRuntime = require("./math-entry-runtime").installMathEntryRuntime;
var disposeMathEntryRuntime = require("./math-entry-runtime").disposeMathEntryRuntime;
var installRevisionCriterionRuntime =
  require("./revision-criterion-runtime").installRevisionCriterionRuntime;
var disposeRevisionCriterionRuntime =
  require("./revision-criterion-runtime").disposeRevisionCriterionRuntime;
var sequentialSectionNav = require("./sequential-section-nav");
var installSequentialSectionNav = sequentialSectionNav.installSequentialSectionNav;
var disposeSequentialSectionNav = sequentialSectionNav.disposeSequentialSectionNav;
var enhanceFragmentWithSectionNavigation =
  sequentialSectionNav.enhanceFragmentWithSectionNavigation;

function findRendererRoot(container) {
  if (!container) return null;
  if (container.getAttribute && container.getAttribute("data-renderer") === "vnext") {
    return container;
  }
  if (container.querySelector) {
    return container.querySelector('[data-renderer="vnext"]');
  }
  return null;
}

function clearContainer(container) {
  if (!container) return;
  if (typeof container.replaceChildren === "function") {
    container.replaceChildren();
    return;
  }
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

/**
 * Render a page for container mounting (article landmark, no inlined boot scripts).
 *
 * @param {object} sourcePage
 * @param {{ compositionMode?: string }=} options
 */
function renderLearnerResourceFragment(sourcePage, options) {
  var opts = options && typeof options === "object" ? options : {};
  var rendered = renderLearnerPageHtml(sourcePage, {
    compositionMode: opts.compositionMode || "beats",
    visualAssets: opts.visualAssets || null,
    rootTag: opts.rootTag || "article",
    includeRuntimeScripts: false
  });
  if (!rendered || rendered.error || !rendered.html) return rendered;
  return {
    html: enhanceFragmentWithSectionNavigation(rendered.html, {
      sourcePage: sourcePage,
      model: rendered.modelResult && rendered.modelResult.model
    }),
    error: null,
    modelResult: rendered.modelResult,
    composedResult: rendered.composedResult,
    visualAssetDiagnostics: rendered.visualAssetDiagnostics || null
  };
}

/**
 * Mount resource HTML (or a rendered page) into container and initialise runtimes.
 *
 * @param {Element} container
 * @param {{
 *   html?: string,
 *   sourcePage?: object,
 *   compositionMode?: string,
 *   rootTag?: "article"|"main",
 *   storage?: object,
 *   pageKey?: string,
 *   debounceMs?: number,
 *   root?: Element
 * }} options
 * @returns {{ ok: boolean, root: Element|null, draft: object|null, unmount: Function, reason?: string }}
 */
function mountLearnerResource(container, options) {
  var opts = options && typeof options === "object" ? options : {};
  if (!container) {
    return {
      ok: false,
      root: null,
      draft: null,
      reason: "missing-container",
      unmount: function () {}
    };
  }

  var html = typeof opts.html === "string" ? opts.html : "";
  if (!html && opts.sourcePage) {
    var rendered = renderLearnerResourceFragment(opts.sourcePage, opts);
    if (rendered.error || !rendered.html) {
      return {
        ok: false,
        root: null,
        draft: null,
        reason: rendered.error || "render-failed",
        unmount: function () {}
      };
    }
    html = rendered.html;
  }

  var root = opts.root || null;
  if (!root) {
    if (typeof container.innerHTML === "string" || "innerHTML" in container) {
      container.innerHTML = html;
      root = findRendererRoot(container);
    }
  }
  if (!root) {
    return {
      ok: false,
      root: null,
      draft: null,
      reason: "missing-renderer-root",
      unmount: function () {}
    };
  }

  var draftOpts = {};
  if (Object.prototype.hasOwnProperty.call(opts, "storage")) {
    draftOpts.storage = opts.storage;
  }
  if (Object.prototype.hasOwnProperty.call(opts, "pageKey")) {
    draftOpts.pageKey = opts.pageKey;
  }
  if (Object.prototype.hasOwnProperty.call(opts, "debounceMs")) {
    draftOpts.debounceMs = opts.debounceMs;
  }
  var draft = initializeLearnerDraftPersistence(root, draftOpts);
  var assessment = installAssessmentRuntime(root);
  var guided = installGuidedReviewRuntime(root);
  var output = installAssessmentOutput(root);
  var ordering = installOrderingRuntime(root);
  var mathEntry = installMathEntryRuntime(root);
  var revisionCriterion = installRevisionCriterionRuntime(root);
  var sectionNav = installSequentialSectionNav(root);

  var disposed = false;
  function unmount() {
    if (disposed) return { ok: true, alreadyDisposed: true };
    disposed = true;
    if (draft && typeof draft.flushPendingSave === "function") {
      draft.flushPendingSave();
    }
    if (draft && typeof draft.dispose === "function") {
      draft.dispose();
    } else {
      disposeLearnerDraftPersistence(root);
    }
    if (assessment && typeof assessment.dispose === "function") assessment.dispose();
    else disposeAssessmentRuntime(root);
    if (guided && typeof guided.dispose === "function") guided.dispose();
    else disposeGuidedReviewRuntime(root);
    if (output && typeof output.dispose === "function") output.dispose();
    else disposeAssessmentOutput(root);
    if (ordering && typeof ordering.dispose === "function") ordering.dispose();
    else disposeOrderingRuntime(root);
    if (mathEntry && typeof mathEntry.dispose === "function") mathEntry.dispose();
    else disposeMathEntryRuntime(root);
    if (revisionCriterion && typeof revisionCriterion.dispose === "function") {
      revisionCriterion.dispose();
    } else {
      disposeRevisionCriterionRuntime(root);
    }
    if (sectionNav && typeof sectionNav.dispose === "function") sectionNav.dispose();
    else disposeSequentialSectionNav(root);
    clearContainer(container);
    return { ok: true, alreadyDisposed: false };
  }

  return {
    ok: true,
    root: root,
    draft: draft && draft.ok ? draft : draft,
    assessment: assessment,
    guidedReview: guided,
    assessmentOutput: output,
    ordering: ordering,
    mathEntry: mathEntry,
    revisionCriterion: revisionCriterion,
    sequentialSectionNav: sectionNav,
    unmount: unmount
  };
}

function unmountLearnerResource(handle) {
  if (!handle || typeof handle.unmount !== "function") {
    return { ok: false, reason: "missing-handle" };
  }
  return handle.unmount();
}

module.exports = {
  renderLearnerResourceFragment: renderLearnerResourceFragment,
  mountLearnerResource: mountLearnerResource,
  unmountLearnerResource: unmountLearnerResource,
  findRendererRoot: findRendererRoot,
  enhanceFragmentWithSectionNavigation: enhanceFragmentWithSectionNavigation,
  installSequentialSectionNav: installSequentialSectionNav,
  disposeSequentialSectionNav: disposeSequentialSectionNav
};
