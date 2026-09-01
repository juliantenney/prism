# S82-G2B — Production MathLive hardening

**Status:** **COMPLETE** (2026-09-01)  
**Prior:** [S82-G2A-spike-evidence.md](S82-G2A-spike-evidence.md) · [S82-D02](decisions.md#s82-d02--gate-2a-outcome-go-alpha-mathlive)  
**Next gate:** **S82-G3** — realistic Lagrangian colleague validation

---

## Production architecture

```text
ResponsePart.inputModality
  → workspaceFromResponsePart() [normalizeInputModality]
  → WorkspaceRequirement.inputModality
  → renderLearnerWorkspace() [data-input-modality="math"]
  → math-entry-runtime.js (PRISM_MATH_ENTRY)
      ↔ MathLive math-field
      ↔ canonical textarea.value
  → existing text_entry draft/persistence
```

- **Assets:** `lib/mathlive/` (MathLive `0.110.0`, MIT) — local, conditional in learner packages
- **VK policy:** `virtual-keyboard-mode="manual"` — icon opens keyboard; not forced on every focus
- **Fallback:** `__PRISM_MATH_ENTRY_DISABLE__` (test) or MathLive unavailable → labelled native textarea
- **Label/focus:** runtime moves `id` to `math-field`, updates label `for`; textarea `aria-hidden` when enhanced

---

## Tests

| Suite | Result |
| ----- | ------ |
| `tests/s82-g2b-maths-entry-production.test.js` | **19/19 PASS** |
| `tests/s82-g2a-mathlive-interaction-spike.test.js` (historical) | **12/12 PASS** (production modules) |
| `npm run test:first-class` | **339/339 PASS** |

---

## Bounded issues (honest — not hidden)

| Item | G2B disposition |
| ---- | ---------------- |
| Label click → math-field focus | **Addressed** — runtime `associateLabel()` |
| Tab / Shift+Tab exit from maths field | **Partially addressed** — MathLive internal Tab for placeholders retained; full desktop route not automation-verified → **G3/G4** |
| Virtual keyboard auto-open on focus | **Policy set** — manual mode; icon discoverable (G2A confirmed) |
| AT duplicate math-field + inner textbox | **Classified** — MathLive shadow structure; no invasive DOM surgery |
| 200% zoom / narrow reflow | **Not re-tested in G2B automation** — CSS uses `max-width:100%`; **G3/G4** |
| Physical keyboard maths without TeX | **G3** colleague validation |
| Lagrangian non-TeX construction | **G3** |

G2A browser evidence rows are **not** retroactively marked pass.

---

## Spike artefacts

| Artefact | Disposition |
| -------- | ----------- |
| `math-entry-spike-*.js` | **Removed** — replaced by `math-entry-*.js` |
| `lib/mathlive-spike/` | **Removed** — replaced by `lib/mathlive/` |
| `tests/s82-g2a-browser-validation.html` | **Retained** — test fixture; generator updated to production paths |
| `S82-G2A-spike-evidence.md` | **Retained** — historical evidence |
