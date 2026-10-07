/**
 * Sprint 91 WP3 — Learning Journey Design Page (shared page contract).
 *
 * GPT synthesises an ordinary artifact_type "page" in the continuous Run chat
 * (Step 5), using Expository-compatible sections[].exposition plus a non-rendering
 * commissions sidecar. PRISM validates LJ semantics, then renders via the shared
 * learner renderer. Steps 1–4 reasoning lives in the same chat only.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.PRISM_LEARNING_JOURNEY_DESIGN_PAGE = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var ARTIFACT_TYPE = "page";
  var SCHEMA_VERSION = "2.0.0";
  var PRODUCT_ID = "learning_journey";
  var PUBLISH_ROUTE = "learning_journey_page";
  var SUPPORTED_PRODUCT_IDS = {
    interactive: true,
    expository: true,
    assessment_pack: true
  };

  function asText(value) {
    return String(value == null ? "" : value).trim();
  }

  function asNumber(value, fallback) {
    var n = Number(value);
    return isFinite(n) ? n : fallback;
  }

  function normalizeStatus(raw, productId) {
    var status = asText(raw).toLowerCase();
    if (status === "unsupported" || status === "supported") return status;
    if (!productId) return "unsupported";
    return "supported";
  }

  function buildLearningJourneyDesignPagePrompt() {
    return [
      "You are producing the Learning Journey Design Page for PRISM.",
      "",
      "CONTEXT",
      "This is Step 5 of a Learning Journey workflow worked in ONE continuous chat.",
      "Earlier in this same conversation you already produced authoritative Learning Journey reasoning:",
      "- Learning Requirements",
      "- Learning Progression",
      "- Learning Elements",
      "- Learning Experience Commissions (including any unsupported commissions)",
      "",
      "Treat that established conversational reasoning as authoritative.",
      "Do not ask the author to paste those earlier outputs again.",
      "Do not invent PRISM-persisted capture identifiers.",
      "",
      "YOUR JOB",
      "Perform constrained synthesis only: organise the already-established Learning Journey into one ordinary shared PRISM page artefact plus machine-readable commission metadata.",
      "This page must be sufficient for later deterministic publishing once constituent products exist — do not leave ordering, learner framing, or commission targets to a later model call.",
      "",
      "Preserve:",
      "- the established educational intent;",
      "- the established progression;",
      "- the learning-element architecture;",
      "- the commissioning decisions, including unsupported commissions;",
      "- essential continuity between experiences (for example: earlier judgements remain available for reconsideration; investigative questions inform later investigation; gathered evidence feeds weighing; weighed evidence feeds a final defence).",
      "",
      "Do NOT:",
      "- redesign the journey;",
      "- invent new product commissions;",
      "- silently convert unsupported commissions into supported products;",
      "- put author-facing Requirements/Progression/Elements dumps into learner exposition;",
      "- emit Interactive Design Page fields.",
      "",
      "FORBIDDEN FIELDS",
      "- page_synthesis",
      "- visual_affordance_schema_version",
      "- activities_visual_review",
      "- visual_affordances",
      "- activities[] populated with Interactive activity rows",
      "- rationale.markdown / journey.markdown / elements.markdown blobs",
      "- artifact_type learning_journey_page",
      "- wrapping the page inside a parent object",
      "",
      "OUTPUT CONTRACT",
      "Return ONLY one pretty-printed JSON object (triple-backtick json fence) that IS a shared PRISM page.",
      "Do not include Markdown commentary, explanations, or any text outside that single fenced JSON object (except the required runner footer line after the fence).",
      "",
      "JSON PURITY (mandatory — invalid JSON is rejected)",
      "- The fenced block must be exactly one JSON object parseable by JSON.parse.",
      "- Do not include citations, source references, content references, annotations, footnotes, provenance markers, or platform-specific reference syntax anywhere in the output (including inside string values).",
      "- Do not emit ChatGPT-style reference tokens such as :chatgpt-content-reference{...} or similar citation markup.",
      "- Do not cite or reference material from the preceding conversation. Earlier messages are reasoning context only — synthesize from them without citation.",
      "- Every string value must be valid JSON: escape internal double quotes as \\\", use \\n for newlines, and never embed raw unescaped \" characters inside strings.",
      "- Do not paste conversation excerpts, URLs used only for citation, or bracketed reference markers into exposition, specification_text, design_intent, continuity, or any other field.",
      "",
      "The JSON object shape:",
      "",
      "{",
      '  \"artifact_type\": \"page\",',
      '  \"schema_version\": \"2.0.0\",',
      '  \"product_id\": \"learning_journey\",',
      '  \"title\": \"...\",',
      '  \"activities\": [],',
      '  \"sections\": [',
      "    {",
      '      \"section_id\": \"journey_intro\",',
      '      \"title\": \"...\",',
      '      \"order\": 1,',
      '      \"exposition\": \"Learner-facing journey introduction (Markdown).\"',
      "    },",
      "    {",
      '      \"section_id\": \"exp_1\",',
      '      \"title\": \"...\",',
      '      \"order\": 2,',
      '      \"exposition\": \"Learner-facing preamble/framing for this experience (Markdown).\"',
      "    }",
      "  ],",
      '  \"commissions\": [',
      "    {",
      '      \"commission_id\": \"c1\",',
      '      \"section_id\": \"exp_1\",',
      '      \"order\": 1,',
      '      \"title\": \"...\",',
      '      \"product_id\": \"interactive\",',
      '      \"status\": \"supported\",',
      '      \"specification_text\": \"Authoritative commission specification for Create intake.\",',
      '      \"journey_context_text\": \"Continuity for this commission (what the learner has already done / must carry forward).\",',
      '      \"dependencies\": \"Optional short dependency note.\"',
      "    }",
      "  ],",
      '  \"learning_journey\": {',
      '    \"design_intent\": \"Short author-facing design intent (not learner prose).\",',
      '    \"continuity\": \"Journey-level continuity / context for commissioning and later assembly.\"',
      "  },",
      '  \"assembly_state\": {',
      '    \"current_stage\": \"design_page\",',
      '    \"enriched_by\": [',
      '      \"learning_requirements\",',
      '      \"learning_progression\",',
      '      \"learning_elements\",',
      '      \"learning_commissions\",',
      '      \"design_page\"',
      "    ],",
      '    \"calls_model\": true',
      "  }",
      "}",
      "",
      "Field guidance:",
      "- title: concise journey title.",
      "- sections[0] SHOULD be journey_intro: the learner-facing journey introduction/preamble.",
      "- Thereafter emit one ordered section per commissioned learner-facing experience.",
      "- sections[].exposition is Markdown. It is the learner-facing preamble/framing that will appear before the eventual product link/launch. Tell the learner what they are about to do and how it contributes to the journey.",
      "- Do not invent a compulsory closing section. Add a closing section only if the established reasoning genuinely supports one.",
      "- commissions[] is NON-RENDERING metadata. Every learner-facing experience commission must appear here.",
      "- commission.section_id must reference the matching experience section (not journey_intro).",
      "- product_id for supported commissions must be a canonical PRISM id: interactive | expository | assessment_pack.",
      "- unsupported commissions: status \"unsupported\", product_id \"\" (empty), still include specification_text.",
      "- specification_text must be sufficient to initialise shared commission intake without parsing rendered prose.",
      "- learning_journey.design_intent: brief author/design rationale only — not a dump of Steps 1–4.",
      "- learning_journey.continuity: journey-level continuity for Create intake / later assembly.",
      "- assembly_state.calls_model must be true.",
      "",
      "No prose before the JSON fence. After the closing fence emit exactly one runner footer line as required by PRISM for this step."
    ].join("\n");
  }

  function buildLearningJourneyDesignPageCopyInstructions() {
    return [
      "Learning Journey Design Page (same-chat constrained synthesis).",
      "Use the Requirements, Progression, Elements and Commissioning reasoning already established earlier in this conversation.",
      "Return an ordinary shared PRISM page (artifact_type page, schema_version 2.0.0, product_id learning_journey) with sections[].exposition plus commissions[].",
      "Output must be valid JSON only: no citations, content-reference tokens, or platform reference syntax inside any string value.",
      "Do not invent page_synthesis, visual_affordances, activities_visual_review, or visual_affordance_schema_version.",
      "Do not redesign the journey or convert unsupported commissions into supported products."
    ].join("\n");
  }

  function isLearningJourneyDesignPage(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    if (asText(value.artifact_type).toLowerCase() !== ARTIFACT_TYPE) return false;
    if (asText(value.product_id).toLowerCase() !== PRODUCT_ID) return false;
    return true;
  }

  function collectSectionIds(sections) {
    var ids = [];
    var i;
    for (i = 0; i < sections.length; i += 1) {
      var sid = asText(sections[i] && sections[i].section_id);
      if (sid) ids.push(sid);
    }
    return ids;
  }

  function validateLearningJourneyDesignPage(parsed) {
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ok: false, errors: ["not_a_learning_journey_design_page"] };
    }
    // Reject obsolete special artefact / wrapper.
    if (asText(parsed.artifact_type).toLowerCase() === "learning_journey_page") {
      return { ok: false, errors: ["obsolete_learning_journey_page_artifact_type"] };
    }
    if (
      parsed.learning_journey_page &&
      typeof parsed.learning_journey_page === "object" &&
      !isLearningJourneyDesignPage(parsed)
    ) {
      return { ok: false, errors: ["wrapper_object_not_accepted"] };
    }
    if (!isLearningJourneyDesignPage(parsed)) {
      return { ok: false, errors: ["not_a_learning_journey_design_page"] };
    }

    var errors = [];
    if (asText(parsed.schema_version) !== SCHEMA_VERSION) {
      errors.push("schema_version must be 2.0.0");
    }
    if (!asText(parsed.title)) errors.push("title required");
    if (!Array.isArray(parsed.activities)) {
      errors.push("activities must be an array");
    } else if (parsed.activities.length) {
      errors.push("activities must be empty for Learning Journey overview page");
    }
    if (Object.prototype.hasOwnProperty.call(parsed, "page_synthesis")) {
      errors.push("interactive_page_synthesis_forbidden");
    }
    if (Object.prototype.hasOwnProperty.call(parsed, "visual_affordance_schema_version")) {
      errors.push("interactive_visual_affordance_schema_forbidden");
    }
    if (Object.prototype.hasOwnProperty.call(parsed, "activities_visual_review")) {
      errors.push("interactive_activities_visual_review_forbidden");
    }
    if (Object.prototype.hasOwnProperty.call(parsed, "visual_affordances")) {
      errors.push("interactive_visual_affordances_forbidden");
    }
    if (parsed.rationale || parsed.journey || parsed.elements) {
      errors.push("obsolete_markdown_blob_fields_forbidden");
    }

    if (!Array.isArray(parsed.sections) || !parsed.sections.length) {
      errors.push("sections required");
    } else {
      var seenSection = {};
      var i;
      for (i = 0; i < parsed.sections.length; i += 1) {
        var section = parsed.sections[i];
        if (!section || typeof section !== "object") {
          errors.push("sections[" + i + "] invalid");
          continue;
        }
        var sid = asText(section.section_id);
        if (!sid) errors.push("sections[" + i + "].section_id required");
        else if (seenSection[sid]) errors.push("duplicate_section_id:" + sid);
        else seenSection[sid] = true;
        if (!asText(section.title)) errors.push("sections[" + i + "].title required");
        if (!asText(section.exposition)) errors.push("sections[" + i + "].exposition required");
      }
    }

    if (!Array.isArray(parsed.commissions) || !parsed.commissions.length) {
      errors.push("commissions required");
    } else {
      var sectionIds = collectSectionIds(Array.isArray(parsed.sections) ? parsed.sections : []);
      var sectionIdSet = {};
      sectionIds.forEach(function (id) {
        sectionIdSet[id] = true;
      });
      var seenCommission = {};
      var orders = [];
      var c;
      for (c = 0; c < parsed.commissions.length; c += 1) {
        var commission = parsed.commissions[c];
        if (!commission || typeof commission !== "object") {
          errors.push("commissions[" + c + "] invalid");
          continue;
        }
        var cid = asText(commission.commission_id);
        if (!cid) errors.push("commissions[" + c + "].commission_id required");
        else if (seenCommission[cid]) errors.push("duplicate_commission_id:" + cid);
        else seenCommission[cid] = true;

        var linked = asText(commission.section_id);
        if (!linked) errors.push("commissions[" + c + "].section_id required");
        else if (!sectionIdSet[linked]) {
          errors.push("commissions[" + c + "].section_id missing_from_sections");
        } else if (linked === "journey_intro") {
          errors.push("commissions[" + c + "].section_id must not be journey_intro");
        }

        var order = asNumber(commission.order, NaN);
        if (!isFinite(order)) errors.push("commissions[" + c + "].order required");
        else orders.push(order);

        var productId = asText(commission.product_id || commission.productId).toLowerCase();
        var status = normalizeStatus(commission.status, productId);
        if (status === "supported") {
          if (!SUPPORTED_PRODUCT_IDS[productId]) {
            errors.push("commissions[" + c + "].product_id invalid_for_supported");
          }
        } else if (status === "unsupported") {
          if (productId && !SUPPORTED_PRODUCT_IDS[productId]) {
            // empty product_id expected; non-empty invalid ids are errors
            errors.push("commissions[" + c + "].product_id invalid");
          }
          if (productId && SUPPORTED_PRODUCT_IDS[productId]) {
            errors.push("commissions[" + c + "].unsupported_must_not_force_product");
          }
        }

        if (!asText(commission.specification_text || commission.specificationText)) {
          errors.push("commissions[" + c + "].specification_text required");
        }
      }
      if (orders.length > 1) {
        var sorted = orders.slice().sort(function (a, b) {
          return a - b;
        });
        var o;
        for (o = 0; o < sorted.length; o += 1) {
          if (sorted[o] !== orders[o] && sorted.join(",") !== orders.slice().sort().join(",")) {
            // Allow non-sorted array if unique positive orders exist; only flag duplicates.
            break;
          }
        }
        var seenOrder = {};
        for (o = 0; o < orders.length; o += 1) {
          if (seenOrder[orders[o]]) errors.push("duplicate_commission_order:" + orders[o]);
          seenOrder[orders[o]] = true;
        }
      }
    }

    if (!parsed.assembly_state || parsed.assembly_state.calls_model !== true) {
      errors.push("assembly_state.calls_model must be true");
    }

    return { ok: !errors.length, errors: errors };
  }

  function commissionToIntakeEnvelope(commission, page, options) {
    var row = commission && typeof commission === "object" ? commission : {};
    var opts = options && typeof options === "object" ? options : {};
    var lj =
      page && page.learning_journey && typeof page.learning_journey === "object"
        ? page.learning_journey
        : {};
    var status = normalizeStatus(row.status, asText(row.product_id || row.productId));
    var productId = asText(row.product_id || row.productId).toLowerCase();
    if (status === "unsupported") productId = "";
    return {
      productId: productId,
      specificationText: asText(row.specification_text || row.specificationText),
      focus: asText(opts.focus || (page && page.title) || ""),
      sourceContext: asText(opts.sourceContext),
      constraints: asText(row.constraints || opts.constraints),
      dependencies: asText(row.dependencies),
      journeyContextText: asText(
        row.journey_context_text ||
          row.journeyContextText ||
          lj.continuity ||
          opts.journeyContextText
      ),
      sourceJourneyWorkflowId: asText(opts.sourceJourneyWorkflowId),
      sourceCommissionId: asText(row.commission_id || opts.sourceCommissionId),
      status: status,
      sectionId: asText(row.section_id),
      title: asText(row.title)
    };
  }

  function resolveCommissionFromPage(page, commissionId) {
    if (!page || !Array.isArray(page.commissions)) return null;
    var target = asText(commissionId);
    if (!target) return null;
    var i;
    for (i = 0; i < page.commissions.length; i += 1) {
      var row = page.commissions[i];
      if (row && asText(row.commission_id) === target) return row;
    }
    return null;
  }

  function buildLearningJourneyDesignPageFixture(input) {
    var src = input && typeof input === "object" ? input : {};
    var sections = Array.isArray(src.sections)
      ? src.sections
      : [
          {
            section_id: "journey_intro",
            title: "About this journey",
            order: 1,
            exposition:
              asText(src.introExposition) ||
              "This Learning Journey helps you judge the credibility of online information."
          },
          {
            section_id: "exp_1",
            title: asText(src.experienceTitle) || "Credibility cues primer",
            order: 2,
            exposition:
              asText(src.experienceExposition) ||
              "You are about to establish what counts as a credibility cue before comparing contested sources."
          },
          {
            section_id: "exp_2",
            title: "Workplace credibility walkthrough",
            order: 3,
            exposition:
              "You will then observe credibility practices in a workplace setting. This experience is required by the journey even though PRISM cannot yet manufacture it."
          }
        ];
    var commissions = Array.isArray(src.commissions)
      ? src.commissions
      : [
          {
            commission_id: "c1",
            section_id: "exp_1",
            order: 1,
            title: "Credibility cues primer",
            product_id: "expository",
            status: "supported",
            specification_text:
              asText(src.specificationText) ||
              "Commission an Expository Resource that establishes credibility cues for university learners.",
            journey_context_text:
              "This is the opening experience. Later comparison depends on the cue vocabulary established here.",
            dependencies: ""
          },
          {
            commission_id: "c2",
            section_id: "exp_2",
            order: 2,
            title: "Workplace credibility walkthrough",
            product_id: "",
            status: "unsupported",
            specification_text:
              "Direct learners to observe credibility practices in their workplace. Requires situated workplace observation framing beyond current Expository, Interactive, or Assessment Pack purposes.",
            journey_context_text:
              "Builds on cue vocabulary from the primer. Observations should remain available for later evidence-weighing.",
            dependencies: "exp_1 / c1"
          }
        ];
    var page = {
      artifact_type: ARTIFACT_TYPE,
      schema_version: SCHEMA_VERSION,
      product_id: PRODUCT_ID,
      title: asText(src.title) || "Learning Journey: Online credibility judgements",
      activities: [],
      sections: sections,
      commissions: commissions,
      learning_journey: {
        design_intent:
          asText(src.designIntent) ||
          "Develop reliable online credibility judgements within a short self-directed journey.",
        continuity:
          asText(src.continuity) ||
          "Initial cue judgements must remain available for reconsideration; investigative questions inform later investigation; gathered evidence feeds weighing and defence."
      },
      assembly_state: {
        current_stage: "design_page",
        enriched_by: [
          "learning_requirements",
          "learning_progression",
          "learning_elements",
          "learning_commissions",
          "design_page"
        ],
        calls_model: true
      }
    };
    var check = validateLearningJourneyDesignPage(page);
    if (!check.ok) {
      return { ok: false, code: "invalid_fixture", errors: check.errors, callsModel: true };
    }
    return { ok: true, page: page, callsModel: true };
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderExpositionMarkdown(text) {
    var raw = asText(text);
    if (!raw) return "";
    var paragraphs = raw.split(/\n\s*\n/);
    return paragraphs
      .map(function (paragraph) {
        var escaped = escapeHtml(paragraph).replace(/\r?\n/g, "<br>");
        escaped = escaped.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
        escaped = escaped.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
        return "<p>" + escaped + "</p>";
      })
      .join("");
  }

  function resolveFamilyApi() {
    if (typeof require === "function") {
      try {
        return require("./first-class-workflow-family.js");
      } catch (_err) {
        try {
          return require("../lib/first-class-workflow-family.js");
        } catch (_err2) {}
      }
    }
    var roots = [
      typeof globalThis !== "undefined" ? globalThis : null,
      typeof window !== "undefined" ? window : null
    ];
    var i;
    for (i = 0; i < roots.length; i += 1) {
      if (roots[i] && roots[i].PRISM_FIRST_CLASS_WORKFLOW_FAMILY) {
        return roots[i].PRISM_FIRST_CLASS_WORKFLOW_FAMILY;
      }
    }
    return null;
  }

  function productLabelForId(productId) {
    var id = asText(productId).toLowerCase();
    var family = resolveFamilyApi();
    if (family && typeof family.listFirstClassProducts === "function") {
      var products = family.listFirstClassProducts() || [];
      var i;
      for (i = 0; i < products.length; i += 1) {
        if (products[i] && asText(products[i].id).toLowerCase() === id) {
          return asText(products[i].label) || id;
        }
      }
    }
    if (id === "interactive") return "Interactive";
    if (id === "expository") return "Expository";
    if (id === "assessment_pack") return "Assessment Pack";
    return id;
  }

  function productAcceptsCommission(productId) {
    var family = resolveFamilyApi();
    if (family && typeof family.productAcceptsCommission === "function") {
      return !!family.productAcceptsCommission(productId);
    }
    return asText(productId).toLowerCase() === "interactive";
  }

  function createActionLabelForProduct(productId) {
    var label = productLabelForId(productId);
    if (!label) return "Create";
    return "Create " + label;
  }

  function indexCommissionsBySectionId(commissions) {
    var map = {};
    var rows = Array.isArray(commissions) ? commissions : [];
    var i;
    for (i = 0; i < rows.length; i += 1) {
      var row = rows[i];
      if (!row || typeof row !== "object") continue;
      var sid = asText(row.section_id);
      if (!sid) continue;
      if (!map[sid]) map[sid] = [];
      map[sid].push(row);
    }
    return map;
  }

  function sortedSections(sections) {
    var rows = Array.isArray(sections) ? sections.slice() : [];
    rows.sort(function (a, b) {
      var ao = asNumber(a && a.order, Number.POSITIVE_INFINITY);
      var bo = asNumber(b && b.order, Number.POSITIVE_INFINITY);
      if (ao !== bo) return ao - bo;
      return 0;
    });
    return rows;
  }

  /**
   * Authoring/Preview commissioning representation for Learning Journey pages.
   * sections[] = concise journey prose; commissions[] = production metadata.
   * Does not dump specification_text / journey_context_text / dependencies.
   */
  function buildLearningJourneyCommissioningPreviewHtml(page, options) {
    var opts = options && typeof options === "object" ? options : {};
    if (!isLearningJourneyDesignPage(page)) {
      return { ok: false, error: "not_a_learning_journey_design_page", html: "" };
    }
    var sourceWorkflowId = asText(opts.sourceWorkflowId || opts.workflowId);
    var commissionsBySection = indexCommissionsBySectionId(page.commissions);
    var sections = sortedSections(page.sections);
    var parts = [];
    parts.push('<main class="lj-commissioning-preview" data-product-id="learning_journey">');
    parts.push('<header class="lj-commissioning-preview__header">');
    parts.push("<h1>" + escapeHtml(asText(page.title) || "Learning Journey") + "</h1>");
    parts.push(
      '<p class="lj-commissioning-preview__role">Authoring view — commission constituent products. This is not the final learner package.</p>'
    );
    parts.push("</header>");

    var i;
    for (i = 0; i < sections.length; i += 1) {
      var section = sections[i];
      if (!section || typeof section !== "object") continue;
      var sectionId = asText(section.section_id);
      var title = asText(section.title) || sectionId || "Section";
      var expositionHtml = renderExpositionMarkdown(section.exposition);
      var isIntro = sectionId === "journey_intro";
      var matched = commissionsBySection[sectionId] || [];

      if (isIntro) {
        parts.push(
          '<section class="lj-commissioning-preview__intro" data-section-id="' +
            escapeHtml(sectionId) +
            '">'
        );
        parts.push("<h2>" + escapeHtml(title) + "</h2>");
        if (expositionHtml) {
          parts.push('<div class="lj-commissioning-preview__exposition">' + expositionHtml + "</div>");
        }
        parts.push("</section>");
        continue;
      }

      parts.push(
        '<section class="lj-commissioning-preview__experience" data-section-id="' +
          escapeHtml(sectionId) +
          '">'
      );
      parts.push("<h2>" + escapeHtml(title) + "</h2>");
      if (expositionHtml) {
        parts.push('<div class="lj-commissioning-preview__exposition">' + expositionHtml + "</div>");
      }

      if (!matched.length) {
        parts.push(
          '<p class="lj-commissioning-preview__status">No structured commission is linked to this experience yet.</p>'
        );
      } else {
        var c;
        for (c = 0; c < matched.length; c += 1) {
          var commission = matched[c];
          var commissionId = asText(commission.commission_id);
          var productId = asText(commission.product_id || commission.productId).toLowerCase();
          var status = normalizeStatus(commission.status, productId);
          var productLabel = productId ? productLabelForId(productId) : "";
          parts.push(
            '<div class="lj-commissioning-preview__commission" data-commission-id="' +
              escapeHtml(commissionId) +
              '" data-section-id="' +
              escapeHtml(sectionId) +
              '" data-status="' +
              escapeHtml(status) +
              '"' +
              (productId ? ' data-product-id="' + escapeHtml(productId) + '"' : "") +
              ">"
          );

          if (status === "unsupported") {
            parts.push(
              '<p class="lj-commissioning-preview__product lj-commissioning-preview__product--unsupported">' +
                "<strong>Unsupported in PRISM</strong> — no supported first-class product yet for this experience." +
                "</p>"
            );
          } else {
            parts.push(
              '<p class="lj-commissioning-preview__product">' +
                "<strong>" +
                escapeHtml(productLabel || productId || "Product") +
                "</strong>" +
                "</p>"
            );
            if (productId && SUPPORTED_PRODUCT_IDS[productId] && productAcceptsCommission(productId)) {
              var production =
                opts.productionByCommissionId &&
                opts.productionByCommissionId[commissionId] &&
                typeof opts.productionByCommissionId[commissionId] === "object"
                  ? opts.productionByCommissionId[commissionId]
                  : null;
              var productionStatus = production ? asText(production.status).toLowerCase() : "";
              var action = production ? asText(production.action).toLowerCase() : "create";
              var openWorkflowId = production ? asText(production.openWorkflowId || production.constituentWorkflowId) : "";

              if (productionStatus === "ambiguous") {
                parts.push(
                  '<p class="lj-commissioning-preview__production" data-lj-production-status="ambiguous">' +
                    "<strong>Current status: Ambiguous</strong> — multiple constituent workflows claim this commission." +
                    "</p>"
                );
                var ambiguousIds = Array.isArray(production.constituentWorkflowIds)
                  ? production.constituentWorkflowIds
                  : openWorkflowId
                    ? [openWorkflowId]
                    : [];
                ambiguousIds.forEach(function (wfId, wfIndex) {
                  if (!asText(wfId)) return;
                  parts.push(
                    '<p class="lj-commissioning-preview__action">' +
                      '<button type="button" class="lj-commission-open btn btn-primary"' +
                      ' data-lj-action="open-product"' +
                      ' data-lj-commission-id="' +
                      escapeHtml(commissionId) +
                      '"' +
                      ' data-lj-section-id="' +
                      escapeHtml(sectionId) +
                      '"' +
                      ' data-lj-product-id="' +
                      escapeHtml(productId) +
                      '"' +
                      ' data-lj-workflow-id="' +
                      escapeHtml(asText(wfId)) +
                      '"' +
                      (sourceWorkflowId
                        ? ' data-lj-source-workflow-id="' + escapeHtml(sourceWorkflowId) + '"'
                        : "") +
                      ">" +
                      escapeHtml(
                        "Open " +
                          (productLabel || productId) +
                          (ambiguousIds.length > 1 ? " #" + String(wfIndex + 1) : "")
                      ) +
                      "</button>" +
                      "</p>"
                  );
                });
              } else if (action === "open" && openWorkflowId) {
                if (production && production.statusLabel) {
                  parts.push(
                    '<p class="lj-commissioning-preview__production" data-lj-production-status="' +
                      escapeHtml(productionStatus) +
                      '">' +
                      "<strong>Current status: " +
                      escapeHtml(production.statusLabel) +
                      "</strong>" +
                      "</p>"
                  );
                }
                parts.push(
                  '<p class="lj-commissioning-preview__action">' +
                    '<button type="button" class="lj-commission-open btn btn-primary"' +
                    ' data-lj-action="open-product"' +
                    ' data-lj-commission-id="' +
                    escapeHtml(commissionId) +
                    '"' +
                    ' data-lj-section-id="' +
                    escapeHtml(sectionId) +
                    '"' +
                    ' data-lj-product-id="' +
                    escapeHtml(productId) +
                    '"' +
                    ' data-lj-workflow-id="' +
                    escapeHtml(openWorkflowId) +
                    '"' +
                    (sourceWorkflowId
                      ? ' data-lj-source-workflow-id="' + escapeHtml(sourceWorkflowId) + '"'
                      : "") +
                    ">" +
                    escapeHtml("Open " + (productLabel || productId)) +
                    "</button>" +
                    "</p>"
                );
              } else if (action === "create" || !production) {
                parts.push(
                  '<p class="lj-commissioning-preview__action">' +
                    '<button type="button" class="lj-commission-create btn btn-primary"' +
                    ' data-lj-action="create-product"' +
                    ' data-lj-commission-id="' +
                    escapeHtml(commissionId) +
                    '"' +
                    ' data-lj-section-id="' +
                    escapeHtml(sectionId) +
                    '"' +
                    ' data-lj-product-id="' +
                    escapeHtml(productId) +
                    '"' +
                    (sourceWorkflowId
                      ? ' data-lj-source-workflow-id="' + escapeHtml(sourceWorkflowId) + '"'
                      : "") +
                    ">" +
                    escapeHtml(createActionLabelForProduct(productId)) +
                    "</button>" +
                    "</p>"
                );
              } else {
                parts.push(
                  '<p class="lj-commissioning-preview__status">Supported product, but no Create/Open action is available.</p>'
                );
              }
            } else if (productId && SUPPORTED_PRODUCT_IDS[productId]) {
              parts.push(
                '<p class="lj-commissioning-preview__status">Supported product, but commission intake is not declared for ' +
                  escapeHtml(productLabel || productId) +
                  ".</p>"
              );
            }
          }
          parts.push("</div>");
        }
      }
      parts.push("</section>");
    }

    parts.push("</main>");
    return {
      ok: true,
      error: null,
      html: parts.join(""),
      cssText: [
        ".lj-commissioning-preview{max-width:44rem;margin:0 auto;padding:1.5rem 1rem 3rem;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.55;color:#1f2933;}",
        ".lj-commissioning-preview__header h1{margin:0 0 .5rem;font-size:1.75rem;line-height:1.25;}",
        ".lj-commissioning-preview__role{margin:0 0 1.5rem;color:#52606d;font-size:.95rem;}",
        ".lj-commissioning-preview__intro,.lj-commissioning-preview__experience{margin:0 0 1.75rem;padding-bottom:1.25rem;border-bottom:1px solid #d9e2ec;}",
        ".lj-commissioning-preview__experience:last-child{border-bottom:0;}",
        ".lj-commissioning-preview h2{margin:0 0 .65rem;font-size:1.2rem;}",
        ".lj-commissioning-preview__exposition p{margin:0 0 .75rem;}",
        ".lj-commissioning-preview__product{margin:.85rem 0 .4rem;}",
        ".lj-commissioning-preview__product--unsupported{color:#7b341e;}",
        ".lj-commissioning-preview__production{margin:.55rem 0 .35rem;color:#334e68;}",
        ".lj-commissioning-preview__status{margin:.5rem 0 0;color:#52606d;font-size:.95rem;}",
        ".lj-commissioning-preview__action{margin:.65rem 0 0;}",
        ".lj-commission-create,.lj-commission-open{appearance:none;border:0;border-radius:.35rem;background:#243b53;color:#fff;padding:.55rem .9rem;font:inherit;cursor:pointer;}",
        ".lj-commission-create:hover,.lj-commission-create:focus,.lj-commission-open:hover,.lj-commission-open:focus{background:#102a43;}"
      ].join("")
    };
  }

  return {
    ARTIFACT_TYPE: ARTIFACT_TYPE,
    SCHEMA_VERSION: SCHEMA_VERSION,
    PRODUCT_ID: PRODUCT_ID,
    PUBLISH_ROUTE: PUBLISH_ROUTE,
    SUPPORTED_PRODUCT_IDS: Object.keys(SUPPORTED_PRODUCT_IDS),
    buildLearningJourneyDesignPagePrompt: buildLearningJourneyDesignPagePrompt,
    buildLearningJourneyDesignPageCopyInstructions: buildLearningJourneyDesignPageCopyInstructions,
    buildLearningJourneyDesignPageFixture: buildLearningJourneyDesignPageFixture,
    isLearningJourneyDesignPage: isLearningJourneyDesignPage,
    validateLearningJourneyDesignPage: validateLearningJourneyDesignPage,
    commissionToIntakeEnvelope: commissionToIntakeEnvelope,
    resolveCommissionFromPage: resolveCommissionFromPage,
    buildLearningJourneyCommissioningPreviewHtml: buildLearningJourneyCommissioningPreviewHtml,
    productAcceptsCommission: productAcceptsCommission,
    createActionLabelForProduct: createActionLabelForProduct
  };
});
