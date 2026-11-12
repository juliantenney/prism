/**
 * Sprint 97 M2 Task 3 — Learning Journal content-fingerprint notifications.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const artefact = require("../lib/learner-renderer-vnext/learner-artefact-contract.js");
const { createLearnerDraftStorage } = require("../lib/learner-renderer-vnext/learner-draft-storage");
const envelope = require("../lib/learner-renderer-vnext/learner-draft-envelope");
const unifiedShell = require("../lib/learning-journey-unified-shell.js");
const ljDesign = require("../lib/learning-journey-design-page.js");

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
    },
    _map: map
  };
}

function saveTextDraft(storage, pageKey, workspaceId, text) {
  const draft = envelope.createEmptyEnvelope(pageKey);
  draft.workspaces[workspaceId] = {
    kind: "text_entry",
    stateVersion: 1,
    value: { text: text }
  };
  const saved = createLearnerDraftStorage(storage).saveLearnerDraft(pageKey, draft);
  assert.equal(saved.ok, true);
  return saved;
}

function contract() {
  return {
    produces: [
      {
        artefactId: "c1.E1",
        commissionId: "c1",
        workspaceId: "assessment-constructed-E1",
        label: "Original explanation"
      },
      {
        artefactId: "c5.E1",
        commissionId: "c5",
        workspaceId: "assessment-constructed-E1",
        label: "Judgement"
      }
    ],
    references: []
  };
}

function journalSpec() {
  return {
    enabled: true,
    title: "My Learning Journal",
    entries: [
      {
        entry_id: "j1",
        order: 1,
        title: "First explanation",
        framing: "Look back.",
        artefact_id: "c1.E1"
      },
      {
        entry_id: "j5",
        order: 2,
        title: "Judgement",
        framing: "Independent stop.",
        artefact_id: "c5.E1"
      }
    ]
  };
}

function resources() {
  return [
    { commissionId: "c1", title: "Your first explanation", pageKey: "page-c1", kind: "resource" },
    { commissionId: "c5", title: "Judgement stop", pageKey: "page-c5", kind: "resource" }
  ];
}

function notifyOpts(storage, journeyKey) {
  return {
    contract: contract(),
    journalSpec: journalSpec(),
    resources: resources(),
    storage,
    ackStorage: storage,
    journeyKey: journeyKey || "lj:test:journey-a"
  };
}

test("S97-T-005 fingerprint ignores timestamps and unchanged re-saves", () => {
  const a = artefact.fingerprintJournalContent("Same wording.");
  const b = artefact.fingerprintJournalContent("Same wording.");
  const c = artefact.fingerprintJournalContent("Same wording.\r\n");
  const d = artefact.fingerprintJournalContent("Different wording.");
  assert.equal(a, b);
  assert.equal(a, c);
  assert.notEqual(a, d);
  assert.equal(artefact.fingerprintJournalContent(""), "");
  assert.equal(artefact.fingerprintJournalContent("   \n  "), "");
});

test("S97-T-005 first saved content notifies; empty work does not", () => {
  const storage = memoryStorage();
  const empty = artefact.evaluateJournalNotifications(notifyOpts(storage));
  assert.equal(empty.count, 0);

  saveTextDraft(storage, "page-c1", "assessment-constructed-E1", "First saved body.");
  const first = artefact.evaluateJournalNotifications(notifyOpts(storage));
  assert.equal(first.count, 1);
  assert.deepEqual(first.unacknowledgedEntryIds, ["j1"]);
});

test("S97-T-005 unchanged re-save after acknowledgement does not notify", () => {
  const storage = memoryStorage();
  saveTextDraft(storage, "page-c1", "assessment-constructed-E1", "Stable wording.");
  assert.equal(artefact.evaluateJournalNotifications(notifyOpts(storage)).count, 1);

  const ack = artefact.acknowledgeJournalNotifications(notifyOpts(storage));
  assert.equal(ack.ok, true);
  assert.equal(artefact.evaluateJournalNotifications(notifyOpts(storage)).count, 0);

  saveTextDraft(storage, "page-c1", "assessment-constructed-E1", "Stable wording.");
  assert.equal(artefact.evaluateJournalNotifications(notifyOpts(storage)).count, 0);

  saveTextDraft(storage, "page-c1", "assessment-constructed-E1", "Stable wording.\n");
  assert.equal(artefact.evaluateJournalNotifications(notifyOpts(storage)).count, 0);
});

test("S97-T-005 substantive edit notifies until journal is opened", () => {
  const storage = memoryStorage();
  saveTextDraft(storage, "page-c1", "assessment-constructed-E1", "Version one.");
  artefact.acknowledgeJournalNotifications(notifyOpts(storage));
  assert.equal(artefact.evaluateJournalNotifications(notifyOpts(storage)).count, 0);

  saveTextDraft(storage, "page-c1", "assessment-constructed-E1", "Version two — revised.");
  assert.equal(artefact.evaluateJournalNotifications(notifyOpts(storage)).count, 1);

  artefact.acknowledgeJournalNotifications(notifyOpts(storage));
  assert.equal(artefact.evaluateJournalNotifications(notifyOpts(storage)).count, 0);
});

test("S97-T-005 acknowledgement is isolated per journey key", () => {
  const storage = memoryStorage();
  saveTextDraft(storage, "page-c1", "assessment-constructed-E1", "Shared draft text.");
  saveTextDraft(storage, "page-c5", "assessment-constructed-E1", "Judgement text.");

  const journeyA = notifyOpts(storage, "lj:test:journey-a");
  const journeyB = notifyOpts(storage, "lj:test:journey-b");
  assert.equal(artefact.evaluateJournalNotifications(journeyA).count, 2);
  assert.equal(artefact.evaluateJournalNotifications(journeyB).count, 2);

  artefact.acknowledgeJournalNotifications(journeyA);
  assert.equal(artefact.evaluateJournalNotifications(journeyA).count, 0);
  assert.equal(artefact.evaluateJournalNotifications(journeyB).count, 2);

  const ackKeys = [...storage._map.keys()].filter((key) =>
    String(key).startsWith(artefact.JOURNAL_ACK_STORAGE_KEY_PREFIX)
  );
  assert.ok(ackKeys.some((key) => key.indexOf("journey-a") >= 0));
  assert.ok(ackKeys.every((key) => key.indexOf("learner-renderer-vnext:draft:") < 0));
});

test("S97-T-005 shell embeds journey key and count slot; disabled stays clean", () => {
  const journey = ljDesign.buildLearningJourneyDesignPageFixture({
    title: "Notify journey",
    introExposition: "Intro.",
    sections: [
      {
        section_id: "journey_intro",
        title: "About",
        order: 1,
        exposition: "Intro."
      },
      {
        section_id: "exp_1",
        title: "Stop",
        order: 2,
        exposition: "Work."
      }
    ],
    commissions: [
      {
        commission_id: "c1",
        section_id: "exp_1",
        order: 1,
        title: "Stop",
        product_id: "assessment_pack",
        status: "supported",
        specification_text: "A"
      }
    ]
  });
  assert.equal(journey.ok, true);
  const frag =
    '<div class="util-learner-renderer-vnext"><header class="util-page-header"><h2>Stop</h2></header><p>body</p></div>';

  const absent = unifiedShell.buildLearningJourneyUnifiedShellHtml(journey.page, [
    { commissionId: "c1", title: "Stop", html: frag }
  ]);
  assert.equal(absent.hasJournal, false);
  assert.doesNotMatch(absent.html, /lj-shell__toc--journal/);
  assert.doesNotMatch(absent.html, /id="lj-resource-journal"/);
  assert.doesNotMatch(absent.html, /id="lj-shell-journal-spec"/);
  assert.doesNotMatch(absent.html, /id="lj-shell-journey-key"/);
  assert.doesNotMatch(absent.html, / data-lj-journey-key="/);

  const enabled = unifiedShell.buildLearningJourneyUnifiedShellHtml(
    journey.page,
    [{ commissionId: "c1", title: "Stop", html: frag }],
    {
      journalSpec: journalSpec(),
      artefactContract: contract(),
      journeyKey: "lj:test:shell-notify"
    }
  );
  assert.equal(enabled.hasJournal, true);
  assert.equal(enabled.journeyKey, "lj:test:shell-notify");
  assert.match(enabled.html, /data-lj-journey-key="lj:test:shell-notify"/);
  assert.match(enabled.html, /id="lj-shell-journey-key"/);
  assert.match(enabled.html, /data-lj-journal-nav="true"/);
  assert.match(enabled.html, /data-lj-journal-count/);
  assert.match(enabled.html, /evaluateJournalNotifications/);
  assert.match(enabled.html, /acknowledgeJournalNotifications/);
  assert.match(
    enabled.html,
    /data-lj-nav-id="journal"[^>]*data-lj-journal-title="My Learning Journal"/
  );
});
