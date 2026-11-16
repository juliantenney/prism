# Sprint 98 — Validation ledger

**Sprint:** 98 — Interactive Instructional Coherence and Academic Plain English  
**Final status:** **CLOSED — ACCEPTED WITH QUALIFICATIONS** — [SPRINT-98-CLOSURE.md](SPRINT-98-CLOSURE.md) · [S98-D09](decisions.md#s98-d09--close-sprint-98--accepted-with-qualifications)  
**Historical close:** [S98-D05](decisions.md#s98-d05--close-sprint-98--accepted--qualified)  
**M5 implementation:** [S98-D07](decisions.md#s98-d07--authorise-and-implement-m5-option-c-bounded-scaffold-sequencing)

---

## S98-D08 prose typography verification (2026-11-16)

```text
node --test tests/s98-learner-facing-prose-typography.test.js tests/interactive-academic-plain-english-guidance.test.js tests/ld-gam-instructional-depth.test.js tests/discovery-dependent-learning-guidance.test.js tests/workflow-educational-quality-framework-prompt.test.js tests/interactive-attempt-before-explanation-guidance.test.js
```

**Result:** **40 pass / 0 fail**

| Suite | Notes |
| ----- | ----- |
| `s98-learner-facing-prose-typography` | Shared ban + preserve structural formatting; Interactive / LJ / Expository / AP / Situated receive marker; GAM assembler covered |
| APE / instructional depth / discovery / EQF / attempt-before | Unchanged green |

---

## M5 verification (2026-11-16)

### Focused + related

```text
node --test tests/s98-m5-attempt-before-scaffold-sequencing.test.js tests/post-attempt-solution-disclosure.test.js
```

**Result:** **13 pass / 0 fail**

### Broader Sprint 98 + composition regressions

```text
node --test tests/s98-m5-attempt-before-scaffold-sequencing.test.js tests/post-attempt-solution-disclosure.test.js tests/interactive-attempt-before-explanation-guidance.test.js tests/learner-renderer-vnext-compose-a4.test.js tests/learner-renderer-vnext-compose-a5.test.js tests/workflow-design-page-upstream-prompt.test.js tests/discovery-dependent-learning-guidance.test.js tests/interactive-academic-plain-english-guidance.test.js tests/interactive-commissioned-resource-title-preservation.test.js tests/ld-gam-instructional-depth.test.js tests/ld-self-directed-rhetoric.test.js tests/workflow-pel-orientation.test.js tests/s96-interactive-editorial-opening.test.js
```

**Result:** **99 tests · 95 pass · 4 fail · 0 skipped**

| Failure | Baseline vs new |
| ------- | --------------- |
| `tests/s96-interactive-editorial-opening.test.js` — figcaption subject text | **Known baseline (S98-E07)** — decorative caption policy vs test; not introduced by M5 |
| `tests/learner-renderer-vnext-compose-a5.test.js` — 3 A5 Learn/Check/render expectations | **Known baseline** — reproduced with M5 changes stashed; heteroscedasticity fixture drift, not M5 |

All new M5 sequencing tests (**9/9**), post-attempt disclosure, attempt-before guidance, A4 compose, Design Page / APE / title / GAM / rhetoric / PEL suites in this set **passed**.

Browser bundle rebuilt: `npm run build:learner-renderer-vnext-browser`.

---

## M4 verification command (historical)

```text
node --test tests/workflow-design-page-upstream-prompt.test.js tests/discovery-dependent-learning-guidance.test.js tests/interactive-academic-plain-english-guidance.test.js tests/interactive-commissioned-resource-title-preservation.test.js tests/ld-gam-instructional-depth.test.js tests/ld-self-directed-rhetoric.test.js tests/interactive-attempt-before-explanation-guidance.test.js tests/workflow-pel-orientation.test.js tests/s96-interactive-editorial-opening.test.js
```

**Date:** 2026-11-16  
**Result:** 68 tests · **67 pass** · **1 fail** · 0 skipped

| Failure | Baseline vs new |
| ------- | --------------- |
| `tests/s96-interactive-editorial-opening.test.js` — figcaption expects subject text | **Known baseline (S98-E07)** — decorative caption policy vs test; not introduced by Sprint 98 guidance; not repaired |

All Design Page role-separation, discovery, APE, title-preservation, GAM depth, rhetoric, attempt-before and PEL orientation tests in this set **passed**.

---

## Documentation integrity check (M5)

| Claim | Check |
| ----- | ----- |
| Option C relocates attempt-before scaffolds | **Claimed** — fixture-verified |
| Option B required | **Not claimed** — not needed |
| A1 fully fixed | **Not claimed** — S98-AD-012 residual |
| Author regen of original M5 case | **Not claimed** — case unreproducible; accepted on regressions |
| Full study-flow execution engine | **Not claimed** |
| Figcaption / A5 compose suites green | **Not claimed** — known baselines |
| S98-D08 generation-validated | **Not claimed** — guidance + focused tests only |
| Controlled four- vs three-activity A/B | **Not claimed** |

---

## Final close integrity (S98-D09)

| Claim | Check |
| ----- | ----- |
| Accepted outcomes recorded accurately | **Claimed** — [SPRINT-98-CLOSURE.md](SPRINT-98-CLOSURE.md) |
| Qualifications / residual debt preserved | **Claimed** — [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md) |
| Sprint 97 deferred items untouched | **Claimed** — S98-AD-007 |
| Successor Sprint 99 opened | **Claimed** — programme NEXT-SPRINT |

---

## Prior milestone evidence

- M1: Design Page file/route verification — [EVIDENCE-REGISTER.md](EVIDENCE-REGISTER.md)  
- M2: Educational evaluation — S98-D03 · case package + DP/assembled JSON summary  
- M3: Sequencing investigation — [M3-SEQUENCING-INVESTIGATION.md](M3-SEQUENCING-INVESTIGATION.md)  
- M4: Consolidation — S98-D05  
- M5: Option C implementation — S98-D07  
- Editorial: S98-D08 typography — 40 pass / 0 fail  
- Close: S98-D09
