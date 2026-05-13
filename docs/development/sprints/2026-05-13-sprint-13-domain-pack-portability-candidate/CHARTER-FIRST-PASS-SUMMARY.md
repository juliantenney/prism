# Sprint 13 — candidate first-pass charter summary (bounded)

**Status:** Candidate summary for continuity — **not** an implementation approval unless separately signed.

**Sprint 12:** First-pass A–E **closed** — `docs/consolidation/sprint-12-first-pass-structural-observability-closure.md` — **out of scope** for Sprint 13 prep; **do not reopen**.

---

## Purpose

**v1-safe** progress toward **domain-pack portability**: fewer **hardcoded domain ids and rows** in core; clearer **manifest-driven** domain UI; **documented** behaviour for **General / baseline / `alwaysOnDomains` / first-structured-domain** so new packs are easier to reason about. **Long-term:** drop-in packs with minimal/no core changes — **not** claimed complete here.

---

## Approved first-pass candidate scope (when chartered)

| ID | Scope | Notes |
|----|--------|--------|
| **S13-07** | **Documentation:** General as baseline/sentinel vs manifest `alwaysOnDomains`; interaction with **first structured domain** for `getWorkflowBriefConfig` (descriptive; no policy change in doc-only work). | Consolidation doc + optional `current-state` pointer |
| **S13-01** | **Manifest-driven domain UI** for **agreed, narrow** controls where **strict parity** with current manifest is provable | Remove redundant hardcoded rows only after parity checklist |

## Decision-gated (optional first-pass; default defer if undecided)

| ID | Scope | Gate |
|----|--------|------|
| **S13-02** | Default domain rule for Factory (or explicit manifest key) | Explicit recorded decision **before** code |
| **S13-03** | Display-only hint neutralisation | Proof of **non–prompt-facing** strings only; else **skip** |

---

## Explicit non-goals (first-pass and prep default)

- Semantic prompt migration; `briefLines` / extraction changes; generated-output assertion programs (unless future charter).
- Multi-domain brief config merge; `getGeneralFallbackBriefConfig` relocation.
- Starting artefact relocation; LD starting-point trio relocation; title-based domain injection replacement.
- Broad `app.js` refactor; persistence/import/export migration.
- Fallback/cache/`manifestPromise`/`textCache` work.
- Domain-pack schema redesign unless separately approved.
- Claiming **full drop-in portability** complete.
- **Reopening Sprint 12 A–E.**

---

## Guardrails

Evidence-first; v1-safe; strict parity for S13-01; no domain-pack edits in first-pass unless a future charter explicitly allows; no orchestration behaviour change without approval.

---

## Risks

UI regression on domain selectors; accidental prompt coupling if S13-03 is attempted without gate; scope creep into deferred items.

---

## Acceptance criteria (when implementing)

Sprint 12 untouched; regression set agreed in charter (e.g. existing `node --test` lanes + manual Factory smoke as specified); closure note distinguishes **shipped** vs **deferred** coupling.

---

## Review log

- **2026-05-13** — Candidate first-pass summary captured for Sprint 13 prep pack.
