# S80-T-005B — Minimal runtime parameter contract diagnostic

**Sprint:** 80 — Settings Discovery, Product Value and Policy Architecture
**Status:** **COMPLETE** (diagnostic delivered 2026-08-27; awaiting operator acceptance)
**Mode:** Discovery only — **no implementation, no schema, no Settings change, no workflow-generation change**
**Position:** Second evidence insert before S80-T-006 (human gate). Does not replace T-005 or T-005A.
**Predecessor:** [S80-T-005A](S80-T-005A-elicitation-to-workflow-to-run-parameterisation-diagnostic.md)
**Next:** Operator review → S80-T-006 when ready (**Cursor must not choose A/B/C/D**)

---

## 0. Evidence standard

| Tag | Meaning |
| --- | ------- |
| **OBS** | Read directly in live code / fixture (file + line cited) |
| **TEST** | Test / fixture evidence |
| **INF** | Architectural inference — not claimed as fact |

Claims marked **OBS-V** were independently re-read in this task rather than taken from a search summary.

---

## 1. Executive conclusion

**The obstacle to a small truthful runtime parameter set is not value ambiguity. It is the absence of any Run-time reader, plus multi-store duplication and two hardcoded literals.**

Three findings dominate:

1. **Topic, Duration and Audience are already deterministic at the value layer.** After Create resolution they are a text payload, a bounded number, and a text payload with an enum companion. **No AI call is needed to understand a new value for any of them.**

2. **None of the three currently reaches a Run/Copy step prompt at all.** **OBS-V:** the Create-baked prompt is built with `var selectedOptions = [];` (`app.js:5373`) and template variables limited to `stepTitle`, `stepOutputName`, `preferredOutputFormat`, `stepNotes`, `inputArtefactTypes` (`app.js:5377–5392`) — no goal, audience, constraints or duration. The one function that projects `workflowOutputSpec.audience/goal/constraints` into prompt text, `buildPromptFactoryWorkflowContextText`, gates that block behind `includeWorkflowGoalContext && !stepOnly` (**OBS-V** `app.js:34369–34384`), and every LD step sets `promptScope: "step_only"` / `allowWorkflowGoalContext: false`. `duration_minutes` lands in `[PRISM_STEP_PARAMS]`, which is stripped before Copy (`app.js:33786`).

3. **Consequently the "stale baked prompt text" risk is smaller than T-005A conservatively assumed, and the "silently contradictory hardcoded literal" risk is larger.** Two literals would contradict a newly-wired parameter: the DLA workbook contract hardcodes `session_duration_target_minutes (~60)` and `Sum of activity duration_minutes 50–70` (**OBS-V** `lib/ld-dla-page-enrich-contract.js:493,495`), and the page shell audience falls back to the constant `"Learners"` (**OBS-V** `app.js:11638`).

**Feasibility classification:** Topic **B**, Duration **B**, Audience **B** (with a typed companion), Source description **commissioning-only**.

None is **A** (clean deterministic late binding today) because in every case the commissioned value survives in multiple stores and at least one prompt-visible or artefact-visible carrier would disagree. None is **C** or **D**: the required work is bounded reprojection at two already-existing chokepoints, not recommission architecture.

**No architecture is chosen. No A/B/C/D product decision is made.**

---

## 2. Topic trace

### 2.1 Every store where the commissioned topic survives

| # | Store | Evidence |
| - | ----- | -------- |
| 1 | `resolvedFactors.topic` | Factor declared `domains/learning-design/domain-learning-design-step-patterns.md:388`; capture normalised via `normalizeCapturedTopic` (`app.js:35751, 35765, 35856`) |
| 2 | `workflowOutputSpec.constraints` segment `topic: …` | Mapping rule pack `:1570–1575` → applied in `applyWorkflowBriefMappings` (`app.js:20044–20052`); flattened to a `k: v; k: v` string (`app.js:35502–35512`) |
| 3 | `workflowBriefResolution.initialBrief.goal` / `.designIntent` | `app.js:35471, 35476` — composed cover prose, which normally *names* the topic |
| 4 | `workflowOutputSpec.goal` | `app.js:35494` |
| 5 | `workflow.name` | `app.js:35520` — free text, often topical |
| 6 | Stage artefacts from prior Runs | Page/LO/DLA content |

**Sanitisation already present (OBS):** `sanitizeWorkflowBriefTopicCandidate` (`app.js:18451–18467`), `isWorkflowBriefPlaceholderTopic` (`app.js:18820`), topic-tail stripper (`app.js:20655–20729`), and extraction-prompt rules forbidding level/quantity/qualifier text inside `topic` (`app.js:20436–20437`). **INF:** `topic` is already curated as a clean short payload, which is favourable for typed reuse.

### 2.2 How topic reaches a prompt today

**OBS: not as a structured value.** `buildWorkflowStepInstructions` (`app.js:33394+`) reads step title, output name, upstream artefact bindings, stripped `step.notes`, and `resolveStepPromptText(...)`. It never touches `workflowOutputSpec`.

The only Run-visible carrier is **goal prose**, via `base.goal = ctx.workflowGoal || outputSpec.goal || wf.goal` (`app.js:8219`) inside `resolvePedagogicCognitionBriefContextForPrompt`. That goal string is then used two ways:

- **Regex sniffing** by scaffold predicates (`isSelfDirectedDeliveryForMaterialShapeScaffold` `app.js:8291–8302`; `isLearnerPageFocusedOutputForMaterialShapeScaffold` `app.js:8305–8329`) — keyword detection, not topic transport.
- **Page title derivation** — **OBS-V** `buildPageShellOptionsFromWorkflow` sets `title: utilityFirstPresent([resolved.page_title, resolved.title, base.goal, workflow.goal, workflow.name, "Learning page"])` (`app.js:11630–11637`). **This is a genuine stale-topic path into an artefact:** a Run with a new topic would still title the page from the old commissioned goal prose.

### 2.3 Constraints string is write-mostly

**OBS:** there is no `parseWorkflowConstraints` symbol in the repository. The only reader is `compressWorkflowConstraints` (`app.js:34249–34327`), which splits on `;`/newline, buckets whole lines by keyword match, and **truncates to 5 critical + 3 secondary entries**. Its three call sites are `app.js:21316` (Create-time design brief), `24928` (topology hint), `34379` (the gated Studio block) — **none at Run**.

**INF:** the constraints string is a Create-time artefact, not a runtime contract. A runtime topic parameter should not attempt to edit it as a source of truth.

### 2.4 Existing late-binding channel

**OBS:** `{{Variable}}` placeholder substitution exists and is real: detector `app.js:35198`, wrapper `35237`, Factory preserves them `35267`, and Copy-from-workflow prompts the user to fill them (`app.js:32043`). No pack template defines `{{topic}}`. **INF:** this is a generic untyped text-substitution slot — evidence that a late-bound text channel is architecturally possible, not evidence that topic is currently parameterised.

### 2.5 Minimum architecture for a Run-supplied Topic

Conceptual only; **no implementation authorised**. Evidence indicates the minimum is:

| Requirement | Why (evidence) |
| ----------- | -------------- |
| One structured runtime topic value overriding `resolvedFactors.topic` for the run | Topic is already a curated short payload (§2.1) |
| A derived **effective goal/title string** for the run, rather than reusing the frozen `base.goal` | Page title derives from `base.goal` (§2.2) — otherwise the page is titled with the old topic |
| No attempt to rewrite the constraints string as authority | Constraints are write-mostly and lossy (§2.3) |
| Leave commissioned values in place as defaults/history | `initialBrief` is the commissioning record |
| Ordinary stage regeneration | Content stages already regenerate from context |

**Answers to the four specific questions:**

| Question | Evidence-based answer |
| -------- | --------------------- |
| Can Run override one structured topic SoT? | **Yes conceptually** — `resolvedFactors.topic` is the single structured store; the others are prose/derived |
| Can affected constraints be rebuilt deterministically? | **Yes, but unnecessary** — constraints are not read at Run; rebuilding is a Create-time concern |
| Can stale original-topic references be prevented from reaching prompts? | **Bounded, not automatic** — must handle `base.goal` (title + regex predicates) and `workflow.name`; no baked prompt body carries topic |
| Can stages regenerate normally? | **Yes** — content stages take context/artefacts, not a topic enum |

---

## 3. Topic feasibility

**Classification: B — feasible with bounded normalisation/reprojection.**

Not **A** because the goal-prose carrier (`base.goal`) feeds page title and scaffold regexes and would still name the old topic. Not **C/D** because the structured store is single and already sanitised, no baked prompt body contains the topic, and no AI interpretation of the new value is required.

**Bounded work identified (not authorised):** derive an effective goal/title for the run; decide precedence for `workflow.name`; leave constraints alone.

---

## 4. Duration trace

| Store | Evidence |
| ----- | -------- |
| `resolvedFactors.duration_minutes` | Factor pack `:435` (number, 10–480); prose extraction `app.js:18917, 19012` |
| `workflowOutputSpec.constraints` segment `duration_minutes: …` | Mapping rule pack `:1562–1569` |
| `workflowOutputSpec.constraints` segment `scope_scale: …` | Free-text scale appended verbatim (`app.js:35513–35517`); fixture shows `scope_scale: 60 mins` |
| `stepParams.step_construct_learning_sequence.duration_minutes` → `step.notes` `[PRISM_STEP_PARAMS]` | Same mapping rule; persisted `app.js:35448–35462` |
| `step.prompt_bindings.selectedOptions` | Snapshot `app.js:35463–35467` |
| `initialBrief.scopeScale` | Commissioning record |
| Artefact rows `activities[].duration_minutes`, timeline totals | Many consumers (`app.js:39155, 44288, 44515, 48011–48015` etc.) — all read artefacts, not factors |

**Topology dependency (OBS):** duration participates in Create-time step selection — `>= 45` minutes plus `activities_required` gates step inclusion (`app.js:19373, 19381`). **INF:** a 60→30 change crosses that threshold, so topology commissioned at 60 may include steps a 30-minute commission would not have. Topology remains *valid* (steps still run) but is no longer *what Create would have produced*.

**Does any prompt literally contain the duration number? OBS: no**, with one critical exception that is not parameter-driven:

- **OBS-V** `lib/ld-dla-page-enrich-contract.js:493` — `"DLA-WB-01: resource_intent self_study_workbook, session_duration_target_minutes (~60), …"`
- **OBS-V** `lib/ld-dla-page-enrich-contract.js:495` — `"DLA-WB-03: Sum of activity duration_minutes 50–70 unless an explicit brief exception is recorded."`

These are **hardcoded literals in the workbook overlay**, not reads of `resolvedFactors.duration_minutes`. A workflow commissioned at 30 minutes already emits the ~60 / 50–70 contract today. **This is a pre-existing correctness gap, independent of any parameter work.**

**Where does LS get duration at Run? OBS: nowhere.** Three channels, all closed: the LS Copy brief `buildLearningSequenceV2CopyAuthoringBrief` takes **no arguments** (`app.js:10947–10956`); the `[PRISM_STEP_PARAMS]` block is stripped (`app.js:33786`); and `applyWorkflowStepRuntimePromptAugmentations` is called with an **empty option map** (**OBS-V** `app.js:31443`).

`scope_scale` would additionally be dropped by compression even on the single Studio path, being segment 12 of 12 against a 5-entry critical cap (**INF** from §2.3).

---

## 5. Duration feasibility

**Classification: B — feasible with bounded normalisation/reprojection.**

Favourable: the value is a validated bounded number; the authoritative owner is unambiguous (**Learning Sequence** owns allocation, per T-004); downstream timing is `ARTEFACT_MEDIATED`; no prompt is parameter-driven today.

Blocking-but-bounded:

| Item | Consequence |
| ---- | ----------- |
| DLA `~60` / `50–70` hardcodes | Would contradict a 30-minute run — **must be reconciled or scoped before duration is claimed truthful** |
| Dual store (constraints + LS step notes + selectedOptions) | Must collapse to one effective run value |
| `scope_scale` free text ("60 mins") | Prose contradiction in commissioning record |
| `>= 45` topology threshold | Topology stays valid; commissioning fidelity degrades — an honesty question, not a correctness break |

**Stages that must rerun:** LS (owner), then any stage whose artefacts embedded old durations. **INF** per T-004 §10.

---

## 6. Audience trace

Two distinct things must not be conflated.

**Free-text audience:**

| Store | Evidence |
| ----- | -------- |
| `workflowOutputSpec.audience` | `app.js:35495–35501` |
| `initialBrief.audience` | Commissioning record |

**Enum companion `learner_level`:**

| Store | Evidence |
| ----- | -------- |
| `resolvedFactors.learner_level` | Factor pack; choices `beginner, intermediate, advanced, undergraduate, postgraduate` (pack `:395–401`) |
| `stepParams.step_define_learning_outcomes.learnerLevel` | Mapping rule pack `:1576–1582` |
| `stepParams.step_design_page.audience_level` | Second mapping rule pack `:1711–1716` |

**Three material observations:**

1. **The enum sets disagree.** The `learnerLevel` step-param options are `school / undergraduate / postgraduate / professional / general_adult` with `default: "general_adult"` (pack `:1370–1387`), while the `learner_level` factor enum includes `beginner / intermediate / advanced`. **OBS.** One factor, two incompatible vocabularies, three mapping targets.

2. **`learner_level` gates almost nothing.** Repository-wide it appears at `app.js:19017` (extraction write), `19661` (presence-only adequacy test), `20791` (phrasing an elicitation confirmation sentence), and `lib/workflow-artefact-json-strict.js:522` (named as an optional *output* key). Pack `whenResolvedFactorsInclude`-style blocks (pack `:752–819`) participate in cognition/pedagogy pack selection. **No `whenLearnerLevel` symbol exists.** **OBS.**

3. **The page shell audience is effectively a constant.** **OBS-V** `app.js:11638`: `audience: utilityFirstPresent([resolved.audience, resolved.learner_audience, "Learners"])`. Neither `audience` nor `learner_audience` is a declared LD factor id, and LD has `extraFields: []` (T-005A §3.2), so `resolved.audience` is undefined and the shell audience is **always `"Learners"`** regardless of what the author typed. Corroborated by `lib/page-shell-create.js:205` (same fallback), its canonical snippet hardcoding `"audience": "Learners"` (`:225`), and the validator (`:446`).

**Do prompts embed audience literally? OBS: no** on any Run/Copy path. The textual surfaces are `app.js:34376` (inside the gated Studio block) and `app.js:33041` (`buildWorkflowSummaryText`, a human digest reached from `handleCopyWorkflowSummary`). Where GAM/LS instructions mention `audience`, it is in *preserve-unchanged* language about page JSON fields (e.g. `app.js:10977`, `lib/page-shell-create.js:271`) — artefact integrity, not audience transport.

### 6.1 Assessment of the four candidate architectures

| Candidate | Evidence verdict |
| --------- | ---------------- |
| Runtime audience text becomes authoritative context | **Viable and deterministic** — text is its own payload; would also fix the `"Learners"` constant |
| `learner_level` remains fixed | **Viable but dishonest at the edges** — LO wording targets the frozen enum; pack selection unchanged. Acceptable only if the product states audience affects framing, not level |
| Audience and `learner_level` jointly parameterised | **Most truthful** — but requires resolving the two-vocabulary conflict (§6 obs 1) |
| Deterministic mapping free text → enum | **Not supported by evidence.** No such mapping exists; deriving `postgraduate` from arbitrary prose is exactly the AI interpretation this task forbids |
| Change requires recommissioning | **Not required** — no baked prompt or topology depends on audience |

---

## 7. Audience feasibility

**Classification: B — feasible with bounded normalisation/reprojection, conditional on a typed companion.**

Free-text audience alone **satisfies** the no-AI rule (text is the payload) but does **not** deterministically update `learner_level`. Therefore:

- **Audience as run context only** → B, honest if the contract says "framing/context", silent on level.
- **Audience + optional typed level selector** → B and fully truthful.
- **Audience free text expected to imply level** → **unsafe**, violates §12.

**Additional bounded work:** the `"Learners"` shell constant must be addressed or the parameter will not visibly take effect on the page artefact.

---

## 8. Source-description trace and disposition

| Question | Evidence |
| -------- | -------- |
| Where persisted? | `wf.artefacts` (`app.js:35522`) and `wf.workflowInputs = parseStringList(artefacts)` (`:35524`); normalised `34532–34534` |
| Cleared when unused | `app.js:35342` and `21614` guard on `workflowFactoryStartingPointNeedsSourceDescription` (defined `6747`) |
| Product already says it is descriptive | **OBS** `app.js:6920`: "You will supply the material when you run the workflow — this field does not upload or bind files automatically"; `6923`: "The main topic usually lives in the design intent field" |
| Reaches a Run step prompt? | **No.** `Starting artefact:` appears only at `app.js:21313` (Create-time design brief) and `33026` (`buildWorkflowSummaryText`). `workflowArtefacts` reaches prompt text only inside the gated `buildPromptFactoryWorkflowContextText` (`app.js:34338–34342`) |
| Actual source bytes | Copilot paste + step captures at Run (T-005A §22) — genuine late binding |

**Would exposing Source Description as a runtime parameter cause any legitimate behavioural difference? No.** The real source content is already late-bound and richer; the description would be a second, weaker, non-authoritative account of the same thing.

**Disposition: COMMISSIONING-ONLY METADATA** (with residual provenance value). It helped Create-time topology selection and set author expectations. It is **redundant with the actual source input** at Run.

---

## 9. Duplicate / stale state findings

| Dimension | Stores | Worst stale carrier |
| --------- | ------ | ------------------- |
| Topic | 5 (+ artefacts) | `base.goal` → **page title** (`app.js:11630–11637`) |
| Duration | 5 | **Hardcoded `~60` / `50–70`** (`lib/ld-dla-page-enrich-contract.js:493,495`) |
| Audience | 5 | **Hardcoded `"Learners"`** (`app.js:11638`; `lib/page-shell-create.js:205,225`) |
| Source description | 2 | None — never read at Run |

**Revision to a T-005A assumption (stated plainly):** T-005A treated baked `override_prompt_body` as a major stale-topic/audience/duration vector. **OBS-V** shows the Create bake carries none of these values (`app.js:5373, 5377–5392`). The real vectors are **derived prose (goal→title)** and **hardcoded literals**. This makes the minimal parameter set *more* tractable than T-005A implied, while relocating the risk.

---

## 10. Effective Run-context concept

Two pre-existing chokepoints are named for analysis. **Neither was modified.**

| Chokepoint | Location | Current role |
| ---------- | -------- | ------------ |
| `resolvePedagogicCognitionBriefContextForPrompt` | `app.js:8205–8261` | Already the de facto "effective workflow context" resolver: resolves workflow, brief config, output spec, `base` (goal/inputs/desiredOutputs/startingArtefact), and `resolvedFactors` with a three-tier precedence; consumed by ~22 call sites |
| `applyWorkflowStepRuntimePromptAugmentations` | `app.js:15990–16027`, called at `31443` | The single funnel every Run/Copy prompt body passes through; owns the currently-**empty** `optionMap` parameter |

**INF:** the conceptual shape the evidence supports is:

```text
runtime parameter values (topic, duration, audience [, level])
  → deterministic effective run context   (one resolver, no AI)
  → stage-owned interpretation            (LS owns time, LO owns level wording, …)
  → regenerated artefacts
```

with Create-time values retained as **workflow defaults / commissioning history**, not competing live authority.

**Caveat (OBS):** the third precedence tier re-resolves factors live when `workflowBriefResolution` is absent (`app.js:8242–8244`), so this resolver is not purely a reader of frozen state. Any parameter layer must define precedence against that tier. **No schema designed here.**

---

## 11. Workflow-default vs Run-value findings

| Parameter | Commissioned default | Run value | Immutable workflow intent | Generated consequence | Distinction clean? |
| --------- | -------------------- | --------- | ------------------------- | --------------------- | ------------------ |
| Topic | `resolvedFactors.topic` + goal prose | New topic text | Product kind, topology, source stance | LO/DLA/GAM/page content | **Clean-ish** — needs derived title/goal handling |
| Duration | `resolvedFactors.duration_minutes` | New minutes | Topology (incl. `>=45` selection) | LS plan + activity minutes | **Clean at value layer**; commissioning fidelity caveat at the 45 threshold |
| Audience | `WOS.audience` + `learner_level` | New audience text (+ level) | Delivery/product kind | LO wording, page audience | **Clean only if level policy is stated** |
| Source description | `wf.artefacts` | n/a | — | — | **Not a run value** |

**OBS:** in all cases the workflow remains the same reusable workflow — no candidate alters `input_strategy`, product kind, or the step graph.

---

## 12. No-AI-interpretation assessment

| Parameter | Is the value self-interpreting? | Verdict |
| --------- | ------------------------------ | ------- |
| **Topic** | Yes — free text is the semantic payload; already sanitised to a short curated string (§2.1) | **Satisfies the rule** |
| **Duration** | Yes — validated numeric, bounds already declared 10–480 (pack `:435`) | **Satisfies the rule** |
| **Audience** | Text is self-interpreting **as context**. It is **not** sufficient to derive `learner_level` (§6) | **Satisfies the rule only if** level is either frozen-with-disclosure or supplied as a typed companion |
| **Source description** | n/a | Not proposed |

**Explicit statement required by the brief:** free-text audience **cannot** safely replace the AI-resolved `learner_level`. Any design that infers the enum from audience prose would reintroduce elicitation AI into the parameter layer and must be rejected on that ground.

Ordinary regeneration by stage AI is expected and permitted for all three.

---

## 13. Proposed minimal v1 parameter surface

Technical/product recommendation **for T-006 evidence only** — not the T-006 decision.

| Parameter | Recommendation |
| --------- | -------------- |
| **Topic** | **INCLUDE** |
| **Duration** | **INCLUDE** — conditional on reconciling the DLA `~60` / `50–70` literals |
| **Audience** | **INCLUDE** — as free-text run context, with an **optional typed level companion**; do not claim level effects without it |
| **Source description** | **DROP** from the parameter surface (retain as commissioning/provenance metadata; do not delete the field) |

Assessment parameters deliberately excluded per the task brief.

---

## 14. Per-parameter behavioural contract

Honest user-facing contracts, in the T-003 §14 form. Wording is illustrative.

| Parameter | Meaning | Control | Default source | Validation | Deterministic owner | Affected stages |
| --------- | ------- | ------- | -------------- | ---------- | ------------------- | --------------- |
| Topic | "What this resource is about" | Single-line text | `resolvedFactors.topic` | Non-empty; reuse existing sanitisers (`sanitizeWorkflowBriefTopicCandidate`, placeholder rejection) | Run context resolver; content stages consume | LO, KM/Normalize (if present), DLA, GAM, DP, page title |
| Duration | "Available learning time" | Number + "minutes" | `resolvedFactors.duration_minutes` | Integer, bounds 10–480 (pack-declared) | **Learning Sequence** owns allocation | LS (owner); artefacts embedding minutes; DLA overlay wording |
| Audience | "Who this is for" | Single-line text | `workflowOutputSpec.audience` | Non-empty | LO for wording; shell for page audience | LO, DP/page shell |
| Audience level *(optional companion)* | "Level to target" | Select | `resolvedFactors.learner_level` | Must be a declared enum value — **vocabulary conflict must be resolved first** | LO | LO, cognition pack selection |

**Contract sentences:**

- Topic — "If you set Topic, PRISM will use it as the subject when content stages are (re)generated. Already-generated pages are not silently rewritten."
- Duration — "If you set Duration, Learning Sequence will target that budget when the plan is (re)generated; activity timings follow the regenerated plan."
- Audience — "If you set Audience, PRISM will use it as the audience description when outcomes and the page are (re)generated." *(No claim about level unless the companion is supplied.)*

---

## 15. Apply / regeneration consequences

| Parameter changed | Owning stage to rerun | Downstream stale until rerun | Render-only effect? |
| ----------------- | --------------------- | ---------------------------- | ------------------- |
| Topic | Content chain from LO (or KM) onward | DLA, GAM, DP, page, visuals | Page title only if derived at render |
| Duration | **LS** | Activity minutes, timeline projection, any DLA overlay assumption | Timeline display partially |
| Audience | **LO** (+ shell audience) | DP/page voice | Page audience field, if read at render |
| Audience level | **LO** | Same as audience, plus cognition pack selection | No |

**Honesty rule carried from T-004 §9 / T-005 §13:** a parameter change must either affect a genuinely render-only surface immediately, or mark artefacts stale and require an explicit **Apply / regenerate affected stages**. Silent acceptance is the anti-pattern.

---

## 16. Workflow applicability / declaration requirements

**OBS-based findings:**

| Question | Evidence |
| -------- | -------- |
| Are the factors universal? | `topic`, `learner_level`, `design_scope`, `delivery_pattern`, `input_strategy` are **required** LD factors; `duration_minutes` is **optional** (pack `:386–441`) |
| Would Duration make sense everywhere? | **No** — a workflow with no LS step has no owner for it |
| Is there a declaration mechanism already? | Packs already declare `requiredFactors` / `optionalFactors` / `workflowParameterControls` / `stepParameterControls`; steps already declare `promptScope` and `allowWorkflowGoalContext` |
| Research domain | 0 controls historically (T-002) |

**INF:** applicability should follow **owner presence** — expose Duration only when an owning stage exists in the graph; expose Topic/Audience where content stages consume them. This is a *declared-workflow* model, not a universal panel. That distinction is precisely what the old Settings surface lacked.

---

## 17. Extensibility assessment

**The test posed:** would adding a parameter be "declare type + validation + owner + affected stages" rather than editing arbitrary prompt strings?

**Evidence says: yes, conditionally.** Present already:

| Primitive | Status |
| --------- | ------ |
| Typed factor declarations with enums/bounds | **Present** (pack) |
| A single Run/Copy prompt funnel | **Present** — `applyWorkflowStepRuntimePromptAugmentations` (`app.js:15990`, called `31443`) |
| An unused injection seam on that funnel | **Present** — `optionMap` currently `{}` (**OBS-V** `app.js:31443`) |
| A context resolver with documented precedence | **Present** — `app.js:8205–8261` |
| Stage ownership doctrine | **Present** — T-004 |
| Neutral policy ingress seam (GAM) | **Present** — `resolveGamPolicyIngress`, `settingsEffective: false` |

Missing (per T-005A §40): a typed Run interface, an Apply/staleness marker, and a single allowlisted intent SoT.

**Conclusion:** the mechanism is extensible **provided** parameters flow through the two named chokepoints and never through per-prompt string editing. The failure mode to avoid is the historical one — a new control implemented as a new prompt sentence in a new place.

---

## 18. Assessment-future compatibility

Not implemented here. Compatibility check only:

| Future parameter | Natural owner (T-004 §5) | Fits the pattern? |
| ---------------- | ------------------------ | ----------------- |
| Assessment quantity | Design Assessment | Yes — bounded number, DA owns, GAI inherits |
| Assessment difficulty | Design Assessment | Yes — enum, but DA↔GAI **twin keys must collapse first** (T-003 §7.9/7.10) |
| Assessment type | Design Assessment | Yes — enum |

**Constraint:** these are legitimate **only when an assessment product is in the graph** — reinforcing the owner-presence declaration model of §16. The existing DA→GAI inheritance path (`resolveAssessmentItemsInheritedOptions`) is evidence that one-owner-plus-inheritance already works in this codebase.

---

## 19. Relationship to old Settings

**Evidence-based answer to the question posed:** Topic, Duration and Audience are better modelled as **reusable workflow parameters (per-run values)** than as universal Settings controls.

| Reason | Evidence |
| ------ | -------- |
| They are per-use commissioning values, not cross-project policy | They originate in Create Basics, are per-workflow, and vary per intended use |
| They have identifiable single owners | LS owns time; LO owns level wording; content stages consume topic |
| The Settings framing never made them causal | Settings params are stripped/ignored at Copy (`app.js:33786`, empty `optionMap`) |
| They are not the 41-control catalogue | Only 3–4 concepts, all with honest contracts |

**Mapping onto T-005A §37 categories:** Topic = commissioning input **and** plausible runtime variable. Duration = same. Audience = same, with an enum companion that is a resolved factor. Source description = **commissioning-only metadata**.

**Therefore:** "Settings" and "workflow parameterisation" are **not the same problem** (confirming T-005A §37). A small runtime parameter surface could be truthful even if the historical Settings panel does not survive — and conversely, retaining Settings would not by itself deliver reuse.

**No retain/delete decision is made. That is T-006.**

---

## 20. Risks / anti-patterns

| # | Risk | Evidence |
| - | ---- | -------- |
| 1 | **Hardcoded `~60` / `50–70`** contradicting a duration parameter | `lib/ld-dla-page-enrich-contract.js:493,495` — pre-existing gap |
| 2 | **`"Learners"` constant** making an audience parameter invisible on the page | `app.js:11638`; `lib/page-shell-create.js:205,225` |
| 3 | **Stale goal prose** titling pages with the old topic | `app.js:11630–11637` |
| 4 | Treating the **constraints string** as a runtime contract | No parser exists; compression truncates to 5 entries (`app.js:34249–34327`) |
| 5 | Inferring `learner_level` from audience prose | Would smuggle elicitation AI into the parameter layer (§12) |
| 6 | Shipping Duration where **no LS step exists** | Owner-presence violation (§16) |
| 7 | **Enum vocabulary conflict** (`learnerLevel` vs `learner_level`) shipped as-is | Pack `:1370–1387` vs `:395–401` |
| 8 | Implementing parameters as **per-prompt string edits** | The historical Settings failure mode (§17) |
| 9 | Silent parameter save with no Apply | T-004 §9 / T-005 §13 |
| 10 | Scope creep from 3 parameters back toward 41 | T-003 P6/P9 |
| 11 | Ignoring the **live re-resolve tier** in the context resolver | `app.js:8242–8244` |

---

## 21. Files / code / tests / history inspected

**Re-read directly in this task (OBS-V):**
- `app.js:5365–5399` — `buildSeededStepPromptForWorkflowStep` bake (`selectedOptions = []`, template vars)
- `app.js:11614–11643` — `buildPageShellOptionsFromWorkflow` (title from `base.goal`; audience `"Learners"`)
- `app.js:34360–34386` — `buildPromptFactoryWorkflowContextText` gating
- `lib/ld-dla-page-enrich-contract.js:486–499` — DLA-WB duration literals

**Traced via search (OBS):** `app.js` — `applyWorkflowStepRuntimePromptAugmentations` (15990, 31443), `resolvePedagogicCognitionBriefContextForPrompt` (8205–8261), `buildWorkflowStepInstructions` (33394+), `stripWorkflowStepParamBlock` (33344, 33786), `compressWorkflowConstraints` (34249–34327), `resolveWorkflowBriefFactors` (19459), `applyWorkflowBriefMappings` (19993+), `handleSaveDesignedWorkflow` (35315+), placeholder mechanism (35198, 35237, 32043), duration heuristics (19373, 19381), topic sanitisers (18451, 18820, 20655)
- `domains/learning-design/domain-learning-design-step-patterns.md` — factors `:386–494`, mapping rules `:1562–1582`, `:1711–1716`, `learnerLevel` options `:1370–1387`, pack gating `:752–819`, `promptScope`/`allowWorkflowGoalContext` `:2201, 2334, 2714, 2757, 3015`
- `lib/page-shell-create.js:43, 205, 225, 271, 446`
- `lib/learner-renderer-vnext/project-timeline-durations.js`
- `lib/workflow-artefact-json-strict.js:522`

**TEST/fixtures:** `tests/fixtures/educational-psychology-post-s68/workflow.json:15, 139, 149`; `tests/workflow-step-run-instructions-output-label.test.js:119–130`; `tests/workflow-step-parameter-controls.test.js`; `tests/page-shell-create.test.js`; `tests/s78-t-037-learner-timing-metadata.test.js`; `tests/s75-c06-ld-create-output-selection.test.js`. **No test asserts topic/audience/duration appearing in a generated step prompt; no test calls `compressWorkflowConstraints`.**

**History:** S80-T-001…T-005A; PB-FA-005; S75-D22.

---

## 22. Files changed

- This record (new)
- Sprint STATUS / START-HERE / PLAN / HANDOVER / next-chat-briefing / README; `docs/sprints/NEXT-SPRINT.md`

**No production code. No schema. No persistence change. No workflow deleted or migrated.**

---

## 23. Sprint records updated

T-005B recorded as a second evidence insert before T-006. T-006 remains **PENDING (human)**. A/B/C/D remain undecided.

---

## 24. Acceptance assessment

| Criterion | Status |
| --------- | ------ |
| Topic traced end-to-end with every surviving store | MET |
| Topic minimum-architecture questions answered | MET |
| Topic feasibility classified | MET (**B**) |
| Duration traced incl. duplication and frozen prose | MET |
| Duration feasibility classified | MET (**B**) |
| Audience traced with free-text vs enum separation | MET |
| Audience feasibility classified | MET (**B**, companion-conditional) |
| Source description dispositioned | MET (commissioning-only) |
| Single-SoT / effective-run-context concept assessed | MET (no schema) |
| Workflow-default vs Run-value distinction | MET |
| No-AI-interpretation rule verified per parameter | MET |
| Provisional v1 surface with contracts | MET |
| Apply/regeneration consequences | MET |
| Applicability / declaration requirements | MET |
| Extensibility + assessment-future check | MET |
| Settings relationship stated without deciding | MET |
| Risks / anti-patterns | MET |
| No implementation; T-006 not started; A/B/C/D not chosen | MET |

---

## 25. Exact next action

Operator acceptance of **S80-T-005B** (with T-005 / T-005A as required) → open **S80-T-006** as the **human decision gate**, using T-003–T-005B evidence. Cursor prepares options only.

**STOP — T-006 not started. No runtime parameters implemented. No Settings change. A/B/C/D not chosen.**
