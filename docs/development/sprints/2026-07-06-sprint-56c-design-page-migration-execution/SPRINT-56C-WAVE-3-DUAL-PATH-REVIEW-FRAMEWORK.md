# Sprint 56C — Wave 3 OQ-24 Dual-Path Review Framework

**Sprint:** 56C — Design Page Migration Execution  
**Wave:** 3 — Validation preparation (W3.2)  
**Status:** Frozen implementation framework  
**Authority:** [Wave 3 Validation Architecture Definition](SPRINT-56C-WAVE-3-VALIDATION-ARCHITECTURE-DEFINITION.md) §2, §7

---

## 1) Purpose

Define how Design Page artefacts are reviewed across:

- **PATH-A**: Copilot-primary capture
- **PATH-B**: PRISM-repair output

This framework governs **structural compliance claims only** (Classes A/B).  
It does not validate runtime generation behaviour or educational quality (Class C).

---

## 2) Path definitions

| Path | ID | Definition |
| --- | --- | --- |
| Copilot-primary | PATH-A | Page JSON generated in Copilot workflow context and captured for Prism-side structural audit |
| PRISM-repair | PATH-B | Page JSON produced/amended by Prism repair from known upstream artefacts |

---

## 3) Evidence model by path

### PATH-A evidence

Required:

1. Layer 1 pre-flight pass (prompt/contract path gates)
2. Captured page JSON artefact (or fixture-bound equivalent)
3. Fixture ID mapping when claim is tied to OQ-25 canonical class

Optional:

- Closure-validator outputs
- Structured reviewer notes

### PATH-B evidence

Required:

1. Upstream binding evidence (`upstream_bindings` from fixture registry)
2. Repair invocation evidence (function path / run context)
3. Post-repair closure-validator outputs
4. Trace of repaired fields in `generation_notes` or review log

---

## 4) Comparison rules (PATH-A vs PATH-B)

| Rule ID | Rule |
| --- | --- |
| P-A1 | PATH-A review is valid only after Layer 1 pre-flight compliance is established |
| P-A2 | PATH-A findings are artefact-audit findings; never generation-behaviour proof |
| P-B1 | PATH-B repair without upstream bindings is non-compliant evidence |
| P-B2 | PATH-B must not mask closure/preservation failures without explicit trace notes |
| P-EQ1 | Equivalence is required for Layer 1 structural dimensions (membership, keys, embed presence) on canonical fixtures |
| P-EQ2 | Wrapper prose equivalence is not required; prose may differ across paths |
| P-NG1 | Framework does not require pedagogical equivalence or quality equivalence |

---

## 5) Allowed vs prohibited claims

### Allowed claims

- “PATH-A fixture FX-*-* passes structural checklist SC-*-V1.”
- “PATH-B restored missing materials keys and passed closure validators with upstream binding evidence.”
- “PATH-A/PATH-B are comparable on Layer 1 structural dimensions for fixture FX-*-*.”

### Prohibited claims

- “Copilot runtime generation is validated by Prism.”
- “PATH-B passing proves Copilot behaved correctly.”
- “Transition or summary quality is validated by this framework.”
- “Educational effectiveness is validated by this framework.”

---

## 6) Review workflow

1. **Select fixture** from OQ-25 registry.
2. **Run Layer 1 pre-flight** (relevant 56C gate set).
3. **Collect PATH-A artefact** (if available; otherwise mark `TBD-CAPTURE`).
4. **Run PATH-B repair audit** when upstream bindings exist.
5. **Evaluate structural checklist** for the fixture.
6. **Classify findings** using FM-A…FM-G taxonomy.
7. **Record permitted claim** using evidence-linked statement only.

---

## 7) Output record template

Use this record shape for every dual-path review:

```json
{
  "fixture_id": "FX-MULTI-001",
  "path": "PATH-A|PATH-B",
  "layer_preflight": "pass|fail|not-run",
  "structural_checklist_id": "SC-MULTI-V1",
  "findings": [
    {
      "finding_id": "F-001",
      "failure_mode": "FM-E",
      "validation_class": "B",
      "evidence_ref": "tests/fixtures/page-render/ld-inflation-workshop-page-full.json",
      "claim_permitted": "Structural preservation check failed: placeholder-only materials detected.",
      "remediation_owner": "Prism"
    }
  ],
  "prohibited_claims_checked": true
}
```

---

## 8) Governance safeguards

- Every report using this framework must cite:
  - `SPRINT-56C-GENERATION-VISIBILITY-CONSTRAINT.md`
  - `SPRINT-56C-WAVE-3-VALIDATION-ARCHITECTURE-DEFINITION.md`
- Every report must include this line (or stricter equivalent):  
  **“Runtime generation quality is not validated by Prism.”**

---

## 9) Exit usage

This framework satisfies checklist §E item:

- **OQ-24 dual-path review framework documented**

It is a Wave 3 readiness artefact and a Wave 4 audit prerequisite.
