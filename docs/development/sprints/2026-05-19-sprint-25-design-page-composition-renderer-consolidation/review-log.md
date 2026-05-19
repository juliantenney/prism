# Sprint 25 review log — Design Page composition and renderer consolidation

**Pack path:** `docs/development/sprints/2026-05-19-sprint-25-design-page-composition-renderer-consolidation/`  
**Date:** 2026-05-19

---

## 2026-05-19 — Sprint 25 scaffold opened

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R25-001 | Sprint 25 focus is **Design Page composition + renderer consolidation**, not pack semantics | Sprints 23–24 closed upstream governance |
| R25-002 | **25-1 is investigation-only** — no implementation | Need trace evidence before remediation |
| R25-003 | A2 loss is **chartered as composition/export hypothesis** until disproved | Upstream artefacts retain A2; export HTML does not |
| R25-004 | Utility renderer v1 direction is **preserved** — grey nested cards, semantic icons, collapsed metadata | Substantial prior work; consolidation not restart |
| R25-005 | Renderer refinement boundary: **presentation and export fidelity**, not pedagogy invention | Renderer must not add activities or materials |
| R25-006 | Slice sequence **25-2–25-5 proposed** but **not chartered** pending 25-1 | Avoid premature implementation scope |

### Artefacts

| Artefact | Path |
|----------|------|
| Sprint index | [`sprint-25-index.md`](sprint-25-index.md) |
| Current state | [`CURRENT-STATE.md`](CURRENT-STATE.md) |
| Slice 25-1 charter | [`slice-25-1-charter.md`](slice-25-1-charter.md) |
| Investigation scaffold | [`design-page-composition-pipeline-investigation.md`](design-page-composition-pipeline-investigation.md) |

### Verification (sprint open)

```bash
node --test tests/*.test.js
```

**Result:** **220 passed**, 0 failed (entry floor).

**Pack/runtime delta (25-1 open):** None expected.

---

## 2026-05-19 — Slice 25-1 composition path trace (Design Page only)

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R25-007 | Design Page **composition is LLM-mediated only** — no runtime `assemblePage` in `app.js` | Code review: upstream JSON injected verbatim; no structural page normaliser |
| R25-008 | **Primary suspected loss stage: Design Page model synthesis (S2)** | Pack governs output; runtime does not filter activities; live JSON not yet captured |
| R25-009 | **Live A2 loss unproven at composition layer** until Design Page `page` JSON captured | Repo has faithful fixture + renderer tests only |
| R25-010 | Pack contract gap **G1/G2**: no mandatory activity-id closure; sequence may imply membership filter | Construct Learning Sequence allows `activities_omitted`; Design Page defers to sequence for order |
| R25-011 | Runtime `sanitizePrismRunCapturedOutput` **ruled out** as composition cause | Strips STEP footer / orphan fences only |
| R25-012 | **Recommend Slice 25-2 (composition contract)** before export/renderer remediation | Disambiguate with live JSON; export ruled out when `sections[]` is faithful (fixture control) |

### Artefacts updated

| Artefact | Path |
|----------|------|
| Investigation — §§1, 2.4, 3.2–3.3, 5.3, 9, 10 | [`design-page-composition-pipeline-investigation.md`](design-page-composition-pipeline-investigation.md) |

### Verification

No code/pack/runtime changes. Test floor unchanged (**220 passed** at sprint open).

---

## 2026-05-19 — Slice 25-2 Design Page composition contract

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R25-013 | **`learning_activities` is membership authority** for composed page activities | 25-1: no runtime assembler; closure must be prompt-governed |
| R25-014 | **`learning_sequence` is order/timing only** — sequence `activities_omitted` does not authorise page omission without trace | Resolves G2 ambiguity from 25-1 |
| R25-015 | **`activity_materials` enriches only** — cannot add/remove activities | Materials keyed by activity_id |
| R25-016 | **`page.sections[]` is canonical**; top-level canonical duplicates are non-authoritative for export | Aligns composition + export (25-3) |
| R25-017 | **Activity omission requires trace** — `generation_notes.limitations` + proposed `activities_omitted[]` | No silent drops (A2 case) |
| R25-018 | **Closure validation model documented** (§8 contract) — implementation deferred to 25-5 | Testable spec without runtime in 25-2 |
| R25-019 | **Slice 25-3 chartered as export-contract focus** — not duplicate membership rules | Composition contract complete; export must not mask gaps via stale top-level keys |
| R25-020 | **Pack prompt changes proposed only** (§7) — no pack edit in 25-2 | 25-5 implementation slice |

### Artefacts

| Artefact | Path |
|----------|------|
| Composition contract | [`design-page-composition-contract.md`](design-page-composition-contract.md) |
| Slice charter | [`slice-25-2-charter.md`](slice-25-2-charter.md) |
| Investigation §11 | [`design-page-composition-pipeline-investigation.md`](design-page-composition-pipeline-investigation.md) |

**Pack/runtime delta:** None.

---

## 2026-05-19 — Slice 25-3 Export / pageSections integration contract

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R25-021 | When `page.sections[]` is non-empty, export body MUST come from unified `utilityRenderPageSections(sections[])` only | `pageBodyFromSectionsArray` + `shouldSkipPageBodySectionKey` in current code |
| R25-022 | Live `handleUtilitiesGenerate` MUST pass `pageSections: parsed.sections` | Confirmed in `app.js`; export contract X10 |
| R25-023 | Catalog `sectionOrder` is not a second body pass when `sections[]` exists | Top-level `PAGE_BODY_SECTION_IDS` skipped in loops |
| R25-024 | Catalog `sectionOrder` does not include `"sections"`; array document order is presentation order for unified render | Pack renderHints audit |
| R25-025 | Top-level canonical body keys are fallback-only when `sections[]` absent | Legacy/malformed shape risk documented |
| R25-026 | Historical risk: pre-guard export could prefer stale top-level `learning_activities` | Explains live A2 symptom class; mitigated when `sections[]` present |
| R25-027 | Probe recovery (`resolveLearningActivityRowsForRender`) may mask composition gaps — not normative closure | Aligns with 25-2; strict mode deferred to 25-5 |
| R25-028 | Export/renderer must not invent or silently drop activities present in `sections[]` content | Separation of concerns §5 |
| R25-029 | **25-5 before 25-4 visual polish**; 25-4 governance doc may proceed in parallel | A2 user impact is composition-first |
| R25-030 | Future parity tests T1–T4 use catalog `sectionOrder`, not test default `["sections"]` | Test harness divergence documented |

### Artefacts

| Artefact | Path |
|----------|------|
| Export contract | [`design-page-export-contract.md`](design-page-export-contract.md) |
| Slice charter | [`slice-25-3-charter.md`](slice-25-3-charter.md) |
| Investigation §12 | [`design-page-composition-pipeline-investigation.md`](design-page-composition-pipeline-investigation.md) |

**Pack/runtime delta:** None.

---

## Status

**Slices 25-1–25-3 and 25-5 closed.** **Next:** live Design Page re-run to confirm A2 in `sections[]`; optional **25-4** renderer governance doc.

---

## 2026-05-19 — Slice 25-5 Composition remediation (implementation)

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R25-031 | Pack Design Page prompt enforces full upstream `learning_activities` membership | Primary fault is synthesis, not export |
| R25-032 | Intentional omissions traced in `generation_notes.activities_omitted[]` + `limitations` | A2 case had empty limitations |
| R25-033 | Runtime `validatePageActivityClosure` — warn-only, no auto-repair | Bounded; preserves artefact for inspection |
| R25-034 | `strictCompositionClosure` when `sections[]` authoritative | Stops probe from masking composition gaps (25-3 §12.3) |
| R25-035 | Regression fixtures: full, missing-A2, upstream LA | Inflation workshop continuity |

### Artefacts

| Artefact | Path |
|----------|------|
| Closure tests | `tests/utility-page-composition-closure.test.js` |
| Fixtures | `tests/fixtures/page-render/ld-inflation-workshop-page-missing-a2.json`, `ld-inflation-workshop-upstream-learning-activities.json` |
| Runtime | `app.js` (`validatePageActivityClosure`, `strictCompositionClosure`) |
| Pack | `domain-learning-design-step-patterns.md` §13, `domain-learning-design-artefacts.md` §18 |

**Verification:** **229 passed**, 0 failed (`node --test tests/*.test.js`).
