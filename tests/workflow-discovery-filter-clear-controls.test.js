/**
 * My Workflows — contextual Search / Tag filter clear controls.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

function boot() {
  return loadPrismAppJsTestApi({
    extraLibs: ["lib/workflow-list-presentation.js"]
  });
}

function trackHiddenAttribute(el) {
  const attrs = Object.create(null);
  el.setAttribute = function (name, value) {
    attrs[String(name)] = String(value);
  };
  el.removeAttribute = function (name) {
    delete attrs[String(name)];
  };
  el.hasAttribute = function (name) {
    return Object.prototype.hasOwnProperty.call(attrs, String(name));
  };
  el.getAttribute = function (name) {
    return el.hasAttribute(name) ? attrs[String(name)] : null;
  };
  el.setAttribute("hidden", "hidden");
  return el;
}

function sampleWorkflows() {
  return [
    {
      id: "wf-alpha",
      name: "Alpha Lemon Course",
      goal: "Teach citrus",
      tags: ["fruit", "citrus"],
      steps: [{ id: "s1", title: "Intro" }],
      updatedAt: 3,
      createdAt: 1
    },
    {
      id: "wf-beta",
      name: "Beta Workshop",
      goal: "Practice facilitation",
      tags: ["facilitation"],
      steps: [{ id: "s1", title: "Warm-up" }, { id: "s2", title: "Practice" }],
      updatedAt: 2,
      createdAt: 2
    }
  ];
}

test("clear buttons stay hidden until their field has text", () => {
  const { api, window } = boot();
  const document = window.document;
  const search = document.getElementById("workflowListSearch");
  const searchClear = trackHiddenAttribute(document.getElementById("workflowListSearchClear"));
  const tag = document.getElementById("workflowTagFilter");
  const tagClear = trackHiddenAttribute(document.getElementById("workflowTagFilterClear"));

  search.value = "";
  tag.value = "";
  api.syncWorkflowFilterClearButtonForTest(search, searchClear);
  api.syncWorkflowFilterClearButtonForTest(tag, tagClear);
  assert.equal(searchClear.hasAttribute("hidden"), true);
  assert.equal(tagClear.hasAttribute("hidden"), true);

  search.value = "lemon";
  api.syncWorkflowFilterClearButtonForTest(search, searchClear);
  assert.equal(searchClear.hasAttribute("hidden"), false);
  assert.equal(tagClear.hasAttribute("hidden"), true);

  tag.value = "fruit";
  api.syncWorkflowFilterClearButtonForTest(tag, tagClear);
  assert.equal(searchClear.hasAttribute("hidden"), false);
  assert.equal(tagClear.hasAttribute("hidden"), false);
});

test("search clear control clears only search and refreshes active filters", () => {
  const { api, window } = boot();
  const document = window.document;
  const search = document.getElementById("workflowListSearch");
  const searchClear = trackHiddenAttribute(document.getElementById("workflowListSearchClear"));
  const tag = document.getElementById("workflowTagFilter");
  const tagClear = trackHiddenAttribute(document.getElementById("workflowTagFilterClear"));
  const sort = document.getElementById("workflowSortSelect");

  api.setWorkflowsForTest(sampleWorkflows());
  search.value = "lemon";
  tag.value = "fruit";
  sort.value = "nameAsc";
  api.syncWorkflowFilterClearButtonForTest(search, searchClear);
  api.syncWorkflowFilterClearButtonForTest(tag, tagClear);

  const before = api.getActiveWorkflowListFiltersForTest();
  assert.equal(before.query, "lemon");
  assert.equal(Array.from(before.tag).join(","), "fruit");
  assert.equal(before.sort, "nameAsc");
  assert.equal(
    api.applyWorkflowListFilters(sampleWorkflows(), before).map((w) => w.id).join(","),
    "wf-alpha"
  );

  api.clearWorkflowDiscoveryFilterFieldForTest(search, searchClear);

  assert.equal(search.value, "");
  assert.equal(tag.value, "fruit");
  assert.equal(sort.value, "nameAsc");
  assert.equal(searchClear.hasAttribute("hidden"), true);
  assert.equal(tagClear.hasAttribute("hidden"), false);

  const after = api.getActiveWorkflowListFiltersForTest();
  assert.equal(after.query, "");
  assert.equal(Array.from(after.tag).join(","), "fruit");
  assert.equal(after.sort, "nameAsc");
  assert.equal(
    api.applyWorkflowListFilters(sampleWorkflows(), after).map((w) => w.id).join(","),
    "wf-alpha"
  );
});

test("tag clear control clears only tag filter and refreshes active filters", () => {
  const { api, window } = boot();
  const document = window.document;
  const search = document.getElementById("workflowListSearch");
  const searchClear = trackHiddenAttribute(document.getElementById("workflowListSearchClear"));
  const tag = document.getElementById("workflowTagFilter");
  const tagClear = trackHiddenAttribute(document.getElementById("workflowTagFilterClear"));
  const sort = document.getElementById("workflowSortSelect");

  api.setWorkflowsForTest(sampleWorkflows());
  search.value = "workshop";
  tag.value = "facilitation";
  sort.value = "updatedDesc";
  api.syncWorkflowFilterClearButtonForTest(search, searchClear);
  api.syncWorkflowFilterClearButtonForTest(tag, tagClear);

  api.clearWorkflowDiscoveryFilterFieldForTest(tag, tagClear);

  assert.equal(tag.value, "");
  assert.equal(search.value, "workshop");
  assert.equal(sort.value, "updatedDesc");
  assert.equal(tagClear.hasAttribute("hidden"), true);
  assert.equal(searchClear.hasAttribute("hidden"), false);

  const after = api.getActiveWorkflowListFiltersForTest();
  assert.equal(after.query, "workshop");
  assert.equal(Array.from(after.tag).join(","), "");
  assert.equal(after.sort, "updatedDesc");
  assert.equal(
    api.applyWorkflowListFilters(sampleWorkflows(), after).map((w) => w.id).join(","),
    "wf-beta"
  );
});
