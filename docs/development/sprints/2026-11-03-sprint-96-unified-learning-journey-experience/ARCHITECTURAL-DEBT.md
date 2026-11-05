# Sprint 96 — Architectural debt

**Sprint:** 96 — Unified Learning Journey Experience & Compatibility  
**Status:** **CLOSED — ACCEPTED** — residual items below remain deferred (not reopen triggers)

Residual debt at close. Do **not** mark comprehensive accessibility as resolved.

---

## Protected prior state

| Item | State |
| ---- | ----- |
| Sprint 91–94 | **CLOSED** |
| Sprint 95 | **CLOSED — ACCEPTED** — unified runtime + additive author Unified download |
| Baseline | `c5d93e85cb4bf1457f499ccac76763d75d272dad` |

---

## Inherited from Sprint 95 (in scope for Sprint 96)

| ID | Finding | Sprint 96 target |
| -- | ------- | ---------------- |
| S95-AD-015 | Section-nav overlapping scrolling content | **Addressed in M1** (accepted) |
| S95-AD-016 | Journey sidebar / Previous/Next visual refinement | **Addressed in M2** (S96-D09 accepted) — shell prev/next removed |
| S95-AD-017 | Accessible collapsible journey TOC | **Addressed in M1**; compact chrome **M2** (accepted) |
| S95-AD-018 | Responsive layout and zoom behaviour | **Addressed in M1** (accepted); rechecked in M2 |
| S95-AD-019 | Context-sensitive C5/C6 manual-transfer instructions | **Addressed in M3** (S96-D13 accepted qualified) — stored source cleanup deferred |
| S95-AD-020 | Further keyboard / screen-reader verification | **Open — comprehensive a11y** (M5.3 smoke accepted qualified, S96-D17) |
| S95-AD-011 | MathLive remount stability | **Addressed in M4** (S96-D16 accepted) — residual VK singleton risk remains documented |
| S95-AD-012 | MathJax / MathLive not auto-bundled in unified ZIP | **Addressed in M4** (S96-D16 accepted) — need-based shell-level packaging (S96-D05) |
| S95-AD-008 | Unified not yet default LJ download | **Resolved** (S96-D14 + S96-D19/D20) | Author download is unified-only |

---

## Carried / out of scope this sprint

| ID | Finding | Status |
| -- | ------- | ------ |
| S95-AD-001 | Interactive V1 / PB-FA-019 | **Out of scope** |
| S95-AD-002 | Multi-doc ZIP as compatibility fallback | **Active** — retained after default switch |
| S95-AD-005 | User-controlled themes | **Later** |
| S95-AD-006 | Server learner accounts | **Out of scope** |
| S95-AD-007 | Course Home | **Later** (PB-FA-016) |
| S95-AD-013 | Artefact contract not persisted on design page | **Acceptable** — derive at assemble |

---

## New findings (Sprint 96 investigation)

| ID | Finding | Status | Notes |
| -- | ------- | ------ | ----- |
| S96-AD-001 | Shell sticky offset hard-coded `3.75rem`; sticky token omits toolbar | **Resolved in M1/M2** | Toolbar removed; var remains `0px` |
| S96-AD-002 | Revision reminder fixed chrome unaware of shell toolbar | **Mitigated in M2** | Toolbar gone; reminder uses `--learner-sticky-nav-height` only |
| S96-AD-003 | Unified ZIP omits MathLive/MathJax; fragments strip script/head bootstrap | **Addressed in M4** (S96-D16 accepted) | Shell-level need-based `lib/` + post-mount typeset |
| S96-AD-004 | Content-viewer CSS may be incomplete in shell Node resolve | **Resolved in M2** | `getUtilityLearnerContentViewerCss` wired in Node resolve |
| S96-AD-005 | M3 guidance surface scope (runtime-only vs generated prose) | **Resolved in M3** | Runtime + delivery-neutral prompts; optional C5/C6 regen |
| S96-AD-006 | Sidebar/TOC visual hierarchy and reading typography | **Addressed in M2** (accepted) | Shell + shared `--learner-nav-*` |
| S96-AD-007 | Full SR verification of collapse/expand | **Open** | M5.3 smoke accepted (S96-D17, qualified); comprehensive a11y / skip NVDA retest remain here |
| S96-AD-008 | Narrow (≤860px) expanded sidebar uses max-height stack | **Accepted trade-off** | Collapsed rail remains full-height |
| S96-AD-009 | Initial-load programmatic title focus showed browser outline | **Resolved in M2 refinement** | `skipFocus` on boot + `:focus-visible` |
| S96-AD-010 | Unified workspace horizontal scrollbar from `100vw` table breakouts | **Resolved in M2** | Shell override uses `#lj-shell-main` `100cqw` |
| S96-AD-011 | Unified missing graphics despite ZIP media | **Resolved in S96-D10** | Prefer package HTML; rewrite `media/` paths |
| S96-AD-012 | Unified dropped editable table workspaces | **Resolved in S96-D10** | Same package-preference fix; C1 static tables not a regression |
| S96-AD-013 | Generated C5/C6 prose embeds transfer mechanics | **Mitigated in M3** (S96-D13) | Runtime neutralize + prompt fix; **stored source cleanup deferred** |
| S96-AD-014 | Reading column shifts when sidebar toggles | **Accepted** (S96-D15 qualified) | Viewport-centred; 400% zoom not comprehensive a11y |
| S96-AD-015 | Optional C5/C6 source-prose cleanup after M3 | **Deferred** | Author: do not regen in S96; candidate wording retained |
| S96-AD-016 | LJ QA v1.2 cross-journey validation | **Deferred** | DUU provisionally calibrated/frozen (author summary); second journey still required |
| S96-AD-017 | Learner-facing `cN` identifiers in stored DUU prose | **Open — content still uncorrected** | Generation prevention shipped (title directory + commissioning constraint); stored DUU C3–C6 still needs author edit/targeted regen — [EDITORIAL-CORRECTION.md](evidence/duu-cross-resource-title-refs/EDITORIAL-CORRECTION.md) |

---

## Explicitly out of sprint

Prompt-pipeline changes; educational content regeneration; new frameworks; AI marking; Interactive V2; Course Home; reopening Sprint 94/95; accepting MathLive via textarea fallback alone.
