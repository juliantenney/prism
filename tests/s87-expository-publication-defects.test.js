/**
 * Expository learner-facing publication defects:
 * diagram specifications, comparison schemas, concept-map image instructions,
 * and generic column headings.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext/render-learner-page.js");
const workspace = require("../lib/utilities-visual-jobs-workspace.js");
const compiler = require("../lib/prism-image-brief-compiler.js");

function pageWith(sections, visualAffordances) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Publication defect page",
    activities: [],
    sections: sections,
    visual_affordances: visualAffordances || [],
    page_synthesis: {},
    assembly_state: {
      current_stage: "expository_materials",
      enriched_by: [
        "expository_journey_plan",
        "expository_development",
        "expository_materials"
      ]
    }
  };
}

function section(sectionId, title, materials) {
  return {
    section_id: sectionId,
    title: title,
    exposition: "Section prose remains visible.",
    materials: materials
  };
}

function renderExport(page, options) {
  const rendered = renderLearnerPageHtml(page, options || {});
  assert.equal(rendered.error, null, JSON.stringify(rendered.error));
  return String(rendered.html || "");
}

function loadBrowserRendererApi() {
  const source = fs.readFileSync(
    path.join(__dirname, "..", "lib", "learner-renderer-vnext-browser.js"),
    "utf8"
  );
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    window: {},
    globalThis: {}
  };
  sandbox.window.window = sandbox.window;
  sandbox.window.globalThis = sandbox.window;
  sandbox.globalThis = sandbox.window;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "learner-renderer-vnext-browser.js" });
  return sandbox.window.PRISM_LEARNER_RENDERER_VNEXT;
}

function renderPreview(page, options) {
  const api = loadBrowserRendererApi();
  const rendered = api.renderLearnerPageHtml(page, options || {});
  assert.equal(rendered.error, null, JSON.stringify(rendered.error));
  return String(rendered.html || "");
}

function assertPreviewMatchesExport(page, options) {
  const exportedHtml = renderExport(page, options);
  const previewHtml = renderPreview(page, options);
  assert.equal(previewHtml, exportedHtml);
  return exportedHtml;
}

function materialHtml(html, materialId) {
  const marker = 'data-material-id="' + materialId + '"';
  const start = html.indexOf(marker);
  assert.ok(start >= 0, "missing material " + materialId);
  const open = html.lastIndexOf("<article", start);
  const close = html.indexOf("</article>", start);
  assert.ok(open >= 0 && close > open);
  return html.slice(open, close + "</article>".length);
}

function stripTags(html) {
  return String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const DIAGRAM_BODY = {
  title: "Confounding relationship diagram",
  clinical_context:
    "Patients who want to recover may attend physiotherapy more often.",
  explanatory_caption:
    "Motivation can influence both participation and the observed recovery.",
  qualification: "The observed association is not itself the effect of treatment.",
  accessible_text_equivalent:
    "A triangle linking motivation, participation, and mobility recovery.",
  representation_type: "causal_triangle",
  nodes: [
    {
      id: "N1",
      label: "Patient motivation",
      role: "Confounder",
      description: "Desire to recover may change attendance."
    },
    {
      id: "N2",
      label: "Physiotherapy participation",
      role: "Exposure",
      description: "Sessions actually attended."
    },
    {
      id: "N3",
      label: "Mobility recovery",
      role: "Outcome",
      description: "Change in walking after surgery."
    }
  ],
  relationships: [
    { from: "N1", to: "N2", label: "May influence participation" },
    { from: "N1", to: "N3", label: "May influence recovery" },
    { from: "N2", to: "N3", label: "Observed association" }
  ],
  diagram_layout: {
    top: "Patient motivation",
    bottom_left: "Physiotherapy participation",
    bottom_right: "Mobility recovery",
    arrangement: "Triangle"
  }
};

function diagramSection() {
  return section("S4", "Confounding", [
    {
      material_id: "XM-M03",
      kind: "conceptual_diagram",
      title: "Confounding relationship diagram",
      body: DIAGRAM_BODY
    }
  ]);
}

function finishedFigureAsset() {
  return {
    assets: [
      {
        brief_id: "brief-s4-confounding",
        affordance_id: "va-S4-confounding-01",
        scope: "section",
        section_id: "S4",
        visual_slot: "section-after-content",
        alt_text: "Confounding triangle",
        detailed_description: "Motivation sits above participation and recovery.",
        render_source: { kind: "file", value: "assets/confounding.png" }
      }
    ]
  };
}

function generateAffordance() {
  return [
    {
      affordance_id: "va-S4-confounding-01",
      scope: "section",
      section_id: "S4",
      visual_decision: "generate",
      visual_slot: "section-after-content",
      subject: "Confounding triangle"
    }
  ];
}

test("diagram spec without a finished figure keeps learner explanation and hides machine fields", () => {
  const page = pageWith([diagramSection()], generateAffordance());
  const html = assertPreviewMatchesExport(page);
  const block = materialHtml(html, "XM-M03");
  const visible = stripTags(block);
  assert.match(block, /data-diagram-fallback="learner-facing"/);
  assert.match(visible, /Patients who want to recover may attend physiotherapy more often/);
  assert.match(visible, /A triangle linking motivation, participation, and mobility recovery/);
  assert.match(visible, /Patient motivation/);
  assert.match(visible, /Confounder/);
  assert.match(visible, /Patient motivation → Physiotherapy participation — May influence participation/);
  assert.doesNotMatch(visible, /\bN1\b/);
  assert.doesNotMatch(visible, /\bN2\b/);
  assert.doesNotMatch(visible, /\bN3\b/);
  assert.doesNotMatch(visible, /Node id/i);
  assert.doesNotMatch(visible, /Diagram layout/i);
  assert.doesNotMatch(visible, /causal_triangle/);
  assert.doesNotMatch(visible, /Bottom left/i);
  assert.doesNotMatch(html, /assets\/confounding\.png/);
});

test("diagram spec is suppressed only when the section figure has a renderable source", () => {
  const page = pageWith([diagramSection()], generateAffordance());
  const html = assertPreviewMatchesExport(page, { visualAssets: finishedFigureAsset() });
  const block = materialHtml(html, "XM-M03");
  const visible = stripTags(block);
  assert.match(block, /data-diagram-machine-suppressed="section-figure"/);
  assert.match(html, /assets\/confounding\.png/);
  assert.match(visible, /Patients who want to recover may attend physiotherapy more often/);
  assert.match(visible, /The observed association is not itself the effect of treatment/);
  assert.match(visible, /A triangle linking motivation, participation, and mobility recovery/);
  assert.doesNotMatch(visible, /Confounder/);
  assert.doesNotMatch(visible, /May influence participation/);
  assert.doesNotMatch(visible, /\bN1\b/);
  assert.doesNotMatch(visible, /Node id/i);
  assert.doesNotMatch(visible, /Diagram layout/i);
  assert.doesNotMatch(visible, /causal_triangle/);
  assert.doesNotMatch(block, /data-publication-status="failed"/);
});

test("diagram spec with no figure and no learner description fails closed", () => {
  const page = pageWith([
    section("S4", "Confounding", [
      {
        material_id: "XM-M03-BARE",
        kind: "conceptual_diagram",
        title: "Confounding relationship diagram",
        body: {
          nodes: [{ id: "N1" }, { id: "N2" }],
          relationships: [{ from: "N1", to: "N2" }],
          diagram_layout: { arrangement: "Triangle", bottom_left: "Hidden layout" }
        }
      }
    ])
  ]);
  const html = assertPreviewMatchesExport(page);
  const block = materialHtml(html, "XM-M03-BARE");
  const visible = stripTags(block);
  assert.match(block, /data-publication-failure="diagram_representation_unavailable"/);
  assert.match(visible, /figure is missing/);
  assert.doesNotMatch(visible, /\bN1\b/);
  assert.doesNotMatch(visible, /Hidden layout/);
  assert.doesNotMatch(visible, /Diagram layout/i);
  assert.doesNotMatch(visible, /Node id/i);
});

test("recognised diagram hides sibling connection and display metadata and keeps branch education", () => {
  const page = pageWith(
    [
      section("S1", "Question to evidence", [
        {
          material_id: "XM-M01-DIAGRAM",
          kind: "conceptual_diagram",
          title: "Question-to-evidence map",
          body: {
            clinical_context:
              "Recovery after knee replacement can support several research questions.",
            nodes: [{ id: "N1", label: "Recovery after knee replacement" }],
            relationships: [
              { from: "N1", to: "N2", label: "Requires comparative evidence" }
            ],
            connections: [
              {
                connection_id: "C1",
                display_guidance: "Dashed arrow",
                meaning: "Hypothetical influence"
              }
            ],
            display_guidance: [{ node_id: "RCT-1", guidance: "Place at the apex" }],
            branches: [
              {
                branch_id: "RCT-1",
                research_purpose: "Investigate an intervention effect",
                research_question: "Does structured physiotherapy improve mobility?",
                evidence_needed: "Comparative outcome evidence"
              },
              {
                branch_id: "Intervention effect",
                research_purpose: "Compare a treatment with usual care",
                research_question: "Which programme helps patients walk further?",
                evidence_needed: "Measured mobility outcomes"
              }
            ]
          }
        }
      ])
    ],
    [
      {
        affordance_id: "va-S1-question-evidence-01",
        scope: "section",
        section_id: "S1",
        visual_decision: "generate",
        visual_slot: "section-after-content",
        subject: "Question to evidence map"
      }
    ]
  );
  const html = assertPreviewMatchesExport(page, {
    visualAssets: {
      assets: [
        {
          brief_id: "brief-s1-map",
          affordance_id: "va-S1-question-evidence-01",
          scope: "section",
          section_id: "S1",
          visual_slot: "section-after-content",
          alt_text: "Question to evidence map",
          detailed_description: "Four purposes linked to the evidence each one needs.",
          render_source: { kind: "file", value: "assets/question-evidence.png" }
        }
      ]
    }
  });
  const block = materialHtml(html, "XM-M01-DIAGRAM");
  const visible = stripTags(block);
  assert.match(block, /data-diagram-machine-suppressed="section-figure"/);
  assert.match(visible, /Recovery after knee replacement can support several research questions/);
  assert.match(visible, /Does structured physiotherapy improve mobility\?/);
  assert.match(visible, /Comparative outcome evidence/);
  assert.match(visible, /Which programme helps patients walk further\?/);
  assert.match(visible, /Measured mobility outcomes/);
  assert.match(visible, /Intervention effect/);
  assert.match(visible, /Hypothetical influence/);
  assert.doesNotMatch(visible, /Branch id/i);
  assert.doesNotMatch(visible, /Node id/i);
  assert.doesNotMatch(visible, /Connection id/i);
  assert.doesNotMatch(visible, /\bRCT-1\b/);
  assert.doesNotMatch(visible, /\bConnections\b/);
  assert.doesNotMatch(visible, /Display guidance/i);
  assert.doesNotMatch(visible, /Place at the apex/);
  assert.doesNotMatch(visible, /Dashed arrow/);
});

test("unrecognised node_id diagram does not publish machine columns", () => {
  const page = pageWith([
    section("S2", "Designs", [
      {
        material_id: "XM-M02-NODES",
        kind: "conceptual_diagram",
        title: "Design nodes",
        body: {
          nodes: [
            {
              node_id: "RCT-1",
              label: "Randomised trial",
              description: "Participants are assigned by the investigator.",
              connections: "Links evidence to the design",
              display_guidance: "Solid line, no arrowhead"
            }
          ]
        }
      }
    ])
  ]);
  const html = assertPreviewMatchesExport(page);
  const block = materialHtml(html, "XM-M02-NODES");
  const visible = stripTags(block);
  assert.match(block, /data-expository-structured="fallback"/);
  assert.match(visible, /Randomised trial/);
  assert.match(visible, /Participants are assigned by the investigator/);
  assert.doesNotMatch(visible, /Node id/i);
  assert.doesNotMatch(visible, /\bRCT-1\b/);
  assert.doesNotMatch(visible, /\bConnections\b/);
  assert.doesNotMatch(visible, /Display guidance/i);
  assert.doesNotMatch(visible, /Links evidence to the design/);
  assert.doesNotMatch(visible, /Solid line, no arrowhead/);
  assert.match(block, /<table\b/);
});

test("anchor identifiers are omitted from an Anchor Label Text table", () => {
  const rows = [
    {
      anchor: "RCT-2",
      label: "Individual randomisation",
      text: "The investigator assigns each participant, and the question is the anchor for that assignment."
    },
    {
      anchor: "RCT-4A",
      label: "Cluster randomisation",
      text: "Whole groups are assigned together."
    }
  ];
  const page = pageWith([
    section("S3", "Assignment", [
      {
        material_id: "XM-M03-ANCHORS",
        kind: "comparison",
        title: "How assignment differs",
        body: { rows: rows }
      },
      {
        material_id: "XM-M03-ANCHORS-NESTED",
        kind: "comparison",
        title: "How assignment differs again",
        body: { statements: rows }
      }
    ])
  ]);
  const html = assertPreviewMatchesExport(page);
  ["XM-M03-ANCHORS", "XM-M03-ANCHORS-NESTED"].forEach(function (materialId) {
    const block = materialHtml(html, materialId);
    const visible = stripTags(block);
    assert.match(block, /<th[^>]*>\s*Label\s*<\/th>/);
    assert.match(block, /<th[^>]*>\s*Text\s*<\/th>/);
    assert.doesNotMatch(block, /<th[^>]*>\s*Anchor\s*<\/th>/);
    assert.doesNotMatch(visible, /\bRCT-2\b/);
    assert.doesNotMatch(visible, /\bRCT-4A\b/);
    assert.match(visible, /Individual randomisation/);
    assert.match(
      visible,
      /The investigator assigns each participant, and the question is the anchor for that assignment\./
    );
    assert.match(visible, /Cluster randomisation/);
    assert.match(visible, /Whole groups are assigned together/);
    const first = visible.indexOf("Individual randomisation");
    const second = visible.indexOf("Cluster randomisation");
    assert.ok(first >= 0 && second > first);
  });
});

test("comparison schema publishes one table with authored headings and keeps the real rows", () => {
  const page = pageWith([
    section("S5", "Paired designs", [
      {
        material_id: "XM-M04",
        kind: "paired_comparison",
        title: "Paired design comparison",
        body: {
          shared_question: "Which design can answer a treatment question?",
          comparison_columns: [
            { key: "dimension", heading: "Comparison dimension" },
            { key: "rct", heading: "Randomised controlled trial" },
            { key: "cohort", heading: "Observational cohort study" }
          ],
          comparison_rows: [
            {
              dimension: "Group formation",
              rct: "The investigator assigns participants",
              cohort: "Groups are observed as they occur"
            }
          ],
          qualified_comparison: "The cohort cannot support the same causal claim."
        }
      }
    ])
  ]);
  const html = assertPreviewMatchesExport(page);
  const block = materialHtml(html, "XM-M04");
  assert.equal((block.match(/<table\b/g) || []).length, 1);
  assert.match(block, /<th scope="col">Comparison dimension<\/th>/);
  assert.match(block, /<th scope="col">Randomised controlled trial<\/th>/);
  assert.match(block, /<th scope="col">Observational cohort study<\/th>/);
  assert.match(block, /The investigator assigns participants/);
  assert.match(block, /Groups are observed as they occur/);
  assert.match(block, /Which design can answer a treatment question/);
  assert.match(block, /The cohort cannot support the same causal claim/);
  assert.doesNotMatch(block, /<th[^>]*>\s*Key\s*<\/th>/);
  assert.doesNotMatch(block, /<th[^>]*>\s*Heading\s*<\/th>/);
  assert.doesNotMatch(block, /<th[^>]*>\s*Rct\s*<\/th>/);
  assert.doesNotMatch(block, /<th[^>]*>\s*Dimension\s*<\/th>/);
});

test("authored and meaningful column headings replace Column N; unrecoverable columns fail closed", () => {
  const page = pageWith([
    section("S3", "Five designs", [
      {
        material_id: "XM-M02",
        kind: "comparison_table",
        title: "Comparative study design table",
        body: {
          columns: [
            { key: "design", label: "Design" },
            { key: "group_formation" },
            { key: "what_is_compared", heading: "What is compared" },
            { key: "main_limitation" }
          ],
          rows: [
            {
              design: "Randomised controlled trial",
              group_formation: "Investigator assigns groups",
              what_is_compared: "Treatment and control",
              main_limitation: "May not match routine care"
            }
          ]
        }
      },
      {
        material_id: "XM-M02-BROKEN",
        kind: "comparison_table",
        title: "Unnamed columns",
        body: {
          columns: [{ key: "design", label: "Design" }, { key: "column_2" }, { id: "c3" }],
          rows: [{ design: "Cohort", column_2: "Observed groups", c3: "Hidden cell" }]
        }
      }
    ])
  ]);
  const html = assertPreviewMatchesExport(page);
  const intact = materialHtml(html, "XM-M02");
  assert.match(intact, /<th scope="col">Design<\/th>/);
  assert.match(intact, /<th scope="col">Group formation<\/th>/);
  assert.match(intact, /<th scope="col">What is compared<\/th>/);
  assert.match(intact, /<th scope="col">Main limitation<\/th>/);
  assert.match(intact, /Investigator assigns groups/);
  assert.match(intact, /May not match routine care/);
  assert.doesNotMatch(intact, /Column\s+\d+/i);

  const broken = materialHtml(html, "XM-M02-BROKEN");
  assert.match(broken, /data-publication-failure="column_heading_unrecoverable"/);
  assert.doesNotMatch(broken, /<table\b/);
  assert.doesNotMatch(broken, /Column\s+\d+/i);
  assert.doesNotMatch(broken, /Hidden cell/);
});

test("legitimate educational tables remain intact", () => {
  const page = pageWith([
    section("S1", "Question to evidence", [
      {
        material_id: "XM-M01",
        kind: "comparison",
        title: "Question-to-evidence comparison",
        body: {
          branches: [
            {
              branch_id: "Intervention effect",
              research_purpose: "Compare a treatment with usual care",
              research_question: "Does physiotherapy improve mobility after knee replacement?",
              evidence_needed: "Comparative outcome evidence",
              methodological_implication: "Choose a design that can support that comparison"
            }
          ]
        }
      }
    ])
  ]);
  const html = assertPreviewMatchesExport(page);
  const block = materialHtml(html, "XM-M01");
  assert.match(block, /<table\b/);
  assert.match(block, /Research purpose/);
  assert.match(block, /Does physiotherapy improve mobility after knee replacement\?/);
  assert.match(block, /Comparative outcome evidence/);
  assert.match(block, /Choose a design that can support that comparison/);
  assert.match(block, /Intervention effect/);
  assert.doesNotMatch(block, /Branch id/i);
  assert.doesNotMatch(block, /data-publication-status="failed"/);
  assert.doesNotMatch(block, /Column\s+\d+/i);
});

test("concept-map instructions require Show labels and forbid unauthorised blank panels", () => {
  const brief = {
    purpose: "classification",
    preferred_representation: "concept_map",
    requires_exact_data_match: false,
    content_requirements: {
      authored: [
        "Comparative intervention and mobility-outcome evidence",
        "Observed rehabilitation participation and subsequent recovery evidence"
      ]
    },
    exclusion_requirements: { authored_must_not_show: [] },
    claim_constraints: {
      disallowed: ["PICO is mandatory for all clinical research."]
    }
  };
  const prompt = workspace.buildVisualJobHumanPrompt(brief);
  assert.match(prompt, /Concept-map labels:/);
  assert.match(prompt, /Comparative intervention and mobility-outcome evidence/);
  assert.match(
    prompt,
    /Every Show item above must appear as readable text on the image/
  );
  assert.match(prompt, /empty panels, blank boxes, unfilled frames/);
  assert.match(prompt, /PICO/);
  assert.match(prompt, /unless that wording is explicitly listed in Show/);
  assert.doesNotMatch(prompt, /leave labelled numeric result fields blank/);
  assert.equal(compiler.REPRESENTATION_TEMPLATES.concept_map.structural_guidance.some(function (line) {
    return /empty panels, blank boxes, unfilled frames/.test(line);
  }), true);
  assert.equal(compiler.REPRESENTATION_TEMPLATES.concept_map.structural_guidance.some(function (line) {
    return /required content item must appear as readable on-image text/.test(line);
  }), true);

  const processPrompt = workspace.buildVisualJobHumanPrompt({
    purpose: "mechanism",
    preferred_representation: "process",
    requires_exact_data_match: false,
    content_requirements: { authored: ["First stage", "Second stage"] },
    exclusion_requirements: { authored_must_not_show: [] },
    claim_constraints: { disallowed: [] }
  });
  assert.doesNotMatch(processPrompt, /Concept-map labels:/);
});
