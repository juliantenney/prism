/**
 * Sprint 69 — Shared Episode Plan V1 archetype grammar.
 *
 * Authoritative description of educational legality for frozen archetypes
 * (canonical FunctionEnum sequences). Dependency-light: vocabulary membership
 * only. No renderer binding, aliases, or fuzzy rules.
 *
 * Runtime (Phase 5B+): sole educational legality authority for production.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(require("./episode-plan-v1-vocabulary.js"));
  } else {
    root.PRISM_EPISODE_PLAN_V1_ARCHETYPE_GRAMMAR = factory(
      root.PRISM_EPISODE_PLAN_V1_VOCABULARY
    );
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (vocabularyMod) {
  if (!vocabularyMod || !vocabularyMod.FUNCTION_ENUM_SET) {
    throw new Error("episode-plan-v1-vocabulary module unavailable");
  }

  var FROZEN_ARCHETYPES = Object.freeze([
    "understand",
    "apply",
    "analyse",
    "evaluate"
  ]);

  /**
   * Default pedagogic role expectations for FunctionEnum beats.
   * Roles are educational semantics (reflect/explain/model/practise/check/transfer),
   * not renderer moment composition or material assignment.
   *
   * S78-WS-2: independent_performance means performance on an operand whose target
   * solution has not already been supplied by preceding model material in the same
   * activity. Authoritative binding is commissioned by DLA (practice_independence).
   */
  var DEFAULT_ROLE_BY_FUNCTION = Object.freeze({
    orientation: "reflect",
    framing: "reflect",
    activation: "reflect",
    transition: "reflect",
    explanation: "explain",
    example: "explain",
    non_example: "explain",
    misconception_confrontation: "explain",
    criteria_exposition: "explain",
    perspective_construction: "explain",
    observation: "explain",
    worked_thinking: "model",
    worked_judgement: "model",
    guided_inquiry: "practise",
    guided_reasoning: "practise",
    guided_practice: "practise",
    independent_performance: "practise",
    criteria_construction: "practise",
    evaluative_judgement: "practise",
    prediction: "practise",
    verification: "check",
    revision: "check",
    reflection: "check",
    transfer: "transfer"
  });

  /**
   * Relative-order chains: when all listed beats appear, they must keep this order.
   * Sourced from educational transition protection (population contract T1–T5),
   * expressed as legality rules — not as observed sequences.
   */
  var RELATIVE_ORDER_CHAINS = Object.freeze([
    Object.freeze({
      id: "T1",
      beats: Object.freeze([
        "worked_thinking",
        "guided_practice",
        "independent_performance"
      ])
    }),
    Object.freeze({
      id: "T2",
      beats: Object.freeze([
        "perspective_construction",
        "criteria_construction",
        "evaluative_judgement"
      ])
    }),
    Object.freeze({
      id: "T3",
      beats: Object.freeze(["prediction", "observation", "revision"])
    }),
    Object.freeze({
      id: "T4",
      // Align with Episode Plan V1 evaluate close: judgement → … → reflection → transfer.
      beats: Object.freeze(["evaluative_judgement", "reflection", "transfer"])
    }),
    Object.freeze({
      id: "T5",
      beats: Object.freeze([
        "independent_performance",
        "verification",
        "reflection"
      ])
    })
  ]);

  function freezeBeatList(list) {
    return Object.freeze(list.slice());
  }

  function freezeCardinality(map) {
    var out = {};
    Object.keys(map).forEach(function (key) {
      out[key] = Object.freeze({
        min: map[key].min,
        max: map[key].max == null ? null : map[key].max
      });
    });
    return Object.freeze(out);
  }

  function freezePhases(phases) {
    return Object.freeze(
      phases.map(function (phase) {
        return Object.freeze({
          id: phase.id,
          beats: freezeBeatList(phase.beats)
        });
      })
    );
  }

  function freezePrecedes(pairs) {
    return Object.freeze(
      pairs.map(function (pair) {
        return Object.freeze([pair[0], pair[1]]);
      })
    );
  }

  function freezeRoles(map) {
    var out = {};
    Object.keys(map).forEach(function (key) {
      out[key] = map[key];
    });
    return Object.freeze(out);
  }

  function freezeRequiredGroups(groups) {
    return Object.freeze(
      groups.map(function (group) {
        return Object.freeze({
          id: group.id,
          min: group.min,
          beats: freezeBeatList(group.beats)
        });
      })
    );
  }

  function buildArchetypeGrammar(spec) {
    var allowed = freezeBeatList(spec.allowedBeats);
    var required = freezeBeatList(spec.requiredBeats || []);
    var requiredSet = {};
    required.forEach(function (id) {
      requiredSet[id] = true;
    });
    var optional = freezeBeatList(
      allowed.filter(function (id) {
        return !requiredSet[id];
      })
    );
    var roles = {};
    allowed.forEach(function (id) {
      roles[id] =
        (spec.roleExpectations && spec.roleExpectations[id]) ||
        DEFAULT_ROLE_BY_FUNCTION[id] ||
        null;
    });

    return Object.freeze({
      archetype: spec.archetype,
      allowedBeats: allowed,
      requiredBeats: required,
      optionalBeats: optional,
      requiredGroups: freezeRequiredGroups(spec.requiredGroups || []),
      cardinality: freezeCardinality(spec.cardinality),
      phases: freezePhases(spec.phases),
      precedes: freezePrecedes(spec.precedes || []),
      relativeOrderChains: RELATIVE_ORDER_CHAINS,
      terminal: Object.freeze({
        allowedLast: freezeBeatList(spec.terminal.allowedLast),
        exclusiveLast: freezeBeatList(spec.terminal.exclusiveLast || [])
      }),
      roleExpectations: freezeRoles(roles)
    });
  }

  function card(min, max) {
    return { min: min, max: max };
  }

  var ARCHETYPE_GRAMMAR = Object.freeze({
    understand: buildArchetypeGrammar({
      archetype: "understand",
      allowedBeats: [
        "orientation",
        "framing",
        "activation",
        "explanation",
        "example",
        "non_example",
        "misconception_confrontation",
        "worked_thinking",
        "guided_practice",
        "independent_performance",
        "verification",
        "reflection",
        "transition",
        "prediction",
        "observation"
      ],
      requiredBeats: ["explanation"],
      requiredGroups: [
        {
          id: "closure",
          min: 1,
          beats: ["verification", "reflection", "transition"]
        }
      ],
      cardinality: {
        orientation: card(0, 1),
        framing: card(0, 1),
        activation: card(0, 1),
        explanation: card(1, null),
        example: card(0, null),
        non_example: card(0, null),
        misconception_confrontation: card(0, null),
        worked_thinking: card(0, null),
        guided_practice: card(0, null),
        independent_performance: card(0, null),
        verification: card(0, 1),
        reflection: card(0, 1),
        transition: card(0, 1),
        prediction: card(0, null),
        observation: card(0, null)
      },
      phases: [
        { id: "open", beats: ["orientation", "framing", "activation"] },
        {
          id: "expose",
          beats: [
            "explanation",
            "example",
            "non_example",
            "misconception_confrontation",
            "worked_thinking",
            "prediction",
            "observation"
          ]
        },
        {
          id: "practise",
          beats: ["guided_practice", "independent_performance"]
        },
        {
          id: "close",
          beats: ["verification", "reflection", "transition"]
        }
      ],
      precedes: [
        ["orientation", "framing"],
        ["framing", "activation"],
        ["orientation", "activation"],
        ["orientation", "explanation"],
        ["framing", "explanation"],
        ["activation", "explanation"],
        ["explanation", "example"],
        ["explanation", "non_example"],
        ["example", "non_example"],
        ["non_example", "misconception_confrontation"],
        ["explanation", "worked_thinking"],
        ["explanation", "guided_practice"],
        ["worked_thinking", "guided_practice"],
        ["guided_practice", "independent_performance"],
        ["independent_performance", "verification"],
        ["verification", "reflection"],
        ["reflection", "transition"],
        ["verification", "transition"],
        ["worked_thinking", "verification"],
        ["guided_practice", "verification"]
      ],
      terminal: {
        allowedLast: ["transition", "reflection", "verification"],
        exclusiveLast: ["transition"]
      }
    }),

    apply: buildArchetypeGrammar({
      archetype: "apply",
      allowedBeats: [
        "orientation",
        "framing",
        "activation",
        "criteria_exposition",
        "explanation",
        "worked_thinking",
        "guided_practice",
        "independent_performance",
        "verification",
        "revision",
        "reflection",
        "transfer",
        "transition",
        "prediction",
        "observation"
      ],
      requiredBeats: [],
      requiredGroups: [
        {
          id: "model_or_criteria",
          min: 1,
          beats: ["criteria_exposition", "worked_thinking", "explanation"]
        },
        {
          id: "performance",
          min: 1,
          beats: ["guided_practice", "independent_performance"]
        },
        {
          id: "closure",
          min: 1,
          beats: ["verification", "reflection", "transfer", "transition"]
        }
      ],
      cardinality: {
        orientation: card(0, 1),
        framing: card(0, 1),
        activation: card(0, 1),
        criteria_exposition: card(0, 1),
        explanation: card(0, null),
        worked_thinking: card(0, null),
        guided_practice: card(0, null),
        independent_performance: card(0, null),
        verification: card(0, 1),
        revision: card(0, 1),
        reflection: card(0, 1),
        transfer: card(0, 1),
        transition: card(0, 1),
        prediction: card(0, null),
        observation: card(0, null)
      },
      phases: [
        { id: "open", beats: ["orientation", "framing", "activation"] },
        {
          id: "prepare",
          beats: [
            "criteria_exposition",
            "explanation",
            "worked_thinking",
            "prediction",
            "observation"
          ]
        },
        {
          id: "practise",
          beats: ["guided_practice", "independent_performance"]
        },
        {
          id: "close",
          beats: ["verification", "revision", "reflection", "transfer", "transition"]
        }
      ],
      precedes: [
        ["orientation", "framing"],
        ["framing", "activation"],
        ["activation", "criteria_exposition"],
        ["criteria_exposition", "worked_thinking"],
        ["explanation", "guided_practice"],
        ["worked_thinking", "guided_practice"],
        ["guided_practice", "independent_performance"],
        ["independent_performance", "verification"],
        ["verification", "revision"],
        ["revision", "reflection"],
        ["reflection", "transfer"],
        ["transfer", "transition"],
        ["verification", "reflection"],
        ["reflection", "transition"],
        ["guided_practice", "verification"]
      ],
      terminal: {
        allowedLast: ["transition", "transfer", "reflection", "verification"],
        exclusiveLast: ["transition"]
      }
    }),

    analyse: buildArchetypeGrammar({
      archetype: "analyse",
      allowedBeats: [
        "orientation",
        "framing",
        "activation",
        "criteria_exposition",
        "explanation",
        "worked_thinking",
        "guided_inquiry",
        "guided_practice",
        "independent_performance",
        "verification",
        "reflection",
        "transfer",
        "transition",
        "prediction",
        "observation"
      ],
      requiredBeats: [],
      requiredGroups: [
        {
          id: "analytic_frame",
          min: 1,
          beats: ["criteria_exposition", "explanation", "worked_thinking"]
        },
        {
          id: "inquiry_or_performance",
          min: 1,
          beats: [
            "guided_inquiry",
            "guided_practice",
            "independent_performance"
          ]
        },
        {
          id: "closure",
          min: 1,
          beats: ["verification", "reflection", "transfer", "transition"]
        }
      ],
      cardinality: {
        orientation: card(0, 1),
        framing: card(0, 1),
        activation: card(0, 1),
        criteria_exposition: card(0, 1),
        explanation: card(0, null),
        worked_thinking: card(0, null),
        guided_inquiry: card(0, null),
        guided_practice: card(0, null),
        independent_performance: card(0, null),
        verification: card(0, 1),
        reflection: card(0, 1),
        transfer: card(0, 1),
        transition: card(0, 1),
        prediction: card(0, null),
        observation: card(0, null)
      },
      phases: [
        { id: "open", beats: ["orientation", "framing", "activation"] },
        {
          id: "frame_and_model",
          beats: [
            "criteria_exposition",
            "explanation",
            "worked_thinking",
            "prediction",
            "observation"
          ]
        },
        {
          id: "practise",
          beats: ["guided_inquiry", "guided_practice", "independent_performance"]
        },
        {
          id: "close",
          beats: ["verification", "reflection", "transfer", "transition"]
        }
      ],
      precedes: [
        ["orientation", "framing"],
        ["framing", "activation"],
        ["activation", "criteria_exposition"],
        ["criteria_exposition", "explanation"],
        ["explanation", "worked_thinking"],
        ["worked_thinking", "guided_inquiry"],
        ["guided_inquiry", "guided_practice"],
        ["guided_practice", "independent_performance"],
        ["independent_performance", "verification"],
        ["verification", "reflection"],
        ["reflection", "transfer"],
        ["transfer", "transition"]
      ],
      terminal: {
        allowedLast: ["transition", "transfer", "reflection", "verification"],
        exclusiveLast: ["transition"]
      }
    }),

    evaluate: buildArchetypeGrammar({
      archetype: "evaluate",
      allowedBeats: [
        "orientation",
        "framing",
        "activation",
        "perspective_construction",
        "criteria_exposition",
        "criteria_construction",
        "worked_judgement",
        "guided_inquiry",
        "guided_reasoning",
        "independent_performance",
        "evaluative_judgement",
        "verification",
        "reflection",
        "transfer",
        "transition",
        "prediction",
        "observation",
        "explanation",
        "worked_thinking",
        "guided_practice"
      ],
      requiredBeats: [],
      requiredGroups: [
        {
          id: "evaluative_core",
          min: 1,
          beats: [
            "perspective_construction",
            "criteria_construction",
            "worked_judgement",
            "evaluative_judgement",
            "worked_thinking",
            "explanation"
          ]
        },
        {
          id: "closure",
          min: 1,
          beats: ["verification", "reflection", "transfer", "transition"]
        }
      ],
      cardinality: {
        orientation: card(0, 1),
        framing: card(0, 1),
        activation: card(0, 1),
        perspective_construction: card(0, 1),
        criteria_exposition: card(0, 1),
        criteria_construction: card(0, null),
        worked_judgement: card(0, null),
        guided_inquiry: card(0, null),
        guided_reasoning: card(0, null),
        independent_performance: card(0, null),
        evaluative_judgement: card(0, null),
        verification: card(0, 1),
        reflection: card(0, 1),
        transfer: card(0, 1),
        transition: card(0, 1),
        prediction: card(0, null),
        observation: card(0, null),
        explanation: card(0, null),
        worked_thinking: card(0, null),
        guided_practice: card(0, null)
      },
      phases: [
        { id: "open", beats: ["orientation", "framing", "activation"] },
        {
          id: "criteria_and_model",
          beats: [
            "perspective_construction",
            "criteria_exposition",
            "criteria_construction",
            "worked_judgement",
            "explanation",
            "worked_thinking",
            "prediction",
            "observation"
          ]
        },
        {
          id: "practise",
          beats: [
            "guided_inquiry",
            "guided_reasoning",
            "guided_practice",
            "independent_performance",
            "evaluative_judgement"
          ]
        },
        {
          id: "close",
          beats: ["verification", "reflection", "transfer", "transition"]
        }
      ],
      precedes: [
        ["orientation", "framing"],
        ["framing", "activation"],
        ["activation", "perspective_construction"],
        ["perspective_construction", "criteria_exposition"],
        ["criteria_exposition", "criteria_construction"],
        ["criteria_construction", "worked_judgement"],
        ["worked_judgement", "guided_inquiry"],
        ["guided_inquiry", "guided_reasoning"],
        ["guided_reasoning", "independent_performance"],
        ["independent_performance", "evaluative_judgement"],
        ["evaluative_judgement", "verification"],
        ["verification", "reflection"],
        ["reflection", "transfer"],
        ["transfer", "transition"],
        ["explanation", "worked_thinking"],
        ["worked_thinking", "guided_practice"],
        ["guided_practice", "transfer"]
      ],
      terminal: {
        allowedLast: ["transition", "transfer", "reflection", "verification"],
        exclusiveLast: ["transition"]
      }
    })
  });

  function listArchetypes() {
    return FROZEN_ARCHETYPES.slice();
  }

  function isKnownArchetype(archetype) {
    return Object.prototype.hasOwnProperty.call(
      ARCHETYPE_GRAMMAR,
      String(archetype || "")
    );
  }

  function getArchetypeGrammar(archetype) {
    var key = String(archetype || "");
    return ARCHETYPE_GRAMMAR[key] || null;
  }

  function normalizeBeatList(beats) {
    if (!Array.isArray(beats)) return [];
    return beats.map(function (beat) {
      if (typeof beat === "string") return beat;
      if (beat && typeof beat === "object" && beat.function != null) {
        return String(beat.function);
      }
      return String(beat == null ? "" : beat);
    });
  }

  function countOccurrences(sequence) {
    var counts = Object.create(null);
    sequence.forEach(function (id) {
      counts[id] = (counts[id] || 0) + 1;
    });
    return counts;
  }

  function phaseIndexForBeat(grammar, beat) {
    for (var i = 0; i < grammar.phases.length; i += 1) {
      if (grammar.phases[i].beats.indexOf(beat) !== -1) return i;
    }
    return -1;
  }

  /**
   * Structured grammar validation (Sprint 69 Phase 3).
   * Observational for dual validation; not runtime dispatch authority.
   *
   * @param {string} archetype
   * @param {Array<string|{function:string}>} beats
   * @returns {{
   *   valid: boolean,
   *   applicable: boolean,
   *   applicability: string,
   *   archetype: string,
   *   sequence: string[],
   *   violations: Array<{code:string,beat?:string,index?:number,groupId?:string,chainId?:string,detail?:string}>
   * }}
   */
  function validateSequenceAgainstGrammar(archetype, beats) {
    var archetypeKey = String(archetype || "");
    var sequence = normalizeBeatList(beats);
    var violations = [];

    function pushViolation(code, fields) {
      violations.push(Object.assign({ code: code }, fields || {}));
    }

    if (!archetypeKey) {
      return {
        valid: false,
        applicable: false,
        applicability: "UNKNOWN_ARCHETYPE",
        archetype: archetypeKey,
        sequence: sequence,
        violations: [{ code: "UNKNOWN_ARCHETYPE", detail: "missing archetype" }]
      };
    }

    var grammar = getArchetypeGrammar(archetypeKey);
    if (!grammar) {
      return {
        valid: false,
        applicable: false,
        applicability: "UNKNOWN_ARCHETYPE",
        archetype: archetypeKey,
        sequence: sequence,
        violations: [{ code: "UNKNOWN_ARCHETYPE", detail: archetypeKey }]
      };
    }

    if (!sequence.length) {
      return {
        valid: false,
        applicable: true,
        applicability: "APPLICABLE",
        archetype: archetypeKey,
        sequence: sequence,
        violations: [{ code: "EMPTY_SEQUENCE" }]
      };
    }

    var nonCanonical = [];
    sequence.forEach(function (id, index) {
      if (!vocabularyMod.FUNCTION_ENUM_SET[id]) {
        nonCanonical.push({ beat: id, index: index });
      }
    });
    if (nonCanonical.length) {
      nonCanonical.forEach(function (row) {
        pushViolation("NON_CANONICAL_BEAT", {
          beat: row.beat,
          index: row.index,
          detail: "compatibility or journey vocabulary; not FunctionEnum"
        });
      });
      return {
        valid: false,
        applicable: false,
        applicability: "NON_FUNCTION_ENUM_COMPATIBILITY_VOCABULARY",
        archetype: archetypeKey,
        sequence: sequence,
        violations: violations
      };
    }

    var allowedSet = Object.create(null);
    grammar.allowedBeats.forEach(function (id) {
      allowedSet[id] = true;
    });

    sequence.forEach(function (id, index) {
      if (!allowedSet[id]) {
        pushViolation("DISALLOWED_BEAT", { beat: id, index: index });
      }
    });

    grammar.requiredBeats.forEach(function (id) {
      if (sequence.indexOf(id) === -1) {
        pushViolation("MISSING_REQUIRED_BEAT", { beat: id });
      }
    });

    grammar.requiredGroups.forEach(function (group) {
      var hits = group.beats.filter(function (id) {
        return sequence.indexOf(id) !== -1;
      }).length;
      if (hits < group.min) {
        pushViolation("MISSING_REQUIRED_GROUP", {
          groupId: group.id,
          detail:
            "needs >= " + group.min + " of [" + group.beats.join(",") + "]"
        });
      }
    });

    var counts = countOccurrences(sequence);
    Object.keys(grammar.cardinality).forEach(function (id) {
      var rule = grammar.cardinality[id];
      var n = counts[id] || 0;
      if (n < rule.min || (rule.max != null && n > rule.max)) {
        pushViolation("CARDINALITY_VIOLATION", {
          beat: id,
          detail: "count=" + n + " min=" + rule.min + " max=" + rule.max
        });
      }
    });

    var lastPhase = -1;
    sequence.forEach(function (id, index) {
      var phase = phaseIndexForBeat(grammar, id);
      if (phase === -1) return;
      if (lastPhase !== -1 && phase < lastPhase) {
        pushViolation("PHASE_ORDER_VIOLATION", {
          beat: id,
          index: index,
          detail: "phase " + phase + " after phase " + lastPhase
        });
      }
      if (phase > lastPhase) lastPhase = phase;
    });

    grammar.precedes.forEach(function (pair) {
      var a = pair[0];
      var b = pair[1];
      var ia = sequence.indexOf(a);
      var ib = sequence.indexOf(b);
      if (ia !== -1 && ib !== -1 && ia > ib) {
        pushViolation("PRECEDES_VIOLATION", {
          beat: a,
          detail: a + " must appear before " + b
        });
      }
    });

    grammar.relativeOrderChains.forEach(function (chain) {
      var missing = chain.beats.some(function (id) {
        return sequence.indexOf(id) === -1;
      });
      if (missing) return;
      var positions = chain.beats.map(function (id) {
        return sequence.indexOf(id);
      });
      for (var i = 1; i < positions.length; i += 1) {
        if (positions[i] < positions[i - 1]) {
          pushViolation("RELATIVE_ORDER_CHAIN_VIOLATION", {
            chainId: chain.id,
            detail: chain.beats.join(",")
          });
          break;
        }
      }
    });

    var last = sequence[sequence.length - 1];
    if (grammar.terminal.allowedLast.indexOf(last) === -1) {
      pushViolation("TERMINAL_VIOLATION", { beat: last });
    }
    grammar.terminal.exclusiveLast.forEach(function (id) {
      var first = sequence.indexOf(id);
      if (first !== -1 && first !== sequence.length - 1) {
        pushViolation("EXCLUSIVE_LAST_VIOLATION", { beat: id });
      }
    });

    return {
      valid: violations.length === 0,
      applicable: true,
      applicability: "APPLICABLE",
      archetype: archetypeKey,
      sequence: sequence,
      violations: violations
    };
  }

  /**
   * Compatibility wrapper for Phase 2 contract tests.
   * @returns {{ ok: boolean, errors: string[] }}
   */
  function isSequenceRepresentable(archetype, beats) {
    var result = validateSequenceAgainstGrammar(archetype, beats);
    return {
      ok: result.valid && result.applicable,
      errors: (result.violations || []).map(function (row) {
        return (
          row.code +
          (row.beat ? ":" + row.beat : "") +
          (row.detail ? " " + row.detail : "")
        ).trim();
      })
    };
  }

  /**
   * Integrity of the grammar module itself (deterministic contract).
   * @returns {{ ok: boolean, errors: string[] }}
   */
  function assertGrammarIntegrity() {
    var errors = [];
    FROZEN_ARCHETYPES.forEach(function (id) {
      if (!ARCHETYPE_GRAMMAR[id]) {
        errors.push("missing grammar for frozen archetype: " + id);
      }
    });
    Object.keys(ARCHETYPE_GRAMMAR).forEach(function (archetype) {
      if (FROZEN_ARCHETYPES.indexOf(archetype) === -1) {
        errors.push("grammar defines unknown archetype: " + archetype);
      }
      var g = ARCHETYPE_GRAMMAR[archetype];
      if (g.archetype !== archetype) {
        errors.push("archetype key/id mismatch: " + archetype);
      }
      g.allowedBeats.forEach(function (beat) {
        if (!vocabularyMod.FUNCTION_ENUM_SET[beat]) {
          errors.push(archetype + " allowed beat not FunctionEnum: " + beat);
        }
      });
      g.requiredBeats.forEach(function (beat) {
        if (g.allowedBeats.indexOf(beat) === -1) {
          errors.push(archetype + " required beat not in allowed: " + beat);
        }
      });
      g.optionalBeats.forEach(function (beat) {
        if (g.allowedBeats.indexOf(beat) === -1) {
          errors.push(archetype + " optional beat not in allowed: " + beat);
        }
        if (g.requiredBeats.indexOf(beat) !== -1) {
          errors.push(archetype + " optional overlaps required: " + beat);
        }
      });
      Object.keys(g.cardinality).forEach(function (beat) {
        if (g.allowedBeats.indexOf(beat) === -1) {
          errors.push(archetype + " cardinality for non-allowed beat: " + beat);
        }
      });
      g.allowedBeats.forEach(function (beat) {
        if (!g.cardinality[beat]) {
          errors.push(archetype + " missing cardinality for: " + beat);
        }
        if (!g.roleExpectations[beat]) {
          errors.push(archetype + " missing role expectation for: " + beat);
        }
      });
      g.phases.forEach(function (phase) {
        phase.beats.forEach(function (beat) {
          if (g.allowedBeats.indexOf(beat) === -1) {
            errors.push(
              archetype + " phase " + phase.id + " references non-allowed: " + beat
            );
          }
        });
      });
      g.precedes.forEach(function (pair) {
        pair.forEach(function (beat) {
          if (g.allowedBeats.indexOf(beat) === -1) {
            errors.push(archetype + " precedes references non-allowed: " + beat);
          }
        });
      });
      g.terminal.allowedLast.forEach(function (beat) {
        if (g.allowedBeats.indexOf(beat) === -1) {
          errors.push(archetype + " terminal allowedLast non-allowed: " + beat);
        }
      });
      g.requiredGroups.forEach(function (group) {
        group.beats.forEach(function (beat) {
          if (g.allowedBeats.indexOf(beat) === -1) {
            errors.push(
              archetype + " required group " + group.id + " non-allowed: " + beat
            );
          }
        });
      });
    });
    return { ok: errors.length === 0, errors: errors };
  }

  // Fail closed on module load if grammar is internally inconsistent.
  (function bootIntegrity() {
    var check = assertGrammarIntegrity();
    if (!check.ok) {
      throw new Error(
        "episode-plan-v1-archetype-grammar integrity failure: " +
          check.errors.join("; ")
      );
    }
  })();

  return {
    GRAMMAR_VERSION: "S69-P2",
    FROZEN_ARCHETYPES: FROZEN_ARCHETYPES,
    DEFAULT_ROLE_BY_FUNCTION: DEFAULT_ROLE_BY_FUNCTION,
    RELATIVE_ORDER_CHAINS: RELATIVE_ORDER_CHAINS,
    ARCHETYPE_GRAMMAR: ARCHETYPE_GRAMMAR,
    listArchetypes: listArchetypes,
    isKnownArchetype: isKnownArchetype,
    getArchetypeGrammar: getArchetypeGrammar,
    validateSequenceAgainstGrammar: validateSequenceAgainstGrammar,
    isSequenceRepresentable: isSequenceRepresentable,
    assertGrammarIntegrity: assertGrammarIntegrity
  };
});
