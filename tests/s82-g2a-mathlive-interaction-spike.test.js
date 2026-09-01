/**
 * S82-G2A — bounded MathLive interaction spike tests.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const vm = require("node:vm");
const fs = require("node:fs");

const repoRoot = path.resolve(__dirname, "..");
const sync = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "math-entry-spike-sync.js"
));
const mathEntryRuntime = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "math-entry-spike-runtime.js"
));
const learnerSurfaceRegistry = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "learner-surface-registry.js"
));
const types = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "response-part-types.js"
));
const collectResponseParts = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "compose-response-parts.js"
));
const renderComposedMoment = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "render-composed-moment.js"
));
const adapters = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "learner-draft-adapters.js"
));
const { getMathEntrySpikeRuntimeScript } = mathEntryRuntime;

const LAGRANGIAN =
  "\\mathcal{L}(x,y,\\lambda) = 4xy + \\lambda(2x + y - 20)";
const FOC = "\\frac{\\partial \\mathcal{L}}{\\partial x} = 4y + 2\\lambda = 0";

function mathPart(activityId) {
  return {
    responsePartId: activityId + "-template-section-lagrangian-1",
    sourceKind: types.SOURCE_KIND.TEMPLATE_SECTION,
    sourceId: "A3-M1-section-lagrangian",
    label: "Lagrangian",
    prompt: "Record the Lagrangian.",
    surfaceKind: types.SURFACE_KIND.TEXT_ENTRY,
    inputModality: types.INPUT_MODALITY.MATH,
    order: 2,
    provenance: {},
    sourceStepNumber: null,
    rows: 6
  };
}

function textPart(activityId) {
  return {
    responsePartId: activityId + "-template-section-explanation-1",
    sourceKind: types.SOURCE_KIND.TEMPLATE_SECTION,
    sourceId: "A3-M1-section-explanation",
    label: "Explanation",
    prompt: "Explain briefly.",
    surfaceKind: types.SURFACE_KIND.TEXT_ENTRY,
    inputModality: types.INPUT_MODALITY.TEXT,
    order: 1,
    provenance: {},
    sourceStepNumber: null,
    rows: 6
  };
}

function buildMathWorkspaceHtml(activityId, label) {
  const mapped = learnerSurfaceRegistry.workspaceFromResponsePart(mathPart(activityId));
  assert.equal(mapped.ok, true);
  mapped.workspace.responseLabel = label || "Lagrangian";
  return renderComposedMoment.renderLearnerWorkspace(mapped.workspace, activityId);
}

function createMathWorkspaceDom() {
  function createElement(tag) {
    const el = {
      tagName: String(tag || "div").toUpperCase(),
      attributes: {},
      children: [],
      className: "",
      classList: {
        _tokens: [],
        add: function () {
          Array.prototype.forEach.call(arguments, (t) => this._tokens.push(String(t)));
          el.className = this._tokens.join(" ");
        },
        remove: function () {
          Array.prototype.forEach.call(arguments, (t) => {
            this._tokens = this._tokens.filter((x) => x !== String(t));
          });
          el.className = this._tokens.join(" ");
        },
        contains: function (t) {
          return this._tokens.indexOf(String(t)) >= 0;
        }
      },
      style: {},
      hidden: false,
      value: "",
      setAttribute: function (k, v) {
        this.attributes[k] = String(v);
      },
      getAttribute: function (k) {
        return Object.prototype.hasOwnProperty.call(this.attributes, k)
          ? this.attributes[k]
          : null;
      },
      removeAttribute: function (k) {
        delete this.attributes[k];
      },
      appendChild: function (child) {
        this.children.push(child);
        child.parentNode = this;
      },
      querySelector: function (sel) {
        return querySelector(this, sel);
      },
      querySelectorAll: function (sel) {
        return querySelectorAll(this, sel);
      },
      closest: function (sel) {
        let node = this;
        while (node) {
          if (matches(node, sel)) return node;
          node = node.parentNode;
        }
        return null;
      },
      dispatchEvent: function () {
        return true;
      },
      addEventListener: function () {},
      removeEventListener: function () {}
    };
    if (tag === "div") {
      Object.defineProperty(el, "innerHTML", {
        configurable: true,
        set: function () {
          this.children = [];
        },
        get: function () {
          return "";
        }
      });
    }
    return el;
  }

  function matches(node, sel) {
    if (!node || !sel) return false;
    if (sel.indexOf(".") > 0 && sel.indexOf(" ") < 0) {
      const parts = sel.split(".");
      const tag = parts[0];
      const classes = parts.slice(1);
      if (tag && tag !== "*" && node.tagName !== tag.toUpperCase()) return false;
      return classes.every((cls) => node.classList.contains(cls));
    }
    if (sel.indexOf("[") >= 0) {
      const attr = sel.slice(1, sel.length - 1).split("=");
      const key = attr[0];
      const val = attr[1] ? attr[1].replace(/"/g, "") : null;
      if (val != null) return node.getAttribute(key) === val;
      return node.getAttribute(key) != null;
    }
    if (sel.charAt(0) === ".") {
      return node.classList.contains(sel.slice(1));
    }
    return node.tagName === sel.toUpperCase();
  }

  function querySelectorAll(node, sel) {
    const out = [];
    walk(node, (n) => {
      if (matches(n, sel)) out.push(n);
    });
    return out;
  }

  function querySelector(node, sel) {
    const all = querySelectorAll(node, sel);
    return all.length ? all[0] : null;
  }

  function walk(node, fn) {
    if (!node) return;
    fn(node);
    const kids = Array.isArray(node.children) ? node.children : [];
    kids.forEach((child) => walk(child, fn));
  }

  const fieldId = "learner-workspace-a3-lagrangian";
  const workspace = createElement("div");
  workspace.classList.add("util-learner-workspace", "util-learner-workspace--math-spike");
  workspace.setAttribute("data-input-modality", "math");
  workspace.setAttribute("data-workspace-kind", "text_entry");
  workspace.setAttribute("data-workspace-id", fieldId);
  workspace.setAttribute("data-math-label-id", fieldId + "-label");

  const mountWrap = createElement("div");
  mountWrap.setAttribute("data-math-entry-spike-root", "");

  const mount = createElement("div");
  mount.setAttribute("data-math-entry-mount", "");
  mount.setAttribute("hidden", "hidden");

  const textarea = createElement("textarea");
  textarea.classList.add("util-learner-workspace__input", "util-learner-workspace__input--canonical");
  textarea.setAttribute("id", fieldId);
  textarea.value = "";

  mountWrap.appendChild(mount);
  mountWrap.appendChild(textarea);
  workspace.appendChild(mountWrap);

  function MockMathfield() {
    this.value = "";
    this.className = "";
    this.parentNode = null;
    this.attributes = {};
    this.children = [];
  }
  MockMathfield.prototype.setAttribute = function (k, v) {
    this.attributes[k] = String(v);
  };
  MockMathfield.prototype.getAttribute = function (k) {
    return this.attributes[k] || null;
  };
  MockMathfield.prototype.addEventListener = function (type, fn) {
    this._onInput = fn;
  };
  MockMathfield.prototype.getValue = function (format) {
    void format;
    return this.value;
  };
  MockMathfield.prototype.setValue = function (v) {
    this.value = String(v || "");
  };
  MockMathfield.prototype.simulateInput = function (next) {
    this.value = String(next);
    if (this._onInput) this._onInput();
  };

  const document = {
    readyState: "complete",
    querySelector: function (sel) {
      return workspace.querySelector(sel);
    },
    querySelectorAll: function (sel) {
      if (sel === '[data-input-modality="math"]') return [workspace];
      return workspace.querySelectorAll(sel);
    },
    addEventListener: function () {}
  };

  const sandbox = {
    document: document,
    window: {},
    console: console,
    Event: function (type, opts) {
      return { type: type, bubbles: opts && opts.bubbles };
    },
    setTimeout: function (fn) {
      fn();
    },
    CustomEvent: function () {}
  };
  sandbox.window.MathLive = { MathfieldElement: MockMathfield };
  sandbox.window.__PRISM_MATH_ENTRY_SPIKE_DISABLE__ = false;
  sandbox.window.document = document;
  sandbox.window.window = sandbox.window;

  vm.runInNewContext(getMathEntrySpikeRuntimeScript(), sandbox);

  return {
    workspace: workspace,
    textarea: textarea,
    mount: mount,
    sandbox: sandbox,
    MockMathfield: MockMathfield
  };
}

test("1: workspaceFromResponsePart propagates inputModality math", () => {
  const mapped = learnerSurfaceRegistry.workspaceFromResponsePart(mathPart("A3"));
  assert.equal(mapped.ok, true);
  assert.equal(mapped.workspace.inputModality, "math");
  assert.equal(mapped.workspace.capability, "text_entry");
});

test("2: text modality workspace has no math spike attributes in HTML", () => {
  const mapped = learnerSurfaceRegistry.workspaceFromResponsePart(textPart("A3"));
  const html = renderComposedMoment.renderLearnerWorkspace(mapped.workspace, "A3");
  assert.doesNotMatch(html, /data-input-modality="math"/);
  assert.match(html, /<textarea class="util-learner-workspace__input"/);
  assert.doesNotMatch(html, /data-math-entry-mount/);
});

test("3: math modality renders spike scaffold and canonical textarea", () => {
  const html = buildMathWorkspaceHtml("A3");
  assert.match(html, /data-input-modality="math"/);
  assert.match(html, /data-math-entry-spike="true"/);
  assert.match(html, /data-math-entry-mount/);
  assert.match(html, /util-learner-workspace__input--canonical/);
  assert.match(html, /data-workspace-kind="text_entry"/);
});

test("4: sync helpers round-trip Lagrangian and FOC TeX through mock mathfield", () => {
  function MockField() {
    this._v = "";
  }
  MockField.prototype.getValue = function () {
    return this._v;
  };
  MockField.prototype.setValue = function (v) {
    this._v = String(v);
  };
  const mf = new MockField();
  const textarea = { value: "" };
  assert.equal(sync.writeLatexToMathfield(mf, LAGRANGIAN), true);
  assert.equal(sync.syncLatexFromMathfield(mf, textarea), true);
  assert.equal(textarea.value, LAGRANGIAN);
  textarea.value = FOC;
  assert.equal(sync.syncLatexToMathfield(textarea, mf), true);
  assert.equal(mf.getValue(), FOC);
});

test("5: runtime enhances math workspace and syncs MathLive input to textarea", () => {
  const dom = createMathWorkspaceDom();
  dom.sandbox.window.PRISM_MATH_ENTRY_SPIKE.boot();
  assert.ok(dom.workspace.classList.contains("util-learner-workspace--math-enhanced"));
  const mf = dom.workspace.__prismMathfield;
  assert.ok(mf);
  mf.simulateInput(LAGRANGIAN);
  assert.equal(dom.textarea.value, LAGRANGIAN);
});

test("6: restored textarea value rehydrates MathLive on resync", () => {
  const dom = createMathWorkspaceDom();
  dom.sandbox.window.PRISM_MATH_ENTRY_SPIKE.boot();
  dom.textarea.value = FOC;
  dom.sandbox.window.PRISM_MATH_ENTRY_SPIKE.resyncAll();
  assert.equal(dom.workspace.__prismMathfield.getValue(), FOC);
});

test("7: draft adapter still serializes canonical textarea string", () => {
  const dom = createMathWorkspaceDom();
  dom.textarea.value = LAGRANGIAN;
  const state = adapters.serializeWorkspaceState(dom.workspace);
  assert.equal(state.state.kind, "text_entry");
  assert.equal(state.state.value.text, LAGRANGIAN);
});

test("8: two maths fields render independently", () => {
  const html =
    buildMathWorkspaceHtml("A3", "Lagrangian") +
    buildMathWorkspaceHtml("A3", "First-order condition with respect to x");
  const ids = html.match(/data-workspace-id="([^"]+)"/g) || [];
  assert.ok(ids.length >= 2);
  const mathMounts = html.match(/data-math-entry-mount/g) || [];
  assert.equal(mathMounts.length, 2);
});

test("9: initialization failure leaves usable textarea fallback", () => {
  const dom = createMathWorkspaceDom();
  dom.sandbox.window.__PRISM_MATH_ENTRY_SPIKE_DISABLE__ = true;
  dom.sandbox.window.PRISM_MATH_ENTRY_SPIKE.boot();
  assert.ok(dom.workspace.classList.contains("util-learner-workspace--math-fallback"));
  assert.notEqual(dom.textarea.getAttribute("aria-hidden"), "true");
  dom.textarea.value = LAGRANGIAN;
  assert.equal(dom.textarea.value, LAGRANGIAN);
});

test("10: MathLive unavailable leaves textarea fallback", () => {
  const dom = createMathWorkspaceDom();
  dom.sandbox.window.MathLive = null;
  dom.sandbox.window.PRISM_MATH_ENTRY_SPIKE.boot();
  assert.ok(dom.workspace.classList.contains("util-learner-workspace--math-fallback"));
});

test("11: spike assets and version are pinned", () => {
  assert.equal(mathEntryRuntime.MATHLIVE_SPIKE_VERSION, "0.110.0");
  assert.match(mathEntryRuntime.MATHLIVE_SPIKE_SCRIPT, /lib\/mathlive-spike\/mathlive\.min\.js/);
  const stat = fs.statSync(path.join(repoRoot, mathEntryRuntime.MATHLIVE_SPIKE_SCRIPT));
  assert.ok(stat.size > 500000, "expected bundled mathlive.min.js in lib/mathlive-spike");
});

test("12: composed response part still carries math modality from template commission", () => {
  const collected = collectResponseParts.collectResponseParts({
    activityId: "A3",
    momentKind: "do",
    items: [
      {
        kind: "material",
        material: {
          id: "A3-M1",
          type: "template",
          body: "**Lagrangian:**\nRecord the Lagrangian.\n"
        }
      }
    ],
    taskSteps: [],
    modelActivity: {
      sourceActivity: {
        required_materials: [
          {
            material_id: "A3-M1",
            material_type: "template",
            response_fields: [{ label: "Lagrangian", input_modality: "math" }]
          }
        ]
      }
    }
  });
  const part = collected.parts.find((p) => p.label === "Lagrangian");
  assert.ok(part);
  assert.equal(part.inputModality, "math");
});
