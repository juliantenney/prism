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
  var ANTI_REPARAMETERISATION_LINE =
    "Do not reparameterise, normalise, rearrange, or substitute an authorised precision-critical expression into a different formal convention unless that alternate form is also explicitly authorised.";
  var MAX_CLAIM_LENGTH = 220;
  var MAX_CLAIMS = 12;

  var FORMAL_MATH_SIGNAL_RE =
    /[\\λ\u03BB]|\\[a-zA-Z]+|\\\(|\\\)|[\u2202\u2207]|∇|∂|\([^)]*\)|\[[^\]]+\]|\^|_\{|_\w|\bd[A-Za-z*]\b|\/|[0-9]/;

  var PROSE_LIKE_RE =
    /^(?:the|a|an|this|these|do not|show|learners|relationship|connection|explain|describe|compare|identify|understand|without|must|should)\b/i;

  function normalizeClaimText(value) {
    return String(value == null ? "" : value)
      .replace(/\s+/g, " ")
      .trim();
  }

  function hasFormalMathSignals(text) {
    return FORMAL_MATH_SIGNAL_RE.test(String(text || ""));
  }

  /**
   * Conservative: true when text is likely an authorised formal identity, not prose.
   */
  function isFormalMathematicalIdentity(text) {
    var cleaned = normalizeClaimText(text);
    if (!cleaned || cleaned.length < 5 || cleaned.length > MAX_CLAIM_LENGTH) return false;
    if (cleaned.indexOf("=") < 0) return false;
    if (PROSE_LIKE_RE.test(cleaned)) return false;
    if (!hasFormalMathSignals(cleaned)) return false;
    var wordCount = cleaned.split(/\s+/).filter(Boolean).length;
    if (wordCount > 14 && !/\\[(\[]/.test(cleaned)) return false;
    return true;
  }

  function isPlausibleFormalLhs(lhs) {
    var token = String(lhs || "").trim();
    if (!/^[A-Za-z_\u0391-\u03C9]/.test(token)) return false;
    if (/^[a-z]{1,2},\)?/.test(token) || /^\d/.test(token)) return false;
    return /[\(\[\]λ\u03BB\\]/.test(token) || token.length <= 4;
  }

  function extractPlainFormalRhs(rawRhs) {
    var rhs = String(rawRhs || "").trim();
    var sentenceBreak = rhs.search(/\.\s+[A-Za-z]/);
    if (sentenceBreak >= 0) rhs = rhs.slice(0, sentenceBreak);
    return rhs.replace(/\.\s*$/, "").trim();
  }

  function promoteMustShowFormalIdentity(text) {
    if (!isFormalMathematicalIdentity(text)) return null;
    return normalizeClaimText(text);
  }

  /**
   * Conservative detectors for authorised formal spans in learner/source prose.
   * Prefer TeX/math delimiters; also catch plain symbolic identities.
   */
  function extractPrecisionCriticalClaims(text) {
    var raw = String(text == null ? "" : text);
    if (!raw.trim()) return [];
    var claims = [];
    var seen = Object.create(null);

    function push(claim) {
      var cleaned = normalizeClaimText(claim);
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

    var plainFormal =
      /(?:^|[^\w\\])([A-Za-z_\u0391-\u03C9][A-Za-z0-9_\u0391-\u03C9λ\u03BB()*,\[\]\^+\-]{0,48})\s*=\s*((?:(?!\.\s+[A-Za-z])[^;\n]){1,120})/g;
    var plainMatch;
    while ((plainMatch = plainFormal.exec(raw)) !== null) {
      var lhs = String(plainMatch[1] || "").trim();
      var rhs = extractPlainFormalRhs(plainMatch[2]);
      if (!isPlausibleFormalLhs(lhs) || !rhs) continue;
      var candidate = normalizeClaimText(lhs + "=" + rhs);
      if (!candidate || /\b(?:Define|The|Under|First|This|After|Where)\b/i.test(candidate)) continue;
      if (!hasFormalMathSignals(candidate)) continue;
      push(candidate);
    }

    if (claims.length) return claims;

    var bareIdentity =
      /(?:^|[^\w\\])([A-Za-z\u0391-\u03C9\u2202\u2207][A-Za-z0-9\u0391-\u03C9_*′'^*\u0304\u00AF\\^/{}\-]{0,24}\s*=\s*[^\n,;]{1,100})/g;
    var bareMatch;
    while ((bareMatch = bareIdentity.exec(raw)) !== null) {
      var legacyCandidate = String(bareMatch[1] || "").trim();
      if (
        !/[\\λ\u03BB\u2202\u2207^*′'/\u0304\u00AF]|d[A-Za-z*]|\\frac|\\partial|\\bar|\\hat|\\tilde/i.test(
          legacyCandidate
        )
      ) {
        continue;
      }
      if (push(legacyCandidate)) break;
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
        var value = normalizeClaimText(item);
        if (!value || seen[value]) return;
        seen[value] = true;
        claims.push(value);
      });
    }

    (opts.mustShowItems || []).forEach(function (item) {
      var promoted = promoteMustShowFormalIdentity(item);
      if (promoted) absorb([promoted]);
    });

    var sources = Array.isArray(opts.sourceEvidence) ? opts.sourceEvidence : [];
    var roleContext = opts.materialRole && typeof opts.materialRole === "object"
      ? opts.materialRole
      : { effective_policy: "conceptual" };
    if (typeof opts.filterSourcesForPrecision === "function") {
      sources = opts.filterSourcesForPrecision(sources, roleContext);
    } else {
      try {
        var grounding = require("./prism-visual-material-role-grounding.js");
        if (typeof grounding.filterSourcesForPrecision === "function") {
          sources = grounding.filterSourcesForPrecision(sources, roleContext);
        }
      } catch (err) {
        /* browser bundle may inject filter upstream */
      }
    }

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
      "Harmless typography or spacing variation is allowed.",
      "You may arrange or visually explain authorised formal claims without changing their notation, convention, or algebraic form.",
      "Do NOT derive, invent, substitute, average, simplify into a different relationship, or create a new equation merely to make the visual coherent.",
      ANTI_REPARAMETERISATION_LINE,
      "If the authorised source does not specify an exact formal relationship, represent the connection qualitatively (arrows, grouping, short labels) rather than inventing a formula.",
      "Before rendering, silently verify every mathematical or formal label against the authorised precision-critical relationships and claims."
    ];
    if (briefRequiresExactDataMatch(briefOrJob)) {
      lines.push(
        "This brief requires exact data match: numeric values, units and symbolic forms must match authorised evidence."
      );
    }
    var role =
      briefOrJob &&
      briefOrJob.material_role &&
      typeof briefOrJob.material_role === "object"
        ? briefOrJob.material_role
        : null;
    if (role && role.effective_policy === "grounded_source") {
      lines.push(
        "The represented material is authoritative. Do not substitute or invent alternative numerical, symbolic, unit, label, or scenario particulars. If a particular cannot be represented faithfully, omit it rather than replace it."
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
    ANTI_REPARAMETERISATION_LINE: ANTI_REPARAMETERISATION_LINE,
    isFormalMathematicalIdentity: isFormalMathematicalIdentity,
    promoteMustShowFormalIdentity: promoteMustShowFormalIdentity,
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
