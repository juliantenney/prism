# domain-learning-design-step-patterns.md

## Purpose

This document defines the canonical step patterns used in learning design workflows within PRISM.

Step patterns describe **common transformations** that occur in instructional design workflows.  
They provide a consistent way to structure workflows and ensure that learning design processes are applied correctly.

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

- Prefer:
  - clear boundaries between steps
  - reuse of canonical artefacts

---

# Core Step Patterns

### Workflow Policy
```json
{
  "workflowPolicy": {
    "canonicalSteps": [
      "Normalize Content",
      "Generate Learning Content",
      "Model Knowledge",
      "Define Learning Outcomes",
      "Design Episode Plan",
      "Design Learning Activities",
      "Generate Activity Materials",
      "Design Page",
      "Generate Slide Deck",
      "Generate VLE Structure",
      "Generate Learning Object Set",
      "Generate Assessment Items",
      "Construct Learning Sequence",
      "Design Assessment",
      "Design Feedback",
      "Validate Learning Design",
      "Revise Assessment Based on QA",
      "Design Marking Rubric"
    ],
    "maxOccurrences": {
      "Normalize Content": 1,
      "Model Knowledge": 1,
      "Define Learning Outcomes": 1,
      "Design Episode Plan": 1,
      "Design Learning Activities": 1,
      "Generate Activity Materials": 1,
      "Design Page": 1,
      "Generate Slide Deck": 1,
      "Generate VLE Structure": 1,
      "Generate Learning Object Set": 1,
      "Generate Assessment Items": 1,
      "Construct Learning Sequence": 1,
      "Generate Learning Content": 1,
      "Design Assessment": 1,
      "Design Feedback": 1,
      "Validate Learning Design": 1,
      "Revise Assessment Based on QA": 1,
      "Design Marking Rubric": 1
    },
    "dependencies": {
      "Model Knowledge": { "requiresAnyOf": ["normalized_content", "learning_content"], "produces": ["knowledge_model"] },
      "Define Learning Outcomes": { "requires": ["knowledge_model"], "produces": ["learning_outcomes"] },
      "Design Episode Plan": { "requires": ["learning_outcomes"], "produces": ["episode_plans"] },
      "Design Learning Activities": { "requires": ["learning_outcomes", "episode_plans"], "produces": ["learning_activities"] },
      "Generate Activity Materials": { "requires": ["learning_activities"], "produces": ["activity_materials", "session_materials"] },
      "Design Page": { "requiresAnyOf": ["knowledge_model", "activity_materials", "assessment_items", "learning_sequence", "learning_content"], "optionalRequires": ["learning_outcomes", "learning_activities", "activity_materials", "learning_sequence", "assessment_items", "feedback_pack", "marking_rubric", "assessment_blueprint"], "produces": ["page"] },
      "Generate Slide Deck": { "requires": ["learning_outcomes", "learning_activities", "activity_materials", "learning_sequence"], "produces": ["slide_deck"] },
      "Generate VLE Structure": { "requires": ["learning_outcomes", "learning_activities", "activity_materials", "learning_sequence"], "produces": ["vle_structure"] },
      "Generate Learning Object Set": { "requires": ["learning_outcomes", "learning_activities", "activity_materials"], "produces": ["learning_object_set"] },
      "Generate Learning Content": { "requiresAnyOf": ["topic", "normalized_content"], "produces": ["learning_content"] },
      "Design Assessment": { "requires": ["learning_outcomes"], "produces": ["assessment_blueprint"] },
      "Generate Assessment Items": { "requiresAnyOf": ["learning_outcomes", "assessment_blueprint"], "produces": ["assessment_items"] },
      "Design Feedback": { "requires": ["assessment_items"], "produces": ["feedback_pack"] },
      "Construct Learning Sequence": { "requires": ["learning_activities", "activity_materials"], "produces": ["learning_sequence"] },
      "Validate Learning Design": { "requires": ["assessment_items", "learning_outcomes"], "produces": ["qa"] },
      "Revise Assessment Based on QA": { "requires": ["qa", "assessment_items"], "produces": ["revised_assessment_items"] },
      "Design Marking Rubric": {
        "requires": ["assessment_blueprint"],
        "requiresAnyOf": ["revised_assessment_items", "assessment_items"],
        "produces": ["marking_rubric"]
      }
    },
    "precedenceRules": [
      ["Generate Learning Content", "Model Knowledge"],
      ["Model Knowledge", "Define Learning Outcomes"],
      ["Define Learning Outcomes", "Design Episode Plan"],
      ["Design Episode Plan", "Design Learning Activities"],
      ["Design Learning Activities", "Generate Activity Materials"],
      ["Generate Activity Materials", "Construct Learning Sequence"],
      ["Generate Learning Content", "Design Page"],
      ["Model Knowledge", "Design Page"],
      ["Define Learning Outcomes", "Design Page"],
      ["Design Learning Activities", "Design Page"],
      ["Generate Activity Materials", "Design Page"],
      ["Design Assessment", "Design Page"],
      ["Generate Assessment Items", "Design Page"],
      ["Generate Assessment Items", "Construct Learning Sequence"],
      ["Generate Activity Materials", "Generate Slide Deck"],
      ["Generate Activity Materials", "Generate VLE Structure"],
      ["Generate Activity Materials", "Generate Learning Object Set"],
      ["Construct Learning Sequence", "Design Page"],
      ["Construct Learning Sequence", "Generate Slide Deck"],
      ["Construct Learning Sequence", "Generate VLE Structure"],
      ["Construct Learning Sequence", "Generate Learning Object Set"],
      ["Design Feedback", "Design Page"],
      ["Design Marking Rubric", "Design Page"],
      ["Design Assessment", "Generate Assessment Items"],
      ["Validate Learning Design", "Revise Assessment Based on QA"]
    ],
    "triggerRules": [
      {
        "whenGoalMentionsAnyOf": ["lesson", "session", "workshop", "class", "minute", "module", "course", "programme", "weekly schedule"],
        "include": ["Construct Learning Sequence"]
      },
      {
        "whenResolvedFactorsInclude": {
          "session_materials": ["page"],
          "design_scope": ["session", "sequence", "module"]
        },
        "include": [
          "Generate Learning Content",
          "Define Learning Outcomes",
          "Design Learning Activities",
          "Generate Activity Materials",
          "Construct Learning Sequence",
          "Design Page"
        ]
      },
      {
        "whenResolvedFactorsInclude": {
          "assessment_required": true
        },
        "include": [
          "Generate Assessment Items"
        ]
      },
      {
        "whenResolvedFactorsInclude": {
          "activities_required": true
        },
        "include": [
          "Define Learning Outcomes",
          "Design Learning Activities"
        ]
      },
      {
        "whenResolvedFactorsInclude": {
          "materials_required": true
        },
        "include": [
          "Generate Activity Materials"
        ]
      },
      {
        "whenResolvedFactorsInclude": {
          "session_materials": ["page"],
          "input_strategy": "provided_source_content"
        },
        "whenGoalMentionsAnyOf": ["from supplied", "from source", "from transcript", "from notes", "convert into page", "turn into page"],
        "include": ["Model Knowledge", "Design Page"],
        "exclude": [
          "Define Learning Outcomes",
          "Design Learning Activities",
          "Generate Activity Materials",
          "Construct Learning Sequence"
        ]
      },
      {
        "whenResolvedFactorsInclude": {
          "session_materials": ["page"]
        },
        "whenGoalMentionsAnyOf": [
          "outcomes",
          "learning outcomes",
          "activities",
          "activity",
          "tasks",
          "task",
          "learner tasks",
          "worksheet"
        ],
        "include": [
          "Generate Learning Content",
          "Define Learning Outcomes",
          "Design Learning Activities",
          "Generate Activity Materials",
          "Construct Learning Sequence",
          "Design Page"
        ]
      },
      {
        "whenGoalMentionsAnyOf": ["face_to_face", "facilitator guide", "teaching guide", "runbook"],
        "include": ["Design Page"]
      },
      {
        "whenGoalMentionsAnyOf": ["mostly_online", "participant handout", "learner handout", "learner pack"],
        "include": ["Design Page"]
      },
      {
        "whenGoalMentionsAnyOf": ["learner page", "student page", "moodle page", "vle page", "online content page", "learner-facing page", "student-facing page"],
        "include": ["Design Page", "Generate Learning Content", "Model Knowledge"],
        "exclude": ["Generate Assessment Items", "Design Feedback"]
      },
      {
        "whenGoalMentionsAnyOf": ["page", "content page", "readable page"],
        "include": ["Design Page", "Generate Learning Content", "Model Knowledge"],
        "exclude": ["Generate Assessment Items", "Design Feedback"]
      },
      {
        "whenGoalMentionsAnyOf": ["blended", "slide deck", "slide_deck", "slides"],
        "include": ["Generate Slide Deck"]
      },
      {
        "whenInputsMentionAnyOf": ["page"],
        "include": ["Design Page", "Generate Learning Content", "Model Knowledge"],
        "exclude": ["Generate Assessment Items", "Design Feedback"]
      },
      {
        "whenResolvedFactorsInclude": {
          "session_materials": ["page"]
        },
        "include": ["Design Page", "Generate Learning Content", "Model Knowledge"],
        "exclude": ["Generate Assessment Items", "Design Feedback"]
      },
      {
        "whenGoalMentionsAnyOf": ["activity", "activities", "task", "tasks", "exercise", "exercises", "worksheet", "discussion prompt", "reflection prompt", "learner task"],
        "include": ["Define Learning Outcomes", "Design Episode Plan", "Design Learning Activities", "Generate Activity Materials"]
      },
      {
        "whenInputsMentionAnyOf": ["slide_deck"],
        "include": ["Generate Slide Deck"]
      },
      {
        "whenResolvedFactorsInclude": {
          "delivery_context": "self_directed"
        },
        "include": ["Generate Learning Content", "Design Page"],
        "exclude": ["Generate Slide Deck"]
      },
      {
        "whenResolvedFactorsInclude": {
          "delivery_context": "self_directed",
          "learning_environments": ["xerte"]
        },
        "include": ["Generate Learning Object Set"]
      },
      {
        "whenResolvedFactorsInclude": {
          "learning_environments": ["xerte"]
        },
        "include": ["Generate Learning Object Set"]
      },
      {
        "whenGoalMentionsAnyOf": ["vle structure", "moodle structure", "lms structure", "course shell", "topic blocks", "weekly blocks"],
        "include": ["Generate VLE Structure"]
      },
      {
        "whenGoalMentionsAnyOf": ["xerte", "learning object", "interactive object", "digital learning object"],
        "include": ["Generate Learning Object Set"]
      },
      {
        "whenInputsMentionAnyOf": ["generate content", "no content", "create content", "from topic only"],
        "include": ["Generate Learning Content"]
      },
      {
        "whenGoalMentionsAnyOf": ["quiz", "mcq", "mcqs", "multiple choice", "test", "question bank", "item bank", "knowledge check", "assessment items", "question set", "formative question", "formative questions"],
        "include": ["Generate Assessment Items"]
      },
      {
        "whenGoalMentionsAnyOf": ["assessment blueprint", "blueprint", "coverage map", "difficulty profile", "item distribution", "assessment specification", "assessment design"],
        "include": ["Design Assessment"]
      },
      {
        "whenGoalMentionsAnyOf": ["validate", "quality assurance", "qa", "review quality", "alignment audit", "alignment check", "quality audit"],
        "include": ["Validate Learning Design"]
      },
      {
        "whenGoalMentionsAnyOf": ["revise based on qa", "apply qa feedback", "revision pass", "refine using qa", "improve assessment", "refine assessment"],
        "include": ["Revise Assessment Based on QA"]
      },
      {
        "whenGoalMentionsAnyOf": ["rubric", "marking rubric", "grading criteria", "mark scheme", "tutor marking"],
        "include": ["Design Marking Rubric"]
      },
      {
        "whenGoalMentionsAnyOf": ["feedback pack", "learner feedback", "feedback guidance", "formative feedback"],
        "include": ["Design Feedback"]
      },
      {
        "whenGoalMentionsAnyOf": [
          "assessment pack",
          "formative assessment pack",
          "quiz pack",
          "printable quiz",
          "assessment document",
          "assessment booklet",
          "tutor assessment pack",
          "student assessment pack"
        ],
        "include": ["Generate Assessment Items", "Design Page"],
        "exclude": [
          "Design Assessment",
          "Design Marking Rubric",
          "Define Learning Outcomes",
          "Design Learning Activities",
          "Generate Activity Materials",
          "Generate Learning Content",
          "Model Knowledge",
          "Construct Learning Sequence"
        ]
      }
    ],
    "stepRoleAnchors": {
      "Design Episode Plan": "Episode planning — derive frozen Episode Plan V1 (archetype + ordered instructional-function beats) from learning outcomes for downstream population.",
      "Design Learning Activities": "Design runnable learning tasks with explicit learner actions, facilitation moves, and delivery-ready outputs.",
      "Generate Activity Materials": "Generate complete, facilitator-ready teaching materials from activity material specifications.",
      "Construct Learning Sequence": "Build a timed facilitation-ready session flow with transitions, learner actions, and facilitator actions.",
      "Design Page": "Assemble one readable, profile-aware page artefact from upstream artefacts while preserving explicit component, quantity, and exclusion constraints.",
      "Generate Slide Deck": "Assemble a presentation-support deck without replacing materials or redesigning pedagogy.",
      "Generate VLE Structure": "Assemble a VLE-ready structured representation of the learning design without converting it into a platform-specific package.",
      "Generate Learning Object Set": "Assemble one or more structured learning objects from existing artefacts without producing final rendered packages or redesigning pedagogy.",
      "Design Feedback": "Create actionable learner feedback guidance aligned to assessment items and likely misconceptions."
    },
    "finalSteps": ["Design Page"]
  }
}
```

### Sequencing/Ranking Metadata Semantics
- `Design Learning Activities` may emit `activity_interaction_type` and optional `ordering`/`render_hints` metadata on activity rows.
- `Generate Activity Materials` may reference the same interaction metadata and should avoid collapsing canonical order into learner-facing item order.
- `Construct Learning Sequence` remains the source of timing/order flow across activities; sequencing metadata on activity rows is for interaction-level correctness and learner display projection.
- `Design Page` should preserve these metadata fields when present so downstream rendering policy can distinguish:
  - canonical correctness (`ordering.canonical_order`)
  - learner-facing order (`ordering.learner_display_order`)
  - presentation hints (`render_hints.*`)
- Producer contract for sequencing/ranking rows:
  - Prefer stable item identifiers (`item_id`/`event_id`) in both `ordering.canonical_order` and `ordering.learner_display_order`.
  - Keep identifier sets aligned across `learner_instructions`, `task_cards`, and ordering metadata.
  - Keep `ordering.canonical_order` internal correctness-focused; `ordering.learner_display_order` is the learner-visible sequence only.

### Math notation output contract
- Applies to learner-facing text in `Design Learning Activities`, `Generate Activity Materials`, and `Design Page` outputs (including assessment stems/options, worked examples, and copied page content).
- Supported delimiters (renderer-compatible):
  - Inline maths: `\(...\)`
  - Display/block equations: `\[...\]`
- Prohibited:
  - `$...$` and `$$...$$`
  - Equations inside code spans, code fences, or backtick markdown
  - HTML-escaped delimiters/backslashes
- Maths is presentational notation only; do not imply symbolic solving, automated checking, or CAS capabilities.
- Preserve existing limited Markdown subset rules; math delimiters are additive to those rules.

### Workflow Brief Config
```json
{
  "workflowBriefConfig": {
    "version": "1",
    "assessmentPolicy": {
      "authorityStep": "step_design_assessment",
      "overridePrecedence": "explicit_downstream_wins",
      "inheritance": [
        { "targetStep": "step_generate_assessment_items", "targetKey": "response_formats", "sourceStep": "step_design_assessment", "sourceKey": "activity_type", "transform": "activity_type_to_response_formats" },
        { "targetStep": "step_generate_assessment_items", "targetKey": "number_of_items", "sourceStep": "step_design_assessment", "sourceKey": "total_items" },
        { "targetStep": "step_generate_assessment_items", "targetKey": "difficulty_profile", "sourceStep": "step_design_assessment", "sourceKey": "difficulty_profile", "transform": "da_difficulty_to_gen_difficulty_profile" },
        { "targetStep": "step_generate_assessment_items", "targetKey": "coverage_mode", "sourceStep": "step_design_assessment", "sourceKey": "coverage_scope", "transform": "da_coverage_to_gen_coverage_mode" }
      ]
    },
    "requiredFactors": [
      {
        "id": "topic",
        "label": "Topic",
        "question": "What topic or subject should this focus on?",
        "type": "text",
        "required": true
      },
      {
        "id": "learner_level",
        "label": "Learner level",
        "question": "What learner level should this workflow target? (beginner/intermediate/advanced/undergraduate/postgraduate)",
        "type": "select",
        "required": true,
        "choices": ["beginner", "intermediate", "advanced", "undergraduate", "postgraduate"]
      },
      {
        "id": "design_scope",
        "label": "Design scope",
        "question": "What is the design scope? (single_activity/session/sequence/module)",
        "type": "select",
        "required": true,
        "choices": ["single_activity", "session", "sequence", "module"],
        "default": "session"
      },
      {
        "id": "delivery_pattern",
        "label": "Delivery pattern",
        "question": "What delivery pattern should this use? (face_to_face/blended/mostly_online)",
        "type": "select",
        "required": true,
        "choices": ["face_to_face", "blended", "mostly_online"],
        "default": "face_to_face"
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
      }
    ],
    "optionalFactors": [
      {
        "id": "duration_minutes",
        "label": "Session duration (minutes)",
        "question": "How long is the session?",
        "type": "number",
        "min": 10,
        "max": 480
      },
      {
        "id": "delivery_mode",
        "label": "Delivery mode",
        "question": "What delivery mode should this use? (live_workshop/seminar/async)",
        "type": "select",
        "choices": ["live_workshop", "seminar", "async"]
      },
      {
        "id": "delivery_context",
        "label": "Delivery context",
        "question": "What pedagogic delivery context should this use? (in_person/online_sync/online_async/blended/self_directed)",
        "type": "select",
        "choices": ["in_person", "online_sync", "online_async", "blended", "self_directed"]
      },
      {
        "id": "session_materials",
        "label": "Session-level materials",
        "question": "Which session materials should be generated? (comma-separated: page, slide_deck)",
        "type": "multi_select",
        "choices": ["page", "slide_deck"],
        "default": ["page"]
      },
      {
        "id": "page_profile",
        "label": "Page profile",
        "question": "What page profile should be used? (learner/facilitator/assessment)",
        "type": "select",
        "choices": ["learner", "facilitator", "assessment"],
        "default": "learner"
      },
      {
        "id": "assessment_required",
        "label": "Assessment required",
        "question": "Do you need assessment outputs? (yes/no)",
        "type": "boolean"
      },
      {
        "id": "learning_environments",
        "label": "Learning environments",
        "question": "Which learning environments are in scope? (classroom, vle, xerte, external_tools)",
        "type": "multi_select",
        "choices": ["classroom", "vle", "xerte", "external_tools"],
        "default": ["classroom"]
      },
      {
        "id": "assessment_strategy",
        "label": "Assessment strategy",
        "question": "Assessment strategy (none/formative/summative/mixed)",
        "type": "select",
        "choices": ["none", "formative", "summative", "mixed"],
        "default": "none"
      }
    ],
    "refinementFactors": [
      {
        "id": "coverage_scope",
        "label": "Coverage scope",
        "question": "Should this focus on selected themes, broad coverage, or a balanced middle ground?",
        "plainEnglish": "Do you want this to focus on a few key topics, cover lots of topics, or sit between the two?",
        "skipIfContextResolved": true,
        "type": "select",
        "choices": [
          { "value": "selected_themes", "label": "Selected themes", "description": "Focus on the most important topics rather than covering everything." },
          { "value": "balanced", "label": "Balanced", "description": "Cover key topics with a practical balance of depth and breadth." },
          { "value": "broad_coverage", "label": "Broad coverage", "description": "Sample across many topics for wider overall coverage." }
        ],
        "default": "balanced",
        "mustAsk": false,
        "askWhenResolvedFactorEquals": { "assessment_required": true },
        "askWhenGoalMentionsAnyOf": ["assessment", "quiz", "test", "question", "essay", "task", "exercise"],
        "askWhenDesignScopeIn": ["single_activity", "session", "sequence", "module"]
      },
      {
        "id": "cognitive_demand",
        "label": "Cognitive demand profile",
        "question": "What level of thinking should most tasks target?",
        "plainEnglish": "Should learners mainly recall facts, apply ideas, or do higher-order analysis/evaluation?",
        "skipIfContextResolved": true,
        "type": "select",
        "choices": [
          { "value": "recall_foundation", "label": "Recall and understanding", "description": "Mostly checks core facts, concepts, and basic understanding." },
          { "value": "application_oriented", "label": "Application and problem-solving", "description": "Focuses on applying ideas to tasks and practical problems." },
          { "value": "analysis_evaluation", "label": "Analysis and evaluation (higher-order)", "description": "Emphasizes comparison, critique, judgement, and deeper reasoning." },
          { "value": "mixed", "label": "Mixed levels", "description": "Uses a deliberate mix from foundational to higher-order thinking." }
        ],
        "default": "mixed",
        "mustAsk": false,
        "askWhenResolvedFactorEquals": { "assessment_required": true },
        "askWhenGoalMentionsAnyOf": ["assessment", "quiz", "test", "question", "essay", "task", "exercise"],
        "askWhenDesignScopeIn": ["single_activity", "session", "sequence", "module"]
      },
      {
        "id": "question_style_mix",
        "label": "Response mode mix",
        "question": "What kind of responses should learners give?",
        "plainEnglish": "Do you want multiple choice, written answers, or a mix?",
        "type": "select",
        "choices": [
          { "value": "selected_response_only", "label": "Selected response only (e.g. MCQ)", "description": "Learners choose from provided options (faster marking, tighter structure)." },
          { "value": "constructed_response_only", "label": "Constructed response only (e.g. short/essay)", "description": "Learners write their own responses (more depth, richer evidence)." },
          { "value": "mixed_response_modes", "label": "Mixed selected + constructed responses", "description": "Combine option-based and written-response items in one set." },
          { "value": "integrative_performance_oriented", "label": "Integrative/performance-style responses", "description": "Use more authentic responses that integrate multiple skills or outcomes." }
        ],
        "default": "mixed_response_modes",
        "mustAsk": false,
        "askWhenResolvedFactorEquals": { "assessment_required": true },
        "askWhenGoalMentionsAnyOf": ["assessment", "quiz", "test", "question", "essay"],
        "askWhenDesignScopeIn": ["single_activity", "session", "sequence", "module"]
      },
      {
        "id": "assessment_type",
        "label": "Assessment type",
        "question": "What assessment type should this use?",
        "plainEnglish": "Should this be multiple-choice, short-answer, essay, case-study, problem-based, or mixed?",
        "type": "select",
        "choices": [
          { "value": "mcq", "label": "MCQ", "description": "Single-best-answer multiple-choice questions." },
          { "value": "short_answer", "label": "Short answer", "description": "Brief written responses demonstrating understanding or application." },
          { "value": "essay", "label": "Essay", "description": "Extended written responses with argument, analysis, or evaluation." },
          { "value": "problem", "label": "Problem solving", "description": "Solve a problem using methods, reasoning, and justified steps." },
          { "value": "case_study", "label": "Case study", "description": "Analyze a realistic case and respond using evidence-based reasoning." },
          { "value": "mixed", "label": "Mixed types", "description": "Use a deliberate mix of assessment types." }
        ],
        "default": "mixed",
        "mustAsk": false,
        "skipIfContextResolved": true,
        "askWhenResolvedFactorEquals": { "assessment_required": true },
        "askWhenGoalMentionsAnyOf": ["assessment", "quiz", "test", "question", "essay", "mcq", "exam"],
        "askWhenDesignScopeIn": ["single_activity", "session", "sequence", "module"]
      },
      {
        "id": "feedback_required",
        "label": "Feedback mode",
        "question": "What feedback mode should the workflow produce for learners/tutors?",
        "plainEnglish": "Should feedback be none, per question, overall summary, or both?",
        "skipIfContextResolved": true,
        "type": "select",
        "choices": [
          { "value": "none", "label": "No feedback", "description": "Provide answers/results without learner-facing feedback commentary." },
          { "value": "item_level", "label": "Per item", "description": "Provide feedback for each question or task response." },
          { "value": "aggregate", "label": "Overall summary", "description": "Provide a consolidated summary of strengths and gaps." },
          { "value": "both_item_and_aggregate", "label": "Per item + overall summary", "description": "Provide both per-item guidance and an overall summary." }
        ],
        "default": "item_level",
        "mustAsk": false,
        "askWhenResolvedFactorEquals": { "assessment_required": true },
        "askWhenGoalMentionsAnyOf": ["assessment", "quiz", "test", "question", "essay"],
        "askWhenDesignScopeIn": ["single_activity", "session", "sequence", "module"]
      },
      {
        "id": "difficulty_profile",
        "label": "Difficulty distribution",
        "question": "How should difficulty be distributed across the assessment set?",
        "plainEnglish": "Should this be mostly easier items, balanced, or mostly harder items?",
        "skipIfContextResolved": true,
        "type": "select",
        "choices": [
          { "value": "foundation_heavy", "label": "Mostly foundational items", "description": "Bias toward easier/foundational items with fewer advanced ones." },
          { "value": "balanced", "label": "Balanced mix", "description": "Use a balanced spread across easier and harder items." },
          { "value": "higher_order_heavy", "label": "Mostly higher-order items", "description": "Bias toward more challenging analysis/application items." }
        ],
        "default": "balanced",
        "mustAsk": false,
        "askWhenResolvedFactorEquals": { "assessment_required": true },
        "askWhenGoalMentionsAnyOf": ["assessment", "quiz", "test", "question", "essay"],
        "askWhenDesignScopeIn": ["single_activity", "session", "sequence", "module"]
      },
      {
        "id": "assessment_total_items",
        "label": "Total assessment items",
        "question": "How many assessment items/questions should be generated in total?",
        "plainEnglish": "What is the total number of questions/items you want (for example: 8, 10, or 20)?",
        "skipIfContextResolved": true,
        "type": "number",
        "min": 1,
        "max": 200,
        "default": 10,
        "mustAsk": false,
        "skipIfContextResolved": true,
        "askWhenResolvedFactorEquals": { "assessment_required": true },
        "askWhenGoalMentionsAnyOf": ["assessment", "quiz", "test", "question", "essay", "mcq", "exam"],
        "askWhenDesignScopeIn": ["single_activity", "session", "sequence", "module"]
      },
      {
        "id": "activity_pattern_mix",
        "label": "Activity pattern mix",
        "question": "What activity pattern mix should learning activities use?",
        "plainEnglish": "Should activities be mostly guided, mixed, or more applied/collaborative?",
        "skipIfContextResolved": true,
        "type": "select",
        "choices": [
          { "value": "guided", "label": "Guided", "description": "Structured tasks led by the tutor, with clear instructions and support." },
          { "value": "balanced", "label": "Balanced", "description": "A mix of tutor-guided tasks and more student-led discussion or group work." },
          { "value": "applied_collaborative", "label": "Applied collaborative", "description": "More open-ended tasks where students work together to apply ideas in practice." }
        ],
        "default": "balanced",
        "askWhenGoalMentionsAnyOf": ["workshop", "session", "lesson", "module", "teaching", "learning"],
        "askWhenDesignScopeIn": ["session", "sequence", "module"]
      },
      {
        "id": "sequencing_granularity",
        "label": "Sequencing granularity",
        "question": "How detailed should the learning sequence structure be?",
        "plainEnglish": "Do you want a light plan, a standard plan, or a very detailed step-by-step sequence?",
        "skipIfContextResolved": true,
        "type": "select",
        "choices": ["lightweight", "standard", "detailed"],
        "default": "standard",
        "askWhenGoalMentionsAnyOf": ["workshop", "session", "sequence", "module", "weekly", "lecture"],
        "askWhenDesignScopeIn": ["session", "sequence", "module"]
      },
      {
        "id": "assessment_cadence",
        "label": "Assessment cadence",
        "question": "How should assessment be distributed across the broader learning scope?",
        "plainEnglish": "Should assessment happen only at the end, regularly during learning, or as a mix of formative and summative?",
        "skipIfContextResolved": true,
        "type": "select",
        "choices": ["single_end_point", "periodic_formative", "mixed_formative_summative"],
        "default": "periodic_formative",
        "askWhenResolvedFactorEquals": { "assessment_required": true },
        "askWhenGoalMentionsAnyOf": ["module", "course", "programme", "sequence"],
        "askWhenDesignScopeIn": ["sequence", "module"]
      },
      {
        "id": "tone_style",
        "label": "Tone / style",
        "question": "What tone and style should the page use?",
        "plainEnglish": "Should the language be formal, friendly, academic, or conversational?",
        "type": "select",
        "choices": ["formal", "friendly", "academic", "conversational", "mixed"],
        "default": "academic",
        "mustAsk": false,
        "askWhenResolvedFactorEquals": { "session_materials": ["page"] },
        "askWhenGoalMentionsAnyOf": ["page", "content", "lesson", "module", "course"]
      },
      {
        "id": "depth_level",
        "label": "Depth level",
        "question": "What depth level should the page content target?",
        "plainEnglish": "Should it cover foundational concepts, application, or deeper analysis?",
        "type": "select",
        "choices": ["foundational", "application", "analysis", "mixed"],
        "default": "mixed",
        "mustAsk": false,
        "askWhenResolvedFactorEquals": { "session_materials": ["page"] },
        "askWhenGoalMentionsAnyOf": ["page", "content", "lesson", "module", "course"]
      },
      {
        "id": "include_examples",
        "label": "Include examples",
        "question": "Should the page include illustrative examples?",
        "type": "boolean",
        "default": true,
        "mustAsk": false,
        "askWhenResolvedFactorEquals": { "session_materials": ["page"] },
        "askWhenGoalMentionsAnyOf": ["page", "content", "lesson", "module", "course"]
      },
      {
        "id": "include_practice_tasks",
        "label": "Include practice tasks",
        "question": "Should the page include short practice tasks or questions?",
        "type": "boolean",
        "default": false,
        "mustAsk": false,
        "askWhenResolvedFactorEquals": { "session_materials": ["page"] },
        "askWhenGoalMentionsAnyOf": ["page", "content", "activity", "tasks"]
      },
      {
        "id": "compact_vs_detailed",
        "label": "Page compactness",
        "question": "Should the page be compact or detailed?",
        "plainEnglish": "Do you want a concise summary or a more detailed explanation?",
        "type": "select",
        "choices": ["compact", "standard", "detailed"],
        "default": "standard",
        "mustAsk": false,
        "askWhenResolvedFactorEquals": { "session_materials": ["page"] },
        "askWhenGoalMentionsAnyOf": ["page", "content", "summary"]
      }
    ],
    "uiHints": {
      "design_intent": "Describe the learning-design output to produce (workshop, lesson, module, assessment pack).",
      "audience": "Primary learner/cohort for this design.",
      "scope_scale": "Delivery scale and duration (for example: 60-minute workshop, two-week module, or full course).",
      "scope_scale_placeholder": "e.g. single activity, workshop block, multi-week module, programme",
      "inputs": "Source content or note that content must be generated from topic.",
      "desired_outputs": "Target artefacts (activities, sequence, assessment, facilitator materials).",
      "constraints": "Hard constraints only: timing, policy, tools, accessibility, delivery conditions."
    },
    "extraFields": [],
    "inferenceRules": [
      {
        "whenInputsMentionAnyOf": [
          "undergraduate",
          "undergraduates",
          "first-year undergraduate",
          "first year undergraduate",
          "first-year undergraduates",
          "first year undergraduates",
          "second-year undergraduate",
          "second year undergraduate",
          "second-year undergraduates",
          "second year undergraduates",
          "final-year undergraduate",
          "final year undergraduate",
          "final-year undergraduates",
          "final year undergraduates"
        ],
        "set": {
          "learner_level": "undergraduate"
        }
      },
      {
        "whenInputsMentionAnyOf": ["postgraduate", "postgraduates", "postgraduate taught students"],
        "set": {
          "learner_level": "postgraduate"
        }
      },
      {
        "whenInputsMentionAnyOf": [
          "year 7",
          "year 8",
          "year 9",
          "ks3",
          "key stage 3"
        ],
        "set": {
          "learner_level": "beginner"
        }
      },
      {
        "whenInputsMentionAnyOf": [
          "year 10",
          "year 11",
          "ks4",
          "key stage 4",
          "gcse"
        ],
        "set": {
          "learner_level": "intermediate"
        }
      },
      {
        "whenInputsMentionAnyOf": [
          "year 12",
          "year 13",
          "ks5",
          "key stage 5",
          "a-level",
          "a level"
        ],
        "set": {
          "learner_level": "advanced"
        }
      },
      {
        "whenInputsMentionAnyOf": ["primary", "primary school"],
        "set": {
          "learner_level": "beginner"
        }
      },
      {
        "whenInputsMentionAnyOf": ["beginner", "beginners"],
        "set": {
          "learner_level": "beginner"
        }
      },
      {
        "whenInputsMentionAnyOf": ["intermediate"],
        "set": {
          "learner_level": "intermediate"
        }
      },
      {
        "whenInputsMentionAnyOf": ["advanced"],
        "set": {
          "learner_level": "advanced"
        }
      },
      {
        "whenGoalMentionsAnyOf": ["quiz", "activity", "exercise", "question set", "worksheet", "task"],
        "set": {
          "design_scope": "single_activity"
        }
      },
      {
        "whenGoalMentionsAnyOf": ["workshop", "session", "class", "live"],
        "set": {
          "delivery_mode": "live_workshop"
        }
      },
      {
        "whenGoalMentionsAnyOf": ["quiz", "mcq", "assessment", "test"],
        "set": {
          "assessment_required": true
        }
      },
      {
        "whenGoalMentionsAnyOf": ["module", "course", "programme", "6-week", "weekly schedule"],
        "set": {
          "design_scope": "module"
        }
      },
      {
        "whenGoalMentionsAnyOf": ["online", "moodle"],
        "set": {
          "delivery_pattern": "blended",
          "learning_environments": ["classroom", "vle"]
        }
      },
      {
        "whenGoalMentionsAnyOf": ["vle", "moodle", "course site", "online course space", "vle structure", "moodle structure", "moodle course structure"],
        "set": {
          "learning_environments": ["vle"]
        }
      },
      {
        "whenInputsMentionAnyOf": ["vle", "moodle", "course site", "online course space", "vle structure", "moodle structure", "moodle course structure"],
        "set": {
          "learning_environments": ["vle"]
        }
      },
      {
        "whenGoalMentionsAnyOf": ["self-directed", "independent study", "self study", "study independently", "work through on their own"],
        "set": {
          "delivery_context": "self_directed"
        }
      },
      {
        "whenGoalMentionsAnyOf": [
          "self-study",
          "self study",
          "revision resource",
          "preparation resource",
          "learner-facing page",
          "learner facing page",
          "learner resource",
          "learning resource"
        ],
        "set": {
          "delivery_context": "self_directed",
          "delivery_mode": "async",
          "delivery_pattern": "mostly_online",
          "learning_environments": ["vle"]
        }
      },
      {
        "whenInputsMentionAnyOf": ["self-directed", "independent study", "self study", "study independently", "work through on their own"],
        "set": {
          "delivery_context": "self_directed"
        }
      },
      {
        "whenInputsMentionAnyOf": ["self-study", "self study", "independent study", "uploaded transcript", "lecture transcript"],
        "set": {
          "delivery_context": "self_directed",
          "delivery_mode": "async"
        }
      },
      {
        "whenInputsMentionAnyOf": ["no source content", "generate from topic", "from topic only"],
        "set": {
          "input_strategy": "generate_from_topic"
        }
      },
      {
        "whenInputsMentionAnyOf": [
          "transcript",
          "article",
          "document",
          "pdf",
          "slides",
          "uploaded file",
          "uploaded lecture",
          "source material",
          "provided lecture",
          "provided reading",
          "attached material"
        ],
        "set": {
          "input_strategy": "provided_source_content"
        }
      }
    ],
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
    ],
    "stepParameterControls": [
      {
        "key": "page_profile",
        "canonicalStepId": "step_design_page",
        "label": "Page profile",
        "description": "Who the assembled page is primarily for.",
        "controlType": "select",
        "default": "learner",
        "options": [
          { "value": "learner", "label": "Learner" },
          { "value": "facilitator", "label": "Facilitator" },
          { "value": "assessment", "label": "Assessment" }
        ],
        "visible": true,
        "advanced": false,
        "elicitation": "elicited"
      },
      {
        "key": "tone_style",
        "canonicalStepId": "step_design_page",
        "label": "Tone / style",
        "description": "Voice and register for page content.",
        "controlType": "select",
        "default": "academic",
        "options": [
          { "value": "formal", "label": "Formal" },
          { "value": "friendly", "label": "Friendly" },
          { "value": "academic", "label": "Academic" },
          { "value": "conversational", "label": "Conversational" },
          { "value": "mixed", "label": "Mixed" }
        ],
        "visible": true,
        "advanced": true,
        "elicitation": "settings-only"
      },
      {
        "key": "depth_level",
        "canonicalStepId": "step_design_page",
        "label": "Depth level",
        "description": "How deep page content should go.",
        "controlType": "select",
        "default": "mixed",
        "options": [
          { "value": "foundational", "label": "Foundational" },
          { "value": "application", "label": "Application" },
          { "value": "analysis", "label": "Analysis" },
          { "value": "mixed", "label": "Mixed" }
        ],
        "visible": true,
        "advanced": true,
        "elicitation": "settings-only"
      },
      {
        "key": "activity_type",
        "canonicalStepId": "step_design_assessment",
        "label": "Question strategy",
        "description": "Assessment type for the blueprint (maps from brief assessment type).",
        "controlType": "select",
        "default": "mcq",
        "options": [
          { "value": "mcq", "label": "Selected response" },
          { "value": "short_answer", "label": "Short written response" },
          { "value": "essay", "label": "Extended response" },
          { "value": "problem", "label": "Problem-solving response" },
          { "value": "case_study", "label": "Scenario-based response" },
          { "value": "mixed", "label": "Mixed response types" }
        ],
        "visible": true,
        "advanced": false,
        "elicitation": "elicited"
      },
      {
        "key": "number_of_items",
        "canonicalStepId": "step_generate_assessment_items",
        "label": "Number of items",
        "description": "How many assessment items to generate (inherits Design Assessment total_items by default).",
        "controlType": "number",
        "default": "10",
        "min": 1,
        "max": 200,
        "visible": true,
        "advanced": false,
        "elicitation": "settings-only"
      },
      {
        "key": "response_formats",
        "canonicalStepId": "step_generate_assessment_items",
        "label": "Allowed response formats",
        "description": "Permitted item response formats (inherits from Design Assessment activity_type by default).",
        "controlType": "select",
        "default": "single_answer_mcq",
        "options": [
          { "value": "single_answer_mcq", "label": "Single-answer MCQ" },
          { "value": "multiple_answer_mcq", "label": "Multiple-answer MCQ" },
          { "value": "true_false", "label": "True/false" },
          { "value": "short_answer", "label": "Short answer" },
          { "value": "essay", "label": "Essay" },
          { "value": "single_mcq_and_true_false", "label": "Single-answer MCQ + true/false" },
          { "value": "objective_mix_all", "label": "Objective mix (MCQ + true/false)" },
          { "value": "constructed_mix", "label": "Constructed mix (short answer + essay)" },
          { "value": "all_formats_mix", "label": "All supported formats" }
        ],
        "visible": true,
        "advanced": true,
        "elicitation": "settings-only"
      },
      {
        "key": "difficulty_profile",
        "canonicalStepId": "step_generate_assessment_items",
        "label": "Difficulty profile",
        "description": "Item-set difficulty emphasis (inherits from Design Assessment by default).",
        "controlType": "select",
        "default": "balanced",
        "options": [
          { "value": "foundational", "label": "Foundational-heavy" },
          { "value": "balanced", "label": "Balanced" },
          { "value": "higher_order", "label": "Higher-order-heavy" }
        ],
        "visible": true,
        "advanced": true,
        "elicitation": "settings-only"
      },
      {
        "key": "coverage_mode",
        "canonicalStepId": "step_generate_assessment_items",
        "label": "Coverage mode",
        "description": "Outcome/theme coverage for generated items (inherits from Design Assessment coverage_scope by default).",
        "controlType": "select",
        "default": "balanced",
        "options": [
          { "value": "selected_themes", "label": "Selected themes" },
          { "value": "balanced", "label": "Balanced" },
          { "value": "broad_coverage", "label": "Broad coverage" }
        ],
        "visible": true,
        "advanced": true,
        "elicitation": "settings-only"
      },
      {
        "key": "composition_mode",
        "canonicalStepId": "step_generate_assessment_items",
        "label": "Composition mode",
        "description": "Whether the item set uses a single format or a mixed set.",
        "controlType": "select",
        "default": "single_format",
        "options": [
          { "value": "single_format", "label": "Single format" },
          { "value": "mixed_set", "label": "Mixed set" }
        ],
        "visible": true,
        "advanced": true,
        "elicitation": "settings-only"
      },
      {
        "key": "stimulus_mode",
        "canonicalStepId": "step_generate_assessment_items",
        "label": "Stimulus mode",
        "description": "Whether items are direct questions or anchored to scenarios/problems/cases.",
        "controlType": "select",
        "default": "direct_questions",
        "options": [
          { "value": "direct_questions", "label": "Direct questions" },
          { "value": "scenario_based", "label": "Scenario based" },
          { "value": "problem_based", "label": "Problem based" },
          { "value": "case_based", "label": "Case based" }
        ],
        "visible": true,
        "advanced": true,
        "elicitation": "settings-only"
      },
      {
        "key": "scenario_scope",
        "canonicalStepId": "step_generate_assessment_items",
        "label": "Stimulus scope",
        "description": "Shared vs per-item stimulus when using scenario/problem/case-based items.",
        "controlType": "select",
        "default": "shared_scenario_for_set",
        "options": [
          { "value": "shared_scenario_for_set", "label": "Shared stimulus for set" },
          { "value": "scenario_per_item", "label": "Stimulus per item" }
        ],
        "visible": true,
        "advanced": true,
        "elicitation": "settings-only"
      },
      {
        "key": "cognitive_emphasis",
        "canonicalStepId": "step_generate_assessment_items",
        "label": "Cognitive emphasis",
        "description": "Dominant cognitive level emphasis across generated items.",
        "controlType": "select",
        "default": "mixed",
        "options": [
          { "value": "mixed", "label": "Mixed" },
          { "value": "foundational", "label": "Foundational understanding" },
          { "value": "application", "label": "Application and transfer" },
          { "value": "analysis", "label": "Analysis and evaluation" }
        ],
        "visible": true,
        "advanced": true,
        "elicitation": "settings-only"
      },
      {
        "key": "feedback_mode",
        "canonicalStepId": "step_generate_assessment_items",
        "label": "Item feedback mode",
        "description": "Learner-facing feedback included with generated items (distinct from Design Feedback step).",
        "controlType": "select",
        "default": "per_item",
        "options": [
          { "value": "none", "label": "None" },
          { "value": "per_item", "label": "Per item" },
          { "value": "aggregate", "label": "Aggregate" },
          { "value": "both", "label": "Per item + aggregate" }
        ],
        "visible": true,
        "advanced": true,
        "elicitation": "settings-only"
      },
      {
        "key": "question_style_mix",
        "canonicalStepId": "step_generate_assessment_items",
        "label": "Response mode mix",
        "description": "Preferred mix of selected vs constructed response modes.",
        "controlType": "select",
        "default": "mixed_response_modes",
        "options": [
          { "value": "selected_response_only", "label": "Selected response only" },
          { "value": "constructed_response_only", "label": "Constructed response only" },
          { "value": "mixed_response_modes", "label": "Mixed selected + constructed" },
          { "value": "integrative_performance_oriented", "label": "Integrative/performance-style" }
        ],
        "visible": true,
        "advanced": false,
        "elicitation": "settings-only"
      },
      {
        "key": "include_examples",
        "canonicalStepId": "step_design_page",
        "label": "Include examples",
        "description": "Whether the page should include illustrative examples.",
        "controlType": "boolean",
        "default": "true",
        "visible": true,
        "advanced": true,
        "elicitation": "settings-only"
      },
      {
        "key": "total_items",
        "canonicalStepId": "step_design_assessment",
        "label": "Total assessment items",
        "description": "Total items/questions in the assessment blueprint.",
        "controlType": "number",
        "default": "10",
        "min": 1,
        "max": 200,
        "visible": true,
        "advanced": true,
        "elicitation": "settings-only"
      },
      {
        "key": "coverage_scope",
        "canonicalStepId": "step_design_assessment",
        "label": "Coverage scope",
        "description": "How broadly the assessment blueprint should cover outcomes/themes.",
        "controlType": "select",
        "default": "balanced",
        "options": [
          { "value": "selected_themes", "label": "Selected themes" },
          { "value": "balanced", "label": "Balanced" },
          { "value": "broad_coverage", "label": "Broad coverage" }
        ],
        "visible": true,
        "advanced": false,
        "elicitation": "settings-only"
      },
      {
        "key": "difficulty_profile",
        "canonicalStepId": "step_design_assessment",
        "label": "Difficulty profile",
        "description": "Overall difficulty distribution for the assessment blueprint (maps from brief difficulty_profile).",
        "controlType": "select",
        "default": "balanced",
        "options": [
          { "value": "foundation_heavy", "label": "Mostly foundational items" },
          { "value": "balanced", "label": "Balanced mix" },
          { "value": "higher_order_heavy", "label": "Mostly higher-order items" }
        ],
        "visible": true,
        "advanced": false,
        "elicitation": "settings-only"
      },
      {
        "key": "cognitive_demand",
        "canonicalStepId": "step_design_assessment",
        "label": "Cognitive demand profile",
        "description": "Dominant thinking level targeted by assessment tasks.",
        "controlType": "select",
        "default": "mixed",
        "options": [
          { "value": "recall_foundation", "label": "Recall and understanding" },
          { "value": "application_oriented", "label": "Application and problem-solving" },
          { "value": "analysis_evaluation", "label": "Analysis and evaluation" },
          { "value": "mixed", "label": "Mixed levels" }
        ],
        "visible": true,
        "advanced": true,
        "elicitation": "settings-only"
      },
      {
        "key": "assessment_cadence",
        "canonicalStepId": "step_design_assessment",
        "label": "Assessment cadence",
        "description": "How assessment is distributed across the broader learning scope.",
        "controlType": "select",
        "default": "periodic_formative",
        "options": [
          { "value": "single_end_point", "label": "Single end-point" },
          { "value": "periodic_formative", "label": "Periodic formative" },
          { "value": "mixed_formative_summative", "label": "Mixed formative and summative" }
        ],
        "visible": true,
        "advanced": true,
        "elicitation": "settings-only"
      },
      {
        "key": "feedback_display",
        "canonicalStepId": "step_design_assessment",
        "label": "Feedback display",
        "description": "How answers/feedback are planned in the blueprint (prompt-shaping; distinct from Design Feedback step).",
        "controlType": "select",
        "default": "answer_grid_end",
        "options": [
          { "value": "none", "label": "None" },
          { "value": "answer_grid_end", "label": "Answer grid at end" },
          { "value": "answers_explanations", "label": "Answers + explanations" },
          { "value": "reflection_then_answers", "label": "Reflection first, answers after" }
        ],
        "visible": true,
        "advanced": true,
        "elicitation": "settings-only"
      },
      {
        "key": "structure_mode",
        "canonicalStepId": "step_normalize_content",
        "label": "Structure mode",
        "description": "How normalized source content is structured.",
        "controlType": "select",
        "default": "reorganise_into_sections",
        "options": [
          { "value": "preserve_original_structure", "label": "Preserve original structure" },
          { "value": "reorganise_into_sections", "label": "Reorganise into sections" }
        ],
        "visible": true,
        "advanced": false,
        "elicitation": "settings-only"
      },
      {
        "key": "detail_level",
        "canonicalStepId": "step_normalize_content",
        "label": "Detail level",
        "description": "How much detail to preserve when normalizing content.",
        "controlType": "select",
        "default": "lightly_simplify_language",
        "options": [
          { "value": "preserve_full_detail", "label": "Preserve full detail" },
          { "value": "lightly_simplify_language", "label": "Lightly simplify language" }
        ],
        "visible": true,
        "advanced": true,
        "elicitation": "settings-only"
      },
      {
        "key": "keep_examples",
        "canonicalStepId": "step_normalize_content",
        "label": "Keep examples",
        "description": "Whether to retain meaningful examples from the source.",
        "controlType": "boolean",
        "default": "true",
        "visible": true,
        "advanced": true,
        "elicitation": "settings-only"
      },
      {
        "key": "include_relationships",
        "canonicalStepId": "step_model_knowledge",
        "label": "Include concept relationships",
        "description": "Include explicit relationships between concepts in the knowledge model.",
        "controlType": "boolean",
        "default": "true",
        "visible": true,
        "advanced": false,
        "elicitation": "settings-only"
      },
      {
        "key": "include_misconceptions",
        "canonicalStepId": "step_model_knowledge",
        "label": "Include misconceptions",
        "description": "Include likely misconceptions when supported by the source.",
        "controlType": "boolean",
        "default": "true",
        "visible": true,
        "advanced": false,
        "elicitation": "settings-only"
      },
      {
        "key": "include_processes",
        "canonicalStepId": "step_model_knowledge",
        "label": "Include processes/workflows",
        "description": "Include processes or workflows when present in the source.",
        "controlType": "boolean",
        "default": "true",
        "visible": true,
        "advanced": true,
        "elicitation": "settings-only"
      },
      {
        "key": "learnerLevel",
        "canonicalStepId": "step_define_learning_outcomes",
        "label": "Learner level",
        "description": "Target learner level for outcome wording (maps from brief learner level).",
        "controlType": "select",
        "default": "general_adult",
        "options": [
          { "value": "school", "label": "School" },
          { "value": "undergraduate", "label": "Undergraduate" },
          { "value": "postgraduate", "label": "Postgraduate" },
          { "value": "professional", "label": "Professional" },
          { "value": "general_adult", "label": "General adult" }
        ],
        "visible": true,
        "advanced": false,
        "elicitation": "settings-only"
      },
      {
        "key": "numberOfOutcomes",
        "canonicalStepId": "step_define_learning_outcomes",
        "label": "Number of outcomes",
        "description": "How many learning outcomes to generate.",
        "controlType": "number",
        "default": "6",
        "min": 2,
        "max": 12,
        "visible": true,
        "advanced": false,
        "elicitation": "settings-only"
      },
      {
        "key": "cognitiveEmphasis",
        "canonicalStepId": "step_define_learning_outcomes",
        "label": "Cognitive emphasis",
        "description": "Cognitive emphasis across generated outcomes.",
        "controlType": "select",
        "default": "mixed",
        "options": [
          { "value": "mixed", "label": "Mixed" },
          { "value": "foundational", "label": "Foundational understanding" },
          { "value": "application", "label": "Application and transfer" },
          { "value": "analysis", "label": "Analysis and evaluation" }
        ],
        "visible": true,
        "advanced": true,
        "elicitation": "settings-only"
      },
      {
        "key": "scope",
        "canonicalStepId": "step_define_learning_outcomes",
        "label": "Outcome scope",
        "description": "Scope framing for generated outcomes.",
        "controlType": "select",
        "default": "module",
        "options": [
          { "value": "lesson", "label": "Lesson" },
          { "value": "module", "label": "Module" },
          { "value": "course", "label": "Course" }
        ],
        "visible": true,
        "advanced": true,
        "elicitation": "settings-only"
      },
      {
        "key": "activity_pattern_mix",
        "canonicalStepId": "step_design_learning_activities",
        "label": "Activity pattern mix",
        "description": "Balance of guided vs applied/collaborative activity patterns.",
        "controlType": "select",
        "default": "balanced",
        "options": [
          { "value": "guided", "label": "Guided" },
          { "value": "balanced", "label": "Balanced" },
          { "value": "applied_collaborative", "label": "Applied collaborative" }
        ],
        "visible": true,
        "advanced": false,
        "elicitation": "settings-only"
      },
      {
        "key": "grouping_preference",
        "canonicalStepId": "step_design_learning_activities",
        "label": "Grouping preference",
        "description": "Preferred learner grouping modes across activities.",
        "controlType": "select",
        "default": "mixed",
        "options": [
          { "value": "mixed", "label": "Mixed" },
          { "value": "individual", "label": "Individual" },
          { "value": "pair", "label": "Pair" },
          { "value": "small_group", "label": "Small group" },
          { "value": "whole_group", "label": "Whole group" }
        ],
        "visible": true,
        "advanced": true,
        "elicitation": "settings-only"
      },
      {
        "key": "difficulty_level",
        "canonicalStepId": "step_design_learning_activities",
        "label": "Activity difficulty",
        "description": "Challenge level for designed learning activities.",
        "controlType": "select",
        "default": "moderate",
        "options": [
          { "value": "introductory", "label": "Introductory" },
          { "value": "moderate", "label": "Moderate" },
          { "value": "advanced", "label": "Advanced" }
        ],
        "visible": true,
        "advanced": true,
        "elicitation": "settings-only"
      },
      {
        "key": "coverage_breadth",
        "canonicalStepId": "step_design_learning_activities",
        "label": "Coverage breadth",
        "description": "How broadly activities should cover outcomes.",
        "controlType": "select",
        "default": "balanced",
        "options": [
          { "value": "narrow", "label": "Narrow (key outcomes only)" },
          { "value": "balanced", "label": "Balanced" },
          { "value": "broad", "label": "Broad coverage" }
        ],
        "visible": true,
        "advanced": true,
        "elicitation": "settings-only"
      },
      {
        "key": "session_materials",
        "canonicalStepId": "step_generate_activity_materials",
        "label": "Session materials",
        "description": "Which session-level material types to generate.",
        "controlType": "select",
        "default": "page",
        "options": [
          { "value": "page", "label": "Page" },
          { "value": "slide_deck", "label": "Slide deck" },
          { "value": "page,slide_deck", "label": "Page and slide deck" }
        ],
        "visible": true,
        "advanced": false,
        "elicitation": "settings-only"
      },
      {
        "key": "duration_minutes",
        "canonicalStepId": "step_construct_learning_sequence",
        "label": "Sequence duration (minutes)",
        "description": "Total duration for the constructed learning sequence.",
        "controlType": "number",
        "default": "60",
        "min": 15,
        "max": 240,
        "visible": true,
        "advanced": false,
        "elicitation": "settings-only"
      },
      {
        "key": "sequencing_granularity",
        "canonicalStepId": "step_construct_learning_sequence",
        "label": "Sequencing granularity",
        "description": "How detailed the learning sequence plan should be.",
        "controlType": "select",
        "default": "standard",
        "options": [
          { "value": "lightweight", "label": "Lightweight" },
          { "value": "standard", "label": "Standard" },
          { "value": "detailed", "label": "Detailed" }
        ],
        "visible": true,
        "advanced": false,
        "elicitation": "settings-only"
      },
      {
        "key": "sequencing_style",
        "canonicalStepId": "step_construct_learning_sequence",
        "label": "Sequencing style",
        "description": "Pedagogic sequencing style for the session plan.",
        "controlType": "select",
        "default": "progressive_scaffold",
        "options": [
          { "value": "progressive_scaffold", "label": "Progressive scaffold" },
          { "value": "spiral_revisit", "label": "Spiral revisit" },
          { "value": "assessment_anchored", "label": "Assessment anchored" }
        ],
        "visible": true,
        "advanced": true,
        "elicitation": "settings-only"
      }
    ],
    "mappingRules": [
      {
        "factor": "duration_minutes",
        "mapsTo": [
          "workflow.workflowOutputSpec.constraints.duration_minutes",
          "stepParams.step_construct_learning_sequence.duration_minutes"
        ]
      },
      {
        "factor": "topic",
        "mapsTo": [
          "workflow.workflowOutputSpec.constraints.topic"
        ]
      },
      {
        "factor": "learner_level",
        "mapsTo": [
          "workflow.workflowOutputSpec.audience",
          "stepParams.step_define_learning_outcomes.learnerLevel"
        ]
      },
      {
        "factor": "delivery_mode",
        "mapsTo": [
          "workflow.workflowOutputSpec.constraints.delivery_mode"
        ]
      },
      {
        "factor": "design_scope",
        "mapsTo": [
          "workflow.workflowOutputSpec.constraints.design_scope"
        ]
      },
      {
        "factor": "delivery_pattern",
        "mapsTo": [
          "workflow.workflowOutputSpec.constraints.delivery_pattern"
        ]
      },
      {
        "factor": "delivery_context",
        "mapsTo": [
          "workflow.workflowOutputSpec.constraints.delivery_context"
        ]
      },
      {
        "factor": "input_strategy",
        "mapsTo": [
          "workflow.workflowOutputSpec.constraints.input_strategy"
        ]
      },
      {
        "factor": "learning_environments",
        "mapsTo": [
          "workflow.workflowOutputSpec.constraints.learning_environments"
        ]
      },
      {
        "factor": "assessment_strategy",
        "mapsTo": [
          "workflow.workflowOutputSpec.constraints.assessment_strategy"
        ]
      },
      {
        "factor": "coverage_scope",
        "mapsTo": [
          "workflow.workflowOutputSpec.constraints.coverage_scope",
          "stepParams.step_design_assessment.coverage_scope"
        ]
      },
      {
        "factor": "cognitive_demand",
        "mapsTo": [
          "workflow.workflowOutputSpec.constraints.cognitive_demand",
          "stepParams.step_design_assessment.cognitive_demand"
        ]
      },
      {
        "factor": "question_style_mix",
        "mapsTo": [
          "workflow.workflowOutputSpec.constraints.question_style_mix",
          "stepParams.step_generate_assessment_items.question_style_mix"
        ]
      },
      {
        "factor": "assessment_type",
        "mapsTo": [
          "workflow.workflowOutputSpec.constraints.assessment_type",
          "stepParams.step_design_assessment.activity_type"
        ]
      },
      {
        "factor": "feedback_required",
        "mapsTo": [
          "workflow.workflowOutputSpec.constraints.feedback_required",
          "stepParams.step_design_feedback.feedback_required"
        ]
      },
      {
        "factor": "difficulty_profile",
        "mapsTo": [
          "workflow.workflowOutputSpec.constraints.difficulty_profile",
          "stepParams.step_design_assessment.difficulty_profile",
          "stepParams.step_generate_assessment_items.difficulty_profile"
        ]
      },
      {
        "factor": "assessment_total_items",
        "mapsTo": [
          "workflow.workflowOutputSpec.constraints.assessment_total_items",
          "stepParams.step_design_assessment.total_items",
          "stepParams.step_generate_assessment_items.number_of_items"
        ]
      },
      {
        "factor": "activity_pattern_mix",
        "mapsTo": [
          "workflow.workflowOutputSpec.constraints.activity_pattern_mix",
          "stepParams.step_design_learning_activities.activity_pattern_mix"
        ]
      },
      {
        "factor": "sequencing_granularity",
        "mapsTo": [
          "workflow.workflowOutputSpec.constraints.sequencing_granularity",
          "stepParams.step_construct_learning_sequence.sequencing_granularity"
        ]
      },
      {
        "factor": "assessment_cadence",
        "mapsTo": [
          "workflow.workflowOutputSpec.constraints.assessment_cadence",
          "stepParams.step_design_assessment.assessment_cadence"
        ]
      },
      {
        "factor": "session_materials",
        "mapsTo": [
          "workflow.workflowOutputSpec.constraints.session_materials",
          "stepParams.step_generate_activity_materials.session_materials"
        ]
      },
      {
        "factor": "page_profile",
        "mapsTo": [
          "workflow.workflowOutputSpec.constraints.page_profile",
          "stepParams.step_design_page.page_profile"
        ]
      },
      {
        "factor": "learner_level",
        "mapsTo": [
          "stepParams.step_design_page.audience_level"
        ]
      },
      {
        "factor": "tone_style",
        "mapsTo": [
          "workflow.workflowOutputSpec.constraints.tone_style",
          "stepParams.step_design_page.tone_style"
        ]
      },
      {
        "factor": "depth_level",
        "mapsTo": [
          "workflow.workflowOutputSpec.constraints.depth_level",
          "stepParams.step_design_page.depth_level"
        ]
      },
      {
        "factor": "include_examples",
        "mapsTo": [
          "workflow.workflowOutputSpec.constraints.include_examples",
          "stepParams.step_design_page.include_examples"
        ]
      },
      {
        "factor": "include_practice_tasks",
        "mapsTo": [
          "workflow.workflowOutputSpec.constraints.include_practice_tasks",
          "stepParams.step_design_page.include_practice_tasks"
        ]
      },
      {
        "factor": "compact_vs_detailed",
        "mapsTo": [
          "workflow.workflowOutputSpec.constraints.output_density",
          "stepParams.step_design_page.output_density"
        ]
      }
    ],
    "intentClasses": {
      "assessment_pack": {
        "stepIncludes": ["generate_assessment_items"],
        "detection": {
          "whenResolvedFactorsInclude": {
            "assessment_required": true
          },
          "whenGoalMentionsAnyOf": [
            "assessment",
            "quiz",
            "mcq",
            "question set",
            "question bank",
            "assessment pack",
            "test"
          ]
        },
        "elicitation": {
          "orderedFactors": [
            "assessment_type",
            "assessment_total_items",
            "question_style_mix",
            "difficulty_profile",
            "feedback_required",
            "coverage_scope",
            "cognitive_demand"
          ],
          "mustAskFactors": [
            "assessment_type",
            "assessment_total_items"
          ],
          "optionalFactors": [
            "question_style_mix",
            "difficulty_profile",
            "feedback_required",
            "coverage_scope"
          ],
          "optionalHighValueFactors": [
            "cognitive_demand"
          ]
        },
        "stepBiasHints": {
          "preferLeanAssessmentFlow": true,
          "defaultInclude": ["Generate Assessment Items"],
          "defaultExclude": ["Design Assessment"]
        }
      }
    },
    "stepRefinementProfiles": {
      "assessment_pack": {
        "applicability": {
          "intentClassAnyOf": ["assessment_pack"],
          "requiresAnyCanonicalSteps": ["generate_assessment_items"]
        },
        "bindingMode": "factor_ids_via_mapping_rules",
        "optionalOptInPrompt": "Do you want to refine the assessment further? I can ask about difficulty, coverage, feedback/model answers, and question mix. (yes/no)",
        "tiers": {
          "required": [],
          "optional": [
            {
              "factorId": "assessment_type",
              "questionText": "What assessment type should this use?\nChoose one: MCQ, short answer, essay, case study, problem-based, or mixed.\nIf you're unsure, say 'recommend'.",
              "parseHints": {
                "recommendEnabled": true,
                "aliases": {
                  "mcq": "mcq",
                  "multiple choice": "mcq",
                  "multiple-choice": "mcq",
                  "short answer": "short_answer",
                  "short-answer": "short_answer",
                  "essay": "essay",
                  "case study": "case_study",
                  "case-study": "case_study",
                  "problem based": "problem",
                  "problem-based": "problem",
                  "mixed": "mixed"
                }
              }
            },
            {
              "factorId": "assessment_total_items",
              "questionText": "How many assessment items should be generated?\nFor example: 8, 10, or 20.",
              "parseHints": {
                "numberExtraction": true
              }
            },
            {
              "factorId": "difficulty_profile",
              "questionText": "What difficulty level should the items target?\nChoose one: introductory, balanced, or challenging.",
              "parseHints": {
                "aliases": {
                  "introductory": "foundation_heavy",
                  "easy": "foundation_heavy",
                  "balanced": "balanced",
                  "challenging": "higher_order_heavy",
                  "advanced": "higher_order_heavy"
                }
              }
            },
            {
              "factorId": "coverage_scope",
              "questionText": "What should the questions cover?\nChoose one: broad coverage, selected themes, or key concepts only.",
              "parseHints": {
                "aliases": {
                  "broad coverage": "broad_coverage",
                  "selected themes": "selected_themes",
                  "key concepts only": "selected_themes"
                }
              }
            },
            {
              "factorId": "feedback_required",
              "questionText": "Should the pack include feedback or model answers?\nAnswer yes or no.",
              "parseHints": {
                "booleanAliases": {
                  "yes": "item_level",
                  "y": "item_level",
                  "true": "item_level",
                  "1": "item_level",
                  "no": "none",
                  "n": "none",
                  "false": "none",
                  "0": "none"
                }
              }
            },
            {
              "factorId": "question_style_mix",
              "questionText": "Should the question style be consistent or varied?\nChoose one: consistent, varied, or mixed.",
              "parseHints": {
                "aliases": {
                  "consistent": "selected_response_only",
                  "varied": "constructed_response_only",
                  "mixed": "mixed_response_modes"
                }
              }
            },
            {
              "factorId": "cognitive_demand",
              "questionText": "What cognitive level should the questions target?\nChoose one: recall, application, analysis, or mixed.",
              "parseHints": {
                "aliases": {
                  "recall": "recall_foundation",
                  "application": "application_oriented",
                  "analysis": "analysis_evaluation",
                  "mixed": "mixed"
                }
              }
            }
          ]
        }
      },
      "design_page": {
        "applicability": {
          "requiresAnyCanonicalSteps": ["design_page"],
          "whenGoalMentionsAnyOf": [
            "learner page",
            "student page",
            "learner-facing page",
            "student-facing page",
            "revision page",
            "resource page",
            "tutor resource page",
            "content page",
            "readable page"
          ]
        },
        "bindingMode": "factor_ids_via_mapping_rules",
        "optionalOptInPrompt": "Do you want to refine the page further? I can ask about page profile, tone, depth, examples, practice tasks, and compactness — or adjust these in step Settings. (yes/no)",
        "tiers": {
          "required": [],
          "optional": [
            {
              "factorId": "page_profile",
              "questionText": "What page profile should this use?\nChoose one: learner, facilitator (tutor), or assessment.",
              "parseHints": {
                "recommendEnabled": true,
                "aliases": {
                  "learner": "learner",
                  "student": "learner",
                  "revision": "learner",
                  "facilitator": "facilitator",
                  "tutor": "facilitator",
                  "teacher": "facilitator",
                  "assessment": "assessment"
                }
              }
            },
            {
              "factorId": "tone_style",
              "questionText": "What tone and style should the page use?\nChoose one: formal, friendly, academic, conversational, or mixed.",
              "parseHints": {
                "recommendEnabled": true,
                "aliases": {
                  "formal": "formal",
                  "friendly": "friendly",
                  "academic": "academic",
                  "conversational": "conversational",
                  "mixed": "mixed"
                }
              }
            },
            {
              "factorId": "depth_level",
              "questionText": "What depth level should the page content target?\nChoose one: foundational, application, analysis, or mixed.",
              "parseHints": {
                "recommendEnabled": true,
                "aliases": {
                  "foundational": "foundational",
                  "application": "application",
                  "analysis": "analysis",
                  "mixed": "mixed"
                }
              }
            },
            {
              "factorId": "include_examples",
              "questionText": "Should the page include illustrative examples?\nAnswer yes or no.",
              "parseHints": {
                "booleanAliases": {
                  "yes": true,
                  "y": true,
                  "no": false,
                  "n": false
                }
              }
            },
            {
              "factorId": "include_practice_tasks",
              "questionText": "Should the page include short practice tasks or questions?\nAnswer yes or no.",
              "parseHints": {
                "booleanAliases": {
                  "yes": true,
                  "y": true,
                  "no": false,
                  "n": false
                }
              }
            },
            {
              "factorId": "compact_vs_detailed",
              "questionText": "Should the page be compact or detailed?\nChoose one: compact, standard, or detailed.",
              "parseHints": {
                "recommendEnabled": true,
                "aliases": {
                  "compact": "compact",
                  "standard": "standard",
                  "detailed": "detailed"
                }
              }
            }
          ]
        }
      },
      "learner_page_pack": {
        "applicability": {
          "requiresAnyCanonicalSteps": ["design_page"],
          "whenGoalMentionsAnyOf": [
            "learner page",
            "student page",
            "learner-facing page",
            "student-facing page",
            "revision page",
            "resource page",
            "tutor resource page",
            "content page",
            "readable page"
          ]
        },
        "bindingMode": "factor_ids_via_mapping_rules",
        "optionalOptInPrompt": "Do you want to refine the page further? I can ask about page profile, tone, depth, examples, practice tasks, and compactness — or adjust these in step Settings. (yes/no)",
        "tiers": {
          "required": [],
          "optional": [
            {
              "factorId": "page_profile",
              "questionText": "What page profile should this use?\nChoose one: learner, facilitator (tutor), or assessment.",
              "parseHints": {
                "recommendEnabled": true,
                "aliases": {
                  "learner": "learner",
                  "student": "learner",
                  "revision": "learner",
                  "facilitator": "facilitator",
                  "tutor": "facilitator",
                  "teacher": "facilitator",
                  "assessment": "assessment"
                }
              }
            },
            {
              "factorId": "tone_style",
              "questionText": "What tone and style should the page use?\nChoose one: formal, friendly, academic, conversational, or mixed.",
              "parseHints": {
                "recommendEnabled": true,
                "aliases": {
                  "formal": "formal",
                  "friendly": "friendly",
                  "academic": "academic",
                  "conversational": "conversational",
                  "mixed": "mixed"
                }
              }
            },
            {
              "factorId": "depth_level",
              "questionText": "What depth level should the page content target?\nChoose one: foundational, application, analysis, or mixed.",
              "parseHints": {
                "recommendEnabled": true,
                "aliases": {
                  "foundational": "foundational",
                  "application": "application",
                  "analysis": "analysis",
                  "mixed": "mixed"
                }
              }
            },
            {
              "factorId": "include_examples",
              "questionText": "Should the page include illustrative examples?\nAnswer yes or no.",
              "parseHints": {
                "booleanAliases": {
                  "yes": true,
                  "y": true,
                  "no": false,
                  "n": false
                }
              }
            },
            {
              "factorId": "include_practice_tasks",
              "questionText": "Should the page include short practice tasks or questions?\nAnswer yes or no.",
              "parseHints": {
                "booleanAliases": {
                  "yes": true,
                  "y": true,
                  "no": false,
                  "n": false
                }
              }
            },
            {
              "factorId": "compact_vs_detailed",
              "questionText": "Should the page be compact or detailed?\nChoose one: compact, standard, or detailed.",
              "parseHints": {
                "recommendEnabled": true,
                "aliases": {
                  "compact": "compact",
                  "standard": "standard",
                  "detailed": "detailed"
                }
              }
            }
          ]
        }
      }
    },
    "disclosurePolicy": {
      "messages": {
        "ld_generate_without_source": "The brief mentions uploaded or source material, but the plan is set to generate from a topic without aligning source-ingest steps to that intent.",
        "ld_scope_step_mismatch": "A session-scale design was requested, but the draft plan has a relatively long step chain.",
        "ld_assessment_generate_step_missing": "The brief targets assessment outputs, but the draft plan does not yet include a step to generate assessment items.",
        "ld_page_profile_facilitator_mismatch": "The brief points to facilitator or tutor materials, but the page profile is set to learner."
      },
      "categories": {
        "missing_essential": {
          "label": "Still needed",
          "order": 1
        },
        "conflicting_intent": {
          "label": "Conflicting intent",
          "order": 2
        },
        "blocked_unsafe_inference": {
          "label": "Blocked unsafe inference",
          "order": 3
        },
        "rejected_inference": {
          "label": "Inferred but not used",
          "order": 4
        },
        "gated_planning": {
          "label": "Planning steps withheld",
          "order": 5
        },
        "planning_adequacy": {
          "label": "Planning adequacy",
          "order": 6
        }
      },
      "entries": {
        "ld_generate_without_source": {
          "category": "planning_adequacy",
          "action": "Attach source content in Inputs, set starting point to uploaded material, or confirm topic-only generation."
        },
        "ld_scope_step_mismatch": {
          "category": "planning_adequacy",
          "action": "Narrow design scope, remove optional steps, or change scope to sequence or module if a longer workflow is intended."
        },
        "ld_assessment_generate_step_missing": {
          "category": "planning_adequacy",
          "action": "Add or confirm a Generate Assessment Items step, or adjust the brief if assessment is not required."
        },
        "ld_page_profile_facilitator_mismatch": {
          "category": "planning_adequacy",
          "action": "Set page profile to facilitator in the brief or step Settings, or confirm a learner-facing page is intended."
        }
      }
    },
    "planningAdequacyChecks": [
      {
        "id": "ld_generate_without_source",
        "category": "planning_adequacy",
        "severity": "recommendation",
        "when": {
          "resolvedFactorEquals": {
            "input_strategy": "generate_from_topic"
          },
          "briefFieldMentionAnyOf": {
            "fields": ["designIntent", "goal", "desiredOutputs", "inputs"],
            "terms": [
              "evidence",
              "source material",
              "uploaded",
              "pdf",
              "document",
              "transcript",
              "attached",
              "case study materials",
              "provided source"
            ]
          },
          "stepsIncludeAny": ["Normalize Content"]
        },
        "disclosureId": "ld_generate_without_source"
      },
      {
        "id": "ld_scope_step_mismatch",
        "category": "planning_adequacy",
        "severity": "recommendation",
        "when": {
          "resolvedFactorEquals": {
            "design_scope": "session"
          },
          "stepCountAtLeast": {
            "minSteps": 8
          }
        },
        "disclosureId": "ld_scope_step_mismatch"
      },
      {
        "id": "ld_assessment_generate_step_missing",
        "category": "planning_adequacy",
        "severity": "recommendation",
        "when": {
          "resolvedFactorEquals": {
            "assessment_required": true
          },
          "briefFieldMentionAnyOf": {
            "fields": ["designIntent", "goal", "desiredOutputs"],
            "terms": [
              "assessment",
              "quiz",
              "mcq",
              "question set",
              "assessment pack",
              "formative assessment",
              "test"
            ]
          },
          "stepsLackAny": ["Generate Assessment Items"]
        },
        "disclosureId": "ld_assessment_generate_step_missing"
      },
      {
        "id": "ld_page_profile_facilitator_mismatch",
        "category": "planning_adequacy",
        "severity": "recommendation",
        "when": {
          "resolvedFactorEquals": {
            "page_profile": "learner"
          },
          "briefFieldMentionAnyOf": {
            "fields": ["designIntent", "goal", "desiredOutputs"],
            "terms": [
              "facilitator",
              "tutor",
              "instructor",
              "facilitator guide",
              "tutor resource"
            ]
          },
          "stepsIncludeAny": ["Design Page"]
        },
        "disclosureId": "ld_page_profile_facilitator_mismatch"
      }
    ],
    "stopConditions": ["all_required_factors_resolved"],
    "questionPolicy": {
      "maxDefaultQuestions": 8,
      "askOptionalByDefault": false,
      "maxRefinementQuestions": 8,
      "askRefinementByDefault": false
    }
  }
}
```

## 1. Normalize Content

### Type
Extraction

### Input
Raw content (e.g. transcript, text, document) or learning_content

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
  "allowWorkflowGoalContext": false,
  "promptScope": "step_only",
  "defaultPromptStrategy": "default_template",
  "promptTemplate": "You are preparing raw source material for normalization.\n\nTask:\nTransform the provided content into clean, coherent normalized_content while preserving the original meaning.\n\nInstructions:\n- Remove irrelevant material such as navigation text, duplicate content, formatting artefacts, and non-essential references\n- Preserve meaningful content, including definitions, examples, explanations, and important distinctions\n- Organise content into clear sections and headings when structure mode is sectioned\n- Improve clarity where sentences are fragmented or poorly structured, without changing meaning\n- Keep terminology consistent\n- Do not introduce new ideas, interpretation, or analysis\n- Prioritise fidelity and completeness, but if source size exceeds practical single-response limits, produce the best possible comprehensive structured normalization within response limits\n- In large-input cases, continue autonomously with best-effort structured normalization; do not ask the user to choose sections, chunking strategy, or continuation mode\n\nConfiguration:\n- Structure mode: {{option:structure_mode}}\n- Detail level: {{option:detail_level}}\n- Keep examples: {{option:keep_examples}}\n\nOutput requirements:\n- Return normalized content in {{preferredOutputFormat}}\n- Use descriptive sections, headings, and coherent paragraphs\n- Focus only on transforming raw content into normalized_content\n- Do not ask follow-up questions\n\nReturn only the normalized content.",
  "preferredOutputFormat": "structured_markdown",
  "defaultPromptNotes": "Use a canonical normalize-content prompt that cleans and reorganises source content into coherent sections while preserving important detail and examples for downstream modelling.",
  "runnerInstructions": {
    "what_this_step_does": "This step prepares and normalizes source content so it is clean, structured, and ready for downstream learning-design steps."
  },
  "defaultOutputStructure": {
    "sections": ["Source overview", "Cleaned content", "Key terms", "Retained examples"]
  },
  "userOptions": [
    {
      "id": "structure_mode",
      "label": "Structure mode",
      "type": "select",
      "default": "reorganise_into_sections",
      "choices": [
        {
          "value": "preserve_original_structure",
          "label": "Preserve original structure",
          "promptInstruction": "Preserve the source structure as much as possible while cleaning content."
        },
        {
          "value": "reorganise_into_sections",
          "label": "Reorganise into sections",
          "promptInstruction": "Reorganise the normalized output into clear thematic sections."
        }
      ]
    },
    {
      "id": "detail_level",
      "label": "Detail level",
      "type": "select",
      "default": "lightly_simplify_language",
      "choices": [
        {
          "value": "preserve_full_detail",
          "label": "Preserve full detail",
          "promptInstruction": "Preserve full informational detail; do not reduce substantive content."
        },
        {
          "value": "lightly_simplify_language",
          "label": "Lightly simplify language",
          "promptInstruction": "Lightly simplify language while preserving meaning and key detail."
        }
      ]
    },
    {
      "id": "keep_examples",
      "label": "Keep examples",
      "type": "boolean",
      "default": true,
      "promptInstructionWhenTrue": "Retain meaningful examples from the source where they aid understanding.",
      "promptInstructionWhenFalse": "Do not prioritize retaining source examples unless they are essential to meaning."
    }
  ]
}
```

---

## 2. Generate Learning Content

### Type
Generation

### Input
optional topic, optional audience, optional level, optional source_material

### Output
learning_content

### Purpose
- Generate teaching-ready instructional content when source content is missing
- Extend or improve existing source material when provided
- Produce structured content suitable for downstream learning-design steps

### Aliases
- Create Learning Content
- Draft Instructional Content
- Extend Teaching Content

### Prompt Factory
```json
{
  "configurationMode": "none",
  "askForCustomSchema": false,
  "defaultPromptStrategy": "default_template",
  "preferredOutputFormat": "json",
  "defaultPromptNotes": "Generate or extend pedagogically structured learning content that is ready for downstream modelling and design.",
  "runnerInstructions": {
    "what_this_step_does": "This step creates baseline learning content from topic and/or source inputs for downstream design steps."
  },
  "defaultOutputStructure": {
    "keys": ["title", "sections", "key_concepts", "examples"]
  },
  "promptTemplate": "Context:\nYou may be provided with topic, audience, level, and optional source_material.\n\nTask:\nGenerate or extend teaching-ready learning_content that is pedagogically structured and suitable for downstream learning design.\n\nInstructions:\n- If source_material is provided, extend and improve it by clarifying explanations, adding suitable examples, and improving structure\n- Do not discard or contradict valid source material when extending it\n- If source_material is not provided, generate content from topic, audience, and level\n- Use clear explanations, logical sectioning, key concepts, and illustrative examples\n- Organise progression from simpler ideas to more complex ideas\n- Adapt depth, terminology, and explanation style to the specified audience and level\n- Avoid unnecessary technicality unless required by audience/level\n- Avoid generic summaries; produce purposeful teaching content\n- Keep content grounded in provided topic and/or source material\n- Do not hallucinate unnecessary detail\n- Ensure output can be consumed by downstream steps such as knowledge modelling, learning-outcome generation, and activity design\n- Apply step notes when provided: {{stepNotes}}\n\nOutput:\n- Return output as {{preferredOutputFormat}}\n- Return a JSON object containing: title, sections, key_concepts, examples\n- sections should be an ordered array with section title and section content suitable for teaching use\n- Return only the JSON."
}
```

---

## 3. Model Knowledge

### Type
Transformation

### Input
normalized_content or learning_content

### Output
knowledge_model

### Purpose
- Identify key concepts
- Define relationships between concepts
- Surface processes and structures
- Identify misconceptions

### Aliases
- Build Knowledge Model
- Extract Concepts
- Map Concepts
- Identify Key Concepts
- Identify key concepts and facts

### Prompt Factory
```json
{
  "configurationMode": "simple",
  "askForCustomSchema": false,
  "allowWorkflowGoalContext": false,
  "promptScope": "step_only",
  "structureStyle": "schema_structured",
  "defaultPromptStrategy": "default_template",
  "promptTemplate": "You are given structured content representing source material.\n\nYour task is to model the conceptual knowledge contained in this content as a structured artefact called \"knowledge_model\".\n\nInstructions:\n- Identify key concepts from the source and include a clear definition for each concept\n- Make important relationships between concepts explicit (e.g. prerequisite, part-of, causes, enables, contrasts)\n- Identify meaningful groupings or hierarchies of concepts where relevant\n- Identify processes, sequences, or workflows when present in the source\n- Identify likely misconceptions or confusion points when supported by the source\n- Keep all output faithful to the provided content only\n- Do not introduce external knowledge, assumptions, or unsupported interpretation\n- Write with clarity and precision so the output can be reused directly downstream\n\nStep notes (if provided): {{stepNotes}}\n\nOutput requirements (strict — fenced JSON block only):\n- Return exactly one markdown fenced JSON block opened with \u0060\u0060\u0060json and closed with \u0060\u0060\u0060\n- The fenced block body must be the knowledge_model root object as valid JSON\n- Do NOT include any prose, headings, commentary, or explanations before or after the fenced block\n- Do NOT return raw JSON without the \u0060\u0060\u0060json fence (unfenced JSON text is invalid)\n- Do NOT include JSON comments (no // or block comments)\n- Do NOT prefix or suffix workflow metadata (no STEP N OUTPUT lines)\n- The JSON object MUST include these top-level keys (use empty arrays when none apply): concepts, relationships, groupings, processes, misconceptions\n- concepts: each entry with name and definition when supported by the source\n- Include relationships, groupings, processes, and misconceptions when supported by the source\n- Keep output faithful to source for downstream reuse without reinterpretation",
  "preferredOutputFormat": "json",
  "defaultPromptNotes": "Return exactly one \u0060\u0060\u0060json fenced block containing the knowledge_model object. No prose before or after the block. Emphasize concepts and relationships; include misconceptions and processes when present in source.",
  "runnerInstructions": {
    "what_this_step_does": "This step transforms content into an explicit concept-and-relationship model for planning."
  },
  "defaultOutputStructure": {
    "keys": ["concepts", "relationships", "groupings", "processes", "misconceptions"]
  },
  "userOptions": [
    {
      "id": "include_relationships",
      "label": "Include concept relationships",
      "type": "boolean",
      "default": true,
      "promptInstructionWhenTrue": "Include explicit relationships between concepts when supported by the source."
    },
    {
      "id": "include_misconceptions",
      "label": "Include misconceptions",
      "type": "boolean",
      "default": true,
      "promptInstructionWhenTrue": "Include likely misconceptions when evidence in the source supports them."
    },
    {
      "id": "include_processes",
      "label": "Include processes/workflows if present",
      "type": "boolean",
      "default": true,
      "promptInstructionWhenTrue": "Include processes or workflows when present in the source material."
    }
  ]
}
```

---

## 4. Define Learning Outcomes

### Type
Generation

### Input
knowledge_model or learning_content

### Output
learning_outcomes

### Purpose
- Translate concepts into assessable performance
- Define what learners should be able to do

### Aliases
- Generate Learning Outcomes
- Create Learning Outcomes
- Define Outcomes

### Prompt Factory
```json
{
  "configurationMode": "simple",
  "askForCustomSchema": false,
  "defaultPromptStrategy": "default_template",
  "structureStyle": "schema_structured",
  "promptTemplate": "You are designing learning outcomes from a structured knowledge model.\n\nTask:\nGenerate clear, observable, and assessable learning outcomes derived from the provided knowledge model.\n\nInstructions:\n- Use measurable language and avoid vague verbs such as \"understand\", \"know\", or \"appreciate\"\n- Ensure each outcome aligns with concepts in the knowledge model\n- Set cognitive demand in line with the specified learner level, scope, and cognitive emphasis\n- Produce balanced coverage without redundancy\n- Keep all outcomes grounded in the knowledge model and source content\n- Keep wording precise so outcomes can be reused directly for assessment and activity design\n- Outcomes must be realistically achievable within the stated time and structure\n- Avoid attempting to cover all concepts in short designs\n- Prefer tightly focused, demonstrable outcomes\n\nScope-aware outcome guidance:\n- If the design is a short session (<= 30 minutes) or explicitly single_activity: generate 2-4 outcomes maximum, focus on depth over coverage, and select only the most essential and achievable goals\n- If the design is a standard session (30-120 minutes): generate 3-6 outcomes with moderate breadth and progression\n- If the design is extended (multi-session, module, or longer duration): generate a broader set of outcomes reflecting wider coverage\n\nConstraints:\n- Learner level: {{option:learnerLevel}}\n- Number of outcomes: {{option:numberOfOutcomes}}\n- Cognitive emphasis: {{option:cognitiveEmphasis}}\n- Scope: {{option:scope}}\n- Step notes: {{stepNotes}}\n\nOutput requirements (strict — fenced JSON block only):\n- Return exactly one markdown fenced JSON block opened with \u0060\u0060\u0060json and closed with \u0060\u0060\u0060\n- The fenced block body must be the learning_outcomes root object as valid JSON\n- Do NOT include any prose, headings, commentary, or explanations before or after the fenced block\n- Do NOT return raw JSON without the \u0060\u0060\u0060json fence (unfenced JSON text is invalid)\n- Do NOT include JSON comments (no // or block comments)\n- Do NOT prefix or suffix workflow metadata (no STEP N OUTPUT lines)\n- JSON top-level keys: learning_outcomes (required array), plus optional learner_level, scope, alignment_notes\n- Each learning_outcomes entry must include statement, related_concepts, cognitive_level, and notes where needed\n- Return only the single fenced block.",
  "preferredOutputFormat": "json",
  "defaultPromptNotes": "Return exactly one \u0060\u0060\u0060json fenced block containing the learning_outcomes object. No prose before or after the block. Generate observable and assessable outcomes aligned with the knowledge model, suitable for downstream assessment and activity design.",
  "runnerInstructions": {
    "what_this_step_does": "This step defines measurable learning outcomes aligned to the modelled knowledge."
  },
  "defaultOutputStructure": {
    "keys": [
      "learning_outcomes",
      "alignment_notes"
    ]
  },
  "userOptions": [
    {
      "id": "learnerLevel",
      "label": "Learner level",
      "type": "select",
      "default": "general_adult",
      "choices": [
        {
          "value": "school",
          "label": "School",
          "promptInstruction": "Write outcomes suitable for school-level learners."
        },
        {
          "value": "undergraduate",
          "label": "Undergraduate",
          "promptInstruction": "Write outcomes suitable for undergraduate learners."
        },
        {
          "value": "postgraduate",
          "label": "Postgraduate",
          "promptInstruction": "Write outcomes suitable for postgraduate learners."
        },
        {
          "value": "professional",
          "label": "Professional",
          "promptInstruction": "Write outcomes suitable for professional learners."
        },
        {
          "value": "general_adult",
          "label": "General adult",
          "promptInstruction": "Write outcomes suitable for a general adult audience."
        }
      ]
    },
    {
      "id": "numberOfOutcomes",
      "label": "Number of outcomes",
      "type": "number",
      "default": 6,
      "min": 3,
      "max": 12,
      "promptInstructionTemplate": "Generate exactly {{value}} learning outcomes."
    },
    {
      "id": "cognitiveEmphasis",
      "label": "Cognitive emphasis",
      "type": "select",
      "default": "mixed",
      "choices": [
        {
          "value": "mixed",
          "label": "Mixed",
          "promptInstruction": "Use a mixed cognitive emphasis across outcomes."
        },
        {
          "value": "foundational",
          "label": "Foundational understanding",
          "promptInstruction": "Emphasize foundational understanding in the outcomes."
        },
        {
          "value": "application",
          "label": "Application and transfer",
          "promptInstruction": "Emphasize application and transfer in the outcomes."
        },
        {
          "value": "analysis",
          "label": "Analysis and evaluation",
          "promptInstruction": "Emphasize analysis and evaluation in the outcomes."
        }
      ]
    },
    {
      "id": "scope",
      "label": "Scope",
      "type": "select",
      "default": "module",
      "choices": [
        {
          "value": "lesson",
          "label": "Lesson",
          "promptInstruction": "Keep outcome scope appropriate for a lesson."
        },
        {
          "value": "module",
          "label": "Module",
          "promptInstruction": "Keep outcome scope appropriate for a module."
        },
        {
          "value": "course",
          "label": "Course",
          "promptInstruction": "Keep outcome scope appropriate for a course."
        }
      ]
    }
  ],
  "structureStyle": "schema_structured"
}

```

---

## 5. Design Learning Activities

### Type
Generation

### Input
learning_outcomes, episode_plans (and optionally knowledge_model or learning_content)

### Output
learning_activities

### Purpose
- Populate learning_activities obligations from upstream episode_plans
- Enable learners to achieve outcomes through populated beat obligations

### Blended / HE Guidance
- Respect resolved workflow constraints: `design_scope`, `delivery_pattern`, `learning_environments`
- Design activities that are valid for each selected environment
- Keep this step focused on activity design; do not generate full material content here

### Aliases
- Generate Learning Activities
- Create Learning Activities
- Design Activities

### Prompt Factory
```json

{
  "configurationMode": "simple",
  "askForCustomSchema": false,
  "defaultPromptStrategy": "default_template",
  "promptTemplate": "Context:\nYou are provided with learning_outcomes, episode_plans (required — authoritative archetype and ordered instructional-function beats from upstream Episode Plan), and optionally knowledge_model or learning_content.\n\nTask:\nPopulate executable learning_activities from upstream episode_plans. This step is an obligation population step — translate each episode_plan beat into activity fields and required_materials obligations. It is not a learning-design, sequencing, archetype-selection, or session-arc step. Do not replan beats, archetypes, function sequences, or cross-activity session arc.\n\nInstructions:\n- Every activity must be implementation-ready with explicit learner_task, observable expected_output, required_materials, grouping, and duration_minutes\n- Consume episode_plans beat order and archetype as fixed — populate obligations per beat; do not reconstruct function_sequence or infer primary_archetype from LO alone\n- Learner-facing fields may use limited Markdown: ##/### headings, lists, **bold**, simple pipe tables, --- rules\n- Canonical contracts: LD-TABLE-FIDELITY (table types → pipe tables in GAM); LD-MATERIALS-COPY (specify types/requirements only; GAM authors bodies); LD-MATH-RENDER (TeX \\(...\\) / \\[...\\] only); LD-SELF-DIRECTED-RHETORIC when self_directed\n- Omit facilitator_moves and failure_mode for self_directed learner-page workflows\n- Use workflow constraints when present: design_scope, delivery_pattern, learning_environments\n- Define required_materials as material_id, type, purpose, specification — not full material bodies\n- Use KM/LO affordances to enrich specification wording only — not to replan beats or archetypes\n- Avoid LO→task shells; use KM definitions/processes/misconceptions in specs where relevant beats require them\n- If design_scope is single_activity, produce one focused activity unless clearly justified\n- Do not produce discussion-only, facilitator-redesign, or delivery-impossible activities\n- Apply step notes when provided: {{stepNotes}}\n\nObligation population gates (38S — mandatory BEFORE learner_task or required_materials; upstream episode_plans owns archetype and beat order — populate, do not replan; internal reasoning only):\n- IFP-04 POPULATION INFERENCE: INF-01 infer from LO/brief + existing KM only; INF-02 no invented domain facts except brief/minimal scenario constants; INF-03 criteria operational; INF-04 strategy menu 3–6 neutral not pre-ranked; INF-05 exemplar models reasoning not single answer; INF-06 scenario numerics illustrative; Evaluate archetype specs: 3–5 criteria, ≥2 perspectives, ≥2 trade-off prompts, worked judgement weak vs strong (strong ≠ expected_output), Transfer with same criteria; forbid pre-written learner memo in consolidation_summary, pre-ranked strategy, session summary as Evaluate teaching; INF-EVAL-01 (38L-4): KM-T05 household budget inflation workbook → fourth Evaluate LO = household strategy judgement (38I-4 A4); KM-T08 policy communication = macro context only — not primary Evaluate driver\n- IFP-05 ANTI-SHELL: shell = preamble + single learner_task + thin materials without beat obligations — FAIL; AS-01 every Required beat has required_materials entry; AS-02 learner_task ≥2 teach/model segments before perform; AS-03 ≥1 teaching-depth spec (worked_example, modelling_note, text exposition, scenario narrative); AS-04 Verification ≥4 check items specified; AS-05 expected_output = observable evidence not topic coverage; AS-06 Evaluate EV-SHELL-01..07; AS-FAIL-01 <80% beat functions populated; AS-FAIL-02 learner_task dominates without Worked thinking/Explanation; AS-FAIL-03 materials only for DLA-WB checklist without beat map; AS-FAIL-04 capstone Evaluate with consolidation_summary+prompt_set only; AS-FAIL-05 Apply without Worked thinking when KM-T03 fired; AS-FAIL-06 (38L-4 R5): Evaluate with guided judgement but missing independent judgement template/task_cards OR verification checklist OR transfer_prompt — add missing obligation rows before emit\n- IFP-06 ANTI-SPOILER: allow worked/modelling/criteria teaching specs; forbid completed learner memo in consolidation_summary when learner must write; sample_output not copy target; SP-01..04 scaffold-only specs when learner-production required (GAM realises in §6)\n- OBLIGATION POPULATION (38S — authoritative beat→obligation contract; merges IFP-09/10 + DLA-WB-26..31): For every Required beat from episode_plans, each required_materials row MUST include depth_floor: L3 plus content obligations — not type-only specs; apply FUNCTION_SPECS + 38K-2 five-dimension sufficiency; GAM-PRES realises bodies. Gates when function Required (cognition fields alone FAIL): G1 Verification (DLA-WB-26 / 38L-2 R1) → every activity MUST list type checklist with purpose verification/self-check/rubric; depth_floor L3: ≥4 criteria-linked check items + repair/revise if any fail; table completion alone does NOT satisfy verification (AS-04, EMIT-FAIL-04); G2 Transfer → transfer_prompt row when Transfer Required; G3 Independent judgement (Evaluate / DLA-WB-28) → template|task_cards separate from consolidation_summary; expected_output names memo artefact; scaffold only per IFP-06; G4 Worked analytic pass (Analyse / DLA-WB-27 / 38L-2 R6) → worked_example|modelling_note with purpose worked analytic pass BEFORE analysis_table; fact→analytical lens→mechanism→draft cell walkthrough; analysis_table spec requires ≥1 exemplar row or hint column; G5 Guided judgement → analysis_table|decision_table|comparison_table with ≥1 partial exemplar row or hint column + scoring guide. Evaluate completion pack (DLA-WB-31 / 38L-4 — EV-CAP-03/04, INF-EVAL-01): criteria exposition (≥3 dimensions) + scenario (≥2 perspectives) + worked judgement weak vs strong + guided table + independent judgement + checklist + transfer_prompt — consolidation_summary alone does NOT satisfy Evaluate; EV-CAP-04: guided judgement alone CANNOT terminate Evaluate; independent judgement + verification + transfer Materials required. Apply (DLA-WB-23): when archetype=Apply and KM-T03 (process ≥3 steps) list worked_example with stepped think-aloud before independent practice. Depth discipline (DLA-WB-30 / 38L-2 R2): every R-function Material specification includes depth_floor: L3 content obligations — thin type-only specs are depth FAIL. Anti-emission (DLA-WB-29 / EMIT-FAIL-01..04): transfer_or_application_task without transfer_prompt; verification implied only by complete the table; consolidation_summary as sole Evaluate capstone evidence; prompt_set substituting for checklist — add Materials before JSON emit (do not replan beats)\nSelf-study workbook contract (DLA-WB — when delivery_context is self_directed AND brief/desired outputs imply ~60-minute learner workbook or learner page). Types/purposes only — GAM authors bodies (LD-MATERIALS-COPY). Mandatory rows as explicit required_materials JSON when applied — delivery_notes alone insufficient:\n- DLA-WB-01: delivery_notes: resource_intent self_study_workbook, session_duration_target_minutes (~60), consolidation_requirement, workbook_contract_applied: true\n- DLA-WB-02: Every activity maps ≥1 learning outcome ID; final capstone maps ≥3 distinct outcome IDs when ≥3 outcomes available\n- DLA-WB-03: Sum of activity duration_minutes across the session must be 50–70 unless delivery_notes documents an explicit brief exception\n- DLA-WB-04/17: solo-completable — individual grouping; omit facilitator_moves/failure_mode\n- DLA-WB-06: session MUST NOT be table-only — ≥2 type families; *_table activities need ≥1 non-table type\n- DLA-WB-06a (38F-2 mandatory row — V-01): When workbook_contract_applied is true, the session MUST include ≥1 explicit required_materials row whose type is a table/reference family token: classification_table | comparison_table | analysis_table | impact_table | reference_table | data_table | decision_table | planning_table — on a practice-oriented activity (typically second activity), NOT on the capstone alone (DLA-WB-16); specification must describe learner-work columns to complete with judgement/rating cells left for the learner; must coexist with DLA-WB-08 worked_example/sample_output rows and DLA-WB-12 consolidation_summary; do not omit tables because worked/consolidation mandatory rows were added (38E-10 regression guard)\n- DLA-WB-07/10/11: ≥1 text exposition (type text, purpose explanatory teaching); ≥2 activities with practice-oriented material purpose; ≥2 activities with task_cards, prompt_set, and/or checklist\n- DLA-WB-08 (mandatory required_materials row): ≥1 early-session activity (typically first or second) MUST list explicit required_materials with type worked_example AND type sample_output (preferred pair on same or adjacent teach activity); if sample_output omitted, list type modelling_note with think-aloud/decision-criteria specification; each row specification must require stepped expert completion with visible intermediate results before learner parallel task; learner_task must instruct learner to study worked example/sample before practice; capstone integrative template, ranking template, or practice blank worksheet does NOT satisfy DLA-WB-08\n- DLA-WB-12 (mandatory required_materials row): delivery_notes must include consolidation_requirement AND final capstone activity MUST list required_materials type consolidation_summary with specification requiring learner-facing session closure body (≥80 words, ≥3 key ideas summarised — what to remember, not new teaching); optional prompt_set with reflection purpose may supplement but does NOT replace consolidation_summary; capstone template or prompt_set alone does NOT satisfy DLA-WB-12\n- DLA-WB-13/05/16: last integrative capstone expected_output = synthesis artefact (plan, memo) — not reproduce all prior tables; capstone maps ≥3 outcomes when ≥3 exist; capstone must NOT enumerate all prior *_table types as primary deliverables\n- DLA-WB-15: When activity_interaction_type is ranking or learner_task requires compare/rank — specification must require learner-generated ranking and justification; forbid pre-supplied effectiveness or rating scores; expected_output must mention justification\n- DLA-WB-18 (38F-2 mandatory row — V-05 scenario): When learner_task, activity_preamble, required_materials purpose/specification, or expected_output references cases, scenarios, households, personas, dilemmas, or named narratives — same activity_id MUST include distinct required_materials row with type scenario (specification: ≥2 cases with specific names, numbers, or context); task_cards, prompt_set, or activity prose MUST NOT be the sole carrier of case/household narrative bodies; embedding ≥2 household/case narratives only inside task_cards is contract FAIL (38E-10); prefer pairing scenario with analysis_table or comparison_table per DLA-WB-06a\n- DLA-WB-19: non-empty expected_output with observable completion evidence\n- DLA-WB-22 (38J-3 Evaluate): when archetype=Evaluate include criteria, scenario, worked judgement, guided table, independent judgement, checklist, transfer — EV-CAP-01/02/03\n\nConstraints:\n- Activity pattern mix: {{option:activity_pattern_mix}}\n- Grouping preference: {{option:grouping_preference}}\n- Difficulty level: {{option:difficulty_level}}\n- Coverage breadth: {{option:coverage_breadth}}\n\nOutput:\n- Return output as {{preferredOutputFormat}}\n- Return JSON: activities, outcome_alignment, delivery_notes\n- delivery_notes object when workbook applies: resource_intent, session_duration_target_minutes (50–70), consolidation_requirement, workbook_contract_applied\n- When workbook_contract_applied: (1) DLA-WB-08: ≥1 early activity with worked_example + sample_output (or modelling_note); (2) DLA-WB-12: final activity consolidation_summary; (3) DLA-WB-06a: ≥1 practice activity with table/reference type (classification_table, comparison_table, analysis_table, impact_table, reference_table, data_table, decision_table, or planning_table); (4) DLA-WB-18: ≥1 activity with type scenario when session uses household/case/scenario language — rows (1)–(2) and (3)–(4) must all coexist — do not drop worked/consolidation to add table/scenario; (5)–(8) OBLIGATION POPULATION (38S) G1–G5 + DLA-WB-26..31 depth_floor L3 — see gates above; PRE-EMIT GATE: add missing required_materials before emit if (5)–(8) or EMIT-FAIL-01..04 fail (do not replan beats or archetypes)\n- activities[]: activity_id, title, grouping, duration_minutes, mapped_learning_outcomes, required_materials[{ material_id, type, purpose, specification }], learner_task, expected_output, failure_mode, facilitator_moves, activity_preamble (required when self_directed/learner page), optional activity_interaction_type, support_note, cognition-orientation fields (prior_knowledge_activation, reasoning_orientation, self_explanation_prompt, transfer_or_application_task, scaffold_hint_sequence, uncertainty_tension_prompt)\n- required_materials types: task_cards | prompt_set | scenario | checklist | template | sample_output | worked_example | modelling_note | consolidation_summary | transfer_prompt | text | classification_table | comparison_table | analysis_table | impact_table | reference_table | data_table | decision_table | planning_table\n- Return only the JSON.",
  "preferredOutputFormat": "json",
  "defaultPromptNotes": "38S final: DLA is obligation population only — consume upstream episode_plans (archetype + beat order); do not replan beats, archetypes, or session arc. Populate required_materials per OBLIGATION POPULATION (38S) gates before learner_task. Self_directed: activity_preamble every activity; LD-SELF-DIRECTED-RHETORIC at runtime. DLA specifies material types/requirements; GAM authors bodies (LD-MATERIALS-COPY). Table specs: column/row intent (LD-TABLE-FIDELITY). IFP-06 anti-spoiler: scaffold-only specs when learner-production required. Workbook (~60 min, 38F-2): DLA-WB block — mandatory rows DLA-WB-08, DLA-WB-12, DLA-WB-06a, DLA-WB-18 coexist. Maths: LD-MATH-RENDER at runtime. Post-capture validators enforce obligation rows — add missing Materials before emit, do not replan upstream plan.",
  "runnerInstructions": {
    "what_this_step_does": "This step designs runnable learning activities linked directly to outcomes."
  },
  "defaultOutputStructure": {
    "keys": [
      "activities",
      "outcome_alignment",
      "delivery_notes"
    ]
  },
  "userOptions": [
    {
      "id": "activity_pattern_mix",
      "label": "Activity pattern mix",
      "type": "select",
      "default": "balanced",
      "choices": [
        {
          "value": "guided",
          "label": "Guided",
          "promptInstruction": "Prioritize guided, tutor-led activity patterns."
        },
        {
          "value": "balanced",
          "label": "Balanced",
          "promptInstruction": "Use a balanced mix of guided and applied/collaborative patterns."
        },
        {
          "value": "applied_collaborative",
          "label": "Applied collaborative",
          "promptInstruction": "Prioritize applied, collaborative activity patterns."
        }
      ]
    },
    {
      "id": "grouping_preference",
      "label": "Grouping preference",
      "type": "select",
      "default": "mixed",
      "choices": [
        {
          "value": "mixed",
          "label": "Mixed",
          "promptInstruction": "Use a balanced mix of grouping modes across activities."
        },
        {
          "value": "individual",
          "label": "Individual",
          "promptInstruction": "Prioritize individually completed activities."
        },
        {
          "value": "pair",
          "label": "Pair",
          "promptInstruction": "Prioritize pair-based activities."
        },
        {
          "value": "small_group",
          "label": "Small group",
          "promptInstruction": "Prioritize small-group activities."
        },
        {
          "value": "whole_group",
          "label": "Whole group",
          "promptInstruction": "Prioritize whole-group activity formats."
        }
      ]
    },
    {
      "id": "difficulty_level",
      "label": "Difficulty level",
      "type": "select",
      "default": "moderate",
      "choices": [
        {
          "value": "introductory",
          "label": "Introductory",
          "promptInstruction": "Set activity challenge at an introductory level."
        },
        {
          "value": "moderate",
          "label": "Moderate",
          "promptInstruction": "Set activity challenge at a moderate level."
        },
        {
          "value": "advanced",
          "label": "Advanced",
          "promptInstruction": "Set activity challenge at an advanced level."
        }
      ]
    },
    {
      "id": "coverage_breadth",
      "label": "Coverage breadth",
      "type": "select",
      "default": "balanced",
      "choices": [
        {
          "value": "narrow",
          "label": "Narrow (key outcomes only)",
          "promptInstruction": "Focus activity coverage on a narrower set of key outcomes."
        },
        {
          "value": "balanced",
          "label": "Balanced",
          "promptInstruction": "Use balanced coverage across the intended outcomes."
        },
        {
          "value": "broad",
          "label": "Broad coverage",
          "promptInstruction": "Use broad coverage across outcomes where feasible."
        }
      ]
    }
  ]
}
```

---

## 6. Generate Activity Materials

### Type
Generation

### Input
learning_activities, optional knowledge_model, optional normalized_content

### Output
activity_materials, session_materials

### Purpose
- Generate complete, usable teaching materials from activity material specifications
- Ensure each activity has delivery-ready artefacts with no placeholders (runtime: LD-MATERIALS-COPY)
- Primary author of table-shaped `activity_materials` content (runtime: LD-TABLE-FIDELITY)

### Blended / HE Guidance
- Treat `learning_environments` as a multi-select constraint (array semantics)
- Generate environment-appropriate materials:
  - classroom -> slides, handouts, facilitation prompts
  - vle -> structured VLE-ready sections and activity instructions
  - xerte -> structured learning object content
- Regression guards:
  - do not generate `learning_object_set` unless environments include `xerte`
  - do not generate `vle_structure` unless environments include `vle`

### Aliases
- Create Activity Materials
- Build Activity Materials
- Produce Workshop Materials

### Prompt Factory
```json

{
  "configurationMode": "none",
  "askForCustomSchema": false,
  "allowWorkflowGoalContext": false,
  "promptScope": "step_only",
  "structureStyle": "text_structured",
  "defaultPromptStrategy": "default_template",
  "preferredOutputFormat": "text",
  "defaultPromptNotes": "Realise DLA required_materials per GAM-PRES (38J-4 — DLA decides, GAM realises): order/membership GAM-PRES-01/02; types GAM-PRES-03; depth GAM-PRES-08/09 (38L-3); Evaluate trio GAM-PRES-10 + EV-GAM-FAIL-07 (38L-4). Self_directed: LD-TABLE-FIDELITY, LD-MATERIALS-COPY, LD-SELF-DIRECTED-RHETORIC, LD-MATH-RENDER at runtime. Workbook (38F-2/38E-9): GAM-WB-38F-01 pipe tables; GAM-WB-02/06 per PRES-08; GAM-WB-06b (38H-2). FAIL: F1–F9, AP-01/05, DEPTH-COLLAPSE (GAM-PRES-09).",
  "runnerInstructions": {
    "what_this_step_does": "This step realises full delivery-ready material content for each activity requirement."
  },
  "promptTemplate": "Context:\nYou are provided with learning_activities containing required_materials specifications (and optionally knowledge_model, normalized_content, workflow brief, or session context).\n\nRole:\nYou generate delivery-ready materials from activity specifications (learner-facing when delivery_context is self_directed).\n\nTask:\nRealise all required_materials as activity_materials for immediate delivery.\n\nInstructions:\n- Treat learning_activities as the source of truth; do not redesign activities or change structure\n- Anchor on required_materials, learner_task, and expected_output; use grouping, duration_minutes, mapped_learning_outcomes, and facilitator_moves for fit\n- Keep Activity ID and Material labels exact for downstream merge\n\nCanonical contracts (runtime modules; obey all): LD-TABLE-FIDELITY, LD-MATERIALS-COPY, LD-MATH-RENDER, LD-SELF-DIRECTED-RHETORIC when self_directed.\n\n- Produce actual delivery content for each required_material; do not restate the specification only\n- Keep each material aligned to the activity intent and outcome alignment\n- Do not assume a specific output medium (for example, document, slides, or platform export package)\n- For display-oriented learner-facing text, use only this Markdown subset: ##/### headings, - bullet lists, 1. numbered lists, **bold**, simple pipe tables, and --- horizontal rules\n- Do not rely on blank-space alignment for table rendering\n\nInstructional function preservation (GAM-PRES — 38J-4; realisation only — DLA decides, GAM realises; do NOT select archetypes, replan IFP, or redesign pedagogy):\n- GAM-PRES-00: learning_activities + required_materials purpose/specification + learner_task are authoritative; realise what DLA specified — expand bodies, do not second-guess archetype or function plan\n- GAM-PRES-01 FUNCTION ORDER: emit Material blocks in exact DLA required_materials array order within each activity; when specification names instructional functions (criteria exposition, perspective building, worked thinking, worked judgement, guided judgement, independent judgement, verification, transfer), preserve that teaching→practice sequence — never reorder so practice/reflection Materials precede teaching Materials DLA placed earlier; segmented learner_task teaching blocks must appear in earlier Material bodies, performance blocks in later Materials\n- GAM-PRES-02 NO COLLAPSE: one distinct full Material body per DLA required_materials row — never merge rows; forbidden collapse patterns: (a) single prompt_set or consolidation_summary replacing criteria+worked judgement+guided+independent sequence; (b) consolidation_summary absorbing exposition assigned to text, worked_example, modelling_note, scenario, rubric, checklist, transfer_prompt, or independent judgement template; (c) task_cards-only body when DLA listed scenario+table+worked materials; (d) reflection_prompt or thin prompt_set substituting for verification checklist, transfer_prompt, worked analytic pass, or independent judgement template when DLA listed those functions (DEPTH-COLLAPSE-01..04)\n- GAM-PRES-03 FUNCTION REALISATION (map DLA types to learner-facing moves — do not replan): text/modelling_note → explanation, criteria exposition, perspective building, worked judgement contrast; worked_example → example, worked thinking, stepped expert reasoning; misconception_note → misconception challenge; exemplar/comparison_pair → non-example contrast; scenario → case narratives and perspectives; template / partial decision_table|comparison_table|analysis_table → guided practice or guided judgement with learner-empty cells; task_cards|prompt_set with perform verbs → independent practice or independent judgement prompts; checklist|retrieval_check → verification; transfer_prompt → transfer; consolidation_summary → reflection/closure scaffold only (GAM-WB-06b) — realise each with substantive depth, not specification restatement; type labels per GAM-PRES-03 (GAM-WB-11..19 authoritative map — template, sample_output, checklist, rubric, misconception_note, *_table companion, task_cards, prompt_set, reflection_prompt optional)\n- GAM-PRES-04 ANTI-SHELL PRESERVATION: when DLA lists ≥2 teaching-depth materials (worked_example, modelling_note, text exposition, scenario narrative, rubric criteria teaching), realise ALL with full bodies — do not reduce episode to imperative task_cards + thin checklist; AS-GAM-FAIL-01 DLA lists worked_example|modelling_note but GAM emits template-only or prompt-only; AS-GAM-FAIL-02 DLA lists ≥3 distinct material types but GAM merges into ≤2 Materials; AS-GAM-FAIL-03 Evaluate-shaped DLA specs (perspectives+criteria+judgement) realised as consolidation_summary+prompt_set only\n- GAM-PRES-05 ANTI-SPOILER PRESERVATION (extend 38H-2 / GAM-WB-06b): honour DLA specification phrases scaffold-only, not for copying, weak vs strong exemplar; worked_example and modelling_note teach reasoning quality — bodies must NOT match expected_output learner deliverable; sample_output annotated exemplar must not be copy-paste target when DLA spec says independent practice/judgement planned; forbid pre-ranked strategy recommendation or pre-filled judgement cells when DLA expects learner ranking; consolidation_summary scaffold-only when learner-production required — never completed learner memo\n- GAM-PRES-06 EVALUATE PRESERVATION (38I-4 A4 benchmark — when DLA purpose/specification indicates Evaluate functions): realise ALL listed moves — perspectives: scenario or text ≥2 competing viewpoints (≥40 words each when scenario); criteria: rubric|modelling_note|text ≥3 operational dimensions; worked judgement: worked_example OR modelling_note with explicit weak vs strong contrast (weak slogan + stronger criteria-led reasoning, strong must NOT equal expected_output); guided judgement: decision_table|comparison_table|analysis_table with partial learner cells + justification prompts; independent judgement: template|task_cards memo scaffold (structure/sentence starters — not completed memo); verification: checklist ≥4 criteria-linked checkpoints; transfer: transfer_prompt ≥80 words learner-own-context; consolidation_summary scaffold-only — never sole Evaluate vehicle; EV-GAM-FAIL-01..05 mirror EV-SHELL-01..05 at realisation (criteria/perspectives/worked judgement/guided partial missing); EV-GAM-FAIL-06 transfer absent when DLA listed transfer_prompt or transfer function\n- GAM-PRES-07: Read DLA specification depth cues — expand to learner-usable bodies; Evaluate criteria exposition ≥3 dimensions; Evaluate scenario perspectives ≥2; worked judgement teaching ≥120 words combined when both weak and strong required; do not compress teaching to meet duration — realise fully per LD-MATERIALS-COPY; text exposition ≥120 words linking ≥2 ideas outside table cells when DLA lists text\n- GAM-PRES-08 DEPTH-SHAPED BODIES (38L-3 R2/R3 — honour DLA depth_floor L3 and purpose function names; 38K-2 sufficiency): When DLA specification includes depth_floor L3 or purpose names verification|worked analytic pass|independent judgement|transfer|guided judgement — emit function-shaped bodies not specification echo: (V1) verification checklist → ≥4 pass-fail or keyed-check items linked to activity learning + explicit repair-if-fail instruction — NOT a single reflective question or prompt_set substituting for checklist; verification materials should confirm understanding, reasoning quality, interpretation, or judgement quality where appropriate, not merely task completion; (A1) worked analytic pass worked_example|modelling_note → ≥1 fully modelled walkthrough: evidence fact → analytical lens → reasoning steps → draft matrix cell → conclusion (≥120 words); criteria application visible; NOT empty analysis_table or inquiry-only prompt_set replacing modelling; (E1) independent judgement template|task_cards → memo scaffold with labelled sections + sentence starters + word band — learner-empty; NOT completed memo; NOT consolidation_summary substitute; (E2) Evaluate verification checklist → rubric self-audit ≥4 criteria-linked checkpoints; (T1) transfer_prompt → ≥80 words with ≥2 own-context application prompts — NOT transfer only inside consolidation_summary; (G1) guided judgement|analysis table → ≥1 exemplar row with justification OR scoring guide + empty learner rows; L3 spec with restatement-only body = DEPTH-FAIL; GAM-WB-01/02/06 depth floors authoritative here (exposition ≥120w; worked_example|sample_output|modelling_note full bodies; consolidation_summary ≥80 words per GAM-WB-06b when required)\n- GAM-PRES-09 ANTI-DEPTH-COLLAPSE (38L-3 R1/R5/R6): When DLA lists checklist|transfer_prompt|template|worked analytic pass Material — forbidden: DEPTH-COLLAPSE-01 verification → reflection_prompt|open question only; DEPTH-COLLAPSE-02 transfer_prompt → consolidation reflection only; DEPTH-COLLAPSE-03 worked analytic pass → prompt_set without modelled walkthrough; DEPTH-COLLAPSE-04 independent judgement → discussion prompt_set without memo structure; DEPTH-COLLAPSE-05 merging checklist+template+transfer_prompt into consolidation_summary; triggers contract FAIL (F9); workbook FAIL taxonomy (authoritative — F1–F9): (F1) consolidation_summary missing when required; (F2) prompt_set-only closure; (F3) worked_example|sample_output|modelling_note body missing; (F4) template-only worked obligation; (F5) scenario only in task_cards (GAM-WB-10/AP-04); (F6) missing pipe table (GAM-WB-38F-01); (F7) spoiler consolidation (GAM-WB-06b); (F9) DEPTH-COLLAPSE-01..05. MIX: GAM-WB-MIX-01 table-only invalid (AP-01); MIX-03 prompt_set-only capstone closure = FAIL; MIX-04 template-only worked_example FAIL; MIX-05 retrieval needs learner-check; MIX-06 capstone weight limit. AP: AP-01 table-only; AP-02 reference-dump capstone; AP-03 pre-filled ratings; AP-04 scenario without Material body; AP-05 spoiler consolidation\n- GAM-PRES-10 EVALUATE COMPLETION TERMINATION (38L-4 R5): When DLA lists Evaluate closure trio (template|task_cards independent judgement + checklist verification + transfer_prompt) — all three MUST be realised as separate Materials with full GAM-PRES-08 bodies; guided judgement table alone is insufficient for Evaluate activity completion; consolidation_summary must NOT substitute any trio member; EV-GAM-FAIL-07 guided-only Evaluate (guided table present but independent memo scaffold OR verification checklist OR transfer_prompt missing or absorbed) = contract FAIL\n\nUsability requirements:\n- Materials must be complete enough to use without major rewriting\n- Materials must be clearly labelled and easy to read\n- Use learner-facing wording unless the brief is facilitated\n- Do not return plans about materials; return the materials themselves\n- Outputs must not include phrases like \"should include\", \"describe\", or \"specification\". These indicate incomplete material generation.\n- If some details are unspecified, make only the assumptions necessary to produce complete and usable material bodies\n\nSelf-study workbook genre contract (GAM-WB — apply when delivery_context is self_directed AND upstream learning_activities or delivery_notes indicate a self-study workbook, e.g. delivery_notes.workbook_contract_applied, resource_intent self_study_workbook, or multi-activity learner workbook arc). GAM-WB function enforcement (38E-9): realise every DLA worked_example, sample_output, modelling_note, and consolidation_summary row as labelled Material bodies — delivery_notes.consolidation_requirement alone still requires Material: consolidation_summary. Realise DLA required_materials only — do not redesign activities. Obey LD-MATERIALS-COPY and LD-TABLE-FIDELITY — do not weaken them:\n- GAM-WB core: Design Page cannot compose workbook genres GAM never authored — if a genre is absent from your Material: output, downstream cannot invent it\n- GAM-WB-00: Realise 100% of DLA required_materials entries with substantive Content bodies — never restate type/purpose/specification only; forbidden placeholder labels (AP-11 pattern)\n- Table-only workbook is contractually invalid (AP-01 / GAM-WB-MIX-01): session MUST include ≥1 non-table Material type (scenario, text, task_cards, prompt_set, checklist, template, sample_output, worked_example, consolidation_summary, transfer_prompt, rubric, etc.)\n- GAM-WB-02 (38E-9 mandatory): worked_example|sample_output|modelling_note per GAM-PRES-08 — full Content for each; missing body = contract FAIL (F3/F4)\n- GAM-WB-06 (38E-9 mandatory + 38H-2): consolidation_summary per GAM-PRES-08; consolidation_summary ≥80 words; capstone prompt_set alone does NOT satisfy; missing when required = contract FAIL (F1)\n- GAM-WB-06b (38H-2, learner-production required): consolidation_summary = reflective scaffolding only — sentence starters, criteria comparison, self-check prompts; FORBID model essays, past-tense summaries (e.g. \"you have learned\"), completed learner responses; ≥80 words; violating scaffold-only = contract FAIL (F7)\n- GAM-WB-38F-01 (38F-2 — V-01 table realisation): when DLA required_materials lists any *_table, reference_table, data_table, decision_table, or planning_table — emit Material: <material_id> (<exact DLA type>) with LD-TABLE-FIDELITY pipe-table Content supporting learner_task; learner rank/rate/judgement cells empty where learner decides (AP-03); table is companion/support material, not the whole workbook; must coexist in session with Material bodies for worked_example, sample_output, and consolidation_summary when DLA listed them — missing pipe table when DLA listed table type = contract FAIL\n- GAM-WB-10 / AP-04 (38F-2 — V-05 scenario): when DLA lists type scenario OR learner_task/preamble uses case/scenario/household/persona language — MUST emit Material: <material_id> (scenario) with ≥2 named cases (≥40 words each); task_cards may reference scenario for imperative steps but MUST NOT replace scenario Material — embedding ≥2 household/case narratives only inside task_cards when DLA listed scenario or WB-18 applies = V-05 FAIL (F5)\n- Workbook contract FAIL: see GAM-PRES-09 fail taxonomy (F1–F9, MIX, AP-01..05)\n\nScope boundaries:\n- Generate activity materials (and session-level materials only when clearly required by the brief/context)\n- Do not perform final platform/export packaging in this step\n\nOutput organisation:\n- Organise content with clear sections using this exact structure for every generated material:\n\nActivity: <activity title>\nActivity ID: <activity_id>\nMapped outcomes: <comma-separated outcomes>\n\nMaterial: <material_id> (<type>)\nPurpose: <instructional purpose>\nContent:\n<full usable material content>\n\nMaterial type labelling (38E-9): use exact DLA types in the Material line — e.g. Material: M2 (worked_example), Material: M3 (sample_output), Material: M4 (modelling_note), Material: M10 (consolidation_summary) — do not relabel consolidation_summary as prompt_set or worked genres as template\n\nWhen delivery_context is self_directed: omit Facilitator use (LD-SELF-DIRECTED-RHETORIC). When facilitated: after Content add Facilitator use: <facilitation note>\n\n---\n\n- Repeat for all required materials across activities\n- Keep IDs and schema field names as structured labels (for example Activity ID, Material) rather than replacing them with freeform Markdown\n- Return only the final organised materials content."
}
```

---

## 7. Design Assessment

### Type
Generation

### Input
learning_outcomes, knowledge_model, or learning_content

### Output
assessment_blueprint

### Purpose
- Define how learning will be assessed
- Ensure valid evidence of learning

### Aliases
- Design Assessment Blueprint
- Generate Assessment
- Create Assessment Plan
- Generate multiple-choice questions
- Generate MCQs
- Generate quiz questions

### Prompt Factory
```json
{
  "configurationMode": "simple",
  "askForCustomSchema": false,
  "allowWorkflowGoalContext": false,
  "promptScope": "step_only",
  "structureStyle": "schema_structured",
  "defaultPromptStrategy": "default_template",
  "promptTemplate": "Context:\nYou are provided with learning_outcomes and optional supporting artefacts such as knowledge_model or learning_content.\n\nTask:\nDesign an assessment_blueprint that defines how the outcomes will be assessed.\n\nInstructions:\n- Align the blueprint to all provided learning outcomes\n- Question strategy: {{option:activity_type}}\n- Feedback display mode: {{option:feedback_display}}\n- Difficulty profile: {{option:difficulty_profile}}\n- Coverage scope: {{option:coverage_scope}}\n- Total required items/questions: {{option:total_items}}\n- Treat feedback_display as prompt-shaping guidance only; do not require or invent new output schema fields in this step\n- Design should reflect the selected question strategy\n- Define coverage_map so outcomes are covered appropriately across topics/tasks\n- Ensure coverage_map item counts sum exactly to total_items\n- Define difficulty_profile.item_counts with concrete numeric counts using ONLY these keys: recall, comprehension, application, analysis\n- Do NOT use alternative difficulty buckets such as easy/moderate/hard in item_counts\n- Ensure recall + comprehension + application + analysis counts sum exactly to total_items\n- Include marking intent/rationale suitable for downstream item generation and feedback steps\n- Keep output grounded in provided artefacts only\n- Do not generate assessment items in this step\n- Apply step notes if provided: {{stepNotes}}\n\nOutput requirements:\n- Return output as {{preferredOutputFormat}}\n- Return a JSON object containing: assessment_blueprint, coverage_map, difficulty_profile, design_rationale\n- assessment_blueprint must include total_items\n- difficulty_profile must include item_counts as concrete numbers with keys recall, comprehension, application, analysis\n- Return only JSON.",
  "preferredOutputFormat": "json",
  "defaultPromptNotes": "Design assessment artefacts aligned to learning outcomes with valid coverage and clear marking intent.",
  "defaultOutputStructure": {
    "keys": [
      "assessment_blueprint",
      "coverage_map",
      "difficulty_profile",
      "design_rationale"
    ]
  },
  "userOptions": [
    {
      "id": "activity_type",
      "label": "Question strategy",
      "type": "select",
      "default": "mcq",
      "choices": [
        {
          "value": "mcq",
          "label": "Selected response",
          "promptInstruction": "Design the blueprint for selected-response assessment items."
        },
        {
          "value": "short_answer",
          "label": "Short written response",
          "promptInstruction": "Design the blueprint for short written-response assessment items."
        },
        {
          "value": "essay",
          "label": "Extended response",
          "promptInstruction": "Design the blueprint for extended written-response assessment items."
        },
        {
          "value": "problem",
          "label": "Problem-solving response",
          "promptInstruction": "Design the blueprint for problem-solving response assessment items."
        },
        {
          "value": "case_study",
          "label": "Scenario-based response",
          "promptInstruction": "Design the blueprint for scenario-based response assessment items."
        },
        {
          "value": "mixed",
          "label": "Mixed response types",
          "promptInstruction": "Design the blueprint for a mixed response-type assessment set."
        }
      ]
    },
    {
      "id": "feedback_display",
      "label": "Feedback display",
      "type": "select",
      "default": "answer_grid_end",
      "choices": [
        {
          "value": "none",
          "label": "None",
          "promptInstruction": "Do not plan learner-facing feedback/answer display beyond core assessment prompts."
        },
        {
          "value": "answer_grid_end",
          "label": "Answer grid at end",
          "promptInstruction": "Plan for answers to be presented as an answer grid at the end."
        },
        {
          "value": "answers_explanations",
          "label": "Answers + explanations",
          "promptInstruction": "Plan for answers to be presented with concise explanations."
        },
        {
          "value": "reflection_then_answers",
          "label": "Reflection first, answers after",
          "promptInstruction": "Plan for a reflection-first flow, with answers shown after reflection."
        }
      ]
    },
    {
      "id": "difficulty_profile",
      "label": "Difficulty profile",
      "type": "select",
      "default": "balanced",
      "choices": [
        {
          "value": "foundation_heavy",
          "label": "Mostly foundational items",
          "promptInstruction": "Set overall assessment difficulty toward foundational items."
        },
        {
          "value": "balanced",
          "label": "Balanced mix",
          "promptInstruction": "Set overall assessment difficulty to a balanced mix."
        },
        {
          "value": "higher_order_heavy",
          "label": "Mostly higher-order items",
          "promptInstruction": "Set overall assessment difficulty toward higher-order items."
        }
      ]
    },
    {
      "id": "coverage_scope",
      "label": "Coverage scope",
      "type": "select",
      "default": "balanced",
      "choices": [
        {
          "value": "selected_themes",
          "label": "Selected themes",
          "promptInstruction": "Focus assessment blueprint coverage on selected high-priority themes."
        },
        {
          "value": "balanced",
          "label": "Balanced",
          "promptInstruction": "Use balanced topic coverage in the assessment blueprint."
        },
        {
          "value": "broad_coverage",
          "label": "Broad coverage",
          "promptInstruction": "Use broad topic coverage across outcomes where feasible."
        }
      ]
    },
    {
      "id": "total_items",
      "label": "Total assessment items",
      "type": "number",
      "default": 10,
      "promptInstructionTemplate": "Set total assessment items to exactly {{value}}."
    }
  ]
}
```

---

## 8. Design Feedback

### Type
Generation

### Input
assessment_items (optionally with knowledge_model)

### Output
feedback_pack

### Purpose
- Provide explanations and guidance
- Address misconceptions
- Support improvement

### Aliases
- Generate Feedback
- Create Feedback Pack
- Build Feedback
- Generate feedback pack for MCQs
- Generate feedback pack

### Prompt Factory
```json
{
  "configurationMode": "none",
  "askForCustomSchema": false,
  "defaultPromptStrategy": "default_template",
  "inputPriority": {
    "primary": "assessment_items",
    "secondary": "knowledge_model"
  },
  "inputArtefactSchemas": [
    {
      "type": "assessment_items",
      "artefact": "assessment_items",
      "schema": {
        "items": [
          {
            "item_id": "string",
            "item_type": "string",
            "topic": "string",
            "related_learning_outcomes": "array",
            "stem_or_prompt": "string",
            "response_structure": "object",
            "answer_or_guidance": "string",
            "explanation_or_rationale": "string",
            "integration_type": "string"
          }
        ],
        "difficulty_distribution": "object",
        "answer_key": "object",
        "explanations": "object"
      }
    },
    {
      "type": "assessment_items",
      "artefact": "mcqs",
      "schema": {
        "items": [
          {
            "item_id": "string",
            "item_type": "string",
            "topic": "string",
            "related_learning_outcomes": "array",
            "stem_or_prompt": "string",
            "response_structure": "object",
            "answer_or_guidance": "string",
            "explanation_or_rationale": "string",
            "integration_type": "string"
          }
        ],
        "difficulty_distribution": "object",
        "answer_key": "object",
        "explanations": "object"
      }
    }
  ],
  "promptTemplate": "Context:\nYou are provided with assessment_items and a knowledge_model.\n\nTask:\nGenerate a feedback_pack that gives useful learning feedback aligned to the assessment content.\n\nInstructions:\n- Use assessment_items as the primary input to produce per-item and aggregate feedback\n- Use the item structure as provided by the assessment type (mcq, essay, short_answer, problem, case_study, or mixed)\n- Do not assume MCQ-only fields when items are not MCQs\n- Use knowledge_model as a secondary reference for conceptual accuracy and misconception diagnosis\n- Assume each input item includes core fields such as item_id, topic, related_learning_outcomes, and explanation_or_rationale, plus type-specific fields\n- For each item, provide concise correctness rationale and actionable guidance\n- Where relevant, explain likely misconceptions and how to correct them\n- Keep feedback clear, supportive, and instructionally useful\n- Do not ask for or redefine input structure; use provided artefact schemas\n- Assessment semantics (when present in workflow constraints, scope/constraints text, or step notes): honour feedback_timing, assessment_interaction_mode, learner_answer_visibility, tutor_answer_artefact, peer_instruction_phase, and misconception_assessment_link when provided\n- Treat assessment_items answer_key, correct_answer, true_false_answer, and explanation_or_rationale as authoritative; do not remove or contradict answer data from upstream items\n- When feedback_timing is after_peer_discussion, end_of_session_reveal, or tutor_led_reveal_only, produce facilitator/tutor reveal guidance: when to share answers, how to debrief after discussion or at session end, and what to withhold on learner-facing handouts until reveal\n- When feedback_timing = tutor_led_reveal_only, emphasise tutor-led debrief moves and post-submission correction; do not assume learners have already seen correct answers inline\n- When learner_answer_visibility is hidden_until_reveal or tutor_only, structure feedback_pack for delayed reveal (attempt/discussion/check first, answers and rationales for tutor use later)\n- When assessment_interaction_mode = discussion_oriented, include sense-making and discussion prompts in misconception_guidance and next_steps before answer confirmation\n- When assessment_interaction_mode = diagnostic_misconception or misconception_assessment_link = true, tie misconception_guidance to specific false claims, proposition wording, or activity/task-card themes reflected in assessment_items\n- When peer_instruction_phase is set (e.g. think_pair_share, small_group_discussion_then_check), next_steps should follow individual attempt -> pair/small-group discussion -> reveal/confirm sequence\n- Apply step notes when provided: {{stepNotes}}\n\nOutput:\n- Return output as {{preferredOutputFormat}}\n- Return a JSON object containing feedback_items, misconception_guidance, and next_steps\n- Return only the JSON.",
  "preferredOutputFormat": "json",
  "defaultPromptNotes": "Generate actionable feedback/guidance aligned with assessment outputs; when feedback_timing is delayed or tutor-led, include facilitator reveal/debrief guidance while preserving upstream answer data. For mathematical notation in feedback text, use only \\(...\\) inline and \\[...\\] block delimiters; never $...$/$$...$$, code wrappers, or HTML-escaped delimiters.",
  "defaultOutputStructure": {
    "keys": ["feedback_items", "misconception_guidance", "next_steps"]
  }
}
```

---

## 9. Generate Assessment Items

### Type
Generation

### Input
learning design artefacts which may include learning_outcomes, knowledge_model, and optionally assessment_blueprint

### Output
assessment_items

### Purpose
- Generate concrete assessment/activity items from available learning design artefacts
- Support standalone generation from learning_outcomes with optional blueprint-guided refinement

### Aliases
- Generate Activity Items
- Generate Assessment Questions
- Generate Quiz Items
- Create MCQ Items
- Generate Multiple Choice Questions

### Prompt Factory
```json
{
  "configurationMode": "simple",
  "askForCustomSchema": false,
  "allowWorkflowGoalContext": false,
  "promptScope": "step_only",
  "structureStyle": "schema_structured",
  "defaultPromptStrategy": "default_template",
  "inputPriority": {
    "primary": "learning_outcomes",
    "secondary": "knowledge_model",
    "tertiary": "assessment_blueprint"
  },
  "promptTemplate": "Context:\nYou are provided with learning design artefacts which may include learning_outcomes, a knowledge_model, and optionally an assessment_blueprint.\n\nTask:\nGenerate assessment_items that are instructionally useful and aligned to the available artefacts.\n\nInstructions:\n- Treat learning_outcomes as the default foundation for item generation\n- If assessment_blueprint is present, use it as an advanced design contract for item count, assessment structure, coverage distribution, and difficulty distribution\n- If assessment_blueprint is not present, derive a sensible assessment structure from learning_outcomes\n- When deriving structure without a blueprint, ensure topic coverage, cognitive balance, and item variety are coherent and reusable\n- Use knowledge_model (if present) to improve conceptual fidelity, strengthen distractors, and surface misconception-aware choices where appropriate\n- Keep all items grounded in provided artefacts\n- Do not invent unsupported domain facts\n- Generate some integrative items that connect multiple outcomes when appropriate\n- Include integration_type per item with value \"single\" or \"multi_outcome\"\n- Include difficulty_level per item with one of: \"recall\", \"comprehension\", \"application\", \"analysis\"\n- Respect configured response formats, composition mode, stimulus mode, and feedback mode\n- If multiple response formats are configured, generate a mix from only the configured formats and include item_type per item\n- IMPORTANT: if assessment_type is mcq (explicitly requested or present in workflow constraints), use single_answer_mcq only\n- For assessment_type = mcq, enforce one-correct-answer MCQ structure only: item_type must be single_answer_mcq, exactly 4 options by default (A-D), one correct_answer, and no true_false/multiple_answer_mcq/short_answer/essay items unless explicitly requested\n- For single_answer_mcq items, include a clear stem, plausible distractors, and one best answer\n- For multiple_answer_mcq items, include a clear stem, select-all-that-apply style instructions, plausible distractors, and all correct answers\n- For true_false items, include a clear proposition, true_false_answer, and concise explanation_or_rationale\n- For short_answer items, include prompt and model_answer_guidance\n- For essay items, include prompt, expected_focus, indicative_points, and marking_guidance\n- If stimulus mode is direct_questions, generate direct items from outcomes/knowledge/blueprint\n- If stimulus mode is scenario_based, problem_based, or case_based, generate realistic source-grounded stimuli and ensure items are anchored to those stimuli\n- Align stimulus complexity to learner level and cognitive emphasis\n- If scenario scope is shared_scenario_for_set, one shared stimulus may support multiple items\n- If scenario scope is scenario_per_item, provide an individual stimulus per relevant item\n- For per-item feedback modes, provide learner-facing feedback for objective/short-response items where applicable\n- For essay items, prioritize marking_guidance and indicative_points rather than simplistic correct/incorrect feedback\n- Assessment semantics (when present in workflow constraints, scope/constraints text, or step notes): honour feedback_timing, assessment_interaction_mode, learner_answer_visibility, tutor_answer_artefact, peer_instruction_phase, and misconception_assessment_link when provided\n- ALWAYS populate answer-bearing fields (correct_answer, correct_answers, true_false_answer, answer_key, explanations, explanation_or_rationale) for tutor/marking/self-check use even when learner_answer_visibility is hidden_until_reveal or feedback_timing is tutor_led_reveal_only; omitting answer keys is not how learner visibility is enforced (downstream composition/render handles learner export)\n- Unless tutor_answer_artefact explicitly indicates omit, include a complete answer_key and per-item answer fields in the JSON output\n- If assessment_interaction_mode = diagnostic_misconception, prioritise true_false and proposition-style items that test specific misconception claims; each stem must target a named false claim or misconception theme from learning_activities or activity_materials when available\n- If misconception_assessment_link = true, explicitly tie each item to a misconception theme, task-card claim, or activity material referenced upstream (cite the claim or material in stem or topic)\n- If assessment_interaction_mode = discussion_oriented, write stems that support discussion-first pedagogy (interpret evidence, compare ideas, justify reasoning) rather than isolated fact recall\n- If feedback_timing = after_peer_discussion or peer_instruction_phase is set (e.g. think_pair_share, small_group_discussion_then_check), frame the set for individual attempt first, then pair/small-group discussion, then confirm/revise; avoid stems that assume immediate answer reveal\n- If feedback_timing = tutor_led_reveal_only, author items for tutor debrief after learner submission; include tutor-usable explanation_or_rationale but do not embed give-away answers in stems or option text\n- If learner_answer_visibility is hidden_until_reveal or tutor_only, still include answer keys and rationales in JSON; do not add inline model-answer reveals in learner-facing stem wording\n- If feedback_timing = immediate_self_check, concise explanation_or_rationale may support immediate learner feedback where feedback_mode permits\n- Apply step notes when provided: {{stepNotes}}\n\nOutput:\n- Return output as {{preferredOutputFormat}}\n- Return a JSON object containing:\n  - items: assessment items with item_id, item_type, topic, related_learning_outcomes, integration_type, difficulty_level, explanation_or_rationale, and type-specific fields\n  - single_answer_mcq items must include stem, options, and correct_answer\n  - for single_answer_mcq, include correct_answer_text when available\n  - multiple_answer_mcq items must include stem, options, and correct_answers\n  - true_false items must include proposition and true_false_answer\n  - short_answer items must include prompt and model_answer_guidance\n  - essay items must include prompt, expected_focus, indicative_points, and marking_guidance\n  - scenario/problem/case-based items must include stimulus_type and stimulus_text (or shared_stimulus_ref when reused)\n  - difficulty_distribution\n  - answer_key (for MCQ items include item_id, correct_answer, and optionally correct_answer_text)\n  - explanations\n- Return only the JSON.",
  "preferredOutputFormat": "json",
  "defaultPromptNotes": "Generate assessment items from learning outcomes by default; honour workflow assessment semantics (timing, interaction mode, visibility) and always emit answer_key/answer fields for tutor use unless tutor_answer_artefact explicitly omits them. For self-directed learner pages, write stems that require a decision, justification, or interpretation (not label-only recall); use numbered sub-questions in the stem when multiple reasoning steps are needed; explanation_or_rationale should name the likely error pattern and link back to concept/procedure in one concise sentence — not a full worked solution; include at least one stem that asks why a method or interpretation is appropriate, not only the final answer; include judgement-oriented sub-questions (compare interpretations, statistical vs practical significance, stronger evidence) where the brief supports closure. When mathematical notation is needed in stems/options/explanations/model guidance, use only \\(...\\) inline and \\[...\\] block delimiters; never $...$/$$...$$, code wrappers, or HTML-escaped delimiters.",
  "defaultOutputStructure": {
    "keys": ["items", "difficulty_distribution", "answer_key", "explanations", "integration_summary"]
  },
  "userOptions": [
    {
      "id": "number_of_items",
      "label": "Number of items",
      "type": "number",
      "default": 10,
      "min": 1,
      "max": 200,
      "promptInstructionTemplate": "Generate exactly {{value}} assessment items."
    },
    {
      "id": "response_formats",
      "label": "Allowed response formats",
      "type": "select",
      "default": "single_answer_mcq",
      "choices": [
        { "value": "single_answer_mcq", "label": "Single-answer MCQ", "promptInstruction": "Allow single-answer MCQ items only." },
        { "value": "multiple_answer_mcq", "label": "Multiple-answer MCQ", "promptInstruction": "Allow multiple-answer MCQ items only; include select-all-that-apply style prompts where appropriate." },
        { "value": "true_false", "label": "True/false", "promptInstruction": "Allow true/false items only." },
        { "value": "short_answer", "label": "Short answer", "promptInstruction": "Allow short-answer items only." },
        { "value": "essay", "label": "Essay", "promptInstruction": "Allow essay items only, requiring extended written responses with clear assessable focus." },
        { "value": "single_mcq_and_true_false", "label": "Single-answer MCQ + true/false", "promptInstruction": "Allow a mix of single-answer MCQ and true/false items only." },
        { "value": "objective_mix_all", "label": "Objective mix (single MCQ + multiple MCQ + true/false)", "promptInstruction": "Allow a mix of objective formats: single-answer MCQ, multiple-answer MCQ, and true/false." },
        { "value": "constructed_mix", "label": "Constructed mix (short answer + essay)", "promptInstruction": "Allow a mix of constructed-response formats: short answer and essay." },
        { "value": "all_formats_mix", "label": "All supported formats", "promptInstruction": "Allow a mixed set across all supported formats: single-answer MCQ, multiple-answer MCQ, true/false, short answer, and essay." }
      ]
    },
    {
      "id": "composition_mode",
      "label": "Composition mode",
      "type": "select",
      "default": "single_format",
      "choices": [
        { "value": "single_format", "label": "Single format", "promptInstruction": "Use a single response format across the item set unless format configuration explicitly permits a multi-format combination." },
        { "value": "mixed_set", "label": "Mixed set", "promptInstruction": "Generate a mixed-format item set consistent with the configured allowed response formats." }
      ]
    },
    {
      "id": "stimulus_mode",
      "label": "Stimulus mode",
      "type": "select",
      "default": "direct_questions",
      "choices": [
        { "value": "direct_questions", "label": "Direct questions", "promptInstruction": "Generate direct questions without requiring additional scenario/case stimuli." },
        { "value": "scenario_based", "label": "Scenario based", "promptInstruction": "Generate scenario-based items anchored to realistic contextual stimuli." },
        { "value": "problem_based", "label": "Problem based", "promptInstruction": "Generate problem-based items anchored to realistic problem contexts." },
        { "value": "case_based", "label": "Case based", "promptInstruction": "Generate case-based items anchored to realistic case contexts." }
      ]
    },
    {
      "id": "scenario_scope",
      "label": "Stimulus scope",
      "type": "select",
      "default": "shared_scenario_for_set",
      "choices": [
        { "value": "shared_scenario_for_set", "label": "Shared stimulus for set", "promptInstruction": "When using scenario/problem/case-based mode, allow one shared stimulus to support multiple items." },
        { "value": "scenario_per_item", "label": "Stimulus per item", "promptInstruction": "When using scenario/problem/case-based mode, provide a separate stimulus for each relevant item." }
      ]
    },
    {
      "id": "cognitive_emphasis",
      "label": "Cognitive emphasis",
      "type": "select",
      "default": "mixed",
      "choices": [
        { "value": "mixed", "label": "Mixed", "promptInstruction": "Use a mixed cognitive emphasis across items." },
        { "value": "foundational", "label": "Foundational understanding", "promptInstruction": "Emphasize foundational recall and comprehension." },
        { "value": "application", "label": "Application and transfer", "promptInstruction": "Emphasize application and transfer in item design." },
        { "value": "analysis", "label": "Analysis and evaluation", "promptInstruction": "Emphasize analysis and evaluation in item design." }
      ]
    },
    {
      "id": "difficulty_profile",
      "label": "Difficulty profile",
      "type": "select",
      "default": "balanced",
      "choices": [
        { "value": "foundational", "label": "Foundational-heavy", "promptInstruction": "Use a foundational-heavy difficulty profile." },
        { "value": "balanced", "label": "Balanced", "promptInstruction": "Use a balanced difficulty profile across the item set." },
        { "value": "higher_order", "label": "Higher-order-heavy", "promptInstruction": "Use a higher-order-heavy difficulty profile." }
      ]
    },
    {
      "id": "feedback_mode",
      "label": "Feedback mode",
      "type": "select",
      "default": "per_item",
      "choices": [
        { "value": "none", "label": "None", "promptInstruction": "Do not include learner-facing feedback beyond essential answer_key and explanation fields." },
        { "value": "per_item", "label": "Per item", "promptInstruction": "Include concise learner-facing feedback for each item." },
        { "value": "aggregate", "label": "Aggregate", "promptInstruction": "Include an aggregate feedback summary across the item set." },
        { "value": "both", "label": "Per item + aggregate", "promptInstruction": "Include both per-item learner feedback and an aggregate feedback summary." }
      ]
    },
    {
      "id": "coverage_mode",
      "label": "Coverage mode",
      "type": "select",
      "default": "balanced",
      "choices": [
        { "value": "selected_themes", "label": "Selected themes", "promptInstruction": "Focus items on selected high-priority themes." },
        { "value": "balanced", "label": "Balanced", "promptInstruction": "Use balanced coverage across available learning outcomes." },
        { "value": "broad_coverage", "label": "Broad coverage", "promptInstruction": "Use broad coverage across as many relevant outcomes/themes as feasible." }
      ]
    },
    {
      "id": "question_style_mix",
      "label": "Response mode mix",
      "type": "select",
      "default": "mixed_response_modes",
      "choices": [
        { "value": "selected_response_only", "label": "Selected response only", "promptInstruction": "Generate items using selected-response formats only." },
        { "value": "constructed_response_only", "label": "Constructed response only", "promptInstruction": "Generate items using constructed-response formats only." },
        { "value": "mixed_response_modes", "label": "Mixed selected + constructed", "promptInstruction": "Generate a deliberate mix of selected- and constructed-response items." },
        { "value": "integrative_performance_oriented", "label": "Integrative/performance-style", "promptInstruction": "Favour integrative or performance-style response tasks where appropriate." }
      ]
    }
  ]
}
```

---

## 10. Construct Learning Sequence

### Type
Synthesis

### Input
learning_activities, activity_materials, assessments

### Output
learning_sequence

### Purpose
- Organise content and activities
- Create a coherent learning journey
- Manage progression and scaffolding

### Blended / HE Guidance
- If scope indicates module/course/programme context, produce multi-week planning outputs (`module_map`)
- Otherwise default to a standard session timeline
- Avoid module artefacts for default session workflows unless explicitly triggered

### Aliases
- Build Learning Sequence
- Sequence Learning Activities
- Organize Learning Flow

### Prompt Factory
```json
{
  "configurationMode": "simple",
  "askForCustomSchema": false,
  "structureStyle": "schema_structured",
  "defaultPromptStrategy": "default_template",
  "preferredOutputFormat": "json",
  "defaultPromptNotes": "Return exactly one \u0060\u0060\u0060json fenced block containing the learning_sequence object. No prose before or after the block. When delivery_context is self_directed, frame timeline as independent learner progression rather than live facilitation choreography.",
  "runnerInstructions": {
    "what_this_step_does": "This step builds an ordered learning progression from activities and materials; in self-directed workflows it represents learner study flow rather than live facilitation."
  },
  "promptTemplate": "Context:\nYou are provided with learning_activities, activity_materials, and relevant assessment artefacts.\n\nTask:\nConstruct learning_sequence as a timed facilitation plan that can be delivered directly.\n\nInstructions:\n- Build a concrete session plan, not pedagogical commentary\n- Enforce total duration compliance with configured duration\n- You may only reference activities provided in input learning_activities\n- Do not invent new activities\n- Do not rename activities\n- Do not extend the activity set\n- Only include an activity if there is enough time to run it properly\n- Do not include activities just to tick a coverage box\n- Prefer fewer well-run activities over squeezing all activities into insufficient time\n- If time is too short, omit an activity or merge it with another activity\n- If provided activities are insufficient, reuse, combine, or reschedule existing activities\n- You may only reference materials explicitly defined in activity_materials\n\nMaterial usage rules:\n- When referring to materials, always use the exact material_id and material title as defined in the input artefact (for example: \"Material A1.1 - Concept Map Template\")\n- Do not paraphrase or generalise material names (for example, avoid \"the worksheet\", \"the template\", \"the handout\" unless that is the exact title)\n- All materials referenced must correspond exactly to those defined in the input artefact; do not introduce new materials or rename existing ones\n- When instructing facilitators to distribute or use materials, explicitly reference them using their identifiers\n- Where helpful, include a \"Materials used:\" line at the start of each activity block listing referenced material_id + title pairs\n\n- All materials referenced in facilitator actions must correspond exactly to required_materials defined in learning_activities\n- Do not invent new materials or rename existing ones; use the exact identifiers from activity definitions\n- When referring to materials, always include both material_id and material title (for example: \"Material A1.1 - Concept Map Template\")\n- Do not use vague references such as \"the template\" or \"the worksheet\"\n- Do not introduce new handouts, excerpts, scenarios, slides, checklists, templates, or examples unless already present in activity_materials\n- If design_scope is single_activity, do not generate a broad multi-step session timeline\n- For single_activity scope, produce a minimal one-step structure around the target activity, or state via checks/omissions that no broader sequence is required\n- For single_activity scope, avoid session/module framing unless explicitly requested\n- Include facilitator_actions and learner_actions for each timeline block\n- Include grouping and explicit transition_to_next for each block\n- Use sensible alternation between explanation, activity, and discussion\n- Ensure increasing complexity across the session\n- Include at least two plenary/synthesis moments where appropriate to session length\n- For cognitively demanding tasks (creation, evaluation, iteration, comparison), allocate sufficient time\n- Avoid placing high-complexity tasks into very short final blocks\n- If total time is constrained, reduce, merge, or simplify activities rather than compressing them unrealistically\n- Do not create zero-minute blocks\n- Do not create bookkeeping-only wrap-up steps\n- Closure must have real allocated time, or be explicitly integrated into the final meaningful block\n- Prefer one fewer activity plus a real ending over superficial full coverage\n- If closure is integrated into the final activity, state closure integration explicitly in checks\n- Optimize for learnability and depth, not just coverage\n- Keep sequence grounded in upstream artefacts and constraints\n- Do not output rationale-only prose\n- Apply step notes when provided: {{stepNotes}}\n\nOutput requirements (strict — fenced JSON block only):\n- Return exactly one markdown fenced JSON block opened with \u0060\u0060\u0060json and closed with \u0060\u0060\u0060\n- The fenced block body must be the learning_sequence root object as valid JSON\n- Do NOT include any prose, headings, commentary, or explanations before or after the fenced block\n- Do NOT return raw JSON without the \u0060\u0060\u0060json fence (unfenced JSON text is invalid)\n- Do NOT include JSON comments (no // or block comments)\n- Do NOT prefix or suffix workflow metadata (no STEP N OUTPUT lines)\n- The JSON object MUST include these top-level keys: sequence_title, total_duration_minutes, timeline, activities_used, activities_omitted, checks\n- Each timeline block must include: block_id, start_minute, duration_minutes, phase_type, activity_id (where relevant), grouping, facilitator_actions, learner_actions, transition_to_next\n- activities_used must list activity_ids used in timeline\n- activities_omitted must be an array of objects: { activity_id, reason }\n- checks must include: all_activity_ids_valid, no_new_activities_introduced, all_materials_traceable_to_activity_materials, cognitive_timing_feasible, closure_integrated, no_zero_minute_blocks, omissions_justified\n- Return only the single fenced block.",
  "defaultOutputStructure": {
    "keys": ["sequence_title", "total_duration_minutes", "timeline", "activities_used", "activities_omitted", "checks"]
  },
  "userOptions": [
    {
      "id": "duration_minutes",
      "label": "Total duration (minutes)",
      "type": "number",
      "default": 60,
      "min": 15,
      "max": 240,
      "promptInstructionTemplate": "Build the sequence to fit exactly {{value}} minutes total duration."
    },
    {
      "id": "sequencing_style",
      "label": "Sequencing style",
      "type": "select",
      "default": "progressive_scaffold",
      "choices": [
        { "value": "progressive_scaffold", "label": "Progressive scaffold", "promptInstruction": "Use a progressive scaffold sequencing style." },
        { "value": "spiral_revisit", "label": "Spiral revisit", "promptInstruction": "Use a spiral revisit sequencing style." },
        { "value": "assessment_anchored", "label": "Assessment anchored", "promptInstruction": "Use an assessment-anchored sequencing style." }
      ]
    }
  ]
}
```

---

## 11. Design Episode Plan

### Type
Deterministic derive

### Input
learning_outcomes

### Output
episode_plans

### Purpose
- Derive frozen Episode Plan V1 (archetype + ordered instructional-function beats) from learning outcomes
- Persist authoritative beat order for downstream DLA population — do not replan in DLA

### Aliases
- Design Instructional Episode Plan
- Instructional Episode Plan

### Prompt Factory
```json
{
  "configurationMode": "none",
  "askForCustomSchema": false,
  "defaultPromptStrategy": "default_template",
  "executionMode": "deterministic_derive",
  "structureStyle": "schema_structured",
  "canonical_step_id": "step_design_episode_plan",
  "promptTemplate": "Deterministic step (38S V1): PRISM derives episode_plans from upstream learning_outcomes in Run mode. Do NOT invent episode plans with an LLM.\n\nArchetypes (frozen): understand | apply | analyse | evaluate only.\nBeat functions: approved FunctionEnum (explanation, worked_thinking, guided_practice, verification, transfer, etc.).\n\nNon-V1 taxonomy is rejected and replaced with deriveEpisodePlansFromLearningOutcomes().\n\nOutput requirements:\n- Return ONLY one markdown fenced JSON block (triple-backtick json fence) — no prose, headings, or commentary before or after the fence.\n- Pretty-print JSON with 2-space indentation and line breaks (never minified single-line JSON).\n- Top-level key: episode_plans (array).\n- Each entry: activity_id, episode_plan { archetype, beats[] { function } }.\n- Emit complete valid JSON only — do not truncate mid-object.",
  "preferredOutputFormat": "json",
  "defaultPromptNotes": "Deterministic derive only — Run mode auto-fills canonical episode_plans from learning_outcomes. Archetypes: understand|apply|analyse|evaluate. Do not replan beats in DLA.",
  "runnerInstructions": {
    "what_this_step_does": "This step derives frozen Episode Plan V1 from learning outcomes for downstream population."
  },
  "defaultOutputStructure": {
    "keys": ["episode_plans"]
  }
}
```

---

## 13. Design Page

### Type
Assembly

### Input
learning_outcomes, learning_activities, activity_materials, optional learning_sequence, optional assessment_items, optional feedback_pack, optional marking_rubric, optional assessment_blueprint

### Output
page

### Purpose
- Assemble one profile-aware readable page artefact from upstream artefacts
- Keep output directly usable for HTML/VLE rendering
- Preserve explicit component, quantity, and exclusion constraints without redesigning pedagogy

### Aliases
- Build Page
- Create Readable Page
- Create Moodle Page Content

### Prompt Factory
```json
{
  "configurationMode": "none",
  "askForCustomSchema": false,
  "defaultPromptStrategy": "default_template",
  "preferredOutputFormat": "json",
  "defaultPromptNotes": "Assemble one profile-aware self-contained page; strict JSON: sections[] with section_id, heading, content (no alternate wrappers). Canonical section_id order when applicable: overview, learning_purpose, knowledge_summary, learning_activities, assessment_check, support_notes. Learner page_profile: LD-SELF-DIRECTED-RHETORIC at runtime for overview/learning_purpose journey, study_tips, and verbatim activity orientation fields; include knowledge_summary when knowledge_model or learning_content exists. learning_activities.content: array with predictable keys (activity_id, activity_preamble, learner_task, materials, expected_output, support_note, cognition fields when upstream). MATERIALS FIDELITY (hard): visual affordances are additive page-root only; copy activity.materials.* verbatim from upstream activity_materials — no paraphrase, shorten, summarise, compress, or rewrite of material bodies; forbidden inflation-collapse substitutes (exposition→one-liner, worked examples→outcome only, templates→label chains); forbidden placeholders e.g. Set of scenarios, Calculation table; LD-MATERIALS-COPY + LD-TABLE-FIDELITY preserve at runtime; 38H-3 table-adjunct fidelity — full materials.<table_key> including *Instructions:* and completion/interpretation prose (DP-TABLE-ADJ-01). assessment_check.content: items array; preserve all assessment_items by default. VISUAL AFFORDANCES (Sprint 38): visual_affordance_schema_version 38.4, activities_visual_review[], visual_affordances[] required — full generate/defer/reject rules in runtime Sprint 38 contract. ACTIVITY MEMBERSHIP (hard): every upstream activity_id in learning_activities.content unless activities_omitted[] with authority; learning_sequence order/timing only; validate (U \\ X) ⊆ C. Maths: LD-MATH-RENDER at runtime.",
  "runnerInstructions": {
    "what_this_step_does": "This step assembles a profile-aware readable page for HTML/VLE use from existing artefacts.",
    "what_to_check": "Requested component types and quantities are preserved, exclusions are respected, sections are emitted only as an array of section objects with required keys (section_id, heading, content), canonical section_ids are used where applicable (overview, learning_purpose, knowledge_summary, learning_activities, assessment_check, support_notes), no alternate section wrapper shapes are emitted, knowledge_summary is included when knowledge_model or learning_content is available, learning_activities.content is an array of rich self-contained activity objects with predictable keys, each activity.materials is a structured object with named fields and usable learner-facing content (not flattened bullet strings/markdown blobs), markdown tables are kept as named field values (not inside bullet-list strings), materials are not emitted as labels-only arrays (for example [\"Task Cards\", \"Checklist\"]) and are emitted as objects (for example {\"task_cards\":[...],\"checklist\":[...]}), assessment_check.content is an object with an items array, and when assessment_items are provided all items are preserved by default (no sampling/omission/compression unless explicitly constrained) with item_id/stem/options plus any available answer/explanation fields retained; if feedback_display is answer_grid_end or answers_explanations and answer-bearing data exists, those answer-bearing fields are retained for renderer use; source_artefacts is an object of booleans keyed by artefact name, learner-facing content excludes internal enum values (for example selected_response_only), learning_sequence contributes timing/order when present, and for learning_activities.content[].materials the page copies upstream learner-facing delivery content verbatim into activity.materials.* without paraphrase, shortening, simplification, summarisation, compression, or rewrite of material bodies (including scenario detail, background information, observation sets, checklist subsections, prompt labels, response options, templates, and structured tool outputs); if a hard output limit prevents full preservation, generation_notes.limitations records the constraint rather than silently compressing material bodies; every upstream learning_activities activity_id appears in page.sections[].learning_activities.content unless listed in generation_notes.activities_omitted[] (with activity_id, title, reason, authority), learning_sequence is used for order/timing only and does not filter membership, activity_materials do not define membership, representative activity subsets are forbidden unless explicitly requested, and any unmet hard requirements are listed in generation_notes.limitations; for learner pages with learning_activities, page root must include visual_affordance_schema_version 38.4, activities_visual_review[], and visual_affordances[] (empty arrays valid; missing keys invalid)."
  },
  "defaultOutputStructure": {
    "keys": ["artifact_type", "title", "audience", "page_profile", "sections", "visual_affordance_schema_version", "activities_visual_review", "visual_affordances", "source_artefacts", "constraints_applied", "generation_notes"]
  },
  "userOptions": [
    {
      "id": "page_profile",
      "label": "Page profile",
      "type": "select",
      "default": "learner",
      "choices": [
        { "value": "learner", "label": "Learner", "promptInstruction": "Set page_profile to learner and prioritise substantive session overview (overview/learning_purpose) plus full learner tasks and complete activity materials — never summary-only or placeholder-only materials." },
        { "value": "facilitator", "label": "Facilitator", "promptInstruction": "Set page_profile to facilitator and prioritise run guidance and facilitation/logistics support." },
        { "value": "assessment", "label": "Assessment", "promptInstruction": "Set page_profile to assessment and preserve structured item schema integrity." }
      ]
    },
    {
      "id": "include_answers",
      "label": "Include answers",
      "type": "boolean",
      "default": false,
      "promptInstructionWhenTrue": "Include answer-bearing fields where appropriate.",
      "promptInstructionWhenFalse": "Exclude answer-bearing fields from learner-visible sections."
    },
    {
      "id": "include_marking_guidance",
      "label": "Include marking guidance",
      "type": "boolean",
      "default": false,
      "promptInstructionWhenTrue": "Include marking guidance when supported by upstream artefacts.",
      "promptInstructionWhenFalse": "Do not include marking guidance."
    },
    {
      "id": "include_feedback_guidance",
      "label": "Include feedback guidance",
      "type": "boolean",
      "default": false,
      "promptInstructionWhenTrue": "Include feedback guidance when supported by upstream artefacts.",
      "promptInstructionWhenFalse": "Do not include feedback guidance."
    }
  ],
  "promptTemplate": "Context:\nYou are provided with learning_outcomes, learning_activities, activity_materials, and may also receive learning_sequence, assessment_items, feedback_pack, marking_rubric, and assessment_blueprint.\n\nTask:\nAssemble one readable, self-contained page artefact with artifact_type = page.\n\nInstructions:\n- This is a read-only composition step; do not redesign pedagogy\n- Readable page assembly applies to section structure, headings, ordering, and wrapper prose only — not to rewriting activity.materials.* bodies\n- Treat explicit user requirements from workflow goal, desired outputs, and step notes as hard constraints\n- Hard constraints include requested component types, requested quantities, and explicit exclusions\n- Set page_profile using the configured option: {{option:page_profile}}\n- Include audience as provided or infer a coherent audience from context\n- Preserve explicit numeric requests for components unless impossible from available artefacts\n- Ground all sections in provided upstream artefacts only\n- Exclude unsupported/fabricated content\n- The final page JSON must be self-contained for downstream rendering; do not rely on external chat context at render time\n- Canonical contracts (runtime modules; obey all): LD-MATERIALS-COPY (preserve — merge activity_materials per activity_id into activity.materials; no placeholder-only catalogue; PREC-02 overrides overview thinning); LD-TABLE-FIDELITY (preserve — copy full upstream table material bodies into materials.<table_key>: pipe block AND table-adjunct instructional prose in the same field per 38H-3; no comma-row or Headers/Rows flattening; do not reduce to pipe-only); LD-MATH-RENDER / Math notation output contract (renderer-supported TeX delimiters only — inline \\(...\\), block \\[...\\]; not $...$, $$...$$, code spans/fences for equations); LD-SELF-DIRECTED-RHETORIC when page_profile is learner (overview/learning_purpose/study_tips and verbatim activity orientation fields — not materials bodies)\n- Do not output labels-only references to upstream artefacts where usable content is available\n- Use meaningful section headings; avoid schema-style labels in learner-facing content (for example: Heading, Materials, Material Id)\n- Keep section ordering coherent: pre-activity context, learning purpose/outcomes, learning activities, assessment/check, support notes as applicable\n- For page_profile = assessment, preserve structured assessment item schema integrity; do not flatten items into prose\n- If learning_activities are present, include a Learning Activities section with one entry per upstream activity_id (full membership unless user requests subset or generation_notes.activities_omitted[] records intentional omission)\n- learning_activities.content MUST be an array of activity objects (not alternate wrappers)\n- Each activity: title, timing/duration, learner_task/instructions, expected_output, activity-linked materials as structured objects, cognition fields when present upstream\n- materials MUST use named fields (e.g. materials.analysis_table, materials.scenarios); do not flatten into bullet strings or markdown blobs; do not place raw markdown tables inside bullet-list strings\n- When activity_materials are provided, merge all blocks per activity_id per LD-MATERIALS-COPY preserve — copy learner-facing delivery content verbatim into activity.materials.*. Do not paraphrase, shorten, simplify, summarise, compress, convert, or rewrite material bodies. Do not shorten activity.materials.* content. If a hard output limit prevents full preservation, keep the full upstream material body where possible and record the limitation in generation_notes.limitations rather than silently compressing it. materials.<table_key> values: LD-TABLE-FIDELITY preserve requires the full field verbatim including table-adjunct prose (38H-3 / DP-TABLE-ADJ-01)\n- ACTIVITY MEMBERSHIP: every upstream activity_id must appear unless listed in generation_notes.activities_omitted[] with activity_id, title, reason, authority; learning_sequence order/timing only; activity_materials enrich only\n- If learning_sequence is present, use for order/timing only; do not drop activities absent from sequence rows\n- If assessment_items are present, include a clearly named Formative Assessment Check section containing actual questions/items from assessment_items (not summary-only prose)\n- For MCQ items include stem and options; include correct answer only when include_answers is true; include feedback/explanation only when include_feedback_guidance is true\n- If answers/feedback are not enabled, render questions only\n- assessment_check.content MUST be an object with an items array\n- Include answer-bearing fields only when include_answers is true\n- Include marking guidance only when include_marking_guidance is true and upstream artefacts support it\n- Include feedback guidance only when include_feedback_guidance is true and upstream artefacts support it\n- Do not dump raw JSON structures\n- MATERIALS FIDELITY: visual_affordances[] are additive page-root metadata only; Sprint 38 must not replace or summarise learning_activities.content[].materials; merge upstream materials with concrete scenarios, tables, and worked content verbatim — do not collapse material bodies to revision-note summaries; FORBIDDEN inflation-collapse substitutes: full exposition → one key-point line (e.g. \"Inflation is a sustained increase…\"); worked example with steps → outcome only (e.g. \"Year 1 basket = £100; Year 2 basket = £105; same money buys less\"); classification reasoning → arrow label (e.g. \"Demand exceeds supply → demand-pull inflation\"); calculation worked example → formula plus final result only; analytic worked example → one-sentence effect summary; recommendation template → section-label chain only (e.g. \"Context → Evaluation → Decision → Justification\"); transfer prompt → label-only instruction (e.g. \"Apply to real-world inflation\"); DP-TABLE-ADJ-01 (38H-3): when upstream table Material Content includes pipe rows plus instructional prose (*Instructions:*, completion guidance, interpretation prompts), emit both in activity.materials.<table_key> — table and guidance are one learner-facing instructional unit; forbidden placeholder-only labels without full content in the same field: \"Set of scenarios\", \"Set of short scenarios\", \"Calculation table\", \"Model showing\", \"Table linking\", \"See provided scenarios\", \"Scenario set describing\", \"Table with basket items\"; representation_avoid and duplicate worksheet/table rules apply to generated figures only — not to page materials\n- VISUAL AFFORDANCES (Sprint 38 — mandatory page root): pedagogical opportunities not topic opportunities; hooks are not opportunities; every visual_affordances[] row requires affordance_id; generate requires visual_slot; generate/defer/reject per Sprint 38; forbid tier core/optional labels, prose anti_spoiler, and non-token representation_avoid; include pedagogical_added_value on generate; emit activities_visual_review[] per upstream activity_id; emit visual_affordances[] as authored decisions — full 38.4 field set and examples in runtime Sprint 38 contract\n- If any hard constraint cannot be fully met, record it explicitly in generation_notes.limitations\n- Apply step notes when provided: {{stepNotes}}\n\nOutput:\n- Return output as {{preferredOutputFormat}}\n- Return JSON only\n- Return a JSON object with:\n  - artifact_type (must be page)\n  - title\n  - audience\n  - page_profile (must be one of: learner, facilitator, assessment)\n  - sections (must be an array of section objects with meaningful headings and self-contained content)\n  - source_artefacts\n  - constraints_applied\n  - visual_affordance_schema_version (required; must be \"38.4\")\n  - activities_visual_review (required array; emit [] when no rows)\n  - visual_affordances (required array; emit [] when no decisions; generate/defer/reject per Sprint 38)\n  - generation_notes\n- For learner profile, include at minimum substantive pre-activity context/content, learner-purpose/outcome framing, rich learning activities, and learner tasks/instructions\n- For learner profile with learning_activities present, include a Learning Activities section carrying usable activity-linked content, not labels-only references\n- For learner profile with learning_sequence present, preserve sequence order/timing within the activity flow\n- For learner profile with assessment_items present, include a Formative Assessment Check section with actual item content\n- For facilitator profile, include at minimum run/session guidance and sequencing/logistics/facilitation notes\n- For assessment profile, include at minimum a structured questions/items section; do not flatten questions into narrative prose\n- Record each intentional activity omission in generation_notes.activities_omitted[] as {activity_id, title, reason, authority} where authority is user_constraint | duration_constraint | explicit_exclusion; mirror each omission in generation_notes.limitations\n- Include generation_notes.limitations when hard constraints cannot be fully satisfied or when any activity is omitted\n- Before returning JSON, validate: learning_activities.content is an array containing every upstream activity_id unless listed in generation_notes.activities_omitted[]; (U \\ X) ⊆ C for composed section activity ids; each activity.materials is an object; assessment_check.content is an object with items array; learner-facing text does not leak internal enum values (for example selected_response_only)\n- Return only the JSON."
}
```

---

## 14. Generate Slide Deck

### Type
Assembly

### Input
learning_outcomes, learning_activities, activity_materials, learning_sequence

### Output
slide_deck

### Purpose
- Assemble a presentation-support deck aligned to the learning sequence
- Support launches, transitions, debriefs, and closure
- Preserve existing learning design without replacing materials

### Aliases
- Build Slide Deck
- Create Presentation Support

### Prompt Factory
```json
{
  "configurationMode": "none",
  "askForCustomSchema": false,
  "defaultPromptStrategy": "default_template",
  "preferredOutputFormat": "json",
  "defaultPromptNotes": "Assemble a presentation-support slide deck from existing sequence and materials.",
  "runnerInstructions": {
    "what_this_step_does": "This step assembles a slide deck aligned to sequence moments and activity/material references."
  },
  "defaultOutputStructure": {
    "keys": ["artifact_type", "title", "audience", "slides"]
  },
  "promptTemplate": "Context:\nYou are provided with learning_outcomes, learning_activities, activity_materials, and learning_sequence.\n\nTask:\nAssemble a slide_deck as structured presentation support for delivery.\n\nInstructions:\n- This is a read-only assembly step; do not redesign pedagogy\n- Align slides to sequence moments (for example: introduction, task launch, debrief, closure)\n- Preserve activity IDs and material IDs/titles in references where relevant\n- Do not duplicate full activity materials unless needed for slide usability\n- Do not replace activity_materials or learning_sequence; this deck supports delivery alongside them\n- Keep slides concise, facilitation-aware, and classroom/workshop usable\n- Apply step notes when provided: {{stepNotes}}\n\nOutput:\n- Return output as {{preferredOutputFormat}}\n- Return a JSON object with:\n  - title\n  - audience\n  - slides: [\n      {\n        slide_id,\n        slide_title,\n        purpose,\n        content,\n        facilitator_notes,\n        linked_activity_ids,\n        linked_material_ids\n      }\n    ]\n- Return only the JSON."
}
```

---

## 15. Generate VLE Structure

### Type
Assembly

### Input
learning_outcomes, learning_activities, activity_materials, learning_sequence

### Output
vle_structure

### Purpose
- Assemble a VLE-ready structure from existing learning design artefacts
- Preserve pedagogic sequencing while organising for learner-facing platform use
- Keep output platform-neutral (not Moodle export format)

### Aliases
- Build VLE Structure
- Create LMS Structure
- Organize VLE Course Shell

### Prompt Factory
```json
{
  "configurationMode": "none",
  "askForCustomSchema": false,
  "defaultPromptStrategy": "default_template",
  "preferredOutputFormat": "json",
  "defaultPromptNotes": "Assemble a VLE-ready structure from existing sequence, activities, and materials; when delivery_context is self_directed, optimise for independent learner progression.",
  "runnerInstructions": {
    "what_this_step_does": "This step builds a platform-neutral VLE structure from the existing learning design."
  },
  "defaultOutputStructure": {
    "keys": ["title", "organisation_mode", "sections"]
  },
  "promptTemplate": "Context:\nYou are provided with learning_outcomes, learning_activities, activity_materials, and learning_sequence.\n\nTask:\nAssemble a vle_structure artefact that organises the design for VLE/LMS delivery.\n\nInstructions:\n- This is a read-only transformation step; do not redesign pedagogy\n- Preserve pedagogic progression and sequencing intent from learning_sequence\n- Use only provided activities/materials; do not invent new activities\n- Keep structure learner-facing and implementation-ready at conceptual level\n- Do not convert to Moodle XML, Common Cartridge, SCORM, or any platform-specific package format\n- Keep sections pedagogically meaningful (for example: week/topic/session), not purely technical folders\n- Include clear section summaries and practical learner guidance where useful\n- Apply step notes when provided: {{stepNotes}}\n\nOutput:\n- Return output as {{preferredOutputFormat}}\n- Return a JSON object with:\n  - title\n  - organisation_mode\n  - sections: [\n      {\n        section_id,\n        title,\n        summary,\n        resources,\n        activities,\n        learner_instructions,\n        release_notes\n      }\n    ]\n- Return only the JSON."
}
```

---

## 16. Generate Learning Object Set

### Type
Assembly

### Input
learning_outcomes, learning_activities, activity_materials, optional learning_sequence

### Output
learning_object_set

### Purpose
- Assemble one or more structured digital learning objects from existing artefacts
- Support interactive/digital delivery without redesigning learning
- Keep output platform-neutral (not final package/export format)

### Aliases
- Build Learning Object Set
- Create Interactive Learning Objects
- Generate Digital Learning Objects

### Prompt Factory
```json
{
  "configurationMode": "none",
  "askForCustomSchema": false,
  "defaultPromptStrategy": "default_template",
  "preferredOutputFormat": "json",
  "defaultPromptNotes": "Assemble a coherent set of structured learning objects from existing design artefacts; when delivery_context is self_directed, organise objects for independent progression without facilitation assumptions.",
  "runnerInstructions": {
    "what_this_step_does": "This step assembles one artefact containing structured learning objects from upstream design inputs."
  },
  "defaultOutputStructure": {
    "keys": ["title", "audience", "objects"]
  },
  "promptTemplate": "Context:\nYou are provided with learning_outcomes, learning_activities, activity_materials, and optionally learning_sequence.\n\nTask:\nAssemble a learning_object_set artefact containing one or more structured digital learning objects.\n\nInstructions:\n- This is a read-only transformation step; do not redesign pedagogy\n- Ground all objects in provided outcomes, activities, and materials\n- Use learning_sequence only when useful for sequencing/context continuity\n- Do not invent unsupported new pedagogy or unrelated content\n- Keep objects coherent, reusable, and suitable for interactive learning implementations\n- Do not produce Xerte package files, SCORM, Common Cartridge, or final rendering/export artefacts\n- Keep output as structured source content for downstream transformation\n- Apply step notes when provided: {{stepNotes}}\n\nOutput:\n- Return output as {{preferredOutputFormat}}\n- Return a JSON object with:\n  - title\n  - audience\n  - objects: [\n      {\n        object_id,\n        title,\n        purpose,\n        pages,\n        interaction_type,\n        content,\n        linked_activity_ids,\n        linked_outcomes\n      }\n    ]\n- Return only the JSON."
}
```

---

## 18. Validate Learning Design

### Type
Evaluation

### Input
assessment_items, learning_outcomes, optional learning_activities, optional assessment_blueprint, optional feedback_pack

### Output
qa

### Purpose
- Check alignment
- Identify weaknesses
- Improve quality

### Aliases
- Validate Assessment
- Quality Check Learning Design
- Review Learning Design

### Prompt Factory
```json
{
  "configurationMode": "none",
  "askForCustomSchema": false,
  "defaultPromptStrategy": "default_template",
  "inputPriority": {
    "primary": "assessment_items",
    "secondary": "assessment_blueprint",
    "tertiary": "feedback_pack"
  },
  "preferredOutputFormat": "json",
  "defaultPromptNotes": "Validate assessment quality and blueprint alignment using a strict evaluative rubric with issue-level specificity.",
  "promptTemplate": "Context:\nYou are provided with assessment_items as primary evidence, assessment_blueprint as design contract, and feedback_pack when available.\n\nTask:\nEvaluate assessment quality and alignment strictly against the blueprint and provided artefacts.\n\nInstructions:\n- This step is strictly evaluative\n- Do NOT generate new assessment items\n- Do NOT rewrite existing items\n- Use assessment_items as the primary source for analysis\n- Use assessment_blueprint as the hard reference for coverage, difficulty, and total item constraints\n- Use feedback_pack (if available) only to evaluate feedback quality\n\nEvaluation dimensions:\nA. Alignment\n- Determine whether items accurately assess the stated learning outcomes\n- Check whether topics are correctly mapped to outcomes\n\nB. Coverage fidelity\n- Verify whether item distribution exactly matches assessment_blueprint.coverage_map\n- Identify any over- or under-representation of topics\n\nC. Difficulty fidelity\n- Verify whether actual item distribution exactly matches assessment_blueprint.difficulty_profile.item_counts\n- Identify any drift across recall, comprehension, application, and analysis\n\nD. Item quality\n- Evaluate stems for clarity, ambiguity, and well-formedness\n- Evaluate distractors for plausibility and diagnostic value\n- Identify multiple-correct ambiguity, flawed keys, or weak distractors\n\nE. Misconception targeting\n- Evaluate whether distractors reflect meaningful misconceptions\n- Evaluate whether diagnostic value is present\n\nF. Redundancy and gaps\n- Identify duplicated concepts or overly similar items\n- Identify conceptual gaps or underrepresented areas\n\nG. Feedback quality (if feedback_pack provided)\n- Evaluate whether feedback explains reasoning correctly\n- Evaluate whether feedback addresses misconceptions\n- Evaluate pedagogical usefulness and actionability\n\nIssue specificity requirements:\n- All issues must reference specific item_id values where relevant\n- Avoid generic statements\n- Each issue must include:\n  - issue\n  - affected_items\n  - severity (minor | moderate | major)\n  - recommendation\n\nValidation checks before finalising output:\n- Verify coverage_map alignment exactly\n- Verify difficulty_profile alignment exactly\n- Verify total_items consistency exactly\n- If any mismatch is found, record it explicitly in coverage_analysis and difficulty_validation with affected item_ids where possible\n\nOutput:\n- Return output as {{preferredOutputFormat}}\n- Return a JSON object with this structure:\n  {\n    \"alignment_review\": {},\n    \"coverage_analysis\": {},\n    \"difficulty_validation\": {},\n    \"item_quality_issues\": [],\n    \"misconception_analysis\": {},\n    \"redundancy_and_gaps\": {},\n    \"feedback_quality_review\": {},\n    \"overall_judgement\": \"\",\n    \"recommended_improvements\": []\n  }\n- Return only the JSON.",
  "defaultOutputStructure": {
    "keys": [
      "alignment_review",
      "coverage_analysis",
      "difficulty_validation",
      "item_quality_issues",
      "misconception_analysis",
      "redundancy_and_gaps",
      "feedback_quality_review",
      "overall_judgement",
      "recommended_improvements"
    ]
  }
}
```

---

## 19. Revise Assessment Based on QA

### Type
Revision

### Input
assessment_items, qa, optional assessment_blueprint, optional feedback_pack

### Output
revised_assessment_items

### Purpose
- Revise an existing assessment artefact using structured QA findings
- Preserve strengths while improving weaknesses
- Maintain blueprint fidelity and downstream compatibility

### Aliases
- Refine Assessment
- Improve Assessment from QA
- Revise Questions Based on Validation

### Prompt Factory
```json
{
  "configurationMode": "none",
  "askForCustomSchema": false,
  "defaultPromptStrategy": "default_template",
  "inputPriority": {
    "primary": "qa",
    "secondary": "assessment_items",
    "tertiary": "assessment_blueprint",
    "quaternary": "feedback_pack"
  },
  "preferredOutputFormat": "json",
  "defaultPromptNotes": "Revise assessment items based on QA findings without unnecessary regeneration.",
  "defaultOutputStructure": {
    "keys": ["revised_assessment_items", "revision_summary"]
  },
  "promptTemplate": "Context:\nYou are provided with qa findings and assessment_items, with optional assessment_blueprint and feedback_pack.\n\nTask:\nRevise the provided assessment items in response to QA findings while preserving strengths and structural compatibility.\n\nInstructions:\n- Use qa as the primary driver for what must change\n- Use assessment_items as the artefact to revise\n- Use assessment_blueprint to preserve design constraints and intended assessment structure\n- Use feedback_pack (if available) to improve pedagogical usefulness and misconception targeting\n- This is a revision step, not a fresh generation step\n- Revise the provided assessment items in response to QA findings\n- Do not generate a completely new assessment unless revision is impossible\n- Preserve assessment items that are already sound\n\nRevision focus:\n- Address alignment issues where item intent does not match related learning outcomes\n- Address weak topic-to-outcome mapping where QA identifies problems\n- Correct coverage_map drift (topic over/under-representation) when identified\n- Correct difficulty_profile drift across recall/comprehension/application/analysis when identified\n- Improve item quality: ambiguous stems, implausible distractors, weak discrimination, multiple defensible answers\n- Improve misconception targeting and explanation quality where QA identifies weak diagnostic value\n- Reduce redundancy and close conceptual gaps highlighted by QA\n\nBlueprint fidelity constraints:\n- Preserve total_items, coverage_map, difficulty_profile, intended assessment type, and topic structure unless QA indicates a justified change and blueprint permits it\n- Do not silently drift from blueprint constraints during revision\n- Do not change item counts unless QA explicitly requires it and blueprint permits it\n- Do not remove valid items unnecessarily\n- Do not weaken strong items during revision\n- Keep all content grounded in the knowledge model and blueprint\n\nCompatibility constraints:\n- Maintain exact JSON compatibility where possible\n- Keep revised item structure compatible with downstream steps\n- Each revised item should preserve fields used by assessment_items artefacts, including: item_id, topic, related_learning_outcomes, integration_type, difficulty_level, stem, options, correct_answer, explanation_or_rationale\n\nOutput:\n- Return output as {{preferredOutputFormat}}\n- Return a JSON object containing:\n  - revised_assessment_items: revised items in a structure compatible with assessment_items\n  - revision_summary: {\n      issues_addressed: [],\n      issues_deferred: [],\n      notes: \"\"\n    }\n- If no changes are needed, return the original compatible item set in revised_assessment_items and state explicitly in revision_summary.notes that no revisions were necessary\n- Return only the JSON."
}
```

---

## 20. Design Marking Rubric

### Type
Specification

### Input
assessment_blueprint, revised_assessment_items (or assessment_items)

### Output
marking_rubric

### Purpose
- Produce tutor-facing marking guidance for the generated assessment pack
- Define criteria, descriptors, weightings, and moderation guidance
- Keep rubric aligned with outcomes and assessment blueprint

### Aliases
- Create Marking Rubric
- Build Tutor Rubric
- Generate Assessment Rubric

### Prompt Factory
```json
{
  "configurationMode": "none",
  "askForCustomSchema": false,
  "defaultPromptStrategy": "default_template",
  "inputPriority": {
    "primary": "assessment_blueprint",
    "secondary": "revised_assessment_items",
    "tertiary": "assessment_items"
  },
  "preferredOutputFormat": "json",
  "defaultPromptNotes": "Generate a tutor-facing marking rubric and grading guidance aligned to blueprint and items. When mathematical notation is needed in rubric criteria/descriptors/guidance, use only \\(...\\) inline and \\[...\\] block delimiters; never $...$/$$...$$, code wrappers, or HTML-escaped delimiters.",
  "defaultOutputStructure": {
    "keys": ["rubric", "criteria", "grading_scale", "moderation_guidance", "assessor_notes"]
  },
  "promptTemplate": "Context:\nYou are provided with assessment_blueprint and assessment items (prefer revised_assessment_items when available).\n\nTask:\nGenerate a tutor-facing marking_rubric that can be used to assess submitted responses consistently.\n\nInstructions:\n- Use assessment_blueprint as the primary source of alignment and intent\n- Use revised_assessment_items when present; otherwise use assessment_items\n- Create explicit marking criteria aligned to outcomes/topics\n- Define level descriptors per criterion (for example: excellent, good, satisfactory, limited)\n- Include criterion weightings that sum to 100\n- Include guidance for borderline cases and common misconceptions\n- Include moderation guidance for consistency across markers\n- Keep guidance practical and ready for assessor use\n- Do not redesign the assessment tasks\n- Keep all guidance grounded in provided artefacts\n- Apply step notes when provided: {{stepNotes}}\n\nOutput:\n- Return output as {{preferredOutputFormat}}\n- Return a JSON object containing:\n  - rubric: { title, purpose }\n  - criteria: [ { criterion_id, criterion, weight, descriptors } ]\n  - grading_scale\n  - moderation_guidance\n  - assessor_notes\n- Return only the JSON."
}
```

---

# Usage Guidelines

- Not all workflows require all steps.
- Select step patterns based on:
  - user intent
  - required outputs
  - level of complexity

- Maintain logical ordering:
  1. Analysis (Normalize, Generate Learning Content, Model Knowledge)
  2. Specification (Outcomes)
  3. Design (Activities, Assessment, Feedback)
  4. Organisation (Sequence)
  5. Evaluation (Validation)
  6. Revision (Revise Assessment Based on QA)
  7. Tutor Marking Support (Design Marking Rubric)
  8. Delivery composition (Design Page)

---

# Summary

Step patterns provide a **standardised structure** for learning design workflows.

They ensure:
- consistency
- clarity
- reuse
- alignment with instructional design principles
