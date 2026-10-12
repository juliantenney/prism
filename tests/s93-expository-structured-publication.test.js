/**
 * Expository structured-material publication repair.
 *
 * Representation specifications must not become generic learner tables.
 * Educational comparison, timeline order, and text equivalents stay readable.
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const { buildPageModel } = require("../lib/learner-renderer-vnext/build-page-model.js");
const {
  renderLearnerPageHtml
} = require("../lib/learner-renderer-vnext/render-learner-page.js");

const SPEC_HEADINGS = [
  "Timeline elements",
  "Temporal structure",
  "Investigation direction",
  "Compact visual label",
  "Interpretive annotations",
  "Representation type",
  "Central concept",
  "Branches",
  "Central synthesis",
  "Accessible text equivalent",
  "Relationship label",
  "Time axis"
];

function pageWithSection(section) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Choosing a Clinical Study Design: Questions, Evidence and Trade-offs",
    activities: [],
    sections: [section],
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

function renderSection(section) {
  const page = pageWithSection(section);
  const model = buildPageModel(page);
  assert.equal(model.ok, true, JSON.stringify(model.errors || []));
  const html = String(renderLearnerPageHtml(page).html || "");
  return { html, materials: model.model.expositionSections[0].materials };
}

function article(html, materialId) {
  const marker = 'data-material-id="' + materialId + '"';
  const start = html.indexOf(marker);
  assert.notEqual(start, -1, "missing material " + materialId);
  const open = html.lastIndexOf("<article", start);
  const end = html.indexOf("</article>", start);
  assert.ok(open !== -1 && end !== -1);
  return html.slice(open, end + "</article>".length);
}

function visible(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function assertSpecChromeAbsent(fragment) {
  SPEC_HEADINGS.forEach((label) => {
    assert.equal(
      fragment.includes(">" + label + "<"),
      false,
      "spec label rendered as markup: " + label
    );
  });
  assert.doesNotMatch(fragment, /Position:\s*\d+/);
  assert.doesNotMatch(fragment, /Label:\s*/);
  assert.doesNotMatch(fragment, /Description:\s*/);
}

test("structured representation does not publish specification fields as a generic table", () => {
  const { html, materials } = renderSection({
    section_id: "S-map",
    title: "Questions and evidence",
    exposition: "The same clinical topic can require different evidence.",
    materials: [
      {
        material_id: "concept-map",
        kind: "Question-to-evidence concept map",
        body: {
          title: "One clinical problem, four different evidence needs",
          representation_type: "Branching concept map",
          central_concept: "Falls among older adults",
          branches: [
            {
              research_purpose: "Describe how often falls occur",
              research_question:
                "What proportion of adults aged 65 and over attending clinic report a fall in the past year?",
              evidence_required:
                "A count of people and a count of those reporting a fall in a defined period.",
              evidence_focus: "Frequency in a defined population",
              relationship_label: "Requires evidence about how often falls occur."
            },
            {
              research_purpose: "Estimate future risk",
              research_question:
                "Which earlier mobility findings are associated with a later fall?",
              evidence_required:
                "Mobility measured before the fall, then falls recorded afterwards.",
              evidence_focus: "Earlier findings and later events",
              relationship_label: "Requires evidence that orders mobility before falls."
            }
          ],
          relationships: [
            {
              from: "concept",
              to: "Q1",
              label: "Connects the clinical topic to the frequency question."
            },
            {
              from: "concept",
              to: "Q2",
              label: "Connects the clinical topic to the risk question."
            }
          ],
          central_synthesis:
            "Study design should follow the research purpose, because the questions do not ask for the same evidence.",
          accessible_text_equivalent:
            "Falls among older adults is one topic. Describing frequency needs a count of falls in a defined period. Estimating risk needs mobility measured before later falls."
        }
      }
    ]
  });

  assert.equal(materials[0].type, "expository_structured_fallback");
  const block = article(html, "concept-map");
  assertSpecChromeAbsent(block);
  assert.doesNotMatch(block, /<table/i);
  assert.doesNotMatch(block, /Branching concept map/);
  assert.doesNotMatch(block, /→\s*Q1/);
  assert.doesNotMatch(block, />Q1</);
  const text = visible(block);
  assert.match(text, /Falls among older adults/);
  assert.match(text, /Describe how often falls occur/);
  assert.match(
    text,
    /What proportion of adults aged 65 and over attending clinic report a fall/
  );
  assert.ok(
    text.indexOf("What proportion of adults aged 65 and over attending clinic report a fall") <
      text.indexOf("Requires evidence about how often falls occur")
  );
  assert.match(text, /Requires evidence about how often falls occur/);
  assert.match(text, /Requires evidence that orders mobility before falls/);
  assert.match(text, /Study design should follow the research purpose/);
  assert.match(
    text,
    /Describing frequency needs a count of falls in a defined period/
  );
  assert.match(text, /Connects the clinical topic to the frequency question/);
});

test("timeline entries render in position order as labelled steps", () => {
  const { html, materials } = renderSection({
    section_id: "S-time",
    title: "Observational designs",
    exposition:
      "Where an investigation begins changes the evidence a falls question can support.",
    materials: [
      {
        material_id: "obs-timeline",
        kind: "Comparative study-design timeline",
        body: {
          title: "Three observational designs: where does each investigation begin?",
          representation_type: "Aligned comparative timeline",
          shared_clinical_context:
            "Investigating falls and fall-related injuries among older adults.",
          time_axis: {
            label: "Chronological occurrence of exposure and outcome",
            direction: "Earlier to later",
            clarification:
              "Chronological time is distinct from the direction in which researchers select participants."
          },
          designs: [
            {
              design: "Cross-sectional study",
              example_question:
                "What proportion of older adults attending clinic report a fall?",
              starting_point: "A defined clinic population at one time",
              timeline_elements: [
                {
                  position: 3,
                  label: "Prevalence estimate",
                  description:
                    "Estimate the proportion reporting falls within the specified period."
                },
                {
                  position: 1,
                  label: "Defined population",
                  description: "Identify older adults attending the clinic."
                },
                {
                  position: 2,
                  label: "Assessment",
                  description:
                    "Collect information about reported falls and relevant characteristics."
                }
              ],
              temporal_structure:
                "Exposure and outcome information are collected together at one time.",
              investigation_direction:
                "The investigation assesses a population rather than following an exposure forward.",
              principal_evidence: "How common reported falls are in that clinic population.",
              principal_advantage: "It can describe frequency without waiting for follow-up.",
              principal_limitation:
                "It cannot show that a characteristic preceded the fall.",
              compact_visual_label: "Population → Snapshot of falls and characteristics"
            },
            {
              design: "Cohort study",
              example_question:
                "Does poorer baseline mobility precede falls over the next year?",
              starting_point: "Mobility measured before later falls",
              timeline_elements: [
                {
                  position: 1,
                  label: "Baseline mobility",
                  description: "Record mobility before the follow-up period."
                },
                {
                  position: 2,
                  label: "Follow-up",
                  description: "Keep contact over the following year."
                },
                {
                  position: 3,
                  label: "Subsequent falls",
                  description: "Record falls that occur after the baseline measure."
                }
              ],
              temporal_structure:
                "Mobility is recorded first and falls are recorded later.",
              investigation_direction:
                "The investigation follows people forward from an earlier measure.",
              principal_evidence:
                "Whether earlier mobility differences are associated with later falls.",
              principal_advantage:
                "The time order of mobility and falls is observed.",
              principal_limitation:
                "People who leave the cohort can make the remaining group unrepresentative.",
              compact_visual_label: "Baseline mobility → Follow-up → Subsequent falls"
            }
          ]
        }
      }
    ]
  });

  assert.equal(materials[0].type, "expository_structured_fallback");
  const block = article(html, "obs-timeline");
  assertSpecChromeAbsent(block);
  assert.doesNotMatch(block, /<table/i);
  assert.doesNotMatch(block, /Population → Snapshot/);
  assert.doesNotMatch(block, /Aligned comparative timeline/);
  const text = visible(block);
  assert.match(text, /Cross-sectional study/);
  assert.match(text, /Cohort study/);
  assert.match(text, /What proportion of older adults attending clinic report a fall/);
  assert.match(text, /Does poorer baseline mobility precede falls/);
  assert.match(text, /Exposure and outcome information are collected together/);
  assert.match(text, /follows people forward from an earlier measure/);
  assert.match(text, /cannot show that a characteristic preceded the fall/);
  assert.match(text, /leave the cohort can make the remaining group unrepresentative/);
  assert.match(text, /Investigating falls and fall-related injuries among older adults/);
  assert.match(
    text,
    /Chronological occurrence of exposure and outcome \(Earlier to later\)/
  );
  assert.match(
    text,
    /Chronological time is distinct from the direction in which researchers select participants/
  );
  const definedAt = block.indexOf("Defined population");
  const assessmentAt = block.indexOf("Assessment");
  const prevalenceAt = block.indexOf("Prevalence estimate");
  assert.ok(definedAt !== -1 && definedAt < assessmentAt && assessmentAt < prevalenceAt);
  assert.match(block, /<ol[^>]*class="util-exposition-explanation-list"/);
  assert.match(text, /Identify older adults attending the clinic/);
  assert.match(text, /Baseline mobility/);
  assert.match(text, /Follow-up/);
  assert.match(text, /Keep contact over the following year/);
  assert.match(text, /Record falls that occur after the baseline measure/);
});

test("a selective educational comparison remains a real table", () => {
  const { html, materials } = renderSection({
    section_id: "S-matrix",
    title: "Trade-offs",
    exposition: "Design choice depends on the question and the feasible evidence.",
    materials: [
      {
        material_id: "matrix",
        kind: "Integrated study-design comparison matrix",
        body: {
          title: "Choosing a clinical study design: questions, strengths and trade-offs",
          columns: [
            "Study design",
            "Typical research question",
            "Principal strength",
            "Principal limitation"
          ],
          rows: [
            [
              "Cross-sectional study",
              "How common are reported falls now?",
              "Describes frequency at one time",
              "Does not establish that a factor came first"
            ],
            [
              "Randomised controlled trial",
              "Does balance training reduce falls compared with usual care?",
              "Allocation can balance factors that were not measured",
              "The result applies to the treatment contrast that was delivered"
            ]
          ]
        }
      },
      {
        material_id: "short-contrast",
        kind: "Short design contrast",
        body: {
          title: "A compact contrast",
          options: [
            {
              design: "Case-control study",
              strength: "Useful when falls outcomes are uncommon",
              limit: "Recall of earlier exposures can be uneven"
            },
            {
              design: "Cohort study",
              strength: "Records the exposure before the falls",
              limit: "Follow-up takes time"
            }
          ]
        }
      }
    ]
  });

  assert.equal(materials[0].type, "expository_structured_table");
  assert.equal(materials[1].type, "expository_structured_fallback");
  const matrix = article(html, "matrix");
  assert.match(matrix, /<table/);
  assert.match(matrix, /<th[^>]*scope="col"[^>]*>Study design</);
  assert.match(matrix, /<th[^>]*scope="col"[^>]*>Principal limitation</);
  assert.match(matrix, /<td>Does not establish that a factor came first<\/td>/);
  assert.match(
    matrix,
    /Does balance training reduce falls compared with usual care/
  );
  const contrast = article(html, "short-contrast");
  assert.match(contrast, /<table/);
  assert.match(contrast, /<th[^>]*scope="col"[^>]*>Design</);
  assert.match(contrast, /Useful when falls outcomes are uncommon/);
  assert.match(contrast, /<th[^>]*scope="row"|<td>Case-control study</);
});

test("trial structure keeps explanations and an accessible equivalent without machine ids", () => {
  const { html, materials } = renderSection({
    section_id: "S-rct",
    title: "Randomised comparison",
    exposition:
      "Random allocation compares balance training with usual care in people who could have received either.",
    materials: [
      {
        material_id: "rct-diagram",
        kind: "Randomised trial structure diagram",
        body: {
          title: "How a randomised trial compares balance training with usual care",
          representation_type: "Branching trial structure",
          research_question:
            "Among adults aged 65 and over, does balance training reduce falls compared with usual care over 12 months?",
          trial_components: [
            {
              id: "RCT-1",
              label: "Eligible participants",
              description:
                "Adults aged 65 and over who could receive either balance training or usual care.",
              role: "Population entering the trial"
            },
            {
              id: "RCT-2",
              label: "Random allocation",
              description:
                "Assignment is made by a chance procedure rather than by clinician preference.",
              role: "Creates the comparison groups"
            }
          ],
          relationships: [
            {
              from: "RCT-1",
              to: "RCT-2",
              label: "Enter random allocation"
            },
            {
              from: "RCT-2",
              to: "RCT-4B",
              label: "Allocated to usual care"
            }
          ],
          interpretive_annotations: [
            {
              label: "What randomisation adds",
              text: "Chance assignment balances, on average, factors that were not measured."
            },
            {
              label: "Comparable outcome assessment",
              text: "Falls should be recorded in the same way in both groups."
            }
          ],
          central_synthesis:
            "The trial estimates the contrast between balance training and usual care, not the effect of every difference in care.",
          accessible_text_equivalent:
            "Eligible adults are randomly allocated to balance training or usual care. Falls are then recorded in the same way in both groups over 12 months."
        }
      }
    ]
  });

  assert.equal(materials[0].type, "expository_structured_fallback");
  const block = article(html, "rct-diagram");
  assertSpecChromeAbsent(block);
  assert.doesNotMatch(block, /<table/i);
  assert.doesNotMatch(block, /RCT-1/);
  assert.doesNotMatch(block, /RCT-4B/);
  assert.doesNotMatch(block, /Branching trial structure/);
  const text = visible(block);
  assert.match(text, /Eligible participants/);
  assert.match(text, /could receive either balance training or usual care/);
  assert.match(text, /Population entering the trial/);
  assert.match(text, /Random allocation/);
  assert.match(text, /Enter random allocation/);
  assert.match(text, /Allocated to usual care/);
  assert.match(text, /What randomisation adds/);
  assert.match(text, /factors that were not measured/);
  assert.match(text, /Falls should be recorded in the same way in both groups/);
  assert.match(text, /not the effect of every difference in care/);
  assert.match(
    text,
    /Eligible adults are randomly allocated to balance training or usual care/
  );
});

test("an ordinary expository section without structured materials still renders", () => {
  const { html, materials } = renderSection({
    section_id: "S-plain",
    title: "Why the question comes first",
    exposition:
      "A falls-prevention question is not yet a study design. KEEP-EXPO-PROSE-41",
    materials: [
      {
        material_id: "plain-note",
        kind: "note",
        title: "Comparison condition",
        body: "Usual care remains the comparison condition. KEEP-PLAIN-NOTE-41"
      }
    ]
  });

  assert.notEqual(materials[0].type, "expository_structured_fallback");
  assert.match(html, /KEEP-EXPO-PROSE-41/);
  assert.match(html, /KEEP-PLAIN-NOTE-41/);
  assert.match(html, /Why the question comes first/);
  assert.doesNotMatch(html, /Representation type/);
  assert.doesNotMatch(html, /Accessible text equivalent/);
  assert.doesNotMatch(html, /Position:\s*\d+/);
});
