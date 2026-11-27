/**
 * Sprint 104 — Selection cluster model (contract version 2).
 *
 * A selection material may carry a coherent cluster of independently answerable items.
 * Regression fixtures are the verbatim C2 (four TP/FP/TN/FN classifications) and C6
 * (six numerator/denominator/interpretation decisions) captures from the
 * "Interpreting diagnostic test results" Learning Journey.
 *
 * Correspondence is structural (item identity) — no prose or option-key inspection.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const normalizeSelection = require("../lib/learner-renderer-vnext/normalize-selection.js");
const selectionContract = require("../lib/selection-material-contract.js");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext/render-learner-page.js");
const { buildPageModel } = require("../lib/learner-renderer-vnext/build-page-model.js");
const assessmentRuntime = require("../lib/learner-renderer-vnext/assessment-runtime.js");
const draftAdapters = require("../lib/learner-renderer-vnext/learner-draft-adapters.js");

const FIXTURE_DIR = path.join(__dirname, "fixtures", "s104-selection-cluster");

function fixture(name) {
  return JSON.parse(fs.readFileSync(path.join(FIXTURE_DIR, name), "utf8"));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

const EPISODE_PLAN = {
  archetype: "apply",
  beats: [
    { function: "activation" },
    { function: "explanation" },
    { function: "independent_performance" },
    { function: "verification" }
  ]
};

/** Assembled page (design_page stage) from a DLA capture + GAM capture, as publication sees it. */
function assemblePage(dla, gam) {
  const activity = Object.assign({}, clone(dla.activities[0]), {
    duration_minutes: 3,
    mapped_learning_outcomes: ["LO1"],
    materials: clone(gam.activities[0].materials),
    episode_plan: clone(EPISODE_PLAN)
  });
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "practice",
    page_kind: "practice",
    title: "Interpreting diagnostic test results",
    audience: "Learners",
    page_profile: { profile_type: "learner" },
    page_synthesis: { overview: { body: "Overview.", format: "markdown" } },
    learning_outcomes: [{ id: "LO1", statement: "Interpret diagnostic results." }],
    episode_plans: [
      { activity_id: "A1", mapped_learning_outcome_ids: ["LO1"], episode_plan: clone(EPISODE_PLAN) }
    ],
    activities: [activity],
    learning_sequence: {
      total_duration_minutes: 3,
      ordered_activity_ids: ["A1"],
      timeline: [{ activity_id: "A1", duration_minutes: 3, start_seconds: 0, end_seconds: 180 }]
    },
    assembly_state: {
      current_stage: "design_page",
      enriched_by: ["episode_plan", "dla", "gam", "learning_sequence", "design_page"]
    }
  };
}

function renderPage(page, includeRuntimeScripts) {
  return renderLearnerPageHtml(page, {
    includeRuntimeScripts: includeRuntimeScripts !== false,
    compositionMode: "moments"
  });
}

function attrsOf(tag) {
  const out = {};
  const re = /([A-Za-z_:][\w:.-]*)="([^"]*)"/g;
  let m;
  while ((m = re.exec(tag)) !== null) out[m[1]] = m[2];
  return out;
}

/** Selection articles of the rendered page: attributes, radio inputs and legend. */
function selectionArticles(html) {
  const out = [];
  const parts = String(html).split("<article ").slice(1);
  parts.forEach(function (chunk) {
    const open = chunk.slice(0, chunk.indexOf(">"));
    const attrs = attrsOf(open);
    if (attrs["data-workspace-kind"] !== "assessment_selection") return;
    const body = chunk.slice(0, chunk.indexOf("</article>"));
    const inputs = [];
    const re = /<input[^>]*>/g;
    let m;
    while ((m = re.exec(body)) !== null) {
      const inputAttrs = attrsOf(m[0]);
      if (inputAttrs.type === "radio" || inputAttrs.type === "checkbox") inputs.push(inputAttrs);
    }
    const legend = body.match(/<legend class="util-assessment-legend">([\s\S]*?)<\/legend>/);
    out.push({
      attrs: attrs,
      inputs: inputs,
      legend: legend ? legend[1].replace(/<[^>]+>/g, "").trim() : ""
    });
  });
  return out;
}

function createStubNode(tagName) {
  const attrs = Object.create(null);
  const children = [];
  const node = {
    tagName: String(tagName || "DIV").toUpperCase(),
    children: children,
    className: "",
    classList: {
      contains: function (token) {
        return (" " + node.className + " ").indexOf(" " + token + " ") !== -1;
      }
    },
    checked: false,
    value: "",
    textContent: "",
    hidden: false,
    style: {},
    parentNode: null,
    setAttribute: function (name, value) {
      attrs[String(name)] = String(value);
    },
    getAttribute: function (name) {
      return Object.prototype.hasOwnProperty.call(attrs, String(name)) ? attrs[String(name)] : null;
    },
    appendChild: function (child) {
      child.parentNode = node;
      children.push(child);
      return child;
    },
    querySelectorAll: function (selector) {
      const out = [];
      (function walk(current) {
        (current.children || []).forEach(function (child) {
          if (stubMatches(child, selector)) out.push(child);
          walk(child);
        });
      })(node);
      return out;
    },
    querySelector: function (selector) {
      return node.querySelectorAll(selector)[0] || null;
    },
    addEventListener: function (type, fn) {
      if (type !== "click") return;
      node._listeners = node._listeners || [];
      node._listeners.push(fn);
    },
    removeEventListener: function () {}
  };
  return node;
}

function stubMatches(node, selector) {
  const sel = String(selector || "").trim();
  if (sel === 'input[type="radio"]:checked' || sel === "input[type=radio]:checked") {
    return node.tagName === "INPUT" && node.getAttribute("type") === "radio" && !!node.checked;
  }
  if (sel === 'input[type="radio"]') {
    return node.tagName === "INPUT" && node.getAttribute("type") === "radio";
  }
  if (sel === 'input[type="radio"][data-assessment-option]') {
    return (
      node.tagName === "INPUT" &&
      node.getAttribute("type") === "radio" &&
      node.getAttribute("data-assessment-option") != null
    );
  }
  if (sel === ".util-assessment-item--interactive") {
    return !!(node.classList && node.classList.contains("util-assessment-item--interactive"));
  }
  if (sel.startsWith("input[data-assessment-option=")) {
    const key = sel.match(/"([^"]+)"/)[1];
    return node.tagName === "INPUT" && node.getAttribute("data-assessment-option") === key;
  }
  if (sel.startsWith("[")) {
    const body = sel.slice(1, -1);
    const eq = body.indexOf("=");
    if (eq < 0) return node.getAttribute(body) != null;
    return node.getAttribute(body.slice(0, eq)) === body.slice(eq + 1).replace(/^["']|["']$/g, "");
  }
  return false;
}

/** Stub DOM article mirroring one rendered selection article (attributes + radios). */
function stubArticleFrom(parsed) {
  const article = createStubNode("article");
  Object.keys(parsed.attrs).forEach(function (name) {
    article.setAttribute(name, parsed.attrs[name]);
  });
  article.className = parsed.attrs.class || "";
  parsed.inputs.forEach(function (inputAttrs) {
    const input = createStubNode("input");
    Object.keys(inputAttrs).forEach(function (name) {
      input.setAttribute(name, inputAttrs[name]);
    });
    input.value = inputAttrs.value || inputAttrs["data-assessment-option"] || "";
    article.appendChild(input);
  });
  const check = createStubNode("button");
  check.setAttribute("data-assessment-check", "");
  article.appendChild(check);
  const result = createStubNode("div");
  result.setAttribute("data-assessment-result", "");
  result.hidden = true;
  article.appendChild(result);
  return article;
}

function dlaRowFor(dla, materialId) {
  return dla.activities[0].required_materials.find(function (row) {
    return row.material_id === materialId;
  });
}

function declareV2(pageOrDla, materialId, items) {
  const activity = pageOrDla.activities[0];
  const row = activity.required_materials.find(function (r) {
    return r.material_id === materialId;
  });
  row.response_fulfilment.contract_version = 2;
  row.response_fulfilment.response_items = items;
}

/** Convert a legacy GAM items[] selection into a strict v2 cluster (closed schema). */
function toStrictCluster(selection) {
  const out = {
    contract_version: 2,
    form: selection.form,
    items: (selection.items || []).map(function (item) {
      const row = {
        item_id: String(item.item_id || item.id || item.key),
        prompt: item.prompt,
        correct_answer: item.correct_answer
      };
      if (item.options) row.options = item.options;
      if (item.form) row.form = item.form;
      return row;
    })
  };
  if (selection.options) out.options = selection.options;
  if (selection.feedback) out.feedback = selection.feedback;
  return out;
}

const C2_EXPECTED = { person_a: "TP", person_b: "FP", person_c: "FN", person_d: "TN" };

// ---------------------------------------------------------------------------
// C2 — four independent classifications
// ---------------------------------------------------------------------------

test("C2 capture: four independent classifications with correct answers and feedback", () => {
  const dla = fixture("c2-dla.json");
  const gam = fixture("c2-gam.json");
  const result = renderPage(assemblePage(dla, gam));
  assert.equal(result.error, null, result.error);

  const articles = selectionArticles(result.html);
  assert.equal(articles.length, 4, "four selection controls, not one");

  const names = articles.map(function (a) {
    return a.inputs.map(function (i) {
      return i.name;
    });
  });
  names.forEach(function (group) {
    assert.equal(group.length, 4, "each classification offers TP/FP/TN/FN");
    assert.equal(new Set(group).size, 1, "options of one item share a radio group");
  });
  assert.equal(new Set(names.map((g) => g[0])).size, 4, "four distinct radio groups");
  assert.equal(new Set(articles.map((a) => a.attrs["data-workspace-id"])).size, 4);
  assert.equal(new Set(articles.map((a) => a.attrs["data-assessment-item-id"])).size, 4);

  assert.deepEqual(
    articles.map((a) => a.attrs["data-assessment-correct"]),
    ["TP", "FP", "FN", "TN"]
  );
  assert.deepEqual(
    articles.map((a) => a.legend),
    [
      "Person A: has the condition and receives a positive result.",
      "Person B: does not have the condition and receives a positive result.",
      "Person C: has the condition and receives a negative result.",
      "Person D: does not have the condition and receives a negative result."
    ]
  );
  const cluster = gam.activities[0].materials.find((m) => m.selection).selection;
  articles.forEach(function (a) {
    assert.equal(a.attrs["data-assessment-rationale"], cluster.feedback.replace(/&/g, "&amp;"));
  });
  assert.equal((result.html.match(/data-selection-cluster-intro=/g) || []).length, 1);
});

test("C2 capture: items are consumed from items[] and the top-level summary is not authoritative", () => {
  const gam = fixture("c2-gam.json");
  const selection = gam.activities[0].materials.find((m) => m.selection).selection;
  const cluster = normalizeSelection.resolveSelectionCluster(selection, { materialId: "A1-M3" });
  assert.equal(cluster.present, true);
  assert.equal(cluster.strict, false, "no contract_version → legacy items[] compatibility");
  assert.equal(cluster.ok, true, JSON.stringify(cluster.diagnostics));
  assert.deepEqual(
    cluster.items.map((e) => e.selection.source_item_id),
    ["person_a", "person_b", "person_c", "person_d"]
  );
  cluster.items.forEach(function (entry) {
    assert.equal(entry.selection.options.length, 4, "shared selection.options inherited");
    assert.equal(entry.selection.correct_answer, C2_EXPECTED[entry.selection.source_item_id]);
  });
  // The flattened-prompt heuristics must not run over an authored cluster.
  const rows = normalizeSelection.expandFlattenedSingleSelectSelection(selection);
  assert.equal(rows.length, 4);
});

test("C2 capture: independent response state and persistence per item", () => {
  const result = renderPage(assemblePage(fixture("c2-dla.json"), fixture("c2-gam.json")));
  const parsed = selectionArticles(result.html);
  const root = createStubNode("main");
  root.setAttribute("data-renderer", "vnext");
  const articles = parsed.map(function (p) {
    const article = stubArticleFrom(p);
    root.appendChild(article);
    return article;
  });
  const install = assessmentRuntime.installAssessmentRuntime(root);
  assert.equal(install.ok, true);

  const chosen = ["TP", "TN", "FN", "FP"];
  const drafts = articles.map(function (article, index) {
    const input = article.querySelector('input[data-assessment-option="' + chosen[index] + '"]');
    assert.ok(input, "option " + chosen[index] + " exists for item " + index);
    input.checked = true;
    const serialized = draftAdapters.serializeWorkspaceState(article);
    assert.equal(serialized.ok, true);
    assert.equal(serialized.state.value.selectedOption, chosen[index]);
    return serialized.state;
  });

  // Answering a later item left earlier items untouched.
  articles.forEach(function (article, index) {
    assert.equal(
      article.querySelector('input[type="radio"]:checked').getAttribute("data-assessment-option"),
      chosen[index]
    );
  });

  articles.forEach(function (article) {
    article.querySelectorAll('input[type="radio"]').forEach(function (input) {
      input.checked = false;
    });
  });
  articles.forEach(function (article, index) {
    assert.equal(draftAdapters.restoreWorkspaceState(article, drafts[index]).ok, true);
    assert.equal(
      article.querySelector('input[type="radio"]:checked').getAttribute("data-assessment-option"),
      chosen[index]
    );
  });
  install.dispose();
});

// ---------------------------------------------------------------------------
// C6 — six independent decisions
// ---------------------------------------------------------------------------

test("C6 capture: six independent decisions across two selection materials", () => {
  const result = renderPage(assemblePage(fixture("c6-dla.json"), fixture("c6-gam.json")));
  assert.equal(result.error, null, result.error);
  const articles = selectionArticles(result.html);
  assert.equal(articles.length, 6, "numerator, denominator and interpretation × positive/negative");

  const groupNames = articles.map((a) => a.inputs[0].name);
  assert.equal(new Set(groupNames).size, 6, "six distinct radio groups");
  articles.forEach(function (a) {
    assert.ok(a.inputs.length >= 2, "each decision has options");
    assert.equal(new Set(a.inputs.map((i) => i.name)).size, 1);
  });
  assert.equal(new Set(articles.map((a) => a.attrs["data-workspace-id"])).size, 6);
  assert.deepEqual(
    articles.map((a) => a.attrs["data-assessment-correct"]),
    [
      "positive_numerator_90",
      "positive_denominator_110",
      "positive_predictive",
      "negative_numerator_80",
      "negative_denominator_90",
      "negative_predictive"
    ]
  );
  assert.deepEqual(
    articles.map((a) => a.legend),
    [
      "1. Which number belongs in the numerator?",
      "2. Which number belongs in the denominator?",
      "3. What does the predictive proportion tell you?",
      "1. Which number belongs in the numerator?",
      "2. Which number belongs in the denominator?",
      "3. What does the predictive proportion tell you?"
    ]
  );
  assert.equal((result.html.match(/data-selection-cluster-intro=/g) || []).length, 2);
});

test("C6 capture: persistence is keyed per decision (two clusters, six states)", () => {
  const result = renderPage(assemblePage(fixture("c6-dla.json"), fixture("c6-gam.json")));
  const parsed = selectionArticles(result.html);
  const root = createStubNode("main");
  const articles = parsed.map(function (p) {
    const article = stubArticleFrom(p);
    root.appendChild(article);
    return article;
  });
  const install = assessmentRuntime.installAssessmentRuntime(root);
  assert.equal(install.ok, true);

  const picks = parsed.map(function (p) {
    return p.inputs[p.inputs.length - 1]["data-assessment-option"];
  });
  const drafts = articles.map(function (article, index) {
    article.querySelector('input[data-assessment-option="' + picks[index] + '"]').checked = true;
    const serialized = draftAdapters.serializeWorkspaceState(article);
    assert.equal(serialized.ok, true);
    return serialized.state;
  });
  articles.forEach(function (article) {
    article.querySelectorAll('input[type="radio"]').forEach(function (i) {
      i.checked = false;
    });
  });
  articles.forEach(function (article, index) {
    draftAdapters.restoreWorkspaceState(article, drafts[index]);
    assert.equal(
      article.querySelector('input[type="radio"]:checked').getAttribute("data-assessment-option"),
      picks[index]
    );
  });
  install.dispose();
});

// ---------------------------------------------------------------------------
// Identity
// ---------------------------------------------------------------------------

test("response identity is scoped by item_id, not by position", () => {
  const dla = fixture("c2-dla.json");
  const gam = fixture("c2-gam.json");
  const reordered = clone(gam);
  reordered.activities[0].materials.find((m) => m.selection).selection.items.reverse();

  const ids = (g) =>
    selectionArticles(renderPage(assemblePage(dla, g)).html).map((a) => a.attrs["data-workspace-id"]);
  const original = ids(gam);
  const swapped = ids(reordered);
  assert.deepEqual(swapped.slice().sort(), original.slice().sort());
  assert.equal(
    swapped[0],
    original[3],
    "an item keeps its identity when its position changes"
  );
});

// ---------------------------------------------------------------------------
// Strict v2 contract
// ---------------------------------------------------------------------------

function strictSelection(overrides) {
  return Object.assign(
    {
      contract_version: 2,
      form: "single_select",
      options: [
        { key: "A", text: "Alpha" },
        { key: "B", text: "Beta" }
      ],
      items: [
        { item_id: "one", prompt: "First?", correct_answer: "A" },
        { item_id: "two", prompt: "Second?", correct_answer: "B" }
      ]
    },
    overrides || {}
  );
}

function codes(selection) {
  return normalizeSelection
    .resolveSelectionCluster(selection, { materialId: "M" })
    .diagnostics.map((d) => d.code);
}

test("strict v2 cluster: valid shape resolves and inherits shared options", () => {
  const cluster = normalizeSelection.resolveSelectionCluster(strictSelection(), { materialId: "M" });
  assert.equal(cluster.strict, true);
  assert.equal(cluster.ok, true, JSON.stringify(cluster.diagnostics));
  assert.deepEqual(cluster.declaredIds, ["one", "two"]);
  cluster.items.forEach(function (entry) {
    assert.equal(entry.selection.options.length, 2);
  });
});

test("strict v2 cluster: closed schema rejects unknown keys at cluster and item level", () => {
  assert.ok(codes(strictSelection({ bogus: true })).includes("SELECTION_CLUSTER_UNKNOWN_KEY"));
  const itemKey = strictSelection();
  itemKey.items[0].bogus = 1;
  assert.ok(codes(itemKey).includes("SELECTION_CLUSTER_UNKNOWN_KEY"));
  // A cluster-level correct answer is never inherited and is not part of the v2 shape.
  assert.ok(codes(strictSelection({ correct_answer: "A" })).includes("SELECTION_CLUSTER_UNKNOWN_KEY"));
});

test("strict v2 cluster: item_id required, unique, options and correct answers independently valid", () => {
  const noId = strictSelection();
  delete noId.items[0].item_id;
  assert.ok(codes(noId).includes("SELECTION_ITEM_ID_MISSING"));

  const dup = strictSelection();
  dup.items[1].item_id = "one";
  assert.ok(codes(dup).includes("SELECTION_ITEM_ID_DUPLICATE"));

  const noOptions = strictSelection();
  delete noOptions.options;
  assert.equal(
    normalizeSelection.resolveSelectionCluster(noOptions, { materialId: "M" }).ok,
    false,
    "items without options and no shared options are invalid"
  );

  const badCorrect = strictSelection();
  badCorrect.items[0].correct_answer = "Z";
  assert.equal(
    normalizeSelection.resolveSelectionCluster(badCorrect, { materialId: "M" }).ok,
    false,
    "correct answer must be one of the item's own options"
  );

  const oneOption = strictSelection();
  oneOption.items[0].options = [{ key: "A", text: "Only" }];
  assert.equal(normalizeSelection.resolveSelectionCluster(oneOption, { materialId: "M" }).ok, false);
});

test("strict v2 cluster: items may carry their own options and forms", () => {
  const selection = strictSelection();
  selection.items[1] = {
    item_id: "two",
    form: "multi_select",
    prompt: "Pick all?",
    options: [
      { key: "X", text: "x" },
      { key: "Y", text: "y" },
      { key: "Z", text: "z" }
    ],
    correct_answers: ["X", "Z"]
  };
  const cluster = normalizeSelection.resolveSelectionCluster(selection, { materialId: "M" });
  assert.equal(cluster.ok, true, JSON.stringify(cluster.diagnostics));
  assert.equal(cluster.items[1].model.form, "multi_select");
});

// ---------------------------------------------------------------------------
// Legacy compatibility
// ---------------------------------------------------------------------------

test("legacy items accept id/key identifiers, tolerate extra keys, and need no DLA declaration", () => {
  const legacy = {
    form: "single_select",
    prompt: "Summary prompt that duplicates the items",
    options: [
      { key: "A", text: "Alpha" },
      { key: "B", text: "Beta" }
    ],
    correct_answer: "A",
    extra_legacy_field: "tolerated",
    items: [
      { id: "q1", prompt: "First?", correct_answer: "A", note: "ignored" },
      { key: "q2", prompt: "Second?", correct_answer: "B" }
    ]
  };
  const cluster = normalizeSelection.resolveSelectionCluster(legacy, { materialId: "M" });
  assert.equal(cluster.strict, false);
  assert.equal(cluster.ok, true, JSON.stringify(cluster.diagnostics));
  assert.deepEqual(cluster.declaredIds, ["q1", "q2"]);
  assert.deepEqual(
    cluster.items.map((e) => e.selection.correct_answer),
    ["A", "B"],
    "top-level correct_answer is not inherited by items"
  );

  const material = { material_id: "M", material_type: "selection", selection: legacy };
  assert.deepEqual(selectionContract.selectionMaterialDiagnostics(material, { material_id: "M" }), []);
  assert.deepEqual(
    selectionContract.selectionMaterialDiagnostics(material, {
      material_id: "M",
      response_fulfilment: { kind: "learner_workspace", response_kind: "selection_choose" }
    }),
    [],
    "a legacy row without declarations is never blocked"
  );
});

test("existing single-item selections and matching are unchanged", () => {
  const page = assemblePage(fixture("c2-dla.json"), fixture("c2-gam.json"));
  const activity = page.activities[0];
  activity.required_materials = [
    { material_id: "A1-M1", material_type: "selection", purpose: "Choose", specification: "Choose one." },
    { material_id: "A1-M2", material_type: "selection", purpose: "Pair", specification: "Match them." },
    { material_id: "A1-M3", material_type: "selection", purpose: "Pick", specification: "Pick all." }
  ];
  activity.materials = [
    {
      material_id: "A1-M1",
      material_type: "selection",
      title: "Single choice",
      body_format: "markdown",
      body: "Choose the best option.",
      selection: {
        form: "single_select",
        prompt: "Which?",
        options: [
          { key: "A", text: "Alpha" },
          { key: "B", text: "Beta" }
        ],
        correct_answer: "B"
      }
    },
    {
      material_id: "A1-M2",
      material_type: "selection",
      title: "Matching",
      body_format: "markdown",
      body: "Match each item.",
      selection: {
        form: "matching",
        prompt: "Match",
        left: [
          { key: "L1", text: "Left one" },
          { key: "L2", text: "Left two" }
        ],
        right: [
          { key: "R1", text: "Right one" },
          { key: "R2", text: "Right two" }
        ],
        pairs: [
          { left: "L1", right: "R1" },
          { left: "L2", right: "R2" }
        ]
      }
    },
    {
      material_id: "A1-M3",
      material_type: "selection",
      title: "Multi choice",
      body_format: "markdown",
      body: "Select all that apply.",
      selection: {
        form: "multi_select",
        prompt: "Pick all",
        options: [
          { key: "A", text: "Alpha" },
          { key: "B", text: "Beta" },
          { key: "C", text: "Gamma" }
        ],
        correct_answers: ["A", "C"]
      }
    }
  ];
  const result = renderPage(page);
  assert.equal(result.error, null, result.error);
  assert.doesNotMatch(result.html, /data-selection-cluster=/, "no cluster markup for single items");
  const articles = selectionArticles(result.html);
  const forms = articles.map((a) => a.attrs["data-assessment-form"]);
  assert.equal(articles.length >= 2, true, "single and multi selections render as selection workspaces");
  assert.ok(forms.some((f) => /single/.test(f)));
  assert.ok(forms.some((f) => /multi/.test(f)));
  const single = articles.find((a) => /single/.test(a.attrs["data-assessment-form"]));
  assert.equal(single.attrs["data-assessment-correct"], "B");
  assert.match(result.html, /data-assessment-form="matching"/);
});

// ---------------------------------------------------------------------------
// DLA declarations and GAM correspondence (explicit identity, no prose)
// ---------------------------------------------------------------------------

function selectionRow(extra) {
  return {
    material_id: "M1",
    material_type: "selection",
    response_fulfilment: Object.assign(
      {
        kind: "learner_workspace",
        response_kind: "selection_choose",
        binds_production_steps: [1],
        contract_version: 2,
        response_items: [
          { item_id: "one", form: "single_select" },
          { item_id: "two", form: "single_select" }
        ]
      },
      extra || {}
    )
  };
}

function dlaErrors(row) {
  const errors = [];
  selectionContract.validateDlaSelectionResponseFulfilment(row, "required_materials[0]", errors);
  return errors;
}

test("DLA declaration: well-formed declarations pass; legacy rows without declarations are not blocked", () => {
  assert.deepEqual(dlaErrors(selectionRow()), []);
  const legacy = selectionRow();
  delete legacy.response_fulfilment.contract_version;
  delete legacy.response_fulfilment.response_items;
  assert.deepEqual(dlaErrors(legacy), []);
  assert.deepEqual(
    dlaErrors(dlaRowFor(fixture("c2-dla.json"), "A1-M3")),
    [],
    "the real C2 DLA capture (no declarations) stays valid"
  );
  assert.deepEqual(dlaErrors(dlaRowFor(fixture("c6-dla.json"), "A1-M2")), []);
});

test("DLA declaration: malformed declarations are rejected", () => {
  assert.ok(
    dlaErrors(selectionRow({ contract_version: 1 })).some((e) => /contract_version/.test(e))
  );
  assert.ok(
    dlaErrors(selectionRow({ response_items: [] })).some((e) => /response_items/.test(e))
  );
  assert.ok(
    dlaErrors(
      selectionRow({
        response_items: [
          { item_id: "one", form: "single_select" },
          { item_id: "one", form: "single_select" }
        ]
      })
    ).some((e) => /duplicates/.test(e))
  );
  assert.ok(
    dlaErrors(selectionRow({ response_items: [{ item_id: "one", form: "dropdown" }] })).some((e) =>
      /form must be/.test(e)
    )
  );
  assert.ok(
    dlaErrors(selectionRow({ response_items: [{ item_id: "bad id!", form: "single_select" }] })).some((e) =>
      /item_id/.test(e)
    )
  );
  const wrongKind = selectionRow({ response_kind: "free_text" });
  assert.ok(dlaErrors(wrongKind).some((e) => /only valid for response_kind selection_choose/.test(e)));
});

test("GAM correspondence: declared item ids must equal authored item ids (identity, not prose)", () => {
  const row = selectionRow();
  const good = { material_id: "M1", selection: strictSelection() };
  assert.deepEqual(selectionContract.validateSelectionClusterCorrespondence(row, good), []);

  const missing = { material_id: "M1", selection: strictSelection() };
  missing.selection.items.pop();
  assert.ok(
    selectionContract
      .validateSelectionClusterCorrespondence(row, missing)
      .some((d) => d.code === "SELECTION_RESPONSE_ITEM_MISSING" && d.itemId === "two")
  );

  const extra = { material_id: "M1", selection: strictSelection() };
  extra.selection.items.push({ item_id: "three", prompt: "Third?", correct_answer: "A" });
  assert.ok(
    selectionContract
      .validateSelectionClusterCorrespondence(row, extra)
      .some((d) => d.code === "SELECTION_RESPONSE_ITEM_UNDECLARED" && d.itemId === "three")
  );

  const wrongForm = { material_id: "M1", selection: strictSelection() };
  wrongForm.selection.items[0] = {
    item_id: "one",
    form: "multi_select",
    prompt: "First?",
    correct_answers: ["A"]
  };
  assert.ok(
    selectionContract
      .validateSelectionClusterCorrespondence(row, wrongForm)
      .some((d) => d.code === "SELECTION_RESPONSE_ITEM_FORM_MISMATCH")
  );

  const collapsed = {
    material_id: "M1",
    selection: { form: "single_select", prompt: "One control", options: strictSelection().options }
  };
  assert.ok(
    selectionContract
      .validateSelectionClusterCorrespondence(row, collapsed)
      .some((d) => d.code === "SELECTION_CLUSTER_CONTRACT_REQUIRED"),
    "a declared cluster cannot be realised as a single legacy control"
  );
});

test("GAM page validation uses the DLA declaration only when one exists", () => {
  const dla = fixture("c2-dla.json");
  const gam = fixture("c2-gam.json");

  const legacyPage = assemblePage(dla, gam);
  assert.equal(selectionContract.validatePageSelectionMaterials(legacyPage).ok, true);

  const declared = assemblePage(dla, gam);
  const material = declared.activities[0].materials.find((m) => m.selection);
  material.selection = toStrictCluster(material.selection);
  declareV2(declared, "A1-M3", [
    { item_id: "person_a", form: "single_select" },
    { item_id: "person_b", form: "single_select" },
    { item_id: "person_c", form: "single_select" },
    { item_id: "person_d", form: "single_select" }
  ]);
  const ok = selectionContract.validatePageSelectionMaterials(declared);
  assert.equal(ok.ok, true, JSON.stringify(ok.errors));
  const rendered = renderPage(declared);
  assert.equal(rendered.error, null, rendered.error);
  assert.equal(selectionArticles(rendered.html).length, 4);

  const missing = clone(declared);
  missing.activities[0].materials.find((m) => m.selection).selection.items.pop();
  const bad = selectionContract.validatePageSelectionMaterials(missing);
  assert.equal(bad.ok, false);
  assert.match(bad.errors.join("\n"), /SELECTION_RESPONSE_ITEM_MISSING/);
});

// ---------------------------------------------------------------------------
// Publication gate
// ---------------------------------------------------------------------------

test("publication is blocked when a declared item is missing from realised response parts", () => {
  const page = assemblePage(fixture("c2-dla.json"), fixture("c2-gam.json"));
  const material = page.activities[0].materials.find((m) => m.selection);
  material.selection = toStrictCluster(material.selection);
  declareV2(page, "A1-M3", [
    { item_id: "person_a", form: "single_select" },
    { item_id: "person_b", form: "single_select" },
    { item_id: "person_c", form: "single_select" },
    { item_id: "person_d", form: "single_select" },
    { item_id: "person_e", form: "single_select" }
  ]);

  const model = buildPageModel(page);
  assert.equal(model.ok, false);
  const gate = model.errors.filter((e) => e && e.code === "SELECTION_ITEM_NOT_REALISED");
  assert.equal(gate.length, 1, JSON.stringify(model.errors.map((e) => e && e.code)));
  assert.equal(gate[0].itemId, "person_e");

  const published = renderPage(page);
  assert.ok(published.error, "renderLearnerPageHtml fails closed");
  assert.equal(published.html == null || published.html === "", true);
});

test("legacy captures with authored items are published without declarations", () => {
  [
    ["c2-dla.json", "c2-gam.json", 4],
    ["c6-dla.json", "c6-gam.json", 6]
  ].forEach(function (pair) {
    const page = assemblePage(fixture(pair[0]), fixture(pair[1]));
    const model = buildPageModel(page);
    const gate = (model.errors || []).filter((e) => e && e.code === "SELECTION_ITEM_NOT_REALISED");
    assert.deepEqual(gate, [], pair[0]);
    assert.equal(model.ok, true, JSON.stringify(model.errors));
    assert.equal(selectionArticles(renderPage(page).html).length, pair[2]);
  });
});

test("renderer bundle exposes the cluster-aware contract to the browser", () => {
  const bundle = fs.readFileSync(path.join(__dirname, "..", "lib", "learner-renderer-vnext-browser.js"), "utf8");
  assert.match(bundle, /resolveSelectionCluster/);
  assert.match(bundle, /validateDlaSelectionResponseFulfilment/);
  assert.match(bundle, /SELECTION_ITEM_NOT_REALISED/);
});
