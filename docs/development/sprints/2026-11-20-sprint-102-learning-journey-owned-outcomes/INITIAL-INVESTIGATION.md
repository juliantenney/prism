# Sprint 102 — Initial investigation plan (102A)

**Status:** **PLAN ONLY** — investigation not yet authorised or executed  
**Sprint:** 102 — Learning Journey–Owned Outcomes and Commission-Native Component Authoring  
**Opening:** [S102-D01](decisions.md#s102-d01--open-sprint-102)  
**Mode when authorised:** Read-only code/docs inspection — **no** application, prompt, schema, validator or workflow edits

---

## Purpose

Produce evidence for whether (and how) Learning Journeys can own a coherent outcome set, allocate outcomes to components via existing commissioning text, and allow commissioned components to start at Episode Plan with authoritative outcomes — while standalone products keep GLC → MK → DLO.

This document is the **scoped plan**. Findings belong in a later update (or a dedicated 102A report) after authorisation.

---

## Design principle (investigation lens)

The Learning Journey owns curriculum coherence; components realise their commissioned contribution.

---

## Questions to answer

1. **Where are Learning Journey outcomes currently generated and represented?**  
   Trace LJ design/DP artefacts, synthesis fields, and any LO-like structures (including absence of structured journey LOs).

2. **How are outcomes and component responsibilities allocated during journey design?**  
   Map commission rows, educational jobs, `specification_text` / `journey_context_text`, dependencies, and any outcome↔component linkage today.

3. **How are commissioning briefs constructed and passed into component workflows?**  
   Follow `commissionToIntakeEnvelope` → `intakeCommission` → `deliverySeed` / `ORIGINAL_BRIEF` / Create seed; identify what reaches child EP.

4. **How does EP currently obtain and validate structured learning outcomes?**  
   Trace STEP OUTPUT / `learning_outcomes` artefact binding, page-shell create, empty-LO failure modes, and order gates (EP after DLO).

5. **Can existing text-based commission fields supply everything EP needs without new commission JSON keys?**  
   Distinguish hard structured LO artefact shape from prose that could be validated into that shape at intake or EP entry.

6. **How to bypass GLC/MK/DLO safely for commissioned components while preserving standalone and legacy behaviour?**  
   Build on Sprint 101G (conditional Option C): readiness Ready / Needs enrichment / Requires full workflow; fail closed; no silent invention.

7. **How to preserve journey-level context, prerequisites and outcome mappings without duplicating teaching across components?**  
   Continuity, do-not-reteach, bring-forward, shared `source_context`, and Expository vs Practice centre-of-gravity.

---

## Likely code / doc surfaces (inspection checklist)

| Area | Candidate paths |
| ---- | ---------------- |
| LJ design / commissions | `lib/learning-journey-design-page.js`, sibling prompts |
| Intake / family | `lib/first-class-commission-intake.js`, `lib/first-class-workflow-family.js` |
| EP / shell / LO | `app.js` (EP derive, order gate), `lib/page-shell-create.js`, artefact-strict helpers |
| Practice / Interactive contracts | `lib/ld-practice-presentation-contracts.js`, DLA/GAM contracts |
| Prior feasibility | Sprint 101G canvas / STATUS; PRACTICE-INSTRUCTIONAL-CONTRACT §2 |
| Workload / commissioning prose | `lib/learning-journey-workload-feasibility-adapter.js` |

Refine this list during execution; do not treat it as exhaustive.

---

## Evidence constraints

- Treat successful C4 five-stage generation with **supplied structured outcomes** as **feasibility evidence**, not proof that every component can omit foundation stages.  
- Do not regenerate Lagrange / C1–C4 packages during investigation.  
- Do not invent LO statements or disciplinary content to force a Ready verdict.  
- Prefer quotes and file:line citations from current code over assumptions.

---

## Expected 102A deliverables (when authorised)

1. Dependency and data-flow map: journey outcomes → commission → child EP.  
2. Inventory: what commissions already carry vs what EP hard-requires.  
3. Minimal commission-native / journey-owned outcome contract proposal (prefer existing fields).  
4. Readiness criteria for skipping GLC/MK/DLO.  
5. Risks, provenance and backwards-compatibility notes.  
6. Smallest viable experiment recommendation (no implementation in 102A).

---

## Explicitly out of scope for 102A

- Application code, prompts, validators, schemas, workflows  
- Journey-level QA  
- Sprint 101 follow-up implementation (C4 A3 radios/prose, image-fragment hygiene, C4 render verify)  
- Commit / push
