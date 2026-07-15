# Sprint 59 — Briefing for New Chat

**Document role:** Concise transfer prompt to paste into a new chat. **Not** a second full specification — details live in [README.md](README.md) and linked documents.  
**Updated:** 2026-07-15

---

## Briefing (copy below)

You are continuing PRISM / learning-design work after **Sprint 59 Priority-1 MVP completion**.

**Sprint 58 is closed.** Treat the partial-page architecture as baseline. Do **not** reopen Phase 0/1 DP migration, flag preservation, compose shrink, legacy removal, or assembly redesign.

**Sprint 59 Priority-1 transfer validation is complete.** Proposed successor: **Sprint 60 — Instructional Archetype Operationalisation**  
([SPRINT-60-CHARTER.md](../2026-07-15-sprint-60-instructional-archetype-operationalisation/SPRINT-60-CHARTER.md)).

**Pack (historical / S59 facts):** `docs/development/sprints/2026-07-14-sprint-59-instructional-content-richness-audit/`  
**Start (S59):** [SPRINT-59-START-HERE.md](SPRINT-59-START-HERE.md)  
**Start (S60 proposed):** [SPRINT-60-START-HERE.md](../2026-07-15-sprint-60-instructional-archetype-operationalisation/SPRINT-60-START-HERE.md)

---

### Current conclusion (locked)

Quality variation is explained primarily by **instructional-archetype support differences**, not by domain-specific GAM behaviour.

- Strong historically: evidence interpretation, diagnostic reasoning, comparison, evaluation, judgement, verification, transfer  
- Priority-1 teaching MVP **validated** for:
  - `mechanism_explanation` — **PASS**
  - `process_walkthrough` — **PASS**
  - `mental_model_building` — **PASS**
- Secondary factor: domain exemplar bias (economics-heavy DEPTH exemplars)  
- No evidence of biology-specific routing or domain path divergence  

Formal audit: [instructional-archetype-audit.md](instructional-archetype-audit.md)

---

### Validated chain (2026-07-15)

```text
DLA contract generation
  → persistence (instructional_archetype + archetype_plan)
  → GAM routing
  → generated materials
```

| Component | Status |
| --------- | ------ |
| DLA contract generation | PASS |
| Contract persistence | PASS |
| Archetype routing | PASS |
| GAM Copy delivery | PASS |
| Runtime verification | PASS |
| Mechanism transfer test | PASS |
| Process transfer test | PASS |
| Mental model transfer test | PASS |

---

### Current priority → Sprint 60

Sprint 59 proved the Priority-1 contracts under opt-in / test activation (`S59_*_TEST`). **Sprint 60** should operationalise them:

1. Replace `S59_*_TEST` activation with production archetype selection  
2. Make archetype choice a normal DLA planning capability  
3. Preserve routing integrity through GAM  
4. Improve observability and delivery verification  
5. Validate mixed-archetype workflows  

Do **not** expand Priority-2 archetypes until the production activation path is solid. Fuller purpose…validation packages remain open but are secondary to operationalisation.

Workstream (S59 record): [instructional-archetype-framework.md](instructional-archetype-framework.md)  
Backlog carry-forward: [backlog.md](backlog.md) (S59-BL-101 … 203 → S60)

**Principle:** Material Type ≠ Instructional Archetype  
(Material type = presentation format; archetype = pedagogical function.)

---

### Critical process history (do not re-diagnose as rule failure)

Earlier process-validation failures were often **invalid tests**: the process rule never reached the GAM Copy prompt.

```text
outer GAM recognition = shaped context → true
inner routing context = raw step → false
→ LD-INSTRUCTIONAL-ARCHETYPE-ROUTING skipped
```

Fixed with `buildWorkflowStepRecognitionContext` unifying GAM recognition, archetype routing, and snapshot publication. The process rule (`v20260715-4` wording) was not the failure — delivery was. Preserve that delivery path.

Runtime cache-bust (S59 close):

```text
ld-instructional-archetype.js?v=20260715-5
workflow-step-recognition-context.js?v=20260715-s59-gam-ctx-1
app.js?v=20260715-s59-mental-1
```

---

### What already happened in Sprint 59

1. First richness audit (S59-FA-01 … FA-03) — thin GAM, richer DLA  
2. Generation-constraint audit — no PRISM run-mode max_output_tokens; v2 GAM presence-only; DLA hard / GAM soft  
3. Iterations 1–7 — `LD-GAM-INSTRUCTIONAL-DEPTH` (causal chains, anti-rubric-gaming, anti-exemplar-leakage)  
4. Heteroscedasticity — strong diagnostic/evaluate behaviour (success case)  
5. Enzymes and Reaction Rates — strong pipeline, weak mechanism/process teaching (pre-MVP)  
6. Archetype prompt/validation audit → framework direction  
7. MVP routing + mechanism transfer **PASS**  
8. Process transfer **PASS** + GAM Copy recognition-context fix  
9. Mental model MVP + live transfer **PASS**  

Also: EP `episode_plans[].activity_id` alignment fix in `lib/page-shell-create.js` (separate bugfix).

---

### Pipeline / ownership (unchanged)

LO → EP shell → DLA partial → GAM partial → Assessment → LS partial → DP synthesis → deterministic assembly → render  

GAM owns `materials[]`. DLA owns activity scaffolds + optional archetype plans on `required_materials`. Do not blur owners in findings.

---

### Preserve always

- Process rule version wording frozen at `20260715-4` lineage (do not rewrite without new failure evidence after delivery fix)  
- Recognition-context delivery path (`buildWorkflowStepRecognitionContext`)  
- Iterations 4–7: no Cause:/Mechanism: rubric labels; no weak/strong exemplar leakage  
- Do not weaken Evaluate / SP-02..07 / verification / transfer support  
- One primary A–F class per finding  
- Assessment design ≠ generated items  
- Sprint 58 partial-mode flags and ownership  

---

### Non-goals (carry into Sprint 60)

No renderer redesign · no hard richness validators without archetype definitions · no Sprint 58 architecture reopen · no Priority-2 expansion before production activation works

---

## Links

- [Sprint 60 charter (proposed)](../2026-07-15-sprint-60-instructional-archetype-operationalisation/SPRINT-60-CHARTER.md)
- [instructional-archetype-audit.md](instructional-archetype-audit.md)
- [instructional-archetype-framework.md](instructional-archetype-framework.md)
- [roadmap.md](roadmap.md)
- [backlog.md](backlog.md)
- [decisions.md](decisions.md)
- [SPRINT-59-CONTEXT-FOR-NEW-CHAT.md](SPRINT-59-CONTEXT-FOR-NEW-CHAT.md)
- [Sprint 58 closure](../2026-07-09-sprint-58-partial-page-artefact-architecture-implementation/SPRINT-58-CLOSURE.md)
