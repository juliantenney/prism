# Sprint 82 — Charter

**Sprint:** 82 — Maths Entry & Alpha Completion  
**Status:** **OPEN** (2026-09-01)  
**Type:** Bounded alpha-completion — semantic commissioning already done; learner interaction + validation  
**Predecessor:** Sprint 81 — CLOSED; WORKING ALPHA; D-014 RESOLVED  
**Start here:** [SPRINT-82-START-HERE.md](SPRINT-82-START-HERE.md)  
**Opening decision:** [S82-D01](decisions.md#s82-d01--open-sprint-82--maths-entry--alpha-completion)

---

## Mission

Ensure that when PRISM commissions dedicated mathematical learner evidence, the learner has an **appropriate first-class interaction** for producing it, while preserving the existing evidence and persistence architecture.

This is a **deliberately bounded alpha-completion sprint**. PRISM is already a **WORKING ALPHA**. This is **not** a general maths-authoring programme.

---

## Product blocker (why now)

> A first-class learner activity must provide an interaction surface capable of producing the evidence specified by its commissioning contract.

PRISM can commission Lagrangians, objectives, constraints, FOCs, simultaneous solutions, feasibility checks, and similar expressions. A plain prose textarea is not necessarily appropriate for that commissioned evidence.

Gate 1 closed the **semantic** gap (`input_modality: math`). Gate 2+ closes the **interaction** gap.

---

## Scope (in)

- Propagate `inputModality` to learner renderer seam  
- Select and implement bounded alpha maths-entry treatment (after Gate 2A spike)  
- Preserve `text_entry` persistence and TeX/string canonical evidence  
- Realistic Lagrangian learner validation  
- Focused accessibility / keyboard / persistence verification  
- First-class engineering gate at close  

---

## Non-goals (explicit)

- Rich mixed prose + maths editor  
- General mathematical authoring framework  
- CAS or symbolic correctness checking  
- Mathematical diagnosis / automated marking of learner maths  
- New model calls for learner maths  
- New `math_entry` surfaceKind unless later evidence proves unavoidable  
- Table maths implementation unless live validation proves necessary for sprint close  
- Universal table redesign  
- Learner surface-family redesign (Sprint 81 closed)  
- Graphics redesign (pre-S82 fix closed)  
- Slideshow / output extensibility implementation  
- Historical RC backlog  
- Formal WCAG conformance programme  
- Alpha hardening / export-import lifecycle pass (sequenced **after** Sprint 82)

---

## Settled inputs (do not reopen)

### Gate 1 — COMPLETE

```text
required_materials[].response_fields[] { label, input_modality: "text"|"math" }
  → DLA authority → GAM preserve → compose join → ResponsePart.inputModality
  → surfaceKind remains text_entry
```

Identity: `material_id` + governed exact trimmed label. No fuzzy matching.

Tests: Gate 1 **11/11**; first-class **339/339**.

### Gate 2 diagnostic — COMPLETE

`inputModality` lost at `workspaceFromResponsePart()`. Persistence already TeX-compatible. Learner TeX must not pass through Markdown transforms.

Full record: [S82-T-001](S82-T-001-maths-entry-gate-2-learner-interaction-diagnostic.md).

### Live Lagrangian validation

Structured multi-part response; ~4–10 labelled fields; predominantly one mathematical artefact per maths-labelled field. Rich mixed editing **not** evidenced.

### Sprint 81 learner architecture — CLOSED

```text
learning intent → activity → learner action → evidence → surface → diagnostic feedback
```

No universal activity→widget mapping. Revision enhancements shipped; no surface-family architecture.

---

## Gate 2A decision space (open)

| Outcome | Condition |
| ------- | --------- |
| **A — GO MathLive** | Materially better construction without TeX expertise; clean sync; restore; keyboard; credible a11y; fallback; bounded cost |
| **B — GO enhanced textarea** | MathLive disproportionately costly/problematic; textarea + toolbar + on-blur preview |
| **C — STOP / reassess** | Neither treatment reasonably fulfils commissioned evidence |

---

## Exit criteria

Sprint 82 may close when:

1. Commissioned `inputModality: math` reaches the learner renderer.  
2. Dedicated maths fields receive the selected maths-capable interaction.  
3. Canonical evidence remains string/TeX via existing `text_entry` persistence.  
4. Saved mathematical responses restore correctly.  
5. Enhancement failure leaves usable native input.  
6. Keyboard-only mathematical completion verified.  
7. No material regression of established automated accessibility baseline.  
8. Realistic Lagrangian activity completable with maths interaction.  
9. Prose `text_entry` unaffected when no math modality.  
10. First-class engineering gate passes.

Table maths **not** required unless live validation demonstrates commissioned table-cell maths that cannot reasonably be completed otherwise.

---

## Intended completion claim (when satisfied)

> Maths Entry is first-class for dedicated mathematical response fields: PRISM can commission mathematical evidence, provide an appropriate learner interaction for producing it, and preserve that evidence through the existing draft architecture.

**Do not expand** to arbitrary authoring, mixed documents, correctness checking, or table cells unless separately implemented.

---

## Post-sprint context (not Sprint 82 work)

After Sprint 82: **alpha hardening / closeout pass**, including lifecycle:

```text
Create → Save → Adjust → Run → save adjusted state → export → import elsewhere → Run
```

Verify persistence of commissioned baseline, Adjustments, Additional Instructions, auto-cleared adjustments, duplicates, governed parameter resolution, legacy workflows, and Run/Copy effective context after import.

---

## Design constraints (binding)

- Native textarea / string remains canonical evidence and graceful fallback.  
- DLA owns modality; GAM preserves; no keyword inference.  
- Preserve Sprint 81 accessibility baseline; no formal WCAG claim.  
- Display maths (MathJax) and learner editor are separate concerns.  
- CDN/offline MathJax for packages remains known debt — not a reason to defer Sprint 82.
