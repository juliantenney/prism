# S80-S6 — Duration parameter + D1 hardcoded DLA timing repair

**Status:** COMPLETE — ACCEPTED (operator 2026-08-28)
**Authorised scope:** Duration as a typed workflow parameter, plus the D1 canonical
DLA timing repair only as far as required to make Duration truthful.
**Explicitly out of scope and not done:** Audience, Assessment parameters, D2
cognition bypass, D3 LS step-param revival, general DLA cleanup, legacy Settings
cleanup, Learning Sequence redesign, AI interpretation, topology change.

---

## 1. Product contract

Duration is the author's available time / target duration for one run of a saved
workflow. It is deterministic: changing it performs no model call, reruns no
elicitation, changes no topology, rewrites no `resolvedFactors`, alters neither
Topic nor Goal, writes no `PRISM_STEP_PARAMS`, and uses no `selectedOptions`.

Authority, unchanged from S5 and now inherited by Duration for free:

```
hard contracts / topology / schemas
  > typed workflow parameters (Topic, Goal-as-prose is NOT one of these; Duration IS)
  > runtime Goal prose
  > per-step Additional Instruction
  > stage discretion
```

Duration sits in the typed block, so it structurally outranks contradictory Goal
or Additional Instruction prose without any semantic parsing of that prose.

## 2. Registry declaration

One row in `ADJUSTMENTS_PARAMETER_DECLARATION_SOURCE`:

| field | value |
| --- | --- |
| `id` | `duration_minutes` |
| `label` | `Duration` |
| `type` | `number` (first number-typed parameter) |
| `units` | `minutes` |
| `min` / `max` | `10` / `480` |
| `owner` | `workflow_run_context` |
| `projection` | `workflowContext` |
| `applicability` | `{ always: true }` |
| `resolveCommissioned` | `resolveCommissionedWorkflowDurationMinutes` |

### Range evidence (§2 STOP gate — resolved, no STOP required)

T-007 warned of "inconsistent ranges 15–240 vs 10–480". Current code shows the
conflict is not between two workflow-level declarations:

| declaration | scope | range | disposition |
| --- | --- | --- | --- |
| Create elicitation factor `duration_minutes` (`domain-learning-design-step-patterns.md:436–440`) | workflow / Create | **10–480** | adopted |
| Workflow parameter control "Session duration (minutes)" (`:978–983`, default `60`) | workflow | **10–480** | adopted |
| LS step control "Sequence duration (minutes)" (`:1517–1524`) | **step** | 15–240 | rejected |

The two workflow-level declarations agree exactly. The only dissenting range
belongs to the Learning Sequence *step* parameter, which §3 of the brief
explicitly excludes as authority and which D3 proved never reaches the model.
So 10–480 is both the range this product declares for the concept and the
narrowest one actually supported at workflow level. Nothing was invented.

Out-of-range values are rejected, not clamped, by the existing shared validator,
so an unsupported duration is never silently stored.

## 3. Commissioned fallback

`resolveCommissionedWorkflowDurationMinutes` reads exactly one source:

```
workflow.workflowBriefResolution.resolvedFactors.duration_minutes
```

It deliberately does **not** parse minutes out of the runtime Goal (Create
already did that once, at commissioning time; re-parsing at Run time would make
Duration depend on prose wording — the ungoverned behaviour D4/D6 removed), and
does **not** read the historical step-param value.

Provenance, via the unchanged shared resolver: `adjustment`, `commissioned`,
`absent`. Blank/cleared UI stores nothing at all — there is no `AUTO` sentinel.

## 4. D1 root cause and repair

`buildDlaWorkbookOverlayBlock()` in `lib/ld-dla-page-enrich-contract.js` took no
arguments and asserted three timing literals that were simply false for any
workflow not commissioned at 60 minutes:

| line | literal |
| --- | --- |
| 473 | `~60-minute learner workbook` |
| 493 | `session_duration_target_minutes (~60)` |
| 495 | `Sum of activity duration_minutes 50–70` |

**Confirmed live.** The production caller is
`buildDlaCanonicalSlotContext(context, wf)` in `app.js` (the §9 overlay slot of
`assembleLiveDlaCanonicalPrompt`), which called it with no arguments. Note the
T-007 line reference (`app.js:10338`) had drifted; the call site is now at
`app.js:10575`.

**Repair.** `buildDlaWorkbookOverlayBlock(options)` accepts an optional
`options.durationMinutes` and interpolates target and band into the three lines.
The production caller passes
`{ durationMinutes: resolveEffectiveWorkflowDurationMinutes(wf) }`. Omitted,
null, zero, negative and non-numeric values all fall back to 60.

No pedagogy retuned, no assembler restructured, no canonical ownership revisited,
no generic Settings ingress introduced.

## 5. Duration band rule

**Rule: ±10 minutes, with the lower bound floored at 5.**

```
target  = round(effective duration)
bandLow = max(5, target - 10)
bandHigh = target + 10
```

| duration | target | band |
| --- | --- | --- |
| 30 | ~30 | 20–40 |
| 60 | ~60 | **50–70** (unchanged) |
| 90 | ~90 | 80–100 |
| 10 | ~10 | 5–20 (floor applies) |

**Why ±10 and not something else.** This is not a new rule: the pre-S6 contract
paired a `~60` target with a `50–70` sum band, which *is* ±10. It therefore
reproduces the accepted text exactly at 60 — the property that makes the default
byte-identical. A proportional or percentage band would not.

T-007 is internally inconsistent here: its §8 says "±10 band" but its slice table
says "30 min → band 25–35" (±5). ±5 would render 60 as `55–65`, contradicting the
live contract, so the table row is the erroneous one. The brief's own worked
examples (20–40 / 50–70 / 80–100) confirm ±10.

The floor at 5 is the one addition: without it a 10-minute run would emit a lower
bound of `0`, which states no constraint at all.

## 6. Timing ownership

Preserved and now provable rather than incidental:

| role | owner |
| --- | --- |
| Author constraint / available total time | **Duration parameter** |
| Feasibility target + sum band for activity design | **DLA** (receives, does not allocate) |
| Authoritative per-activity allocation | **Learning Sequence** |
| Projection to badges / header | **Renderer** (copies LS values) |

Traced end to end:

```
Duration parameter (registry)
  → resolveEffectiveRunContext / resolveEffectiveWorkflowDurationMinutes
  → DLA §9 overlay target + sum band (constraint only)
  → LS prompt authoritative typed block ("Duration: 30 minutes")
  → LS output total_duration_minutes + per-block start_minute/duration_minutes
  → project-timeline-durations.js copies LS minutes onto activities
  → existing header/badge render
```

DLA is given a *total* target and a *sum* band. It is never given per-activity
start times or an allocation instruction, so it cannot become a second allocator.
The renderer reads no Adjustments state at all — asserted by test — so Duration
creates no second timing source.

## 7. Learning Sequence projection

No LS-specific plumbing, no step params, no D3 repair. Duration reaches LS purely
because it is declared with the `workflowContext` projection, which the shared
projector already applies to every eligible model-driven step. The LS pack
template already says "Enforce total duration compliance with configured
duration" — it previously had no reliable number to comply with, and now receives
one authoritatively.

## 8. All-step context (§9)

Duration appears as a single line in the existing compact authoritative block:

```
Authoritative workflow parameters for this run:
Topic: Elizabeth I
Duration: 30 minutes

These values are authoritative for this run. If any other text in this prompt …
the value above wins and the conflicting text is superseded.
```

No stage-specific timing prose was added anywhere. Design Episode Plan continues
to receive no projected parameters (S2 §7). The `units` noun is rendered by the
shared projector, so no prompt builder knows Duration is a duration.

## 9. UI / Auto behaviour

Rendered declaratively from the registry:

- `<input type="number" min="10" max="480" step="1">` plus a `minutes` unit label;
- blank = Auto; the commissioned value appears only as placeholder
  (`Auto — 60 minutes`) and status text, never prefilled;
- clearing the field deletes the stored entry and restores Auto;
- explicit values are stored only at `workflow.adjustments.parameters.duration_minutes`;
- exactly one duration control; the legacy "Session duration (minutes)" control
  does not appear in Adjustments;
- no implementation vocabulary (`resolvedFactors`, `provenance`,
  `PRISM_STEP_PARAMS`, `duration_minutes`) reaches the UI text — asserted.

## 10. Hardcoded time-literal audit (§13)

| literal | classification | disposition |
| --- | --- | --- |
| DLA overlay `~60` / `(~60)` / `50–70` (`ld-dla-page-enrich-contract.js:473,493,495`) | **A — contradicts Duration authority** | **FIXED** (this slice) |
| Create brief-inference `>= 45` design-scope thresholds (`app.js:19159,19611,19619`) | B — Create-time heuristic | Left alone; Duration does not rewrite `resolvedFactors` by contract |
| Create brief minute extraction `(\d{1,3})\s*minutes` (`app.js:19247–19250`) | B — Create-time only | Left alone; it produces the commissioned factor |
| Pack duration control defaults `60`, range 10–480 (`:436–440`, `:978–983`) | B — declaration/default | Left alone; adopted as the range evidence |
| LS step control range 15–240 (`:1517–1524`) | B — inert dead path (D3) | Recorded as debt with D3 |
| LO template `<= 30 minutes` outcome-count threshold (`:2402`) | C — conditional, consistent | Left alone; it asserts no duration, it reacts to one |

Exactly one A item existed. It is fixed. No repository-wide cleanup performed.

## 11. Extensibility checkpoint (§20)

**Production code sites changed to add Duration: 6, of which 4 are shared
architecture and 1 is the bounded D1 owner.**

| # | site | nature |
| --- | --- | --- |
| 1 | `ADJUSTMENTS_PARAMETER_DECLARATION_SOURCE` | **the declaration** |
| 2 | `resolveCommissionedWorkflowDurationMinutes` | parameter-specific commissioned resolver (the declaration's own hook) |
| 3 | `validateAdjustmentsParameterDeclaration` / `normalizeAdjustmentsParameterDeclaration` | shared: `units` support |
| 4 | `formatAdjustmentsParameterValueForDisplay` + `buildEffectiveWorkflowContextLines` | shared: unit-aware projection |
| 5 | `renderAdjustmentsWorkflowParametersSection` | shared: number bounds + unit label |
| 6 | `buildDlaCanonicalSlotContext` (+ `resolveEffectiveWorkflowDurationMinutes`) | **bounded D1 owner consumption** |

**Zero prompt builders were edited.** No stage-specific timing prose was added.
`resolveEffectiveWorkflowDurationMinutes` is called from exactly one consumer
(the D1 owner) — asserted by test, so a future stage quietly re-interpreting
duration will fail the suite. This is the healthy shape §20 describes; the
architecture generalised from text to number without a bespoke path.

## 12. Tests

New: `tests/s80-s6-duration-parameter.test.js` — **32 tests, 32 passing.**

- registry declaration, `units`, bounds, rejection of out-of-range values;
- commissioned source; proof that Goal prose minutes are not adopted;
- A–D matrix (60/commissioned, 30/adjustment, 90/adjustment, cleared→commissioned);
- string coercion from a DOM input;
- immutability: `resolvedFactors`, topology, `workflowOutputSpec` unchanged; no
  `fetch`; no `PRISM_STEP_PARAMS`; no `{{option:}}`;
- **D1 byte identity** — compares against `git show HEAD:` of the contract file,
  proving the default and an explicit 60 both reproduce the accepted text exactly;
- D1 source assertion that no `~60` / `50–70` literal remains;
- band rule at 30/60/90/10; fallback for null/0/negative/non-numeric;
- **D1 live path** at 30 and 90 through `buildDlaCanonicalSlotContext`, plus the
  unadjusted case;
- ownership: DLA target-only, LS artefact owns `total_duration_minutes` /
  `start_minute`, renderer copies and reads no Adjustments;
- **LS projection** at 30 then 90 through the live assembled prompt;
- once-per-step projection; Episode Plan exempt;
- adversarial precedence: Duration 30 vs a 90-minute Goal vs "use around an hour"
  — ordering asserted, and the conflicting prose asserted *still present*
  unrewritten, proving precedence is structural;
- four-layer composition (Topic / Duration / Goal / instruction);
- Topic/Goal/page-title/workflow-name safety, plus D4/D5/D6 regressions;
- UI: number input, bounds, unit label, Auto placeholder, clear-to-Auto, single
  control, no implementation vocabulary;
- persistence normalization, including dropping an out-of-range stored value.

Updated (expected-count only, three assertions): registry allowlist ids in
`s80-s1-adjustments-parameter-registry.test.js`; two rendered-parameter counts and
one sorted-id list in `s80-s4-adjustments-ui-repurpose.test.js`.

**Focused set: 230/230 passing** (S1, S2, S3, S4, S5, S6, unified settings, DLA
canonical assembler, DLA Phase D retirement, S78-T-041, coherence bridge).

## 13. Regression

Failing-location comparison against the pre-Duration baseline (D-014 makes raw
counts unstable):

```
baseline failing locations: 393
post-S6  failing locations: 393
new failures: none
fixed:        none
```

**Zero new failing locations.** One pre-existing failure touching DLA
(`tests/s78-dla-diagnostic-review.test.js:371`, a `copyOwnFieldIfPresent(rm, row,
"diagnostic_review")` source assertion against `app.js`) is present identically in
the baseline and was not touched. No unrelated failures fixed, no goldens
refreshed.

## 14. Remaining risks and debt

- **§12 renderer timing is verified as compatible, not exercised end to end.**
  The projection chain is proven by contract and static assertion. Whether an LS
  model actually honours a 30-minute target in its emitted
  `total_duration_minutes` is a live-run question, not a deterministic one, and
  was not fabricated here.
- **D2** (DLA cognition bypass) and **D3** (LS step param never reaches the
  model) remain open by instruction. D3 is now routed around rather than fixed.
- The LS step control's 15–240 range remains declared and inert. It should retire
  with the step-param catalogue, not separately.
- Create-time `>= 45` design-scope inference still uses the commissioned duration
  only. A workflow commissioned at 60 and run at 30 keeps `design_scope: session`.
  That is correct under the stated contract (Duration does not rewrite
  `resolvedFactors`), but it is worth an explicit operator decision if Duration
  is ever expected to change scope.
- Goal prose and Duration can still visibly disagree in a prompt. That is by
  design: precedence is structural and the author's words are preserved.

## 15. Acceptance assessment

All 23 numbered requirements addressed. The two STOP gates (§2 range ambiguity,
§6 band-rule consistency) were investigated and resolved on code evidence rather
than assumption, and neither required a STOP. The §20 extensibility checkpoint
passed: no prompt builder needed a bespoke edit.

**Recommended next action:** operator review of S6, then authorise Audience as
the next slice — it is the cheapest remaining parameter and would extend the
registry a third time without touching canonical contract text.
