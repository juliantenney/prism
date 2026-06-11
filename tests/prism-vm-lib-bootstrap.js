/**
 * Load PRISM lib scripts into a vm sandbox before app.js (Node tests + probes).
 */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const DEFAULT_LIBS = [
  "lib/sprint38-visual-affordances.js",
  "lib/ld-table-fidelity.js",
  "lib/ld-materials-copy.js",
  "lib/ld-math-render.js",
  "lib/ld-self-directed-rhetoric.js",
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
}

module.exports = {
  DEFAULT_LIBS,
  runPrismLibScriptsInSandbox
};
