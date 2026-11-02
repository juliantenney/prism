# Sprint 94 — START HERE

**Sprint:** 94 — Learning Journey Continuity  
**Status:** **OPEN** — WP0–WP5 complete; WP6 ready; not started  
**Opened:** 2026-11-02  
**Type:** Bounded implementation — commissioning contract, not a product redesign  
**Opening decision:** [S94-D01](decisions.md#s94-d01--open-sprint-94--learning-journey-continuity)  
**Contract:** [S94-D02](decisions.md#s94-d02--retain-existing-commission-fields-p-1) … [S94-D06](decisions.md#s94-d06--author-only-inspectability-p-5) accepted  
**Charter:** [SPRINT-94-CHARTER.md](SPRINT-94-CHARTER.md)  
**Implementation map:** [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md)  
**Work log:** [PLAN.md](PLAN.md)  
**Validation:** [VALIDATION.md](VALIDATION.md)  
**Debt:** [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md)  
**Predecessor:** [Sprint 93 — CLOSED — ACCEPTED](../2026-10-07-sprint-93-assessment-pack-educational-contract/SPRINT-93-CLOSURE.md) — **do not reopen**  
**Backlog:** [PB-FA-022](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-022--learning-journey-continuity-contract)

---

## If you are starting a new session

1. Read this file.  
2. Read [SPRINT-94-CHARTER.md](SPRINT-94-CHARTER.md) and [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md).  
3. Read [decisions.md](decisions.md) — **S94-D01** and **S94-D02…D06** (P-1…P-5) are accepted.  
4. Implement **WP6 only** (S94-T-009) unless this chat is explicitly authorised to continue.  
5. Do **not** reopen Sprint 91, 92, or 93.  
6. Do **not** start Interactive V2 / [PB-FA-019](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-019--interactive-v2-educational-and-architectural-discovery).

| Fact | State |
| ---- | ----- |
| Sprint 93 | **CLOSED — ACCEPTED** — Assessment Pack |
| Sprint 94 | **OPEN** — Learning Journey continuity |
| WP0 | **COMPLETE** |
| WP1 | **COMPLETE** |
| WP2 | **COMPLETE** |
| WP3 | **COMPLETE** |
| WP4 | **COMPLETE** |
| WP5 | **COMPLETE** |
| WP6 | **READY — not started** |
| Implementation | WP1–WP5 landed; WP6 regression and live verification not started |
| Learning Journey home page | Complete and accepted (post-93; out of this sprint) |
| Constituents | Remain standalone; no learner-response sharing |
| Interactive V2 | Out of scope — PB-FA-019 |

---

## Working objective

Make Learning Journey continuity a **reliable commissioning contract**, so later independently generated components preserve essential shared context and understand what earlier components asked learners to do.

Knowing what learners were asked to do is not the same as knowing their individual responses.

---

## Hard non-goals

Do **not**:

- share learner responses across components;
- introduce a unified Learning Journey runtime;
- retrieve earlier learner answers automatically;
- redesign Interactive (PB-FA-019);
- redesign the Learning Journey home page;
- add a narrated slideshow product;
- substitute general graphics-to-embed media;
- reopen Assessment Pack calibration or publishing fixes.

---

## Current stop rule

WP0–WP5 are complete. Commissioned learner-copy stages receive the labelled ORIGINAL_BRIEF, WP4 honour instruction, and WP5 learner-facing bring-forward instruction. **WP6 is ready and not started.** The next conversation records regression tests and *Making Decisions Under Uncertainty* verification (S94-T-009) only when authorised.

Dashboard: [STATUS.md](STATUS.md) · Compact load: [next-chat-briefing.md](next-chat-briefing.md)
