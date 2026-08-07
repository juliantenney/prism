# Post-Sprint-74B — Manual Acceptance Correction: DLA Evidence-Decision Prompt

**Date:** 2026-08-07  
**Programme:** Sprint 74 (wrapper OPEN; 74B COMPLETE / Closed)  
**Scope:** Producer-side DLA prompt strengthening only  
**Status:** Corrective slice complete (ready for commit)

---

## Context

Manual end-to-end Prism workflow acceptance after Sprint 74B observed one DLA capture rejection:

```text
activities[1].evidence_decision contradicts evidence-dependent learner task/output wording
activities[5].evidence_decision contradicts evidence-dependent learner task/output wording
```

A second generation of the same workflow succeeded.

Investigation established:

- **Not** a Sprint 74B regression;
- existing validator (`validateEvidenceDecisionClosure` / `taskLooksEvidenceDependent`) is correct and predates 74B;
- removed legacy capture shims were **not** on this modern page path;
- the model emitted an internally inconsistent DLA (`required: false` with evidence-dependent learner production wording);
- current prompt and validator were already conceptually aligned.

---

## Fix

**Strengthen producer guidance** in `lib/ld-dla-page-enrich-contract.js`:

- Added **FINAL PER-ACTIVITY EVIDENCE-DECISION CONSISTENCY AUDIT** (after drafting each activity, before emit);
- Explicit `required: false` prohibitions on evidence-dependent wording / providers;
- Explicit `required: true` + genuine provider requirements when supplied evidence must be inspected;
- Domain-neutral invalid / valid contrast.

**Did not:**

- weaken or change the validator;
- change schema;
- change runtime capture behaviour;
- reopen architectural rationalisation or Sprint 74C.

---

## Tests

- `tests/ld-dla-evidence-decision-consistency-prompt.test.js` (new) — **4/4 pass**
- Strengthened contract assertions in `tests/sprint-72-evidence-centred-activity-slice.test.js` — targeted contract + contradiction tests **pass**
- `page-dla-enrich` + `page-partial-capture-validate` + `dla-38l-obligation-smoke` — **53/53 pass**
- Full `sprint-72-evidence-centred-activity-slice.test.js` remains **45/73** (28 pre-existing failures — PB-S-001 / fixture enrichment; unchanged by this slice; proven to fail without the contract edit)

Validator suites retained unchanged. `lib/page-dla-enrich.js` **not modified**.

---

## Outcome

Manual E2E exposed **stochastic model inconsistency**. The validator correctly rejected it; a second generation passed. This slice reduces recurrence by tightening the producer contract while leaving fail-closed validation authoritative.

**Ready for commit.**
