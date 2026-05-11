# domain-general-artefacts.md

## Purpose
Defines generic artefact contracts reusable across domains and workflows.

---

## Artefact Contracts

Each artefact definition should include:

- description
- purpose
- typical structure
- reuse expectations

This keeps artefacts usable as stable interfaces between workflow steps.

---

## Generic Artefact Types

Artefacts may be:

- foundational / analytical (e.g. normalized inputs, extracted findings)
- synthesized (e.g. consolidated interpretations, summaries, models)
- assembled outputs (delivery-ready structured representations)

These categories are structural, not domain-specific content models.

---

## Core Generic Artefact Examples

### normalized_content
Cleaned and structured source content ready for downstream use.

### summary
Concise synthesis of key points or findings.

### key_points
Structured extraction of priority ideas.

### structured_data
Schema-shaped representation suitable for deterministic reuse.

### analysis
Interpreted breakdown grounded in upstream inputs.

### entities
Identified concepts/objects/actors relevant to task context.

### relationships
Structured links between entities or concepts.

---

## Stability and Reuse

- Treat artefacts as stable step-to-step interfaces.
- Prefer structured artefacts over raw unstructured text for downstream work.
- Keep naming and schema intent consistent across workflows.
- Preserve traceability from artefacts back to upstream sources.
