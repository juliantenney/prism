# Sprint 96 — Implementation map

**Status:** **OPEN** — M1–M4 **ACCEPTED** (M3/M4/D15 qualified); **M5 verification prepared — not accepted**  
**Sprint:** 96 — Unified Learning Journey Experience & Compatibility  
**Opening:** [S96-D01](decisions.md#s96-d01--open-sprint-96--unified-learning-journey-experience--compatibility)  
**Charter:** [SPRINT-96-CHARTER.md](SPRINT-96-CHARTER.md)  
**Fidelity:** [RESOURCE-FIDELITY-GATE.md](RESOURCE-FIDELITY-GATE.md)  
**Investigation:** [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md)  
**M5 plan:** [M5-VERIFICATION.md](M5-VERIFICATION.md)  
**Baseline:** `c5d93e85cb4bf1457f499ccac76763d75d272dad`

Do not reorder milestones without a decision. Do not close Sprint 96 without M5 acceptance (or written deferral) and author approval.

---

## Current posture

```text
Sprint 95                             CLOSED — ACCEPTED — do not reopen
Sprint 96 open (S96-D01)              COMPLETE
Read-only investigation               COMPLETE
M1 Navigation and layout              ACCEPTED (S96-D08)
M2 Visual coherence                   ACCEPTED (S96-D09)
Resource-fidelity repair gate         ACCEPTED (S96-D11)
M3 Contextual guidance                ACCEPTED qualified (S96-D13)
Viewport-centred reading              ACCEPTED qualified (S96-D15)
M4 Mathematics compatibility gate     ACCEPTED qualified (S96-D16)
M5 Final acceptance                   OPEN — verification plan prepared
Default LJ download (author UI)       Unified package (S96-D14)
Legacy multi-document packager        Internal / tests only
```

---

## Milestones

| ID | Title | Status | Depends on |
| -- | ----- | ------ | ---------- |
| M1 | Navigation and layout | **ACCEPTED** | S96-D08 |
| M2 | Visual coherence | **ACCEPTED** | S96-D09 |
| — | Resource-fidelity repair gate | **COMPLETE** | S96-D10 |
| M3 | Contextual guidance | **ACCEPTED** (qualified) | S96-D13 |
| M4 | Mathematics compatibility gate | **ACCEPTED** (qualified) | S96-D16 |
| M5 | Final acceptance and publishing default | **OPEN** — not accepted | M1–M4 accepted; [M5-VERIFICATION.md](M5-VERIFICATION.md) |

### Task index (initial)

| ID | Title | Milestone | Status |
| -- | ----- | --------- | ------ |
| S96-T-001 | Open sprint + investigation + map | Open | **COMPLETE** |
| S96-T-002 | Fix sticky stack / section-nav overlap | M1 | **COMPLETE** |
| S96-T-003 | Journey Previous/Next presentation | M1/M2 | **COMPLETE** — M2 removed shell prev/next |
| S96-T-004 | Accessible collapsible journey sidebar | M1 | **COMPLETE** |
| S96-T-005 | Responsive + zoom measured layout | M1 | **COMPLETE** |
| S96-T-006 | Shell typography / spacing / hierarchy | M2 | **COMPLETE** |
| S96-T-007 | Resource heading + control consistency | M2 | **COMPLETE** — shell title bar removed; resource titles retained |
| S96-T-008 | Unified vs standalone contextual guidance | M3 | **COMPLETE** — accepted S96-D13 (qualified) |
| S96-T-009 | Bundle MathLive/MathJax in unified ZIP | M4 | **COMPLETE** — accepted S96-D16 (qualified) |
| S96-T-010 | MathLive enhanced remount + draft | M4 | **COMPLETE** |
| S96-T-011 | MathJax remount typeset | M4 | **COMPLETE** |
| S96-T-012 | Offline static-serve maths browser tests | M4 | **COMPLETE** |
| S96-T-013 | Real DUU + maths journeys + a11y gates | M5 | **IN PROGRESS** — plan in M5-VERIFICATION.md |
| S96-T-014 | Switch default LJ download to unified | Publishing / was M5 | **COMPLETE (UI)** — S96-D14; M5.1–M5.3 still open |

---

## Proposed order and dependencies

```text
M1 (layout/nav)
  │
  ├─► M2 (visual coherence — uses M1 tokens / chrome)
  │
  ├─► M3 (contextual guidance — needs stable chrome; low coupling to M2)
  │
  └─► M4 (maths gate — packaging independent of polish; remount interacts with M1 sticky)
         │
         └─► M5 (final acceptance → default switch)
```

**Rationale:** Sticky/token fixes in M1 unblock reliable reading space and reduce remount/layout interference with M4. M2 should not invent a parallel system before layout is stable. M3 is educationally important but must not rewrite content; it can trail M1. M4 is **blocking** for M5 regardless of polish. Default switch is **only** M5.

**Optional parallelisation (after M1 authorisation):** M4 packaging investigation/implementation may start once M1 sticky contract is agreed, without waiting for M2 visual polish — maths assets are orthogonal to typography. Do not flip the default until M5.

---

## M1 — Navigation and layout

**Goal:** Fix dual sticky overlap; clarify journey vs resource navigation presentation; add accessible collapsible TOC; improve responsive and zoom behaviour.

### Acceptance (draft)

1. Resource section nav no longer overlaps scrolling content under realistic toolbar heights and 150–200% zoom.  
2. Journey Previous/Next remain distinct from section Previous/Next (labels + placement).  
3. Collapsible journey sidebar: keyboard operable; `aria-expanded` / `aria-controls`; focus management; Escape closes when focus inside.  
4. ≤860px (or successor breakpoint) preserves reading space; sidebar does not permanently consume the column when collapsed.  
5. One `<main>` retained; journey hash vs section scroll contract preserved (`preserveJourneyHash`).  
6. Focused automated + browser evidence in VALIDATION.md.

### Likely touch points

| Area | Files |
| ---- | ----- |
| Shell chrome CSS / HTML | `lib/learning-journey-unified-shell.js` — `buildUnifiedShellChromeCss`, `buildLearningJourneyUnifiedShellHtml`, `buildShellControllerScript` |
| Section nav sticky | `lib/learner-renderer-vnext/sequential-section-nav.js` — `syncStickyOffset`, `stickyClearanceHeight` |
| Learner nav CSS | `app.js` — `getUtilityVnextProseMeasureCss` |
| Reminder collision | `lib/learner-renderer-vnext/revision-criterion-accompaniment.js` |
| Browser rebuild | `npm run build:learner-renderer-vnext-browser` |

### Investigation summary

Hard-coded `top:3.75rem` under dual sticky (toolbar + `.util-journey-nav`); `--learner-sticky-nav-height` omits shell toolbar; thin ≤860px stack; no collapsible TOC. Detail: [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md).

---

## M2 — Visual coherence

**Goal:** Simplify shell chrome toward a restrained ChatGPT-like interaction pattern (not branding): compact toggle, full-height sidebar, Contents as primary journey nav, no redundant title bar — **without** changing resource reading width (`70ch`).

### Acceptance

1. Compact icon toggle in expanded and collapsed states.  
2. Full-height sidebar (desktop) with independent TOC scroll.  
3. Shell Previous/Next removed; Contents list is primary journey nav.  
4. Shell title bar removed; resources present their own titles.  
5. Cleaner shell presentation; content-viewer CSS included (S96-D06).  
6. `--learner-reading-width: 70ch` unchanged.  
7. Sticky section-nav / reminder stack without title-bar collision.  
8. Keyboard/ARIA collapse behaviour preserved.  
9. Narrow + 200%/400% zoom usable.  
10. No standalone / artefact / draft regressions.

### Sticky contract without title bar

- `--lj-shell-toolbar-height` remains the shell→section-nav offset token, now **always `0px`** (no `.lj-shell__toolbar`).  
- `.util-journey-nav` uses `top: var(--lj-shell-toolbar-height, 0px)`.  
- `--learner-sticky-nav-height` continues to measure section-nav clearance for scroll-margin and revision reminders.  
- `shellToolbarHeight()` / `totalStickyClearanceHeight()` stay compatible; toolbar contribution is zero.

### Likely touch points (implemented)

| Area | Files |
| ---- | ----- |
| Shell chrome | `lib/learning-journey-unified-shell.js` |
| Content-viewer CSS resolve | same — `resolveLearnerExportCss` |
| Tests | `tests/s96-m2-visual-coherence*.test.js` (+ updated S95/S96 M1 suites) |
| Cache | `index.html` `?v=20261103-s96-m2-visual-coherence` |

---

## M3 — Contextual guidance

**Goal:** Unified-mode instructions accurately reflect automatic artefact handoff; standalone guidance preserved. Narrow regen authorised (S96-D12) but stored journey not overwritten without confirmation.

### Acceptance — **ACCEPTED** (qualified, S96-D13)

1. In unified shell, learners are not told they must manually transfer a response that the artefact contract already supplies.  
2. Standalone / stored source may retain manual-reference prose; optional C5/C6 cleanup **deferred** (not a runtime failure).  
3. Runtime neutralizes delivery-mechanics prose when an explicit artefact contract applies; prompts no longer require transfer-negation claims.  
4. Explicit artefact contracts and Sprint 94 bring-forward commissioning remain intact (educational reuse only).

### Delivered approach

- Delivery-neutral commissioning / honour / bring-forward prompts (`app.js`, Step 4 sibling, Assessment Pack Bind/Design).  
- `applyContextualHandoffGuidance` in `learner-artefact-contract.js` (wired via `injectArtefactReferences`).  
- Candidate C5/C6 wording in [M3-CANDIDATE-CONTENT.md](M3-CANDIDATE-CONTENT.md) — **not applied** in S96 (author deferred).

---

## M4 — Mathematics compatibility gate — **ACCEPTED** (qualified, S96-D16)

**Goal:** MathLive enhancement and MathJax typesetting work in the unified shell with remount, draft persistence, offline ZIP packaging, and AT/keyboard parity. Textarea fallback alone is **insufficient**.

### Acceptance

1. Unified ZIP for maths constituents includes resolvable MathLive and/or MathJax assets (prefer top-level `lib/mathlive/…`, `lib/mathjax/…`). — **Pass**  
2. Shell loads local MathLive CSS/JS and MathJax bootstrap (no CDN required offline). — **Pass**  
3. First mount: `math-field` enhanced mode (`util-learner-workspace--math-enhanced`), not only fallback. — **Pass**  
4. Remount ≥2 times: still enhanced; draft TeX restores into MathLive; no orphaned VK/listeners. — **Pass** (browser; VK hide on unmount)  
5. MathJax: delimiters typeset after mount **and** remount. — **Pass**  
6. Static serve with network blocked: maths still works. — **Pass** (CDN routes aborted)  
7. Non-maths journeys are not forced to ship maths assets. — **Pass**  
8. Standalone maths packaging regressions remain green. — **Pass**  
9. Keyboard / representative AT behaviour recorded for enhanced fields. — **Partial / qualified** — labels/focus retained; formal SR not claimed (M5.3 / S95-AD-020)

Evidence: [VALIDATION.md](VALIDATION.md) M4; decision [S96-D16](decisions.md#s96-d16--accept-m4-mathematics-compatibility-qualified).

---

## M5 — Final acceptance and publishing default — **OPEN**

**Goal:** Verify real DUU + maths journeys; a11y smoke; artefacts; persistence; regressions. Default download already unified (S96-D14).

**Plan:** [M5-VERIFICATION.md](M5-VERIFICATION.md) — **M5 not accepted**.

### Acceptance checklist

1. Real *Deciding Under Uncertainty* unified experience accepted (nav, artefacts, persistence, zoom/responsive). — **Requires S96 confirmation** (reuse M1/M2/fidelity/S95 with provenance)  
2. Representative maths journey under M4 criteria. — **D16 accepted (qualified)**; confirm M5.2 disposition in M5-VERIFICATION  
3. Keyboard/focus + representative screen-reader **smoke** recorded. — **Not completed** (prefer perform; comprehensive a11y separate)  
4. Standalone + multi-document regressions green. — **Passed** (cite existing suites)  
5. Default author-facing LJ download switches to unified; multi-doc fallback. — **Satisfied by S96-D14**  
6. Explicit decision records the default switch. — **Satisfied by S96-D14**

---

## Acceptance criteria (sprint-level)

1. M1–M4 accepted (qualifications only if programme-agreed).  
2. M5 gates pass and default switch decision recorded, **or** programme defers default with written rationale.  
3. Standalone publishing fully supported.  
4. Multi-document LJ available as fallback.  
5. Sprint 95 artefact/lifecycle contracts preserved.  
6. No prompt-pipeline / content regeneration.  
7. Evidence in VALIDATION.md.

---

## Risks

| Risk | Mitigation |
| ---- | ---------- |
| Sticky token change breaks standalone nav / revision reminders | Dual-path CSS (`lj-shell-body` scoped); regression suites |
| Collapsible TOC regresses landmarks / focus | Explicit a11y acceptance + browser tests |
| M3 guidance edit slips into content regen | Runtime-only presentation; refuse prompt/JSON rewrites |
| MathLive remount unstable (VK singleton) | Dedicated remount tests; document residual limits |
| Math asset ZIP size / path rewrite bugs | Reuse standalone collect/fetch APIs; offline Playwright |
| Premature default switch | Hard gate in M5; charter constraint |
| Scope expands into Interactive V2 / themes | Charter non-goals |

---

## Out of scope

PB-FA-019 Interactive V2; Course Home; server accounts; AI marking; new frameworks; regenerating journeys; Sprint 94/95 reopen; user theme UI as a product feature (token reuse only).
