/**
 * Page artefact assembly — activity materials must not silently empty when upstream has bodies.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");
const fidelity = require("../lib/design-page-materials-fidelity.js");
const {
  embedPageActivityMaterialsSectionIntoLearningActivities,
  validatePageMaterialsClosure,
  findLearningActivitiesRows,
  applyGamMaterialsToComposedPage,
  listSubstantiveUpstreamMaterials,
  isUpstreamMaterialRepresentedOnPage
} = require("../lib/page-gam-materials-preserve.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const inflationFullPath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "ld-inflation-workshop-page-full.json"
);

function loadPrismTestApi() {
  const sandbox = { console, setTimeout, clearTimeout, Promise };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  vm.runInContext(fs.readFileSync(appJsPath, "utf8"), sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

const api = loadPrismTestApi();

function richMaterialBody(label) {
  return (
    "## " +
    label +
    "\n\n" +
    "Inflation is the general increase in prices of goods and services over time, which reduces purchasing power. " +
    "The Consumer Price Index (CPI) measures average price changes for a fixed basket. " +
    "Learners must cite scenario evidence and explain transmission mechanisms with at least one numeric example."
  );
}

function gamUpstreamMaterial(materialId, type, content, purpose) {
  return {
    material_id: materialId,
    type: type,
    purpose: purpose || "learner practice",
    content: content
  };
}

function richBlock(heading, detail) {
  return (
    "## " +
    heading +
    "\n\n" +
    detail +
    " Learners must explain mechanisms with evidence, compare cases, and justify conclusions using at least two criteria from the session."
  );
}

function buildRnaStylePartialPage() {
  const upstreamByActivity = {
    A3: [
      gamUpstreamMaterial(
        "M10",
        "scenario",
        richBlock(
          "Case scenarios",
          "Case 1 describes post-war welfare adaptation; Case 2 describes financial crisis instability."
        )
      ),
      gamUpstreamMaterial(
        "M11",
        "task_cards",
        richBlock(
          "Task cards",
          "Card 1: Compare prediction to outcome. Card 2: Cite case evidence. Card 3: State partial alignment."
        )
      ),
      gamUpstreamMaterial(
        "M12",
        "checklist",
        richBlock(
          "Self-check",
          "- Evidence from cases cited\n- Judgement stated\n- Prediction compared directly\n- Reasoning justified"
        )
      )
    ],
    A4: [
      gamUpstreamMaterial(
        "M13",
        "worked_example",
        richBlock(
          "Worked evaluation",
          "Step 1: Name criterion. Step 2: Cite evidence for Marx. Step 3: Cite counter-evidence."
        )
      ),
      gamUpstreamMaterial(
        "M14",
        "analysis_table",
        "| Criterion | Evidence for | Evidence against | Judgement |\n| --- | --- | --- | --- |\n| Explanatory power | | | |"
      ),
      gamUpstreamMaterial(
        "M15",
        "checklist",
        richBlock(
          "Evaluation checklist",
          "- Clear overall judgement\n- Evidence on both sides\n- At least two criteria applied\n- Coherent structure"
        )
      )
    ],
    A5: [
      gamUpstreamMaterial(
        "M16",
        "text",
        richBlock(
          "Criteria exposition",
          "Explanatory power, predictive accuracy, and contemporary relevance guide the final judgement."
        )
      ),
      gamUpstreamMaterial(
        "M17",
        "scenario",
        richBlock(
          "Digital platform scenario",
          "Platform owners extract surplus value while workers face algorithmic management."
        )
      ),
      gamUpstreamMaterial(
        "M18",
        "worked_example",
        richBlock(
          "Worked judgement",
          "Weak judgement names labels only. Strong judgement applies criteria with platform evidence."
        )
      ),
      gamUpstreamMaterial(
        "M19",
        "decision_table",
        "| Criterion | Evidence | Counter-evidence | Judgement |\n| --- | --- | --- | --- |\n| Relevance | | | |"
      ),
      gamUpstreamMaterial(
        "M20",
        "template",
        richBlock(
          "Judgement template",
          "Claim:\nEvidence for:\nCounterpoint:\nFinal judgement:"
        )
      ),
      gamUpstreamMaterial(
        "M21",
        "checklist",
        richBlock(
          "Capstone checklist",
          "- Clear claim\n- Balanced evidence\n- Criteria explicit\n- Transfer attempted"
        )
      ),
      gamUpstreamMaterial(
        "M22",
        "transfer_prompt",
        richBlock(
          "Transfer prompt",
          "Apply the same criteria to a contemporary digital labour case in 100-150 words."
        )
      ),
      gamUpstreamMaterial(
        "M23",
        "consolidation_summary",
        richBlock(
          "Consolidation",
          "Reflect on which Marxian ideas remain useful and which limits you can now explain."
        )
      )
    ]
  };

  const upstream = ["A3", "A4", "A5"].map(function (aid) {
    return {
      activity_id: aid,
      title: aid + " activity",
      materials: upstreamByActivity[aid]
    };
  });

  const loneMaterialKey = {
    A3: "scenario",
    A4: "analysis_table",
    A5: "decision_table"
  };

  const page = {
    artifact_type: "page",
    page_profile: "learner",
    sections: [
      {
        section_id: "learning_sequence",
        heading: "Session plan",
        content: {
          timeline: ["A3", "A4", "A5"].map(function (aid) {
            return { activity_id: aid, duration_minutes: 10 };
          })
        }
      },
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: ["A3", "A4", "A5"].map(function (aid) {
          const loneKey = loneMaterialKey[aid];
          const loneBody = upstreamByActivity[aid].find(function (mat) {
            return mat.type === loneKey || mat.type.replace(/\\_/g, "_") === loneKey;
          });
          return {
            activity_id: aid,
            title: aid + " title",
            learner_task: "Complete all materials for this activity.",
            materials: {
              [loneKey]: loneBody.content
            }
          };
        })
      }
    ]
  };

  return { page: page, upstream: upstream, upstreamByActivity: upstreamByActivity };
}

function pageHasMaterialBody(row, materialId, typeKey, marker) {
  const mats = row.materials || {};
  const bodies = [mats[materialId], mats[typeKey]]
    .concat(
      typeKey === "analysis_table" ? [mats.comparison_table] : [],
      typeKey === "decision_table" ? [mats.guided_judgement_table] : []
    )
    .map(function (val) {
      return String(val || "");
    });
  return bodies.some(function (body) {
    return body.length > 80 && (!marker || body.indexOf(marker) !== -1);
  });
}

test("strict closure fails when A3–A5 preserve only one representative material each", () => {
  const fixture = buildRnaStylePartialPage();
  const result = validatePageMaterialsClosure(fixture.page, {
    upstreamActivityMaterials: fixture.upstream
  });
  assert.equal(result.outcome, "fail");
  assert.deepEqual(result.partial_when_upstream_has_ids.sort(), ["A3", "A4", "A5"]);
  assert.ok(result.missing_upstream_materials.length >= 6);
  assert.ok(
    result.messages.some(function (msg) {
      return /A3.*missing:/i.test(msg) && /M11|M12|task_cards|checklist/i.test(msg);
    })
  );
});

test("GAM merge preserves all substantive upstream materials for A3–A5 by material_id and type", () => {
  const fixture = buildRnaStylePartialPage();
  const merged = applyGamMaterialsToComposedPage(fixture.page, fixture.upstream);
  const rows = findLearningActivitiesRows(merged);
  const a3 = rows.find(function (row) {
    return row.activity_id === "A3";
  });
  const a4 = rows.find(function (row) {
    return row.activity_id === "A4";
  });
  const a5 = rows.find(function (row) {
    return row.activity_id === "A5";
  });

  assert.ok(pageHasMaterialBody(a3, "M10", "scenario", "Case 1"));
  assert.ok(pageHasMaterialBody(a3, "M11", "task_cards", "Card 1"));
  assert.ok(pageHasMaterialBody(a3, "M12", "checklist", "Self-check"));

  assert.ok(pageHasMaterialBody(a4, "M13", "worked_example", "Worked evaluation"));
  assert.ok(pageHasMaterialBody(a4, "M14", "analysis_table", "Criterion"));
  assert.ok(pageHasMaterialBody(a4, "M15", "checklist", "Evaluation checklist"));

  assert.ok(pageHasMaterialBody(a5, "M16", "text", "Criteria exposition"));
  assert.ok(pageHasMaterialBody(a5, "M17", "scenario", "Digital platform"));
  assert.ok(pageHasMaterialBody(a5, "M18", "worked_example", "Worked judgement"));
  assert.ok(pageHasMaterialBody(a5, "M19", "decision_table", "Criterion"));
  assert.ok(pageHasMaterialBody(a5, "M20", "template", "Judgement template"));
  assert.ok(pageHasMaterialBody(a5, "M21", "checklist", "Capstone checklist"));
  assert.ok(pageHasMaterialBody(a5, "M22", "transfer_prompt", "Transfer prompt"));
  assert.ok(pageHasMaterialBody(a5, "M23", "consolidation_summary", "Consolidation"));

  const closure = validatePageMaterialsClosure(merged, {
    upstreamActivityMaterials: fixture.upstream
  });
  assert.equal(closure.outcome, "pass", closure.messages.join("; "));
});

test("each substantive upstream material is represented by material_id or unique type key", () => {
  const fixture = buildRnaStylePartialPage();
  const merged = applyGamMaterialsToComposedPage(fixture.page, fixture.upstream);
  const a5 = findLearningActivitiesRows(merged).find(function (row) {
    return row.activity_id === "A5";
  });
  const upstreamA5 = fixture.upstream.find(function (act) {
    return act.activity_id === "A5";
  });
  listSubstantiveUpstreamMaterials(upstreamA5).forEach(function (mat) {
    assert.equal(
      isUpstreamMaterialRepresentedOnPage(
        a5.materials,
        mat,
        listSubstantiveUpstreamMaterials(upstreamA5),
        { page: merged, activityId: "A5" }
      ),
      true,
      "missing representation for " + mat.material_id + " (" + mat.type + ")"
    );
  });
});

test("material_bank + content_ref satisfies page materials closure without inline duplication", () => {
  const body = richMaterialBody("M99");
  const page = {
    artifact_type: "page",
    material_bank: {
      A1: {
        M99: { material_id: "M99", type: "text", content: body }
      }
    },
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: [
          {
            activity_id: "A1",
            materials: {
              M99: {
                material_id: "M99",
                type: "text",
                content_ref: "material_bank.A1.M99"
              }
            }
          }
        ]
      }
    ]
  };
  const upstream = [
    {
      activity_id: "A1",
      materials: [gamUpstreamMaterial("M99", "text", body, "orientation")]
    }
  ];
  const closure = validatePageMaterialsClosure(page, { upstreamActivityMaterials: upstream });
  assert.equal(closure.outcome, "pass", closure.messages.join("; "));
});

test("applyPageCompositionValidationForUtilitiesPage merges all upstream materials for partial A3–A5", () => {
  const fixture = buildRnaStylePartialPage();
  const validation = api.applyPageCompositionValidationForUtilitiesPage(fixture.page, {
    upstreamActivityMaterials: fixture.upstream,
    upstreamLearningActivities: { activities: fixture.upstream }
  });
  assert.equal(validation.outcome, "pass", (validation.messages || []).join("; "));
  const a3 = findLearningActivitiesRows(fixture.page).find(function (row) {
    return row.activity_id === "A3";
  });
  assert.ok(pageHasMaterialBody(a3, "M11", "task_cards", "Card 1"));
  assert.ok(pageHasMaterialBody(a3, "M12", "checklist", "Self-check"));
});

test("page metadata includes materials-closure debug stamp after compose validation", () => {
  const fixture = buildRnaStylePartialPage();
  const validation = api.applyPageCompositionValidationForUtilitiesPage(fixture.page, {
    upstreamActivityMaterials: fixture.upstream,
    upstreamLearningActivities: { activities: fixture.upstream }
  });
  assert.equal(validation.outcome, "pass");
  const debug = fixture.page.metadata && fixture.page.metadata.page_materials_closure_debug;
  assert.ok(debug, "expected page_materials_closure_debug metadata");
  assert.equal(debug.preserve_module_loaded_successfully, true);
  assert.equal(debug.strict_closure_validation_ran, true);
  assert.equal(debug.closure_outcome, "pass");
  assert.ok(debug.upstream_substantive_material_count >= 14);
  assert.ok(debug.preserved_material_id_count >= 14);
  assert.equal(Array.isArray(debug.missing_upstream_materials), true);
  assert.equal(debug.workflow_completion_gate_decision, "allowed");
});

function gamMaterial(type, content) {
  return {
    material_id: "M_" + type,
    type: type,
    purpose: "learner practice",
    content: content
  };
}

function buildUpstreamGam() {
  return ["LO1", "LO2", "LO3", "LO4", "LO5", "LO6"].map(function (aid) {
    return {
      activity_id: aid,
      title: aid + " activity",
      materials: [gamMaterial("text", richMaterialBody(aid))]
    };
  });
}

function buildPartialEmptyPage() {
  const sectionBodies = {};
  ["LO1", "LO2", "LO3", "LO4", "LO5", "LO6"].forEach(function (aid) {
    sectionBodies[aid] = richMaterialBody(aid + " section");
  });
  return {
    artifact_type: "page",
    page_profile: "learner",
    sections: [
      {
        section_id: "learning_sequence",
        heading: "Session plan",
        content: {
          timeline: ["LO1", "LO2", "LO3", "LO4", "LO5", "LO6"].map(function (aid) {
            return { activity_id: aid, duration_minutes: 10 };
          })
        }
      },
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: ["LO1", "LO2", "LO3", "LO4", "LO5", "LO6"].map(function (aid) {
          const hasInline =
            aid === "LO1" || aid === "LO2" || aid === "LO6";
          return {
            activity_id: aid,
            title: aid + " title",
            learner_task: "Complete the activity.",
            materials: hasInline ? { text: richMaterialBody(aid + " inline") } : {}
          };
        })
      },
      {
        section_id: "activity_materials",
        heading: "Activity materials",
        content: Object.keys(sectionBodies).flatMap(function (aid) {
          return [
            {
              activity_id: aid,
              type: "text",
              content: sectionBodies[aid]
            },
            {
              activity_id: aid,
              type: "checklist",
              content: "## Check your work\n- Criterion one with evidence\n- Criterion two with mechanism"
            }
          ];
        })
      }
    ]
  };
}

function rowMaterials(page, aid) {
  const rows = findLearningActivitiesRows(page);
  const row = rows.find(function (entry) {
    return String(entry.activity_id) === aid;
  });
  return row && row.materials ? row.materials : null;
}

test("compressed placeholder detector rejects preservation shorthand", () => {
  assert.equal(
    fidelity.stringLooksCompressedPlaceholder("...(full content preserved above)"),
    true
  );
  assert.equal(fidelity.stringLooksCompressedPlaceholder("Short stub..."), true);
  assert.equal(fidelity.stringLooksCompressedPlaceholder(richMaterialBody("OK")), false);
});

test("validatePageMaterialsClosure fails when LO3–LO5 are empty but upstream GAM has bodies", () => {
  const page = buildPartialEmptyPage();
  const upstream = buildUpstreamGam();
  const result = validatePageMaterialsClosure(page, { upstreamActivityMaterials: upstream });
  assert.equal(result.outcome, "fail");
  assert.deepEqual(result.empty_when_upstream_has_ids.sort(), ["LO3", "LO4", "LO5"]);
});

test("embedPageActivityMaterialsSectionIntoLearningActivities fills empty row materials from page section", () => {
  const page = buildPartialEmptyPage();
  const embedded = embedPageActivityMaterialsSectionIntoLearningActivities(page);
  assert.ok(embedded.embedded >= 3);
  ["LO3", "LO4", "LO5"].forEach(function (aid) {
    const mats = rowMaterials(page, aid);
    assert.ok(mats && mats.text, aid + " should have embedded text");
    assert.match(String(mats.text), new RegExp(aid + " section"));
    assert.equal(fidelity.materialsObjectHasSubstantiveContent(mats), true);
  });
});

test("applyPageCompositionValidationForUtilitiesPage merges section materials and passes closure for LO3–LO5", () => {
  const page = buildPartialEmptyPage();
  const upstreamGam = buildUpstreamGam();
  const validation = api.applyPageCompositionValidationForUtilitiesPage(page, {
    upstreamActivityMaterials: upstreamGam,
    upstreamLearningActivities: { activities: upstreamGam }
  });
  assert.equal(validation.outcome, "pass", (validation.messages || []).join("; "));
  ["LO3", "LO4", "LO5"].forEach(function (aid) {
    const mats = rowMaterials(page, aid);
    assert.ok(mats && String(mats.text || "").length > 120, aid + " materials preserved");
    assert.doesNotMatch(String(mats.text || ""), /preserved above/i);
  });
});

test("validatePageMaterialsClosure fails on compressed placeholder strings in final page rows", () => {
  const page = buildPartialEmptyPage();
  embedPageActivityMaterialsSectionIntoLearningActivities(page);
  const lo3row = findLearningActivitiesRows(page).find(function (row) {
    return row.activity_id === "LO3";
  });
  lo3row.materials = { text: "Intro paragraph...(full content preserved above)" };
  const result = validatePageMaterialsClosure(page, { upstreamActivityMaterials: [] });
  assert.equal(result.outcome, "fail");
  assert.ok(result.compression_violations.length > 0);
});

test("inflation workshop full fixture: section embed restores all five activity material rows", () => {
  const page = JSON.parse(fs.readFileSync(inflationFullPath, "utf8"));
  const before = findLearningActivitiesRows(page).every(function (row) {
    return Array.isArray(row.materials) ? row.materials.length === 0 : materialsEmpty(row.materials);
  });
  assert.equal(before, true, "fixture rows start with empty materials arrays");
  embedPageActivityMaterialsSectionIntoLearningActivities(page);
  findLearningActivitiesRows(page).forEach(function (row) {
    assert.equal(
      fidelity.materialsObjectHasSubstantiveContent(row.materials),
      true,
      row.activity_id + " should have substantive materials after embed"
    );
  });
});

function materialsEmpty(materials) {
  if (materials == null) return true;
  if (Array.isArray(materials)) return materials.length === 0;
  return Object.keys(materials).length === 0;
}

test("capture validation blocks workflow step when materials closure fails", () => {
  const page = buildPartialEmptyPage();
  delete page.sections[2];
  const validation = validatePageMaterialsClosure(page, {
    upstreamActivityMaterials: buildUpstreamGam()
  });
  assert.equal(validation.outcome, "fail");
  api.applyPageMaterialsValidationToCapture("page-step", validation);
  assert.match(
    api.workflowRunPageMaterialsGateMessage("page-step"),
    /materials closure failed/i
  );
});
