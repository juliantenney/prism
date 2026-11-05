# Sprint 96 — Charter

**Sprint:** 96 — Unified Learning Journey Experience & Compatibility  
**Status:** **CLOSED — ACCEPTED** — [SPRINT-96-CLOSURE.md](SPRINT-96-CLOSURE.md)  
**Opened:** 2026-11-03  
**Type:** Bounded implementation  
**Predecessor:** [Sprint 95 — CLOSED — ACCEPTED](../2026-11-03-sprint-95-unified-learning-journey-runtime/SPRINT-95-CLOSURE.md) — **do not reopen**  
**Backlog:** [PB-FA-024](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-024--unified-learning-journey-experience--compatibility)  
**Opening:** [S96-D01](decisions.md#s96-d01--open-sprint-96--unified-learning-journey-experience--compatibility)  
**Map:** [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md)  
**Start here:** [SPRINT-96-START-HERE.md](SPRINT-96-START-HERE.md)  
**Baseline:** `c5d93e85cb4bf1457f499ccac76763d75d272dad`

---

## Mission

Deliver a **polished, accessible unified Learning Journey experience** while preserving the intended functionality of all constituent resources, including **mathematical input and rendering**.

After acceptance gates pass, unified publishing becomes the **standard author-facing Learning Journey output**. Until then, the multi-document ZIP remains the default (unified remains additive).

---

## Product direction

| Mode | Intended standard |
| ---- | ----------------- |
| Individual resources | Publish as standalone HTML |
| Learning Journeys | Publish as unified learner experiences |
| Cross-resource artefacts | Optional; determined by learning design |
| Multi-document LJ packager | Compatibility fallback (retained) |

**Do not switch the default publishing action until M5 acceptance gates pass.**

---

## Programme context

Sprint 95 established the unified runtime foundations: container-scoped mount lifecycle, additive unified shell, explicit artefact handoff, and author-facing **Download Unified Learning Journey**. Presentation polish, MathLive remount/packaging, contextual guidance accuracy, and making unified the default download were deferred (S95-AD-008, S95-AD-011/012, S95-AD-015…020).

This sprint absorbs that deferred experience and compatibility work without reopening Sprint 95 architecture.

Conference demonstration target remains **1–2 December 2026**.

---

## Architectural principles

1. Preserve Sprint 95 shell, lifecycle, and artefact contracts.  
2. One accessible HTML document for the Learning Journey; one active mounted resource.  
3. No iframe-based resource delivery.  
4. Standalone publishing remains fully supported and regression-locked.  
5. Multi-document ZIP remains available as compatibility fallback; default switch only after M5.  
6. Explicit artefact relationships only.  
7. Reuse existing resource styling and design tokens — no parallel visual system.  
8. Accessibility is an acceptance requirement (keyboard, focus, landmarks, representative SR).  
9. Mathematical functionality is a **blocking** requirement — textarea fallback ≠ MathLive success.  
10. No educational content regeneration; contextual guidance changes must preserve standalone accuracy.

---

## Scope

1. **M1** — Navigation and layout (sticky overlap, prev/next, collapsible TOC, responsive/zoom).  
2. **M2** — Visual coherence (typography, spacing, hierarchy; reuse tokens).  
3. **M3** — Contextual guidance (unified vs standalone accurate instructions; no content regen).  
4. **M4** — Mathematics compatibility gate (MathLive + MathJax packaging, remount, AT).  
5. **M5** — Final acceptance and publishing default switch.

---

## Stopping condition

Sprint 96 may close when M1–M5 are accepted (or remaining items are explicitly deferred with programme agreement), regressions remain green, and either:

- unified publishing is the standard LJ author output, **or**  
- the programme records why the default switch is withheld despite other gates.

---

## Explicit non-goals

- Prompt-pipeline changes; regenerating *Deciding Under Uncertainty* or other journeys.  
- New frontend frameworks; server-side learner storage; AI marking.  
- Interactive V2 (PB-FA-019); Course Home (PB-FA-016).  
- Reopening Sprint 94/95 commissioning or runtime foundations.  
- Parallel design-token / CSS system for the shell.  
- Accepting MathLive “done” based only on textarea fallback.
