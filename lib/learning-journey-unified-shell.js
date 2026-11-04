/**
 * Sprint 95 M2 — Unified Learning Journey single-document shell.
 *
 * Additive publishing path. Does not replace multi-document ZIP assembly.
 * Reuses M1 mountLearnerResource / unmountLearnerResource.
 */
(function (root, factory) {
  "use strict";
  var api = factory(root);
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_LEARNING_JOURNEY_UNIFIED_SHELL = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  "use strict";

  var OVERVIEW_NAV_ID = "overview";
  var OVERVIEW_NAV_TITLE = "Overview";

  function asText(value) {
    return value == null ? "" : String(value).trim();
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderOverviewInlineMarkdown(text) {
    var raw = String(text == null ? "" : text);
    if (!raw) return "";
    var escaped = escapeHtml(raw);
    escaped = escaped.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
    escaped = escaped.replace(/__([^_\n]+)__/g, "<strong>$1</strong>");
    escaped = escaped.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
    escaped = escaped.replace(/(^|[^_])_([^_\n]+)_/g, "$1<em>$2</em>");
    escaped = escaped.replace(/`([^`\n]+)`/g, "<code>$1</code>");
    return escaped;
  }

  /**
   * Render journey-intro Markdown for the Overview destination.
   * Prefer learner-renderer markdown utilities when available (Node);
   * otherwise use a self-contained headings/lists/paragraphs renderer.
   */
  function renderOverviewMarkdown(text) {
    var raw = asText(text);
    if (!raw) return "";
    if (typeof require === "function") {
      try {
        var htmlUtils = require("./learner-renderer-vnext/render-html-utils.js");
        if (htmlUtils && typeof htmlUtils.renderMarkdownBlock === "function") {
          return String(htmlUtils.renderMarkdownBlock(raw) || "");
        }
      } catch (_err) {}
    }
    var bulletLineRe = /^[-*•]\s+(.+)$/;
    var lines = raw.replace(/\r\n?/g, "\n").split("\n");
    var index = 0;
    var parts = [];
    while (index < lines.length) {
      var trimmed = String(lines[index] || "").trim();
      if (!trimmed) {
        index += 1;
        continue;
      }
      var headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        var depth = Math.min(Math.max(headingMatch[1].length, 1), 6);
        var headingTag = depth <= 2 ? "h3" : "h" + String(Math.min(depth + 1, 6));
        parts.push(
          "<" +
            headingTag +
            ' class="lj-shell-overview__heading">' +
            renderOverviewInlineMarkdown(headingMatch[2]) +
            "</" +
            headingTag +
            ">"
        );
        index += 1;
        continue;
      }
      var bulletMatch = trimmed.match(bulletLineRe);
      if (bulletMatch) {
        var bulletBodies = [];
        while (index < lines.length) {
          var bulletLine = String(lines[index] || "").trim().match(bulletLineRe);
          if (!bulletLine) break;
          bulletBodies.push(String(bulletLine[1] || "").trim());
          index += 1;
        }
        parts.push(
          "<ul>" +
            bulletBodies
              .map(function (bodyText) {
                return "<li>" + renderOverviewInlineMarkdown(bodyText) + "</li>";
              })
              .join("") +
            "</ul>"
        );
        continue;
      }
      var orderedMatch = trimmed.match(/^\d+[\)\.]\s+(.+)$/);
      if (orderedMatch) {
        var orderedBodies = [];
        while (index < lines.length) {
          var orderedLine = String(lines[index] || "")
            .trim()
            .match(/^\d+[\)\.]\s+(.+)$/);
          if (!orderedLine) break;
          orderedBodies.push(String(orderedLine[1] || "").trim());
          index += 1;
        }
        parts.push(
          "<ol>" +
            orderedBodies
              .map(function (bodyText) {
                return "<li>" + renderOverviewInlineMarkdown(bodyText) + "</li>";
              })
              .join("") +
            "</ol>"
        );
        continue;
      }
      var paragraphLines = [trimmed];
      index += 1;
      while (index < lines.length) {
        var next = String(lines[index] || "").trim();
        if (!next) break;
        if (/^(#{1,6})\s+/.test(next)) break;
        if (bulletLineRe.test(next) || /^\d+[\)\.]\s+/.test(next)) break;
        paragraphLines.push(next);
        index += 1;
      }
      parts.push("<p>" + renderOverviewInlineMarkdown(paragraphLines.join(" ")) + "</p>");
    }
    return parts.join("");
  }

  function buildOverviewTemplateHtml(introText, headingText) {
    var heading = asText(headingText) || OVERVIEW_NAV_TITLE;
    var body = renderOverviewMarkdown(introText);
    return (
      '<article class="lj-shell-overview" data-lj-overview="true" role="region" aria-labelledby="lj-shell-overview-heading">' +
      '<h2 id="lj-shell-overview-heading" class="lj-shell-overview__title" data-lj-resource-title="true" tabindex="-1">' +
      escapeHtml(heading) +
      "</h2>" +
      '<div class="lj-shell-overview__body">' +
      (body || "<p></p>") +
      "</div>" +
      "</article>"
    );
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/'/g, "&#39;");
  }

  function escapeScriptContent(source) {
    return String(source || "").replace(/<\/script/gi, "<\\/script");
  }

  function resolveRendererLifecycle() {
    if (typeof require === "function") {
      try {
        return require("./learner-renderer-vnext");
      } catch (_err) {}
    }
    if (root && root.PRISM_LEARNER_RENDERER_VNEXT) {
      return root.PRISM_LEARNER_RENDERER_VNEXT;
    }
    return null;
  }

  function resolveDesignPageMod() {
    if (typeof require === "function") {
      try {
        return require("./learning-journey-design-page.js");
      } catch (_err) {}
    }
    return root && root.PRISM_LEARNING_JOURNEY_DESIGN_PAGE
      ? root.PRISM_LEARNING_JOURNEY_DESIGN_PAGE
      : null;
  }

  function sortedSections(sections) {
    var rows = Array.isArray(sections) ? sections.slice() : [];
    rows.sort(function (a, b) {
      var ao = typeof (a && a.order) === "number" ? a.order : Number.POSITIVE_INFINITY;
      var bo = typeof (b && b.order) === "number" ? b.order : Number.POSITIVE_INFINITY;
      if (ao !== bo) return ao - bo;
      return asText(a && a.section_id).localeCompare(asText(b && b.section_id));
    });
    return rows;
  }

  function sortedCommissions(commissions) {
    var rows = Array.isArray(commissions) ? commissions.slice() : [];
    rows.sort(function (a, b) {
      var ao = typeof (a && a.order) === "number" ? a.order : Number.POSITIVE_INFINITY;
      var bo = typeof (b && b.order) === "number" ? b.order : Number.POSITIVE_INFINITY;
      if (ao !== bo) return ao - bo;
      return asText(a && a.commission_id).localeCompare(asText(b && b.commission_id));
    });
    return rows;
  }

  /**
   * Extract [data-renderer=vnext] markup from a standalone HTML document.
   * Strips scripts and rewrites the root landmark to <article> for nesting in journey <main>.
   * Uses depth-aware matching so nested <article> / <main> do not truncate the fragment.
   */
  function extractRendererFragmentFromHtml(html) {
    var source = String(html || "");
    if (!source) {
      return { ok: false, code: "empty_html", html: "", pageKey: "" };
    }
    var openMatch = source.match(
      /<(main|article)\b([^>]*\bdata-renderer\s*=\s*["']vnext["'][^>]*)>/i
    );
    if (!openMatch) {
      return { ok: false, code: "renderer_root_missing", html: "", pageKey: "" };
    }
    var tagName = String(openMatch[1] || "").toLowerCase();
    var attrs = openMatch[2] || "";
    var contentStart = openMatch.index + openMatch[0].length;
    var tokenRe = new RegExp("<(/)?" + tagName + "\\b[^>]*>", "gi");
    tokenRe.lastIndex = openMatch.index;
    var depth = 0;
    var end = -1;
    var tok;
    var seenOpen = false;
    while ((tok = tokenRe.exec(source)) !== null) {
      if (!seenOpen) {
        seenOpen = true;
        depth = 1;
        continue;
      }
      if (tok[1]) {
        depth -= 1;
        if (depth === 0) {
          end = tok.index;
          break;
        }
      } else {
        depth += 1;
      }
    }
    if (end < 0) {
      return { ok: false, code: "renderer_root_unclosed", html: "", pageKey: "" };
    }
    var body = source
      .slice(contentStart, end)
      .replace(/<script\b[\s\S]*?<\/script>/gi, "");
    var pageKeyMatch = attrs.match(/\bdata-persistence-page-key\s*=\s*["']([^"']*)["']/i);
    var pageKey = pageKeyMatch ? pageKeyMatch[1] : "";
    var articleAttrs = attrs
      .replace(/\brole\s*=\s*["'][^"']*["']/gi, "")
      .replace(/\s+/g, " ")
      .trim();
    if (!/\brole\s*=/i.test(articleAttrs)) {
      articleAttrs += ' role="region" aria-label="Learning resource"';
    }
    var fragment =
      "<article " + articleAttrs + ">" + body + "</article>";
    return { ok: true, code: "ok", html: fragment, pageKey: pageKey };
  }

  function demoteLeadingH1(html) {
    var source = String(html || "");
    var openDone = false;
    var closeDone = false;
    return source
      .replace(/<h1(\s[^>]*)?>/i, function (open, attrs) {
        if (openDone) return open;
        openDone = true;
        var rest = attrs || "";
        if (!/\bdata-lj-resource-title\b/i.test(rest)) {
          rest += ' data-lj-resource-title="true"';
        }
        return "<h2" + rest + ">";
      })
      .replace(/<\/h1>/i, function (close) {
        if (!openDone || closeDone) return close;
        closeDone = true;
        return "</h2>";
      });
  }

  function normalizeHeadingText(value) {
    return String(value || "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  /**
   * Standalone vNext exports strip util-page-header (title lives in sticky nav).
   * Unified shell has no resource title bar, so restore a visible in-content title
   * when the fragment lacks one. Never duplicates an existing resource heading.
   */
  function ensureResourceTitleHeading(html, title) {
    var source = String(html || "");
    var heading = asText(title);
    if (!source || !heading) return source;
    if (/\bdata-lj-resource-title\b/i.test(source)) return source;

    var headerMatch = source.match(
      /<header\b[^>]*\butil-page-header\b[^>]*>[\s\S]*?<\/header>/i
    );
    if (headerMatch) {
      var markedHeader = false;
      var updatedHeader = headerMatch[0].replace(
        /<(h[12])(\s[^>]*)?>/i,
        function (open, tag, attrs) {
          if (markedHeader) return open;
          markedHeader = true;
          var rest = attrs || "";
          if (!/\bdata-lj-resource-title\b/i.test(rest)) {
            rest += ' data-lj-resource-title="true"';
          }
          if (!/\btabindex\s*=/i.test(rest)) {
            rest += ' tabindex="-1"';
          }
          return "<" + tag + rest + ">";
        }
      );
      if (markedHeader) {
        return (
          source.slice(0, headerMatch.index) +
          updatedHeader +
          source.slice(headerMatch.index + headerMatch[0].length)
        );
      }
    }

    var expected = normalizeHeadingText(heading);
    var firstHeading = source.match(/<(h[12])(\s[^>]*)?>([\s\S]*?)<\/\1>/i);
    if (firstHeading && normalizeHeadingText(firstHeading[3]) === expected) {
      var restAttrs = firstHeading[2] || "";
      if (!/\bdata-lj-resource-title\b/i.test(restAttrs)) {
        restAttrs += ' data-lj-resource-title="true"';
      }
      if (!/\btabindex\s*=/i.test(restAttrs)) {
        restAttrs += ' tabindex="-1"';
      }
      var replacement =
        "<" + firstHeading[1] + restAttrs + ">" + firstHeading[3] + "</" + firstHeading[1] + ">";
      return (
        source.slice(0, firstHeading.index) +
        replacement +
        source.slice(firstHeading.index + firstHeading[0].length)
      );
    }

    var titleBlock =
      '<header class="util-page-header util-learning-header">' +
      '<h2 data-lj-resource-title="true" tabindex="-1">' +
      escapeHtml(heading) +
      "</h2></header>";

    var draftMatch = source.match(
      /<div\b[^>]*\bdata-learner-draft-controls\b[^>]*>[\s\S]*?<\/div>/i
    );
    if (draftMatch) {
      var insertAt = draftMatch.index + draftMatch[0].length;
      return source.slice(0, insertAt) + titleBlock + source.slice(insertAt);
    }

    return source.replace(/^(<(?:article|main)\b[^>]*>)/i, "$1" + titleBlock);
  }

  function rewriteAssetPaths(html, prefix) {
    var base = asText(prefix);
    if (!base) return String(html || "");
    if (base.charAt(base.length - 1) !== "/") base += "/";
    var out = String(html || "");

    function rewriteUrl(url) {
      var u = String(url == null ? "" : url).trim();
      if (!u) return u;
      if (/^(https?:|data:|blob:|mailto:|\/\/|\/|#)/i.test(u)) return u;
      if (u.indexOf("./") === 0) u = u.slice(2);
      if (u.indexOf(base) === 0) return u;
      if (u.indexOf("assets/") === 0) return base + u.slice("assets/".length);
      if (u.indexOf("media/") === 0) return base + u.slice("media/".length);
      return u;
    }

    function rewriteSrcset(value) {
      return String(value || "")
        .split(",")
        .map(function (part) {
          var trimmed = String(part || "").trim();
          if (!trimmed) return part;
          var bits = trimmed.split(/\s+/);
          bits[0] = rewriteUrl(bits[0]);
          return bits.join(" ");
        })
        .join(", ");
    }

    // Legacy assets/ folder used by older package HTML.
    out = out.split("./assets/").join(base).split("assets/").join(base);

    // Attribute URLs (including content-viewer / visual-asset media paths).
    out = out.replace(
      /\s(src|href|poster|data-src|data-full-src|data-full)\s*=\s*(["'])([\s\S]*?)\2/gi,
      function (_m, name, quote, val) {
        return " " + name + "=" + quote + rewriteUrl(val) + quote;
      }
    );
    out = out.replace(/\ssrcset\s*=\s*(["'])([\s\S]*?)\1/gi, function (_m, quote, val) {
      return " srcset=" + quote + rewriteSrcset(val) + quote;
    });
    return out;
  }

  function extractAppFunctionSource(appSource, functionName) {
    var needle = "function " + functionName;
    var start = String(appSource || "").indexOf(needle);
    if (start < 0) return "";
    var i = start;
    var depth = 0;
    var begun = false;
    for (; i < appSource.length; i += 1) {
      var ch = appSource.charAt(i);
      if (ch === "{") {
        depth += 1;
        begun = true;
      } else if (ch === "}") {
        depth -= 1;
        if (begun && depth === 0) {
          i += 1;
          break;
        }
      }
    }
    return begun ? appSource.slice(start, i) : "";
  }

  function resolveLearnerExportCss(options) {
    var opts = options && typeof options === "object" ? options : {};
    if (typeof opts.learnerCss === "string" && opts.learnerCss) {
      return opts.learnerCss;
    }
    // Browser callers must pass learnerCss (typically getUtilityVnextProseMeasureCss()).
    if (typeof require !== "function") return "";
    try {
      var fs = require("fs");
      var path = require("path");
      var vm = require("vm");
      var appPath = path.join(__dirname, "..", "app.js");
      if (!fs.existsSync(appPath)) return "";
      var app = fs.readFileSync(appPath, "utf8");
      var fnProse = extractAppFunctionSource(app, "getUtilityVnextProseMeasureCss");
      if (!fnProse) return "";
      var fnComposition = extractAppFunctionSource(
        app,
        "getUtilityVnextCompositionMomentPresentationCss"
      );
      var fnExpository = extractAppFunctionSource(app, "getUtilityExpositoryPublishingCss");
      var iconCss = "";
      try {
        var lifecycle = resolveRendererLifecycle();
        if (lifecycle && typeof lifecycle.getLearnerIconPresentationCss === "function") {
          iconCss = String(lifecycle.getLearnerIconPresentationCss() || "");
        }
      } catch (_iconErr) {}
      var sandbox = {
        window: {
          PRISM_LEARNER_RENDERER_VNEXT: {
            getLearnerIconPresentationCss: function () {
              return iconCss;
            }
          }
        },
        getUtilityLearnerContentViewerCss: function () {
          try {
            var viewer = require("./learner-content-viewer.js");
            if (viewer && typeof viewer.buildCss === "function") {
              return String(viewer.buildCss() || "");
            }
          } catch (_viewerErr) {}
          return "";
        }
      };
      vm.createContext(sandbox);
      vm.runInContext(
        [fnComposition, fnExpository, fnProse].filter(Boolean).join("\n") +
          "; this.__css = getUtilityVnextProseMeasureCss();",
        sandbox
      );
      return String(sandbox.__css || "");
    } catch (_err) {
      return "";
    }
  }

  function resolveCommissionTitle(entryTitle, commissionId, titleByCommission, sectionTitle) {
    var fromEntry = asText(entryTitle);
    var fromMeta = asText(
      titleByCommission && commissionId ? titleByCommission[commissionId] : ""
    );
    var fromSection = asText(sectionTitle);
    // Prefer commission metadata when the caller only echoed the commission id.
    if (fromEntry && fromEntry !== commissionId) return fromEntry;
    if (fromMeta && fromMeta !== commissionId) return fromMeta;
    if (fromSection) return fromSection;
    return fromEntry || fromMeta || commissionId;
  }

  function buildSidebarPanelIconSvg() {
    return (
      '<svg class="lj-shell__icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<rect x="3.25" y="4.25" width="17.5" height="15.5" rx="2.25" fill="none" stroke="currentColor" stroke-width="1.75"/>' +
      '<path d="M9 4.25v15.5" fill="none" stroke="currentColor" stroke-width="1.75"/>' +
      "</svg>"
    );
  }

  function buildUnifiedShellChromeCss() {
    return [
      "html{height:100%}",
      "body.lj-shell-body{margin:0;padding:0;min-height:100%;height:100%;font-family:var(--learner-font-sans,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif);background:#fff;color:#1f2937;--lj-shell-toolbar-height:0px;--lj-shell-rail-width:3.5rem;overflow-x:clip}",
      "body.lj-shell-body.util-page-export--vnext{padding:0;max-width:none}",
      "body.lj-shell-body,body.lj-shell-body *{box-sizing:border-box}",
      ".lj-shell{display:grid;grid-template-columns:minmax(15rem,17.5rem) minmax(0,1fr);gap:0;min-height:100%;height:100%;min-width:0}",
      ".lj-shell--sidebar-collapsed{grid-template-columns:var(--lj-shell-rail-width) minmax(0,1fr)}",
      ".lj-shell__sidebar{display:flex;flex-direction:column;gap:0;min-width:0;height:100%;max-height:100%;overflow:hidden;padding:0;border-right:1px solid #e5e7eb;background:#f8fafc}",
      ".lj-shell--sidebar-collapsed .lj-shell__sidebar{width:var(--lj-shell-rail-width);min-width:var(--lj-shell-rail-width);max-width:var(--lj-shell-rail-width)}",
      ".lj-shell__sidebar-chrome{display:flex;align-items:flex-start;gap:.65rem;flex:0 0 auto;padding:.85rem .85rem .65rem}",
      ".lj-shell--sidebar-collapsed .lj-shell__sidebar-chrome{justify-content:center;padding:.85rem .55rem .65rem}",
      ".lj-shell__brand{margin:0;flex:1 1 auto;min-width:0;padding-top:.2rem}",
      ".lj-shell--sidebar-collapsed .lj-shell__brand{display:none}",
      ".lj-shell__brand h1{margin:0;font-size:1rem;line-height:1.35;font-weight:650;letter-spacing:-.01em;color:#0f172a}",
      ".lj-shell__icon-btn{appearance:none;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;width:var(--learner-nav-control-size,2.25rem);height:var(--learner-nav-control-size,2.25rem);min-width:var(--learner-nav-control-size,2.25rem);min-height:var(--learner-nav-control-size,2.25rem);padding:0;border:1px solid transparent;border-radius:var(--learner-nav-radius,.55rem);background:transparent;color:#334155;cursor:pointer}",
      ".lj-shell__icon-btn:hover{background:var(--learner-nav-hover-bg,#e2e8f0);color:#0f172a}",
      ".lj-shell__icon-btn:focus-visible{outline:2px solid var(--learner-nav-focus,#2563eb);outline-offset:2px}",
      ".lj-shell__icon{display:block}",
      ".lj-shell__sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}",
      ".lj-shell__sidebar-panel{display:flex;flex-direction:column;flex:1 1 auto;min-height:0}",
      ".lj-shell--sidebar-collapsed .lj-shell__sidebar-panel{display:none}",
      /* Reading column: left-aligned in main; main padding centres it on the viewport. */
      ".lj-shell-overview{width:min(100%,var(--learner-reading-width,70ch));margin:0;padding:0 0 2rem}",
      ".lj-shell-overview__title{margin:0 0 1rem;font-size:1.75rem;line-height:1.25;font-weight:700;letter-spacing:-.015em;color:#0f172a}",
      /* Resource titles restored for package fragments that omit util-page-header. */
      ".lj-shell__main .util-page-header{margin:0 0 1rem}",
      ".lj-shell__main .util-page-header>h1,.lj-shell__main .util-page-header>h2{margin:0;font-size:1.75rem;line-height:1.25;font-weight:700;letter-spacing:-.015em;color:#0f172a}",
      ".lj-shell-overview__body{font-size:1rem;line-height:1.65;color:#1f2937}",
      ".lj-shell-overview__body>:first-child{margin-top:0}",
      ".lj-shell-overview__body>:last-child{margin-bottom:0}",
      ".lj-shell-overview__body p{margin:0 0 1rem}",
      ".lj-shell-overview__body ul,.lj-shell-overview__body ol{margin:0 0 1rem;padding-left:1.25rem}",
      ".lj-shell-overview__body li{margin:.35rem 0}",
      ".lj-shell-overview__body h3,.lj-shell-overview__body .lj-shell-overview__heading,.lj-shell-overview__body .util-md-heading{margin:1.5rem 0 .75rem;font-size:1.25rem;line-height:1.35;font-weight:700;color:#0f172a}",
      ".lj-shell-overview__body h4{margin:1.25rem 0 .65rem;font-size:1.125rem;line-height:1.35;font-weight:700;color:#0f172a}",
      ".lj-shell__toc-wrap{flex:1 1 auto;min-height:0;overflow:auto;padding:.15rem .75rem 1.25rem}",
      ".lj-shell__toc-label{margin:0 .15rem .45rem;font-size:.7rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--learner-nav-muted,#64748b)}",
      ".lj-shell__toc{list-style:none;margin:0;padding:0;display:grid;gap:.2rem}",
      ".lj-shell__toc-link{display:block;width:100%;text-align:left;padding:.5rem .6rem;border:0;border-radius:var(--learner-nav-radius,.55rem);background:transparent;color:var(--learner-nav-text,#0f172a);font:inherit;font-size:var(--learner-nav-font-size,.875rem);line-height:1.35;cursor:pointer}",
      ".lj-shell__toc-link:hover{background:var(--learner-nav-hover-bg,#e2e8f0)}",
      ".lj-shell__toc-link:focus-visible{outline:2px solid var(--learner-nav-focus,#2563eb);outline-offset:2px}",
      ".lj-shell__toc-link[aria-current=\"page\"]{background:var(--learner-nav-active-bg,#dbeafe);font-weight:600}",
      ".lj-shell__workspace{position:relative;display:flex;flex-direction:column;min-width:0;min-height:0;height:100%;overflow-x:auto;overflow-y:auto}",
      /* Prose inset: place 70ch at viewport centre when space allows; never under sidebar. */
      ".lj-shell__main{--lj-shell-prose-inset:max(var(--learner-page-gutter,1rem),calc((100vw - var(--learner-reading-width,70ch)) / 2 - var(--lj-shell-sidebar-occupied,0px)));padding:1.25rem var(--learner-page-gutter,1rem) 3rem var(--lj-shell-prose-inset);min-width:0;scroll-margin-top:1rem;container-type:inline-size;container-name:lj-shell-main}",
      ".lj-shell__main:focus{outline:none}",
      ".lj-shell__main:focus-visible{outline:2px solid var(--learner-nav-focus,#2563eb);outline-offset:3px}",
      ".lj-shell__main [data-lj-resource-title]:focus:not(:focus-visible),.lj-shell__main [tabindex=\"-1\"]:focus:not(:focus-visible){outline:none}",
      ".lj-shell__main [data-lj-resource-title]:focus-visible,.lj-shell__main [tabindex=\"-1\"]:focus-visible{outline:2px solid var(--learner-nav-focus,#2563eb);outline-offset:3px}",
      "body.lj-shell-body .util-learner-page{width:min(100%,var(--learner-reading-width,70ch));margin-inline:0}",
      /* Wide content uses the available main content box (after prose inset), not 100vw. */
      "body.lj-shell-body .util-learner-renderer-vnext .util-learner-table-breakout,body.lj-shell-body .util-learner-renderer-vnext .util-material-table-block,body.lj-shell-body .util-learner-renderer-vnext .util-exposition-table-breakout,body.lj-shell-body .util-learner-renderer-vnext .util-exposition-table-scroll,body.lj-shell-body .util-learner-renderer-vnext .util-exposition-explanation>.util-table-scroll,body.lj-shell-body .util-learner-renderer-vnext .util-exposition-material>.util-table-scroll{--learner-breakout-basis:100cqw;--learner-breakout-left:0px;width:min(75rem,calc(var(--learner-breakout-basis) - var(--learner-page-gutter,1rem)));max-width:none;margin-left:0;margin-right:0}",
      "body.lj-shell-body .util-journey-nav{top:var(--lj-shell-toolbar-height,0px);z-index:35;background:#fff}",
      "body.lj-shell-body [data-journey-section]{scroll-margin-top:calc(var(--learner-sticky-nav-height,7.5rem) + .5rem)}",
      ".lj-shell__live{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}",
      ".lj-shell__templates{display:none}",
      ".lj-artefact-ref-host{margin:0 0 var(--learner-space-4,1.5rem)}",
      ".lj-artefact-ref{margin:0 0 var(--learner-space-4,1.5rem);padding:1rem 1.1rem;border:1px solid #cbd5e1;border-left:4px solid #64748b;border-radius:8px;background:#f8fafc}",
      ".lj-artefact-ref--missing{border-left-color:#94a3b8;background:#f1f5f9}",
      ".lj-artefact-ref__label{margin:0 0 .35rem;font-size:1rem;line-height:1.35;font-weight:700;color:#0f172a}",
      ".lj-artefact-ref__note,.lj-artefact-ref__missing,.lj-artefact-ref__fallback{margin:0 0 .75rem;font-size:.9rem;line-height:1.5;color:#475569}",
      ".lj-artefact-ref__body{max-height:min(40vh,22rem);overflow:auto;padding:.75rem .85rem;border-radius:6px;background:#fff;border:1px solid #e2e8f0}",
      ".lj-artefact-ref__body:focus-visible{outline:2px solid var(--learner-nav-focus,#2563eb);outline-offset:2px}",
      ".lj-artefact-ref__text{margin:0;white-space:pre-wrap;overflow-wrap:anywhere;font:inherit;font-size:.95rem;line-height:1.55;color:#0f172a}",
      "@media (max-width:860px){.lj-shell{grid-template-columns:1fr;height:auto;min-height:100%}.lj-shell:not(.lj-shell--sidebar-collapsed) .lj-shell__sidebar{height:auto;max-height:min(70vh,24rem);border-right:0;border-bottom:1px solid #e5e7eb}.lj-shell--sidebar-collapsed{grid-template-columns:var(--lj-shell-rail-width) minmax(0,1fr);height:100%;min-height:100%}.lj-shell--sidebar-collapsed .lj-shell__sidebar{height:100%;max-height:none;border-right:1px solid #e5e7eb;border-bottom:0}.lj-shell__workspace{height:auto;min-height:60vh}.lj-shell--sidebar-collapsed .lj-shell__workspace{height:100%;min-height:0}}"
    ].join("");
  }

  function resolveArtefactContractMod() {
    if (typeof require === "function") {
      try {
        return require("./learner-renderer-vnext/learner-artefact-contract.js");
      } catch (_err) {}
    }
    if (root && root.PRISM_LEARNER_RENDERER_VNEXT) {
      return root.PRISM_LEARNER_RENDERER_VNEXT;
    }
    return null;
  }

  function enrichArtefactContract(contract, sequence) {
    var mod = resolveArtefactContractMod();
    var normalized =
      mod && typeof mod.normalizeArtefactContract === "function"
        ? mod.normalizeArtefactContract(contract)
        : { produces: [], references: [] };
    var byCommission = Object.create(null);
    (Array.isArray(sequence) ? sequence : []).forEach(function (row) {
      if (!row) return;
      byCommission[asText(row.commissionId)] = asText(row.pageKey);
    });
    normalized.produces = normalized.produces.map(function (row) {
      var next = Object.assign({}, row);
      if (!next.pageKey && byCommission[next.commissionId]) {
        next.pageKey = byCommission[next.commissionId];
      }
      return next;
    });
    return normalized;
  }

  function buildShellControllerScript() {
    return (
      "(function(){" +
      "var api=window.PRISM_LEARNER_RENDERER_VNEXT;" +
      "if(!api||typeof api.mountLearnerResource!=='function'){console.error('PRISM unified shell: mount API missing');return;}" +
      "var manifestEl=document.getElementById('lj-shell-manifest');" +
      "if(!manifestEl)return;" +
      "var resources=[];" +
      "try{resources=JSON.parse(manifestEl.textContent||'[]');}catch(e){return;}" +
      "if(!resources.length)return;" +
      "var artefactContract={produces:[],references:[]};" +
      "var contractEl=document.getElementById('lj-shell-artefact-contract');" +
      "if(contractEl){try{artefactContract=JSON.parse(contractEl.textContent||'{}');}catch(e){}}" +
      "if(typeof api.normalizeArtefactContract==='function'){artefactContract=api.normalizeArtefactContract(artefactContract);}" +
      "var shellRoot=document.querySelector('.lj-shell');" +
      "var sidebar=document.getElementById('lj-shell-sidebar');" +
      "var sidebarPanel=document.getElementById('lj-shell-toc-panel');" +
      "var sidebarToggle=document.getElementById('lj-shell-sidebar-toggle');" +
      "var sidebarBrand=document.querySelector('.lj-shell__brand');" +
      "var main=document.getElementById('lj-shell-main');" +
      "var live=document.getElementById('lj-shell-live');" +
      "var handle=null;" +
      "var currentId=null;" +
      "var mountCount=0;" +
      "var SIDEBAR_STORAGE_KEY='prism:lj-shell:sidebar-state';" +
      "var NARROW_MQ=window.matchMedia('(max-width: 860px)');" +
      "var layoutRaf=0;" +
      "function findResource(id){for(var i=0;i<resources.length;i++){if(resources[i].commissionId===id)return resources[i];}return null;}" +
      "function isOverview(entry){return !!(entry&&(entry.kind==='overview'||entry.commissionId==='" +
      OVERVIEW_NAV_ID +
      "'));}" +
      "function templateHtml(id){var tpl=document.getElementById('lj-resource-'+id);return tpl?tpl.innerHTML:'';}" +
      "function readStoredSidebarState(){try{var raw=sessionStorage.getItem(SIDEBAR_STORAGE_KEY);if(raw==='expanded'||raw==='collapsed')return raw;}catch(e){}return null;}" +
      "function writeStoredSidebarState(state){try{sessionStorage.setItem(SIDEBAR_STORAGE_KEY,state);}catch(e){}}" +
      "function defaultSidebarCollapsed(){return !!(NARROW_MQ&&NARROW_MQ.matches);}" +
      "function measureSidebarOccupied(){" +
      "if(!sidebar||!main)return 0;" +
      "var s=sidebar.getBoundingClientRect();" +
      "var m=main.getBoundingClientRect();" +
      // Side-by-side only: sidebar ends at/before main left. Stacked (narrow) counts as 0.
      "if(s.width>0&&s.right<=m.left+1)return Math.round(s.width);" +
      "return 0;" +
      "}" +
      "function syncShellLayoutMetrics(){" +
      "document.documentElement.style.setProperty('--lj-shell-toolbar-height','0px');" +
      "var occupied=measureSidebarOccupied();" +
      "var occupiedCss=occupied+'px';" +
      "document.documentElement.style.setProperty('--lj-shell-sidebar-occupied',occupiedCss);" +
      "if(document.body)document.body.style.setProperty('--lj-shell-sidebar-occupied',occupiedCss);" +
      "var contentWidth=main?Math.round(main.clientWidth||0):0;" +
      "window.dispatchEvent(new CustomEvent('prism:lj-shell-layout',{detail:{toolbarHeight:0,contentWidth:contentWidth,sidebarOccupied:occupied}}));" +
      "}" +
      "function scheduleShellLayoutMetrics(){" +
      "if(layoutRaf)return;" +
      "layoutRaf=window.requestAnimationFrame(function(){layoutRaf=0;syncShellLayoutMetrics();});" +
      "}" +
      "function setToggleLabels(collapsed){" +
      "var label=collapsed?'Show journey contents':'Hide journey contents';" +
      "if(!sidebarToggle)return;" +
      "sidebarToggle.setAttribute('aria-expanded',collapsed?'false':'true');" +
      "sidebarToggle.setAttribute('aria-label',label);" +
      "sidebarToggle.setAttribute('title',label);" +
      "var sr=sidebarToggle.querySelector('.lj-shell__sr-only');" +
      "if(sr)sr.textContent=label;" +
      "}" +
      "function applySidebarCollapsed(collapsed,opts){" +
      "opts=opts||{};" +
      "if(!shellRoot)return;" +
      "shellRoot.classList.toggle('lj-shell--sidebar-collapsed',!!collapsed);" +
      "if(sidebar)sidebar.setAttribute('data-lj-sidebar-state',collapsed?'collapsed':'expanded');" +
      "if(sidebarBrand){" +
      "if(collapsed){sidebarBrand.setAttribute('hidden','');sidebarBrand.setAttribute('aria-hidden','true');}" +
      "else{sidebarBrand.removeAttribute('hidden');sidebarBrand.removeAttribute('aria-hidden');}" +
      "}" +
      "if(sidebarPanel){" +
      "if(collapsed){sidebarPanel.setAttribute('hidden','');sidebarPanel.setAttribute('inert','');}" +
      "else{sidebarPanel.removeAttribute('hidden');sidebarPanel.removeAttribute('inert');}" +
      "}" +
      "setToggleLabels(!!collapsed);" +
      "if(opts.persist)writeStoredSidebarState(collapsed?'collapsed':'expanded');" +
      "scheduleShellLayoutMetrics();" +
      "if(opts.focus==='toggle'&&sidebarToggle){try{sidebarToggle.focus();}catch(e){}}" +
      "if(opts.focus==='panel'&&sidebarPanel){" +
      "var first=sidebarPanel.querySelector('[data-lj-nav-id],button,a,[tabindex]:not([tabindex=\"-1\"])');" +
      "if(first){try{first.focus();}catch(e){}}" +
      "}" +
      "}" +
      "function resolveInitialSidebarCollapsed(){" +
      "var stored=readStoredSidebarState();" +
      "if(stored==='collapsed')return true;" +
      "if(stored==='expanded')return false;" +
      "return defaultSidebarCollapsed();" +
      "}" +
      "function setNavState(id){" +
      "var links=document.querySelectorAll('[data-lj-nav-id]');" +
      "for(var i=0;i<links.length;i++){" +
      "var active=links[i].getAttribute('data-lj-nav-id')===id;" +
      "if(active)links[i].setAttribute('aria-current','page');else links[i].removeAttribute('aria-current');" +
      "}" +
      "scheduleShellLayoutMetrics();" +
      "}" +
      "function announce(title){if(!live)return;live.textContent='';setTimeout(function(){live.textContent='Now showing: '+title;},40);}" +
      "function focusResource(){" +
      "var heading=main.querySelector('[data-lj-resource-title], h2, h1');" +
      "if(heading){if(!heading.hasAttribute('tabindex'))heading.setAttribute('tabindex','-1');try{heading.focus({preventScroll:true});}catch(e){heading.focus();}return;}" +
      "main.setAttribute('tabindex','-1');try{main.focus({preventScroll:true});}catch(e){main.focus();}" +
      "}" +
      "function showResource(id,opts){" +
      "opts=opts||{};" +
      "var entry=findResource(id);if(!entry)return;" +
      "var alreadyShowing=id===currentId&&(isOverview(entry)||(handle&&handle.ok));" +
      "if(alreadyShowing){if(!opts.skipFocus)focusResource();scheduleShellLayoutMetrics();return;}" +
      "if(handle&&typeof handle.unmount==='function'){handle.unmount();handle=null;}" +
      "var artefactInject=null;" +
      "if(isOverview(entry)){" +
      "main.innerHTML=templateHtml(id);" +
      "window.__PRISM_LJ_SHELL__={currentId:id,mountCount:mountCount,handle:null,kind:'overview',artefactInject:null};" +
      "}else{" +
      "var html=templateHtml(id);" +
      "var mountOpts={html:html};" +
      "if(entry.pageKey)mountOpts.pageKey=entry.pageKey;" +
      "handle=api.mountLearnerResource(main,mountOpts);" +
      "mountCount+=1;" +
      "if(handle&&handle.ok&&handle.root&&typeof api.injectArtefactReferences==='function'){" +
      "artefactInject=api.injectArtefactReferences(handle.root,{contract:artefactContract,commissionId:id,resources:resources.filter(function(row){return row&&row.kind!=='overview';})});" +
      "}" +
      "window.__PRISM_LJ_SHELL__={currentId:id,mountCount:mountCount,handle:handle,artefactInject:artefactInject};" +
      "}" +
      "currentId=id;" +
      "setNavState(id);" +
      "var hash='#'+encodeURIComponent(id);" +
      "if(location.hash!==hash){try{history.replaceState(null,'',hash);}catch(e){location.hash=hash;}}" +
      "if(!opts.skipAnnounce)announce(entry.title);" +
      "if(!opts.skipFocus)focusResource();" +
      "scheduleShellLayoutMetrics();" +
      "}" +
      "function initialId(){" +
      "var raw=(location.hash||'').replace(/^#/,'');" +
      "if(raw){try{raw=decodeURIComponent(raw);}catch(e){}" +
      "if(findResource(raw))return raw;}" +
      "return resources[0].commissionId;" +
      "}" +
      "function toggleSidebar(forceCollapsed,focusTarget){" +
      "var currentlyCollapsed=shellRoot.classList.contains('lj-shell--sidebar-collapsed');" +
      "var collapsed=typeof forceCollapsed==='boolean'?forceCollapsed:!currentlyCollapsed;" +
      "applySidebarCollapsed(collapsed,{persist:true,focus:focusTarget||(collapsed?'toggle':'panel')});" +
      "}" +
      "document.addEventListener('click',function(event){" +
      "var btn=event.target&&event.target.closest?event.target.closest('[data-lj-nav-id]'):null;" +
      "if(!btn)return;" +
      "event.preventDefault();" +
      "showResource(btn.getAttribute('data-lj-nav-id'));" +
      "});" +
      "if(sidebarToggle)sidebarToggle.addEventListener('click',function(){" +
      "var collapsed=shellRoot.classList.contains('lj-shell--sidebar-collapsed');" +
      "toggleSidebar(!collapsed,collapsed?'panel':'toggle');" +
      "});" +
      "document.addEventListener('keydown',function(event){" +
      "if(event.key!=='Escape')return;" +
      "if(!shellRoot||shellRoot.classList.contains('lj-shell--sidebar-collapsed'))return;" +
      "if(!sidebar||!sidebar.contains(document.activeElement))return;" +
      "event.preventDefault();" +
      "toggleSidebar(true,'toggle');" +
      "});" +
      "if(NARROW_MQ&&typeof NARROW_MQ.addEventListener==='function'){" +
      "NARROW_MQ.addEventListener('change',function(){" +
      "if(readStoredSidebarState()){scheduleShellLayoutMetrics();return;}" +
      "applySidebarCollapsed(defaultSidebarCollapsed(),{persist:false});" +
      "});" +
      "}else if(NARROW_MQ&&typeof NARROW_MQ.addListener==='function'){" +
      "NARROW_MQ.addListener(function(){" +
      "if(readStoredSidebarState()){scheduleShellLayoutMetrics();return;}" +
      "applySidebarCollapsed(defaultSidebarCollapsed(),{persist:false});" +
      "});" +
      "}" +
      "window.addEventListener('resize',scheduleShellLayoutMetrics);" +
      "window.addEventListener('hashchange',function(){" +
      "var raw=(location.hash||'').replace(/^#/,'');" +
      "try{raw=decodeURIComponent(raw);}catch(e){}" +
      "if(findResource(raw))showResource(raw,{skipAnnounce:false});" +
      "});" +
      "applySidebarCollapsed(resolveInitialSidebarCollapsed(),{persist:false});" +
      "showResource(initialId(),{skipFocus:true});" +
      "scheduleShellLayoutMetrics();" +
      "window.__PRISM_LJ_SHELL_LAYOUT__={sync:syncShellLayoutMetrics,setSidebarCollapsed:function(v){applySidebarCollapsed(!!v,{persist:true});}};" +
      "})();"
    );
  }

  /**
   * Node-only helper. Browser callers must pass input.runtimeScript
   * (typically fetched from the page's learner-renderer-vnext-browser.js URL).
   */
  function readBrowserRuntimeSource() {
    if (typeof require !== "function") return "";
    try {
      var fs = require("fs");
      var path = require("path");
      var runtimePath = path.join(__dirname, "learner-renderer-vnext-browser.js");
      if (fs.existsSync(runtimePath)) {
        return fs.readFileSync(runtimePath, "utf8");
      }
    } catch (_err) {}
    return "";
  }

  function buildResourceSequence(page, resourceMap) {
    var sections = sortedSections(page && page.sections);
    var commissions = sortedCommissions(page && page.commissions);
    var byId = resourceMap && typeof resourceMap === "object" ? resourceMap : {};
    var intro = "";
    var sequence = [];
    var titleByCommission = Object.create(null);
    commissions.forEach(function (commission) {
      if (!commission) return;
      titleByCommission[asText(commission.commission_id)] =
        asText(commission.title) || asText(commission.commission_id);
    });

    sections.forEach(function (section) {
      if (!section) return;
      var sectionId = asText(section.section_id);
      if (sectionId === "journey_intro") {
        intro = asText(section.exposition);
        return;
      }
      commissions.forEach(function (commission) {
        if (!commission || asText(commission.section_id) !== sectionId) return;
        var commissionId = asText(commission.commission_id);
        if (!commissionId || !byId[commissionId]) return;
        var entry = byId[commissionId];
        sequence.push({
          commissionId: commissionId,
          sectionId: sectionId,
          sectionTitle: asText(section.title) || sectionId,
          title: resolveCommissionTitle(
            entry.title,
            commissionId,
            titleByCommission,
            section.title
          ),
          html: entry.html,
          pageKey: asText(entry.pageKey),
          productId: asText(entry.productId || commission.product_id),
          unsupportedReason: asText(entry.unsupportedReason)
        });
      });
    });

    // Fallback: include mapped resources not attached to a section.
    Object.keys(byId).forEach(function (commissionId) {
      var already = sequence.some(function (row) {
        return row.commissionId === commissionId;
      });
      if (already) return;
      var entry = byId[commissionId];
      sequence.push({
        commissionId: commissionId,
        sectionId: "",
        sectionTitle: "",
        title: resolveCommissionTitle(
          entry.title,
          commissionId,
          titleByCommission,
          ""
        ),
        html: entry.html,
        pageKey: asText(entry.pageKey),
        productId: asText(entry.productId),
        unsupportedReason: asText(entry.unsupportedReason)
      });
    });

    return { intro: intro, sequence: sequence };
  }

  /**
   * Build a single-document Learning Journey shell.
   *
   * @param {object} page Learning Journey design page
   * @param {Array<{commissionId:string, html:string, title?:string, pageKey?:string, productId?:string}>} resources
   * @param {{ learnerCss?: string, runtimeScript?: string, runtimeSrc?: string, designMod?: object }=} options
   */
  function buildLearningJourneyUnifiedShellHtml(page, resources, options) {
    var opts = options && typeof options === "object" ? options : {};
    var designMod = opts.designMod || resolveDesignPageMod();
    if (!page || typeof page !== "object") {
      return { ok: false, code: "page_required", html: "" };
    }
    if (
      designMod &&
      typeof designMod.isLearningJourneyDesignPage === "function" &&
      !designMod.isLearningJourneyDesignPage(page)
    ) {
      return { ok: false, code: "not_learning_journey_page", html: "" };
    }

    var rows = Array.isArray(resources) ? resources : [];
    var resourceMap = Object.create(null);
    var blockers = [];
    rows.forEach(function (row) {
      if (!row || typeof row !== "object") return;
      var id = asText(row.commissionId);
      if (!id) return;
      var html = String(row.html || "");
      if (!html.trim()) {
        blockers.push({ commissionId: id, reason: "Resource fragment HTML is missing." });
        return;
      }
      var resourceHtml = ensureResourceTitleHeading(
        demoteLeadingH1(html),
        asText(row.title)
      );
      // Idempotent reseat: fixes Interactive nav buried in activity headers when
      // callers pass pre-built package fragments straight into the shell builder.
      var lifecycleForNav = resolveRendererLifecycle();
      if (
        lifecycleForNav &&
        typeof lifecycleForNav.enhanceFragmentWithSectionNavigation === "function"
      ) {
        resourceHtml = lifecycleForNav.enhanceFragmentWithSectionNavigation(
          resourceHtml,
          {}
        );
      }
      resourceMap[id] = {
        html: resourceHtml,
        title: asText(row.title),
        pageKey: asText(row.pageKey),
        productId: asText(row.productId),
        unsupportedReason: asText(row.unsupportedReason)
      };
    });

    var built = buildResourceSequence(page, resourceMap);
    if (!built.sequence.length) {
      return {
        ok: false,
        code: "resources_required",
        html: "",
        blockers: blockers.length
          ? blockers
          : [{ commissionId: "", reason: "No mountable resources were supplied." }]
      };
    }

    var journeyTitle = asText(page.title) || "Learning Journey";
    var learnerCss = resolveLearnerExportCss(opts);
    var chromeCss = buildUnifiedShellChromeCss();
    var runtimeSource =
      typeof opts.runtimeScript === "string" && opts.runtimeScript
        ? opts.runtimeScript
        : "";
    var runtimeSrc = asText(opts.runtimeSrc);
    var hasOverview = !!built.intro;
    var overviewTitle = OVERVIEW_NAV_TITLE;
    var overviewHtml = hasOverview
      ? buildOverviewTemplateHtml(built.intro, overviewTitle)
      : "";
    var navEntries = [];
    if (hasOverview) {
      navEntries.push({
        commissionId: OVERVIEW_NAV_ID,
        title: overviewTitle,
        kind: "overview",
        pageKey: "",
        productId: ""
      });
    }
    built.sequence.forEach(function (row) {
      navEntries.push({
        commissionId: row.commissionId,
        title: row.title,
        kind: "resource",
        pageKey: row.pageKey,
        productId: row.productId
      });
    });
    var manifest = navEntries.map(function (row) {
      return {
        commissionId: row.commissionId,
        title: row.title,
        kind: row.kind,
        pageKey: row.pageKey,
        productId: row.productId
      };
    });
    var artefactContract = enrichArtefactContract(opts.artefactContract, built.sequence);

    var parts = [];
    parts.push("<!DOCTYPE html>");
    parts.push('<html lang="en">');
    parts.push("<head>");
    parts.push('<meta charset="utf-8">');
    parts.push('<meta name="viewport" content="width=device-width, initial-scale=1">');
    parts.push("<title>" + escapeHtml(journeyTitle) + "</title>");
    parts.push(
      "<style>" +
        escapeScriptContent(learnerCss) +
        chromeCss +
        "</style>"
    );
    parts.push("</head>");
    parts.push(
      '<body class="lj-shell-body util-page-export util-page-export--vnext" data-lj-shell="unified">'
    );
    parts.push('<div class="lj-shell">');

    var panelIcon = buildSidebarPanelIconSvg();
    parts.push(
      '<aside class="lj-shell__sidebar" id="lj-shell-sidebar" aria-label="Journey navigation" data-lj-sidebar-state="expanded">'
    );
    parts.push('<div class="lj-shell__sidebar-chrome">');
    parts.push(
      '<button type="button" class="lj-shell__icon-btn lj-shell__sidebar-toggle" id="lj-shell-sidebar-toggle" aria-expanded="true" aria-controls="lj-shell-toc-panel" aria-label="Hide journey contents" title="Hide journey contents">' +
        panelIcon +
        '<span class="lj-shell__sr-only">Hide journey contents</span></button>'
    );
    parts.push('<header class="lj-shell__brand">');
    parts.push("<h1>" + escapeHtml(journeyTitle) + "</h1>");
    parts.push("</header>");
    parts.push("</div>");
    parts.push('<div class="lj-shell__sidebar-panel" id="lj-shell-toc-panel">');
    parts.push('<div class="lj-shell__toc-wrap">');
    parts.push('<p class="lj-shell__toc-label" id="lj-shell-toc-label">Contents</p>');
    parts.push('<nav aria-labelledby="lj-shell-toc-label">');
    parts.push('<ol class="lj-shell__toc">');
    navEntries.forEach(function (row, index) {
      parts.push("<li>");
      parts.push(
        '<button type="button" class="lj-shell__toc-link" data-lj-nav-id="' +
          escapeAttr(row.commissionId) +
          '"' +
          (index === 0 ? ' aria-current="page"' : "") +
          ">" +
          escapeHtml(row.title) +
          "</button>"
      );
      parts.push("</li>");
    });
    parts.push("</ol></nav></div></div></aside>");

    parts.push('<div class="lj-shell__workspace">');
    parts.push(
      '<div id="lj-shell-live" class="lj-shell__live" aria-live="polite" aria-atomic="true"></div>'
    );
    parts.push(
      '<main id="lj-shell-main" class="lj-shell__main" data-lj-role="active-resource" tabindex="-1"></main>'
    );
    parts.push("</div></div>");

    parts.push('<div class="lj-shell__templates" hidden aria-hidden="true">');
    if (hasOverview) {
      parts.push('<template id="lj-resource-' + escapeAttr(OVERVIEW_NAV_ID) + '">');
      parts.push(overviewHtml);
      parts.push("</template>");
    }
    built.sequence.forEach(function (row) {
      parts.push(
        '<template id="lj-resource-' + escapeAttr(row.commissionId) + '">'
      );
      parts.push(row.html);
      parts.push("</template>");
    });
    parts.push("</div>");

    parts.push(
      '<script type="application/json" id="lj-shell-manifest">' +
        escapeScriptContent(JSON.stringify(manifest)) +
        "</script>"
    );
    parts.push(
      '<script type="application/json" id="lj-shell-artefact-contract">' +
        escapeScriptContent(JSON.stringify(artefactContract)) +
        "</script>"
    );

    if (runtimeSrc) {
      parts.push(
        '<script src="' + escapeAttr(runtimeSrc) + '" data-lj-shell-runtime="external"></script>'
      );
    } else if (runtimeSource) {
      parts.push(
        '<script data-lj-shell-runtime="inline">' +
          escapeScriptContent(runtimeSource) +
          "</script>"
      );
    }

    parts.push(
      "<script data-lj-shell-controller=\"true\">" +
        escapeScriptContent(buildShellControllerScript()) +
        "</script>"
    );
    parts.push("</body></html>");

    return {
      ok: true,
      code: "ok",
      html: parts.join(""),
      title: journeyTitle,
      resources: built.sequence,
      navEntries: navEntries,
      hasOverview: hasOverview,
      overviewId: hasOverview ? OVERVIEW_NAV_ID : "",
      artefactContract: artefactContract,
      blockers: blockers
    };
  }

  /**
   * Prepare mountable resources from constituent packages and/or source pages.
   */
  function prepareUnifiedShellResources(constituents, options) {
    var opts = options && typeof options === "object" ? options : {};
    var lifecycle = opts.lifecycle || resolveRendererLifecycle();
    var rows = Array.isArray(constituents) ? constituents : [];
    var prepared = [];
    var warnings = [];

    rows.forEach(function (row) {
      if (!row || typeof row !== "object") return;
      var commissionId = asText(row.commissionId || row.commission_id);
      if (!commissionId) return;
      var productId = asText(
        row.productId ||
          row.product_id ||
          (row.commission && row.commission.product_id)
      );
      var title = asText(row.title);
      var fragmentHtml = "";
      var pageKey = asText(row.pageKey);
      var unsupportedReason = "";

      // Prefer the published constituent package HTML for fidelity (visuals, table
      // workspaces, media paths). Re-rendering sourcePage without the package's
      // visual/workspace context drops graphics and editable tables.
      if (row.learnerPackage && typeof row.learnerPackage.html === "string") {
        var extracted = extractRendererFragmentFromHtml(row.learnerPackage.html);
        if (extracted.ok) {
          fragmentHtml = extracted.html;
          if (!pageKey) pageKey = extracted.pageKey;
        } else {
          unsupportedReason =
            "Could not extract renderer fragment from constituent HTML (" +
              extracted.code +
              ").";
        }
      }

      if (!fragmentHtml && row.fragmentHtml) {
        fragmentHtml = String(row.fragmentHtml);
      }

      if (
        !fragmentHtml &&
        row.sourcePage &&
        lifecycle &&
        typeof lifecycle.renderLearnerResourceFragment === "function"
      ) {
        var rendered = lifecycle.renderLearnerResourceFragment(row.sourcePage, {
          compositionMode: opts.compositionMode || "beats",
          visualAssets: row.visualAssets || opts.visualAssets || null
        });
        if (rendered && !rendered.error && rendered.html) {
          fragmentHtml = rendered.html;
          var keyMatch = rendered.html.match(
            /\bdata-persistence-page-key\s*=\s*["']([^"']*)["']/i
          );
          if (!pageKey && keyMatch) pageKey = keyMatch[1];
        } else {
          unsupportedReason =
            unsupportedReason ||
            "Fragment render failed" +
              (rendered && rendered.error ? ": " + rendered.error : "");
        }
      }

      // Restore the in-content title before seating section nav so inject can
      // anchor after util-page-header rather than the first activity header.
      if (fragmentHtml) {
        fragmentHtml = ensureResourceTitleHeading(
          demoteLeadingH1(fragmentHtml),
          title
        );
      }

      // Restore constituent section/activity navigation lost when standalone
      // sticky header + boot script sit outside the extracted renderer fragment.
      // Also reseats nav that was previously buried inside activity headers.
      if (
        fragmentHtml &&
        lifecycle &&
        typeof lifecycle.enhanceFragmentWithSectionNavigation === "function"
      ) {
        fragmentHtml = lifecycle.enhanceFragmentWithSectionNavigation(fragmentHtml, {
          sourcePage: row.sourcePage || null
        });
      }

      var knownMountable = {
        assessment_pack: true,
        interactive: true,
        expository: true,
        situated_task: true
      };
      if (productId && !knownMountable[productId] && !row.forceMount) {
        warnings.push({
          commissionId: commissionId,
          productId: productId,
          reason:
            "Unknown product_id for unified shell mount; fragment may mount without product-specific lifecycle guarantees."
        });
      }

      if (!fragmentHtml) {
        warnings.push({
          commissionId: commissionId,
          productId: productId,
          reason: unsupportedReason || "No mountable fragment available."
        });
        return;
      }

      // Remap asset paths to journey-relative media/<commissionId>/
      fragmentHtml = rewriteAssetPaths(fragmentHtml, "media/" + commissionId + "/");

      prepared.push({
        commissionId: commissionId,
        title: title,
        html: fragmentHtml,
        pageKey: pageKey,
        productId: productId,
        learnerPackage: row.learnerPackage || null
      });
    });

    return { ok: prepared.length > 0, resources: prepared, warnings: warnings };
  }

  function resolveFflate(fflateOverride) {
    if (fflateOverride && typeof fflateOverride.zipSync === "function") {
      return fflateOverride;
    }
    if (typeof require === "function") {
      try {
        return require("fflate");
      } catch (_err) {}
    }
    return null;
  }

  function buildLearningJourneyZipBasename(title) {
    var base = asText(title) || "learning-journey";
    base = base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60);
    return (base || "learning-journey") + "-unified-shell.zip";
  }

  /**
   * Assemble an additive unified-shell ZIP (index.html + runtime + media).
   * Does not modify or replace multi-document assembleLearningJourneyLearnerPackage.
   */
  function assembleLearningJourneyUnifiedShellPackage(input) {
    var src = input && typeof input === "object" ? input : {};
    var page = src.page;
    var prepared = prepareUnifiedShellResources(src.constituents, {
      lifecycle: src.lifecycle,
      compositionMode: src.compositionMode,
      visualAssets: src.visualAssets
    });
    if (!prepared.ok) {
      return {
        ok: false,
        error: {
          code: "resources_required",
          message: "Unified shell requires at least one mountable resource fragment.",
          warnings: prepared.warnings
        }
      };
    }

    var runtimeSource = typeof src.runtimeScript === "string" ? src.runtimeScript : "";
    var runtimeSrc = "runtime/learner-renderer-vnext-browser.js";
    if (!runtimeSource) {
      runtimeSource = readBrowserRuntimeSource();
    }
    if (!runtimeSource) {
      return {
        ok: false,
        error: {
          code: "runtime_missing",
          message:
            "learner-renderer-vnext-browser.js source bytes are required for the unified shell package. In Node, run npm run build:learner-renderer-vnext-browser. In the browser, pass runtimeScript (fetch the loaded learner-renderer-vnext-browser.js URL)."
        }
      };
    }

    var shell = buildLearningJourneyUnifiedShellHtml(page, prepared.resources, {
      learnerCss: src.learnerCss,
      runtimeSrc: runtimeSrc,
      designMod: src.designMod,
      artefactContract: src.artefactContract
    });
    if (!shell.ok) {
      return {
        ok: false,
        error: {
          code: shell.code || "shell_build_failed",
          message: "Failed to build unified shell HTML.",
          blockers: shell.blockers
        }
      };
    }

    var files = Object.create(null);
    var entryPaths = [];
    files["index.html"] = shell.html;
    entryPaths.push("index.html");
    files[runtimeSrc] = runtimeSource;
    entryPaths.push(runtimeSrc);

    prepared.resources.forEach(function (row) {
      var pkg = row.learnerPackage;
      if (!pkg || !Array.isArray(pkg.assets)) return;
      pkg.assets.forEach(function (asset) {
        if (!asset || typeof asset !== "object") return;
        var rawPath = asText(asset.path)
          .replace(/^(\.\/)?assets\//, "")
          .replace(/^(\.\/)?media\//, "");
        if (!rawPath || rawPath.indexOf("..") >= 0 || rawPath.charAt(0) === "/") return;
        var outPath = "media/" + row.commissionId + "/" + rawPath;
        files[outPath] = asset.bytes;
        entryPaths.push(outPath);
      });
    });

    var fflate = resolveFflate(src.fflate);
    if (!fflate || typeof fflate.zipSync !== "function" || typeof fflate.strToU8 !== "function") {
      return {
        ok: false,
        error: {
          code: "fflate_unavailable",
          message: "fflate.zipSync and fflate.strToU8 are required."
        }
      };
    }

    try {
      var zipFiles = Object.create(null);
      Object.keys(files).forEach(function (entryPath) {
        var value = files[entryPath];
        zipFiles[entryPath] =
          typeof value === "string" ? fflate.strToU8(value) : value;
      });
      var bytes = fflate.zipSync(zipFiles, { level: 6 });
      return {
        ok: true,
        bytes: bytes,
        entryPaths: entryPaths,
        zipName: buildLearningJourneyZipBasename(shell.title),
        homeTitle: shell.title,
        warnings: prepared.warnings,
        packageMode: "unified_shell",
        artefactContract: shell.artefactContract || null,
        resources: prepared.resources.map(function (row) {
          return {
            commissionId: row.commissionId,
            title: row.title,
            pageKey: row.pageKey,
            productId: row.productId
          };
        })
      };
    } catch (err) {
      return {
        ok: false,
        error: {
          code: "zip_failed",
          message: String((err && err.message) || err || "ZIP serialisation failed")
        }
      };
    }
  }

  return {
    OVERVIEW_NAV_ID: OVERVIEW_NAV_ID,
    OVERVIEW_NAV_TITLE: OVERVIEW_NAV_TITLE,
    buildLearningJourneyUnifiedShellHtml: buildLearningJourneyUnifiedShellHtml,
    assembleLearningJourneyUnifiedShellPackage: assembleLearningJourneyUnifiedShellPackage,
    prepareUnifiedShellResources: prepareUnifiedShellResources,
    extractRendererFragmentFromHtml: extractRendererFragmentFromHtml,
    rewriteAssetPaths: rewriteAssetPaths,
    demoteLeadingH1: demoteLeadingH1,
    ensureResourceTitleHeading: ensureResourceTitleHeading,
    resolveLearnerExportCss: resolveLearnerExportCss,
    renderOverviewMarkdown: renderOverviewMarkdown,
    sortedSections: sortedSections,
    sortedCommissions: sortedCommissions
  };
});
