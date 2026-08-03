/**
 * Inject the vNext export-runtime (draft persistence API) into standalone HTML.
 * Source of truth: lib/learner-renderer-vnext-export-runtime.js (built artefact).
 */
(function (root, factory) {
  "use strict";
  var api = factory(root);
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_LEARNER_VNEXT_STANDALONE_EMBED = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function (root) {
  "use strict";

  var MARKER_ATTR = "data-prism-vnext-export-runtime";
  var BOOT_NEEDLE = "initializeLearnerDraftPersistence";

  function readRuntimeSourceFromDisk() {
    if (typeof require !== "function") return "";
    try {
      var fs = require("fs");
      var path = require("path");
      var runtimePath = path.join(__dirname, "learner-renderer-vnext-export-runtime.js");
      if (fs.existsSync(runtimePath)) {
        return fs.readFileSync(runtimePath, "utf8");
      }
    } catch (_err) {}
    try {
      var mod = require("./learner-renderer-vnext-export-runtime-source.js");
      if (mod && typeof mod.source === "string") return mod.source;
    } catch (_err2) {}
    return "";
  }

  function getExportRuntimeSource() {
    if (root && typeof root.PRISM_VNEXT_EXPORT_RUNTIME_SOURCE === "string") {
      var fromGlobal = root.PRISM_VNEXT_EXPORT_RUNTIME_SOURCE;
      if (fromGlobal) return fromGlobal;
    }
    return readRuntimeSourceFromDisk();
  }

  function pageNeedsExportRuntime(html) {
    var source = String(html == null ? "" : html);
    if (!source) return false;
    if (source.indexOf(BOOT_NEEDLE) >= 0) return true;
    if (source.indexOf("data-learner-draft-controls") >= 0) return true;
    if (source.indexOf("data-persistence-page-key") >= 0) return true;
    return false;
  }

  function escapeScriptContent(source) {
    return String(source || "").replace(/<\/script/gi, "<\\/script");
  }

  function buildExportRuntimeScriptTag(sourceText) {
    var source = String(sourceText || "");
    if (!source) return "";
    return (
      "<script " +
      MARKER_ATTR +
      '="true">' +
      escapeScriptContent(source) +
      "</script>"
    );
  }

  function getStandaloneVnextExportRuntimeScriptTag() {
    return buildExportRuntimeScriptTag(getExportRuntimeSource());
  }

  /**
   * Ensure the persistence API script appears once, before draft boot executes.
   * Inserts immediately after the opening <body> tag when needed.
   */
  function injectStandaloneVnextExportRuntime(html) {
    var source = String(html == null ? "" : html);
    if (!source) return source;
    if (source.indexOf(MARKER_ATTR + "=") >= 0 || source.indexOf(MARKER_ATTR + " =") >= 0) {
      return source;
    }
    if (!pageNeedsExportRuntime(source)) return source;
    var tag = getStandaloneVnextExportRuntimeScriptTag();
    if (!tag) return source;
    if (/<body\b[^>]*>/i.test(source)) {
      return source.replace(/<body\b[^>]*>/i, function (open) {
        return open + tag;
      });
    }
    return tag + source;
  }

  return {
    MARKER_ATTR: MARKER_ATTR,
    pageNeedsExportRuntime: pageNeedsExportRuntime,
    getExportRuntimeSource: getExportRuntimeSource,
    getStandaloneVnextExportRuntimeScriptTag: getStandaloneVnextExportRuntimeScriptTag,
    injectStandaloneVnextExportRuntime: injectStandaloneVnextExportRuntime
  };
});
