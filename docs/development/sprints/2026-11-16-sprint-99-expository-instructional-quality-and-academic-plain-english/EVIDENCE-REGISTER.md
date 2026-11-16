# Sprint 99 — Evidence register

**Sprint:** 99 — Expository Instructional Quality and Academic Plain English  
**Opened:** 2026-11-16  
**Opening:** [S99-D01](decisions.md#s99-d01--open-sprint-99--expository-instructional-quality-and-academic-plain-english)  
**Investigation:** [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md)

Status vocabulary: **Confirmed** · **Hypothesis** · **Monitoring** · **Resolved** · **Verified** · **Provisional** · **Not claimed** · **Gap**

---

## Findings ledger

| ID | Status | Finding |
| -- | ------ | ------- |
| S99-E01 | **Confirmed (code)** | Expository uses EJP → XD → XM (+ shared GLC/LO/MK/DP), assembled via `page-vnext-assemble` Expository path; not Interactive EP/DLA/GAM. |
| S99-E02 | **Confirmed (code)** | Profile: `activities_required: false` / `materials_required: false`; renderer uses `pageKind: "expository"` and `expositionSections`. |
| S99-E03 | **Confirmed (code)** | S98-D08 typography injects **before** route branching — Expository runtime augmentations receive `LD-LEARNER-FACING-PROSE-TYPOGRAPHY`. |
| S99-E04 | **Confirmed (code)** | Interactive Academic Plain English (`LD-GAM-INSTRUCTIONAL-DEPTH`) does **not** apply on the Expository promptRoute branch. |
| S99-E05 | **Confirmed (code)** | Expository route also receives domain guidance, EQF, math-safe and strict JSON contracts after typography. |
| S99-E06 | **Confirmed (guidance reading)** | Expository sibling prompts treat explanation-first, optional invitations, selective examples, and productive recurrence as appropriate — not Interactive attempt-before-scaffold. |
| S99-E07 | **Gap** | No Sprint 99 Expository assembled JSON + rendered ZIP yet — educational quality unevaluated. |
| S99-E08 | **Gap** | S98-D08 not yet validated through a subsequent normal Expository (or Interactive) generation. |
| S99-E09 | **Hypothesis** | Whether Expository needs an adapted Academic Plain English manifestation is unknown without M1 prose evaluation. |
| S99-E10 | **Hypothesis** | Authored EJP/XD intentions vs rendered learner experience (order, field leakage, heading semantics) — verify on case. |

---

## M0 — Pipeline investigation

**Complete.** Detail: [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md). No educational defect claimed without case evidence.

---

## M1 — User-led generation (awaiting)

| Artefact | Required | Status |
| -------- | -------- | ------ |
| Assembled page JSON (or DP + assembled) | Yes | **Awaiting user** |
| Learner export ZIP (HTML + assets) | Yes | **Awaiting user** |
| Educational evaluation against charter question | Yes | Blocked on artefacts |

Evaluation will concentrate on understanding quality (explanation, examples, relationships, reasoning demand, productive repetition, disciplinary precision) — **not** mere prompt-marker compliance. Different generations are **not** a controlled A/B.
