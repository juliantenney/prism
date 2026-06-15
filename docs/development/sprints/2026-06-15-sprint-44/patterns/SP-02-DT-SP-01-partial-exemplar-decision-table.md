# SP-02 / DT-SP-01

## Pattern Metadata

| Field | Value |
| ----- | ----- |
| **Pattern ID** | SP-02 / DT-SP-01 |
| **Pattern Name** | Partial-exemplar decision table |
| **Material Type** | `decision_table` |
| **Contract Anchor** | 44-2 §5.6 `decision_table` |
| **Status** | Draft 1 |

---

## Intent

Provide a guided judgement grid in which **one partially completed row models how to gather and organise evidence**, while **learner-owned judgement cells remain empty** for the learner to complete on remaining rows.

---

## Instructional Problem

In evaluate- and compare-shaped activities, learners must organise evidence and reach a judgement in tabular form. An empty grid alone does not show the move — the learner sees where to write but not how to populate evidence or reasoning cells before judging.

Evaluation evidence shows this gap clearly:

- **Photosynthesis M12** and **M19** supply usable grids with adequate rows and empty learner cells but **no modelled row**. All three evaluation passes scored both **Minimum** — the table performs the threshold function (structure, row count, empty judgement cells) but not strong guided judgement.
- **Marx M13** supplies **one row** with evidence-for and evidence-against cells populated on the first criterion, with the **Judgement column empty on every row**. All three evaluation passes scored this **Strong**.

The instructional problem SP-02 solves is **FM-04**: decision-table shells that leave the learner with structure but no demonstrated judgement move.

---

## Minimum Realisation Shape

Abstract minimum structure evidenced by Photosynthesis M12 and M19 (both scored Minimum, not Failed):

1. **Proper tabular structure** — pipe-markdown table with column headers and multiple data rows.
2. **Row count adequate for the learner task** — not a single blank row when the task requires multiple comparisons or factors.
   - M12: two claim rows for two student statements.
   - M19: three factor rows for capstone scenario analysis.
3. **Learner judgement / decision cells empty** — columns where the learner decides (Correct/Incorrect, Impact, Judgement) are left for learner completion; no pre-supplied ratings or rank ordinals.
4. **Column headers name the reasoning move** — e.g. Claim / Correct/Incorrect / Reason; Factor / Impact / Evidence.

Minimum does **not** require a partial exemplar row. Both contrast exemplars met minimum without one.

---

## Strong Realisation Shape

Abstract strong structure evidenced by Marx M13 (scored Strong in Pass 2 and Inter-Rater Validation):

1. **One partial exemplar row** on the first criterion or item — demonstrates the tabular move without completing the grid.
2. **Evidence-gathering cells populated on the exemplar row only** — on M13, the exemplar row fills *Evidence for* and *Evidence against* with brief, task-appropriate content; remaining rows leave those cells empty for the learner.
3. **Learner judgement column empty on all rows** — including the exemplar row. The model shows how to gather evidence; the learner still owns the judgement cell.
4. **Remaining rows fully empty in learner-completion columns** — predictive accuracy and contemporary relevance rows on M13 are blank across evidence and judgement columns, preserving learner agency for the rest of the grid.
5. **Criteria columns aligned to adjacent criteria exposition** — M13 rows match the three criteria named in adjacent Marx M12 (`text`). Evaluation cited this as criteria linkage (Pass 2: "aligned to M12 criteria exposition").
6. **Column labels that prompt reasoning** — *Evidence for*, *Evidence against*, *Judgement* rather than category labels only.

**Why this is stronger than minimum:** The learner can identify which cells are **modelled** vs **learner-owned** (44-2 §5.6 validation signal). The partial row makes the evidence-before-judgement sequence visible. An empty-only grid (M12, M19) meets threshold but does not demonstrate the move — reviewers in all passes distinguished Strong from Minimum on this feature alone.

**Not evidenced as required for Strong in this pattern entry:**

- A separate justification column (M13 uses a Judgement column; M12 uses Reason — pattern does not mandate one column layout).
- Partial exemplar on every row.
- In-table criteria prose (criteria linkage evidenced via adjacent material, not inside the table body).

---

## Failure Modes Avoided

| FM ID | Name | How SP-02 avoids it |
| ----- | ---- | ------------------- |
| **FM-04** | Decision-table shell without partial exemplar | Requires one modelled row with populated evidence/reasoning cells on that row only; judgement cells remain empty |

SP-02 does **not** address capture artefacts (stub emission, page-composition loss) or failure modes outside `decision_table` scope.

---

## Detection Signals

### Minimum

Reviewer can confirm:

- [ ] Usable table structure with headers and ≥2 data rows matching task scope.
- [ ] Learner decision/judgement columns are empty (no pre-filled ratings or rankings).
- [ ] Row count matches learner_task requirement.
- [ ] **No** partial exemplar row — all learner-completion cells blank (M12, M19 pattern).

### Strong

Reviewer can confirm all minimum signals **plus**:

- [ ] Exactly one (or clearly distinguished) partial exemplar row with evidence/reasoning cells populated.
- [ ] Judgement/decision column empty on **all** rows including the exemplar row.
- [ ] Reviewer can state which row is modelled and which cells are learner-owned without inferring from elsewhere.
- [ ] Row labels align with criteria or items named in adjacent exposition or rubric material (M13 ↔ M12 linkage).

### Weak (below minimum or active failure)

- Table shell with headers but no exemplar content **and** inadequate rows for task → may still be Minimum if row count suffices; **Failed** only if structure is unusable (§5.6 pseudo-table, single row when many required) — not evidenced on M12/M19.
- Pre-filled judgement ratings or rank ordinals in learner columns → §5.6 failure mode (not present in benchmark contrast set).
- Entire grid pre-completed → reference dump failure mode (not present in benchmark set).
- DLA specifies partial exemplar but GAM body has none → obligation gap noted on M12; body still scored Minimum, not Failed, in all passes.

---

## Benchmark Evidence

### Strong Exemplar

| Field | Value |
| ----- | ----- |
| **Material** | Marx M13 (Activity A4 — *Was Marx Right? Final Evaluation*) |
| **Corpus** | `benchmark-corpus/marx/activity-materials.txt` |
| **DLA obligation** | Decision table with one partial exemplar row across three evaluation criteria |

**Why it was judged Strong (all passes):**

Pass 2 and Inter-Rater Validation cited:

- Partial exemplar row on *Explanatory power* with brief evidence for (`Explains inequality trends`) and evidence against (`Does not explain all social change`).
- *Judgement* column empty on all three rows.
- *Predictive accuracy* and *Contemporary relevance* rows empty for learner completion.
- Alignment to criteria named in adjacent M12.

Direct corpus evidence:

```text
| Criterion              | Evidence for Marx          | Evidence against Marx              | Judgement |
| Explanatory power      | Explains inequality trends | Does not explain all social change |           |
| Predictive accuracy    |                            |                                    |           |
| Contemporary relevance |                            |                                    |           |
```

---

### Contrast Exemplars

#### Photosynthesis M12

| Field | Value |
| ----- | ----- |
| **Material** | Photosynthesis M12 (Activity A4 — *Evaluating Misconceptions*) |
| **Corpus** | `benchmark-corpus/photosynthesis/learning-materials.txt` |
| **Verdict** | Minimum (Pass 2, Inter-Rater Validation) |

**Why it was judged Minimum:**

- Proper grid with two claim rows and empty learner cells — meets §5.6 minimum.
- **No partial exemplar row** despite DLA specifying `includes one model row`.
- Reviewer cannot identify a modelled judgement move — only empty cells (FM-04).
- Strong bar not met: no demonstrated correct/incorrect + reason pattern on any row.

Direct corpus evidence:

```text
| Claim     | Correct/Incorrect | Reason |
| Student A |                   |        |
| Student B |                   |        |
```

---

#### Photosynthesis M19

| Field | Value |
| ----- | ----- |
| **Material** | Photosynthesis M19 (Activity A6 — capstone) |
| **Corpus** | `benchmark-corpus/photosynthesis/learning-materials.txt` |
| **Verdict** | Minimum (Pass 2, Inter-Rater Validation) |

**Why it was judged Minimum:**

- Three-row grid (*Carbon cycle*, *Oxygen levels*, *Food webs*) with empty Impact and Evidence columns — adequate row count for capstone table task.
- **No partial exemplar row**; no in-table criteria linkage.
- All learner-completion cells empty with no reference row modelling how to populate Impact/Evidence from scenarios (M18).
- Strong bar not met per §5.6 partial-exemplar criterion.

Direct corpus evidence:

```text
| Factor        | Impact | Evidence |
| Carbon cycle  |        |          |
| Oxygen levels |        |          |
| Food webs     |        |          |
```

---

## Authoring Guidance

Evidence-backed guidance only. Each item maps to benchmark evaluation findings.

1. **Include one partial exemplar row** when the activity is evaluate- or compare-shaped and DLA specifies guided practice with a decision table. M13 Strong vs M12/M19 Minimum is the primary evidence for this requirement in evaluate arcs.

2. **Populate evidence or reasoning cells on the exemplar row only** — model gathering evidence before judgement. On the exemplar row, fill cells that show *how to find and state evidence*; do not fill the learner's judgement/decision column.

3. **Leave the judgement/decision column empty on every row** including the exemplar row. M13 kept *Judgement* blank on the partially filled row — evaluation treated this as learner agency preservation, not incompleteness.

4. **Match row labels to criteria or items from the task** — M13 rows mirror M12 criteria names. Authors should ensure row labels correspond to exposition, scenarios, or rubric dimensions already named in adjacent materials.

5. **Provide enough rows for the learner_task** — M12 (two claims) and M19 (three factors) met minimum row-count expectations. Single-row grids when multiple responses are required were not evidenced in this pattern set but remain a §5.6 failure mode.

6. **Do not pre-fill effectiveness ratings, rank order, or final judgements** in learner columns. No benchmark exemplar violated this; it remains a §5.6 contract guard.

7. **When DLA specifies a model row, the GAM body must contain it** — M12 showed an obligation gap (DLA required model row; body had none). Body still scored Minimum, but the gap was recorded as FM-04. Authors should treat DLA partial-exemplar obligations as pattern requirements.

---

## Reviewer Guidance

Evaluate a `decision_table` body against 44-2 §5.6 using this sequence:

1. **Structure** — Confirm proper tabular format, headers present, row count adequate for stated learner_task.
2. **Learner agency** — Confirm judgement/rating/decision columns are empty where the learner decides. Flag pre-filled ratings as Failed per §5.6.
3. **Minimum threshold** — If structure and empty learner judgement cells are met, classify at least **Minimum** (M12, M19 precedent).
4. **Strong threshold** — Look for one partial exemplar row with populated evidence/reasoning cells and empty judgement cells on that row. Confirm reviewer can distinguish modelled vs learner-owned cells without reading adjacent materials.
5. **Criteria linkage** — Check whether row labels align with criteria or items in adjacent `text`, `rubric`, or scenario materials (Strong signal on M13).
6. **DLA cross-check** — If DLA specifies partial exemplar and body has none, record FM-04 even if Minimum threshold is met.

Do not score page-composition fidelity in the same pass as body quality (44-3 Conventions — Body vs composition rule).

---

## Boundary Notes

**Inter-rater agreement on this pattern's benchmark set: high.**

| Material | Pass 2 | Inter-Rater Validation |
| -------- | ------ | ---------------------- |
| Marx M13 | Strong | Strong |
| Photosynthesis M12 | Minimum | Minimum |
| Photosynthesis M19 | Minimum | Minimum |

No verdict split on these three materials. Boundary variance observed elsewhere in Sprint 44 evaluation (e.g. checklist Strong vs Minimum) does **not** apply to SP-02 evidence.

**Documented ambiguity (evaluation-method, not pattern defect):**

- **Minimum without exemplar vs Failed** — M12 lacked the DLA-specified model row but was scored Minimum, not Failed, in all passes. Reviewers applied §5.6 body threshold (structure + empty learner cells) as sufficient for Minimum. FM-04 describes the weakness; Failed was reserved for non-functional bodies (e.g. checklist stubs).
- **Strong signals not exercised in contrast set** — §5.6 also names justification columns paired with ratings and reference rows clearly distinguished from learner rows. Neither signal was required to discriminate M13 from M12/M19 in evaluation. Do not add these as SP-02 requirements without new evidence.

---

## Traceability

| Link | Reference |
| ---- | --------- |
| **Contract** | 44-2 §5.6 `decision_table` — minimum realisation, strong realisation (partial exemplar row), failure modes (table shell), validation signals |
| **Benchmark materials** | Marx M13 (strong); Photosynthesis M12, M19 (contrast); Marx M12 (adjacent criteria linkage) |
| **Evaluation reports** | Sprint 44-2 Evaluation Pass 2 (Decision/Judgement Materials — Marx M13, Photosynthesis M12/M19); Sprint 44 Inter-Rater Validation (Decision/Judgement Structures); Sprint 44-3 Readiness Assessment (SP-02 registry, FM-04, authoring priority) |
| **Failure mode** | FM-04 — Secondary Index, `sprint-44-3-instructional-pattern-library.md` |
| **Architecture slot** | DT-SP-01 — Primary Index: Decision Table |
