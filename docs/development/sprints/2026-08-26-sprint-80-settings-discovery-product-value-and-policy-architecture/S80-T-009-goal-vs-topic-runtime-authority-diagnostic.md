# S80-T-009 — Goal vs Topic runtime-authority diagnostic

**Status:** COMPLETE — discovery only, no product decision recorded
**Type:** DIAGNOSTIC. No production code, tests, registry, prompts or elicitation changed.
**Basis:** S80-T-006 (decided), S80-T-007 (accepted), S1/S2/S3/S4 (accepted)

---

## 1. Executive conclusion

Three findings dominate, and two of them were not anticipated by the hypothesis.

**A. Goal is already an author-editable post-Create field, and it is already
producing contradictory prompts.** `#workflowGoal` ("Goal / outcome (learner-facing
run)") sits in the workflow detail form, is editable in Edit mode, and writes
straight to `wf.workflowOutputSpec.goal` on Save (`app.js:32822`). The question is
therefore not "should we add a runtime Goal" but "should we bring the runtime Goal
we already have under the Adjustments authority model". Demonstrated empirically
below: editing Goal to Elizabeth I while Topic remains commissioned yields a step-1
prompt containing `Goal: Create an introductory resource on Elizabeth I.` **and**
`Topic: Henry VIII` simultaneously, with no supersession. That is a live defect
today, independent of any Goal decision.

**B. Goal is not inert prose. It already has non-text runtime effects.** The
deterministic extractor `extractWorkflowBriefExplicitFactors` **re-runs at Run time**
over the current, edited Goal (`app.js:8415`), and its output feeds pedagogic
cognition pack and contract selection (`app.js:8437-8444`). It also seeds the
learner page title (`app.js:11824`). So the proposed semantic contract in §8 —
"changing Goal does not reinterpret the prose into typed parameters" — is **false as
written today**.

**C. Topic cannot be replaced by Goal, and the reason is concrete.** Deterministically
re-deriving a subject from Goal prose produces garbage. From the commissioned goal
*"Create a 60-minute self-study resource on Henry VIII with 10 formative assessment
questions."* the extractor derives:

```
topic = "henry viii with 10 formative assessment questions"
```

Whereas the commissioned `resolvedFactors.topic` is the clean `"Henry VIII"`. Any
architecture that derives Topic from a runtime Goal without AI inherits that
garbage — and Topic's value is projected into every model-driven prompt. Separately,
the page title today takes the Goal prose **verbatim**, so a rich Goal produces a
learner page titled *"Create a 60-minute self-study resource on Henry VIII with 10
formative assessment questions."*

Consequently Goal and Topic are **not** substitutes. Goal is workflow-wide intent
prose; Topic is a concise, projectable, title-capable subject label. The evidence
supports exposing **both**, with runtime Goal brought under the registry so it gains
Auto semantics, provenance and supersession — but that is an operator decision and is
not recorded here.

---

## 2. Goal field origin

Three distinct "goal" inputs exist. Only the second and third are relevant.

| Field | id | Role | Relevant? |
| --- | --- | --- | --- |
| Prompt Studio "Goal / outcome" | `#promptGoal` (`index.html:296-300`) | Prompt refinement brief | No — unrelated feature |
| Create "What should this cover?" | `#wfDesignIntent` (`index.html:830-834`) | **Commissioning prose** — the compiler input | Yes |
| Workflow detail "Goal / outcome (learner-facing run)" | `#workflowGoal` (`index.html:1180-1189`) | **Durable, author-editable runtime Goal** | Yes |

Create pipeline for `#wfDesignIntent`:

```
#wfDesignIntent
  -> buildWorkflowDesignBase (app.js:21452-21453) => base.goal + base.designIntent
  -> composeLdCreateDesignIntent (app.js:18747-18757, called 21826-21828)   [product-type prefix]
  -> extractWorkflowBriefExplicitFactors (app.js:19148-19584)               [DETERMINISTIC REGEX]
  -> applyWorkflowBriefInferenceRules (app.js:19586-19614)                  [config keyword rules]
  -> callOpenAIForWorkflowIntentInterpretation (app.js:20704-20767)         [AI, weakest tier]
  -> resolveWorkflowBriefFactors (app.js:22000)                             [tiered merge]
  -> callOpenAIForWorkflowDesign (app.js:21577) + pruning/injection (24173-24328)
  -> persisted: workflowOutputSpec.goal (36358), workflowBriefResolution (36392),
     materialised steps with frozen override_prompt_body (36240-36355)
```

**Precedence inside Create, verified at `app.js:21988` and `22000`:**

> `extractWorkflowBriefExplicitFactors` regex output (explicit tier)
> **>** user's elicitation answers
> **>** `applyWorkflowBriefInferenceRules` keyword rules
> **>** AI factors
> **>** config defaults

The AI is the second-weakest source. `Object.assign({}, aiFactors, ruleInferredValues)`
puts the deterministic rules last, so they overwrite the AI on every shared key, and
the regex "explicit" tier outranks both. This matters for the whole diagnostic: the
Create interpretation of Goal prose is overwhelmingly **deterministic**, not AI.

Note the label mismatch: the "explicit" tier is not author-explicit for most keys — it
is regex output over free prose.

---

## 3–4. Create-time Goal influence map

~35 factor keys are influenced by the prose. Full detail is in
[the factor trace](#21-files-inspected); the summary that matters here:

| Classification | Keys |
| --- | --- |
| DIRECT_COPY of prose | `design_intent`; the prose itself into `workflowOutputSpec.goal` and seeded step prompt bodies |
| DETERMINISTIC_DERIVATION (regex over prose) | `topic`, `workshop_subject`, `duration_minutes`, `delivery_mode`, `delivery_context`, `assessment_required`, `assessment_total_items`, `assessment_type`, `assessment_interaction_mode`, `misconception_assessment_link`, `include_answers`, `include_feedback_guidance`, `feedback_required`, `feedback_timing`, `learner_answer_visibility`, `session_materials`, `learning_environments`, `design_scope`, `learner_level`, `input_strategy`, `page_profile`, `activities_required`, `materials_required`, `objective_type`, `output_depth`, `peer_instruction_phase`, `reasoning_revision_required`, `misconception_reconciliation_required`, `productive_uncertainty_required`, `adaptive_scaffolding_required`, `cognitive_engagement_required` |
| DIRECT_COPY from *other* Create fields (not prose) | `audience`, `scope_scale`, `desired_outputs`, `delivery_pattern` |
| AI_INFERENCE | any config-declared factor not set by the rules above; dropped below 0.45 confidence (`app.js:20811`) |
| RELEVANCE_GATING | `topic`/`subject`/`domain`/`design_scope` gate the confirmation follow-up (`app.js:20933-21019`) |
| TOPOLOGY_EFFECT | see below |
| NO_PROVEN_EFFECT | no second duration key exists in the brief pipeline |

Representative deterministic rules (these are the ones a runtime Goal would silently
re-trigger):

```19200:19204:app.js
    var durationMatch = blob.match(/(\d{1,3})\s*(?:minutes?|mins?|min)\b/i);
    if (durationMatch && durationMatch[1]) {
      var minutes = Number(durationMatch[1]);
      if (isFinite(minutes) && minutes > 0) out.duration_minutes = minutes;
    }
```

```19491:19502:app.js
```
(subject/topic regex — the rule that produced the garbage topic in §1C)

Topology, decided **only** during Create:

| Factor | Topology effect | Line |
| --- | --- | --- |
| `assessment_required === false` | REMOVES Generate Assessment Items, Design Assessment, Design Marking Rubric | `24252-24261` |
| `assessment_required === true` / `assessment_total_items > 0` | PROTECTS the Generate Assessment Items closure; REMOVES Validate Learning Design and Design Assessment | `24210-24215`, `24262-24275` |
| `activities_required === true` | PROTECTS Design Episode Plan + Design Learning Activities | `24216-24225` |
| `session_materials` | ADDS Design Page / Generate Slide Deck / Generate VLE Structure | `23389-23421` |
| `delivery_context === "self_directed"` + timed/self-study cue + assessment intent | INJECTS DLA, GAM, Design Page | `24173-24201` |
| `feedback_timing` / `learner_answer_visibility` | PROTECTS or REMOVES Design Feedback | `24226-24231`, `24249-24251` |
| lean/formative assessment intent | REMOVES up to 8 upstream steps | `24297-24326` |

The code even declares its own graph-affecting set: `input_strategy`, `design_scope`,
`assessment_required`, `session_materials`, `learning_environments`
(`app.js:21436-21446`).

---

## 5. Durable Goal storage map

| Path | Written by | Verbatim? | Frozen? | Editable post-Create? | Survives save/dup/export |
| --- | --- | --- | --- | --- | --- |
| `wf.workflowOutputSpec.goal` | Create `36358`; **Save `32822`** | trim only | **No** | **Yes — `#workflowGoal`, Edit mode** | yes / yes / yes |
| `wf.workflowBriefResolution.initialBrief.goal` | `21948`, `22018`, `36392` | trim only | **Yes** | No UI | yes / yes / yes |
| `wf.workflowBriefResolution.initialBrief.designIntent` | same | trim only | **Yes** | No UI | yes / yes / yes |
| `wf.workflowBriefResolution.resolvedFactors.*` | `22022`/`22074`, persisted `36392` | factors, not prose | **Yes** | No UI | yes / yes / yes |
| `wf.goal` | **never written** | n/a | n/a | no | import-only ghost; read as fallback at 7 sites |
| `wf.base.goal` | transient only (`8409-8414`) | n/a | n/a | n/a | not persisted |
| `wf.description` | legacy import | migrated into `workflowOutputSpec.goal` then deleted (`35409-35413`) | n/a | no | deleted |

Two structural notes:

- **`initialBrief` is durable but dead.** Written, saved, duplicated, exported — and
  never read. It silently diverges from the editable `workflowOutputSpec.goal` the
  moment an author edits the textarea. It is the only record of the *original*
  commissioning prose, so it is the natural home for a commissioning/runtime split.
- Save explicitly deep-copies the pre-existing resolution back over the draft
  (`app.js:33110-33112`), which is why editing `#workflowGoal` cannot touch
  `resolvedFactors`.

Adjustments never reads or writes any Goal field. The registry is a hard allowlist
containing `topic` only (`app.js:34910-34930`). Its sole Goal interaction is
read-side suppression (§9).

---

## 6. Live Run Goal consumers

| # | Consumer | Reaches copied prompt? | Steps | Non-text effect? |
| --- | --- | --- | --- | --- |
| G1 | `buildWorkflowRuntimeContextText` (`33372-33417`), invoked `32222` | **Yes** — `Goal: …` line | **step 1 only**, Run mode only | no |
| G2 | `resolvePedagogicCognitionBriefContextForPrompt` (`8396-8452`) | no (selects blocks) | many | **Yes — cognition packs + contract** |
| G3 | `resolveWorkflowBriefContextForPageComposition` (`49893-49968`) | no | assembly | **Yes** |
| G4 | `buildPageShellOptionsFromWorkflow` (`11805-11834`, goal at `11824`) | no | derivation | **Yes — becomes the page title** |
| G6 | `buildWorkflowStepPromptAugmentContextFromStep` (`16110-16148`) | no (gates blocks) | many; **bypassed for GAM V2** (`33875-33883`) | **Yes** |
| G7 | GAM/DLA capture-time sanitise contexts (`25938-25956`, `26153-26155`) | no | capture | **Yes — mutates stored artefacts** |
| G8 | `buildDlaCanonicalSlotContext` (`10489-10539`) | no (selects overlay) | DLA | **Yes** |
| G9 | self-directed sanitise/qualify predicates (`15758-15917`, `16150-16179`) | no | many | **Yes** |
| G11 | Run-mode summary header (`27193-27212`) | no (screen) | header | no |
| G13 | `buildWorkflowSummaryText` (`33291-33297`) | summary artefact only | n/a | no |
| G17 | `lib/ld-guided-learning-scaffold.js:412`, `765-766` | **artefact prose** — goal's first sentence becomes a topic-phrase fallback | many | **Yes** |
| G10 | `syntheticCtx.workflowGoal` carriers (`31588`, `33519`) | no | n/a | **LIVE call, INERT** — never printed or branched |
| G5/G16 | Sprint 59 archetype lab gate (`9997-10060`, `lib/ld-instructional-archetype.js:602-627`) | no | n/a | **LEGACY** — regression-only |
| G15 | `initialBrief.goal` | — | — | **DEAD** — no reader |

The mechanism behind G2 is important and is **additive-only**:

```7746:7752:app.js
  function workflowBriefCognitionFactorIsTrue(resolved, explicit, factorId) {
    var id = String(factorId || "").trim();
    if (!id) return false;
    var r = resolved && typeof resolved === "object" ? resolved : {};
    var e = explicit && typeof explicit === "object" ? explicit : {};
    return r[id] === true || e[id] === true;
  }
```

Frozen `resolved` is OR'd with live goal-derived `explicit`. So editing Goal can
**add** a pedagogic pack but can never **remove** one the frozen state asserts.

---

## 7. Live Run Topic consumers

| # | Consumer | Reaches copied prompt? | Steps | Non-text effect? |
| --- | --- | --- | --- | --- |
| T1 | `resolveCommissionedWorkflowTopic` (`34897-34905`) | indirect | n/a | no |
| T2 | `resolveEffectiveRunContext` (`35195-35228`) + declaration (`34910-34930`) | indirect | n/a | no; deterministic, no model call |
| T3 | shared projector `buildEffectiveWorkflowContextLines/Block/append` (`33575-33639`) | **Yes** — `Topic: …` under an authority heading | n/a | no |
| T4a | I1 `buildWorkflowStepInstructions` (`33905-33912`) | **Yes** | **every eligible step** (all but Episode Plan) | no |
| T4b | I2 `buildLiveGamV2CopyPromptViaCanonicalAssembler` (`33833-33835`) | **Yes** | GAM | no |
| T5 | `getSupersededCommissionedContextFields` (`33619-33629`) + `supersedesCommissionedContextFields:["goal"]` (`34928`) | Yes, **by omission** | step 1 | **Yes — deletes the commissioned Goal line** |
| T6 | Adjustments UI (`3328-3410`) | no (screen) | n/a | writes only the adjustment store |
| T7 | `workflowBriefReadTopicFactorValue` / weak-topic gate (`17675-17708`) | no | n/a | branch — **Create-time only, not a Run consumer** |
| T10 | page/artefact title from Topic | — | — | **No evidence found** — the title seed is Goal-based (G4) |
| T11/T12 | canonical DLA / GAM reading topic | — | — | **No evidence found** — Topic only reaches GAM via T4b, appended after assembly |
| T13 | deterministic non-prompt Run consumer of Topic | — | — | **No evidence found** |

---

## 8. Goal ↔ Topic relationship

The architecture is a **mixture, and it differs by path**:

| Path | Relationship |
| --- | --- |
| Create | **Topic is deterministically extracted from Goal prose** (`19491-19520`), then reconciled against uploaded source (`19048-19091`) and normalised (`20844-20920`). Goal *contains* Topic. |
| Persistence | **Independent.** `workflowOutputSpec.goal` is live and editable; `resolvedFactors.topic` is frozen. Nothing keeps them consistent. |
| Run — text | **Independent and potentially contradictory.** Goal prints on step 1; Topic prints on every eligible step. |
| Run — behaviour | **Goal only.** Cognition packs, page title, scaffold selection all read Goal; nothing reads Topic. |
| Adjustments | **Topic only.** Goal is not a parameter; Topic's provenance can delete Goal's projection. |

The hypothesis's example is exactly the case the architecture *should* support and
today handles badly. Commissioned Goal:

> "Create an introductory resource on Henry VIII focusing on the break with Rome"

Create would resolve `topic ≈ "Henry VIII"` (subject label) while the Goal retains
"introductory" and "focusing on the break with Rome" — purpose and emphasis that
Topic structurally cannot represent. Both are genuinely useful, and only Goal carries
the second half.

---

## 9. S4 Goal-suppression assessment

Traced and confirmed working as designed:

```33383:33389:app.js
    var supersededFields = getSupersededCommissionedContextFields(wf);
    if (name) lines.push("Workflow: " + name);
    var goalText = suppressAssessmentCues
      ? sanitizeAssessmentCuesForUpstreamContext(outputSpec.goal)
      : outputSpec.goal;
    if (supersededFields.goal) goalText = "";
    if (goalText) lines.push("Goal: " + goalText);
```

**What it successfully removes:** the entire stale subject assertion. Probe scenario C
(Topic adjusted to Elizabeth I, Goal untouched) produced a step-1 context with no
`Goal:` line at all, and `Henry VIII` absent from every prompt while `Elizabeth I` was
present as the authoritative Topic. No contradiction survives.

**What is lost:** everything else the Goal prose carried. In the probe the suppressed
line was *"Create a 60-minute self-study resource on Henry VIII with 10 formative
assessment questions."* — so the omission also dropped the resource type
("self-study resource"), the duration signal ("60-minute") and the assessment
intent ("10 formative assessment questions").

**Is that information represented elsewhere in the prompt?** Partly, and unreliably:

- Duration: **no**. `duration_minutes` is frozen in `resolvedFactors` and is not
  projected into prompts (no `workflowContext` declaration exists for it — that is S5).
- Assessment quantity: **no**. The probe's assessment step prompt did not contain the
  count.
- Resource type / self-study framing: **indirectly yes** — it survives *behaviourally*
  through the goal-driven cognition/scaffold selection (G2, G6, G8, G9), which still
  reads the unsuppressed stored `workflowOutputSpec.goal`. The prompt loses the words
  but keeps the consequences.
- Purpose/emphasis prose ("focusing on the break with Rome", "establishes concepts
  needed for a later resource"): **no**. Nothing else represents it. Downstream stages
  do not recover it from upstream artefacts, because it never entered an artefact.

**Classification: C — materially lossy**, but narrowly and defensibly so. It is lossy
specifically for *purpose and emphasis prose*, which is the exact expressive gap the
Goal hypothesis is trying to close. The loss is a direct consequence of Topic being a
subject label asked to supersede a whole sentence.

This is evidence *for* the Goal hypothesis, not against it: the cleanest way to stop
losing purpose prose is for the superseding parameter to itself be able to carry
purpose prose.

---

## 10. Runtime-Goal semantic-contract assessment

Proposed contract:

> "Goal is the current author-supplied description of what this run of the saved
> workflow should produce. Changing Goal after Create changes model-visible runtime
> commissioning context, but does NOT rerun elicitation, recompute resolvedFactors,
> change workflow topology, add/remove stages, or reinterpret the prose into typed
> parameters."

Clause-by-clause against current code:

| Clause | Verdict | Evidence |
| --- | --- | --- |
| changes model-visible runtime context | **TRUE** | G1; probe scenario B changed the step-1 `Goal:` line |
| does not rerun elicitation | **TRUE** | `callOpenAIForWorkflowIntentInterpretation` has exactly one call site (`21978`), inside the Create action only |
| does not recompute `resolvedFactors` | **TRUE** | `8419-8425` / `49943-49949` short-circuit to the stored value whenever it exists; Save deep-copies it forward (`33110-33112`) |
| does not change topology / add or remove stages | **TRUE** | steps are materialised and frozen at save (`36240-36355`); pruning/injection (`24173-24328`) is Create-only |
| **does not reinterpret the prose into typed parameters** | **FALSE** | `extractWorkflowBriefExplicitFactors` re-runs at Run time on the live goal (`8415`, `49939`) and the result feeds cognition pack + contract selection (`8437-8444`) |

There is also a sixth, unstated effect the contract would need to cover: changing Goal
changes the **learner page title** (`11824`).

**Classification: C — misleading without re-resolution**, but only because of two
bounded leaks. Four of the five clauses are already true and structurally guaranteed
by the freeze-at-save design. The contract becomes **B (truthful with a small bounded
projection change)** if two things are addressed:

1. the Run-time re-extraction is either scoped to the *commissioning* goal
   (`initialBrief.goal`, which is frozen and currently dead) rather than the live one,
   or the effect is made explicit rather than silent;
2. the page title stops falling back to raw Goal prose.

Neither is a large change, and note that **leak 1 exists today** regardless of whether
Goal becomes an Adjustment — the field is already editable.

---

## 11. Frozen-factor contradiction matrix

Scenario: commissioned *"Create a 60-minute self-study resource on Henry VIII with 10
formative assessment questions"* → runtime Goal *"Create an introductory resource on
Elizabeth I"*. Probe-verified frozen values in the right column.

| Factor | Frozen value | Classification | Why |
| --- | --- | --- | --- |
| `topic` | `"Henry VIII"` | **HARD_CONFLICT** | Probe scenario B: prompt asserts `Goal: … Elizabeth I` and `Topic: Henry VIII` in the same step-1 text, and downstream steps receive `Henry VIII` only. Unmitigated today. |
| `duration_minutes` | `60` | POTENTIAL_CONFLICT | "introductory" implies shorter; frozen 60 is not projected into prompts at all, so the conflict is invisible rather than resolved. Becomes visible when S5 ships Duration. |
| `delivery_context` / `delivery_mode` | `self_directed` / `async` | POTENTIAL_CONFLICT | New Goal is silent on delivery, so nothing contradicts; but goal-driven self-study scaffolds (G9) still fire off the *stored* goal, which no longer says self-study. |
| assessment topology (steps present) | Design Assessment + Generate Assessment Items materialised | **SAFE** | Topology is frozen at save; a runtime Goal cannot remove a stage. Structurally honest. |
| `assessment_total_items` | `10` | POTENTIAL_CONFLICT | New Goal omits the count; frozen 10 remains authoritative but is not projected, so the model is not told either number. |
| `assessment_type` | `mcq` | SAFE | Not contradicted by the new Goal. |
| `input_strategy` | `generate_from_topic` | **SAFE** | Both goals are generate-from-topic. Would be HARD_CONFLICT if the workflow were built around supplied source material and the new Goal implied generation (see §12). |
| `page_profile` | `learner` | SAFE | Unchanged intent. |
| `learner_level` | `undergraduate` | POTENTIAL_CONFLICT | A Goal naming a different audience would contradict a frozen level with no resolution mechanism until S6. |
| `session_materials` | `["page"]` | SAFE | Delivery steps already materialised. |
| `design_scope` | `session` | POTENTIAL_CONFLICT | "introductory" may imply narrower scope; frozen and unprojected. |
| page title | derived | **HARD_CONFLICT (already broken)** | Probe: title changed to *"Create an introductory resource on Elizabeth I."* — i.e. a sentence, not a title. |
| cognition packs | recomputed additively | POTENTIAL_CONFLICT | OR semantics (`7746-7752`) mean packs earned by the *old* goal persist while the new goal can only add more. |

**Only one true HARD_CONFLICT arises from the Goal hypothesis itself (`topic`), and it
already exists today.** The frozen-factor design is more robust than expected because
topology is materialised at save, which is what makes the §12 boundary hold.

---

## 12. Typed-parameter precedence assessment

Proposed: `typed parameters > Goal prose > Additional Instruction > stage discretion`.

The existing architecture **can express this without AI conflict detection**, because
precedence is already positional and textual rather than semantic:

1. `buildEffectiveWorkflowContextBlock` emits typed parameters under
   `"Authoritative workflow parameters for this run:"` with an explicit supersession
   sentence (`app.js:33603`, asserted ≤ 5 lines).
2. `buildStepAdditionalInstructionBlock` emits the subordinate block declaring itself
   subordinate to "explicit workflow parameters" among others.
3. S2 already guarantees the typed block precedes the subordinate block, and S4 tests
   assert it.

A Goal tier inserts cleanly between them: a `Goal:`-style line rendered *after* the
typed parameter block and *before* the Additional Instruction block, with wording that
subordinates it to typed parameters. No new mechanism is required.

Two caveats the wording must handle honestly:

- **Prose can contradict a typed value in ways structure cannot detect.** Goal "for
  first-year undergraduates" vs typed Audience "Postgraduate" is a real contradiction
  the prompt can only *declare* resolved, not actually resolve. This is the same
  accepted limitation as Additional Instruction, but the risk is higher because Goal
  reads like an authoritative commission rather than optional steering.
- **The supersession mechanism currently points the wrong way for Goal.** Today Topic
  suppresses Goal (`supersedesCommissionedContextFields`). If Goal becomes a runtime
  parameter, the thing that should be suppressed is the *commissioned* goal, not the
  author's current one — so the declaration would need to distinguish commissioned
  from effective Goal. `initialBrief.goal` (frozen, currently dead) already provides
  the commissioned half.

---

## 13. Assessment stress test

**Case A — assessment-capable workflow, Goal no longer mentions assessment.**
Answer **A: topology stays intact.** Verified: steps are materialised at save
(`36240-36355`) and the pruning filter (`24242-24328`) is unreachable from any Run
path. The probe's Generate Assessment Items step remained present and assembled
normally with the Elizabeth I goal. The workflow is not structurally dishonest — it
remains an assessment-producing workflow whose assessment is now about Elizabeth I.

The mismatch is cosmetic-but-real: a user reading only their new Goal may be surprised
to receive assessment items. That is a UI-honesty problem, not an architecture problem.

**Case B — workflow WITHOUT assessment stages, Goal asks for 10 formative questions.**
Answer: **the questions cannot exist, and this is architecturally guaranteed.** Three
independent reasons:

1. no assessment step exists to run, and Goal cannot add one (topology frozen);
2. the Goal prose reaches prompts only as context, and no non-assessment step's output
   contract permits emitting assessment items;
3. `sanitizeAssessmentCuesForUpstreamContext` (`33379`, `33385-33387`) actively strips
   assessment cues from upstream-step context. The probe shows this firing — step 1
   carried `"Step boundary: For this upstream step, do not generate assessment
   items/questions/options/model answers yet."` even in the commissioned case.

So PRISM already defends against exactly this. The honest failure mode is silent
non-delivery: the author asks and simply does not receive, with no explanation.

**Boundary this defines:** Goal is *runtime intent*, and topology materialisation at
save is the hard wall that keeps it from acting as *compiler input*.

---

## 14. Workflow-capability boundary

Proposed rule: *"Runtime Goal can steer what an existing workflow produces, but cannot
change what the workflow IS capable of producing."*

This maps **cleanly and almost exactly** onto the current architecture, because the
wall already exists and is structural rather than policy:

| Example | Holds? | Mechanism |
| --- | --- | --- |
| Assessment workflow: Goal changes assessment subject, assessment stays mandatory | **Yes** | steps frozen at save |
| No-assessment workflow: Goal cannot add assessment | **Yes** | frozen topology + upstream cue sanitisation |
| Self-study workflow: Goal cannot silently become a workshop | **Partly** | topology and materialised prompt bodies are frozen, but `delivery_mode`/`delivery_context` are *behavioural* through goal-driven scaffolds (G2, G6, G9). A Goal saying "workshop" cannot restructure the workflow, but it can shift scaffold selection. This is the weakest corner of the boundary. |
| Source-material workflow: Goal cannot change input strategy | **Yes for topology; partly for behaviour** | `input_strategy` is frozen, and `transcript_transformation_pack` selection reads frozen `r.input_strategy` first (`7871`) — but `e.input_strategy` from a live goal participates in the same OR |

The two "partly" rows are the same single leak identified in §10: goal-derived
`explicit` factors participating in runtime pack/scaffold selection. Close that and the
boundary is clean.

---

## 15. Goal vs Additional Instruction distinction

The proposed three-concept model is **coherent and already half-implemented**:

| Concept | Scope | Type | Authority | Status |
| --- | --- | --- | --- | --- |
| Typed parameters | workflow-wide | typed/enum | deterministic constraint | **exists** (S1/S2) |
| Goal | workflow-wide | prose | commissioning intent, subordinate to typed | exists as an ungoverned field |
| Additional Instruction | **stage-local** | prose | optional steering, subordinate to everything | **exists** (S3/S4) |

The distinction is real and is not merely scope. Additional Instruction is explicitly
*optional steering of discretion*; Goal is *what this run is for*. Collapsing Goal into
a workflow-wide Additional Instruction would misrepresent it as optional and
subordinate to stage defaults, when in practice it is the closest thing PRISM has to a
commission.

**Registry `type=text` vs separate first-class field:** the registry can carry it with
no new machinery — Topic is already `type: text`, and the declaration shape already
supports `help`, applicability, validation and `supersedesCommissionedContextFields`.
Two arguments cut the other way:

- Goal wants a **textarea and multi-sentence prose**; the current parameter UI renders
  single-line inputs. That is a rendering concern (`controlType`), not an architecture
  one.
- Goal is not "Auto" in the same sense as Topic. Absence of Topic means "use the
  commissioned subject". Absence of a runtime Goal means "use the commissioned Goal" —
  which is the *same* field's frozen twin (`initialBrief.goal`), not a different
  concept. The Auto/absence semantics work, but only if the commissioned/runtime split
  is made explicit.

Persisting through the same `adjustments` object is safe either way.

---

## 16. Topic's remaining architectural role

If Goal became author-facing, Topic would still be needed for:

| Role | Strength of need |
| --- | --- |
| **Concise subject label for projection** | **Strong.** Topic prints into every eligible prompt. Substituting a multi-sentence Goal there would bloat every prompt and violate the ≤ 5-line compactness assertion. |
| **Title-capable short string** | **Strong.** The page title currently takes Goal verbatim and produces a sentence-as-title (probe-verified). A concise Topic is the natural fix — this is an argument for *more* Topic use, not less. |
| Internal commissioned factor | Strong — frozen `resolvedFactors.topic` is the reconciled, source-aware subject (`19048-19091`, `20844-20920`), materially cleaner than regex-over-prose. |
| Supersession trigger | Real but circular — it exists to protect Goal. |
| Fallback when no Goal exists | Moderate. |
| Obsolete runtime parameter | **Not supported by evidence.** |

**Consumers preventing simple removal:** at runtime, strictly speaking, only the
S2/S4 projector chain (T1–T5) and the supersession trigger. There is **no** Topic-driven
title, filename or deterministic Run branch. So Topic is *technically* retirable — but
retiring it would (a) remove the Adjustments mechanism's only live parameter, (b) leave
nothing concise to project or to title pages with, and (c) require deriving a subject
from prose, which §1C shows produces garbage without AI. The evidence is against
removal.

---

## 17. Reuse scenario findings

| | Scenario | Topic alone sufficient? | Goal materially better? | Ambiguity? | Typed params required? | Regeneration required? |
| --- | --- | --- | --- | --- | --- | --- |
| **A** | Henry VIII → Elizabeth I, same shape | **Yes** — this is exactly the proven S2 case | marginal | no | no | **No** |
| **B** | "Introduce the water cycle" → "revision resource connecting water cycle to drainage-basin response" | **No** — Topic cannot express "revision" or the connective purpose | **Yes, decisively** | some ("revision" may imply frozen `objective_type`/`design_scope` that will not change) | Duration/Audience would help | No, but frozen scope may be wrong |
| **C** | Marx +10 questions → Durkheim, social cohesion; assessment stages remain | Topic works for subject; loses "focusing on social cohesion" | **Yes** — emphasis is the point | low | no | **No** |
| **D** | No-assessment workflow, Goal asks for 10 questions | n/a | **No — Goal actively creates a false promise** | **High** | no | **Yes**, if assessment is genuinely wanted |
| **E** | Workshop workflow, Goal says "self-study introduction" | n/a | **No — Goal invites an impossible expectation** | **High** | Delivery-mode parameter would be needed to do this truthfully | **Yes**, if a real self-study product is wanted |

The pattern: **Goal is materially better whenever the change is about purpose or
emphasis within the same capability (B, C), and actively harmful whenever it implies a
capability the workflow lacks (D, E).** Scenario A — the case S2 was built to prove —
is the one case where Topic alone is genuinely sufficient.

D and E are the strongest argument that a runtime Goal needs UI honesty about what the
workflow can produce, not just a text box.

---

## 18. Options comparison

| | A — keep Topic only | B — replace Topic with Goal | C — expose both | D — Goal as workflow-wide instruction, not a parameter | E — Goal as a declared `workflowContext` text parameter alongside Topic, with commissioned/runtime split |
| --- | --- | --- | --- | --- | --- |
| Product clarity | High but thin | Muddled — one box doing two jobs | Risk of "which do I edit?" | Clear if labelled as guidance | Good if the two are visibly different in kind |
| Expressive power | **Low** — cannot carry purpose | High | High | High | High |
| Truthfulness | High (proven) | **Low** — needs a concise subject it cannot supply | Medium — contradiction risk between the two | Medium — reads as optional, so under-promises | Medium-high — supersession makes Goal authoritative over the commissioned goal |
| Implementation complexity | **None** | High — must replace Topic's projection, title fallback and provenance | Low-medium | Low | Medium |
| Frozen-factor interaction | Best understood | Worst — invites prose that contradicts many frozen factors | Same as E | Lowest risk (subordinate framing) | Manageable; needs §10 leaks closed |
| Future Duration/Audience/Assessment | Clean | Conflict-prone: Goal prose will restate them | Conflict-prone but declarable | Low conflict | Declarable via existing precedence |
| Extensibility | Proven | Regressive | Proven | Separate path | Proven — reuses registry, resolver, projector |
| Risk of "Goal recompiles my workflow" | None | **High** | Medium | Low | Medium — mitigable by labelling and by §13's hard wall |

**Critically, none of these is the status quo.** Today Goal is editable, ungoverned,
projected to one step, and able to contradict Topic silently. Option A is therefore not
"do nothing" — it means *also* deciding what to do about `#workflowGoal`.

### Preferred candidate (architectural, not an operator decision)

The evidence points to **Option E**, a variant of C:

- Declare a runtime Goal in the existing registry (`type: text`,
  `projection: workflowContext`), so it inherits Auto-by-absence, provenance, validated
  persistence, projection to all eligible steps, and the supersession mechanism, with
  **no new architecture** — the same extension path S2 proved.
- Its `resolveCommissioned` reads the frozen `initialBrief.goal`, which finally gives
  that dead field a purpose and makes the commissioning/runtime split explicit and
  honest.
- Declare `supersedesCommissionedContextFields: ["goal"]` on it, so an explicit runtime
  Goal replaces rather than accompanies the commissioned prose — the same pattern S4
  established, pointed at the right target.
- **Retain Topic**, because prompts and page titles need a concise subject label and
  deriving one from prose without AI demonstrably produces garbage.
- Precedence per §12: typed parameters (including Topic) > Goal prose > Additional
  Instruction > stage discretion.

Why E over C-as-stated: C leaves `#workflowGoal` as an ungoverned Edit-mode field
alongside a governed Topic, which is what produces today's contradiction. E brings the
field that already exists under the authority model rather than adding a second one.

Why not B: §1C and §16. Why not D: §15 — subordinate framing under-represents what a
Goal is.

**This is an architectural reading of the evidence, not a decision. §16 of the task
reserves the choice to the operator.**

---

## 19. Implementation implications (no implementation)

If Option E were later authorised, the bounded work would be:

1. Declare the parameter; add a textarea `controlType` to the parameter renderer.
2. Point `resolveCommissioned` at `initialBrief.goal`; decide the relationship between
   `#workflowGoal` (Edit) and the Adjustments Goal — most likely `#workflowGoal` becomes
   the commissioning editor or is retired from Edit.
3. Close the two §10 leaks: scope the Run-time re-extraction to the commissioned goal,
   and stop the page title falling back to raw Goal prose.
4. Prompt wording for the Goal tier, subordinating it to typed parameters.
5. UI honesty for scenarios D/E — surface what the workflow can produce.

Prerequisite defects surfaced by this diagnostic are listed in §25. None is authorised
for repair here.

---

## 20. Files inspected

`app.js` (Create pipeline `18503-24328`, `36180-36400`; runtime `8396-8452`,
`9997-10060`, `10489-10551`, `11805-11834`, `15758-16204`, `25938-26186`,
`27149-27219`, `31050-31153`, `32222-32232`, `32801-33130`, `33268-33417`,
`33510-33639`, `33833-33912`, `34804-34930`, `35195-35228`, `49893-49968`);
`index.html` (`296-300`, `830-834`, `1180-1189`); `style.css` (`2362-2380`);
`lib/ld-instructional-archetype.js`, `lib/ld-guided-learning-scaffold.js`,
`lib/ld-dla-page-enrich-contract.js`, `lib/sprint38-visual-affordances.js`;
`tests/s80-s4-adjustments-ui-repurpose.test.js`; `tests/prism-vm-lib-bootstrap.js`.

## 21. Temporary diagnostics run

One throwaway probe, `tmp-goal-topic-probe.js`, loaded `app.js` in the existing `vm`
sandbox and compared four states of one workflow (commissioned Henry VIII goal with
matching frozen factors): baseline, Goal-edited-only, Topic-adjusted-only, and both.
It reported effective Topic and provenance, the regex re-derivation from the current
goal, the frozen factors, cognition packs, derived page title/audience, the step-1
runtime context, and Topic/subject presence in step prompts. **Zero fetch calls.**
The file was **deleted** after use; `git status` confirms no residue.

Probe limitation recorded honestly: it passed `config = null` to
`resolvePedagogicCognitionPackIds`, so `intentClasses` was empty and packs resolved to
`[]` in all four states. The additive-OR pack mechanism is therefore **code-verified
(`app.js:7746-7752`, `7840-7888`) but not probe-demonstrated.**

## 22. Files changed

**None.** No production code, tests, registry, prompts, elicitation or goldens were
modified. `app.js` and `index.html` still carry only the accepted S1–S4 diff.

## 23. Sprint records updated

This record created. `STATUS.md` and `next-chat-briefing.md` pointers updated.
No entries added to `ARCHITECTURAL-DEBT.md` — the defects in §25 are new discoveries
awaiting operator triage, and this task is discovery-only.

---

## 24. Risks and unresolved questions

### New defect candidates (recorded, not fixed, not registered)

| # | Defect | Severity |
| --- | --- | --- |
| **D4** | **Editable Goal contradicts frozen Topic.** `#workflowGoal` is editable in Edit mode with no provenance, no Auto concept and no supersession, so editing it produces a step-1 prompt asserting one subject in prose and another as authoritative parameter (probe scenario B). Exists today, independent of any Goal decision. | **High** |
| **D5** | **Page title takes Goal prose verbatim.** `buildPageShellOptionsFromWorkflow` falls back to `base.goal` (`app.js:11824`), so a learner page can be titled *"Create a 60-minute self-study resource on Henry VIII with 10 formative assessment questions."* Worsens with richer Goals. | **High** |
| **D6** | **Silent runtime re-derivation from live Goal.** `extractWorkflowBriefExplicitFactors` re-runs at Run time (`8415`, `49939`) and feeds cognition pack/contract selection additively (OR at `7746-7752`), so editing Goal changes prompt composition with no author-visible signal, and packs earned by a superseded goal can never be removed. | Medium |
| **D7** | **Deterministic topic extraction is unreliable.** The subject regex returned `"henry viii with 10 formative assessment questions"` for a normal commissioned goal. Currently masked because `resolvedFactors.topic` is AI-reconciled, but any future prose-to-Topic derivation would inherit it. | Medium |
| **D8** | **`initialBrief` is durable but dead.** The only record of original commissioning prose is written, saved, duplicated and exported, and never read — so it silently diverges from the editable Goal. It is also the natural commissioned-Goal source for Option E. | Low |

### Unresolved questions for the operator

1. **Is `#workflowGoal` the commissioning Goal or the runtime Goal?** It cannot
   honestly be both. This is the pivotal question and it must be answered before any
   Goal parameter is designed.
2. Should the runtime Goal supersede the commissioned Goal entirely, or append to it?
3. How should the UI communicate what a workflow *can* produce, given scenarios D and E
   where Goal invites impossible expectations?
4. Should D4/D5 be repaired independently of the Goal decision? Both are live defects
   now, and D5 is user-visible in the learner artefact.
5. Does a textarea-shaped parameter belong in the same panel section as scalar
   parameters, or does prose need its own presentation?

## 25. Exact recommended next decision / action

Operator decision on question 1 above (commissioning vs runtime Goal), then a choice
among Options A–E. D4 and D5 are live defects that exist regardless of that choice and
could be authorised as a small independent repair slice first.

No implementation is authorised by this record.
