# B4 programme closure review

**Date:** 2026-06-04  
**Reviewer scope:** Evidence synthesis only — no code, prompts, or implementation  
**Inputs:** [38B-4](38B-4-materials-and-table-fidelity.md) · [EV-38B4-03](EV-38B4-03-inflation-gam-evidence.md) · [EV-38B4-01](EV-38B4-01-design-page-evidence.md) · [EV-38B4-02](EV-38B4-02-table-preservation-analysis.md) · [38B-W2A](38B-W2A-GAM-authority-review.md) · [38B-6](38B-6-regression-validation-plan.md)

---

## 1. Recommendation

| Disposition | **MOVE TO MONITORING** |
|-------------|------------------------|
| **Not** | **CLOSE** — Wave 3 Inflation gate and L4 AUTO assertions remain unmet |
| **Not** | **KEEP OPEN** as a blocking programme regression — live evidence shows B4-01/B4-02 **not reproduced** under current stack |

**Rationale in one line:** Historical malformed-table regression is **no longer reproducible** on two 2026-06-04 live Inflation captures after Wave 1 + W2a authority work, but **formal closure** is premature without production Factory parity, AUTO L4 detectors, canonical page shape, and Wave 3 PREC gate evidence.

---

## 2. Original B4 evidence chain (reconstructed)

```text
Sprint 38 validation (2026-06-03+)
  → Placeholder materials partially fixed (materials fidelity block)
  → Table flattening remains: comma-rows + Headers/Rows prose (CONTEXT-FOR-NEXT-CHAT, 38B-4 §)
       ↓
38B planning (2026-06-04)
  → Case matrix B4-01..B4-06; good reference = ld-inflation-workshop-page-full.json (fixture)
  → Bad reference = user-validation Inflation rerun prose (no committed JSON artefact)
       ↓
Wave 1 (shared modules)
  → LD-TABLE-FIDELITY (PREC-01, FORBIDDEN comma-row / Headers+Rows)
  → LD-MATERIALS-COPY, LD-MATH-RENDER, LD-SELF-DIRECTED-RHETORIC
       ↓
Wave 2a (GAM pack trim PR-W2a-1)
  → Pack §6 delegates table/materials/rhetoric to LD-* modules; Facilitator use gated for self_directed
       ↓
Live evidence (2026-06-04)
  → EV-38B4-03: GAM pipes (L4-07 PASS)
  → EV-38B4-01/02: DLA→GAM→DP same run; DP preserves pipes (B4-01/02/03 PASS on JSON)
```

| Link | Evidence type | Committed artefact? |
|------|---------------|-------------------|
| Bad shapes origin | User / sprint validation narrative | **No** — prose in [38B-4 § observed bad shapes](38B-4-materials-and-table-fidelity.md) |
| Good upstream | Fixture audit | **Yes** — `tests/fixtures/page-render/ld-inflation-workshop-page-full.json` |
| Bad composed (CSV arrays) | Renderer probe fixture | **Yes** — `ld-inflation-workshop-csv-worksheet-page.json` (related P1, not identical to B4-01/02 prose) |
| Post-fix live | API captures | **Yes** — `fixtures/ev-38b4-01-design-page.json`, `ev-38b4-03-inflation-gam-live.txt`, pipeline GAM |

---

## 3. Evidence comparison

### 3.1 Historical failing artefacts

| Artefact | B4-01 comma-row | B4-02 Headers/Rows | Notes |
|----------|-----------------|-------------------|-------|
| 38B-4 prose (Inflation rerun) | **Present** (documented) | **Present** (documented) | Primary historical chain |
| `ld-inflation-workshop-csv-worksheet-page.json` | **Present** (array CSV) | No | Different failure class; P1 in [38B-6](38B-6-regression-validation-plan.md) |
| `ld-inflation-workshop-page-full.json` | **Absent** (pipes) | **Absent** | Golden **good** reference only |

### 3.2 EV-38B4-03 (GAM)

| Check | Result |
|-------|--------|
| Table materials | 4/4 pipe tables with separators |
| B4-01 / B4-02 | **PASS** |
| B4-03 | **PASS** |
| Prompt stack | **Partial** (~5,033 chars — not full self-directed GAM stack) |

### 3.3 EV-38B4-01 / EV-38B4-02 (Design Page, same run)

| Check | Result |
|-------|--------|
| `learning_activities[].materials.*` | A1–A4 table keys: **all pipes** |
| B4-01 / B4-02 in page JSON | **PASS** |
| B4-03 | **PASS** |
| GAM → DP degradation | **None** (D1–D5 not observed) |
| `section_id` canonical shape | **No** — `heading`-based sections |
| Renderer `<table>` in excerpt | **Inconclusive** |
| Design Page prompt | **Full** (~22,560 chars) |

### 3.4 Synthesis table

| Source | Malformed B4-01/02? | Trust weight |
|--------|---------------------|--------------|
| Historical narrative | **Yes** | High for *problem existed*; low for *still exists* |
| EV live pipeline | **No** | High for *current capture path* |
| Golden fixture | **No** | Reference only — not a live rerun |
| CSV worksheet fixture | CSV arrays (B4-related P1) | Synthetic bad **shape class** — not Headers/Rows |

---

## 4. Reproducibility of historical bad shapes

| Classification | Applicability |
|----------------|---------------|
| **Reproducible on demand** | **No** — two 2026-06-04 live runs did not produce comma-rows or Headers/Rows |
| **Partially reproducible** | **Yes** — via **synthetic** `ld-inflation-workshop-csv-worksheet-page.json` (array CSV, not prose Headers/Rows); historical **prose** shapes not re-fired |
| **Not reproducible (current stack)** | **Yes** — default conclusion for B4-01/B4-02 **prose** anti-patterns under documented capture conditions |

**Caveat:** Reproducibility was **not attempted** under pre–Wave 1 prompt snapshots or facilitated delivery — only **post–Wave 1/W2a** captures exist. Historical failure may have been **run-dependent** (token pressure, missing FORBIDDEN list, pack `Facilitator use` conflict, facilitated brief).

---

## 5. Wave 1 + W2a and root-cause plausibility

| Hypothesis (38B-4 ranked) | Addressed by W1/W2a? | Plausibility |
|---------------------------|----------------------|--------------|
| H1 Prompt length / compression | **Partially** — four-step sum −52.3%; GAM capture runner still showed partial stack | **Medium** — size helps; not sole cause |
| H2 Missing anti-pattern in contract | **Yes** — `LD-TABLE-FIDELITY` PREC-01 + FORBIDDEN list | **High** |
| H3 Ambiguous structured object → Headers/Rows | **Yes** — explicit ban + single named field | **High** |
| H4 Summarisation permission | **Partially** — PREC in module; DP materials fidelity | **Medium** |
| H5 No canonical pipe example on DP | **Partially** — GOOD example in module; Wave 3 compose contract pending | **Medium** |
| H6 Orphan `activity_materials` section | **Not triggered** in EV-38B4-01 (tables on activity rows) | **Low** for this capture |

**Conclusion:** Wave 1 + W2a changes **plausibly removed the primary root cause** (ambiguous + conflicting table instructions, no forbidden CSV/prose patterns). **Not proven** under **full** probe-equivalent GAM augmentation until production Factory confirms.

---

## 6. Uncertainty register

| ID | Uncertainty | Classification | Blocks formal CLOSE? |
|----|-------------|----------------|----------------------|
| U1 | No committed JSON of **historical** bad Inflation page | **Low risk** | No — prose + fixture matrix sufficient for monitoring |
| U2 | Live captures used **partial** GAM/DLA augmented stack (~5k) vs probe ~15k | **Medium risk** | **Yes** — need one full-stack Factory run |
| U3 | Design Page JSON used **`heading`** not `section_id` | **Medium risk** | **Yes** — for renderer / export parity |
| U4 | L4-04 / L4-05 / L4-06 **AUTO*** tests not implemented | **Blocking** (per [38B-6](38B-6-regression-validation-plan.md) P0 matrix + Wave 3 gate) | **Yes** |
| U5 | Wave 3 **Inflation gate** (PREC-01–04, B4-01–03 on live page) not executed in Factory | **Blocking** for sprint exit claiming L4 closed | **Yes** |
| U6 | Single model (`gpt-4.1-mini`), single temperature — no variance study | **Low risk** | No for MONITORING; yes for hard CLOSE |
| U7 | Renderer semantic table HTML not verified on live page | **Medium risk** | **Yes** for end-to-end CLOSE |
| U8 | B4-04 CI multi-table / B4 csv-worksheet paths not re-validated live | **Low risk** | No for B4-01/02 programme row |

---

## 7. Case-level disposition (recommended)

| Case | Was OPEN | New status | Evidence |
|------|----------|------------|----------|
| **B4-01** comma-row | Yes | **MONITORING** | Live PASS; historical **not reproduced** |
| **B4-02** Headers/Rows | Yes | **MONITORING** | Live PASS; historical **not reproduced** |
| **B4-03** partial table | PARTIAL | **MONITORING** → lean **PASS** on live | Both captures PASS |
| **B4-04** CI multi-table | PENDING | **OPEN** (out of scope for this review) | Unchanged |
| **B4-05** placeholder | MITIGATED | **MITIGATED** | Unchanged |
| **B4-06** table label | MITIGATED | **MITIGATED** | Unchanged |

**Programme row “Table flattening”:** **MONITORING** (was OPEN).

---

## 8. Why not CLOSE or KEEP OPEN?

### 8.1 Why not **CLOSE** now

| Gate | Status |
|------|--------|
| [38B-6](38B-6-regression-validation-plan.md) Wave 3 Inflation gate | Requires **B4-01–B4-03 PASS** on **production** path + PREC + L4-04–06 |
| L4-04–L4-06 AUTO* | **Not landed** — detectors TBD |
| Full GAM augmented stack on live run | **Not demonstrated** in EV captures |
| Canonical `section_id` page + render table HTML | **Not demonstrated** |
| Sprint 39 / programme exit | Still **gated** on 38B-6 implementation exit |

Closing B4 now would **overstate** evidence relative to the programme’s own Wave 3 gate.

### 8.2 Why not **KEEP OPEN** as blocking

| Fact | Implication |
|------|-------------|
| Two live Inflation pipelines **PASS** B4-01/02/03 on JSON | Active regression **not demonstrated** on current code path |
| Historical bad shapes **not reproduced** when attempted | Continuing “OPEN” overstates **current** defect rate |
| Wave 1 + W2a authority in place | Fix direction is **deployed**; remaining work is **verification + guardrails** |

Keeping B4 **OPEN** would block narrative progress despite **positive** live evidence.

### 8.3 Why **MONITORING** fits

| Property | MONITORING |
|----------|------------|
| Acknowledges fix direction | W1 modules + W2a pack are live |
| Acknowledges residual risk | Variance, AUTO tests, Factory gate, Wave 3 |
| Unblocks Wave 3 / 38B-6 work | B4 no longer a **silent** blocker if live reruns fail |
| Clear exit criteria | Listed below — promotes to **CLOSED** when met |

---

## 9. Minimum evidence required before formal **CLOSE**

All items required unless waived in writing by materials fidelity owner + programme lead.

| # | Evidence | Closes uncertainty |
|---|----------|-------------------|
| E1 | **Production Factory** Inflation self-directed rerun (DLA→GAM→DP) with probe-equivalent `wfSelfDirected` (GAM augmented **~15.8k**, DP **~27k** per [38B-1 probe](../scripts/probe-38b1-ld-workflow-prompt-audit.js)) | U2 |
| E2 | Committed **page JSON** with canonical `section_id` (`learning_activities`, optional `activity_materials`) | U3 |
| E3 | **L4-04, L4-05, L4-06** AUTO tests green on Inflation page fixture + live export | U4 |
| E4 | [38B-6](38B-6-regression-validation-plan.md) Wave 3 gate: **PREC-01–04 PASS**; **B4-01–B4-03 PASS** on that page | U5 |
| E5 | `utility-ld-inflation-page-render.test.js` (or equivalent) shows **semantic `<table>`** for ≥1 table field per activity with upstream pipes | U7 |
| E6 | Sign-off record: historical prose bad shapes classified **legacy / non-reproducible** OR reproduced once under documented pre-fix snapshot (if ever found) | U1, U6 |

**Optional accelerator (not substitute for E1–E5):** Pin historical bad JSON if a pre-38B export is discovered in archives.

---

## 10. Actions by role (post-review)

| Role | Action |
|------|--------|
| Programme lead | Accept **MONITORING** disposition; do not claim B4 **CLOSED** until §9 complete |
| Wave 3 owner | Proceed with [38B-3](38B-3-design-page-consolidation-plan.md); use EV-38B4-01 as **positive** preserve baseline |
| QA / validation | Prioritise L4-04–L4-06 AUTO* per [38B-6](38B-6-regression-validation-plan.md) §2 |
| Materials fidelity owner | Own E1–E6 checklist; approve promotion MONITORING → CLOSED |

---

## 11. Sign-off

| Item | Status |
|------|--------|
| B4 programme disposition | **MONITORING** (recommended) |
| B4-01 / B4-02 | **MONITORING** |
| B4-03 | **MONITORING** (live **PASS**) |
| Sprint 39 ungate via B4 alone | **No** — still depends on wider 38B-6 implementation exit |
| This review | Evidence-only — **2026-06-04** |

**Cross-reference:** Update [38B-4](38B-4-materials-and-table-fidelity.md) case matrix and regression summary to reflect this disposition.
