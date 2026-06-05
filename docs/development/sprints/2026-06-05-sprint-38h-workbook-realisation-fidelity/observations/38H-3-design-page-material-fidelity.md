# Slice 38H-3 — Design Page Material Fidelity

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Type:** Pack §13 + `lib/ld-table-fidelity.js` preserve role (narrow fidelity fix)  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38H-3  
**Inputs:** [38H-1](38H-1-workbook-realisation-fidelity-analysis.md) · [38G-5](../../2026-06-04-sprint-38g-activity-component-quality/observations/38G-5-acm-realisation-trace.md) · [38H-2](38H-2-gam-consolidation-discipline.md)  
**Target:** H-02 — table-adjunct instructional prose preservation at Design Page compose

---

## 1. Root cause recap

[38H-1](38H-1-workbook-realisation-fidelity-analysis.md) traced `EV-38G-AFTER` A2/A3:

| Stage | `analysis_table` content |
|-------|--------------------------|
| **GAM** | Pipe rows **+** `*Instructions:*` adjunct (271 + 186 chars) |
| **Design Page** | Pipe rows **only** (~457 chars lost) |

**Mechanism:** Design Page LLM compose followed **LD-TABLE-FIDELITY preserve role** literally as *"copy each **pipe block** verbatim"* — adjunct prose after the pipe table was treated as shorten-able non-table prose. Pack merge instruction also allowed *"shorten only clearly non-essential prose"* without an explicit table-field exception.

**Not implicated:** GAM (authors correctly), renderer, `app.js` runtime stripping, harness.

---

## 2. Exact implementation surface

| Layer | Role |
|-------|------|
| **`lib/ld-table-fidelity.js`** | Canonical L4 preserve contract — runtime embed via `buildLdTableFidelityPromptBlock({ role: "preserve" })` |
| **Pack §13 Design Page** | `promptTemplate` + `defaultPromptNotes` — explicit 38H-3 / DP-TABLE-ADJ-01 for LLM compose step |

**No** `app.js`, schema, DLA, GAM, renderer, or harness changes.

---

## 3. Clauses / files modified

### 3.1 `lib/ld-table-fidelity.js` — `PRESERVE_LINES`

| Before | After |
|--------|-------|
| Copy **pipe block** verbatim into `materials.<table_key>` | Copy **full upstream Content string** — pipe block **and** table-adjunct prose |
| — | **38H-3** row: preserve `*Instructions:*`, completion/interpretation guidance; pipe rows alone insufficient |
| Overrides non-essential shortening for materials bodies | Overrides brevity for `materials.<table_key>` — adjunct is L4-faithful, not L7 overview prose |

### 3.2 Pack §13 — `promptTemplate`

| Location | Change |
|----------|--------|
| **LD-TABLE-FIDELITY inline clause** | Full table material body + adjunct per 38H-3; **do not reduce to pipe-only** |
| **LD-MATERIALS-COPY merge line** | Exception: `materials.<table_key>` verbatim including adjunct (**DP-TABLE-ADJ-01**) |
| **MATERIALS FIDELITY block** | **DP-TABLE-ADJ-01 (38H-3)** — table + guidance = one instructional unit |

### 3.3 Pack §13 — `defaultPromptNotes`

Added: `38H-3 table-adjunct fidelity` + `DP-TABLE-ADJ-01` reference.

### 3.4 Tests

| File | Addition |
|------|----------|
| `tests/ld-table-fidelity.test.js` | Preserve role 38H-3 assertions |
| `tests/design-page-materials-fidelity.test.js` | Pack §13 38H-3 + runtime augmentation adjunct clauses |

---

## 4. Before / after examples

### 4.1 Before (EV-38G-AFTER A2 — loss)

**GAM `inflation_wb_02_ct` (excerpt):**

```markdown
| Year | CPI Value | ... |
|------|-----------|-----|
| 2018 | 100       |     |
...

*Instructions:* Calculate the annual inflation rate as the percentage change in CPI
from the previous year. Classify each year's trend...
```

**Page `materials.analysis_table`:** pipe rows only — `*Instructions:*` **absent**.

### 4.2 After (expected on EV-38H-AFTER)

**Page `materials.analysis_table`:** identical to GAM Content — pipe rows **and** `*Instructions:*` block preserved in the **same field**.

### 4.3 Pedagogical unit

Learner sees **table + how to complete it** as one material — not a bare grid requiring inference from distant `prompt_set` only.

---

## 5. Traceability to H-02

| 38H-1 finding | 38H-3 response |
|---------------|----------------|
| Loss at Design Page compose | LD-TABLE-FIDELITY preserve role + §13 DP-TABLE-ADJ-01 |
| ~271 + ~186 chars A2/A3 | Full field copy mandated |
| Contract gap ("pipe block only") | Closed — full `materials.<table_key>` body |
| GAM not changed | Confirmed — no §6 edits |
| Acceptance: page ≥ GAM for table materials | 38H-5 trace |

---

## 6. Hold-condition verification

| Hold | Check | Result |
|------|-------|--------|
| **V-01** table family | Pipe rows still required; no CSV flattening | **PASS** — PREC-01 / FORBIDDEN rules unchanged |
| **V-05** scenario Material | §5/§6 untouched | **PASS** |
| **38E-8/9** types | DLA/GAM rows unchanged | **PASS** — workbook-contract tests 13/13 |
| **38G-3** GAM-WB-21 | §6 untouched | **PASS** |
| **38H-2** GAM-WB-06b | §6 untouched | **PASS** |
| Table preservation | Pipe verbatim still required | **PASS** — additive adjunct rule |
| `app.js` / renderer | Not modified | **PASS** |
| Schema | Not modified | **PASS** |

**Test run:** `ld-table-fidelity` (5) + `design-page-materials-fidelity` (10) + `workbook-contract-prompt-surface` (13) = **28/28 PASS**.

---

## 7. Risks

| Risk | Mitigation |
|------|------------|
| LLM still drops adjunct despite prompt | 38H-5 empirical trace; iterate §13 wording only if needed |
| Duplication with `prompt_set` | Acceptable — table-local guidance preferred over loss (38H-1) |
| `app.js` inline LD-TABLE-FIDELITY bootstrap stale | Browser loads `lib/ld-table-fidelity.js` first (`index.html`); harness/vm tests load lib — charter excludes `app.js` |
| Over-preserving unrelated prose in table fields | Scope limited to same `materials.<table_key>` upstream body |

---

## 8. Validation plan

### 8.1 Completed (this slice)

- [x] `ld-table-fidelity.js` preserve role extended  
- [x] Pack §13 clauses + notes  
- [x] Targeted tests added — **28/28 PASS**  
- [x] Runtime augmentation test confirms 38H-3 in live Design Page prompt path  

### 8.2 On 38H-5 (`EV-38H-AFTER`)

1. Capture GAM + design page on inflation anchor (post-38H-2 + 38H-3 pack).  
2. For A2 `inflation_wb_02_ct` and A3 `inflation_wb_03_at`:  
   - **PASS** if page `materials.analysis_table` includes `*Instructions:*` matching GAM  
   - **PASS** if pipe rows unchanged vs `EV-38G-AFTER`  
3. Char length page table material ≥ GAM (minus whitespace-only diffs).  
4. No regression on scenario, worked_example, consolidation scaffold (38H-2).

---

## 9. Success criterion

| Criterion | Status |
|-----------|--------|
| Preservation contract extended | **DONE** |
| Pack §13 aligned | **DONE** |
| V-01/V-05/38E/38F/38G holds | **DONE** (tests) |
| Empirical adjunct on page | **Pending** — 38H-5 |

**Slice 38H-3:** **COMPLETE**  
**Next:** **38H-4** (harness KM) and/or **38H-5** (`EV-38H-AFTER` trace)
