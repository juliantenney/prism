# LD elicitation factors (snapshot)

**Canonical source (authoritative):**  
`domains/learning-design/domain-learning-design-step-patterns.md` — `workflowBriefConfig` (approx. lines **326–627+**)

**Why this matters for Sprint 23:** Elicitation should **initialise** structured state, not duplicate Settings. Factors marked `settings-only` on controls still appear here as **required/optional/refinement** questions — Sprint 23 classifies what can be deferred post-synthesis.

---

## requiredFactors (workflow-level — pedagogical gate)

```json
"requiredFactors": [
  { "id": "topic", "label": "Topic", "type": "text", "required": true },
  { "id": "learner_level", "label": "Learner level", "type": "select", "required": true,
    "choices": ["beginner", "intermediate", "advanced", "undergraduate", "postgraduate"] },
  { "id": "design_scope", "label": "Design scope", "type": "select", "required": true,
    "choices": ["single_activity", "session", "sequence", "module"], "default": "session" },
  { "id": "delivery_pattern", "label": "Delivery pattern", "type": "select", "required": true,
    "choices": ["face_to_face", "blended", "mostly_online"] },
  { "id": "input_strategy", "label": "Input strategy", "type": "select", "required": true,
    "choices": ["generate_from_topic", "provided_source_content", "mixed"] }
]
```

**Overlap with Settings:** `design_scope`, `input_strategy` also exist as `workflowParameterControls` (`elicitation: settings-only`). Sprint 23 should define whether brief required factors remain the only **blocking** gate or Settings can satisfy them after synthesis.

---

## optionalFactors (workflow-level assumptions)

```json
"optionalFactors": [
  { "id": "duration_minutes", "label": "Session duration (minutes)", "type": "number", "min": 10, "max": 480 },
  { "id": "delivery_mode", "type": "select", "choices": ["live_workshop", "seminar", "async"] },
  { "id": "delivery_context", "type": "select",
    "choices": ["in_person", "online_sync", "online_async", "blended", "self_directed"] },
  { "id": "session_materials", "type": "multi_select", "choices": ["page", "slide_deck"], "default": ["page"] },
  { "id": "page_profile", "type": "select", "choices": ["learner", "facilitator", "assessment"] },
  { "id": "assessment_required", "label": "Assessment required", "type": "boolean" },
  { "id": "learning_environments", "type": "multi_select" },
  { "id": "assessment_strategy", "type": "select",
    "choices": ["none", "formative", "summative", "mixed"], "default": "none" }
]
```

**Pedagogical assumptions:** `assessment_required` and `assessment_strategy` shape workflow topology (which steps are included) — distinct from per-step assessment blueprint tuning.

---

## refinementFactors (assessment — post-essentials)

Excerpt — factors that often re-appear in elicitation when `assessment_required: true`:

```json
{
  "id": "coverage_scope",
  "label": "Coverage scope",
  "skipIfContextResolved": true,
  "askWhenResolvedFactorEquals": { "assessment_required": true },
  "choices": ["selected_themes", "balanced", "broad_coverage"]
},
{
  "id": "cognitive_demand",
  "label": "Cognitive demand profile",
  "skipIfContextResolved": true,
  "askWhenResolvedFactorEquals": { "assessment_required": true }
},
{
  "id": "assessment_type",
  "label": "Assessment type",
  "mustAsk": true,
  "askWhenResolvedFactorEquals": { "assessment_required": true },
  "choices": ["mcq", "short_answer", "essay", "problem", "case_study", "mixed"]
},
{
  "id": "assessment_total_items",
  "label": "Total assessment items",
  "mustAsk": true,
  "type": "number",
  "default": 10,
  "askWhenResolvedFactorEquals": { "assessment_required": true }
},
{
  "id": "difficulty_profile",
  "label": "Difficulty distribution",
  "skipIfContextResolved": true,
  "askWhenResolvedFactorEquals": { "assessment_required": true }
},
{
  "id": "assessment_cadence",
  "label": "Assessment cadence",
  "askWhenDesignScopeIn": ["sequence", "module"],
  "choices": ["single_end_point", "periodic_formative", "mixed_formative_summative"]
}
```

---

## refinementFactors (activity design + sequencing)

```json
{
  "id": "activity_pattern_mix",
  "label": "Activity pattern mix",
  "askWhenDesignScopeIn": ["session", "sequence", "module"]
},
{
  "id": "sequencing_granularity",
  "label": "Sequencing granularity",
  "choices": ["lightweight", "standard", "detailed"],
  "default": "standard"
}
```

**Sprint 23 alignment target:** Map each refinement factor to **workflow constraint**, **stepParam**, and/or **stepParameterControls** — flag factors that should become `settings-only` or `skipIfContextResolved` when unified Settings already holds the value.
