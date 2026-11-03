# Sprint 96 — Resource-fidelity repair gate

**Date:** 2026-11-03  
**Status:** Complete (engineering) — stop before M3/M4  
**Authorisation:** Post–S96-D09 M2 acceptance; focused compatibility gate only  
**Decision:** [S96-D10](decisions.md#s96-d10--resource-fidelity-repair-gate)

## 1. S96-D09

**M2 ACCEPTED** (author review of exported unified *Deciding Under Uncertainty*). Recorded in [decisions.md](decisions.md).

## 2. Issue A — Missing graphics

### Root cause

Two cooperating defects in unified packaging:

1. **Fragment source preference.** `prepareUnifiedShellResources` preferred `sourcePage` re-render when both `sourcePage` and `learnerPackage` were present. Re-rendering without the package’s visual/workspace context omitted `<img class="util-visual-asset-image">` (and table workspaces). Media files were still copied into the ZIP → orphaned `media/<id>/…` entries.
2. **Asset path rewrite.** `rewriteAssetPaths` remapped `assets/` only, not relative `media/…` URLs used by current standalone packages. Even a correct fragment would resolve images against the wrong base under static hosting of `index.html`.
3. **Extractor.** Non-greedy nested-tag extraction could truncate nested `<article>` material blocks; replaced with balanced depth counting.

### Fix

- Prefer `learnerPackage.html` extract over `sourcePage` re-render.
- Remap relative `media/` and `assets/` (plus `srcset` / related attrs) to `media/<commissionId>/`; leave absolute, hash, and external URLs untouched.
- Strip leading `media/` / `assets/` when packing ZIP entries under `media/<commissionId>/`.

### Evidence

- Unit: `tests/s96-resource-fidelity.test.js` (4 pass).
- Browser (static host of reassembled DUU ZIP): `tests/s96-resource-fidelity-browser.test.js` (1 pass) — C2/C3/C4 graphics decode; `media/c2|c3|c4/…` URLs; no failed image HTTP responses.
- Screenshots: [evidence/m2-resource-fidelity/](evidence/m2-resource-fidelity/).

## 3. Issue B — Non-editable evaluation tables

### Standalone vs unified (real DUU)

| Resource | Standalone | Pre-fix unified (sourcePage path) | Post-fix unified (package path) |
| -------- | ---------- | ----------------------------------- | --------------------------------- |
| C2 *Your Four-Source Evaluation* | Editable `textarea.util-learner-table-workspace__input` with `aria-labelledby` | Controls absent from fragment | Controls present; drafts persist across nav |
| C4 *Three-Option Evidence Comparison* (author phrasing “Compare all three alternatives”) | Editable table workspace (9 inputs) | Controls absent | Controls present; drafts persist |
| C1 reference tables | Static HTML tables (class string “table-workspace” appears in CSS only; **no** input controls in DOM) | N/A | Still static — **not** a unified regression |

### Root cause

Same as Issue A item 1: package HTML was discarded in favour of a thinner `sourcePage` re-render that did not emit learner table workspaces. **Not** a missing lifecycle init on mounted controls, and **not** a requirement to invent editability for intentionally static tables.

### Fix

Package-HTML preference restores existing controls. No new interaction model. Keyboard focus and `aria-labelledby` preserved from standalone markup. Draft persistence uses existing page-key local storage (verified in browser test across C2↔C4 navigation).

## 4. Six-resource fidelity sweep (*Deciding Under Uncertainty*)

Compared standalone `index.html` vs extracted+rewritten unified fragments for c1–c6.

| ID | Graphics in fragment | Editable table inputs | Textareas | Notes |
| -- | -------------------- | --------------------- | --------- | ----- |
| C1 | Yes (2 packaged PNGs) | 0 (static tables only) | 0 | Radios/checks in standalone chrome/CSS counts, not learner main |
| C2 | Yes (2) | Yes (32) | Yes (46) | Four-Source Evaluation editable |
| C3 | Yes (2) | Yes (15) | Yes (34) | Parity with package main |
| C4 | Yes (3) | Yes (9) | Yes (32) | Three-Option Evidence Comparison editable |
| C5 | Yes (1) | 0 in main | Yes (constructed response) | Assessment pack; packaged editorial graphic |
| C6 | Yes (1) | 0 in main | Yes | Assessment / artefact consumer |

**Confirmed repaired:** missing packaged graphics; missing C2/C4 table workspaces under unified export.

**Not claimed as defects:** C1/C5 static tables without inputs; class-name count mismatches caused by CSS in full standalone HTML vs fragment-only HTML.

**Unverified risks (out of gate scope):** full screen-reader pass; MathLive remount (M4); contextual guidance copy (M3); every ordering/MCQ chrome control that lives outside `data-renderer=vnext` main.

## 5. Acceptance criteria checklist

| # | Criterion | Result |
| - | --------- | ------ |
| 1 | C2 graphics in exported unified journey | **Pass** (browser + evidence) |
| 2 | Other packaged graphics (C3/C4+) | **Pass** |
| 3 | Asset paths under static hosting | **Pass** (`media/<id>/…`, HTTP 200) |
| 4 | C2/C4 tables vs standalone | **Pass** — editable in both after fix |
| 5 | Unified input regression repaired | **Pass** (package preference) |
| 6 | Input persists across nav / remount | **Pass** (browser) |
| 7 | Keyboard + accessible labelling | **Pass** (focus + `aria-labelledby`; no SR claim) |
| 8 | No document-level horizontal overflow | **Pass** (browser assert) |
| 9 | 70ch reading width unchanged | **Pass** |
| 10 | Journey nav / persistence / C5→C6 handoff contracts | **Pass** — S95 artefact handoff suite still green; fidelity browser nav OK |
| 11 | Standalone publishing unchanged | **Pass** — no standalone assembler changes; multi-doc path untouched |

## 6. Files changed

- `lib/learning-journey-unified-shell.js` — extract, rewrite, prepare preference, ZIP media strip
- `tests/s96-resource-fidelity.test.js` — new
- `tests/s96-resource-fidelity-browser.test.js` — new
- Sprint 96 docs (this file, decisions, STATUS, VALIDATION, handover/briefing)

## 7. Stop condition

**Stop at this gate.** Do not begin M3 or M4 without authorisation. Do not switch publishing defaults.
