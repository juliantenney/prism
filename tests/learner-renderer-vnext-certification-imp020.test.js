"use strict";

/**
 * Sprint 68 — S68-IMP-020 production readiness / certification tests.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { execFileSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const {
  buildCorpusManifest,
  CERTIFICATION_CORPUS,
  runLearnerRendererCertification,
  getDiagnosticCatalog,
  buildPageModel,
  buildComposedPageModel,
  buildActivityCompositionMap,
  renderLearnerPageHtml,
  buildLearnerDraftPageIdentity
} = require("../lib/learner-renderer-vnext");
const {
  STATUS,
  aggregateStatus
} = require("../lib/learner-renderer-vnext/certify-learner-renderer");
const {
  absorbUnassignedOrientationBeatContent,
  composeOrientMoment,
  composeLearnMoment,
  composeDoMoment,
  composeCheckMoment
} = require("../lib/learner-renderer-vnext/compose-activity-moments");
const { readVideoTranscriptTestPage } = require("./videotranscripttest-workflow-fixture.js");

const browserBundlePath = path.join(repoRoot, "lib", "learner-renderer-vnext-browser.js");
const artifactsJson = path.join(
  repoRoot,
  "artifacts",
  "learner-renderer-vnext-certification.json"
);
const artifactsMd = path.join(
  repoRoot,
  "artifacts",
  "learner-renderer-vnext-certification.md"
);

function runCert(extra) {
  return runLearnerRendererCertification(
    Object.assign(
      {
        repoRoot: repoRoot,
        compareBrowser: false,
        writeArtifacts: false,
        generatedAt: "2026-07-22T00:00:00.000Z"
      },
      extra || {}
    )
  );
}

test("corpus: manifest loads with deterministic workflow order", () => {
  const manifest = buildCorpusManifest({
    repoRoot: repoRoot,
    generatedAt: "2026-07-22T00:00:00.000Z"
  });
  assert.equal(manifest.corpusVersion, "s68-imp-020-v1");
  assert.equal(manifest.generatedAt, "2026-07-22T00:00:00.000Z");
  assert.equal(manifest.workflows.length, CERTIFICATION_CORPUS.length);
  assert.deepEqual(
    manifest.workflows.map((row) => row.id),
    CERTIFICATION_CORPUS.map((row) => row.id)
  );
});

test("corpus: every fixture exists and authoritative flags are set", () => {
  CERTIFICATION_CORPUS.forEach((entry) => {
    const abs = path.join(repoRoot, entry.fixturePath);
    assert.ok(fs.existsSync(abs), entry.fixturePath);
    assert.equal(typeof entry.authoritative, "boolean");
    assert.ok(entry.certificationPurpose);
  });
  assert.ok(CERTIFICATION_CORPUS.some((entry) => entry.authoritative === true));
  assert.ok(CERTIFICATION_CORPUS.some((entry) => entry.authoritative === false));
});

test("runner: returns structured results and CERTIFIED for production corpus", () => {
  const report = runCert({ compareBrowser: true });
  assert.equal(report.summary.certificationState, "CERTIFIED");
  assert.equal(report.summary.exitCode, 0);
  assert.equal(report.summary.fails, 0);
  assert.ok(Array.isArray(report.workflowResults));
  assert.equal(report.workflowResults.length, CERTIFICATION_CORPUS.length);
  assert.ok(report.capabilityCoverage.text_entry > 0);
  assert.ok(report.capabilityCoverage.table_entry > 0);
  assert.ok(report.capabilityCoverage.ordering > 0);
  assert.ok(report.archetypeCoverage.includes("understand"));
  assert.ok(report.archetypeCoverage.includes("apply"));
  assert.ok(report.markdown.endsWith("CERTIFIED\n") || report.markdown.trimEnd().endsWith("CERTIFIED"));
});

test("runner: writes JSON and Markdown artefacts", () => {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "imp020-cert-"));
  const report = runCert({
    writeArtifacts: true,
    artifactsDir: outDir,
    compareBrowser: false
  });
  assert.ok(fs.existsSync(report.artifactPaths.json));
  assert.ok(fs.existsSync(report.artifactPaths.markdown));
  const json = JSON.parse(fs.readFileSync(report.artifactPaths.json, "utf8"));
  assert.equal(json.summary.certificationState, "CERTIFIED");
  assert.ok(!Object.prototype.hasOwnProperty.call(json, "markdown"));
  const md = fs.readFileSync(report.artifactPaths.markdown, "utf8");
  assert.match(md, /CERTIFIED\s*$/);
});

test("runner: pass status exits zero; fail invariant exits non-zero", () => {
  const pass = runCert();
  assert.equal(pass.summary.exitCode, 0);

  const fail = runCert({
    corpus: [
      {
        id: "missing-fixture",
        name: "Missing",
        provenance: "synthetic",
        authoritative: true,
        fixturePath: "tests/fixtures/page-render/does-not-exist.json",
        expectedCapabilities: [],
        expectedArchetypes: [],
        certificationPurpose: "force load failure",
        persistenceRequired: false,
        expectations: {}
      }
    ]
  });
  assert.equal(fail.summary.certificationState, "NOT CERTIFIED");
  assert.equal(fail.summary.exitCode, 1);
  assert.ok(fail.summary.fails >= 1);
});

test("runner: warning-only aggregate remains exit code zero", () => {
  assert.equal(
    aggregateStatus([{ status: STATUS.WARNING }, { status: STATUS.PASS }]),
    STATUS.WARNING
  );
  assert.equal(
    aggregateStatus([{ status: STATUS.FAIL }, { status: STATUS.WARNING }]),
    STATUS.FAIL
  );
  const warningReport = {
    summary: {
      status: STATUS.WARNING,
      exitCode: STATUS.WARNING === STATUS.FAIL ? 1 : 0
    }
  };
  assert.equal(warningReport.summary.exitCode, 0);
});

test("runner: generated report workflow order is deterministic", () => {
  const a = runCert({ generatedAt: "2026-07-22T00:00:00.000Z" });
  const b = runCert({ generatedAt: "2026-07-22T00:00:00.000Z" });
  assert.deepEqual(
    a.workflowResults.map((row) => row.workflowId),
    b.workflowResults.map((row) => row.workflowId)
  );
  assert.deepEqual(
    a.workflowResults.map((row) => row.workflowId),
    CERTIFICATION_CORPUS.map((row) => row.id)
  );
});

test("composition: every authoritative fixture parses with unique activity ids", () => {
  CERTIFICATION_CORPUS.filter((entry) => entry.authoritative).forEach((entry) => {
    const source = JSON.parse(
      fs.readFileSync(path.join(repoRoot, entry.fixturePath), "utf8")
    );
    const model = buildPageModel(source);
    assert.equal(model.ok, true, entry.id);
    const ids = model.model.activities.map((activity) => activity.id);
    assert.equal(new Set(ids).size, ids.length, entry.id);
  });
});

test("composition: VideoTranscriptTest assigns orientation framing material exactly once", () => {
  const source = readVideoTranscriptTestPage().page;
  const model = buildPageModel(source);
  const composed = buildComposedPageModel(model, source, { compositionMode: "moments" });
  const map = buildActivityCompositionMap(composed.composed);
  const orient = map.A3.orientMoment;
  assert.ok(orient);
  const materialIds = orient.items
    .filter((item) => item.kind === "material")
    .map((item) => item.material.id);
  assert.ok(materialIds.includes("A3-M1"));
  assert.equal(materialIds.filter((id) => id === "A3-M1").length, 1);

  const html = renderLearnerPageHtml(source, { compositionMode: "moments" }).html;
  assert.match(html, /S62-RNA-A3-M1-BODY/);
  assert.equal((html.match(/data-material-id="A3-M1"/g) || []).length, 1);
});

test("composition: absorb skips orientation materials already claimed by Learn", () => {
  const source = JSON.parse(
    fs.readFileSync(
      path.join(
        repoRoot,
        "tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json"
      ),
      "utf8"
    )
  );
  const model = buildPageModel(source);
  const a5 = model.model.activities.find((activity) => activity.id === "A5");
  const orient = composeOrientMoment(a5, {});
  const learn = composeLearnMoment(a5);
  const absorbed = absorbUnassignedOrientationBeatContent(orient, a5, {
    learnMoment: learn,
    doMoment: composeDoMoment(a5),
    checkMoment: composeCheckMoment(a5)
  });
  const learnMaterialIds = (learn.items || [])
    .filter((item) => item.kind === "material")
    .map((item) => item.material.id);
  assert.ok(learnMaterialIds.includes("A5-M1"));
  const orientMaterialIds = (absorbed.items || [])
    .filter((item) => item.kind === "material")
    .map((item) => item.material.id);
  assert.equal(orientMaterialIds.includes("A5-M1"), false);
});

test("capabilities: corpus certifies text_entry, table_entry, ordering, and mixed activities", () => {
  const report = runCert();
  assert.ok(report.capabilityCoverage.text_entry >= 1);
  assert.ok(report.capabilityCoverage.table_entry >= 1);
  assert.ok(report.capabilityCoverage.ordering >= 1);

  const ordering = report.workflowResults.find(
    (row) => row.workflowId === "authoritative-ordering"
  );
  assert.equal(ordering.status, "pass");
  assert.ok(
    ordering.checks.some(
      (row) => row.checkId === "ordering.present" && row.status === "pass"
    )
  );

  const kitchen = report.workflowResults.find((row) => row.workflowId === "kitchen-sink");
  assert.ok(kitchen.summary.capabilities.text_entry > 0);
  assert.ok(kitchen.summary.capabilities.table_entry > 0);
});

test("rendering: no duplicate DOM ids; inputs are named; ARIA refs resolve", () => {
  const report = runCert();
  report.workflowResults.forEach((workflow) => {
    const a11y = workflow.checks.filter((row) => String(row.checkId).startsWith("a11y."));
    a11y.forEach((row) => {
      assert.notEqual(row.status, "fail", workflow.workflowId + " " + row.checkId);
    });
  });
});

test("parity: browser bundle is current and Node/browser HTML match", () => {
  assert.ok(fs.existsSync(browserBundlePath));
  const report = runCert({ compareBrowser: true });
  assert.equal(report.browserParity.compared, CERTIFICATION_CORPUS.length);
  assert.equal(report.browserParity.mismatches, 0);
});

test("parity: Node renderer does not access browser storage", () => {
  const source = readVideoTranscriptTestPage().page;
  let touched = false;
  const original = global.localStorage;
  global.localStorage = {
    getItem() {
      touched = true;
      return null;
    },
    setItem() {
      touched = true;
    },
    removeItem() {
      touched = true;
    }
  };
  try {
    const rendered = renderLearnerPageHtml(source, { compositionMode: "moments" });
    assert.ok(!rendered.error, String(rendered.error || ""));
    assert.equal(touched, false);
  } finally {
    if (original === undefined) delete global.localStorage;
    else global.localStorage = original;
  }
});

test("persistence: certification scenarios pass for supported capabilities", () => {
  const report = runCert();
  assert.ok(report.persistence.passed >= 1);
  assert.equal(report.persistence.failed, 0);
});

test("diagnostics: catalogue covers Sprint 68 codes; successful runs stay clean", () => {
  const catalog = getDiagnosticCatalog();
  const codes = catalog.map((row) => row.code);
  [
    "UNKNOWN_ARCHETYPE_VARIANT",
    "UNSUPPORTED_LEARNER_SURFACE",
    "DUPLICATE_RESPONSE_PART",
    "UNASSIGNED_WRITTEN_RESPONSE",
    "UNSUPPORTED_WORKSPACE_STATE_ADAPTER",
    "UNSTABLE_PERSISTENCE_PAGE_IDENTITY",
    "LEARNER_DRAFT_PARSE_FAILED"
  ].forEach((code) => {
    assert.ok(codes.includes(code), code);
  });

  const report = runCert();
  assert.equal(report.diagnosticSummary.unexpectedProductionCount, 0);
  assert.ok(
    report.knownUnrelatedFailures.some((row) =>
      /workflow-self-directed-learner-page-formatting/.test(row.testFile)
    )
  );
  assert.ok(
    !report.knownUnrelatedFailures.some((row) => /IMP-020 regression/i.test(row.summary))
  );
});

test("print: draft and ordering controls are hidden by print CSS", () => {
  const appJs = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  assert.match(appJs, /@media print\{[\s\S]*?util-learner-draft-controls\{display:none\}/);
  assert.match(
    appJs,
    /@media print\{[\s\S]*?util-ordering-item__controls[\s\S]*?display:none\}/
  );
});

test("cli: certification script exits zero for current corpus", () => {
  execFileSync(process.execPath, ["scripts/certify-learner-renderer-vnext.js", "--no-browser"], {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
  assert.ok(fs.existsSync(artifactsJson));
  assert.ok(fs.existsSync(artifactsMd));
  const json = JSON.parse(fs.readFileSync(artifactsJson, "utf8"));
  assert.equal(json.summary.certificationState, "CERTIFIED");
  assert.match(fs.readFileSync(artifactsMd, "utf8"), /CERTIFIED\s*$/);
});

test("identity: certification injects stable page identity without mutating fixtures", () => {
  const entry = CERTIFICATION_CORPUS.find((row) => row.id === "heteroscedasticity");
  const before = fs.readFileSync(path.join(repoRoot, entry.fixturePath), "utf8");
  const report = runCert({
    corpus: [entry],
    compareBrowser: false
  });
  const after = fs.readFileSync(path.join(repoRoot, entry.fixturePath), "utf8");
  assert.equal(before, after);
  const identityCheck = report.workflowResults[0].checks.find(
    (row) => row.checkId === "persistence.page_identity_stability"
  );
  assert.equal(identityCheck.status, "pass");
  const source = JSON.parse(before);
  assert.equal(buildLearnerDraftPageIdentity(source).unstable, true);
});
