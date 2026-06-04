# Slice 38D-4 — Workbook validation criteria

**Date:** 2026-06-04  
**Status:** **COMPLETE**  
**Charter:** [PLANNING-CHARTER.md](../PLANNING-CHARTER.md) § 38D-4  
**Authority:** [38D-1](38D-1-dla-workbook-contract.md) · [38D-2](38D-2-gam-workbook-genre-contract.md) · [38D-3](38D-3-canonical-workbook-fixture.md) · [38C-1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) · [38C-2](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-2-workbook-gap-analysis.md) · [38C-5](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-5-workbook-experience-rendering.md)  
**Fixture:** `CW-REF-38D3` — [fixtures/](../fixtures/)  
**Out of scope:** Probes · CI · `app.js` · pack implementation

---

## 1. Purpose

Define a **formal workbook validation model** that determines **PASS** or **FAIL** at four layers — **DLA**, **GAM**, **Page**, **Render** — for `self_directed` + `page_profile: learner` **self-study workbook** runs.

**Success for this slice:** A reviewer can apply §5 rules and §6 severity model to **EV-01**, **EV-03**, or **`CW-REF-38D3`** and reach the **same verdict** as [38C-2](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-2-workbook-gap-analysis.md) / [38D-3 §9](38D-3-canonical-workbook-fixture.md) without ad hoc judgement.

---

## 2. Inputs and authority

| Source | Role |
|--------|------|
| [38D-1](38D-1-dla-workbook-contract.md) | DLA-WB-01 … 19 → V1 rules |
| [38D-2](38D-2-gam-workbook-genre-contract.md) | GAM-WB-* · MIX-* → V2 rules |
| [38D-3](38D-3-canonical-workbook-fixture.md) | Draft V-01 … V-13 · PASS benchmark |
| [38C-1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) | R1–R7 · function rubric → V-10 |
| [38C-5](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-5-workbook-experience-rendering.md) | E1–E17 → V-11 |
| [38C-2](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-2-workbook-gap-analysis.md) | EV-01 calibration baseline |
| **38-B B4** | Table **syntax** preserve only → **V-13** (orthogonal) |

---

## 3. Validation philosophy

| Principle | Meaning |
|-----------|---------|
| **Workbook ≠ preservation** | [38-B](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/) B4 / `LD-TABLE-FIDELITY` gates **pipe-table syntax** and GAM→DP copy — **not** instructional genre or pedagogy ([38C-6 §3](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-6-planning-synthesis-and-execution-recommendation.md)). |
| **Workbook PASS ≠ table fidelity PASS** | EV-01 can **Pass V-13** and **Fail** all pedagogical rules — tables verbatim, workbook **FAIL**. |
| **Pedagogy + experience** | Validation judges **what the learner needs** (teach, model, check, close) — not token count or section count alone. |
| **Layered gates** | Upstream FAIL (DLA/GAM) makes downstream PASS **non-credible**; page/render confirm visibility. |
| **Comparator anchors** | **NEG-EV-01** = anti-pattern floor; **CW-REF-38D3** = structural ceiling for PASS. |

```text
Brief (workbook intent)
  → V1 DLA contract
      → V2 GAM genre contract
          → V3 Page (38C-1 on composed JSON)
              → V4 Render (38C-5 E1–E17 on HTML)
```

**V-13** runs **in parallel** — never substitutes for V-01–V-11.

---

## 4. Validation layers

### Layer V1 — DLA

| Field | Definition |
|-------|------------|
| **Scope** | `learning_activities[]`, session metadata, `required_materials` specs, `learner_task`, duration |
| **Evidence** | DLA JSON export; if absent, infer from GAM/page with **Unknown** flags |
| **Reviewer** | Score [38D-1 §8](38D-1-dla-workbook-contract.md); rules **V-08**, **V-09** |
| **PASS** | All DLA-WB **Mandatory** Pass; **V-08** Pass |
| **FAIL** | Any Mandatory Fail on committed or inferred DLA |

### Layer V2 — GAM

| Field | Definition |
|-------|------------|
| **Scope** | Organised GAM text / `activity_materials` bodies, `Material: (type)` inventory |
| **Evidence** | [ev-*-pipeline-gam.txt](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/) or live capture |
| **Reviewer** | Score [38D-2 §12](38D-2-gam-workbook-genre-contract.md); rules **V-01–V-07**, **V-12** |
| **PASS** | All applicable V2 rules Pass; **MIX-01** Pass |
| **FAIL** | **V-02** Fail (AP-01) → automatic workbook FAIL |

### Layer V3 — Page

| Field | Definition |
|-------|------------|
| **Scope** | Composed Design Page JSON — `sections`, `learning_activities`, merged `materials.*` |
| **Evidence** | `design-page.json` export |
| **Reviewer** | [38C-1 §6](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) function scores; rule **V-10** |
| **PASS** | R1–R7 all satisfied (workbook genre PASS) |
| **FAIL** | Any R1–R4 **Absent**; F1 genre = activity_sheet + reference_notes |

*Note:* If GAM omitted a genre, page **cannot** Pass V-10 for that function ([38C-2 §7.1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-2-workbook-gap-analysis.md)).

### Layer V4 — Render

| Field | Definition |
|-------|------------|
| **Scope** | Learner-visible HTML — pedagogy **on screen** |
| **Evidence** | Render export / excerpt; optional when only JSON reviewed |
| **Reviewer** | [38C-5 §9](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-5-workbook-experience-rendering.md) E1–E17; rule **V-11** |
| **PASS** | Mandatory E-items **Y** (see V-11) |
| **FAIL** | Any mandatory E-item **N** when JSON suggested Present — **render gap** |

---

## 5. Validation rules (V-01 … V-13)

| Sev | ID | Layer | Rule summary |
|:---:|----|-------|--------------|
| **C** | V-02 | GAM | Non-table genre exists (not table-only) |
| **C** | V-03 | GAM | Consolidation body present |
| **C** | V-10 | Page | 38C-1 R1–R4 mandatory functions Present |
| **M** | V-01 | GAM | ≥4 type families |
| **M** | V-04 | GAM | Worked example present |
| **M** | V-05 | GAM | Scenario when case language |
| **M** | V-06 | GAM | Capstone not table dump |
| **M** | V-07 | GAM | No pre-filled judgement |
| **M** | V-08 | DLA | Duration 50–70 min |
| **M** | V-09 | DLA | DLA-WB Mandatory Pass |
| **M** | V-12 | Prog | Type inventory ≠ EV-01-only |
| **m** | V-11 | Render | Experience checklist |
| **—** | V-13 | Prog | B4 syntax independent |

*Sev:* **C** = Critical · **M** = Major · **m** = Minor

---

### V-01 — Genre family diversity

| Field | Content |
|-------|---------|
| **Rationale** | Workbook requires multi-genre arc ([38D-3 §7](38D-3-canonical-workbook-fixture.md)); [GAM-WB-MIX-02](38D-2-gam-workbook-genre-contract.md) |
| **Pass** | ≥**4** distinct type **families** session-wide (narrative, structured practice, retrieval, closure per [38D-2 §8](38D-2-gam-workbook-genre-contract.md)) |
| **Fail** | &lt;4 families |
| **Evidence** | GAM `Material:` type inventory |
| **DLA** | WB-06 |
| **GAM** | MIX-02 |
| **38C** | Materials variety §4; supports R1, R3, R4 |

---

### V-02 — Not table-only (AP-01)

| Field | Content |
|-------|---------|
| **Rationale** | **AP-01** — root EV-01 failure |
| **Pass** | ≥1 **non-table** `Material` type in session |
| **Fail** | Only `*_table` family types — **automatic workbook FAIL** |
| **Evidence** | GAM type list |
| **DLA** | WB-06 |
| **GAM** | MIX-01 |
| **38C** | F1 hybrid genre risk |

---

### V-03 — Consolidation material

| Field | Content |
|-------|---------|
| **Rationale** | R4 critical for self-study ([38C-1 R4](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)) |
| **Pass** | `consolidation_summary` (or equivalent closure body) ≥**80** words, ≥**3** ideas — **not** table reprint |
| **Fail** | Absent; capstone `prompt_set` only; four-table closure |
| **Evidence** | GAM body; page `materials` if merged |
| **DLA** | WB-12 |
| **GAM** | WB-06 · MIX-03 |
| **38C** | Consolidation §3.8 |

---

### V-04 — Worked example

| Field | Content |
|-------|---------|
| **Rationale** | R5 path ([38C-1 R5](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)) |
| **Pass** | `sample_output` or stepped example with ≥**3** visible steps |
| **Fail** | Absent; pre-filled worksheet as “example” |
| **Evidence** | GAM; page materials |
| **DLA** | WB-08 |
| **GAM** | WB-02 · MIX-04 |
| **38C** | Worked examples §3.2 |

---

### V-05 — Scenario alignment

| Field | Content |
|-------|---------|
| **Rationale** | **AP-04** — GAP-02 |
| **Pass** | Every activity with case/scenario language in DLA/GAM has `scenario` material with ≥**2** cases |
| **Fail** | Case language without scenario block; placeholder label |
| **N/A** | No case language in session |
| **Evidence** | GAM; DLA `required_materials` |
| **DLA** | WB-18 |
| **GAM** | WB-10 |
| **38C** | Guided practice §3.4 |

---

### V-06 — Capstone anti-dump

| Field | Content |
|-------|---------|
| **Rationale** | **AP-02** / GAP-08 |
| **Pass** | Capstone ≤**1** full `*_table` block; primary = template / transfer / consolidation |
| **Fail** | Capstone re-authors all prior table types (EV-01 A5) |
| **Evidence** | GAM capstone activity |
| **DLA** | WB-16 · WB-05 |
| **GAM** | WB-20 · MIX-06 |
| **38C** | Synthesis §3.9; fading §3.5 |

---

### V-07 — Learner judgement not pre-filled

| Field | Content |
|-------|---------|
| **Rationale** | **AP-03** / GAP-09 |
| **Pass** | Ranking/compare tables: judgement column **empty** OR rubric + learner rank only |
| **Fail** | Pre-filled effectiveness ratings (EV-01 A4) |
| **N/A** | No rank/compare activity |
| **Evidence** | GAM table cells |
| **DLA** | WB-15 |
| **GAM** | WB-09 · WB-16 |
| **38C** | Evaluative judgement §3.11 |

---

### V-08 — Duration budget

| Field | Content |
|-------|---------|
| **Rationale** | R7 · GAP-06 |
| **Pass** | Sum `duration_minutes` ∈ **[50, 70]** or documented exception |
| **Fail** | Sum **&gt;70** or **&lt;50** without exception (EV-01: **125**) |
| **Evidence** | DLA JSON; page activity badges |
| **DLA** | WB-03 |
| **GAM** | — |
| **38C** | §4 duration |

---

### V-09 — DLA contract complete

| Field | Content |
|-------|---------|
| **Rationale** | Upstream spec authority ([38D-1](38D-1-dla-workbook-contract.md)) |
| **Pass** | All DLA-WB **Mandatory** Pass (or N/A with justification) |
| **Fail** | Any Mandatory Fail |
| **Evidence** | DLA export |
| **DLA** | WB-01 … 19 |
| **GAM** | WB-00 precondition |
| **38C** | Preconditions for R1–R7 |

---

### V-10 — Page workbook functions (R1–R7)

| Field | Content |
|-------|---------|
| **Rationale** | Normative learner product bar [38C-1 §5.1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) |
| **Pass** | **R1** teaching Present · **R2** guided Present · **R3** retrieval Present · **R4** consolidation Present · **R5** example OR modelling Present · **R6** synthesis OR transfer Present · **R7** duration/solo met |
| **Fail** | Any of R1–R4 **Absent**; R5 and R6 both Absent |
| **Evidence** | Composed page JSON |
| **DLA/GAM** | Outcome of V1–V2 |
| **38C** | §5.1 PASS rules |

---

### V-11 — Render experience checklist

| Field | Content |
|-------|---------|
| **Rationale** | Learner-visible confirmation [38C-5](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-5-workbook-experience-rendering.md) |
| **Pass** | **E1, E2, E5, E9, E13, E14, E15, E16, E17** = **Y** |
| **Fail** | Any of the above **N** when page JSON indicated Present |
| **Partial** | HTML not available — score page only; note V4 **Incomplete** |
| **Evidence** | HTML export |
| **38C** | [38C-5 §9](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-5-workbook-experience-rendering.md) E1–E17 |

---

### V-12 — Distinct from EV-01-only inventory

| Field | Content |
|-------|---------|
| **Rationale** | Programme regression guard ([38D-3 §9](38D-3-canonical-workbook-fixture.md)) |
| **Pass** | Session type set **not** subset of `{classification_table, comparison_table, analysis_table, impact_table}` only |
| **Fail** | Exactly EV-01 four-type pattern |
| **Evidence** | GAM type list vs [NEG-EV-01](../fixtures/negative-exemplar-ev01-index.md) |
| **38C** | Genre misclassification guard |

---

### V-13 — B4 preservation independent

| Field | Content |
|-------|---------|
| **Rationale** | Prevent conflating syntax gate with workbook quality |
| **Pass** | B4 / table preserve check Pass on artefacts (38-B programme) |
| **Fail** | Malformed pipe tables |
| **Note** | **Does not imply** V-01–V-11 Pass |
| **Evidence** | 38-B gate fixtures |
| **38C** | — |

---

## 6. Pass/fail model

### 6.1 Severity definitions

| Severity | Meaning | Workbook impact |
|----------|---------|-----------------|
| **Critical** | Missing function required for self-study workbook identity | **Automatic FAIL** |
| **Major** | Significant pedagogical gap; may be recoverable in partial review | **FAIL** unless waiver documented |
| **Minor** | Experience or recommended clause gap | **PASS with warnings** only if all Critical/Major Pass |

### 6.2 Automatic FAIL conditions

| ID | Condition | Typical rule |
|----|-----------|--------------|
| **AF-01** | **AP-01** table-only GAM | **V-02** Fail |
| **AF-02** | Consolidation **Absent** on page | **V-03**, **V-10** R4 |
| **AF-03** | Explanatory teaching **Absent** | **V-10** R1 |
| **AF-04** | Retrieval **Absent** | **V-10** R3 |
| **AF-05** | Capstone reference dump | **V-06** Fail |
| **AF-06** | DLA duration **&gt;70** without exception | **V-08** |
| **AF-07** | Both worked example **and** modelling **Absent** | **V-04**, **V-10** R5 |

### 6.3 Workbook PASS threshold

**Workbook validation PASS** requires **all**:

| Gate | Requirement |
|------|-------------|
| **G1** | Zero **Critical** rule failures |
| **G2** | **V1** Pass: **V-08**, **V-09** |
| **G3** | **V2** Pass: **V-01–V-07** (N/A excluded), **V-12** |
| **G4** | **V3** Pass: **V-10** |
| **G5** | **V4** Pass: **V-11** when HTML reviewed; else **Incomplete** flagged |
| **G6** | Classified as **self_study_workbook** per [38C-1 §5.1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) — not activity_sheet + reference_notes only |

**Optional reporting:** **V-13** Pass/Fail recorded separately as **Preservation: PASS/FAIL**.

### 6.4 Partial workbook (planning label)

| Label | When |
|-------|------|
| **Workbook (partial)** | R1–R4 Present but R5 or R6 only Partial ([38C-1 §5.3](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)) |
| **Pipeline (partial)** | V2 Pass but V3/V4 not yet run |
| **Comparator partial** | EV-03 pattern — multi-genre GAM, not full PASS |

---

## 7. Validation matrix

| Rule | V1 DLA | V2 GAM | V3 Page | V4 Render | Sev |
|------|:------:|:------:|:-------:|:---------:|:---:|
| V-01 | ○ | **●** | ○ | ○ | M |
| V-02 | ○ | **●** | ● | ● | **C** |
| V-03 | ○ | **●** | **●** | **●** | **C** |
| V-04 | ○ | **●** | **●** | ○ | M |
| V-05 | **●** | **●** | ● | ○ | M |
| V-06 | **●** | **●** | **●** | ○ | M |
| V-07 | **●** | **●** | **●** | ○ | M |
| V-08 | **●** | ○ | ● | ○ | M |
| V-09 | **●** | ○ | ○ | ○ | M |
| V-10 | ○ | ○ | **●** | ○ | **C** |
| V-11 | ○ | ○ | ○ | **●** | m |
| V-12 | ○ | **●** | ○ | ○ | M |
| V-13 | ○ | **●** | **●** | **●** | — |

**Legend:** **●** = primary evaluation layer · ○ = derived or confirmatory

**Derivation:** V2 Fail → V3 cannot Pass affected functions. V3 Pass + V4 Fail → **render visibility gap** (record separately).

---

## 8. Calibration

### 8.1 EV-01 (`NEG-EV-01`)

| Layer | Verdict | Reasons |
|-------|---------|---------|
| **V1** | **FAIL** | V-08 (125 min); V-09 (inferred 12 Mandatory fails) |
| **V2** | **FAIL** | **V-02** (AP-01); V-01 fail; V-03–V-07 fail; V-12 fail |
| **V3** | **FAIL** | **V-10**: R1 Partial→Fail bar; R3 Partial; R4 Absent; R5 Absent; genre FAIL |
| **V4** | **FAIL** | **V-11**: E2, E5, E9, E13, E14, E15, E16, E17 = N ([38C-5 §9](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-5-workbook-experience-rendering.md)) |
| **V13** | **PASS** | Tables preserved — **orthogonal** |
| **Overall** | **FAIL** | Expected; matches [38C-2](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-2-workbook-gap-analysis.md) |

### 8.2 EV-03-G

| Layer | Verdict | Reasons |
|-------|---------|---------|
| **V1** | **Unknown/Partial** | DLA not committed |
| **V2** | **Partial** | **V-02 Pass**; **V-01 Pass**; V-05 Pass; retrieval Pass; **V-03 Fail** (no consolidation_summary); **V-04 Fail**; V-06 Pass |
| **V3** | **FAIL** | **V-10**: R4 likely Absent; R5 Absent; R1 Partial |
| **V4** | **Partial** | Better than EV-01; consolidation/exposition likely N |
| **V13** | **PASS** (typical) | Tables OK |
| **Overall** | **Partial** | Richer than EV-01; **not** `CW-REF-38D3` |

### 8.3 CW-REF-38D3 (canonical)

| Layer | Verdict | Reasons |
|-------|---------|---------|
| **V1** | **PASS** | [dla-outline](../fixtures/canonical-workbook-dla-outline.md) satisfies V-08, V-09 |
| **V2** | **PASS** | [gam-expectations](../fixtures/canonical-workbook-gam-expectations.md) satisfies V-01–V-07, V-12 |
| **V3** | **PASS** (by design) | R1–R7 met when bodies composed per fixture |
| **V4** | **PASS** (by design) | E1–E17 forecast Y on full compose+render |
| **V13** | **PASS** (when tables used) | Compatible with valid pipe tables |
| **Overall** | **PASS** | Authoritative benchmark |

---

## 9. Reviewer workflow

### Step 0 — Scope

1. Confirm **workbook intent** (`self_study_workbook`, learner profile).  
2. If workshop-only → **N/A** this model.

### Step 1 — V1 DLA

1. Load DLA JSON or infer from downstream.  
2. Run [38D-1 §8](38D-1-dla-workbook-contract.md).  
3. Score **V-08**, **V-09**.  
4. If V-09 **Fail** → record upstream blocker; continue to V2 for diagnosis.

### Step 2 — V2 GAM

1. Build `Material: (type)` inventory per activity.  
2. If **V-02 Fail** → **STOP workbook FAIL** (AP-01).  
3. Score **V-01, V-03–V-07, V-12**.  
4. Compare to [manifest](../fixtures/canonical-workbook-reference-manifest.md) and **NEG-EV-01**.

### Step 3 — V13 (parallel)

1. Run 38-B B4 / preserve check on GAM→page tables.  
2. Record **Preservation: PASS/FAIL** — **do not** override V2.

### Step 4 — V3 Page

1. Load composed page JSON.  
2. Score [38C-1 §6](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) functions.  
3. Apply **V-10** (R1–R7).  
4. Classify genre per [38C-1 §2](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md).

### Step 5 — V4 Render (when available)

1. Load HTML export.  
2. Run [38C-5 §9](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-5-workbook-experience-rendering.md) E1–E17.  
3. Apply **V-11**.  
4. Note JSON-only fields not visible.

### Step 6 — Verdict

1. Apply §6.3 gates G1–G6.  
2. Emit **Workbook: PASS / FAIL / Partial** + **Preservation: PASS/FAIL**.  
3. Attach scorecard (§11 template for 38D-5).

---

## 10. Future automation opportunities

*Observation only — no design.*

| Rule | Machine-checkable signal (future) | Difficulty |
|------|-----------------------------------|------------|
| V-02 | Regex `Material: * (_table)` only set | Low |
| V-01 | Count distinct type suffixes | Low |
| V-12 | Set equality vs EV-01 four types | Low |
| V-06 | Count table Materials on last activity | Medium |
| V-07 | Parse pipe cells in rating column | Medium |
| V-03 | Word count on consolidation block | Medium |
| V-04 | Detect numbered steps in sample_output | Medium |
| V-08 | Sum `duration_minutes` in JSON | Low |
| V-09 | Schema validate against DLA-WB checklist | High |
| V-10 | Function rubric needs NLP / heuristics | High |
| V-11 | HTML structure + text length probes | High |
| V-13 | Existing B4 probe pattern | Low (exists) |

**Recommended automation order (planning):** V-02 → V-01 → V-12 → V-06 → V-08 → V-13 (parallel report).

---

## 11. Output for 38D-5

### 11.1 Before/after comparison structure

| Column | Before (EV-01) | After (run TBD) |
|--------|----------------|-----------------|
| Run ID | `NEG-EV-01` | |
| Date | 2026-06-04 | |
| V1 verdict | FAIL | |
| V2 verdict | FAIL | |
| V3 verdict | FAIL | |
| V4 verdict | FAIL | |
| V13 preservation | PASS | |
| Workbook overall | FAIL | |
| Type families | 1 | |
| Critical failures | AF-01 … AF-07 | |
| Δ vs canonical | Gap list | |

### 11.2 Workbook scorecard (template)

```text
Resource: _______________  Run: _______________  Reviewer: _______________

| Rule | Pass | Fail | N/A | Layer |
|------|------|------|-----|-------|
| V-01 |      |      |     | GAM   |
| …    |      |      |     |       |

V1 DLA: PASS / FAIL    V2 GAM: PASS / FAIL / PARTIAL
V3 Page: PASS / FAIL   V4 Render: PASS / FAIL / INCOMPLETE
Preservation V13: PASS / FAIL
WORKBOOK OVERALL: PASS / FAIL / PARTIAL

38C-1: R1__ R2__ R3__ R4__ R5__ R6__ R7__  Genre: _______________
```

### 11.3 Success indicators (post-contract run)

| Indicator | Target |
|-----------|--------|
| V-02 | **Pass** |
| V-01 | **Pass** (≥4 families) |
| V-03, V-04 | **Pass** |
| V-10 | **Pass** (R1–R7) |
| V-12 | **Pass** |
| V-13 | **Pass** (no regression) |
| vs EV-01 | Strict improvement on all Critical rules |

---

## 12. Completion statement

| Criterion | Met? |
|-----------|------|
| Clear validation model (4 layers) | §4 |
| Distinct from preservation | §3 · V-13 |
| V-01 … V-13 formalised | §5 |
| PASS/FAIL threshold | §6 |
| Matrix | §7 |
| EV-01 FAIL · EV-03 Partial · CW-REF PASS | §8 |
| Reviewer workflow | §9 |
| No implementation | §10 observation only |
| 38D-5 handoff | §11 |
| Slice 38D-4 | **COMPLETE** |

**Reviewer check:** Score EV-01 GAM → **V-02 Fail** → workbook **FAIL** without opening HTML. Score `CW-REF-38D3` spec → all Critical/Major **Pass** at V1–V2 by design.

**Next:** [38D-5 Inflation before/after evaluation](38D-5-inflation-before-after-evaluation.md) **COMPLETE**.
