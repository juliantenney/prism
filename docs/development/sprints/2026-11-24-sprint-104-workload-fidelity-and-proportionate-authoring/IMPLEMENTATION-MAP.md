# Sprint 104 — Implementation map

**Status:** **OPEN — S104-D02 AGREED; MILESTONE 1 AUTHORISED (MILESTONES 2–7 GATED ON REVIEW)**  
**Charter:** [SPRINT-104-CHARTER.md](SPRINT-104-CHARTER.md)  
**Decisions:** [S104-D01](decisions.md#s104-d01--open-sprint-104--workload-fidelity-and-proportionate-authoring) · [S104-D02](decisions.md#s104-d02--architectural-agreement-principles-a-e-and-separately-gated-milestones)  
**Investigation:** [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md)

---

## Separately gated milestone sequence

```text
104A  Investigation, C04 trace, C01/C03/C05 comparison, audit           COMPLETE (f3bb47d)
M1    Authoritative duration transport only (all 4 products + legacy)   AUTHORISED NOW -> STOP FOR REVIEW
M2    Practice Episode Plan design authority (AI-authored, validated)   GATED on M1 review
M3    Reconciliation of downstream Practice contracts                   GATED on M2 review
M4    Proportionate Learning Journey commissioning                      GATED on M3 review
M5    Workload estimation corrections                                   GATED on M4 review
M6    Live 5-, 15-, and 30-minute Practice sensitivity probes           GATED on M5 review
M7    90-min Economics regeneration, comparison, QA & learner runtime   GATED on M6 review
```

---

## Milestones

| Milestone | Scope | Agreed Principle(s) | State |
| --------- | ----- | ------------------- | ----- |
| **104A** | Pipeline trace (`C04`), systemic check (`C01`, `C03`, `C05`), contracts/validators audit | Read-only baseline | **Complete (`f3bb47d`)** |
| **M1** | Canonical Step 4 origin (`<<<COMMISSION_DURATIONS_BEGIN>>>` / `allocated_minutes`) → Step 5 Design Page → commission envelope → intake → `deliverySeed` → `resolvedFactors` → effective run context (`Duration: N minutes`) across **Expository, Practice, Assessment Pack, Situated Task**; conflict rejection & component lock; explicit `null`/unavailable legacy handling (no prose parsing); focused tests + consumer audit | **Principle A** | **Authorised now** |
| **M2** | Move Practice Episode Plan from deterministic archetype templates to AI-authored, deterministically validated Episode Plans (Assessment Pack precedent; grammar-preserving; no duration tiers/quotas/beat targets/LO grouping; protect Interactive; assess multi-LO cohesive single activity support) | **Principle B** | **Gated on M1 review** |
| **M3** | Reconcile downstream Practice contracts (`DLA`, `GAM`, `Learning Sequence`, `Design Page`) so obligations apply conditionally to EP-selected functions and redundant Interactive prescriptions (mandatory images/tips/summaries/3-criterion floors) are removed without altering standalone Interactive | **Principle C** | **Gated on M2 review** |
| **M4** | Proportionate LJ commissioning: distribute functions across journey, exploit prior learning & familiar evidence, honour Journal-from-purposeful-performance rule, avoid arbitrary component/LO/word-count quotas, surface infeasible commissions cleanly | **Principle D** | **Gated on M3 review** |
| **M5** | Fix `learning-journey-workload-feasibility-adapter.js` precedence bug, eliminate silent `interactive-workload-feasibility-adapter.js` bypasses, restore cumulative comparison vs authoritative duration, model evidence/decisions/responses/feedback, separate familiar/optional load, keep warnings advisory | **Principle E** | **Gated on M4 review** |
| **M6** | Live **5-, 15-, and 30-minute** Practice duration sensitivity probes | **Principles A–E** | **Gated on M5 review** |
| **M7** | Regenerate original 90-min *Correlation and Causation* Economics journey (retaining baseline captures intact), baseline comparison, educational QA & learner-runtime acceptance | **Principles A–E** | **Gated on M6 review** |

---

## Milestone 1 architecture summary (Duration transport)

- **Canonical origin:** Step 4 (`learning_commissions`, `lib/learning-journey-sibling-prompts.js`) emits `<<<COMMISSION_DURATIONS_BEGIN>>>` with `journey_allocated_minutes` and `commissions: [{ commission_id, allocated_minutes }]` alongside commission specifications.
- **Step 5 Design Page (`lib/learning-journey-design-page.js`):** Carries `commissions[].allocated_minutes` (and optional `learning_journey.allocated_minutes`) verbatim; never invents or re-authors duration; rejects conflicts against Step 4 and rejects non-positive/non-integer/prose values; keeps absent `allocated_minutes` valid for legacy pages.
- **Envelope → Intake → Seeding → Runtime (`lib/first-class-commission-intake.js`, `lib/first-class-workflow-family.js`, `app.js`):** Transports structured `allocatedMinutes` cleanly into `deliverySeed.commissioned_duration_minutes`, `deliverySeed.duration_minutes`, `deliverySeed.commissioned_duration_provenance`, and `resolvedFactors`.
- **Authority & projection (`app.js`):**
  - `resolveCommissionedWorkflowDurationMinutes` prefers `commissioned_duration_minutes` over mutable/fallback `duration_minutes` and returns `null` when commissioned without structured duration (zero prose parsing).
  - `ADJUSTMENTS_CAPABILITY_RESOLVERS.interactive_duration` applies to LJ-commissioned Expository components with `commissioned_duration_minutes` while leaving standalone/legacy Expository untouched (`tests/s85-wp4-capability-preservation-closure.test.js`).
  - Component authoring and component Adjustments cannot unilaterally override LJ-owned `commissioned_duration_minutes`.
- **Downstream consumers explicitly deferred to Milestones 2–5:** Practice `Design Episode Plan` (still `deterministic_derive`, excluded from `buildEffectiveWorkflowContextBlock`, Milestone 2), downstream Practice DLA/GAM/DP contracts (Milestone 3), commissioning proportionality guidance (Milestone 4), and workload estimators/adapters (Milestone 5).
