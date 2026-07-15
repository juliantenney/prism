# Sprint 61 — Acceptance Matrix

**Sprint:** 61 — Priority-1 Archetype Selection Reliability  
**Status:** Phase A — protocol frozen; scored baseline ready to start  
**Contract under test:** current production DLA enrich-contract guidance (no Phase B changes until baseline complete)  
**Protocol (frozen):** [PHASE-A-PROTOCOL.md](PHASE-A-PROTOCOL.md) · [decisions.md](decisions.md) S61-D05 … S61-D11  
**Updated:** 2026-07-15

---

## Purpose

Record **spontaneous** Priority-1 selection from ordinary DLA planning on sparse briefs.

**Sprint 60** proved routing/delivery when valid plans exist.  
**Sprint 61** tests whether DLA **creates** those plans unaided.

Do **not** use hand-authored DLA partials as evidence here.

---

## Protocol summary (frozen)

| Item | Rule |
| ---- | ---- |
| Harness | **Partial-page only** (scored runs) |
| Runs per brief | **3** (30 scored total) |
| Classification | Page-level `expected_set` / `actual_set`; precedence in [PHASE-A-PROTOCOL.md](PHASE-A-PROTOCOL.md) §7 |
| Bar measurement | **Brief-level** aggregation — [PHASE-A-PROTOCOL.md](PHASE-A-PROTOCOL.md) §9 |
| Artefacts | Mandatory pack per run — [PHASE-A-PROTOCOL.md](PHASE-A-PROTOCOL.md) §8 |

---

## Benchmark conditions (every run)

Confirm all before recording a valid result (else classify `INVALID_TEST`):

- [ ] **Partial-page harness** (`pageEnrichmentV2` + `partialPageOutputs`; not enrich-in-place)
- [ ] No `S59_MECHANISM_TEST` / `S59_PROCESS_TEST` / `S59_MENTAL_MODEL_TEST`
- [ ] No `window.__PRISM_S59_*_TEST`
- [ ] `selected_dla_test === "none"`
- [ ] No fixture emission block; no capture stamp
- [ ] No manual `instructional_archetype` JSON insertion
- [ ] No instruction such as “use a mechanism explanation,” “use a process walkthrough,” or “use a mental model”
- [ ] No archetype coaching in Copilot chat
- [ ] Ordinary workflow inputs only (sparse brief as goal/LO stem)
- [ ] DLA capture validated before delivery judgement
- [ ] Mandatory artefact pack complete
- [ ] Material quality assessed only if `archetype_delivery.pass === true` (optional; not required for selection classification)

---

## Result classifications (ten codes — do not collapse)

| Code | Meaning |
| ---- | ------- |
| `INVALID_TEST` | Benchmark conditions violated or incomplete artefact pack |
| `INVALID_PLAN` | Any Priority-1 row present; plan incomplete/invalid |
| `PERSISTENCE_FAILURE` | Valid emit lost after capture/persist |
| `DELIVERY_FAILURE` | Valid persisted plans; `archetype_delivery.pass === false` |
| `FALSE_POSITIVE` | Expected none; `actual_set` non-empty |
| `OVER_SELECTION` | Expected ID present with valid plan; **plus** extra Priority-1 IDs |
| `WRONG_ARCHETYPE` | Expected non-empty; actual IDs exclude expected |
| `UNDER_SELECTION` | Expected non-empty; `actual_set` empty |
| `CORRECT_SELECTION` | `actual_set === expected_set`; all plans valid |
| `CORRECT_OMISSION` | Expected none; `actual_set` empty |

**Precedence:** see [PHASE-A-PROTOCOL.md](PHASE-A-PROTOCOL.md) §7.

---

## Frozen sparse briefs

| ID | Expected set | Sparse brief (verbatim — do not edit between baseline and calibration) |
| -- | ------------ | ---------------------------------------------------------------------- |
| **S61-B01** | `{mechanism_explanation}` | Explain why enzyme reaction rate rises then falls as temperature increases, via intervening physical and chemical processes. |
| **S61-B02** | `{mechanism_explanation}` | Explain how a central-bank policy-rate rise transmits through to lower household spending. |
| **S61-B03** | `{mechanism_explanation}` | Explain how increased atmospheric CO₂ leads to higher surface temperature through intervening energy-balance steps. |
| **S61-B04** | `{process_walkthrough}` | Model the expert steps for interpreting a controlled experiment from identifying variables through to a bounded conclusion. |
| **S61-B05** | `{process_walkthrough}` | Walk through how an expert critically reads an empirical paper from abstract claim to evidence appraisal to limitations. |
| **S61-B06** | `{process_walkthrough}` | Teach the ordered workplace process for triaging a service outage from detection to verified resolution. |
| **S61-B07** | `{mental_model_building}` | Help learners build a working model of thermostat-controlled room heating and contrast mild versus extreme outdoor cold under limited heater capacity. |
| **S61-B08** | `{mental_model_building}` | Help learners assemble a durable model of a competitive market and contrast a demand shock with a supply shock under the same relationships and a clear capacity or governing constraint. |
| **S61-B09** | `∅` | Introduce key terms for enzymes and reaction rate; provide short, accurate definitions only, with no causal or process teaching. |
| **S61-B10** | `∅` | List observable completion criteria for the lesson; do not teach a mechanism, walkthrough, or system model. |

**Titles (workflow naming only — not archetype triggers):** see [PHASE-A-PROTOCOL.md](PHASE-A-PROTOCOL.md) §10.

---

## Run log fields (required per scored run)

| Field | Notes |
| ----- | ----- |
| benchmark ID | S61-B0n |
| run ID | e.g. `A-S61-B01-r1` |
| phase | A / B / C |
| harness | `partial-page` (required for scored) |
| sparse brief | copy or reference ID |
| expected_set | JSON set |
| actual_set | JSON set from capture |
| plan shape valid (all actual) | Y/N/NA |
| capture valid | Y/N |
| persisted | Y/N |
| expected routes | Priority-1 IDs for delivery check |
| delivered routes | from `__PRISM_FINAL_GAM_PROMPT` |
| `archetype_delivery.pass` | true/false/NA |
| result classification | one of ten codes (precedence applied) |
| artefact path | `artefacts/phase-a/<benchmark-id>/<run-id>/` |
| notes | free text |

---

## Phase A — baseline run table (30 rows)

*Add one row per scored run (3 per brief).*

| benchmark ID | run ID | expected_set | actual_set | capture valid | persisted | delivery.pass | classification | artefact path | notes |
| ------------ | ------ | ------------ | ---------- | ------------- | --------- | ------------- | -------------- | ------------- | ----- |
| S61-B01 | A-S61-B01-r1 | | | | | | | | |
| S61-B01 | A-S61-B01-r2 | | | | | | | | |
| S61-B01 | A-S61-B01-r3 | | | | | | | | |
| S61-B02 | A-S61-B02-r1 | | | | | | | | |
| S61-B02 | A-S61-B02-r2 | | | | | | | | |
| S61-B02 | A-S61-B02-r3 | | | | | | | | |
| S61-B03 | A-S61-B03-r1 | | | | | | | | |
| S61-B03 | A-S61-B03-r2 | | | | | | | | |
| S61-B03 | A-S61-B03-r3 | | | | | | | | |
| S61-B04 | A-S61-B04-r1 | | | | | | | | |
| S61-B04 | A-S61-B04-r2 | | | | | | | | |
| S61-B04 | A-S61-B04-r3 | | | | | | | | |
| S61-B05 | A-S61-B05-r1 | | | | | | | | |
| S61-B05 | A-S61-B05-r2 | | | | | | | | |
| S61-B05 | A-S61-B05-r3 | | | | | | | | |
| S61-B06 | A-S61-B06-r1 | | | | | | | | |
| S61-B06 | A-S61-B06-r2 | | | | | | | | |
| S61-B06 | A-S61-B06-r3 | | | | | | | | |
| S61-B07 | A-S61-B07-r1 | | | | | | | | |
| S61-B07 | A-S61-B07-r2 | | | | | | | | |
| S61-B07 | A-S61-B07-r3 | | | | | | | | |
| S61-B08 | A-S61-B08-r1 | | | | | | | | |
| S61-B08 | A-S61-B08-r2 | | | | | | | | |
| S61-B08 | A-S61-B08-r3 | | | | | | | | |
| S61-B09 | A-S61-B09-r1 | | | | | | | | |
| S61-B09 | A-S61-B09-r2 | | | | | | | | |
| S61-B09 | A-S61-B09-r3 | | | | | | | | |
| S61-B10 | A-S61-B10-r1 | | | | | | | | |
| S61-B10 | A-S61-B10-r2 | | | | | | | | |
| S61-B10 | A-S61-B10-r3 | | | | | | | | |

### Phase A — brief-level outcomes (10 rows)

| benchmark ID | r1 | r2 | r3 | brief outcome (majority) | bar contribution |
| ------------ | -- | -- | -- | ------------------------ | ---------------- |
| S61-B01 | | | | | positive brief |
| S61-B02 | | | | | positive brief |
| S61-B03 | | | | | positive brief |
| S61-B04 | | | | | positive brief |
| S61-B05 | | | | | positive brief |
| S61-B06 | | | | | positive brief |
| S61-B07 | | | | | positive brief |
| S61-B08 | | | | | positive brief |
| S61-B09 | | | | | false-positive gate |
| S61-B10 | | | | | false-positive gate |

### Phase A summary (fill after baseline)

**Run-level counts (diagnostic):**

| Metric | Count |
| ------ | ----- |
| CORRECT_SELECTION | |
| CORRECT_OMISSION | |
| UNDER_SELECTION | |
| WRONG_ARCHETYPE | |
| OVER_SELECTION | |
| FALSE_POSITIVE | |
| INVALID_PLAN | |
| PERSISTENCE_FAILURE | |
| DELIVERY_FAILURE | |
| INVALID_TEST | |

**Brief-level bar verdict:**

| Criterion | Result |
| --------- | ------ |
| B09/B10 all runs CORRECT_OMISSION | |
| Zero INVALID_PLAN runs | |
| Zero PERSISTENCE/DELIVERY failures | |
| ≥6/8 positive briefs CORRECT_SELECTION (brief-level) | |
| Each Priority-1 ID ≥1 brief-level CORRECT_SELECTION | |
| **Provisional bar met?** | Yes / No / Partial |

---

## Phase B — calibration rerun table

*Only if Phase B proceeds. Same brief wording. 3 runs per brief. Note guidance delta in decisions.md.*

---

## Phase C — holdout

*Briefs must **not** copy matrix wording. List holdout texts when defined.*

| holdout ID | expected | brief (new wording) | classification | notes |
| ---------- | -------- | ------------------- | -------------- | ----- |
| S61-H01 | | | | |

---

## Provisional acceptance bar

See [SPRINT-61-CHARTER.md](SPRINT-61-CHARTER.md) §10, [decisions.md](decisions.md) S61-D03 / S61-D10, [PHASE-A-PROTOCOL.md](PHASE-A-PROTOCOL.md) §9.
