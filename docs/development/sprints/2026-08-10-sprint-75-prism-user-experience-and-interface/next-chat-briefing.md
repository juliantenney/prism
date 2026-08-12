# Sprint 75 — Next-chat briefing

**Audience:** Fresh session (coding agent or product conversation).  
**Sprint status:** **COMPLETE / Closed** (2026-08-12)  
**Final report:** [SPRINT-75-FINAL-REPORT.md](SPRINT-75-FINAL-REPORT.md)  
**Handover:** [HANDOVER.md](HANDOVER.md)

---

## Immediate instruction

> **Sprint 75 is complete. Begin next with the Lagrangian Multipliers resource quality investigation. Settings follows after that.**

---

## Lagrangian Multipliers — investigation context

A PRISM-generated Lagrangian Multipliers resource scored **much lower** on QA/benchmark than peer resources. That matters for retention: weak first-run output may prevent users returning.

**Investigate systematically before changing prompts or workflows.**

Trace: input → outcomes → plan → content → activities → practice/assessment → maths/reasoning → scaffolding → evidence use → prompts → upstream artefacts → QA report.

Classify root cause among: input weakness · workflow/design · single prompt · upstream propagation · model variance · benchmark calibration · genuine pedagogical weakness.

Known benchmark finding (hypothesis only): missing independent Lagrangian-construction practice.

---

## After Lagrangian — Settings

[PB-FA-005](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-005--workflow-settings--parameterisation-source-of-truth-and-runtime-consistency) — parameter source-of-truth + Settings IA. Investigation largely done in Sprint 75; implementation deferred intentionally.

---

## Sprint 75 delivered (do not redo)

| Surface | Highlights |
| ------- | ---------- |
| **Create** | One product; essentials brief; Proposed workflow; Save Workflow; assistant progressive disclosure |
| **My Workflows** | Run UX; display-only progress; persisted-output dots; lifecycle CRUD; control groups |
| **Run persistence** | IndexedDB captures — **SETTLED** (`S75-D21`) |
| **Prompt Studio** | Paste default; Generate progressive; Library.savePrompt for standalone |
| **Prompt Library** | Header actions grouped; Copy prompt primary |

Decisions: [decisions.md](decisions.md) through `S75-D32`.

---

## Do not

- Reopen Sprint 75 UX work without new authorisation  
- Reopen persistence architecture casually  
- Start Settings before Lagrangian investigation  
- Open Sprint 76  

---

## Testing (closeout)

- Sprint 75 regression batch: **114 / 114 pass**  
- `s75-d26-compact-prism-status-control.test.js`: stale cache-bust assertion (test maintenance)  
- `workflow-design-page-upstream-prompt.test.js`: **3 / 3 pass** (prior `visual_need` issue not reproduced)
