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
   */
  function extractRendererFragmentFromHtml(html) {
    var source = String(html || "");
    if (!source) {
      return { ok: false, code: "empty_html", html: "", pageKey: "" };
    }
    var match = source.match(
      /<(main|article)\b([^>]*\bdata-renderer\s*=\s*["']vnext["'][^>]*)>([\s\S]*?)<\/\1>/i
    );
    if (!match) {
      return { ok: false, code: "renderer_root_missing", html: "", pageKey: "" };
    }
    var attrs = match[2] || "";
    var body = String(match[3] || "").replace(/<script\b[\s\S]*?<\/script>/gi, "");
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

  function rewriteAssetPaths(html, prefix) {
    var base = asText(prefix);
    if (!base) return String(html || "");
    if (base.charAt(base.length - 1) !== "/") base += "/";
    return String(html || "")
      .split("assets/")
      .join(base)
      .split("./assets/")
      .join("./" + base);
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
        // Content-viewer CSS needs browser APIs; omit in Node fallback.
        getUtilityLearnerContentViewerCss: function () {
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

  function buildUnifiedShellChromeCss() {
    return [
      "body.lj-shell-body{margin:0;padding:0;font-family:var(--learner-font-sans,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif);background:#fff;color:#1f2937}",
      "body.lj-shell-body.util-page-export--vnext{padding:0;max-width:none}",
      "body.lj-shell-body,body.lj-shell-body *{box-sizing:border-box}",
      ".lj-shell{display:grid;grid-template-columns:minmax(14rem,18rem) minmax(0,1fr);gap:0;min-height:100vh}",
      ".lj-shell__sidebar{position:sticky;top:0;align-self:start;max-height:100vh;display:flex;flex-direction:column;gap:0;padding:1.25rem 1rem 0;border-right:1px solid #e5e7eb;background:#f8fafc}",
      ".lj-shell__brand{margin:0 0 1rem;flex:0 0 auto}",
      ".lj-shell__brand h1{margin:0;font-size:1.25rem;line-height:1.25;color:#0f172a}",
      ".lj-shell-overview{width:min(100%,70ch);margin:0 auto;padding:0 0 2rem}",
      ".lj-shell-overview__title{margin:0 0 1rem;font-size:1.75rem;line-height:1.25;font-weight:700;letter-spacing:-.015em;color:#0f172a}",
      ".lj-shell-overview__body{font-size:1rem;line-height:1.65;color:#1f2937}",
      ".lj-shell-overview__body>:first-child{margin-top:0}",
      ".lj-shell-overview__body>:last-child{margin-bottom:0}",
      ".lj-shell-overview__body p{margin:0 0 1rem}",
      ".lj-shell-overview__body ul,.lj-shell-overview__body ol{margin:0 0 1rem;padding-left:1.25rem}",
      ".lj-shell-overview__body li{margin:.35rem 0}",
      ".lj-shell-overview__body h3,.lj-shell-overview__body .lj-shell-overview__heading,.lj-shell-overview__body .util-md-heading{margin:1.5rem 0 .75rem;font-size:1.25rem;line-height:1.35;font-weight:700;color:#0f172a}",
      ".lj-shell-overview__body h4{margin:1.25rem 0 .65rem;font-size:1.125rem;line-height:1.35;font-weight:700;color:#0f172a}",
      ".lj-shell__toc-wrap{flex:1 1 auto;min-height:0;overflow:auto;padding-bottom:1rem}",
      ".lj-shell__toc-label{margin:0 0 .5rem;font-size:.75rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#64748b}",
      ".lj-shell__toc{list-style:none;margin:0;padding:0;display:grid;gap:.35rem}",
      ".lj-shell__toc-link{display:block;width:100%;text-align:left;padding:.55rem .65rem;border:1px solid transparent;border-radius:8px;background:transparent;color:#0f172a;font:inherit;font-size:.9rem;line-height:1.35;cursor:pointer}",
      ".lj-shell__toc-link:hover{background:#e2e8f0}",
      ".lj-shell__toc-link:focus-visible{outline:2px solid #2563eb;outline-offset:2px}",
      ".lj-shell__toc-link[aria-current=\"page\"]{background:#dbeafe;border-color:#93c5fd;font-weight:600}",
      ".lj-shell__resource-step{flex:0 0 auto;position:sticky;bottom:0;display:grid;gap:.5rem;padding:1rem 0 1.25rem;border-top:1px solid #e2e8f0;background:#f8fafc}",
      ".lj-shell__resource-step-label{margin:0;font-size:.75rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#64748b}",
      ".lj-shell__nav-btn{appearance:none;display:block;width:100%;min-height:44px;padding:.55rem .75rem;border:1px solid #94a3b8;border-radius:8px;background:#fff;color:#0f172a;font:inherit;font-size:.875rem;font-weight:600;text-align:left;cursor:pointer}",
      ".lj-shell__nav-btn:hover:not(:disabled){background:#f1f5f9}",
      ".lj-shell__nav-btn:focus-visible{outline:2px solid #2563eb;outline-offset:2px}",
      ".lj-shell__nav-btn:disabled{opacity:.45;cursor:not-allowed}",
      ".lj-shell__workspace{display:flex;flex-direction:column;min-width:0;min-height:100vh}",
      ".lj-shell__toolbar{position:sticky;top:0;z-index:40;display:flex;flex-wrap:wrap;align-items:center;gap:.75rem;padding:.75rem 1rem;background:rgba(255,255,255,.97);border-bottom:1px solid #e5e7eb;backdrop-filter:blur(8px)}",
      ".lj-shell__current{margin:0;font-size:.95rem;font-weight:600;color:#0f172a}",
      ".lj-shell__main{padding:1.25rem 1rem 3rem;scroll-margin-top:5.5rem}",
      ".lj-shell__main:focus{outline:none}",
      ".lj-shell__main:focus-visible{outline:2px solid #2563eb;outline-offset:3px}",
      "body.lj-shell-body .util-journey-nav{top:3.75rem;z-index:35}",
      "body.lj-shell-body [data-journey-section]{scroll-margin-top:calc(var(--learner-sticky-nav-height,7.5rem) + 3.75rem)}",
      ".lj-shell__live{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}",
      ".lj-shell__templates{display:none}",
      ".lj-artefact-ref-host{margin:0 0 var(--learner-space-4,1.5rem)}",
      ".lj-artefact-ref{margin:0 0 var(--learner-space-4,1.5rem);padding:1rem 1.1rem;border:1px solid #cbd5e1;border-left:4px solid #64748b;border-radius:8px;background:#f8fafc}",
      ".lj-artefact-ref--missing{border-left-color:#94a3b8;background:#f1f5f9}",
      ".lj-artefact-ref__label{margin:0 0 .35rem;font-size:1rem;line-height:1.35;font-weight:700;color:#0f172a}",
      ".lj-artefact-ref__note,.lj-artefact-ref__missing,.lj-artefact-ref__fallback{margin:0 0 .75rem;font-size:.9rem;line-height:1.5;color:#475569}",
      ".lj-artefact-ref__body{max-height:min(40vh,22rem);overflow:auto;padding:.75rem .85rem;border-radius:6px;background:#fff;border:1px solid #e2e8f0}",
      ".lj-artefact-ref__body:focus-visible{outline:2px solid #2563eb;outline-offset:2px}",
      ".lj-artefact-ref__text{margin:0;white-space:pre-wrap;overflow-wrap:anywhere;font:inherit;font-size:.95rem;line-height:1.55;color:#0f172a}",
      "@media (max-width:860px){.lj-shell{grid-template-columns:1fr}.lj-shell__sidebar{position:relative;max-height:none;border-right:0;border-bottom:1px solid #e5e7eb}.lj-shell__resource-step{position:static}}"
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
      "var main=document.getElementById('lj-shell-main');" +
      "var live=document.getElementById('lj-shell-live');" +
      "var currentLabel=document.getElementById('lj-shell-current-label');" +
      "var prevBtn=document.getElementById('lj-shell-prev');" +
      "var nextBtn=document.getElementById('lj-shell-next');" +
      "var handle=null;" +
      "var currentId=null;" +
      "var mountCount=0;" +
      "function findResource(id){for(var i=0;i<resources.length;i++){if(resources[i].commissionId===id)return resources[i];}return null;}" +
      "function indexOf(id){for(var i=0;i<resources.length;i++){if(resources[i].commissionId===id)return i;}return -1;}" +
      "function isOverview(entry){return !!(entry&&(entry.kind==='overview'||entry.commissionId==='" +
      OVERVIEW_NAV_ID +
      "'));}" +
      "function templateHtml(id){var tpl=document.getElementById('lj-resource-'+id);return tpl?tpl.innerHTML:'';}" +
      "function setNavState(id){" +
      "var links=document.querySelectorAll('[data-lj-nav-id]');" +
      "for(var i=0;i<links.length;i++){" +
      "var active=links[i].getAttribute('data-lj-nav-id')===id;" +
      "if(active)links[i].setAttribute('aria-current','page');else links[i].removeAttribute('aria-current');" +
      "}" +
      "var idx=indexOf(id);" +
      "if(prevBtn)prevBtn.disabled=idx<=0;" +
      "if(nextBtn)nextBtn.disabled=idx<0||idx>=resources.length-1;" +
      "var entry=findResource(id);" +
      "if(currentLabel&&entry)currentLabel.textContent=entry.title;" +
      "}" +
      "function announce(title){if(!live)return;live.textContent='';setTimeout(function(){live.textContent='Now showing: '+title;},40);}" +
      "function focusResource(){" +
      "var heading=main.querySelector('[data-lj-resource-title], h2, h1');" +
      "if(heading){if(!heading.hasAttribute('tabindex'))heading.setAttribute('tabindex','-1');heading.focus();return;}" +
      "main.setAttribute('tabindex','-1');main.focus();" +
      "}" +
      "function showResource(id,opts){" +
      "opts=opts||{};" +
      "var entry=findResource(id);if(!entry)return;" +
      "var alreadyShowing=id===currentId&&(isOverview(entry)||(handle&&handle.ok));" +
      "if(alreadyShowing){if(!opts.skipFocus)focusResource();return;}" +
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
      "}" +
      "function initialId(){" +
      "var raw=(location.hash||'').replace(/^#/,'');" +
      "if(raw){try{raw=decodeURIComponent(raw);}catch(e){}" +
      "if(findResource(raw))return raw;}" +
      "return resources[0].commissionId;" +
      "}" +
      "document.addEventListener('click',function(event){" +
      "var btn=event.target&&event.target.closest?event.target.closest('[data-lj-nav-id]'):null;" +
      "if(!btn)return;" +
      "event.preventDefault();" +
      "showResource(btn.getAttribute('data-lj-nav-id'));" +
      "});" +
      "if(prevBtn)prevBtn.addEventListener('click',function(){var i=indexOf(currentId);if(i>0)showResource(resources[i-1].commissionId);});" +
      "if(nextBtn)nextBtn.addEventListener('click',function(){var i=indexOf(currentId);if(i>=0&&i<resources.length-1)showResource(resources[i+1].commissionId);});" +
      "window.addEventListener('hashchange',function(){" +
      "var raw=(location.hash||'').replace(/^#/,'');" +
      "try{raw=decodeURIComponent(raw);}catch(e){}" +
      "if(findResource(raw))showResource(raw,{skipAnnounce:false});" +
      "});" +
      "showResource(initialId(),{skipFocus:false});" +
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
      resourceMap[id] = {
        html: demoteLeadingH1(html),
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
    var initialNav = navEntries[0];

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

    parts.push('<aside class="lj-shell__sidebar" aria-label="Journey navigation">');
    parts.push('<header class="lj-shell__brand">');
    parts.push("<h1>" + escapeHtml(journeyTitle) + "</h1>");
    parts.push("</header>");
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
    parts.push("</ol></nav></div>");
    parts.push(
      '<div class="lj-shell__resource-step" role="group" aria-label="Resource step controls">'
    );
    parts.push(
      '<p class="lj-shell__resource-step-label" id="lj-shell-resource-step-label">Resources</p>'
    );
    parts.push(
      '<button type="button" class="lj-shell__nav-btn" id="lj-shell-prev" disabled>Previous resource</button>'
    );
    parts.push(
      '<button type="button" class="lj-shell__nav-btn" id="lj-shell-next"' +
        (navEntries.length < 2 ? " disabled" : "") +
        ">Next resource</button>"
    );
    parts.push("</div></aside>");

    parts.push('<div class="lj-shell__workspace">');
    parts.push('<div class="lj-shell__toolbar">');
    parts.push(
      '<p class="lj-shell__current" id="lj-shell-current-label">' +
        escapeHtml(initialNav.title) +
        "</p>"
    );
    parts.push("</div>");
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

      if (row.sourcePage && lifecycle && typeof lifecycle.renderLearnerResourceFragment === "function") {
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
            "Fragment render failed" +
            (rendered && rendered.error ? ": " + rendered.error : "");
        }
      }

      if (!fragmentHtml && row.fragmentHtml) {
        fragmentHtml = String(row.fragmentHtml);
      }

      if (!fragmentHtml && row.learnerPackage && typeof row.learnerPackage.html === "string") {
        var extracted = extractRendererFragmentFromHtml(row.learnerPackage.html);
        if (extracted.ok) {
          fragmentHtml = extracted.html;
          if (!pageKey) pageKey = extracted.pageKey;
        } else {
          unsupportedReason =
            unsupportedReason ||
            "Could not extract renderer fragment from constituent HTML (" +
              extracted.code +
              ").";
        }
      }

      // Restore constituent section/activity navigation lost when standalone
      // sticky header + boot script sit outside the extracted renderer fragment.
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
        var rawPath = asText(asset.path).replace(/^(\.\/)?assets\//, "");
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
    demoteLeadingH1: demoteLeadingH1,
    resolveLearnerExportCss: resolveLearnerExportCss,
    renderOverviewMarkdown: renderOverviewMarkdown,
    sortedSections: sortedSections,
    sortedCommissions: sortedCommissions
  };
});
