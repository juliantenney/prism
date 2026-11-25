/**
 * Sprint 105 (S105-D03) — Shared, deterministic Expository material anchor contract.
 *
 * Used identically across XD capture validation, Expository assembly validation,
 * and vNext learner rendering (Node + browser bundle).
 *
 * Syntax: standalone block-level directive line outside fenced code blocks:
 *   [[material:<commission_id>]]
 *
 * Ownership & binding rules:
 * - XD owns sections[].exposition, materials_commission[], and optional anchor placement.
 * - XM realises commissions 1:1 without modifying exposition or placement.
 * - Anchors bind exclusively to authoritative commission_id values within the same section.
 * - No secondary material_id binding fallback.
 * - Recognised only as standalone block-level lines outside code fences (never inside
 *   fenced code blocks, inline code, blockquotes, or ordinary quoted prose).
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.PrismExpositoryMaterialAnchors = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var VALID_ANCHOR_LINE_RE = /^[ \t]*\[\[material:([A-Za-z0-9][A-Za-z0-9_.-]*)\]\][ \t]*$/;
  var MALFORMED_BRACKETED_RE = /^[ \t]*\[\[\s*material(?:\b[^\]]*|\s*:[^\]]*)\]\][ \t]*$/i;
  var MALFORMED_UNCLOSED_RE = /^[ \t]*\[\[\s*material\s*:[A-Za-z0-9_.\s-]*[ \t]*$/i;
  var FENCE_OPEN_RE = /^[ \t]*(`{3,}|~{3,})/;

  function text(value) {
    return String(value == null ? "" : value).trim();
  }

  function normKey(value) {
    return text(value).toLowerCase();
  }

  function isFenceClose(line, fenceChar, fenceLen) {
    var trimmed = String(line || "").replace(/^[ \t]+/, "");
    if (!trimmed) return false;
    var count = 0;
    while (count < trimmed.length && trimmed.charAt(count) === fenceChar) {
      count += 1;
    }
    if (count < fenceLen) return false;
    return /^[ \t]*$/.test(trimmed.slice(count));
  }

  /**
   * Parse an Expository exposition Markdown string into alternating prose
   * segments and standalone block-level material anchor directives.
   *
   * Lines inside fenced code blocks (``` or ~~~) are always preserved verbatim
   * as prose/code and never recognised as material anchors.
   *
   * @param {string} markdown
   * @returns {{
   *   segments: Array<{type: "prose", markdown: string} | {type: "anchor", commissionId: string, raw: string, lineNumber: number} | {type: "malformed_anchor", raw: string, lineNumber: number}>,
   *   anchors: Array<{commissionId: string, raw: string, lineNumber: number}>,
   *   malformed: Array<{raw: string, lineNumber: number}>,
   *   hasDirectives: boolean
   * }}
   */
  function parseExpositionSegments(markdown) {
    var source = String(markdown == null ? "" : markdown);
    if (!source) {
      return { segments: [], anchors: [], malformed: [], hasDirectives: false };
    }
    var lines = source.split(/\r?\n/);
    var segments = [];
    var anchors = [];
    var malformed = [];
    var proseLines = [];
    var inFence = false;
    var fenceChar = "";
    var fenceLen = 0;

    function flushProse() {
      if (!proseLines.length) return;
      var chunk = proseLines.join("\n").trim();
      proseLines = [];
      if (chunk) {
        segments.push({ type: "prose", markdown: chunk });
      }
    }

    for (var i = 0; i < lines.length; i += 1) {
      var line = lines[i];
      var lineNumber = i + 1;

      if (inFence) {
        proseLines.push(line);
        if (isFenceClose(line, fenceChar, fenceLen)) {
          inFence = false;
          fenceChar = "";
          fenceLen = 0;
        }
        continue;
      }

      var fenceMatch = FENCE_OPEN_RE.exec(line);
      if (fenceMatch) {
        inFence = true;
        fenceChar = fenceMatch[1].charAt(0);
        fenceLen = fenceMatch[1].length;
        proseLines.push(line);
        continue;
      }

      var validMatch = VALID_ANCHOR_LINE_RE.exec(line);
      if (validMatch) {
        flushProse();
        var anchor = {
          type: "anchor",
          commissionId: validMatch[1],
          raw: line.trim(),
          lineNumber: lineNumber
        };
        segments.push(anchor);
        anchors.push({
          commissionId: anchor.commissionId,
          raw: anchor.raw,
          lineNumber: lineNumber
        });
        continue;
      }

      if (MALFORMED_BRACKETED_RE.test(line) || MALFORMED_UNCLOSED_RE.test(line)) {
        flushProse();
        var bad = {
          type: "malformed_anchor",
          raw: line.trim(),
          lineNumber: lineNumber
        };
        segments.push(bad);
        malformed.push({ raw: bad.raw, lineNumber: lineNumber });
        continue;
      }

      proseLines.push(line);
    }

    flushProse();

    return {
      segments: segments,
      anchors: anchors,
      malformed: malformed,
      hasDirectives: anchors.length > 0 || malformed.length > 0
    };
  }

  /**
   * Strip standalone block-level anchor directives outside fenced code blocks
   * so downstream text processing or accessibility helpers are never contaminated
   * by directive syntax. Literal syntax inside code fences/inline code/quotes is preserved.
   *
   * @param {string} markdown
   * @returns {string}
   */
  function stripMaterialAnchorDirectives(markdown) {
    var parsed = parseExpositionSegments(markdown);
    if (!parsed.hasDirectives) return String(markdown == null ? "" : markdown);
    return parsed.segments
      .filter(function (seg) {
        return seg.type === "prose";
      })
      .map(function (seg) {
        return seg.markdown;
      })
      .join("\n\n");
  }

  function collectSectionCommissionIds(section, preferRealised) {
    var commissioned = Object.create(null);
    var realised = Object.create(null);
    var materialIds = Object.create(null);
    var commissions = Array.isArray(section && section.materials_commission)
      ? section.materials_commission
      : [];
    var materials = Array.isArray(section && section.materials) ? section.materials : [];

    commissions.forEach(function (c) {
      var cid = text(c && c.commission_id);
      if (cid) commissioned[cid] = true;
    });
    materials.forEach(function (m) {
      var cid = text(m && (m.commission_id != null ? m.commission_id : m.commissionId));
      if (cid) realised[cid] = true;
      var mid = text(m && (m.material_id != null ? m.material_id : m.id));
      if (mid) materialIds[mid] = true;
    });

    var hasRealised = Object.keys(realised).length > 0;
    var hasCommissioned = Object.keys(commissioned).length > 0;
    var active =
      preferRealised && hasRealised
        ? realised
        : hasCommissioned
          ? commissioned
          : realised;
    return {
      active: active,
      commissioned: commissioned,
      realised: realised,
      materialIds: materialIds,
      hasRealised: hasRealised,
      hasCommissioned: hasCommissioned
    };
  }

  /**
   * Validate all standalone material anchors in one Expository section.
   * Binds exclusively to commission_id within the same section (no material_id fallback).
   *
   * @param {Object} section
   * @param {{ allSections?: Array<Object>, requireRealisedMaterials?: boolean }=} options
   * @returns {{ ok: boolean, errors: string[], issues: Array<Object>, anchoredCommissionIds: string[] }}
   */
  function validateSectionMaterialAnchors(section, options) {
    var opts = options && typeof options === "object" ? options : {};
    var sectionId = text(section && (section.section_id || section.id)) || "(unknown section)";
    var exposition = text(section && (section.exposition != null ? section.exposition : section.explanation));
    var parsed = parseExpositionSegments(exposition);
    var issues = [];
    var anchoredCommissionIds = [];

    if (!parsed.hasDirectives) {
      return { ok: true, errors: [], issues: [], anchoredCommissionIds: [] };
    }

    var idSets = collectSectionCommissionIds(section, !!opts.requireRealisedMaterials);

    // Map commission_ids owned by other sections for explicit cross-section diagnostics.
    var otherSectionsByCommission = Object.create(null);
    var allSections = Array.isArray(opts.allSections) ? opts.allSections : [];
    allSections.forEach(function (other) {
      if (!other || typeof other !== "object") return;
      var otherId = text(other.section_id || other.id);
      if (!otherId || otherId === sectionId) return;
      var otherSets = collectSectionCommissionIds(other, false);
      Object.keys(otherSets.commissioned).forEach(function (cid) {
        otherSectionsByCommission[cid] = otherId;
      });
      Object.keys(otherSets.realised).forEach(function (cid) {
        otherSectionsByCommission[cid] = otherId;
      });
    });

    var seen = Object.create(null);

    parsed.segments.forEach(function (seg) {
      if (seg.type === "malformed_anchor") {
        issues.push({
          code: "EXPOSITORY_ANCHOR_MALFORMED",
          sectionId: sectionId,
          lineNumber: seg.lineNumber,
          raw: seg.raw,
          message:
            "section " +
            sectionId +
            ": malformed material anchor directive at line " +
            seg.lineNumber +
            ' ("' +
            seg.raw +
            '") — expected standalone [[material:<commission_id>]]'
        });
        return;
      }

      if (seg.type !== "anchor") return;
      var cid = seg.commissionId;

      if (seen[cid]) {
        issues.push({
          code: "EXPOSITORY_ANCHOR_DUPLICATE",
          sectionId: sectionId,
          commissionId: cid,
          lineNumber: seg.lineNumber,
          raw: seg.raw,
          message:
            "section " +
            sectionId +
            ': duplicate material anchor for commission_id "' +
            cid +
            '" at line ' +
            seg.lineNumber
        });
        return;
      }
      seen[cid] = true;

      if (!idSets.active[cid]) {
        if (otherSectionsByCommission[cid]) {
          issues.push({
            code: "EXPOSITORY_ANCHOR_CROSS_SECTION",
            sectionId: sectionId,
            commissionId: cid,
            ownerSectionId: otherSectionsByCommission[cid],
            lineNumber: seg.lineNumber,
            raw: seg.raw,
            message:
              "section " +
              sectionId +
              ': material anchor "' +
              cid +
              '" belongs to section "' +
              otherSectionsByCommission[cid] +
              '", not "' +
              sectionId +
              '"'
          });
          return;
        }

        if (opts.requireRealisedMaterials && idSets.commissioned[cid] && !idSets.realised[cid]) {
          issues.push({
            code: "EXPOSITORY_ANCHOR_UNREALISED",
            sectionId: sectionId,
            commissionId: cid,
            lineNumber: seg.lineNumber,
            raw: seg.raw,
            message:
              "section " +
              sectionId +
              ': material anchor "' +
              cid +
              '" has no realised material in this section'
          });
          return;
        }

        var usedMaterialIdHint =
          idSets.materialIds[cid] && !idSets.commissioned[cid]
            ? " (anchors must bind exclusively to commission_id, not material_id)"
            : "";
        issues.push({
          code: "EXPOSITORY_ANCHOR_UNKNOWN",
          sectionId: sectionId,
          commissionId: cid,
          lineNumber: seg.lineNumber,
          raw: seg.raw,
          message:
            "section " +
            sectionId +
            ': unknown material anchor "' +
            cid +
            '" does not match any commission_id in this section' +
            usedMaterialIdHint
        });
        return;
      }

      anchoredCommissionIds.push(cid);
    });

    return {
      ok: issues.length === 0,
      errors: issues.map(function (i) {
        return i.message;
      }),
      issues: issues,
      anchoredCommissionIds: anchoredCommissionIds
    };
  }

  /**
   * Validate anchors across all sections of an Expository Development capture.
   */
  function validateExpositoryDevelopmentAnchors(xd) {
    var sections = Array.isArray(xd && xd.sections) ? xd.sections : [];
    var allIssues = [];
    sections.forEach(function (sec) {
      var res = validateSectionMaterialAnchors(sec, {
        allSections: sections,
        requireRealisedMaterials: false
      });
      allIssues = allIssues.concat(res.issues);
    });
    return {
      ok: allIssues.length === 0,
      errors: allIssues.map(function (i) {
        return i.message;
      }),
      issues: allIssues
    };
  }

  /**
   * Validate anchors across all sections of an assembled Expository page.
   * When Expository Materials have enriched the page, anchored commission_ids
   * must also resolve to realised materials[] in the same section.
   */
  function validateAssembledExpositoryAnchors(page) {
    var sections = Array.isArray(page && page.sections) ? page.sections : [];
    var enriched =
      page &&
      page.assembly_state &&
      Array.isArray(page.assembly_state.enriched_by)
        ? page.assembly_state.enriched_by
        : [];
    var hasXmEnrichment = enriched.indexOf("expository_materials") !== -1;
    var allIssues = [];
    sections.forEach(function (sec) {
      var hasMaterials = Array.isArray(sec && sec.materials) && sec.materials.length > 0;
      var res = validateSectionMaterialAnchors(sec, {
        allSections: sections,
        requireRealisedMaterials: hasXmEnrichment || hasMaterials
      });
      allIssues = allIssues.concat(res.issues);
    });
    return {
      ok: allIssues.length === 0,
      errors: allIssues.map(function (i) {
        return i.message;
      }),
      issues: allIssues
    };
  }

  function splitSourceBasisTokens(sourceBasis) {
    var raw = text(sourceBasis);
    if (!raw) return [];
    return raw
      .split(/[;,]+/)
      .map(function (part) {
        return normKey(part);
      })
      .filter(Boolean);
  }

  /**
   * Deterministic explicit linkage between a section-scoped visual affordance hook
   * and an anchored XM material within the same section.
   *
   * Matches ONLY via explicit identifiers — never via fuzzy text or proximity:
   * - hook.commissionId === material.commissionId
   * - hook.materialId === material.id
   * - hook.evidenceAnchors[] contains exact "<sectionId>.materials.<materialId|commissionId>"
   * - hook.sourceBasis token equals exact "<sectionId>.materials.<materialId|commissionId>"
   *
   * @param {string} sectionId
   * @param {{ id?: string, material_id?: string, commissionId?: string, commission_id?: string }} material
   * @param {Array<Object>} sectionHooks
   * @returns {Array<Object>}
   */
  function findExplicitlyLinkedVisualAffordances(sectionId, material, sectionHooks) {
    var sidKey = normKey(sectionId);
    if (!sidKey || !material || typeof material !== "object") return [];
    var hooks = Array.isArray(sectionHooks) ? sectionHooks : [];
    if (!hooks.length) return [];

    var midKey = normKey(material.id != null ? material.id : material.material_id);
    var cidKey = normKey(
      material.commissionId != null ? material.commissionId : material.commission_id
    );
    if (!midKey && !cidKey) return [];

    var expectedAnchors = Object.create(null);
    if (midKey) expectedAnchors[sidKey + ".materials." + midKey] = true;
    if (cidKey) expectedAnchors[sidKey + ".materials." + cidKey] = true;

    return hooks.filter(function (hook) {
      if (!hook || typeof hook !== "object") return false;
      var hookSectionKey = normKey(hook.sectionId != null ? hook.sectionId : hook.section_id);
      if (hookSectionKey && hookSectionKey !== sidKey) return false;

      var hookCid = normKey(
        hook.commissionId != null ? hook.commissionId : hook.commission_id
      );
      if (cidKey && hookCid && hookCid === cidKey) return true;

      var hookMid = normKey(hook.materialId != null ? hook.materialId : hook.material_id);
      if (midKey && hookMid && hookMid === midKey) return true;

      var anchors = Array.isArray(hook.evidenceAnchors)
        ? hook.evidenceAnchors
        : Array.isArray(hook.evidence_anchors)
          ? hook.evidence_anchors
          : [];
      for (var i = 0; i < anchors.length; i += 1) {
        if (expectedAnchors[normKey(anchors[i])]) return true;
      }

      var basisTokens = splitSourceBasisTokens(
        hook.sourceBasis != null ? hook.sourceBasis : hook.source_basis
      );
      for (var j = 0; j < basisTokens.length; j += 1) {
        if (expectedAnchors[basisTokens[j]]) return true;
      }

      return false;
    });
  }

  return {
    VALID_ANCHOR_LINE_RE: VALID_ANCHOR_LINE_RE,
    parseExpositionSegments: parseExpositionSegments,
    stripMaterialAnchorDirectives: stripMaterialAnchorDirectives,
    validateSectionMaterialAnchors: validateSectionMaterialAnchors,
    validateExpositoryDevelopmentAnchors: validateExpositoryDevelopmentAnchors,
    validateAssembledExpositoryAnchors: validateAssembledExpositoryAnchors,
    findExplicitlyLinkedVisualAffordances: findExplicitlyLinkedVisualAffordances
  };
});
