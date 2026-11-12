/**
 * Sprint 96 M3 — contextual guidance (delivery-neutral generation + unified runtime).
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const artefact = require("../lib/learner-renderer-vnext/learner-artefact-contract.js");
const sibling = require("../lib/learning-journey-sibling-prompts.js");

const STANDALONE_C5 = path.join(__dirname, "..", "tmp-duu-standalone-m2-overflow", "c5", "index.html");
const STANDALONE_C6 = path.join(__dirname, "..", "tmp-duu-standalone-m2-overflow", "c6", "index.html");

function hasFixture(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (_err) {
    return false;
  }
}

function createTextNode(value) {
  return {
    nodeType: 3,
    nodeValue: String(value || ""),
    parentNode: null,
    firstChild: null,
    nextSibling: null
  };
}

function createElement(tagName) {
  const el = {
    nodeType: 1,
    tagName: String(tagName || "DIV").toUpperCase(),
    attributes: Object.create(null),
    children: [],
    parentNode: null,
    ownerDocument: null,
    getAttribute(name) {
      return Object.prototype.hasOwnProperty.call(this.attributes, name)
        ? this.attributes[name]
        : null;
    },
    setAttribute(name, value) {
      this.attributes[name] = String(value);
    },
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    appendChild(child) {
      child.parentNode = this;
      if (this.children.length) {
        this.children[this.children.length - 1].nextSibling = child;
      }
      this.children.push(child);
      return child;
    }
  };
  Object.defineProperty(el, "firstChild", {
    get() {
      return el.children[0] || null;
    }
  });
  return el;
}

test("generation prompts are delivery-neutral for bring-forward", () => {
  const step4 = sibling.TEMPLATES.learning_commissions;
  assert.match(step4, /Describe that educational reuse only/);
  assert.match(
    step4,
    /Do not state whether or how the delivery environment transfers, saves, or retrieves learner responses/
  );
  assert.doesNotMatch(step4, /Do not imply that PRISM automatically transfers learner responses/);
});

test("rewriteHandoffMechanicsText maps only the known standalone system help sentence", () => {
  const assessmentOutput = require("../lib/learner-renderer-vnext/assessment-output.js");
  const standalone = assessmentOutput.buildAssessmentOutputRetentionHelp({
    deliveryContext: "standalone"
  });
  const out = artefact.rewriteHandoffMechanicsText(standalone, {
    isProducer: true,
    journalListed: false
  });
  assert.match(out, /Learning Journey/i);
  assert.match(out, /do not paste it into later answer fields/i);
  assert.doesNotMatch(out, /kept on this page only/i);

  const authored =
    "Save or copy your completed response somewhere you can retrieve it. Evaluate your judgement carefully.";
  assert.equal(
    artefact.rewriteHandoffMechanicsText(authored, { isProducer: true }),
    authored
  );
});

test("journeys without artefact relationships leave system help untouched", () => {
  const assessmentOutput = require("../lib/learner-renderer-vnext/assessment-output.js");
  const helpNode = {
    textContent: assessmentOutput.buildAssessmentOutputRetentionHelp({
      deliveryContext: "standalone"
    }),
    setAttribute() {}
  };
  const root = {
    querySelectorAll(selector) {
      return selector === "[data-assessment-output-help]" ? [helpNode] : [];
    }
  };
  const result = artefact.applyContextualHandoffGuidance(root, {
    contract: { produces: [], references: [] },
    commissionId: "c2",
    deliveryContext: "unified",
    resolutions: []
  });
  assert.equal(result.skipped, "no-artefact-relationship");
  assert.match(helpNode.textContent, /kept on this page only/i);
});

test("unified guidance updates system-owned assessment-output help only", () => {
  const assessmentOutput = require("../lib/learner-renderer-vnext/assessment-output.js");
  const helpNode = {
    textContent: assessmentOutput.buildAssessmentOutputRetentionHelp({
      deliveryContext: "standalone"
    }),
    attrs: Object.create(null),
    setAttribute(name, value) {
      this.attrs[name] = String(value);
    }
  };
  const root = {
    querySelectorAll(selector) {
      return selector === "[data-assessment-output-help]" ? [helpNode] : [];
    }
  };
  const result = artefact.applyContextualHandoffGuidance(root, {
    contract: {
      produces: [
        {
          artefactId: "c5.E1",
          commissionId: "c5",
          workspaceId: "assessment-constructed-E1"
        }
      ],
      references: [{ artefactId: "c5.E1", commissionId: "c6", usage: "reference" }]
    },
    commissionId: "c5",
    deliveryContext: "unified",
    resolutions: []
  });
  assert.equal(result.ok, true);
  assert.equal(result.systemOwnedOnly, true);
  assert.ok(result.rewritten >= 1);
  assert.match(helpNode.textContent, /Learning Journey/i);
  assert.match(helpNode.textContent, /do not paste/i);
  assert.equal(helpNode.attrs["data-assessment-output-delivery"], "unified");
});

test("resolved artefact note states availability without implying prepopulation", () => {
  const html = artefact.renderArtefactReferenceHtml(
    {
      ok: true,
      status: "resolved",
      artefactId: "c5.E1",
      text: "My judgement",
      label: "Your earlier response"
    },
    { artefactId: "c5.E1", label: "Your earlier response" }
  );
  assert.match(html, /Available here for reference/);
  assert.match(html, /not pasted into the answer fields below/i);
  assert.match(html, /My judgement/);
});

test("standalone C5/C6 fixtures may still contain legacy authored transfer prose", () => {
  // Legacy packages can retain authored save/copy sentences until regenerated.
  // Delivery-owned guidance must not silently rewrite that educational prose.
  if (!hasFixture(STANDALONE_C5) || !hasFixture(STANDALONE_C6)) return;
  const c5 = fs.readFileSync(STANDALONE_C5, "utf8");
  const c6 = fs.readFileSync(STANDALONE_C6, "utf8");
  assert.match(c5, /Save or copy your completed response/i);
  assert.match(c6, /not transferred automatically|does not automatically transfer/i);
});
