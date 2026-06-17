# I5 Challenge Design Note — Candidate 1

**Extension:** Sprint 45.2 I5 Closure  
**Phase:** I5-0.1 — artefact preparation  
**Pair ID:** `I5-CH-01`  
**Pattern lens:** SP-02 (`decision_table`, §5.6, FM-04)  
**Domain:** Photosynthesis  
**Design authority:** [`45-2-i5-closure-repeat-scope-addendum.md`](../45-2-i5-closure-repeat-scope-addendum.md)  
**Status:** Artefacts drafted — I5-1 not authorised

**Non-goals:** Scoring · evaluation · agreement analysis · protocol amendment

---

## 1. Challenge purpose

Close inconclusive criterion **I5** by supplying an explicit **superficial-match-positive** paired challenge case for later blind E1 scoring under frozen protocol v1.0.

Sprint 45.2 recorded no `superficial_match = yes` observation in compared paired bodies. All Improvement treatments showed genuine Minimum → Strong verdict rises with substantive partial exemplars. This pair **inverts** that anatomy: treatment gains SP-02 **surface shape** without Layer 1 rise, so the frozen superficial-match guard and pair-level disqualifier path can be stress-tested.

---

## 2. SP-02 rationale

| Field | Value |
| ----- | ----- |
| **Pattern** | SP-02 — Partial-exemplar decision table |
| **Contract** | 44-2 §5.6 `decision_table` |
| **Target FM** | FM-04 — table shell without partial exemplar |
| **Strong benchmark** | Marx M13 — partial exemplar row demonstrating evidence-before-judgement move |
| **Minimum contrast** | Photosynthesis M12, M19 — proper grid, empty learner cells, no exemplar |

SP-02 is the correct lens because:

1. I5 was triggered on **paired** `decision_table` bodies where all treatments recorded `superficial_match_flag = no`.
2. Frozen L2 rule ties `superficial_match_flag = yes` to **paired context** when pattern-shaped features are present and verdict has not risen.
3. Pair Classification Step 3 disqualifier tests superficial match on **treatment Layer 2** before Improvement.
4. Photosynthesis claim tables are well-precedented in Sprint 45.2 (DT-PS-A4, HO-DT-01) without §5.8 boundary risk.

---

## 3. Obligation and scenario context

**Activity framing (structural context — not part of artefact body text):**

Learners evaluate two peer claims about plant biomass and photosynthesis site after a session on carbon fixation, chloroplast function, and common misconceptions.

| Row label | Supplied claim (scenario) |
| --------- | ------------------------- |
| **Student C** | "Nearly all of a plant's dry mass comes from water absorbed through the roots." |
| **Student D** | "Photosynthesis happens mainly in the roots, where the plant takes in water." |

**Differentiation from frozen artefacts:**

| Frozen artefact | Topic / structure | Overlap with I5-CH-01 |
| --------------- | ----------------- | ---------------------- |
| `BL-DT-PS-A4` / `TR-DT-PS-A4` | Student A/B; soil minerals as food; CO₂ fixation exemplar | **None** — different row labels, claims, and treatment content |
| `BL-DT-PS-A6` / `TR-DT-PS-A6` | Factor / Impact / Evidence grid | **None** — different table schema |
| `HO-DT-01` | Student A/B empty claim table (M12) | **None** — different row labels; I5 bodies are new text |

---

## 4. Expected superficial-match mechanism

| Layer | Baseline (`BL-I5-CH-01`) | Treatment (`TR-I5-CH-01`) |
| ----- | ------------------------ | --------------------------- |
| **L1** | Minimum — FM-04 shell | Minimum — token row does not demonstrate judgement move |
| **L2** | Minimum SP-02 profile | Strong-leaning SP-02 profile — partial exemplar row, Reason cell populated |
| **L3** | FM-04 present | FM-04 present (exemplar does not model evidence gathering) |
| **L4** | Ownership pass (empty learner cells) | Ownership pass (no pre-filled verdict column; Reason cell is modelled exemplar slot) |
| **L5** | No mimicry indicators | No mimicry indicators — novel text, not corpus copy |
| **`superficial_match_flag`** | n/a (baseline) | **yes** (expected on treatment) |

**Mechanism:** Treatment adds the **layout** of SP-02 (one partial exemplar row with a populated reasoning column) without the **instructional substance** required for §5.6 Strong or verdict rise. L2 reads pattern-shaped; L1 stays flat.

---

## 5. Intended Minimum → Minimum relationship

| Pair input | Expected value |
| ---------- | -------------- |
| Baseline verdict | Minimum |
| Treatment verdict | Minimum |
| Verdict delta | **None** (not strictly higher) |
| Target FM in treatment | FM-04 remains applicable — exemplar is token, not modelled evidence gathering |
| Pair classification (expected) | **No Change** |
| Improvement disqualifier | Superficial match should block any Improvement path if verdict were misread as risen |

Both bodies meet §5.6 **minimum** threshold: proper tabular structure, adequate row count, learner judgement cells empty on non-exemplar rows. Neither meets **strong** threshold: no row demonstrates the judgement move with substantive evidence-linked reasoning.

---

## 6. Expected Layer 2 shape difference

| SP-02 detection signal | BL | TR |
| ---------------------- | -- | -- |
| Proper grid with headers | yes | yes |
| Adequate row count (2 claims) | yes | yes |
| Empty learner-completion cells (non-exemplar rows) | yes | yes |
| Partial exemplar row present | **no** | **yes** |
| Reasoning column populated on exemplar row | **no** | **yes** (token content) |
| Reviewer can distinguish modelled vs learner-owned cells | weak | **yes** |
| FM-04 pattern (shell without exemplar) | **yes** | **no** (shape only) |

**Expected signal profiles:** BL = **minimum**; TR = **strong** or **strong-leaning** per frozen L2 checklist.

---

## 7. Artefact specifications

### BL-I5-CH-01

| Field | Value |
| ----- | ----- |
| **Artefact ID** | `BL-I5-CH-01` |
| **Pair** | `I5-CH-01` |
| **Condition** | Baseline |
| **Material type** | `decision_table` |
| **Body file** | [`artefacts/BL-I5-CH-01.txt`](artefacts/BL-I5-CH-01.txt) |
| **Design intent** | FM-04 table shell — M12-class empty claim grid |

### TR-I5-CH-01

| Field | Value |
| ----- | ----- |
| **Artefact ID** | `TR-I5-CH-01` |
| **Pair** | `I5-CH-01` |
| **Condition** | Treatment |
| **Material type** | `decision_table` |
| **Body file** | [`artefacts/TR-I5-CH-01.txt`](artefacts/TR-I5-CH-01.txt) |
| **Design intent** | Token partial-exemplar row on Student C — procedural Reason cell without biological mechanism |

---

## 8. Risks and controls

| Risk | Control |
| ---- | ------- |
| E1 does not credit token Reason as partial exemplar → `superficial_match` stays `no` | Design note documents intent; Reason cell is on exemplar row with distinct modelled vs learner cells; TR mirrors TR-DT-PS-A4 **structure** with inverted **substance** |
| E1 rates token row as Strong → verdict rise → F4 risk | Token text restates task only — no misconception identification, no biological principle, no scenario linkage (contrast TR-DT-PS-A4 substantive exemplar) |
| Overlap with frozen bodies confounds blind scoring | Student C/D labels; biomass/water/site misconceptions; distinct from A4 soil-food and A6 factor grid |
| Ownership confound (pre-filled learner verdict) | `Correct/Incorrect` column left empty on both bodies; only Reason cell populated on exemplar row per SP-02 partial-row convention |
| Mimicry confound | Original authored text; no verbatim M12/M13/M19 copy |
| §5.8 / B1 boundary required | Not applicable — `decision_table` §5.6 only |
| FM-02/FM-03 confound | Not applicable — wrong material type |

---

## 9. Mapping to I5 closure criteria

| I5 closure criterion (addendum §6.1) | How this design supports it |
| ------------------------------------ | --------------------------- |
| `superficial_match_flag = yes` on treatment | Token partial row + flat L1 — designed L2↑ / L1= split |
| L1–L5 complete on both bodies | Standard §5.6 grid; full layer recordability |
| Disqualifier path exercised | Paired structure enables Pair Classification Step 3 |
| Improvement not wrongly awarded | Minimum → Minimum → expected **No Change** |
| F4 not triggered | Treatment must not earn Improvement despite SP-02 L2 shape |
| Closure report can record **I5 closed** | If E1 behaviour matches design expectations |

---

## 10. Explicit design review

### Why BL should remain Minimum

- Proper `Claim | Correct/Incorrect | Reason` grid with two rows.
- All learner-completion cells empty.
- No partial exemplar row demonstrating any judgement move.
- Matches M12 / HO-DT-01 / BL-DT-PS-A4 shell pattern → §5.6 Minimum with **FM-04 present**.

### Why TR should remain Minimum

- Token Reason cell **restates the task** ("state whether the claim is correct… explain using ideas from the session") without:
  - identifying a specific misconception,
  - citing a biological mechanism (e.g. carbon from CO₂, chloroplast site, dry mass source),
  - linking to the supplied scenario claims.
- Does not satisfy §5.6 Strong: "partial exemplar row **demonstrating the judgement move**."
- Sprint 44 precedent: empty shell with no exemplar = Minimum (M12); substantive exemplar with mechanism = Strong (TR-DT-PS-A4). TR-I5-CH-01 sits below TR-DT-PS-A4 bar by design.

### Why TR should still appear SP-02-shaped

- One row (Student C) acts as partial exemplar: Reason column populated while Correct/Incorrect remains learner-owned.
- Reviewer can distinguish modelled row from empty Student D row.
- Removes FM-04 **at shape level** — table is no longer a pure shell.
- Matches SP-02 checklist: partial exemplar row, reasoning column prompt paired with empty judgement cell on that row.

### Why `superficial_match = yes` is expected

Frozen protocol: set flag when pattern-shaped features are present and verdict has **not** risen in paired context.

- **Pattern-shaped:** TR exhibits SP-02 L2 signals (partial exemplar row, populated reasoning cell).
- **Verdict not risen:** Both bodies expected Minimum.
- **Paired context:** Treatment compared to baseline — no strict verdict increase.
- Therefore E1 applying frozen rules correctly should record `superficial_match_flag = yes` on treatment and classify pair as **No Change**, not Improvement.

---

## 11. Readiness assessment

### Ready for I5-1 blind scoring?

| Gate | Status |
| ---- | ------ |
| Challenge design specified | [x] yes |
| Design note complete | [x] yes |
| `BL-I5-CH-01` body drafted | [x] yes |
| `TR-I5-CH-01` body drafted | [x] yes |
| Frozen artefact overlap check | [x] pass |
| Holdout overlap check | [x] pass |
| Boundary touchpoint required | [x] no |
| Ownership / mimicry confound review | [x] pass |
| **Addendum execution authorised** | [ ] **no** |
| **I5-1 scoring authorised** | [ ] **no** |

**Artefact readiness for I5-1 blind scoring:** **yes** — bodies and design note are complete and meet I5-0.1 requirements.

**Execution readiness for I5-1 blind scoring:** **no** — separate authorisation required per addendum §9 and sign-off checklist.

### Remaining risks

1. **L2 sensitivity:** E1 may treat token Reason as too weak to count as partial exemplar → I5 remains open after scoring (not failure-level).
2. **L1 overshoot:** E1 may read procedural Reason as sufficient for Strong → verdict rise → F4 failure-level risk; design note provides contrast anchor to TR-DT-PS-A4.
3. **Scenario adjacency:** Evaluator may request scenario text not in body; pair metadata and design note supply claim context; workbook obligation snapshot should be recorded at I5-1 start.
4. **Execution gate:** Artefacts prepared; I5 closure workbook and blind discipline not yet instantiated.

---

## 12. Authority chain

| Document | Role |
| -------- | ---- |
| [`45-2-i5-closure-repeat-scope-addendum.md`](../45-2-i5-closure-repeat-scope-addendum.md) | Scope authority |
| [`45-2-pattern-aware-evaluation-protocol.md`](../45-2-pattern-aware-evaluation-protocol.md) v1.0 | Scoring procedure (not applied in I5-0.1) |
| [`45-2-recommendation.md`](../45-2-recommendation.md) | Repeat 45.2 routing — unchanged |
| This note | I5-0.1 design authority for `I5-CH-01` |

---

## Sign-off (I5-0.1)

| Field | Value |
| ----- | ----- |
| Candidate selected | Candidate 1 — SP-02 Photosynthesis token partial-exemplar claim table |
| Artefacts drafted | 2026-06-17 |
| I5-1 authorised | [ ] yes  [x] no |
