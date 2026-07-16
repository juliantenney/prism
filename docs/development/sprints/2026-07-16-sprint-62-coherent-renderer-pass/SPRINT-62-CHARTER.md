# Sprint 62 — Charter

**Sprint:** 62 — Coherent Renderer Pass  
**Status:** Open  
**Opened:** 2026-07-16  
**Type:** Renderer coherence pass (presentation-only)  
**Predecessor:** [Sprint 61 closure](../2026-07-15-sprint-61-priority-1-archetype-selection-reliability/SPRINT-61-CLOSURE.md)  
**Architecture baseline:** [Sprint 58 closure](../2026-07-09-sprint-58-partial-page-artefact-architecture-implementation/SPRINT-58-CLOSURE.md)  
**Decisions:** [decisions.md](decisions.md)  

---

## 1. Objective

Improve learner-facing coherence during rendering without changing educational architecture.

**Core principle:** Render for the learner, not the schema.

---

## 2. In scope

1. Remove learner-visible “What to do” section framing where it degrades flow.
2. Remove or replace generic “Output” section framing where it duplicates nearby material.
3. Hide learner-visible metadata labels that expose schema structure rather than pedagogy.
4. Interleave instructions with materials where that improves narrative learning flow.
5. Remove duplicated instructional labels that restate the same intent.
6. Improve coherence and progression while preserving deterministic ordering.
7. Preserve pedagogical sequence and all educational content.

---

## 3. Explicitly out of scope

- DLA changes  
- GAM changes  
- Archetype changes  
- Assessment generation changes  
- Persistence changes  
- Assembly changes  
- Educational architecture changes  

Also out of scope: changing SoT fields, workflow-step topology, or introducing new renderer architecture.

---

## 4. Constraints

1. No learner-content deletion; only presentation/coherence transformation.
2. No step-order mutation that violates deterministic assembly order.
3. No semantic reinterpretation of pedagogical intent.
4. Every renderer change must be auditable against before/after snapshots.
5. Preserve current instructional-archetype delivery semantics (`__PRISM_FINAL_GAM_PROMPT` observability unaffected).

---

## 5. Workstreams

### WS-A — Section framing cleanup

- Replace schema-facing wrappers with learner-facing narrative transitions.
- Remove “What to do” / generic “Output” wrappers where redundant.

### WS-B — Metadata suppression

- Hide internal metadata labels from learner view.
- Keep machine data available in JSON/assembly, but not surfaced as learner prose.

### WS-C — Interleaving and deduplication

- Improve flow by placing instruction alongside relevant materials.
- Remove duplicated instructional labels and repeated preambles.

### WS-D — Regression and evidence

- Deterministic ordering checks
- Pedagogical sequence checks
- Educational content preservation checks
- Renderer snapshot acceptance artefacts against [acceptance-evidence-pages.md](acceptance-evidence-pages.md)

---

## 6. Success evidence

A Sprint 62 renderer change is considered successful when:

- learner-facing flow is improved
- educational content is unchanged
- deterministic ordering is unchanged
- pedagogical sequence is unchanged
- no educational architecture changes are introduced

Evidence should be demonstrated through before/after renderer snapshots on the frozen baseline set ([acceptance-evidence-pages.md](acceptance-evidence-pages.md)) and documented rationale per change.

---

## 7. Exit criteria

- [ ] Learner-visible “What to do” framing removed or replaced where targeted
- [ ] Generic “Output” framing removed or replaced where targeted
- [ ] Learner-visible metadata labels suppressed where targeted
- [ ] Instruction/material interleaving improved on all four baseline acceptance pages (S62-EV-01 … S62-EV-04)
- [ ] Duplicated instructional labels reduced without content loss
- [ ] Deterministic ordering preserved
- [ ] Pedagogical sequence preserved
- [ ] Educational content preserved (no substantive loss)
- [ ] No DLA/GAM/archetype/persistence/assembly architecture changes introduced
- [ ] Sprint docs and handover updated

---

## 8. Links

- [SPRINT-62-START-HERE.md](SPRINT-62-START-HERE.md)  
- [acceptance-evidence-pages.md](acceptance-evidence-pages.md)  
- [implementation-guidance.md](implementation-guidance.md)  
- [renderer-coherence-checklist.md](renderer-coherence-checklist.md)  
- [SPRINT-62-CLOSURE.md](SPRINT-62-CLOSURE.md) _(template)_  
- [backlog.md](backlog.md)  
- [decisions.md](decisions.md)  
- [next-chat-briefing.md](next-chat-briefing.md)  
- [links-to-predecessors.md](links-to-predecessors.md)  
