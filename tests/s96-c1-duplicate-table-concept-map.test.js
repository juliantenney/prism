/**
 * C1 publishing defects:
 * - S4 exposition markdown table identical to the commissioned raw-data table
 * - S6 concept map with nodes + connections must not fall back to ids
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fflate = require("fflate");

const handoff = require("../lib/expository-xm-illustration-handoff.js");
const learnerPackage = require("../lib/learner-package.js");
const learnerPackageZip = require("../lib/learner-package-zip.js");
const { buildPageModel } = require("../lib/learner-renderer-vnext/build-page-model.js");
const {
  renderLearnerPageHtml
} = require("../lib/learner-renderer-vnext/render-learner-page.js");

const DEGREE = "\u00B0";
const RAW_HEADERS = [
  "Trial",
  "Condition A: 20 " + DEGREE + "C (s)",
  "Condition B: 40 " + DEGREE + "C (s)"
];
const RAW_ROWS = [
  [1, 93, 78],
  [2, 89, 72],
  [3, 96, 81],
  [4, 91, 75],
  [5, 94, 70],
  [6, 87, 77]
];
const RAW_CAPTION =
  "Synthetic educational measurements from six independent trials in each water-temperature condition. Dissolution times are recorded in whole seconds.";

function markdownTable(headers, rows) {
  const head = "| " + headers.join(" | ") + " |";
  const rule = "|" + headers.map(function () { return "---"; }).join("|") + "|";
  const body = rows
    .map(function (row) {
      return "| " + row.join(" | ") + " |";
    })
    .join("\n");
  return [head, rule, body].join("\n");
}

function rawDataMaterial(rows) {
  return {
    material_id: "XM-M04",
    commission_id: "XM-S4-01",
    section_id: "S4",
    kind: "Accessible canonical raw-data table",
    body: {
      title: "Raw dissolution-time observations",
      representation_type: "Accessible data table",
      caption: RAW_CAPTION,
      columns: [
        { key: "trial", heading: RAW_HEADERS[0] },
        { key: "condition_a", heading: RAW_HEADERS[1], unit: "s" },
        { key: "condition_b", heading: RAW_HEADERS[2], unit: "s" }
      ],
      rows: rows.map(function (row) {
        return { trial: row[0], condition_a: row[1], condition_b: row[2] };
      })
    }
  };
}

function conceptMapMaterial() {
  return {
    material_id: "XM-M06",
    commission_id: "XM-S6-02",
    section_id: "S6",
    kind: "Integrated experimental-evidence concept map",
    body: {
      title: "How experimental measurements become evidence",
      representation_type: "Directed concept map",
      nodes: [
        {
          id: "question",
          label: "Scientific question",
          detail: "Does water temperature affect the time taken for a standard soluble tablet to dissolve?"
        },
        {
          id: "design",
          label: "Experimental comparison",
          detail: "Condition A: 20 " + DEGREE + "C; Condition B: 40 " + DEGREE + "C"
        },
        { id: "independent", label: "Independent variable", detail: "Water temperature" },
        { id: "dependent", label: "Dependent variable", detail: "Dissolution time (s)" },
        {
          id: "controls",
          label: "Intended controls",
          detail: "Same tablet product and nominal size; 200 mL water; same vessel type; no deliberate stirring"
        },
        {
          id: "measurement",
          label: "Operational measurement",
          detail: "Time from tablet entering water until no visible solid tablet remains"
        },
        {
          id: "repetition",
          label: "Independent repeated trials",
          detail: "Six trials per condition, each using a fresh tablet and fresh water"
        },
        {
          id: "observations",
          label: "Raw observations",
          detail: "Individual dissolution times recorded in whole seconds"
        },
        {
          id: "interpretation",
          label: "Further interpretation",
          detail: "Examine the evidence and its limitations before developing explanations or conclusions"
        }
      ],
      connections: [
        { from: "question", to: "design", label: "guides" },
        { from: "design", to: "independent", label: "deliberately varies" },
        { from: "design", to: "dependent", label: "measures" },
        { from: "design", to: "controls", label: "specifies" },
        { from: "dependent", to: "measurement", label: "is operationally defined by" },
        { from: "design", to: "repetition", label: "is repeated through" },
        { from: "measurement", to: "observations", label: "produces recorded values" },
        { from: "repetition", to: "observations", label: "provides multiple measurements" },
        { from: "controls", to: "observations", label: "supports interpretability of" },
        { from: "observations", to: "interpretation", label: "provides evidence for" }
      ],
      qualification:
        "Intended controls support the comparison but do not prove that every relevant influence was held constant. Raw observations provide evidence for later interpretation; they do not automatically establish a causal conclusion.",
      text_equivalent:
        "The scientific question guides a comparison between water at 20 " +
        DEGREE +
        "C and water at 40 " +
        DEGREE +
        "C. Those observations provide evidence for later interpretation, but the intended controls do not eliminate every possible influence and the observations do not automatically establish causation."
    }
  };
}

function pageWith(sections, affordances) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Understanding Experimental Evidence",
    activities: [],
    sections: sections,
    visual_affordance_schema_version: "38.4",
    activities_visual_review: [],
    visual_affordances: affordances || [],
    page_synthesis: {
      overview: "Experimental evidence in the soluble-tablet investigation.",
      learning_purpose: "Read raw observations before interpreting them."
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

function sectionHtml(html, sectionId) {
  const start = html.indexOf('id="exposition-' + sectionId + '"');
  assert.notEqual(start, -1, sectionId);
  const end = html.indexOf("</section>", start);
  return html.slice(start, end);
}

function article(html, materialId) {
  const marker = 'data-material-id="' + materialId + '"';
  const start = html.indexOf(marker);
  assert.notEqual(start, -1, materialId);
  const open = html.lastIndexOf("<article", start);
  const end = html.indexOf("</article>", start);
  return html.slice(open, end + "</article>".length);
}

test("exact S4 markdown table is not published beside the structured raw-data table", () => {
  const material = rawDataMaterial(RAW_ROWS);
  const exposition =
    "Each trial produces one dissolution-time measurement. The complete dataset is shown below.\n\n" +
    markdownTable(RAW_HEADERS, RAW_ROWS) +
    "\n\nTo read a value, identify its trial number, condition and unit.\n\n" +
    markdownTable(
      ["Statement", "Status"],
      [["Observation", "Recorded"]]
    );
  const source = pageWith([
    {
      section_id: "S4",
      title: "Raw observations",
      exposition: exposition,
      materials: [material]
    }
  ]);
  const before = source.sections[0].exposition;
  const rendered = renderLearnerPageHtml(source);
  assert.equal(rendered.error, null);
  assert.equal(source.sections[0].exposition, before);

  const html = String(rendered.html || "");
  const s4 = sectionHtml(html, "S4");
  assert.equal((s4.match(/<table\b/g) || []).length, 2);
  assert.equal((s4.match(/<td>93<\/td>/g) || []).length, 1);
  assert.equal((s4.match(/<td>77<\/td>/g) || []).length, 1);
  assert.match(s4, /Synthetic educational measurements from six independent trials/);
  assert.match(s4, /To read a value, identify its trial number/);
  assert.match(s4, /<td>Observation<\/td>/);
  RAW_ROWS.forEach(function (row) {
    assert.match(s4, new RegExp("<td>" + row[1] + "</td>"));
    assert.match(s4, new RegExp("<td>" + row[2] + "</td>"));
  });
  assert.match(s4, /Condition A: 20 °C \(s\)/);

  const packaged = learnerPackage.buildLearnerPackage({
    html: html,
    visualAssetManifest: { assets: [] },
    title: "Understanding Experimental Evidence"
  });
  assert.equal(packaged.ok, true, JSON.stringify(packaged.error || {}));
  const zipped = learnerPackageZip.serializeLearnerPackageToZip(packaged.package);
  assert.equal(zipped.ok, true, JSON.stringify(zipped.error || {}));
  const entries = fflate.unzipSync(zipped.bytes);
  const exported = fflate.strFromU8(entries["learner-page.html"]);
  const exportedS4 = sectionHtml(exported, "S4");
  assert.equal((exportedS4.match(/<td>93<\/td>/g) || []).length, 1);
  assert.match(exportedS4, /To read a value, identify its trial number/);
  assert.match(exportedS4, /<td>77<\/td>/);
});

test("a raw-data table that differs by one value is not treated as a duplicate", () => {
  const rows = RAW_ROWS.map(function (row) { return row.slice(); });
  rows[5][2] = 76;
  const source = pageWith([
    {
      section_id: "S4",
      title: "Raw observations",
      exposition: "The complete dataset is shown below.\n\n" + markdownTable(RAW_HEADERS, RAW_ROWS),
      materials: [rawDataMaterial(rows)]
    }
  ]);
  const html = String(renderLearnerPageHtml(source).html || "");
  const s4 = sectionHtml(html, "S4");
  assert.equal((s4.match(/<table\b/g) || []).length, 2);
  assert.match(s4, /<td>77<\/td>/);
  assert.match(s4, /<td>76<\/td>/);
});

test("S6 concept map uses labels and relationship language, and can be commissioned", () => {
  const material = conceptMapMaterial();
  assert.equal(handoff.isUnrealizedIllustrationSpecification(material), true);
  const view = handoff.readIllustration(material);
  assert.equal(view.elementLabels[0], "Scientific question");
  assert.equal(view.elementLabels[1], "Experimental comparison");
  assert.equal(
    view.relationships[0].line,
    "Scientific question → Experimental comparison (guides)"
  );
  assert.equal(view.relationships.length, 10);
  assert.equal(view.relationships[9].line, "Raw observations → Further interpretation (provides evidence for)");

  const source = pageWith(
    [
      {
        section_id: "S6",
        title: "Evidence",
        exposition: "The concept map connects the question to the recorded observations.",
        materials: [material]
      }
    ],
    [
      {
        affordance_id: "va-S6-skip-01",
        scope: "section",
        section_id: "S6",
        visual_decision: "skip",
        skip_reason: "duplicate_existing_structure",
        subject: "Integrated structure of experimental evidence",
        context: "The commissioned concept map is treated as an existing figure.",
        evidence_anchors: ["S6.materials_commission"],
        rationale: "A further figure would duplicate the commissioned map."
      }
    ]
  );
  const affordancesBefore = JSON.stringify(source.visual_affordances);
  const prepared = handoff.preparePageForXmIllustrationJobs(source);
  assert.equal(JSON.stringify(source.visual_affordances), affordancesBefore);
  assert.equal(
    prepared.visual_affordances.filter(function (row) {
      return row && row.affordance_id === "va-xm-xmm06";
    }).length,
    1
  );
  assert.equal(
    prepared.visual_affordances.some(function (row) {
      return row && row.visual_decision === "skip";
    }),
    false
  );

  const rendered = renderLearnerPageHtml(source);
  assert.equal(rendered.error, null);
  assert.equal(JSON.stringify(source.visual_affordances), affordancesBefore);
  const html = String(rendered.html || "");
  const map = article(html, "XM-M06");
  assert.match(map, /data-expository-structured="diagram_specification"/);
  assert.match(map, /data-diagram-fallback="learner-facing"/);
  assert.equal(map.includes('data-expository-structured="fallback"'), false);
  assert.doesNotMatch(map, /<th[^>]*>Label<\/th>/);
  assert.doesNotMatch(map, /<th[^>]*>Detail<\/th>/);
  assert.doesNotMatch(map, /question → design/);
  assert.match(map, /Scientific question → Experimental comparison — guides/);
  assert.match(map, /Experimental comparison → Independent variable — deliberately varies/);
  assert.match(map, /Dependent variable → Operational measurement — is operationally defined by/);
  assert.match(map, /Intended controls → Raw observations — supports interpretability of/);
  assert.match(map, /Raw observations → Further interpretation — provides evidence for/);
  assert.match(map, /Does water temperature affect the time taken/);
  assert.match(map, /do not automatically establish a causal conclusion/);
  assert.match(map, /do not automatically establish causation/);
  const concepts = map.slice(map.indexOf('data-field="concepts"'), map.indexOf('data-field="relationships"'));
  assert.ok(concepts.indexOf("Scientific question") < concepts.indexOf("Experimental comparison"));
  assert.ok(concepts.indexOf("Experimental comparison") < concepts.indexOf("Raw observations"));
  assert.ok(concepts.indexOf("Raw observations") < concepts.indexOf("Further interpretation"));
  const s6 = sectionHtml(html, "S6");
  assert.equal(s6.includes("<img"), false);

  const model = buildPageModel(source);
  assert.equal(model.ok, true, JSON.stringify(model.errors || []));
  const built = model.model.expositionSections[0].materials[0];
  assert.equal(built.type, "expository_diagram_specification");
  assert.equal(built.concepts.length, 9);
  assert.equal(built.relationships.length, 10);

  const packaged = learnerPackage.buildLearnerPackage({
    html: html,
    visualAssetManifest: { assets: [] },
    title: "Understanding Experimental Evidence"
  });
  assert.equal(packaged.ok, true, JSON.stringify(packaged.error || {}));
  const zipped = learnerPackageZip.serializeLearnerPackageToZip(packaged.package);
  const exported = fflate.strFromU8(fflate.unzipSync(zipped.bytes)["learner-page.html"]);
  const exportedMap = article(exported, "XM-M06");
  assert.match(exportedMap, /Scientific question → Experimental comparison — guides/);
  assert.doesNotMatch(exportedMap, /question → design/);
  assert.equal(exported.includes("<img"), false);
});
