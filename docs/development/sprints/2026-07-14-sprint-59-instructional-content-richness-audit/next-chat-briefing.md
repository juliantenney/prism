# Sprint 59 — Briefing for New Chat

**Document role:** Concise transfer prompt to paste into a new chat. **Not** a second full specification — details live in [README.md](README.md) and linked documents.

---

## Briefing (copy below)

You are continuing PRISM / learning-design work in **Sprint 59**.

**Sprint 58 is closed.** Treat the partial-page architecture as baseline. Do **not** reopen Phase 0/1 DP migration, flag preservation, compose shrink, legacy removal, or assembly redesign.

**Do not create Sprint 60.** All remaining work stays in Sprint 59.

**Pack:** `docs/development/sprints/2026-07-14-sprint-59-instructional-content-richness-audit/`  
**Start:** [SPRINT-59-START-HERE.md](SPRINT-59-START-HERE.md)

---

### Current conclusion (locked)

Quality variation is explained primarily by **instructional-archetype support differences**, not by domain-specific GAM behaviour.

- Strong today: evidence interpretation, diagnostic reasoning, comparison, evaluation, judgement, verification, transfer  
- Weak today: concept exposition, mechanism explanation, process walkthrough, mental-model building  
- Secondary factor: domain exemplar bias (economics-heavy DEPTH exemplars)  
- No evidence of biology-specific routing or domain path divergence  

Formal audit: [instructional-archetype-audit.md](instructional-archetype-audit.md)

---

### Current priority

Design and implement the **Instructional Archetype Framework**, beginning with:

1. `mechanism_explanation`  
2. `process_walkthrough`  
3. `mental_model_building`  

Then Priority 2: `concept_exposition`, `recommendation`, `modelling_note` instructional contracts.

Workstream: [instructional-archetype-framework.md](instructional-archetype-framework.md)  
Backlog: [backlog.md](backlog.md) (S59-BL-101 … 203)

**Principle:** Material Type ≠ Instructional Archetype  
(Material type = presentation format; archetype = pedagogical function.)

Each archetype package needs: purpose · generation procedure · required components · quality criteria · anti-patterns · exemplars · validation strategy.

---

### What already happened in Sprint 59

1. First richness audit (S59-FA-01 … FA-03) — thin GAM, richer DLA  
2. Generation-constraint audit — no PRISM run-mode max_output_tokens; v2 GAM presence-only; DLA hard / GAM soft  
3. Iterations 1–7 — `LD-GAM-INSTRUCTIONAL-DEPTH` (causal chains, anti-rubric-gaming, anti-exemplar-leakage)  
4. Heteroscedasticity — strong diagnostic/evaluate behaviour (success case)  
5. Enzymes and Reaction Rates — strong pipeline, weak mechanism/process teaching  
6. Archetype prompt/validation audit → framework direction  

Also: EP `episode_plans[].activity_id` alignment fix in `lib/page-shell-create.js` (separate bugfix).

---

### Pipeline / ownership (unchanged)

LO → EP → DLA → GAM → assessment → LS → DP `page_synthesis` → assemble → render  

GAM owns `materials[]`. DLA owns activity scaffolds. Do not blur owners in findings.

---

### Preserve always

- Iterations 4–7: no Cause:/Mechanism: rubric labels; no weak/strong exemplar leakage  
- Do not weaken Evaluate / SP-02..07 / verification / transfer support  
- One primary A–F class per finding  
- Assessment design ≠ generated items  
- Sprint 58 partial-mode flags and ownership  

---

### Non-goals

No Sprint 60 · no renderer redesign · no hard richness validators without archetype definitions · no Sprint 58 architecture reopen

---

## Links

- [instructional-archetype-audit.md](instructional-archetype-audit.md)
- [instructional-archetype-framework.md](instructional-archetype-framework.md)
- [roadmap.md](roadmap.md)
- [backlog.md](backlog.md)
- [decisions.md](decisions.md)
- [SPRINT-59-CONTEXT-FOR-NEW-CHAT.md](SPRINT-59-CONTEXT-FOR-NEW-CHAT.md)
- [Sprint 58 closure](../2026-07-09-sprint-58-partial-page-artefact-architecture-implementation/SPRINT-58-CLOSURE.md)
