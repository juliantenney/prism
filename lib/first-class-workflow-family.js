/**
 * Sprint 88 — documented first-class workflow families.
 * Local instantiation only. Does not call a model and does not rewrite stored graphs.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.PRISM_FIRST_CLASS_WORKFLOW_FAMILY = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var LD_SELF_STUDY = "self_study_resource";
  var LD_WORKSHOP = "workshop";
  var LD_EXPOSITORY = "expository_resource";

  var INTERACTIVE_TITLES = [
    "Generate Learning Content",
    "Model Knowledge",
    "Define Learning Outcomes",
    "Design Episode Plan",
    "Design Learning Activities",
    "Generate Activity Materials",
    "Construct Learning Sequence",
    "Design Page"
  ];

  var EXPOSITORY_TITLES = [
    "Generate Learning Content",
    "Model Knowledge",
    "Define Learning Outcomes",
    "Expository Journey Plan",
    "Expository Development",
    "Expository Materials",
    "Design Page"
  ];

  var INTERACTIVE_MIDDLE = [
    "Design Episode Plan",
    "Design Learning Activities",
    "Generate Activity Materials",
    "Construct Learning Sequence"
  ];

  function asTrimmed(value) {
    return String(value == null ? "" : value).trim();
  }

  function mirrorLdCreateOutputType(identity) {
    if (!identity || identity.product === "expository") return LD_EXPOSITORY;
    if (identity.variant === "workshop") return LD_WORKSHOP;
    if (identity.variant === "self_study") return LD_SELF_STUDY;
    return "";
  }

  function identityFromLdCreateOutputType(kind) {
    var normalized = asTrimmed(kind);
    if (normalized === LD_SELF_STUDY) {
      return { product: "interactive", variant: "self_study" };
    }
    if (normalized === LD_WORKSHOP) {
      return { product: "interactive", variant: "workshop" };
    }
    if (normalized === LD_EXPOSITORY) {
      return { product: "expository", variant: "" };
    }
    return null;
  }

  /**
   * Read identity without mutating the workflow.
   * Stored product/variant/startingPoint win. Otherwise map legacy ldCreateOutputType.
   * Absent legacy type does not invent a product.
   */
  function readFirstClassIdentity(workflow) {
    var wf = workflow && typeof workflow === "object" ? workflow : {};
    var product = asTrimmed(wf.product);
    if (product === "interactive" || product === "expository") {
      return {
        product: product,
        variant: product === "interactive" ? asTrimmed(wf.variant) : "",
        startingPoint: asTrimmed(wf.startingPoint),
        ldCreateOutputType: asTrimmed(wf.ldCreateOutputType),
        source: "stored"
      };
    }
    var fromLegacy = identityFromLdCreateOutputType(wf.ldCreateOutputType);
    if (!fromLegacy) {
      return {
        product: "",
        variant: "",
        startingPoint: "",
        ldCreateOutputType: asTrimmed(wf.ldCreateOutputType),
        source: "unknown"
      };
    }
    return {
      product: fromLegacy.product,
      variant: fromLegacy.variant,
      startingPoint: asTrimmed(wf.startingPoint),
      ldCreateOutputType: asTrimmed(wf.ldCreateOutputType),
      source: "legacy_ldCreateOutputType"
    };
  }

  function normalizeStartingPoint(raw) {
    var value = asTrimmed(raw);
    if (value === "topic" || value === "generate_from_topic") return "topic";
    if (
      value === "authoritative_source" ||
      value === "provided_source_content" ||
      value === "mixed"
    ) {
      return "authoritative_source";
    }
    return "";
  }

  function deliverySeedForIdentity(identity) {
    if (!identity) return {};
    if (identity.product === "expository") {
      return {
        delivery_context: "self_directed",
        delivery_mode: "async",
        delivery_pattern: "mostly_online",
        page_profile: "learner",
        activities_required: false,
        materials_required: false,
        design_scope: "session",
        session_materials: ["page"]
      };
    }
    if (identity.variant === "workshop") {
      return {
        delivery_mode: "live_workshop",
        delivery_context: "in_person",
        delivery_pattern: "face_to_face",
        learning_environments: ["classroom"],
        design_scope: "session",
        session_materials: ["page"]
      };
    }
    return {
      delivery_context: "self_directed",
      delivery_mode: "async",
      delivery_pattern: "mostly_online",
      page_profile: "learner",
      design_scope: "session",
      session_materials: ["page"]
    };
  }

  function buildFirstClassWorkflowFamily(input) {
    var opts = input && typeof input === "object" ? input : {};
    var fromType = identityFromLdCreateOutputType(opts.ldCreateOutputType);
    var product = asTrimmed(opts.product) || (fromType && fromType.product) || "";
    var variant = asTrimmed(opts.variant);
    if (!variant && fromType) variant = fromType.variant;
    var startingPoint = normalizeStartingPoint(opts.startingPoint || opts.startingArtefact);
    var focus = asTrimmed(opts.focus);

    if (product !== "interactive" && product !== "expository") {
      return { ok: false, code: "unknown_product" };
    }
    if (product === "interactive" && variant !== "self_study" && variant !== "workshop") {
      return { ok: false, code: "variant_required" };
    }
    if (product === "expository") variant = "";
    if (!focus) return { ok: false, code: "focus_required" };
    if (!startingPoint) return { ok: false, code: "starting_point_required" };

    var identity = {
      product: product,
      variant: variant,
      startingPoint: startingPoint
    };
    identity.ldCreateOutputType = mirrorLdCreateOutputType(identity);

    var titles = product === "expository" ? EXPOSITORY_TITLES.slice() : INTERACTIVE_TITLES.slice();
    if (startingPoint === "authoritative_source") {
      titles.unshift("Normalize Content");
    }
    var steps = titles.map(function (title) {
      return { title: title, role: "" };
    });
    var deliverySeed = deliverySeedForIdentity(identity);
    deliverySeed.topic = focus;
    if (opts.learnerLevel) deliverySeed.learner_level = asTrimmed(opts.learnerLevel);
    if (opts.audience) deliverySeed.audience = asTrimmed(opts.audience);
    if (opts.scopeScale) deliverySeed.scope_scale = asTrimmed(opts.scopeScale);

    return {
      ok: true,
      callsModel: false,
      identity: identity,
      steps: steps,
      titles: titles,
      deliverySeed: deliverySeed,
      interactiveMiddle: INTERACTIVE_MIDDLE.slice()
    };
  }

  return {
    LD_SELF_STUDY: LD_SELF_STUDY,
    LD_WORKSHOP: LD_WORKSHOP,
    LD_EXPOSITORY: LD_EXPOSITORY,
    INTERACTIVE_TITLES: INTERACTIVE_TITLES.slice(),
    EXPOSITORY_TITLES: EXPOSITORY_TITLES.slice(),
    readFirstClassIdentity: readFirstClassIdentity,
    buildFirstClassWorkflowFamily: buildFirstClassWorkflowFamily,
    normalizeStartingPoint: normalizeStartingPoint
  };
});
