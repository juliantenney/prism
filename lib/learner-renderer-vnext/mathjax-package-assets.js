"use strict";

/**
 * MathJax display-maths learner-package asset collector (Node fs + browser fetch).
 * Minimum offline set for pinned tex-chtml@3.2.2 (matches utilities export bootstrap).
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_MATHJAX_PACKAGE_ASSETS = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var MATHJAX_VERSION = "3.2.2";
  var MATHJAX_ASSET_ROOT = "lib/mathjax";
  var MATHJAX_ES5_ROOT = MATHJAX_ASSET_ROOT + "/es5";
  var MATHJAX_LOADER_REL = "es5/tex-chtml.js";
  var MATHJAX_PACKAGE_LOADER_PATH = MATHJAX_ES5_ROOT + "/tex-chtml.js";
  var MATHJAX_CDN_LOADER_SRC =
    "https://cdn.jsdelivr.net/npm/mathjax@" + MATHJAX_VERSION + "/es5/tex-chtml.js";
  var MATHJAX_EXPORT_BOOTSTRAP_MARKER = "prism-mathjax-export-bootstrap";
  var MATHJAX_EXPORT_LOADER_ID = "prism-mathjax-export-loader";

  var WOFF_FILES = [
    "MathJax_AMS-Regular.woff",
    "MathJax_Calligraphic-Bold.woff",
    "MathJax_Calligraphic-Regular.woff",
    "MathJax_Fraktur-Bold.woff",
    "MathJax_Fraktur-Regular.woff",
    "MathJax_Main-Bold.woff",
    "MathJax_Main-Italic.woff",
    "MathJax_Main-Regular.woff",
    "MathJax_Math-BoldItalic.woff",
    "MathJax_Math-Italic.woff",
    "MathJax_Math-Regular.woff",
    "MathJax_SansSerif-Bold.woff",
    "MathJax_SansSerif-Italic.woff",
    "MathJax_SansSerif-Regular.woff",
    "MathJax_Script-Regular.woff",
    "MathJax_Size1-Regular.woff",
    "MathJax_Size2-Regular.woff",
    "MathJax_Size3-Regular.woff",
    "MathJax_Size4-Regular.woff",
    "MathJax_Typewriter-Regular.woff",
    "MathJax_Vector-Bold.woff",
    "MathJax_Vector-Regular.woff",
    "MathJax_Zero.woff"
  ];

  var MATHJAX_PACKAGE_FILES = [
    MATHJAX_LOADER_REL,
    "es5/output/chtml/fonts/tex.js"
  ].concat(
    WOFF_FILES.map(function (name) {
      return "es5/output/chtml/fonts/woff-v2/" + name;
    })
  );

  function containsSupportedMathDelimiters(htmlOrText) {
    var text = String(htmlOrText == null ? "" : htmlOrText);
    if (!text) return false;
    return /\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/.test(text);
  }

  function pageHtmlNeedsMathJaxDisplay(html) {
    var text = String(html == null ? "" : html);
    if (!text) return false;
    if (text.indexOf(MATHJAX_EXPORT_BOOTSTRAP_MARKER) >= 0) return true;
    if (text.indexOf(MATHJAX_CDN_LOADER_SRC) >= 0) return true;
    if (text.indexOf(MATHJAX_PACKAGE_LOADER_PATH) >= 0) return true;
    return containsSupportedMathDelimiters(text);
  }

  function mimeForRelativePath(rel) {
    if (rel.endsWith(".js")) return "text/javascript";
    if (rel.endsWith(".woff")) return "font/woff";
    if (rel.endsWith(".woff2")) return "font/woff2";
    return "application/octet-stream";
  }

  function packagePathForRelative(rel) {
    return MATHJAX_ASSET_ROOT + "/" + String(rel || "").replace(/\\/g, "/");
  }

  function resolveRepoRoot(repoRoot) {
    var path = require("path");
    if (repoRoot) return path.resolve(repoRoot);
    return path.resolve(__dirname, "..", "..");
  }

  function collectMathJaxPackageAssets(options) {
    if (typeof require !== "function") {
      throw new Error(
        "collectMathJaxPackageAssets requires Node; use fetchMathJaxPackageAssets in the browser."
      );
    }
    var fs = require("fs");
    var path = require("path");
    var opts = options && typeof options === "object" ? options : {};
    var root = resolveRepoRoot(opts.repoRoot);
    var assets = [];

    MATHJAX_PACKAGE_FILES.forEach(function (rel) {
      var abs = path.join(root, MATHJAX_ASSET_ROOT, rel.replace(/\//g, path.sep));
      if (!fs.existsSync(abs)) {
        throw new Error("Missing MathJax package asset: " + packagePathForRelative(rel));
      }
      assets.push({
        path: packagePathForRelative(rel),
        bytes: fs.readFileSync(abs),
        mime: mimeForRelativePath(rel)
      });
    });

    return assets;
  }

  function fetchMathJaxPackageAssets(baseUrl) {
    if (typeof fetch !== "function") {
      return Promise.reject(new Error("fetch is unavailable for MathJax packaging."));
    }
    var base = String(baseUrl == null ? "" : baseUrl);
    if (base && base.charAt(base.length - 1) !== "/") {
      base += "/";
    }
    return Promise.all(
      MATHJAX_PACKAGE_FILES.map(function (rel) {
        var url = base + MATHJAX_ASSET_ROOT + "/" + rel.replace(/\\/g, "/");
        return fetch(url)
          .then(function (response) {
            if (!response || !response.ok) {
              throw new Error(
                "Failed to fetch MathJax package asset (" +
                  (response ? response.status : "no response") +
                  "): " +
                  url
              );
            }
            return response.arrayBuffer();
          })
          .then(function (buffer) {
            return {
              path: packagePathForRelative(rel),
              bytes: new Uint8Array(buffer),
              mime: mimeForRelativePath(rel)
            };
          });
      })
    );
  }

  function rewriteMathJaxLoaderToPackagePath(html) {
    var out = String(html == null ? "" : html);
    if (!out || out.indexOf(MATHJAX_CDN_LOADER_SRC) === -1) return out;
    return out.split(MATHJAX_CDN_LOADER_SRC).join(MATHJAX_PACKAGE_LOADER_PATH);
  }

  function listReferencedMathJaxPathsInHtml(html) {
    var text = String(html == null ? "" : html);
    var paths = [];
    if (text.indexOf(MATHJAX_PACKAGE_LOADER_PATH) >= 0) {
      paths.push(MATHJAX_PACKAGE_LOADER_PATH);
    }
    return paths;
  }

  return {
    MATHJAX_VERSION: MATHJAX_VERSION,
    MATHJAX_ASSET_ROOT: MATHJAX_ASSET_ROOT,
    MATHJAX_ES5_ROOT: MATHJAX_ES5_ROOT,
    MATHJAX_PACKAGE_LOADER_PATH: MATHJAX_PACKAGE_LOADER_PATH,
    MATHJAX_CDN_LOADER_SRC: MATHJAX_CDN_LOADER_SRC,
    MATHJAX_EXPORT_BOOTSTRAP_MARKER: MATHJAX_EXPORT_BOOTSTRAP_MARKER,
    MATHJAX_EXPORT_LOADER_ID: MATHJAX_EXPORT_LOADER_ID,
    MATHJAX_PACKAGE_FILES: MATHJAX_PACKAGE_FILES,
    containsSupportedMathDelimiters: containsSupportedMathDelimiters,
    pageHtmlNeedsMathJaxDisplay: pageHtmlNeedsMathJaxDisplay,
    collectMathJaxPackageAssets: collectMathJaxPackageAssets,
    fetchMathJaxPackageAssets: fetchMathJaxPackageAssets,
    rewriteMathJaxLoaderToPackagePath: rewriteMathJaxLoaderToPackagePath,
    listReferencedMathJaxPathsInHtml: listReferencedMathJaxPathsInHtml
  };
});
