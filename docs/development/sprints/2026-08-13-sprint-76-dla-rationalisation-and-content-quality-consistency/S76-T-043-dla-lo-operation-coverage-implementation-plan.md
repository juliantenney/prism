# S76-T-043 — DLA LO-operation coverage implementation plan

**Task:** S76-T-043  
**Status:** **Planning complete** (2026-08-14) — **no implementation authorised**  
**Mode:** IMPLEMENTATION PLANNING ONLY — no production code, prompt, schema, validator, test, fixture, EP, DLA, GAM, pack, or Settings changes  
**Depends on (accepted):** [T-032](S76-T-032-dla-a4-constructive-alignment-diagnostic.md) · [T-033](S76-T-033-dla-lo-operation-coverage-solution-design.md) (Option 3) · [T-036](S76-T-036-dla-p04-evidence-guidance-rationalisation-implementation.md) · [T-041](S76-T-041-dla-p01-r1-intermediate-operand-implementation.md) · [T-042](S76-T-042-dla-p01-r1-intermediate-operand-gate-c-closure.md)  
**Owning surface:** `lib/ld-dla-page-enrich-contract.js` commissioning-order **step 1** only

**IMPLEMENTATION PLAN ONLY**  
**NO IMPLEMENTATION AUTHORISED**

P01-R1 is **CLOSED**. Do not reopen Step 2. Do not implement T-031. Do not start P05.

---

## 0. Accepted T-032 / T-033 basis

T-032: historical Lagrangian A4 mapped LO required O1 (determine optimum) and O2 (verify constraint). DLA produced a feasibility-centred task. Perfect completion of that task need not demonstrate optimality. Earliest causal layer: **DLA learner production**, not EP, P01, P02, GAM, or materials richness.

T-033 Option 3: compact LO-operation coverage principle **plus** one-line perfect-completion counterfactual **in Step 1**. No PRE-EMIT. No new schema. No deterministic validator. No Lagrangian live wording. No domain example list.

---

## 1. Current live Step 1

Measured 2026-08-14 from `buildDlaPageEnrichContractBlock()` (`CONTRACT_VERSION` **`76-DLA-PARTIAL-7`**):

> 1) Define the learner production obligation (expected_output and learner_task intent).

**STEP 1 PRESERVED: YES**

T-036 kept this opening as the later T-033 surface. T-041 edited Step 2 only. P04 did not change Step 1 ownership or meaning.

No planning blocker.

---

## 2. Post-P04 fit

Live commissioning order:

| Step | Role | Later owner |
| ---- | ---- | ----------- |
| **1** | Learner production / mapped LO | **T-033 (this plan)** |
| **2** | Task operand selection | P01-R1 **CLOSED** — do not edit |
| **3** | Material purpose/specification | **T-031** — do not edit |
| **4** | Evidence role (P02) | Includes: “Correct evidence classification does not by itself make the production sufficient for the mapped LO.” |
| **5** | Provider authoring if true | Untouched |

**T-033 OWNING SURFACE: STEP 1 ONLY**

Must not leak into Steps 2–5, PRE-EMIT, audits, or DLA-WB.

---

## 3. Exact proposed Step 1 (candidate — not applied)

**Mechanical change:** keep the existing opening sentence. Append four compact sentences.

**Full candidate:**

> 1) Define the learner production obligation (expected_output and learner_task intent). Completing it must require every load-bearing operation needed to demonstrate the mapped LO. A supporting check must not substitute for the operation the mapped LO requires. If completed perfectly, would the work demonstrate every load-bearing mapped-LO operation? If not, redesign production before commissioning materials.

**Insert (325 unique characters, including the leading space):**

>  Completing it must require every load-bearing operation needed to demonstrate the mapped LO. A supporting check must not substitute for the operation the mapped LO requires. If completed perfectly, would the work demonstrate every load-bearing mapped-LO operation? If not, redesign production before commissioning materials.

Do **not** add a numbered step. Do **not** expand the canonical shape’s “tied to the LO” line into a second copy of this principle (T-033 §N: one core location).

Do **not** mention Lagrangian, Bloom, or a noun taxonomy.

---

## 4. Wording option comparison

| | Clarity | Unique cost | Robustness | Over-instruction | Historical A4 |
| - | ------- | ----------- | ---------- | ---------------- | ------------- |
| **A** Explicit “primary/supporting operation” labels + lists | High labels | **542** (over 400 ceiling) | High | High (verb lists) | Strong |
| **B** Compact supporting-check ≠ required operation + counterfactual | High enough | **325** | High | Low | Strong |
| **C** Coverage + counterfactual only | Medium | **257** | Weaker | Lowest | Weaker (A4 may still read as “I covered a mapped-LO operation”) |

**Recommend Option B.** Names the substitution failure without Bloom/primary-label machinery. Unique **325** is above T-033’s historical 150–280 band, **under the 400 ceiling**. The “If not, redesign…before commissioning materials” clause preserves LO → operation → materials order.

Do not ship Option A (exceeds ceiling). Do not ship Option C as primary (drops the substitution sentence T-033 treated as load-bearing).

---

## 5. Historical A4 conceptual test

If `learner_task` only verifies the original constraint:

Would the new counterfactual pass? **NO.**

Perfect feasibility verification does not demonstrate the mapped LO’s optimality operation. A supporting check would be substituting for the required operation.

**Target conceptual production (not live wording):** establish/determine optimality **and** verify the original constraint; `expected_output` makes both observable. Then commission particulars for **that** production (existing P01/P03).

---

## 6. Fresh Lagrangian shape (principle test only)

T-042 page: A1 / A2 / A3; compound LO mapping (e.g. A3 → LO1, LO4, LO5). Historical A4 numbering is **absent**.

The Step 1 principle remains valid: coverage is relative to **this activity’s mapped LO(s)**, not historical activity ids. If a mapped LO still names both optimality and constraint verification, production must require both. Fresh grouping does not require a different owning surface.

Do not redesign the page from this plan. Do not run generation.

---

## 7. Roman Roads non-regression

**Principle:** semantic coverage, not structural proliferation.

The new wording must **not** be read as:

- one activity per LO verb;
- one task per operation;
- mandatory multiple `expected_output`s;
- extra materials merely because an LO contains multiple concepts.

If perfect completion of **one** production already demonstrates every load-bearing mapped-LO operation, **do not split**.

Prompt tests should `doesNotMatch` forced-split language. Gate C (later) uses Roman Roads to confirm already-coherent activities are not decomposed.

---

## 8. P02 / evidence boundary

Step 4 already: “Correct evidence classification does not by itself make the production sufficient for the mapped LO.”

| | Question |
| - | -------- |
| **T-033 / Step 1** | Does the learner **production** demonstrate the mapped LO? |
| **P02 / Step 4** | Do supplied particulars function as **grounds** for the learner conclusion? |

T-033 **complements** P04; it does not duplicate evidence-role guidance. Do **not** add P02 wording to Step 1.

---

## 9. T-031 boundary

```text
LO → learner operation (T-033, Step 1)
  → task/material need (P01, Step 2 — CLOSED)
  → commission/specification (P03, Step 3 — T-031 later)
  → operationally suitable fulfilment (T-031 / GAM)
```

Step 1 must **not** mention solvability, method-X compatibility, operand correctness, generated particulars, or GAM fulfilment.

**Step 3 remains verbatim** (T-031 surface).

---

## 10. EP / GAM

**EP CHANGE: NO**  
**GAM CHANGE: NO**

Do not touch: `lib/episode-plan-population-contract.js`, `lib/episode-plan-v1-*.js`, `lib/page-gam-enrich.js`, `lib/ld-gam-page-enrich-contract.js`.

---

## 11. Schema / validator

**SCHEMA CHANGE: NO**  
**DETERMINISTIC VALIDATOR CHANGE: NO**

Do not touch: `lib/page-dla-enrich.js` (validators / capture), schema_version `2.0.0`, shape JSON fields.

No Bloom maps, keyword matching, LO/task similarity, `learner_task` regexes, mandatory task counts, or subject-specific checkers.

---

## 12. Prompt cost

Measured **now** (T-041 basis):

| Series | Current |
| ------ | ------: |
| Contract block | 11,539 |
| Shape snippet | 6,698 |
| **A unique** | **18,237** |
| **B assembled ×2** | **36,474** |

| Candidate (Option B insert) | Unique | Assembled ×2 |
| --------------------------- | -----: | -----------: |
| Insert | **325** | **650** |
| Unique after (est.) | **18,562** | **37,124** |
| T-033 historical target | 150–280 | 300–560 |
| **This plan ceiling** | **400** | **800** |

**Within ceiling.** Do not count P05. If live edit exceeds 400 unique, tighten before shipping; cut examples (none planned), not the counterfactual.

**Implementation note:** `tests/ld-dla-evidence-decision-consistency-prompt.test.js` currently asserts unique `< 18500`. After +325 that band **must be raised** (e.g. `< 19000`) — a test-bound update, not a production expansion.

---

## 13. Contract version / cache pin

**BUMP.**

| Item | Current | Proposed |
| ---- | ------- | -------- |
| `CONTRACT_VERSION` | `76-DLA-PARTIAL-7` | **`76-DLA-PARTIAL-8`** |
| `schema_version` | `2.0.0` | unchanged |
| `index.html` contract pin | `lib/ld-dla-page-enrich-contract.js?v=20260814-s76-dla-p01-r1-intermediate` | e.g. **`?v=20260814-s76-dla-t033-lo-coverage`** |
| `page-dla-enrich.js` pin | `?v=20260813-s76-dla-p01-p02-p03` | **DO NOT TOUCH** |

---

## 14. Test plan

Update `tests/ld-dla-evidence-decision-consistency-prompt.test.js` and version pin in `tests/ld-instructional-archetype-production-planning.test.js`.

**Presence** (`buildDlaPageEnrichContractBlock()`):

- opening `/1\) Define the learner production obligation \(expected_output and learner_task intent\)\./` **retained**
- `/every load-bearing operation needed to demonstrate the mapped LO/`
- `/supporting check must not substitute/`
- `/If completed perfectly, would the work demonstrate every load-bearing mapped-LO operation/`
- `/redesign production before commissioning materials/`
- retain T-041 Step 2: `/already-formed object or state/` · `/P01 and P02 remain independent/`
- retain Step 3: `/specification must not be only the material_type token/`
- `CONTRACT_VERSION === "76-DLA-PARTIAL-8"`

**Absence:**

- `/Bloom/` · `/Lagrangian/` in the **contract block**
- `/FINAL PRE-EMIT AUDIT/` · `/FINAL PER-ACTIVITY EVIDENCE-DECISION CONSISTENCY AUDIT/`
- no new numbered `6)` commissioning step
- unique size band updated (not left at 18500)

Substring assertions only. No whole-prompt snapshot. No semantic validator from `learner_task` prose.

Keep `tests/s76-dla-p01-p02-p03-contract.test.js` and P02 false-positive suites **unchanged** (validators untouched).

---

## 15. Expected implementation files

| Path | Change |
| ---- | ------ |
| `lib/ld-dla-page-enrich-contract.js` | Step 1 append + `76-DLA-PARTIAL-8` |
| `index.html` | Contract cache pin only |
| `tests/ld-dla-evidence-decision-consistency-prompt.test.js` | Presence/absence + version + unique upper bound |
| `tests/ld-instructional-archetype-production-planning.test.js` | Version pin |
| Sprint 76 implementation record + pointers | After live implementation |

**Do not touch:** `lib/page-dla-enrich.js`, `lib/page-gam-enrich.js`, `lib/ld-gam-page-enrich-contract.js`, EP contracts, DLA-WB, `app.js` injection logic, Step 2, Step 3.

---

## 16. Gates

### GATE A — semantic shape

Step 1 contains coverage + supporting-check + counterfactual + redesign-before-commission; Steps 2/3 preserved; no audit stack; targeted prompt tests pass.

**Stop if:** Steps 2/3 rewritten; Lagrangian/Bloom added; validators edited.

### GATE B — regression / size

P01/P02/P03 suites pass; T-041 substrings intact; no schema/validator/GAM/EP/pack diffs; unique delta **≤400**; Copy still **exactly 2** contract and **2** shape call sites; P05 untouched.

### GATE C — operator generation (later)

Not this task. Roman Roads + Lagrangian (or a narrower justified pair). Question: does DLA require all load-bearing mapped-LO operations **without** over-decomposing already-coherent activities? A higher-order judgement must not collapse into only its supporting check.

---

## 17. Implementation sequence

1. Record before-size (expect unique **18,237**).  
2. Edit **Step 1 only**.  
3. Bump `CONTRACT_VERSION` to `76-DLA-PARTIAL-8`; bump contract cache pin.  
4. Update prompt tests (§14).  
5. Gate A targeted tests.  
6. Gate B suites (`s76-dla-p01-p02-p03-contract`, procedural/S75 P02, `page-dla-enrich` dual-injection).  
7. Measure after unique / ×2.  
8. Write implementation record. **Stop before generation.**

Do **not** combine T-031.

---

## 18. Stop conditions

- Unique add >400 without stopping to tighten.  
- Any DLA-WB / validator / GAM / EP / schema edit.  
- Step 2 or Step 3 rewrite.  
- New PRE-EMIT / audit block.  
- Starting Gate C, P05, or T-031 from this change-set.

**No blocker found.** Step 1 remains a clean owning surface. Recommend implementation when authorised.

---

**T-033 LO-OPERATION COVERAGE IMPLEMENTATION PLAN READY FOR OPERATOR REVIEW**

*End of S76-T-043. No implementation authorised.*
