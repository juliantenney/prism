# Sprint 77 — Context

**Status:** **OPEN** (opened 2026-08-14)  
**Role:** Inherited evidence and working hypotheses for the DLA prompt-architecture pilot  
**Charter:** [SPRINT-77-CHARTER.md](SPRINT-77-CHARTER.md) · **Plan:** [PLAN.md](PLAN.md)  
**Predecessor SSOT:** [S76-T-049](../2026-08-13-sprint-76-dla-rationalisation-and-content-quality-consistency/S76-T-049-sprint-76-closeout-and-prompt-architecture-handover.md)

Sprint 77 does **not** re-litigate Sprint 76 semantic findings. This file records what is inherited so T-010 can start from a clean baseline.

---

## 1. Why Sprint 77 is being opened

Sprint 76 closed a **semantic repair** programme. Remaining DLA prompt work is **architectural**: instructions are large, duplicated in assembly, and hard to trace from defect to canonical home.

T-010 (this sprint) must reconstruct **live DLA prompt assembly**. It must **not** design a section hierarchy or implement P05.

---

## 2. Size / assembly observations at Sprint 76 close

| Measure | Value |
| ------- | ----- |
| Unique DLA contract+shape | **18,872** characters |
| Copy dual-injects that pair | **yes** (P05 open / deferred) |
| Assembled ×2 from that pair | **37,744** before other DLA prompt material |
| Overall DLA prompt | substantially larger with pack/context/other instructions |

Do **not** assume prompt length alone causes behavioural failure.

---

## 3. Protected behavioural baseline

See [SPRINT-77-CHARTER.md](SPRINT-77-CHARTER.md). T-048 correction: a structural DLA spec (objective, equality constraint, numbers, derive/solve/verify) does **not** fail T-031 for omitting “must be solvable.” Inherent executability is **GAM**.

---

## 4. Inherited open items (visible; do not start)

| Item | Status |
| ---- | ------ |
| P05 duplicate DLA contract/shape Copy injection | OPEN / DEFERRED until architecture is known |
| GAM D pedagogical-function fulfilment | OPEN — not DLA architecture; do not diagnose in T-010 |
| GAM E learner-facing corruption | OPEN — separate from D and T-031 |
| Graphics / image lifecycle | OPEN / SEPARATE |
| T-032 A4 constructive alignment | OPEN diagnostic; T-033 stays closed |
| Settings (PB-FA-005) | Deferred |
| Evidence-injection rollback | Option only; not executed |
| Continue-to-Authoring async UI refresh | Open defect; not this sprint’s architecture pilot |
| RECOVER (Sprint 71 score regression) | Hypothesis only |
| S76-D03 prompt-engineering discipline | Transferred here as architecture work (inventory first) |

---

## 5. Authoritative inventory baseline (git)

Sprint 76 production (including T-031 / `76-DLA-PARTIAL-9`) is **committed**.

**Authoritative Sprint 77 inventory baseline HEAD:** `0b5402dcd989299bd284076efa1398d65eee63b5` — `Sprint 76: close DLA semantic repair chain and hand over prompt architecture`

T-010 inventories that committed repository state. Do not treat uncommitted Sprint 77 documentation as part of the DLA prompt baseline.

---

## Last updated

2026-08-14 — T-013 Phase A COMPLETE. Production still LEGACY. Inventory baseline HEAD 0b5402d.
