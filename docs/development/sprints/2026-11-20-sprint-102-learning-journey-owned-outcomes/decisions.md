# Sprint 102 — Decisions

## S102-D01 — Open Sprint 102

**Date:** 2026-11-20  
**Status:** **Accepted**  
**Depends on:** [Sprint 101 CLOSED — ACCEPTED WITH QUALIFICATIONS](../2026-11-19-sprint-101-practice-as-a-learning-journey-component/SPRINT-101-CLOSURE.md)

**Decision:** Open **Sprint 102 — Learning Journey–Owned Outcomes and Commission-Native Component Authoring**.

**Objective:** Investigate and then implement a simpler Learning Journey component-authoring workflow in which the journey owns a coherent outcome set, allocates outcomes and responsibilities to components via commissioning briefs (preferring existing text fields), and component Episode Plan consumes those outcomes as authoritative — reusing EP → DLA → GAM → LS → DP — while standalone products retain GLC → MK → DLO.

**Design principle:** The Learning Journey owns curriculum coherence; components realise their commissioned contribution.

**Phases:** 102A (investigation), then 102B–E as refined after 102A.

**Gates (at opening):** **102A required separate authorisation before execution.** Design approval gates apply before any implementation (102D). *(102A later authorised and completed — see S102-D02 / STATUS.)*

**Locked product decisions:** see [SPRINT-102-CHARTER.md](SPRINT-102-CHARTER.md).

**Not authorised by opening alone:** application/prompt/schema/validator/workflow edits; 102A investigation execution; component regeneration; journey-level QA; reopening Sprint 101; git commit/push.

**Setup outcome recorded with opening:** development pack created; programme indexes updated; [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md) left as a scoped **plan** only (superseded by 102A findings).

---

## S102-D02 — Amend Sprint 102 assumptions

**Date:** 2026-11-20  
**Status:** **Accepted**  
**Depends on:** [S102-D01](#s102-d01--open-sprint-102)

**Decision:** Amend Sprint 102 documentation assumptions before / alongside authorised 102A execution.

### Amendments

1. **Practice product status:** Practice is Learning Journey–commissioned only. Do not imply a standalone Create workflow for Practice. Preserve existing standalone foundation workflows only for products that actually support them (Interactive self-study/workshop, Expository, Assessment Pack, Situated Task as applicable).

2. **C4 Step 4 / no-KM assumption:** The C4 Step 4 experiment successfully generated a mathematically sound component using supplied structured learning outcomes **without GLC or MK**. Do **not** assume EP needs a replacement knowledge model. Do **not** introduce compensating knowledge-modelling prompts unless a concrete dependency or observed failure justifies them. Investigation is primarily about **mechanical integration**, not re-establishing pedagogical feasibility.

3. **Authority / transport / representation:**
   - **Authority:** Learning Journey defines and allocates the outcomes.
   - **Transport:** Existing commissioning text carries those outcomes.
   - **Representation:** EP may require the same outcomes in a structured format.  
   Converting authoritative commissioned outcomes into EP’s required representation must **not** silently generate or rewrite outcomes.

4. **Avoid premature architecture:** Sprint 101G *Ready / Needs enrichment / Requires full workflow* is a **candidate** mechanism only — not a required classification system. Prefer the **smallest working implementation**.

5. **102A authorisation:** 102A read-only investigation is **authorised and complete**. Findings recorded in [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md). **102B and implementation remain unauthorised.**

**Charter / debt:** [SPRINT-102-CHARTER.md](SPRINT-102-CHARTER.md), [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md) (S102-AD-004, S102-AD-008, S102-AD-009).

---

## S102-D03 — Component boundary compatibility

**Date:** 2026-11-20  
**Status:** **Accepted** (investigation finding)  
**Depends on:** [S102-D02](#s102-d02--amend-sprint-102-assumptions), [102A](INITIAL-INVESTIGATION.md)  
**Evidence:** [COMPONENT-BOUNDARY-COMPATIBILITY.md](COMPONENT-BOUNDARY-COMPATIBILITY.md)

**Decision:** The four LJ-commissionable products do **not** share a single Design Episode Plan entry boundary.

| Product | Commission-native planning entry |
| ------- | -------------------------------- |
| Interactive | Design Episode Plan |
| Practice | Design Episode Plan (same Interactive topology) |
| Expository | Expository Journey Plan (not EP) |
| Assessment Pack | Interpret Evidence Purpose (not EP) |

**Implication:** Reject a literal one-mechanism “enter at EP for all four.” Prefer a shared **pattern** (bind established DLO-shaped `learning_outcomes`, omit GLC→MK→DLO, enter product planning stage) with **product-specific entry points**. Do not invent a new outcome schema, KM stage, or mandatory readiness classifier from this check.

**Scope note:** This is a 102B **compatibility investigation** only — full 102B design/contract remains incomplete and unauthorised for implementation.

---

## S102-D04 — Commission-native authoring design

**Date:** 2026-11-20  
**Status:** **Accepted** (102C)  
**Depends on:** [S102-D02](#s102-d02--amend-sprint-102-assumptions), [S102-D03](#s102-d03--component-boundary-compatibility), [102A](INITIAL-INVESTIGATION.md)  
**Design:** [COMMISSION-NATIVE-AUTHORING-DESIGN.md](COMMISSION-NATIVE-AUTHORING-DESIGN.md)  
**Readiness:** [S102-D05](#s102-d05--implementation-readiness)

**Accepted architecture:**

1. **Journey LOs** generated at existing **Requirements** stage in established DLO `learning_outcomes` shape (delimited section + prose; no new LJ stage).  
2. **Progression** consumes those outcomes as authoritative destination.  
3. **Design Page** allocates **component** DLO-shaped outcomes into existing `specification_text` / `journey_context_text` via deterministic markers (not mere copies of journey LOs).  
4. **Shared intake bind** extracts/validates **component** LOs without LLM; seeds `commissioned_learning_outcomes` with LJ-commission provenance; omits GLC→MK→DLO when valid; else retains foundation.  
5. **Planning entry:** Interactive/Practice → EP; Expository → EJP; Assessment Pack → Purpose.  
6. **Prompts:** Preserve product EP/EJP/Purpose contracts; inject small commission-native preamble + LO embed; adapt AP DLO-specific wording when commissioned LOs bound; Expository handles absent `learning_content` without fabricating GLC/KM; no forked LJ prompt packs; no replacement KM.  
7. **Preserve** Create-from-topic, legacy commissions without markers, Practice LJ-only.

### Accepted resolutions (A1–A7)

| ID | Resolution |
| -- | ---------- |
| **A1** | Reuse DLO schema exactly; no mandatory outcome IDs / schema extension unless implementation proves need |
| **A2** | No `contributes_to` field; component LOs may be intermediate/subset/specialisation; relationships in LJ design context |
| **A3** | Journey LO authorship = Requirements (prose + delimited structured section); no new LJ stages |
| **A4** | Component LO authorship = Design Page; must reflect journey LOs, progression, role, prior, next |
| **A5** | Markers in existing `specification_text` / `journey_context_text`; extract/validate without LLM; no new commission fields unless proven necessary |
| **A6** | Product planning stages EP/EJP/Purpose; shared preamble; AP wording adapt; Expository without fabricating GLC/KM |
| **A7** | One implementation programme: LJ LO+commission → shared bind → Interactive+Practice → Expository+AP → cross-product regression |

**Not authorised by acceptance alone:** application implementation (102D); regeneration; commit/push. *(102D later authorised and implemented — see S102-D06.)*

---

## S102-D05 — Implementation readiness

**Date:** 2026-11-20  
**Status:** **Accepted**  
**Depends on:** [S102-D04](#s102-d04--commission-native-authoring-design)  
**Evidence:** [IMPLEMENTATION-READINESS.md](IMPLEMENTATION-READINESS.md)

**Verdict:** **Ready with qualifications.**

**Qualifications (not architectural reopeners):** thin extract-time per-row LO checks (Q1); Requirements marker parse / optional sibling capture without new stage (Q2); EP Copy LO embed when no DLO step (Q3); Expository absent-`learning_content` watchpoint (Q4 / S102-AD-015); AP Purpose DLO wording conditional (Q5).

**102D:** Implementation plan recorded in [IMPLEMENTATION-READINESS.md](IMPLEMENTATION-READINESS.md) §3 and [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md). **102D is not authorised** by S102-D05 — requires separate authorisation.

**No further design approvals required** unless 102D surfaces concrete code incompatibility.

---

## S102-D06 — Implement commission-native authoring (102D)

**Date:** 2026-11-20  
**Status:** **Accepted** (implementation complete; automated validation green)  
**Depends on:** [S102-D04](#s102-d04--commission-native-authoring-design), [S102-D05](#s102-d05--implementation-readiness)  
**Authorisation:** Explicit 102D begin authorisation in sprint instructions

**Decision:** Implement journey-owned outcomes and commission-native planning entry per accepted design.

**Delivered:**

1. LJ Requirements / Progression / Design Page prompt contracts for journey + component DLO-shaped markers.  
2. Shared `lib/commission-native-lo-bind.js` extract/validate/topology + intake bind in `lib/first-class-commission-intake.js`.  
3. Interactive/Practice/Expository/AP commission-native planning entry (omit foundation when bind ok).  
4. `app.js` commissioned LO resolution fallback, planning-step delivery, conditional preamble + LO embed; Expository absent-`learning_content` note; AP Purpose wording adapted.  
5. Automated tests in `tests/s102-commission-native-lo-bind.test.js` (plus related intake regressions).

**Not done by S102-D06:** Sprint close / 102E; component regeneration; commit/push; human end-to-end journey generation validation.

---

## S102-D07 — 102E runtime path fix (browser bind load + navigation)

**Date:** 2026-11-20  
**Status:** **Accepted** (fix applied; live E2E pending)  
**Depends on:** [S102-D06](#s102-d06--implement-commission-native-authoring-102d)

**Finding:** Browser never loaded `lib/commission-native-lo-bind.js`, so `intakeCommission` could not bind commissioned LOs and always retained GLC→MK→DLO for all four products. Separately, create/save handoff did not expand the parent Learning Journey before selecting the child.

**Fix:** Load bind script in `index.html` before intake; expand parent on create/save; harden fenced-JSON marker extract; stamp commissioned LO fields onto brief `initialBrief`.

**Operational:** Delete children created under the broken path and recommission after hard-refresh. Do not repair topology in place.

**Sprint 102E remains open** for live validation.
