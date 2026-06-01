# Sprint 28 & 29 boundaries for Sprint 30

---

## Sprint 28 (closed) — cognition architecture

**Delivered:**

- Cognition **factors** (`reasoning_revision_required`, `cognitive_engagement_required`, …)
- Cognition **packs** (`peer_instruction_pack`, `self_study_cognition_pack`, `transcript_transformation_pack`, `misconception_repair_pack`)
- **DLA/GAM typed contracts** with `evaluatePedagogicCognitionContractSatisfaction`
- Topology preservation for cognition-forward briefs
- Composition parity (`mergeSelfDirectedActivityFramingFieldsIntoPageActivities`)

**Sprint 30 may:**

- Reuse existing JSON field names (`activity_preamble`, `self_explanation_prompt`, …)
- Append **additional** optional fields via PECs

**Sprint 30 may not:**

- Add new cognition packs without charter
- Rename shipped cognition fields
- Change pack detection to break workshop/peer probes

**Pack:** [`../../2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/`](../../2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/)

---

## Sprint 29 (closed) — renderer cognition semantics

**Delivered:**

- Top-level activity-row cognition fields render as `util-cognition*` blocks
- Kitchen-sink regression coverage
- No workflow or generation changes

**Sprint 30 may:**

- Add **display** for new page/activity keys if present in JSON (bounded util block)
- Extend kitchen-sink fixture with orientation fields

**Sprint 30 may not:**

- Reopen semantic CSS redesign programme
- Generate pedagogy in renderer when fields absent
- Add illustration/diagram pipeline under Sprint 30 name

**Residual (unchanged):** Cognition inside `task_cards` markdown may stay generic — row-level fields are authoritative.

**Pack:** [`../../2026-05-21-sprint-29-renderer-cognition-semantics/`](../../2026-05-21-sprint-29-renderer-cognition-semantics/)

---

## Layer split reminder

| Concern | Owner sprint |
|---------|--------------|
| What fields exist in JSON | 28 (cognition) + **30 (PEL)** |
| Whether prompts require fields | 28 contracts + **30 PECs** |
| How HTML looks | **29** (+ minimal 30 display) |
| Which steps run | 26/27/28 topology — **frozen in 30** |
