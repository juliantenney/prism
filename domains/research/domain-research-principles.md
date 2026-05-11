# domain-research-principles.md

## Purpose

This document defines the core principles that should guide the creation of research-focused workflows within PRISM.

These principles act as **constraints and quality criteria** for workflow generation in research contexts.  
They should be applied consistently across all steps, prompts, and artefacts.

---

# 1. Fidelity to Source Material

Research workflows must remain grounded in the provided source material.

### Requirements

- Do not introduce unsupported claims.
- Distinguish clearly between:
  - what the source states
  - what is inferred
  - what remains uncertain
- Preserve nuance, limitations, and ambiguity where present.

---

# 2. Traceability

Research outputs must be traceable back to their source inputs or upstream artefacts.

### Requirements

- Outputs should be explainable from:
  - raw content
  - normalized content
  - research analysis artefacts
- Claims, themes, findings, and summaries should be attributable to identifiable source material.

---

# 3. Structured Analysis

Research workflows should convert unstructured inputs into structured representations before generating higher-level outputs.

### Requirements

- Prefer intermediate artefacts such as:
  - normalized_content
  - key_findings
  - evidence_map
  - argument_structure
  - thematic_analysis
- Avoid jumping directly from raw content to polished output where analysis is required.

---

# 4. Distinction Between Description and Interpretation

Research workflows must separate:
- description of source material
- interpretation of source material
- synthesis across sources

### Requirements

- Prompts and steps should make clear whether they are:
  - extracting
  - analysing
  - synthesising
  - critiquing
- Do not present interpretation as direct fact without signalling it appropriately.

---

# 5. Evidence-Aware Synthesis

When combining or summarising material, workflows should preserve evidential weight and avoid flattening differences.

### Requirements

- Keep contradictory or competing positions visible where relevant.
- Do not overstate consensus.
- Reflect strength, scope, and limitations of the available material.

---

# 6. Appropriate Level of Abstraction

Research workflows should generate outputs at the right level for the task.

### Requirements

- Summaries should not omit essential qualifications.
- Syntheses should not collapse important distinctions.
- High-level outputs should remain grounded in detailed analysis.

---

# 7. Criticality and Uncertainty

Research workflows should preserve critical judgement and intellectual caution.

### Requirements

- Identify:
  - gaps
  - limitations
  - assumptions
  - unresolved questions
- Use cautious language where evidence is incomplete or mixed.
- Avoid false certainty.

---

# 8. Reusability of Analysis

Research workflows should produce artefacts that can be reused across downstream tasks.

### Requirements

- Prefer reusable intermediate outputs such as:
  - evidence_map
  - literature_matrix
  - thematic_analysis
  - research_summary
- Use stable naming and clear structure.

---

# 9. Clarity and Precision

Research outputs should be clear, concise, and precise.

### Requirements

- Avoid unnecessary jargon unless the context requires it.
- Use explicit terminology for:
  - themes
  - findings
  - methods
  - claims
  - evidence
- Maintain conceptual consistency across steps.

---

# 10. Fit for Research Purpose

Research workflows should reflect the intended research task.

### Examples

- literature review
- source comparison
- thematic coding
- evidence extraction
- briefing note
- annotated summary
- research question development

### Requirements

- Workflow structure should match the actual research purpose.
- Do not force all research tasks into the same step sequence.

---

# How to Apply These Principles in Workflows

When generating or evaluating research workflows:

- Use these principles to:
  - decide which steps to include
  - shape prompt instructions
  - validate outputs
- If trade-offs are needed:
  - prioritise fidelity, traceability, and clarity

---

# Summary

These principles define what “good research workflow design” means within PRISM.

They should be treated as:

> **non-optional constraints that guide workflow design and output quality**
