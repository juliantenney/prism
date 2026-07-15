# Sprint 59 — Definition of Done

Sprint 59 completes in **phases**. Diagnostic exit does not close the sprint while the Instructional Archetype Framework Priority-1 MVP remains open.

**Updated:** 2026-07-15

## Phase A — Diagnostic richness audit (largely complete)

### Sample and inventory

- [x] Representative first-audit sample reviewed (S59-FA-01 … FA-03) — [FIRST-AUDIT-SUMMARY.md](FIRST-AUDIT-SUMMARY.md)
- [x] Major content types inventoried for first-audit sample
- [x] Quantitative length clusters recorded (&lt;80w GAM pattern)
- [ ] Full 12–15 lesson matrix (deferred / optional — not required to proceed with archetype work)

### Rubric and evidence

- [x] Richness rubric defined ([content-type-rubric.md](content-type-rubric.md))
- [x] Thin-content examples documented (first audit + enzymes)
- [x] Acceptable examples documented (heteroscedasticity diagnostic/evaluate; workshop Marx worked steps)
- [x] Generation-primary classification for first-audit findings ([findings/](findings/))
- [x] Generation-constraint audit complete ([GENERATION-CONSTRAINT-AUDIT.md](GENERATION-CONSTRAINT-AUDIT.md))
- [x] Instructional archetype audit complete ([instructional-archetype-audit.md](instructional-archetype-audit.md))

### Assessment

- [x] Assessment items reviewed for FA samples with items
- [x] Feedback field correction noted (`explanation_or_rationale` vs display)
- [ ] Full LO↔activity↔material↔item chain triples for all assessment-heavy samples (optional backlog for later lessons)

### Diagnostic outputs

- [x] Prioritized backlog produced ([backlog.md](backlog.md))
- [ ] Renderer sprint input pack — deferred until Full HTML evidence samples
- [x] Rubric used on pilot-scale sample
- [x] Decision records updated ([decisions.md](decisions.md))
- [x] Formal archetype audit document filed

## Phase B — Instructional Archetype Framework (Priority-1 MVP complete)

### MVP path (mechanism + process + mental model)

- [x] Priority-1 MVP routing wired (`lib/ld-instructional-archetype.js`)
- [x] DLA contract generation + persistence for optional archetype plans
- [x] Archetype routing on GAM
- [x] GAM Copy delivery (recognition-context fix; clipboard receives routing)
- [x] Runtime verification (`?v=20260715-5` archetype · `?v=20260715-s59-gam-ctx-1` recognition · `?v=20260715-s59-mental-1` app)
- [x] Mechanism transfer test **PASS**
- [x] Process transfer test **PASS** (rule wording `v20260715-4`)
- [x] Mental model transfer test **PASS**
- [x] Validated chain: DLA → persistence → GAM routing → generated materials
- [x] Iterations 4–7 anti-gaming and anti-exemplar-leakage preserved
- [x] Sprint 58 pipeline ownership preserved
- [x] Sprint docs and handoff updated at MVP completion (2026-07-15)
- [x] Proposed Sprint 60 charter filed — [SPRINT-60-CHARTER.md](../2026-07-15-sprint-60-instructional-archetype-operationalisation/SPRINT-60-CHARTER.md)

### Full packages / production path (carry-forward)

- [ ] Priority 1 packages fully designed: purpose · procedure · components · criteria · anti-patterns · exemplars · validation strategy (beyond MVP routing/transfer) — **Sprint 60+**
- [ ] Production archetype selection (replace `S59_*_TEST`) — **Sprint 60**
- [ ] Priority 2 packages scoped: `concept_exposition`, `recommendation`, `modelling_note` contracts — **after operationalisation**
- [ ] Implementation of fuller packages without regressing Evaluate / diagnostic / verification / transfer support

## Explicit non-requirements (still)

- Shipping renderer redesign
- Hard validators without archetype package definitions
- Closing Deferred Sprint 58 architecture follow-ons
- Documenting-only closure that ignores the archetype workstream
- Rewriting process rule `v20260715-4` wording without new post-delivery-failure evidence
