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
  assert.match(req, /Functional continuity/);
  assert.match(req, /Developmental visibility/);
  assert.match(prog, /LEARNING JOURNAL \(optional\)/);
  assert.match(prog, /Do not mandate a journal/);
  assert.match(prog, /Developmental visibility alone can justify/);
  assert.match(prog, /Do not treat a Journal as additional reflective writing/);
  assert.match(el, /Learning Journal is not itself a learning element/);
  assert.match(el, /developmental visibility/i);
  assert.match(el, /Do not invent elements solely for journalling/);
  assert.match(comm, /LEARNING JOURNAL \(journey-level, optional\)/);
  assert.match(comm, /not a PRISM product commission/);
  assert.match(comm, /\{commission_id\}\.\{elicitation_id\}/);
  assert.match(comm, /Do not make journalling mandatory/);
  assert.match(comm, /Do not impose a fixed journal taxonomy/);
  assert.match(comm, /FUNCTIONAL CONTINUITY/);
  assert.match(comm, /DEVELOPMENTAL VISIBILITY/);
  assert.match(
    comm,
    /Developmental visibility is a legitimate and sufficient reason/
  );
  assert.match(
    comm,
    /default is to include a lightweight Journal unless there is a specific educational reason not to/
  );
  assert.match(comm, /Carry that full producer set forward so Design Page/);
  assert.match(comm, /Do not invent activities or Assessment Packs solely/);
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
  assert.match(prompt, /developmental visibility/i);
  assert.match(prompt, /Honour the Step 4 Learning Journal decision/);
  assert.match(copy, /learning_journey\.journal/);
  assert.match(copy, /enabled false when not justified/);
  assert.match(copy, /Step 4 decision/);
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

test("Design Page preserves mixed Interactive/Assessment Pack journal producers c1.E1→c7.E1→c8.E1", () => {
  const page = cloneFixturePage();
  page.commissions = [
    {
      commission_id: "c1",
      section_id: "exp_1",
      order: 1,
      title: "Initial judgement",
      product_id: "interactive",
      status: "supported",
      specification_text:
        "Interactive Resource eliciting an initial written judgement (elicitation_id E1) for the developmental arc.",
      journey_context_text:
        "Opening experience. No recurring scenario beyond the case introduced here.",
      dependencies: ""
    },
    {
      commission_id: "c7",
      section_id: "exp_2",
      order: 2,
      title: "Reconsideration",
      product_id: "assessment_pack",
      status: "supported",
      specification_text:
        "Assessment Pack constructed_performance (E1) where learners reconsider their earlier judgement.",
      journey_context_text:
        "Learners bring forward their initial Interactive judgement from c1 before reconsidering.",
      dependencies: "c1"
    },
    {
      commission_id: "c8",
      section_id: "exp_2",
      order: 3,
      title: "Final argument",
      product_id: "assessment_pack",
      status: "supported",
      specification_text:
        "Assessment Pack constructed_performance (E1) for the final constructed argument.",
      journey_context_text:
        "Learners bring forward earlier judgements from c1 and c7 when constructing the final argument.",
      dependencies: "c1 c7"
    }
  ];
  page.sections = [
    {
      section_id: "journey_intro",
      title: "About this journey",
      order: 1,
      exposition: "Form an initial judgement, encounter challenges, then construct a final argument."
    },
    {
      section_id: "exp_1",
      title: "Initial judgement",
      order: 2,
      exposition: "Record your first written judgement."
    },
    {
      section_id: "exp_2",
      title: "Later judgements",
      order: 3,
      exposition: "Reconsider and then construct a final argument."
    }
  ];
  page.learning_journey.journal = {
    enabled: true,
    title: "Your Learning Journal",
    entries: [
      {
        entry_id: "j1",
        order: 1,
        title: "Your initial judgement",
        framing: "Look back at the first judgement you wrote before the challenges.",
        artefact_id: "c1.E1"
      },
      {
        entry_id: "j2",
        order: 2,
        title: "Your reconsideration",
        framing: "Compare how your reasoning shifted after encountering the challenges.",
        artefact_id: "c7.E1"
      },
      {
        entry_id: "j3",
        order: 3,
        title: "Your final argument",
        framing: "Inspect the final argument you constructed.",
        artefact_id: "c8.E1"
      }
    ]
  };

  const gate = design.validateLearningJourneyDesignPage(page);
  assert.equal(gate.ok, true, gate.errors && gate.errors.join("; "));
  const norm = design.normalizeLearningJourneyJournal(page.learning_journey.journal);
  assert.equal(norm.enabled, true);
  assert.deepEqual(
    norm.entries.map((e) => e.artefact_id),
    ["c1.E1", "c7.E1", "c8.E1"]
  );
  assert.equal(page.commissions.find((c) => c.commission_id === "c1").product_id, "interactive");
  assert.equal(
    page.commissions.find((c) => c.commission_id === "c7").product_id,
    "assessment_pack"
  );
});

test("Design Page journal guidance preserves all Step 4 producers including Interactive", () => {
  const prompt = design.buildLearningJourneyDesignPagePrompt();
  const copy = design.buildLearningJourneyDesignPageCopyInstructions();
  assert.match(prompt, /emit an entry for EVERY declared producer/i);
  assert.match(prompt, /Interactive Resource/i);
  assert.match(prompt, /Do not silently omit/i);
  assert.match(prompt, /still keep the journal entry/i);
  assert.match(prompt, /editing residue/i);
  assert.match(copy, /including Interactive Resource producers/i);
  assert.match(copy, /do not silently drop an initial contribution/i);

  const comm = sibling.TEMPLATES.learning_commissions;
  assert.match(comm, /List EVERY journalable producer in developmental order/);
  assert.match(comm, /Interactive Resource producers are legitimate/);
  assert.match(comm, /still name it in the Journal decision/);
});
