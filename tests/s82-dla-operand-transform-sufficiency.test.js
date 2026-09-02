/**
 * S82 — DLA operand transform sufficiency commissioning (classify/inspect + reframe pattern).
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const dlaContract = require(path.join(repoRoot, "lib", "ld-dla-page-enrich-contract.js"));

const RULE = dlaContract.DLA_OPERAND_TRANSFORM_SUFFICIENCY_COMMISSION;

test("commissioning section carries operand transform sufficiency rule", () => {
  const sections = dlaContract.assembleDlaCanonicalContract().sections;
  assert.ok(RULE);
  assert.match(sections.commissioning, /S82 operand transform sufficiency/i);
  assert.match(sections.commissioning, /rewrite, reframe, transform, or otherwise reconstruct/i);
  assert.match(sections.commissioning, /without adding information/i);
  assert.match(sections.commissioning, /recoverable particulars/i);
  assert.match(sections.commissioning, /label-only judgements, interpretations, or conclusions/i);
  assert.match(sections.commissioning, /evidence-provider rows/i);
});

test("providers section binds evidence requirements to transform sufficiency", () => {
  const providers = dlaContract.assembleDlaCanonicalContract().sections.providers;
  assert.match(providers, /operand transform sufficiency/i);
  assert.match(providers, /rewrite, reframe, transform, or reconstruction without adding information/i);
  assert.match(providers, /purpose, specification, and learner_action/i);
  assert.match(providers, /recoverable particulars/i);
});

test("commissioned rule text is domain-generic", () => {
  assert.doesNotMatch(RULE, /Workshop|A1-M1|feedback statement|excellent communicator/i);
});

test("full assembled contract includes rule once in commissioning body", () => {
  const assembled = dlaContract.assembleDlaCanonicalContract();
  const occurrences = assembled.text.split(RULE).length - 1;
  assert.equal(occurrences, 1);
});
