# S80-T-010 — Audience / learner-level runtime parameter diagnostic

**Type:** DISCOVERY ONLY. No production changes. No product decision taken.
**Status:** COMPLETE — awaiting operator judgement
**Basis:** S80-S1…S80-S6 implemented; Topic (text), Goal (multiline text) and
Duration (number) are governed runtime parameters. Audience is the next candidate.

**Not done, by instruction:** no registry declaration, no prompt change, no
Adjustments UI change, no elicitation change, no hardcoded-audience fix, no
vocabulary reconciliation, no Assessment work, no D2/D3 work, no defect fixes.

---

## 1. Executive conclusion

**Audience and learner level are not two views of one concept. They are two
concepts with opposite health.**

- **Audience prose is already live and already model-visible** (step 1 only),
  but through an *ungoverned mutable field* — the same defect shape as the Goal
  D4 problem S5 fixed. A frozen commissioned source already exists at
  `initialBrief.audience`. Bringing Audience under Adjustments is cheap,
  truthful, and needs no new vocabulary.
- **The generated learner page, meanwhile, always says `"Learners"`.** The page
  shell reads `resolvedFactors.audience`, a key never written under the
  learning-design pack, so a real commissioned audience is ignored in favour of
  a hardcoded constant — which is then never rendered anyway.
- **Learner level is a required Create factor that reaches no prompt at all.**
  Its only live consumer is a Create-time confirmation sentence shown to the
  author. Every route by which it could become model-visible is dead. And
  **there is no canonical learner-level vocabulary**: five value sets exist, the
  two most load-bearing overlap on only 2 of 5 values, and no conversion
  function exists anywhere.

So the evidence points strongly at **Audience free text now, learner level
deferred** — not because free text is nicer, but because a learner-level enum
today would require inventing a canonical vocabulary *and* building its first
real consumer, while Audience only requires governing a value the product
already sends to models.

One consequential nuance found: **audience prose is fed into the Create-time
inference blob**, so audience wording can silently set topology-effective
factors at Create. That is a Create-time behaviour only, and a runtime Audience
Adjustment would not re-trigger it — which is precisely why a runtime Audience
parameter is safe while a *retrospective* audience change is not.

## 2. Total audience-like concepts and stores found

**Nine distinct stores across four concepts.**

| concept | stores |
| --- | --- |
| A. Audience (who the output is for, prose) | 4 — `#promptAudience`, `#wfDesignAudience`, `#workflowAudience` → `workflowOutputSpec.audience`, `resolvedFactors.audience` |
| B. Learner level (typed proficiency/stage) | 4 — `resolvedFactors.learner_level`, `stepParams.…learnerLevel`, `stepParams.step_design_page.audience_level`, LO artefact `learner_level` |
| C. Page audience (artefact metadata) | 1 — `page.audience` |
| adjacent, **not** audience | `page_profile` (`learner`/`facilitator`/`assessment`) — who the *artefact* is for, i.e. artefact type, not learner identity |

Concepts the brief asked about — experience, prior knowledge, expertise,
educational stage, role, professional context — **have no dedicated store
anywhere**. They exist only as words inside audience prose.

This is a verified absence, not an assumption. Searched across `app.js`, `lib/`,
`domains/` and `index.html`: no `learner_profile`, no `expertise` /
`expertise_level`, no `educational_stage`, no `target_audience` /
`targetAudience`, and no `prior_knowledge` as a *learner attribute* — the only
`prior_knowledge_*` hits are instructional beat names such as
`prior_knowledge_activation` (`lib/episode-plan-population-contract.js:22`,
`lib/page-shell-create.js:66`). Likewise no enum anywhere contains `novice`,
`practitioner`, `general_public`, `primary`, `secondary` or `staff` as a value;
`primary` and `secondary` exist only as inference *trigger phrases* (pack
`:799`), and `expert` / `novice` only as prompt prose (e.g.
`lib/instructional-pattern-prompt.js:160`).

One near-miss worth naming so it is not mistaken for a learner level:
`audience_style` in the research pack
(`domain-research-step-patterns.md:1115–1123`), values `researcher`,
`executive`, `general` — a **register/tone** vocabulary, not an audience
identity or level.

**This absence is good news for §17:** there is no half-built learner-profile
system to collide with, so future typed dimensions would be additive rather than
reconciliatory.

## 3. Create UI semantics

Three separate audience inputs exist. Only the middle one is the LD
commissioning field.

| # | id | label | help / placeholder | type | required | receives |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `#promptAudience` (`index.html:291–294`) | "Who is this for?" | "Who should the output be written for?" / *"e.g. non-technical executives, beginners"* | free text | no | Prompt Studio only — **not** the LD workflow path |
| 2 | `#wfDesignAudience` (`index.html:840–847`) | "Who is this for?" | "Primary target users or learners." / *"e.g. university staff, undergraduate students, researchers"* | free text | no | **the Create brief** — `base.audience` |
| 3 | `#workflowAudience` (`index.html:1202–1209`) | "Audience (learner-facing run)" | "Primary end users or learners for the learner-facing output." / *"e.g. beginner learners, senior leaders"* | free text | no | `workflowOutputSpec.audience`, **editable after Create** |

**What the author believes they are specifying.** Field 2 is asked once, in
plain language, with placeholders that mix *role* ("university staff",
"researchers") and *stage* ("undergraduate students"). Nothing signals that the
words will be scanned for a level token, and nothing signals that a level token
found elsewhere in the brief will outrank them. The author reasonably believes
they are writing a description of their learners.

**Does the prose survive frozen?** Yes — but reliably in only **one** place.

- **`workflowBriefResolution.initialBrief.audience` — reliable.** `initialBrief`
  is assigned `base` verbatim (`app.js:22027`, `22097`, `22148`) and never
  mutated after Create, the same property S5 relied on for the commissioned
  Goal. Confirmed on a real saved LD workflow:
  `tests/fixtures/educational-psychology-post-s68/workflow.json:24` holds
  `"audience": "undergraduate students"`.
- **`workflowBriefResolution.resolvedFactors.audience` — domain-conditional, and
  absent for learning-design.** `extractWorkflowBriefExplicitFactors` does
  produce it (`app.js:19248`), and it *does* persist when a brief config
  declaring an `audience` factor is active — the general fallback
  (`app.js:7451–7456`) or the research pack
  (`domain-research-step-patterns.md:227–231`). Fixture
  `tests/fixtures/workflow-brief-pass1/maximal-factor-rich.json:52,56,58`
  (`selectedDomains: ["general", "learning-design"]`) shows it surviving
  alongside `learner_level` and an arbitrary `custom_factor`.

  **But under the learning-design pack it does not survive.** The same real
  workflow whose `initialBrief.audience` is `"undergraduate students"` has a
  `resolvedFactors` block containing `topic`, `learner_level`, `design_scope`,
  `delivery_pattern`, `duration_minutes`, `delivery_mode`, `delivery_context`,
  `session_materials`, `page_profile`, `learning_environments`,
  `assessment_strategy`, five cognition booleans and `workshop_subject` — **and
  no `audience` key at all**
  (`tests/fixtures/educational-psychology-post-s68/workflow.json:74–97`).

**Consequence.** `initialBrief.audience` is the *only* dependable frozen
commissioned audience source. This materially changes §14's ranking and §9's
`"Learners"` classification, and it is why the page artefact never carries the
real audience on an LD run (§16).

## 4. Complete audience / level inventory

| # | identifier | type | vocabulary | source | persistence | phase | consumers | model-visible | topology-effective | renderer-visible | state |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `#promptAudience` | free text | — | Prompt Studio UI | none (session) | Create | prompt refinement only | via refinement text | no | no | **live, unrelated to LD** |
| 2 | `#wfDesignAudience` → `base.audience` | free text | — | Create UI | `initialBrief.audience` (frozen) | Create | inference blob; explicit factor; confirmation msg | indirectly (see #4) | **yes, via blob — see §9** | no | **live** |
| 3 | `workflowOutputSpec.audience` | free text | — | `#wfDesignAudience` seed, else `learner_level` token | `workflowOutputSpec` (**mutable**) | Create + **post-Create edit** | `buildWorkflowRuntimeContextText` step 1; Run header | **YES — step 1 only** | no | no | **live, ungoverned (D13)** |
| 4 | `resolvedFactors.audience` | free text | — | `extractWorkflowBriefExplicitFactors` | `resolvedFactors` (frozen) — **absent under the LD pack** | Create | page shell `audience` (`app.js:11902`) | no | no | no (see §16) | **live for general/research; effectively absent for LD** |
| 5 | `resolvedFactors.learner_level` | enum | `beginner, intermediate, advanced, undergraduate, postgraduate` | elicitation factor (**required**) | `resolvedFactors` (frozen) | Create | confirmation msg; `→ audience` if blank; dead step params | **no** | no | no | **live but near-inert** |
| 6 | `stepParams.step_define_learning_outcomes.learnerLevel` | enum | `school, undergraduate, postgraduate, professional, general_adult` | mappingRules | `step.notes` `[PRISM_STEP_PARAMS]` | Create | none reaching a model | no | no | no | **DEAD (D3)** |
| 7 | `stepParams.step_design_page.audience_level` | — | **none declared** | mappingRules (`:1712–1715`) | step params | Create | none | no | no | no | **DEAD + undeclared (D15)** |
| 8 | LO artefact `learner_level` | free string | **unconstrained** | model output | `learning_outcomes` artefact | Run | downstream prompt context as artefact text | as artefact | no | no | **live, unvalidated (D21)** |
| 9 | `page.audience` | free string | — | `resolvedFactors.audience` else `"Learners"` — so **`"Learners"` on LD runs** | page artefact | Run | schema-required; validated non-empty; preserved verbatim by every enrich stage | as artefact | no | **no — never rendered (§16)** | **live but inert metadata** |

## 5. Create-time derivation trace

**AI does not interpret audience.** No model call is involved. Derivation is
entirely deterministic, by regular expression, in two places.

### 5a. The blob

`extractWorkflowBriefExplicitFactors` (`app.js:19227–19250`) builds a single
lower-cased blob from **seven** fields:

```19235:19235:app.js
    var blob = [goal, designIntent, audience, scopeScale, inputs, desiredOutputs, scope].join("\n").toLowerCase();
```

### 5b. Level extraction

```19285:19288:app.js
    if (/\b(beginner|intermediate|advanced|undergraduate|postgraduate)\b/.test(blob)) {
      var lv = blob.match(/\b(beginner|intermediate|advanced|undergraduate|postgraduate)\b/);
      if (lv && lv[1]) out.learner_level = lv[1];
    }
```

**This takes the first matching token anywhere in the blob**, and `goal` and
`designIntent` precede `audience` in the join order. The pack adds a second
deterministic layer of `whenInputsMentionAnyOf` rules (`:750–821`) mapping
phrases onto the same five values, including `"primary"` / `"primary school"` →
`beginner` (`:799–802`).

### 5c. Precedence into `workflowOutputSpec.audience`

```36711:36718:app.js
    var workflowOutputSpec = normalizeWorkflowOutputSpec({ goal: designIntent });
    if (audienceSeed && !workflowOutputSpec.audience) {
      workflowOutputSpec.audience = audienceSeed;
    }
    var mappedSpecPatch = mappedBindings.workflowOutputSpecPatch || {};
    if (mappedSpecPatch.audience && !workflowOutputSpec.audience) {
      workflowOutputSpec.audience = String(mappedSpecPatch.audience);
    }
```

**Author prose wins.** The `learner_level` mapping (`:1577–1581`, factor
`learner_level` → `workflow.workflowOutputSpec.audience`) fills `audience`
**only when the author left it blank**. This corrects an earlier reading: the
enum does *not* overwrite prose. But when audience *is* blank, the field becomes
the bare token, and `Audience: undergraduate` is then sent to a model as if it
were an audience description (**D17**).

The real workflow fixture demonstrates the whole precedence chain in one record
(`tests/fixtures/educational-psychology-post-s68/workflow.json`):

| field | value | reading |
| --- | --- | --- |
| `initialBrief.audience` (`:24`) | `"undergraduate students"` | author prose, frozen |
| `mappedBindings.workflowOutputSpecPatch.audience` (`:100`) | `"undergraduate"` | the enum token **was** computed |
| `workflowOutputSpec.audience` (`:13`) | `"undergraduate students"` | **prose won; the token was discarded** |
| `resolvedFactors.audience` (`:74–97`) | *absent* | not retained under the LD pack |

### 5d. Worked example

Brief: **"First-year undergraduate geography students with no prior experience
of GIS."**

| element | preserved? | where |
| --- | --- | --- |
| the whole sentence | **YES** | `initialBrief.audience`, `resolvedFactors.audience`, `workflowOutputSpec.audience` |
| "undergraduate" | yes, as `learner_level: "undergraduate"` | `resolvedFactors` |
| "first-year" | **not typed** — survives only inside the prose | — |
| "geography" | **not typed** as audience — may separately land in `topic` | — |
| "no prior experience of GIS" | **not typed** — prose only | — |

So the answer to the brief's question is: **the prose survives intact, and
exactly one dimension (stage) is additionally typed.** Nothing is destroyed —
but only one quarter of the meaning is machine-addressable, and the typed part
is the least specific quarter.

The fixture demonstrates the fragility concretely: with audience `"Year 1
undergraduate students"` and a design intent mentioning `"intermediate
learners"`, the resolved level is **`intermediate`**, not `undergraduate` —
because `designIntent` precedes `audience` in the blob (**D20**).

## 6. Learner-level vocabulary catalogue

**Five vocabularies. No canonical enum exists. No conversion function exists.**

| # | identifier | exact allowed values | declaration site | layer | owner | phase |
| --- | --- | --- | --- | --- | --- | --- |
| V1 | `learner_level` | `beginner`, `intermediate`, `advanced`, `undergraduate`, `postgraduate` | `domain-learning-design-step-patterns.md:395–400` | elicitation factor (**required**) | Create brief | Create |
| V2 | `learnerLevel` (LO step control) | `school`, `undergraduate`, `postgraduate`, `professional`, `general_adult` (default `general_adult`) | `:1371–1383` | step parameter control | Settings catalogue | Create (settings-only) |
| V3 | `learnerLevel` (LO `userOptions`) | `school`, `undergraduate`, `postgraduate`, `professional`, `general_adult` (default `general_adult`) | `:2414–2431` | prompt-template option, each with a `promptInstruction` | Prompt Factory | Run (dead) |
| V4 | `audience_level` | **none — no control with this key is declared anywhere** | referenced only at `:1712–1715` | mappingRules target | — | — |
| V5 | LO artefact `learner_level` | **unconstrained free string** | `lib/workflow-artefact-json-strict.js:522` | artefact schema (optional output) | model | Run |

### V1 vs V2/V3 — the incompatibility

```
V1:  beginner  intermediate  advanced  undergraduate  postgraduate
V2:  school    undergraduate postgraduate professional general_adult
```

Shared: **`undergraduate`, `postgraduate` only — 2 of 5.**
V1-only and unrepresentable in V2: `beginner`, `intermediate`, `advanced`.
V2-only and unreachable from V1: `school`, `professional`, `general_adult`.

And the pack maps directly across this gap with **no converter**:

```1577:1581:domains/learning-design/domain-learning-design-step-patterns.md
      {
        "factor": "learner_level",
        "mapsTo": [
          "workflow.workflowOutputSpec.audience",
          "stepParams.step_define_learning_outcomes.learnerLevel"
        ]
```

So `learner_level: "beginner"` writes `learnerLevel=beginner` — a value that is
not a valid option of the control it is written to. It is invisible today only
because the target is dead (**D14**). V5 confirms the drift independently: a
strict-JSON test fixture uses `learner_level: "general_adult"`
(`tests/workflow-artefact-json-strict.test.js:68`) — a V2 value in a V1-named
field, validated by nothing.

### The mapping engine cannot bridge the gap, and no validator catches it

`applyWorkflowBriefMappings` copies values verbatim (`app.js:20302–20340`). The
only value transform is `normalizeMappedFactorValue` (`20284–20301`), which
handles **`question_style_mix` only** and returns the value unchanged otherwise.
No validator anywhere constrains a mapped value to its target control's
`options`.

**The decisive comparison: the pattern that is missing here exists elsewhere.**
An adjacent enum conflict of exactly this shape *was* solved with a declared
converter:

| | `difficulty_profile` (solved) | `learner_level` (unsolved) |
| --- | --- | --- |
| set A | `foundation_heavy`, `balanced`, `higher_order_heavy` (`:598–602`, `:1237–1241`) | `beginner`, `intermediate`, `advanced`, `undergraduate`, `postgraduate` |
| set B | `foundational`, `balanced`, `higher_order` (`:1067–1071`, `:3106–3110`) | `school`, `undergraduate`, `postgraduate`, `professional`, `general_adult` |
| converter | **yes** — `da_difficulty_to_gen_difficulty_profile` declared `:382`, implemented `mapDesignAssessmentDifficultyToItemsDifficultyProfile` (`app.js:5112`) | **none** |

So the codebase already knows how to reconcile two enums for one concept. Nobody
did it for learner level — which is further evidence the level path was never
finished rather than deliberately designed.

A third instance of the same smell: `cognitive_demand`
(`recall_foundation`, `application_oriented`, `analysis_evaluation`, `mixed` —
`:521–527`, `:1253–1258`) versus `cognitive_emphasis`
(`mixed`, `foundational`, `application`, `analysis` — `:3090–3099`), again with
no mapping rule and no converter (**D23**).

**Answer to §5's question: no, a canonical learner-level enum does not exist
today.** Adopting one would mean choosing between two incompatible sets or
inventing a third — *and* writing the converter that `difficulty_profile` shows
would be required.

## 7. Effectiveness classification

| store | class | exact read site | observable effect |
| --- | --- | --- | --- |
| `workflowOutputSpec.audience` | **A — LIVE_EFFECTIVE** | `app.js:33501–33503` | emits `Audience: <prose>` into the **step-1** runtime context block; editable post-Create, so it changes Run output without recompiling |
| `workflowOutputSpec.audience` (UI) | **C — PRESENTATION_ONLY** | `app.js:27270–27274` | Run header summary line |
| `resolvedFactors.audience` | **B** for general/research; **E — DEAD for learning-design** (the key is never written) | `app.js:11902` | becomes `page.audience` — but on LD runs the read misses and `"Learners"` is used instead |
| `base.audience` in the inference blob | **B + F — CREATE_EFFECTIVE, INDIRECT** | `app.js:19235` | audience wording can set `learner_level`, and can reach the topology-effective regexes — see §9 |
| `resolvedFactors.learner_level` | **C — PRESENTATION_ONLY** | `app.js:21061`, phrase built `21083–21088` | one sentence in the Create confirmation chat: *"This will create a session-based learning workflow for undergraduate students on X."* |
| `resolvedFactors.learner_level` → audience | **F — INDIRECT** | `app.js:36715–36718` | fills `workflowOutputSpec.audience` **only if blank** |
| `stepParams.…learnerLevel` | **E — DEAD** | — | mapping writes it; nothing reads it into a prompt (D3) |
| `stepParams.step_design_page.audience_level` | **E — DEAD** | — | target control is undeclared |
| `userOptions.learnerLevel.promptInstruction` | **E — DEAD** | `:2414–2431` | the *only* route that would make level model-visible; unreachable because `selectedOptions` is empty and the param block is stripped |
| `weakAudienceCue` rule machinery | **E — DEAD** | `app.js:17693–17712`, `17887–17889` | 7 occurrences in `app.js`; **zero** domain packs declare it (D19) |
| `page.audience` | **C/D** | `lib/page-shell-create.js:205`, `:446` | schema-required, validated non-empty; see §16 for render visibility |

**Headline:** the only class-A audience store in the product is the mutable
`workflowOutputSpec.audience`. **Learner level has no class-A or class-B
model-visible effect at all.**

## 8. Model-visible prompt trace (re-verified post-S6)

T-005B's old finding is re-confirmed and now sharpened.

**Audience — one live route, step 1 only:**

```
#wfDesignAudience (or #workflowAudience post-Create)
  → workflowOutputSpec.audience
  → buildWorkflowRuntimeContextText(wf, step)        app.js:33501–33503
  → prepended ONLY when inRunMode && zeroBasedIndex === 0   app.js:32316–32326
  → "Audience: <prose>" ahead of step 1's prompt
```

Steps 2..N receive **no** audience context. Note the contrast with the post-S6
architecture: Topic, Goal and Duration are projected to *every* eligible step
through `buildEffectiveWorkflowContextBlock`, whereas audience is still a step-1
legacy line.

**Two further `Audience:` emission sites exist. Neither is a Run step prompt**,
so the "step 1 only" finding stands — but both were checked rather than assumed:

| site | enclosing function | surface | verdict |
| --- | --- | --- | --- |
| `app.js:33405` | `buildWorkflowSummaryText(wf)` (`33377`) | whole-workflow summary text copied by the export/copy action (`34745`) | **not a prompt** — operator-facing export |
| `app.js:35042` | `buildPromptFactoryWorkflowContextText(ctx, options)` (`34995`) | Prompt Factory authoring surface, called at `27419–27425`; gated on `stepCfg.allowWorkflowGoalContext` **and** `promptScope !== "step_only"` | **Create-time prompt authoring**, not the Run copy-to-clipboard path |

The second is worth remembering when Audience is declared: it reads
`ctx.workflowOutputSpec.audience` directly, so it would not see an adjustment.
It is out of scope for a runtime parameter, but it is a third place where the
mutable spec is read as authority.

**Learner level — no live route.** Verified three ways: only three
`learner_level` read sites exist in `app.js` (`19287` write, `19931` presence
check, `21061` confirmation message), none prompt-related; the step-param route
is dead; and the `promptInstruction` route is unreachable.

**Hardcoded audience language — one route:** the canonical shell shape exemplar
shown to the model (`lib/page-shell-create.js:225`) literally contains
`"audience": "Learners",`. Prompt templates also *refer* to level without
receiving it — the LO template says "Set cognitive demand in line with the
specified learner level" (`:2402`) while no learner level is supplied. That is a
prompt referring to an absent input.

## 9. Hardcoded `"Learners"` audit

| # | site | populates | nature | model-visible | page-visible | contradicts commissioned audience? | contradicts a runtime Adjustment? | class |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `app.js:11902` `utilityFirstPresent([resolved.audience, resolved.learner_audience, "Learners"])` | page shell `audience` | nominally a fallback — **but the normal outcome on LD runs**, because `resolvedFactors.audience` is never written under the LD pack | no | written to the artefact, but **not rendered** (§16) | **Yes in effect** — a real commissioned audience exists at `initialBrief.audience` and is ignored | **Yes** — reads `resolvedFactors`, never `workflowOutputSpec.audience` or Adjustments (D16) | **A** |
| 2 | `lib/page-shell-create.js:205` `nonEmptyString(opts.audience \|\| opts.learner_audience, "Learners")` | page shell `audience` | fallback beneath #1 | no | same as #1 | same as #1 | same as #1 | **A** (same defect, second layer) |
| 3 | `lib/page-shell-create.js:225` `'"audience": "Learners",'` | nothing — it is **prompt exemplar text** | canonical shape example | **YES** | no | no, but it *anchors* the model toward "Learners" | **Yes** — a model shown this example may echo it over a real audience | **A** (weakest of the three, but the only model-visible one) |
| 4 | `lib/page-shell-create.js:39–48`, `:446` | `REQUIRED_TOP_LEVEL` / validator | schema requirement only | no | n/a | no | no | **C** |

**Conclusion — revised from my first reading.** Sites 1 and 2 look like
last-resort fallbacks in the source, but because `resolvedFactors.audience` is
never written under the learning-design pack (§3), **`"Learners"` is the actual
value on essentially every LD learner page**, while a real commissioned audience
sits unused in `initialBrief.audience`. So the hardcoded default *does* displace
a real audience — class **A**, not B.

Two things keep this from being urgent: `page.audience` is **never rendered**
(§16), and every enrich stage preserves it verbatim rather than reasoning over
it. It is therefore a *truthfulness* defect in artefact metadata rather than a
learner-visible one — but it is exactly the carrier a future Audience parameter
would need to fix, and it would need to read the effective value, not
`resolvedFactors`.

## 10. Topology / capability effects

**Learner level: no topology effect.** No topology read site exists; its mapping
targets are inert; and it is explicitly *excluded* from the page-profile required
queue — asserted by existing tests (`tests/workflow-ld-profile-thinning.test.js:202,213,276`:
`assert.ok(!optional.includes("learner_level"))`,
`assert.ok(!meta.requiredIds.includes("learner_level"))`).

**Audience prose: a real Create-time topology channel.** Because `audience` is
one of the seven fields concatenated into the inference blob (`app.js:19235`),
audience wording is scanned by every regex that follows, including
topology-effective ones:

| regex on the blob | factor set | topology consequence |
| --- | --- | --- |
| `(\d{1,3})\s*(minutes?\|mins?\|min)` (`19279`) | `duration_minutes` | timing target |
| `(async\|asynchronous)`, `(seminar)`, `(workshop\|live session\|classroom…)` (`19290–19296`) | `delivery_mode` | delivery shaping |
| `self[- ]?(directed\|study)\|independent study…` (`19297–19303`) | `delivery_context: self_directed` | **selects the self-directed learner-page contract path**, incl. the DLA workbook overlay |
| MCQ / assessment cues (`19305`+) | assessment factors | **assessment topology** |

So an audience of *"self-study learners preparing for a 45-minute MCQ revision
session"* would set `delivery_context`, `duration_minutes` and assessment
factors — through the audience box.

### The distinction §9 asks for

| | Create-time | Runtime Audience Adjustment |
| --- | --- | --- |
| add/remove stages | **possible**, indirectly via blob-inferred factors | **no** — topology is frozen; nothing re-runs inference |
| change activity/assessment requirements | **possible** via blob | **no** |
| change page profile | possible via `page_profile` factor (not audience-driven) | **no** |
| select packs/contracts | **yes** — `delivery_context: self_directed` gates the learner-page and workbook contracts | **no** |
| alter cognition/scaffolding | **yes** — cognition-pack selection reads `resolvedFactors` | **no** (S5's D6 fix froze derivation inputs) |

**This is the key safety result.** A runtime Audience Adjustment is
topology-safe *precisely because* the Create-time inference does not re-run —
the same property that makes it safe also means it cannot fix a mis-inferred
topology. An author who changes Audience at Run gets new prose in prompts, not a
recompiled workflow. That must be stated in the UI, not implied.

## 11. Stage ownership matrix

Column 1 is what the code shows today. Column 2 is architectural judgement, kept
separate as instructed.

| stage | receives audience today? | references level in its prompt text? | evidence-based class | architectural judgement |
| --- | --- | --- | --- | --- |
| Model Knowledge | step 1 only, if first | no | **D** today | **A** — depth/framing of the knowledge model depends on who it is for |
| Learning Outcomes | no | **yes** — "in line with the specified learner level" (`:2402`), input absent | **E** (prompt expects an input it never gets) | **C** — the one stage with a genuine typed-level use, and the one with a live `promptInstruction` vocabulary already written |
| Episode Plan | no (derived shell; exempt from projection) | no | **D** | **D** — derives from LOs |
| DLA | no | no | **D** | **A** — activity difficulty and scaffolding are audience-sensitive |
| GAM | no | no | **D** | **A** — this is where learner-facing wording is actually authored, so audience matters most here |
| Learning Sequence | no | no | **D** | **D** — allocates time, not language |
| Design Page | no; `audience_level` mapping is dead | no | **E** | **A** |
| Design Assessment | no | no | **D** | **A** — item difficulty is audience-sensitive |
| Generate Assessment Items | no | no | **D** | **A** |

**Observation.** Today exactly one stage receives audience (step 1, by position
not by design) and exactly one stage asks for a level it never receives. If
Audience were declared with the proven `workflowContext` projection, all
`A`-judged stages would receive it at once with no prompt edits — the same
result S6 achieved for Duration.

## 12. Free text vs enum — options A–E

| criterion | A: free text only | B: enum only | C: both | D: text now, level later | E: text + optional level *inside* the text contract |
| --- | --- | --- | --- | --- | --- |
| semantic fidelity | **high** — carries stage, discipline, prior knowledge, role | **very low** — 1 of 4 dimensions | **high** | **high** | high |
| deterministic | **yes** | yes | yes | **yes** | yes |
| commissioned fallback exists today | **YES** — `initialBrief.audience` + `resolvedFactors.audience` | yes — `resolvedFactors.learner_level` | yes, both | **YES** | yes |
| model usefulness | **high** — prose is what actually steers wording | low today — **no live consumer exists** | high | **high** | high |
| UI complexity | **lowest** — one text field, control type already proven | select — needs a new control type | two fields, needs both | **lowest** | low |
| conflicting-authority risk | **low** — one prose authority; supersession mechanism already exists | **high** — enum token vs prose in the same slot (D17) | **highest** — two authorities that can disagree ("postgraduate" + "primary pupils") | **low** | medium |
| registry compatibility | **exact fit** (text, like Topic/Goal) | needs `select`/`enum` UI support | needs both | **exact fit** | fit |
| requires AI | no | no | no | no | no |
| requires inventing a vocabulary | **no** | **YES** — V1 and V2 are incompatible | **YES** | **no** | no |

**Option B is the weakest despite feeling the most "typed":** it is the only one
that both requires inventing a canonical vocabulary *and* has no live consumer
to feed. A learner-level enum shipped today would be a governed parameter whose
value reaches no model — the precise failure mode S80 exists to eliminate.

## 13. Runtime authority stress test

| scenario | commissioned → runtime | safely steerable at Run? | collides with frozen state? | needs typed companion? | verdict |
| --- | --- | --- | --- | --- | --- |
| **A** | "First-year undergraduate history students" → "Postgraduate history students" | **YES** | `resolvedFactors.learner_level` stays `undergraduate`, but it is model-invisible, so nothing contradicts the prompt | no | **supportable** — prose changes, models see postgraduate |
| **B** | "Experienced NHS clinicians" → "Members of the public with no clinical background" | **partly** | frozen `learner_level` likely `advanced`; again invisible. **But** cognition packs and LO depth were compiled for clinicians and will *not* recompile | no | **supportable as steer, not as re-commissioning.** The largest honesty gap of the four |
| **C** | "…no GIS experience" → "…already proficient with GIS" | **YES** | nothing frozen encodes GIS proficiency — it was never typed | no | **cleanest case.** Free text is the *only* model that can express this change at all; no enum has a value for it |
| **D** | level `undergraduate` → free-text "Primary school pupils" | **YES for prompts** | direct semantic contradiction with the frozen enum — *if* the enum were ever projected. Today it is not, so no contradiction is visible | **this is the case that would need one** | **supportable today; would break under Option C** |

**Two conclusions.** Scenario C shows free text has expressive power no enum
offers. Scenario D shows that **adding the enum is what creates the collision** —
under Option A there is one authority and no conflict; under Option C there are
two, and PRISM would need precedence rules for "undergraduate" vs "primary
school pupils" with no way to detect the conflict deterministically.

Scenario B is the one requiring operator judgement: no parameter model can make
a Run-time audience change recompile cognition packs, so the UI must not imply
that it does.

## 14. Commissioned fallback candidates

**Audience — ranked:**

1. **`workflowBriefResolution.initialBrief.audience`** — *recommended, and now
   the only sound candidate.* Frozen at Create, never mutated, exactly the
   property S5 relied on for Goal, and it holds the author's verbatim prose.
   Verified present on a real saved LD workflow (fixture `:24`).
2. `workflowBriefResolution.resolvedFactors.audience` — **demoted on evidence.**
   I initially ranked this second. It is **not written under the
   learning-design pack** (§3), so for the primary domain it would resolve to
   nothing. Viable only for general/research configs, which makes it unusable as
   the single commissioned reader.
3. `workflowOutputSpec.audience` — **rejected**, on the explicit Goal lesson.
   It is mutable post-Create, so using it as "commissioned" authority would
   reintroduce D4 behind a provenance label. It may additionally hold a bare
   enum token rather than prose (D17).

Unlike Goal — where `resolveCommissionedWorkflowGoal` reads `initialBrief.goal`
with `initialBrief.designIntent` as an honest second key — **there is no second
frozen key for audience.** `initialBrief.audience` is a single read with no
fallback, which is simpler but means legacy records lacking `initialBrief`
project no commissioned Audience at all (the D11 pattern, extended).

**Learner level — separately:** the only authoritative frozen source is
`resolvedFactors.learner_level` (V1 vocabulary). It is clean and frozen. Its
problem is not provenance but the absence of a canonical vocabulary and of any
consumer.

## 15. Current post-Create mutability

**Yes — and it is the same authority defect as Goal, one slice behind.**

| question | answer |
| --- | --- |
| what does the UI edit? | `#workflowAudience` (`index.html:1202–1209`), free text, in the workflow detail pane |
| is it read-only? | **No.** `els.workflowAudience.readOnly = readOnlyTopLevel` (`app.js:27238–27240`) — read-only in Run mode only. Contrast `#workflowGoal`, which S5 made unconditionally `readOnly = true` (`27241–27246`) |
| is it persisted? | **Yes.** `gatherWorkflowDetailFormData` writes it on Save: `audience: (els.workflowAudience && els.workflowAudience.value) \|\| ""` (`app.js:32930`). Contrast Goal, which S5 changed to *preserve* rather than gather (`32929–32931`) |
| does it affect Run? | **Yes** — `Audience:` on step 1 (`33501`) |
| can it contradict frozen factors? | **Yes** — it can be edited to disagree with `resolvedFactors.audience` and `resolvedFactors.learner_level`, with no reconciliation |
| more than one authority? | **Yes, three:** `initialBrief.audience` (frozen), `resolvedFactors.audience` (frozen, feeds the page), `workflowOutputSpec.audience` (mutable, feeds the prompt). The prompt and the page can therefore state **different audiences for the same run** (**D13**, **D16**) |

This is precisely the D4 pattern, with one mitigating difference: audience has no
competing *typed* parameter yet, so the contradiction today is between prompt and
artefact rather than within a single prompt.

## 16. Page / artefact effects

| does audience affect… | evidence | verdict |
| --- | --- | --- |
| `page.audience` | `app.js:11902`; `lib/page-shell-create.js:205,402` | **YES, explicitly.** Schema-required and validated non-empty (`:39–48`, `:446`) |
| page title | `app.js:11894–11901` | **No** — precedence is `page_title` → `title` → effective Topic → workflow name → `"Learning page"`. S5's D5 fix removed prose fallbacks |
| learner-facing language | no deterministic code path found | **model interpretation only** — and today the model is not even given audience at the GAM stage that authors the wording |
| activity instructions | no code path | **model interpretation only** |
| assessment language | no code path | **model interpretation only** |
| renderer output | see below | **No — confirmed absent** |
| accessibility / reading level | no code path found | **No explicit effect** |

**Renderer visibility — now confirmed, not inferred.** My first pass recorded
this as high-confidence pending a targeted check; that check has been done and
the answer is definitive:

- The vNext renderer package (77 files under `lib/learner-renderer-vnext*`) has
  **zero occurrences of `audience` or `learner_level`**.
- `page.audience` is never copied into the page model
  (`lib/learner-renderer-vnext/build-page-model.js:239–249` builds `title`,
  `header {description, durationMinutes}`, outcomes, activities, assessment —
  no audience).
- The header renderer emits title, optional description and optional duration
  only (`lib/learner-renderer-vnext/render-page.js:37–63`). No badge, subtitle,
  metadata chip or footer entry.
- The one audience-rendering path in the codebase (`app.js:51590–51594`,
  `"<p><strong>Audience:</strong> …"`) is **doubly unreachable** for pages: the
  legacy structured renderer refuses page artefacts outright
  (`app.js:51576–51582`, S74A-T-045), and the guard itself suppresses the line
  for learner profiles (`utilityShouldShowPageAudienceLine` /
  `utilityIsLearnerPageProfile`, `app.js:39754–39766`). It survives only for
  slide-deck / generic-document / assessment-catalogue artefacts.

**Also confirmed: audience is protected from mutation.** `audience` is *not* in
`DESIGN_PAGE_OWNED_TOP_LEVEL_FIELDS` (`lib/page-vnext-assemble.js:41–45`), is
warning-only on absence (`:523–525`), is in `GAM_PRESERVED_TOP_LEVEL_KEYS`
(`lib/page-gam-enrich.js:116–124`), and every enrich contract forbids the model
from touching shell fields. So the lifecycle is: **written once from a constant,
presence-checked three times, protected from rewrite by every stage, and read by
nothing.**

**Net:** audience's only deterministic artefact effect is a metadata field
carrying the constant `"Learners"` that is never displayed. Every effect an
author would actually notice is mediated by model interpretation of prompt text
— which is exactly why the step-1-only projection is the thing that matters.

## 17. Parameterisation feasibility

| candidate | classification | what would be needed to make it truthful |
| --- | --- | --- |
| **Audience free text** | **YES_TEXT** | Registry declaration (`type: text`); commissioned resolver over `initialBrief.audience`; `supersedesCommissionedContextFields: ["audience"]` to retire the step-1 line. **No new UI control type, no new projection.** Optionally: make `#workflowAudience` read-only (S5 disposition C) to remove the second authority |
| **Learner level enum** | **NEEDS_REPAIR** | (1) choose or invent a canonical vocabulary — V1 and V2 share 2 of 5 values; (2) build its **first real consumer**, since no prompt receives it today; (3) define precedence against audience prose (Scenario D). Three unresolved decisions, none of them a parameter problem |
| Prior knowledge / experience | **NOT_USEFUL** *(as a separate v1 field)* | No store, no consumer, and it is the dimension free-text audience already expresses best |
| Professional role / context | **NOT_USEFUL** *(separate field)* | Same — already expressible in prose |
| Educational stage | **CREATE_ONLY** today | This is what `learner_level` is; see above |
| Accessibility / language proficiency | **NOT_USEFUL** *(v1)* | No store, no consumer, and no evidence of demand in the current product |

## 18. Extensibility assessment

**Free-text Audience does not block later typed dimensions, provided it is
declared as *audience description* rather than as *the audience object*.**

Why it coexists cleanly: the post-S6 projector already renders two distinct
sections — typed scalars under "Authoritative workflow parameters for this run",
and prose under "Workflow-wide intent". Goal already occupies the prose section
and Duration the typed one, and they coexist with an explicit precedence
sentence. A future typed `learner_level` would land in the typed block and
**structurally outrank** audience prose with no wording change — the generic
subordination clause S5 wrote for exactly this purpose:

> "This is the author's intent for this run. It is subordinate to the
> authoritative workflow parameters above: where it names a different value for
> one of them, that parameter wins."

So `prior_knowledge`, `professional_role`, `educational_stage`,
`accessibility_needs` and `language_proficiency` could each be added later as
typed parameters without redesigning Audience.

**The failure mode to avoid.** A single field labelled "Audience" that the
product *interprets* as authoritative for stage would prevent a later typed
stage parameter, because two authorities would claim the same fact with no
deterministic resolution. Audience must therefore be declared as **prose
context**, explicitly not parsed — the Goal contract, reused. If instead it were
declared as a typed field with parsing, it would become a semantic monopoly.

## 19. Relationship to Goal

Could the author just write "Create this for postgraduate history students" in
Goal? **Technically yes — Goal is already governed prose projected to every
eligible step. So this question is genuinely live, not rhetorical.**

| criterion | audience inside Goal | explicit Audience parameter |
| --- | --- | --- |
| discoverability | poor — nothing prompts the author to state an audience | **good** — a labelled field, and Create already asks "Who is this for?" |
| authority | same prose tier as everything else in Goal | same tier if declared as prose — **no gain** unless typed |
| reuse | poor — to change audience you must rewrite a paragraph, risking unintended changes to purpose | **good** — change one field, leave purpose intact. This is the strongest argument |
| prompt projection | already works | identical mechanism — **no gain** |
| conflict with typed parameters | already handled | identical |
| page metadata | Goal does **not** feed `page.audience` | **only an Audience parameter can** truthfully feed `page.audience` — a real gain |
| future extensibility | audience buried in prose can never be typed later | **a named field can later gain a typed companion** |

**Honest assessment: the marginal gain over Goal is real but narrower than it
first appears.** Projection and authority are identical. The genuine gains are
three: (1) **separability of reuse** — changing audience without rewriting
purpose, which is the core Adjustments value proposition; (2) **`page.audience`
truthfulness**, which Goal structurally cannot provide; (3) **discoverability**,
since Create already asks the question and the answer currently reaches only
step 1.

This is a case where the operator should weigh whether those three gains justify
a fourth parameter. They are not overwhelming, and "defer Audience, tell authors
to use Goal" is a defensible position that this diagnostic does not rule out.

## 20. Relationship to the Topic / Duration architecture

**Audience fits the proven architecture exactly, with no owner-specific
consumer required.**

| architecture element | Audience needs |
| --- | --- |
| registry declaration | one row, `type: text`, `projection: workflowContext` — identical shape to Topic |
| commissioned resolver | one function over `initialBrief.audience` — identical shape to `resolveCommissionedWorkflowGoal` |
| effective run context | **no change** — the shared resolver already handles text |
| shared `workflowContext` projection | **no change** — Audience would appear on every eligible step automatically |
| declarative Adjustments UI | **no change** — text input already rendered from the registry |
| supersession of the legacy line | **no change** — `supersedesCommissionedContextFields: ["audience"]` already exists, and S5 added a test proving the mechanism is live and generic using `audience` as its example |

**Is an owner-specific consumer needed, analogous to DLA's Duration
consumption?** **No — with one optional exception.** Duration needed one because
a canonical contract asserted a false hardcoded number. Nothing analogous exists
for audience: no canonical contract asserts an audience. The optional exception
is the **page-shell audience carrier** (`app.js:11902`), which today reads only
`resolvedFactors.audience` and would not see an adjustment. Wiring that to the
effective value would be one bounded call site — structurally the same size as
the S6 D1 repair, and it is what would make `page.audience` truthful.

## 21. Smallest truthful v1 — recommendation

**Recommended: Option A — Audience free text only.** Learner level deferred, not
rejected.

Reasoning, in order of weight:

1. **It needs no invented vocabulary.** Option B or C would force a choice
   between two incompatible enums or a third new one. That is a vocabulary
   decision masquerading as a parameter feature.
2. **It has a live consumer already.** Audience prose is the only audience-like
   value that reaches a model today. A learner-level enum has none — shipping it
   would create a governed parameter that changes nothing.
3. **It removes a real defect as a side effect.** Declaring Audience lets the
   existing supersession mechanism retire the ungoverned step-1 line, and gives
   the D13 mutable field the same disposition-C treatment Goal received.
4. **It is the only model that expresses Scenario C** ("no GIS experience" →
   "already proficient"), which no enum can represent.
5. **It avoids the Scenario D collision entirely**, because there is one
   authority rather than two.
6. **It extends the architecture to a fourth parameter with zero new
   mechanism**, which is itself useful evidence.

Deliberately excluded from v1: learner level, prior knowledge, role, stage,
accessibility, language. Each is either already expressible in the prose or has
no consumer.

**A defensible alternative the operator may prefer: Option D-as-defer** — ship
nothing and direct authors to Goal (see §19). The case against Audience is
weaker than the case for it, but it is not empty, and the deciding factor is
whether `page.audience` truthfulness and audience/purpose separability are worth
a fourth field.

## 22. Expected implementation touch points

| # | touch point | nature |
| --- | --- | --- |
| 1 | `ADJUSTMENTS_PARAMETER_DECLARATION_SOURCE` — one row | the declaration |
| 2 | `resolveCommissionedWorkflowAudience` | commissioned resolver over `initialBrief.audience` |
| 3 | `supersedesCommissionedContextFields: ["audience"]` on the declaration | **no code change** — mechanism exists and is tested |
| 4 | *optional bounded repair:* `#workflowAudience` → unconditional read-only; stop gathering it on Save | S5 disposition C, two sites (`app.js:27238`, `32930`) |
| 5 | *optional bounded repair:* page-shell audience carrier reads the effective value | one call site (`app.js:11902`) — makes `page.audience` truthful |
| 6 | tests | A–D matrix, projection, supersession, precedence vs Goal, page-audience truthfulness |

**Zero new UI control types. Zero prompt-builder edits. Zero new projection
mechanism.**

## 23. Cost / risk assessment

**Cost: LOW.** Items 1–3 are the same shape as Topic, which was the cheapest
slice in the sprint. Items 4–5 are each a bounded single-concern repair, both
optional and independently rollback-able.

**Risk: LOW–MEDIUM**, concentrated in one place: item 4 changes a field authors
can currently edit. S5 has already walked this exact path for Goal, including
the legacy-record fallback problem, so the pattern is known rather than novel.

**No architectural warning triggered.** If an implementation attempt required
per-stage audience prose in multiple prompt builders, that would contradict this
assessment and should stop the slice.

## 24. New defects / debt

Continuing the sprint numbering (D12 was recorded in S6).

| id | defect | evidence | severity |
| --- | --- | --- | --- |
| **D13** | `#workflowAudience` is a mutable post-Create authority feeding step-1 prompts — the D4 pattern, unfixed | `app.js:27238–27240` (editable), `32930` (gathered on Save), `33501` (model-visible) | **MEDIUM** — blocks truthful Audience parameterisation |
| **D14** | Incompatible learner-level vocabularies: V1 and V2/V3 share 2 of 5 values, and `mappingRules` maps directly across them with no converter, writing values invalid for the target control | pack `:395–400` vs `:1371–1383`; mapping `:1577–1581` | **MEDIUM** — blocks any typed learner level |
| **D15** | `mappingRules` targets `stepParams.step_design_page.audience_level`; no control with that key is declared anywhere | pack `:1712–1715`; zero declarations found | LOW |
| **D16** | The page artefact's `audience` reads `resolvedFactors.audience`, a key **never written under the LD pack**, so every LD learner page carries the constant `"Learners"` while a real commissioned audience sits in `initialBrief.audience` and real prose goes to the step-1 prompt. Prompt and artefact state different audiences for the same run | `app.js:11902` vs `33501`; fixture `educational-psychology-post-s68/workflow.json:24` vs `:74–97` | **MEDIUM** (metadata only — `page.audience` is never rendered, §16) |
| **D23** | `cognitive_demand` and `cognitive_emphasis` are two incompatible vocabularies for one concept, with no mapping rule and no converter — the same defect class as D14 | pack `:521–527`/`:1253–1258` vs `:3090–3099` | LOW (out of Audience scope; recorded for the Assessment slice) |
| **D24** | `audience` is a declared brief factor in the general fallback (`app.js:7451`) and the research pack (`:227–231`) but **not** in the learning-design pack, so identical author input persists differently by domain. This asymmetry is the root cause of D16 | compare `app.js:7451–7468` with LD required factors `:386–410` | **MEDIUM** — decide deliberately when declaring Audience |
| **D17** | When the author leaves audience blank, `workflowOutputSpec.audience` is filled with a bare `learner_level` token, so models receive `Audience: undergraduate` as though it were audience prose | `app.js:36715–36718`; mapping `:1579` | LOW–MEDIUM |
| **D18** | Audience prose is concatenated into the Create inference blob, so audience wording can silently set topology-effective factors (`delivery_context`, `duration_minutes`, assessment cues) | `app.js:19235` + regexes `19279–19310` | **MEDIUM** — surprising to authors; not a parameter blocker |
| **D19** | `weakAudienceCue` refinement machinery is unreachable: 7 occurrences in `app.js`, zero packs declare it | `app.js:17693–17712`, `17887–17889` | LOW (dead code) |
| **D20** | `learner_level` is taken from the **first** level token in a seven-field concatenated blob, so a level mentioned in `designIntent` overrides an explicit audience field | `app.js:19235`, `19285–19288`; fixture `maximal-factor-rich.json:52,58` | LOW–MEDIUM |
| **D21** | The LO artefact's `learner_level` output is an unconstrained free string; a test fixture uses `general_adult`, a V2 value in a V1-named field, validated by nothing | `lib/workflow-artefact-json-strict.js:522`; `tests/workflow-artefact-json-strict.test.js:68` | LOW |
| **D22** | The canonical page-shell prompt exemplar shows `"audience": "Learners"` to the model, which may anchor output away from the real audience | `lib/page-shell-create.js:225` | LOW |

None fixed, per instruction.

## 25. Unresolved questions requiring operator judgement

1. **Is Audience worth a fourth parameter given that Goal already carries prose
   to every step?** §19 finds three real gains (reuse separability,
   `page.audience` truthfulness, discoverability) but they are narrower than the
   Topic/Duration cases. This is the primary decision.
2. **Should Audience be projected to all steps, or kept to the stages that
   author learner-facing wording?** The shared projector is all-or-nothing per
   parameter today. All-steps is cheaper and consistent with Topic/Duration.
3. **Should the mutable `#workflowAudience` receive S5's disposition C
   (read-only) in the same slice, or be left as recorded debt?** Leaving it
   creates two authorities the moment Audience is declared.
4. **Should `page.audience` become truthful in the same slice** (item 5), or is
   metadata that is probably never rendered not worth the call-site change?
5. **For a future learner level: which vocabulary?** V1 (`beginner…postgraduate`,
   mixes proficiency with stage) or V2 (`school…general_adult`, stage plus
   `general_adult`). Neither is a clean stage vocabulary. This is a product
   taxonomy decision, not an engineering one.
6. **How should the UI communicate that a runtime audience change steers wording
   but does not recompile cognition packs or topology** (Scenario B)? Getting
   this wrong would overclaim.

## 26. Files inspected

- `app.js` — audience/level inventory, Create UI wiring, brief extraction and
  inference (`19227–19310`), mapping application (`20263–20340`), Create
  assembly precedence (`36540–36718`), confirmation message (`21056–21098`),
  runtime context (`33481–33532`), step-1 prepend (`32313–32326`), page shell
  (`11880–11907`), page composition context (`50246–50290`), detail
  populate/gather (`31232–31246`, `32923–32933`), mode gating
  (`27231–27246`), refinement audience-cue machinery (`17620–17712`,
  `17860–17891`), general fallback brief config (`7451–7468`)
- `domains/learning-design/domain-learning-design-step-patterns.md` —
  elicitation factors (`393–470`), inference rules (`750–821`), workflow
  parameter controls (`930–1400`), LS step controls (`1517–1528`), mapping rules
  (`1575–1730`), LO prompt template and `userOptions` (`2400–2440`)
- `domains/research/domain-research-step-patterns.md` — the only declared
  `audience` factor (`225–232`)
- `lib/page-shell-create.js` — shell audience (`203–208`, `398–406`), schema
  (`39–47`), validator (`446`), model-visible exemplar (`224–226`)
- `lib/workflow-artefact-json-strict.js` — LO `learner_level` output (`522`)
- `lib/page-vnext-assemble.js` (`41–45`, `523–525`), `lib/page-gam-enrich.js`
  (`116–124`), `lib/page-dla-enrich.js` (`2367–2379`) — audience preservation
  and presence validation
- `lib/learner-renderer-vnext/build-page-model.js` (`239–249`),
  `lib/learner-renderer-vnext/render-page.js` (`37–63`), and the vNext renderer
  package (77 files) — **confirmed zero audience/level references**
- `app.js:51576–51594`, `39754–39766` — the unreachable legacy audience line
- `app.js:33377–33408` (`buildWorkflowSummaryText`), `34995–35052`
  (`buildPromptFactoryWorkflowContextText`), `27418–27425` — the two non-Run
  `Audience:` emission sites
- `domains/research/domain-research-step-patterns.md:1115–1123` —
  `audience_style`, checked and excluded as a register vocabulary
- Sibling enum precedents: pack `:382`, `:598–602`, `:1067–1071`, `:3106–3110`
  and `app.js:5110–5113` (`difficulty_profile` converter); pack `:521–527`,
  `:3090–3099` (`cognitive_demand` vs `cognitive_emphasis`)
- `index.html` — the three audience inputs (`291–294`, `840–847`, `1202–1209`)
- Fixtures/tests as corroboration: `tests/fixtures/workflow-brief-pass1/maximal-factor-rich.json`,
  `tests/fixtures/educational-psychology-post-s68/workflow.json`,
  `tests/workflow-ld-profile-thinning.test.js`,
  `tests/workflow-step-parameter-controls.test.js`,
  `tests/workflow-artefact-json-strict.test.js`,
  `tests/s75-d24-hide-resolved-brief-panel.test.js`

## 27. Tests / probes used

**No tests were written or run, and no code was executed.** This diagnostic is
based on static reading of production source, domain packs and existing test
fixtures. Existing fixtures were used as *corroborating evidence* for runtime
shapes that would otherwise be assertions, and in one case they overturned a
first-pass conclusion:

- `tests/fixtures/educational-psychology-post-s68/workflow.json` — a real saved
  LD workflow. **The decisive probe.** Lines `13`, `24`, `100` and `74–97`
  together prove the full audience precedence chain *and* that
  `resolvedFactors.audience` is absent under the LD pack.
- `tests/fixtures/workflow-brief-pass1/maximal-factor-rich.json` — shows
  `resolvedFactors` carrying audience prose and `learner_level` together under a
  `general` + `learning-design` selection, which is what first suggested (wrongly)
  that this holds for LD alone.
- `tests/workflow-ld-profile-thinning.test.js` — proves `learner_level` is
  excluded from required elicitation queues.
- `tests/workflow-artefact-json-strict.test.js:68` — a V2 value in a V1-named
  field, evidencing D21.

The disagreement between the two audience fixtures is what prompted the direct
check of the real workflow record, and is worth remembering: **`workflow-brief-pass1`
fixtures are not representative of the LD-only resolution path.**

## 28. Files changed

- **Added:** this record.
- **Modified:** `STATUS.md` and `next-chat-briefing.md` — pointer entries only,
  to make this diagnostic discoverable.
- **No production files changed.**

## 29. Acceptance assessment

All 23 numbered requirements addressed from code evidence. The three findings I
consider load-bearing, each independently verified:

1. **No canonical learner-level vocabulary exists** — five value sets, 2-of-5
   overlap between the two that matter, no converter.
2. **Learner level reaches no prompt** — three read sites in `app.js`, none
   prompt-related; both potential routes dead.
3. **A frozen commissioned Audience source already exists** and already feeds the
   page artefact, while a *mutable* sibling feeds the prompt.

**One first-pass claim was corrected during review.** I initially ranked
`resolvedFactors.audience` as a viable frozen commissioned source. Parallel
verification against the real saved LD workflow fixture showed the key is
**never written under the learning-design pack**, so it is unusable for the
primary domain. This demoted §14 candidate 2, reclassified the `"Learners"`
fallback from B to A, and sharpened D16. It also *strengthens* the §20
recommendation, since `initialBrief.audience` — the source S5's Goal pattern
already established — becomes the single obvious reader.

Renderer visibility of `page.audience` (§16) was upgraded from high-confidence
to confirmed absent.

Remaining stated limit: the §11 architectural-judgement column is explicitly
opinion, kept separate from the evidence column.

No product decision taken. No defects fixed. No production code changed.

## 30. Recommended next action

**Operator decision on question 1 of §25:** does Audience earn a fourth
parameter, given that Goal already carries prose to every step?

- If **yes** → authorise a bounded slice implementing **Option A** (free-text
  Audience only), explicitly deciding §25 questions 3 and 4 up front, since both
  concern whether the slice removes the second authority or records it as debt.
- If **no** → record Audience as deferred with the D13–D24 debt registered, and
  consider the **UI capability cue** instead (T-009 scenarios D/E), which
  remains the strongest independent candidate and is unblocked.

Either way, **learner level should not be attempted until D14 is resolved**: it
is a vocabulary decision, not a parameter one.
