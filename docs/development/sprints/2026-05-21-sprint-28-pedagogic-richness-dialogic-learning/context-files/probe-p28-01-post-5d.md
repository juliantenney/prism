# P28-01 — post-5d stabilisation probe

**Captured:** 2026-05-21
**Method:** Sprint 28-5a–5d runtime (packs, topology, DLA contracts, composition parity) + OpenAI `gpt-4.1-mini` step chain with cognition scaffold and composition post-pass.

## A. Brief (unchanged from 28-3)

> Design a 60-minute seminar on climate misconceptions for undergraduate students. Small groups use rich task cards with authentic scenarios (named places, roles, and conflicting claims), discussion prompts that create productive uncertainty, and facilitator moves that respond to common learner arguments. After group work, students complete a 5-item formative check; do not reveal correct answers on the student handout — the tutor debriefs after discussion. Include contingent facilitator notes (if learners say X, ask Y) and delayed feedback guidance.

## B. E/O + cognition architecture (28-5a/b)

```json
{
  "explicit": {
    "desired_outputs": "Learner handout page plus facilitator session notes.",
    "input_strategy": "generate_from_topic",
    "session_materials": [
      "page"
    ],
    "learner_level": "undergraduate",
    "delivery_mode": "seminar",
    "assessment_required": true,
    "activities_required": true,
    "page_profile": "facilitator",
    "include_answers": false,
    "include_feedback_guidance": false,
    "feedback_required": "none",
    "learner_answer_visibility": "hidden_until_reveal",
    "feedback_timing": "after_peer_discussion",
    "assessment_interaction_mode": "discussion_oriented",
    "misconception_reconciliation_required": true,
    "productive_uncertainty_required": true,
    "assessment_total_items": 5,
    "topic": "climate misconceptions for undergraduate students",
    "workshop_subject": "climate misconceptions for undergraduate students",
    "materials_required": true
  },
  "resolved": {
    "topic": "climate misconceptions for undergraduate students",
    "learner_level": "undergraduate",
    "design_scope": "session",
    "delivery_pattern": "face_to_face",
    "input_strategy": "generate_from_topic",
    "delivery_mode": "seminar",
    "session_materials": [
      "page"
    ],
    "page_profile": "facilitator",
    "assessment_required": true,
    "learning_environments": [
      "classroom"
    ],
    "assessment_strategy": "none",
    "feedback_timing": "after_peer_discussion",
    "assessment_interaction_mode": "discussion_oriented",
    "learner_answer_visibility": "hidden_until_reveal",
    "peer_instruction_phase": "none",
    "misconception_assessment_link": false,
    "design_feedback_required": true,
    "cognitive_engagement_required": false,
    "reasoning_revision_required": false,
    "misconception_reconciliation_required": true,
    "adaptive_scaffolding_required": false,
    "productive_uncertainty_required": true,
    "coverage_scope": "balanced",
    "cognitive_demand": "mixed",
    "feedback_required": "none",
    "assessment_total_items": 5,
    "activity_pattern_mix": "balanced",
    "sequencing_granularity": "standard",
    "tone_style": "academic",
    "depth_level": "mixed",
    "include_examples": true,
    "include_practice_tasks": false,
    "compact_vs_detailed": "standard",
    "include_answers": false,
    "include_feedback_guidance": false
  },
  "cognition_packs": [
    "misconception_repair_pack"
  ],
  "cognition_contract": {
    "active": true,
    "packIds": [
      "misconception_repair_pack"
    ],
    "dlaFields": [
      {
        "id": "misconception_claim",
        "packId": "misconception_repair_pack",
        "gamLabel": "Misconception claim",
        "arrayOrString": false
      },
      {
        "id": "reconciliation_prompt",
        "packId": "misconception_repair_pack",
        "gamLabel": "Reconciliation prompt",
        "arrayOrString": false
      },
      {
        "id": "evidence_contrast",
        "packId": "misconception_repair_pack",
        "gamLabel": "Evidence contrast",
        "arrayOrString": false
      },
      {
        "id": "uncertainty_tension_prompt",
        "factorId": "productive_uncertainty_required",
        "gamLabel": "Uncertainty tension",
        "arrayOrString": false
      }
    ],
    "dlaFieldIds": [
      "misconception_claim",
      "reconciliation_prompt",
      "evidence_contrast",
      "uncertainty_tension_prompt"
    ],
    "gamSections": [
      "Misconception claim",
      "Reconciliation prompt",
      "Evidence contrast",
      "Uncertainty tension"
    ],
    "gamSectionLabels": [
      "Misconception claim",
      "Reconciliation prompt",
      "Evidence contrast",
      "Uncertainty tension"
    ]
  },
  "orchestration": {
    "cognitionTopologyRequired": true,
    "preserveLearningActivityChain": true,
    "cognitionAwareAssessmentFlow": true,
    "preservedCognitionStages": [
      "Define Learning Outcomes",
      "Design Learning Activities",
      "Generate Activity Materials",
      "Construct Learning Sequence"
    ],
    "cognitionPruningPrevented": []
  },
  "presentation": {
    "hasSemanticPresentation": true,
    "learnerAnswerVisibility": "hidden_until_reveal",
    "feedbackTiming": "after_peer_discussion",
    "includeAnswers": false,
    "feedbackDisplay": "none"
  }
}
```

## C. Topology (O)

Normalize Content → Generate Learning Content → Model Knowledge → Define Learning Outcomes → Design Learning Activities → Generate Activity Materials → Generate Assessment Items → Design Feedback → Construct Learning Sequence → Design Page

## D. learning_activities + cognition fields (G / 28-5c)

```json
{
  "activities": [
    {
      "activity_id": "A1",
      "title": "Small Group Analysis of Climate Misconception Scenarios",
      "grouping": "small_group",
      "duration_minutes": 40,
      "mapped_learning_outcomes": [
        "LO1",
        "LO2",
        "LO3",
        "LO4"
      ],
      "required_materials": [
        {
          "material_id": "TC1",
          "type": "task_cards",
          "purpose": "Provide authentic climate scenarios with named places, roles, and conflicting claims",
          "specification": "Each card contains a scenario describing a climate misconception, includes at least two conflicting claims, discussion prompts to create productive uncertainty, and facilitator notes with contingent moves."
        }
      ],
      "learner_task": "### Task\n- In your small group, read the assigned scenario task card carefully.\n- Discuss the conflicting claims presented, using the prompts to explore evidence and uncertainties.\n- Work together to reconcile the claims by evaluating the evidence and articulating your group's understanding of the misconception.\n- Prepare to share your group's reasoning and conclusions with the class.",
      "expected_output": "A group summary that:\n- Identifies the misconception claim(s) in the scenario.\n- Explains the conflicting claims and the evidence supporting or refuting them.\n- Demonstrates engagement with productive uncertainty and reconciles the claims with evidence-based reasoning.\n- Responds to facilitator prompts addressing common learner arguments.",
      "failure_mode": "Groups may focus on debating opinions without referencing evidence or may prematurely settle on one claim without exploring uncertainty.",
      "facilitator_moves": "- Circulate among groups to prompt deeper evidence evaluation using the reconciliation_prompt.\n- If learners accept misconceptions uncritically, ask: 'What evidence supports this claim, and what evidence challenges it?'\n- If groups avoid uncertainty, ask: 'What aspects of the scenario remain unclear or contested?'\n- Encourage articulation of conflicting claims and guide groups to explore the evidence contrast.\n- Time check at 30 minutes: remind groups to prepare their summary for sharing.",
      "misconception_claim": "Each scenario card explicitly states a common climate misconception claim relevant to the scenario's context.",
      "reconciliation_prompt": "What evidence can help reconcile these conflicting claims? How might uncertainty in the data affect your conclusion?",
      "evidence_contrast": "Highlight differences between claims based on the quality, source, or interpretation of evidence presented in the scenario.",
      "uncertainty_tension_prompt": "What uncertainties or tensions arise from the conflicting claims, and how do they influence your understanding?"
    },
    {
      "activity_id": "A2",
      "title": "Formative Check: Individual Reflection and Group Debrief",
      "grouping": "individual",
      "duration_minutes": 15,
      "mapped_learning_outcomes": [
        "LO5"
      ],
      "required_materials": [
        {
          "material_id": "FC1",
          "type": "prompt_set",
          "purpose": "Formative assessment with 5 items to evaluate understanding of climate misconceptions",
          "specification": "Five questions based on the scenarios and discussions, designed to probe recognition of misconceptions, evidence evaluation, and uncertainty. Answers are not provided on the student handout."
        }
      ],
      "learner_task": "### Task\n- Individually complete the 5-item formative check on your handout.\n- Do not discuss answers yet; focus on your own understanding.\n- Submit your responses to the facilitator for later debriefing.",
      "expected_output": "Completed formative check responses reflecting individual understanding of climate misconceptions and evidence evaluation.",
      "failure_mode": "Learners may guess answers without reflection or feel uncertain about how to answer due to complexity.",
      "facilitator_moves": "- Collect responses without revealing correct answers.\n- After collection, lead a whole-class debrief discussing each question, clarifying misconceptions, and highlighting evidence-based reasoning.\n- Use learner responses to tailor debrief emphasis.\n- Encourage questions and address lingering uncertainties.",
      "misconception_claim": "Assessment items include statements reflecting common misconceptions to be evaluated by learners.",
      "reconciliation_prompt": "Consider how your earlier group discussion influences your answers to these questions.",
      "evidence_contrast": "Questions contrast claims with supporting or contradicting evidence to test learner evaluation skills.",
      "uncertainty_tension_prompt": "Reflect on any uncertainties you encountered in answering these questions and how they relate to the scientific evidence."
    }
  ],
  "outcome_alignment": {
    "LO1": "Addressed primarily in Activity A1 through identification and articulation of misconceptions in scenarios.",
    "LO2": "Developed in Activity A1 by analyzing authentic climate scenarios and evaluating evidence with uncertainty.",
    "LO3": "Engaged in Activity A1 through small group discussion and reconciliation of conflicting claims.",
    "LO4": "Supported in Activity A1 by responding to facilitator prompts addressing common learner arguments.",
    "LO5": "Focused in Activity A2 via formative check to self-evaluate understanding and prepare for debrief."
  },
  "delivery_notes": "The session is designed for a 60-minute face-to-face seminar. Begin with small groups working on rich task cards (40 minutes), using facilitator moves to guide productive uncertainty and evidence-based reconciliation. Follow with an individual formative check (15 minutes) without revealing answers. The tutor then leads a debrief discussing responses and clarifying misconceptions. Facilitators should monitor group dynamics and scaffold discussion to maintain focus on evidence and uncertainty. Timing cues and contingent prompts help address common failure modes."
}
```

**DLA contract audit:**

```json
{
  "required": [
    "misconception_claim",
    "reconciliation_prompt",
    "evidence_contrast",
    "uncertainty_tension_prompt"
  ],
  "generated": [
    "misconception_claim",
    "reconciliation_prompt",
    "evidence_contrast",
    "uncertainty_tension_prompt"
  ],
  "missing": [],
  "satisfied": true
}
```

## E. activity_materials (G)

```
Activity: Small Group Analysis of Climate Misconception Scenarios  
Activity ID: A1  
Mapped outcomes: LO1, LO2, LO3, LO4  

Material: TC1 (task_cards)  
Purpose: Provide authentic climate scenarios with named places, roles, and conflicting claims  

Content:  

---

### Scenario Card 1: Coastal City Flooding Debate — Miami, USA  

**Context:**  
Miami is experiencing increased flooding events. Two community leaders debate the causes and solutions.  

**Roles:**  
- **Alex, City Planner:** Claims that flooding is primarily caused by rising sea levels due to human-driven climate change.  
- **Jordan, Local Business Owner:** Argues that flooding is mainly due to poor drainage infrastructure and occasional storm surges, not climate change.  

**Conflicting Claims:**  
- *Claim A (Alex):* "The sea level rise caused by greenhouse gas emissions is the main driver of Miami’s flooding problems."  
- *Claim B (Jordan):* "Flooding is mostly a result of outdated drainage systems and extreme weather events unrelated to climate change."  

**Discussion Prompts:**  
- What evidence supports each claim? Consider scientific data on sea levels and local infrastructure reports.  
- How might uncertainties in sea level projections or storm frequency affect your view of the causes?  
- What tensions arise between focusing on climate change versus infrastructure improvements?  
- How could these claims be reconciled to inform effective flood management?  

**Facilitator Notes:**  
- If learners accept Claim B without question, ask: "What evidence exists about sea level trends in Miami, and how might that influence flooding?"  
- If learners dismiss infrastructure issues, ask: "How might local drainage capacity interact with sea level rise to affect flooding?"  
- Encourage exploration of combined causes and uncertainties in projections.  
- Time check at 10 minutes: prompt groups to start summarizing their reasoning.  

---

### Scenario Card 2: Renewable Energy Impact — Bavaria, Germany  

**Context:**  
A local newspaper article debates the effectiveness of wind turbines in reducing carbon emissions.  

**Roles:**  
- **Maria, Environmental Scientist:** Claims wind turbines significantly reduce carbon emissions and help combat climate change.  
- **Lukas, Energy Critic:** Argues that wind turbines are unreliable and their manufacturing and maintenance cause hidden emissions, limiting their net benefit.  

**Conflicting Claims:**  
- *Claim A (Maria):* "Wind energy is a clean, effective way to reduce greenhouse gas emissions."  
- *Claim B (Lukas):* "The lifecycle emissions and intermittency of wind turbines reduce their overall climate benefit."  

**Discussion Prompts:**  
- What lifecycle evidence supports or challenges the net emissions impact of wind turbines?  
- How does intermittency affect the reliability and emissions profile of wind energy?  
- What uncertainties exist in measuring lifecycle emissions?  
- Can both claims be valid in different contexts? How might this influence energy policy?  

**Facilitator Notes:**  
- If learners overlook lifecycle emissions, ask: "What emissions occur during manufacturing and maintenance of turbines?"  
- If learners ignore intermittency, ask: "How does variability in wind affect the energy grid and emissions from backup sources?"  
- Guide groups to weigh evidence and uncertainties in lifecycle analyses.  
- Time check at 20 minutes: remind groups to prepare a concise summary.  

---

### Scenario Card 3: Climate Change and Agriculture — Punjab, India  

**Context:**  
Farmers in Punjab report changes in crop yields and weather patterns, leading to debate on causes.  

**Roles:**  
- **Ravi, Farmer:** Believes that recent droughts and yield drops are caused by climate change.  
- **Neha, Agricultural Scientist:** Suggests that local soil degradation and water management practices are the main factors, not climate change alone.  

**Conflicting Claims:**  
- *Claim A (Ravi):* "Climate change is causing unpredictable weather and harming agriculture here."  
- *Claim B (Neha):* "Poor soil health and irrigation practices are the primary reasons for yield decline, not climate change."  

**Discussion Prompts:**  
- What evidence links climate change to weather variability in Punjab?  
- How do local agricultural practices impact soil and water availability?  
- What uncertainties exist in attributing yield changes to climate versus management?  
- How might integrated approaches address these challenges?  

**Facilitator Notes:**  
- If learners focus only on climate change, ask: "What role do soil and water management play in crop yields?"  
- If learners ignore climate variability, ask: "How might changing rainfall patterns influence farming outcomes?"  
- Promote discussion of multiple interacting causes and uncertainties.  
- Time check at 30 minutes: encourage groups to finalize their conclusions.  

---

### Scenario Card 4: Carbon Footprint of Electric Vehicles — California, USA  

**Context:**  
A public forum discusses whether electric vehicles (EVs) truly reduce carbon emissions compared to gasoline cars.  

**Roles:**  
- **Samantha, EV Advocate:** Argues EVs have a lower carbon footprint over their lifetime.  
- **David, Skeptic:** Claims that emissions from electricity generation and battery production negate EV benefits.  

**Conflicting Claims:**  
- *Claim A (Samantha):* "EVs significantly reduce greenhouse gas emissions compared to traditional cars."  
- *Claim B (David):* "The carbon cost of battery production and electricity sources means EVs are not much better."  

**Discussion Prompts:**  
- What evidence compares lifecycle emissions of EVs and gasoline cars?  
- How does the electricity generation mix affect EV emissions?  
- What uncertainties exist in battery production emissions data?  
- How might future changes in energy sources influence these claims?  

**Facilitator Notes:**  
- If learners dismiss electricity source impact, ask: "
```

## F. assessment_items (G)

```json
{
  "learner_handout_page": {
    "title": "Climate Misconceptions Seminar: Small Group Task Cards & Formative Check",
    "instructions": "In your small groups, read each scenario carefully. Discuss the conflicting claims, evaluate the evidence, and use the prompts to explore productive uncertainty. After group discussion, complete the 5-item formative check individually. Do not look for answers now; the facilitator will guide a debrief after all responses are collected.",
    "task_cards": [
      {
        "scenario_name": "Coastal City Flooding Debate",
        "location": "Miami, USA",
        "roles": [
          "City Planner",
          "Local Fisherman",
          "Climate Scientist"
        ],
        "misconception_claim": "Sea level rise is not caused by human activity but by natural cycles.",
        "conflicting_claims": [
          "City Planner: 'Flooding is due to poor infrastructure, not climate change.'",
          "Local Fisherman: 'The sea has always risen and fallen; this is normal.'",
          "Climate Scientist: 'Scientific data shows accelerated sea level rise linked to global warming.'"
        ],
        "reconciliation_prompt": "How can we reconcile these views considering the evidence?",
        "evidence_contrast": "Compare historical sea level data with recent measurements and infrastructure reports.",
        "uncertainty_tension_prompt": "What uncertainties remain about causes and impacts of flooding here?"
      },
      {
        "scenario_name": "Renewable Energy Impact",
        "location": "Bavaria, Germany",
        "roles": [
          "Energy Company Executive",
          "Environmental Activist",
          "Economist"
        ],
        "misconception_claim": "Renewable energy cannot meet our energy demands reliably.",
        "conflicting_claims": [
          "Energy Executive: 'Renewables are too intermittent to replace fossil fuels fully.'",
          "Activist: 'Renewables are the only sustainable solution to climate change.'",
          "Economist: 'Energy transition costs could harm the economy if done too fast.'"
        ],
        "reconciliation_prompt": "What evidence supports or challenges these claims?",
        "evidence_contrast": "Examine energy production data, economic reports, and sustainability studies.",
        "uncertainty_tension_prompt": "What are the trade-offs and uncertainties in transitioning energy systems?"
      },
      {
        "scenario_name": "Deforestation and Carbon Emissions",
        "location": "Amazon Rainforest, Brazil",
        "roles": [
          "Local Farmer",
          "Government Official",
          "Conservation Scientist"
        ],
        "misconception_claim": "Deforestation has minimal impact on global carbon emissions.",
        "conflicting_claims": [
          "Farmer: 'Clearing land is necessary for livelihoods; forests regrow naturally.'",
          "Official: 'Deforestation rates are decreasing thanks to policies.'",
          "Scientist: 'Deforestation contributes significantly to carbon emissions and climate change.'"
        ],
        "reconciliation_prompt": "How do these perspectives align or conflict with scientific evidence?",
        "evidence_contrast": "Review deforestation statistics, carbon emission data, and policy effectiveness.",
        "uncertainty_tension_prompt": "What uncertainties exist about deforestation's long-term climate effects?"
      }
    ],
    "formative_check": {
      "instructions": "Answer the following questions individually based on your group discussions. Do not check answers yet.",
      "items": [
        {
          "id": "Q1",
          "question": "Which factor is a primary driver of recent sea level rise?",
          "options": [
            "Natural ocean cycles",
            "Melting of polar ice and thermal expansion",
            "Increased rainfall",
            "Tectonic plate movements"
          ]
        },
        {
          "id": "Q2",
          "question": "What is a common misconception about renewable energy reliability?",
          "options": [
            "Renewables can never provide 100% energy needs",
            "Energy storage and grid management can mitigate intermittency",
            "Renewables are always cheaper than fossil fuels",
            "Renewables produce no greenhouse gases"
          ]
        },
        {
          "id": "Q3",
          "question": "How does deforestation affect global carbon emissions?",
          "options": [
            "It reduces carbon emissions by increasing farmland",
            "It has no measurable effect",
            "It increases carbon emissions by releasing stored carbon",
            "It only affects local air quality"
          ]
        },
        {
          "id": "Q4",
          "question": "Why is it important to consider multiple perspectives in climate debates?",
          "options": [
            "To identify biases and evaluate evidence critically",
            "To find the quickest solution",
            "To avoid discussing uncertainties",
            "To confirm pre-existing beliefs"
          ]
        },
        {
          "id": "Q5",
          "question": "What does productive uncertainty encourage in scientific discussions?",
          "options": [
            "Ignoring conflicting evidence",
            "Accepting all claims as equally valid",
            "Exploring evidence to refine understanding",
            "Rejecting scientific consensus"
          ]
        }
      ]
    }
  },
  "facilitator_session_notes": {
    "session_duration_minutes": 60,
    "overview": "Facilitate small group discussions on climate misconceptions using rich task cards, then conduct a formative check with delayed feedback.",
    "pacing_guide": [
      {
        "time_range": "0-5 min",
        "activity": "Introduction to seminar goals and instructions for group work."
      },
      {
        "time_range": "5-30 min",
        "activity": "Small group discussions usin
```

## G. Composed page after 28-5d pass (C)

```json
{
  "artifact_type": "page",
  "title": "Climate Misconceptions Seminar: Small Group Task Cards & Formative Check",
  "audience": "Undergraduate students",
  "page_profile": "learner",
  "sections": [
    {
      "heading": "Introduction and Seminar Overview",
      "content": [
        "This seminar is designed to help you explore common misconceptions about climate change through authentic scenarios. You will work in small groups to analyze conflicting claims, evaluate evidence, and engage with uncertainties. After group discussions, you will complete an individual formative check to reflect on your understanding. Answers will not be revealed on the handout; the facilitator will guide a debrief after collecting your responses."
      ],
      "section_id": "overview"
    },
    {
      "heading": "Learning Activities",
      "content": [
        {
          "title": "Small Group Analysis of Climate Misconception Scenarios",
          "duration_minutes": 40,
          "purpose": "In your small groups, you will read an assigned scenario card describing a real-world climate misconception. You will discuss the conflicting claims presented, evaluate supporting and opposing evidence, and explore uncertainties. Your goal is to reconcile these claims through evidence-based reasoning and prepare to share your group's conclusions.",
          "learner_task": "### Task\n- Read your assigned scenario card carefully.\n- Discuss the conflicting claims and use the prompts to explore evidence and uncertainties.\n- Work together to reconcile the claims by evaluating the evidence and articulating your group's understanding.\n- Prepare a summary of your group's reasoning to share with the class.",
          "materials": {
            "task_cards": "---\n\n### Scenario Card 1: Coastal City Flooding Debate\n\n**Location:** Miami, USA\n\n**Roles:**\n- City Planner\n- Local Fisherman\n- Climate Scientist\n\n**Misconception Claim:** Sea level rise is not caused by human activity but by natural cycles.\n\n**Conflicting Claims:**\n- City Planner: 'Flooding is due to poor infrastructure, not climate change.'\n- Local Fisherman: 'The sea has always risen and fallen; this is normal.'\n- Climate Scientist: 'Scientific data shows accelerated sea level rise linked to global warming.'\n\n**Reconciliation Prompt:** How can we reconcile these views considering the evidence?\n\n**Evidence Contrast:** Compare historical sea level data with recent measurements and infrastructure reports.\n\n**Uncertainty Tension Prompt:** What uncertainties remain about causes and impacts of flooding here?\n\n---\n\n### Scenario Card 2: Renewable Energy Impact\n\n**Location:** Bavaria, Germany\n\n**Roles:**\n- Energy Company Executive\n- Environmental Activist\n- Economist\n\n**Misconception Claim:** Renewable energy cannot meet our energy demands reliably.\n\n**Conflicting Claims:**\n- Energy Executive: 'Renewables are too intermittent to replace fossil fuels fully.'\n- Activist: 'Renewables are the only sustainable solution to climate change.'\n- Economist: 'Energy transition costs could harm the economy if done too fast.'\n\n**Reconciliation Prompt:** What evidence supports or challenges these claims?\n\n**Evidence Contrast:** Examine energy production data, economic reports, and sustainability studies.\n\n**Uncertainty Tension Prompt:** What are the trade-offs and uncertainties in transitioning energy systems?\n\n---\n\n### Scenario Card 3: Deforestation and Carbon Emissions\n\n**Location:** Amazon Rainforest, Brazil\n\n**Roles:**\n- Local Farmer\n- Government Official\n- Conservation Scientist\n\n**Misconception Claim:** Deforestation has minimal impact on global carbon emissions.\n\n**Conflicting Claims:**\n- Farmer: 'Clearing land is necessary for livelihoods; forests regrow naturally.'\n- Official: 'Deforestation rates are decreasing thanks to policies.'\n- Scientist: 'Deforestation contributes significantly to carbon emissions and climate change.'\n\n**Reconciliation Prompt:** How do these perspectives align or conflict with scientific evidence?\n\n**Evidence Contrast:** Review deforestation statistics, carbon emission data, and policy effectiveness.\n\n**Uncertainty Tension Prompt:** What uncertainties exist about deforestation's long-term climate effects?\n"
          },
          "expected_output": "A group summary that:\n- Identifies the misconception claim(s) in the scenario.\n- Explains the conflicting claims and the evidence supporting or refuting them.\n- Demonstrates engagement with productive uncertainty and reconciles the claims with evidence-based reasoning.\n- Responds to facilitator prompts addressing common learner arguments.",
          "facilitator_notes": "During group work, use the discussion prompts to guide exploration of evidence and uncertainty. Address common learner arguments by asking questions such as:\n- If learners accept misconceptions uncritically, ask: 'What evidence supports this claim, and what evidence challenges it?'\n- If groups avoid uncertainty, ask: 'What aspects of the scenario remain unclear or contested?'\nUse timing cues at 10, 20, and 30 minutes to keep groups on track toward preparing a summary."
        },
        {
          "title": "Formative Check: Individual Reflection and Group Debrief",
          "duration_minutes": 15,
          "purpose": "Individually complete a 5-item formative check to reflect on your understanding of climate misconceptions based on group discussions. Do not discuss answers yet; submit your responses for later debrief.",
          "learner_task": "### Task\n- Complete the 5-item formative check on your handout individually.\n- Reflect on your understanding from the group discussions.\n- Do not discuss answers now; submit your responses to the facilitator.",
          "materials": {
            "formative_check": "---\n\n### Formative Check: Climate Misconceptions\n\n**Instructions:**\n- Answer the following questions individually based on your group discussions. Do not check answers yet.\n\n---\n\n1. **Which factor is a primary driver of recent sea level rise?**\n- Natural ocean cycles\n- Melting of polar ice and thermal expansion\n- Increased rainfall\n- Tectonic plate movements\n\n2. **What is a common misconception about renewable energy reliability?**\n- Renewables can never provide 100% energy needs\n- Energy storage and grid management can mitigate intermittency\n- Renewables are always cheaper than fossil fuels\n- Renewables produce no greenhouse gases\n\n3. **How does deforestation affect global carbon emissions?**\n- It reduces carbon emissions by increasing farmland\n- It has no measurable effect\n- It increases carbon emissions by releasing stored carbon\n- It only affects local air quality\n\n4. **Why is it important to consider multiple perspectives in climate debates?**\n- To identify biases and evaluate evidence critically\n- To find the quickest solution\n- To avoid discussing uncertainties\n- To confirm pre-existing beliefs\n\n5. **What does productive uncertainty encourage in scientific discussions?**\n- Ignoring conflicting evidence\n- Accepting all claims as equally valid\n- Exploring evidence to refine understanding\n- Rejecting scientific consensus\n"
          },
          "expected_output": "Completed formative check responses reflecting individual understanding of climate misconceptions and evidence evaluation.",
          "facilitator_notes": "Collect responses without revealing correct answers. After collection, participate in a whole-class debrief led by the facilitator to discuss each question, clarify misconceptions, and highlight evidence-based reasoning. Reflect on uncertainties and how group discussions influenced your answers."
        }
      ],
      "section_id": "learning_activities"
    },
    {
      "heading": "Formative Assessment Check",
      "content": [
        {
          "instructions": "Answer the following questions individually based on your group discussions. Do not check answers yet.",
          "items": [
            {
              "id": "Q1",
              "question": "Which factor is a primary driver of recent sea level rise?",
              "options": [
                "Natural ocean cycles",
                "Melting of polar ice and thermal expansion",
                "Increased rainfall",
                "Tectonic plate movements"
              ]
            },
            {
              "id": "Q2",
              "question": "What is a common misconception about renewable energy reliability?",
              "options": [
                "Renewables can never provide 100% energy needs",
                "Energy storage and grid management can mitigate intermittency",
                "Renewables are always cheaper than fossil fuels",
                "Renewables produce no greenhouse gases"
              ]
            },
            {
              "id": "Q3",
              "question": "How does deforestation affect global carbon emissions?",
              "options": [
                "It reduces carbon emissions by increasing farmland",
                "It has no measurable effect",
                "It increases carbon emissions by releasing stored carbon",
                "It only affects local air quality"
              ]
            },
            {
              "id": "Q4",
              "question": "Why is it important to consider multiple perspectives in climate debates?",
              "options": [
                "To identify biases and evaluate evidence critically",
                "To find the quickest solution",
                "To avoid discussing uncertainties",
                "To confirm pre-existing beliefs"
              ]
            },
            {
              "id": "Q5",
              "question": "What does productive uncertainty encourage in scientific discussions?",
              "options": [
                "Ignoring conflicting evidence",
                "Accepting all claims as equally valid",
                "Exploring evidence to refine understanding",
                "Rejecting scientific consensus"
              ]
            }
          ]
        }
      ],
      "section_id": "assessment_check"
    }
  ],
  "source_artefacts": [
    "learning_activities",
    "activity_materials",
    "assessment_items"
  ],
  "constraints_applied": [
    "Included all learning activities (A1, A2) with full learner-facing content as provided",
    "Excluded answers from formative check as per user request",
    "Included facilitator notes only as secondary content within activities, not as separate section",
    "Preserved original scenario and formative check content without summarization or paraphrasing"
  ],
  "generation_notes": {
    "limitations": [],
    "activities_omitted": [],
    "cognition_composition": {
      "cognitionSectionsPreserved": [
        "overview",
        "learning_activities",
        "assessment_check"
      ],
      "cognitionCompositionParity": true,
      "cognitionActivitySuppressed": false,
      "cognitionAssessmentDominancePrevented": false,
      "cognitionFieldsMerged": 0,
      "duplicateAssessmentRowsRemoved": 0
    },
    "constraints_applied": {
      "0": "Included all learning activities (A1, A2) with full learner-facing content as provided",
      "1": "Excluded answers from formative check as per user request",
      "2": "Included facilitator notes only as secondary content within activities, not as separate section",
      "3": "Preserved original scenario and formative check content without summarization or paraphrasing",
      "feedback_timing": "after_peer_discussion",
      "learner_answer_visibility": "hidden_until_reveal",
      "feedback_display": "none"
    }
  },
  "metadata": {
    "cognition_profile": {
      "active": true,
      "pack_ids": [
        "misconception_repair_pack"
      ],
      "cognition_fields": [
        "misconception_claim",
        "reconciliation_prompt",
        "evidence_contrast",
        "uncertainty_tension_prompt"
      ],
      "cognition_activity_priority": true,
      "cognition_section_required": true
    },
    "feedback_display": "none",
    "learner_answer_visibility": "hidden_until_reveal",
    "feedback_timing": "after_peer_discussion"
  },
  "feedback_display": "none"
}
```

**Composition parity:**

```json
{
  "sectionIds": [
    "overview",
    "learning_activities",
    "assessment_check"
  ],
  "learningActivitiesBeforeAssessment": true,
  "cognitionProfile": {
    "active": true,
    "pack_ids": [
      "misconception_repair_pack"
    ],
    "cognition_fields": [
      "misconception_claim",
      "reconciliation_prompt",
      "evidence_contrast",
      "uncertainty_tension_prompt"
    ],
    "cognition_activity_priority": true,
    "cognition_section_required": true
  },
  "compositionTrace": {
    "cognitionSectionsPreserved": [
      "overview",
      "learning_activities",
      "assessment_check"
    ],
    "cognitionCompositionParity": true,
    "cognitionActivitySuppressed": false,
    "cognitionAssessmentDominancePrevented": false,
    "cognitionFieldsMerged": 0,
    "duplicateAssessmentRowsRemoved": 0
  },
  "semantics": {
    "cognitionCompositionActive": true,
    "cognitionActivityPriority": true,
    "preserveCognitionAdjacency": true,
    "cognitionSectionRequired": true
  }
}
```

## H. Before vs after Sprint 28

| Check | 28-3 | Post-5d |
|-------|------|---------|
| Page section_ids | Often non-canonical | overview, learning_activities, assessment_check |
| Cognition fields in DLA | Usually absent | satisfied=true |
| LA before assessment | Variable | yes |
| Assessment dominance | MCQ-only pages possible | injection + reorder when packs active |

## I. Investigator notes

- Sprint 28 adds **structural** preservation; live LLM compliance with typed fields remains variable.
- Composition pass is deterministic; G outputs still depend on model + prompt adherence.
- Sprint 27 assessment presentation preserved via `applyAssessmentSemanticsToComposedPage` after cognition pass.
