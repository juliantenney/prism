/**
 * Sprint 97 M2 Task 2 — Learning Journal population from declared artefacts.
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
  const saved = createLearnerDraftStorage(storage).saveLearnerDraft(pageKey, draft);
  assert.equal(saved.ok, true);
  return saved;
}

function journalContract() {
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
        label: "Independent judgement"
      }
    ],
    // c5 is produced but not consumed by any later resource (unconsumed producer).
    references: [
      {
        artefactId: "c1.E1",
        commissionId: "c2",
        usage: "reference",
        label: "Your earlier response"
      }
    ]
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
        framing: "Look back at your **opening** draft.",
        artefact_id: "c1.E1"
      },
      {
        entry_id: "j-unconsumed",
        order: 2,
        title: "Independent judgement <em>leak</em>",
        framing: "This producer is not consumed later.\n\n<script>x</script>",
        artefact_id: "c5.E1"
      }
    ]
  };
}

function resources() {
  return [
    { commissionId: "c1", title: "Your first explanation", pageKey: "page-c1", kind: "resource" },
    { commissionId: "c2", title: "Criteria stop", pageKey: "page-c2", kind: "resource" },
    { commissionId: "c5", title: "Independent judgement stop", pageKey: "page-c5", kind: "resource" }
  ];
}

test("S97-T-004 resolves and renders saved producer text safely", () => {
  const storage = memoryStorage();
  saveTextDraft(
    storage,
    "page-c1",
    "assessment-constructed-E1",
    'My draft with <script>alert(1)</script> and "quotes".'
  );

  const rows = artefact.resolveLearningJournalEntries({
    journalSpec: journalSpec(),
    contract: journalContract(),
    resources: resources(),
    storage
  });
  assert.equal(rows.length, 2);
  assert.equal(rows[0].entryId, "j1");
  assert.equal(rows[0].resolution.status, "resolved");
  assert.match(rows[0].html, /data-lj-journal-artefact-status="resolved"/);
  assert.match(rows[0].html, /My draft with &lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(rows[0].html, /<script>alert\(1\)<\/script>/);
  assert.match(rows[0].html, /From 'Your first explanation'/);
  // Entry title lives outside the panel; produce labels are not repeated as headings.
  assert.doesNotMatch(rows[0].html, /lj-shell-journal__artefact-label/);
  assert.match(rows[0].html, /aria-label="First explanation"/);
});

test("S97-T-004 includes unconsumed producer artefacts", () => {
  const storage = memoryStorage();
  saveTextDraft(
    storage,
    "page-c5",
    "assessment-constructed-E1",
    "I judge the claim remains under-supported."
  );

  const rows = artefact.resolveLearningJournalEntries({
    journalSpec: journalSpec(),
    contract: journalContract(),
    resources: resources(),
    storage
  });
  const unconsumed = rows.find((row) => row.entryId === "j-unconsumed");
  assert.ok(unconsumed);
  assert.equal(unconsumed.resolution.status, "resolved");
  assert.equal(unconsumed.resolution.text, "I judge the claim remains under-supported.");
  assert.match(unconsumed.html, /Independent judgement stop/);
  assert.equal(
    journalContract().references.some((ref) => ref.artefactId === "c5.E1"),
    false
  );
});

test("S97-T-004 missing and undeclared states are truthful", () => {
  const storage = memoryStorage();
  const missing = artefact.renderJournalArtefactHtml(
    artefact.resolveArtefactReference({
      contract: journalContract(),
      artefactId: "c1.E1",
      resources: resources(),
      storage
    }),
    { producerTitle: "Your first explanation" }
  );
  assert.match(missing, /data-lj-journal-artefact-status="missing"/);
  assert.match(missing, /not available yet/i);
  assert.match(missing, /Your first explanation/);
  assert.doesNotMatch(missing, /contenteditable|textarea|<input/i);

  const undeclared = artefact.renderJournalArtefactHtml(
    artefact.resolveArtefactReference({
      contract: journalContract(),
      artefactId: "c9.missing",
      resources: resources(),
      storage
    })
  );
  assert.match(undeclared, /data-lj-journal-artefact-status="undeclared"/);
  assert.match(undeclared, /not declared for this journey/i);
});

test("S97-T-004 populateLearningJournal replaces placeholders from live drafts", () => {
  const storage = memoryStorage();
  saveTextDraft(storage, "page-c1", "assessment-constructed-E1", "First saved body.");

  const journalHtml = unifiedShell.buildJournalTemplateHtml(journalSpec());
  assert.match(journalHtml, /data-lj-journal-artefact-status="missing"/);

  // Minimal mount root: parse slots via a stub DOM.
  function el(tag, attrs) {
    const node = {
      tagName: String(tag || "div").toUpperCase(),
      attrs: Object.assign({}, attrs || {}),
      children: [],
      parentNode: null,
      nextSibling: null,
      firstChild: null,
      className: attrs && attrs.className ? attrs.className : "",
      innerHTML: "",
      getAttribute(name) {
        return Object.prototype.hasOwnProperty.call(this.attrs, name)
          ? this.attrs[name]
          : null;
      },
      setAttribute(name, value) {
        this.attrs[name] = String(value);
      },
      appendChild(child) {
        if (this.children.length) this.children[this.children.length - 1].nextSibling = child;
        child.parentNode = this;
        child.nextSibling = null;
        this.children.push(child);
        this.firstChild = this.children[0] || null;
        return child;
      },
      removeChild(child) {
        const idx = this.children.indexOf(child);
        if (idx < 0) return child;
        if (idx > 0) this.children[idx - 1].nextSibling = child.nextSibling;
        this.children.splice(idx, 1);
        child.parentNode = null;
        child.nextSibling = null;
        this.firstChild = this.children[0] || null;
        return child;
      },
      replaceChild(next, old) {
        const idx = this.children.indexOf(old);
        if (idx < 0) return old;
        next.parentNode = this;
        next.nextSibling = old.nextSibling;
        if (idx > 0) this.children[idx - 1].nextSibling = next;
        this.children[idx] = next;
        old.parentNode = null;
        old.nextSibling = null;
        this.firstChild = this.children[0] || null;
        return old;
      },
      querySelector(selector) {
        const all = this.querySelectorAll(selector);
        return all[0] || null;
      },
      querySelectorAll(selector) {
        const out = [];
        const walk = (node) => {
          if (!node) return;
          if (selector === "[data-lj-journal-entry]" && node.attrs["data-lj-journal-entry"]) {
            out.push(node);
          }
          if (
            selector === ".lj-shell-journal__artefact" &&
            /\blj-shell-journal__artefact\b/.test(node.className || "")
          ) {
            out.push(node);
          }
          (node.children || []).forEach(walk);
        };
        walk(this);
        return out;
      }
    };
    return node;
  }

  const root = el("article", { "data-lj-journal": "true" });
  root.ownerDocument = {
    createElement() {
      return el("div");
    }
  };
  journalSpec().entries.forEach((entry) => {
    const li = el("li", { "data-lj-journal-entry": entry.entry_id });
    const slot = el("div", {
      className: "lj-shell-journal__artefact lj-shell-journal__artefact--missing"
    });
    slot.setAttribute("data-lj-journal-artefact-status", "missing");
    li.appendChild(slot);
    root.appendChild(li);
  });

  // Stub createElement path sets innerHTML string; replaceChild needs a node.
  // Override populate path by patching ownerDocument createElement to parse status.
  root.ownerDocument.createElement = function () {
    const wrap = el("div");
    Object.defineProperty(wrap, "innerHTML", {
      configurable: true,
      set(html) {
        const statusMatch = String(html).match(/data-lj-journal-artefact-status="([^"]+)"/);
        const child = el("div", {
          className:
            "lj-shell-journal__artefact lj-shell-journal__artefact--" +
            (statusMatch ? statusMatch[1] : "missing")
        });
        child.setAttribute(
          "data-lj-journal-artefact-status",
          statusMatch ? statusMatch[1] : "missing"
        );
        child.innerHTML = String(html);
        wrap.children = [child];
        wrap.firstChild = child;
        child.parentNode = wrap;
      },
      get() {
        return "";
      }
    });
    return wrap;
  };

  const first = artefact.populateLearningJournal(root, {
    journalSpec: journalSpec(),
    contract: journalContract(),
    resources: resources(),
    storage
  });
  assert.equal(first.ok, true);
  assert.equal(first.populated, 2);
  assert.equal(first.entries[0].status, "resolved");
  assert.equal(first.entries[1].status, "missing");

  saveTextDraft(
    storage,
    "page-c1",
    "assessment-constructed-E1",
    "Updated after revisit."
  );
  saveTextDraft(
    storage,
    "page-c5",
    "assessment-constructed-E1",
    "Unconsumed judgement now saved."
  );

  // Reset slots to missing placeholders then populate again (mount remount pattern).
  root.children.forEach((li) => {
    while (li.firstChild) li.removeChild(li.firstChild);
    const slot = el("div", {
      className: "lj-shell-journal__artefact lj-shell-journal__artefact--missing"
    });
    slot.setAttribute("data-lj-journal-artefact-status", "missing");
    li.appendChild(slot);
  });

  const second = artefact.populateLearningJournal(root, {
    journalSpec: journalSpec(),
    contract: journalContract(),
    resources: resources(),
    storage
  });
  assert.equal(second.entries[0].status, "resolved");
  assert.equal(second.entries[1].status, "resolved");
  const resolvedRows = artefact.resolveLearningJournalEntries({
    journalSpec: journalSpec(),
    contract: journalContract(),
    resources: resources(),
    storage
  });
  assert.equal(resolvedRows[0].resolution.text, "Updated after revisit.");
  assert.equal(resolvedRows[1].resolution.text, "Unconsumed judgement now saved.");
});

test("S97-T-004 shell still omits journal when disabled; enabled embeds contract hook", () => {
  const journey = ljDesign.buildLearningJourneyDesignPageFixture({
    title: "Journal population journey",
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
  assert.doesNotMatch(absent.html, /data-lj-journal=/);
  assert.doesNotMatch(absent.html, /id="lj-shell-journal-spec"/);
  assert.doesNotMatch(absent.html, /data-lj-nav-id="journal"/);

  const enabled = unifiedShell.buildLearningJourneyUnifiedShellHtml(
    journey.page,
    [{ commissionId: "c1", title: "Stop", html: frag }],
    { journalSpec: journalSpec(), artefactContract: journalContract() }
  );
  assert.equal(enabled.hasJournal, true);
  assert.match(enabled.html, /populateLearningJournal/);
  assert.match(enabled.html, /id="lj-shell-journal-spec"/);
  assert.match(enabled.html, /data-lj-journal-entry="j1"/);
  assert.match(enabled.html, /data-lj-journal-entry="j-unconsumed"/);
  assert.match(
    enabled.html,
    /lj-shell-journal__entry-title[^>]*>Independent judgement &lt;em&gt;leak&lt;\/em&gt;</
  );
  const entryTitleHtml = enabled.html.match(
    /lj-shell-journal__entry-title[^>]*>[\s\S]*?<\/h3>/
  );
  assert.ok(entryTitleHtml);
  assert.doesNotMatch(entryTitleHtml[0], /<em>leak<\/em>/);
});
