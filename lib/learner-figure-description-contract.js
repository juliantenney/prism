/**
 * Textbook-style instructional figure description contract.
 * Shared by Design Page authoring, visual briefs, asset association, and vNext rendering.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_LEARNER_FIGURE_DESCRIPTION_CONTRACT = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var CONTRACT_VERSION = "70-FIGURE-DESC-1";
  var ALT_TEXT_MAX_CHARS = 140;
  var DETAILED_DESCRIPTION_SOFT_MIN = 300;
  var DETAILED_DESCRIPTION_SOFT_MAX = 600;

  var PRODUCTION_DETAIL_RE =
    /\b(photorealistic|cinematic|camera|lens|bokeh|octane|unreal|midjourney|dall-?e|stable diffusion|4k|8k|render(ing)?|vector art|flat design|pastel|neon|gradient background|white background|isometric 3d)\b/i;

  function asTrimmedString(value) {
    return String(value == null ? "" : value).trim();
  }

  function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
  }

  function normalizeWhitespace(text) {
    return String(text || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  /**
   * Concise alt text: never mid-word truncate. Prefer authored alt; else derive.
   */
  function buildConciseAltText(spec) {
    var source = spec && typeof spec === "object" ? spec : {};
    var authored = normalizeWhitespace(source.alt_text || source.altText || "");
    if (authored) return clipAltTextAtBoundary(authored, ALT_TEXT_MAX_CHARS);

    var subject = normalizeWhitespace(source.subject || "");
    var purpose = normalizeWhitespace(source.purpose || source.caption_intent || "");
    var base = subject
      ? subject + (purpose ? " — " + purpose : "")
      : purpose || "Instructional figure";
    if (!/detailed description follows/i.test(base)) {
      base = base.replace(/[.]+$/, "") + "; detailed description follows.";
    }
    return clipAltTextAtBoundary(base, ALT_TEXT_MAX_CHARS);
  }

  function clipAltTextAtBoundary(text, maxChars) {
    var value = normalizeWhitespace(text);
    if (value.length <= maxChars) return value;
    var slice = value.slice(0, maxChars);
    var boundary = Math.max(slice.lastIndexOf(" "), slice.lastIndexOf(","), slice.lastIndexOf(";"));
    if (boundary < Math.floor(maxChars * 0.55)) {
      // Prefer ending at a word if possible; otherwise hard-stop without splitting UTF-16 mid-pair carelessly.
      boundary = maxChars;
      while (boundary > 0 && /[A-Za-z0-9]/.test(value.charAt(boundary))) boundary -= 1;
      if (boundary < Math.floor(maxChars * 0.4)) boundary = maxChars;
    }
    return normalizeWhitespace(slice.slice(0, boundary)).replace(/[,:;.-]+$/, "") + "…";
  }

  function looksLikeProductionPrompt(text) {
    return PRODUCTION_DETAIL_RE.test(String(text || ""));
  }

  function diagnoseFigureDescriptionQuality(spec, options) {
    var opts = options || {};
    var source = spec && typeof spec === "object" ? spec : {};
    var diagnostics = [];
    var alt = asTrimmedString(source.alt_text || source.altText || "");
    var detailed = asTrimmedString(source.detailed_description || source.detailedDescription || "");
    var substantive = opts.substantive !== false;

    if (substantive && !detailed) {
      diagnostics.push({
        code: "FIGURE_DETAILED_DESCRIPTION_MISSING",
        severity: "warn",
        message:
          "Substantive instructional figure is missing detailed_description (learner-facing textbook description)."
      });
    }
    if (alt && alt.length > ALT_TEXT_MAX_CHARS) {
      diagnostics.push({
        code: "FIGURE_ALT_TEXT_TOO_LONG",
        severity: "warn",
        message: "alt_text exceeds " + ALT_TEXT_MAX_CHARS + " characters (" + alt.length + ")."
      });
    }
    if (detailed && looksLikeProductionPrompt(detailed)) {
      diagnostics.push({
        code: "FIGURE_DESCRIPTION_LOOKS_LIKE_PROMPT",
        severity: "warn",
        message:
          "detailed_description appears to include image-generation/production language; use learner-facing instructional prose."
      });
    }
    if (
      detailed &&
      detailed.length < DETAILED_DESCRIPTION_SOFT_MIN &&
      opts.warnShortDescription !== false &&
      Array.isArray(source.must_show) &&
      source.must_show.length >= 3
    ) {
      diagnostics.push({
        code: "FIGURE_DESCRIPTION_SHORT_FOR_RICH_SPEC",
        severity: "warn",
        message:
          "detailed_description is short relative to an information-rich must_show list; aim for about " +
          DETAILED_DESCRIPTION_SOFT_MIN +
          "–" +
          DETAILED_DESCRIPTION_SOFT_MAX +
          " characters when the figure is dense."
      });
    }
    if (detailed && /^figure\s*\d+\s*[.:]/i.test(detailed)) {
      diagnostics.push({
        code: "FIGURE_DESCRIPTION_CONTAINS_NUMBER_LABEL",
        severity: "warn",
        message: "Do not put 'Figure N.' inside detailed_description; numbering is renderer-owned."
      });
    }
    return { ok: diagnostics.length === 0, diagnostics: diagnostics };
  }

  function buildFigureDescriptionAuthoringGuidanceLines() {
    return [
      "- For each generate visual, author three related learner/image values from the SAME semantic specification (must_show, context, relationships, purpose):",
      '  - alt_text: concise learner alt, maximum ~' +
        ALT_TEXT_MAX_CHARS +
        " characters; identify the figure and instructional purpose; signpost that a detailed description follows; do not paste the full detailed_description.",
      "  - detailed_description: visible learner-facing textbook prose for beneath the figure (normally " +
        DETAILED_DESCRIPTION_SOFT_MIN +
        "–" +
        DETAILED_DESCRIPTION_SOFT_MAX +
        " characters for information-rich figures; shorter is fine for simpler figures).",
      "  - caption_intent: short caption guidance for image generation (not a substitute for detailed_description).",
      "- CRITICAL: also keep a non-empty rationale on every visual_affordances[] row. rationale is NOT optional and is NOT replaced by alt_text, detailed_description, caption_intent, or pedagogical_added_value.",
      "- rationale must explain why the visual materially supports the learning/reasoning task (e.g. making a sequence inspectable, showing component relationships, supporting comparison, externalising a system/causal model, reducing avoidable working-memory load). Do not merely restate the title, visual type, or activity topic.",
      "- detailed_description MUST describe instructional content: significant labels, stages, relationships, directions, comparisons, and conclusions needed to understand the figure.",
      "- detailed_description MUST NOT include image-generation style, colour recipes, layout commands, camera language, or rendering terminology.",
      "- detailed_description MUST NOT introduce claims absent from the visual specification or invent certainty beyond source material.",
      "- Do NOT put 'Figure 1.' (or any Figure N.) inside detailed_description — numbering is added by the learner renderer.",
      "- Do NOT copy detailed_description into rationale (or vice versa).",
      "- Example alt_text: \"HCV entry pathway from receptor attachment to RNA release; detailed description follows.\"",
      "- Decorative_only / skip / defer rows: do not invent detailed_description; still require rationale for the decision."
    ];
  }

  return {
    CONTRACT_VERSION: CONTRACT_VERSION,
    ALT_TEXT_MAX_CHARS: ALT_TEXT_MAX_CHARS,
    DETAILED_DESCRIPTION_SOFT_MIN: DETAILED_DESCRIPTION_SOFT_MIN,
    DETAILED_DESCRIPTION_SOFT_MAX: DETAILED_DESCRIPTION_SOFT_MAX,
    buildConciseAltText: buildConciseAltText,
    clipAltTextAtBoundary: clipAltTextAtBoundary,
    diagnoseFigureDescriptionQuality: diagnoseFigureDescriptionQuality,
    buildFigureDescriptionAuthoringGuidanceLines: buildFigureDescriptionAuthoringGuidanceLines,
    looksLikeProductionPrompt: looksLikeProductionPrompt,
    isNonEmptyString: isNonEmptyString
  };
});
