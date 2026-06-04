# PR-W2a-1 — GAM pack authority trim

**Date:** 2026-06-04  
**Change class:** CC-CONTRACT (pack §6 only)  
**Charter:** [38B-W2A](38B-W2A-GAM-authority-review.md) §8  
**File:** `domains/learning-design/domain-learning-design-step-patterns.md` §6 Generate Activity Materials

---

## 1. Summary

Pack §6 `promptTemplate` and `defaultPromptNotes` now **delegate** table, materials, maths, and self-directed rhetoric to canonical runtime modules instead of duplicating their rules. The **`Facilitator use:`** output block is **re-scoped**: omitted when `delivery_context` is `self_directed`; optional when facilitated.

**No changes** to `app.js`, `lib/ld-*`, tests, renderer, or Sprint 38/39 assets.

---

## 2. What changed

### 2.1 Removed or replaced (duplicates)

| Former pack content | Replaced with |
|---------------------|---------------|
| Hard rule: full usable content / no outline | `LD-MATERIALS-COPY` ref |
| Pipe table header/divider/rows + malformed table-like | `LD-TABLE-FIDELITY` ref + B4 one-liner |
| Standalone TeX delimiter block | `LD-MATH-RENDER` / Math notation output contract ref (test anchor phrases retained) |
| `defaultPromptNotes` worked/faded/misconception/closure bullets | `LD-SELF-DIRECTED-RHETORIC` + `LD-MATERIALS-COPY` at runtime |
| Mandatory `Facilitator use:` for every material | Self-directed: **omit**; facilitated: optional brief note |

### 2.2 Preserved (GAM-specific)

- Materials realisation task and scope boundaries
- Material-type vocabulary (`task_cards`, `scenario`, `template`, table types, etc.)
- Output organisation schema (`Activity:` / `Material:` / `Content:`)
- `activity_id` / merge label discipline
- Chronological ordering note (mixed event lists; row order not answer key)
- Purpose bullets updated for table-author + materials-copy delegation

### 2.3 B4-facing pack note (concise)

In canonical contracts line:

> LD-TABLE-FIDELITY (GAM is primary table author — pipe tables or structured rows in Content; never comma-row pseudo-tables or Headers/Rows prose)

Full FORBIDDEN list remains in `lib/ld-table-fidelity.js` only.

---

## 3. Probe impact (self-directed GAM)

| Metric | Pre PR-W2a-1 (W1 exit) | Post PR-W2a-1 | Δ |
|--------|------------------------:|--------------:|--:|
| `packTemplateChars` | ~5,664 (interim audit) / ~4,377 seeded baseline | **3,909** | −~468–1,755 |
| `packNotesChars` | ~987 / ~1,700 | **373** | −~614–1,327 |
| `seededChars` | ~4,377–5,568 | **3,813** | −564–1,755 |
| `augmentedChars` | **16,370** | **15,806** | **−564** |
| Runtime `blockCount` | 6 | 6 | 0 |
| Markers | unchanged | unchanged | — |

Command: `node scripts/probe-38b1-ld-workflow-prompt-audit.js`

Four-step sum (DLA + GAM + Assessment + Design Page): **72,878** → **72,314** (−564; GAM pack-only delta).

---

## 4. Validation

| Check | Result |
|-------|--------|
| `node --test tests/*.test.js` | **722/722** pass |
| Runtime behaviour | Unchanged (pack seed only) |
| B4-01 / B4-02 | **OPEN** — no live output evidence in this PR |
| mathjax pack test anchors | Retained: `Math notation output contract`, `renderer-supported TeX delimiters`, `$...$`, `$$...$$`, `code spans/fences` |

---

## 5. Authority boundaries (post-trim)

| Layer | Owner |
|-------|--------|
| L4 table shape in `activity_materials` | **GAM pack ref** + **`LD-TABLE-FIDELITY` (author)** at runtime |
| L4 materials completeness | **`LD-MATERIALS-COPY` (author, embedded)** |
| L7 maths in material text | **`LD-MATH-RENDER`** |
| L5/L7 self-directed voice | **`LD-SELF-DIRECTED-RHETORIC` (GAM rider)** + pack output-organisation gate |
| L4 preserve upstream pipes | **Design Page** (Wave 3) — not GAM pack |

---

## 6. Next steps

| PR | Scope |
|----|--------|
| **PR-W2a-2** (optional) | Merge GAM runtime scaffolds (reading + voice + timeline) → single marker; marker count ≤4 |
| **EV-38B4-03** | Inflation GAM `activity_materials` capture for L4-07 |
| **Wave 3** | Design Page preserve contract + PREC live gate |

---

## 7. Governance

Recorded under [38B-7](38B-7-governance-and-maintenance.md) CC-PROMPT — pack §6 edit by GAM step owner; cross-step refs reviewed by materials fidelity owner (table authority).
