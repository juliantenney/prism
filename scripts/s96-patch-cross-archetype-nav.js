/**
 * Re-seat cross-archetype section navigation on an already-built unified shell.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const unifiedShell = require("../lib/learning-journey-unified-shell.js");
const {
  enhanceFragmentWithSectionNavigation
} = require("../lib/learner-renderer-vnext");

const target = path.resolve(
  process.argv[2] || path.join("c:/xampp/htdocs/test/index.html")
);
let html = fs.readFileSync(target, "utf8");
const manifestMatch = html.match(
  /<script type="application\/json" id="lj-shell-manifest">([\s\S]*?)<\/script>/
);
if (!manifestMatch) {
  console.error("missing manifest");
  process.exit(1);
}
const manifest = JSON.parse(manifestMatch[1]);
const resources = (Array.isArray(manifest) ? manifest : []).filter(
  (row) => row && row.kind !== "overview" && row.commissionId !== "overview"
);

let patched = 0;
for (const row of resources) {
  const id = String(row.commissionId || "");
  const title = String(row.title || "").trim();
  if (!id) continue;
  const open = '<template id="lj-resource-' + id + '">';
  const start = html.indexOf(open);
  if (start < 0) continue;
  const contentStart = start + open.length;
  const end = html.indexOf("</template>", contentStart);
  if (end < 0) continue;
  const before = html.slice(contentStart, end);
  let after = unifiedShell.ensureResourceTitleHeading(
    unifiedShell.demoteLeadingH1(before),
    title
  );
  after = enhanceFragmentWithSectionNavigation(after);
  if (after === before) {
    console.log(id, "unchanged");
    continue;
  }
  html = html.slice(0, contentStart) + after + html.slice(end);
  patched += 1;
  const nav = /util-journey-nav--sequential/.test(after);
  const labels = [];
  const re = /class="util-journey-all-link"[^>]*>([^<]+)</g;
  let m;
  while ((m = re.exec(after))) labels.push(m[1]);
  console.log(id, "nav", nav, "destinations", labels.join(" | ") || "(none)");
}

fs.writeFileSync(target, html, "utf8");
CopyRuntime();
console.log("patched", patched, "→", target);

function CopyRuntime() {
  const runtimeSrc = path.join(
    __dirname,
    "..",
    "lib",
    "learner-renderer-vnext-browser.js"
  );
  const runtimeDest = path.join(path.dirname(target), "runtime", "learner-renderer-vnext-browser.js");
  if (fs.existsSync(path.dirname(runtimeDest)) && fs.existsSync(runtimeSrc)) {
    fs.copyFileSync(runtimeSrc, runtimeDest);
    console.log("runtime updated");
  }
}
