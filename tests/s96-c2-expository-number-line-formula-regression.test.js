/**
 * C2 Expository defects:
 * - Annotated number-line XM commissions route through the existing image pipeline
 * - Object-valued formula fields must not render as "[object Object]"
 * - Structured formal_notes stay structured and author-only
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const handoff = require("../lib/expository-xm-illustration-handoff.js");
const workspace = require("../lib/utilities-visual-jobs-workspace.js");
const contracts = require("../lib/expository-contracts.js");
const {
  buildExpositionStructuredMaterial,
  renderExpositionStructuredMaterial
} = require("../lib/learner-renderer-vnext/expository-structured-materials.js");
const { buildPageModel } = require("../lib/learner-renderer-vnext/build-page-model.js");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext/render-learner-page.js");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("./prism-vm-lib-bootstrap.js");

const NUMBER_LINE_ALT =
  "Three reaction times appear at 10 s, 12 s and 14 s on a shared axis. A range indicator spans from 10 s to 14 s, a width of 4 s.";

function numberLineMaterial() {
  return {
    material_id: "XM-S3-01",
    section_id: "S3",
    kind: "Annotated number-line representation",
    title: "Reaction-time range on a number line",
    body: {
      title: "Reaction-time range on a number line",
      format: "Annotated number-line representation",
      observations: [
        { value: "10 s", label: "Trial A" },
        { value: "12 s", label: "Trial B" },
        { value: "14 s", label: "Trial C" }
      ],
      ticks: ["10 s", "12 s", "14 s"],
      range_indicator: {
        start: "10 s",
        end: "14 s",
        label: "Range",
        description: "Range of 4 s"
      },
      text_alternative: NUMBER_LINE_ALT
    },
    formal_notes: {
      render_as: "image",
      preserve_values: ["10 s", "12 s", "14 s", "4 s"]
    }
  };
}

function calculationMaterial() {
  return {
    material_id: "XM-S2-01",
    section_id: "S2",
    kind: "Annotated calculation sequence",
    title: "Calculating the Arithmetic Mean",
    body: {
      title: "Calculating the Arithmetic Mean",
      formula: {
        expression: "(10 + 12 + 14) / 3 = 12",
        spoken_equivalent: "ten plus twelve plus fourteen, all over three, equals twelve",
        notation: "x̄ = Σx / n"
      },
      annotations: [{ label: "Mean", description: "The arithmetic average of the three times." }]
    },
    formal_notes: {
      author_note: "Keep the mean calculation as structured educational content."
    }
  };
}

function deviationTableMaterial() {
  return {
    material_id: "XM-S2-02",
    section_id: "S2",
    kind: "Worked deviation table",
    title: "Deviations from the mean",
    body: {
      caption: "Deviations from the mean",
      columns: ["Observation", "Value", "Deviation from mean"],
      rows: [
        { Observation: "Trial A", Value: "10 s", "Deviation from mean": "−2 s" },
        { Observation: "Trial B", Value: "12 s", "Deviation from mean": "0 s" },
        { Observation: "Trial C", Value: "14 s", "Deviation from mean": "+2 s" }
      ]
    }
  };
}

function stringEquationMaterial() {
  return {
    material_id: "XM-EQ-01",
    section_id: "S4",
    kind: "equation",
    title: "Range identity",
    body: {
      title: "Range identity",
      formula: "Range = max − min",
      caption: "Range is the difference between extremes."
    }
  };
}

function pageWith(materials, affordances) {
  const bySection = {};
  materials.forEach(function (material) {
    const sid = material.section_id;
    if (!bySection[sid]) {
      bySection[sid] = {
        section_id: sid,
        title: sid,
        exposition: "Section " + sid + " exposition.",
        materials: []
      };
    }
    bySection[sid].materials.push(material);
  });
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Understanding Descriptive Statistics",
    activities: [],
    sections: Object.keys(bySection).map(function (key) {
      return bySection[key];
    }),
    visual_affordance_schema_version: "38.4",
    activities_visual_review: [],
    visual_affordances: affordances || [],
    page_synthesis: {
      overview: "Descriptive statistics overview.",
      learning_purpose: "Read centre and spread from short data sets."
    },
    assembly_state: {
      current_stage: "design_page",
      enriched_by: [
        "expository_journey_plan",
        "expository_development",
        "expository_materials",
        "design_page"
      ]
    }
  };
}

function article(html, materialId) {
  const marker = 'data-material-id="' + materialId + '"';
  const start = html.indexOf(marker);
  assert.notEqual(start, -1, "missing material " + materialId);
  const open = html.lastIndexOf("<article", start);
  const end = html.indexOf("</article>", start);
  return html.slice(open, end + "</article>".length);
}

test("annotated number-line XM is recognised and becomes a number_line_segments image job", () => {
  const material = numberLineMaterial();
  assert.equal(handoff.isNumberLineSpecification(material), true);
  assert.equal(handoff.isUnrealizedIllustrationSpecification(material), true);

  const page = pageWith([material]);
  const defer = {
    affordance_id: "va-S3-defer-01",
    scope: "section",
    section_id: "S3",
    visual_decision: "defer",
    defer_reason: "worked_example_sufficient_first",
    subject: "Number line already in materials",
    context: "Visual brief: structured material treated as existing visual.",
    evidence_anchors: ["S3.materials.XM-S3-01"],
    rationale: "Incorrectly treats the JSON specification as a realised graphic."
  };
  page.visual_affordances = [defer];

  const conflicts = handoff.collectSuppressedUnrealizedXmGraphics(page);
  assert.equal(conflicts.length, 1);
  assert.match(conflicts[0].message, /must not suppress unrealised commissioned graphic XM-S3-01/i);

  const prepared = handoff.preparePageForXmIllustrationJobs(page);
  assert.equal(
    prepared.visual_affordances.some(function (row) {
      return row && row.visual_decision === "defer";
    }),
    false,
    "defer suppressing the number line must be removed"
  );
  const generate = prepared.visual_affordances.find(function (row) {
    return row && row.material_id === "XM-S3-01" && row.visual_decision === "generate";
  });
  assert.ok(generate);
  assert.equal(generate.preferred_representation, "number_line_segments");
  assert.equal(generate.requires_exact_data_match, true);
  assert.match(generate.must_show.join("\n"), /10 s/);
  assert.match(generate.must_show.join("\n"), /12 s/);
  assert.match(generate.must_show.join("\n"), /14 s/);
  assert.match(generate.must_show.join("\n"), /4 s/);

  const pipeline = workspace.buildVisualJobsPipelineFromPage(pageWith([material], [defer]));
  assert.equal(pipeline.plannerResult.valid, true, JSON.stringify(pipeline.plannerResult.errors));
  assert.equal(pipeline.compilerResult.valid, true, JSON.stringify(pipeline.compilerResult.errors));
  assert.equal(pipeline.plannerResult.jobs.length, 1);
  assert.equal(pipeline.plannerResult.jobs[0].preferred_representation, "number_line_segments");
  assert.equal(pipeline.plannerResult.jobs[0].requires_exact_data_match, true);
  const joined = pipeline.plannerResult.jobs[0].must_show.join("\n");
  assert.match(joined, /10 s/);
  assert.match(joined, /12 s/);
  assert.match(joined, /14 s/);
  assert.match(joined, /4 s/);
});

test("unattached number-line publishes accessible alternative, not construction fields", () => {
  const page = pageWith([numberLineMaterial(), deviationTableMaterial()]);
  const model = buildPageModel(page);
  assert.equal(model.ok, true, JSON.stringify(model.errors || []));
  const numberLine = model.model.expositionSections
    .flatMap(function (section) {
      return section.materials;
    })
    .find(function (material) {
      return material.id === "XM-S3-01";
    });
  assert.equal(numberLine.type, "expository_unfulfilled_illustration");
  assert.equal(numberLine.accessibleText, NUMBER_LINE_ALT);

  const rendered = renderLearnerPageHtml(page);
  const html = String(rendered.html || "");
  const block = article(html, "XM-S3-01");
  assert.match(block, /data-illustration-status="unfulfilled"/);
  assert.match(block, /10 s, 12 s and 14 s/);
  assert.match(block, /width of 4 s/i);
  assert.doesNotMatch(block, /\[object Object\]/);
  ["Range indicator", "Start", "End", "Label", "Description"].forEach(function (label) {
    assert.equal(block.includes(">" + label + "<"), false, label);
  });

  const tableBlock = article(html, "XM-S2-02");
  assert.match(tableBlock, /<table\b/i);
  assert.match(tableBlock, /Deviation from mean/);
  assert.match(tableBlock, /−2 s/);
  assert.doesNotMatch(html, /formal_notes/);
  assert.doesNotMatch(html, /AUTHOR-ONLY|author_note|preserve_values/);
});

test("object-valued formula renders expression; structured formal_notes stay author-only", () => {
  const normalized = contracts.normalizeExpositoryMaterials({
    materials: [calculationMaterial(), stringEquationMaterial()]
  });
  assert.equal(typeof normalized.materials[0].formal_notes, "object");
  assert.equal(
    normalized.materials[0].formal_notes.author_note,
    "Keep the mean calculation as structured educational content."
  );
  assert.notEqual(normalized.materials[0].formal_notes, "[object Object]");

  const built = buildExpositionStructuredMaterial(normalized.materials[0], "S2", 0);
  assert.equal(built.type, "expository_structured_equation");
  assert.equal(built.equation, "(10 + 12 + 14) / 3 = 12");
  assert.notEqual(built.equation, "[object Object]");
  assert.ok(
    built.annotations.some(function (ann) {
      return String(ann.description || "").indexOf("ten plus twelve plus fourteen") !== -1;
    })
  );

  const html = renderExpositionStructuredMaterial(built);
  assert.match(html, /\(10 \+ 12 \+ 14\) \/ 3 = 12/);
  assert.match(html, /Spoken form/);
  assert.match(html, /Notation/);
  assert.doesNotMatch(html, /\[object Object\]/);
  assert.doesNotMatch(html, /author_note/);

  const stringBuilt = buildExpositionStructuredMaterial(normalized.materials[1], "S4", 1);
  assert.equal(stringBuilt.equation, "Range = max − min");
  const stringHtml = renderExpositionStructuredMaterial(stringBuilt);
  assert.match(stringHtml, /Range = max − min/);
  assert.doesNotMatch(stringHtml, /\[object Object\]/);
});

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
  const repoRoot = path.resolve(__dirname, "..");
  const source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise, _: { debounce: (fn) => fn } };
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
    setTimeout,
    clearTimeout,
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem() {} }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(
    sandbox,
    repoRoot,
    PEDAGOGICAL_ICON_LIBS.concat([
      "lib/sprint38-visual-affordances.js",
      "lib/visual-planning-contract.js",
      "lib/expository-sibling-prompts.js",
      "lib/expository-contracts.js",
      "lib/expository-xm-illustration-handoff.js",
      "lib/first-class-workflow-family.js"
    ])
  );
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return api;
}

test("Design Page capture validation rejects defer that suppresses unrealised number-line graphic", () => {
  const api = loadPrismTestApi();
  assert.ok(typeof api.validateDesignPagePartialPageCapture === "function");

  const capture = pageWith([numberLineMaterial()], [
    {
      affordance_id: "va-S3-defer-01",
      scope: "section",
      section_id: "S3",
      visual_decision: "defer",
      defer_reason: "worked_example_sufficient_first",
      subject: "Number line already in materials",
      context: "Visual brief: defer incorrectly.",
      evidence_anchors: ["S3.materials.XM-S3-01"],
      rationale: "Structured material is not a realised graphic."
    }
  ]);
  const wf = {
    id: "wf-c2-expo",
    name: "Create an Expository Resource: Descriptive Statistics",
    product: "expository",
    ldCreateOutputType: api.LD_CREATE_OUTPUT_TYPE_EXPOSITORY
  };
  const check = api.validateDesignPagePartialPageCapture(capture, wf);
  assert.equal(check.ok, false, JSON.stringify(check.errors || []));
  assert.ok(
    (check.errors || []).some(function (err) {
      return /must not suppress unrealised commissioned graphic XM-S3-01/i.test(String(err));
    }),
    JSON.stringify(check.errors || [])
  );
});
