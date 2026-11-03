# Sprint 95 M4 — Compatibility inventory

**Date:** 2026-11-03  
**Journey under review:** *Deciding Under Uncertainty* / *Making Decisions Under Uncertainty*  
**Status:** Recorded before lifecycle extension; M4 code complete (awaiting acceptance)

## Source availability

| Source | Finding |
| ------ | ------- |
| Committed learner pages / LJ design page for the seven-component journey | **Absent** — journey lives in browser workflow store only |
| Sprint 91 `JOURNEY-PROTOTYPE-AUTHENTICATED-EXPORT.json` | Planning workflow only; no constituent learner HTML |
| Sprint 94 validation | Explicitly did **not** regenerate the journey |
| Machine-readable commission → product_id matrix for C1–C7 | **Not in repo** |

**Implication:** M4 cannot assemble the *live* stored journey from disk without an author export. Compatibility work uses **synthetic multi-type fixtures** that model the known product mix, plus Assessment Pack C5→C6 artefact handoff already proven in M3.

## Known journey shape (from Sprint 94 docs/tests)

| Commission (inferred) | Known role | Likely product |
| --------------------- | ---------- | -------------- |
| C1 | Opening Interactive; three study-provision options | `interactive` |
| C2–C4 / C7 | Not documented with product_ids in repo | interactive / expository / situated (unknown mix) |
| C5 | Independent judgement | `assessment_pack` |
| C6 | Reflect / defend using earlier judgement | `assessment_pack` |

Exact six-or-seven commission titles and product_ids remain author-store data.

## Runtime matrix (unified shell)

| Runtime | Standalone | Fragment mount (pre-M4) | M4 target |
| ------- | ---------- | ----------------------- | --------- |
| Draft persistence | Auto-boot | Install + dispose | Keep |
| Assessment + output | Auto-boot | Install + dispose | Keep |
| Guided review | Auto-boot | Install + dispose | Keep |
| Ordering workspace | Document click, no dispose | **Dead in shell** | **Install + dispose** |
| Math entry (MathLive) | Document boot + timers | **Dead / no enhance** | **Scoped install + dispose**; MathLive remount still empirical risk → textarea fallback if library absent |
| Revision criterion (R4) | Global document/window listeners | **Dead / leak risk** | Scoped install + dispose where markup present; residual complexity recorded |
| MathJax package assets | Package-side | Not in shell ZIP by default | Document: include when content needs it (debt) |

## What already works in the shell

- Assessment Pack (M1–M3), including C5→C6 artefact contract.
- Static Expository-like content (no special runtime).
- Draft restore across navigation for mounted workspaces.

## Gaps closed in M4 (code)

1. Ordering workspace lifecycle (container-scoped).  
2. Math-entry lifecycle (container-scoped; fallback without MathLive).  
3. Revision-criterion lifecycle (container-scoped install/dispose).  
4. Six-resource synthetic journey fixture covering interactive (ordering), expository, situated-style record, and dual Assessment Packs with artefact handoff.  
5. Compatibility warnings retained for unknown product types; `forceMount` no longer required for AP-like behaviour once runtimes install.

## Gaps remaining (debt)

| ID | Limitation |
| -- | ---------- |
| Real DUU HTML unavailable on disk | Cannot auto-verify live C1–C7 without author export |
| MathLive remount stability | Fallback path verified; full MathLive remount not claimed green |
| MathJax assets in unified ZIP | Not auto-bundled |
| Unified shell still additive | Multi-doc remains default download |
| Interactive V1 educational expansion | PB-FA-019 — out of sprint |
