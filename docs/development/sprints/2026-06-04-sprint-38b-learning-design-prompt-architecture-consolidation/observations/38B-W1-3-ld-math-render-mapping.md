# PR-W1-3 — LD-MATH-RENDER mapping and size accounting

**Date:** 2026-06-04  
**Change class:** CC-MODULE  
**Baseline:** post PR-W1-2 four-step sum **157,699** (self-directed augmented)  
**Canonical source:** `lib/ld-math-render.js`

---

## 1. Inventory → taxonomy (L7)

| Source | Layer | Steps | → Module |
|--------|-------|-------|----------|
| `buildMathSafeOutputContractPromptBlock` / `applyMathSafeOutputContractToDraft` | L7 | DLA, GAM, Design Page, Assessment producer | **LD-MATH-RENDER** (runtime append) |
| LD-TABLE-FIDELITY math coexistence line | L4→L7 cross-ref | table embeds | **trimmed** → pointer to LD-MATH-RENDER |
| Pack §5/§6/§9/§13 short TeX delimiter lines | L7 | per step | **deferred** (pack trim Waves 2–3) |
| Domain `domain-learning-design-step-patterns.md` § Math notation | L7 doc | all | unchanged (authoritative doc; not runtime module) |
| `stripInternalPromptContractsFromVisibleText` leak patterns | hygiene | runner UI | extended for LD-MATH-RENDER marker |

**Removed from canonical block (owned elsewhere or redundant):**

- Structural markdown / compressed single-line prose rule → materials/layout (L4/L5), not L7 maths.
- “Preserve existing limited Markdown subset” → pack/markdown contract, not maths-specific.
- Long scope list (task cards, marking guidance, …) → slimmed to “activities, materials, assessment stems…”.

**Table rules:** LD-MATH-RENDER ends with one coexistence line pointing at LD-TABLE-FIDELITY; table module no longer duplicates TeX-in-table prose.

---

## 2. Wiring

| Consumer | Mechanism | Marker |
|----------|-----------|--------|
| DLA / GAM / Design Page / Assessment | `applyMathSafeOutputContractToDraft` → `buildLdMathRenderPromptBlock()` | **LD-MATH-RENDER (auto-applied)** — same count as legacy “Math notation output contract” |
| Browser | `index.html` loads `lib/ld-math-render.js` before `app.js` | — |
| Tests / probes | lib preload + `app.js` inline bootstrap fallback | — |

---

## 3. Size accounting (probe `probe-38b1-ld-workflow-prompt-audit.js`)

| Step | Post W1-2 | Post W1-3 | Δ W1-3 | Markers |
|------|----------:|----------:|-------:|--------:|
| DLA | 39,380 | 39,106 | **−274** | 14 |
| GAM | 37,516 | 37,226 | **−290** | 15 |
| Assessment | 32,308 | 32,034 | **−274** | 11 |
| Design Page | 48,495 | 48,205 | **−290** | 15 |
| **Four-step sum** | **157,699** | **156,571** | **−1,128 (−0.72%)** | — |

**vs 38B-1 baseline (152,782):** cumulative **+3,789 (+2.5%)** after W1-1+W1-2+W1-3.

**Standalone block (lib, with marker):** ~**1,050** chars (was ~**1,280** inline in `app.js`) → **~230 saved × 4 steps ≈ 920** on augmented prompts.

**Table embed cross-ref trim:** ~**90 chars ×** (GAM table marker + Design Page embedded table) → additional savings on GAM/Design Page only.

**Markers (GAP-02):** unchanged — one auto-applied block per step; title renamed to LD-MATH-RENDER.

---

## 4. Remaining duplication (documented)

| Location | Wave |
|----------|------|
| Pack template TeX one-liners per step | 2a / 2b / 3 |
| Domain step patterns § Math notation (doc mirror) | governance / optional sync |
| `app.js` inline bootstrap mirrors lib | post W1-5 |
| Self-directed rhetoric “maths clarity” phrasing | W1-4 |

---

## 5. Validation (38B-6 / 38B-7)

| Check | Status |
|-------|--------|
| L8-01 automated tests | **PASS** — 718/718 |
| MR-04 single lib authority | **Met** — `lib/ld-math-render.js` |
| GAP-02 marker count | **Target: no increase** |
| L7 maths behaviour preserved | TeX delimiters, JSON escape, HTML-escape ban, CAS disclaimer |
| L4 table pipe syntax | **PASS** — cross-ref only; no table rules in math module |
| No Sprint 38 / renderer / VEU / schema changes | **Met** |
