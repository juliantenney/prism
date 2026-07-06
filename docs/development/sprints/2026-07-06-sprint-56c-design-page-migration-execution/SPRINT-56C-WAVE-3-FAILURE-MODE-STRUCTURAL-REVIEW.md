# Sprint 56C — Wave 3 Failure-Mode Crosswalk (FM-A … FM-G)

**Sprint:** 56C — Design Page Migration Execution  
**Wave:** 3 — Validation preparation (W3.3)  
**Authority:** [Wave 3 Validation Architecture Definition](SPRINT-56C-WAVE-3-VALIDATION-ARCHITECTURE-DEFINITION.md) §6

---

## 1) Purpose

Operationalise the frozen FM-A…FM-G taxonomy into implementation-ready review rows:

- trigger
- detection source
- review path
- severity

This crosswalk is used by fixture audits, regression inventory, and the Wave 3 meta-test.

---

## 2) FM crosswalk matrix

| FM | Name | Trigger | Detection source | Review path | Severity |
| --- | --- | --- | --- | --- | --- |
| FM-A | Governance drift | Governance artefacts conflict (status, closure, deprecation entries) | Checklist + governance docs diff | PATH-N/A (Layer 0) | High |
| FM-B | Prompt-path drift | DP prompt markers/order/exclusions diverge from frozen path | 56C wave gate tests + prompt capture assertions | PATH-N/A (Layer 1) | High |
| FM-C | Ownership drift | Removed ownership layers or duplicate authorities reappear | Domain/compose/materials tests + residue pattern scans | PATH-N/A or PATH-A capture audit | High |
| FM-D | Schema drift | Page schema/root keys diverge from expected structure | Domain §13 parse + page schema/closure validators | PATH-A / PATH-B | Medium |
| FM-E | Preservation failure | Materials/scaffold/closure invariants fail | Materials closure + field closure + placeholder detectors | PATH-A / PATH-B | High |
| FM-F | Transport violation | Transport-or-omit or transport-first policy violated in artefact | Slot/policy checks vs upstream bindings | PATH-A / PATH-B | High |
| FM-G | Generation-visibility violation | Report/test claims Class C as Prism-validated | Documentation audit + prohibited phrase checks | PATH-N/A (meta) | Critical |

---

## 3) Mapping to validation classes and layers

| FM | Primary class | Primary layer | Secondary class/layer |
| --- | --- | --- | --- |
| FM-A | A | 0 | — |
| FM-B | A | 1 | — |
| FM-C | A | 1 | B / 2 |
| FM-D | A | 0–1 | B / 2 |
| FM-E | B | 2 | — |
| FM-F | B | 2 | A / 1 (if mandate drift) |
| FM-G | Meta | All | — |

---

## 4) Detection hooks (current repository)

| FM | Existing hook examples |
| --- | --- |
| FM-A | `SPRINT-56C-EXECUTION-CHECKLIST.md`, wave closure summaries, deprecation register |
| FM-B | `tests/sprint-56c-wave1-phase1-gates.test.js`, `tests/sprint-56c-wave2-gates.test.js` |
| FM-C | `tests/sprint-56c-wave1-phase2a-gates.test.js`, `tests/sprint-56c-wave1-phase2b-gates.test.js`, compose/materials contract tests |
| FM-D | Domain §13 Prompt Factory parsing tests; closure validator entry points |
| FM-E | `tests/page-materials-closure.test.js`, `tests/utility-page-composition-closure.test.js`, materials-copy tests |
| FM-F | Wave 2 OQ-17/R-83 policy assertions + fixture checklist checks (`SC-KNOWLEDGE-V1`) |
| FM-G | Wave 3 meta-test policy scan + governance report review |

---

## 5) Severity handling policy

| Severity | Action |
| --- | --- |
| Critical | Block Wave closure immediately |
| High | Block affected workstream; require remediation and re-run |
| Medium | Record in report; remediate before Wave 4 closure unless explicitly accepted |
| Low | Record advisory note; monitor in regression inventory |

FM-G is always **Critical** because it invalidates compliance claims.

---

## 6) Review path rules

1. PATH-A/PATH-B rows apply only to artefact-level findings (Class B).
2. Layer 1 must pass before attributing PATH-A/PATH-B findings to architecture drift.
3. PATH-B findings must include upstream-binding evidence.
4. PATH-A `TBD-CAPTURE` is allowed for Wave 3 readiness; unresolved slots remain open items.

---

## 7) Finding entry template

```yaml
finding_id: FM-E-EXAMPLE-001
failure_mode: FM-E
trigger: "Placeholder-only materials field detected"
detection_source: "tests/page-materials-closure.test.js"
review_path: "PATH-A"
severity: "High"
validation_class: "B"
layer: 2
evidence_ref: "tests/fixtures/page-render/ld-inflation-workshop-page.json"
```

---

## 8) Completion criterion linkage

This crosswalk satisfies checklist §E item:

- **Failure modes A–G mapped to structural review criteria**

and contributes to:

- **Acceptance invariant structural checklist prepared**
