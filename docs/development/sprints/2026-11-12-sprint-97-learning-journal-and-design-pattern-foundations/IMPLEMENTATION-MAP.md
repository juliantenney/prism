# Sprint 97 — Implementation map

**Status:** **CLOSED — ACCEPTED** (qualified) — [SPRINT-97-CLOSURE.md](SPRINT-97-CLOSURE.md)  
**Sprint:** 97 — Learning Journal and Design Pattern Foundations  
**Opening:** [S97-D01](decisions.md#s97-d01--open-sprint-97--learning-journal-and-design-pattern-foundations)  
**M1 contract lock:** [S97-D03](decisions.md#s97-d03--resolve-q1q7-and-lock-m1-contract)  
**Incremental workflow:** [S97-D04](decisions.md#s97-d04--incremental-journal-development--pedagogical-north-star)  
**Data-model compatibility:** [S97-D05](decisions.md#s97-d05--learning-journey-data-model-extensibility-compatibility-principle)  
**Close:** [S97-D07](decisions.md#s97-d07--close-sprint-97--learning-journal-and-design-pattern-foundations-accepted)  
**Charter:** [SPRINT-97-CHARTER.md](SPRINT-97-CHARTER.md)  
**Investigation:** [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md)  
**Baseline:** `a8c2fd3b6e7dbeaa11bb418c71bf4eb472f150c5`

---

## Current posture

```text
Sprint 96                             CLOSED — ACCEPTED — do not reopen
Sprint 97                             CLOSED — ACCEPTED (qualified)
M1 Setup + architectural baseline     COMPLETE (S97-D02–D05)
M2 Journal runtime / TOC / notify     COMPLETE — ACCEPTED
M3 Journal spec + Design Page pipeline COMPLETE — ACCEPTED (qualified)
M4 Design-pattern catalogue           DEFERRED (PB-FA-029)
M5 Level 3 pipeline journals          DEFERRED (not executed as Level 3 evidence)
```

---

## Incremental development levels (S97-D04)

| Level | Milestone | What is exercised | What must not be required |
| ----- | --------- | ----------------- | ------------------------- |
| **1 — Runtime** | M2 | Hand-authored journal JSON; existing artefact contracts; saved-draft fixtures; TOC/render/population/missing/notifications | Design Page / constituent regeneration |
| **2 — Journal commissioning** | M3 | Design Page generate/revise of `learning_journey.journal`; reuse existing LJ design + declared artefacts | Regenerating unchanged constituents to revise journal framing |
| **3 — Integration** | M5 | Pipeline-authored journals from original LJ briefs; unified reassembly with revised journal | Repeating constituent commissioning, content generation, or educational QA |

Journal changes must not force full Learning Journey regeneration. Prefer existing assembly APIs that reuse constituent outputs. If incremental reassembly is blocked, document the limitation and propose the smallest fix — no new caching/regeneration framework.

---

## Locked contracts (S97-D03; preserved)

| Topic | Contract |
| ----- | -------- |
| Spec location | `page.learning_journey.journal` (`enabled`, `title`, ordered `entries[]`) |
| TOC order | Overview (if present) → resources → Learning Journal |
| Absent / disabled journal | No journal TOC; Sprint 96 behaviour |
| Notifications | Content fingerprints; missing→populated + substantive changes; unchanged re-saves ignored; open acknowledges displayed state; journey-scoped acknowledgement; accessible counts |
| Artefact eligibility | Any **declared producer** artefact; not undeclared workspaces / arbitrary draft fields |
| M2 fixtures | Allowed for runtime proof only |
| M3 commissioning | **Required** Design Page end-to-end journal generation |
| Catalogue path | `docs/design-patterns/` |
| PB-FA-026 | Out of scope |
| Data-model extensibility | Compatibility principle only ([S97-D05](decisions.md#s97-d05--learning-journey-data-model-extensibility-compatibility-principle)) — separate contracts from shell presentation; stable ids; explicit relationships; additive schema; no conditional/branching/rules/extra learner-state in S97 |

---

## Milestones

| ID | Title | Status | Depends on |
| -- | ----- | ------ | ---------- |
| M1 | Sprint setup, documentation and architectural baseline | **COMPLETE** | S97-D01; amendments S97-D03–D05 |
| M2 | Journal runtime, TOC and notifications | **COMPLETE — ACCEPTED** | T-003–T-006; fixture Level 1 evidence |
| M3 | Journal specification and LJ Design Page commissioning | **COMPLETE — ACCEPTED** (qualified) | Tasks 1–2 + journal-only producers; presentation hardening |
| M4 | Central design-pattern catalogue and demonstrator specification | **Deferred** | Carry forward — PB-FA-029 |
| M5 | Integration testing with both reference journeys, regression verification and sprint closure | **Deferred / partial** | Closure accepted on M1–M3 evidence; Level 3 pipeline journals **not** executed |

### Milestone structure note

Five milestones retained. Clarifications under S97-D03 / S97-D04:

- **M1** remains documentation/investigation (complete).  
- **M2 (Level 1)** — hand-authored fixture journal JSON; no pipeline dependency.  
- **M3 (Level 2)** — Design Page journal commissioning/revision without regenerating unchanged constituents; fixtures do not satisfy sprint acceptance.  
- **M4** may proceed in parallel (documentation-only); informed by pedagogical north star.  
- **M5 (Level 3)** — fresh **journey-level** design/journal generation from original LJ briefs for both patterns; reuse constituents; reassemble unified package; distinguish fixture runtime evidence from pipeline journal generation.

---

## Acceptance criteria

### M1 — Setup and architectural baseline

1. Sprint 97 number taken from [NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md) (successor to closed Sprint 96).  
2. Portable pack + programme stub + backlog entries created.  
3. Integration points for shell, artefact contract, drafts, and design page documented.  
4. Compatibility strategy for journeys without journal specs documented.  
5. Implementation sequence, tests, and decisions recorded (Q1–Q7 locked in S97-D03).  
6. **No journal runtime code shipped under M1.**

**Status:** Met (2026-11-12), including S97-D03 documentation amendments.

### M2 — Journal runtime, TOC and notifications

1. When an enabled journal spec is present, unified TOC order is Overview (if present) → constituent resources → Learning Journal (configured `title`).  
2. Journal view is read-only and available throughout the journey (permanent destination).  
3. Entries render in order with safe rendering of title, framing, and resolved learner content.  
4. Population uses existing artefact contract / `resolveArtefactReference` (or shared equivalent) against **declared producer** artefacts only — including artefacts not consumed by a later resource.  
5. Missing/unavailable artefacts are represented truthfully; undeclared workspaces are never exposed.  
6. Notification count uses **learner-visible content fingerprints** (not `savedAt` alone): missing→populated and substantive content changes count; unchanged re-saves do not; opening the journal acknowledges the currently displayed state; acknowledgement is journey-scoped and separate from constituent drafts; counts are accessible.  
7. Journeys without an enabled journal: no journal TOC item; Sprint 96 behaviour preserved.  
8. Same-browser/device persistence guarantees maintained; no new learner-work persistence system.  
9. Standalone publishing and existing carry-forward signposting unchanged.  
10. Focused unit/browser tests green (**fixture journal JSON allowed** for this milestone).

### M3 — Journal specification and Design Page pipeline (Level 2)

1. Normalised journal schema on `learning_journey.journal` (`enabled`, `title`, ordered `entries[]` with identity, title, framing, declared `artefact_id`).  
2. Assembly embeds the journal spec into the unified package and preserves valid references through design normalisation.  
3. **Normal Learning Journey Design Page commissioning** generates or revises journal specifications as part of ordinary Learning Journey design, including:  
   - selecting meaningful learner artefacts from **declared producer outputs**;  
   - writing pedagogical framing that describes the **intended** cognitive progression toward better judgement and/or capability (without claiming unverifiable cognitive improvements);  
   - producing an ordered journal the unified shell can render.  
4. Journal generate/revise reuses existing Learning Journey design information and declared constituent artefacts where possible; **must not** regenerate unchanged constituent resources merely to revise journal entries or narration.  
5. Invalid/unknown artefact references fail closed at entry render (truthful missing) without breaking package assembly.  
6. Existing journeys without journal fields package and render as before.  
7. Schema / assembly / Design Page commissioning tests green.  
8. **Hand-authored fixture specifications must not substitute** for this Design Page commissioning capability for sprint acceptance.

### M4 — Design-pattern catalogue

1. Catalogue established at `docs/design-patterns/` and linked from sprint/programme docs.  
2. Two **established** patterns fully specified: Progressive Evidence Disclosure; Draft, Judge, Revise.  
3. Ten **provisional** candidate patterns listed with distinct pedagogical mechanisms; provisional status explicit — **not** claimed technically validated or demonstrated until their demonstrators develop.  
4. Standard pattern template and standard demonstrator template published; informed by the pedagogical north star (judgement and/or capability; inspectable learner evidence).  
5. Demonstrator specs for the two reference journeys include commissioning fields, rationale, cognitive map, artefact/journal map, adaptation guidance, and a copyable Create Your Own prompt.  
6. Reuse **actual** PRISM commissioning briefs and form-field values where available; **do not invent** missing historical field values.  
7. No demonstrator website; no in-product AI brief service (PB-FA-026 remains separate).

### M5 — Integration and closure (Level 3)

1. For both established patterns, the updated design pipeline performs a fresh **journey-level design / journal generation** step from the **original Learning Journey briefs**, producing **pipeline-authored** journal specifications.  
2. Resulting journals select meaningful declared artefacts and provide pedagogically appropriate narration for:  
   - Progressive Evidence Disclosure;  
   - Draft, Judge, Revise.  
3. Existing constituent outputs and artefact contracts are **reused wherever compatible**; unified packages are **reassembled** with the revised journal specification.  
4. M5 must **not** require regenerating all constituent resources, repeating constituent commissioning/content generation, or repeating educational QA.  
5. If existing assembly APIs cannot reassemble incrementally, document the limitation and propose the smallest correction before any new mechanism (no new caching/regeneration framework).  
6. Evidence **distinguishes**:  
   - Level 1 runtime tests (hand-authored fixtures), and  
   - successful journey-level **pipeline** journal generation + incremental unified reassembly.  
7. Artefact carry-forward and standalone regressions remain green.  
8. Validation ledger complete; residual debt recorded.  
9. Formal closure decision recorded; NEXT-SPRINT updated.

---

## Task index

| ID | Title | Milestone | Status |
| -- | ----- | --------- | ------ |
| S97-T-001 | Open sprint + M1 investigation + map | M1 | **COMPLETE** |
| S97-T-002 | Resolve Q1–Q7 + amend M3/M4/M5 criteria | M1 | **COMPLETE** (S97-D03) |
| S97-T-002b | Incremental journal workflow + pedagogical north star | M1 | **COMPLETE** (S97-D04) |
| S97-T-002c | Journey data-model extensibility compatibility principle | M1 | **COMPLETE** (S97-D05) |
| S97-T-003 | Journal TOC destination + read-only view | M2 | **COMPLETE** (2026-11-12) |
| S97-T-004 | Entry population via declared producer resolve | M2 | **COMPLETE** (2026-11-12) |
| S97-T-005 | Content-fingerprint notifications + acknowledgement | M2 | **COMPLETE** |
| S97-T-006 | Absent/disabled-spec compatibility | M2 | **COMPLETE** (covered across T-003–T-005 tests) |
| S97-T-007 | Journal schema + normaliser/validator | M3 | **COMPLETE** (Design Page normalise/validate) |
| S97-T-008 | Package/shell embed of journal spec | M3 | **COMPLETE** (unified shell consumes `learning_journey.journal`) |
| S97-T-009 | Design Page journal commission/revise without constituent regen | M3 | **COMPLETE** (qualified) — emit/validate + producer enrichment; Level 3 pipeline proof deferred |
| S97-T-010 | Catalogue templates + 2 established patterns | M4 | **Deferred** |
| S97-T-011 | Ten provisional candidates (unvalidated) | M4 | **Deferred** |
| S97-T-012 | Demonstrator specs (real briefs where available) | M4 | **Deferred** |
| S97-T-013 | Journey-level journal generation from original LJ briefs + incremental reassembly | M5 | **Deferred** |
| S97-T-014 | Separate Level 1 fixture vs Level 3 pipeline evidence + regressions + closure | M5 | **PARTIAL** — closure recorded; Level 3 evidence deferred |

---

## Likely touch points (planned — not yet edited for M2+)

| Area | Files / docs |
| ---- | ------------ |
| Unified shell TOC / mount | `lib/learning-journey-unified-shell.js` |
| Artefact resolve reuse | `lib/learner-renderer-vnext/learner-artefact-contract.js` |
| Draft storage (artefact population only) | `lib/learner-renderer-vnext/learner-draft-storage.js` (+ constants/envelope) |
| Journal acknowledgement storage | New journey-scoped key — **not** constituent draft envelopes |
| Design page schema / prompts | `lib/learning-journey-design-page.js` |
| Package assembly | `lib/learning-journey-learner-package.js` |
| Catalogue | `docs/design-patterns/` |
| Tests | `tests/s97-*.test.js` (+ existing s95/s96 artefact suites) |

---

## Hard invariants

- Assessment Pack remains non-summative.  
- Constituents remain standalone-publishable.  
- No implicit sharing of undeclared learner responses.  
- No new learner-work persistence system; no AI marking of journal entries.  
- Journal remains read-only.  
- Journal development must not force full Learning Journey / constituent regeneration.  
- Do not reopen constituent educational QA for journal work.  
- Framing must not claim cognitive improvements that cannot be established from learner work.  
- No new caching system or regeneration framework for journal iteration.  
- Keep journey/artefact/journal **data contracts** separable from unified-shell presentation; evolve schemas additively with stable identities and explicit relationships ([S97-D05](decisions.md#s97-d05--learning-journey-data-model-extensibility-compatibility-principle)).  
- Do **not** implement conditional logic, branching, rules engines, or extra learner-state infrastructure in Sprint 97.
