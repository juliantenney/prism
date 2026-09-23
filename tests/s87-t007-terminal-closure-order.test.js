/**
 * S87-T-007 repair 2 — terminal closure displacement.
 *
 * Final Expository section: supporting materials/figures must participate
 * before the single XD-owned consolidating exposition (EQ8), not displace it.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  renderLearnerPageHtml
} = require("../lib/learner-renderer-vnext/render-learner-page.js");

const CLOSE_MARKER = "XD-TERMINAL-CLOSE-UNIQUE-91";
const MAT_A = "SUPPORT-MAT-A-UNIQUE";
const MAT_B = "SUPPORT-MAT-B-UNIQUE";
const EARLY_PROSE = "EARLY-SECTION-PROSE-UNIQUE";
const EARLY_MAT = "EARLY-SECTION-MAT-UNIQUE";

function sectionVa(sectionId, affordanceId) {
  return {
    affordance_id: affordanceId,
    scope: "section",
    section_id: sectionId,
    rationale: "Final-section representation supports the consolidating move.",
    subject: "Terminal synthesis figure",
    context: "C01/C05-class final section figure.",
    evidence_anchors: [sectionId + ".exposition"],
    visual_decision: "generate",
    visual_slot: "section-after-content",
    tier: "essential",
    purpose: "synthesis",
    preferred_representation: "diagram",
    reasoning_supported: "Make the closing relation perceptible.",
    learner_stage: "post_reasoning",
    anti_spoiler: false,
    representation_avoid: ["topic_hero_image"],
    canonical_discipline_note: "Do not invent extra stages.",
    requires_exact_data_match: false,
    must_show: ["closing relation"],
    must_not_show: ["new mechanism"],
    allowed_claims: ["The figure supports consolidation."],
    disallowed_claims: ["The figure replaces the written close."],
    source_basis: sectionId,
    caption_intent: "Support the consolidating close.",
    alt_text: "A compact diagram supporting the final consolidation.",
    detailed_description:
      "FIGURE-BODY-" + affordanceId + " shows the consolidating relation without replacing authorial prose.",
    discipline_risk_level: "low"
  };
}

function expositoryPage(overrides) {
  const base = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Terminal closure fixture",
    activities: [],
    sections: [],
    page_synthesis: {},
    visual_affordance_schema_version: "38.4",
    visual_affordances: [],
    expository_journey: {
      commissioned_purpose: "consolidate understanding",
      epistemic_form: "explanatory consolidation"
    },
    assembly_state: {
      current_stage: "expository_materials",
      enriched_by: [
        "expository_journey_plan",
        "expository_development",
        "expository_materials",
        "design_page"
      ]
    }
  };
  return Object.assign(base, overrides || {});
}

function extractSectionHtml(pageHtml, sectionId) {
  const parts = String(pageHtml || "").split('<section class="util-exposition-section"');
  for (let i = 1; i < parts.length; i += 1) {
    const chunk = '<section class="util-exposition-section"' + parts[i];
    const end = chunk.indexOf("</section>");
    const block = end >= 0 ? chunk.slice(0, end + "</section>".length) : chunk;
    if (
      block.includes('data-section-id="' + sectionId + '"') &&
      block.includes('data-region-item="exposition-section"')
    ) {
      return block;
    }
  }
  return "";
}

/** Last substantive learner marker inside a section (ignore hidden expand dialogs). */
function lastSubstantiveMarker(sectionHtml, markers) {
  let last = null;
  let lastIdx = -1;
  markers.forEach((marker) => {
    const idx = sectionHtml.lastIndexOf(marker);
    if (idx > lastIdx) {
      lastIdx = idx;
      last = marker;
    }
  });
  return last;
}

function assertOrder(sectionHtml, earlier, later) {
  const a = sectionHtml.indexOf(earlier);
  const b = sectionHtml.indexOf(later);
  assert.ok(a >= 0, "missing earlier marker: " + earlier);
  assert.ok(b >= 0, "missing later marker: " + later);
  assert.ok(a < b, "expected " + earlier + " before " + later);
}

test("1. final section exposition + material + figure: close is terminal; content preserved", () => {
  const page = expositoryPage({
    sections: [
      {
        section_id: "S1",
        title: "Earlier move",
        exposition: EARLY_PROSE,
        materials: [{ material_id: "m-early", kind: "text", body: EARLY_MAT }]
      },
      {
        section_id: "S8",
        title: "Consolidation",
        exposition: CLOSE_MARKER + " consolidates the Bayes update for the learner.",
        materials: [
          {
            material_id: "XM-MAT-S8-01",
            kind: "comparison table",
            body: {
              title: "Closing comparison",
              columns: [
                { key: "q", label: "Quantity" },
                { key: "v", label: "Value" }
              ],
              rows: [{ q: MAT_A, v: "posterior shift" }]
            }
          }
        ]
      }
    ],
    visual_affordances: [sectionVa("S8", "va-S8-final")]
  });

  const html = String(renderLearnerPageHtml(page).html || "");
  const s8 = extractSectionHtml(html, "S8");
  assert.match(s8, /data-expository-section-role="terminal-close"/);
  assert.match(s8, /data-expository-closure="terminal"/);
  assert.match(s8, new RegExp(CLOSE_MARKER));
  assert.match(s8, new RegExp(MAT_A));
  assert.match(s8, /va-S8-final|FIGURE-BODY-va-S8-final|data-affordance-id="va-S8-final"/);
  assert.equal(
    lastSubstantiveMarker(s8, [CLOSE_MARKER, MAT_A, "va-S8-final", "FIGURE-BODY-va-S8-final"]),
    CLOSE_MARKER
  );
  assertOrder(s8, MAT_A, CLOSE_MARKER);
  assert.doesNotMatch(html, /data-region="page-closing"/);
  assert.doesNotMatch(html, /closing_paragraph/i);
});

test("2. final section exposition + material only: close terminal", () => {
  const page = expositoryPage({
    sections: [
      {
        section_id: "S1",
        title: "Open",
        exposition: "Opening prose."
      },
      {
        section_id: "S5",
        title: "Close",
        exposition: CLOSE_MARKER + " is the authorial consolidation.",
        materials: [
          {
            material_id: "m1",
            kind: "text",
            body: MAT_A + " supporting synthesis note."
          }
        ]
      }
    ]
  });
  const s5 = extractSectionHtml(String(renderLearnerPageHtml(page).html || ""), "S5");
  assertOrder(s5, MAT_A, CLOSE_MARKER);
  assert.equal(lastSubstantiveMarker(s5, [CLOSE_MARKER, MAT_A]), CLOSE_MARKER);
});

test("3. final section exposition + figure only: close terminal", () => {
  const page = expositoryPage({
    sections: [
      {
        section_id: "S1",
        title: "Open",
        exposition: "Opening prose."
      },
      {
        section_id: "S5",
        title: "Close",
        exposition: CLOSE_MARKER + " remains the written close."
      }
    ],
    visual_affordances: [sectionVa("S5", "va-S5-only")]
  });
  const s5 = extractSectionHtml(String(renderLearnerPageHtml(page).html || ""), "S5");
  assert.match(s5, /va-S5-only|FIGURE-BODY-va-S5-only/);
  assert.equal(
    lastSubstantiveMarker(s5, [CLOSE_MARKER, "va-S5-only", "FIGURE-BODY-va-S5-only"]),
    CLOSE_MARKER
  );
});

test("4. final section exposition only: unchanged, no duplication", () => {
  const page = expositoryPage({
    sections: [
      { section_id: "S1", title: "Open", exposition: "Open." },
      {
        section_id: "S2",
        title: "Close",
        exposition: CLOSE_MARKER + " alone."
      }
    ]
  });
  const html = String(renderLearnerPageHtml(page).html || "");
  const s2 = extractSectionHtml(html, "S2");
  assert.match(s2, /data-expository-closure="terminal"/);
  assert.equal(html.split(CLOSE_MARKER).length - 1, 1);
  assert.doesNotMatch(s2, /data-region="exposition-materials"/);
  assert.doesNotMatch(html, /data-region="page-closing"/);
});

test("5. earlier section with material/figure: existing ordering unchanged", () => {
  const page = expositoryPage({
    sections: [
      {
        section_id: "S2",
        title: "Mechanism",
        exposition: EARLY_PROSE,
        materials: [{ material_id: "m-early", kind: "text", body: EARLY_MAT }]
      },
      {
        section_id: "S8",
        title: "Close",
        exposition: CLOSE_MARKER,
        materials: [{ material_id: "m-final", kind: "text", body: MAT_A }]
      }
    ],
    visual_affordances: [
      sectionVa("S2", "va-S2-early"),
      sectionVa("S8", "va-S8-final")
    ]
  });
  const html = String(renderLearnerPageHtml(page).html || "");
  const s2 = extractSectionHtml(html, "S2");
  assert.doesNotMatch(s2, /data-expository-section-role="terminal-close"/);
  // Earlier sections keep prose → materials → figure
  assertOrder(s2, EARLY_PROSE, EARLY_MAT);
  assertOrder(s2, EARLY_MAT, "va-S2-early");
});

test("6. multiple final-section materials/figures: all preserved before terminal close", () => {
  const page = expositoryPage({
    sections: [
      { section_id: "S1", title: "Open", exposition: "Open." },
      {
        section_id: "S5",
        title: "Close",
        exposition: CLOSE_MARKER + " ends the resource.",
        materials: [
          { material_id: "m1", kind: "text", body: MAT_A },
          {
            material_id: "m2",
            kind: "comparison table",
            body: {
              title: "Closing table",
              columns: [
                { key: "a", label: "A" },
                { key: "b", label: "B" }
              ],
              rows: [{ a: MAT_B, b: "principle" }]
            }
          }
        ]
      }
    ],
    visual_affordances: [sectionVa("S5", "va-S5-multi")]
  });
  const s5 = extractSectionHtml(String(renderLearnerPageHtml(page).html || ""), "S5");
  assert.match(s5, new RegExp(MAT_A));
  assert.match(s5, new RegExp(MAT_B));
  assert.match(s5, /va-S5-multi|FIGURE-BODY-va-S5-multi/);
  assertOrder(s5, MAT_A, CLOSE_MARKER);
  assertOrder(s5, MAT_B, CLOSE_MARKER);
  assert.equal(
    lastSubstantiveMarker(s5, [CLOSE_MARKER, MAT_A, MAT_B, "FIGURE-BODY-va-S5-multi"]),
    CLOSE_MARKER
  );
});

test("7. no DP closing_paragraph resurrection", () => {
  const assemble = require("../lib/page-vnext-assemble.js");
  const contracts = require("../lib/expository-contracts.js");
  const ejp = contracts.normalizeExpositoryJourneyPlan({
    title: "Closure ownership",
    audience: "learners",
    journey_intent: "Close once.",
    commissioned_purpose: "consolidate once at the end",
    epistemic_form: "explanatory consolidation",
    learning_outcomes: [{ id: "LO1", statement: "Close once." }],
    sections: [
      {
        section_id: "S1",
        title: "Open",
        purpose: "Open",
        knowledge_focus: "open",
        conceptual_move: "establish"
      },
      {
        section_id: "S2",
        title: "Close",
        purpose: "Consolidate",
        knowledge_focus: "close",
        conceptual_move: "consolidate"
      }
    ]
  });
  const xd = contracts.normalizeExpositoryDevelopment({
    sections: [
      { section_id: "S1", explanation_intent: "Open.", exposition: "Opening prose." },
      {
        section_id: "S2",
        explanation_intent: "Consolidate.",
        exposition: CLOSE_MARKER + " is the only authorial close."
      }
    ]
  });
  const assembled = assemble.assembleVNextPageFromPartials({
    expository_journey_plan: ejp,
    expository_development: xd,
    design_page: {
      artifact_type: "page",
      schema_version: "2.0.0",
      title: "Closure ownership",
      page_synthesis: {
        closing_paragraph: "RESURRECTED-DP-CLOSE must not appear."
      },
      assembly_state: { current_stage: "design_page", enriched_by: ["design_page"] }
    }
  });
  assert.equal(assembled.ok, true);
  assert.equal(assembled.page.page_synthesis.closing_paragraph, undefined);
  const html = String(renderLearnerPageHtml(assembled.page).html || "");
  assert.doesNotMatch(html, /RESURRECTED-DP-CLOSE/);
  assert.doesNotMatch(html, /data-region="page-closing"/);
  assert.equal(html.split(CLOSE_MARKER).length - 1, 1);
  assert.match(html, /data-expository-closure="terminal"/);
});

test("8. no duplicate authorial close", () => {
  const page = expositoryPage({
    sections: [
      { section_id: "S1", title: "Open", exposition: "Open." },
      {
        section_id: "S2",
        title: "Close",
        exposition: CLOSE_MARKER,
        materials: [{ material_id: "m1", kind: "text", body: MAT_A }]
      }
    ]
  });
  const html = String(renderLearnerPageHtml(page).html || "");
  assert.equal(html.split(CLOSE_MARKER).length - 1, 1);
  assert.equal(html.split('data-expository-closure="terminal"').length - 1, 1);
  assert.equal(html.split('data-expository-section-role="terminal-close"').length - 1, 1);
});

test("9. empty/optional supporting content remains safe", () => {
  const page = expositoryPage({
    sections: [
      {
        section_id: "S1",
        title: "Open",
        exposition: "Open.",
        materials: []
      },
      {
        section_id: "S2",
        title: "Close",
        exposition: CLOSE_MARKER,
        materials: []
      }
    ],
    visual_affordances: []
  });
  const html = String(renderLearnerPageHtml(page).html || "");
  const s2 = extractSectionHtml(html, "S2");
  assert.match(s2, new RegExp(CLOSE_MARKER));
  assert.doesNotMatch(s2, /data-region="exposition-materials"/);
  assert.doesNotMatch(html, /Structured material body is not supported/);
});

test("10. Interactive ordering unchanged", () => {
  const interactive = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "fixtures", "page-render", "roman-roads-page.json"),
      "utf8"
    )
  );
  const before = String(renderLearnerPageHtml(interactive).html || "");
  assert.match(before, /data-region="activities"/);
  assert.doesNotMatch(before, /data-region="exposition"/);
  assert.doesNotMatch(before, /data-expository-closure=/);
  assert.doesNotMatch(before, /data-page-kind="expository"/);
});
