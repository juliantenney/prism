# Sprint 59 — Context for New Chat

**Document role:** Compact architecture and handover **facts** for a fresh conversation.  
**Not** the authoritative scope document — see [README.md](README.md).  
**Reading order:** [SPRINT-59-START-HERE.md](SPRINT-59-START-HERE.md).

**Sprint status:** In progress — Instructional Archetype Framework workstream active  
**Updated:** 2026-07-14

---

## Locked conclusion

| Claim | Status |
| ----- | ------ |
| Quality variation driven by **instructional-archetype support asymmetry** | Accepted |
| Secondary: **domain exemplar bias** | Accepted |
| Biology-specific GAM routing / path divergence | Rejected (no evidence) |
| Material type = instructional archetype | Rejected — keep separate |

See [instructional-archetype-audit.md](instructional-archetype-audit.md).

---

## Active priority

**Instructional Archetype Framework** — [instructional-archetype-framework.md](instructional-archetype-framework.md)

Start with: `mechanism_explanation` · `process_walkthrough` · `mental_model_building`  
Backlog: [backlog.md](backlog.md)

Do **not** open Sprint 60.

---

## Current architecture

```
Learning outcomes
  → Episode Plan shell
  → DLA partial
  → GAM partial
  → assessment design and assessment items
  → Learning Sequence partial
  → Design Page page_synthesis partial
  → deterministic assembly
  → render
```

**Facts (Sprint 58 baseline — do not reopen):**

- Partial mode requires `pageEnrichmentV2` + `partialPageOutputs`.
- Post-EP prompts use Copilot conversation context; PRISM does not embed fenced upstream page JSON in partial mode.
- Design Page owns `page_synthesis`; `sections[]` is optional dual-read only.
- Compose contract is **rollback/legacy only**.
- Assembly is deterministic; renderer is presentation only.

---

## Ownership

| Owner | Owns |
| ----- | ---- |
| Episode Plan (EP) | Page shell |
| DLA | `activities[]` instructional fields |
| GAM | `activities[].materials[]` |
| Assessment | Assessment design **and** generated assessment items (review separately) |
| Learning Sequence (LS) | Sequence |
| Design Page (DP) | `page_synthesis` |
| Assembly | Deterministic merge |
| Renderer | Presentation only |

---

## Sprint 58 closure (complete)

Sprint 58 is **closed** (2026-07-14). Report: [SPRINT-58-CLOSURE.md](../2026-07-09-sprint-58-partial-page-artefact-architecture-implementation/SPRINT-58-CLOSURE.md).

| SHA | Role |
| --- | ---- |
| `d5e8fbd` | Stabilisation |
| `4fb4c09` | Phase 0 partial DP contract |
| `12a447a` | Phase 1 domain §13 alignment |
| `961ba2f` | Flag preservation |
| `adbf43a` | Closure documentation |

---

## Sprint 59 progress summary

| Phase | Outcome |
| ----- | ------- |
| First audit (FA-01…03) | Class A thin GAM pattern; DLA richer than materials |
| Constraint audit | Soft GAM depth vs hard DLA scaffolds; v2 presence-only bodies |
| Iterations 1–7 | DEPTH contract; causal/anti-gaming/anti-leakage |
| Heteroscedasticity run | Success on diagnostic / evaluate archetypes |
| Enzymes run | Weak mechanism / process / concept teaching |
| Archetype audit | → Framework workstream |

Runtime touched (approved iterations + EP fix): `lib/ld-gam-instructional-depth.js`, GAM pack notes, `lib/page-shell-create.js` (`alignEpisodePlansActivityIds`), related contracts/tests.

---

## Material type vs instructional archetype

| Material types (examples) | Instructional archetypes (examples) |
| ------------------------- | ----------------------------------- |
| text, worked_example, scenario, checklist, decision_table, modelling_note, template, prompt_set | mechanism_explanation, evaluation, transfer, process_walkthrough, … |

Presentation format ≠ pedagogical function.

---

## Deferred (not current priority)

Renderer redesign · hard validators without archetype definitions · compose shrink · legacy removal · Sprint 60

---

## First actions for new chat

1. Read [next-chat-briefing.md](next-chat-briefing.md)  
2. Confirm Priority 1 package design from [backlog.md](backlog.md)  
3. Implement/design without regressing Evaluate/diagnostic support
