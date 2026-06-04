# Sprint 38-F — Notes

---

## 2026-06-04 — Sprint initiated (CHARTERED / IMPLEMENTATION)

**From:** [Sprint 38-E](../2026-06-04-sprint-38e-workbook-contract-implementation/) (**CLOSED** — [38E-11](../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-11-final-evaluation-and-sprint-closure.md)).

**Mission:** Close **V-01** (table family) and **V-05** (`scenario` Material) on Inflation while retaining 38E-8/9 workbook functions; success = **Workbook PASS** + **Preservation PASS** (reported separately).

**Hypothesis:** Explicit table-family + `scenario` Material obligations in pack §5/§6 → 38D-4 workbook PASS without preservation regression.

**Setup commit:** Pack folder and charter docs only — **no** prompt edits, **no** `app.js`, **no** pipeline run.

**Inherited blockers (38E10):** V-01 Fail (3 families, no tables) · V-05 Fail (scenario in task_cards only). **Preservation:** PASS.

**Frozen comparators:** EV-01 (38-B) · `EV-38E5-AFTER` · `EV-38E10-AFTER` (38-E artefacts — read-only).

**Next:** **38F-1** — V-01 / V-05 forensic analysis.

---

## 2026-06-04 — 38F-1 V-01 / V-05 forensic analysis complete

[38F-1](observations/38F-1-v01-v05-forensic-analysis.md): **V-01** primary break **DLA** (no `*_table` row; Table family absent — trade-off after 38E-8/9). **V-05** primary break **DLA** (`task_cards` substituted for `scenario` despite WB-18 in pack). **app.js: NO**. **Recommendation:** **C** DLA+GAM minimal deltas §7. **Next:** 38F-2.

---

## 2026-06-04 — 38F-2 Minimal DLA/GAM contract refinement complete

[38F-2](observations/38F-2-contract-refinement.md): `domain-learning-design-step-patterns.md` **§5** — DLA-WB-06a (mandatory table/reference row), WB-18 (scenario row, no task_cards-only); **§6** — GAM-WB-38F-01 (pipe tables), GAM-WB-10/F5/F6 (scenario Material). 38E-8/9 rows preserved. **Next:** 38F-3.

---

## 2026-06-04 — 38F-3 Regression prompt-surface check complete

[38F-3](observations/38F-3-regression-prompt-surface-check.md): Extended `tests/workbook-contract-prompt-surface.test.js` (+8 tests, **12/12 pass**). V-01/V-05/38E-8/9/V-13 covered. Preservation libs unchanged. **Inflation AFTER: READY.** **Next:** 38F-4.

---

## 2026-06-04 — 38F-4 Inflation re-run and scorecard complete

[38F-4](observations/38F-4-inflation-after-scorecard.md): `EV-38F-AFTER` captured (`gpt-4.1-mini`). **V-01 Pass**, **V-05 Pass**, **38E-8/9 retained**. **Workbook: FAIL** (V-10 R3 / WB-11 — 3 activities, no checklist/task_cards). **Preservation: PASS**. Case **A+**. **Next:** 38F-5.

---

## 2026-06-04 — 38F-5 Final evaluation and sprint closure — SPRINT CLOSED

[38F-5](observations/38F-5-final-evaluation-and-sprint-closure.md): Hypothesis **partially supported** (V-01/V-05 + preservation + 38E-8/9 yes; full Workbook PASS no). **Workbook FAIL** · **Preservation PASS**. Recommend **B** → **Sprint 38-G** (retrieval density). Programme conclusions: authoring-contract primary; Design Page/renderer not primary; preservation sound. **Sprint 38-F: COMPLETE / CLOSED.**

---

## 2026-06-04 — 38F-6 Retrieval validation calibration (analysis only)

[38F-6](observations/38F-6-retrieval-validation-calibration.md): Frozen `EV-38F-AFTER-design-page.json` has **no** `assessment_check` (0 formative items); 38F-4 harness = DLA→GAM→Page only. **Strict** and **learner-visible** scoring both → **Workbook FAIL** on this artefact. Validation **partially narrower** than pedagogy for hypothetical page-level MCQ ([38C-3 Q5]). Recommend **C**: calibrate 38D-4 V-10 for `assessment_check` when present **and** keep WB-11 for contract path; **hold 38-G charter** until policy + artefact alignment.

---

## 2026-06-04 — 38F-7 Retrieval definition and page-review setup

[38F-7](observations/38F-7-retrieval-definition-and-page-review-setup.md): [38C-1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) R3 = **required function** (≥2 verification episodes); material types are evidence hints. **V-10** spec is function-based; **38F-4** scorer over-constrained. Active tasks can satisfy R3 only with explicit check episodes. **38-G:** defer (**D**); next **C** page review on `EV-38F-AFTER-design-page.json`; parallel **B** validation calibration.

---

## 2026-06-04 — 38F-8 Inflation page quality review complete

[38F-8](observations/38F-8-inflation-page-quality-review.md): First-glance professional workbook **FAIL**; contract structure **PASS**. Issues: missing preambles, terse tasks, thin scenarios, inflated timings, consolidation spoiler, dropped strategy activity (vs 38E10). Retrieval fails on **missing verification beats**, not types alone. Proposed **38-G — Activity Component Quality** (not chartered). **38-F remains CLOSED** with refined handoff.
