# Sprint 96 — Decisions

## S96-D01 — Open Sprint 96 — Unified Learning Journey Experience & Compatibility

**Date:** 2026-11-03  
**Status:** Accepted  
**Depends on:** [Sprint 95 CLOSED — ACCEPTED](../2026-11-03-sprint-95-unified-learning-journey-runtime/SPRINT-95-CLOSURE.md) (S95-D07)  
**Baseline commit:** `c5d93e85cb4bf1457f499ccac76763d75d272dad`

**Decision:** Open **Sprint 96 — Unified Learning Journey Experience & Compatibility** as a bounded implementation sprint.

**Objective:** Deliver a polished, accessible unified Learning Journey experience while preserving constituent functionality (including mathematical input and rendering). After acceptance gates pass, unified publishing becomes the standard author-facing Learning Journey output; until then multi-document ZIP remains the default and may stay as a compatibility fallback.

**Authoritative basis:**

- Sprint 95 closure: unified runtime + author Unified download accepted; presentation, MathLive remount/packaging, contextual guidance accuracy, and default-switch deferred to architectural debt.  
- Product direction: standalone resources remain standalone HTML; Learning Journeys intend unified learner experiences; artefacts optional by design.  
- Read-only investigation (2026-11-03): sticky-stack layout root cause; MathLive/MathJax packaging gap vs standalone; see [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md).

**Not authorised by opening alone:**

- production code before **M1** is explicitly authorised in an implementation chat;  
- switching the default Learning Journey download (M5 gate only);  
- prompt-pipeline changes or regenerating educational content;  
- new frontend frameworks, server-side learner storage, AI marking;  
- Interactive V2 / Course Home;  
- reopening Sprint 94 or Sprint 95;  
- Git operations without separate authorisation.

**First deliverable:** Documentation pack + [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md) + [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md). First implementation slice when authorised: **M1 — Navigation and layout**.

**Predecessor:** Sprint 95 remains **CLOSED — ACCEPTED**. Do not reopen.

---

## S96-D02 — Sticky layout contract (measured dimensions)

**Date:** 2026-11-03  
**Status:** Accepted  
**Depends on:** [S96-D01](#s96-d01--open-sprint-96--unified-learning-journey-experience--compatibility)

**Decision:** Eliminate hard-coded offsets between the journey toolbar and resource section navigation. Use a robust layout contract based on actual rendered dimensions (`--lj-shell-toolbar-height` measured from `.lj-shell__toolbar`; section-nav clearance continues via `--learner-sticky-nav-height`).

**Not authorised:** M2 visual redesign; publishing default switch.

---

## S96-D03 — Collapsible journey TOC defaults and persistence

**Date:** 2026-11-03  
**Status:** Accepted  
**Depends on:** [S96-D01](#s96-d01--open-sprint-96--unified-learning-journey-experience--compatibility)

**Decision:** Journey TOC/sidebar defaults **expanded** on wide layouts and **collapsed** at viewport widths ≤860px. Explicit learner expand/collapse choices persist across resource navigation within the session.

**Not authorised:** M2 visual redesign of the sidebar chrome.

---

## S96-D04 — Contextual guidance approach (M3)

**Date:** 2026-11-03  
**Status:** Accepted (forward-looking; **superseded for regen scope by S96-D12**)  
**Depends on:** [S96-D01](#s96-d01--open-sprint-96--unified-learning-journey-experience--compatibility)

**Decision:** Permit narrowly scoped, runtime-contextual handling of instructions that contradict automatic artefact handoff. Originally: no educational content regeneration.

**Supersession:** [S96-D12](#s96-d12--authorise-m3--contextual-guidance) authorises narrowly scoped regeneration of affected instructional content for M3 only.

---

## S96-D05 — Mathematics packaging policy (M4)

**Date:** 2026-11-03  
**Status:** Accepted (forward-looking; **M4 not authorised**)  
**Depends on:** [S96-D01](#s96-d01--open-sprint-96--unified-learning-journey-experience--compatibility)

**Decision:** Bundle MathLive and MathJax according to demonstrated constituent requirements. Do not automatically include both when only one is needed.

**Not authorised:** Implementing M4 in this chat.

---

## S96-D06 — Content-viewer styling deferred to M2

**Date:** 2026-11-03  
**Status:** Accepted  
**Depends on:** [S96-D01](#s96-d01--open-sprint-96--unified-learning-journey-experience--compatibility)

**Decision:** Include content-viewer styling work in **M2** unless a specific defect blocks M1. M1 does not absorb content-viewer CSS scope.

---

## S96-D07 — Publishing model intent (M5)

**Date:** 2026-11-03  
**Status:** Accepted (forward-looking; **superseded for UI default by S96-D14**)  
**Depends on:** [S96-D01](#s96-d01--open-sprint-96--unified-learning-journey-experience--compatibility)

**Decision:** Unified Learning Journey publishing is the intended default. Originally: retain multi-document as labelled compatibility fallback after M5; do not switch until M5 gates pass.

**Supersession:** [S96-D14](#s96-d14--learning-journeys-publish-as-unified-experiences) advances the **author-facing** default to unified-only now. Multi-document packaging remains internal. **M4 mathematics compatibility and M5 final acceptance remain outstanding** — this is not Sprint 96 completion.

---

## S96-D08 — Accept M1 Navigation and Layout (engineering; visual not final)

**Date:** 2026-11-03  
**Status:** **Accepted** (with visual caveat)  
**Depends on:** [S96-D02](#s96-d02--sticky-layout-contract-measured-dimensions), [S96-D03](#s96-d03--collapsible-journey-toc-defaults-and-persistence)

**Decision:** Accept **M1 — Navigation and Layout** for the underlying engineering:

- Measured sticky positioning;
- Responsive layout behaviour;
- Sidebar collapse state and persistence;
- Keyboard and focus handling;
- Resource navigation lifecycle integration.

**Explicit caveat:** The M1 **visual presentation is not accepted** as the intended final learner experience. Oversized toggle, shell Previous/Next, partial-height sidebar, and redundant title bar are corrected under **M2**.

**Not authorised by this decision:**

- Treating M1 chrome as final UI;
- M3–M5 implementation;
- Publishing default switch.

**Evidence:** [VALIDATION.md](VALIDATION.md) (M1 rows). Follow-on: M2 visual coherence.

---

## S96-D09 — Accept M2 Visual Coherence

**Date:** 2026-11-03  
**Status:** **ACCEPTED**  
**Depends on:** [S96-D08](#s96-d08--accept-m1-navigation-and-layout-engineering-visual-not-final)

**Decision:** Accept **M2 — Visual Coherence** for the simplified unified Learning Journey shell. Author reviewed the latest exported unified *Deciding Under Uncertainty* Learning Journey and confirmed presentation and horizontal-overflow fixes are satisfactory.

Acceptance includes:

- Compact sidebar toggle;
- Persistent, full-height collapsed rail;
- Removal of redundant journey Previous/Next controls;
- Removal of redundant shell title bar;
- Harmonised journey and resource navigation styling;
- Corrected initial resource-heading focus behaviour;
- Container-relative table breakout sizing (`100cqw`);
- Elimination of document-level horizontal overflow;
- Preservation of the deliberate **70ch** reading width;
- No reported standalone navigation regressions.

**Not authorised by this acceptance:**

- M3 contextual guidance;
- M4 mathematics packaging;
- Publishing default switch;
- Resource typography or reading-width redesign;
- Screen-reader verification claims (keyboard/ARIA only).

**Evidence:** [VALIDATION.md](VALIDATION.md) (M2 rows); `evidence/m2-visual-coherence/`; `evidence/m2-horizontal-overflow/`.

**M2 refinement (authorised within M2, 2026-11-03):** After initial M2 review, author authorised three focused refinements without opening a new milestone:

1. Suppress intrusive resource-title focus outline on initial load (`skipFocus:true` + `:focus-visible` styling).  
2. Collapsed sidebar becomes a persistent ~56px full-height rail with the same toggle (no separate floating reopen).  
3. Harmonise resource section-nav chrome with journey sidebar tokens (`--learner-nav-*` in shared learner CSS).

**M2 overflow correction (authorised within M2, 2026-11-03):** Correct workspace horizontal scrollbar from viewport-based (`100vw`) table breakouts inside the sidebar-constrained shell. Rebase breakouts onto `#lj-shell-main` container width (`100cqw`).

---

## S96-D10 — Resource-fidelity repair gate

**Date:** 2026-11-03  
**Status:** **Accepted** (gate complete; stop before M3/M4)  
**Depends on:** [S96-D09](#s96-d09--accept-m2-visual-coherence)

**Decision:** Before M3, investigate and repair two functional fidelity issues found in live testing of the unified *Deciding Under Uncertainty* export. Treat as a focused compatibility gate within Sprint 96 — **not** a reopening of M2 visual design.

**In scope:**

- Missing graphics in unified resources despite media present in the ZIP;
- Non-editable evaluation tables vs standalone behaviour;
- Six-resource fidelity sweep for obvious lost content/controls.

**Out of scope / not authorised:**

- M3 or M4 implementation;
- Regenerating or rewriting educational content;
- Changing reading width, publishing defaults, or Sprint 95 contracts;
- Inventing editability for intentionally static tables.

**Outcome:** Package-aware fragment preference + media path rewrite restored graphics and C2/C4 table workspaces. See [RESOURCE-FIDELITY-GATE.md](RESOURCE-FIDELITY-GATE.md).

---

## S96-D11 — Accept resource-fidelity repair gate

**Date:** 2026-11-03  
**Status:** **Accepted**  
**Depends on:** [S96-D10](#s96-d10--resource-fidelity-repair-gate)

**Decision:** Author reviewed and accepted the resource-fidelity repairs in the real *Deciding Under Uncertainty* Learning Journey (graphics + editable evaluation tables under unified export).

**Not authorised by this acceptance alone:** M3/M4/M5; publishing default switch.

---

## S96-D12 — Authorise M3 — Contextual Guidance

**Date:** 2026-11-03  
**Status:** **Accepted** (implementation authorised; acceptance pending)  
**Depends on:** [S96-D11](#s96-d11--accept-resource-fidelity-repair-gate), [S96-D04](#s96-d04--contextual-guidance-approach-m3)

**Decision:** Authorise **M3 — Contextual Guidance**, including narrowly scoped regeneration of affected instructional content where necessary. This supersedes S96-D04’s regeneration ban **for M3’s specific purpose only**.

**Responsibility boundary:** Generated educational content describes the learning task; the delivery runtime explains how learner work is made available.

**Not authorised:** M4 mathematics packaging; M5 default switch; overwriting the author’s stored real journey without explicit confirmation; regenerating unrelated resources.

---

## S96-D13 — Propose accept M3 Contextual Guidance

**Date:** 2026-11-03  
**Status:** **Proposed — awaiting author**  
**Depends on:** [S96-D12](#s96-d12--authorise-m3--contextual-guidance)

**Decision (proposed):** Accept M3 for:

- Delivery-neutral commissioning / bring-forward prompts (no embedded save/copy/transfer mechanics);
- Unified runtime neutralization of contradictory delivery-mechanics prose when an explicit artefact contract applies;
- Accurate artefact availability / missing messaging;
- Standalone source HTML retaining manual-reference prose until optional C5/C6 regeneration;
- Candidate C5/C6 wording documented without overwriting stored workflows.

**Evidence:** [VALIDATION.md](VALIDATION.md); [M3-CANDIDATE-CONTENT.md](M3-CANDIDATE-CONTENT.md); `tests/s96-m3-contextual-guidance*.test.js`.

**Author action still needed to clean stored source prose:** confirm regenerate C5/C6, approve overwrite after backup, or leave source as-is (runtime fix sufficient for unified delivery).

---

## S96-D14 — Learning Journeys publish as unified experiences

**Date:** 2026-11-03  
**Status:** **Accepted** (product decision + UI implemented)  
**Depends on:** [S96-D09](#s96-d09--accept-m2-visual-coherence), [S96-D11](#s96-d11--accept-resource-fidelity-repair-gate)

**Decision:** All Learning Journeys are published as **unified learner experiences**. Unified packaging is the sole normal Learning Journey download — not an optional alternative to multi-document publishing.

**UI consequences:**

- Remove the separate **Download Unified Learning Journey** control.
- The normal package download while Learning Journey Authoring Preview is active produces the unified package (`index.html` + runtime + media) with automatic artefact-contract derivation from explicit commission dependencies.
- Label: **Download Learning Journey** (journeys) / **Download Resource** (standalone resources).
- No silent fallback to multi-document output when unified packaging fails.
- Legacy multi-document assembler retained internally for compatibility and regression tests — not exposed as an equal UI choice.

**Not changed by this decision:**

- Cross-resource artefact persistence remains optional and design-driven.
- Standalone resource publishing remains independent.
- **M4** mathematics compatibility (MathLive/MathJax packaging, remount, persistence) remains a **blocking technical gate**.
- **M5** final acceptance of the Sprint 96 experience remains outstanding.
- Do not claim full unified resource compatibility or Sprint 96 completion from this UI change alone.

**Evidence:** [VALIDATION.md](VALIDATION.md) (publishing rows); `tests/s96-lj-publishing-default.test.js`.

---

## S96-D15 — Viewport-centred reading column (shell layout)

**Date:** 2026-11-03  
**Status:** **Proposed — awaiting author review**  
**Depends on:** [S96-D09](#s96-d09--accept-m2-visual-coherence)

**Decision (proposed):** On sufficiently wide viewports, the **70ch** reading column is centred on the **browser viewport**, independent of sidebar expanded/collapsed state. Wide tables use the remaining visible main content width (`100cqw` after measured prose inset) and must not pass under the sidebar or reopen document-level horizontal overflow.

**Mechanism:** Measure side-by-side sidebar occupancy into `--lj-shell-sidebar-occupied`; set `#lj-shell-main` padding-left to `max(gutter, (100vw - 70ch)/2 - occupied)`; left-align `.util-learner-page` inside the shell. Stacked (narrow) sidebars report occupied `0`.

**Not authorised:** M4; sidebar redesign; reading-width change; educational content changes.

**Evidence:** [VALIDATION.md](VALIDATION.md); `evidence/viewport-centred-reading/`; `tests/s96-viewport-centred-reading.test.js`.
