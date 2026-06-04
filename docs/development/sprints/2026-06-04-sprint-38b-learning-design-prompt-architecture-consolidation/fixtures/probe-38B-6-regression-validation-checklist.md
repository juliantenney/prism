# Probe 38B-6 — Regression validation checklist

**Framework:** [observations/38B-6-regression-validation-plan.md](../observations/38B-6-regression-validation-plan.md)  
Use for **each** prompt consolidation PR in the implementation phase.

---

## Run metadata

| Field | Value |
|-------|--------|
| Wave (1–4) | |
| Phase (shared / GAM / DLA / Design Page / Assessment) | |
| Module IDs touched | |
| Change description | |
| Prompt baseline chars (38B-1) | |
| Prompt new chars (probe) | |
| Append markers before → after | |
| Branch / PR | |
| Test baseline pass count | |
| Test new pass count | |
| Date | |

---

## Wave gate (circle one)

- [ ] **Wave 1** — Shared modules  
- [ ] **Wave 2a** — GAM  
- [ ] **Wave 2b** — DLA  
- [ ] **Wave 3** — Design Page  
- [ ] **Wave 4** — Assessment / Sequence  

**Wave pass criteria:** see 38B-6 §5 — phase **FAIL** if any unchecked mandatory item below is fail.

---

## Automated (every PR)

- [ ] `node --test tests/*.test.js` — pass: ___ / fail: ___ (**L8-01** — P0)  
- [ ] `tests/design-page-materials-fidelity.test.js` (**L4-01–03**)  
- [ ] `tests/sprint-38-visual-affordances.test.js` (**L6-01**)  
- [ ] `tests/sprint-38-pedagogical-added-value.test.js` (**L6-02**)  
- [ ] `tests/utility-page-composition-closure.test.js` (if compose touched)  
- [ ] `tests/utility-ld-inflation-page-render.test.js` (if page render path touched)  
- [ ] `tests/utility-visual-affordance-hooks.test.js` (if affordances touched)  

**Probe (prompt PRs):**

- [ ] `node scripts/probe-38b1-ld-workflow-prompt-audit.js` — chars + markers (**L8-02**, **L8-03**)  
- [ ] Design Page only: `node scripts/probe-38b1-design-page-prompt-size.js` (if applicable)  

---

## Layer assertion quick pass

Mark **P** = pass, **F** = fail, **N/A** = not in PR scope.

| Layer | IDs (sample) | P/F/N/A |
|-------|----------------|---------|
| L0 | L0-01–03 | |
| L1 | L1-01–04 | |
| L2 | L2-01–04 | |
| L3 | L3-01–04 | |
| L4 | L4-01–09 | |
| L5 | L5-01–04 | |
| L6 | L6-01–05 | |
| L7 | L7-01–05 | |
| L8 | L8-01–04 | |

---

## Precedence adversarial (required if L4/L5/L6 prompt or Design Page output touched)

| ID | Rule | P/F | Notes |
|----|------|-----|-------|
| PREC-01 | Table fidelity > brevity | | |
| PREC-02 | Materials fidelity > overview prose | | |
| PREC-03 | Source fidelity > enrichment | | |
| PREC-04 | Visual affordances additive only | | |

---

## Anchor coverage

**Minimum:** Inflation **required** every PR. Add Climate / CI / Marx per change type (38B-6 §3).

| Anchor | Tier | Required this PR? | P/F | Notes |
|--------|------|-------------------|-----|-------|
| **Inflation** | MANDATORY | Yes | | `ld-inflation-workshop-page-full.json` + live rerun if Design Page/GAM |
| **Climate** | Required | | | `ld-climate-misconception-discussion-page.json` |
| **CI** | Required | | | `confidence-interval-a2-multitable-page.json` |
| **Marx** | Required | | | `marx-self-study-page.json` |
| Learner visibility | Recommended | | | `ld-inflation-workshop-learner-visibility-page.json` |

### Inflation (mandatory detail)

- [ ] **L3-01** All upstream activities present (or documented omission)  
- [ ] **L4-01** `materials` objects non-empty per activity with upstream materials  
- [ ] **L4-02** Rich content / not placeholder-only  
- [ ] Scenarios include names/numbers/context (**L2-02**)  
- [ ] **L4-04** No comma-row table anti-patterns (`Scenario 1,,,`)  
- [ ] **L4-05** Pipe tables in `analysis_table` / `comparison_table` / `impact_table` where expected  
- [ ] **L4-06** No standalone `Headers` / `Rows` prose blocks  
- [ ] **L6-01** `visual_affordance_schema_version` = `38.4`  
- [ ] **L6-03** Materials coexist with `visual_affordances[]`  
- [ ] B4-01 / B4-02 / B4-03 ([38B-4](../observations/38B-4-materials-and-table-fidelity.md))  

### Climate

- [ ] **L4-01–03** Materials richness  
- [ ] **L6-05** Affordance hooks render  
- [ ] Mechanism/evidence affordance ids preserved  

### CI

- [ ] **L4-05** Multi-table materials intact  
- [ ] **L7-05** Tables render in HTML export  

### Marx

- [ ] **L5-01** Reasoning / orientation fields  
- [ ] **L7-04** Learner voice; no facilitator headings  
- [ ] Materials tables if present (**L4**)  

---

## Phase-specific gates (38B-6 §5)

### Wave 1 — Shared modules

- [ ] Single authority per `LD-TABLE-FIDELITY`, `LD-MATERIALS-COPY`, `LD-MATH-RENDER`, `LD-SELF-DIRECTED-RHETORIC`  
- [ ] Precedence ladder text in modules  
- [ ] ≥15% augmented char reduction on heavy steps **or** documented deferral  

### Wave 2a — GAM

- [ ] ≤3 append markers  
- [ ] GAM Inflation artefact: pipes in `activity_materials` (**L4-07**)  

### Wave 2b — DLA

- [ ] Specifications-only output (**L0-03**)  
- [ ] `required_materials` references pipe tables  

### Wave 3 — Design Page

- [ ] Augmented ≤22,000 chars  
- [ ] ≤3 append units  
- [ ] PREC-01–04 all **P** on live Inflation rerun  

---

## Manual render spot-check

- [ ] HTML export — tables render as tables, not comma lists (**L4**, **L7**)  
- [ ] VEU authoritative mode matches affordance ids (**L6**)  
- [ ] Overview shortened but materials intact (**PREC-02**) — if rhetoric changed  

---

## Open failures / waivers

| Assertion | Severity | Waiver? | Owner | Expiry PR |
|-----------|----------|---------|-------|-----------|
| | | | | |

---

## Sign-off (38B-6 §7)

| Role | Name | Date | Gate |
|------|------|------|------|
| Author | | | AUTO + PROBE complete |
| Reviewer | | | Inflation MANUAL + PREC reviewed |
| Sprint owner | | | **MERGE APPROVED** / **MERGE WITH WAIVER** / **HOLD** / **ROLLBACK** |

**Programme exit (38B complete):** all waves signed; four anchors pass; 38B-4 B4-01–04 closed; Design Page ≤22k probe.
