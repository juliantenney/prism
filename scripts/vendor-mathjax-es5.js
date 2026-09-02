"use strict";

/**
 * Vendor the minimum MathJax 3.2.2 es5 set for offline tex-chtml learner packages.
 * Copies from node_modules/mathjax when present; otherwise fetches from jsDelivr.
 */
const fs = require("node:fs");
const path = require("node:path");

const MATHJAX_VERSION = "3.2.2";
const CDN_BASE = "https://cdn.jsdelivr.net/npm/mathjax@" + MATHJAX_VERSION + "/";
const REPO_ROOT = path.resolve(__dirname, "..");
const OUT_ROOT = path.join(REPO_ROOT, "lib", "mathjax");

const WOFF_FILES = [
  "MathJax_AMS-Regular.woff",
  "MathJax_Calligraphic-Bold.woff",
  "MathJax_Calligraphic-Regular.woff",
  "MathJax_Fraktur-Bold.woff",
  "MathJax_Fraktur-Regular.woff",
  "MathJax_Main-Bold.woff",
  "MathJax_Main-Italic.woff",
  "MathJax_Main-Regular.woff",
  "MathJax_Math-BoldItalic.woff",
  "MathJax_Math-Italic.woff",
  "MathJax_Math-Regular.woff",
  "MathJax_SansSerif-Bold.woff",
  "MathJax_SansSerif-Italic.woff",
  "MathJax_SansSerif-Regular.woff",
  "MathJax_Script-Regular.woff",
  "MathJax_Size1-Regular.woff",
  "MathJax_Size2-Regular.woff",
  "MathJax_Size3-Regular.woff",
  "MathJax_Size4-Regular.woff",
  "MathJax_Typewriter-Regular.woff",
  "MathJax_Vector-Bold.woff",
  "MathJax_Vector-Regular.woff",
  "MathJax_Zero.woff"
];

const PACKAGE_FILES = [
  "es5/tex-chtml.js",
  "es5/output/chtml/fonts/tex.js",
  ...WOFF_FILES.map((name) => "es5/output/chtml/fonts/woff-v2/" + name)
];

function npmSourceRoot() {
  const candidate = path.join(REPO_ROOT, "node_modules", "mathjax");
  if (fs.existsSync(path.join(candidate, "es5", "tex-chtml.js"))) {
    return candidate;
  }
  return null;
}

async function readFromNpm(relPath) {
  const root = npmSourceRoot();
  if (!root) return null;
  const abs = path.join(root, relPath.replace(/\//g, path.sep));
  if (!fs.existsSync(abs)) return null;
  return fs.readFileSync(abs);
}

async function fetchFromCdn(relPath) {
  const url = CDN_BASE + relPath.replace(/\\/g, "/");
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch " + url + " (" + res.status + ")");
  }
  const buf = Buffer.from(await res.arrayBuffer());
  return buf;
}

async function vendorOne(relPath) {
  const outPath = path.join(OUT_ROOT, relPath.replace(/\//g, path.sep));
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  let bytes = await readFromNpm(relPath);
  if (!bytes) {
    bytes = await fetchFromCdn(relPath);
  }
  fs.writeFileSync(outPath, bytes);
  return { path: relPath, bytes: bytes.length };
}

async function main() {
  console.log("Vendoring MathJax " + MATHJAX_VERSION + " minimal tex-chtml set...");
  let total = 0;
  for (const rel of PACKAGE_FILES) {
    const row = await vendorOne(rel);
    total += row.bytes;
    console.log("  " + row.path + " (" + row.bytes + " bytes)");
  }
  console.log("Done. " + PACKAGE_FILES.length + " files, " + total + " bytes (~" + (total / 1024 / 1024).toFixed(2) + " MB).");
}

main().catch(function (err) {
  console.error(err);
  process.exit(1);
});
