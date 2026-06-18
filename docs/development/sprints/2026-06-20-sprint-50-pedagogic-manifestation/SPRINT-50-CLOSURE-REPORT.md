# Sprint 50 — Closure Report

**Sprint folder:** `docs/development/sprints/2026-06-20-sprint-50-pedagogic-manifestation/`  
**Predecessor:** Sprint 49 — SP-01 Text Pattern (closed **Complete with follow-on work**)  
**Recommended status:** **Complete**  
**Closure date:** 2026-06-20  
**Primary evidence (pre-fix corpus):** [`../2026-06-19-sprint-49-sp-01-text-pattern/marx-run-artefacts-run2/`](../2026-06-19-sprint-49-sp-01-text-pattern/marx-run-artefacts-run2/)  
**Post-implementation verification:** [`verification-runs/2026-06-18-marx-self-study/`](./verification-runs/2026-06-18-marx-self-study/)

---

# Executive Summary

**Sprint 49 conclusion:** *Pedagogy is generated, preserved, and rendered.*

Sprint 49 proved that the Marx self-directed learner-page pipeline can emit mandatory framing fields (`activity_preamble`, `reasoning_orientation`), cognition-orientation signals, and substantive GAM connective exposition; carry them through GAM and Design Page compose; and surface them in renderer output when present on the page model.

**Sprint 50 conclusion:** *The dominant challenge was pedagogic manifestation and learner experience.*

Sprint 50 investigated why pedagogy that exists upstream does not always read coherently to learners. It validated a seven-function instructional model and a single-column manifestation grammar, then implemented compose fidelity, persistence-path fixes, and renderer instructional grammar. The remaining gap is not architectural — it is instructional richness, visibility quality, and learner inference burden.

**Did Sprint 50 meet its objectives?** **Yes — with explicit follow-on in Sprint 51.**

| Charter objective | Outcome |
| ----------------- | ------- |
| Manifestation rubric / gap diagnosis | **Met** — inventory, classification, gap analysis, minimal model |
| Compose fidelity | **Met** — Phase 1 + Phase 1B |
| Documented reading path | **Met** — Phase 2 instructional grammar (Why → How → Study → Do → Check → Reflect → Transfer) |
| No prompt regression | **Met** — Sprint 48–49 + Sprint 50 regression suites green |
| Evidence-led implementation | **Met** — all slices traced to investigation findings |

Sprint 50 is **closed**. Quality, richness, and experiential verification move to Sprint 51.

---

# Investigation Completed

## Pedagogic Manifestation Inventory

**Document:** [SPRINT-50-PEDAGOGIC-MANIFESTATION-INVENTORY.md](./SPRINT-50-PEDAGOGIC-MANIFESTATION-INVENTORY.md)

Mapped every pedagogic field and structure from DLA through GAM, compose, and renderer to learner-visible HTML. Established provenance for PEL, cognition-orientation, materials, Compass, and task/output blocks. Confirmed pedagogy is **generated upstream** and **renderable downstream**; gaps were compose persistence, renderer order, and duplicate signalling — not absence of capability.

## Instructional Function Classification

**Document:** [SPRINT-50-INSTRUCTIONAL-FUNCTION-CLASSIFICATION.md](./SPRINT-50-INSTRUCTIONAL-FUNCTION-CLASSIFICATION.md)

Classified fields and renderer components into instructional functions: **Orient, Think, Study, Do, Check, Reflect, Transfer** (+ optional Support). Identified boundary fields, duplicate ownership (Compass vs framing vs cognition), and Study/Do ordering conflicts in the legacy renderer.

## Minimal Instructional Manifestation Model

**Document:** [SPRINT-50-MINIMAL-INSTRUCTIONAL-MANIFESTATION-MODEL.md](./SPRINT-50-MINIMAL-INSTRUCTIONAL-MANIFESTATION-MODEL.md)

Defined the simplest viable learner experience: single-column instructional document per activity; Companion (Orient + Think) before Activity Flow; one primary owner per function; plain-language section labels. **No new fields or pedagogy** — reorder, relabel, and de-duplicate existing signals.

## Scope Confirmation

**Document:** [SPRINT-50-SCOPE-CONFIRMATION-DESIGN-PAGE-RENDERER.md](./SPRINT-50-SCOPE-CONFIRMATION-DESIGN-PAGE-RENDERER.md)

Confirmed solution scope as **Design Page compose + Renderer only**. Upstream DLA/GAM already generate required owners; compose merge exists but was not always persisting to authoritative `page.json`; renderer had capability but wrong order and duplication.

## Validation Work

| Document | Role |
| -------- | ---- |
| [SPRINT-50-INSTRUCTIONAL-MANIFESTATION-HYPOTHESIS.md](./SPRINT-50-INSTRUCTIONAL-MANIFESTATION-HYPOTHESIS.md) | Hypothesis that manifestation fixes are compose + renderer, not generation |
| [SPRINT-50-INSTRUCTIONAL-MANIFESTATION-IMPLEMENTATION-SPEC.md](./SPRINT-50-INSTRUCTIONAL-MANIFESTATION-IMPLEMENTATION-SPEC.md) | Accepted implementation target |
| [SPRINT-50-PEDAGOGIC-VISIBILITY-GAP-ANALYSIS.md](./SPRINT-50-PEDAGOGIC-VISIBILITY-GAP-ANALYSIS.md) | Marx run2 trace: generation vs persistence vs manifestation losses |
| [verification-runs/2026-06-18-marx-self-study/](./verification-runs/2026-06-18-marx-self-study/) | Automated full-workflow live run post-implementation |

---

# Implementation Completed

## Phase 1 — Compose Fidelity

**Report:** [SPRINT-50-PHASE-1-COMPOSE-FIDELITY-REPORT.md](./SPRINT-50-PHASE-1-COMPOSE-FIDELITY-REPORT.md)

Fixed upstream capture resolution (`sanitized → raw → DOM`) and authoritative page capture persistence after compose. `mergeLearnerPageActivityFramingFieldsIntoPageActivities` now runs with correct upstream when DLA exists in raw map.

**Tests:** `tests/sprint-50-phase-1-compose-fidelity.test.js`

## Phase 1B — Persistence Path Fix

**Report:** [SPRINT-50-PHASE-1B-PERSISTENCE-PATH-FIX-REPORT.md](./SPRINT-50-PHASE-1B-PERSISTENCE-PATH-FIX-REPORT.md)

Fixed raw-first upstream reads, persisted workflow `inputBindings` resolution, cascade re-compose on DLA sync, and utilities textarea always persisting composed page JSON.

**Tests:** `tests/sprint-50-phase-1b-persistence-path.test.js`

## Phase 2 — Renderer Instructional Grammar

**Report:** [SPRINT-50-PHASE-2-RENDERER-INSTRUCTIONAL-GRAMMAR-REPORT.md](./SPRINT-50-PHASE-2-RENDERER-INSTRUCTIONAL-GRAMMAR-REPORT.md)

New lib `lib/ld-instructional-manifestation-render.js`; learner pages render single-column instructional sections with grammar headings; legacy framing rail, cognition blocks, side Compass column, and separate Output block suppressed when grammar active. Study before Do; Check unifies checklist + `expected_output`; Compass progress-only.

**Tests:** `tests/sprint-50-phase-2-renderer-instructional-grammar.test.js`, updated compass suite

---

# Validated Decisions

The following are **established** — carry forward to Sprint 51; do not re-litigate without new evidence.

| ID | Decision |
| -- | -------- |
| **D-50-01** | Pedagogic manifestation before architecture expansion |
| **D-50-02** | Seven-function instructional model accepted (Orient, Think, Study, Do, Check, Reflect, Transfer + optional Support) |
| **D-50-03** | Single-column instructional manifestation model accepted |
| **D-50-04** | Compose + Renderer are primary manifestation ownership layers |
| **D-50-05** | Instructional sequencing: Why → How → Study → Do → Check → Reflect → Transfer |
| **D-50-06** | Study before Do when study materials exist |
| **D-50-07** | Unified Check (checklist + expected output in one section) |
| **D-50-08** | Reduced Compass responsibility (progress-only; no Orient/Think/Transfer prose) |

Full log: [SPRINT-50-DECISION-LOG.md](./SPRINT-50-DECISION-LOG.md)

---

# What Sprint 50 Proved

1. **Architecture is not the primary remaining problem.** Generation, preservation, compose merge, and renderer capability were already present. Gaps were persistence path, reading order, and duplicate signalling.

2. **Pedagogy exists in the system.** Marx run2 DLA carries `activity_preamble` and `reasoning_orientation` on all activities; GAM materials are substantive; page-level inquiry framing survives compose.

3. **Pedagogy is largely preserved.** GAM material bodies survive into `page.json`; Phase 1/1B closes the PEL echo gap on activity rows when upstream is available.

4. **Pedagogy is largely rendered.** Phase 2 grammar surfaces function-labelled sections when fields exist on page rows; regression tests confirm ordering and de-duplication.

5. **Learner experience is the dominant remaining challenge.** Structure is now coherent; voice, concreteness, optional-field coverage, and inference burden remain uneven. Manifestation ≠ presence — fields can exist without owning learner attention.

---

# Remaining Uncertainties

| Uncertainty | Notes |
| ----------- | ----- |
| **Fresh-run verification interpretation** | Automated run `2026-06-18-marx-self-study` completed all 8 steps and produced `page.json` + `page.html`. Grammar headings (*Why this activity*, *How to approach this*) and Study-before-Do passed. DLA field checks reported 0/0 for `activity_preamble` / `reasoning_orientation` — likely runner capture-shape mismatch vs browser workflow; human review of artefacts recommended. |
| **Persistence-path discrepancy** | Some artefacts (run2 pre-fix; partial fresh-run signals) show PEL on DLA but not on `page.json` rows. Phase 1B addresses known paths; edge cases (capture order, export timing) may remain. |
| **Hidden vs weakly manifested PEL** | Extent not fully established: optional Think fields sparse in generation (`self_explanation_prompt` on A1 only in run2); support notes render late; GAM bridges carry implicit Think without labels. |

These uncertainties are **Sprint 51 investigation inputs**, not Sprint 50 architecture blockers.

---

# Recommended Sprint 51 Focus

Sprint 51 should focus on **instructional richness, pedagogic quality, learner experience, and visibility of existing pedagogy**.

**Not architecture.**

Primary themes: Orient visibility, Think visibility, coaching language, worked-example concreteness, model-output educational quality, reflection and transfer authenticity, and reducing learner inference burden.

Bootstrap pack: [`../2026-06-20-sprint-51-learner-experience/`](../2026-06-20-sprint-51-learner-experience/)

---

*Closure report v1 — Sprint 50 complete; Sprint 51 authorised.*
