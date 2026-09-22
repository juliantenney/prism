# Sprint 86 — Decision Log

**Sprint status:** **COMPLETE / CLOSED** (closed 2026-09-22) — Investigation/design  
**Format:** ID · Decision · Status · Rationale · Consequences  
**Predecessor:** [Sprint 85 COMPLETE / CLOSED](../2026-09-21-sprint-85-expository-resource-implementation/SPRINT-85-CLOSURE.md)  
**Closure:** [T-012-SPRINT-86-CLOSURE.md](T-012-SPRINT-86-CLOSURE.md)

---

## S86-D01 — Open Sprint 86 — Expository Editorial Quality & QA

- **Decision:** Open Sprint 86 as an **investigation/design** sprint (not implementation) titled **Expository Editorial Quality & QA**, to establish a general Expository editorial quality model, a repeatable Expository QA process, cross-resource evidence, a pipeline responsibility map (including the XD→XM integration seam), typography/editorial rendering requirements, and a bounded successor implementation design — under backlog item [PB-FA-012](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-012--expository-editorial-quality--qa).

- **Status:** **Accepted** (2026-09-22)

- **Rationale:**
  - Sprint 85 is **COMPLETE / CLOSED** and delivered functional first-class Expository capability; its authoritative distinction remains that presentation polish was **not** claimed.
  - Live Bayes editorial review showed instructional architecture stronger than editorial execution — motivating a distinct editorial quality layer investigation.
  - Draft editorial principles from that review are recorded as **hypotheses to test**, not accepted production rules or a fixed chapter formula.
  - Opening the pack authorises investigation/design administration and the bounded WPs in [PLAN.md](PLAN.md); it does **not** authorise production code, prompt, contract, schema, or renderer changes.

- **Consequences:**
  - Sprint 86 pack becomes the active programme pointer via [NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md).
  - Sprint 85 remains **COMPLETE / CLOSED** — do not reopen S83/S84/S85 architecture without compelling evidence.
  - Interactive baseline remains protected ([S83-D04](../2026-09-21-sprint-83-expository-resource-investigation/decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline)).
  - Implementation of editorial improvements remains **not authorised** until a later explicit decision after investigation/design acceptance.
  - Generating additional Expository sample resources for QA evidence may be performed when authorised within WP3 investigation — not as product feature work.
  - Research Synthesis relationship remains open under [PB-FA-011](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-011--expository-resource) and is **not** resolved here.

---

## S86-D02 — Close Sprint 86 — Expository Editorial Quality & QA

- **Decision:** Close Sprint 86 as **COMPLETE / CLOSED**. Accept EQ1–EQ8, the T-007–T-011 investigation/design outputs, frozen C01–C05 under QA v0.1, and the T-011 first successor implementation slice as the handoff for a **later** implementation sprint. Carry **QA v0.2** (WP2) into that successor sprint — to be drafted **before coding**. Do **not** implement the first slice in Sprint 86. Do **not** open Sprint 87 in this decision.

- **Status:** **Accepted** (2026-09-22)

- **Rationale:**
  - Investigation/design charter objectives are met: quality model, diverse evidence, pipeline map, seam design, typography requirements, bounded successor design.
  - WP2’s remaining v0.2 drafting is deliberately timed for successor-sprint acceptance instrumentation, not left as silent unfinished S86 work.
  - Production implementation was never authorised by S86-D01; closing without code change preserves that boundary.

- **Consequences:**
  - Authoritative closure: [T-012-SPRINT-86-CLOSURE.md](T-012-SPRINT-86-CLOSURE.md).
  - Programme pointer updates to Sprint 86 **CLOSED**; successor implementation sprint **not yet opened**.
  - Interactive baseline remains protected.
  - T-011 first slice remains the implementation target when a successor sprint is explicitly authorised.
  - Option B (T-009) remains follow-on, not first slice.

---

## Closed acceptance notes

| Item | Status at S86 close |
| ---- | ------------------- |
| Editorial quality model EQ1–EQ8 | **Accepted** for successor design (not yet production rules until implemented) |
| Expository QA v0.1 | **Frozen** for C01–C05; **v0.2 handoff** |
| Pipeline responsibility map + XD/XM finding | **Accepted** (T-008/T-009) |
| Typography requirements + successor implementation design | **Accepted** (T-010/T-011) |
| Authorise successor implementation sprint | **Not opened** in S86 |
