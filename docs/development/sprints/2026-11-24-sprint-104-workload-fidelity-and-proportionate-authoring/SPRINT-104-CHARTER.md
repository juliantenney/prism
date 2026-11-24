# Sprint 104 — Charter

**Sprint:** 104 — Workload Fidelity and Proportionate Authoring  
**Status:** **OPEN — S104-D02 AGREED; MILESTONE 1 AUTHORISED**  
**Opened:** 2026-11-24  
**Baseline:** `1515cd4` (`104A` committed at `f3bb47d`)  
**Primary backlog item:** [PB-FA-025](../backlog/PRODUCT-BACKLOG.md#pb-fa-025--duration-fidelity-learner-workload-budgeting)  
**Decisions:** [S104-D01](decisions.md#s104-d01--open-sprint-104--workload-fidelity-and-proportionate-authoring) · [S104-D02](decisions.md#s104-d02--architectural-agreement-principles-a-e-and-separately-gated-milestones)  
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

## Agreed architectural principles ([S104-D02](decisions.md#s104-d02--architectural-agreement-principles-a-e-and-separately-gated-milestones))

1. **A. Authoritative duration:** Learning Journey owns commissioned component duration (`Step 4` origin → `Design Page` → intake → seeding → run context) across all four commissioned product families, with no prose fallback for legacy commissions, explicit distinction between allocated duration / designed duration / estimated workload, and no unilateral override by component authoring.
2. **B. Practice Episode Plan design authority:** AI-authored, deterministically validated Episode Plans (Assessment Pack precedent) responding to purpose, outcomes, duration, prior learning, and journey context — no fixed duration tiers, quotas, beat targets, or deterministic LO grouping; standalone Interactive protected.
3. **C. Conditional pedagogical obligations:** DLA and GAM realise selected pedagogical functions rather than enlarging the design; quality contracts apply conditionally; editorial furniture is optional for Practice; prefer removing redundant prescriptions over adding compensatory exceptions.
4. **D. Proportionate journey commissioning:** Distribute functions across the journey; exploit prior learning and familiar evidence; avoid arbitrary component/outcome/word-count quotas; keep Journal purposeful without driving extra writing; surface infeasibility rather than mutating parameters.
5. **E. Workload estimation:** Fix estimator defects and silent bypasses; compare cumulative effort (evidence, decisions, responses, feedback) against authoritative duration; separate familiar/new and expected/optional study; keep warnings advisory and distinct from structural duration compliance.

---

## Separately gated milestone programme

1. **104A — Investigation & sprint pack:** **Complete (`f3bb47d`)**.
2. **Milestone 1 — Authoritative duration transport:** **Authorised now** (stop for review before Milestone 2; do not commit implementation changes prematurely).
3. **Milestone 2 — Practice Episode Plan design authority:** **Gated on Milestone 1 review**.
4. **Milestone 3 — Reconciliation of downstream Practice contracts:** **Gated on Milestone 2 review**.
5. **Milestone 4 — Proportionate Learning Journey commissioning:** **Gated on Milestone 3 review**.
6. **Milestone 5 — Workload estimation corrections:** **Gated on Milestone 4 review**.
7. **Milestone 6 — Live 5-, 15-, and 30-minute Practice sensitivity probes:** **Gated on Milestone 5 review**.
8. **Milestone 7 — Regeneration of 90-minute Economics journey, baseline comparison, QA & learner-runtime acceptance:** **Gated on Milestone 6 review**.

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

- Strictly respect milestone gating: in **Milestone 1**, implement **duration transport only**; do not touch Episode Plan derivation, downstream Practice pedagogical contracts, broader commissioning proportionality, or workload estimators yet.
- Do **not** regenerate the economics journey or mutate baseline captures during Milestones 1–6.
- Preserve standalone Interactive and existing legacy/non-commissioned workflows without regression.
