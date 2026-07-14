# Sprint 59 — Sample Selection Plan

**Goal:** A balanced, manageable set of generated lessons for richness audit.

**Status (2026-07-14):** First-audit pilot (3 lessons) complete. Expanding to the full 12–15 matrix is **optional** and does **not** block Priority 1 archetype package work ([roadmap.md](roadmap.md)). Prefer archetype-targeted acceptance samples (e.g. enzymes-like mechanism teaching) for Phase B.

**Target sample size:** **12–15** lessons (stretch to ≤20 if time allows).  
**Contingency minimum:** **7** lessons — use only if time-constrained, not as the default target.

---

## Matrix axes

| Axis | Levels |
| ---- | ------ |
| Workflow | Simple/topic · Transcript/source-ingest · Other (optional) |
| Discipline | STEM · Social science / humanities · Professional/applied |
| Outcome focus | Factual/conceptual · Applied/performance |
| Complexity | Short (1–2 activities) · Complex (3+ activities / multi-material) |
| Assessment weight | Light · Heavy |
| Scenario weight | Light · Heavy |

Every core sample should map to cells; overlaps are fine (one lesson fills multiple axes).

---

## Proposed core sample (candidate slots)

Named fixtures below are **candidate sources pending evidence verification** — confirm artefact availability, pipeline flags, and evidence status before assigning a slot. Do not treat a name as a confirmed sample until verified.

| ID | Slot intent | Workflow | Candidate sources (unverified) |
| -- | ---------- | -------- | ------------------------------ |
| S01 | Inflation / economics applied workshop | Simple | Inflation-related fixtures (verify paths + partial flags) |
| S02 | Marx / social theory self-study | Simple | Marx fixtures / self-study brief (verify) |
| S03 | RNA / biology transcript-origin | Transcript | RNA / source-ingest fixtures (verify) |
| S04 | STEM conceptual (physics/chem or similar) | Simple | Fixture or gap-fill live run |
| S05 | STEM applied (calculation / worked example heavy) | Simple | Prefer worked-example–heavy GAM (verify) |
| S06 | Professional skills / communication | Simple | Case or roleplay materials (verify) |
| S07 | Short factual (single-activity) | Simple | Thin-complexity control |
| S08 | Complex multi-activity | Simple or transcript | 3+ activities |
| S09 | Assessment-heavy formative + summative | Either | Must include design **and** items captures |
| S10 | Scenario-heavy decision set | Either | Multi-scenario materials |
| S11 | Transcript humanities / social | Transcript | Distinct from S03 |
| S12 | Facilitator vs learner profile contrast | Simple | See profile rule below |

Stretch (S13–S15): second assessment-heavy; maths/MathJax-heavy; table-heavy materials.

### Facilitator vs learner profile (S12)

| Question | Rule |
| -------- | ---- |
| Matrix coverage | Counts as **one content sample** for discipline/complexity axes if the **same generated content** is compared |
| Audit instances | **Two lesson instances** in the register (S12a facilitator, S12b learner) when both profiles exist |
| Primary audit use | **Renderer-only comparison** (class B) — requires **Full evidence** for both HTML exports |
| Richness scoring | Score **once** on shared assembled JSON if content is identical; note profile-specific renderer deltas separately |

Do not double-count S12 toward the 12–15 target unless both instances add distinct evidence.

---

## Contingency minimum (7 lessons only)

If forced to cut below 12: keep **S01, S02, S03, S05, S07, S09, S10** — still hits simple, transcript, worked example, short control, assessment-heavy, scenario-heavy. Document reduced coverage in the audit register.

---

## Live runs

| Rule | Detail |
| ---- | ------ |
| Purpose | Fill matrix gaps **only** after fixture verification fails |
| Not permitted | Re-running to obtain “better” or richer output |
| Not permitted | Prompt changes to improve samples mid-audit |
| Required record | Brief, flags (`pageEnrichmentV2`, `partialPageOutputs`), date, capture filenames |

---

## Capture checklist per selected lesson

- [ ] Workflow type + brief recorded  
- [ ] Flags: `pageEnrichmentV2`, `partialPageOutputs`  
- [ ] **Evidence status** assigned (Full / Generation-scoreable / Inventory-only / Insufficient)  
- [ ] Stage captures available (at least DLA, GAM, DP; EP; assessment if heavy)  
- [ ] Assembled page JSON path  
- [ ] Rendered HTML path (required for renderer comparison / Full evidence)  

---

## Selection rules

1. Prefer Sprint 58–era partial pipeline outputs.
2. Do not mix rollback/legacy compose outputs into the core set without labeling **legacy-control** (optional).
3. Do not regenerate with richer prompts mid-audit.
4. Record gaps: if a cell cannot be filled, document in register — do not invent ideal content.

---

## Sample register output

When audit collection begins, maintain [audit-register-template.md](audit-register-template.md) with:

- sample ID, title, workflow, **evidence status**, flags  
- artefact references per stage  
- reviewer, rubric version, audit status, finding IDs  
- assessment-heavy and renderer-comparison indicators  

Verification step (next phase): map each candidate source to confirmed paths and evidence status **before** pilot scoring.
