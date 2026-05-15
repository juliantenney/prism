# Session Handover — Sprint 16 portable pack

**Role:** authoritative for **this pack only**.

**Pack path:** `docs/development/sprints/2026-05-15-sprint-16-renderer-page-contract-stabilisation/`

**Date:** 2026-05-15

---

## What this pack is for

Portable context for **Sprint 16 — Renderer & Page Contract Stabilisation**. Physical copies in **`context-files/`** for assistants without the full repo; refresh from canonical paths when policies change.

---

## Sprint 16 purpose

Harden the **shared `page` artefact contract** and the **single Utilities page renderer** so **Research** and **Learning Design** Design Page outputs render predictably — without separate domain renderers or schema expansion.

**Pipeline (unchanged):**

`Design Page` → `artifact_type: page` JSON → `handleUtilitiesGenerate()` → `resolveUtilityRenderPlan` → `buildUtilityStructuredHtml` → `utilityRenderPageSections` → `sanitizeUtilityHtmlOutput` → HTML

**Both domains use the same renderer.** Research does not define its own `page` **renderHints**; render metadata comes from **Learning Design** `domain-learning-design-artefacts.md` §18 via `getArtefactRenderCatalog({})`.

---

## Sprint 15 baseline (do not reopen as active sprint)

Sprint **15** proved:

- Research workflow → terminal **Design Page** → **`page`** artefact → **Utilities** → usable HTML (first Research page rendered successfully).
- Sprint **15** prep/charter: minimal contract documentation intent; execution focus was Research-first delivery.

Sprint **16** continues from that proof with **contract + renderer** hardening for **both** domains on the **same** code path.

---

## Current unresolved issue

| Issue | Detail |
|-------|--------|
| **Bullet/list inconsistency** | Real Research pages: multiline `•`, inline `•` runs, `-` checklists behave differently depending on shape and branch |
| **Branch divergence** | Research: `sections[].content` **strings** → `utilityRenderPrimitive` → `utilityRenderMarkdownBlock`. LD: structured **activities**, **materials**, **assessment_check.items** → specialised helpers |
| **Metadata placement** | `source_artefacts` boolean list may appear in body before Production Metadata fold when render order falls through `Object.keys` fallback |
| **Test gap closed in prep** | Page fixtures now cover canonical Research `sections[].content` strings (not only LD `materials.content` wrapper) |

---

## Fixtures and tests (added in Sprint 16 prep)

| Path | Role |
|------|------|
| `tests/fixtures/page-render/*.json` | Seven regression payloads (Research bullets, LD activities+assessment, table, checkbox, metadata) |
| `tests/utility-page-render.test.js` | Full-page HTML via `buildUtilityStructuredHtmlForTest` |
| `tests/utility-markdown-bullet.test.js` | `utilityRenderMarkdownBlock` + LD materials bullet case |

**Snapshots in pack:** `context-files/page-render-fixtures/`, `context-files/utility-page-render.test.js`, `context-files/utility-markdown-bullet.test.js`

**Canonical consolidation note:** `docs/consolidation/sprint-16-renderer-page-contract-stabilisation.md` (copied to `context-files/`)

---

## Latest verification

```text
node --test tests/*.test.js
→ 77 passed, 0 failed (2026-05-15 prep / handover pack creation)
```

Re-run after any renderer change.

---

## Immediate P0 / P1 tasks (start tomorrow)

1. **P0** — Keep all page-render fixtures and utility tests green.
2. **P1** — Ensure Research **`sections[].content` strings** always route to **`utilityRenderMarkdownBlock`** (no silent fallback to escaped plain text or wrong list shape).
3. **P1** — Render **`source_artefacts`**, **`constraints_applied`**, **`generation_notes`** inside **Production Metadata** consistently when `sections` is present.
4. **Constraint** — No broad renderer redesign; surgical `app.js` changes + fixture updates only.

**Do not** reopen workflow generation / Factory / brief semantics unless a failing renderer test proves a dependency.

---

## Next sprint candidates (after renderer stabilisation)

- Research **elicitation** and **sparse brief** testing.
- Research **`page_profile`** as bridge for **Learning Design Brief** workflows.

---

## What has been prepared in this pack

| File | Purpose |
|------|---------|
| `GPT-BOOTSTRAP-PROMPT.md` | Fresh-chat bootstrap + copy-paste block |
| `HANDOVER.md` | This handover summary |
| `SPRINT-CONTEXT.md` | Focus, boundaries, read-first order |
| `CURRENT-STATE.md` | Active sprint + next action |
| `context-files/` | Doc and test snapshots (see below) |

### `context-files/` inventory

| Snapshot | Canonical source |
|----------|------------------|
| `sprint-16-renderer-page-contract-stabilisation.md` | `docs/consolidation/` |
| `sprint-15-charter.md`, `sprint-15-index.md` | Sprint 15 baseline |
| `renderer-export-behavior.md` | `docs/architecture/` |
| `current-state.md` | `docs/development/` (point-in-time; pack `CURRENT-STATE.md` for Sprint 16 focus) |
| `domain-research-step-patterns.md` | Research Design Page §13 |
| `domain-learning-design-step-patterns.md` | LD Design Page §13 |
| `domain-learning-design-artefacts.md` | LD `page` + renderHints |
| `utility-page-render.test.js`, `utility-markdown-bullet.test.js` | `tests/` |
| `page-render-fixtures/*.json` | `tests/fixtures/page-render/` |

---

## What to do next (tomorrow)

1. Open **`GPT-BOOTSTRAP-PROMPT.md`** in a fresh chat (or paste the copy-paste block).
2. Read **`context-files/sprint-16-renderer-page-contract-stabilisation.md`**.
3. Run **`node --test tests/*.test.js`** — confirm green.
4. Pick **one P1** item (metadata fold or Research string bullets); implement with fixture coverage.
5. Update **`docs/consolidation/sprint-16-renderer-page-contract-stabilisation.md`** review log when a slice lands.

---

## Review log

- **2026-05-15** — Sprint 16 portable handover pack created (post prep note, page fixtures, 77-test green run).
