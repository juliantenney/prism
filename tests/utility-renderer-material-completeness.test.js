/**
 * Sprint 62 — learner materials[] completeness, containment, and ordering.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const rnaFixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "rna-hcv-assembled-vnext-materials-page.json"
);

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: { add() {}, remove() {}, contains() { return false; }, toggle() { return false; } },
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
    click() {}
  };
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
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
    URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS.concat(["lib/page-render-normalize.js"]));
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return { api, normalize: sandbox.PRISM_PAGE_RENDER_NORMALIZE };
}

function renderPage(api, page, options) {
  const r = api.buildUtilityStructuredHtmlForTest(page, ["sections"], options || { applyCompositionValidation: false });
  assert.ok(r && !r.error, r && r.error);
  return String(r.html || "");
}

function loadRnaFixture() {
  return JSON.parse(fs.readFileSync(rnaFixturePath, "utf8"));
}

function activityRowsFromPage(page) {
  if (Array.isArray(page.activities) && page.activities.length) return page.activities;
  const sec = (page.sections || []).find((s) => String(s.section_id || "").toLowerCase() === "learning_activities");
  return Array.isArray(sec && sec.content) ? sec.content : [];
}

function extractActivityHtml(html, row, allRows) {
  const activityId = row.activity_id;
  const title = String(row.title || "").trim();
  const idx = allRows.findIndex((entry) => entry.activity_id === activityId);
  assert.ok(idx !== -1, "unknown activity id " + activityId);
  const patterns = [];
  if (title) {
    patterns.push(new RegExp("<h3[^>]*>\\s*" + escapeRegExp(activityId) + "\\s+[—\\-]\\s+" + escapeRegExp(title), "i"));
    patterns.push(new RegExp("<h3[^>]*>\\s*" + escapeRegExp(title), "i"));
  } else {
    patterns.push(new RegExp("<h3[^>]*>\\s*" + escapeRegExp(activityId), "i"));
  }
  let start = -1;
  for (const pattern of patterns) {
    const hit = html.match(pattern);
    if (hit && hit.index != null) {
      start = hit.index;
      break;
    }
  }
  assert.ok(start !== -1, "activity heading not found for " + activityId);
  let end = html.length;
  const nextRow = allRows[idx + 1];
  if (nextRow) {
    const nextPatterns = [];
    const nextTitle = String(nextRow.title || "").trim();
    if (nextTitle) {
      nextPatterns.push(
        new RegExp("<h3[^>]*>\\s*" + escapeRegExp(nextRow.activity_id) + "\\s+[—\\-]\\s+" + escapeRegExp(nextTitle), "i")
      );
      nextPatterns.push(new RegExp("<h3[^>]*>\\s*" + escapeRegExp(nextTitle), "i"));
    } else {
      nextPatterns.push(new RegExp("<h3[^>]*>\\s*" + escapeRegExp(nextRow.activity_id), "i"));
    }
    for (const pattern of nextPatterns) {
      const hit = html.slice(start + 1).match(pattern);
      if (hit && hit.index != null) {
        end = start + 1 + hit.index;
        break;
      }
    }
  }
  return html.slice(start, end);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function countOccurrences(haystack, needle) {
  if (!needle) return 0;
  let count = 0;
  let pos = 0;
  while (true) {
    const hit = haystack.indexOf(needle, pos);
    if (hit === -1) break;
    count += 1;
    pos = hit + needle.length;
  }
  return count;
}

function bodyBeforeMeta(html) {
  return String(html || "").split('<details class="util-meta"')[0];
}

function countSectionHeading(html, label) {
  const escaped = escapeRegExp(String(label || "").trim());
  if (!escaped) return 0;
  const re = new RegExp("<h2[^>]*>[\\s\\S]*?" + escaped + "[\\s\\S]*?<\\/h2>", "gi");
  const matches = html.match(re);
  return matches ? matches.length : 0;
}

function materialMarker(material) {
  return "S62-RNA-" + String(material.material_id || "");
}

function materialBodyMarker(material) {
  return "S62-RNA-" + String(material.material_id || "") + "-BODY";
}

function isTableMaterial(material) {
  return /_table$/.test(String(material.material_type || ""));
}

function isChecklistMaterial(material) {
  return String(material.material_type || "").toLowerCase() === "checklist";
}

function checklistCriterionMarker(material) {
  return "S62-RNA-" + String(material.material_id || "") + "-C1";
}

function tableRowMarker(material) {
  return "S62-RNA-" + String(material.material_id || "") + "-ROW";
}

test("RNA vNext fixture: every materials[] item renders once inside owning activity", () => {
  const { api } = loadPrismTestApi();
  const page = loadRnaFixture();
  const html = renderPage(api, page);
  const rows = activityRowsFromPage(page);
  const activityIds = rows.map((row) => row.activity_id);

  rows.forEach((row) => {
    const activityHtml = extractActivityHtml(html, row, rows);
    const materials = Array.isArray(row.materials) ? row.materials : [];
    materials.forEach((material) => {
      const marker = materialBodyMarker(material);
      const titleMarker = materialMarker(material);
      const primaryMarker = isChecklistMaterial(material)
        ? checklistCriterionMarker(material)
        : isTableMaterial(material)
          ? tableRowMarker(material)
          : marker;
      const inActivity =
        activityHtml.includes(primaryMarker) ||
        activityHtml.includes(titleMarker) ||
        activityHtml.includes(marker);
      assert.ok(inActivity, material.material_id + " missing from activity " + row.activity_id);
      assert.equal(
        countOccurrences(html, primaryMarker),
        1,
        material.material_id + " should appear once in rendered output"
      );
      const outsideActivity = html.replace(activityHtml, "");
      assert.ok(
        !outsideActivity.includes(primaryMarker),
        material.material_id + " leaked outside activity " + row.activity_id
      );
    });
  });
});

test("RNA vNext fixture: all table materials produce semantic HTML tables", () => {
  const { api } = loadPrismTestApi();
  const page = loadRnaFixture();
  const html = renderPage(api, page);
  const rows = activityRowsFromPage(page);
  const activityIds = rows.map((row) => row.activity_id);
  const tableMaterials = rows.flatMap((row) =>
    (Array.isArray(row.materials) ? row.materials : []).filter(isTableMaterial).map((material) => ({
      activity_id: row.activity_id,
      material
    }))
  );
  assert.equal(tableMaterials.length, 6);
  tableMaterials.forEach(({ activity_id, material }) => {
    const row = rows.find((entry) => entry.activity_id === activity_id);
    const activityHtml = extractActivityHtml(html, row, rows);
    const rowMarker = tableRowMarker(material);
    assert.match(activityHtml, /<table[\s>]/i, material.material_id + " should render a table");
    assert.ok(activityHtml.includes(rowMarker), material.material_id + " table row marker missing");
  });
});

test("RNA vNext fixture: checklist materials render visible checklist or list markup", () => {
  const { api } = loadPrismTestApi();
  const page = loadRnaFixture();
  const html = renderPage(api, page);
  const rows = activityRowsFromPage(page);
  const activityIds = rows.map((row) => row.activity_id);
  const checklistMaterials = rows.flatMap((row) =>
    (Array.isArray(row.materials) ? row.materials : [])
      .filter(isChecklistMaterial)
      .map((material) => ({ activity_id: row.activity_id, material }))
  );
  assert.equal(checklistMaterials.length, 6);
  checklistMaterials.forEach(({ activity_id, material }) => {
    const row = rows.find((entry) => entry.activity_id === activity_id);
    const activityHtml = extractActivityHtml(html, row, rows);
    const criterion = checklistCriterionMarker(material);
    assert.ok(activityHtml.includes(criterion), material.material_id + " checklist criterion missing");
    const hasChecklistMarkup =
      /util-checklist-block/i.test(activityHtml) || /<ul[\s>]/i.test(activityHtml) || /<ol[\s>]/i.test(activityHtml);
    assert.ok(hasChecklistMarkup, "expected checklist component or list fallback in " + activity_id);
  });
});

test("RNA vNext fixture: material ordering follows beat plan or assembled sequence", () => {
  const { api, normalize } = loadPrismTestApi();
  const page = loadRnaFixture();
  const normalized = normalize.normalizePageForRender(page);
  const html = renderPage(api, page);
  const rows = activityRowsFromPage(normalized);

  rows.forEach((row) => {
    const activityHtml = extractActivityHtml(html, row, rows);
    const hasBeats =
      row.episode_plan &&
      Array.isArray(row.episode_plan.beats) &&
      row.episode_plan.beats.length;
    if (hasBeats) {
      const expectedBeatOrder = row.episode_plan.beats.map((beat) => String(beat.function || ""));
      const renderedBeatOrder = [...activityHtml.matchAll(/data-episode-function="([^"]+)"/g)].map((m) => m[1]);
      assert.deepEqual(
        renderedBeatOrder,
        expectedBeatOrder,
        row.activity_id + " beat section order should match episode_plan"
      );
      return;
    }
    const sequence = row.materials && row.materials._render_sequence;
    assert.ok(Array.isArray(sequence) && sequence.length, "expected _render_sequence for " + row.activity_id);
    const positions = sequence.map((entry) => {
      const material = (Array.isArray(page.activities) ? page.activities : []).find((a) => a.activity_id === row.activity_id);
      const src =
        material && Array.isArray(material.materials)
          ? material.materials.find((m) => m.material_id === entry.material_id)
          : null;
      if (!src) return -1;
      const marker = isChecklistMaterial(src)
        ? checklistCriterionMarker(src)
        : isTableMaterial(src)
          ? tableRowMarker(src)
          : materialBodyMarker(src);
      return activityHtml.indexOf(marker);
    });
    positions.forEach((pos, idx) => {
      assert.ok(pos !== -1, row.activity_id + " marker missing for sequence index " + idx);
    });
    for (let i = 1; i < positions.length; i += 1) {
      assert.ok(
        positions[i] > positions[i - 1],
        row.activity_id + " material order diverged at index " + i
      );
    }
  });
});

test("RNA vNext fixture: audit materials A4-M2, A6-M3, A6-M5, A6-M7 stay in owning activity", () => {
  const { api } = loadPrismTestApi();
  const page = loadRnaFixture();
  const html = renderPage(api, page);
  const rows = activityRowsFromPage(page);
  const audit = [
    { activity_id: "A4", material_id: "A4-M2", marker: "S62-RNA-A4-M2-BODY" },
    { activity_id: "A6", material_id: "A6-M3", marker: "S62-RNA-A6-M3-BODY" },
    { activity_id: "A6", material_id: "A6-M5", marker: "S62-RNA-A6-M5-BODY" },
    { activity_id: "A6", material_id: "A6-M7", marker: "S62-RNA-A6-M7-BODY" }
  ];
  audit.forEach((item) => {
    const row = rows.find((entry) => entry.activity_id === item.activity_id);
    const activityHtml = extractActivityHtml(html, row, rows);
    assert.ok(activityHtml.includes(item.marker), item.material_id + " not in " + item.activity_id);
    const outside = html.replace(activityHtml, "");
    assert.ok(!outside.includes(item.marker), item.material_id + " displaced outside " + item.activity_id);
  });
});

test("unknown material_type renders titled Markdown fallback instead of disappearing", () => {
  const { api } = loadPrismTestApi();
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Fallback material type fixture",
    page_profile: "design",
    activities: [
      {
        activity_id: "A1",
        title: "Fallback Activity",
        activity_preamble: "Read the unfamiliar material before responding.",
        learner_task: "Read the unfamiliar material.",
        expected_output: "A short response.",
        materials: [
          {
            material_id: "A1-F1",
            material_type: "experimental_diagnostic_card",
            title: "S62 Fallback Experimental Card",
            body_format: "markdown",
            body: "Marker S62-RNA-A1-F1-BODY. This unfamiliar type should still render."
          }
        ]
      }
    ]
  };
  const html = renderPage(api, page);
  assert.match(html, /S62 Fallback Experimental Card/i);
  assert.match(html, /S62-RNA-A1-F1-BODY/);
  assert.equal(countOccurrences(html, "S62-RNA-A1-F1-BODY"), 1);
});

test("required_materials specifications are not rendered as learner content", () => {
  const { api } = loadPrismTestApi();
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Required materials metadata fixture",
    page_profile: "design",
    activities: [
      {
        activity_id: "A1",
        title: "Metadata Only Activity",
        activity_preamble: "Complete the realised material only.",
        learner_task: "Complete the task.",
        expected_output: "Output.",
        required_materials: [
          {
            material_id: "A1-REQ-1",
            type: "checklist",
            purpose: "INTERNAL_SPEC_ONLY_S62",
            specification: "Do not render this planning row."
          }
        ],
        materials: [
          {
            material_id: "A1-M1",
            material_type: "text",
            title: "S62 Realised Material",
            body: "Marker S62-RNA-A1-M1-REALISED-ONLY."
          }
        ]
      }
    ]
  };
  const html = renderPage(api, page);
  assert.match(html, /S62-RNA-A1-M1-REALISED-ONLY/);
  assert.doesNotMatch(html, /INTERNAL_SPEC_ONLY_S62/);
  assert.doesNotMatch(html, /Do not render this planning row/);
});

test("RNA vNext fixture: complete flow suppresses duplicate Page Synthesis and keeps one metadata fold", () => {
  const { api } = loadPrismTestApi();
  const page = loadRnaFixture();
  const html = renderPage(api, page);
  const body = bodyBeforeMeta(html);

  assert.doesNotMatch(body, /<h2[^>]*>[\s\S]*?Page Synthesis[\s\S]*?<\/h2>/i);
  ["Overview", "Learning Purpose", "Knowledge Summary", "Learning Journey", "Learning Activities", "Assessment Check", "Study Tips"].forEach((label) => {
    assert.ok(countSectionHeading(body, label) <= 1, label + " should not be duplicated in learner body");
  });
  assert.equal(countSectionHeading(body, "Learning Activities"), 1);

  assert.match(html, /<details class="util-meta">/i);
  assert.doesNotMatch(html, /<details class="util-meta"[^>]*\bopen\b/i);
  assert.match(html, /Assembly State/i);
});

test("RNA vNext fixture: beat-material closure has no sidecar or render-plan false positives", () => {
  const { api } = loadPrismTestApi();
  const registry = require("../lib/beat-material-registry.js");
  const beats = require("../lib/utility-pedagogical-beats.js");
  const page = loadRnaFixture();
  const normPage = api.normalizePageForRenderForTest(JSON.parse(JSON.stringify(page)));
  const beforeHtml = renderPage(api, page);

  const result = registry.validatePageBeatMaterialClosure(normPage, {
    classifyFromText: beats.classifyPedagogicalBeat
  });
  const joined = result.messages.join(" ");

  assert.equal(joined.includes("_material_ids"), false, joined);
  assert.equal(joined.includes("_material_types"), false, joined);
  assert.equal(joined.includes("_render_sequence"), false, joined);
  assert.equal(result.diagnostics.conflicts.length, 0, joined);

  const emptyFns = result.diagnostics.empty_beats.map((row) => row.episode_function);
  assert.equal(emptyFns.includes("guided_practice"), false, joined);
  assert.equal(emptyFns.includes("worked_thinking"), false, joined);

  const unassignedKeys = result.diagnostics.unassigned_materials.map((row) => row.material_key);
  assert.deepEqual(unassignedKeys, ["planning_table"]);

  const rows = activityRowsFromPage(page);
  rows.forEach((row) => {
    const materials = Array.isArray(row.materials) ? row.materials : [];
    materials.forEach((material) => {
      assert.equal(unassignedKeys.includes(material.material_id), false, material.material_id);
    });
  });

  const afterHtml = renderPage(api, page);
  assert.equal(afterHtml, beforeHtml);
});

test("legacy fallback: page_synthesis still renders when structured sections are absent", () => {
  const { api } = loadPrismTestApi();
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Fallback synthesis page",
    page_synthesis: {
      overview: { body: "Legacy overview fallback body." },
      learning_purpose: { body: "Legacy purpose fallback body." },
      knowledge_summary: { body: "Legacy knowledge summary fallback body." },
      study_tips: { body: "- Legacy tip one." }
    },
    generation_notes: {
      validation: "legacy-fallback-fixture"
    }
  };
  const html = renderPage(api, page);
  assert.match(html, /Legacy overview fallback body/i);
  assert.match(html, /Legacy purpose fallback body/i);
  assert.match(html, /Legacy knowledge summary fallback body/i);
});

test("RNA vNext fixture: technical metadata keys do not leak into learner-facing body", () => {
  const { api } = loadPrismTestApi();
  const page = loadRnaFixture();
  const html = renderPage(api, page);
  const body = bodyBeforeMeta(html);
  const meta = (html.match(/<details class="util-meta"[\s\S]*<\/details>/i) || [""])[0];

  assert.doesNotMatch(body, /<h2[^>]*>[\s\S]*?Metadata[\s\S]*?<\/h2>/i);
  assert.doesNotMatch(body, /PrismRenderNormalized/i);
  assert.match(html, /<details class="util-meta">/i);
  assert.doesNotMatch(html, /<details class="util-meta"[^>]*\bopen\b/i);
  assert.match(meta, /Metadata|Assembly State/i);
  assert.match(meta, /PrismRenderNormalized|Prism Render Normalized|prism[_\s-]?render[_\s-]?normalized/i);
});

test("generic fallback remains for legitimate unknown top-level learner field", () => {
  const { api } = loadPrismTestApi();
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Unknown top-level field fallback fixture",
    learner_extension_notes: "Legacy learner-facing top-level field still renders.",
    sections: []
  };
  const html = renderPage(api, page);
  const body = bodyBeforeMeta(html);

  assert.match(body, /Learner Extension Notes/i);
  assert.match(body, /Legacy learner-facing top-level field still renders/i);
});
