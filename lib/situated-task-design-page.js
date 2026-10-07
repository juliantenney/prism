/**
 * Sprint 92 Gate 8 Slice 1 — Situated Task Design Page (shared page contract).
 *
 * Stage 5 synthesises an ordinary artifact_type "page" in one continuous chat.
 * Product semantics live in situated_learning; learner prose in sections[].exposition.
 * No page-level product_id (workflow identity owns product routing — S92-D08).
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.PRISM_SITUATED_TASK_DESIGN_PAGE = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var ARTIFACT_TYPE = "page";
  var SCHEMA_VERSION = "2.0.0";
  var PRODUCT_ID = "situated_task";
  var PRODUCT_LABEL = "Situated Task";
  var PUBLISH_ROUTE = "situated_task_page";

  var OPTIONAL_SUPPORT_KEYS = [
    "boundaries",
    "attention",
    "adaptation",
    "social_configuration",
    "stopping",
    "record_distinctions",
    "record_depth"
  ];

  function asText(value) {
    return String(value == null ? "" : value).trim();
  }

  function isPlainObject(value) {
    return !!(value && typeof value === "object" && !Array.isArray(value));
  }

  function resolveSprint38VisualAffordancesLib() {
    var roots = [];
    if (typeof globalThis !== "undefined") roots.push(globalThis);
    if (typeof window !== "undefined") roots.push(window);
    var i;
    for (i = 0; i < roots.length; i += 1) {
      if (roots[i] && roots[i].PRISM_SPRINT38_VISUAL_AFFORDANCES) {
        return roots[i].PRISM_SPRINT38_VISUAL_AFFORDANCES;
      }
    }
    if (typeof require === "function") {
      try {
        return require("./sprint38-visual-affordances.js");
      } catch (_err) {}
    }
    return null;
  }

  function resolveVisualPlanningContractLib() {
    var roots = [];
    if (typeof globalThis !== "undefined") roots.push(globalThis);
    if (typeof window !== "undefined") roots.push(window);
    var i;
    for (i = 0; i < roots.length; i += 1) {
      if (roots[i] && roots[i].PRISM_VISUAL_PLANNING_CONTRACT) {
        return roots[i].PRISM_VISUAL_PLANNING_CONTRACT;
      }
    }
    if (typeof require === "function") {
      try {
        return require("./visual-planning-contract.js");
      } catch (_err) {}
    }
    return null;
  }

  function pageHasVisualPlanning(parsed) {
    if (!isPlainObject(parsed)) return false;
    return (
      Object.prototype.hasOwnProperty.call(parsed, "visual_affordances") ||
      Object.prototype.hasOwnProperty.call(parsed, "activities_visual_review") ||
      Object.prototype.hasOwnProperty.call(parsed, "visual_affordance_schema_version")
    );
  }

  function buildSituatedTaskDesignPagePrompt() {
    return [
      "You are producing the Situated Task Design Page for PRISM.",
      "",
      "CONTEXT",
      "This is Stage 5 of a Situated Task workflow worked in ONE continuous chat.",
      "Earlier in this same conversation you already produced authoritative Situated Task reasoning:",
      "- Situation",
      "- Activity",
      "- Support",
      "- Learning Return",
      "",
      "Treat that established conversational reasoning as authoritative.",
      "Do not ask the author to paste those earlier outputs again.",
      "Do not invent PRISM-persisted capture identifiers.",
      "",
      "YOUR JOB",
      "Perform constrained synthesis only: express the already-resolved Situated Task design as one ordinary shared PRISM page artefact.",
      "Do not redesign the activity. Do not invent missing educational decisions.",
      "Synthesise the concrete task into the canonical artefact so the learner can enact THIS experience without PRISM's authoring conversation.",
      "",
      "ENACTABILITY (mandatory — standalone vs commissioned handoff)",
      "A first-class Situated Task created standalone must establish everything required for the learner to undertake it.",
      "A Situated Task commissioned inside a Learning Journey may intentionally depend on learner work produced by an earlier experience when that dependency is explicit in the commission context (COMMISSION SPECIFICATION, LEARNING JOURNEY CONTEXT, and/or EDUCATIONAL DEPENDENCIES in the brief / earlier Stage 1–4 reasoning).",
      "",
      "When NO explicit educational dependency on a prior constituent is present:",
      "- establish all required task inputs in this page (question, plan, evidence bounds, etc. as the design requires);",
      "- activity.undertaking must be concrete and self-contained for a standalone learner;",
      "- do not assume the learner has seen a parent Learning Journey.",
      "",
      "When an EXPLICIT educational dependency on prior learner work IS present:",
      "- honour it;",
      "- identify clearly what prior learner artefact/input must be brought forward;",
      "- explain how it is used in THIS experience;",
      "- do NOT recreate, replace, or independently determine work the Learning Journey assigns to the earlier experience;",
      "- do NOT assume PRISM has runtime access to the learner's actual prior response — there is no automatic learner-state transfer, dependency graph, or cross-product response transport;",
      "- make the handoff intelligible on the learner-facing page (e.g. have the investigation question and plan from the previous experience available before beginning);",
      "- still state concretely what the learner now DOES in this experience (permissions/access, carrying out the investigation, adaptation, recording, preserving the record for subsequent learning).",
      "",
      "A handoff is NOT permission for vague prose whose meaning exists only in Stage 1–4 authoring chat. Reject as insufficient as the whole undertaking:",
      "- \"undertake the previously designed investigation\";",
      "- \"use the question established earlier\";",
      "- \"work in the setting for which this was designed\";",
      "- any equivalent that points only at hidden authoring conversation instead of stating the present-task actions and any required prior artefact.",
      "Do not dump Situation/Activity/Support/Learning Return documents verbatim.",
      "Do not expose commissioning metadata (sourceWorkflowId / sourceCommissionId / commission ids) on the page.",
      "",
      "LEARNER-PAGE HIERARCHY (sections[] — no mandatory heading names)",
      "The published page must read primarily as the concrete TASK, not as a verbose how-to guide about investigation in general.",
      "Compose coherent learner-facing sections so the learner can understand:",
      "- why they are doing it;",
      "- what exactly they must do now (dominate the page — undertaking must be prominent and operational);",
      "- any required prior artefact to bring forward (when an explicit educational handoff exists);",
      "- the context/circumstances;",
      "- what to attend to / how to adapt (SUPPORT — subordinate to the task);",
      "- what to record and where/how (RECORD — use record.entries for embedded capture when warranted);",
      "- how that learning will subsequently be used (RECONNECT).",
      "Support material must remain subordinate. Avoid repeating the same generic investigative principles across sections.",
      "Do NOT require literal headings named Purpose, Activity, Record, or Reconnection.",
      "",
      "PRODUCT BOUNDARY",
      "If the established reasoning shows the educational centre of gravity is Expository, Interactive, or Assessment Pack, do not manufacture a Situated Task page that pretends otherwise.",
      "",
      "FORBIDDEN FIELDS",
      "- product_id (workflow identity owns product routing)",
      "- page_synthesis",
      "- commissions",
      "- sourceWorkflowId / sourceCommissionId / commission provenance",
      "- activities[] populated with Interactive activity rows",
      "- persistence / storage / localStorage / form / upload / LMS fields",
      "- learner response values / answers / completed record content",
      "- special artefact types other than page",
      "- wrapping the page inside a parent object",
      "",
      "OPTIONAL VISUAL PLANNING (shared Authoring graphics — omit when not educationally warranted)",
      "Graphics are OPTIONAL. Do not commission a figure merely to make the page look richer.",
      "Commission a visual only when it materially helps the learner undertake the situated activity,",
      "notice something important, orient within a process/context, structure evidence, discriminate",
      "relevant features, compare information, understand a mechanism, or perform another educational",
      "function already represented by the shared visual purpose vocabulary.",
      "",
      "When no figure is warranted: omit visual_affordance_schema_version, activities_visual_review, and visual_affordances",
      "(or emit visual_affordances: [] with visual_affordance_schema_version \"38.4\" and activities_visual_review: []).",
      "",
      "When a figure IS warranted, include authoritative Sprint 38 / visual-planning fields on this same page:",
      '- visual_affordance_schema_version: \"38.4\"',
      "- activities_visual_review: [] (Situated Task does not use Interactive activity-scoped review rows)",
      "- visual_affordances: [ ... generate / defer / skip rows ... ]",
      "",
      "Prefer section-scoped visuals bound to learner-facing sections[]:",
      '- scope: \"section\"',
      "- section_id matching a sections[].section_id on this page",
      '- visual_slot: \"section-after-content\"',
      "- evidence_anchors as section_id.path strings that resolve on this page (prefer \"{section_id}.exposition\")",
      "- Do NOT invent Interactive activities[] or activity_id-scoped slots merely to obtain a visual.",
      "",
      "For every generate row include the shared required fields (purpose, preferred_representation, subject,",
      "context, evidence_anchors, rationale, reasoning_supported, learner_stage, anti_spoiler, spoiler_boundary when",
      "anti_spoiler is true, representation_avoid, must_show, must_not_show, allowed_claims, disallowed_claims,",
      "source_basis, caption_intent, visual_slot, tier, discipline_risk_level, requires_exact_data_match, etc.).",
      "",
      "Shared purpose vocabulary includes existing Interactive/Expository purposes PLUS action_support:",
      "- Use action_support when the educational function is support for learner-owned enactment, orientation,",
      "  or noticing during a learner-owned action/process WITHOUT performing the substantive learning work for them.",
      "- Continue to use distinction, comparison, classification, mechanism, evidence_structure, data_pattern_reading,",
      "  or synthesis when those purposes honestly describe the figure. Do not force every Situated figure into action_support.",
      "- Do not redefine mechanism (causal parts→outcome) as procedure/setup support — that is action_support.",
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
      "- Do not paste conversation excerpts, URLs used only for citation, or bracketed reference markers into exposition or situated_learning fields.",
      "- No prose outside the fenced JSON object (except the required runner footer line after the fence).",
      "",
      "MANDATORY top-level fields (every Situated Task Design Page MUST include these — omission is rejected):",
      '- artifact_type: exactly \"page\"',
      '- schema_version: exactly \"2.0.0\"',
      "- title: non-empty learner-facing title",
      "- activities: exactly [] (empty array)",
      "- sections: ordered non-empty array of learner-facing exposition sections",
      "- situated_learning: required object with the nested semantic fields below",
      "- assembly_state: current_stage design_page, enriched_by including prior stages + design_page, calls_model true",
      "",
      "MANDATORY situated_learning nested fields (every key below is required; conditional support fields are optional):",
      "- purpose.learning_intent",
      "- purpose.activity_rationale",
      "- activity.undertaking",
      "- activity.context",
      "- activity.learner_agency",
      "- record.retain",
      "- reconnection.destination",
      "- reconnection.use",
      "",
      "Exact JSON envelope (emit this shape — not Interactive page_synthesis):",
      "",
      "{",
      '  \"artifact_type\": \"page\",',
      '  \"schema_version\": \"2.0.0\",',
      '  \"title\": \"...\",',
      '  \"activities\": [],',
      '  \"sections\": [',
      "    {",
      '      \"section_id\": \"orient\",',
      '      \"title\": \"...\",',
      '      \"order\": 1,',
      '      \"exposition\": \"Learner-facing Markdown for this part of the experience.\"',
      "    }",
      "  ],",
      '  \"situated_learning\": {',
      '    \"purpose\": {',
      '      \"learning_intent\": \"What the learner is intended to learn.\",',
      '      \"activity_rationale\": \"Why learner-owned situated activity is the principal learning vehicle.\"',
      "    },",
      '    \"activity\": {',
      '      \"undertaking\": \"Concrete, independently enactable statement of what the learner actually does.\",',
      '      \"context\": \"Authentic or situated context for the action.\",',
      '      \"learner_agency\": \"What substantive work and agency remain with the learner.\"',
      "    },",
      '    \"record\": {',
      '      \"retain\": \"What consequential trace must survive for educational use.\",',
      '      \"entries\": [',
      "        {",
      '          \"entry_id\": \"expectation\",',
      '          \"order\": 1,',
      '          \"label\": \"What you expected\",',
      '          \"prompt\": \"Optional concise learner-facing prompt for this entry.\",',
      '          \"placement\": { \"after_section_id\": \"task\" }',
      "        }",
      "      ]",
      "    },",
      '    \"reconnection\": {',
      '      \"destination\": \"Where that learning/record goes next.\",',
      '      \"use\": \"How subsequent learning will use what survives.\"',
      "    }",
      "  },",
      '  \"assembly_state\": {',
      '    \"current_stage\": \"design_page\",',
      '    \"enriched_by\": [',
      '      \"situation\",',
      '      \"activity\",',
      '      \"support\",',
      '      \"learning_return\",',
      '      \"design_page\"',
      "    ],",
      '    \"calls_model\": true',
      "  }",
      "}",
      "",
      "RECORD-ENTRY SPECIFICATION (situated_learning.record.entries — educational, not persistence)",
      "record.retain remains the educational truth about what must survive.",
      "record.entries is the optional ordered specification of learner-facing capture prompts when embedded recording is educationally warranted.",
      "Each entry: stable entry_id, order (number), concise learner-facing label, optional prompt, optional placement.",
      "Author entries from Learning Return distinctions (e.g. expectation vs observation, interpretation, contradictions, decisions, limitations) when those distinctions must be externalised.",
      "",
      "RECORD PLACEMENT (optional presentation — Stage 5 educational decision)",
      "Decide whether recording is best presented as:",
      "A. EMBEDDED — entries appear alongside the relevant parts of the learner task;",
      "B. CONSOLIDATED — entries are completed retrospectively after the activity;",
      "C. HYBRID — some entries embedded, others consolidated.",
      "Where an entry is most useful while the learner undertakes a particular learner-facing section, include:",
      '  \"placement\": { \"after_section_id\": \"<sections[].section_id>\" }',
      "placement.after_section_id must reference an existing sections[].section_id on this page.",
      "Where an entry is retrospective, integrative, or does not naturally belong to one section, OMIT placement (consolidated record region).",
      "Do NOT require every entry to have placement.",
      "Do NOT mechanically mirror every section with a record entry.",
      "Do NOT invent placement after the structured artefact — decide it here from Situation→Activity→Support→Learning Return.",
      "",
      "Do NOT put learner answers/values in entries.",
      "Do NOT mention localStorage, forms, uploads, LMS, or other persistence mechanisms.",
      "Do NOT invent Interactive activities[] or response widgets as the principal learning experience — entries only support the situated activity.",
      "When embedded capture is NOT warranted (external notebook/tool/verbal record is intentional): omit record.entries or emit entries: [].",
      "Do not force meaningless text boxes onto every Situated Task.",
      "",
      "Optional situated_learning fields (include ONLY when educationally relevant; omit otherwise — never empty placeholders):",
      "- boundaries",
      "- attention",
      "- adaptation",
      "- social_configuration",
      "- stopping",
      "- record_distinctions",
      "- record_depth",
      "",
      "Optional visual-affordance fields: only when educationally warranted (see OPTIONAL VISUAL PLANNING above). Do not invent page_synthesis.",
      "",
      "Field guidance:",
      "- title: concise learner-facing title for the Situated Task.",
      "- activities must be an empty array. The educational activity contract lives in situated_learning, not Interactive activities[].",
      "- activity.undertaking must be concrete and enactable for THIS experience (see ENACTABILITY — honour explicit LJ educational handoffs; do not absorb prior constituent work).",
      "- sections[] is ordered learner-facing composition using exposition Markdown; the concrete task must dominate.",
      "- situated_learning preserves the educational semantics; sections express the resolved design to the learner.",
      "- assembly_state.calls_model must be true.",
      "- Do not invent persistence mechanisms for record.",
      "- Do not persist compiled graphics briefs or completion ledgers — visual intent lives only as authoritative visual_affordances when warranted.",
      "",
      "No prose before the JSON fence. After the closing fence emit exactly one runner footer line as required by PRISM for this step."
    ].join("\n");
  }

  function buildSituatedTaskDesignPageCopyInstructions() {
    return [
      "Situated Task Design Page (same-chat constrained synthesis).",
      "Use the Situation, Activity, Support and Learning Return reasoning already established earlier in this conversation.",
      "Return an ordinary shared PRISM page with MANDATORY fields: artifact_type \"page\", schema_version \"2.0.0\", title, activities: [], sections[], situated_learning, assembly_state.",
      "situated_learning MUST include purpose.learning_intent, purpose.activity_rationale, activity.undertaking, activity.context, activity.learner_agency, record.retain, reconnection.destination, reconnection.use.",
      "Standalone: establish all required task inputs on this page. Commissioned with an explicit prior-experience dependency: honour that educational handoff — do not recreate the earlier constituent's work; make the prior artefact to bring forward intelligible; still state concretely what the learner does now.",
      "No automatic learner-state transfer, dependency graph, or cross-product response transport.",
      "When embedded recording is warranted, include situated_learning.record.entries (ordered entry_id/order/label[/prompt], optional placement.after_section_id); omit or [] when external recording is intentional. Placement is optional (embedded / consolidated / hybrid).",
      "Do not include product_id, commissions, learner response values, or commission provenance on the page.",
      "Graphics are optional: omit visual planning when not educationally warranted; when warranted use shared section-scoped visual_affordances (section-after-content) and purpose action_support only when that is the honest educational function.",
      "Output must be valid JSON only: no citations, content-reference tokens, or platform reference syntax inside any string value. No prose outside the fenced JSON.",
      "Do not invent page_synthesis.",
      "Do not redesign the activity or invent missing educational decisions."
    ].join("\n");
  }

  function isSituatedTaskDesignPage(value) {
    if (!isPlainObject(value)) return false;
    if (asText(value.artifact_type).toLowerCase() !== ARTIFACT_TYPE) return false;
    if (!isPlainObject(value.situated_learning)) return false;
    return true;
  }

  function requireNonEmptyString(obj, path, errors) {
    var parts = String(path || "").split(".");
    var cur = obj;
    var i;
    for (i = 0; i < parts.length; i += 1) {
      if (!isPlainObject(cur) && i < parts.length - 1) {
        errors.push(path + " required");
        return;
      }
      if (i === parts.length - 1) {
        if (!asText(cur && cur[parts[i]])) errors.push(path + " required");
        return;
      }
      cur = cur[parts[i]];
    }
  }

  function collectSectionIdSet(parsed) {
    var seen = Object.create(null);
    if (!parsed || !Array.isArray(parsed.sections)) return seen;
    var i;
    for (i = 0; i < parsed.sections.length; i += 1) {
      var section = parsed.sections[i];
      if (!isPlainObject(section)) continue;
      var sid = asText(section.section_id);
      if (sid) seen[sid] = true;
    }
    return seen;
  }

  function validateRecordEntries(record, errors, sectionIds) {
    if (!Object.prototype.hasOwnProperty.call(record, "entries")) return;
    if (!Array.isArray(record.entries)) {
      errors.push("situated_learning.record.entries must be an array when present");
      return;
    }
    var sectionIdSet = sectionIds && typeof sectionIds === "object" ? sectionIds : Object.create(null);
    var seen = Object.create(null);
    var i;
    for (i = 0; i < record.entries.length; i += 1) {
      var entry = record.entries[i];
      var prefix = "situated_learning.record.entries[" + i + "]";
      if (!isPlainObject(entry)) {
        errors.push(prefix + " invalid");
        continue;
      }
      [
        "value",
        "answer",
        "response",
        "learner_response",
        "localStorage",
        "persistence",
        "storage"
      ].forEach(function (forbidden) {
        if (Object.prototype.hasOwnProperty.call(entry, forbidden)) {
          errors.push(prefix + "." + forbidden + " forbidden");
        }
      });
      var entryId = asText(entry.entry_id);
      if (!entryId) errors.push(prefix + ".entry_id required");
      else if (seen[entryId]) errors.push("duplicate_record_entry_id:" + entryId);
      else seen[entryId] = true;
      if (!asText(entry.label)) errors.push(prefix + ".label required");
      if (
        entry.order == null ||
        typeof entry.order !== "number" ||
        !Number.isFinite(entry.order)
      ) {
        errors.push(prefix + ".order required");
      }
      if (Object.prototype.hasOwnProperty.call(entry, "prompt") && !asText(entry.prompt)) {
        errors.push(prefix + ".prompt must be omitted when empty");
      }
      if (Object.prototype.hasOwnProperty.call(entry, "placement")) {
        var placement = entry.placement;
        if (!isPlainObject(placement)) {
          errors.push(prefix + ".placement must be an object when present");
        } else {
          var afterSectionId = asText(placement.after_section_id);
          if (!afterSectionId) {
            errors.push(prefix + ".placement.after_section_id required");
          } else if (!sectionIdSet[afterSectionId]) {
            errors.push(
              prefix + ".placement.after_section_id unknown section_id:" + afterSectionId
            );
          }
        }
      }
    }
  }

  function validateSituatedTaskDesignPage(parsed) {
    if (!isPlainObject(parsed)) {
      return { ok: false, errors: ["not_a_situated_task_design_page"] };
    }
    if (asText(parsed.artifact_type).toLowerCase() !== ARTIFACT_TYPE) {
      return { ok: false, errors: ["wrong_artifact_type"] };
    }
    if (!isPlainObject(parsed.situated_learning)) {
      return { ok: false, errors: ["situated_learning_required"] };
    }

    var errors = [];
    if (asText(parsed.schema_version) !== SCHEMA_VERSION) {
      errors.push("schema_version must be 2.0.0");
    }
    if (!asText(parsed.title)) errors.push("title required");

    if (Object.prototype.hasOwnProperty.call(parsed, "product_id")) {
      errors.push("page_level_product_id_forbidden");
    }
    if (Object.prototype.hasOwnProperty.call(parsed, "commissions")) {
      errors.push("commissions_forbidden");
    }
    if (Object.prototype.hasOwnProperty.call(parsed, "page_synthesis")) {
      errors.push("interactive_page_synthesis_forbidden");
    }
    if (Object.prototype.hasOwnProperty.call(parsed, "sourceWorkflowId")) {
      errors.push("page_level_sourceWorkflowId_forbidden");
    }
    if (Object.prototype.hasOwnProperty.call(parsed, "sourceCommissionId")) {
      errors.push("page_level_sourceCommissionId_forbidden");
    }
    [
      "persistence",
      "localStorage",
      "storage",
      "upload",
      "lms_persistence",
      "learner_responses",
      "response_values"
    ].forEach(function (key) {
      if (Object.prototype.hasOwnProperty.call(parsed, key)) {
        errors.push("persistence_implementation_forbidden:" + key);
      }
    });

    if (!Array.isArray(parsed.activities)) {
      errors.push("activities must be an array");
    } else if (parsed.activities.length) {
      errors.push("activities must be empty for Situated Task");
    }

    if (!Array.isArray(parsed.sections) || !parsed.sections.length) {
      errors.push("sections required");
    } else {
      var seenSection = {};
      var i;
      for (i = 0; i < parsed.sections.length; i += 1) {
        var section = parsed.sections[i];
        if (!isPlainObject(section)) {
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

    var sl = parsed.situated_learning;
    if (!isPlainObject(sl.purpose)) errors.push("situated_learning.purpose required");
    else {
      requireNonEmptyString(sl, "purpose.learning_intent", errors);
      requireNonEmptyString(sl, "purpose.activity_rationale", errors);
    }
    if (!isPlainObject(sl.activity)) errors.push("situated_learning.activity required");
    else {
      // Structural only: enactability is a Stage 5 synthesis / live-acceptance
      // criterion, not a deterministic natural-language heuristic (S92 Gate 8
      // Slice 5 live false-positive fix). LJ educational handoffs may later
      // legitimately reference prior constituent work — do not encode that as
      // invalid here.
      requireNonEmptyString(sl, "activity.undertaking", errors);
      requireNonEmptyString(sl, "activity.context", errors);
      requireNonEmptyString(sl, "activity.learner_agency", errors);
    }
    if (!isPlainObject(sl.record)) errors.push("situated_learning.record required");
    else {
      requireNonEmptyString(sl, "record.retain", errors);
      validateRecordEntries(sl.record, errors, collectSectionIdSet(parsed));
      [
        "localStorage",
        "persistence",
        "storage",
        "learner_responses",
        "response_values"
      ].forEach(function (forbidden) {
        if (Object.prototype.hasOwnProperty.call(sl.record, forbidden)) {
          errors.push("situated_learning.record." + forbidden + " forbidden");
        }
      });
    }
    if (!isPlainObject(sl.reconnection)) errors.push("situated_learning.reconnection required");
    else {
      requireNonEmptyString(sl, "reconnection.destination", errors);
      requireNonEmptyString(sl, "reconnection.use", errors);
    }

    OPTIONAL_SUPPORT_KEYS.forEach(function (key) {
      if (!Object.prototype.hasOwnProperty.call(sl, key)) return;
      var val = sl[key];
      if (val == null) {
        errors.push("situated_learning." + key + " must be omitted when empty");
        return;
      }
      if (typeof val === "string" && !asText(val)) {
        errors.push("situated_learning." + key + " must be omitted when empty");
      }
    });

    if (!isPlainObject(parsed.assembly_state)) {
      errors.push("assembly_state required");
    } else {
      if (asText(parsed.assembly_state.current_stage) !== "design_page") {
        errors.push("assembly_state.current_stage must be design_page");
      }
      if (parsed.assembly_state.calls_model !== true) {
        errors.push("assembly_state.calls_model must be true");
      }
      var enrichedBy = Array.isArray(parsed.assembly_state.enriched_by)
        ? parsed.assembly_state.enriched_by
        : [];
      if (
        !enrichedBy.some(function (s) {
          return asText(s).toLowerCase() === "design_page";
        })
      ) {
        errors.push("assembly_state.enriched_by must include design_page");
      }
    }

    if (pageHasVisualPlanning(parsed)) {
      var s38 = resolveSprint38VisualAffordancesLib();
      var vpc = resolveVisualPlanningContractLib();
      if (!s38 || typeof s38.validatePageVisualAffordances !== "function") {
        errors.push("visual_affordance_module_unavailable");
      } else {
        var s38Gate = s38.validatePageVisualAffordances(parsed);
        if (!s38Gate.valid) {
          (s38Gate.errors || []).forEach(function (msg) {
            errors.push(String(msg));
          });
        }
      }
      if (!vpc || typeof vpc.validateVisualPlanningContract !== "function") {
        errors.push("visual_planning_contract_module_unavailable");
      } else {
        var vpcGate = vpc.validateVisualPlanningContract(parsed);
        if (!vpcGate.valid) {
          (vpcGate.errors || []).forEach(function (issue) {
            var message =
              issue && typeof issue === "object"
                ? String(issue.message || issue.code || "visual_planning_error")
                : String(issue);
            errors.push(message);
          });
        }
      }
      if (Array.isArray(parsed.visual_affordances)) {
        parsed.visual_affordances.forEach(function (row, index) {
          if (!row || typeof row !== "object") return;
          if (asText(row.scope) === "activity") {
            errors.push(
              "visual_affordances[" + index + "]: activity scope forbidden on Situated Task (use section)"
            );
          }
          if (asText(row.activity_id)) {
            errors.push(
              "visual_affordances[" + index + "]: activity_id forbidden on Situated Task"
            );
          }
        });
      }
    }

    return errors.length ? { ok: false, errors: errors } : { ok: true, errors: [] };
  }

  function buildSituatedTaskDesignPageFixture(options) {
    var opts = options && typeof options === "object" ? options : {};
    var page = {
      artifact_type: ARTIFACT_TYPE,
      schema_version: SCHEMA_VERSION,
      title: asText(opts.title) || "Situated Task: Product-situation investigation",
      activities: [],
      sections: [
        {
          section_id: "task",
          title: asText(opts.orientTitle) || "What you will do",
          order: 1,
          exposition:
            asText(opts.orientExposition) ||
            "**Your task:** visit one authentic workplace practice setting (or an agreed equivalent) and investigate what actually happens during two live customer-enquiry handovers.\n\nObserve what is said and done, compare that with what you expected, and keep the observational judgements yours — this page frames the undertaking, not the conclusions."
        },
        {
          section_id: "support",
          title: asText(opts.supportTitle) || "Support while you act",
          order: 2,
          exposition:
            asText(opts.supportExposition) ||
            "Stay within agreed access and privacy boundaries. Notice sequence, who speaks, and where practice diverges from expectation. Adapt if a handover is interrupted — still capture what you can observe."
        },
        {
          section_id: "return",
          title: asText(opts.returnTitle) || "What to keep for later",
          order: 3,
          exposition:
            asText(opts.returnExposition) ||
            "Use the recording fields below when this design asks for an embedded record. Later interpretation will work with what you retain — not with a re-run of the investigation."
        }
      ],
      situated_learning: {
        purpose: {
          learning_intent:
            asText(opts.learningIntent) ||
            "Develop ability to notice consequential features of a product situation.",
          activity_rationale:
            asText(opts.activityRationale) ||
            "Carrying out the investigation in context is the principal learning vehicle."
        },
        activity: {
          undertaking:
            asText(opts.undertaking) ||
            "Visit one authentic workplace practice setting (or an agreed equivalent) and investigate what actually happens during two live customer-enquiry handovers: observe what is said and done, and identify where practice diverges from what you expected.",
          context: asText(opts.context) || "Authentic undergraduate product/project workplace setting with agreed access.",
          learner_agency:
            asText(opts.learnerAgency) ||
            "Observation, interpretation and judgement remain with the learner."
        },
        record: {
          retain:
            asText(opts.retain) ||
            "Expectations versus observations, unexpected or contradictory evidence, decisions or adaptations, and limitations or unresolved uncertainty for later interpretation."
        },
        reconnection: {
          destination:
            asText(opts.destination) || "Subsequent interpretation / reframing experience.",
          use:
            asText(opts.use) ||
            "Later learning works with the retained observations rather than redoing the investigation."
        }
      },
      assembly_state: {
        current_stage: "design_page",
        enriched_by: ["situation", "activity", "support", "learning_return", "design_page"],
        calls_model: true
      }
    };
    // Default fixture commissions embedded record entries; pass recordEntries: null to omit
    // (external recording). Pass [] for intentional empty embedded list.
    if (opts.recordEntries !== null) {
      page.situated_learning.record.entries = Array.isArray(opts.recordEntries)
        ? opts.recordEntries
        : [
            {
              entry_id: "expectation",
              order: 1,
              label: "What you expected",
              prompt:
                "Before or as you begin, note what you expected to observe in the handovers."
            },
            {
              entry_id: "observation",
              order: 2,
              label: "What you observed",
              prompt: "Record what was actually said and done in the handovers you observed."
            },
            {
              entry_id: "divergence",
              order: 3,
              label: "Where practice diverged",
              prompt: "Note unexpected, contradictory, or divergent evidence."
            },
            {
              entry_id: "limitations",
              order: 4,
              label: "Limitations and uncertainty",
              prompt: "Capture limitations, interruptions, and what remains unresolved."
            }
          ];
    }
    if (opts.boundaries) page.situated_learning.boundaries = String(opts.boundaries);
    if (opts.attention) page.situated_learning.attention = String(opts.attention);

    if (opts.withActionSupportVisual) {
      page.visual_affordance_schema_version = "38.4";
      page.activities_visual_review = [];
      page.visual_affordances = [
        {
          affordance_id: asText(opts.affordanceId) || "va-task-observation-aid-01",
          scope: "section",
          section_id: "task",
          visual_decision: "generate",
          visual_slot: "section-after-content",
          tier: "essential",
          purpose: "action_support",
          preferred_representation: "annotated_system",
          subject: "Observation guide for product-situation features",
          context:
            "Visual brief: help the learner notice which kinds of features and relationships to attend to while undertaking their own investigation; do not perform the observation or state conclusions.",
          evidence_anchors: ["task.exposition"],
          rationale:
            "Supports noticing during learner-owned investigation without substituting for the investigation.",
          reasoning_supported:
            "Learners orient attention to consequential feature classes before observing for themselves.",
          learner_stage: "pre_classification",
          anti_spoiler: true,
          spoiler_boundary: {
            hide_answers: true,
            hide_classification_keys: true,
            hide_model_solution: true,
            allow_structural_hint: true
          },
          representation_avoid: ["generic_infographic", "topic_hero_image", "filled_worksheet"],
          canonical_discipline_note:
            "Show only noticing categories warranted by the task exposition; do not invent findings.",
          requires_exact_data_match: false,
          must_show: ["labelled feature categories to notice", "open slots for learner observation"],
          must_not_show: [
            "completed observations",
            "verdict about the product situation",
            "filled evidence answers"
          ],
          allowed_claims: [
            "Certain feature classes are worth noticing during investigation."
          ],
          disallowed_claims: [
            "Claims that complete the observation or judge the product for the learner."
          ],
          source_basis: "task.exposition",
          caption_intent: "Observation aid for learner-owned product-situation investigation.",
          alt_text: "Annotated observation guide naming feature categories without filled findings.",
          detailed_description:
            "An annotated reference layout names categories of features and relationships the learner should look for. Spaces for observation remain empty so the learner performs the investigation.",
          discipline_risk_level: "medium"
        }
      ];
    }

    var gate = validateSituatedTaskDesignPage(page);
    return {
      ok: gate.ok,
      callsModel: true,
      errors: gate.errors,
      page: page
    };
  }

  return {
    ARTIFACT_TYPE: ARTIFACT_TYPE,
    SCHEMA_VERSION: SCHEMA_VERSION,
    PRODUCT_ID: PRODUCT_ID,
    PRODUCT_LABEL: PRODUCT_LABEL,
    PUBLISH_ROUTE: PUBLISH_ROUTE,
    OPTIONAL_SUPPORT_KEYS: OPTIONAL_SUPPORT_KEYS.slice(),
    buildSituatedTaskDesignPagePrompt: buildSituatedTaskDesignPagePrompt,
    buildSituatedTaskDesignPageCopyInstructions: buildSituatedTaskDesignPageCopyInstructions,
    isSituatedTaskDesignPage: isSituatedTaskDesignPage,
    validateSituatedTaskDesignPage: validateSituatedTaskDesignPage,
    pageHasVisualPlanning: pageHasVisualPlanning,
    buildSituatedTaskDesignPageFixture: buildSituatedTaskDesignPageFixture
  };
});
