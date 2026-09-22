# Sprint 87 — Charter

**Sprint:** 87 — Expository Quality — First Successor Implementation  
**Status:** **READY / NOT STARTED** (created 2026-09-22)  
**Type:** Implementation + validation  
**Predecessor:** Sprint 86 — COMPLETE / CLOSED ([T-012](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/T-012-SPRINT-86-CLOSURE.md))  
**Backlog item:** [PB-FA-012 — Expository Editorial Quality & QA](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-012--expository-editorial-quality--qa)  
**Start here:** [SPRINT-87-START-HERE.md](SPRINT-87-START-HERE.md)  
**Opening decision:** [S87-D01](decisions.md#s87-d01--open-sprint-87--expository-quality--first-successor-implementation)  
**Authoritative design:** [S86 T-011](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/T-011-SUCCESSOR-IMPLEMENTATION-DESIGN.md)

---

## Mission

Implement and validate the bounded first Expository quality slice designed in Sprint 86: preserve commissioned purpose and epistemic form, make the learner experience read as a chapter rather than an instructional prospectus, repair the systematic structured-material rendering defect, and apply restrained educational-publishing presentation improvements without destabilising Interactive.

This is **not** a general Expository redesign.

---

## Product-level outcome (acceptance north star)

> First-class Expository Resources preserve the **commissioned intellectual purpose**, open and close as **chapters** rather than prospectus packs, eliminate the systematic **structured-material rendering defect**, and present with **restrained non-card educational publishing chrome** — without a new generative stage and without destabilising Interactive.

Do **not** define success as “perfect book chapter.”

---

## Bounded first-slice scope

| # | Item | Intent |
| - | ---- | ------ |
| 1 | **EQ1** | Smallest viable purpose / epistemic-form contract; EJP owns/preserves; XD treats as binding; avoid ontology over-engineering |
| 2 | **EQ7** | Remove default Expository prospectus orientation stack; preserve title + substantive intellectual entry |
| 3 | **EQ8** | XD final substantive section owns consolidation; omit default page-level Closing; preserve form-appropriate close (incl. interpretive plurality) |
| 4 | **AD-010** | Eliminate learner-facing unsupported-material fallback; preserve unique instructional content — do not merely hide the error string |
| 5 | **T-010 presentation** | CSS/renderer-only: calm rhythm, quieter figure/material chrome & captions, display-maths spacing, structured-material internal headings, low-risk table/list polish; retain ~70ch; **no font programme** |
| 6 | **DP `sections` safety** | Prevent Expository DP partials from overwriting authoritative exposition sections |

Authoritative detail: [S86 T-011](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/T-011-SUCCESSOR-IMPLEMENTATION-DESIGN.md).

---

## Implementation dependency order

```text
QA v0.2
  → contracts / authority
  → Expository sibling prompts
  → assembly policy
  → renderer / AD-010 / restrained presentation
  → focused + regression engineering gates
  → live Expository pressure cases
  → sprint evaluation / closure
```

**First substantive task:** draft **Expository QA v0.2** before production coding (S86 WP2 carry-forward).

---

## Protected baseline

| Item | Constraint |
| ---- | ---------- |
| Interactive behaviour | **Protected baseline** — no Interactive prompt changes merely to enable Expository ([S83-D04](../2026-09-21-sprint-83-expository-resource-investigation/decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline)) |
| First-class gate (inherited) | **339/339** at S86 handoff — baseline, not necessarily final test count after S87 adds tests |
| Shared paths | Shared renderer / assembly / CSS changes require explicit Interactive regression coverage |
| S83–S85 architecture | Do not reopen without compelling evidence |
| S86 conclusions | Closed — do not reopen EQ1–EQ8 prioritisation or T-011 slice during setup/execution without new live evidence |

---

## Acceptance model

### Engineering

- Focused new tests for changed contracts / prompts / assembly / rendering  
- Inherited first-class baseline remains green  
- New regression tests remain green  
- Interactive regression where shared surfaces change  

### Learner-facing (qualitative)

Use QA v0.2 + live/manual pressure cases covering:

- quantitative / maths  
- low-visual prose  
- visual mechanism  
- interpretive / epistemic plurality  
- abstract conceptual material  

Expected first-slice outcomes:

- commissioned intellectual purpose preserved  
- interpretive briefs remain interpretive (no neighbouring-spine drift)  
- chapter enters substantive intellectual need sooner  
- no default prospectus stack  
- one authoritative close  
- AD-010 fallback gone without loss of unique content  
- less card-like / more restrained educational publishing  
- maths remains sound; narrow layout readable  
- Interactive behaviour protected  

---

## Explicitly out of scope

- Full T-009 Option B  
- Semantic H3 / subsection generation  
- Font / serif programme  
- Callout component kit  
- New generative stage / post-XM rewrite loop  
- Mandatory material↔figure 1:1  
- Changing 70ch for its own sake  
- Design-system programme  
- CAS / per-cell table maths  
- Broad Interactive prompt generalisation  
- Research Synthesis identity decision  
- Expository→Interactive architecture decision  

---

## Authoritative S86 handoff (link, do not duplicate)

| Artefact | Role |
| -------- | ---- |
| [T-012 closure](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/T-012-SPRINT-86-CLOSURE.md) | Sprint 86 closed position |
| [T-011 design](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/T-011-SUCCESSOR-IMPLEMENTATION-DESIGN.md) | First-slice implementation design |
| [EQ1–EQ8 principles](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/DRAFT-EDITORIAL-PRINCIPLES.md) | Quality model |
| [T-007 synthesis](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/T-007-FIVE-CASE-SYNTHESIS.md) | Five-case evidence synthesis |
| [T-008 map](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/T-008-PIPELINE-RESPONSIBILITY-MAP.md) | Pipeline responsibility |
| [T-009 seam](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/T-009-XD-XM-SEAM.md) | Option B = follow-on only |
| [T-010 typography](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/T-010-TYPOGRAPHY-REQUIREMENTS.md) | Presentation requirements |
| [QA v0.1](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/EXPOSITORY-QA-v0.1.md) | Frozen instrument — evolve to v0.2 in T-001 |
| Frozen C01–C05 | Validation evidence under v0.1 |

---

## Alpha status (unchanged)

> **Alpha development complete.** First-class journeys have been manually exercised and engineering-gated; known remaining issues and deferred capabilities are documented for post-alpha work.

Sprint 87 is **post-alpha** Expository quality implementation.

**Not claimed:** production-ready · formally WCAG conformant · bug-free · feature-complete.
