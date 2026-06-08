# 38R-2 — Archetype fit test (A1–A4)

**Date:** 2026-06-06  
**Status:** **COMPLETE**  
**Type:** Adversarial design-proof — docs only  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38R-2  
**Inputs:** [38R-1 V1 schema](38R-1-minimum-viable-episode-plan.md) · [38Q-2 archetype mappings](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-2-episode-taxonomy-catalogue.md) · [38I-4 mock-ups](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) · [38I-4 A4 episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)  
**Successor:** [38R-3 Plan-to-DLA mapping](38R-3-plan-to-dla-mapping.md)

---

## Executive framing

**Adversarial mandate:** The goal is **not** to prove V1 works. The goal is to discover whether V1 **fails**.

**Frozen schema (38R-1 V1):**

```yaml
episode_plan:
  archetype: <archetype>
  beats:
    - function: <FunctionEnum>
```

**Rule:** Beat order is pedagogically authoritative. No other plan fields.

**Primary question:**

> Can all four archetypes be represented as ordered function sequences without introducing new primitives?

---

## Task 1 — A1–A4 as pure Episode Plans

FunctionEnum values from [38Q-2 §3](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-2-episode-taxonomy-catalogue.md) (snake_case). No materials, DLA, or GAM concepts.

### A1 — Understand (inflation discrimination)

**Authority:** [38I-4 A1 trace](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) · [38Q-2 §3.1](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-2-episode-taxonomy-catalogue.md)

```yaml
episode_plan:
  archetype: understand
  beats:
    - function: orientation
    - function: framing
    - function: activation
    - function: explanation
    - function: example
    - function: non_example
    - function: misconception_confrontation
    - function: guided_practice
    - function: independent_performance
    - function: verification
    - function: reflection
    - function: transition
```

**Implied transition subchains:** T5 (`independent_performance` → `verification` → `reflection`).

---

### A2 — Apply (CPI procedure with fade)

**Authority:** [38I-4 A2 trace](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) · [38Q-2 §3.2](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-2-episode-taxonomy-catalogue.md)

```yaml
episode_plan:
  archetype: apply
  beats:
    - function: orientation
    - function: framing
    - function: activation
    - function: criteria_exposition
    - function: worked_thinking
    - function: guided_practice
    - function: independent_performance
    - function: verification
    - function: revision
    - function: reflection
    - function: transfer
    - function: transition
```

**Implied transition subchains:** **T1** (`worked_thinking` → `guided_practice` → `independent_performance`); T5 (`independent_performance` → `verification` → `reflection`).

---

### A3 — Analyse (types/causes — lens-based reasoning)

**Authority:** [38I-4 A3 trace](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) · [38Q-2 §3.3](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-2-episode-taxonomy-catalogue.md)

```yaml
episode_plan:
  archetype: analyse
  beats:
    - function: orientation
    - function: framing
    - function: activation
    - function: criteria_exposition
    - function: explanation
    - function: worked_thinking
    - function: guided_inquiry
    - function: guided_practice
    - function: independent_performance
    - function: verification
    - function: reflection
    - function: transfer
    - function: transition
```

**Implied transition subchains:** T1 (worked → guided → independent); T5 (perform → verify → reflect). **Comparison** is **R (embedded)** per 38Q-2 — carried by `criteria_exposition` → `guided_practice` → `independent_performance`, not a separate beat.

---

### A4 — Evaluate (household strategy judgement)

**Authority:** [38Q-2 §3.4](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-2-episode-taxonomy-catalogue.md) (superset of [38I-4 A4 trace](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) + [38I-4 A4 episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md))

```yaml
episode_plan:
  archetype: evaluate
  beats:
    - function: orientation
    - function: framing
    - function: activation
    - function: perspective_construction
    - function: criteria_exposition
    - function: criteria_construction
    - function: worked_judgement
    - function: guided_inquiry
    - function: guided_reasoning
    - function: independent_performance
    - function: evaluative_judgement
    - function: verification
    - function: reflection
    - function: transfer
    - function: transition
```

**Implied transition subchains:** **T2** (`perspective_construction` → `criteria_construction` → `evaluative_judgement` — with `criteria_exposition` between perspective and construction); **T4** (`evaluative_judgement` → `transfer` → `reflection`); T5 (`independent_performance` → `verification` → `reflection`).

**Note:** `criteria_exposition` sits between `perspective_construction` and `criteria_construction` — exposition before learner weighting matches [38I-4 A4 Step 1–2](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md). T2 subchain remains as **ordered subsequence** with exposition insert — does not break T2.

---

## Task 2 — Compare against 38I target states

### A1 — Understand

| Question | Result | Notes |
|----------|:------:|-------|
| All **R** functions represented? | **Yes** | Explanation, example, misconception_confrontation, independent_performance, verification present |
| Ordering preserved? | **Yes** | Teach → contrast → confront → guide → perform → verify matches 38I-4 trace |
| Key transitions preserved? | **Yes** | Guided → independent; perform → verify → reflect (T5) |
| Teaching intent preserved? | **Yes** | Discrimination arc — not read-and-checklist |
| Missing capability? | **No** | Optional C beats (activation, reflection) included |

**38I vs V1 gap:** None structural. `sample_output` anti-pattern absent from plan (correct — not a function).

---

### A2 — Apply

| Question | Result | Notes |
|----------|:------:|-------|
| All **R** functions represented? | **Yes** | Criteria exposition, worked_thinking, guided_practice, independent_performance, verification |
| Ordering preserved? | **Yes** | Rules → model → guide → full attempt → verify |
| Key transitions preserved? | **Yes** | **T1 fade** explicit in beat triple |
| Teaching intent preserved? | **Yes** | Procedure with decreasing scaffold |
| Missing capability? | **No** | Revision included (38Q-2 **C**; 38I A2 mock-up revision under verification) |

---

### A3 — Analyse

| Question | Result | Notes |
|----------|:------:|-------|
| All **R** functions represented? | **Yes** | Criteria exposition, worked_thinking, guided_practice, independent_performance, verification, reflection |
| Ordering preserved? | **Yes** | Lenses → model → inquire → guide → perform → verify |
| Key transitions preserved? | **Yes** | T1 fade; analytic inquiry before performance |
| Teaching intent preserved? | **Yes** | Comparison embedded in practice chain per 38Q-2 |
| Missing capability? | **No** | `comparison` not separate beat — **embedded R** per 38Q-2 §3.3 |

---

### A4 — Evaluate

| Question | Result | Notes |
|----------|:------:|-------|
| All **R** functions represented? | **Yes** | Perspective_construction, criteria exposition, evaluative_judgement, verification, reflection, transfer |
| Ordering preserved? | **Yes** | Perspectives → criteria → model → guide → judge → audit → reflect → apply |
| Key transitions preserved? | **Yes** | T2, T4, T5 subchains present |
| Teaching intent preserved? | **Yes** | Judgement sequence not capstone summary |
| Missing capability? | **No** | `criteria_construction`, `worked_judgement`, `guided_reasoning` included beyond thin 38I-4 mock-up trace |

---

## Task 3 — Stress-test likely failure points

### A1 — discrimination, misconception, contrastive examples

| Stress point | V1 handling | New primitive needed? |
|--------------|-------------|:---------------------:|
| Concept discrimination | `non_example` + `guided_practice` + `independent_performance` sequence | **No** |
| Misconception challenge | `misconception_confrontation` beat | **No** |
| Contrastive examples | `example` then `non_example` ordered pair | **No** |
| CPI/GDP reconciliation | Content in realisation; plan orders confrontation after contrast | **No** |
| Verification repair path | See Task 4 — realisation/mapping, not plan | **No** |

**Attack result:** **No break.**

---

### A2 — fade, guided → independent

| Stress point | V1 handling | New primitive needed? |
|--------------|-------------|:---------------------:|
| Scaffold fade | `worked_thinking` → `guided_practice` → `independent_performance` | **No** — T1 |
| Single-table substitution risk | Prevented at **38R-3** mapping (separate obligations); plan already has three beats | **No** |
| Revision after verify | `revision` beat after `verification` | **No** |
| Procedural vs analytic bleed | `archetype: apply` bounds interpretation depth — validation rule, not schema field | **No** |

**Attack result:** **No break.**

---

### A3 — comparison, competing interpretations, reasoning chains

| Stress point | V1 handling | New primitive needed? |
|--------------|-------------|:---------------------:|
| Dimensional comparison | `criteria_exposition` (lenses) → `guided_practice` → `independent_performance` | **No** |
| Competing interpretations | `guided_inquiry` beat (coexistence / observability) | **No** |
| Reasoning chain | `worked_thinking` → `guided_inquiry` → `guided_practice` → `independent_performance` | **No** |
| Explicit `comparison` function | 38Q-2 marks **embedded** — not required as separate beat | **No** |
| Cause taxonomy inference | KM/inference contract — not plan structure ([38I-5](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md)) | **No** |

**Attack result:** **No break.**

---

### A4 — perspectives, criteria weighting, judgement, transfer

| Stress point | V1 handling | New primitive needed? |
|--------------|-------------|:---------------------:|
| Perspective construction | `perspective_construction` beat before criteria | **No** |
| Criteria weighting | `criteria_construction` beat after `criteria_exposition` | **No** — weighting is learner move, not numeric plan field |
| Judgement construction | `worked_judgement` → `guided_reasoning` → `evaluative_judgement` | **No** |
| Transfer chain | `transfer` **R** beat after reflection gate | **No** — T4 |
| Trade-off tensions | `guided_inquiry` beat | **No** |
| Strategy menu vs perspectives | Menu is **content**; plan requires `perspective_construction` before criteria — anti-G4 at mapping | **No** |
| Competing household views | Multiple views inside one `perspective_construction` beat — **content scope**, not branching | **No** |

**Attack result:** **No break.**

---

## Task 4 — Hidden dependency search

| Candidate primitive | Required? | Evidence |
|---------------------|:---------:|----------|
| **Branching** (strategy A/B/C paths) | **No** | Learner evaluates all options within linear beats; no plan-time path selection ([38I-4 A4](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) — one scenario, sequential steps) |
| **Loops** (verify-fail-retry) | **No** | A1 repair: optional **linear** extension `verification` → `misconception_confrontation` → `independent_performance` could be authored without loop primitive; A2 `revision` beat after `verification` is single-pass retry, not loop metadata |
| **Conditional paths** (if Partial then revise) | **No** | Conditionality belongs in **verification realisation** (DLA/GAM) or optional beat omission at template level — not plan schema |
| **Learner-state tracking** (explicit state object) | **No** | State change implied by function progression ([38R-1](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-1-minimum-viable-episode-plan.md) rejection stands) |
| **Explicit transition objects** | **No** | Adjacency + function identity sufficient for all A1–A4 and T1–T5 |
| **Scaffolding metadata** (full/partial/none) | **No** | Fade encoded by function triple (A2, A3, A4 guided chains) |
| **Session-level fade** (A1→A4 independence rise) | **No** (out of scope) | Multi-episode **session plan** — not single-episode V1; [38Q-3 GAP-01](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md) session fade deferred to session arc contract — **not V1 failure** |
| **Optional beat omission** (C/O functions) | **No** (validation layer) | Archetype **templates** may mandate R-subset; optional beats are authoring choices validated against 38Q-2 tags — not schema fields |
| **Inference contracts** (Evaluate criteria content) | **No** (adjacent layer) | Plan orders `criteria_exposition` + `criteria_construction`; **content** from KM/LO inference ([38I-5](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md)) — 38R-3 / pack, not plan primitive |

### Hardest attack — verification repair micro-loop (A1)

**Claim:** Learner failing verification must branch back to misconception table — requires loop primitive.

**Counter:**

1. Plan orders `misconception_confrontation` **before** first `independent_performance` — repair re-uses prior beats in realisation (learner-directed reread), not plan re-execution.
2. Alternative linear plan extension for strict retry: insert `revision` beat after `verification` (as A2) — still no loop primitive.
3. Failure is **GAM/DLA realisation** if repair prose absent — not V1 expressibility.

**Verdict:** Repair choreography is **38R-3 mapping** concern. V1 does not break.

---

## Task 5 — Minimality attack (documented failures attempted)

| # | Attack | Outcome |
|---|--------|---------|
| 1 | Represent A4 without `perspective_construction` | **Fails teaching intent** — GAP-03; must add beat, not primitive |
| 2 | Represent A4 without `criteria_construction` | **Fails T2** — GAP-04; must add beat, not primitive |
| 3 | Collapse A2 guided+independent into one beat | **Fails T1** — GAP-01/06; must keep two beats |
| 4 | Represent A1 without `non_example` | **Fails discrimination intent** — GAP-05; must add beat |
| 5 | Omit `transition` beat and use session metadata | Session bridge is **separate episode plan** or session arc — not V1 schema failure |
| 6 | Add `comparison` beat to A3 for embedded R | **Succeeds** with or without — embedded comparison does not force new primitive |
| 7 | Express criteria **weighting** as numeric plan field | **Rejected** — `criteria_construction` function suffices |
| 8 | Express strategy menu as plan branching | **Rejected** — menu is content inside `perspective_construction` / `guided_reasoning` |
| 9 | Require explicit `transitions[]` for A4 T2 with exposition insert | **Rejected** — subsequence `perspective_construction` → `criteria_exposition` → `criteria_construction` → `evaluative_judgement` is inspectable in ordered list |
| 10 | Break V1 with only `archetype` (no beats) | **Trivial fail** — beats essential per 38R-1 |

### Answers to minimality attack questions

| Question | Answer |
|----------|--------|
| 1. Can A1–A4 be represented without explicit transitions? | **Yes** — adjacency on ordered `beats[].function` |
| 2. Can A1–A4 be represented without learner-state objects? | **Yes** — function semantics carry intent |
| 3. Can A1–A4 be represented without scaffolding metadata? | **Yes** — fade via function triples |
| 4. Can A1–A4 be represented without branching? | **Yes** — all four archetypes are strictly linear |

**No attack forced a new plan primitive.**

---

## Task 6 — Archetype fit verdict

| Archetype | V1 fit | Notes |
|-----------|:------:|-------|
| **A1 Understand** | **Strong** | Full discrimination arc; 12 beats; all **R** functions present |
| **A2 Apply** | **Strong** | T1 fade explicit; revision beat included |
| **A3 Analyse** | **Strong** | Embedded comparison via practice chain; inquiry before performance |
| **A4 Evaluate** | **Strong** | Longest plan (15 beats); T2/T4/T5 subchains; superset of 38I-4 mock-up trace |

### Partial-fit items (not archetype failures)

| Item | Scope | Why not V1 failure |
|------|-------|-------------------|
| Session-level scaffold fade | Session arc | Multi-plan concern — outside single-episode V1 |
| C/O optional beat variance | Template validation | 38Q-2 tags — archetype validator, not schema |
| Verification repair depth | 38R-3 mapping | Realisation obligation, not plan shape |
| Inference content for criteria/perspectives | Adjacent contract | Plan orders functions; content not structure |

**No archetype rated Partial or Failed.**

---

## Task 7 — Primitive review

### Retained primitives (unchanged from 38R-1)

- **archetype**
- **beats[]** (strictly ordered)
- **beats[].function** (FunctionEnum from 38Q-2 closed catalogue)

### Still rejected

- `transitions[]`
- `beat_id`
- learner-state target objects
- verification targets
- material obligations
- role hints
- scaffolding metadata
- episode identity inside plan body
- branching / loops / conditionals

### Newly required

**None.**

> **V1 survives archetype testing unchanged.**

---

## Schema survival verdict

| Outcome | Selected |
|---------|:--------:|
| **A. Yes — V1 survives unchanged** | **✓** |
| B. Mostly — one additional primitive required | |
| C. No — richer structure required | |

**Evidence-supported conclusion:**

> **Can the complete 38I instructional episode model be expressed as ordered instructional functions alone?**

**Yes** — for **single-episode** A1–A4 target structures. The complete model includes **session arc** elements (cross-episode transition, session fade) that are **multiple Episode Plans** plus a session contract — not a failure of per-episode V1.

---

## Task 8 — Inputs to 38R-3

### Frozen schema for Plan→DLA mapping

**Schema version:** **V1** (unchanged)

```yaml
episode_plan:
  archetype: understand | apply | analyse | evaluate
  beats:
    - function: <FunctionEnum>
```

**Rule:** Order is authoritative. One plan maps to one DLA activity row's obligation sequence.

### Reference plans (38R-2 authoritative instances)

| Archetype | Beat count | Plan section |
|-----------|:----------:|--------------|
| A1 Understand | 12 | Task 1 A1 |
| A2 Apply | 12 | Task 1 A2 |
| A3 Analyse | 13 | Task 1 A3 |
| A4 Evaluate | 15 | Task 1 A4 |

### 38R-3 mapping obligations (preview)

| Mapping rule | Source |
|--------------|--------|
| One plan beat → ≥1 DLA material obligation (never invert) | [38Q-5 M-4](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) |
| T1 triple must not collapse to single table obligation | 38R-2 A2/A3 stress-test |
| `perspective_construction` must not map to scenario menu alone | 38R-2 A4 stress-test |
| `verification` must not default to checklist-only | GAP-08 |
| Optional `revision` beat after `verification` when archetype includes it | A2 plan |
| Anti-substitution: function label ≠ material type alias | [38R-1](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-1-minimum-viable-episode-plan.md) |

### No V2

38R-2 adversarial testing did **not** force schema revision. **Do not introduce V2** without new failure evidence.

---

## Sprint SC contribution

| SC | Status after 38R-2 |
|----|-------------------|
| **SC-1** | **PASS** — V1 frozen |
| **SC-2** | **PASS** — T1–T5 subchains present in archetype plans |
| **SC-3** | **PASS** — A1–A4 expressed as V1 plans |
| **SC-7** | **On track** — no prompt fields; structural only |

---

## Hold conditions

- V1 frozen — no schema change before 38R-6 unless 38R-3/38R-4 discover mapping-level failure (not plan-level)
- No code; no production schema
- 38M–38P closed

---

## Status

| Field | Value |
|-------|-------|
| Phase | 38R-2 |
| Status | **COMPLETE** |
| Schema verdict | **V1 survives unchanged** |
| Next | **38R-3** — Plan-to-DLA mapping |
