/**
 * Sprint 91 — Learning Journey final learner-package assembly.
 *
 * Composition ownership: Learning Journey artefact (sections[] + commissions[]).
 * Constituent packages: reused first-class LearnerPackage outputs, nested under commission_id/.
 * No AI after the structured artefact boundary.
 */
(function (root, factory) {
  var api = factory(root);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.PRISM_LEARNING_JOURNEY_LEARNER_PACKAGE = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  "use strict";

  function asText(value) {
    return String(value == null ? "" : value).trim();
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function resolveStatusMod() {
    if (typeof require === "function") {
      try {
        return require("./learning-journey-commission-production-status.js");
      } catch (_err) {
        try {
          return require("../lib/learning-journey-commission-production-status.js");
        } catch (_err2) {}
      }
    }
    var roots = [root, typeof globalThis !== "undefined" ? globalThis : null, typeof window !== "undefined" ? window : null];
    var i;
    for (i = 0; i < roots.length; i += 1) {
      if (roots[i] && roots[i].PRISM_LEARNING_JOURNEY_COMMISSION_PRODUCTION_STATUS) {
        return roots[i].PRISM_LEARNING_JOURNEY_COMMISSION_PRODUCTION_STATUS;
      }
    }
    return null;
  }

  function resolveDesignPageMod() {
    if (typeof require === "function") {
      try {
        return require("./learning-journey-design-page.js");
      } catch (_err) {
        try {
          return require("../lib/learning-journey-design-page.js");
        } catch (_err2) {}
      }
    }
    var roots = [root, typeof globalThis !== "undefined" ? globalThis : null, typeof window !== "undefined" ? window : null];
    var i;
    for (i = 0; i < roots.length; i += 1) {
      if (roots[i] && roots[i].PRISM_LEARNING_JOURNEY_DESIGN_PAGE) {
        return roots[i].PRISM_LEARNING_JOURNEY_DESIGN_PAGE;
      }
    }
    return null;
  }

  function resolveLearnerPackageMod() {
    if (typeof require === "function") {
      try {
        return require("./learner-package.js");
      } catch (_err) {
        try {
          return require("../lib/learner-package.js");
        } catch (_err2) {}
      }
    }
    var roots = [root, typeof globalThis !== "undefined" ? globalThis : null, typeof window !== "undefined" ? window : null];
    var i;
    for (i = 0; i < roots.length; i += 1) {
      if (roots[i] && roots[i].PRISM_LEARNER_PACKAGE) {
        return roots[i].PRISM_LEARNER_PACKAGE;
      }
    }
    return null;
  }

  function resolveEditorialOpeningMod() {
    if (typeof require === "function") {
      try {
        return require("./expository-editorial-opening.js");
      } catch (_err) {
        try {
          return require("../lib/expository-editorial-opening.js");
        } catch (_err2) {}
      }
    }
    var roots = [root, typeof globalThis !== "undefined" ? globalThis : null, typeof window !== "undefined" ? window : null];
    var i;
    for (i = 0; i < roots.length; i += 1) {
      if (roots[i] && roots[i].PRISM_EXPOSITORY_EDITORIAL_OPENING) {
        return roots[i].PRISM_EXPOSITORY_EDITORIAL_OPENING;
      }
    }
    return null;
  }

  function resolveVisualAffordanceMod() {
    if (typeof require === "function") {
      try {
        return require("./learner-renderer-vnext/render-visual-affordance.js");
      } catch (_err) {}
    }
    var roots = [root, typeof globalThis !== "undefined" ? globalThis : null, typeof window !== "undefined" ? window : null];
    var i;
    for (i = 0; i < roots.length; i += 1) {
      if (roots[i] && roots[i].PRISM_LEARNER_RENDERER_VNEXT &&
          typeof roots[i].PRISM_LEARNER_RENDERER_VNEXT.renderVisualAffordanceFigure === "function") {
        return roots[i].PRISM_LEARNER_RENDERER_VNEXT;
      }
    }
    return null;
  }

  function clonePlain(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_err) {
      return null;
    }
  }

  function titlesEqual(left, right) {
    return asText(left).toLowerCase() === asText(right).toLowerCase() && !!asText(left);
  }

  function collectEditorialOpeningAsset(visualAssets) {
    var assets = [];
    if (Array.isArray(visualAssets)) assets = visualAssets;
    else if (visualAssets && Array.isArray(visualAssets.assets)) assets = visualAssets.assets;
    var i;
    for (i = 0; i < assets.length; i += 1) {
      var asset = assets[i];
      if (!asset || typeof asset !== "object") continue;
      var slot = asText(asset.visual_slot || asset.visualSlot).toLowerCase();
      var brief = asText(asset.brief_id || asset.briefId).toLowerCase();
      if (slot === "editorial-opening" || brief === "brief-editorial-opening") return asset;
    }
    return null;
  }

  function getAssetDataUrl(asset) {
    if (!asset || typeof asset !== "object") return "";
    var rs = asset.render_source;
    if (rs && typeof rs === "object") {
      var value = asText(rs.value);
      if (value.indexOf("data:") === 0) return value;
      if (asText(rs.kind).toLowerCase() === "data_url" && value) return value;
    }
    return asText(asset.data_url || asset.dataUrl);
  }

  function decodeHomeImageDataUrl(dataUrl) {
    var pkg = resolveLearnerPackageMod();
    if (pkg && typeof pkg.decodeImageDataUrl === "function") {
      return pkg.decodeImageDataUrl(dataUrl);
    }
    var raw = asText(dataUrl);
    var match = /^data:([^;,]+)?(;base64)?,(.*)$/i.exec(raw);
    if (!match || !match[2]) return { ok: false };
    var mime = asText(match[1]).toLowerCase() || "image/png";
    var b64 = String(match[3] || "").replace(/\s+/g, "");
    try {
      var binary;
      if (typeof atob === "function") binary = atob(b64);
      else if (typeof Buffer !== "undefined") binary = Buffer.from(b64, "base64").toString("binary");
      else return { ok: false };
      var bytes = new Uint8Array(binary.length);
      var i;
      for (i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i) & 0xff;
      return { ok: true, mime: mime, bytes: bytes };
    } catch (_err) {
      return { ok: false };
    }
  }

  function extensionForMime(mime) {
    var key = asText(mime).toLowerCase();
    if (key === "image/jpeg") return "jpg";
    if (key === "image/webp") return "webp";
    return "png";
  }

  function packageHomeEditorialAsset(asset) {
    if (!asset || typeof asset !== "object") return null;
    var packaged = clonePlain(asset) || {};
    packaged.visual_slot = "editorial-opening";
    var existingBytes =
      asset.bytes instanceof Uint8Array
        ? asset.bytes
        : typeof Buffer !== "undefined" && Buffer.isBuffer(asset.bytes)
          ? new Uint8Array(asset.bytes)
          : null;
    if (existingBytes && existingBytes.length) {
      var extFromMime = extensionForMime(asset.mime_type || asset.mimeType || packaged.mime_type);
      var pathFromBytes = "media/editorial-opening." + extFromMime;
      packaged.render_source = { kind: "file", value: pathFromBytes };
      return { path: pathFromBytes, bytes: existingBytes, asset: packaged };
    }
    var dataUrl = getAssetDataUrl(asset);
    if (!dataUrl) return null;
    var decoded = decodeHomeImageDataUrl(dataUrl);
    if (!decoded || !decoded.ok || !decoded.bytes) return null;
    var path = "media/editorial-opening." + extensionForMime(decoded.mime);
    packaged.mime_type = decoded.mime;
    packaged.render_source = { kind: "file", value: path };
    return { path: path, bytes: decoded.bytes, asset: packaged };
  }

  function looksLikeImageCommission(value) {
    var text = asText(value);
    if (!text) return false;
    if (/^(create|generate|draw|illustrate|render|produce|write|design)\b/i.test(text)) return true;
    if (
      /\b(photorealistic|cinematic|camera|lens|bokeh|do not reveal|must not|does not reveal|not documentary|assessment stimulus|accessibility|caption_intent|detailed_description|image-generation|production instruction)\b/i.test(
        text
      )
    ) {
      return true;
    }
    if (text.length > 160) return true;
    if ((text.match(/[.!?]/g) || []).length > 1) return true;
    return false;
  }

  function stripAltSignpost(value) {
    return asText(value).replace(/\s*;\s*detailed description follows\.?\s*$/i, "");
  }

  function stripLeadingFigureNumber(value) {
    return asText(value).replace(/^figure\s*\d+\s*[.:]\s*/i, "");
  }

  function safeEditorialPhrase(value) {
    var text = stripLeadingFigureNumber(stripAltSignpost(value));
    if (!text || looksLikeImageCommission(text)) return "";
    if (/[.!?]$/.test(text)) return text;
    return text + ".";
  }

  function sameEditorialPhrase(left, right) {
    function norm(value) {
      return asText(value)
        .replace(/[.!?]+$/g, "")
        .replace(/\s+/g, " ")
        .toLowerCase();
    }
    var a = norm(left);
    var b = norm(right);
    return !!(a && b && a === b);
  }

  function editorialCaptionBody(asset, hook) {
    var candidates = [
      asset && (asset.learner_caption || asset.learnerCaption || asset.learner_facing_caption),
      asset && asset.subject,
      hook && hook.subject,
      asset && (asset.alt_text || asset.altText)
    ];
    var index = 0;
    for (; index < candidates.length; index += 1) {
      var phrase = safeEditorialPhrase(candidates[index]);
      if (phrase) return phrase;
    }
    return "";
  }

  function editorialBannerAltText(asset, hook) {
    if (asset && (asset.decorative === true || asset.decorative_only === true)) return "";
    if (asset && Object.prototype.hasOwnProperty.call(asset, "alt_text") && String(asset.alt_text) === "") {
      return "";
    }
    var authored = safeEditorialPhrase(asset && (asset.alt_text || asset.altText));
    if (authored) return authored.replace(/[.]+$/g, "");
    return asText(safeEditorialPhrase((asset && asset.subject) || (hook && hook.subject))).replace(/[.]+$/g, "");
  }

  function renderLearningJourneyEditorialBannerHtml(visualAssetsOrAsset, page) {
    var asset = visualAssetsOrAsset;
    if (asset && (Array.isArray(asset) || (asset.assets && Array.isArray(asset.assets)))) {
      asset = collectEditorialOpeningAsset(asset);
    }
    return renderHomeEditorialBannerHtml(asset, page);
  }

  function renderHomeEditorialBannerHtml(asset, page) {
    if (!asset || typeof asset !== "object") return "";
    var src = asset.render_source ? asText(asset.render_source.value) : "";
    if (!src) return "";
    var editorialMod = resolveEditorialOpeningMod();
    var hook =
      editorialMod && typeof editorialMod.openingHook === "function"
        ? editorialMod.openingHook(page) || {}
        : { slot: "editorial-opening", affordanceId: "va-editorial-opening", subject: asText(asset.subject) };
    hook.slot = "editorial-opening";
    var figureMod = resolveVisualAffordanceMod();
    var figureHtml = "";
    if (figureMod && typeof figureMod.renderVisualAffordanceFigure === "function") {
      figureHtml = String(
        figureMod.renderVisualAffordanceFigure(asset, hook, { figureCounter: { value: 0 } }) || ""
      );
    }
    if (!figureHtml) {
      var captionBody = editorialCaptionBody(asset, hook);
      var alt = editorialBannerAltText(asset, hook);
      var captionHtml = "";
      if (captionBody) {
        var repeatedInAlt = sameEditorialPhrase(captionBody, alt);
        var bodyHtml = repeatedInAlt
          ? '<span aria-hidden="true">' + escapeHtml(captionBody) + "</span>"
          : escapeHtml(captionBody);
        captionHtml =
          '<figcaption class="util-visual-asset-caption"><strong>Figure 1.</strong> ' +
          bodyHtml +
          "</figcaption>";
      }
      figureHtml =
        '<figure class="util-visual-asset util-visual-asset--editorial-opening" data-visual-slot="editorial-opening"' +
        (captionBody ? ' data-figure-number="1"' : "") +
        ">" +
        '<div class="util-visual-asset-media">' +
        '<img class="util-visual-asset-image" src="' +
        escapeHtml(src) +
        '" alt="' +
        escapeHtml(alt) +
        '" loading="lazy" decoding="async" />' +
        "</div>" +
        captionHtml +
        "</figure>";
    }
    if (!figureHtml) return "";
    return (
      '<div class="util-editorial-opening" data-region="editorial-opening">' +
      figureHtml +
      "</div>"
    );
  }

  function renderHomeVideoHtml(videoProjection) {
    var vp = videoProjection && typeof videoProjection === "object" ? videoProjection : null;
    var embedCode = vp ? String(vp.embed_code || vp.embedCode || "") : "";
    if (!asText(embedCode)) return "";
    var sectionTitle = vp ? asText(vp.section_title || vp.sectionTitle) : "";
    if (!sectionTitle) sectionTitle = "A short introduction";
    var introText = vp ? asText(vp.intro_text || vp.introText) : "";
    return (
      '<section class="lj-home__video util-page-video learner-video" data-region="video">' +
      "<h2>" +
      escapeHtml(sectionTitle) +
      "</h2>" +
      (introText ? '<p class="lj-home__video-intro">' + escapeHtml(introText) + "</p>" : "") +
      '<div class="lj-home__video-embed">' +
      embedCode +
      "</div>" +
      "</section>"
    );
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
    if (root && root.fflate && typeof root.fflate.zipSync === "function") return root.fflate;
    if (typeof globalThis !== "undefined" && globalThis.fflate) return globalThis.fflate;
    return null;
  }

  function renderExpositionMarkdown(text) {
    var raw = asText(text);
    if (!raw) return "";
    return raw
      .split(/\n\s*\n/)
      .map(function (paragraph) {
        var escaped = escapeHtml(paragraph).replace(/\r?\n/g, "<br>");
        escaped = escaped.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
        escaped = escaped.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
        return "<p>" + escaped + "</p>";
      })
      .join("");
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

  function indexCommissionsBySectionId(commissions) {
    var map = {};
    sortedCommissions(commissions).forEach(function (commission) {
      if (!commission || typeof commission !== "object") return;
      var sectionId = asText(commission.section_id);
      if (!sectionId) return;
      if (!map[sectionId]) map[sectionId] = [];
      map[sectionId].push(commission);
    });
    return map;
  }

  /**
   * Deterministic readiness preflight. Reuses Sprint 91 production-status semantics exactly.
   * Callers must supply the SAME prepared runStateByWorkflowId as LJ Preview
   * (from prepareLearningJourneyPreviewProductionByCommissionId), not lightweight store alone.
   */
  function preflightLearningJourneyLearnerPackage(input) {
    var src = input && typeof input === "object" ? input : {};
    var page = src.page && typeof src.page === "object" ? src.page : null;
    var statusMod = src.statusMod || resolveStatusMod();
    var designMod = src.designMod || resolveDesignPageMod();
    var blockers = [];
    var preparationPath = asText(src.preparationPath) || "caller_supplied_runstate";

    if (!page) {
      return {
        ok: false,
        code: "page_required",
        blockers: [{ commissionId: "", title: "", reason: "Learning Journey page is required." }],
        derivation: null,
        preparationDiagnostics: null
      };
    }
    if (
      designMod &&
      typeof designMod.isLearningJourneyDesignPage === "function" &&
      !designMod.isLearningJourneyDesignPage(page)
    ) {
      return {
        ok: false,
        code: "not_learning_journey_page",
        blockers: [
          {
            commissionId: "",
            title: asText(page.title),
            reason: "Page is not a Learning Journey Design Page."
          }
        ],
        derivation: null,
        preparationDiagnostics: null
      };
    }
    if (
      !statusMod ||
      typeof statusMod.deriveLearningJourneyCommissionProductionStatuses !== "function"
    ) {
      return {
        ok: false,
        code: "status_module_unavailable",
        blockers: [
          {
            commissionId: "",
            title: "",
            reason: "Learning Journey production-status module is unavailable."
          }
        ],
        derivation: null,
        preparationDiagnostics: null
      };
    }

    var derivation = statusMod.deriveLearningJourneyCommissionProductionStatuses({
      learningJourneyWorkflowId: src.learningJourneyWorkflowId || src.sourceWorkflowId,
      page: page,
      workflows: src.workflows,
      runStateByWorkflowId: src.runStateByWorkflowId,
      productAcceptsCommission: src.productAcceptsCommission,
      visualJobsWorkspaceMod: src.visualJobsWorkspaceMod
    });

    var STATUS = statusMod.STATUS || {};
    var ordered = derivation && Array.isArray(derivation.ordered) ? derivation.ordered : [];
    if (!ordered.length) {
      blockers.push({
        commissionId: "",
        title: asText(page.title),
        reason: "Learning Journey has no commissions to package."
      });
    }

    ordered.forEach(function (row) {
      if (!row) return;
      var commissionId = asText(row.commissionId);
      var title = "";
      var commission = null;
      if (Array.isArray(page.commissions)) {
        page.commissions.some(function (c) {
          if (c && asText(c.commission_id) === commissionId) {
            commission = c;
            return true;
          }
          return false;
        });
      }
      title = asText(commission && commission.title) || commissionId;
      var status = asText(row.status).toLowerCase();

      if (status === STATUS.UNSUPPORTED || status === "unsupported") {
        blockers.push({
          commissionId: commissionId,
          title: title,
          reason: "Unsupported commission — journey package cannot include it.",
          status: status
        });
        return;
      }
      if (status === STATUS.AMBIGUOUS || status === "ambiguous") {
        blockers.push({
          commissionId: commissionId,
          title: title,
          reason: "Ambiguous constituent match — multiple workflows claim this commission.",
          status: status
        });
        return;
      }
      if (status === STATUS.NOT_COMMISSIONED || status === "not_commissioned") {
        blockers.push({
          commissionId: commissionId,
          title: title,
          reason: "Missing constituent workflow — commission is not yet produced.",
          status: status
        });
        return;
      }
      if (status === STATUS.PRODUCTION || status === "production") {
        blockers.push({
          commissionId: commissionId,
          title: title,
          reason: "Constituent is still in Production (no final Design Page evidence).",
          status: status
        });
        return;
      }
      if (status === STATUS.AUTHORING || status === "authoring") {
        blockers.push({
          commissionId: commissionId,
          title: title,
          reason: "Constituent is still in Authoring (required graphics incomplete).",
          status: status
        });
        return;
      }
      if (status !== STATUS.COMPLETE && status !== "complete") {
        blockers.push({
          commissionId: commissionId,
          title: title,
          reason: "Constituent status is not Complete (" + status + ").",
          status: status
        });
        return;
      }
      if (!asText(row.constituentWorkflowId || row.openWorkflowId)) {
        blockers.push({
          commissionId: commissionId,
          title: title,
          reason: "Complete status lacks a resolved constituent workflow id.",
          status: status
        });
      }
    });

    var hydrateByWid = {};
    (Array.isArray(src.hydrateTrace) ? src.hydrateTrace : []).forEach(function (row) {
      if (!row || typeof row !== "object") return;
      var wid = asText(row.constituentWorkflowId);
      if (wid) hydrateByWid[wid] = row;
    });

    var preparationDiagnostics = {
      path: preparationPath,
      commissions: ordered.map(function (row) {
        if (!row) return null;
        var wid = asText(row.constituentWorkflowId || row.openWorkflowId);
        var hydrate = wid && hydrateByWid[wid] ? hydrateByWid[wid] : null;
        var diag = row.diagnostics && typeof row.diagnostics === "object" ? row.diagnostics : {};
        var assessor = diag.assessor && typeof diag.assessor === "object" ? diag.assessor : {};
        return {
          commissionId: asText(row.commissionId),
          constituentWorkflowId: wid,
          preparationPath: preparationPath,
          captureHydration: hydrate && hydrate.capture ? hydrate.capture : null,
          authoritativePageAssembled: hydrate
            ? !!hydrate.authoritativePageAssembled
            : !!diag.graphicsPageSource,
          graphicsPageSource: asText(diag.graphicsPageSource || (hydrate && hydrate.authoritativePageSource)),
          requiredGraphicsCount:
            typeof row.requiredGraphicsCount === "number"
              ? row.requiredGraphicsCount
              : typeof assessor.required === "number"
                ? assessor.required
                : null,
          durableImageResourceCount:
            typeof diag.durableImageResourceCount === "number"
              ? diag.durableImageResourceCount
              : hydrate && typeof hydrate.recoveredResourceCount === "number"
                ? hydrate.recoveredResourceCount
                : null,
          attachedGraphicsCount:
            typeof row.attachedGraphicsCount === "number"
              ? row.attachedGraphicsCount
              : typeof assessor.attached === "number"
                ? assessor.attached
                : null,
          outstandingGraphicsCount:
            typeof assessor.outstanding === "number" ? assessor.outstanding : null,
          productionStatus: asText(row.status)
        };
      }).filter(Boolean)
    };

    return {
      ok: blockers.length === 0,
      code: blockers.length === 0 ? "ready" : "not_ready",
      blockers: blockers,
      derivation: derivation,
      preparationDiagnostics: preparationDiagnostics,
      readyCommissions: ordered.filter(function (row) {
        return row && asText(row.status).toLowerCase() === "complete";
      })
    };
  }

  function buildLearningJourneyHomeCss() {
    return [
      ':root{--learner-reading-width:70ch;--learner-page-gutter:1rem;--learner-space-1:.5rem;--learner-space-2:.75rem;--learner-space-3:1rem;--learner-space-4:1.5rem;--learner-space-5:2rem;--learner-font-sans:"Segoe UI",Roboto,Helvetica,Arial,sans-serif;--learner-text-xs:.75rem;--learner-text-sm:.875rem;--learner-text-base:1rem;--learner-text-md:1.0625rem;--learner-text-lg:1.125rem;--learner-text-xl:1.25rem;--learner-text-title:1.75rem;--learner-leading-tight:1.25;--learner-leading-heading:1.35;--learner-leading-body:1.65}',
      "body.lj-home-body,body.lj-home-body *{box-sizing:border-box}",
      "body.lj-home-body{margin:0;font-family:var(--learner-font-sans);font-size:var(--learner-text-base);line-height:var(--learner-leading-body);color:#1f2937;background:#fff}",
      ".lj-home{width:min(calc(100% - 2 * var(--learner-page-gutter)),var(--learner-reading-width));margin:0 auto;padding:var(--learner-space-5) 0 4rem}",
      ".lj-home__header{margin:0 0 var(--learner-space-4)}",
      ".lj-home__header h1{margin:0;font-size:var(--learner-text-title);line-height:var(--learner-leading-tight);font-weight:700;letter-spacing:-.015em;color:#0f172a}",
      ".lj-home .util-editorial-opening{margin:0 0 var(--learner-space-4)}",
      ".lj-home .util-visual-asset{margin:0}",
      ".lj-home .util-visual-asset-media{position:relative;display:block;max-width:100%}",
      ".lj-home .util-visual-asset-image{display:block;width:100%;max-width:100%;height:auto;border:0;border-radius:8px}",
      ".lj-home .util-visual-asset-caption{margin-top:var(--learner-space-2);font-size:var(--learner-text-sm);line-height:1.5;color:#4b5563}",
      ".lj-home .util-learner-content-expand{display:none}",
      ".lj-home__intro{margin:0 0 var(--learner-space-5)}",
      ".lj-home__intro h2,.lj-home__video h2,.lj-home__experience h2{margin:0 0 var(--learner-space-2);font-size:var(--learner-text-xl);line-height:var(--learner-leading-heading);font-weight:700;color:#0f172a}",
      ".lj-home__exposition p,.lj-home__video-intro{margin:0 0 var(--learner-space-3);line-height:var(--learner-leading-body);color:#1f2937}",
      ".lj-home__exposition p:last-child{margin-bottom:0}",
      ".lj-home__video{margin:0 0 var(--learner-space-5)}",
      ".lj-home__video-embed iframe,.lj-home__video-embed video{width:100%;aspect-ratio:16/9;height:auto;border:0;border-radius:8px;display:block}",
      ".lj-home__experiences{list-style:none;margin:0;padding:0;display:grid;gap:0}",
      ".lj-home__experience{display:grid;grid-template-columns:2.5rem minmax(0,1fr);gap:var(--learner-space-3);margin:0;padding:var(--learner-space-4) 0;border-top:1px solid #e5e7eb}",
      ".lj-home__experience-index{margin:0;width:2.5rem;height:2.5rem;border-radius:999px;background:#0f172a;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:var(--learner-text-sm)}",
      ".lj-home__experience-body{min-width:0}",
      ".lj-home__action{margin:var(--learner-space-3) 0 0}",
      ".lj-home__link{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:.55rem 1rem;border-radius:8px;background:#1d4ed8;color:#fff;text-decoration:none;font-weight:600;font-size:var(--learner-text-sm)}",
      ".lj-home__link:hover{background:#1e40af}",
      ".lj-home__link:focus-visible{outline:2px solid #2563eb;outline-offset:2px}",
      ".lj-home__footer{margin:var(--learner-space-5) 0 0;padding-top:var(--learner-space-4);border-top:1px solid #e5e7eb;color:#4b5563;font-size:var(--learner-text-sm)}",
      "@media (max-width:720px){.lj-home__header h1{font-size:var(--learner-text-xl)}.lj-home__experience{grid-template-columns:2rem minmax(0,1fr);gap:var(--learner-space-2)}.lj-home__experience-index{width:2rem;height:2rem}}"
    ].join("");
  }

  /**
   * Learner-facing Journey Home from canonical LJ artefact.
   * Order follows sections[].order and commissions[].order — never workflow-list order.
   */
  function buildLearningJourneyHomeHtml(page, options) {
    var opts = options && typeof options === "object" ? options : {};
    var designMod = opts.designMod || resolveDesignPageMod();
    if (
      designMod &&
      typeof designMod.isLearningJourneyDesignPage === "function" &&
      !designMod.isLearningJourneyDesignPage(page)
    ) {
      return { ok: false, code: "not_learning_journey_page", html: "" };
    }
    if (!page || typeof page !== "object") {
      return { ok: false, code: "page_required", html: "" };
    }

    var title = asText(page.title) || "Learning Journey";
    var commissionsBySection = indexCommissionsBySectionId(page.commissions);
    var sections = sortedSections(page.sections);
    var editorialAsset =
      opts.editorialAsset && typeof opts.editorialAsset === "object"
        ? opts.editorialAsset
        : collectEditorialOpeningAsset(opts.visualAssets);
    var editorialHtml = renderHomeEditorialBannerHtml(editorialAsset, page);
    var videoHtml = renderHomeVideoHtml(opts.videoProjection);
    var parts = [];
    parts.push("<!DOCTYPE html>");
    parts.push('<html lang="en">');
    parts.push("<head>");
    parts.push('<meta charset="utf-8">');
    parts.push('<meta name="viewport" content="width=device-width, initial-scale=1">');
    parts.push("<title>" + escapeHtml(title) + "</title>");
    parts.push("<style>" + buildLearningJourneyHomeCss() + "</style>");
    parts.push("</head>");
    parts.push('<body class="lj-home-body">');
    parts.push('<main class="lj-home" data-product-id="learning_journey" data-lj-role="learner-home">');
    parts.push('<header class="lj-home__header">');
    parts.push("<h1>" + escapeHtml(title) + "</h1>");
    parts.push("</header>");
    if (editorialHtml) parts.push(editorialHtml);

    var experienceParts = [];
    var experienceIndex = 0;
    sections.forEach(function (section) {
      if (!section || typeof section !== "object") return;
      var sectionId = asText(section.section_id);
      var sectionTitle = asText(section.title) || sectionId || "Section";
      var expositionHtml = renderExpositionMarkdown(section.exposition);
      var isIntro = sectionId === "journey_intro";
      var matched = commissionsBySection[sectionId] || [];

      if (isIntro) {
        parts.push(
          '<section class="lj-home__intro" data-section-id="' + escapeHtml(sectionId) + '">'
        );
        if (sectionTitle && !titlesEqual(sectionTitle, title)) {
          parts.push("<h2>" + escapeHtml(sectionTitle) + "</h2>");
        }
        if (expositionHtml) {
          parts.push('<div class="lj-home__exposition">' + expositionHtml + "</div>");
        }
        parts.push("</section>");
        return;
      }

      experienceIndex += 1;
      var item = [];
      item.push(
        '<li class="lj-home__experience" data-section-id="' +
          escapeHtml(sectionId) +
          '" data-experience-index="' +
          String(experienceIndex) +
          '">'
      );
      item.push(
        '<p class="lj-home__experience-index" aria-hidden="true">' +
          String(experienceIndex) +
          "</p>"
      );
      item.push('<div class="lj-home__experience-body">');
      item.push("<h2>" + escapeHtml(sectionTitle) + "</h2>");
      if (expositionHtml) {
        item.push('<div class="lj-home__exposition">' + expositionHtml + "</div>");
      }
      matched.forEach(function (commission) {
        var commissionId = asText(commission.commission_id);
        if (!commissionId) return;
        var href = commissionId + "/index.html";
        var actionLabel = "Open this experience";
        item.push('<p class="lj-home__action">');
        item.push(
          '<a class="lj-home__link" href="' +
            escapeHtml(href) +
            '" data-commission-id="' +
            escapeHtml(commissionId) +
            '" aria-label="' +
            escapeHtml(actionLabel + ": " + sectionTitle) +
            '">' +
            escapeHtml(actionLabel) +
            "</a>"
        );
        item.push("</p>");
      });
      item.push("</div></li>");
      experienceParts.push(item.join(""));
    });

    if (videoHtml) parts.push(videoHtml);
    if (experienceParts.length) {
      parts.push('<ol class="lj-home__experiences">');
      parts.push(experienceParts.join(""));
      parts.push("</ol>");
    }

    parts.push(
      '<p class="lj-home__footer">Each experience works on its own. Return here when you are ready for the next one.</p>'
    );
    parts.push("</main></body></html>");
    return { ok: true, code: "ok", html: parts.join(""), title: title };
  }

  /**
   * Nest a first-class LearnerPackage under commission_id/.
   * Existing packages use learner-page.html + assets/; Journey layout uses index.html + media/.
   */
  function nestConstituentPackageEntries(commissionId, learnerPackage) {
    var id = asText(commissionId);
    var pkg = learnerPackage && typeof learnerPackage === "object" ? learnerPackage : null;
    var files = Object.create(null);
    var entryPaths = [];
    if (!id) {
      return { ok: false, code: "commission_id_required", files: files, entryPaths: entryPaths };
    }
    if (!pkg || typeof pkg.html !== "string" || !String(pkg.html).trim()) {
      return {
        ok: false,
        code: "constituent_package_missing_html",
        files: files,
        entryPaths: entryPaths,
        message: "Constituent learner package is missing HTML for " + id + "."
      };
    }

    var html = String(pkg.html);
    // Relative assets/ → media/ so nested packages keep working under cN/.
    html = html.split("assets/").join("media/");
    html = html.split("./assets/").join("./media/");

    var indexPath = id + "/index.html";
    files[indexPath] = html;
    entryPaths.push(indexPath);

    var assets = Array.isArray(pkg.assets) ? pkg.assets : [];
    var i;
    for (i = 0; i < assets.length; i += 1) {
      var asset = assets[i];
      if (!asset || typeof asset !== "object") {
        return {
          ok: false,
          code: "invalid_constituent_asset",
          files: files,
          entryPaths: entryPaths,
          message: "Invalid asset in constituent package " + id + "."
        };
      }
      var path = asText(asset.path);
      if (!path || path.indexOf("..") !== -1 || path.charAt(0) === "/") {
        return {
          ok: false,
          code: "invalid_constituent_asset_path",
          files: files,
          entryPaths: entryPaths,
          message: "Invalid asset path in constituent package " + id + "."
        };
      }
      var nestedPath = path.indexOf("assets/") === 0 ? id + "/media/" + path.slice("assets/".length) : id + "/" + path;
      var bytes = asset.bytes;
      if (!(bytes instanceof Uint8Array) && !(typeof Buffer !== "undefined" && Buffer.isBuffer(bytes))) {
        return {
          ok: false,
          code: "invalid_constituent_asset_bytes",
          files: files,
          entryPaths: entryPaths,
          message: "Asset bytes missing for " + nestedPath + "."
        };
      }
      files[nestedPath] = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
      entryPaths.push(nestedPath);
    }

    return { ok: true, code: "ok", files: files, entryPaths: entryPaths };
  }

  function buildLearningJourneyZipBasename(pageTitle) {
    var slug = asText(pageTitle)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return (slug || "learning-journey") + "-package.zip";
  }

  /**
   * Assemble final Journey ZIP from home HTML + constituent LearnerPackage models.
   *
   * @param {object} input
   * @param {object} input.page
   * @param {Array<{commissionId:string, learnerPackage:object}>} input.constituents
   * @param {object} [input.fflate]
   * @param {boolean} [input.includeEmptyMediaDir]
   */
  function assembleLearningJourneyLearnerPackage(input) {
    var src = input && typeof input === "object" ? input : {};
    var page = src.page;
    var packagedEditorial = packageHomeEditorialAsset(collectEditorialOpeningAsset(src.visualAssets));
    var home = buildLearningJourneyHomeHtml(page, {
      designMod: src.designMod,
      editorialAsset: packagedEditorial ? packagedEditorial.asset : collectEditorialOpeningAsset(src.visualAssets),
      visualAssets: src.visualAssets,
      videoProjection: src.videoProjection
    });
    if (!home.ok) {
      return { ok: false, error: { code: home.code || "home_failed", message: "Could not build Journey Home." } };
    }

    var fflate = resolveFflate(src.fflate);
    if (!fflate || typeof fflate.zipSync !== "function" || typeof fflate.strToU8 !== "function") {
      return {
        ok: false,
        error: { code: "missing_fflate", message: "fflate is required to serialize the Journey package." }
      };
    }

    var files = Object.create(null);
    var entryPaths = [];
    files["index.html"] = fflate.strToU8(home.html);
    entryPaths.push("index.html");

    if (packagedEditorial && packagedEditorial.path && packagedEditorial.bytes) {
      files[packagedEditorial.path] = packagedEditorial.bytes;
      entryPaths.push(packagedEditorial.path);
    }

    if (src.includeEmptyMediaDir && !packagedEditorial) {
      // Optional empty marker so unzippers show a Journey-owned media folder.
      files["media/.keep"] = fflate.strToU8("");
      entryPaths.push("media/.keep");
    }

    var constituents = Array.isArray(src.constituents) ? src.constituents : [];
    var seen = Object.create(null);
    var c;
    for (c = 0; c < constituents.length; c += 1) {
      var row = constituents[c];
      var commissionId = asText(row && row.commissionId);
      if (!commissionId) {
        return {
          ok: false,
          error: {
            code: "constituent_commission_id_required",
            message: "Each constituent package requires a commissionId."
          }
        };
      }
      if (seen[commissionId]) {
        return {
          ok: false,
          error: {
            code: "duplicate_commission_id",
            message: "Duplicate commission package for " + commissionId + "."
          }
        };
      }
      seen[commissionId] = true;
      var nested = nestConstituentPackageEntries(commissionId, row && row.learnerPackage);
      if (!nested.ok) {
        return {
          ok: false,
          error: {
            code: nested.code || "nest_failed",
            message: nested.message || "Could not nest constituent package " + commissionId + ".",
            commissionId: commissionId
          }
        };
      }
      Object.keys(nested.files).forEach(function (path) {
        var value = nested.files[path];
        files[path] = typeof value === "string" ? fflate.strToU8(value) : value;
      });
      entryPaths = entryPaths.concat(nested.entryPaths);
    }

    // Fail closed: every commission on the page must have a nested package.
    var requiredIds = sortedCommissions(page && page.commissions)
      .map(function (commission) {
        return asText(commission && commission.commission_id);
      })
      .filter(Boolean);
    var missing = requiredIds.filter(function (id) {
      return !seen[id];
    });
    if (missing.length) {
      return {
        ok: false,
        error: {
          code: "missing_constituent_packages",
          message: "Missing nested packages for: " + missing.join(", "),
          missingCommissionIds: missing
        }
      };
    }

    try {
      var bytes = fflate.zipSync(files, { level: 6 });
      return {
        ok: true,
        bytes: bytes,
        entryPaths: entryPaths,
        zipName: buildLearningJourneyZipBasename(home.title),
        homeTitle: home.title
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

  /**
   * Full deterministic build when constituent LearnerPackage models are already available.
   * Callers that need production-status hydration should preflight first, then supply packages.
   */
  function buildLearningJourneyLearnerPackage(input) {
    var src = input && typeof input === "object" ? input : {};
    var preflight = preflightLearningJourneyLearnerPackage(src);
    if (!preflight.ok) {
      return {
        ok: false,
        code: preflight.code,
        blockers: preflight.blockers,
        error: {
          code: preflight.code,
          message: formatPreflightBlockers(preflight.blockers)
        }
      };
    }
    var assembled = assembleLearningJourneyLearnerPackage({
      page: src.page,
      constituents: src.constituents,
      fflate: src.fflate,
      designMod: src.designMod,
      includeEmptyMediaDir: src.includeEmptyMediaDir,
      visualAssets: src.visualAssets,
      videoProjection: src.videoProjection
    });
    if (!assembled.ok) {
      return {
        ok: false,
        code: (assembled.error && assembled.error.code) || "assemble_failed",
        blockers: preflight.blockers,
        error: assembled.error
      };
    }
    return {
      ok: true,
      code: "ok",
      bytes: assembled.bytes,
      entryPaths: assembled.entryPaths,
      zipName: assembled.zipName,
      homeTitle: assembled.homeTitle,
      preflight: preflight
    };
  }

  function formatPreflightBlockers(blockers) {
    var rows = Array.isArray(blockers) ? blockers : [];
    if (!rows.length) return "Learning Journey package is not ready.";
    return rows
      .map(function (row) {
        var id = asText(row && row.commissionId);
        var title = asText(row && row.title);
        var reason = asText(row && row.reason) || "blocked";
        var label = id ? id + (title ? " (" + title + ")" : "") : title || "Journey";
        return label + ": " + reason;
      })
      .join(" ");
  }

  return {
    preflightLearningJourneyLearnerPackage: preflightLearningJourneyLearnerPackage,
    buildLearningJourneyHomeHtml: buildLearningJourneyHomeHtml,
    renderLearningJourneyEditorialBannerHtml: renderLearningJourneyEditorialBannerHtml,
    nestConstituentPackageEntries: nestConstituentPackageEntries,
    assembleLearningJourneyLearnerPackage: assembleLearningJourneyLearnerPackage,
    buildLearningJourneyLearnerPackage: buildLearningJourneyLearnerPackage,
    buildLearningJourneyZipBasename: buildLearningJourneyZipBasename,
    formatPreflightBlockers: formatPreflightBlockers,
    sortedSections: sortedSections,
    sortedCommissions: sortedCommissions
  };
});
