# 38R-1 — Minimum viable Instructional Episode Plan

**Date:** 2026-06-06  
**Status:** **COMPLETE**  
**Type:** Design-proof phase — docs only; no code; no production schema  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38R-1  
**Predecessor:** [38Q-6 closure](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-6-sprint-closure.md)  
**Successor:** [38R-2 Archetype fit test](38R-2-archetype-fit-test.md)

---

## Executive framing

```text
38Q discovered the missing planning abstraction.
38R-1 defines the smallest viable form of that abstraction.
```

**Working principle:** Every field is guilty until proven necessary. Every primitive must justify its existence by enabling at least one transition family (T1–T5).

**Primary question:**

> What is the minimum structural object that can express T1–T5 without requiring prompt prose to carry the choreography?

---

## Task 1 — Primitive elimination exercise

### Starting candidate (V0)

```text
EpisodePlan
  archetype
  beats[]
  transitions[]
```

### V0 expressibility test (before additions)

| Assumption | T1 | T2 | T3 | T4 | T5 | Result |
|------------|:--:|:--:|:--:|:--:|:--:|--------|
| `beats[]` = ordered opaque nodes; `transitions[]` = `{ from, to }` only | ✗ | ✗ | ✗ | ✗ | ✗ | **FAIL** — cannot distinguish Worked from Guided from Verify; edges are topology only |
| `beats[]` = `{ function }`; `transitions[]` = adjacent `{ from, to }` only | ✓ | ✓ | ✓ | ✓ | ✓ | **PASS** — function identity + order encodes chains |
| Same, but **remove** `transitions[]`; order = authority | ✓ | ✓ | ✓ | ✓ | ✓ | **PASS** — adjacency implied by array order |

**Elimination result:** `transitions[]` as a separate array is **not necessary** when beats are strictly ordered and carry `function`. Separate edges duplicate what order + function sequence already express for T1–T5 (all linear families per [38Q-2 §7.3](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-2-episode-taxonomy-catalogue.md)).

### Primitives introduced (only those that survived elimination)

| Primitive | Why needed? | Which transition family requires it? |
|-----------|-------------|--------------------------------------|
| **archetype** | Selects canonical function vocabulary and validates beat sequences in 38R-2 | All — archetype determines which chains are **R** vs optional; not expressible without archetype context for proof |
| **beats[]** | Ordered instructional moves — the episode is a sequence, not a bundle ([38Q-3 GAP-13](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md)) | All |
| **beats[].function** | Distinguishes node types so chains are not interchangeable ([38Q-2 transition-dominant patterns](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-2-episode-taxonomy-catalogue.md)) | **T1–T5** — without function enum, beats are indistinguishable |

### Primitives considered and rejected (V0 → V1 evolution)

| Primitive | Verdict | Reason rejected |
|-----------|---------|-----------------|
| **transitions[]** | **Rejected** | Redundant with strictly ordered `beats[].function`; T1–T5 are linear subchains |
| **beat id** | **Rejected** | Array index suffices for linear plans; no branching in T1–T5 |
| **learner-state target** | **Rejected** | Implied by function semantics; does not change expressibility of any T1–T5 |
| **verification target** | **Rejected** | Content of verification belongs in beat realisation (DLA/GAM), not plan structure |
| **dependency rule** | **Rejected** | Encoded by strict order — later beat cannot precede earlier |
| **material obligation** | **Rejected** | DLA layer ([38Q-5 M-4](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md)); would recreate G5 material-bundle plan |
| **role hint** | **Rejected** | Render/GAM concern (38M–38P frozen) |
| **scaffolding level** | **Rejected** | T1 fade encoded by `worked_thinking` → `guided_practice` → `independent_performance` function sequence |
| **episode identity** | **Rejected from plan body** | LO binding is pipeline attachment (LO → Plan), not choreography content |

---

## Task 2 — Candidate primitive evaluation

| Primitive | Required? | Evidence |
|-----------|:-----------:|----------|
| **Episode identity** | **No** (extrinsic) | Plan binds to LO outside plan body; identity does not enable any T1–T5 |
| **Archetype** | **Yes** | Required for archetype-fit validation (38R-2); without archetype, cannot judge whether a beat sequence is valid for Understand vs Evaluate |
| **Beat ID** | **No** | Linear order; index is sufficient |
| **Function type** | **Yes** | Only primitive that distinguishes beats; all T1–T5 fail without it ([38Q-3 §7.3](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md)) |
| **Transition edge** | **No** (implicit) | Strict `beats[]` order implies edges; T1–T5 are linear ([38Q-2 §7.3](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-2-episode-taxonomy-catalogue.md)) |
| **Learner-state target** | **No** | Helpful for generation quality; not required to **express** transition families structurally |
| **Verification target** | **No** | T5 satisfied by `verification` function beat; audit content is realisation |
| **Dependency rule** | **No** | Order authority replaces explicit rules |
| **Material obligation** | **No** | DLA derivation ([38R-3](38R-3-plan-to-dla-mapping.md)); G4/G5 risk if in plan |
| **Role hint** | **No** | GAM/Page concern |
| **Scaffolding level** | **No** | T1 encoded by function triple, not numeric fade metadata |

**Essential set:** `archetype` + `beats[].function` (strictly ordered).

---

## Task 3 — Schema evolution

### Version 0 (charter starting point)

```yaml
episode_plan:
  archetype: <enum>
  beats: []           # opaque
  transitions: []     # { from, to }
```

| Test | Result |
|------|--------|
| T1–T5 with opaque beats | **FAIL** |
| T1–T5 with `{ function }` beats + transitions[] | **PASS** but redundant transitions |

**V0 failure mode:** Topology without function identity cannot express instructional choreography — only graph shape.

---

### Version 1 (first passing schema)

```yaml
episode_plan:
  archetype: understand | apply | analyse | evaluate
  beats:
    - function: <FunctionEnum>
    - function: <FunctionEnum>
    # ... strictly ordered
```

**Rules (structural, not fields):**

1. `beats` order is **canonical** — reordering changes pedagogy ([38Q-1 reorder test](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-1-what-good-looks-like-baseline.md)).
2. `function` values drawn from closed [38Q-2 taxonomy](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-2-episode-taxonomy-catalogue.md) — not material types.
3. Transitions are **read** as adjacent pairs `(beats[i].function → beats[i+1].function)`.

| Test | Result |
|------|--------|
| T1–T5 | **PASS** (see Task 4) |
| Smaller than V0? | **Yes** — removed `transitions[]` |

---

### Version 2 (considered — rejected)

```yaml
episode_plan:
  archetype: <enum>
  beats:
    - function: <FunctionEnum>
      state: <learner_state_enum>   # proposed addition
```

| Test | Result |
|------|--------|
| T1–T5 expressibility vs V1 | **No gain** — all families already expressible |
| Minimality | **Fails** — `state` does not unlock any family V1 cannot express |

**Decision:** Stop at **V1**. Do not add V2 fields.

---

### FunctionEnum (closed vocabulary reference)

Minimum enum must include all functions used in T1–T5 proofs:

| FunctionEnum value | Used in |
|--------------------|---------|
| `worked_thinking` | T1 |
| `guided_practice` | T1 |
| `independent_performance` | T1, T5 |
| `perspective_construction` | T2 |
| `criteria_construction` | T2 |
| `evaluative_judgement` | T2, T4 |
| `prediction` | T3 |
| `observation` | T3 (evidence confrontation beat) |
| `revision` | T3 |
| `transfer` | T4 |
| `reflection` | T4, T5 |
| `verification` | T5 |

Full archetype plans in 38R-2 may use additional 38Q-2 functions (`orientation`, `explanation`, etc.) — enum is **closed catalogue**, not plan bloat.

---

## Task 4 — Transition-family proof

Structural proof only — no materials, workbooks, or prompts.

| Transition family | Expressible? | Minimum schema elements required |
|-------------------|:------------:|----------------------------------|
| **T1** Worked → Guided → Independent | **Yes** | `beats`: `[worked_thinking, guided_practice, independent_performance]` — adjacency encodes fade ([GAP-01](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md)) |
| **T2** Perspective → Criteria → Judgement | **Yes** | `beats`: `[perspective_construction, criteria_construction, evaluative_judgement]` — chain GAP-02–04 |
| **T3** Predict → Evidence → Revision | **Yes** | `beats`: `[prediction, observation, revision]` — `observation` = evidence-confrontation beat ([GAP-15](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md)); taxonomy allows `cognitive_conflict` as alternate middle beat — proof uses `observation` as minimal label |
| **T4** Judgement → Transfer → Reflection | **Yes** | `beats`: `[evaluative_judgement, transfer, reflection]` — GAP-16–17 |
| **T5** Perform → Verify → Reflect | **Yes** | `beats`: `[independent_performance, verification, reflection]` — resists checklist substitution when `verification` is sequenced after performance ([GAP-08](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md)) |

### Structural reading example (T1 only)

```yaml
archetype: apply
beats:
  - function: worked_thinking
  - function: guided_practice
  - function: independent_performance
```

**Implied transitions:** `worked_thinking→guided_practice`, `guided_practice→independent_performance`.

A reviewer sees **fade choreography** without materials or prompts.

---

## Task 5 — Anti-accretion review

| Test | Result | Evidence |
|------|:------:|----------|
| Can a reviewer understand episode flow **without** reading generation prompts? | **Yes** | Function sequence is human-readable; no prose fields |
| Can transitions be inspected **directly**? | **Yes** | Adjacent function pairs are inspectable; order is authority |
| Can the plan be reasoned about **independently of material types**? | **Yes** | No `classification_table`, `checklist`, or ACM types in schema |
| Would doubling prompt size solve the same problem? | **No** | [38Q-4](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-4-episode-generation-design-options.md): prompts already produce Strong bodies at `fullOk`; G3/G5 persist — prompt accretion does not enforce ordered function chains |

**Verdict:** V1 performs **real planning work** — it is not a relabelled prompt appendix.

### Failure modes to guard in 38R-2+

| Risk | Guard |
|------|-------|
| Beats become material-type aliases | Reject any beat whose `function` maps 1:1 to DLA material type without learner-state meaning |
| Long prose in beat objects | Forbid prose fields in plan schema |
| Parallel beat groups | Forbid — order must be total |

---

## Task 6 — Minimality challenge

| Primitive | Removable? | Consequence if removed |
|-----------|:----------:|------------------------|
| **archetype** | **No** | Cannot validate archetype-legal sequences in 38R-2; same beat list could be invalid for wrong archetype |
| **beats[]** | **No** | No episode — nothing to plan |
| **beats[].function** | **No** | **T1–T5 all break** — beats indistinguishable; plan collapses to ordered slots |
| **strict order** | **No** | G5 recurs — parallel bundle ([GAP-13](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md)) |
| **transitions[]** (optional) | **Yes** | No consequence for T1–T5 — implied by order |
| **learner-state target** | **Yes** | Expressibility unchanged; content generation may weaken (38R-3/implementation concern) |
| **material obligation** | **Yes** | Must stay out — DLA mapping in 38R-3 |

---

## Task 7 — Final verdict

### 1. What is the smallest viable Episode Plan?

**Version 1 — two-field plan:**

```yaml
episode_plan:
  archetype: understand | apply | analyse | evaluate
  beats:
    - function: <FunctionEnum>
```

Plus one structural rule: **`beats` order is pedagogically authoritative.**

### 2. Which primitives are essential?

| Essential | Role |
|-----------|------|
| **archetype** | Archetype context for validation and template fit |
| **beats[]** | Ordered instructional sequence |
| **beats[].function** | Instructional function identity (38Q-2 vocabulary) |
| **order authority** (rule) | Implicit transitions; anti-G5 |

### 3. Which primitives looked useful but are actually implementation concerns?

| Deferred primitive | Layer |
|--------------------|-------|
| Episode identity / `lo_ref` | Pipeline binding (LO → Plan) |
| Learner-state target prose | GAM body generation |
| Verification target / rubric detail | DLA obligation + GAM content |
| Material obligation | DLA (`required_materials[]`) — [38R-3](38R-3-plan-to-dla-mapping.md) |
| Role hint | GAM / Page (38P registry) |
| Scaffolding level metadata | Encoded by function sequence (T1) |
| Explicit `transitions[]` | Proof harness in 38R-4 (validation rules), not plan body |
| Session-level fade | Session arc — outside single-episode minimum |

### 4. Is the plan structurally distinct from DLA, GAM, and prompts?

| Object | What it plans | Distinct? |
|--------|---------------|:---------:|
| **Episode Plan V1** | Ordered instructional **functions** | — |
| **DLA** | Material **obligations** + `learner_task` | **Yes** — no material types in plan |
| **GAM** | Material **bodies** (prose, tables) | **Yes** — no content in plan |
| **Prompt instructions** | Generation **prose** | **Yes** — plan is structural, not narrative |

### 5. Does V1 satisfy 38Q without becoming prompt accretion?

**Yes.**

- Addresses G3/G5 by making **function order** the planning authority ([38Q-5](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md)).
- Smaller than prompt-appendix choreography guidance.
- Structurally distinct from `required_materials[]` parallel bundles.
- **Not** a material list — no tables, templates, or checklists at plan level.

---

## Success-condition statement

A reader of V1 should conclude:

> **"This object plans instructional transitions and learner-state progression."**

—not—

> **"This is another way of listing materials."**

**Test:** V1 contains **zero** material-type fields and **zero** prose obligations. It contains only **archetype** and an **ordered function sequence**.

---

## Inputs to 38R-2

| Output | Use in 38R-2 |
|--------|--------------|
| **Frozen schema V1** | Instantiate full A1–A4 target episodes as beat sequences |
| **FunctionEnum** | Closed vocabulary from 38Q-2 §6 |
| **Order authority rule** | Score transition integrity as subsequence presence |
| **Rejected primitives list** | Do not re-introduce during archetype fit |
| **T1–T5 proof patterns** | Acceptance subchains within full archetype plans |
| **T3 middle-beat note** | `observation` or `cognitive_conflict` acceptable as evidence beat — document per archetype in 38R-2 |

### 38R-2 open questions (from 38R-1)

1. Minimum beat count per archetype to satisfy 38I targets — not just T1–T5 subchains.
2. Whether `criteria_construction` vs `criteria_exposition` placement affects T2 proof on A4.
3. Where `orientation`, `framing`, `activation` sit relative to T-family subchains.

---

## Phase status

| Field | Value |
|-------|-------|
| Phase | 38R-1 |
| Status | **COMPLETE** |
| Schema version | **V1** |
| Sprint SC contribution | **SC-1** (schema defined) · **SC-2** (five families expressed) |
| Next | **38R-2** — Archetype fit test (A1–A4) |

---

## Hold conditions (unchanged)

- No code; no production schema files  
- No DLA/GAM/Page/fidelity changes  
- 38M–38P not reopened  
- 38Q recommendation settled  
