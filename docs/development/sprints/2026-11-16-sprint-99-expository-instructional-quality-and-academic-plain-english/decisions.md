# Sprint 99 — Decisions

## S99-D01 — Open Sprint 99 — Expository Instructional Quality and Academic Plain English

**Date:** 2026-11-16  
**Status:** Accepted  
**Depends on:** [Sprint 98 CLOSED — ACCEPTED WITH QUALIFICATIONS](../2026-11-16-sprint-98-interactive-instructional-coherence-and-academic-plain-english/SPRINT-98-CLOSURE.md) · [S98-D09](../2026-11-16-sprint-98-interactive-instructional-coherence-and-academic-plain-english/decisions.md#s98-d09--close-sprint-98--accepted-with-qualifications)  
**Numbering authority:** [docs/sprints/NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md) (Sprint 98 closed → allocate **99**)

**Decision:** Open **Sprint 99 — Expository Instructional Quality and Academic Plain English** as a bounded, evidence-led Expository instructional-quality sprint.

**Objective:** Investigate and improve the quality of standalone Expository resources against the central question: *Does the resource help a learner develop accurate, connected and usable understanding through clear explanation, well-chosen examples and appropriately demanding reasoning?*

**North star (retained):** All learning works towards better judgement, better capability, or both.

**Authoritative basis:**

- Sprint 98 closed with qualifications; Interactive path work is complete for this programme step.  
- Programme outlook schedules Expository next, then Assessment Pack (100) and Situated Task (101) as reviews-first.  
- Expository is pedagogically independent (EJP → XD → XM), not Interactive EP/DLA/GAM.

**Agreed guardrails locked by opening:** see [SPRINT-99-CHARTER.md](SPRINT-99-CHARTER.md).

**Not authorised by opening alone:**

- Any Sprint 99 code, prompt, schema or renderer changes;  
- Resource generation by the agent;  
- Modification of Assessment Pack or Situated Task;  
- Imposing Interactive attempt-before-scaffold on Expository;  
- Moving Knowledge Summary after exposition;  
- Arbitrary word limits;  
- Git commit / push;  
- Reopening Sprint 97 or 98.

**First deliverable:** Documentation pack + [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md) (read-only M0).

**Predecessor:** Sprint 98 remains **CLOSED — ACCEPTED WITH QUALIFICATIONS**. Do not reopen.

---

## S99-D02 — Accept M1 — provisional educational evaluation of three Expository resources

**Date:** 2026-11-16  
**Status:** Accepted (provisional)  
**Depends on:** [S99-D01](#s99-d01--open-sprint-99--expository-instructional-quality-and-academic-plain-english)

**Decision:** Accept **M1** as provisionally complete for educational evaluation purposes.

**Cases reviewed (learner exports):**

1. *From gradients to equations* — mathematical derivation and conceptual explanation.  
2. *What makes a claim true?* — philosophical distinctions via fictional investigation.  
3. *What Changed, and Why It Matters* — reflection on revision, evidence and evaluative judgement.

**Judgement:** Provisional educational quality is **positive**. Coherent progression, disciplinary precision and meaningful development of understanding are observed. **No evidence currently supports a broad Expository redesign.**

**Limits:**

- Evaluation used learner HTML ZIPs; assembled page JSON for these three runs was not deposited in the workspace.  
- Regeneration variability remains; these are current-output evidence, not a controlled A/B.  
- Does **not** claim all editorial or artefact-integrity issues are absent (see M2).  
- Does **not** authorise code changes by itself.

---

## S99-D03 — Accept M2 investigation findings and propose M3 scope

**Date:** 2026-11-16  
**Status:** Accepted (investigation only)  
**Depends on:** [S99-D02](#s99-d02--accept-m1--provisional-educational-evaluation-of-three-expository-resources)  
**Detail:** [M2-INVESTIGATION.md](M2-INVESTIGATION.md)

**Decision:** Accept the focused M2 read-only investigation findings and the proposed **M3** implementation scope for author review. **Do not implement M3 until separately authorised.**

**Accepted classifications:**

| Class | Items |
| ----- | ----- |
| Confirmed defect | XD (and related EJP) `str` coercion → `"[object Object]"` on structured list items |
| Confirmed editorial guidance gap | Academic Plain English does not reach Expository prose stages |
| Educational concern / further evidence | Effort vs reading-only extent; some XD/XM near-duplication |
| Acceptable existing behaviour | Explanation-first Expository; invitations not rendered; provisional M1 quality |
| Separate architectural debt | EQF step targeting excludes EJP/XD/XM; EJP list coercion class |

**Proposed M3 order:** (1) string-list coercion fix; (2) Expository-specific APE guidance; (3) optional complementarity reinforcement; (4) optional extent/effort clarification.

**Not authorised:** code implementation; resource regeneration; renderer redesign; Assessment Pack / Situated Task changes; new schemas; commit / push; sprint closure.

---

## S99-D04 — Implement M3-1 and M3-2 only

**Date:** 2026-11-16  
**Status:** Accepted (implemented — not closed)  
**Depends on:** [S99-D03](#s99-d03--accept-m2-investigation-findings-and-propose-m3-scope)

**Decision:** Authorise and implement **M3-1** (structured-field coercion fix) and **M3-2** (Expository Academic Plain English) only. **Do not** implement M3-3 or M3-4 in this step.

### M3-1 delivered

- `lib/expository-contracts.js`: `normalizePlanningStringListItem` / `normalizePlanningStringList` extract first supported string-bearing key from objects; preserve strings; drop malformed / `"[object Object]"` literals; never concatenate object properties.
- Applied to XD `invitations_to_think` / `continuity_hooks` and EJP `dependencies` / `lo_refs` / `elaboration_intentions` / `representation_needs` / `connections`.
- XD fence guidance now asks for plain strings (not nested objects) for invitations/hooks.
- Renderer display behaviour unchanged (invitations still not surfaced).
- Tests: `tests/s99-expository-string-list-coercion.test.js`

### M3-2 delivered

- `lib/expository-sibling-prompts.js`: Expository APE block (`ACADEMIC PLAIN ENGLISH (Expository generation)`) embedded in GLC, XD and XM.
- Uses Sprint 98 definition; no Interactive layer purposes / attempt-before / word limits; cross-references S98-D08.
- EJP/DP intentionally omit the block to avoid unnecessary repetition.
- Tests: `tests/s99-expository-academic-plain-english.test.js` (+ existing Interactive APE route tests still green)

### Explicitly not done

- M3-3 complementarity reinforcement; M3-4 extent/effort clarification  
- Renderer redesign; invitation UI; Assessment Pack / Situated Task  
- Resource regeneration; commit / push; Sprint 99 closure

**Ambiguity retained:** Exact live object shapes for invitations on the three M1 cases remain unverified without assembled JSON in the workspace; extraction keys cover documented/probable producer fields (`text`, `prompt`, `invitation`, `hook`, `to`, …).

---

## S99-D05 — Close Sprint 99 — ACCEPTED WITH QUALIFICATIONS

**Date:** 2026-11-16  
**Status:** Accepted  
**Depends on:** [S99-D04](#s99-d04--implement-m3-1-and-m3-2-only) · [SPRINT-99-CLOSURE.md](SPRINT-99-CLOSURE.md)

**Decision:** Close **Sprint 99 — Expository Instructional Quality and Academic Plain English** as **CLOSED — ACCEPTED WITH QUALIFICATIONS**.

**Accepted:** M0 pipeline map; M1 three-resource educational evaluation; M2 investigation; M3-1 coercion fix; M3-2 Expository APE; M4 normal regeneration review (assembled JSON + learner export); focused tests 44/0; broader 79/4 with known baselines only.

**Qualifications:** original object-shaped XD payloads unrecovered for exact-shape verification; effort estimates may underrepresent engagement; some exposition/XM duplication remains acceptable/monitoring; **M3-3 and M3-4 deferred — not implemented**.

**Programme carry:** Interactive Learning Sequence study-flow fidelity residual recorded as governance [D-015](../../../governance/ARCHITECTURAL-DEBT.md#d-015--interactive-learning-sequence-study-flow-fidelity) (S98 M5 Option C; S98-AD-004; S99-AD-012). **Do not reopen Sprint 98.**

**Does not claim** all Expository editorial issues eliminated.  
**Does not authorise** commit/push as part of this close.  
**Successor (planned at close, not opened):** Sprint 100 — Assessment Pack Instructional Quality (review-first).

**Post-close programme note (2026-11-16):** Assessment Pack four-case quality review **accepted without substantive implementation**; Sprint 100 stub **superseded**. Situated Task **not separately evaluated** this phase. Next activity: Interactive + Expository corpus regeneration ([NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md)). Qualifications and deferred M3-3/M3-4 above **unchanged**. D-015 **unchanged**.
