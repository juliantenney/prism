# P28-02 — live workflow probe (28-3)

**Captured:** 2026-05-21
**Method:** Pack prompt templates + `extractWorkflowBriefExplicitFactors` / heuristics; OpenAI `gpt-4.1-mini` step chain (DLA→GAM→GAI→Design Page).

## A. Exact brief

**Goal:**

> Create a peer instruction session on stoichiometry: students predict answers individually, discuss in pairs with structured prompts, then revise predictions. Include 6 MCQs and reflection prompts. Confirm solutions only after pair discussion. Emphasise dialogic comparison, not silent voting.

**Inputs:** First-year chemistry; 90-minute lab session.

**Desired outputs:** Learner-facing session page with activities and MCQ check.

## B. Resolved factors (E)

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
    "assessment_total_items": 6,
    "topic": "stoichiometry: students predict answers individually",
    "workshop_subject": "stoichiometry: students predict answers individually",
    "materials_required": true
  },
  "resolved": {
    "feedback_timing": "after_peer_discussion",
    "assessment_interaction_mode": "discussion_oriented",
    "learner_answer_visibility": "hidden_until_reveal",
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
      "title": "Individual Prediction of Stoichiometry MCQs",
      "grouping": "individual",
      "duration_minutes": 15,
      "mapped_learning_outcomes": [
        "LO1",
        "LO2",
        "LO3"
      ],
      "required_materials": [
        {
          "material_id": "M1",
          "type": "task_cards",
          "purpose": "Present 6 stoichiometry multiple-choice questions for individual prediction",
          "specification": "Each card contains one MCQ with 4 answer options; no solutions or explanations shown"
        }
      ],
      "learner_task": "### Individual Prediction\n- Read each stoichiometry MCQ carefully.\n- Select the answer you predict to be correct based on your current understanding.\n- Record your initial answers; do not discuss with peers yet.",
      "expected_output": "A recorded set of initial answers to all 6 MCQs, kept private until peer discussion.",
      "failure_mode": "Learners guess answers without attempting reasoning or rush through questions.",
      "facilitator_moves": "Encourage learners to think carefully and use their prior knowledge; remind them this is a prediction step with no penalty for errors."
    },
    {
      "activity_id": "A2",
      "title": "Structured Pair Discussion and Answer Comparison",
      "grouping": "pair",
      "duration_minutes": 30,
      "mapped_learning_outcomes": [
        "LO4",
        "LO5"
      ],
      "required_materials": [
        {
          "material_id": "M2",
          "type": "prompt_set",
          "purpose": "Guide structured dialogic comparison of MCQ answers in pairs",
          "specification": "Prompts include: explain your reasoning, identify differences, discuss uncertainties, suggest revisions"
        },
        {
          "material_id": "M1",
          "type": "task_cards",
          "purpose": "Reference the same 6 MCQs for discussion",
          "specification": "Same as used in A1, answers remain hidden"
        }
      ],
      "learner_task": "### Pair Discussion\n- Share your initial answers with your partner.\n- Use the provided prompts to discuss each MCQ:\n  1. Explain your reasoning.\n  2. Identify and explore any differences.\n  3. Discuss uncertainties or assumptions.\n  4. Agree on a revised answer for each question.\n- Record your revised answers after discussion.",
      "expected_output": "A collaboratively revised answer set for all 6 MCQs, reflecting negotiated understanding.",
      "failure_mode": "Pairs do not engage in meaningful discussion, default to silent voting or copying answers.",
      "facilitator_moves": "Circulate to prompt deeper reasoning, ask clarifying questions, and remind pairs to focus on dialogic comparison rather than silent voting."
    },
    {
      "activity_id": "A3",
      "title": "Reveal Solutions and Reflect on Peer Discussion Impact",
      "grouping": "whole_group",
      "duration_minutes": 20,
      "mapped_learning_outcomes": [
        "LO5",
        "LO6"
      ],
      "required_materials": [
        {
          "material_id": "M3",
          "type": "text",
          "purpose": "Provide authoritative solutions and explanations for the 6 MCQs",
          "specification": "Detailed solution key with stepwise stoichiometric reasoning"
        },
        {
          "material_id": "M4",
          "type": "prompt_set",
          "purpose": "Reflection prompts on reasoning and peer discussion impact",
          "specification": "Questions include: How did your answers change? What reasoning was clarified? How did discussion help?"
        }
      ],
      "learner_task": "### Solution Reveal and Reflection\n- Review the official solutions and explanations.\n- Reflect individually on:\n  1. How your revised answers compare to the solutions.\n  2. What reasoning you found most helpful.\n  3. How discussing with your peer influenced your understanding.\n- Share key reflections in a facilitated whole-group discussion.",
      "expected_output": "Individual written reflections on reasoning and peer discussion impact; contributions to group reflection.",
      "failure_mode": "Learners passively receive solutions without reflection or fail to connect discussion to learning.",
      "facilitator_moves": "Prompt learners to articulate reasoning changes, highlight good examples of peer learning, and encourage honest reflection."
    }
  ],
  "outcome_alignment": {
    "LO1": "Covered by A1 through initial concept application in MCQs.",
    "LO2": "Covered by A1 through mole-to-mole calculation questions.",
    "LO3": "Covered by A1 through prediction of reactant/product amounts.",
    "LO4": "Covered by A2 through structured peer discussion and comparison.",
    "LO5": "Covered by A2 and A3 through revision of answers post-discussion and solution reveal.",
    "LO6": "Covered by A3 through reflection prompts and group discussion."
  },
  "delivery_notes": "The session begins with individual predictions to activate prior knowledge without peer influence. Pair discussions use structured prompts to ensure dialogic comparison, avoiding silent voting. Solutions are revealed only after peer discussion to encourage revision and deeper understanding. Reflections consolidate learning and emphasize the value of peer interaction. Facilitators should monitor engagement and scaffold discussions to maintain focus on reasoning. Total duration is approximately 65 minutes, leaving time in the 90-minute lab for practical stoichiometry exercises or breaks."
}
```

## E. activity_materials (G)

```
Activity: Individual Prediction of Stoichiometry MCQs  
Activity ID: A1  
Mapped outcomes: LO1, LO2, LO3  

Material: M1 (task_cards)  
Purpose: Present 6 stoichiometry multiple-choice questions for individual prediction  
Content:  

---

### Stoichiometry MCQ 1  
**Question:**  
When 4.0 moles of hydrogen gas (H₂) react completely with oxygen gas (O₂) to form water (H₂O), how many moles of water are produced?  
**Balanced equation:** 2 H₂ + O₂ → 2 H₂O  

- A) 2.0 moles  
- B) 4.0 moles  
- C) 6.0 moles  
- D) 8.0 moles  

---

### Stoichiometry MCQ 2  
**Question:**  
If 10.0 g of sodium (Na) reacts with excess chlorine gas (Cl₂) to form sodium chloride (NaCl), what mass of NaCl is produced?  
**Balanced equation:** 2 Na + Cl₂ → 2 NaCl  
(Molar masses: Na = 23 g/mol, NaCl = 58.5 g/mol)  

- A) 25.4 g  
- B) 43.5 g  
- C) 58.5 g  
- D) 85.5 g  

---

### Stoichiometry MCQ 3  
**Question:**  
How many liters of carbon dioxide (CO₂) at STP are produced when 3.0 moles of propane (C₃H₈) are completely combusted?  
**Balanced equation:** C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O  
(1 mole gas at STP = 22.4 L)  

- A) 33.6 L  
- B) 44.8 L  
- C) 67.2 L  
- D) 134.4 L  

---

### Stoichiometry MCQ 4  
**Question:**  
In the reaction N₂ + 3 H₂ → 2 NH₃, how many grams of ammonia (NH₃) are formed from 14 g of nitrogen (N₂), assuming excess hydrogen?  
(Molar masses: N₂ = 28 g/mol, NH₃ = 17 g/mol)  

- A) 17 g  
- B) 34 g  
- C) 51 g  
- D) 68 g  

---

### Stoichiometry MCQ 5  
**Question:**  
What is the limiting reactant when 5 moles of A react with 10 moles of B according to the reaction: 2 A + 3 B → products?  

- A) A is limiting  
- B) B is limiting  
- C) Neither, both are in exact ratio  
- D) Cannot determine without product info  

---

### Stoichiometry MCQ 6  
**Question:**  
If 0.5 moles of calcium carbonate (CaCO₃) decompose completely according to CaCO₃ → CaO + CO₂, how many grams of CO₂ are produced?  
(Molar masses: CaCO₃ = 100 g/mol, CO₂ = 44 g/mol)  

- A) 11 g  
- B) 22 g  
- C) 44 g  
- D) 50 g  

---

Facilitator use:  
Distribute these task cards to learners for individual completion. Emphasize careful reading and thoughtful prediction without peer discussion. Encourage learners to record their answers privately and remind them there is no penalty for incorrect answers at this stage. Circulate to prompt reflection and discourage guessing or rushing.  

---

Activity: Structured Pair Discussion and Answer Comparison  
Activity ID: A2  
Mapped outcomes: LO4, LO5  

Material: M2 (prompt_set)  
Purpose: Guide structured dialogic comparison of MCQ answers in pairs  
Content:  

---

### Structured Pair Discussion Prompts for Stoichiometry MCQs

For each MCQ, discuss with your partner using the following prompts:

1. **Explain your reasoning:**  
   - Why did you choose your initial answer?  
   - What stoichiometric principles or calculations support it?

2. **Identify and explore differences:**  
   - Do your answers differ? If yes, what are the reasons?  
   - Can you identify any assumptions or misunderstandings?

3. **Discuss uncertainties or assumptions:**  
   - Are there any parts of the question or your reasoning you are unsure about?  
   - How might these affect your answer?

4. **Agree on a revised answer:**  
   - Based on your discussion, decide together if you want to keep or change your answer.  
   - Record your revised answer for this question.

---

Material: M1 (task_cards)  
Purpose: Reference the same 6 MCQs for discussion  
Content:  

(Same as in Activity A1)  

---

Facilitator use:  
Provide pairs with the original 6 MCQs again (without answers revealed). Introduce the structured prompts and encourage pairs to follow them carefully. Circulate to listen in, ask probing questions, and ensure pairs focus on reasoning dialogue rather than silent voting or copying. Remind pairs to record their revised answers collaboratively.  

---

Activity: Reveal Solutions and Reflect on Peer Discussion Impact  
Activity ID: A3  
Mapped outcomes: LO5, LO6  

Material: M3 (text)  
Purpose: Provide authoritative solutions and explanations for the 6 MCQs  
Content:  

---

### Solutions and Explanations for Stoichiometry MCQs  

**MCQ 1:**  
Correct answer: B) 4.0 moles  
Explanation: From the balanced equation, 2 moles H₂ produce 2 moles H₂O (1:1 ratio). Therefore, 4.0 moles H₂ produce 4.0 moles H₂O.

---

**MCQ 2:**  
Correct answer: B) 43.5 g  
Explanation:  
- Moles Na = 10.0 g ÷ 23 g/mol = 0.435 moles  
- From equation, 2 moles Na produce 2 moles NaCl (1:1 ratio)  
- Moles NaCl = 0.435 moles  
- Mass NaCl = 0.435 × 58.5 g/mol = 25.45 g  
*Note:* Rechecking calculation: Actually, answer B is 43.5 g, but calculation shows 25.45 g. Let's recalculate carefully:  
Moles Na = 10.0 / 23 = 0.4348 moles  
Moles NaCl produced = 0.4348 moles (1:1 ratio)  
Mass NaCl = 0.4348 × 58.5 = 25.45 g  
Correct answer should be A) 25.4 g  
Correction: The correct answer is A) 25.4 g  

---

**MCQ 3:**  
Correct answer: D) 134.4 L  
Explanation:  
- From balanced equation, 1 mole C₃H₈ produces 3 moles CO₂  
- 3 moles C₃H₈ produce 3 × 3 = 9 moles CO₂  
- Volume CO₂ = 9 × 22.4 L = 201.6 L  
*Note:* None of the options match 201.6 L. Re-examine options:  
A) 33.6 L  
B) 44.8 L  
C) 67.2 L  
D) 134.4 L  
Since 201.6 L is not an option, check if question meant 1 mole C₃H₈ produces 3 moles CO₂, so for 3 moles C₃H₈:  
3 × 3 = 9 moles CO₂  
9 × 22.4 = 201.6 L  
Since 201.6 L is not listed, possibly the question intended 1 mole gas at STP = 24 L (common alternative). Using 24 L:  
9 × 24 = 216 L, still no match.  
Alternatively, maybe question intended 1 mole C₃H₈ produces 3 moles CO₂, but options are lower. Possibly a typo in options. To align with options, choose closest: 134.4 L corresponds to 6 moles CO₂ × 22.4 = 134.4 L. So maybe question intended 2 moles C₃H₈.  
To avoid confusion, revise explanation:  
Assuming 3 moles C₃H₈ produce 9 moles CO₂ → 201.6 L (not listed)  
Closest option is D) 134.4 L for 6 moles CO₂.  
Therefore, correct answer based on given options is D) 134.4 L, assuming 6 moles CO₂ formed (2 moles C₃H₈).  
*Note for facilitator:* Clarify with learners the calculation and discuss possible discrepancies.  

---

**MCQ 4:**  
Correct answer: C) 51 g  
Explanation:  
- Moles N₂ = 14 g ÷ 28 g/mol = 0.5 moles  
- From equation, 1 mole N₂ produces 2 moles NH₃  
- Moles NH₃ = 0.5 × 2 = 1 mole  
- Mass NH₃ = 1 × 17 g/mol = 17 g  
*Note:* This matches option A) 17 g, but the question asks for grams formed from 14 g N₂. Calculation shows 17 g NH₃. So correct answer is A) 17 g.  
Correction: Correct answer is A) 17 g.  

---

**MCQ 5:**  
Correct answer: A) A is limiting  
Explanation:  
- Reaction ratio: 2 A : 3 B  
- Available ratio: 5 A : 10 B  
- Calculate mole ratio:  
  - Required B for 5 moles A = (3/2) × 5 = 7.5 moles B  
- Since 10 moles B > 7.5 moles required, A limits reaction.

---

**MCQ 6:**  
Correct answer: B) 22 g  
Explanation:  
- Moles CaCO₃ = 0.5 moles  
- From equation, 1 mole CaCO₃ produces 1 mole CO₂  
- Moles CO₂ = 0.5 moles  
- Mass CO₂ = 0.5 × 44 g/mol = 22 g  

---

Material: M4 (prompt_set)  
Purpose: Reflection prompts on reasoning and peer discussion impact  
Content:  

---

### Reflection Prompts on Stoichiometry Peer Discussion  

Individually reflect on the following questions:  

1. How did your revised answers after peer discussion compare to your initial predictions?  
2. Which stoichiometric reasoning or concepts became clearer through discussion?  
3. Did your partner’s explanations challenge or reinforce your understanding? How?  
4. What uncertainties or assumptions did you resolve or identify during discussion?  
5. How did the peer discussion influence your confidence in your answers?  
6. What will you do differently in future stoichiometry problems based on this experience?  

---

Facilitator use:  
Distribute the solution key and explanations after pair discussions are complete. Allow learners time to review carefull
```

## F. assessment_items (G)

```json
{
  "assessment_items": [
    {
      "id": "Q1",
      "type": "mcq",
      "question": "What does stoichiometry primarily help you determine in a chemical reaction?",
      "options": [
        "The color changes during the reaction",
        "The mole-to-mole relationships between reactants and products",
        "The temperature at which the reaction occurs",
        "The speed of the reaction"
      ],
      "correct_option_index": 1,
      "linked_learning_outcomes": [
        "LO1"
      ]
    },
    {
      "id": "Q2",
      "type": "mcq",
      "question": "Given the balanced equation: 2H₂ + O₂ → 2H₂O, how many moles of water are produced from 3 moles of oxygen?",
      "options": [
        "3 moles",
        "4 moles",
        "6 moles",
        "1.5 moles"
      ],
      "correct_option_index": 2,
      "linked_learning_outcomes": [
        "LO2",
        "LO3"
      ]
    },
    {
      "id": "Q3",
      "type": "mcq",
      "question": "If you start with 5 moles of nitrogen (N₂) and 12 moles of hydrogen (H₂) in the reaction N₂ + 3H₂ → 2NH₃, which is the limiting reactant?",
      "options": [
        "Nitrogen (N₂)",
        "Hydrogen (H₂)",
        "Both are limiting reactants",
        "There is no limiting reactant"
      ],
      "correct_option_index": 1,
      "linked_learning_outcomes": [
        "LO2",
        "LO3"
      ]
    },
    {
      "id": "Q4",
      "type": "mcq",
      "question": "In the reaction C + O₂ → CO₂, if 10 moles of carbon react completely, how many moles of oxygen are required?",
      "options": [
        "5 moles",
        "10 moles",
        "20 moles",
        "1 mole"
      ],
      "correct_option_index": 1,
      "linked_learning_outcomes": [
        "LO2",
        "LO3"
      ]
    },
    {
      "id": "Q5",
      "type": "mcq",
      "question": "Why is it important to discuss your initial stoichiometric predictions with a peer before confirming answers?",
      "options": [
        "To memorize the correct answers quickly",
        "To compare reasoning and refine understanding through dialogue",
        "To decide which answer looks easiest",
        "To avoid doing calculations yourself"
      ],
      "correct_option_index": 1,
      "linked_learning_outcomes": [
        "LO4",
        "LO5"
      ]
    },
    {
      "id": "Q6",
      "type": "mcq",
      "question": "After peer discussion, you revise your stoichiometric calculation. What is the main benefit of this revision step?",
      "options": [
        "It guarantees your answer is now correct",
        "It helps integrate different perspectives and deepen understanding",
        "It allows you to copy your peer's answer",
        "It shortens the time needed for the session"
      ],
      "correct_option_index": 1,
      "linked_learning_outcomes": [
        "LO5",
        "LO6"
      ]
    }
  ]
}
```

## G. Composed page (C)

```json
{
  "artifact_type": "page",
  "title": "Peer Instruction Session: Stoichiometry",
  "audience": "First-year Chemistry Students",
  "page_profile": "learner",
  "sections": [
    {
      "heading": "Introduction to Stoichiometry Peer Instruction",
      "content": "Welcome to this peer instruction session on stoichiometry. You will first predict answers individually to six multiple-choice questions (MCQs) about stoichiometry concepts and calculations. Then, you will discuss your answers in pairs using structured prompts to compare reasoning and revise your answers collaboratively. Finally, solutions will be revealed, followed by an individual reflection and whole-group discussion to consolidate your understanding. This approach emphasizes dialogic comparison and reasoning over silent voting or copying answers."
    },
    {
      "heading": "Learning Outcomes",
      "content": "By the end of this session, you will be able to:\n\n- Apply stoichiometric principles to predict mole and mass relationships in chemical reactions (LO1, LO2, LO3).\n- Engage in structured peer discussions to compare and refine stoichiometric reasoning (LO4).\n- Revise your answers based on peer dialogue and authoritative solutions (LO5).\n- Reflect on how peer discussion impacts your understanding and confidence in stoichiometry (LO6)."
    },
    {
      "heading": "Learning Activities",
      "content": [
        {
          "activity_id": "A1",
          "title": "Individual Prediction of Stoichiometry MCQs",
          "duration_minutes": 15,
          "learner_purpose": "Activate your prior knowledge and make initial predictions on stoichiometry problems without peer influence.",
          "learner_task": "### Individual Prediction\n- Read each stoichiometry MCQ carefully.\n- Select the answer you predict to be correct based on your current understanding.\n- Record your initial answers; do not discuss with peers yet.",
          "expected_output": "A recorded set of initial answers to all 6 MCQs, kept private until peer discussion.",
          "materials": {
            "task_cards": "---\n\n### Stoichiometry MCQ 1  \n**Question:**  \nWhen 4.0 moles of hydrogen gas (H₂) react completely with oxygen gas (O₂) to form water (H₂O), how many moles of water are produced?  \n**Balanced equation:** 2 H₂ + O₂ → 2 H₂O  \n\n- A) 2.0 moles  \n- B) 4.0 moles  \n- C) 6.0 moles  \n- D) 8.0 moles  \n\n---\n\n### Stoichiometry MCQ 2  \n**Question:**  \nIf 10.0 g of sodium (Na) reacts with excess chlorine gas (Cl₂) to form sodium chloride (NaCl), what mass of NaCl is produced?  \n**Balanced equation:** 2 Na + Cl₂ → 2 NaCl  \n(Molar masses: Na = 23 g/mol, NaCl = 58.5 g/mol)  \n\n- A) 25.4 g  \n- B) 43.5 g  \n- C) 58.5 g  \n- D) 85.5 g  \n\n---\n\n### Stoichiometry MCQ 3  \n**Question:**  \nHow many liters of carbon dioxide (CO₂) at STP are produced when 3.0 moles of propane (C₃H₈) are completely combusted?  \n**Balanced equation:** C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O  \n(1 mole gas at STP = 22.4 L)  \n\n- A) 33.6 L  \n- B) 44.8 L  \n- C) 67.2 L  \n- D) 134.4 L  \n\n---\n\n### Stoichiometry MCQ 4  \n**Question:**  \nIn the reaction N₂ + 3 H₂ → 2 NH₃, how many grams of ammonia (NH₃) are formed from 14 g of nitrogen (N₂), assuming excess hydrogen?  \n(Molar masses: N₂ = 28 g/mol, NH₃ = 17 g/mol)  \n\n- A) 17 g  \n- B) 34 g  \n- C) 51 g  \n- D) 68 g  \n\n---\n\n### Stoichiometry MCQ 5  \n**Question:**  \nWhat is the limiting reactant when 5 moles of A react with 10 moles of B according to the reaction: 2 A + 3 B → products?  \n\n- A) A is limiting  \n- B) B is limiting  \n- C) Neither, both are in exact ratio  \n- D) Cannot determine without product info  \n\n---\n\n### Stoichiometry MCQ 6  \n**Question:**  \nIf 0.5 moles of calcium carbonate (CaCO₃) decompose completely according to CaCO₃ → CaO + CO₂, how many grams of CO₂ are produced?  \n(Molar masses: CaCO₃ = 100 g/mol, CO₂ = 44 g/mol)  \n\n- A) 11 g  \n- B) 22 g  \n- C) 44 g  \n- D) 50 g  \n\n---"
          },
          "facilitator_notes": "Distribute these task cards to learners for individual completion. Emphasize careful reading and thoughtful prediction without peer discussion. Encourage learners to record their answers privately and remind them there is no penalty for incorrect answers at this stage. Circulate to prompt reflection and discourage guessing or rushing."
        },
        {
          "activity_id": "A2",
          "title": "Structured Pair Discussion and Answer Comparison",
          "duration_minutes": 30,
          "learner_purpose": "Engage in dialogic comparison with a partner to deepen reasoning and revise your stoichiometry answers collaboratively.",
          "learner_task": "### Pair Discussion\n- Share your initial answers with your partner.\n- Use the provided prompts to discuss each MCQ:\n  1. Explain your reasoning.\n  2. Identify and explore any differences.\n  3. Discuss uncertainties or assumptions.\n  4. Agree on a revised answer for each question.\n- Record your revised answers after discussion.",
          "expected_output": "A collaboratively revised answer set for all 6 MCQs, reflecting negotiated understanding.",
          "materials": {
            "prompt_set": "---\n\n### Structured Pair Discussion Prompts for Stoichiometry MCQs\n\nFor each MCQ, discuss with your partner using the following prompts:\n\n1. **Explain your reasoning:**  \n   - Why did you choose your initial answer?  \n   - What stoichiometric principles or calculations support it?\n\n2. **Identify and explore differences:**  \n   - Do your answers differ? If yes, what are the reasons?  \n   - Can you identify any assumptions or misunderstandings?\n\n3. **Discuss uncertainties or assumptions:**  \n   - Are there any parts of the question or your reasoning you are unsure about?  \n   - How might these affect your answer?\n\n4. **Agree on a revised answer:**  \n   - Based on your discussion, decide together if you want to keep or change your answer.  \n   - Record your revised answer for this question.\n\n---",
            "task_cards": "---\n\n### Stoichiometry MCQ 1  \n**Question:**  \nWhen 4.0 moles of hydrogen gas (H₂) react completely with oxygen gas (O₂) to form water (H₂O), how many moles of water are produced?  \n**Balanced equation:** 2 H₂ + O₂ → 2 H₂O  \n\n- A) 2.0 moles  \n- B) 4.0 moles  \n- C) 6.0 moles  \n- D) 8.0 moles  \n\n---\n\n### Stoichiometry MCQ 2  \n**Question:**  \nIf 10.0 g of sodium (Na) reacts with excess chlorine gas (Cl₂) to form sodium chloride (NaCl), what mass of NaCl is produced?  \n**Balanced equation:** 2 Na + Cl₂ → 2 NaCl  \n(Molar masses: Na = 23 g/mol, NaCl = 58.5 g/mol)  \n\n- A) 25.4 g  \n- B) 43.5 g  \n- C) 58.5 g  \n- D) 85.5 g  \n\n---\n\n### Stoichiometry MCQ 3  \n**Question:**  \nHow many liters of carbon dioxide (CO₂) at STP are produced when 3.0 moles of propane (C₃H₈) are completely combusted?  \n**Balanced equation:** C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O  \n(1 mole gas at STP = 22.4 L)  \n\n- A) 33.6 L  \n- B) 44.8 L  \n- C) 67.2 L  \n- D) 134.4 L  \n\n---\n\n### Stoichiometry MCQ 4  \n**Question:**  \nIn the reaction N₂ + 3 H₂ → 2 NH₃, how many grams of ammonia (NH₃) are formed from 14 g of nitrogen (N₂), assuming excess hydrogen?  \n(Molar masses: N₂ = 28 g/mol, NH₃ = 17 g/mol)  \n\n- A) 17 g  \n- B) 34 g  \n- C) 51 g  \n- D) 68 g  \n\n---\n\n### Stoichiometry MCQ 5  \n**Question:**  \nWhat is the limiting reactant when 5 moles of A react with 10 moles of B according to the reaction: 2 A + 3 B → products?  \n\n- A) A is limiting  \n- B) B is limiting  \n- C) Neither, both are in exact ratio  \n- D) Cannot determine without product info  \n\n---\n\n### Stoichiometry MCQ 6  \n**Question:**  \nIf 0.5 moles of calcium carbonate (CaCO₃) decompose completely according to CaCO₃ → CaO + CO₂, how many grams of CO₂ are produced?  \n(Molar masses: CaCO₃ = 100 g/mol, CO₂ = 44 g/mol)  \n\n- A) 11 g  \n- B) 22 g  \n- C) 44 g  \n- D) 50 g  \n\n---"
          },
          "facilitator_notes": "Provide pairs with the original 6 MCQs again (without answers revealed). Introduce the structured prompts and encourage pairs to follow them carefully. Circulate to listen in, ask probing questions, and ensure pairs focus on reasoning dialogue rather than silent voting or copying. Remind pairs to record their revised answers collaboratively."
        },
        {
          "activity_id": "A3",
          "title": "Reveal Solutions and Reflect on Peer Discussion Impact",
          "duration_minutes": 20,
          "learner_purpose": "Review authoritative solutions and reflect individually and as a group on how peer discussion influenced your stoichiometric reasoning and confidence.",
          "learner_task": "### Solution Reveal and Reflection\n- Review the official solutions and explanations.\n- Reflect individually on:\n  1. How your revised answers compare to the solutions.\n  2. What reasoning you found most helpful.\n  3. How discussing with your peer influenced your understanding.\n- Share key reflections in a facilitated whole-group discussion.",
          "expected_output": "Individual written reflections on reasoning and peer discussion impact; contributions to group reflection.",
          "materials": {
            "solutions_and_explanations": "---\n\n### Solutions and Explanations for Stoichiometry MCQs  \n\n**MCQ 1:**  \nCorrect answer: B) 4.0 moles  \nExplanation: From the balanced equation, 2 moles H₂ produce 2 moles H₂O (1:1 ratio). Therefore, 4.0 moles H₂ produce 4.0 moles H₂O.\n\n---\n\n**MCQ 2:**  \nCorrect answer: A) 25.4 g  \nExplanation:  \n- Moles Na = 10.0 g ÷ 23 g/mol = 0.435 moles  \n- From equation, 2 moles Na produce 2 moles NaCl (1:1 ratio)  \n- Moles NaCl = 0.435 moles  \n- Mass NaCl = 0.435 × 58.5 g/mol = 25.45 g\n\n---\n\n**MCQ 3:**  \nCorrect answer: D) 134.4 L  \nExplanation:  \n- From balanced equation, 1 mole C₃H₈ produces 3 moles CO₂  \n- 3 moles C₃H₈ produce 9 moles CO₂  \n- Volume CO₂ = 9 × 22.4 L = 201.6 L  \n*Note:* The given options do not include 201.6 L. The closest listed option is D) 134.4 L, which corresponds to 6 moles CO₂. Discuss this discrepancy during peer discussion.\n\n---\n\n**MCQ 4:**  \nCorrect answer: A) 17 g  \nExplanation:  \n- Moles N₂ = 14 g ÷ 28 g/mol = 0.5 moles  \n- From equation, 1 mole N₂ produces 2 moles NH₃  \n- Moles NH₃ = 0.5 × 2 = 1 mole  \n- Mass NH₃ = 1 × 17 g/mol = 17 g\n\n---\n\n**MCQ 5:**  \nCorrect answer: A) A is limiting  \nExplanation:  \n- Reaction ratio: 2 A : 3 B  \n- Available ratio: 5 A : 10 B  \n- Required B for 5 moles A = (3/2) × 5 = 7.5 moles B  \n- Since 10 moles B > 7.5 moles required, A limits reaction.\n\n---\n\n**MCQ 6:**  \nCorrect answer: B) 22 g  \nExplanation:  \n- Moles CaCO₃ = 0.5 moles  \n- From equation, 1 mole CaCO₃ produces 1 mole CO₂  \n- Moles CO₂ = 0.5 moles  \n- Mass CO₂ = 0.5 × 44 g/mol = 22 g\n\n---",
            "reflection_prompts": "---\n\n### Reflection Prompts on Stoichiometry Peer Discussion  \n\nIndividually reflect on the following questions:  \n\n1. How did your revised answers after peer discussion compare to your initial predictions?  \n2. Which stoichiometric reasoning or concepts became clearer through discussion?  \n3. Did your partner’s explanations challenge or reinforce your understanding? How?  \n4. What uncertainties or assumptions did you resolve or identify during discussion?  \n5. How did the peer discussion influence your confidence in your answers?  \n6. What will you do differently in future stoichiometry problems based on this experience?  \n\n---"
          },
          "facilitator_notes": "Distribute the solution key and explanations after pair discussions are complete. Allow learners time to review carefully. Then provide the reflection prompts for individual written responses. Facilitate a whole-group discussion to share insights, focusing on reasoning changes and the impact of peer dialogue. Encourage honest reflection and highlight positive examples of peer learning."
        }
      ]
    },
    {
      "
```

**Section IDs:** , , , 

## I. Render (R)

**Not captured** in 28-3 runner (composition JSON only). Use PRISM run mode + `buildUtilityStructuredHtmlForTest` for HTML.

## J. Rubric (live heuristic)

```json
{
  "D1": 0,
  "D2": 1,
  "D3": 1,
  "D4": 1,
  "D5": 2,
  "D6": 0,
  "D7": 0,
  "D8": 1,
  "D9": 1,
  "D10": 1,
  "mean": 0.8,
  "pageSections": [
    null,
    null,
    null,
    null
  ],
  "assessmentItemCountOnPage": 0,
  "facilitator_moves_sample": "Encourage learners to think carefully and use their prior knowledge; remind them this is a prediction step with no penalty for errors."
}
```

## Investigator interpretation

**Strongest live evidence for reasoning revision (D9):** Three activities — predict (A1) → pair revise (A2) → reveal + reflect (A3). **Genuine cognitive structure**, not labels only.

**Ceiling signs:** `facilitator_moves` on A1 generic; **solutions embedded in learner materials** (brief asked confirm after discussion only); **page formative MCQs differ from activity MCQs** (assessment attractor / duplication).

**E:** `feedback_timing`, `think_pair_share` (via stoichiometry cues), 6 items — **stronger than harness opportunity-cost brief**.

## J. Rubric (investigator-scored — live)

| Dim | Score | Note |
|-----|-------|------|
| D1 | **0** | Procedural stoichiometry |
| D2 | **2** | Phased tasks + deliverables |
| D3 | **1** | Uncertainty in pair prompts |
| D4 | **2** | Structured pair dialogue |
| D5 | **1** | Conceptual MCQs; limited repair arc |
| D6 | **1** | A2/A3 stronger; A1 generic |
| D7 | **1** | Reflection prompts; no error taxonomy |
| D8 | **2** | Clear predict→discuss→reveal sequence |
| D9 | **3** | Explicit revise + reflection |
| D10 | **2** | Activities + assessment (duplicated item sets) |
| **Mean** | **~1.5** | |
