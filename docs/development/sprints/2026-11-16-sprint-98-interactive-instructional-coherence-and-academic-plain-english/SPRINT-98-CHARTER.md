# Sprint 98 — Charter

**Sprint:** 98 — Interactive Instructional Coherence and Academic Plain English  
**Status:** **CLOSED — ACCEPTED WITH QUALIFICATIONS**  
**Opened:** 2026-11-16  
**Closed:** 2026-11-16 — [S98-D09](decisions.md#s98-d09--close-sprint-98--accepted-with-qualifications) / [SPRINT-98-CLOSURE.md](SPRINT-98-CLOSURE.md)  
**Historical close:** 2026-11-16 — [S98-D05](decisions.md#s98-d05--close-sprint-98--accepted--qualified)  
**Reopened:** 2026-11-16 — [S98-D06](decisions.md#s98-d06--reopen-sprint-98-for-m5-instructional-sequencing-resolution)  
**M5 options:** [M5-SEQUENCING-OPTIONS.md](M5-SEQUENCING-OPTIONS.md)  
**Type:** Bounded, evidence-led Interactive instructional quality — guidance verification, regeneration evaluation, then only warranted cross-stage investigation  
**Predecessor:** [Sprint 97 — CLOSED — ACCEPTED](../2026-11-12-sprint-97-learning-journal-and-design-pattern-foundations/SPRINT-97-CLOSURE.md) (qualified) — **do not reopen**  
**Successor:** [Sprint 99](../2026-11-16-sprint-99-expository-instructional-quality-and-academic-plain-english/SPRINT-99-START-HERE.md)  
**Opening:** [S98-D01](decisions.md#s98-d01--open-sprint-98--interactive-instructional-coherence-and-academic-plain-english)  
**Map:** [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md)  
**Evidence:** [EVIDENCE-REGISTER.md](EVIDENCE-REGISTER.md)  
**Start here:** [SPRINT-98-START-HERE.md](SPRINT-98-START-HERE.md)  
**Baseline HEAD:** `54774cde3810bea1f666b2456c6edff4bb6181ee`

---

## Mission

Improve the clarity, economy and pedagogical coherence of standalone Interactive resources while preserving instructional completeness, disciplinary precision and intellectual challenge.

---

## Agreed principles

1. **Standalone Interactive is the primary and most demanding test case** because it must provide a complete learning experience.
2. **Learning Journey components may rely on context and support provided elsewhere.**
3. **Academic Plain English** reduces avoidable linguistic and instructional load, not intellectual challenge.
4. **Productive repetition** supports preparation, retrieval, practice, feedback, revision or transfer; **redundant repetition** merely restates material without a distinct learning function.
5. **Knowledge Summary remains first**, with its advance-organiser and prior-knowledge activation roles preserved.
6. **DLA, GAM, Learning Sequence, Design Page, assembly and renderer have distinct responsibilities.**
7. **Reading volume and timing plausibility** remain secondary monitoring concerns, not immediate optimisation targets.
8. **Changes should be narrow, evidence-led and Interactive-specific** unless separate evidence supports broader application.

---

## Programme context

Sprints 90–97 established Learning Journey composition, unified delivery, journal foundations and related runtime quality. Parallel uncommitted Interactive work (Academic Plain English on the GAM path; commissioned-title preservation; Design Page page-synthesis role separation) produced a concrete instructional-economy case study (*Why the constraint matters*) and a guidance-only Design Page change that has **not** yet been evaluated against regenerated prose.

This sprint opens to:

- verify and baseline that work;
- evaluate the Design Page guidance change through controlled regeneration (M2 — not started at opening);
- investigate remaining cross-stage duplication or sequencing only where M2 evidence warrants it.

It does **not** reopen Sprint 96–97 deferred assurance, Interactive V2 (PB-FA-019), or Learning Journey catalogue/journal Level 3 work.

---

## Workstreams (bounded)

### A — Verification and evidence baseline (M1)

Repository state, Design Page file verification, targeted tests, evidence register, principles and milestone map.

### B — Regenerated evaluation of Design Page guidance (M2)

Controlled regeneration and educational evaluation of the Interactive Design Page role-separation guidance. **Not authorised by opening alone.**

### C — Warranted cross-stage investigation (M3)

Only if M2 evidence shows remaining instructional duplication or sequencing issues that Design Page guidance cannot address alone.

### D — Consolidation (M4)

Regression evidence, outstanding timing/monitoring questions, consolidated conclusions (completed; operational close superseded).

### E — Instructional sequencing resolution (M5)

Examine and, if authorised, apply the **smallest safe** Interactive-only correction so authored study-flow scaffold timing (especially A3/A2) can be respected in presentation — without a general sequencing engine, mandatory gates, or forcing Do-before-Learn universally. Recommendation: [M5-SEQUENCING-OPTIONS.md](M5-SEQUENCING-OPTIONS.md).

---

## Non-goals (opening + M5 bound)

- Resource regeneration (deferred to authorised M2).
- Fixing `s96-interactive-editorial-opening` figcaption failure as part of opening.
- Broad Expository / Assessment Pack / Situated Task prompt rewrites without separate evidence.
- Numerical word limits or reading-time optimisation as acceptance criteria.
- Commit, push, or interactive V2 redesign.
- Closing or altering Sprint 97 (or any prior sprint) to make room for this one.

---

## Architectural posture

- Guidance changes land in the responsible stage contract (Design Page partial contract for newly authored `page_synthesis`; GAM instructional depth for Academic Plain English materials voice).
- Upstream transport remains verbatim where required; role separation applies to **newly authored** slots.
- Knowledge Summary stays a substantive advance organiser **before** activities.
- Discovery protection, mathematical precision, accessibility and visual contracts remain intact.
- Assembly and renderer preserve stage outputs; they are not rewriting engines for instructional economy.
