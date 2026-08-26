/**
 * Image-prompt precision-critical claim extraction and fidelity policy.
 * Transport-only: preserves authorised formal spans across evidence truncation.
 * Domain-generic — no subject-matter formula patches.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_IMAGE_PRECISION_FIDELITY = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var PRECISION_FIDELITY_HEADING = "Precision-critical fidelity:";
  var AUTHORISED_PRECISION_HEADING = "Authorised precision-critical relationships:";
  var MAX_CLAIM_LENGTH = 220;
  var MAX_CLAIMS = 12;

  /**
   * Conservative detectors for authorised formal spans in learner/source prose.
   * Prefer TeX/math delimiters; also catch obvious symbolic identities.
   */
  function extractPrecisionCriticalClaims(text) {
    var raw = String(text == null ? "" : text);
    if (!raw.trim()) return [];
    var claims = [];
    var seen = Object.create(null);

    function push(claim) {
      var cleaned = String(claim || "")
        .replace(/\s+/g, " ")
        .trim();
      if (!cleaned || cleaned.length < 3 || cleaned.length > MAX_CLAIM_LENGTH) return false;
      if (seen[cleaned]) return false;
      seen[cleaned] = true;
      claims.push(cleaned);
      return claims.length >= MAX_CLAIMS;
    }

    function absorbRegex(re) {
      var local = new RegExp(re.source, "g");
      var match;
      while ((match = local.exec(raw)) !== null) {
        if (push(match[0])) return true;
      }
      return false;
    }

    if (absorbRegex(/\\\([\s\S]*?\\\)/)) return claims;
    if (absorbRegex(/\\\[[\s\S]*?\\\]/)) return claims;
    if (absorbRegex(/\$\$[\s\S]+?\$\$/)) return claims;

    var dollar = /\$([^\$\n]{3,120})\$/g;
    var dollarMatch;
    while ((dollarMatch = dollar.exec(raw)) !== null) {
      if (raw.charAt(dollarMatch.index - 1) === "$") continue;
      if (push("$" + dollarMatch[1] + "$")) return claims;
    }

    var bareIdentity =
      /(?:^|[^\w\\])([A-Za-z\u0391-\u03C9\u2202\u2207][A-Za-z0-9\u0391-\u03C9_*′'^*\u0304\u00AF\\^/{}\-]{0,24}\s*=\s*[^\n,;]{1,100})/g;
    var bareMatch;
    while ((bareMatch = bareIdentity.exec(raw)) !== null) {
      var candidate = String(bareMatch[1] || "").trim();
      if (
        !/[\\λ\u03BB\u2202\u2207^*′'/\u0304\u00AF]|d[A-Za-z*]|\\frac|\\partial|\\bar|\\hat|\\tilde/i.test(
          candidate
        )
      ) {
        continue;
      }
      if (push(candidate)) break;
    }

    return claims;
  }

  function sourceEvidenceText(src) {
    if (!src || typeof src !== "object") return "";
    if (typeof src.content_text === "string") return src.content_text;
    if (typeof src.content === "string") return src.content;
    return "";
  }

  function collectPrecisionCriticalClaims(options) {
    var opts = options && typeof options === "object" ? options : {};
    var claims = [];
    var seen = Object.create(null);

    function absorb(list) {
      (list || []).forEach(function (item) {
        var value = String(item == null ? "" : item)
          .replace(/\s+/g, " ")
          .trim();
        if (!value || seen[value]) return;
        seen[value] = true;
        claims.push(value);
      });
    }

    var sources = Array.isArray(opts.sourceEvidence) ? opts.sourceEvidence : [];
    sources.forEach(function (src) {
      absorb(extractPrecisionCriticalClaims(sourceEvidenceText(src)));
    });

    (opts.additionalTexts || []).forEach(function (text) {
      absorb(extractPrecisionCriticalClaims(text));
    });

    return claims.slice(0, MAX_CLAIMS);
  }

  function clipEvidenceText(text, maxChars) {
    var clipped = String(text == null ? "" : text)
      .replace(/\s+/g, " ")
      .trim();
    var limit = Number(maxChars);
    if (!Number.isFinite(limit) || limit <= 0) return clipped;
    if (clipped.length <= limit) return clipped;
    return clipped.slice(0, Math.max(0, limit - 3)) + "...";
  }

  function briefRequiresExactDataMatch(briefOrJob) {
    if (!briefOrJob || typeof briefOrJob !== "object") return false;
    if (briefOrJob.requires_exact_data_match === true) return true;
    if (
      briefOrJob.authored_passthrough &&
      briefOrJob.authored_passthrough.requires_exact_data_match === true
    ) {
      return true;
    }
    return false;
  }

  function shouldEmitPrecisionFidelity(claims, briefOrJob) {
    if (Array.isArray(claims) && claims.length) return true;
    return briefRequiresExactDataMatch(briefOrJob);
  }

  function buildAuthorisedPrecisionClaimLines(claims, style) {
    var list = Array.isArray(claims) ? claims.filter(Boolean) : [];
    if (!list.length) return [];
    var bullet = style === "canonical" ? "- " : "- ";
    var lines = [AUTHORISED_PRECISION_HEADING];
    list.forEach(function (claim) {
      lines.push(bullet + claim);
    });
    return lines;
  }

  function buildPrecisionFidelityInstructionLines(claims, briefOrJob) {
    if (!shouldEmitPrecisionFidelity(claims, briefOrJob)) return [];
    var lines = [
      PRECISION_FIDELITY_HEADING,
      "Preserve authorised equations, values, symbolic relationships, units and technical labels exactly where they are represented.",
      "You may arrange or visually explain authorised formal claims.",
      "Do NOT derive, invent, substitute, average, simplify into a different relationship, or create a new equation merely to make the visual coherent.",
      "If the authorised source does not specify an exact formal relationship, represent the connection qualitatively (arrows, grouping, short labels) rather than inventing a formula.",
      "Before rendering, silently verify every mathematical or formal label against the authorised precision-critical relationships and claims."
    ];
    if (briefRequiresExactDataMatch(briefOrJob)) {
      lines.push(
        "This brief requires exact data match: numeric values, units and symbolic forms must match authorised evidence."
      );
    }
    return lines;
  }

  function antiVerbatimPolicyLine(hasPrecisionClaims) {
    if (hasPrecisionClaims) {
      return (
        "Do not copy source prose passages onto the image; authorised precision-critical formal forms " +
        "(equations, values, symbolic identities, units, exact technical labels) MAY and SHOULD be reproduced exactly where fidelity requires it."
      );
    }
    return (
      "Slightly denser labels are acceptable for this representation, but keep phrases concise and never reproduce source materials verbatim."
    );
  }

  function formatCanonicalPrecisionBlock(claims, briefOrJob) {
    var parts = [];
    var claimLines = buildAuthorisedPrecisionClaimLines(claims, "canonical");
    if (claimLines.length) {
      parts.push(claimLines.join("\n"));
    }
    var fidelity = buildPrecisionFidelityInstructionLines(claims, briefOrJob);
    if (fidelity.length) {
      parts.push(fidelity.join("\n"));
    }
    return parts.join("\n\n");
  }

  return {
    PRECISION_FIDELITY_HEADING: PRECISION_FIDELITY_HEADING,
    AUTHORISED_PRECISION_HEADING: AUTHORISED_PRECISION_HEADING,
    extractPrecisionCriticalClaims: extractPrecisionCriticalClaims,
    collectPrecisionCriticalClaims: collectPrecisionCriticalClaims,
    clipEvidenceText: clipEvidenceText,
    briefRequiresExactDataMatch: briefRequiresExactDataMatch,
    shouldEmitPrecisionFidelity: shouldEmitPrecisionFidelity,
    buildAuthorisedPrecisionClaimLines: buildAuthorisedPrecisionClaimLines,
    buildPrecisionFidelityInstructionLines: buildPrecisionFidelityInstructionLines,
    antiVerbatimPolicyLine: antiVerbatimPolicyLine,
    formatCanonicalPrecisionBlock: formatCanonicalPrecisionBlock,
    sourceEvidenceText: sourceEvidenceText
  };
});
