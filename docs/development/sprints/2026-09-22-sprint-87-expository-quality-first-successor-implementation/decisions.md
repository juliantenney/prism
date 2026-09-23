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

## Acceptance notes

| Item | State |
| ---- | ----- |
| QA v0.2 | **Accepted** (S87-D02) |
| EQ1 contract | **Accepted** (S87-D03) |
| Chapter form EQ7/EQ8 + DP sections | **Accepted** (S87-D04) |
| AD-010 structured materials | **Accepted** (S87-D05) |
| T-010 restrained presentation | **Accepted** (S87-D06) |
| Engineering gate + isolation | **Accepted** (S87-D07) |
| T-011 remaining first slice | Live → T-007; closure → T-008 |
| Option B / deferred items | Out of S87 scope unless later decision |
| Interactive prompts | Protected — no edits merely for Expository |
