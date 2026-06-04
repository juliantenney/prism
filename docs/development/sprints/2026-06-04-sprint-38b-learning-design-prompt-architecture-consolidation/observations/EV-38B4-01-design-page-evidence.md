# EV-38B4-01 — Inflation Design Page live evidence (same run as EV-38B4-03 pipeline)

**Date:** 2026-06-04  
**Pair:** [EV-38B4-03](EV-38B4-03-inflation-gam-evidence.md) (GAM-only, earlier capture) · **this document** (DLA → GAM → Design Page same run)  
**Analysis:** [EV-38B4-02](EV-38B4-02-table-preservation-analysis.md)  
**Cases:** [38B-4](38B-4-materials-and-table-fidelity.md) B4-01, B4-02, B4-03

---

## 1. Executive verdict

| Question | Result |
|----------|--------|
| **Malformed tables introduced at Design Page?** | **No** in this same-run capture |
| **`learning_activities[].materials` table fields** | **4/4 primary activities (A1–A4)** carry pipe markdown with `\| --- \|` separators |
| **Comma-row / Headers+Rows (B4-01 / B4-02)** | **Absent** in composed page JSON |
| **Separate `activity_materials` section** | **Not emitted** — tables live under `Learning Activities` → `materials.<table_key>` |
| **Activity membership loss** | **No** for A1–A5 — all activities present; table keys populated on each row |
| **Programme B4 closed?** | **Not claimed** — historical bad shapes from pre-38B runs remain on record; this run does **not** reproduce them |

---

## 2. Run protocol

### 2.1 Pipeline (single session)

```text
Define Learning Outcomes (minimal JSON)
  → Design Learning Activities (JSON, A1–A5 + required_materials)
  → Generate Activity Materials (organised text, sanitised)
  → Design Page (page JSON, post-compose cognition pass)
```

| Step | Model | Max tokens | Augmented prompt (probe-style wf) |
|------|-------|------------|-----------------------------------|
| DLA | gpt-4.1-mini | 5000 | **4,690** |
| GAM | gpt-4.1-mini | 6500 | **5,033** |
| Design Page | gpt-4.1-mini | 8000 | **22,560** |

Brief: self-directed inflation learner page (same intent as EV-38B4-03).  
Post-process: `sanitizeSelfDirectedGamMaterialsOutput` on GAM; `applyPedagogicCognitionSemanticsToComposedPage` on page when sections present.

### 2.2 Artefacts

| Asset | Path |
|-------|------|
| Design Page JSON | [fixtures/ev-38b4-01-design-page.json](../fixtures/ev-38b4-01-design-page.json) |
| GAM text (same run) | [fixtures/ev-38b4-01-pipeline-gam.txt](../fixtures/ev-38b4-01-pipeline-gam.txt) |
| Machine summary | [fixtures/ev-38b4-01-02-pipeline-analysis.json](../fixtures/ev-38b4-01-02-pipeline-analysis.json) |
| Render excerpt (first 8k HTML) | [fixtures/ev-38b4-01-render-excerpt.html](../fixtures/ev-38b4-01-render-excerpt.html) |
| Runner | [fixtures/ev-38b4-01-02-pipeline-capture-once.mjs](../fixtures/ev-38b4-01-02-pipeline-capture-once.mjs) |

```bash
node docs/development/sprints/2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/ev-38b4-01-02-pipeline-capture-once.mjs
```

### 2.3 Page JSON shape note

The model composed a **heading-based** page (`sections[].heading`) rather than canonical `section_id` values (`learning_activities`, `activity_materials`).  

**Inspection path used:** `sections` where `heading` matches `Learning Activities` → `content[]` → `materials.<key>`.

`constraints_applied` in page root includes: *"Preserved upstream activity_materials table syntax"* and *"Structured materials as objects with named table fields"*.

---

## 3. Table-shaped materials on composed page

### 3.1 Per-activity matrix (`learning_activities.materials`)

| activity_id | Field | Pipe table | Chars | B4-01 comma-row | B4-02 Headers/Rows |
|-------------|-------|------------|------:|-----------------|-------------------|
| A1 | `classification_table` | **Yes** | 1,161 | No | No |
| A2 | `comparison_table` | **Yes** | 1,343 | No | No |
| A3 | `analysis_table` | **Yes** | 1,246 | No | No |
| A4 | `impact_table` | **Yes** | 1,727 | No | No |
| A5 | `classification_table` | **Yes** | 1,161 | No | No |
| A5 | `comparison_table` | **Yes** | 1,343 | No | No |
| A5 | `analysis_table` | **Yes** | 1,246 | No | No |
| A5 | `impact_table` | **Yes** | 1,727 | No | No |

A5 repeats all four tables (synthesis activity) — **not** a B4 shape failure; tables remain pipes.

### 3.2 Good example (A3 `analysis_table`)

**JSON path:** `sections[Learning Activities].content[A3].materials.analysis_table`

```text
| Expense Category     | Price Before Inflation ($) | Price After Inflation ($) | Percentage Change (%) | Notes on Impact                                  |
|----------------------|----------------------------|--------------------------|----------------------|-------------------------------------------------|
| Groceries            | 400                        | 440                      | 10                   | Increased food costs reduce discretionary income. |
```

### 3.3 Bad patterns checked (absent in page JSON)

| Pattern | Present? |
|---------|----------|
| `Scenario 1,,,` comma-row lines | **No** (full-file grep) |
| `Headers` / `Rows` prose blocks | **No** |
| CSV string arrays in `comparison_table` | **No** (cf. `ld-inflation-workshop-csv-worksheet-page.json`) |
| Empty `materials: {}` on table activities | **No** for A1–A4 |

### 3.4 `activity_materials` section

**Not present** as a separate section. Upstream GAM text was absorbed into per-activity `materials` objects on the Design Page row.  

**Implication for hypothesis #6 (38B-4):** Orphan section dump **did not occur** in this run; tables are **not** missing from activity cards due to section-only placement.

---

## 4. GAM vs Design Page (same run)

| activity_id | Table type (GAM) | In GAM output | In page `materials` | Degradation |
|-------------|------------------|---------------|---------------------|-------------|
| A1 | `classification_table` | Pipe | Pipe in `materials.classification_table` | **None** |
| A2 | `comparison_table` | Pipe | Pipe in `materials.comparison_table` | **None** |
| A3 | `analysis_table` | Pipe | Pipe in `materials.analysis_table` | **None** |
| A4 | `impact_table` | Pipe | Pipe in `materials.impact_table` | **None** |

Content is **near-verbatim** carry-forward from GAM `Content:` blocks into named material fields (Design Page model behaviour on this run).

---

## 5. Rendered representation

| Check | Result |
|-------|--------|
| `buildUtilityStructuredHtmlForTest(page)` | Ran; excerpt saved |
| HTML `<table>` tags in excerpt | **Not observed** in first 8k chars |
| Comma-row / Headers+Rows in HTML | **Not observed** |

**Note:** Heading-based page shape may limit renderer table normalisation vs production `section_id` fixtures. Renderer verification is **inconclusive** for semantic `<table>` output; **JSON-level B4 shapes pass**.

---

## 6. B4 case classification (this capture)

| Case | Status | Evidence |
|------|--------|----------|
| **B4-01** | **PASS** | No comma-row pseudo-tables in any `materials.*` string |
| **B4-02** | **PASS** | No Headers/Rows prose substitute |
| **B4-03** | **PASS** | Scenarios implied in activity tasks; table + narrative materials populated |

---

## 7. Conclusions

| Layer | Finding |
|-------|---------|
| **Merge** | Tables merged into `materials.<table_key>` as pipe strings |
| **Preservation** | No flattening to comma-rows or prose Headers/Rows detected |
| **Transformation** | Sprint 38 affordances added at page root; **did not** replace table bodies in this JSON |
| **Rendering prep** | Inconclusive HTML tables; JSON fidelity **good** |

**Historical regression (38B-4 § observed bad shapes):** **Not reproduced** on this 2026-06-04 same-run path when GAM already emitted pipes.

**Wave 3:** Still warranted for consolidated compose contract and production `section_id` shape — but this evidence shows **Design Page is capable of preserve** when upstream GAM pipes are present.

---

## 8. Sign-off

| ID | Status |
|----|--------|
| EV-38B4-01 | **COMPLETE** |
| EV-38B4-02 | **COMPLETE** (companion analysis doc) |
| Programme B4 | **OPEN** (historical + multi-run variance) — **risk reduced** when upstream + DP stack align |
