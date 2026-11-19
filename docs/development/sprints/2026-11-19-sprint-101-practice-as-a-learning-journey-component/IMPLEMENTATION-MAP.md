# Sprint 101 — Implementation map

**Status:** **OPEN**  
**Charter:** [SPRINT-101-CHARTER.md](SPRINT-101-CHARTER.md)  
**Investigation:** [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md)  
**Decisions:** [decisions.md](decisions.md)

---

## Phase posture

```text
101A  Architectural investigation                         COMPLETE
101B  Practice instructional contract                     PENDING (design review gate)
101C  Learner-facing wireframe + worked example           PENDING (design review gate)
101D  Implementation                                      BLOCKED until 101B+101C approved
101E  Validation + closure                                PENDING
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

## Later phases (pending)

| Phase | Intended surface |
| ----- | ---------------- |
| 101B | Practice instructional contract (centre of gravity, required/optional prose, LJ inheritance, completeness) |
| 101C | Lagrange Multipliers–based Practice wireframe vs existing Interactive constituent |
| 101D | Likely: Approach 2 — shared pipeline with gated Practice contracts + LJ `product_id: "practice"` (subject to 101B/101C approval) |
| 101E | Focused tests, LJ backwards-compat checks, qualified close |

**Provisional 101D touch list (not authorised yet):**

- `lib/first-class-workflow-family.js` — register Practice  
- `lib/first-class-commission-intake.js` — intake mapping  
- `lib/learning-journey-design-page.js` + sibling commissioning prompts — centre-of-gravity + supported ids  
- Gated Practice overlays on DLA/GAM/DP contracts (must not thin Interactive globally)  
- Renderer `pageKind` / validation gates for Practice  
- Tests for LJ Interactive backwards compatibility and Practice commission path

---

## Non-goals until authorised

- Application code / prompt / schema / renderer / test edits  
- New component registration or workflow creation  
- Exemplar regeneration / `prism-exemplars` changes  
- GLC / MK / DLO redesign
