# Sprint 38-D — Planning charter (Workbook Authoring Contracts)

**Date:** 2026-06-04  
**Status:** **CLOSED** (planning complete — 2026-06-04) · **Implementation:** recommended, not started  
**Implementation:** Phased — contract observations first; pack/runtime changes only when each phase explicitly charters implementation

---

## Mission

Translate Sprint **38-C** findings into **executable authoring contracts** so self-study workbook requests produce **workbook genres** rather than activity sheets or reference notes.

**Primary hypothesis:**

> If DLA explicitly specifies workbook obligations and GAM is contractually required to author workbook genres, then Design Page can preserve and compose richer self-study workbook material without needing to invent pedagogy downstream.

---

## Preconditions (assumed true)

**Sprint 38-B:**

- Clarified step ownership and canonical LD modules
- Design Page compose contract and materials preservation
- B4 table fidelity **MONITORING** with passing Inflation gate evidence
- Four-step prompt sum **152,782 → 71,960** (−52.9%)
- **730** tests passing

**Sprint 38-C:**

- Workbook pedagogy model, gap analysis, DLA/GAM planning requirements, learner experience target
- [38C-6](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-6-planning-synthesis-and-execution-recommendation.md) recommends this sprint

---

## Programme question

> What must DLA and GAM **commit to** — in enforceable contracts — so a self-study workbook brief yields multi-genre upstream output that passes the 38C-1 workbook bar?

---

## Non-goals

| Non-goal | Notes |
|----------|--------|
| Renderer redesign | Deferred (38-E or later) |
| Learner page UX implementation | Out of charter |
| Broad runtime refactor | Out of charter |
| Prompt-size reduction | 38-B complete |
| Reopening 38-B preservation work | Use existing `LD-*` modules |
| Sprint 39 reasoning cues | Separate programme gate |
| Composition-first without genres | [38C-6](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-6-planning-synthesis-and-execution-recommendation.md) ranked B after A |

---

## Phases

### 38D-1 — DLA workbook contract

| Field | Content |
|-------|---------|
| **Purpose** | Convert [38C-3](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-3-dla-workbook-requirements.md) planning requirements into an **executable DLA contract** for `self_directed` + `page_profile: learner` workbook briefs |
| **Planned deliverable** | [observations/38D-1-dla-workbook-contract.md](observations/38D-1-dla-workbook-contract.md) |
| **Inputs from 38-C** | 38C-1 R1–R7; 38C-2 gap→DLA map; 38C-3 §4–8 (15 requirements, Require/Encourage, 60-min economics, capstone anti-dump) |
| **Success criteria** | Reviewer can apply contract to a DLA JSON spec and list **mandatory** `required_materials` types per activity; solo feasibility; session consolidation requirement; duration budget rule |
| **Non-goals** | GAM prose bodies; pack prompt edits; Design Page section layout |
| **Status** | **COMPLETE** (2026-06-04) |

---

### 38D-2 — GAM workbook genre contract

| Field | Content |
|-------|---------|
| **Purpose** | Convert [38C-4](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-4-gam-instructional-genres.md) genre catalogue into **executable GAM obligations** tied to DLA `required_materials` |
| **Planned deliverable** | [observations/38D-2-gam-workbook-genre-contract.md](observations/38D-2-gam-workbook-genre-contract.md) |
| **Inputs from 38-C** | 38C-4 §4 (16 genres), §5 table rules, §6 sequence patterns, §7 DLA→GAM map, §9 AP-01–12; 38C-2 EV-01-G vs EV-03-G |
| **Success criteria** | Per-genre pass rules; **table-only workbook = contract FAIL**; capstone must not reprint all prior tables; ranking tables without pre-filled judgement |
| **Non-goals** | DLA activity design; renderer CSS; reopening `LD-MATERIALS-COPY` architecture (reference only) |
| **Status** | **COMPLETE** (2026-06-04) |

**Depends on:** 38D-1 (DLA must specify types GAM must realise)

---

### 38D-3 — Canonical workbook fixture

| Field | Content |
|-------|---------|
| **Purpose** | Define a **reference workbook brief** and expected upstream shape (DLA excerpt + expected GAM material type families + page targets) for reviewers and future gates |
| **Planned deliverable** | `fixtures/` artefacts + [observations/38D-3-canonical-workbook-fixture.md](observations/38D-3-canonical-workbook-fixture.md) (or equivalent) |
| **Inputs from 38-C** | 38C-1 MVP; 38C-5 journey; GOLDEN / EV-03 as ceiling comparators; Inflation topic as optional anchor |
| **Success criteria** | Fixture documents **≥2** non-table material families and consolidation intent; links to 38D-1/38D-2 contract clauses |
| **Non-goals** | Live LLM generation in this slice; modifying `tests/fixtures/page-render/` outside sprint pack without separate charter |
| **Status** | **COMPLETE** (2026-06-04) — fixture ID `CW-REF-38D3` |

**Depends on:** 38D-1, 38D-2

---

### 38D-4 — Workbook validation criteria

| Field | Content |
|-------|---------|
| **Purpose** | Define **PASS/FAIL** rules operable on GAM output, composed page, and optionally rendered HTML — separate from B4 table syntax |
| **Planned deliverable** | [observations/38D-4-workbook-validation-criteria.md](observations/38D-4-workbook-validation-criteria.md) |
| **Inputs from 38-C** | 38C-1 §6 reviewer template; 38C-4 genre-mix audit concept; 38C-5 E1–E17 checklist |
| **Success criteria** | Validation matrix: layer (DLA / GAM / page / render) × criterion × threshold; explicit **not** B4-only pass |
| **Non-goals** | CI probe implementation in this slice; automated `app.js` gate code |
| **Status** | **COMPLETE** (2026-06-04) |

**Depends on:** 38D-1, 38D-2, 38D-3

---

### 38D-5 — Inflation before/after evaluation

| Field | Content |
|-------|---------|
| **Purpose** | Plan evaluation of **EV-01 baseline** vs **post-contract** Inflation run using 38D-4 criteria |
| **Planned deliverable** | [observations/38D-5-inflation-before-after-evaluation.md](observations/38D-5-inflation-before-after-evaluation.md) |
| **Inputs from 38-C** | 38C-2 EV-01 scoring; 38C-6 §7 success signals; 38-B EV fixtures |
| **Success criteria** | Before/after comparison table defined; exit signals: GAM **>4** type families, 38C-1 PASS target, no 38-B preserve regression |
| **Non-goals** | Mandating live rerun in setup commit; renderer UX changes as success dependency |
| **Status** | **COMPLETE** (2026-06-04) |

**Depends on:** 38D-1 … 38D-4

---

## Phase dependency graph

```text
38D-1 DLA workbook contract
    → 38D-2 GAM workbook genre contract
        → 38D-3 Canonical workbook fixture
            → 38D-4 Workbook validation criteria
                → 38D-5 Inflation before/after evaluation
```

**Implementation** (pack prompts, probes, tests) is **downstream** of contract observations unless a phase explicitly charters code changes.

---

## Success criteria (sprint exit)

| Criterion | Measure |
|-----------|---------|
| DLA contract documented | 38D-1 **COMPLETE** ([38D-1](observations/38D-1-dla-workbook-contract.md)) |
| GAM contract documented | 38D-2 **COMPLETE** ([38D-2](observations/38D-2-gam-workbook-genre-contract.md)) |
| Canonical fixture defined | 38D-3 **COMPLETE** ([38D-3](observations/38D-3-canonical-workbook-fixture.md), `CW-REF-38D3`) |
| Validation criteria defined | 38D-4 **COMPLETE** ([38D-4](observations/38D-4-workbook-validation-criteria.md)) |
| Before/after plan documented | 38D-5 **COMPLETE** ([38D-5](observations/38D-5-inflation-before-after-evaluation.md)) |
| Sprint 38-D planning closed | 38D-1 … 38D-5 **COMPLETE** |
| 38-C traceability | Each 38D slice cites 38C inputs |
| Preserve stack respected | No 38-B architecture reopen without justification |
| Inflation baseline preserved | EV-01 referenced as **before** in 38D-5 |

**Optional later exit (implementation phase):** Post-contract Inflation PASS on 38D-4 + 38C-1 rubric.

---

## Boundaries with 38-C

| 38-C owns (closed) | 38-D owns |
|------------------|-----------|
| Pedagogy model, gap analysis, planning requirements | **Executable** DLA/GAM contracts |
| Learner experience observations | Validation + evaluation **plan** |
| “What should happen” | “What must be specified and authored” |

**Do not redefine** 38C-1 workbook definition or 38C-4 genre catalogue — **reference and operationalise**.

---

## Boundaries with 38-B

| 38-B owns | 38-D owns |
|-----------|-----------|
| Prompt size, module dedupe, B4 pipe fidelity | Workbook **genre** contracts atop preserve modules |
| `LD-*` preserve contracts | Mandatory upstream **authoring** when brief = workbook |
| Wave 1–3 implementation | Contract observations; phased pack implementation |

---

## References

- [HANDOVER.md](HANDOVER.md)
- [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md)
- [38C-6 execution recommendation](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-6-planning-synthesis-and-execution-recommendation.md)
