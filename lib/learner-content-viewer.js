/**
 * Sprint 70 — reusable expandable learner content viewer (dialog).
 * Content-type agnostic shell; this slice wires image support only.
 * Does not mutate LearnerPackage / ZIP serializers.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.PRISM_LEARNER_CONTENT_VIEWER = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var DIALOG_ID = "prism-learner-content-viewer";
  var TITLE_ID = "prism-learner-content-viewer-title";

  /** Expand / maximise glyph (not magnifying glass). */
  var EXPAND_ICON_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" ' +
    'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
    'stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    '<polyline points="15 3 21 3 21 9"></polyline>' +
    '<polyline points="9 21 3 21 3 15"></polyline>' +
    '<line x1="21" y1="3" x2="14" y2="10"></line>' +
    '<line x1="3" y1="21" x2="10" y2="14"></line>' +
    "</svg>";

  function renderExpandControlHtml() {
    return (
      '<button type="button" class="util-learner-content-expand" ' +
      'aria-label="View image larger" title="View image larger">' +
      EXPAND_ICON_SVG +
      "</button>"
    );
  }

  function buildDialogHtml() {
    return (
      '<dialog id="' +
      DIALOG_ID +
      '" class="util-learner-content-viewer" aria-labelledby="' +
      TITLE_ID +
      '">' +
      '<div class="util-learner-content-viewer__panel">' +
      '<div class="util-learner-content-viewer__header">' +
      '<h2 id="' +
      TITLE_ID +
      '" class="util-learner-content-viewer__title">Expanded view</h2>' +
      '<button type="button" class="util-learner-content-viewer__close" ' +
      'data-learner-content-close>Close</button>' +
      "</div>" +
      '<div class="util-learner-content-viewer__body" data-learner-content-kind-host>' +
      '<img class="util-learner-content-viewer__image" alt="" hidden />' +
      '<div class="util-learner-content-viewer__table-host" hidden></div>' +
      '<p class="util-learner-content-viewer__caption" hidden></p>' +
      "</div>" +
      "</div>" +
      "</dialog>"
    );
  }

  function buildCss() {
    return [
      ".util-learner-renderer-vnext .util-visual-asset{position:relative}",
      ".util-learner-renderer-vnext .util-visual-asset-media{position:relative;display:block;max-width:100%}",
      ".util-learner-renderer-vnext .util-visual-asset-image{display:block;width:100%;max-width:100%;height:auto;border:1px solid #e5e7eb;border-radius:8px;cursor:zoom-in}",
      ".util-learner-renderer-vnext .util-visual-asset-caption{margin-top:.5rem;font-size:.875rem;line-height:1.45;color:#475569}",
      ".util-learner-content-expand{",
      "position:absolute;top:.5rem;right:.5rem;z-index:2;",
      "box-sizing:border-box;width:2.2rem;height:2.2rem;min-width:2.2rem;min-height:2.2rem;",
      "display:inline-flex;align-items:center;justify-content:center;padding:0;margin:0;",
      "border:1px solid rgba(15,23,42,.18);border-radius:.55rem;",
      "background:rgba(255,255,255,.82);color:#0f172a;",
      "backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);",
      "box-shadow:0 1px 2px rgba(15,23,42,.12);cursor:pointer;",
      "}",
      ".util-learner-content-expand:hover{background:rgba(255,255,255,.94)}",
      ".util-learner-content-expand:focus-visible{outline:2px solid #2563eb;outline-offset:2px}",
      ".util-learner-content-expand svg{display:block;pointer-events:none}",
      ".util-learner-content-viewer{padding:0;border:0;background:transparent;max-width:none}",
      ".util-learner-content-viewer::backdrop{background:rgba(15,23,42,.62)}",
      ".util-learner-content-viewer__panel{",
      "box-sizing:border-box;width:min(96vw,72rem);max-height:92vh;margin:auto;",
      "display:flex;flex-direction:column;gap:.75rem;",
      "padding:1rem 1rem 1.1rem;border-radius:1rem;",
      "background:#fff;color:#0f172a;",
      "box-shadow:0 20px 50px rgba(15,23,42,.35);",
      "}",
      ".util-learner-content-viewer__header{display:flex;align-items:center;justify-content:space-between;gap:.75rem}",
      ".util-learner-content-viewer__title{margin:0;font-size:1rem;font-weight:600;line-height:1.3}",
      ".util-learner-content-viewer__close{",
      "appearance:none;border:1px solid #cbd5e1;border-radius:.55rem;",
      "background:#f8fafc;color:#0f172a;padding:.45rem .85rem;font:inherit;cursor:pointer;",
      "}",
      ".util-learner-content-viewer__close:focus-visible,",
      ".util-learner-content-expand:focus-visible{",
      "outline:2px solid #2563eb;outline-offset:2px",
      "}",
      ".util-learner-content-viewer__body{overflow:auto;max-height:calc(92vh - 4.5rem)}",
      ".util-learner-content-viewer__image{",
      "display:block;max-width:100%;max-height:80vh;width:auto;height:auto;",
      "margin:0 auto;object-fit:contain;",
      "}",
      ".util-learner-content-viewer__caption{margin:.75rem 0 0;font-size:.9rem;line-height:1.45;color:#334155}",
      ".util-learner-content-viewer__caption[hidden],",
      ".util-learner-content-viewer__image[hidden],",
      ".util-learner-content-viewer__table-host[hidden]{display:none!important}",
      "@media (prefers-reduced-motion:reduce){",
      ".util-learner-content-viewer,.util-learner-content-viewer::backdrop{transition:none!important}",
      "}"
    ].join("");
  }

  function buildScript() {
    // Single shared dialog; populate from selected figure. No inline onclick.
    return (
      "<script>" +
      "(function(){" +
      "var dialog=document.getElementById('" +
      DIALOG_ID +
      "');" +
      "if(!dialog||typeof dialog.showModal!=='function')return;" +
      "var imgEl=dialog.querySelector('.util-learner-content-viewer__image');" +
      "var captionEl=dialog.querySelector('.util-learner-content-viewer__caption');" +
      "var tableHost=dialog.querySelector('.util-learner-content-viewer__table-host');" +
      "var closeBtn=dialog.querySelector('[data-learner-content-close]');" +
      "var lastOpener=null;" +
      "function clearHosts(){" +
      "if(imgEl){imgEl.hidden=true;imgEl.removeAttribute('src');imgEl.alt='';}" +
      "if(tableHost){tableHost.hidden=true;tableHost.textContent='';}" +
      "if(captionEl){captionEl.hidden=true;captionEl.textContent='';}" +
      "}" +
      "function openFromFigure(figure,opener){" +
      "if(!figure)return;" +
      "var kind=figure.getAttribute('data-learner-content-kind')||'image';" +
      "clearHosts();" +
      "if(kind==='image'){" +
      "var sourceImg=figure.querySelector('img.util-visual-asset-image');" +
      "if(!sourceImg||!imgEl)return;" +
      "var src=sourceImg.getAttribute('src')||'';" +
      "if(!src)return;" +
      "imgEl.src=src;" +
      "imgEl.alt=sourceImg.getAttribute('alt')||'';" +
      "imgEl.hidden=false;" +
      "}else{return;}" +
      "var cap=figure.querySelector('figcaption');" +
      "if(captionEl&&cap&&cap.textContent&&String(cap.textContent).trim()){" +
      "captionEl.textContent=String(cap.textContent).trim();" +
      "captionEl.hidden=false;" +
      "}" +
      "lastOpener=opener||null;" +
      "if(!dialog.open)dialog.showModal();" +
      "if(closeBtn&&typeof closeBtn.focus==='function')closeBtn.focus();" +
      "}" +
      "function closeViewer(){" +
      "if(dialog.open)dialog.close();" +
      "}" +
      "dialog.addEventListener('close',function(){" +
      "var opener=lastOpener;lastOpener=null;clearHosts();" +
      "if(opener&&typeof opener.focus==='function'){" +
      "try{opener.focus();}catch(e){}" +
      "}" +
      "});" +
      "if(closeBtn)closeBtn.addEventListener('click',function(ev){" +
      "ev.preventDefault();closeViewer();" +
      "});" +
      "function onViewerKeydown(ev){" +
      "if(!dialog.open)return;" +
      "if(ev.key==='Escape'){" +
      "ev.preventDefault();" +
      "closeViewer();" +
      "}" +
      "}" +
      "document.addEventListener('keydown',onViewerKeydown);" +
      "dialog.addEventListener('keydown',onViewerKeydown);" +
      "document.addEventListener('click',function(ev){" +
      "var t=ev.target;if(!t||!t.closest)return;" +
      "var btn=t.closest('.util-learner-content-expand');" +
      "if(btn){" +
      "ev.preventDefault();" +
      "openFromFigure(btn.closest('figure.util-visual-asset'),btn);" +
      "return;" +
      "}" +
      "var hit=t.closest('img.util-visual-asset-image');" +
      "if(hit){" +
      "var fig=hit.closest('figure.util-visual-asset');" +
      "if(!fig||!fig.querySelector('.util-learner-content-expand'))return;" +
      "ev.preventDefault();" +
      "openFromFigure(fig,fig.querySelector('.util-learner-content-expand')||hit);" +
      "}" +
      "});" +
      "})();" +
      "</script>"
    );
  }

  function pageHasExpandableContent(html) {
    return /class=["'][^"']*util-learner-content-expand/.test(String(html || ""));
  }

  /**
   * Inject shared dialog + init script into a full standalone learner HTML document.
   * Idempotent: skips if dialog id already present.
   */
  function enhanceStandaloneLearnerHtml(html) {
    var source = String(html == null ? "" : html);
    if (!source) return source;
    if (!pageHasExpandableContent(source)) return source;
    if (source.indexOf('id="' + DIALOG_ID + '"') !== -1) return source;
    var injection = buildDialogHtml() + buildScript();
    if (/<\/body>/i.test(source)) {
      return source.replace(/<\/body>/i, injection + "</body>");
    }
    return source + injection;
  }

  return {
    DIALOG_ID: DIALOG_ID,
    TITLE_ID: TITLE_ID,
    EXPAND_ICON_SVG: EXPAND_ICON_SVG,
    renderExpandControlHtml: renderExpandControlHtml,
    buildDialogHtml: buildDialogHtml,
    buildCss: buildCss,
    buildScript: buildScript,
    pageHasExpandableContent: pageHasExpandableContent,
    enhanceStandaloneLearnerHtml: enhanceStandaloneLearnerHtml
  };
});
