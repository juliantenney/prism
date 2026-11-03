/**
 * Sprint 95 M3 — explicit learner artefact produce/reference contract.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fflate = require("fflate");

const ljDesign = require("../lib/learning-journey-design-page.js");
const ljPackage = require("../lib/learning-journey-learner-package.js");
const learnerPackage = require("../lib/learner-package.js");
const {
  renderLearnerPageHtml,
  renderLearnerResourceFragment,
  normalizeArtefactContract,
  resolveArtefactReference,
  renderArtefactReferenceHtml,
  listProducesForCommission,
  listReferencesForCommission
} = require("../lib/learner-renderer-vnext");
const { createLearnerDraftStorage } = require("../lib/learner-renderer-vnext/learner-draft-storage");
const envelope = require("../lib/learner-renderer-vnext/learner-draft-envelope");

function assessmentPage(overrides) {
  const src = overrides && typeof overrides === "object" ? overrides : {};
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: src.title || "Assessment stop",
    activities: [],
    metadata: {
      workflow_id: src.workflowId || "wf-s95-m3",
      page_id: src.pageId || "page-s95-m3"
    },
    assessment_evidence: {
      purpose: {
        role: "R1",
        visibility_claim: "Artefact handoff.",
        stop_rationale: "A short formative stop.",
        forward_intent: "Carry the judgement forward."
      },
      learner_context: { depends_on_prior_work: false },
      pack_forward_orientation: "Use the result in the next block.",
      elicitations: [
        {
          elicitation_id: "judgement",
          order: 1,
          evidence_ask: "Write the independent judgement.",
          epistemic_class: "non_determinate",
          delivery: {
            kind: "constructed_performance",
            prompt: "Write your independent judgement.",
            response_workspace: { intention: "Independent judgement" }
          },
          formative_return: {
            materials: [{ material_id: "look", body: "Look again." }],
            revision: { offered: true, prompt: "Name one change." },
            forward_orientation: "Carry the writing forward."
          }
        }
      ]
    }
  };
}

function c5c6Journey() {
  return ljDesign.buildLearningJourneyDesignPageFixture({
    title: "Deciding Under Uncertainty (M3 demonstrator)",
    sections: [
      {
        section_id: "journey_intro",
        title: "About this journey",
        order: 1,
        exposition: "Write an independent judgement, then reflect on it."
      },
      {
        section_id: "exp_5",
        title: "Independent judgement",
        order: 2,
        exposition: "Produce a judgement you can revisit."
      },
      {
        section_id: "exp_6",
        title: "Reflect on your judgement",
        order: 3,
        exposition: "Use your earlier judgement as a read-only reference."
      }
    ],
    commissions: [
      {
        commission_id: "c5",
        section_id: "exp_5",
        order: 1,
        title: "Independent judgement",
        product_id: "assessment_pack",
        status: "supported",
        specification_text: "C5 independent judgement"
      },
      {
        commission_id: "c6",
        section_id: "exp_6",
        order: 2,
        title: "Reflect on your judgement",
        product_id: "assessment_pack",
        status: "supported",
        specification_text: "C6 reflection"
      }
    ]
  });
}

function artefactContract() {
  return {
    produces: [
      {
        artefactId: "c5.independent_judgement",
        commissionId: "c5",
        workspaceId: "assessment-constructed-judgement",
        label: "Independent judgement"
      }
    ],
    references: [
      {
        artefactId: "c5.independent_judgement",
        commissionId: "c6",
        usage: "reference",
        label: "Your earlier independent judgement",
        missingMessage:
          "Your independent judgement is not available yet. Complete that experience first, or continue with the activities below.",
        standaloneFallback:
          "If you are working outside the journey, keep a copy of your judgement yourself."
      }
    ]
  };
}

function memoryStorage() {
  const map = new Map();
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(String(key), String(value)),
    removeItem: (key) => map.delete(String(key)),
    _map: map
  };
}

function saveProducerDraft(storage, pageKey, text, extraWorkspaces) {
  const draft = envelope.createEmptyEnvelope(pageKey);
  draft.workspaces["assessment-constructed-judgement"] = {
    kind: "text_entry",
    stateVersion: 1,
    value: { text: text }
  };
  if (extraWorkspaces && typeof extraWorkspaces === "object") {
    Object.keys(extraWorkspaces).forEach((id) => {
      draft.workspaces[id] = extraWorkspaces[id];
    });
  }
  const api = createLearnerDraftStorage(storage);
  const saved = api.saveLearnerDraft(pageKey, draft);
  assert.equal(saved.ok, true);
  return saved;
}

test("S95-T-008 normalises a generic produce/reference contract without hard-coding C5/C6", () => {
  const normalized = normalizeArtefactContract({
    produces: [
      {
        artefact_id: "x.note",
        commission_id: "cA",
        workspace_id: "assessment-constructed-note",
        label: "Note"
      }
    ],
    references: [
      {
        artefactId: "x.note",
        commissionId: "cB",
        usage: "reference"
      }
    ]
  });
  assert.equal(normalized.produces.length, 1);
  assert.equal(normalized.produces[0].artefactId, "x.note");
  assert.equal(normalized.produces[0].commissionId, "cA");
  assert.equal(normalized.references[0].commissionId, "cB");
  assert.deepEqual(listProducesForCommission(normalized, "cA").map((r) => r.artefactId), [
    "x.note"
  ]);
  assert.deepEqual(listReferencesForCommission(normalized, "cB").map((r) => r.artefactId), [
    "x.note"
  ]);
  assert.equal(listReferencesForCommission(normalized, "cA").length, 0);
});

test("S95-T-008 resolves only the declared workspace and ignores undeclared drafts", () => {
  const storage = memoryStorage();
  const pageKey = "v1::wf-c5::page-c5::2.0.0::no-activities::independent-judgement";
  saveProducerDraft(storage, pageKey, "The options do not yet establish causation.", {
    "assessment-constructed-secret": {
      kind: "text_entry",
      stateVersion: 1,
      value: { text: "PRIVATE — must not leak" }
    }
  });

  const contract = artefactContract();
  const resolved = resolveArtefactReference({
    contract,
    artefactId: "c5.independent_judgement",
    storage,
    resources: [{ commissionId: "c5", pageKey }]
  });
  assert.equal(resolved.ok, true);
  assert.equal(resolved.status, "resolved");
  assert.equal(resolved.text, "The options do not yet establish causation.");
  assert.doesNotMatch(JSON.stringify(resolved), /PRIVATE/);

  const undeclared = resolveArtefactReference({
    contract,
    artefactId: "c5.secret_note",
    storage,
    resources: [{ commissionId: "c5", pageKey }]
  });
  assert.equal(undeclared.ok, false);
  assert.equal(undeclared.status, "undeclared");
});

test("S95-T-008 missing artefact renders a usable notice without inventing content", () => {
  const storage = memoryStorage();
  const html = renderArtefactReferenceHtml(
    resolveArtefactReference({
      contract: artefactContract(),
      artefactId: "c5.independent_judgement",
      storage,
      resources: [{ commissionId: "c5", pageKey: "missing-key" }]
    }),
    artefactContract().references[0]
  );
  assert.match(html, /data-lj-artefact-status="missing"/);
  assert.match(html, /not available yet/i);
  assert.match(html, /standaloneFallback|keep a copy/i);
  assert.doesNotMatch(html, /contenteditable|textarea|<input/i);
  assert.doesNotMatch(html, /data-workspace-kind/);
});

test("S95-T-009 C5→C6 shell embeds the artefact contract and demos live read-only reference HTML", () => {
  const journey = c5c6Journey();
  assert.equal(journey.ok, true, (journey.errors || []).join("; "));
  const pageC5 = assessmentPage({
    title: "Independent judgement",
    workflowId: "wf-c5",
    pageId: "page-c5"
  });
  const pageC6 = assessmentPage({
    title: "Reflect on your judgement",
    workflowId: "wf-c6",
    pageId: "page-c6"
  });
  const fragC5 = renderLearnerResourceFragment(pageC5);
  const fragC6 = renderLearnerResourceFragment(pageC6);
  assert.equal(fragC5.error, null);
  assert.equal(fragC6.error, null);

  const shell = require("../lib/learning-journey-unified-shell.js").buildLearningJourneyUnifiedShellHtml(
    journey.page,
    [
      {
        commissionId: "c5",
        title: "Independent judgement",
        html: fragC5.html,
        pageKey: "v1::wf-c5::page-c5::2.0.0::no-activities::independent-judgement"
      },
      {
        commissionId: "c6",
        title: "Reflect on your judgement",
        html: fragC6.html,
        pageKey: "v1::wf-c6::page-c6::2.0.0::no-activities::reflect-on-your-judgement"
      }
    ],
    { artefactContract: artefactContract(), runtimeSrc: "runtime/learner-renderer-vnext-browser.js" }
  );
  assert.equal(shell.ok, true, shell.code);
  assert.match(shell.html, /id="lj-shell-artefact-contract"/);
  assert.match(shell.html, /c5\.independent_judgement/);
  assert.match(shell.html, /injectArtefactReferences/);
  assert.equal(shell.artefactContract.produces[0].commissionId, "c5");
  assert.equal(shell.artefactContract.references[0].commissionId, "c6");
  assert.ok(shell.artefactContract.produces[0].pageKey);

  const packC5 = learnerPackage.buildLearnerPackage({
    html: renderLearnerPageHtml(pageC5).html,
    title: pageC5.title
  });
  const packC6 = learnerPackage.buildLearnerPackage({
    html: renderLearnerPageHtml(pageC6).html,
    title: pageC6.title
  });
  const assembled = ljPackage.assembleLearningJourneyUnifiedShellPackage({
    page: journey.page,
    artefactContract: artefactContract(),
    constituents: [
      {
        commissionId: "c5",
        title: "Independent judgement",
        sourcePage: pageC5,
        learnerPackage: packC5.package
      },
      {
        commissionId: "c6",
        title: "Reflect on your judgement",
        sourcePage: pageC6,
        learnerPackage: packC6.package
      }
    ],
    fflate
  });
  assert.equal(assembled.ok, true, assembled.error && assembled.error.message);
  const index = Buffer.from(fflate.unzipSync(assembled.bytes)["index.html"]).toString("utf8");
  assert.match(index, /lj-shell-artefact-contract/);
  assert.match(index, /data-lj-nav-id="c5"/);
  assert.match(index, /data-lj-nav-id="c6"/);
});

test("resolved reference HTML is read-only and named for assistive tech", () => {
  const html = renderArtefactReferenceHtml(
    {
      ok: true,
      status: "resolved",
      artefactId: "c5.independent_judgement",
      text: "Long judgement text that must wrap safely.",
      label: "Independent judgement"
    },
    artefactContract().references[0]
  );
  assert.match(html, /aria-labelledby=/);
  assert.match(html, /Read-only/);
  assert.match(html, /role="region"/);
  assert.match(html, /Your earlier independent judgement/);
  assert.doesNotMatch(html, /<textarea|<input|contenteditable/i);
});
