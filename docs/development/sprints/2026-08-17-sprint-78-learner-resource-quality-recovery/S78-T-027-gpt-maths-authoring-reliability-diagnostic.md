# S78-T-027 — GPT maths-authoring reliability diagnostic

**Task:** S78-T-027  
**Status:** **DIAGNOSTIC COMPLETE** (2026-08-25)  
**Mode:** Diagnostic / design only — **no production changes in this task**  
**Sprint 78:** OPEN · **T-013:** remains OPEN · **T-019:** not started  

**Validator / schema / T-026 / verifier expansion:** **NO**

---

## 1. Trigger exhibit

Post–T-026 fresh GPT Lagrangian benchmark reached GAM successfully; GAM capture **failed validation twice** with the same class:

```text
activities[4].materials[0] (A5-M1): math integrity — display math contains instructional prose; keep TeX contiguous
```

Approximate failing construct:

```tex
\[
\text{total programme expenditure}=£200{,}000.
\]
```

PRISM correctly rejected this: instructional prose was embedded inside a display-math span. T-026 disciplinary-warrant salience was **not** implicated — operator reports S78-DP behaviour looked strong through DLA/GAM.

---

## 2. Root cause

**Generation-side salience gap on an already-prohibited construct — not a validator defect and not a missing capture rule.**

| Layer | Finding |
| ----- | ------- |
| **Validator** | `validateLearnerFacingMathIntegrity` in `lib/ld-math-render.js` flags `PROSE_INSIDE_MATH` when a math-span interior matches three or more consecutive lowercase word tokens (`inspectMathSpanInterior`). The failing `\text{total programme expenditure}` body matches that heuristic. Behaviour is correct and fail-closed. |
| **Authoring contract** | LD-MATH-RENDER already states: *"Math spans must be intact TeX only: never interleave numbered steps, **instructional prose**, or truncated symbols inside `\(...\)` or `\[...\]`"* and *"keep each equation contiguous."* |
| **Model behaviour** | GPT treated `\text{...}` inside `\[...\]` as a legitimate way to label a numeric result — a pattern seen in historical inflation/CPI GAM artefacts where short `\text{Inflation Rate}`-style labels pass validation. The model generalised a tolerated short-label idiom into a multi-word instructional label sentence. |
| **Salience** | The contract never names `\text{...}` as an anti-pattern, never states that labels/units/explanations belong **outside** delimiters, and sits mid-block among delimiter/JSON/HTML rules. Self-directed material shape guidance (`buildSelfDirectedLearnerPageMaterialShapePromptBlock`) says to keep display math on its own lines with prose before/after — but does not forbid `\text{instructional phrase}` inside the span. |

**Classification:** Same **math-integrity authoring family** as Sprint 71 quadratic corruption (`S71-O-004`) and Sprint 77 post–T-027 inline-math prose recurrence — but a **distinct failure mode**: deliberate `\text{}` labelling rather than splice/garble corruption. Not E2 malformed JSON.

---

## 3. Answers to inspection questions

### Q1 — Is the failing construct already prohibited clearly by current authoring guidance?

**Partially yes.** The general rule *"never interleave … instructional prose … inside `\(...\)` or `\[...\]`"* covers the construct in principle. It is **not** clearly operationalised for the common GPT pattern of wrapping labels in `\text{...}` inside display math.

### Q2 — If yes, is the problem insufficient salience?

**Yes.** The prohibition exists but lacks:

- an explicit `\text{...}` / label-outside-math call-out;
- a positive authoring pattern (Markdown label + bare math interior);
- contrast with historically tolerated **short** symbol labels (e.g. `\text{CPI}_{Year 2}`) vs **multi-word instructional phrases**.

### Q3 — If no, what compact domain-general rule is missing?

N/A — no new validator rule required. One compact **authoring invariant** is missing from salience:

> Labels, units, and explanations stay outside math delimiters; inside `\(...\)` and `\[...\]` use contiguous mathematical notation only — do not wrap instructional prose in `\text{...}`.

### Q4 — GAM only or shared maths-authoring guidance?

**Shared LD-MATH-RENDER (L7) SSOT** — not GAM-only.

Injection path: `applyMathSafeOutputContractToDraft` in `app.js` appends `buildLdMathRenderPromptBlock()` for **DLA**, **GAM**, **Design Page**, and **assessment producer** steps. DLA canonical assembler also places LD-MATH-RENDER in the `outputSlot` via `buildDlaCanonicalSlotContext`.

A GAM-only duplicate would drift from the single contract module and miss the same class in assessment stems and Design Page synthesis fields.

### Q5 — Can the fix be expressed as a short authoring invariant?

**Yes.** Recommended invariant bundle (domain-general):

1. Prose stays outside display/inline math delimiters.
2. Math spans contain contiguous mathematical notation only.
3. Use surrounding Markdown prose or captions for labels, units, and explanations.
4. Do not use `\text{...}` for multi-word instructional labels inside equations; reserve short conventional identifiers inside formulas when truly part of the notation (e.g. `\text{CPI}`, `\lambda`).

### Q6 — What tests would prove the fix without overfitting to Lagrangian?

| Test | Purpose |
| ---- | ------- |
| **Validator:** `\text{total programme expenditure}=200{,}000` inside `\[...\]` → `PROSE_INSIDE_MATH` | Documents the failure class (already passes today — add explicit fixture so regression is named) |
| **Validator:** label-outside pattern passes — e.g. `Total programme expenditure:\n\n\[\n200{,}000\n\]` | Positive control for recommended authoring |
| **Validator:** short conventional `\text{Inflation Rate}=\frac{a}{b}` still passes | Guards against over-broad banning of two-word formula labels the heuristic already allows |
| **Prompt contract:** `buildLdMathRenderPromptBlock` includes new salience line (via `tests/ld-math-render-integrity.test.js` or `tests/mathjax-producer-prompt-contract.test.js`) | Proves shared injection text changed |
| **GAM capture:** optional integration test mirroring existing corrupted A2-M1 pattern in `tests/ld-math-render-integrity.test.js` | End-to-end capture message shape unchanged |

Do **not** add Lagrangian-specific banned strings, `\text{}` stripping, or validator weakening.

---

## 4. Current contract gap (precise)

| Location | Gap |
| -------- | --- |
| `lib/ld-math-render.js` `CORE_LINES` | General "instructional prose" ban without `\text{}` / label-outside positive pattern |
| `app.js` `bootstrapLdMathRenderInlineIfMissing` fallback | Mirrors `CORE_LINES` — must stay in sync when salience is added |
| `lib/ld-gam-page-enrich-contract.js` | No maths-specific duplication (correct — relies on runtime LD-MATH-RENDER injection) |
| `buildGamV2CopyMaterialAuthoringBrief` | No maths line (correct — shared L7 module owns maths) |
| `buildSelfDirectedLearnerPageMaterialShapePromptBlock` | Says prose before/after display math on separate lines but omits `\text{prose}` inside span |

---

## 5. Recommended owner and minimal proposed wording

| Field | Value |
| ----- | ----- |
| **Owner module** | `lib/ld-math-render.js` — `CORE_LINES` (canonical SSOT) |
| **Sync** | `app.js` inline bootstrap duplicate of `CORE_LINES` |
| **Injection surfaces (automatic via existing machinery)** | DLA output slot, GAM runtime augmentation, Design Page, assessment items / feedback / rubric |
| **Not recommended** | GAM-only brief line; validator change; `\text{}` stripper; domain banned phrases |

**Minimal proposed wording** (one bullet appended after the existing contiguous-math lines):

```text
- Labels, units, and explanations belong outside math delimiters; inside \(...\) and \[...\] use contiguous mathematical notation only — do not wrap instructional prose in \text{...} (write the label in surrounding Markdown and keep the math span to symbols, variables, and numeric expressions).
```

**Recommended positive example** (for implementation task notes / operator regen brief, not validator):

```markdown
Total programme expenditure:

\[
200{,}000
\]
```

---

## 6. Is implementation warranted?

**Yes — as a follow-on salience task (proposed S78-T-028), not in this diagnostic task.**

Rationale:

- Validator already correct; weakening it is forbidden.
- One-line shared contract salience is the smallest generation-side fix aligned with Sprint 71 (`S71-O-004`) and Sprint 77 math-integrity history.
- Failure reproduced deterministically in repo tests without live GPT.
- Risk is low: does not change schemas, capture gates, or T-026 S78-DP.

**Not warranted in T-027 itself** per task mode (diagnostic/design only).

---

## 7. Relation to T-013 first-pass reliability

This failure is **first-pass GAM math-integrity rejection** — aligned with [S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification). It is **distinct from**:

- E2 malformed JSON / splice recurrence (C2, C6 attempt 1);
- T-026 disciplinary warrant;
- operational suitability / operand validity.

T-013 remains **OPEN**. This diagnostic does **not** close T-013. Regenerating until capture passes is not closure evidence.

---

## 8. Historical cross-reference

| Record | Relevance |
| ------ | --------- |
| [S71-R-005](../2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/reviews/S71-R-005.md) / `S71-O-004` | GAM math integrity validator added; quadratic garble inside display math |
| [S77-T-026 E2 recurrence](../2026-08-14-sprint-77-dla-prompt-contract-architecture-pilot/S77-T-026-e2-recurrence-2026-08-14-post-t027-gam.md) | Inline-math prose splice — different mechanism, same validator family |
| Historical inflation GAM artefacts (Sprint 38F/38L) | Short `\text{Inflation Rate}` inside formulas — passes heuristic; explains mixed model signal |

---

## 9. Files inspected

| File | Role |
| ---- | ---- |
| `lib/ld-math-render.js` | LD-MATH-RENDER contract + `validateLearnerFacingMathIntegrity` |
| `lib/page-gam-enrich.js` | GAM capture math-integrity gate |
| `tests/ld-math-render-integrity.test.js` | Integrity + GAM capture regression tests |
| `tests/ld-math-render.test.js` | Contract block shape tests |
| `tests/mathjax-producer-prompt-contract.test.js` | DLA/GAM/Design Page LD-MATH-RENDER injection tests |
| `app.js` | `applyMathSafeOutputContractToDraft`, `buildGamV2CopyMaterialAuthoringBrief`, `buildSelfDirectedLearnerPageMaterialShapePromptBlock`, inline bootstrap |
| `lib/ld-gam-page-enrich-contract.js` | GAM partial contract (no maths duplication) |
| `lib/ld-dla-page-enrich-contract.js` | DLA slot context (outputSlot maths) |
| [S71-R-005](../2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/reviews/S71-R-005.md) | Prior math-integrity production defect |
| [S77 post-T-027 E2 recurrence](../2026-08-14-sprint-77-dla-prompt-contract-architecture-pilot/S77-T-026-e2-recurrence-2026-08-14-post-t027-gam.md) | Prior inline-math prose failure |
| [S78-T-013-workstream-2-integration-verification.md](S78-T-013-workstream-2-integration-verification.md) | T-013 first-pass reliability context |

---

## 10. Files changed (this task)

| File | Change |
| ---- | ------ |
| `S78-T-027-gpt-maths-authoring-reliability-diagnostic.md` | **Added** — this record |
| `STATUS.md` | T-027 row + immediate priority pointer |
| `PLAN.md` | T-027 phase entry |
| `SPRINT-78-START-HERE.md` | T-027 pointer |
| `HANDOVER.md` | T-027 summary + next step |
| `next-chat-briefing.md` | T-027 outcome |
| `S78-T-013-workstream-2-integration-verification.md` | Cross-link math-integrity salience track |

**Production / test code:** **unchanged**

---

## 11. Sprint 78 state after T-027

| Item | Status |
| ---- | ------ |
| Sprint 78 | **OPEN** |
| T-013 | **OPEN** |
| T-027 | **Diagnostic complete** — salience implementation **recommended** (proposed T-028) |
| T-026 | Complete |
| T-019 | Queued — not started |
| Latest benchmark signal | Post-T-026 GAM math integrity fail on A5-M1 (`PROSE_INSIDE_MATH` via `\text{total programme expenditure}`) |
| Next authorised | **S78-T-028** one-line LD-MATH-RENDER salience + regression tests; then operator fresh Lagrangian regen |
