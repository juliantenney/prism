# S77-T-025 — GAM D pedagogical-function fulfilment diagnostic

**Status:** **DIAGNOSTIC COMPLETE** (2026-08-14) — **no live independent GAM D defect proven**  
**Mode:** DIAGNOSTIC ONLY  
**Authorised by:** operator (this task) · [S77-D03](decisions.md#s77-d03-gam-d-is-the-next-diagnostic-after-e1-and-case-1-close)  
**Production / tests / schema / validators:** **UNCHANGED**

Do not reopen E1, Case 1, or T-031. Do not diagnose E2 except to rule it out as causal. Do not implement a repair.

---

## 1. Precise definition of GAM D

**GAM D** is failure of a generated GAM material to **perform the pedagogical function** commissioned by the DLA `required_materials` row (purpose, specification, and — when present — `instructional_archetype` / `archetype_plan`), even when:

- `material_id` / `material_type` match (structural / type compliance);
- the body is topically on-subject;
- 1:1 row coverage holds.

Named Sprint 76 exhibit ([S76-T-037](../2026-08-13-sprint-76-dla-rationalisation-and-content-quality-consistency/S76-T-037-dla-p04-gate-c-rebenchmark.md) §5.3): DLA commissioned `A4-M2` as `worked_example` with a **full expert solution using an analogous case**; GAM emitted a row titled “Analogous Solved Example” that was only a **six-step procedural list** — no analogous problem, equations, calculation, solution values, or worked reasoning.

**Not GAM D:**

| Class | What it is |
| ----- | ---------- |
| **E1** | Commission not Prism-bound into the GAM prompt (CLOSED T-023/T-024) |
| **Case 1** | Realised particulars not executable for a named learner operation (CLOSED T-021/T-024) |
| **E2** | Learner-facing / JSON corruption (`Pur[`, `\rtial`) — OPEN / intermittent |
| **T-031 DLA** | Whether DLA named a sufficient operation/bounds (CLOSED; not reopened) |

A material can **pass Case 1** (operands determine the requested result) and still **fail GAM D** (e.g. a `worked_example` that never works a case). Conversely, A4-M1 on the bound run can **pass both**.

---

## 2. Exhibits inspected (no regeneration)

| ID | Source | What was available |
| -- | ------ | ------------------ |
| **H1** | S76-T-037 Lagrangian Gate C | Operator-recorded A4-M2 commission vs GAM body genre; JSON **not in git** |
| **B1** | [T-024](S77-T-024-gam-e1-and-case-1-bound-gate-c.md) post–T-023 DLA→GAM | A1–A5 × 3 rows; IDs/types; operator “purpose/specification substantively fulfilled”; A4-M1 FOC walkthrough quoted |
| **P1** | Live GAM Copy path (`app.js` / `ld-gam-page-enrich-contract.js` / archetype routing) | Commission projection + honour purpose/spec + depth + type-specific checklist rules |
| **X1** | T-019 / blocked T-021 Gate C | **Not used as GAM D exhibits** (E1-era / Case 1; purpose/spec not re-judged in T-019) |

Bodies for B1 other than A4-M1 FOCs are **not in the repository**. Operator T-024 judgements are treated as authoritative for that run, not re-scored.

---

## 3. Commission → instruction → output trace (live path)

```text
DLA required_materials[]
  { material_id, material_type, purpose, specification,
    instructional_archetype?, archetype_plan?, evidence_requirement? }
        │
        ▼
T-023 projection  AUTHORITATIVE DLA MATERIAL COMMISSION
  (those fields only; no learner_task / bodies)
        │
        ▼
Authority: fulfil purpose and specification; honour archetype/plan when present
Copy brief: honour purpose; specification = binding bounds; T-021 executability
GAM contract: 1:1 IDs; evidence_requirement if present; LD-GAM-INSTRUCTIONAL-DEPTH
Archetype routing: derived rule only for Priority-1 planned rows
        │
        ▼
Generated materials[] bodies
        │
        ▼
Capture/validate: shape, IDs, non-empty bodies — NOT pedagogical-function checks
```

**What the live prompt operationalises**

- Binding of **which** rows and **purpose/spec text** (after T-023).
- Executability of **solve/identify** particulars (T-021).
- Depth / evidence-provider / guided-checklist **genre** for those families.
- Archetype **realisation rules** only when DLA already attached a Priority-1 plan.

**What it does not add**

- A generic `material_type → pedagogical genre` rule (e.g. “`worked_example` must actually work a case”) independent of purpose/spec.
- Validator or capture checks that a worked example contains equations/values/reasoning.

DLA already states that `material_type` is presentation format and `instructional_archetype` is pedagogical function. GAM D is therefore primarily “did the body do the job named in purpose/spec (and archetype when present)?”, not “did the type token match.”

---

## 4. PASS/FAIL per representative exhibit

### H1 — S76 Lagrangian A4-M2 `worked_example` (historical)

| Lens | Result |
| ---- | ------ |
| Structural 1:1 / type present | **PASS** (row emitted, titled as analogous example) |
| Topical | **PASS** (procedure about solving, not off-topic) |
| Pedagogical function | **FAIL** — no analogous case, equations, calculation, or worked reasoning |

**Earliest proven layer for H1:** **generated material (output observation).**  
**A–F for H1:** **not isolable.** That run predates Prism-bound commission. E1 later proved the commission was not in the final prompt architecture. Conversation *may* have carried the spec (unknown for H1). Therefore H1 is a **confirmed output symptom**, not a proven remaining **C** or **D** mechanism.

E2 is **not** causal for H1 (no `Pur[` / JSON-split exhibit on that row). Capture damage **not** indicated (body was a coherent six-step list).

### B1 — T-024 bound Lagrangian (post–T-023)

| Row | Type | Structural/type | Pedagogical function |
| --- | ---- | --------------- | -------------------- |
| A4-M1 | `worked_example` | PASS | **PASS** — supplies independent FOCs, derives `x = y = 5`, verifies `5+5=10` (this **is** working the example, not a procedure-only shell) |
| A1–A5 remaining 14 rows | as T-024 table | PASS (IDs/types; no extras/missing) | **PASS at operator grain** — T-024: purpose/specification substantively fulfilled; archetype-sensitive material substantively routed. Bodies not re-inspected here. |

**B1 GAM D FAIL: not demonstrated.**

T-024’s “purpose/specification substantively fulfilled” was recorded under E1 Gate C and **must not be stretched** into a product-wide GAM quality claim. It **is** sufficient to refuse a live FAIL on this chain without new bodies.

### Distinction (this diagnostic)

| | H1 | B1 A4-M1 |
| - | -- | -------- |
| Type `worked_example` | yes | yes |
| Actually worked | **no** | **yes** |
| After E1 bind | no | yes |

The Sprint 76 **naming exhibit is not reproduced** on the bound A4 worked_example that was inspected.

---

## 5. Earliest proven failure layer

| Question | Answer |
| -------- | ------ |
| Live bound Lagrangian (B1) | **No GAM D failure proven** → **F** for this chain |
| Historical H1 | Failure proven at **output**; **not** proven as live independent C or D after E1 close |
| Projection loss (B) | **Not proven** — T-023 copies purpose/spec/type when present; T-024 types preserved |
| DLA commission insufficient (A) | **Not proven** for H1 (DLA named analogous full expert solution) or B1 |
| Capture/transform (E) | **Not proven** |
| E2 causal | **NO** |

**One defect or many?** GAM D was **one named symptom class** (genre/function mismatch, especially worked_example-as-shell). After E1/Case 1 close it is **not** evidenced as a remaining independent live mechanism. Do not split into multiple live GAM D repairs.

---

## 6. Relationship to E1 / E2 / Case 1 (do not merge)

| Track | Relation to GAM D |
| ----- | ----------------- |
| **E1** | Historical H1 is **E1-confounded**. Live B1 **binding PASS** and **GAM D FAIL not shown**. E1 stays **CLOSED**. |
| **Case 1** | Operand executability. B1 A4-M1 **PASSES Case 1 and GAM D** together. Closed Case 1 does not imply GAM D always passes. |
| **E2** | Different mechanism. Not shown on H1 or B1. Remains **OPEN / intermittent**. |

---

## 7. Smallest repair seam (if a defect were still live)

**Not authorised.** No live defect to repair.

**If** a future bound run reproduced H1 (explicit purpose/spec for an analogous worked solution present in the commission projection, model still emits a procedure-only shell), the smallest seam would be **GAM Copy-local realisation of purpose/spec for modelling genres** (worked_example / worked_process_guide) — not DLA, not validators, not E1, not T-031. Do not add that line from this diagnostic.

---

## 8. Explicitly ruled out

- Reopening E1, Case 1, T-031, DLA architecture, P02, schemas, validators.
- E2 as cause of H1 or B1.
- Capture-layer destruction of an otherwise worked A4-M2 (H1 body was intact prose).
- “Type match ⇒ function fulfilled.”
- Product-wide GAM quality PASS.
- Prompt-architecture rationalisation / PB-FA-010.
- Need for a full DLA→GAM regeneration to close this diagnostic: **NO.** Operator B1 judgements plus H1 written exhibit suffice. Smallest *optional* extra (not required): paste of B1 DLA purpose/spec + A3-M2 `worked_example` body if a later task wants a second worked-example audit.

---

## 9. Classification (authoritative)

**Live bound Lagrangian: F — no GAM D defect demonstrated.**  
**Historical H1: output FAIL, E1-confounded; not a remaining independent repair item.**  
**GAM D as an open Sprint 76/77 implementation track: CLOSE (unproven as live independent defect).**

---

## 10. Exact next authorised task

**S77-T-026 — GAM E2 intermittent learner-facing / JSON corruption diagnostic** — **defined; not started.** Do not execute from leftover T-025. Do not guess a sanitiser. Do not start Graphics or PB-FA-010.

---

## Verdict

**T-025 COMPLETE — NO LIVE INDEPENDENT GAM D DEFECT PROVEN — NAMED HISTORICAL EXHIBIT NOT REPRODUCED ON BOUND A4 WORKED_EXAMPLE — NEXT = T-026 E2 (DEFINED, NOT STARTED).**
