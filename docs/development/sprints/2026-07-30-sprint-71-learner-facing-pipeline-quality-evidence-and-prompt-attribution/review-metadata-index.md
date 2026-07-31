# Sprint 71 — Review Summary Register

**Purpose:** One standardised summary row per completed Sprint 71 review for **end-of-sprint evidence synthesis only**.  
**Not** the Improvement Register — findings clusters live in [improvement-register.md](improvement-register.md).  
**Per-review detail:** `reviews/<review-id>.md`.  
**Schema / logging rule:** [review-logging-template.md](review-logging-template.md) — every closed review must append exactly one row here.

**Rules:**

- Append one complete row when a review reaches **Complete** / **Closed**.  
- Keep this schema fixed for all Sprint 71 reviews (single consolidated dataset).  
- **Do not** generate statistics, dashboards, trend analysis, or faculty comparisons in this file yet.  
- End-of-sprint synthesis (averages by faculty/subject, finding distributions, consistency across domains) will use this register later.

---

## Field definitions

| Field | Description |
| ----- | ----------- |
| Review ID | e.g. `S71-R-001` |
| Review date | Date review completed (YYYY-MM-DD) |
| Faculty | Faculty / school grouping |
| Subject | Subject area |
| Topic | Specific topic of the resource |
| Resource type | e.g. Learner Resource |
| Overall Benchmark Score | Numeric score from Benchmark v2.1 (e.g. 91/100) |
| Overall Validated Score | Numeric score from Validation Review if assigned; else `N/A` |
| Quality Band | Benchmark quality band |
| Benchmark Recommendation | Benchmark release / revision recommendation |
| Confirmed Findings | Count of Confirmed instructional findings |
| Partially Confirmed Findings | Count of Partially confirmed instructional findings |
| Rejected Findings | Count of Rejected benchmark hypotheses |
| Workflow Observations | Count of workflow observations (non-instructional) |
| Platform / UX Observations | Count of platform / UX observations (non-instructional; outstanding only — resolved historical production not counted here) |
| Review Status | e.g. Complete |
| Review file | Link to `reviews/<id>.md` |

---

## Summary register

| Review ID | Review date | Faculty | Subject | Topic | Resource type | Overall Benchmark Score | Overall Validated Score | Quality Band | Benchmark Recommendation | Confirmed Findings | Partially Confirmed Findings | Rejected Findings | Workflow Observations | Platform / UX Observations | Review Status | Review file |
| --------- | ----------- | ------- | ------- | ----- | ------------- | ----------------------- | ----------------------- | ------------ | ------------------------ | ------------------ | ---------------------------- | ----------------- | --------------------- | -------------------------- | ------------- | ----------- |
| S71-R-001 | 2026-07-30 | Life Sciences | Life Sciences | RNA Viruses / Hepatitis C Virus | Learner Resource | 91/100 | 91/100 | Excellent | Release Ready with Minor Revisions | 2 | 3 | 4 | 1 | 1 | Complete | [reviews/S71-R-001.md](reviews/S71-R-001.md) |
| S71-R-002 | 2026-07-30 | Social Sciences | Political Theory | Was Marx Right? | Learner Resource | 89.4/100 | 89.4/100 | Strong | Release Ready with Minor Revisions | 2 | 2 | 4 | 0 | 0 | Complete | [reviews/S71-R-002.md](reviews/S71-R-002.md) |
| S71-R-003 | 2026-07-30 | Humanities | History | Roman Roads | Learner Resource | 90/100 | 90/100 | Excellent | Release Ready with Minor Revisions | 1 | 3 | 4 | 0 | 0 | Complete | [reviews/S71-R-003.md](reviews/S71-R-003.md) |
| S71-R-004 | 2026-07-31 | Social Sciences | Econometrics / Statistics | Heteroscedasticity | Learner Resource | 90/100 | 90/100 | Excellent | Release Ready with Minor Revisions | 4 | 2 | 5 | 0 | 0 | Complete | [reviews/S71-R-004.md](reviews/S71-R-004.md) |
| S71-R-005 | 2026-07-31 | STEM / Mathematics | Mathematics | Introduction to Quadratic Equations | Learner Resource | 87/100 | 87/100 | Strong | Release Ready with Minor Revisions | 3 | 1 | 4 | 0 | 0 | Complete | [reviews/S71-R-005.md](reviews/S71-R-005.md) |
| S71-R-006 | 2026-07-31 | STEM / Engineering | Electrical / Electronic Engineering | Ohm’s Law and DC Circuits | Learner Resource | 90/100 | 90/100 | Excellent | Release Ready with Minor Revisions | 0 | 4 | 8 | 0 | 0 | Complete | [reviews/S71-R-006.md](reviews/S71-R-006.md) |
| S71-R-007 | 2026-07-31 | STEM / Computing | Computer Science / Programming | Recursion in JavaScript | Learner Resource | 85.3/100 | 85.3/100 | Strong | Release Ready with Minor Revisions | 2 | 2 | 4 | 0 | 1 | Complete | [reviews/S71-R-007.md](reviews/S71-R-007.md) |
| S71-R-008 | 2026-07-31 | Life Sciences | Biology | Osmosis | Learner Resource | 89/100 | 89/100 | Strong | Release Ready with Minor Revisions | 3 | 3 | 4 | 0 | 0 | Complete | [reviews/S71-R-008.md](reviews/S71-R-008.md) |
| S71-R-009 | 2026-07-31 | Humanities | History | Was Industrialisation More Beneficial or Harmful to Working People? | Learner Resource | 89/100 | 89/100 | Strong | Release Ready with Minor Revisions | 2 | 1 | 2 | 1 | 0 | Complete | [reviews/S71-R-009.md](reviews/S71-R-009.md) |
| S71-R-010 | 2026-07-31 | Humanities / Arts | English Literature | The Realities of War: Wilfred Owen | Learner Resource | 88/100 | 88/100 | Strong | Release Ready with Minor Revisions | 1 | 3 | 7 | 1 | 0 | Complete | [reviews/S71-R-010.md](reviews/S71-R-010.md) |
| S71-R-011 | 2026-07-31 | Humanities / Arts | English Literature | How does Wilfred Owen present the realities of war? | Learner Resource | 91/100 | 91/100 | Excellent | Release Ready with Minor Revisions | 1 | 0 | 0 | 1 | 0 | Complete | [reviews/S71-R-011.md](reviews/S71-R-011.md) |

---

## Notes

- S71-R-001 Overall Validated Score **91/100**: Validation supports the benchmark judgement.  
- S71-R-002 Overall Validated Score **89.4/100**: Reconstructed from validated findings; Strong / Release Ready with Minor Revisions; production issues resolved before release.  
- S71-R-003 Overall Validated Score **90/100**: Roman Roads retrospective import; renumbered from temporary R-002 after Marx occupied R-002.  
- S71-R-004 Overall Validated Score **90/100**: Heteroscedasticity retrospective import; High confidence; production defect cap none; 5 rejected benchmark findings retained in review only.  
- S71-R-005 Overall Validated Score **87/100**: Quadratic Equations; Strong / Release Ready with Minor Revisions; production `S71-O-004` discovered (later regression-verified on R-006).  
- S71-R-006 Overall Validated Score **90/100**: Ohm’s Law and DC Circuits; Excellent; moderated from unmoderated 91.2; 0 Confirmed / 4 Partial / 8 Rejected; GAM math regression passed (preliminary).  
- S71-R-007 Overall Validated Score **85.3/100**: Recursion in JavaScript; Strong; 2 Confirmed / 2 Partial / 4 Rejected; Platform/UX Observations = 1 (`S71-O-005`); new Confirmed `S71-F-014`.  
- S71-R-008 Overall Validated Score **89/100**: Osmosis; Strong; 3 Confirmed / 3 Partial / 4 Rejected-reclassified; new Confirmed `S71-F-015`; Issue 6 merged into Issue 1.  
- S71-R-009 Overall Validated Score **89/100**: Industrialisation; Strong; 2 Confirmed / 1 Partial / 2 Rejected-revised; Workflow Observations = 1 (`S71-O-006`); Issues 1+3 merged into `S71-F-001`; `S71-F-004` upgraded Confirmed.  
- S71-R-010 Overall Validated Score **88/100**: Wilfred Owen sparse control; Strong; 1 Confirmed / 3 Partial / 7 Rejected; paired with R-011.  
- S71-R-011 Overall Validated Score **91/100**: Wilfred Owen detailed intervention; Excellent; 1 Confirmed (`S71-F-001` availability); experiment closed under `S71-O-006`.  
- Do not pre-fill empty rows; append only when a review completes.
