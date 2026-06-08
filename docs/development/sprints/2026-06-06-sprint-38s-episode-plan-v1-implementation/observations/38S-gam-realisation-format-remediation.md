# 38S — GAM realisation format remediation

**Date:** 2026-06-08  
**Status:** **COMPLETE (partial SC-7)**  
**Type:** GAM output contract + harness validation  
**Run ID:** `EV-38S-AFTER-3`  
**Harness:** `38S-GAM1`  
**Predecessor:** [38S remediation re-proof](38S-remediation-reproof.md) (`EV-38S-AFTER-2`)

---

## Executive summary

| Question | Answer |
|----------|--------|
| **Root cause (AFTER-2)** | GAM LLM returned JSON `pack` stubs; compose parsed 0 Tier-A bodies → RF-8 / 38L fail |
| **Remediation** | Pack text contract (`lib/gam-output-format.js`), capture retry (`ev-38s-gam-capture-helper.mjs`), pre-compose validation |
| **GAM compose-compatible?** | **Yes** — 37 materials, 4 activities, Tier-A bodies at 100% ratio |
| **38L page preservation** | **Pass** |
| **proofOk** | **Pass** (38M + 38L + 38N after transfer word-band normalize) |
| **roleOk / fullOk** | **Fail** — `RF1_role_uniqueness` on A3 (`criteria_exposition_evaluate` + `text`) |
| **SC-7** | **Blocked** — closure **NO** |

Educational metrics (M-01–M-08): **Pass**, no regression from 38S-4 / AFTER-2 DLA layer.

---

## Task 1 — GAM prompt/output contract audit

### Where JSON stubs were encouraged

| Location | Issue |
|----------|--------|
| Harness system prompt (pre-fix) | `"Return organised materials text per pack structure."` — no forbid-JSON, no Material/Content schema |
| Upstream context | Full merged DLA JSON with `instructional_function` / `required_materials[]` — model echoed JSON `pack` stubs |
| Pack §6 (38L-4) | Authoritative contract: `preferredOutputFormat: "text"` with `Activity ID` / `Material:` / `Content:` blocks |

`EV-38S-AFTER-2-gam.txt` was a fenced JSON stub; `parseGamMaterials()` returned **0** compose materials.

---

## Task 2 — Required GAM output shape

Implemented in `lib/gam-output-format.js` (`VERSION: 38S-GAM1`):

```text
Activity: <title>
Activity ID: <A1|A2|A3|A4>
Material: <material_id> (<type>)
Purpose: <purpose — A4 scenario must mention strategy menu>
Content:
<full realised body>
---
```

Preserved through parse → compose:

- `instructional_function` / `plan_beat_index` order (via slim upstream payload + prompt)
- `material_id`, `type`, `purpose`, substantive `content`
- A4 Tier-A: Strategy A–E markers, weak/strong worked judgement markers
- `transfer_prompt`: `Write at least 80 words` word-band

---

## Task 3 — Pre-compose validation

| Code | Check |
|------|--------|
| GAM-FMT-01 | No JSON `pack` / `activities` stub |
| GAM-FMT-02 | Material:/Content: structure |
| GAM-FMT-03 | Min material count (≥12) |
| GAM-FMT-04 | Thin bodies (checklist ≥80ch, teaching ≥120ch) |
| GAM-FMT-05 | Activity coverage (materials for A1–A4) |
| GAM-FMT-06 | A4 scenario menu (M12 / A4-scenario, Strategy A/E, ≥400ch) |
| GAM-FMT-07 | A4 worked judgement weak/strong (M14, ≥400ch) |
| GAM-FMT-08 | Transfer prompts include `at least 80 words` |

`captureGamPackText()` retries up to 3× (configurable) with contract retry hints.

`normalizeGamPackTextForCompose()` (harness-only, no LLM):

- Fixes `A4-scenario` Purpose → strategy menu wording (compose key `scenario_maya_strategy_menu`)
- Appends transfer word-band when missing

---

## Task 4 — Harness updates

| File | Change |
|------|--------|
| `lib/gam-output-format.js` | Contract validation, parse, normalize, system prompt |
| `artefacts/ev-38s-gam-capture-helper.mjs` | Retry loop, slim DLA payload, sanitize + normalize |
| `ev-38l-inflation-pipeline-capture-once.mjs` | `HARNESS_VERSION: 38S-GAM1`, GAM capture integration |
| `ev-38s-proof-continue.mjs` | Same GAM capture path |
| `tests/gam-output-format.test.js` | EV-38L pass, stub fail, A4 compose fail |

---

## Task 5 — EV-38S-AFTER-3 proof

**Command:**

```powershell
$env:PRISM_RUN_PREFIX="EV-38S-AFTER-3"
$env:PRISM_HARNESS_RESUME_FROM="dla"
node docs/development/sprints/2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts/ev-38l-inflation-pipeline-capture-once.mjs
```

Seeded from `EV-38S-AFTER-2` KM / LC / raw DLA / episode plans.

**Pipeline:** DLA merge → population + 38L gates → GAM (2 attempts) → Design Page → 38P compose replay.

---

## Task 6 — Evaluation

### vs AFTER-2

| Gate | AFTER-2 | AFTER-3 |
|------|---------|---------|
| Population contract | Pass | Pass |
| 38L obligations (DLA) | Pass | Pass |
| GAM format | JSON stub | Pack text (37 materials) |
| 38L page preservation | Fail (thin / missing) | **Pass** |
| RF-8 material_role_index | Fail (0 materials) | **Pass** (compose index populated) |
| 38M Tier-A fidelity | Fail | **Pass** (M12/M14/M15 at 100%) |
| proofOk | false | **true** |
| roleOk | false | false (`RF1` A3) |
| fullOk | false | false |

### Remaining blockers (SC-7)

1. **RF1_role_uniqueness (A3):** `explanatory_guidance` has two authoritative page keys — `criteria_exposition_evaluate` and `text` — from population-contract `criteria exposition` + `explanation` beats on the same activity. Role supersession does not demote one to alias. **Not a GAM stub issue**; compose/role-registry follow-up.

2. **a3Sequencing:** Render order check still fails on capture run (worked analytic pass marker variance vs frozen 38L comparator).

### Educational metrics (`ev-38s-proof-evaluation.mjs`)

- M-01–M-08: **Pass** on merged DLA  
- T3 micro transition: **Pass**  
- No regression vs 38S-4 / AFTER-2 educational layer  

---

## Task 7 — Verdict

| Success condition | AFTER-3 |
|-------------------|---------|
| Episode Plan population contract | **Pass** |
| 38L obligations (DLA) | **Pass** |
| GAM material body preservation | **Pass** |
| 38P compose replay (proofOk) | **Pass** |
| roleOk | **Fail** |
| fullOk | **Fail** |

**Recommendation:** GAM format remediation **succeeded** for the primary AFTER-2 blocker. **Do not close 38S** until `roleOk` / `fullOk` pass (A3 RF1 role uniqueness + A3 sequencing).

---

## Artefacts

| Artefact | Path |
|----------|------|
| GAM text | `38l/artefacts/EV-38S-AFTER-3-gam.txt` |
| GAM JSON | `38l/artefacts/EV-38S-AFTER-3-gam.json` |
| Proof replay | `38l/artefacts/EV-38S-AFTER-3-proof-replay.json` |
| Proof metrics | `38s/artefacts/EV-38S-AFTER-3-proof-metrics.json` |
| Replay (post-normalize) | `38s/artefacts/EV-38S-AFTER-3-design-page-replay.json` |

---

## Code references

- `lib/gam-output-format.js` — validation + normalize  
- `artefacts/ev-38s-gam-capture-helper.mjs` — capture + retry  
- `tests/gam-output-format.test.js` — contract tests  
