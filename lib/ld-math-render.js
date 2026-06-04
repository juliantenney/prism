/**
 * LD-MATH-RENDER — canonical L7 math-safe TeX output contract (Sprint 38-B Wave 1).
 * Lifecycle: canonical (Wave 1 exit, 2026-06-04).
 * Taxonomy: cluster 8, layer L7 ([38B-2]).
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_LD_MATH_RENDER = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var MODULE_ID = "LD-MATH-RENDER";
  var MARKER = "LD-MATH-RENDER (auto-applied)";
  /** @deprecated PR-W1-3 — probe/tests may still match legacy title */
  var LEGACY_MARKER = "Math notation output contract (auto-applied)";

  var CORE_LINES = [
    "",
    MARKER + ":",
    "- Module: " + MODULE_ID + " | Layer: L7 | Scope: learner-facing prose and JSON string values | Cluster: 8 (maths rendering)",
    "- When mathematical notation is needed in learner-facing text, activities, materials, assessment stems/options/explanations, or composed page content, use renderer-supported TeX delimiters only.",
    "- Inline maths: use \\(...\\) (for example \\(x^2 + y^2\\)).",
    "- Display/block equations: use \\[...\\] on their own lines where block layout is intended.",
    "- Do NOT use $...$ or $$...$$ delimiters.",
    "- Do NOT wrap equations in code spans, code fences, or backtick markdown.",
    "- In JSON string values, escape math-delimiter backslashes so JSON stays valid (write \\\\(...\\\\) and \\\\[...\\\\] in raw JSON text).",
    "- Do NOT HTML-escape math delimiters or backslashes (avoid entities such as &#92; or &lpar;).",
    "- Prefer supported TeX when formulae, symbols, fractions, subscripts, or Greek letters aid clarity; do not force maths into plain prose.",
    "- Maths is presentational notation only; do not imply symbolic solving, automated checking, or CAS capabilities.",
    "- Pipe tables and table-shaped materials.* values follow LD-TABLE-FIDELITY — never code-fence or wrap pipe-table rows in TeX delimiters."
  ];

  function buildLdMathRenderPromptBlock(options) {
    var opts = options && typeof options === "object" ? options : {};
    var includeMarker = opts.includeMarker !== false;
    return (includeMarker ? CORE_LINES.slice() : CORE_LINES.slice(2)).join("\n");
  }

  /** @deprecated Use buildLdMathRenderPromptBlock — returns same text with legacy marker for transitional callers */
  function buildMathSafeOutputContractPromptBlock() {
    return buildLdMathRenderPromptBlock({ includeMarker: false }).replace(
      MARKER + ":",
      LEGACY_MARKER + ":"
    );
  }

  function markerRegex() {
    return /LD-MATH-RENDER \(auto-applied\)|Math notation output contract \(auto-applied\)/i;
  }

  function moduleIdInTextRegex() {
    return /LD-MATH-RENDER \| Layer: L7/i;
  }

  return {
    MODULE_ID: MODULE_ID,
    MARKER: MARKER,
    LEGACY_MARKER: LEGACY_MARKER,
    buildLdMathRenderPromptBlock: buildLdMathRenderPromptBlock,
    buildMathSafeOutputContractPromptBlock: buildMathSafeOutputContractPromptBlock,
    markerRegex: markerRegex,
    moduleIdInTextRegex: moduleIdInTextRegex
  };
});
