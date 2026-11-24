/**
 * Sprint 104 Milestone 2 (S104-D02) — Practice Episode Plan design authority.
 *
 * Replaces Practice-specific deterministic archetype instantiation with
 * AI-authored, deterministically grammar-validated Episode Plan design.
 * Interactive workflows continue using their existing deterministic shell path.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else if (typeof root !== "undefined") {
    root.PRISM_PRACTICE_EPISODE_PLAN = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var CONTRACT_VERSION = "S104-M2";

  function resolveHostModule(globalName, relPath) {
    try {
      if (typeof require === "function") {
        try {
          return require(relPath);
        } catch (_e1) {}
      }
    } catch (_err) {}
    var roots = [];
    if (typeof globalThis !== "undefined") roots.push(globalThis);
    if (typeof window !== "undefined") roots.push(window);
    if (typeof self !== "undefined") roots.push(self);
    for (var i = 0; i < roots.length; i += 1) {
      if (roots[i] && roots[i][globalName]) {
        return roots[i][globalName];
      }
    }
    return null;
  }

  function resolveVocabularyMod() {
    return resolveHostModule("PRISM_EPISODE_PLAN_V1_VOCABULARY", "./episode-plan-v1-vocabulary.js");
  }

  function resolveGrammarMod() {
    return resolveHostModule("PRISM_EPISODE_PLAN_V1_ARCHETYPE_GRAMMAR", "./episode-plan-v1-archetype-grammar.js");
  }

  function resolvePageShellCreateMod() {
    return resolveHostModule("PRISM_PAGE_SHELL_CREATE", "./page-shell-create.js");
  }

  function asTrimmed(value) {
    return String(value == null ? "" : value).trim();
  }

  function normalizeTextForComparison(value) {
    return asTrimmed(value).replace(/\s+/g, " ");
  }

  function extractOutcomeRows(source) {
    if (!source) return [];
    if (Array.isArray(source)) return source;
    if (typeof source === "object" && Array.isArray(source.learning_outcomes)) {
      return source.learning_outcomes;
    }
    return [];
  }

  /**
   * Normalizes commissioned or upstream learning_outcomes into canonical records
   * with deterministic id ("LO1", "LO2", ... fallback when row omits id/outcome_id).
   */
  function resolveAuthoritativePracticeOutcomes(options) {
    var opts = options && typeof options === "object" ? options : {};
    var commissionedRows = extractOutcomeRows(opts.commissionedLearningOutcomes);
    var upstreamRows = extractOutcomeRows(opts.upstreamLearningOutcomes);
    var rawRows = commissionedRows.length ? commissionedRows : upstreamRows;
    var out = [];
    var seen = Object.create(null);

    rawRows.forEach(function (row, index) {
      if (typeof row === "string") {
        var strStmt = asTrimmed(row);
        if (!strStmt) return;
        var strId = "LO" + (index + 1);
        if (seen[strId]) return;
        seen[strId] = true;
        out.push({ id: strId, statement: strStmt });
        return;
      }
      if (!row || typeof row !== "object" || Array.isArray(row)) return;
      var id = asTrimmed(row.id || row.outcome_id || row.learning_outcome_id) || "LO" + (index + 1);
      var statement = asTrimmed(row.statement || row.text || row.description);
      if (!statement || seen[id]) return;
      seen[id] = true;
      var entry = { id: id, statement: statement };
      if (Array.isArray(row.related_concepts) && row.related_concepts.length) {
        entry.related_concepts = row.related_concepts.slice();
      }
      if (asTrimmed(row.cognitive_level)) {
        entry.cognitive_level = asTrimmed(row.cognitive_level);
      }
      if (asTrimmed(row.notes)) {
        entry.notes = asTrimmed(row.notes);
      }
      if (asTrimmed(row.category)) {
        entry.category = asTrimmed(row.category);
      }
      out.push(entry);
    });

    return out;
  }

  function formatPracticeGrammarSummary(grammarMod, vocabMod) {
    var grammar = grammarMod || resolveGrammarMod();
    var vocab = vocabMod || resolveVocabularyMod();
    var lines = [
      "### Episode Plan V1 Pedagogical Grammar (deterministically enforced)",
      "",
      "Each activity must carry an `episode_plan` object `{ archetype, beats }` using ONLY the 4 frozen archetypes and approved `FunctionEnum` beat identifiers below."
    ];

    if (vocab && Array.isArray(vocab.FUNCTION_ENUM)) {
      lines.push("Approved `FunctionEnum` beats: " + vocab.FUNCTION_ENUM.join(", ") + ".");
    }

    if (grammar && grammar.ARCHETYPE_GRAMMAR) {
      lines.push("");
      lines.push("Frozen archetypes and grammar rules:");
      var archetypes = Array.isArray(grammar.FROZEN_ARCHETYPES)
        ? grammar.FROZEN_ARCHETYPES
        : Object.keys(grammar.ARCHETYPE_GRAMMAR);
      archetypes.forEach(function (archKey) {
        var g = grammar.ARCHETYPE_GRAMMAR[archKey];
        if (!g) return;
        var reqBeats =
          Array.isArray(g.requiredBeats) && g.requiredBeats.length
            ? g.requiredBeats.join(", ")
            : "none";
        var reqGroups =
          Array.isArray(g.requiredGroups) && g.requiredGroups.length
            ? g.requiredGroups
                .map(function (grp) {
                  return grp.id + " (at least " + grp.min + " of: " + grp.beats.join(" | ") + ")";
                })
                .join("; ")
            : "none";
        var termLast =
          g.terminal && Array.isArray(g.terminal.allowedLast) && g.terminal.allowedLast.length
            ? g.terminal.allowedLast.join(" | ")
            : "any closure beat";
        lines.push(
          "- `" +
            archKey +
            "`: allowed=[" +
            g.allowedBeats.join(", ") +
            "]; requiredBeats=[" +
            reqBeats +
            "]; requiredGroups=[" +
            reqGroups +
            "]; allowedTerminalBeats=[" +
            termLast +
            "]."
        );
      });
      lines.push("");
      lines.push(
        "Ordering and cardinality invariants: follow monotonic progression Open -> Expose/Prepare/Frame -> Practise -> Close; respect precedes constraints (framing/activation before explanation/criteria; explanation/worked examples/criteria before practice/inquiry/performance; performance before verification/reflection/transfer); obey per-beat min/max cardinality."
      );
    }

    lines.push(
      "Pedagogical discretion (no quotas or tiers): PRISM imposes NO duration tiers, NO activity quotas, and NO beat-count targets. Choose the activity granularity and grammar-legal beat sequence that genuinely serves the purpose, outcomes, authoritative duration, and prior learning. Lean, direct progressions that move swiftly into authentic practice are valid when prior learning makes upfront reteaching unnecessary."
    );
    return lines.join("\n");
  }

  function buildPracticeEpisodePlanPromptBody(context) {
    var ctx = context && typeof context === "object" ? context : {};
    var title = asTrimmed(ctx.title);
    var audience = asTrimmed(ctx.audience);
    var purpose = asTrimmed(ctx.purpose);
    var priorLearning = asTrimmed(ctx.priorLearning);
    var journeyContext = asTrimmed(ctx.journeyContext);
    var dependencies = asTrimmed(ctx.dependencies);
    var durationMinutes =
      typeof ctx.durationMinutes === "number" &&
      isFinite(ctx.durationMinutes) &&
      ctx.durationMinutes > 0
        ? Math.round(ctx.durationMinutes)
        : null;
    var outcomes = Array.isArray(ctx.authoritativeOutcomes) ? ctx.authoritativeOutcomes : [];
    var requiredLearnerArtefacts = Array.isArray(ctx.requiredLearnerArtefacts)
      ? ctx.requiredLearnerArtefacts
      : [];
    var commissionNativeLoBound = !!ctx.commissionNativeLoBound;

    var lines = [
      "Design an authoritative Practice Episode Plan (`page` v2 shell) for this commission.",
      "",
      "### Design Authority & Scope (Practice Episode Plan)",
      "- You own the pedagogical activity structure, outcome-to-activity grouping, archetype selection, and beat progression (`episode_plan.archetype` and `episode_plan.beats`).",
      "- Do NOT invent deterministic boilerplate or fall back to rigid standalone Orient->Teach->Consolidate ceremony when learners already hold prior foundations.",
      "- Preserve downstream population-only authoring boundaries: leave DLA-owned fields (`learner_task`, `expected_output`, `activity_preamble`) as em dash `\"\\u2014\"`, keep `required_materials: []` and `materials: []`, do not emit DLA cognition fields, and do not emit `sections[]`, `learning_sequence`, or `assessment_check`.",
      "",
      "### Authoritative Planning Inputs"
    ];

    if (title) lines.push("- Component title / focus: " + title);
    if (audience) lines.push("- Learners / audience: " + audience);
    if (purpose) lines.push("- Purpose / educational job: " + purpose);
    if (durationMinutes != null) {
      lines.push(
        "- Authoritative allocated duration: " +
          durationMinutes +
          " minutes. Calibrate cognitive ambition and practice pacing organically to fit " +
          durationMinutes +
          " minutes without using mechanical duration tiers or fixed beat quotas."
      );
    } else {
      lines.push(
        "- Authoritative allocated duration: not specified in structured commission metadata. Calibrate scope coherently to the commissioned purpose and outcomes."
      );
    }
    if (priorLearning) {
      lines.push("- Prior learning established: " + priorLearning);
    }
    if (journeyContext && normalizeTextForComparison(journeyContext) !== normalizeTextForComparison(priorLearning)) {
      lines.push("- Journey continuity context: " + journeyContext);
    }
    if (dependencies) {
      lines.push("- Educational dependencies: " + dependencies);
    }

    if (requiredLearnerArtefacts.length) {
      lines.push("");
      lines.push("### Shared Learner Artefact Obligation (downstream awareness)");
      lines.push(
        "Downstream DLA/GAM stages will bind learner-owned work for the commissioned elicitation(s) below. Ensure your Episode Plan provides genuine learner-performance opportunity without emitting DLA `response_fulfilment` fields at this Episode Plan stage:"
      );
      requiredLearnerArtefacts.forEach(function (art) {
        if (!art || typeof art !== "object") return;
        var eid = asTrimmed(art.elicitationId || art.elicitation_id);
        var aid = asTrimmed(art.artefactId || art.artefact_id);
        var artTitle = asTrimmed(art.title);
        if (eid || aid || artTitle) {
          lines.push(
            "- " +
              (eid ? "elicitation_id `" + eid + "`" : "artefact") +
              (aid ? " (" + aid + ")" : "") +
              (artTitle ? " — " + artTitle : "")
          );
        }
      });
    }

    lines.push("");
    lines.push("### Authoritative Learning Outcomes & Activity Mapping");
    lines.push(
      "- Multi-outcome cohesive activity support: you MAY map multiple compatible authoritative outcomes onto one cohesive activity (e.g. `mapped_learning_outcome_ids: [\"LO1\", \"LO2\"]` and matching `activities[].learning_outcome_ids: [\"LO1\", \"LO2\"]`) whenever a unified learner progression genuinely serves them together, OR separate outcomes into distinct activities where distinct performances/scaffolds are warranted."
    );
    lines.push(
      "- Total outcome coverage & fidelity: EVERY authoritative learning outcome must be preserved verbatim in `learning_outcomes[]` and mapped in at least one activity's `mapped_learning_outcome_ids` and `activities[].learning_outcome_ids`. Never discard, omit, invent, or rewrite outcomes."
    );

    if (outcomes.length) {
      lines.push("");
      lines.push("Authoritative canonical outcome IDs and statements to preserve and cover 100%:");
      outcomes.forEach(function (lo) {
        lines.push("- `" + lo.id + "`: " + lo.statement);
      });
      lines.push("");
      lines.push("Canonical `learning_outcomes` JSON array:");
      lines.push("```json");
      lines.push(
        JSON.stringify(
          outcomes.map(function (lo) {
            var item = { id: lo.id, statement: lo.statement };
            if (lo.related_concepts) item.related_concepts = lo.related_concepts;
            if (lo.cognitive_level) item.cognitive_level = lo.cognitive_level;
            return item;
          }),
          null,
          2
        )
      );
      lines.push("```");
    } else if (!commissionNativeLoBound) {
      lines.push("");
      lines.push(
        "No upstream `learning_outcomes` capture is embedded yet. Read `STEP N OUTPUT: learning_outcomes` from this Copilot conversation, assign canonical IDs (`LO1`, `LO2`, ... if absent), preserve those statements verbatim in `learning_outcomes[]`, and map 100% of them across `episode_plans[]` and `activities[]`."
      );
    }

    lines.push("");
    lines.push(formatPracticeGrammarSummary(ctx.grammarMod, ctx.vocabMod));

    lines.push("");
    lines.push("### Required Output Shape (`page` v2 Episode Plan Shell)");
    lines.push(
      '- Top-level keys: `artifact_type: "page"`, `schema_version: "2.0.0"`, `product_id: "practice"`, `page_kind: "practice"`, `title`, `audience`, `page_profile: { "profile_type": "learner" }`, `assembly_state: { "enriched_by": ["episode_plan"], "current_stage": "episode_plan" }`, `page_synthesis: {}`, `learning_outcomes[]`, `episode_plans[]`, `activities[]`, `source_artefacts[]`, `generation_notes: { "validation": { "activity_coverage": "shell_only", "material_coverage": "pending_gam", "episode_plan_attachment": "attached", "self_containment": "shell_only", "schema_compliance": "episode_plan_boundary", "known_issues": [] } }`.'
    );
    lines.push(
      "- Every entry in `activities[]` must pair 1:1 by `activity_id` with `episode_plans[]`, agree on `episode_plan` (`archetype` and `beats`), and carry matching `learning_outcome_ids[]` / `mapped_learning_outcome_ids[]`."
    );

    return lines.join("\n");
  }

  function normalizeBeatSignature(plan) {
    if (!plan || typeof plan !== "object" || Array.isArray(plan)) return null;
    var archetype = asTrimmed(plan.archetype);
    var beats = Array.isArray(plan.beats)
      ? plan.beats.map(function (b) {
          return typeof b === "string" ? asTrimmed(b) : asTrimmed(b && (b.function || b.beat_function));
        })
      : null;
    if (!archetype || !beats) return null;
    return { archetype: archetype, beats: beats };
  }

  function episodePlansEqual(a, b) {
    var sa = normalizeBeatSignature(a);
    var sb = normalizeBeatSignature(b);
    if (!sa || !sb) return false;
    if (sa.archetype !== sb.archetype) return false;
    if (sa.beats.length !== sb.beats.length) return false;
    for (var i = 0; i < sa.beats.length; i += 1) {
      if (sa.beats[i] !== sb.beats[i]) return false;
    }
    return true;
  }

  function normalizeOutcomeIdList(arr) {
    if (!Array.isArray(arr)) return [];
    var out = [];
    var seen = Object.create(null);
    arr.forEach(function (item) {
      var id = asTrimmed(item);
      if (!id || seen[id]) return;
      seen[id] = true;
      out.push(id);
    });
    return out;
  }

  function outcomeIdListsEqualAsSets(a, b) {
    if (a.length !== b.length) return false;
    var mapA = Object.create(null);
    a.forEach(function (id) {
      mapA[id] = true;
    });
    return b.every(function (id) {
      return !!mapA[id];
    });
  }

  function formatGrammarViolation(activityId, archetype, violation) {
    var v = violation && typeof violation === "object" ? violation : {};
    var parts = [v.code || "GRAMMAR_VIOLATION"];
    if (v.beat) parts.push("beat=" + v.beat);
    if (v.groupId) parts.push("group=" + v.groupId);
    if (v.chainId) parts.push("chain=" + v.chainId);
    if (v.detail) parts.push(v.detail);
    return "activity " + activityId + " (" + archetype + "): " + parts.join(" ");
  }

  /**
   * Deterministically validates an AI-authored Practice Episode Plan page shell.
   * Preserves valid authorial choices (including multi-LO cohesive single activities
   * and lean grammar-legal sequences); fails closed on structural, grammar, or
   * outcome-coverage defects without overwriting.
   */
  function validatePracticeEpisodePlanCapture(shell, options) {
    var opts = options && typeof options === "object" ? options : {};
    var errors = [];
    if (!shell || typeof shell !== "object" || Array.isArray(shell)) {
      return { ok: false, errors: ["Practice Episode Plan capture must be a JSON object"] };
    }

    var shellMod = opts.pageShellCreateMod || resolvePageShellCreateMod();
    var grammarMod = opts.grammarMod || resolveGrammarMod();

    if (!shellMod || typeof shellMod.validatePageShellAgainstVNextSchema !== "function") {
      return { ok: false, errors: ["page-shell-create module unavailable for Practice EP validation"] };
    }
    if (!grammarMod || typeof grammarMod.validateSequenceAgainstGrammar !== "function") {
      return {
        ok: false,
        errors: ["episode-plan-v1-archetype-grammar module unavailable for Practice EP validation"]
      };
    }

    if (shell.product_id != null && asTrimmed(shell.product_id).toLowerCase() !== "practice") {
      errors.push('Practice Episode Plan product_id must be "practice" when supplied');
    }
    if (shell.page_kind != null && asTrimmed(shell.page_kind).toLowerCase() !== "practice") {
      errors.push('Practice Episode Plan page_kind must be "practice" when supplied');
    }

    var stage = asTrimmed(shell.assembly_state && shell.assembly_state.current_stage).toLowerCase();
    if (stage !== "episode_plan") {
      errors.push('Practice Episode Plan assembly_state.current_stage must be "episode_plan"');
    }
    var enrichedBy = Array.isArray(shell.assembly_state && shell.assembly_state.enriched_by)
      ? shell.assembly_state.enriched_by.map(function (s) {
          return asTrimmed(s).toLowerCase();
        })
      : [];
    if (enrichedBy.indexOf("episode_plan") === -1) {
      errors.push('Practice Episode Plan assembly_state.enriched_by must include "episode_plan"');
    }

    var baseCheck = shellMod.validatePageShellAgainstVNextSchema(shell);
    if (!baseCheck || !baseCheck.ok) {
      ((baseCheck && baseCheck.errors) || ["vNext page shell schema failed"]).forEach(function (err) {
        errors.push(err);
      });
    }

    if (typeof shellMod.shellHasInventedDlaFields === "function" && shellMod.shellHasInventedDlaFields(shell)) {
      errors.push("Practice Episode Plan must not invent DLA cognition fields at shell stage");
    }
    if (typeof shellMod.shellHasInventedGamMaterials === "function" && shellMod.shellHasInventedGamMaterials(shell)) {
      errors.push("Practice Episode Plan must keep activities[].materials empty at shell stage");
    }
    if (Array.isArray(shell.activities)) {
      shell.activities.forEach(function (act, idx) {
        if (!act || typeof act !== "object") return;
        if (Array.isArray(act.required_materials) && act.required_materials.length > 0) {
          errors.push(
            "activities[" +
              idx +
              "].required_materials must be empty [] at Episode Plan shell stage (DLA owns required_materials)"
          );
        }
      });
    }

    // Validate shell.learning_outcomes[] and compare with authoritative outcomes if available.
    var shellOutcomes = [];
    var shellOutcomeMap = Object.create(null);
    if (!Array.isArray(shell.learning_outcomes) || !shell.learning_outcomes.length) {
      errors.push("Practice Episode Plan learning_outcomes must be a non-empty array");
    } else {
      shell.learning_outcomes.forEach(function (row, idx) {
        if (typeof row === "string") {
          var sText = asTrimmed(row);
          if (!sText) {
            errors.push("learning_outcomes[" + idx + "] statement must be non-empty");
            return;
          }
          var sId = "LO" + (idx + 1);
          if (shellOutcomeMap[sId]) {
            errors.push("duplicate learning_outcomes id: " + sId);
            return;
          }
          shellOutcomeMap[sId] = { id: sId, statement: sText };
          shellOutcomes.push(shellOutcomeMap[sId]);
          return;
        }
        if (!row || typeof row !== "object" || Array.isArray(row)) {
          errors.push("learning_outcomes[" + idx + "] must be an object");
          return;
        }
        var loId = asTrimmed(row.id || row.outcome_id || row.learning_outcome_id) || "LO" + (idx + 1);
        var stmt = asTrimmed(row.statement || row.text || row.description);
        if (!stmt) {
          errors.push("learning_outcomes[" + idx + "] (" + loId + ") statement must be non-empty");
          return;
        }
        if (shellOutcomeMap[loId]) {
          errors.push("duplicate learning_outcomes id: " + loId);
          return;
        }
        shellOutcomeMap[loId] = { id: loId, statement: stmt };
        shellOutcomes.push(shellOutcomeMap[loId]);
      });
    }

    var authOutcomes = Array.isArray(opts.authoritativeOutcomes)
      ? opts.authoritativeOutcomes
      : resolveAuthoritativePracticeOutcomes(opts);

    var expectedOutcomeIds = [];
    if (authOutcomes.length) {
      authOutcomes.forEach(function (authLo) {
        expectedOutcomeIds.push(authLo.id);
        var captured = shellOutcomeMap[authLo.id];
        if (!captured) {
          errors.push(
            'Practice Episode Plan omitted authoritative learning outcome "' +
              authLo.id +
              '": ' +
              authLo.statement
          );
          return;
        }
        if (
          normalizeTextForComparison(captured.statement) !==
          normalizeTextForComparison(authLo.statement)
        ) {
          errors.push(
            'Practice Episode Plan modified authoritative learning outcome "' +
              authLo.id +
              '" statement'
          );
        }
      });
      var authMap = Object.create(null);
      authOutcomes.forEach(function (authLo) {
        authMap[authLo.id] = true;
      });
      shellOutcomes.forEach(function (captured) {
        if (!authMap[captured.id]) {
          errors.push(
            'Practice Episode Plan invented uncommissioned learning outcome "' + captured.id + '"'
          );
        }
      });
    } else {
      expectedOutcomeIds = shellOutcomes.map(function (row) {
        return row.id;
      });
    }

    // Validate 1:1 activities[] <-> episode_plans[] pairing, beat grammar, and outcome coverage.
    var activities = Array.isArray(shell.activities) ? shell.activities : [];
    var planRows = Array.isArray(shell.episode_plans) ? shell.episode_plans : [];
    if (!planRows.length) {
      errors.push("Practice Episode Plan must include non-empty episode_plans[] paired with activities[]");
    }

    var activityById = Object.create(null);
    activities.forEach(function (act, idx) {
      if (!act || typeof act !== "object") return;
      var aid = asTrimmed(act.activity_id);
      if (!aid) {
        errors.push("activities[" + idx + "].activity_id must be a non-empty string");
        return;
      }
      if (activityById[aid]) {
        errors.push("duplicate activities[].activity_id: " + aid);
        return;
      }
      activityById[aid] = act;
    });

    var planById = Object.create(null);
    planRows.forEach(function (planRow, idx) {
      if (!planRow || typeof planRow !== "object" || Array.isArray(planRow)) {
        errors.push("episode_plans[" + idx + "] must be an object");
        return;
      }
      var aid = asTrimmed(planRow.activity_id);
      if (!aid) {
        errors.push("episode_plans[" + idx + "].activity_id must be a non-empty string");
        return;
      }
      if (planById[aid]) {
        errors.push("duplicate episode_plans[].activity_id: " + aid);
        return;
      }
      planById[aid] = planRow;
      if (!activityById[aid]) {
        errors.push('episode_plans[' + idx + '] activity_id "' + aid + '" missing from activities[]');
      }
    });

    activities.forEach(function (act) {
      if (!act || typeof act !== "object") return;
      var aid = asTrimmed(act.activity_id);
      if (aid && !planById[aid]) {
        errors.push('activities[] activity_id "' + aid + '" missing matching entry in episode_plans[]');
      }
    });

    var expectedOutcomeSet = Object.create(null);
    expectedOutcomeIds.forEach(function (id) {
      expectedOutcomeSet[id] = true;
    });
    var coveredOutcomes = Object.create(null);

    activities.forEach(function (act) {
      if (!act || typeof act !== "object") return;
      var aid = asTrimmed(act.activity_id);
      if (!aid) return;
      var planRow = planById[aid];

      var actPlan = act.episode_plan;
      var rowPlan = planRow && planRow.episode_plan;
      if (planRow && (!rowPlan || typeof rowPlan !== "object")) {
        errors.push('episode_plans row for "' + aid + '" must carry episode_plan');
      } else if (actPlan && rowPlan && !episodePlansEqual(actPlan, rowPlan)) {
        errors.push(
          'activities["' + aid + '"].episode_plan disagrees with episode_plans["' + aid + '"].episode_plan'
        );
      }

      var effectivePlan = rowPlan || actPlan;
      if (effectivePlan && typeof effectivePlan === "object") {
        var grammarCheck = grammarMod.validateSequenceAgainstGrammar(
          effectivePlan.archetype,
          effectivePlan.beats
        );
        if (!grammarCheck || !grammarCheck.valid || !grammarCheck.applicable) {
          var violations =
            grammarCheck && Array.isArray(grammarCheck.violations) && grammarCheck.violations.length
              ? grammarCheck.violations
              : [{ code: "GRAMMAR_INVALID", detail: "beat sequence rejected by V1 grammar" }];
          violations.forEach(function (v) {
            errors.push(formatGrammarViolation(aid, effectivePlan.archetype || "unknown", v));
          });
        }
      }

      var planLos = normalizeOutcomeIdList(planRow && planRow.mapped_learning_outcome_ids);
      var actLos = normalizeOutcomeIdList(
        Array.isArray(act.learning_outcome_ids)
          ? act.learning_outcome_ids
          : act.mapped_learning_outcome_ids
      );

      if (planLos.length && actLos.length && !outcomeIdListsEqualAsSets(planLos, actLos)) {
        errors.push(
          'activity "' +
            aid +
            '" learning_outcome_ids [' +
            actLos.join(", ") +
            "] disagrees with episode_plans.mapped_learning_outcome_ids [" +
            planLos.join(", ") +
            "]"
        );
      }

      var effectiveLos = planLos.length ? planLos : actLos;
      if (!effectiveLos.length) {
        errors.push(
          'activity "' +
            aid +
            '" must map at least one authoritative learning outcome id (mapped_learning_outcome_ids / learning_outcome_ids)'
        );
      } else {
        if (planRow) planRow.mapped_learning_outcome_ids = effectiveLos.slice();
        act.learning_outcome_ids = effectiveLos.slice();
        effectiveLos.forEach(function (loId) {
          if (expectedOutcomeIds.length && !expectedOutcomeSet[loId]) {
            errors.push(
              'activity "' + aid + '" references unknown learning outcome id "' + loId + '"'
            );
            return;
          }
          coveredOutcomes[loId] = true;
        });
      }
    });

    expectedOutcomeIds.forEach(function (loId) {
      if (!coveredOutcomes[loId]) {
        errors.push(
          'Authoritative learning outcome "' +
            loId +
            '" is unmapped — every outcome must be covered by at least one activity'
        );
      }
    });

    return {
      ok: errors.length === 0,
      errors: errors
    };
  }

  return {
    CONTRACT_VERSION: CONTRACT_VERSION,
    resolveAuthoritativePracticeOutcomes: resolveAuthoritativePracticeOutcomes,
    formatPracticeGrammarSummary: formatPracticeGrammarSummary,
    buildPracticeEpisodePlanPromptBody: buildPracticeEpisodePlanPromptBody,
    validatePracticeEpisodePlanCapture: validatePracticeEpisodePlanCapture
  };
});
