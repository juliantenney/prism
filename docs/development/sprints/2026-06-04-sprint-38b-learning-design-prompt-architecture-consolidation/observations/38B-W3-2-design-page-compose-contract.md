# PR-W3-2 — LD-DESIGN-PAGE-COMPOSE-CONTRACT

**Date:** 2026-06-04  
**Scope:** `lib/ld-design-page-compose-contract.js`, `app.js` augmentation wiring, test/bootstrap updates  
**Out of scope:** Sprint 38 schema, renderer, VEU, pack §13 (W3-1), Sprint 39

---

## 1. Objective

Single canonical authority for Design Page **compose** responsibilities (L0–L3 membership/schema, L5 field preservation hooks, L4 preserve embed orchestration, L8 validation checklist) without inlining sibling module bodies.

---

## 2. Runtime inventory (before → after)

| Former block | Disposition |
|--------------|-------------|
| `Self-directed page activity field preservation (auto-applied)` | **Merged** into compose contract (self-directed only) |
| `Design Page activity materials fidelity (auto-applied)` | **Replaced** by `LD-DESIGN-PAGE-COMPOSE-CONTRACT` (L4 embed without duplicate markers) |
| `LD-MATERIALS-COPY` / `LD-TABLE-FIDELITY` standalone on DP | **Embedded** in compose (preserve role, `includeMarker: false`) |
| `LD-SELF-DIRECTED-RHETORIC` | **Unchanged** — separate append |
| Sprint 38 visual + pedagogical added-value | **Unchanged** — separate append(s) |
| `LD-MATH-RENDER` | **Unchanged** — separate append |
| PEL orientation (conditional) | **Unchanged** — separate when brief active |

---

## 3. Canonical module

**File:** `lib/ld-design-page-compose-contract.js`  
**Marker:** `LD-DESIGN-PAGE-COMPOSE-CONTRACT (auto-applied)`

**Owns (concise runtime prose):**

- Read-only page compose boundary
- Activity membership + `(U \ X) ⊆ C` + `activities_omitted[]` authority
- `assessment_check.content` items[] shape
- Field preservation field-id list (self-directed)
- Materials bridge line (additive page-root metadata only; figures-only representation_avoid)
- L4 preserve embed (materials-copy + table-fidelity preserve bodies)

**References only (not inlined):** LD-SELF-DIRECTED-RHETORIC, LD-MATH-RENDER, Sprint 38 contracts

---

## 4. Metrics (probe `scripts/probe-38b1-ld-workflow-prompt-audit.js`)

| Metric | Post W3-1 | Post W3-2 | Δ |
|--------|----------:|----------:|--:|
| `seededChars` | 7,745 | 7,745 | 0 |
| `augmentedChars` (self-directed) | 25,442 | **25,331** | **−111** |
| `blockCount` (unique markers) | 6 | **5** | **−1** |
| Facilitated `augmentedChars` | 20,657 | **21,115** | +458 (compose without field preservation) |

**Four-step augmented sum (self-directed):** 72,631 → **72,520** (−111)

**Block titles (self-directed):**

1. LD-SELF-DIRECTED-RHETORIC (auto-applied)
2. Sprint 38 visual affordance authoring contract (auto-applied)
3. Sprint 38 pedagogical added-value contract (auto-applied)
4. LD-DESIGN-PAGE-COMPOSE-CONTRACT (auto-applied)
5. LD-MATH-RENDER (auto-applied)

**Wave 3 target gap:** Further reduction toward **22k–23.5k** deferred to **PR-W3-3** (Sprint 38 example slim) — compose consolidation removed duplicate **markers** and wrapper preamble; largest remaining mass is Sprint 38 runtime + L4 embed bodies.

---

## 5. Regression gates

| Gate | Result |
|------|--------|
| `node --test tests/*.test.js` | **730 pass** (+6 compose tests) |
| B4 PREC / preserve embed | Unchanged semantics in embedded modules |
| Sprint 38 examples / schema | Unchanged |
| Renderer / VEU | No changes |

---

## 6. Files changed

| File | Change |
|------|--------|
| `lib/ld-design-page-compose-contract.js` | **New** canonical compose contract |
| `tests/ld-design-page-compose-contract.test.js` | **New** unit tests |
| `app.js` | `applyLdDesignPageComposeContractToDraft`; scaffolds drop separate field-preservation append; deprecated materials-fidelity aliases |
| `index.html` | Script include for compose lib |
| `tests/prism-vm-lib-bootstrap.js` | Load compose lib in VM |
| `scripts/probe-38b1-ld-workflow-prompt-audit.js` | Load compose lib |
| `tests/design-page-materials-fidelity.test.js` | Assert compose marker |
| `tests/sprint-38-visual-affordances.test.js` | Assert compose marker |
| `tests/workflow-self-directed-activity-framing-adoption.test.js` | Compose + lib bootstrap |
| `tests/workflow-pel-orientation.test.js` | Compose + lib bootstrap |
| `tests/workflow-pel-reasoning.test.js` | Lib bootstrap |

---

## 7. Next (PR-W3-3)

Slim Sprint 38 runtime (single example, drop duplicate additive preamble vs compose bridge) — primary path to **~22k–23.5k** augmented.

---

## 8. Sign-off

| Item | Status |
|------|--------|
| Single compose authority | **Yes** — `LD-DESIGN-PAGE-COMPOSE-CONTRACT` |
| Marker count reduced | **6 → 5** |
| Augmented chars reduced | **−111** (modest; embed bodies dominate) |
| Sprint 38 / B4 / renderer | **Unchanged** |
| Tests | **730 pass** |
