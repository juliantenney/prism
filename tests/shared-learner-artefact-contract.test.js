/**
 * Shared product-family-independent learner artefact contract.
 * Constructed-text producers across Interactive, Assessment Pack, Situated Task;
 * Expository limitation; Journal consumption; persistence.
 */
"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");

const {
  proposeArtefactContractFromLearningJourney,
  resolveArtefactReference,
  resolveLearningJournalEntries,
  renderLearnerPageHtml,
  discoverConstructedTextProducers,
  constructedTextWorkspaceId,
  RESPONSE_KIND_CONSTRUCTED_TEXT
} = require("../lib/learner-renderer-vnext");
const { createLearnerDraftStorage } = require("../lib/learner-renderer-vnext/learner-draft-storage");
const envelope = require("../lib/learner-renderer-vnext/learner-draft-envelope");

function memoryStorage() {
  const map = new Map();
  return {
    getItem(key) {
      return map.has(key) ? map.get(key) : null;
    },
    setItem(key, value) {
      map.set(String(key), String(value));
    },
    removeItem(key) {
      map.delete(String(key));
    }
  };
}

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
        forward_intent: "Carry forward."
      },
      learner_context: { depends_on_prior_work: false },
      pack_forward_orientation: "Use later.",
      elicitations: [
        {
          elicitation_id: elicitationId,
          order: 1,
          evidence_ask: "Write the judgement.",
          epistemic_class: "non_determinate",
          delivery: {
            kind: "constructed_performance",
            prompt: "Write your judgement.",
            response_workspace: { intention: "sustained_written_judgement" }
          },
          formative_return: {
            materials: [{ material_id: "look", body: "Look again." }],
            forward_orientation: "Carry forward."
          }
        }
      ]
    }
  };
}

function interactivePageWithArtefact(title) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "interactive",
    title: title || "Initial judgement",
    activities: [],
    learner_artefacts: {
      produces: [
        {
          elicitation_id: "E1",
          response_kind: "constructed_text",
          label: "Initial judgement",
          prompt: "Write your initial judgement about the case."
        }
      ]
    }
  };
}

function situatedPageWithArtefact(title) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "situated_task",
    title: title || "Situated record",
    activities: [],
    sections: [
      {
        section_id: "s1",
        title: "Undertake",
        order: 1,
        exposition: "Observe the setting."
      }
    ],
    situated_learning: {
      purpose: {
        learning_intent: "Notice",
        activity_rationale: "Practice noticing."
      },
      activity: {
        undertaking: "Observe",
        context: "A workplace",
        learner_agency: "Decide what to note"
      },
      record: {
        retain: "Your notes",
        entries: [
          {
            entry_id: "note-1",
            order: 1,
            label: "Field note",
            prompt: "What did you notice?",
            artefact: {
              elicitation_id: "E1",
              response_kind: "constructed_text"
            }
          },
          {
            entry_id: "scratch",
            order: 2,
            label: "Scratch pad",
            prompt: "Optional working notes."
          }
        ]
      },
      reconnection: { destination: "Later study", use: "Compare notes" }
    }
  };
}

function expositoryPage(title) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "expository",
    page_kind: "expository",
    title: title || "Reading",
    activities: [],
    sections: [
      {
        section_id: "s1",
        title: "Idea",
        order: 1,
        exposition: "Exposition only."
      }
    ]
  };
}

function mixedJournalJourney() {
  return {
    artifact_type: "page",
    product_id: "learning_journey",
    title: "Slippery Case journal producers",
    commissions: [
      {
        commission_id: "c1",
        order: 1,
        product_id: "interactive",
        title: "Initial judgement",
        dependencies: ""
      },
      {
        commission_id: "c7",
        order: 2,
        product_id: "assessment_pack",
        title: "Reconsidered judgement",
        dependencies: ""
      },
      {
        commission_id: "c8",
        order: 3,
        product_id: "assessment_pack",
        title: "Final argument",
        dependencies: ""
      }
    ],
    learning_journey: {
      design_intent: "Developmental journal",
      continuity: "Authentic contributions",
      journal: {
        enabled: true,
        title: "My Learning Journal",
        entries: [
          {
            entry_id: "j1",
            order: 1,
            title: "Initial judgement",
            framing: "Your first written position.",
            artefact_id: "c1.E1"
          },
          {
            entry_id: "j2",
            order: 2,
            title: "Reconsidered judgement",
            framing: "Your revised position.",
            artefact_id: "c7.E1"
          },
          {
            entry_id: "j3",
            order: 3,
            title: "Final argument",
            framing: "Your philosophical argument.",
            artefact_id: "c8.E1"
          }
        ]
      }
    }
  };
}

test("shared contract constants and workspace identity", () => {
  assert.equal(RESPONSE_KIND_CONSTRUCTED_TEXT, "constructed_text");
  assert.equal(constructedTextWorkspaceId("E1"), "learner-constructed-E1");
});

test("Interactive learner_artefacts discovers constructed-text producer", () => {
  const page = interactivePageWithArtefact();
  const producers = discoverConstructedTextProducers(page);
  assert.equal(producers.length, 1);
  assert.equal(producers[0].elicitationId, "E1");
  assert.equal(producers[0].workspaceId, "learner-constructed-E1");
  assert.equal(producers[0].source, "learner_artefacts");
});

test("Interactive render emits stable learner-constructed workspace", () => {
  const page = interactivePageWithArtefact();
  const rendered = renderLearnerPageHtml(page);
  assert.ok(!rendered.error, rendered.error && rendered.error.message);
  assert.match(rendered.html, /data-workspace-id="learner-constructed-E1"/);
  assert.match(rendered.html, /data-workspace-kind="text_entry"/);
  assert.match(rendered.html, /Write your initial judgement/);
});

test("Assessment Pack constructed_performance remains the AP producer path", () => {
  const page = assessmentPage("E1", "Reconsidered");
  const producers = discoverConstructedTextProducers(page);
  assert.equal(producers.length, 1);
  assert.equal(producers[0].workspaceId, "assessment-constructed-E1");
  assert.equal(producers[0].source, "assessment_constructed_performance");
  const rendered = renderLearnerPageHtml(page);
  assert.match(rendered.html, /data-workspace-id="assessment-constructed-E1"/);
});

test("Situated Task artefact-marked entry uses shared constructed workspace id", () => {
  const page = situatedPageWithArtefact();
  const producers = discoverConstructedTextProducers(page);
  assert.equal(producers.length, 1);
  assert.equal(producers[0].elicitationId, "E1");
  assert.equal(producers[0].workspaceId, "learner-constructed-E1");
  assert.equal(producers[0].source, "situated_record_artefact");
  const rendered = renderLearnerPageHtml(page);
  assert.match(rendered.html, /data-workspace-id="learner-constructed-E1"/);
  // Non-artefact scratch entry keeps activity-scoped workspace id.
  assert.match(rendered.html, /data-workspace-id="learner-workspace-situated-record-scratch"/);
});

test("Expository pages do not invent constructed-text producers", () => {
  const producers = discoverConstructedTextProducers(expositoryPage());
  assert.equal(producers.length, 0);
});

test("undeclared Interactive interactions do not invent artefacts", () => {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "interactive",
    title: "Practice",
    activities: [
      {
        activity_id: "A1",
        title: "Practice",
        materials: [
          {
            id: "A1-M1",
            type: "text",
            title: "Notes",
            body: "Read this."
          }
        ]
      }
    ]
  };
  assert.equal(discoverConstructedTextProducers(page).length, 0);
});

test("mixed-producer Journal c1.E1 → c7.E1 → c8.E1 preserves order and identity", () => {
  const proposal = proposeArtefactContractFromLearningJourney({
    page: mixedJournalJourney(),
    constituents: [
      {
        commissionId: "c1",
        productId: "interactive",
        title: "Initial judgement",
        sourcePage: interactivePageWithArtefact("Initial judgement"),
        pageKey: "page-c1"
      },
      {
        commissionId: "c7",
        productId: "assessment_pack",
        title: "Reconsidered judgement",
        sourcePage: assessmentPage("E1", "Reconsidered judgement"),
        pageKey: "page-c7"
      },
      {
        commissionId: "c8",
        productId: "assessment_pack",
        title: "Final argument",
        sourcePage: assessmentPage("E1", "Final argument"),
        pageKey: "page-c8"
      }
    ]
  });

  assert.equal(proposal.ok, true, JSON.stringify(proposal.gaps));
  assert.equal(proposal.journalDeclaredProduceCount, 3);
  assert.deepEqual(
    proposal.contract.produces.map((row) => row.artefactId),
    ["c1.E1", "c7.E1", "c8.E1"]
  );
  assert.equal(proposal.contract.produces[0].workspaceId, "learner-constructed-E1");
  assert.equal(proposal.contract.produces[1].workspaceId, "assessment-constructed-E1");
  assert.equal(proposal.contract.produces[2].workspaceId, "assessment-constructed-E1");
  assert.equal(proposal.contract.produces[0].commissionId, "c1");
  assert.equal(proposal.contract.produces[1].commissionId, "c7");
  assert.equal(proposal.contract.produces[2].commissionId, "c8");
});

test("Interactive and Assessment Pack responses resolve into Journal without fabrication", () => {
  const storage = memoryStorage();
  const api = createLearnerDraftStorage(storage);
  const contract = {
    produces: [
      {
        artefactId: "c1.E1",
        commissionId: "c1",
        workspaceId: "learner-constructed-E1",
        label: "Initial judgement",
        pageKey: "page-c1"
      },
      {
        artefactId: "c7.E1",
        commissionId: "c7",
        workspaceId: "assessment-constructed-E1",
        label: "Reconsidered judgement",
        pageKey: "page-c7"
      },
      {
        artefactId: "c8.E1",
        commissionId: "c8",
        workspaceId: "assessment-constructed-E1",
        label: "Final argument",
        pageKey: "page-c8"
      }
    ],
    references: []
  };

  const draftC1 = envelope.createEmptyEnvelope("page-c1");
  draftC1.workspaces["learner-constructed-E1"] = envelope.createWorkspaceState("text_entry", {
    text: "My authentic initial judgement."
  });
  assert.equal(api.saveLearnerDraft("page-c1", draftC1).ok, true);

  const draftC7 = envelope.createEmptyEnvelope("page-c7");
  draftC7.workspaces["assessment-constructed-E1"] = envelope.createWorkspaceState("text_entry", {
    text: "My reconsidered judgement."
  });
  assert.equal(api.saveLearnerDraft("page-c7", draftC7).ok, true);

  // c8 unanswered — missing must surface truthfully.
  const resources = [
    { commissionId: "c1", title: "Initial judgement", pageKey: "page-c1" },
    { commissionId: "c7", title: "Reconsidered judgement", pageKey: "page-c7" },
    { commissionId: "c8", title: "Final argument", pageKey: "page-c8" }
  ];

  const rows = resolveLearningJournalEntries({
    contract,
    resources,
    storage,
    entries: mixedJournalJourney().learning_journey.journal.entries
  });
  assert.equal(rows.length, 3);
  assert.equal(rows[0].resolution.ok, true);
  assert.equal(rows[0].resolution.text, "My authentic initial judgement.");
  assert.equal(rows[0].resolution.artefactId, "c1.E1");
  assert.equal(rows[0].resolution.commissionId, "c1");
  assert.equal(rows[1].resolution.ok, true);
  assert.equal(rows[1].resolution.text, "My reconsidered judgement.");
  assert.equal(rows[2].resolution.ok, false);
  assert.equal(rows[2].resolution.status, "missing");
  assert.equal(rows[2].resolution.text, "");

  // Update + reload persistence: revised Interactive text is what Journal returns.
  draftC1.workspaces["learner-constructed-E1"] = envelope.createWorkspaceState("text_entry", {
    text: "Revised authentic initial judgement."
  });
  assert.equal(api.saveLearnerDraft("page-c1", draftC1).ok, true);
  const reloaded = resolveArtefactReference({
    contract,
    artefactId: "c1.E1",
    resources,
    storage
  });
  assert.equal(reloaded.ok, true);
  assert.equal(reloaded.text, "Revised authentic initial judgement.");
});

test("Expository journal producer surfaces an explicit family limitation", () => {
  const proposal = proposeArtefactContractFromLearningJourney({
    page: {
      artifact_type: "page",
      product_id: "learning_journey",
      title: "Expository gap",
      commissions: [
        {
          commission_id: "c2",
          order: 1,
          product_id: "expository",
          title: "Reading",
          dependencies: ""
        }
      ],
      learning_journey: {
        journal: {
          enabled: true,
          title: "Journal",
          entries: [
            {
              entry_id: "j1",
              order: 1,
              title: "Impossible",
              framing: "Cannot capture.",
              artefact_id: "c2.E1"
            }
          ]
        }
      }
    },
    constituents: [
      {
        commissionId: "c2",
        productId: "expository",
        title: "Reading",
        sourcePage: expositoryPage()
      }
    ]
  });
  assert.equal(proposal.ok, false);
  assert.equal(proposal.contract.produces.length, 0);
  assert.ok(
    proposal.gaps.some(
      (gap) =>
        gap.code === "journal_producer_family_cannot_capture" &&
        gap.artefactId === "c2.E1" &&
        /Expository/i.test(gap.message)
    ),
    JSON.stringify(proposal.gaps)
  );
});

test("Situated Task constructed artefact resolves through shared contract", () => {
  const storage = memoryStorage();
  const api = createLearnerDraftStorage(storage);
  const page = situatedPageWithArtefact();
  const proposal = proposeArtefactContractFromLearningJourney({
    page: {
      artifact_type: "page",
      product_id: "learning_journey",
      title: "Situated journal",
      commissions: [
        {
          commission_id: "c3",
          order: 1,
          product_id: "situated_task",
          title: "Field",
          dependencies: ""
        }
      ],
      learning_journey: {
        journal: {
          enabled: true,
          title: "Journal",
          entries: [
            {
              entry_id: "j1",
              order: 1,
              title: "Field note",
              framing: "Your note.",
              artefact_id: "c3.E1"
            }
          ]
        }
      }
    },
    constituents: [
      {
        commissionId: "c3",
        productId: "situated_task",
        title: "Field",
        sourcePage: page,
        pageKey: "page-c3"
      }
    ]
  });
  assert.equal(proposal.ok, true, JSON.stringify(proposal.gaps));
  assert.equal(proposal.contract.produces[0].workspaceId, "learner-constructed-E1");

  const draft = envelope.createEmptyEnvelope("page-c3");
  draft.workspaces["learner-constructed-E1"] = envelope.createWorkspaceState("text_entry", {
    text: "I noticed the handover delay."
  });
  assert.equal(api.saveLearnerDraft("page-c3", draft).ok, true);
  const resolved = resolveArtefactReference({
    contract: proposal.contract,
    artefactId: "c3.E1",
    resources: [{ commissionId: "c3", pageKey: "page-c3", title: "Field" }],
    storage
  });
  assert.equal(resolved.ok, true);
  assert.equal(resolved.text, "I noticed the handover delay.");
});
