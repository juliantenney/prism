# domain-general-principles.md

## Purpose
Defines universal quality principles for all PRISM workflows.

---

## 1. Fidelity to Source
- Do not introduce unsupported information
- Ground all outputs in inputs or upstream artefacts

## 2. Structured Outputs
- Prefer JSON or clearly structured formats
- Define explicit schemas when outputs are reused

## 3. Atomic Steps
- Each step performs one coherent transformation
- Avoid mixing unrelated tasks

## 4. Clear Intent
- Each workflow and step must have a clear purpose
- Avoid ambiguity in task definition

## 5. Reusability
- Outputs should be reusable across workflows
- Use consistent naming for artefacts

## 6. Non-redundancy
- Avoid repeating transformations already performed
- Reuse upstream artefacts where possible

## 7. Traceability
- Outputs should be explainable from inputs
- Maintain clear flow between steps

## 8. Validation
- Include checks or validation where quality matters
- Ensure outputs meet constraints

## 9. Dependency integrity
- Downstream outputs must preserve required upstream prerequisites
- If a requested output depends on upstream artefacts, include prerequisite-producing steps

## 10. Explicit intent precedence
- Explicit user-requested outputs override default/inferred structure
- Preserve dependencies when applying explicit intent overrides

## 11. Operational usability
- Outputs intended for human use must be directly usable, not merely schema-valid
- Prefer actionable outputs over descriptive placeholders

## 12. Separation of concerns
- Distinguish between:
- analysis
- generation
- assembled outputs
- formatting/rendering

## 13. Clarity
- Outputs must be concise and unambiguous
