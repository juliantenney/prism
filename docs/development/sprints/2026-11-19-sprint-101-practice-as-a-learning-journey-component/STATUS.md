# Sprint 101 — Status / work log

**Sprint:** 101 — Practice as a Learning Journey Component  
**Opened:** 2026-11-19  
**Closed:** 2026-11-20  
**Status:** **CLOSED — ACCEPTED WITH QUALIFICATIONS**  
**Opening:** [S101-D01](decisions.md#s101-d01--open-sprint-101--practice-as-a-learning-journey-component)  
**Close:** [S101-D06](decisions.md#s101-d06--close-sprint-101--accepted-with-qualifications) · [SPRINT-101-CLOSURE.md](SPRINT-101-CLOSURE.md)

| Item | State |
| ---- | ----- |
| S101-D01 Open sprint | **Accepted** |
| 101A Architectural investigation | **COMPLETE** |
| 101B Practice instructional contract | **ACCEPTED** |
| 101C Wireframe + worked example | **ACCEPTED** (foundation) |
| 101C-3 Technical capability audit | **ACCEPTED** |
| S101-D04 Technical capability audit | **Accepted** |
| 101D Implementation | **COMPLETE** |
| S101-D05 Practice v1 implementation | **Accepted** |
| 101E Validation (selection, persistence, progressive/discipline-first, export, editorial) | **COMPLETE** |
| 101F Practice workload proportion | **COMPLETE** |
| 101G Commission-native LJ feasibility | **COMPLETE** (read-only; Option C recommended, not implemented) |
| 101H Image-brief precision / completeness | **COMPLETE** |
| S101-D06 Close sprint | **Accepted** |

---

## Non-blocking follow-ups (post-close)

1. C4 A3 — three linked judgements as three independent, clearly labelled radio questions.  
2. C4 A3 — shorter, more focused written justification; remove redundant closure text.  
3. Image precision extraction — remaining duplicated/malformed fragments (required exact equations preserved).  
4. C4 image — final prompt contains all three authorised equations; corrected render **not** independently verified.  

Next programme: Learning Journey–owned outcomes and transmission through commissioning. Journey-level QA is subsequent — not Sprint 101.

---

## Work log

### 2026-11-20 — Close Sprint 101

- Closure: [SPRINT-101-CLOSURE.md](SPRINT-101-CLOSURE.md); decision [S101-D06](decisions.md#s101-d06--close-sprint-101--accepted-with-qualifications).  
- Documented Practice work through 101H; recorded non-blocking follow-ups and image-render verify gap.  
- **No regeneration. No further implementation. No commit/push.**

### 2026-11-20 — 101H Image-brief precision and completeness

- Defect: precision extraction kept generic `g(x,y)=0` / stripped nabla forms and dropped concrete equations (`x^2 + y^2 - 1 = 0`, parenthesized/unicode forms).  
- Fix: equals-neighbourhood extraction; prefer specific over generic; completeness gate when Show demands equations but only generics authorised; DP/VA authoring guidance for exact Show expressions; operand materials retained for precision when Show demands exact maths.  
- Tests: `tests/s101h-image-brief-precision-completeness.test.js` + prior precision-fidelity + Sprint 70 visual suites — **pass**.  
- Note: final image prompt can carry all three authorised C4 equations; corrected image render **not** independently verified at close.

### 2026-11-20 — 101G Commission-native LJ components (investigation)

- Read-only feasibility: EP hard-depends on structured `learning_outcomes`; LJ intake seeds prose only.  
- Recommended **Option C** (conditional five-stage when Ready).  
- Canvas: `canvases/s101g-commission-native-lj-components.canvas.tsx`.  
- **No implementation.**

### 2026-11-20 — Control-led reasoning + concise justification (Practice contracts)

- Preferred pattern in Practice DLA/GAM/EP contracts (`101G-CONTROL-LED-JUSTIFICATION-V1`): connected selection decisions + one concise independent justification; hybrid feedback.  
- Tests: `tests/s101g-practice-control-led-justification.test.js` + 101E/F regressions — **pass**.

### 2026-11-20 — 101F Practice workload proportion

- Practice-gated DLA mandates (optional checklist/transfer/bridges); closed guided-learning/workbook slot leak; proportionate GAM review.  
- Contract version lineage through `101F-PRACTICE-WORKLOAD-V1` then superseded by 101G control-led version.  
- Tests: `tests/s101f-practice-workload-proportion.test.js` — **pass**.

### 2026-11-20 — 101E Option B Practice selection controls (vertical slice)

- Recovered mid-implementation after Cursor crash/reinstall; completed renderer + contracts slice.
- Practice Do: `selection` materials render `single_select` / `multi_select` / `matching` (native radios/checkboxes/labelled selects); registry un-stubbed; beats-fallback + composition paths; determinate check + draft restore; guided review retained (`diagnostic_review` alias + string `look_for`).
- Contracts: Practice DLA/GAM repertoire updated; Interactive unchanged. Browser bundle rebuilt + check OK.
- Tests: selection suite **6/6**; discipline/progressive/Practice package/compose/browser-reg/guided-review; Assessment Pack render+persistence **30/30**.
- Doc: [101E-PRACTICE-SELECTION-CONTROLS.md](101E-PRACTICE-SELECTION-CONTROLS.md).

### 2026-11-20 — 101E IndexedDB runstate migration (complete incomplete migration)

- Root cause of incomplete migration: Sprint 75 moved capture **bodies** to IndexedDB resources; catalogue later moved to IDB; **run-state map stayed on localStorage** → C1 Step 5 `QuotaExceededError` at `localStorage_runstate`.
- Fix: `lib/prism-workflow-runstate-store.js` + `app.js` authoritative IDB save/hydrate; non-destructive LS→IDB migration; LS backup best-effort only; sessionStorage unsaved stash remains recovery-only.
- Tests: s101e runstate migration + persistence + s75 capture + updatedAt + s76 → **62/62 pass** (incl. LS quota/unavailable + regression guards).
- Doc: [101E-INDEXEDDB-RUNSTATE-MIGRATION.md](101E-INDEXEDDB-RUNSTATE-MIGRATION.md).

### 2026-11-20 — 101E Run-data persistence failure (iteration 2)

- Browser verify of iteration 1: Next gating OK, but toast false “storage full” + `storage_write_failed`, and `"generation_notes": "[object Object]"`.
- Root causes: (1) `str(generation_notes)` in `expository-contracts` coerced objects; (2) `/storage/i` quota detector matched DOMException `'Storage'` text.
- Fix: `normalizeGenerationNotes`; accurate quota detection; stage-aware toasts + console diagnostics + estimate; stash refs on failure.
- Tests: generation-notes object suite + persistence + s76 → **23/23 pass**.

### 2026-11-20 — 101E Run-data persistence failure (blocker)

- Root cause: Next advanced before async IndexedDB/runstate capture persist settled; failed write → generic toast while UI already on next step; refresh lost Step 5 (no `captureRefs`).
- Fix: await persist before advance; block advance on `persist_failed`; IDB closed-connection reopen/retry; sessionStorage unsaved backup + restore; better toast reason codes.
- Tests: `tests/s101e-run-data-persistence-failure.test.js` + s76 toast suite → **18/18 pass**.
- Doc: [101E-RUN-DATA-PERSISTENCE-FAILURE.md](101E-RUN-DATA-PERSISTENCE-FAILURE.md).

### 2026-11-20 — 101E Discipline-first Practice interactions

- Architecture audit: Practice Do supports `table_entry` (textareas), templates/math, ordering, checklist guided review; Assessment Pack owns selectable MCQ/classification/matching; response-part `single_select`/`multi_select`/`matching` stubbed unsupported.
- Limitation: prompts cannot create in-cell dropdowns; true interactive reasoning matrix needs Option B (lift assessment forms into Do) or new widgets — stopped per “no speculative architecture” rule.
- Implemented (Practice prompts only): discipline-first principle, learner-facing language (Phase 5), Check-your-work preservation notes; version `101E-PRACTICE-DISCIPLINE-FIRST-V1`.
- Tests: `tests/s101e-practice-discipline-first.test.js` + progressive suite → **8/8 pass**.
- Doc: [101E-DISCIPLINE-FIRST-INTERACTIONS.md](101E-DISCIPLINE-FIRST-INTERACTIONS.md) including bounded Option B plan.

### 2026-11-19 — 101E Progressive interaction design (Practice prompts)

- Stage-scoped Practice presentation contracts: progressive demand heuristic + supported repertoire (tables/templates/ordering/checklist/math; no invented in-cell dropdowns).  
- DLA primary; GAM fidelity; EP/LS light sequencing; DP presentation-only.  
- Tests: `tests/s101e-practice-progressive-interaction.test.js`.  
- Doc: [101E-PROGRESSIVE-INTERACTION-DESIGN.md](101E-PROGRESSIVE-INTERACTION-DESIGN.md).  

### 2026-11-19 — 101E Practice visual-planning contract integration

- **Defect:** C2 Design Page invalid `visual_affordances` → Authoring Graphics still `VPC_AFFORDANCE_ROW_INVALID`; **Graphics (1)** misleading while plan invalid.  
- **Root cause (stacked):** missing Sprint 38 injection on Practice route; Practice Copy path inherited Interactive mandatory editorial; Practice pages misclassified as Interactive for editorial; editorial brief still counted when VPC invalid.  
- **Fix:** Sprint 38 on Practice DP; Practice Copy branch; Practice editorial product; withhold Graphics briefs/count when VPC invalid; shape snippet includes VA envelope.  
- **Recovery:** Regenerate Design Page only on existing Practice workflow (do not rebuild LJ).  
- **Tests:** `tests/s101e-practice-dp-visual-affordances.test.js` (9/9) + Practice render + Sprint 38 + Slice 6A Graphics error presentation.  
- **Doc:** [101E-VISUAL-PLANNING-CONTRACT-INTEGRATION.md](101E-VISUAL-PLANNING-CONTRACT-INTEGRATION.md).  

### 2026-11-19 — 101E Practice DP visual-affordance validation failure (prompt layer)

- Initial Sprint 38 prompt-injection fix; superseded/extended by visual-planning contract integration above.  
- Earlier note: [101E-VISUAL-AFFORDANCE-VALIDATION-DEFECT.md](101E-VISUAL-AFFORDANCE-VALIDATION-DEFECT.md).

### 2026-11-19 — 101D Practice v1 implementation

- Implemented slices D0–D5: product identity, promptRoute, Practice contracts, renderer/package, LJ commissioning + workload, hardening.  
- Tests: `tests/s101-practice-product-identity-and-intake.test.js`, `tests/s101-practice-render-and-package.test.js` (14/14); Interactive WP3/WP4 regressions green.  
- Report: [101D-IMPLEMENTATION-REPORT.md](101D-IMPLEMENTATION-REPORT.md).  

### 2026-11-19 — 101C-3 Technical capability audit (accepted → 101D)

- Audit approved; 101D authorised.

### 2026-11-19 — 101C / 101B / 101A

- Wireframe and instructional contract accepted as foundations; investigation complete.
