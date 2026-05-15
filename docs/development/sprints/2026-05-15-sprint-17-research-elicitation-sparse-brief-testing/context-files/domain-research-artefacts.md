# domain-research-artefacts.md

## Purpose

This document defines the canonical artefacts used in research-focused workflows within PRISM.

Artefacts are the **core data structures** that workflows produce and consume.  
They act as stable interfaces between steps and enable composability across workflows.

---

# Design Principles

- Artefacts must be:
  - clearly named
  - reusable across workflows
  - structured (prefer JSON-compatible formats)
  - grounded in source content
  - appropriate to research tasks

- Avoid:
  - vague names (e.g. "result", "notes")
  - one-off artefacts that are not reused
  - outputs that combine extraction, interpretation, and synthesis without distinction

---

# Core Artefacts

## 1. normalized_content

### Description
A cleaned and structured representation of raw input content.

### Purpose
- Removes noise and irrelevant material
- Segments content into meaningful sections
- Prepares source material for further analysis

### Typical Structure
- topic
- purpose
- sections
- key ideas
- examples
- claims

---

## 2. argument_structure

### Description
A structured representation of the arguments in a source.

### Purpose
- Identifies major claims
- Links claims to supporting reasons or evidence
- Surfaces assumptions or counterpositions where visible

### Typical Structure
- claims
- supporting_points
- evidence_links
- assumptions
- counterarguments

---

## 3. key_findings

### Description
A structured list of the main findings, conclusions, or takeaways from a source.

### Purpose
- Supports summarisation
- Enables comparison across sources
- Provides a reusable research artefact

### Typical Structure
- finding
- explanation
- evidence_basis
- confidence or limitation notes

---

## 4. evidence_map

### Description
A structured mapping of claims, findings, or themes to supporting evidence.

### Purpose
- Maintains traceability
- Helps distinguish strong from weak support
- Supports synthesis and briefing

### Typical Structure
- claim_or_theme
- supporting_evidence
- source_location
- strength_notes

---

## 5. thematic_analysis

### Description
A structured representation of themes emerging from one or more sources.

### Purpose
- Supports qualitative synthesis
- Organises recurring ideas, tensions, and patterns
- Enables downstream writing tasks

### Typical Structure
- theme
- description
- supporting_examples
- tensions_or_variations

---

## 6. literature_matrix

### Description
A comparative table or structure for reviewing multiple sources.

### Purpose
- Supports literature reviews
- Enables cross-source comparison
- Makes differences and similarities visible

### Typical Structure
- source
- topic
- method
- findings
- limitations
- relevance

---

## 7. research_summary

### Description
A concise research-focused summary of a source or set of sources.

### Purpose
- Supports briefing, review, or knowledge transfer
- Preserves key findings and limitations
- Can be reused in reports or proposals

---

## 8. briefing_note

### Description
A structured output designed for decision support or concise communication.

### Purpose
- Converts research analysis into usable briefings
- Highlights key issues, evidence, and implications

---

## 9. research_questions

### Description
A set of candidate or refined research questions.

### Purpose
- Supports project scoping
- Links source analysis to further inquiry

### Requirements
- Must be grounded in analysed material
- Should reflect gaps, tensions, or unresolved issues

---

## 10. annotated_source_notes

### Description
Structured notes about a source, with emphasis on relevance, contribution, and limitation.

### Purpose
- Supports review and reuse
- Helps build evidence bases and literature reviews

---

# Usage Guidelines

- Workflows should:
  - produce artefacts with outputName
  - reuse artefacts via inputFromStepId
  - maintain consistency in naming

- Prefer:
  - chaining artefacts across workflows
  - reusing core artefacts rather than redefining them
  - separating extraction artefacts from interpretation artefacts

---

# Summary

Artefacts are the **foundation of composable research workflows** in PRISM.

They enable:
- reuse
- consistency
- traceability
- quality control
- interoperability between workflows
