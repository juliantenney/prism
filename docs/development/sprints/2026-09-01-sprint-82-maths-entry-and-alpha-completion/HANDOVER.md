# Sprint 82 — Handover

**Kind:** Active-sprint handover  
**Sprint status:** **OPEN**  
**Dashboard:** [STATUS.md](STATUS.md) · **Entry:** [SPRINT-82-START-HERE.md](SPRINT-82-START-HERE.md)

---

## A. Product state

| Field | State |
| ----- | ----- |
| Maturity | **WORKING ALPHA** |
| First-class gate | `npm run test:first-class` → **339/339** |
| D-014 | **RESOLVED** |
| Accessibility | Strong automated baseline on representative learner output; **no formal WCAG conformance claimed** |
| Sprint 81 | **CLOSED** — B shipped; surfaces retained |
| Historical RC3–RC8 | Backlog / historical — not Sprint 82 work |
| Slideshow / output extensibility | Preliminary investigation only — not Sprint 82 |

---

## B. Current sprint

**Sprint 82 — Maths Entry & Alpha Completion**

**Objective:** When PRISM commissions dedicated mathematical learner evidence, provide a first-class interaction for producing it while preserving existing evidence and persistence architecture.

**Current gate:** **S82-G3** — realistic Lagrangian colleague validation  
**Treatment:** [S82-D02](decisions.md#s82-d02--gate-2a-outcome-go-alpha-mathlive) — **A — GO ALPHA MATHLIVE** (accepted)  
**G2B record:** [S82-G2B-production-hardening.md](S82-G2B-production-hardening.md)

---

## C. Settled architecture

| Topic | Decision |
| ----- | -------- |
| Semantic authority | DLA `required_materials[].response_fields[]` |
| Identity | `material_id` + governed exact trimmed label |
| GAM role | Preserve metadata; no second semantic decision |
| Composed part | `surfaceKind: "text_entry"`, `inputModality: "text"\|"math"` |
| Canonical evidence | `{ kind: "text_entry", value: { text: "<opaque string/TeX>" } }` |
| Renderer seam | `workspaceFromResponsePart()` → `renderLearnerWorkspace()` |
| Rich mixed prose+math | **Not required** — structured multi-field templates |
| Sprint 81 learner architecture | **Closed** — do not reopen surface-family redesign |

**Renderer (G2B):** `inputModality` production-propagated; MathLive enhances `text_entry` + `math`; canonical `textarea` authority preserved.

---

## D. Completed recent work

| Item | Status | Reference |
| ---- | ------ | --------- |
| Maths Entry Gate 1 | **COMPLETE** | [semantic-learner-input-modality-gate-1.md](../../governance/semantic-learner-input-modality-gate-1.md) — 11/11 tests |
| Gate 2 diagnostic | **COMPLETE** | [S82-T-001](S82-T-001-maths-entry-gate-2-learner-interaction-diagnostic.md) |
| Graphics material-role grounding | **CLOSED** (pre-S82) | 7/7 + related slices green at last check |
| Gate 2A MathLive spike | **COMPLETE** | [S82-G2A](S82-G2A-mathlive-interaction-spike.md) · [evidence](S82-G2A-spike-evidence.md) |
| Gate 2B production hardening | **COMPLETE** | [S82-G2B](S82-G2B-production-hardening.md) |

---

## E. Accepted treatment (S82-D02)

**A — GO ALPHA MATHLIVE** for commissioned `text_entry` + `inputModality: math`.

MathLive enhances the learner field; `textarea.value` (TeX string) remains canonical evidence. Native textarea remains fallback.

**Alpha qualification:** Usability/a11y not comprehensively validated; G2B hardens known gaps from [G2A browser evidence](S82-G2A-spike-evidence.md#manual-browser-validation-g2a--2026-09-01) without rewriting unresolved rows as passes.

---

## F. Deferred / non-goals

See [SPRINT-82-CHARTER.md](SPRINT-82-CHARTER.md) §Non-goals. Summary:

- Rich mixed prose+math editor; general maths authoring; CAS; symbolic checking  
- New `math_entry` surfaceKind unless evidence forces it  
- Table maths (unless live validation blocks sprint close)  
- Graphics redesign; slideshow implementation; alpha hardening lifecycle pass  
- Sprint 81 architecture reopen; historical RC backlog  

**Post-Sprint 82:** alpha hardening / closeout pass including create→save→adjust→run→export→import lifecycle verification (not Sprint 82 implementation).

---

## G. Sprint 82 exit criteria

Sprint 82 may close when all of the following hold:

1. Commissioned `inputModality: math` reaches the learner renderer.  
2. Dedicated maths fields receive the **selected** maths-capable interaction.  
3. Evidence remains canonical string/TeX via existing `text_entry` persistence.  
4. Saved maths restores correctly.  
5. Enhancement failure leaves usable native input.  
6. Keyboard-only maths completion verified (manual + focused tests).  
7. No material regression of automated accessibility baseline.  
8. Realistic Lagrangian activity completable with maths interaction.  
9. Prose `text_entry` behaviour unchanged when no math modality.  
10. First-class engineering gate passes.

Table maths is **not** required to close unless live validation shows commissioned table-cell maths that cannot be completed otherwise.

**Intended close claim (when satisfied):** Maths Entry is first-class for dedicated mathematical response fields — commission, appropriate interaction, preserve through existing draft architecture. Not arbitrary authoring, mixed documents, correctness checking, or table cells unless separately implemented.

---

## H. Next prompt / task

**S82-G3** — realistic Lagrangian colleague validation ([PLAN.md](PLAN.md) §S82-G3).

Production maths-entry is in tree (`lib/mathlive/`, `math-entry-*.js`). Do **not** coach the tester on symbol locations.

Do **not** reopen Sprint 81.
