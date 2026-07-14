# Sprint 59 — Backlog

**Status:** Active  
**Updated:** 2026-07-14  
**Source:** [instructional-archetype-audit.md](instructional-archetype-audit.md), [instructional-archetype-framework.md](instructional-archetype-framework.md), first audit  
**Template:** [backlog-template.md](backlog-template.md)

---

## Priority 1 — Instructional Archetype Framework (teaching gap)

### S59-BL-101 — `mechanism_explanation` support package

- **Finding:** Mechanism teaching under-realises when materials use `text` / generic exposition; intervening process often omitted despite DLA specs.
- **Severity:** S2–S3
- **Frequency:** High on enzymes teaching activities; intermittent elsewhere
- **Content type:** Explanatory / mechanism
- **Canonical owner:** GAM (contract); DLA (spec obligations)
- **Primary class:** A
- **Evidence:** instructional-archetype-audit §3–§5; enzymes A2/A4; soft DEPTH vs hard Evaluate asymmetry
- **Future fix hypothesis:** Dedicated archetype package (purpose, procedure, components, criteria, anti-patterns, exemplars, validation strategy)
- **Dependency:** Framework workstream active
- **Target sprint:** Sprint 59 (in-stream)
- **Acceptance test:** Mechanism materials teach transmitting process so a learner can answer “why does the next step follow?” without inventing intermediate links; no Cause:/Mechanism: rubric mimicry

**Package deliverables:** purpose definition · generation procedure · required components · quality criteria · anti-patterns · exemplars · validation strategy

---

### S59-BL-102 — `process_walkthrough` support package

- **Finding:** Process materials collapse to numbered factual steps without expert process modelling (intermediate states, why each step matters).
- **Severity:** S2
- **Frequency:** Common on science/process topics; also in thin worked_example shells
- **Content type:** Process / worked process
- **Canonical owner:** GAM
- **Primary class:** A
- **Evidence:** audit §3 (enzyme process steps); SP-06 privileges analytic/judgement WE more than physical/biological process walkthrough
- **Future fix hypothesis:** Archetype contract distinct from generic `worked_example` checklist shape
- **Dependency:** S59-BL-101 (shared intervening-process patterns)
- **Target sprint:** Sprint 59
- **Acceptance test:** Process materials expose ordered stages + why each stage advances the process; not definition bullets labelled as steps

**Package deliverables:** purpose definition · generation procedure · required components · quality criteria · anti-patterns · exemplars · validation strategy

---

### S59-BL-103 — `mental_model_building` support package

- **Finding:** Materials name system parts (e.g. enzyme, substrate, active site) without assembling a durable working model of interactions and constraints.
- **Severity:** S2
- **Frequency:** Teaching-heavy activities under concept-heavy topics
- **Content type:** Conceptual systems / exposition
- **Canonical owner:** GAM
- **Primary class:** A
- **Evidence:** audit weak archetypes; enzymes A2 interaction teaching
- **Future fix hypothesis:** Archetype spanning `text` / `modelling_note` / diagrams-as-prose with relationship-first required components
- **Dependency:** Framework workstream
- **Target sprint:** Sprint 59
- **Acceptance test:** Learner can describe how parts interact and what constrains the system, not only label components

**Package deliverables:** purpose definition · generation procedure · required components · quality criteria · anti-patterns · exemplars · validation strategy

---

## Priority 2 — Closely related teaching / decision products

### S59-BL-201 — `concept_exposition` support package

- **Finding:** Concept bodies become glossary stacks (“definition → definition”) satisfying SP-01 connectivity weakly.
- **Severity:** S2
- **Frequency:** High across first audit + enzymes
- **Canonical owner:** GAM
- **Primary class:** A
- **Evidence:** first-audit GAM &lt;80w glossaries; audit §5 weak archetypes
- **Future fix hypothesis:** Exposition package emphasising relations, contrasts, and use-conditions — not term dumps
- **Target sprint:** Sprint 59 (after P1 design outline)
- **Acceptance test:** Exposition links ≥2 ideas with instructional consequence; not a term list

**Package deliverables:** purpose · procedure · components · criteria · anti-patterns · exemplars · validation strategy

---

### S59-BL-202 — `recommendation` support package

- **Finding:** Recommendations lean on Evaluate spillover; no dedicated instructional contract; meta “stronger recommendation” leakage historically occurred.
- **Severity:** S1–S2
- **Frequency:** Capstone / method-choice activities
- **Canonical owner:** GAM
- **Primary class:** A
- **Evidence:** Iteration 6–7 leakage; audit ranking “recommendation” low–medium
- **Future fix hypothesis:** Explicit evidence → options → justified recommendation → limitations package
- **Target sprint:** Sprint 59 (P2)
- **Acceptance test:** Recommendation prose cites evidence and trade-offs without meta quality commentary

**Package deliverables:** purpose · procedure · components · criteria · anti-patterns · exemplars · validation strategy

---

### S59-BL-203 — `modelling_note` instructional contracts

- **Finding:** `modelling_note` mapped in PRES-03 for teaching roles but has no SP depth package; often thin relative to `worked_example`.
- **Severity:** S1–S2
- **Frequency:** Medium
- **Canonical owner:** GAM
- **Primary class:** A
- **Evidence:** audit material-type map; no SP for modelling_note
- **Future fix hypothesis:** Tie modelling_note to mechanism / mental-model / criteria-exposition archetypes with typed procedure
- **Dependency:** P1 archetype packages
- **Target sprint:** Sprint 59 (P2)
- **Acceptance test:** modelling_note bodies realise assigned archetype components, not purpose restatement

**Package deliverables:** purpose · procedure · components · criteria · anti-patterns · exemplars · validation strategy

---

## Carry-forward from first audit (not superseded)

| ID | Finding | Note |
| -- | ------- | ---- |
| S59-BL-001 | GAM bodies systematically thin (&lt;80w in first audit) | Reframed: soft enforcement + archetype gaps; Iterations 1–7 improved privileged shapes |
| S59-BL-002 | Scenario placeholder thinness | Retained; DEPTH scenario exemplars help but not universal |
| S59-BL-003 | DLA–GAM support gap | Confirmed architectural; archetype packages target GAM side |
| S59-BL-004 | Assessment `explanation_or_rationale` field mismatch in first audit | Correction: field often present; feedback_display may hide |

Do not implement broad validators or critic loops until Priority 1 package designs exist.

---

## Explicitly deferred

- Renderer redesign  
- Hard richness validators without archetype definitions  
- Sprint 60 creation  
- Weakening Evaluate / diagnostic SP contracts  
