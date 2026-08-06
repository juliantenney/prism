# Sprint 71 → Sprint 72 disposition audit

**Date:** 2026-08-05  
**Type:** Audit only — no Sprint 71 evidence edits; no Sprint 73 start  
**Authority:** Sprint 71 Final Report · Closure · Improvement Register · Design principles · Sprint 72 findings-traceability · [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md) · Sprint 72 closure  
**Purpose:** Confirm every validated Sprint 71 finding/recommendation has an explicit disposition before Sprint 73.

---

## Summary counts

| Disposition | Count |
| ----------- | ----- |
| Implemented during Sprint 72 | **16** |
| Explicitly deferred into Product Backlog | **12** |
| Superseded by a later architectural decision | **2** |
| Intentionally not adopted (with rationale) | **5** |
| Missing disposition (potential gap) | **0** *(after audit remediation below)* |
| **Total rows reviewed** | **35** |

Scope of rows: instructional findings `S71-F-001`…`F-015` (15) · observations `S71-O-001`…`O-006` (6) · six validated candidate principles (6) · seven Final Report “Recommendations for Sprint 72” (7) · Theme ID deferral (1).

**Confidence:** Sprint 72 **discharged the intended Sprint 71 primary outcomes** (Evidence-Centred Learning productisation; three-layer routing; Critical F-001 dual-route A→B→partial C; diagnostic feedback slice; pedagogical timing constraints; steerability framing). Residual Confirmed findings not fully productised were either already on the product backlog or are recorded there by this audit. Confidence is **high for primary outcomes**; **medium for completeness of secondary Confirmed clusters** (F-007 residual, F-009, F-011) until backlog entries are used in planning.

---

## Audit table — instructional findings (`S71-F-*`)

| ID | Item | Disposition | Sprint 72 / backlog / location |
| -- | ---- | ----------- | ------------------------------ |
| F-001 | Evidence sufficiency / availability (Critical) | **Implemented during Sprint 72** | Dual-route `S72-D08`: A via T-010–015, DLA/GAM evidence contracts; B via T-033 + T-076 DLA guidance; C via `conversation_attachment` (not bytes). Residue byte persistence → **Future architecture PB-FA-001**. Loc: domain pack DLA/GAM; `lib/ld-dla-*` / evidence contracts; run-summary UX |
| F-002 | Diagnostic vs criterion-based feedback | **Implemented during Sprint 72** | Guided-review slice T-022. Residual full Design Feedback programme → **Product ideas**. Loc: guided-review / feedback sequencing |
| F-003 | Draft-saving communication unclear (Partial, Low) | **Intentionally not adopted** | Destination **F** in S72 traceability; single-resource Partial; no later recurrence — retain as evidence only |
| F-004 | Competing interpretations limited | **Implemented during Sprint 72** | Evidence-centred + uncertainty / delayed-disclosure constraints in Layer-1 slice. Residual breadth → **Product ideas** (broader uncertainty programme) |
| F-005 | Disciplinary uncertainty not sustained (Partial) | **Explicitly deferred into Product Backlog** | **Product ideas** — broader Layer-1 uncertainty / timing programme |
| F-006 | Rejection of alternatives under-prompted (Partial) | **Explicitly deferred into Product Backlog** | **Product ideas** |
| F-007 | Source diversity / source evaluation limited (Confirmed) | **Explicitly deferred into Product Backlog** | Principle nested under Evidence-Centred Learning umbrella (`S72-D04`); residual discipline-appropriate evaluation tasks → **Research PB-R-006** (added this audit) |
| F-008 | Scholarly perspectives generic (Partial) | **Explicitly deferred into Product Backlog** | **Product ideas** |
| F-009 | Diagnostic evidence overly unambiguous (Confirmed) | **Explicitly deferred into Product Backlog** | **Product ideas** — ambiguous / conflicting evidence for professional judgement (PB-I-009; added this audit) |
| F-010 | Transfer lightly specified (Partial) | **Explicitly deferred into Product Backlog** | **Product ideas** — transfer/modelling depth (distinct from Check→Transfer *ordering* shipped in T-057) |
| F-011 | Worked example under-explains conceptual rule (Confirmed) | **Explicitly deferred into Product Backlog** | **Product ideas** — worked-example conceptual depth (PB-I-011; added this audit) |
| F-012 | Later-stage prediction before calculation (Partial) | **Explicitly deferred into Product Backlog** | **Product ideas** |
| F-013 | Worked-example variety limited (Partial) | **Explicitly deferred into Product Backlog** | **Product ideas** |
| F-014 | Disciplinary representation underused (e.g. code) | **Explicitly deferred into Product Backlog** | **Future architecture PB-FA-002** (+ Research PB-R-002) |
| F-015 | Pedagogical timing / premature disclosure | **Implemented during Sprint 72** | Delayed-disclosure / no-premature-reveal constraints. Residual broader timing → **Product ideas** |

---

## Audit table — observations (`S71-O-*`)

| ID | Item | Disposition | Sprint 72 / backlog / location |
| -- | ---- | ----------- | ------------------------------ |
| O-001 | Long titles abbreviated in nav | **Implemented during Sprint 72** | Bounded nav fixes T-056. Residual polish → **Stabilisation PB-S-002** |
| O-002 | Malformed visual evidence anchors | **Intentionally not adopted** | Resolved in Sprint 71 — destination **F**; no S72 work |
| O-003 | Orphaned placeholders / missing image | **Intentionally not adopted** | Resolved historically — destination **F** |
| O-004 | Corrupted math TeX in GAM | **Intentionally not adopted** | Resolved + regression verified in S71 — destination **F**; retain regression watch |
| O-005 | Semantic heading hierarchy | **Implemented during Sprint 72** | Bounded heading fixes T-056. Residual → **Stabilisation PB-S-002** |
| O-006 | Steerability / prompt-sensitive vs availability | **Superseded by a later architectural decision** | Became Sprint 72 binding framing: `S72-D01`, `S72-D03`, `S72-D08` — not a defect to “fix” |

---

## Audit table — validated candidate principles

| Principle | Disposition | Notes |
| --------- | ----------- | ----- |
| Evidence Sufficiency | **Implemented during Sprint 72** | T-010–015; F-001-A |
| Evidence-Centred Activity Design | **Implemented during Sprint 72** | Core S72 slice; `S72-D04`, `S72-D11`, `S72-D12` |
| Pedagogical Timing | **Implemented during Sprint 72** | Delayed-disclosure constraints (F-015) |
| Diagnostic Feedback | **Implemented during Sprint 72** | Guided-review slice (T-022); not full Design Feedback programme |
| Disciplinary Uncertainty | **Implemented during Sprint 72** | Partial — competing-interpretations / uncertainty constraints; sustainment residual → Product ideas |
| Discipline-Appropriate Evidence Evaluation | **Superseded by a later architectural decision** | Nested under Evidence-Centred Learning umbrella (`S72-D04`); residual F-007 evaluation tasks → PB-R-006 |

---

## Audit table — Final Report recommendations for Sprint 72

| # | Recommendation | Disposition | Notes |
| - | -------------- | ----------- | ----- |
| R1 | Productise validated principles into Layer-1 (+ Layer-2 elicitation) | **Implemented during Sprint 72** | Layer-1 primary; Layer-2 partial (T-033/T-076); deeper elicitation → PB-R-005 |
| R2 | Design Layer-2 questions for evidence source / generate / upload / rights | **Explicitly deferred into Product Backlog** | Partial guidance shipped; full model → **Research PB-R-005** (+ PB-FA-001 for upload bytes) |
| R3 | Address Critical F-001 with Layer-3 author-supply pathways | **Implemented during Sprint 72** | Conversation-attachment path shipped; durable byte store → **PB-FA-001** |
| R4 | Continue sample diversity if further Confirmed recurrence needed | **Intentionally not adopted** | Superseded by continuous-verification close strategy `S72-D14` — no dedicated sampling programme |
| R5 | Resolve in-repo Benchmark v2.1 / Validation Review v2.0 paths | **Explicitly deferred into Product Backlog** | **Research PB-R-007** (added this audit) |
| R6 | Address open O-005 heading hierarchy | **Implemented during Sprint 72** | Bounded T-056; residual PB-S-002 |
| R7 | Formalise Theme ID consolidation only under successor process | **Intentionally not adopted** | Theme ID table intentionally empty at S71 close; principles carried as candidates — no Theme ID programme opened |

---

## Omissions discovered and remediation

| Gap | Recommended action | Done in this audit? |
| --- | ------------------ | ------------------- |
| F-009 Confirmed (ambiguous diagnostic evidence) lacked a named backlog entry | Add **Product ideas** entry | **Yes** — PB-I-009 |
| F-011 Confirmed (worked-example conceptual depth) lacked a named backlog entry | Add **Product ideas** entry | **Yes** — PB-I-011 |
| F-007 residual (discipline-appropriate source evaluation beyond umbrella) underspecified on backlog | Add **Research** question | **Yes** — PB-R-006 |
| Benchmark/Validation instrument in-repo paths (Final Report R5) absent from backlog | Add **Research** question | **Yes** — PB-R-007 |

No item remains **Missing disposition** after remediation. None of these omissions are recommended as automatic Sprint 73 candidates without approach + acceptance criteria.

---

## Confidence statement

Sprint 72 **fully discharged the intended Sprint 71 primary outcomes**: productise Evidence-Centred Learning; respect three-layer routing; treat F-001 as dual-routed Critical work with platform-first sufficiency; ship a diagnostic-feedback improvement; adopt steerability framing without “longer prompts.” Secondary Confirmed clusters (F-009, F-011, F-014, residual F-007) were correctly not forced into Sprint 72 closeout and now have explicit product-backlog homes.

---

## Related

- [SPRINT-72-CLOSURE.md](SPRINT-72-CLOSURE.md)  
- [SPRINT-72-FINAL-REPORT.md](SPRINT-72-FINAL-REPORT.md)  
- [findings-traceability.md](findings-traceability.md)  
- [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md)  
