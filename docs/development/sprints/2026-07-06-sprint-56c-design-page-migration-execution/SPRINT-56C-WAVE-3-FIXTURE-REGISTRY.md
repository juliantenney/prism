# Sprint 56C — Wave 3 OQ-25 Fixture Registry

**Sprint:** 56C — Design Page Migration Execution  
**Wave:** 3 — Validation preparation (W3.1)  
**Status:** Active registry (frozen schema; updatable fixture rows)  
**Authority:** [Wave 3 Validation Architecture Definition](SPRINT-56C-WAVE-3-VALIDATION-ARCHITECTURE-DEFINITION.md) §3, §8.2

---

## Registry schema (normative)

Each fixture row in this document must include:

- `fixture_id`
- `class_id`
- `description`
- `page_json_path`
- `upstream_bindings`
- `page_profile`
- `structural_checklist_id`
- `validation_class`
- `path_a_status`
- `path_b_status`
- `56a_failure_mode_refs`

Status enums:

- `path_a_status`: `bound` | `TBD-CAPTURE` | `N/A`
- `path_b_status`: `bound` | `synthetic` | `N/A`

---

## Canonical fixture register

| fixture_id | class_id | description | page_json_path | upstream_bindings | page_profile | structural_checklist_id | validation_class | path_a_status | path_b_status | 56a_failure_mode_refs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FX-MULTI-001 | FX-MULTI | Multi-activity learner page with preserved materials and ordering | `tests/fixtures/page-render/ld-inflation-workshop-page-full.json` | `tests/fixtures/page-render/ld-inflation-workshop-upstream-learning-activities.json` | learner | SC-MULTI-V1 | B | bound | bound | C, G |
| FX-INFLATION-001 | FX-INFLATION | Inflation workshop reduced page for summarisation/reference-without-embed regression checks | `tests/fixtures/page-render/ld-inflation-workshop-page.json` | `tests/fixtures/page-render/ld-inflation-workshop-upstream-learning-activities.json` | learner | SC-INFLATION-V1 | B | bound | synthetic | A, G |
| FX-KNOWLEDGE-001 | FX-KNOWLEDGE | Knowledge-summary transport-or-omit structural audit candidate | `tests/fixtures/page-render/shape-knowledge-summary-prose.json` | `TBD-UPSTREAM-LC-KM-BINDING` | learner | SC-KNOWLEDGE-V1 | B | TBD-CAPTURE | synthetic | A, F |
| FX-ASSESS-001 | FX-ASSESS | Assessment-profile/assessment-check structure transport | `tests/fixtures/page-render/ld-rna-hcv-assessment-page.json` | `TBD-UPSTREAM-ASSESSMENT-ITEMS` | learner | SC-ASSESS-V1 | B | bound | synthetic | E |
| FX-FACILITATOR-001 | FX-FACILITATOR | Facilitator profile slot reserved pending SQ-F1/SQ-F2 policy closure | `TBD-SQF-FIXTURE` | `TBD-SQF-UPSTREAM` | facilitator | SC-FACILITATOR-V1 | B | N/A | N/A | N/A |
| FX-RICH-DLA-GAM-001 | FX-RICH-DLA-GAM | Rich learner page preservation baseline (DLA + GAM shape) | `tests/fixtures/page-render/marx-self-study-page.json` | `TBD-UPSTREAM-DLA-GAM-BINDINGS` | learner | SC-RICH-V1 | B | bound | synthetic | A, B, D |

---

## Validation coverage by fixture class

| class_id | Required coverage | Expected assertions |
| --- | --- | --- |
| FX-MULTI | Membership closure, multi-material enumeration, ordering, no label-only materials | A/B/C/G checks pass on SC-MULTI-V1 |
| FX-INFLATION | Summarisation and reference-without-embed structural detection | A/G checks pass on SC-INFLATION-V1 |
| FX-KNOWLEDGE | OQ-17 transport-or-omit structural policy | F checks pass on SC-KNOWLEDGE-V1 |
| FX-ASSESS | `assessment_check.content.items[]` structural integrity | E checks pass on SC-ASSESS-V1 |
| FX-FACILITATOR | Placeholder row only until SQ-F policy closes | Marked deferred; no closure blocking for Wave 3 |
| FX-RICH-DLA-GAM | Rich preservation baseline and anti-condense shape checks | A/B/D checks pass on SC-RICH-V1 |

---

## Structural checklist definitions (SC-*)

### SC-MULTI-V1

- `artifact_type === "page"`
- `sections[]` contains `learning_activities`
- `learning_activities.content[]` has multi-row activities
- `activity.materials` present on each required row
- No placeholder-only material strings (`Full ... from ...`, `See upstream material`)
- Activity IDs are unique and non-empty

### SC-INFLATION-V1

- `learning_activities.content[]` exists and is array
- Materials are object-shaped (not single label string)
- No reference-only replacement patterns in materials
- Section ordering includes overview, learning purpose, learning activities (when present)

### SC-KNOWLEDGE-V1

- If `knowledge_summary` section exists, content must not be empty shell
- If LC/KM upstream binding is absent, row may be omitted (transport-or-omit policy)
- `study_tips` section follows transport-only expectation (no synthetic-only marker language)

### SC-ASSESS-V1

- `assessment_check` section exists when assessment fixture requires it
- `assessment_check.content.items[]` exists and is array
- Item rows include `item_id`, `stem`, `options` keys where expected

### SC-FACILITATOR-V1

- Reserved (deferred). No assertions until SQ-F policy closure.

### SC-RICH-V1

- Learner-facing sections present with non-empty content
- Learning activities include materials objects, not scalar labels
- No condensation disclaimers in generation notes
- Artefact shape compatible with closure validators

---

## PATH-A / PATH-B notes

### PATH-A (Copilot-primary)

- `bound`: fixture JSON is already present and can be audited structurally.
- `TBD-CAPTURE`: capture slot accepted for Wave 3 (no runtime-claim requirement).

### PATH-B (PRISM-repair)

- `bound`: fixture and upstream bindings available for repair-path structural comparison.
- `synthetic`: comparison may be performed with synthetic or partial upstream bindings; must be flagged as synthetic in findings.

---

## Registry maintenance rules

1. Do not remove canonical rows without architecture governance approval.
2. Add new rows only with unique `fixture_id` and one of the frozen class IDs.
3. If `TBD-*` fields are resolved, update in place and record date in commit/report notes.
4. Registry rows are Class B artefact metadata, not runtime generation claims.
