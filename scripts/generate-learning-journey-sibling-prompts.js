/**
 * One-shot generator: port authenticated Journey Prototype prompt bodies into
 * lib/learning-journey-sibling-prompts.js (top-level current body only).
 */
const fs = require("fs");
const path = require("path");

const exportPath = path.join(
  __dirname,
  "..",
  "docs/development/sprints/2026-10-06-sprint-91-learning-journey-first-class-implementation/JOURNEY-PROTOTYPE-AUTHENTICATED-EXPORT.json"
);
const outPath = path.join(__dirname, "..", "lib/learning-journey-sibling-prompts.js");
const j = JSON.parse(fs.readFileSync(exportPath, "utf8"));
const byTitle = {};
j.prompts.forEach(function (p) {
  byTitle[p.title] = p.body;
});

const required = [
  "JourneyRequirements",
  "JourneyProgression",
  "JourneyElements",
  "JourneyCommissioning"
];
required.forEach(function (title) {
  if (!byTitle[title]) throw new Error("Missing prompt: " + title);
});

const designPageStub =
  "Deterministic Learning Journey Design Page assembly (local; no model).\n" +
  "PRISM assembles the author-facing Design Page from learning_requirements, learning_progression, learning_elements, and learning_commissions.\n" +
  "Do not invent new educational reasoning.";

const moduleSource = `/**
 * Sprint 91 WP2 — Learning Journey sibling prompt bodies.
 * Ported from JOURNEY-PROTOTYPE-AUTHENTICATED-EXPORT.json top-level current body only.
 * Do not reconstruct from docs or historical versions[].
 */

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.PrismLearningJourneySiblingPrompts = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var AUTHENTICATED_EXPORT =
    "docs/development/sprints/2026-10-06-sprint-91-learning-journey-first-class-implementation/JOURNEY-PROTOTYPE-AUTHENTICATED-EXPORT.json";

  var TEMPLATES = {
    learning_requirements: ${JSON.stringify(byTitle.JourneyRequirements)},
    learning_progression: ${JSON.stringify(byTitle.JourneyProgression)},
    learning_elements: ${JSON.stringify(byTitle.JourneyElements)},
    learning_commissions: ${JSON.stringify(byTitle.JourneyCommissioning)},
    design_page: ${JSON.stringify(designPageStub)}
  };

  var CANONICAL_TO_STAGE = {
    step_journey_requirements: "learning_requirements",
    step_journey_progression: "learning_progression",
    step_journey_elements: "learning_elements",
    step_journey_commissioning: "learning_commissions",
    step_design_page: "design_page"
  };

  function resolveStageFromStepIdentity(src) {
    src = src && typeof src === "object" ? src : {};
    var canonical = String(src.canonical_step_id || src.canonicalStepId || "")
      .trim()
      .toLowerCase();
    if (CANONICAL_TO_STAGE[canonical]) return CANONICAL_TO_STAGE[canonical];
    var outputName = String(src.outputName || src.output_name || "")
      .trim()
      .toLowerCase();
    if (outputName === "learning_requirements") return "learning_requirements";
    if (outputName === "learning_progression") return "learning_progression";
    if (outputName === "learning_elements") return "learning_elements";
    if (outputName === "learning_commissions") return "learning_commissions";
    if (outputName === "learning_journey_page" || outputName === "page") return "design_page";
    var title = String(src.title || src.stepTitle || "")
      .trim()
      .toLowerCase();
    if (
      title === "requirements" ||
      title.indexOf("journey requirements") !== -1 ||
      title === "journeyrequirements"
    ) {
      return "learning_requirements";
    }
    if (
      title === "progression" ||
      title.indexOf("journey progression") !== -1 ||
      title === "journeyprogression"
    ) {
      return "learning_progression";
    }
    if (
      title === "elements" ||
      title.indexOf("journey elements") !== -1 ||
      title === "journeyelements"
    ) {
      return "learning_elements";
    }
    if (
      title === "commissioning" ||
      title.indexOf("journey commission") !== -1 ||
      title === "journeycommission" ||
      title === "journeycommissioning"
    ) {
      return "learning_commissions";
    }
    if (title.indexOf("design page") !== -1) return "design_page";
    return "";
  }

  function resolveTemplate(stageOrStep) {
    var stage =
      typeof stageOrStep === "string"
        ? String(stageOrStep).trim().toLowerCase()
        : resolveStageFromStepIdentity(stageOrStep);
    if (!stage) return "";
    return String(TEMPLATES[stage] || "").trim();
  }

  return {
    AUTHENTICATED_EXPORT: AUTHENTICATED_EXPORT,
    TEMPLATES: TEMPLATES,
    CANONICAL_TO_STAGE: CANONICAL_TO_STAGE,
    resolveStageFromStepIdentity: resolveStageFromStepIdentity,
    resolveTemplate: resolveTemplate
  };
});
`;

fs.writeFileSync(outPath, moduleSource);
console.log("wrote", outPath, fs.statSync(outPath).size);
