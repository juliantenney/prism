# Sprint 31 review log

**Format:** `R31-NNN` — decision · evidence · follow-up

---

| ID | Date | Decision | Evidence | Follow-up |
|----|------|----------|----------|-----------|
| R31-001 | 2026-06-01 | **Sprint 31 is presentation/rhetoric refinement, not pedagogy expansion** — renderer and embedded CSS only; preserve Sprint 30 PEC value in JSON; no new workflow steps or `metacognition_contract` under this programme | [`sprint-31-charter.md`](sprint-31-charter.md); [`sprint-31-seed-notes.md`](../2026-05-21-sprint-30-pedagogic-enrichment-layer/sprint-31-seed-notes.md); Sprint 30 [R30-999](../2026-05-21-sprint-30-pedagogic-enrichment-layer/review-log.md) | Slice 31-1 complete |
| R31-002 | 2026-06-01 | **Slice 31-1 approved and implemented** — meta fold summary **About this page**; `page_profile: learner` suppresses prominent **Audience:** line; production keys remain in collapsed `util-meta`; test floor **475** (+4 tests) | [`slice-31-1-charter.md`](slice-31-1-charter.md); probes 31-01/31-02; `app.js` R-layer only | Slice 31-2 complete |
| R31-003 | 2026-06-01 | **Slice 31-2 approved and implemented** — cue de-emphasis via **CSS/wrapper only** (`.util-activity-framing`, `.util-activity-task--primary`, softened PEL/cognition); all cue content preserved; test floor **481** (+6 tests) | [`slice-31-2-charter.md`](slice-31-2-charter.md); probes 31-03/31-04; `app.js` R-layer only | Slice 31-3 complete |
| R31-004 | 2026-06-01 | **Slice 31-3 approved and implemented** — `.util-knowledge-summary` / `.util-definition-list` / `.util-concept-relationships`; prose scalar support; `knowledge_summary_*` section dispatch; no concept inference; test floor **485** (+4 tests) | [`slice-31-3-charter.md`](slice-31-3-charter.md); probes 31-05/31-06; `shape-knowledge-summary-prose.json` | Charter **31-4** |
| R31-005 | 2026-06-01 | **Slice 31-4 approved and implemented** — `.util-materials-stack`, `.util-material-table`, template/prompt/example presentation tiers; no rewriting, inference, completion, schema, or generation work; test floor **490** (+5 tests) | [`slice-31-4-charter.md`](slice-31-4-charter.md); probes 31-07/31-08; `app.js` R-layer only | Charter **31-5** |
| R31-006 | 2026-06-01 | **Slice 31-5 approved and implemented** — activity-scoped `normalizeComparableText` registry; cross-block suppression for `purposeTask`, Guidance, support-note echoes; task never suppressed; `getUtilityPagePresentationCssV31_5`; test floor **497** (+7 tests) | [`slice-31-5-charter.md`](slice-31-5-charter.md); `shape-activity-echo-dedupe.json`; probes 31-09/31-10 | Slice 31-6 complete |
| R31-007 | 2026-06-01 | **Slice 31-6 approved and implemented** — `.util-assessment-prompt`, `.util-assessment-choices`, `.util-assessment-item--formative`; `getUtilityPagePresentationCssV31_6`; feedback/visibility semantics unchanged; test floor **502** (+5 tests) | [`slice-31-6-charter.md`](slice-31-6-charter.md); probes 31-11/31-12 | Sprint 31 close |
| R31-999 | 2026-06-01 | **Sprint 31 closed** — all six renderer-rhetoric slices complete; final suite **502** pass / **0** fail; programme preserved R-layer-only boundary with no generation, orchestration, composition, schema, PEC, or assessment-semantic changes | [`SPRINT-31-RETROSPECTIVE.md`](SPRINT-31-RETROSPECTIVE.md); [`CURRENT-STATE.md`](CURRENT-STATE.md); [`baseline-test-floor.md`](baseline-test-floor.md) | Open future programme for quantitative/math rendering or other deferred work; do not reopen Sprint 31 except for regression fixes |

---

## Deferred / future (post-close)

| Topic | Notes |
|-------|--------|
| **P31-03 quantitative / stats representative page** | Optional fixture capture — not blocking Sprint 31 close |
| **Quantitative / math rendering programme** | New charter if pursued |
| **`metacognition_contract`** | Sprint 30 Phase 3 — generation layer; outside Sprint 31 |
