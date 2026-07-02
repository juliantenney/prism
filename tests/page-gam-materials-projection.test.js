/**
 * Sprint 38-S — Activity Materials → Page body projection (GAM preserve merge).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const fidelity = require(path.join(repoRoot, "lib", "design-page-materials-fidelity.js"));
const {
  applyGamMaterialsToComposedPage,
  parseUpstreamActivityMaterialsCapture,
  findLearningActivitiesRows
} = require(path.join(repoRoot, "lib", "page-gam-materials-preserve.js"));

const gamJsonPath = path.join(
  repoRoot,
  "docs/development/sprints/2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts/EV-38S-AFTER-4-gam.json"
);

const fullM1Body =
  "Inflation is the general increase in prices of goods and services over time, which reduces the purchasing power of money. " +
  "The Consumer Price Index (CPI) measures the average change over time in prices paid by urban consumers for a fixed basket of goods and services. " +
  "The GDP Deflator measures the change in prices of all domestically produced goods and services in an economy.";

test("synopsis detector flags description-only material strings", () => {
  assert.equal(
    fidelity.looksLikeMaterialDescriptionSynopsis(
      "Scenario comparison showing difference between demand-pull and cost-push inflation."
    ),
    true
  );
  assert.equal(
    fidelity.looksLikeMaterialDescriptionSynopsis(
      "Example showing demand-pull inflation reasoning with a short household illustration."
    ),
    true
  );
  assert.equal(fidelity.stringLooksPlaceholderOnly("Inflation refers to a sustained increase in prices."), true);
  assert.equal(fidelity.looksLikeMaterialDescriptionSynopsis(fullM1Body), false);
});

test("placeholder detector flags material reference tokens (A1_TEXT)", () => {
  assert.equal(fidelity.looksLikeMaterialReferenceToken("A1_TEXT"), true);
  assert.equal(fidelity.looksLikeMaterialReferenceToken("A1_WORKED"), true);
  assert.equal(fidelity.stringLooksPlaceholderOnly("A1_CHECK"), true);
});

test("findLearningActivitiesRows resolves nested content.content wrapper", () => {
  const page = {
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning Activities",
        content: {
          content: [{ activity_id: "A1", materials: {} }]
        }
      }
    ]
  };
  const rows = findLearningActivitiesRows(page);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].activity_id, "A1");
});

test("parseUpstreamActivityMaterialsCapture reads EV GAM JSON activities[]", () => {
  const gam = JSON.parse(fs.readFileSync(gamJsonPath, "utf8"));
  const upstream = parseUpstreamActivityMaterialsCapture(gam, null);
  assert.ok(Array.isArray(upstream));
  assert.ok(upstream.length >= 4);
  assert.ok(upstream[0].materials && upstream[0].materials.length > 0);
  assert.ok(String(upstream[0].materials[0].content || "").length > 200);
});

test("parseUpstreamActivityMaterialsCapture reads nested activity_materials.content.activities shape", () => {
  const raw = {
    activity_materials: {
      content: {
        activities: [
          {
            activity_id: "A1",
            materials: [
              {
                material_id: "M1",
                type: "text",
                content: "Full learner-facing exposition body for adoption planning."
              }
            ]
          }
        ]
      }
    }
  };
  const upstream = parseUpstreamActivityMaterialsCapture(raw, null);
  assert.ok(Array.isArray(upstream));
  assert.equal(upstream.length, 1);
  assert.equal(upstream[0].activity_id, "A1");
  assert.match(String(upstream[0].materials[0].content || ""), /Full learner-facing exposition/i);
});

test("parseUpstreamActivityMaterialsCapture reads nested activity_materials.activities shape", () => {
  const raw = {
    activity_materials: {
      activities: [
        {
          activity_id: "LO1",
          materials: [
            {
              material_id: "LO1-W1",
              type: "worked_example",
              purpose: "worked thinking",
              content:
                "## Worked Example\n\nStep 1...\n\n## What experts notice\n- Evidence quality\n\n**Bridge:** Apply to your own case."
            }
          ]
        }
      ]
    }
  };
  const upstream = parseUpstreamActivityMaterialsCapture(raw, null);
  assert.ok(Array.isArray(upstream));
  assert.equal(upstream.length, 1);
  assert.equal(upstream[0].activity_id, "LO1");
  assert.equal(upstream[0].materials[0].material_id, "LO1-W1");
});

test("GAM preserve merges object-shaped materials preserving worked example and LO5 transfer/consolidation", () => {
  const upstream = [
    {
      activity_id: "LO1",
      materials: {
        "LO1-W1": {
          type: "worked_example",
          purpose: "worked thinking",
          content:
            "## Worked Example\n\nStep 1: Build the chain.\n\n## What experts notice\n- Signal over noise.\n\n**Bridge:** Apply the same reasoning to your context."
        }
      }
    },
    {
      activity_id: "LO5",
      materials: {
        "LO5-TR1": {
          type: "transfer_prompt",
          purpose: "transfer evaluate",
          content:
            "Transfer task: apply the framework to a new case in at least 80 words and justify trade-offs."
        },
        "LO5-CS1": {
          type: "consolidation_summary",
          purpose: "reflective consolidation",
          content:
            "Consolidation: synthesize what changed in your judgement and what uncertainty remains."
        }
      }
    }
  ];
  const page = {
    artifact_type: "page",
    page_profile: "learner",
    sections: [
      {
        section_id: "learning_activities",
        content: [
          { activity_id: "LO1", materials: { worked_example: "Short summary only." } },
          { activity_id: "LO5", materials: { transfer_prompt_evaluate: "Thin prompt." } }
        ]
      }
    ]
  };
  const merged = applyGamMaterialsToComposedPage(page, upstream);
  const rows = findLearningActivitiesRows(merged);
  const lo1 = rows.find((r) => String(r.activity_id) === "LO1");
  const lo5 = rows.find((r) => String(r.activity_id) === "LO5");
  assert.match(String(lo1.materials.worked_example || ""), /## What experts notice/i);
  assert.match(String(lo1.materials.worked_example || ""), /\*\*Bridge:\*\*/i);
  assert.match(String(lo5.materials.transfer_prompt_evaluate || ""), /at least 80 words/i);
  assert.match(String(lo5.materials.consolidation_summary || ""), /Consolidation:/i);
});

test("parseUpstreamActivityMaterialsCapture reads live markdown pack-text GAM capture", () => {
  const packText = [
    "Activity: Recognising Different Types of Organisational Change",
    "Activity ID: LO1",
    "Mapped outcomes: LO1",
    "",
    "Material: LO1_TEXT (text)",
    "Purpose: explanation",
    "Content:",
    "",
    "## Understanding Types of Change",
    "",
    "Incremental change adjusts systems within an existing model.",
    "",
    "---",
    "Material: LO1_WORKED (worked_example)",
    "Purpose: worked thinking",
    "Content:",
    "",
    "### Worked Example: Classifying a Change Initiative",
    "",
    "**Step 1:** Name the initiative.",
    "",
    "**Step 2:** Gather evidence.",
    "",
    "**Step 3:** Classify scope.",
    "",
    "**Step 4:** Justify with reasoning.",
    "",
    "**Step 5:** State leadership implications.",
    "",
    "---",
    "Material: LO1_TABLE (comparison_table)",
    "Purpose: guided practice",
    "Content:",
    "",
    "| Change Initiative | Characteristics | Classification |",
    "| --- | --- | --- |",
    "| ERP replacement | Enterprise-wide scope | Transformational |",
    "",
    "---",
    "Activity: Synthesis and Closure",
    "Activity ID: LO5",
    "Mapped outcomes: LO5",
    "",
    "Material: LO5_CS (consolidation_summary)",
    "Purpose: reflective consolidation",
    "Content:",
    "",
    "Before you close, synthesize what evidence changed your judgement and what uncertainty remains in your own organisation."
  ].join("\n");

  const upstream = parseUpstreamActivityMaterialsCapture(packText, null);
  assert.equal(upstream.length, 2);
  const lo1 = upstream.find((a) => a.activity_id === "LO1");
  assert.match(String(lo1.materials.find((m) => m.type === "text").content || ""), /^## Understanding Types of Change/);

  const wrapped = JSON.stringify({
    artifact_type: "activity_materials",
    content: packText
  });
  const fromWrapper = parseUpstreamActivityMaterialsCapture(wrapped, null);
  assert.equal(fromWrapper.length, 2);
  assert.match(
    String(fromWrapper.find((a) => a.activity_id === "LO1").materials[0].content || ""),
    /Understanding Types of Change/
  );

  const withFooter = packText + "\nSTEP 7 OUTPUT: activity_materials\n";
  const fromFooter = parseUpstreamActivityMaterialsCapture(withFooter, null);
  assert.equal(fromFooter.length, 2);

  const page = {
    artifact_type: "page",
    page_profile: "learner",
    sections: [
      {
        section_id: "learning_activities",
        content: [
          {
            activity_id: "LO1",
            materials: {
              text: "Definitions of change management summary.",
              worked_example: "Classification summary only.",
              comparison_table: "| Change Initiative | Characteristics |"
            }
          },
          {
            activity_id: "LO5",
            materials: { consolidation_summary: "Session closure label." }
          }
        ]
      }
    ]
  };
  const merged = applyGamMaterialsToComposedPage(page, packText);
  const rows = findLearningActivitiesRows(merged);
  const lo1Row = rows.find((r) => r.activity_id === "LO1");
  const lo5Row = rows.find((r) => r.activity_id === "LO5");
  assert.equal(merged.metadata.gam_materials_preserve_rows, 2);
  assert.match(String(lo1Row.materials.text || ""), /^## Understanding Types of Change/);
  assert.match(String(lo1Row.materials.worked_example || ""), /### Worked Example: Classifying a Change Initiative/);
  assert.match(String(lo1Row.materials.worked_example || ""), /\*\*Step 5:\*\*/);
  assert.match(String(lo1Row.materials.comparison_table || ""), /\| ERP replacement \|/);
  assert.match(String(lo5Row.materials.consolidation_summary || ""), /what evidence changed your judgement/i);
});

test("parseUpstreamActivityMaterialsCapture reads pack.activities GAM JSON shape", () => {
  const raw = {
    pack: {
      activities: [
        {
          activity_id: "LO1",
          materials: [
            {
              material_id: "LO1-T1",
              type: "text",
              purpose: "concept exposition",
              content:
                "## Change management foundations\n\nChange management is the disciplined approach to transitioning individuals, teams, and organisations from a current state to a desired future state."
            },
            {
              material_id: "LO1-W1",
              type: "worked_example",
              purpose: "worked thinking",
              content:
                "## Worked Example\n\n**Step 1:** Name the change claim.\n\n**Step 2:** Classify incremental vs transformational using evidence.\n\n## What experts notice\n- Scope and disruption signals matter."
            },
            {
              material_id: "LO1-C1",
              type: "comparison_table",
              purpose: "guided practice",
              content:
                "| Change Initiative | Characteristics | Organisational Impact | People Impact | Leadership Implications | Classification |\n|---|---|---|---|---|---|\n| ERP replacement | Enterprise-wide scope | Process redesign | Role redefinition | Sustained sponsorship | Transformational |"
            }
          ]
        },
        {
          activity_id: "LO5",
          materials: [
            {
              material_id: "LO5-CS1",
              type: "consolidation_summary",
              purpose: "reflective consolidation",
              content:
                "Consolidation: Before you close this session, write what judgement changed, what evidence still feels uncertain, and what you would check next in your own organisation."
            }
          ]
        }
      ]
    }
  };
  const upstream = parseUpstreamActivityMaterialsCapture(raw, null);
  assert.ok(Array.isArray(upstream));
  assert.equal(upstream.length, 2);
  assert.match(String(upstream[0].materials[0].content || ""), /Change management foundations/i);
});

test("parseUpstreamActivityMaterialsCapture reads required_materials bodies on activities", () => {
  const raw = {
    activities: [
      {
        activity_id: "LO1",
        required_materials: [
          {
            material_id: "LO1-T1",
            type: "text",
            purpose: "exposition",
            content: "## Foundations\n\nIncremental change adjusts existing systems; transformational change redefines operating models."
          }
        ]
      }
    ]
  };
  const upstream = parseUpstreamActivityMaterialsCapture(raw, null);
  assert.equal(upstream.length, 1);
  assert.match(String(upstream[0].materials[0].content || ""), /Incremental change adjusts/i);
});

test("GAM preserve replaces change-management synopsis page bodies after recompose", () => {
  const gam = {
    artifact_type: "activity_materials",
    content: {
      activities: [
        {
          activity_id: "LO1",
          materials: [
            {
              material_id: "LO1-T1",
              type: "text",
              purpose: "concept exposition",
              content:
                "## Change management foundations\n\nDefinitions of change management must be read in context: incremental change adjusts systems within an existing model, while transformational change redefines how the organisation works."
            },
            {
              material_id: "LO1-W1",
              type: "worked_example",
              purpose: "worked thinking",
              content:
                "## Worked Example\n\n**Step 1:** Identify the initiative scope.\n\n**Step 2:** Gather adoption evidence.\n\n**Step 3:** Classify as incremental or transformational with reasons.\n\n## What experts notice\n- Disruption breadth and role redesign are decisive signals."
            },
            {
              material_id: "LO1-C1",
              type: "comparison_table",
              purpose: "guided practice",
              content:
                "| Change Initiative | Characteristics | Organisational Impact | People Impact | Leadership Implications | Classification |\n|---|---|---|---|---|---|\n| ERP replacement | Enterprise-wide scope | Process redesign | Role redefinition | Sustained sponsorship | Transformational |\n| Policy tweak | Localised edit | Minor workflow shift | Low disruption | Manager communication | Incremental |"
            }
          ]
        },
        {
          activity_id: "LO5",
          materials: [
            {
              material_id: "LO5-CS1",
              type: "consolidation_summary",
              purpose: "reflective consolidation",
              content:
                "Consolidation: Before you close, explain what evidence changed your classification and what uncertainty you would investigate next in your own organisation."
            }
          ]
        }
      ]
    }
  };
  const page = {
    artifact_type: "page",
    page_profile: "learner",
    sections: [
      {
        section_id: "learning_activities",
        content: [
          {
            activity_id: "LO1",
            materials: {
              text: "Definitions of change management, incremental change, transformational change and leadership implications.",
              worked_example:
                "Classification of an enterprise platform replacement as transformational change using evidence and reasoning.",
              comparison_table:
                "| Change Initiative | Characteristics | Organisational Impact | People Impact | Leadership Implications | Classification |"
            }
          },
          {
            activity_id: "LO5",
            materials: {
              consolidation_summary: "Session closure and reflective synthesis."
            }
          }
        ]
      }
    ]
  };
  const merged = applyGamMaterialsToComposedPage(page, gam);
  const rows = findLearningActivitiesRows(merged);
  const lo1 = rows.find((r) => String(r.activity_id) === "LO1");
  const lo5 = rows.find((r) => String(r.activity_id) === "LO5");
  assert.match(String(lo1.materials.text || ""), /^## Change management foundations/i);
  assert.match(String(lo1.materials.worked_example || ""), /\*\*Step 1:\*\*/i);
  assert.match(String(lo1.materials.worked_example || ""), /What experts notice/i);
  assert.match(String(lo1.materials.comparison_table || ""), /\| ERP replacement \|/);
  assert.match(String(lo1.materials.comparison_table || ""), /\| Policy tweak \|/);
  assert.match(String(lo5.materials.consolidation_summary || ""), /what evidence changed your classification/i);
  assert.equal(merged.metadata.gam_materials_preserve_applied, true);
});

test("GAM preserve replaces synopsis page materials with full activity_materials bodies", () => {
  const gam = JSON.parse(fs.readFileSync(gamJsonPath, "utf8"));
  const page = {
    artifact_type: "page",
    title: "Inflation workbook",
    page_profile: "learner",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning Activities",
        content: [
          {
            activity_id: "A1",
            title: "Understanding Inflation Measurement Methods",
            learner_task: "Read and classify.",
            materials: {
              text: "Inflation refers to a sustained increase in general prices.",
              worked_example: "Example showing demand-pull inflation reasoning in brief."
            }
          }
        ]
      }
    ]
  };
  const merged = applyGamMaterialsToComposedPage(page, gam.activities);
  const rows = findLearningActivitiesRows(merged);
  assert.equal(rows.length, 1);
  const text = String(rows[0].materials.text || "");
  assert.ok(text.length > 500, "expected full M1 explanation body, got len=" + text.length);
  assert.match(text, /Consumer Price Index \(CPI\)/);
  const worked = String(rows[0].materials.worked_example || "");
  assert.ok(worked.length > 400, "expected full worked example body");
  assert.match(worked, /Step 1:/i);
  assert.equal(merged.metadata.gam_materials_preserve_applied, true);
});
