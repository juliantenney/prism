# domain-research-prompt-rules.md

## Purpose

This document defines the prompt design rules for research-focused workflows within PRISM.

These rules ensure that prompts:
- produce consistent, structured outputs
- adhere to research quality principles
- generate artefacts that are reusable across workflows

---

# Core Principles

## 1. Grounding in Source Content

- All outputs must be based on:
  - the original input content
  - or upstream artefacts (e.g. normalized_content, key_findings, evidence_map)

- Do NOT:
  - introduce unsupported claims
  - invent evidence
  - flatten uncertainty into certainty

---

## 2. Explicit Task Definition

Prompts must clearly state:
- what transformation is required
- what the input represents
- what the output should achieve

Avoid vague instructions like:
- “analyse this”
- “improve this”
- “summarise this” without specifying purpose

Prefer:
- “extract the key findings and represent them as…”
- “map claims to supporting evidence…”

---

## 3. Structured Output Requirement

Prompts must specify output format when outputs are reused.

Preferred formats:
- JSON (for machine-readable artefacts)
- structured tables or clearly labelled sections

Always:
- define the schema
- include field names
- avoid free-form prose for reusable artefacts

---

## 4. Artefact Awareness

Prompts must:
- refer explicitly to input artefacts
- produce clearly named output artefacts

Example:
- “Using the evidence_map…”
- “Output as thematic_analysis…”

This ensures compatibility across workflow steps.

---

## 5. Traceability Enforcement

Prompts must preserve traceability between outputs and source material.

Examples:
- link findings to evidence
- distinguish claims from interpretations
- identify where support is weak or absent

Include explicit instructions such as:
- “maintain links to source evidence”
- “do not present inferred conclusions as directly stated fact”

---

## 6. Distinguish Extraction, Interpretation, and Synthesis

Prompts must be explicit about which of these is being performed.

- Extraction = what is present in the source
- Interpretation = what the source implies or suggests
- Synthesis = what emerges across sources or artefacts

Do not blur these levels unintentionally.

---

## 7. Preserve Uncertainty and Limitation

Where relevant, prompts should require:
- identification of limitations
- preservation of ambiguity
- signalling of weak or incomplete evidence

Avoid prompts that imply unwarranted certainty.

---

## 8. Clarity and Precision

Prompts should instruct the model to:
- use clear, direct language
- avoid unnecessary verbosity
- define specialised language where needed
- preserve nuance without becoming vague

---

## 9. Purpose Awareness

Prompts should reflect the actual research use case.

Examples:
- literature review
- evidence briefing
- source comparison
- thematic coding
- research question generation

Do not use the same prompt shape for all research tasks.

---

## 10. Controlled Abstraction

Prompts may allow generalisation, but within constraints.

- Encourage:
  - synthesis where justified
  - comparison where evidence supports it
- Constrain:
  - scope to source content and artefacts
  - interpretation to what is supportable

---

# Prompt Construction Pattern

A good research prompt typically includes:

1. Context
   - what the input is

2. Task
   - what transformation to perform

3. Constraints
   - rules to follow (e.g. traceability, fidelity, uncertainty)

4. Output format
   - explicit structure (JSON/schema)

5. Guidelines
   - quality expectations

---

# Summary

These rules ensure that prompts within research workflows:

- produce consistent outputs
- support reusable artefacts
- enforce research quality
- preserve traceability and nuance
- integrate seamlessly into PRISM workflows
