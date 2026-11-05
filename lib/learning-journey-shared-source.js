/**
 * Phase 2 — Learning Journey shared authoritative material.
 *
 * Commissioning (Step 4, chat-context) may still use SHARED markers for
 * soft/optional capture. Design Page (Step 5) is the durable boundary:
 * shared_authoritative_material lives inside the JSON page object and
 * persists write-once onto parent source_context. Does not invent topology
 * or change Phase 1 commission intake.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.PRISM_LEARNING_JOURNEY_SHARED_SOURCE = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var BEGIN_MARKER = "<<<SHARED_AUTHORITATIVE_MATERIAL_BEGIN>>>";
  var END_MARKER = "<<<SHARED_AUTHORITATIVE_MATERIAL_END>>>";
  var NONE_TOKEN = "NONE";
  var MIN_MATERIAL_CHARS = 40;

  function asText(value) {
    return String(value == null ? "" : value).trim();
  }

  function normalizeNewlines(value) {
    return asText(value).replace(/\r\n/g, "\n");
  }

  /**
   * Extract the shared-material block from a Commissioning artefact.
   * Returns kind: "material" | "none" | "missing" | "malformed".
   */
  function extractSharedAuthoritativeMaterial(commissionText) {
    var text = normalizeNewlines(commissionText);
    if (!text) {
      return {
        ok: false,
        kind: "missing",
        body: "",
        errors: ["shared_material_block_missing"]
      };
    }
    var beginAt = text.indexOf(BEGIN_MARKER);
    var endAt = text.indexOf(END_MARKER);
    if (beginAt === -1 || endAt === -1) {
      return {
        ok: false,
        kind: "missing",
        body: "",
        errors: ["shared_material_markers_missing"]
      };
    }
    if (endAt <= beginAt) {
      return {
        ok: false,
        kind: "malformed",
        body: "",
        errors: ["shared_material_markers_unordered"]
      };
    }
    var inner = text.slice(beginAt + BEGIN_MARKER.length, endAt).trim();
    if (!inner) {
      return {
        ok: false,
        kind: "malformed",
        body: "",
        errors: ["shared_material_block_empty"]
      };
    }
    if (/^NONE$/i.test(inner)) {
      return { ok: true, kind: "none", body: "", errors: [] };
    }
    if (inner.length < MIN_MATERIAL_CHARS) {
      return {
        ok: false,
        kind: "malformed",
        body: inner,
        errors: ["shared_material_block_too_short"]
      };
    }
    // Reject obvious placeholder / incomplete bodies.
    if (
      /\b(TBD|TODO|placeholder|insert (dataset|scenario|material) here)\b/i.test(inner) ||
      /^\[.*\]$/.test(inner)
    ) {
      return {
        ok: false,
        kind: "malformed",
        body: inner,
        errors: ["shared_material_block_incomplete"]
      };
    }
    return { ok: true, kind: "material", body: inner, errors: [] };
  }

  /**
   * True when commission Educational job / specification-like prose appears to
   * dump the full shared corpus (heuristic gate for tests / soft checks).
   */
  function commissionTextLooksLikeFullSharedDump(commissionFieldText, sharedBody) {
    var field = normalizeNewlines(commissionFieldText);
    var shared = normalizeNewlines(sharedBody);
    if (!field || !shared || shared.length < MIN_MATERIAL_CHARS) return false;
    if (field.indexOf(shared) !== -1) return true;
    // Numeric STEM heuristic: several distinctive number tokens from the shared body.
    var nums = shared.match(/\b\d{2,}\b/g) || [];
    if (nums.length < 4) return false;
    var hits = 0;
    var seen = {};
    var i;
    for (i = 0; i < nums.length; i += 1) {
      var n = nums[i];
      if (seen[n]) continue;
      seen[n] = true;
      if (field.indexOf(n) !== -1) hits += 1;
    }
    return hits >= 6;
  }

  function wrapSharedAuthoritativeMaterial(bodyOrNone) {
    var inner = asText(bodyOrNone) || NONE_TOKEN;
    return BEGIN_MARKER + "\n" + inner + "\n" + END_MARKER;
  }

  function sampleMean(values) {
    if (!values || !values.length) return null;
    var sum = 0;
    var i;
    for (i = 0; i < values.length; i += 1) sum += values[i];
    return sum / values.length;
  }

  function sampleStandardDeviation(values) {
    if (!values || values.length < 2) return null;
    var mean = sampleMean(values);
    var acc = 0;
    var i;
    for (i = 0; i < values.length; i += 1) {
      var d = values[i] - mean;
      acc += d * d;
    }
    return Math.sqrt(acc / (values.length - 1));
  }

  function formatStat(value, digits) {
    var n = Number(value);
    if (!isFinite(n)) return "";
    var d = typeof digits === "number" ? digits : 4;
    return String(Number(n.toFixed(d)));
  }

  function parseObservationNumberList(raw) {
    return String(raw || "")
      .split(/[,\s;|/]+/)
      .map(function (part) {
        return Number(String(part || "").replace(/[^\d.+-]/g, ""));
      })
      .filter(function (n) {
        return isFinite(n);
      });
  }

  function collectObservationLists(text) {
    var lists = [];
    var seen = {};
    function pushList(label, nums, index) {
      if (!nums || nums.length < 3) return;
      var key = asText(label) + ":" + nums.join(",");
      if (seen[key]) return;
      seen[key] = true;
      lists.push({
        label: asText(label) || "observations",
        values: nums,
        mean: sampleMean(nums),
        sd: sampleStandardDeviation(nums),
        index: typeof index === "number" ? index : 0
      });
    }

    // "Label: n1, n2, n3, ..." (comma-separated; avoids bare temperatures).
    var commaListRe =
      /([^\n:]{1,100}):\s*((?:\d+(?:\.\d+)?\s*,\s*)+\d+(?:\.\d+)?)(?:\s*(?:s|seconds|sec))?/gi;
    var match;
    while ((match = commaListRe.exec(text)) !== null) {
      pushList(match[1], parseObservationNumberList(match[2]), match.index);
    }

    // "Condition A ... 93, 89, 96, 91, 94, 87" even without a colon-terminated label.
    var conditionListRe =
      /(Condition\s+[A-Z0-9]+[^\n]{0,60}?)(?:\n|:|\s[–—-]\s|\s)((?:\d+(?:\.\d+)?\s*,\s*){2,}\d+(?:\.\d+)?)/gi;
    while ((match = conditionListRe.exec(text)) !== null) {
      pushList(match[1], parseObservationNumberList(match[2]), match.index);
    }

    // Trial table used by STEM Design Pages:
    // Trial | Condition A: 20 °C (s) | Condition B: 40 °C (s)
    // 1 | 93 | 78
    // 2 | 89 | 72
    var headerRe =
      /Trial\s*\|\s*(Condition\s+[A-Z0-9]+[^\n|]*)\|\s*(Condition\s+[A-Z0-9]+[^\n|]*)/gi;
    var header;
    while ((header = headerRe.exec(text)) !== null) {
      var labelA = asText(header[1]);
      var labelB = asText(header[2]);
      var rowStart = header.index + header[0].length;
      var rest = text.slice(rowStart);
      var rowRe = /^\s*\d+\s*\|\s*(-?\d+(?:\.\d+)?)\s*\|\s*(-?\d+(?:\.\d+)?)\s*$/gm;
      var valsA = [];
      var valsB = [];
      var row;
      while ((row = rowRe.exec(rest)) !== null) {
        // Stop if we left the table block (blank line then non-row content already
        // handled by ^ anchors; break if a large gap after first rows).
        valsA.push(Number(row[1]));
        valsB.push(Number(row[2]));
        if (valsA.length >= 20) break;
      }
      pushList(labelA, valsA, header.index);
      pushList(labelB, valsB, header.index + 1);
    }

    return lists;
  }

  function inferConditionTokenNearClaim(text, offset, fullMatch) {
    var embedded = String(fullMatch || "").match(/Condition\s+([A-Z0-9]+)/i);
    if (embedded) return embedded[1];
    var lineStart = String(text || "").lastIndexOf("\n", Math.max(0, offset - 1)) + 1;
    var linePrefix = String(text || "").slice(lineStart, offset);
    var onLine = linePrefix.match(/Condition\s+([A-Z0-9]+)/i);
    if (onLine) return onLine[1];
    var window = String(text || "").slice(Math.max(0, offset - 180), offset);
    var all = window.match(/Condition\s+[A-Z0-9]+/gi) || [];
    if (!all.length) return "";
    var last = all[all.length - 1].match(/Condition\s+([A-Z0-9]+)/i);
    return last ? last[1] : "";
  }

  function conditionIndexFromToken(token) {
    var t = String(token || "").toUpperCase();
    if (/^[A-Z]$/.test(t)) return t.charCodeAt(0) - 65;
    var n = Number(t);
    return isFinite(n) ? n - 1 : NaN;
  }

  function listHasConditionLabel(list) {
    return !!(list && /Condition\s+[A-Z0-9]+/i.test(String(list.label || "")));
  }

  function observationListsIncludeConditions(lists) {
    var i;
    for (i = 0; i < (lists || []).length; i += 1) {
      if (listHasConditionLabel(lists[i])) return true;
    }
    return false;
  }

  /**
   * Worked-example / practice-dataset regions are separate from the main
   * investigation and must not be cross-checked against Condition A/B claims.
   */
  function isWorkedExampleRegion(text, offset) {
    var body = String(text || "");
    var at = typeof offset === "number" ? offset : 0;
    var markers = [
      /CANONICAL WORKED[- ]EXAMPLE[\s\S]*?(?=\nCANONICAL |\nPROGRESSIVE DISCLOSURE|\n[A-Z]{3,}[A-Z _-]{8,}|\n*$)/gi,
      /separate (?:illustrative |practice |worked[- ]example )?dataset[\s\S]{0,500}/gi,
      /worked[- ]example dataset[\s\S]{0,500}/gi,
      /practice dataset[\s\S]{0,500}/gi
    ];
    var m;
    var i;
    for (i = 0; i < markers.length; i += 1) {
      markers[i].lastIndex = 0;
      while ((m = markers[i].exec(body)) !== null) {
        if (at >= m.index && at < m.index + m[0].length) return true;
      }
    }
    return false;
  }

  function resolveObservationListForClaim(lists, conditionToken, aroundIndex) {
    if (!lists || !lists.length) return null;
    var hasConditions = observationListsIncludeConditions(lists);
    if (conditionToken) {
      var byCond = null;
      var i;
      for (i = 0; i < lists.length; i += 1) {
        var label = String(lists[i].label || "");
        var m = label.match(/Condition\s+([A-Z0-9]+)/i);
        if (m && String(m[1]).toUpperCase() === String(conditionToken).toUpperCase()) {
          byCond = lists[i];
          break;
        }
      }
      if (byCond) return byCond;
      var idx = conditionIndexFromToken(conditionToken);
      // Index fallback only among Condition-labeled lists when present.
      var pool = hasConditions
        ? lists.filter(listHasConditionLabel)
        : lists;
      if (isFinite(idx) && idx >= 0 && idx < pool.length) return pool[idx];
      return null;
    }
    // When Condition A/B lists exist, never silently attach unlabeled claims
    // (e.g. worked-example "mean = 12", "SD = 2") to the nearest condition.
    if (hasConditions) return null;
    var best = null;
    var j;
    for (j = 0; j < lists.length; j += 1) {
      if (lists[j].index <= aroundIndex) best = lists[j];
    }
    return best || lists[0];
  }

  /**
   * Rounded display forms authors often paste (3.3862 → 3.39, 3.4).
   */
  function claimedNumericVariants(claimed) {
    var n = Number(claimed);
    if (!isFinite(n)) return [];
    var out = [];
    var seen = {};
    function add(v) {
      var s = String(v);
      if (!s || seen[s]) return;
      seen[s] = true;
      out.push(s);
    }
    add(claimed);
    add(formatStat(n, 4));
    add(formatStat(n, 3));
    add(formatStat(n, 2));
    add(n.toFixed(2));
    add(n.toFixed(1));
    return out;
  }

  function textContainsClaimedVariant(text, claimed) {
    var body = String(text || "");
    if (!body) return false;
    var variants = claimedNumericVariants(claimed);
    var i;
    for (i = 0; i < variants.length; i += 1) {
      var token = variants[i];
      if (!token) continue;
      // Word-ish boundary so "3.39" does not match inside "13.39".
      var re = new RegExp(
        "(^|[^\\d.])" + token.replace(/\./g, "\\.") + "(?=$|[^\\d])"
      );
      if (re.test(body)) return true;
    }
    return false;
  }

  /**
   * True when commission prose repeats a bad derived statistic for the same
   * investigation condition/statistic — not merely the bare number.
   */
  function commissionContainsContradictoryStatisticClaim(blob, correction) {
    var text = String(blob || "");
    if (!text || !correction || correction.claimed == null) return false;
    if (!textContainsClaimedVariant(text, correction.claimed)) return false;

    var isSd = String(correction.statistic || "") === "sample_sd";
    var statRe = isSd
      ? /standard\s+deviations?|\bs\.?d\.?\b|sample\s+sd/i
      : /\bmeans?\b|central\s+tendency/i;
    if (!statRe.test(text)) return false;

    var cond = asText(correction.condition).toUpperCase();
    if (cond) {
      var condRe = new RegExp(
        "Condition\\s+" + cond + "|Conditions\\s+[A-Z0-9]+\\s+and\\s+[A-Z0-9]+",
        "i"
      );
      if (!condRe.test(text)) return false;
    }

    // Reject matches that live only in worked-example / practice-dataset prose.
    if (
      /worked[- ]example|practice dataset|separate (?:illustrative|practice) dataset/i.test(
        text
      ) &&
      !/Condition\s+[A-Z]/i.test(text)
    ) {
      return false;
    }
    return true;
  }

  /**
   * Deterministic correction: when observation lists and claimed sample mean / SD
   * appear in the corpus, recompute and replace incorrect claims.
   * Handles common Design Page phrasings (Condition A:, "for Condition A is", ≈).
   */
  function sanitizeDerivedStatisticsInSharedMaterial(materialText) {
    var text = normalizeNewlines(materialText).replace(/\\n/g, "\n");
    if (!text) {
      return { text: "", corrections: [] };
    }
    var corrections = [];
    var lists = collectObservationLists(text);
    if (!lists.length) {
      return { text: text, corrections: corrections };
    }

    function recordAndRewriteClaim(full, condToken, claimedRaw, unit, offset) {
      var claimed = Number(claimedRaw);
      if (!isFinite(claimed)) return full;
      if (isWorkedExampleRegion(text, offset)) return full;
      var token = condToken || inferConditionTokenNearClaim(text, offset, full);
      var list = resolveObservationListForClaim(lists, token, offset);
      if (!list) return full;
      var isSd = /deviation|\bsd\b|s\.d\./i.test(String(full || ""));
      var actual = isSd ? list.sd : list.mean;
      if (actual == null || !isFinite(actual)) return full;
      if (Math.abs(actual - claimed) <= 0.01) return full;
      var corrected = formatStat(actual, 4);
      corrections.push({
        label: list.label,
        statistic: isSd ? "sample_sd" : "sample_mean",
        claimed: claimed,
        corrected: Number(corrected),
        condition: asText(token) || (listHasConditionLabel(list)
          ? (String(list.label).match(/Condition\s+([A-Z0-9]+)/i) || [])[1] || ""
          : "")
      });
      var unitPart = unit ? " " + unit : "";
      var condPrefix = token ? "Condition " + String(token).toUpperCase() + " " : "";
      var statName = isSd ? "sample standard deviation" : "sample mean";
      return condPrefix + statName + " = " + corrected + unitPart;
    }

    var next = text;

    // Paired rounded SDs first (Condition A then B):
    // "standard deviations are approximately 3.39 s and 4.04 s"
    next = next.replace(
      /((?:sample\s+)?standard\s+deviations?\b[^\n]{0,80}?)(-?\d+(?:\.\d+)?)\s*(s|seconds|sec)?(\s+and\s+)(-?\d+(?:\.\d+)?)\s*(s|seconds|sec)?/gi,
      function (full, lead, firstRaw, firstUnit, mid, secondRaw, secondUnit, offset) {
        if (isWorkedExampleRegion(text, offset)) return full;
        // Dual SD sentences map to Condition A then B when those lists exist.
        var firstList = resolveObservationListForClaim(lists, "A", offset);
        var secondList = resolveObservationListForClaim(lists, "B", offset);
        if (!firstList || !secondList) return full;
        var firstClaimed = Number(firstRaw);
        var secondClaimed = Number(secondRaw);
        var firstActual = firstList.sd;
        var secondActual = secondList.sd;
        var firstPart = String(firstRaw);
        var secondPart = String(secondRaw);
        if (
          isFinite(firstClaimed) &&
          firstActual != null &&
          isFinite(firstActual) &&
          Math.abs(firstActual - firstClaimed) > 0.01
        ) {
          firstPart = formatStat(firstActual, 4);
          corrections.push({
            label: firstList.label,
            statistic: "sample_sd",
            claimed: firstClaimed,
            corrected: Number(firstPart),
            condition: "A"
          });
        }
        if (
          isFinite(secondClaimed) &&
          secondActual != null &&
          isFinite(secondActual) &&
          Math.abs(secondActual - secondClaimed) > 0.01
        ) {
          secondPart = formatStat(secondActual, 4);
          corrections.push({
            label: secondList.label,
            statistic: "sample_sd",
            claimed: secondClaimed,
            corrected: Number(secondPart),
            condition: "B"
          });
        }
        var u1 = firstUnit ? " " + firstUnit : "";
        var u2 = secondUnit ? " " + secondUnit : "";
        return String(lead || "") + firstPart + u1 + String(mid || " and ") + secondPart + u2;
      }
    );

    // Single claims, including "Condition A: n=6; ... sample standard deviation = 3.3862 s"
    var claimRe =
      /(?:Condition\s+([A-Z0-9]+)\s*[:\-–—]?\s*)?(?:(?:the\s+)?(?:sample\s+)?(?:standard\s+deviation|s\.d\.|\bsd\b|mean))(?:\s+for\s+Condition\s+([A-Z0-9]+))?\s*(?:[=:]|of|is|approximately|approx\.?|≈|~)?\s*(-?\d+(?:\.\d+)?)\s*(s|seconds|sec)?/gi;

    next = next.replace(
      claimRe,
      function (full, condBefore, condAfter, claimedRaw, unit, offset) {
        return recordAndRewriteClaim(
          full,
          condBefore || condAfter || "",
          claimedRaw,
          unit,
          offset
        );
      }
    );

    return { text: next, corrections: corrections };
  }

  /**
   * Extract + optionally sanitize derived statistics before persistence.
   */
  function extractAndSanitizeSharedAuthoritativeMaterial(commissionText) {
    var extracted = extractSharedAuthoritativeMaterial(commissionText);
    if (!extracted || !extracted.ok || extracted.kind !== "material") return extracted;
    var sanitized = sanitizeDerivedStatisticsInSharedMaterial(extracted.body);
    return {
      ok: true,
      kind: "material",
      body: sanitized.text || extracted.body,
      errors: [],
      corrections: sanitized.corrections || []
    };
  }

  /**
   * Prompt section for Commissioning (chat-context Step 4).
   * When established material exists, instruct verbatim reuse inside markers.
   */
  function composeAuthoritativeSharedSourcePromptSection(existingSourceContext) {
    var existing = normalizeNewlines(existingSourceContext);
    if (existing) {
      return [
        "AUTHORITATIVE SHARED SOURCE ALREADY ESTABLISHED",
        "",
        "The following material is already the authoritative shared source for this Learning Journey.",
        "Use it without modification or replacement. Do not invent alternative values, facts, cast, or figures.",
        "Emit this exact material verbatim inside the SHARED_AUTHORITATIVE_MATERIAL markers below (copy it; do not regenerate).",
        "Design commissions against these established facts, using progressive disclosure — do not paste the full shared source into each commission's Educational job or continuity fields.",
        "",
        wrapSharedAuthoritativeMaterial(existing)
      ].join("\n");
    }
    return [
      "AUTHORITATIVE SHARED SOURCE — DETERMINE AND LOCK",
      "",
      "No authoritative shared source is established yet for this Learning Journey.",
      "Before writing commissions, determine whether multiple learner-facing experiences need one locked shared corpus",
      "(illustrative dataset, fictional scenario, or case study) so later independently generated products stay consistent.",
      "",
      "If shared material is required:",
      "- Generate exactly one canonical illustrative/synthetic source.",
      "- Include all facts, figures, cast, options and constraints commissions must share.",
      "- Label it clearly as illustrative, fictional or synthetic — not experimentally verified or authentically sourced.",
      "- Do not fabricate real quotations, copyrighted source passages, or purportedly authentic research findings.",
      "- Shared material supports the learning progression; it does not dictate product structure.",
      "",
      "If shared material is not required, emit exactly NONE inside the markers.",
      "",
      "Then design commissions against those established facts (or the explicit absence of shared material),",
      "using progressive disclosure. Do not paste the full shared corpus into Educational job / continuity fields."
    ].join("\n");
  }

  /**
   * Prompt section for Design Page (Step 5 JSON capture).
   * Shared material is a top-level JSON property, not external markers.
   */
  function composeAuthoritativeSharedSourceDesignPageSection(existingSourceContext) {
    var existing = normalizeNewlines(existingSourceContext);
    if (existing) {
      return [
        "AUTHORITATIVE SHARED SOURCE ALREADY ESTABLISHED",
        "",
        "The following material is already the authoritative shared source for this Learning Journey.",
        "Copy it verbatim into shared_authoritative_material with status \"provided\". Do not regenerate or alter it.",
        "",
        existing
      ].join("\n");
    }
    return [
      "AUTHORITATIVE SHARED SOURCE — CARRY FROM STEP 4 INTO JSON",
      "",
      "No parent source_context is established yet. Carry Step 4's shared material into the Design Page JSON property shared_authoritative_material:",
      '- status \"generated\" with the canonical corpus in content; or',
      '- status \"none\" with content \"\".',
      "Prefer raw observations and scenario facts. Derived sample means/SDs must match listed observations exactly.",
      "Do not paste the full corpus into commissions[].specification_text or journey_context_text."
    ].join("\n");
  }

  /**
   * Read shared_authoritative_material from a Design Page object.
   * Missing property is legacy-compatible (kind: "absent").
   */
  function extractSharedAuthoritativeMaterialFromPage(page) {
    if (!page || typeof page !== "object" || Array.isArray(page)) {
      return { ok: false, kind: "invalid_page", status: "", content: "", errors: ["invalid_page"] };
    }
    if (!Object.prototype.hasOwnProperty.call(page, "shared_authoritative_material")) {
      return { ok: true, kind: "absent", status: "", content: "", errors: [] };
    }
    var raw = page.shared_authoritative_material;
    if (raw == null) {
      return { ok: true, kind: "absent", status: "", content: "", errors: [] };
    }
    if (typeof raw === "string") {
      var asString = normalizeNewlines(raw);
      if (!asString || /^NONE$/i.test(asString)) {
        return { ok: true, kind: "none", status: "none", content: "", errors: [] };
      }
      if (asString.length < MIN_MATERIAL_CHARS) {
        return {
          ok: false,
          kind: "malformed",
          status: "generated",
          content: asString,
          errors: ["shared_authoritative_material_too_short"]
        };
      }
      return { ok: true, kind: "material", status: "generated", content: asString, errors: [] };
    }
    if (typeof raw !== "object" || Array.isArray(raw)) {
      return {
        ok: false,
        kind: "malformed",
        status: "",
        content: "",
        errors: ["shared_authoritative_material_invalid_shape"]
      };
    }
    var status = asText(raw.status || raw.Status).toLowerCase();
    var content = normalizeNewlines(raw.content || raw.Content || "");
    if (status === "none") {
      return { ok: true, kind: "none", status: "none", content: "", errors: [] };
    }
    if (status !== "generated" && status !== "provided") {
      return {
        ok: false,
        kind: "malformed",
        status: status,
        content: content,
        errors: ["shared_authoritative_material_status_invalid"]
      };
    }
    if (!content) {
      return {
        ok: false,
        kind: "malformed",
        status: status,
        content: "",
        errors: ["shared_authoritative_material_content_empty"]
      };
    }
    if (content.length < MIN_MATERIAL_CHARS) {
      return {
        ok: false,
        kind: "malformed",
        status: status,
        content: content,
        errors: ["shared_authoritative_material_too_short"]
      };
    }
    return { ok: true, kind: "material", status: status, content: content, errors: [] };
  }

  function extractAndSanitizeSharedAuthoritativeMaterialFromPage(page) {
    var extracted = extractSharedAuthoritativeMaterialFromPage(page);
    if (!extracted || !extracted.ok || extracted.kind !== "material") return extracted;
    var originalContent = extracted.content;
    var sanitized = sanitizeDerivedStatisticsInSharedMaterial(originalContent);
    return {
      ok: true,
      kind: "material",
      status: extracted.status,
      content: sanitized.text || originalContent,
      originalContent: originalContent,
      errors: [],
      corrections: sanitized.corrections || []
    };
  }

  function commissionProseBlob(commission) {
    if (!commission || typeof commission !== "object") return "";
    return [
      commission.specification_text || commission.specificationText || "",
      commission.journey_context_text || commission.journeyContextText || ""
    ].join("\n");
  }

  function pushContradictionError(errors, commission, index, claimed) {
    var code =
      "commissions[" +
      asText((commission && commission.commission_id) || index) +
      "].contradictory_derived_statistic:" +
      String(claimed);
    if (errors.indexOf(code) === -1) errors.push(code);
  }

  /**
   * Detect commission prose that repeats incorrect derived statistics relative to
   * the authoritative shared corpus (e.g. wrong sample SD / rounded 3.39).
   * Pass the ORIGINAL shared content (before sanitise) so shared-side corrections
   * remain visible for commission scanning.
   */
  function collectContradictoryDerivedStatisticErrors(page, sharedContent, options) {
    var errors = [];
    var opts = options && typeof options === "object" ? options : {};
    var shared = normalizeNewlines(sharedContent).replace(/\\n/g, "\n");
    if (!shared || !page || !Array.isArray(page.commissions)) return errors;

    var sanitizedShared =
      opts.precomputedSharedSanitize &&
      typeof opts.precomputedSharedSanitize === "object"
        ? opts.precomputedSharedSanitize
        : sanitizeDerivedStatisticsInSharedMaterial(shared);
    var authoritative = sanitizedShared.text || shared;
    var claimedInShared = sanitizedShared.corrections || [];

    var i;
    for (i = 0; i < claimedInShared.length; i += 1) {
      var bad = claimedInShared[i];
      if (!bad || bad.claimed == null) continue;
      // Ignore unlabeled corrections (worked-example / ambiguous pairing).
      if (!asText(bad.condition) && !/Condition\s+[A-Z0-9]+/i.test(String(bad.label || ""))) {
        continue;
      }
      var c;
      for (c = 0; c < page.commissions.length; c += 1) {
        var commission = page.commissions[c];
        if (commissionContainsContradictoryStatisticClaim(commissionProseBlob(commission), bad)) {
          pushContradictionError(errors, commission, c, bad.claimed);
        }
      }
    }

    // Flag commission claims that disagree with recomputed Condition stats.
    // Sanitize each commission against the shared corpus alone so practice-dataset
    // prose in other commissions cannot invent cross-commission false positives.
    var k;
    for (k = 0; k < page.commissions.length; k += 1) {
      var row = page.commissions[k];
      var blob = commissionProseBlob(row);
      if (!blob) continue;
      var check = sanitizeDerivedStatisticsInSharedMaterial(authoritative + "\n" + blob);
      var j;
      for (j = 0; j < (check.corrections || []).length; j += 1) {
        var corr = check.corrections[j];
        if (!corr || corr.claimed == null) continue;
        if (
          !asText(corr.condition) &&
          !/Condition\s+[A-Z0-9]+/i.test(String(corr.label || ""))
        ) {
          continue;
        }
        if (commissionContainsContradictoryStatisticClaim(blob, corr)) {
          pushContradictionError(errors, row, k, corr.claimed);
        }
      }
    }
    return errors;
  }

  /**
   * Narrow repair helper: clear only parent source_context slots on one workflow
   * object so a corrected Step 5 capture can be accepted. Does not touch steps,
   * captures, commissions, or other brief factors. Caller must persist.
   */
  function clearSharedSourceOnWorkflowBriefResolution(wf) {
    if (!wf || typeof wf !== "object") {
      return { ok: false, code: "workflow_required", cleared: false };
    }
    if (!wf.workflowBriefResolution || typeof wf.workflowBriefResolution !== "object") {
      wf.workflowBriefResolution = {};
    }
    var brief = wf.workflowBriefResolution;
    if (!brief.resolvedFactors || typeof brief.resolvedFactors !== "object") {
      brief.resolvedFactors = {};
    }
    if (!brief.initialBrief || typeof brief.initialBrief !== "object") {
      brief.initialBrief = {};
    }
    var had =
      asText(brief.resolvedFactors.source_context) ||
      asText(brief.initialBrief.sourceContext) ||
      asText(brief.initialBrief.source_context) ||
      asText(wf.artefacts);
    brief.resolvedFactors.source_context = "";
    brief.initialBrief.sourceContext = "";
    brief.initialBrief.source_context = "";
    // Repair must also clear artefacts: readLearningJourneyAuthoritativeSourceContext
    // falls back to wf.artefacts, which previously re-armed write-once skip.
    wf.artefacts = "";
    return {
      ok: true,
      cleared: true,
      code: "source_context_cleared",
      previous: had
    };
  }

  /**
   * Persist material onto workflowBriefResolution.resolvedFactors.source_context
   * only when that authoritative slot is currently empty.
   */
  function applySharedSourceToWorkflowBriefResolution(wf, materialText, options) {
    var opts = options && typeof options === "object" ? options : {};
    var material = normalizeNewlines(materialText);
    if (!wf || typeof wf !== "object") {
      return { ok: false, code: "workflow_required", written: false };
    }
    if (!wf.workflowBriefResolution || typeof wf.workflowBriefResolution !== "object") {
      wf.workflowBriefResolution = {};
    }
    var brief = wf.workflowBriefResolution;
    if (!brief.resolvedFactors || typeof brief.resolvedFactors !== "object") {
      brief.resolvedFactors = {};
    }
    if (!brief.initialBrief || typeof brief.initialBrief !== "object") {
      brief.initialBrief = {};
    }
    var seed = brief.resolvedFactors;
    var initial = brief.initialBrief;
    var existing = asText(
      seed.source_context || initial.sourceContext || initial.source_context || ""
    );
    if (!existing && opts.readExisting && typeof opts.readExisting === "function") {
      existing = asText(opts.readExisting(wf));
    }
    if (existing) {
      return {
        ok: true,
        written: false,
        skipped: true,
        code: "source_context_already_set",
        sourceContext: existing
      };
    }
    if (!material) {
      return { ok: true, written: false, skipped: true, code: "empty_material", sourceContext: "" };
    }
    seed.source_context = material;
    initial.sourceContext = material;
    // Keep artefacts aligned when previously empty (Create path).
    if (!asText(wf.artefacts)) {
      wf.artefacts = material;
    }
    return {
      ok: true,
      written: true,
      skipped: false,
      code: "source_context_written",
      sourceContext: material
    };
  }

  return {
    BEGIN_MARKER: BEGIN_MARKER,
    END_MARKER: END_MARKER,
    NONE_TOKEN: NONE_TOKEN,
    MIN_MATERIAL_CHARS: MIN_MATERIAL_CHARS,
    extractSharedAuthoritativeMaterial: extractSharedAuthoritativeMaterial,
    extractAndSanitizeSharedAuthoritativeMaterial: extractAndSanitizeSharedAuthoritativeMaterial,
    extractSharedAuthoritativeMaterialFromPage: extractSharedAuthoritativeMaterialFromPage,
    extractAndSanitizeSharedAuthoritativeMaterialFromPage:
      extractAndSanitizeSharedAuthoritativeMaterialFromPage,
    collectContradictoryDerivedStatisticErrors: collectContradictoryDerivedStatisticErrors,
    sanitizeDerivedStatisticsInSharedMaterial: sanitizeDerivedStatisticsInSharedMaterial,
    textContainsClaimedVariant: textContainsClaimedVariant,
    claimedNumericVariants: claimedNumericVariants,
    sampleMean: sampleMean,
    sampleStandardDeviation: sampleStandardDeviation,
    commissionTextLooksLikeFullSharedDump: commissionTextLooksLikeFullSharedDump,
    wrapSharedAuthoritativeMaterial: wrapSharedAuthoritativeMaterial,
    composeAuthoritativeSharedSourcePromptSection: composeAuthoritativeSharedSourcePromptSection,
    composeAuthoritativeSharedSourceDesignPageSection:
      composeAuthoritativeSharedSourceDesignPageSection,
    applySharedSourceToWorkflowBriefResolution: applySharedSourceToWorkflowBriefResolution,
    clearSharedSourceOnWorkflowBriefResolution: clearSharedSourceOnWorkflowBriefResolution
  };
});
