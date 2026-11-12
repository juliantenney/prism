/**
 * Sprint 97 M3 Task 2 — journal-only producer declarations (S97-AD-012).
 */
"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");

const {
  proposeArtefactContractFromLearningJourney,
  normalizeArtefactContract,
  resolveArtefactReference
} = require("../lib/learner-renderer-vnext");
const {
  findProduceDeclaration
} = require("../lib/learner-renderer-vnext/learner-artefact-contract.js");

function assessmentPage(elicitationId, title) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: title || "Assessment",
    activities: [],
    assessment_evidence: {
      purpose: {
        role: "R2",
        visibility_claim: "Judgement quality.",
        stop_rationale: "Formative stop.",
        forward_intent: "Carry the judgement forward."
      },
      learner_context: { depends_on_prior_work: false },
      pack_forward_orientation: "Use the result later.",
      elicitations: [
        {
          elicitation_id: elicitationId,
          order: 1,
          evidence_ask: "Write the independent judgement.",
          epistemic_class: "non_determinate",
          delivery: {
            kind: "constructed_performance",
            prompt: "Write your independent judgement.",
            response_workspace: { intention: "sustained_written_judgement" }
          },
          formative_return: {
            materials: [{ material_id: "look", body: "Look again." }],
            forward_orientation: "Carry the writing forward."
          }
        }
      ]
    }
  };
}

function interactivePage(title) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "interactive",
    title: title || "Interactive",
    activities: []
  };
}

function journeyPage(overrides) {
  const src = overrides && typeof overrides === "object" ? overrides : {};
  const page = {
    artifact_type: "page",
    product_id: "learning_journey",
    title: "Journal producer journey",
    commissions: [
      {
        commission_id: "c5",
        order: 1,
        product_id: "assessment_pack",
        title: "Independent Judgement",
        dependencies: ""
      },
      {
        commission_id: "c6",
        order: 2,
        product_id: "assessment_pack",
        title: "Evaluating Judgement",
        dependencies: src.c6Dependencies != null ? src.c6Dependencies : ""
      }
    ],
    learning_journey: {
      design_intent: "test",
      continuity: "test"
    }
  };
  if (Object.prototype.hasOwnProperty.call(src, "journal")) {
    page.learning_journey.journal = src.journal;
  }
  return page;
}

function constituents() {
  return [
    {
      commissionId: "c5",
      productId: "assessment_pack",
      title: "Independent Judgement",
      sourcePage: assessmentPage("E1", "Independent Judgement")
    },
    {
      commissionId: "c6",
      productId: "assessment_pack",
      title: "Evaluating Judgement",
      sourcePage: assessmentPage("review", "Evaluating Judgement")
    }
  ];
}

test("journal-only producer is declared when elicitation exists and no consumer consumes it", () => {
  const proposal = proposeArtefactContractFromLearningJourney({
    page: journeyPage({
      journal: {
        enabled: true,
        title: "My Learning Journal",
        entries: [
          {
            entry_id: "j1",
            order: 1,
            title: "Initial judgement",
            framing: "Revisit your first written judgement.",
            artefact_id: "c5.E1"
          }
        ]
      }
    }),
    constituents: constituents()
  });
  assert.equal(proposal.ok, true, JSON.stringify(proposal.gaps));
  assert.equal(proposal.journalDeclaredProduceCount, 1);
  const contract = normalizeArtefactContract(proposal.contract);
  assert.equal(contract.produces.length, 1);
  assert.equal(contract.produces[0].artefactId, "c5.E1");
  assert.equal(contract.produces[0].commissionId, "c5");
  assert.equal(contract.produces[0].workspaceId, "assessment-constructed-E1");
  assert.equal(contract.references.length, 0);

  assert.ok(findProduceDeclaration(contract, "c5.E1"));
  const resolved = resolveArtefactReference({
    contract: contract,
    artefactId: "c5.E1",
    storage: {
      getItem: function () {
        return null;
      }
    }
  });
  assert.notEqual(resolved.status, "undeclared");
  assert.equal(resolved.artefactId, "c5.E1");
});

test("existing producer-consumer pair remains intact with or without journal", () => {
  const withoutJournal = proposeArtefactContractFromLearningJourney({
    page: journeyPage({
      c6Dependencies: "Requires the learner's completed response from c5."
    }),
    constituents: constituents()
  });
  assert.equal(withoutJournal.ok, true, JSON.stringify(withoutJournal.gaps));
  assert.equal(withoutJournal.contract.produces.length, 1);
  assert.equal(withoutJournal.contract.produces[0].artefactId, "c5.E1");
  assert.equal(withoutJournal.contract.references.length, 1);
  assert.equal(withoutJournal.contract.references[0].commissionId, "c6");

  const withJournal = proposeArtefactContractFromLearningJourney({
    page: journeyPage({
      c6Dependencies: "Requires the learner's completed response from c5.",
      journal: {
        enabled: true,
        title: "My Learning Journal",
        entries: [
          {
            entry_id: "j1",
            order: 1,
            title: "Initial judgement",
            framing: "Revisit your first written judgement.",
            artefact_id: "c5.E1"
          }
        ]
      }
    }),
    constituents: constituents()
  });
  assert.equal(withJournal.ok, true, JSON.stringify(withJournal.gaps));
  const contract = normalizeArtefactContract(withJournal.contract);
  assert.equal(contract.produces.length, 1);
  assert.equal(contract.produces[0].artefactId, "c5.E1");
  assert.equal(contract.references.length, 1);
  assert.equal(contract.references[0].commissionId, "c6");
});

test("invalid journal reference does not invent a producer declaration", () => {
  const missingElicitation = proposeArtefactContractFromLearningJourney({
    page: journeyPage({
      journal: {
        enabled: true,
        title: "My Learning Journal",
        entries: [
          {
            entry_id: "j1",
            order: 1,
            title: "Missing elicitation",
            framing: "Should fail closed.",
            artefact_id: "c5.E99"
          }
        ]
      }
    }),
    constituents: constituents()
  });
  assert.equal(missingElicitation.ok, false);
  assert.equal(missingElicitation.contract.produces.length, 0);
  assert.ok(
    missingElicitation.gaps.some(function (gap) {
      return gap.code === "journal_producer_elicitation_missing";
    }),
    JSON.stringify(missingElicitation.gaps)
  );

  const missingCommission = proposeArtefactContractFromLearningJourney({
    page: journeyPage({
      journal: {
        enabled: true,
        title: "My Learning Journal",
        entries: [
          {
            entry_id: "j2",
            order: 1,
            title: "Missing commission",
            framing: "Should fail closed.",
            artefact_id: "c9.E1"
          }
        ]
      }
    }),
    constituents: constituents()
  });
  assert.equal(missingCommission.ok, false);
  assert.equal(missingCommission.contract.produces.length, 0);
  assert.ok(
    missingCommission.gaps.some(function (gap) {
      return gap.code === "journal_producer_constituent_missing";
    }),
    JSON.stringify(missingCommission.gaps)
  );
});

test("journey without journal (or disabled journal) acquires no journal-only produces", () => {
  const absent = proposeArtefactContractFromLearningJourney({
    page: journeyPage({}),
    constituents: constituents()
  });
  assert.equal(absent.ok, false);
  assert.equal(absent.contract.produces.length, 0);
  assert.equal(absent.contract.references.length, 0);
  assert.ok(absent.gaps.some((g) => g.code === "no_producer_consumer_pair"));

  const disabled = proposeArtefactContractFromLearningJourney({
    page: journeyPage({
      journal: {
        enabled: false,
        title: "My Learning Journal",
        entries: [
          {
            entry_id: "j1",
            order: 1,
            title: "Ignored",
            framing: "Disabled journal must not declare producers.",
            artefact_id: "c5.E1"
          }
        ]
      }
    }),
    constituents: constituents()
  });
  assert.equal(disabled.ok, false);
  assert.equal(disabled.contract.produces.length, 0);
  assert.equal(disabled.journalDeclaredProduceCount || 0, 0);
});
