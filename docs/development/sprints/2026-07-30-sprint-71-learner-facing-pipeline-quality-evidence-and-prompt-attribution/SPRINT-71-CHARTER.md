# Sprint 71 — Charter

**Sprint:** 71 — Learner-Facing Pipeline Quality Evidence and Prompt Attribution  
**Status:** **COMPLETE**  
**Opened:** 2026-07-30  
**Closed:** 2026-07-31  
**Predecessor close:** [Sprint 70 closure](../2026-07-28-sprint-70-visual-planning-and-synthesis/SPRINT-70-CLOSURE.md)  
**Final report:** [SPRINT-71-FINAL-REPORT.md](SPRINT-71-FINAL-REPORT.md)  
**Closure:** [SPRINT-71-CLOSURE.md](SPRINT-71-CLOSURE.md)

---

## Purpose

Sprint 71 answers:

> How can Prism itself generate better learner-facing resources?

It collects evidence from repeated benchmark and validation runs, identifies recurring quality problems, and attributes each validated finding to the canonical pipeline stage that should have prevented it.

**The sprint is not intended to rewrite the prompts.**

---

## Goals

1. Review approximately **15–20** varied Prism-generated resources using Benchmark v2.1 and Validation Review v2.0.  
2. Treat benchmark findings as hypotheses until validated.  
3. Record confirmed, partially confirmed, rejected, and newly identified findings.  
4. Attribute every validated finding to observed location, primary owning stage, contributing stages, and responsibility type.  
5. Track recurrence and attribution confidence.  
6. Retain rejected findings.  
7. Consolidate recurring **prompt-capability** themes for handover to a subsequent prompt-improvement sprint.  
8. Do **not** rewrite canonical prompts unless scope is explicitly changed mid-sprint.

---

## Primary focus stages

1. **Design Episode Plan** — archetype selection; beat order; pedagogical structure; planned cognitive progression; allocation of instructional functions  
2. **Design Learning Activities** — learner-task quality; material obligations; task clarity; cognition prompts; scaffolding; expected-output thresholds  
3. **Generate Activity Materials** — explanatory depth; worked examples; evidence/source material; tables; checklists; sufficiency; accuracy; anti-spoiler  
4. **Construct Learning Sequence** — order; pacing; transitions; activity dependencies; reinforcement; supported → independent progression  
5. **Design Page** — title; orientation; page synthesis; signposting; visual-planning metadata (**prompt-owned**). Does **not** automatically own all final-page assembly losses; distinguish Design Page prompt omission from artefact-contract, stage-handoff, deterministic page-assembly, and renderer failures (see [CONTEXT.md](CONTEXT.md)).  

### Supporting attribution stages

- Generate Learning Content  
- Model Knowledge  
- Define Learning Outcomes  

### Technical assembly / presentation (attribute separately when relevant)

- Deterministic page assembly · artefact contract · stage handoff · renderer  

### Assessment branch (separate when relevant)

- Design Assessment · Generate Assessment Items · Design Feedback · Validate Learning Design · Revise Assessment Based on QA · Design Marking Rubric  

---

## Canonical learner-page spine (default attribution path)

```text
Generate Learning Content
→ Model Knowledge
→ Define Learning Outcomes
→ Design Episode Plan
→ Design Learning Activities
→ Generate Activity Materials
→ Construct Learning Sequence
→ Design Page
```

---

## Repeatable workflow

1. Generate a Prism resource.  
2. Run Prism Resource Quality Benchmark v2.1.  
3. Run Prism Benchmark Validation Review v2.0.  
4. Compare benchmark and validation outputs.  
5. Treat benchmark findings as hypotheses until validated.  
6. Record confirmed, partially confirmed, rejected, and newly identified findings.  
7. Attribute each validated finding to: observed location · primary owning stage · contributing stage(s) · responsibility type.  
8. Update recurrence and confidence as similar findings appear (one register row per cluster).  
9. Continue across approximately 15–20 varied resources ([sample-selection-plan.md](sample-selection-plan.md)).  
10. At sprint end, identify recurring prompt capabilities for the following sprint.

---

## Out of scope

- Immediate rewriting of canonical prompts  
- Broad workflow redesign  
- Post-generation author questioning  
- Renderer redevelopment unless a genuine production defect is identified  
- Specialised features justified only by rejected findings  
- Changes based on a single unvalidated benchmark report  
- Assessment-pipeline redesign unless the selected test resource includes assessment and recurring evidence supports it  
- Changes to the domain-pack architecture unless evidence demonstrates an artefact-contract or handoff problem  

---

## Completion criteria

| Criterion | Target |
| --------- | ------ |
| Resources reviewed | Approximately **15–20** (agreed Sprint 70 decision; adjust only via explicit decision) |
| Per included resource | Benchmark v2.1 **and** Validation Review v2.0 completed |
| Register completeness | All validated findings entered |
| Attribution | Findings attributed to pipeline stages (observed / primary / contributing / responsibility type) |
| Recurrence | Recurrence fields tracked on cluster rows (first / linked reviews / last / count) + attribution confidence |
| Rejected findings | Retained in register |
| Themes | Prompt-capability themes consolidated |
| Prompt rewrites | **None**, unless scope change is explicitly approved and logged |
| Handover | Prioritised handover prepared for the subsequent prompt-improvement sprint |

---

## Inherited decisions (Sprint 70)

See [decisions.md](decisions.md) and [SPRINT-70-CLOSURE.md](../2026-07-28-sprint-70-visual-planning-and-synthesis/SPRINT-70-CLOSURE.md).

**Authoritative closure IDs:** `S70-D01` … `S70-D10`.  
**Sprint 71 aliases:** `S71-D01` … `S71-D10`.  
Do **not** treat the colliding `D70-10` … `D70-15` labels in [SPRINT-70-DECISIONS.md](../2026-07-28-sprint-70-visual-planning-and-synthesis/SPRINT-70-DECISIONS.md) as authoritative (those numbers already belong to the visual-planning track).
