/**
 * Sprint 103 — four-product artefact consumer proposal + read-only resolution.
 * Focused preflight only; does not prove end-to-end learner journeys.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  proposeArtefactContractFromLearningJourney,
  normalizeArtefactContract,
  resolveArtefactReference,
  renderArtefactReferenceHtml,
  listReferencesForCommission
} = require("../lib/learner-renderer-vnext");
const { createLearnerDraftStorage } = require("../lib/learner-renderer-vnext/learner-draft-storage");
const envelope = require("../lib/learner-renderer-vnext/learner-draft-envelope");
const designPage = require("../lib/learning-journey-design-page.js");
const siblingPrompts = require("../lib/learning-journey-sibling-prompts.js");

function practicePage(title, elicitationId) {
  const eid = elicitationId || "E1";
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "practice",
    page_kind: "practice",
    title: title || "Practice",
    activities: [
      {
        activity_id: "A1",
        title: "Judgement",
        required_materials: [
          {
            material_id: "A1-M1",
            material_type: "template",
            response_fulfilment: {
              kind: "learner_workspace",
              response_kind: "text_compose",
              artefact_elicitation_id: eid
            }
          }
        ],
        materials: [
          {
            id: "A1-M1",
            type: "template",
            title: "Record your judgement",
            body: "Write your judgement."
          }
        ]
      }
    ]
  };
}

function expositoryPage(title) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "expository",
    page_kind: "expository",
    title: title || "Expository",
    activities: [],
    page_synthesis: {
      overview: "Overview",
      learning_purpose: "Purpose",
      knowledge_summary: "Summary points."
    }
  };
}

function situatedPage(title, elicitationId) {
  const eid = elicitationId || "E1";
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "situated_task",
    title: title || "Situated",
    activities: [],
    situated_learning: {
      record: {
        entries: [
          {
            entry_id: eid,
            label: "Field note",
            artefact: {
              elicitation_id: eid,
              response_kind: "constructed_text",
              label: "Field note",
              prompt: "Record what you observed."
            }
          }
        ]
      }
    }
  };
}

function assessmentPage(title, elicitationId) {
  const eid = elicitationId || "E1";
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: title || "Assessment",
    activities: [],
    assessment_evidence: {
      purpose: {
        role: "R1",
        visibility_claim: "Judgement quality.",
        stop_rationale: "Formative stop.",
        forward_intent: "Carry forward."
      },
      learner_context: { depends_on_prior_work: true },
      pack_forward_orientation: "Use earlier work as reference.",
      elicitations: [
        {
          elicitation_id: eid,
          order: 1,
          evidence_ask: "Write an independent judgement.",
          epistemic_class: "non_determinate",
          delivery: {
            kind: "constructed_performance",
            prompt: "Write your independent judgement.",
            response_workspace: { intention: "Independent judgement" }
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

function fourProductJourney() {
  return {
    artifact_type: "page",
    product_id: "learning_journey",
    title: "Evidence-informed clinical judgement",
    learning_journey: {
      journal: {
        enabled: true,
        title: "Judgement journal",
        entries: [
          {
            entry_id: "j1",
            order: 1,
            title: "Initial judgement",
            framing: "Your first reasoned stance.",
            artefact_id: "c1.E1"
          },
          {
            entry_id: "j2",
            order: 2,
            title: "Situated application note",
            framing: "What you recorded in context.",
            artefact_id: "c3.E1"
          },
          {
            entry_id: "j3",
            order: 3,
            title: "Independent assessment",
            framing: "Your assessed judgement.",
            artefact_id: "c4.E1"
          }
        ]
      }
    },
    commissions: [
      {
        commission_id: "c1",
        order: 1,
        product_id: "practice",
        title: "Initial clinical judgement",
        dependencies: ""
      },
      {
        commission_id: "c2",
        order: 2,
        product_id: "expository",
        title: "Evidence frameworks",
        dependencies: "Builds on c1"
      },
      {
        commission_id: "c3",
        order: 3,
        product_id: "situated_task",
        title: "Ward application",
        dependencies: "Requires learner work from c1; informed by c2"
      },
      {
        commission_id: "c4",
        order: 4,
        product_id: "assessment_pack",
        title: "Independent judgement assessment",
        dependencies: "Requires completed responses from c1 and c3"
      }
    ]
  };
}

function constituents() {
  return [
    {
      commissionId: "c1",
      productId: "practice",
      title: "Initial clinical judgement",
      sourcePage: practicePage("Initial clinical judgement", "E1"),
      pageKey: "page-c1"
    },
    {
      commissionId: "c2",
      productId: "expository",
      title: "Evidence frameworks",
      sourcePage: expositoryPage("Evidence frameworks"),
      pageKey: "page-c2"
    },
    {
      commissionId: "c3",
      productId: "situated_task",
      title: "Ward application",
      sourcePage: situatedPage("Ward application", "E1"),
      pageKey: "page-c3"
    },
    {
      commissionId: "c4",
      productId: "assessment_pack",
      title: "Independent judgement assessment",
      sourcePage: assessmentPage("Independent judgement assessment", "E1"),
      pageKey: "page-c4"
    }
  ];
}

function memoryStorage() {
  const map = new Map();
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(String(key), String(value)),
    removeItem: (key) => map.delete(String(key))
  };
}

test("S103 proposal wires Practice→Expository, Practice→Situated, Practice+Situated→Assessment Pack", () => {
  const proposal = proposeArtefactContractFromLearningJourney({
    page: fourProductJourney(),
    constituents: constituents()
  });
  assert.equal(proposal.ok, true, JSON.stringify(proposal.gaps));
  const contract = normalizeArtefactContract(proposal.contract);

  const produceIds = contract.produces.map((row) => row.artefactId).sort();
  // Dependency pairs produce c1 + c3; journal also declares c4 assessment producer.
  assert.deepEqual(produceIds, ["c1.E1", "c3.E1", "c4.E1"].sort());
  assert.equal(
    contract.produces.find((row) => row.artefactId === "c1.E1").workspaceId,
    "learner-constructed-E1"
  );
  assert.equal(
    contract.produces.find((row) => row.artefactId === "c3.E1").workspaceId,
    "learner-constructed-E1"
  );
  assert.equal(
    contract.produces.find((row) => row.artefactId === "c4.E1").workspaceId,
    "assessment-constructed-E1"
  );

  const byConsumer = Object.create(null);
  contract.references.forEach((row) => {
    byConsumer[row.commissionId] = byConsumer[row.commissionId] || [];
    byConsumer[row.commissionId].push(row.artefactId);
  });
  assert.deepEqual(byConsumer.c2, ["c1.E1"]);
  assert.deepEqual(byConsumer.c3.sort(), ["c1.E1"]);
  assert.deepEqual(byConsumer.c4.sort(), ["c1.E1", "c3.E1"].sort());
  assert.equal(listReferencesForCommission(contract, "c1").length, 0);
});

test("S103 proposal does not invent references without named dependencies", () => {
  const page = fourProductJourney();
  page.commissions = page.commissions.map((row) =>
    Object.assign({}, row, { dependencies: "" })
  );
  const proposal = proposeArtefactContractFromLearningJourney({
    page: page,
    constituents: constituents()
  });
  // Journal-only producers may still succeed without consumer references.
  assert.equal(proposal.contract.references.length, 0);
  assert.ok(proposal.journalDeclaredProduceCount >= 1);
});

test("S103 Practice producer resolves into Expository consumer as read-only text", () => {
  const storage = memoryStorage();
  const api = createLearnerDraftStorage(storage);
  const draft = envelope.createEmptyEnvelope("page-c1");
  draft.workspaces["learner-constructed-E1"] = envelope.createWorkspaceState("text_entry", {
    text: "DISTINCTIVE-C1-JUDGEMENT-ALPHA"
  });
  assert.equal(api.saveLearnerDraft("page-c1", draft).ok, true);

  const proposal = proposeArtefactContractFromLearningJourney({
    page: fourProductJourney(),
    constituents: constituents()
  });
  const contract = normalizeArtefactContract(proposal.contract);
  const resolved = resolveArtefactReference({
    contract: contract,
    artefactId: "c1.E1",
    storage: storage,
    resources: [{ commissionId: "c1", pageKey: "page-c1" }]
  });
  assert.equal(resolved.ok, true);
  assert.equal(resolved.text, "DISTINCTIVE-C1-JUDGEMENT-ALPHA");

  const c2Ref = listReferencesForCommission(contract, "c2")[0];
  assert.ok(c2Ref);
  const html = renderArtefactReferenceHtml(resolved, c2Ref, {
    producerTitle: "Initial clinical judgement"
  });
  assert.match(html, /DISTINCTIVE-C1-JUDGEMENT-ALPHA/);
  assert.match(html, /read-only/i);
  assert.doesNotMatch(html, /contenteditable|textarea|<input/i);
  assert.doesNotMatch(html, /data-workspace-kind/);
});

test("S103 commissioning guidance excludes Interactive for new LJ commissions", () => {
  const designPrompt = designPage.buildLearningJourneyDesignPagePrompt();
  assert.match(String(designPrompt), /do not select product_id "interactive"/i);
  assert.match(String(designPrompt), /standalone Create/i);

  const step4 = siblingPrompts.TEMPLATES.learning_commissions;
  assert.match(step4, /Do not commission Interactive on new journeys/i);
  assert.match(step4, /Do not select Interactive Resource for new Learning Journey commissions/i);
  // Standalone / legacy still acknowledged.
  assert.match(step4, /standalone Create and existing\/legacy/i);
});

test("S103 legacy Interactive remains an eligible artefact consumer", () => {
  const page = {
    artifact_type: "page",
    product_id: "learning_journey",
    title: "Legacy interactive consumer",
    commissions: [
      {
        commission_id: "c1",
        order: 1,
        product_id: "assessment_pack",
        title: "Producer",
        dependencies: ""
      },
      {
        commission_id: "c2",
        order: 2,
        product_id: "interactive",
        title: "Legacy consumer",
        dependencies: "Requires c1"
      }
    ]
  };
  const proposal = proposeArtefactContractFromLearningJourney({
    page: page,
    constituents: [
      {
        commissionId: "c1",
        productId: "assessment_pack",
        sourcePage: assessmentPage("Producer", "E1")
      },
      {
        commissionId: "c2",
        productId: "interactive",
        sourcePage: {
          artifact_type: "page",
          product_id: "interactive",
          title: "Legacy",
          activities: []
        }
      }
    ]
  });
  assert.equal(proposal.ok, true, JSON.stringify(proposal.gaps));
  assert.equal(proposal.contract.references.length, 1);
  assert.equal(proposal.contract.references[0].commissionId, "c2");
  assert.equal(proposal.contract.produces[0].artefactId, "c1.E1");
});
