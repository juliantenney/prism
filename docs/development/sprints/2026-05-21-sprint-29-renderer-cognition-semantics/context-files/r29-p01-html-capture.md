# R29-P01 — HTML capture (29-1)

**Captured:** 2026-05-21
**Method:** `buildUtilityStructuredHtmlForTest` on Sprint 28 post-5d composed page JSON (`28-5d-stabilisation-capture.json`).
**Renderer:** current `app.js` — no cognition CSS classes.

## 1. Section order (page JSON → HTML h2)

1. `overview` — Introduction and Seminar Overview
2. `learning_activities` — Learning Activities
3. `assessment_check` — Formative Assessment Check

**Cognition profile:** {"active":true,"pack_ids":["misconception_repair_pack"],"cognition_fields":["misconception_claim","reconciliation_prompt","evidence_contrast","uncertainty_tension_prompt"],"cognition_activity_priority":true,"cognition_section_required":true}

## 2. Cognition fields in JSON

| Field | Source on page | Value preview |
|-------|----------------|---------------|
| `misconception_claim` | materials_embedded | (in materials text) |
| `reconciliation_prompt` | materials_embedded | (in materials text) |
| `evidence_contrast` | materials_embedded | (in materials text) |
| `uncertainty_tension_prompt` | materials_embedded | (in materials text) |

## 3. Renderer visibility of cognition fields

| Field | HTML status | Label in text | Value in text |
|-------|-------------|---------------|---------------|
| `misconception_claim` | **embedded_prose** | yes | no |
| `reconciliation_prompt` | **embedded_prose** | yes | no |
| `evidence_contrast` | **embedded_prose** | yes | no |
| `uncertainty_tension_prompt` | **embedded_prose** | yes | no |

**Semantic block** = dedicated `util-cognition*` class (none in 29-1).
**materials_key_heading** = `renderMaterialValue` emits `util-material-heading` with humanised key title (P02).
**embedded_prose** = label/value inside task-card markdown only (P01/P07).

## 4. Visual prominence metrics

```json
{
  "htmlLen": 33849,
  "laHtmlLen": 9225,
  "acHtmlLen": 1949,
  "h2Count": 8,
  "activityBlockCount": 2,
  "assessmentItemCount": 3,
  "utilCognitionClass": false,
  "hasWhatToDo": true,
  "cognitionMaterialHeadings": false,
  "cognitionEmbeddedProse": true,
  "cognitionVisibleAsSemantic": false,
  "revisionFlowVisible": false,
  "repairPairVisible": true,
  "phaseMarkers": 0
}
```

## 5. Matrix scores (29-1 HTML-backed)

| Dim | 29-0 (doc) | 29-1 (HTML) | Note |
|-----|------------|-------------|------|
| D-R1 | 0 | **1** | |
| D-R2 | 1 | **2** | |
| D-R3 | 0 | **0** | |
| D-R4 | 0 | **1** | |
| D-R5 | 1 | **0** | |
| D-R6 | 2 | **2** | |
| D-R7 | 0 | **0** | |
| D-R8 | 1 | **2** | |
| D-R9 | 1 | **1** | |
| D-R10 | 2 | **2** | |

## 6. learning_activities HTML (excerpt)

```html
Learning Activities</span></h2><article class="util-task-block"><div class="util-activity-header"><h3>Small Group Analysis of Climate Misconception Scenarios</h3><div class="util-badge-row"><span class="util-badge">Duration: 40 mins</span></div></div><p><strong>Task:</strong> In your small groups, you will read an assigned scenario card describing a real-world climate misconception.</p><div class="util-activity-task"><h4 class="util-material-heading util-icon-heading"><i class="fa-solid fa-list-check util-material-icon util-activity-task-icon" aria-hidden="true"></i><span>What to do</span></h4><ul><li>Read your assigned scenario card carefully.</li><li>Discuss the conflicting claims and use the prompts to explore evidence and uncertainties.</li><li>Work together to reconcile the claims by evaluating the evidence and articulating your group&#39;s understanding.</li><li>Prepare a summary of your group&#39;s reasoning to share with the class.</li></ul></div><div class="util-activity-materials"><h4 class="util-material-heading util-icon-heading"><i class="fa-solid fa-layer-group util-material-icon util-task-card-icon" aria-hidden="true"></i><span>Task cards</span></h4><div class="util-card-grid"><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 1</span></h5><p>City Planner</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 2</span></h5><p>Local Fisherman</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 3</span></h5><p>Climate Scientist</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 4</span></h5><p>City Planner: &#39;Flooding is due to poor infrastructure, not climate change.&#39;</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 5</span></h5><p>Local Fisherman: &#39;The sea has always risen and fallen; this is normal.&#39;</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 6</span></h5><p>Climate Scientist: &#39;Scientific data shows accelerated sea level rise linked to global warming.&#39;</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 7</span></h5><p>Energy Company Executive</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 8</span></h5><p>Environmental Activist</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 9</span></h5><p>Economist</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 10</span></h5><p>Energy Executive: &#39;Renewables are too intermittent to replace fossil fuels fully.&#39;</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 11</span></h5><p>Activist: &#39;Renewables are the only sustainable solution to climate change.&#39;</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 12</span></h5><p>Economist: &#39;Energy transition costs could harm the economy if done too fast.&#39;</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 13</span></h5><p>Local Farmer</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 14</span></h5><p>Government Official</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 15</span></h5><p>Conservation Scientist</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 16</span></h5><p>Farmer: &#39;Clearing land is necessary for livelihoods; forests regrow naturally.&#39;</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 17</span></h5><p>Official: &#39;Deforestation rates are decreasing thanks to policies.&#39;</p></article><article class="util-task-card"><h5 class="util-task-card-heading"><span>Card 18</span></h5><p>Scientist: &#39;Deforestation contributes significantly to carbon emissions and climate change.&#39;</p></article></div></div><div class="util-output-block"><h4 class="util-output-heading util-icon-heading"><i class="fa-solid fa-circle-check util-material-icon util-output-icon" aria-hidden="true"></i><span>Output</span></h4><p>A group summary that:</p><ul><li>Identifies the misconception claim(s) in the scenario.</li><li>Explains the conflicting claims and the evidence supporting or refuting them.</li><li>Demonstrates engagement with productive uncertainty and reconciles the claims with evidence-based reasoning.</li><li>Responds to facilitator prompts addressing common learner arguments.</li></ul></div><aside class="util-support-note" role="note"><i class="fa-solid fa-life-ring util-material-icon util-support-note-icon" aria-hidden="true"></i><div class="util-support-note-body"><span class="util-support-note-label">Support note:</span> During group work, use the discussion prompts to guide exploration of evidence and uncertainty. Address common learner arguments by asking questions such as:
- If learners accept misconceptions uncritically, ask: &#39;What evidence supports this claim, and what evidence challenges it?&#39;
- If groups avoid uncertainty, ask: &#39;What aspects of the scenario remain unclear or contested?&#39;
Use timing cues at 10, 20, and 30 minutes to keep groups on track toward preparing a summary.</div></aside></article><article class="util-task-block"><div class="util-activity-header"><h3>Formative Check: Individual Reflection and Group Debrief</h3><div class="util-badge-row"><span class="util-badge">Duration: 15 mins</span></div></div><p><strong>Task:</strong> Individually complete a 5-item formative check to reflect on your understanding of climate misconceptions based on group discussions.</p><div class="util-activity-task"><h4 class="util-material-heading util-icon-heading"><i class="fa-solid fa-list-check util-material-icon util-activity-task-icon" aria-hidden="true"></i><span>What to do</span></h4><ul><li>Complete the 5-item formative check on your handout individually.</li><li>Reflect on your understanding from the group discussions.</li><li>Do not discuss answers now; submit your responses to the facilitator.</li></ul></div><div class="util-activity-materials"><h4 class="util-material-heading util-icon-heading"><i class="fa-solid fa-file-lines util-material-icon util-generic-material-icon" aria-hidden="true"></i><span>Formative Check</span></h4><ul><li>--</li></ul><h5 class="util-card-subheading">Formative Check: Climate Misconceptions</h5><p class="util-line-label"><strong>Instructions:</strong></p><p>Answer the following questions individually based on your group discussions. Do not check answers yet.</p><div class="util-template-note-line" aria-hidden="true"></div><ul><li>--</li></ul><p>1. <strong>Which factor is a primary driver of recent sea level rise?</strong></p><ul><li>Natural ocean cycles</li><li>Melting of polar ice and thermal expansion</li><li>Increased rainfall</li><li>Tectonic plate movements</li></ul><p>2. <strong>What is a common misconception about renewable energy reliability?</strong></p><ul><li>Renewables can never provide 100% energy needs</li><li>Energy storage and grid management can mitigate intermittency</li><li>Renewables are always cheaper than fossil fuels</li><li>Renewables produce no greenhouse gases</li></ul><p>3. <strong>How does deforestation affect global carbon emissions?</strong></p><ul><li>It reduces carbon emissions by increasing farmland</li><li>It has no measurable effect</li><li>It increases carbon emissions by releasing stored carbon</li><li>It only affects local air quality</li></ul><p>4. <strong>Why is it important to consider multiple perspectives in climate debates?</strong></p><ul><li>To identify biases and evaluate evidence critically</li><li>To find the quickest solution</li><li>To avoid discussing uncertainties</li><li>To confirm pre-existing beliefs</li></ul><p>5. <strong>What does productive uncertainty encourage in scientific discussions?</strong></p><ul><li>Ignoring conflicting evidence</li><li>Accepting all claims as equally valid</li><li>Exploring evidence to refine understanding</li><li>Rejecting scientific consensus</li></ul></div><div class="util-output-block"><h4 class="util-output-heading util-icon-heading"><i class="fa-solid fa-circle-check util-material-icon util-output-icon" aria-hidden="true"></i><span>Output</span></h4><p>Completed formative check responses reflecting individual understanding of climate misconceptions and evidence evaluation.</p></div><aside class="util-support-note" role="note"><i class="fa-solid fa-life-ring util-material-icon util-support-note-icon" aria-hidden="true"></i><div class="util-support-note-body"><span class="util-support-note-label">Support note:</span> Collect responses without revealing correct answers. After collection, participate in a whole-class debrief led by the facilitator to discuss each question, clarify misconceptions, and highlight evidence-based reasoning. Reflect on uncertainties and how group discussions influenced your answers.</div></aside></article></section><section class="util-assessment-section">
```

## 7. assessment_check HTML (excerpt)

```html
Formative Assessment Check</span></h2><div class="util-assessment-list"><article class="util-task-block util-assessment-item"><header class="util-assessment-item-header"><span class="util-assessment-number" aria-hidden="true">1</span><h3 class="util-assessment-title">Question 1</h3></header><div class="util-assessment-item-body"><p>Answer the following questions individually based on your group discussions. Do not check answers yet.</p><ul><li><h3>Id</h3><p>Q1</p><h3>Question</h3><p>Which factor is a primary driver of recent sea level rise?</p><h3>Options</h3><p>Natural ocean cycles Melting of polar ice and thermal expansion Increased rainfall Tectonic plate movements</p></li><li><h3>Id</h3><p>Q2</p><h3>Question</h3><p>What is a common misconception about renewable energy reliability?</p><h3>Options</h3><p>Renewables can never provide 100% energy needs Energy storage and grid management can mitigate intermittency Renewables are always cheaper than fossil fuels Renewables produce no greenhouse gases</p></li><li><h3>Id</h3><p>Q3</p><h3>Question</h3><p>How does deforestation affect global carbon emissions?</p><h3>Options</h3><p>It reduces carbon emissions by increasing farmland It has no measurable effect It increases carbon emissions by releasing stored carbon It only affects local air quality</p></li><li><h3>Id</h3><p>Q4</p><h3>Question</h3><p>Why is it important to consider multiple perspectives in climate debates?</p><h3>Options</h3><p>To identify biases and evaluate evidence critically To find the quickest solution To avoid discussing uncertainties To confirm pre-existing beliefs</p></li><li><h3>Id</h3><p>Q5</p><h3>Question</h3><p>What does productive uncertainty encourage in scientific discussions?</p><h3>Options</h3><p>Ignoring conflicting evidence Accepting all claims as equally valid Exploring evidence to refine understanding Rejecting scientific consensus</p></li></ul></div></article></div></section><section>
```

## 8. Investigator notes

- Activities use `util-task-block`; assessment uses `util-assessment-item` + `util-assessment-section` — distinct chrome.
- Cognition labels in P28-01/P07 often appear inside **task card markdown**, not as typed activity-row renderer blocks.
- No `util-cognition` classes in export HTML (expected — 29-3 not started).
- Sprint 27 `feedback_display` on page: `none`.
