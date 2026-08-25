# S78-T-049 — First-pass generation validation reliability diagnostic

**Task:** S78-T-049  
**Status:** **DIAGNOSTIC COMPLETE** (2026-08-25)  
**Mode:** DIAGNOSTIC ONLY — **no production code changes**  
**Sprint 78:** OPEN · **T-013:** remains OPEN  

**Related:** [S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification) · [S78-T-008](S78-T-008-candidate-1-a4-evidence-diagnostic.md) · [S78-T-009](S78-T-009-dla-p02-provider-row-output-shape-salience-repair.md) · [S78-T-015](S78-T-015-gam-operational-suitability-authoring-salience-implementation.md) · [S78-T-016](S78-T-016-operational-suitability-stage-2-enforcement-design.md)  

**Parked:** learner-workspace / interactivity redesign.

---

## Interpretation (settled)

Validators in all three specimens blocked **genuinely inconsistent** artefacts. Retries from the **same** upstream commission succeeded. This is a **generation-reliability** problem, not validator over-sensitivity. Do **not** weaken validators.

---

## 1. Specimen evidence table

| Specimen | Stage | Failure class | Enforced invariant | Present in generation prompt? | Salience | Likely earliest divergence | Canonical owner | Proposed hardening |
| -------- | ----- | ------------- | ------------------ | ----------------------------- | -------- | -------------------------- | --------------- | ------------------ |
| **1** Lagrangian A1-M1 conceptual | GAM → OPS-2 review | Pedagogical-role contradiction (intended unconstrained contrast carries a non-negativity restriction) | Load-bearing particulars must remain usable for the commissioned classify/contrast operation; do not invent constraints the commission omits | **Partially** — Case 1 + S78-OPS authoring: mutual consistency / no invented pedagogical constraints; **no** explicit “preserve intended case classification status” check | Medium / indirect | **D** (GAM emit) — soft constraint-invention rule ignored while filling “realistic” particulars | GAM authoring brief + OPS block | Compact **silent** pre-emit role/status check for contrast/classification cases |
| **2** Lagrangian A5-M1 quantitative | GAM → OPS-2 review | Quantitative contradiction (`λ=4` inconsistent with FOCs / constraint) | When a determinate result is commissioned, particulars must be mutually consistent and sufficient (no contradictory numbers) | **Yes** — Case 1 + S78-OPS “mutually consistent… do not emit contradictory… determinate result” | Present but **not operationalised** as “recompute / verify equations before emit” | **D** (GAM emit) — invents numbers that fail internal consistency | GAM authoring + OPS block | Compact **silent** pre-emit quantitative consistency check (domain-general) |
| **3** Hydrology DLA A5-M5 | DLA capture | Structural P02 inconsistency (`provider_material_ids` names A5-M5 without `evidence_requirement`) | Every `provider_material_id` row must carry complete `evidence_requirement` (and ⊆ task inputs when `required: true`) | **Yes** — §7 attach rule + §10 P02 invariant + pre-output checklist item 1 (T-009) | Explicit but **diluted** among 6 checklist items + large §10 | **D** (DLA emit) — known residual stochastic class post–T-009 (same as T-008 C1) | DLA output contract + capture validator (backstop) | Elevate **P02-only** final emit gate (silent verify); keep `validateEvidenceDecisionClosure` |

**Classification key:** A = already in authorised upstream · B = commission/spec · C = prompt assembly · D = model emit · E = cannot determine.

---

## 2. DLA evidence-provider invariant trace

### Canonical invariant (from schema/validator)

From `validateEvidenceDecisionClosure` (`lib/page-dla-enrich.js`):

When `evidence_decision.required === true`:

1. `provider_material_ids` non-empty  
2. Each id exists on a `required_materials[]` row  
3. That row **must include** `evidence_requirement`  
4. Each provider id ∈ `task_material_decision.task_input_material_ids`  

When `required === false`: empty providers; no `evidence_requirement` rows.

Transfer / other material types are not special-cased — **any** listed provider id must carry the provider contract.

### Generation surfaces

| Surface | Content |
| ------- | ------- |
| §7 Evidence | Attach `evidence_requirement` when `required: true` |
| §8 Providers | Field shape |
| §10 Output (T-009) | Normative P02 closure + **Pre-output deterministic capture checks** item 1 |
| Capture | Fail-closed validator (final backstop) |

### Specimen 3 reading

Invariant is **already explicit** in the live DLA contract (post–T-009). Hydrology A5-M5 is the **same failure class** as Lagrangian T-008 Candidate 1 after salience repair — **stochastic non-compliance** against a known checklist item, not a missing rule.

**Salience issue:** P02 is item **1 of 6** in a pre-output list that also covers WS-1/WS-2/WS-3 closures, sitting inside a very large §10 amid many other obligations. Distance from “emit JSON” and competition with other checklist items likely reduce compliance.

**Owner:** DLA generation contract + live prompt (strengthen emit-gate salience). Validator remains final backstop. Not GAM. Not capture-only.

---

## 3. GAM conceptual-consistency invariant trace (Specimen 1)

### What caught it

S78-OPS-2 operational suitability **review** (`gam-operational-suitability-review.js`) — Stage-2 temporary instrumentation ([S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification)). Failure reason is semantic (`failure_class: contradiction` / review narrative), not a deterministic schema check.

### What generation already says

| Surface | Relevant language |
| ------- | ----------------- |
| `buildGamV2CopyMaterialAuthoringBrief` Case 1 | Enough coherent particulars; no contradictory/underdetermined particulars for determinate results; **do not invent pedagogical constraints the commission omits** |
| `S78-OPERATIONAL-SUITABILITY` (T-015) | Mutually consistent and sufficient; per-material obligations |
| GAM enrich contract | Pointer to OPS when injected |

### Gap

There is **no high-salience explicit check** that generated cases preserve the **intended pedagogical status** of the commission (e.g. unconstrained contrast must remain unconstrained; positive/negative exemplars must keep their polarity).

“Do not invent pedagogical constraints” is present but **indirect** relative to classification/contrast commissions — easy to violate while “improving” realism (e.g. adding \(a \ge 0\)).

**Earliest divergence:** GAM material authoring emit (**D**), assuming DLA correctly commissioned an unconstrained contrast.

**Generalises:** any discipline with contrast cases, counterexamples, or polarity-sensitive exemplars.

---

## 4. GAM quantitative-consistency invariant trace (Specimen 2)

### What caught it

Same OPS-2 review path; `failure_class: "contradiction"` with FOC/constraint inconsistency diagnosis.

### What generation already says

Case 1 + S78-OPS already require mutual consistency and forbid contradictory particulars when a determinate result is required.

### Gap

No compact **operational** pre-emit instruction equivalent to: silently recompute / verify that claimed multipliers, solutions, and constraint satisfaction agree with stated equations **before** emitting bodies.

Absent that, the model can emit internally inconsistent numerics that only a second-pass reviewer catches — exactly Specimen 2.

**Earliest divergence:** GAM emit (**D**).

**Generalises:** any quantitative worked example, answer-bearing scenario, or diagnostic reference values — not Lagrangian-specific.

---

## 5. Existing generation protections

| Protection | Stage | Covers specimens? |
| ---------- | ----- | ----------------- |
| DLA §7/§10 P02 + pre-output checklist (T-009) | DLA | Specimen 3 — **present**, residual non-compliance |
| DLA `validateEvidenceDecisionClosure` | Capture | Specimen 3 — **correct backstop** |
| GAM Case 1 + S78-OPS authoring (T-015) | GAM | Specimens 1–2 — **partial** |
| GAM OPS-2 review (T-016–T-018) | Post-GAM | Specimens 1–2 — **correct temporary backstop** |
| S78-D02 | Policy | Verifier temporary; first-pass quality is the goal |

---

## 6. Existing validator protections

| Validator | Correct? | Generation gap? |
| --------- | -------- | --------------- |
| `validateEvidenceDecisionClosure` | **Yes** — exact Specimen 3 message | Rule already in DLA prompt; emit still fails sometimes |
| OPS-2 review shape + suitable gate | **Yes** — enforces commission-relative usability | Semantic/quantitative inventiveness still escapes Stage-1 |

Do **not** move final validation solely into the model. Optional: keep final validators; add **silent** pre-emit checks so fewer artefacts hit the backstop.

Targeted regen UX (material-scoped) is desirable later — **out of scope** here.

---

## 7. Earliest divergence (summary)

| Specimen | Earliest divergence |
| -------- | ------------------- |
| 1 Conceptual | GAM particulars invent uncommissioned constraint (**D**) |
| 2 Quantitative | GAM numerics fail internal consistency (**D**) |
| 3 Structural P02 | DLA lists provider without `evidence_requirement` (**D**) despite T-009 checklist |

Upstream commissions were adequate enough that **retry succeeded unchanged**.

---

## 8. Shared-pattern analysis

Common theme: **local consistency between related fields/particulars** before emit.

They do **not** collapse cleanly into one shared DLA+GAM block:

| Class | Nature |
| ----- | ------ |
| DLA P02 | Deterministic **structural** id↔field closure |
| GAM conceptual | **Semantic** role/status of exemplars |
| GAM quantitative | **Arithmetic/equation** consistency |

One mega “consistency pass” block would either be vague (low effect) or huge (dilution). Prefer **two small high-salience hardenings** with silent verify-before-emit discipline.

---

## 9. Prompt-salience findings

- DLA: P02 is explicit but buried in a multi-item checklist inside a very large output section.  
- GAM: consistency language is global / mid-prompt; no final silent verification gate adjacent to material emission.  
- Competing instructions (WS-1/2/3, SP patterns, disciplinary warrant, independence) increase dilution risk.  
- DLA already has a pre-output checklist; GAM does **not** have an equivalent silent pre-emit consistency checklist.  
- Any new check must demand **silent correction before emission** — no chain-of-thought dump.

---

## 10. Is pre-output verification appropriate?

**Yes, selectively:**

- DLA: tighten **existing** silent structural checklist salience (P02), do not invent a second philosophy.  
- GAM: add a **new compact** silent conceptual+quantitative consistency gate at emit.  

Validators remain final backstops. Do not ask models to output reasoning traces.

---

## 11. Recommended canonical owners

| Invariant | Owner |
| --------- | ----- |
| P02 provider ↔ `evidence_requirement` | DLA output contract / live prompt; capture validator backstop |
| Exemplar pedagogical status / no invented constraints | GAM Case 1 / S78-OPS authoring; OPS-2 review backstop (temporary) |
| Quantitative mutual consistency | GAM Case 1 / S78-OPS authoring; OPS-2 review backstop (temporary) |

---

## 12. Smallest proposed hardening (design only — do not implement here)

### Task proposal A — DLA structural emit-gate (small)

- Add one ultra-short **final** silent line immediately before JSON return, e.g. restate P02 alone (not a sixth copy of the whole checklist).  
- Optionally trim/reorder so P02 is last structural check before emit.  
- Live-path regressions: contract text asserts final P02 gate; existing P02 validator tests unchanged.

### Task proposal B — GAM silent consistency gate (small)

- Compact pre-emit block (OPS or Case 1 adjacent):  
  1. **Role/status:** particulars must not flip commissioned classification/contrast polarity or invent constraints the commission omits.  
  2. **Quantitative:** for answer-bearing / worked / diagnostic numbers, silently verify equations, constraints, and claimed values agree; correct before emit.  
- Domain-general wording only.  
- Live-path regressions: OPS/Case 1 prompt tests; cross-disciplinary fixture; do not encode Lagrangian FOCs.

**Do not** combine A+B into one shared DLA/GAM paragraph.

---

## 13. Required live-path regressions (for future impl)

1. DLA assembled contract still contains P02 normative text + silent verify language near emit.  
2. DLA capture still fails closed on missing `evidence_requirement` (unchanged).  
3. GAM Copy brief / OPS block contains role-status + quantitative silent-check lines.  
4. No Hydrology-/Lagrangian-specific production strings.  
5. Existing T-009 / T-015 / OPS-2 tests remain green.  
6. Optional: fixture where unconstrained commission language is preserved in authoring block presence (prompt text only).

---

## 14. Recommended first-pass reliability benchmark metric

Lightweight operator recording convention (no telemetry build):

| Field | Values |
| ----- | ------ |
| Run id / date / topic | free text |
| DLA first-pass validation | PASS / FAIL (+ error code/message if FAIL) |
| DLA regen attempts to PASS | integer ≥ 0 |
| GAM first-pass OPS-2 / verification | PASS / FAIL (+ `failure_class` if FAIL) |
| GAM regen attempts to PASS | integer ≥ 0 |
| Eventual validation | PASS / FAIL |
| Final learner-resource QA uncapped | number or N/A |
| Notes | optional class tags: `p02_structure` / `gam_role` / `gam_quantity` |

Track **first-pass rates** separately from eventual QA score (quality can be high after regen while reliability stays weak).

---

## 15. Decision → **C**

**C. Implement separate small DLA structural-consistency and GAM semantic/quantitative-consistency hardenings.**

| Rejected | Why |
| -------- | --- |
| A (gather more) | Three clear specimens + T-008/T-015 history already identify the classes |
| B (one shared block) | Structural ≠ semantic/quantitative; shared prose would dilute |
| D (irreducible only) | Invariants exist but are incomplete/diluted; targeted silent gates are still warranted — residual stochastic risk remains, but hardening is not futile |

---

## 16. Files inspected

- `lib/page-dla-enrich.js` (`validateEvidenceDecisionClosure`)  
- `lib/ld-dla-page-enrich-contract.js` (§7/§10 P02 + checklist)  
- `lib/ld-gam-page-enrich-contract.js`  
- `lib/gam-operational-suitability-prompt.js`  
- `lib/gam-operational-suitability-review.js`  
- `app.js` (`buildGamV2CopyMaterialAuthoringBrief` Case 1)  
- Prior records: T-008, T-009, T-014/T-015/T-016, S78-D02, STATUS  

Operator specimens 1–3 treated as authoritative (not all deposited as JSON).

---

## 17. Files changed (docs only)

- This record: `S78-T-049-first-pass-generation-validation-reliability-diagnostic.md`  
- Minimal sprint navigation: STATUS, HANDOVER, PLAN, SPRINT-78-START-HERE, next-chat-briefing  

**Production code:** unchanged.

---

## 18. Unresolved risks

- Even with better gates, residual stochastic non-compliance will remain; OPS-2 may still be needed until evidence supports removal ([S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification)).  
- Overlong silent checklists recreate dilution (especially if merged with WS-3/DR-1 items).  
- Quantitative silent checks must not demand visible chain-of-thought or domain solvers.  
- Specimen 1 may also reflect weak DLA specification of “unconstrained” — still treat GAM role-preservation as the primary harden; optional later DLA commissioning clarity if more exhibits appear.

---

## 19. Sprint state

**Sprint 78:** OPEN  
**T-013:** OPEN (first-pass reliability remains the open reliability signal)  
**T-049:** diagnostic complete — recommend **C** (separate DLA P02 emit-gate + GAM silent consistency gate)  
**Learner-workspace/interactivity:** PARKED  
**Image T-047/T-048:** complete; do not reopen here  
