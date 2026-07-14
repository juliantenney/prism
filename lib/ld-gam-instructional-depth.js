/**
 * LD-GAM-INSTRUCTIONAL-DEPTH — GAM material-body reasoning quality (Sprint 59 Iteration 7).
 * Scope: explanatory text, worked examples, and scenario bodies at Generate Activity Materials.
 * Focus: exemplars internalised (not leaked); subject-matter-first learner-facing prose.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_LD_GAM_INSTRUCTIONAL_DEPTH = api;
  }
})(
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this,
  function () {
    "use strict";

    var MODULE_ID = "LD-GAM-INSTRUCTIONAL-DEPTH";
    var MARKER = "LD-GAM-INSTRUCTIONAL-DEPTH-CONTRACT (auto-applied)";

    var CORE_LINES = [
      "",
      MARKER + ":",
      "- Module: " +
        MODULE_ID +
        " | GAM author role — exemplar-driven quality with no meta-instruction leakage (Sprint 59 Iteration 7).",
      "- Instructional principle: The strongest instructional materials do not merely state conclusions. They show learners how conclusions are reached.",
      "- Subject-matter-first principle: Generated instructional content should focus on the learner's understanding of the subject matter. The learner should encounter concepts, evidence, reasoning, decisions, consequences, and interpretation — not commentary about how the content was generated or evaluated.",
      "- Apply both principles across explanations, worked examples, methods, scenarios, and recommendations.",
      "- EXEMPLAR PURPOSE (read carefully): The weak-versus-better examples in this contract are INTERNAL GENERATION GUIDANCE for the model. They are NOT learner-facing content. Their purpose is to demonstrate desired characteristics of high-quality instructional materials. They should influence how content is written — they must not become part of the generated materials.",
      "- Internalise the behavioural patterns from the exemplars; write original subject-matter prose. Do not paste, paraphrase as \"weak vs stronger\", or narrate the contract examples to the learner.",
      "- INTERNAL FRAMEWORK ONLY: causal-stage terms (Cause, Mechanism, Immediate effect, Downstream consequence, Practical significance) and method-stage terms (What, How, Why, When, Limitation) guide your reasoning. They are NOT required learner-facing headings, sentence labels, or bullet tags.",
      "- Success condition (outcome-based): the explanation must allow a learner to reconstruct the complete reasoning from the initial condition to the practical consequence without inventing missing steps — including the intervening assumption, process, operation, or calculation.",
      "- Prefer connected natural prose. Prefer one complete explanation over several shallow restatements. Increase length only where instructional logic requires it.",
      "- Obey GAM-PRES-07/08/09 and LD-MATERIALS-COPY; retain anti-rubric-mimicry, intervening-process, method-operation, authentic-scenario, and worked-example comparison guidance from prior Sprint 59 iterations."
    ];

    var ANTI_LEAKAGE_LINES = [
      "",
      "ANTI-LEAKAGE — PROHIBIT META-INSTRUCTIONAL COMMENTARY (Iteration 7):",
      "- Generated materials must teach the subject matter. They must not discuss whether an explanation, recommendation, scenario, or answer is weak or strong; how instructional quality is evaluated; or why one prompt exemplar is better than another.",
      "- FORBIDDEN constructions in learner-facing bodies (unless the learning objective is itself about evaluating explanations/arguments/recommendations/reasoning quality):",
      "  • \"A weak explanation…\" / \"A stronger explanation…\" / \"A better explanation…\"",
      "  • \"A weak recommendation…\" / \"A stronger recommendation…\" / \"A better answer is…\"",
      "  • \"A weak scenario…\" / \"A stronger approach because it follows the reasoning chain…\"",
      "  • \"The preferred approach because it follows the reasoning chain…\" (meta about instruction quality)",
      "  • Narrating contract labels: \"Weak:\" / \"Better:\" / \"Why better:\" / \"Exemplar:\" as content for the learner",
      "",
      "CONVERT META COMMENTARY INTO DIRECT TEACHING:",
      "- Undesirable: \"A weak explanation jumps directly from heteroscedasticity to bad results.\"",
      "- Preferred: \"Heteroscedasticity affects the reliability of standard errors because changing variance can make uncertainty estimates less dependable.\"",
      "- Undesirable: \"A stronger recommendation links evidence to judgement.\"",
      "- Preferred: \"The recommendation is supported by residual-plot evidence, formal diagnostic results and the need for reliable inference.\"",
      "- Guidance: whenever tempted to discuss explanation quality, recommendation quality, or reasoning-quality labels, write direct subject-matter instruction instead.",
      "",
      "DOMAIN COMPARISON REMAINS DESIRABLE (do not over-suppress):",
      "- Still write comparisons of interpretations, competing explanations, methods, remedies, and evidence — that is subject-matter reasoning.",
      "- The ban applies only to meta-commentary about instructional/prompt quality, not to evaluating domain alternatives (e.g. heteroscedasticity vs random variation as accounts of the plot)."
    ];

    var ANTI_GAMING_LINES = [
      "",
      "ANTI-GAMING — DO NOT EMIT RUBRIC LABELS (retain Iteration 4):",
      "- Do not write learner-facing text that begins stages with labels such as \"Cause:\", \"Mechanism:\", \"Immediate effect:\", \"Downstream consequence:\", \"Practical significance:\", \"What:\", \"How:\", \"Why:\", \"When:\", or \"Limitation:\".",
      "- Also forbid equivalent bullet lists or headings that merely rename those same stages.",
      "- FORBIDDEN rubric-labelled compression: \"Cause: changing residual variance. Mechanism: standard errors become less dependable. Immediate effect: confidence intervals may be distorted.\"",
      "- Why that pattern fails (internal note only — do not write \"why weak\" framing in materials): it names stages without teaching how one produces the next."
    ];

    var PRINCIPLE_AND_EXPLANATION_EXEMPLARS = [
      "",
      "INTERNAL EXEMPLAR PAIR — EXPLANATORY REASONING (generation guidance only — do not surface as learner content):",
      "- Weak: \"Heteroscedasticity can make statistical inference less reliable.\"",
      "- Better: \"Heteroscedasticity changes the spread of residuals across observations. Standard-error calculations assume a particular variance structure. When that structure is violated, estimated uncertainty may become inaccurate. Confidence intervals and significance tests depend on those uncertainty estimates, so conclusions about evidence can become less reliable.\"",
      "- Pattern to internalise: explains the mechanism; exposes intermediate reasoning; lets the learner reconstruct the chain independently.",
      "- Guidance: when explaining concepts, avoid jumping from condition to consequence. Explain the process, assumption, calculation or mechanism that transmits the effect.",
      "",
      "Additional intervening-process calibration (retain Iteration 5 pattern; internal only):",
      "- Still incomplete: \"When residual variance changes, assumptions supporting standard errors may not hold, so inference becomes less reliable.\" — mentions an assumption but not how the problem is transmitted.",
      "- Complete transmission: \"Conventional OLS standard-error calculations are derived under the assumption that error variance is constant. When error variance changes across observations, the usual calculation can estimate coefficient uncertainty inaccurately. Confidence intervals and significance tests are built from that uncertainty estimate, so they can overstate or understate the strength of the evidence.\"",
      "",
      "DOMAIN-NEUTRAL TRANSFER (internal only — same behaviour, different subjects):",
      "- Scientific — weak: \"Higher temperature speeds up the reaction.\" Better: \"Increasing temperature gives particles more kinetic energy, so they move faster and collide more frequently. A larger proportion of those collisions also have enough energy to overcome the activation threshold. More successful collisions occur per second, which increases the reaction rate.\"",
      "- Organisational — weak: \"Unclear responsibilities cause project delays.\" Better: \"When responsibilities are unclear, team members may assume that someone else owns a task or may duplicate work already being completed elsewhere. Decisions and hand-offs are then delayed while ownership is clarified. Dependent tasks cannot begin on time, causing the overall schedule to slip.\""
    ];

    var METHOD_EXEMPLARS = [
      "",
      "INTERNAL EXEMPLAR PAIR — METHOD INSTRUCTION (generation guidance only — do not surface as learner content):",
      "- Weak: \"Residual plots help identify heteroscedasticity.\"",
      "- Better: \"A residual plot compares prediction errors with fitted values. Researchers examine whether the spread of those errors remains stable across the plot. A widening or narrowing pattern suggests changing variance. The plot provides useful visual evidence, although some patterns may reflect non-linearity rather than heteroscedasticity.\"",
      "- Pattern to internalise: what the method examines; what evidence is produced; how that evidence supports judgement; a meaningful limitation.",
      "- Guidance: method descriptions should teach operation and interpretation, not merely purpose.",
      "",
      "Additional method calibration (internal only):",
      "- Purpose slogan: \"Robust standard errors improve inference when heteroscedasticity exists.\"",
      "- Operation + limit: \"Robust standard errors adjust the estimated uncertainty around regression coefficients without changing the coefficient estimates themselves. They use a variance calculation that does not require error variance to remain constant, making confidence intervals and significance tests more dependable when heteroscedasticity is present. They improve inference, but they do not remove the underlying variance pattern or correct other forms of model misspecification.\"",
      "- Where relevant for appropriate use, teach in connected prose what input is examined, what operation is performed, how the output supports judgement, what is/isn't fixed, and one meaningful limitation — without What:/How:/Why: labels and without mechanically listing every element every time."
    ];

    var SCENARIO_EXEMPLARS = [
      "",
      "INTERNAL EXEMPLAR PAIR — SCENARIO CONSTRUCTION (generation guidance only — do not surface as learner content):",
      "- Weak: \"A researcher observes increasing residual variance and must decide what to do.\"",
      "- Better: \"Maya is evaluating a household spending model using 2,000 observations. Residual spread increases from approximately £25 among lower-income households to more than £300 among higher-income households. Several policy conclusions depend on whether the estimated income effect is statistically significant. Maya must decide whether the visual evidence is sufficient, whether a formal diagnostic should be run, and whether robust standard errors or model transformation provides the stronger response.\"",
      "- Pattern to internalise: evidence; context; a decision; consequences; a realistic judgement task.",
      "- Guidance: scenarios should provide evidence to reason about rather than merely announcing that evidence exists. Write the case itself — do not introduce it as \"a stronger scenario\" or \"a better case\".",
      "",
      "Also incomplete vs the Maya pattern: \"A researcher sees an expanding funnel in a residual plot and must choose a remedy.\" — evidence named but not supplied; little stakes or ambiguity.",
      "- Where appropriate include: named actor/role; purpose of the work; background; concrete figures/documents/observations; decision; stakes; ambiguity or constraint. Include only details that affect interpretation or judgement."
    ];

    var COMPARATIVE_EXEMPLARS = [
      "",
      "INTERNAL EXEMPLAR PAIR — COMPARATIVE DOMAIN REASONING in worked examples (generation guidance only; preserve Iteration 2):",
      "- Incomplete: \"The plot suggests heteroscedasticity.\"",
      "- Complete domain comparison: \"One interpretation is that residual variance increases as fitted values increase. A competing interpretation is that the pattern reflects random variation. Random variation would normally produce a more uniform spread, whereas the observed pattern widens consistently across the plot. The changing-variance explanation therefore provides a stronger account of the evidence.\"",
      "- Pattern to internalise: evaluates domain alternatives; compares evidence; justifies the preferred interpretation — written as subject-matter reasoning, not as \"a stronger explanation would…\".",
      "- Guidance: worked examples should demonstrate how competing explanations are evaluated, not merely mention that alternatives exist. Do not frame the write-up as commentary on explanation quality.",
      "",
      "REQUIRED COMPARATIVE MOVES (retain — do not weaken for other foci):",
      "  1. Identify relevant evidence.",
      "  2. Explain why the evidence matters.",
      "  3. Consider a plausible competing interpretation (not a trivial redescription).",
      "  4. Compare the interpretations.",
      "  5. Reach and justify a preferred conclusion.",
      "- FORBIDDEN fillers: \"alternative\" that only restates the observation; Observe→Interpret→Conclude skeletons without comparison; empty \"reasoning\" labels; rubric-labelled causal dumps; meta-labels such as \"weak explanation\" / \"stronger explanation\" around those moves."
    ];

    var BRIEF_REMINDERS = [
      "",
      "BRIEF REMINDERS (do not expand into new mandatory output sections):",
      "- Explanations: teach intervening process in connected prose; learner reconstructs the chain without inventing missing steps.",
      "- Methods: operation and interpretation over purpose slogans.",
      "- Scenarios: authentic evidence-based situations with decision pressure — not exercise prompts.",
      "- Worked examples: show evaluation of competing domain explanations as in the comparative exemplar pair.",
      "- Anti-verbosity: one complete explanation beats several shallow restatements; no artificial headings; no textbook expansion.",
      "- Anti-leakage: never tell the learner that something is a weak/strong explanation or recommendation — just teach the better substance directly."
    ];

    function buildGamInstructionalDepthPromptBlock(options) {
      var opts = options && typeof options === "object" ? options : {};
      var includeMarker = opts.includeMarker !== false;
      return CORE_LINES.concat(
        ANTI_LEAKAGE_LINES,
        ANTI_GAMING_LINES,
        PRINCIPLE_AND_EXPLANATION_EXEMPLARS,
        METHOD_EXEMPLARS,
        SCENARIO_EXEMPLARS,
        COMPARATIVE_EXEMPLARS,
        BRIEF_REMINDERS
      )
        .slice(includeMarker ? 0 : 2)
        .join("\n");
    }

    function markerRegex() {
      return /LD-GAM-INSTRUCTIONAL-DEPTH-CONTRACT \(auto-applied\)/i;
    }

    function instructionalDepthAlreadyPresent(draftText) {
      return markerRegex().test(String(draftText || ""));
    }

    function applyLdGamInstructionalDepthContractToDraft(draftText, context) {
      var draftBody = String(draftText || "").trim();
      if (instructionalDepthAlreadyPresent(draftBody)) {
        return draftBody;
      }
      if (!context || !context.isGenerateActivityMaterialsStep) {
        return draftBody;
      }
      return (draftBody + buildGamInstructionalDepthPromptBlock({ includeMarker: true })).trim();
    }

    return {
      MODULE_ID: MODULE_ID,
      MARKER: MARKER,
      buildGamInstructionalDepthPromptBlock: buildGamInstructionalDepthPromptBlock,
      markerRegex: markerRegex,
      instructionalDepthAlreadyPresent: instructionalDepthAlreadyPresent,
      applyLdGamInstructionalDepthContractToDraft: applyLdGamInstructionalDepthContractToDraft
    };
  }
);
