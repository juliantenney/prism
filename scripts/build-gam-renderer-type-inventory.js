"use strict";

/**
 * S68-IMP-012 — Build GAM / learner-renderer type inventory from repository evidence.
 */
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const outDir = path.join(
  repoRoot,
  "docs",
  "development",
  "sprints",
  "2026-07-21-sprint-68-learning-coherence-narrative-flow",
  "artefacts"
);
const fixturesDir = path.join(repoRoot, "tests", "fixtures");

const vnextTypes = require("../lib/learner-renderer-vnext/parse-material").MATERIAL_RENDERER_TYPES;
const registry = require("../lib/beat-material-registry");
const promptLabels = require("../lib/learner-renderer-vnext/prompt-labels");

const PROMPT_FIELDS = Object.keys(promptLabels.PROMPT_FIELD_LABELS || {});

const ACTIVITY_INTERACTION_TYPES = Object.freeze([
  "sequencing",
  "ranking",
  "classification",
  "discussion",
  "analysis",
  "practice",
  "reflection"
]);

const EPISODE_ARCHETYPES = Object.freeze(["understand", "apply", "analyse", "evaluate"]);

const ORDERING_RANKING_MATERIAL_TYPES = Object.freeze([
  "classification_table",
  "planning_table",
  "decision_table",
  "comparison_table",
  "analysis_table",
  "impact_table"
]);

function walkJsonFiles(dir, acc) {
  if (!fs.existsSync(dir)) return acc;
  fs.readdirSync(dir, { withFileTypes: true }).forEach(function (entry) {
    var full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkJsonFiles(full, acc);
    else if (entry.name.endsWith(".json")) acc.push(full);
  });
  return acc;
}

function collectMaterialTypesFromFixtures() {
  var observed = Object.create(null);
  walkJsonFiles(fixturesDir, []).forEach(function (filePath) {
    var rel = path.relative(repoRoot, filePath).replace(/\\/g, "/");
    var raw;
    try {
      raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (_err) {
      return;
    }
    var activities = Array.isArray(raw.activities) ? raw.activities : [];
    activities.forEach(function (activity) {
      var materials = Array.isArray(activity.materials) ? activity.materials : [];
      materials.forEach(function (material) {
        var type = String((material && material.material_type) || "").trim().toLowerCase();
        if (!type) return;
        if (!observed[type]) observed[type] = { fixturePaths: [] };
        if (observed[type].fixturePaths.indexOf(rel) < 0) {
          observed[type].fixturePaths.push(rel);
        }
      });
    });
  });
  return observed;
}

function registryRows() {
  return (registry.MATERIAL_BEAT_REGISTRY || []).slice();
}

function rendererPathFor(type, vnextSupported) {
  if (!vnextSupported) {
    return {
      path: "validation_blocked",
      renderer: "validate-input rejects before renderMaterial fallback",
      static: true,
      interactive: false
    };
  }
  if (["analysis_table", "decision_table", "comparison_table", "classification_table", "planning_table"].indexOf(type) >= 0) {
    return {
      path: "renderMaterial + renderTableWorkspace (Do composition)",
      renderer: "renderMaterial / renderTableWorkspace",
      static: true,
      interactive: "conditional",
      note:
        type === "classification_table" || type === "planning_table"
          ? "Static when fully populated; table_entry in composed Do when blank cells present"
          : "Static in beats/Learn; table_entry in composed Do for A2/A3/A5"
    };
  }
  if (type === "checklist") {
    return { path: "renderMaterial", renderer: "renderMaterial (checklist parser)", static: true, interactive: false };
  }
  return { path: "renderMaterial", renderer: "renderMaterial", static: true, interactive: false };
}

function surfaceCapabilities(type, vnextSupported) {
  if (!vnextSupported) return ["static", "unsupported-interaction"];
  if (["analysis_table", "decision_table", "comparison_table", "classification_table", "planning_table"].indexOf(type) >= 0) {
    return ["table_entry", "static"];
  }
  return ["static"];
}

function buildMaterialEntry(type, context) {
  var vnextSupported = vnextTypes.indexOf(type) >= 0;
  var registryRow = context.registryByType[type];
  var observed = context.observed[type];
  var inRegistry = !!registryRow;
  var inFixtures = !!(observed && observed.fixturePaths.length);
  var treatment = rendererPathFor(type, vnextSupported);

  return {
    type: type,
    category: "material",
    aliases: registryRow && registryRow.aliases ? registryRow.aliases : [],
    emittedByGam: inRegistry,
    observedInFixtures: inFixtures,
    schemaOnly: inRegistry && !inFixtures && !vnextSupported,
    sourceLocations: [
      inRegistry ? "lib/beat-material-registry.js" : null,
      vnextSupported ? "lib/learner-renderer-vnext/parse-material.js" : null,
      inFixtures ? "tests/fixtures/**" : null
    ].filter(Boolean),
    legacyBeat: registryRow ? registryRow.beat : null,
    educationalRoles: treatment.interactive === "conditional"
      ? ["reference", "learner_completion"]
      : vnextSupported
        ? ["instruction", "verification", "transfer", "modelling"]
        : ["instruction", "learner_completion"],
    likelyMoments: treatment.interactive === "conditional" ? ["Learn", "Do"] : ["Learn", "Do", "Check"],
    interactionExpectation: treatment.interactive === "conditional" ? "conditional by composition context" : "static",
    currentRenderTreatment: {
      static: treatment.static,
      interactive: treatment.interactive === true
    },
    rendererPath: treatment.path,
    renderer: treatment.renderer,
    learnerSurfaceCapabilities: surfaceCapabilities(type, vnextSupported),
    vnextSupported: vnextSupported,
    kitchenSinkCoverage: vnextSupported,
    kitchenSinkFixtureId: vnextSupported ? context.kitchenSinkMaterialByType[type] || null : null,
    notes: !vnextSupported
      ? "Registry/GAM type; vNext validate-input rejects — does not reach renderMaterial unsupported fallback in full page path."
      : treatment.note || ""
  };
}

function materialMapFromFixtures(relativePaths) {
  var map = Object.create(null);
  relativePaths.forEach(function (relativePath) {
    var fixturePath = path.join(repoRoot, relativePath);
    if (!fs.existsSync(fixturePath)) return;
    var page = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
    (page.activities || []).forEach(function (activity) {
      (activity.materials || []).forEach(function (material) {
        var type = String(material.material_type || "").trim().toLowerCase();
        if (type && !map[type]) map[type] = material.material_id;
      });
    });
  });
  return map;
}

function kitchenSinkMaterialMap() {
  return materialMapFromFixtures([
    "tests/fixtures/page-render/learner-renderer-kitchen-sink-page.json",
    "tests/fixtures/page-render/rna-hcv-assembled-vnext-materials-page.json"
  ]);
}

function buildTypeToSurfaceMap(materialEntries) {
  var map = Object.create(null);
  materialEntries.forEach(function (entry) {
    (entry.learnerSurfaceCapabilities || []).forEach(function (cap) {
      if (!map[cap]) map[cap] = [];
      if (map[cap].indexOf(entry.type) < 0) map[cap].push(entry.type);
    });
  });
  map.text_entry = [
    "reflection (via learner_task step patterns)",
    "explanation",
    "justification",
    "recommendation",
    "prediction"
  ];
  map.table_entry = [
    "analysis_table",
    "decision_table",
    "comparison_table",
    "classification_table",
    "planning_table"
  ];
  return map;
}

function buildUnsupportedReport(materialEntries) {
  return materialEntries
    .filter(function (entry) {
      return !entry.vnextSupported && (entry.observedInFixtures || entry.emittedByGam);
    })
    .map(function (entry) {
      return {
        type: entry.type,
        observedInFixtures: entry.observedInFixtures,
        interactionExpectation: "unsupported-interaction",
        currentBehaviour: "vNext validation error UNKNOWN_MATERIAL_TYPE",
        recommendedNextStep: "Add renderer or map alias to supported type"
      };
    });
}

function main() {
  var observed = collectMaterialTypesFromFixtures();
  var registryByType = Object.create(null);
  registryRows().forEach(function (row) {
    if (row && row.materialType) registryByType[row.materialType] = row;
  });

  var allTypes = Object.create(null);
  registryRows().forEach(function (row) {
    if (row.materialType) allTypes[row.materialType] = true;
  });
  vnextTypes.forEach(function (type) {
    allTypes[type] = true;
  });
  Object.keys(observed).forEach(function (type) {
    allTypes[type] = true;
  });

  var canonicalMaterialTypes = Object.keys(allTypes).sort();
  var materialEntries = canonicalMaterialTypes.map(function (type) {
    return buildMaterialEntry(type, {
      observed: observed,
      registryByType: registryByType,
      kitchenSinkMaterialByType: kitchenSinkMaterialMap()
    });
  });

  var vnextSupportedCount = materialEntries.filter(function (e) {
    return e.vnextSupported;
  }).length;
  var fixtureCovered = materialEntries.filter(function (e) {
    return e.kitchenSinkCoverage && e.kitchenSinkFixtureId;
  }).length;

  var inventory = {
    generated_at: new Date().toISOString(),
    reviewer_task: "S68-IMP-012",
    methodology:
      "Merged lib/beat-material-registry.js (50 types), lib/learner-renderer-vnext/parse-material.js allowlist (" +
      vnextTypes.length +
      " types), and material_type scan of tests/fixtures/**/*.json.",
    summary: {
      canonical_material_types: canonicalMaterialTypes.length,
      vnext_supported_material_types: vnextSupportedCount,
      registry_material_types: registryRows().length,
      observed_in_fixtures: materialEntries.filter(function (e) {
        return e.observedInFixtures;
      }).length,
      schema_or_registry_only: materialEntries.filter(function (e) {
        return e.emittedByGam && !e.observedInFixtures;
      }).length,
      kitchen_sink_vnext_coverage: fixtureCovered,
      kitchen_sink_coverage_pct: Math.round((fixtureCovered / vnextSupportedCount) * 100),
      prompt_fields: PROMPT_FIELDS.length,
      activity_interaction_types: ACTIVITY_INTERACTION_TYPES.length
    },
    vnext_material_types: vnextTypes.slice(),
    episode_archetypes: EPISODE_ARCHETYPES.slice(),
    prompt_fields: PROMPT_FIELDS.map(function (field) {
      return {
        type: field,
        category: "prompt_field",
        label: promptLabels.labelForPromptField(field),
        rendererPath: "render-composed-moment / render-beat prompt items",
        kitchenSinkCoverage: [
          "self_explanation_prompt",
          "reasoning_orientation",
          "conceptual_contrast_prompt",
          "intellectual_coherence_bridge",
          "argument_structure_hint",
          "transfer_or_application_task"
        ].indexOf(field) >= 0
      };
    }),
    activity_interaction_types: ACTIVITY_INTERACTION_TYPES.map(function (type) {
      return {
        type: type,
        category: "activity_interaction",
        emittedByGam: true,
        observedInFixtures: type === "sequencing",
        learnerSurfaceCapabilities: ["not-applicable"],
        notes:
          "Documented in Sprint 63 inventory; no dedicated learner surface — typically realised via material types and learner_task wording."
      };
    }),
    ordering_ranking_findings: {
      activity_interaction_types: ["sequencing", "ranking", "classification"],
      material_types: ORDERING_RANKING_MATERIAL_TYPES.slice(),
      structures: [
        {
          type: "classification_table",
          orderEncoding: "pipe-table rows; learner completes blank cells",
          vnextTreatment:
            "static when fully populated; table_entry in composed Do when blank cells present (IMP-014A)",
          fixtureEvidence: "tests/fixtures/page-render/rna-hcv-assembled-vnext-materials-page.json"
        },
        {
          type: "planning_table",
          orderEncoding: "sequenced action rows in markdown table",
          vnextTreatment:
            "static when fully populated; table_entry in composed Do when blank cells present (IMP-014A)",
          fixtureEvidence: "tests/fixtures/page-render/rna-hcv-assembled-vnext-materials-page.json"
        },
        {
          type: "decision_table",
          orderEncoding: "row/column grid; some cells blank for completion",
          vnextTreatment: "static in beats; table_entry when composed in Do (heteroscedasticity A4 pattern)"
        }
      ],
      futureSurface: "ordering/ranking surface not implemented — evidence recorded for exception-led follow-up"
    },
    material_types: materialEntries
  };

  var typeToSurface = buildTypeToSurfaceMap(materialEntries);
  var unsupported = buildUnsupportedReport(materialEntries);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "gam-renderer-type-inventory.json"), JSON.stringify(inventory, null, 2));
  fs.writeFileSync(path.join(outDir, "gam-type-to-surface-map.json"), JSON.stringify(typeToSurface, null, 2));
  fs.writeFileSync(
    path.join(outDir, "gam-unsupported-learner-interactions.json"),
    JSON.stringify({ generated_at: inventory.generated_at, unsupported: unsupported }, null, 2)
  );

  console.log(
    JSON.stringify(
      {
        material_types: inventory.summary.canonical_material_types,
        vnext_supported: inventory.summary.vnext_supported_material_types,
        kitchen_sink_coverage_pct: inventory.summary.kitchen_sink_coverage_pct,
        unsupported_count: unsupported.length
      },
      null,
      2
    )
  );
}

main();
