# S80-S7 — Audience as the fourth governed workflow parameter

**Status:** IMPLEMENTED — awaiting operator review
**Date:** 2026-08-27
**Authority:** operator authorisation of a bounded implementation slice, on the
basis of accepted diagnostic [S80-T-010](S80-T-010-audience-learner-level-runtime-parameter-diagnostic.md)
**Predecessors:** [S80-S5](S80-S5-goal-authority-and-goal-adjustment.md) (Goal
authority repair, disposition-C pattern), [S80-S6](S80-S6-duration-parameter-and-d1-timing-repair.md)
(Duration)

---

## 1. Executive conclusion

Audience is now a governed workflow parameter, and there is exactly **one**
runtime Audience authority spanning Adjustments → prompts → page artefact.

Before this slice T-010 found three competing audience stores: frozen
`initialBrief.audience`, frozen `resolvedFactors.audience` (which feeds the page
artefact but is *never written under the learning-design pack*), and mutable
`workflowOutputSpec.audience` (which fed the step-1 prompt and stayed editable
after Create). The prompt and the page could therefore state different audiences
for the same run, and on a pure LD workflow the page artefact carried the
constant `"Learners"` while real audience prose went to the model.

All three are now reconciled behind one resolver. The frozen commissioned
Audience is preserved and clearly presented as commissioning history; the runtime
Audience lives only in `adjustments.parameters.audience`; both the projected
prompts and `page.audience` read the same effective value.

**D13 and D16 are closed.** The learner-level vocabulary problem, the Create-time
inference behaviour and the canonical exemplar are deliberately untouched.

## 2. Slice status

| Item | Outcome |
| ---- | ------- |
| Registry declaration | Done |
| Commissioned resolver + legacy rule | Done |
| Resolver/provenance | Inherited unchanged |
| Adjustments UI | Done, with **no** Audience-specific rendering branch |
| Prompt projection | Done, through the existing shared projector only |
| `#workflowAudience` retirement | Done (disposition C) |
| Legacy step-1 Audience authority | Removed |
| `page.audience` repair | Done |
| `"Learners"` exemplar | Investigated → **left in place**, D22 retained |
| Create-time inference | Unchanged, with negative guarantees under test |
| Tests | 61 new; 6 pre-existing assertions updated |
| Regression | **Zero new failing locations** |

## 3. Audience semantic contract

Audience means *the people this run is intended for, expressed as author-written
descriptive context*.

It is opaque prose. Nothing parses it, and it is explicitly **not** a
`learner_level`, an educational-stage or proficiency enum, a topology
instruction, a trigger for elicitation, a cognition-pack selector at Run, or a
source of typed factors. No value is derived from it at Run time.

## 4. Registry declaration

```
id:            audience
label:         Audience
type:          text          (single-line, NOT multiline)
owner:         workflow_run_context
projection:    workflowContext
applicability: { always: true }
resolveCommissioned: resolveCommissionedWorkflowAudience
```

`app.js` — appended to `ADJUSTMENTS_PARAMETER_DECLARATION_SOURCE` as the fourth
entry.

**Why single-line `text` rather than `multiline`.** This is a semantic choice,
not a layout one. Single-line parameters render into the *authoritative workflow
parameters* section of the projected block, alongside Topic and Duration;
`multiline` parameters (Goal) render as subordinate prose. Declaring Audience
single-line is therefore what makes it structurally outrank contradicting Goal
prose and per-step Additional Instruction — with **no new precedence wording**
(see §9).

**No `supersedesCommissionedContextFields` entry** — see §11 for why the generic
mechanism could not express this ownership correctly.

## 5. Commissioned fallback source and legacy fallback rule

`resolveCommissionedWorkflowAudience(wf)` reads three sources in descending order
of how frozen they are:

| # | Source | Frozen? | Rationale |
| - | ------ | ------- | --------- |
| 1 | `workflowBriefResolution.initialBrief.audience` | Yes | Written once at Create from the author's "Who is this for?" answer, never mutated. The only dependable source (T-010 §14). |
| 2 | `workflowBriefResolution.resolvedFactors.audience` | Yes | Not written under the LD pack, so it cannot be primary — but where a config *does* declare an `audience` factor (general fallback, research pack) it is genuine frozen commissioning data, not a derived guess (T-010 D24). |
| 3 | `workflowOutputSpec.audience` | No — **but gated** | Only for records with **no `workflowBriefResolution` at all**. |

**The legacy rule, stated precisely.** Source 3 is gated on the *absence* of a
frozen brief. Those records pre-date the frozen-brief structure, so the spec
field is the only commissioning record that has ever existed for them — the same
narrow allowance S5 documented for Goal derivation, and after this slice the
field is no longer author-editable, so it is not a mutable-state read in
practice.

Where a frozen brief **exists** but records no audience, the resolver returns
empty rather than promoting the spec value. This is the load-bearing decision:
in that situation the spec value may be a post-Create edit, and labelling it
"commissioned" would be a lie. It is also exactly what makes §11's required
proof hold. No destructive migration was needed, so the STOP condition in the
brief's §8 was not reached.

## 6. Resolver / provenance behaviour

Inherited from `resolveEffectiveRunContext` with no change:

| Case | Effective | Provenance |
| ---- | --------- | ---------- |
| No adjustment + commissioned present | commissioned | `commissioned` |
| Explicit non-blank adjustment | adjustment | `adjustment` |
| Blank/whitespace adjustment | commissioned | `commissioned` |
| Neither | absent | `absent` |

Blank means Auto. No AUTO sentinel, no second store. `resolveEffectiveWorkflowAudience(wf)`
is the single reader, mirroring `resolveEffectiveWorkflowDurationMinutes`.

## 7. Adjustments UI behaviour

Renders entirely from the registry through the existing text control — **no
Audience-specific branch was added**, and none was needed.

```
Audience
[                                        ]   placeholder: Auto — First-year undergraduate history students
Auto — using the value this workflow was created with: First-year undergraduate history students
```

The commissioned value is shown as placeholder and status text, never prefilled.
Clearing the field deletes `adjustments.parameters.audience` and restores Auto.

**§18 UI honesty:** the existing panel copy — *"Reuse this workflow with
different values. Leave a field blank to keep the value it was created with."* —
already establishes that these values steer the current run. No wording change
was required, and a test asserts the surface never says *rebuild*, *recompile*,
*regenerate the workflow* or *re-elicit*.

One narrow copy fix was required elsewhere: the Create-side Audience helper text
was being overwritten at runtime from domain UI hints, which describe an
*editable* audience field. That overwrite is removed, so the read-only field's
explanation (pointing at Adjustments) survives. Goal has the same latent
overwrite; it is pre-existing and out of scope.

## 8. Projection coverage

Audience reaches every step already eligible for workflow-context projection, via
`resolveEffectiveRunContext` → `buildEffectiveWorkflowContextLines` →
`buildEffectiveWorkflowContextBlock` → existing ingress. **No prompt builder was
edited.** Design Episode Plan keeps its existing derived-shell exemption
unchanged.

A source-level test pins that the effective Audience has exactly two call-shaped
readers: its own definition and the single bounded page-artefact consumer.

## 9. Topic / Goal / Duration / Audience precedence and composition

All four compose through the one registry-driven mechanism, producing a single
authoritative block per prompt:

```
Authoritative workflow parameters for this run:
Topic: Elizabeth I
Duration: 90 minutes
Audience: Postgraduate history students

These values are authoritative for this run. …

Workflow-wide intent for this run (Goal):
…
```

**Adversarial proof (brief §7), under test.** With Audience adjusted to
"Postgraduate history students", Goal saying *"Create an introductory resource
for primary school pupils."* and a step Additional Instruction saying *"Write
this for complete beginners."*: Audience sits in the authoritative block above
both, both pieces of prose survive **verbatim**, and no prose is parsed or
rewritten. A further test asserts Audience appears only as its own value line and
never inside precedence wording — no Audience-specific language was added.

## 10. `#workflowAudience` disposition — C

Following S5's Goal pattern exactly:

| Aspect | Before | After |
| ------ | ------ | ----- |
| Label | "Audience (learner-facing run)" | "Audience this workflow was created for" |
| Helper text | domain hint about end users | explains read-only, points at Adjustments |
| Editable | yes, post-Create | **never** — `readOnly = true` unconditionally, in all modes |
| Value shown | `workflowOutputSpec.audience` | frozen commissioned Audience |
| Gathered on Save | yes → became runtime authority | **no** — the stored value is preserved, not read from the DOM |

Stored legacy values are **not destroyed** (brief §17) and are **never silently
migrated** into Adjustments. A test tampers with the DOM value and asserts Save
ignores it.

## 11. Legacy step-1 Audience disposition — removed outright

`buildWorkflowRuntimeContextText` no longer emits `Audience: <workflowOutputSpec.audience>`.

**This is a documented deviation from the brief's suggested mechanism, and the
reason matters.** The brief proposed `supersedesCommissionedContextFields: ["audience"]`.
That mechanism fires only when provenance is `adjustment`, so with Audience on
**Auto** the legacy line would still emit — and a workflow whose frozen brief
says "Undergraduate students" while a historical edit left "Senior executives" in
the spec would emit both, contradicting itself with no adjustment present at all.
Closing D13 requires governance to be unconditional, which the generic mechanism
cannot express.

Removing the line is not an Audience-specific string deletion: it is precisely
the disposition S5 applied to the `Goal:` line for the same reason, and it is why
no supersession entry is declared (S5 likewise retired Topic's `["goal"]` entry).
The generic mechanism remains live and generic — the S4 probe test that exercised
it was retargeted from `audience` to `constraints`, a field still emitted at step
1, so that proof is non-vacuous rather than accidentally passing.

**Required proof, under test.** Commissioned "Undergraduate students" + legacy
spec "Senior executives" + adjustment "Postgraduate students" → "Postgraduate
students" is the runtime authority and "Senior executives" appears in **no**
prompt. A second test covers the Auto case that supersession could not have.

Step 1 still carries its other commissioning context (`Workflow:`,
`Constraints:`).

## 12. `page.audience` repair

`app.js` `buildPageShellOptionsFromWorkflow` now resolves:

```
effective governed Audience
  → resolved.audience            (frozen, existing)
  → resolved.learner_audience    (frozen, existing)
  → "Learners"                   (genuine last resort)
```

The required schema field is retained and unrelated page schema is untouched. No
renderer change was needed, so that STOP condition was not reached.

| Scenario | `page.audience` before | after |
| -------- | ---------------------- | ----- |
| Commissioned only (typical LD) | `"Learners"` | commissioned Audience |
| Audience adjusted | `"Learners"` | adjusted Audience |
| Nothing resolves | `"Learners"` | `"Learners"` |

This is the path that feeds the PRISM-derived page shell the model is told to
return verbatim, so prompts and artefact now agree by construction — asserted
directly.

## 13. `"Learners"` exemplar disposition — left in place, D22 retained

Investigated and found **not** to be a second authority:

1. It sits under *"Canonical shape examples (required — do not substitute strings
   for objects)"* — its stated job is string-vs-object shape, and the sibling
   `"title": "Learner-facing page title"` is self-evidently a placeholder.
2. It carries no instruction to emit the literal value.
3. `page.audience` is produced **deterministically by code** (`resolveProfileFields`),
   not authored by the model.
4. Where the exemplar is emitted, it is immediately followed by the
   *"Authoritative Sprint 56F page shell (PRISM-derived — return verbatim)"*
   embed, built from the governed options, instructing *"Do NOT invent"*.

Editing canonical prompt text would risk golden churn for no behavioural gain, so
it is **recorded, not repaired**. D22 stays open.

## 14. Create-time inference negative guarantee

Create-time behaviour is **unchanged** — the inference blob still includes
audience prose and the level regex is still present, both asserted in source, so
D18 and D20 remain open and honest.

The Run/Create boundary is asserted directly. Adjusting Audience does not rerun
`extractWorkflowBriefExplicitFactors` or elicitation, does not recompute
`resolvedFactors`, does not change topology, step IDs, `outputName` or page
profile, does not reselect cognition packs, and does not touch frozen
commissioning factors. A dedicated test sets Audience to "Primary school pupils
with no prior study of the period" — the exact phrasing Create inference would
have collapsed to a beginner `learner_level` — and asserts `learner_level`
remains `undergraduate` and prose stays prose.

## 15–19. Proofs

| Brief § | Proof | Result |
| ------- | ----- | ------ |
| §13 | Vertical commissioned → adjusted: Run A prompts + page use commissioned; Run B use adjusted; topology, step IDs, `outputName`, `resolvedFactors` identical; zero fetch; no `PRISM_STEP_PARAMS` | PASS |
| §14 | Only-delta: substituting the Run B Audience back into Run B reproduces the Run A prompt **exactly**, per step. No goldens refreshed. Episode Plan unchanged | PASS |
| §15 | Goal/Audience independence: both reach the model as distinct concepts in distinct sections; changing either leaves the other untouched; clearing Audience restores commissioned without touching Goal | PASS |
| §16 | Four-parameter composition through one block; plus a temporary `register` text declaration projecting with **no** prompt-builder edits | PASS |
| §19 | Persistence at `workflow.adjustments.parameters.audience` across normalize + structural round trip; **not** written to `resolvedFactors`, not promoted in `workflowOutputSpec.audience`, absent from `step.notes`, `[PRISM_STEP_PARAMS]` and `override_prompt_body` | PASS |

## 20. Legacy workflow behaviour (brief §17)

| Case | State | Behaviour |
| ---- | ----- | --------- |
| A | No `adjustments` object | Commissioned Audience, provenance `commissioned` |
| B | Frozen brief, no `initialBrief.audience`, no spec | `absent`; Audience omitted from the block |
| C | Only `resolvedFactors.audience` | That value, provenance `commissioned` |
| D | No `workflowBriefResolution`, legacy spec audience | That value, provenance `commissioned` (narrow legacy allowance, §5) |
| E | Nothing anywhere | `absent`; nothing invented |

Ambiguous mutable values are never reinterpreted as user Adjustments, and stored
legacy values are never destroyed.

## 21. Files changed

| File | Change |
| ---- | ------ |
| `app.js` | `resolveCommissionedWorkflowAudience` + `ADJUSTMENTS_AUDIENCE_PARAMETER_ID` + `resolveEffectiveWorkflowAudience`; registry declaration; step-1 `Audience:` line removed; `#workflowAudience` read-only/populate/gather; `page.audience` precedence; domain-hint overwrite removed; three test-API exports |
| `index.html` | `#workflowAudience` relabelled, `readonly`, new helper text and placeholder |

No canonical prompt text, schema, validator or renderer was changed.

## 22. Tests added / updated

**Added** — `tests/s80-s7-audience-parameter.test.js`, 61 tests covering brief
§1–§19.

**Updated** (6 assertions, all consequences of a fourth parameter or of §11):

| File | Change |
| ---- | ------ |
| `tests/s80-s1-adjustments-parameter-registry.test.js` | Allowlist now includes `audience` |
| `tests/s80-s4-adjustments-ui-repurpose.test.js` | Parameter counts 3 → 4 (×2); extension-proof id list; step-1 audience assertion inverted per §11; supersession probe retargeted to `constraints` |

## 23–25. Test totals and regression

| Measure | Result |
| ------- | ------ |
| New Audience suite | **61/61 pass** |
| Focused S80 set (S1, S2, S3, S4, S5, S6, S7 + `unified-workflow-settings`) | **238/238 pass** |
| Full-suite failing locations, pre-slice baseline | 394 |
| Full-suite failing locations, post-slice | **393** |
| **New failing locations** | **ZERO** (confirmed on two independent full runs) |

The one net improvement is an unrelated `learner-renderer-vnext` location that is
part of the known **D-014** baseline instability, not an effect of this slice. No
unrelated failure was papered over and no golden was refreshed.

## 26. Debt resolved

| ID | Status |
| -- | ------ |
| **D13** | **RESOLVED** — `#workflowAudience` is read-only in all modes, no longer gathered on Save, and no longer feeds a step-1 prompt line. One governed authority remains. |
| **D16** | **RESOLVED** — `page.audience` reads the effective governed Audience, so prompt and artefact cannot disagree. LD runs no longer default to `"Learners"` when a real audience exists. |

## 27. Debt retained / new

| ID | Status |
| -- | ------ |
| Learner-level vocabulary (D14) | **OPEN** — untouched by design. V1/V2/V3 vocabularies remain unreconciled; `learnerLevel` step params and `audience_level` remain unrepaired. Tests assert this slice did not make the dead machinery look authoritative. |
| **D18** | **OPEN** — audience prose still participates in the Create inference blob. |
| **D20** | **OPEN** — `learner_level` still taken from the first level token in the concatenated blob. |
| **D22** | **OPEN** — canonical exemplar retained; evidence in §13 shows it is not an authority. |
| **D24** | **OPEN** — `audience` is still a declared brief factor in the general/research configs but not in LD. Its practical consequence (D16) is now fixed at the consumer, but the declaration asymmetry itself remains. |

No new debt introduced.

## 28. Risks and limitations

1. **Frozen-brief-absent legacy records** rely on the gated spec read. If such a
   record was in fact edited post-Create long ago, its Audience will present as
   "commissioned". This was judged more honest than discarding the only
   commissioning record those records have, and it is documented and tested
   rather than silent.
2. **Records with a frozen brief but no recorded audience** now show an empty
   commissioning field where they previously showed the spec value. This is
   intentional truthfulness, but it is a visible UI change for those workflows.
3. **`page.audience` is still not rendered** (T-010 §16), so the D16 fix is
   currently metadata correctness rather than a visible learner-facing change.
4. **Prompt delta.** Every projection-eligible step now carries one additional
   `Audience:` line. Intended, and the only-delta proof bounds it exactly.
5. The Create-side Audience helper text no longer varies by domain. Narrow and
   deliberate (§7).

## 29. Acceptance assessment

Every required element of the brief is implemented and tested, with zero new
failing locations. Two defects are genuinely closed rather than relabelled.

One deviation requires explicit operator acceptance: **§11**, where the legacy
step-1 Audience line was removed outright instead of being declared through
`supersedesCommissionedContextFields: ["audience"]`. The reasoning is in §11 —
supersession fires only on provenance `adjustment` and would have left the
two-authority defect intact whenever Audience was on Auto, so it could not close
D13. The chosen disposition follows the S5 Goal precedent exactly, and the
generic mechanism remains live and non-vacuously proven.

No STOP condition was reached: no vocabulary was invented, no AI interpretation
added, no per-prompt-builder plumbing, no guessed migration, no renderer
redesign, no canonical churn, no Create inference at Run, no topology change.

**Recommendation: ACCEPT**, subject to the §11 deviation being noted.

## 30. Exact recommended next action

Operator review of this slice, in particular:

1. the §11 removal-versus-supersession deviation;
2. the §5 legacy fallback rule, especially risks 1 and 2 in §28.

On acceptance, the next authorised slice per the T-007 plan is the **Assessment
minimal parameter set**. It is **not** started here, and neither are D2, D3 nor
learner level.
