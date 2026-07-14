# Sprint 59 — Existing Workflow Evidence Inventory

**Date:** 2026-07-14  
**Phase:** Evidence preparation (historical snapshot — first-audit inputs)  
**Later note:** Heteroscedasticity and Enzymes live runs used for comparative/archetype investigation were **not** permanently inventoried here; conclusions live in [instructional-archetype-audit.md](instructional-archetype-audit.md).  
**Source:** Edge browser `localStorage` for `http://localhost` — `promptr.workflows.v1` + `promptr.workflows.runstate.v1`  
**Note:** Cursor embedded browser contains a different single smoke-test workflow and was **not** used as the inventory source.

Captures live in **runstate**, not inline on workflow objects (`workflowRunCapturedOutputs` on workflow records is empty). Artefact presence below is from non-empty runstate `capturedOutputs` only. Empty strings count as **Missing**.

No instructional-quality judgements in this document.

---

## 1. Workflow inventory

| Workflow ID | Title / topic | Workflow type | Status | Pipeline version | Flags visible | EP | DLA | GAM | Assessment design | Assessment items | LS | DP | Assembled page JSON | Rendered HTML | Evidence status | Notes |
| ----------- | ------------- | ------------- | ------ | ---------------- | ------------- | -- | --- | --- | ----------------- | ---------------- | -- | -- | ------------------- | ------------- | --------------- | ----- |
| `ba3f2a76-b12c-45f5-b99e-f14558023681` | WasMarxRight (self-study; Marx) | Simple (topic; metadata) | Complete | Known (vNext flags) | `pageEnrichmentV2=true`, `partialPageOutputs=true` | Present | Present | Present | Missing (no step) | Present | Present | Present | Missing | Missing | Insufficient | Stage-complete EP→DP + items; LC/KM/LO captures empty; no persisted assembled/HTML. DP is `page_synthesis` partial. |
| `dac8dd73-50ff-4abc-b64a-d7547008d191` | Introduction to Educational Psychology | Simple | Complete | Known (vNext flags) | same | Present | Present | Present | Missing (no step) | Present | Present | Present | Missing | Missing | Insufficient | Stage-complete EP→DP + items; LC/KM/LO empty; no assembled/HTML. DP capture present but keys include `learning_sequence`, not `page_synthesis`. |
| `04b6a3c2-6ada-4af3-8d8d-7c3d1d5b2ff7` | Was Marx Right? Test (workshop) | Simple | Complete | Known (vNext flags) | same; `startingArtefact=generate_from_topic` | Present | Present | Present | Missing (no step) | Missing (no step) | Present | Present | Missing | Missing | Insufficient | Stage-complete EP→DP; no assessment stages in workflow; no assembled/HTML. |
| `de1d00f7-af3f-490b-8712-d9b41a223d76` | VideoTranscript | Transcript | Abandoned | Known (vNext flags) | `startingArtefact=provided_source_content` | Present | Missing | Missing | Missing | Missing | Missing | Missing | Missing | Missing | Insufficient | Stopped after EP; early normalize/LC/KM/LO empty. Audience metadata: Life Science. |
| `0d1c12c0-ad1c-449f-8ad9-8f90b8f01097` | VideoTranscriptTest | Transcript | Abandoned | Known (vNext flags) | `startingArtefact=provided_source_content` | Present | Missing | Missing | Missing | Missing | Missing | Missing | Missing | Missing | Insufficient | Same pattern as VideoTranscript. |
| `4315bb60-5169-4854-a5b3-eee1bf92734c` | Visual Enhancement Utility v1.2.1 | Other | Abandoned | Unknown | no vNext flags | Missing | Missing | Missing | Missing | Missing | Missing | Missing | Missing | Missing | Insufficient | Non-LD utility; zero captures. Not a Sprint 59 page-pipeline sample. |

### Metadata counts (structure only; not quality)

| Workflow | DLA activities | GAM activities | GAM materials | Scenario/case-study–labeled materials (string match) | Assessment items (count in capture) |
| -------- | -------------- | -------------- | ------------- | ---------------------------------------------------- | ----------------------------------- |
| WasMarxRight | 5 | 5 | 26 | 3 | 5 |
| Intro Ed Psych | 5 | 5 | 23 | 6 | 5 |
| Was Marx Right? Test | 5 | 5 | 25 | 3 | 0 (no assess step) |

### Orphan runstate (no matching saved workflow)

| Runstate ID | Non-empty captures | Notes |
| ----------- | ------------------ | ----- |
| `25c2f008-…` | 0 | `strictJsonValidation`: “Step output is empty” on steps — validation-error residue |
| `f624a8a7-…` | 1 | Single non-empty capture; workflow deleted |
| `f4f15c07-…` | 0 | Empty captures; workflow deleted |

---

## 2. Evidence-status summary

| Status | Count (saved workflows) |
| ------ | ----------------------- |
| Full evidence | **0** |
| Generation-scoreable | **0** |
| Inventory-only | **0** |
| Insufficient | **6** |

**Why none are Generation-scoreable / Full:** Sprint 59 rules require **assembled page JSON** for Generation-scoreable and **rendered HTML** for Full evidence. Neither is persisted for any workflow. Stage captures alone are recorded as present/missing above but do not satisfy those statuses without inventing assembly/render artefacts.

**Operational note (not a status upgrade):** Three workflows are **stage-complete** for post-EP LD page stages (EP+DLA+GAM+LS+DP). Deterministic assembly from those captures (without new generation) could elevate them to Generation-scoreable **after** assembled JSON is produced and stored as audit evidence.

---

## 3. Coverage matrix (metadata only)

| Dimension | Assessment | Basis |
| --------- | ---------- | ----- |
| Simple workflow | **Covered** | Intro Ed Psych; Was Marx Right? Test; WasMarxRight (topic/self-study) |
| Transcript workflow | **Partially covered** | Two transcript workflows exist but abandoned at EP only |
| STEM | **Partially covered / Unknown** | Transcript audience “Life Science” only; no STEM stage-complete lesson |
| Social science / humanities | **Covered** | Marx topic workflows |
| Professional / applied | **Partially covered** | Educational Psychology (education professional) |
| Short lesson | **Unknown** | Activity counts are 5 wherever DLA exists — no short control |
| Complex lesson | **Partially covered** | 5 activities + many materials on stage-complete runs (complexity inferred from counts only) |
| Assessment-heavy | **Partially covered** | Two runs have assessment **items** (5); **no** assessment-design stage on any workflow |
| Scenario-heavy | **Partially covered** | Scenario/case string matches in materials (3–6); not confirmed via review |

---

## 4. Pilot recommendation (evidence availability only)

### Pilot candidates (up to three)

1. **WasMarxRight** — strongest stage completeness (EP…DP + assessment items); vNext flags; humanities/self-study.  
2. **Introduction to Educational Psychology** — stage-complete + items; contrasting discipline; note DP capture shape differs.  
3. **Was Marx Right? Test** — stage-complete workshop (no assessment stages); pairs with #1 for delivery-mode contrast.

**Not suitable for pilot now:** VideoTranscript / VideoTranscriptTest (EP only); Visual Enhancement Utility (non-LD, empty).

**Pilot blocker:** No assembled JSON / HTML → under pack rules these remain **Insufficient** until assembly (and optionally render export) is performed from existing captures **or** new complete runs with persisted assembly/HTML.

---

## 5. Gap analysis

### Missing evidence categories

- Persisted **assembled page JSON** (all workflows)
- Persisted **rendered HTML** (all workflows)
- **Assessment design** stage captures (no workflow includes the step)
- Complete **transcript** pipeline (DLA→DP)
- LO/LC/KM captures (empty on all inspected runs; steps often marked complete)

### Missing sample categories (for 12–15 / contingency 7)

- Full-evidence or generation-scoreable transcript lesson  
- STEM conceptual/applied stage-complete lesson  
- Short lesson (1–2 activities)  
- Explicit assessment-design + items pair  
- Anything approaching Full evidence (HTML)

### Core-sample outlook

| Target | Outlook |
| ------ | ------- |
| Pilot only | **Not yet** under pack evidence statuses (0 Generation-scoreable). Stage-complete trio usable **after** assembly artefacts are produced. |
| Minimum sample (7) | **Not met** — at most 3 stage-complete lessons; transcript incomplete; discipline gaps. |
| Full target (12–15) | **Not met**. |

---

## 6. Recommendation

**Historical (inventory-day) recommendation:** generate additional workflows before full-matrix calibration.

**Updated (2026-07-14, Phase B):** Full 12–15 scoring matrix is **optional** and does **not** block Instructional Archetype Framework work. Prefer:

1. Use Priority 1 acceptance runs (mechanism/process/mental-model heavy topics, e.g. enzymes-like) after package design.  
2. Optionally assemble the three first-audit stage-complete runs if deeper Class A scoring is still desired.  
3. Persist assembled JSON + rendered HTML only when Class B / Full evidence claims are needed.

See [roadmap.md](roadmap.md) and [sample-selection-plan.md](sample-selection-plan.md).

---

## Related

- [audit-plan.md](audit-plan.md) — evidence sufficiency rules  
- [sample-selection-plan.md](sample-selection-plan.md) — matrix targets  
- [instructional-archetype-audit.md](instructional-archetype-audit.md) — locked root-cause  
- [audit-register-template.md](audit-register-template.md) — register to populate after verification
