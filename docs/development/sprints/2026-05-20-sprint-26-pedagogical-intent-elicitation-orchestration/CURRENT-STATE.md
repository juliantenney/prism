# Sprint 26 (pedagogical intent) — current state

**Date:** 2026-05-20  
**Pack path:** `docs/development/sprints/2026-05-20-sprint-26-pedagogical-intent-elicitation-orchestration/`  
**Status:** **Track A fix landed** — topology rules in `app.js` + pack; **259** tests; browser E2E optional

**Handover:** [`HANDOVER.md`](HANDOVER.md) — **start Track A** section for next session

**Sibling pack (renderer presentation):** [`../2026-05-20-sprint-26-renderer-presentation-consolidation/`](../2026-05-20-sprint-26-renderer-presentation-consolidation/) — **paused**

---

## Verification floor

```bash
node --test tests/*.test.js
```

**259 passed**, 0 failed (2026-05-20).

---

## Track status

| Track | Topic | Status |
|-------|--------|--------|
| **A** | Missing activity/material workflow steps (RNA sparse brief) | **Fixed** — `activities_required` + pack/heuristics; see `tests/workflow-ld-rna-sparse-brief-topology.test.js` |
| **B** | Assessment MCQs missing from export HTML | **Closed** — renderer hotfix R26-PI-007, R26-PI-008 |

---

## Active slice: 26-1

| Item | State |
|------|--------|
| Charter | [`slice-26-1-charter.md`](slice-26-1-charter.md) |
| Mode | **Track A:** documentation / investigation only |
| **Track A** | Missing Design Learning Activities + Generate Activity Materials |
| **Track B** | **Complete** — not a blocker for continuing sprint |
| Next output | Track A evidence table, failure locus, topology rules draft, fixture candidates |

---

## Track B closure summary (reference)

| Item | Detail |
|------|--------|
| Issue type | **Renderer/export** — not orchestration or Design Page composition (valid `assessment_check` in JSON) |
| Root cause | `assessment_check` detection + **section object binding** (heading/content vs catalogue `sectionOrder` index) |
| Code | `app.js` |
| Tests | `tests/utility-ld-rna-assessment-page-render.test.js`, fixture `ld-rna-hcv-assessment-page.json` |
| Decisions | R26-PI-007, R26-PI-008, R26-PI-009 |

---

## Slice roadmap

| Slice | Status |
|-------|--------|
| **26-1** Investigation (**Track A**; Track B done) | **Active** |
| **26-2** Signal taxonomy + topology rules (design) | Not started |
| **26-3** Regression fixtures | Not started |
| **26-4** Bounded fixes (topology / elicitation) | Not started |
| **26-5** Resolved-brief UI | Not started |

---

## Manual checks

**Track B:** Fixture/unit coverage sufficient; optional live RNA re-export in browser not required to continue sprint.

**Track A (post-26-4):** Re-run RNA brief end-to-end — confirm activity/material steps present.

Renderer sibling pack: optional kitchen sink / inflation browser preview — see [`sprint-26-pause-note.md`](../2026-05-20-sprint-26-renderer-presentation-consolidation/sprint-26-pause-note.md).

---

## Frozen

- Sprint 25 composition/export contracts
- Track B renderer scope — **closed**
- No topology/pack/elicitation changes in 26-1 (Track A doc only until 26-4)

