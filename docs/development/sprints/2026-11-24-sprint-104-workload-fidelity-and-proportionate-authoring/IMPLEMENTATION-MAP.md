# Sprint 104 — Implementation map

**Status:** **OPEN — PHASE 104A COMPLETE; PHASES 104B–104E GATED ON AGREEMENT**  
**Charter:** [SPRINT-104-CHARTER.md](SPRINT-104-CHARTER.md)  
**Opening:** [S104-D01](decisions.md#s104-d01--open-sprint-104--workload-fidelity-and-proportionate-authoring)  
**Investigation:** [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md)

---

## Milestone posture

```text
104A  Investigation, C04 trace, C01/C03/C05 comparison, audit       COMPLETE
104B  Duration transport + LJ commissioning proportionality         GATED (awaiting S104-D02)
104C  Duration-scaled EP/DLA/GAM/LS/DP + workload estimator fixes   GATED (awaiting S104-D02)
104D  Duration-sensitivity probes (5, 15, 30 min)                   GATED (post-104C)
104E  90-min Economics regeneration, comparison, QA & runtime       GATED (post-104D)
```

---

## Milestones

| ID | Milestone | Scope | State |
| -- | --------- | ----- | ----- |
| **104A** | Pipeline trace (`C04`), systemic check (`C01`, `C03`, `C05`), contracts/validators audit, proposed interventions | Read-only + sprint pack | **Complete** |
| **104B** | Structured `allocated_minutes` → `resolvedFactors.duration_minutes` transport; LJ commissioning viability & outcome/journal proportionality | LJ prompts, intake, workflow family, `app.js` | **Pending S104-D02** |
| **104C** | Duration- & product-aware Episode Plan (`deriveEpisodePlansFromLearningOutcomes`); Practice DLA/GAM/LS/DP scaling + `guided-review-generation-contract.js` gate; workload adapter bug fix & demand coverage | `lib/episode-plan-*.js`, `lib/ld-*.js`, `lib/guided-review-generation-contract.js`, `lib/workload-*.js`, `app.js` + focused tests | **Pending S104-D02** |
| **104D** | Equivalent learning-purpose sensitivity probes at **5 min**, **15 min**, and **30 min** | Live authoring + workload verification | **Pending 104C** |
| **104E** | Regenerate *Correlation and Causation: Making Sense of Economic Evidence* (retaining 90-min authoritative total & baseline captures untouched); baseline comparison; educational QA + learner-runtime acceptance | Journey regeneration + QA + runtime | **Pending 104D** |

---

## Observable acceptance criteria (planned post-agreement)

1. **Duration sensitivity (5 / 15 / 30 min):** Three equivalent-purpose Practice resources clearly scale activity structure, evidence dataset count, decision complexity, constructed-response scope, and feedback/checklist load rather than merely truncating prose, while remaining pedagogically complete and constructively aligned.
2. **Authoritative duration continuity:** Commissioned Practice workflows carry numeric `resolvedFactors.duration_minutes`, surface authoritative Duration in step prompts, emit per-activity and total `learning_sequence` durations, and trigger active duration compliance + cumulative workload checks.
3. **90-minute Economics regeneration:** Regenerated journey retains the authoritative 90-minute total, preserves educational progression and quality, eliminates disproportionate 8-minute double-activity/6-criterion overload, and preserves pre-intervention baseline captures intact.
4. **Non-regression:** Standalone Interactive workflows, existing non-commissioned workflows, and all four LJ product runtime contracts remain intact; non-goals (`PB-S-008`, `PB-FA-018`, new interaction types, snapshot persistence, renderer refactoring, automatic duration rewriting) remain untouched.
