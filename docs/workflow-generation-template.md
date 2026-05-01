# Workflow Generation Prompt Template (for GPT)

Use this prompt with ChatGPT (or similar) to generate import-ready PRISM workflow bundles.

```text
You are generating an import-ready PRISM workflow bundle.

Use the attached documentation as the source of truth:
- workflow-spec.md
- workflow-authoring.md
- pattern-library.md
- (optional) one example JSON from docs/examples

CRITICAL OUTPUT RULES
1) Return JSON only. No markdown, no explanation, no comments.
2) Return exactly one top-level object:
   {
     "version": 1,
     "prompts": [...],
     "workflows": [...]
   }
3) Ensure all IDs are unique strings.
4) Ensure every step.promptId exists in prompts[].id.
5) Ensure each step.inputKind is one of: "text", "file", "url", "none".
6) Use epoch milliseconds for createdAt and updatedAt.
7) Use source: "manual" for prompts unless explicitly told otherwise.
8) Include prompts + workflows together (do not return workflow-only unless explicitly requested).

WORKFLOW BRIEF
Goal:
<Describe what the workflow must accomplish>

Optional: User intent category
<e.g. generate quiz, create lesson, build module, design facilitator guide>

Primary user/audience:
<Who this is for>

Inputs / artefacts:
<What will be provided to run this workflow>

Scope and constraints:
<e.g. lesson vs module, duration, learner effort, accessibility, tone, standards>

Required outputs:
<What assets must exist at the end>

Step count preference:
<e.g. 5-7 steps, or “as many as needed”>

Workflow mode:
<compact (4-6 steps) or full (6-8 steps)>

Prompt style preference:
<e.g. concise, structured tables, rubric-based, JSON outputs>

QUALITY REQUIREMENTS
- Make steps actionable and non-redundant.
- Use outputName on steps whose outputs are reused later.
- Use inputFromStepId to chain dependent steps.
- Include practical notes for each step.
- Keep pedagogy alignment explicit (outcomes -> activities -> assessments).
- Each step should be understandable and executable in isolation given its declared inputs.
- Specify output format explicitly whenever outputs are reused downstream.
- Do not introduce artefacts unless required by final outputs or used downstream.
- Prefer 5-8 steps unless complexity clearly requires more.
- Avoid splitting steps unless task type changes, human review is needed, or output is reused.

SELF-CHECK BEFORE FINAL OUTPUT
- JSON parses successfully.
- All references resolve (step.promptId and inputFromStepId).
- No missing required prompt fields (id, title, body).
- No invalid enums in inputKind.
- Reused outputs are explicitly named with outputName.
- Final output is JSON only.
```

## Optional Short Version

Use this when you want a quicker request:

```text
Using the attached PRISM docs, generate ONE import-ready PRISM bundle JSON.
Return JSON only.

Goal: <...>
Inputs/artefacts: <...>
Scope/constraints: <...>
Required outputs: <...>
```
