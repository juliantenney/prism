# Sprint 87 — Architectural debt ledger

Debt / observations relevant to Sprint 87 scope. **Implementation + validation.**

**Sprint 87 is COMPLETE / CLOSED (2026-09-23).** T-001…T-008 complete. WP1–WP5 complete. PB-FA-012 **CLOSED**. Design authority: [S86 T-011](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/T-011-SUCCESSOR-IMPLEMENTATION-DESIGN.md). Closure: [T-008-SPRINT-87-CLOSURE.md](T-008-SPRINT-87-CLOSURE.md).

## Protected prior programme state

| Item | State |
| ---- | ----- |
| Alpha development | **Complete** |
| Sprint 83–85 | **CLOSED** — Expository architecture + functional delivery |
| Sprint 86 | **COMPLETE / CLOSED** — editorial quality model + first-slice design |
| First-class gate | **339/339** (closure T-008) |
| Interactive prompt family | **Protected** ([S83-D04](../2026-09-21-sprint-83-expository-resource-investigation/decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline)) |
| Production Expository | **S85 + Sprint 87 first-slice quality successor** — shipped and validated (bounded; residual limitations documented) |

## Binding (not debt)

| Source | Constraint |
| ------ | ---------- |
| S87-D01 | First slice only; QA v0.2 before coding |
| S86 T-011 | Accepted first-slice design — do not reopen prioritisation casually |
| S86 T-012 | Closed investigation conclusions |
| S83-D04 | Sibling family; do not edit Interactive prompts for Expository |

## Inherited first-slice work items (from S86 AD ledger)

| ID | Finding | S87 disposition |
| -- | ------- | --------------- |
| **S86-AD-010** | Unsupported structured-material learner fallback (23× / 5 exports) | **RESOLVED in T-004** ([S87-D05](decisions.md#s87-d05--ad-010-structured-material-semantic-rendering)) — **live T-007 confirm:** unsupported slogan gone across five fresh cases; publication-quality follow-ons recorded as S87-AD-009 / S87-AD-010 and repaired under [S87-D10](decisions.md#s87-d10--structured-material-publication-quality) |
| S86-AD-014 / EQ1 | Purpose / epistemic-form ownership | **DONE in T-002** |
| **S87-AD-001** | Pre-EQ1 EJP captures lack `commissioned_purpose` / `epistemic_form` | Re-validation / re-assemble fails until regenerated — expected |
| **S87-AD-002** | Shared VA evidence-anchor vocabulary still lists `page_synthesis.closing_paragraph` etc. | Low risk — tidy later if desired |
| S86-AD-017 | Prospectus furniture + dual close | **DONE in T-003** |
| S86-AD-019 | DP `sections` patch risk | **DONE in T-003** |
| S86-AD-021 | UI-adjacent presentation | **DONE in T-005** ([S87-D06](decisions.md#s87-d06--expository-scoped-t-010-presentation)) — Expository-scoped only; engineering-gated in T-006 |
| S86-AD-016 / AD-020 | Option B / material≠figure / soft EQ5 binding | **Out of scope** (follow-on) |
| S86-AD-008 | Research Synthesis | **Out of scope** (PB-FA-011) |
| S86-AD-009 | Expository → Interactive | **Out of scope** |

## New observations from T-004 / T-005

| ID | Finding | Notes |
| -- | ------- | ---- |
| **S87-AD-007** | Live T-007: Expository DP capture validator still required `page_synthesis.knowledge_summary` | **REPAIRED** in T-007 — `validateDesignPagePartialPageCapture` now skips KS requirement when `isExpositoryResourceWorkflow(wf)`; Interactive unchanged. |
| **S87-AD-008** | Live T-007 C04: EJP step received learning_outcomes-shaped capture; failed sections[] + EQ1 together | **REPAIRED** in T-007 — not a validator bug. Prompt lacked Required envelope / LO anti-shape; LO had Copy strict contract, EJP did not. Added EJP Required envelope + `buildStrictExpositoryJourneyPlanOutputContractBlock` wired on Copy; additive LO-shape diagnostic. EQ1 requirements remain strict. |
| **S87-AD-009** | Live T-007: blank structured comparison tables (headers + row count OK; body cells empty — C03-class) | **REPAIRED** in T-007 ([S87-D10](decisions.md#s87-d10--structured-material-publication-quality)) — `isTabularBody` accepted `columns`+`rows` while `tabularColumnsAndRows` used exact key/label match only; label/string columns vs short/snake row keys → empty cells. Fuzzy match + empty-matrix recovery (positional label preserve). Regression: `tests/fixtures/s87-t007-structured-publication-quality.json` + `tests/s87-t007-structured-publication-quality.test.js`. |
| **S87-AD-010** | Live T-007: learner-facing schema / internal-ID leakage (C04 graph Nodes/From/To/Id + XM-MAT / snake_case; milder C05 property chrome) | **REPAIRED** in T-007 ([S87-D10](decisions.md#s87-d10--structured-material-publication-quality)) — graph-like bodies fell through generic `renderStructuredValue`/`humanizeKey`; titles could equal material ids. Specialised graph renderer + fallback sanitisation (labels over machine ids; suppress schema-mechanic headings; keep intellectual categories). |
| **S87-AD-011** | Live T-007: terminal closure displacement (C01/C05) — final section consolidating XD prose followed by supporting materials/figures | **REPAIRED** in T-007 ([S87-D11](decisions.md#s87-d11--expository-terminal-closure-order)) — fixed within-section order `exposition → materials → VA` on every section including the EQ8 final section. Expository last-section reorder: materials + VA before terminal exposition. Earlier sections unchanged. No DP `closing_paragraph`. Regression: `tests/s87-t007-terminal-closure-order.test.js`. |
| **S87-AD-012** | Post-repair Bayes benchmark: figure connector geometry invents wrong relationships (labels correct) | **REPAIRED** in T-007 final refinement ([S87-D12](decisions.md#s87-d12--final-evidence-led-expository-refinement-benchmark-88100)) — image-brief authorised-edge projection + anti-positional connector rule; DP/XD prompt warrant refinements for B/C. Not a learner SVG bug. |
| **S87-AD-013** | Post-refinement Bayes Fig 4: blank posteriors + qualitative prevalence labels despite adequate Show numerics | **REPAIRED** in T-007 ([S87-D13](decisions.md#s87-d13--exact-match-show-fidelity-vs-anti-answer-key-conflict-figure-4)) — human-prompt conflict when `requires_exact_data_match` (anti-answer-key / qualitative-only) vs authorised Show numerics. Mixed/Case C; not deterministic value loss; no vision QA. |
| **S87-AD-003** | C01–C05 export zips retain rendered HTML only — original XM object bodies not archived | Reconstruction fixtures used for T-004 and T-007 publication repair; live shapes evidenced by QA observation + mechanism probes |
| **S87-AD-004** | Exact `elements[]`+`relationships[]` still caption-only beside VAs | By design (materials ≠ figures); full commission↔visual binding remains Option B / later |
| **S87-AD-005** | Dedicated reading face / serif exploration deferred | T-010 SHOULD; not implemented (no webfont programme) |
| **S87-AD-006** | Semantic H3 still absent unless upstream emits subsections | Correct — renderer must not invent H3 |

## Explicitly out of sprint

- Full T-009 Option B  
- Semantic H3 generation · font programme · callout kits  
- New AI stage / post-XM rewrite  
- Mandatory material↔figure 1:1 · changing 70ch for its own sake  
- Design-system programme · CAS / table maths  
- Interactive prompt generalisation  

New S87 observations may be added during execution; do not invent findings at pack creation.
