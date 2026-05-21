# P28-01 — live workflow probe (28-3)

**Captured:** 2026-05-21
**Method:** Pack prompt templates + `extractWorkflowBriefExplicitFactors` / heuristics; OpenAI `gpt-4.1-mini` step chain (DLA→GAM→GAI→Design Page).

## A. Exact brief

**Goal:**

> Design a 60-minute seminar on climate misconceptions for undergraduate students. Small groups use rich task cards with authentic scenarios (named places, roles, and conflicting claims), discussion prompts that create productive uncertainty, and facilitator moves that respond to common learner arguments. After group work, students complete a 5-item formative check; do not reveal correct answers on the student handout — the tutor debriefs after discussion. Include contingent facilitator notes (if learners say X, ask Y) and delayed feedback guidance.

**Inputs:** Include facilitator notes with pacing for discussion, scenario prompts, and debrief guidance for the formative check.

**Desired outputs:** Learner handout page plus facilitator session notes.

## B. Resolved factors (E)

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
    "assessment_total_items": 5,
    "topic": "climate misconceptions for undergraduate students",
    "workshop_subject": "climate misconceptions for undergraduate students",
    "materials_required": true
  },
  "resolved": {
    "feedback_timing": "after_peer_discussion",
    "assessment_interaction_mode": "discussion_oriented",
    "learner_answer_visibility": "hidden_until_reveal",
    "include_answers": false,
    "include_feedback_guidance": false,
    "design_feedback_required": true
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

## D. learning_activities (G)

```json
{
  "activities": [
    {
      "activity_id": "A1",
      "title": "Small Group Analysis of Climate Misconception Scenarios",
      "grouping": "small_group",
      "duration_minutes": 45,
      "mapped_learning_outcomes": [
        1,
        2,
        3,
        4
      ],
      "required_materials": [
        {
          "material_id": "MC_TaskCards",
          "type": "task_cards",
          "purpose": "Provide authentic climate-related scenarios with named places, roles, and conflicting claims to stimulate discussion",
          "specification": "Each card includes a brief scenario describing a climate misconception claim, at least two conflicting perspectives represented by named roles, and 3-4 discussion prompts designed to create productive uncertainty."
        }
      ],
      "learner_task": "### Small Group Task\n- Read your assigned scenario card carefully.\n- Discuss the conflicting claims presented, considering evidence and scientific principles.\n- Use the discussion prompts on the card to guide your conversation and challenge assumptions.\n- Prepare a short summary (3-4 sentences) of your group's evaluation of the claims, highlighting which misconceptions you identified and why.",
      "expected_output": "A concise summary statement that:\n- Identifies at least one common climate misconception in the scenario.\n- Explains the reasoning behind evaluating the claims as valid or invalid using evidence.\n- Demonstrates engagement with conflicting perspectives and productive uncertainty.",
      "failure_mode": "Learners may accept claims at face value without critical evaluation or fail to engage with conflicting perspectives.",
      "facilitator_moves": "Pacing:\n- 5 minutes: Introduce task and distribute cards.\n- 30 minutes: Circulate among groups, listening and prompting deeper reasoning.\n- 10 minutes: Groups prepare summaries.\n\nIf learners accept misconceptions uncritically, ask:\n- \"What evidence supports or contradicts this claim?\"\n- \"How might different roles in this scenario view the evidence differently?\"\n- \"What scientific principles can help us evaluate this claim?\"\n\nIf discussion stalls, prompt with:\n- \"What questions remain uncertain or unclear?\"\n- \"Can you think of alternative explanations?\""
    },
    {
      "activity_id": "A2",
      "title": "Formative Check: Individual Reflection and Peer Discussion",
      "grouping": "individual_then_small_group",
      "duration_minutes": 15,
      "mapped_learning_outcomes": [
        5
      ],
      "required_materials": [
        {
          "material_id": "MC_FormativeCheck",
          "type": "prompt_set",
          "purpose": "Provide a 5-item formative assessment with questions addressing common climate misconceptions and reasoning challenges",
          "specification": "Questions are multiple-choice or short-answer format designed to provoke reflection and discussion; answers are not revealed on the handout."
        },
        {
          "material_id": "MC_Handout",
          "type": "text",
          "purpose": "Handout for learners to record their answers privately before group discussion",
          "specification": "Includes only questions without answers or feedback."
        }
      ],
      "learner_task": "### Individual Task\n- Complete the 5-item formative check on your handout, answering each question based on your understanding.\n\n### Peer Discussion Task\n- Form small groups and share your answers.\n- Discuss any differences in responses and reasoning.\n- Identify questions that caused uncertainty or disagreement.",
      "expected_output": "Individual recorded answers to the 5 formative questions.\nGroup discussion notes or verbal consensus on areas of uncertainty or disagreement.",
      "failure_mode": "Learners may guess answers without reflection or avoid discussing differing views in groups.",
      "facilitator_moves": "Pacing:\n- 5 minutes: Individual completion.\n- 10 minutes: Small group discussion.\n\nIf learners guess or rush, ask:\n- \"What made you choose that answer?\"\n- \"Can you explain your reasoning?\"\n\nIf group discussion is shallow or dominated by one voice, prompt:\n- \"Does anyone have a different perspective?\"\n- \"What evidence supports or challenges that answer?\""
    }
  ],
  "outcome_alignment": {
    "1": "Activities engage learners in identifying misconceptions and reasoning with evidence.",
    "2": "Scenario analysis requires evaluation of conflicting claims in authentic contexts.",
    "3": "Small group discussions foster collaborative critical thinking and productive uncertainty.",
    "4": "Learners apply scientific principles to assess claims during scenario work and formative check.",
    "5": "Formative check and peer discussion promote reflection on personal understanding."
  },
  "delivery_notes": {
    "session_duration": 60,
    "overall_pacing": "45 minutes for scenario-based group work followed by 15 minutes for formative check and peer discussion.",
    "facilitator_role": "Active monitoring and questioning to deepen reasoning, manage group dynamics, and scaffold critical evaluation.",
    "feedback_timing": "Do not reveal correct answers on handouts; provide debrief after peer discussion to maximize reflection and learning.",
    "materials_preparation": "Prepare scenario task cards with named places, roles, conflicting claims, and discussion prompts; prepare formative check handout with 5 questions without answers."
  }
}
```

## E. activity_materials (G)

```
Activity: Small Group Analysis of Climate Misconception Scenarios  
Activity ID: A1  
Mapped outcomes: 1, 2, 3, 4  

Material: MC_TaskCards (task_cards)  
Purpose: Provide authentic climate-related scenarios with named places, roles, and conflicting claims to stimulate discussion  
Content:  

---

### Scenario Card 1: Coastal Town Debate in Clearwater Bay

**Context:** Clearwater Bay is a small coastal town experiencing more frequent flooding. The town council is debating how to respond.

**Roles and Claims:**  
- **Mayor Lopez:** "The flooding is caused by rising sea levels due to climate change. We need to invest in long-term coastal defenses."  
- **Local Fisherman Raj:** "The flooding is just part of natural weather cycles. Climate change is exaggerated, and building defenses is a waste of money."  
- **Environmental Scientist Dr. Kim:** "Scientific data shows sea levels have risen steadily in this region over the past 50 years, increasing flood risks."  

**Discussion Prompts:**  
- What evidence supports or contradicts the claim that flooding is caused by climate change?  
- How might the different roles’ perspectives influence their interpretation of the flooding causes?  
- What scientific principles about sea level rise and climate change are relevant here?  
- What uncertainties or alternative explanations might exist for the flooding?  

---

### Scenario Card 2: Energy Policy Conflict in Greenfield City

**Context:** Greenfield City is considering whether to expand its coal power plant or invest in renewable energy.

**Roles and Claims:**  
- **City Energy Director Ms. Patel:** "Coal is reliable and cheap. Renewables are too expensive and intermittent to meet our energy needs."  
- **Renewable Advocate Mr. Chen:** "Renewable energy costs have dropped dramatically, and investing now will reduce greenhouse gas emissions."  
- **Economist Dr. Owens:** "While renewables are growing, coal still dominates energy supply. Transition costs and infrastructure challenges must be considered."  

**Discussion Prompts:**  
- What misconceptions about renewable energy and coal power are evident?  
- How do economic and environmental priorities conflict in this scenario?  
- What evidence could help evaluate the claims about cost and reliability?  
- How might scientific data about emissions and energy trends inform the debate?  

---

### Scenario Card 3: Agricultural Practices in Sunnyvale County

**Context:** Farmers in Sunnyvale County are discussing how climate change affects crop yields.

**Roles and Claims:**  
- **Farmer Garcia:** "Droughts have always happened here; climate change isn’t making it worse."  
- **Agricultural Scientist Dr. Singh:** "Research shows climate change is increasing drought frequency and intensity, impacting crop productivity."  
- **Local Journalist Ms. Torres:** "Some farmers say climate change is a hoax, but others report noticeable changes in weather patterns."  

**Discussion Prompts:**  
- What are common misconceptions about drought and climate change in this scenario?  
- How can scientific research help clarify the impact of climate change on agriculture?  
- Why might different stakeholders have conflicting views?  
- What questions remain uncertain or require further investigation?  

---

### Scenario Card 4: Urban Heat in Metroville

**Context:** Metroville is experiencing hotter summers, and city planners debate causes and solutions.

**Roles and Claims:**  
- **City Planner Mr. Johnson:** "Urban heat is mainly caused by the city’s concrete and asphalt, not global climate change."  
- **Climate Scientist Dr. Lee:** "Urban heat islands contribute locally, but global warming also increases baseline temperatures."  
- **Community Organizer Ms. Davis:** "Residents are suffering from heatwaves, but some deny climate change is real or relevant to the city."  

**Discussion Prompts:**  
- How do local and global factors interact in causing urban heat?  
- What misconceptions about urban heat and climate change appear here?  
- How can scientific principles about heat absorption and atmospheric changes help evaluate claims?  
- What strategies might address both local and global causes?  

---

**Instructions for Learners:**  
- Read your assigned scenario carefully.  
- Discuss the conflicting claims presented by the named roles, using the discussion prompts to guide your conversation.  
- Consider the evidence, scientific principles, and uncertainties involved.  
- Prepare a 3-4 sentence summary evaluating the claims, identifying misconceptions, and explaining your reasoning.  

Facilitator use:  
Introduce this material at the start of the 45-minute group work segment. Distribute one scenario card per group. Use the discussion prompts on the cards to encourage critical evaluation and productive uncertainty. Circulate to listen and ask probing questions such as:  
- "What evidence supports or contradicts this claim?"  
- "How might different roles view the evidence differently?"  
- "What scientific principles can help evaluate this claim?"  
- "What questions remain uncertain or unclear?"  
If discussion stalls or misconceptions go unchallenged, prompt groups with alternative explanations or ask them to consider different perspectives. Allocate approximately 5 minutes for introduction, 30 minutes for group discussion, and 10 minutes for summary preparation.  

---

Activity: Formative Check: Individual Reflection and Peer Discussion  
Activity ID: A2  
Mapped outcomes: 5  

Material: MC_FormativeCheck (prompt_set)  
Purpose: Provide a 5-item formative assessment with questions addressing common climate misconceptions and reasoning challenges  
Content:  

---

### Climate Misconceptions Formative Check

**Instructions:**  
- Complete these questions individually based on your current understanding.  
- Do not share your answers yet.  

1. **True or False:** The recent increase in global average temperature is caused only by natural climate cycles, not human activities.  

2. **Multiple Choice:** Which of the following best explains why renewable energy sources like solar and wind are considered important in fighting climate change?  
  a) They produce energy without emitting greenhouse gases.  
  b) They are always cheaper than fossil fuels.  
  c) They require no maintenance.  
  d) They increase carbon dioxide levels.  

3. **Short Answer:** Explain one common misconception about sea level rise and provide a brief scientific explanation to clarify it.  

4. **Multiple Choice:** Urban heat islands cause cities to be warmer than surrounding rural areas because:  
  a) Cities have more trees that trap heat.  
  b) Concrete and asphalt absorb and retain heat.  
  c) Cities have less sunlight than rural areas.  
  d) Air pollution cools the city.  

5. **True or False:** Climate change will affect all regions and communities equally, with the same impacts everywhere.  

---

Facilitator use:  
Distribute this formative check handout after the scenario group work. Allow 5 minutes for individual completion. Then organize learners into small groups for 10 minutes of peer discussion sharing answers and reasoning. During discussion, encourage learners to explain their thinking and consider alternative views by asking:  
- "What made you choose that answer?"  
- "Can you explain your reasoning?"  
- "Does anyone have a different perspective?"  
- "What evidence supports or challenges that answer?"  
Do not reveal correct answers during this stage. Use the discussion to deepen reflection and identify areas of uncertainty before the final debrief.  

---

Material: MC_Handout (text)  
Purpose: Handout for learners to record their answers privately before group discussion  
Content:  

---

### Climate Misconceptions Formative Check  
*(Record your answers below)*

1. True or False: The recent increase in global average temperature is caused only by natural climate cycles, not human activities.  
Answer: _________________
```

## F. assessment_items (G)

```json
{
  "assessment_items": [
    {
      "id": "Q1",
      "question": "A local farmer in Iowa claims that recent cold winters prove that global warming is not happening. How would you evaluate this claim?",
      "type": "discussion_oriented",
      "misconception_targeted": "Weather variability disproves climate change",
      "prompts": [
        "What is the difference between weather and climate?",
        "Can short-term cold events negate long-term warming trends?"
      ]
    },
    {
      "id": "Q2",
      "question": "In a coastal town, some residents argue that rising sea levels are exaggerated because they haven't observed flooding in their area. How can you assess the validity of this perspective?",
      "type": "discussion_oriented",
      "misconception_targeted": "Local observations alone reflect global climate trends",
      "prompts": [
        "How do local effects relate to global climate patterns?",
        "What scientific data would help clarify sea level rise impacts?"
      ]
    },
    {
      "id": "Q3",
      "question": "A student says that because carbon dioxide is a natural gas, human emissions cannot cause climate change. How would you respond?",
      "type": "discussion_oriented",
      "misconception_targeted": "Natural presence of CO2 means human emissions are insignificant",
      "prompts": [
        "What distinguishes natural CO2 from anthropogenic CO2?",
        "How do increased CO2 levels affect the greenhouse effect?"
      ]
    },
    {
      "id": "Q4",
      "question": "In a debate, a participant claims that climate change models are unreliable because they can't predict exact future temperatures. How can this claim be critically analyzed?",
      "type": "discussion_oriented",
      "misconception_targeted": "Climate models are useless due to prediction uncertainty",
      "prompts": [
        "What are the purposes and limitations of climate models?",
        "How do scientists use models despite uncertainties?"
      ]
    },
    {
      "id": "Q5",
      "question": "A community leader argues that planting more trees alone can solve climate change. What are the strengths and limitations of this claim?",
      "type": "discussion_oriented",
      "misconception_targeted": "Single solutions like tree planting can fully solve climate change",
      "prompts": [
        "How do trees impact carbon levels and climate?",
        "Why might multiple strategies be necessary to address climate change?"
      ]
    }
  ]
}
```

## G. Composed page (C)

```json
{
  "artifact_type": "page",
  "title": "Climate Misconceptions Seminar: Learner Handout",
  "audience": "Undergraduate Students",
  "page_profile": "learner",
  "sections": [
    {
      "heading": "Introduction and Learning Purpose",
      "content": "This seminar will help you explore common misconceptions about climate change through authentic scenarios and collaborative discussion. You will analyze conflicting claims made by different stakeholders, evaluate evidence and scientific principles, and reflect on your understanding through a formative check. The goal is to deepen your critical thinking about climate issues and improve your ability to assess climate-related information."
    },
    {
      "heading": "Learning Activities",
      "content": [
        {
          "title": "Small Group Analysis of Climate Misconception Scenarios",
          "duration_minutes": 45,
          "purpose": "Work in small groups to analyze a real-world climate-related scenario. You will encounter conflicting claims from named roles and use discussion prompts to guide your evaluation. This activity encourages you to identify misconceptions, consider evidence, and engage with uncertainty.",
          "learner_task": "### Small Group Task\n- Read your assigned scenario card carefully.\n- Discuss the conflicting claims presented, considering evidence and scientific principles.\n- Use the discussion prompts on the card to guide your conversation and challenge assumptions.\n- Prepare a short summary (3-4 sentences) of your group's evaluation of the claims, highlighting which misconceptions you identified and why.",
          "materials": {
            "task_cards": "\n---\n\n### Scenario Card 1: Coastal Town Debate in Clearwater Bay\n\n**Context:** Clearwater Bay is a small coastal town experiencing more frequent flooding. The town council is debating how to respond.\n\n**Roles and Claims:**  \n- **Mayor Lopez:** \"The flooding is caused by rising sea levels due to climate change. We need to invest in long-term coastal defenses.\"  \n- **Local Fisherman Raj:** \"The flooding is just part of natural weather cycles. Climate change is exaggerated, and building defenses is a waste of money.\"  \n- **Environmental Scientist Dr. Kim:** \"Scientific data shows sea levels have risen steadily in this region over the past 50 years, increasing flood risks.\"  \n\n**Discussion Prompts:**  \n- What evidence supports or contradicts the claim that flooding is caused by climate change?  \n- How might the different roles’ perspectives influence their interpretation of the flooding causes?  \n- What scientific principles about sea level rise and climate change are relevant here?  \n- What uncertainties or alternative explanations might exist for the flooding?  \n\n---\n\n### Scenario Card 2: Energy Policy Conflict in Greenfield City\n\n**Context:** Greenfield City is considering whether to expand its coal power plant or invest in renewable energy.\n\n**Roles and Claims:**  \n- **City Energy Director Ms. Patel:** \"Coal is reliable and cheap. Renewables are too expensive and intermittent to meet our energy needs.\"  \n- **Renewable Advocate Mr. Chen:** \"Renewable energy costs have dropped dramatically, and investing now will reduce greenhouse gas emissions.\"  \n- **Economist Dr. Owens:** \"While renewables are growing, coal still dominates energy supply. Transition costs and infrastructure challenges must be considered.\"  \n\n**Discussion Prompts:**  \n- What misconceptions about renewable energy and coal power are evident?  \n- How do economic and environmental priorities conflict in this scenario?  \n- What evidence could help evaluate the claims about cost and reliability?  \n- How might scientific data about emissions and energy trends inform the debate?  \n\n---\n\n### Scenario Card 3: Agricultural Practices in Sunnyvale County\n\n**Context:** Farmers in Sunnyvale County are discussing how climate change affects crop yields.\n\n**Roles and Claims:**  \n- **Farmer Garcia:** \"Droughts have always happened here; climate change isn’t making it worse.\"  \n- **Agricultural Scientist Dr. Singh:** \"Research shows climate change is increasing drought frequency and intensity, impacting crop productivity.\"  \n- **Local Journalist Ms. Torres:** \"Some farmers say climate change is a hoax, but others report noticeable changes in weather patterns.\"  \n\n**Discussion Prompts:**  \n- What are common misconceptions about drought and climate change in this scenario?  \n- How can scientific research help clarify the impact of climate change on agriculture?  \n- Why might different stakeholders have conflicting views?  \n- What questions remain uncertain or require further investigation?  \n\n---\n\n### Scenario Card 4: Urban Heat in Metroville\n\n**Context:** Metroville is experiencing hotter summers, and city planners debate causes and solutions.\n\n**Roles and Claims:**  \n- **City Planner Mr. Johnson:** \"Urban heat is mainly caused by the city’s concrete and asphalt, not global climate change.\"  \n- **Climate Scientist Dr. Lee:** \"Urban heat islands contribute locally, but global warming also increases baseline temperatures.\"  \n- **Community Organizer Ms. Davis:** \"Residents are suffering from heatwaves, but some deny climate change is real or relevant to the city.\"  \n\n**Discussion Prompts:**  \n- How do local and global factors interact in causing urban heat?  \n- What misconceptions about urban heat and climate change appear here?  \n- How can scientific principles about heat absorption and atmospheric changes help evaluate claims?  \n- What strategies might address both local and global causes?  \n\n---\n\n**Instructions for Learners:**  \n- Read your assigned scenario carefully.  \n- Discuss the conflicting claims presented by the named roles, using the discussion prompts to guide your conversation.  \n- Consider the evidence, scientific principles, and uncertainties involved.  \n- Prepare a 3-4 sentence summary evaluating the claims, identifying misconceptions, and explaining your reasoning."
          },
          "expected_output": "A concise summary statement that:\n- Identifies at least one common climate misconception in the scenario.\n- Explains the reasoning behind evaluating the claims as valid or invalid using evidence.\n- Demonstrates engagement with conflicting perspectives and productive uncertainty.",
          "facilitator_notes": "Pacing:\n- 5 minutes: Introduce task and distribute cards.\n- 30 minutes: Circulate among groups, listening and prompting deeper reasoning.\n- 10 minutes: Groups prepare summaries.\n\nIf learners accept misconceptions uncritically, ask:\n- \"What evidence supports or contradicts this claim?\"\n- \"How might different roles in this scenario view the evidence differently?\"\n- \"What scientific principles can help us evaluate this claim?\"\n\nIf discussion stalls, prompt with:\n- \"What questions remain uncertain or unclear?\"\n- \"Can you think of alternative explanations?\""
        },
        {
          "title": "Formative Check: Individual Reflection and Peer Discussion",
          "duration_minutes": 15,
          "purpose": "Reflect individually on your understanding of climate misconceptions through a 5-item formative check, then discuss your answers and reasoning with peers to deepen reflection and identify areas of uncertainty.",
          "learner_task": "### Individual Task\n- Complete the 5-item formative check on your handout, answering each question based on your understanding.\n\n### Peer Discussion Task\n- Form small groups and share your answers.\n- Discuss any differences in responses and reasoning.\n- Identify questions that caused uncertainty or disagreement.",
          "materials": {
            "formative_check_handout": "\n---\n\n### Climate Misconceptions Formative Check  \n*(Record your answers below)*\n\n1. True or False: The recent increase in global average temperature is caused only by natural climate cycles, not human activities.  \nAnswer: ____________________________  \n\n2. Multiple Choice: Which of the following best explains why renewable energy sources like solar and wind are considered important in fighting climate change?  \na) They produce energy without emitting greenhouse gases.  \nb) They are always cheaper than fossil fuels.  \nc) They require no maintenance.  \nd) They increase carbon dioxide levels.  \nAnswer: ____________________________  \n\n3. Short Answer: Explain one common misconception about sea level rise and provide a brief scientific explanation to clarify it.  \nAnswer: ____________________________________________________________________  \n____________________________________________________________________________  \n\n4. Multiple Choice: Urban heat islands cause cities to be warmer than surrounding rural areas because:  \na) Cities have more trees that trap heat.  \nb) Concrete and asphalt absorb and retain heat.  \nc) Cities have less sunlight than rural areas.  \nd) Air pollution cools the city.  \nAnswer: ____________________________  \n\n5. True or False: Climate change will affect all regions and communities equally, with the same impacts everywhere.  \nAnswer: ____________________________  \n\n---"
          },
          "expected_output": "Individual recorded answers to the 5 formative questions.\nGroup discussion notes or verbal consensus on areas of uncertainty or disagreement.",
          "facilitator_notes": "Pacing:\n- 5 minutes: Individual completion.\n- 10 minutes: Small group discussion.\n\nIf learners guess or rush, ask:\n- \"What made you choose that answer?\"\n- \"Can you explain your reasoning?\"\n\nIf group discussion is shallow or dominated by one voice, prompt:\n- \"Does anyone have a different perspective?\"\n- \"What evidence supports or challenges that answer?\""
        }
      ]
    },
    {
      "heading": "Formative Assessment Check",
      "content": {
        "items": [
          {
            "id": "Q1",
            "question": "True or False: The recent increase in global average temperature is caused only by natural climate cycles, not human activities.",
            "type": "true_false"
          },
          {
            "id": "Q2",
            "question": "Which of the following best explains why renewable energy sources like solar and wind are considered important in fighting climate change?",
            "type": "multiple_choice",
            "options": [
              "a) They produce energy without emitting greenhouse gases.",
              "b) They are always cheaper than fossil fuels.",
              "c) They require no maintenance.",
              "d) They increase carbon dioxide levels."
            ]
          },
          {
            "id": "Q3",
            "question": "Explain one common misconception about sea level rise and provide a brief scientific explanation to clarify it.",
            "type": "short_answer"
          },
          {
            "id": "Q4",
            "question": "Urban heat islands cause cities to be warmer than surrounding rural areas because:",
            "type": "multiple_choice",
            "options": [
              "a) Cities have more trees that trap heat.",
              "b) Concrete and asphalt absorb and retain heat.",
              "c) Cities have less sunlight than rural areas.",
              "d) Air pollution cools the city."
            ]
          },
          {
            "id": "Q5",
            "question": "True or False: Climate change will affect all regions and communities equally, with the same impacts everywhere.",
            "type": "true_false"
          }
        ]
      }
    }
  ],
  "source_artefacts": [
    "MC_TaskCards",
    "MC_FormativeCheck",
    "MC_Handout"
  ],
  "constraints_applied": [
    "Included facilitator notes with pacing and prompts as embedded in learning activities",
    "Excluded answers from learner handout and formative check as per include_answers=false",
    "Fe
```

**Section IDs:** , , 

## I. Render (R)

**Not captured** in 28-3 runner (composition JSON only). Use PRISM run mode + `buildUtilityStructuredHtmlForTest` for HTML.

## J. Rubric (live heuristic)

```json
{
  "D1": 1,
  "D2": 1,
  "D3": 1,
  "D4": 1,
  "D5": 1,
  "D6": 1,
  "D7": 0,
  "D8": 1,
  "D9": 0,
  "D10": 1,
  "mean": 0.8,
  "pageSections": [
    null,
    null,
    null
  ],
  "assessmentItemCountOnPage": 0,
  "facilitator_moves_sample": "Pacing:\n- 5 minutes: Introduce task and distribute cards.\n- 30 minutes: Circulate among groups, listening and prompting deeper reasoning.\n- 10 minutes: Groups prepare summaries.\n\nIf learners accept misconceptions uncritically, ask:\n- \"What evidence supports or contradicts this claim?\"\n- \"How might different roles in this scenario view the evidence differently?\"\n- \"What scientific principles can help us evaluate this claim?\"\n\nIf discussion stalls, prompt with:\n- \"What questions remain uncertain o"
}
```

## Investigator interpretation

**Cosmetic vs structural (28-3):** **Mostly richer prose inside the same DLA/GAM field types** — not new typed cognition objects. Contingent `facilitator_moves` and named-place **task_cards** are genuine pedagogic gains vs the climate **fixture** (claim bullets, D6=0).

**E gaps persist:** `feedback_timing: after_peer_discussion` (brief asks tutor debrief); `page_profile: facilitator`; no `misconception_assessment_link` despite explicit misconception framing.

**C:** Learning Activities + Formative Assessment present with embedded materials — **but sections omit canonical `section_id`** (Design Page contract drift; may weaken R).

**H6–H12 touchpoints:** H7 **weakened** (live G shows cognition when brief is explicit); H11 **Partial** (rhetoric can deliver if brief forces it); H10/H12 **unchanged** (factors still absent; page still assessment-shaped in places).

## J. Rubric (investigator-scored — live)

| Dim | Score | Note |
|-----|-------|------|
| D1 | **2** | Named places, roles, stakes (Clearwater Bay, etc.) |
| D2 | **2** | Deliverables per activity |
| D3 | **2** | Uncertainty prompts in cards |
| D4 | **2** | Discussion-oriented prompts |
| D5 | **2** | Misconception claims + repair prompts |
| D6 | **2** | If-then facilitator_moves on A1/A2 |
| D7 | **1** | failure_mode present; thin anticipated paths |
| D8 | **1** | Two blocks; not full activate→reconcile arc |
| D9 | **0** | Seminar shape, not predict→revise |
| D10 | **2** | Activities ≥ assessment |
| **Mean** | **~1.7** | vs Case 1 fixture **1.2** |
