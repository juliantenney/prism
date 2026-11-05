# Sprint 96 — START HERE

**Sprint:** 96 — Unified Learning Journey Experience & Compatibility  
**Status:** **OPEN** — M1–M4 **ACCEPTED** (M3/M4/D15 qualified); M5.3 **ACCEPTED** (qualified, S96-D17); LJ download **unified-only (S96-D14)**; **M5 final not accepted**  
**Opened:** 2026-11-03  
**Type:** Bounded implementation — experience polish + mathematics compatibility + publishing default gate  
**Opening decision:** [S96-D01](decisions.md#s96-d01--open-sprint-96--unified-learning-journey-experience--compatibility)  
**Charter:** [SPRINT-96-CHARTER.md](SPRINT-96-CHARTER.md)  
**Map:** [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md)  
**M5 plan:** [M5-VERIFICATION.md](M5-VERIFICATION.md)  
**Fidelity gate:** [RESOURCE-FIDELITY-GATE.md](RESOURCE-FIDELITY-GATE.md)  
**Investigation:** [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md)  
**Baseline commit:** `c5d93e85cb4bf1457f499ccac76763d75d272dad`  
**Predecessor:** [Sprint 95 — CLOSED — ACCEPTED](../2026-11-03-sprint-95-unified-learning-journey-runtime/SPRINT-95-CLOSURE.md) — **do not reopen**  
**Backlog:** [PB-FA-024](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-024--unified-learning-journey-experience--compatibility)

---

## If you are starting a new session

1. Read this file.  
2. Read [decisions.md](decisions.md) — especially S96-D13 / D15 / D16 / D17 (accepted qualified) and S96-D14.  
3. Read [M5-VERIFICATION.md](M5-VERIFICATION.md), [VALIDATION.md](VALIDATION.md), [STATUS.md](STATUS.md).  
4. Execute remaining M5 checks (M5.1, M5.2 disposition); do **not** create `SPRINT-96-CLOSURE.md` without author approval.  
5. Do **not** regenerate or overwrite stored DUU C5/C6 (deferred per S96-D13).  
6. Do **not** reopen Sprint 94 or Sprint 95.  
7. Author LJ download is already unified-only (S96-D14); do **not** claim Sprint 96 complete until M5 is accepted.

| Fact | State |
| ---- | ----- |
| Sprint 95 | **CLOSED — ACCEPTED** |
| Sprint 96 | **OPEN** |
| Baseline | `c5d93e85cb4bf1457f499ccac76763d75d272dad` |
| M1 Navigation and layout | **ACCEPTED** |
| M2 Visual coherence | **ACCEPTED** (S96-D09) |
| Resource-fidelity gate | **ACCEPTED** (S96-D11) |
| M3 Contextual guidance | **ACCEPTED** (qualified, S96-D13) |
| Viewport-centred reading | **ACCEPTED** (qualified, S96-D15) |
| LJ author download | **Unified-only** (S96-D14) |
| Legacy multi-document packager | Internal / tests only |
| Standalone publishing | Must remain fully supported |
| M4 mathematics gate | **ACCEPTED** (qualified, S96-D16) |
| M5.3 Accessibility smoke | **ACCEPTED** (qualified, S96-D17) |
| M5 Final acceptance | **OPEN** — not accepted |
| MathLive textarea fallback | **Not** accepted as proof MathLive works |

---

## Hard constraints

Preserve standalone publishing. No CDN maths at runtime. No inventing acceptance. No prompt/rubric changes for QA archive. Formal SR ≠ smoke test.
