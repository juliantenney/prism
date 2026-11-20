/**
 * Sprint 101E — Practice selection layout via the real export/packaging renderer path.
 *
 * Earlier layout tests exercised modular lib/learner-renderer-vnext/*.js.
 * Packaging loads window.PRISM_LEARNER_RENDERER_VNEXT from the generated
 * lib/learner-renderer-vnext-browser.js bundle. This file must stay in sync
 * (npm run build:learner-renderer-vnext-browser) or ZIP learner-page.html
 * still shows Question 15x + orphan Judge Claim shells.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const learnerPackage = require("../lib/learner-package.js");
const {
  checkLearnerRendererVnextBrowserFreshness
} = require("../scripts/check-learner-renderer-vnext-browser.js");
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS,
  loadLearnerRendererVNextBrowserInSandbox,
  wireBrowserGlobalThis
} = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const EVIDENCE_DIR = path.join(repoRoot, "tmp-s101e-export-path-evidence");

function claimSelection(activityId, id, title, prompt, correct) {
  return {
    material_id: id,
    material_type: "selection",
    activity_id: activityId,
    title: title,
    body_format: "markdown",
    body: "Choose the judgement that best describes the inference. Check your answer after selecting.",
    selection: {
      form: "single_select",
      prompt: prompt,
      options: [
        { key: "supported", text: "Supported by the stated evidence" },
        { key: "overreach", text: "Conclusion goes beyond the evidence" },
        { key: "insufficient", text: "Insufficient information to judge" }
      ],
      correct_answer: correct,
      feedback: "Explanatory feedback for " + title + "."
    }
  };
}

function activityFixture(activityId, title, selections) {
  const materials = [
    {
      material_id: activityId + "-M1",
      material_type: "scenario",
      activity_id: activityId,
      title: "Claims to evaluate",
      body_format: "markdown",
      body: "### Scenario\n\nEvidence for evaluation."
    },
    ...selections,
    {
      material_id: activityId + "-MT",
      material_type: "template",
      activity_id: activityId,
      title: "Identify the missing justification",
      body_format: "markdown",
      body: "**Missing justification:**\n\n"
    },
    {
      material_id: activityId + "-MC",
      material_type: "checklist",
      activity_id: activityId,
      title: "Review the quality of your judgements",
      body_format: "json",
      body: {
        review_mode: "guided_criteria",
        criteria: [
          {
            statement: "Have you distinguished candidates from extrema?",
            why_it_matters: "Logical scope matters.",
            features: [
              {
                expected: "I judged Claim 1 as candidate identification.",
                repair: "Re-read Claim 1."
              }
            ]
          }
        ]
      },
      diagnostic_review: {
        covers_response_material_ids: selections.map((s) => s.material_id)
      }
    }
  ];

  return {
    activity_id: activityId,
    title: title,
    learner_task: "Judge the claims.",
    expected_output: "Judgements plus a short explanation.",
    activity_preamble: "Use earlier distinctions.",
    episode_plan: {
      archetype: "apply",
      beats: [
        { id: "orient", function: "framing" },
        { id: "model", function: "worked_thinking" },
        { id: "do", function: "guided_practice" },
        { id: "check", function: "verification" }
      ]
    },
    required_materials: materials.map((m) => ({
      material_id: m.material_id,
      material_type: m.material_type,
      purpose: "Task material",
      specification: "As authored",
      ...(m.diagnostic_review ? { diagnostic_review: m.diagnostic_review } : {}),
      ...(m.material_type === "selection"
        ? {
            response_fulfilment: {
              kind: "learner_workspace",
              response_kind: "selection_choose",
              binds_production_steps: [1]
            }
          }
        : {}),
      ...(m.material_type === "template"
        ? {
            response_fields: [{ label: "Missing justification", input_modality: "text" }],
            response_fulfilment: {
              kind: "learner_workspace",
              response_kind: "text_compose",
              binds_production_steps: [2]
            }
          }
        : {})
    })),
    materials: materials
  };
}

/** Nine C3-like Practice selections across three activities. */
function c3NineSelectionPage() {
  const a1 = activityFixture("A1", "What do multiplier equations prove?", [
    claimSelection(
      "A1",
      "A1-M2",
      "Judge Claim 1",
      "Does Claim 1's conclusion follow from the evidence under the stated regularity condition?",
      "supported"
    ),
    claimSelection(
      "A1",
      "A1-M3",
      "Judge Claim 2",
      "Does Claim 2's conclusion follow from its stated evidence?",
      "overreach"
    ),
    claimSelection(
      "A1",
      "A1-M4",
      "Judge Claim 3",
      "Does Claim 3's conclusion follow from the calculation alone?",
      "overreach"
    )
  ]);
  const a2 = activityFixture("A2", "Which inferences overreach?", [
    claimSelection(
      "A2",
      "A2-M2",
      "Judge Claim 1",
      "Does Claim 1 hold for the multiplier system as stated?",
      "supported"
    ),
    claimSelection(
      "A2",
      "A2-M3",
      "Judge Claim 2",
      "Does Claim 2 invent an unstated uniqueness claim?",
      "overreach"
    ),
    claimSelection(
      "A2",
      "A2-M4",
      "Judge Claim 3",
      "Is Claim 3 underdetermined by the given evidence?",
      "insufficient"
    )
  ]);
  const a3 = activityFixture("A3", "Transfer the evaluation criteria", [
    claimSelection(
      "A3",
      "A3-M2",
      "Judge Claim 1",
      "Does the transfer claim follow from the prior regularity condition?",
      "supported"
    ),
    claimSelection(
      "A3",
      "A3-M3",
      "Judge Claim 2",
      "Does the transfer claim go beyond the evidence?",
      "overreach"
    ),
    claimSelection(
      "A3",
      "A3-M4",
      "Judge Claim 3",
      "Is more information needed before judging the transfer claim?",
      "insufficient"
    )
  ]);

  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Evaluate what multiplier solutions establish",
    product_id: "practice",
    page_kind: "practice",
    page_synthesis: {
      overview: { body: "Practice claim judgements.", format: "markdown" }
    },
    activities: [a1, a2, a3],
    learning_outcomes: [
      { outcome_id: "LO1", statement: "Evaluate multiplier claims." }
    ],
    episode_plans: [a1, a2, a3].map((act) => ({
      activity_id: act.activity_id,
      mapped_learning_outcome_ids: ["LO1"],
      episode_plan: act.episode_plan
    })),
    assembly_state: {
      current_stage: "design_page",
      enriched_by: ["episode_plan", "dla", "gam", "design_page"]
    }
  };
}

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: {
      add() {},
      remove() {},
      contains() {
        return false;
      },
      toggle() {
        return false;
      }
    },
    style: {},
    dataset: {},
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute() {
      return null;
    },
    addEventListener() {},
    removeEventListener() {},
    focus() {}
  };
}

function loadBrowserBundleApi() {
  const windowStub = {
    document: { readyState: "complete", addEventListener() {} },
    addEventListener() {},
    removeEventListener() {},
    location: { hash: "", pathname: "/" }
  };
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    window: windowStub,
    document: windowStub.document,
    self: windowStub
  };
  windowStub.window = windowStub;
  wireBrowserGlobalThis(sandbox);
  vm.createContext(sandbox);
  const api = loadLearnerRendererVNextBrowserInSandbox(sandbox, repoRoot);
  assert.ok(api, "browser bundle must register PRISM_LEARNER_RENDERER_VNEXT");
  assert.equal(typeof api.renderLearnerPageHtml, "function");
  return api;
}

function loadAppExportApi() {
  const appSource = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  const sandbox = {
    console,
    setTimeout() {
      return 0;
    },
    clearTimeout() {},
    Promise,
    _: { debounce: (fn) => fn }
  };
  const elementStore = new Map();
  const documentStub = {
    readyState: "loading",
    addEventListener() {},
    createElement: () => createElementStub(),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub());
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild() {}, removeChild() {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem() {} },
    URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries: () =>
        Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS);
  loadLearnerRendererVNextBrowserInSandbox(sandbox, repoRoot);
  vm.runInContext(appSource, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  assert.ok(
    sandbox.window.PRISM_LEARNER_RENDERER_VNEXT,
    "export route requires browser learner renderer bundle"
  );
  return api;
}

function assertPracticeSelectionLayout(html, label) {
  const source = String(html || "");
  assert.ok(source.length > 1000, label + ": expected substantial HTML");

  assert.doesNotMatch(source, /Question\s+15\d/, label + ": no Question 15x");
  assert.doesNotMatch(
    source,
    /util-semantic-icon__label">Question\s+\d+/,
    label + ": no Question N icon chrome for Practice selections"
  );

  assert.doesNotMatch(
    source,
    /data-material-type="selection"[^>]*data-response-composed="true"[^>]*>\s*<p class="util-material-heading/
  );

  const practiceUnits = source.match(/data-practice-selection="true"/g) || [];
  assert.equal(practiceUnits.length, 9, label + ": nine Practice selection units");

  // Fixed path: selections render as interactive units, not material-type shells.
  assert.equal(
    (source.match(/data-material-type="selection"/g) || []).length,
    0,
    label + ": no selection material shells (controls live in practice units)"
  );
  assert.equal(
    (source.match(/data-selection-invalid/g) || []).length,
    0,
    label + ": no invalid selection markers"
  );

  // Authored titles appear as Practice selection headings (not orphan shells only).
  const titleHits = source.match(/util-practice-selection__title">Judge Claim [123]</g) || [];
  assert.equal(titleHits.length, 9, label + ": each Judge Claim title on a selection unit");

  // Each practice unit keeps title + radios together (controls associated with title).
  const unitRe =
    /data-practice-selection="true"[\s\S]*?util-practice-selection__title">Judge Claim [123]<[\s\S]*?type="radio"[\s\S]*?(?=data-practice-selection="true"|$)/g;
  const associated = source.match(unitRe) || [];
  assert.equal(
    associated.length,
    9,
    label + ": each authored selection title associated with its controls"
  );

  assert.ok((source.match(/type="radio"/g) || []).length >= 27, label + ": radios present");
  assert.match(source, /data-assessment-check/, label + ": checking wiring");
  assert.match(
    source,
    /data-guided-review="true"|guided_criteria|Review the quality/,
    label + ": feedback/review wiring"
  );
  assert.match(
    source,
    /data-learner-draft|initializeLearnerDraftPersistence|persistence/,
    label + ": persistence wiring retained"
  );
}

test("101E export-path: browser bundle artefacts match modular source", () => {
  const freshness = checkLearnerRendererVnextBrowserFreshness();
  assert.equal(
    freshness.ok,
    true,
    "Stale browser bundle: " +
      JSON.stringify({ stale: freshness.stale, missing: freshness.missing }) +
      " — run npm run build:learner-renderer-vnext-browser"
  );
});

test("101E export-path: browser bundle renderLearnerPageHtml (moments) layout", () => {
  const api = loadBrowserBundleApi();
  const page = c3NineSelectionPage();
  const rendered = api.renderLearnerPageHtml(page, {
    includeRuntimeScripts: true,
    compositionMode: "moments"
  });
  assert.equal(rendered.error, null, rendered.error);
  assertPracticeSelectionLayout(rendered.html, "browser-bundle");

  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(EVIDENCE_DIR, "browser-bundle-moments.html"),
    rendered.html,
    "utf8"
  );
});

test("101E export-path: app packaging pipeline uses browser bundle (not modular)", () => {
  const api = loadAppExportApi();
  const page = c3NineSelectionPage();
  const result = api.renderLearnerPageForTest(page, {
    rendererVersion: "vnext",
    compositionMode: "moments",
    applyCompositionValidation: false
  });
  assert.ok(result && !result.error, result && result.error);
  assertPracticeSelectionLayout(result.html, "app-export-pipeline");

  const packaged = learnerPackage.buildLearnerPackage({
    html: result.html,
    title: page.title,
    pageSlug: "evaluate-what-multiplier-solutions-establish"
  });
  assert.equal(packaged.ok, true, JSON.stringify(packaged.error || packaged));
  const packagedHtml = String(packaged.package && packaged.package.html);
  assertPracticeSelectionLayout(packagedHtml, "packaged-learner-page");
  assert.equal(packaged.package.metadata.html_entry, "learner-page.html");

  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(EVIDENCE_DIR, "learner-page.html"),
    packagedHtml,
    "utf8"
  );
  fs.writeFileSync(
    path.join(EVIDENCE_DIR, "markers.json"),
    JSON.stringify(
      {
        practice_sel: (packagedHtml.match(/data-practice-selection="true"/g) || []).length,
        Q15x: (packagedHtml.match(/Question\s+15\d/g) || []).length,
        orphan_shells: (
          packagedHtml.match(
            /data-material-type="selection"[^>]*data-response-composed="true"[^>]*>\s*<p class="util-material-heading/g
          ) || []
        ).length,
        selection_invalid: (packagedHtml.match(/data-selection-invalid/g) || []).length,
        judge_claim_titles: (
          packagedHtml.match(/util-practice-selection__title">Judge Claim [123]</g) || []
        ).length
      },
      null,
      2
    ),
    "utf8"
  );
});

test("101E export-path: Assessment Pack Question N chrome unaffected via browser bundle", () => {
  const api = loadBrowserBundleApi();
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: "A formative check",
    activities: [],
    sections: [],
    assessment_evidence: {
      purpose: {
        role: "R1",
        visibility_claim: "Whether the learner can defend a causal judgement.",
        stop_rationale: "A short formative stop before the next study block.",
        forward_intent: "Show the learner what to concentrate on next."
      },
      learner_context: {
        depends_on_prior_work: true,
        entry_assumptions: ["You have met the idea of a prior."],
        bring_forward: [
          {
            what: "Your earlier note on observational studies.",
            how_used: "Use that note as the case you inspect here."
          }
        ]
      },
      elicitations: [
        {
          elicitation_id: "e1",
          order: 1,
          evidence_ask: "Identify a prior probability.",
          epistemic_class: "determinate",
          delivery: {
            kind: "auto_checkable_items",
            items: [
              {
                item_id: "q1",
                order: 1,
                form: "single_answer_mcq",
                prompt: {
                  stem: "Which statement is a prior?",
                  options: [
                    { key: "a", text: "Belief before evidence" },
                    { key: "b", text: "The new data" }
                  ]
                },
                judgement: { correct_answer: "a", auto_checkable: true },
                feedback_note: "A prior is the belief held before the new evidence."
              }
            ]
          },
          formative_return: {
            materials: [
              {
                material_id: "m1",
                body: "A prior is the belief held before the new evidence."
              }
            ],
            forward_orientation: "Concentrate on how priors change when evidence arrives."
          }
        }
      ],
      pack_forward_orientation:
        "Carry the result into the next study block. It does not unlock or block a path."
    }
  };
  const rendered = api.renderLearnerPageHtml(page, { compositionMode: "beats" });
  assert.equal(rendered.error, null, rendered.error);
  assert.match(rendered.html, /Question\s+1/);
  assert.doesNotMatch(rendered.html, /util-practice-selection__title/);
  assert.doesNotMatch(rendered.html, /data-practice-selection="true"/);
});
