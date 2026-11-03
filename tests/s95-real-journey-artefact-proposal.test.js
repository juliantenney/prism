/**
 * Sprint 95 integration gate — propose artefact contract from stored LJ metadata.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  proposeArtefactContractFromLearningJourney,
  normalizeArtefactContract
} = require("../lib/learner-renderer-vnext");

function assessmentPage(elicitationId, title) {
  return {
    artifact_type: "page",
    product_id: "assessment_pack",
    title: title || "AP",
    assessment_evidence: {
      elicitations: [
        {
          elicitation_id: elicitationId,
          evidence_ask: "Write the judgement.",
          delivery: {
            kind: "constructed_performance",
            prompt: "Write your independent judgement.",
            response_workspace: { intention: "Independent judgement" }
          }
        }
      ]
    }
  };
}

test("proposeArtefactContractFromLearningJourney derives C5→C6 from dependencies + constructed workspace", () => {
  const page = {
    product_id: "learning_journey",
    title: "DUU-shaped",
    commissions: [
      {
        commission_id: "c5",
        order: 5,
        product_id: "assessment_pack",
        title: "Independent judgement",
        dependencies: ""
      },
      {
        commission_id: "c6",
        order: 6,
        product_id: "assessment_pack",
        title: "Reflect",
        dependencies: "c5"
      }
    ]
  };
  const proposal = proposeArtefactContractFromLearningJourney({
    page,
    constituents: [
      {
        commissionId: "c5",
        productId: "assessment_pack",
        sourcePage: assessmentPage("judgement", "Independent judgement")
      },
      {
        commissionId: "c6",
        productId: "assessment_pack",
        sourcePage: assessmentPage("reflect", "Reflect")
      }
    ]
  });
  assert.equal(proposal.ok, true, JSON.stringify(proposal.gaps));
  const contract = normalizeArtefactContract(proposal.contract);
  assert.equal(contract.produces.length, 1);
  assert.equal(contract.produces[0].commissionId, "c5");
  assert.equal(contract.produces[0].workspaceId, "assessment-constructed-judgement");
  assert.equal(contract.references[0].commissionId, "c6");
  assert.equal(contract.references[0].artefactId, contract.produces[0].artefactId);
});

test("proposeArtefactContractFromLearningJourney reports gap when dependencies omit producer", () => {
  const proposal = proposeArtefactContractFromLearningJourney({
    page: {
      commissions: [
        { commission_id: "c5", order: 1, product_id: "assessment_pack", dependencies: "" },
        { commission_id: "c6", order: 2, product_id: "assessment_pack", dependencies: "" }
      ]
    },
    constituents: [
      {
        commissionId: "c5",
        productId: "assessment_pack",
        sourcePage: assessmentPage("judgement")
      },
      {
        commissionId: "c6",
        productId: "assessment_pack",
        sourcePage: assessmentPage("reflect")
      }
    ]
  });
  assert.equal(proposal.ok, false);
  assert.ok(proposal.gaps.some((g) => g.code === "no_producer_consumer_pair"));
});

test("explicit producer/consumer ids bypass missing dependencies", () => {
  const proposal = proposeArtefactContractFromLearningJourney({
    page: {
      commissions: [
        { commission_id: "c5", order: 1, product_id: "assessment_pack", dependencies: "" },
        { commission_id: "c6", order: 2, product_id: "assessment_pack", dependencies: "" }
      ]
    },
    constituents: [
      {
        commissionId: "c5",
        productId: "assessment_pack",
        sourcePage: assessmentPage("judgement")
      },
      {
        commissionId: "c6",
        productId: "assessment_pack",
        sourcePage: assessmentPage("reflect")
      }
    ],
    producerCommissionId: "c5",
    consumerCommissionId: "c6"
  });
  assert.equal(proposal.ok, true, JSON.stringify(proposal.gaps));
  assert.equal(proposal.contract.produces[0].workspaceId, "assessment-constructed-judgement");
});

test("auto path derives AP→Interactive when dependencies explicitly name the producer", () => {
  const page = {
    commissions: [
      {
        commission_id: "c5",
        order: 5,
        product_id: "assessment_pack",
        dependencies: ""
      },
      {
        commission_id: "c6",
        order: 6,
        product_id: "interactive",
        dependencies: "c5 — learner's completed independent judgement"
      }
    ]
  };
  const constituents = [
    {
      commissionId: "c5",
      productId: "assessment_pack",
      sourcePage: assessmentPage("independent_judgement")
    },
    {
      commissionId: "c6",
      productId: "interactive",
      sourcePage: { product_id: "interactive", title: "Reflect" }
    }
  ];
  const auto = proposeArtefactContractFromLearningJourney({ page, constituents });
  assert.equal(auto.ok, true, JSON.stringify(auto.gaps));
  assert.equal(auto.pairs[0].source, "dependencies");
  assert.equal(auto.pairs[0].consumerProduct, "interactive");
  assert.equal(
    auto.contract.produces[0].workspaceId,
    "assessment-constructed-independent_judgement"
  );
  assert.equal(auto.contract.references[0].commissionId, "c6");
});

test("auto path does not invent pairs from order alone without dependency text", () => {
  const proposal = proposeArtefactContractFromLearningJourney({
    page: {
      commissions: [
        { commission_id: "c5", order: 5, product_id: "assessment_pack", dependencies: "" },
        { commission_id: "c6", order: 6, product_id: "interactive", dependencies: "" }
      ]
    },
    constituents: [
      {
        commissionId: "c5",
        productId: "assessment_pack",
        sourcePage: assessmentPage("independent_judgement")
      },
      {
        commissionId: "c6",
        productId: "interactive",
        sourcePage: { product_id: "interactive", title: "Reflect" }
      }
    ]
  });
  assert.equal(proposal.ok, false);
  assert.ok(proposal.gaps.some((g) => g.code === "no_producer_consumer_pair"));
});
