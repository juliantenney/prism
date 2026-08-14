# S76-T-041 — DLA-P01-R1 intermediate-operand salience implementation

**Task:** S76-T-041  
**Status:** **Gate A + Gate B complete** (2026-08-14) — ready for operator Gate C  
**Mode:** Authorised T-040 Option 2 implementation through Gate A + Gate B only  
**Depends on:** [T-039](S76-T-039-dla-p01-r1-intermediate-operand-solution-design.md) · [T-040](S76-T-040-dla-p01-r1-intermediate-operand-implementation-plan.md)

**Out of scope (not started):** Gate C (Lagrangian / Roman Roads) · P05 · T-031 / T-033 live wording · validators · schemas · GAM · EP · DLA-WB · Settings

This artefact records what was implemented. It does **not** authorise generation. It does **not** claim RECOVER.

---

## 1. Files changed

| Path | Change |
| ---- | ------ |
| `lib/ld-dla-page-enrich-contract.js` | Step 2 insert; `CONTRACT_VERSION` → `76-DLA-PARTIAL-7` |
| `index.html` | DLA **contract** cache pin only |
| `tests/ld-dla-evidence-decision-consistency-prompt.test.js` | Presence/absence + version |
| `tests/ld-instructional-archetype-production-planning.test.js` | Version pin `76-DLA-PARTIAL-7` |

**Not changed:** `lib/page-dla-enrich.js` · `lib/page-gam-enrich.js` · `lib/ld-gam-page-enrich-contract.js` · EP contracts · `app.js` injection logic · schemas · validators · DLA-WB pack · T-031 / T-033 designs · `index.html` `page-dla-enrich.js` pin.

---

## 2. Exact Step 2 insert

Inserted after `scaffold = prompts, supports or checks.` and before `Used during the activity ≠ automatically a task input.`:

> An operand may also be an already-formed object or state this activity’s operation acts on when the system must supply it. Recording work in a workspace does not make the workspace the operand. The learner’s own prior-activity product is not a new GAM commission.

Surrounding Step 2 wording was not rewritten. Absence test, role list, and `P01 and P02 remain independent` are unchanged. Steps 1 and 3 openings are unchanged.

---

## 3. Contract version / cache pin

| Item | Value |
| ---- | ----- |
| `CONTRACT_VERSION` | **`76-DLA-PARTIAL-7`** |
| `schema_version` | `2.0.0` (unchanged) |
| Contract pin | `lib/ld-dla-page-enrich-contract.js?v=20260814-s76-dla-p01-r1-intermediate` |
| Validator pin | `lib/page-dla-enrich.js?v=20260813-s76-dla-p01-p02-p03` (**unchanged**) |

---

## 4. Size

Unique A = `buildDlaPageEnrichContractBlock().length` + `buildCanonicalDlaPageShapeSnippet().length`. Assembled B = 2 × A.

| Series | Before | After | Δ |
| ------ | -----: | ----: | --: |
| Contract block | 11,275 | 11,539 | +264 |
| Shape snippet | 6,698 | 6,698 | 0 |
| **A unique** | **17,973** | **18,237** | **+264** |
| **B assembled ×2** | **35,946** | **36,474** | **+528** |

T-040 target ~180–280 unique; ceiling 400 unique. **Within target.** P05 savings not counted.

---

## 5. Gate A — PASS

Prompt tests assert: already-formed object/state; this activity’s operation; system must supply; workspace ≠ operand; prior-activity product ≠ new GAM commission; P01/P02 independent; absence test intact; Steps 1/3 openings intact; no Lagrangian live wording; no PRE-EMIT / per-activity evidence audit; no second `"activity_id": "A2"` in the canonical shape; version `76-DLA-PARTIAL-7`.

---

## 6. Gate B — PASS

- Unique delta **+264** (≤400).  
- Copy still **exactly 2** `buildDlaPageEnrichContractBlock()` and **2** `buildCanonicalDlaPageShapeSnippet()` call sites in `app.js`.  
- No schema / validator / GAM / DLA-WB diffs.  
- P05 untouched. T-031 / T-033 untouched.

---

## 7. Tests run

| Suite | Result |
| ----- | ------ |
| `tests/ld-dla-evidence-decision-consistency-prompt.test.js` | **pass** |
| `tests/ld-instructional-archetype-production-planning.test.js` | **pass** |
| `tests/s76-dla-p01-p02-p03-contract.test.js` | **pass** |
| `tests/s76-dla-procedural-task-evidence-validation.test.js` | **pass** |
| `tests/s75-dla-evidence-decision-false-positive.test.js` | **pass** |
| `tests/page-dla-enrich.test.js` (incl. dual-injection) | **pass** |
| Sprint 72 DLA contract substring tests (`--test-name-pattern "S72: DLA"`) | **pass** |

---

## 8. Confirmations

| Item | Result |
| ---- | ------ |
| Absence test unchanged | **YES** |
| Steps 1 / 3 unchanged | **YES** |
| Schema / validator / GAM / DLA-WB unchanged | **YES** |
| P05 untouched | **YES** |
| T-031 / T-033 untouched | **YES** |

---

## 9. Deviation from T-040

None. Insert, version bump, pin, and test files match the plan. Unique after is exactly **18,237**.

---

## 10. Stop

**Stop after Gate B.** Do not run Lagrangian or Roman Roads from this task.

**P01-R1 INTERMEDIATE-OPERAND IMPLEMENTED — READY FOR OPERATOR GATE C**
