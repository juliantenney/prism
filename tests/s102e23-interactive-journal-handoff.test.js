/**
 * Sprint 102E-23 — Interactive response_fulfilment → Learning Journal handoff.
 *
 * Artefact-bound prompt_set materials often use continuous prose (not numbered
 * lists). They must still mount learner-constructed-{E*} workspaces so the
 * parent journal can resolve the same text the component persists.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  renderLearnerPageHtml,
  proposeArtefactContractFromLearningJourney,
  resolveArtefactReference,
  discoverConstructedTextProducers
} = require("../lib/learner-renderer-vnext");
const {
  constructedTextWorkspaceId
} = require("../lib/learner-renderer-vnext/learner-artefact-producers");
const { createLearnerDraftStorage } = require("../lib/learner-renderer-vnext/learner-draft-storage");
const envelope = require("../lib/learner-renderer-vnext/learner-draft-envelope");
const {
  collectResponseParts,
  partsFromPromptSetMaterial
} = require("../lib/learner-renderer-vnext/compose-response-parts");
const { parsePromptSetItems } = require("../lib/learner-renderer-vnext/parse-prompt-set-items");

function memoryStorage() {
  const map = new Map();
  return {
    getItem(key) {
      return map.has(key) ? map.get(key) : null;
    },
    setItem(key, value) {
      map.set(String(key), String(value));
    },
    removeItem(key) {
      map.delete(String(key));
    }
  };
}

function defaultEpisodePlan() {
  return {
    archetype: "apply",
    beats: [
      { function: "orientation" },
      { function: "framing" },
      { function: "activation" },
      { function: "criteria_exposition" },
      { function: "worked_thinking" },
      { function: "guided_practice" },
      { function: "independent_performance" },
      { function: "verification" },
      { function: "revision" },
      { function: "reflection" },
      { function: "transfer" },
      { function: "transition" }
    ]
  };
}

/** C2-shaped continuous prose prompt_set (no numbered list items). */
function prosePromptBody(elicitationId, title, prompt) {
  return (
    "### Your Learning Journal response: " +
    elicitationId +
    "\n\n" +
    prompt +
    "\n\nYour analysis:\n\nAfter writing your initial response, review the explanatory feedback."
  );
}

function activityWithProsePromptSet(activityId, materialId, elicitationId, title, prompt, stepText) {
  return {
    activity_id: activityId,
    title: title,
    learner_task: "1. Study the examples.\n2. Complete the comparison table.\n3. " + stepText,
    expected_output: "A constructed judgement.",
    episode_plan: defaultEpisodePlan(),
    required_materials: [
      {
        material_id: materialId,
        material_type: "prompt_set",
        title: title,
        purpose: "Capture the journal contribution",
        specification: "Learner writes a constructed response.",
        response_fulfilment: {
          kind: "learner_text_production",
          response_kind: "text_compose",
          artefact_elicitation_id: elicitationId
        }
      }
    ],
    materials: [
      {
        material_id: materialId,
        material_type: "prompt_set",
        activity_id: activityId,
        title: elicitationId + " — " + title,
        body_format: "markdown",
        body: prosePromptBody(elicitationId, title, prompt)
      }
    ]
  };
}

function interactivePageE2toE5() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "interactive",
    title: "Comparing and judging feedback quality",
    activities: [
      activityWithProsePromptSet(
        "A1",
        "A1-M4",
        "E2",
        "Applying feedback criteria",
        "Write a short analysis of F1 and F2 using the feedback-quality criteria.",
        "Write a short analysis of F1 and F2 using the student extract and feedback-quality criteria."
      ),
      activityWithProsePromptSet(
        "A2",
        "A2-M5",
        "E3",
        "Making a comparative judgement",
        "Reach a defensible judgement about which feedback approach would be most useful.",
        "Write your comparative judgement and justification."
      ),
      activityWithProsePromptSet(
        "A3",
        "A3-M4",
        "E4",
        "Justifying an independent judgement",
        "Justify your independent judgement using relevant criteria and evidence.",
        "Write your independent judgement and justification."
      ),
      activityWithProsePromptSet(
        "A4",
        "A4-M3",
        "E5",
        "Reconsidering your reasoning",
        "Review your E4 justification and refine or reaffirm it.",
        "Write your review and refined or reaffirmed justification."
      )
    ]
  };
}

function journeyPage() {
  return {
    artifact_type: "page",
    product_id: "learning_journey",
    title: "Making Better Judgements About Feedback",
    commissions: [
      {
        commission_id: "c1",
        order: 1,
        product_id: "expository",
        title: "Understanding useful formative feedback",
        dependencies: ""
      },
      {
        commission_id: "c2",
        order: 2,
        product_id: "interactive",
        title: "Comparing and judging feedback quality",
        dependencies: "c1"
      }
    ],
    learning_journey: {
      journal: {
        enabled: true,
        title: "Your Learning Journal",
        entries: [
          {
            entry_id: "journal_1",
            order: 1,
            title: "Understanding feedback usefulness",
            framing: "Your initial explanation.",
            artefact_id: "c1.E1"
          },
          {
            entry_id: "journal_2",
            order: 2,
            title: "Applying feedback criteria",
            framing: "Your analysis.",
            artefact_id: "c2.E2"
          },
          {
            entry_id: "journal_3",
            order: 3,
            title: "Making a comparative judgement",
            framing: "Your comparative judgement.",
            artefact_id: "c2.E3"
          },
          {
            entry_id: "journal_4",
            order: 4,
            title: "Justifying an independent judgement",
            framing: "Your independent justification.",
            artefact_id: "c2.E4"
          },
          {
            entry_id: "journal_5",
            order: 5,
            title: "Reconsidering your reasoning",
            framing: "Your review.",
            artefact_id: "c2.E5"
          }
        ]
      }
    }
  };
}

function expositoryPageWithE1() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "expository",
    page_kind: "expository",
    title: "When formative feedback becomes useful",
    activities: [],
    sections: [
      {
        section_id: "S1",
        title: "Opening",
        order: 1,
        exposition: "Feedback usefulness depends on more than accuracy."
      }
    ],
    learner_artefacts: {
      produces: [
        {
          elicitation_id: "E1",
          response_kind: "constructed_text",
          label: "Understanding feedback usefulness",
          prompt: "Explain why accurate feedback may still fail to help."
        }
      ]
    }
  };
}

test("prose prompt_set without numbered items parses empty (precondition)", () => {
  const body = prosePromptBody(
    "E2",
    "Applying feedback criteria",
    "Write a short analysis of F1 and F2."
  );
  assert.equal(parsePromptSetItems(body).length, 0);
});

test("artefact-bound prose prompt_set emits a single constructed-text part", () => {
  const material = {
    id: "A1-M4",
    type: "prompt_set",
    title: "E2 — Applying feedback criteria",
    body: prosePromptBody("E2", "Applying", "Write a short analysis of F1 and F2.")
  };
  const unbound = partsFromPromptSetMaterial("A1", material);
  assert.equal(unbound.length, 0);
  const bound = partsFromPromptSetMaterial("A1", material, {
    artefactBinding: {
      elicitationId: "E2",
      workspaceId: constructedTextWorkspaceId("E2")
    }
  });
  assert.equal(bound.length, 1);
  assert.equal(bound[0].sourceKind, "prompt_item");
  assert.match(bound[0].prompt, /Write a short analysis/);
  assert.doesNotMatch(bound[0].prompt, /^Your Learning Journal response:\s*E2/i);
});

test("Interactive page mounts learner-constructed-E2..E5 and suppresses generic write duplicates", () => {
  const page = interactivePageE2toE5();
  const producers = discoverConstructedTextProducers(page);
  assert.deepEqual(
    producers.map((row) => row.elicitationId),
    ["E2", "E3", "E4", "E5"]
  );
  producers.forEach((row) => {
    assert.equal(row.workspaceId, constructedTextWorkspaceId(row.elicitationId));
    assert.equal(row.source, "interactive_response_fulfilment");
  });

  const rendered = renderLearnerPageHtml(page);
  assert.ok(!rendered.error, rendered.error && rendered.error.message);
  const html = rendered.html;

  ["E2", "E3", "E4", "E5"].forEach(function (id) {
    const workspaceId = constructedTextWorkspaceId(id);
    const matches = html.split('data-workspace-id="' + workspaceId + '"').length - 1;
    assert.equal(matches, 1, workspaceId + " must appear exactly once");
    assert.match(html, new RegExp('data-response-part-id="' + id + '"'));
  });

  assert.doesNotMatch(html, /data-workspace-id="learner-workspace-a1-a1-task-step/);
  assert.doesNotMatch(html, /data-workspace-id="learner-workspace-a2-a2-task-step/);
  assert.doesNotMatch(html, /data-workspace-id="learner-workspace-a3-a3-task-step/);
  assert.doesNotMatch(html, /data-workspace-id="learner-workspace-a4-a4-task-step/);
});

test("Interactive E2–E5 responses resolve into the parent Learning Journal with C1 intact", () => {
  const storage = memoryStorage();
  const api = createLearnerDraftStorage(storage);
  const c1 = expositoryPageWithE1();
  const c2 = interactivePageE2toE5();
  const pageKeyC1 = "page-c1";
  const pageKeyC2 = "page-c2";

  const proposal = proposeArtefactContractFromLearningJourney({
    page: journeyPage(),
    constituents: [
      {
        commissionId: "c1",
        productId: "expository",
        title: "Understanding useful formative feedback",
        sourcePage: c1,
        pageKey: pageKeyC1
      },
      {
        commissionId: "c2",
        productId: "interactive",
        title: "Comparing and judging feedback quality",
        sourcePage: c2,
        pageKey: pageKeyC2
      }
    ]
  });
  assert.equal(proposal.ok, true, JSON.stringify(proposal.gaps));
  assert.deepEqual(
    proposal.contract.produces.map((row) => row.artefactId),
    ["c1.E1", "c2.E2", "c2.E3", "c2.E4", "c2.E5"]
  );

  const draftC1 = envelope.createEmptyEnvelope(pageKeyC1);
  draftC1.workspaces[constructedTextWorkspaceId("E1")] = envelope.createWorkspaceState(
    "text_entry",
    { text: "Accurate feedback can still fail when learners cannot act on it." }
  );
  assert.equal(api.saveLearnerDraft(pageKeyC1, draftC1).ok, true);

  const draftC2 = envelope.createEmptyEnvelope(pageKeyC2);
  draftC2.workspaces[constructedTextWorkspaceId("E2")] = envelope.createWorkspaceState(
    "text_entry",
    { text: "F1 names the criterion but F2 stays vague." }
  );
  draftC2.workspaces[constructedTextWorkspaceId("E3")] = envelope.createWorkspaceState(
    "text_entry",
    { text: "I prefer F1 for actionable next steps." }
  );
  draftC2.workspaces[constructedTextWorkspaceId("E4")] = envelope.createWorkspaceState(
    "text_entry",
    { text: "Independently, F1 remains most useful for revision." }
  );
  draftC2.workspaces[constructedTextWorkspaceId("E5")] = envelope.createWorkspaceState(
    "text_entry",
    { text: "I retain F1 after review, with a clearer trade-off." }
  );
  assert.equal(api.saveLearnerDraft(pageKeyC2, draftC2).ok, true);

  const resources = [
    { commissionId: "c1", pageKey: pageKeyC1, title: "Understanding useful formative feedback" },
    { commissionId: "c2", pageKey: pageKeyC2, title: "Comparing and judging feedback quality" }
  ];

  const expected = {
    "c1.E1": "Accurate feedback can still fail when learners cannot act on it.",
    "c2.E2": "F1 names the criterion but F2 stays vague.",
    "c2.E3": "I prefer F1 for actionable next steps.",
    "c2.E4": "Independently, F1 remains most useful for revision.",
    "c2.E5": "I retain F1 after review, with a clearer trade-off."
  };

  Object.keys(expected).forEach(function (artefactId) {
    const resolved = resolveArtefactReference({
      contract: proposal.contract,
      artefactId: artefactId,
      resources: resources,
      storage: storage
    });
    assert.equal(resolved.ok, true, artefactId + " " + JSON.stringify(resolved));
    assert.equal(resolved.text, expected[artefactId]);
    // Journal must collect learner text, not the task prompt chrome.
    assert.doesNotMatch(resolved.text, /Your Learning Journal response/i);
  });

  // Reload must not invent duplicates — same identities resolve once.
  const again = resolveArtefactReference({
    contract: proposal.contract,
    artefactId: "c2.E2",
    resources: resources,
    storage: storage
  });
  assert.equal(again.text, expected["c2.E2"]);
  assert.equal(
    proposal.contract.produces.filter((row) => row.artefactId === "c2.E2").length,
    1
  );
});

test("collectResponseParts binds prose prompt_set and skips competing Write task-step", () => {
  const activity = activityWithProsePromptSet(
    "A1",
    "A1-M4",
    "E2",
    "Applying feedback criteria",
    "Write a short analysis of F1 and F2.",
    "Write a short analysis of F1 and F2 using the student extract."
  );
  const collected = collectResponseParts({
    activityId: "A1",
    momentKind: "do",
    modelActivity: { sourceActivity: activity },
    items: [
      {
        kind: "instruction",
        instruction: {
          sourceStepNumber: 3,
          text: "Write a short analysis of F1 and F2 using the student extract."
        }
      },
      {
        kind: "material",
        material: {
          id: "A1-M4",
          type: "prompt_set",
          title: "E2 — Applying feedback criteria",
          body: prosePromptBody("E2", "Applying", "Write a short analysis of F1 and F2.")
        }
      }
    ],
    taskSteps: [
      { sourceStepNumber: 1, text: "Study the examples." },
      { sourceStepNumber: 2, text: "Complete the comparison table." },
      {
        sourceStepNumber: 3,
        text: "Write a short analysis of F1 and F2 using the student extract."
      }
    ]
  });
  const textParts = collected.parts.filter((part) => part.surfaceKind === "text_entry");
  assert.equal(textParts.length, 1);
  assert.equal(textParts[0].workspaceId, constructedTextWorkspaceId("E2"));
  assert.equal(textParts[0].artefactElicitationId, "E2");
  assert.equal(textParts[0].responsePartId, "E2");
});
