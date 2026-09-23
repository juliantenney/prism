# Sprint 87 — START HERE

**Sprint:** 87 — Expository Quality — First Successor Implementation  
**Status:** **IN PROGRESS** (T-001…T-006 complete 2026-09-23; WP5 in progress)  
**Type:** Implementation + validation  
**Backlog:** [PB-FA-012 — Expository Editorial Quality & QA](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-012--expository-editorial-quality--qa)  
**Predecessor:** [Sprint 86 — COMPLETE / CLOSED](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/T-012-SPRINT-86-CLOSURE.md)  
**Opening decision:** [S87-D01](decisions.md#s87-d01--open-sprint-87--expository-quality--first-successor-implementation)  
**QA instrument:** [S87-D02](decisions.md#s87-d02--accept-expository-qa-v02) · [EXPOSITORY-QA-v0.2.md](EXPOSITORY-QA-v0.2.md)  
**EQ1:** [S87-D03](decisions.md#s87-d03--eq1-ejp-contract-fields-commissioned_purpose--epistemic_form)  
**Chapter form:** [S87-D04](decisions.md#s87-d04--expository-chapter-form-eq7eq8--dp-sections-safety)  
**AD-010:** [S87-D05](decisions.md#s87-d05--ad-010-structured-material-semantic-rendering)  
**Presentation:** [S87-D06](decisions.md#s87-d06--expository-scoped-t-010-presentation)  
**Engineering gate:** [S87-D07](decisions.md#s87-d07--engineering-regression-gate--cross-product-isolation)  
**Authoritative design:** [S86 T-011](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/T-011-SUCCESSOR-IMPLEMENTATION-DESIGN.md) — **do not reopen prioritisation**  
**Dashboard:** [STATUS.md](STATUS.md) · **Charter:** [SPRINT-87-CHARTER.md](SPRINT-87-CHARTER.md) · **Handover:** [HANDOVER.md](HANDOVER.md)

---

## If you are starting a new session

> **Read this block first.** Sprint 87 implements the **bounded** first Expository quality slice. Sprint 86 remains **COMPLETE / CLOSED**. T-001–T-006 are complete (QA · EQ1 · chapter form · AD-010 · T-010 presentation · engineering gate). First-class gate **339/339**. WP5 is **IN PROGRESS**. Next task is **S87-T-007** (live/manual validation). Do **not** modify Interactive prompts to enable Expository. Do **not** close the sprint yet.

| Fact | State |
| ---- | ----- |
| Alpha | **Development complete** (unchanged) |
| First-class gate | **339/339** (`npm run test:first-class`) |
| Sprint 86 | **COMPLETE / CLOSED** |
| Sprint 87 | **IN PROGRESS** |
| S87-T-001…T-006 / WP1–WP4 | **COMPLETE** |
| WP5 | **IN PROGRESS** |
| Next authorised task | **S87-T-007** — live/manual validation |
| Interactive prompts | **Protected** |
| Production Expository | S85 + EQ1 + chapter form + AD-010 + Expository-scoped T-010; engineering-gated |

---

## Why this sprint exists

Sprint 86 established EQ1–EQ8, frozen C01–C05 evidence, pipeline/seam/typography designs, and a bounded first-slice design. Sprint 87 **implements and validates** that slice.

---

## What we are implementing (first slice only)

1. **EQ1** — purpose / epistemic-form preservation  
2. **EQ7** — chapter opening (drop default prospectus orientation stack)  
3. **EQ8** — single close (XD owns; omit default page Closing)  
4. **AD-010** — structured-material rendering repair (preserve unique content)  
5. **T-010** restrained CSS/renderer presentation (no font programme; keep ~70ch)  
6. **DP `sections` safety**

Product outcome (T-011): commissioned purpose preserved; chapter open/close; AD-010 gone without content loss; restrained non-card publishing chrome — without a new generative stage and without destabilising Interactive.

---

## Next task

**S87-T-007 — Live/manual Expository validation.**  
Engineering gate complete ([S87-D07](decisions.md#s87-d07--engineering-regression-gate--cross-product-isolation)). See [PLAN.md](PLAN.md) · [EXPOSITORY-QA-v0.2.md](EXPOSITORY-QA-v0.2.md).

---

## Deliberately out of scope

Full T-009 Option B · semantic H3s · font/serif programme · callout kits · new AI stage · post-XM rewrite · mandatory material↔figure 1:1 · changing 70ch for its own sake · design-system programme · CAS/table maths · Interactive prompt generalisation · Research Synthesis · Expository→Interactive.

---

## Success (not “perfect book chapter”)

Engineering: focused new tests + inherited first-class baseline green + Interactive regression where shared paths change.  
Learner-facing: qualitative QA v0.2 + live pressure cases (maths / low-visual / mechanism / interpretive / abstract) show chapter form, purpose-fit, AD-010 repair, restrained presentation, Interactive protected.

---

## Pack contents

- [SPRINT-87-CHARTER.md](SPRINT-87-CHARTER.md)  
- [EXPOSITORY-QA-v0.2.md](EXPOSITORY-QA-v0.2.md) — acceptance instrument  
- [STATUS.md](STATUS.md) · [PLAN.md](PLAN.md) · [decisions.md](decisions.md)  
- [HANDOVER.md](HANDOVER.md) · [next-chat-briefing.md](next-chat-briefing.md)  
- [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md) · [README.md](README.md)  

Programme: [NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md)
