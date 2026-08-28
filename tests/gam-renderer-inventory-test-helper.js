/**
 * D-014 RC2 — build GAM renderer inventory into an isolated temp directory
 * so concurrent tests do not race on the shared docs artefacts paths.
 */
"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const DEFAULT_REPO_ROOT = path.resolve(__dirname, "..");
const BUILD_SCRIPT = "scripts/build-gam-renderer-type-inventory.js";

/**
 * @param {string} [repoRoot]
 * @returns {{
 *   outDir: string,
 *   inventoryPath: string,
 *   surfaceMapPath: string,
 *   unsupportedPath: string,
 *   inventory: object,
 *   unsupported: object,
 *   surfaceMap: object
 * }}
 */
function buildGamRendererTypeInventoryIsolated(repoRoot) {
  const root = repoRoot || DEFAULT_REPO_ROOT;
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "prism-gam-inv-"));
  const env = Object.assign({}, process.env, {
    PRISM_GAM_INVENTORY_OUT_DIR: outDir
  });
  execFileSync(process.execPath, [path.join(root, BUILD_SCRIPT)], {
    cwd: root,
    env: env,
    stdio: "pipe"
  });
  const inventoryPath = path.join(outDir, "gam-renderer-type-inventory.json");
  const surfaceMapPath = path.join(outDir, "gam-type-to-surface-map.json");
  const unsupportedPath = path.join(outDir, "gam-unsupported-learner-interactions.json");
  return {
    outDir: outDir,
    inventoryPath: inventoryPath,
    surfaceMapPath: surfaceMapPath,
    unsupportedPath: unsupportedPath,
    inventory: JSON.parse(fs.readFileSync(inventoryPath, "utf8")),
    unsupported: JSON.parse(fs.readFileSync(unsupportedPath, "utf8")),
    surfaceMap: JSON.parse(fs.readFileSync(surfaceMapPath, "utf8"))
  };
}

module.exports = {
  buildGamRendererTypeInventoryIsolated
};
