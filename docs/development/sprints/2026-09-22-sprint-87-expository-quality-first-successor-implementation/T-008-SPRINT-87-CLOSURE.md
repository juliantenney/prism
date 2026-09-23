# Sprint 87 — Closure Record

**Sprint:** 87 — Expository Quality — First Successor Implementation  
**Opened:** 2026-09-23  
**Closed:** 2026-09-23  
**Status:** **COMPLETE / CLOSED**  
**Type:** Implementation + validation  
**Backlog:** [PB-FA-012](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-012--expository-editorial-quality--qa)  
**Opening:** [S87-D01](decisions.md#s87-d01--open-sprint-87--expository-quality--first-successor-implementation)  
**Close:** [S87-D14](decisions.md#s87-d14--close-sprint-87--expository-quality--first-successor-implementation)  
**Predecessor:** [Sprint 86 COMPLETE / CLOSED](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/T-012-SPRINT-86-CLOSURE.md)  
**Live validation:** [T-007-LIVE-VALIDATION.md](T-007-LIVE-VALIDATION.md)

---

## 1. Final conclusion

> **Sprint 87 implemented and validated the first Expository editorial-quality successor slice. Five matched live cases and a frozen Expository QA benchmark provide evidence of materially improved epistemic-form fidelity, learner-facing information architecture, structured-material publication quality, terminal closure, editorial register, representation commissioning and publishing presentation. The final Bayes calibration scored 89/100 and was independently validated at 90/100. Remaining limitations and deferred capabilities are documented; no further general editorial refinement is warranted by the current evidence.**

**Not claimed:** Expository is perfect · defect-free · production-ready in every context · 90/100 as proof of universal Expository quality (one calibrated validation case within wider five-case live evidence).

**Alpha development remains complete** (Sprint 82). Interactive prompt family remains a **protected baseline** ([S83-D04](../2026-09-21-sprint-83-expository-resource-investigation/decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline)).

---

## 2. Product outcome (first-slice north star — met)

First-class Expository Resources now:

- preserve **commissioned intellectual purpose / epistemic form** (EQ1);
- open and close as **chapters** rather than prospectus packs (EQ7/EQ8);
- eliminate the systematic **unsupported structured-material** learner slogan and publish unique instructional bodies (AD-010 + publication-quality follow-ons);
- present with **restrained non-card educational publishing chrome** (T-010 Expository-scoped);
- do so **without a new generative stage** and **without destabilising Interactive**.

---

## 3. Task / WP final status

| ID | Title | Status |
| -- | ----- | ------ |
| **S87-T-001** | Expository QA v0.2 | **COMPLETE** |
| **S87-T-002** | EQ1 contract + Expository prompt authority | **COMPLETE** |
| **S87-T-003** | Chapter-form EQ7/EQ8 + DP `sections` safety | **COMPLETE** |
| **S87-T-004** | AD-010 structured-material rendering | **COMPLETE** |
| **S87-T-005** | Restrained T-010 presentation | **COMPLETE** |
| **S87-T-006** | Engineering regression gate | **COMPLETE** |
| **S87-T-007** | Live/manual validation + bounded live repairs | **COMPLETE** |
| **S87-T-008** | Synthesis / sprint closure | **COMPLETE** |

| WP | Focus | Status |
| -- | ----- | ------ |
| **WP1** | Acceptance instrument | **COMPLETE** |
| **WP2** | EQ1 contracts / prompts | **COMPLETE** |
| **WP3** | Chapter-form assembly | **COMPLETE** |
| **WP4** | AD-010 + T-010 presentation | **COMPLETE** |
| **WP5** | Gates + live validation + closure | **COMPLETE** |

---

## 4. T-007 evidence (authoritative summary — do not overstate)

Recorded in detail in [T-007-LIVE-VALIDATION.md](T-007-LIVE-VALIDATION.md).

- Five matched live Expository cases were generated and reviewed against QA v0.2 **D1–D15** plus the production-defect channel.
- S86 findings on prospectus furniture, dual closure, AD-010 unsupported structured bodies, flat learner-facing hierarchy, representation behaviour, and C04 epistemic-form failure were re-tested through fresh generation.
- Structured-material publication-quality defects were repaired and validated ([S87-D10](decisions.md#s87-d10--structured-material-publication-quality)).
- Terminal authorial-close displacement was repaired and live-validated ([S87-D11](decisions.md#s87-d11--expository-terminal-closure-order)).
- Expository QA Benchmark v1.0 and Validator v1.0 were established and frozen (operator instruments for calibration; not a numerical product score programme inside PRISM).
- Bayes post-repair baseline: **88/100 — Strong** — independently Validated at **88/100**.
- An external calibration probe showed the benchmark can recognise strong professional authorship while distinguishing persuasive opinion writing from commissioned educational exposition. **The external article/author are not part of PRISM’s editorial specification.**
- Final evidence-led A/B/C refinement ([S87-D12](decisions.md#s87-d12--final-evidence-led-expository-refinement-benchmark-88100)):
  - **A** — authorised relationship semantics survive into image briefs;
  - **B** — EQ6 positively targets confident, continuous authorial explanation while preserving epistemic qualification;
  - **C** — supporting representations/materials are asked to add distinct explanatory or perceptual value rather than merely restating completed prose.
- Final Bayes benchmark after those refinements: **89/100**.
- Independent validator: **Validated with revisions**, validated score **90/100 — Professional / excellent**.
- Previous Figure 3 incorrect-connector defect **did not recur**.
- Figure 4 Moderate visual defect traced ([S87-D13](decisions.md#s87-d13--exact-match-show-fidelity-vs-anti-answer-key-conflict-figure-4)): exact numerical semantics survived through DP and the compiled brief; generic anti-answer-key / qualitative-label instructions conflicted with `requires_exact_data_match`. Narrow generic repair makes exact on-image data requirements authoritative when that flag is true and suppresses conflicting generic guidance.
- Figure 4 regression **3/3**; focused brief/S87 suites **63/63** (closure gate focused pack **96/96** including T-002…T-007 + S85 WP3).
- No further general editorial refinement is warranted by the current validation evidence.

---

## 5. Final engineering gate (T-008)

| Gate | Command / suite | Result |
| ---- | --------------- | ------ |
| First-class | `npm run test:first-class` | **339/339** pass; **0** fail; **0** skipped |
| Focused Sprint 87 acceptance pack | `node --test tests/s87-t002-*.test.js tests/s87-t003-*.test.js tests/s87-t004-*.test.js tests/s87-t005-*.test.js tests/s87-t006-*.test.js tests/s87-t007-*.test.js tests/s85-wp3-expository-sibling-prompts.test.js` | **96/96** pass; **0** fail; **0** skipped |
| Fig 4 regression (included above) | `tests/s87-t007-fig4-comparison-numerics-brief.test.js` | **3/3** |
| Browser artefact parity | `npm run check:learner-renderer-vnext-browser` | **OK** |
| Interactive protected baseline | `tests/s87-t006-cross-product-isolation.test.js` + S85 WP3 Interactive asserts | **Green** |

No production code was changed in T-008. No new warnings or debt were introduced by the gate.

---

## 6. Governance — deferred work not pulled into scope

Sprint 87 did **not** silently implement:

- full T-009 Option B / material↔visual binding programme;
- semantic H3 programme;
- font/serif programme;
- callout kit;
- new post-XM rewrite stage;
- mandatory material↔figure 1:1;
- change to 70ch reading measure;
- broad design-system programme;
- CAS/per-cell table maths;
- broad Interactive prompt generalisation;
- Research Synthesis identity;
- Expository→Interactive architecture.

These remain **deferred future capabilities**, not open Sprint 87 tasks.

---

## 7. Remaining evidenced limitations / debt (bounded)

| Item | Nature |
| ---- | ------ |
| Stochastic image realisation | Even with adequate / repaired briefs, image models can still omit authorised content; no vision-QA / retry programme added |
| S87-AD-001 | Pre-EQ1 captures need regeneration for EQ1 fields |
| S87-AD-002 | Shared VA evidence-anchor vocabulary still lists some obsolete prospectus keys — low risk |
| S87-AD-003 | Export zips archive rendered HTML, not original XM object bodies |
| Deferred T-009 Option B / fonts / H3s / etc. | Explicitly out of first-slice scope |

Repaired items (S87-AD-007…AD-013, S86-AD-010) remain recorded as **REPAIRED** in [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md).

---

## 8. PB-FA-012

**Status:** **CLOSED** (with Sprint 87).

**Rationale:** PB-FA-012 covered Expository editorial quality investigation/design (Sprint 86) and the bounded first successor implementation/validation slice (Sprint 87). Sprint 87’s documented acceptance criteria for that first slice are satisfied. Deferred capabilities listed above are **not** incomplete PB-FA-012 delivery — they were never first-slice acceptance criteria.

---

## 9. Related decisions

S87-D01…S87-D14 in [decisions.md](decisions.md).
