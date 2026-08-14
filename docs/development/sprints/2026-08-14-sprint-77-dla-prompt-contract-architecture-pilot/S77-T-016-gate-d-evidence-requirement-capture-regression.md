# S77-T-016 — Gate D interruption: evidence_requirement capture regression

**Status:** **COMPLETE** (2026-08-14) — migration gap **repaired**; corrected DLA capture confirmed in [T-017](S77-T-017-dla-canonical-architecture-lagrangian-gate-d.md) (Gate D **PASS**)  
**Depends on:** [T-015](S77-T-015-dla-canonical-architecture-phase-c-atomic-switch.md)  
**Live contract after repair:** `77-DLA-CANONICAL-2`

---

## Gate D interruption record

| Event | Result |
| ----- | ------ |
| Fresh Lagrangian EP | Generated (operator): five one-to-one activities A1–A5 / LO1–LO5 |
| DLA generation | Attempted |
| DLA capture | **FAILED** |
| Validator errors | `activities[3].required_materials[0].evidence_requirement.kind must be "learner_evidence"`; same path `.purpose required`; same pair on `activities[4]` (A4, A5) |
| GAM | **NOT RUN** |
| QA | **NOT RUN** |
| Gate D | **BLOCKED / INTERRUPTED — awaiting corrected DLA rerun** |

Not a semantic Gate D fail of P02. Capture failed on **structural** `evidence_requirement` children.

---

## Classification

**A — canonical prompt migration omission.**

Sprint 76 **shape** listed validator-required `kind` and `purpose`. Canonical §8 copied legacy **prose** (learner_action / observable_features / provenance / layout / disclosure) but dropped those two required children. Canonical §11 miniature omitted them. §10 named the object only.

Validator/schema **unchanged** and correct (not B). Model followed the incomplete canonical example (not C as primary). Sprint 72 **semantic** provider rules remained in §8.

**P02 semantic regression:** **NO**  
**Sprint 72 semantic regression:** **NO**

---

## Field comparison — `required_materials[].evidence_requirement`

Source of validator truth: `validateEvidenceRequirementShape` in `lib/page-dla-enrich.js` (GAM twin in `lib/page-gam-enrich.js` — not changed).

| Field | Required/optional | Allowed | Legacy model-visible | Canonical T-015 | Validator | After T-016 |
| ----- | ----------------- | ------- | -------------------- | --------------- | --------- | ----------- |
| `kind` | **required** when object present | literal `"learner_evidence"` | YES in **shape JSON**; NO in contract prose | NO | required enum | YES §8/§10/§11 |
| `purpose` | **required** when object present | non-empty string | YES in **shape JSON**; NO in contract prose | NO | required string | YES §8/§10/§11 |
| `learner_action` | **required** | non-empty string | YES prose + shape | YES §8 + §11 | required | preserved |
| `observable_features` | **required** | non-empty string array | YES prose + shape | YES §8 + §11 | required | preserved |
| `provenance` | optional; non-empty if present | string; live guidance: `system_generated_simulation` \| `conversation_attachment` | YES prose + shape | YES §8 + §11 | optional | preserved |
| `evidence_layout` | optional; non-empty if present | `separate_provider` / `combined_evidence_workspace` | YES prose + shape | YES §8 + §11 | optional; combined requires sibling arrays | preserved |
| `disclosure_constraint` | optional; non-empty if present | non-empty string | YES in **shape JSON**; disclosure **prose** in contract | prose in §8; field name omitted from §11 | optional | optional named in §10; prose stays §8 |
| `minimum_suitable_form` | optional; non-empty if present | non-empty string | YES shape only | NO | optional | optional named in §10 |
| `processing_notes` | optional; non-empty if present | non-empty string | YES shape only | NO | optional | optional named in §10 |
| `fixed_observation_fields` | required **if** layout is combined | non-empty string array | YES in §8 combined prose | YES §8 combined prose | required when combined | preserved §8; named §10 |
| `learner_response_fields` | required **if** layout is combined | non-empty string array | YES §8 combined prose | YES §8 | required when combined | preserved §8; named §10 |

Object presence: optional except when `evidence_decision.required` is true (P02 closure). Unchanged.

---

## Repair (authorised by confirmed omission)

Minimal canonical wording only. No second evidence authority. No restored 6,698-char shape blob. No PRE-EMIT audit. Validators/schemas untouched.

**§8** added two bullets after the authoring heading:

- `evidence_requirement.kind: required literal "learner_evidence".`
- `evidence_requirement.purpose: required non-empty string — this evidence row’s job as inspectable grounds for the learner (not the same field as required_materials[].purpose).`

**§10** added structural children (required + optional-when-present + combined arrays).

**§11** example now includes `"kind": "learner_evidence"` and `"purpose": "Provide inspectable observations needed for diagnosis."` (same strings as legacy shape miniature).

Version **`77-DLA-CANONICAL-2`**. Pin `ld-dla-page-enrich-contract.js?v=20260814-s77-dla-canonical-2`. `app.js` pin unchanged (no app.js assembly-logic edit).

---

## Size delta vs T-015 live reconstruct

| Surface | T-015 | T-016 | Δ |
| ------- | ----- | ----- | -- |
| §8 providers (bare) | 2,047 | 2,290 | **+243** |
| §10 output (bare) | 1,634 | 2,125 | **+491** |
| §11 examples (bare) | 1,586 | 1,699 | **+113** |
| Canonical total (this repair) | — | — | **+847** |
| Live Copy | 36,441 | **37,288** | **+847** |
| Live Studio | 33,862 | **34,709** | **+847** |

Copy/Studio §§1–11 remain byte-identical. Multiplicity 1. Exact canonical duplication 0.

---

## Gates

| Gate | Result |
| ---- | ------ |
| A | **PASS** |
| B | **PASS** (architecture + evidence + S72 + P01/P02/P03 + page-dla-enrich + rollback: 194 in focused batch; evidence-decision consistency 13) |
| C | **PASS** (delta reported; not compensated) |
| D | **NOT RERUN** |

Rollback intact. Schema/validator/GAM/EP unchanged.

---

## Exact operator rerun point

1. Keep the **existing Lagrangian EP** (five activities).  
2. Reload Prism so `77-DLA-CANONICAL-2` is the live DLA contract.  
3. **Rerun DLA only** (Copy/Studio).  
4. Confirm capture succeeds.  
5. Do **not** run GAM or QA until DLA captures.

Do not delete rollback. Do not start Phase D cleanup.
