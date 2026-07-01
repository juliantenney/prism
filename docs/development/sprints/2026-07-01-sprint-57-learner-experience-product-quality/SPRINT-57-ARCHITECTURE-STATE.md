# Sprint 57 — Architecture State

**Snapshot date:** 2026-07-01 (Sprint 57 open)  
**Classification:** **GREEN** — orchestration boundaries  
**Programme status:** Architecture review **complete**

---

## Current model

```
DLA specifies  →  GAM realises  →  Design Page assembles  →  Repair/validate  →  Export/HTML
```

| Stage | Verb | Owns |
| ----- | ---- | ---- |
| **DLA** | Specifies | Activity obligations, scaffold field prose, expected outputs, material *requirements*, episode plan population |
| **GAM** | Realises | Material *bodies*, instructional-pattern shapes, depth per GAM-PRES, tables as authored content |
| **Design Page** | Assembles | Page sections, wrapper prose, field/material *preservation*, visual affordance metadata |
| **Repair** | Enforces | Upstream overlay when LLM thins; closure validation; scaffold repair on DLA capture |

Design Page is **read-only composition** — it must not redesign pedagogy or regenerate scaffolds.

---

## Ownership map

| Authority | Owner | Consumers / injection | Status |
| --------- | ----- | --------------------- | ------ |
| **Scaffold generation** (word floors, exemplars, PRE-EMIT) | **DLA** | Design Page copies verbatim | Correct |
| **Scaffold preservation** (compose slice) | **Design Page** | Uses upstream DLA fields | Correct |
| **Cognition / expected_output** | **DLA** | Preserved on Design Page | Correct |
| **Material obligations** (`required_materials`) | **DLA** | GAM realises | Correct |
| **Material bodies** | **GAM** | Design Page preserves | Correct |
| **Materials fidelity** | **Shared L4** `LD-MATERIALS-COPY` | GAM `author`; Design Page `design_page` embed | Valid shared |
| **Table fidelity** | **Shared L4** `LD-TABLE-FIDELITY` | DLA `dla` spec; GAM `author`; Design Page `design_page` embed | Valid shared |
| **Material depth floors** | **GAM** pack GAM-PRES-08/09 | SP defers; capture GAM-FMT advises | Correct |
| **Instructional patterns** (SP-01..07) | **GAM** | Not on DLA or Design Page emit | Correct |
| **Learner voice / rhetoric** | **Shared** `LD-SELF-DIRECTED-RHETORIC` | GAM, Design Page, Assessment — **not DLA** | Correct |
| **Facilitator ban (self-directed)** | **GAM** self-study block | Capture sanitization | Correct |
| **PEL orientation** | **DLA** | Not Design Page | Correct |
| **PEL reasoning materials** | **DLA** + **GAM** | Not Design Page | Correct |
| **Page composition** | **Design Page** `LD-DESIGN-PAGE-COMPOSE` | Journey, authorial exposition wrappers | Correct |
| **Wrapper journey arc** | **Design Page** `LD-JOURNEY-ASSIMILATION` | Overview, transitions, closure | Correct |
| **Visual affordances** | **Design Page** Sprint 38 | Additive page-root metadata | Correct |
| **EQF** | **Shared L5** | Step-specific manifestation slices | Valid shared |
| **Math / TeX** | **Shared** `LD-MATH-RENDER` | All three emit paths | Valid shared |
| **Strict JSON** | **Shared** | Per step kind | Valid shared |
| **Repair — GAM materials** | **Post-compose** `page-gam-materials-preserve.js` | Design Page pipeline | Correct |
| **Repair — activity fields** | **Post-compose** `page-activity-field-preserve.js` | Capture validation | Correct |
| **Repair — DLA scaffold** | **Post-capture** `repairGuidedLearningScaffoldOnDlaCapture` | DLA capture path | Correct |
| **Validation — page closure** | **Post-capture** `applyPageCompositionValidationForCapturedPage` | Membership, materials, episodes | Correct |
| **GAM capture gate** | **Post-capture** `lib/gam-output-format.js` | Pack text structure + depth warn | Correct |

---

## Augmentation chain (canonical order)

`app.js` → `applyWorkflowStepRuntimePromptAugmentations`:

1. LD-GUIDED-LEARNING-SCAFFOLD (DLA SSOT early)
2. Pedagogic cognition (DLA + GAM, brief-active)
3. EQF (all three; DLA qualified)
4. Instructional patterns (GAM only)
5. Self-directed step scaffolds (step sub-chain)
6. LD-TABLE-FIDELITY (DLA spec + GAM author; DP via compose)
7. LD-MATERIALS-COPY (GAM author; DP via compose)
8. PEL (DLA orientation/reasoning; GAM reasoning materials)
9. LD-DESIGN-PAGE-COMPOSE (Design Page + wrappers)
10. Sprint 38 visual (Design Page)
11. LD-MATH-RENDER
12. Strict JSON
13. Episode plan DLA population

---

## Architecture status

| Check | Result |
| ----- | ------ |
| Cross-stage authority leaks | **None (High severity)** |
| Medium-severity misplacement | **None active** |
| Orchestration classification | **GREEN** |
| Prompt estate maintainability | **AMBER (stable)** — optional size tranches |

### Remaining low-priority observations

| ID | Observation | Severity | Action |
| -- | ----------- | -------- | ------ |
| F-02 | Design Page wrapper overlap (journey + rhetoric + EQF) | Low | Deferred — distinct scopes; dedupe risks behaviour |
| Residual | GAM pack + SP co-teach depth (SP defers to GAM-PRES) | Low | Acceptable intentional split |
| Residual | Prompt sizes above legacy charter targets for GAM | Low | Monitor only; not orchestration risk |

**No open medium/high-severity orchestration issues.**

---

## Evidence archive

| Audit | Path |
| ----- | ---- |
| Cross-prompt placement | `docs/development/audits/CROSS-PROMPT-AUTHORITY-PLACEMENT-AUDIT.md` |
| Final cleanup | `docs/development/audits/FINAL-ARCHITECTURE-CLEANUP.md` |
| GAM suite | `docs/development/audits/GAM-*.md` |
| Design Page suite | `docs/development/audits/DESIGN-PAGE-*.md` |
| Deprecation register | `docs/development/prompt-contracts/DEPRECATION-REGISTER.md` |
