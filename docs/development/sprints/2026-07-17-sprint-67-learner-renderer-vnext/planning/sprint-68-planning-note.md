# Draft Sprint 68 Planning Note

**Status:** Draft planning note only — **Sprint 68 is not created**  
**Date:** 2026-07-17 (updated 2026-07-21)  
**Depends on:** Sprint 67 closed — vNext default export shell complete  
**Location intent (when opened):** `docs/development/sprints/YYYY-MM-DD-sprint-68-…` (not created yet)

---

## First Sprint 68 startup item

**Restore consistent activity-to-activity bridging.**

Initial investigation must determine:

- whether authoritative bridge text already exists in the JSON or render model
- why only one intellectual coherence bridge is currently visible
- whether existing bridge content is misplaced inside the destination activity
- how to render concise transitions between consecutive activity articles
- what schema or pipeline data is genuinely missing, if existing data is insufficient

---

## Purpose (likely)

After Sprint 67 proves deterministic learner rendering behind a flag, Sprint 68 would clean up the superseded association architecture and complete migration.

---

## Likely workstreams (not committed scope)

1. **Legacy renderer retirement** — remove or quarantine the default-legacy learner beat path once vNext is default.  
2. **Heuristic removal** — delete or archive `ld-beat-assignment-compose` scoring / sinks if unused.  
3. **Planner consolidation** — stop dual emit; keep registry only if still needed for non-render diagnostics, or retire emit use entirely.  
4. **Dead code removal** — orphaned prompt collectors, unused consumption flags, post-render expected-output inserters on the learner path.  
5. **Migration validation** — multi-fixture / multi-lesson parity beyond heteroscedasticity; default flip checklist; rollback drills.

---

## Explicit non-goals for this note

* Do not open Sprint 68 folders or charters now.  
* Do not delete legacy code during Sprint 67.  
* Do not treat this note as authorisation to change defaults.

---

## Entry criteria (suggested)

* Sprint 67 DoD met.  
* Decision logged to make vNext default (or to keep dual indefinitely — then Sprint 68 scope shrinks).  
* Architecture exclusion tests still green.

---

## Exit criteria (suggested)

* Single learner render architecture in production.  
* Heuristic / dual-planner emit paths gone or clearly non-reachable.  
* Migration evidence recorded; rollback documented historically.
