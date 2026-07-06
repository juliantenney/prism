# Sprint 56A — Context for New Chat

**Purpose:** Self-contained onboarding for a fresh AI session with no prior conversation history.  
**Date:** 2026-07-06

---

## Product summary

**PRISM** is a learning-design workflow tool. Users define workflows (DLA → GAM → Design Page, etc.), run steps in Copilot or PRISM, and export learner-facing page JSON/HTML.

The **Design Page** step (`step_design_page`, domain pack §13) is the terminal **Assembly** step: it produces `artifact_type: page` — the deliverable learners consume.

---

## Learner pipeline summary

```
DLA specifies  →  GAM realises  →  Design Page assembles  →  Repair/validate  →  Export/HTML
```

| Stage | Owns |
| ----- | ---- |
| **DLA** | Activity structure, scaffold fields, `required_materials` obligations |
| **GAM** | Material bodies (`Content:` blocks in pack text) |
| **Design Page** | Page JSON: sections, activities with embedded materials, wrapper prose, metadata |
| **Repair** | PRISM-run overlay when captures thin content (not primary Copilot path) |

Full detail: [SPRINT-57-LEARNER-PIPELINE-REFERENCE.md](../2026-07-01-sprint-57-learner-experience-product-quality/SPRINT-57-LEARNER-PIPELINE-REFERENCE.md)

---

## Design Page role (current vs proposed)

**Current (as implemented):** Assembler + wrapper author + visual-affordance specifier + episode-plan transporter + assessment transporter + quality enforcer — in one LLM step.

**Proposed direction (planning, not yet approved):**

> Produce the final learner-facing page by **preserving and organising** upstream learner content.

Three layers:

1. **Hard transport** — verbatim GAM, DLA, assessment, episode plans
2. **Organise** — membership, section order, schema
3. **Optional bridge** — thin wrapper prose only (if retained at all)

---

## Failure mode history

Despite Sprint 56 audits, remediation, and many L4 preservation invariants, live Design Page outputs still show:

- Summarised material bodies (first line, heading only, synopsis)
- Metadata substituted for `Content:` bodies (Purpose, Material name, type labels)
- Placeholders (`"Full text from LO1-TEXT"`, `"See upstream material"`)
- Truncation and condensation (`generation_notes`: "represented in condensed form")
- Multi-material omission (only `materials.text` when GAM has many blocks)
- Context denial without searching conversation history

See [DESIGN-PAGE-FAILURE-MODES.md](DESIGN-PAGE-FAILURE-MODES.md).

---

## Audit conclusions (accepted diagnosis)

Source: [DESIGN-PAGE-ARCHITECTURE-AUDIT.md](../2026-07-01-sprint-56-prompt-rationalisation-contract-consolidation/DESIGN-PAGE-ARCHITECTURE-AUDIT.md)

- Design Page carries **five jobs** that conflict under token/page-size pressure
- **Materials transport** is the clearest essential responsibility
- **Wrapper authoring** (journey assimilation, authorial exposition, self-directed rhetoric) competes with preservation
- **Visual affordances** add specification-writing load and `source_basis` citation patterns that can substitute for embedded bodies
- **Knowledge summary** re-authors KM/LC instead of transporting
- **`output_density` / brevity params** conflict with full-body preservation

---

## Architecture hypothesis

> Design Page failures are not isolated preservation defects. They are symptoms of **accumulated and competing responsibilities** within a single step acting as assembler, author, narrator, optimiser, and presentation layer.

Preservation patches treat symptoms. Sprint 56A plans **structural simplification**.

---

## Sprint 56A mission

**Determine target-state Design Page architecture and produce an approved migration plan before implementation.**

| In scope | Out of scope |
| -------- | ------------ |
| Consolidate findings | Prompt rewrites |
| Responsibility mapping | Code changes |
| Migration sequencing | Learner UX work |
| Risk and validation strategy | New architecture implementation |

---

## Rules for future assistants

1. **Treat the architecture audit as accepted diagnosis** until superseded by approved migration plan.
2. **Do not modify Sprint 57 artefacts** — reference and inherit only.
3. **Do not implement** during Sprint 56A — planning deliverables only.
4. **Do not add preservation patches** as the default fix — ask whether responsibility should move or be removed.
5. **Copilot workflow context:** upstream artefacts live in conversation history (`STEP N OUTPUT:`); Design Page must parse GAM pack text from prior messages.
6. **Final page rule:** page JSON must be self-contained; no dereferenceable learner content.
7. **When uncertain:** add to [SPRINT-56A-OPEN-QUESTIONS.md](SPRINT-56A-OPEN-QUESTIONS.md), do not guess implementation.

---

## Key file locations

| Concern | Path |
| ------- | ---- |
| Domain pack §13 | `domains/learning-design/domain-learning-design-step-patterns.md` |
| Compose contract | `lib/ld-design-page-compose-contract.js` |
| Materials L4 | `lib/ld-materials-copy.js` |
| Journey wrapper | `lib/ld-journey-assimilation.js` |
| Authorial wrapper | `lib/ld-authorial-exposition.js` |
| Augmentation chain | `app.js` ~`applyWorkflowStepRuntimePromptAugmentations` |
| Post-compose repair | `lib/page-gam-materials-preserve.js` |
| Audits | `docs/development/audits/DESIGN-PAGE-*.md` |

---

## Sprint package index

| File | Role |
| ---- | ---- |
| [SPRINT-56A-START-HERE.md](SPRINT-56A-START-HERE.md) | One-page orientation |
| [SPRINT-56A-CHARTER.md](SPRINT-56A-CHARTER.md) | Mission and exit criteria |
| [SPRINT-56A-BACKLOG.md](SPRINT-56A-BACKLOG.md) | Planning tasks |
| [SPRINT-56A-OPEN-QUESTIONS.md](SPRINT-56A-OPEN-QUESTIONS.md) | Unresolved decisions |
| [DESIGN-PAGE-FAILURE-MODES.md](DESIGN-PAGE-FAILURE-MODES.md) | Failure catalogue |
| [DESIGN-PAGE-RESPONSIBILITY-ANALYSIS.md](DESIGN-PAGE-RESPONSIBILITY-ANALYSIS.md) | Responsibility taxonomy |
| [SPRINT-56A-IMPLEMENTATION-PLAN.md](SPRINT-56A-IMPLEMENTATION-PLAN.md) | Migration plan (skeleton → approved) |
