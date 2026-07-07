# Specification Change Log (Contract Reconciliation)

Source of truth: `contract-spec-gap-analysis.md`

## Changes applied

1. **Added explicit responsibility: preserve material IDs and material-to-activity mapping.**  
   - **Rationale:** Gap analysis identified missing explicit material ID/mapping responsibility.  
   - **Source:** Recommended Specification Changes #1 (Critical), Invariant Comparison (Material ID preservation = Missing).

2. **Added explicit responsibility: produce self-contained artefact with embedded required content (not references).**  
   - **Rationale:** Gap analysis identified self-containment as contract-critical and under-specified.  
   - **Source:** Recommended Specification Changes #2 (Critical), Invariant Comparison (Self-containment = Missing).

3. **Added `## Required Metadata` section with placeholder entries marked `TBD`.**  
   - **Rationale:** Gap analysis called out required metadata preservation as important but unresolved scope.  
   - **Source:** Recommended Specification Changes #3 (Important), Ambiguities (metadata mandatory vs optional).

4. **Added explicit non-responsibility: do not alter upstream activity structure.**  
   - **Rationale:** Gap analysis identified this exclusion as missing in spec.  
   - **Source:** Recommended Specification Changes #5 (Important), Non-Responsibilities Comparison (Missing exclusions).

5. **Expanded required invariants with:**
   - material ID preservation,
   - material-to-activity mapping preservation,
   - self-containment.  
   - **Rationale:** Contract includes these as hard invariants; spec needed explicit alignment.  
   - **Source:** Invariant Comparison (Material ID preservation, Self-containment = Missing).

6. **Expanded failure conditions with:**
   - missing material IDs,
   - broken material mappings,
   - excerpt-only material copies,
   - invalid JSON,
   - false validation claims.  
   - **Rationale:** Gap analysis identified failure-condition incompleteness.  
   - **Source:** Recommended Specification Changes #4 (Critical), Failure Condition Comparison (Partial/Missing).

7. **Updated and expanded `## Open Questions` to include:**
   - wrapper text policy,
   - derived section policy,
   - metadata scope,
   - normalization rules,
   - legacy ID handling.  
   - **Rationale:** Carry forward unresolved ambiguity set prior to schema/prompt freeze.  
   - **Source:** Ambiguities section and Recommendation #6 (Optional clarification).

## Scope guard

- No changes made to:
  - `design-page.schema.json`
  - `design-page-minimal.prompt.md`
  - production workflow files

---

## Additional Changes (Schema Source Audit Alignment)

Source of truth: `schema-source-audit.md`

8. **Added `## Section Shape Policy` with canonical section model and `learning_activities` canonical container rule.**  
   - **Rationale:** Audit identified need for explicit section-shape policy and removal of ambiguity around primary material container location.  
   - **Source:** Missing From Current Spec #1, Candidate v2 Recommendations (Remove legacy page-level material container).

9. **Added `## Learner Journey Support Fields` to explicitly support upstream-provided journey signals.**  
   - **Rationale:** Audit found learner-journey support fields present in sources but under-specified in the contract-aligned spec.  
   - **Source:** Learner Journey Elements Found, Contract Alignment (useful journey fields not explicit).

10. **Added `## Conditional Requirements` for episode plans, assessment items, sequence metadata, and omission notes.**  
   - **Rationale:** Audit called for explicit conditional obligations tied to upstream artefact availability and binding sequence behavior.  
   - **Source:** Missing From Current Spec #2.

11. **Added `## Source Artefact Policy` and normalized `source_artefacts` stance.**  
   - **Rationale:** Audit surfaced shape drift and ambiguity (array vs object), requiring normalized provenance structure prior to schema freeze.  
   - **Source:** Fields and Structures Inventory (`source_artefacts` variance), Missing From Current Spec #3, Investigate recommendations.

12. **Updated `## Required Metadata` with metadata scope/legacy stance guidance.**  
   - **Rationale:** Audit identified unconstrained metadata sections as legacy/defensive and required a bounded metadata policy.  
   - **Source:** Missing From Current Spec #6, Candidate v2 Recommendations (Remove ambiguous metadata dump sections).

13. **Added `## Legacy Structure Policy` defining treatment of legacy structures and defensive prompt-control payloads.**  
   - **Rationale:** Audit recommended explicit separation of contract-required v2 schema from legacy compatibility surfaces.  
   - **Source:** Contract Alignment (legacy/defensive fields), Missing From Current Spec #5/#6, Candidate v2 Recommendations (Remove).

14. **Expanded `## Open Questions` with schema-freeze decision points from audit.**  
   - **Rationale:** Audit highlighted unresolved decisions that materially affect schema finalization and compatibility strategy.  
   - **Source:** Fields requiring decision before schema freeze, Investigate recommendations.
