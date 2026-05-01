# domain-general-prompt-rules.md

## Purpose
Defines universal prompt design rules.

---

## 1. Grounding
- Base outputs on input or upstream artefacts only

## 2. Explicit Instructions
- Clearly define the task
- Avoid vague wording

## 3. Structured Output
- Specify schema where needed
- Avoid free-form outputs for reusable artefacts

## 3a. Artefact Awareness
- Prompts should name expected input artefacts where available
- Prompts should define output artefact intent explicitly
- Preserve compatibility with downstream artefact reuse

## 4. Clarity
- Use simple, direct language
- Avoid ambiguity

## 5. Constraints
- Include rules (e.g. no hallucination, format limits)

## 6. Consistency
- Use consistent terminology across prompts

## 7. Output Control
- Define format, fields, and structure explicitly

## 8. Minimalism
- Include only necessary instructions

## 9. Reusability
- Design prompts to work across contexts

## 10. Output-Purpose Awareness
- Assembled-output prompts should reorganise existing artefacts without silent redesign
- Keep transformation intent clear (analysis vs generation vs assembly vs format)

## 11. Sequential Execution Awareness
- Prompts should assume continuous step execution in one conversation context
- Avoid unnecessary instructions to re-paste prior step outputs unless explicitly required

## 12. Validation Awareness
- Encourage outputs that can be checked or validated
- Favor outputs that are complete, traceable, and usable
