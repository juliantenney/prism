# S78-T-008 — Fresh DLA candidate 1: A4 evidence-provider diagnostic

**Task:** Bounded diagnostic (T-008 sub-record)  
**Status:** **COMPLETE** (2026-08-17)  
**Mode:** DIAGNOSTIC ONLY — no implementation  
**Candidate:** Fresh Lagrangian DLA candidate 1 — **rejected before GAM**

---

## 1. Exact fresh failure

```text
activities[3].evidence_decision provider material_id A4-M1 must include evidence_requirement
```

Emitted by `validateEvidenceDecisionClosure` in `lib/page-dla-enrich.js` when `evidence_decision.required === true` and a listed provider row lacks `evidence_requirement`.

**Validator accuracy:** **YES** — error message matches the enforced rule and the operator-reported A4 structure (`provider_material_ids: ["A4-M1"]`, no `evidence_requirement` on A4-M1).

**Artefact note:** Full fresh JSON was not committed to the repository at diagnostic time. This record uses the operator-reported failure string and A4 field summary as the authoritative exhibit.

---

## 2. Fresh A4 evidence structure (reported)

| Element | Reported state |
| ------- | -------------- |
| `learner_task` | Not fully quoted — activity requires learner interpretation of supplied optimisation context (inferred from A4-M1 purpose) |
| `expected_output` | Not fully quoted |
| `evidence_decision.required` | `true` |
| `evidence_decision.provider_material_ids` | `["A4-M1"]` |
| `A4-M1.material_type` | `scenario` |
| `A4-M1.purpose` | Provide solved optimisation context and multiplier value for learner interpretation |
| `A4-M1.specification` | Not fully quoted |
| `A4-M1.evidence_requirement` | **Missing** |

The commission correctly identifies A4-M1 as an evidence **provider** at the decision level, but the material row omits the structured provider payload the contract requires.

---

## 3. Authoritative evidence-provider contract

**Answer:** **YES** — when `evidence_decision.provider_material_ids` names a material, that material is **already authoritatively required** to carry `evidence_requirement` (and to be listed in `task_material_decision.task_input_material_ids`).

| Surface | Location |
| ------- | -------- |
| Evidence decision rule | `lib/ld-dla-page-enrich-contract.js` — `buildDlaSectionEvidence()` §7 |
| Provider shape | `buildDlaSectionProviders()` §8 |
| Output shape | `buildDlaSectionOutput()` §10 |
| Capture validator | `lib/page-dla-enrich.js` — `validateEvidenceDecisionClosure()` |
| Shape validator | `validateEvidenceRequirementShape()` |
| Contract version | `78-DLA-WS-1` (extends Sprint 77 P02 / Sprint 72 evidence slice) |

Normative §7 text:

> If evidence_decision.required is true: list those task-input rows in provider_material_ids **and attach evidence_requirement on those rows**.

---

## 4. Prompt / authoring instruction

**Explicit and unambiguous:** **YES**

- §7 binds `required: true` → providers + `evidence_requirement` on those rows.
- §8 defines required `evidence_requirement` fields (`kind`, `purpose`, `learner_action`, `observable_features`, provenance, layout rules).
- §10 output contract: `evidence_requirement` optional **only on evidence-provider rows**; when present, required subfields are mandatory.
- Canonical shape snippet (`buildCanonicalDlaPageShapeSnippet`) includes a full evidence-provider example.

Location is structurally adjacent to both `evidence_decision` (§7) and `required_materials` provider authoring (§8). No conflicting duplicate that would negate the rule.

**Salience assessment:** Contract is **not** materially weak. Omission of `evidence_requirement` while setting `required: true` and listing the provider is **stochastic non-compliance** that fail-closed validation is designed to reject — not evidence of an architectural gap introduced by S78-WS-1.

---

## 5. Validator enforcement

**Fail-closed:** **YES** — `validateEvidenceDecisionClosure` (approx. lines 1509–1620 in `lib/page-dla-enrich.js`):

```javascript
if (decision.required) {
  // ...
  if (!providerRow.evidence_requirement) {
    errors.push(
      decisionPath + " provider material_id " + providerId + " must include evidence_requirement"
    );
  }
  if (!taskInputSet[providerId]) {
    errors.push(/* task_input_material_ids closure */);
  }
}
```

Also enforced on partial capture via `validateDlaPartialPageCapture` → `validateActivityMaterialContracts` → same closure.

---

## 6. Relevant regression tests

| Test file | Case |
| --------- | ---- |
| `tests/sprint-72-evidence-centred-activity-slice.test.js` | `evidence_decision required=true must reference provider rows with evidence_requirement` → expects exact error class |
| `tests/s76-dla-p01-p02-p03-contract.test.js` | `P02 fail: provider missing evidence_requirement` |
| `tests/ld-dla-evidence-decision-consistency-prompt.test.js` | Contract asserts provider + `evidence_requirement` binding in live prompt text |

---

## 7. Historical / Sprint 77 status

| Question | Answer |
| -------- | ------ |
| Protected canonical guarantee? | **YES** — Sprint 72 evidence slice + Sprint 76 P02 + Sprint 77 canonical assembler preserved this closure |
| Prior explicit close? | Sprint 72 evidence-centred activity slice; S76 P02 provider closure; S77 Gate D did not weaken evidence rules |
| Similar failures before? | **YES** — documented stochastic DLA omissions in Sprint 76/77 Lagrangian runs (different activities/fields) |
| Regression from T-005/T-007? | **NO evidence** — S78 changes did not alter `validateEvidenceDecisionClosure` |

---

## 8. Is this a regression?

**NO** — validator and contract unchanged in intent; one rejected generation is within expected fail-closed behaviour.

---

## 9. S78-WS-1 behaviour in this candidate

**Not fully verifiable from repository artefact** (JSON not committed). Operator context: fresh post-T-005 regeneration.

**Inference (limited):** Rejection at A4 evidence closure implies the candidate progressed far enough that A1–A3 were present; whether A1–A3 carry valid `response_fulfilment` bindings is **unconfirmed** without the preserved JSON paste.

**Do not** conflate this A4 evidence failure with WS1 repair failure.

---

## 10. Primary classification

**A — Correctly rejected generation; no repair justified**

---

## 11. Repair justified?

**NO**

---

## 12. Operational next action

1. Preserve rejected candidate 1 as T-008 evidence.
2. **Regenerate DLA** from the same fresh EP using the unchanged canonical pipeline.
3. Continue T-008 with the first candidate that **passes DLA capture** (including A4 provider closure and S78-WS-1 fulfilment gates).
4. Do not hand-edit the rejected JSON.

---

## 13. Files changed by this diagnostic

Documentation only: this record + `S78-T-008-workstream-1-integration-verification.md`.

**Production / test / prompt / schema / validator / renderer changes:** **NO**
