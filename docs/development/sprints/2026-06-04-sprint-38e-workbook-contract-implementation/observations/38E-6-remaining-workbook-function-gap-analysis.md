# Slice 38E-6 — Remaining workbook function gap analysis

**Date:** 2026-06-04  
**Status:** **COMPLETE**  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) § 38E-6  
**Authority:** [38D-1](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-1-dla-workbook-contract.md) · [38D-2](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-2-gam-workbook-genre-contract.md) · [38D-3](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-3-canonical-workbook-fixture.md) · [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md)  
**Evidence:** [38E-5](38E-5-inflation-after-scorecard.md) · [EV-38E5-AFTER-*](../artefacts/)  
**Out of scope:** Code · pack · prompt · implementation · pipeline re-run

---

## 1. Purpose

Explain **why Workbook FAIL remains** after [38E-2](38E-2-dla-contract-implementation.md) and [38E-3](38E-3-gam-contract-implementation.md), using **only** committed AFTER artefacts (`EV-38E5-AFTER`) — not pack text alone.

**Questions:** Where do worked-example and consolidation paths break? What is the smallest next implementation step?

---

## 2. Evidence set (read-only)

| Artefact | Role |
|----------|------|
| [EV-38E5-AFTER-dla-learning-activities.json](../artefacts/EV-38E5-AFTER-dla-learning-activities.json) | DLA output — `required_materials`, `delivery_notes` |
| [EV-38E5-AFTER-gam.txt](../artefacts/EV-38E5-AFTER-gam.txt) | GAM bodies — `Material: (type)` inventory |
| [EV-38E5-AFTER-design-page.json](../artefacts/EV-38E5-AFTER-design-page.json) | Composed `materials.*` |
| [EV-38E5-AFTER-render-excerpt.html](../artefacts/EV-38E5-AFTER-render-excerpt.html) | Learner-visible excerpt |
| [38E-5](38E-5-inflation-after-scorecard.md) | Verdicts: Workbook **FAIL**, Preservation **PASS** |

**Pack state (context only):** §5 DLA-WB and §6 GAM-WB enacted per 38E-2/38E-3 — this slice judges **manifestation in the capture**, not static pack coverage ([38E-4](38E-4-contract-regression-fixture-check.md)).

---

## 3. Worked example path

### 3.1 Did DLA request `worked_example`, `modelling_note`, or `sample_output`?

| Type / obligation | In AFTER DLA JSON? | Where |
|-------------------|-------------------|--------|
| **`sample_output`** | **No** | Not in any `required_materials[].type` |
| **`worked_example`** | **No** | Not in any `required_materials[].type` |
| **`modelling_note`** | **No** | Not in any `required_materials[].type` |
| **`reasoning_walkthrough`** | **No** | Not in any `required_materials[].type` |
| **`template` (worked sense)** | **Partial / wrong role** | A3 M7 ranking template; A4 M9 capstone plan template — neither spec requires **stepped expert completion** per [38D-1 DLA-WB-08](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-1-dla-workbook-contract.md) |

**A1** (opening teach): `text` + `classification_table` only — no modelling or sample path.

**Verdict on DLA request:** **[38D-1 DLA-WB-08](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-1-dla-workbook-contract.md) FAIL** on live JSON — pack §5 may state WB-08, but the **model output did not emit** a worked-example `required_materials` entry.

### 3.2 Did GAM receive them?

GAM input is the DLA JSON above. GAM received **no** `sample_output` / `worked_example` / `modelling_note` rows to realise.

### 3.3 Did GAM realise them?

| Check | Result |
|-------|--------|
| `Material: sample_output` | **Absent** in [EV-38E5-AFTER-gam.txt](../artefacts/EV-38E5-AFTER-gam.txt) |
| `Material: worked_example` | **Absent** |
| `Material: modelling_note` | **Absent** |
| Stepped expert example in `text` | **Absent** — A1 `text` is exposition only (~1.4k words), not a numbered worked solution |

**Verdict on GAM output:** **[38D-2 GAM-WB-02](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-2-gam-workbook-genre-contract.md) FAIL** (trigger: DLA-WB-08 — upstream trigger absent → clause not satisfiable via listed entries; session still lacks R5 body).

### 3.4 Exact break point (worked example)

```text
Pack DLA-WB-08 (prompt)  →  DLA model output  →  GAM model output  →  Page
        present                  FAIL here            N/A (no spec)        FAIL
```

**Primary break:** **DLA live output** — no `sample_output` / worked-purpose `template` in `required_materials`.

**Secondary (not reached):** GAM **GAM-WB-02** / **MIX-04** — would apply if DLA listed a worked spec; GAM instruction “realise every DLA entry” does not compensate for missing DLA row when model follows DLA as source of truth ([38D-2 §5.1](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-2-gam-workbook-genre-contract.md)).

**Design Page / render:** No worked-example keys in `materials` — consistent with GAM ceiling ([38C-2 §7.1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-2-workbook-gap-analysis.md)).

---

## 4. Consolidation path

### 4.1 Did DLA request consolidation / closure / `consolidation_summary`?

| Signal | In AFTER DLA? | Where |
|--------|---------------|--------|
| **`consolidation_requirement`** (metadata) | **Yes** | `delivery_notes.consolidation_requirement` — prose requirement for final synthesis |
| **`workbook_contract_applied`** | **Yes** | `delivery_notes` |
| **Final activity closure** | **Yes (weak type)** | A4 capstone; M10 `prompt_set` with purpose *“reflection and consolidation prompts”* |
| **`consolidation_summary` type** | **No** | Not in any `required_materials[].type` |
| **`checklist` / `retrieval_check`** (closure family) | **No** | Not in DLA types |

**Verdict on DLA ([38D-1 DLA-WB-12](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-1-dla-workbook-contract.md)):** **Pass (minimal)** — session metadata + final-activity closure **purpose** satisfy WB-12 **wording**; **does not** name the GAM token `consolidation_summary` that [38D-4 V-03](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) scores.

### 4.2 Did GAM receive them?

GAM received:

- `delivery_notes.consolidation_requirement` (in upstream JSON),
- A4 `template` (M9) + `prompt_set` (M10) with consolidation **purpose** label.

GAM did **not** receive a `required_materials` row of `type: consolidation_summary`.

### 4.3 Did GAM realise them?

| Check | Result |
|-------|--------|
| `Material: consolidation_summary` | **Absent** in GAM |
| A4 M10 | Realised as **`prompt_set`** (4 reflection questions, ~389 chars) — not ≥80-word summary |
| A4 M9 | Realised as **capstone `template`** (plan scaffold) — valid for [GAM-WB-07](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-2-gam-workbook-genre-contract.md), not consolidation |
| Page section “Consolidation and Reflection” | **Meta prose only** (~2 sentences) — not a `consolidation_summary` body in activity `materials` |

**Verdict on GAM ([38D-2 GAM-WB-06](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-2-gam-workbook-genre-contract.md)):** **FAIL** — trigger from DLA-WB-12 / `consolidation_requirement` **present**, but output is **`prompt_set` only** on capstone; explicit fail rule: *capstone prompt_set alone ≠ consolidation Pass* ([38D-2 GAM-WB-06](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-2-gam-workbook-genre-contract.md)).

### 4.4 Exact break point (consolidation)

```text
Pack DLA-WB-12 + delivery_notes  →  DLA types (prompt_set)  →  GAM  →  Page
         present                      weak token choice          FAIL here   FAIL
```

**Primary break:** **GAM live output** — did not author `consolidation_summary` despite session `consolidation_requirement`.

**Contributing DLA gap:** **Type token not specified** — closure mapped to `prompt_set` instead of `consolidation_summary` (38E-2 noted purpose→token mapping is GAM’s job, but DLA did not force the type).

**Contributing ambiguity:** **C** — WB-12 Pass at DLA layer vs V-03 Fail at GAM layer; model treats reflection prompts as consolidation.

---

## 5. Contract manifestation audit

| Function | 38C rule | DLA present? (AFTER JSON) | GAM obligation in pack? | Output present? (GAM/page) | Failure mode |
|----------|----------|---------------------------|-------------------------|----------------------------|--------------|
| **Worked example (R5)** | R5 · V-04 | **No** — WB-08 Fail | **Yes** — GAM-WB-02, MIX-04 | **No** | DLA never listed worked type → GAM had nothing to realise; MIX-04 never engaged |
| **Consolidation (R4)** | R4 · V-03 | **Partial** — metadata + reflection purpose; no `consolidation_summary` type | **Yes** — GAM-WB-06, MIX-03 | **No** — `prompt_set` only | DLA weak token + GAM substituted reflection for summary |
| **Closure family (V-01)** | ≥4 families | **Partial** — 3 families in spec/types | **Yes** — MIX-02 | **No** 4th family | Missing `consolidation_summary` / `checklist` in GAM |
| **Retrieval (R3)** | R3 · WB-11 | **Yes** — `prompt_set` on A2, A3, A4 | **Yes** — GAM-WB-05 | **Partial** — prompts only, no `checklist`/`retrieval_check` | Meets DLA-WB-11 minimally; below “Present” retrieval bar in [38E-5](38E-5-inflation-after-scorecard.md) |
| **Teaching (R1)** | R1 | **Yes** — A1 `text` | **Yes** — GAM-WB-01 | **Yes** | **Resolved** in 38-E |
| **Practice (R2)** | R2 | **Yes** | **Yes** | **Yes** | **Resolved** |
| **Transfer (R6)** | R6 | **Partial** — DLA fields on A3/A4 | **Yes** — GAM-WB-08 | **Partial** — capstone template | Not primary FAIL driver |
| **Session design (R7)** | R7 · V-08 | **Yes** — 65 min | **Yes** | **Yes** | **Resolved** |

**Comparison to [CW-REF-38D3](../../2026-06-04-sprint-38d-workbook-authoring-contracts/fixtures/canonical-workbook-reference-manifest.md):** Canonical PASS expects **`sample_output`** on teach activity and **`consolidation_summary`** on closure — both **absent** in AFTER.

---

## 6. Root cause classification

| Issue | Class | Evidence |
|-------|-------|----------|
| No `sample_output` / worked template in DLA JSON | **A. DLA specification weakness** (live) + **D. Model non-compliance** (vs pack WB-08) | A1 materials list; pack contains WB-08 |
| GAM did not invent worked example without DLA row | **C. Prompt ambiguity** | GAM: “Treat learning_activities as source of truth” vs defaultNotes “author worked_example” |
| No `consolidation_summary` in GAM | **B. GAM contract weakness** (enforcement) + **D. Model non-compliance** | `consolidation_requirement` set; GAM-WB-06 in pack; output is `prompt_set` |
| DLA used `prompt_set` for closure not `consolidation_summary` | **A. DLA specification weakness** | A4 M10 type choice |
| Reflection section on page without summary body | **E. Other** — Design Page composed only upstream keys; not a strip regression | Section text ≠ `consolidation_summary` material |
| Thin retrieval (no checklist) | **A** (optional) + **D** | WB-11 Pass on type count; R3 still Partial |

**Not causes (closed in 38-E):** Design Page stripping (**disproved**); table-only (**fixed**); B4 regression (**not observed**).

---

## 7. Severity ranking (highest impact first)

| Rank | Cause | Impact |
|------|-------|--------|
| **1** | DLA output omits **DLA-WB-08** worked `required_materials` | Blocks **V-04**, **R5**, **GAM-WB-02** — critical |
| **2** | GAM omits **`consolidation_summary`** despite `consolidation_requirement` | Blocks **V-03**, **R4**, 4th family **V-01** — critical |
| **3** | DLA maps closure to **`prompt_set`** not `consolidation_summary` | Enables rank-2; weak handoff to GAM |
| **4** | GAM “source of truth = DLA” precedence over session **GAM-WB-06** | Prevents pack-level consolidation without explicit DLA type |
| **5** | No **`checklist`/`retrieval_check`** | Keeps **R3** Partial — major, not sole FAIL |
| **6** | Single-run model variance | Unknown repeatability — minor for diagnosis |

---

## 8. Smallest viable fix (per root cause)

| Rank | Root cause | Surface | DLA / GAM | Prompt-only / runtime | Expected effect |
|------|------------|---------|-----------|----------------------|-----------------|
| **1** | WB-08 not in DLA JSON | `domain-learning-design-step-patterns.md` **§5** | **DLA** | **Prompt-only** | A1 (or A2) gains `required_materials: { type: sample_output, specification: stepped CPI/budget example }` |
| **2** | No consolidation_summary body | **§6** GAM-WB-06 + **§5** DLA type | **Both** | **Prompt-only** | GAM emits `Material: consolidation_summary` ≥80 words when `consolidation_requirement` set |
| **3** | Closure typed as prompt_set | **§5** Output schema / WB-12 | **DLA** | **Prompt-only** | A4 lists `type: consolidation_summary` (mandatory) alongside or instead of reflection-only `prompt_set` |
| **4** | DLA-truth vs session GAM-WB conflict | **§6** GAM-WB block | **GAM** | **Prompt-only** | Clause: if `delivery_notes.consolidation_requirement` → **must** author `consolidation_summary` even if DLA omits type |
| **5** | Retrieval Partial | **§5** WB-11 / **§6** GAM-WB-05 | **DLA** + **GAM** | **Prompt-only** | Add `checklist` on one mid-session activity |
| **6** | Brief gate / runtime | `app.js` DLA output contract | Runtime | **Only if pack fails second AFTER** | Force workbook fields in JSON schema — **not** first step per [38E-1](38E-1-implementation-target-audit.md) |

**Smallest single step:** **§5 DLA** — add one **`sample_output`** row on A1 and one **`consolidation_summary`** row on A4 in the **Output schema / mandatory examples** (not narrative block alone).

**Smallest pair for V-03 + V-04:** **DLA type rows** + **§6 GAM** one-line **MIX-03 / GAM-WB-06**: “`consolidation_requirement` without `consolidation_summary` Material = FAIL.”

---

## 9. Recommendation

**Choice: C — Strengthen both DLA and GAM**

| Option | Verdict | Evidence |
|--------|---------|----------|
| A. DLA only | Insufficient alone | GAM already had consolidation **trigger** via `delivery_notes` but still failed WB-06 |
| B. GAM only | Insufficient alone | GAM-WB-02 **N/A** without DLA `sample_output` row — “realise every entry” rule |
| **C. Both** | **Recommended** | Break points at **both** layers (§3.4, §4.4); rank 1–4 need §5 + §6 |
| D. Runtime required | **Defer** | Pack obligations exist; AFTER failure is **output shape**, not missing augmentation in `app.js` for this capture |

**Workbook vs preservation:** Fixes are **additive genres** — compatible with V-13 ([38E-5 §6](38E-5-inflation-after-scorecard.md)).

**Programme note:** User asked **not** to charter a new sprint here — implement as **continuation work** on the same pack surfaces 38E-2/38E-3 used, then re-run AFTER per [38E-5](38E-5-inflation-after-scorecard.md) harness.

---

## 10. Learner journey (residual)

| Stage | AFTER state | Gap |
|-------|-------------|-----|
| Teach | A1 exposition **Present** | No modelled solution path before practice |
| Model | **Absent** | No worked example |
| Practice | A2 scenario + tables **Present** | — |
| Evaluate | A3 task_cards + ranking **Present** | — |
| Check | **Partial** | Prompts, not checklist |
| Close | A4 plan + reflection prompts | No integrative **summary** genre |

Journey improved vs EV-01 but **fails** [38D-4 V-10](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) mandatory R4/R5.

---

## 11. Closure statement

| Criterion | Met? |
|-----------|------|
| Worked example failure path traced | **Yes** — break at **DLA output** (§3.4) |
| Consolidation failure path traced | **Yes** — break at **GAM output** + DLA type choice (§4.4) |
| Every missing workbook function audited | **Yes** — §5 table |
| Smallest next implementation step identified | **Yes** — §8 (DLA `sample_output` + `consolidation_summary` types; GAM-WB-06 enforcement) |
| Evidence-based recommendation | **Yes** — **C. Both**, prompt-only first |
| No implementation in this phase | **Yes** |
| Slice 38E-6 | **COMPLETE** |

**Feeds:** [38E-7](38E-7-sprint-closure.md) programme recommendation · any pack iteration before a second AFTER capture.
