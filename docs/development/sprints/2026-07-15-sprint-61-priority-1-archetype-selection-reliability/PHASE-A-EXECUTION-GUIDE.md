# Sprint 61 — Phase A Execution Guide

**One-page ops sheet.** Details: [PHASE-A-PROTOCOL.md](PHASE-A-PROTOCOL.md) · Checklist: [OPERATOR-CHECKLIST.md](OPERATOR-CHECKLIST.md)

---

## Scope

- **30 scored runs** · partial-page only · frozen briefs · no product/prompt/wording changes  
- Goal: spontaneous Priority-1 selection measurement (not teaching-quality scoring)

---

## Run order

1. **S61-B09** (r1–r3) → **S61-B10** (r1–r3) — false-positive gates  
2. **S61-B01**, **S61-B04**, **S61-B07** — one brief per Priority-1 type  
3. **S61-B02**, **S61-B03**, **S61-B05**, **S61-B06**, **S61-B08**

Complete **all three** replications for a brief before changing order early (except aborting an `INVALID_TEST` and repeating the *same* run ID only if conditions were broken — otherwise use a fresh scored attempt under a documented note; prefer keep run ID and mark `INVALID_TEST`).

---

## Replication

| Rule | Value |
| ---- | ----- |
| Per brief | 3 scored runs |
| Total | 30 |
| Reliability | Brief-level majority (≥2/3); one success ≠ evidence |
| Smoke | Optional; `_smoke/` only; out of bar |

---

## Classification workflow (per run)

1. Verify no-trigger + harness (else `INVALID_TEST`).  
2. Validate capture → if Priority-1 present but bad plan → `INVALID_PLAN`.  
3. Check persist → `PERSISTENCE_FAILURE` if lost.  
4. If `actual_set` non-empty + valid: delivery → `DELIVERY_FAILURE` if pass false.  
5. Else set compare: `FALSE_POSITIVE` / `OVER_SELECTION` / `WRONG_ARCHETYPE` / `UNDER_SELECTION` / `CORRECT_*`.  
6. **First matching** code in precedence order wins ([PHASE-A-PROTOCOL.md](PHASE-A-PROTOCOL.md) §7).  
7. Save artefacts + update matrix ([BENCHMARK-LOGGING.md](BENCHMARK-LOGGING.md)).

---

## Escalation (ambiguous run)

| Situation | Action |
| --------- | ------ |
| Two codes seem to apply | Apply precedence; do not invent hybrid codes |
| Still unclear | Mark ambiguous; leave evidence; second-reader adjudication from artefacts |
| Conditions violated mid-run | `INVALID_TEST`; fix hygiene; new clean run if needed |
| Missing mandatory files | `INVALID_TEST` — do not soft-grade |
| Urge to “fix the prompt” | **Stop** — Phase A forbids guidance changes |

Do not reopen Sprint 58/59/60 work or switch to enrich-in-place for scored runs.

---

## End of Phase A

1. 30 rows filled · 10 brief outcomes · run-level counts · brief-level bar verdict.  
2. Record baseline decision in [decisions.md](decisions.md).  
3. Only then consider Phase B calibration.
