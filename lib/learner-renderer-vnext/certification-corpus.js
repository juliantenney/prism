"use strict";

/**
 * S68-IMP-020 — Production certification corpus for learner-renderer-vNext.
 * Deterministic except for optional report timestamps.
 */

var CERTIFICATION_CORPUS_VERSION = "s68-imp-020-v1";

var CERTIFICATION_CORPUS = Object.freeze([
  Object.freeze({
    id: "videotranscripttest",
    name: "VideoTranscriptTest",
    provenance: "Authoritative production VideoTranscriptTest workflow (IMP-014C)",
    authoritative: true,
    fixturePath: "tests/fixtures/workflows/videotranscripttest-assembled-page.json",
    workflowId: "0d1c12c0-ad1c-449f-8ad9-8f90b8f01097",
    expectedCapabilities: Object.freeze(["text_entry", "table_entry"]),
    expectedArchetypes: Object.freeze(["understand", "apply", "analyse", "evaluate"]),
    certificationPurpose:
      "Primary production-shaped RNA workflow with journey-compressed beats, tables, and multi-part text",
    persistenceRequired: true,
    expectations: Object.freeze({
      minActivityCount: 6,
      requireMomentsComposition: true,
      allowBeatFallback: false,
      allowUnstablePersistenceIdentity: true
    })
  }),
  Object.freeze({
    id: "heteroscedasticity",
    name: "Heteroscedasticity",
    provenance: "Sprint 67 vNext golden page fixture",
    authoritative: true,
    fixturePath: "tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json",
    workflowId: null,
    expectedCapabilities: Object.freeze(["text_entry", "table_entry"]),
    expectedArchetypes: Object.freeze(["understand", "apply", "analyse", "evaluate"]),
    certificationPurpose:
      "Full lesson regression: text_entry, table_entry, prompt_set multi-part, assessment coexistence",
    persistenceRequired: true,
    expectations: Object.freeze({
      minActivityCount: 5,
      requireMomentsComposition: true,
      allowBeatFallback: false,
      allowUnstablePersistenceIdentity: true
    })
  }),
  Object.freeze({
    id: "kitchen-sink",
    name: "Kitchen Sink",
    provenance: "S68 GAM type-coverage synthetic fixture",
    authoritative: false,
    fixturePath: "tests/fixtures/page-render/learner-renderer-kitchen-sink-page.json",
    workflowId: null,
    expectedCapabilities: Object.freeze(["text_entry", "table_entry"]),
    expectedArchetypes: Object.freeze(["understand", "apply", "analyse", "evaluate"]),
    certificationPurpose: "Material-type coverage across archetype variants",
    persistenceRequired: true,
    expectations: Object.freeze({
      minActivityCount: 5,
      requireMomentsComposition: true,
      allowBeatFallback: false,
      allowUnstablePersistenceIdentity: true
    })
  }),
  Object.freeze({
    id: "rna-episode-plan-v1",
    name: "RNA episode-plan-v1",
    provenance: "S62 RNA materials page with episode-plan-v1 beat vocabulary",
    authoritative: true,
    fixturePath: "tests/fixtures/page-render/rna-hcv-assembled-vnext-materials-page.json",
    workflowId: null,
    expectedCapabilities: Object.freeze(["text_entry", "table_entry"]),
    expectedArchetypes: Object.freeze(["understand", "apply", "analyse", "evaluate"]),
    certificationPurpose: "Archetype and table-routing regression (IMP-014A/B)",
    persistenceRequired: true,
    expectations: Object.freeze({
      minActivityCount: 6,
      requireMomentsComposition: true,
      allowBeatFallback: false,
      allowUnstablePersistenceIdentity: true
    })
  }),
  Object.freeze({
    id: "generic-moments-new01",
    name: "Generic moments",
    provenance: "Minimal generic composition proof fixture (IMP-013)",
    authoritative: false,
    fixturePath: "tests/fixtures/page-render/learner-renderer-generic-moments-new01-page.json",
    workflowId: null,
    expectedCapabilities: Object.freeze(["text_entry"]),
    expectedArchetypes: Object.freeze(["understand"]),
    certificationPurpose: "Activity-ID-independent moment composition",
    persistenceRequired: false,
    expectations: Object.freeze({
      minActivityCount: 1,
      requireMomentsComposition: true,
      allowBeatFallback: false,
      allowUnstablePersistenceIdentity: true
    })
  }),
  Object.freeze({
    id: "authoritative-ordering",
    name: "Authoritative PRISM ordering",
    provenance:
      "Authoritative PRISM sequencing schema adapted from sequencing-rollout; Sprint 59 Ed Psych A3",
    authoritative: true,
    fixturePath: "tests/fixtures/page-render/prism-authoritative-ordering-page.json",
    workflowId: "fixture-seq-authoritative",
    expectedCapabilities: Object.freeze(["ordering"]),
    expectedArchetypes: Object.freeze(["understand"]),
    certificationPurpose: "Genuine ordering surface, Do placement, persistence of item order",
    persistenceRequired: true,
    expectations: Object.freeze({
      minActivityCount: 2,
      requireMomentsComposition: true,
      allowBeatFallback: false,
      allowUnstablePersistenceIdentity: false,
      requireOrdering: true
    })
  })
]);

function buildCorpusManifest(options) {
  var opts = options || {};
  var fs = require("fs");
  var path = require("path");
  var repoRoot = opts.repoRoot || path.resolve(__dirname, "..", "..");

  var workflows = CERTIFICATION_CORPUS.map(function (entry) {
    var abs = path.join(repoRoot, entry.fixturePath);
    var source = JSON.parse(fs.readFileSync(abs, "utf8"));
    var activityCount = Array.isArray(source.activities) ? source.activities.length : 0;
    return {
      id: entry.id,
      name: entry.name,
      provenance: entry.provenance,
      authoritative: entry.authoritative,
      fixturePath: entry.fixturePath,
      workflowId: entry.workflowId,
      activityCount: activityCount,
      expectedCapabilities: entry.expectedCapabilities.slice(),
      expectedArchetypes: entry.expectedArchetypes.slice(),
      certificationPurpose: entry.certificationPurpose,
      persistenceRequired: entry.persistenceRequired,
      expectations: Object.assign({}, entry.expectations)
    };
  });

  return {
    corpusVersion: CERTIFICATION_CORPUS_VERSION,
    generatedAt: opts.generatedAt || null,
    workflows: workflows
  };
}

module.exports = {
  CERTIFICATION_CORPUS_VERSION: CERTIFICATION_CORPUS_VERSION,
  CERTIFICATION_CORPUS: CERTIFICATION_CORPUS,
  buildCorpusManifest: buildCorpusManifest
};
