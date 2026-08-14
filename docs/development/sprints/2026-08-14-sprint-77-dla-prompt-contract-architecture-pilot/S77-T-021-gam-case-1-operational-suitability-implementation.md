# S77-T-021 — GAM Case 1 operational suitability implementation

**Status:** **Gate A/B/C PASS** (2026-08-14) — **Case 1 CLOSED** — bound Gate C: [T-024](S77-T-024-gam-e1-and-case-1-bound-gate-c.md)  
**Mode:** T-020 Option 1 implemented A/B; Gate C recorded after T-023 bind  
**Depends on:** [T-019](S77-T-019-gam-e-learner-facing-corruption-diagnostic.md) · [T-020](S77-T-020-gam-case-1-operational-suitability-solution-design.md) · Sprint 76 T-031 / T-047 · [T-023](S77-T-023-gam-e1-authoritative-dla-commission-binding-implementation.md)  

**Out of scope (not started):** Gate C generation · E1 · E2 · GAM D · DLA · EP · schema · validators · T-031 redesign

This artefact records what was implemented. Gate A/B remain **PASS**. Gate C **does not fail or pass** T-021 semantically. Case 1 stays **OPEN**.

---

## 1. Exact old wording

> Honour required_materials[].purpose and treat specification as binding content bounds. Realised particulars must support the commissioned learner operation within those bounds; do not substitute a different method or extra unstated reasoning; do not invent pedagogical constraints the commission omits.

**302** characters.

---

## 2. Exact new wording

> Honour required_materials[].purpose and treat specification as binding content bounds. Realised particulars must support the commissioned learner operation within those bounds; they must provide enough coherent information for that operation to be carried out; when that operation requires identifying or solving for a result, do not emit contradictory or underdetermined particulars for that requested result; do not substitute a different method or extra unstated reasoning; do not invent pedagogical constraints the commission omits.

**536** characters.

Inserted gloss (same sentence, same Copy-brief line, no new heading/block):

> they must provide enough coherent information for that operation to be carried out; when that operation requires identifying or solving for a result, do not emit contradictory or underdetermined particulars for that requested result;

Underdetermination is scoped to **this** operation when it requires identifying/solving a result — not uniqueness for every material, not later activities, not invented pedagogical constraints.

---

## 3. Prompt character delta

| Item | Length |
| ---- | -----: |
| Old binding sentence | 302 |
| New binding sentence | 536 |
| **Δ** | **+234** |

One existing GAM binding surface only (`buildGamV2CopyMaterialAuthoringBrief`). No second authority.

---

## 4. Production files changed

| Path | Change |
| ---- | ------ |
| `app.js` | Copy-brief T-031 sentence only |
| `index.html` | `app.js` pin `?v=20260814-s77-t021-gam-case1` |

**Not changed:** `lib/ld-dla-page-enrich-contract.js` · `lib/ld-gam-page-enrich-contract.js` · `lib/page-gam-enrich.js` · `lib/page-dla-enrich.js` · EP · DLA-WB · schemas · validators.

---

## 5. Tests changed

`tests/page-gam-enrich.test.js` — existing “GAM v2 copy brief enforces canonical hydrated material rows” now also asserts:

1. enough coherent information for that operation;
2. contradictory/underdetermined protection when identifying/solving for a result;
3. wrong-method / extra-reasoning clause retained;
4. do-not-invent pedagogical constraints retained;

and `doesNotMatch` global “must be solvable”, “every material must have a unique solution”, “later activit”.

No semantic solvability validator.

---

## 6. Gate A — PASS

| Check | Result |
| ----- | ------ |
| Exactly one existing GAM binding surface amended | **YES** |
| Wording model-visible on Copy brief | **YES** |
| No new authority/block/heading/checklist | **YES** |
| Existing T-031 semantics preserved | **YES** |
| Anti-over-specification preserved | **YES** (underdetermined clause gated on identify/solve) |
| DLA / schema / validator / EP | **unchanged** |
| E1 / E2 / GAM D | **unchanged** |
| Prompt delta tightly bounded | **+234** on one sentence |

---

## 7. Gate B — PASS

`node --test` on:

- `tests/page-gam-enrich.test.js`
- `tests/ld-instructional-archetype-gam-copy-delivery.test.js`
- `tests/ld-instructional-archetype-gam-copy-context.test.js`
- `tests/ld-gam-instructional-depth.test.js`
- `tests/ld-instructional-archetype-assembled-gam-prompt.test.js`
- `tests/ld-instructional-archetype-delivery-observability.test.js`
- `tests/ld-instructional-archetype-mixed-acceptance.test.js`

**80 pass, 0 fail.**

No regression to GAM D/E prompt surfaces (archetype routing, depth, partial-mode omission, evidence capture validators unchanged).

---

## 8–14. Explicit report

| # | Item | Result |
| - | ---- | ------ |
| 8 | DLA changed | **NO** |
| 9 | Schema changed | **NO** |
| 10 | Validator changed | **NO** |
| 11 | E1 changed | **NO** |
| 12 | E2 changed | **NO** |
| 13 | GAM D changed | **NO** |
| 14 | Anti-over-specification preserved | **YES** |

---

## 15. Gate C — first run (operator, 2026-08-14) — **superseded**

**Status at the time: INCONCLUSIVE / BLOCKED BY E1.** That run is **not** the closing inspection. Closing Gate C: [T-024](S77-T-024-gam-e1-and-case-1-bound-gate-c.md) (**PASS · CASE 1 CLOSED**).

The fresh GAM response on the **pre-bind** run did **not** reliably fulfil the supplied fresh DLA commission, so that run could not establish whether the T-021 executability clarification fixed the demonstrated Case-1 underdetermination failure.

Operator evidence from **that** run (authoritative historical exhibit; not re-analysed):

| DLA | GAM |
| --- | --- |
| A1–**A4** only | Emits A1–**A5** |
| A1-M1 `scenario_set` — four short scenarios, each with explicit objective and single binding constraint | A1-M1 `text` — explanatory prose, not four scenarios |
| A2-M1 `problem_set` — three constrained optimisation problems; objective + equality constraint; do not provide completed Lagrangians | A2-M1 `text` — “Structure of a Lagrangian” prose, not the problem set |
| A3-M1 `equation_set` — three Lagrangian functions for differentiation practice | A3-M1 `text` — explanatory prose about generating FOCs, not the equation set |
| `required_materials` as commissioned | Additional **checklist** materials not in the DLA commission |

**Do not use this pre-bind run** to fail or pass T-021. Case 1 is **CLOSED** on the later bound inspection ([T-024](S77-T-024-gam-e1-and-case-1-bound-gate-c.md)).

The executability rule could not be behaviourally tested until GAM was authoritatively bound to the DLA commission under test. That was **E1** ([T-023](S77-T-023-gam-e1-authoritative-dla-commission-binding-implementation.md)).

---

## 16. Bound Gate C (operator, 2026-08-14, post–T-023)

**Status: PASS. CASE 1 CLOSED.** Full record: [T-024](S77-T-024-gam-e1-and-case-1-bound-gate-c.md).

Critical A4 commission: solve the supplied FOC system, determine optimal variable values, and verify against the original constraint. Fresh GAM A4-M1 supplied an independent three-equation system, derived `x = y = 5`, and verified `5 + 5 = 10`. Enough coherent independent information; no contradiction; no underdetermination; no extra unstated reasoning or invented pedagogical constraint.

Does **not** close GAM D or E2. Does **not** reopen DLA T-031.

---

## 17. Next action

**S77-T-025** — GAM D diagnostic (defined; not started). E1 is closed ([T-023](S77-T-023-gam-e1-authoritative-dla-commission-binding-implementation.md) / T-024).

---

## Verdict

**T-021 GATE A/B/C PASS — CASE 1 CLOSED** (bound inspection [T-024](S77-T-024-gam-e1-and-case-1-bound-gate-c.md); earlier E1-blocked run remains historical only)
