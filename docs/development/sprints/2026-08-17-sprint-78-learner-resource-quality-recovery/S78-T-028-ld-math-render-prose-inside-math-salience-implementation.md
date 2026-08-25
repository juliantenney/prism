# S78-T-028 — LD-MATH-RENDER prose-inside-math salience implementation

**Task:** S78-T-028  
**Status:** **IMPLEMENTATION COMPLETE** (2026-08-25)  
**Mode:** Shared authoring-salience fix only  
**Depends on:** [S78-T-027](S78-T-027-gpt-maths-authoring-reliability-diagnostic.md)  
**Sprint 78:** OPEN · **T-013:** remains OPEN · **T-019:** not started

**Validator heuristic / schemas / T-026 / verifier expansion:** **UNCHANGED**

---

## 1. Implementation summary

Implemented the T-027 recommendation exactly as a minimal shared LD-MATH-RENDER salience addition:

- added one new invariant line to the canonical `CORE_LINES` contract in `lib/ld-math-render.js`;
- synced the same line in `app.js` inline bootstrap fallback (`bootstrapLdMathRenderInlineIfMissing`);
- added targeted tests proving fail/pass/tolerated behaviour and shared prompt injection.

No validator logic changes, no domain-specific bans, no Lagrangian-specific branching, and no schema changes.

---

## 2. Exact production change

Added this line (verbatim) to LD-MATH-RENDER prompt text:

```text
- Labels, units, and explanations belong outside math delimiters; inside \(...\) and \[...\] use contiguous mathematical notation only — do not wrap instructional prose in \text{...}. Write the label in surrounding Markdown and keep the math span to symbols, variables, and numeric expressions.
```

**Files changed (production):**

- `lib/ld-math-render.js` (`CORE_LINES`)
- `app.js` (inline fallback in `bootstrapLdMathRenderInlineIfMissing`, both includeMarker variants)

---

## 3. Tests added/changed

### `tests/ld-math-render-integrity.test.js`

Added:

1. `math integrity: display math with instructional \text label fails`
   - `\text{total programme expenditure}=200{,}000` inside `\[...\]` must fail with `PROSE_INSIDE_MATH`.
2. `math integrity: label outside display math with bare numeric interior passes`
   - `Total programme expenditure:` + `\[200{,}000\]` must pass.
3. `math integrity: short formula label inside \text remains tolerated`
   - `\text{Inflation Rate}=\frac{a}{b}` inside `\[...\]` continues to pass.
4. Extended prompt-block assertion to require the new salience line.

### `tests/mathjax-producer-prompt-contract.test.js`

Extended `assertLdMathRenderContractText` to require:

- `Labels, units, and explanations belong outside math delimiters`
- `do not wrap instructional prose in \text{...}`

This proves shared LD-MATH-RENDER injection path propagation for DLA/GAM/Design Page/assessment producer prompts.

---

## 4. Test results

Command:

`node --test "tests/ld-math-render-integrity.test.js" "tests/mathjax-producer-prompt-contract.test.js"`

Result:

- **23 passed**
- **0 failed**
- duration ~585 ms

---

## 5. Deviations from T-027

**None.** Implemented exactly the one-line salience rule + synced fallback + tests specified in T-027.

---

## 6. Unresolved risks

- Validator still intentionally allows short `\text{...}` labels (for formula identifiers). This is by design to avoid over-blocking and was preserved.
- Live first-pass reliability still needs operator rerun evidence; unit tests alone do not close T-013.

---

## 7. Recommended next action

Run operator-led fresh Lagrangian regeneration after T-028 and evaluate:

- whether A5-M1 style prose-inside-math recurrence is removed on first pass;
- Subject Quality / disciplinary warrant trajectory post-T-026 + T-028;
- T-013 first-pass reliability status (remain fail-closed; do not regen-until-pass as closure evidence).

---

## 8. Files inspected

- `lib/ld-math-render.js`
- `app.js`
- `tests/ld-math-render-integrity.test.js`
- `tests/mathjax-producer-prompt-contract.test.js`
- `docs/.../S78-T-027-gpt-maths-authoring-reliability-diagnostic.md`
- `docs/.../STATUS.md`
- `docs/.../PLAN.md`
- `docs/.../SPRINT-78-START-HERE.md`
- `docs/.../HANDOVER.md`
- `docs/.../next-chat-briefing.md`

---

## 9. Files changed

- `lib/ld-math-render.js`
- `app.js`
- `tests/ld-math-render-integrity.test.js`
- `tests/mathjax-producer-prompt-contract.test.js`
- `docs/development/sprints/2026-08-17-sprint-78-learner-resource-quality-recovery/S78-T-028-ld-math-render-prose-inside-math-salience-implementation.md`
- `docs/development/sprints/2026-08-17-sprint-78-learner-resource-quality-recovery/STATUS.md`
- `docs/development/sprints/2026-08-17-sprint-78-learner-resource-quality-recovery/PLAN.md`
- `docs/development/sprints/2026-08-17-sprint-78-learner-resource-quality-recovery/SPRINT-78-START-HERE.md`
- `docs/development/sprints/2026-08-17-sprint-78-learner-resource-quality-recovery/HANDOVER.md`
- `docs/development/sprints/2026-08-17-sprint-78-learner-resource-quality-recovery/next-chat-briefing.md`

---

## 10. Sprint 78 state

| Item | Status |
| ---- | ------ |
| Sprint 78 | **OPEN** |
| T-013 | **OPEN** |
| T-028 | **Implementation complete** |
| T-019 | **Queued** (not started) |
| Next | Fresh Lagrangian benchmark / regen (operator-led) |

