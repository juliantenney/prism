# Sprint 87 — START HERE

**Sprint:** 87 — Expository Quality — First Successor Implementation  
**Status:** **READY / NOT STARTED** (pack created 2026-09-22)  
**Type:** Implementation + validation  
**Backlog:** [PB-FA-012 — Expository Editorial Quality & QA](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-012--expository-editorial-quality--qa)  
**Predecessor:** [Sprint 86 — COMPLETE / CLOSED](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/T-012-SPRINT-86-CLOSURE.md)  
**Opening decision:** [S87-D01](decisions.md#s87-d01--open-sprint-87--expository-quality--first-successor-implementation)  
**Authoritative design:** [S86 T-011](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/T-011-SUCCESSOR-IMPLEMENTATION-DESIGN.md) — **do not reopen prioritisation**  
**Dashboard:** [STATUS.md](STATUS.md) · **Charter:** [SPRINT-87-CHARTER.md](SPRINT-87-CHARTER.md) · **Handover:** [HANDOVER.md](HANDOVER.md)

---

## If you are starting a new session

> **Read this block first.** Sprint 87 implements the **bounded** first Expository quality slice designed in Sprint 86. It is **not** a general Expository redesign. Sprint 86 remains **COMPLETE / CLOSED**. Do **not** begin production coding before **S87-T-001** (QA v0.2). Do **not** modify Interactive prompts to enable Expository.

| Fact | State |
| ---- | ----- |
| Alpha | **Development complete** (unchanged) |
| First-class gate (inherited) | **339/339** |
| Sprint 86 | **COMPLETE / CLOSED** — investigation/design only |
| Sprint 87 | **READY / NOT STARTED** — pack open; work not begun |
| First authorised task | **S87-T-001** — draft Expository QA v0.2 |
| Production coding | **Not yet authorised to start** until T-001 completes |
| Design authority | [S86 T-011](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/T-011-SUCCESSOR-IMPLEMENTATION-DESIGN.md) |
| Interactive prompts | **Protected** ([S83-D04](../2026-09-21-sprint-83-expository-resource-investigation/decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline)) |
| Production Expository today | **Sprint 85** functional delivery — S87 polish **not yet shipped** |

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

## First task tomorrow

**S87-T-001 — Draft Expository QA v0.2** (before any production coding).  
Fulfils Sprint 86 WP2 carry-forward. See [PLAN.md](PLAN.md).

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
- [STATUS.md](STATUS.md) · [PLAN.md](PLAN.md) · [decisions.md](decisions.md)  
- [HANDOVER.md](HANDOVER.md) · [next-chat-briefing.md](next-chat-briefing.md)  
- [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md) · [README.md](README.md)  

Programme: [NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md)
