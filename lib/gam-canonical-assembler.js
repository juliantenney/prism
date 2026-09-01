/**
 * S79-T-003…T-006 — Canonical GAM section builder / assembler.
 *
 * LIVE after S79-T-005: Run/Copy + Studio route through this module.
 * LIVE_PRODUCTION is a status marker only (not a feature flag).
 * S79-T-008: temporary assembler-miss OLD fallbacks retired (fail-closed).
 *
 * STRICT TEXT PRESERVATION — reproduces protected wording/order; does not
 * retune prompts or flatten Copy vs Studio into one identical prompt.
 */
(function (root, factory) {
  "use strict";
  var api = factory(root);
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_GAM_CANONICAL_ASSEMBLER = api;
  }
})(
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this,
  function (root) {
    "use strict";

    /**
     * S79-T-006 — Final silent pre-emit gate ownership.
     * Textual SSOT: lib/ld-gam-page-enrich-contract.js → GAM_FINAL_SILENT_PRE_EMIT_CONSISTENCY_GATE
     * Canonical insertion owner: buildSectionPreEmitGate (this module).
     * Path wrappers may ensure/dedupe placement; they must not define alternate gate wording.
     */
    var GATE_TEXT_SSOT = Object.freeze({
      moduleId: "PRISM_LD_GAM_PAGE_ENRICH_CONTRACT",
      constantName: "GAM_FINAL_SILENT_PRE_EMIT_CONSISTENCY_GATE",
      insertionOwner: "buildSectionPreEmitGate"
    });

    var ASSEMBLER_VERSION = "S79-T-008-RETIREMENT-1";
    /**
     * LIVE_PRODUCTION — documentation/status marker only (S79-T-006).
     * Not a runtime feature flag. Live routing decides via presence of this module API
     * (resolveGamCanonicalAssemblerLib), not by reading this boolean.
     * Changing this value alone cannot reactivate OLD assembly.
     * After T-008 fallback retirement, the marker may remain as status metadata.
     */
    var LIVE_PRODUCTION = true;

    var PROFILES = Object.freeze({
      COPY_V2_PARTIAL: "copy_v2_partial",
      COPY_V2_NONPARTIAL: "copy_v2_nonpartial",
      STUDIO_V2_PARTIAL: "studio_v2_partial",
      STUDIO_V2_NONPARTIAL: "studio_v2_nonpartial"
    });

    /** Neutral future Settings ingress — must not alter assembled text in S79. */
    var NEUTRAL_POLICY_INGRESS = Object.freeze({
      source: "none",
      settingsEffective: false,
      notes: "S79 behaviour-neutral seam only; not PB-FA-005"
    });

    var GAM_AUTHORITATIVE_DLA_COMMISSION_HEADING = "### AUTHORITATIVE DLA MATERIAL COMMISSION";
    var GAM_AUTHORITATIVE_DLA_COMMISSION_AUTHORITY =
      "This embedded JSON is the authoritative DLA material commission for Generate Activity Materials. Author only the listed activities and required_materials rows. Preserve activity_id, material_id, and material_type. Fulfil each row's purpose and specification. Honour instructional_archetype and archetype_plan when present. Honour evidence_requirement when present. Honour response_fulfilment when present — preserve learner-completion bounds and blank response loci for commissioned workspace rows. Honour practice_independence when present on model rows. Do not add, delete, substitute, rename, or reassign commissioned material rows. Copilot conversation may provide contextual continuity but must not override this embedded commission.";

    var PIPELINE_OPENING_FALLBACK =
      "Execution mode: autonomous. Do not ask the user follow-up questions. If something is ambiguous, choose the most reasonable interpretation from provided workflow context and continue.";

    var PIPELINE_COMPLETION_FALLBACK =
      'Pipeline completion rule: after you emit the required artefact and the exact runner footer line, stop immediately. Do not ask follow-up questions and do not offer optional next steps (including phrasing such as "Would you like me to...", "Shall I also...", "Should I generate...", "Would you like another version...", "Any other changes?", or "Any further refinements?").';

    function resolveLib(globalKey, nodePath) {
      if (root && root[globalKey]) return root[globalKey];
      if (typeof globalThis !== "undefined" && globalThis[globalKey]) {
        return globalThis[globalKey];
      }
      if (typeof window !== "undefined" && window[globalKey]) {
        return window[globalKey];
      }
      if (typeof require === "function" && nodePath) {
        try {
          return require(nodePath);
        } catch (_err) {}
      }
      return null;
    }

    function resolveContractLib(deps) {
      if (deps && deps.contractLib) return deps.contractLib;
      return resolveLib("PRISM_LD_GAM_PAGE_ENRICH_CONTRACT", "./ld-gam-page-enrich-contract.js");
    }

    function resolveWs2Lib(deps) {
      if (deps && deps.ws2Lib) return deps.ws2Lib;
      return resolveLib(
        "PRISM_GAM_PRACTICE_INDEPENDENCE_PROMPT",
        "./gam-practice-independence-prompt.js"
      );
    }

    function resolveOpsLib(deps) {
      if (deps && deps.opsLib) return deps.opsLib;
      return resolveLib(
        "PRISM_GAM_OPERATIONAL_SUITABILITY_PROMPT",
        "./gam-operational-suitability-prompt.js"
      );
    }

    function resolveMathLib(deps) {
      if (deps && deps.mathLib) return deps.mathLib;
      return resolveLib("PRISM_LD_MATH_RENDER", "./ld-math-render.js");
    }

    function resolveEqfLib(deps) {
      if (deps && deps.eqfLib) return deps.eqfLib;
      return resolveLib(
        "PRISM_EDUCATIONAL_QUALITY_FRAMEWORK",
        "./educational-quality-framework-prompt.js"
      );
    }

    function createGamAssemblyContext(raw) {
      var src = raw && typeof raw === "object" ? raw : {};
      var deps = src.deps && typeof src.deps === "object" ? src.deps : {};
      var profile = String(src.profile || PROFILES.COPY_V2_PARTIAL).trim();
      var partialMode =
        profile === PROFILES.COPY_V2_PARTIAL || profile === PROFILES.STUDIO_V2_PARTIAL
          ? true
          : profile === PROFILES.COPY_V2_NONPARTIAL ||
              profile === PROFILES.STUDIO_V2_NONPARTIAL
            ? false
            : src.partialMode !== false;
      return {
        profile: profile,
        partialMode: partialMode,
        pageEnrichmentV2: src.pageEnrichmentV2 !== false,
        dlaPage: src.dlaPage && typeof src.dlaPage === "object" ? src.dlaPage : null,
        upstreamDlaPageJson:
          typeof src.upstreamDlaPageJson === "string" ? src.upstreamDlaPageJson : "",
        stepTitle: String(src.stepTitle || "Generate Activity Materials").trim(),
        stepIndex: typeof src.stepIndex === "number" ? src.stepIndex : 2,
        outputName: String(src.outputName || "page").trim(),
        notes: typeof src.notes === "string" ? src.notes : "",
        libraryBody: typeof src.libraryBody === "string" ? src.libraryBody : "",
        workflowSteps: Array.isArray(src.workflowSteps) ? src.workflowSteps : [],
        inputArtefactLines: Array.isArray(src.inputArtefactLines)
          ? src.inputArtefactLines
          : null,
        optionalInputKindLabel: String(src.optionalInputKindLabel || "Paste text").trim(),
        runnerGuidanceLines: Array.isArray(src.runnerGuidanceLines)
          ? src.runnerGuidanceLines
          : null,
        includeCopyMath: src.includeCopyMath !== false,
        includePipelineClose: src.includePipelineClose !== false,
        includeStudioEqf: src.includeStudioEqf !== false,
        includeStudioMath: src.includeStudioMath !== false,
        policyIngress: src.policyIngress,
        deps: deps,
        adapters: src.adapters && typeof src.adapters === "object" ? src.adapters : {},
        liveProduction: LIVE_PRODUCTION,
        assemblerVersion: ASSEMBLER_VERSION
      };
    }

    /**
     * Behaviour-neutral policy ingress seam. Must not change assembled text.
     */
    function resolveGamPolicyIngress(ctx) {
      var context = ctx && ctx.profile ? ctx : createGamAssemblyContext(ctx);
      if (context.policyIngress && typeof context.policyIngress === "object") {
        return Object.assign({}, NEUTRAL_POLICY_INGRESS, context.policyIngress, {
          settingsEffective: false
        });
      }
      return NEUTRAL_POLICY_INGRESS;
    }

    function buildSectionOutputContract(ctx) {
      var context = ctx && ctx.deps ? ctx : createGamAssemblyContext(ctx);
      if (
        context.adapters &&
        typeof context.adapters.buildOutputContractAndShape === "function"
      ) {
        return String(context.adapters.buildOutputContractAndShape() || "");
      }
      var contractMod = resolveContractLib(context.deps);
      var contract =
        contractMod && typeof contractMod.buildGamPageEnrichContractBlock === "function"
          ? contractMod.buildGamPageEnrichContractBlock()
          : "";
      var shape =
        contractMod && typeof contractMod.buildCanonicalGamMaterialShapeSnippet === "function"
          ? contractMod.buildCanonicalGamMaterialShapeSnippet()
          : "";
      return [contract, shape].filter(Boolean).join("\n");
    }

    function buildSectionPreEmitGate(ctx) {
      var context = ctx && ctx.deps !== undefined ? ctx : createGamAssemblyContext(ctx);
      if (context.adapters && typeof context.adapters.buildPreEmitGate === "function") {
        return String(context.adapters.buildPreEmitGate() || "");
      }
      var contractMod = resolveContractLib(context.deps);
      if (
        contractMod &&
        typeof contractMod.GAM_FINAL_SILENT_PRE_EMIT_CONSISTENCY_GATE === "string"
      ) {
        return String(contractMod.GAM_FINAL_SILENT_PRE_EMIT_CONSISTENCY_GATE);
      }
      return "";
    }

    /**
     * Canonical Copy authoring brief (includes gate at end) — text preserved from live app.js.
     */
    function buildSectionAuthoringBrief(ctx) {
      var context = ctx && ctx.deps !== undefined ? ctx : createGamAssemblyContext(ctx);
      if (context.adapters && typeof context.adapters.buildAuthoringBrief === "function") {
        return String(context.adapters.buildAuthoringBrief() || "");
      }
      var parts = [
        "Output contract: return a partial page artefact only (not a full-page replay).",
        'Required envelope: artifact_type "page", schema_version "2.0.0", assembly_state.current_stage "gam", and assembly_state.enriched_by including "gam".',
        "Required payload: activities[] containing activity_id and materials[] only.",
        "For each activity row: preserve required material order and emit exactly one hydrated material object per required_materials.material_id (no missing IDs, no duplicates, no orphan materials).",
        "Each material object must include: material_id, material_type, title, body_format, body, and activity_id (or parent_activity_id). Honour required_materials[].purpose and treat specification as binding content bounds. Realised particulars must support the commissioned learner operation within those bounds; they must provide enough coherent information for that operation to be carried out; when that operation requires identifying or solving for a result, do not emit contradictory or underdetermined particulars for that requested result; do not substitute a different method or extra unstated reasoning; do not invent pedagogical constraints the commission omits. When S78-OPERATIONAL-SUITABILITY (auto-applied) is present in AUTHORITATIVE DLA MATERIAL COMMISSION, follow its per-material obligations locally.",
        "S78-DP: realised instructional claims (including headings and checklist stems) must match warranted strength for the taught model class and evidence; do not upgrade necessary or intermediate results into unrestricted optima, general causal/policy conclusions, or broader representation classes than the commission and examples support. Prefer accurate scoped language over establishment slogans. Omit advanced theory freely; do not upgrade the strength of what remains.",
        "If evidence_requirement.provenance is conversation_attachment, return to the authoritative material in this Copilot conversation; reproduce accurate attributed excerpts (preserve wording/punctuation; mark partial excerpts with ellipsis); do not paraphrase into thematic summaries or pre-interpretations; do not mix quotation rows with summary-only rows; for combined_evidence_workspace include a fixed quotation/extract/value field (not poem/category alone); do not invent quotations from memory; do not add a Simulated label; if the source is unavailable, do not fabricate or reconstruct it—state that the source-bound requirement could not be fulfilled (SOURCE_BOUND_UNFULFILLED) and do not silently substitute simulated evidence.",
        "If evidence_requirement.provenance is system_generated_simulation, label simulated evidence explicitly for learners.",
        "Hydration completeness rule: do not leave generation_notes.validation material_coverage/self_containment/activity_coverage in pending/shell-only states when bodies are emitted.",
        "Canonical placement rule: material bodies must be present directly in activities[].materials[] for each owning activity; do not emit bodies only in side-channel locations.",
        'S78-D04 page learner-resource closure: in the final activity\'s materials Markdown, include exactly one section headed "### Page learner-resource closure" (2–4 compact consolidation bullets; optional lightly signposted transfer without a worked answer; no new teaching/claims/model classes; honour S78-DP). Prefer consolidation_summary or culminating closure/debrief Markdown as the host vessel when commissioned; otherwise append to the last Markdown material of the final activity that is NOT a transfer_prompt. NEVER host this section inside a transfer_prompt body (S78-T-055). Do not put this substance in page_synthesis. Design Page will transport that section verbatim into study_tips when present.',
        "S78-T-041 transfer_prompt: when required_materials includes transfer_prompt, author a compact learner-production transfer/application task on a meaningfully changed context (learner response required; no solution leak; no new teaching; honour S78-DP). Distinct from ### Page learner-resource closure / study_tips consolidation — do not embed or substitute closure bullets in the transfer production. Do not author ### Transfer task boilerplate — the renderer supplies Transfer your learning / Transfer response.",
        "S78-T-042 structured workspace fidelity: for template / structured response or derivation workspaces, author **Label:** sections (bold label with trailing colon) so each ordered prompt binds to a learner response location. Do not emit standalone bold labels without the colon as surrogate response fields. Keep genuine tables as tables with blank learner cells. Ordinary inline bold emphasis in prose is fine. Do not invent an equation editor.",
        "Copilot conversation may provide contextual continuity of instructional intent; it must not override the AUTHORITATIVE DLA MATERIAL COMMISSION. PRISM does not embed the full upstream DLA page in this mode.",
        "Forbidden: shell fields, DLA instructional scalar fields, required_materials mutation/removal, page_synthesis, learning_sequence, and full-page replay.",
        "Do not reconstruct or preserve non-owned stage fields."
      ];
      var gate = buildSectionPreEmitGate(context);
      if (gate) parts.push("", gate);
      return parts.join("\n");
    }

    function prismHasOwnField(obj, key) {
      return !!(
        obj &&
        typeof obj === "object" &&
        !Array.isArray(obj) &&
        Object.prototype.hasOwnProperty.call(obj, key) &&
        obj[key] !== undefined &&
        obj[key] !== null
      );
    }

    function copyOwnFieldIfPresent(src, dest, key) {
      if (prismHasOwnField(src, key)) dest[key] = src[key];
    }

    function projectGamAuthoritativeDlaCommissionFromPage(page) {
      var acts = Array.isArray(page && page.activities) ? page.activities : [];
      var outActs = [];
      var i;
      var j;
      for (i = 0; i < acts.length; i += 1) {
        var act = acts[i];
        if (!act || typeof act !== "object" || Array.isArray(act)) continue;
        var rms = Array.isArray(act.required_materials) ? act.required_materials : [];
        if (!rms.length) continue;
        var proj = {};
        copyOwnFieldIfPresent(act, proj, "activity_id");
        copyOwnFieldIfPresent(act, proj, "instructional_archetype");
        copyOwnFieldIfPresent(act, proj, "archetype_plan");
        copyOwnFieldIfPresent(act, proj, "evidence_requirement");
        var mats = [];
        for (j = 0; j < rms.length; j += 1) {
          var rm = rms[j];
          if (!rm || typeof rm !== "object" || Array.isArray(rm)) continue;
          var row = {};
          copyOwnFieldIfPresent(rm, row, "material_id");
          copyOwnFieldIfPresent(rm, row, "material_type");
          copyOwnFieldIfPresent(rm, row, "purpose");
          copyOwnFieldIfPresent(rm, row, "specification");
          copyOwnFieldIfPresent(rm, row, "evidence_requirement");
          copyOwnFieldIfPresent(rm, row, "response_fulfilment");
          copyOwnFieldIfPresent(rm, row, "response_fields");
          copyOwnFieldIfPresent(rm, row, "practice_independence");
          copyOwnFieldIfPresent(rm, row, "diagnostic_review");
          mats.push(row);
        }
        proj.required_materials = mats;
        outActs.push(proj);
      }
      return {
        kind: "gam_authoritative_dla_commission",
        activities: outActs
      };
    }

    function buildSectionCommission(ctx) {
      var context = ctx && ctx.deps !== undefined ? ctx : createGamAssemblyContext(ctx);
      if (context.adapters && typeof context.adapters.buildCommissionSection === "function") {
        return String(context.adapters.buildCommissionSection(context.dlaPage) || "");
      }
      var page = context.dlaPage;
      if (!page) return "";
      var payload = projectGamAuthoritativeDlaCommissionFromPage(page);
      var jsonText;
      try {
        jsonText = JSON.stringify(payload, null, 2);
      } catch (_err) {
        return "";
      }
      var parts = [
        "",
        GAM_AUTHORITATIVE_DLA_COMMISSION_HEADING,
        "",
        GAM_AUTHORITATIVE_DLA_COMMISSION_AUTHORITY,
        "",
        "```json",
        jsonText,
        "```"
      ];
      var ws2Lib = resolveWs2Lib(context.deps);
      if (ws2Lib && typeof ws2Lib.buildS78Ws2OperandAwareAuthoringBlock === "function") {
        var ws2Block = ws2Lib.buildS78Ws2OperandAwareAuthoringBlock(page);
        if (ws2Block) parts.push(ws2Block);
      }
      var opsLib = resolveOpsLib(context.deps);
      if (opsLib && typeof opsLib.buildOperationalSuitabilityAuthoringBlock === "function") {
        var opsBlock = opsLib.buildOperationalSuitabilityAuthoringBlock(page);
        if (opsBlock) parts.push(opsBlock);
      }
      return parts.join("\n");
    }

    function buildSectionActivityCountInvariant(pageJson) {
      var parsed;
      try {
        parsed = typeof pageJson === "string" ? JSON.parse(pageJson) : pageJson;
      } catch (_err) {
        return "";
      }
      if (!parsed || !Array.isArray(parsed.activities) || !parsed.activities.length) {
        return "";
      }
      var ids = parsed.activities
        .map(function (row) {
          return String((row && row.activity_id) || "").trim();
        })
        .filter(Boolean);
      var count = parsed.activities.length;
      var loCount = Array.isArray(parsed.learning_outcomes) ? parsed.learning_outcomes.length : 0;
      var epCount = Array.isArray(parsed.episode_plans) ? parsed.episode_plans.length : 0;
      var idList = ids.length ? ids.join(", ") : "(see embedded page)";
      return [
        "",
        "### Activity count invariant (required)",
        "",
        "Input activities[] has " + count + " entries: " + idList + ".",
        "Output activities[] must contain exactly " +
          count +
          " entries with the same activity_id values in the same order.",
        "Do not stop after the first activities. Do not drop later activities due to length. Emit the full page through the final closing `}`.",
        "Output learning_outcomes[] must contain exactly " + loCount + " entries (same as input).",
        "Output episode_plans[] must contain exactly " + epCount + " entries (same as input)."
      ].join("\n");
    }

    function buildSectionUpstreamFullEmbed(ctx) {
      var context = ctx && ctx.deps !== undefined ? ctx : createGamAssemblyContext(ctx);
      var json = String(context.upstreamDlaPageJson || "").trim();
      if (!json) {
        return [
          "",
          "### Upstream DLA page (Design Learning Activities — required input)",
          "",
          "**Return the entire input page unchanged except for activities[].materials[]. Do not omit fields. Do not return a materials-only skeleton.**",
          "",
          "Locate STEP N OUTPUT: page from Design Learning Activities in this Copilot conversation. Return that full page with materials[] populated from required_materials[] — do not emit pack text, activity_materials, or a reduced activities-only JSON stub."
        ].join("\n");
      }
      return [
        "",
        "### Upstream DLA page (Design Learning Activities — enrich in place)",
        "",
        "**Return the entire input page below unchanged except for activities[].materials[] and assembly_state. Treat this JSON as an immutable document — edit in place only. Do not regenerate, reconstruct, or rewrite any other field.**",
        "",
        "Input: the complete DLA-enriched vNext page below. Output: that SAME page with activities[].materials[] populated. Copy generation_notes, learning_outcomes, episode_plans, required_materials, learner_task, expected_output, and all cognition fields character-for-character. Do not empty required_materials[]. Do not truncate episode_plans[]. Emit every activity through the final `}` — do not stop after A3 or any early activity. Do not write page_synthesis or sections[].",
        buildSectionActivityCountInvariant(json),
        "",
        "```json",
        json,
        "```"
      ].join("\n");
    }

    function buildSectionCompletionOverride(ctx) {
      var context = ctx && ctx.deps !== undefined ? ctx : createGamAssemblyContext(ctx);
      var lines = [
        "GAM completion override: do NOT refuse, defer, or claim response/context/token limits."
      ];
      if (context.partialMode) {
        lines.push(
          "You must emit the complete GAM partial artefact now: artifact_type, schema_version, assembly_state for gam, and activities[] with activity_id + materials[]."
        );
        lines.push(
          "Do not emit upstream full-page fields. Do not emit note/message/warning/explanation/apology text."
        );
      } else {
        lines.push(
          "You must emit the complete vNext page artefact now — every input activity preserved, same activities[].length and activity_id order, same learning_outcomes[].length, same episode_plans[].length, materials[] populated where required, assembly_state updated. A1 is not completion. Do not stop after A3 or any partial prefix. Never drop later activities. If length is a concern, keep all activities and preserve fields exactly."
        );
        lines.push(
          "Meta-output is invalid: do not emit note/message/warning/explanation/apology/limitation text (including 'too large to reproduce'). Emit only the complete GAM-enriched page JSON."
        );
      }
      lines.push(
        "Forbidden refusal/disclaimer patterns: 'can't complete', 'cannot complete', 'too large', 'exceeds response limits', 'split across multiple outputs/responses'."
      );
      return lines.join("\n");
    }

    function buildSectionStepFooter(ctx) {
      var context = ctx && ctx.deps !== undefined ? ctx : createGamAssemblyContext(ctx);
      var stepNum =
        typeof context.stepIndex === "number" && !isNaN(context.stepIndex) && context.stepIndex >= 0
          ? Math.floor(context.stepIndex) + 1
          : 1;
      var exactFooterLine = context.outputName
        ? "STEP " + stepNum + " OUTPUT: " + context.outputName
        : "";
      if (!exactFooterLine) return "";
      return [
        "For strict JSON artefact steps, append exactly one plain-text runner footer line after the closing JSON fence:",
        "Authoritative footer override: if the copied core prompt contains any generic footer placeholder or any 'return only JSON' clause that omits the runner line, ignore that text and follow the exact literal footer line below.",
        "Do not emit any placeholder footer form. Use the exact literal line below, verbatim:",
        exactFooterLine
      ].join("\n");
    }

    function buildSectionCopyModeFraming(ctx) {
      var context = ctx && ctx.deps !== undefined ? ctx : createGamAssemblyContext(ctx);
      var stepNum =
        typeof context.stepIndex === "number" && !isNaN(context.stepIndex) && context.stepIndex >= 0
          ? Math.floor(context.stepIndex) + 1
          : 1;
      var exactFooterLine = context.outputName
        ? "STEP " + stepNum + " OUTPUT: " + context.outputName
        : "STEP N OUTPUT: page";
      var lines = [];
      if (context.partialMode) {
        lines.push(
          "Sprint 58 GAM partial output mode: return a partial page artefact containing only activity_id + materials."
        );
        lines.push(
          "PRISM does not embed the full upstream DLA page in this mode. The AUTHORITATIVE DLA MATERIAL COMMISSION is binding. Copilot conversation may provide contextual continuity but must not override that commission."
        );
      } else {
        lines.push(
          "**CRITICAL:** Treat the embedded DLA page as an immutable document. Edit in place only. Return the entire input page unchanged except for activities[].materials[] and assembly_state."
        );
        lines.push(
          "Sprint 56F GAM enrich-in-place: emit the complete page JSON from `{` to `}` — all input activities, same count, same activity_id order. Do not stop after the first few activities or omit later ones due to length. Copy every other field character-for-character. GAM is not authorised to rewrite, shorten, paraphrase, summarise, normalise, improve, regenerate, reorder, compress, or reconstruct any non-owned field. For each activity object, replace only materials value and preserve all sibling fields. Do NOT emit compact { activity_id, materials } objects, partial pages, subsets, pack text, activity_materials, or skeleton stubs."
        );
      }
      lines.push(
        "Copilot output contract: return one complete pretty-printed fenced JSON page artefact (triple-backtick json fence, 2-space indentation) containing every input activity — no ellipses, no comments, no continuation, no top-level note/message/warning fields, and no prose or explanations. If output is large, still emit the full JSON. No prose before the fence. After the closing fence emit exactly one runner footer line: " +
          exactFooterLine +
          ". No other text after the footer line."
      );
      return lines.join("\n");
    }

    function buildSectionRunnerGuidance(ctx) {
      var context = ctx && ctx.deps !== undefined ? ctx : createGamAssemblyContext(ctx);
      if (context.runnerGuidanceLines) {
        return context.runnerGuidanceLines.join("\n");
      }
      var title = context.stepTitle || "Generate Activity Materials";
      return [
        "",
        "Runner guidance:",
        "- What this step does: Complete " + title + " using the available workflow artefacts.",
        "- What to expect: A structured output that can be used by downstream workflow steps.",
        "- What to check: Output is complete, internally consistent, and aligned with this step's purpose."
      ].join("\n");
    }

    function buildSectionInputArtefacts(ctx) {
      var context = ctx && ctx.deps !== undefined ? ctx : createGamAssemblyContext(ctx);
      var lines = [
        "Optional additional input for this step: " + context.optionalInputKindLabel + "."
      ];
      var artefactLines = context.inputArtefactLines;
      if (!artefactLines && context.workflowSteps.length) {
        artefactLines = context.workflowSteps
          .filter(function (s) {
            return s && String(s.outputName || "").trim();
          })
          .map(function (s) {
            return (
              '- "' +
              String(s.outputName).trim() +
              '" from step "' +
              String(s.title || "an earlier step").trim() +
              '".'
            );
          });
      }
      if (artefactLines && artefactLines.length) {
        lines.push("");
        lines.push("Input artefacts for this step:");
        artefactLines.forEach(function (line) {
          lines.push(line);
        });
      }
      return lines.join("\n");
    }

    function buildSectionPipelineOpening(ctx) {
      var context = ctx && ctx.deps !== undefined ? ctx : createGamAssemblyContext(ctx);
      if (context.adapters && typeof context.adapters.pipelineOpening === "string") {
        return context.adapters.pipelineOpening;
      }
      return PIPELINE_OPENING_FALLBACK;
    }

    function buildSectionPipelineCompletion(ctx) {
      var context = ctx && ctx.deps !== undefined ? ctx : createGamAssemblyContext(ctx);
      if (context.adapters && typeof context.adapters.pipelineCompletion === "string") {
        return context.adapters.pipelineCompletion;
      }
      return PIPELINE_COMPLETION_FALLBACK;
    }

    function buildSectionMathBlock(ctx) {
      var context = ctx && ctx.deps !== undefined ? ctx : createGamAssemblyContext(ctx);
      var mathLib = resolveMathLib(context.deps);
      if (mathLib && typeof mathLib.buildLdMathRenderPromptBlock === "function") {
        return mathLib.buildLdMathRenderPromptBlock();
      }
      return "";
    }

    function appendMarkerDeduped(draft, block, markerRe) {
      var body = String(draft || "").trim();
      var add = String(block || "");
      if (!add) return body;
      if (markerRe && markerRe.test(body)) return body;
      return (body + add).trim();
    }

    /**
     * Studio path wrapper scaffolds that are currently observed on the T-002 partial fixture.
     * Additional live scaffolds remain available via adapters.applyStudioRuntimeScaffolds.
     */
    function applyDefaultStudioRuntimeScaffolds(draft, ctx) {
      var context = ctx;
      var body = String(draft || "").trim();
      if (context.adapters && typeof context.adapters.applyStudioRuntimeScaffolds === "function") {
        return String(context.adapters.applyStudioRuntimeScaffolds(body, context) || "").trim();
      }
      if (context.includeStudioEqf) {
        var eqfLib = resolveEqfLib(context.deps);
        if (eqfLib && typeof eqfLib.applyEducationalQualityFrameworkPromptBlockToDraft === "function") {
          body = eqfLib.applyEducationalQualityFrameworkPromptBlockToDraft(body, {
            stepCanonicalStepId: "step_generate_activity_materials",
            stepTitle: context.stepTitle
          });
        }
      }
      if (context.includeStudioMath) {
        var mathLib = resolveMathLib(context.deps);
        var mathBlock =
          mathLib && typeof mathLib.buildLdMathRenderPromptBlock === "function"
            ? mathLib.buildLdMathRenderPromptBlock()
            : "";
        var mathRe =
          mathLib && typeof mathLib.markerRegex === "function"
            ? mathLib.markerRegex()
            : /LD-MATH-RENDER \(auto-applied\)/i;
        body = appendMarkerDeduped(body, mathBlock, mathRe);
      }
      return String(body || "").trim();
    }

    /**
     * Shared GAM graft (Studio inject / normative core append): contract+shape (+ optional
     * non-partial upstream) + single pre-emit gate. Does NOT add Copy-only commission in
     * partial Studio mode.
     */
    function buildGamStudioGraftAppendParts(ctx) {
      var context = ctx && ctx.deps !== undefined ? ctx : createGamAssemblyContext(ctx);
      var parts = [];
      var contractShape = buildSectionOutputContract(context);
      if (contractShape) parts.push(contractShape);
      if (!context.partialMode) {
        var embed = buildSectionUpstreamFullEmbed(context);
        if (embed) parts.push(embed);
      }
      var gate = buildSectionPreEmitGate(context);
      if (gate) parts.push(gate);
      return parts;
    }

    function applyGamStudioGraft(draftText, ctx) {
      var context = ctx && ctx.deps !== undefined ? ctx : createGamAssemblyContext(ctx);
      var draftBody = String(draftText || "").trim();
      var appendParts = [];
      // Match live applyGamPageEnrichPromptBlockToDraft ordering/dedupe.
      if (context.adapters && typeof context.adapters.buildOutputContractAndShape === "function") {
        var combined = String(context.adapters.buildOutputContractAndShape() || "");
        if (
          combined &&
          !/GAM partial-page contract|GAM enrich-in-place contract/i.test(draftBody)
        ) {
          appendParts.push(combined);
        }
      } else {
        var contractMod = resolveContractLib(context.deps);
        if (
          contractMod &&
          typeof contractMod.buildGamPageEnrichContractBlock === "function" &&
          !/GAM partial-page contract|GAM enrich-in-place contract/i.test(draftBody)
        ) {
          var v2Block = contractMod.buildGamPageEnrichContractBlock();
          if (v2Block) appendParts.push(v2Block);
        }
        if (
          contractMod &&
          typeof contractMod.buildCanonicalGamMaterialShapeSnippet === "function" &&
          !/Full-page preservation example/i.test(draftBody)
        ) {
          appendParts.push(contractMod.buildCanonicalGamMaterialShapeSnippet());
        }
      }
      if (!context.partialMode) {
        var pageEmbed = buildSectionUpstreamFullEmbed(context);
        if (pageEmbed && !/### Upstream DLA page/i.test(draftBody)) {
          appendParts.push(pageEmbed);
        }
      }
      var gate = buildSectionPreEmitGate(context);
      if (
        gate &&
        !/FINAL SILENT PRE-EMIT CONSISTENCY CHECK/i.test(draftBody) &&
        !appendParts.some(function (part) {
          return /FINAL SILENT PRE-EMIT CONSISTENCY CHECK/i.test(String(part || ""));
        })
      ) {
        appendParts.push(gate);
      }
      if (!appendParts.length) return draftBody;
      return (draftBody + "\n" + appendParts.join("\n")).trim();
    }

    var COPY_V2_PARTIAL_SECTION_ORDER = Object.freeze([
      "pipeline.open",
      "step.title",
      "copy.mode_framing",
      "output.contract_shape",
      "commission.authority",
      "copy.runner_guidance",
      "copy.input_artefacts",
      "authoring.brief",
      "gate.pre_emit_ensure",
      "completion.override",
      "footer.step_n",
      "post.math",
      "pipeline.close"
    ]);

    var STUDIO_V2_PARTIAL_SECTION_ORDER = Object.freeze([
      "studio.library_body",
      "studio.runtime_scaffolds",
      "output.contract_shape",
      "gate.pre_emit"
    ]);

    function assembleCopyV2(ctx) {
      var context = createGamAssemblyContext(ctx);
      resolveGamPolicyIngress(context); // seam only — no text effect
      var lines = [];
      var sections = {};

      sections["pipeline.open"] = buildSectionPipelineOpening(context);
      lines.push(sections["pipeline.open"]);

      sections["step.title"] = "This step is titled: " + context.stepTitle + ".";
      lines.push(sections["step.title"]);

      lines.push("");
      sections["copy.mode_framing"] = buildSectionCopyModeFraming(context);
      sections["copy.mode_framing"].split("\n").forEach(function (line) {
        lines.push(line);
      });

      var contractShape = buildSectionOutputContract(context);
      sections["output.contract_shape"] = contractShape;
      if (contractShape) {
        lines.push("");
        lines.push(contractShape);
      }

      if (context.partialMode) {
        var commission = buildSectionCommission(context);
        sections["commission.authority"] = commission;
        if (commission) lines.push(commission);
      } else {
        var embed = buildSectionUpstreamFullEmbed(context);
        sections["upstream.full_embed"] = embed;
        if (embed) lines.push(embed);
      }

      var notes = String(context.notes || "").trim();
      if (notes) {
        lines.push("");
        lines.push("How to use inputs for this step (from the workflow designer):");
        lines.push(notes);
      }

      sections["copy.runner_guidance"] = buildSectionRunnerGuidance(context);
      lines.push(sections["copy.runner_guidance"]);

      sections["copy.input_artefacts"] = buildSectionInputArtefacts(context);
      lines.push(sections["copy.input_artefacts"]);

      lines.push("");
      lines.push("Material authoring guidance (Sprint 56F v2 — output shape is defined above):");
      lines.push("");
      var brief = buildSectionAuthoringBrief(context);
      sections["authoring.brief"] = brief;
      lines.push(brief);

      var assembledSoFar = lines.join("\n");
      var gate = buildSectionPreEmitGate(context);
      sections["gate.pre_emit_ensure"] = "";
      if (gate && !/FINAL SILENT PRE-EMIT CONSISTENCY CHECK/i.test(assembledSoFar)) {
        lines.push("");
        lines.push(gate);
        sections["gate.pre_emit_ensure"] = gate;
      }

      lines.push("");
      sections["completion.override"] = buildSectionCompletionOverride(context);
      sections["completion.override"].split("\n").forEach(function (line) {
        lines.push(line);
      });

      lines.push("");
      sections["footer.step_n"] = buildSectionStepFooter(context);
      if (sections["footer.step_n"]) {
        sections["footer.step_n"].split("\n").forEach(function (line) {
          lines.push(line);
        });
      }

      var assembled = lines.join("\n");

      // Post-assembly math (Copy V2) — marker-deduped, before pipeline close.
      sections["post.math"] = "";
      if (context.includeCopyMath) {
        var mathBlock = buildSectionMathBlock(context);
        var mathRe = /LD-MATH-RENDER \(auto-applied\)/i;
        if (mathBlock && !mathRe.test(assembled)) {
          assembled = (assembled + mathBlock).trim();
          sections["post.math"] = mathBlock;
        }
      }

      sections["pipeline.close"] = "";
      if (context.includePipelineClose) {
        sections["pipeline.close"] = buildSectionPipelineCompletion(context);
        assembled = [assembled, "", sections["pipeline.close"]]
          .filter(function (part) {
            return part != null && String(part).length > 0;
          })
          .join("\n");
      }

      return {
        text: assembled,
        sections: sections,
        sectionOrder: context.partialMode
          ? COPY_V2_PARTIAL_SECTION_ORDER.slice()
          : COPY_V2_PARTIAL_SECTION_ORDER.slice()
              .map(function (id) {
                return id === "commission.authority" ? "upstream.full_embed" : id;
              }),
        profile: context.profile,
        liveProduction: LIVE_PRODUCTION,
        assemblerVersion: ASSEMBLER_VERSION,
        policyIngress: resolveGamPolicyIngress(context)
      };
    }

    function assembleStudioV2(ctx) {
      var context = createGamAssemblyContext(ctx);
      resolveGamPolicyIngress(context);
      var sections = {};
      sections["studio.library_body"] = String(context.libraryBody || "").trim();
      var draft = sections["studio.library_body"];
      draft = applyDefaultStudioRuntimeScaffolds(draft, context);
      sections["studio.runtime_scaffolds"] = draft;
      draft = applyGamStudioGraft(draft, context);
      sections["output.contract_shape"] = buildSectionOutputContract(context);
      sections["gate.pre_emit"] = buildSectionPreEmitGate(context);
      return {
        text: String(draft || "").trim(),
        sections: sections,
        sectionOrder: STUDIO_V2_PARTIAL_SECTION_ORDER.slice(),
        profile: context.profile,
        liveProduction: LIVE_PRODUCTION,
        assemblerVersion: ASSEMBLER_VERSION,
        policyIngress: resolveGamPolicyIngress(context)
      };
    }

    function assembleGamCanonicalPrompt(raw) {
      var context = createGamAssemblyContext(raw);
      if (
        context.profile === PROFILES.STUDIO_V2_PARTIAL ||
        context.profile === PROFILES.STUDIO_V2_NONPARTIAL
      ) {
        return assembleStudioV2(context);
      }
      return assembleCopyV2(context);
    }

    function assertGateBeforeCompletionOverride(text) {
      var body = String(text || "");
      var gateIdx = body.search(/FINAL SILENT PRE-EMIT CONSISTENCY CHECK/i);
      var completionIdx = body.search(/GAM completion override/i);
      return gateIdx >= 0 && completionIdx > gateIdx;
    }

    return {
      ASSEMBLER_VERSION: ASSEMBLER_VERSION,
      LIVE_PRODUCTION: LIVE_PRODUCTION,
      GATE_TEXT_SSOT: GATE_TEXT_SSOT,
      PROFILES: PROFILES,
      NEUTRAL_POLICY_INGRESS: NEUTRAL_POLICY_INGRESS,
      COPY_V2_PARTIAL_SECTION_ORDER: COPY_V2_PARTIAL_SECTION_ORDER,
      STUDIO_V2_PARTIAL_SECTION_ORDER: STUDIO_V2_PARTIAL_SECTION_ORDER,
      GAM_AUTHORITATIVE_DLA_COMMISSION_HEADING: GAM_AUTHORITATIVE_DLA_COMMISSION_HEADING,
      createGamAssemblyContext: createGamAssemblyContext,
      resolveGamPolicyIngress: resolveGamPolicyIngress,
      buildSectionOutputContract: buildSectionOutputContract,
      buildSectionPreEmitGate: buildSectionPreEmitGate,
      buildSectionAuthoringBrief: buildSectionAuthoringBrief,
      buildSectionCommission: buildSectionCommission,
      buildSectionUpstreamFullEmbed: buildSectionUpstreamFullEmbed,
      buildSectionCompletionOverride: buildSectionCompletionOverride,
      buildSectionStepFooter: buildSectionStepFooter,
      buildSectionCopyModeFraming: buildSectionCopyModeFraming,
      projectGamAuthoritativeDlaCommissionFromPage: projectGamAuthoritativeDlaCommissionFromPage,
      buildGamStudioGraftAppendParts: buildGamStudioGraftAppendParts,
      applyGamStudioGraft: applyGamStudioGraft,
      assembleCopyV2: assembleCopyV2,
      assembleStudioV2: assembleStudioV2,
      assembleGamCanonicalPrompt: assembleGamCanonicalPrompt,
      assertGateBeforeCompletionOverride: assertGateBeforeCompletionOverride
    };
  }
);
