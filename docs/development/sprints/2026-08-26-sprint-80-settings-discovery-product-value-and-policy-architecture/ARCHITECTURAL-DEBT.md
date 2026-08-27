# Sprint 80 — Architectural debt ledger

Debt discovered during Sprint 80 discovery and its disposition across the
implemented slices. Definitions live in the diagnostics that found each item;
this file records **current status only**.

Primary sources:

- [S80-T-009](S80-T-009-goal-vs-topic-runtime-authority-diagnostic.md) — Goal vs Topic (D4–D6)
- [S80-T-010](S80-T-010-audience-learner-level-runtime-parameter-diagnostic.md) — Audience / learner level (D13–D24)

---

## Resolved

| ID | Summary | Resolved by |
| -- | ------- | ----------- |
| **D1** | Canonical DLA asserted hardcoded 60-minute timing instead of the workflow's duration | [S80-S6](S80-S6-duration-parameter-and-d1-timing-repair.md) |
| **D4** | `workflowOutputSpec.goal` was a mutable post-Create runtime authority feeding step-1 prompts | [S80-S5](S80-S5-goal-authority-and-goal-adjustment.md) |
| **D5** | Page title fell back to `base.goal`, so commissioning prose could leak into a learner-facing title | [S80-S5](S80-S5-goal-authority-and-goal-adjustment.md) |
| **D6** | Runtime Goal could silently re-derive brief factors and cognition scaffolds | [S80-S5](S80-S5-goal-authority-and-goal-adjustment.md) |
| **D13** | `#workflowAudience` was a mutable post-Create authority feeding step-1 prompts — the D4 pattern, unfixed | [S80-S7](S80-S7-audience-governed-workflow-parameter.md) |
| **D16** | `page.audience` read `resolvedFactors.audience`, a key never written under the LD pack, so LD pages carried the constant `"Learners"` while real prose went to the prompt | [S80-S7](S80-S7-audience-governed-workflow-parameter.md) |

## Open

| ID | Summary | Severity | Note |
| -- | ------- | -------- | ---- |
| **D2** | — see T-007 slice list | — | Not addressed; no slice authorised |
| **D3** | Learning Sequence `duration_minutes` step parameter never reaches the model (dead path) | MEDIUM | S6 routed **around** it by projecting Duration through Adjustments; the dead store itself remains |
| **D14** | Learner-level vocabulary: three incompatible vocabularies (V1 elicitation factor, V2 step parameter, V3 LO `userOptions`), none canonical; `learnerLevel` step params and `audience_level` unrepaired | MEDIUM | **Explicitly deferred at S7.** S7 tests assert the slice did not make the dead machinery look authoritative |
| **D18** | Audience prose is concatenated into the Create inference blob, so audience wording can silently set topology-effective factors | MEDIUM | Unchanged by S7 **by instruction**; asserted still present in source |
| **D20** | `learner_level` is taken from the *first* level token in a seven-field concatenated blob, so a level in `designIntent` overrides an explicit audience field | LOW–MEDIUM | Unchanged by S7 |
| **D22** | The canonical page-shell prompt exemplar shows `"audience": "Learners"` to the model | LOW | **Investigated at S7 and deliberately retained.** Evidence: `page.audience` is built deterministically by code, the exemplar is explicitly shape-only guidance, and it is followed by the authoritative return-verbatim shell embed. Editing canonical text would risk golden churn for no behavioural gain |
| **D24** | `audience` is a declared brief factor in the general fallback and the research pack but **not** in the learning-design pack, so identical author input persists differently by domain | MEDIUM | Root cause of D16. The *consequence* is fixed at the consumer by S7; the declaration asymmetry itself remains |
| **D-014** | Pre-existing full-suite baseline instability (~393 failing locations at HEAD, unrelated to Sprint 80) | — | Every slice is measured as *new failing locations vs a captured baseline*, not as an absolute count |

## Pre-existing, noticed but out of scope

| Item | Note |
| ---- | ---- |
| Goal helper-text overwrite | The Create-side Goal hint is still overwritten at runtime from domain UI hints, which describe an editable field. S7 fixed the equivalent Audience overwrite because Audience's helper text had to explain read-only status; Goal has the same latent inconsistency and was left alone |
| Legacy Settings catalogue code | Removed from the active UI at S4, parsing/storage deliberately retained and unreferenced. Deeper retirement is separate work |
