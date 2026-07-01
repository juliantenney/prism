/**
 * LD-GUIDED-LEARNING-SCAFFOLD — learner-facing framing/scaffold prose quality (Sprint 55).
 * DLA generation + Design Page compose preservation. No new fields or page structures.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_LD_GUIDED_LEARNING_SCAFFOLD = api;
  }
})(
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this,
  function () {
    "use strict";

    var MODULE_ID = "LD-GUIDED-LEARNING-SCAFFOLD";
    var MARKER = "LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT (auto-applied)";

    var FIELD_WORD_RANGES = {
      activity_preamble: { min: 50, max: 120 },
      reasoning_orientation: { min: 35, max: 80 },
      conceptual_contrast_prompt: { min: 35, max: 80 },
      argument_structure_hint: { min: 35, max: 80 },
      self_explanation_prompt: { min: 35, max: 80 },
      support_note: { min: 20, max: 70 },
      expected_output: { min: 30, max: 70 },
      intellectual_coherence_bridge: { min: 30, max: 60 },
      transfer_or_application_task: { min: 35, max: 80 }
    };

    var COGNITION_FIELD_IDS = [
      "reasoning_orientation",
      "self_explanation_prompt",
      "conceptual_contrast_prompt",
      "argument_structure_hint",
      "transfer_or_application_task"
    ];

    var SCAFFOLD_FIELD_IDS = [
      "reasoning_orientation",
      "conceptual_contrast_prompt",
      "argument_structure_hint",
      "self_explanation_prompt",
      "support_note",
      "expected_output",
      "intellectual_coherence_bridge",
      "transfer_or_application_task"
    ];

    var ARCHETYPE_COGNITION_MAP = {
      understand: "reasoning_orientation",
      orient: "reasoning_orientation",
      contrast: "conceptual_contrast_prompt",
      discriminate: "conceptual_contrast_prompt",
      analyse: "self_explanation_prompt",
      analyze: "self_explanation_prompt",
      apply: "self_explanation_prompt",
      evaluate: "argument_structure_hint",
      judge: "argument_structure_hint",
      transfer: "transfer_or_application_task"
    };

    var BRIDGE_SCHEDULING_RE =
      /^(then do|next complete|move to activity|then move|after this activity)\b/i;

    var TERSE_LABEL_PATTERNS = [
      /^[^.!?]{0,90}→[^.!?]{0,90}$/,
      /^(trace|contrast|compare|analyse|analyze|apply|complete|develop|establish)\b[^.!?]{0,60}$/i,
      /^(criteria|comparison|judgement|judgment|justification)(\s*→\s*\w+){2,}/i,
      /^completed\s+\w+/i,
      /^apply this reasoning\b/i
    ];

    var PROCEDURAL_PREAMBLE_RE =
      /^(Begin by|Develop understanding|Analyse how|Analyze how|Establish understanding|In this activity you will)\b/i;

    var CORE_LINES = [
      "",
      MARKER + ":",
      "- Module: " +
        MODULE_ID +
        " | Author scaffold fields as educational prose to the learner — not metadata labels or taxonomy tags.",
      "- Scope: activity-row fields and intellectual_coherence_bridge only. Do not add fields.",
      "- learner_task may stay concise; scaffold fields must meet word floors — do not generalise brevity from learner_task.",
      "- Design Page compose: copy these fields verbatim — never shorten, label-ify, or paraphrase into metadata."
    ];

    var COMPACT_DLA_FIELD_LINES = [
      "- AUTHORITATIVE WORD RANGES (no other prompt block may restate):",
      "  activity_preamble 50–120; reasoning_orientation, self_explanation_prompt, conceptual_contrast_prompt, argument_structure_hint, transfer_or_application_task 35–80; expected_output 30–70; intellectual_coherence_bridge 30–60; support_note 20–70 when used.",
      "- SCAFFOLD GENRE: scaffold strings = learner-facing page copy (not metadata). Cognition = three substantive sentences — peer learns the reasoning move; not stems or cues. expected_output = quality threshold. intellectual_coherence_bridge (A2+, mandatory) = carried-reasoning synthesis — not connective metadata.",
      "- FORBIDDEN on scaffold fields: procedural openers (Begin by…, In this activity you will…); arrow-only chains; one-line stems (Explain your answer); deliverable labels without quality criteria; scheduling-only bridges."
    ];

    var FIELD_LINES = [
      "- activity_preamble (50–120 words, 2–4 sentences, second person where natural):",
      "  • Why the activity matters; conceptual problem addressed; link to prior/next learning; kind of thinking to practise.",
      "  • FORBIDDEN openers: Begin by…, Develop understanding of…, Analyse how…, In this activity you will…, procedural task verbs as the first sentence.",
      "  • Read like a workbook introduction — not a topic label or module objective.",
      "- reasoning_orientation (35–80 words):",
      "  • What to look for; how to reason step-by-step; one mistake to avoid.",
      "  • FORBIDDEN: arrow chains (mechanism → function), single-line labels, restating learner_task.",
      "- conceptual_contrast_prompt (35–80 words):",
      "  • Explicit comparison criteria; what distinction matters and why novices confuse it.",
      "  • FORBIDDEN: Contrast X vs Y one-liners without reasoning guidance.",
      "- argument_structure_hint (35–80 words):",
      "  • Unpack writing structure: criteria → comparison → judgement → justification as learner-facing sentences.",
      "  • FORBIDDEN: bare arrow scaffolds without explanatory prose.",
      "- self_explanation_prompt (35–80 words):",
      "  • Generative prompt requiring explanation in the learner's own words before checking — not Explain your answer.",
      "- expected_output (30–70 words):",
      "  • Quality target: format, scope, depth, and threshold for a strong response — not merely naming the deliverable.",
      "  • FORBIDDEN: Completed analysis table… labels without quality criteria.",
      "- support_note (20–70 words):",
      "  • One misconception guard or evidence cue — concrete, discipline-specific.",
      "- intellectual_coherence_bridge (30–60 words per activity after the first):",
      "  • What reasoning carries forward; what conceptual move escalates; why the next activity follows — not Activity 2 asks you to…"
    ];

    var EXEMPLAR_LINES = [
      "- EXEMPLAR CONTRAST (topic-specific — do not copy verbatim):",
      "  • reasoning_orientation — Weak: \"Trace mechanism → function relationships.\"",
      "  • reasoning_orientation — Strong: \"As you analyse each stage, ask what the virus is doing and what problem that solves. Avoid listing events — connect each mechanism to a functional consequence such as entry, replication, or spread.\"",
      "  • conceptual_contrast_prompt — Weak: \"Contrast positive vs negative-sense RNA.\"",
      "  • conceptual_contrast_prompt — Strong: \"When comparing genome types, focus on whether the genome translates immediately or needs a transcription step first. Polarity changes the route from genome entry to protein production — not just the label positive or negative.\"",
      "  • argument_structure_hint — Weak: \"criteria → comparison → judgement → justification\"",
      "  • argument_structure_hint — Strong: \"Name two or three defensible criteria and say why each matters. Compare each option against them with cited evidence, then explain why your judgement follows — including trade-offs weighed, not only which option you prefer.\"",
      "  • self_explanation_prompt — Weak: \"Explain your answer.\"",
      "  • self_explanation_prompt — Strong: \"Before checking the model row, explain which contrast you find more defensible and cite one passage as evidence. State why that passage supports your judgement and connect it to the mechanism or distinction being tested — expand until a peer could follow your reasoning.\""
    ];

    var MANDATORY_LINES = [
      "- MANDATORY PER ACTIVITY (learner-page DLA):",
      "  • activity_preamble (≥50 words), expected_output (≥30 words), and at least one field from: reasoning_orientation, self_explanation_prompt, conceptual_contrast_prompt, argument_structure_hint, transfer_or_application_task.",
      "  • intellectual_coherence_bridge (≥30w, mandatory A2+): synthesis of carried reasoning and why this activity follows — not connective metadata.",
      "  • Do not emit procedural-only rows (title, learner_task, expected_output, required_materials)."
    ];

    var COMPOSE_LINES = [
      "- COMPOSE PRESERVATION (Design Page):",
      "  • Never compress scaffold fields to labels during assembly.",
      "  • activity.materials.* bodies including worked_example **Bridge:** and sample_output ## Why this works — copy verbatim from GAM; do not produce GAM-lite synopsis."
    ];

    var TRANSITION_LINES = [
      "- SEQUENCE / WRAPPER TRANSITIONS (learning_sequence transition_to_next assimilated in overview/study_tips; intellectual_coherence_bridge on activity rows):",
      "  • 30–60 words of conceptual continuity: what was established, why the next stage follows, what reasoning move the learner makes.",
      "  • FORBIDDEN: scheduling-only transitions (Next complete…, Then do…, Move to Activity 2…)."
    ];

    function normalizeFieldText(value) {
      if (value == null) return "";
      if (Array.isArray(value)) return value.map(String).join("\n").trim();
      return String(value).trim();
    }

    function wordCount(text) {
      var raw = normalizeFieldText(text);
      if (!raw) return 0;
      return raw.split(/\s+/).filter(Boolean).length;
    }

    function fieldHasValue(value) {
      return normalizeFieldText(value).length > 0;
    }

    function scaffoldLooksLikeTerseLabel(text) {
      var raw = normalizeFieldText(text);
      if (!raw) return false;
      if (wordCount(raw) >= 35) return false;
      var i;
      for (i = 0; i < TERSE_LABEL_PATTERNS.length; i += 1) {
        if (TERSE_LABEL_PATTERNS[i].test(raw)) return true;
      }
      if (wordCount(raw) <= 12 && !/[.!?].*[.!?]/.test(raw)) return true;
      if (/→/.test(raw) && wordCount(raw) < 20) return true;
      return false;
    }

    function preambleFailsQuality(text) {
      var raw = normalizeFieldText(text);
      if (!raw) return true;
      var words = wordCount(raw);
      if (words < FIELD_WORD_RANGES.activity_preamble.min) return true;
      if (PROCEDURAL_PREAMBLE_RE.test(raw)) return true;
      return scaffoldLooksLikeTerseLabel(raw) && words < 40;
    }

    function fieldFailsScaffoldQuality(fieldId, text) {
      if (!fieldHasValue(text)) return false;
      var range = FIELD_WORD_RANGES[fieldId];
      if (!range) return scaffoldLooksLikeTerseLabel(text);
      var words = wordCount(text);
      if (words < range.min) return true;
      if (scaffoldLooksLikeTerseLabel(text)) return true;
      return false;
    }

    var DLA_PRE_EMIT_LINES = [
      "- DLA PRE-EMIT SCAFFOLD GATE (mandatory before returning learning_activities JSON):",
      "  1. Presence + word minimum: every populated scaffold field meets the AUTHORITATIVE WORD RANGES above.",
      "  2. Mandatory coverage: every activity has activity_preamble, expected_output, and at least one cognition scaffold field; intellectual_coherence_bridge on activities after the first when the sequence has 2+ activities.",
      "  3. Anti-terse: no labels, stems, arrow chains (→), or procedural openers on scaffold fields.",
      "  4. Self-check: count words in every scaffold field; rewrite any field below its minimum before emit.",
      "  5. No procedural-only rows."
    ];

    function buildLdGuidedLearningScaffoldPromptBlock(options) {
      var opts = options && typeof options === "object" ? options : {};
      var includeMarker = opts.includeMarker !== false;
      var includeCompose = opts.includeCompose === true;
      var includeDlaPreEmit = opts.includeDlaPreEmit === true;
      var composeOnly = opts.composeOnly === true;
      if (composeOnly && includeCompose && !includeDlaPreEmit) {
        var composeOnlyLines = [
          "",
          MARKER + ":",
          "- Module: " +
            MODULE_ID +
            " | Design Page compose preservation — copy upstream scaffold fields verbatim; do not generate, rewrite, or compress to metadata labels.",
          "- Scope: activity-row scaffold fields only. Obey LD-DESIGN-PAGE-COMPOSE field preservation and LD-AUTHORIAL-EXPOSITION PRESERVATION BOUNDARY."
        ];
        if (!includeMarker) {
          composeOnlyLines = composeOnlyLines.slice(2);
        }
        return composeOnlyLines.concat(COMPOSE_LINES).join("\n");
      }
      var includeTransitionLines = opts.includeTransitionLines !== false && !includeDlaPreEmit;
      var coreLines = includeMarker ? CORE_LINES.slice() : CORE_LINES.slice(2);
      if (includeDlaPreEmit && !includeCompose) {
        coreLines = coreLines.filter(function (line) {
          return line.indexOf("Design Page compose:") !== 0;
        });
      }
      var fieldLines = includeDlaPreEmit ? COMPACT_DLA_FIELD_LINES : FIELD_LINES;
      var lines = coreLines.concat(fieldLines).concat(EXEMPLAR_LINES);
      if (includeTransitionLines) {
        lines = lines.concat(TRANSITION_LINES);
      }
      if (includeDlaPreEmit) {
        lines = lines.concat(MANDATORY_LINES).concat(DLA_PRE_EMIT_LINES);
      }
      if (includeCompose) {
        lines = lines.concat(COMPOSE_LINES);
      }
      return lines.join("\n");
    }

    function activityTopicContext(row) {
      var title = normalizeFieldText(row && row.title);
      var task = normalizeFieldText(row && row.learner_task);
      var preamble = normalizeFieldText(row && row.activity_preamble);
      var blob = (title + " " + task + " " + preamble).toLowerCase();
      return { title: title, task: task, preamble: preamble, blob: blob };
    }

    function buildRepairContext(activities, options) {
      var opts = options && typeof options === "object" ? options : {};
      var ctx = {
        workflowGoal: normalizeFieldText(opts.workflowGoal),
        learningOutcomes: {},
        episodePlans: {}
      };
      var los = opts.learningOutcomes;
      if (los && typeof los === "object" && Array.isArray(los.learning_outcomes)) {
        los.learning_outcomes.forEach(function (lo) {
          var id = String((lo && lo.id) || (lo && lo.outcome_id) || "").trim();
          if (id) ctx.learningOutcomes[id] = normalizeFieldText(lo.statement);
        });
      }
      var eps = opts.episodePlans;
      var plans =
        eps && eps.episode_plans
          ? eps.episode_plans
          : Array.isArray(eps)
            ? eps
            : [];
      plans.forEach(function (p) {
        var aid = String((p && p.activity_id) || "").trim();
        if (aid && p.episode_plan) ctx.episodePlans[aid] = p.episode_plan;
      });
      if (Array.isArray(activities)) {
        activities.forEach(function (row) {
          if (!row || typeof row !== "object") return;
          var aid = String(row.activity_id || row.activityId || row.id || "").trim();
          if (aid && row.episode_plan && !ctx.episodePlans[aid]) {
            ctx.episodePlans[aid] = row.episode_plan;
          }
        });
      }
      return ctx;
    }

    function resolveLoStatement(row, ctx) {
      var ids = (row && row.mapped_learning_outcomes) || (row && row.mapped_learning_outcome_ids);
      if (!ids) return "";
      if (!Array.isArray(ids)) ids = [ids];
      var i;
      for (i = 0; i < ids.length; i += 1) {
        var id = String(ids[i] || "").trim();
        if (ctx.learningOutcomes[id]) return ctx.learningOutcomes[id];
      }
      return "";
    }

    function resolveArchetype(row, ctx) {
      if (row && row.episode_plan && row.episode_plan.archetype) {
        return String(row.episode_plan.archetype).toLowerCase();
      }
      var aid = String((row && row.activity_id) || (row && row.id) || "").trim();
      if (aid && ctx.episodePlans[aid] && ctx.episodePlans[aid].archetype) {
        return String(ctx.episodePlans[aid].archetype).toLowerCase();
      }
      return "";
    }

    function extractMaterialCue(row) {
      var mats = row && row.required_materials;
      if (!Array.isArray(mats) || !mats.length) return "";
      var m = mats[0];
      return normalizeFieldText(
        (m && m.purpose) || (m && m.specification) || (m && m.type) || ""
      );
    }

    function extractTopicPhrase(row, ctx) {
      var topicCtx = activityTopicContext(row);
      if (topicCtx.title) return topicCtx.title;
      var lo = resolveLoStatement(row, ctx);
      if (lo) return lo.split(/[.!?]/)[0].slice(0, 80);
      if (ctx.workflowGoal) return ctx.workflowGoal.split(/[.!?]/)[0].slice(0, 80);
      return "this topic";
    }

    function extractReasoningMove(row, ctx) {
      var preamble = normalizeFieldText(row && row.activity_preamble);
      var task = normalizeFieldText(row && row.learner_task);
      if (preamble && wordCount(preamble) >= 15) return preamble.split(/[.!?]/)[0];
      if (task) return task.split(/\n/)[0].slice(0, 100);
      var lo = resolveLoStatement(row, ctx);
      if (lo) return lo.split(/[.!?]/)[0];
      return extractTopicPhrase(row, ctx);
    }

    function bridgeLooksSchedulingOnly(text) {
      var raw = normalizeFieldText(text);
      if (!raw) return false;
      if (BRIDGE_SCHEDULING_RE.test(raw)) return true;
      if (/^activity \d+ asks you to/i.test(raw)) return true;
      return false;
    }

    function cognitionFieldMeetsFloor(row, fieldId) {
      if (!fieldHasValue(row[fieldId])) return false;
      var range = FIELD_WORD_RANGES[fieldId];
      if (!range) return false;
      if (wordCount(row[fieldId]) < range.min) return false;
      if (scaffoldLooksLikeTerseLabel(row[fieldId])) return false;
      return true;
    }

    function selectCognitionField(row, ctx) {
      var i;
      for (i = 0; i < COGNITION_FIELD_IDS.length; i += 1) {
        if (fieldHasValue(row[COGNITION_FIELD_IDS[i]])) return COGNITION_FIELD_IDS[i];
      }
      var archetype = resolveArchetype(row, ctx);
      if (archetype && ARCHETYPE_COGNITION_MAP[archetype]) {
        return ARCHETYPE_COGNITION_MAP[archetype];
      }
      return "reasoning_orientation";
    }

    function expandInPlace(text, minWords, maxWords, padClauses) {
      var result = normalizeFieldText(text);
      var clauses = Array.isArray(padClauses) ? padClauses : [padClauses];
      var ci = 0;
      var guard = 0;
      while (wordCount(result) < minWords && guard < 6) {
        guard += 1;
        var clause = clauses[ci % clauses.length] || clauses[0];
        if (!clause) break;
        result = result ? result + " " + clause : clause;
        ci += 1;
      }
      return trimToWordMax(result, maxWords);
    }

    function collectRowScaffoldIssues(row, index, total, ctx) {
      var repairCtx = ctx || buildRepairContext([], {});
      var rowIssues = [];
      if (preambleFailsQuality(row.activity_preamble)) {
        rowIssues.push("activity_preamble");
      }
      if (
        !fieldHasValue(row.expected_output) ||
        fieldFailsScaffoldQuality("expected_output", row.expected_output)
      ) {
        rowIssues.push("expected_output");
      }
      var hasValidCognition = false;
      var subFloorCognition = [];
      COGNITION_FIELD_IDS.forEach(function (fieldId) {
        if (!fieldHasValue(row[fieldId])) return;
        if (cognitionFieldMeetsFloor(row, fieldId)) {
          hasValidCognition = true;
          return;
        }
        subFloorCognition.push(fieldId);
      });
      if (!hasValidCognition) {
        if (subFloorCognition.length) {
          subFloorCognition.forEach(function (fieldId) {
            if (rowIssues.indexOf(fieldId) === -1) rowIssues.push(fieldId);
          });
        } else {
          rowIssues.push(selectCognitionField(row, repairCtx));
        }
      }
      if (total > 1 && index > 0) {
        var bridge = row.intellectual_coherence_bridge;
        if (
          !fieldHasValue(bridge) ||
          wordCount(bridge) < FIELD_WORD_RANGES.intellectual_coherence_bridge.min ||
          bridgeLooksSchedulingOnly(bridge) ||
          fieldFailsScaffoldQuality("intellectual_coherence_bridge", bridge)
        ) {
          rowIssues.push("intellectual_coherence_bridge");
        }
      }
      SCAFFOLD_FIELD_IDS.forEach(function (fieldId) {
        if (rowIssues.indexOf(fieldId) !== -1) return;
        if (fieldId === "expected_output" || fieldId === "intellectual_coherence_bridge") return;
        if (COGNITION_FIELD_IDS.indexOf(fieldId) !== -1) return;
        if (!fieldHasValue(row[fieldId])) return;
        if (fieldFailsScaffoldQuality(fieldId, row[fieldId])) {
          rowIssues.push(fieldId);
        }
      });
      return rowIssues;
    }

    function trimToWordMax(text, maxWords) {
      var raw = normalizeFieldText(text);
      if (!raw || wordCount(raw) <= maxWords) return raw;
      var words = raw.split(/\s+/).filter(Boolean);
      var trimmed = words.slice(0, maxWords).join(" ");
      if (!/[.!?]$/.test(trimmed)) trimmed += ".";
      return trimmed;
    }

    function padToWordMin(text, minWords, padSentence) {
      var result = normalizeFieldText(text);
      var guard = 0;
      while (wordCount(result) < minWords && guard < 4) {
        guard += 1;
        result = result ? result + " " + padSentence : padSentence;
      }
      return result;
    }

    function expandActivityPreamble(row, ctx) {
      var repairCtx = ctx || buildRepairContext([], {});
      var existing = normalizeFieldText(row.activity_preamble);
      var range = FIELD_WORD_RANGES.activity_preamble;
      var topic = extractTopicPhrase(row, repairCtx);
      var lo = resolveLoStatement(row, repairCtx);
      var material = extractMaterialCue(row);
      var base = existing;
      if (!base && lo) base = lo;
      if (!base) base = "This activity develops your understanding of " + topic + ".";
      if (PROCEDURAL_PREAMBLE_RE.test(base)) {
        base =
          "This activity focuses on " +
          topic +
          ". " +
          base.replace(PROCEDURAL_PREAMBLE_RE, "").trim();
      }
      var clauses = [
        "As you work, explain why each step matters for understanding the ideas, not only what the correct answer is."
      ];
      if (material) {
        clauses.push(
          "Use the " +
            material.toLowerCase() +
            " to connect concepts to the reasoning move you are practising."
        );
      }
      if (lo) {
        clauses.push("Focus on the learning outcome: " + lo.split(/[.!?]/)[0] + ".");
      }
      return expandInPlace(base, range.min, range.max, clauses);
    }

    function expandReasoningOrientation(row, ctx) {
      var repairCtx = ctx || buildRepairContext([], {});
      var existing = normalizeFieldText(row.reasoning_orientation);
      var range = FIELD_WORD_RANGES.reasoning_orientation;
      var topic = extractTopicPhrase(row, repairCtx);
      var material = extractMaterialCue(row);
      var base =
        existing ||
        "As you work through " + topic + ", name what evidence you are using and how it supports your claim.";
      var clauses = [
        "Explain why each step matters for the overall reasoning, not only what happens next.",
        "State one mistake to avoid when you describe mechanism without functional consequence.",
        material
          ? "Ground your reasoning in the " + material.toLowerCase() + " rather than listing labels alone."
          : ""
      ].filter(Boolean);
      if (scaffoldLooksLikeTerseLabel(base) && /→/.test(base)) {
        base =
          "As you analyse " +
          topic +
          ", connect each mechanism to the problem it solves and the consequence that follows.";
      }
      return expandInPlace(base, range.min, range.max, clauses);
    }

    function expandConceptualContrastPrompt(row, ctx) {
      var repairCtx = ctx || buildRepairContext([], {});
      var existing = normalizeFieldText(row.conceptual_contrast_prompt);
      var range = FIELD_WORD_RANGES.conceptual_contrast_prompt;
      var topic = extractTopicPhrase(row, repairCtx);
      var base =
        existing ||
        "When comparing ideas in " + topic + ", state the comparison criteria you are using before you judge.";
      return expandInPlace(base, range.min, range.max, [
        "Explain why novices often merge the concepts and what evidence would show the distinction is real.",
        "Describe what changes in reasoning when you apply the correct distinction to the task materials."
      ]);
    }

    function expandArgumentStructureHint(row, ctx) {
      var repairCtx = ctx || buildRepairContext([], {});
      var existing = normalizeFieldText(row.argument_structure_hint);
      var range = FIELD_WORD_RANGES.argument_structure_hint;
      var topic = extractTopicPhrase(row, repairCtx);
      var base = existing;
      if (!base || scaffoldLooksLikeTerseLabel(base)) {
        base =
          "Build your evaluation of " +
          topic +
          " around consistent criteria, then compare options with cited evidence before you reach a judgement.";
      }
      return expandInPlace(base, range.min, range.max, [
        "Unpack each move in full sentences: state your claim, cite supporting evidence, then explain what follows.",
        "A strong answer compares alternatives and weighs trade-offs, not only which option you prefer."
      ]);
    }

    function expandSelfExplanationPrompt(row, ctx) {
      var repairCtx = ctx || buildRepairContext([], {});
      var existing = normalizeFieldText(row.self_explanation_prompt);
      var range = FIELD_WORD_RANGES.self_explanation_prompt;
      var topic = extractTopicPhrase(row, repairCtx);
      var material = extractMaterialCue(row);
      var base = existing || "Before checking any model answer, explain your reasoning about " + topic + ".";
      return expandInPlace(base, range.min, range.max, [
        "Write in your own words and cite at least one specific point from the activity materials.",
        material
          ? "Connect your explanation to the " + material.toLowerCase() + " so a peer could follow your logic."
          : "Expand until a peer could follow your reasoning without seeing your working notes."
      ]);
    }

    function expandExpectedOutput(row, ctx) {
      var repairCtx = ctx || buildRepairContext([], {});
      var existing = normalizeFieldText(row.expected_output);
      var range = FIELD_WORD_RANGES.expected_output;
      var topic = extractTopicPhrase(row, repairCtx);
      var task = normalizeFieldText(row.learner_task);
      var taskLine = task ? task.split(/\n/)[0] : "";

      if (!existing) {
        return trimToWordMax(
          "Your response for " +
            topic +
            " should meet the task scope with clear reasoning, accurate terminology, and enough detail that a peer could follow your logic.",
          range.max
        );
      }

      if (scaffoldLooksLikeTerseLabel(existing) || /^completed\b/i.test(existing)) {
        var deliverable = existing.replace(/^completed\s+/i, "").replace(/\.\.\.$/, "");
        return expandInPlace(
          "Your " +
            deliverable +
            " should demonstrate accurate understanding of " +
            topic +
            " with clear reasoning",
          range.min,
          range.max,
          [
            "Include enough depth, format detail, and quality criteria that a peer could assess whether your work meets the task expectations.",
            "Strong work explains why each claim matters, not only whether the deliverable is complete."
          ]
        );
      }

      if (wordCount(existing) < range.min) {
        return expandInPlace(existing, range.min, range.max, [
          "Include enough depth and quality criteria that a peer could assess whether your work meets the task expectations.",
          taskLine
            ? "Align your response with the task action: " + taskLine
            : "Explain why each claim matters, not only whether the deliverable is complete."
        ]);
      }

      return trimToWordMax(existing, range.max);
    }

    function expandIntellectualCoherenceBridge(row, priorRow, ctx) {
      var repairCtx = ctx || buildRepairContext([], {});
      var existing = normalizeFieldText(row.intellectual_coherence_bridge);
      var range = FIELD_WORD_RANGES.intellectual_coherence_bridge;

      if (
        existing &&
        !bridgeLooksSchedulingOnly(existing) &&
        wordCount(existing) >= range.min &&
        !fieldFailsScaffoldQuality("intellectual_coherence_bridge", existing)
      ) {
        return trimToWordMax(existing, range.max);
      }

      if (existing && !bridgeLooksSchedulingOnly(existing) && wordCount(existing) < range.min) {
        return expandInPlace(existing, range.min, range.max, [
          "Carry forward the same explanatory standard when you apply that reasoning to " +
            extractTopicPhrase(row, repairCtx) +
            "."
        ]);
      }

      var priorMove = priorRow ? extractReasoningMove(priorRow, repairCtx) : "";
      var currentTopic = extractTopicPhrase(row, repairCtx);
      var materialCue = extractMaterialCue(row);
      var synthesized = priorMove
        ? "You established " +
          priorMove +
          ". This activity extends that reasoning by focusing on " +
          currentTopic +
          (materialCue ? " through " + materialCue.toLowerCase() : "") +
          ". Carry forward the same explanatory standard when you work with the new materials."
        : "Building on the prior activity, apply the same reasoning approach to " +
          currentTopic +
          (materialCue ? " using " + materialCue.toLowerCase() : "") +
          ". Explain why this step follows from what you already understand, not only what task comes next.";
      return trimToWordMax(synthesized, range.max);
    }

    function expandTransferOrApplicationTask(row, ctx) {
      var repairCtx = ctx || buildRepairContext([], {});
      var existing = normalizeFieldText(row.transfer_or_application_task);
      var range = FIELD_WORD_RANGES.transfer_or_application_task;
      var topic = extractTopicPhrase(row, repairCtx);
      var base =
        existing ||
        "Apply the reasoning move from this activity to a new context related to " + topic + ".";
      return expandInPlace(base, range.min, range.max, [
        "Name what changes, what stays the same, and one assumption that might break if the context differs.",
        "Your answer should show transfer of the method, not repetition of the original example."
      ]);
    }

    function expandSupportNote(row, ctx) {
      var existing = normalizeFieldText(row.support_note);
      var material = extractMaterialCue(row);
      return trimToWordMax(
        padToWordMin(
          existing,
          FIELD_WORD_RANGES.support_note.min,
          material
            ? "If your answer lists features without linking them to function, revise using the " +
                material.toLowerCase() +
                " to state what problem each feature solves."
            : "If your answer lists features without linking them to function, revise by stating what problem each feature solves."
        ),
        FIELD_WORD_RANGES.support_note.max
      );
    }

    function synthesizeCognitionField(fieldId, row, ctx) {
      var expanders = {
        reasoning_orientation: expandReasoningOrientation,
        conceptual_contrast_prompt: expandConceptualContrastPrompt,
        argument_structure_hint: expandArgumentStructureHint,
        self_explanation_prompt: expandSelfExplanationPrompt,
        transfer_or_application_task: expandTransferOrApplicationTask
      };
      var fn = expanders[fieldId] || expandReasoningOrientation;
      return fn(row, ctx);
    }

    var FIELD_EXPANDERS = {
      activity_preamble: expandActivityPreamble,
      reasoning_orientation: expandReasoningOrientation,
      conceptual_contrast_prompt: expandConceptualContrastPrompt,
      argument_structure_hint: expandArgumentStructureHint,
      self_explanation_prompt: expandSelfExplanationPrompt,
      expected_output: expandExpectedOutput,
      support_note: expandSupportNote,
      transfer_or_application_task: expandTransferOrApplicationTask,
      intellectual_coherence_bridge: function (row, ctx, priorRow) {
        return expandIntellectualCoherenceBridge(row, priorRow, ctx);
      }
    };

    function repairActivityScaffoldFields(row, index, total, ctx, priorRow) {
      if (!row || typeof row !== "object") return [];
      var repaired = [];
      var issues = collectRowScaffoldIssues(row, index, total, ctx);
      if (!issues.length) return repaired;
      issues.forEach(function (fieldId) {
        var expander = FIELD_EXPANDERS[fieldId];
        if (!expander) return;
        var hadValue = fieldHasValue(row[fieldId]);
        var next = expander(row, ctx, priorRow);
        if (!next) return;
        if (!hadValue && COGNITION_FIELD_IDS.indexOf(fieldId) !== -1) {
          row[fieldId] = next;
          repaired.push(fieldId);
          return;
        }
        if (normalizeFieldText(next) !== normalizeFieldText(row[fieldId])) {
          row[fieldId] = next;
          repaired.push(fieldId);
        }
      });
      return repaired;
    }

    function repairGuidedLearningScaffoldOnActivities(activities, options) {
      var rows = Array.isArray(activities) ? activities : [];
      var ctx = buildRepairContext(rows, options);
      var allRepaired = [];
      rows.forEach(function (row, index) {
        if (!row || typeof row !== "object") return;
        var priorRow = index > 0 ? rows[index - 1] : null;
        var repaired = repairActivityScaffoldFields(row, index, rows.length, ctx, priorRow);
        if (repaired.length) {
          allRepaired.push({
            activity_id: String(row.activity_id || row.activityId || row.id || "").trim() || "?",
            fields: repaired
          });
        }
      });
      var evidence = evaluateGuidedLearningScaffoldEvidence(rows, { repairContext: ctx });
      return {
        activities: rows,
        evidence: evidence,
        repaired: allRepaired,
        repairApplied: allRepaired.length > 0
      };
    }

    function resolveDlaActivitiesContainer(parsed) {
      if (!parsed || typeof parsed !== "object") return null;
      if (Array.isArray(parsed.activities)) {
        return { parsed: parsed, activities: parsed.activities };
      }
      if (
        parsed.learning_activities &&
        typeof parsed.learning_activities === "object" &&
        Array.isArray(parsed.learning_activities.activities)
      ) {
        return { parsed: parsed, activities: parsed.learning_activities.activities };
      }
      if (
        parsed.learning_activities &&
        typeof parsed.learning_activities === "object" &&
        Array.isArray(parsed.learning_activities.content)
      ) {
        return { parsed: parsed, activities: parsed.learning_activities.content };
      }
      return null;
    }

    function repairGuidedLearningScaffoldOnDlaCapture(parsed, options) {
      var container = resolveDlaActivitiesContainer(parsed);
      if (!container) {
        return {
          parsed: parsed,
          repairApplied: false,
          evidence: evaluateGuidedLearningScaffoldEvidence([]),
          repaired: []
        };
      }
      var result = repairGuidedLearningScaffoldOnActivities(container.activities, options);
      return {
        parsed: container.parsed,
        repairApplied: result.repairApplied,
        evidence: result.evidence,
        repaired: result.repaired
      };
    }

    function markerRegex() {
      return /LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT \(auto-applied\)/i;
    }

    function scaffoldAlreadyPresent(text) {
      return markerRegex().test(String(text || ""));
    }

    function normalizeActivitiesList(input) {
      if (Array.isArray(input)) return input;
      if (input && typeof input === "object" && Array.isArray(input.activities)) {
        return input.activities;
      }
      return [];
    }

    function evaluateGuidedLearningScaffoldEvidence(input, options) {
      var activities = normalizeActivitiesList(input);
      var opts = options && typeof options === "object" ? options : {};
      var ctx =
        opts.repairContext || buildRepairContext(activities, opts.repairOptions || opts);
      var rows = [];
      var issues = [];
      activities.forEach(function (row, index) {
        if (!row || typeof row !== "object") return;
        var id = String(row.activity_id || row.activityId || row.id || "").trim() || "activity";
        var rowIssues = collectRowScaffoldIssues(row, index, activities.length, ctx);
        if (rowIssues.length) {
          issues.push({ activity_id: id, fields: rowIssues });
        }
        rows.push({ activity_id: id, issues: rowIssues });
      });
      return {
        activityCount: activities.length,
        issueCount: issues.length,
        meetsGuidedLearningScaffoldQuality: activities.length > 0 && issues.length === 0,
        issues: issues,
        rows: rows
      };
    }

    return {
      MODULE_ID: MODULE_ID,
      MARKER: MARKER,
      FIELD_WORD_RANGES: FIELD_WORD_RANGES,
      SCAFFOLD_FIELD_IDS: SCAFFOLD_FIELD_IDS.slice(),
      buildLdGuidedLearningScaffoldPromptBlock: buildLdGuidedLearningScaffoldPromptBlock,
      markerRegex: markerRegex,
      scaffoldAlreadyPresent: scaffoldAlreadyPresent,
      normalizeFieldText: normalizeFieldText,
      wordCount: wordCount,
      scaffoldLooksLikeTerseLabel: scaffoldLooksLikeTerseLabel,
      preambleFailsQuality: preambleFailsQuality,
      fieldFailsScaffoldQuality: fieldFailsScaffoldQuality,
      evaluateGuidedLearningScaffoldEvidence: evaluateGuidedLearningScaffoldEvidence,
      buildRepairContext: buildRepairContext,
      collectRowScaffoldIssues: collectRowScaffoldIssues,
      bridgeLooksSchedulingOnly: bridgeLooksSchedulingOnly,
      expandIntellectualCoherenceBridge: expandIntellectualCoherenceBridge,
      expandExpectedOutput: expandExpectedOutput,
      repairActivityScaffoldFields: repairActivityScaffoldFields,
      repairGuidedLearningScaffoldOnActivities: repairGuidedLearningScaffoldOnActivities,
      repairGuidedLearningScaffoldOnDlaCapture: repairGuidedLearningScaffoldOnDlaCapture
    };
  }
);
