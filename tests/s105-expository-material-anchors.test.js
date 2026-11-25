/**
 * Sprint 105 (S105-D03) — Optional block-level material anchors in Expository exposition.
 *
 * Covers:
 * - Valid interleaved exposition (framing -> evidence -> explanation -> synthesis)
 * - Multiple anchors in one section
 * - Mixed anchored + unanchored materials (no drops, no duplicates)
 * - Validation failures at XD capture, commission lock, and Expository assembly
 *   (unknown, material_id-instead-of-commission_id, malformed, cross-section, duplicate)
 * - Defensive rendering on malformed/legacy artefacts (no raw directive leakage,
 *   no duplicate/dropped materials, actionable diagnostics)
 * - Literal syntax preserved in fenced code blocks (``` and ~~~), inline code,
 *   blockquotes, and quoted prose
 * - Fulfilled visual affordances linked explicitly to anchored XM materials (inline,
 *   deduplicated), unfulfilled illustrations preserving accessible fallback, and
 *   unlinked section-level figures keeping existing section-end placement
 * - EQ8 terminal section consolidation (both unanchored and anchored)
 * - Publication parity across preview, standalone ZIP, and unified Learning Journey shell
 * - XD & XM prompt contract guidance
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fflate = require("fflate");

const anchors = require("../lib/expository-material-anchors.js");
const contracts = require("../lib/expository-contracts.js");
const assemble = require("../lib/page-vnext-assemble.js");
const siblingPrompts = require("../lib/expository-sibling-prompts.js");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext/render-learner-page.js");
const learnerPackage = require("../lib/learner-package.js");
const learnerPackageZip = require("../lib/learner-package-zip.js");
const ljPackage = require("../lib/learning-journey-learner-package.js");

const TINY_PNG_BYTES = Uint8Array.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
  0xde, 0x00, 0x00, 0x00, 0x0c, 0x49, 0x44, 0x41, 0x54, 0x08, 0xd7, 0x63, 0xf8, 0xcf, 0xc0, 0x00,
  0x00, 0x00, 0x03, 0x00, 0x01, 0x00, 0x05, 0xfe, 0xd4, 0xef, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45,
  0x4e, 0x44, 0xae, 0x42, 0x60, 0x82
]);
const TINY_PNG_DATA_URL =
  "data:image/png;base64," + Buffer.from(TINY_PNG_BYTES).toString("base64");

function makeScatterplotMaterial(id, commissionId, title, xLabel, yLabel, points) {
  return {
    material_id: id,
    commission_id: commissionId,
    section_id: "S2",
    kind: "Scatterplot with accessible paired-observation table",
    title: title,
    body: {
      title: title,
      scatterplot: {
        x_axis: { label: xLabel, minimum: 0, maximum: 10, tick_interval: 2 },
        y_axis: { label: yLabel, minimum: 0, maximum: 10, tick_interval: 2 },
        observations: points,
        point_style: { show_observation_labels: true },
        alternative_text: title + " scatterplot with paired data table."
      },
      accessible_table: {
        caption: title + " paired observations",
        columns: ["ID", xLabel, yLabel],
        rows: points.map((p) => [p.id, p.x, p.y]),
        row_header_column: 0
      }
    }
  };
}

function makeTableMaterial(id, commissionId, sectionId, title, caption, rows) {
  return {
    material_id: id,
    commission_id: commissionId,
    section_id: sectionId,
    kind: "Comparison table",
    title: title,
    body: {
      title: title,
      table: {
        caption: caption,
        columns: ["Relationship", "Correlation"],
        rows: rows
      }
    }
  };
}

function makeExpositoryPage(sections, extras) {
  return Object.assign(
    {
      artifact_type: "page",
      schema_version: "2.0.0",
      product_id: "expository",
      page_kind: "expository",
      title: "Anchored Expository Test Chapter",
      activities: [],
      sections: sections,
      page_synthesis: {},
      assembly_state: {
        current_stage: "design_page",
        enriched_by: [
          "expository_journey_plan",
          "expository_development",
          "expository_materials",
          "design_page"
        ]
      }
    },
    extras || {}
  );
}

test("1. Valid interleaved exposition and multiple anchors render in exact authored DOM order", () => {
  const page = makeExpositoryPage([
    {
      section_id: "S1",
      title: "Opening framing",
      exposition: "An opening framing paragraph.",
      materials: []
    },
    {
      section_id: "S2",
      title: "Inspecting and comparing evidence",
      exposition: [
        "Framing paragraph before the first scatterplot.",
        "",
        "[[material:C02_plot]]",
        "",
        "Interpretation paragraph examining the upward trend shown above.",
        "",
        "[[material:C02_summary]]",
        "",
        "Synthesis paragraph tying the evidence and comparison together."
      ].join("\n"),
      materials_commission: [
        { commission_id: "C02_plot", section_id: "S2", kind: "scatterplot", intent: "evidence", constraints: "" },
        { commission_id: "C02_summary", section_id: "S2", kind: "table", intent: "compare", constraints: "" }
      ],
      materials: [
        makeScatterplotMaterial("M01", "C02_plot", "First evidence plot", "X", "Y", [
          { id: "P1", x: 2, y: 3 },
          { id: "P2", x: 6, y: 7 }
        ]),
        makeTableMaterial("M02", "C02_summary", "S2", "Summary comparison", "Summary comparison caption", [
          ["Series A", "0.93"]
        ])
      ]
    },
    {
      section_id: "S3",
      title: "Consolidation",
      exposition: "Closing synthesis paragraph.",
      materials: []
    }
  ]);

  const rendered = renderLearnerPageHtml(page, { compositionMode: "moments" });
  assert.equal(rendered.error, null);
  assert.deepEqual(rendered.anchorDiagnostics, []);
  const html = String(rendered.html || "");

  assert.doesNotMatch(html, /\[\[material:/);
  const framingPos = html.indexOf("Framing paragraph before the first scatterplot.");
  const plotPos = html.indexOf('data-scatterplot-figure="true"');
  const interpPos = html.indexOf("Interpretation paragraph examining the upward trend shown above.");
  const tablePos = html.indexOf("Summary comparison caption");
  const synthPos = html.indexOf("Synthesis paragraph tying the evidence and comparison together.");
  assert.ok(
    framingPos > 0 &&
      plotPos > framingPos &&
      interpPos > plotPos &&
      tablePos > interpPos &&
      synthPos > tablePos,
    "Expected exact framing -> plot -> interpretation -> table -> synthesis DOM order"
  );
});

test("2. Mixed anchored and unanchored materials preserve every material without duplication", () => {
  const page = makeExpositoryPage([
    {
      section_id: "S1",
      title: "Mixed placement section",
      exposition: [
        "Introductory paragraph.",
        "",
        "[[material:C01_inline]]",
        "",
        "Follow-up explanation paragraph."
      ].join("\n"),
      materials_commission: [
        { commission_id: "C01_inline", section_id: "S1", kind: "table", intent: "inline", constraints: "" },
        { commission_id: "C01_trailing", section_id: "S1", kind: "table", intent: "trailing", constraints: "" }
      ],
      materials: [
        makeTableMaterial("M01", "C01_inline", "S1", "Inline table", "Inline caption", [["A", "1"]]),
        makeTableMaterial("M02", "C01_trailing", "S1", "Trailing table", "Trailing caption", [["B", "2"]])
      ]
    },
    {
      section_id: "S2",
      title: "Close",
      exposition: "Final close.",
      materials: []
    }
  ]);

  const rendered = renderLearnerPageHtml(page, { compositionMode: "moments" });
  assert.equal(rendered.error, null);
  const html = String(rendered.html || "");
  const introPos = html.indexOf("Introductory paragraph.");
  const inlinePos = html.indexOf("Inline caption");
  const followPos = html.indexOf("Follow-up explanation paragraph.");
  const trailingPos = html.indexOf("Trailing caption");
  assert.ok(introPos < inlinePos && inlinePos < followPos && followPos < trailingPos);
  assert.equal((html.match(/Inline caption/g) || []).length, 1);
  assert.equal((html.match(/Trailing caption/g) || []).length, 1);
});

test("3. XD capture, commission lock, and Expository assembly reject unknown, material_id, malformed, cross-section, and duplicate anchors", () => {
  const ejp = {
    artifact_type: "expository_journey_plan",
    title: "Anchor validation test",
    audience: "Introductory undergraduates",
    journey_intent: "Test validation",
    commissioned_purpose: "Test anchor rules",
    epistemic_form: "Comparative analysis",
    sections: [
      { section_id: "S1", title: "Section 1", purpose: "p1", knowledge_focus: "k1", conceptual_move: "m1", order: 1 },
      { section_id: "S2", title: "Section 2", purpose: "p2", knowledge_focus: "k2", conceptual_move: "m2", order: 2 }
    ]
  };

  // 3a. Unknown, malformed, cross-section, and duplicate anchors fail XD shape validation immediately.
  const badXd = {
    artifact_type: "expository_development",
    sections: [
      {
        section_id: "S1",
        explanation_intent: "Intent 1",
        exposition: [
          "Intro.",
          "[[material:C01]]",
          "Duplicate below:",
          "[[material:C01]]",
          "Cross-section below:",
          "[[material:C02]]",
          "Unknown below:",
          "[[material:C99]]",
          "Malformed below:",
          "[[material: bad id ]]"
        ].join("\n"),
        materials_commission: [
          { commission_id: "C01", section_id: "S1", kind: "table", intent: "i1", constraints: "" }
        ]
      },
      {
        section_id: "S2",
        explanation_intent: "Intent 2",
        exposition: "Section 2 prose.",
        materials_commission: [
          { commission_id: "C02", section_id: "S2", kind: "table", intent: "i2", constraints: "" }
        ]
      }
    ]
  };

  const xdShape = contracts.validateExpositoryArtefactShape(badXd, "expository_development");
  assert.equal(xdShape.ok, false);
  const joinedXdErrors = xdShape.errors.join("\n");
  assert.match(joinedXdErrors, /duplicate material anchor for commission_id "C01"/i);
  assert.match(joinedXdErrors, /material anchor "C02" belongs to section "S2", not "S1"/i);
  assert.match(joinedXdErrors, /unknown material anchor "C99"/i);
  assert.match(joinedXdErrors, /malformed material anchor directive/i);

  // 3b. material_id used instead of commission_id is explicitly rejected at assembly (no fallback).
  const xdUsingMaterialId = {
    artifact_type: "expository_development",
    sections: [
      {
        section_id: "S1",
        explanation_intent: "Intent 1",
        exposition: "Intro.\n\n[[material:M01]]\n\nAfter.",
        materials_commission: [
          { commission_id: "C01", section_id: "S1", kind: "table", intent: "i1", constraints: "" }
        ]
      },
      {
        section_id: "S2",
        explanation_intent: "Intent 2",
        exposition: "Close.",
        materials_commission: []
      }
    ]
  };
  const xm = {
    artifact_type: "expository_materials",
    materials: [
      makeTableMaterial("M01", "C01", "S1", "Table 1", "Table 1 caption", [["X", "1"]])
    ]
  };

  const lockCheck = contracts.validateCommissionLock(xdUsingMaterialId, xm);
  assert.equal(lockCheck.ok, false);
  assert.match(lockCheck.warnings.join("\n"), /commission_id, not material_id/i);

  assert.throws(
    () =>
      assemble.assembleVNextPageFromPartials({
        expository_journey_plan: ejp,
        expository_development: xdUsingMaterialId,
        expository_materials: xm
      }),
    /unknown material anchor "M01" does not match any commission_id in this section/i
  );

  const assembledBadCheck = assemble.validateAssembledPageForRender(
    makeExpositoryPage([
      {
        section_id: "S1",
        title: "Section 1",
        exposition: "Intro.\n\n[[material:M01]]\n\nAfter.",
        materials_commission: [
          { commission_id: "C01", section_id: "S1", kind: "table", intent: "i1", constraints: "" }
        ],
        materials: xm.materials
      }
    ])
  );
  assert.equal(assembledBadCheck.ok, false);
  assert.match(assembledBadCheck.errors.join("\n"), /commission_id, not material_id/i);
});

test("4. Defensive rendering strips unresolved/malformed/duplicate directives, preserves materials, and reports actionable diagnostics", () => {
  const malformedPage = makeExpositoryPage([
    {
      section_id: "S1",
      title: "Legacy imported section",
      exposition: [
        "Opening prose.",
        "",
        "[[material:C01]]",
        "",
        "Middle prose with duplicate:",
        "",
        "[[material:C01]]",
        "",
        "Wrong material_id binding:",
        "",
        "[[material:M02]]",
        "",
        "Malformed directive:",
        "",
        "[[material:]]",
        "",
        "Closing prose."
      ].join("\n"),
      materials: [
        makeTableMaterial("M01", "C01", "S1", "First table", "First caption", [["A", "1"]]),
        makeTableMaterial("M02", "C02", "S1", "Second table", "Second caption", [["B", "2"]])
      ]
    },
    {
      section_id: "S2",
      title: "Final section",
      exposition: "Final section close.",
      materials: []
    }
  ]);

  const rendered = renderLearnerPageHtml(malformedPage, { compositionMode: "moments" });
  assert.equal(rendered.error, null);
  const html = String(rendered.html || "");

  // Zero raw directive leakage into learner HTML
  assert.doesNotMatch(html, /\[\[material:/i);
  // M01 rendered exactly once inline; M02 not bound by material_id so appended cleanly (never dropped!)
  assert.equal((html.match(/First caption/g) || []).length, 1);
  assert.equal((html.match(/Second caption/g) || []).length, 1);
  assert.ok(html.indexOf("Closing prose.") < html.indexOf("Second caption"));

  // Actionable diagnostics emitted in both anchorDiagnostics and modelResult.warnings
  const codes = rendered.anchorDiagnostics.map((d) => d.code);
  assert.ok(codes.includes("EXPOSITORY_ANCHOR_DUPLICATE_IGNORED"));
  assert.ok(codes.includes("EXPOSITORY_ANCHOR_UNRESOLVED"));
  assert.ok(codes.includes("EXPOSITORY_ANCHOR_MALFORMED"));
  const unresolvedDiag = rendered.anchorDiagnostics.find(
    (d) => d.code === "EXPOSITORY_ANCHOR_UNRESOLVED"
  );
  assert.match(unresolvedDiag.message, /commission_id, not material_id/i);
  assert.ok(
    rendered.modelResult.warnings.some((w) => w.code === "EXPOSITORY_ANCHOR_UNRESOLVED"),
    "Diagnostics must also surface in modelResult.warnings"
  );
});

test("5. Literal anchor syntax inside code fences, inline code, blockquotes, and quoted prose is preserved verbatim", () => {
  const exposition = [
    'In documentation you might quote "[[material:C99]]" or write `[[material:C99]]` inline.',
    "",
    "> [[material:C99]]",
    "",
    "```markdown",
    "[[material:C99]]",
    "[[material:]]",
    "```",
    "",
    "~~~text",
    "[[material:C99]]",
    "~~~",
    "",
    "Real anchor below:",
    "",
    "[[material:C01]]",
    "",
    "Explanation after the real anchor."
  ].join("\n");

  const parsed = anchors.parseExpositionSegments(exposition);
  assert.equal(parsed.anchors.length, 1);
  assert.equal(parsed.anchors[0].commissionId, "C01");
  assert.equal(parsed.malformed.length, 0);

  // stripMaterialAnchorDirectives removes only the real standalone directive, preserving code/quotes
  const stripped = anchors.stripMaterialAnchorDirectives(exposition);
  assert.match(stripped, /```markdown\n\[\[material:C99\]\]\n\[\[material:\]\]\n```/);
  assert.match(stripped, /`\[\[material:C99\]\]`/);
  assert.match(stripped, /> \[\[material:C99\]\]/);
  assert.doesNotMatch(stripped, /\[\[material:C01\]\]/);

  const page = makeExpositoryPage([
    {
      section_id: "S1",
      title: "Code and quotes",
      exposition: exposition,
      materials_commission: [
        { commission_id: "C01", section_id: "S1", kind: "table", intent: "real", constraints: "" }
      ],
      materials: [
        makeTableMaterial("M01", "C01", "S1", "Real table", "Real table caption", [["R", "1"]])
      ]
    },
    {
      section_id: "S2",
      title: "End",
      exposition: "Final close.",
      materials: []
    }
  ]);

  const rendered = renderLearnerPageHtml(page, { compositionMode: "moments" });
  assert.equal(rendered.error, null);
  assert.deepEqual(rendered.anchorDiagnostics, []);
  const html = String(rendered.html || "");
  assert.match(html, /<code>\[\[material:C99\]\]<\/code>/);
  assert.match(html, /markdown \[\[material:C99\]\] \[\[material:\]\]/);
  assert.match(html, /~~~text \[\[material:C99\]\] ~~~/);
  assert.doesNotMatch(html, /\[\[material:C01\]\]/);
  assert.ok(html.indexOf("Real anchor below:") < html.indexOf("Real table caption"));
  assert.ok(html.indexOf("Real table caption") < html.indexOf("Explanation after the real anchor."));
});

test("6. Fulfilled linked visual affordance renders inline without duplication, unfulfilled illustration preserves fallback, and unlinked section figure stays at section end", () => {
  const page = makeExpositoryPage(
    [
      {
        section_id: "S3",
        title: "Visual affordance ownership",
        exposition: [
          "Framing before the fulfilled correlation scale.",
          "",
          "[[material:C03_scale]]",
          "",
          "Explanation interpreting the fulfilled scale above, before an unfulfilled diagram.",
          "",
          "[[material:C03_pending]]",
          "",
          "Closing paragraph after both illustrations."
        ].join("\n"),
        materials_commission: [
          { commission_id: "C03_scale", section_id: "S3", kind: "Annotated number line", intent: "scale", constraints: "" },
          { commission_id: "C03_pending", section_id: "S3", kind: "Annotated diagram", intent: "pending", constraints: "" }
        ],
        materials: [
          {
            material_id: "M02",
            commission_id: "C03_scale",
            section_id: "S3",
            kind: "Annotated correlation scale",
            title: "Interpreting the Pearson correlation coefficient",
            body: {
              title: "Interpreting the Pearson correlation coefficient",
              representation: "number_line",
              start: -1,
              end: 1,
              ticks: [-1, 0, 1],
              caption: "Direction depends on sign; strength depends on distance from zero.",
              accessible_text_equivalent: "Horizontal scale from -1 to +1 with 0.93 marked near +1."
            }
          },
          {
            material_id: "M03",
            commission_id: "C03_pending",
            section_id: "S3",
            kind: "Annotated diagram",
            title: "Pending causal pathway diagram",
            body: {
              title: "Pending causal pathway diagram",
              diagram: {
                representation: "causal_diagram",
                layout: "left-to-right",
                elements: ["Shared third factor", "Variable A", "Variable B"],
                legend: "Arrows indicate causal direction"
              },
              caption: "Causal pathways remain distinct from correlation.",
              accessible_text_equivalent: "Two variables may co-vary because of a shared third factor."
            }
          }
        ]
      },
      {
        section_id: "S4",
        title: "Close",
        exposition: "Final close.",
        materials: []
      }
    ],
    {
      visual_affordance_schema_version: "38.4",
      activities_visual_review: [],
      visual_affordances: [
        {
          affordance_id: "va-s3-unlinked-overview",
          scope: "section",
          section_id: "S3",
          visual_decision: "generate",
          visual_slot: "section-after-content",
          tier: "valuable",
          purpose: "synthesis",
          preferred_representation: "comparison_framework",
          subject: "Section-level unlinked summary visual",
          context: "Visual brief: section overview.",
          evidence_anchors: ["S3.purpose"],
          rationale: "Section-level summary graphic.",
          reasoning_supported: "Section overview.",
          learner_stage: "post_reasoning",
          anti_spoiler: false,
          representation_avoid: ["generic_infographic"],
          canonical_discipline_note: "Summary only.",
          requires_exact_data_match: false,
          must_show: ["Summary"],
          must_not_show: ["Spoilers"],
          allowed_claims: ["Summary."],
          disallowed_claims: ["Causation."],
          source_basis: "S3.purpose",
          caption_intent: "Unlinked section-level figure caption.",
          alt_text: "Section summary figure.",
          detailed_description: "Summarises the section concepts cleanly.",
          discipline_risk_level: "low"
        },
        {
          affordance_id: "va-s3-scale",
          scope: "section",
          section_id: "S3",
          visual_decision: "generate",
          visual_slot: "section-after-content",
          tier: "essential",
          purpose: "data_pattern_reading",
          preferred_representation: "number_line_segments",
          subject: "Pearson correlation scale",
          context: "Visual brief: -1 to +1 scale.",
          evidence_anchors: ["S3.materials.M02"],
          rationale: "Makes sign and magnitude inspectable.",
          reasoning_supported: "Reading correlation scale.",
          learner_stage: "post_reasoning",
          anti_spoiler: false,
          representation_avoid: ["generic_infographic"],
          canonical_discipline_note: "Exact ticks.",
          requires_exact_data_match: true,
          must_show: ["-1", "0", "+1", "0.93"],
          must_not_show: ["Coloured bands"],
          allowed_claims: ["0.93 is strong positive."],
          disallowed_claims: ["Causation."],
          source_basis: "S3.materials.M02",
          caption_intent: "Inline fulfilled scale figure caption.",
          alt_text: "Pearson correlation scale from -1 to +1.",
          detailed_description: "Shows 0.93 near +1 on the correlation scale.",
          discipline_risk_level: "high"
        },
        {
          affordance_id: "va-s3-pending",
          scope: "section",
          section_id: "S3",
          visual_decision: "generate",
          visual_slot: "section-after-content",
          tier: "essential",
          purpose: "mechanism",
          preferred_representation: "causal_model",
          subject: "Pending causal pathway diagram",
          context: "Visual brief: causal pathway.",
          evidence_anchors: ["S3.materials.M03"],
          rationale: "Illustrates confounding.",
          reasoning_supported: "Distinguishing correlation from causation.",
          learner_stage: "post_reasoning",
          anti_spoiler: false,
          representation_avoid: ["generic_infographic"],
          canonical_discipline_note: "Confounder.",
          requires_exact_data_match: false,
          must_show: ["Confounder"],
          must_not_show: ["Causal arrow from A to B"],
          allowed_claims: ["Shared third factor."],
          disallowed_claims: ["A causes B."],
          source_basis: "S3.materials.M03",
          caption_intent: "Pending diagram caption.",
          alt_text: "Causal pathway diagram.",
          detailed_description: "A shared third factor can generate association.",
          discipline_risk_level: "medium"
        }
      ]
    }
  );

  const attachedAssets = [
    {
      affordance_id: "va-s3-scale",
      scope: "section",
      section_id: "S3",
      visual_slot: "section-after-content",
      mime_type: "image/png",
      caption_intent: "Inline fulfilled scale figure caption.",
      alt_text: "Pearson correlation scale from -1 to +1.",
      detailed_description: "Shows 0.93 near +1 on the correlation scale.",
      render_source: { kind: "data_url", value: TINY_PNG_DATA_URL }
    },
    {
      affordance_id: "va-s3-unlinked-overview",
      scope: "section",
      section_id: "S3",
      visual_slot: "section-after-content",
      mime_type: "image/png",
      caption_intent: "Unlinked section-level figure caption.",
      alt_text: "Section summary figure.",
      detailed_description: "Summarises the section concepts cleanly.",
      render_source: { kind: "data_url", value: TINY_PNG_DATA_URL }
    }
  ];

  const rendered = renderLearnerPageHtml(page, {
    compositionMode: "moments",
    visualAssets: { assets: attachedAssets }
  });
  assert.equal(rendered.error, null);
  const html = String(rendered.html || "");

  // Fulfilled scale figure appears inline at C03_scale (before middle explanation), exactly once!
  const framingPos = html.indexOf("Framing before the fulfilled correlation scale.");
  const scaleFigPos = html.indexOf("Inline fulfilled scale figure caption.");
  const middlePos = html.indexOf("Explanation interpreting the fulfilled scale above");
  const pendingFallbackPos = html.indexOf("Two variables may co-vary because of a shared third factor.");
  const closingPos = html.indexOf("Closing paragraph after both illustrations.");
  const unlinkedFigPos = html.indexOf("Unlinked section-level figure caption.");

  assert.ok(
    framingPos > 0 &&
      scaleFigPos > framingPos &&
      middlePos > scaleFigPos &&
      pendingFallbackPos > middlePos &&
      closingPos > pendingFallbackPos &&
      unlinkedFigPos > closingPos,
    "Expected inline fulfilled figure -> middle prose -> inline unfulfilled fallback -> closing prose -> unlinked section-end figure; got " +
      JSON.stringify({
        framingPos,
        scaleFigPos,
        middlePos,
        pendingFallbackPos,
        closingPos,
        unlinkedFigPos
      })
  );
  // Strict deduplication & sequential figure numbering matching reading order
  assert.equal((html.match(/Inline fulfilled scale figure caption\./g) || []).length, 1);
  assert.equal((html.match(/Unlinked section-level figure caption\./g) || []).length, 1);
  assert.match(html, /<strong>Figure 1\.<\/strong> Inline fulfilled scale figure caption\./);
  assert.match(html, /<strong>Figure 2\.<\/strong> Unlinked section-level figure caption\./);
  // Pending illustration M03 stays unfulfilled (not suppressed by M02's attached figure!)
  assert.match(html, /data-material-id="M03"[^>]*data-illustration-status="unfulfilled"/);
});

test("7. EQ8 terminal section preserves terminal consolidating close for both anchored and unanchored materials", () => {
  const page = makeExpositoryPage([
    {
      section_id: "S1",
      title: "First section",
      exposition: "First section prose.",
      materials: []
    },
    {
      section_id: "S2",
      title: "Putting the evidence together",
      exposition: [
        "Before the summary table, review the overall pattern.",
        "",
        "[[material:C02_anchored]]",
        "",
        "This final consolidating paragraph closes the chapter cleanly."
      ].join("\n"),
      materials_commission: [
        { commission_id: "C02_anchored", section_id: "S2", kind: "table", intent: "inline", constraints: "" },
        { commission_id: "C02_unanchored", section_id: "S2", kind: "table", intent: "extra", constraints: "" }
      ],
      materials: [
        makeTableMaterial("M01", "C02_anchored", "S2", "Anchored summary", "Anchored summary caption", [["A", "0.93"]]),
        makeTableMaterial("M02", "C02_unanchored", "S2", "Unanchored table", "Unanchored table caption", [["B", "-0.94"]])
      ]
    }
  ]);

  const rendered = renderLearnerPageHtml(page, { compositionMode: "moments" });
  assert.equal(rendered.error, null);
  const html = String(rendered.html || "");
  const s2Start = html.indexOf('id="exposition-S2"');
  const s2 = html.slice(s2Start);

  const leadPos = s2.indexOf("Before the summary table, review the overall pattern.");
  const anchoredPos = s2.indexOf("Anchored summary caption");
  const unanchoredPos = s2.indexOf("Unanchored table caption");
  const closePos = s2.indexOf("This final consolidating paragraph closes the chapter cleanly.");

  assert.ok(
    leadPos > 0 && anchoredPos > leadPos && unanchoredPos > anchoredPos && closePos > unanchoredPos,
    "Terminal section must keep both anchored and unanchored materials before the final consolidating prose"
  );
  assert.match(
    s2,
    /data-expository-closure="terminal">[\s\S]*This final consolidating paragraph closes the chapter cleanly\./
  );
});

test("8. Preview, standalone ZIP, and unified Learning Journey shell preserve anchored inline placement parity", () => {
  const page = makeExpositoryPage([
    {
      section_id: "S1",
      title: "Interleaved economic evidence",
      exposition: [
        "Examine the plot below before reading the interpretation.",
        "",
        "[[material:C01_plot]]",
        "",
        "The points rise steadily from left to right."
      ].join("\n"),
      materials_commission: [
        { commission_id: "C01_plot", section_id: "S1", kind: "scatterplot", intent: "evidence", constraints: "" }
      ],
      materials: [
        makeScatterplotMaterial("M01", "C01_plot", "Regional data", "Investment", "Growth", [
          { id: "R1", x: 2, y: 2 },
          { id: "R2", x: 8, y: 8 }
        ])
      ]
    },
    {
      section_id: "S2",
      title: "Conclusion",
      exposition: "Chapter consolidation.",
      materials: []
    }
  ]);

  function assertOrder(html, label) {
    assert.doesNotMatch(html, /\[\[material:/, label + ": no raw directive");
    const pre = html.indexOf("Examine the plot below before reading the interpretation.");
    const plot = html.indexOf('data-scatterplot-figure="true"');
    const post = html.indexOf("The points rise steadily from left to right.");
    assert.ok(pre > 0 && plot > pre && post > plot, label + ": framing -> plot -> interpretation");
  }

  // Preview
  const rendered = renderLearnerPageHtml(page, { compositionMode: "moments" });
  assert.equal(rendered.error, null);
  const previewHtml = String(rendered.html || "");
  assertOrder(previewHtml, "preview");

  // Standalone ZIP
  const built = learnerPackage.buildLearnerPackage({
    html: previewHtml,
    title: "Anchored Expository Test Chapter"
  });
  assert.equal(built.ok, true);
  const zipped = learnerPackageZip.serializeLearnerPackageToZip(built.package);
  assert.equal(zipped.ok, true);
  const zipEntries = fflate.unzipSync(zipped.bytes);
  const zipHtml = fflate.strFromU8(zipEntries["learner-page.html"]);
  assertOrder(zipHtml, "standalone-zip");

  // Unified Learning Journey shell
  const ljPage = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "learning_journey",
    page_kind: "learning_journey",
    title: "Economics Journey",
    activities: [],
    sections: [
      { section_id: "journey_intro", title: "Introduction", exposition: "Journey intro." },
      { section_id: "S1", title: "Reading data", exposition: "First component." }
    ],
    commissions: [
      {
        commission_id: "C1",
        section_id: "S1",
        product_id: "expository",
        title: "Anchored Expository Test Chapter",
        allocated_minutes: 10
      }
    ]
  };
  const unified = ljPackage.assembleLearningJourneyUnifiedShellPackage({
    page: ljPage,
    constituents: [
      {
        commissionId: "C1",
        productId: "expository",
        title: "Anchored Expository Test Chapter",
        fragmentHtml: previewHtml
      }
    ],
    fflate
  });
  assert.equal(unified.ok, true, JSON.stringify(unified.error || {}));
  const unifiedFiles = fflate.unzipSync(unified.bytes);
  const unifiedHtml = fflate.strFromU8(unifiedFiles["index.html"]);
  assertOrder(unifiedHtml, "unified-learning-journey");
});

test("9. XD and XM sibling prompts document optional commission_id anchoring without unnecessary fragmentation or Interactive reveal semantics", () => {
  const xd = siblingPrompts.resolveTemplate("expository_development");
  const xm = siblingPrompts.resolveTemplate("expository_materials");
  assert.match(xd, /\[\[material:<commission_id>\]\]/);
  assert.match(xd, /Bind exclusively to an authoritative `commission_id` in that same section/i);
  assert.match(xd, /do not fragment an otherwise coherent material unnecessarily/i);
  assert.match(xd, /do not introduce interactive reveal mechanisms or Practice semantics/i);
  assert.match(xm, /Preserve XD's exposition and material anchor placement untouched/i);
});
