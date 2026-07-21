# Sprint 68 — Deferred Schema Work

**Status:** Empty pending investigation  
**Purpose:** Evidence-based specification for future pipeline work — not a speculative feature wishlist.

Do not add schema proposals until S68-BL-001 through S68-BL-008 demonstrate that renderer-first and render-model paths are insufficient.

Each entry must explain **why the renderer cannot solve the problem** with existing or mappable authoritative data.

---

## Candidate areas (unconfirmed — do not implement)

| Candidate | Trigger condition |
| --------- | ----------------- |
| Page-level `activity_transition` or bridge between activities | JSON lacks transition field across multiple fixtures AND preambles insufficient by design |
| Explicit bridge ownership (source activity → target activity) | Current beat-level prompt model cannot express inter-activity intent |
| Sequence-level coherence metadata | Progression guidance insufficient for multi-activity narrative |

---

## Register template

When a gap is confirmed, every proposal must include:

```markdown
### GAP-NNN — Title
**Classification:** lesson schema deficiency | pipeline generation deficiency
**Evidence:** fixtures checked; fields absent or unpopulated; investigation ID
**Learner impact:** what coherence gap the learner experiences
**Why renderer alone is insufficient:** renderer defect and render model deficiency ruled out
**Minimal lesson information required:** smallest authoritative addition needed
**Proposed field:** (minimal schema change, if any)
**Deferred to:** Sprint NN
```

Avoid speculative features. Proposals without evidence and learner impact do not belong in this register.
