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
  "lib/ld-design-page-compose-contract.js",
  "lib/educational-quality-framework-prompt.js"
];

function runPrismLibScriptsInSandbox(sandbox, repoRoot, libs) {
  const root = repoRoot || path.resolve(__dirname, "..");
  const list = Array.isArray(libs) && libs.length ? libs : DEFAULT_LIBS;
  list.forEach(function (rel) {
    const filePath = path.join(root, rel);
    vm.runInContext(fs.readFileSync(filePath, "utf8"), sandbox, { filename: rel });
  });
  if (sandbox.window) {
    if (sandbox.PRISM_GAM_OUTPUT_FORMAT) {
      sandbox.window.PRISM_GAM_OUTPUT_FORMAT = sandbox.PRISM_GAM_OUTPUT_FORMAT;
    }
    if (sandbox.PRISM_LD_TABLE_FIDELITY) {
      sandbox.window.PRISM_LD_TABLE_FIDELITY = sandbox.PRISM_LD_TABLE_FIDELITY;
    }
  }
}

module.exports = {
  DEFAULT_LIBS,
  runPrismLibScriptsInSandbox
};
