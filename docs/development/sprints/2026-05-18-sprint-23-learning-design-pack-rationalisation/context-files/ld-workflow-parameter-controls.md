# LD workflowParameterControls (snapshot)

**Canonical source (authoritative):**  
`domains/learning-design/domain-learning-design-step-patterns.md` — `workflowBriefConfig.workflowParameterControls` (approx. lines **842–903**)

**Why this matters for Sprint 23:** These four controls are the **workflow-level** pedagogical surface in unified Settings. Sprint 23 must align them with `requiredFactors` / `optionalFactors` and `mappingRules` so elicitation does not re-ask what Settings already owns (`elicitation: "settings-only"`).

---

## Summary

| key | Maps from brief factor | `elicitation` |
|-----|------------------------|---------------|
| `delivery_context` | `delivery_context` (optional) | settings-only |
| `design_scope` | `design_scope` (required) | settings-only |
| `input_strategy` | `input_strategy` (required) | settings-only |
| `duration_minutes` | `duration_minutes` (optional) | settings-only |

All four duplicate semantics already collected at workflow brief level; Sprint 23 should document **precedence** (brief → synthesis → Settings → step params).

---

## Excerpt (workflowParameterControls)

```json
"workflowParameterControls": [
  {
    "key": "delivery_context",
    "label": "Delivery context",
    "description": "How learners progress through the design (pedagogic delivery mode).",
    "controlType": "select",
    "default": "blended",
    "options": [
      { "value": "in_person", "label": "In-person classroom/workshop" },
      { "value": "online_sync", "label": "Live online (synchronous)" },
      { "value": "online_async", "label": "Self-paced online (asynchronous)" },
      { "value": "blended", "label": "Blended (in-person + online)" },
      { "value": "self_directed", "label": "Self-directed independent progression" }
    ],
    "visible": true,
    "advanced": false,
    "elicitation": "settings-only"
  },
  {
    "key": "design_scope",
    "label": "Design scope",
    "description": "Breadth of the learning design (single activity through module).",
    "controlType": "select",
    "default": "session",
    "options": [
      { "value": "single_activity", "label": "Single activity" },
      { "value": "session", "label": "Session" },
      { "value": "sequence", "label": "Sequence" },
      { "value": "module", "label": "Module" }
    ],
    "visible": true,
    "advanced": false,
    "elicitation": "settings-only"
  },
  {
    "key": "input_strategy",
    "label": "Input strategy",
    "description": "Whether the workflow generates from a topic, uses uploaded material, or both.",
    "controlType": "select",
    "default": "generate_from_topic",
    "options": [
      { "value": "generate_from_topic", "label": "Generate content" },
      { "value": "provided_source_content", "label": "Use uploaded material" },
      { "value": "mixed", "label": "Mix uploaded and generated content" }
    ],
    "visible": true,
    "advanced": false,
    "elicitation": "settings-only"
  },
  {
    "key": "duration_minutes",
    "label": "Session duration (minutes)",
    "description": "Total session duration used for sequencing and workflow constraints.",
    "controlType": "number",
    "default": "60",
    "min": 10,
    "max": 480,
    "visible": true,
    "advanced": false,
    "elicitation": "settings-only"
  }
]
```
