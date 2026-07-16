# Sprint 65 — Signal Inventory Table

Companion to [`renderer-signal-inventory.md`](renderer-signal-inventory.md).  
**Sample denominators:** 8 pages · 26 activities · 87 materials (see [`samples/signal-inventory-frequency.json`](samples/signal-inventory-frequency.json)).

| Signal ID | Category | Raw field path | Example value | Raw presence | Normalised field/path | Renderer consumer | Current learner manifestation | Optionality | Frequency across samples | Validation/fallback | Overlap with other signals | Safe Sprint 65 use | Notes |
| --------- | -------- | -------------- | ------------- | ------------ | --------------------- | ----------------- | ----------------------------- | ----------- | ------------------------ | ------------------- | -------------------------- | ------------------ | ----- |
| S65-SIG-P01 | P | `title` \| `name` | RNA Viruses… | required-ish | retained | `buildUtilityStructuredHtml` | h1 / sticky title | commonly present | 8/8 pages | empty → untitled risk | journey labels | **S1** | |
| S65-SIG-P02 | P | `audience` | Undergraduate… | optional | retained | audience paragraph | “Audience: …” | optional | 7/8 pages | omit if empty | — | **S2** | |
| S65-SIG-P03 | P | `page_profile` | learner | optional | retained | often meta only | usually not primary chrome | optional | 8/8 pages | — | diagnostics | **S4** | Weak learner value |
| S65-SIG-P04 | P | `page_synthesis.overview` \| `overview` | Self-study fixture… | common | section `overview` / journey composite | section + header meta + journey intro | Overview / duplicated journey text | optional | 6/8 pages | omit section if empty | journey intro | **S1**/dedupe | BL-001 duplication |
| S65-SIG-P05 | P | `page_synthesis.learning_purpose` \| slot | — | occasional | section | section render | Learning Purpose | optional | 2/8 pages | omit | overview | **S2** | |
| S65-SIG-P06 | P | `page_synthesis.knowledge_summary` \| slot | — | occasional | section | section render | Knowledge Summary | optional | 2/8 pages | omit | activity text | **S2** | |
| S65-SIG-P07 | P | `page_synthesis.study_tips` \| slot | bullets | occasional | section | section render | Study Tips | optional | 1/8 pages | omit | assessment tips | **S2** | |
| S65-SIG-P08 | P | `learning_outcomes[]` | LO objects | contract-common; **absent in set** | retained | `metadataKeys` fold | meta panel only | optional | 0/8 pages | silent loss from primary chrome | mapped LOs | **S4**/S3 | Not primary orientation |
| S65-SIG-P09 | P | `learning_sequence` | sequence object | occasional | section | journey/sequence render | Learning Journey content | optional | 0/8 pages | omit | overview | **S2** | |
| S65-SIG-P10 | S | derived activity list | Orient→A1→… | derived | journey sections | `buildLearnerJourneyNavHtml` | sticky nav | when ≥2 sections | derived on rich pages | compact truncates labels | P04 | **S1** | |
| S65-SIG-A01 | A | `activities[].activity_id` | A1 | common | retained | anchors / attrs | `#activity-1` | common | 26 activities | — | — | **S1** anchors / **S4** display | |
| S65-SIG-A02 | A | `activities[].title` | Classify… | common | retained | activity header | h3 title | common | 26/26 | — | nav text | **S1** | |
| S65-SIG-A03 | A | `episode_plan.archetype` \| `archetype` | understand | occasional | retained | **not** badge renderer | none as mode label | optional | 11/26 plans; labelled: u3/an4/ap1/ev3; none 15 | no fallback badge | beats | **S3** | Descriptive only today |
| S65-SIG-A04 | A | `duration_minutes` \| `duration` | 10 | common | retained | badge | Duration: 10 mins | optional | 23/26 | omit badge | — | **S2** | |
| S65-SIG-A05 | A | `grouping` | individual | common | retained | badge | Grouping: Individual | optional | 19/26 | omit | — | **S2** | |
| S65-SIG-A06 | A | `mapped_learning_outcomes` | — | absent in set | retained if present | weak / unused in chrome | none observed | optional | 0/26 | unknown | P08 | **S2** | |
| S65-SIG-C01 | C | `activity_preamble` (+aliases) | prose | occasional | retained | `renderActivityFramingForActivity` | preamble block | optional | 5/26 | **omit chrome** | C04 | **S2** | |
| S65-SIG-C02 | C | `study_orientation` / `intellectual_frame` | prose | occasional | retained | framing cues | labelled cues | optional | 2/26 each | omit | C01 | **S2** | |
| S65-SIG-C03 | C | `intellectual_coherence_bridge` | prose | occasional | retained | framing cue | Connection to previous… | optional | 2/26 | omit | P10 | **S2** | |
| S65-SIG-C04 | C | `reasoning_orientation` (+aliases) | prose | occasional | retained | framing | reasoning cue | optional | 2/26 | omit | C01 | **S2** | |
| S65-SIG-C05 | C | `self_explanation_prompt` | prose | occasional | retained | cognition / instructional | Reflect / cognition item | optional | 3/26 | omit | — | **S2** | |
| S65-SIG-C06 | C | `transformation_activity` | — | absent in set | retained | cognition pack | none in set | optional | 0/26 | omit | T01 | **S2** | |
| S65-SIG-C07 | C | `source_to_application_prompt` | — | absent | retained | cognition pack | none | optional | 0/26 | omit | T01 | **S2** | |
| S65-SIG-C08 | C | `transfer_or_application_task` | prose | rare | retained | cognition / transfer | transfer chrome | optional | 1/26 | omit if transfer materials | M transfer | **S2** | |
| S65-SIG-C09 | C | `support_note` | prose | occasional | retained | support note | support note | optional | 8/26 | omit | — | **S2**/S5 | |
| S65-SIG-T01 | T | `learner_task` (+aliases) | Study the… | common | retained | journey frame + task | What to do / Your goal | common | 26/26 | empty → weak activity | C06 | **S1** | |
| S65-SIG-T02 | T | `expected_output` (+aliases) | Completed… | common | retained | Success promotion | Success looks like item | optional | 21/26 | may suppress if checklist restatement | V01 | **S1** | High overlap |
| S65-SIG-V01 | V | materials checklist | Criterion… | common type | map key `checklist` | checklist + Success extract | Checklist + Success bullets | optional | 14/87 mats | omit if absent | T02 | **S1**/S5 | |
| S65-SIG-V02 | V | `sample_output` | model answer | occasional | map key | material render | Sample Output | optional | 2/87 | omit | T02 | **S2**/S5 | |
| S65-SIG-V03 | V | `worked_example` | steps | occasional | map key | material / beat | Worked Example | optional | 8/87 | omit | — | **S2**/S5 | |
| S65-SIG-V04 | V | assessment answer/explanation | rationale | context | assessment model | assessment item | conditional | optional | 4/8 pages have assessment | feedback_display gated | AS | **S3** | |
| S65-SIG-S01 | S | `activities[]` order | A1…A6 | common | section content | journey + activity list | sequence | common | 26 on rich pages | — | — | **S1** | |
| S65-SIG-S02 | S | `episode_plan.beats[].function` | explanation | occasional | retained | `resolveBeatMaterialPlan` | beat headings | optional | 11/26 activities; 43 beat fn instances | non-beat fallback order | M01 | **S1** when present | |
| S65-SIG-S03 | S | `_render_sequence` | [{key,type}] | normalised | sidecar | residual after beats | may appear after Check your work | context | when array materials converted | residual orphans | S02 | **S3** | BL-001 F09 |
| S65-SIG-S04 | S | beat-material registry | type→beat | code | — | matching | beat grouping | context | — | unregistered types unassigned | M01 | **S3** | planning_table gap |
| S65-SIG-S05 | S | coherence bridge | — | =C03 | — | — | — | — | — | — | — | **S2** | See C03 |
| S65-SIG-M01 | M | `material_type` / key | text | common | `_material_types` / key | headings + renderers | type label | common | 87/87 | unknown → fallback | title | **S1**/S5 | |
| S65-SIG-M02 | M | `title` | S62 RNA… | occasional | payload.title | h5/card title | title text | optional | 30/87 | fixture filter partial | M01 | **S5** | |
| S65-SIG-M03 | M | `body` | Marker… | common | payload | body render | prose/table | common | 87/87 | — | — | **S5** | |
| S65-SIG-M04 | M | `purpose` | — | occasional | payload.purpose | rarely chrome | usually unused | optional | not counted primary | — | M01 | **S2** weak | |
| S65-SIG-M05 | M | `instructional_function` | — | **absent** | not copied on array→map | meta-only skip | none | absent | **0/87** | unknown live | S02 | **S3** do not rely | |
| S65-SIG-M06 | M | `plan_beat_index` | — | **absent** | not copied on array→map | meta-only skip | none | absent | **0/87** | unknown live | S02 | **S3** do not rely | |
| S65-SIG-AS01 | AS | `assessment_check` | items | occasional | section | assessment renderer | Formative Assessment | optional | 4/8 pages | omit | — | **S2** | |
| S65-SIG-AS02 | AS | item prompt/options | MCQ | when AS01 | item model | question cards | Question N | required if item | subset | — | — | **S1** | |
| S65-SIG-AS03 | AS | answer/explanation | rationale | when AS01 | item model | conditional blocks | answer/explain | optional | subset | feedback gate | V04 | **S3** | |
| S65-SIG-D01 | D | `schema_version` | 2.0.0 | occasional | retained | meta | About this page | optional | 1/8 | collapsed details | — | **S4** | |
| S65-SIG-D02 | D | `assembly_state` | enriched_by… | occasional | retained | meta | Assembly State | optional | 1/8 | collapsed | — | **S4** | |
| S65-SIG-D03 | D | `__prismRenderNormalized` | true | normalised | flag | meta | PrismRenderNormalized | always after normalize | derived | collapsed | — | **S4** | |
| S65-SIG-D04 | D | diagnostics / generation_notes / source_artefacts | various | occasional | retained | meta | meta sections | optional | shape/kitchen | collapsed | — | **S4** | |
| S65-SIG-D05 | D | beat-render diagnostic | object | derived | — | `console.log` | not learner-visible | always when beat plan | — | — | — | **S4** | |
| S65-SIG-U01 | U | `required_links` | — | upstream plan | not retained | unavailable | — | — | — | — | — | **S6** | Known architecture ceiling — not a Sprint 65 renderer defect. |
| S65-SIG-U02 | U | plan `stages` | — | upstream | not retained | unavailable | — | — | — | — | — | **S6** | Known architecture ceiling — not a Sprint 65 renderer defect. |
| S65-SIG-U03 | U | `key_relationships` | — | upstream | not retained | unavailable | — | — | — | — | — | **S6** | Known architecture ceiling — not a Sprint 65 renderer defect. |
| S65-SIG-U04 | U | `governing_constraint` | — | upstream | not retained | unavailable | — | — | — | — | — | **S6** | Known architecture ceiling — not a Sprint 65 renderer defect. |

**Signal count inventoried in this table:** 48 (P10 + A6 + C9 + T2 + V4 + S5 + M6 + AS3 + D5 + U4; S05 aliases C03).
