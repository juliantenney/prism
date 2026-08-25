"use strict";

/**
 * LD-MATH-RENDER integrity checks — catch GAM-stage TeX garbling fail-closed.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const mathRender = require(path.join(repoRoot, "lib", "ld-math-render.js"));
const gamEnrich = require(path.join(repoRoot, "lib", "page-gam-enrich.js"));

const CORRUPTED_A2_M1_BODY = [
  "## Solving by factorisation",
  "",
  "Solve:",
  "",
  "\\[",
  "x^2-5x+6=0",
  "\\]",
  "",
  "1. Find two numbers that multiply to 6.",
  "2. Those numbers must add to -5.",
  "3. The numbers are -2 and -3.",
  "4. Factorise:",
  "",
  "\\[",
  "(x[",
  "x^ that multiply to 6.",
  "2-2)(x-3)=0",
  "\\]",
  "",
  "le.",
  "6. \\(x=2\\) or \\(x=3\\).",
  "7. Check by substitution."
].join("\n");

const INTACT_A2_M1_BODY = [
  "## Solving by factorisation",
  "",
  "Solve:",
  "",
  "\\[",
  "x^2-5x+6=0",
  "\\]",
  "",
  "1. Find two numbers that multiply to 6.",
  "2. Those numbers must add to -5.",
  "3. The numbers are -2 and -3.",
  "4. Factorise:",
  "",
  "\\[",
  "(x-2)(x-3)=0",
  "\\]",
  "",
  "5. Apply the zero-product rule.",
  "6. \\(x=2\\) or \\(x=3\\).",
  "7. Check by substitution."
].join("\n");

test("math integrity: intact factorisation walkthrough passes", () => {
  const result = mathRender.validateLearnerFacingMathIntegrity(INTACT_A2_M1_BODY);
  assert.equal(result.ok, true, JSON.stringify(result.issues));
});

test("math integrity: quadratic A2-M1 corruption fails closed", () => {
  const result = mathRender.validateLearnerFacingMathIntegrity(CORRUPTED_A2_M1_BODY);
  assert.equal(result.ok, false);
  const codes = result.issues.map((issue) => issue.code);
  assert.ok(codes.includes("PROSE_INSIDE_MATH"));
  assert.ok(codes.includes("TRUNCATED_GROUP_OPENER"));
});

test("math integrity: unbalanced display delimiters fail", () => {
  const result = mathRender.validateLearnerFacingMathIntegrity("Start \\[x^2=1 and stop.");
  assert.equal(result.ok, false);
  assert.ok(result.issues.some((issue) => issue.code === "UNBALANCED_MATH_DELIMITERS"));
});

test("math integrity: numbered list inside display math fails", () => {
  const result = mathRender.validateLearnerFacingMathIntegrity("\\[\n1. first\nx+1\n\\]");
  assert.equal(result.ok, false);
  assert.ok(result.issues.some((issue) => issue.code === "LIST_MARKER_INSIDE_MATH"));
});

test("math integrity: clean quadratic formula and inline roots pass", () => {
  const body = [
    "Use \\(ax^2 + bx + c = 0\\).",
    "",
    "\\[",
    "x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}",
    "\\]"
  ].join("\n");
  const result = mathRender.validateLearnerFacingMathIntegrity(body);
  assert.equal(result.ok, true, JSON.stringify(result.issues));
});

test("math integrity: display math with instructional \\text label fails", () => {
  const body = ["\\[", "\\text{total programme expenditure}=200{,}000", "\\]"].join("\n");
  const result = mathRender.validateLearnerFacingMathIntegrity(body);
  assert.equal(result.ok, false);
  assert.ok(result.issues.some((issue) => issue.code === "PROSE_INSIDE_MATH"));
});

test("math integrity: label outside display math with bare numeric interior passes", () => {
  const body = ["Total programme expenditure:", "", "\\[", "200{,}000", "\\]"].join("\n");
  const result = mathRender.validateLearnerFacingMathIntegrity(body);
  assert.equal(result.ok, true, JSON.stringify(result.issues));
});

test("math integrity: short formula label inside \\text remains tolerated", () => {
  const body = ["\\[", "\\text{Inflation Rate}=\\frac{a}{b}", "\\]"].join("\n");
  const result = mathRender.validateLearnerFacingMathIntegrity(body);
  assert.equal(result.ok, true, JSON.stringify(result.issues));
});

test("LD-MATH-RENDER prompt block requires intact balanced math spans", () => {
  const block = mathRender.buildLdMathRenderPromptBlock();
  assert.match(block, /intact TeX only/i);
  assert.match(block, /Keep delimiters balanced/);
  assert.match(block, /Labels, units, and explanations belong outside math delimiters/i);
  assert.match(block, /do not wrap instructional prose in \\text\{\.\.\.\}/i);
});

test("GAM partial capture rejects corrupted A2-M1 math body", () => {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "gam", enriched_by: ["gam"] },
    activities: [
      {
        activity_id: "A2",
        materials: [
          {
            material_id: "A2-M1",
            material_type: "worked_example",
            activity_id: "A2",
            title: "Factorisation Walkthrough",
            body_format: "markdown",
            body: CORRUPTED_A2_M1_BODY
          }
        ]
      }
    ]
  };
  const check = gamEnrich.validateGamPartialPageCapture(page);
  assert.equal(check.ok, false);
  assert.ok(
    check.errors.some((err) => /A2-M1.*math integrity/i.test(err)),
    check.errors.join("; ")
  );
});

test("GAM partial capture accepts repaired A2-M1 math body", () => {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "gam", enriched_by: ["gam"] },
    activities: [
      {
        activity_id: "A2",
        materials: [
          {
            material_id: "A2-M1",
            material_type: "worked_example",
            activity_id: "A2",
            title: "Factorisation Walkthrough",
            body_format: "markdown",
            body: INTACT_A2_M1_BODY
          }
        ]
      }
    ]
  };
  const check = gamEnrich.validateGamPartialPageCapture(page);
  assert.equal(check.ok, true, check.errors.join("; "));
});
