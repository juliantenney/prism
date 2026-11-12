/**
 * Sprint 97 M3 Task 1 — Learning Journal reasoning in the LJ pipeline.
 * Prompt guidance (Steps 1–4) + Design Page emit/validate of learning_journey.journal.
 */
"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");

const sibling = require("../lib/learning-journey-sibling-prompts.js");
const design = require("../lib/learning-journey-design-page.js");
const family = require("../lib/first-class-workflow-family.js");

function cloneFixturePage() {
  const built = design.buildLearningJourneyDesignPageFixture({});
  assert.equal(built.ok, true);
  return JSON.parse(JSON.stringify(built.page));
}

test("Steps 1–4 prompts include proportionate non-mandatory journal guidance", () => {
  const req = sibling.TEMPLATES.learning_requirements;
  const prog = sibling.TEMPLATES.learning_progression;
  const el = sibling.TEMPLATES.learning_elements;
  const comm = sibling.TEMPLATES.learning_commissions;

  assert.match(req, /LEARNING JOURNAL/);
  assert.match(req, /Do not treat journalling as mandatory/);
  assert.match(prog, /LEARNING JOURNAL \(optional\)/);
  assert.match(prog, /Do not mandate a journal/);
  assert.match(el, /Learning Journal is not itself a learning element/);
  assert.match(el, /without inventing elements solely for journalling/);
  assert.match(comm, /LEARNING JOURNAL \(journey-level, optional\)/);
  assert.match(comm, /not a PRISM product commission/);
  assert.match(comm, /\{commission_id\}\.\{elicitation_id\}/);
  assert.match(comm, /Do not make journalling mandatory/);
  assert.match(comm, /do not impose a fixed journal taxonomy/);
});

test("Design Page prompt and copy emit learning_journey.journal contract", () => {
  const prompt = design.buildLearningJourneyDesignPagePrompt();
  const copy = design.buildLearningJourneyDesignPageCopyInstructions();
  assert.match(prompt, /"journal"/);
  assert.match(prompt, /"enabled": false/);
  assert.match(prompt, /"entries": \[\]/);
  assert.match(prompt, /learning_journey\.journal/);
  assert.match(prompt, /\{commission_id\}\.\{elicitation_id\}/);
  assert.match(prompt, /Do not make journalling mandatory/);
  assert.match(copy, /learning_journey\.journal/);
  assert.match(copy, /enabled false when not justified/);
});

test("Commissioning / Design Page step roles mention journal lightly", () => {
  const wf = family.buildFirstClassWorkflowFamily({
    product: "learning_journey",
    focus: "journal pipeline smoke",
    startingPoint: "brief"
  });
  assert.equal(wf.ok, true);
  const commissioning = wf.steps.find((s) => /Commissioning/i.test(s.title));
  const designPage = wf.steps.find((s) => /Design Page/i.test(s.title));
  assert.match(String(commissioning.role), /Learning Journal/i);
  assert.match(String(designPage.role), /learning_journey\.journal/i);
});

test("Absent journal remains valid (backward compatible fixture)", () => {
  const page = cloneFixturePage();
  assert.equal(Object.prototype.hasOwnProperty.call(page.learning_journey, "journal"), false);
  assert.equal(design.validateLearningJourneyDesignPage(page).ok, true);
  assert.equal(design.normalizeLearningJourneyJournal(undefined), null);
  assert.equal(design.normalizeLearningJourneyJournal(null), null);
});

test("enabled:false journal validates and normalises empty entries", () => {
  const page = cloneFixturePage();
  page.learning_journey.journal = {
    enabled: false,
    title: "Your Learning Journal",
    entries: [{ entry_id: "j1", order: 1, title: "x", framing: "y", artefact_id: "c1.E1" }]
  };
  const gate = design.validateLearningJourneyDesignPage(page);
  assert.equal(gate.ok, true, gate.errors && gate.errors.join(", "));
  const norm = design.normalizeLearningJourneyJournal(page.learning_journey.journal);
  assert.equal(norm.enabled, false);
  assert.deepEqual(norm.entries, []);
});

test("enabled journal requires grounded {commission_id}.{elicitation_id}", () => {
  const page = cloneFixturePage();
  page.learning_journey.journal = {
    enabled: true,
    title: "My Learning Journal",
    entries: [
      {
        entry_id: "j1",
        order: 1,
        title: "Initial judgement",
        framing: "Revisit your first written judgement before weighing later evidence.",
        artefact_id: "c1.E1"
      }
    ]
  };
  assert.equal(design.validateLearningJourneyDesignPage(page).ok, true);

  page.learning_journey.journal.entries[0].artefact_id = "missing.E1";
  let gate = design.validateLearningJourneyDesignPage(page);
  assert.equal(gate.ok, false);
  assert.ok(gate.errors.some((e) => /commission_id not declared:missing/.test(e)));

  page.learning_journey.journal.entries[0].artefact_id = "not-a-compound-id";
  gate = design.validateLearningJourneyDesignPage(page);
  assert.equal(gate.ok, false);
  assert.ok(gate.errors.some((e) => /artefact_id must be \{commission_id\}\.\{elicitation_id\}/.test(e)));
});

test("enabled journal without entries fails closed", () => {
  const page = cloneFixturePage();
  page.learning_journey.journal = { enabled: true, title: "Journal", entries: [] };
  const gate = design.validateLearningJourneyDesignPage(page);
  assert.equal(gate.ok, false);
  assert.ok(gate.errors.includes("learning_journey.journal.entries required when enabled"));
});
