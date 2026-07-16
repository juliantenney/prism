/**
 * Sprint 64 S64-BL-002b — bounded correlation / retention survey.
 * Diagnostic only. Does not repair or implement preservation.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../../../../../../");

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
}

function getMats(a) {
  if (!a) return [];
  if (Array.isArray(a.materials)) return a.materials.filter(Boolean);
  if (a.materials && typeof a.materials === "object") {
    return Object.entries(a.materials).map(([k, v]) => {
      if (v && typeof v === "object" && !Array.isArray(v)) {
        return Object.assign({ material_id: v.material_id || k }, v);
      }
      return { material_id: k, body: v };
    });
  }
  return [];
}

function getReq(a) {
  return Array.isArray(a && a.required_materials) ? a.required_materials : [];
}

function mid(x) {
  return String((x && (x.material_id || x.id)) || "").trim();
}

function correlateActivity(aid, req, mats) {
  const rows = [];
  const matBy = {};
  const matCounts = {};
  mats.forEach((m) => {
    const id = mid(m);
    if (!id) {
      rows.push({
        activity_id: aid,
        match_status: "identifier absent",
        side: "realised"
      });
      return;
    }
    matCounts[id] = (matCounts[id] || 0) + 1;
    matBy[id] = m;
  });
  Object.keys(matCounts).forEach((id) => {
    if (matCounts[id] > 1) {
      rows.push({
        activity_id: aid,
        source_id: id,
        realised_id: id,
        match_status: "duplicate identifier",
        side: "realised",
        count: matCounts[id]
      });
    }
  });

  const reqBy = {};
  const reqCounts = {};
  req.forEach((r) => {
    const id = mid(r);
    if (!id) {
      rows.push({
        activity_id: aid,
        match_status: "identifier absent",
        side: "source"
      });
      return;
    }
    reqCounts[id] = (reqCounts[id] || 0) + 1;
    reqBy[id] = r;
  });
  Object.keys(reqCounts).forEach((id) => {
    if (reqCounts[id] > 1) {
      rows.push({
        activity_id: aid,
        source_id: id,
        match_status: "duplicate identifier",
        side: "source",
        count: reqCounts[id]
      });
    }
  });

  Object.keys(reqBy).forEach((id) => {
    const matches = mats.filter((m) => mid(m) === id);
    const src = reqBy[id];
    if (matches.length === 1) {
      rows.push({
        activity_id: aid,
        source_id: id,
        source_type: src.material_type || src.type || null,
        realised_matches: 1,
        match_status: "exact 1:1",
        has_plan: !!src.archetype_plan,
        instructional_archetype: src.instructional_archetype || null
      });
    } else if (matches.length === 0) {
      rows.push({
        activity_id: aid,
        source_id: id,
        source_type: src.material_type || src.type || null,
        realised_matches: 0,
        match_status: "missing realised material",
        has_plan: !!src.archetype_plan,
        instructional_archetype: src.instructional_archetype || null
      });
    } else {
      rows.push({
        activity_id: aid,
        source_id: id,
        realised_matches: matches.length,
        match_status: "one-to-many",
        has_plan: !!src.archetype_plan
      });
    }
  });

  Object.keys(matBy).forEach((id) => {
    if (!reqBy[id]) {
      rows.push({
        activity_id: aid,
        realised_id: id,
        match_status: "orphan realised material"
      });
    }
  });

  return rows;
}

function extractCaptureActs(workflow, roleWanted) {
  const captures = workflow && workflow.captures;
  if (!captures || typeof captures !== "object") return null;
  for (const k of Object.keys(captures)) {
    const node = captures[k];
    if (
      node &&
      String(node.role || "").toUpperCase() === String(roleWanted).toUpperCase() &&
      node.parsed &&
      Array.isArray(node.parsed.activities)
    ) {
      return node.parsed.activities;
    }
  }
  return null;
}

function metrics(corr, sampleIds) {
  const rows = corr.filter((r) => sampleIds.includes(r.sample));
  const sourceRows = rows.filter((r) =>
    ["exact 1:1", "missing realised material", "one-to-many"].includes(r.match_status)
  );
  const exact = sourceRows.filter((r) => r.match_status === "exact 1:1");
  const missing = sourceRows.filter((r) => r.match_status === "missing realised material");
  const oneToMany = rows.filter((r) => r.match_status === "one-to-many");
  const orphans = rows.filter((r) => r.match_status === "orphan realised material");
  const dups = rows.filter((r) => r.match_status === "duplicate identifier");
  const idAbsent = rows.filter((r) => r.match_status === "identifier absent");
  const ambEntries = oneToMany.length + dups.length;
  const realisedDenom = exact.length + orphans.length;
  return {
    source_entries_assessed: sourceRows.length,
    exact_1_1: exact.length,
    missing_realised: missing.length,
    orphan_realised: orphans.length,
    one_to_many: oneToMany.length,
    duplicate_identifier: dups.length,
    identifier_absent: idAbsent.length,
    source_coverage_exact_1_1_pct:
      sourceRows.length === 0
        ? null
        : Math.round((1000 * exact.length) / sourceRows.length) / 10,
    realised_coverage_exact_1_1_pct:
      realisedDenom === 0
        ? null
        : Math.round((1000 * exact.length) / realisedDenom) / 10,
    ambiguity_rate_pct:
      rows.length === 0
        ? null
        : Math.round((1000 * ambEntries) / rows.length) / 10
  };
}

const samples = [];
const corr = [];
const retention = [];

// S1 Exp2
{
  const rel =
    "docs/development/sprints/2026-07-16-sprint-63-cognitive-flow-and-reasoning-visibility/experiments/experiment-2/experimental-assembled-page.json";
  const j = readJson(rel);
  const a = j.activities[0];
  samples.push({
    id: "S1",
    name: "Exp2 enzymes mechanism diagnostic",
    path_type: "fixture/diagnostic (both arrays on same activity)",
    required_materials_count: getReq(a).length,
    realised_materials_count: getMats(a).length,
    why_included: "Sprint 63 Experiment 2 candidate with plan",
    artefact: rel
  });
  retention.push({
    sample: "S1",
    path: "diagnostic both-arrays",
    required_materials_retained: "yes",
    plan_retained: getReq(a).some((r) => r.archetype_plan) ? "yes" : "no",
    materials_retained: "yes",
    evidence: rel
  });
  corr.push(
    ...correlateActivity(a.activity_id, getReq(a), getMats(a)).map((r) =>
      Object.assign({ sample: "S1" }, r)
    )
  );
}

const mixedRel =
  "docs/development/sprints/2026-07-15-sprint-60-instructional-archetype-operationalisation/artefacts/mixed-archetype-acceptance/dla-mixed-priority1.page.json";
const mixed = readJson(mixedRel);

// S2 process
{
  const diagRel =
    "docs/development/sprints/2026-07-16-sprint-63-cognitive-flow-and-reasoning-visibility/experiments/experiment-3/process-walkthrough/diagnostic.json";
  const diag = readJson(diagRel);
  const a4 = mixed.activities.find((x) => x.activity_id === "A4");
  const mats = [
    {
      material_id: "A4-M1",
      material_type: "worked_example",
      body: diag.tier2_signals.body_stand_in
    }
  ];
  samples.push({
    id: "S2",
    name: "Exp3 process (DLA required + diagnostic material stand-in)",
    path_type: "fixture/diagnostic cross-artefact",
    required_materials_count: getReq(a4).length,
    realised_materials_count: mats.length,
    why_included: "Sprint 63 Experiment 3 process candidate",
    artefact: [mixedRel, diagRel]
  });
  retention.push({
    sample: "S2",
    path: "DLA-only source + diagnostic material",
    required_materials_retained: "yes (DLA artefact)",
    plan_retained: "yes",
    materials_retained: "yes (diagnostic stand-in)",
    evidence: "Cross-artefact; not a live GAM capture"
  });
  corr.push(
    ...correlateActivity("A4", getReq(a4), mats).map((r) =>
      Object.assign({ sample: "S2" }, r)
    )
  );
}

// S3 mental model
{
  const diagRel =
    "docs/development/sprints/2026-07-16-sprint-63-cognitive-flow-and-reasoning-visibility/experiments/experiment-3/mental-model-building/diagnostic.json";
  const diag = readJson(diagRel);
  const a3 = mixed.activities.find((x) => x.activity_id === "A3");
  const mats = [
    {
      material_id: "A3-M1",
      material_type: "modelling_note",
      body: diag.tier2_signals.body_stand_in
    }
  ];
  samples.push({
    id: "S3",
    name: "Exp3 mental-model (DLA required + diagnostic material stand-in)",
    path_type: "fixture/diagnostic cross-artefact",
    required_materials_count: getReq(a3).length,
    realised_materials_count: mats.length,
    why_included: "Sprint 63 Experiment 3 mental-model candidate",
    artefact: [mixedRel, diagRel]
  });
  retention.push({
    sample: "S3",
    path: "DLA-only source + diagnostic material",
    required_materials_retained: "yes (DLA artefact)",
    plan_retained: "yes",
    materials_retained: "yes (diagnostic stand-in)",
    evidence: "Cross-artefact; not a live GAM capture"
  });
  corr.push(
    ...correlateActivity("A3", getReq(a3), mats).map((r) =>
      Object.assign({ sample: "S3" }, r)
    )
  );
}

// S4 Ed Psych
{
  const rel =
    "docs/development/sprints/2026-07-14-sprint-59-instructional-content-richness-audit/artefacts/first-audit/Introduction_to_Educational_Psychology_dac8dd73.json";
  const j = readJson(rel);
  const dlaActs = extractCaptureActs(j, "DLA");
  const gamActs = extractCaptureActs(j, "GAM");
  let rq = 0;
  let mat = 0;
  let sourceIds = 0;
  let realisedIds = 0;
  dlaActs.forEach((a) => {
    const g = gamActs.find((x) => x.activity_id === a.activity_id) || {};
    const req = getReq(a);
    const mats = getMats(g);
    rq += req.length;
    mat += mats.length;
    sourceIds += req.filter((r) => mid(r)).length;
    realisedIds += mats.filter((m) => mid(m)).length;
    corr.push(
      ...correlateActivity(a.activity_id, req, mats).map((r) =>
        Object.assign({ sample: "S4" }, r)
      )
    );
  });
  const gamHasReq = gamActs.some((a) => getReq(a).length > 0);
  samples.push({
    id: "S4",
    name: "Ed Psych first-audit DLA↔GAM join",
    path_type: "production-like workflow capture (cross-stage)",
    required_materials_count: rq,
    realised_materials_count: mat,
    why_included: "Live capture; multiple required materials per activity",
    artefact: rel,
    gam_capture_retains_required_materials: gamHasReq,
    source_id_presence: sourceIds + "/" + rq,
    realised_id_presence: realisedIds + "/" + mat
  });
  retention.push({
    sample: "S4",
    path: "DLA capture",
    required_materials_retained: "yes",
    plan_retained: "no (no instructional_archetype on these rows)",
    materials_retained: "no (empty at DLA)",
    evidence: "captures[*].role=DLA"
  });
  retention.push({
    sample: "S4",
    path: "GAM partial capture",
    required_materials_retained: gamHasReq ? "yes" : "no",
    plan_retained: "no",
    materials_retained: "yes",
    evidence:
      "captures[*].role=GAM — activities[].materials[] only; required_materials absent on GAM artefact"
  });
}

// S5 Marx
{
  const rel =
    "docs/development/sprints/2026-07-14-sprint-59-instructional-content-richness-audit/artefacts/first-audit/WasMarxRight_ba3f2a76.json";
  const j = readJson(rel);
  const dlaActs = extractCaptureActs(j, "DLA");
  const gamActs = extractCaptureActs(j, "GAM");
  let rq = 0;
  let mat = 0;
  dlaActs.forEach((a) => {
    const g = gamActs.find((x) => x.activity_id === a.activity_id) || {};
    rq += getReq(a).length;
    mat += getMats(g).length;
    corr.push(
      ...correlateActivity(a.activity_id, getReq(a), getMats(g)).map((r) =>
        Object.assign({ sample: "S5" }, r)
      )
    );
  });
  const gamHasReq = gamActs.some((a) => getReq(a).length > 0);
  samples.push({
    id: "S5",
    name: "Marx first-audit DLA↔GAM join",
    path_type: "production-like workflow capture (cross-stage)",
    required_materials_count: rq,
    realised_materials_count: mat,
    why_included: "Second domain; multi-material activities",
    artefact: rel,
    gam_capture_retains_required_materials: gamHasReq
  });
  retention.push({
    sample: "S5",
    path: "GAM partial capture",
    required_materials_retained: gamHasReq ? "yes" : "no",
    plan_retained: "no",
    materials_retained: "yes",
    evidence: "Same pattern as S4"
  });
}

// S6 gam-partial
{
  const rel = "tests/fixtures/page-assemble/gam-partial.json";
  const j = readJson(rel);
  let rq = 0;
  let mat = 0;
  j.activities.forEach((a) => {
    rq += getReq(a).length;
    mat += getMats(a).length;
    corr.push(
      ...correlateActivity(a.activity_id, getReq(a), getMats(a)).map((r) =>
        Object.assign({ sample: "S6" }, r)
      )
    );
  });
  samples.push({
    id: "S6",
    name: "page-assemble gam-partial.json",
    path_type: "partial / material-only",
    required_materials_count: rq,
    realised_materials_count: mat,
    why_included: "Canonical partial GAM fixture",
    artefact: rel
  });
  retention.push({
    sample: "S6",
    path: "partial GAM",
    required_materials_retained: "no",
    plan_retained: "no",
    materials_retained: "yes",
    evidence: rel + " + app.js buildGamV2CopyMaterialAuthoringBrief"
  });
}

// S7 RNA assembled
{
  const rel = "tests/fixtures/page-render/rna-hcv-assembled-vnext-materials-page.json";
  const j = readJson(rel);
  let rq = 0;
  let mat = 0;
  let realisedIds = 0;
  j.activities.forEach((a) => {
    const mats = getMats(a);
    rq += getReq(a).length;
    mat += mats.length;
    realisedIds += mats.filter((m) => mid(m)).length;
    corr.push(
      ...correlateActivity(a.activity_id, getReq(a), mats).map((r) =>
        Object.assign({ sample: "S7" }, r)
      )
    );
  });
  samples.push({
    id: "S7",
    name: "RNA HCV assembled vnext",
    path_type: "material-only assembled",
    required_materials_count: rq,
    realised_materials_count: mat,
    why_included: "Production-like assembled page without required_materials",
    artefact: rel,
    realised_id_presence: realisedIds + "/" + mat
  });
  retention.push({
    sample: "S7",
    path: "assembled materials page",
    required_materials_retained: "no",
    plan_retained: "no",
    materials_retained: "yes",
    evidence: rel
  });
}

// S8 mixed DLA alone (multi required, no materials) — not assessable for join
{
  samples.push({
    id: "S8",
    name: "dla-mixed-priority1.page.json (DLA-only multi-required)",
    path_type: "DLA / pre-GAM",
    required_materials_count: mixed.activities.reduce(
      (n, a) => n + getReq(a).length,
      0
    ),
    realised_materials_count: 0,
    why_included: "Multiple required materials + Priority-1 plans; source-only",
    artefact: mixedRel
  });
  retention.push({
    sample: "S8",
    path: "DLA page",
    required_materials_retained: "yes",
    plan_retained: "yes (3 of 4 rows)",
    materials_retained: "no (pre-GAM)",
    evidence: mixedRel
  });
  // not assessable joins — record as such for A1 ordinary + planned rows without materials
  mixed.activities.forEach((a) => {
    getReq(a).forEach((r) => {
      corr.push({
        sample: "S8",
        activity_id: a.activity_id,
        source_id: mid(r),
        match_status: "not assessable",
        notes: "no realised materials on DLA-only artefact",
        has_plan: !!r.archetype_plan
      });
    });
  });
}

const unmatched = corr.filter(
  (r) =>
    r.match_status &&
    r.match_status !== "exact 1:1" &&
    r.match_status !== "not assessable"
);

const report = {
  generated: "2026-07-16",
  scope: "bounded-sample Sprint 64 S64-BL-002b — not repository-wide",
  samples,
  retention_survey: retention,
  metrics: {
    joined_production_like_S4_S5: metrics(corr, ["S4", "S5"]),
    joined_with_diagnostics_S1_S5: metrics(corr, ["S1", "S2", "S3", "S4", "S5"]),
    note: "S6/S7 have no source contract; S8 not assessable for join"
  },
  code_contract_notes: {
    material_id_creation: "DLA authoring / required_materials rows",
    gam_copy_preserves_id:
      "page-gam-enrich.buildMaterialFromRequired copies required.material_id; GAM V2 brief requires one material per required_materials.material_id",
    uniqueness_enforced_at_gam_boundary:
      "validateGamPageCapture / related checks flag missing, orphan, and duplicate material_id (lib/page-gam-enrich.js)",
    partial_path_omits_required_materials:
      "buildGamV2CopyMaterialAuthoringBrief: activities[] with materials[] only"
  }
};

const outDir = __dirname;
fs.writeFileSync(path.join(outDir, "samples.json"), JSON.stringify(samples, null, 2));
fs.writeFileSync(
  path.join(outDir, "correlation-report.json"),
  JSON.stringify(
    {
      metrics: report.metrics,
      rows: corr
    },
    null,
    2
  )
);
fs.writeFileSync(
  path.join(outDir, "unmatched-cases.json"),
  JSON.stringify(unmatched, null, 2)
);
fs.writeFileSync(
  path.join(outDir, "_analysis-summary.json"),
  JSON.stringify(report, null, 2)
);

console.log(JSON.stringify(report.metrics, null, 2));
console.log("unmatched", unmatched.length);
console.log("samples", samples.length);
