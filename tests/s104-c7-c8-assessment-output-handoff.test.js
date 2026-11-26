/**
 * Sprint 104 — C7 -> C8 Assessment Pack retained judgement handoff & Learning Journal regression.
 *
 * Verifies:
 * 1. An Assessment Pack with an editable `output_specification` (`assemble` mode)
 *    binds `comm_7.E7` to `assessment-output-<specification_id>` (the current editable
 *    retained judgement), NOT `assessment-constructed-E7` or an earlier snapshot.
 * 2. Assessment Packs without `output_specification` or in `direct_copy` mode
 *    continue to bind to `assessment-constructed-<elicitation_id>`.
 * 3. Entering / editing text in C7's retained judgement workspace ("My transport and
 *    employment judgement") makes `comm_7.E7` retrievable in C8 (Practice) and
 *    increments the Learning Journal count from 2 to 3, while C7 remains independent.
 * 4. Existing learner edits in the retained judgement workspace are preserved on
 *    Assemble and replaced only on explicit "Replace with current responses".
 * 5. Working Situated Task (C4 -> C5, C6) and Practice (C6 -> Journal) handoffs
 *    remain intact.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const producers = require("../lib/learner-renderer-vnext/learner-artefact-producers.js");
const artefactContract = require("../lib/learner-renderer-vnext/learner-artefact-contract.js");
const assessmentOutput = require("../lib/learner-renderer-vnext/assessment-output.js");
const { renderLearnerResourceFragment } = require("../lib/learner-renderer-vnext");
const draftStorage = require("../lib/learner-renderer-vnext/learner-draft-storage.js");
const envelope = require("../lib/learner-renderer-vnext/learner-draft-envelope.js");
const unifiedShell = require("../lib/learning-journey-unified-shell.js");
const ljDesign = require("../lib/learning-journey-design-page.js");
const situatedDesign = require("../lib/situated-task-design-page.js");

function makeMemoryStorage() {
  const map = new Map();
  return {
    getItem(k) {
      return map.has(k) ? map.get(k) : null;
    },
    setItem(k, v) {
      map.set(k, String(v));
    },
    removeItem(k) {
      map.delete(k);
    }
  };
}

function saveTextWorkspace(storageBackend, pageKey, workspaceId, text, extra) {
  const store = draftStorage.createLearnerDraftStorage(storageBackend);
  const loaded = store.loadLearnerDraft(pageKey);
  const draft =
    loaded.ok && loaded.envelope
      ? loaded.envelope
      : envelope.createEmptyEnvelope(pageKey);
  draft.workspaces[workspaceId] = envelope.createWorkspaceState(
    "text_entry",
    Object.assign({ text: text }, extra || {})
  );
  const saved = store.saveLearnerDraft(pageKey, draft);
  assert.equal(saved.ok, true);
}

function buildC7AssessmentPackPage(options) {
  const opts = options && typeof options === "object" ? options : {};
  const evidence = {
    purpose: {
      role: "R1",
      visibility_claim: "Makes transport and employment causal reasoning visible.",
      stop_rationale: "Independent evaluation before companion feedback.",
      forward_intent: "Carry the retained judgement into C8."
    },
    learner_context: { depends_on_prior_work: false },
    pack_forward_orientation: "Keep your transport and employment judgement for the next activity.",
    elicitations: [
      {
        elicitation_id: "E7",
        order: 1,
        evidence_ask: "Evaluate the transport and employment evidence independently.",
        epistemic_class: "non_determinate",
        delivery: {
          kind: "constructed_performance",
          prompt: "Write your independent judgement on the transport and employment evidence.",
          response_workspace: { intention: "Independent causal judgement" }
        },
        formative_return: {
          materials: [
            {
              material_id: "look",
              title: "Self-evaluation",
              body: "Check whether you distinguished correlation from causation."
            }
          ],
          revision: { offered: true, prompt: "Refine your judgement if needed." },
          forward_orientation: "Carry your transport and employment judgement into C8."
        }
      }
    ]
  };
  if (opts.outputMode === "assemble") {
    evidence.output_specification = {
      specification_id: "transport-employment-judgement",
      artefact_title: "My transport and employment judgement",
      audience: "You, for companion feedback and your Learning Journal",
      purpose: "Reproduces your current editable judgement for review and reuse.",
      action_label: "Prepare my transport and employment judgement",
      missing_response_text: "Not yet written.",
      sections: [
        {
          section_id: "sec-judgement",
          order: 1,
          heading: "Transport and employment judgement",
          contributions: [
            {
              contribution_id: "contrib-e7",
              label: "Independent judgement",
              elicitation_id: "E7",
              response_part: "response_text"
            }
          ]
        }
      ]
    };
  } else if (opts.outputMode === "direct_copy") {
    evidence.output_specification = {
      specification_id: "transport-employment-copy",
      artefact_title: "My transport and employment judgement",
      audience: "You",
      purpose: "Copy your response.",
      action_label: "Copy my judgement",
      missing_response_text: "Not yet written.",
      sections: [
        {
          section_id: "sec-judgement",
          order: 1,
          heading: "Transport and employment judgement",
          contributions: [
            {
              contribution_id: "contrib-e7",
              label: "Independent judgement",
              elicitation_id: "E7",
              response_part: "response_text"
            }
          ]
        }
      ]
    };
  }
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: "Independent Transport and Employment Evaluation",
    activities: [],
    metadata: { workflow_id: "wf-c7", page_id: "page-c7" },
    assessment_evidence: evidence
  };
}

test("1. Producer discovery binds editable Assessment Pack retained judgement to assessment-output-<specId> while preserving direct_copy and bare packs", () => {
  const assemblePage = buildC7AssessmentPackPage({ outputMode: "assemble" });
  const assembleProducers = producers.discoverConstructedTextProducers(assemblePage);
  assert.equal(assembleProducers.length, 1);
  assert.equal(assembleProducers[0].elicitationId, "E7");
  assert.equal(
    assembleProducers[0].workspaceId,
    "assessment-output-transport-employment-judgement"
  );
  assert.equal(assembleProducers[0].label, "My transport and employment judgement");
  assert.equal(assembleProducers[0].source, "assessment_output_workspace");

  // Rendered HTML actually contains that exact data-workspace-id
  const rendered = renderLearnerResourceFragment(assemblePage);
  assert.ok(rendered && typeof rendered.html === "string" && rendered.html.length > 0);
  assert.match(
    rendered.html,
    /data-workspace-id="assessment-output-transport-employment-judgement"/
  );

  // direct_copy mode has no separate output textarea -> stays on assessment-constructed-E7
  const directCopyProducers = producers.discoverConstructedTextProducers(
    buildC7AssessmentPackPage({ outputMode: "direct_copy" })
  );
  assert.equal(directCopyProducers[0].workspaceId, "assessment-constructed-E7");

  // Bare Assessment Pack without output_specification -> stays on assessment-constructed-E7
  const bareProducers = producers.discoverConstructedTextProducers(
    buildC7AssessmentPackPage({ outputMode: "none" })
  );
  assert.equal(bareProducers[0].workspaceId, "assessment-constructed-E7");
});

test("2. C7 -> C8 handoff and Learning Journal count (2 -> 3) read authoritative editable retained judgement while preserving C7 independence and C4/C6 handoffs", () => {
  const c4Page = situatedDesign.buildSituatedTaskDesignPageFixture({
    title: "C4 Advertising & Sales Task"
  }).page;
  c4Page.situated_learning = Object.assign({}, c4Page.situated_learning || {}, {
    record: {
      retain: "Keep your initial causal claim.",
      entries: [
        {
          entry_id: "e4",
          order: 1,
          label: "Initial causal claim",
          artefact: { elicitation_id: "E4", response_kind: "constructed_text" }
        }
      ]
    }
  });

  const c6Page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "practice",
    page_kind: "practice",
    title: "C6 Practice Reflection",
    learner_artefacts: {
      produces: [
        {
          elicitation_id: "E6",
          label: "Revised causal claim",
          response_kind: "constructed_text"
        }
      ]
    },
    activities: []
  };

  const c7Page = buildC7AssessmentPackPage({ outputMode: "assemble" });
  const c8Page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "practice",
    page_kind: "practice",
    title: "C8 Companion Feedback",
    activities: []
  };

  const ljFixture = ljDesign.buildLearningJourneyDesignPageFixture({
    title: "Economics Learning Journey"
  });
  const baseComm = ljFixture.page.commissions[0];
  ljFixture.page.commissions = [
    Object.assign({}, baseComm, {
      commission_id: "comm_4",
      section_id: "exp_1",
      order: 1,
      title: "C4 Advertising & Sales Task",
      product_id: "situated_task",
      status: "supported",
      artefact_references: []
    }),
    Object.assign({}, baseComm, {
      commission_id: "comm_5",
      section_id: "exp_2",
      order: 2,
      title: "C5 Alternative Explanations",
      product_id: "practice",
      status: "supported",
      artefact_references: ["comm_4.E4"]
    }),
    Object.assign({}, baseComm, {
      commission_id: "comm_6",
      section_id: "exp_3",
      order: 3,
      title: "C6 Practice Reflection",
      product_id: "practice",
      status: "supported",
      artefact_references: ["comm_4.E4"]
    }),
    Object.assign({}, baseComm, {
      commission_id: "comm_7",
      section_id: "exp_4",
      order: 4,
      title: "C7 Independent Transport Evaluation",
      product_id: "assessment_pack",
      status: "supported",
      artefact_references: []
    }),
    Object.assign({}, baseComm, {
      commission_id: "comm_8",
      section_id: "exp_5",
      order: 5,
      title: "C8 Companion Feedback",
      product_id: "practice",
      status: "supported",
      artefact_references: ["comm_7.E7"]
    })
  ];
  const journalSpec = {
    enabled: true,
    title: "Your Learning Journal",
    entries: [
      {
        entry_id: "j1",
        order: 1,
        title: "Initial claim",
        framing: "Your initial causal claim from C4.",
        artefact_id: "comm_4.E4"
      },
      {
        entry_id: "j2",
        order: 2,
        title: "Revised claim",
        framing: "Your revised causal claim from C6.",
        artefact_id: "comm_6.E6"
      },
      {
        entry_id: "j3",
        order: 3,
        title: "Transport judgement",
        framing: "Your independent transport and employment judgement from C7.",
        artefact_id: "comm_7.E7"
      }
    ]
  };
  ljFixture.page.learning_journey = Object.assign({}, ljFixture.page.learning_journey || {}, {
    journal: journalSpec
  });

  const constituents = [
    { commissionId: "comm_4", pageKey: "page-c4", productId: "situated_task", sourcePage: c4Page },
    { commissionId: "comm_5", pageKey: "page-c5", productId: "practice", sourcePage: { title: "C5" } },
    { commissionId: "comm_6", pageKey: "page-c6", productId: "practice", sourcePage: c6Page },
    { commissionId: "comm_7", pageKey: "page-c7", productId: "assessment_pack", sourcePage: c7Page },
    { commissionId: "comm_8", pageKey: "page-c8", productId: "practice", sourcePage: c8Page }
  ];

  const proposal = artefactContract.proposeArtefactContractFromLearningJourney({
    page: ljFixture.page,
    constituents: constituents
  });
  assert.equal(proposal.ok, true, JSON.stringify(proposal.blockingGaps || []));

  // C7 independence: zero references into comm_7
  assert.equal(
    artefactContract.listReferencesForCommission(proposal.contract, "comm_7").length,
    0
  );
  // C4 -> situated_record_entry, C6 -> practice workspace, C7 -> assessment-output-<specId>
  const c4Prod = proposal.contract.produces.find((p) => p.artefactId === "comm_4.E4");
  const c6Prod = proposal.contract.produces.find((p) => p.artefactId === "comm_6.E6");
  const c7Prod = proposal.contract.produces.find((p) => p.artefactId === "comm_7.E7");
  assert.ok(c4Prod);
  assert.ok(c6Prod);
  assert.ok(c7Prod);
  assert.equal(c7Prod.workspaceId, "assessment-output-transport-employment-judgement");

  const storage = makeMemoryStorage();
  const ackStorage = makeMemoryStorage();
  // Learner has completed C4 and C6 -> Journal count is 2
  saveTextWorkspace(storage, "page-c4", c4Prod.workspaceId, "C4 advertising claim.");
  saveTextWorkspace(storage, "page-c6", c6Prod.workspaceId, "C6 revised reflection.");

  const evalBeforeC7 = artefactContract.evaluateJournalNotifications({
    contract: proposal.contract,
    journalSpec: journalSpec,
    resources: constituents,
    journeyKey: "lj:econ-c7-test",
    storage: storage,
    ackStorage: ackStorage
  });
  assert.equal(evalBeforeC7.count, 2);

  // C4 -> C5 and C4 -> C6 handoffs still resolve cleanly
  const c4Resolved = artefactContract.resolveArtefactReference({
    contract: proposal.contract,
    artefactId: "comm_4.E4",
    resources: constituents,
    storage: storage
  });
  assert.equal(c4Resolved.ok, true);
  assert.equal(c4Resolved.text, "C4 advertising claim.");

  // Learner enters text directly into C7's retained judgement workspace ("My transport and employment judgement")
  // even while assessment-constructed-E7 is empty
  saveTextWorkspace(
    storage,
    "page-c7",
    "assessment-output-transport-employment-judgement",
    "My authoritative retained transport and employment judgement."
  );

  // C8 retrieves C7's current editable retained judgement!
  const c7ForC8 = artefactContract.resolveArtefactReference({
    contract: proposal.contract,
    artefactId: "comm_7.E7",
    resources: constituents,
    storage: storage
  });
  assert.equal(c7ForC8.ok, true);
  assert.equal(c7ForC8.status, "resolved");
  assert.equal(
    c7ForC8.text,
    "My authoritative retained transport and employment judgement."
  );

  // Learning Journal count increments from 2 to 3!
  const evalAfterC7 = artefactContract.evaluateJournalNotifications({
    contract: proposal.contract,
    journalSpec: journalSpec,
    resources: constituents,
    journeyKey: "lj:econ-c7-test",
    storage: storage,
    ackStorage: ackStorage
  });
  assert.equal(evalAfterC7.count, 3);

  // If the original elicitation workspace ALSO has older text, comm_7.E7 STILL resolves
  // the current editable retained judgement (never the original elicitation response)
  saveTextWorkspace(
    storage,
    "page-c7",
    "assessment-constructed-E7",
    "Earlier unedited raw elicitation response."
  );
  saveTextWorkspace(
    storage,
    "page-c7",
    "assessment-output-transport-employment-judgement",
    "Updated learner-edited retained judgement.",
    { assembled_snapshot: "Earlier assembled snapshot." }
  );
  const c7Edited = artefactContract.resolveArtefactReference({
    contract: proposal.contract,
    artefactId: "comm_7.E7",
    resources: constituents,
    storage: storage
  });
  assert.equal(c7Edited.ok, true);
  assert.equal(c7Edited.text, "Updated learner-edited retained judgement.");
});

test("3. Unified shell runtime wires prism:learner-draft-saved so direct edits immediately refresh Journal badge", () => {
  const c7Html = renderLearnerResourceFragment(
    buildC7AssessmentPackPage({ outputMode: "assemble" })
  ).html;
  const ljFixture = ljDesign.buildLearningJourneyDesignPageFixture({
    title: "Economics Learning Journey"
  });
  const firstComm = ljFixture.page.commissions[0];
  firstComm.status = "supported";
  firstComm.product_id = "assessment_pack";
  firstComm.allocated_minutes = 17;
  ljFixture.page.commissions = [firstComm];
  const shell = unifiedShell.buildLearningJourneyUnifiedShellHtml(ljFixture.page, [
    {
      commissionId: firstComm.commission_id,
      title: firstComm.title,
      html: c7Html,
      pageKey: "page-c7",
      productId: "assessment_pack"
    }
  ]);
  assert.equal(shell.ok, true);
  assert.match(shell.html, /document\.addEventListener\('prism:learner-draft-saved',syncJournalNotificationBadge\)/);
});

test("4. installAssessmentOutput preserves direct learner edits on Assemble and only replaces on explicit Replace", () => {
  const c7Page = buildC7AssessmentPackPage({ outputMode: "assemble" });
  const spec = c7Page.assessment_evidence.output_specification;

  function makeNode(attrs) {
    const map = Object.assign({}, attrs || {});
    const listeners = {};
    const node = {
      value: "",
      textContent: "",
      hidden: false,
      getAttribute(k) {
        return Object.prototype.hasOwnProperty.call(map, k) ? map[k] : null;
      },
      setAttribute(k, v) {
        map[k] = String(v);
        if (k === "hidden") node.hidden = true;
      },
      removeAttribute(k) {
        delete map[k];
        if (k === "hidden") node.hidden = false;
      },
      addEventListener(type, fn) {
        if (!listeners[type]) listeners[type] = [];
        listeners[type].push(fn);
      },
      dispatchEvent(ev) {
        const list = listeners[ev && ev.type] || [];
        list.forEach((fn) => fn(ev));
      },
      closest() {
        return null;
      }
    };
    return node;
  }

  const elicitationTextarea = makeNode({});
  elicitationTextarea.value = "Raw E7 elicitation response.";
  const elicitationWorkspace = makeNode({ "data-workspace-id": "assessment-constructed-E7" });
  elicitationWorkspace.querySelector = (sel) => (sel === "textarea" ? elicitationTextarea : null);

  const outputTextarea = makeNode({});
  outputTextarea.value = "Learner typed directly into My transport and employment judgement.";
  const outputWorkspace = makeNode({
    "data-workspace-id": "assessment-output-transport-employment-judgement",
    "data-assessment-output": "true"
  });
  outputWorkspace.querySelector = (sel) => (sel === "textarea" ? outputTextarea : null);

  const statusNode = makeNode({ "data-assessment-output-status": "true" });

  const region = makeNode({
    "data-assessment-output-region": "true",
    "data-assessment-output-mode": "assemble",
    "data-assessment-output-spec": JSON.stringify(spec)
  });

  const assembleBtn = makeNode({ "data-assessment-assemble": "true" });
  assembleBtn.closest = (sel) => {
    if (sel === "[data-assessment-output-region]") return region;
    if (sel === "[data-assessment-assemble]") return assembleBtn;
    return null;
  };
  const replaceBtn = makeNode({ "data-assessment-output-replace": "true" });
  replaceBtn.hidden = true;
  replaceBtn.closest = (sel) => {
    if (sel === "[data-assessment-output-region]") return region;
    if (sel === "[data-assessment-output-replace]") return replaceBtn;
    return null;
  };
  const copyBtn = makeNode({ "data-assessment-output-copy": "true" });
  copyBtn.closest = (sel) => {
    if (sel === "[data-assessment-output-region]") return region;
    if (sel === "[data-assessment-output-copy]") return copyBtn;
    return null;
  };

  region.querySelector = (sel) => {
    if (sel === "[data-assessment-assemble]") return assembleBtn;
    if (sel === "[data-assessment-output-replace]") return replaceBtn;
    if (sel === "[data-assessment-output-copy]") return copyBtn;
    if (sel === "[data-assessment-output]") return outputWorkspace;
    if (sel === "[data-assessment-output-status]") return statusNode;
    return null;
  };

  const scope = makeNode({});
  scope.ownerDocument = { defaultView: null };
  scope.contains = () => true;
  scope.querySelectorAll = (sel) => {
    if (sel === "[data-assessment-output-region]") return [region];
    if (sel === "[data-workspace-id]") return [elicitationWorkspace, outputWorkspace];
    return [];
  };

  assessmentOutput.installAssessmentOutput(scope);

  // Clicking Assemble while learner has direct edits (and no prior snapshot) MUST keep their edits
  scope.dispatchEvent({ type: "click", target: assembleBtn, preventDefault() {} });
  assert.equal(
    outputTextarea.value,
    "Learner typed directly into My transport and employment judgement."
  );
  assert.equal(statusNode.textContent, "Your edits were kept.");

  // Clicking explicit "Replace with current responses" overwrites with assembled output
  scope.dispatchEvent({ type: "click", target: replaceBtn, preventDefault() {} });
  assert.match(outputTextarea.value, /Raw E7 elicitation response\./);
  assert.equal(
    outputWorkspace.getAttribute("data-assessment-assembled-snapshot"),
    outputTextarea.value
  );
  assert.equal(statusNode.textContent, "");
});
