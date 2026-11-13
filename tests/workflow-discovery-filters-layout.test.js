/**
 * My Workflows discovery filters — responsive column containment + contextual clears.
 * Search/Tag filter must shrink within the list column and wrap when narrow.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const styleCss = fs.readFileSync(path.join(repoRoot, "style.css"), "utf8");
const indexHtml = fs.readFileSync(path.join(repoRoot, "index.html"), "utf8");

function discoveryFiltersMarkup() {
  const start = indexHtml.indexOf('class="library-filters workflow-discovery-filters"');
  assert.ok(start > 0, "workflow discovery filters markup exists");
  const end = indexHtml.indexOf("workflow-hidden-selection-hint", start);
  assert.ok(end > start, "discovery filters section bounded");
  return indexHtml.slice(start, end);
}

test("My Workflows Search and Tag filter sit in the list-stack discovery row", () => {
  const markup = discoveryFiltersMarkup();
  assert.match(markup, /id="workflowListSearch"/);
  assert.match(markup, /id="workflowTagFilter"/);
  assert.match(markup, /class="form-row compact"/);
  assert.match(markup, /for="workflowTagFilter">Tag filter</);
});

test("Search and Tag filter use contextual clear controls; Sort by stays alone", () => {
  const markup = discoveryFiltersMarkup();
  assert.match(markup, /class="workflow-filter-input-wrap"/);
  assert.match(
    markup,
    /id="workflowListSearchClear"[^>]*class="workflow-filter-clear-btn"[^>]*aria-label="Clear search"[^>]*hidden/s
  );
  assert.match(
    markup,
    /id="workflowTagFilterClear"[^>]*class="workflow-filter-clear-btn"[^>]*aria-label="Clear tag filter"[^>]*hidden/s
  );
  assert.match(markup, /type="button"[\s\S]*id="workflowListSearchClear"|id="workflowListSearchClear"[\s\S]*type="button"/);
  assert.doesNotMatch(markup, /id="workflowClearFiltersBtn"/);
  assert.doesNotMatch(markup, /Clear filters/);
  assert.match(markup, /class="form-row compact workflow-sort-row"/);
  const sortRowStart = markup.indexOf("workflow-sort-row");
  const sortRow = markup.slice(sortRowStart, markup.indexOf("</div>", markup.indexOf("workflowSortSelect", sortRowStart)) + 6);
  assert.match(sortRow, /id="workflowSortSelect"/);
  assert.doesNotMatch(sortRow, /workflow-filter-clear-btn|Clear filters/);
  assert.match(
    styleCss,
    /\.workflow-sort-row\s+\.form-group\.small\s*\{[^}]*max-width:\s*100%/s
  );
  assert.match(
    styleCss,
    /\.workflow-list-stack\s+\.library-filters\s*\{[^}]*margin-bottom:\s*0/s
  );
  assert.match(
    styleCss,
    /\.workflow-filter-input-wrap\s+input\[type="(?:search|text)"\][^}]*padding-right:\s*2rem/s
  );
  assert.match(
    styleCss,
    /\.workflow-filter-clear-btn:focus-visible\s*\{[^}]*outline:\s*2px\s+solid/s
  );
  assert.match(
    styleCss,
    /\.workflow-filter-clear-btn\[hidden\]\s*\{[^}]*display:\s*none\s*!important/s
  );
});

test("list stack and discovery filters constrain width so Tag filter cannot overflow", () => {
  assert.match(
    styleCss,
    /\.workflow-list-stack\s*\{[^}]*min-width:\s*0;[^}]*max-width:\s*100%/s
  );
  assert.match(
    styleCss,
    /\.workflow-list-stack\s+\.library-filters\s*\{[^}]*min-width:\s*0;[^}]*max-width:\s*100%/s
  );
  assert.match(
    styleCss,
    /\.workflow-discovery-filters\s+\.form-row\s*\{[^}]*flex-wrap:\s*wrap;[^}]*min-width:\s*0;[^}]*max-width:\s*100%/s
  );
  assert.match(
    styleCss,
    /\.workflow-discovery-filters\s+\.form-group(?:\s*,\s*\.workflow-discovery-filters\s+\.form-group\.small)?\s*\{[^}]*min-width:\s*0;[^}]*max-width:\s*100%/s
  );
  assert.match(
    styleCss,
    /\.workflow-discovery-filters\s+input\[type="text"\][^}]*min-width:\s*0;[^}]*max-width:\s*100%/s
  );
  assert.doesNotMatch(
    styleCss,
    /\.workflow-discovery-filters[^}]*\{[^}]*width:\s*\d+px/s
  );
});

test("narrow viewports stack discovery filter controls", () => {
  const mediaStart = styleCss.indexOf("@media (max-width: 900px)");
  assert.ok(mediaStart > 0, "900px responsive breakpoint exists");
  const mediaEnd = styleCss.indexOf("@media (max-width: 640px)", mediaStart);
  const narrow = styleCss.slice(mediaStart, mediaEnd > mediaStart ? mediaEnd : mediaStart + 2500);
  assert.match(narrow, /\.workflow-discovery-filters\s+\.form-row/);
  assert.match(narrow, /flex-direction:\s*column/);
  assert.match(narrow, /\.workflow-discovery-filters\s+\.form-group\.small/);
  assert.match(narrow, /\.workflow-sort-row\s+\.form-group\.small/);
});
