# domain-research-step-patterns.md

## Purpose

This document defines the canonical step patterns used in research-focused workflows within PRISM.

Step patterns describe **common transformations** that occur in research workflows.  
They provide a consistent way to structure workflows and ensure that research processes are applied correctly.

---

# Design Principles

- Each step should have:
  - a clear purpose
  - a defined input artefact (where applicable)
  - a well-defined output artefact

- Steps should:
  - represent meaningful transformations
  - avoid combining unrelated tasks
  - produce reusable artefacts
  - preserve fidelity and traceability

- Prefer:
  - clear boundaries between extraction, analysis, synthesis, and formatting
  - reuse of canonical artefacts

### Metadata and Runner Guidance

- Prompt configuration and parameter blocks are system-facing metadata.
- `runnerInstructions` fields are user-facing operational guidance.
- Runtime workflow views may hide system metadata while still preserving it in workflow data.

---

# Core Step Patterns

### Workflow Policy
```json
{
  "workflowPolicy": {
    "canonicalSteps": [
      "Generate Research Content",
      "Normalize Content",
      "Extract Key Findings",
      "Model Argument Structure",
      "Build Evidence Map",
      "Conduct Thematic Analysis",
      "Build Literature Matrix",
      "Generate Research Questions",
      "Generate Research Summary",
      "Generate Briefing Note",
      "Validate Research Output",
      "Format Final Output",
      "Design Page"
    ],
    "maxOccurrences": {
      "Generate Research Content": 1,
      "Normalize Content": 1,
      "Extract Key Findings": 1,
      "Model Argument Structure": 1,
      "Build Evidence Map": 1,
      "Conduct Thematic Analysis": 1,
      "Build Literature Matrix": 1,
      "Generate Research Questions": 1,
      "Generate Research Summary": 1,
      "Generate Briefing Note": 1,
      "Validate Research Output": 1,
      "Format Final Output": 1,
      "Design Page": 1
    },
    "dependencies": {
      "Generate Research Content": { "requiresAnyOf": ["topic", "normalized_content"], "produces": ["research_content"] },
      "Normalize Content": { "requiresAnyOf": ["research_content", "source_material"], "produces": ["normalized_content"] },
      "Extract Key Findings": { "requiresAnyOf": ["normalized_content", "research_content"], "produces": ["key_findings"] },
      "Model Argument Structure": { "requiresAnyOf": ["normalized_content", "research_content"], "produces": ["argument_structure"] },
      "Build Evidence Map": { "requiresAnyOf": ["key_findings", "argument_structure", "normalized_content", "research_content"], "produces": ["evidence_map"] },
      "Conduct Thematic Analysis": { "requiresAnyOf": ["key_findings", "normalized_content", "research_content"], "produces": ["thematic_analysis"] },
      "Build Literature Matrix": { "requiresAnyOf": ["key_findings", "thematic_analysis"], "produces": ["literature_matrix"] },
      "Generate Research Questions": { "requiresAnyOf": ["key_findings", "evidence_map", "thematic_analysis", "literature_matrix", "research_content"], "produces": ["research_questions"] },
      "Generate Research Summary": { "requiresAnyOf": ["key_findings", "evidence_map", "thematic_analysis", "argument_structure", "research_content"], "produces": ["research_summary"] },
      "Generate Briefing Note": { "requiresAnyOf": ["research_summary", "evidence_map", "thematic_analysis", "research_content"], "produces": ["briefing_note"] },
      "Validate Research Output": { "requiresAnyOf": ["research_questions", "research_summary", "briefing_note", "thematic_analysis", "literature_matrix", "evidence_map"], "produces": ["validated_research_output"] },
      "Format Final Output": { "requiresAnyOf": ["validated_research_output", "research_summary", "briefing_note", "research_questions"], "produces": ["final_output"] },
      "Design Page": { "requiresAnyOf": ["validated_research_output", "final_output", "briefing_note", "research_summary", "thematic_analysis", "evidence_map", "research_questions"], "produces": ["page"] }
    },
    "precedenceRules": [
      ["Generate Research Content", "Normalize Content"],
      ["Normalize Content", "Extract Key Findings"],
      ["Normalize Content", "Model Argument Structure"],
      ["Extract Key Findings", "Build Evidence Map"],
      ["Model Argument Structure", "Build Evidence Map"],
      ["Extract Key Findings", "Conduct Thematic Analysis"],
      ["Build Evidence Map", "Conduct Thematic Analysis"],
      ["Conduct Thematic Analysis", "Build Literature Matrix"],
      ["Build Literature Matrix", "Generate Research Questions"],
      ["Conduct Thematic Analysis", "Generate Research Summary"],
      ["Generate Research Summary", "Generate Briefing Note"],
      ["Generate Research Questions", "Validate Research Output"],
      ["Generate Research Summary", "Validate Research Output"],
      ["Generate Briefing Note", "Validate Research Output"],
      ["Validate Research Output", "Format Final Output"],
      ["Validate Research Output", "Design Page"],
      ["Format Final Output", "Design Page"]
    ],
    "triggerRules": [
      {
        "whenResolvedFactorsInclude": { "objective_type": "summary" },
        "include": ["Generate Research Summary"]
      },
      {
        "whenResolvedFactorsInclude": { "objective_type": "briefing" },
        "include": ["Generate Briefing Note"]
      },
      {
        "whenResolvedFactorsInclude": { "objective_type": "questions" },
        "include": ["Generate Research Questions"]
      },
      {
        "whenResolvedFactorsInclude": { "objective_type": "analysis" },
        "include": ["Conduct Thematic Analysis"]
      }
    ],
    "stepRoleAnchors": {
      "Generate Research Content": "Generate or extend structured grounding content for downstream extraction, modelling, and synthesis.",
      "Normalize Content": "Prepare source material into clean, structured research-ready input.",
      "Extract Key Findings": "Extract high-confidence findings and evidence-backed takeaways.",
      "Model Argument Structure": "Model claims, evidence, assumptions, and counterpositions.",
      "Build Evidence Map": "Link findings/claims to traceable supporting evidence.",
      "Conduct Thematic Analysis": "Synthesize recurring themes, tensions, and comparative insights.",
      "Build Literature Matrix": "Compare sources consistently across key analytical dimensions.",
      "Generate Research Questions": "Generate grounded research questions from analysed evidence.",
      "Generate Research Summary": "Produce concise evidence-grounded synthesis for stakeholders.",
      "Generate Briefing Note": "Package findings into decision-oriented briefing output.",
      "Validate Research Output": "Check fidelity, traceability, rigor, and usability before delivery.",
      "Format Final Output": "Render validated research artefacts into final delivery format.",
      "Design Page": "Assemble renderer-ready page JSON from validated research artefacts for downstream HTML/VLE delivery."
    },
    "finalSteps": ["Format Final Output", "Design Page"]
  }
}
```

**Documentation order vs `canonicalSteps`:** `workflowPolicy.canonicalSteps` lists **Generate Research Content** before **Normalize Content** for planner composition. The **numbered sections** below place **Normalize Content** first (§1) then **Generate Research Content** (§2) for a “prepare material → generate” reading order; headings still use the exact canonical step titles.

### Workflow Brief Config
```json
{
  "workflowBriefConfig": {
    "version": "1",
    "requiredFactors": [
      {
        "id": "objective_type",
        "label": "Research objective type",
        "question": "What is the primary objective? (summary/analysis/briefing/questions)",
        "type": "select",
        "required": true,
        "choices": [
          { "value": "summary", "label": "Summary" },
          { "value": "analysis", "label": "Analysis" },
          { "value": "briefing", "label": "Briefing Note" },
          { "value": "questions", "label": "Research Questions" }
        ]
      },
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
      },
      {
        "id": "audience",
        "label": "Audience",
        "question": "Who is the output for?",
        "type": "text",
        "required": true
      },
      {
        "id": "output_depth",
        "label": "Output depth",
        "question": "How deep should the analysis be? (concise/standard/detailed)",
        "type": "select",
        "required": true,
        "choices": ["concise", "standard", "detailed"]
      }
    ],
    "optionalFactors": [
      {
        "id": "citation_style",
        "label": "Citation style",
        "question": "Citation style (if needed): apa/mla/chicago/none",
        "type": "select",
        "choices": ["apa", "mla", "chicago", "none"]
      }
    ],
    "uiHints": {
      "design_intent": "Describe the research workflow outcome to produce.",
      "audience": "Who will consume this research output.",
      "scope_scale": "Describe the expected breadth, depth, or stage of the research output.",
      "scope_scale_label": "Research scope",
      "scope_scale_placeholder": "e.g. short evidence scan, literature summary, full report section, ongoing research workflow",
      "inputs": "Source materials available at workflow start.",
      "desired_outputs": "Expected deliverables (summary, briefing, matrix, questions, etc.).",
      "constraints": "Hard requirements: method, policy, citation, tooling, delivery."
    },
    "extraFields": [
      {
        "id": "evidence_rigour",
        "label": "Evidence rigour (optional)",
        "type": "select",
        "choices": ["exploratory", "standard", "strict"],
        "helpText": "Adjusts expectations for evidence quality and caveat handling."
      }
    ],
    "inferenceRules": [
      {
        "whenGoalMentionsAnyOf": ["brief", "briefing", "note"],
        "set": {
          "objective_type": "briefing"
        }
      }
    ],
    "mappingRules": [
      {
        "factor": "objective_type",
        "mapsTo": [
          "workflow.workflowOutputSpec.constraints.objective_type"
        ]
      },
      {
        "factor": "evidence_rigour",
        "mapsTo": [
          "workflow.workflowOutputSpec.constraints.evidence_rigour"
        ]
      },
      {
        "factor": "input_strategy",
        "mapsTo": [
          "workflow.workflowOutputSpec.constraints.input_strategy"
        ]
      },
      {
        "factor": "audience",
        "mapsTo": [
          "workflow.workflowOutputSpec.audience"
        ]
      },
      {
        "factor": "output_depth",
        "mapsTo": [
          "workflow.workflowOutputSpec.constraints.output_depth"
        ]
      },
      {
        "factor": "citation_style",
        "mapsTo": [
          "workflow.workflowOutputSpec.constraints.citation_style"
        ]
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

## 1. Normalize Content

### Type
Extraction

### Input
Raw content (e.g. paper, chapter, report, transcript, notes)

### Output
normalized_content

### Purpose
- Clean and structure raw content
- Remove noise and redundancy
- Segment into meaningful units

### Aliases
- Extract Text
- Parse File
- Clean Content
- Normalize Text

### Prompt Factory
```json
{
  "configurationMode": "simple",
  "askForCustomSchema": false,
  "allowWorkflowGoalContext": true,
  "promptScope": "step_only",
  "structureStyle": "text_structured",
  "defaultPromptStrategy": "default_template",
  "promptTemplate": "You are preparing raw research material for structured analysis and downstream synthesis.\n\nTask:\nTransform the provided content into a clean, structured, and coherent representation that preserves meaning while removing noise and inconsistencies.\n\nInstructions:\n- Remove irrelevant material such as navigation text, duplicate content, formatting artefacts, and non-essential references\n- Preserve meaningful findings, evidence excerpts, and methodological details\n- Organise the content into clear sections with headings where appropriate\n- Improve clarity where sentences are fragmented or poorly structured, but do not change the meaning\n- Keep terminology and references consistent\n- Do not introduce new claims, interpretation, or external knowledge\n\nConfiguration:\n- Structure mode: {{option:structure_mode}}\n- Preserve citation markers: {{option:keep_citations}}\n- Lightly simplify language: {{option:simplify_language}}\n- Step notes: {{stepNotes}}\n\nOutput requirements:\n- Return normalized content in {{preferredOutputFormat}}\n- Preserve enough detail for downstream findings extraction and synthesis\n\nReturn only the normalized content.",
  "preferredOutputFormat": "structured_markdown",
  "defaultPromptNotes": "Normalize raw research source content into clean, sectioned text while preserving key meaning, citations, and evidence traceability.",
  "runnerInstructions": {
    "what_this_step_does": "This step cleans and structures source material into a consistent normalized artefact."
  },
  "defaultOutputStructure": {
    "sections": ["Source overview", "Normalized content", "Evidence notes", "Citation trace"]
  },
  "userOptions": [
    {
      "id": "structure_mode",
      "label": "Structure mode",
      "type": "select",
      "default": "reorganise_into_sections",
      "choices": [
        { "value": "preserve_original_structure", "label": "Preserve original structure" },
        { "value": "reorganise_into_sections", "label": "Reorganise into sections" }
      ]
    },
    {
      "id": "keep_citations",
      "label": "Preserve citation markers",
      "type": "boolean",
      "default": true
    },
    {
      "id": "simplify_language",
      "label": "Lightly simplify language",
      "type": "boolean",
      "default": false
    }
  ]
}
```

---

## 2. Generate Research Content

### Type
Generation

### Input
optional topic, optional audience, optional level, optional source_material

### Output
research_content

### Purpose
- Generate research-ready explanatory content when source material is missing
- Extend and improve existing source material when provided
- Produce structured content suitable for downstream research analysis and synthesis

### Aliases
- Create Research Content
- Draft Research Content
- Extend Source Content

### Prompt Factory
```json
{
  "configurationMode": "none",
  "askForCustomSchema": false,
  "defaultPromptStrategy": "default_template",
  "preferredOutputFormat": "json",
  "defaultPromptNotes": "Generate or extend structured research content suitable for downstream extraction, modelling, and synthesis.",
  "runnerInstructions": {
    "what_this_step_does": "This step generates or extends research grounding content when source material is missing or incomplete."
  },
  "defaultOutputStructure": {
    "keys": ["title", "sections", "key_concepts", "examples"]
  },
  "promptTemplate": "Context:\nYou may be provided with topic, audience, level, and optional source_material.\n\nTask:\nGenerate or extend structured research_content suitable as grounding input for downstream research workflows.\n\nInstructions:\n- If source_material is provided, extend and improve it by clarifying explanation, improving structure, and adding useful examples where appropriate\n- Do not discard or contradict valid source material\n- If source_material is not provided, generate content from topic, audience, and level\n- Include clear explanations, logical sectioning, key concepts, and illustrative examples\n- Progress from simpler framing to more advanced ideas where appropriate\n- Adapt vocabulary, depth, and technicality to the specified audience and level\n- Avoid generic summary text; produce purposeful, structured content designed for research grounding and analysis\n- Keep content grounded in provided topic and/or source material\n- Do not hallucinate unnecessary detail\n- Ensure the output can be used downstream for findings extraction, argument modelling, synthesis, and question generation\n- Apply step notes when provided: {{stepNotes}}\n\nOutput:\n- Return output as {{preferredOutputFormat}}\n- Return a JSON object containing: title, sections, key_concepts, examples\n- sections should be an ordered array with section title and section content\n- Return only the JSON."
}
```

---

## 3. Extract Key Findings

### Type
Extraction / Transformation

### Input
normalized_content or research_content

### Output
key_findings

### Purpose
- Identify the main findings, conclusions, or takeaways
- Capture them in a reusable structure

### Aliases
- Identify Key Findings
- Pull Key Findings
- Summarize Findings
- Identify key concepts and facts
- Extract key concepts and facts
- Extract core findings

### Prompt Factory
```json
{
  "configurationMode": "simple",
  "askForCustomSchema": false,
  "defaultPromptStrategy": "default_template",
  "promptTemplate": "You are extracting structured findings for use in a research workflow.\n\nTask:\nTransform the provided normalized content into a structured representation of the key findings, themes, evidence, and methodological features.\n\nInstructions:\n- Identify the central findings, themes, or claims in the material\n- Capture supporting evidence where present\n- Identify methodological features if described\n- Note limitations, caveats, or open questions where supported by the content\n- Keep the output grounded strictly in the provided material\n- Do not introduce external claims or unsupported interpretation\n\nConfiguration:\n- Target number of findings: {{option:finding_count}}\n- Include evidence snippets: {{option:include_evidence_snippets}}\n- Include themes: {{option:include_themes}}\n- Include methodology notes: {{option:include_methodology}}\n- Step notes: {{stepNotes}}\n\nOutput requirements:\n- Return the output as {{preferredOutputFormat}}\n- Make the structure reusable for downstream synthesis, interpretation, or reporting\n\nReturn only the JSON.",
  "preferredOutputFormat": "json",
  "defaultPromptNotes": "Extract high-confidence key findings and conclusions grounded in the normalized source, with concise evidence references where possible.",
  "runnerInstructions": {
    "what_this_step_does": "This step extracts key findings, themes, and evidence-backed takeaways from normalized/research content."
  },
  "defaultOutputStructure": {
    "keys": ["findings", "themes", "methodology_notes", "evidence_refs"]
  },
  "userOptions": [
    {
      "id": "finding_count",
      "label": "Target number of findings",
      "type": "number",
      "default": 8,
      "min": 3,
      "max": 20
    },
    {
      "id": "include_evidence_snippets",
      "label": "Include short evidence snippets",
      "type": "boolean",
      "default": true
    },
    {
      "id": "include_themes",
      "label": "Include themes",
      "type": "boolean",
      "default": true
    },
    {
      "id": "include_methodology",
      "label": "Include methodology notes",
      "type": "boolean",
      "default": true
    }
  ]
}
```

---

## 4. Model Argument Structure

### Type
Analysis

### Input
normalized_content or research_content

### Output
argument_structure

### Purpose
- Identify claims, reasons, evidence, assumptions, and counterpositions
- Support critique and synthesis

### Aliases
- Analyze Argument Structure
- Map Argument Structure
- Build Argument Model
- Model Argument Structure
- Identify claims and evidence
- Extract claims and evidence

### Prompt Factory
```json
{
  "configurationMode": "simple",
  "askForCustomSchema": false,
  "defaultPromptStrategy": "default_template",
  "preferredOutputFormat": "json",
  "defaultPromptNotes": "Model argument structure by identifying core claims, supporting reasons, evidence, assumptions, and counterpositions.",
  "runnerInstructions": {
    "what_this_step_does": "This step models argumentative structure across claims, reasons, evidence, and assumptions."
  },
  "defaultOutputStructure": {
    "keys": ["claims", "reasons", "evidence", "assumptions", "counterpositions"]
  },
  "userOptions": [
    {
      "id": "include_counterpositions",
      "label": "Include counterpositions",
      "type": "boolean",
      "default": true
    },
    {
      "id": "include_assumptions",
      "label": "Include assumptions",
      "type": "boolean",
      "default": true
    }
  ]
}
```

---

## 5. Build Evidence Map

### Type
Analysis

### Input
normalized_content, research_content, key_findings, or argument_structure

### Output
evidence_map

### Purpose
- Connect claims or themes to supporting evidence
- Maintain traceability across the workflow

### Aliases
- Generate Evidence Map
- Create Evidence Map
- Map Evidence
- Build evidence traceability map
- Create claims-to-evidence map

### Prompt Factory
```json
{
  "configurationMode": "simple",
  "askForCustomSchema": false,
  "defaultPromptStrategy": "default_template",
  "preferredOutputFormat": "json",
  "defaultPromptNotes": "Create an evidence map linking claims/themes to supporting evidence with clear traceability and confidence signals.",
  "runnerInstructions": {
    "what_this_step_does": "This step builds traceable links between findings/claims and supporting evidence."
  },
  "defaultOutputStructure": {
    "keys": ["evidence_map", "confidence", "gaps"]
  },
  "userOptions": [
    {
      "id": "include_confidence",
      "label": "Include confidence level",
      "type": "boolean",
      "default": true
    },
    {
      "id": "include_gaps",
      "label": "Flag evidence gaps",
      "type": "boolean",
      "default": true
    }
  ]
}
```

---

## 6. Conduct Thematic Analysis

### Type
Analysis / Synthesis

### Input
normalized_content, research_content, or multiple analysed sources

### Output
thematic_analysis

### Purpose
- Surface recurring themes, tensions, and patterns
- Enable comparison and synthesis

### Aliases
- Perform Thematic Analysis
- Generate Themes
- Analyze Themes
- Identify recurring themes
- Synthesize themes and tensions
- Synthesize Findings

### Prompt Factory
```json
{
  "configurationMode": "simple",
  "askForCustomSchema": false,
  "defaultPromptStrategy": "default_template",
  "promptTemplate": "You are synthesising structured research findings into a coherent analytical summary.\n\nTask:\nProduce a clear synthesis of the provided findings that highlights the main patterns, relationships, and implications.\n\nInstructions:\n- Integrate the key findings into a coherent narrative\n- Highlight important relationships, tensions, or contrasts\n- Include critical observations where supported\n- Maintain fidelity to the source material and upstream artefacts\n- Do not introduce unsupported claims or external knowledge\n\nConfiguration:\n- Synthesis depth: {{option:synthesis_depth}}\n- Include comparison: {{option:include_comparison}}\n- Include critique: {{option:include_critique}}\n- Step notes: {{stepNotes}}\n\nOutput requirements:\n- Return the synthesis in {{preferredOutputFormat}}\n- Use headings and clear prose\n- Keep the output suitable for downstream reporting or interpretation\n\nReturn only the synthesis.",
  "preferredOutputFormat": "structured_markdown",
  "defaultPromptNotes": "Conduct thematic analysis to surface recurring themes, tensions, and patterns across sources.",
  "runnerInstructions": {
    "what_this_step_does": "This step synthesizes recurring themes, tensions, and comparative insights across analysed sources."
  },
  "defaultOutputStructure": {
    "sections": ["Theme summary", "Comparative analysis", "Critique", "Evidence links"]
  },
  "userOptions": [
    {
      "id": "theme_count",
      "label": "Target number of themes",
      "type": "number",
      "default": 6,
      "min": 3,
      "max": 12
    },
    {
      "id": "include_contradictions",
      "label": "Highlight contradictions/tensions",
      "type": "boolean",
      "default": true
    },
    {
      "id": "synthesis_depth",
      "label": "Synthesis depth",
      "type": "select",
      "default": "balanced",
      "choices": [
        { "value": "concise", "label": "Concise" },
        { "value": "balanced", "label": "Balanced" },
        { "value": "deep", "label": "Deep" }
      ]
    },
    {
      "id": "include_comparison",
      "label": "Include comparison",
      "type": "boolean",
      "default": true
    },
    {
      "id": "include_critique",
      "label": "Include critique",
      "type": "boolean",
      "default": true
    }
  ]
}
```

---

## 7. Build Literature Matrix

### Type
Synthesis

### Input
multiple source artefacts

### Output
literature_matrix

### Purpose
- Compare sources systematically
- Support literature review workflows

### Aliases
- Generate Literature Matrix
- Create Literature Matrix
- Compare Sources Matrix

### Prompt Factory
```json
{
  "configurationMode": "simple",
  "askForCustomSchema": false,
  "defaultPromptStrategy": "default_template",
  "inputPriority": {
    "primary": "key_findings",
    "secondary": "thematic_analysis"
  },
  "preferredOutputFormat": "structured_markdown",
  "defaultPromptNotes": "Build a literature matrix that compares sources consistently across key dimensions relevant to the research goal.",
  "runnerInstructions": {
    "what_this_step_does": "This step compares sources systematically across selected analytical dimensions."
  },
  "defaultOutputStructure": {
    "sections": ["Comparison dimensions", "Source matrix", "Synthesis notes"]
  },
  "userOptions": [
    {
      "id": "comparison_focus",
      "label": "Comparison focus",
      "type": "select",
      "default": "method_findings_limitations",
      "choices": [
        { "value": "method_findings_limitations", "label": "Method, findings, limitations" },
        { "value": "theory_evidence_gaps", "label": "Theory, evidence, gaps" },
        { "value": "custom_goal_aligned", "label": "Goal-aligned synthesis" }
      ]
    }
  ]
}
```

---

## 8. Generate Research Questions

### Type
Generation

### Input
key_findings, thematic_analysis, evidence_map, literature_matrix, or research_content

### Output
research_questions

### Purpose
- Generate or refine research questions grounded in analysis
- Surface gaps, tensions, and next-step inquiry

### Aliases
- Define Research Questions
- Create Research Questions
- Draft Research Questions

### Prompt Factory
```json
{
  "configurationMode": "simple",
  "askForCustomSchema": false,
  "defaultPromptStrategy": "default_template",
  "inputPriority": {
    "primary": "key_findings",
    "secondary": "evidence_map"
  },
  "preferredOutputFormat": "structured_markdown",
  "defaultPromptNotes": "Generate research questions grounded in findings and synthesis, emphasizing clarity, feasibility, and relevance.",
  "runnerInstructions": {
    "what_this_step_does": "This step generates research questions grounded in findings, themes, and evidence."
  },
  "defaultOutputStructure": {
    "sections": ["Questions", "Rationale", "Priority order"]
  },
  "userOptions": [
    {
      "id": "question_count",
      "label": "Number of research questions",
      "type": "number",
      "default": 5,
      "min": 2,
      "max": 12
    },
    {
      "id": "include_priority_order",
      "label": "Prioritize questions",
      "type": "boolean",
      "default": true
    }
  ]
}
```

---

## 9. Generate Research Summary

### Type
Generation

### Input
key_findings, evidence_map, thematic_analysis, argument_structure, or research_content

### Output
research_summary

### Purpose
- Produce concise, faithful summaries for researchers or stakeholders

### Aliases
- Create Research Summary
- Draft Research Summary
- Summarize Research
- Generate Insights
- Generate Conclusions
- Generate Insights and Conclusions

### Prompt Factory
```json
{
  "configurationMode": "simple",
  "askForCustomSchema": false,
  "defaultPromptStrategy": "default_template",
  "inputPriority": {
    "primary": "research_summary",
    "secondary": "evidence_map"
  },
  "preferredOutputFormat": "json",
  "defaultPromptNotes": "Generate a faithful, concise research summary as JSON with top-level artifact_type for downstream utilities.",
  "runnerInstructions": {
    "what_this_step_does": "This step produces a concise, evidence-grounded research summary for stakeholders."
  },
  "defaultOutputStructure": {
    "keys": ["artifact_type", "title", "audience", "executive_summary", "key_findings", "evidence_backed_conclusions", "implications"]
  },
  "userOptions": [
    {
      "id": "summary_length",
      "label": "Summary length",
      "type": "select",
      "default": "medium",
      "choices": [
        { "value": "short", "label": "Short" },
        { "value": "medium", "label": "Medium" },
        { "value": "detailed", "label": "Detailed" }
      ]
    },
    {
      "id": "audience_style",
      "label": "Audience style",
      "type": "select",
      "default": "researcher",
      "choices": [
        { "value": "researcher", "label": "Researcher" },
        { "value": "executive", "label": "Executive" },
        { "value": "general", "label": "General audience" }
      ]
    }
  ]
}
```

---

## 10. Generate Briefing Note

### Type
Generation

### Input
research_summary, evidence_map, thematic_analysis, or research_content

### Output
briefing_note

### Purpose
- Package research analysis into concise, decision-oriented outputs

### Aliases
- Create Briefing Note
- Draft Briefing Note
- Generate Policy Brief

### Prompt Factory
```json
{
  "configurationMode": "simple",
  "askForCustomSchema": false,
  "defaultPromptStrategy": "default_template",
  "preferredOutputFormat": "json",
  "defaultPromptNotes": "Create a decision-oriented briefing note as JSON with top-level artifact_type for downstream utilities.",
  "runnerInstructions": {
    "what_this_step_does": "This step packages research outputs into a decision-oriented briefing note."
  },
  "defaultOutputStructure": {
    "keys": ["artifact_type", "title", "audience", "context", "findings", "recommendations", "risks_and_caveats"]
  },
  "userOptions": [
    {
      "id": "recommendation_count",
      "label": "Number of recommendations",
      "type": "number",
      "default": 4,
      "min": 2,
      "max": 10
    },
    {
      "id": "include_risks",
      "label": "Include risks and caveats",
      "type": "boolean",
      "default": true
    }
  ]
}
```

---

## 11. Validate Research Output

### Type
Evaluation

### Input
one or more research artefacts

### Output
validated or improved artefacts

### Purpose
- Check fidelity, traceability, clarity, and balance
- Identify overclaiming, missing evidence, or weak synthesis

### Aliases
- Validate Research
- Quality Check Research Output
- Review Research Output
- Validate evidence and claims
- Validate research synthesis

### Prompt Factory
```json
{
  "configurationMode": "simple",
  "askForCustomSchema": false,
  "defaultPromptStrategy": "default_template",
  "preferredOutputFormat": "structured_markdown",
  "defaultPromptNotes": "Validate research outputs for fidelity, traceability, clarity, and methodological fit; identify weaknesses and propose improvements.",
  "runnerInstructions": {
    "what_this_step_does": "This step evaluates research outputs for rigor, fidelity, and usability before final delivery."
  },
  "defaultOutputStructure": {
    "sections": ["Validation summary", "Rigour checks", "Bias checks", "Completeness checks", "Priority improvements"]
  },
  "userOptions": [
    {
      "id": "validation_focus",
      "label": "Validation focus",
      "type": "select",
      "default": "balanced",
      "choices": [
        { "value": "balanced", "label": "Balanced checks" },
        { "value": "evidence_fidelity", "label": "Evidence fidelity" },
        { "value": "clarity_and_bias", "label": "Clarity and bias" }
      ]
    }
  ]
}
```

---

## 12. Format Final Output

### Type
Format

### Input
one or more finished research artefacts

### Output
delivery-specific output

### Purpose
- Convert research artefacts into the final delivery format
- Keep formatting separate from analysis and synthesis

### Aliases
- Prepare Final Output
- Format Deliverable
- Finalize Output Format

### Prompt Factory
```json
{
  "configurationMode": "simple",
  "askForCustomSchema": false,
  "defaultPromptStrategy": "default_template",
  "inputPriority": {
    "primary": "validated_research_output",
    "secondary": "synthesis",
    "tertiary": "findings_model",
    "quaternary": "source_normalized_content"
  },
  "preferredOutputFormat": "document",
  "defaultPromptNotes": "Render final research output in the configured target format without altering substantive conclusions.",
  "runnerInstructions": {
    "what_this_step_does": "This step formats validated research artefacts into the requested delivery format."
  },
  "promptTemplate": "Context:\nYou are provided with finished research artefacts from upstream workflow steps.\n\nTask:\nRender delivery-ready output in the configured target_format.\n\nInstructions:\n- This is a final delivery rendering step, not an analysis or synthesis step\n- Use upstream artefacts as authoritative source content\n- Do not reinterpret evidence, methods, findings, or conclusions\n- Do not generate new research logic; only transform validated content into delivery form\n- Keep substantive meaning faithful while adapting structure to target_format\n- If target_format is word: produce delivery-ready document content with clear sections, narrative flow, and appendix-style notes when available\n- If target_format is pptx: produce slide-ready structure with slide titles, concise body bullets, and speaker notes where useful\n- If target_format is xml or common_cartridge: return valid, well-formed structured markup for the requested format\n- If target_format is json: return JSON only with top-level artifact_type\n- For any other target_format, return equivalent delivery-ready content following that format's conventions\n- Apply step notes when provided: {{stepNotes}}\n\nOutput:\n- Return the final output directly in target_format\n- Do not return analysis about formatting choices\n- Return only the delivery-ready content.",
  "defaultOutputStructure": {
    "sections": ["Delivery-ready output"]
  },
  "userOptions": [
    {
      "id": "target_format",
      "label": "Target format",
      "type": "select",
      "default": "word",
      "choices": [
        { "value": "word", "label": "Word document content" },
        { "value": "pptx", "label": "PowerPoint deck content" },
        { "value": "xml", "label": "XML" },
        { "value": "common_cartridge", "label": "Common Cartridge" },
        { "value": "json", "label": "JSON" },
        { "value": "other", "label": "Other delivery-ready format" }
      ]
    }
  ]
}
```

---

## 13. Design Page

### Type
Assembly

### Input
validated_research_output, optional final_output, optional briefing_note, optional research_summary, optional thematic_analysis, optional evidence_map, optional research_questions

### Output
page

### Purpose
- Assemble one renderer-ready page artefact (artifact_type = page) from upstream research outputs
- Bridge validated research synthesis to the same JSON → HTML delivery path used by Learning Design workflows
- Read-only composition: do not reinterpret evidence or change substantive conclusions

### Aliases
- Build Research Page
- Render Research Briefing Page

### Prompt Factory
```json
{
  "canonical_step_id": "step_design_page",
  "canonical_prompt_id": "prompt_design_page",
  "configurationMode": "none",
  "askForCustomSchema": false,
  "defaultPromptStrategy": "default_template",
  "preferredOutputFormat": "json",
  "defaultPromptNotes": "Assemble one self-contained page JSON (artifact_type = page) from research workflow artefacts for downstream HTML/VLE rendering; use the same top-level page contract as platform Design Page outputs (title, audience, page_profile, sections, source_artefacts, constraints_applied, generation_notes).",
  "runnerInstructions": {
    "what_this_step_does": "This step composes a readable page JSON from validated research outputs so the standard renderer can produce HTML."
  },
  "defaultOutputStructure": {
    "keys": ["artifact_type", "title", "audience", "page_profile", "sections", "source_artefacts", "constraints_applied", "generation_notes"]
  },
  "userOptions": [
    {
      "id": "page_profile",
      "label": "Page profile",
      "type": "select",
      "default": "learner",
      "choices": [
        { "value": "learner", "label": "Stakeholder / learner readable" },
        { "value": "facilitator", "label": "Facilitator briefing" },
        { "value": "assessment", "label": "Evidence appendix style" }
      ]
    }
  ],
  "promptTemplate": "Context:\nYou may receive validated_research_output, final_output, briefing_note, research_summary, thematic_analysis, evidence_map, and/or research_questions from upstream research steps.\n\nTask:\nAssemble one readable, self-contained page artefact with artifact_type = page for downstream HTML rendering.\n\nInstructions:\n- This is a read-only composition step; do not reinterpret evidence, methods, or conclusions from upstream artefacts\n- Ground every section in provided upstream artefacts only; do not invent new findings\n- Set page_profile from the configured option: {{option:page_profile}}\n- Prefer validated_research_output and briefing_note when present; otherwise synthesise sections from the strongest available upstream artefacts\n- Use meaningful section headings (for example: Executive overview, Key findings, Evidence and limitations, Recommendations, Open questions)\n- Emit sections as an array of objects each with section_id, heading, and content\n- Populate source_artefacts as an object of booleans keyed by artefact names you used\n- If constraints cannot be met, list them in generation_notes.limitations\n- Apply step notes when provided: {{stepNotes}}\n\nOutput:\n- Return output as {{preferredOutputFormat}}\n- Return JSON only with: artifact_type (must be page), title, audience, page_profile, sections, source_artefacts, constraints_applied, generation_notes\n- Return only the JSON."
}
```

---

# Usage Guidelines

- Not all workflows require all steps.
- Select step patterns based on:
  - research purpose
  - number of sources
  - level of analysis required
  - required output format

- Maintain logical ordering:
  1. Ingestion / normalization
  2. Extraction / analysis
  3. Synthesis / generation
  4. Validation
  5. Formatting
  6. Renderer-ready page assembly (Design Page), when included for delivery

---

# Summary

Step patterns provide a **standardised structure** for research workflows.

They ensure:
- consistency
- clarity
- reuse
- traceability
- methodological fit
