# 45-1 Evidence Workbook

**Experiment:** 45-1 Pattern Injection Experiment  
**Status:** Complete — all six pairs evaluated  
**Authority:** [45-1-pattern-injection-experiment-design.md](45-1-pattern-injection-experiment-design.md) · [45-1-experiment-execution-plan.md](45-1-experiment-execution-plan.md)  
**Evaluator:** Sprint 45 evidence collection (session)  
**Collection period:** 2026-06-18  
**Evaluation date:** 2026-06-18 (DT-MRX-A4, TP-MRX-A4, DT-PS-A4, TP-PS-A4, DT-PS-A6, TP-PS-A6)

---

## Workbook Instructions

- Populate during evidence collection and evaluation per execution plan.
- Score GAM **body text** only. Record FM-01 / FM-12 under capture channel; do not conflate with instructional FMs.
- Verdict justification must cite 44-2 contract bullets (§5.6 or §5.8), not pattern names alone.
- Detection Signals are secondary to contract verdict.
- Do not complete Pair Outcome until both baseline and treatment evidence sections are filled.

**Artefact register**

| Artefact ID | Pair | Condition | Populated |
| ----------- | ---- | --------- | --------- |
| BL-DT-MRX-A4 | DT-MRX-A4 | Baseline | [x] |
| TR-DT-MRX-A4 | DT-MRX-A4 | Treatment | [x] |
| BL-DT-PS-A4 | DT-PS-A4 | Baseline | [x] |
| TR-DT-PS-A4 | DT-PS-A4 | Treatment | [x] |
| BL-DT-PS-A6 | DT-PS-A6 | Baseline | [x] |
| TR-DT-PS-A6 | DT-PS-A6 | Treatment | [x] |
| BL-TP-MRX-A4 | TP-MRX-A4 | Baseline | [x] |
| TR-TP-MRX-A4 | TP-MRX-A4 | Treatment | [x] |
| BL-TP-PS-A4 | TP-PS-A4 | Baseline | [x] |
| TR-TP-PS-A4 | TP-PS-A4 | Treatment | [x] |
| BL-TP-PS-A6 | TP-PS-A6 | Baseline | [x] |
| TR-TP-PS-A6 | TP-PS-A6 | Treatment | [x] |

---

# DT-MRX-A4

## Pair Metadata

| Field | Value |
| ----- | ----- |
| **Pair ID** | DT-MRX-A4 |
| **Domain** | Marx (`marx-capitalism-v1`) |
| **Activity** | A4 — *Was Marx Right? Final Evaluation* |
| **Material type** | `decision_table` |
| **Pattern (treatment)** | SP-02 / DT-SP-01 |
| **Contract section** | 44-2 §5.6 |
| **Frozen reference** | M13 — Strong (Pass 2, Inter-Rater) |
| **Target FM** | FM-04 |
| **Comparison objective** | Maintain Strong realisation; confirm FM-04 absent; detect Marx overfitting or mimicry of M13 |
| **Baseline artefact ID** | BL-DT-MRX-A4 |
| **Treatment artefact ID** | TR-DT-MRX-A4 |
| **DLA obligation ref** | `benchmark-corpus/marx/design-learning-activities.json` → A4 → `required_materials` [M13] |
| **Frozen corpus verdict** | Strong |

**DLA obligation snapshot**

```text
material_id: M13
type: decision_table
purpose: guided_practice
specification: |
  | Criterion | Evidence for Marx | Evidence against Marx | Judgement |
  | --- | --- | --- | --- |
  | Explanatory power | partial example |  |  |
  | Predictive accuracy |  |  |  |
  | Contemporary relevance |  |  |  |
  Includes one partial exemplar; depth_floor: L3
```

**Collection provenance (baseline):** Body sourced from frozen benchmark corpus `benchmark-corpus/marx/activity-materials.txt` (M13). Represents pre-pattern generation capture under Sprint 44 freeze; scored independently for 45-1 per execution plan. Artefact file: [`45-1-evidence/artefacts/BL-DT-MRX-A4.txt`](45-1-evidence/artefacts/BL-DT-MRX-A4.txt).

**Collection provenance (treatment):** Body collected under SP-02 / DT-SP-01 pattern-guided condition on identical A4 obligation. Artefact file: [`45-1-evidence/artefacts/TR-DT-MRX-A4.txt`](45-1-evidence/artefacts/TR-DT-MRX-A4.txt).

---

## Baseline Evidence

**Artefact ID:** BL-DT-MRX-A4  
**Collection date:** 2026-06-18  
**Condition:** Pre-pattern / non-injected generation (historical corpus capture)

**Body text**

```text
| Criterion              | Evidence for Marx          | Evidence against Marx              | Judgement |
| ---------------------- | -------------------------- | ---------------------------------- | --------- |
| Explanatory power      | Explains inequality trends | Does not explain all social change |           |
| Predictive accuracy    |                            |                                    |           |
| Contemporary relevance |                            |                                    |           |
```

**Capture channel**

| FM | Present? |
| -- | -------- |
| FM-01 (stub) | [x] absent  [ ] present |
| FM-12 (page-composition) | [x] absent  [ ] present  [ ] not assessed |

### Contract Verdict

| Field | Value |
| ----- | ----- |
| **Verdict** | [ ] Failed  [ ] Minimum  [x] Strong |
| **Justification** | The body provides a proper pipe-markdown table with three criterion rows adequate for the A4 evaluate task, and all Judgement cells are empty (§5.6 minimum: tabular structure, row count, empty learner-decision cells). Strong bar is met: the *Explanatory power* row is a partial exemplar with brief evidence-for and evidence-against content while the Judgement column remains empty on every row (§5.6 strong: partial exemplar row demonstrating the move without completing the grid). Row labels match the three criteria named in adjacent M12 exposition (§5.6 strong: linked to criteria in adjacent materials). No pre-filled ratings or rank ordinals appear in learner columns. |

### Contract Observations

**Minimum realisation (§5.6)**

- [x] Proper tabular structure with headers and multiple rows
- [x] Enough rows for learner_task
- [x] Learner judgement/rating/response cells empty where learner decides
- [ ] Table adjunct prose if needed — not required; table is self-explanatory with M12 adjacent

**Strong realisation (§5.6)**

- [x] Partial exemplar row demonstrating judgement move
- [x] Column labels prompt reasoning (*Evidence for*, *Evidence against*, *Judgement*)
- [ ] Justification column or prompt paired with rating/ranking cells — Judgement column present but no separate justification column; not required for Strong on M13 precedent
- [x] Reference rows distinguished from learner-completion rows — exemplar row modelled; two rows fully empty
- [x] Linked to criteria or rubric in adjacent materials — rows mirror M12 criteria names
- [x] Row order does not function as answer key

**Failure modes observed (§5.6)**

- [ ] Table shell without exemplar content
- [ ] Pre-filled effectiveness ratings or rank order
- [ ] Single blank row when multiple comparisons required
- [ ] Reference dump — entire grid pre-completed
- [ ] Comma-separated pseudo-table

**Notes:** Independent 45-1 score aligns with Sprint 44 Pass 2 and Inter-Rater Validation (M13 unanimous Strong). Minimum threshold would apply even without exemplar row; strong discriminators are partial exemplar plus criteria linkage.

### Detection Signals

**Pattern:** SP-02 — secondary evidence

**Minimum signals**

- [x] Usable table structure; headers; ≥2 data rows matching task scope
- [x] Learner decision/judgement columns empty
- [x] Row count matches learner_task requirement (three criteria)
- [ ] No partial exemplar row — all learner-completion cells blank — **not met** (exemplar row present)

**Strong signals**

- [x] Exactly one (or clearly distinguished) partial exemplar row with evidence/reasoning cells populated
- [x] Judgement/decision column empty on all rows including exemplar row
- [x] Reviewer can state which row is modelled and which cells are learner-owned — *Explanatory power* row modelled; *Predictive accuracy* and *Contemporary relevance* rows learner-owned
- [x] Row labels align with criteria or items in adjacent exposition or rubric — M12 *Criteria for Evaluating Marx*

**Signal profile:** [ ] Minimum  [x] Strong  [ ] Weak  [ ] Failed  
**Superficial match flag:** [x] n/a  [ ] yes

### Failure Modes

| FM | Present? | Notes |
| -- | -------- | ----- |
| FM-04 (table shell without partial exemplar) | [x] absent  [ ] present | Partial exemplar row on first criterion |
| DLA partial-exemplar cross-check | [x] met  [ ] gap recorded | Body realises DLA partial-exemplar obligation |

### Ownership Audit

| Check | Result |
| ----- | ------ |
| Learner judgement cells empty | [x] pass  [ ] fail  [ ] n/a |
| No pre-filled ratings or rank ordinals | [x] pass  [ ] fail  [ ] n/a |
| Exemplar row judgement column empty | [x] pass  [ ] fail  [ ] n/a |
| **Overall** | [x] pass  [ ] fail |

**Notes:** Evidence and reasoning cells on the exemplar row are modelled scaffolding; Judgement column is empty on all rows including the exemplar row (M13 precedent). Learner owns all judgement cells and completion of remaining evidence cells on unmodelled rows.

### Corpus Comparison

| Field | Value |
| ----- | ----- |
| **Frozen reference** | M13 (`benchmark-corpus/marx/activity-materials.txt`) |
| **Strong-reference proximity** | [ ] closer  [x] same  [ ] farther  [ ] n/a |
| **Weak-reference distance** | [x] avoids weak shape  [ ] partial  [ ] no |
| **Mimicry suspect** | [ ] yes  [x] no |
| **Summary** | Baseline body is byte-identical to frozen M13 Strong reference. Independent 45-1 verdict matches historical Sprint 44 scoring. Body is domain-appropriate Marx evaluate content; no cross-domain transplant. |

---

## Treatment Evidence

**Artefact ID:** TR-DT-MRX-A4  
**Collection date:** 2026-06-18  
**Condition:** Pattern-guided generation (SP-02 / DT-SP-01)

**Collection provenance:** GAM material body collected under treatment condition — SP-02 / DT-SP-01 pattern specification informed generation intent for Marx A4 `decision_table` obligation M13. Identical DLA obligation and frozen upstream artefact chain as baseline. Artefact file: [`45-1-evidence/artefacts/TR-DT-MRX-A4.txt`](45-1-evidence/artefacts/TR-DT-MRX-A4.txt).

**Body text**

```text
| Criterion              | Evidence for Marx                                      | Evidence against Marx                                   | Judgement |
| ---------------------- | ------------------------------------------------------ | ------------------------------------------------------- | --------- |
| Explanatory power      | Accounts for class-based inequality in market societies | Struggles to explain ideological or non-class-based change |           |
| Predictive accuracy    |                                                        |                                                         |           |
| Contemporary relevance |                                                        |                                                         |           |
```

**Capture channel**

| FM | Present? |
| -- | -------- |
| FM-01 (stub) | [x] absent  [ ] present |
| FM-12 (page-composition) | [x] absent  [ ] present  [ ] not assessed |

### Contract Verdict

| Field | Value |
| ----- | ----- |
| **Verdict** | [ ] Failed  [ ] Minimum  [x] Strong |
| **Justification** | The body meets §5.6 minimum: proper pipe-markdown table, three criterion rows for the A4 evaluate task, and empty Judgement cells throughout. Strong bar is met: the *Explanatory power* row is a partial exemplar with brief evidence-for and evidence-against content modelling the evidence-gathering move; the Judgement column is empty on all rows including the exemplar row (§5.6 strong: partial exemplar without completing learner judgement). Row labels align with the three criteria in adjacent M12 exposition (§5.6 strong: criteria linkage). No pre-filled ratings or rank ordinals appear in learner columns. |

### Contract Observations

**Minimum realisation (§5.6)**

- [x] Proper tabular structure with headers and multiple rows
- [x] Enough rows for learner_task
- [x] Learner judgement/rating/response cells empty where learner decides
- [ ] Table adjunct prose if needed — not required with M12 adjacent

**Strong realisation (§5.6)**

- [x] Partial exemplar row demonstrating judgement move
- [x] Column labels prompt reasoning (*Evidence for*, *Evidence against*, *Judgement*)
- [ ] Justification column or prompt paired with rating/ranking cells — not required on M13 precedent
- [x] Reference rows distinguished from learner-completion rows
- [x] Linked to criteria or rubric in adjacent materials — M12 criteria names
- [x] Row order does not function as answer key

**Failure modes observed (§5.6)**

- [ ] Table shell without exemplar content
- [ ] Pre-filled effectiveness ratings or rank order
- [ ] Single blank row when multiple comparisons required
- [ ] Reference dump — entire grid pre-completed
- [ ] Comma-separated pseudo-table

**Notes:** Treatment realises DLA partial-exemplar obligation. Contract profile matches baseline Strong shape; lexical content on exemplar row differs from frozen M13 (anti-mimicry check below).

### Detection Signals

**Pattern:** SP-02 — secondary evidence

**Minimum signals**

- [x] Usable table structure; headers; ≥2 data rows matching task scope
- [x] Learner decision/judgement columns empty
- [x] Row count matches learner_task requirement (three criteria)
- [ ] No partial exemplar row — **not met** (exemplar row present)

**Strong signals**

- [x] Exactly one partial exemplar row with evidence/reasoning cells populated
- [x] Judgement/decision column empty on all rows including exemplar row
- [x] Reviewer can state which row is modelled and which cells are learner-owned — *Explanatory power* modelled; *Predictive accuracy* and *Contemporary relevance* learner-owned
- [x] Row labels align with criteria or items in adjacent exposition or rubric — M12

**Signal profile:** [ ] Minimum  [x] Strong  [ ] Weak  [ ] Failed  
**Superficial match flag:** [ ] yes  [x] no — Strong verdict supported by §5.6; pattern signals corroborate

### Failure Modes

| FM | Present? | Notes |
| -- | -------- | ----- |
| FM-04 (table shell without partial exemplar) | [x] absent  [ ] present | Partial exemplar on first criterion |
| DLA partial-exemplar cross-check | [x] met  [ ] gap recorded | SP-02 obligation realised |

### Ownership Audit

| Check | Result |
| ----- | ------ |
| Learner judgement cells empty | [x] pass  [ ] fail  [ ] n/a |
| No pre-filled ratings or rank ordinals | [x] pass  [ ] fail  [ ] n/a |
| Exemplar row judgement column empty | [x] pass  [ ] fail  [ ] n/a |
| **Overall** | [x] pass  [ ] fail |
| **Ownership regression** | [ ] yes  [x] no |

**Notes:** Exemplar row populates evidence cells only; Judgement column empty on all rows. No increase in pre-filled learner loci relative to baseline. MP-1 preserved.

### Corpus Comparison

| Field | Value |
| ----- | ----- |
| **Frozen reference** | M13 (`benchmark-corpus/marx/activity-materials.txt`) |
| **Strong-reference proximity** | [ ] closer  [x] same  [ ] farther  [ ] n/a |
| **Weak-reference distance** | [x] avoids weak shape  [ ] partial  [ ] no |
| **Mimicry suspect** | [ ] yes  [x] no |
| **Summary** | Treatment exhibits the same Strong feature set as M13 (partial exemplar row, empty judgement column, three criteria rows, criteria linkage) but is not a verbatim copy. Exemplar evidence cells use different Marx-domain phrasing (*class-based inequality in market societies* vs M13 *inequality trends*). Instructional function matches SP-02/M13 Strong shape; lexical transplant of M13 text not observed. |

---

## Pair Outcome

| Field | Value |
| ----- | ----- |
| **Baseline verdict** | Strong |
| **Treatment verdict** | Strong |
| **Paired delta** | Strong → Strong |
| **FM delta** | FM-04: unchanged (absent in both) |

**Classification**

- [ ] Improvement
- [x] No Change
- [ ] Regression
- [ ] Inconclusive

**Justification:** Treatment maintains Strong verdict with FM-04 absent and ownership pass. Baseline was already Strong on the same obligation; paired delta shows no verdict rise (execution plan § Result Classification: Strong → Strong on Marx hold = **no_change**). FM-04 was absent in baseline and remains absent — no FM clearance event. Ownership regression not observed. Per-output success for treatment is met: Strong maintained, target FM absent, ownership preserved, SP-02 Strong signals present (secondary). Anti-mimicry review: treatment is domain-appropriate Marx content with Strong instructional features, not verbatim M13 reproduction.

**Per-output success (treatment):** [x] met  [ ] not met

---

## Reviewer Notes

- DT-MRX-A4 pair complete. Baseline = frozen corpus M13 (pre-pattern capture); treatment = SP-02-guided body on identical A4 obligation.
- Primary evidence: both bodies Strong per §5.6. Secondary: SP-02 Strong Detection Signals on both; treatment superficial-match flag = no.
- Pair classified **No Change** — expected for Marx maintain-test slot where corpus was already Strong. Do not generalise to Photosynthesis remediation pairs.
- Treatment collection provenance recorded in `45-1-evidence/artefacts/TR-DT-MRX-A4.txt`. Recommendation report not written (out of scope).

---
---

# DT-PS-A4

## Pair Metadata

| Field | Value |
| ----- | ----- |
| **Pair ID** | DT-PS-A4 |
| **Domain** | Photosynthesis (`photosynthesis-v1`) |
| **Activity** | A4 — *Evaluating Misconceptions* |
| **Material type** | `decision_table` |
| **Pattern (treatment)** | SP-02 / DT-SP-01 |
| **Contract section** | 44-2 §5.6 |
| **Frozen reference** | M12 — Minimum; FM-04 recorded |
| **Target FM** | FM-04 |
| **Comparison objective** | Test SP-02 remediation of FM-04 on Photosynthesis evaluate arc; Gate 3 primary pair |
| **Baseline artefact ID** | BL-DT-PS-A4 |
| **Treatment artefact ID** | TR-DT-PS-A4 |
| **DLA obligation ref** | `benchmark-corpus/photosynthesis/design-learning-activities.json` → A4 → `required_materials` [M12] |
| **Frozen corpus verdict** | Minimum |

**DLA obligation snapshot**

```text
material_id: M12
type: decision_table
purpose: guided_practice
specification: | Claim | Correct/Incorrect | Reason | ; includes one model row; depth_floor: L3
```

**Collection provenance (baseline):** Frozen benchmark corpus `benchmark-corpus/photosynthesis/learning-materials.txt` (M12). Pre-pattern capture. Artefact: [`45-1-evidence/artefacts/BL-DT-PS-A4.txt`](45-1-evidence/artefacts/BL-DT-PS-A4.txt).

**Collection provenance (treatment):** SP-02 / DT-SP-01 pattern-guided condition on identical A4 obligation. Artefact: [`45-1-evidence/artefacts/TR-DT-PS-A4.txt`](45-1-evidence/artefacts/TR-DT-PS-A4.txt).

---

## Baseline Evidence

**Artefact ID:** BL-DT-PS-A4  
**Collection date:** 2026-06-18  
**Condition:** Pre-pattern / non-injected generation (historical corpus capture)

**Body text**

```text
| Claim     | Correct/Incorrect | Reason |
| --------- | ----------------- | ------ |
| Student A |                   |        |
| Student B |                   |        |
```

**Capture channel**

| FM | Present? |
| -- | -------- |
| FM-01 (stub) | [x] absent  [ ] present |
| FM-12 (page-composition) | [x] absent  [ ] present  [ ] not assessed |

### Contract Verdict

| Field | Value |
| ----- | ----- |
| **Verdict** | [ ] Failed  [x] Minimum  [ ] Strong |
| **Justification** | The body meets §5.6 minimum: proper pipe-markdown table with headers, two claim rows matching the A4 evaluate task (Student A, Student B from adjacent M11 scenario), and empty *Correct/Incorrect* and *Reason* cells where the learner decides. Strong bar is not met: no partial exemplar row models how to gather evidence or state reasoning before judgement (§5.6 strong: partial exemplar row). DLA specifies a model row; body provides structure only — FM-04 weakness per Sprint 44 M12 precedent. |

### Contract Observations

**Minimum realisation (§5.6)**

- [x] Proper tabular structure with headers and multiple rows
- [x] Enough rows for learner_task (two claims)
- [x] Learner judgement/rating/response cells empty where learner decides
- [ ] Table adjunct prose if needed — scenario in adjacent M11

**Strong realisation (§5.6)**

- [ ] Partial exemplar row demonstrating judgement move
- [x] Column labels prompt reasoning (*Correct/Incorrect*, *Reason*)
- [x] Justification column paired with rating cells (*Reason* column)
- [ ] Reference rows distinguished from learner-completion rows — no modelled row
- [x] Linked to criteria or items in adjacent materials — claims match M11 scenario
- [x] Row order does not function as answer key

**Failure modes observed (§5.6)**

- [x] Table shell without exemplar content — grid only; no modelled move
- [ ] Pre-filled effectiveness ratings or rank order
- [ ] Single blank row when multiple comparisons required
- [ ] Reference dump — entire grid pre-completed
- [ ] Comma-separated pseudo-table

**Notes:** Aligns with Sprint 44 Pass 2 and Inter-Rater: M12 unanimous Minimum. Obligation gap: DLA requires model row; body has none.

### Detection Signals

**Pattern:** SP-02 — secondary evidence

**Minimum signals**

- [x] Usable table structure; headers; ≥2 data rows matching task scope
- [x] Learner decision/judgement columns empty
- [x] Row count matches learner_task requirement
- [x] No partial exemplar row — all learner-completion cells blank (M12 pattern)

**Strong signals**

- [ ] Exactly one partial exemplar row with evidence/reasoning cells populated
- [ ] Judgement/decision column empty on all rows including exemplar row
- [ ] Reviewer can distinguish modelled vs learner-owned cells
- [x] Row labels align with items in adjacent scenario (M11)

**Signal profile:** [x] Minimum  [ ] Strong  [ ] Weak  [ ] Failed  
**Superficial match flag:** [x] n/a  [ ] yes

### Failure Modes

| FM | Present? | Notes |
| -- | -------- | ----- |
| FM-04 (table shell without partial exemplar) | [ ] absent  [x] present | No modelled row despite DLA obligation |
| DLA partial-exemplar cross-check | [ ] met  [x] gap recorded | M12 precedent |

### Ownership Audit

| Check | Result |
| ----- | ------ |
| Learner judgement cells empty | [x] pass  [ ] fail  [ ] n/a |
| No pre-filled ratings or rank ordinals | [x] pass  [ ] fail  [ ] n/a |
| Exemplar row judgement column empty | [x] pass  [ ] fail  [ ] n/a — n/a; no exemplar row |
| **Overall** | [x] pass  [ ] fail |

**Notes:** All cells empty; learner owns all judgements and reasoning. Weakness is absence of modelling, not pre-filled deliverables.

### Corpus Comparison

| Field | Value |
| ----- | ----- |
| **Frozen reference** | M12 (`benchmark-corpus/photosynthesis/learning-materials.txt`) |
| **Strong-reference proximity** | [ ] closer  [ ] same  [x] farther  [ ] n/a |
| **Weak-reference distance** | [ ] avoids weak shape  [ ] partial  [x] no — is weak shape |
| **Mimicry suspect** | [ ] yes  [x] no |
| **Summary** | Baseline is byte-identical to frozen M12. Independent 45-1 verdict matches historical Minimum + FM-04. |

---

## Treatment Evidence

**Artefact ID:** TR-DT-PS-A4  
**Collection date:** 2026-06-18  
**Condition:** Pattern-guided generation (SP-02 / DT-SP-01)

**Collection provenance:** SP-02 pattern specification informed generation intent for Photosynthesis A4 `decision_table` obligation M12.

**Body text**

```text
| Claim     | Correct/Incorrect | Reason |
| --------- | ----------------- | ------ |
| Student A |                   | Misconception: treats soil minerals as the plant's food source; compare the claim to carbon from CO₂ fixed in photosynthesis (see scenario). |
| Student B |                   |        |
```

**Capture channel**

| FM | Present? |
| -- | -------- |
| FM-01 (stub) | [x] absent  [ ] present |
| FM-12 (page-composition) | [x] absent  [ ] present  [ ] not assessed |

### Contract Verdict

| Field | Value |
| ----- | ----- |
| **Verdict** | [ ] Failed  [ ] Minimum  [x] Strong |
| **Justification** | §5.6 minimum met: proper table, two claim rows, learner *Correct/Incorrect* cells empty on all rows. Strong bar met: *Student A* row is a partial exemplar with the *Reason* cell populated to model evidence-gathering and misconception correction without supplying *Correct/Incorrect* judgements (§5.6 strong: partial exemplar demonstrating the move; learner judgement cells remain empty). *Student B* row fully empty for learner completion. Row labels align with M11 scenario claims. No pre-filled ratings. |

### Contract Observations

**Minimum realisation (§5.6)**

- [x] Proper tabular structure with headers and multiple rows
- [x] Enough rows for learner_task
- [x] Learner judgement/rating/response cells empty where learner decides — *Correct/Incorrect* empty on all rows
- [ ] Table adjunct prose — scenario in M11

**Strong realisation (§5.6)**

- [x] Partial exemplar row demonstrating judgement move — Student A *Reason* modelled
- [x] Column labels prompt reasoning
- [x] Justification column paired with rating cells
- [x] Reference rows distinguished from learner-completion rows
- [x] Linked to criteria or items in adjacent materials — M11 claims
- [x] Row order does not function as answer key — Student B not pre-judged

**Failure modes observed (§5.6)**

- [ ] Table shell without exemplar content
- [ ] Pre-filled effectiveness ratings or rank order
- [ ] Single blank row when multiple comparisons required
- [ ] Reference dump
- [ ] Comma-separated pseudo-table

**Notes:** Treatment adds instructional move absent in baseline. *Reason* on exemplar row models reasoning path; learner still owns *Correct/Incorrect* on both rows.

### Detection Signals

**Pattern:** SP-02 — secondary evidence

**Minimum signals**

- [x] Usable table structure; ≥2 data rows
- [x] Learner decision/judgement columns empty — *Correct/Incorrect* empty throughout
- [x] Row count matches learner_task
- [ ] No partial exemplar row — **not met** (exemplar present)

**Strong signals**

- [x] Exactly one partial exemplar row with evidence/reasoning cells populated — Student A *Reason*
- [x] Judgement/decision column empty on all rows — *Correct/Incorrect* empty including exemplar row
- [x] Reviewer can state modelled vs learner-owned — Student A *Reason* modelled; *Correct/Incorrect* learner-owned on all rows; Student B fully learner-owned
- [x] Row labels align with adjacent scenario (M11)

**Signal profile:** [ ] Minimum  [x] Strong  [ ] Weak  [ ] Failed  
**Superficial match flag:** [ ] yes  [x] no — verdict rise supported by §5.6, not checklist alone

### Failure Modes

| FM | Present? | Notes |
| -- | -------- | ----- |
| FM-04 (table shell without partial exemplar) | [x] absent  [ ] present | Partial exemplar on Student A |
| DLA partial-exemplar cross-check | [x] met  [ ] gap recorded | Model row present |

### Ownership Audit

| Check | Result |
| ----- | ------ |
| Learner judgement cells empty | [x] pass  [ ] fail  [ ] n/a |
| No pre-filled ratings or rank ordinals | [x] pass  [ ] fail  [ ] n/a |
| Exemplar row judgement column empty | [x] pass  [ ] fail  [ ] n/a — *Correct/Incorrect* empty on exemplar row |
| **Overall** | [x] pass  [ ] fail |
| **Ownership regression** | [ ] yes  [x] no |

**Notes:** Populated *Reason* on exemplar row is scaffolding (MP-1), not learner deliverable — learner still supplies *Correct/Incorrect* and Student B *Reason*. No pre-filled judgements vs baseline.

### Corpus Comparison

| Field | Value |
| ----- | ----- |
| **Frozen reference** | M12 (`benchmark-corpus/photosynthesis/learning-materials.txt`) |
| **Strong-reference proximity** | [x] closer to M13 feature set  [ ] same  [ ] farther  [ ] n/a |
| **Weak-reference distance** | [x] avoids M12 shape  [ ] partial  [ ] no |
| **Mimicry suspect** | [ ] yes  [x] no |
| **Summary** | Treatment moves toward Marx M13 Strong *feature set* (partial exemplar row, empty judgement column, criteria/scenario linkage) using Photosynthesis column layout (*Claim | Correct/Incorrect | Reason*) and domain content. Not a transplant of M13 criteria or evidence text. Structural similarity to SP-02 is intentional pattern realisation; FM-04 clearance and §5.6 Strong verdict are not reducible to empty-grid-plus-one-filled-cell without the modelled reasoning move. |

---

## Pair Outcome

| Field | Value |
| ----- | ----- |
| **Baseline verdict** | Minimum |
| **Treatment verdict** | Strong |
| **Paired delta** | Minimum → Strong |
| **FM delta** | FM-04: reduced (present → absent) |

**Classification**

- [x] Improvement
- [ ] No Change
- [ ] Regression
- [ ] Inconclusive

**Justification:** Primary evidence: verdict improved Minimum → Strong on identical A4 obligation. FM-04 cleared in treatment (present in baseline). Ownership preserved — *Correct/Incorrect* remain learner-owned; no ownership regression. Secondary: SP-02 Strong signals on treatment vs Minimum-only on baseline. Improvement is not superficial structural mimicry alone: baseline already had valid table structure; treatment adds partial exemplar with domain-appropriate reasoning modelling (FM-04 remediation), which is the discriminating instructional move in Sprint 44 evidence (M13 vs M12). Per-output success met.

**Per-output success (treatment):** [x] met  [ ] not met

---

## Reviewer Notes

- First **remediation** pair evaluated (Gate 3 primary). Marx maintain-test pairs (DT-MRX-A4, TP-MRX-A4) are not predictive of this outcome.
- Baseline = frozen M12 (Minimum, FM-04). Treatment = SP-02-guided partial exemplar on Student A *Reason* cell.
- FM-04 reduction coincides with contract improvement — not pattern checklist without verdict change.
- Do not generalise to DT-PS-A6 or transfer pairs from this single remediation result.

---
---

# DT-PS-A6

## Pair Metadata

| Field | Value |
| ----- | ----- |
| **Pair ID** | DT-PS-A6 |
| **Domain** | Photosynthesis (`photosynthesis-v1`) |
| **Activity** | A6 — capstone |
| **Material type** | `decision_table` |
| **Pattern (treatment)** | SP-02 / DT-SP-01 |
| **Contract section** | 44-2 §5.6 |
| **Frozen reference** | M19 — Minimum; FM-04 recorded |
| **Target FM** | FM-04 |
| **Comparison objective** | Test SP-02 on capstone decision table; verdict improvement and FM-04 clearance |
| **Baseline artefact ID** | BL-DT-PS-A6 |
| **Treatment artefact ID** | TR-DT-PS-A6 |
| **DLA obligation ref** | `benchmark-corpus/photosynthesis/design-learning-activities.json` → A6 → `required_materials` [M19] |
| **Frozen corpus verdict** | Minimum |

**DLA obligation snapshot**

```text
material_id: M19
type: decision_table
purpose: guided_practice
specification: | Factor | Impact | Evidence | ; depth_floor: L3
```

**Collection provenance (baseline):** Frozen benchmark corpus `benchmark-corpus/photosynthesis/learning-materials.txt` (M19). Pre-pattern capture. Artefact: [`45-1-evidence/artefacts/BL-DT-PS-A6.txt`](45-1-evidence/artefacts/BL-DT-PS-A6.txt).

**Collection provenance (treatment):** SP-02 / DT-SP-01 pattern-guided condition on identical A6 obligation. Artefact: [`45-1-evidence/artefacts/TR-DT-PS-A6.txt`](45-1-evidence/artefacts/TR-DT-PS-A6.txt).

---

## Baseline Evidence

**Artefact ID:** BL-DT-PS-A6  
**Collection date:** 2026-06-18  
**Condition:** Pre-pattern / non-injected generation (historical corpus capture)

**Body text**

```text
| Factor        | Impact | Evidence |
| ------------- | ------ | -------- |
| Carbon cycle  |        |          |
| Oxygen levels |        |          |
| Food webs     |        |          |
```

**Capture channel**

| FM | Present? |
| -- | -------- |
| FM-01 (stub) | [x] absent  [ ] present |
| FM-12 (page-composition) | [x] absent  [ ] present  [ ] not assessed |

### Contract Verdict

| Field | Value |
| ----- | ----- |
| **Verdict** | [ ] Failed  [x] Minimum  [ ] Strong |
| **Justification** | The body meets §5.6 minimum: valid table structure, three rows aligned to A6 factors, and learner-owned empty cells for *Impact* and *Evidence*. Strong bar is not met because there is no partial exemplar row modelling the reasoning move for any factor. The table is structurally complete but instructionally hollow for modelled judgement/evidence transfer, matching FM-04 on the M19 baseline shape. |

### Contract Observations

**Minimum realisation (§5.6)**

- [x] Proper tabular structure with headers and multiple rows
- [x] Enough rows for learner_task (three factors)
- [x] Learner judgement/rating/response cells empty where learner decides
- [ ] Table adjunct prose if needed — scenario in adjacent M18

**Strong realisation (§5.6)**

- [ ] Partial exemplar row demonstrating judgement move
- [x] Column labels prompt reasoning (*Impact*, *Evidence*)
- [x] Justification column paired with judgement cells (*Evidence* with *Impact*)
- [ ] Reference rows distinguished from learner-completion rows — no modelled row
- [x] Linked to factors in adjacent materials — M18 scenario impact domains
- [x] Row order does not function as answer key

**Failure modes observed (§5.6)**

- [x] Table shell without exemplar content
- [ ] Pre-filled effectiveness ratings or rank order
- [ ] Single blank row when multiple comparisons required
- [ ] Reference dump — entire grid pre-completed
- [ ] Comma-separated pseudo-table

**Notes:** Mirrors frozen M19 weakness: complete shell, no modelled reasoning cell. Consistent with Sprint 44 Minimum + FM-04 pattern.

### Detection Signals

**Pattern:** SP-02 — secondary evidence

**Minimum signals**

- [x] Usable table structure; headers; ≥2 data rows matching task scope
- [x] Learner decision/judgement columns empty
- [x] Row count matches learner_task requirement
- [x] No partial exemplar row — all learner-completion cells blank

**Strong signals**

- [ ] Exactly one partial exemplar row with evidence/reasoning cells populated
- [ ] Judgement/decision column empty on all rows including exemplar row
- [ ] Reviewer can state which row is modelled and which cells are learner-owned
- [x] Row labels align with factors in adjacent scenario (M18)

**Signal profile:** [x] Minimum  [ ] Strong  [ ] Weak  [ ] Failed  
**Superficial match flag:** [x] n/a  [ ] yes

### Failure Modes

| FM | Present? | Notes |
| -- | -------- | ----- |
| FM-04 (table shell without partial exemplar) | [ ] absent  [x] present | No modelled row in M19-form table |
| DLA partial-exemplar cross-check | [ ] met  [x] gap recorded | A6 table spec has no realised exemplar row |

### Ownership Audit

| Check | Result |
| ----- | ------ |
| Learner judgement cells empty | [x] pass  [ ] fail  [ ] n/a |
| No pre-filled ratings or rank ordinals | [x] pass  [ ] fail  [ ] n/a |
| Exemplar row judgement column empty | [x] pass  [ ] fail  [ ] n/a — n/a; no exemplar row |
| **Overall** | [x] pass  [ ] fail |

**Notes:** Learner ownership preserved (all completion cells empty). Baseline weakness is missing modelling, not ownership violation.

### Corpus Comparison

| Field | Value |
| ----- | ----- |
| **Frozen reference** | M19 (`benchmark-corpus/photosynthesis/learning-materials.txt`) |
| **Strong-reference proximity** | [ ] closer  [ ] same  [x] farther  [ ] n/a |
| **Weak-reference distance** | [ ] avoids weak shape  [ ] partial  [x] no — is M19 weak shape |
| **Mimicry suspect** | [ ] yes  [x] no |
| **Summary** | Baseline is byte-identical to frozen M19 and reproduces the Sprint 44 Minimum + FM-04 shape. No partial-exemplar reasoning is present; this is structural shell completion only. |

---

## Treatment Evidence

**Artefact ID:** TR-DT-PS-A6  
**Collection date:** 2026-06-18  
**Condition:** Pattern-guided generation (SP-02 / DT-SP-01)

**Collection provenance:** SP-02 pattern specification informed generation intent for Photosynthesis A6 `decision_table` obligation M19.

**Body text**

```text
| Factor        | Impact | Evidence |
| ------------- | ------ | -------- |
| Carbon cycle  |        | Reduced photosynthesis lowers carbon fixation, so atmospheric CO2 accumulates and less carbon is stored in biomass (see Case 1 deforestation). |
| Oxygen levels |        |          |
| Food webs     |        |          |
```

**Capture channel**

| FM | Present? |
| -- | -------- |
| FM-01 (stub) | [x] absent  [ ] present |
| FM-12 (page-composition) | [x] absent  [ ] present  [ ] not assessed |

### Contract Verdict

| Field | Value |
| ----- | ----- |
| **Verdict** | [ ] Failed  [ ] Minimum  [x] Strong |
| **Justification** | §5.6 minimum met: correct table structure, three A6 factor rows, and empty learner-owned *Impact* cells across rows. Strong bar met: one partial exemplar row is present (*Carbon cycle*) with reasoning populated in *Evidence* while leaving *Impact* empty, modelling evidence-to-judgement process without supplying learner judgement. Remaining rows are fully learner-completion rows. This clears FM-04 because the treatment adds substantive exemplar reasoning, not just a superficially filled table. |

### Contract Observations

**Minimum realisation (§5.6)**

- [x] Proper tabular structure with headers and multiple rows
- [x] Enough rows for learner_task (three factors)
- [x] Learner judgement/rating/response cells empty where learner decides — *Impact* empty on all rows
- [ ] Table adjunct prose if needed — scenario in adjacent M18

**Strong realisation (§5.6)**

- [x] Partial exemplar row demonstrating judgement move — *Carbon cycle* evidence modelled
- [x] Column labels prompt reasoning
- [x] Justification column paired with rating/ranking cells (*Evidence* paired with *Impact*)
- [x] Reference rows distinguished from learner-completion rows
- [x] Linked to factors in adjacent materials — M18 deforestation/ocean scenarios
- [x] Row order does not function as answer key

**Failure modes observed (§5.6)**

- [ ] Table shell without exemplar content
- [ ] Pre-filled effectiveness ratings or rank order
- [ ] Single blank row when multiple comparisons required
- [ ] Reference dump — entire grid pre-completed
- [ ] Comma-separated pseudo-table

**Notes:** Treatment introduces an explicit reasoning move on one row; the instructional delta from baseline is modelled evidence logic, not merely one non-empty cell.

### Detection Signals

**Pattern:** SP-02 — secondary evidence

**Minimum signals**

- [x] Usable table structure; headers; ≥2 data rows matching task scope
- [x] Learner decision/judgement columns empty
- [x] Row count matches learner_task requirement
- [ ] No partial exemplar row — **not met** (exemplar present)

**Strong signals**

- [x] Exactly one partial exemplar row with evidence/reasoning cells populated
- [x] Judgement/decision column empty on all rows including exemplar row
- [x] Reviewer can state which row is modelled and which cells are learner-owned — *Carbon cycle* evidence modelled; all *Impact* cells learner-owned
- [x] Row labels align with factors in adjacent exposition/scenario (M18)

**Signal profile:** [ ] Minimum  [x] Strong  [ ] Weak  [ ] Failed  
**Superficial match flag:** [ ] yes  [x] no — Strong judgement depends on partial-exemplar reasoning function, not table-fill appearance

### Failure Modes

| FM | Present? | Notes |
| -- | -------- | ----- |
| FM-04 (table shell without partial exemplar) | [x] absent  [ ] present | Partial exemplar row added |
| DLA partial-exemplar cross-check | [x] met  [ ] gap recorded | One modelled reasoning row present |

### Ownership Audit

| Check | Result |
| ----- | ------ |
| Learner judgement cells empty | [x] pass  [ ] fail  [ ] n/a |
| No pre-filled ratings or rank ordinals | [x] pass  [ ] fail  [ ] n/a |
| Exemplar row judgement column empty | [x] pass  [ ] fail  [ ] n/a |
| **Overall** | [x] pass  [ ] fail |
| **Ownership regression** | [ ] yes  [x] no |

**Notes:** The modelled content is in *Evidence* only. Learner still determines *Impact* on every row and completes unmodelled evidence rows.

### Corpus Comparison

| Field | Value |
| ----- | ----- |
| **Frozen reference** | M19 (`benchmark-corpus/photosynthesis/learning-materials.txt`) |
| **Strong-reference proximity** | [x] closer to M13 feature set  [ ] same  [ ] farther  [ ] n/a |
| **Weak-reference distance** | [x] avoids M19 shape  [ ] partial  [ ] no |
| **Mimicry suspect** | [ ] yes  [x] no |
| **Summary** | Treatment adopts the SP-02 Strong feature set (single partial exemplar, empty learner judgement column, distinguishable modelled vs learner rows) with Photosynthesis capstone factors and scenario-grounded evidence. It is not a Marx M13 text transplant: columns, factors, and exemplar content are A6-specific. |

---

## Pair Outcome

| Field | Value |
| ----- | ----- |
| **Baseline verdict** | Minimum |
| **Treatment verdict** | Strong |
| **Paired delta** | Minimum → Strong |
| **FM delta** | FM-04: reduced (present → absent) |

**Classification**

- [x] Improvement
- [ ] No Change
- [ ] Regression
- [ ] Inconclusive

**Justification:** Primary evidence: §5.6 verdict improves from Minimum to Strong on the same A6 obligation. FM-04 is reduced because treatment introduces a genuine partial-exemplar reasoning row while baseline is a shell-only table. Ownership is preserved (no regression): learner judgement locus (*Impact*) remains empty across all rows and no rank/ratings are pre-filled. Secondary SP-02 signals shift from Minimum to Strong and corroborate the verdict. Improvement is substantive, not superficial table completion.

**Per-output success (treatment):** [x] met  [ ] not met

---

## Reviewer Notes

- Second SP-02 remediation pair evaluated on Photosynthesis capstone decision table (A6).
- Baseline = frozen M19 Minimum with FM-04 (table shell, no model row). Treatment = SP-02-guided table with one modelled reasoning row and learner-owned impact judgements.
- Explicit distinction applied: partial-exemplar reasoning (substantive instructional support) vs superficial non-empty table cell.
- Anti-mimicry check passed: treatment uses A6 factors and scenario-linked Photosynthesis evidence, not Marx M13 wording.
- Do not generalise this result to TP-PS-A6 (out of scope for this step).

---
---

# TP-MRX-A4

## Pair Metadata

| Field | Value |
| ----- | ----- |
| **Pair ID** | TP-MRX-A4 |
| **Domain** | Marx (`marx-capitalism-v1`) |
| **Activity** | A4 — capstone; `purpose: transfer` |
| **Material type** | `transfer_prompt` |
| **Pattern (treatment)** | SP-03 / TP-SP-01 |
| **Contract section** | 44-2 §5.8 |
| **Frozen reference** | M16 — Strong (Pass 2, Inter-Rater) |
| **Target FM** | FM-02, FM-03 |
| **Comparison objective** | Maintain Strong transfer; confirm FM-02/FM-03 absent; detect mimicry of M16 |
| **Baseline artefact ID** | BL-TP-MRX-A4 |
| **Treatment artefact ID** | TR-TP-MRX-A4 |
| **DLA obligation ref** | `benchmark-corpus/marx/design-learning-activities.json` → A4 → `required_materials` [M16] |
| **Frozen corpus verdict** | Strong |

**DLA obligation snapshot**

```text
material_id: M16
type: transfer_prompt
purpose: transfer
specification: Prompt asking learner to apply Marxist evaluation lens to a modern digital economy example; requires brief justification using same criteria; depth_floor: L3
```

**Collection provenance (baseline):** Body sourced from frozen benchmark corpus `benchmark-corpus/marx/activity-materials.txt` (M16). Pre-pattern generation capture under Sprint 44 freeze. Artefact: [`45-1-evidence/artefacts/BL-TP-MRX-A4.txt`](45-1-evidence/artefacts/BL-TP-MRX-A4.txt).

**Collection provenance (treatment):** Body collected under SP-03 / TP-SP-01 pattern-guided condition on identical A4 obligation. Artefact: [`45-1-evidence/artefacts/TR-TP-MRX-A4.txt`](45-1-evidence/artefacts/TR-TP-MRX-A4.txt).

---

## Baseline Evidence

**Artefact ID:** BL-TP-MRX-A4  
**Collection date:** 2026-06-18  
**Condition:** Pre-pattern / non-injected generation (historical corpus capture)

**Body text**

```text
## Transfer Task: Applying Marx to the Digital Economy

Consider a modern digital platform (e.g. ride-sharing, food delivery, or online marketplaces).

Write a short response (100–150 words) addressing:

* How might **surplus value** operate in this context?
* Who represents the **bourgeoisie and proletariat**?
* Does Marx's framework still explain the relationship between workers and platform owners?
* Which of the evaluation criteria (explanatory power, predictive accuracy, relevance) is most useful here, and why?

Your response should apply the same analytical framework but in a new context.
```

**Capture channel**

| FM | Present? |
| -- | -------- |
| FM-01 (stub) | [x] absent  [ ] present |
| FM-12 (page-composition) | [x] absent  [ ] present  [ ] not assessed |

### Contract Verdict

| Field | Value |
| ----- | ----- |
| **Verdict** | [ ] Failed  [ ] Minimum  [x] Strong |
| **Justification** | The body meets §5.8 minimum: learner-context selection via platform choice (*Consider a modern digital platform*), operational completion criterion (*100–150 words*), and substantive transfer guidance on capstone A4. Strong bar is met: multiple application bullets (four distinct analytical moves), explicit link to session evaluation criteria (*explanatory power, predictive accuracy, relevance*), and a framework bridge closing line — without supplying a completed learner transfer essay (§5.8 strong signals; M16 precedent). |

### Contract Observations

**Minimum realisation (§5.8)**

- [x] Prompts referencing learner's own context — learner selects platform type
- [x] Explicit completion criterion (100–150 words)
- [x] At least one substantive transfer prompt on capstone or transfer-designated activity

**Strong realisation (§5.8)**

- [x] Multiple cues: context selection, application — four application bullets
- [ ] Limitation cue — absent; not required for Strong on M16 precedent
- [x] Links back to criteria or key ideas from session
- [x] Calibrated demand for higher education
- [ ] Paired with consolidation scaffold — M17 adjacent; not evaluated in this body pass
- [ ] Near vs far transfer distinguished — not evidenced on M16

**Failure modes observed (§5.8)**

- [ ] Third-person scenarios only — no own-context prompt
- [ ] Vague completion without operational criterion
- [ ] Transfer absent when transfer task field set
- [ ] Body too thin to guide production
- [ ] Completed transfer essay supplied
- [ ] Transfer collapsed into generic reflection

**Notes:** Independent 45-1 score aligns with Sprint 44 unanimous Strong on M16. Clearest single-type discrimination in Sprint 44 (vs Photosynthesis M14 Failed).

### Detection Signals

**Pattern:** SP-03 — secondary evidence

**Strong signals**

- [x] Transfer on capstone or transfer-designated activity
- [x] Operational completion criterion — 100–150 words
- [x] Learner-context selection — platform choice framing
- [x] Multiple application bullets or cues — four bullets
- [x] Link to session criteria or key ideas named in the arc
- [x] No pre-written learner transfer response in material body
- [x] Reviewer can state what learner must produce and in which context

**Minimum signals**

- [x] Substantive body (more than one or two bare sentences)
- [x] Explicit completion band or element count
- [x] Capstone / transfer placement
- [ ] Boundary: own-context absent — not applicable; context selection present

**Failed signals**

- [ ] Body too thin to guide production
- [ ] No operational completion criterion
- [ ] Third-person claim correction only
- [ ] Reviewer cannot identify completion requirements or production context

**Signal profile:** [ ] Minimum  [x] Strong  [ ] Weak  [ ] Failed  
**Superficial match flag:** [x] n/a  [ ] yes

### Failure Modes

| FM | Present? | Notes |
| -- | -------- | ----- |
| FM-02 (thin transfer body) | [x] absent  [ ] present | Substantive body with word band |
| FM-03 (third-person procedural transfer) | [x] absent  [ ] present | Learner selects platform context |

### Ownership Audit

| Check | Result |
| ----- | ------ |
| No pre-written transfer response | [x] pass  [ ] fail  [ ] n/a |
| Learner-context framing (Strong bar) | [x] pass  [ ] fail  [ ] not required |
| **Overall** | [x] pass  [ ] fail |

**Notes:** Body assigns production to learner; no model transfer essay supplied. Learner owns context selection and written response.

### Corpus Comparison

| Field | Value |
| ----- | ----- |
| **Frozen reference** | M16 (`benchmark-corpus/marx/activity-materials.txt`) |
| **Strong-reference proximity** | [ ] closer  [x] same  [ ] farther  [ ] n/a |
| **Weak-reference distance** | [x] avoids M14 failure shape  [ ] partial  [ ] no |
| **Mimicry suspect** | [ ] yes  [x] no |
| **Summary** | Baseline body is the frozen M16 Strong reference. Independent 45-1 verdict matches Sprint 44 historical scoring. |

---

## Treatment Evidence

**Artefact ID:** TR-TP-MRX-A4  
**Collection date:** 2026-06-18  
**Condition:** Pattern-guided generation (SP-03 / TP-SP-01)

**Collection provenance:** SP-03 / TP-SP-01 pattern specification informed generation intent for Marx A4 `transfer_prompt` obligation M16. Identical DLA obligation and frozen upstream chain as baseline.

**Body text**

```text
## Transfer Task: Applying Marx to a Workplace You Know

Choose a workplace or organisation you have observed (e.g. a retail chain, warehouse, or local service firm you have worked in or studied closely).

Write a short response (100–150 words) addressing:

* Where might **surplus value** be created in this setting?
* Who acts as owners or managers versus workers in your example?
* Does Marx's framework help explain power or inequality in this case?
* Which evaluation criterion from this session (explanatory power, predictive accuracy, contemporary relevance) best fits your analysis, and why?

Apply the same evaluative framework you used in Activity A4, but in your chosen context.
```

**Capture channel**

| FM | Present? |
| -- | -------- |
| FM-01 (stub) | [x] absent  [ ] present |
| FM-12 (page-composition) | [x] absent  [ ] present  [ ] not assessed |

### Contract Verdict

| Field | Value |
| ----- | ----- |
| **Verdict** | [ ] Failed  [ ] Minimum  [x] Strong |
| **Justification** | §5.8 minimum met: learner-context selection (*Choose a workplace or organisation you have observed*), operational word band (*100–150 words*), and substantive multi-section body on transfer-designated A4. Strong bar met: four application bullets covering surplus value, class relations, framework test, and criteria linkage; session criteria named explicitly; framework bridge to Activity A4; no pre-written learner transfer text (§5.8 failure mode avoided). |

### Contract Observations

**Minimum realisation (§5.8)**

- [x] Prompts referencing learner's own context
- [x] Explicit completion criterion (100–150 words)
- [x] At least one substantive transfer prompt on capstone or transfer-designated activity

**Strong realisation (§5.8)**

- [x] Multiple cues: context selection, application
- [ ] Limitation cue — absent; not required on M16 precedent
- [x] Links back to criteria or key ideas from session
- [x] Calibrated demand for higher education
- [ ] Paired with consolidation scaffold — not scored in body pass
- [ ] Near vs far transfer distinguished — not evidenced

**Failure modes observed (§5.8)**

- [ ] Third-person scenarios only
- [ ] Vague completion without operational criterion
- [ ] Transfer absent when transfer task field set
- [ ] Body too thin to guide production
- [ ] Completed transfer essay supplied
- [ ] Transfer collapsed into generic reflection

**Notes:** Treatment realises SP-03 Strong shape. Heading, context-selection frame, and bullet wording differ from frozen M16 (anti-mimicry).

### Detection Signals

**Pattern:** SP-03 — secondary evidence

**Strong signals**

- [x] Transfer on capstone or transfer-designated activity
- [x] Operational completion criterion — 100–150 words
- [x] Learner-context selection — workplace/organisation choice
- [x] Multiple application bullets or cues — four bullets
- [x] Link to session criteria or key ideas named in the arc
- [x] No pre-written learner transfer response in material body
- [x] Reviewer can state what learner must produce and in which context

**Minimum signals**

- [x] Substantive body
- [x] Explicit completion band or element count
- [x] Capstone / transfer placement
- [ ] Boundary: own-context absent — not applicable

**Failed signals**

- [ ] Body too thin to guide production
- [ ] No operational completion criterion
- [ ] Third-person claim correction only
- [ ] Reviewer cannot identify completion requirements or production context

**Signal profile:** [ ] Minimum  [x] Strong  [ ] Weak  [ ] Failed  
**Superficial match flag:** [ ] yes  [x] no

### Failure Modes

| FM | Present? | Notes |
| -- | -------- | ----- |
| FM-02 (thin transfer body) | [x] absent  [ ] present | |
| FM-03 (third-person procedural transfer) | [x] absent  [ ] present | Learner chooses observed workplace |

### Ownership Audit

| Check | Result |
| ----- | ------ |
| No pre-written transfer response | [x] pass  [ ] fail  [ ] n/a |
| Learner-context framing (Strong bar) | [x] pass  [ ] fail  [ ] not required |
| **Overall** | [x] pass  [ ] fail |
| **Ownership regression** | [ ] yes  [x] no |

**Notes:** No pre-written transfer essay. Learner selects context and produces response. No increase in author-completed content vs baseline.

### Corpus Comparison

| Field | Value |
| ----- | ----- |
| **Frozen reference** | M16 (`benchmark-corpus/marx/activity-materials.txt`) |
| **Strong-reference proximity** | [ ] closer  [x] same  [ ] farther  [ ] n/a |
| **Weak-reference distance** | [x] avoids M14 failure shape  [ ] partial  [ ] no |
| **Mimicry suspect** | [ ] yes  [x] no |
| **Summary** | Treatment matches M16 Strong feature set (word band, context selection, four application cues, criteria linkage, framework bridge, no pre-written response) but uses a different transfer frame (*workplace you know* vs *digital platform*) and distinct bullet phrasing. Not verbatim M16 reproduction. DLA specifies digital economy example; treatment uses workplace selection — still domain-appropriate Marx transfer on same obligation, not Photosynthesis M14 shape. |

---

## Pair Outcome

| Field | Value |
| ----- | ----- |
| **Baseline verdict** | Strong |
| **Treatment verdict** | Strong |
| **Paired delta** | Strong → Strong |
| **FM delta** | FM-02: unchanged (absent both) · FM-03: unchanged (absent both) |

**Classification**

- [ ] Improvement
- [x] No Change
- [ ] Regression
- [ ] Inconclusive

**Justification:** Treatment maintains Strong with FM-02 and FM-03 absent and ownership pass. Baseline was already Strong (frozen M16). Paired delta is Strong → Strong — **no_change** per execution plan for Marx maintain-test slot. No FM clearance event (both absent at baseline). Anti-mimicry: treatment differs in heading, context-selection frame (*workplace* vs *digital platform*), and bullet wording while preserving Strong instructional function. Per-output success met: Strong maintained, target FMs absent, ownership preserved, SP-03 Strong signals present (secondary).

**Per-output success (treatment):** [x] met  [ ] not met

---

## Reviewer Notes

- TP-MRX-A4 pair complete. Baseline = frozen M16; treatment = SP-03-guided body on identical A4 transfer obligation.
- Primary: both Strong per §5.8. Secondary: SP-03 Strong signals on both; treatment superficial-match flag = no.
- Pair classified **No Change** — expected for Marx capstone transfer maintain slot. Do not generalise to Photosynthesis TP-PS-A4 (Failed baseline) or TP-PS-A6 (boundary).
- DLA mentions digital economy; treatment uses workplace frame — noted for obligation-fidelity awareness; body still performs capstone Marx transfer with SP-03 Strong shape.

---
---

# TP-PS-A4

## Pair Metadata

| Field | Value |
| ----- | ----- |
| **Pair ID** | TP-PS-A4 |
| **Domain** | Photosynthesis (`photosynthesis-v1`) |
| **Activity** | A4; `purpose: transfer` |
| **Material type** | `transfer_prompt` |
| **Pattern (treatment)** | SP-03 / TP-SP-01 |
| **Contract section** | 44-2 §5.8 |
| **Frozen reference** | M14 — Failed; FM-02, FM-03 |
| **Target FM** | FM-02, FM-03 |
| **Comparison objective** | Test SP-03 remediation of unanimous Failed transfer; Gate 3 primary pair |
| **Baseline artefact ID** | BL-TP-PS-A4 |
| **Treatment artefact ID** | TR-TP-PS-A4 |
| **DLA obligation ref** | `benchmark-corpus/photosynthesis/design-learning-activities.json` → A4 → `required_materials` [M14] |
| **Frozen corpus verdict** | Failed |

**DLA obligation snapshot**

```text
material_id: M14
type: transfer_prompt
purpose: transfer
specification: Prompt asking learner to correct a new unseen misconception; depth_floor: L3
```

**Collection provenance (baseline):** Frozen benchmark corpus `benchmark-corpus/photosynthesis/learning-materials.txt` (M14). Pre-pattern capture. Artefact: [`45-1-evidence/artefacts/BL-TP-PS-A4.txt`](45-1-evidence/artefacts/BL-TP-PS-A4.txt).

**Collection provenance (treatment):** SP-03 / TP-SP-01 pattern-guided condition on identical A4 transfer obligation. Artefact: [`45-1-evidence/artefacts/TR-TP-PS-A4.txt`](45-1-evidence/artefacts/TR-TP-PS-A4.txt).

---

## Baseline Evidence

**Artefact ID:** BL-TP-PS-A4  
**Collection date:** 2026-06-18  
**Condition:** Pre-pattern / non-injected generation (historical corpus capture)

**Body text**

```text
Write a short response correcting this claim:
"Plants only photosynthesise during daylight hours."
Explain your reasoning using correct biological principles.
```

**Capture channel**

| FM | Present? |
| -- | -------- |
| FM-01 (stub) | [x] absent  [ ] present |
| FM-12 (page-composition) | [x] absent  [ ] present  [ ] not assessed |

### Contract Verdict

| Field | Value |
| ----- | ----- |
| **Verdict** | [x] Failed  [ ] Minimum  [ ] Strong |
| **Justification** | The body occupies a transfer slot but fails §5.8 minimum. Third-person claim-correction only — no learner-context or own-context framing (§5.8 failure mode: third-person scenarios only). *Short* is not an operational completion criterion (§5.8 failure mode: vague completion). Body is two sentences — too thin to guide production beyond a single correction task (§5.8 failure mode: body too thin). Matches Sprint 44 unanimous Failed on M14 (FM-02, FM-03). |

### Contract Observations

**Minimum realisation (§5.8)**

- [ ] Prompts referencing learner's own context — absent; supplied third-person claim only
- [ ] Explicit completion criterion — *short* is vague; no word band or element count
- [ ] At least one substantive transfer prompt — transfer slot present but body too thin to guide production

**Strong realisation (§5.8)**

- [ ] Multiple cues: context selection, application, limitation
- [ ] Links back to criteria or key ideas from session
- [ ] Calibrated demand for higher education
- [ ] Paired with consolidation scaffold
- [ ] Near vs far transfer distinguished

**Failure modes observed (§5.8)**

- [x] Third-person scenarios only — correct this supplied claim
- [x] Vague completion without operational criterion — *short* only
- [ ] Transfer absent when transfer task field set — slot present; instructional function absent
- [x] Body too thin to guide production — two sentences
- [ ] Completed transfer essay supplied
- [ ] Transfer collapsed into generic reflection

**Notes:** Clearest single-type discrimination in Sprint 44 (M16 Strong vs M14 Failed). Transfer-slot presence without substantive transfer support — not remediated by claim topic alone.

### Detection Signals

**Pattern:** SP-03 — secondary evidence

**Strong signals**

- [ ] Transfer on capstone or transfer-designated activity — placement yes; Strong shape no
- [ ] Operational completion criterion
- [ ] Learner-context selection or possessive own-context framing
- [ ] Multiple application bullets or cues
- [ ] Link to session criteria or key ideas
- [x] No pre-written learner transfer response in material body
- [ ] Reviewer can state what learner must produce and in which context — only generic correction task

**Minimum signals**

- [ ] Substantive body — two sentences only
- [ ] Explicit completion band or element count
- [x] Capstone / transfer placement — A4 transfer-designated
- [x] Boundary: own-context absent — FM-03 risk recorded

**Failed signals**

- [x] Body too thin to guide production
- [x] No operational completion criterion
- [x] Third-person claim correction only; no own-context or context selection
- [x] Reviewer cannot identify completion requirements or production context beyond vague *short* correction

**Signal profile:** [ ] Minimum  [ ] Strong  [ ] Weak  [x] Failed  
**Superficial match flag:** [x] n/a  [ ] yes

### Failure Modes

| FM | Present? | Notes |
| -- | -------- | ----- |
| FM-02 (thin transfer body) | [ ] absent  [x] present | No word/element band; two-sentence body |
| FM-03 (third-person procedural transfer) | [ ] absent  [x] present | Correct supplied claim; no learner context selection |

### Ownership Audit

| Check | Result |
| ----- | ------ |
| No pre-written transfer response | [x] pass  [ ] fail  [ ] n/a |
| Learner-context framing (Strong bar) | [ ] pass  [x] fail  [ ] not required |
| **Overall** | [x] pass  [ ] fail |

**Notes:** Learner still owns written response; failure is thin procedural framing (FM-02/FM-03), not pre-filled deliverable. No ownership regression risk at baseline — instructional under-realisation only.

### Corpus Comparison

| Field | Value |
| ----- | ----- |
| **Frozen reference** | M14 (`benchmark-corpus/photosynthesis/learning-materials.txt`) |
| **Strong-reference proximity** | [ ] closer to M16 feature set  [ ] same  [x] farther  [ ] n/a |
| **Weak-reference distance** | [ ] avoids M14 failure shape  [ ] partial  [x] no — is M14 failure shape |
| **Mimicry suspect** | [ ] yes  [x] no |
| **Summary** | Baseline byte-identical to frozen M14. Independent 45-1 verdict matches Sprint 44 unanimous Failed. Distinct from Marx M16 Strong reference on every SP-03 discriminant. |

---

## Treatment Evidence

**Artefact ID:** TR-TP-PS-A4  
**Collection date:** 2026-06-18  
**Condition:** Pattern-guided generation (SP-03 / TP-SP-01)

**Collection provenance:** SP-03 pattern specification informed generation intent for Photosynthesis A4 `transfer_prompt` obligation M14.

**Body text**

```text
## Transfer Task: Evaluating a New Misconception in Your Context

Choose a plant or growing situation you have observed personally (e.g. a houseplant, garden bed, or campus greenery).

Consider this new claim: "Photosynthesis stops completely at night, so plants do not need carbon dioxide after sunset."

Write a short response (80–120 words) addressing:

* What biological principles from this session disprove or qualify the claim?
* Which evidence from the light-dependent and light-independent reactions should you cite?
* How does your Activity A4 evaluation method (correct/incorrect judgement plus reason) apply here?
* Check your draft against the verification criteria: accurate correction, evidence used, clarity, and completeness.

Apply the same misconception-evaluation approach you used in Activity A4, but to this new claim in your chosen context.
```

**Capture channel**

| FM | Present? |
| -- | -------- |
| FM-01 (stub) | [x] absent  [ ] present |
| FM-12 (page-composition) | [x] absent  [ ] present  [ ] not assessed |

### Contract Verdict

| Field | Value |
| ----- | ----- |
| **Verdict** | [ ] Failed  [ ] Minimum  [x] Strong |
| **Justification** | §5.8 minimum met: learner-context selection (*Choose a plant or growing situation you have observed personally*), operational word band (*80–120 words*), and substantive multi-section body on transfer-designated A4. Strong bar met: four application bullets covering biological principles, reaction-stage evidence, A4 evaluation-method transfer, and M13 verification criteria; framework bridge to Activity A4 misconception-evaluation approach; new unseen misconception distinct from M11 claims and baseline M14 claim; no pre-written learner transfer text (§5.8 failure modes avoided). |

### Contract Observations

**Minimum realisation (§5.8)**

- [x] Prompts referencing learner's own context — plant/situation selection
- [x] Explicit completion criterion — 80–120 words
- [x] At least one substantive transfer prompt on transfer-designated activity

**Strong realisation (§5.8)**

- [x] Multiple cues: context selection, application — four bullets
- [ ] Limitation cue — absent; not required on M16 precedent
- [x] Links back to criteria or key ideas — M13 verification criteria; A4 evaluation method
- [x] Calibrated demand for higher education
- [ ] Paired with consolidation scaffold — M13 adjacent; not scored in body pass
- [ ] Near vs far transfer distinguished — not evidenced

**Failure modes observed (§5.8)**

- [ ] Third-person scenarios only
- [ ] Vague completion without operational criterion
- [ ] Transfer absent when transfer task field set
- [ ] Body too thin to guide production
- [ ] Completed transfer essay supplied
- [ ] Transfer collapsed into generic reflection

**Notes:** Treatment supplies substantive transfer support, not merely a transfer slot. Learner-context selection replaces third-person procedural correction (FM-03 remediation). Multi-cue structure and word band replace thin body (FM-02 remediation).

### Detection Signals

**Pattern:** SP-03 — secondary evidence

**Strong signals**

- [x] Transfer on capstone or transfer-designated activity
- [x] Operational completion criterion — 80–120 words
- [x] Learner-context selection — observed plant/situation
- [x] Multiple application bullets or cues — four bullets
- [x] Link to session criteria or key ideas — M13 checklist; A4 method
- [x] No pre-written learner transfer response in material body
- [x] Reviewer can state what learner must produce and in which context

**Minimum signals**

- [x] Substantive body
- [x] Explicit completion band or element count
- [x] Capstone / transfer placement
- [ ] Boundary: own-context absent — not applicable; context selection present

**Failed signals**

- [ ] Body too thin to guide production
- [ ] No operational completion criterion
- [ ] Third-person claim correction only
- [ ] Reviewer cannot identify completion requirements or production context

**Signal profile:** [ ] Minimum  [x] Strong  [ ] Weak  [ ] Failed  
**Superficial match flag:** [ ] yes  [x] no — verdict rise supported by §5.8 substantive transfer function, not slot presence alone

### Failure Modes

| FM | Present? | Notes |
| -- | -------- | ----- |
| FM-02 (thin transfer body) | [x] absent  [ ] present | Word band; multi-cue structure |
| FM-03 (third-person procedural transfer) | [x] absent  [ ] present | Learner selects observed context |

### Ownership Audit

| Check | Result |
| ----- | ------ |
| No pre-written transfer response | [x] pass  [ ] fail  [ ] n/a |
| Learner-context framing (Strong bar) | [x] pass  [ ] fail  [ ] not required |
| **Overall** | [x] pass  [ ] fail |
| **Ownership regression** | [ ] yes  [x] no |

**Notes:** Learner selects context and produces correction/evaluation text. No model transfer essay. Populated bullets are production prompts, not author-completed deliverables.

### Corpus Comparison

| Field | Value |
| ----- | ----- |
| **Frozen reference** | M14 (`benchmark-corpus/photosynthesis/learning-materials.txt`) |
| **Strong-reference proximity** | [x] closer to M16 feature set  [ ] same  [ ] farther  [ ] n/a |
| **Weak-reference distance** | [x] avoids M14 failure shape  [ ] partial  [ ] no |
| **Mimicry suspect** | [ ] yes  [x] no |
| **Summary** | Treatment adopts M16 Strong *feature set* (word band, context selection, four application cues, criteria linkage, framework bridge, no pre-written response) for Photosynthesis misconception-evaluation transfer. Not Marx M16 content transplant. Anti-mimicry: domain-specific claim, reaction-stage evidence cues, and A4/M13 arc linkage. Improvement is not reducible to retaining a correction sentence — baseline already had correction; treatment adds learner-context selection and substantive production scaffolding. |

---

## Pair Outcome

| Field | Value |
| ----- | ----- |
| **Baseline verdict** | Failed |
| **Treatment verdict** | Strong |
| **Paired delta** | Failed → Strong |
| **FM delta** | FM-02: reduced (present → absent) · FM-03: reduced (present → absent) |

**Classification**

- [x] Improvement
- [ ] No Change
- [ ] Regression
- [ ] Inconclusive

**Justification:** Primary evidence: verdict improved Failed → Strong on identical A4 transfer obligation. FM-02 and FM-03 cleared in treatment (both present in baseline). Ownership preserved — no pre-written transfer response; no ownership regression. Secondary: SP-03 Failed profile on baseline vs Strong on treatment. Improvement is not superficial transfer-slot mimicry: baseline already occupied the transfer slot with a correction claim; treatment adds learner-context selection (vs third-person procedural transfer) and substantive multi-cue scaffolding (vs thin body). Gate 3 primary SP-03 remediation pair per design. Per-output success met.

**Per-output success (treatment):** [x] met  [ ] not met

---

## Reviewer Notes

- Second **remediation** pair evaluated; first SP-03 remediation case. Gate 3 primary transfer pair (clearest Sprint 44 single-type discrimination: M16 vs M14).
- Baseline = frozen M14 (Failed, FM-02 + FM-03). Treatment = SP-03-guided body with learner-context selection, word band, four application cues, M13 criteria linkage, and new unseen misconception.
- Explicitly distinguished: (1) substantive transfer support vs mere transfer-slot presence; (2) learner-context selection vs third-person claim correction.
- DT-PS-A4 Improvement does not predict this outcome — independent material type and pattern.
- Do not generalise to TP-PS-A6 (M22 boundary) from this result.

---
---

# TP-PS-A6

## Pair Metadata

| Field | Value |
| ----- | ----- |
| **Pair ID** | TP-PS-A6 |
| **Domain** | Photosynthesis (`photosynthesis-v1`) |
| **Activity** | A6 — capstone; `purpose: transfer` |
| **Material type** | `transfer_prompt` |
| **Pattern (treatment)** | SP-03 / TP-SP-01 |
| **Contract section** | 44-2 §5.8 |
| **Frozen reference** | M22 — Minimum (Pass 2) / Failed (Inter-Rater); FM-03 risk |
| **Target FM** | FM-02, FM-03 |
| **Comparison objective** | Test SP-03 on capstone transfer; document M22-boundary handling; declare §5.8 minimum interpretation |
| **Baseline artefact ID** | BL-TP-PS-A6 |
| **Treatment artefact ID** | TR-TP-PS-A6 |
| **DLA obligation ref** | `benchmark-corpus/photosynthesis/design-learning-activities.json` → A6 → `required_materials` [M22] |
| **Frozen corpus verdict** | Minimum (P2) / Failed (IR) — boundary |

**DLA obligation snapshot**

```text
material_id: M22
type: transfer_prompt
purpose: transfer
specification: Prompt asking learner to apply judgement to a new environmental issue; depth_floor: L3
```

**Collection provenance (baseline):** Frozen benchmark corpus `benchmark-corpus/photosynthesis/learning-materials.txt` (M22). Pre-pattern capture. Artefact: [`45-1-evidence/artefacts/BL-TP-PS-A6.txt`](45-1-evidence/artefacts/BL-TP-PS-A6.txt).

**Collection provenance (treatment):** SP-03 / TP-SP-01 pattern-guided condition on identical A6 transfer obligation. Artefact: [`45-1-evidence/artefacts/TR-TP-PS-A6.txt`](45-1-evidence/artefacts/TR-TP-PS-A6.txt).

**M22 boundary declaration (required at evaluation)**

| Field | Value |
| ----- | ----- |
| **§5.8 minimum interpretation applied** | [ ] Pass 2 compensatory  [x] Inter-Rater conjunctive |
| **Declared by** | Sprint 45 evidence collection (session) |
| **Date** | 2026-06-18 |

---

## Baseline Evidence

**Artefact ID:** BL-TP-PS-A6  
**Collection date:** 2026-06-18  
**Condition:** Pre-pattern / non-injected generation (historical corpus capture)

**Body text**

```text
Apply your reasoning to a new situation:
Explain how a major reduction in photosynthesis might affect human food systems, climate systems, and biodiversity.
Write at least 80 words and include at least two different impacts.
```

**Capture channel**

| FM | Present? |
| -- | -------- |
| FM-01 (stub) | [x] absent  [ ] present |
| FM-12 (page-composition) | [x] absent  [ ] present  [ ] not assessed |

### Contract Verdict

| Field | Value |
| ----- | ----- |
| **Verdict** | [x] Failed  [ ] Minimum  [ ] Strong |
| **Justification** | Under the declared Inter-Rater conjunctive reading of §5.8 minimum, the body fails minimum because it lacks learner-context selection/own-context framing despite having a completion criterion (80+ words; at least two impacts). It is transfer-designated and not thin in length, but remains third-person procedural transfer over a generic scenario. This is the documented M22 boundary condition: completion criterion present, own-context absent, therefore FM-03 risk remains determinative. |

### Contract Observations

**Minimum realisation (§5.8)**

- [ ] Prompts referencing learner's own context — absent (generic third-person framing)
- [x] Explicit completion criterion (length, elements, or evidence) — 80+ words and >=2 impacts
- [x] At least one substantive transfer prompt on capstone or transfer-designated activity

**Strong realisation (§5.8)**

- [ ] Multiple cues: context selection, application, limitation
- [ ] Links back to criteria or key ideas from session
- [ ] Calibrated demand for higher education
- [ ] Paired with consolidation scaffold that supports but does not complete transfer
- [ ] Near vs far transfer distinguished

**Failure modes observed (§5.8)**

- [x] Third-person scenarios only — no own-context prompt
- [ ] Vague completion without operational criterion
- [ ] Transfer absent when transfer task field set
- [ ] Body too thin to guide production
- [ ] Completed transfer essay supplied
- [ ] Transfer collapsed into generic reflection

**Notes:** Boundary condition explicitly documented, not recalibrated: this verdict follows the chosen conjunctive minimum interpretation and preserves learner-context selection requirement.

### Detection Signals

**Pattern:** SP-03 — secondary evidence

**Strong signals**

- [x] Transfer on capstone or transfer-designated activity
- [x] Operational completion criterion — word band and/or required elements
- [ ] Learner-context selection or possessive own-context framing
- [ ] Multiple application bullets or cues — single combined instruction set only
- [ ] Link to session criteria or key ideas named in the arc
- [x] No pre-written learner transfer response in material body
- [ ] Reviewer can state what learner must produce and in which context — context is generic, not learner-selected

**Minimum signals**

- [x] Substantive body (more than one or two bare sentences)
- [x] Explicit completion band or element count
- [x] Capstone / transfer placement
- [x] Boundary: own-context absent — FM-03 risk recorded

**Failed signals**

- [ ] Body too thin to guide production
- [ ] No operational completion criterion
- [ ] Third-person claim correction only; no own-context or context selection
- [x] Reviewer cannot identify learner-owned context selection requirements

**Signal profile:** [ ] Minimum  [ ] Strong  [x] Weak  [ ] Failed  
**Superficial match flag:** [x] n/a  [ ] yes

### Failure Modes

| FM | Present? | Notes |
| -- | -------- | ----- |
| FM-02 (thin transfer body) | [x] absent  [ ] present | Completion requirement + multi-impact demand prevent thin-body failure |
| FM-03 (third-person procedural transfer) | [ ] absent  [x] present | M22 boundary: completion band present but no learner-context selection |

### Ownership Audit

| Check | Result |
| ----- | ------ |
| No pre-written transfer response | [x] pass  [ ] fail  [ ] n/a |
| Learner-context framing (Strong bar) | [ ] pass  [x] fail  [ ] not required |
| **Overall** | [x] pass  [ ] fail |

**Notes:** Ownership remains intact (no authored learner response). Pedagogic weakness is context framing (FM-03), not ownership breach.

### Corpus Comparison

| Field | Value |
| ----- | ----- |
| **Frozen reference** | M22 (`benchmark-corpus/photosynthesis/learning-materials.txt`) |
| **Strong-reference proximity** | [ ] closer to M16 feature set  [ ] same  [x] farther  [ ] n/a |
| **Weak-reference distance** | [ ] avoids M14/M22 weak shapes  [x] partial  [ ] no |
| **Mimicry suspect** | [ ] yes  [x] no |
| **Summary** | Baseline is byte-identical to frozen M22 and exhibits the same boundary profile: stronger than M14 on completion criterion, weaker than M16 on learner-context selection and multi-cue transfer scaffolding. |

---

## Treatment Evidence

**Artefact ID:** TR-TP-PS-A6  
**Collection date:** 2026-06-18  
**Condition:** Pattern-guided generation (SP-03 / TP-SP-01)

**Collection provenance:** SP-03 / TP-SP-01 pattern specification informed generation intent for Photosynthesis A6 `transfer_prompt` obligation M22.

**Body text**

```text
## Transfer Task: Apply Your Judgement in a Context You Know

Choose a real food system, ecosystem, or local environment you know (for example: a fishing community, an agricultural region, or an urban food supply chain).

Write 90-130 words explaining how a major reduction in photosynthesis would affect:

* human food systems,
* climate systems, and
* biodiversity.

Include at least one concrete mechanism in each area (for example, reduced primary production, weaker carbon uptake, or disrupted trophic links), and briefly state which impact seems most severe in your chosen context.

Use the same evidence-based judgement approach from Activity A6, without writing a full final summary.
```

**Capture channel**

| FM | Present? |
| -- | -------- |
| FM-01 (stub) | [x] absent  [ ] present |
| FM-12 (page-composition) | [x] absent  [ ] present  [ ] not assessed |

### Contract Verdict

| Field | Value |
| ----- | ----- |
| **Verdict** | [ ] Failed  [ ] Minimum  [x] Strong |
| **Justification** | Under the same declared conjunctive interpretation, treatment meets and exceeds §5.8 minimum: explicit learner-context selection (*context you know*), operational completion criterion (90-130 words), and substantive transfer on capstone A6. Strong indicators are present: multiple application cues, mechanism requirement across three domains, ranking/judgement prompt on severity, and explicit bridge to A6 judgement method. No pre-written learner response is supplied, so ownership remains learner-held. |

### Contract Observations

**Minimum realisation (§5.8)**

- [x] Prompts referencing learner's own context
- [x] Explicit completion criterion (length, elements, or evidence)
- [x] At least one substantive transfer prompt on capstone or transfer-designated activity

**Strong realisation (§5.8)**

- [x] Multiple cues: context selection, application, limitation-like prioritisation
- [x] Links back to criteria or key ideas from session (A6 evidence-based judgement)
- [x] Calibrated demand for higher education
- [ ] Paired with consolidation scaffold that supports but does not complete transfer
- [ ] Near vs far transfer distinguished

**Failure modes observed (§5.8)**

- [ ] Third-person scenarios only — no own-context prompt
- [ ] Vague completion without operational criterion
- [ ] Transfer absent when transfer task field set
- [ ] Body too thin to guide production
- [ ] Completed transfer essay supplied
- [ ] Transfer collapsed into generic reflection

**Notes:** Treatment resolves the M22 boundary weakness by adding explicit learner-context selection while preserving operational completion criteria.

### Detection Signals

**Pattern:** SP-03 — secondary evidence

**Strong signals**

- [x] Transfer on capstone or transfer-designated activity
- [x] Operational completion criterion — word band and required elements
- [x] Learner-context selection or possessive own-context framing
- [x] Multiple application bullets or cues
- [x] Link to session criteria or key ideas named in the arc
- [x] No pre-written learner transfer response in material body
- [x] Reviewer can state what learner must produce and in which context

**Minimum signals**

- [x] Substantive body (more than one or two bare sentences)
- [x] Explicit completion band or element count
- [x] Capstone / transfer placement
- [ ] Boundary: own-context absent — record FM-03 risk if applicable

**Failed signals**

- [ ] Body too thin to guide production
- [ ] No operational completion criterion
- [ ] Third-person claim correction only; no own-context or context selection
- [ ] Reviewer cannot identify completion requirements or production context

**Signal profile:** [ ] Minimum  [x] Strong  [ ] Weak  [ ] Failed  
**Superficial match flag:** [ ] yes  [x] no — improvement comes from substantive context-selection and transfer scaffolding, not slot-label reuse

### Failure Modes

| FM | Present? | Notes |
| -- | -------- | ----- |
| FM-02 (thin transfer body) | [x] absent  [ ] present | Substantive multi-cue body with explicit completion demands |
| FM-03 (third-person procedural transfer) | [x] absent  [ ] present | Learner-context selection explicitly required |

### Ownership Audit

| Check | Result |
| ----- | ------ |
| No pre-written transfer response | [x] pass  [ ] fail  [ ] n/a |
| Learner-context framing (Strong bar) | [x] pass  [ ] fail  [ ] not required |
| **Overall** | [x] pass  [ ] fail |
| **Ownership regression** | [ ] yes  [x] no |

**Notes:** Treatment keeps production fully learner-owned while strengthening transfer guidance. No ownership regression versus baseline.

### Corpus Comparison

| Field | Value |
| ----- | ----- |
| **Frozen reference** | M22 (`benchmark-corpus/photosynthesis/learning-materials.txt`) |
| **Strong-reference proximity** | [x] closer to M16 feature set  [ ] same  [ ] farther  [ ] n/a |
| **Weak-reference distance** | [x] avoids M14/M22 weak shapes  [ ] partial  [ ] no |
| **Mimicry suspect** | [ ] yes  [x] no |
| **Summary** | Treatment adopts strong SP-03 structural cues (context selection, operational completion, multi-domain prompts, criteria bridge) but stays Photosynthesis-capstone-specific. It is not a Marx M16 transplant: domain objects, mechanisms, and wording are A6 ecological transfer content. |

---

## Pair Outcome

| Field | Value |
| ----- | ----- |
| **Baseline verdict** | Failed (under declared conjunctive interpretation) |
| **Treatment verdict** | Strong |
| **Paired delta** | Failed → Strong |
| **FM delta** | FM-02: unchanged (absent both) · FM-03: reduced (present → absent) |
| **M22 boundary flag** | [x] yes — boundary documented explicitly  [ ] no |

**Classification**

- [x] Improvement
- [ ] No Change
- [ ] Regression
- [ ] Inconclusive

**Justification:** Primary evidence under the declared §5.8 interpretation shows Failed → Strong on the same A6 transfer obligation. Baseline carries the M22 boundary profile (completion criterion present but no learner-context selection), so FM-03 is present. Treatment preserves completion criteria and adds explicit learner-context selection plus stronger transfer scaffolding, clearing FM-03 while keeping ownership intact. Detection signals corroborate this shift but remain secondary to contract verdict. Boundary ambiguity is documented rather than resolved globally.

**Per-output success (treatment):** [x] met  [ ] not met

---

## Reviewer Notes

- M22 boundary pair completed with explicit declaration of interpretation used: Inter-Rater conjunctive minimum.
- Baseline recorded as boundary profile: completion requirements present, learner-context selection absent, FM-03 present.
- Treatment removes boundary weakness by requiring learner-selected context while retaining operational completion and substantive transfer cues.
- Anti-mimicry check passed: treatment uses Photosynthesis capstone ecological contexts and A6 judgement framing, not Marx transfer content.
- Boundary ambiguity was documented in-pair only; no Sprint 44 calibration dispute reopened.

### Boundary Interpretation Note

- **Declared interpretation for this pair:** Inter-Rater conjunctive reading of §5.8 minimum (own-context + completion both required).
- **Reason for declaration:** Preserve learner-context selection requirement as instructed for Sprint 45 boundary handling.
- **Scope control:** This declaration is local to TP-PS-A6 evidence judgement and does not alter Sprint 44 historical records or cross-pair scoring already completed.

---

## Workbook Completion Checklist

Complete before drafting experiment recommendation.

- [ ] All 12 body texts recorded
- [ ] All 12 contract verdicts scored with §5.6 or §5.8 justification
- [ ] All Detection Signal checklists completed
- [ ] FM-04 / FM-02 / FM-03 recorded per body
- [ ] Ownership audits complete; ownership regression checked on all treatment bodies
- [ ] Corpus comparison completed per pair
- [ ] All 6 pair outcomes classified
- [ ] TP-PS-A6 M22 boundary interpretation declared
- [ ] Ready for [45-1-recommendation.md](45-1-recommendation.md) (from execution plan template)
