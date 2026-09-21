/**
 * Sprint 85 WP3 — Expository domain-guidance composition.
 * Reuses General + selected-domain prompt-rules via established pack paths.
 * Does not duplicate domain packs into Expository-specific copies.
 *
 * Expository composition filters Interactive activity/rhetoric sections out of
 * Learning Design prompt-rules so domain guidance does not contradict sibling
 * Expository prohibitions.
 */

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.PrismExpositoryDomainGuidance = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var MARKER = "EXPOSITORY-DOMAIN-GUIDANCE (auto-applied)";

  var DEFAULT_RULE_FILES = {
    general: "domains/general/domain-general-prompt-rules.md",
    "learning-design": "domains/learning-design/domain-learning-design-prompt-rules.md",
    research: "domains/research/domain-research-prompt-rules.md"
  };

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function normalizeDomainId(value) {
    return String(value == null ? "" : value)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");
  }

  function resolvePromptRulePath(domainId) {
    var id = normalizeDomainId(domainId);
    if (!id) return "";
    if (DEFAULT_RULE_FILES[id]) return DEFAULT_RULE_FILES[id];
    return "domains/" + id + "/domain-" + id + "-prompt-rules.md";
  }

  function resolvePromptRulePaths(selectedDomains) {
    var incoming = asArray(selectedDomains)
      .map(normalizeDomainId)
      .filter(Boolean);
    var domains = [];
    var seenDomain = {};
    function pushDomain(id) {
      if (!id || seenDomain[id]) return;
      seenDomain[id] = true;
      domains.push(id);
    }
    pushDomain("general");
    incoming.forEach(pushDomain);
    var seen = {};
    var paths = [];
    domains.forEach(function (id) {
      var filePath = resolvePromptRulePath(id);
      if (!filePath || seen[filePath]) return;
      seen[filePath] = true;
      paths.push({ domainId: id, path: filePath });
    });
    return paths;
  }

  function truncateForPrompt(text, maxChars) {
    var src = String(text || "").trim();
    var limit = typeof maxChars === "number" && maxChars > 200 ? maxChars : 2200;
    if (src.length <= limit) return src;
    return src.slice(0, limit) + "\n\n[… domain prompt-rules truncated for Expository step injection …]";
  }

  /**
   * Keep grounding / structure / artefact principles; drop Interactive
   * activity-rhetoric and workshop-oriented sections that conflict with
   * Expository sibling prohibitions.
   */
  function filterRulesForExpository(domainId, rawText) {
    var text = String(rawText || "");
    if (!text.trim()) return "";
    var id = normalizeDomainId(domainId);
    if (id === "learning-design") {
      var cutMarks = [
        /\n##\s*6b\b/i,
        /\n##\s*6c\b/i,
        /\n##\s*6d\b/i,
        /\n##\s*7\b[^\n]*activit/i,
        /\n#+\s*Learner-action rhetoric/i,
        /\n#+\s*Worked-example and faded-support/i,
        /\nFor activities:\s*/i
      ];
      var cutAt = text.length;
      cutMarks.forEach(function (re) {
        var m = re.exec(text);
        if (m && m.index >= 0 && m.index < cutAt) cutAt = m.index;
      });
      text = text.slice(0, cutAt).trim();
    }
    return text;
  }

  function buildDomainGuidanceBlock(options) {
    var opts = options && typeof options === "object" ? options : {};
    var stage = String(opts.stage || "").trim();
    var why = String(opts.why || "").trim();
    var paths = resolvePromptRulePaths(opts.selectedDomains);
    var textsByPath = opts.textsByPath && typeof opts.textsByPath === "object" ? opts.textsByPath : {};
    var parts = [
      "",
      MARKER + ":",
      "- Apply General and selected-domain prompt rules via established pack paths. Do not invent Expository-specific domain pack copies.",
      "- Interactive activity / workspace / evidence rhetoric in domain rules does not apply to Expository sibling stages.",
      stage ? "- Expository stage: " + stage : "",
      why ? "- Why for this stage: " + why : "",
      "- Selected domains: " +
        paths
          .map(function (row) {
            return row.domainId;
          })
          .join(", ")
    ].filter(Boolean);

    var loaded = 0;
    paths.forEach(function (row) {
      var raw = String(textsByPath[row.path] || "").trim();
      if (!raw) return;
      var filtered = filterRulesForExpository(row.domainId, raw);
      if (!filtered) return;
      loaded += 1;
      parts.push("");
      parts.push("### Domain prompt rules (Expository-filtered): " + row.domainId + " (" + row.path + ")");
      parts.push(truncateForPrompt(filtered, opts.maxCharsPerDomain));
    });

    if (!loaded) {
      parts.push("");
      parts.push(
        "- Domain prompt-rule files were not available in cache; still obey General grounding, structured output, and selected-domain instructional principles known for this workflow — without Interactive activity semantics."
      );
    }

    return parts.join("\n");
  }

  function guidanceAlreadyPresent(draftText) {
    return new RegExp(MARKER.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(
      String(draftText || "")
    );
  }

  function applyDomainGuidanceToDraft(draftText, options) {
    var body = String(draftText || "").trim();
    if (!body) return "";
    if (guidanceAlreadyPresent(body)) return body;
    var block = buildDomainGuidanceBlock(options);
    if (!block || !String(block).trim()) return body;
    return (body + "\n" + block).trim();
  }

  return {
    MARKER: MARKER,
    DEFAULT_RULE_FILES: DEFAULT_RULE_FILES,
    resolvePromptRulePath: resolvePromptRulePath,
    resolvePromptRulePaths: resolvePromptRulePaths,
    filterRulesForExpository: filterRulesForExpository,
    buildDomainGuidanceBlock: buildDomainGuidanceBlock,
    guidanceAlreadyPresent: guidanceAlreadyPresent,
    applyDomainGuidanceToDraft: applyDomainGuidanceToDraft
  };
});
