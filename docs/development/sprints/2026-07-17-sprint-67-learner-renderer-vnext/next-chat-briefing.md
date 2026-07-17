# Sprint 67 — Next Chat Briefing

**Paste this into a new conversation to start Sprint 67.**

---

Sprint 66 is **paused**. Sprint 67 is **chartered**.

**Pack:** `docs/development/sprints/2026-07-17-sprint-67-learner-renderer-vnext/`  
**START HERE:** `SPRINT-67-START-HERE.md`  
**HANDOVER:** `HANDOVER.md`  
**Charter:** `SPRINT-67-CHARTER.md`  
**Context:** `context/README.md`

**Goal:** Complete the learner-renderer-vNext pipeline:

```text
PRISM JSON → validated learner-page view model → HTML
```

**Already done (Sprint 66):** types · archetype rules · validation · model builders · model review · architecture exclusion tests under `lib/learner-renderer-vnext/`.

**This sprint owns:** HTML renderers · CSS class reuse (no layout hacks) · feature flag · legacy coexistence · golden fixture / parity tests · rollout.

**Do not:**

* continue work under Sprint 66 numbering;  
* extend `ld-beat-assignment-compose` / dual-planner as the production architecture;  
* add English scoring, activity-ID branches, post-render insertion, or consumption flags;  
* mix legacy and vNext output in one render;  
* retire the legacy renderer (that is draft Sprint 68).

**Primary fixture:** `tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json`

**Next task:** **S67-BL-001** — freeze model review, implement logic-free HTML renderers from the page model only.

**Sprint 66 lesson (settled):** association architecture was the blocker; rewrite with an explicit view model, do not patch heuristics further.
