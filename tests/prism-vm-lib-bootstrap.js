/**
 * Load PRISM lib scripts into a vm sandbox before app.js (Node tests + probes).
 */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const DEFAULT_LIBS = [
  "lib/sprint38-visual-affordances.js",
  "lib/gam-output-format.js",
  "lib/ld-table-fidelity.js",
  "lib/ld-materials-copy.js",
  "lib/ld-math-render.js",
  "lib/ld-self-directed-rhetoric.js",
  "lib/ld-authorial-exposition.js",
  "lib/ld-journey-assimilation.js",
  "lib/ld-activity-preamble-exposition.js",
  "lib/ld-cognition-orientation.js",
  "lib/ld-guided-learning-scaffold.js",
  "lib/ld-design-page-compose-contract.js",
  "lib/ld-design-page-partial-contract.js",
  "lib/ld-thin-assembly-coherence.js",
  "lib/page-activity-field-preserve.js",
  "lib/page-gam-materials-preserve.js",
  "lib/page-render-normalize.js",
  "lib/ld-instructional-manifestation-render.js",
  "lib/ld-pedagogic-salience-render.js",
  "lib/beat-material-registry.js",
  "lib/utility-pedagogical-icons.js",
  "lib/utility-pedagogical-beats.js",
  "lib/educational-quality-framework-prompt.js",
  "lib/instructional-pattern-prompt.js"
];

function runPrismLibScriptsInSandbox(sandbox, repoRoot, libs) {
  const root = repoRoot || path.resolve(__dirname, "..");
  const list = Array.isArray(libs) && libs.length ? libs : DEFAULT_LIBS;
  list.forEach(function (rel) {
    const filePath = path.join(root, rel);
    vm.runInContext(fs.readFileSync(filePath, "utf8"), sandbox, { filename: rel });
  });
  if (sandbox.window) {
    [
      "PRISM_GAM_OUTPUT_FORMAT",
      "PRISM_LD_TABLE_FIDELITY",
      "PRISM_LD_MATERIALS_COPY",
      "PRISM_LD_MATH_RENDER",
      "PRISM_LD_SELF_DIRECTED_RHETORIC",
      "PRISM_LD_AUTHORIAL_EXPOSITION",
      "PRISM_LD_JOURNEY_ASSIMILATION",
      "PRISM_LD_ACTIVITY_PREAMBLE_EXPOSITION",
      "PRISM_LD_COGNITION_ORIENTATION",
      "PRISM_LD_GUIDED_LEARNING_SCAFFOLD",
      "PRISM_LD_DESIGN_PAGE_COMPOSE_CONTRACT",
      "PRISM_LD_DESIGN_PAGE_PARTIAL_CONTRACT",
      "PRISM_LD_THIN_ASSEMBLY_COHERENCE",
      "PRISM_PAGE_ACTIVITY_FIELD_PRESERVE",
      "PRISM_PAGE_GAM_MATERIALS_PRESERVE",
      "PRISM_PAGE_RENDER_NORMALIZE",
      "PRISM_LD_INSTRUCTIONAL_MANIFESTATION_RENDER",
      "PRISM_LD_PEDAGOGIC_SALIENCE_RENDER",
      "PRISM_UTILITY_PEDAGOGICAL_ICONS",
      "PRISM_UTILITY_PEDAGOGICAL_BEATS",
      "PRISM_BEAT_MATERIAL_REGISTRY",
      "PRISM_INSTRUCTIONAL_PATTERN_PROMPT"
    ].forEach(function (key) {
      if (sandbox[key]) {
        sandbox.window[key] = sandbox[key];
      }
    });
  }
}

const PEDAGOGICAL_ICON_LIBS = [
  "lib/beat-material-registry.js",
  "lib/utility-pedagogical-icons.js",
  "lib/utility-pedagogical-beats.js",
  "lib/page-render-normalize.js"
];

module.exports = {
  DEFAULT_LIBS,
  PEDAGOGICAL_ICON_LIBS,
  runPrismLibScriptsInSandbox
};
