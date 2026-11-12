/**
 * Presentation: simple one-to-one Copy outputs omit the second editable
 * artefact area; composite / prepare-assemble outputs keep it.
 *
 * Interactive copy/assemble behaviour is covered alongside the existing
 * output-assembly harness in s93-assessment-pack-output-assembly.test.js.
 */
const test = require("node:test");
const assert = require("node:assert/strict");

const { isSimpleDirectResponseOutput } = require("../lib/learner-renderer-vnext/assessment-output");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");

function purpose() {
  return {
    role: "R2",
    visibility_claim: "How the learner explains the finding.",
    stop_rationale: "A formative stop before later revision.",
    forward_intent: "Retain the original explanation for later comparison."
  };
}

function constructed(id) {
  return {
    elicitation_id: id,
    order: 1,
    evidence_ask: "Write the explanation.",
    epistemic_class: "non_determinate",
    delivery: {
      kind: "constructed_performance",
      prompt: "Write your explanation.",
      response_workspace: { intention: "An independent explanation" }
    },
    formative_return: {
      materials: [{ material_id: "ack", body: "Keep your original wording." }],
      forward_orientation: "Take this explanation into later revision."
    }
  };
}

function page(spec, elicitations) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: "Assessment pack",
    activities: [],
    assessment_evidence: {
      purpose: purpose(),
      learner_context: { depends_on_prior_work: false },
      elicitations: elicitations,
      pack_forward_orientation: "Keep the original response for later comparison.",
      output_specification: spec
    }
  };
}

function simpleCopySpec() {
  return {
    specification_id: "initial-explanation",
    artefact_title: "Your first explanation",
    audience: "You, for later revision and comparison",
    purpose: "Retain the learner's original explanation without generating a summary.",
    action_label: "Copy my first explanation",
    missing_response_text: "Not yet written.",
    sections: [
      {
        section_id: "initial-explanation",
        order: 1,
        heading: "Your first explanation",
        contributions: [
          {
            contribution_id: "initial-explanation-text",
            label: "Your first explanation",
            elicitation_id: "initial_explanation",
            response_part: "response_text"
          }
        ]
      }
    ]
  };
}

function compositeSpec() {
  return {
    specification_id: "evidence-record",
    artefact_title: "Evidence record",
    audience: "A reviewer",
    purpose: "Record what the learner selected and wrote.",
    action_label: "Assemble evidence record",
    missing_response_text: "Not yet answered.",
    sections: [
      {
        section_id: "checks",
        order: 1,
        heading: "Checked distinctions",
        contributions: [
          {
            contribution_id: "choice",
            label: "Choice",
            elicitation_id: "forms",
            item_id: "single",
            response_part: "selected_options"
          },
          {
            contribution_id: "judgement-text",
            label: "Judgement",
            elicitation_id: "judgement",
            response_part: "response_text"
          }
        ]
      }
    ]
  };
}

function compositePage() {
  return page(compositeSpec(), [
    {
      elicitation_id: "forms",
      order: 1,
      evidence_ask: "Pick one.",
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
          }
        ]
      },
      formative_return: {
        materials: [{ material_id: "guide", body: "Use the check result." }],
        forward_orientation: "Carry the checked result forward."
      }
    },
    {
      elicitation_id: "judgement",
      order: 2,
      evidence_ask: "Write the judgement.",
      epistemic_class: "non_determinate",
      delivery: {
        kind: "constructed_performance",
        prompt: "Write the judgement in your own words.",
        response_workspace: { intention: "A written judgement" }
      },
      formative_return: {
        materials: [{ material_id: "look", body: "Look at the claim again." }],
        forward_orientation: "Carry the writing forward."
      }
    }
  ]);
}

function render(pageBody) {
  const result = renderLearnerPageHtml(pageBody, { compositionMode: "beats" });
  assert.equal(result.error, null, String(result.error || ""));
  return result.html;
}

test("simple Copy-oriented one-to-one output is detected as direct_copy", () => {
  assert.equal(isSimpleDirectResponseOutput(simpleCopySpec()), true);
  assert.equal(isSimpleDirectResponseOutput(compositeSpec()), false);
  assert.equal(
    isSimpleDirectResponseOutput(
      Object.assign({}, simpleCopySpec(), { action_label: "Prepare commissioning brief" })
    ),
    false
  );
});

test("simple one-to-one Copy presentation keeps one response workspace", () => {
  const html = render(page(simpleCopySpec(), [constructed("initial_explanation")]));
  assert.match(html, /data-assessment-output-mode="direct_copy"/);
  assert.match(html, /Copy my first explanation/);
  assert.match(html, /data-assessment-output-copy="true"/);
  assert.match(html, /data-assessment-output-help="true"/);
  assert.match(html, /Later activities will not retrieve it automatically/);
  assert.match(html, /data-assessment-output-purpose="true"/);
  assert.equal(html.indexOf('data-assessment-assemble="true"'), -1);
  assert.equal(html.indexOf("Replace with current responses"), -1);
  assert.equal(html.indexOf('data-assessment-output="true"'), -1);
  assert.equal(html.indexOf('data-workspace-id="assessment-output-initial-explanation"'), -1);
  const textareas = html.match(/<textarea\b/g) || [];
  assert.equal(textareas.length, 1, "only the constructed response workspace should appear");
  assert.match(html, /data-workspace-id="assessment-constructed-initial_explanation"/);
  assert.match(html, /data-assessment-output-status/);
});

test("composite outputs keep the editable assembly interface", () => {
  const html = render(compositePage());
  assert.match(html, /data-assessment-output-mode="assemble"/);
  assert.match(html, /data-assessment-assemble="true"/);
  assert.match(html, /Replace with current responses/);
  assert.match(html, /data-assessment-output="true"/);
  assert.match(html, /data-workspace-id="assessment-output-evidence-record"/);
  assert.match(html, /Assemble evidence record/);
});
