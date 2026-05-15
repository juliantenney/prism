# GPT bootstrap — Sprint 16 (Renderer & page contract stabilisation)

**Role:** authoritative for **this pack only**.

**Pack path:** `docs/development/sprints/2026-05-15-sprint-16-renderer-page-contract-stabilisation/`

**Use this document** to start a **fresh chat** for Sprint **16**: **shared `page` contract** + **Utilities renderer hardening** for **Research** and **Learning Design** — **bounded** changes only.

**Snapshots:** Read from **`context-files/`** when the repo root is not attached.

---

## 1. Assistant role

You harden the **single** Utilities HTML path for **`artifact_type: page`**. Research and Learning Design both emit **`page`** JSON from **Design Page** and render through the **same** renderer (`buildUtilityStructuredHtml` → `utilityRenderPageSections`). You **do not** create separate domain renderers, **do not** redesign workflow schema, and **do not** run a broad Utilities rewrite.

---

## 2. Sprint status

| Sprint | Status |
|--------|--------|
| **Sprint 16** | **Active** — shared renderer & `page` contract stabilisation |
| **Sprint 15** | **Baseline only** — proved Research → Design Page → `page` → Utilities HTML |
| **Sprint 14** | **Baseline only** — runnable Research + Design Page endpoint + save/export integrity |

---

## 3. Read-first order

1. **`context-files/sprint-16-renderer-page-contract-stabilisation.md`** — prep note (contract, audit, P0/P1 tasks, fixtures plan)
2. **`context-files/renderer-export-behavior.md`** — current renderer pipeline behaviour
3. **`context-files/page-render-fixtures/`** — regression JSON shapes (Research bullets, LD activities, table, checkbox, metadata)
4. **`context-files/utility-page-render.test.js`** — page-level HTML tests
5. **`context-files/utility-markdown-bullet.test.js`** — markdown block tests
6. **`context-files/domain-research-step-patterns.md`** — Research **Design Page** (§13)
7. **`context-files/domain-learning-design-step-patterns.md`** — LD **Design Page** (§13)
8. **`context-files/domain-learning-design-artefacts.md`** — LD **`page`** artefact + **renderHints** (§18)
9. **`context-files/sprint-15-charter.md`** / **`sprint-15-index.md`** — Sprint **15** baseline context only
10. **Live repo (when mounted):** `app.js` — `handleUtilitiesGenerate`, `resolveUtilityRenderPlan`, `buildUtilityStructuredHtml`, `utilityRenderPageSections`, `sanitizeUtilityHtmlOutput`

---

## 4. What is already proven (Sprint 15 baseline)

- **E2E path works:** Research workflow (terminal **Design Page**) → **`page` JSON** → **Utilities** → preview/download HTML.
- **Automated regression:** `node --test tests/*.test.js` → **77 passed, 0 failed** (prep verification 2026-05-15).
- **Fixtures:** `tests/fixtures/page-render/` + `tests/utility-page-render.test.js` + `tests/utility-markdown-bullet.test.js`.

---

## 5. Unresolved issue (Sprint 16 focus)

- **Bullet/list rendering inconsistency** on real Research pages (and some LD string sections).
- **Renderer branch divergence:** Research typically uses `sections[].content` **strings** (markdown); LD uses **structured** activities, `materials` objects, `assessment_check.content.items` — same renderer, different code paths.
- **Metadata ordering:** `source_artefacts` / `generation_notes` may render outside the Production Metadata fold when `sectionOrder` does not match payload shape.
- **Hidden dependency:** Research **`page` renderHints** come from **Learning Design** artefact catalogue (`getArtefactRenderCatalog`); Research pack does not define its own `page` render metadata.

---

## 6. Immediate P0 / P1 tasks

| Priority | Task |
|----------|------|
| **P0** | Keep **`tests/fixtures/page-render/`** and page/markdown tests **green** in CI |
| **P1** | Guarantee Research **`sections[].content` strings** always reach **`utilityRenderMarkdownBlock`** |
| **P1** | Fold **`source_artefacts`** / **`generation_notes`** into **Production Metadata** (`<details class="util-meta">`) consistently |
| — | **Avoid** broad renderer redesign; surgical diffs + tests only |

**Do not reopen** workflow generation, Factory heuristics, or brief semantics **unless** a renderer test exposes a hard dependency.

---

## 7. Boundaries

- **No** separate Research or LD renderers.
- **No** Utilities UI redesign.
- **No** workflow schema / new output types.
- **No** portability architecture (Sprint 13 boundary).
- **Sprint 12–15** — not reopened as active obligations; **15** is delivery proof baseline only.
- Preserve LD pages that already render acceptably (regression via fixtures + smoke).

---

## 8. Recommended first task

1. Read **`context-files/sprint-16-renderer-page-contract-stabilisation.md`** §§**9–10**.
2. Run **`node --test tests/*.test.js`** (confirm green).
3. Implement **P1 metadata fold** or **Research string bullet** fix — smallest diff that improves E2E Research HTML; add/adjust a fixture if needed.

---

## 9. After renderer stabilisation (candidates — not Sprint 16)

- Research **elicitation** / sparse-brief testing.
- Research **`page_profile`** bridge toward **Learning Design Brief** workflows.

---

## Copy-paste block for the assistant

You are assisting with **Sprint 16 — Renderer & Page Contract Stabilisation** for PRISM. Read the pack at **`docs/development/sprints/2026-05-15-sprint-16-renderer-page-contract-stabilisation/`** — use **`context-files/`** when the full repo is not mounted.

**Sprint 16 is active.** **Sprint 15 is baseline only** (proved Research → Design Page → `page` → Utilities HTML). **Focus:** shared **`page` JSON contract** + **single Utilities renderer** hardening for **Research and Learning Design** — **no** separate domain renderers, **no** schema redesign, **no** broad renderer architecture rewrite.

**Start by reading** `context-files/sprint-16-renderer-page-contract-stabilisation.md` and **`context-files/page-render-fixtures/`**. **Unresolved:** bullet/list inconsistency and renderer branch divergence (string sections vs structured LD sections).

**P0/P1:** keep fixtures green; ensure Research `sections[].content` strings hit `utilityRenderMarkdownBlock`; fold `source_artefacts` / `generation_notes` into Production Metadata consistently.

**Do not reopen** workflow generation unless renderer tests force it. Run **`node --test tests/*.test.js`** after code changes (latest prep: **77 passed, 0 failed**).

---

## Review log

- **2026-05-15** — Bootstrap prompt for Sprint 16 portable pack (post prep note + page fixtures).
