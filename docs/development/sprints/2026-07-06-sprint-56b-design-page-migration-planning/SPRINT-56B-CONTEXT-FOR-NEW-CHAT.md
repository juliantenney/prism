# Sprint 56B — Context for New Chat

**Purpose:** Self-contained onboarding for a fresh AI session. Assumes **zero** prior conversation history.  
**Date:** 2026-07-06

---

## Product summary

**PRISM** is a learning-design workflow tool. Users define workflows (DLA → GAM → Design Page, etc.), run steps in Copilot or PRISM, and export learner-facing page JSON/HTML.

The **Design Page** step (`step_design_page`, domain pack §13) produces `artifact_type: page` — the terminal assembly deliverable.

---

## PRISM pipeline

```
DLA specifies  →  GAM realises  →  Design Page assembles  →  Repair/validate  →  Export/HTML
```

| Stage | Verb | Owns |
| ----- | ---- | ---- |
| **DLA** | Specifies | Activity structure, scaffold fields, `required_materials` **obligations** (not bodies) |
| **GAM** | Realises | Material **bodies** (`Content:` in pack text) |
| **Design Page** | Assembles | Page JSON — embed upstream, organise sections |
| **Repair** | Enforces | PRISM-only overlay when LLM thins content (not primary Copilot path) |

Detail: [SPRINT-57-LEARNER-PIPELINE-REFERENCE.md](../2026-07-01-sprint-57-learner-experience-product-quality/SPRINT-57-LEARNER-PIPELINE-REFERENCE.md)

---

## DLA ownership

- Authors learner-facing scaffold prose (`activity_preamble`, cognition fields, `expected_output`, etc.)
- Specifies what materials GAM must produce via `required_materials`
- **Does not** assemble pages or author material bodies
- SSOT: `LD-GUIDED-LEARNING-SCAFFOLD` (ADR-01)

---

## GAM ownership

- Realises every `required_materials` row as delivery-ready `activity_materials` content
- Owns material depth (GAM-PRES), instructional patterns, table bodies
- **Does not** compose page sections
- Output: labelled material bodies keyed to `activity_id`

---

## Design Page ownership

### As-built (current code)

Assembler + wrapper author (journey, authorial, rhetoric) + VA specifier + transporter + quality enforcer — **one LLM step**.

### Derived (Sprint 56A conclusion — planning hypothesis)

> **Read-only transport-and-organisation:** locate upstream outputs, embed DLA/GAM payloads verbatim, organise into page structure, emit self-contained final page.

**Layer 3 (wrapper, VA, brevity) is optional and disputed** — subject to Sprint 56B boundary review and approval.

Evidence: [DESIGN-PAGE-TARGET-ARCHITECTURE-DERIVATION.md](../2026-07-06-sprint-56a-design-page-simplification-planning/DESIGN-PAGE-TARGET-ARCHITECTURE-DERIVATION.md)

---

## Sprint 56A conclusions (frozen evidence)

| Conclusion | Source |
| ---------- | ------ |
| Failures A–G = **responsibility conflict**, not isolated bugs | Failure modes |
| **11 fundamentals** vs 40 Core classified | Core reduction |
| Competing mandates: transport vs author vs optimise vs present | Architecture audit |
| **13 dependency clusters**; Copilot has no repair backstop | Dependency analysis |
| Migration phases **A→E** defined | Migration strategy |

**56A folder is read-only.** [SPRINT-56A-CLOSURE-REPORT.md](../2026-07-06-sprint-56a-design-page-simplification-planning/SPRINT-56A-CLOSURE-REPORT.md)

---

## Sprint 56B mission

**Convert Sprint 56A findings into an approved implementation-ready plan.**

| In scope | Out of scope |
| -------- | ------------ |
| Resolve blocker OQs | Prompt rewrites |
| Boundary + dependency review | Code changes |
| Architecture approval | Implementation execution |
| Populate implementation plan | Recreating 56A analysis |

---

## Current blockers

| ID | Topic |
| -- | ----- |
| OQ-02 | Author vs organise only |
| OQ-13 | VA placement |
| OQ-17 | Knowledge summary policy |
| OQ-24 | Copilot vs PRISM validation |
| OQ-25 | Canonical fixtures |
| OQ-23 | Sprint 57 sequencing |

Tracker: [SPRINT-56B-OPEN-QUESTIONS.md](SPRINT-56B-OPEN-QUESTIONS.md)

---

## Expected outputs

1. Resolved or explicitly deferred blocker questions  
2. Boundary review records (Workstream 2)  
3. Dependency impact matrix (Workstream 3)  
4. Signed architecture approval tracker  
5. **Approved** [SPRINT-56B-IMPLEMENTATION-PLAN.md](SPRINT-56B-IMPLEMENTATION-PLAN.md)

---

## Rules for assistants

1. **Reference 56A artefacts** — do not recreate analysis.  
2. **No implementation** until implementation plan is approved.  
3. **Do not edit** Sprint 56A or Sprint 57 folders.  
4. **Transport core (Layer 1–2) is the validation anchor** for all boundary decisions.  
5. Start with [SPRINT-56B-START-HERE.md](SPRINT-56B-START-HERE.md) reading order.

---

## Key file paths

| Path | Role |
| ---- | ---- |
| `lib/ld-design-page-compose-contract.js` | Compose SSOT (ADR-06) |
| `domains/learning-design/domain-learning-design-step-patterns.md` §13 | Design Page pack |
| `app.js` `applyWorkflowStepRuntimePromptAugmentations` | Augmentation chain |
| `docs/architecture/renderer-export-behavior.md` | Export consumer |
