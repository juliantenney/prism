/**
 * Sprint 41 Slice 5 follow-up — preserve learner framing through Design Page composition.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);

const WORKSHOP_LEARNER_HANDOUT_BRIEF = {
  goal:
    "Using the uploaded lecture on climate change, create a misconception discussion workshop with task cards and small group discussion.",
  inputs: "Uploaded lecture transcript on climate change.",
  desiredOutputs: "Facilitator handout and learner handout",
  startingArtefact: "provided_source_content",
  selectedDomains: ["learning-design"]
};

function extractWorkflowBriefConfig(md) {
  const idx = md.indexOf("### Workflow Brief Config");
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).workflowBriefConfig;
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

const api = loadPrismTestApi();
const ldBriefConfig = api.normalizeWorkflowBriefConfig(
  extractWorkflowBriefConfig(fs.readFileSync(ldPatternsPath, "utf8"))
);

function workshopResolved() {
  const explicit = api.extractWorkflowBriefExplicitFactors(WORKSHOP_LEARNER_HANDOUT_BRIEF);
  const inferred = api.applyWorkflowBriefInferenceRules(
    ldBriefConfig,
    WORKSHOP_LEARNER_HANDOUT_BRIEF.goal,
    WORKSHOP_LEARNER_HANDOUT_BRIEF.inputs
  );
  return api.resolveWorkflowBriefFactors(
    ldBriefConfig,
    explicit,
    {},
    inferred,
    WORKSHOP_LEARNER_HANDOUT_BRIEF
  ).resolved;
}

function buildWorkshopUpstream() {
  return {
    activities: [
      {
        activity_id: "LO1",
        title: "Foundations",
        activity_preamble:
          "This activity builds your foundational understanding of climate mechanisms.",
        instructions: "Study the explanation and worked example.",
        reasoning_orientation: "Separate weather anecdotes from climate trend evidence."
      },
      {
        activity_id: "LO2",
        title: "Misconception cards",
        learner_task: "Discuss each card in your group."
      },
      {
        activity_id: "LO3",
        title: "Evidence sorting",
        learner_task: "Sort claims by evidence strength."
      },
      {
        activity_id: "LO4",
        title: "Synthesis",
        learner_task: "Draft a group response."
      },
      {
        activity_id: "LO5",
        title: "Reflection",
        learner_task: "Note one revised belief."
      }
    ]
  };
}

function buildTruncatedWorkshopPage() {
  return {
    artifact_type: "page",
    page_profile: "learner",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning Activities",
        content: [
          {
            activity_id: "LO1",
            title: "Foundations",
            instructions: "Study the explanation and worked example."
          },
          {
            activity_id: "LO2",
            title: "Misconception cards",
            learner_task: "Discuss each card in your group."
          }
        ]
      }
    ],
    generation_notes: {
      activities_omitted: [
        {
          activity_id: "LO3",
          reason: "output size constraint",
          authority: "output_size"
        },
        {
          activity_id: "LO4",
          reason: "output size constraint",
          authority: "output_size"
        },
        {
          activity_id: "LO5",
          reason: "output size constraint",
          authority: "output_size"
        }
      ]
    }
  };
}

test("repairLearnerPageCompositionFromUpstream: workshop page preserves activity_preamble from DLA", () => {
  const page = buildTruncatedWorkshopPage();
  const upstream = buildWorkshopUpstream();
  const result = api.repairLearnerPageCompositionFromUpstream(page, upstream);
  assert.ok(result.framingFieldsMerged >= 1);
  const lo1 = page.sections[0].content.find((row) => row.activity_id === "LO1");
  assert.match(
    String(lo1.activity_preamble || ""),
    /foundational understanding of climate mechanisms/i
  );
});

test("repairLearnerPageCompositionFromUpstream: workshop page preserves cognition field reasoning_orientation", () => {
  const page = buildTruncatedWorkshopPage();
  const upstream = buildWorkshopUpstream();
  api.repairLearnerPageCompositionFromUpstream(page, upstream);
  const lo1 = page.sections[0].content.find((row) => row.activity_id === "LO1");
  assert.match(
    String(lo1.reasoning_orientation || ""),
    /weather anecdotes from climate trend evidence/i
  );
});

test("repairLearnerPageCompositionFromUpstream: restores all upstream activity IDs and strips output-size omissions", () => {
  const page = buildTruncatedWorkshopPage();
  const upstream = buildWorkshopUpstream();
  const result = api.repairLearnerPageCompositionFromUpstream(page, upstream);
  assert.equal(result.omissionsStripped, 3);
  assert.equal(result.activitiesRestored, 3);
  const ids = page.sections[0].content.map((row) => row.activity_id);
  assert.deepEqual(ids, ["LO1", "LO2", "LO3", "LO4", "LO5"]);
  assert.equal(
    (page.generation_notes.activities_omitted || []).length,
    0,
    "unauthorized output-size omissions removed"
  );
});

test("applyPedagogicCognitionSemanticsToComposedPage: facilitated learner handout preserves framing end-to-end", () => {
  const page = buildTruncatedWorkshopPage();
  const upstream = buildWorkshopUpstream();
  const resolved = workshopResolved();
  const explicit = api.extractWorkflowBriefExplicitFactors(WORKSHOP_LEARNER_HANDOUT_BRIEF);
  const out = api.applyPedagogicCognitionSemanticsToComposedPage(page, {
    upstreamLearningActivities: upstream,
    resolvedFactors: resolved,
    explicitBriefFactors: explicit,
    workflowBriefConfig: ldBriefConfig,
    base: WORKSHOP_LEARNER_HANDOUT_BRIEF,
    pageProfile: "learner"
  });
  const lo1 = out.sections[0].content.find((row) => row.activity_id === "LO1");
  assert.match(
    String(lo1.activity_preamble || ""),
    /foundational understanding of climate mechanisms/i
  );
  assert.match(
    String(lo1.reasoning_orientation || ""),
    /weather anecdotes from climate trend evidence/i
  );
  const laSection = out.sections.find((sec) => sec.section_id === "learning_activities");
  assert.ok(laSection, "learning_activities section present");
  const rows = Array.isArray(laSection.content)
    ? laSection.content
    : laSection.content && laSection.content.activities
      ? laSection.content.activities
      : [];
  const ids = rows.map((row) => row.activity_id);
  assert.equal(ids.length, 5);
  assert.ok(ids.includes("LO1"));
  assert.ok(ids.includes("LO3"));
  assert.ok(ids.includes("LO5"));
});

test("applyPedagogicCognitionSemanticsToComposedPage: nested learning_activities capture preserves full DLA scaffolds", () => {
  const page = buildTruncatedWorkshopPage();
  const upstreamNested = {
    learning_activities: {
      content: [
        {
          activity_id: "LO1",
          title: "Foundations",
          activity_preamble:
            "This activity builds your foundational understanding of climate mechanisms.",
          prior_knowledge_activation:
            "Recall one concrete difference between weather variation and climate trend.",
          reasoning_orientation:
            "Separate weather anecdotes from climate trend evidence.",
          self_explanation_prompt:
            "Explain why one short cold period does not falsify a long-term warming trend.",
          transfer_or_application_task:
            "Apply this distinction to a current media claim and test whether it uses trend evidence.",
          uncertainty_tension_prompt:
            "What evidence would make your current judgement less certain?"
        }
      ]
    }
  };
  const out = api.applyPedagogicCognitionSemanticsToComposedPage(page, {
    upstreamLearningActivities: upstreamNested,
    pageProfile: "learner"
  });
  const lo1 = out.sections[0].content.find((row) => row.activity_id === "LO1");
  assert.match(String(lo1.activity_preamble || ""), /foundational understanding/i);
  assert.match(String(lo1.prior_knowledge_activation || ""), /weather variation/i);
  assert.match(String(lo1.reasoning_orientation || ""), /anecdotes/i);
  assert.match(String(lo1.self_explanation_prompt || ""), /short cold period/i);
  assert.match(String(lo1.transfer_or_application_task || ""), /media claim/i);
  assert.match(String(lo1.uncertainty_tension_prompt || ""), /less certain/i);
});

test("repairLearnerPageCompositionFromUpstream: facilitator page profile is not repaired", () => {
  const page = {
    page_profile: "facilitator",
    sections: [
      {
        section_id: "learning_activities",
        content: [{ activity_id: "LO1", facilitator_moves: ["Open with poll."] }]
      }
    ],
    generation_notes: {
      activities_omitted: [
        { activity_id: "LO2", reason: "output size constraint", authority: "output_size" }
      ]
    }
  };
  const upstream = buildWorkshopUpstream();
  const result = api.repairLearnerPageCompositionFromUpstream(page, upstream, {
    pageProfile: "facilitator"
  });
  assert.equal(result.repaired, false);
  assert.equal(page.sections[0].content.length, 1);
  assert.equal((page.generation_notes.activities_omitted || []).length, 1);
  assert.equal(page.sections[0].content[0].activity_preamble, undefined);
});

test("LEARNER_PAGE_ACTIVITY_FRAMING_PRESERVATION_FIELD_IDS includes support_note and expected_output", () => {
  const ids = api.LEARNER_PAGE_ACTIVITY_FRAMING_PRESERVATION_FIELD_IDS;
  assert.ok(ids.includes("activity_preamble"));
  assert.ok(ids.includes("learner_task"));
  assert.ok(ids.includes("support_note"));
  assert.ok(ids.includes("expected_output"));
});

test("end-to-end Design Page preserves rich nested DLA+GAM content into model and HTML", () => {
  const workflow = {
    id: "wf-rich-preserve",
    name: "Rich Preserve",
    steps: [
      {
        id: "s-dla",
        title: "Design Learning Activities",
        canonical_step_id: "step_design_learning_activities",
        outputName: "learning_activities",
        inputBindings: []
      },
      {
        id: "s-ep",
        title: "Design Episode Plan",
        canonical_step_id: "step_design_episode_plan",
        outputName: "episode_plans",
        inputBindings: [
          { kind: "internal", sourceStepId: "s-dla", artifactName: "learning_activities" }
        ]
      },
      {
        id: "s-gam",
        title: "Generate Activity Materials",
        canonical_step_id: "step_generate_activity_materials",
        outputName: "activity_materials",
        inputBindings: [
          { kind: "internal", sourceStepId: "s-dla", artifactName: "learning_activities" }
        ]
      },
      {
        id: "s-page",
        title: "Design Page",
        canonical_step_id: "step_design_page",
        outputName: "page",
        inputBindings: [
          { kind: "internal", sourceStepId: "s-dla", artifactName: "learning_activities" },
          { kind: "internal", sourceStepId: "s-gam", artifactName: "activity_materials" },
          { kind: "internal", sourceStepId: "s-ep", artifactName: "episode_plans" }
        ]
      }
    ]
  };
  api.setWorkflowsForTest([workflow]);
  api.setSelectedWorkflowIdForTest("wf-rich-preserve");

  const nestedDlaCapture = {
    learning_activities: {
      content: {
        activities: [
          {
            activity_id: "LO1",
            title: "Core concepts",
            activity_preamble:
              "Build a foundation in Marx's key concepts before applying or evaluating his ideas.",
            prior_knowledge_activation:
              "Recall what you already know about industrial capitalism.",
            reasoning_orientation:
              "Identify relationships rather than memorising definitions.",
            self_explanation_prompt: "How does each concept connect to the next?",
            transfer_or_application_task:
              "Apply the framework to a new example not covered in the scenarios.",
            uncertainty_tension_prompt:
              "Which aspect of Marx's analysis appears strongest, and which appears weakest?"
          },
          {
            activity_id: "LO2",
            title: "Concept mapping",
            activity_preamble:
              "Map relationships between historical materialism, class structure, and social change before evaluating claims.",
            learner_task: "Create a concept map from the source material."
          },
          {
            activity_id: "LO3",
            title: "Reasoning through examples",
            activity_preamble:
              "Work through examples step-by-step so each inferential move is visible and justified.",
            learner_task: "Complete the worked reasoning checkpoints."
          },
          {
            activity_id: "LO4",
            title: "Judgement with criteria",
            activity_preamble:
              "Use explicit criteria to compare interpretations and defend a justified judgement.",
            learner_task: "Apply criteria to two competing interpretations."
          },
          {
            activity_id: "LO5",
            title: "Capstone judgement",
            activity_preamble:
              "Consolidate your understanding by forming and defending a position on transfer to a contemporary case.",
            learner_task: "Write your judgement memo.",
            transfer_or_application_task:
              "Apply Marx's framework to platform labour and justify where it transfers and where it breaks."
          }
        ]
      }
    }
  };
  const upstreamEpisodePlans = {
    episode_plans: [
      {
        activity_id: "LO1",
        mapped_learning_outcome_ids: ["LO1"],
        episode_plan: {
          archetype: "understand",
          beats: [{ function: "explanation" }, { function: "worked_thinking" }]
        }
      },
      {
        activity_id: "LO2",
        mapped_learning_outcome_ids: ["LO2"],
        episode_plan: {
          archetype: "apply",
          beats: [{ function: "guided_practice" }, { function: "verification" }]
        }
      },
      {
        activity_id: "LO3",
        mapped_learning_outcome_ids: ["LO3"],
        episode_plan: {
          archetype: "analyse",
          beats: [{ function: "worked_thinking" }, { function: "guided_practice" }]
        }
      },
      {
        activity_id: "LO4",
        mapped_learning_outcome_ids: ["LO4"],
        episode_plan: {
          archetype: "evaluate",
          beats: [{ function: "explanation" }, { function: "verification" }]
        }
      },
      {
        activity_id: "LO5",
        mapped_learning_outcome_ids: ["LO5"],
        episode_plan: {
          archetype: "evaluate",
          beats: [{ function: "guided_practice" }, { function: "transfer" }]
        }
      }
    ]
  };
  const nestedGamCapture = {
    activity_materials: {
      activities: [
        {
          activity_id: "LO1",
          materials: {
            "LO1-W1": {
              type: "worked_example",
              purpose: "worked thinking",
              content: {
                body:
                  "## Worked Example\n\nStep 1: Trace concept links.\n\n## What experts notice\n- The chain of reasoning is explicit.\n\n**Bridge:** Apply the same structure to a new text."
              }
            }
          }
        },
        {
          activity_id: "LO5",
          materials: {
            "LO5-TR1": {
              type: "transfer_prompt",
              purpose: "transfer evaluate",
              content:
                "Transfer prompt: Apply Marx's framework to platform labour and justify where it transfers and where it breaks."
            },
            "LO5-CS1": {
              type: "consolidation_summary",
              purpose: "reflective consolidation",
              content: {
                markdown:
                  "Consolidation summary: Synthesize what changed in your judgement, what remains uncertain, and what evidence you would seek next."
              }
            }
          }
        }
      ]
    }
  };

  api.setWorkflowRunCapturedOutputsForTest({
    "s-dla": JSON.stringify(nestedDlaCapture, null, 2),
    "s-gam": JSON.stringify(nestedGamCapture, null, 2),
    "s-ep": JSON.stringify(upstreamEpisodePlans, null, 2)
  });

  const thinPageCapture = {
    artifact_type: "page",
    title: "Marx learner page",
    page_profile: "learner",
    episode_plans: [
      {
        activity_id: "LO1",
        mapped_learning_outcome_ids: ["LO1"],
        episode_plan: {
          archetype: "understand",
          beats: [{ function: "explanation" }, { function: "worked_thinking" }]
        }
      },
      {
        activity_id: "LO5",
        mapped_learning_outcome_ids: ["LO5"],
        episode_plan: {
          archetype: "evaluate",
          beats: [{ function: "guided_practice" }, { function: "transfer" }]
        }
      }
    ],
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning Activities",
        content: [
          {
            activity_id: "LO1",
            title: "Core concepts",
            learner_task: "Read and answer.",
            episode_plan: {
              archetype: "understand",
              beats: [{ function: "explanation" }, { function: "worked_thinking" }]
            },
            materials: { worked_example: "Definitions and explanations..." }
          },
          {
            activity_id: "LO2",
            title: "Concept mapping",
            learner_task: "Create a map.",
            materials: { concept_exposition: "Short concept summary." }
          },
          {
            activity_id: "LO3",
            title: "Reasoning through examples",
            learner_task: "Do steps.",
            materials: { worked_example: "Compressed worked steps." }
          },
          {
            activity_id: "LO4",
            title: "Judgement with criteria",
            learner_task: "Judge.",
            materials: { checklist: "Criteria label list." }
          },
          {
            activity_id: "LO5",
            title: "Capstone judgement",
            learner_task: "Write your judgement memo.",
            episode_plan: {
              archetype: "evaluate",
              beats: [{ function: "guided_practice" }, { function: "transfer" }]
            },
            materials: {
              transfer_prompt_evaluate: "Thin transfer placeholder.",
              consolidation_summary: "Brief wrap-up note."
            }
          }
        ]
      }
    ],
    generation_notes: { limitations: [], activities_omitted: [] }
  };
  const pageLi = {
    getAttribute: (k) => (k === "data-step-id" ? "s-page" : ""),
    querySelector: () => null
  };
  const validated = api.applyPageCompositionValidationForCapturedPage(
    pageLi,
    JSON.stringify(thinPageCapture, null, 2)
  );
  assert.ok(validated && validated.json, "expected composed page JSON output");
  const pageModel = JSON.parse(validated.json);

  const laSection = pageModel.sections.find((s) => s.section_id === "learning_activities");
  assert.ok(laSection && Array.isArray(laSection.content), "learning_activities section missing");
  const lo1 = laSection.content.find((r) => String(r.activity_id) === "LO1");
  const lo2 = laSection.content.find((r) => String(r.activity_id) === "LO2");
  const lo3 = laSection.content.find((r) => String(r.activity_id) === "LO3");
  const lo4 = laSection.content.find((r) => String(r.activity_id) === "LO4");
  const lo5 = laSection.content.find((r) => String(r.activity_id) === "LO5");
  assert.ok(lo1 && lo2 && lo3 && lo4 && lo5, "LO1–LO5 rows should exist");
  assert.match(
    String(lo1.activity_preamble || ""),
    /Build a foundation in Marx's key concepts before applying or evaluating his ideas\./
  );
  assert.match(
    String(lo1.prior_knowledge_activation || ""),
    /Recall what you already know about industrial capitalism\./
  );
  assert.match(
    String(lo1.reasoning_orientation || ""),
    /Identify relationships rather than memorising definitions\./
  );
  assert.match(String(lo1.self_explanation_prompt || ""), /How does each concept connect to the next\?/);
  assert.match(
    String(lo2.activity_preamble || ""),
    /Map relationships between historical materialism/i
  );
  assert.match(
    String(lo3.activity_preamble || ""),
    /Work through examples step-by-step/i
  );
  assert.match(
    String(lo4.activity_preamble || ""),
    /Use explicit criteria to compare interpretations/i
  );
  assert.match(
    String(lo5.activity_preamble || ""),
    /Consolidate your understanding by forming and defending a position/i
  );
  assert.match(
    String(lo1.materials && lo1.materials.worked_example ? lo1.materials.worked_example : ""),
    /## Worked Example[\s\S]*Step 1: Trace concept links[\s\S]*## What experts notice[\s\S]*\*\*Bridge:\*\*/i
  );
  const lo5TransferText = String(
    (lo5.materials &&
      (lo5.materials.transfer_prompt_evaluate || lo5.materials.transfer_prompt || lo5.materials.prompt_set)) ||
      ""
  );
  assert.match(lo5TransferText, /Apply Marx's framework to platform labour/i);
  assert.match(
    String(lo5.materials && lo5.materials.consolidation_summary ? lo5.materials.consolidation_summary : ""),
    /Synthesize what changed in your judgement/i
  );
  assert.doesNotMatch(
    String(lo1.materials && lo1.materials.worked_example ? lo1.materials.worked_example : ""),
    /Definitions and explanations\.\.\./i
  );
  assert.doesNotMatch(
    lo5TransferText,
    /Thin transfer placeholder\./i
  );

  const rendered = api.buildUtilityStructuredHtmlForTest(pageModel);
  const html = String((rendered && rendered.html) || "");
  assert.match(html, /Build a foundation in Marx(?:&#39;|')s key concepts/i);
  assert.match(html, /Recall what you already know about industrial capitalism/i);
  assert.match(html, /Identify relationships rather than memorising definitions/i);
  assert.match(html, /How does each concept connect to the next\?/i);
  assert.match(html, /What experts notice/i);
  assert.match(html, /Bridge:/i);
  assert.match(html, /Apply Marx(?:&#39;|')s framework to platform labour/i);
  assert.match(html, /Synthesize what changed in your judgement/i);
  assert.doesNotMatch(html, /Short worked_example summary\./i);
  assert.doesNotMatch(html, /Thin transfer placeholder\./i);
  assert.match(
    JSON.stringify(pageModel.episode_plans || []),
    /"activity_id":"LO1"[\s\S]*"archetype":"understand"/i
  );
  assert.match(
    JSON.stringify(pageModel.episode_plans || []),
    /"activity_id":"LO5"[\s\S]*"archetype":"evaluate"/i
  );
  assert.match(JSON.stringify(lo1.episode_plan || {}), /"archetype":"understand"/i);
  assert.match(JSON.stringify(lo5.episode_plan || {}), /"archetype":"evaluate"/i);
});

test("Design Page compose: content.activities DLA shape preserves truncated scaffolds verbatim", () => {
  const fullPreamble =
    "This opening activity establishes the foundation for the session. You will examine the relationship between organisational plans and human adoption before judging implementation risk.";
  const upstream = {
    artifact_type: "learning_activities",
    content: {
      activities: [
        {
          activity_id: "A1",
          title: "Opening orientation",
          activity_preamble: fullPreamble,
          learner_task: "Read the exposition and annotate two adoption risks.",
          expected_output:
            "A short note naming two adoption risks with evidence from the exposition.",
          reasoning_orientation:
            "Separate plan intent from observable adoption behaviour before judging success.",
          self_explanation_prompt:
            "Explain why adoption evidence matters more than plan rhetoric in this case.",
          intellectual_coherence_bridge:
            "Carry your adoption-risk lens into the worked example that follows."
        }
      ]
    }
  };
  const page = {
    artifact_type: "page",
    page_profile: "learner",
    episode_plans: [
      {
        activity_id: "A1",
        episode_plan: { archetype: "understand", beats: [{ function: "explanation" }] }
      }
    ],
    sections: [
      {
        section_id: "learning_activities",
        content: [
          {
            activity_id: "A1",
            title: "Opening orientation",
            activity_preamble: "This opening activity establishes the foundation for the session.",
            learner_task: "Read.",
            expected_output: "Short note.",
            materials: {
              text: "A1_TEXT",
              worked_example: "A1_WORKED",
              sample_output: "A1_SAMPLE",
              checklist: "A1_CHECK"
            }
          }
        ]
      }
    ]
  };
  const gamUpstream = {
    artifact_type: "activity_materials",
    content: {
      activities: [
        {
          activity_id: "A1",
          materials: [
            {
              material_id: "M1",
              type: "text",
              purpose: "exposition",
              content:
                "Organisational plans describe intended change, but adoption depends on how people interpret, resist, and adapt those plans in practice. Read for signals of alignment, friction, and workaround behaviour."
            },
            {
              material_id: "M2",
              type: "worked_example",
              purpose: "worked thinking",
              content:
                "## Worked Example\n\nStep 1: Name the plan claim.\n\nStep 2: List adoption evidence.\n\n## What experts notice\n- Plans and behaviour can diverge.\n\n**Bridge:** Use the same evidence lens on your own case."
            },
            {
              material_id: "M3",
              type: "sample_output",
              purpose: "model answer",
              content: "Sample output: two adoption risks with quoted evidence from the exposition."
            },
            {
              material_id: "M4",
              type: "checklist",
              purpose: "verification",
              content:
                "- [ ] I named two adoption risks\n- [ ] Each risk cites exposition evidence\n- [ ] I distinguished plan rhetoric from observed behaviour"
            }
          ]
        }
      ]
    }
  };
  const out = api.applyPedagogicCognitionSemanticsToComposedPage(page, {
    upstreamLearningActivities: upstream,
    upstreamActivityMaterials: gamUpstream,
    pageProfile: "learner"
  });
  const row = out.sections[0].content[0];
  assert.equal(String(row.activity_preamble || ""), fullPreamble);
  assert.match(String(row.learner_task || ""), /annotate two adoption risks/i);
  assert.match(String(row.expected_output || ""), /two adoption risks with evidence/i);
  assert.match(String(row.reasoning_orientation || ""), /observable adoption behaviour/i);
  assert.match(String(row.self_explanation_prompt || ""), /adoption evidence matters/i);
  assert.match(String(row.intellectual_coherence_bridge || ""), /worked example that follows/i);
  assert.match(String(row.materials.text || ""), /Organisational plans describe intended change/i);
  assert.match(String(row.materials.worked_example || ""), /## Worked Example[\s\S]*What experts notice/i);
  assert.match(String(row.materials.sample_output || ""), /Sample output: two adoption risks/i);
  assert.match(String(row.materials.checklist || ""), /I named two adoption risks/i);
  assert.doesNotMatch(JSON.stringify(row.materials || {}), /A1_TEXT|A1_WORKED|A1_SAMPLE|A1_CHECK/);
  assert.match(JSON.stringify(out.episode_plans || []), /"activity_id":"A1"/i);
});
