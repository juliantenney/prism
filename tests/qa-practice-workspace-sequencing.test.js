"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const vnext = require("../lib/learner-renderer-vnext/index.js");
const classification = require("../lib/learner-renderer-vnext/compose-moment-classification.js");

function buildC01PracticePage(options) {
  const opts = options || {};
  const selectionMaterial = {
    material_id: "A1-M2",
    material_type: "selection",
    title: "Classify the economic relationship",
    selection: {
      form: "single_select",
      prompt:
        "Classify the relationship shown in the scatterplot.\n\n" +
        "1. Direction of association\n\n" +
        "2. Form of relationship\n\n" +
        "3. Strength of association",
      options: [
        { key: "A", text: "Positive", is_correct: true },
        { key: "B", text: "Negative" },
        { key: "C", text: "No clear direction" },
        { key: "A", text: "Approximately linear", is_correct: true },
        { key: "B", text: "Curved" },
        { key: "C", text: "Random scatter" },
        { key: "A", text: "Strong", is_correct: true },
        { key: "B", text: "Moderate" },
        { key: "C", text: "Weak" }
      ]
    }
  };

  const promptSetMaterial = {
    material_id: "A1-M3",
    material_type: "prompt_set",
    title: "Explain your classification",
    body: "Explain how the pattern of observations and $r = 0.96$ support your classification."
  };

  const checklistMaterial = {
    material_id: "A1-M4",
    material_type: "checklist",
    title: "Self-check criteria",
    body: "- Did you state direction, form, and strength?\n- Did you avoid claiming causation?"
  };

  const orderedDoMaterials = opts.promptSetFirstInRequired
    ? [promptSetMaterial, selectionMaterial]
    : [selectionMaterial, promptSetMaterial];

  const requiredMaterials = orderedDoMaterials
    .map((m) => {
      const req = {
        material_id: m.material_id,
        material_type: m.material_type,
        purpose: m.title
      };
      if (m.material_id === "A1-M3") {
        req.response_fulfilment = { artefact_elicitation_id: "E1" };
      }
      return req;
    })
    .concat([
      {
        material_id: checklistMaterial.material_id,
        material_type: "checklist",
        purpose: "Diagnostic self-check"
      }
    ]);

  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Interpreting relationships in economic data",
    product_id: "practice",
    page_kind: "practice",
    page_profile: { profile_type: "learner" },
    page_synthesis: {
      overview: {
        format: "markdown",
        body: "Practise reading scatterplots and correlation coefficients."
      }
    },
    learner_artefacts: {
      produces: [
        {
          elicitation_id: "E1",
          response_kind: "constructed_text",
          label: "Correlation interpretation",
          prompt: "Explain how the pattern of observations supports your classification."
        }
      ]
    },
    activities: [
      {
        activity_id: "A1",
        title: "Classify and explain the relationship",
        learner_task:
          "1. Select the direction, form, and strength of the association.\n" +
          "2. Write a short explanation justifying your selections.\n" +
          "3. Use the checklist to review your reasoning.",
        expected_output: "Three classification selections followed by a justified explanation.",
        episode_plan: {
          archetype: "apply",
          beats: [
            { id: "orient", function: "framing" },
            { id: "model", function: "worked_thinking" },
            { id: "do", function: "guided_practice" },
            { id: "check", function: "verification" }
          ]
        },
        required_materials: requiredMaterials,
        materials: orderedDoMaterials.concat([checklistMaterial])
      }
    ]
  };
}

function buildC03MatchingAndWrittenPage() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Evaluating competing explanations in economic evidence",
    product_id: "practice",
    page_kind: "practice",
    page_profile: { profile_type: "learner" },
    page_synthesis: {
      overview: {
        format: "markdown",
        body: "Match each claim to its evidence limitation before justifying your verdict."
      }
    },
    activities: [
      {
        activity_id: "A1",
        title: "Match claims to limitations and justify",
        learner_task:
          "1. Match each economic claim to the primary evidentiary limitation.\n" +
          "2. Select the strongest revised conclusion.\n" +
          "3. Write a brief justification explaining why the alternative causal claim is unsupported.\n" +
          "4. Verify your justification against the checklist.",
        expected_output: "Completed matching, selection, and written justification.",
        episode_plan: {
          archetype: "apply",
          beats: [
            { id: "orient", function: "framing" },
            { id: "model", function: "worked_thinking" },
            { id: "do", function: "guided_practice" },
            { id: "check", function: "verification" }
          ]
        },
        required_materials: [
          { material_id: "C3-M1", material_type: "selection", purpose: "Match claims to limitations" },
          { material_id: "C3-M2", material_type: "selection", purpose: "Choose revised conclusion" },
          { material_id: "C3-M3", material_type: "checklist", purpose: "Check justification" }
        ],
        materials: [
          {
            material_id: "C3-M1",
            material_type: "selection",
            title: "Match each claim to its limitation",
            selection: {
              form: "matching",
              prompt: "Match each claim to the main limitation.",
              left: [
                { id: "c1", text: "Higher spending caused higher growth" },
                { id: "c2", text: "Regions with more clinics had lower mortality" }
              ],
              right: [
                { id: "rev", text: "Reverse causation possible" },
                { id: "conf", text: "Confounding factors unobserved" }
              ],
              pairs: { c1: "rev", c2: "conf" }
            }
          },
          {
            material_id: "C3-M2",
            material_type: "selection",
            title: "Select the supported conclusion",
            selection: {
              form: "single_select",
              prompt: "Which conclusion is supported by the observational data?",
              options: [
                { key: "A", text: "The two variables move together in the sample.", is_correct: true },
                { key: "B", text: "Changing X guarantees a proportional change in Y." }
              ]
            }
          },
          {
            material_id: "C3-M3",
            material_type: "checklist",
            title: "Review criteria",
            body: "- Did you distinguish association from causation?"
          }
        ]
      }
    ]
  };
}

function buildConstructedBeforeSelectionPage(options) {
  const opts = options || {};
  const promptSetMaterial = {
    material_id: "P1-M1",
    material_type: "prompt_set",
    title: "Record your initial prediction",
    body: "1. Write your initial prediction before consulting the candidate interpretations."
  };
  const selectionMaterial = {
    material_id: "P1-M2",
    material_type: "selection",
    title: "Select the closest interpretation",
    selection: {
      form: "single_select",
      prompt: "Which interpretation aligns most closely with your written prediction?",
      options: [
        { key: "A", text: "Consumption rises less than proportionally with income.", is_correct: true },
        { key: "B", text: "Consumption is unrelated to disposable income." }
      ]
    }
  };
  const materials = opts.selectionFirstInRequired
    ? [selectionMaterial, promptSetMaterial]
    : [promptSetMaterial, selectionMaterial];

  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Predict before choosing",
    product_id: "practice",
    page_kind: "practice",
    page_profile: { profile_type: "learner" },
    page_synthesis: {},
    activities: [
      {
        activity_id: "A1",
        title: "Predict then select",
        learner_task: opts.unnumberedTask
          ? "Complete the response workspaces below."
          : "1. Write your initial prediction before viewing the options.\n" +
            "2. Select the interpretation that best matches your prediction.",
        expected_output: "Initial written prediction followed by matching selection.",
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
          purpose: m.title
        })),
        materials: materials
      }
    ]
  };
}

test("C01 regression: selection questions precede artefact-bound constructed response without interleaving, preserving E1 identity and Check placement", () => {
  for (const promptSetFirstInRequired of [false, true]) {
    const page = buildC01PracticePage({ promptSetFirstInRequired });
    const rendered = vnext.renderLearnerPageHtml(page);
    const html = String(rendered && rendered.html || "");

    const firstSelPos = html.indexOf('data-workspace-capability="single_select"');
    const lastSelPos = html.lastIndexOf('data-workspace-capability="single_select"');
    const constructedPos = html.indexOf('id="learner-constructed-E1"');
    const doPos = html.indexOf('data-composition-moment="do"');
    const checkPos = html.indexOf('data-composition-moment="check"');

    assert.ok(firstSelPos > 0, "Expected selection workspaces");
    assert.ok(constructedPos > 0, "Expected E1 constructed-response workspace");
    assert.ok(
      lastSelPos < constructedPos,
      `All selection questions must precede E1 constructed response (promptSetFirstInRequired=${promptSetFirstInRequired})`
    );
    assert.ok(doPos > 0 && checkPos > constructedPos, "Check/feedback must follow Do workspaces");

    // Existing question grouping, artefact identity, and radio groups remain intact
    assert.match(html, /util-practice-decision-grid/);
    assert.match(html, /data-response-part-id="E1"/);
    assert.match(html, /id="learner-constructed-E1"/);
    const selMatches = html.match(/data-workspace-capability="single_select"/g) || [];
    assert.equal(selMatches.length, 3, "All 3 selection questions preserved");
  }
});

test("C03 regression: matching and selection workspaces precede written task-step justification, followed by Check", () => {
  const page = buildC03MatchingAndWrittenPage();
  const rendered = vnext.renderLearnerPageHtml(page);
  const html = String(rendered && rendered.html || "");

  const matchPos = html.indexOf('data-workspace-capability="matching"');
  const selectPos = html.indexOf('data-workspace-capability="single_select"');
  const textPos = html.indexOf('data-workspace-capability="text_entry"');
  const checkPos = html.indexOf('data-composition-moment="check"');

  assert.ok(matchPos > 0, "Expected matching workspace");
  assert.ok(selectPos > matchPos, "Selection should follow matching per authored steps");
  assert.ok(textPos > selectPos, "Written justification should follow matching and selection");
  assert.ok(checkPos > textPos, "Check/feedback must follow all learner response opportunities");
});

test("Pedagogical flexibility: constructed response legitimately precedes selection when authored that way", () => {
  // 1) Numbered steps: 1. Write... 2. Select... (even if required_materials listed selection first)
  const stepOrderedHtml = String(
    vnext.renderLearnerPageHtml(
      buildConstructedBeforeSelectionPage({ selectionFirstInRequired: true })
    ).html || ""
  );
  const textPos1 = stepOrderedHtml.indexOf('data-workspace-capability="text_entry"');
  const selPos1 = stepOrderedHtml.indexOf('data-workspace-capability="single_select"');
  assert.ok(textPos1 > 0 && selPos1 > textPos1, "Step-authored constructed response must precede selection");

  // 2) Authored required_materials order: [prompt_set, selection] with unnumbered task
  const matOrderedHtml = String(
    vnext.renderLearnerPageHtml(
      buildConstructedBeforeSelectionPage({
        selectionFirstInRequired: false,
        unnumberedTask: true
      })
    ).html || ""
  );
  const textPos2 = matOrderedHtml.indexOf('data-workspace-capability="text_entry"');
  const selPos2 = matOrderedHtml.indexOf('data-workspace-capability="single_select"');
  assert.ok(textPos2 > 0 && selPos2 > textPos2, "Material-authored constructed response must precede selection");
});

test("Selection and decision materials classify as task materials so feedback/check stays after learner response opportunities", () => {
  assert.equal(classification.classifyMaterialPlacement({ type: "selection" }), "task");
  assert.equal(classification.classifyMaterialPlacement({ type: "decision" }), "task");
  assert.equal(
    classification.classifyInstructionPlacement({
      text: "Select the direction and strength of the association."
    }),
    "do"
  );
  assert.equal(
    classification.classifyInstructionPlacement({
      text: "Match each claim to the primary limitation."
    }),
    "do"
  );
});
