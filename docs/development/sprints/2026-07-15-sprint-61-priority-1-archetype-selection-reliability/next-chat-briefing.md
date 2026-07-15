# Sprint 61 — Briefing for New Chat

**Document role:** Concise transfer prompt. Details: [SPRINT-61-CHARTER.md](SPRINT-61-CHARTER.md) · [PHASE-A-PROTOCOL.md](PHASE-A-PROTOCOL.md).  
**Updated:** 2026-07-15 (protocol freeze)

---

## Briefing (copy below)

You are continuing PRISM on **Sprint 61 — Priority-1 Archetype Selection Reliability**.

**Phase A protocol is frozen** — [PHASE-A-PROTOCOL.md](PHASE-A-PROTOCOL.md) · S61-D05 … S61-D11. **Scored baseline is Go.**

**Sprint 58 closed** (partial-page = sole scored harness). **Sprint 59 / 60 closed.**

**Pack:** `docs/development/sprints/2026-07-15-sprint-61-priority-1-archetype-selection-reliability/`  
**Start:** [SPRINT-61-START-HERE.md](SPRINT-61-START-HERE.md)  
**Protocol:** [PHASE-A-PROTOCOL.md](PHASE-A-PROTOCOL.md)  
**Matrix:** [acceptance-matrix.md](acceptance-matrix.md)

---

### Unmistakable distinction

**Sprint 60** = routing/delivery when valid plans exist.  
**Sprint 61** = whether DLA creates plans unaided from sparse briefs.

Do **not** use hand-authored DLA partials as spontaneous-selection evidence.

---

### Phase A scored baseline (frozen)

| Rule | Value |
| ---- | ----- |
| Harness | **Partial-page only** (`pageEnrichmentV2` + `partialPageOutputs`) |
| Runs | **3 per brief · 30 scored total** |
| Sets | Page-level `expected_set` / `actual_set` (no subjective primary material) |
| Classifications | **10 codes** — precedence in protocol §7 |
| New codes | `FALSE_POSITIVE` (B09/B10) · `OVER_SELECTION` (expected + extras) |
| Bar unit | **Brief-level** majority (≥2/3); B09/B10 zero-tolerance (all 3 runs CORRECT_OMISSION) |
| Artefacts | Mandatory pack per run under `artefacts/phase-a/<brief>/<run-id>/` |

**Do not:** change benchmark wording · product code · enrich-contract (Phase A) · score enrich-in-place runs.

Run order: B09 → B10 → B01 → B04 → B07 → remainder.

---

### Closures

- [SPRINT-59-CLOSURE.md](../2026-07-14-sprint-59-instructional-content-richness-audit/SPRINT-59-CLOSURE.md)  
- [SPRINT-60-CLOSURE.md](../2026-07-15-sprint-60-instructional-archetype-operationalisation/SPRINT-60-CLOSURE.md)  
- [SPRINT-58-CLOSURE.md](../2026-07-09-sprint-58-partial-page-artefact-architecture-implementation/SPRINT-58-CLOSURE.md)
