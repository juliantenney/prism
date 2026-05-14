# GPT bootstrap — Sprint 15 (Research renderer and page delivery)

**Role:** authoritative for **this pack only**.

**Pack path:** `docs/development/sprints/2026-05-14-sprint-15-research-renderer-page-delivery-maturity/`

**Use this document** to start a **fresh chat** for Sprint **15**: **Research** workflows → **Design Page** → **`page` JSON** → **Utilities** → **usable HTML** — **bounded** changes only.

**Snapshots:** Read from **`context-files/`** when the repo root is not attached.

---

## 1. Assistant role

You improve **Research page delivery maturity**: inspect real **`page`** payloads from Research + **Design Page**, render through **Utilities**, tighten **contracts** and **presentation** (typography, structure) with **minimal** code diffs. You **do not** redesign the whole renderer, **do not** overhaul LD rendering, and **do not** expand workflow schemas.

---

## 2. Read-first order

1. **`context-files/sprint-15-charter.md`**
2. **`context-files/sprint-15-index.md`**
3. **`context-files/renderer-export-behavior.md`**
4. **`context-files/sprint-14-current-known-issues.md`** — **§10** Sprint **14** baseline; **§11** items that overlap **`page`** / Utilities
5. **`context-files/current-state.md`**
6. **Live repo:** `app.js` (Utilities), `domains/research/domain-research-step-patterns.md` (**Design Page**), tests under `tests/` as needed

---

## 3. Boundaries

- **Sprint 12**, **13**, **14** — **not** reopened as active sprint obligations; **14** is **baseline context** only.
- **No** broad Utilities rewrite, **no** LD renderer programme, **no** portability architecture, **no** multi-output schema explosion.
- Prefer **documentation of minimal `page` contract** first, then **surgical** code changes with tests.

---

## 4. Recommended first task

Run **one** Research workflow **end-to-end** through **Design Page** and **Utilities**: capture **`page` JSON** (redact secrets), inspect **HTML**, then **write down** the **minimal Research page contract** (required keys, optional sections, defaults). Only then implement small renderer or prompt-template adjustments.

---

## 5. Constraints

- Preserve **Learning Design** pages that already render acceptably (regression smoke).
- Run **`node --test tests/*.test.js`** (or agreed subset) after code changes.
- **Do not** claim drop-in pack portability.

---

## Copy-paste block for the assistant

You are assisting with **Sprint 15 — Research Renderer and Page Delivery Maturity** for PRISM. Read the pack at **`docs/development/sprints/2026-05-14-sprint-15-research-renderer-page-delivery-maturity/`** — use **`context-files/`** when the full repo is not mounted. **Sprint 14** is **baseline only** (runnable Research + **Design Page** + save/export integrity); **do not** reopen Sprint **14** as the active sprint. **Sprint 15** is **Research-first** delivery: **Design Page → `page` JSON → Utilities → HTML**. **Non-goals:** broad renderer redesign, LD renderer overhaul, workflow schema redesign, portability architecture, multi-output schema explosion. **Recommended first task:** one **E2E** Research run through Utilities, then document the **minimal Research `page` contract** before coding. Keep diffs minimal; run **`node --test tests/*.test.js`** after substantive changes.

---

## Review log

- **2026-05-14** — Bootstrap prompt added for Sprint 15 portable pack.
