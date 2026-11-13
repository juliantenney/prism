/**
 * Unified Learning Journey: resource-local IDs must be unique across the
 * assembled document, with fragment/ARIA/label references rewritten in lockstep.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const unifiedShell = require("../lib/learning-journey-unified-shell.js");
const ljDesign = require("../lib/learning-journey-design-page.js");

function overlappingResourceFragment(title) {
  return [
    '<main class="util-learner-page" data-renderer="vnext" data-persistence-page-key="page-' +
      title.replace(/\s+/g, "-").toLowerCase() +
      '">',
    '<header class="util-page-header util-learning-header"><h1>' + title + "</h1></header>",
    '<section id="journey-orient" data-journey-section="true"><h2>Orientation</h2>',
    "<p>Shared orientation copy.</p></section>",
    '<section id="activity-A1" data-journey-section="true">',
    '<h2 id="learner-task-a1-heading">Task</h2>',
    '<label for="learner-task-a1">Response</label>',
    '<textarea id="learner-task-a1" data-workspace-id="ws-a1"></textarea>',
    '<a href="#learner-check-a1">Review</a>',
    "</section>",
    '<section id="learner-check-a1" data-journey-section="true">',
    '<h2 id="learner-check-a1-heading">Check</h2>',
    '<button type="button" aria-controls="util-journey-all-panel">All sections</button>',
    '<div id="util-journey-all-panel" class="util-journey-all-panel">',
    '<a class="util-journey-all-link" href="#journey-orient">Orientation</a>',
    '<a class="util-journey-all-link" href="#activity-A1">Activity</a>',
    "</div>",
    "</section>",
    "</main>"
  ].join("");
}

function collectIds(html) {
  const ids = [];
  // Match only the id attribute — not data-*-id endings.
  const re = /(?:^|\s)id\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html))) ids.push(m[1]);
  return ids;
}

function collectRefs(html) {
  const refs = [];
  function push(kind, value) {
    String(value || "")
      .split(/\s+/)
      .filter(Boolean)
      .forEach(function (token) {
        refs.push({ kind: kind, id: token });
      });
  }
  html.replace(/\bfor\s*=\s*["']([^"']+)["']/gi, function (_m, v) {
    push("for", v);
    return _m;
  });
  html.replace(/\bhref\s*=\s*["']#([^"']+)["']/gi, function (_m, v) {
    push("href", v);
    return _m;
  });
  [
    "aria-controls",
    "aria-labelledby",
    "aria-describedby",
    "aria-owns",
    "aria-activedescendant",
    "headers"
  ].forEach(function (attr) {
    const re = new RegExp("\\b" + attr + "\\s*=\\s*[\"']([^\"']+)[\"']", "gi");
    html.replace(re, function (_m, v) {
      push(attr, v);
      return _m;
    });
  });
  ["data-math-label-id", "data-math-field-id"].forEach(function (attr) {
    const re = new RegExp("\\b" + attr + "\\s*=\\s*[\"']([^\"']+)[\"']", "gi");
    html.replace(re, function (_m, v) {
      push(attr, v);
      return _m;
    });
  });
  return refs;
}

test("stripPublishedProductionChromeLabels removes Format/Representations chrome", () => {
  const html = [
    "<article>",
    "<h3>The same rectangle, two multiplier values</h3>",
    "<div><p><strong>Format</strong></p><p>A two-column mathematical comparison identifying quantities.</p></div>",
    "<section><h4>Representations</h4>",
    "<dl><div><dt>Constraint function</dt><dd>g(x,y)=x+y</dd></div></dl>",
    "</section>",
    "<div><p><strong>Interpretive statement</strong></p>",
    "<p>The numerical value of lambda depends on the representation.</p></div>",
    "</article>"
  ].join("");
  const out = unifiedShell.stripPublishedProductionChromeLabels(html);
  assert.doesNotMatch(out, /<strong>\s*Format\s*<\/strong>/i);
  assert.doesNotMatch(out, /two-column mathematical comparison identifying quantities/i);
  assert.doesNotMatch(out, /<h4>\s*Representations\s*<\/h4>/i);
  assert.doesNotMatch(out, /Interpretive statement/i);
  assert.match(out, /Constraint function/);
  assert.match(out, /g\(x,y\)=x\+y/);
  assert.match(out, /numerical value of lambda depends on the representation/);
});

test("namespaceResourceIds rewrites ids and matching references", () => {
  const html = [
    '<section id="journey-orient">Orient</section>',
    '<label for="learner-task-a1">Task</label>',
    '<textarea id="learner-task-a1"></textarea>',
    '<a href="#journey-orient">Orient</a>',
    '<button aria-controls="util-journey-all-panel">All</button>',
    '<div id="util-journey-all-panel" class="util-journey-all-panel"></div>',
    '<div data-math-label-id="math-label-1" data-math-field-id="math-field-1">',
    '<label id="math-label-1" for="math-field-1">Math</label>',
    '<textarea id="math-field-1"></textarea>',
    "</div>"
  ].join("");

  const out = unifiedShell.namespaceResourceIds(html, "c1");
  const prefix = unifiedShell.resourceIdNamespacePrefix("c1");
  assert.equal(prefix, "lj-c1--");
  assert.match(out, new RegExp('id="' + prefix + 'journey-orient"'));
  assert.match(out, new RegExp('href="#' + prefix + 'journey-orient"'));
  assert.match(out, new RegExp('for="' + prefix + 'learner-task-a1"'));
  assert.match(out, new RegExp('id="' + prefix + 'learner-task-a1"'));
  assert.match(out, new RegExp('aria-controls="' + prefix + 'util-journey-all-panel"'));
  assert.match(out, new RegExp('data-math-label-id="' + prefix + 'math-label-1"'));
  assert.match(out, new RegExp('data-math-field-id="' + prefix + 'math-field-1"'));
  assert.equal(out.includes('id="journey-orient"'), false);
  assert.equal(out.includes('href="#journey-orient"'), false);

  // Idempotent for already-namespaced fragments.
  assert.equal(unifiedShell.namespaceResourceIds(out, "c1"), out);
});

test("prepareUnifiedShellResources namespaces overlapping resource ids", () => {
  const prepared = unifiedShell.prepareUnifiedShellResources(
    [
      {
        commissionId: "c1",
        title: "First resource",
        productId: "interactive",
        fragmentHtml: overlappingResourceFragment("First resource")
      },
      {
        commissionId: "c2",
        title: "Second resource",
        productId: "interactive",
        fragmentHtml: overlappingResourceFragment("Second resource")
      }
    ],
    {}
  );
  assert.equal(prepared.ok, true, JSON.stringify(prepared.warnings || []));
  assert.equal(prepared.resources.length, 2);

  const prefix1 = unifiedShell.resourceIdNamespacePrefix("c1");
  const prefix2 = unifiedShell.resourceIdNamespacePrefix("c2");
  assert.match(prepared.resources[0].html, new RegExp('id="' + prefix1 + 'journey-orient"'));
  assert.match(prepared.resources[1].html, new RegExp('id="' + prefix2 + 'journey-orient"'));
  assert.match(
    prepared.resources[0].html,
    /data-workspace-id="ws-a1"/,
    "workspace contract attributes must stay unprefixed"
  );

  const ids1 = new Set(collectIds(prepared.resources[0].html));
  const ids2 = new Set(collectIds(prepared.resources[1].html));
  const overlap = [...ids1].filter((id) => ids2.has(id));
  assert.deepEqual(overlap, [], "prepared resources must not share ids: " + overlap.join(", "));

  prepared.resources.forEach(function (row) {
    const idSet = new Set(collectIds(row.html));
    collectRefs(row.html).forEach(function (ref) {
      assert.ok(
        idSet.has(ref.id),
        row.commissionId + " missing target for " + ref.kind + "=" + ref.id
      );
    });
  });
});

test("assembled unified shell keeps unique ids across resource templates", () => {
  const journey = ljDesign.buildLearningJourneyDesignPageFixture({
    title: "ID namespace journey",
    introExposition: "Two overlapping interactive resources.",
    sections: [
      {
        section_id: "journey_intro",
        title: "About this journey",
        order: 1,
        exposition: "Two overlapping interactive resources."
      },
      {
        section_id: "exp_1",
        title: "First resource",
        order: 2,
        exposition: "First stop."
      },
      {
        section_id: "exp_2",
        title: "Second resource",
        order: 3,
        exposition: "Second stop."
      }
    ],
    commissions: [
      {
        commission_id: "c1",
        section_id: "exp_1",
        order: 1,
        title: "First resource",
        product_id: "interactive",
        status: "supported",
        specification_text: "Interactive A"
      },
      {
        commission_id: "c2",
        section_id: "exp_2",
        order: 2,
        title: "Second resource",
        product_id: "interactive",
        status: "supported",
        specification_text: "Interactive B"
      }
    ]
  });
  assert.equal(journey.ok, true, (journey.errors || []).join("; "));

  const prepared = unifiedShell.prepareUnifiedShellResources(
    [
      {
        commissionId: "c1",
        title: "First resource",
        productId: "interactive",
        fragmentHtml: overlappingResourceFragment("First resource")
      },
      {
        commissionId: "c2",
        title: "Second resource",
        productId: "interactive",
        fragmentHtml: overlappingResourceFragment("Second resource")
      }
    ],
    {}
  );
  assert.equal(prepared.ok, true, JSON.stringify(prepared.warnings || []));
  const shell = unifiedShell.buildLearningJourneyUnifiedShellHtml(
    journey.page,
    prepared.resources
  );
  assert.equal(shell.ok, true, shell.code);

  const templateRe = /<template id="lj-resource-([^"]+)">([\s\S]*?)<\/template>/gi;
  const byTemplate = {};
  let m;
  while ((m = templateRe.exec(shell.html))) {
    byTemplate[m[1]] = m[2];
  }
  assert.ok(byTemplate.c1);
  assert.ok(byTemplate.c2);

  const seen = Object.create(null);
  const collisions = [];
  Object.keys(byTemplate).forEach(function (cid) {
    if (cid === "overview" || cid === "journal") return;
    collectIds(byTemplate[cid]).forEach(function (id) {
      if (seen[id] && seen[id] !== cid) {
        collisions.push(id + " in " + seen[id] + " and " + cid);
      } else {
        seen[id] = cid;
      }
    });
  });
  assert.deepEqual(collisions, [], collisions.join("; "));

  ["c1", "c2"].forEach(function (cid) {
    const idSet = new Set(collectIds(byTemplate[cid]));
    collectRefs(byTemplate[cid]).forEach(function (ref) {
      assert.ok(
        idSet.has(ref.id),
        cid + " broken " + ref.kind + " reference to " + ref.id
      );
    });
  });
});
