/**
 * Sprint 93 Gate 10 Slice 3A — Assessment Pack publishing integration.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fflate = require("fflate");

const family = require("../lib/first-class-workflow-family.js");
const publish = require("../lib/assessment-pack-publish.js");
const learnerPackage = require("../lib/learner-package.js");
const learnerPackageZip = require("../lib/learner-package-zip.js");
const ljDesign = require("../lib/learning-journey-design-page.js");
const ljPackage = require("../lib/learning-journey-learner-package.js");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

function unzipText(bytes, entryPath) {
  const files = fflate.unzipSync(bytes);
  const file = files[entryPath];
  assert.ok(file, "missing ZIP entry " + entryPath);
  return fflate.strFromU8(file);
}

function purpose(role) {
  return {
    role: role || "R1",
    visibility_claim: "Which prior concepts still need attention.",
    stop_rationale: "A short formative stop before the next study block.",
    forward_intent: "Show the learner what to concentrate on next."
  };
}

function canonicalPage(overrides) {
  const evidence = Object.assign(
    {
      purpose: purpose("R2"),
      learner_context: {
        depends_on_prior_work: true,
        entry_assumptions: ["You have already practised the cue vocabulary."],
        bring_forward: [
          {
            what: "Your earlier note on observational studies.",
            how_used: "Use that note as the case you inspect here."
          }
        ]
      },
      elicitations: [
        {
          elicitation_id: "forms",
          order: 1,
          evidence_ask: "Work through each closed check.",
          epistemic_class: "determinate",
          delivery: {
            kind: "auto_checkable_items",
            items: [
              {
                item_id: "single",
                order: 1,
                form: "single_answer_mcq",
                prompt: {
                  stem: "Pick one.",
                  options: [
                    { key: "a", text: "Alpha" },
                    { key: "b", text: "Beta" }
                  ]
                },
                judgement: { correct_answer: "a", auto_checkable: true },
                feedback_note: "Alpha is the named choice."
              },
              {
                item_id: "multi",
                order: 2,
                form: "multiple_answer_mcq",
                prompt: {
                  stem: "Pick both.",
                  options: [
                    { key: "a", text: "One" },
                    { key: "b", text: "Two" }
                  ]
                },
                judgement: { correct_answers: ["a", "b"], auto_checkable: true },
                feedback_note: "Both belong."
              },
              {
                item_id: "order",
                order: 3,
                form: "ordering",
                prompt: {
                  stem: "Order the steps.",
                  items: [
                    { id: "s2", text: "Second" },
                    { id: "s1", text: "First" }
                  ]
                },
                judgement: { correct_order: ["s1", "s2"], auto_checkable: true },
                feedback_note: "First comes before second."
              },
              {
                item_id: "class",
                order: 4,
                form: "classification",
                prompt: {
                  stem: "Classify the item.",
                  categories: [{ id: "c1", label: "Design" }],
                  items: [{ id: "i1", text: "Cohort" }]
                },
                judgement: { assignments: { i1: "c1" }, auto_checkable: true },
                feedback_note: "A cohort is a design."
              },
              {
                item_id: "match",
                order: 5,
                form: "matching",
                prompt: {
                  stem: "Match the pair.",
                  left: [{ id: "l1", text: "Prior" }],
                  right: [{ id: "r1", text: "Belief before evidence" }]
                },
                judgement: { pairs: { l1: "r1" }, auto_checkable: true },
                feedback_note: "A prior is that belief."
              }
            ]
          },
          formative_return: {
            materials: [{ material_id: "guide", body: "Use the check result to see what still needs attention." }],
            forward_orientation: "Take the checked result into the next block."
          }
        },
        {
          elicitation_id: "written",
          order: 2,
          evidence_ask: "Explain whether the study design can support a causal claim.",
          stimulus: "A short observational vignette.",
          epistemic_class: "non_determinate",
          delivery: {
            kind: "constructed_performance",
            prompt: "Write the causal judgement in your own words.",
            response_workspace: {
              intention: "Sustained written judgement",
              guidance: "Name the design and the claim it can and cannot support."
            }
          },
          formative_return: {
            materials: [
              {
                material_id: "criteria",
                title: "Self-evaluation",
                body: "Compare your reasons with the criteria. More than one careful conclusion can remain open."
              }
            ],
            forward_orientation: "Use this to see the strength and limit of your causal reasoning.",
            revision: { offered: true, prompt: "Revise the sentence that states the claim." }
          }
        }
      ],
      pack_forward_orientation:
        "Hand this judgement to the next study block as your current reasoning."
    },
    overrides || {}
  );
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: "A formative check",
    activities: [],
    sections: [],
    assessment_evidence: evidence
  };
}

function legacyPack() {
  return {
    artifact_type: "assessment_pack",
    components: [
      {
        id: "c-figure",
        form: "single_answer_mcq",
        prompt: { stem: "Which group is larger?", options: ["Group A", "Group B"] },
        judgement: { auto_checkable: true, correct_answer: "Group B" },
        feedback_note: "Group B has the taller bar.",
        representation: null
      }
    ]
  };
}

test("assessment_pack uses the shared page-based publish route", () => {
  assert.equal(family.publishRouteForWorkflow({ product: "assessment_pack" }), "assessment_pack");
  assert.equal(family.isPageBasedLearnerPublishRoute("assessment_pack"), true);
  assert.equal(family.isPageBasedLearnerPublishRoute("learning_journey_page"), false);
});

test("canonical page publishes; invalid canonical page does not fall back to assessment_check", () => {
  const resolved = publish.resolveAssessmentPackPublishPage({ page: canonicalPage() });
  assert.equal(resolved.ok, true);
  assert.equal(resolved.source, "canonical");
  assert.equal(resolved.page.product_id, "assessment_pack");
  assert.ok(resolved.page.assessment_evidence);

  const invalid = publish.resolveAssessmentPackPublishPage({
    page: canonicalPage({ elicitations: [] }),
    assessmentPack: legacyPack(),
    designPage: { artifact_type: "assessment_design_page", title: "Legacy" }
  });
  assert.equal(invalid.ok, false);
  assert.equal(invalid.code, "assessment_evidence_invalid");
  assert.match(invalid.message, /At least one elicitation is required/);
  assert.equal(invalid.page, undefined);

  const legacy = publish.resolveAssessmentPackPublishPage({
    designPage: { artifact_type: "assessment_design_page", title: "A short check" },
    assessmentPack: legacyPack()
  });
  assert.equal(legacy.ok, true);
  assert.equal(legacy.source, "legacy_assessment_check");
  assert.equal(legacy.page.assessment_check.items[0].correct_answer, "Group B");
  assert.equal(legacy.page.assessment_evidence, undefined);
});

test("standalone learner package keeps local checking, written workspace, and handoff", () => {
  const page = canonicalPage();
  const rendered = renderLearnerPageHtml(page, { compositionMode: "beats" });
  assert.equal(rendered.error, null);
  const built = learnerPackage.buildLearnerPackage({
    html: rendered.html,
    title: page.title,
    pageSlug: "formative-check"
  });
  assert.equal(built.ok, true, built.error && built.error.message);
  const zipped = learnerPackageZip.serializeLearnerPackageToZip(built.package);
  assert.equal(zipped.ok, true);
  const html = unzipText(zipped.bytes, "learner-page.html");

  assert.doesNotMatch(html, /Before you begin/);
  assert.doesNotMatch(html, /You have already practised the cue vocabulary/);
  assert.match(html, /Your earlier note on observational studies/);
  assert.match(html, /Use that note as the case you inspect here/);
  assert.match(html, /data-assessment-form="single_answer_mcq"/);
  assert.match(html, /data-assessment-form="multiple_answer_mcq"/);
  assert.match(html, /data-assessment-form="ordering"/);
  assert.match(html, /data-assessment-form="classification"/);
  assert.match(html, /data-assessment-form="matching"/);
  assert.match(html, /function checkSingle/);
  assert.match(html, /data-workspace-kind="text_entry"/);
  assert.match(html, /Your response/);
  assert.doesNotMatch(html, /Sustained written judgement/);
  assert.match(html, /data-assessment-judgement="none"/);
  assert.match(html, /Compare your reasons with the criteria/);
  assert.match(html, /Hand this judgement to the next study block/);
  assert.doesNotMatch(html, /src=["']https?:/i);
  assert.doesNotMatch(html, /cdn\.jsdelivr|openai|api\.openai/i);
});

test("Learning Journey package includes the Assessment Pack learner experience and handoff", () => {
  const page = canonicalPage();
  const rendered = renderLearnerPageHtml(page, { compositionMode: "beats" });
  const built = learnerPackage.buildLearnerPackage({ html: rendered.html, title: page.title });
  assert.equal(built.ok, true);
  const journey = ljDesign.buildLearningJourneyDesignPageFixture({
    title: "Journey with a formative stop",
    experienceExposition:
      "Bring forward the cue vocabulary from the primer before this formative stop.",
    commissions: [
      {
        commission_id: "c1",
        section_id: "exp_1",
        order: 1,
        title: "Formative evidence stop",
        product_id: "assessment_pack",
        status: "supported",
        specification_text:
          "Commission an Assessment Pack. Entry assumption: the learner has completed the primer.",
        journey_context_text: "Bring forward the cue vocabulary from the primer.",
        dependencies: "Bring forward the cue vocabulary from the primer."
      }
    ]
  });
  assert.equal(journey.ok, true, (journey.errors || []).join("; "));
  const assembled = ljPackage.assembleLearningJourneyLearnerPackage({
    page: journey.page,
    constituents: [{ commissionId: "c1", learnerPackage: built.package }],
    fflate
  });
  assert.equal(assembled.ok, true, assembled.error && assembled.error.message);
  const home = unzipText(assembled.bytes, "index.html");
  const constituent = unzipText(assembled.bytes, "c1/index.html");
  assert.match(home, /Bring forward the cue vocabulary from the primer/);
  assert.match(home, /data-commission-id="c1"/);
  assert.doesNotMatch(constituent, /Before you begin/);
  assert.doesNotMatch(constituent, /You have already practised the cue vocabulary/);
  assert.match(constituent, /Your earlier note on observational studies/);
  assert.match(constituent, /Use that note as the case you inspect here/);
  assert.match(constituent, /data-workspace-kind="text_entry"/);
  assert.match(constituent, /function checkSingle/);
  assert.match(constituent, /Hand this judgement to the next study block/);
  assert.doesNotMatch(constituent, /\bgrade\b|pass\/fail/i);
});

test("workflow export and Learning Journey constituent builder publish the canonical page", async () => {
  const page = canonicalPage();
  const { api, window, sandbox } = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/assessment-pack-canonical.js",
      "lib/assessment-pack-publish.js",
      "lib/first-class-workflow-family.js",
      "lib/learner-package.js"
    ]
  });
  if (window) {
    window.PRISM_FIRST_CLASS_WORKFLOW_FAMILY = family;
    window.PRISM_ASSESSMENT_PACK_PUBLISH = publish;
  }
  if (sandbox) {
    sandbox.PRISM_FIRST_CLASS_WORKFLOW_FAMILY = family;
    sandbox.PRISM_ASSESSMENT_PACK_PUBLISH = publish;
  }
  const visualJobs = require("../lib/utilities-visual-jobs-workspace.js");
  const learnerPackageZip = require("../lib/learner-package-zip.js");
  if (window) {
    window.PRISM_UTILITIES_VISUAL_JOBS_WORKSPACE = visualJobs;
    window.PRISM_LEARNER_PACKAGE = learnerPackage;
    window.PRISM_LEARNER_PACKAGE_ZIP = learnerPackageZip;
  }
  if (sandbox) {
    sandbox.PRISM_UTILITIES_VISUAL_JOBS_WORKSPACE = visualJobs;
    sandbox.PRISM_LEARNER_PACKAGE = learnerPackage;
    sandbox.PRISM_LEARNER_PACKAGE_ZIP = learnerPackageZip;
  }

  const exported = api.runUtilityPageExportPipelineForTest(page, {
    workflow: { id: "wf-ap", product: "assessment_pack", steps: [] },
    applyCompositionValidation: false
  });
  assert.equal(exported.error, null, exported.error || "");
  assert.match(exported.html, /Your response/);
  assert.doesNotMatch(exported.html, /Sustained written judgement/);
  assert.match(exported.html, /function checkSingle/);
  assert.match(exported.html, /Your earlier note on observational studies/);

  const invalid = canonicalPage({ elicitations: [] });
  const rejected = api.runUtilityPageExportPipelineForTest(invalid, {
    workflow: { id: "wf-ap", product: "assessment_pack", steps: [] },
    applyCompositionValidation: false
  });
  assert.ok(rejected.error);
  assert.match(rejected.error, /assessment_evidence_invalid/);
  assert.match(rejected.error, /At least one elicitation is required/);
  assert.equal(rejected.html, undefined);

  const workflows = [
    {
      id: "wf-ap-pkg",
      product: "assessment_pack",
      steps: [
        {
          id: "dp",
          title: "Design Page",
          canonical_step_id: "step_design_page",
          outputName: "page"
        }
      ]
    }
  ];
  api.setWorkflowsForTest(workflows);
  const built = await api.buildConstituentLearnerPackageModelForTest("wf-ap-pkg", {
    workflows,
    runStateByWorkflowId: {
      "wf-ap-pkg": {
        capturedOutputs: { dp: JSON.stringify(page) },
        authoritativeAssembledPage: page,
        authoritativePageSource: "resolvePageForRenderOrAssembly"
      }
    }
  });
  assert.equal(built.ok, true, (built.error && built.error.message) || built.code || "");
  assert.match(String(built.package.html || ""), /data-workspace-kind="text_entry"/);
  assert.match(String(built.package.html || ""), /Hand this judgement to the next study block/);
  assert.match(String(built.package.html || ""), /function checkSingle/);
  assert.doesNotMatch(String(built.package.html || ""), /data-assessment-product="assessment_check"/);
});
