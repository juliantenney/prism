# Sprint 60 — Charter

**Sprint:** 60 — Instructional Archetype Operationalisation  
**Status:** Closed — Phases A–C complete (2026-07-15) — [SPRINT-60-CLOSURE.md](SPRINT-60-CLOSURE.md) · Successor: [Sprint 61](../2026-07-15-sprint-61-priority-1-archetype-selection-reliability/SPRINT-61-START-HERE.md)  
**Opened:** 2026-07-15  
**Predecessor:** [Sprint 59 — Instructional Content Richness Audit / Archetype Framework MVP](../2026-07-14-sprint-59-instructional-content-richness-audit/README.md)  
**Type:** Implementation + validation (production path)  
**Decisions:** [decisions.md](decisions.md)

---

## 1. Why Sprint 60 exists

Sprint 59 completed Priority-1 instructional archetype MVP validation:

| Archetype | Transfer |
| --------- | -------- |
| `mechanism_explanation` | **PASS** |
| `process_walkthrough` | **PASS** |
| `mental_model_building` | **PASS** |

Validated chain:

```text
DLA → persistence → GAM routing → generated materials
```

That proof used **lab / opt-in activation** (`S59_*_TEST` tokens and related fail-closed gates). Authors cannot yet choose instructional archetypes as a normal DLA planning capability. Delivery integrity remains fragile if caches are stale or activation is inferred from unsaved workflow titles.

**Sprint 60 operationalises what Sprint 59 proved.**

---

## 2. Goals

1. **Replace `S59_*_TEST` activation** with production archetype selection (explicit, persisted, author-facing).  
2. **Make archetype choice a normal DLA planning capability** — `instructional_archetype` + `archetype_plan` emitted and persisted without sprint-test tokens.  
3. **Preserve routing integrity through GAM** — recognition context remains unified; conditional archetype rules still reach Copy-bound prompts.  
4. **Improve observability and delivery verification** — before judging archetype *quality*, confirm routing is present in the final GAM prompt (extend/stabilize S59 snapshot / stamp patterns).  
5. **Validate mixed-archetype workflows** — one lesson with at least two Priority-1 archetypes, each delivering materials consistent with its plan.

---

## 3. Non-goals

- Renderer redesign or CSS/layout work  
- Hard capture validators without package validation strategies  
- Reopening Sprint 58 partial-page architecture (compose shrink, legacy removal, DP Phase 0/1 migration)  
- Expanding Priority-2 archetype inventory as the primary objective (`concept_exposition`, `recommendation`, `modelling_note` may be scoped only after production activation is stable)  
- Rewriting process rule wording frozen at `20260715-4` lineage without new post-delivery failure evidence  
- Weakening Evaluate / SP-02..07 / verification / transfer support  

---

## 4. Preconditions (met)

| Precondition | Evidence |
| ------------ | -------- |
| Sprint 58 partial pipeline baseline | [SPRINT-58-CLOSURE.md](../2026-07-09-sprint-58-partial-page-artefact-architecture-implementation/SPRINT-58-CLOSURE.md) |
| Priority-1 MVP routing + transfer | Sprint 59 framework / roadmap / context |
| GAM Copy recognition-context fix | `buildWorkflowStepRecognitionContext`; S59-D08 |
| Mechanism / process / mental model PASS | Sprint 59 live validation (2026-07-15) |

---

## 5. In scope

| Workstream | Intent |
| ---------- | ------ |
| Production activation | Author/DLA path selects archetype without `S59_*_TEST` |
| DLA planning | Plans validate and persist as today; emission is intentional product behaviour |
| GAM routing preservation | Keep delivery path; regression tests for shaped vs raw context |
| Observability | Reliable “did routing reach the prompt?” signals for manual and automated gates |
| Mixed-archetype validation | At least one multi-archetype lesson acceptance run |
| Docs / handoff | START HERE, briefing, decisions as work proceeds |

Optional (secondary, if primary goals land early): thin slices of fuller Priority-1 support packages (purpose…validation strategy) — not required to exit.

---

## 6. Exit criteria

- [x] Authors can select Priority-1 archetypes in normal DLA planning **without** Sprint 59 test tokens *(Phase A)*  
- [x] Selected contracts persist and route to GAM generated materials *(Phases A–C)*  
- [x] Delivery verification/observability is documented and used on acceptance runs — **Phase B**  
- [x] At least one mixed-archetype workflow validated end-to-end — **Phase C** ([PHASE-C-ACCEPTANCE.md](artefacts/mixed-archetype-acceptance/PHASE-C-ACCEPTANCE.md))  
- [x] No regression of mechanism/process/mental-model MVP behaviour on single-archetype fixtures  
- [x] Evaluate / diagnostic / verification / transfer strength not weakened *(routing unchanged)*  
- [x] Sprint docs and [current-state.md](../../current-state.md) updated for close  

### Phase A deliverables (2026-07-15)

- `lib/ld-dla-page-enrich-contract.js` — production Priority-1 planning guidance (`58-DLA-PARTIAL-2`)
- Corrected mental-model plan shape; multi-archetype pages allowed in guidance
- `tests/ld-instructional-archetype-production-planning.test.js`
- S59 token/stamp/emission helpers retained as legacy regression-only (S60-D01 / S60-D02)

### Phase B deliverables (2026-07-15)

- `window.__PRISM_FINAL_GAM_PROMPT` — durable final GAM prompt observability snapshot
- `window.__PRISM_S59_FINAL_GAM_PROMPT` — legacy alias (same object reference)
- `archetype_delivery` — expected / delivered / missing / pass from DLA SoT + final prompt
- `acceptance_rule` — do not evaluate archetype quality until `archetype_delivery.pass` is true
- `lib/ld-instructional-archetype.js` — `buildFinalGamPromptObservabilitySnapshot`, `buildArchetypeDeliveryVerification`
- `app.js` — `publishFinalGamPromptSnapshot` (GAM Copy path passes workflow for DLA page resolution)
- `tests/ld-instructional-archetype-delivery-observability.test.js`

### Phase C deliverables (2026-07-15)

- Mixed DLA artefact: [artefacts/mixed-archetype-acceptance/dla-mixed-priority1.page.json](artefacts/mixed-archetype-acceptance/dla-mixed-priority1.page.json)
- Acceptance record: [artefacts/mixed-archetype-acceptance/PHASE-C-ACCEPTANCE.md](artefacts/mixed-archetype-acceptance/PHASE-C-ACCEPTANCE.md)
- Automated gate: `tests/ld-instructional-archetype-mixed-acceptance.test.js`
- Live browser delivery check: `archetype_delivery.pass === true` for all three Priority-1 IDs; `selected_dla_test === "none"`
- Verdict: **PASS** — recommend Sprint 60 close (S60-D04)

---

## 7. Pipeline / ownership (unchanged)

```text
LO → EP shell → DLA partial → GAM partial → Assessment → LS partial → DP synthesis → deterministic assembly → render
```

| Owner | Owns |
| ----- | ---- |
| DLA | Activity scaffolds + archetype planning on `required_materials` |
| GAM | `materials[]` + conditional archetype routing |
| Assembly / Renderer | Deterministic merge / presentation only |

**Material type ≠ instructional archetype.**

---

## 8. Methodological rule (from Sprint 59)

Verify **delivery integrity** before judging **archetype quality**. Invalid tests (routing never reached the prompt) must not be recorded as teaching failures.

---

## 9. Links

- [SPRINT-60-START-HERE.md](SPRINT-60-START-HERE.md)  
- [next-chat-briefing.md](next-chat-briefing.md)  
- [Sprint 59 context](../2026-07-14-sprint-59-instructional-content-richness-audit/SPRINT-59-CONTEXT-FOR-NEW-CHAT.md)  
- [Sprint 59 roadmap](../2026-07-14-sprint-59-instructional-content-richness-audit/roadmap.md)  
- [Instructional archetype framework](../2026-07-14-sprint-59-instructional-content-richness-audit/instructional-archetype-framework.md)  
- [Sprint 59 backlog (carry-forward)](../2026-07-14-sprint-59-instructional-content-richness-audit/backlog.md)
