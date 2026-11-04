/**
 * One-shot: restore in-content resource titles on an already-built unified shell
 * index.html (package fragments omit util-page-header). Does not regenerate content.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const unifiedShell = require("../lib/learning-journey-unified-shell.js");

const target = path.resolve(
  process.argv[2] || path.join("c:/xampp/htdocs/test/index.html")
);
let html = fs.readFileSync(target, "utf8");

const manifestMatch = html.match(
  /<script type="application\/json" id="lj-shell-manifest">([\s\S]*?)<\/script>/
);
if (!manifestMatch) {
  console.error("lj-shell-manifest missing in", target);
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
  if (!id || !title) continue;
  const open = '<template id="lj-resource-' + id + '">';
  const start = html.indexOf(open);
  if (start < 0) {
    console.warn("missing template", id);
    continue;
  }
  const contentStart = start + open.length;
  const end = html.indexOf("</template>", contentStart);
  if (end < 0) continue;
  const before = html.slice(contentStart, end);
  const after = unifiedShell.ensureResourceTitleHeading(
    unifiedShell.demoteLeadingH1(before),
    title
  );
  if (after === before) {
    console.log(id, "unchanged (already titled?)");
    continue;
  }
  html = html.slice(0, contentStart) + after + html.slice(end);
  patched += 1;
  console.log(id, "→", title);
}

// Ensure title typography CSS is present in chrome styles.
const titleCss =
  ".lj-shell__main .util-page-header{margin:0 0 1rem}" +
  ".lj-shell__main .util-page-header>h1,.lj-shell__main .util-page-header>h2{margin:0;font-size:1.75rem;line-height:1.25;font-weight:700;letter-spacing:-.015em;color:#0f172a}";
if (!html.includes(".lj-shell__main .util-page-header>h1,.lj-shell__main .util-page-header>h2")) {
  html = html.replace(
    ".lj-shell-overview__title{margin:0 0 1rem;font-size:1.75rem;line-height:1.25;font-weight:700;letter-spacing:-.015em;color:#0f172a}",
    ".lj-shell-overview__title{margin:0 0 1rem;font-size:1.75rem;line-height:1.25;font-weight:700;letter-spacing:-.015em;color:#0f172a}" +
      titleCss
  );
  console.log("chrome CSS: resource title typography added");
}

fs.writeFileSync(target, html, "utf8");
console.log("patched", patched, "resources in", target);
