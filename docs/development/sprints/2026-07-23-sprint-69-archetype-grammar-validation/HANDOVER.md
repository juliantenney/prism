# Sprint 69 Handover — Archetype Grammar Validation

**Related:** [SPRINT-69-START-HERE.md](SPRINT-69-START-HERE.md) · [WHY-SPRINT-69.md](WHY-SPRINT-69.md) · [CONTEXT.md](CONTEXT.md) · [GOALS.md](GOALS.md) · [PLAN.md](PLAN.md)

---

## Executive summary

After Sprint 68, learner-renderer-vNext is production certified, architecturally documented, and release-ready.  
Post-closeout, the immediate Educational Psychology defect was repaired by enforcing Episode Plan vocabulary upstream, preserving canonical plans through assembly, and keeping renderer validation fail-closed.

Sprint 69 addresses the remaining architectural limitation: exact validation currently operates over enumerated whole beat arrays instead of a shared archetype grammar.

See [WHY-SPRINT-69.md](WHY-SPRINT-69.md) for the architectural rationale.

---

## Architecture Principles

These principles underpin the platform and govern all sprints, including Sprint 69.

1. **Educational semantics are authored exactly once.**  
   Pedagogical meaning is defined upstream; downstream stages consume it without re-authoring.

2. **Episode Plan is the sole owner of archetype and beat semantics.**  
   Archetype selection and beat sequence authority live in Episode Plan capture and validation.  
   See [Episode Plan ownership boundary](../../../architecture/episode-plan-ownership-boundary.md).

3. **Downstream stages may enrich educational content but must never reinterpret pedagogy.**  
   DLA, manifestation, and assembly add instructional fields and materials; they do not replan beats or invent archetypes.

4. **Validation and manifestation are separate responsibilities.**  
   Contracts validate legality; manifestation delivers content. Neither substitutes for the other.

5. **The renderer consumes educational semantics; it does not create them.**  
   See [ADR-012](../../../architecture/adr/ADR-012-learner-renderer-interprets-educational-semantics.md).

6. **Deterministic behaviour is preferred over convenience.**  
   Predictable outcomes, explicit diagnostics, and reproducible certification outweigh heuristic rescue.

7. **Unknown educational semantics fail closed.**  
   Illegal vocabulary, unregistered variants, and ambiguous assignments surface as explicit errors — never silent fallbacks.

8. **Grammar validation is not fuzzy matching.**  
   Exact validation moves from sequence enumeration to shared archetype grammar. Validity remains binary and rule-based.

---

## Completed work (through Sprint 68 + post-closeout repair)

### Sprint 68 achievements

- learner-renderer-vNext composition model (Orient / Learn / Do / Check)
- capability-based learner surfaces (`text_entry`, `table_entry`, `ordering`)
- browser/runtime parity and local draft persistence
- production certification runner + corpus
- architecture reference and diagnostics reference
- ADR-012 accepted
- Sprint 68 closeout marked COMPLETE

Reference: [sprint-68-closeout.md](../../../sprints/sprint-68-closeout.md)

### Post-Sprint repair (separate from Sprint 69)

Root cause and repair were completed after Sprint 68 closeout:

- root cause: non-canonical beat vocabulary entered at Episode Plan capture (`consolidation`, etc.)
- evidence captured from live Educational Psychology runstate and stage partials
- FunctionEnum validation added at shell/capture boundary
- canonical derive fallback added when LO step capture is empty but LOs exist in EP shell
- assembly merge protection prevents downstream overwrite of `activity.episode_plan`
- renderer compatibility updated with exact Episode Plan V1 variants (evidence-backed)
- regression fixture and tests added

Reference: [episode-plan-ownership-boundary.md](../../../architecture/episode-plan-ownership-boundary.md)

---

## Current architecture (authoritative flow)

```text
Learning Outcomes
↓
Episode Plan
↓
DLA
↓
Manifestation
↓
Assembly
↓
Learner Renderer
↓
Browser Runtime
```

### Ownership by stage

- **Learning Outcomes:** pedagogic intent inputs
- **Episode Plan:** archetype + beat sequence authority
- **DLA:** learner task scaffolds, activity pedagogy fields
- **Manifestation/GAM:** material bodies and interaction-ready content
- **Assembly:** deterministic merge preserving upstream ownership contracts
- **Learner renderer:** deterministic interpretation/composition + surface rendering
- **Browser runtime:** interaction behaviour + local drafts (no pedagogy ownership)

---

## Known architectural limitation

Current renderer variant binding still relies on exact whole-sequence registry matching.  
This is transitional because:

1. producer-side semantics are validated at vocabulary/contract level;
2. composition already uses role semantics;
3. sequence enumeration does not scale as the stable long-term abstraction.

This is documented and intentionally deferred to Sprint 69. See [WHY-SPRINT-69.md](WHY-SPRINT-69.md).

---

## Sprint 69 mission

Move exact validation from sequence enumeration to shared archetype grammar while preserving deterministic fail-closed behaviour.

**This is NOT fuzzy matching.**

---

## Entry criteria (ready now)

- Certification status: **CERTIFIED** (`artifacts/learner-renderer-vnext-certification.md`)
- Certification corpus metrics: 6 workflows, 25 activities, 88 moments
- Architecture docs green (`tests/learner-renderer-vnext-architecture-docs-imp021.test.js`)
- Educational Psychology contract regression green (`tests/educational-psychology-episode-plan-contract.test.js`)
- Renderer vNext suite green in current repo baseline (`tests/learner-renderer-vnext*.test.js`)
- Episode Plan ownership boundary documented
- Latest known renderer suite metric: 476 pass / 0 fail

---

## Sprint 69 Definition of Done

Authoritative completion checklist. Outcome-oriented; implementation details belong in [PLAN.md](PLAN.md) and [TASKS.md](TASKS.md).

- [ ] Renderer no longer depends on exact whole-sequence registry as runtime authority.
- [ ] Producer and renderer share one canonical archetype grammar.
- [ ] Valid unseen Episode Plans (FunctionEnum-compliant, grammar-legal) render successfully.
- [ ] Invalid Episode Plans fail with precise, ownership-aware diagnostics.
- [ ] Educational Psychology regression passes unchanged.
- [ ] Certification corpus passes unchanged.
- [ ] Browser and Node behaviour remain equivalent.
- [ ] Exactly-once assignment guarantees are preserved.
- [ ] Whole-sequence registry is no longer the runtime validation authority.
- [ ] Architecture documentation and ADR references updated to reflect grammar as the contract.

---

## Navigation

| Document | Purpose |
| --- | --- |
| [SPRINT-69-START-HERE.md](SPRINT-69-START-HERE.md) | Fast onboarding |
| [WHY-SPRINT-69.md](WHY-SPRINT-69.md) | Architectural rationale |
| [CONTEXT.md](CONTEXT.md) | Engineering context for new sessions |
| [GOALS.md](GOALS.md) | Sprint objectives and non-goals |
| [PLAN.md](PLAN.md) | Phased implementation roadmap |
| [TESTING.md](TESTING.md) | Test strategy and gates |
