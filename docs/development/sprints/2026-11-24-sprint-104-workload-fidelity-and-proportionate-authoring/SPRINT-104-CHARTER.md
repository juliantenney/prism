# Sprint 104 — Charter

**Sprint:** 104 — Workload Fidelity and Proportionate Authoring  
**Status:** **OPEN — PHASE 104A INVESTIGATION COMPLETE**  
**Opened:** 2026-11-24  
**Baseline:** `1515cd4`  
**Primary backlog item:** [PB-FA-025](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-025--duration-fidelity-learner-workload-budgeting)  
**Opening:** [S104-D01](decisions.md#s104-d01--open-sprint-104--workload-fidelity-and-proportionate-authoring)  
**Map:** [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md)  
**Investigation:** [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md)

---

## Objective

Ensure PRISM designs educationally complete learning experiences proportionate to their authoritative study duration, preserving the established pedagogical architecture and educational quality.

---

## Reference case (pre-intervention baseline — retain intact)

**Journey:** *Correlation and Causation: Making Sense of Economic Evidence*  
**Authoritative duration:** 90 minutes across two weeks

**Existing baseline observables:**

- Six commissioned components (`C01`–`C06`)
- Eight Practice activities (`C01`, `C03`, `C04`, `C05` — 2 Practice activities per Practice component)
- Ten substantive constructed responses
- Eight Learning Journal contributions
- Strong educational progression and formative feedback
- Substantial concerns about learner workload feasibility (e.g. `C04` *Comparing competing economic explanations* allocated 8 minutes, yet authored as 2 substantial activities, 2 datasets, 180–280 words of constructed response, structured decisions, and 6 diagnostic review criteria; `C01` authored at 5,264 words, 5 datasets, 5 selection controls, 2 constructed responses, and 6 diagnostic criteria)

Retain the existing journey and captures untouched as the pre-intervention reference case.

---

## Design principles

1. **Duration is an authoritative design constraint.**
2. **Short learning experiences can be pedagogically complete.**
3. **Scale the learning design**, rather than simply shortening its prose.
4. **Account for** evidence inspection, reasoning, writing, decisions, and feedback engagement.
5. **Distinguish** familiar material from new material, and optional support from expected study.
6. **Preserve** educational purpose, constructive alignment, and meaningful learner performance.

---

## Scope & first phase

### Phase 104A (authorised at opening — investigation only)

Trace `C04` (*Comparing competing economic explanations*, 8 min) through the complete commissioning and authoring pipeline:

- Journey planning and duration allocation
- Commission scope and Learning Journey Design Page metadata
- Commission-native intake
- Design Episode Plan
- Design Learning Activities
- Generate Activity Materials
- Construct Learning Sequence
- Design Page
- Existing workload estimation and validation mechanisms

Compare with `C01`, `C03`, and `C05` to establish whether activity proliferation and workload expansion are systemic, and identify prompt instructions, contracts, and validators that support or undermine proportionate authoring.

### Planned post-agreement acceptance (Phases 104B–104E; gated on intervention agreement)

1. Test duration sensitivity using equivalent learning purposes with **5-, 15-, and 30-minute** constraints.
2. Regenerate the economics journey from its original brief, retaining the authoritative **90-minute** total while allowing PRISM to reconsider component count, allocations, and activity structure.
3. Compare the regenerated journey against the existing baseline.
4. Complete educational QA and learner-runtime acceptance.

---

## Explicit non-goals

- New pedagogical capabilities
- New interaction types
- Shared statistical visualisation architecture ([PB-FA-018](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-018--shared-data-and-mathematical-visualisation))
- Snapshot persistence
- General renderer refactoring
- Resolution of [PB-S-008](../../../backlog/PRODUCT-BACKLOG.md#pb-s-008--full-suite-pre-existing-failures-technical-debt)
- Automatic changes to authoritative duration allocations

---

## Guardrails

- Do **not** modify authoring prompts, contracts, validators, `app.js`, `lib/`, or tests during `104A` investigation.
- Do **not** regenerate the economics journey or mutate baseline captures during `104A`.
- Preserve standalone Interactive and existing non-commissioned workflows without regression.
