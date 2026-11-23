/**
 * Sprint 103 — Flattened multi-question Practice selections must render as
 * independent radio groups (4 questions × 3 options regression).
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const normalizeSelection = require("../lib/learner-renderer-vnext/normalize-selection.js");
const selectionContract = require("../lib/selection-material-contract.js");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext/render-learner-page.js");
const assessmentRuntime = require("../lib/learner-renderer-vnext/assessment-runtime.js");
const draftAdapters = require("../lib/learner-renderer-vnext/learner-draft-adapters.js");

const QUESTIONS = [
  {
    stem: "Allocation credibility",
    options: [
      { key: "A", text: "Credible randomisation" },
      { key: "B", text: "Allocation concerns remain" },
      { key: "C", text: "Allocation insufficiently reported" }
    ],
    correct: "A"
  },
  {
    stem: "Applicability",
    options: [
      { key: "A", text: "Directly applicable" },
      { key: "B", text: "Partial applicability" },
      { key: "C", text: "Not applicable to the target patient" }
    ],
    correct: "B"
  },
  {
    stem: "Outcomes",
    options: [
      { key: "A", text: "Outcomes are patient-important" },
      { key: "B", text: "Surrogate outcomes dominate" },
      { key: "C", text: "Outcomes incompletely reported" }
    ],
    correct: "A"
  },
  {
    stem: "Overall weighting",
    options: [
      { key: "A", text: "Weight Study 1 more" },
      { key: "B", text: "Weight Study 2 more" },
      { key: "C", text: "Weight both similarly" }
    ],
    correct: "C"
  }
];

function flattenedSelectionPayload() {
  return {
    form: "single_select",
    prompt:
      "Make your appraisal decisions\n\n" +
      QUESTIONS.map(function (q, i) {
        return String(i + 1) + ". " + q.stem;
      }).join("\n\n"),
    options: QUESTIONS.reduce(function (all, q) {
      return all.concat(q.options);
    }, [])
  };
}

function flattenedMarkdownBody() {
  return (
    "Make your appraisal decisions\n\n" +
    "Form: single_select. Choose one response for each question.\n\n" +
    QUESTIONS.map(function (q, i) {
      return (
        String(i + 1) +
        ". " +
        q.stem +
        "\n" +
        q.options
          .map(function (opt) {
            return "- " + opt.key + ". " + opt.text;
          })
          .join("\n")
      );
    }).join("\n\n")
  );
}

function practicePageFromSelectionMaterials(materials) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Compare, critique and reconsider",
    product_id: "practice",
    page_kind: "practice",
    page_synthesis: {
      overview: { body: "Appraise conflicting studies.", format: "markdown" }
    },
    activities: [
      {
        activity_id: "A1",
        title: "Make your appraisal decisions",
        learner_task:
          "Appraise allocation, applicability, outcomes and overall weighting.",
        expected_output: "Four independent appraisal selections.",
        activity_preamble: "Use the evidence dimensions.",
        episode_plan: {
          archetype: "apply",
          beats: [
            { id: "orient", function: "framing" },
            { id: "model", function: "worked_thinking" },
            { id: "do", function: "guided_practice" },
            { id: "check", function: "verification" }
          ]
        },
        required_materials: materials.map(function (m) {
          return {
            material_id: m.material_id,
            material_type: "selection",
            purpose: "Capture appraisal judgement",
            specification: "single_select"
          };
        }),
        materials: materials
      }
    ],
    learning_outcomes: [{ outcome_id: "LO1", statement: "Appraise evidence." }],
    episode_plans: [
      {
        activity_id: "A1",
        mapped_learning_outcome_ids: ["LO1"],
        episode_plan: {
          archetype: "apply",
          beats: [
            { id: "orient", function: "framing" },
            { id: "model", function: "worked_thinking" },
            { id: "do", function: "guided_practice" },
            { id: "check", function: "verification" }
          ]
        }
      }
    ],
    source_artefacts: [{ artefact_type: "learning_outcomes", role: "structural" }],
    assembly_state: {
      current_stage: "gam",
      enriched_by: ["episode_plan", "dla", "gam"]
    }
  };
}

function flattenedAppraisalPage() {
  return practicePageFromSelectionMaterials([
    {
      material_id: "A1-M-appraisal",
      material_type: "selection",
      title: "Make your appraisal decisions",
      body_format: "markdown",
      body: flattenedSelectionPayload().prompt,
      selection: flattenedSelectionPayload()
    }
  ]);
}

function collectRadioGroups(html) {
  const names = [];
  const re = /<input[^>]*\stype="radio"[^>]*\sname="([^"]+)"/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    names.push(match[1]);
  }
  return { names: names, unique: Array.from(new Set(names)), count: names.length };
}

function collectFieldsetLegends(html) {
  const legends = [];
  const re = /<legend class="util-assessment-legend">([\s\S]*?)<\/legend>/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    legends.push(String(match[1] || "").replace(/<[^>]+>/g, "").trim());
  }
  return legends;
}

function createStubNode(tagName) {
  const attrs = Object.create(null);
  const children = [];
  const node = {
    tagName: String(tagName || "DIV").toUpperCase(),
    children: children,
    className: "",
    classList: {
      contains: function (token) {
        return (" " + node.className + " ").indexOf(" " + token + " ") !== -1;
      }
    },
    checked: false,
    value: "",
    textContent: "",
    hidden: false,
    style: {},
    parentNode: null,
    setAttribute: function (name, value) {
      attrs[String(name)] = String(value);
    },
    getAttribute: function (name) {
      return Object.prototype.hasOwnProperty.call(attrs, String(name))
        ? attrs[String(name)]
        : null;
    },
    appendChild: function (child) {
      child.parentNode = node;
      children.push(child);
      return child;
    },
    querySelectorAll: function (selector) {
      const out = [];
      function walk(current) {
        (current.children || []).forEach(function (child) {
          if (stubMatches(child, selector)) out.push(child);
          walk(child);
        });
      }
      walk(node);
      return out;
    },
    querySelector: function (selector) {
      return node.querySelectorAll(selector)[0] || null;
    },
    addEventListener: function () {},
    removeEventListener: function () {},
    click: function () {
      if (typeof node.onclick === "function") node.onclick({ target: node });
      (node._listeners || []).forEach(function (fn) {
        fn({ target: node, preventDefault: function () {}, stopPropagation: function () {} });
      });
    }
  };
  node.addEventListener = function (type, fn) {
    if (type !== "click") return;
    node._listeners = node._listeners || [];
    node._listeners.push(fn);
  };
  return node;
}

function stubMatches(node, selector) {
  const sel = String(selector || "").trim();
  if (sel === 'input[type="radio"]:checked' || sel === "input[type=radio]:checked") {
    return node.tagName === "INPUT" && node.getAttribute("type") === "radio" && !!node.checked;
  }
  if (sel === 'input[type="radio"][data-assessment-option]') {
    return (
      node.tagName === "INPUT" &&
      node.getAttribute("type") === "radio" &&
      node.getAttribute("data-assessment-option") != null
    );
  }
  if (sel === ".util-assessment-item--interactive") {
    return !!(node.classList && node.classList.contains("util-assessment-item--interactive"));
  }
  if (sel === "[data-assessment-result]") {
    return node.getAttribute("data-assessment-result") != null;
  }
  if (sel === "[data-assessment-check]") {
    return node.getAttribute("data-assessment-check") != null;
  }
  if (sel.startsWith("input[data-assessment-option=")) {
    const key = sel.match(/"([^"]+)"/)[1];
    return node.tagName === "INPUT" && node.getAttribute("data-assessment-option") === key;
  }
  if (sel.startsWith("[")) {
    const body = sel.slice(1, -1);
    const eq = body.indexOf("=");
    if (eq < 0) return node.getAttribute(body) != null;
    const attr = body.slice(0, eq);
    const raw = body.slice(eq + 1).replace(/^["']|["']$/g, "");
    return node.getAttribute(attr) === raw;
  }
  return false;
}

function buildInteractiveArticle(itemId, options, correct, feedback) {
  const article = createStubNode("article");
  article.setAttribute(
    "class",
    "util-task-block util-assessment-item util-assessment-item--interactive util-practice-selection"
  );
  article.setAttribute("data-workspace-kind", "assessment_selection");
  article.setAttribute("data-workspace-id", "assessment-" + itemId);
  article.setAttribute("data-assessment-item-id", itemId);
  article.setAttribute("data-assessment-form", "single_answer_mcq");
  article.setAttribute("data-assessment-correct", correct);
  article.setAttribute("data-assessment-rationale", feedback);
  article.setAttribute("data-practice-selection", "true");

  options.forEach(function (opt) {
    const input = createStubNode("input");
    input.setAttribute("type", "radio");
    input.setAttribute("name", "assessment-group-" + itemId);
    input.setAttribute("data-assessment-option", opt.key);
    input.setAttribute("value", opt.key);
    input.value = opt.key;
    article.appendChild(input);
  });

  const checkBtn = createStubNode("button");
  checkBtn.setAttribute("data-assessment-check", "");
  checkBtn.setAttribute("type", "button");
  article.appendChild(checkBtn);

  const result = createStubNode("div");
  result.setAttribute("data-assessment-result", "");
  result.hidden = true;
  article.appendChild(result);

  return article;
}

test("expandFlattenedSingleSelectSelection splits 4×3 repeated-key payload", () => {
  const rows = normalizeSelection.expandFlattenedSingleSelectSelection(
    flattenedSelectionPayload()
  );
  assert.equal(rows.length, 4);
  rows.forEach(function (row, index) {
    assert.equal(row.options.length, 3);
    assert.match(row.prompt, new RegExp(QUESTIONS[index].stem, "i"));
    assert.deepEqual(
      row.options.map(function (o) {
        return o.key;
      }),
      ["A", "B", "C"]
    );
  });
});

test("repairPageSelectionMaterials expands flattened structured selection into four materials", () => {
  const repaired = selectionContract.repairPageSelectionMaterials(flattenedAppraisalPage());
  assert.equal(repaired.ok, true, JSON.stringify(repaired.errors));
  const materials = repaired.page.activities[0].materials.filter(function (m) {
    return m.material_type === "selection";
  });
  assert.equal(materials.length, 4);
  materials.forEach(function (material, index) {
    assert.equal(material.selection.options.length, 3);
    assert.match(String(material.material_id), /-q\d+$/);
    assert.match(String(material.selection.prompt), new RegExp(QUESTIONS[index].stem, "i"));
  });
});

test("markdown hydrate + page repair expands multi-question Form:single_select body", () => {
  const page = practicePageFromSelectionMaterials([
    {
      material_id: "A1-M-appraisal",
      material_type: "selection",
      title: "Make your appraisal decisions",
      body_format: "markdown",
      body: flattenedMarkdownBody()
    }
  ]);
  const hydrated = selectionContract.hydrateSelectionFromMarkdownBody(flattenedMarkdownBody());
  assert.ok(hydrated);
  assert.equal(hydrated.selection.options.length, 12);

  const repaired = selectionContract.repairPageSelectionMaterials(page);
  assert.equal(repaired.ok, true, JSON.stringify(repaired.errors));
  const materials = repaired.page.activities[0].materials.filter(function (m) {
    return m.material_type === "selection";
  });
  assert.equal(materials.length, 4);
});

test("rendered Practice page emits four fieldsets with distinct radio names", () => {
  const packaged = renderLearnerPageHtml(flattenedAppraisalPage(), {
    includeRuntimeScripts: true,
    compositionMode: "moments"
  });
  assert.equal(packaged.error, null, packaged.error);
  assert.ok(packaged.html);
  const groups = collectRadioGroups(packaged.html);
  assert.equal(groups.count, 12, "twelve radios");
  assert.equal(groups.unique.length, 4, "four distinct radio names: " + groups.unique.join(", "));
  const legends = collectFieldsetLegends(packaged.html);
  assert.equal(legends.length, 4);
  QUESTIONS.forEach(function (q) {
    assert.ok(
      legends.some(function (legend) {
        return legend.indexOf(q.stem) !== -1;
      }),
      "legend includes " + q.stem + " in " + JSON.stringify(legends)
    );
  });
  assert.match(packaged.html, /util-assessment-fieldset/);
});

test("independent selection, saved-state isolation and feedback association across four groups", () => {
  const root = createStubNode("main");
  root.setAttribute("data-renderer", "vnext");
  root.className = "util-learner-renderer-vnext";

  const articles = QUESTIONS.map(function (q, index) {
    const article = buildInteractiveArticle(
      "appraisal-q" + String(index + 1),
      q.options,
      q.correct,
      "Feedback for " + q.stem
    );
    root.appendChild(article);
    return article;
  });

  const install = assessmentRuntime.installAssessmentRuntime(root);
  assert.equal(install.ok, true);

  const chosen = ["A", "B", "A", "C"];
  const drafts = [];
  articles.forEach(function (article, index) {
    const input = article.querySelector(
      'input[data-assessment-option="' + chosen[index] + '"]'
    );
    assert.ok(input, "option " + chosen[index] + " in group " + index);
    input.checked = true;
    // Sibling groups keep their own checked state because names differ.
    articles.forEach(function (other, otherIndex) {
      if (otherIndex === index) return;
      const otherChecked = other.querySelector('input[type="radio"]:checked');
      if (otherIndex < index) {
        assert.ok(otherChecked);
        assert.equal(otherChecked.getAttribute("data-assessment-option"), chosen[otherIndex]);
      }
    });
    const serialized = draftAdapters.serializeWorkspaceState(article);
    assert.equal(serialized.ok, true);
    assert.equal(serialized.state.value.selectedOption, chosen[index]);
    drafts.push(serialized.state);
  });

  // Clear all selections, restore each draft — isolation preserved.
  articles.forEach(function (article) {
    article.querySelectorAll('input[type="radio"]').forEach(function (input) {
      input.checked = false;
    });
  });
  articles.forEach(function (article, index) {
    const restored = draftAdapters.restoreWorkspaceState(article, drafts[index]);
    assert.equal(restored.ok, true);
    const checked = article.querySelector('input[type="radio"]:checked');
    assert.ok(checked);
    assert.equal(checked.getAttribute("data-assessment-option"), chosen[index]);
  });

  // Feedback association is per article (correct key + rationale not shared).
  articles.forEach(function (article, index) {
    assert.equal(article.getAttribute("data-assessment-correct"), QUESTIONS[index].correct);
    assert.equal(
      article.getAttribute("data-assessment-rationale"),
      "Feedback for " + QUESTIONS[index].stem
    );
    assert.notEqual(
      article.getAttribute("data-workspace-id"),
      articles[(index + 1) % articles.length].getAttribute("data-workspace-id")
    );
  });

  // Runtime install succeeds for the multi-group tree (same assessment_selection path).
  assert.equal(typeof install.dispose, "function");
  install.dispose();
});

test("already-separated four materials stay four groups (no over-split)", () => {
  const page = practicePageFromSelectionMaterials(
    QUESTIONS.map(function (q, index) {
      return {
        material_id: "A1-M" + String(index + 2),
        material_type: "selection",
        title: q.stem,
        selection: {
          form: "single_select",
          prompt: q.stem,
          options: q.options,
          correct_answer: q.correct,
          feedback: "Feedback for " + q.stem
        }
      };
    })
  );
  const packaged = renderLearnerPageHtml(page, {
    includeRuntimeScripts: true,
    compositionMode: "moments"
  });
  assert.equal(packaged.error, null, packaged.error);
  const groups = collectRadioGroups(packaged.html);
  assert.equal(groups.count, 12);
  assert.equal(groups.unique.length, 4);
});

/**
 * Real Sprint 103 C3 Practice payload (from exported LJ "Judging Evidence…"):
 * unique semantic keys; question number + stem live in option labels, not the prompt.
 * First-pass expand (repeated A/B/C + numbered prompt) no-ops on this shape.
 */
function clinicalC3AppraisalSelection() {
  return {
    form: "single_select",
    prompt:
      "Complete the four appraisal decisions in order. Each decision is independent, but your overall weighting should be consistent with your earlier selections.",
    options: [
      {
        key: "design_a",
        text:
          "1. Allocation credibility — Extract A provides stronger protection because it includes more participants."
      },
      {
        key: "design_b",
        text:
          "1. Allocation credibility — Extract B provides stronger protection because monitoring strategies were randomly allocated."
      },
      {
        key: "design_equal",
        text:
          "1. Allocation credibility — Both designs provide equivalent protection because both compare two monitoring strategies."
      },
      {
        key: "app_a",
        text:
          "2. Applicability — Extract A more closely matches the minor-procedure context, although its methodological limitations remain."
      },
      {
        key: "app_b",
        text:
          "2. Applicability — Extract B necessarily matches Patient A more closely because it is randomised."
      },
      {
        key: "app_equal",
        text:
          "2. Applicability — The studies are equally applicable because Patient A falls within both age ranges."
      },
      {
        key: "outcome_harm",
        text:
          "3. Outcomes — The recorded event counts directly establish which strategy prevents serious patient harm."
      },
      {
        key: "outcome_bounded",
        text:
          "3. Outcomes — The counts describe documented desaturation events, but their detection and clinical significance require qualification."
      },
      {
        key: "outcome_irrelevant",
        text:
          "3. Outcomes — The counts should be ignored entirely because they are not serious patient-centred outcomes."
      },
      {
        key: "weight_decisive_a",
        text:
          "4. Overall weighting — Extract A decisively establishes that early step-down is equivalent to overnight monitoring."
      },
      {
        key: "weight_decisive_b",
        text:
          "4. Overall weighting — Extract B establishes that every older postoperative patient requires overnight monitoring."
      },
      {
        key: "weight_qualified",
        text:
          "4. Overall weighting — The studies offer different strengths and limitations; their combined evidence supports qualified appraisal, not a definitive monitoring policy."
      }
    ]
  };
}

test("clinical C3 appraisal: unique-key label-stem flatten expands to four groups", () => {
  const payload = clinicalC3AppraisalSelection();
  assert.equal(
    normalizeSelection.expandFlattenedSingleSelectSelection(payload).length,
    4
  );

  const page = practicePageFromSelectionMaterials([
    {
      material_id: "A1-M3",
      material_type: "selection",
      title: "Make your appraisal decisions",
      selection: payload
    }
  ]);
  page.activities[0].title = "Appraise the conflicting studies";
  page.title = "Compare, critique and reconsider";

  const packaged = renderLearnerPageHtml(page, {
    includeRuntimeScripts: true,
    compositionMode: "moments"
  });
  assert.equal(packaged.error, null, packaged.error);
  const groups = collectRadioGroups(packaged.html);
  assert.equal(groups.count, 12);
  assert.equal(groups.unique.length, 4, groups.unique.join(", "));

  const legends = collectFieldsetLegends(packaged.html);
  assert.deepEqual(legends, [
    "Allocation credibility",
    "Applicability",
    "Outcomes",
    "Overall weighting"
  ]);

  // Option labels are cleaned (question stem stripped into the fieldset legend).
  assert.doesNotMatch(packaged.html, /1\. Allocation credibility —/);
  assert.match(packaged.html, /Extract A provides stronger protection/);
  assert.match(packaged.html, /util-practice-selection/);
  assert.match(packaged.html, /util-practice-decision-grid/);
});
