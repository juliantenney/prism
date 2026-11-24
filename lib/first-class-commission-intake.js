/**
 * Sprint 91 WP4 — Shared first-class commission intake.
 *
 * Transfers an explicit commission envelope into a commissionable first-class
 * product Create/family path. Does not parse Learning Journey commissioning
 * prose. Does not invent target-product workflow topology.
 */
(function (root, factory) {
  var api = factory(root);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.PRISM_FIRST_CLASS_COMMISSION_INTAKE = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  "use strict";

  function resolveFamilyMod() {
    if (typeof module === "object" && module.exports) {
      try {
        return require("./first-class-workflow-family.js");
      } catch (_err) {}
    }
    if (root && root.PRISM_FIRST_CLASS_WORKFLOW_FAMILY) {
      return root.PRISM_FIRST_CLASS_WORKFLOW_FAMILY;
    }
    if (typeof globalThis !== "undefined" && globalThis.PRISM_FIRST_CLASS_WORKFLOW_FAMILY) {
      return globalThis.PRISM_FIRST_CLASS_WORKFLOW_FAMILY;
    }
    if (typeof window !== "undefined" && window.PRISM_FIRST_CLASS_WORKFLOW_FAMILY) {
      return window.PRISM_FIRST_CLASS_WORKFLOW_FAMILY;
    }
    return null;
  }

  function resolveCommissionNativeLoBind() {
    if (typeof module === "object" && module.exports) {
      try {
        return require("./commission-native-lo-bind.js");
      } catch (_err) {}
    }
    if (root && root.PRISM_COMMISSION_NATIVE_LO_BIND) {
      return root.PRISM_COMMISSION_NATIVE_LO_BIND;
    }
    if (typeof globalThis !== "undefined" && globalThis.PRISM_COMMISSION_NATIVE_LO_BIND) {
      return globalThis.PRISM_COMMISSION_NATIVE_LO_BIND;
    }
    if (typeof window !== "undefined" && window.PRISM_COMMISSION_NATIVE_LO_BIND) {
      return window.PRISM_COMMISSION_NATIVE_LO_BIND;
    }
    return null;
  }

  function asText(value) {
    return String(value == null ? "" : value).trim();
  }

  function normalizeWhitespace(value) {
    return asText(value).replace(/\r\n/g, "\n");
  }

  function productRecord(familyMod, productId) {
    if (!familyMod || typeof familyMod.listFirstClassProducts !== "function") return null;
    var id = asText(productId);
    var list = familyMod.listFirstClassProducts() || [];
    var i;
    for (i = 0; i < list.length; i += 1) {
      if (list[i] && asText(list[i].id) === id) return list[i];
    }
    return null;
  }

  function productAcceptsCommission(productId) {
    var familyMod = resolveFamilyMod();
    if (familyMod && typeof familyMod.productAcceptsCommission === "function") {
      return !!familyMod.productAcceptsCommission(productId);
    }
    var record = productRecord(familyMod, productId);
    return !!(record && record.acceptsCommission === true);
  }

  /**
   * Minimal reusable commission transfer envelope.
   * Only fields with demonstrated transfer value.
   */
  function normalizePublishedTitleDirectory(src) {
    var rawText = asText(
      src.publishedTitleDirectory ||
        src.published_title_directory ||
        src.commissionPublishedTitleDirectory
    );
    if (rawText) return rawText;
    var entries = Array.isArray(src.commissionPublishedTitles)
      ? src.commissionPublishedTitles
      : Array.isArray(src.commission_published_titles)
        ? src.commission_published_titles
        : [];
    if (!entries.length) return "";
    var lines = [];
    var i;
    for (i = 0; i < entries.length; i += 1) {
      var entry = entries[i];
      if (!entry || typeof entry !== "object") continue;
      var commissionId = asText(entry.commissionId || entry.commission_id);
      var title = asText(entry.title);
      if (!commissionId || !title) continue;
      lines.push('- Internal id "' + commissionId + '": published title "' + title + '"');
    }
    if (!lines.length) return "";
    return [
      "PUBLISHED LEARNING JOURNEY RESOURCE TITLES (authoritative for learner-facing cross-resource references)",
      "",
      "Internal commission identifiers may appear in structured metadata such as EDUCATIONAL DEPENDENCIES.",
      "Learner-facing prose must use the published titles below — never bare identifiers such as c1 or c4.",
      ""
    ]
      .concat(lines)
      .join("\n");
  }

  function normalizeRequiredLearnerArtefacts(src) {
    var rows = Array.isArray(src.requiredLearnerArtefacts)
      ? src.requiredLearnerArtefacts
      : Array.isArray(src.required_learner_artefacts)
        ? src.required_learner_artefacts
        : [];
    var out = [];
    var seen = Object.create(null);
    var i;
    for (i = 0; i < rows.length; i += 1) {
      var row = rows[i];
      if (!row || typeof row !== "object") continue;
      var elicitationId = asText(row.elicitationId || row.elicitation_id);
      var artefactId = asText(row.artefactId || row.artefact_id);
      if (!elicitationId) continue;
      if (seen[elicitationId]) continue;
      seen[elicitationId] = true;
      var responseKind = asText(row.responseKind || row.response_kind).toLowerCase();
      if (responseKind && responseKind !== "constructed_text") continue;
      out.push({
        artefactId: artefactId || elicitationId,
        elicitationId: elicitationId,
        entryId: asText(row.entryId || row.entry_id),
        title: asText(row.title),
        framing: asText(row.framing),
        responseKind: "constructed_text"
      });
    }
    return out;
  }

  function normalizeStructuredPositiveMinutes(raw) {
    if (raw === undefined || raw === null) {
      return { present: false, valid: true, value: null };
    }
    if (typeof raw !== "number" || !isFinite(raw) || raw <= 0 || Math.floor(raw) !== raw) {
      return { present: true, valid: false, value: null };
    }
    return { present: true, valid: true, value: raw };
  }

  function resolveEnvelopeAllocatedMinutes(src) {
    var row = src && typeof src === "object" ? src : {};
    var upstreamError = asText(row.allocatedMinutesError);
    if (upstreamError) {
      return {
        allocatedMinutes: null,
        sourceField: asText(row.allocatedMinutesSourceField),
        error: upstreamError
      };
    }
    var candidates = [
      { key: "allocatedMinutes", val: row.allocatedMinutes },
      { key: "allocated_minutes", val: row.allocated_minutes },
      { key: "commissionedDurationMinutes", val: row.commissionedDurationMinutes },
      { key: "commissioned_duration_minutes", val: row.commissioned_duration_minutes },
      { key: "durationMinutes", val: row.durationMinutes },
      { key: "duration_minutes", val: row.duration_minutes }
    ];
    var validEntries = [];
    var i;
    for (i = 0; i < candidates.length; i += 1) {
      var c = candidates[i];
      if (c.val === undefined || c.val === null) continue;
      var check = normalizeStructuredPositiveMinutes(c.val);
      if (!check.valid) {
        return {
          allocatedMinutes: null,
          sourceField: c.key,
          error: "invalid_allocated_minutes"
        };
      }
      validEntries.push({ key: c.key, value: check.value });
    }
    if (!validEntries.length) {
      return {
        allocatedMinutes: null,
        sourceField: "",
        error: ""
      };
    }
    var canonical = validEntries[0];
    for (i = 1; i < validEntries.length; i += 1) {
      if (validEntries[i].value !== canonical.value) {
        return {
          allocatedMinutes: null,
          sourceField: canonical.key,
          error: "commission_duration_conflict"
        };
      }
    }
    return {
      allocatedMinutes: canonical.value,
      sourceField: asText(row.allocatedMinutesSourceField) || canonical.key,
      error: ""
    };
  }

  function normalizeCommissionEnvelope(input) {
    var src = input && typeof input === "object" ? input : {};
    var publishedTitleDirectory = normalizePublishedTitleDirectory(src);
    var commissionPublishedTitles = Array.isArray(src.commissionPublishedTitles)
      ? src.commissionPublishedTitles
      : Array.isArray(src.commission_published_titles)
        ? src.commission_published_titles
        : [];
    var dur = resolveEnvelopeAllocatedMinutes(src);
    var journeyMinCheck = normalizeStructuredPositiveMinutes(
      src.journeyAllocatedMinutes != null
        ? src.journeyAllocatedMinutes
        : src.journey_allocated_minutes
    );
    return {
      productId: asText(src.productId || src.product_id),
      specificationText: normalizeWhitespace(src.specificationText || src.specification_text),
      focus: asText(src.focus || src.topic),
      sourceContext: asText(src.sourceContext || src.source_context),
      constraints: asText(src.constraints),
      dependencies: asText(src.dependencies),
      journeyContextText: normalizeWhitespace(
        src.journeyContextText || src.journey_context_text || src.journeyContext
      ),
      sourceJourneyWorkflowId: asText(
        src.sourceJourneyWorkflowId || src.source_journey_workflow_id
      ),
      sourceCommissionId: asText(src.sourceCommissionId || src.source_commission_id),
      allocatedMinutes: dur.allocatedMinutes,
      allocatedMinutesSourceField: dur.sourceField,
      allocatedMinutesError: dur.error,
      journeyAllocatedMinutes: journeyMinCheck.valid ? journeyMinCheck.value : null,
      publishedTitleDirectory: publishedTitleDirectory,
      commissionPublishedTitles: commissionPublishedTitles,
      requiredLearnerArtefacts: normalizeRequiredLearnerArtefacts(src),
      componentLearningOutcomes:
        src.componentLearningOutcomes != null
          ? src.componentLearningOutcomes
          : src.component_learning_outcomes != null
            ? src.component_learning_outcomes
            : src.learning_outcomes != null
              ? src.learning_outcomes
              : null
    };
  }

  function unsupportedResult(familyMod, envelope, code, detail) {
    var record = productRecord(familyMod, envelope.productId);
    return {
      ok: false,
      accepted: false,
      unsupported: true,
      code: code || "commission_unsupported",
      detail: asText(detail),
      productId: envelope.productId,
      productLabel: record && record.label ? String(record.label) : "",
      envelope: envelope,
      // Authoritative specification is preserved even when intake cannot proceed.
      specificationText: envelope.specificationText
    };
  }

  function resolveInteractiveCreateType(familyMod, envelope, options) {
    var opts = options && typeof options === "object" ? options : {};
    var raw = asText(opts.ldCreateOutputType || opts.variant || envelope.variant);
    if (raw === "workshop") return "workshop";
    if (familyMod && familyMod.LD_WORKSHOP && raw === familyMod.LD_WORKSHOP) return "workshop";
    return "self_study_resource";
  }

  function composeInteractiveInputs(envelope) {
    var parts = [];
    if (envelope.specificationText) {
      parts.push("COMMISSION SPECIFICATION\n" + envelope.specificationText);
    }
    if (envelope.sourceContext) {
      parts.push("SOURCE CONTEXT\n" + envelope.sourceContext);
    }
    return parts.join("\n\n");
  }

  function composeInteractiveConstraints(envelope) {
    var parts = [];
    if (envelope.constraints) parts.push(envelope.constraints);
    if (envelope.dependencies) parts.push("Dependencies: " + envelope.dependencies);
    return parts.join("\n").trim();
  }

  /**
   * Resolve a commission envelope through family-declared commissionability
   * and, when accepted, initialise the target product via buildFirstClassWorkflowFamily.
   */
  function intakeCommission(input, options) {
    var familyMod = resolveFamilyMod();
    var envelope = normalizeCommissionEnvelope(input);
    var opts = options && typeof options === "object" ? options : {};

    if (!envelope.productId) {
      return unsupportedResult(familyMod, envelope, "product_id_required", "A target productId is required.");
    }
    if (!envelope.specificationText) {
      return unsupportedResult(
        familyMod,
        envelope,
        "specification_required",
        "Authoritative commission specificationText is required."
      );
    }
    if (envelope.allocatedMinutesError) {
      return {
        ok: false,
        accepted: false,
        unsupported: false,
        code: envelope.allocatedMinutesError,
        detail:
          envelope.allocatedMinutesError === "commission_duration_conflict"
            ? "Commission duration fields conflict and cannot be silently resolved."
            : envelope.allocatedMinutesError === "journey_duration_conflict"
              ? "Commission journey_allocated_minutes conflicts with authoritative parent Learning Journey allocation."
              : envelope.allocatedMinutesError === "commission_duration_missing_required"
                ? "Structured allocated_minutes is required for newly authored Learning Journey commissions (prose fallback is not permitted)."
                : "Structured allocated_minutes must be a positive integer (prose fallback is not permitted).",
        envelope: envelope,
        specificationText: envelope.specificationText
      };
    }

    var effectiveAllocatedMinutes = envelope.allocatedMinutes;
    if (opts.authoritativeAllocatedMinutes != null) {
      var authOptCheck = normalizeStructuredPositiveMinutes(opts.authoritativeAllocatedMinutes);
      if (!authOptCheck.valid) {
        return {
          ok: false,
          accepted: false,
          unsupported: false,
          code: "invalid_allocated_minutes",
          detail: "Authoritative allocated minutes option must be a positive integer.",
          envelope: envelope,
          specificationText: envelope.specificationText
        };
      }
      if (effectiveAllocatedMinutes != null && effectiveAllocatedMinutes !== authOptCheck.value) {
        return {
          ok: false,
          accepted: false,
          unsupported: false,
          code: "commission_duration_conflict",
          detail:
            "Envelope allocatedMinutes (" +
            effectiveAllocatedMinutes +
            ") conflicts with authoritative allocated minutes (" +
            authOptCheck.value +
            ").",
          envelope: envelope,
          specificationText: envelope.specificationText
        };
      }
      if (effectiveAllocatedMinutes == null) {
        effectiveAllocatedMinutes = authOptCheck.value;
      }
    }

    if (
      opts.requireStructuredDuration === true &&
      effectiveAllocatedMinutes == null &&
      envelope.productId !== "interactive"
    ) {
      return {
        ok: false,
        accepted: false,
        unsupported: false,
        code: "commission_duration_missing_required",
        detail:
          "Structured allocated_minutes is required for newly authored Learning Journey commissions (prose fallback is not permitted).",
        envelope: envelope,
        specificationText: envelope.specificationText
      };
    }

    var durationProvenance =
      effectiveAllocatedMinutes != null
        ? {
            authority: "learning_journey_commission",
            source_field: envelope.allocatedMinutesSourceField || "allocated_minutes",
            allocated_minutes: effectiveAllocatedMinutes,
            source_commission_id: envelope.sourceCommissionId || "",
            source_journey_workflow_id: envelope.sourceJourneyWorkflowId || ""
          }
        : null;

    var record = productRecord(familyMod, envelope.productId);
    if (!record) {
      return unsupportedResult(
        familyMod,
        envelope,
        "unknown_product",
        "Product is not a registered first-class product."
      );
    }
    if (!productAcceptsCommission(envelope.productId)) {
      return unsupportedResult(
        familyMod,
        envelope,
        "product_not_commissionable",
        "Product is registered but does not declare acceptsCommission."
      );
    }

    if (!familyMod || typeof familyMod.buildFirstClassWorkflowFamily !== "function") {
      return unsupportedResult(
        familyMod,
        envelope,
        "family_module_unavailable",
        "First-class family module is unavailable."
      );
    }

    var focus =
      envelope.focus ||
      (envelope.specificationText.length > 120
        ? envelope.specificationText.slice(0, 117).trim() + "…"
        : envelope.specificationText);
    var ldCreateOutputType;
    if (envelope.productId === "practice") {
      // Practice is LJ-commissioned only; do not inherit Interactive self_study/workshop variants.
      ldCreateOutputType =
        asText(opts.ldCreateOutputType) ||
        (familyMod && familyMod.LD_PRACTICE) ||
        "practice";
    } else {
      ldCreateOutputType = resolveInteractiveCreateType(familyMod, envelope, opts);
    }
    var startingArtefact = asText(opts.startingArtefact) || "generate_from_topic";

    var built = familyMod.buildFirstClassWorkflowFamily({
      ldCreateOutputType: ldCreateOutputType,
      product: envelope.productId,
      focus: focus,
      startingArtefact: startingArtefact,
      audience: asText(opts.audience),
      scopeScale: asText(opts.scopeScale),
      allocatedMinutes: effectiveAllocatedMinutes,
      allocatedMinutesProvenance: durationProvenance
    });

    if (!built || !built.ok) {
      return {
        ok: false,
        accepted: false,
        unsupported: false,
        code: (built && built.code) || "family_build_failed",
        envelope: envelope,
        specificationText: envelope.specificationText
      };
    }

    var titles = Array.isArray(built.titles) ? built.titles.slice() : [];
    var hasJourneyStage = titles.some(function (title) {
      return /^journey\s/i.test(String(title || ""));
    });
    if (hasJourneyStage || asText(built.identity && built.identity.product) !== envelope.productId) {
      return {
        ok: false,
        accepted: false,
        unsupported: false,
        code: "topology_integrity_failed",
        envelope: envelope,
        specificationText: envelope.specificationText
      };
    }

    var identity = Object.assign({}, built.identity);
    if (envelope.sourceJourneyWorkflowId) {
      identity.sourceWorkflowId = envelope.sourceJourneyWorkflowId;
    }
    if (envelope.sourceCommissionId) {
      identity.sourceCommissionId = envelope.sourceCommissionId;
    }

    var finalTitles = titles;
    var finalSteps = Array.isArray(built.steps) ? built.steps.slice() : [];
    var commissionNativeBound = false;
    var bindMod = resolveCommissionNativeLoBind();
    var bindResult =
      bindMod && typeof bindMod.tryBindCommissionNativeLos === "function"
        ? bindMod.tryBindCommissionNativeLos(
            envelope.specificationText,
            envelope.journeyContextText,
            {
              structuredComponentLearningOutcomes: envelope.componentLearningOutcomes
            }
          )
        : { ok: false, bound: false, reason: "bind_module_unavailable" };

    if (bindResult && bindResult.bound && bindResult.componentLearningOutcomes) {
      var topo =
        typeof bindMod.applyCommissionNativeTopology === "function"
          ? bindMod.applyCommissionNativeTopology(
              { titles: finalTitles, steps: finalSteps },
              envelope.productId
            )
          : { titles: finalTitles, steps: finalSteps };
      finalTitles = topo.titles || finalTitles;
      finalSteps = topo.steps || finalSteps;
      commissionNativeBound = true;
    }

    var deliverySeed = Object.assign({}, built.deliverySeed || {}, {
      topic: focus,
      commission_specification: envelope.specificationText,
      journey_context: envelope.journeyContextText,
      // Educational handoff note from LJ commission.dependencies (not a runtime graph).
      commission_dependencies: envelope.dependencies,
      source_journey_workflow_id: envelope.sourceJourneyWorkflowId,
      source_commission_id: envelope.sourceCommissionId,
      commission_product_id: envelope.productId,
      commission_published_titles: envelope.publishedTitleDirectory,
      commission_published_title_entries: Array.isArray(envelope.commissionPublishedTitles)
        ? envelope.commissionPublishedTitles.slice()
        : [],
      required_learner_artefacts: Array.isArray(envelope.requiredLearnerArtefacts)
        ? envelope.requiredLearnerArtefacts.slice()
        : []
    });
    // Authoritative shared source from parent Learning Journey (optional).
    // Kept separate from commission_specification / journey_context.
    if (envelope.sourceContext) {
      deliverySeed.source_context = envelope.sourceContext;
    }
    if (effectiveAllocatedMinutes != null) {
      deliverySeed.commissioned_duration_minutes = effectiveAllocatedMinutes;
      deliverySeed.duration_minutes = effectiveAllocatedMinutes;
      deliverySeed.commissioned_duration_provenance = durationProvenance;
    }
    if (envelope.journeyAllocatedMinutes != null) {
      deliverySeed.journey_allocated_minutes = envelope.journeyAllocatedMinutes;
    }
    if (commissionNativeBound) {
      deliverySeed.commission_native_lo_bound = true;
      deliverySeed.commissioned_learning_outcomes = bindResult.componentLearningOutcomes;
      deliverySeed.commissioned_learning_outcomes_provenance = bindResult.provenance;
      if (bindResult.journeyLearningOutcomes) {
        deliverySeed.journey_learning_outcomes = bindResult.journeyLearningOutcomes;
      }
    }

    return {
      ok: true,
      accepted: true,
      unsupported: false,
      productId: envelope.productId,
      productLabel: record.label || envelope.productId,
      envelope: envelope,
      specificationText: envelope.specificationText,
      commissionNativeBound: commissionNativeBound,
      commissionNativeBindReason: (bindResult && bindResult.reason) || "",
      commissionNativeBindErrors:
        bindResult && Array.isArray(bindResult.errors) ? bindResult.errors.slice() : [],
      family: {
        ok: true,
        callsModel: false,
        identity: identity,
        steps: finalSteps,
        titles: finalTitles,
        deliverySeed: deliverySeed,
        interactiveMiddle: built.interactiveMiddle || [],
        commissionNativeBound: commissionNativeBound
      },
      createSeed: {
        ldCreateOutputType: identity.ldCreateOutputType || ldCreateOutputType,
        focus: focus,
        startingArtefact: startingArtefact,
        audience: asText(opts.audience),
        scopeScale: asText(opts.scopeScale),
        inputs: composeInteractiveInputs(envelope),
        scopeConstraints: composeInteractiveConstraints(envelope),
        // Prefer shared corpus when present; otherwise keep prior behaviour
        // (specification used as Create sourceMaterial for non-shared commissions).
        sourceMaterial: envelope.sourceContext || envelope.specificationText,
        sourceContext: envelope.sourceContext,
        journeyContextText: envelope.journeyContextText,
        sourceJourneyWorkflowId: envelope.sourceJourneyWorkflowId,
        sourceCommissionId: envelope.sourceCommissionId,
        publishedTitleDirectory: envelope.publishedTitleDirectory,
        commissionPublishedTitles: Array.isArray(envelope.commissionPublishedTitles)
          ? envelope.commissionPublishedTitles.slice()
          : [],
        requiredLearnerArtefacts: Array.isArray(envelope.requiredLearnerArtefacts)
          ? envelope.requiredLearnerArtefacts.slice()
          : [],
        allocatedMinutes: effectiveAllocatedMinutes,
        commissionedDurationMinutes: effectiveAllocatedMinutes,
        commissionedDurationProvenance: durationProvenance,
        journeyAllocatedMinutes: envelope.journeyAllocatedMinutes,
        commissionNativeBound: commissionNativeBound,
        commissionedLearningOutcomes: commissionNativeBound
          ? bindResult.componentLearningOutcomes
          : null,
        commissionedLearningOutcomesProvenance: commissionNativeBound
          ? bindResult.provenance
          : null
      }
    };
  }

  return {
    normalizeCommissionEnvelope: normalizeCommissionEnvelope,
    productAcceptsCommission: productAcceptsCommission,
    intakeCommission: intakeCommission,
    // Exposed for diagnostics / tests: whether browser root has bind module.
    resolveCommissionNativeLoBind: resolveCommissionNativeLoBind
  };
});
