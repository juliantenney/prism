/**
 * Sprint 51 — learner-page pedagogic salience (renderer only).
 * Wraps recognised Sprint 51 markdown sections in role callouts; splits checklist diagnostics.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_LD_PEDAGOGIC_SALIENCE_RENDER = api;
  }
})(
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this,
  function () {
    "use strict";

    var MODULE_ID = "LD-PEDAGOGIC-SALIENCE-RENDER";

    var CALLOUTS = [
      {
        id: "expert-insight",
        match: "what experts notice",
        label: "What experts notice",
        cue: "How experts think"
      },
      {
        id: "quality-commentary",
        match: "why this works",
        label: "Why this works",
        cue: "Why the model is strong"
      },
      {
        id: "diagnostic",
        match: "common mistakes",
        label: "Common mistakes",
        cue: "Weaknesses to avoid"
      },
      {
        id: "revision",
        match: "if any check is not met",
        label: "If any check is not met",
        cue: "How to improve"
      }
    ];

    var MISTAKES_HEADING_RE = /^##\s+Common mistakes\s*:?\s*$/i;
    var REVISION_HEADING_RE = /^###\s+If any check is not met:?\s*$/i;

    function escapeHtml(text) {
      return String(text == null ? "" : text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    function escapeRegex(text) {
      return String(text || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function findHeadingLineIndex(lines, re) {
      for (var i = 0; i < lines.length; i += 1) {
        if (re.test(String(lines[i] || "").trim())) return i;
      }
      return -1;
    }

    function splitChecklistPedagogicSections(markdown) {
      var text = String(markdown == null ? "" : markdown).replace(/\r\n/g, "\n");
      var lines = text.split("\n");
      var mistakesLine = findHeadingLineIndex(lines, MISTAKES_HEADING_RE);
      var reviseLine = findHeadingLineIndex(lines, REVISION_HEADING_RE);

      if (mistakesLine === -1 && reviseLine === -1) {
        return {
          hasPedagogicSections: false,
          verification: text,
          diagnostic: "",
          revision: ""
        };
      }

      var splitAt = mistakesLine !== -1 ? mistakesLine : reviseLine;
      var verification = lines.slice(0, splitAt).join("\n").trim();
      var diagnostic = "";
      var revision = "";

      if (mistakesLine !== -1) {
        var diagnosticEnd =
          reviseLine !== -1 && reviseLine > mistakesLine ? reviseLine : lines.length;
        diagnostic = lines.slice(mistakesLine, diagnosticEnd).join("\n").trim();
        if (reviseLine !== -1 && reviseLine > mistakesLine) {
          revision = lines.slice(reviseLine).join("\n").trim();
        }
      } else if (reviseLine !== -1) {
        revision = lines.slice(reviseLine).join("\n").trim();
      }

      return {
        hasPedagogicSections: true,
        verification: verification,
        diagnostic: diagnostic,
        revision: revision
      };
    }

    function applyDiagnosticListClass(content) {
      var body = String(content || "");
      if (body.indexOf("util-diagnostic-list") !== -1) return body;
      body = body.replace(/<ul class="util-checkbox-list"/gi, '<ul class="util-diagnostic-list"');
      body = body.replace(/<span class="util-checkbox"[^>]*>[\s\S]*?<\/span>/gi, "");
      body = body.replace(/<ul>/gi, '<ul class="util-diagnostic-list">');
      body = body.replace(/<ul class="([^"]*)"/gi, function (match, cls) {
        if (cls.indexOf("util-diagnostic-list") !== -1 || cls.indexOf("util-checkbox-list") !== -1) {
          return match;
        }
        return '<ul class="' + cls + " util-diagnostic-list" + '"';
      });
      return body;
    }

    function wrapPedagogicSalienceSectionsInHtml(html) {
      var out = String(html == null ? "" : html);
      if (!out.trim()) return out;

      CALLOUTS.forEach(function (cfg) {
        if (out.indexOf("util-pedagogic-callout--" + cfg.id) !== -1) return;

        var headingPattern = escapeRegex(cfg.match).replace(/\\\s\+/g, "\\s+");
        var headingRe = new RegExp(
          "(<h[45][^>]*class=\"[^\"]*util-card-subheading[^\"]*\"[^>]*>\\s*" +
            headingPattern +
            "\\s*:?\\s*</h[45]>\\s*)" +
            "([\\s\\S]*?)(?=<h[45][^>]*class=\"[^\"]*util-card-subheading|<p>\\s*<strong>Bridge:|<aside class=\"util-pedagogic-callout|$)",
          "i"
        );

        out = out.replace(headingRe, function (_match, _heading, content) {
          var body = String(content || "").trim();
          if (cfg.id === "diagnostic") {
            body = applyDiagnosticListClass(body);
          }
          var cueHtml = cfg.cue
            ? '<p class="util-pedagogic-callout__cue">' + escapeHtml(cfg.cue) + "</p>"
            : "";
          return (
            '<aside class="util-pedagogic-callout util-pedagogic-callout--' +
            cfg.id +
            ' util-material-role-guidance" role="note" data-pedagogic-salience="' +
            cfg.id +
            '">' +
            '<p class="util-pedagogic-callout__label">' +
            escapeHtml(cfg.label) +
            "</p>" +
            cueHtml +
            body +
            "</aside>"
          );
        });
      });

      return out.replace(
        /(<aside class="util-pedagogic-callout util-pedagogic-callout--diagnostic[\s\S]*?<\/aside>)/gi,
        function (block) {
          return applyDiagnosticListClass(block);
        }
      );
    }

    return {
      MODULE_ID: MODULE_ID,
      CALLOUTS: CALLOUTS,
      splitChecklistPedagogicSections: splitChecklistPedagogicSections,
      wrapPedagogicSalienceSectionsInHtml: wrapPedagogicSalienceSectionsInHtml
    };
  }
);
