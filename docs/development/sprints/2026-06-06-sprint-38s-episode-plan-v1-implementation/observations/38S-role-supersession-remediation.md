# 38S — RF1 role supersession remediation

**Date:** 2026-06-08  
**Status:** **COMPLETE — SC-7 unblocked**  
**Type:** Compose role-key resolution (A3 RF1)  
**Run ID:** `EV-38S-AFTER-4`  
**Harness:** `38S-GAM1` + `buildMaterialRoleIndex` fix  
**Predecessor:** [38S GAM format remediation](38S-gam-realisation-format-remediation.md) (`EV-38S-AFTER-3`)

---

## Executive summary

| Question | Answer |
|----------|--------|
| **RF1 failure (AFTER-3)** | A3 `explanatory_guidance` had two canonical GAM entries: `criteria_exposition_evaluate` + `text` |
| **Root cause** | (1) `pageFieldKeyForMaterial` mapped `criteria exposition` to `concept_exposition` before `criteria`; (2) `buildMaterialRoleIndex` stamped every GAM material as CANONICAL without demoting prior family winner |
| **Fix** | Criteria-before-exposition page-key order + precedence-based single canonical per role family |
| **EV-38S-AFTER-4** | **proofOk / roleOk / fullOk: true** · RF1 + RF8 pass · 38L + 38M pass |
| **Educational metrics** | M-01–M-08 **Pass** (no regression) |
| **SC-7** | **Unblocked** — closure evaluation may proceed |

---

## Task 1 — Artefact inspection (AFTER-3)

A3 replay page (`EV-38S-AFTER-3-design-page-replay.json`):

| Page key | Body length | Index authority |
|----------|------------:|-----------------|
| `concept_exposition` | 1202 | superseded → `text` |
| `text` | 1029 | **canonical** (gam) |
| `criteria_exposition_evaluate` | 0 | **canonical** (gam) — orphan index key |

RF1 error: `explanatory_guidance has 2 authoritative entries: criteria_exposition_evaluate, text`

---

## Task 2 — Source trace

| Layer | M_plan_4 (`criteria exposition`) | M_plan_5_2 (`explanation`) |
|-------|-----------------------------------|----------------------------|
| DLA obligation | `instructional_function: criteria_exposition` | `instructional_function: explanation` |
| GAM body | Present (text type) | Present (text type) |
| `resolveRoleFromGam` | `explanatory_guidance` → `criteria_exposition_evaluate` | `explanatory_guidance` → `text` |
| `pageFieldKeyForMaterial` (before fix) | `concept_exposition` — **bug:** `/exposition/` matched before `/criteria/` | `text` |
| `buildMaterialRoleIndex` (before fix) | Index entry at `criteria_exposition_evaluate`, CANONICAL | Index entry at `text`, CANONICAL — **no demotion** |

Renderer fallback was not the cause; compose role index construction was.

---

## Task 3 — Resolution design

**Decision:** Beat-aligned criteria exposition is the authoritative `explanatory_guidance` canonical for Analyse A3; generic explanation text becomes non-canonical (ALIAS / SUPERSEDED) but **remains renderable** with body preserved.

**Precedence order** (`explanatory_guidance`):

1. `criteria_exposition_evaluate`
2. `concept_exposition`
3. `concept_text`
4. `criteria_text`
5. `text`

Higher-precedence GAM material wins canonical; lower-precedence siblings demoted.

---

## Task 4 — Implementation

**File:** `lib/page-gam-materials-preserve.js`

1. **`pageFieldKeyForMaterial`** — test `/criteria/` before `/exposition/` so page keys align with role registry.
2. **`buildMaterialRoleIndex`** — use `pageFieldKeyForMaterial(mat)` as index key; apply `canonicalPrecedenceRank` when multiple GAM materials map to the same role family; demote prior canonical via `demoteGamCanonicalEntries`.

No V1, Episode Plan, DLA, or GAM prompt changes.

---

## Task 5 — Regression test

`tests/page-38p-role-supersession.test.js` — **38S-RF1 A3 criteria exposition + explanation**:

- Exactly one canonical `explanatory_guidance` entry
- Canonical key = `criteria_exposition_evaluate`
- `text` non-canonical, superseded_by `criteria_exposition_evaluate`
- Both bodies preserved on page

---

## Task 6 — EV-38S-AFTER-4 replay

Seeded from AFTER-3 GAM + design-page + DLA (compose fix is deterministic — no new LLM calls).

```powershell
$env:PRISM_RUN_PREFIX="EV-38S-AFTER-4"
node docs/development/sprints/2026-06-06-sprint-38s-episode-plan-v1-implementation/artefacts/ev-38s-proof-replay.mjs
```

---

## Task 7 — Evaluation

| Gate | AFTER-3 | AFTER-4 |
|------|---------|---------|
| Population contract | Pass | Pass |
| 38L DLA | Pass | Pass |
| 38L page preservation | Pass | Pass |
| 38M body fidelity | Fail (transfer word-band) | **Pass** |
| RF1_role_uniqueness | **Fail** (A3) | **Pass** |
| RF8_compose_transparency | Pass | **Pass** |
| proofOk | true | **true** |
| roleOk | false | **true** |
| fullOk | false | **true** |
| M-01–M-08 | Pass | Pass |

---

## Task 8 — Verdict

**SC-7 success condition met on `EV-38S-AFTER-4`:**

- proofOk ✓ · roleOk ✓ · fullOk ✓ · RF1 ✓ · RF8 ✓ · educational metrics ✓

Sprint closure (38S-6) may proceed per charter — subject to programme sign-off.

---

## Artefacts

| Artefact | Path |
|----------|------|
| Replay log | `38s/artefacts/EV-38S-AFTER-4-run-log.json` |
| Design page (replayed) | `38s/artefacts/EV-38S-AFTER-4-design-page-replay.json` |
| Proof metrics | `38s/artefacts/EV-38S-AFTER-4-proof-metrics.json` |
| GAM / DLA | `38l/artefacts/EV-38S-AFTER-4-*` |
