/**
 * Rebuild Understanding Lagrange Multipliers unified ZIP from an existing
 * assembled package, applying publishing-boundary ID namespacing and chrome
 * stripping without regenerating resource content.
 *
 * Usage:
 *   node scripts/reexport-lagrange-unified-journey.js [sourceZip] [outZip]
 */
"use strict";

const fs = require("fs");
const path = require("path");
const fflate = require("fflate");
const unifiedShell = require("../lib/learning-journey-unified-shell.js");

const repoRoot = path.resolve(__dirname, "..");
const defaultSource = path.join(
  process.env.USERPROFILE || process.env.HOME || "",
  "Downloads",
  "understanding-lagrange-multipliers.zip"
);
const defaultOut = path.join(
  repoRoot,
  "dist",
  "understanding-lagrange-multipliers.zip"
);

const sourceZip = path.resolve(process.argv[2] || defaultSource);
const outZip = path.resolve(process.argv[3] || defaultOut);

function collectIds(html) {
  const ids = [];
  const re = /(?:^|\s)id\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html))) ids.push(m[1]);
  return ids;
}

function collectRefs(html) {
  const refs = [];
  function push(kind, value) {
    String(value || "")
      .split(/\s+/)
      .filter(Boolean)
      .forEach(function (token) {
        refs.push({ kind: kind, id: token });
      });
  }
  html.replace(/(?:^|\s)for\s*=\s*["']([^"']+)["']/gi, function (_m, v) {
    push("for", v);
    return _m;
  });
  html.replace(/(?:^|\s)href\s*=\s*["']#([^"']+)["']/gi, function (_m, v) {
    push("href", v);
    return _m;
  });
  [
    "aria-controls",
    "aria-labelledby",
    "aria-describedby",
    "aria-owns",
    "aria-activedescendant",
    "headers"
  ].forEach(function (attr) {
    const re = new RegExp("(?:^|\\s)" + attr + "\\s*=\\s*[\"']([^\"']+)[\"']", "gi");
    html.replace(re, function (_m, v) {
      push(attr, v);
      return _m;
    });
  });
  ["data-math-label-id", "data-math-field-id"].forEach(function (attr) {
    const re = new RegExp("(?:^|\\s)" + attr + "\\s*=\\s*[\"']([^\"']+)[\"']", "gi");
    html.replace(re, function (_m, v) {
      push(attr, v);
      return _m;
    });
  });
  return refs;
}

function chromeHeadingPresent(html, label) {
  const re = new RegExp(
    "<(?:strong|h4|dt|th)[^>]*>\\s*" +
      label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
      "\\s*<",
    "i"
  );
  return re.test(html);
}

if (!fs.existsSync(sourceZip)) {
  console.error("Source ZIP not found:", sourceZip);
  process.exit(1);
}

const raw = fs.readFileSync(sourceZip);
const files = fflate.unzipSync(new Uint8Array(raw));
const indexKey = Object.keys(files).find(function (k) {
  return /(^|\/)index\.html$/i.test(k);
});
if (!indexKey) {
  console.error("index.html missing from source ZIP");
  process.exit(1);
}

let indexHtml = Buffer.from(files[indexKey]).toString("utf8");
const requiredCommissions = ["c1", "c2", "c3", "c4", "c5", "c6"];
const templateStats = [];

indexHtml = indexHtml.replace(
  /<template id="lj-resource-([^"]+)">([\s\S]*?)<\/template>/gi,
  function (_m, commissionId, body) {
    if (commissionId === "overview" || commissionId === "journal") {
      return _m;
    }
    let next = unifiedShell.stripPublishedProductionChromeLabels(body);
    next = unifiedShell.namespaceResourceIds(next, commissionId);
    const ids = collectIds(next);
    const idSet = new Set(ids);
    const broken = collectRefs(next).filter(function (ref) {
      return !idSet.has(ref.id);
    });
    templateStats.push({
      commissionId: commissionId,
      idCount: ids.length,
      brokenRefs: broken.length
    });
    return '<template id="lj-resource-' + commissionId + '">' + next + "</template>";
  }
);

const runtimePath = path.join(repoRoot, "lib", "learner-renderer-vnext-browser.js");
if (!fs.existsSync(runtimePath)) {
  console.error("Missing rebuilt runtime:", runtimePath);
  process.exit(1);
}
const runtimeBytes = new Uint8Array(fs.readFileSync(runtimePath));
const runtimeKey =
  Object.keys(files).find(function (k) {
    return /learner-renderer-vnext-browser\.js$/i.test(k);
  }) || "runtime/learner-renderer-vnext-browser.js";
files[runtimeKey] = runtimeBytes;
files[indexKey] = fflate.strToU8(indexHtml);

requiredCommissions.forEach(function (cid) {
  const marker = 'id="lj-resource-' + cid + '"';
  if (indexHtml.indexOf(marker) < 0) {
    console.error("Missing resource template:", cid);
    process.exit(1);
  }
  const mediaPrefix = "media/" + cid + "/";
  const mediaFiles = Object.keys(files).filter(function (k) {
    return k.replace(/\\/g, "/").indexOf(mediaPrefix) === 0;
  });
  if (!mediaFiles.length) {
    console.error("Missing media for", cid);
    process.exit(1);
  }
});

const c3 = (indexHtml.match(/<template id="lj-resource-c3">([\s\S]*?)<\/template>/) ||
  [])[1] || "";
["Format", "Representations", "Interpretive statement"].forEach(function (label) {
  if (chromeHeadingPresent(c3, label)) {
    console.error("C3 still exposes chrome label:", label);
    process.exit(1);
  }
});

const seen = Object.create(null);
const collisions = [];
const templateRe = /<template id="lj-resource-([^"]+)">([\s\S]*?)<\/template>/gi;
let tm;
while ((tm = templateRe.exec(indexHtml))) {
  const cid = tm[1];
  if (cid === "overview" || cid === "journal") continue;
  collectIds(tm[2]).forEach(function (id) {
    if (seen[id] && seen[id] !== cid) {
      collisions.push(id + " in " + seen[id] + " and " + cid);
    } else {
      seen[id] = cid;
    }
  });
}
if (collisions.length) {
  console.error("Cross-resource ID collisions remain:\n" + collisions.slice(0, 40).join("\n"));
  process.exit(1);
}

const brokenTotal = templateStats.reduce(function (n, row) {
  return n + row.brokenRefs;
}, 0);
if (brokenTotal) {
  console.error("Broken in-template references:", brokenTotal, templateStats);
  process.exit(1);
}

fs.mkdirSync(path.dirname(outZip), { recursive: true });
const zipped = fflate.zipSync(files, { level: 6 });
fs.writeFileSync(outZip, Buffer.from(zipped));

console.log(
  JSON.stringify(
    {
      ok: true,
      sourceZip: sourceZip,
      outZip: outZip,
      bytes: fs.statSync(outZip).size,
      templates: templateStats,
      crossResourceCollisions: 0,
      c3ChromeCleared: true,
      runtimeUpdated: runtimeKey
    },
    null,
    2
  )
);
