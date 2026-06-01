# Slice 31-5 charter — Density / pacing / anti-repetition renderer rules

**Status:** **Complete** (implemented 2026-06-01 — R31-006)  
**Slice:** 31-5  
**Date:** 2026-06-01

**Parent:** [`sprint-31-charter.md`](sprint-31-charter.md) §5–6  
**Predecessors:** [31-1](slice-31-1-charter.md) (R31-002), [31-2](slice-31-2-charter.md) (R31-003), [31-3](slice-31-3-charter.md) (R31-004), [31-4](slice-31-4-charter.md) (R31-005)

---

## Goal

Reduce **unnecessary rhetorical duplication**, **stacked cue fatigue**, and **pacing friction** in rendered self-directed learner pages — so activities feel less repetitive and less visually exhausting — while **preserving all Sprint 30 pedagogic content and meaning** already present in JSON.

**Governance line (non-negotiable):** Slice 31-5 may reduce unnecessary rhetorical duplication **only where semantic equivalence is already explicit, deterministic, local, and testable**.

**Second governance line:** Renderer dedupe must be **structural and deterministic** — **never inferential**. No similarity scoring, no fuzzy matching, no “helpful” summarisation, no pedagogic judgement about whether two cues “mean the same thing.”

---

## Problem (observed)

Slices 31-1–31-4 improved metadata boundaries, cue hierarchy, knowledge-summary patterns, and material presentation. **Perceived density and repetition** remain the main source of “assembled template” fatigue on Marx/RNA ([`sprint-31-charter.md`](sprint-31-charter.md) §4; [`probe-31-03-marx-render-notes.md`](context-files/probe-31-03-marx-render-notes.md), [`probe-31-04-rna-render-notes.md`](context-files/probe-31-04-rna-render-notes.md), [`probe-31-07-marx-material-notes.md`](context-files/probe-31-07-marx-material-notes.md), [`probe-31-08-kitchen-sink-material-notes.md`](context-files/probe-31-08-kitchen-sink-material-notes.md)):

| Issue | Observation |
|-------|-------------|
| **Stacked cue fatigue** | Multiple orientation + reasoning + cognition blocks per activity still read as a vertical stack of similar-weight boxes even after 31-2 de-emphasis |
| **Repeated framing language** | `activity_preamble`, `study_orientation`, `intellectual_frame`, and legacy `Task:` paragraphs can echo the same normalised text |
| **Cross-block echoes** | Comparable-text dedupe today is **scoped to `renderActivityFramingForActivity` only** (`comparableSeen` / `isDuplicateOfSeen`); `purposeTask`, **What to do**, **Guidance**, materials, and cognition can still repeat framing prose |
| **Near-identical reasoning fields** | Kitchen-sink already expects duplicate `evidence_use_prompt` / `argument_structure_hint` text to render once **within framing** — pattern should be documented and extended only with explicit rules |
| **Instruction vs task duplication** | `learner_task` vs `instructions` partially guarded (`normalizeComparableText` on rendered HTML at ~27274) — behaviour is brittle and not activity-wide |
| **Pacing / whitespace** | Dense support structures (framing rail → task → cognition → `.util-materials-stack`) need rhythm tuning without removing content |
| **Rubric rows 1–3** | Calmness / density / whitespace still **partial** on Marx/RNA after 31-4 |
| **Programme decision deferred** | 31-2 (R31-003): cue omission deferred to 31-5; 31-4 (R31-005): material-vs-task dedupe deferred to 31-5 ([`review-log.md`](review-log.md) pending table) |

**31-4 resolved:** material stack, table/template/prompt tiers. **31-5 targets:** deterministic repetition suppression + spacing rhythm — **not** prose rewrite or semantic merge.

---

## In scope

| Item | Detail |
|------|--------|
| **R-layer only** | `renderActivityFramingForActivity`, `renderLearningActivitiesBlocks`, `utilityRenderSupportNoteParagraph`, embedded CSS (`getUtilityPagePresentationCssV31_5` or equivalent) |
| **Extend comparable-text registry (activity-local)** | Reuse `normalizeComparableText` (~24707) and framing `comparableSeen` / `isDuplicateOfSeen` / `markSeen` (~25378–25390) pattern — **single activity-scoped registry** passed through framing → task → optional cognition/material checks |
| **Explicit duplicate suppression only** | Omit render of a block **only when** `normalizeComparableText(candidate) === normalizeComparableText(alreadySeen)` for text already emitted in the **same activity card** |
| **Safe cross-field rules (candidate)** | Document and test each rule independently, e.g.: legacy `Task:` / `purposeTask` suppressed when comparable to `learner_task` or preamble already shown; **Guidance** suppressed when comparable to **What to do** (improve existing check if needed); duplicate PEL reasoning strings (existing kitchen-sink pattern) |
| **Framing-internal dedupe** | Preserve and document current behaviour; no regression on orientation-before-reasoning order |
| **Spacing / pacing CSS** | Margins between `.util-activity-framing` cues, framing→task gap, task→cognition→`.util-materials-stack` rhythm; optional `.util-activity-framing--compact` or tier spacing — **presentation only** |
| **Support note subordination** | Spacing/colour only if touched; no removal of facilitator-labelled content on learner pages beyond existing gates |
| **Tests** | framing, kitchen-sink (incl. duplicate reasoning test), cognition, Marx, RNA; optional small fixture for cross-block echo only if kitchen-sink insufficient |
| **Manual review** | Marx + RNA + kitchen-sink; rubric **rows 1–5**, **13–14**; probes `probe-31-09-marx-density-notes.md`, `probe-31-10-rna-density-notes.md` (create on implement) |

### Allowed dedupe rule shape (implementation contract)

Every suppression rule must be:

| Property | Requirement |
|----------|-------------|
| **Deterministic** | Same JSON → same HTML every time |
| **Local** | Comparisons only within one activity card (one `renderLearningActivitiesBlocks` row) |
| **Explainable** | Rule name + field pair documented in charter checklist and test title |
| **Testable** | Positive (suppressed) and negative (distinct cues preserved) assertions |
| **Reversible** | Removing rule restores prior render; no JSON mutation |

### Comparable-text normalisation (baseline — do not change semantics without review-log entry)

`normalizeComparableText`: lowercase, curly-quote normalisation, non-alphanumeric → space, trim. **Not** stemming, not stop-word removal, not Levenshtein, not embeddings.

---

## Out of scope (31-5)

| Excluded | Notes |
|----------|--------|
| **Semantic / fuzzy dedupe** | No similarity scores, no “near duplicate” thresholds, no topic overlap collapse |
| **Concept merging** | Slice **31-3** — no `.util-knowledge-summary` changes |
| **Pedagogic judgement** | No removing cues because they “feel redundant” to a human reviewer |
| **Rewriting / summarising** | No shortening prose, no merging sentences, no label changes |
| **Generation-layer dedupe** | No DLA/GAM prompt changes, no upstream field omission |
| **JSON / schema / composition / orchestration** | Frozen |
| **Material content inference** | No suppressing materials because topic overlaps task — **only** exact comparable-text match against already-rendered activity strings |
| **Assessment layout** | Slice **31-6** — regression tests only |
| **`metacognition_contract`** | Deferred Phase 3 |
| **Adaptive learner modelling** | No profile-based hide/show |
| **31-1 metadata** | Do not regress `util-meta` / About this page |
| **31-2 hierarchy** | Do not remove PEL classes or reorder framing→task→cognition→materials |
| **31-3 knowledge wrappers** | Do not regress `.util-knowledge-summary` / `.util-definition-list` |
| **31-4 material tiers** | Do not regress `.util-materials-stack`, `.util-material-table`, template/prompt classes |
| **Facilitated workshop character** | Inflation/climate — regression guard only |
| **`display:none` on pedagogic cues** | Suppression = **omit block from HTML**, not hide with CSS |

---

## Current behaviour (baseline)

### Primary code paths

| Function | Role |
|----------|------|
| `normalizeComparableText` | ~24707 — shared normalisation for duplicate detection |
| `renderActivityFramingForActivity` | ~25358 — PEL cues; **activity-local** `comparableSeen`; `isDuplicateOfSeen` / `markSeen`; wraps `.util-activity-framing` |
| `renderLearningActivitiesBlocks` | ~27240+ — header → framing → `purposeTask` → **What to do** → **Guidance** → cognition → materials → output |
| `renderCognitionFieldsForActivity` | ~25300+ — cognition blocks after task |
| `renderMaterialsForActivity` | ~25560 — materials stack (31-4) |
| `utilityRenderSupportNoteParagraph` | Support / facilitator notes |
| `getUtilityPagePresentationCssV31_2` / `V31_3` / `V31_4` | Prior slice CSS — do not weaken |

### Existing dedupe (today)

| Location | Behaviour |
|----------|-----------|
| **Framing block** | Duplicate PEL/orientation/reasoning strings skipped via `comparableSeen` |
| **Guidance vs task** | `instructionHtml` omitted when `normalizeComparableText(instructionHtml) === normalizeComparableText(learnerTaskHtml)` (~27274) — compares **HTML strings**, not source fields |
| **Kitchen-sink test** | Duplicate `evidence_use_prompt` / `argument_structure_hint` text renders once in PEL reasoning showcase |
| **Cognition vs materials** | Row-level cognition keys skipped in materials remainder when already on row (29-2 test) |

### Gaps (31-5 intent)

| Gap | Risk if addressed carelessly |
|-----|------------------------------|
| `purposeTask` / `Task:` vs preamble / `learner_task` | High — must use comparable-text only |
| Framing text repeated in materials `instructions` key | Medium — exact match only |
| Cue stack vertical rhythm | Low — CSS-only |
| Section-level repetition | **Out of scope** — activity card only |

---

## Design intent

### Desired learner-facing outcome

| Outcome | Intent |
|---------|--------|
| **Less repetition** | Obvious rhetorical echoes removed when text is **identical** after normalisation |
| **Cue stacks breathe** | Spacing rhythm between framing cues and before primary task |
| **Pedagogy preserved** | Distinct orientation/reasoning/cognition strings still render |
| **Calm, not sparse** | Marx/RNA remain studyable; no unexpected disappearance of support |
| **Authored pacing** | Framing → action → resources scan path unchanged; fewer “why am I reading this again?” moments |

### Visual hierarchy (unchanged from 31-2)

| Tier | Elements | 31-5 touch |
|------|----------|------------|
| **Primary** | `.util-activity-task--primary` | Unchanged anchor |
| **Secondary** | `.util-activity-framing` cues | Dedupe + spacing only |
| **Tertiary** | Cognition, materials stack | Exact-match dedupe only where safe |
| **Background** | Meta fold | No change (31-1) |

### Presentation rules

1. **Preserve distinct cues** — different normalised keys → both render.  
2. **Preserve order** — framing → task → cognition → materials; cue order within framing unchanged.  
3. **Omit, don’t rewrite** — suppressed block absent from HTML; no ellipsis or “(see above)”.  
4. **One registry per activity** — extend `comparableSeen` (or equivalent) at activity render start; framing marks seen; task/material paths consult before emit.  
5. **Rule-per-test** — each new suppression path has a named test; no monolithic “dedupe works” test.  
6. **Spacing without hiding** — CSS may reduce perceived fatigue; must not use `display:none` on pedagogic content.  
7. **Document in review-log** — any new field-pair rule recorded in R31-006 implementation notes.

### Resolved programme decision (R31-006 candidate)

**Slice 31-5 = deterministic renderer-local repetition handling and spacing rhythm only** — no semantic inference, no pedagogic suppression, no schema change, no generation-layer work.

---

## Acceptance criteria

| # | Criterion | Verification |
|---|-----------|--------------|
| AC-1 | Orientation/reasoning cues still render when **pedagogically distinct** (different normalised keys) | framing + kitchen-sink KS-A6/A7 |
| AC-2 | Existing cue **ordering** intact (orientation before reasoning where both present) | `utility-self-directed-activity-framing.test.js` |
| AC-3 | Any dedupe/suppression is **deterministic** and **test-covered** per rule | New 31-5 tests with fixed fixtures |
| AC-4 | **No** semantic inference helpers introduced (no similarity score, fuzzy threshold, embedding) | Code review + negative grep |
| AC-5 | **No** JSON, generation, composition, or schema changes | Diff scope review |
| AC-6 | **31-1** metadata behaviour intact | `About this page`, `util-meta`, no Audience in learner body |
| AC-7 | **31-2** hierarchy intact | `.util-activity-framing`, `.util-activity-task--primary`, PEL classes |
| AC-8 | **31-3** knowledge-summary intact | `.util-knowledge-summary`, `.util-definition-list` on Marx/kitchen-sink |
| AC-9 | **31-4** material wrappers intact | `.util-materials-stack`, `.util-material-table`, template/prompt tiers |
| AC-10 | Marx + RNA support rubric **1–5**, **13–14** with reduced fatigue | probes 31-09/31-10 |
| AC-11 | Full suite **≥ 490** pass / **0** fail | `node --test tests/*.test.js` |
| AC-12 | Embedded CSS documents pacing rhythm (testable substrings) | e.g. `.util-activity-framing` gap rules in `getUtilityPagePresentationCssV31_5` |

---

## Implementation checklist

- [x] Audit `renderActivityFramingForActivity` comparable-text scope — document current `comparableSeen` behaviour
- [x] Design activity-scoped comparable registry for `renderLearningActivitiesBlocks` row
- [x] List candidate field-pairs for suppression; approve each in implementation PR / review-log
- [x] Implement `purposeTask` / `Task:` suppression only when `normalizeComparableText` matches seen task or preamble
- [x] Harden Guidance vs **What to do** check (source-field comparable keys)
- [x] Extend duplicate PEL reasoning suppression via shared comparable-text registry
- [x] **No** material-vs-task suppression (out of scope)
- [x] Add `getUtilityPagePresentationCssV31_5()` — framing cue rhythm, framing→task gap, materials separation
- [x] Extend tests — one assertion block per suppression rule + regression suite
- [x] `shape-activity-echo-dedupe.json` for cross-block echo
- [x] Manual probes Marx + RNA — probes 31-09/31-10
- [x] Record **R31-006** in [`review-log.md`](review-log.md)
- [x] Update [`CURRENT-STATE.md`](CURRENT-STATE.md), [`baseline-test-floor.md`](baseline-test-floor.md)
- [x] Update [`context-files/renderer-hooks.md`](context-files/renderer-hooks.md)

---

## Regression guards

| Page / suite | Test file | Expect |
|--------------|-----------|--------|
| Self-directed framing | `tests/utility-self-directed-activity-framing.test.js` | Distinct cues present; order preserved |
| Kitchen-sink PEL | `tests/utility-renderer-kitchen-sink.test.js` | KS-A6/A7; duplicate reasoning still once; 31-1–31-4 markers |
| Cognition semantics | `tests/utility-renderer-cognition-fields.test.js` | Blocks present; materials/cognition key dedupe unchanged |
| Marx | `tests/utility-marx-page-render.test.js` | Checklist, materials, knowledge summary, comparison prompts |
| RNA assessment | `tests/utility-ld-rna-assessment-page-render.test.js` | Assessment + 31-1–31-4 smoke |
| Page shapes | `tests/utility-page-render.test.js` | Meta fold, knowledge prose, tables |
| Workshop inflation | `tests/utility-ld-inflation-page-render.test.js` | Facilitated character unchanged |
| Workflow self-directed formatting | `tests/workflow-self-directed-learner-page-formatting.test.js` | Do not extend unless regression |

---

## Manual review rubric focus

Primary: [`presentation-review-rubric.md`](context-files/presentation-review-rubric.md)

| Rows | Focus |
|------|--------|
| **1–3** | **Primary** — calmness, perceived density, whitespace rhythm |
| **4–5** | Regression — task still dominant; cues subordinate (31-2) |
| **6–9** | Regression — metadata (31-1) |
| **10–11** | Regression — knowledge + materials (31-3, 31-4) |
| **12** | Regression only — assessment layout (31-6) |
| **13–14** | **Primary** — Sprint 30 value retained; no facilitator leakage |

**Evidence:** [`evidence-pages-marx-rna.md`](context-files/evidence-pages-marx-rna.md) — P31-01 Marx, P31-02 RNA; kitchen-sink synthetic.

---

## Tests likely extended

| File | Planned assertions |
|------|-------------------|
| `tests/utility-self-directed-activity-framing.test.js` | Distinct cues render; duplicates suppressed; order unchanged |
| `tests/utility-renderer-kitchen-sink.test.js` | Duplicate reasoning once; new cross-block echo cases; V31_5 CSS markers; 31-1–31-4 regression |
| `tests/utility-renderer-cognition-fields.test.js` | Cognition blocks preserved when text distinct |
| `tests/utility-marx-page-render.test.js` | No loss of checklist/comparison strings; reduced duplicate `Task:` echo if applicable |
| `tests/utility-ld-rna-assessment-page-render.test.js` | PEL cues where distinct; assessment untouched |

**Optional fixture:** `tests/fixtures/page-render/shape-activity-echo-dedupe.json` — preamble + `learner_task` + `purpose` with identical normalised text (only if kitchen-sink insufficient).

**Pattern:** count of normalised strings in HTML, field-specific presence/absence, embedded CSS substrings — not screenshots.

---

## Files likely touched (implementation phase only)

| File | Change |
|------|--------|
| `app.js` | `renderActivityFramingForActivity`, `renderLearningActivitiesBlocks`, `normalizeComparableText` usage, `getUtilityPagePresentationCssV31_5` |
| `tests/utility-self-directed-activity-framing.test.js` | Dedupe + preservation |
| `tests/utility-renderer-kitchen-sink.test.js` | Cross-block echo + CSS |
| `tests/utility-renderer-cognition-fields.test.js` | Preservation |
| `tests/utility-marx-page-render.test.js` | Density smoke |
| `tests/utility-ld-rna-assessment-page-render.test.js` | Regression smoke |
| `tests/fixtures/page-render/shape-activity-echo-dedupe.json` | Optional |
| Sprint 31 docs | CURRENT-STATE, review-log R31-006, probes 31-09/31-10, baseline floor, renderer-hooks |

---

## Success rubric (manual)

| Question | Pass |
|----------|------|
| Does the page feel less repetitious without feeling empty? | **Yes** |
| Would a learner miss important support that was in JSON? | **No** |
| Are duplicate sentences obviously gone only when they were identical? | **Yes** |
| Does Marx/RNA still pass “pedagogy preserved” (row 13)? | **Yes** |
| Can you explain each suppression rule in one sentence? | **Yes** |

---

**Implemented 2026-06-01 (R31-006).**
