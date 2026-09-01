# S82-G2A — Maths Entry Gate 2A: bounded MathLive interaction spike

**Gate:** S82-G2A  
**Status:** **COMPLETE** (spike + automated evidence)  
**Evidence:** [S82-G2A-spike-evidence.md](S82-G2A-spike-evidence.md)  
**Decision:** [S82-D02](decisions.md#s82-d02--gate-2a-outcome-go-alpha-mathlive) — **A — GO ALPHA MATHLIVE** (**accepted** 2026-09-01)

---

## Purpose

Determine empirically whether **MathLive** can enhance commissioned maths `text_entry` fields while preserving PRISM's existing string evidence architecture — and whether it satisfies the learner-facing product test:

> Can a learner reasonably construct the mathematical notation PRISM has commissioned **without needing to understand TeX syntax**?

If MathLive fails that test or proves disproportionately costly, the fallback candidate is **enhanced native textarea** (symbol toolbar + on-blur MathJax preview) from the Gate 2 diagnostic.

---

## Test architecture

```text
ResponsePart.inputModality: "math"
  → WorkspaceRequirement.inputModality        (propagate for spike)
  → MathLive enhancement ↔ canonical textarea
  → textarea.value
  → existing text_entry persistence (unchanged)
```

**Canonical evidence:** `textarea.value` (TeX string). MathLive is an enhancement layer only.

**Fallback:** If MathLive fails to initialise, learner must retain a **usable plain textarea**.

G2A may minimally propagate `inputModality` through the renderer seam as spike scaffolding. G2B owns promotion/hardening of that propagation as production behaviour.

---

## Representative expressions

### Lagrangian

```tex
\mathcal{L}(x,y,\lambda) = 4xy + \lambda(2x + y - 20)
```

### FOC-style (must include fraction, partial derivative, Greek, sub/superscript, equality)

Example shape (exact stem from spike fixture):

```tex
\frac{\partial \mathcal{L}}{\partial x} = 4y + 2\lambda = 0
```

---

## Evaluation checklist

| Area | Question |
| ---- | -------- |
| Visual construction | Can a non-TeX-literate learner build commissioned notation? |
| TeX get/set | `getValue` / `setValue` (or equivalent) round-trip reliably? |
| Textarea sync | Bidirectional sync with hidden/underlying textarea? |
| Draft save/restore | Persisted string restores into editor correctly? |
| Keyboard-only | Completable without pointer? |
| Accessible labelling | Name, description, focus order credible? |
| Virtual keyboard | Mobile/touch implications; overlap with PRISM chrome? |
| Two-field independence | Multiple maths fields on one activity — no shared state bugs? |
| Failure fallback | Init failure → plain textarea, not broken UI |
| Dependency cost | Bundle size, fonts, offline learner package impact |

---

## Decision outcomes (record in decisions.md as S82-D02)

| Outcome | Criteria |
| ------- | -------- |
| **A — GO MathLive** | Materially better construction; clean sync; reliable restore; credible keyboard use; acceptable a11y; reliable fallback; bounded package cost |
| **B — GO enhanced textarea** | MathLive disproportionately costly/problematic; textarea + toolbar + preview sufficient |
| **C — STOP / reassess** | Neither treatment can reasonably fulfil commissioned mathematical evidence |

---

## Explicit boundaries

**In scope for spike:** isolated proof-of-interaction; minimal propagation to renderer seam; focused manual + automated checks.

**Out of scope:**

- Full Gate 2B production polish  
- Table maths  
- Rich mixed editor  
- Assessment / revision criteria changes  
- Workflow / DLA / GAM changes  
- Claiming WCAG conformance  

---

## Likely touch files (when authorised)

- `lib/learner-renderer-vnext/learner-surface-registry.js`  
- `lib/learner-renderer-vnext/types.js`  
- `lib/learner-renderer-vnext/render-composed-moment.js`  
- New spike runtime module (throwaway or evolve to G2B)  
- `package.json` — MathLive dependency (spike only)  
- Focused test file  

**Does not change:** draft envelope, DLA, GAM, `surfaceKind`, assessment architecture.

---

## Spike deliverables

1. Working spike in dev/test context  
2. Short evidence note: pass/fail per checklist row  
3. **S82-D02** decision recorded  
4. Gate 2B scope outline (only if A or B)
