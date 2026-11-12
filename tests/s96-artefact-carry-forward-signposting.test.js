/**
 * Unified Learning Journey — learner-facing artefact carry-forward signposting.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const artefact = require("../lib/learner-renderer-vnext/learner-artefact-contract.js");
const { renderAssessmentOutputRegion } = require("../lib/learner-renderer-vnext/assessment-output.js");

function lj2Contract() {
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
        label: "Revised explanation"
      }
    ],
    references: [
      {
        artefactId: "c1.E1",
        commissionId: "c5",
        usage: "reference",
        label: "Your earlier response"
      },
      {
        artefactId: "c1.E1",
        commissionId: "c6",
        usage: "reference",
        label: "Your earlier response"
      },
      {
        artefactId: "c5.E1",
        commissionId: "c6",
        usage: "reference",
        label: "Your earlier response"
      }
    ]
  };
}

function lj2Resources() {
  return [
    { commissionId: "c1", title: "Your first explanation", pageKey: "page-c1" },
    { commissionId: "c2", title: "Understanding what the evidence warrants", pageKey: "page-c2" },
    { commissionId: "c5", title: "Reconsider, revise and improve", pageKey: "page-c5" },
    {
      commissionId: "c6",
      title: "The feedback that changed the work",
      pageKey: "page-c6"
    }
  ];
}

test("C1 producer signpost names C5 and C6 resource titles", () => {
  const html = artefact.buildProducerSignpostHtml(lj2Contract(), "c1", lj2Resources());
  assert.match(html, /data-lj-artefact-signpost="producer"/);
  assert.match(html, /Reconsider, revise and improve/);
  assert.match(html, /The feedback that changed the work/);
  assert.match(html, /save your draft in this Learning Journey/i);
  assert.match(html, /on this device/i);
  assert.doesNotMatch(html, /\bc1\b|\bc5\b|\bc6\b|workspace|localStorage|artefactId/i);
});

test("C5 producer signpost names C6 and consumer reference identifies C1", () => {
  const producer = artefact.buildProducerSignpostHtml(lj2Contract(), "c5", lj2Resources());
  assert.match(producer, /The feedback that changed the work/);
  assert.doesNotMatch(producer, /Your first explanation/);

  const consumer = artefact.renderArtefactReferenceHtml(
    {
      ok: true,
      status: "resolved",
      artefactId: "c1.E1",
      text: "My first draft explanation.",
      label: "Original explanation"
    },
    { artefactId: "c1.E1", label: "Your earlier response" },
    {
      producerTitle: "Your first explanation",
      produceLabel: "Original explanation"
    }
  );
  assert.match(consumer, /Original explanation/);
  assert.match(consumer, /From 'Your first explanation'/);
  assert.match(consumer, /saved it earlier in this Learning Journey/);
  assert.match(consumer, /My first draft explanation/);
  assert.doesNotMatch(consumer.replace(/data-lj-artefact-ref="[^"]*"/g, ""), /c1\.E1|commissionId|localStorage|workspaceId/i);
});

test("C6 consumer references identify the earlier resources they actually use", () => {
  const fromC1 = artefact.renderArtefactReferenceHtml(
    { ok: false, status: "missing", artefactId: "c1.E1", text: "", label: "Original explanation" },
    { artefactId: "c1.E1" },
    {
      producerTitle: "Your first explanation",
      produceLabel: "Original explanation"
    }
  );
  const fromC5 = artefact.renderArtefactReferenceHtml(
    {
      ok: true,
      status: "resolved",
      artefactId: "c5.E1",
      text: "Revised draft.",
      label: "Revised explanation"
    },
    { artefactId: "c5.E1" },
    {
      producerTitle: "Reconsider, revise and improve",
      produceLabel: "Revised explanation"
    }
  );
  assert.match(fromC1, /Your first explanation/);
  assert.match(fromC1, /save your draft in this Learning Journey/);
  assert.match(fromC5, /Reconsider, revise and improve/);
  assert.match(fromC5, /Revised explanation/);
  assert.match(fromC5, /Revised draft/);
});

test("resources with no artefact relationship receive no producer signpost", () => {
  const html = artefact.buildProducerSignpostHtml(lj2Contract(), "c2", lj2Resources());
  assert.equal(html, "");
});

function fakeEl(attrs) {
  const src = attrs && typeof attrs === "object" ? attrs : {};
  const el = {
    attrs: Object.assign({}, src.attrs || {}),
    children: [],
    parentNode: null,
    nextSibling: null,
    firstChild: null,
    className: src.className || "",
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
      if (child.parentNode && typeof child.parentNode.removeChild === "function") {
        child.parentNode.removeChild(child);
      }
      if (this.children.length) {
        this.children[this.children.length - 1].nextSibling = child;
      }
      child.parentNode = this;
      child.nextSibling = null;
      this.children.push(child);
      this.firstChild = this.children[0] || null;
      return child;
    },
    insertBefore(child, before) {
      if (!before) return this.appendChild(child);
      if (child.parentNode && typeof child.parentNode.removeChild === "function") {
        child.parentNode.removeChild(child);
      }
      const idx = this.children.indexOf(before);
      if (idx < 0) return this.appendChild(child);
      if (idx > 0) this.children[idx - 1].nextSibling = child;
      child.parentNode = this;
      child.nextSibling = before;
      this.children.splice(idx, 0, child);
      this.firstChild = this.children[0] || null;
      return child;
    },
    removeChild(child) {
      const idx = this.children.indexOf(child);
      if (idx < 0) return child;
      if (idx > 0) {
        this.children[idx - 1].nextSibling = child.nextSibling;
      }
      this.children.splice(idx, 1);
      child.parentNode = null;
      child.nextSibling = null;
      this.firstChild = this.children[0] || null;
      return child;
    },
    querySelector(selector) {
      const match = (node) => {
        if (!node || !node.attrs) return false;
        if (selector === '[data-orientation-type="knowledge_summary"]') {
          return node.attrs["data-orientation-type"] === "knowledge_summary";
        }
        if (selector === '[data-region="assessment-orientation"]') {
          return node.attrs["data-region"] === "assessment-orientation";
        }
        if (selector === "#journey-assessment-briefing") {
          return node.attrs.id === "journey-assessment-briefing";
        }
        if (selector === ".util-page-header") {
          return /\butil-page-header\b/.test(node.className || "");
        }
        if (selector === '[data-region="activities"]') {
          return node.attrs["data-region"] === "activities";
        }
        if (selector === ".util-learner-draft-controls") {
          return /\butil-learner-draft-controls\b/.test(node.className || "");
        }
        if (selector === "[data-lj-artefact-ref-host]") {
          return !!node.attrs["data-lj-artefact-ref-host"];
        }
        return false;
      };
      const walk = (node) => {
        if (match(node)) return node;
        for (let i = 0; i < (node.children || []).length; i += 1) {
          const found = walk(node.children[i]);
          if (found) return found;
        }
        return null;
      };
      return walk(this);
    },
    querySelectorAll(selector) {
      const out = [];
      const walk = (node) => {
        if (!node) return;
        if (selector === "[data-lj-artefact-ref-host]" && node.attrs) {
          if (node.attrs["data-lj-artefact-ref-host"]) out.push(node);
        }
        (node.children || []).forEach(walk);
      };
      walk(this);
      return out;
    }
  };
  return el;
}

function attachOwnerDocument(root) {
  root.ownerDocument = {
    createElement() {
      return fakeEl();
    }
  };
  return root;
}

test("artefact host inserts immediately after knowledge summary when present", () => {
  const root = attachOwnerDocument(fakeEl());
  const header = fakeEl({ className: "util-page-header" });
  const ks = fakeEl({
    attrs: { "data-orientation-type": "knowledge_summary" }
  });
  const activities = fakeEl({ attrs: { "data-region": "activities" } });
  root.appendChild(header);
  root.appendChild(ks);
  root.appendChild(activities);

  const point = artefact.resolveArtefactHostInsertion(root);
  assert.equal(point.reason, "knowledge_summary");
  assert.equal(point.mode, "after");
  assert.equal(point.anchor, ks);

  const result = artefact.injectArtefactReferences(root, {
    commissionId: "c1",
    contract: lj2Contract(),
    resources: lj2Resources()
  });
  assert.equal(result.ok, true);
  assert.equal(result.signposted, true);
  assert.equal(result.insertionReason, "knowledge_summary");
  assert.equal(ks.nextSibling && ks.nextSibling.className, "lj-artefact-ref-host");
  assert.equal(root.children.indexOf(ks.nextSibling), root.children.indexOf(ks) + 1);
});

test("assessment packs without knowledge summary use assessment orientation fallback", () => {
  const root = attachOwnerDocument(fakeEl());
  const header = fakeEl({ className: "util-page-header" });
  const briefing = fakeEl({
    attrs: {
      "data-region": "assessment-orientation",
      id: "journey-assessment-briefing"
    }
  });
  const checks = fakeEl({ attrs: { "data-region": "assessment-checks" } });
  root.appendChild(header);
  root.appendChild(briefing);
  root.appendChild(checks);

  const point = artefact.resolveArtefactHostInsertion(root);
  assert.equal(point.reason, "assessment_orientation");
  assert.equal(point.anchor, briefing);

  const result = artefact.injectArtefactReferences(root, {
    commissionId: "c1",
    contract: lj2Contract(),
    resources: lj2Resources()
  });
  assert.equal(result.ok, true);
  assert.equal(result.insertionReason, "assessment_orientation");
  assert.equal(briefing.nextSibling && briefing.nextSibling.className, "lj-artefact-ref-host");
  assert.notEqual(root.children[0] && root.children[0].className, "lj-artefact-ref-host");
});

test("unified rewrite maps system-owned standalone help for producers", () => {
  const assessmentOutput = require("../lib/learner-renderer-vnext/assessment-output.js");
  const raw = assessmentOutput.buildAssessmentOutputRetentionHelp({
    deliveryContext: "standalone"
  });
  const out = artefact.rewriteHandoffMechanicsText(raw, {
    isProducer: true,
    resolutions: []
  });
  assert.doesNotMatch(out, /Later activities will not retrieve/i);
  assert.doesNotMatch(out, /kept on this page only/i);
  assert.match(out, /kept on this device when you save it/i);
  assert.match(out, /Learning Journey/i);
  assert.match(out, /do not paste it into later answer fields/i);
});

test("standalone assessment-output help remains page-only / copy guidance", () => {
  const html = renderAssessmentOutputRegion({
    specification_id: "retain_original",
    artefact_title: "Your first explanation",
    action_label: "Copy my first explanation",
    purpose: "Retain the learner's original explanation without generating a summary.",
    sections: [
      {
        section_id: "original",
        title: "Original explanation",
        contributions: [
          {
            elicitation_id: "E1",
            response_part: "response_text"
          }
        ]
      }
    ]
  });
  assert.match(html, /Later activities will not retrieve it automatically/);
  assert.match(html, /kept on this page only/);
});

test("journeys without relationships still skip contextual rewrite", () => {
  const result = artefact.applyContextualHandoffGuidance(
    {
      querySelector() {
        return null;
      }
    },
    {
      contract: { produces: [], references: [] },
      commissionId: "c2",
      deliveryContext: "unified",
      resolutions: []
    }
  );
  assert.equal(result.skipped, "no-artefact-relationship");
});
