/**
 * Workflow Design Page capture normalization — extract one valid page JSON object.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_WORKFLOW_PAGE_CAPTURE_NORMALIZE = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  function findBalancedJSONObjectEnd(text, startIdx) {
    if (!text || startIdx < 0 || text.charAt(startIdx) !== "{") return -1;
    var depth = 0;
    var inString = false;
    var escaped = false;
    var i;
    for (i = startIdx; i < text.length; i += 1) {
      var ch = text.charAt(i);
      if (inString) {
        if (escaped) {
          escaped = false;
          continue;
        }
        if (ch === "\\") {
          escaped = true;
          continue;
        }
        if (ch === '"') inString = false;
        continue;
      }
      if (ch === '"') {
        inString = true;
        continue;
      }
      if (ch === "{") depth += 1;
      else if (ch === "}") {
        depth -= 1;
        if (depth === 0) return i;
      }
    }
    return -1;
  }

  function isPageArtefactObject(obj) {
    return (
      obj &&
      typeof obj === "object" &&
      !Array.isArray(obj) &&
      String(obj.artifact_type || "").toLowerCase() === "page"
    );
  }

  function tryParsePageObject(jsonText, normalizeFn) {
    var s =
      typeof normalizeFn === "function"
        ? normalizeFn(jsonText)
        : String(jsonText == null ? "" : jsonText).trim();
    if (!s) return null;
    try {
      var parsed = JSON.parse(s);
      return isPageArtefactObject(parsed) ? parsed : null;
    } catch (_) {
      return null;
    }
  }

  function countPageRootMarkers(text) {
    var re = /"artifact_type"\s*:\s*"page"/gi;
    var count = 0;
    var m;
    while (re.exec(text)) count += 1;
    return count;
  }

  function extractFencedJsonBodies(text) {
    var blocks = [];
    var re = /```(?:json)?\s*\r?\n([\s\S]*?)\r?\n```/gi;
    var m;
    while ((m = re.exec(String(text || "")))) {
      blocks.push({ body: String(m[1] || "").trim(), index: m.index });
    }
    return blocks;
  }

  function scorePageCandidate(parsed) {
    var score = 0;
    if (Array.isArray(parsed.sections)) score += parsed.sections.length * 10;
    if (parsed.title) score += 1;
    if (parsed.visual_affordance_schema_version) score += 2;
    if (parsed.generation_notes && typeof parsed.generation_notes === "object") score += 1;
    return score;
  }

  function extractPageObjectCandidates(text, normalizeFn) {
    var s = String(text || "");
    var candidates = [];
    var seen = {};
    var i;

    function pushCandidate(parsed, meta) {
      if (!parsed) return;
      var key;
      try {
        key = JSON.stringify(parsed);
      } catch (_) {
        key = String(meta && meta.index != null ? meta.index : candidates.length);
      }
      if (seen[key]) return;
      seen[key] = true;
      candidates.push({
        parsed: parsed,
        index: meta && meta.index != null ? meta.index : 0,
        source: (meta && meta.source) || "unknown"
      });
    }

    pushCandidate(tryParsePageObject(s, normalizeFn), { source: "direct", index: 0 });

    var fences = extractFencedJsonBodies(s);
    for (i = 0; i < fences.length; i += 1) {
      pushCandidate(tryParsePageObject(fences[i].body, normalizeFn), {
        source: "fence",
        index: fences[i].index
      });
    }

    var searchFrom = 0;
    while (searchFrom < s.length) {
      var pos = s.indexOf('"artifact_type"', searchFrom);
      if (pos === -1) break;
      var start = s.lastIndexOf("{", pos);
      if (start !== -1) {
        var end = findBalancedJSONObjectEnd(s, start);
        if (end !== -1) {
          pushCandidate(tryParsePageObject(s.slice(start, end + 1), normalizeFn), {
            source: "scan",
            index: start
          });
        }
      }
      searchFrom = pos + 13;
    }

    return candidates;
  }

  function selectBestPageCandidate(candidates) {
    if (!candidates.length) return null;
    var sorted = candidates.slice().sort(function (a, b) {
      var scoreDiff = scorePageCandidate(b.parsed) - scorePageCandidate(a.parsed);
      if (scoreDiff !== 0) return scoreDiff;
      return (b.index || 0) - (a.index || 0);
    });
    return sorted[0].parsed;
  }

  function normalizePageWorkflowCapture(raw, options) {
    var opts = options && typeof options === "object" ? options : {};
    var sanitizeFn = opts.sanitizeFn;
    var normalizeFn = opts.normalizeFn;
    var sanitized =
      typeof sanitizeFn === "function" ? sanitizeFn(raw) : String(raw == null ? "" : raw);
    var trimmed = String(sanitized || "").trim();
    if (!trimmed) {
      return {
        ok: false,
        errors: ["empty_capture"],
        message: "Page capture is empty"
      };
    }

    var directParsed = tryParsePageObject(trimmed, normalizeFn);
    var corrupted =
      /```(?:json)?/i.test(trimmed) ||
      countPageRootMarkers(trimmed) > 1 ||
      (directParsed && trimmed.indexOf("```") !== -1);

    if (directParsed && !corrupted) {
      try {
        return {
          ok: true,
          parsed: directParsed,
          json: JSON.stringify(directParsed, null, 2),
          errors: [],
          source: "direct",
          repaired: false
        };
      } catch (err) {
        return {
          ok: false,
          errors: ["stringify_failed"],
          message: String((err && err.message) || err)
        };
      }
    }

    var candidates = extractPageObjectCandidates(trimmed, normalizeFn);
    var best = selectBestPageCandidate(candidates);
    if (!best) {
      return {
        ok: false,
        errors: ["invalid_page_json"],
        message:
          "Page capture is not valid JSON. Expected one object with artifact_type page and no embedded markdown fences or duplicate page objects."
      };
    }

    try {
      return {
        ok: true,
        parsed: best,
        json: JSON.stringify(best, null, 2),
        errors: [],
        source: "extracted",
        repaired: true
      };
    } catch (err2) {
      return {
        ok: false,
        errors: ["stringify_failed"],
        message: String((err2 && err2.message) || err2)
      };
    }
  }

  function validatePageWorkflowCaptureJson(raw, options) {
    var result = normalizePageWorkflowCapture(raw, options);
    if (!result.ok) return result;
    try {
      JSON.parse(result.json);
      return result;
    } catch (err) {
      return {
        ok: false,
        errors: ["round_trip_parse_failed"],
        message: String((err && err.message) || err)
      };
    }
  }

  return {
    findBalancedJSONObjectEnd: findBalancedJSONObjectEnd,
    isPageArtefactObject: isPageArtefactObject,
    extractPageObjectCandidates: extractPageObjectCandidates,
    selectBestPageCandidate: selectBestPageCandidate,
    normalizePageWorkflowCapture: normalizePageWorkflowCapture,
    validatePageWorkflowCaptureJson: validatePageWorkflowCaptureJson
  };
});
