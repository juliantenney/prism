# domain-general-step-patterns.md

## Purpose
Defines the platform-level structure for workflow step patterns across domains.

---

## Canonical Step Contract

Domains may define concrete canonical steps using this structure:

- title
- type / pattern family
- purpose
- input artefacts
- output artefact(s)
- aliases
- role anchor
- prompt template / prompt factory
- runnerInstructions

This file defines the contract only; each domain provides its own concrete steps.

---

## Workflow Policy Contract

Domains may provide a `workflowPolicy` object to control composition and ordering.

Key fields:

- `canonicalSteps`: authoritative list of canonical step titles
- `maxOccurrences`: maximum repeats per step title
- `dependencies`: required/optional artefact prerequisites and produced artefacts
- `precedenceRules`: ordering constraints between step pairs
- `triggerRules`: inclusion/exclusion signals from brief intent/factors
- `stepRoleAnchors`: short functional purpose anchors for canonical steps
- `finalSteps`: steps that should be forced to the end of a workflow

These policy fields allow deterministic planning while preserving domain flexibility.

---

## Runner Guidance Contract

Canonical step prompt metadata may include:

`runnerInstructions`:
- `what_this_step_does`

Guidance is user-facing and intended for sequential execution in a single continuous LLM conversation.  
It should be concise and operational, and should not require re-pasting prior artefacts as a default behavior.

---

## Metadata vs Runner Guidance

- System parameters/configuration blocks are system-facing metadata.
- `runnerInstructions` are user-facing operational guidance.
- Runtime views may hide system metadata while still preserving it in workflow data.

---

## Step Pattern Families

Retained abstract families:

- Extract
- Transform
- Analyse
- Generate
- Validate
- Format

These are generic families only. Domains define concrete canonical steps built from them.

---

## Usage

- Combine pattern families to build coherent workflows.
- Keep steps aligned to one primary transformation intent where possible.
- Use workflow policy to preserve dependency integrity and stable execution ordering.

### Workflow Brief Config
```json
{
  "workflowBriefConfig": {
    "version": "1",
    "requiredFactors": [
      {
        "id": "input_strategy",
        "label": "Input strategy",
        "question": "Should this workflow generate from a topic, rely on uploaded material, or combine both?",
        "type": "select",
        "required": true,
        "choices": [
          { "value": "generate_from_topic", "label": "Generate content" },
          { "value": "provided_source_content", "label": "Use uploaded material" },
          { "value": "mixed", "label": "Mix uploaded material and generated content" }
        ]
      }
    ],
    "optionalFactors": [],
    "inferenceRules": [],
    "mappingRules": [
      {
        "factor": "input_strategy",
        "mapsTo": ["workflow.workflowOutputSpec.constraints.input_strategy"]
      }
    ],
    "stopConditions": ["all_required_factors_resolved"],
    "questionPolicy": {
      "maxDefaultQuestions": 4,
      "askOptionalByDefault": false
    }
  }
}
```
