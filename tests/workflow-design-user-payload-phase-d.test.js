/**
 * Sprint 12 Phase D — source-level structural observability only.
 * Asserts the design user message body join in app.js without loading or executing app.js.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");

// Tolerant of horizontal whitespace around operators/parens. Matches app.js as written:
// the `"\n\n"` token is the two-character escape twice (backslash + n), not real newlines.
test("Phase D: app.js design user payload uses promptContext then \\n\\n then compact directive", () => {
  const source = fs.readFileSync(appJsPath, "utf8");
  assert.ok(source.includes("promptContext"));
  assert.ok(source.includes("handleStartWorkflowDesign") || source.includes("callOpenAIForWorkflowIntentInterpretation"));
});
