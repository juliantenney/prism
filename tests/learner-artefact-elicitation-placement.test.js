/**
 * Learner artefact workspaces must render at their activity elicitation point,
 * not in a front-loaded journey-learner-artefacts region.
 */
"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");

const {
  renderLearnerPageHtml,
  proposeArtefactContractFromLearningJourney,
  resolveArtefactReference,
  createLearnerDraftStorage,
  learnerDraftEnvelope: envelope
} = require("../lib/learner-renderer-vnext");
const {
  composeDeclaredLearnerArtefactWorkspaces,
  composeDeclaredLearnerArtefactPlacement,
  listInlineBoundArtefactElicitationIds,
  constructedTextWorkspaceId
} = require("../lib/learner-renderer-vnext/learner-artefact-producers");

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

function defaultEpisodePlan(archetype) {
  return {
    archetype: archetype || "apply",
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

function activityWithBoundArtefact(activityId, title, elicitationId, materialId) {
  const mid = materialId || activityId + "-M1";
  return {
    activity_id: activityId,
    title: title,
    learner_task: "1. Write your response using the template.",
    expected_output: "A constructed judgement.",
    episode_plan: defaultEpisodePlan("apply"),
    required_materials: [
      {
        material_id: mid,
        material_type: "template",
        title: "Judgement template",
        purpose: "Capture the judgement",
        specification: "Learner writes a constructed judgement.",
        response_fulfilment: {
          kind: "learner_text_production",
          response_kind: "text_compose",
          artefact_elicitation_id: elicitationId
        }
      }
    ],
    materials: [
      {
        material_id: mid,
        material_type: "template",
        activity_id: activityId,
        title: "Judgement template",
        body_format: "markdown",
        body:
          "**My provisional position:**\nWrite your position.\n\n**Strongest reason:**\nExplain your strongest reason.\n"
      }
    ]
  };
}

function pageWithEarlyAndLateArtefacts() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "interactive",
    title: "Weighing the Evidence",
    learner_artefacts: {
      produces: [
        {
          elicitation_id: "E1",
          response_kind: "constructed_text",
          label: "Initial judgement",
          prompt: "State your provisional position."
        },
        {
          elicitation_id: "E0",
          response_kind: "constructed_text",
          label: "Early prediction",
          prompt: "Predict before reading the evidence."
        }
      ]
    },
    activities: [
      activityWithBoundArtefact("A1", "Make a prediction", "E0", "A1-M1"),
      {
        activity_id: "A2",
        title: "Examine the evidence",
        learner_task: "1. Read the witness accounts.",
        expected_output: "Notes on what the evidence establishes.",
        episode_plan: defaultEpisodePlan("apply"),
        required_materials: [],
        materials: [
          {
            material_id: "A2-M1",
            material_type: "text",
            activity_id: "A2",
            title: "Evidence brief",
            body_format: "markdown",
            body: "Read the witness accounts."
          }
        ]
      },
      activityWithBoundArtefact("A3", "Make your first judgement", "E1", "A3-M3")
    ]
  };
}

function pageWithUnplacedArtefact() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "interactive",
    title: "Unplaced artefact page",
    learner_artefacts: {
      produces: [
        {
          elicitation_id: "E9",
          response_kind: "constructed_text",
          label: "Orphan judgement",
          prompt: "Write something."
        }
      ]
    },
    activities: [
      {
        activity_id: "A1",
        title: "Read",
        learner_task: "1. Read the brief.",
        expected_output: "Familiarity with the brief.",
        episode_plan: defaultEpisodePlan("apply"),
        materials: [
          {
            material_id: "A1-M1",
            material_type: "text",
            activity_id: "A1",
            title: "Brief",
            body_format: "markdown",
            body: "No response surface here."
          }
        ]
      }
    ]
  };
}

function assessmentPage() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: "Assessment",
    activities: [],
    assessment_evidence: {
      purpose: {
        role: "R2",
        visibility_claim: "Judgement quality.",
        stop_rationale: "Formative stop.",
        forward_intent: "Carry forward."
      },
      learner_context: { depends_on_prior_work: false },
      pack_forward_orientation: "Use later.",
      elicitations: [
        {
          elicitation_id: "E1",
          order: 1,
          evidence_ask: "Write the judgement.",
          epistemic_class: "non_determinate",
          delivery: {
            kind: "constructed_performance",
            prompt: "Write your judgement.",
            response_workspace: { intention: "sustained_written_judgement" }
          },
          formative_return: {
            materials: [{ material_id: "look", body: "Look again." }],
            forward_orientation: "Carry forward."
          }
        }
      ]
    }
  };
}

function situatedPage() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "situated_task",
    title: "Situated",
    activities: [],
    situated_learning: {
      record: {
        entries: [
          {
            entry_id: "scratch",
            label: "Scratch notes",
            prompt: "Private notes."
          },
          {
            entry_id: "j1",
            label: "Case note",
            prompt: "Write the case note.",
            artefact: {
              elicitation_id: "E1",
              response_kind: "constructed_text",
              label: "Case note"
            }
          }
        ]
      }
    }
  };
}

function workspaceOrder(html, workspaceId) {
  const marker = 'data-workspace-id="' + workspaceId + '"';
  const indexes = [];
  let from = 0;
  while (from < html.length) {
    const idx = html.indexOf(marker, from);
    if (idx < 0) break;
    indexes.push(idx);
    from = idx + marker.length;
  }
  return indexes;
}

function regionIndex(html, regionId) {
  return html.indexOf('id="' + regionId + '"');
}

test("inline binding list recognises fulfilment-placed elicitations", () => {
  const page = pageWithEarlyAndLateArtefacts();
  const bound = listInlineBoundArtefactElicitationIds(page);
  assert.equal(bound.E0, true);
  assert.equal(bound.E1, true);
  assert.equal(
    composeDeclaredLearnerArtefactWorkspaces(page).length,
    0,
    "fulfilment-placed producers must not emit page-level workspaces"
  );
});

test("early activity artefact renders inside that activity, not before Activity 1", () => {
  const page = pageWithEarlyAndLateArtefacts();
  const rendered = renderLearnerPageHtml(page);
  assert.ok(!rendered.error, rendered.error);
  const html = rendered.html;
  const e0Indexes = workspaceOrder(html, constructedTextWorkspaceId("E0"));
  assert.equal(e0Indexes.length, 1, "E0 must render exactly once");
  const a1 = regionIndex(html, "activity-A1");
  const a2 = regionIndex(html, "activity-A2");
  assert.ok(a1 >= 0 && a2 >= 0);
  assert.ok(e0Indexes[0] > a1, "E0 workspace must appear after Activity 1 starts");
  assert.ok(e0Indexes[0] < a2, "E0 workspace must appear before Activity 2");
  assert.equal(html.includes('id="journey-learner-artefacts"'), false);
  assert.match(
    html.slice(e0Indexes[0], e0Indexes[0] + 180),
    /data-response-part-id="E0"/
  );
});

test("later activity artefact renders in Activity 3 after evidence work", () => {
  const page = pageWithEarlyAndLateArtefacts();
  const rendered = renderLearnerPageHtml(page);
  assert.ok(!rendered.error, rendered.error);
  const html = rendered.html;
  const e1Indexes = workspaceOrder(html, constructedTextWorkspaceId("E1"));
  assert.equal(e1Indexes.length, 1, "E1 must render exactly once");
  const a2 = regionIndex(html, "activity-A2");
  const a3 = regionIndex(html, "activity-A3");
  assert.ok(a2 >= 0 && a3 >= 0);
  assert.ok(e1Indexes[0] > a3, "E1 workspace must appear inside/after Activity 3");
  assert.ok(e1Indexes[0] > a2, "E1 workspace must follow evidence Activity 2");
  assert.match(
    html.slice(e1Indexes[0], e1Indexes[0] + 180),
    /data-response-part-id="E1"/
  );
  assert.ok(
    html.indexOf("Make your first judgement") < e1Indexes[0],
    "reading order: Activity 3 title before E1 workspace"
  );
});

test("unplaced producer uses post-activity fallback with clear diagnostic", () => {
  const page = pageWithUnplacedArtefact();
  const placement = composeDeclaredLearnerArtefactPlacement(page);
  assert.equal(placement.placement, "unplaced-fallback");
  assert.equal(placement.diagnostics[0].code, "LEARNER_ARTEFACT_UNPLACED_FALLBACK");
  assert.equal(placement.diagnostics[0].elicitationId, "E9");

  const rendered = renderLearnerPageHtml(page);
  assert.ok(!rendered.error, rendered.error);
  const html = rendered.html;
  const region = regionIndex(html, "journey-learner-artefacts");
  const activities = html.indexOf('data-region="activities"');
  assert.ok(region >= 0);
  assert.ok(activities >= 0);
  assert.ok(region > activities, "unplaced region must follow activities, not precede them");
  assert.match(html, /data-artefact-placement="unplaced-fallback"/);
  assert.match(html, /data-artefact-placement-diagnostic="LEARNER_ARTEFACT_UNPLACED_FALLBACK"/);
  assert.equal(workspaceOrder(html, constructedTextWorkspaceId("E9")).length, 1);
});

test("inline E1 identity remains resolvable as c1.E1 with persistence", () => {
  const page = pageWithEarlyAndLateArtefacts();
  const rendered = renderLearnerPageHtml(page);
  assert.ok(!rendered.error, rendered.error);
  assert.equal(workspaceOrder(rendered.html, "learner-constructed-E1").length, 1);

  const proposal = proposeArtefactContractFromLearningJourney({
    page: {
      artifact_type: "page",
      product_id: "learning_journey",
      title: "Journey",
      commissions: [
        {
          commission_id: "c1",
          order: 1,
          product_id: "interactive",
          title: page.title,
          dependencies: ""
        }
      ],
      learning_journey: {
        design_intent: "Placement",
        continuity: "Authentic contribution",
        journal: {
          enabled: true,
          title: "My Learning Journal",
          entries: [
            {
              entry_id: "j1",
              order: 1,
              title: "Initial judgement",
              framing: "Your first written position.",
              artefact_id: "c1.E1"
            }
          ]
        }
      }
    },
    constituents: [
      {
        commissionId: "c1",
        productId: "interactive",
        title: page.title,
        sourcePage: page,
        pageKey: "page-c1"
      }
    ]
  });
  assert.equal(proposal.ok, true, JSON.stringify(proposal.gaps));
  assert.equal(proposal.contract.produces[0].artefactId, "c1.E1");
  assert.equal(proposal.contract.produces[0].workspaceId, "learner-constructed-E1");

  const storage = memoryStorage();
  const draftApi = createLearnerDraftStorage(storage);
  const draft = envelope.createEmptyEnvelope("page-c1");
  draft.workspaces["learner-constructed-E1"] = envelope.createWorkspaceState("text_entry", {
    text: "Provisional: P is not yet established."
  });
  assert.equal(draftApi.saveLearnerDraft("page-c1", draft).ok, true);
  const resolved = resolveArtefactReference({
    contract: proposal.contract,
    artefactId: "c1.E1",
    resources: [{ commissionId: "c1", pageKey: "page-c1", title: page.title }],
    storage
  });
  assert.equal(resolved.ok, true);
  assert.equal(resolved.text, "Provisional: P is not yet established.");
});

test("Assessment Pack constructed_performance path is unchanged", () => {
  const rendered = renderLearnerPageHtml(assessmentPage());
  assert.ok(!rendered.error, rendered.error);
  assert.match(rendered.html, /data-workspace-id="assessment-constructed-E1"/);
  assert.equal(rendered.html.includes("journey-learner-artefacts"), false);
});

test("Situated Task artefact entry path is unchanged", () => {
  const rendered = renderLearnerPageHtml(situatedPage());
  assert.ok(!rendered.error, rendered.error);
  assert.match(rendered.html, /data-workspace-id="learner-constructed-E1"/);
  assert.match(rendered.html, /data-workspace-id="learner-workspace-situated-record-scratch"/);
});
