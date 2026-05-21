# P28-07 — live workflow probe (28-3)

**Captured:** 2026-05-21
**Method:** Pack prompt templates + `extractWorkflowBriefExplicitFactors` / heuristics; OpenAI `gpt-4.1-mini` step chain (DLA→GAM→GAI→Design Page).

## A. Exact brief

**Goal:**

> Using the provided lecture transcript on RNA viruses and hepatitis C, create dialogic learning activities (discussion prompts, misconception confrontation, pair tasks) and a short formative assessment. Do not invent facts beyond the transcript; surface uncertainty where evidence is incomplete.

**Inputs:** Uploaded lecture transcript excerpt:

RNA viruses carry RNA genomes. Positive-sense RNA can be translated directly; negative-sense RNA requires virion polymerase. Hepatitis C virus (HCV) is a positive-sense flavivirus replicating in hepatocytes. Host microRNA-122 stabilises the HCV 5' UTR. NS5B is the RNA-dependent RNA polymerase. Many RNA viruses generate quasispecies under selection. Learners often confuse influenza segmentation with HCV, or assume HCV integrates into host DNA like retroviruses.

**Desired outputs:** Learner-facing page with activities and formative check.

## B. Resolved factors (E)

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
    "topic": "rna viruses and hepatitis c",
    "workshop_subject": "rna viruses and hepatitis c",
    "materials_required": true,
    "output_depth": "concise"
  },
  "resolved": {
    "assessment_interaction_mode": "discussion_oriented"
  },
  "presentation": {
    "hasSemanticPresentation": false,
    "learnerAnswerVisibility": "",
    "feedbackTiming": "",
    "includeAnswers": null,
    "feedbackDisplay": ""
  }
}
```

## C. Topology (O)

Normalize Content → Model Knowledge → Define Learning Outcomes → Design Learning Activities → Generate Activity Materials → Generate Assessment Items → Design Page

## D. learning_activities (G)

```json
{
  "activities": [
    {
      "activity_id": "A1",
      "title": "Classifying RNA Viruses and HCV Features",
      "grouping": "individual",
      "duration_minutes": 15,
      "mapped_learning_outcomes": [
        "LO1",
        "LO2",
        "LO4"
      ],
      "required_materials": [
        {
          "material_id": "M1",
          "type": "prompt_set",
          "purpose": "Guide learners to differentiate positive-sense and negative-sense RNA viruses and identify HCV key features",
          "specification": "Contains prompts asking learners to classify RNA viruses by genome type and explain translation/replication differences; includes questions on HCV classification, genome type, replication site, and NS5B function"
        }
      ],
      "learner_task": "### Task\n- Read each prompt carefully.\n- For each RNA virus type, explain whether its genome can be directly translated or requires a polymerase.\n- Describe the key features of Hepatitis C virus, including its classification, genome type, and where it replicates.\n- Explain the role of NS5B in HCV replication.\n\n### Deliverable\n- Submit written answers addressing each prompt clearly.",
      "expected_output": "Clear, concise explanations distinguishing positive-sense and negative-sense RNA viruses; accurate description of HCV as a positive-sense flavivirus replicating in hepatocytes; correct identification of NS5B as the RNA-dependent RNA polymerase.",
      "failure_mode": "Learners confuse genome polarity or replication sites; facilitator prompts recall of transcript definitions and asks for examples.",
      "facilitator_moves": "Encourage learners to reference transcript excerpts; ask probing questions to clarify misunderstandings; provide hints about translation and polymerase roles."
    },
    {
      "activity_id": "A2",
      "title": "Pair Task: Exploring microRNA-122 and Viral Quasispecies",
      "grouping": "pair",
      "duration_minutes": 20,
      "mapped_learning_outcomes": [
        "LO3",
        "LO5"
      ],
      "required_materials": [
        {
          "material_id": "M2",
          "type": "task_cards",
          "purpose": "Stimulate discussion on host microRNA-122 role and viral quasispecies concept",
          "specification": "Two sets of cards: one explaining microRNA-122 interaction with HCV 5' UTR; another describing quasispecies generation and selective pressures in RNA viruses"
        }
      ],
      "learner_task": "### Task\n- In pairs, use the task cards to:\n  1. Explain how host microRNA-122 stabilizes the HCV 5' UTR.\n  2. Discuss what viral quasispecies are and why RNA viruses generate them under selection.\n- Prepare a short summary to share with the group.",
      "expected_output": "A paired summary explaining microRNA-122's stabilizing effect on HCV RNA and a clear description of viral quasispecies generation and its evolutionary significance.",
      "failure_mode": "Pairs struggle to connect microRNA-122 to viral stability or misunderstand quasispecies; facilitator prompts with simplified analogies and asks pairs to revisit transcript sections.",
      "facilitator_moves": "Circulate to support pairs, clarify terms, encourage use of transcript language, and guide synthesis of key points."
    },
    {
      "activity_id": "A3",
      "title": "Whole Group Discussion: Confronting Misconceptions About HCV",
      "grouping": "whole_group",
      "duration_minutes": 15,
      "mapped_learning_outcomes": [
        "LO6",
        "LO7"
      ],
      "required_materials": [
        {
          "material_id": "M3",
          "type": "prompt_set",
          "purpose": "Present common misconceptions about HCV for group discussion",
          "specification": "Includes prompts highlighting confusion between influenza segmentation and HCV genome, and the incorrect belief that HCV integrates into host DNA"
        }
      ],
      "learner_task": "### Task\n- Discuss as a group the following misconceptions:\n  1. HCV genome is segmented like influenza virus.\n  2. HCV integrates into host DNA like retroviruses.\n- Use evidence from the transcript to support or refute these ideas.\n- Reach consensus on why these are misconceptions.",
      "expected_output": "Group consensus statements clearly explaining that HCV does not have a segmented genome and does not integrate into host DNA, supported by transcript evidence.",
      "failure_mode": "Dominance by few learners or persistent misconceptions; facilitator ensures inclusive participation and gently corrects errors with transcript references.",
      "facilitator_moves": "Prompt quieter learners, reframe misconceptions as questions, summarize key points, and reinforce correct understanding."
    },
    {
      "activity_id": "A4",
      "title": "Formative Assessment: Discussion-Oriented Quiz on RNA Virus Biology and HCV",
      "grouping": "small_group",
      "duration_minutes": 20,
      "mapped_learning_outcomes": [
        "LO1",
        "LO2",
        "LO3",
        "LO4",
        "LO5",
        "LO6"
      ],
      "required_materials": [
        {
          "material_id": "M4",
          "type": "prompt_set",
          "purpose": "Provide formative assessment questions for group discussion",
          "specification": "Contains 6 open-ended questions covering genome polarity, HCV classification and replication, microRNA-122 role, NS5B function, quasispecies concept, and misconceptions"
        }
      ],
      "learner_task": "### Task\n- In small groups, discuss each question from the prompt set.\n- Collaboratively formulate answers based on the transcript.\n- Prepare to present one group's answer for each question to the whole class.",
      "expected_output": "Group responses demonstrating understanding of RNA virus genome polarity, HCV biology, microRNA-122 role, NS5B function, viral quasispecies, and corrected misconceptions.",
      "failure_mode": "Groups provide incomplete or inaccurate answers; facilitator circulates to prompt deeper discussion and direct learners back to transcript evidence.",
      "facilitator_moves": "Encourage evidence-based answers, facilitate cross-group sharing, and highlight areas of uncertainty or incomplete evidence."
    }
  ],
  "outcome_alignment": {
    "LO1": [
      "A1",
      "A4"
    ],
    "LO2": [
      "A1",
      "A4"
    ],
    "LO3": [
      "A2",
      "A4"
    ],
    "LO4": [
      "A1",
      "A4"
    ],
    "LO5": [
      "A2",
      "A4"
    ],
    "LO6": [
      "A3",
      "A4"
    ],
    "LO7": [
      "A3"
    ]
  },
  "delivery_notes": "Activities progress from individual understanding (A1) to paired application (A2), whole group misconception confrontation (A3), and small group formative assessment (A4). Materials must be prepared to align closely with transcript content. Facilitators should actively monitor and guide discussions to ensure misconceptions are addressed and evidence-based reasoning is promoted. Timing is designed for a single session of approximately 70 minutes total."
}
```

## E. activity_materials (G)

```
Activity: Classifying RNA Viruses and HCV Features  
Activity ID: A1  
Mapped outcomes: LO1, LO2, LO4  

Material: M1 (prompt_set)  
Purpose: Guide learners to differentiate positive-sense and negative-sense RNA viruses and identify HCV key features  
Content:  
### Classification and Features of RNA Viruses and Hepatitis C Virus (HCV)  

1. **RNA Virus Genome Polarity**  
   - What is the difference between positive-sense and negative-sense RNA genomes?  
   - Can positive-sense RNA viruses have their genome directly translated by host ribosomes? Explain why or why not.  
   - Why do negative-sense RNA viruses require a virion polymerase for replication?  

2. **Hepatitis C Virus (HCV) Classification and Genome**  
   - To which virus family does HCV belong?  
   - Is the HCV genome positive-sense or negative-sense RNA?  
   - In which host cells does HCV primarily replicate?  

3. **HCV Replication and Key Proteins**  
   - What is the role of the NS5B protein in HCV replication?  
   - How does NS5B contribute to the viral life cycle?  

Facilitator use:  
Introduce this prompt set at the start of the activity for individual learners to read and respond to. Encourage learners to refer to transcript excerpts defining positive-sense and negative-sense RNA viruses and the description of HCV. Use these prompts to check understanding and clarify any confusion about genome polarity and replication mechanisms. Facilitate recall by asking learners for examples of viruses with each genome type and the role of NS5B in HCV. Provide hints about the necessity of polymerase for negative-sense RNA and direct learners to transcript language as needed.

---

Activity: Pair Task: Exploring microRNA-122 and Viral Quasispecies  
Activity ID: A2  
Mapped outcomes: LO3, LO5  

Material: M2 (task_cards)  
Purpose: Stimulate discussion on host microRNA-122 role and viral quasispecies concept  
Content:  

**Task Card Set 1: microRNA-122 and HCV**  
- Host microRNA-122 binds specifically to the 5' untranslated region (UTR) of the HCV RNA genome.  
- This binding stabilizes the viral RNA, protecting it from degradation.  
- Stabilization of the 5' UTR by microRNA-122 enhances viral RNA translation and replication efficiency.  
- This interaction is an example of a host factor that the virus exploits for its life cycle.  

**Task Card Set 2: Viral Quasispecies in RNA Viruses**  
- RNA viruses often generate a population of closely related but genetically diverse variants called quasispecies.  
- High mutation rates during RNA replication cause this diversity.  
- Quasispecies allow RNA viruses to adapt rapidly to selective pressures such as immune responses or antiviral drugs.  
- The presence of quasispecies under selection can lead to viral evolution and persistence.  

Facilitator use:  
Distribute one card from each set to each pair to discuss. Encourage pairs to explain in their own words how microRNA-122 stabilizes HCV RNA and why RNA viruses generate quasispecies. Circulate to clarify terminology, prompt pairs to revisit the transcript sections on microRNA-122 and quasispecies, and support synthesis of key points. After discussion, pairs prepare a short summary to present to the group, reinforcing understanding.

---

Activity: Whole Group Discussion: Confronting Misconceptions About HCV  
Activity ID: A3  
Mapped outcomes: LO6, LO7  

Material: M3 (prompt_set)  
Purpose: Present common misconceptions about HCV for group discussion  
Content:  
### Misconception Discussion Prompts  

1. **Misconception 1: HCV genome is segmented like influenza virus**  
   - Is the HCV genome segmented?  
   - How does this compare to the influenza virus genome?  
   - What evidence from the transcript supports your conclusion?  

2. **Misconception 2: HCV integrates into host DNA like retroviruses**  
   - Does HCV integrate its genome into the host DNA?  
   - How do retroviruses differ in this respect?  
   - What does the transcript say about HCV integration?  

Facilitator use:  
Use these prompts to initiate a whole group discussion. Present each misconception and ask learners to share their thoughts, encouraging evidence-based reasoning from the transcript. Manage participation to avoid dominance by a few learners and invite quieter members to contribute. Reframe misconceptions as questions to stimulate reflection. Summarize group consensus clearly, emphasizing that HCV does not have a segmented genome and does not integrate into host DNA, supported by transcript evidence.

---

Activity: Formative Assessment: Discussion-Oriented Quiz on RNA Virus Biology and HCV  
Activity ID: A4  
Mapped outcomes: LO1, LO2, LO3, LO4, LO5, LO6  

Material: M4 (prompt_set)  
Purpose: Provide formative assessment questions for group discussion  
Content:  
### Formative Assessment Questions  

1. What distinguishes positive-sense RNA viruses from negative-sense RNA viruses in terms of genome translation and replication?  

2. Describe the classification of Hepatitis C virus and identify the primary site of its replication in the host.  

3. Explain the role of host microRNA-122 in the life cycle of HCV.  

4. What is the function of the NS5B protein in HCV replication?  

5. Define viral quasispecies and explain why RNA viruses generate them under selective pressures.  

6. Identify two common misconceptions about HCV and explain why they are incorrect based on transcript evidence.  

Facilitator use:  
Divide learners into small groups and provide this prompt set for discussion. Encourage groups to collaboratively formulate answers using the transcript as evidence. Circulate to prompt deeper discussion where answers are incomplete or inaccurate. After group discussions, facilitate sharing of one group's answer per question with the whole class. Highlight correct understanding, clarify uncertainties, and reinforce evidence-based reasoning. Use this as a check for learning and to address remaining misconceptions.
```

## F. assessment_items (G)

```json
{
  "dialogic_learning_activities": [
    {
      "type": "discussion_prompt",
      "prompt": "Discuss the differences between positive-sense and negative-sense RNA viruses in terms of how their genomes are translated and replicated. Why does negative-sense RNA require a virion polymerase?"
    },
    {
      "type": "misconception_confrontation",
      "prompt": "Many learners confuse Hepatitis C virus with influenza virus because of genome segmentation or mistakenly believe HCV integrates into host DNA like retroviruses. Review these misconceptions and explain why they are incorrect based on the characteristics of HCV."
    },
    {
      "type": "pair_task",
      "task": "In pairs, explain the role of host microRNA-122 in stabilizing the HCV 5' untranslated region (UTR) and discuss how this interaction might affect viral replication."
    }
  ],
  "formative_assessment": {
    "interaction_mode": "discussion_oriented",
    "items": [
      {
        "id": "Q1",
        "type": "open_ended",
        "question": "What is the key difference between positive-sense and negative-sense RNA viruses in terms of genome translation?",
        "linked_learning_outcome": "LO1"
      },
      {
        "id": "Q2",
        "type": "open_ended",
        "question": "Describe the classification and replication site of Hepatitis C virus (HCV).",
        "linked_learning_outcome": "LO2"
      },
      {
        "id": "Q3",
        "type": "open_ended",
        "question": "Explain the role of host microRNA-122 in the life cycle of HCV.",
        "linked_learning_outcome": "LO3"
      },
      {
        "id": "Q4",
        "type": "open_ended",
        "question": "What is the function of the NS5B protein in HCV replication?",
        "linked_learning_outcome": "LO4"
      },
      {
        "id": "Q5",
        "type": "discussion_prompt",
        "question": "Why do RNA viruses, including HCV, generate quasispecies under selective pressures? How might this affect treatment or immune response?",
        "linked_learning_outcome": "LO5"
      }
    ]
  }
}
```

## G. Composed page (C)

```json
{
  "artifact_type": "page",
  "title": "Understanding RNA Viruses and Hepatitis C Virus (HCV): Learning Activities and Formative Assessment",
  "audience": "Learners studying RNA virus biology and Hepatitis C virus",
  "page_profile": "learner",
  "sections": [
    {
      "heading": "Introduction to RNA Viruses and Hepatitis C Virus",
      "content": "RNA viruses carry RNA genomes that differ in polarity: positive-sense RNA genomes can be directly translated by host ribosomes, while negative-sense RNA genomes require a virion polymerase to synthesize a complementary positive strand before translation. Hepatitis C virus (HCV) is a positive-sense RNA virus belonging to the flavivirus family. It primarily replicates in hepatocytes (liver cells). A key host factor, microRNA-122, binds and stabilizes the HCV 5' untranslated region (UTR), enhancing viral RNA stability and replication. The viral NS5B protein functions as an RNA-dependent RNA polymerase essential for HCV genome replication. RNA viruses, including HCV, often generate quasispecies—populations of genetically diverse variants—under selective pressures, enabling rapid adaptation. Common misconceptions include confusing HCV's genome with segmented influenza virus genomes and incorrectly believing HCV integrates into host DNA like retroviruses. This page guides you through activities to deepen your understanding and confront these misconceptions."
    },
    {
      "heading": "Learning Activities",
      "content": [
        {
          "title": "Classifying RNA Viruses and HCV Features",
          "duration_minutes": 15,
          "purpose": "This individual activity guides you to differentiate positive-sense and negative-sense RNA viruses and identify key features of Hepatitis C virus.",
          "learner_task": "### Task\n- Read each prompt carefully.\n- For each RNA virus type, explain whether its genome can be directly translated or requires a polymerase.\n- Describe the key features of Hepatitis C virus, including its classification, genome type, and where it replicates.\n- Explain the role of NS5B in HCV replication.\n\n### Deliverable\n- Submit written answers addressing each prompt clearly.",
          "materials": {
            "prompt_set": "### Classification and Features of RNA Viruses and Hepatitis C Virus (HCV)\n\n1. **RNA Virus Genome Polarity**\n   - What is the difference between positive-sense and negative-sense RNA genomes?\n   - Can positive-sense RNA viruses have their genome directly translated by host ribosomes? Explain why or why not.\n   - Why do negative-sense RNA viruses require a virion polymerase for replication?\n\n2. **Hepatitis C Virus (HCV) Classification and Genome**\n   - To which virus family does HCV belong?\n   - Is the HCV genome positive-sense or negative-sense RNA?\n   - In which host cells does HCV primarily replicate?\n\n3. **HCV Replication and Key Proteins**\n   - What is the role of the NS5B protein in HCV replication?\n   - How does NS5B contribute to the viral life cycle?\n\nFacilitator use:\nIntroduce this prompt set at the start of the activity for individual learners to read and respond to. Encourage learners to refer to transcript excerpts defining positive-sense and negative-sense RNA viruses and the description of HCV. Use these prompts to check understanding and clarify any confusion about genome polarity and replication mechanisms. Facilitate recall by asking learners for examples of viruses with each genome type and the role of NS5B in HCV. Provide hints about the necessity of polymerase for negative-sense RNA and direct learners to transcript language as needed."
          },
          "expected_output": "Clear, concise explanations distinguishing positive-sense and negative-sense RNA viruses; accurate description of HCV as a positive-sense flavivirus replicating in hepatocytes; correct identification of NS5B as the RNA-dependent RNA polymerase.",
          "facilitator_notes": "Encourage learners to reference transcript excerpts; ask probing questions to clarify misunderstandings; provide hints about translation and polymerase roles."
        },
        {
          "title": "Pair Task: Exploring microRNA-122 and Viral Quasispecies",
          "duration_minutes": 20,
          "purpose": "In pairs, discuss the role of host microRNA-122 in stabilizing HCV RNA and the concept of viral quasispecies generated by RNA viruses under selective pressures.",
          "learner_task": "### Task\n- In pairs, use the task cards to:\n  1. Explain how host microRNA-122 stabilizes the HCV 5' UTR.\n  2. Discuss what viral quasispecies are and why RNA viruses generate them under selection.\n- Prepare a short summary to share with the group.",
          "materials": {
            "task_cards": {
              "microRNA-122_and_HCV": "- Host microRNA-122 binds specifically to the 5' untranslated region (UTR) of the HCV RNA genome.\n- This binding stabilizes the viral RNA, protecting it from degradation.\n- Stabilization of the 5' UTR by microRNA-122 enhances viral RNA translation and replication efficiency.\n- This interaction is an example of a host factor that the virus exploits for its life cycle.",
              "viral_quasispecies": "- RNA viruses often generate a population of closely related but genetically diverse variants called quasispecies.\n- High mutation rates during RNA replication cause this diversity.\n- Quasispecies allow RNA viruses to adapt rapidly to selective pressures such as immune responses or antiviral drugs.\n- The presence of quasispecies under selection can lead to viral evolution and persistence."
            }
          },
          "expected_output": "A paired summary explaining microRNA-122's stabilizing effect on HCV RNA and a clear description of viral quasispecies generation and its evolutionary significance.",
          "facilitator_notes": "Circulate to support pairs, clarify terms, encourage use of transcript language, and guide synthesis of key points."
        },
        {
          "title": "Whole Group Discussion: Confronting Misconceptions About HCV",
          "duration_minutes": 15,
          "purpose": "Discuss and clarify common misconceptions about Hepatitis C virus, specifically regarding genome segmentation and integration into host DNA.",
          "learner_task": "### Task\n- Discuss as a group the following misconceptions:\n  1. HCV genome is segmented like influenza virus.\n  2. HCV integrates into host DNA like retroviruses.\n- Use evidence from the transcript to support or refute these ideas.\n- Reach consensus on why these are misconceptions.",
          "materials": {
            "prompt_set": "### Misconception Discussion Prompts\n\n1. **Misconception 1: HCV genome is segmented like influenza virus**\n   - Is the HCV genome segmented?\n   - How does this compare to the influenza virus genome?\n   - What evidence from the transcript supports your conclusion?\n\n2. **Misconception 2: HCV integrates into host DNA like retroviruses**\n   - Does HCV integrate its genome into the host DNA?\n   - How do retroviruses differ in this respect?\n   - What does the transcript say about HCV integration?\n\nFacilitator use:\nUse these prompts to initiate a whole group discussion. Present each misconception and ask learners to share their thoughts, encouraging evidence-based reasoning from the transcript. Manage participation to avoid dominance by a few learners and invite quieter members to contribute. Reframe misconceptions as questions to stimulate reflection. Summarize group consensus clearly, emphasizing that HCV does not have a segmented genome and does not integrate into host DNA, supported by transcript evidence."
          },
          "expected_output": "Group consensus statements clearly explaining that HCV does not have a segmented genome and does not integrate into host DNA, supported by transcript evidence.",
          "facilitator_notes": "Prompt quieter learners, reframe misconceptions as questions, summarize key points, and reinforce correct understanding."
        },
        {
          "title": "Formative Assessment: Discussion-Oriented Quiz on RNA Virus Biology and HCV",
          "duration_minutes": 20,
          "purpose": "In small groups, discuss open-ended questions covering key concepts of RNA virus genome polarity, HCV biology, microRNA-122 role, NS5B function, viral quasispecies, and misconceptions.",
          "learner_task": "### Task\n- In small groups, discuss each question from the prompt set.\n- Collaboratively formulate answers based on the transcript.\n- Prepare to present one group's answer for each question to the whole class.",
          "materials": {
            "prompt_set": "### Formative Assessment Questions\n\n1. What distinguishes positive-sense RNA viruses from negative-sense RNA viruses in terms of genome translation and replication?\n\n2. Describe the classification of Hepatitis C virus and identify the primary site of its replication in the host.\n\n3. Explain the role of host microRNA-122 in the life cycle of HCV.\n\n4. What is the function of the NS5B protein in HCV replication?\n\n5. Define viral quasispecies and explain why RNA viruses generate them under selective pressures.\n\n6. Identify two common misconceptions about HCV and explain why they are incorrect based on transcript evidence.\n\nFacilitator use:\nDivide learners into small groups and provide this prompt set for discussion. Encourage groups to collaboratively formulate answers using the transcript as evidence. Circulate to prompt deeper discussion where answers are incomplete or inaccurate. After group discussions, facilitate sharing of one group's answer per question with the whole class. Highlight correct understanding, clarify uncertainties, and reinforce evidence-based reasoning. Use this as a check for learning and to address remaining misconceptions."
          },
          "expected_output": "Group responses demonstrating understanding of RNA virus genome polarity, HCV biology, microRNA-122 role, NS5B function, viral quasispecies, and corrected misconceptions.",
          "facilitator_notes": "Encourage evidence-based answers, facilitate cross-group sharing, and highlight areas of uncertainty or incomplete evidence."
        }
      ]
    },
    {
      "heading": "Formative Assessment Check",
      "content": {
        "items": [
          {
            "id": "Q1",
            "type": "open_ended",
            "question": "What is the key difference between positive-sense and negative-sense RNA viruses in terms of genome translation?",
            "linked_learning_outcome": "LO1"
          },
          {
            "id": "Q2",
            "type": "open_ended",
            "question": "Describe the classification and replication site of Hepatitis C virus (HCV).",
            "linked_learning_outcome": "LO2"
          },
          {
            "id": "Q3",
            "type": "open_ended",
            "question": "Explain the role of host microRNA-122 in the life cycle of HCV.",
            "linked_learning_outcome": "LO3"
          },
          {
            "id": "Q4",
            "type": "open_ended",
            "question": "What is the function of the NS5B protein in HCV replication?",
            "linked_learning_outcome": "LO4"
          },
          {
            "id": "Q5",
            "type": "discussion_prompt",
            "question": "Why do RNA viruses, including HCV, generate quasispecies under selective pressures? How might this affect treatment or immune response?",
            "linked_learning_outcome": "LO5"
          },
          {
            "id": "Q6",
            "type": "open_ended",
            "question": "Identify two common misconceptions about HCV and explain why they are incorrect based on transcript evidence.",
            "linked_learning_outcome": "LO6"
          }
        ]
      }
    }
  ],
  "source_artefacts": [
    "learning_activities",
    "activity_materials",
    "a
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
  "D6": 0,
  "D7": 0,
  "D8": 1,
  "D9": 0,
  "D10": 1,
  "mean": 0.7,
  "pageSections": [
    null,
    null,
    null
  ],
  "assessmentItemCountOnPage": 0,
  "facilitator_moves_sample": "Encourage learners to reference transcript excerpts; ask probing questions to clarify misunderstandings; provide hints about translation and polymerase roles."
}
```

## Investigator interpretation

**Pedagogic transformation (vs RNA fixture):** Live run produces **four dialogic activities** + misconception confrontation + transcript-grounded prompts — **not** assessment-only. Contrasts `ld-rna-hcv-assessment-page.json` (Case 5C).

**Still prose-shaped:** No typed reconciliation pathway; `facilitator_moves`/`facilitator_notes` remain generic facilitation strings.

**E:** `provided_source_content` preserved; assessment semantics **thin** on extract (no item count, default visibility).

**C:** Full Learning Activities + Formative sections (heading-based; **no `section_id`**).

## J. Rubric (investigator-scored — live)

| Dim | Score | Note |
|-----|-------|------|
| D1 | **1** | Transcript-grounded tasks |
| D2 | **2** | Clear learner tasks |
| D3 | **1** | Some uncertainty in misconception prompts |
| D4 | **2** | Pair + whole-group discussion |
| D5 | **2** | Named misconceptions + evidence |
| D6 | **1** | Generic facilitator notes |
| D7 | **1** | Misconception prompts; no error ladder |
| D8 | **2** | A1→A2→A3→A4 progression |
| D9 | **0** | Not peer revision cycle |
| D10 | **2** | Activities + formative |
| **Mean** | **~1.6** | vs RNA page proxy **~0.2** |
