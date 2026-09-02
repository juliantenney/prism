/**
 * S82-G2B — production MathLive maths-entry hardening tests.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const vm = require("node:vm");
const fs = require("node:fs");

const repoRoot = path.resolve(__dirname, "..");
const sync = require(path.join(repoRoot, "lib", "learner-renderer-vnext", "math-entry-sync.js"));
const mathEntryRuntime = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "math-entry-runtime.js"
));
const mathEntryPackageAssets = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "math-entry-package-assets.js"
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
const learnerPackage = require(path.join(repoRoot, "lib", "learner-package.js"));
const zipApi = require(path.join(repoRoot, "lib", "learner-package-zip.js"));
const fflate = require("fflate");

const { getMathEntryRuntimeScript, getMathEntryHeadMarkup } = mathEntryRuntime;

const LAGRANGIAN =
  "\\mathcal{L}(x,y,\\lambda) = 4xy + \\lambda(2x + y - 20)";
const FOC = "\\frac{\\partial \\mathcal{L}}{\\partial x} = 4y + 2\\lambda = 0";

function mathPart(activityId, overrides) {
  return Object.assign(
    {
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
    },
    overrides || {}
  );
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

function buildProductionMathsExportHtml(workspaceCount) {
  const count = workspaceCount == null ? 1 : workspaceCount;
  let body = "";
  for (let i = 0; i < count; i += 1) {
    body += buildMathWorkspaceHtml("A3", "Lagrangian " + String(i + 1));
  }
  return (
    "<!doctype html><html><head>" +
    getMathEntryHeadMarkup() +
    "</head><body>" +
    body +
    "</body></html>"
  );
}

function buildAndUnzipLearnerPackage(buildOpts) {
  const built = learnerPackage.buildLearnerPackage(buildOpts);
  assert.equal(built.ok, true, built.error && built.error.message);
  const zipped = zipApi.serializeLearnerPackageToZip(built.package);
  assert.equal(zipped.ok, true, zipped.error && zipped.error.message);
  const entries = fflate.unzipSync(zipped.bytes);
  return { built, zipped, entries };
}

function expectedMathLiveZipPaths() {
  return mathEntryPackageAssets.MATHLIVE_PACKAGE_FILES.map(
    (rel) => mathEntryPackageAssets.MATHLIVE_ASSET_ROOT + "/" + rel.replace(/\\/g, "/")
  );
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
      id: "",
      setAttribute: function (k, v) {
        this.attributes[k] = String(v);
        if (k === "id") this.id = String(v);
      },
      getAttribute: function (k) {
        if (k === "id" && this.id) return this.id;
        return Object.prototype.hasOwnProperty.call(this.attributes, k)
          ? this.attributes[k]
          : null;
      },
      removeAttribute: function (k) {
        delete this.attributes[k];
        if (k === "id") this.id = "";
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
  const labelId = fieldId + "-label";
  const workspace = createElement("div");
  workspace.classList.add("util-learner-workspace", "util-learner-workspace--math-entry");
  workspace.setAttribute("data-input-modality", "math");
  workspace.setAttribute("data-workspace-kind", "text_entry");
  workspace.setAttribute("data-workspace-id", fieldId);
  workspace.setAttribute("data-math-field-id", fieldId);
  workspace.setAttribute("data-math-label-id", labelId);

  const label = createElement("label");
  label.setAttribute("id", labelId);
  label.setAttribute("for", fieldId);

  const mountWrap = createElement("div");
  mountWrap.setAttribute("data-math-entry-root", "");

  const mount = createElement("div");
  mount.setAttribute("data-math-entry-mount", "");
  mount.setAttribute("hidden", "hidden");

  const textarea = createElement("textarea");
  textarea.classList.add("util-learner-workspace__input", "util-learner-workspace__input--canonical");
  textarea.setAttribute("id", fieldId);
  textarea.value = "";

  mountWrap.appendChild(mount);
  mountWrap.appendChild(textarea);
  workspace.appendChild(label);
  workspace.appendChild(mountWrap);

  function MockMathfield() {
    this.value = "";
    this.className = "";
    this.id = "";
    this.parentNode = null;
    this.attributes = {};
    this.children = [];
  }
  MockMathfield.prototype.setAttribute = function (k, v) {
    this.attributes[k] = String(v);
    if (k === "id") this.id = String(v);
  };
  MockMathfield.prototype.getAttribute = function (k) {
    return this.attributes[k] || null;
  };
  MockMathfield.prototype.addEventListener = function (type, fn) {
    this._onInput = fn;
  };
  MockMathfield.prototype.getValue = function () {
    return this.value;
  };
  MockMathfield.prototype.setValue = function (v) {
    this.value = String(v || "");
  };
  MockMathfield.prototype.simulateInput = function (next) {
    this.value = String(next);
    if (this._onInput) this._onInput();
  };

  const labelsById = { [labelId]: label };
  const document = {
    readyState: "complete",
    getElementById: function (id) {
      return labelsById[id] || null;
    },
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
  sandbox.window.__PRISM_MATH_ENTRY_DISABLE__ = false;
  sandbox.window.document = document;
  sandbox.window.window = sandbox.window;

  vm.runInNewContext(getMathEntryRuntimeScript(), sandbox);

  return {
    workspace: workspace,
    label: label,
    textarea: textarea,
    mount: mount,
    sandbox: sandbox,
    fieldId: fieldId,
    labelId: labelId
  };
}

test("1: missing modality defaults to text", () => {
  const part = mathPart("A3");
  delete part.inputModality;
  const mapped = learnerSurfaceRegistry.workspaceFromResponsePart(part);
  assert.equal(mapped.ok, true);
  assert.equal(mapped.workspace.inputModality, "text");
  assert.equal(sync.normalizeInputModality(undefined), "text");
});

test("2: text modality renders ordinary textarea without maths enhancement", () => {
  const mapped = learnerSurfaceRegistry.workspaceFromResponsePart(textPart("A3"));
  const html = renderComposedMoment.renderLearnerWorkspace(mapped.workspace, "A3");
  assert.doesNotMatch(html, /data-input-modality="math"/);
  assert.doesNotMatch(html, /data-math-entry/);
  assert.match(html, /<textarea class="util-learner-workspace__input"/);
  assert.doesNotMatch(html, /util-learner-workspace__input--canonical/);
});

test("3: math modality renders production maths enhancement markup", () => {
  const html = buildMathWorkspaceHtml("A3");
  assert.match(html, /data-input-modality="math"/);
  assert.match(html, /data-math-entry="true"/);
  assert.match(html, /util-learner-workspace--math-entry/);
  assert.match(html, /data-math-entry-mount/);
  assert.match(html, /maths keyboard for symbols/);
});

test("4: canonical textarea remains present for maths fields", () => {
  const html = buildMathWorkspaceHtml("A3");
  assert.match(html, /util-learner-workspace__input--canonical/);
  assert.match(html, /data-workspace-kind="text_entry"/);
});

test("5: MathLive edits sync to canonical textarea", () => {
  const dom = createMathWorkspaceDom();
  dom.sandbox.window.PRISM_MATH_ENTRY.boot();
  const mf = dom.workspace.__prismMathfield;
  assert.ok(mf);
  mf.simulateInput(LAGRANGIAN);
  assert.equal(dom.textarea.value, LAGRANGIAN);
});

test("6: textarea value initializes MathLive on enhance", () => {
  const dom = createMathWorkspaceDom();
  dom.textarea.value = FOC;
  dom.sandbox.window.PRISM_MATH_ENTRY.boot();
  assert.equal(dom.workspace.__prismMathfield.getValue(), FOC);
});

test("7: restored draft resynchronises MathLive", () => {
  const dom = createMathWorkspaceDom();
  dom.sandbox.window.PRISM_MATH_ENTRY.boot();
  dom.textarea.value = FOC;
  dom.sandbox.window.PRISM_MATH_ENTRY.resyncAll();
  assert.equal(dom.workspace.__prismMathfield.getValue(), FOC);
});

test("8: subsequent maths edit persists through textarea", () => {
  const dom = createMathWorkspaceDom();
  dom.sandbox.window.PRISM_MATH_ENTRY.boot();
  dom.workspace.__prismMathfield.simulateInput(LAGRANGIAN);
  const state = adapters.serializeWorkspaceState(dom.workspace);
  assert.equal(state.state.value.text, LAGRANGIAN);
  dom.textarea.value = FOC;
  dom.sandbox.window.PRISM_MATH_ENTRY.resyncAll();
  dom.workspace.__prismMathfield.simulateInput(LAGRANGIAN);
  assert.equal(adapters.serializeWorkspaceState(dom.workspace).state.value.text, LAGRANGIAN);
});

test("9: two maths fields remain independent", () => {
  const html =
    buildMathWorkspaceHtml("A3", "Lagrangian") +
    buildMathWorkspaceHtml("A3", "First-order condition");
  const mounts = html.match(/data-math-entry-mount/g) || [];
  assert.equal(mounts.length, 2);
  const fieldIds = html.match(/data-math-field-id="([^"]+)"/g) || [];
  assert.ok(fieldIds.length >= 2);
});

test("10: text and maths fields coexist in composed HTML", () => {
  const textHtml = renderComposedMoment.renderLearnerWorkspace(
    learnerSurfaceRegistry.workspaceFromResponsePart(textPart("A1")).workspace,
    "A1"
  );
  const mathHtml = buildMathWorkspaceHtml("A1", "Objective function");
  const combined = textHtml + mathHtml;
  assert.match(combined, /data-input-modality="math"/);
  assert.match(combined, /<textarea class="util-learner-workspace__input"/);
  assert.doesNotMatch(textHtml, /data-math-entry/);
});

test("11: enhancement failure restores usable labelled textarea", () => {
  const dom = createMathWorkspaceDom();
  dom.sandbox.window.__PRISM_MATH_ENTRY_DISABLE__ = true;
  dom.sandbox.window.PRISM_MATH_ENTRY.boot();
  assert.ok(dom.workspace.classList.contains("util-learner-workspace--math-fallback"));
  assert.notEqual(dom.textarea.getAttribute("aria-hidden"), "true");
  assert.equal(dom.textarea.id, dom.fieldId);
  assert.equal(dom.label.getAttribute("for"), dom.fieldId);
  dom.textarea.value = LAGRANGIAN;
  assert.equal(dom.textarea.value, LAGRANGIAN);
});

test("12: enhanced field associates label with math-field control", () => {
  const dom = createMathWorkspaceDom();
  dom.sandbox.window.PRISM_MATH_ENTRY.boot();
  const mf = dom.workspace.__prismMathfield;
  assert.equal(mf.id, dom.fieldId);
  assert.equal(dom.label.getAttribute("for"), dom.fieldId);
  assert.equal(mf.getAttribute("aria-labelledby"), dom.labelId);
  assert.equal(dom.textarea.getAttribute("id"), null);
  assert.equal(dom.textarea.getAttribute("aria-hidden"), "true");
});

test("13: maths learner package includes MathLive assets", () => {
  const html = buildProductionMathsExportHtml(1);
  const { built, entries } = buildAndUnzipLearnerPackage({
    html,
    visualAssetManifest: { assets: [] },
    repoRoot
  });
  const paths = built.package.assets.map((a) => a.path);
  expectedMathLiveZipPaths().forEach((expectedPath) => {
    assert.ok(paths.includes(expectedPath), "missing package asset: " + expectedPath);
    assert.ok(entries[expectedPath], "missing ZIP entry: " + expectedPath);
    assert.ok(entries[expectedPath].length > 0, "empty ZIP entry: " + expectedPath);
  });
});

test("13b: maths learner package ZIP matches HTML lib/mathlive references", () => {
  const html = buildProductionMathsExportHtml(17);
  const { built, entries } = buildAndUnzipLearnerPackage({
    html,
    visualAssetManifest: { assets: [] },
    repoRoot
  });
  assert.match(built.package.html, /lib\/mathlive\/mathlive\.min\.js/);
  assert.match(built.package.html, /lib\/mathlive\/mathlive-fonts\.css/);
  const zipPaths = Object.keys(entries);
  assert.ok(zipPaths.includes("learner-page.html"));
  assert.equal(
    zipPaths.filter((p) => p.indexOf("lib/mathlive/") === 0).length,
    mathEntryPackageAssets.MATHLIVE_PACKAGE_FILES.length
  );
  const htmlInZip = fflate.strFromU8(entries["learner-page.html"]);
  assert.match(htmlInZip, /data-input-modality="math"/);
  assert.match(htmlInZip, /lib\/mathlive\/mathlive\.min\.js/);
});

test("13c: browser export path supplies MathLive assets via mathLivePackageAssets option", () => {
  const html = buildProductionMathsExportHtml(2);
  const mathLiveAssets = mathEntryPackageAssets.collectMathLivePackageAssets({ repoRoot }).map(
    (asset) => ({
      path: asset.path,
      bytes: new Uint8Array(asset.bytes),
      mime: asset.mime
    })
  );
  const { entries } = buildAndUnzipLearnerPackage({
    html,
    visualAssetManifest: { assets: [] },
    mathLivePackageAssets: mathLiveAssets
  });
  expectedMathLiveZipPaths().forEach((expectedPath) => {
    assert.ok(entries[expectedPath], "browser-path ZIP missing: " + expectedPath);
  });
});

test("13d: maths packaging fails closed when MathLive assets are not supplied", () => {
  const html = buildProductionMathsExportHtml(1);
  const built = learnerPackage.buildLearnerPackage({
    html,
    visualAssetManifest: { assets: [] },
    mathLivePackageAssets: []
  });
  assert.equal(built.ok, false);
  assert.equal(built.error && built.error.code, "mathlive_assets_missing");
});

test("14: non-maths learner package has no MathLive assets", () => {
  const mapped = learnerSurfaceRegistry.workspaceFromResponsePart(textPart("A4"));
  const html = renderComposedMoment.renderLearnerWorkspace(mapped.workspace, "A4");
  const { built, entries } = buildAndUnzipLearnerPackage({
    html: "<html><body>" + html + "</body></html>",
    visualAssetManifest: { assets: [] }
  });
  const paths = built.package.assets.map((a) => a.path);
  assert.equal(paths.filter((p) => p.indexOf("lib/mathlive/") === 0).length, 0);
  assert.equal(Object.keys(entries).filter((p) => p.indexOf("lib/mathlive/") === 0).length, 0);
  assert.doesNotMatch(built.package.html, /lib\/mathlive\//);
});

test("15: learner TeX evidence is not routed through Markdown", () => {
  const dom = createMathWorkspaceDom();
  dom.textarea.value = LAGRANGIAN;
  const serialized = adapters.serializeWorkspaceState(dom.workspace);
  assert.equal(serialized.state.value.text, LAGRANGIAN);
  assert.doesNotMatch(serialized.state.value.text, /<em>/);
  assert.doesNotMatch(serialized.state.value.text, /&lt;/);
});

test("16: historical workspaces without inputModality remain text_entry text", () => {
  const part = mathPart("A5");
  delete part.inputModality;
  const collected = collectResponseParts.collectResponseParts({
    activityId: "A5",
    momentKind: "do",
    items: [
      {
        kind: "material",
        material: {
          id: "A5-M1",
          type: "template",
          body: "**Conclusion:**\nSummarise.\n"
        }
      }
    ],
    taskSteps: [],
    modelActivity: {
      sourceActivity: {
        required_materials: [
          {
            material_id: "A5-M1",
            material_type: "template",
            response_fields: [{ label: "Conclusion" }]
          }
        ]
      }
    }
  });
  const partNoModality = collected.parts.find((p) => p.label === "Conclusion");
  assert.ok(partNoModality);
  assert.equal(partNoModality.inputModality, "text");
  const mapped = learnerSurfaceRegistry.workspaceFromResponsePart(partNoModality);
  const html = renderComposedMoment.renderLearnerWorkspace(mapped.workspace, "A5");
  assert.doesNotMatch(html, /data-input-modality="math"/);
});

test("production: MathLive version, license, and VK policy are pinned", () => {
  assert.equal(mathEntryRuntime.MATHLIVE_VERSION, "0.110.0");
  assert.equal(sync.MATHLIVE_LICENSE, "MIT");
  assert.equal(mathEntryRuntime.VIRTUAL_KEYBOARD_MODE, "manual");
  assert.match(mathEntryRuntime.MATHLIVE_SCRIPT, /lib\/mathlive\/mathlive\.min\.js/);
  const stat = fs.statSync(path.join(repoRoot, mathEntryRuntime.MATHLIVE_SCRIPT));
  assert.ok(stat.size > 500000);
});

test("production: maths pages require MathLive head markup; text pages do not", () => {
  const mathHtml = buildMathWorkspaceHtml("A3");
  const textHtml = renderComposedMoment.renderLearnerWorkspace(
    learnerSurfaceRegistry.workspaceFromResponsePart(textPart("A4")).workspace,
    "A4"
  );
  assert.equal(mathEntryPackageAssets.pageHtmlNeedsMathEntry(mathHtml), true);
  assert.match(mathEntryRuntime.getMathEntryHeadMarkup(), /lib\/mathlive\/mathlive\.min\.js/);
  assert.match(mathEntryRuntime.getMathEntryRuntimeScript(), /PRISM_MATH_ENTRY/);
  assert.equal(mathEntryPackageAssets.pageHtmlNeedsMathEntry(textHtml), false);
});

test("production: package asset collector lists all required MathLive files", () => {
  const assets = mathEntryPackageAssets.collectMathLivePackageAssets({ repoRoot });
  assert.equal(assets.length, mathEntryPackageAssets.MATHLIVE_PACKAGE_FILES.length);
  assets.forEach((asset) => {
    assert.ok(asset.bytes && asset.bytes.length > 0);
    assert.match(asset.path, /^lib\/mathlive\//);
  });
});

test("production: index.html loads MathLive package asset collector before learner-package", () => {
  const indexHtml = fs.readFileSync(path.join(repoRoot, "index.html"), "utf8");
  const assetsIdx = indexHtml.indexOf("math-entry-package-assets.js");
  const packageIdx = indexHtml.indexOf("lib/learner-package.js");
  assert.ok(assetsIdx >= 0);
  assert.ok(packageIdx >= 0);
  assert.ok(assetsIdx < packageIdx);
});

test("production: app.js browser export fetches MathLive before ZIP build", () => {
  const appSource = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  assert.match(appSource, /fetchMathLivePackageAssets/);
  assert.match(appSource, /mathLivePackageAssets:\s*mathLiveAssets/);
});
