# Sprint 93 — Decisions

## S93-D01 — Open Sprint 93 — Assessment Pack Educational Contract

**Date:** 2026-10-07  
**Status:** Accepted

**Decision:** Open **Sprint 93 — Assessment Pack Educational Contract** as a bounded **product-discovery / educational-architecture** sprint.

**Objective:** Discover what Assessment Pack must be responsible for at meaningful stopping points within substantial Learning Journeys — and where that responsibility stops — using the evidence-led method established through Learning Journey and Sprint 92. Do **not** implement new Assessment Pack features until later gates authorise it.

**Authoritative basis:**

- [PB-FA-017](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-017--assessment-pack-first-class-product-revisit)
- Sprint 92 method precedent ([SPRINT-92-CLOSURE.md](../2026-10-07-sprint-92-situated-learning-activity-first-class-product/SPRINT-92-CLOSURE.md))
- Existing Assessment Pack implementation (Sprint 88 architecture) as capability evidence / migration constraint — **not** as the mature product specification
- Sprint 92 educational-handoff finding (dependencies without learner-state interoperability)

**Hard invariant:** Assessment Pack in PRISM is **NON-SUMMATIVE**. Summative assessment, grading, certification, high-stakes workflows, and institutional assessment-management concerns are out of scope and must not be investigated as future stretch goals in this sprint.

**Not authorised by opening alone:**

- Assessment Pack feature implementation, schema changes, new widgets, renderer/publish redesign;
- Learning Journey evidence experiments (Gate 2) before Gate 1 review;
- Final Assessment Pack definition, pipeline, taxonomy, or persistence decisions;
- Cross-product learner-state transport;
- Reopening Sprint 88, 91, or 92.

**First deliverable:** Gate 1 — Current Assessment Pack baseline ([GATE-1-ASSESSMENT-PACK-BASELINE.md](GATE-1-ASSESSMENT-PACK-BASELINE.md)). Stop for review before Gate 2.

**Predecessor:** Sprint 92 remains **COMPLETE / CLOSED**.

---

## S93-D02 — Authorise Gate 2 — Long-journey evidence (protocol + briefs)

**Date:** 2026-10-07  
**Status:** Accepted  
**Depends on:** Gate 1 accepted; [S93-D01](decisions.md#s93-d01--open-sprint-93--assessment-pack-educational-contract)

**Decision:** Authorise **Gate 2 — Long-journey evidence** as evidence collection only.

**Authorised:**

- Gate 2 protocol and capture fields ([GATE-2-LONG-JOURNEY-EVIDENCE.md](GATE-2-LONG-JOURNEY-EVIDENCE.md));
- empty evidence ledger ([GATE-2-EVIDENCE-LEDGER.md](GATE-2-EVIDENCE-LEDGER.md));
- drafting three contrasting Learning Journey briefs (Cases A/B/C) for human review before any live run.

**Not authorised by this decision alone:**

- running the three journeys until the proposed briefs are reviewed and approved;
- modifying Learning Journey or Assessment Pack prompts;
- production code, schema, widget, pipeline, or taxonomy changes;
- Gate 3+ interpretation as completed product decisions.

**Production code remains frozen.**

---

## S93-D03 — Gate 2 Long-journey evidence COMPLETE / PASSED

**Date:** 2026-10-07  
**Status:** Accepted  
**Depends on:** [S93-D02](decisions.md#s93-d02--authorise-gate-2--long-journey-evidence-protocol--briefs); Gate 1 accepted

**Decision:** Mark **Gate 2 — Long-journey evidence** **COMPLETE / PASSED**.

**Basis:** Three approved briefs (A/B/C) were run live through Learning Journey Design Page without child workflows, Assessment Pack child runs, or prompt/code changes. Assessment Pack commissions and boundary cases are recorded in [GATE-2-EVIDENCE-LEDGER.md](GATE-2-EVIDENCE-LEDGER.md) and summarised in [GATE-2-LONG-JOURNEY-EVIDENCE.md](GATE-2-LONG-JOURNEY-EVIDENCE.md). Cross-case findings 1–10 are recorded as **evidence**, not final architecture. Current-pack fulfilment: no Assessment Pack commission in the set can be fulfilled faithfully by the Gate 1 closed-form implementation without changing the educational job.

**Authorised next:** Gate 3 — Educational roles (interpretation of this evidence).  

**Still not authorised:** final Assessment Pack definition; response-type taxonomy; schema; pipeline redesign; AI feedback mechanics; production code changes; product-family definition changes.

---

## S93-D04 — Gate 3 Assessment Pack educational roles COMPLETE / PASSED

**Date:** 2026-10-07  
**Status:** Accepted  
**Depends on:** [S93-D03](decisions.md#s93-d03--gate-2-long-journey-evidence-complete--passed)

**Decision:** Mark **Gate 3 — Assessment Pack educational roles** **COMPLETE / PASSED**.

**Role model accepted as Gate 3 educational architecture (not schema):**

1. **R1 — Formative state inspection** — deliberate progression stop to make present knowledge/understanding/beliefs/confidence/readiness inspectable for formative orientation of subsequent learning (includes Gate 1 `pretest_diagnostic` territory).
2. **R2 — Formative capability-evidence elicitation** — deliberate progression stop to elicit interpretable evidence of a learner capability for formative use (includes Gate 1 `formative_check` and Gate 2 integrated/constructed commissions).

**Defining concept:** Assessment Pack creates a deliberate progression stopping point whose centre of gravity is eliciting interpretable evidence about the learner and using it formatively — not developing capability through engagement (Interactive) and not authentic situated doing as the learning vehicle (Situated Task).

**Dimensions kept separate:** educational role × response/performance form × formative treatment. Forms and treatments are **not** enumerated in this decision.

**Runtime boundary recorded:** client-side HTML/CSS/JS only; no runtime LLM; constructed responses without deterministic check must rely on authored self-evaluation supports (mechanisms not designed here). Educational completeness must not depend on future conversational AI.

**Authoritative write-up:** [GATE-3-ASSESSMENT-PACK-EDUCATIONAL-ROLES.md](GATE-3-ASSESSMENT-PACK-EDUCATIONAL-ROLES.md).

**Authorised next:** Gate 4 — Product boundary.

**Still not authorised:** response-type enums; feedback-mode enums; schema; pipeline redesign; prompts; rendering/persistence/publishing changes; production code.

---

## S93-D05 — Gate 4 Assessment Pack product boundary COMPLETE / PASSED

**Date:** 2026-10-07  
**Status:** Accepted  
**Depends on:** [S93-D04](decisions.md#s93-d04--gate-3-assessment-pack-educational-roles-complete--passed)

**Decision:** Mark **Gate 4 — Assessment Pack product boundary** **COMPLETE / PASSED**.

**Operational definition:** Assessment Pack creates a deliberate progression stopping point whose centre of gravity is eliciting interpretable formative evidence about the learner (R1 state inspection and/or R2 capability-evidence elicitation).

**Single discriminator:** Principal educational job = inspectable formative evidence about the learner → Assessment Pack; develop through consequential engagement → Interactive; authentic situated doing → Situated Task; develop through explanation → Expository. Surface form does not decide.

**Fail-closed mixed rule:** When substantial development and deliberate evidence elicitation are mixed, separate developmental sibling commission(s) from Assessment Pack; do not absorb developmental machinery into AP merely to manufacture the capability inspected. AP may retain framing, stimulus, and formative-treatment material needed for a coherent evidence stop.

**Handoff:** Explicit educational dependencies only; learner-facing bring-forward clarity; no hidden runtime learner-state transport; no recreation of earlier constituent work.

**R1/R2:** Share the same product boundary; role selects why the stop exists, not a separate product.

**Authoritative write-up:** [GATE-4-ASSESSMENT-PACK-PRODUCT-BOUNDARY.md](GATE-4-ASSESSMENT-PACK-PRODUCT-BOUNDARY.md).

**Authorised next:** Gate 5 — Learner contract.

**Still not authorised:** response-form taxonomy; formative-treatment taxonomy; schema; pipeline redesign; prompts; production code.

---

## S93-D06 — Gate 5 Assessment Pack learner contract COMPLETE / PASSED

**Date:** 2026-10-07  
**Status:** Accepted  
**Depends on:** [S93-D05](decisions.md#s93-d05--gate-4-assessment-pack-product-boundary-complete--passed)

**Decision:** Mark **Gate 5 — Assessment Pack learner contract** **COMPLETE / PASSED**.

**Contract spine:** An Assessment Pack is a deliberate pause that makes present state/capability visible as formative evidence and provides a meaningful formative return. PRISM never implies evaluation beyond what the deterministic client-side runtime can determine. Prior work is named for bring-forward; the learner leaves knowing what the evidence means for the next learning move. NON-SUMMATIVE.

**Formative return:** Deterministic correctness/explanatory feedback where legitimate; otherwise authored self-evaluation support. Never storage-only completion. Never a large developmental Interactive cycle inside AP.

**Honesty invariant:** Assessment Pack must never imply that a learner response has been evaluated in ways the deterministic learner runtime cannot actually determine.

**R1/R2:** Shared contract; R1 emphasises next-concentration orientation; R2 emphasises quality/strength/limits of demonstrated capability.

**Authoritative write-up:** [GATE-5-ASSESSMENT-PACK-LEARNER-CONTRACT.md](GATE-5-ASSESSMENT-PACK-LEARNER-CONTRACT.md).

**Authorised next:** Gate 6 — Authoring responsibilities.

**Still not authorised:** response-form taxonomy; formative-treatment enums; schema; pipeline redesign; prompts; production code.

---

## S93-D07 — Gate 6 Assessment Pack authoring responsibilities COMPLETE / PASSED

**Date:** 2026-10-07  
**Status:** Accepted  
**Depends on:** [S93-D06](decisions.md#s93-d06--gate-5-assessment-pack-learner-contract-complete--passed)

**Decision:** Mark **Gate 6 — Assessment Pack authoring responsibilities** **COMPLETE / PASSED**.

**Minimal responsibility set (not pipeline stages):**

1. **AR1** Interpret the evidence purpose  
2. **AR2** Design the evidence elicitation  
3. **AR3** Determine epistemic judgement boundaries  
4. **AR4** Author formative return and forward orientation  
5. **AR5** Honour educational handoffs and entry assumptions  

**R1/R2:** Shared AR1–AR5; difference is substantial reasoning emphasis (state→orient vs performance→capability formative use), not separate products. Pipeline topology deferred to Gate 8.

**Determinate vs non-determinate:** Authoring must classify what the runtime can honestly determine; non-determinate requires authored self-evaluation support (smallest sufficient set from conceptual ingredient families — not a treatment enum).

**Authoritative write-up:** [GATE-6-ASSESSMENT-PACK-AUTHORING-RESPONSIBILITIES.md](GATE-6-ASSESSMENT-PACK-AUTHORING-RESPONSIBILITIES.md).

**Authorised next:** Gate 7 — Product invariants.

**Still not authorised:** pipeline stage design; schemas; response/treatment enums; prompts; production code.

---

## S93-D08 — Gate 7 Assessment Pack product invariants COMPLETE / PASSED

**Date:** 2026-10-07  
**Status:** Accepted  
**Depends on:** [S93-D07](decisions.md#s93-d07--gate-6-assessment-pack-authoring-responsibilities-complete--passed)

**Decision:** Mark **Gate 7 — Assessment Pack product invariants** **COMPLETE / PASSED**.

**Hard invariants (AP-I1…I6):**

1. **AP-I1** Evidence-of-learner centre of gravity (incl. negative: surface/position/incidental evidence do not confer ownership; no developmental absorption)
2. **AP-I2** Epistemic honesty
3. **AP-I3** Evidence-fit elicitation (incl. capability-evidence integrity)
4. **AP-I4** Formative completeness (meaningful return + forward orientation; self-evaluation sufficiency when non-determinate)
5. **AP-I5** Dependency and entry-assumption honour
6. **AP-I6** Non-summative

**Authoritative write-up:** [GATE-7-ASSESSMENT-PACK-PRODUCT-INVARIANTS.md](GATE-7-ASSESSMENT-PACK-PRODUCT-INVARIANTS.md).

**Authorised next:** Gate 8 — Predetermined pipeline.

**Still not authorised:** schema freeze; response/treatment enums; prompts; production code. Pipeline design is now the Gate 8 question — not yet an implementation mandate.

---

## S93-D09 — Gate 8 Assessment Pack predetermined pipeline COMPLETE / PASSED

**Date:** 2026-10-07  
**Status:** Accepted  
**Depends on:** [S93-D08](decisions.md#s93-d08--gate-7-assessment-pack-product-invariants-complete--passed)

**Decision:** Mark **Gate 8 — Assessment Pack predetermined pipeline** **COMPLETE / PASSED**.

**Selected Assessment-specific pipeline (plus retained shared upstream Learning Design prefix):**

1. **Interpret Evidence Purpose**  
2. **Design Evidence Elicitation** (must **exit with frozen epistemic classification**)  
3. **Author Formative Return**  
4. **Design Page** (structured artefact synthesis boundary)

**Topology decisions:**

- R1/R2: **one pipeline** with intent parameters (no separate product IDs).
- Determinate/non-determinate: **parameterised** inside Stages 2–3 (not a branch topology).
- Continuous conversation: **one** model conversation across Stages 1–4.
- AR3: co-determined with elicitation; **frozen at Stage 2 exit** before return authoring (structural AP-I2 protection).

**Migration stance:** Replace current Plan/Author closed-form identity with the four-stage educational pipeline; **keep** five auto-checkable forms as determinate capabilities; **retire** constructed-response prohibition; Design Page remains synthesis-only but must express expanded return materials.

**Authoritative write-up:** [GATE-8-ASSESSMENT-PACK-PREDETERMINED-PIPELINE.md](GATE-8-ASSESSMENT-PACK-PREDETERMINED-PIPELINE.md).

**Authorised next:** Gate 9 — Canonical structured artefact.

**Still not authorised:** production prompts; schema implementation in code; renderer/persistence/publishing changes.

---

## S93-D10 — Gate 9 Assessment Pack canonical structured artefact COMPLETE / PASSED

**Date:** 2026-10-07  
**Status:** Accepted  
**Depends on:** [S93-D09](decisions.md#s93-d09--gate-8-assessment-pack-predetermined-pipeline-complete--passed)

**Decision:** Mark **Gate 9 — Assessment Pack canonical structured artefact** **COMPLETE / PASSED**.

**Canonical shape:** Ordinary `artifact_type: "page"` / `schema_version: "2.0.0"` / `product_id: "assessment_pack"` / `page_kind: "assessment"` with required product semantic object **`assessment_evidence`**.

**Core semantics:**

- `purpose` — R1/R2 role, visibility claim, stop rationale, forward intent  
- `learner_context` — bring-forward / entry assumptions (AP-I5)  
- `elicitations[]` — `evidence_ask` + frozen `epistemic_class` (`determinate` \| `non_determinate`) + `delivery` + `formative_return`  
- `delivery.kind` — `auto_checkable_items` (five existing forms) \| `constructed_performance`  
- `pack_forward_orientation` — mandatory  
- `activities[]` — must be empty  

**Migration:** `assessment_check` ceases to be primary identity; may be deterministically derived for transitional compatibility. Five auto-checkable forms **kept** under determinate delivery. Constructed-performance prohibition **retired**.

**Authoritative write-up:** [GATE-9-ASSESSMENT-PACK-CANONICAL-STRUCTURED-ARTEFACT.md](GATE-9-ASSESSMENT-PACK-CANONICAL-STRUCTURED-ARTEFACT.md).

**Authorised next:** Gate 10 — Implementation and live acceptance (bounded by §17 of Gate 9).

**Still not authorised until Gate 10 execution is explicitly started:** production code changes. Gate 9 itself changes no code.
