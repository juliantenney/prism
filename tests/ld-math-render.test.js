const test = require("node:test");
const assert = require("node:assert/strict");

const ldMath = require("../lib/ld-math-render.js");

test("LD-MATH-RENDER: module metadata", () => {
  assert.equal(ldMath.MODULE_ID, "LD-MATH-RENDER");
  assert.match(ldMath.MARKER, /LD-MATH-RENDER/);
});

test("LD-MATH-RENDER: canonical block includes TeX rules and table cross-ref", () => {
  const text = ldMath.buildLdMathRenderPromptBlock();
  assert.match(text, /LD-MATH-RENDER \(auto-applied\)/i);
  assert.match(text, /Layer: L7/i);
  assert.match(text, /Inline maths: use \\\(\.\.\.\\\)/);
  assert.match(text, /Do NOT use \$?\.\.\.\$ or \$\$?\.\.\.\$\$/);
  assert.match(text, /LD-TABLE-FIDELITY/i);
  assert.doesNotMatch(text, /structural markdown blocks \(steps\/lists\/tables/i);
  assert.doesNotMatch(text, /Preserve existing limited Markdown subset/i);
});

test("LD-MATH-RENDER: embedded block without marker", () => {
  const text = ldMath.buildLdMathRenderPromptBlock({ includeMarker: false });
  assert.doesNotMatch(text, /LD-MATH-RENDER \(auto-applied\)/i);
  assert.match(text, /LD-MATH-RENDER \| Layer: L7/i);
});

test("LD-MATH-RENDER: markerRegex matches legacy title", () => {
  assert.ok(ldMath.markerRegex().test("Math notation output contract (auto-applied):"));
  assert.ok(ldMath.markerRegex().test("LD-MATH-RENDER (auto-applied):"));
});
