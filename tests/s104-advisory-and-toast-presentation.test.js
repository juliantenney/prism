"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {
  createPrismVmElementStub,
  runPrismLibScriptsInSandbox
} = require("./prism-vm-lib-bootstrap.js");

const REPO_ROOT = path.resolve(__dirname, "..");

function createRichElement(tag) {
  const attrs = Object.create(null);
  const listeners = Object.create(null);
  const classes = new Set();
  const el = {
    tagName: String(tag || "DIV").toUpperCase(),
    value: "",
    textContent: "",
    innerHTML: "",
    hidden: false,
    parentNode: null,
    style: {},
    dataset: {},
    children: [],
    get className() {
      return Array.from(classes).join(" ");
    },
    set className(v) {
      classes.clear();
      String(v || "")
        .split(/\s+/)
        .filter(Boolean)
        .forEach((c) => classes.add(c));
    },
    classList: {
      add: (...cs) => cs.forEach((c) => classes.add(c)),
      remove: (...cs) => cs.forEach((c) => classes.delete(c)),
      contains: (c) => classes.has(c),
      toggle: (c, force) => {
        if (force === undefined) {
          if (classes.has(c)) {
            classes.delete(c);
            return false;
          }
          classes.add(c);
          return true;
        }
        if (force) classes.add(c);
        else classes.delete(c);
        return !!force;
      }
    },
    appendChild(child) {
      if (child) {
        child.parentNode = el;
        el.children.push(child);
      }
      return child;
    },
    removeChild(child) {
      const idx = el.children.indexOf(child);
      if (idx !== -1) el.children.splice(idx, 1);
      if (child) child.parentNode = null;
      return child;
    },
    insertBefore(child, ref) {
      if (!child) return child;
      child.parentNode = el;
      const idx = el.children.indexOf(ref);
      if (idx === -1) el.children.push(child);
      else el.children.splice(idx, 0, child);
      return child;
    },
    setAttribute(k, v) {
      attrs[k] = String(v);
    },
    getAttribute(k) {
      return Object.prototype.hasOwnProperty.call(attrs, k) ? attrs[k] : null;
    },
    removeAttribute(k) {
      delete attrs[k];
    },
    addEventListener(evt, fn) {
      if (!listeners[evt]) listeners[evt] = [];
      listeners[evt].push(fn);
    },
    dispatch(evt) {
      (listeners[evt] || []).forEach((fn) => fn({ target: el }));
    },
    querySelector(sel) {
      if (sel === '[data-role="workload-feasibility-warning"]') {
        return el.children.find((c) => c.getAttribute("data-role") === "workload-feasibility-warning") || null;
      }
      return null;
    },
    querySelectorAll() {
      return [];
    },
    click() {
      el.dispatch("click");
    },
    focus() {},
    remove() {
      if (el.parentNode) el.parentNode.removeChild(el);
    }
  };
  return el;
}

function loadHarness() {
  const storageMap = new Map();
  const toastContainer = createRichElement("div");
  toastContainer.setAttribute("id", "toastContainer");

  const doc = {
    getElementById(id) {
      if (id === "toastContainer") return toastContainer;
      return createPrismVmElementStub();
    },
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: (tag) => createRichElement(tag),
    body: createRichElement("body"),
    addEventListener: () => {}
  };

  let nextTimerId = 1;
  const activeTimers = new Map();
  const fakeSetTimeout = (fn, ms) => {
    const id = nextTimerId++;
    activeTimers.set(id, { fn, ms });
    return id;
  };
  const fakeClearTimeout = (id) => {
    activeTimers.delete(id);
  };

  const sandbox = {
    console,
    Math,
    Date,
    JSON,
    URL,
    Set,
    Map,
    Promise,
    Error,
    RegExp,
    Array,
    Object,
    String,
    Number,
    Boolean,
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    setTimeout: fakeSetTimeout,
    clearTimeout: fakeClearTimeout,
    setInterval: () => 0,
    clearInterval: () => {},
    document: doc,
    localStorage: {
      getItem: (k) => (storageMap.has(String(k)) ? storageMap.get(String(k)) : null),
      setItem: (k, v) => {
        storageMap.set(String(k), String(v));
      },
      removeItem: (k) => {
        storageMap.delete(String(k));
      }
    },
    navigator: { clipboard: { writeText: async () => {} } },
    location: { protocol: "http:", hostname: "localhost", href: "http://localhost/prism/" },
    alert: () => {},
    confirm: () => true,
    Blob: function () {},
    fetch: () => new Promise(() => {}),
    _: { debounce: (fn) => fn },
    Utils: { debounce: (fn) => fn },
    window: null
  };
  sandbox.window = sandbox;
  sandbox.self = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);

  runPrismLibScriptsInSandbox(sandbox, REPO_ROOT);

  const appSource = fs.readFileSync(path.join(REPO_ROOT, "app.js"), "utf8");
  vm.runInContext(appSource, sandbox, { filename: "app.js" });
  return {
    api: sandbox.window.__PRISM_TEST_API,
    toastContainer,
    activeTimers
  };
}

const SINGLE_COMMISSION_WARNING = [
  "Workload feasibility (advisory, commission): Five-minute Practice Probe has an allocated duration of 5 minutes (indicative learner-facing range: 3–7 minutes), while the estimated workload range is approximately 14–31 minutes, driven principally by evidence inspection, reasoning/judgement, and response production. Options at this stage: narrow scope or reduce the number of required written steps. Upstream options: increase the allocated duration and, where applicable, rebalance the Learning Journey. This warning is advisory and based on approximate workload estimates: it flags a potential design mismatch rather than a proven defect, and the absence of a warning does not guarantee feasibility for every learner. You may retain the current design where your professional judgement and knowledge of your learners justify it.",
  "Workload feasibility (advisory, journey): One or more commissions appear overloaded relative to their allocated time and indicative tolerance: Five-minute Practice Probe (14–31 min vs 5 min). Commission allocations sum to 50 minutes and match the journey envelope of 50 minutes (indicative learner planning range: 38–63 minutes) arithmetically, but a correctly summed journey is not automatically feasible when individual commissions exceed their indicative tolerance. Practical options at this stage: revise the scope of overloaded commissions, redistribute time across commissions, or increase the journey envelope while preserving pedagogically essential activity."
].join("\n\n");

const MULTI_COMMISSION_WARNING = [
  "Workload feasibility (advisory, commission): Commission A has an allocated duration of 5 minutes (indicative learner-facing range: 3–7 minutes), while the estimated workload range is approximately 14–31 minutes, driven principally by reasoning/judgement. Options at this stage: tighten scope. Upstream options: increase allocated duration. This warning is advisory.",
  "Workload feasibility (advisory, commission): Commission B has an allocated duration of 15 minutes (indicative learner-facing range: 10–20 minutes), while the estimated workload range is approximately 24–42 minutes, driven principally by response production. Options at this stage: streamline tasks. Upstream options: increase allocated duration. This warning is advisory.",
  "Workload feasibility (advisory, journey): One or more commissions appear overloaded relative to their allocated time and indicative tolerance: Commission A (14–31 min vs 5 min); Commission B (24–42 min vs 15 min). Commission allocations sum to 50 minutes and match the journey envelope of 50 minutes arithmetically, but a correctly summed journey is not automatically feasible when individual commissions exceed their indicative tolerance."
].join("\n\n");

test("1. Single-commission workload advisory renders compact collapsed-by-default disclosure preserving all diagnostics", () => {
  const { api } = loadHarness();
  const parsed = api.parseWorkloadAdvisoryEntriesForTest(SINGLE_COMMISSION_WARNING);
  assert.equal(parsed.items.length, 1);
  assert.equal(parsed.items[0].subject, "Five-minute Practice Probe");
  assert.equal(parsed.items[0].allocatedMinutes, "5");
  assert.equal(parsed.items[0].estimatedLow, "14");
  assert.equal(parsed.items[0].estimatedHigh, "31");
  assert.match(parsed.summaryText, /Five-minute Practice Probe — 14–31 min estimated vs 5 min allocated/);

  const html = api.buildWorkloadAdvisoryHtmlForTest(SINGLE_COMMISSION_WARNING);
  // Collapsed by default (no open attribute on <details>)
  assert.match(html, /^<details class="workflow-workload-advisory">/);
  assert.doesNotMatch(html, /<details[^>]*\bopen\b/);
  // Concise summary line with Advisory tag
  assert.match(html, /workflow-workload-advisory__tag">Advisory<\/span>/);
  assert.match(html, /Five-minute Practice Probe — 14–31 min estimated vs 5 min allocated/);
  // Full diagnostics preserved inside disclosure body
  assert.match(html, /indicative learner-facing range: 3–7 minutes/);
  assert.match(html, /driven principally by evidence inspection, reasoning\/judgement, and response production/);
  assert.match(html, /Options at this stage:/);
  assert.match(html, /Upstream options:/);
  assert.match(html, /This warning is advisory and based on approximate workload estimates/);
  // Journey-level summary does NOT repeat the commission-level list
  assert.doesNotMatch(
    html,
    /One or more commissions appear overloaded relative to their allocated time and indicative tolerance/
  );
  assert.match(html, /Commission allocations sum to 50 minutes/);
});

test("2. Multi-commission workload advisory renders compact summary with individually inspectable disclosures", () => {
  const { api } = loadHarness();
  const html = api.buildWorkloadAdvisoryHtmlForTest(MULTI_COMMISSION_WARNING);
  assert.match(html, /2 commissions exceed allocated time/);
  assert.match(html, /Commission A \(14–31 vs 5 min\)/);
  assert.match(html, /Commission B \(24–42 vs 15 min\)/);
  const itemMatches = html.match(/<details class="workflow-workload-advisory__item">/g) || [];
  assert.equal(itemMatches.length, 2, "Each affected commission must have its own collapsed disclosure");
  assert.doesNotMatch(html, /<details[^>]*\bopen\b/);
  // No repeated commission list inside journey note
  assert.doesNotMatch(
    html,
    /One or more commissions appear overloaded relative to their allocated time and indicative tolerance/
  );
});

test("3. Constituent workflow workload advisory (Situated Task / Practice / Assessment Pack) uses the same compact disclosure", () => {
  const { api } = loadHarness();
  const constituentWarn =
    "Workload feasibility (advisory, Situated Task): Economic Policy Brief has an allocated duration of 15 minutes (indicative learner-facing range: 10–20 minutes), while the estimated workload range is approximately 25–40 minutes, driven principally by evidence inspection and response production. Options at this stage: tighten scope. Upstream options: reconsider the allocated duration at the upstream Learning Journey commissioning level (this component's commissioned duration is locked and cannot be changed here). This warning is advisory.";
  const html = api.buildWorkloadAdvisoryHtmlForTest(constituentWarn);
  assert.match(html, /<details class="workflow-workload-advisory">/);
  assert.match(html, /Economic Policy Brief — 25–40 min estimated vs 15 min allocated/);
  assert.match(html, /commissioned duration is locked and cannot be changed here/);
});

test("4. Toast deduplication suppresses repeated validation/hydration advisories, announces changes, and preserves blocking errors", () => {
  const { api, toastContainer } = loadHarness();
  api.resetToastNotificationStateForTest();

  // (a) Hydration seeds condition silently (0 toasts; inline advisory handles display)
  const hyd = api.notifyWorkloadAdvisoryToastForTest("wf-1", "s4", SINGLE_COMMISSION_WARNING, {
    fromHydration: true
  });
  assert.equal(hyd.shown, false);
  assert.equal(toastContainer.children.length, 0);

  // (b) Re-validating the exact same unchanged advisory after hydration does NOT fire a toast
  const reval = api.notifyWorkloadAdvisoryToastForTest("wf-1", "s4", SINGLE_COMMISSION_WARNING);
  assert.equal(reval.shown, false);
  assert.equal(reval.reason, "unchanged_advisory");
  assert.equal(toastContainer.children.length, 0);

  // (c) Materially changed advisory (e.g. edited scope -> multi-commission) IS announced once with concise copy
  const changed = api.notifyWorkloadAdvisoryToastForTest("wf-1", "s4", MULTI_COMMISSION_WARNING);
  assert.equal(changed.shown, true);
  assert.equal(toastContainer.children.length, 1);
  assert.equal(toastContainer.children[0].getAttribute("role"), "status");
  assert.equal(toastContainer.children[0].getAttribute("aria-live"), "polite");
  assert.match(changed.message, /^Workload advisory: 2 commissions exceed allocated time\. See step details\.$/);

  // (d) Repeated validation of the same changed advisory does NOT stack or re-announce
  const dup = api.notifyWorkloadAdvisoryToastForTest("wf-1", "s4", MULTI_COMMISSION_WARNING);
  assert.equal(dup.shown, false);
  assert.equal(toastContainer.children.length, 1);

  // (e) Clearing the advisory resets state; if it later recurs, it IS announced as a new condition
  api.notifyWorkloadAdvisoryToastForTest("wf-1", "s4", "");
  assert.equal(toastContainer.children.length, 0);
  const recurred = api.notifyWorkloadAdvisoryToastForTest("wf-1", "s4", SINGLE_COMMISSION_WARNING);
  assert.equal(recurred.shown, true);
  assert.equal(toastContainer.children.length, 1);

  // (f) Blocking error is ALWAYS distinct (role="alert", aria-live="assertive") and never suppressed by advisory
  const errRes = api.showToastForTest("Stage 4 capture has invalid JSON.", "error");
  assert.equal(errRes.shown, true);
  const errEl = errRes.toast;
  assert.equal(errEl.getAttribute("role"), "alert");
  assert.equal(errEl.getAttribute("aria-live"), "assertive");
  assert.equal(errEl.classList.contains("toast-error"), true);

  // (g) Duplicate identical error in rapid succession does NOT stack
  const errDup = api.showToastForTest("Stage 4 capture has invalid JSON.", "error");
  assert.equal(errDup.shown, false);
  assert.equal(errDup.reason, "active_duplicate");

  // (h) Accessible close button dismisses toast cleanly
  const closeBtn = errEl.children.find((c) => c.className === "toast-close");
  assert.ok(closeBtn, "Toast must include accessible close button");
  assert.equal(closeBtn.getAttribute("type"), "button");
  assert.equal(closeBtn.getAttribute("aria-label"), "Dismiss notification");
  closeBtn.click();
});

test("5. index.html and style.css reflect accessible live-region semantics and subordinate advisory/readable toast styling", () => {
  const html = fs.readFileSync(path.join(REPO_ROOT, "index.html"), "utf8");
  const css = fs.readFileSync(path.join(REPO_ROOT, "style.css"), "utf8");
  // Container must NOT have aria-atomic="true" (which forces re-announcement of all sibling toasts)
  assert.match(html, /id="toastContainer"[^>]*aria-label="Notifications"/);
  assert.doesNotMatch(html, /id="toastContainer"[^>]*aria-atomic="true"/);
  // Readable card toasts (not 999px pills) with semantic type classes
  assert.match(css, /\.toast\s*\{[\s\S]*?border-radius:\s*10px;/);
  assert.match(css, /\.toast\.toast-info\s*\{/);
  assert.match(css, /\.toast\.toast-success\s*\{/);
  assert.match(css, /\.toast\.toast-warning\s*\{/);
  assert.match(css, /\.toast\.toast-error\s*\{/);
  // Subordinate slate advisory treatment (not loud amber border/bg)
  assert.match(css, /\.workflow-run-workload-feasibility-warning\s*\{[^}]*background:\s*#f8fafc;/);
  assert.doesNotMatch(css, /\.workflow-run-workload-feasibility-warning\s*\{[^}]*#fffbeb/);
});
