# Sprint 101 — Implementation map

**Status:** **CLOSED — ACCEPTED WITH QUALIFICATIONS**  
**Charter:** [SPRINT-101-CHARTER.md](SPRINT-101-CHARTER.md)  
**Closure:** [SPRINT-101-CLOSURE.md](SPRINT-101-CLOSURE.md)  
**Investigation:** [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md)  
**Decisions:** [decisions.md](decisions.md)

---

## Phase posture

```text
101A    Architectural investigation                         COMPLETE
101B    Practice instructional contract                     ACCEPTED
101C    Learner-facing wireframe + worked example           ACCEPTED (foundation; not a template)
101C-3  Technical capability audit / readiness              ACCEPTED
101D    Implementation                                      COMPLETE
101E    Validation (selection, persistence, progressive…)   COMPLETE
101F    Practice workload proportion                        COMPLETE
101G    Commission-native feasibility (read-only)           COMPLETE (not implemented)
101H    Image-brief precision / completeness                COMPLETE
Close   S101-D06                                            ACCEPTED WITH QUALIFICATIONS
```

---

## 101A — Architectural investigation (complete)

| Path | Role |
| ---- | ---- |
| [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md) | Pipeline, prose, LJ integration, approach comparison, wireframe plan |

**Key code surfaces inspected (read-only):**

| Surface | Path |
| ------- | ---- |
| Interactive family | `lib/first-class-workflow-family.js` |
| Commission intake | `lib/first-class-commission-intake.js` |
| Page assembly | `lib/page-vnext-assemble.js`, `lib/page-shell-create.js`, `lib/page-dla-enrich.js`, `lib/page-gam-enrich.js` |
| Interactive contracts | `lib/ld-dla-page-enrich-contract.js`, `lib/ld-gam-page-enrich-contract.js`, `lib/ld-design-page-partial-contract.js`, `lib/ld-guided-learning-scaffold.js` |
| Renderer | `lib/learner-renderer-vnext/` (`build-page-model.js`, `render-page.js`, compose/activity moments) |
| LJ | `lib/learning-journey-design-page.js`, `lib/learning-journey-sibling-prompts.js`, `lib/learning-journey-learner-package.js`, `lib/learning-journey-unified-shell.js` |
| Runtime prompts | `app.js` (`applyWorkflowStepRuntimePromptAugmentations`, capture validators) |

---

## 101B — Practice instructional contract (accepted)

| Path | Role |
| ---- | ---- |
| [PRACTICE-INSTRUCTIONAL-CONTRACT.md](PRACTICE-INSTRUCTIONAL-CONTRACT.md) | Purpose, LJ inheritance, learner-facing classification, activity design, commissioning, page structure, acceptance criteria |

**101B design stance for later implementation:** Practice-owned instructional behaviour + safe reuse of Interactive machinery; **not** context-sensitive branches inside Interactive. Additive `product_id: "practice"`; LJ-commissioned only in v1; prose-first commissioning enrichment.

---

## 101C — Learner-facing wireframe (accepted foundation)

| Path | Role |
| ---- | ---- |
| [wireframe/practice-c2-seeing-gradients-and-tangency.html](wireframe/practice-c2-seeing-gradients-and-tangency.html) | Standalone interactive Practice prototype (C2 maths) |
| [WIREFRAME-C2-COMPARISON.md](WIREFRAME-C2-COMPARISON.md) | Inspection of Interactive C2 + side-by-side comparison |
| [wireframe-source/seeing-gradients-and-tangency/](wireframe-source/seeing-gradients-and-tangency/) | Unpacked Interactive export (reference only) |

---

## 101C-3 — Technical capability audit (accepted)

| Path | Role |
| ---- | ---- |
| [PRACTICE-TECHNICAL-CAPABILITY-AUDIT.md](PRACTICE-TECHNICAL-CAPABILITY-AUDIT.md) | Capability matrix, architecture, 101D slices, 101E plan |

---

## 101D — Implementation (complete)

| Path | Role |
| ---- | ---- |
| [101D-IMPLEMENTATION-REPORT.md](101D-IMPLEMENTATION-REPORT.md) | Slice-by-slice report |
| `lib/first-class-workflow-family.js` | Practice product + topology |
| `lib/first-class-commission-intake.js` | Practice intake |
| `lib/ld-practice-presentation-contracts.js` | Practice-owned contracts |
| `lib/learning-journey-design-page.js` / sibling prompts | Prefer Practice |
| `lib/learner-renderer-vnext/build-page-model.js` / `render-page.js` | `pageKind: practice` |
| `lib/learning-journey-workload-feasibility-adapter.js` | Practice mapping |
| `app.js` / `index.html` | promptRoute branch + script load |
| `tests/s101-practice-*.test.js` | Focused Practice tests |

---

## Later phases (closed)

| Phase | Surface |
| ----- | ------- |
| 101E–101H | See [STATUS.md](STATUS.md) / [SPRINT-101-CLOSURE.md](SPRINT-101-CLOSURE.md) |
| Post-close | Non-blocking C4 A3 / image-fragment / render-verify follow-ups only — do not reopen sprint |

---

## Out of scope after close

- Commission-native GLC/MK/DLO omission (101G Option C) — deferred  
- Learning Journey–owned outcomes transmission — **next sprint theme**  
- Journey-level QA — subsequent concern  
- Component regeneration / additional Sprint 101 implementation / commit-push
