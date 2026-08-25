# S78-T-033 — Literal TeX learner-rendering diagnostic

**Task:** S78-T-033  
**Status:** **DIAGNOSTIC COMPLETE** (2026-08-25)  
**Mode:** Diagnostic / design only — **no production changes in this task**  
**Sprint 78:** OPEN · **T-013:** remains OPEN · **T-019:** not started  

**Validator / schema / T-026 / T-032 / GAM prompt:** **UNCHANGED**

---

## 1. Trigger exhibit

Post–T-026/T-029 fresh Lagrangian learner package validated and benchmarked strongly (operator report: **~91/100** overall; Subject & Disciplinary Quality **94**). Visual inspection nonetheless found some mathematical expressions displayed to learners as **literal TeX source** rather than rendered maths.

Representative operator-reported specimens:

```tex
\[
\frac{U_x}{U_y}
\]

\[
\frac{p_x}{p_y}
\]

\[
U_x=\lambda p_x
\]

\[
U_y=\lambda p_y
\]

```

Other mathematical notation in the same resource (e.g. Lagrangian partial-derivative blocks, `\lambda`, fractions without adjacent single-letter subscript pairs) rendered successfully.

**Artefact note:** The ~91/100 post–T-026/T-029 assembled page JSON / export HTML is **not archived in-repo**. Investigation uses operator-reported specimen shapes plus the closest archived Lagrangian GAM ([S78-T-013-candidate-6-gam-attempt-2.json](S78-T-013-candidate-6-gam-attempt-2.json)) and deterministic vNext renderer reproduction. This is **not** screenshot inference — corruption is reproduced in code from valid TeX inputs.

---

## 2. Failed specimens traced

### Specimen F1 — MRS ratio (display)

**Operator shape:**

```markdown
The tangency condition requires equality of marginal rates of substitution:

\[
\frac{U_x}{U_y}
\]

and

\[
\frac{p_x}{p_y}
\]
```

| Layer | Representation | Finding |
| ----- | -------------- | ------- |
| **GAM (expected / synthetic)** | Valid LD-MATH-RENDER TeX; `\[` / `\]` on own lines; `\frac{U_x}{U_y}` | `validateLearnerFacingMathIntegrity` → **pass** |
| **Design Page / assembly (expected)** | `materials[].body` string transport; no maths transform in `page-gam-materials-preserve.js` | **Fidelity preserved** (same string as GAM) |
| **Assembled page JSON (expected)** | Same `body` on activity material | **Unchanged** |
| **vNext learner HTML** | `renderMarkdownBlock` → `<p>\[ \frac{U<em>x}{U</em>y} \]</p>` | **Corrupted** — Markdown underscore-emphasis applied inside display-math delimiters |

### Specimen F2 — First-order conditions (display)

**Operator shape:**

```markdown
First-order conditions:

\[
U_x=\lambda p_x
\]

\[
U_y=\lambda p_y
\]
```

| Layer | Representation | Finding |
| ----- | -------------- | ------- |
| **GAM (expected / synthetic)** | Valid TeX | `validateLearnerFacingMathIntegrity` → **pass** |
| **Transport / JSON** | Unchanged string | **Fidelity preserved** |
| **vNext learner HTML** | `<p>\[ U<em>x=\lambda p</em>x \]</p>` | **Corrupted** — same mechanism as F1 |

### Specimen F3 — Inline subscripts in one paragraph (additional pattern)

Valid source `Use \(U_x\) and \(p_y\).` renders as:

```html
<p>Use \(U<em>x\) and \(p</em>y\).</p>
```

Emphasis spans can cross adjacent inline-math segments when single-letter subscripts create `_…_` patterns across `\)` / `\(` boundaries.

---

## 3. Successful control traced

### Control C1 — Candidate 6 GAM A3-M1 (archived)

**Source:** [S78-T-013-candidate-6-gam-attempt-2.json](S78-T-013-candidate-6-gam-attempt-2.json) · activity **A3** · material **A3-M1**

Representative display-math interior (excerpt):

```tex
\[
\frac{\partial L}{\partial m}=n-\lambda=0
\]
```

| Layer | Finding |
| ----- | ------- |
| **GAM JSON** | TeX intact; `\partial` subscripts; no `U_x` / `p_x` pairs |
| **Math integrity** | **pass** |
| **vNext HTML** | `<p>\[ \frac{\partial L}{\partial m}=n-\lambda=0 \]</p>` — **no `<em>` injection** |
| **MathJax (export shell)** | Delimiters present in HTML; bootstrap added at export (`utilityEnhanceExportHtmlWithMathJax`) — can typeset when HTML is valid |

**Why control succeeds:** vNext `renderMarkdownInline` applies `(^|[^_])_([^_\n]+)_` → `<em>` only when an opening `_` and a later closing `_` exist in the same processed paragraph. `\frac{\partial L}{\partial m}` uses `\partial` (not `_x}{U_`-style pairs) and does not form a Markdown emphasis span. This explains “some maths render, some show literal TeX” in the same resource without upstream authoring inconsistency.

---

## 4. Earliest divergence

**Earliest material divergence:** `lib/learner-renderer-vnext/render-html-utils.js` → `renderMarkdownInline` (line ~49), invoked from `renderMarkdownBlock` for every material / beat / synthesis paragraph.

**Mechanism:** vNext markdown rendering runs `escapeHtml`, then bold/italic/list transforms, **without** first protecting `\(...\)` and `\[...\]` spans. The underscore-emphasis rule treats TeX subscripts such as `U_x` … `U_y` as Markdown `_emphasis_`, injecting `<em>` tags into the TeX interior.

**Legacy contrast:** `app.js` `utilityRenderMarkdownBlock` / `utilityRenderMarkdownInline` call `utilityProtectSupportedMathDelimiters` **before** inline markdown transforms and `utilityRestoreProtectedMathDelimiters` after — see `utilityProtectSupportedMathBlocks` at render entry (~37740) and inline path (~37526–37552).

Upstream layers (GAM authoring, capture validation, Design Page transport, assembled JSON) retain valid TeX for F1/F2. Downstream MathJax receives **already-invalid** HTML and cannot typeset — the browser shows literal `\[` … `\]` source.

---

## 5. Root cause classification

| Hypothesis | Verdict |
| ---------- | ------- |
| Invalid TeX generated upstream | **Rejected** — integrity validator passes; corruption is introduced at HTML render |
| Valid TeX damaged during transport | **Rejected** — no transform on `materials[].body` between GAM and renderer input |
| Escaping / double-escaping | **Rejected** — delimiters remain `\[` / `\]` in output; damage is `<em>` injection |
| Markdown transformation | **Confirmed — root cause** |
| Delimiter loss | **Rejected** |
| Sanitisation | **Not implicated** |
| MathJax recognition / configuration | **Secondary** — MathJax is present on export; it fails because TeX interior contains HTML tags |
| Renderer handling (vNext markdown) | **Confirmed — fix owner** |

**Distinct from T-027/T-028/T-029:** those tasks addressed **authoring** of prose inside math spans and LD-MATH-RENDER prompt salience. T-033 is a **vNext renderer markdown / transport-to-HTML** defect affecting valid subscript notation.

---

## 6. Validator relationship

`validateLearnerFacingMathIntegrity` in `lib/ld-math-render.js` checks delimiter balance and garbling/prose **inside matched math spans in source text**. Well-formed `\[\frac{U_x}{U_y}\]` **correctly passes**.

This is **not a validator gap**. The validator’s contract is GAM/capture-stage source integrity. HTML markdown emphasis corruption happens **after** capture, in a layer the validator does not inspect — by design.

Adding validator rules for `_x` subscripts would not prevent literal TeX in the learner view and would false-negative legitimate TeX.

---

## 7. Correct owner

| Field | Value |
| ----- | ----- |
| **Fix owner** | `lib/learner-renderer-vnext/render-html-utils.js` |
| **Pattern** | Parity with legacy `utilityProtectSupportedMathDelimiters` / `utilityRestoreProtectedMathDelimiters` in `app.js` — protect `\(...\)` and `\[...\]` before `renderMarkdownInline` transforms; restore after |
| **Not owner** | GAM prompt, LD-MATH-RENDER contract, Design Page, assembler, MathJax bootstrap, `validateLearnerFacingMathIntegrity` |
| **Shared helper (optional)** | Extract protect/restore into a small shared module only if duplication cost is justified; smallest fix is local vNext protect/restore mirroring legacy regexes |

---

## 8. Minimal proposed fix (not implemented)

1. In `renderMarkdownInline`, before underscore/bold/italic rules:
   - tokenise `\[[\s\S]*?\]` and `\([\s\S]*?\)` spans (same regex family as legacy).
2. After markdown inline transforms, restore tokenised spans (HTML-escape restored TeX like legacy).
3. Optionally apply the same protection at the start of `renderMarkdownBlock` for block-level safety (legacy protects blocks before paragraph splitting).

**Do not:** weaken the math-integrity validator; add Lagrangian-specific rules; change schemas; alter T-026/T-032 behaviour.

---

## 9. Required live-path regression (for follow-on implementation)

Add a vNext-path test (new file or extend `tests/learner-renderer-vnext-html.test.js`) that exercises **artefact → assembled page → vNext HTML**, not source-string validation alone:

| Test | Assertion |
| ---- | --------- |
| **R1** | `renderMarkdownBlock` on `\[\frac{U_x}{U_y}\]` → no `<em>`; interior still `\frac{U_x}{U_y}` |
| **R2** | `renderMarkdownBlock` on `\[\frac{p_x}{p_y}\]` → same |
| **R3** | `renderMarkdownBlock` on `\[\frac{\partial L}{\partial m}=n-\lambda=0\]` → unchanged (control) |
| **R4** | `renderLearnerPageForTest(fixture, { rendererVersion: "vnext" })` with a material body containing F1 → exported HTML contains `\frac{U_x}{U_y}` and not `U<em>x` |
| **R5** | Optional: `utilityEnhanceExportHtmlWithMathJaxForTest` on R4 output still contains intact delimiters (MathJax shell unchanged) |

Existing `tests/mathjax-delimiter-preservation.test.js` covers **legacy** `utilityRenderMarkdownBlock` only (`activity materials regression: markdown heading and inline math underscores are preserved`). **No vNext test** currently guards this path.

---

## 10. Broader risk

Any learner-facing vNext content with TeX subscripts that form Markdown `_…_` spans is at risk, including:

- economics notation: `U_x`, `p_x`, `q_i`, MRS ratios;
- multi-subscript display math: `\frac{U_x}{U_y}`, `x_i + y_j`;
- adjacent inline maths with single-letter subscripts in one paragraph.

Notation using `\partial`, numeric subscripts without paired underscores (e.g. `x_1` alone), or symbols without emphasis-span pairing is less affected — matching the mixed render / literal-TeX symptom in the operator exhibit.

**Legacy renderer path** is protected today; **vNext is the sole learner export renderer** (S74A-D02), so this affects all current learner packages.

---

## 11. Required decision

> **At what exact layer does valid intended mathematics cease to be renderable, and what is the smallest correct owner for the fix?**

**Answer:** Valid TeX ceases to be renderable at **vNext markdown-to-HTML conversion** (`render-html-utils.js` / `renderMarkdownInline`), when underscore-emphasis rules run inside unprotected math delimiters. The smallest correct owner is **`lib/learner-renderer-vnext/render-html-utils.js`** (math-delimiter protect/restore parity with legacy). MathJax and upstream authoring are not the primary defect.

**Implementation warranted:** Yes — as a focused renderer fix + vNext live-path regression (proposed follow-on **S78-T-034**). Not in T-033 (diagnostic-only).

---

## 12. Files inspected

| File | Role |
| ---- | ---- |
| `lib/learner-renderer-vnext/render-html-utils.js` | vNext markdown render — defect site |
| `lib/learner-renderer-vnext/render-material.js` | Material body → `renderMarkdownBlock` |
| `lib/learner-renderer-vnext/render-learner-page.js` | vNext export HTML assembly |
| `app.js` | Legacy `utilityProtectSupportedMathDelimiters`, `utilityRenderMarkdownBlock`, MathJax export enhancement |
| `lib/ld-math-render.js` | Source integrity validator |
| `lib/page-gam-materials-preserve.js` | GAM material body transport |
| [S78-T-013-candidate-6-gam-attempt-2.json](S78-T-013-candidate-6-gam-attempt-2.json) | Archived control GAM (A3-M1) |
| `tests/mathjax-delimiter-preservation.test.js` | Legacy math/underscore regression |
| `tests/ld-math-render-integrity.test.js` | Source integrity only |
| `tests/learner-renderer-vnext-export-shell.test.js` | Export shell — no math delimiter assertions |
| `tests/learner-renderer-vnext-html.test.js` | vNext HTML — no math tests |

---

## 13. Files changed (this task)

| File | Change |
| ---- | ------ |
| `S78-T-033-literal-tex-learner-rendering-diagnostic.md` | **Added** — this record |
| `STATUS.md` | T-033 row + immediate priority pointer |
| `PLAN.md` | T-033 phase entry |
| `SPRINT-78-START-HERE.md` | T-033 pointer |
| `HANDOVER.md` | T-033 summary |
| `next-chat-briefing.md` | T-033 outcome |

**Production / test code:** **unchanged**

---

## 14. Sprint 78 state after T-033

| Item | Status |
| ---- | ------ |
| Sprint 78 | **OPEN** |
| T-013 | **OPEN** |
| T-033 | **Diagnostic complete** — vNext math-markdown protect/restore **recommended** (proposed T-034) |
| T-026 / T-028 / T-029 / T-032 | Complete — not implicated as root cause |
| T-019 | Queued — not started |
| Latest benchmark signal | Post–T-026/T-029 ~**91/100** with literal-TeX visual defect on subscript-heavy maths |
| Next authorised | **S78-T-034** (proposed) vNext math-delimiter protection + live-path regression; then operator visual re-check on fresh Lagrangian export |
