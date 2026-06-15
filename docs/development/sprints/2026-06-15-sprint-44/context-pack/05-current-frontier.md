# Current Frontier — Sprint 44

**Date:** 2026-06-15  
**Purpose:** State exactly where work should continue

---

## Frontier Statement

Sprint 43 closed educational architecture. Sprint 44 works on **learner-facing instructional material quality** and **GAM capture safety**.

The principal open quality gap:

> Instructional material realisation — whether each material type performs its educational function.

---

## Active Work

### Sprint 44-1 — Tiered GAM Capture Validation Gate

| Field | Value |
| ----- | ----- |
| **Status** | Designed — ready for implementation |
| **Problem** | JSON stubs and under-covered GAM captures can reach Design Page without blocking workflow progression |
| **Solution** | Tiered capture gate on self-directed learner-page GAM step only |

**Tier behaviour:**

| Tier | Checks | Blocks? |
| ---- | ------ | ------- |
| 1 Structural | JSON stub; missing Material/Content pack format | **Yes** |
| 2 Coverage | Material count and activity coverage vs upstream DLA | **Yes** (when DLA available) |
| 3 Thin bodies | Checklist &lt; 80ch; other types &lt; 120ch | **Warn only** |

**Explicit exclusions:** FMT-06/07/08 inflation A4 checks not universal gates; no LLM repair; no renderer changes; no prompt changes.

**Success:** Bad structural captures cannot complete GAM step or advance; thin bodies visible but non-blocking.

---

### Sprint 44-2 — Instructional Depth Contracts

| Field | Value |
| ----- | ----- |
| **Status** | Draft 1 accepted as reference |
| **Type** | Educational design artefact — not implementation spec |
| **Problem** | Instructional expectations distributed; no single reviewer specification |

**Eleven material types:** text, worked_example, modelling_note, misconception_note, sample_output, decision_table, checklist, transfer_prompt, consolidation_summary, rubric, quality_criteria

**Per type:** educational purpose, learner effect, minimum/strong/failed realisation, failure modes, validation signals

**Immediate use:** Evaluate Marx and Photosynthesis material bodies — classify failed / minimum / strong per type; name recurring failure modes.

**Status clarification:** Contracts are normative; they do not claim current generators satisfy them.

---

### Sprint 44-3 — Instructional Pattern Library (Future)

| Field | Value |
| ----- | ----- |
| **Status** | Planned — not designed |
| **Trigger** | 44-2 evaluation shows contracts discriminate weak vs strong examples on benchmarks |
| **Purpose** | Reusable strong-realisation patterns per material type |
| **Type** | Educational design — not prompt implementation |

---

## Current Educational Questions

| Question | How Sprint 44 addresses it |
| -------- | --------------------------- |
| Do materials perform their instructional move? | 44-2 contracts + Marx/Photosynthesis evaluation |
| Which failure modes recur cross-domain? | Comparative 44-2 scoring |
| Can bad GAM captures be stopped before compose? | 44-1 implementation |
| Do depth contracts discriminate usefully? | Empirical — gates 44-3 |
| Where is exposition/modelling/closure weakest? | Evidence pack themes + 44-2 evaluation |
| Is thin body warning sufficient or should depth block later? | Out of 44-1 scope — observe after evaluation |

---

## Current Implementation Questions

| Question | Notes |
| -------- | ----- |
| How to wire capture gate without breaking facilitator runs? | 44-1 scope predicate — self-directed learner-page only |
| DLA unavailable — coverage tier behaviour? | Warn and skip block; Tier 1 still applies |
| Load gam-output-format in browser? | 44-1 design includes index.html |
| Harness vs runtime parity? | Keep validateGamPackTextOutput for tests |
| After 44-1 ships — what validates depth? | 44-2 review process first; implementation TBD post-evaluation |

---

## Explicit Non-Goals (Sprint 44)

Do not treat as current frontier unless user rescopes:

| Non-goal | Reason |
| -------- | ------ |
| Reopen ownership decision | Settled 43-02 |
| Reopen two-column model | Settled prototype direction |
| Re-diagnose salience / missing pedagogy | Settled Sprint 42–43 |
| Add workflow stages | Disproved |
| Renderer / page layout redesign | Out of scope |
| Prompt rewriting for depth | 44-2 is educational spec first |
| Universal inflation A4 semantic gates | 44-1 explicitly excludes |
| LLM auto-repair of GAM capture | 44-1 excludes |
| Visual affordances / diagrams / charts | Separate workflow |
| Weakening GAM preservation or activity membership | Fidelity remains baseline |

---

## Recommended Execution Order

```text
1. Implement or review 44-1 capture gate
2. Run 44-2 evaluation on Marx materials (primary)
3. Run 44-2 evaluation on Photosynthesis materials (secondary)
4. Synthesise recurring failure modes
5. Decide whether to design 44-3 pattern library
```

Parallel allowed: 44-1 implementation while 44-2 evaluation proceeds on existing captures.

---

## Success Criteria (Sprint 44)

| Criterion | Indicator |
| --------- | --------- |
| Capture safety | Structural failures block on self-directed learner-page GAM |
| Contract utility | Reviewer scores materials without architectural re-investigation |
| Cross-domain signal | Marx and Photosynthesis failure modes documented |
| Pattern readiness | Clear go/no-go for 44-3 |

---

## Where Not to Continue

- Sprint 43 investigation phase — **closed**
- Marx workflow re-run for ownership diagnosis — **not needed**
- Requesting full artefact re-paste — **not needed** unless user initiates new run
- Activity-led vs investigation debate — **settled**

Continue from **44-1 implementation** and **44-2 evaluation**.
