# Current State Snapshot — Sprint 17 pack

**Role:** authoritative for **this pack only** (portable continuity).

**Canonical live source (outside this pack):** `docs/development/current-state.md` in the repository (may lag this pack; **this file** defines Sprint 17 active focus).

**Snapshots in this pack:** `context-files/current-state.md` is a **point-in-time** copy from pack creation.

---

## Active sprint

- **Sprint 17 — Research Elicitation & Sparse Brief Testing** — improve Research **factor resolution**, **sparse-brief** behaviour, and **assumption visibility** under bounded planning changes. **Prep:** `context-files/sprint-17-research-elicitation-sparse-brief-prep.md`. **Pack:** `docs/development/sprints/2026-05-15-sprint-17-research-elicitation-sparse-brief-testing/`.
- **Status:** Prep **complete** (docs-only). **Implementation not started** — first task is **S1–S6 golden fixtures**.

---

## Closed baseline (do not reopen)

| Sprint | Role |
|--------|------|
| **Sprint 16** | **Closed** — shared `page` renderer hardening; shape-first regression; **80 tests green** |
| **Sprint 15** | Research E2E Design Page → Utilities HTML |
| **Sprint 14** | Runnable Research domain maturity |

---

## Proven (carry into Sprint 17)

- Renderer and `page` contract stable (Sprint 16).
- Research workflow heuristics covered by existing tests (validation intent, design-page append).
- **`node --test tests/*.test.js`** → **80 passed**, 0 failed (2026-05-15).

---

## Open work (Sprint 17)

- Sparse-brief **golden fixtures S1–S6** (not yet in repo).
- Baseline tests for current factor resolution **before** inference changes.
- Candidate: expanded Research `inferenceRules`, conflict detection for `objective_type`, assumption disclosure in resolved panel.

---

## Immediate next action

1. Open **`GPT-BOOTSTRAP-PROMPT.md`**; paste copy-paste block into fresh chat if needed.
2. Run **`node --test tests/*.test.js`** — confirm **80 passed**.
3. Create **`tests/fixtures/workflow-brief-research-sparse/`** with S1–S6; add test file pinning current planner behaviour.

---

## Out of scope (Sprint 17)

- Renderer / Utilities HTML
- Workflow schema redesign
- Broad domain-pack rewrite
- Orchestration architecture
- LD implementation (lessons documented only)

---

## Review log

- **2026-05-15** — Pack `CURRENT-STATE.md` created for Sprint 17 handover.
