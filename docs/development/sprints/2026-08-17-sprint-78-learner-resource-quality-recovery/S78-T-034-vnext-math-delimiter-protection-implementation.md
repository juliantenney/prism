# S78-T-034 — vNext math-delimiter protection implementation

**Task:** S78-T-034  
**Status:** **IMPLEMENTATION COMPLETE** (2026-08-25)  
**Implements:** [S78-T-033](S78-T-033-literal-tex-learner-rendering-diagnostic.md)  
**Sprint 78:** OPEN · **T-013:** remains OPEN · **T-019:** not started  

---

## 1. Root-cause confirmation

[S78-T-033](S78-T-033-literal-tex-learner-rendering-diagnostic.md) established that valid TeX with single-letter subscripts (e.g. `\frac{U_x}{U_y}`) was corrupted at **vNext markdown-to-HTML** conversion: `renderMarkdownInline` applied underscore-emphasis rules inside `\(...\)` / `\[...\]` spans, injecting `<em>` tags. MathJax then could not typeset the damaged interior, producing literal TeX in the learner view.

Re-verified before implementation: `\frac{U<em>x}{U</em>y}` without protection; intact after this fix.

---

## 2. Exact production change

| File | Change |
| ---- | ------ |
| `lib/math-delimiter-markdown-protection.js` | **Added** — shared protect/restore helpers mirroring legacy `app.js` regex/token semantics |
| `lib/learner-renderer-vnext/render-html-utils.js` | **Updated** — protect maths before Markdown inline transforms; restore after; block-level protect/restore in `renderMarkdownBlock` |

**`renderMarkdownInline` flow:**

1. `protectSupportedMathDelimiters` — both `\(...\)` and `\[...\]`
2. `escapeHtml` + bold/italic/link transforms
3. `restoreProtectedMathDelimiters` with `escapeHtml`

**`renderMarkdownBlock` flow:**

1. `protectSupportedMathBlocks` on raw markdown (legacy parity)
2. existing block structure (headings, lists, tables, paragraphs)
3. `restoreProtectedMathBlocks` on joined HTML

TeX is preserved verbatim — no parsing, correction, or rewriting of mathematics.

---

## 3. Legacy reuse vs mirror

| Approach | Detail |
| -------- | ------ |
| **Shared module** | New `lib/math-delimiter-markdown-protection.js` extracts protect/restore semantics |
| **Legacy `app.js`** | **Unchanged** — still owns inline duplicate; behaviour mirrored, not refactored |
| **Token semantics** | Same `@@PRISMMATHBLOCK{n}@@` / `@@PRISMMATHINLINE{n}@@` tokens and non-greedy `\[[\s\S]*?\]` / `\([\s\S]*?\)` regexes as `utilityProtectSupportedMathDelimiters` |

Future optional refactor: wire legacy `app.js` to the shared module (out of scope for T-034).

---

## 4. Tests added/changed

**Added:** `tests/learner-renderer-vnext-math-markdown.test.js`

| Test | Coverage |
| ---- | -------- |
| Display MRS `\frac{U_x}{U_y}`, `\frac{p_x}{p_y}` | delimiters + TeX preserved; no `<em>` |
| Display FOC `U_x=\lambda p_x`, `U_y=\lambda p_y` | same |
| Inline `\(U_x\)` and `\(p_y\)` in one sentence | maths untouched |
| Prose `_emphasis_` outside inline maths | Markdown emphasis still works |
| Control `\frac{\partial L}{\partial m}` | unchanged |
| Multi-subscript `x_i + y_j = z_k` | intact |
| **Live path** — `renderLearnerPageForTest(..., { rendererVersion: "vnext" })` with MRS material body | full export HTML |
| **Live path** — inline + display mixed material | emphasis + maths |

**Changed:** none (existing suites untouched).

---

## 5. Test results

```text
node --test tests/learner-renderer-vnext-math-markdown.test.js
→ 8 pass / 0 fail

node --test tests/learner-renderer-vnext-heading-contract.test.js
→ 7 pass / 0 fail (sanity — markdown headings unaffected)
```

---

## 6. Live vNext path confirmation

Both live-path tests call `renderLearnerPageForTest` via `app.js` export pipeline on the heteroscedasticity assembled-page fixture with A1-M1 body replaced by MRS / mixed inline+display specimens.

Assertions on exported HTML:

- `data-renderer="vnext"` present
- `\frac{U_x}{U_y}` and `\frac{p_x}{p_y}` intact
- no `U<em>x` corruption
- prose `<em>economic intuition</em>` still renders outside maths

---

## 7. Unresolved risks

| Risk | Notes |
| ---- | ----- |
| **Legacy / vNext drift** | Two copies of protect/restore until optional `app.js` refactor |
| **Code-span / fence literals** | Same as legacy: delimiters inside backtick code are not protected (intentional — literals stay literal) |
| **Unbalanced delimiters** | No change — corrupt source still passes through; GAM integrity gate unchanged |
| **Operator visual re-check** | Fresh Lagrangian export should be visually confirmed post-deploy |

---

## 8. Files changed

| File | Change |
| ---- | ------ |
| `lib/math-delimiter-markdown-protection.js` | Added |
| `lib/learner-renderer-vnext/render-html-utils.js` | Math protect/restore |
| `tests/learner-renderer-vnext-math-markdown.test.js` | Added |
| `S78-T-034-vnext-math-delimiter-protection-implementation.md` | This record |
| `STATUS.md`, `PLAN.md`, `HANDOVER.md`, `next-chat-briefing.md`, `SPRINT-78-START-HERE.md` | Sprint navigation |

**Not changed:** GAM, LD-MATH-RENDER, maths-integrity validator, MathJax config, schemas, legacy renderer.

---

## 9. Sprint 78 state after T-034

| Item | Status |
| ---- | ------ |
| Sprint 78 | **OPEN** |
| T-013 | **OPEN** |
| T-033 | Diagnostic complete |
| T-034 | **Implementation complete** |
| T-019 | Queued — not started |
| Next | Fresh Lagrangian regen/benchmark + operator visual maths check |
