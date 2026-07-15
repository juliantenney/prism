# Sprint 61 — Backlog

**Updated:** 2026-07-15 (protocol freeze)  
**Status:** Open — scored Phase A authorised (S61-D11)  
**Protocol:** [PHASE-A-PROTOCOL.md](PHASE-A-PROTOCOL.md)

---

## Active — Phase A (baseline)

### S61-BL-000 — Optional non-scored smoke (artefact dry-run)

- **Intent:** 1 run each on B09 + B01; validate artefact pack workflow.
- **Excluded:** Bar calculations.
- **Target:** Before scored work (optional)

### S61-BL-001 — Run mechanism sparse briefs (B01–B03)

- **Harness:** Partial-page only · **3 runs each**
- **Expected set:** `{mechanism_explanation}`
- **Acceptance:** 9 matrix rows + brief-level outcomes; artefact packs complete
- **Target:** Phase A

### S61-BL-002 — Run process sparse briefs (B04–B06)

- **Expected set:** `{process_walkthrough}`
- **Target:** Phase A

### S61-BL-003 — Run mental-model sparse briefs (B07–B08)

- **Expected set:** `{mental_model_building}`
- **Target:** Phase A

### S61-BL-004 — Run no-archetype sparse briefs (B09–B10)

- **Expected set:** `∅`; false positives → `FALSE_POSITIVE`
- **Bar:** all 3 runs each must be `CORRECT_OMISSION`
- **Target:** Phase A

### S61-BL-005 — Document baseline selection behaviour

- **Intent:** Run-level counts + brief-level bar verdict; decision record.
- **Dependency:** 30 scored runs complete
- **Target:** Phase A exit

---

## Conditional — Phase B (calibration)

### S61-BL-101 — Identify smallest recurring failure pattern

- **Gate:** Phase A bar not met or clear repeatable pattern
- **Output:** Decision record citing matrix evidence

### S61-BL-102 — Minimal DLA enrich-contract guidance change

- **Constraint:** Guidance text only; same harness and replication policy
- **Gate:** S61-BL-101

### S61-BL-103 — Rerun unchanged 10-brief benchmark (30 runs)

- **Constraint:** Same brief wording; partial-page; 3× per brief
- **Gate:** S61-BL-102

---

## Phase C — confirmation

### S61-BL-201 — Holdout sparse briefs

- 3–5 briefs; new wording; same protocol otherwise
- **Target:** Phase C

### S61-BL-202 — Closure recommendation

- Close vs deterministic-selection successor sprint

---

## Explicitly deferred (out of Sprint 61)

| Item | Note |
| ---- | ---- |
| Enrich-in-place scored runs | Not authoritative harness |
| Priority-2 / UI / renderer / full packages | Out of scope |
| Deterministic classifier | Successor sprint if needed |
| Hand-authored DLA partials | Not spontaneous evidence |

---

## Carry-forward references (closed)

- [Sprint 59 closure](../2026-07-14-sprint-59-instructional-content-richness-audit/SPRINT-59-CLOSURE.md)
- [Sprint 60 closure](../2026-07-15-sprint-60-instructional-archetype-operationalisation/SPRINT-60-CLOSURE.md)
