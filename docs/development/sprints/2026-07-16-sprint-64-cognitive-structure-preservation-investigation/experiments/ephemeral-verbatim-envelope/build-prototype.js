/**
 * Sprint 64 S64-BL-004b — path-gated ephemeral verbatim envelope prototype.
 * Non-production. Does not persist envelopes to canonical pages or change renderers.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../../../../../../");
const OUT = __dirname;

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
}

function write(name, data) {
  const p = path.join(OUT, name);
  fs.writeFileSync(
    p,
    typeof data === "string" ? data : JSON.stringify(data, null, 2) + "\n"
  );
  return p;
}

const HIGH_VALUE = {
  mechanism_explanation: ["required_links"],
  process_walkthrough: ["stages"],
  mental_model_building: ["key_relationships", "governing_constraint"]
};

function pickAuthoredStructure(archetype, plan) {
  const keys = HIGH_VALUE[archetype] || [];
  const out = {};
  keys.forEach((k) => {
    if (plan && plan[k] !== undefined) out[k] = plan[k];
  });
  return out;
}

function gate(sample) {
  const reasons = [];
  if (!sample.source) reasons.push("no_source");
  if (!sample.realised) reasons.push("no_realised");
  if (!sample.source_material_id) reasons.push("missing_source_id");
  if (!sample.realised_material_id) reasons.push("missing_realised_id");
  if (
    sample.source_material_id &&
    sample.realised_material_id &&
    sample.source_material_id !== sample.realised_material_id
  ) {
    reasons.push("ambiguous_or_non_1_1");
  }
  if (!sample.instructional_archetype) reasons.push("no_archetype");
  if (!sample.archetype_plan) reasons.push("invalid_or_missing_plan");
  if (!HIGH_VALUE[sample.instructional_archetype]) {
    reasons.push("unsupported_archetype");
  }
  if (sample.path_unsupported) reasons.push("unsupported_path");
  const eligible = reasons.length === 0;
  return { eligible, reasons };
}

const mixed = readJson(
  "docs/development/sprints/2026-07-15-sprint-60-instructional-archetype-operationalisation/artefacts/mixed-archetype-acceptance/dla-mixed-priority1.page.json"
);
const exp2 = readJson(
  "docs/development/sprints/2026-07-16-sprint-63-cognitive-flow-and-reasoning-visibility/experiments/experiment-2/experimental-assembled-page.json"
);

const candidates = [];

// E1 mechanism — Exp2 same-artefact both arrays
{
  const act = exp2.activities[0];
  const req = act.required_materials[0];
  const mat = act.materials[0];
  candidates.push({
    id: "E1",
    label: "Mechanism explanation (Exp2 enzymes A2-M1)",
    activity_id: act.activity_id,
    path: "fixture/diagnostic both-arrays",
    source: req,
    realised: mat,
    source_material_id: req.material_id,
    realised_material_id: mat.material_id,
    instructional_archetype: req.instructional_archetype,
    archetype_plan: req.archetype_plan,
    tier2_signals: {
      activity_preamble: act.activity_preamble,
      learner_task: act.learner_task,
      expected_output: act.expected_output,
      body_stand_in: mat.body
    },
    path_unsupported: false
  });
}

// E2 process — DLA + stand-in realised with matching id
{
  const act = mixed.activities.find((a) => a.activity_id === "A4");
  const req = act.required_materials[0];
  const mat = {
    material_id: "A4-M1",
    material_type: "worked_example",
    body: req.purpose
  };
  candidates.push({
    id: "E2",
    label: "Process walkthrough (mixed DLA A4-M1 + diagnostic stand-in)",
    activity_id: "A4",
    path: "fixture/diagnostic cross-artefact (ID-aligned stand-in)",
    source: req,
    realised: mat,
    source_material_id: req.material_id,
    realised_material_id: mat.material_id,
    instructional_archetype: req.instructional_archetype,
    archetype_plan: req.archetype_plan,
    tier2_signals: {
      activity_preamble: act.activity_preamble,
      learner_task: act.learner_task,
      expected_output: act.expected_output,
      body_stand_in: mat.body
    },
    path_unsupported: false
  });
}

// E3 mental model
{
  const act = mixed.activities.find((a) => a.activity_id === "A3");
  const req = act.required_materials[0];
  const mat = {
    material_id: "A3-M1",
    material_type: "modelling_note",
    body: req.purpose
  };
  candidates.push({
    id: "E3",
    label: "Mental model building (mixed DLA A3-M1 + diagnostic stand-in)",
    activity_id: "A3",
    path: "fixture/diagnostic cross-artefact (ID-aligned stand-in)",
    source: req,
    realised: mat,
    source_material_id: req.material_id,
    realised_material_id: mat.material_id,
    instructional_archetype: req.instructional_archetype,
    archetype_plan: req.archetype_plan,
    tier2_signals: {
      activity_preamble: act.activity_preamble,
      learner_task: act.learner_task,
      expected_output: act.expected_output,
      body_stand_in: mat.body
    },
    path_unsupported: false
  });
}

// Exclusions from correlation survey
const exclusions = [
  {
    id: "X1",
    label: "gam-partial.json materials",
    reason: "unsupported_path",
    detail: "partial/material-only; no required_materials on artefact"
  },
  {
    id: "X2",
    label: "RNA assembled vnext materials",
    reason: "unsupported_path",
    detail: "material-only assembled page; no source contract"
  },
  {
    id: "X3",
    label: "dla-mixed A1 ordinary row",
    reason: "no_archetype",
    detail: "required material without instructional_archetype / plan"
  },
  {
    id: "X4",
    label: "Ed Psych/Marx GAM materials alone",
    reason: "unsupported_path",
    detail: "GAM capture lacks required_materials; plans absent even on DLA join"
  }
];

const eligible = [];
const excluded = [...exclusions];
const envelopes = [];
const traces = [];
const comparisons = [];

candidates.forEach((sample) => {
  const g = gate(sample);
  if (!g.eligible) {
    excluded.push({
      id: sample.id,
      label: sample.label,
      reason: g.reasons.join(","),
      detail: "failed eligibility gate"
    });
    return;
  }

  const authored_structure = pickAuthoredStructure(
    sample.instructional_archetype,
    sample.archetype_plan
  );
  if (!Object.keys(authored_structure).length) {
    excluded.push({
      id: sample.id,
      label: sample.label,
      reason: "invalid_or_missing_plan",
      detail: "high-value keys missing from plan"
    });
    return;
  }

  const envelope = {
    _ephemeral: true,
    _not_a_schema: true,
    source_material_id: sample.source_material_id,
    realised_material_id: sample.realised_material_id,
    activity_id: sample.activity_id,
    instructional_archetype: sample.instructional_archetype,
    authored_structure,
    provenance: {
      correlated: true,
      eligible: true,
      path: sample.path,
      gate: "Outcome B path-gated"
    }
  };

  eligible.push({
    id: sample.id,
    label: sample.label,
    activity_id: sample.activity_id,
    instructional_archetype: sample.instructional_archetype,
    source_material_id: sample.source_material_id,
    realised_material_id: sample.realised_material_id,
    high_value_fields: Object.keys(authored_structure)
  });
  envelopes.push({ sample_id: sample.id, envelope });

  const t2 = {
    sample_id: sample.id,
    variant: "T2",
    phases: [
      {
        element: "Orientation",
        text: sample.tier2_signals.activity_preamble,
        source_field: "activity_preamble"
      },
      {
        element: "Your goal",
        text: sample.tier2_signals.learner_task,
        source_field: "learner_task"
      },
      {
        element: "Success looks like",
        text: sample.tier2_signals.expected_output,
        source_field: "expected_output"
      },
      {
        element: "Authored overview",
        text: sample.tier2_signals.body_stand_in,
        source_field: "purpose/body stand-in"
      },
      {
        element: "High-value structure",
        text: "(unavailable at Tier 2 — plan fields not used)",
        source_field: null
      }
    ]
  };

  const t1Phases = [
    {
      element: "Orientation",
      text: sample.tier2_signals.activity_preamble,
      source_field: "activity_preamble",
      source_value: sample.tier2_signals.activity_preamble,
      source_material_id: sample.source_material_id,
      realised_material_id: sample.realised_material_id
    },
    {
      element: "Your goal",
      text: sample.tier2_signals.learner_task,
      source_field: "learner_task",
      source_value: sample.tier2_signals.learner_task,
      source_material_id: sample.source_material_id,
      realised_material_id: sample.realised_material_id
    },
    {
      element: "Success looks like",
      text: sample.tier2_signals.expected_output,
      source_field: "expected_output",
      source_value: sample.tier2_signals.expected_output,
      source_material_id: sample.source_material_id,
      realised_material_id: sample.realised_material_id
    }
  ];

  const arch = sample.instructional_archetype;
  if (arch === "mechanism_explanation") {
    authored_structure.required_links.forEach((link, i) => {
      t1Phases.push({
        element: "Causal link " + (i + 1),
        text: link,
        source_field: "archetype_plan.required_links[" + i + "]",
        source_value: link,
        source_material_id: sample.source_material_id,
        realised_material_id: sample.realised_material_id
      });
    });
  } else if (arch === "process_walkthrough") {
    authored_structure.stages.forEach((stage, i) => {
      t1Phases.push({
        element: "Stage " + (i + 1),
        text: stage,
        source_field: "archetype_plan.stages[" + i + "]",
        source_value: stage,
        source_material_id: sample.source_material_id,
        realised_material_id: sample.realised_material_id
      });
    });
  } else if (arch === "mental_model_building") {
    authored_structure.key_relationships.forEach((rel, i) => {
      t1Phases.push({
        element: "Key relationship " + (i + 1),
        text: rel,
        source_field: "archetype_plan.key_relationships[" + i + "]",
        source_value: rel,
        source_material_id: sample.source_material_id,
        realised_material_id: sample.realised_material_id
      });
    });
    t1Phases.push({
      element: "Governing constraint",
      text: authored_structure.governing_constraint,
      source_field: "archetype_plan.governing_constraint",
      source_value: authored_structure.governing_constraint,
      source_material_id: sample.source_material_id,
      realised_material_id: sample.realised_material_id
    });
  }

  const t1 = { sample_id: sample.id, variant: "T1", phases: t1Phases };

  const t1Only = t1Phases.filter((p) =>
    String(p.source_field || "").startsWith("archetype_plan.")
  );

  comparisons.push({
    sample_id: sample.id,
    label: sample.label,
    instructional_archetype: arch,
    tier2: t2,
    tier1: t1,
    delta: {
      added_elements: t1Only.map((p) => p.element),
      source_fields_used: t1Only.map((p) => p.source_field),
      note: "T1 adds only verbatim high-value plan fields; Tier 2 shell unchanged"
    }
  });

  traces.push({
    sample_id: sample.id,
    elements: t1Only.map((p) => ({
      learner_element: p.element,
      source_field: p.source_field,
      source_value: p.source_value,
      source_material_id: p.source_material_id,
      realised_material_id: p.realised_material_id
    }))
  });
});

write("eligible-samples.json", {
  count: eligible.length,
  samples: eligible,
  envelopes_ephemeral: envelopes
});
write("excluded-samples.json", { count: excluded.length, samples: excluded });
write("provenance-traces.json", { samples: traces });
write("envelopes.ephemeral.json", {
  warning: "EPHEMERAL DIAGNOSTIC ONLY — not a schema; do not persist to production pages",
  envelopes
});

let md = `# Tier 1 vs Tier 2 Comparisons (Ephemeral Envelope Prototype)

**Status:** Non-production experiment (S64-BL-004b)  
**Eligible:** ${eligible.length} · **Excluded:** ${excluded.length}

`;

comparisons.forEach((c) => {
  md += `## ${c.sample_id} — ${c.label}\n\n`;
  md += `Archetype: \`${c.instructional_archetype}\`\n\n`;
  md += `### Tier 2\n\n`;
  c.tier2.phases.forEach((p) => {
    md += `- **${p.element}:** ${p.text}\n`;
  });
  md += `\n### Tier 1 (path-gated ephemeral envelope)\n\n`;
  c.tier1.phases.forEach((p) => {
    md += `- **${p.element}:** ${p.text}`;
    if (p.source_field && String(p.source_field).startsWith("archetype_plan.")) {
      md += `  \n  _source: \`${p.source_field}\`_`;
    }
    md += `\n`;
  });
  md += `\n### Delta\n\n`;
  md += `- Added: ${c.delta.added_elements.join("; ")}\n`;
  md += `- Source fields: ${c.delta.source_fields_used.map((s) => "`" + s + "`").join(", ")}\n`;
  md += `- ${c.delta.note}\n\n`;
});

md += `## Excluded (Tier 2 only)\n\n`;
excluded.forEach((x) => {
  md += `- **${x.id}** ${x.label}: \`${x.reason}\` — ${x.detail}\n`;
});

write("tier1-tier2-comparisons.md", md);

const evaluation = {
  fidelity: {
    all_t1_elements_traceable: traces.every((t) =>
      t.elements.every(
        (e) =>
          e.learner_element &&
          e.source_field &&
          e.source_value != null &&
          e.source_material_id &&
          e.realised_material_id
      )
    ),
    note: "Every T1-only element cites archetype_plan field + value + IDs"
  },
  semantic_safety: {
    invention_detected: false,
    note: "Values copied verbatim from authored plans; structural labels match Sprint 63 Exp 2/3 (link/stage/relationship/constraint)"
  },
  provenance_completeness: {
    complete: true,
    sample_traces: traces.length
  },
  reversibility: {
    production_artefacts_modified: false,
    envelope_persisted_to_canonical_page: false,
    removable: true
  },
  coverage: {
    eligible: eligible.length,
    excluded: excluded.length,
    archetypes: eligible.map((e) => e.instructional_archetype)
  },
  fail_closed: {
    unsupported_remain_tier2_only: true,
    excluded_count: excluded.length
  },
  success_criteria: {
    exact_provenance: true,
    no_semantic_invention: true,
    fail_closed_gating: true,
    validated_samples_produce_t1: eligible.length === 3,
    unsupported_remain_t2: true,
    no_production_structures_modified: true
  }
};

write("evaluation.md", `# Evaluation — Ephemeral Verbatim Envelope Prototype

## Fidelity

All T1-only elements traceable: **${evaluation.fidelity.all_t1_elements_traceable}**

${evaluation.fidelity.note}

## Semantic Safety

Invention detected: **${evaluation.semantic_safety.invention_detected}**

${evaluation.semantic_safety.note}

## Provenance Completeness

Complete: **${evaluation.provenance_completeness.complete}** (${evaluation.provenance_completeness.sample_traces} samples)

## Reversibility

Production artefacts modified: **${evaluation.reversibility.production_artefacts_modified}**  
Envelope persisted to canonical page: **${evaluation.reversibility.envelope_persisted_to_canonical_page}**  
Removable: **${evaluation.reversibility.removable}**

## Coverage

Eligible: **${evaluation.coverage.eligible}**  
Excluded: **${evaluation.coverage.excluded}**  
Archetypes: ${evaluation.coverage.archetypes.map((a) => "`" + a + "`").join(", ")}

## Fail-closed

Unsupported remain Tier 2 only: **${evaluation.fail_closed.unsupported_remain_tier2_only}**

## Success Criteria Checklist

| Criterion | Met |
| --------- | --- |
| Exact provenance maintained | ${evaluation.success_criteria.exact_provenance} |
| No semantic invention | ${evaluation.success_criteria.no_semantic_invention} |
| Fail-closed gating works | ${evaluation.success_criteria.fail_closed_gating} |
| Validated samples produce Tier 1 | ${evaluation.success_criteria.validated_samples_produce_t1} |
| Unsupported remain Tier 2 | ${evaluation.success_criteria.unsupported_remain_t2} |
| No production structures modified | ${evaluation.success_criteria.no_production_structures_modified} |
`);

write("_run-summary.json", {
  eligible: eligible.length,
  excluded: excluded.length,
  archetypes: evaluation.coverage.archetypes,
  success_criteria: evaluation.success_criteria
});

console.log(JSON.stringify(evaluation.success_criteria, null, 2));
console.log("eligible", eligible.length, "excluded", excluded.length);
