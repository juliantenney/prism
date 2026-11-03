"use strict";

var sync = require("./math-entry-sync");

var MATHLIVE_VERSION = sync.MATHLIVE_VERSION;
var MATHLIVE_SCRIPT = "lib/mathlive/mathlive.min.js";
var MATHLIVE_CSS = "lib/mathlive/mathlive-fonts.css";

/** Test/regression hook — not for learner-facing UI. */
var MATH_ENTRY_DISABLE_FLAG = "__PRISM_MATH_ENTRY_DISABLE__";

/**
 * Virtual-keyboard policy (S82-G2B):
 * manual — learner opens via in-field keyboard icon; avoids large VK on every focus (G2A).
 */
var VIRTUAL_KEYBOARD_MODE = "manual";

function getMathEntryPresentationCss() {
  return (
    ".util-learner-workspace--math-entry .util-math-entry__mount{display:none;}" +
    ".util-learner-workspace--math-entry.util-learner-workspace--math-enhanced .util-math-entry__mount{" +
    "display:block;min-height:3rem;max-width:100%;margin:.5rem 0;border:1px solid var(--util-border,#ccc);" +
    "border-radius:4px;padding:.25rem;}" +
    ".util-learner-workspace--math-entry.util-learner-workspace--math-enhanced .util-learner-workspace__input--canonical{" +
    "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}" +
    ".util-learner-workspace--math-entry.util-learner-workspace--math-fallback .util-math-entry__mount{display:none;}" +
    ".util-math-entry__hint{font-size:.875rem;color:var(--util-muted,#555);margin:.25rem 0 .5rem;max-width:100%;}" +
    ".util-learner-workspace--math-enhanced .util-math-entry__hint--fallback-only{display:none;}" +
    "math-field.util-math-entry__field{display:block;min-height:2.5rem;max-width:100%;width:100%;font-size:1.05rem;}" +
    "math-field.util-math-entry__field:focus-visible{outline:2px solid var(--util-focus,#2563eb);outline-offset:2px;}"
  );
}

function getMathEntryHeadMarkup() {
  return (
    '<link rel="stylesheet" href="' +
    MATHLIVE_CSS +
    '">' +
    '<script src="' +
    MATHLIVE_SCRIPT +
    '"></script>'
  );
}

/**
 * Sprint 95 M4 — container-scoped math-entry install/dispose.
 * Uses MathLive when present; otherwise enables textarea fallback.
 */
function installMathEntryRuntime(root) {
  if (!root) return { ok: false, dispose: function () {}, mode: "missing-root" };
  if (root.__prismMathEntryRuntime) return root.__prismMathEntryRuntime;

  function q(scope, sel) {
    return scope.querySelector(sel);
  }
  function qa(scope, sel) {
    return Array.prototype.slice.call(scope.querySelectorAll(sel));
  }
  function readLatex(mf) {
    try {
      return mf && typeof mf.getValue === "function" ? String(mf.getValue("latex") || "") : "";
    } catch (e) {
      return "";
    }
  }
  function writeLatex(mf, v) {
    try {
      if (mf && typeof mf.setValue === "function") {
        mf.setValue(String(v == null ? "" : v), { silenceNotifications: true });
        return true;
      }
    } catch (e) {}
    return false;
  }
  function dispatchInput(textarea) {
    try {
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    } catch (e) {}
  }
  function fieldIdFor(workspace) {
    return workspace.getAttribute("data-math-field-id") || "";
  }
  function labelFor(workspace) {
    var labelId = workspace.getAttribute("data-math-label-id") || "";
    if (!labelId) return null;
    var doc = workspace.ownerDocument || (typeof document !== "undefined" ? document : null);
    if (!doc || typeof doc.getElementById !== "function") {
      if (workspace.querySelector) {
        return workspace.querySelector("#" + labelId) || workspace.querySelector('[id="' + labelId + '"]');
      }
      return null;
    }
    return doc.getElementById(labelId);
  }
  function associateLabel(workspace, controlId, isTextarea) {
    var label = labelFor(workspace);
    if (!label || !controlId) return;
    label.setAttribute("for", controlId);
    if (isTextarea) label.removeAttribute("data-math-label-enhanced");
    else label.setAttribute("data-math-label-enhanced", "true");
  }
  function enableTextareaFallback(workspace) {
    if (!workspace) return;
    workspace.classList.remove("util-learner-workspace--math-enhanced");
    workspace.classList.add("util-learner-workspace--math-fallback");
    var textarea = q(workspace, "textarea.util-learner-workspace__input");
    var fieldId = fieldIdFor(workspace);
    if (textarea) {
      textarea.removeAttribute("aria-hidden");
      textarea.removeAttribute("tabindex");
      if (fieldId) textarea.id = fieldId;
    }
    if (fieldId) associateLabel(workspace, fieldId, true);
    var mount = q(workspace, "[data-math-entry-mount]");
    if (mount) {
      mount.innerHTML = "";
      mount.setAttribute("hidden", "hidden");
    }
    workspace.__prismMathfield = null;
  }
  function enhanceWorkspace(workspace, MathfieldElement) {
    var textarea = q(workspace, "textarea.util-learner-workspace__input");
    var mount = q(workspace, "[data-math-entry-mount]");
    var labelId = workspace.getAttribute("data-math-label-id") || "";
    var fieldId = fieldIdFor(workspace);
    if (!textarea || !mount || !MathfieldElement || !fieldId) {
      enableTextareaFallback(workspace);
      return null;
    }
    try {
      var mf = new MathfieldElement();
      mf.className = "util-math-entry__field";
      mf.id = fieldId;
      mf.setAttribute("data-math-entry-field", "true");
      if (labelId) mf.setAttribute("aria-labelledby", labelId);
      mf.setAttribute("virtual-keyboard-mode", VIRTUAL_KEYBOARD_MODE);
      writeLatex(mf, textarea.value);
      mf.addEventListener("input", function () {
        textarea.value = readLatex(mf);
        dispatchInput(textarea);
      });
      mount.innerHTML = "";
      mount.removeAttribute("hidden");
      mount.appendChild(mf);
      textarea.removeAttribute("id");
      textarea.setAttribute("aria-hidden", "true");
      textarea.setAttribute("tabindex", "-1");
      associateLabel(workspace, fieldId, false);
      workspace.classList.add("util-learner-workspace--math-enhanced");
      workspace.classList.remove("util-learner-workspace--math-fallback");
      workspace.__prismMathfield = mf;
      return mf;
    } catch (e) {
      enableTextareaFallback(workspace);
      return null;
    }
  }
  function resyncScoped() {
    qa(root, '[data-input-modality="math"]').forEach(function (ws) {
      var mf = ws.__prismMathfield;
      var textarea = q(ws, "textarea.util-learner-workspace__input");
      if (mf && textarea) writeLatex(mf, textarea.value);
    });
  }
  function onDraftRestored() {
    resyncScoped();
  }

  var mode = "fallback";
  var disabled =
    typeof window !== "undefined" && window[MATH_ENTRY_DISABLE_FLAG] === true;
  var MathfieldElement =
    !disabled &&
    typeof window !== "undefined" &&
    window.MathLive &&
    window.MathLive.MathfieldElement
      ? window.MathLive.MathfieldElement
      : null;
  if (disabled || !MathfieldElement) {
    qa(root, '[data-input-modality="math"]').forEach(enableTextareaFallback);
    mode = "fallback";
  } else {
    qa(root, '[data-input-modality="math"]').forEach(function (ws) {
      enhanceWorkspace(ws, MathfieldElement);
    });
    mode = "enhanced";
  }

  var timers = [];
  if (typeof setTimeout === "function") {
    timers.push(setTimeout(resyncScoped, 0));
    timers.push(setTimeout(resyncScoped, 250));
  }
  if (typeof document !== "undefined" && document.addEventListener) {
    document.addEventListener("prism:learner-draft-restored", onDraftRestored);
  }

  function dispose() {
    if (!root.__prismMathEntryRuntime) return;
    timers.forEach(function (id) {
      if (typeof clearTimeout === "function") clearTimeout(id);
    });
    timers = [];
    if (typeof document !== "undefined" && document.removeEventListener) {
      document.removeEventListener("prism:learner-draft-restored", onDraftRestored);
    }
    qa(root, '[data-input-modality="math"]').forEach(enableTextareaFallback);
    delete root.__prismMathEntryRuntime;
  }

  var api = { ok: true, dispose: dispose, mode: mode, resync: resyncScoped };
  root.__prismMathEntryRuntime = api;
  return api;
}

function disposeMathEntryRuntime(root) {
  if (root && root.__prismMathEntryRuntime && typeof root.__prismMathEntryRuntime.dispose === "function") {
    root.__prismMathEntryRuntime.dispose();
  }
}

function getMathEntryRuntimeScript() {
  return (
    "(function(){" +
    installMathEntryRuntime.toString() +
    disposeMathEntryRuntime.toString() +
    "var MATH_ENTRY_DISABLE_FLAG=" +
    JSON.stringify(MATH_ENTRY_DISABLE_FLAG) +
    ";" +
    "var VIRTUAL_KEYBOARD_MODE=" +
    JSON.stringify(VIRTUAL_KEYBOARD_MODE) +
    ";" +
    "function installOnDocumentTree(){" +
    "var roots=document.querySelectorAll('[data-renderer=\"vnext\"]');" +
    "if(roots&&roots.length){" +
    "Array.prototype.forEach.call(roots,function(root){disposeMathEntryRuntime(root);installMathEntryRuntime(root);});" +
    "return;}" +
    "disposeMathEntryRuntime(document);installMathEntryRuntime(document);" +
    "}" +
    "function boot(){installOnDocumentTree();}" +
    "function resyncAll(){" +
    "var roots=document.querySelectorAll('[data-renderer=\"vnext\"]');" +
    "if(roots&&roots.length){" +
    "Array.prototype.forEach.call(roots,function(root){" +
    "if(root.__prismMathEntryRuntime&&typeof root.__prismMathEntryRuntime.resync==='function')root.__prismMathEntryRuntime.resync();" +
    "});return;}" +
    "if(document.__prismMathEntryRuntime&&typeof document.__prismMathEntryRuntime.resync==='function')document.__prismMathEntryRuntime.resync();" +
    "}" +
    "function init(root){var scope=root||document;disposeMathEntryRuntime(scope);return installMathEntryRuntime(scope);}" +
    "if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();" +
    "window.PRISM_MATH_ENTRY={install:installMathEntryRuntime,dispose:disposeMathEntryRuntime,boot:boot,init:init,resyncAll:resyncAll,version:" +
    JSON.stringify(MATHLIVE_VERSION) +
    ",virtualKeyboardMode:VIRTUAL_KEYBOARD_MODE};" +
    "})();"
  );
}

module.exports = {
  MATHLIVE_VERSION: MATHLIVE_VERSION,
  MATHLIVE_SCRIPT: MATHLIVE_SCRIPT,
  MATHLIVE_CSS: MATHLIVE_CSS,
  MATH_ENTRY_DISABLE_FLAG: MATH_ENTRY_DISABLE_FLAG,
  VIRTUAL_KEYBOARD_MODE: VIRTUAL_KEYBOARD_MODE,
  getMathEntryPresentationCss: getMathEntryPresentationCss,
  getMathEntryHeadMarkup: getMathEntryHeadMarkup,
  getMathEntryRuntimeScript: getMathEntryRuntimeScript,
  installMathEntryRuntime: installMathEntryRuntime,
  disposeMathEntryRuntime: disposeMathEntryRuntime
};
