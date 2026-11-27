/**
 * Sprint 98 M5 — Option C: bounded instructional scaffold sequencing.
 *
 * When Interactive timeline[].learner_study_flow marks a material's first
 * disclosure as optional_scaffold / conceptual_scaffold after an earlier
 * attempt step, that material must not appear as open Learn-before-Do
 * content. It becomes collapsed, learner-controlled support on the task.
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  renderLearnerPageHtml
} = require("../lib/learner-renderer-vnext/render-learner-page.js");
const {
  buildPageModel,
  buildComposedPageModel,
  buildActivityCompositionMap
} = require("../lib/learner-renderer-vnext");
const {
  attemptBeforeScaffoldsFromStudyFlow,
  buildSequenceContext,
  relocateAttemptBeforeScaffolds
} = require("../lib/learner-renderer-vnext/compose-sequence-context.js");

function material(id, type, title, body, extras) {
  return Object.assign(
    {
      material_id: id,
      material_type: type,
      activity_id: String(id).split("-")[0],
      title: title,
      body_format: "markdown",
      body: body
    },
    extras || {}
  );
}

function interactivePage(overrides) {
  return Object.assign(
    {
      artifact_type: "page",
      schema_version: "2.0.0",
      title: "Why the constraint matters",
      page_synthesis: {
        knowledge_summary: {
          body: "Knowledge Summary: constrained optimisation separates the objective from the restriction."
        }
      },
      activities: [],
      learning_sequence: { ordered_activity_ids: [], timeline: [] }
    },
    overrides || {}
  );
}

function a3Activity() {
  return {
    activity_id: "A3",
    title: "Prove the completed-square form",
    learner_task: [
      "1. Attempt the blank proof for the original constraint.",
      "2. Consult the worked illustration only if needed.",
      "3. Compare your proof with the verified feedback."
    ].join("\n"),
    expected_output: "A completed independent proof attempt.",
    episode_plan: {
      archetype: "analyse",
      beats: [
        { function: "orientation" },
        { function: "framing" },
        { function: "explanation" },
        { function: "independent_performance" },
        { function: "verification" },
        { function: "transition" }
      ]
    },
    materials: [
      material(
        "A3-M1",
        "text",
        "Illustrative completed-square proof",
        "For the illustration p+q=12, completing the square yields A=36-(p-6)^2."
      ),
      material(
        "A3-M2",
        "template",
        "Blank proof template",
        "**Independent proof attempt**\n\nWrite your substitution and completed-square steps here."
      ),
      material(
        "A3-M3",
        "sample_output",
        "Verified proof feedback",
        "## Reveal after completing your proof\n\nThe destination proof for the original problem is shown here."
      )
    ]
  };
}

function a2Activity() {
  return {
    activity_id: "A2",
    title: "Test which rectangles are feasible",
    learner_task: [
      "1. Inspect the four proposed side-length pairs.",
      "2. Classify each rectangle and calculate its area.",
      "3. Optionally consult the modelling note.",
      "4. Review your calculations using the feedback."
    ].join("\n"),
    expected_output: "A completed comparison covering the supplied rectangles.",
    episode_plan: {
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
    },
    materials: [
      material(
        "A2-M1",
        "scenario",
        "Four proposed rectangles",
        "Four proposed rectangles have dimensions (2,8), (4,6), (5,5) and (6,6)."
      ),
      material(
        "A2-M2",
        "modelling_note",
        "Distinct-data modelling note",
        "Worked modelling uses a=3, b=7 so the focal R1–R4 cases remain independent."
      ),
      material(
        "A2-M3",
        "comparison_table",
        "Rectangle feasibility and area comparison",
        [
          "| Side lengths | Feasible or infeasible | Area |",
          "| --- | --- | --- |",
          "| (2,8) |  |  |",
          "| (4,6) |  |  |"
        ].join("\n")
      ),
      material(
        "A2-M4",
        "sample_output",
        "Worked comparison and feedback",
        [
          "## Reveal after completing your comparison",
          "",
          "| Side lengths | Feasibility | Area |",
          "| --- | --- | --- |",
          "| (2,8) | Feasible | 16 |"
        ].join("\n")
      )
    ]
  };
}

function explanationFirstActivity() {
  return {
    activity_id: "A5",
    title: "Apply the feasibility rule",
    learner_task: "1. Study the rule.\n2. Classify the supplied pairs.",
    expected_output: "Classifications for each pair.",
    episode_plan: {
      archetype: "apply",
      beats: [
        { function: "orientation" },
        { function: "explanation" },
        { function: "independent_performance" },
        { function: "verification" },
        { function: "transition" }
      ]
    },
    materials: [
      material(
        "A5-M1",
        "text",
        "Feasibility rule",
        "A pair is feasible when the sum of the sides does not exceed the fixed perimeter."
      ),
      material(
        "A5-M2",
        "template",
        "Classification workspace",
        "**Classify each pair:**\n\n"
      )
    ]
  };
}

function a3StudyFlow() {
  return [
    {
      step: 1,
      action: "Attempt the blank proof independently",
      material_ids: ["A3-M2"],
      disclosure: "initial_attempt"
    },
    {
      step: 2,
      action: "Study the illustrative proof if needed",
      material_ids: ["A3-M1"],
      disclosure: "conceptual_scaffold"
    },
    {
      step: 3,
      action: "Compare with verified feedback",
      material_ids: ["A3-M3"],
      disclosure: "post_attempt_feedback"
    }
  ];
}

function a2StudyFlow() {
  return [
    {
      step: 1,
      action: "Inspect the scenario and begin the table",
      material_ids: ["A2-M1", "A2-M3"],
      disclosure: "initial_attempt"
    },
    {
      step: 2,
      action: "Consult optional modelling if stuck",
      material_ids: ["A2-M2"],
      disclosure: "optional_scaffold"
    },
    {
      step: 3,
      action: "Reveal worked comparison",
      material_ids: ["A2-M4"],
      disclosure: "post_attempt_feedback"
    }
  ];
}

function render(page) {
  const rendered = renderLearnerPageHtml(page, { compositionMode: "moments" });
  assert.equal(rendered.error, null, rendered.error && rendered.error.message);
  return String(rendered.html || "");
}

function momentHtml(html, activityId, kind) {
  const marker =
    'data-composition-moment="' + kind + '" data-activity-id="' + activityId + '"';
  const at = html.indexOf(marker);
  if (at < 0) return "";
  const start = html.lastIndexOf("<section", at);
  const next = html.indexOf('data-composition-moment="', at + marker.length);
  const end = next >= 0 ? next : html.length;
  return html.slice(start, end);
}

function articleHtml(html, materialId) {
  const marker = 'data-material-id="' + materialId + '"';
  const at = html.indexOf(marker);
  assert.ok(at >= 0, "missing material " + materialId);
  const open = html.lastIndexOf("<article", at);
  const end = html.indexOf("</article>", at);
  return html.slice(open, end + "</article>".length);
}

function revealAroundMaterial(html, materialId) {
  const article = articleHtml(html, materialId);
  const at = html.indexOf(article);
  const before = html.slice(Math.max(0, at - 520), at);
  const match = before.match(
    /<details class="util-composition-reveal[^"]*"([^>]*)>\s*<summary>([^<]*)<\/summary>\s*<div class="util-composition-reveal__body">\s*$/
  );
  if (!match) return null;
  return {
    attrs: match[1],
    summary: match[2],
    open: /\sopen(?:\s|=|>)/.test(match[1]),
    disclosure: (match[1].match(/data-study-flow-disclosure="([^"]*)"/) || [])[1] || ""
  };
}

test("study-flow parser identifies attempt-before scaffolds by disclosure allow-list", () => {
  const scaffolds = attemptBeforeScaffoldsFromStudyFlow(a3StudyFlow());
  assert.deepEqual(Object.keys(scaffolds).sort(), ["A3-M1"]);
  assert.equal(scaffolds["A3-M1"].disclosure, "conceptual_scaffold");

  const a2 = attemptBeforeScaffoldsFromStudyFlow(a2StudyFlow());
  assert.deepEqual(Object.keys(a2).sort(), ["A2-M2"]);
  assert.equal(a2["A2-M2"].disclosure, "optional_scaffold");

  // Dual-purpose material first listed in initial_attempt must not be relocated.
  const dual = attemptBeforeScaffoldsFromStudyFlow([
    {
      step: 1,
      material_ids: ["A1-M1", "A1-M2"],
      disclosure: "initial_attempt"
    },
    {
      step: 2,
      material_ids: ["A1-M1"],
      disclosure: "conceptual_support"
    }
  ]);
  assert.equal(Object.keys(dual).length, 0);
});

test("A3: independent proof attempt precedes illustrative proof; scaffold on demand", () => {
  const page = interactivePage({
    activities: [a3Activity()],
    learning_sequence: {
      ordered_activity_ids: ["A3"],
      timeline: [
        {
          activity_id: "A3",
          purpose: "Independent proof before illustration",
          learner_study_flow: a3StudyFlow()
        }
      ]
    }
  });
  const html = render(page);
  const learn = momentHtml(html, "A3", "learn");
  const doMoment = momentHtml(html, "A3", "do");
  const check = momentHtml(html, "A3", "check");

  assert.equal(learn.indexOf('data-material-id="A3-M1"'), -1, "illustrative proof must leave open Learn");
  assert.ok(doMoment.indexOf('data-material-id="A3-M2"') >= 0, "blank proof template remains in Do");
  assert.ok(doMoment.indexOf('data-material-id="A3-M1"') >= 0, "illustrative proof attaches to Do");

  const proofAt = doMoment.indexOf('data-material-id="A3-M1"');
  const templateAt = doMoment.indexOf('data-material-id="A3-M2"');
  assert.ok(templateAt >= 0 && proofAt > templateAt, "attempt surface before illustrative scaffold");

  const reveal = revealAroundMaterial(html, "A3-M1");
  assert.ok(reveal, "illustrative proof must use disclosure control");
  assert.equal(reveal.open, false);
  assert.equal(reveal.disclosure, "conceptual_scaffold");
  assert.match(reveal.summary, /Worked illustration|first attempt/i);
  assert.ok(doMoment.indexOf("<summary>" + reveal.summary + "</summary>") >= 0);

  assert.ok(check.indexOf('data-material-id="A3-M3"') >= 0);
  const feedback = revealAroundMaterial(html, "A3-M3");
  assert.ok(feedback);
  assert.equal(feedback.open, false);
  assert.match(feedback.summary, /Reveal verified|Review the example response/i);
});

test("A2: optional procedural support is initially collapsed, not compulsory Learn", () => {
  const page = interactivePage({
    activities: [a2Activity()],
    learning_sequence: {
      ordered_activity_ids: ["A2"],
      timeline: [
        {
          activity_id: "A2",
          purpose: "Independent comparison with optional modelling",
          learner_study_flow: a2StudyFlow()
        }
      ]
    }
  });
  const html = render(page);
  const learn = momentHtml(html, "A2", "learn");
  const doMoment = momentHtml(html, "A2", "do");

  assert.equal(learn.indexOf('data-material-id="A2-M2"'), -1);
  assert.ok(doMoment.indexOf('data-material-id="A2-M1"') >= 0);
  assert.ok(doMoment.indexOf('data-material-id="A2-M3"') >= 0);
  assert.ok(doMoment.indexOf('data-material-id="A2-M2"') >= 0);

  const modellingAt = doMoment.indexOf('data-material-id="A2-M2"');
  const scenarioAt = doMoment.indexOf('data-material-id="A2-M1"');
  assert.ok(scenarioAt >= 0 && modellingAt > scenarioAt);

  const reveal = revealAroundMaterial(html, "A2-M2");
  assert.ok(reveal);
  assert.equal(reveal.open, false);
  assert.equal(reveal.disclosure, "optional_scaffold");
  assert.match(reveal.summary, /Optional support|first attempt/i);
});

test("explanation-first activity keeps preparatory Learn when no attempt-before intention", () => {
  const page = interactivePage({
    activities: [explanationFirstActivity()],
    learning_sequence: {
      ordered_activity_ids: ["A5"],
      timeline: [
        {
          activity_id: "A5",
          purpose: "Study the rule then classify",
          learner_study_flow: [
            {
              step: 1,
              action: "Study the preparatory rule",
              material_ids: ["A5-M1"],
              disclosure: "conceptual_support"
            },
            {
              step: 2,
              action: "Classify the pairs",
              material_ids: ["A5-M2"],
              disclosure: "initial_attempt"
            }
          ]
        }
      ]
    }
  });
  const html = render(page);
  const learn = momentHtml(html, "A5", "learn");
  const doMoment = momentHtml(html, "A5", "do");
  assert.ok(learn.indexOf('data-material-id="A5-M1"') >= 0);
  assert.equal(revealAroundMaterial(html, "A5-M1"), null);
  // A5-M2 is a fully consumed template: its title-only shell is suppressed (F12), so the
  // material is evidenced in Do by its response workspace.
  assert.match(doMoment, /data-response-part-id="[^"]*a5-m2[^"]*"/i);
  assert.ok(html.indexOf('data-composition-moment="learn"') < html.indexOf('data-composition-moment="do"'));
});

test("missing study-flow metadata preserves existing Learn-before-Do rendering", () => {
  const withFlow = interactivePage({
    activities: [a3Activity()],
    learning_sequence: {
      ordered_activity_ids: ["A3"],
      timeline: [
        {
          activity_id: "A3",
          purpose: "Independent proof before illustration",
          learner_study_flow: a3StudyFlow()
        }
      ]
    }
  });
  const withoutFlow = interactivePage({
    activities: [a3Activity()],
    learning_sequence: {
      ordered_activity_ids: ["A3"],
      timeline: [{ activity_id: "A3", purpose: "Prove the form" }]
    }
  });

  const htmlMissing = render(withoutFlow);
  const learn = momentHtml(htmlMissing, "A3", "learn");
  const doMoment = momentHtml(htmlMissing, "A3", "do");
  assert.ok(learn.indexOf('data-material-id="A3-M1"') >= 0);
  assert.equal(revealAroundMaterial(htmlMissing, "A3-M1"), null);
  assert.ok(doMoment.indexOf('data-material-id="A3-M2"') >= 0);
  assert.ok(
    htmlMissing.indexOf('data-material-id="A3-M1"') <
      htmlMissing.indexOf('data-material-id="A3-M2"')
  );

  const ctx = buildSequenceContext(withFlow);
  assert.ok(ctx.attemptBeforeScaffoldsByActivityId.A3);
  const ctxMissing = buildSequenceContext(withoutFlow);
  assert.equal(ctxMissing.attemptBeforeScaffoldsByActivityId.A3, undefined);
});

test("worked feedback remains in Check and initially deferred", () => {
  const page = interactivePage({
    activities: [a2Activity(), a3Activity()],
    learning_sequence: {
      ordered_activity_ids: ["A2", "A3"],
      timeline: [
        { activity_id: "A2", purpose: "Compare", learner_study_flow: a2StudyFlow() },
        { activity_id: "A3", purpose: "Prove", learner_study_flow: a3StudyFlow() }
      ]
    }
  });
  const html = render(page);
  for (const id of ["A2-M4", "A3-M3"]) {
    const checkKind = id.startsWith("A2") ? "A2" : "A3";
    const check = momentHtml(html, checkKind, "check");
    assert.ok(check.indexOf('data-material-id="' + id + '"') >= 0);
    const learn = momentHtml(html, checkKind, "learn");
    assert.equal(learn.indexOf('data-material-id="' + id + '"'), -1);
    const reveal = revealAroundMaterial(html, id);
    assert.ok(reveal);
    assert.equal(reveal.open, false);
    assert.match(reveal.summary, /Reveal verified|Review the example response/i);
  }
});

test("scaffold disclosure controls have meaningful labels and remain keyboard-operable", () => {
  const page = interactivePage({
    activities: [a2Activity(), a3Activity()],
    learning_sequence: {
      ordered_activity_ids: ["A2", "A3"],
      timeline: [
        { activity_id: "A2", purpose: "Compare", learner_study_flow: a2StudyFlow() },
        { activity_id: "A3", purpose: "Prove", learner_study_flow: a3StudyFlow() }
      ]
    }
  });
  const html = render(page);
  const a2Reveal = revealAroundMaterial(html, "A2-M2");
  const a3Reveal = revealAroundMaterial(html, "A3-M1");
  assert.ok(a2Reveal && a2Reveal.summary.trim().length > 0);
  assert.ok(a3Reveal && a3Reveal.summary.trim().length > 0);
  assert.match(html, /<details[^>]*data-study-flow-disclosure="optional_scaffold"[^>]*>\s*<summary>/);
  assert.match(html, /<details[^>]*data-study-flow-disclosure="conceptual_scaffold"[^>]*>\s*<summary>/);
  // Native <details>/<summary> is keyboard operable; content remains in DOM when closed.
  assert.match(articleHtml(html, "A2-M2"), /Distinct-data modelling note|a=3/);
  assert.match(articleHtml(html, "A3-M1"), /Illustrative completed-square proof|p\+q=12/);
});

test("Knowledge Summary remains before activities; Learn/Do are not globally swapped", () => {
  const page = interactivePage({
    activities: [a3Activity()],
    learning_sequence: {
      ordered_activity_ids: ["A3"],
      timeline: [
        {
          activity_id: "A3",
          purpose: "Independent proof before illustration",
          learner_study_flow: a3StudyFlow()
        }
      ]
    }
  });
  const html = render(page);
  const ksAt = html.indexOf("Knowledge Summary: constrained optimisation");
  const activityAt = html.indexOf('id="activity-A3"');
  assert.ok(ksAt >= 0 && activityAt > ksAt);

  const doAt = html.indexOf('data-composition-moment="do" data-activity-id="A3"');
  const learnAt = html.indexOf('data-composition-moment="learn" data-activity-id="A3"');
  if (learnAt >= 0) {
    assert.ok(learnAt < doAt);
  }
  assert.ok(doAt >= 0);
});

test("non-Interactive pageKinds do not relocate scaffolds; relocate helper is Interactive-gated", () => {
  const page = interactivePage({
    activities: [a3Activity()],
    learning_sequence: {
      ordered_activity_ids: ["A3"],
      timeline: [
        {
          activity_id: "A3",
          purpose: "Independent proof before illustration",
          learner_study_flow: a3StudyFlow()
        }
      ]
    }
  });
  const modelResult = buildPageModel(page);
  assert.equal(modelResult.ok, true);
  assert.equal(modelResult.model.pageKind, "interactive");

  // Gate: assessment / expository / situated_task must leave Learn materials open.
  ["assessment", "expository", "situated_task"].forEach((kind) => {
    const gated = {
      ok: true,
      model: Object.assign({}, modelResult.model, { pageKind: kind }),
      warnings: []
    };
    const composed = buildComposedPageModel(gated, page, {
      compositionMode: "moments",
      activityIds: ["A3"]
    });
    assert.equal(composed.ok, true);
    const map = buildActivityCompositionMap(composed.composed);
    const learnIds = (map.A3.learnMoment && map.A3.learnMoment.items || [])
      .filter((item) => item && item.kind === "material" && item.material)
      .map((item) => item.material.id);
    assert.ok(
      learnIds.indexOf("A3-M1") >= 0,
      kind + " must keep A3-M1 in Learn without relocation"
    );
    const doReveal = (map.A3.doMoment && map.A3.doMoment.items || []).find(
      (item) => item && item.material && item.material.id === "A3-M1"
    );
    assert.equal(doReveal, undefined);
  });

  // Helper still correctly relocates when invoked directly (Interactive path).
  const interactive = buildComposedPageModel(modelResult, page, {
    compositionMode: "moments",
    activityIds: ["A3"]
  });
  const interactiveMap = buildActivityCompositionMap(interactive.composed);
  const interactiveLearn = (interactiveMap.A3.learnMoment && interactiveMap.A3.learnMoment.items || [])
    .map((item) => item.material && item.material.id)
    .filter(Boolean);
  assert.equal(interactiveLearn.indexOf("A3-M1"), -1);

  const manual = relocateAttemptBeforeScaffolds(
    {
      kind: "learn",
      items: [{ kind: "material", material: { id: "A3-M1", type: "text" } }]
    },
    {
      kind: "do",
      items: [{ kind: "material", material: { id: "A3-M2", type: "template" } }]
    },
    {
      "A3-M1": {
        disclosure: "conceptual_scaffold",
        summary: "Worked illustration — open after your first attempt"
      }
    }
  );
  assert.equal(manual.learnMoment, null);
  assert.equal(manual.doMoment.items.length, 2);
  assert.equal(manual.doMoment.items[1].reveal.defaultOpen, false);
});
