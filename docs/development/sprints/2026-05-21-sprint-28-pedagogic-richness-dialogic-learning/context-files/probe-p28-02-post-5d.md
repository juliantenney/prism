# P28-02 — post-5d stabilisation probe

**Captured:** 2026-05-21
**Method:** Sprint 28-5a–5d runtime (packs, topology, DLA contracts, composition parity) + OpenAI `gpt-4.1-mini` step chain with cognition scaffold and composition post-pass.

## A. Brief (unchanged from 28-3)

> Create a peer instruction session on stoichiometry: students predict answers individually, discuss in pairs with structured prompts, then revise predictions. Include 6 MCQs and reflection prompts. Confirm solutions only after pair discussion. Emphasise dialogic comparison, not silent voting.

## B. E/O + cognition architecture (28-5a/b)

```json
{
  "explicit": {
    "desired_outputs": "Learner-facing session page with activities and MCQ check.",
    "input_strategy": "generate_from_topic",
    "session_materials": [
      "page"
    ],
    "assessment_required": true,
    "activities_required": true,
    "page_profile": "learner",
    "assessment_type": "mcq",
    "feedback_timing": "after_peer_discussion",
    "assessment_interaction_mode": "discussion_oriented",
    "reasoning_revision_required": true,
    "assessment_total_items": 6,
    "topic": "stoichiometry: students predict answers individually",
    "workshop_subject": "stoichiometry: students predict answers individually",
    "materials_required": true
  },
  "resolved": {
    "topic": "stoichiometry: students predict answers individually",
    "design_scope": "session",
    "delivery_pattern": "face_to_face",
    "input_strategy": "generate_from_topic",
    "session_materials": [
      "page"
    ],
    "page_profile": "learner",
    "assessment_required": true,
    "learning_environments": [
      "classroom"
    ],
    "assessment_strategy": "none",
    "feedback_timing": "after_peer_discussion",
    "assessment_interaction_mode": "discussion_oriented",
    "learner_answer_visibility": "show_answer_grid_end",
    "peer_instruction_phase": "none",
    "misconception_assessment_link": false,
    "design_feedback_required": true,
    "cognitive_engagement_required": false,
    "reasoning_revision_required": true,
    "misconception_reconciliation_required": false,
    "adaptive_scaffolding_required": false,
    "productive_uncertainty_required": false,
    "assessment_type": "mcq",
    "assessment_total_items": 6,
    "activity_pattern_mix": "balanced",
    "sequencing_granularity": "standard",
    "tone_style": "academic",
    "depth_level": "mixed",
    "include_examples": true,
    "include_practice_tasks": false,
    "compact_vs_detailed": "standard"
  },
  "cognition_packs": [
    "peer_instruction_pack"
  ],
  "cognition_contract": {
    "active": true,
    "packIds": [
      "peer_instruction_pack"
    ],
    "dlaFields": [
      {
        "id": "reasoning_revision_prompt",
        "packId": "peer_instruction_pack",
        "gamLabel": "Reasoning revision",
        "arrayOrString": false
      },
      {
        "id": "initial_position_prompt",
        "packId": "peer_instruction_pack",
        "gamLabel": "Initial position",
        "arrayOrString": false
      },
      {
        "id": "revision_trigger",
        "packId": "peer_instruction_pack",
        "gamLabel": "Revision trigger",
        "arrayOrString": false
      }
    ],
    "dlaFieldIds": [
      "reasoning_revision_prompt",
      "initial_position_prompt",
      "revision_trigger"
    ],
    "gamSections": [
      "Reasoning revision",
      "Initial position",
      "Revision trigger"
    ],
    "gamSectionLabels": [
      "Reasoning revision",
      "Initial position",
      "Revision trigger"
    ]
  },
  "orchestration": {
    "cognitionTopologyRequired": true,
    "preserveLearningActivityChain": true,
    "cognitionAwareAssessmentFlow": true,
    "preservedCognitionStages": [
      "Define Learning Outcomes",
      "Design Learning Activities",
      "Generate Activity Materials"
    ],
    "cognitionPruningPrevented": []
  },
  "presentation": {
    "hasSemanticPresentation": true,
    "learnerAnswerVisibility": "show_answer_grid_end",
    "feedbackTiming": "after_peer_discussion",
    "includeAnswers": true,
    "feedbackDisplay": "answer_grid_end"
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
      "title": "Individual Prediction of Stoichiometry MCQs",
      "grouping": "individual",
      "duration_minutes": 20,
      "mapped_learning_outcomes": [
        "LO1"
      ],
      "required_materials": [
        {
          "material_id": "M1",
          "type": "task_cards",
          "purpose": "Present 6 stoichiometry multiple-choice questions for individual prediction",
          "specification": "Each card contains one MCQ with 4 options; questions cover mole concept, limiting reagent, mass calculations, and yield."
        }
      ],
      "learner_task": "## Individual Prediction\n- Read each stoichiometry MCQ carefully.\n- Predict the correct answer individually without discussion.\n- Mark your initial choice on your answer sheet.",
      "expected_output": "A completed answer sheet with initial predictions for all 6 MCQs.",
      "failure_mode": "Learners guess answers without reading carefully or skip questions.",
      "facilitator_moves": "- Emphasize importance of individual effort before discussion.\n- Prompt learners to carefully read each question.\n- Monitor and encourage completion of all questions.",
      "reasoning_revision_prompt": "What is your reasoning behind your initial answer? Write a brief explanation.",
      "initial_position_prompt": "Record your first choice for each question before discussing with a peer.",
      "revision_trigger": "Consider if your reasoning is clear and if you are confident before peer discussion."
    },
    {
      "activity_id": "A2",
      "title": "Pair Discussion and Reasoning Comparison",
      "grouping": "pair",
      "duration_minutes": 30,
      "mapped_learning_outcomes": [
        "LO2",
        "LO5"
      ],
      "required_materials": [
        {
          "material_id": "M2",
          "type": "prompt_set",
          "purpose": "Structured discussion prompts to guide peer comparison of reasoning",
          "specification": "Prompts include: 'Explain your reasoning for each answer', 'Ask your partner to explain theirs', 'Identify any differences in approach', 'Discuss which reasoning seems more valid and why'."
        },
        {
          "material_id": "M1",
          "type": "task_cards",
          "purpose": "Reference for the 6 stoichiometry MCQs during discussion",
          "specification": "Same MCQs as in activity A1 for joint reference."
        }
      ],
      "learner_task": "## Pair Discussion\n- Share your initial answers and reasoning with your partner.\n- Use the structured prompts to guide your discussion.\n- Compare your reasoning and identify any differences.\n- Decide if you want to revise your initial answers based on your partner's input.",
      "expected_output": "A jointly discussed set of reasoning notes and a decision on whether to revise each answer.",
      "failure_mode": "Pairs do not engage in structured discussion or silently vote without reasoning exchange.",
      "facilitator_moves": "- Remind pairs to use the prompts and focus on reasoning comparison.\n- Observe and gently intervene if discussion is superficial or silent.\n- Encourage explanation and questioning between partners.",
      "reasoning_revision_prompt": "How has your partner's reasoning influenced your understanding of each question?",
      "initial_position_prompt": "Recall your initial answer and reasoning before discussion.",
      "revision_trigger": "If your partner’s reasoning reveals gaps or alternative valid approaches, consider revising your answer."
    },
    {
      "activity_id": "A3",
      "title": "Revision of Predictions Post-Peer Discussion",
      "grouping": "individual",
      "duration_minutes": 15,
      "mapped_learning_outcomes": [
        "LO3",
        "LO4"
      ],
      "required_materials": [
        {
          "material_id": "M3",
          "type": "template",
          "purpose": "Answer revision sheet for learners to record final answers and reflections",
          "specification": "Sheet includes space for each MCQ: initial answer, revised answer, reason for revision or confirmation."
        }
      ],
      "learner_task": "## Revise Your Answers\n- Reflect on the discussion with your partner.\n- For each MCQ, decide whether to keep or change your initial answer.\n- Record your final answer and briefly explain your reasoning or revision decision.",
      "expected_output": "Completed revision sheet with final answers and reasoning reflections for all 6 MCQs.",
      "failure_mode": "Learners revert to initial answers without reflection or change answers arbitrarily without reasoning.",
      "facilitator_moves": "- Encourage thoughtful reflection on the discussion.\n- Prompt learners to justify any changes or confirmations.\n- Provide support for clarifying misunderstandings if needed.",
      "reasoning_revision_prompt": "Explain how your reasoning has changed or been confirmed after discussion.",
      "initial_position_prompt": "Recall your initial answer and reasoning before discussion.",
      "revision_trigger": "Use insights from peer discussion to guide your final answer choice."
    },
    {
      "activity_id": "A4",
      "title": "Whole-Class Review and Reflection",
      "grouping": "whole_group",
      "duration_minutes": 25,
      "mapped_learning_outcomes": [
        "LO4",
        "LO5"
      ],
      "required_materials": [
        {
          "material_id": "M4",
          "type": "sample_output",
          "purpose": "Answer grid showing correct answers and common reasoning patterns",
          "specification": "Includes correct MCQ answers, explanations, and summaries of common misconceptions."
        },
        {
          "material_id": "M5",
          "type": "prompt_set",
          "purpose": "Reflection prompts for whole-class discussion",
          "specification": "Prompts include: 'What reasoning helped you revise your answers?', 'Which concepts remain unclear?', 'How did peer discussion improve your understanding?'"
        }
      ],
      "learner_task": "## Class Review and Reflection\n- Review the correct answers and explanations presented.\n- Reflect on your own and your partner’s reasoning and revisions.\n- Participate in the class discussion guided by reflection prompts.",
      "expected_output": "Engaged participation in discussion and verbal or written reflections on reasoning and learning gains.",
      "failure_mode": "Learners disengage or focus on answer correctness rather than reasoning and reflection.",
      "facilitator_moves": "- Facilitate dialogic discussion emphasizing reasoning and conceptual understanding.\n- Highlight examples of effective reasoning and revisions.\n- Address any persistent misconceptions or confusion.",
      "reasoning_revision_prompt": "How did your reasoning evolve through the session, and what influenced those changes?",
      "initial_position_prompt": "Recall your initial and revised answers and reasoning.",
      "revision_trigger": "Reflect on the value of peer discussion and feedback in improving your understanding."
    }
  ],
  "outcome_alignment": {
    "LO1": [
      "A1"
    ],
    "LO2": [
      "A2"
    ],
    "LO3": [
      "A3"
    ],
    "LO4": [
      "A3",
      "A4"
    ],
    "LO5": [
      "A2",
      "A4"
    ]
  },
  "delivery_notes": "The session is designed for a 90-minute face-to-face lab classroom environment. Activities progress from individual prediction to pair discussion, individual revision, and whole-class reflection. Feedback on correct answers is withheld until after peer discussion to encourage dialogic comparison rather than silent voting. Facilitators should actively monitor discussions to ensure engagement with reasoning and guide reflection. Materials include MCQ task cards, structured prompts for discussion and reflection, and revision templates to capture learner reasoning and changes."
}
```

**DLA contract audit:**

```json
{
  "required": [
    "reasoning_revision_prompt",
    "initial_position_prompt",
    "revision_trigger"
  ],
  "generated": [
    "reasoning_revision_prompt",
    "initial_position_prompt",
    "revision_trigger"
  ],
  "missing": [],
  "satisfied": true
}
```

## E. activity_materials (G)

```
Activity: Individual Prediction of Stoichiometry MCQs  
Activity ID: A1  
Mapped outcomes: LO1  

Material: M1 (task_cards)  
Purpose: Present 6 stoichiometry multiple-choice questions for individual prediction  
Content:  

---

### Stoichiometry MCQ 1: Mole Concept  
**Question:**  
How many moles are present in 22 grams of carbon dioxide (CO₂)? (Atomic masses: C = 12 g/mol, O = 16 g/mol)  

- A) 0.5 moles  
- B) 1 mole  
- C) 2 moles  
- D) 4 moles  

---

### Stoichiometry MCQ 2: Limiting Reagent  
**Question:**  
When 3 moles of hydrogen gas (H₂) react with 2 moles of oxygen gas (O₂) to form water (H₂O), which is the limiting reagent? (Reaction: 2H₂ + O₂ → 2H₂O)  

- A) Hydrogen gas (H₂)  
- B) Oxygen gas (O₂)  
- C) Both are limiting reagents  
- D) Neither; both are in excess  

---

### Stoichiometry MCQ 3: Mass Calculation  
**Question:**  
What mass of aluminum oxide (Al₂O₃) is produced when 54 grams of aluminum (Al) reacts with excess oxygen? (Reaction: 4Al + 3O₂ → 2Al₂O₃; Atomic mass Al = 27 g/mol)  

- A) 51 g  
- B) 102 g  
- C) 68 g  
- D) 136 g  

---

### Stoichiometry MCQ 4: Mole Ratio  
**Question:**  
In the reaction N₂ + 3H₂ → 2NH₃, how many moles of ammonia (NH₃) are produced from 2 moles of nitrogen gas (N₂) and excess hydrogen gas?  

- A) 2 moles  
- B) 3 moles  
- C) 4 moles  
- D) 6 moles  

---

### Stoichiometry MCQ 5: Theoretical Yield  
**Question:**  
If 10 grams of reactant A produces 8 grams of product B in a reaction with a theoretical yield of 12 grams, what is the percent yield?  

- A) 66.7%  
- B) 75%  
- C) 80%  
- D) 85%  

---

### Stoichiometry MCQ 6: Empirical Formula  
**Question:**  
A compound contains 40% carbon, 6.7% hydrogen, and 53.3% oxygen by mass. What is its empirical formula? (Atomic masses: C=12, H=1, O=16)  

- A) CH₂O  
- B) C₂H₄O₂  
- C) CHO  
- D) C₃H₆O₃  

---

Facilitator use:  
Introduce this material at the start of the session during the individual prediction phase. Distribute the task cards to learners and instruct them to read each question carefully and select their initial answer individually without discussion. Emphasize the importance of thoughtful consideration and recording their initial choice on their answer sheet. Monitor to ensure all questions are attempted and encourage learners to write brief reasoning for each answer.  

---

Activity: Pair Discussion and Reasoning Comparison  
Activity ID: A2  
Mapped outcomes: LO2, LO5  

Material: M2 (prompt_set)  
Purpose: Structured discussion prompts to guide peer comparison of reasoning  
Content:  

---

### Structured Discussion Prompts for Pair Work  

- Explain your reasoning for each answer you selected in the MCQs.  
- Ask your partner to explain their reasoning for their answers.  
- Identify any differences in your approaches or understanding.  
- Discuss which reasoning seems more valid and why, using evidence from the questions.  
- Consider if any alternative valid approaches exist.  
- Decide together if you want to revise your initial answers based on this discussion.  

---

Facilitator use:  
Provide this prompt set to each pair at the start of the discussion phase. Remind learners to actively use these prompts to guide their conversation and focus on explaining and questioning each other’s reasoning rather than simply stating answers. Circulate to observe discussions and gently intervene if pairs are silent or only voting without reasoning exchange. Encourage elaboration and respectful challenge.  

---

Material: M1 (task_cards)  
Purpose: Reference for the 6 stoichiometry MCQs during discussion  
Content:  

(Repeat the same 6 MCQs from Activity A1 here for joint reference during pair discussion)  

---

### Stoichiometry MCQ 1: Mole Concept  
**Question:**  
How many moles are present in 22 grams of carbon dioxide (CO₂)? (Atomic masses: C = 12 g/mol, O = 16 g/mol)  

- A) 0.5 moles  
- B) 1 mole  
- C) 2 moles  
- D) 4 moles  

---

### Stoichiometry MCQ 2: Limiting Reagent  
**Question:**  
When 3 moles of hydrogen gas (H₂) react with 2 moles of oxygen gas (O₂) to form water (H₂O), which is the limiting reagent? (Reaction: 2H₂ + O₂ → 2H₂O)  

- A) Hydrogen gas (H₂)  
- B) Oxygen gas (O₂)  
- C) Both are limiting reagents  
- D) Neither; both are in excess  

---

### Stoichiometry MCQ 3: Mass Calculation  
**Question:**  
What mass of aluminum oxide (Al₂O₃) is produced when 54 grams of aluminum (Al) reacts with excess oxygen? (Reaction: 4Al + 3O₂ → 2Al₂O₃; Atomic mass Al = 27 g/mol)  

- A) 51 g  
- B) 102 g  
- C) 68 g  
- D) 136 g  

---

### Stoichiometry MCQ 4: Mole Ratio  
**Question:**  
In the reaction N₂ + 3H₂ → 2NH₃, how many moles of ammonia (NH₃) are produced from 2 moles of nitrogen gas (N₂) and excess hydrogen gas?  

- A) 2 moles  
- B) 3 moles  
- C) 4 moles  
- D) 6 moles  

---

### Stoichiometry MCQ 5: Theoretical Yield  
**Question:**  
If 10 grams of reactant A produces 8 grams of product B in a reaction with a theoretical yield of 12 grams, what is the percent yield?  

- A) 66.7%  
- B) 75%  
- C) 80%  
- D) 85%  

---

### Stoichiometry MCQ 6: Empirical Formula  
**Question:**  
A compound contains 40% carbon, 6.7% hydrogen, and 53.3% oxygen by mass. What is its empirical formula? (Atomic masses: C=12, H=1, O=16)  

- A) CH₂O  
- B) C₂H₄O₂  
- C) CHO  
- D) C₃H₆O₃  

---

Facilitator use:  
Distribute or display these MCQs again for pairs to refer to during discussion. Encourage learners to use the cards as a shared reference to support their reasoning explanations and comparisons. Facilitate pair engagement using the structured prompts.  

---

Activity: Revision of Predictions Post-Peer Discussion  
Activity ID: A3  
Mapped outcomes: LO3, LO4  

Material: M3 (template)  
Purpose: Answer revision sheet for learners to record final answers and reflections  
Content:  

---

## Stoichiometry MCQ Revision Sheet  

| Question No. | Initial Answer | Reasoning for Initial Answer (brief) | Revised Answer (if any) | Reason for Revi
```

## F. assessment_items (G)

```json
{
  "session": {
    "title": "Peer Instruction Session: Stoichiometry",
    "duration_minutes": 90,
    "context": "First-year chemistry, face-to-face classroom lab session",
    "learning_outcomes": [
      "Predict correct answers to stoichiometry problems individually using fundamental concepts.",
      "Engage in structured peer discussions to compare reasoning and refine understanding of stoichiometry.",
      "Revise initial predictions based on dialogic comparison with peers.",
      "Demonstrate improved accuracy in stoichiometry MCQs after peer instruction.",
      "Reflect on reasoning processes and revisions made during peer discussions."
    ],
    "structure": [
      {
        "phase": "Individual Prediction",
        "instructions": "Read each multiple-choice question carefully and select your answer individually. Do not discuss your answer yet.",
        "activities": [
          {
            "type": "MCQ",
            "count": 6,
            "assessment_required": true,
            "learner_prompts": {
              "initial_position_prompt": "Select the answer you think is correct based on your current understanding of stoichiometry."
            }
          }
        ]
      },
      {
        "phase": "Pair Discussion",
        "instructions": "Discuss your answers with your partner using the structured prompts below. Compare your reasoning and challenge each other's thinking. Focus on dialogic comparison rather than silent voting.",
        "discussion_prompts": [
          "Explain your reasoning for your chosen answer.",
          "Ask your partner to explain their reasoning.",
          "Identify any differences in your approaches or assumptions.",
          "Consider if either of you needs to revise your answer based on the discussion."
        ],
        "cognition_fields": {
          "reasoning_revision_prompt": "Based on your discussion, do you think your initial answer should be revised? Why or why not?",
          "revision_trigger": "Use insights from your partner's reasoning to reconsider your initial choice."
        }
      },
      {
        "phase": "Revision of Predictions",
        "instructions": "After discussion, revise your answers if you wish. Submit your final answers for each question.",
        "activities": [
          {
            "type": "MCQ Revision",
            "count": 6,
            "learner_prompts": {
              "revision_trigger": "Revise your answer if your discussion with your partner changed your understanding."
            }
          }
        ]
      },
      {
        "phase": "Feedback and Reflection",
        "instructions": "Review the correct answers and explanations provided. Reflect on how your reasoning evolved during the session.",
        "activities": [
          {
            "type": "Answer Grid Reveal",
            "timing": "after_peer_discussion",
            "content": "Correct answers and detailed explanations for all 6 MCQs."
          },
          {
            "type": "Reflection Prompts",
            "prompts": [
              "What reasoning helped you revise your answers during discussion?",
              "How did comparing your thinking with a peer improve your understanding of stoichiometry?",
              "What challenges did you face in explaining or defending your answers?",
              "How will you approach stoichiometry problems differently in the future?"
            ]
          }
        ]
      }
    ],
    "materials": [
      {
        "type": "page",
        "profile": "learner",
        "content": [
          {
            "section": "Introduction",
            "text": "Welcome to the peer instruction session on stoichiometry. You will individually predict answers to stoichiometry MCQs, discuss your reasoning with a partner using structured prompts, then revise your answers before receiving feedback."
          },
          {
            "section": "MCQs",
            "questions": [
              {
                "id": "Q1",
                "stem": "What mass of water is produced when 4.0 g of hydrogen gas reacts completely with oxygen?",
                "options": [
                  "36 g",
                  "18 g",
                  "72 g",
                  "9 g"
                ],
                "correct_answer": "36 g"
              },
              {
                "id": "Q2",
                "stem": "How many moles of CO2 are produced when 2 moles of propane (C3H8) combust completely?",
                "options": [
                  "3 moles",
                  "5 moles",
                  "7 moles",
                  "8 moles"
                ],
                "correct_answer": "7 moles"
              },
              {
                "id": "Q3",
                "stem": "If 10 grams of Na react with excess Cl2, what mass of NaCl is formed?",
                "options": [
                  "16.5 g",
                  "25.5 g",
                  "35.5 g",
                  "45.0 g"
                ],
                "correct_answer": "25.5 g"
              },
              {
                "id": "Q4",
                "stem": "What volume of oxygen gas at STP is needed to react with 1 mole of methane (CH4)?",
                "options": [
                  "11.2 L",
                  "22.4 L",
                  "44.8 L",
                  "33.6 L"
                ],
                "correct_answer": "44.8 L"
              },
              {
                "id": "Q5",
                "stem": "When 0.5 moles of aluminum react with excess oxygen, how many moles of Al2O3 are produced?",
                "options": [
                  "0.25 moles",
                  "0.5 moles",
                  "1 mole",
                  "2 moles"
                ],
                "correct_answer": "0.25 moles"
              },
              {
                "id": "Q6",
                "stem": "What is the limiting reagent when 5 g of H2 reacts with 40 g of O2 to form water?",
      
```

## G. Composed page after 28-5d pass (C)

```json
{
  "artifact_type": "page",
  "title": "Peer Instruction Session: Stoichiometry",
  "audience": "First-year chemistry students",
  "page_profile": "learner",
  "sections": [
    {
      "heading": "Introduction",
      "content": [
        "Welcome to the peer instruction session on stoichiometry. You will individually predict answers to stoichiometry multiple-choice questions (MCQs), discuss your reasoning with a partner using structured prompts, then revise your answers before receiving feedback."
      ],
      "section_id": "overview"
    },
    {
      "heading": "Learning Outcomes",
      "content": [
        "By the end of this session, you will be able to:",
        "- Predict correct answers to stoichiometry problems individually using fundamental concepts.",
        "- Engage in structured peer discussions to compare reasoning and refine understanding of stoichiometry.",
        "- Revise initial predictions based on dialogic comparison with peers.",
        "- Demonstrate improved accuracy in stoichiometry MCQs after peer instruction.",
        "- Reflect on reasoning processes and revisions made during peer discussions."
      ],
      "section_id": "learning_purpose"
    },
    {
      "heading": "Learning Activities",
      "content": [
        {
          "title": "Individual Prediction of Stoichiometry MCQs",
          "duration_minutes": 20,
          "purpose": "Present 6 stoichiometry multiple-choice questions for individual prediction",
          "learner_task": "## Individual Prediction\n- Read each stoichiometry MCQ carefully.\n- Predict the correct answer individually without discussion.\n- Mark your initial choice on your answer sheet.",
          "expected_output": "A completed answer sheet with initial predictions for all 6 MCQs.",
          "materials": {
            "task_cards": "---\n\n### Stoichiometry MCQ 1: Mole Concept  \n**Question:**  \nHow many moles are present in 22 grams of carbon dioxide (CO₂)? (Atomic masses: C = 12 g/mol, O = 16 g/mol)  \n\n- A) 0.5 moles  \n- B) 1 mole  \n- C) 2 moles  \n- D) 4 moles  \n\n---\n\n### Stoichiometry MCQ 2: Limiting Reagent  \n**Question:**  \nWhen 3 moles of hydrogen gas (H₂) react with 2 moles of oxygen gas (O₂) to form water (H₂O), which is the limiting reagent? (Reaction: 2H₂ + O₂ → 2H₂O)  \n\n- A) Hydrogen gas (H₂)  \n- B) Oxygen gas (O₂)  \n- C) Both are limiting reagents  \n- D) Neither; both are in excess  \n\n---\n\n### Stoichiometry MCQ 3: Mass Calculation  \n**Question:**  \nWhat mass of aluminum oxide (Al₂O₃) is produced when 54 grams of aluminum (Al) reacts with excess oxygen? (Reaction: 4Al + 3O₂ → 2Al₂O₃; Atomic mass Al = 27 g/mol)  \n\n- A) 51 g  \n- B) 102 g  \n- C) 68 g  \n- D) 136 g  \n\n---\n\n### Stoichiometry MCQ 4: Mole Ratio  \n**Question:**  \nIn the reaction N₂ + 3H₂ → 2NH₃, how many moles of ammonia (NH₃) are produced from 2 moles of nitrogen gas (N₂) and excess hydrogen gas?  \n\n- A) 2 moles  \n- B) 3 moles  \n- C) 4 moles  \n- D) 6 moles  \n\n---\n\n### Stoichiometry MCQ 5: Theoretical Yield  \n**Question:**  \nIf 10 grams of reactant A produces 8 grams of product B in a reaction with a theoretical yield of 12 grams, what is the percent yield?  \n\n- A) 66.7%  \n- B) 75%  \n- C) 80%  \n- D) 85%  \n\n---\n\n### Stoichiometry MCQ 6: Empirical Formula  \n**Question:**  \nA compound contains 40% carbon, 6.7% hydrogen, and 53.3% oxygen by mass. What is its empirical formula? (Atomic masses: C=12, H=1, O=16)  \n\n- A) CH₂O  \n- B) C₂H₄O₂  \n- C) CHO  \n- D) C₃H₆O₃  \n\n---",
            "reasoning_revision_prompt": "What is your reasoning behind your initial answer? Write a brief explanation.",
            "initial_position_prompt": "Record your first choice for each question before discussing with a peer.",
            "revision_trigger": "Consider if your reasoning is clear and if you are confident before peer discussion."
          },
          "facilitator_notes": "Emphasize importance of individual effort before discussion. Prompt learners to carefully read each question. Monitor and encourage completion of all questions."
        },
        {
          "title": "Pair Discussion and Reasoning Comparison",
          "duration_minutes": 30,
          "purpose": "Structured discussion prompts to guide peer comparison of reasoning",
          "learner_task": "## Pair Discussion\n- Share your initial answers and reasoning with your partner.\n- Use the structured prompts to guide your discussion.\n- Compare your reasoning and identify any differences.\n- Decide if you want to revise your initial answers based on your partner's input.",
          "expected_output": "A jointly discussed set of reasoning notes and a decision on whether to revise each answer.",
          "materials": {
            "prompt_set": "---\n\n### Structured Discussion Prompts for Pair Work  \n\n- Explain your reasoning for each answer you selected in the MCQs.  \n- Ask your partner to explain their reasoning for their answers.  \n- Identify any differences in your approaches or understanding.  \n- Discuss which reasoning seems more valid and why, using evidence from the questions.  \n- Consider if any alternative valid approaches exist.  \n- Decide together if you want to revise your initial answers based on this discussion.  \n\n---",
            "task_cards": "---\n\n### Stoichiometry MCQ 1: Mole Concept  \n**Question:**  \nHow many moles are present in 22 grams of carbon dioxide (CO₂)? (Atomic masses: C = 12 g/mol, O = 16 g/mol)  \n\n- A) 0.5 moles  \n- B) 1 mole  \n- C) 2 moles  \n- D) 4 moles  \n\n---\n\n### Stoichiometry MCQ 2: Limiting Reagent  \n**Question:**  \nWhen 3 moles of hydrogen gas (H₂) react with 2 moles of oxygen gas (O₂) to form water (H₂O), which is the limiting reagent? (Reaction: 2H₂ + O₂ → 2H₂O)  \n\n- A) Hydrogen gas (H₂)  \n- B) Oxygen gas (O₂)  \n- C) Both are limiting reagents  \n- D) Neither; both are in excess  \n\n---\n\n### Stoichiometry MCQ 3: Mass Calculation  \n**Question:**  \nWhat mass of aluminum oxide (Al₂O₃) is produced when 54 grams of aluminum (Al) reacts with excess oxygen? (Reaction: 4Al + 3O₂ → 2Al₂O₃; Atomic mass Al = 27 g/mol)  \n\n- A) 51 g  \n- B) 102 g  \n- C) 68 g  \n- D) 136 g  \n\n---\n\n### Stoichiometry MCQ 4: Mole Ratio  \n**Question:**  \nIn the reaction N₂ + 3H₂ → 2NH₃, how many moles of ammonia (NH₃) are produced from 2 moles of nitrogen gas (N₂) and excess hydrogen gas?  \n\n- A) 2 moles  \n- B) 3 moles  \n- C) 4 moles  \n- D) 6 moles  \n\n---\n\n### Stoichiometry MCQ 5: Theoretical Yield  \n**Question:**  \nIf 10 grams of reactant A produces 8 grams of product B in a reaction with a theoretical yield of 12 grams, what is the percent yield?  \n\n- A) 66.7%  \n- B) 75%  \n- C) 80%  \n- D) 85%  \n\n---\n\n### Stoichiometry MCQ 6: Empirical Formula  \n**Question:**  \nA compound contains 40% carbon, 6.7% hydrogen, and 53.3% oxygen by mass. What is its empirical formula? (Atomic masses: C=12, H=1, O=16)  \n\n- A) CH₂O  \n- B) C₂H₄O₂  \n- C) CHO  \n- D) C₃H₆O₃  \n\n---",
            "reasoning_revision_prompt": "How has your partner's reasoning influenced your understanding of each question?",
            "initial_position_prompt": "Recall your initial answer and reasoning before discussion.",
            "revision_trigger": "If your partner’s reasoning reveals gaps or alternative valid approaches, consider revising your answer."
          },
          "facilitator_notes": "Remind pairs to use the prompts and focus on reasoning comparison. Observe and gently intervene if discussion is superficial or silent. Encourage explanation and questioning between partners."
        },
        {
          "title": "Revision of Predictions Post-Peer Discussion",
          "duration_minutes": 15,
          "purpose": "Answer revision sheet for learners to record final answers and reflections",
          "learner_task": "## Revise Your Answers\n- Reflect on the discussion with your partner.\n- For each MCQ, decide whether to keep or change your initial answer.\n- Record your final answer and briefly explain your reasoning or revision decision.",
          "expected_output": "Completed revision sheet with final answers and reasoning reflections for all 6 MCQs.",
          "materials": {
            "template": "---\n\n## Stoichiometry MCQ Revision Sheet  \n\n| Question No. | Initial Answer | Reasoning for Initial Answer (brief) | Revised Answer (if any) | Reason for Revision or Confirmation (brief) |  \n|--------------|----------------|-------------------------------------|------------------------|---------------------------------------------|  \n| 1            |                |                                     |                        |                                             |  \n| 2            |                |                                     |                        |                                             |  \n| 3            |                |                                     |                        |                                             |  \n| 4            |                |                                     |                        |                                             |  \n| 5            |                |                                     |                        |                                             |  \n| 6            |                |                                     |                        |                                             |  \n\n---\n\n**Instructions:**  \n- For each MCQ, recall your initial answer and write it down.  \n- Briefly summarize the reasoning you used initially.  \n- After discussing with your partner, decide whether to keep or change your answer. Record your revised answer.  \n- Write a brief explanation for why you revised your answer or why you confirmed your initial choice.",
            "reasoning_revision_prompt": "Explain how your reasoning has changed or been confirmed after discussion.",
            "initial_position_prompt": "Recall your initial answer and reasoning before discussion.",
            "revision_trigger": "Use insights from peer discussion to guide your final answer choice."
          },
          "facilitator_notes": "Encourage thoughtful reflection on the discussion. Prompt learners to justify any changes or confirmations. Provide support for clarifying misunderstandings if needed."
        },
        {
          "title": "Whole-Class Review and Reflection",
          "duration_minutes": 25,
          "purpose": "Answer grid showing correct answers and common reasoning patterns",
          "learner_task": "## Class Review and Reflection\n- Review the correct answers and explanations presented.\n- Reflect on your own and your partner’s reasoning and revisions.\n- Participate in the class discussion guided by reflection prompts.",
          "expected_output": "Engaged participation in discussion and verbal or written reflections on reasoning and learning gains.",
          "materials": {
            "sample_output": "---\n\n## Stoichiometry MCQs: Correct Answers and Explanations  \n\n| Question No. | Correct Answer | Explanation Summary | Common Misconceptions |  \n|--------------|----------------|---------------------|-----------------------|  \n| 1            | B              | 22 g CO₂ / 44 g/mol = 0.5 mol (Check molar mass carefully) | Confusing grams with moles; incorrect molar mass calculation |  \n| 2            | A              | Reaction requires 2 moles H₂ per 1 mole O₂; 3 moles H₂ < 4 needed for 2 moles O₂, so H₂ limits | Mistaking stoichiometric ratio; assuming O₂ limits |  \n| 3            | B              | 54 g Al / 27 g/mol = 2 mol Al; 4 mol Al → 2 mol Al₂O₃; 2 mol Al → 1 mol Al₂O₃; Molar mass Al₂O₃ = 102 g/mol; mass = 1 × 102 = 102 g | Errors in mole ratio or molar mass |  \n| 4            | C              | 1 mol N₂ produces 2 mol NH₃; 2 mol N₂ produce 4 mol NH₃; excess H₂ means full conversion; correct is 4 moles NH₃ | Miscounting mole ratios or confusing limiting reagent |  \n| 5            | A              | Percent yield = (actual/theoretical) × 100 = (8/12) × 100 = 66.7% | Confusing percent yield formula or calculation errors |  \n| 6            | A              | Convert % to moles: C=40/12=3.33, H=6.7/1=6.7, O=53.3/16=3.33; ratio approx 1:2:1 → CH₂O | Incorrect mole ratio calculation or rounding errors |  \n\n---",
            "prompt_set": "---\n\n### Whole-Class Reflection Prompts  \n\n- What reasoning helped you revise your answers during the session?  \n- Which stoichiometry concepts do you still find unclear or challenging?  \n- How did discussing with a peer improve your understanding of the questions?  \n- Can you identify any reasoning strategies that were particularly effective?  \n- How did your initial thinking change from the start to the end of the session?  \n- What will you do differently when approaching stoichiometry problems in the future?  \n\n---",
            "reasoning_revision_prompt": "How did your reasoning evolve through the session, and what influenced those changes?",
            "initial_position_prompt": "Recall your initial and revised answers and reasoning.",
            "revision_trigger": "Reflect on the value of peer discussion and feedback in improving your understanding."
          },
          "facilitator_notes": "Facilitate dialogic discussion emphasizing reasoning and conceptual understanding. Highlight examples of effective reasoning and revisions. Address any persistent misconceptions or confusion."
        }
      ],
      "section_id": "learning_activities"
    },
    {
      "heading": "Formative Assessment Check",
      "content": {
        "items": [
          {
            "id": "Q1",
            "stem": "What mass of water is produced when 4.0 g of hydrogen gas reacts completely with oxygen?",
            "options": [
              "36 g",
              "18 g",
              "72 g",
              "9 g"
            ]
          },
         
```

**Composition parity:**

```json
{
  "sectionIds": [
    "overview",
    "learning_purpose",
    "learning_activities",
    "assessment_check",
    null
  ],
  "learningActivitiesBeforeAssessment": true,
  "cognitionProfile": {
    "active": true,
    "pack_ids": [
      "peer_instruction_pack"
    ],
    "cognition_fields": [
      "reasoning_revision_prompt",
      "initial_position_prompt",
      "revision_trigger"
    ],
    "cognition_activity_priority": true,
    "cognition_section_required": true
  },
  "compositionTrace": {
    "cognitionSectionsPreserved": [
      "overview",
      "learning_purpose",
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
| Page section_ids | Often non-canonical | overview, learning_purpose, learning_activities, assessment_check,  |
| Cognition fields in DLA | Usually absent | satisfied=true |
| LA before assessment | Variable | yes |
| Assessment dominance | MCQ-only pages possible | injection + reorder when packs active |

## I. Investigator notes

- Sprint 28 adds **structural** preservation; live LLM compliance with typed fields remains variable.
- Composition pass is deterministic; G outputs still depend on model + prompt adherence.
- Sprint 27 assessment presentation preserved via `applyAssessmentSemanticsToComposedPage` after cognition pass.
