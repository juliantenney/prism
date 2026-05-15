# Sprint Context

**Role:** authoritative for **this pack only** (Sprint 16 portable continuity).

**Sprint:** Sprint 16 — Renderer & Page Contract Stabilisation

**Pack path:** `docs/development/sprints/2026-05-15-sprint-16-renderer-page-contract-stabilisation/`

**Physical snapshots:** `context-files/` — copies for upload to a fresh chat; **not** authoritative over live repo paths. Prefer repo roots for **`app.js`** when implementing.

---

## Sprint 16 focus

- **Goal:** Stabilise the **shared `page` JSON contract** and **single Utilities renderer** for **Research** and **Learning Design** Design Page outputs.
- **Framing:** **Surgical hardening** — **not** separate domain renderers, **not** Utilities UI redesign, **not** workflow schema expansion, **not** portability architecture.

---

## Baseline (Sprint 15 — do not reopen)

Sprint **15** proved **Research → Design Page → `page` → Utilities → HTML** end-to-end. Treat **`context-files/sprint-15-charter.md`** and **`sprint-15-index.md`** as **historical baseline** only. Sprint **16** addresses **renderer/contract** residuals (bullets, metadata fold, branch consistency).

Sprint **14** remains **runnable Research** baseline (Design Page endpoint, save/export) — see **`docs/consolidation/sprint-14-current-known-issues.md`** in repo when mounted.

---

## Single renderer principle

| Domain | Design Page output | Renderer |
|--------|-------------------|----------|
| Research | `page` JSON, usually `sections[].content` markdown strings | Shared Utilities path in `app.js` |
| Learning Design | `page` JSON, structured activities/assessment | **Same** path |

**No** `researchRenderer` / `ldRenderer` split.

---

## Consolidation artefacts (Sprint 16)

| Artefact | Purpose |
|----------|---------|
| `context-files/sprint-16-renderer-page-contract-stabilisation.md` | Prep note: audit, contract, P0/P1, fixtures |
| `context-files/renderer-export-behavior.md` | Pipeline reference |
| `context-files/page-render-fixtures/` | Regression JSON |
| `context-files/sprint-15-*.md` | Sprint 15 baseline only |

**Live canonical:** `docs/consolidation/sprint-16-renderer-page-contract-stabilisation.md`

---

## Read-first order (from this pack)

1. `context-files/sprint-16-renderer-page-contract-stabilisation.md`
2. `context-files/page-render-fixtures/` (skim all seven JSON files)
3. `context-files/renderer-export-behavior.md`
4. `context-files/utility-page-render.test.js`
5. `context-files/domain-learning-design-artefacts.md` (§18 `page` renderHints)
6. `context-files/domain-research-step-patterns.md` + `domain-learning-design-step-patterns.md` (Design Page §13)
7. Live `app.js` when repo mounted

---

## Verification command

```bash
node --test tests/*.test.js
```

**Prep baseline:** 77 passed, 0 failed (2026-05-15).

---

## Review log

- **2026-05-15** — Sprint 16 portable context pack created.
