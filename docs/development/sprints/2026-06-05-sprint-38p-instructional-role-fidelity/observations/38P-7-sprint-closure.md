# 38P-7 — Sprint closure (Instructional Role Fidelity)

**Date:** 2026-06-06  
**Status:** **CLOSED — SUCCESS**  
**Type:** Sprint closure — documentation only  
**Authority:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md)  
**Proof evidence:** [38P-6-proof-run.md](38P-6-proof-run.md) · `artefacts/EV-38P-AFTER-*`

---

## Executive verdict

Sprint **38-P** is **CLOSED — SUCCESS**.

The sprint implemented **F1 — Registry-led hybrid** from 38O-4 and established **instructional role fidelity** as an independently provable dimension alongside body fidelity. Formal proof on **EV-38P-AFTER** confirms:

```text
proofOk: true  +  roleOk: true  =  fullOk: true
```

All charter success criteria pass. The 58-test regression suite is intact. No 38M or 38N guarantees were weakened.

---

## Evidence base reviewed

| Document | Role |
|----------|------|
| [38P-1-role-authority-architecture.md](38P-1-role-authority-architecture.md) | F1 architecture; metadata model; RF gate mapping |
| [38P-2-role-registry-implementation.md](38P-2-role-registry-implementation.md) | `lib/page-role-registry.js` — 20 role families |
| [38P-3-merge-supersession-implementation.md](38P-3-merge-supersession-implementation.md) | `material_role_index`; supersession tagging |
| [38P-4-render-role-precedence-implementation.md](38P-4-render-role-precedence-implementation.md) | Role-precedence render path |
| [38P-5-role-fidelity-validation.md](38P-5-role-fidelity-validation.md) | RF-1..RF-8; `roleOk` aggregator |
| [38P-6-proof-run.md](38P-6-proof-run.md) | EV-38P-AFTER formal proof |
| [38P-6A-gam-page-instructional-fidelity-investigation.md](38P-6A-gam-page-instructional-fidelity-investigation.md) | Causal trace; residual UX findings |
| [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) | Mission and SC-1..SC-11 |

---

## Phase outcomes summary

### 38P-1 — Role authority architecture

**Outcome:** F1 design complete. Established parallel **`material_role_index`** (Option B), mark-and-suppress supersession policy, registry-led render precedence, and additive **`roleOk`** validator — all without altering 38M body merge contract.

**Deliverable:** Architecture doc only (no code).

---

### 38P-2 — Role registry implementation

**Outcome:** Standalone **`lib/page-role-registry.js`** with 20 role families, GAM type/purpose rules, canonical key resolution, sequence weights, and alias groups. Extends — does not replace — existing 38M key mapping.

**Tests:** 16/16 registry tests pass.

---

### 38P-3 — Merge supersession

**Outcome:** Extended **`applyGamMaterialsToComposedPage`** to populate **`material_role_index`** per activity, tag compose stubs as **`authority: superseded`** / **`renderable: false`**, and set page metadata (`role_supersession_applied`, registry version). GAM bodies on canonical keys unchanged.

**Tests:** 11/11 supersession tests pass; 38M body fidelity preserved.

---

### 38P-4 — Render role precedence

**Outcome:** **`lib/page-role-render-sequencing.js`** + `app.js` integration. When `material_role_index` present, render emits **one block per role family** in registry sequence; suppresses superseded stubs and alias duplicates. Legacy path preserved when index absent.

**Tests:** 10/10 render precedence tests pass.

---

### 38P-5 — Role fidelity validation

**Outcome:** **`lib/page-role-fidelity.js`** implements **`validate38PRoleFidelity`** (RF-1..RF-8) and **`computeProofDimensions`** reporting **`proofOk`**, **`roleOk`**, and **`fullOk`** independently. Harness API exposed via `__PRISM_TEST_API`.

**Tests:** 11/11 role fidelity tests; cumulative **58/58** regression pass.

---

### 38P-6 — Proof run

**Outcome:** **`ev-38p-proof-replay.mjs`** replays EV-38M-AFTER through post-38P pipeline. **EV-38P-AFTER** captures dual-dimension pass:

| Dimension | Result |
|-----------|--------|
| proofOk | **true** |
| roleOk | **true** |
| fullOk | **true** |
| RF-1..RF-8 | **8/8 PASS** |

**38P-6A** (investigation, same sprint): confirmed remaining worksheet-oriented UX is upstream generation shape, not post-merge body/role loss on the merged path.

---

## Mission assessment

**Mission (charter):** Implement F1 (Registry-led hybrid) from 38O-4 and establish instructional role fidelity as an independently provable dimension alongside body fidelity.

| Mission element | Achieved? | Evidence |
|-----------------|-----------|----------|
| F1 registry-led hybrid | **Yes** | Registry → merge supersession → render precedence chain operational |
| Role authority on page model | **Yes** | `material_role_index` with authority/source/renderable flags |
| Independent `roleOk` dimension | **Yes** | `validate38PRoleFidelity`; orthogonal to `proofOk` |
| Additive to 38M/38N | **Yes** | EV-38P-AFTER proofOk unchanged vs EV-38N-AFTER |
| Formal proof | **Yes** | EV-38P-AFTER; all RF gates pass |

**Verdict:** **Mission achieved.**

---

## Charter success criteria

| Criterion | Result | Evidence |
|-----------|--------|----------|
| One authoritative role instance per role family | **PASS** | RF-1; 20 canonical / 20 families |
| No weak duplicate before authoritative role in render | **PASS** | RF-2; A4 stub suppression |
| Stable identity GAM → Page → Render | **PASS** | RF-3; registry key chain |
| No role inversion | **PASS** | RF-5 |
| **roleOk = true** | **PASS** | EV-38P-AFTER |
| **proofOk = true** | **PASS** | EV-38P-AFTER |
| **fullOk = true** | **PASS** | EV-38P-AFTER |
| 38M guarantees preserved | **PASS** | 100% GAM→Page ratios A1–A4; anti-synopsis/shell pass |
| 38N guarantees preserved | **PASS** | A3 render order unchanged; 38L regression pass |
| Regression suite intact | **PASS** | **58/58** |
| Proof replay successful | **PASS** | `ev-38p-proof-replay.mjs` exit 0 |

**All criteria: PASS**

---

## Key architectural outcomes

### Layered fidelity model (production)

```text
Body fidelity (38M/38N)  →  proofOk   — substantive GAM body at contract ratio
Role fidelity (38P)      →  roleOk    — one authoritative instance per role family
Full L4 fidelity         →  fullOk    — proofOk && roleOk
```

### Components delivered

| Component | Module / surface | Function |
|-----------|------------------|----------|
| **Role registry** | `lib/page-role-registry.js` | GAM type/purpose → role_family → canonical key → heading → sequence |
| **material_role_index** | `page-gam-materials-preserve.js` (merge) | Per-key authority metadata on activity rows |
| **Merge supersession** | `applyGamMaterialsToComposedPage` | GAM wins body + role; compose stubs marked superseded |
| **Render role precedence** | `lib/page-role-render-sequencing.js` + `app.js` | One render block per role family; registry sequence |
| **roleOk validation** | `lib/page-role-fidelity.js` | RF-1..RF-8 gates; diagnostics (`measureRoleFidelity`, etc.) |
| **Proof model** | `computeProofDimensions` | Independent proofOk + roleOk + fullOk reporting |

### Proof artefacts

| Run | proofOk | roleOk | Role |
|-----|---------|--------|------|
| EV-38M-AFTER (stored render) | true | false | Pre-38P baseline |
| EV-38N-AFTER | true | n/a | Body + A3 hardening |
| **EV-38P-AFTER** | **true** | **true** | Post-38P closure proof |

---

## Lessons learned

### Body fidelity ≠ role fidelity

38O discovery confirmed these dimensions are **orthogonal**. EV-38M-AFTER merged page JSON could carry full GAM bodies (`proofOk: true`) while render surfaced compose stubs first (`roleOk: false`). 38P closes this gap without reopening 38M.

### Additive proof dimensions scale cleanly

`computeProofDimensions` reports **`proofOk`** and **`roleOk`** independently. Extending L4 proof did not require rewriting 38M validators — a pattern reusable for future dimensions (e.g. episode depth scoring).

### Compose degradation vs merged-page preservation

Raw Design Page compose thins bodies (A4 pre-merge **7%** ratio). **38M merge restores 100%**. Role duplication was a **separate** failure mode addressed by 38P supersession + render precedence. Users inspecting compose-only artefacts will still see stubs — merged path is the authoritative learner view.

### Role authority as first-class concern

Instructional roles (worked judgement, guided table, transfer, consolidation) need explicit **authority** metadata, not implicit key-order iteration. Registry-led hybrid avoids prompt-only fixes that cannot suppress parallel compose keys.

### Worksheet orientation is upstream (38P-6A)

Post-38P proof passes **`fullOk: true`** while qualitative UX may still feel worksheet-oriented: DLA specifies table-completion tasks; GAM emits modular packages; `practice_table` renders as **“Worksheet”**. This is **instructional generation shape**, not fidelity preservation failure.

---

## Residuals

| Item | Classification | Notes |
|------|----------------|-------|
| Worksheet-oriented learner UX (table-first DLA/GAM) | **Future work** | 38P-6A; upstream episode design |
| Gap vs 38I-4 narrative episode depth | **Future work** | G4 generation shape; not L4 preservation |
| `practice_table` → “Worksheet” heading | **Non-blocking** | Presentation semantics; roleOk passes |
| RF-4 audit warnings on superseded keys retaining markers | **Non-blocking** | Expected; bodies retained for audit |
| A3/A4 `substantive: false` on marker phrasing variance | **Non-blocking** | 100% char ratios; GAM phrasing not omission |
| Raw compose-only path without merge | **Non-blocking** | Out of primary proof scope; RF-8 flags if used without index |
| Manual UI path skipping merge/render | **Future work** | 38P-6A recommends workflow audit |
| No blockers identified | — | All closure criteria met |

---

## Closure recommendation

### **CLOSE 38-P SUCCESS**

**Justification:**

- F1 registry-led hybrid fully implemented across registry, merge, render, and validation layers
- Formal proof **EV-38P-AFTER** passes **`proofOk`**, **`roleOk`**, and **`fullOk`**
- RF-1..RF-8 all pass; 58/58 regression tests pass
- 38M and 38N guarantees preserved
- Residuals are qualitative/upstream — none block L4 role fidelity closure

---

## Recommended next sprint

**Focus:** Instructional **depth and episode design** — not fidelity preservation.

Evidence from [38P-6A](38P-6A-gam-page-instructional-fidelity-investigation.md) and [38P-6](38P-6-proof-run.md):

- Post-38P pipeline preserves bodies and roles; remaining UX gap is **DLA → GAM generation architecture**
- 38I-4 A4 Evaluate episode defines target narrative shape not yet generated by modular GAM output

**Recommended programme direction:**

| Sprint theme | Scope (indicative) |
|--------------|-------------------|
| **Instructional episode depth** (38I continuation or successor) | DLA material specs: episode-shaped sequences vs table-completion-first |
| | GAM prompts: perspective blocks, criteria construction, integrated weak/strong exemplars |
| | Alignment to [38I-4 A4 episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) |
| **Presentation polish** (optional, lower priority) | Registry heading review for `practice_table` (“Analysis table” vs “Worksheet”) |

**Explicitly out of scope for next sprint:** Reopening 38M merge, 38N hardening, or 38P role machinery — all closed SUCCESS.

**Hold:** Continue requiring merged page + 38P render path for learner-facing output; treat stored pre-38P render artefacts as historical baseline only.

---

## Programme lineage (updated)

```text
38M — Body fidelity (merge contract, proofOk)           CLOSED SUCCESS
38N — Body-fidelity hardening                           CLOSED SUCCESS
38O — Role-fidelity discovery (F1 recommendation)     CLOSED SUCCESS
38P — Role-fidelity implementation (roleOk)             CLOSED SUCCESS  ← THIS SPRINT
Next — Instructional episode depth / 38I alignment      RECOMMENDED
```

---

## Code and test inventory (final)

| File | Phase |
|------|-------|
| `lib/page-role-registry.js` | 38P-2 |
| `lib/page-gam-materials-preserve.js` (supersession) | 38P-3 |
| `lib/page-role-render-sequencing.js` | 38P-4 |
| `lib/page-role-fidelity.js` | 38P-5 |
| `artefacts/ev-38p-proof-replay.mjs` | 38P-6 |
| `tests/page-38p-role-registry.test.js` | 16 tests |
| `tests/page-38p-role-supersession.test.js` | 11 tests |
| `tests/page-38p-render-role-precedence.test.js` | 10 tests |
| `tests/page-38p-role-fidelity.test.js` | 11 tests |
| `tests/page-38m-a3-sequencing.test.js` | 6 tests |
| `tests/page-38n-fidelity-hardening.test.js` | 4 tests |
| **Total regression** | **58/58 PASS** |

---

## Sign-off

| Field | Value |
|-------|-------|
| Sprint | 38-P Instructional Role Fidelity |
| Verdict | **CLOSED — SUCCESS** |
| Proof run | EV-38P-AFTER |
| Closure date | 2026-06-06 |
