# S80-S5 — Goal authority repair + Goal Adjustment

**Status:** COMPLETE — ACCEPTED (operator 2026-08-28)
**Authoritative basis:** S80-T-009 ACCEPTED as evidence; operator adopted the **Option E** direction
**Scope:** Goal authority only. No Duration/D1, no Audience, no Assessment parameters, no legacy cleanup, no topology change, no new elicitation, no AI.

---

## 1. Operator decision recorded

The operator adopted Option E from S80-T-009:

- Goal and Topic are **distinct concepts**;
- **Topic remains** (concise subject label, separately adjustable, title-capable);
- the **runtime Goal is brought under Adjustments**;
- **commissioning Goal and runtime Goal are separated**.

T-009 established that the pivotal open question was whether `#workflowGoal` was the
commissioning Goal or the runtime Goal. The answer implemented here: **`#workflowGoal`
is the commissioning Goal** (frozen, read-only), and the **runtime Goal is a declared
Adjustments parameter**.

## 2. Final product model

| Concept | Scope | Kind | Editable where | Authority |
| --- | --- | --- | --- | --- |
| Commissioning Goal | workflow | frozen prose | nowhere (read-only display) | source of Create-time factors/topology; never runtime authority |
| Runtime Goal | workflow-wide | prose | Adjustments | model-visible intent; no derivation |
| Topic | workflow-wide | typed label | Adjustments | authoritative subject; title-capable |
| Additional Instruction | **stage-local** | prose | Adjustments (per step) | optional steering |

Authority hierarchy, expressed structurally by block ordering and framing:

```
hard contracts / topology / schemas
  > typed workflow parameters      (Topic today; Duration/Audience later)
    > runtime Goal                 (prose intent)
      > step Additional Instruction
        > stage discretion
```

No AI conflict detection anywhere.

## 3. Goal registry declaration (§2)

Declared in `ADJUSTMENTS_PARAMETER_DECLARATION_SOURCE` (`app.js`), the same allowlist
S1 established. No Goal-specific code path exists outside the registry.

| Field | Value |
| --- | --- |
| `id` | `goal` |
| `label` | `Goal` |
| `type` | `text` |
| `multiline` | `true` (new declaration flag) |
| `owner` | `workflow_run_context` |
| `projection` | `workflowContext` |
| `applicability` | `{ always: true }` |
| `resolveCommissioned` | `resolveCommissionedWorkflowGoal` |
| `supersedesCommissionedContextFields` | *(none — see §8)* |

`multiline` is a new normalized declaration property (`type === "text" && raw.multiline === true`).
It drives two things declaratively, with no Goal branch: the control renders as a
`textarea`, and the projector renders it as a labelled block instead of an inline
`Label: value` line.

## 4. Commissioned Goal source (§3)

`resolveCommissionedWorkflowGoal(wf)` reads **only**
`workflowBriefResolution.initialBrief.goal`, falling back to
`initialBrief.designIntent` — the same frozen structure under the other key Create
writes it to. The mutable `workflowOutputSpec.goal` is **not** consulted.

This is the D8 repurposing: `initialBrief` was durable-but-dead in T-009 and now has a
single clear purpose as the commissioned Goal of record.

Provenance is the existing S1 three-way contract, unchanged:

| Provenance | Meaning |
| --- | --- |
| `adjustment` | explicit runtime Goal stored |
| `commissioned` | no adjustment; frozen commissioning prose in use |
| `absent` | neither exists (e.g. a hand-built workflow) |

## 5. Runtime Goal persistence (§4)

`workflow.adjustments.parameters.goal`, through the unchanged S1 path
(`setWorkflowAdjustmentParameterValue` → `normalizeWorkflowAdjustments`). Absence means
Auto; no `AUTO` sentinel is stored; a blank clears the entry.

Asserted **not** written to: `resolvedFactors`, `[PRISM_STEP_PARAMS]`, `step.notes`,
`override_prompt_body`, `workflowOutputSpec.goal`, `initialBrief`.

## 6. Topic retained (§5)

Unchanged in kind. Still a typed `text` parameter, still projected through the shared
`workflowContext` mechanism, still resolved from `resolvedFactors.topic` /
`workshop_subject`. It gains one role: it is now the **title source** (§10).

**D7 avoided, not fixed.** Nothing derives Topic from Goal prose. The T-009 failure mode
— the subject regex returning `"henry viii with 10 formative assessment questions"` —
cannot occur on any path added here, and there is a test asserting that a workflow with
no commissioned Topic resolves Topic as `absent` rather than inventing one from Goal.

## 7. Shared projection (§6)

One projector, two sections, no new prompt-assembly path. Both existing ingresses (I1
`buildWorkflowStepInstructions`, I2 `buildLiveGamV2CopyPromptViaCanonicalAssembler`) are
unchanged apart from now passing `step`.

Emitted shape:

```
Authoritative workflow parameters for this run:
Topic: Elizabeth I

These values are authoritative for this run. If any other text in this prompt — including
copied prompt bodies, workflow context or an author instruction — names a different value
for one of them, the value above wins and the conflicting text is superseded.

Workflow-wide intent for this run (Goal):
Create an introductory resource on Henry VIII focused on the break with Rome.

This is the author's intent for this run. It is subordinate to the authoritative workflow
parameters above: where it names a different value for one of them, that parameter wins.
It does not change which stages this workflow runs, or what this workflow is capable of
producing.
```

Design notes:

- **Precedence is positional and generic.** The subordination sentence refers to "the
  authoritative workflow parameters above", not to Topic. A future typed Duration or
  Audience structurally outranks Goal prose the moment it is declared, with no wording
  change. This is the §7 requirement satisfied generically.
- **The capability clause is in the prompt** (§13), so nothing implies Goal recompiles
  the workflow.
- **Upstream assessment boundary is preserved.** Goal prose now reaches every eligible
  step, so `buildEffectiveWorkflowIntentEntries` runs it through the *pre-existing*
  `sanitizeAssessmentCuesForUpstreamContext` for foundation upstream steps — the same
  sanitiser the step-1 context has always used. The sanitiser itself is **not retuned**.
- Design Episode Plan remains excluded from projection (`isDerivedShellWorkflowStep`),
  unchanged from S2.
- When nothing resolves, the block is `""` and prompts are byte-identical to before.

## 8. S4 supersession cleanup (§12)

**Retired** `supersedesCommissionedContextFields: ["goal"]` from the Topic declaration.

S4 needed Topic to delete the commissioned Goal line because Goal had no governance of
its own. That is no longer true, and keeping it would mean Topic discarding the author's
stated intent merely because the subject changed — explicitly forbidden by §12.

The **mechanism** is retained and remains generic (a future Audience parameter will need
it), and is proven live by a test that declares a probe parameter superseding `audience`.
Today no shipped declaration uses it.

Resulting behaviour, all four cases tested:

| Case | Topic | Goal |
| --- | --- | --- |
| neither adjusted | commissioned | commissioned |
| Topic only | adjustment | commissioned (**retained**, no longer deleted) |
| Goal only | commissioned | adjustment |
| both | adjustment | adjustment |

## 9. `#workflowGoal` disposition (§8)

**Disposition C — repurposed as clearly-labelled read-only commissioning information.**

| Change | Where |
| --- | --- |
| Relabelled "Goal this workflow was created with"; hint points to the Adjustments tab | `index.html` |
| `readonly` attribute in markup | `index.html` |
| `readOnly = true` in **every** mode, not just run/settings | `setWorkflowMode` |
| Populated from the frozen commissioned Goal | `populateWorkflowDetail` |
| **Save no longer gathers it from the DOM** — the stored value is preserved | `gatherWorkflowDetailFormData` |
| Run header now shows the **effective** Goal, so screen and prompt agree | `setWorkflowMode` run summary |

The Save change is the load-bearing one: it is what stops `workflowOutputSpec.goal`
being a second mutable Goal authority. There is now exactly one editable Goal in the
product.

**No silent migration** of an already-edited `workflowOutputSpec.goal` into the runtime
Goal (§8). No deterministic honest rule exists to distinguish a commissioned value from
an edited one on legacy records, so none is attempted. Alpha compatibility is explicitly
not a priority; an author who had edited that field sets Goal in Adjustments instead.

## 10. Defect repairs

### D4 — Goal/Topic contradiction (§9, §16) — FIXED

Root cause was two independent Goal authorities: the ungoverned
`workflowOutputSpec.goal` printed as a `Goal:` line by `buildWorkflowRuntimeContextText`,
alongside the governed Topic parameter.

Repair: **the `Goal:` line is removed from `buildWorkflowRuntimeContextText` entirely.**
Goal is projected once, through the registry, with provenance and stated precedence.

Per §16, the defect fixed is *ungoverned* contradiction, not the possibility of an author
writing contradictory prose. Topic Henry VIII + Goal naming Elizabeth I now both appear,
deliberately, with the structural contract stating Topic is authoritative for subject.
Tested: exactly one Goal authority per prompt, typed block precedes intent block, and a
deliberately stale `workflowOutputSpec.goal` sentinel cannot reach any prompt.

### D6 — live Goal re-extraction (§10, §17) — FIXED

Three sites re-derived brief factors at Run time from the mutable Goal, feeding cognition
pack and contract selection:

| Site | Was | Now |
| --- | --- | --- |
| `buildWorkflowStepPromptAugmentContextFromStep` | `ctx.workflowGoal = outputSpec.goal \|\| wf.goal` | frozen commissioning prose |
| `resolvePedagogicCognitionBriefContextForPrompt` | `base.goal = ctx.workflowGoal \|\| outputSpec.goal \|\| wf.goal` | frozen commissioning prose, `ctx` only as last resort |
| `resolveWorkflowBriefContextForPageComposition` | `base.goal = outputSpec.goal \|\| wf.goal` | frozen commissioning prose |

All three call `resolveCommissioningGoalProseForFactorDerivation(wf, fallback)`.

One documented legacy allowance: records with **no `workflowBriefResolution` at all**
pre-date the frozen brief structure, so for those the `workflowOutputSpec` goal is the
only commissioning record that has ever existed — and it is no longer author-editable, so
this is not a mutable read in practice. This allowance is also what keeps the many
existing fixture-driven cognition tests meaningful (only 3 test files carry an
`initialBrief`).

Create-time extraction is untouched, and there is a test asserting it still interprets
prose correctly. Cognition/scaffold rules were not retuned.

### D5 — page title from raw Goal prose (§11, §18) — FIXED

`buildPageShellOptionsFromWorkflow` no longer falls back to `base.goal` / `wf.goal`.

**Documented title precedence:**

1. `resolvedFactors.page_title` — an explicit commissioned page title, preserved as
   higher authority (§11);
2. `resolvedFactors.title`;
3. **effective Topic** (`resolveEffectiveWorkflowTopicForTitle`: adjustment, else
   commissioned) — concise and title-capable by contract;
4. `workflow.name`;
5. `"Learning page"`.

No AI title generation was invented, and no Topic is derived from Goal.

Tested: the rich Goal fixture yields the title `Henry VIII`, never the sentence; an
adjusted Topic retitles the page; an explicit `page_title` outranks Topic; with no Topic
the title falls back to the workflow name rather than to Goal.

### D7 — avoided (see §6). D8 — repurposed (see §4).

## 11. Capability boundary (§13)

Enforced structurally, not by policy text alone:

- topology is materialised and frozen at save; no code added here touches step
  generation, pruning or injection;
- Goal is never written into `resolvedFactors`, so no frozen decision moves;
- the prompt states the boundary explicitly.

Tested: a Goal demanding "a live workshop with no assessment at all" leaves step titles,
`assessment_required` and `delivery_mode` untouched; a workflow with its assessment stage
removed gains no assessment stage or output contract from a Goal asking for ten questions.

## 12. UI / Auto behaviour (§14)

- Goal renders as a `textarea` (declaration-driven), Topic stays a single-line input, so
  the two are visibly different kinds of thing.
- Help text: Goal — "What you want this run of the workflow to achieve… This steers how
  the workflow writes; it does not change which stages run." Topic — "The subject this
  workflow generates for…".
- Auto: blank field; the commissioned Goal appears as the placeholder only, never as a
  stored explicit value; clearing restores Auto (the record is deleted).
- No implementation terminology is exposed — asserted: no `initialBrief`,
  `workflowOutputSpec` or `resolvedFactors` string appears in the panel.

## 13. Tests

**New:** `tests/s80-s5-goal-authority.test.js` — 26 tests covering the registry
declaration, frozen commissioned source, persistence, the A–D matrix, D4/D5/D6/D7
regressions, three-layer composition, the upstream sanitisation equivalence, the
capability boundary, UI/Auto behaviour, and lifecycle preservation. Zero fetch calls
asserted.

**Updated (authorised by §12/§9):**

| File | Change |
| --- | --- |
| `s80-s1-adjustments-parameter-registry.test.js` | shipped allowlist is now `["topic","goal"]` |
| `s80-s4-adjustments-ui-repurpose.test.js` | fixture carries `initialBrief`; parameter count 1 → 2; three superseded S4 supersession assertions rewritten to the governed model; added a positive test that the supersession mechanism is still live |

### Focused totals

| Suite | Result |
| --- | --- |
| S1 + S2 + S3 + S4 + S5 + unified settings | **147 / 147 pass, 0 fail** |
| S5 alone | 26 / 26 pass |

### Regression (failing-location method, per D-014)

| | Count |
| --- | --- |
| Baseline failing locations (pre-change) | 393 across 97 files |
| After this slice | 393 |
| **New failing locations** | **0** |
| Locations no longer failing | 0 |

The failing-location sets are identical. All 393 are pre-existing (learner-renderer,
page-render, sequencing, cognition-topology and related suites) and were not touched.
No goldens were refreshed.

## 14. Files changed

| File | Change |
| --- | --- |
| `app.js` | Goal resolvers; Goal registry declaration; `multiline` declaration property; split projector (typed lines + prose intent block) with `step` threading; retired Topic supersession entry; removed the ungoverned step-1 `Goal:` line; three D6 derivation sites; D5 title precedence + `resolveEffectiveWorkflowTopicForTitle`; `#workflowGoal` read-only/populate/gather/run-header; textarea control rendering; test-API exports |
| `index.html` | `#workflowGoal` relabelled, hinted and marked `readonly` |
| `tests/s80-s5-goal-authority.test.js` | new (26 tests) |
| `tests/s80-s1-adjustments-parameter-registry.test.js` | allowlist assertion |
| `tests/s80-s4-adjustments-ui-repurpose.test.js` | fixture + superseded S4 assertions |

No prompts, elicitation, registry semantics, topology code or goldens were otherwise
changed.

## 15. Remaining risks and debt

| # | Item | Severity |
| --- | --- | --- |
| **D9 (new)** | The pre-existing upstream assessment sanitiser leaves ungrammatical residue when it strips cues from prose — e.g. `"…with 10 formative assessment questions and ."`. More visible now that Goal prose is projected to upstream steps. Not retuned, per §10/§20. | Low |
| **D10 (new)** | The same sanitiser removes `model answers` but not `formative assessment questions`, so some assessment vocabulary still reaches foundation upstream steps. Identical to pre-S5 step-1 behaviour, so not a regression, but the guard is weaker than its name suggests. | Low |
| **D11 (new)** | Legacy workflows with no `initialBrief` now project no Goal at all (previously the mutable spec goal appeared on step 1). Accepted per §8 — Alpha compatibility is not a priority — and the author can set Goal in Adjustments. Worth a one-line UI cue if it bites. | Low |
| D8 | Resolved by repurposing: `initialBrief.goal` is now the commissioned Goal of record. | closed |
| D7 | Avoided, not fixed. The deterministic subject regex is still unreliable; nothing new depends on it. | Medium (dormant) |
| D1/D2/D3 | Untouched. **S5 Duration remains blocked behind D1.** | — |
| Open | Prose can contradict a typed parameter in ways structure cannot detect. Mitigated by explicit precedence framing only — the same accepted limitation as Additional Instruction. | — |
| Open | Scenarios T-009 D/E (Goal implying a capability the workflow lacks) are now truthfully bounded in the prompt, but the **UI** still does not tell the author what the workflow can produce. | Medium |

## 16. Acceptance assessment

Every numbered requirement in the task is implemented: the product model (§1), registry
declaration (§2), frozen commissioned source (§3), S1 persistence (§4), Topic retained
(§5), shared projection (§6), generic precedence (§7), `#workflowGoal` retirement (§8),
D4 (§9), D6 (§10), D5 (§11), supersession cleanup (§12), capability boundary (§13), UI
honesty (§14), and the full test matrix (§15–§20).

Zero new regressions. No AI, no elicitation, no topology change, no goldens refreshed.
Three new low-severity debt items recorded, all pre-existing behaviour made more visible
rather than newly broken.

**Recommended next action:** operator review of this slice. S5 Duration is still blocked
behind D1; D1 triage or S6 Audience are the candidate follow-ons. The strongest
independent candidate is the UI capability cue (Medium debt above), which closes the last
honesty gap T-009 identified.
