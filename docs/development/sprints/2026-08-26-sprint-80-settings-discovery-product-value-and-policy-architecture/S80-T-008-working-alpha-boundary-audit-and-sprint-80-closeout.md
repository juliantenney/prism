# S80-T-008 — Working-alpha boundary audit and Sprint 80 closeout

**Status:** COMPLETE — ACCEPTED (operator closeout 2026-08-28)  
**Date:** 2026-08-28  
**Mode:** DISCOVERY ONLY — no implementation  
**Authority:** operator request for Sprint 80 closeout / working-alpha boundary audit after substantive implementation through [S80-S8](S80-S8-assessment-adjustments-quantity-difficulty.md)  
**Operator closeout (2026-08-28):** WORKING ALPHA accepted; Sprint 80 **CLOSED**; S5–S8 **ACCEPTED**; next engineering = D-014; next product programme after that = learner-page accessibility  
**Predecessors:** T-006 (Option C), T-007 (architecture), S1–S8 (implementation), T-009…T-012 (diagnostics)

---

## 1. Executive conclusion

**Product claim: A — WORKING ALPHA** for the first-class self-study and workshop paths.

A normal user can Create → Save → Adjust (governed parameters) → Run/Copy stage prompts → capture artefacts → assemble and render a usable learner resource, including optional CAI formative assessment with governed Number of items and Difficulty.

Remaining issues are **limitations and debt**, not failures of the supported alpha claim.

**Sprint 80 closeout: CLOSE SPRINT 80.**

No remaining issue is caused by, or inseparable from, the Sprint 80 Adjustments architecture in a way that should keep this sprint open. Cleanup, WCAG, learner-workspace redesign, DA honesty (D25–D27), D2 cognition bypass, and Question Type are **post-alpha / separate** work.

---

## 2. Scope

| In scope | Out of scope |
| -------- | ------------ |
| First-class **self-study** and **workshop** LD journeys | Arbitrary/custom workflow completeness |
| Create → Save → Adjust → Run → learner artefact | Feature invention / new Adjustments |
| Governed Adjustments truthfulness (S1–S8) | Implementing fixes |
| Modest assessment claim (CAI-first; MCQ default) | DA prerequisite; full QT matrix; WCAG remediation |
| Debt triage for alpha-blocker standard | Settings spaghetti cleanup |

Working-alpha definition used: §1 of the operator brief (usable first-class journey; debt allowed).

---

## 3. Create → workflow

### Evidence

- Topology / commissioning tests: `workflow-ld-rna-sparse-brief-topology`, `workflow-ld-cognition-topology`, `workflow-ld-assessment-item-count`, `workflow-ld-assessment-semantics-*`, T-011 CAI-first findings.
- Ordinary formative self-study with item count → **CAI without DA** (T-011 ACCEPTED).
- Self-study vs workshop distinguished primarily by `delivery_context` / facilitated vs self-directed scaffolds (T-005B.2 live factors), not by requiring different Adjustments architecture.

### Representative commissioning

| Path | Usable saved workflow? | Notes |
| ---- | ---------------------- | ----- |
| **A. Self-study** | **Yes** | Brief → Goal/Topic/Audience/Duration factors → LD stages (MK/LO/EP/DLA/GAM/LS/DP ± CAI). |
| **B. Workshop** | **Yes** | Same Create machinery; facilitated delivery / workshop wording steers scaffolds and materials; CAI available when assessment requested. |

| Concern | Classification |
| -------- | -------------- |
| Create can fail to include CAI when assessment not requested | Expected — not a defect |
| DA rare / blueprint keep broken (D25–D26) | **NON_BLOCKING_DEBT** for alpha (CAI-first claim) |
| Audience can influence Create inference blob (D18) | **SIGNIFICANT_ALPHA_LIMITATION** for Create honesty; does not prevent reaching a usable workflow |
| Learner-level vocab unused at Run (D14) | **DEFERRED_PRODUCT_WORK** |
| Goal Create hint still overwritten by domain UI copy | **NON_BLOCKING_DEBT** (pre-existing; Audience fixed at S7) |

**No ALPHA_BLOCKER found that prevents a normal user from reaching a usable saved first-class workflow.**

---

## 4. Saved workflow / reuse

| Capability | Alpha-sufficient? | Evidence |
| ---------- | ----------------- | -------- |
| Save / load / reopen | **Yes** | S1 `normalizeWorkflowForV1` + gather carry `adjustments`; S5–S8 persistence tests |
| Duplicate / export shape | **Yes** | JSON round-trip tests (S2/S5/S7/S8) |
| Adjustments persistence | **Yes** | `workflow.adjustments.parameters.*`; blank = Auto; clear deletes key |
| Per-step Additional Instruction | **Yes** | S3/S4; EP included |
| Governed set survives reuse | **Yes** | Topic, Goal, Duration, Audience always; Number of items + Difficulty when CAI present |

Governed runtime authorities (current):

`topic`, `goal`, `duration_minutes`, `audience`, `assessment_item_count`, `assessment_difficulty_profile` (last two capability-gated).

Legacy workflows without `workflowBriefResolution` use documented narrow fallbacks (Goal/Audience S5/S7). **Not** an alpha blocker for realistic new Create→Save use.

---

## 5. Adjustments product truthfulness

| Check | Verdict |
| ----- | ------- |
| Only live governed contracts exposed | **Pass** — allowlisted registry; QT / learner level absent |
| Auto / commissioned / clear | **Pass** — S2/S5–S8 vertical proofs |
| Frozen Create commissioning sources | **Pass** — initialBrief / resolvedFactors / gated legacy |
| CAI controls only when CAI exists | **Pass** — `generate_assessment_items` fail-closed (S8) |
| Additional Instruction subordinate | **Pass** — structural block after typed params |
| Instructions (`step.notes`) distinct | **Pass** — S4 product decision |
| Historical Settings catalogue not presented as live | **Pass** — S4 removes from active UI; tab labelled **Adjustments** (`index.html`) |

### Misleading copy (alpha-relevant)

| Item | Severity |
| ---- | -------- |
| Create Goal helper can still read like an editable field (domain hint overwrite) while Edit Goal is read-only commissioning | **NON_BLOCKING_DEBT** — Adjustments Goal is the runtime authority; confusing but not journey-breaking |
| Assessment Quantity remains model-instructional (no count validator) | **SIGNIFICANT_ALPHA_LIMITATION** — accepted at T-012/S8; claim must stay modest |
| Topic projection line budget comment in STATUS still says ≤5 lines; CAI workflows now add Quantity/Difficulty lines | **NON_BLOCKING_DEBT** (docs drift; not product falsehood) |

No active UI re-exposes the historical pack Settings catalogue as supported.

---

## 6. Run / prompt authority

Hierarchy (accepted S5–S8):

> hard contracts/schemas > typed workflowContext parameters > Goal > Additional Instruction > stage discretion

| Stage | Typed params | Additional Instruction | Notes |
| ----- | ------------ | ---------------------- | ----- |
| Learning Outcomes / MK / DLA / GAM / LS / DP / CAI | Yes (eligible steps) | Yes | Shared projector + S3 block |
| Episode Plan | **No** typed projection (derived shell) | **Yes** | Intentional S2/S4 split — not a contradiction |
| Run AI inside PRISM | **None** | — | Copy/assemble only |

Contradictions that would make **normal** execution unreliable: **none found** in the governed path. Accepted architecture intentionally excludes EP from typed projection; do not reopen.

Remaining inert historical CAI options (D28 remainder) do not compete with Quantity/Difficulty once Adjustments project them.

---

## 7. End-to-end resource production

| Path | Evidence-based assessment |
| ---- | ------------------------- |
| **A. Self-study without assessment** | **Supported.** Topology + page shell + DLA/GAM/LS/DP tests; self-directed scaffolds live (`delivery_context`). |
| **B. Self-study with CAI** | **Supported.** CAI without DA (T-011); assessment partial capture validators; page assemble fixtures; renderer assessment_check tests. |
| **C. Workshop without assessment** | **Supported.** Facilitated/workshop briefs in topology/cognition suites; same page pipeline. |
| **D. Workshop with CAI** | **Supported as normal path when assessment requested.** Same CAI capability gate; not DA-dependent. |

Checks:

| Check | Verdict |
| ----- | ------- |
| Stage artefacts capturable | Yes (strict/partial validators) |
| Downstream receive required inputs | Yes for first-class chain (accepted DLA/GAM/PEL architecture) |
| Page assembly | Yes (v2 partial page path) |
| Learner renderer consumes artefact | Yes (vNext assessment + page render suites/fixtures) |
| Duration coherent | Yes post-S6 (constraint → DLA band; LS allocates; renderer copies) |
| Assessment reaches learner resource | Yes for default MCQ `assessment_check` path |

Design Assessment **not** required.

---

## 8. Learner experience (alpha bar only)

| Risk | Alpha status |
| ---- | ------------ |
| Resource cannot render | Not indicated for first-class fixtures |
| Primary activities unusable | Not indicated |
| Navigation fundamentally broken | Not indicated |
| Default interactive assessment unusable | **No** — single-answer MCQ interactive path exists (`assessment-interactive.js`); renderer tests cover assessment_check |
| Diagnostic feedback path fails for default MCQ | **No** — correct answer + rationale path present for supported types |
| Multi-answer / short answer / essay interactive | **Out of claim** (D30; deferred QT) |

WCAG / learner-workspace redesign: **post-alpha**, unless a specific practical-unusable defect is filed later — none elevated here.

---

## 9. Assessment boundary (accepted)

| Claim | Status |
| ----- | ------ |
| Assessment optional at Create | True |
| CAI normal generation stage | True (T-011) |
| Number of items + Difficulty governed | True (S8) |
| Default interactive: single-answer MCQ | True |
| True/false supported but not Adjustment | True |
| Question Type deferred | True |
| Short answer / essay / multi-answer not required | True |
| DA not required | True |

D25–D31: **not** alpha blockers under this claim (see §10).

---

## 10. Known debt triage

| ID | Summary | Classification |
| -- | ------- | -------------- |
| **D2** | Canonical DLA cognition block bypassed on live path | **POST_ALPHA_HIGH** — pedagogy quality; does not stop Create→render |
| **D3** | Dead LS duration step-param route | **RETIREMENT/CLEANUP_CANDIDATE** — S6 routed around it |
| **D14** | Learner-level vocabulary / reach | **DEFERRED_PRODUCT_DECISION** |
| **D18** | Audience in Create inference blob | **POST_ALPHA_NORMAL** (Create honesty) |
| **D20** | First-token `learner_level` from blob | **POST_ALPHA_NORMAL** |
| **D22** | Canonical exemplar `"Learners"` | **POST_ALPHA_NORMAL** — retained by design at S7 |
| **D24** | Audience factor pack asymmetry | **POST_ALPHA_NORMAL** — consequence fixed at S7 |
| **D25–D27** | DA topology / blueprint honesty | **POST_ALPHA_NORMAL** for first-class claim; product-value only if DA returns |
| **D28** (remainder) | Other CAI userOptions still inert | **RETIREMENT/CLEANUP_CANDIDATE** / optional later Adjustments |
| **D29** | Create difficulty elicitation wording mismatch | **POST_ALPHA_NORMAL** |
| **D30** | Multi-answer MCQ renderer gap | **DEFERRED_PRODUCT_DECISION** (blocks QT expansion) |
| **D31** | `normalizeAssessmentItemCount` unclamped | **POST_ALPHA_NORMAL** — Adjustments clamps separately |
| **D-014** | ~393 full-suite failing locations / order instability | **POST_ALPHA_HIGH** for engineering confidence; not a product journey blocker |
| Historical Settings/factor code | Retained inert under Adjustments | **RETIREMENT/CLEANUP_CANDIDATE** |

**No ALPHA_BLOCKER** identified in this set against the §13 standard.

---

## 11. Historical Settings machinery

**Can the first-class product operate coherently while this remains isolated/inert?**

**Yes.** Active Adjustments UI does not render the pack catalogue (S4). Governed authorities do not read `selectedOptions` / `PRISM_STEP_PARAMS` for Topic/Goal/Duration/Audience/Quantity/Difficulty.

Competing live authorities fixed in Sprint 80: Goal (D4), Audience (D13), Duration timing prose (D1). Remaining competition is Create-time inference quirks (D18/D20), not Run Adjustments.

Cleanup = **post-alpha technical debt**.

---

## 12. Test health

| Evidence | Result |
| -------- | ------ |
| Focused Sprint 80 S1–S8 | **229/229** (reconfirmed 2026-08-28) |
| S8 alone | **27/27** |
| Full suite failing locations post-S8 | **393** |
| S8 new failing locations vs post-S7 baseline | **ZERO** |
| D-014 meaning | Absolute fail count is **not** a green-suite claim; confidence rests on focused verticals + “no new failing locations” |
| Governed-path protection | Strong for Adjustments projection, capability gate, Auto/adjust/clear, precedence, persistence |

Do **not** claim the full suite is green.

---

## 13. Representative alpha journeys

| Journey | Verdict | Blocks alpha? |
| ------- | ------- | ------------- |
| **A.** Create 60-min self-study → save → run → assemble/render | **PASS** | — |
| **B.** Reuse with Topic/Goal/Duration/Audience change, no topology recompile | **PASS** | EP does not receive typed params (limit, intentional) — **no** |
| **C.** Additional Instruction steers LO/EP/downstream | **PASS** | — |
| **D.** Assessment-capable + adjust items/difficulty → supported learner assessment | **PASS WITH LIMITATIONS** | Count is prompt-best-effort; MCQ default only — **no** under modest claim |
| **E.** Workshop first-class path | **PASS** | Workshop-specific UX polish remaining — **no** |

---

## 14. Product claim (choose one)

### **A. WORKING ALPHA**

Core first-class journeys function. Remaining issues are limitations/debt.

Not chosen merely because tests pass: judgement is against Create→Save→Adjust→Run→learner evidence and the accepted assessment boundary.

---

## 15. Sprint 80 closeout (choose one)

### **CLOSE SPRINT 80**

Keep-open test from the brief: *only* for an issue caused by or inseparable from the Sprint 80 governed Adjustments architecture.

No such alpha blocker remains. S5–S8 await operator *review* as acceptance hygiene, but that is not a reason to keep the sprint open for more implementation. T-008 (this record) is the discovery closeout gate.

Recommended operator actions after close:

1. Mark S5–S8 **ACCEPTED** if review agrees (docs status only).
2. Mark Sprint 80 **CLOSED**.
3. Open a new sprint/backlog for the post-alpha queue below.

---

## 16. Post-alpha queue (short, ordered)

Ordered by product/risk value, not debt age:

1. **Engineering confidence:** reduce D-014 / stabilize focused CI signal for first-class suites (so alpha doesn’t erode unseen).
2. **Bounded Settings/factor retirement:** delete or quarantine inert catalogue/UI paths still confusing maintainers (S4 left code retained).
3. **D2 cognition bypass:** restore intended DLA cognition injection on the live canonical path (pedagogy quality).
4. **Learner workspace / surface-family work** (deferred product design sprint) — only when alpha users need multi-surface authoring, not before.
5. **WCAG learner-page audit** — compliance track; not an alpha gate.
6. **Assessment increments only if product value warrants:** narrowed Question Type (**C′**), then D30 if multi-select is claimed; DA (D25–D27) only if blueprint design returns as a first-class product.

Do **not** open a giant backlog from D14–D31 by default.

---

## 17. Evidence inspected

- STATUS, HANDOVER, ARCHITECTURAL-DEBT, S80-S1…S8, T-006/T-007, T-009…T-012
- `index.html` Adjustments labelling; `app.js` Adjustments panel + capability resolver + projection
- Focused S80 test run (229/229)
- Prior full-suite baseline from S8 record (4014 tests / 393 failing locations / zero new)
- Topology / assessment / renderer test names and fixtures cited above
- T-005B.2 factor effectiveness matrix (D2/D3 context)

**Probes/tests run this task:** focused S80 S1–S8 suite only. No new production probes required beyond existing vertical evidence.

---

## 18. Files changed

Documentation / pointers only:

- This record (`S80-T-008-…md`)
- `STATUS.md`, `SPRINT-80-START-HERE.md`, `next-chat-briefing.md`, `HANDOVER.md`

**No production code changes.**

---

## 19. Acceptance assessment

| Criterion | Met? |
| --------- | ---- |
| Discovery/review only | Yes |
| First-class boundary only | Yes |
| Alpha vs debt distinction strict | Yes |
| Debt triage without fixes | Yes |
| Single product claim + closeout verdict | Yes |
| Short post-alpha queue | Yes |
| No implementation / no QT / no DA / no WCAG / no Settings cleanup | Yes |

---

## 20. Exact recommended next action

**Operator (done 2026-08-28):** accepted **WORKING ALPHA** + **CLOSE SPRINT 80**; marked S5–S8 and T-008 **ACCEPTED**.

**Next (outside Sprint 80):** bounded **D-014** investigation, then **learner-page accessibility** as the next substantive product programme.
