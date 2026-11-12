/**
 * Learning Journal reading-column layout + no production-metadata headings.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const artefact = require("../lib/learner-renderer-vnext/learner-artefact-contract.js");
const unifiedShell = require("../lib/learning-journey-unified-shell.js");
const { createLearnerDraftStorage } = require("../lib/learner-renderer-vnext/learner-draft-storage");
const envelope = require("../lib/learner-renderer-vnext/learner-draft-envelope");

const SYNTHETIC =
  "SYNTH-JOURNAL-BODY-9f3c: The observed difference was 14 percentage points, not 14%.";

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

function saveTextDraft(storage, pageKey, workspaceId, text) {
  const draft = envelope.createEmptyEnvelope(pageKey);
  draft.workspaces[workspaceId] = {
    kind: "text_entry",
    stateVersion: 1,
    value: { text: text }
  };
  return createLearnerDraftStorage(storage).saveLearnerDraft(pageKey, draft);
}

function threeEntryContract() {
  return {
    produces: [
      {
        artefactId: "C02.E1",
        commissionId: "c02",
        workspaceId: "assessment-constructed-E1",
        label:
          "An unrestricted prose response containing the learner's first independent explanation of the research finding, preserved verbatim as the baseline artefact C02.E1."
      },
      {
        artefactId: "C04.E1",
        commissionId: "c04",
        workspaceId: "assessment-constructed-E1",
        label:
          "An unrestricted diagnostic self-evaluation preserved as journalable artefact C04.E1."
      },
      {
        artefactId: "C05.E1",
        commissionId: "c05",
        workspaceId: "assessment-constructed-E1",
        label:
          "An unrestricted revised explanation preserved verbatim as the baseline artefact C05.E1."
      }
    ],
    references: []
  };
}

function threeEntryJournal() {
  return {
    enabled: true,
    title: "Learning Journal",
    entries: [
      {
        entry_id: "j-c02",
        order: 1,
        title: "Your first explanation",
        framing: "Look back at your opening draft.",
        artefact_id: "C02.E1"
      },
      {
        entry_id: "j-c04",
        order: 2,
        title: "Your diagnosis",
        framing: "Review the judgements you made.",
        artefact_id: "C04.E1"
      },
      {
        entry_id: "j-c05",
        order: 3,
        title: "Your revised explanation",
        framing: "Compare with your first version.",
        artefact_id: "C05.E1"
      }
    ]
  };
}

function resources() {
  return [
    { commissionId: "c02", title: "Write your first explanation", pageKey: "page-c02" },
    { commissionId: "c04", title: "Diagnose your explanation", pageKey: "page-c04" },
    { commissionId: "c05", title: "Revise your explanation", pageKey: "page-c05" }
  ];
}

test("Journal CSS uses the shared learner reading-column width variable", () => {
  const page = {
    artifact_type: "page",
    product_id: "learning_journey",
    title: "Research journey",
    sections: [
      {
        section_id: "journey_intro",
        title: "About this journey",
        order: 1,
        exposition: "Journal layout fixture."
      },
      {
        section_id: "exp_1",
        title: "Write your first explanation",
        order: 2,
        exposition: "First stop."
      }
    ],
    commissions: [
      {
        commission_id: "c02",
        section_id: "exp_1",
        order: 1,
        title: "Write your first explanation",
        product_id: "assessment_pack",
        status: "supported",
        specification_text: "Assessment Pack C02"
      }
    ]
  };
  const shell = unifiedShell.buildLearningJourneyUnifiedShellHtml(
    page,
    [
      {
        commissionId: "c02",
        title: "Write your first explanation",
        html:
          '<div class="util-learner-renderer-vnext util-learner-page"><header class="util-page-header"><h2>Write your first explanation</h2></header><p>Body</p></div>'
      }
    ],
    { journalSpec: threeEntryJournal() }
  );
  assert.equal(shell.ok, true, shell.code);
  assert.match(
    shell.html,
    /\.lj-shell-overview,\.lj-shell-journal\{width:min\(100%,var\(--learner-reading-width,70ch\)\)/
  );
  assert.match(shell.html, /body\.lj-shell-body \.util-learner-page\{width:min\(100%,var\(--learner-reading-width,70ch\)\)/);
  assert.match(shell.html, /overflow-wrap:anywhere/);
  const template = unifiedShell.buildJournalTemplateHtml(threeEntryJournal());
  assert.match(template, /class="lj-shell-journal"/);
  assert.match(template, /Your first explanation/);
  assert.match(template, /Your diagnosis/);
  assert.match(template, /Your revised explanation/);
  assert.match(template, /data-lj-journal-artefact-status="missing"/);
});

test("populated Journal entries omit production artefact descriptions as headings", () => {
  const storage = memoryStorage();
  saveTextDraft(storage, "page-c02", "assessment-constructed-E1", SYNTHETIC);
  saveTextDraft(storage, "page-c04", "assessment-constructed-E1", SYNTHETIC + " [C04]");
  saveTextDraft(storage, "page-c05", "assessment-constructed-E1", SYNTHETIC + " [C05]");

  const rows = artefact.resolveLearningJournalEntries({
    journalSpec: threeEntryJournal(),
    contract: threeEntryContract(),
    resources: resources(),
    storage
  });
  assert.equal(rows.length, 3);
  rows.forEach(function (row) {
    assert.equal(row.resolution.status, "resolved");
    assert.doesNotMatch(row.html, /lj-shell-journal__artefact-label/);
    assert.doesNotMatch(row.html, /unrestricted prose/i);
    assert.doesNotMatch(row.html, /baseline artefact/i);
    assert.doesNotMatch(
      row.html.replace(/data-lj-journal-artefact-id="[^"]*"/g, ""),
      /C0[245]\.E1/
    );
    assert.match(row.html, /Saved in this Learning Journey on this device/);
    assert.match(row.html, /SYNTH-JOURNAL-BODY-9f3c/);
  });
  assert.match(rows[0].html, /From 'Write your first explanation'/);
  assert.match(rows[0].html, /aria-label="Your first explanation"/);
  assert.match(rows[1].html, /From 'Diagnose your explanation'/);
  assert.match(rows[2].html, /From 'Revise your explanation'/);
});

test("empty Journal entries keep existing missing messaging without production labels", () => {
  const storage = memoryStorage();
  const rows = artefact.resolveLearningJournalEntries({
    journalSpec: threeEntryJournal(),
    contract: threeEntryContract(),
    resources: resources(),
    storage
  });
  assert.equal(rows.length, 3);
  rows.forEach(function (row) {
    assert.equal(row.resolution.status, "missing");
    assert.match(row.html, /not available yet/i);
    assert.doesNotMatch(row.html, /unrestricted prose/i);
    assert.doesNotMatch(row.html, /lj-shell-journal__artefact-label/);
  });
});

test("contract proposal prefers prompt title over response_workspace.intention", () => {
  const proposed = artefact.proposeArtefactContractFromLearningJourney({
    page: {
      commissions: [
        {
          commission_id: "c02",
          order: 1,
          product_id: "assessment_pack",
          dependencies: ""
        },
        {
          commission_id: "c04",
          order: 2,
          product_id: "assessment_pack",
          dependencies: "Uses c02"
        }
      ],
      learning_journey: {
        journal: {
          enabled: true,
          entries: [{ artefact_id: "c02.E1", title: "Your first explanation", order: 1 }]
        }
      }
    },
    constituents: [
      {
        commissionId: "c02",
        productId: "assessment_pack",
        title: "Write your first explanation",
        sourcePage: {
          assessment_evidence: {
            elicitations: [
              {
                elicitation_id: "E1",
                delivery: {
                  kind: "constructed_performance",
                  prompt: { title: "Write your first explanation", task: "Explain the finding." },
                  response_workspace: {
                    intention:
                      "An unrestricted prose response containing the learner's first independent explanation of the research finding, preserved verbatim as the baseline artefact C02.E1."
                  }
                }
              }
            ]
          }
        }
      },
      {
        commissionId: "c04",
        productId: "assessment_pack",
        title: "Diagnose your explanation",
        sourcePage: {
          assessment_evidence: {
            elicitations: [
              {
                elicitation_id: "E1",
                delivery: {
                  kind: "constructed_performance",
                  prompt: { title: "Diagnose your explanation", task: "Diagnose." },
                  response_workspace: { intention: "Diagnostic account." }
                }
              }
            ]
          }
        }
      }
    ]
  });
  const produce = (proposed.contract.produces || []).find(function (row) {
    return row.artefactId === "c02.E1";
  });
  assert.ok(produce);
  assert.equal(produce.label, "Write your first explanation");
  assert.doesNotMatch(produce.label, /unrestricted prose/i);
});
