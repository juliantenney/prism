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
  var PRECISION_COMPLETENESS_HEADING = "Precision-brief completeness:";
  var ANTI_REPARAMETERISATION_LINE =
    "Do not reparameterise, normalise, rearrange, or substitute an authorised precision-critical expression into a different formal convention unless that alternate form is also explicitly authorised.";
  var MAX_CLAIM_LENGTH = 220;
  var MAX_CLAIMS = 12;

  var FORMAL_MATH_SIGNAL_RE =
    /[\\λ\u03BB]|\\[a-zA-Z]+|\\\(|\\\)|[\u2202\u2207]|∇|∂|\([^)]*\)|\[[^\]]+\]|\^|_\{|_\w|\bd[A-Za-z*]\b|\/|[0-9²³⁴⁵⁶⁷⁸⁹⁰]|[⁺⁻]|[\u2212]/;

  var PROSE_LIKE_RE =
    /^(?:the|a|an|this|these|do not|show|learners|relationship|connection|explain|describe|compare|identify|understand|without|must|should)\b/i;

  var MATH_CHAR_RE =
    /[\w\u0391-\u03C9\u2202\u2207∇∂²³⁴⁵⁶⁷⁸⁹⁰⁺⁻₀₁₂₃₄₅₆₇₈₉\\(){}\[\]^*,.′'\+\-\/\s\u2212λ\u03BB]/;

  var GENERIC_NAMED_ZERO_RE =
    /^[a-zA-Z]\s*\(\s*[xy]\s*,\s*[xy]\s*\)\s*=\s*0$/;
  var GENERIC_MULTIPLIER_RE =
    /^(?:\\nabla\s*|∇\s*|\u2207\s*)?f\s*=\s*(?:\\lambda|λ|\u03BB)\s*(?:\\nabla\s*|∇\s*|\u2207\s*)?g$/i;

  function normalizeClaimText(value) {
    return String(value == null ? "" : value)
      .replace(/\s+/g, " ")
      .trim();
  }

  function compactClaim(value) {
    return normalizeClaimText(value).replace(/\s+/g, "");
  }

  function hasFormalMathSignals(text) {
    return FORMAL_MATH_SIGNAL_RE.test(String(text || ""));
  }

  /**
   * Conservative: true when text is likely an authorised formal identity, not prose.
   */
  function isFormalMathematicalIdentity(text) {
    var cleaned = normalizeClaimText(text);
    if (!cleaned || cleaned.length < 3 || cleaned.length > MAX_CLAIM_LENGTH) return false;
    if (cleaned.indexOf("=") < 0) return false;
    if (PROSE_LIKE_RE.test(cleaned)) return false;
    if (!hasFormalMathSignals(cleaned)) return false;
    var wordCount = cleaned.split(/\s+/).filter(Boolean).length;
    if (wordCount > 18 && !/\\[(\[]/.test(cleaned)) return false;
    return true;
  }

  /**
   * Generic symbolic placeholders that must not substitute for concrete authored forms.
   * Domain-generic: named zero-level sets and abstract multiplier identities without
   * concrete coefficients, powers, or evaluated vectors.
   */
  function isGenericFormalPlaceholder(text) {
    var cleaned = normalizeClaimText(text);
    if (!cleaned) return false;
    var compact = compactClaim(cleaned);
    if (GENERIC_NAMED_ZERO_RE.test(compact)) return true;
    if (GENERIC_MULTIPLIER_RE.test(cleaned.replace(/\s+/g, ""))) return true;
    // Abstract nabla identity without concrete components, e.g. ∇f=λ∇g already covered;
    // also catch "grad f = λ grad g".
    if (/^grad\s*f\s*=\s*(?:\\lambda|λ)\s*grad\s*g$/i.test(cleaned)) return true;
    return false;
  }

  function isSpecificFormalClaim(text) {
    return isFormalMathematicalIdentity(text) && !isGenericFormalPlaceholder(text);
  }

  function isPlausibleFormalLhs(lhs) {
    var token = String(lhs || "").trim();
    if (!token) return false;
    if (
      !/^[A-Za-z_\u0391-\u03C9\u2202\u2207∇∂(\\[]/.test(token) &&
      !/^[0-9(]/.test(token)
    ) {
      return false;
    }
    if (/^(?:the|a|an|this|these|where|when|under|after|before)\b/i.test(token)) {
      return false;
    }
    return (
      hasFormalMathSignals(token) ||
      /[()\\λ\u03BB∇∂\u2207\u2202^²³]/.test(token) ||
      token.length <= 8
    );
  }

  function extractPlainFormalRhs(rawRhs) {
    var rhs = String(rawRhs || "").trim();
    var sentenceBreak = rhs.search(/\.\s+[A-Za-z]/);
    if (sentenceBreak >= 0) rhs = rhs.slice(0, sentenceBreak);
    // Stop before trailing prose after a short closed form.
    var proseTail = rhs.search(
      /\s+(?:and|with|where|which|showing|labelled|labeled|across|under)\b/i
    );
    if (proseTail > 0 && proseTail < rhs.length) {
      var head = rhs.slice(0, proseTail).trim();
      if (head.length >= 1) rhs = head;
    }
    return rhs.replace(/\.\s*$/, "").trim();
  }

  function promoteMustShowFormalIdentity(text) {
    var cleaned = normalizeClaimText(text);
    // Strip light panel/representation prefixes so exact equations in must_show promote.
    var stripped = cleaned
      .replace(
        /^(?:panel|representation|form|constraint|equation|objective)\s*[IVXLCDM0-9]+\s*[:.\-–—]\s*/i,
        ""
      )
      .trim();
    if (isFormalMathematicalIdentity(stripped)) return stripped;
    if (isFormalMathematicalIdentity(cleaned)) return cleaned;
    return null;
  }

  function walkEquationBounds(raw, eqIdx) {
    var start = eqIdx - 1;
    while (start >= 0 && MATH_CHAR_RE.test(raw.charAt(start))) {
      // Do not cross sentence-ending punctuation into prior prose.
      if (raw.charAt(start) === "." && start > 0 && /[a-zA-Z]/.test(raw.charAt(start - 1))) {
        break;
      }
      start--;
    }
    start++;
    while (start < eqIdx && /\s/.test(raw.charAt(start))) start++;

    var end = eqIdx + 1;
    while (end < raw.length && MATH_CHAR_RE.test(raw.charAt(end))) {
      if (raw.charAt(end) === "." && end + 1 < raw.length && /[A-Z]/.test(raw.charAt(end + 1))) {
        break;
      }
      end++;
    }
    while (end > eqIdx + 1 && /\s/.test(raw.charAt(end - 1))) end--;
    return { start: start, end: end };
  }

  function extractEquationsByEqualsScan(raw) {
    var claims = [];
    var seen = Object.create(null);
    var eqRe = /=/g;
    var match;
    while ((match = eqRe.exec(raw)) !== null) {
      var bounds = walkEquationBounds(raw, match.index);
      if (bounds.start >= match.index) continue;
      var lhs = raw.slice(bounds.start, match.index).trim();
      var rhs = extractPlainFormalRhs(raw.slice(match.index + 1, bounds.end));
      if (!isPlausibleFormalLhs(lhs) || !rhs) continue;
      // Avoid matching "Panel I =" style fragments.
      if (/^(?:panel|representation|form)\b/i.test(lhs) && lhs.length < 18) continue;
      var candidate = normalizeClaimText(lhs + " = " + rhs);
      if (!isFormalMathematicalIdentity(candidate)) continue;
      if (seen[candidate]) continue;
      seen[candidate] = true;
      claims.push(candidate);
      if (claims.length >= MAX_CLAIMS) break;
    }
    return claims;
  }

  /**
   * Conservative detectors for authorised formal spans in learner/source prose.
   * Prefer TeX/math delimiters; also catch plain symbolic identities and
   * spaced polynomial / parenthesized equations.
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

    // Equals-neighbourhood scan captures spaced polynomials, parenthesized forms,
    // unicode superscripts, and nabla identities without stripping leading ∇.
    extractEquationsByEqualsScan(raw).forEach(function (claim) {
      push(claim);
    });
    if (claims.length >= MAX_CLAIMS) return claims;

    // Legacy compact named forms (g(x,y)=0) if not already found.
    var plainFormal =
      /(?:^|[^\w\\∇\u2207∂\u2202])([A-Za-z_\u0391-\u03C9\u2202\u2207∇∂][A-Za-z0-9_\u0391-\u03C9λ\u03BB()*,\[\]\^{}+\-]{0,48})\s*=\s*((?:(?!\.\s+[A-Za-z])[^;\n]){1,120})/g;
    var plainMatch;
    while ((plainMatch = plainFormal.exec(raw)) !== null) {
      var lhs = String(plainMatch[1] || "").trim();
      var rhs = extractPlainFormalRhs(plainMatch[2]);
      if (!isPlausibleFormalLhs(lhs) || !rhs) continue;
      var candidate = normalizeClaimText(lhs + " = " + rhs);
      if (!candidate || /\b(?:Define|The|Under|First|This|After|Where)\b/i.test(candidate)) {
        continue;
      }
      if (!hasFormalMathSignals(candidate)) continue;
      if (push(candidate)) return claims;
    }

    return claims;
  }

  function sourceEvidenceText(src) {
    if (!src || typeof src !== "object") return "";
    if (typeof src.content_text === "string") return src.content_text;
    if (typeof src.content === "string") return src.content;
    return "";
  }

  function analyzeMustShowPrecisionDemands(mustShowItems) {
    var items = Array.isArray(mustShowItems) ? mustShowItems : [];
    var equationMentions = 0;
    var panelEquationMentions = 0;
    var promotedExact = [];
    var genericPromoted = [];
    var qualitativeEquationRequests = [];

    items.forEach(function (item) {
      var text = normalizeClaimText(item);
      if (!text) return;
      var promoted = promoteMustShowFormalIdentity(text);
      if (promoted) {
        if (isGenericFormalPlaceholder(promoted)) genericPromoted.push(promoted);
        else promotedExact.push(promoted);
      }
      var asksEquation =
        /\b(?:equation|identity|formula|expression|constraint\s+form|objective\s+function|gradient)\b/i.test(
          text
        ) ||
        /\b(?:panel|representation|form)\s*[IVXLCDM0-9]+\b/i.test(text);
      if (asksEquation) {
        equationMentions += 1;
        if (/\b(?:panel|representation|form)\s*[IVXLCDM0-9]+\b/i.test(text)) {
          panelEquationMentions += 1;
        }
        if (!promoted || isGenericFormalPlaceholder(promoted)) {
          qualitativeEquationRequests.push(text);
        }
      }
    });

    // "three distinct constraint equations" style counts
    var countMatch = items
      .map(function (item) {
        return normalizeClaimText(item);
      })
      .join(" ")
      .match(
        /\b(three|four|five|two|[2-9]|1\d)\s+(?:distinct\s+)?(?:constraint\s+)?(?:equations|forms|representations|expressions|panels)\b/i
      );
    var countedDemand = 0;
    if (countMatch) {
      var token = String(countMatch[1] || "").toLowerCase();
      var wordMap = { two: 2, three: 3, four: 4, five: 5 };
      countedDemand = wordMap[token] || parseInt(token, 10) || 0;
    }

    var distinctEquationDemand = Math.max(
      countedDemand,
      panelEquationMentions,
      qualitativeEquationRequests.length > 1 ? qualitativeEquationRequests.length : 0
    );

    return {
      equationMentions: equationMentions,
      panelEquationMentions: panelEquationMentions,
      distinctEquationDemand: distinctEquationDemand,
      promotedExact: promotedExact,
      genericPromoted: genericPromoted,
      qualitativeEquationRequests: qualitativeEquationRequests,
      demandsExactExpressions:
        distinctEquationDemand > 0 ||
        qualitativeEquationRequests.length > 0 ||
        promotedExact.length > 0 ||
        genericPromoted.length > 0
    };
  }

  function preferSpecificClaims(claims) {
    var list = Array.isArray(claims) ? claims.slice() : [];
    var specific = list.filter(isSpecificFormalClaim);
    if (!specific.length) return list.slice(0, MAX_CLAIMS);
    var generics = list.filter(isGenericFormalPlaceholder);
    var other = list.filter(function (c) {
      return !isSpecificFormalClaim(c) && !isGenericFormalPlaceholder(c);
    });
    // Prefer concrete authored forms; keep generics only when no specific forms exist.
    return specific.concat(other).slice(0, MAX_CLAIMS);
  }

  function assessPrecisionBriefCompleteness(options) {
    var opts = options && typeof options === "object" ? options : {};
    var mustShowItems = opts.mustShowItems || [];
    var claims = Array.isArray(opts.claims) ? opts.claims : [];
    var demands = analyzeMustShowPrecisionDemands(mustShowItems);
    var specific = claims.filter(isSpecificFormalClaim);
    var generics = claims.filter(isGenericFormalPlaceholder);
    var gaps = [];

    if (demands.distinctEquationDemand > 0 && specific.length < demands.distinctEquationDemand) {
      gaps.push({
        code: "insufficient_specific_equations",
        message:
          "must_show / Show requires " +
          demands.distinctEquationDemand +
          " distinct equation(s) or panel forms, but only " +
          specific.length +
          " specific authorised expression(s) were found in authored materials."
      });
    }

    demands.qualitativeEquationRequests.forEach(function (req) {
      // A qualitative request is satisfied if any specific claim exists and demand count is met,
      // or if the request text itself embeds a specific identity.
      if (promoteMustShowFormalIdentity(req) && isSpecificFormalClaim(promoteMustShowFormalIdentity(req))) {
        return;
      }
      if (specific.length >= Math.max(1, demands.distinctEquationDemand)) return;
      gaps.push({
        code: "equation_request_without_authorised_expression",
        message:
          "Show item requires an exact expression but no matching authorised source form was found: " +
          req
      });
    });

    if (
      demands.genericPromoted.length &&
      !specific.length &&
      (demands.distinctEquationDemand > 0 || demands.qualitativeEquationRequests.length > 0)
    ) {
      gaps.push({
        code: "generic_placeholder_only",
        message:
          "Authorised precision claims contain only generic placeholders (e.g. named g(x,y)=0 / abstract multiplier identities) while Show requires concrete expressions from authored materials."
      });
    }

    // Objective / gradient labelling: if Show asks for objective gradient, require a gradient form
    // that is not merely the objective expression itself when both are authorised.
    var asksObjectiveGradient = mustShowItems.some(function (item) {
      return /objective\s+gradient|∇f|\\nabla\s*f|grad\s*f/i.test(String(item || ""));
    });
    if (asksObjectiveGradient) {
      var hasGradientClaim = claims.some(function (c) {
        return /∇f|\\nabla\s*f|grad\s*f|\(1\s*,\s*1\)/i.test(String(c || ""));
      });
      if (!hasGradientClaim && specific.length) {
        // Soft gap only when materials clearly have f=x+y style without gradient.
        var hasObjectiveFn = claims.some(function (c) {
          return /^f\s*\(/i.test(compactClaim(c)) || /^f\s*=/i.test(compactClaim(c));
        });
        if (hasObjectiveFn) {
          gaps.push({
            code: "objective_gradient_unlabelled",
            message:
              "Show requires an objective-gradient direction; authorised claims include an objective function but no gradient expression such as ∇f = (…)."
          });
        }
      }
    }

    return {
      ok: gaps.length === 0,
      gaps: gaps,
      demands: demands,
      specificClaims: specific,
      genericClaims: generics,
      claims: claims
    };
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
      // Also extract embedded equations from longer Show lines.
      absorb(extractPrecisionCriticalClaims(item));
    });

    var sources = Array.isArray(opts.sourceEvidence) ? opts.sourceEvidence : [];
    var roleContext =
      opts.materialRole && typeof opts.materialRole === "object"
        ? opts.materialRole
        : { effective_policy: "conceptual" };
    var demands = analyzeMustShowPrecisionDemands(opts.mustShowItems || []);

    if (typeof opts.filterSourcesForPrecision === "function") {
      sources = opts.filterSourcesForPrecision(sources, roleContext, {
        demandsExactExpressions: demands.demandsExactExpressions
      });
    } else {
      try {
        var grounding = require("./prism-visual-material-role-grounding.js");
        if (typeof grounding.filterSourcesForPrecision === "function") {
          sources = grounding.filterSourcesForPrecision(sources, roleContext, {
            demandsExactExpressions: demands.demandsExactExpressions
          });
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

    return preferSpecificClaims(claims).slice(0, MAX_CLAIMS);
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

  function buildPrecisionCompletenessLines(assessment) {
    if (!assessment || assessment.ok) return [];
    var lines = [
      PRECISION_COMPLETENESS_HEADING,
      "This brief is incomplete for precision-critical generation.",
      "Do NOT invent missing equations, symbolic forms, numeric values, or technical labels.",
      "Do NOT substitute generic placeholders for missing concrete expressions."
    ];
    (assessment.gaps || []).forEach(function (gap) {
      lines.push("- " + (gap && gap.message ? gap.message : String(gap)));
    });
    lines.push(
      "Resolve by carrying exact expressions from authored learner materials / must_show before generating."
    );
    return lines;
  }

  function buildPrecisionFidelityInstructionLines(claims, briefOrJob, assessment) {
    if (!shouldEmitPrecisionFidelity(claims, briefOrJob) && !(assessment && !assessment.ok)) {
      return [];
    }
    var lines = [
      PRECISION_FIDELITY_HEADING,
      "Preserve authorised equations, values, symbolic relationships, units and technical labels exactly where they are represented.",
      "When must_show / Show requires exact equations or labels, use the authorised precision-critical relationships below — never generic summaries in place of those exact forms.",
      "Label objective functions and objective gradients distinctly when both are authorised (e.g. do not label an objective function expression as a gradient direction).",
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
    var completeness = buildPrecisionCompletenessLines(assessment);
    if (completeness.length) {
      lines = lines.concat([""]).concat(completeness);
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

  function formatCanonicalPrecisionBlock(claims, briefOrJob, assessment) {
    var parts = [];
    var claimLines = buildAuthorisedPrecisionClaimLines(claims, "canonical");
    if (claimLines.length) {
      parts.push(claimLines.join("\n"));
    }
    var fidelity = buildPrecisionFidelityInstructionLines(claims, briefOrJob, assessment);
    if (fidelity.length) {
      parts.push(fidelity.join("\n"));
    }
    return parts.join("\n\n");
  }

  return {
    PRECISION_FIDELITY_HEADING: PRECISION_FIDELITY_HEADING,
    AUTHORISED_PRECISION_HEADING: AUTHORISED_PRECISION_HEADING,
    PRECISION_COMPLETENESS_HEADING: PRECISION_COMPLETENESS_HEADING,
    ANTI_REPARAMETERISATION_LINE: ANTI_REPARAMETERISATION_LINE,
    isFormalMathematicalIdentity: isFormalMathematicalIdentity,
    isGenericFormalPlaceholder: isGenericFormalPlaceholder,
    isSpecificFormalClaim: isSpecificFormalClaim,
    promoteMustShowFormalIdentity: promoteMustShowFormalIdentity,
    extractPrecisionCriticalClaims: extractPrecisionCriticalClaims,
    collectPrecisionCriticalClaims: collectPrecisionCriticalClaims,
    analyzeMustShowPrecisionDemands: analyzeMustShowPrecisionDemands,
    assessPrecisionBriefCompleteness: assessPrecisionBriefCompleteness,
    preferSpecificClaims: preferSpecificClaims,
    clipEvidenceText: clipEvidenceText,
    briefRequiresExactDataMatch: briefRequiresExactDataMatch,
    shouldEmitPrecisionFidelity: shouldEmitPrecisionFidelity,
    buildAuthorisedPrecisionClaimLines: buildAuthorisedPrecisionClaimLines,
    buildPrecisionCompletenessLines: buildPrecisionCompletenessLines,
    buildPrecisionFidelityInstructionLines: buildPrecisionFidelityInstructionLines,
    antiVerbatimPolicyLine: antiVerbatimPolicyLine,
    formatCanonicalPrecisionBlock: formatCanonicalPrecisionBlock,
    sourceEvidenceText: sourceEvidenceText
  };
});
