# Context for next chat — Sprint 38-D

**Paste this pack path first:** `docs/development/sprints/2026-06-04-sprint-38d-workbook-authoring-contracts/`

---

## 1. What 38-D is

**Execution charter (pre-implementation)** — turn **38-C pedagogy** into **executable DLA and GAM workbook contracts**, a **canonical fixture**, **validation criteria**, and an **Inflation before/after plan**.

**Status:** **CLOSED** (planning) — 38D-1 … 38D-5 complete. **Implementation not started.**

---

## 2. Why it exists

38-C proved Inflation (EV-01) is an **activity sheet + reference notes**, not a workbook — **wrong genre upstream**, not Design Page stripping. EV-01-G authored **4** table types only; EV-03-G shows **8** types when spec shape differs.

**Hypothesis:** Explicit DLA obligations + enforced GAM genre authoring → Design Page preserves richer workbook material without inventing pedagogy.

**38-C pack:** `docs/development/sprints/2026-06-04-sprint-38c-self-study-workbook-pedagogy/`

---

## 3. 38-C evidence chain (read-only authority)

| Step | Document | Use in 38-D |
|------|----------|-------------|
| Model | [38C-1](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) | PASS/FAIL bar |
| Gaps | [38C-2](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-2-workbook-gap-analysis.md) | EV-01 baseline |
| DLA planning | [38C-3](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-3-dla-workbook-requirements.md) | → 38D-1 |
| GAM planning | [38C-4](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-4-gam-instructional-genres.md) | → 38D-2 |
| Experience | [38C-5](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-5-workbook-experience-rendering.md) | → 38D-4/5 |
| Synthesis | [38C-6](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-6-planning-synthesis-and-execution-recommendation.md) | Charter authority |

---

## 4. Phase map

| Phase | Deliverable |
|-------|-------------|
| **38D-1** | DLA workbook contract |
| **38D-2** | GAM workbook genre contract |
| **38D-3** | Canonical workbook fixture |
| **38D-4** | Workbook validation criteria |
| **38D-5** | Inflation before/after evaluation |

```text
38D-1 DLA contract → 38D-2 GAM contract → 38D-3 fixture → 38D-4 validation → 38D-5 evaluation
```

---

## 5. Sprint 38-D — **CLOSED** (planning)

| Slice | Deliverable |
|-------|-------------|
| 38D-1–5 | [observations/](observations/) — contracts, fixture, validation, evaluation plan |

**Inflation BEFORE:** `NEG-EV-01` — workbook **FAIL**, preservation **PASS**.

**Evaluation:** [38D-5 §6 scorecard](observations/38D-5-inflation-before-after-evaluation.md) — fill AFTER when implementation runs.

**Next programme step:** Implementation sprint (DLA/GAM pack contracts) → Inflation AFTER → Case A/B/C/D ([38D-5 §9](observations/38D-5-inflation-before-after-evaluation.md)).

Do **not** edit packs or `app.js` until implementation explicitly chartered.

---

## 6. Non-goals

- Renderer redesign · learner page UX · broad runtime refactor
- Prompt-size reduction · reopening 38-B preservation
- Sprint 39 reasoning cues
- Repo `tests/` or 38-B fixtures changes (except sprint-local `fixtures/` in 38D-3+)

---

## 7. 38-B preserve stack (do not reopen)

`LD-TABLE-FIDELITY` · `LD-MATERIALS-COPY` · `LD-DESIGN-PAGE-COMPOSE-CONTRACT` · B4 **MONITORING**
