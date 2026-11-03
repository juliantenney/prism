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

test("rewriteHandoffMechanicsText removes transfer claims and rewrites retrieve when resolved", () => {
  const raw =
    "If you completed the earlier independent traffic-management judgement activity (c5), retrieve your saved response and keep it available. PRISM does not automatically transfer your earlier response into this resource. Keep it available throughout.";
  const out = artefact.rewriteHandoffMechanicsText(raw, {
    resolutions: [{ ok: true, status: "resolved", text: "My earlier judgement" }]
  });
  assert.match(out, /Use your earlier response shown above/i);
  assert.doesNotMatch(out, /automatically transfer/i);
  assert.doesNotMatch(out, /PRISM does not/i);
});

test("rewriteHandoffMechanicsText strips producer save/copy transfer sentences", () => {
  const raw =
    "5. Save or copy your completed response somewhere you can retrieve it. You will need your own traffic-management judgement for self-evaluation in c6. Your response will not automatically transfer between learning products.";
  const out = artefact.rewriteHandoffMechanicsText(raw, { resolutions: [] });
  assert.doesNotMatch(out, /Save or copy your completed response/i);
  assert.doesNotMatch(out, /will not automatically transfer/i);
  assert.match(out, /traffic-management judgement for self-evaluation in c6/i);
});

test("journeys without artefact relationships leave prose untouched", () => {
  const root = createElement("main");
  const p = createElement("p");
  const text = createTextNode(
    "Your response will not automatically transfer between learning products."
  );
  p.appendChild(text);
  root.appendChild(p);
  const result = artefact.applyContextualHandoffGuidance(root, {
    contract: { produces: [], references: [] },
    commissionId: "c2",
    deliveryContext: "unified",
    resolutions: []
  });
  assert.equal(result.skipped, "no-artefact-relationship");
  assert.match(text.nodeValue, /will not automatically transfer/);
});

test("unified guidance rewrites text nodes when artefact relationship exists", () => {
  const root = createElement("main");
  const p = createElement("p");
  const text = createTextNode(
    "PRISM does not automatically transfer your earlier response into this resource. Evaluate your judgement carefully."
  );
  p.appendChild(text);
  root.appendChild(p);
  const result = artefact.applyContextualHandoffGuidance(root, {
    contract: {
      produces: [
        {
          artefactId: "c5.E1",
          commissionId: "c5",
          workspaceId: "assessment-constructed-E1"
        }
      ],
      references: [
        { artefactId: "c5.E1", commissionId: "c6", usage: "reference" }
      ]
    },
    commissionId: "c6",
    deliveryContext: "unified",
    resolutions: [{ ok: true, status: "resolved", text: "Draft" }]
  });
  assert.equal(result.ok, true);
  assert.ok(result.rewritten >= 1);
  assert.doesNotMatch(text.nodeValue, /automatically transfer/i);
  assert.match(text.nodeValue, /Evaluate your judgement carefully/i);
});

test("resolved artefact note states availability without copy/paste instruction", () => {
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
  assert.doesNotMatch(html, /copy|paste|transfer/i);
  assert.match(html, /My judgement/);
});

test("standalone C5/C6 fixtures still contain manual-reference prose in source HTML", () => {
  if (!hasFixture(STANDALONE_C5) || !hasFixture(STANDALONE_C6)) return;
  const c5 = fs.readFileSync(STANDALONE_C5, "utf8");
  const c6 = fs.readFileSync(STANDALONE_C6, "utf8");
  assert.match(c5, /Save or copy your completed response/i);
  assert.match(c6, /not transferred automatically|does not automatically transfer/i);
});
