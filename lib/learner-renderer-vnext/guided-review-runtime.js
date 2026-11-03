"use strict";

/**
 * Progressive enhancement for guided-review checklists.
 * One criterion at a time with Previous/Next; no auto-advance.
 * Focus stays on the activated nav button; status announced politely.
 *
 * Sprint 95 M1: container-scoped install/dispose.
 */

function installGuidedReviewRuntime(root) {
  if (!root) return { ok: false, dispose: function () {} };
  if (root.__prismGuidedReviewRuntime) return root.__prismGuidedReviewRuntime;

  function qa(scope, sel) {
    return Array.prototype.slice.call(scope.querySelectorAll(sel));
  }
  function q(scope, sel) {
    return scope.querySelector(sel);
  }
  function setPanelState(panel, active) {
    if (!panel) return;
    if (active) {
      panel.hidden = false;
      panel.removeAttribute("inert");
      panel.setAttribute("data-active", "true");
    } else {
      panel.hidden = true;
      panel.setAttribute("inert", "");
      panel.removeAttribute("data-active");
    }
  }
  function sync(reviewRoot, index, announce) {
    var panels = qa(reviewRoot, "[data-guided-review-index]");
    var total = panels.length;
    if (!total) return;
    var safe = Math.max(0, Math.min(index, total - 1));
    reviewRoot.setAttribute("data-guided-review-active", String(safe));
    panels.forEach(function (panel) {
      var i = Number(panel.getAttribute("data-guided-review-index") || 0);
      setPanelState(panel, i === safe);
    });
    var prev = q(reviewRoot, "[data-guided-review-prev]");
    var next = q(reviewRoot, "[data-guided-review-next]");
    if (prev) prev.disabled = safe === 0;
    if (next) next.disabled = safe >= total - 1;
    var panel = q(reviewRoot, '[data-guided-review-index="' + safe + '"]');
    var progress = panel ? q(panel, "[data-guided-review-progress]") : null;
    var status = q(reviewRoot, "[data-guided-review-status]");
    if (announce && status && progress) {
      status.textContent = progress.textContent || "Criterion " + (safe + 1) + " of " + total;
    }
  }
  function enhance(reviewRoot) {
    if (!reviewRoot || reviewRoot.getAttribute("data-guided-review-enhanced") === "true") return;
    var panels = qa(reviewRoot, "[data-guided-review-index]");
    if (panels.length < 2) return;
    var nav = q(reviewRoot, "[data-guided-review-nav]");
    if (nav) nav.hidden = false;
    reviewRoot.setAttribute("data-guided-review-enhanced", "true");
    sync(reviewRoot, 0, false);
  }
  function eventInScope(event) {
    var target = event && event.target;
    if (!target) return false;
    if (root === target) return true;
    if (root.nodeType === 9) return true;
    if (typeof document !== "undefined" && root === document) return true;
    if (typeof root.contains === "function") return root.contains(target);
    return true;
  }
  function onClick(event) {
    if (!eventInScope(event)) return;
    var btn =
      event.target && event.target.closest
        ? event.target.closest("[data-guided-review-prev],[data-guided-review-next]")
        : null;
    if (!btn || btn.disabled) return;
    var reviewRoot = btn.closest('[data-guided-review="true"]');
    if (!reviewRoot) return;
    event.preventDefault();
    var current = Number(reviewRoot.getAttribute("data-guided-review-active") || 0);
    var delta = btn.hasAttribute("data-guided-review-next") ? 1 : -1;
    sync(reviewRoot, current + delta, true);
    try {
      btn.focus();
    } catch (e) {}
  }
  function onReturn(event) {
    if (!eventInScope(event)) return;
    var link =
      event.target && event.target.closest
        ? event.target.closest("[data-assessment-return-to-response]")
        : null;
    if (!link) return;
    var id = String(link.getAttribute("data-assessment-return-to-response") || "").replace(/"/g, "");
    if (!id) return;
    var field = q(root, '[id="' + id.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"]');
    if (!field && root.getElementById) field = root.getElementById(id);
    if (!field) return;
    if (event.preventDefault) event.preventDefault();
    try {
      field.focus();
    } catch (e) {}
  }

  qa(root, '[data-guided-review="true"]').forEach(enhance);
  root.addEventListener("click", onClick);
  root.addEventListener("click", onReturn);

  function dispose() {
    if (!root.__prismGuidedReviewRuntime) return;
    if (typeof root.removeEventListener === "function") {
      root.removeEventListener("click", onClick);
      root.removeEventListener("click", onReturn);
    }
    delete root.__prismGuidedReviewRuntime;
  }

  var api = { ok: true, dispose: dispose };
  root.__prismGuidedReviewRuntime = api;
  return api;
}

function disposeGuidedReviewRuntime(root) {
  if (root && root.__prismGuidedReviewRuntime && typeof root.__prismGuidedReviewRuntime.dispose === "function") {
    root.__prismGuidedReviewRuntime.dispose();
  }
}

function getGuidedReviewRuntimeScript() {
  return (
    "(function(){" +
    installGuidedReviewRuntime.toString() +
    disposeGuidedReviewRuntime.toString() +
    "function boot(){" +
    "var roots=document.querySelectorAll('[data-renderer=\"vnext\"]');" +
    "if(roots&&roots.length){Array.prototype.forEach.call(roots,function(root){installGuidedReviewRuntime(root);});return;}" +
    "installGuidedReviewRuntime(document);" +
    "}" +
    "if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);" +
    "else boot();" +
    "})();"
  );
}

module.exports = {
  installGuidedReviewRuntime: installGuidedReviewRuntime,
  disposeGuidedReviewRuntime: disposeGuidedReviewRuntime,
  getGuidedReviewRuntimeScript: getGuidedReviewRuntimeScript
};
