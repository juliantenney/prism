# EV-38B4-03 — Inflation Generate Activity Materials live evidence

**Date:** 2026-06-04  
**Assertion:** [38B-6](38B-6-regression-validation-plan.md) **L4-07** (GAM `activity_materials` preserves pipes before Design Page merge)  
**Related cases:** [38B-4](38B-4-materials-and-table-fidelity.md) B4-01, B4-02, B4-03  
**Contract:** `lib/ld-table-fidelity.js` (author role) + pack §6 post [38B-W2A-1](38B-W2A-1-GAM-pack-authority-trim.md)

---

## 1. Executive verdict

| Question | Result |
|----------|--------|
| **L4-07 on live GAM output?** | **PASS** — 4/4 table-shaped materials emit markdown pipe tables with header + separator rows |
| **B4-01 / B4-02 at GAM (this run)?** | **PASS** — no comma-row pseudo-tables; no `Headers` / `Rows` prose blocks |
| **B4-03 at GAM (this run)?** | **PASS** — scenarios and table materials both populated; tables are pipes not CSV |
| **Programme B4 closed?** | **No** — programme row stays OPEN; **EV-38B4-01/02** same-run pipeline now shows Design Page **did not** introduce B4 shapes ([EV-38B4-01](EV-38B4-01-design-page-evidence.md)) |
| **B4 risk vs pre–Wave 1/W2a?** | **Reduced at GAM author** — live capture shows compliant pipes under current pack + runtime |
| **Wave 3 still required?** | **Yes** — Design Page preserve / merge and composed `learning_activities.materials` not validated here |

---

## 2. Run protocol

### 2.1 Anchor

| Item | Value |
|------|--------|
| Workflow intent | Inflation first-year economics **self-directed learner page** |
| Brief (goal) | Learner self-study inflation workshop: CPI, GDP deflator, household scenarios, policy communication |
| Brief (inputs) | First-year undergraduate economics (self-directed study) |
| Brief (outputs) | `learning_outcomes, learning_activities, activity_materials, page` |
| Resolved factors | `delivery_context: self_directed`, `learning_environments: [self_study]` |
| Upstream | `tests/fixtures/page-render/ld-inflation-workshop-upstream-learning-activities.json` activities **plus** synthetic `required_materials` per activity (table types aligned with golden fixture) |
| Step | `step_generate_activity_materials` / Generate Activity Materials |
| Model | `gpt-4.1-mini` (via `.env.local` `OPENAI_API_KEY`) |
| Temperature | 0.35 |
| Max output tokens | 6000 |
| Post-process | `sanitizeSelfDirectedGamMaterialsOutput` (self-directed GAM sanitizer) |

### 2.2 Reproducibility

| Asset | Path |
|-------|------|
| Raw GAM text | [fixtures/ev-38B4-03-inflation-gam-live.txt](../fixtures/ev-38B4-03-inflation-gam-live.txt) |
| Machine analysis | [fixtures/ev-38B4-03-inflation-gam-analysis.json](../fixtures/ev-38B4-03-inflation-gam-analysis.json) |
| One-shot runner (evidence only) | [fixtures/ev-38b4-03-gam-capture-once.mjs](../fixtures/ev-38b4-03-gam-capture-once.mjs) |

Command:

```bash
node docs/development/sprints/2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/ev-38b4-03-gam-capture-once.mjs
```

### 2.3 Prompt-stack caveat (important)

The capture runner reported **`promptAugmentedChars: 5033`** on the GAM step — equivalent to **pack seed + `LD-MATH-RENDER` only** in the [38B-1 probe](../scripts/probe-38b1-ld-workflow-prompt-audit.js), **not** the full self-directed stack (**~15,806** chars with `LD-TABLE-FIDELITY`, `LD-MATERIALS-COPY`, reading/voice/timeline, `LD-SELF-DIRECTED-RHETORIC`).

**Interpretation:** This live run validates **model behaviour under pack §6 (post W2a-1) + math contract**; it does **not** re-prove the full augmented stack length from the exit gate. Production Factory runs with brief resolution on a selected workflow should apply the full stack per probe audit.

**Conservative L4-07 claim:** Pass on **observed GAM artefact**; full-stack prompt parity should be confirmed on the next Inflation Factory run (or by aligning the capture runner with `buildWorkflowStepPromptAugmentContextFromStep` + probe `wfSelfDirected`).

---

## 3. Table-shaped materials inspection

### 3.1 Summary matrix

| Activity | Material | Type | Field location (GAM text) | Pipe table | B4 issues |
|----------|----------|------|---------------------------|------------|-----------|
| A1 | M3 | `classification_table` | `Material: M3` → `Content:` | Yes (`\| --- \|`) | None |
| A2 | M1 | `comparison_table` | `Material: M1` → `Content:` | Yes | None |
| A3 | M2 | `analysis_table` | `Material: M2` → `Content:` | Yes | None |
| A4 | M2 | `impact_table` | `Material: M2` → `Content:` | Yes | None |

Non-table materials (scenarios, task_cards, prompt_set, checklist): **no** comma-row or Headers/Rows patterns in `Content:` bodies.

### 3.2 Good examples (excerpts)

**A2 — `comparison_table` (pipe, multi-column):**

```text
| Indicator     | What it measures                      | Main use                         | ...
|--------------|-------------------------------------|----------------------------------| ...
| CPI          | Consumer prices for typical basket | Tracks cost of living changes    | ...
```

**A3 — `analysis_table` (pipe; scenarios in M1):**

```text
| Scenario | Who is affected?                     | Main price pressure        | Policy angle                  |
|----------|------------------------------------|----------------------------|-------------------------------|
| A        | Retired couple                     | Food, utilities            | Consider pension indexation   |
```

**A1 — `classification_table`:**

```text
| Item           | Rising price? | Affects students? |
|----------------|--------------|-------------------|
| Loaf of bread  | Yes          | Yes               |
```

### 3.3 Bad patterns checked (absent in GAM artefact)

| Pattern | B4 / L4 | Present in live GAM? |
|---------|---------|----------------------|
| `Scenario 1,,,` comma-row lines | B4-01 | **No** |
| `Headers` + `Rows` prose blocks | B4-02 | **No** |
| `Facilitator use:` sections | Self-directed conflict | **No** (sanitizer also ran) |
| Flattened CSV-only table bodies | B4-01 | **No** |
| Label-only table without pipes | B4-06 | **No** |

### 3.4 Partial preservation / row-adequacy notes (B4-03)

| Observation | Assessment |
|-------------|------------|
| A3 `analysis_table` rows pre-filled with example policy angles | **Not a B4 shape failure** — still valid pipe syntax; differs from golden fixture (blank learner cells) |
| A1 classification includes learner-classify rows | Acceptable author behaviour |
| Scenarios present for A3/A4 | **B4-03 satisfied at GAM** for this run |

---

## 4. Evaluation against contracts

### 4.1 `LD-TABLE-FIDELITY` (author role)

| Rule | Live GAM |
|------|----------|
| PREC-01 — no comma-row shorthand | **Met** |
| FORBIDDEN Headers/Rows prose | **Met** |
| Pipe table with header + divider | **Met** (4/4 table materials) |
| Tables in material `Content:` (not facilitator sections) | **Met** |

### 4.2 L4-07

**Criterion:** Inflation GAM artefact: pipes in `activity_materials` table fields.

**Result:** **PASS** — all `classification_table`, `comparison_table`, `analysis_table`, `impact_table` blocks contain `\| --- \|` or equivalent separator rows.

### 4.3 B4 case status (GAM stage only)

| Case | GAM-stage status | Notes |
|------|------------------|-------|
| B4-01 | **PASS** (this capture) | Programme row stays OPEN until Design Page EV-38B4-01 |
| B4-02 | **PASS** (this capture) | Same |
| B4-03 | **PASS** (this capture) | Prior PARTIAL referred to composed page / CSV table |

---

## 5. Reference comparison (non-live)

### 5.1 Golden upstream (`ld-inflation-workshop-page-full.json`)

`sections[activity_materials].content[]` — historical reference, **4/4** table blocks pass same B4 regex suite (read-only analysis 2026-06-04). Confirms anchor **can** carry good pipes; does not replace live EV.

### 5.2 Known bad composed-page shapes (pre-consolidation)

From [38B-4 § observed bad shapes](38B-4-materials-and-table-fidelity.md) and [CONTEXT-FOR-NEXT-CHAT](../CONTEXT-FOR-NEXT-CHAT.md) — comma-row and Headers/Rows on **composed page** materials. **Provenance not re-attributed** in this EV; Design Page capture (EV-38B4-01) still required.

### 5.3 CSV worksheet fixture (renderer probe)

`tests/fixtures/page-render/ld-inflation-workshop-csv-worksheet-page.json` — bad shapes in **`learning_activities[].materials.comparison_table` arrays** (composed page JSON), not in GAM text format. Illustrates downstream failure mode Wave 3 must guard against.

---

## 6. Conclusions for programme decisions

| Decision | Recommendation |
|----------|----------------|
| **PR-W2a-2** (runtime scaffold merge) | **Optional** — live GAM passed L4-07 without new runtime edits; merge still useful for prompt parity and marker count |
| **Wave 3 Design Page** | **Proceed** — programme B4 not closed without preserve-path evidence |
| **Sprint 39 ungate** | **Still blocked** on full 38B-6 implementation exit + Design Page PREC live gate |
| **Next capture** | EV-38B4-01/02 on **same** Inflation Factory run (GAM → Design Page) with full self-directed augmented prompt verified via probe |

---

## 7. Sign-off

| Role | Status |
|------|--------|
| EV-38B4-03 | **COMPLETE** — live artefact + analysis committed under `fixtures/` |
| L4-07 MANUAL | **PASS** (GAM upstream, 2026-06-04 capture, caveat §2.3) |
| Programme B4 | **OPEN** — Design Page path not re-validated |
