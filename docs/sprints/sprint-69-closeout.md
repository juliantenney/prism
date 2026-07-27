# Sprint 69 Closeout — Archetype Grammar Validation and Learner Material Canonicalisation

**Opened:** 2026-07-23  
**Closed:** 2026-07-27  
**Type:** Architecture migration — exact validation abstraction + learner material type audit  
**Portable pack:** [docs/development/sprints/2026-07-23-sprint-69-archetype-grammar-validation/](../development/sprints/2026-07-23-sprint-69-archetype-grammar-validation/)  
**Predecessor:** [Sprint 68 closeout](sprint-68-closeout.md)  
**Successor:** [Sprint 70 — Visual Affordance Pipeline](sprint-70-visual-affordance-pipeline.md)

---

## Goals

1. Move exact Episode Plan validation from sequence enumeration to shared archetype grammar.
2. Preserve deterministic fail-closed behaviour across producer and renderer boundaries.
3. Complete the learner material canonicalisation audit on learner-renderer-vNext.
4. Reduce unsupported material surface through consolidation, not renderer proliferation.
5. Maintain certification readiness and browser/Node parity.

---

## Achievements

### Track A — Archetype grammar validation (Phases 1–6)

| Milestone | Outcome |
| --------- | ------- |
| Phase 1 | Shared FunctionEnum vocabulary module (`lib/episode-plan-v1-vocabulary.js`) |
| Phase 2 | Shared archetype grammar (`lib/episode-plan-v1-archetype-grammar.js`) |
| Phase 3 | Dual validation + parity report (`scripts/report-episode-plan-grammar-parity.js`) |
| Phase 4 | Renderer migration to grammar authority for canonical FunctionEnum |
| Phase 5 | Whole-sequence registry demotion; compatibility boundary clarified |
| Phase 5B | Journey-compressed / mixed vocabulary removed from production runtime |
| Phase 5B residual | Heteroscedasticity runstate persistence migration (`lib/episode-plan-v1-persistence-migration.js`) |
| Phase 6 | Certification closeout — corpus green under grammar authority |

Architectural result: **one educational validation route** — canonical Episode Plan → FunctionEnum → shared archetype grammar → deterministic canonical binding. `UNKNOWN_ARCHETYPE_VARIANT` retired from production validation.

### Track B — Learner material canonicalisation audit (Phases 0–8)

| Milestone | Outcome |
| --------- | ------- |
| Inventory | GAM renderer type inventory + unsupported interaction ledger regenerated |
| Phase 1 | Alias normalisation (`material_type` aliases in `parse-material.js` + `page-render-normalize.js`) |
| Phase 2–3 | Structural/workflow material leakage removed via `NON_RENDERABLE_MATERIAL_TYPES` boundary |
| Phase 4 | Card family consolidated onto shared card renderer |
| Phase 5 | Guarded compatibility for generic `table` → `table_workspace`; `worksheet` → table workspace path |
| Phase 6 | Support family: `support_note` / `support_notes` → non-renderable; obsolete `support` → unknown |
| Phase 7 | Strategy family: `strategy`, `strategy_options`, `strategies` → `task_card` alias (static exposition) |
| Phase 8 | `rubric` → `checklist` alias; structured scoring objects fail closed |
| Validation | Expanded input validation and regression coverage across phase test files |

Unsupported learner material types reduced **9 → 3** (`table`, `video`, `worksheet`). Remaining entries are **intentional** guarded compatibility or deferred future capability — not missing renderers for resolved types.

**Video** explicitly deferred as future capability (not a Sprint 69 gap).

---

## Metrics

```text
Certification: CERTIFIED
Git revision at closeout: 458b598

Workflows certified: 6
Activities certified: 25
Semantic moments: 91

text_entry workspaces: 32
table_entry workspaces: 20
ordering workspaces: 1

Beat fallbacks: 0
Materials unassigned: 0
Materials duplicated: 0

GAM unsupported learner interactions: 3 (table, video, worksheet — intentional)
Runtime compatibility entries: 0
Positive compressed fixtures: 0
Positive mixed vocabulary fixtures: 0
```

Certification command:

```bash
node scripts/certify-learner-renderer-vnext.js
```

Artefacts:

- `artifacts/learner-renderer-vnext-certification.json`
- `artifacts/learner-renderer-vnext-certification.md`
- `docs/development/sprints/2026-07-21-sprint-68-learning-coherence-narrative-flow/artefacts/gam-renderer-type-inventory.json`
- `docs/development/sprints/2026-07-21-sprint-68-learning-coherence-narrative-flow/artefacts/gam-unsupported-learner-interactions.json`

---

## Architecture summary

### Episode Plan grammar

Producer and renderer now share one canonical archetype grammar contract. Whole-sequence registry enumeration is no longer the runtime validation authority. Mixed FunctionEnum/compressed vocabulary fails closed with explicit diagnostics (`MIXED_EPISODE_PLAN_VOCABULARY`, `UNKNOWN_EPISODE_PLAN_BEAT`).

Key modules:

- `lib/episode-plan-v1-vocabulary.js`
- `lib/episode-plan-v1-archetype-grammar.js`
- `lib/learner-renderer-vnext/archetype-validation-route.js`
- `lib/episode-plan-v1-persistence-migration.js`

### Learner material canonicalisation

Material types resolve through alias normalisation → non-renderable boundary → shared renderer families. Consolidation decisions:

- **task_card** absorbs strategy/card variants
- **checklist** absorbs rubric markdown payloads
- **table_workspace** receives guarded generic table/worksheet compatibility
- **NON_RENDERABLE** absorbs structural/workflow/instructional leakage

Key modules:

- `lib/learner-renderer-vnext/parse-material.js`
- `lib/learner-renderer-vnext/validate-input.js`
- `lib/beat-material-registry.js`
- `lib/page-render-normalize.js`

No new learner renderer families were introduced during Sprint 69.

---

## Retrospective

1. **Consolidation beats proliferation.** Unsupported material count dropped through alias normalisation, non-renderable boundaries, and shared renderer families — not by adding one-off renderers per legacy token.
2. **No new renderer families.** Sprint 69 extended existing surfaces (task_card, checklist, table_workspace, card) rather than inventing parallel implementations.
3. **Remaining unsupported items are intentional.** `table`, `worksheet`, and `video` represent guarded compatibility paths or explicit future capability deferrals — not audit leftovers.
4. **Grammar validation is not fuzzy matching.** Binary rule validation moved to the correct abstraction layer without weakening diagnostics.
5. **Runstate migration matters.** Fixture migration alone did not repair interactive workflow paths; persistence migration on runstate load was required for Heteroscedasticity.

---

## Lessons learned

1. **Shared contracts prevent producer/renderer drift.** Vocabulary and grammar modules consumed by both sides eliminated reactive registry widening.
2. **Fail closed at the right boundary.** Illegal vocabulary, ambiguous payloads, and structural leakage surface as explicit errors — never silent absorption.
3. **Material audit scope is architectural.** Removing workflow tokens from the learner surface is as important as adding renderers.
4. **Certification is the release gate.** Grammar migration and material consolidation both had to pass the authoritative corpus unchanged.

---

## Deferred work (not Sprint 69 gaps)

```text
video material renderer (future capability)
API image generation
automatic Copilot integration
base64 HTML export
remote persistence / submission / grading
fuzzy archetype matching
```

---

## Recommendations for Sprint 70

1. Begin [Sprint 70 — Visual Affordance Pipeline](sprint-70-visual-affordance-pipeline.md): Prism-owned visual jobs, prompts, asset tracking, and package assembly.
2. Keep image generation external (manual/Copilot); do not scope API integration into Sprint 70.
3. Continue using linked `<img src="media/...">` references — no base64 embedding.
4. Treat Sprint 38 affordance schema (`38.4`) as the semantic authority for visual decisions.
5. Maintain certification green after visual pipeline changes.

---

## Sprint 69 Status

```text
Sprint 69

COMPLETE

Shared archetype grammar is the production validation authority.
Learner material canonicalisation audit is complete.
Unsupported material count reduced through consolidation, not renderer proliferation.
```

Next planning pack: [Sprint 70 — Visual Affordance Pipeline](sprint-70-visual-affordance-pipeline.md).
