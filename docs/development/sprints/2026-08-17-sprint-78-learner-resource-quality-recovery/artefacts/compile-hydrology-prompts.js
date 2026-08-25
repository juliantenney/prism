"use strict";

/**
 * S78-T-045 helper — compile live human/canonical prompts for Hydrology
 * synthesis + key activity generate affordances from deposited page fields.
 * Diagnostic only; not a production fixture.
 */

const fs = require("node:fs");
const path = require("node:path");
const workspace = require("../../../../../lib/utilities-visual-jobs-workspace.js");

const outDir = __dirname;

const pageSynthesis = {
  overview: {
    format: "markdown",
    body: "This self-study resource develops a systems view of the water cycle. Work through the activities in sequence, beginning with stores and transfers before tracing pathways, modelling a drainage basin, reasoning about water balance, and applying the model to changing catchments."
  },
  learning_purpose: {
    format: "markdown",
    body: "The sequence moves from identifying hydrological components to explaining relationships and analysing change. Each activity reuses the systems reasoning established earlier, so complete the activities in order and use your own classifications and causal explanations as the basis for later work."
  },
  knowledge_summary: {
    format: "markdown",
    body:
      "The hydrological cycle can be modelled as an interconnected system in which water occupies stores and moves between them through transfers. At drainage-basin scale, precipitation supplies an input; water can be held in vegetation, soil, surface-water and groundwater stores; transfers such as infiltration, percolation, throughflow and runoff redistribute it; and river discharge and evapotranspiration can move water out of the basin.\n\nWater can follow different pathways through this system rather than one fixed circular sequence. A pathway explanation therefore connects a starting store, a transfer and a receiving store, then traces how that new state enables subsequent movement.\n\nThe drainage-basin model also supports reasoning about change. Comparing hydrological inputs with outputs indicates whether storage is increasing or decreasing over the period considered, while residence time helps distinguish how quickly different stores may express that change. Physical controls and human modifications can alter surface or subsurface conditions, changing processes such as infiltration, evapotranspiration, runoff or groundwater movement and consequently affecting stores or river flow. Such interpretations should remain bounded by the particular catchment conditions supplied."
  },
  study_tips: {
    format: "markdown",
    body:
      "- Treat the water cycle as a **system of stores and transfers**, not as one fixed circular route.\n- When analysing a drainage basin, use the functional sequence **input → storage and internal transfers → output**, while remembering that several pathways can operate at once.\n- For changing conditions, separate **what changes** from **how quickly it changes**: water balance indicates storage direction, while residence time helps explain response timescale.\n- When applying your learning to a new catchment, build a bounded causal chain from **observed condition → affected hydrological process → changed store or flow**."
  }
};

const visualAffordances = JSON.parse(
  fs.readFileSync(path.join(outDir, "hydrology-visual-affordances.json"), "utf8")
);

const page = {
  artifact_type: "page",
  schema_version: "2.0.0",
  title: "Water Through the Earth System",
  page_synthesis: pageSynthesis,
  visual_affordance_schema_version: "38.4",
  activities_visual_review: [
    {
      activity_id: "A1",
      activity_visual_value: {
        decision: "high",
        rationale:
          "A systems visual can make the distinction between storage and movement inspectable while showing branching pathways without supplying the learner's classification answers."
      }
    },
    {
      activity_id: "A2",
      activity_visual_value: {
        decision: "medium",
        rationale:
          "Connected pathways are inherently spatial and sequential, but the existing worked example should establish the reasoning process before an additional visual representation is introduced."
      }
    },
    {
      activity_id: "A3",
      activity_visual_value: {
        decision: "high",
        rationale:
          "A basin-boundary representation can externalise the functional distinction among inputs, internal stores and transfers, and outputs without duplicating the classification worksheet."
      }
    },
    {
      activity_id: "A4",
      activity_visual_value: {
        decision: "high",
        rationale:
          "Learners must coordinate two related but distinct ideas—storage direction and response timescale—so a causal representation can reduce working-memory demand after the analysis."
      }
    },
    {
      activity_id: "A5",
      activity_visual_value: {
        decision: "high",
        rationale:
          "A causal-chain scaffold can help learners trace how an observed catchment condition propagates through a hydrological process to a store or flow without revealing scenario conclusions."
      }
    }
  ],
  visual_affordances: visualAffordances,
  activities: [
    {
      activity_id: "A1",
      title: "Build a Water-Cycle System",
      learner_task:
        "1. Use the system-model guide to distinguish water stores from transfers. 2. Complete the classification workspace. 3. Compose a short explanation.",
      materials: [
        {
          material_id: "A1-M1",
          material_type: "text",
          body: "Stores hold water; transfers move water; atmospheric, surface and subsurface parts; multiple pathways."
        },
        {
          material_id: "A1-M2",
          material_type: "task_card",
          body: "Classify groundwater, evaporation, soil moisture, ..."
        }
      ]
    },
    {
      activity_id: "A2",
      title: "Trace Water Through Pathways",
      learner_task: "Trace an independent pathway.",
      materials: [
        { material_id: "A2-M2", material_type: "worked_example", body: "Worked example." },
        { material_id: "A2-M3", material_type: "task_card", body: "Independent pathway." },
        { material_id: "A2-M4", material_type: "template", body: "Template." }
      ]
    },
    {
      activity_id: "A3",
      title: "Model a Drainage Basin",
      learner_task: "Classify drainage-basin components as input, store, transfer or output.",
      materials: [
        {
          material_id: "A3-M1",
          material_type: "text",
          body: "Precipitation is the major input; stores hold water; transfers move water; river discharge and evapotranspiration are outputs."
        },
        { material_id: "A3-M2", material_type: "task_card", body: "Twelve components." },
        {
          material_id: "A3-M3",
          material_type: "classification_table",
          body: "Blank classification table."
        }
      ]
    },
    {
      activity_id: "A4",
      title: "Reason About Water Balance",
      learner_task: "Determine storage direction and residence-time implications.",
      materials: [
        {
          material_id: "A4-M1",
          material_type: "text",
          body: "Inputs vs outputs indicate storage direction; residence time qualifies response timescale."
        },
        { material_id: "A4-M3", material_type: "scenario", body: "Basin Alpha and Beta values." },
        { material_id: "A4-M4", material_type: "analysis_table", body: "Blank analysis table." }
      ]
    },
    {
      activity_id: "A5",
      title: "Analyse a Changing Catchment",
      learner_task: "Trace catchment controls to hydrological consequences.",
      materials: [
        { material_id: "A5-M1", material_type: "text", body: "Conditional catchment controls." },
        { material_id: "A5-M2", material_type: "scenario", body: "Three catchments." },
        { material_id: "A5-M3", material_type: "analysis_table", body: "Blank." },
        { material_id: "A5-M5", material_type: "transfer_prompt", body: "Transfer scenario." }
      ]
    }
  ]
};

const state = workspace.buildVisualJobsWorkspaceState(page);
const briefs =
  (state.compilerResult && state.compilerResult.briefs) ||
  (state.briefs) ||
  [];
const targetIds = [
  "va-page-knowledge-summary-01",
  "va-A1-system-01",
  "va-A3-basin-system-01",
  "va-A4-balance-01"
];

const report = {
  pipeline_ok: briefs.length > 0,
  briefs: [],
  errors: (state.compilerResult && state.compilerResult.errors) || state.errors || [],
  contract_errors: (state.contractResult && state.contractResult.errors) || [],
  brief_ids: briefs.map((b) => b.affordance_id)
};

targetIds.forEach((id) => {
  const brief = briefs.find((b) => b.affordance_id === id);
  if (!brief) {
    report.briefs.push({ affordance_id: id, missing: true });
    return;
  }
  const human = workspace.buildVisualJobHumanPrompt(brief);
  report.briefs.push({
    affordance_id: id,
    scope: brief.scope,
    purpose: brief.purpose,
    human_prompt: human,
    generation_instruction: brief.generation_instruction,
    human_has_evidence_basis: /Evidence basis/i.test(human),
    human_has_concept_boundary: /Concept boundary:/i.test(human),
    human_has_synthesis_mode: /knowledge synthesis/i.test(human),
    canonical_evidence_clip: String(brief.generation_instruction || "").match(
      /5\. Evidence basis[\s\S]*?(?=\n\n6\.|$)/
    )
      ? String(brief.generation_instruction).match(
          /5\. Evidence basis[\s\S]*?(?=\n\n6\.|$)/
        )[0]
      : null
  });
});

fs.writeFileSync(
  path.join(outDir, "hydrology-compiled-prompts-preview.json"),
  JSON.stringify(report, null, 2),
  "utf8"
);

const synth = report.briefs.find((b) => b.affordance_id === "va-page-knowledge-summary-01");
if (synth && synth.human_prompt) {
  fs.writeFileSync(
    path.join(outDir, "hydrology-va-page-knowledge-summary-01-human-prompt.txt"),
    synth.human_prompt,
    "utf8"
  );
  fs.writeFileSync(
    path.join(outDir, "hydrology-va-page-knowledge-summary-01-canonical-prompt.txt"),
    String(synth.generation_instruction || ""),
    "utf8"
  );
}

console.log(
  JSON.stringify(
    {
      briefs: report.briefs.map((b) => ({
        id: b.affordance_id,
        missing: !!b.missing,
        human_has_evidence_basis: b.human_has_evidence_basis,
        human_has_concept_boundary: b.human_has_concept_boundary,
        human_has_synthesis_mode: b.human_has_synthesis_mode,
        human_len: b.human_prompt ? b.human_prompt.length : 0
      })),
      contract_error_count: report.contract_errors.length,
      compiler_error_count: report.errors.length
    },
    null,
    2
  )
);
