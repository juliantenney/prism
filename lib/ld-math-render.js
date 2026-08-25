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
    "- Pipe tables and table-shaped materials.* values follow LD-TABLE-FIDELITY — never code-fence or wrap pipe-table rows in TeX delimiters.",
    "- Math spans must be intact TeX only: never interleave numbered steps, instructional prose, or truncated symbols inside \\(...\\) or \\[...\\].",
    "- Keep delimiters balanced (every \\[ has a matching \\]; every \\( has a matching \\)) and keep each equation contiguous.",
    "- Labels, units, and explanations belong outside math delimiters; inside \\(...\\) and \\[...\\] use contiguous mathematical notation only — do not wrap instructional prose in \\text{...}. Write the label in surrounding Markdown and keep the math span to symbols, variables, and numeric expressions."
  ];

  function buildLdMathRenderPromptBlock(options) {
    var opts = options && typeof options === "object" ? options : {};
    var includeMarker = opts.includeMarker !== false;
    return (includeMarker ? CORE_LINES.slice() : CORE_LINES.slice(2)).join("\n");
  }

  function markerRegex() {
    return /LD-MATH-RENDER \(auto-applied\)|Math notation output contract \(auto-applied\)/i;
  }

  function moduleIdInTextRegex() {
    return /LD-MATH-RENDER \| Layer: L7/i;
  }

  function pushIssue(issues, code, message) {
    issues.push({ code: code, message: String(message || code) });
  }

  function inspectMathSpanInterior(interior, kind) {
    var issues = [];
    var body = String(interior == null ? "" : interior);
    if (!body) return issues;

    // Instructional prose interleaved into TeX (e.g. "that multiply to 6").
    if (/\b[a-z]{3,}(?:\s+[a-z]{2,}){2,}\b/i.test(body)) {
      pushIssue(
        issues,
        "PROSE_INSIDE_MATH",
        kind + " math contains instructional prose; keep TeX contiguous"
      );
    }

    // Numbered step markers must stay outside math spans.
    if (/(^|\n)\s*\d+\.\s+\S/.test(body)) {
      pushIssue(
        issues,
        "LIST_MARKER_INSIDE_MATH",
        kind + " math contains a numbered list marker"
      );
    }

    // Truncated grouping such as "(x[" from collapsed factor forms.
    if (/\([A-Za-z]\s*\[/.test(body)) {
      pushIssue(
        issues,
        "TRUNCATED_GROUP_OPENER",
        kind + " math has a truncated group opener (e.g. (x[)"
      );
    }

    return issues;
  }

  /**
   * Fail-closed integrity check for learner-facing markdown/JSON string values.
   * Detects unbalanced delimiters and garbling inside matched math spans.
   * Does not rewrite content.
   */
  function validateLearnerFacingMathIntegrity(text) {
    var source = String(text == null ? "" : text);
    var issues = [];
    if (!source) {
      return { ok: true, issues: issues };
    }

    var remainder = source;
    var spans = [];

    remainder = remainder.replace(/\\\[([\s\S]*?)\\\]/g, function (full, interior) {
      spans.push({ kind: "display", interior: interior });
      return "\0";
    });
    remainder = remainder.replace(/\\\(([\s\S]*?)\\\)/g, function (full, interior) {
      spans.push({ kind: "inline", interior: interior });
      return "\0";
    });

    if (/\\[\[()\]]/.test(remainder)) {
      pushIssue(
        issues,
        "UNBALANCED_MATH_DELIMITERS",
        "Unbalanced TeX delimiters (\\( \\) \\[ \\])"
      );
    }

    spans.forEach(function (span) {
      inspectMathSpanInterior(span.interior, span.kind).forEach(function (issue) {
        issues.push(issue);
      });
    });

    return { ok: issues.length === 0, issues: issues };
  }

  return {
    MODULE_ID: MODULE_ID,
    MARKER: MARKER,
    buildLdMathRenderPromptBlock: buildLdMathRenderPromptBlock,
    markerRegex: markerRegex,
    moduleIdInTextRegex: moduleIdInTextRegex,
    validateLearnerFacingMathIntegrity: validateLearnerFacingMathIntegrity
  };
});
