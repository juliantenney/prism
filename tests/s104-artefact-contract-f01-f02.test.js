"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const situatedDesignPage = require("../lib/situated-task-design-page.js");
const ljDesignPage = require("../lib/learning-journey-design-page.js");
const ljAssemble = require("../lib/learning-journey-assemble.js");
const ljSiblingPrompts = require("../lib/learning-journey-sibling-prompts.js");
const firstClassFamily = require("../lib/first-class-workflow-family.js");
const {
  proposeArtefactContractFromLearningJourney,
  normalizeArtefactContract,
  resolveArtefactReference,
  resolveLearningJournalEntries,
  listReferencesForCommission,
  discoverConstructedTextProducers
} = require("../lib/learner-renderer-vnext");
const {
  composeSituatedRecordWorkspaces
} = require("../lib/learner-renderer-vnext/compose-situated-record-surfaces");
const { createLearnerDraftStorage } = require("../lib/learner-renderer-vnext/learner-draft-storage");
const draftEnvelope = require("../lib/learner-renderer-vnext/learner-draft-envelope");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap");

function createMemoryStorage() {
  const map = Object.create(null);
  return {
    getItem: function (k) {
      return Object.prototype.hasOwnProperty.call(map, k) ? map[k] : null;
    },
    setItem: function (k, v) {
      map[k] = String(v);
    },
    removeItem: function (k) {
      delete map[k];
    }
  };
}

function makeSituatedPage(options) {
  const opts = options && typeof options === "object" ? options : {};
  const entry = {
    entry_id: opts.entryId || "broadband_advisory_judgement",
    order: 1,
    label: "Your broadband advisory judgement",
    prompt: "Record your advisory judgement on the broadband rollout evidence."
  };
  if (opts.withArtefact !== false) {
    entry.artefact = opts.artefact || {
      elicitation_id: opts.elicitationId || "E4",
      response_kind: "constructed_text"
    };
  }
  return situatedDesignPage.buildSituatedTaskDesignPageFixture({
    title: "Evaluating broadband rollout evidence",
    recordEntries: [entry]
  }).page;
}

function makePracticePage(title, elicitationId) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "practice",
    page_kind: "practice",
    title: title,
    activities: [
      {
        activity_id: "A1",
        title: title,
        required_materials: [
          {
            material_id: "A1-M1",
            material_type: "template",
            response_fulfilment: {
              kind: "learner_workspace",
              response_kind: "text_compose",
              artefact_elicitation_id: elicitationId
            }
          }
        ],
        materials: [
          {
            id: "A1-M1",
            type: "template",
            title: title,
            body: "Write your response."
          }
        ]
      }
    ]
  };
}

function makeAssessmentPackPage(title, elicitationId, dependsOnPriorWork) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: title,
    activities: [],
    assessment_evidence: {
      purpose: {
        role: "R2",
        visibility_claim: "Independent transfer evaluation.",
        stop_rationale: "Formative stop.",
        forward_intent: "Carry forward to evaluative improvement."
      },
      learner_context: { depends_on_prior_work: dependsOnPriorWork === true },
      pack_forward_orientation: "Use in companion feedback.",
      elicitations: [
        {
          elicitation_id: elicitationId,
          order: 1,
          evidence_ask: "Write your independent transport evaluation.",
          epistemic_class: "non_determinate",
          delivery: {
            kind: "constructed_performance",
            prompt: "Evaluate the transport investment claim independently.",
            response_workspace: { intention: "sustained_written_judgement" }
          },
          formative_return: {
            materials: [{ material_id: "m1", body: "Self-check criteria." }],
            forward_orientation: "Continue to companion feedback."
          }
        }
      ]
    }
  };
}

function loadAppTestApi() {
  const loaded = loadPrismAppJsTestApi();
  return (loaded && (loaded.api || loaded.testApi)) || loaded;
}

test("F01: Situated Task receives producer prompt instruction and Copy guidance, and validates entry.artefact + requiredLearnerArtefacts", () => {
  const copyInstructions = situatedDesignPage.buildSituatedTaskDesignPageCopyInstructions();
  assert.match(copyInstructions, /artefact:\s*\{\s*elicitation_id:/);
  assert.match(copyInstructions, /constructed_text/);

  // Missing required artefact E4 fails closed
  const pageWithoutArtefact = makeSituatedPage({ withArtefact: false });
  const missingGate = situatedDesignPage.validateSituatedTaskDesignPage(pageWithoutArtefact, {
    requiredLearnerArtefacts: [{ artefactId: "comm_4.E4", elicitationId: "E4" }]
  });
  assert.equal(missingGate.ok, false);
  assert.ok(
    missingGate.errors.some(function (err) {
      return /missing_required_learner_artefact:E4/.test(err) && /comm_4\.E4/.test(err);
    }),
    JSON.stringify(missingGate.errors)
  );

  // Malformed entry.artefact fails closed
  const badPage = makeSituatedPage({
    artefact: { elicitation_id: "E4", response_kind: "multiple_choice" }
  });
  const badGate = situatedDesignPage.validateSituatedTaskDesignPage(badPage);
  assert.equal(badGate.ok, false);
  assert.ok(
    badGate.errors.some(function (err) {
      return /artefact\.response_kind must be constructed_text/.test(err);
    }),
    JSON.stringify(badGate.errors)
  );

  // Valid structural repair preserving original entry_id passes and emits learner-constructed-E4
  const repairedPage = makeSituatedPage({
    entryId: "broadband_advisory_judgement",
    withArtefact: true,
    elicitationId: "E4"
  });
  const validGate = situatedDesignPage.validateSituatedTaskDesignPage(repairedPage, {
    requiredLearnerArtefacts: [{ artefactId: "comm_4.E4", elicitationId: "E4" }]
  });
  assert.equal(validGate.ok, true, JSON.stringify(validGate.errors));

  const workspaces = composeSituatedRecordWorkspaces(repairedPage);
  assert.equal(workspaces.length, 1);
  assert.equal(workspaces[0].workspaceId, "learner-constructed-E4");
  assert.equal(workspaces[0].artefactElicitationId, "E4");

  const producers = discoverConstructedTextProducers(repairedPage);
  assert.equal(producers.length, 1);
  assert.equal(producers[0].elicitationId, "E4");
  assert.equal(producers[0].workspaceId, "learner-constructed-E4");

  // app.js composeCommissionedLearnerArtefactProducerInstruction supports situated_task
  const api = loadAppTestApi();
  const stWf = {
    id: "wf_c4",
    product: "situated_task",
    workflowBriefResolution: {
      resolvedFactors: {
        commission_product_id: "situated_task",
        source_commission_id: "comm_4",
        required_learner_artefacts: [
          { artefactId: "comm_4.E4", elicitationId: "E4", title: "Original broadband judgement" }
        ]
      }
    }
  };
  const instruction = api.composeCommissionedLearnerArtefactProducerInstruction(stWf);
  assert.match(instruction, /SHARED LEARNER ARTEFACT PRODUCER REQUIREMENT/);
  assert.match(instruction, /situated_learning\.record\.entries\[\]/);
  assert.match(instruction, /elicitation_id "E4"/);
  assert.match(instruction, /comm_4\.E4/);
});

test("Safeguard 2: listRequiredLearnerArtefactsForCommission discovers both Journal entries and downstream artefact_references, deduplicated", () => {
  const page = {
    artifact_type: "page",
    product_id: "learning_journey",
    commissions: [
      { commission_id: "comm_4", order: 4, title: "Broadband situated task", product_id: "situated_task", artefact_references: [] },
      {
        commission_id: "comm_6",
        order: 6,
        title: "Broadband refinement",
        product_id: "practice",
        artefact_references: ["comm_4.E4", "comm_4.E4_aux"]
      }
    ],
    learning_journey: {
      journal: {
        enabled: true,
        title: "Learning Journal",
        entries: [
          {
            entry_id: "j1",
            order: 1,
            title: "Original broadband judgement",
            framing: "Your broadband advisory judgement.",
            artefact_id: "comm_4.E4"
          }
        ]
      }
    }
  };

  const reqs = ljDesignPage.listRequiredLearnerArtefactsForCommission(page, "comm_4");
  assert.equal(reqs.length, 2);
  // E4 appears in both Journal and comm_6.artefact_references -> deduplicated with exact identity
  const e4 = reqs.find(function (r) { return r.elicitationId === "E4"; });
  assert.ok(e4);
  assert.equal(e4.artefactId, "comm_4.E4");
  assert.equal(e4.entryId, "j1");
  assert.deepEqual(e4.sources.sort(), ["downstream_reference", "journal"]);
  assert.deepEqual(e4.consumerCommissionIds, ["comm_6"]);

  // E4_aux is downstream-only (not in Journal) -> still discovered
  const e4Aux = reqs.find(function (r) { return r.elicitationId === "E4_aux"; });
  assert.ok(e4Aux);
  assert.equal(e4Aux.artefactId, "comm_4.E4_aux");
  assert.deepEqual(e4Aux.sources, ["downstream_reference"]);
  assert.deepEqual(e4Aux.consumerCommissionIds, ["comm_6"]);
});

test("Safeguard 3: newly generated progressive LJs require explicit artefact_references[] while preserving legacy optional compatibility", () => {
  assert.match(ljSiblingPrompts.PROGRESSIVE_TEMPLATES.learning_commissions, /artefact_references/);
  const builtFamily = firstClassFamily.buildFirstClassWorkflowFamily({
    product: "learning_journey",
    focus: "Correlation and Causation",
    duration: "90 minutes"
  });
  assert.equal(builtFamily.ok, true);
  assert.equal(builtFamily.deliverySeed.artefact_references_contract_version, "s104_f02");

  const baseStage4 = {
    artifact_type: "learning_journey_stage",
    schema_version: "1.0.0",
    stage: "learning_commissions",
    shared_authoritative_material: { status: "none", content: "" },
    commissions: [
      {
        commission_id: "comm_1",
        section_id: "exp_1",
        order: 1,
        title: "First",
        product_id: "situated_task",
        status: "supported",
        allocated_minutes: 15,
        specification_text:
          'Do task.\n<<<COMPONENT_LEARNING_OUTCOMES_BEGIN>>>\n{"learning_outcomes":[{"statement":"Analyse evidence.","related_concepts":["Evidence"],"cognitive_level":"analyse"}]}\n<<<COMPONENT_LEARNING_OUTCOMES_END>>>',
        journey_context_text: "Opening.",
        dependencies: "",
        element_ids: ["E1"]
      },
      {
        commission_id: "comm_2",
        section_id: "exp_2",
        order: 2,
        title: "Second",
        product_id: "assessment_pack",
        status: "supported",
        allocated_minutes: 15,
        specification_text:
          'Independent transfer.\n<<<COMPONENT_LEARNING_OUTCOMES_BEGIN>>>\n{"learning_outcomes":[{"statement":"Evaluate claim.","related_concepts":["Evaluation"],"cognitive_level":"evaluate"}]}\n<<<COMPONENT_LEARNING_OUTCOMES_END>>>',
        journey_context_text: "Independent.",
        dependencies: "comm_1",
        element_ids: ["E2"]
      }
    ],
    continuity: "Clean progression.",
    journal: { enabled: false, decision_basis: "Short probe." },
    feasibility_note: "Feasible."
  };

  // Legacy compatibility (requireArtefactReferences omitted): passes without artefact_references
  const legacyGate = ljAssemble.validateLearningJourneyCommissionsPartial(baseStage4, {});
  assert.equal(legacyGate.ok, true, JSON.stringify(legacyGate.errors));

  // Newly generated progressive LJ (requireArtefactReferences: true): rejects missing artefact_references
  const strictMissing = ljAssemble.validateLearningJourneyCommissionsPartial(baseStage4, {
    requireArtefactReferences: true
  });
  assert.equal(strictMissing.ok, false);
  assert.ok(
    strictMissing.errors.some(function (e) { return /artefact_references required/.test(e); }),
    JSON.stringify(strictMissing.errors)
  );

  // Explicit [] and valid preceding reference pass; forward reference fails
  const strictValid = JSON.parse(JSON.stringify(baseStage4));
  strictValid.commissions[0].artefact_references = [];
  strictValid.commissions[1].artefact_references = [];
  assert.equal(
    ljAssemble.validateLearningJourneyCommissionsPartial(strictValid, { requireArtefactReferences: true }).ok,
    true
  );

  const forwardRef = JSON.parse(JSON.stringify(strictValid));
  forwardRef.commissions[0].artefact_references = ["comm_2.E2"];
  const forwardGate = ljAssemble.validateLearningJourneyCommissionsPartial(forwardRef, {
    requireArtefactReferences: true
  });
  assert.equal(forwardGate.ok, false);
  assert.ok(
    forwardGate.errors.some(function (e) { return /producer_must_precede_consumer/.test(e); }),
    JSON.stringify(forwardGate.errors)
  );
});

test("Safeguard 1 & F02: independent Assessment Pack with explicit non-empty artefact_references fails closed as a contradictory design contract", () => {
  const page = {
    artifact_type: "page",
    product_id: "learning_journey",
    title: "Economics",
    commissions: [
      { commission_id: "comm_6", order: 6, title: "Broadband refinement", product_id: "practice", dependencies: "", artefact_references: [] },
      {
        commission_id: "comm_7",
        order: 7,
        title: "Independent transport assessment",
        product_id: "assessment_pack",
        dependencies: "comm_6",
        artefact_references: ["comm_6.E6"]
      }
    ]
  };
  const constituents = [
    { commissionId: "comm_6", productId: "practice", title: "Broadband refinement", sourcePage: makePracticePage("Broadband refinement", "E6") },
    { commissionId: "comm_7", productId: "assessment_pack", title: "Independent transport assessment", sourcePage: makeAssessmentPackPage("Independent transport assessment", "E7", false) }
  ];

  const proposal = proposeArtefactContractFromLearningJourney({ page, constituents });
  assert.equal(proposal.ok, false);
  assert.equal(listReferencesForCommission(proposal.contract, "comm_7").length, 0);
  assert.ok(
    proposal.blockingGaps.some(function (g) {
      return g.code === "conflicting_independent_assessment_artefact_reference" && g.consumerCommissionId === "comm_7";
    }),
    JSON.stringify(proposal.blockingGaps)
  );
  assert.ok(
    proposal.conflicts.some(function (c) {
      return c.code === "conflicting_independent_assessment_artefact_reference";
    }),
    JSON.stringify(proposal.conflicts)
  );
});

test("F01 fail-closed & Safeguard 4: missing comm_4.E4 blocks unified proposal with actionable diagnostics even when comm_6/7/8 resolve", () => {
  const page = {
    artifact_type: "page",
    product_id: "learning_journey",
    title: "Correlation and Causation",
    commissions: [
      { commission_id: "comm_4", order: 4, title: "Broadband task", product_id: "situated_task", dependencies: "" },
      { commission_id: "comm_6", order: 6, title: "Broadband refinement", product_id: "practice", dependencies: "comm_4" },
      { commission_id: "comm_7", order: 7, title: "Independent transport assessment", product_id: "assessment_pack", dependencies: "comm_6" },
      { commission_id: "comm_8", order: 8, title: "Evaluative improvement", product_id: "practice", dependencies: "comm_7" }
    ],
    learning_journey: {
      journal: {
        enabled: true,
        title: "Learning Journal",
        entries: [
          { entry_id: "j1", order: 1, title: "Original broadband judgement", artefact_id: "comm_4.E4" },
          { entry_id: "j2", order: 2, title: "Refined broadband judgement", artefact_id: "comm_6.E6" },
          { entry_id: "j3", order: 3, title: "Independent transport evaluation", artefact_id: "comm_7.E7" },
          { entry_id: "j4", order: 4, title: "Refined transport evaluation", artefact_id: "comm_8.E8" }
        ]
      }
    }
  };

  const brokenConstituents = [
    { commissionId: "comm_4", productId: "situated_task", title: "Broadband task", sourcePage: makeSituatedPage({ withArtefact: false }) },
    { commissionId: "comm_6", productId: "practice", title: "Broadband refinement", sourcePage: makePracticePage("Broadband refinement", "E6") },
    { commissionId: "comm_7", productId: "assessment_pack", title: "Independent transport assessment", sourcePage: makeAssessmentPackPage("Independent transport assessment", "E7", false) },
    { commissionId: "comm_8", productId: "practice", title: "Evaluative improvement", sourcePage: makePracticePage("Evaluative improvement", "E8") }
  ];

  const broken = proposeArtefactContractFromLearningJourney({ page, constituents: brokenConstituents });
  assert.equal(broken.ok, false, "Unresolved Journal entry j1 must fail closed");
  const j1Gap = broken.blockingGaps.find(function (g) {
    return g.code === "journal_producer_elicitation_missing" && g.entryId === "j1" && g.artefactId === "comm_4.E4";
  });
  assert.ok(j1Gap, JSON.stringify(broken.blockingGaps));
  assert.equal(j1Gap.producerCommissionId, "comm_4");
  assert.match(j1Gap.message, /situated_learning\.record\.entries\[\]/);
  assert.match(j1Gap.message, /elicitation_id:\s*"E4"/);
});

test("Repaired Economics journey topology verifies all 5 required continuity & Journal invariants", () => {
  // Existing accepted Economics parent LJ (legacy without artefact_references[]) + repaired C4
  const page = {
    artifact_type: "page",
    product_id: "learning_journey",
    title: "Correlation and Causation: Making Sense of Economic Evidence",
    commissions: [
      { commission_id: "comm_4", order: 4, title: "Broadband situated task", product_id: "situated_task", dependencies: "" },
      { commission_id: "comm_6", order: 6, title: "Broadband refinement", product_id: "practice", dependencies: "comm_4" },
      { commission_id: "comm_7", order: 7, title: "Independent transport assessment", product_id: "assessment_pack", dependencies: "comm_6" },
      { commission_id: "comm_8", order: 8, title: "Transport evaluative improvement", product_id: "practice", dependencies: "comm_7" }
    ],
    learning_journey: {
      journal: {
        enabled: true,
        title: "Learning Journal",
        entries: [
          { entry_id: "j1", order: 1, title: "Original broadband judgement", artefact_id: "comm_4.E4" },
          { entry_id: "j2", order: 2, title: "Refined broadband judgement", artefact_id: "comm_6.E6" },
          { entry_id: "j3", order: 3, title: "Independent transport evaluation", artefact_id: "comm_7.E7" },
          { entry_id: "j4", order: 4, title: "Refined transport evaluation", artefact_id: "comm_8.E8" }
        ]
      }
    }
  };

  const constituents = [
    { commissionId: "comm_4", productId: "situated_task", title: "Broadband situated task", sourcePage: makeSituatedPage({ entryId: "broadband_advisory_judgement", withArtefact: true, elicitationId: "E4" }) },
    { commissionId: "comm_6", productId: "practice", title: "Broadband refinement", sourcePage: makePracticePage("Broadband refinement", "E6") },
    { commissionId: "comm_7", productId: "assessment_pack", title: "Independent transport assessment", sourcePage: makeAssessmentPackPage("Independent transport assessment", "E7", false) },
    { commissionId: "comm_8", productId: "practice", title: "Transport evaluative improvement", sourcePage: makePracticePage("Transport evaluative improvement", "E8") }
  ];

  const proposal = proposeArtefactContractFromLearningJourney({ page, constituents });
  assert.equal(proposal.ok, true, JSON.stringify(proposal.gaps));
  assert.equal(proposal.blockingGaps.length, 0);
  assert.equal(proposal.conflicts.length, 0);

  const contract = normalizeArtefactContract(proposal.contract);
  const producedIds = contract.produces.map(function (p) { return p.artefactId; }).sort();
  assert.deepEqual(producedIds, ["comm_4.E4", "comm_6.E6", "comm_7.E7", "comm_8.E8"]);

  // 1. C4 original broadband response -> C6 refinement
  const c6Refs = listReferencesForCommission(contract, "comm_6");
  assert.deepEqual(c6Refs.map(function (r) { return r.artefactId; }), ["comm_4.E4"]);

  // 2. C7 independent assessment has NO reference to earlier written responses
  const c7Refs = listReferencesForCommission(contract, "comm_7");
  assert.deepEqual(c7Refs, []);

  // 3. C7 assessment response -> C8 evaluative improvement
  const c8Refs = listReferencesForCommission(contract, "comm_8");
  assert.deepEqual(c8Refs.map(function (r) { return r.artefactId; }), ["comm_7.E7"]);

  // 4 & 5. C4 -> Journal and all four intended Journal entries resolve from saved drafts
  const mem = createMemoryStorage();
  const storage = createLearnerDraftStorage(mem);
  const resources = [
    { commissionId: "comm_4", title: "Broadband situated task", pageKey: "page-c4" },
    { commissionId: "comm_6", title: "Broadband refinement", pageKey: "page-c6" },
    { commissionId: "comm_7", title: "Independent transport assessment", pageKey: "page-c7" },
    { commissionId: "comm_8", title: "Transport evaluative improvement", pageKey: "page-c8" }
  ];
  function saveDraft(pageKey, wsId, text) {
    const env = draftEnvelope.createEmptyEnvelope(pageKey);
    env.workspaces[wsId] = draftEnvelope.createWorkspaceState("text_entry", { text: text });
    storage.saveLearnerDraft(pageKey, env);
  }
  saveDraft("page-c4", "learner-constructed-E4", "Initial broadband judgement.");
  saveDraft("page-c6", "learner-constructed-E6", "Refined broadband judgement.");
  saveDraft("page-c7", "assessment-constructed-E7", "Independent transport evaluation.");
  saveDraft("page-c8", "learner-constructed-E8", "Refined transport evaluation.");

  const c4Ref = resolveArtefactReference({ contract, artefactId: "comm_4.E4", resources, storage: mem });
  assert.equal(c4Ref.ok, true);
  assert.equal(c4Ref.text, "Initial broadband judgement.");

  const journalRows = resolveLearningJournalEntries({
    journalSpec: page.learning_journey.journal,
    contract,
    resources,
    storage: mem
  });
  assert.equal(journalRows.length, 4);
  journalRows.forEach(function (row) {
    assert.equal(row.resolution.ok, true, "Journal entry failed: " + row.entryId);
    assert.equal(row.resolution.status, "resolved");
  });
});

test("Safeguard 5: diagnostic inspection override cannot permit ordinary learner-facing publication or download", () => {
  const appSrc = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
  assert.match(
    appSrc,
    /var canDiagnosticBypass =\s*opts\.allowUnresolvedArtefactContract === true &&\s*opts\.diagnosticInspectionOnly === true &&\s*opts\.skipDownload === true &&\s*opts\.download !== true;/
  );
  assert.match(
    appSrc,
    /var shouldDownload =\s*!unresolvedBypassForDiagnosticOnly &&\s*\(opts\.download === true \|\| opts\.skipDownload !== true\);/
  );
});
