# Sprint 15 — Charter: Research Renderer and Page Delivery Maturity

**Date:** 2026-05-14  
**Path:** `docs/consolidation/sprint-15-charter.md`

**Sprint title:** Sprint 15 — Research Renderer and Page Delivery Maturity

**Status:** **Chartered (documentation)** — defines intent and boundaries for a **Research-first** delivery pass. Execution is **bounded** to the Utilities / **`page`** path unless the user explicitly widens scope in session.

---

## 1. Purpose (one sentence)

Verify and improve the **delivery layer** for Research workflows so that **Design Page → `page` JSON → PRISM Utilities → usable HTML** is **predictable, readable, and briefing-appropriate**—without a broad renderer or schema redesign.

---

## 2. Goals

- **End-to-end proof:** At least one **Research** workflow (including **Design Page** as terminal step) runs through **Utilities** and produces **acceptable HTML** for a policy-style briefing.
- **Minimal contract:** Document a **minimal Research `page` JSON contract** (fields, variants, fallbacks) that the renderer can rely on for **stable** output.
- **Presentation fit:** Establish or refine **typography and presentation conventions** suited to **research briefings** (headings, lists, emphasis, density—not a full design system).
- **Traceability:** Capture **lessons** that may **later** inform a **Learning Design** renderer review—**documentation and small hooks only** in Sprint 15, **not** an LD overhaul.
- **Regression safety:** Changes **do not** expand workflow **schema** surface area, **do not** regress Sprint **14** runnable Research behaviour, and **do not** claim portability or drop-in pack replacement.

---

## 3. Non-goals

- **Broad renderer redesign** or replacement of the Utilities pipeline.
- **Learning Design renderer overhaul** — explicitly **later**; Sprint 15 may **note** parallels only.
- **Workflow schema redesign**, new persistence shapes, or **multi-output schema explosion**.
- **Portability architecture** work (manifest, loaders, third-party pack programme).
- **Reopening Sprint 14** as an active implementation sprint — Sprint **14** is **baseline context** only (runnable Research + **Design Page** endpoint + save/export integrity); residual **I9.2** polish **moves here** as in-scope **Research page delivery**.

---

## 4. Constraints

- **Governance:** Prefer **small, reversible** changes in renderer paths and Research **`page`** expectations; any cross-cutting behaviour needs an explicit note in sprint docs.
- **Compatibility:** Preserve existing **Utilities** entrypoints and **`page`** handling contracts unless a follow-on charter approves migration.
- **Sprint boundaries:** **Do not** reopen Sprint **12** or **13** obligations. **Do not** restyle Sprint **15** as a portability umbrella.
- **Research-first:** Default test paths and contracts are **Research**; LD is **comparison / deferred** only.

---

## 5. Baseline context (Sprint 14 — closed for active work)

Sprint **14** delivered enough **Research runnable maturity** to exercise page delivery:

- **Design Page** terminal step for briefing-style Research flows (heuristic + pack policy).
- **Upload-path** behaviour aligned (**Generate Research Content** suppression where appropriate).
- **Save / export / normalisation** integrity (**self-binding** strip, **`selectedDomains`** preservation).
- **Automated tests** and consolidation closure notes: **`sprint-14-current-known-issues.md`** §**10** (completed), §**11** (residuals now largely **Sprint 15** scope where they concern **`page`** / Utilities).

Sprint **15** **assumes** that baseline and **does not** re-litigate Sprint **14** charter items except where a **page** contract or renderer bug **depends** on them.

---

## 6. Expected deliverables (staged)

1. **Verification note** — one **end-to-end** run (inputs, step chain, **`page`** JSON sample shape, Utilities output, screenshots or pasted HTML excerpts as appropriate).
2. **Minimal `page` contract doc** — either a new consolidation note under **`sprint-15-*`** or a bounded addition to **`docs/architecture/renderer-export-behavior.md`** (charter per PR).
3. **Targeted implementation** (optional per slice) — Utilities / sanitisation / section builders **only** where Research payloads fail or degrade readability.
4. **Typography / CSS** adjustments scoped to **research briefing** presentation (prefer existing patterns; avoid global theme rewrites).

---

## 7. Verification expectations

- **Manual E2E:** Research workflow → **Design Page** → copy or export **`page`** JSON → **Utilities** → generate → inspect HTML (structure, headings, accessibility basics).
- **Automated:** Run **`node --test tests/*.test.js`** (or a sprint-agreed subset) after any code change; add **narrow** tests only if they stabilise Research **`page`** rendering without coupling to full OpenAI runs.
- **No new portability claim.**

---

## 8. Explicit exclusions (scope creep)

| Excluded | Rationale |
|----------|-----------|
| LD renderer parity pass | Different charter; lessons **documented** only. |
| Orchestration / Factory generation rewrite | Sprint 14 territory; closed baseline. |
| New workflow output types beyond agreed **`page`** focus | Avoid schema explosion. |
| Manifest / pack portability redesign | Sprint 13 boundary. |

---

## 9. Recommended first task

Run **one** Research workflow **end-to-end** through **Design Page** and the **Utilities** renderer: inspect **`page` JSON** and rendered **HTML**, then **document** the **minimal Research page contract** required for reliable rendering (fields required vs optional, sane defaults, failure modes).

---

## 10. Review log

- **2026-05-14** — Sprint 15 charter and portable pack scaffolding created (`sprint-15-index.md`, development sprint folder, `current-state.md` pointer).
