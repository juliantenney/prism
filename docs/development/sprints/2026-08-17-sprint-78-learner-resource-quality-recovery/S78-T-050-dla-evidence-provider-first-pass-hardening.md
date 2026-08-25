# S78-T-050 — Harden DLA evidence-provider first-pass consistency

**Task:** S78-T-050  
**Status:** **IMPLEMENTATION COMPLETE** (2026-08-25)  
**Mode:** Implementation (DLA live prompt salience only)  
**Sprint 78:** OPEN · **T-013:** remains OPEN  

**Upstream:** [S78-T-049](S78-T-049-first-pass-generation-validation-reliability-diagnostic.md) · [S78-T-009](S78-T-009-dla-p02-provider-row-output-shape-salience-repair.md)  

**Out of scope (honoured):** GAM T-049 hardening · validator/schema changes · auto-retry · UX redesign · image work · learner workspaces · T-013 / Sprint 78 close  

---

## 1. T-049 root-cause confirmation

Hydrology first-pass DLA failed:

`activities[4].evidence_decision provider material_id A5-M5 must include evidence_requirement`

Same class as T-008 Candidate 1 after T-009. T-049 confirmed:

- validator is correct;
- canonical P02 already exists in DLA §10 + checklist;
- not a missing schema rule;
- remaining weakness is **salience / stochastic compliance at final emission**.

Regeneration from the same upstream prompt succeeded → generation reliability, not contract absence.

---

## 2. Exact final pre-emit gate

Constant `DLA_P02_FINAL_SILENT_PRE_EMIT_GATE` in `lib/ld-dla-page-enrich-contract.js`:

```text
FINAL SILENT PRE-EMIT CHECK (P02):
Immediately before returning JSON, silently re-verify the P02 provider-row closure invariant stated above (every evidence_decision.provider_material_id → matching required_materials[] row with complete evidence_requirement; providers ⊆ task_input_material_ids when required is true). Correct any inconsistency before emission. Emit only the corrected artefact — do not output checking or reasoning.
```

---

## 3. Exact live insertion point

Appended at the **end of `buildDlaSectionOutput`** (after optional `outputSlot`), so it is the last content of **§10 Output** — after the existing P02 normative line and the six-item pre-output checklist, and **before** §11 examples.

Live delivery:

| Path | Function |
| ---- | -------- |
| Canonical assembly | `assembleDlaCanonicalContract` → `buildDlaSectionOutput` |
| Operator Copy / live prompt | `app.js` → `assembleLiveDlaCanonicalPrompt` → same assembler |
| Copilot schema instructions | `buildDlaV2CopilotSchemaInstructions` → `assembleLiveDlaCanonicalPrompt` |

A source-only constant unused on the live path would be insufficient; regressions assert the gate in `assembleLiveDlaCanonicalPrompt` and `buildDlaV2CopilotSchemaInstructions`.

---

## 4. Relationship to existing P02 contract

Gate **references** the existing §10 P02 provider-row closure invariant (“stated above”) rather than restating a second independent definition. Canonical field relationships match the validator / T-009 surface:

- every `evidence_decision.provider_material_id` → matching `required_materials[]` row with complete `evidence_requirement`;
- providers ⊆ `task_input_material_ids` when `required` is true.

---

## 5. No duplicated invariant

- Normative P02 text and checklist item 1 **unchanged**.
- Gate is a **salience reinforcement** (“silently re-verify … stated above”), not a parallel rule set.
- Exported as one constant for tests; single insertion site in `buildDlaSectionOutput`.

---

## 6. Validator unchanged

`lib/page-dla-enrich.js` / `validateEvidenceDecisionClosure` **not modified**. Capture validation remains the final deterministic backstop. Regression still fails missing `evidence_requirement` with the same message class.

---

## 7. Live-path regression

`tests/s78-t-050-dla-evidence-provider-first-pass-hardening.test.js`:

- live `assembleLiveDlaCanonicalPrompt` contains the gate **after** the pre-output checklist and **before** examples;
- live `buildDlaV2CopilotSchemaInstructions` contains the gate;
- domain-general (no Hydrology wording).

---

## 8. Tests / checks and results

| Check | Result |
| ----- | ------ |
| T-050 suite (8 tests) | **PASS** |
| `tests/ld-dla-evidence-decision-consistency-prompt.test.js` | **PASS** (updated to allow FINAL SILENT PRE-EMIT CHECK; still forbids obsolete FINAL PRE-EMIT AUDIT) |
| `tests/page-dla-enrich.test.js` | **PASS** (26) |
| S72 `evidence_decision required=true must reference provider rows with evidence_requirement` | **PASS** |

---

## 9. Files changed

| File | Change |
| ---- | ------ |
| `lib/ld-dla-page-enrich-contract.js` | `DLA_P02_FINAL_SILENT_PRE_EMIT_GATE` + append at end of `buildDlaSectionOutput`; export |
| `tests/s78-t-050-dla-evidence-provider-first-pass-hardening.test.js` | **New** focused regressions |
| `tests/ld-dla-evidence-decision-consistency-prompt.test.js` | Allow T-050 gate; keep obsolete-audit ban |
| This record + sprint nav | STATUS / HANDOVER / PLAN / START-HERE / next-chat-briefing |

---

## 10. Deviations / unresolved risks

- **Stochastic residual:** salience reduces but does not eliminate emit-time miss rates; validator remains the backstop. No auto-retry.
- **GAM T-049 hardenings** (role + quantitative silent pre-emit) **not** implemented here — separate follow-on.
- Unrelated pre-existing failures in some S72 fixtures (WS-1/DR-1 unbound production) are **outside** this task; P02 evidence_requirement case still passes.

---

## 11. Sprint 78 / T-013 state

| Item | State |
| ---- | ----- |
| Sprint 78 | **OPEN** |
| T-013 | **OPEN** (not closed by this task) |
| T-050 | **Implementation complete** |
| Next (authorise) | GAM silent conceptual + quantitative consistency gate (T-049 proposal B); keep validators |

---

## Ownership

DLA owns this structural consistency. Not moved to GAM. Assembly path, schema, and capture validation logic unchanged aside from prompt salience in the DLA contract assembler.
