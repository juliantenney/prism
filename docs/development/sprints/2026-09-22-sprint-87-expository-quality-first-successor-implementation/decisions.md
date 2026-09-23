# Sprint 87 — Decision Log

**Sprint status:** **IN PROGRESS** (opened 2026-09-22; T-001…T-003 complete 2026-09-23)  
**Format:** ID · Decision · Status · Rationale · Consequences  
**Predecessor:** [Sprint 86 COMPLETE / CLOSED](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/T-012-SPRINT-86-CLOSURE.md)  
**Authoritative design:** [S86 T-011](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/T-011-SUCCESSOR-IMPLEMENTATION-DESIGN.md)  
**Acceptance instrument:** [EXPOSITORY-QA-v0.2.md](EXPOSITORY-QA-v0.2.md)

---

## S87-D01 — Open Sprint 87 — Expository Quality — First Successor Implementation

- **Decision:** Open Sprint 87 as an **Implementation + validation** sprint under [PB-FA-012](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-012--expository-editorial-quality--qa) to implement and validate the **bounded first Expository quality slice** designed in Sprint 86 ([T-011](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/T-011-SUCCESSOR-IMPLEMENTATION-DESIGN.md)). Pack status at open: **READY / NOT STARTED**. First authorised substantive task: draft **Expository QA v0.2** before production coding. Do **not** reopen T-011 prioritisation. Do **not** expand into Option B / fonts / H3s / new generative stages during this sprint unless a later explicit decision says otherwise.

- **Status:** **Accepted** (2026-09-22)

- **Rationale:**
  - Sprint 86 is **COMPLETE / CLOSED**; investigation/design outputs (EQ1–EQ8, T-007–T-011, frozen C01–C05, QA v0.1) are accepted.
  - S86 deliberately carried QA v0.2 into the successor sprint acceptance process.
  - T-011 is the accepted first-slice design; opening S87 authorises that bounded implementation after T-001, not a general redesign.
  - Interactive baseline remains protected ([S83-D04](../2026-09-21-sprint-83-expository-resource-investigation/decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline)).

- **Consequences:**
  - Sprint 87 pack becomes the active programme pointer via [NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md).
  - Sprint 86 remains **COMPLETE / CLOSED**.
  - PB-FA-012 remains **open** as the active successor work item — not closed by S87 open.
  - Production coding is authorised **only after** S87-T-001 (QA v0.2) and only within the T-011 first slice.
  - No task is marked IN PROGRESS by this opening decision alone.
  - Alpha-complete programme state unchanged.

---

## S87-D02 — Accept Expository QA v0.2

- **Decision:** Accept [EXPOSITORY-QA-v0.2.md](EXPOSITORY-QA-v0.2.md) as the qualitative acceptance instrument for first-class Expository Resources from Sprint 87 onward. Mark **S87-T-001** and **WP1** complete. Authorise production coding to begin at **S87-T-002** within the T-011 first slice. Do **not** edit frozen QA v0.1. Do **not** use numerical scores.

- **Status:** **Accepted** (2026-09-23)

- **Rationale:**
  - Completes Sprint 86 WP2 carry-forward before implementation.
  - Evolves v0.1 with evidence-backed S86 corrections (purpose-fit, epistemic form, a11y ≠ redundancy, productive recurrence, interpretive closure, warrant→value→integration) while preserving qualitative judgement mechanics.
  - Grounded in EQ1–EQ8 without becoming a score rubric or ontology.

- **Consequences:**
  - S87-T-007 live validation must use QA v0.2.
  - Sprint status moves to **IN PROGRESS**.
  - Next authorised task is **S87-T-002** (not T-003+ out of order).
  - Historical C01–C05 remain interpretable via the v0.1→v0.2 mapping; do not rewrite frozen case files.

---

## S87-D03 — EQ1 EJP contract fields (commissioned_purpose + epistemic_form)

- **Decision:** Implement T-011 EQ1 as required free-text fields on Expository Journey Plan: `commissioned_purpose` and `epistemic_form`. EJP owns/authors them from the user/workflow commission (LO/GLC may clarify, must not replace). XD treats both as binding. Validate non-empty on Expository EJP shape checks. Stamp onto assembled `page.expository_journey` metadata only — **not** learner-facing orientation furniture. No closed epistemic-form enum. No Interactive prompt changes.

- **Status:** **Accepted** (2026-09-23)

- **Evidence:** `lib/expository-contracts.js` · `lib/expository-sibling-prompts.js` · `lib/page-vnext-assemble.js` · `tests/s87-t002-eq1-purpose-epistemic-form.test.js`

- **Consequences:**
  - S87-T-002 / WP2 **COMPLETE**.
  - Pre-EQ1 EJP captures fail Expository re-validation until regenerated with the two fields.
  - Next authorised task: **S87-T-003** (chapter-form). Do not begin AD-010/CSS out of order.

---

## S87-D04 — Expository chapter form (EQ7/EQ8) + DP `sections` safety

- **Decision:** For first-class Expository Resources: (1) **EQ7** — Design Page must not generate `page_synthesis.overview` / `learning_purpose` / `knowledge_summary` by default; assemble strips those fields and relocates `learning_outcomes` to `expository_journey` metadata so they are not learner orientation furniture. (2) **EQ8** — final substantive XD section owns consolidation; Design Page must not generate `closing_paragraph` by default; assemble strips it if present. (3) Expository Design Page must not own/patch top-level `sections` — authoritative exposition remains EJP/XD/XM. Shared Interactive DP ownership list retains `sections`. Renderer capability for orientation/closing retained for legacy/generic pages when fields are present.

- **Status:** **Accepted** (2026-09-23)

- **Evidence:** `lib/expository-sibling-prompts.js` · `lib/page-vnext-assemble.js` · `tests/s87-t003-expository-chapter-form.test.js`

- **Consequences:**
  - S87-T-003 / WP3 **COMPLETE**.
  - Stale DP captures with prospectus/closing furniture assemble to chapter form without those regions.
  - Next authorised task: **S87-T-004** (AD-010). Do not begin typography out of order.

---

## S87-D05 — AD-010 structured-material semantic rendering

- **Decision:** Repair S86-AD-010 by (1) preserving structured XM bodies on the learner model, (2) adding specialised accessible renderers for evidenced high-frequency shapes (sequence/`steps`·`sequence`, elements-only, tabular `columns`+`rows`, contrast pairs, equation annotations), and (3) routing all other valid object/array bodies through a generic semantic HTML fallback (headings/lists/dl/tables — never JSON dump; never the learner-facing unsupported slogan). Exact `elements[]`+`relationships[]` diagram specs remain caption-only (materials ≠ figures). Legacy `expository_structured_unsupported` without a preserved body may still emit the diagnostic note.

- **Status:** **Accepted** (2026-09-23)

- **Evidence:** C01–C05 export kinds (23× AD-010); `lib/learner-renderer-vnext/expository-structured-materials.js` (+ browser rebuild); `tests/s87-t004-ad010-structured-materials.test.js`; fixture `tests/fixtures/s87-t004-ad010-structured-bodies.json`

- **Claim boundary:** Evidenced AD-010 shapes render correctly; valid unrecognised structured bodies receive safe semantic fallback. Not a claim that every conceivable XM body has bespoke rendering. Live C01–C05 re-export validation remains T-007.

- **Consequences:**
  - S87-T-004 **COMPLETE**; WP4 remains **IN PROGRESS** until T-005.
  - S86-AD-010 **RESOLVED** in Sprint 87 implementation (pending live pressure confirmation at T-007).
  - Next authorised task: **S87-T-005** (restrained presentation). Do not begin Option B / fonts / H3s.

---

## S87-D06 — Expository-scoped T-010 presentation

- **Decision:** Implement T-010 MUST / selected low-risk SHOULD presentation for first-class Expository only via (1) deterministic `model.pageKind` / `data-page-kind="expository"` / `util-page--expository` marker from `expository_journey` or Expository `enriched_by` stages, (2) export body class `util-page-export--expository`, and (3) `getUtilityExpositoryPublishingCss()` overrides scoped under those markers. Shared Interactive visual rules (body measure, H1/H2 defaults, figure card chrome, table `min-width:34rem`, list defaults, display-maths defaults) remain unchanged. No fonts/webfonts, no H3 generation, no Option B.

- **Status:** **Accepted** (2026-09-23)

- **Evidence:** `lib/learner-renderer-vnext/build-page-model.js` · `render-page.js` · `app.js` `getUtilityExpositoryPublishingCss` · `tests/s87-t005-expository-presentation.test.js`

- **Claim boundary:** Restrained Expository publishing chrome for first-slice MUST items. Live visual QA on C01–C05 regenerations remains T-007.

- **Consequences:**
  - S87-T-005 / WP4 **COMPLETE**.
  - Next authorised task: **S87-T-006** (engineering regression gate). Do not begin live pressure cases out of order.

---

## S87-D07 — Engineering regression gate + cross-product isolation

- **Decision:** Accept the Sprint 87 engineering gate for the accumulated T-001–T-005 production diff. Authoritative first-class suite remains `npm run test:first-class` → **339/339**. Focused S87 suite (T-002–T-006) → **44/44**. Cross-product isolation audit found **no unexpected category-C Interactive behaviour/presentation changes**: shared machinery (`pageKind` defaulting, render-page attrs, CSS generator wiring, export body class) preserves Interactive semantics; Expository publishing CSS activates only under Expository markers. WP5 remains **IN PROGRESS** until live T-007 validation.

- **Status:** **Accepted** (2026-09-23)

- **Evidence:** `tests/s87-t006-cross-product-isolation.test.js` · `npm run test:first-class` · `npm run check:learner-renderer-vnext-browser` · focused S87 + S85 Expository regressions

- **Claim boundary:** Engineering isolation and regression only. Does not claim live C01–C05 editorial/visual acceptance (T-007) or sprint closure (T-008).

- **Consequences:**
  - S87-T-006 **COMPLETE**.
  - Next authorised task: **S87-T-007** (live/manual validation). Do not close Sprint 87 or PB-FA-012.

---

## S87-D08 — Expository DP capture validator: knowledge_summary not required (EQ7 live repair)

- **Decision:** `validateDesignPagePartialPageCapture` must not require `page_synthesis.knowledge_summary` or `sections[].section_id="knowledge_summary"` when `isExpositoryResourceWorkflow(wf)` is true. Interactive retains the historical requirement. Same function already did not require overview / learning_purpose / closing_paragraph. Live T-007 Bayes Design Page with `page_synthesis: {}` must validate when otherwise well-formed.

- **Status:** **Accepted** (2026-09-23)

- **Evidence:** Live Bayes workflow error string; `app.js` `validateDesignPagePartialPageCapture`; `tests/s87-t007-expository-dp-knowledge-summary-validation.test.js`

- **Claim boundary:** Capture-validation policy alignment with EQ7 only. Does not close T-007 or claim live editorial acceptance.

- **Consequences:**
  - Operator may rerun Design Page on the current Expository Bayes workflow if upstream stages remain intact.
  - T-007 remains **IN PROGRESS**.

---

## S87-D09 — EJP output envelope: prevent LO-shaped capture (C04 live repair)

- **Decision:** Treat the C04 EJP live failure as a **generation/prompt shape mismatch**, not a validator bug. The pasted/generated payload was a Define Learning Outcomes root (`learning_outcomes[]`, `learner_level`, `scope`, `alignment_notes`) validated as `expository_journey_plan`, which correctly failed `sections[]` + EQ1. Repair: (1) EJP sibling prompt Required envelope + explicit minimal JSON shape + hard “Do NOT return learning_outcomes root”; (2) `buildStrictExpositoryJourneyPlanOutputContractBlock` appended on Copy (parity with LO); (3) additive diagnostic when LO-shaped capture is validated as EJP. Do **not** weaken EQ1 or sections[] requirements.

- **Status:** **Accepted** (2026-09-23)

- **Evidence:** Live C04 payload; `lib/expository-sibling-prompts.js`; `lib/workflow-artefact-json-strict.js`; `app.js` Copy wiring; `lib/expository-contracts.js` diagnostic; `tests/s87-t007-ejp-lo-shape-mismatch.test.js`

- **Claim boundary:** Prompt/Copy contract alignment only. Does not close T-007 or claim C04 editorial acceptance.

- **Consequences:**
  - Operator may **rerun EJP** on the current C04 workflow (upstream LO remaining intact is expected).
  - T-007 remains **IN PROGRESS**.

---

## S87-D10 — Structured-material publication quality (T-007 live repair 1/2)

- **Decision:** Treat T-007 live findings of (A) blank comparison-table cells and (B) learner-facing schema/internal-ID leakage as **renderer publication-quality defects** on top of the T-004 lossless AD-010 repair — not as a prompt redesign and not as a design-system programme. Repair in `expository-structured-materials.js` only: (1) fuzzy column↔row matching + empty-matrix recovery (positional label preservation when key counts align); (2) specialised graph path (`nodes`/`edges` → learner labels + readable relationships); (3) generic fallback sanitisation that suppresses XM-MAT/COMM ids, bare snake_case machine tokens, and schema-mechanic headings (`nodes`/`edges`/`from`/`to`/`id`/`diagram_logic`/continuation fields) while preserving intellectual property headings (`patterns`/`dimensions`/etc.) and unique content. Keep specialised-when-recognised / safe-fallback-otherwise.

- **Status:** **Accepted** (2026-09-23)

- **Evidence:** Five-case live QA (C03 blank tables; C04 graph/ID leakage; C05 milder property chrome); mechanism diagnosis (`isTabularBody` true with key-mismatched `tabularColumnsAndRows`; graph bodies falling through `renderStructuredValue`/`humanizeKey`); `lib/learner-renderer-vnext/expository-structured-materials.js` + browser rebuild; fixtures `tests/fixtures/s87-t007-structured-publication-quality.json`; `tests/s87-t007-structured-publication-quality.test.js`; T-004/T-005 regressions green; `npm run check:learner-renderer-vnext-browser` OK; `npm run test:first-class` → **339/339**.

- **Claim boundary:** Publication-quality rendering for evidenced blank-table and leak classes. Does **not** close T-007; does **not** address terminal-closure defects (repair 2/2); does **not** claim every XM body has bespoke chrome.

- **Consequences:**
  - S86-AD-010 remains **RESOLVED** (lossless support confirmed under live pressure).
  - T-007 remains **IN PROGRESS** pending terminal-closure repair and remaining acceptance.
  - Interactive unchanged (Expository structured-material path only).

---

## S87-D11 — Expository terminal closure order (T-007 live repair 2/2)

- **Decision:** On Expository learner pages (`pageKind === "expository"`), render the **last** exposition section as `title → materials → section VA → exposition`, marking the exposition with `data-expository-closure="terminal"`. Earlier sections keep `title → exposition → materials → VA`. This implements EQ8’s rule that the final substantive XD section owns the single authorial close: supporting materials/figures remain in-section but must not displace terminal consolidation. Do **not** resurrect DP `closing_paragraph`, create a second close, add a new XD field, or change Interactive ordering. No new contract field is required — EQ8 already assigns consolidating ownership to final-section `exposition`; the gap was render order only.

- **Status:** **Accepted** (2026-09-23)

- **Evidence:** Live C01/C05 terminal displacement; `lib/learner-renderer-vnext/render-page.js` `renderExpositionSection` / `renderExpositionRegion`; `tests/s87-t007-terminal-closure-order.test.js`; T-003/T-004/T-005/T-007 publication + S85 assembled suites; browser rebuild/check; `npm run test:first-class` → **339/339**.

- **Claim boundary:** Deterministic final-section ordering for Expository. Does **not** close T-007 (live re-export still required); does **not** implement T-009 participation markers; does **not** alter mid-journey section pedagogy beyond preserving pre-existing earlier-section order.

- **Consequences:**
  - S87-AD-011 repaired.
  - T-007 remains **IN PROGRESS** pending targeted learner-facing re-export.
  - Interactive unchanged.

---

## S87-D12 — Final evidence-led Expository refinement (benchmark 88/100)

- **Decision:** Respond only to three findings supported by S86/S87 evidence plus the independent Bayes benchmark/validator (88/100 — Strong — Publication ready with minor editorial revision; Validated 88/100). Do **not** open a new quality programme or chase a score >90.

  **A — Semantic connector geometry:** Not a learner SVG layout bug. Diagram `elements[]`+`relationships[]` remain caption-only beside VAs (materials≠figures). Image briefs used generic “Relationships” layout guidance and truncated evidence JSON, so the image model invented connectors by spatial/index adjacency while labels/prose stayed correct. Repair: project authorised `from→to` edges (id→label resolved) into human `Relationships:` and canonical `5c. Authorised connectors`, with an explicit anti-positional rule; also honour `must_show` `A → B` phrases. Shared image-brief path — independently correct for any structured-edge figure.

  **B — Teacherly / metatextual register:** Restrained XD `Expository register (EQ6)` guidance only — importance via explanation; prefer direct transitions; preserve legitimate signposting/misconception warnings; **no** phrase blacklist.

  **C — Supporting-material explanatory value:** Strengthen XD `materials_commission` and DP visual-planning warrant language for distinct explanatory/perceptual function; accessibility semantic equivalence ≠ editorial redundancy; **no** deterministic deduplication / count caps / T-009 Option B.

- **Status:** **Accepted** (2026-09-23)

- **Evidence:** Independent Bayes QA benchmark + validator; `lib/prism-image-brief-compiler.js`; `lib/utilities-visual-jobs-workspace.js`; `lib/expository-sibling-prompts.js`; `tests/s87-t007-authorised-connector-geometry.test.js`; extended `tests/s85-wp3-expository-sibling-prompts.test.js`; focused S87 + Sprint 70 human-prompt suites; `npm run test:first-class` → **339/339**.

- **Claim boundary:** Engineering refinement only. Does **not** close T-007 or Sprint 87. Planned live check is a **single** Bayes re-export + frozen QA workflow compare against the 88/100 baseline — not score-chasing.

- **Consequences:**
  - S87-AD-012 recorded/repaired for connector geometry; prompt refinements for B/C.
  - T-007 remains open for the single post-change Bayes QA rerun.
  - Interactive pack `promptTemplate`s unchanged; shared image-brief edge projection is non-Expository-specific and correct.

---

## S87-D13 — Exact-match Show fidelity vs anti-answer-key conflict (Figure 4)

- **Decision:** Classify the post-refinement Bayes Figure 4 Moderate defect as **mixed / brief-quality (Case C)**. DP `must_show` and compiled Show/Required content already required `1% → ~15.4%`, `20% → ~81.8%`, with `90%` / `5%` held constant (`requires_exact_data_match: true`). Values were **not** lost deterministically before generation. The human brief also emitted activity-mode “no completed interpretations / answer-key diagrams” and unconditional CONCEPTUAL “use qualitative mechanism labels…”, which makes qualitative prevalence labels and blank posterior fields a reasonably likely compromise. Smallest repair: when `requires_exact_data_match` is true, require authorised Show numerics on-image, qualify qualitative-label guidance, and suppress the conflicting anti-answer-key / “do not write as completed inference” lines. Do **not** add vision QA, retries, new AI stages, or reopen EQ6 / commissioning / terminal closure / publication rendering / Fig 3 connectors.

- **Status:** **Accepted** (2026-09-23)

- **Evidence:** Package `(48)` PNG + caption; Edge IDB DP affordance `va-S5-base-rate-comparison-01`; compiled human/canonical briefs; `lib/utilities-visual-jobs-workspace.js`; `tests/s87-t007-fig4-comparison-numerics-brief.test.js`; focused brief/S87 suites **63/63**.

- **Claim boundary:** Does **not** close T-007 or Sprint 87. Does **not** require Bayes regeneration to justify the classification. Fig 3 non-recurrence and S87-D12 B/C remain accepted/frozen.

- **Consequences:**
  - S87-AD-013 recorded/repaired.
  - Shared human-prompt path only; Interactive pack templates unchanged.

---

## S87-D14 — Close Sprint 87 — Expository Quality — First Successor Implementation

- **Decision:** Close Sprint 87 as **COMPLETE / CLOSED**. Mark **S87-T-007** and **S87-T-008** complete. Mark **WP5** complete. Close backlog item **PB-FA-012**. Accept the closure record [T-008-SPRINT-87-CLOSURE.md](T-008-SPRINT-87-CLOSURE.md). Final engineering gate: `npm run test:first-class` → **339/339**; focused S87 acceptance pack → **96/96**; browser parity OK; Interactive protected baseline green. No further product changes in the closure task.

- **Status:** **Accepted** (2026-09-23)

- **Evidence:** [T-007-LIVE-VALIDATION.md](T-007-LIVE-VALIDATION.md); [T-008-SPRINT-87-CLOSURE.md](T-008-SPRINT-87-CLOSURE.md); S87-D02…D13; charter acceptance north star; first-class + focused gates above.

- **Claim boundary:** Does **not** claim Expository is perfect, defect-free, or production-ready in every context. Does **not** treat Bayes 90/100 as universal quality proof. Does **not** pull deferred Option B / fonts / H3 / rewrite / Interactive generalisation / Research Synthesis / Expository→Interactive into scope. Stochastic image realisation remains a bounded residual limitation.

- **Consequences:**
  - Sprint 87 COMPLETE / CLOSED.
  - PB-FA-012 CLOSED.
  - Programme pointer advances past Sprint 87; deferred capabilities remain backlog/future only if later authorised.

---

## Acceptance notes

| Item | State |
| ---- | ----- |
| QA v0.2 | **Accepted** (S87-D02) |
| EQ1 contract | **Accepted** (S87-D03) |
| Chapter form EQ7/EQ8 + DP sections | **Accepted** (S87-D04) |
| AD-010 structured materials | **Accepted** (S87-D05) — live confirm: AD-010 slogan gone; publication follow-ons → S87-D10 |
| T-010 restrained presentation | **Accepted** (S87-D06) |
| Engineering gate + isolation | **Accepted** (S87-D07) |
| Expository DP KS validator (EQ7 live) | **Accepted** (S87-D08) |
| EJP LO-shape / output envelope (C04 live) | **Accepted** (S87-D09) |
| Structured-material publication quality | **Accepted** (S87-D10) |
| Terminal closure order (final section) | **Accepted** (S87-D11) |
| Final evidence-led refinement (A/B/C) | **Accepted / frozen** (S87-D12) |
| Fig 4 exact-match Show fidelity (brief conflict) | **Accepted** (S87-D13) |
| Sprint 87 closure | **Accepted** (S87-D14) — COMPLETE / CLOSED |
| T-011 remaining first slice | **Delivered** via T-001…T-008 |
| Option B / deferred items | Out of S87 scope — remain deferred |
| Interactive prompts | Protected — no edits merely for Expository |
