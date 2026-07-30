# Sprint 71 — Handover Pack

**Sprint:** 71 — Learner-Facing Pipeline Quality Evidence and Prompt Attribution  
**Pack date:** 2026-07-30  
**Predecessor close:** [Sprint 70 closure](../2026-07-28-sprint-70-visual-planning-and-synthesis/SPRINT-70-CLOSURE.md) · [sprint-70-closeout.md](../../../sprints/sprint-70-closeout.md)

---

## Executive summary

Sprint 70 closed after establishing a systematic QA approach for Prism-generated learning resources. Sprint 71 gathers validated evidence across approximately 15–20 resources and attributes findings to canonical Learning Design stages. Prompt rewrites are deferred to a later sprint.

---

## Inherited from Sprint 70

### Outcomes to rely on

- Prism Resource Quality Benchmark **v2.1**
- Prism Benchmark Validation Review **v2.0**
- Production vs instructional finding separation
- Production severity / release caps only for genuine production defects
- Educational priority for instructional findings
- Independent validation posture (confirm / partial / reject / new)
- Agreement to improve learner-facing generation prompts after evidence — not via workflow redesign or renderer-first work
- Stage attribution before prompt change
- Learning Design pipeline architecture map (domain pack) — formal Sprint 71 copy: [learning-design-pipeline-attribution-map.md](learning-design-pipeline-attribution-map.md)

### Binding decisions (authoritative IDs)

Use **`S70-D01` … `S70-D10`** from [SPRINT-70-CLOSURE.md](../2026-07-28-sprint-70-visual-planning-and-synthesis/SPRINT-70-CLOSURE.md).  
Sprint 71 aliases: **`S71-D01` … `S71-D10`**.  
Do **not** cite the colliding `D70-10` … `D70-15` closure labels in [SPRINT-70-DECISIONS.md](../2026-07-28-sprint-70-visual-planning-and-synthesis/SPRINT-70-DECISIONS.md) as authoritative.

| Authoritative ID | Decision |
| ---------------- | -------- |
| S70-D01 | No authoring-workflow redesign in Sprint 71 |
| S70-D02 | No post-generation author questioning in this workstream |
| S70-D03 | Workflow observations log-only |
| S70-D04 | Author observations log-only |
| S70-D05 | Retain rejected findings |
| S70-D06 | Evidence/attribution sprint |
| S70-D07 | No premature prompt rewrite |
| S70-D08 | ~15–20 resources before prompt sprint |
| S70-D09 | Observation ≠ ownership |
| S70-D10 | Multi-field attribution |

Full list: predecessor [SPRINT-70-CLOSURE.md](../2026-07-28-sprint-70-visual-planning-and-synthesis/SPRINT-70-CLOSURE.md).

---

## What Sprint 71 does / does not do

| Does | Does not |
| ---- | -------- |
| Generate resources and run Benchmark + Validation | Rewrite canonical prompts (default) |
| Validate and classify findings | Redesign authoring workflow |
| Attribute to pipeline stages / assembly / renderer correctly | Add post-generation author Q&A |
| Track recurrence and confidence (cluster register) | Treat rejected findings as feature requests |
| Consolidate prompt-capability themes for handover | Cap release on instructional educational-priority items |

---

## Primary stages under investigation

1. Design Episode Plan  
2. Design Learning Activities  
3. Generate Activity Materials  
4. Construct Learning Sequence  
5. Design Page (**prompt**: title / orientation / visual-plan — not automatic assembly ownership)  

Supporting: Generate Learning Content · Model Knowledge · Define Learning Outcomes  
Technical layers when relevant: artefact contract · stage handoff · deterministic page assembly · renderer  
Assessment branch: separate when present  

---

## How to continue in a new chat

1. Paste [next-chat-briefing.md](next-chat-briefing.md).  
2. Read [CONTEXT.md](CONTEXT.md) then [SPRINT-71-CHARTER.md](SPRINT-71-CHARTER.md).  
3. Complete Phase 0 paths in [STATUS.md](STATUS.md) before counting Review 1.  
4. Maintain [sample-selection-plan.md](sample-selection-plan.md).  
5. Use [review-logging-template.md](review-logging-template.md) and update [improvement-register.md](improvement-register.md).  
6. Do not implement prompt changes unless a Sprint 71 decision explicitly expands scope.

---

## Known gaps at sprint open

| Gap | Impact |
| --- | ------ |
| Benchmark v2.1 / Validation Review v2.0 paths not yet recorded in-repo | **Phase 0 gate** — Review 1 must not be counted until paths + versions are in STATUS |
| Architecture map path may be unset | **Resolved** — [learning-design-pipeline-attribution-map.md](learning-design-pipeline-attribution-map.md) |
| Sprint 70 visual-planning slice log unreconciled | Not Sprint 71 primary; ignore unless a production renderer defect appears |

---

## Successor expectation (after Sprint 71)

A **prompt-improvement sprint** that consumes consolidated prompt-capability themes with recurrence and confidence evidence — not single-resource anecdotes.
