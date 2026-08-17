# Sprint 78 — Context

**Sprint status:** **OPEN** (2026-08-17)  
**Dashboard:** [STATUS.md](STATUS.md)

**Present (2026-08-17):** WS1 **CLOSED** (87/100). WS2 architecture has positive evidence; T-013 **OPEN**. T-017–T-018 verifier is **temporary instrumentation** ([S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification)). T-003 and T-019 queued. Sprint 77 **CLOSED**.

---

## Predecessor state (Sprint 77 — CLOSED)

Sprint 77 closed the DLA Prompt Contract Architecture Pilot with canonical DLA live (`77-DLA-CANONICAL-3`), E1 and Case 1 closed, GAM D no independent live defect proven, E2 intermittent/open with recurrence protocol.

Post-close bounded maintenance (not Sprint 77 reopen):

| Item | Status |
| ---- | ------ |
| Ordinary GAM material body-format | CLOSED |
| Graphics Clear Run Data lifecycle | CLOSED |
| DLA `material_type` presentation vocabulary | CLOSED (`77-DLA-CANONICAL-3`) |
| Final assembly / render / package | Achieved |

Authoritative QA baseline record: [POST-S77-lagrangian-qa-baseline-2026-08-14.md](../2026-08-14-sprint-77-dla-prompt-contract-architecture-pilot/POST-S77-lagrangian-qa-baseline-2026-08-14.md).

---

## QA baseline summary (reference only — full detail in POST-S77 record)

**PRISM Resource Quality Benchmark v2.2** — fresh Lagrangian Multipliers package (2026-08-14):

| Measure | Value |
| ------- | ----- |
| Uncapped weighted score | 70/100 — Competent |
| Release score | 69/100 — Adequate |
| Confidence | High |
| Inspection coverage | Complete package |
| Critical defects | 0 |
| Major defects | 2 |
| Recommendation | Revision recommended |
| Feedback & Self-Regulation | 30/100 |

### Major defects

1. **Activity 1 — workspace unusable as instructed.** Learners told to enter responses into a comparison table; table already populated and non-editable.
2. **Activity 3 — independent practice spoiled.** Complete worked solution to the **identical** optimisation problem immediately before learners asked to solve it.

### Moderate defect (retained separately)

**Activity 3 — solution workspace form.** Renders as multiple free-text fields containing Markdown-like table scaffolding rather than an appropriate structured mathematical workspace.

**Disposition:** Track separately from Workstream 1 (T-001). Merge into T-001 only if diagnosis proves the same causal mechanism.

### Systemic instructional finding

All four activities lack a substantive Check/revision stage. No criterion-based guided review, diagnostic feedback, model comparison, or equivalent evaluative mechanism.

### Strengths to preserve

Coherent conceptual progression; constructive alignment; disciplinary quality; accessibility/inclusive design; visual synthesis; economic interpretation of shadow prices. **Architecture is not failed.**

---

## Sprint 78 diagnostic questions (from Monday queue)

| Track | Question | Exhibit |
| ----- | -------- | ------- |
| WS1 | Why can an activity commission learner production but the final resource realise the intended response space as completed instructional content rather than a usable learner workspace? | Activity 1 |
| WS2 | Why does modelling fail to preserve independence of subsequent learner practice? | Activity 3 worked example → identical practice |
| WS3 | Why does the generated learner experience reliably produce Orient/Learn/Do but fail to close the learning cycle with Check/revision where pedagogically warranted? | All four activities; F&S 30 — **hypothesis to test:** compound production may fail to become **one activity-level diagnostic review** (criteria mapped to response components), not one review block per field. A4/A5-style guided review is a positive exemplar. |

Do **not** assume ownership is DLA, GAM, assembly, or renderer before diagnosis.

---

## GAM reliability strategy (Sprint 78)

**Intended product contract:** Generate Activity Materials → valid GAM capture → Step complete → Next. A user should not normally need to repeatedly regenerate GAM until it happens to pass.

**Temporary semantic verification (T-017 / T-017A / T-018):** retained to expose semantic GAM failures that structural validation cannot detect. **Not rejected. Not the desired permanent production mechanism.**

**Verifier FAIL = GAM generation failure.** A later regenerated PASS demonstrates capability; the original FAIL remains evidence. **“Regenerate until it passes” is not an acceptable Sprint 78 reliability outcome.**

Working method: fresh GAM → temporary verification → on FAIL preserve candidate, classify (genuine general defect / false rejection / malformed output / operator-path / other), trace to earliest owner, harden DLA→GAM where justified, avoid domain-specific patches → repeat fresh generation. Goal: reduce verifier findings until the extra interaction can be removed. Removal is **not scheduled**; it depends on evidence.

Desired end state: first-pass suitable GAM; verifier no longer revealing systemic classes; extra interaction removable from the normal operator workflow.

---

## Workstream status (do not conflate)

| Track | Status |
| ----- | ------ |
| WS1 | **CLOSED** — `response_fulfilment` + GAM response-space preservation; original pre-filled/non-editable workspace repaired; fresh **87/100** |
| WS2 | Architecture **strong positive evidence**; T-013 **OPEN** because the integration path also exposed **separate** operational-suitability failures and malformed-output recurrences. C4: **WS2 PASS + suitability FAIL** |
| Operational suitability | General commission-relative invariant (T-014/T-015). Stage-1 insufficient. Verifier = temporary instrumentation |
| WS3 | T-003 queued (hypothesis above — not proven) |
| Activity timing | T-019 queued — expected duration not displayed; do not assume renderer ownership |

---

## Minor presentation issues (logged, lower priority)

- stray blank lines above some response fields;
- missing horizontal rule / separator between activities;
- Activity 3 mathematical-workspace presentation (Markdown scaffolding in free-text fields);
- image mismatch / persistence / operator-path where recorded.

Do not elevate these above instructional/reliability workstreams unless later evidence establishes a shared architectural cause.

---

## Desired invariants (target state)

| Relationship | Invariant |
| ------------ | --------- |
| **MODEL → ATTEMPT** | Worked/model examples may demonstrate structure and operation; subsequent independent practice must not disclose the target answer/problem. Prefer analogous/isomorphic examples over arbitrary topic changes. Do not encode Lagrangian-specific numbers into architecture. |
| **ATTEMPT → workspace** | A learner instruction to complete/construct/compare/etc. must have an operational means of producing the requested response. |
| **ATTEMPT → CHECK → REVISE** | Meaningful evaluative activity appropriate to the learner production — not necessarily identical check types per activity; not necessarily a quiz; not necessarily automated correctness checking. |

---

## Out of sprint / wait states

| Item | Notes |
| ---- | ----- |
| **E2** | OPEN / intermittent; **Sprint 78 recurrence** (T-013 Candidate 2); fail-closed; separate from WS2/suitability; [S77-T-026](../2026-08-14-sprint-77-dla-prompt-contract-architecture-pilot/S77-T-026-gam-e2-intermittent-corruption-diagnostic.md) protocol; **no sanitiser**; do not reopen Sprint 77 |
| **GAM truncation** | Distinct malformed-output observation (T-013 Candidate 3); capability signal only; not WS2/suitability evidence |
| **EP→DLA A5 topology-loss** | Retain unresolved observation; do not assume live repair |
| T-032 residual | OPEN diagnostic |
| PB-FA-010 | Later; not unless Sprint 78 diagnosis requires |
| Continue-to-Authoring UX | Separate |
| PB-FA-005 Settings | Deferred |
| Phase D DLA cleanup | Not authorised |
| RECOVER | Hypothesis only |
| Evidence-injection rollback | Option only |

Pull into Sprint 78 **only** if they block the Lagrangian exit benchmark.

---

## Git / programme baseline

Sprint 77 close + Friday QA baseline commit: `d6041a57b1a61de86719c32faafe0030930e9d49`.
