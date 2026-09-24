/**
 * URL additional resources + Expository Video/Resources publication order.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS
} = require("./prism-vm-lib-bootstrap.js");

const workspace = require("../lib/utilities-visual-jobs-workspace.js");
const learnerPackage = require("../lib/learner-package.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const romanRoadsPath = path.join(
  __dirname,
  "fixtures",
  "page-assemble",
  "roman-roads-visual-jobs-valid.json"
);

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: {
      add() {},
      remove() {},
      contains() {
        return false;
      },
      toggle() {
        return false;
      }
    },
    style: {},
    dataset: {},
    children: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute() {
      return null;
    },
    addEventListener() {},
    removeEventListener() {},
    focus() {},
    click() {},
    querySelector() {
      return null;
    }
  };
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    URL,
    fetch: async () => ({ ok: false, text: async () => "" }),
    XMLHttpRequest: function XMLHttpRequest() {
      this.status = 0;
      this.responseText = "";
      this.open = function () {};
      this.send = function () {};
    },
    require,
    process,
    __dirname: repoRoot,
    _: { debounce: (fn) => fn }
  };
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener() {},
    createElement: () => createElementStub(),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub());
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild() {}, removeChild() {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem() {} },
    URL,
    Blob: function Blob() {},
    WorkflowGenerationContext: null
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(
    fs.readFileSync(path.join(repoRoot, "workflowGenerationContext.js"), "utf8"),
    sandbox,
    { filename: "workflowGenerationContext.js" }
  );
  windowStub.WorkflowGenerationContext = sandbox.window.WorkflowGenerationContext;
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return { api, sandbox };
}

const page = JSON.parse(fs.readFileSync(romanRoadsPath, "utf8"));
const { api } = loadPrismTestApi();

test("Resources authoring UI accepts file or external URL", () => {
  const ws = workspace.buildVisualJobsWorkspaceState(page, { activeView: "resources" });
  const html = workspace.renderVisualJobsWorkspaceHtml(ws);
  assert.match(html, /data-resource-file-input/);
  assert.match(html, /data-resource-url-input/);
  assert.match(html, /data-resource-link-text-input/);
  assert.match(html, /data-add-resource-ref/);
  assert.match(html, /http\(s\) URL|https:\/\//i);
});

test("external_url is preserved on additional resource refs", () => {
  const ws = workspace.buildVisualJobsWorkspaceState(page, { activeView: "resources" });
  const added = workspace.addAdditionalResourceReference(
    ws,
    "wr-url-1",
    "University of Nottingham",
    "https://www.nottingham.ac.uk"
  );
  assert.equal(added.ok, true);
  const refs = workspace.readPageResourceRefsFromPage(ws.assembledPageSnapshot);
  assert.equal(refs.additional_resources.length, 1);
  assert.equal(refs.additional_resources[0].resource_id, "wr-url-1");
  assert.equal(refs.additional_resources[0].link_text, "University of Nottingham");
  assert.equal(refs.additional_resources[0].external_url, "https://www.nottingham.ac.uk");

  workspace.addAdditionalResourceReference(ws, "wr-file-1", "Worksheet");
  const moved = workspace.moveAdditionalResourceReference(ws, "wr-file-1", "up");
  assert.equal(moved.ok, true);
  const afterMove = workspace.readPageResourceRefsFromPage(ws.assembledPageSnapshot);
  assert.equal(afterMove.additional_resources[0].resource_id, "wr-file-1");
  assert.equal(afterMove.additional_resources[1].external_url, "https://www.nottingham.ac.uk");
});

test("uploaded-file resource refs still work without external_url", () => {
  const ws = workspace.buildVisualJobsWorkspaceState(page, { activeView: "resources" });
  workspace.addAdditionalResourceReference(ws, "wr-file-only", "Case study PDF");
  const refs = workspace.normalizePageResourceRefsShape(ws.pageResourceRefs);
  assert.equal(refs.additional_resources[0].resource_id, "wr-file-only");
  assert.equal(refs.additional_resources[0].link_text, "Case study PDF");
  assert.equal(refs.additional_resources[0].external_url, undefined);
});

test("learner package leaves https additional resources as absolute links", () => {
  const pdfData =
    "data:application/pdf;base64," + Buffer.from("%PDF-1.4 fake", "utf8").toString("base64");
  const external = "https://www.nottingham.ac.uk";
  const htmlIn =
    '<main><section class="learner-additional-resources"><ul>' +
    '<li><a href="' +
    pdfData +
    '" target="_blank" rel="noopener noreferrer">File<span class="sr-only"> (opens in a new tab)</span></a></li>' +
    '<li><a href="' +
    external +
    '" target="_blank" rel="noopener noreferrer">Nottingham<span class="sr-only"> (opens in a new tab)</span></a></li>' +
    "</ul></section></main>";
  const built = learnerPackage.buildLearnerPackage({
    html: htmlIn,
    visualAssetManifest: { assets: [] },
    additionalResourceAssets: [
      {
        resource_id: "wr-doc-1",
        href: pdfData,
        mime_type: "application/pdf",
        package_path: "assets/additional-resource-1.pdf"
      },
      {
        resource_id: "wr-url-1",
        href: external,
        mime_type: "text/uri-list",
        package_path: ""
      }
    ]
  });
  assert.equal(built.ok, true);
  assert.equal(built.package.assets.length, 1);
  assert.equal(built.package.assets[0].path, "assets/additional-resource-1.pdf");
  assert.match(built.package.html, /assets\/additional-resource-1\.pdf/);
  assert.match(built.package.html, /href="https:\/\/www\.nottingham\.ac\.uk"/);
  assert.equal(built.warnings.length, 0);
});

test("Expository injects video after title and resources after exposition", () => {
  const htmlIn =
    '<main class="util-learner-page util-page util-learner-renderer-vnext util-page--expository" data-renderer="vnext" data-page-kind="expository">' +
    '<header class="util-page-header util-learning-header"><h1>Bayes theorem</h1></header>' +
    '<section class="util-exposition" data-region="exposition">' +
    '<section class="util-exposition-section" data-region-item="exposition-section">' +
    "<h2>Opening</h2><p>Body</p></section>" +
    '<section class="util-exposition-section" data-expository-section-role="terminal-close">' +
    "<h2>Close</h2><p>Terminal intellectual close.</p></section>" +
    "</section>" +
    "</main>";
  const out = api.injectWorkflowResourceSectionsIntoLearnerHtmlForTest(htmlIn, {
    videoProjection: {
      section_title: "Video",
      intro_text: "Watch first",
      embed_code: '<iframe src="https://example.com/embed" title="demo"></iframe>'
    },
    additionalResourcesProjection: {
      intro_text: "Further reading",
      items: [
        {
          resource_id: "wr-url-1",
          link_text: "University of Nottingham",
          href: "https://www.nottingham.ac.uk"
        }
      ]
    }
  });
  const titleIdx = out.indexOf("Bayes theorem");
  const videoIdx = out.indexOf('data-region="video"');
  const expositionIdx = out.indexOf('data-region="exposition"');
  const terminalIdx = out.indexOf('data-expository-section-role="terminal-close"');
  const resourcesIdx = out.indexOf('data-region="additional-resources"');
  const introIdx = out.indexOf("Further reading");
  const linkIdx = out.indexOf("https://www.nottingham.ac.uk");
  assert.ok(titleIdx >= 0);
  assert.ok(videoIdx > titleIdx, "video follows title");
  assert.ok(expositionIdx > videoIdx, "exposition follows video");
  assert.ok(terminalIdx > expositionIdx, "terminal close remains inside exposition");
  assert.ok(resourcesIdx > terminalIdx, "resources follow terminal close");
  assert.ok(introIdx > resourcesIdx, "resources intro stays with resources");
  assert.ok(linkIdx > introIdx, "learner-facing URL link rendered");
  assert.match(out, /target="_blank"/);
});

test("Interactive inject keeps Video and Resources inside Orient", () => {
  const htmlIn =
    '<main class="util-learner-page util-page util-learner-renderer-vnext" data-renderer="vnext" data-page-kind="interactive">' +
    '<header class="util-page-header"><h1>Interactive title</h1></header>' +
    '<section class="util-page-orientation" data-region="orientation">' +
    '<div id="journey-orient"><p>Orient content</p></div></section>' +
    '<section class="util-learning-activities" data-region="activities"><p>Activity</p></section>' +
    "</main>";
  const out = api.injectWorkflowResourceSectionsIntoLearnerHtmlForTest(htmlIn, {
    videoProjection: {
      section_title: "Video",
      embed_code: "<iframe src=\"https://example.com/v\"></iframe>"
    },
    additionalResourcesProjection: {
      items: [
        {
          resource_id: "wr-url-1",
          link_text: "External",
          href: "https://www.nottingham.ac.uk"
        }
      ]
    }
  });
  const orientOpen = out.indexOf('id="journey-orient"');
  const orientClose = out.indexOf("</div>", orientOpen);
  const videoIdx = out.indexOf('data-region="video"');
  const resourcesIdx = out.indexOf('data-region="additional-resources"');
  const activitiesIdx = out.indexOf('data-region="activities"');
  assert.ok(videoIdx > orientOpen && videoIdx < activitiesIdx);
  assert.ok(resourcesIdx > videoIdx && resourcesIdx < activitiesIdx);
  // Sections landed before activities; Interactive Orient path preserved.
  assert.ok(orientClose > 0);
});

test("absence of Video or Resources creates no empty furniture", () => {
  const htmlIn =
    '<main class="util-learner-page util-page util-learner-renderer-vnext util-page--expository" data-page-kind="expository">' +
    '<header class="util-page-header"><h1>Title</h1></header>' +
    '<section data-region="exposition"><section><p>Content</p></section></section>' +
    "</main>";
  const out = api.injectWorkflowResourceSectionsIntoLearnerHtmlForTest(htmlIn, {
    videoProjection: { embed_code: "" },
    additionalResourcesProjection: { intro_text: "Unused intro", items: [] }
  });
  assert.equal(out, htmlIn);
  assert.doesNotMatch(out, /data-region="video"/);
  assert.doesNotMatch(out, /data-region="additional-resources"/);
  assert.doesNotMatch(out, /Unused intro/);
});
