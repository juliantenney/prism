# Contract vs Specification Gap Analysis

## Summary

**Assessment: Mostly aligned**

The specification captures the core assembler responsibilities and most key exclusions from the contract (assembly role, activity preservation, material body fidelity, episode-plan attachment, ordering, and schema-valid JSON).  

Main gaps are around **explicitness and granularity** rather than direction: the specification is less explicit on material ID preservation, self-containment, required metadata preservation, and some failure conditions (invalid JSON as distinct from schema failure, missing material IDs, false validation claims as a named failure condition). These should be reconciled before freezing schema and prompt.

---

## Responsibilities Present In Both

| Responsibility | Contract | Spec | Notes |
| -------------- | -------- | ---- | ----- |
| Assemble learner-facing page object from authoritative upstream artefacts | Yes | Yes | Equivalent intent |
| Preserve activity membership/IDs | Yes | Yes | Spec says identifiers; contract explicitly says activity IDs |
| Preserve sequence order from Learning Sequence (when provided) | Yes | Yes | Match |
| Copy full GAM material bodies | Yes | Yes | Match |
| Attach episode plans to corresponding activities | Yes | Yes | Match |
| Emit valid JSON conforming to schema | Yes | Yes | Spec says structurally valid JSON + schema compliant |

---

## Responsibilities Present In Contract Only

| Responsibility | Why It Matters | Recommended Action |
| -------------- | -------------- | ------------------ |
| Preserve required material IDs and material mapping per activity | Critical for traceability and fidelity audits | Add explicit responsibility to spec |
| Preserve required metadata needed for downstream rendering/review | Affects practical downstream usability and compatibility | Add explicit metadata-preservation responsibility or define metadata subset |
| Output must be complete/self-contained (embedded content, not references) | Central to current failure mode and contract intent | Add explicit self-containment responsibility (not only as invariant) |

---

## Responsibilities Present In Spec Only

| Responsibility | Justification | Keep / Remove / Investigate |
| -------------- | ------------- | ---------------------------- |
| None (materially) | Spec responsibilities are mostly a subset/phrasing variant of contract responsibilities | Keep |

---

## Non-Responsibilities Comparison

**Aligned exclusions**
- No new content authoring.
- No rewriting/summarizing/regenerating learner-facing materials.
- No pedagogy redesign.
- No episode re-planning.
- No inference/replacement of missing bodies unless explicitly permitted.

**Missing exclusions (in spec)**
- Contract explicitly forbids altering upstream activity structure; spec implies this but does not state it directly.
- Contract distinguishes regenerating activities *or materials*; spec wording merges this into one clause and is less explicit on activity regeneration as a separate prohibition.

**Contradictory exclusions**
- No direct contradictions found.

---

## Invariant Comparison

| Invariant | Contract | Spec | Status |
| --------- | -------- | ---- | ------ |
| Activity preservation | Explicit | Explicit | Match |
| Material preservation | Explicit | Explicit | Match |
| Material ID preservation | Explicit | Not explicit | Missing |
| Material body preservation | Explicit (whole-body fidelity) | Explicit (whole-body fidelity) | Match |
| Episode-plan attachment | Explicit | Explicit | Match |
| Sequence preservation | Explicit | Explicit | Match |
| Self-containment | Explicit | Not explicit as invariant | Missing |
| Schema compliance | Explicit | Explicit | Match |

---

## Failure Condition Comparison

| Failure Condition | Contract | Spec | Status |
| ----------------- | -------- | ---- | ------ |
| Missing required activities | Yes | Yes | Match |
| Missing required materials | Yes | Partial (missing activity/material IDs clause) | Partial Match |
| Summarised/truncated/excerpted material bodies | Yes | Partial (truncated/summarized covered; excerpted not explicit) | Partial Match |
| Replaced material content (placeholders/references/descriptions) | Yes | Yes | Match |
| Detached/missing/mismatched episode plans | Yes | Yes | Match |
| Invalid JSON | Yes (explicit) | Implicit via schema failure only | Missing |
| Schema non-conformance | Yes | Yes | Match |
| False validation claims | Yes (explicit failure) | Mentioned in validation requirements, not explicitly listed in failure conditions | Partial Match |

---

## Ambiguities

- What metadata is mandatory vs optional for “preserve required metadata”?
- What is the exact boundary of “self-contained” (for example, are external references ever allowed for non-material fields)?
- Are derived page sections allowed when not directly present upstream?
- Can Design Page create wrapper text, and if so, under what strict limits?
- What normalization rules are allowed for material body comparison (whitespace, escaping, markdown normalization)?
- How should ID mapping be handled when legacy runs present mismatched upstream/composed IDs?
- When sequence is absent, what ordering source is authoritative?

---

## Recommended Specification Changes

1. **Add explicit material ID preservation responsibility**.  
   **Classification:** Critical

2. **Add explicit self-containment responsibility and invariant** (embedded payloads, no deferred references for required content).  
   **Classification:** Critical

3. **Add explicit required metadata preservation responsibility** with a defined metadata set or placeholder subsection.  
   **Classification:** Important

4. **Expand failure conditions** to explicitly include:
   - missing material IDs,
   - excerpt-only material copy,
   - invalid JSON (separate from schema failure),
   - false validation claims as a named failure condition.  
   **Classification:** Critical

5. **Add explicit non-responsibility: do not alter upstream activity structure**.  
   **Classification:** Important

6. **Clarify wrapper/derived section policy** in open questions or constraints section.  
   **Classification:** Optional

---

## Readiness Assessment

**Not ready yet for schema finalisation or minimal prompt refactor freeze.**

Contract/spec reconciliation should be completed first because several contract-critical items (material ID preservation, self-containment explicitness, and failure-condition completeness) are not yet fully represented in the specification. Proceeding without this reconciliation risks freezing a schema/prompt that cannot reliably enforce the extracted contract.
