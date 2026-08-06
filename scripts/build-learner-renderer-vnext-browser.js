"use strict";

/**
 * Bundle CommonJS learner-renderer-vnext modules into browser UMD artefacts.
 * Run: node scripts/build-learner-renderer-vnext-browser.js
 *   or: npm run build:learner-renderer-vnext-browser
 * Verify freshness: npm run check:learner-renderer-vnext-browser
 *
 * Authoritative source: lib/learner-renderer-vnext/*
 * Outputs (generated — do not edit):
 * - lib/learner-renderer-vnext-browser.js (full renderer API for Prism shell; loaded by index.html)
 * - lib/learner-renderer-vnext-export-runtime.js (persistence API for standalone HTML)
 * - lib/learner-renderer-vnext-export-runtime-source.js (source string for compose-time inject)
 *
 * This is development/test tooling only. End users do not run this build.
 */
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const moduleDir = path.join(repoRoot, "lib", "learner-renderer-vnext");

const TARGETS = [
  {
    entryFile: "browser-entry.js",
    outPath: path.join(repoRoot, "lib", "learner-renderer-vnext-browser.js"),
    banner: "Browser bundle for learner renderer vNext.",
    mergeExistingApi: false,
    writeSourceModule: false
  },
  {
    entryFile: "export-runtime-entry.js",
    outPath: path.join(repoRoot, "lib", "learner-renderer-vnext-export-runtime.js"),
    banner: "Standalone export runtime for learner-renderer vNext draft persistence.",
    mergeExistingApi: true,
    writeSourceModule: true,
    sourceOutPath: path.join(
      repoRoot,
      "lib",
      "learner-renderer-vnext-export-runtime-source.js"
    )
  }
];

const REQUIRE_RE = /require\s*\(\s*["'](\.\.?\/[^"']+)["']\s*\)/g;

function normalizeModuleName(name) {
  return name.endsWith(".js") ? name : name + ".js";
}

function resolveModulePath(fromFile, relPath) {
  var normalized = String(relPath || "").replace(/\\/g, "/");
  if (normalized.startsWith("./") || normalized.startsWith("../")) {
    return path.normalize(
      path.join(path.dirname(fromFile), normalizeModuleName(normalized))
    );
  }
  return path.join(moduleDir, normalizeModuleName(normalized));
}

function readModuleSourceByPath(absPath) {
  var candidate = absPath;
  if (!fs.existsSync(candidate) && !String(candidate).endsWith(".js")) {
    candidate = candidate + ".js";
  }
  var fileName = path.relative(repoRoot, candidate).replace(/\\/g, "/");
  if (!fs.existsSync(candidate)) {
    throw new Error("Missing learner-renderer-vnext module: " + fileName);
  }
  return { fileName: fileName, source: fs.readFileSync(candidate, "utf8"), absPath: candidate };
}

function parseRelativeRequires(source, fromFile) {
  const deps = [];
  const re = new RegExp(REQUIRE_RE.source, "g");
  let match;
  while ((match = re.exec(source))) {
    var resolved = resolveModulePath(fromFile, match[1]);
    deps.push(path.relative(repoRoot, resolved).replace(/\\/g, "/"));
  }
  return deps;
}

function toCanonicalModuleKey(absPath) {
  var candidate = absPath;
  if (!fs.existsSync(candidate) && !String(candidate).endsWith(".js")) {
    candidate = candidate + ".js";
  }
  return path.relative(repoRoot, candidate).replace(/\\/g, "/");
}

function collectModuleGraph(entry) {
  const modules = new Map();
  const queue = [toCanonicalModuleKey(path.join(moduleDir, normalizeModuleName(entry)))];

  while (queue.length) {
    const fileName = queue.shift();
    if (modules.has(fileName)) continue;
    const absPath = path.join(repoRoot, fileName);
    const { source } = readModuleSourceByPath(absPath);
    modules.set(fileName, source);
    parseRelativeRequires(source, absPath).forEach(function (dep) {
      var depKey = toCanonicalModuleKey(path.join(repoRoot, dep));
      if (!modules.has(depKey)) queue.push(depKey);
    });
  }

  return modules;
}

function topoSortModules(modules) {
  const order = [];
  const visiting = new Set();
  const visited = new Set();

  function visit(fileName) {
    if (!modules.has(fileName)) return;
    if (visited.has(fileName)) return;
    if (visiting.has(fileName)) {
      throw new Error("Circular dependency detected at " + fileName);
    }
    visiting.add(fileName);
    var absPath = path.join(repoRoot, fileName);
    parseRelativeRequires(modules.get(fileName) || "", absPath).forEach(visit);
    visiting.delete(fileName);
    visited.add(fileName);
    order.push(fileName);
  }

  modules.forEach((_, fileName) => visit(fileName));
  return order;
}

function transformModuleSource(source, fileName) {
  return source
    .replace(/^"use strict";\s*\r?\n?/, "")
    .replace(REQUIRE_RE, function (_match, rel) {
      var resolved = resolveModulePath(path.join(repoRoot, fileName), rel);
      var depName = toCanonicalModuleKey(resolved);
      return '__bundleRequire("' + depName + '")';
    });
}

function buildBundle(target) {
  const modules = collectModuleGraph(target.entryFile);
  const order = topoSortModules(modules);
  const moduleFactories = order
    .map(function (fileName) {
      const body = transformModuleSource(modules.get(fileName), fileName);
      return (
        '  __modules["' +
        fileName +
        '"] = function (module, exports, __bundleRequire) {\n' +
        body +
        "\n  };"
      );
    })
    .join("\n\n");

  const assignApi = target.mergeExistingApi
    ? '  if (typeof root !== "undefined") {\n' +
      '    if (root.PRISM_LEARNER_RENDERER_VNEXT && typeof root.PRISM_LEARNER_RENDERER_VNEXT === "object") {\n' +
      "      Object.keys(api).forEach(function (key) {\n" +
      "        root.PRISM_LEARNER_RENDERER_VNEXT[key] = api[key];\n" +
      "      });\n" +
      "    } else {\n" +
      "      root.PRISM_LEARNER_RENDERER_VNEXT = api;\n" +
      "    }\n" +
      "  }\n"
    : '  if (typeof root !== "undefined") {\n' +
      "    root.PRISM_LEARNER_RENDERER_VNEXT = api;\n" +
      "  }\n";

  return (
    "/**\n" +
    " * " +
    target.banner +
    "\n" +
    " * Generated by scripts/build-learner-renderer-vnext-browser.js — do not edit.\n" +
    " */\n" +
    "(function (root, factory) {\n" +
    '  "use strict";\n' +
    "  var api = factory();\n" +
    '  if (typeof module !== "undefined" && module.exports) {\n' +
    "    module.exports = api;\n" +
    "  }\n" +
    assignApi +
    '})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {\n' +
    '  "use strict";\n\n' +
    "  var __modules = {};\n" +
    "  var __cache = {};\n\n" +
    "  function __bundleRequire(fileName) {\n" +
    "    if (__cache[fileName]) return __cache[fileName];\n" +
    '    if (!__modules[fileName]) throw new Error("Missing bundled module: " + fileName);\n' +
    "    var module = { exports: {} };\n" +
    "    __modules[fileName](module, module.exports, __bundleRequire);\n" +
    "    __cache[fileName] = module.exports;\n" +
    "    return module.exports;\n" +
    "  }\n\n" +
    moduleFactories +
    "\n\n" +
    '  return __bundleRequire("lib/learner-renderer-vnext/' +
    normalizeModuleName(target.entryFile) +
    '");\n' +
    "});\n"
  );
}

function buildSourceModulePayload(bundleSource) {
  return (
    "/**\n" +
    " * Source string for standalone vNext export-runtime injection.\n" +
    " * Generated by scripts/build-learner-renderer-vnext-browser.js — do not edit.\n" +
    " */\n" +
    "(function (root) {\n" +
    '  "use strict";\n' +
    "  var SOURCE = " +
    JSON.stringify(bundleSource) +
    ";\n" +
    "  if (typeof root !== \"undefined\") {\n" +
    "    root.PRISM_VNEXT_EXPORT_RUNTIME_SOURCE = SOURCE;\n" +
    "  }\n" +
    '  if (typeof module !== "undefined" && module.exports) {\n' +
    "    module.exports = { source: SOURCE };\n" +
    "  }\n" +
    '})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);\n'
  );
}

/**
 * Generate all committed browser artefacts in memory (no disk writes).
 * @returns {{ outPath: string, content: string, role: string }[]}
 */
function generateTargetOutputs() {
  var outputs = [];
  TARGETS.forEach(function (target) {
    var bundle = buildBundle(target);
    outputs.push({
      outPath: target.outPath,
      content: bundle,
      role: target.banner
    });
    if (target.writeSourceModule && target.sourceOutPath) {
      outputs.push({
        outPath: target.sourceOutPath,
        content: buildSourceModulePayload(bundle),
        role: "Export-runtime source string for compose-time inject"
      });
    }
  });
  return outputs;
}

function writeGeneratedOutputs(outputs) {
  outputs.forEach(function (item) {
    fs.writeFileSync(item.outPath, item.content, "utf8");
    console.log(
      "Wrote " + path.relative(repoRoot, item.outPath) + " (" + item.content.length + " bytes)"
    );
  });
}

function main() {
  writeGeneratedOutputs(generateTargetOutputs());
}

if (require.main === module) {
  main();
}

module.exports = {
  TARGETS: TARGETS,
  repoRoot: repoRoot,
  generateTargetOutputs: generateTargetOutputs,
  writeGeneratedOutputs: writeGeneratedOutputs,
  main: main
};
