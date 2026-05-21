# R29-P02 — HTML capture (29-1)

**Captured:** 2026-05-21
**Method:** `buildUtilityStructuredHtmlForTest` on Sprint 28 post-5d composed page JSON (`28-5d-stabilisation-capture.json`).
**Renderer:** current `app.js` — no cognition CSS classes.

## 1. Section order (page JSON → HTML h2)

1. `overview` — Introduction
2. `learning_purpose` — Learning Outcomes
3. `learning_activities` — Learning Activities
4. `assessment_check` — Formative Assessment Check
5. `undefined` — Reflection

**Cognition profile:** {"active":true,"pack_ids":["peer_instruction_pack"],"cognition_fields":["reasoning_revision_prompt","initial_position_prompt","revision_trigger"],"cognition_activity_priority":true,"cognition_section_required":true}

## 2. Cognition fields in JSON

| Field | Source on page | Value preview |
|-------|----------------|---------------|
| `reasoning_revision_prompt` | materials_key | What is your reasoning behind your initial answer? Write a brief explanation. |
| `initial_position_prompt` | materials_key | Record your first choice for each question before discussing with a peer. |
| `revision_trigger` | materials_key | Consider if your reasoning is clear and if you are confident before peer discuss |

## 3. Renderer visibility of cognition fields

| Field | HTML status | Label in text | Value in text |
|-------|-------------|---------------|---------------|
| `reasoning_revision_prompt` | **materials_key_heading** | yes | yes |
| `initial_position_prompt` | **materials_key_heading** | yes | yes |
| `revision_trigger` | **materials_key_heading** | yes | yes |

**Semantic block** = dedicated `util-cognition*` class (none in 29-1).
**materials_key_heading** = `renderMaterialValue` emits `util-material-heading` with humanised key title (P02).
**embedded_prose** = label/value inside task-card markdown only (P01/P07).

## 4. Visual prominence metrics

```json
{
  "htmlLen": 47553,
  "laHtmlLen": 20378,
  "acHtmlLen": 3169,
  "h2Count": 10,
  "activityBlockCount": 4,
  "assessmentItemCount": 18,
  "utilCognitionClass": false,
  "hasWhatToDo": true,
  "cognitionMaterialHeadings": true,
  "cognitionEmbeddedProse": true,
  "cognitionVisibleAsSemantic": false,
  "revisionFlowVisible": true,
  "repairPairVisible": false,
  "phaseMarkers": 18
}
```

## 5. Matrix scores (29-1 HTML-backed)

| Dim | 29-0 (doc) | 29-1 (HTML) | Note |
|-----|------------|-------------|------|
| D-R1 | 0 | **1** | |
| D-R2 | 1 | **2** | |
| D-R3 | 0 | **1** | |
| D-R4 | n/a | **0** | |
| D-R5 | 1 | **1** | |
| D-R6 | 2 | **2** | |
| D-R7 | 0 | **1** | |
| D-R8 | 1 | **2** | |
| D-R9 | 1 | **1** | |
| D-R10 | 2 | **2** | |

## 6. learning_activities HTML (excerpt)

```html
Learning Activities</span></h2><article class="util-task-block"><div class="util-activity-header"><h3>Individual Prediction of Stoichiometry MCQs</h3><div class="util-badge-row"><span class="util-badge">Duration: 20 mins</span></div></div><p><strong>Task:</strong> Present 6 stoichiometry multiple-choice questions for individual prediction</p><div class="util-activity-task"><h4 class="util-material-heading util-icon-heading"><i class="fa-solid fa-list-check util-material-icon util-activity-task-icon" aria-hidden="true"></i><span>What to do</span></h4><h4 class="util-card-subheading">Individual Prediction</h4><ul><li>Read each stoichiometry MCQ carefully.</li><li>Predict the correct answer individually without discussion.</li><li>Mark your initial choice on your answer sheet.</li></ul></div><div class="util-activity-materials"><h4 class="util-material-heading util-icon-heading"><i class="fa-solid fa-layer-group util-material-icon util-task-card-icon" aria-hidden="true"></i><span>Task cards</span></h4><div class="util-card-grid"><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 1</span></h5><p>A) 0.5 moles</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 2</span></h5><p>B) 1 mole</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 3</span></h5><p>C) 2 moles</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 4</span></h5><p>D) 4 moles</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 5</span></h5><p>A) Hydrogen gas (H₂)</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 6</span></h5><p>B) Oxygen gas (O₂)</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 7</span></h5><p>C) Both are limiting reagents</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 8</span></h5><p>D) Neither; both are in excess</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 9</span></h5><p>A) 51 g</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 10</span></h5><p>B) 102 g</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 11</span></h5><p>C) 68 g</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 12</span></h5><p>D) 136 g</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 13</span></h5><p>A) 2 moles</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 14</span></h5><p>B) 3 moles</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 15</span></h5><p>C) 4 moles</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 16</span></h5><p>D) 6 moles</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 17</span></h5><p>A) 66.7%</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 18</span></h5><p>B) 75%</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 19</span></h5><p>C) 80%</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 20</span></h5><p>D) 85%</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 21</span></h5><p>A) CH₂O</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 22</span></h5><p>B) C₂H₄O₂</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 23</span></h5><p>C) CHO</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 24</span></h5><p>D) C₃H₆O₃</p></article></div><h4 class="util-material-heading util-icon-heading"><i class="fa-solid fa-file-lines util-material-icon util-generic-material-icon" aria-hidden="true"></i><span>Reasoning Revision Prompt</span></h4><p>What is your reasoning behind your initial answer? Write a brief explanation.</p><h4 class="util-material-heading util-icon-heading"><i class="fa-solid fa-file-lines util-material-icon util-generic-material-icon" aria-hidden="true"></i><span>Initial Position Prompt</span></h4><p>Record your first choice for each question before discussing with a peer.</p><h4 class="util-material-heading util-icon-heading"><i class="fa-solid fa-file-lines util-material-icon util-generic-material-icon" aria-hidden="true"></i><span>Revision Trigger</span></h4><p>Consider if your reasoning is clear and if you are confident before peer discussion.</p></div><div class="util-output-block"><h4 class="util-output-heading util-icon-heading"><i class="fa-solid fa-circle-check util-material-icon util-output-icon" aria-hidden="true"></i><span>Output</span></h4><p>A completed answer sheet with initial predictions for all 6 MCQs.</p></div><aside class="util-support-note" role="note"><i class="fa-solid fa-life-ring util-material-icon util-support-note-icon" aria-hidden="true"></i><div class="util-support-note-body"><span class="util-support-note-label">Support note:</span> Emphasize importance of individual effort before discussion. Prompt learners to carefully read each question. Monitor and encourage completion of all questions.</div></aside></article><article class="util-task-block"><div class="util-activity-header"><h3>Pair Discussion and Reasoning Comparison</h3><div class="util-badge-row"><span class="util-badge">Duration: 30 mins</span></div></div><p><strong>Task:</strong> Structured discussion prompts to guide peer comparison of reasoning</p><div class="util-activity-task"><h4 class="util-material-heading util-icon-heading"><i class="fa-solid fa-list-check util-material-icon util-activity-task-icon" aria-hidden="true"></i><span>What to do</span></h4><h4 class="util-card-subheading">Pair Discussion</h4><ul><li>Share your initial answers and reasoning with your partner.</li><li>Use the structured prompts to guide your discussion.</li><li>Compare your reasoning and identify any differences.</li><li>Decide if you want to revise your initial answers based on your partner&#39;s input.</li></ul></div><div class="util-activity-materials"><h4 class="util-material-heading util-icon-heading"><i class="fa-solid fa-layer-group util-material-icon util-task-card-icon" aria-hidden="true"></i><span>Task cards</span></h4><div class="util-card-grid"><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 1</span></h5><p>A) 0.5 moles</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 2</span></h5><p>B) 1 mole</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 3</span></h5><p>C) 2 moles</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 4</span></h5><p>D) 4 moles</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 5</span></h5><p>A) Hydrogen gas (H₂)</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 6</span></h5><p>B) Oxygen gas (O₂)</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 7</span></h5><p>C) Both are limiting reagents</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 8</span></h5><p>D) Neither; both are in excess</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 9</span></h5><p>A) 51 g</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 10</span></h5><p>B) 102 g</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 11</span></h5><p>C) 68 g</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 12</span></h5><p>D) 136 g</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 13</span></h5><p>A) 2 moles</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 14</span></h5><p>B) 3 moles</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 15</span></h5><p>C) 4 moles</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 16</span></h5><p>D) 6 moles</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 17</span></h5><p>A) 66.7%</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 18</span></h5><p>B) 75%</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 19</span></h5><p>C) 80%</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 20</span></h5><p>D) 85%</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 21</span></h5><p>A) CH₂O</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 22</span></h5><p>B) C₂H₄O₂</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 23</span></h5><p>C) CHO</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 24</span></h5><p>D) C₃H₆O₃</p></article></div><h4 class="util-material-heading util-icon-heading"><i class="fa-solid fa-comments util-material-icon util-prompt-set-icon" aria-hidden="true"></i><span>Prompt set</span></h4><div class="util-prompt-set"><ul><li>---</li><li>Structured Discussion Prompts for Pair Work</li><li>Explain your reasoning for each answer you selected in the MCQs.</li><li>Ask your partner to explain their reasoning for their answers.</li><li>Identify any differences in your approaches or understanding.</li><li>Discuss which reasoning seems more valid and why, using evidence from the questions.</li><li>Consider if any alternative valid approaches exist.</li><li>Decide together if you want to revise your initial answers based on this discussion.</li><li>---</li></ul></div><h4 class="util-material-heading util-icon-heading"><i class="fa-solid fa-file-lines util-material-icon util-generic-material-icon" aria-hidden="true"></i><span>Reasoning Revision Prompt</span></h4><p>How has your partner&#39;s reasoning influenced your understanding of each question?</p><h4 class="util-material-heading util-icon-heading"><i class="fa-solid fa-file-lines util-material-icon util-generic-material-icon" aria-hidden="true"></i><span>Initial Position Prompt</span></h4><p>Recall your initial answer and reasoning before discussion.</p><h4 class="util-material-heading util-icon-heading"><i class="fa-solid fa-file-lines util-material-icon util-generic-material-icon" aria-hidden="true"></i><span>Revision Trigger</span></h4><p>If your partner’s reasoning reveals gaps or alternative valid approaches, consider revising your answer.</p></div><div class="util-output-block"><h4 class="util-output-heading util-icon-heading"><i class="fa-solid fa-circle-check util-material-icon util-output-icon" aria-hidden="true"></i><span>Output</span></h4><p>A jointly discussed set of reasoning notes and a decision on whether to revise each answer.</p></div><aside class="util-support-note" role="note"><i class="fa-solid fa-life-ring util-material-icon util-support-note-icon" aria-hidden="true"></i><div class="util-support-note-body"><span class="util-support-note-label">Support note:</span> Remind pairs to use the prompts and focus on reasoning comparison. Observe and gently intervene if discussion is superficial or silent. Encourage explanation and questioning between partners.</div></aside></article><article class="util-task-block"><div class="util-activity-header"><h3>Revision of Predictions Post-Peer Discussion</h3><div class="util-badge-row"><span class="util-badge">Duration:

<!-- truncated 8378 chars -->
```

## 7. assessment_check HTML (excerpt)

```html
Formative Assessment Check</span></h2><div class="util-assessment-list"><article class="util-task-block util-assessment-item"><header class="util-assessment-item-header"><span class="util-assessment-number" aria-hidden="true">1</span><h3 class="util-assessment-title">Question 1</h3></header><div class="util-assessment-item-body"><p>What mass of water is produced when 4.0 g of hydrogen gas reacts completely with oxygen?</p><ul class="util-assessment-options"><li>A. 36 g</li><li>B. 18 g</li><li>C. 72 g</li><li>D. 9 g</li></ul></div></article><article class="util-task-block util-assessment-item"><header class="util-assessment-item-header"><span class="util-assessment-number" aria-hidden="true">2</span><h3 class="util-assessment-title">Question 2</h3></header><div class="util-assessment-item-body"><p>How many moles of CO2 are produced when 2 moles of propane (C3H8) combust completely?</p><ul class="util-assessment-options"><li>A. 3 moles</li><li>B. 5 moles</li><li>C. 7 moles</li><li>D. 8 moles</li></ul></div></article><article class="util-task-block util-assessment-item"><header class="util-assessment-item-header"><span class="util-assessment-number" aria-hidden="true">3</span><h3 class="util-assessment-title">Question 3</h3></header><div class="util-assessment-item-body"><p>If 10 grams of Na react with excess Cl2, what mass of NaCl is formed?</p><ul class="util-assessment-options"><li>A. 16.5 g</li><li>B. 25.5 g</li><li>C. 35.5 g</li><li>D. 45.0 g</li></ul></div></article><article class="util-task-block util-assessment-item"><header class="util-assessment-item-header"><span class="util-assessment-number" aria-hidden="true">4</span><h3 class="util-assessment-title">Question 4</h3></header><div class="util-assessment-item-body"><p>What volume of oxygen gas at STP is needed to react with 1 mole of methane (CH4)?</p><ul class="util-assessment-options"><li>A. 11.2 L</li><li>B. 22.4 L</li><li>C. 44.8 L</li><li>D. 33.6 L</li></ul></div></article><article class="util-task-block util-assessment-item"><header class="util-assessment-item-header"><span class="util-assessment-number" aria-hidden="true">5</span><h3 class="util-assessment-title">Question 5</h3></header><div class="util-assessment-item-body"><p>When 0.5 moles of aluminum react with excess oxygen, how many moles of Al2O3 are produced?</p><ul class="util-assessment-options"><li>A. 0.25 moles</li><li>B. 0.5 moles</li><li>C. 1 mole</li><li>D. 2 moles</li></ul></div></article><article class="util-task-block util-assessment-item"><header class="util-assessment-item-header"><span class="util-assessment-number" aria-hidden="true">6</span><h3 class="util-assessment-title">Question 6</h3></header><div class="util-assessment-item-body"><p>What is the limiting reagent when 5 g of H2 reacts with 40 g of O2 to form water?</p><ul class="util-assessment-options"><li>A. Hydrogen</li><li>B. Oxygen</li><li>C. Both are limiting</li><li>D. Neither is limiting</li></ul></div></article><section class="util-assessment-key"><h3 class="util-assessment-key-title">Answer Grid</h3><p>Q1 ___</p><p>Q2 ___</p><p>Q3 ___</p><p>Q4 ___</p><p>Q5 ___</p><p>Q6 ___</p></section></div></section><section>
```

## 8. Investigator notes

- Activities use `util-task-block`; assessment uses `util-assessment-item` + `util-assessment-section` — distinct chrome.
- Cognition labels in P28-01/P07 often appear inside **task card markdown**, not as typed activity-row renderer blocks.
- No `util-cognition` classes in export HTML (expected — 29-3 not started).
- Sprint 27 `feedback_display` on page: `answer_grid_end`.
