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

  function normalizeCommissionEnvelope(input) {
    var src = input && typeof input === "object" ? input : {};
    var publishedTitleDirectory = normalizePublishedTitleDirectory(src);
    var commissionPublishedTitles = Array.isArray(src.commissionPublishedTitles)
      ? src.commissionPublishedTitles
      : Array.isArray(src.commission_published_titles)
        ? src.commission_published_titles
        : [];
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
      publishedTitleDirectory: publishedTitleDirectory,
      commissionPublishedTitles: commissionPublishedTitles
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
    var ldCreateOutputType = resolveInteractiveCreateType(familyMod, envelope, opts);
    var startingArtefact = asText(opts.startingArtefact) || "generate_from_topic";

    var built = familyMod.buildFirstClassWorkflowFamily({
      ldCreateOutputType: ldCreateOutputType,
      product: envelope.productId,
      focus: focus,
      startingArtefact: startingArtefact,
      audience: asText(opts.audience),
      scopeScale: asText(opts.scopeScale)
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
        : []
    });

    return {
      ok: true,
      accepted: true,
      unsupported: false,
      productId: envelope.productId,
      productLabel: record.label || envelope.productId,
      envelope: envelope,
      specificationText: envelope.specificationText,
      family: {
        ok: true,
        callsModel: false,
        identity: identity,
        steps: built.steps,
        titles: titles,
        deliverySeed: deliverySeed,
        interactiveMiddle: built.interactiveMiddle || []
      },
      createSeed: {
        ldCreateOutputType: identity.ldCreateOutputType || ldCreateOutputType,
        focus: focus,
        startingArtefact: startingArtefact,
        audience: asText(opts.audience),
        scopeScale: asText(opts.scopeScale),
        inputs: composeInteractiveInputs(envelope),
        scopeConstraints: composeInteractiveConstraints(envelope),
        sourceMaterial: envelope.specificationText,
        journeyContextText: envelope.journeyContextText,
        sourceJourneyWorkflowId: envelope.sourceJourneyWorkflowId,
        sourceCommissionId: envelope.sourceCommissionId,
        publishedTitleDirectory: envelope.publishedTitleDirectory,
        commissionPublishedTitles: Array.isArray(envelope.commissionPublishedTitles)
          ? envelope.commissionPublishedTitles.slice()
          : []
      }
    };
  }

  return {
    normalizeCommissionEnvelope: normalizeCommissionEnvelope,
    productAcceptsCommission: productAcceptsCommission,
    intakeCommission: intakeCommission
  };
});
