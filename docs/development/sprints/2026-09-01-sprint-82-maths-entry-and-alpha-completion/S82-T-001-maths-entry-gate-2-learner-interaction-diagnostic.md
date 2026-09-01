# S82-T-001 — Maths Entry Gate 2 learner interaction diagnostic

**Task:** S82-T-001  
**Gate:** S82-G2  
**Status:** **COMPLETE** (2026-09-01)  
**Mode:** Diagnostic only — no production changes in this task  
**Governance SSOT:** [semantic-learner-input-modality-gate-2-diagnostic.md](../../governance/semantic-learner-input-modality-gate-2-diagnostic.md)

---

## Purpose

Choose the smallest appropriate learner maths-entry interaction for `surfaceKind: text_entry` + `inputModality: math` without implementing it.

---

## Executive finding

Gate 1 semantics work end-to-end to `ResponsePart.inputModality`. The learner renderer **does not yet consume** modality: it is lost at `workspaceFromResponsePart()`, and every `text_entry` workspace renders as an identical plain `<textarea>`.

Persistence is already TeX/string-compatible. No draft schema migration required.

The Gate 2 diagnostic **recommended enhanced textarea + symbol toolbar + on-blur MathJax preview** as a bounded alpha treatment. That recommendation is **not yet accepted** as final — it may assume too much TeX literacy for the learner-facing product test.

**Next gate:** [S82-G2A](S82-G2A-mathlive-interaction-spike.md) — empirical MathLive spike before Gate 2B implementation.

---

## Renderer seam (authoritative)

```text
ResponsePart.inputModality
  → WorkspaceRequirement.inputModality   ← missing today
  → renderLearnerWorkspace() branch
  → DOM + optional PE runtime
```

**Files:** `learner-surface-registry.js`, `types.js`, `render-composed-moment.js`, optional `math-entry-runtime.js`, `render-page.js`.

**Unchanged:** `surfaceKind`, draft adapter kind `text_entry`, envelope schema.

---

## Persistence

```json
{
  "kind": "text_entry",
  "value": { "text": "<opaque TeX string>" }
}
```

Learner TeX is **untrusted text**. Do **not** route through `renderMarkdownInline` / emphasis transforms (S78-T-033 corruption pattern).

---

## Live Lagrangian shape (empirical)

- Structured multi-part template; ~4–10 labelled fields per derivation activity  
- Predominantly **one mathematical artefact per maths-labelled field**  
- Maths vs text fields correctly commissioned in live run (DLA); GAM preserved labels  
- Rich mixed prose+math in single field **not** evidenced  

---

## Infrastructure

- MathJax 3.2.2 — display for **authored** content; CDN on export/preview  
- No MathLive / MathQuill / KaTeX in dependencies  
- Display renderer ≠ learner editor  

---

## Diagnostic treatment comparison (summary)

| Treatment | Alpha fit |
| --------- | ----------- |
| A — Enhanced textarea + toolbar + preview | Bounded; strong a11y/fallback |
| B — Native maths editor (MathLive) | Higher capability; bundle/a11y cost |
| C — Shared helper | Moderate; secondary to field-local need |
| D — Hybrid | Larger than alpha needs |

**Preliminary recommendation:** A — but **G2A must validate** whether visual construction without TeX expertise requires MathLive.

---

## Acceptance tests specified (for Gate 2B)

1. Text modality unchanged  
2. Math modality gets maths-capable interaction  
3. TeX persists as canonical string  
4. Restore rehydrates  
5. Keyboard-only completion  
6. Accessible labelling/focus  
7. Enhancement failure → usable textarea  
8. Multiple maths fields independent  
9. Revision navigation compatible  
10. No math modality → no behaviour change  

**Fixture expression:**

```tex
\mathcal{L}(x,y,\lambda) = 4xy + \lambda(2x + y - 20)
```

---

## Classification

Gate 2B implementation: **B — MODERATE / BOUNDED** (either selected treatment).

Not **A (small)** — propagation + runtime + tests required.  
Not **C (large)** — no general authoring system.  
Not **D (defer)** — product blocker remains.
