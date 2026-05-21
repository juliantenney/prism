# P28-07 — post-5d stabilisation probe

**Captured:** 2026-05-21
**Method:** Sprint 28-5a–5d runtime (packs, topology, DLA contracts, composition parity) + OpenAI `gpt-4.1-mini` step chain with cognition scaffold and composition post-pass.

## A. Brief (unchanged from 28-3)

> Using the provided lecture transcript on RNA viruses and hepatitis C, create dialogic learning activities (discussion prompts, misconception confrontation, pair tasks) and a short formative assessment. Do not invent facts beyond the transcript; surface uncertainty where evidence is incomplete.

## B. E/O + cognition architecture (28-5a/b)

```json
{
  "explicit": {
    "desired_outputs": "Learner-facing page with activities and formative check.",
    "input_strategy": "provided_source_content",
    "session_materials": [
      "page"
    ],
    "assessment_required": true,
    "activities_required": true,
    "assessment_interaction_mode": "discussion_oriented",
    "misconception_reconciliation_required": true,
    "productive_uncertainty_required": true,
    "cognitive_engagement_required": true,
    "topic": "rna viruses and hepatitis c",
    "workshop_subject": "rna viruses and hepatitis c",
    "materials_required": true,
    "output_depth": "concise"
  },
  "resolved": {
    "topic": "rna viruses and hepatitis c",
    "design_scope": "session",
    "delivery_pattern": "face_to_face",
    "input_strategy": "provided_source_content",
    "session_materials": [
      "page"
    ],
    "page_profile": "learner",
    "assessment_required": true,
    "learning_environments": [
      "classroom"
    ],
    "assessment_strategy": "none",
    "feedback_timing": "immediate_self_check",
    "assessment_interaction_mode": "discussion_oriented",
    "learner_answer_visibility": "show_answer_grid_end",
    "peer_instruction_phase": "none",
    "misconception_assessment_link": false,
    "design_feedback_required": false,
    "cognitive_engagement_required": true,
    "reasoning_revision_required": false,
    "misconception_reconciliation_required": true,
    "adaptive_scaffolding_required": false,
    "productive_uncertainty_required": true,
    "coverage_scope": "balanced",
    "cognitive_demand": "mixed",
    "question_style_mix": "mixed_response_modes",
    "assessment_type": "mixed",
    "feedback_required": "item_level",
    "difficulty_profile": "balanced",
    "assessment_total_items": 10,
    "activity_pattern_mix": "balanced",
    "sequencing_granularity": "standard",
    "tone_style": "academic",
    "depth_level": "mixed",
    "include_examples": true,
    "include_practice_tasks": false,
    "compact_vs_detailed": "standard"
  },
  "cognition_packs": [
    "misconception_repair_pack",
    "transcript_transformation_pack"
  ],
  "cognition_contract": {
    "active": true,
    "packIds": [
      "misconception_repair_pack",
      "transcript_transformation_pack"
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
        "id": "transformation_activity",
        "packId": "transcript_transformation_pack",
        "gamLabel": "Transformation activity",
        "arrayOrString": false
      },
      {
        "id": "source_to_application_prompt",
        "packId": "transcript_transformation_pack",
        "gamLabel": "Source to application",
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
      "transformation_activity",
      "source_to_application_prompt",
      "uncertainty_tension_prompt"
    ],
    "gamSections": [
      "Misconception claim",
      "Reconciliation prompt",
      "Evidence contrast",
      "Transformation activity",
      "Source to application",
      "Uncertainty tension"
    ],
    "gamSectionLabels": [
      "Misconception claim",
      "Reconciliation prompt",
      "Evidence contrast",
      "Transformation activity",
      "Source to application",
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
      "Construct Learning Sequence",
      "Normalize Content",
      "Model Knowledge"
    ],
    "cognitionPruningPrevented": []
  },
  "presentation": {
    "hasSemanticPresentation": true,
    "learnerAnswerVisibility": "show_answer_grid_end",
    "feedbackTiming": "immediate_self_check",
    "includeAnswers": true,
    "feedbackDisplay": "answer_grid_end"
  }
}
```

## C. Topology (O)

Normalize Content → Model Knowledge → Define Learning Outcomes → Design Learning Activities → Generate Activity Materials → Generate Assessment Items → Construct Learning Sequence → Design Page

## D. learning_activities + cognition fields (G / 28-5c)

```json
{
  "activities": [
    {
      "activity_id": "A1",
      "title": "Clarifying RNA Virus Genome Types and Replication Mechanisms",
      "grouping": "whole_group",
      "duration_minutes": 20,
      "mapped_learning_outcomes": [
        "LO1",
        "LO6"
      ],
      "required_materials": [
        {
          "material_id": "M1",
          "type": "prompt_set",
          "purpose": "Provide discussion prompts on RNA virus genome types and replication",
          "specification": "Prompts include questions on positive-sense vs negative-sense RNA, and implications for replication"
        }
      ],
      "learner_task": "### Discussion Prompt\n- Explain the difference between positive-sense and negative-sense RNA viruses.\n- Discuss why negative-sense RNA viruses require a virion polymerase for replication.\n- Summarize how these genome types influence viral replication strategies.",
      "expected_output": "Learners articulate that positive-sense RNA can be directly translated by host ribosomes, whereas negative-sense RNA requires a virion-encoded RNA-dependent RNA polymerase to synthesize a positive-sense RNA before translation. They link genome type to replication mechanism.",
      "failure_mode": "Learners confuse genome polarity or replication steps, e.g., stating negative-sense RNA can be directly translated.",
      "facilitator_moves": "Prompt clarification questions, provide examples contrasting positive and negative RNA viruses, and restate key points to reinforce correct understanding.",
      "misconception_claim": "**Misconception:** All RNA viruses can be directly translated by host ribosomes.\n",
      "reconciliation_prompt": "How does the requirement of a virion polymerase for negative-sense RNA viruses change their replication compared to positive-sense RNA viruses?",
      "evidence_contrast": "The transcript states positive-sense RNA can be translated directly; negative-sense RNA requires virion polymerase, highlighting a fundamental replication difference.",
      "transformation_activity": "Rewrite a short explanation contrasting positive- and negative-sense RNA virus replication in your own words.",
      "source_to_application_prompt": "Based on this, how might antiviral drugs target the polymerase activity in negative-sense RNA viruses?",
      "uncertainty_tension_prompt": "What uncertainties might arise in understanding replication if a virus has an atypical genome structure or polymerase requirement?"
    },
    {
      "activity_id": "A2",
      "title": "Pair Task: Exploring Hepatitis C Virus Characteristics and Host Interactions",
      "grouping": "pair",
      "duration_minutes": 25,
      "mapped_learning_outcomes": [
        "LO2",
        "LO4",
        "LO6"
      ],
      "required_materials": [
        {
          "material_id": "M2",
          "type": "task_cards",
          "purpose": "Guide pairs through key HCV features and host factor roles",
          "specification": "Cards include facts about HCV genome type, replication site, microRNA-122 role, and NS5B polymerase function"
        }
      ],
      "learner_task": "### Pair Discussion and Explanation\n- Identify and describe the genome type of HCV and where it replicates.\n- Explain the role of host microRNA-122 in HCV replication.\n- Discuss the function of the viral NS5B polymerase.\n- Prepare a brief joint explanation to present to the group.",
      "expected_output": "Pairs produce a clear explanation that HCV is a positive-sense flavivirus replicating in hepatocytes; microRNA-122 stabilizes the viral 5' UTR enhancing replication; NS5B is the RNA-dependent RNA polymerase essential for viral RNA synthesis.",
      "failure_mode": "Pairs omit or confuse host factor roles or viral enzyme functions.",
      "facilitator_moves": "Circulate to prompt deeper reasoning, ask guiding questions about microRNA-122 and NS5B, and encourage precise use of terminology.",
      "misconception_claim": "**Misconception:** HCV integrates into host DNA like retroviruses.\n",
      "reconciliation_prompt": "How does HCV replication differ from retroviruses in terms of genome integration and replication strategy?",
      "evidence_contrast": "The transcript clarifies HCV is a positive-sense RNA virus replicating in hepatocytes without genome integration, unlike retroviruses.",
      "transformation_activity": "Create a concept map linking HCV genome, host microRNA-122, NS5B polymerase, and replication site.",
      "source_to_application_prompt": "How might targeting microRNA-122 or NS5B polymerase affect HCV replication therapeutically?",
      "uncertainty_tension_prompt": "What aspects of host-virus interactions in HCV replication remain unclear or need further research?"
    },
    {
      "activity_id": "A3",
      "title": "Misconception Confrontation: Differentiating HCV from Influenza and Retroviruses",
      "grouping": "small_group",
      "duration_minutes": 20,
      "mapped_learning_outcomes": [
        "LO3",
        "LO6"
      ],
      "required_materials": [
        {
          "material_id": "M3",
          "type": "prompt_set",
          "purpose": "Present common misconceptions and contrasting facts about HCV, influenza, and retroviruses",
          "specification": "Includes statements to evaluate and evidence excerpts from transcript"
        }
      ],
      "learner_task": "### Group Evaluation Task\n- Review the following claims:\n  1. HCV has a segmented genome like influenza.\n  2. HCV integrates into host DNA like retroviruses.\n- Discuss and decide if these claims are true or false based on evidence.\n- Prepare a group explanation correcting these misconceptions.",
      "expected_output": "Groups identify both claims as false, explaining that HCV does not have a segmented genome (unlike influenza) and does not integrate into host DNA (unlike retroviruses), supported by transcript evidence.",
      "failure_mode": "Groups accept misconceptions without evidence-based rejection or confuse characteristics of viruses.",
      "facilitator_moves": "Encourage evidence citation, ask probing questions to challenge assumptions, and summarize correct distinctions.",
      "misconception_claim": "**Misconception:** HCV shares genome segmentation with influenza and integrates into host DNA like retroviruses.\n",
      "reconciliation_prompt": "What key evidence helps distinguish HCV from influenza and retroviruses regarding genome structure and replication?",
      "evidence_contrast": "Transcript states influenza has segmentation; HCV does not. Retroviruses integrate into host DNA; HCV does not.",
      "transformation_activity": "Create a comparison table contrasting HCV, influenza, and retroviruses on genome type, segmentation, and integration.",
      "source_to_application_prompt": "How does understanding these differences aid in diagnosis or treatment strategies?",
      "uncertainty_tension_prompt": "Are there any grey areas or exceptions in virus classification that challenge these distinctions?"
    },
    {
      "activity_id": "A4",
      "title": "Analyzing Viral Quasispecies and Selection Pressure in RNA Viruses",
      "grouping": "individual",
      "duration_minutes": 15,
      "mapped_learning_outcomes": [
        "LO5",
        "LO6",
        "LO8"
      ],
      "required_materials": [
        {
          "material_id": "M4",
          "type": "text",
          "purpose": "Explain quasispecies concept and selection pressure in RNA viruses",
          "specification": "Contains transcript excerpt and definitions of quasispecies and viral evolution"
        }
      ],
      "learner_task": "### Reflective Analysis\n- Define what is meant by viral quasispecies.\n- Explain how selection pressure influences quasispecies generation in RNA viruses.\n- Identify any uncertainties or incomplete evidence about quasispecies dynamics from the transcript.",
      "expected_output": "Learners provide a definition of quasispecies as diverse viral populations generated by mutation under selection pressure, explain the evolutionary advantage, and note that the transcript implies but does not fully detail mechanisms or consequences, highlighting areas of uncertainty.",
      "failure_mode": "Learners confuse quasispecies with single viral genotypes or overlook uncertainty aspects.",
      "facilitator_moves": "Prompt learners to cite transcript evidence, clarify terminology, and encourage articulation of knowledge gaps.",
      "misconception_claim": "**Misconception:** RNA viruses exist as a single uniform genotype without variation.\n",
      "reconciliation_prompt": "How does the concept of quasispecies challenge the idea of a uniform viral population?",
      "evidence_contrast": "Transcript states many RNA viruses generate quasispecies under selection, indicating diversity rather than uniformity.",
      "transformation_activity": "Write a brief explanation contrasting uniform viral populations and quasispecies with examples.",
      "source_to_application_prompt": "How might quasispecies complexity affect vaccine or antiviral drug development?",
      "uncertainty_tension_prompt": "What are the limitations in current understanding of quasispecies evolution and its impact on viral pathogenicity?"
    },
    {
      "activity_id": "A5",
      "title": "Formative Assessment: Mixed-Mode Quiz on RNA Viruses and Hepatitis C",
      "grouping": "individual",
      "duration_minutes": 30,
      "mapped_learning_outcomes": [
        "LO1",
        "LO2",
        "LO3",
        "LO4",
        "LO5",
        "LO7",
        "LO8"
      ],
      "required_materials": [
        {
          "material_id": "M5",
          "type": "template",
          "purpose": "Assessment template with mixed question types (multiple choice, short answer, true/false)",
          "specification": "Questions cover genome types, HCV features, misconceptions, polymerase role, quasispecies, and uncertainty"
        },
        {
          "material_id": "M6",
          "type": "sample_output",
          "purpose": "Answer key with immediate self-check feedback for learners",
          "specification": "Includes explanations and references to transcript for each question"
        }
      ],
      "learner_task": "### Complete the following assessment:\n1. Multiple choice: Which genome type does HCV have?\n2. True/False: HCV integrates into host DNA like retroviruses.\n3. Short answer: Describe the role of microRNA-122 in HCV replication.\n4. Multiple choice: What enzyme is NS5B?\n5. True/False: Influenza has a segmented genome.\n6. Short answer: Explain what viral quasispecies are.\n7. Multiple choice: Which RNA virus genome polarity requires a virion polymerase?\n8. Short answer: Identify one uncertainty about RNA virus replication from the transcript.\n9. True/False: All RNA viruses produce quasispecies.\n10. Multiple choice: Which host cell type does HCV replicate in?",
      "expected_output": "Learners submit answers demonstrating comprehension with correct identification of HCV genome as positive-sense RNA, denial of integration into host DNA, explanation of microRNA-122 stabilizing 5' UTR, NS5B as RNA-dependent RNA polymerase, influenza segmentation true, quasispecies definition, negative-sense RNA requiring virion polymerase, articulation of uncertainty (e.g., mechanisms of quasispecies evolution), recognition that many but not necessarily all RNA viruses produce quasispecies, and hepatocytes as replication site.",
      "failure_mode": "Learners guess without reference to transcript content or show persistent misconceptions.",
      "facilitator_moves": "Provide immediate feedback after each question, clarify misconceptions, and encourage reflection on uncertainties.",
      "misconception_claim": "**Misconception:** HCV integrates into host DNA and has a segmented genome like influenza.\n",
      "reconciliation_prompt": "Review your answers and explain how the transcript evidence supports or refutes these misconceptions.",
      "evidence_contrast": "Transcript clearly distinguishes HCV from retroviruses and influenza in genome and replication features.",
      "transformation_activity": "Correct any incorrect answers by rewriting explanations using transcript facts.",
      "source_to_application_prompt": "How does this assessment help you apply transcript knowledge to real-world virus understanding?",
      "uncertainty_tension_prompt": "Reflect on any questions where the transcript leaves room for doubt or incomplete evidence."
    }
  ],
  "outcome_alignment": {
    "LO1": [
      "A1",
      "A5"
    ],
    "LO2": [
      "A2",
      "A5"
    ],
    "LO3": [
      "A3",
      "A5"
    ],
    "LO4": [
      "A2",
      "A5"
    ],
    "LO5": [
      "A4",
      "A5"
    ],
    "LO6": [
      "A1",
      "A2",
      "A3",
      "A4"
    ],
    "LO7": [
      "A5"
    ],
    "LO8": [
      "A4",
      "A5"
    ]
  },
  "delivery_notes": "Activities are designed for face-to-face classroom delivery with varied grouping modes (whole group, pairs, small groups, individual). Facilitators should prepare required materials in advance and guide discussions to ensure misconceptions are confronted with transcript evidence. Immediate self-check feedback is integrated in the formative assessment to support learner reflection. Facilitators should be ready to scaffold understanding and highlight areas of uncertainty to deepen cognitive engagement."
}
```

**DLA contract audit:**

```json
{
  "required": [
    "misconception_claim",
    "reconciliation_prompt",
    "evidence_contrast",
    "transformation_activity",
    "source_to_application_prompt",
    "uncertainty_tension_prompt"
  ],
  "generated": [
    "misconception_claim",
    "reconciliation_prompt",
    "evidence_contrast",
    "transformation_activity",
    "source_to_application_prompt",
    "uncertainty_tension_prompt"
  ],
  "missing": [],
  "satisfied": true
}
```

## E. activity_materials (G)

```
Activity: Clarifying RNA Virus Genome Types and Replication Mechanisms  
Activity ID: A1  
Mapped outcomes: LO1, LO6  

Material: M1 (prompt_set)  
Purpose: Provide discussion prompts on RNA virus genome types and replication  
Content:  
### Discussion Prompts on RNA Virus Genome Types and Replication

- Explain the difference between positive-sense and negative-sense RNA viruses.  
- Discuss why negative-sense RNA viruses require a virion polymerase for replication.  
- Summarize how these genome types influence viral replication strategies.  

Facilitator use:  
Introduce this prompt set at the start of the whole-group discussion. Use these questions to guide learners through the key concepts of RNA virus genome polarity and replication mechanisms. Prompt learners to explain in their own words, and use follow-up questions to clarify misunderstandings. Refer back to transcript evidence as needed to reinforce correct understanding.  

---

Activity: Pair Task: Exploring Hepatitis C Virus Characteristics and Host Interactions  
Activity ID: A2  
Mapped outcomes: LO2, LO4, LO6  

Material: M2 (task_cards)  
Purpose: Guide pairs through key HCV features and host factor roles  
Content:  

**Task Card 1: HCV Genome and Replication Site**  
- What type of RNA genome does Hepatitis C virus (HCV) have?  
- In which host cell type does HCV replicate?  

**Task Card 2: Role of Host microRNA-122**  
- What is the function of host microRNA-122 in relation to HCV?  
- How does microRNA-122 affect the viral 5' untranslated region (5' UTR)?  

**Task Card 3: Viral Enzyme NS5B**  
- What is NS5B in HCV?  
- What role does NS5B play in the viral replication cycle?  

**Task Card 4: Joint Explanation Preparation**  
- Using the information from the other cards, prepare a brief explanation of how HCV replicates, including the role of host factors and viral enzymes.  
- Be ready to present your explanation to the group.  

Facilitator use:  
Distribute one card per learner or per pair member to encourage collaboration. Circulate to prompt deeper reasoning and ask guiding questions about microRNA-122 and NS5B polymerase. Encourage pairs to use precise terminology and to prepare a clear joint explanation for group sharing.  

---

Activity: Misconception Confrontation: Differentiating HCV from Influenza and Retroviruses  
Activity ID: A3  
Mapped outcomes: LO3, LO6  

Material: M3 (prompt_set)  
Purpose: Present common misconceptions and contrasting facts about HCV, influenza, and retroviruses  
Content:  

### Claims to Evaluate

1. **Claim:** Hepatitis C virus (HCV) has a segmented genome like influenza virus.  
2. **Claim:** HCV integrates its genome into host DNA like retroviruses.  

### Discussion Questions

- Are these claims true or false based on the transcript evidence?  
- What evidence supports your conclusion?  
- How would you explain these misconceptions to someone who believes them?  

Facilitator use:  
Present these claims to small groups and ask them to discuss and decide on their validity. Encourage groups to cite transcript evidence distinguishing HCV from influenza and retroviruses. Facilitate a group explanation session where misconceptions are corrected with clear reasoning. Use probing questions to challenge assumptions and summarize key points.  

---

Activity: Analyzing Viral Quasispecies and Selection Pressure in RNA Viruses  
Activity ID: A4  
Mapped outcomes: LO5, LO6, LO8  

Material: M4 (text)  
Purpose: Explain quasispecies concept and selection pressure in RNA viruses  
Content:  

### Understanding Viral Quasispecies and Selection Pressure

- **What are viral quasispecies?**  
  Viral quasispecies are diverse populations of closely related viral variants generated by mutations during viral replication. Instead of a single uniform genotype, RNA viruses often exist as a cloud of genetically varied variants.  

- **How does selection pressure influence quasispecies generation?**  
  Selection pressure from the host immune system, antiviral drugs, or environmental factors favors certain viral variants over others. This drives the evolution and adaptation of the viral population within the host.  

- **What uncertainties remain about quasispecies dynamics?**  
  The transcript indicates that many RNA viruses generate quasispecies under selection but does not fully detail the mechanisms or consequences of this diversity. Questions remain about how quasispecies affect viral pathogenicity, transmission, and resistance evolution.  

Facilitator use:  
Use this text as a reference for individual reflection. Prompt learners to cite transcript evidence and clarify terminology. Encourage articulation of knowledge gaps and uncertainties to deepen understanding of viral evolution concepts.  

---

Activity: Formative Assessment: Mixed-Mode Quiz on RNA Viruses and Hepatitis C  
Activity ID: A5  
Mapped outcomes: LO1, LO2, LO3, LO4, LO5, LO7, LO8  

Material: M5 (template)  
Purpose: Assessment template with mixed question types (multiple choice, short answer, true/false)  
Content:  

### Formative Assessment: RNA Viruses and Hepatitis C

Please answer the following questions. After each question, check your answer against the provided answer key for immediate feedback.

1. **Multiple Choice:** Which genome type does Hepatitis C virus (HCV) have?  
   a) Negative-sense RNA  
   b) Positive-sense RNA  
   c) Double-stranded DNA  
   d) Segmented RNA  

2. **True/False:** HCV integrates into host DNA like retroviruses.  

3. **Short Answer:** Describe the role of host microRNA-122 in HCV replication.  

4. **Multiple Choice:** What enzyme is NS5B in HCV?  
   a) DNA polymerase  
   b) RNA-dependent RNA polymerase  
   c) Reverse transcriptase  
   d) Protease  

5. **True/False:** Influenza virus has a segmented genome.  

6. **Short Answer:** Explain what viral quasispecies are.  

7. **Multiple Choice:** Which RNA virus genome polarity requires a virion polymerase for replication?  
   a
```

## F. assessment_items (G)

```json
{
  "page": {
    "title": "RNA Viruses and Hepatitis C: Dialogic Learning Activities and Formative Assessment",
    "activities": [
      {
        "type": "discussion_prompt",
        "id": "DP1",
        "prompt": "Discuss how the genome type of RNA viruses (positive-sense vs. negative-sense) influences their replication strategies. How does this relate specifically to Hepatitis C virus?",
        "linked_learning_outcomes": [
          "LO1",
          "LO2"
        ]
      },
      {
        "type": "misconception_repair",
        "id": "MR1",
        "misconception_claim": "Hepatitis C virus has a segmented genome like influenza virus.",
        "reconciliation_prompt": "Consider the structural differences between influenza virus and HCV genomes. How does the segmentation of influenza virus differ from HCV's genome organization?",
        "evidence_contrast": "Influenza virus genome is segmented, allowing reassortment, whereas HCV has a single positive-sense RNA genome without segmentation.",
        "linked_learning_outcomes": [
          "LO3"
        ]
      },
      {
        "type": "misconception_repair",
        "id": "MR2",
        "misconception_claim": "Hepatitis C virus integrates its genome into host DNA like retroviruses.",
        "reconciliation_prompt": "Reflect on the replication mechanisms of HCV compared to retroviruses. What evidence from the transcript supports or contradicts genome integration by HCV?",
        "evidence_contrast": "HCV is a positive-sense RNA virus that replicates in the cytoplasm without integrating into host DNA, unlike retroviruses which reverse transcribe and integrate.",
        "linked_learning_outcomes": [
          "LO3"
        ]
      },
      {
        "type": "pair_task",
        "id": "PT1",
        "transformation_activity": "In pairs, create a diagram showing the role of host microRNA-122 and viral NS5B polymerase in HCV replication. Include annotations explaining their functions.",
        "source_to_application_prompt": "Using the transcript, how do microRNA-122 and NS5B contribute to the stability and replication of HCV RNA?",
        "uncertainty_tension_prompt": "Discuss any uncertainties about how host factors might influence viral replication beyond what is described here.",
        "linked_learning_outcomes": [
          "LO2",
          "LO4",
          "LO8"
        ]
      },
      {
        "type": "discussion_prompt",
        "id": "DP2",
        "prompt": "What is the significance of RNA virus quasispecies generation under selection pressure? How might this affect treatment strategies for HCV?",
        "linked_learning_outcomes": [
          "LO5"
        ]
      }
    ],
    "formative_assessment": {
      "id": "FA1",
      "total_items": 10,
      "feedback_timing": "immediate_self_check",
      "items": [
        {
          "id": "Q1",
          "type": "multiple_choice",
          "question": "What type of genome does Hepatitis C virus have?",
          "options": [
            "Segmented negative-sense RNA",
            "Non-segmented positive-sense RNA",
            "Double-stranded DNA",
            "Single-stranded DNA"
          ],
          "correct_answer": "Non-segmented positive-sense RNA",
          "explanation": "HCV is a positive-sense RNA virus with a single, non-segmented genome."
        },
        {
          "id": "Q2",
          "type": "true_false",
          "question": "Hepatitis C virus requires its own RNA-dependent RNA polymerase called NS5B for replication.",
          "correct_answer": true,
          "explanation": "NS5B is the viral RNA-dependent RNA polymerase essential for HCV RNA replication."
        },
        {
          "id": "Q3",
          "type": "multiple_choice",
          "question": "Which host factor stabilizes the 5' UTR of HCV RNA?",
          "options": [
            "microRNA-122",
            "DNA polymerase",
            "Reverse transcriptase",
            "Hemagglutinin"
          ],
          "correct_answer": "microRNA-122",
          "explanation": "Host microRNA-122 binds and stabilizes the HCV 5' untranslated region."
        },
        {
          "id": "Q4",
          "type": "multiple_choice",
          "question": "Which statement about influenza virus and HCV is correct?",
          "options": [
            "Both have segmented RNA genomes.",
            "Only influenza virus has a segmented RNA genome.",
            "Only HCV has a segmented RNA genome.",
            "Neither virus has an RNA genome."
          ],
          "correct_answer": "Only influenza virus has a segmented RNA genome.",
          "explanation": "Influenza virus genome is segmented; HCV genome is non-segmented."
        },
        {
          "id": "Q5",
          "type": "true_false",
          "question": "HCV integrates its RNA genome into the host DNA during infection.",
          "correct_answer": false,
          "explanation": "HCV does not integrate into host DNA; it replicates in the cytoplasm."
        },
        {
          "id": "Q6",
          "type": "short_answer",
          "question": "Explain why positive-sense RNA viruses can be directly translated by host ribosomes.",
          "correct_answer": "Because their RNA genome has the same polarity as mRNA, allowing direct translation.",
          "explanation": "Positive-sense RNA is equivalent to mRNA and can be immediately translated."
        },
        {
          "id": "Q7",
          "type": "multiple_choice",
          "question": "What is a quasispecies in the context of RNA viruses?",
          "options": [
            "A single, uniform viral genome sequence.",
            "A population of genetically diverse viral variants.",
            "A type of host immune cell.",
            "A viral protein complex."
          ],
          "correct_answer": "A population of genetically diverse viral variants.",
          "explanation": "RNA viruses generate quasispecies—diverse variants under selection pressu
```

## G. Composed page after 28-5d pass (C)

```json
{
  "artifact_type": "page",
  "title": "RNA Viruses and Hepatitis C: Dialogic Learning Activities and Formative Assessment",
  "audience": "Learners in a classroom setting studying RNA viruses and Hepatitis C",
  "page_profile": "learner",
  "sections": [
    {
      "heading": "Introduction to RNA Viruses and Hepatitis C",
      "content": "RNA viruses carry RNA genomes that vary in polarity and structure. Positive-sense RNA viruses have genomes that can be directly translated by host ribosomes, while negative-sense RNA viruses require a virion-encoded RNA-dependent RNA polymerase to generate a positive-sense RNA before translation. Hepatitis C virus (HCV) is a positive-sense RNA flavivirus that replicates in hepatocytes. Host microRNA-122 plays a crucial role in stabilizing the HCV 5' untranslated region (5' UTR), enhancing viral RNA stability and replication. The viral enzyme NS5B functions as an RNA-dependent RNA polymerase essential for viral RNA synthesis. Many RNA viruses, including HCV, generate quasispecies—a diverse population of related viral variants under selection pressure—allowing rapid adaptation. Common misconceptions include confusing HCV with influenza virus regarding genome segmentation and assuming HCV integrates into host DNA like retroviruses. This session includes dialogic learning activities designed to explore these concepts deeply and a formative assessment to check understanding.",
      "section_id": "overview"
    },
    {
      "heading": "Learning Outcomes",
      "content": "By engaging with the activities and assessment on this page, you will be able to:\n- Explain differences between positive- and negative-sense RNA virus genomes and their replication mechanisms.\n- Describe key characteristics of Hepatitis C virus, including genome type, replication site, and host-virus interactions.\n- Identify and correct common misconceptions about HCV related to genome segmentation and integration.\n- Understand the concept of viral quasispecies and their role in RNA virus evolution.\n- Reflect on uncertainties and incomplete evidence in RNA virus replication and host interactions.",
      "section_id": "learning_purpose"
    },
    {
      "heading": "Learning Activities",
      "content": [
        {
          "title": "Clarifying RNA Virus Genome Types and Replication Mechanisms",
          "duration_minutes": 20,
          "purpose": "Explore the fundamental differences between positive-sense and negative-sense RNA viruses and how these differences affect viral replication.",
          "learner_task": "### Discussion Prompt\n- Explain the difference between positive-sense and negative-sense RNA viruses.\n- Discuss why negative-sense RNA viruses require a virion polymerase for replication.\n- Summarize how these genome types influence viral replication strategies.",
          "materials": {
            "prompt_set": "### Discussion Prompts on RNA Virus Genome Types and Replication\n\n- Explain the difference between positive-sense and negative-sense RNA viruses.  \n- Discuss why negative-sense RNA viruses require a virion polymerase for replication.  \n- Summarize how these genome types influence viral replication strategies.\n\nFacilitator use:  \nIntroduce this prompt set at the start of the whole-group discussion. Use these questions to guide learners through the key concepts of RNA virus genome polarity and replication mechanisms. Prompt learners to explain in their own words, and use follow-up questions to clarify misunderstandings. Refer back to transcript evidence as needed to reinforce correct understanding."
          },
          "expected_output": "Learners articulate that positive-sense RNA can be directly translated by host ribosomes, whereas negative-sense RNA requires a virion-encoded RNA-dependent RNA polymerase to synthesize a positive-sense RNA before translation. They link genome type to replication mechanism.",
          "facilitator_notes": "Prompt clarification questions, provide examples contrasting positive and negative RNA viruses, and restate key points to reinforce correct understanding.",
          "misconception_claim": "All RNA viruses can be directly translated by host ribosomes.",
          "reconciliation_prompt": "How does the requirement of a virion polymerase for negative-sense RNA viruses change their replication compared to positive-sense RNA viruses?",
          "evidence_contrast": "The transcript states positive-sense RNA can be translated directly; negative-sense RNA requires virion polymerase, highlighting a fundamental replication difference.",
          "transformation_activity": "Rewrite a short explanation contrasting positive- and negative-sense RNA virus replication in your own words.",
          "source_to_application_prompt": "Based on this, how might antiviral drugs target the polymerase activity in negative-sense RNA viruses?",
          "uncertainty_tension_prompt": "What uncertainties might arise in understanding replication if a virus has an atypical genome structure or polymerase requirement?"
        },
        {
          "title": "Pair Task: Exploring Hepatitis C Virus Characteristics and Host Interactions",
          "duration_minutes": 25,
          "purpose": "Investigate key features of HCV and the role of host factors in its replication.",
          "learner_task": "### Pair Discussion and Explanation\n- Identify and describe the genome type of HCV and where it replicates.\n- Explain the role of host microRNA-122 in HCV replication.\n- Discuss the function of the viral NS5B polymerase.\n- Prepare a brief joint explanation to present to the group.",
          "materials": {
            "task_cards": "**Task Card 1: HCV Genome and Replication Site**  \n- What type of RNA genome does Hepatitis C virus (HCV) have?  \n- In which host cell type does HCV replicate?  \n\n**Task Card 2: Role of Host microRNA-122**  \n- What is the function of host microRNA-122 in relation to HCV?  \n- How does microRNA-122 affect the viral 5' untranslated region (5' UTR)?  \n\n**Task Card 3: Viral Enzyme NS5B**  \n- What is NS5B in HCV?  \n- What role does NS5B play in the viral replication cycle?  \n\n**Task Card 4: Joint Explanation Preparation**  \n- Using the information from the other cards, prepare a brief explanation of how HCV replicates, including the role of host factors and viral enzymes.  \n- Be ready to present your explanation to the group.",
            "facilitator_use": "Distribute one card per learner or per pair member to encourage collaboration. Circulate to prompt deeper reasoning and ask guiding questions about microRNA-122 and NS5B polymerase. Encourage pairs to use precise terminology and to prepare a clear joint explanation for group sharing."
          },
          "expected_output": "Pairs produce a clear explanation that HCV is a positive-sense flavivirus replicating in hepatocytes; microRNA-122 stabilizes the viral 5' UTR enhancing replication; NS5B is the RNA-dependent RNA polymerase essential for viral RNA synthesis.",
          "facilitator_notes": "Circulate to prompt deeper reasoning, ask guiding questions about microRNA-122 and NS5B, and encourage precise use of terminology.",
          "misconception_claim": "HCV integrates into host DNA like retroviruses.",
          "reconciliation_prompt": "How does HCV replication differ from retroviruses in terms of genome integration and replication strategy?",
          "evidence_contrast": "The transcript clarifies HCV is a positive-sense RNA virus replicating in hepatocytes without genome integration, unlike retroviruses.",
          "transformation_activity": "Create a concept map linking HCV genome, host microRNA-122, NS5B polymerase, and replication site.",
          "source_to_application_prompt": "How might targeting microRNA-122 or NS5B polymerase affect HCV replication therapeutically?",
          "uncertainty_tension_prompt": "What aspects of host-virus interactions in HCV replication remain unclear or need further research?"
        },
        {
          "title": "Misconception Confrontation: Differentiating HCV from Influenza and Retroviruses",
          "duration_minutes": 20,
          "purpose": "Evaluate and correct common misconceptions about HCV genome segmentation and integration.",
          "learner_task": "### Group Evaluation Task\n- Review the following claims:\n  1. HCV has a segmented genome like influenza.\n  2. HCV integrates into host DNA like retroviruses.\n- Discuss and decide if these claims are true or false based on evidence.\n- Prepare a group explanation correcting these misconceptions.",
          "materials": {
            "prompt_set": "### Claims to Evaluate\n\n1. **Claim:** Hepatitis C virus (HCV) has a segmented genome like influenza virus.  \n2. **Claim:** HCV integrates its genome into host DNA like retroviruses.  \n\n### Discussion Questions\n\n- Are these claims true or false based on the transcript evidence?  \n- What evidence supports your conclusion?  \n- How would you explain these misconceptions to someone who believes them?",
            "facilitator_use": "Present these claims to small groups and ask them to discuss and decide on their validity. Encourage groups to cite transcript evidence distinguishing HCV from influenza and retroviruses. Facilitate a group explanation session where misconceptions are corrected with clear reasoning. Use probing questions to challenge assumptions and summarize key points."
          },
          "expected_output": "Groups identify both claims as false, explaining that HCV does not have a segmented genome (unlike influenza) and does not integrate into host DNA (unlike retroviruses), supported by transcript evidence.",
          "facilitator_notes": "Encourage evidence citation, ask probing questions to challenge assumptions, and summarize correct distinctions.",
          "misconception_claim": "HCV shares genome segmentation with influenza and integrates into host DNA like retroviruses.",
          "reconciliation_prompt": "What key evidence helps distinguish HCV from influenza and retroviruses regarding genome structure and replication?",
          "evidence_contrast": "Transcript states influenza has segmentation; HCV does not. Retroviruses integrate into host DNA; HCV does not.",
          "transformation_activity": "Create a comparison table contrasting HCV, influenza, and retroviruses on genome type, segmentation, and integration.",
          "source_to_application_prompt": "How does understanding these differences aid in diagnosis or treatment strategies?",
          "uncertainty_tension_prompt": "Are there any grey areas or exceptions in virus classification that challenge these distinctions?"
        },
        {
          "title": "Analyzing Viral Quasispecies and Selection Pressure in RNA Viruses",
          "duration_minutes": 15,
          "purpose": "Reflect on the concept of viral quasispecies and the influence of selection pressure on RNA virus populations.",
          "learner_task": "### Reflective Analysis\n- Define what is meant by viral quasispecies.\n- Explain how selection pressure influences quasispecies generation in RNA viruses.\n- Identify any uncertainties or incomplete evidence about quasispecies dynamics from the transcript.",
          "materials": {
            "text": "### Understanding Viral Quasispecies and Selection Pressure\n\n- **What are viral quasispecies?**  \n  Viral quasispecies are diverse populations of closely related viral variants generated by mutations during viral replication. Instead of a single uniform genotype, RNA viruses often exist as a cloud of genetically varied variants.  \n\n- **How does selection pressure influence quasispecies generation?**  \n  Selection pressure from the host immune system, antiviral drugs, or environmental factors favors certain viral variants over others. This drives the evolution and adaptation of the viral population within the host.  \n\n- **What uncertainties remain about quasispecies dynamics?**  \n  The transcript indicates that many RNA viruses generate quasispecies under selection but does not fully detail the mechanisms or consequences of this diversity. Questions remain about how quasispecies affect viral pathogenicity, transmission, and resistance evolution.",
            "facilitator_use": "Use this text as a reference for individual reflection. Prompt learners to cite transcript evidence and clarify terminology. Encourage articulation of knowledge gaps and uncertainties to deepen understanding of viral evolution concepts."
          },
          "expected_output": "Learners provide a definition of quasispecies as diverse viral populations generated by mutation under selection pressure, explain the evolutionary advantage, and note that the transcript implies but does not fully detail mechanisms or consequences, highlighting areas of uncertainty.",
          "facilitator_notes": "Prompt learners to cite transcript evidence, clarify terminology, and encourage articulation of knowledge gaps.",
          "misconception_claim": "RNA viruses exist as a single uniform genotype without variation.",
          "reconciliation_prompt": "How does the concept of quasispecies challenge the idea of a uniform viral population?",
          "evidence_contrast": "Transcript states many RNA viruses generate quasispecies under selection, indicating diversity rather than uniformity.",
          "transformation_activity": "Write a brief explanation contrasting uniform viral populations and quasispecies with examples.",
          "source_to_application_prompt": "How might quasispecies complexity affect vaccine or antiviral drug development?",
          "uncertainty_tension_prompt": "What are the limitations in current understanding of quasispecies evolution and its impact on viral pathogenicity?"
        }
      ],
      "section_id": "learning_activities"
    },
    {
      "heading": "Formative Assessment Check",
      "content": {

```

**Composition parity:**

```json
{
  "sectionIds": [
    "overview",
    "learning_purpose",
    "learning_activities",
    "assessment_check"
  ],
  "learningActivitiesBeforeAssessment": true,
  "cognitionProfile": {
    "active": true,
    "pack_ids": [
      "misconception_repair_pack",
      "transcript_transformation_pack"
    ],
    "cognition_fields": [
      "misconception_claim",
      "reconciliation_prompt",
      "evidence_contrast",
      "transformation_activity",
      "source_to_application_prompt",
      "uncertainty_tension_prompt"
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
| Page section_ids | Often non-canonical | overview, learning_purpose, learning_activities, assessment_check |
| Cognition fields in DLA | Usually absent | satisfied=true |
| LA before assessment | Variable | yes |
| Assessment dominance | MCQ-only pages possible | injection + reorder when packs active |

## I. Investigator notes

- Sprint 28 adds **structural** preservation; live LLM compliance with typed fields remains variable.
- Composition pass is deterministic; G outputs still depend on model + prompt adherence.
- Sprint 27 assessment presentation preserved via `applyAssessmentSemanticsToComposedPage` after cognition pass.
