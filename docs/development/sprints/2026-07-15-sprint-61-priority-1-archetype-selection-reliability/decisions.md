# Sprint 61 — Decisions

**Updated:** 2026-07-16 (closure)

**Frozen protocol:** [PHASE-A-PROTOCOL.md](PHASE-A-PROTOCOL.md)

---

## S61-D01 — Open Sprint 61 as measurement-and-calibration first

**Decision:** Open Sprint 61 — Priority-1 Archetype Selection Reliability. Frame as a measurement-and-calibration sprint. Do not expand Priority-2 inventory, authoring UI, renderer, or full support packages as primary objectives.

**Rationale:** Sprint 59 proved Priority-1 transfer; Sprint 60 proved production routing/delivery when plans exist. Spontaneous DLA selection from sparse briefs remains unproven; soft guidance + legal omission make under-selection the leading hypothesis.

**Evidence:** Sprint 59/60 closures; discovery notes on enrich-contract guidance-only selection.

**Date:** 2026-07-15

---

## S61-D02 — Freeze initial 10-brief acceptance matrix

**Decision:** Adopt the ten sparse briefs in [acceptance-matrix.md](acceptance-matrix.md) (B01–B10) as the frozen initial benchmark. Do not change brief wording between baseline and calibration runs.

**Date:** 2026-07-15

---

## S61-D03 — Provisional acceptance bar (review after baseline)

**Decision:** Use the provisional bar in [SPRINT-61-CHARTER.md](SPRINT-61-CHARTER.md) §10 for Sprint 61 exit judgement. Do not treat it as a permanent product gate until after Phase A evidence is reviewed. Escalate to a separately chartered deterministic-selection sprint if calibration within enrich-contract guidance cannot meet the bar.

**Measurement unit:** See **S61-D10** — bar uses brief-level aggregation, not single runs.

**Date:** 2026-07-15

---

## S61-D04 — Hand-authored DLA partials are not selection evidence

**Decision:** Sprint 60 Phase C mixed fixture and other hand-authored archetype JSON prove delivery given plans. They do **not** count toward Sprint 61 spontaneous-selection reliability.

**Date:** 2026-07-15

---

## S61-D05 — Canonical benchmark harness (protocol freeze)

**Decision:** Partial-page workflow is the **sole authoritative** Sprint 61 benchmark harness.

- All **scored** benchmark runs use partial-page mode (`pageEnrichmentV2` + `partialPageOutputs`).
- Enrich-in-place is **not** part of scored reliability metrics.
- Acceptance-bar calculations derive **only** from partial-page scored runs.
- Partial-page aligns with Sprint 58 canonical production architecture (Sprint 60 operationalisation path).

**Rationale:** Enrich-in-place embeds upstream page shell in the DLA prompt, adding non-sparse context and a different selection regime. Mixing modes would confound reliability measurement.

**Date:** 2026-07-15

---

## S61-D06 — Phase A replication policy (protocol freeze)

**Decision:** Phase A baseline uses **3 runs per benchmark brief** (30 scored runs total). Reliability reporting uses aggregate results. **One successful run is not reliability evidence.**

Optional non-scored smoke (≤2 briefs, 1 run each) may validate operator artefact capture before scored work; smoke runs are excluded from bar calculations.

**Date:** 2026-07-15

---

## S61-D07 — Page-level set comparison (no subjective primary material)

**Decision:** Classify each run from **page-level sets**, not operator judgement of a “primary teaching material.”

- `expected_set` — from frozen matrix (one Priority-1 ID or empty).
- `actual_set` — all non-empty `instructional_archetype` values on `required_materials[]`.

**Date:** 2026-07-15

---

## S61-D08 — Classification scheme and precedence (protocol freeze)

**Decision:** Add **`FALSE_POSITIVE`** and **`OVER_SELECTION`**. Do not reuse `WRONG_ARCHETYPE` for no-archetype briefs or expected+extra cases.

**Rationale:**

- `FALSE_POSITIVE` — dedicated code for B09/B10 when any Priority-1 is emitted; supports zero-tolerance bar rule.
- `OVER_SELECTION` — expected ID present with valid plan **plus** extra Priority-1 IDs; distinct from wrong-ID-only failures and from correct single-ID selection.

**Precedence (first match wins):**

```text
INVALID_TEST → INVALID_PLAN → PERSISTENCE_FAILURE → DELIVERY_FAILURE
→ FALSE_POSITIVE → OVER_SELECTION → WRONG_ARCHETYPE → UNDER_SELECTION
→ CORRECT_SELECTION → CORRECT_OMISSION
```

Full rules: [PHASE-A-PROTOCOL.md](PHASE-A-PROTOCOL.md) §6–7.

**Date:** 2026-07-15

---

## S61-D09 — Mandatory artefact pack (protocol freeze)

**Decision:** Every scored run retains the mandatory artefact pack defined in [PHASE-A-PROTOCOL.md](PHASE-A-PROTOCOL.md) §8 under `artefacts/phase-a/<benchmark-id>/<run-id>/`. Runs with incomplete packs classify as `INVALID_TEST`.

**Date:** 2026-07-15

---

## S61-D10 — Acceptance-bar aggregation unit (protocol freeze)

**Decision:** Provisional acceptance bar is measured at **brief level** after **3 runs per brief**, with rules:

| Criterion | Rule |
| --------- | ---- |
| False-positive briefs (B09, B10) | **All 3 runs** must be `CORRECT_OMISSION` (zero-tolerance) |
| Invalid plans | **Zero** runs `INVALID_PLAN` across all 30 |
| Persistence / delivery | **Zero** runs `PERSISTENCE_FAILURE` or `DELIVERY_FAILURE` in Phase A baseline |
| Strong majority correct selection | **≥6 of 8** positive briefs: brief-level outcome = `CORRECT_SELECTION` (majority ≥2/3 runs) |
| Each Priority-1 at least once | ≥1 positive brief with brief-level `CORRECT_SELECTION` per ID (mechanism, process, mental model) |

**Brief-level outcome:** majority classification among 3 runs; if no majority (SPLIT), brief does not count toward positive bar until resolved.

Run-level counts are diagnostic only.

**Date:** 2026-07-15

---

## S61-D11 — Protocol freeze authorises scored Phase A

**Decision:** Phase A protocol is frozen (S61-D05 … S61-D10). Scored Phase A baseline may begin without further methodological decisions. Benchmark wording, product code, and enrich-contract guidance remain unchanged for Phase A.

**Date:** 2026-07-15

---

## S61-D12 — Sprint 61-E01: evaluation_judgement production archetype

**Decision:** Extend the existing instructional-archetype allowlist with production ID `evaluation_judgement` (plan: question / criteria≥2 / evidence≥1 / tradeoffs≥1 / judgement_focus). Conceptual inventory names `evaluation` and `worked_judgement` map to this single ID. No new persistence, assembly, or renderer architecture.

**Evidence:** [E01-EVALUATION-JUDGEMENT.md](E01-EVALUATION-JUDGEMENT.md); `tests/ld-instructional-archetype-evaluation-judgement.test.js`

**Date:** 2026-07-15

---

## S61-D13 — Close Sprint 61; open Sprint 62

**Decision:** Close Sprint 61 as complete. Outcomes include protocol freeze, `evaluation_judgement` implementation, evaluative worked-example delivery refinement, and green instructional-archetype test suite (99/99). Open Sprint 62 — Coherent Renderer Pass as successor sprint.

**Evidence:** [SPRINT-61-CLOSURE.md](SPRINT-61-CLOSURE.md)

**Date:** 2026-07-16

---

## Pending (fill after Phase A)
- None. Sprint 61 closed.
