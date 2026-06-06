# 38P-6 — Proof run (EV-38P-AFTER)

**Date:** 2026-06-06  
**Status:** **COMPLETE**  
**Type:** Proof and verification — no production code changes  
**Harness:** `artefacts/ev-38p-proof-replay.mjs` (38P-6)  
**Evidence run:** `EV-38P-AFTER`  
**Source capture:** `EV-38M-AFTER` (2026-06-05 inflation pipeline)  
**Predecessors:** [38P-5-role-fidelity-validation.md](38P-5-role-fidelity-validation.md) · [38P-6A-gam-page-instructional-fidelity-investigation.md](38P-6A-gam-page-instructional-fidelity-investigation.md) · [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md)

---

## Executive summary

Formal proof replay of the inflation workbook through the **post-38P pipeline** (38M merge → 38P supersession/index → 38P-4 role-precedence render → dual validation) **passes all proof dimensions**.

| Dimension | Result |
|-----------|--------|
| **proofOk** | **true** |
| **roleOk** | **true** |
| **fullOk** | **true** |
| **RF-1..RF-8** | **8/8 PASS** |
| **Regression suite** | **58/58 PASS** |
| **38M/38N guarantees** | **Preserved** |

**Closure recommendation:** **CLOSE 38-P SUCCESS** → proceed to **38P-7** sprint closure.

---

## Proof execution

### Command

```bash
node docs/development/sprints/2026-06-05-sprint-38p-instructional-role-fidelity/artefacts/ev-38p-proof-replay.mjs
```

### Replay path

```text
EV-38M-AFTER-gam.json
EV-38M-AFTER-design-page.json
  → applyGamMaterialsToComposedPage (38M + 38P-3 supersession / material_role_index)
  → applyA3MaterialsSequencingToComposedPage (38N A3 ordering)
  → buildUtilityStructuredHtmlForTest (38P-4 role-precedence render)
  → computeProofDimensionsForTest (proofOk + roleOk)
```

### Artefacts written

| File | Purpose |
|------|---------|
| `artefacts/EV-38P-AFTER-run-log.json` | Full proof report |
| `artefacts/EV-38P-AFTER-design-page.json` | Merged page with role index |
| `artefacts/EV-38P-AFTER-render.html` | Post-38P role-precedence render |
| `artefacts/EV-38P-AFTER-gam.json` | Upstream GAM (copied from 38M) |

**Captured at:** 2026-06-06T11:24:28.876Z

---

## Proof dimensions

| Field | Value | Evidence |
|-------|-------|----------|
| **proofOk** | **true** | `validation38M.ok` + `validation38LRegression.ok` |
| **roleOk** | **true** | `validation38P.ok`; all RF gates pass |
| **fullOk** | **true** | `proofOk && roleOk` |

### Baseline comparison

| Run | proofOk | roleOk | Notes |
|-----|---------|--------|-------|
| **EV-38M-AFTER** (stored render) | true | **false** | Pre-38P render; duplicate stub headings on A4 |
| **EV-38N-AFTER** | true | n/a | Body + A3 sequencing only |
| **EV-38P-AFTER** | **true** | **true** | Dual dimension pass |

`baselineComparison.proofOkUnchanged: true` — 38P additions did not regress 38N proofOk.

---

## RF gate report (RF-1..RF-8)

| Gate | Result | Supporting evidence | Metrics |
|------|--------|---------------------|---------|
| **RF-1** Role uniqueness | **PASS** | One canonical entry per role family across A1–A4; 0 unresolved orphans | 20 canonical / 20 role families; 0 unresolved |
| **RF-2** No weak-first render | **PASS** | No superseded stub headings precede canonical bodies in render HTML | A4: `modelling_note`, `decision_table`, `transfer_prompt` stubs suppressed |
| **RF-3** Stable role identity | **PASS** | Registry-compatible h4 headings on planned canonical keys | A4 canonical keys: scenario, worked judgement, guided table, template, checklist, consolidation, transfer |
| **RF-4** Pedagogical function | **PASS** | Evaluate-capstone semantic markers present on authoritative bodies | 6 audit-only warnings on superseded keys (non-blocking) |
| **RF-5** No role inversion | **PASS** | Consolidation body does not match learner-write inversion patterns | No RF-5 errors |
| **RF-6** Episode sequence | **PASS** | Render h4 order matches `buildRolePrecedenceRenderPlan` for evaluate archetype | A4 expected sequence aligned with registry weights |
| **RF-7** Body–role coherence | **PASS** | 38M ratio/marker thresholds met on canonical `material_id` keys | All A4 canonical materials at **100%** char ratio |
| **RF-8** Compose transparency | **PASS** | `material_role_index` populated; superseded entries reference `superseded_by` | 27 superseded / 20 canonical entries indexed |

### RF-4 audit warnings (non-failing)

Superseded compose keys retain marker text on page JSON (expected — bodies not deleted, only render-suppressed):

- `scenario`, `modelling_note`, `decision_table`, `transfer_prompt`, `worked_example`, `scenarios` on A4

These are **audit-only** warnings; gate **passes** because authoritative canonical bodies carry required markers.

---

## 38M and 38N proof dimensions (unchanged)

| Dimension | EV-38N-AFTER | EV-38P-AFTER | Status |
|-----------|--------------|--------------|--------|
| **GAM→Page body ratios (aggregate)** | A1–A4 **100%** | A1–A4 **100%** | **Unchanged** |
| **Anti-synopsis protection** | pass | pass | **Unchanged** |
| **Anti-table-shell protection** | pass | pass | **Unchanged** |
| **A3 render-order (materials_order)** | pass | pass | **Unchanged** |
| **38L page preserve regression** | pass | pass | **Unchanged** |

### Aggregate GAM→Page ratios

| Activity | Materials | Aggregate ratio |
|----------|-----------|-----------------|
| A1 | 4 | **100%** |
| A2 | 4 | **100%** |
| A3 | 4 | **100%** |
| A4 | 8 | **100%** |

### A3 render positions (38N R2)

| Key | Char position |
|-----|---------------|
| `worked_analytic_pass` | 2726 |
| `analysis_table` | 4597 |
| `scenario_maya_households` | 5553 |
| `checklist` | 6530 |

Matches **EV-38N-AFTER** ordering — worked pass precedes table and checklist.

### Substantive marker variance (known 38M residual)

A3 scenario / analytic pass and some A4 rows report `substantive: false` due to **marker phrasing variance in GAM** (not body omission). Char ratios remain **100%** — consistent with 38P-6A investigation finding G4 (generation shape) vs G2/G3 (compose loss).

---

## Regression suite

```bash
node --test tests/page-38p-role-fidelity.test.js \
  tests/page-38p-render-role-precedence.test.js \
  tests/page-38p-role-supersession.test.js \
  tests/page-38p-role-registry.test.js \
  tests/page-38m-a3-sequencing.test.js \
  tests/page-38n-fidelity-hardening.test.js
```

| Suite | Tests | Result |
|-------|-------|--------|
| `page-38p-role-fidelity.test.js` | 11 | **PASS** |
| `page-38p-render-role-precedence.test.js` | 10 | **PASS** |
| `page-38p-role-supersession.test.js` | 11 | **PASS** |
| `page-38p-role-registry.test.js` | 16 | **PASS** |
| `page-38m-a3-sequencing.test.js` | 6 | **PASS** |
| `page-38n-fidelity-hardening.test.js` | 4 | **PASS** |
| **Total** | **58** | **58/58 PASS** |

---

## Sprint 38-P success criteria assessment

| Criterion | Charter ID | Result | Evidence |
|-----------|------------|--------|----------|
| One authoritative role instance per role family | SC-1 / RF-1 | **PASS** | 20 canonical families; RF-1 pass |
| No weak duplicate before authoritative role in render | SC-2 / RF-2 | **PASS** | A4 stub suppression verified; RF-2 pass |
| Stable identity GAM → Page → Render | SC-3 / RF-3 | **PASS** | Registry keys → canonical page keys → render headings |
| No role inversion | SC-4 / RF-5 | **PASS** | RF-5 pass |
| Pedagogical function markers on authoritative body | SC-5 / RF-4 | **PASS** | RF-4 pass on canonical instances |
| A4 episode sequence alignment | SC-6 / RF-6 | **PASS** | RF-6 pass; registry evaluate sequence |
| Body fidelity on authoritative instance ≥ 38M tier | SC-7 / RF-7 | **PASS** | 100% ratios on all canonical materials |
| Compose vs GAM authority auditable | SC-8 / RF-8 | **PASS** | `material_role_index` + 27 superseded entries |
| `roleOk: true` on EV-38P-AFTER | SC-9 | **PASS** | `roleOk: true` |
| `proofOk: true` — no 38M/38N regression | SC-10 | **PASS** | `proofOk: true`; baseline unchanged |
| Regression suite passes | SC-11 | **PASS** | 58/58 |

**All 11 charter success criteria: PASS**

---

## A4 capstone — pre-38P failure cases resolved

Cases from IMPLEMENTATION-CHARTER that **failed** on stored `EV-38M-AFTER-render.html` and **pass** on `EV-38P-AFTER`:

| Pre-38P failure | Post-38P status |
|-----------------|-----------------|
| `Modelling Note` stub precedes full worked judgement | **Resolved** — stub suppressed; canonical `worked_judgement_weak_strong` only |
| `Decision Table` shell precedes guided table | **Resolved** — shell suppressed; canonical `guided_judgement_table` only |
| `Transfer Prompt` stub precedes evaluate transfer | **Resolved** — stub suppressed; canonical `transfer_prompt_evaluate` only |
| Duplicate weak+strong pairs from alias keys | **Resolved** — RF-1/RF-2 pass; no duplicate authoritative families |

---

## Role coverage summary (A4 evaluate)

| Role family | Canonical key | Superseded aliases |
|-------------|---------------|-------------------|
| scenario | `scenario_maya_households` | `scenario`, `scenarios` |
| worked_judgement_support | `worked_judgement_weak_strong` | `modelling_note`, `worked_example` |
| guided_judgement_table | `guided_judgement_table` | `decision_table` |
| independent_template | `independent_judgement_template` | `template` |
| transfer_prompt | `transfer_prompt_evaluate` | `transfer_prompt` |
| verification_checklist | `checklist_evaluate` | `checklist`, `verification_checklist`, `evaluation_checklist` |
| consolidation_summary | `consolidation_summary` | — |
| explanatory_guidance | `criteria_exposition_evaluate` | `criteria_text`, `concept_exposition` |

---

## Residual notes (out of 38P scope)

| Item | Status |
|------|--------|
| Worksheet-oriented UX (`practice_table` → “Worksheet” heading) | **Qualitative** — not a roleOk failure; see [38P-6A](38P-6A-gam-page-instructional-fidelity-investigation.md) |
| 38I-4 narrative episode depth vs modular GAM | **Upstream generation** — G4; not 38P proof scope |
| RF-4 warnings on superseded key marker carry-over | **Audit-only** — non-blocking |

---

## Closure recommendation

### **CLOSE 38-P SUCCESS**

All formal proof criteria met:

- `proofOk: true` + `roleOk: true` + `fullOk: true` on **EV-38P-AFTER**
- RF-1..RF-8 all pass
- 38M/38N body and sequencing guarantees preserved
- 58/58 regression tests pass

**Next phase:** **38P-7** — sprint closure record (`observations/38P-7-sprint-closure.md`).

---

## References

| Document | Role |
|----------|------|
| [38P-5-role-fidelity-validation.md](38P-5-role-fidelity-validation.md) | RF gate definitions |
| [38P-6A-gam-page-instructional-fidelity-investigation.md](38P-6A-gam-page-instructional-fidelity-investigation.md) | Causal context; predicted dual pass |
| [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) | Success criteria SC-1..SC-11 |
| `artefacts/EV-38P-AFTER-run-log.json` | Machine-readable proof evidence |
