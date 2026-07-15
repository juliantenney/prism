/**
 * Canonical workflow-step recognition context for Sprint 59+ GAM Copy / routing gates.
 * Accepts raw step rows ({ title, canonical_step_id }) and shaped prompt contexts
 * ({ stepTitle, stepCanonicalStepId }) without maintaining diverging call-site shapes.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_WORKFLOW_STEP_RECOGNITION_CONTEXT = api;
  }
})(
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this,
  function () {
    "use strict";

    function nonEmptyString(value) {
      return String(value == null ? "" : value).trim();
    }

    function readLiCanonicalStepId(li) {
      if (!li || typeof li.getAttribute !== "function") return "";
      return nonEmptyString(li.getAttribute("data-canonical-step-id"));
    }

    /**
     * @param {object} step Raw step row and/or shaped recognition fields.
     * @param {object} [options]
     * @param {Element} [options.li]
     * @param {number} [options.index]
     */
    function buildWorkflowStepRecognitionContext(step, options) {
      var opts = options && typeof options === "object" ? options : {};
      var row = step && typeof step === "object" ? step : {};
      var title = nonEmptyString(
        row.stepCanonicalTitle ||
          row.stepTitle ||
          row.canonical_title ||
          row.title ||
          row.name
      );
      var canonical = nonEmptyString(
        row.stepCanonicalStepId ||
          row.canonical_step_id ||
          row.canonicalStepId ||
          readLiCanonicalStepId(opts.li || opts.domElement)
      );
      var outputName = nonEmptyString(row.stepOutputName || row.outputName);
      return {
        stepTitle: title,
        stepCanonicalTitle: title,
        stepCanonicalStepId: canonical,
        stepOutputName: outputName,
        stepIndex: typeof opts.index === "number" ? opts.index : undefined,
        // Dual-shape fields so callers/gates that read raw keys also succeed.
        title: title,
        canonical_step_id: canonical,
        canonicalStepId: canonical,
        outputName: outputName
      };
    }

    function isGenerateActivityMaterialsRecognition(context) {
      var ctx = context && typeof context === "object" ? context : {};
      var title = nonEmptyString(
        ctx.stepCanonicalTitle || ctx.stepTitle || ctx.title || ctx.name
      ).toLowerCase();
      var canonicalId = nonEmptyString(
        ctx.stepCanonicalStepId || ctx.canonical_step_id || ctx.canonicalStepId
      ).toLowerCase();
      return (
        canonicalId === "step_generate_activity_materials" ||
        canonicalId === "generate_activity_materials" ||
        title === "generate activity materials" ||
        title.indexOf("generate activity material") !== -1
      );
    }

    return {
      buildWorkflowStepRecognitionContext: buildWorkflowStepRecognitionContext,
      isGenerateActivityMaterialsRecognition: isGenerateActivityMaterialsRecognition
    };
  }
);
