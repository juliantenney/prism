#!/usr/bin/env node
/**
 * Sprint 104 M6 follow-up — integrate the shared workload authoring principles into the
 * authenticated Learning Journey commissioning prompt (operator-authorised 2026-11-26).
 *
 * Process (mirrors how the export has been versioned):
 *   1. Insert the single-source principles block before the TASK section of the
 *      JourneyCommissioning body in the authenticated export, archiving the result as a new
 *      versions[] entry (top-level body = current).
 *   2. Insert the identical block at the same anchor in TEMPLATES.learning_commissions of
 *      lib/learning-journey-sibling-prompts.js.
 * No other prompt text is touched. Idempotent: does nothing when the block is already present.
 */
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const root = path.resolve(__dirname, "..");
const exportPath = path.join(
  root,
  "docs/development/sprints/2026-10-06-sprint-91-learning-journey-first-class-implementation/JOURNEY-PROTOTYPE-AUTHENTICATED-EXPORT.json"
);
const modulePath = path.join(root, "lib", "learning-journey-sibling-prompts.js");
const principles = require(path.join(root, "lib", "workload-authoring-principles.js"));

const ANCHOR = "\nTASK\n\n1. ANALYSE THE ELEMENT ARCHITECTURE";
const block = principles.promptBlock() + "\n";

function insertBlock(body) {
  if (body.indexOf(principles.PROMPT_HEADING) !== -1) return null;
  const first = body.indexOf(ANCHOR);
  if (first === -1 || body.indexOf(ANCHOR, first + 1) !== -1) {
    throw new Error("Anchor must occur exactly once in the commissioning body");
  }
  return body.slice(0, first) + "\n" + block + body.slice(first);
}

// 1. Authenticated export
const raw = fs.readFileSync(exportPath, "utf8");
const data = JSON.parse(raw);
if (JSON.stringify(data, null, 2) !== raw) throw new Error("Export formatting is not round-trip stable");
const prompt = data.prompts.find((p) => p.title === "JourneyCommissioning");
const nextBody = insertBlock(prompt.body);
if (nextBody) {
  const now = Date.now();
  prompt.body = nextBody;
  prompt.updatedAt = now;
  prompt.versions.push({
    id: crypto.randomUUID() + "-v",
    timestamp: now,
    body: nextBody,
    notes:
      "Sprint 104 M6: shared workload authoring principles integrated (operator-authorised 2026-11-26); no other prompt change"
  });
  fs.writeFileSync(exportPath, JSON.stringify(data, null, 2), "utf8");
  console.log("Export updated: JourneyCommissioning body + new version entry");
} else {
  console.log("Export already contains the shared principles block");
}

// 2. Sibling prompt module (TEMPLATES.learning_commissions literal)
const source = fs.readFileSync(modulePath, "utf8");
const esc = (text) => JSON.stringify(text).slice(1, -1);
if (source.indexOf(esc(principles.PROMPT_HEADING + "\n\n" + "Apply these principles")) !== -1) {
  console.log("Module already contains the shared principles block");
} else {
  const anchorEsc = esc(ANCHOR);
  const at = source.indexOf(anchorEsc);
  if (at === -1 || source.indexOf(anchorEsc, at + 1) !== -1) {
    throw new Error("Anchor must occur exactly once in the sibling prompt module");
  }
  const updated = source.slice(0, at) + esc("\n" + block) + source.slice(at);
  fs.writeFileSync(modulePath, updated, "utf8");
  console.log("Module updated: TEMPLATES.learning_commissions");
}
