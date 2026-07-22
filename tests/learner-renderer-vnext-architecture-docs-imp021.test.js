"use strict";

/**
 * Sprint 68 — S68-IMP-021 architecture documentation integrity checks.
 * Lightweight: verifies required docs, links, and command/path references exist.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");

const REQUIRED_DOCS = [
  "docs/architecture/learner-renderer-vnext.md",
  "docs/architecture/learner-renderer-vnext-diagnostics.md",
  "docs/architecture/learner-renderer-vnext-extension-guide.md",
  "docs/architecture/adr/ADR-012-learner-renderer-interprets-educational-semantics.md",
  "docs/sprints/sprint-68-closeout.md",
  "scripts/certify-learner-renderer-vnext.js",
  "lib/learner-renderer-vnext/certification-diagnostics-catalog.js",
  "artifacts/learner-renderer-vnext-certification.md"
];

function read(relPath) {
  return fs.readFileSync(path.join(repoRoot, relPath), "utf8");
}

function extractMarkdownLinks(markdown) {
  const links = [];
  const re = /\[[^\]]*\]\(([^)]+)\)/g;
  let match;
  while ((match = re.exec(markdown))) {
    links.push(match[1].trim());
  }
  return links;
}

function resolveDocLink(fromRelPath, href) {
  if (!href || href.startsWith("http://") || href.startsWith("https://") || href.startsWith("#")) {
    return null;
  }
  const clean = href.split("#")[0].split("?")[0];
  if (!clean) return null;
  return path.normalize(path.join(path.dirname(path.join(repoRoot, fromRelPath)), clean));
}

test("IMP-021: required architecture and closeout documents exist", () => {
  REQUIRED_DOCS.forEach((rel) => {
    assert.ok(fs.existsSync(path.join(repoRoot, rel)), rel);
  });
});

test("IMP-021: architecture docs link to existing paths", () => {
  const docs = [
    "docs/architecture/learner-renderer-vnext.md",
    "docs/architecture/learner-renderer-vnext-diagnostics.md",
    "docs/architecture/learner-renderer-vnext-extension-guide.md",
    "docs/architecture/adr/ADR-012-learner-renderer-interprets-educational-semantics.md",
    "docs/sprints/sprint-68-closeout.md"
  ];

  docs.forEach((rel) => {
    const markdown = read(rel);
    extractMarkdownLinks(markdown).forEach((href) => {
      const resolved = resolveDocLink(rel, href);
      if (!resolved) return;
      assert.ok(fs.existsSync(resolved), rel + " → " + href + " (" + resolved + ")");
    });
  });
});

test("IMP-021: architecture references certification command and ADR-012", () => {
  const architecture = read("docs/architecture/learner-renderer-vnext.md");
  assert.match(architecture, /node scripts\/certify-learner-renderer-vnext\.js/);
  assert.match(architecture, /runLearnerRendererCertification/);
  assert.match(architecture, /ADR-012/);
  assert.match(architecture, /text_entry/);
  assert.match(architecture, /table_entry/);
  assert.match(architecture, /ordering/);
  assert.match(architecture, /absorb/);
});

test("IMP-021: closeout ends with Sprint 68 COMPLETE status block", () => {
  const closeout = read("docs/sprints/sprint-68-closeout.md");
  assert.match(
    closeout,
    /Sprint 68\s+COMPLETE\s+Learner-renderer-vNext is production certified/
  );
  assert.match(closeout, /CERTIFIED/);
  assert.match(closeout, /469 passed/);
});

test("IMP-021: diagnostics doc covers catalogue codes", () => {
  const catalog = require("../lib/learner-renderer-vnext/certification-diagnostics-catalog");
  const markdown = read("docs/architecture/learner-renderer-vnext-diagnostics.md");
  catalog.catalogCodes().forEach((code) => {
    assert.ok(markdown.includes(code), "missing diagnostic documentation for " + code);
  });
});

test("IMP-021: decisions.md and sprint index reference ADR-012 / closeout", () => {
  const decisions = read("docs/architecture/decisions.md");
  assert.match(decisions, /ADR-012/);
  assert.match(decisions, /learner-renderer-vnext\.md/);

  const sprintIndex = read("docs/sprints/README.md");
  assert.match(sprintIndex, /sprint-68-closeout\.md/);
});

test("IMP-021: extension guide names matching as hypothetical surface", () => {
  const guide = read("docs/architecture/learner-renderer-vnext-extension-guide.md");
  assert.match(guide, /matching/);
  assert.match(guide, /UNSUPPORTED_LEARNER_SURFACE/);
  assert.match(guide, /certify-learner-renderer-vnext\.js/);
});
