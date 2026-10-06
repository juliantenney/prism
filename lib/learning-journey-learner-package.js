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
      ":root{--lj-ink:#1c1917;--lj-muted:#57534e;--lj-line:#d6d3d1;--lj-paper:#fafaf9;--lj-accent:#0f766e;}",
      "body{margin:0;font-family:Georgia,'Times New Roman',serif;color:var(--lj-ink);background:linear-gradient(180deg,#f5f5f4 0%,#fff 42%);}",
      ".lj-home{max-width:46rem;margin:0 auto;padding:2.5rem 1.25rem 4rem;}",
      ".lj-home__header{margin-bottom:2rem;padding-bottom:1.25rem;border-bottom:1px solid var(--lj-line);}",
      ".lj-home__header h1{margin:0 0 .5rem;font-size:2rem;line-height:1.2;}",
      ".lj-home__lede{margin:0;color:var(--lj-muted);font-size:1.05rem;}",
      ".lj-home__intro,.lj-home__experience{margin:0 0 1.75rem;padding:1.25rem 1.2rem;background:var(--lj-paper);border:1px solid var(--lj-line);border-radius:10px;}",
      ".lj-home__intro h2,.lj-home__experience h2{margin:0 0 .75rem;font-size:1.35rem;}",
      ".lj-home__exposition p{margin:0 0 .75rem;line-height:1.55;}",
      ".lj-home__exposition p:last-child{margin-bottom:0;}",
      ".lj-home__action{margin-top:1rem;}",
      ".lj-home__link{display:inline-block;padding:.65rem 1rem;border-radius:8px;background:var(--lj-accent);color:#fff;text-decoration:none;font-family:system-ui,-apple-system,sans-serif;font-size:.95rem;}",
      ".lj-home__link:hover{filter:brightness(1.05);}",
      ".lj-home__footer{margin-top:2rem;color:var(--lj-muted);font-size:.9rem;}"
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
    parts.push(
      '<p class="lj-home__lede">Work through each experience in order. Open an experience when you are ready to begin.</p>'
    );
    parts.push("</header>");

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
        parts.push("<h2>" + escapeHtml(sectionTitle) + "</h2>");
        if (expositionHtml) {
          parts.push('<div class="lj-home__exposition">' + expositionHtml + "</div>");
        }
        parts.push("</section>");
        return;
      }

      parts.push(
        '<section class="lj-home__experience" data-section-id="' + escapeHtml(sectionId) + '">'
      );
      parts.push("<h2>" + escapeHtml(sectionTitle) + "</h2>");
      if (expositionHtml) {
        parts.push('<div class="lj-home__exposition">' + expositionHtml + "</div>");
      }

      matched.forEach(function (commission) {
        var commissionId = asText(commission.commission_id);
        if (!commissionId) return;
        var linkLabel =
          asText(commission.title) || sectionTitle || "Open experience";
        var href = commissionId + "/index.html";
        parts.push('<p class="lj-home__action">');
        parts.push(
          '<a class="lj-home__link" href="' +
            escapeHtml(href) +
            '" data-commission-id="' +
            escapeHtml(commissionId) +
            '">' +
            escapeHtml(linkLabel) +
            "</a>"
        );
        parts.push("</p>");
      });

      parts.push("</section>");
    });

    parts.push(
      '<p class="lj-home__footer">Return to this page between experiences to continue the journey.</p>'
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
    var home = buildLearningJourneyHomeHtml(page, { designMod: src.designMod });
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

    if (src.includeEmptyMediaDir) {
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
      includeEmptyMediaDir: src.includeEmptyMediaDir
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
    nestConstituentPackageEntries: nestConstituentPackageEntries,
    assembleLearningJourneyLearnerPackage: assembleLearningJourneyLearnerPackage,
    buildLearningJourneyLearnerPackage: buildLearningJourneyLearnerPackage,
    buildLearningJourneyZipBasename: buildLearningJourneyZipBasename,
    formatPreflightBlockers: formatPreflightBlockers,
    sortedSections: sortedSections,
    sortedCommissions: sortedCommissions
  };
});
