# S77-T-020 — GAM Case 1 operational suitability (A4 System 3)

**Status:** **SOLUTION DESIGN COMPLETE** (2026-08-14) — **no implementation**  
**Mode:** DIAGNOSTIC / SOLUTION DESIGN ONLY  
**Selected track:** GAM operational suitability / T-031 Case 1 (operator: **not** four-track meta-triage)  
**Primary exhibit:** Lagrangian A4-M1 System 3 ([T-019](S77-T-019-gam-e-learner-facing-corruption-diagnostic.md))  
**Depends on:** T-019 · Sprint 76 T-031 / T-046 / T-047 / T-048  

**Out of scope:** implementation · production prompt edits · validators · schemas · DLA · EP · E1 repair · E2 investigation · GAM D implementation · T-031 redesign · “must be solvable” on DLA

T-031 **ownership stays closed.** This task designs a **GAM-only residual** of the already-accepted Case 1 split.

---

## 0. Settled classification (not reopened)

DLA commissioned A4-M1 `equation_set` for a learner task that requires learners to **solve** supplied FOC systems, **identify the solution**, and **verify** it against the original constraint. Specification (T-019): three introductory systems derived from constrained optimisation; include the original constraint for verification.

GAM System 3:

```text
20 − 2λ = 0
30 − 3λ = 0
60 − 2x − 3y = 0
```

Both of the first two equations imply λ = 10. One independent relation remains for x and y. The operand does **not** uniquely determine x, y, and λ.

**T-031 Case 1:** DLA named the correct operation and pedagogical bounds; GAM realised particulars that are **not executable** under that operation.

**Not** E1. **Not** E2. **Not** GAM D. **Not** a DLA bound omission.

---

## 1. Live GAM fulfilment path

Production GAM Copy (`buildWorkflowStepInstructions` when `isGamPageEnrichmentV2CopyStep`):

| Layer | File | What it binds |
| ----- | ---- | ------------- |
| Authoring brief | `app.js` `buildGamV2CopyMaterialAuthoringBrief()` | `purpose` / `specification`; T-031 operational-suitability sentence; evidence_requirement; conversation for upstream DLA |
| Envelope / evidence contract | `lib/ld-gam-page-enrich-contract.js` `buildGamPageEnrichContractBlock()` | Partial-page shape; 1:1 `material_id`; **evidence_requirement** fulfilment — **not** ordinary specification executability |
| Archetype routing | `applyLdInstructionalArchetypeRoutingToDraft` | Compact rules for materials that already have Priority-1 `instructional_archetype` |
| DLA JSON embed | `buildUpstreamDlaPageEmbedSectionForGamCopy` | **Empty** in partial mode (E1) |

`tests/page-gam-enrich.test.js` already asserts the T-031 GAM clauses on assembled Copy instructions.

T-047 put the T-031 GAM sentence **only** on the Copy brief, not on `58-GAM-PARTIAL-1`. That surface choice remains correct for this residual.

---

## 2. Exact current model-visible T-031 GAM instruction

Live string (one line of the Copy brief, immediately before the `evidence_requirement` clause):

> Honour required_materials[].purpose and treat specification as binding content bounds. Realised particulars must support the commissioned learner operation within those bounds; do not substitute a different method or extra unstated reasoning; do not invent pedagogical constraints the commission omits.

**Existing GAM T-031 rule model-visible: YES**

T-019’s captured final prompt quoted the honour/`specification` stem of this same sentence. The T-031 continuation is the remainder of that **same** production string. Absent a prompt dump that truncates mid-sentence, treat the full sentence as present in the instrumented run.

`ld-gam-page-enrich-contract.js` does **not** repeat this sentence.

---

## 3. Why the existing rule did not prevent A4 System 3

### Commission available this run

**YES.** T-019: this run preserved DLA `required_materials` IDs/types 10/10 via Copilot conversation. A4-M1 remained `equation_set`. E1 is a confirmed **architecture** defect; it is **not** the cause of this underdetermined system.

**E1 causal for this exhibit: NO**

### Mechanism A–E

| Hypothesis | Verdict |
| ---------- | ------- |
| **A** Rule absent from final model-visible prompt | **NO** |
| **B** Present but locally weak / low-salience | **YES (contributing)** — packed onto a long field-list line with evidence clauses; no example of underdetermined/missing-information failure |
| **C** Semantically insufficient | **YES (primary)** |
| **D** Commission unavailable because of E1 | **NO** for this exhibit |
| **E** Other demonstrated mechanism | **NO** additional Prism transform found |

**A4 failure mechanism:** GAM emitted structurally FOC-like equations whose first two rows are redundant in x,y. The commissioned operation (identify **the** solution and verify the constraint) is not executable. Local algebra of each line can be well-formed. This is inherent **underdetermination / missing independent information**, not a substituted method (KKT vs interior) and not an invented pedagogical bound.

### Why the live sentence fails this case

The live sentence was written against T-030 **Problem B** (wrong **method** / extra unstated reasoning) plus anti-over-specification (do not invent DLA-owned pedagogical constraints).

| Clause | Covers A4 System 3? |
| ------ | ------------------- |
| Honour purpose / specification as content bounds | Weak — DLA asked for systems to solve/verify; “three systems + constraint” can be met **structurally** without unique solvability |
| Support the commissioned learner operation | **Closest** — T-048 already read this as banning degenerate/unsolvable stems. It did **not** stop this draw. “Support” is compatible with “looks like FOCs” |
| Do not substitute a different method | **No** — System 3 still presents FOCs |
| Do not add extra unstated reasoning | **No** — the learner cannot complete the operation; they are not asked to use an extra method so much as they **lack** a determined (x,y) |
| Do not invent pedagogical constraints the commission omits | **Can work against the exhibit** if read as “do not add a missing independent equation / uniqueness” — that clause protects **DLA scope**, not GAM’s duty to supply enough information |

T-031 design already owned inherent fulfilment: values that make a calculation possible; operands **actually usable** with the named operation; do not satisfy a solve-commission with a merely plausible stem. Live GAM wording **dropped “actually”** and never named **missing information**, **contradictory conditions**, or **underdetermined systems when a solution must be identified**.

**Semantic gap: YES**  
**Salience gap: YES** (secondary)

The existing T-031 GAM instruction does **not** already express the intended executability principle **sufficiently** for this failure mode. Do not treat T-047 as complete for Case 1.

---

## 4. Minimum GAM-side semantic rule

**Do not copy the operator paragraph as production text.** Principle, then compact live wording.

**Principle (design):** When GAM realises particulars for a commissioned learner operation, those particulars must make **that** operation executable: the learner must not need a different method, missing information, contradictory or underdetermined conditions (when the operation requires identifying a result), or additional unstated reasoning. Do **not** invent pedagogical constraints the commission omits. Suitability is relative to **this row’s** operation only (T-031 anti-over-specification).

**Existing sentence:** keep all current clauses (method / unstated reasoning / anti-invention).

**Minimum add (conceptual — not implemented):** one short executability gloss on the **same Copy-brief sentence**, for example:

> Particulars must make that operation executable as commissioned: do not omit information or relationships the operation needs, and do not emit contradictory or underdetermined conditions when the operation requires identifying a result.

Final production characters belong to an implementation task. Do not add DLA “must be solvable.” Do not add a solver validator.

---

## 5. Conceptual tests (anti-over-specification preserved)

| Case | Required GAM behaviour | Must not do |
| ---- | ---------------------- | ----------- |
| Solve a supplied equation/system | Enough independent information for the **requested** identification | Emit redundant/contradictory FOCs that leave no unique (or requested) solution when identification is the operation |
| Calculate from supplied data | All values/relationships needed for the named calculation | Omit a load-bearing quantity; invent a pedagogical “use method Y” |
| Classify / interpret supplied cases | Particulars support the requested distinction | Cases that cannot be distinguished under the named criterion |
| Construction / practice material | Well-formed object for **this** operation (e.g. form L only) | Over-specify uniqueness/interior-solvability because a **later** activity will solve |

Construction control from T-048 remains the regression: an earlier construct-only row must **not** inherit later solve uniqueness.

---

## 6. Interaction (defects stay separate)

| Track | Overlap |
| ----- | ------- |
| **GAM D** | **PARTIAL** only as “GAM realisation quality.” GAM D is pedagogical-function fulfilment of a commission. This exhibit is **executability of the operand**. Same JSON can pass D and fail Case 1 (or the reverse). **Not the same defect.** |
| **GAM E1** | **NONE** as cause here. Binding gap remains independently. Do not start E1 repair in this track. |
| **GAM E2** | **NONE.** No `Pur[` / `\rtial` on this artefact. |
| **Archetype routing** | **NONE** on A4-M1. T-019 routing listed A1-M2, A2-M2, A3-M2, A5-M2 only. |
| **purpose / specification binding** | **SAME SURFACE** as T-031 GAM sentence. Repair **extends** that sentence; do not create a second GAM audit stack; do not move this into DLA Step 3. |

---

## 7. Options

| Option | Repair | Verdict |
| ------ | ------ | ------- |
| **1 (recommended)** | Extend the existing Copy-brief T-031 sentence with an executability gloss (§4). Keep anti-invention. | Smallest model-visible GAM repair; matches T-047 surface; no schema/validator |
| **2** | New separate Copy-brief bullet | More salience, more lines, duplicate home — larger than needed |
| **3** | Also inject into `ld-gam-page-enrich-contract.js` | Duplicates T-047 decision; not required to explain this exhibit |
| **4** | Deterministic solvability validation | **Reject** — T-031 forbids subject-specific solvers |
| **5** | DLA “must be solvable” / spec restatement | **Reject** — T-048; this is Case 1 GAM |

**Recommended repair: Option 1.**

---

## 8. Explicit report

| Item | Value |
| ---- | ----- |
| Existing GAM T-031 rule model-visible | **YES** |
| Commission available to model in this run | **YES** |
| A4 failure mechanism | Underdetermined FOC system (redundant λ equations; x,y not identified) under a solve/identify/verify commission |
| Semantic gap | **YES** |
| Salience gap | **YES** (contributing) |
| E1 causal for this exhibit | **NO** |
| GAM D overlap | **PARTIAL** (same owner class, different defect) |
| Schema change required | **NO** |
| Validator change required | **NO** |
| DLA change required | **NO** |
| Recommended repair | Option 1 — Copy-brief executability gloss on the live T-031 GAM sentence |
| Estimated prompt delta | **~80–160** characters on `buildGamV2CopyMaterialAuthoringBrief()` (one sentence extension) |
| Files/tests that would change | `app.js` (brief only); `tests/page-gam-enrich.test.js` (assert new clause + retain T-031 / anti-invention / no DLA “must be solvable”); `index.html` `app.js` cache pin if used; **not** DLA contract, **not** `ld-gam-page-enrich-contract.js` unless a later task proves Copy-only is invisible |
| Gate A | Prompt tests: new gloss present; old T-031 clauses present; DLA Step 3 unchanged; no Lagrangian-specific text; no validator/schema |
| Gate B | Existing GAM Copy / page-gam-enrich / Sprint 72 evidence suites — no DLA unique-size band change |
| Generation required for behavioural closure | **YES** (Gate C): same Lagrangian A4 solve commission or equivalent — confirm System-like operands determine the requested unknowns **and** a construct-only control is not over-specified |

---

## 9. Recommended next action

**S77-T-021 — implement Option 1** (GAM Copy brief only) through Gate A + Gate B. **Do not** treat Gate A/B as behavioural closure. Authorise **Gate C generation** separately after A/B.

Do not implement from T-020. Do not start E1, E2, or GAM D. Do not reopen T-031 design.

---

## Verdict

**CASE 1 RESIDUAL = GAM COPY-BRIEF SEMANTIC GAP (UNDERDETERMINATION NOT NAMED) — OPTION 1 — NEXT T-021 IMPLEMENTATION — NO CODE IN T-020**
