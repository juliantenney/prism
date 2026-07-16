# Sprint 65 Renderer Signal Inventory

## Task

**S65-BL-002 — Renderer Signal Inventory**

Map which learner-relevant signals the production renderer can reliably use today: origin, normalisation, consumption, frequency in a declared sample set, optionality/fallback, overlap, and safe-use class.

## Scope and Constraints

**In scope:** Documentation inventory; code/fixture/test inspection; optional non-production scan under `samples/`.

**Out of scope:** Production renderer / `app.js` / `lib/` behaviour changes; schemas; GAM; production tests; CSS; Sprint 64 prototype reuse; S65-BL-003 contract design.

```text
Implementation status: Not started
```

## Sources Inspected

| Source | Role |
| ------ | ---- |
| [`lib/page-render-normalize.js`](../../../../lib/page-render-normalize.js) | Layer 2 normalisation |
| `app.js` — `buildUtilityStructuredHtml`, framing/cognition/journey/material renderers, meta fold | Layer 3–4 |
| [`lib/beat-material-registry.js`](../../../../lib/beat-material-registry.js) | Beat↔material matching + learner labels |
| Renderer tests (kitchen-sink, cognition, journey presentation, material completeness) | Intended fallback behaviour |
| Sprint 63 authoritative findings / final validation | Unavailable upstream structure |
| Frequency scan | [`samples/scan-signal-inventory-frequency.js`](samples/scan-signal-inventory-frequency.js) → [`samples/signal-inventory-frequency.json`](samples/signal-inventory-frequency.json) |
| Full signal table | [`signal-inventory-table.md`](signal-inventory-table.md) |

## Sample Set and Coverage

**Denominator (this task):** **8 pages · 26 activities · 87 materials** in the inspected set (not repository-wide).

| # | Fixture | Coverage rationale |
| - | ------- | ------------------ |
| 1 | `rna-hcv-assembled-vnext-materials-page.json` | Rich vNext + beats + all four archetypes; BL-001 reference |
| 2 | `ld-rna-hcv-assessment-page.json` | Assessment companion; sparse activities |
| 3 | `renderer-kitchen-sink-page.json` | Broad material types + cognition showcases + meta |
| 4 | `marx-beat-render-page.json` | Beat-first ordering; understand/analyse/evaluate |
| 5 | `ld-inflation-workshop-page-full.json` | Workshop richness; tables/templates |
| 6 | `ld-climate-misconception-discussion-page.json` | Discussion / prompt-set patterns |
| 7 | `self-directed-activity-framing-page.json` | Framing / PEL-oriented rows |
| 8 | `shape-production-metadata.json` | Sparse shape + production metadata |

**Coverage notes:** Includes rich and sparse pages; with/without assessment; with/without page synthesis slots; with/without episode plans; unknown/fallback material keys (kitchen-sink). Does **not** claim corpus-wide frequency.

## Signal Model

Four layers (must not be collapsed):

| Layer | Meaning |
| ----- | ------- |
| **L1 Raw** | Field on incoming page JSON |
| **L2 Normalised** | Produced/retained by `normalizePageForRender` / material map conversion |
| **L3 Consumed** | Read by a render helper |
| **L4 Manifested** | Learner-visible (or meta-only / console-only / discarded) |

Safe-use classes: **S1** stable presentation · **S2** stable optional · **S3** context-dependent · **S4** diagnostic only · **S5** content-owned · **S6** unavailable.

## Raw Artifact Signals

See [signal-inventory-table.md](signal-inventory-table.md) for the full per-signal rows.

High-level L1 families:

- **Page:** `title`, `audience`, `page_profile`, `schema_version`, `assembly_state`, `page_synthesis.*`, top-level section slots, `learning_outcomes`, `learning_sequence`, `assessment_check`, `activities[]`
- **Activity:** identity/logistics, task/output, cognition/PEL packs, `episode_plan`, `materials[]` / object map
- **Material:** `material_id`, `material_type`, `title`, `body`, `purpose`, `specification` (and theoretically `instructional_function`, `plan_beat_index` — **absent in all 8 samples**)
- **Assessment:** items under `assessment_check` / section content
- **Diagnostics:** assembly/enrichment/generation notes, source artefacts

## Normalised Renderer Signals

`normalizePageForRender` (`lib/page-render-normalize.js`):

- Builds legacy `sections[]` from `page_synthesis` / top-level slots / activities / assessment / learning_sequence
- Converts `activities[].materials[]` → object map with `_material_ids`, `_material_types`, `_render_sequence`
- `materialTypeToRenderKey` aliases (e.g. `scenario`→`scenarios`, `evaluation_checklist`→`checklist`)
- Sets `__prismRenderNormalized: true`
- **Does not invent** cognition fields or episode plans
- **Array→map conversion retains** title/body/purpose (+ type sidecars); does **not** copy `instructional_function` / `plan_beat_index` onto payload even if present on raw array entries

## Renderer Consumption Map

Minimum required chains:

```text
activities[].episode_plan.archetype
→ retained on activity row (normalize clone)
→ NOT rendered as learner mode badge
→ descriptive metadata only today
```

```text
activities[].episode_plan.beats[].function
→ resolveBeatMaterialPlan (beat-material-registry)
→ learnerFacingBeatLabel / LEARNER_FACING_EPISODE_FUNCTION_LABELS
→ <section class="util-beat-section"> <h4 class="util-beat-heading">
→ e.g. explanation → "Understand"
```

```text
materials[].material_type | map key
→ materialTypeToRenderKey / _material_types
→ prettyMaterialHeading + dedicated or generic renderMaterialValue
→ h4 type label (Text, Checklist, Transfer Prompt, …)
```

```text
materials[].instructional_function | plan_beat_index
→ metadata-only skip keys in material body detection (app.js ~38881–90)
→ not used for ordering in inspected samples (0/87 present)
→ unsafe to assume for Sprint 65 grouping without new evidence
```

```text
learner_task | task | instructions
→ buildLearnerJourneyFrameHtml / activity task render
→ util-activity-task--primary ("What to do" / "Your goal")
```

```text
expected_output + checklist criteria
→ buildLearnerJourneyFrameHtml promotion
→ "Success looks like" list; may suppress trailing output
→ checklist material still renders under verification beat
```

```text
activity_preamble | reasoning_orientation | intellectual_coherence_bridge | …
→ renderActivityFramingForActivity / renderCognitionFieldsForActivity
→ util-activity-framing / util-cognition* (omitted when empty — kitchen-sink / cognition tests)
```

```text
page_synthesis.overview | learning_purpose | knowledge_summary | study_tips
→ buildRenderSections / utilityRenderPageSections
→ section headings; overview also feeds journey intro / header meta
```

```text
learning_outcomes (top-level)
→ metadataKeys fold
→ <details class="util-meta"> only (not primary orientation chrome)
```

```text
assessment_check | sections[assessment_check]
→ renderAssessmentCheckSectionBlock
→ formative question cards
```

```text
schema_version | assembly_state | __prismRenderNormalized | enrichment/diagnostics keys
→ metadataBlocks → details.util-meta "About this page"
→ collapsed by default
```

## Page-Level Signals

| Signal ID | Field | Freq (8 pages) | L4 today | Safe use |
| --------- | ----- | -------------- | -------- | -------- |
| S65-SIG-P01 | title | 8/8 | h1 / sticky header | **S1** |
| S65-SIG-P02 | audience | 7/8 | optional Audience line | **S2** |
| S65-SIG-P03 | page_profile | 8/8 | usually meta / unused as chrome | **S4**/weak S2 |
| S65-SIG-P04 | overview | 6/8 | Overview / journey intro / header meta | **S1** (omit if empty) |
| S65-SIG-P05 | learning_purpose | 2/8 | Learning Purpose section | **S2** |
| S65-SIG-P06 | knowledge_summary | 2/8 | Knowledge Summary section | **S2** |
| S65-SIG-P07 | study_tips | 1/8 | Study Tips / guidance | **S2** |
| S65-SIG-P08 | learning_outcomes | 0/8 samples | meta only if present | **S3**/S4 for learner chrome |
| S65-SIG-P09 | learning_sequence | 0/8 samples | Journey section content if present | **S2** |
| S65-SIG-P10 | sticky journey nav | derived from activities | nav links + progress | **S1** (when ≥2 journey sections) |

## Activity Identity and Logistics

| Signal ID | Field | Freq (26 activities) | L4 | Safe use |
| --------- | ----- | -------------------- | -- | -------- |
| S65-SIG-A01 | activity_id | common | data attrs / internal | **S4** for learners; **S1** for anchors |
| S65-SIG-A02 | title | 26/26 | h3 | **S1** |
| S65-SIG-A03 | archetype (`episode_plan.archetype` or row) | 11/26 have episode_plan; labelled archetypes: understand 3, analyse 4, apply 1, evaluate 3; 15/26 none | **not shown as mode label** | **S3** — bounded presentation only; do not invent plan depth |
| S65-SIG-A04 | duration | 23/26 | Duration badge | **S2** |
| S65-SIG-A05 | grouping | 19/26 | Grouping badge | **S2** |
| S65-SIG-A06 | mapped_learning_outcomes | 0/26 | none observed | **S2**/unknown richness |

## Cognitive Orientation Signals

All optional; empty → chrome omitted (tests: kitchen-sink 30-1b/30-2r; cognition 29-2).

| Signal ID | Field | Freq | Consumer | Safe use |
| --------- | ----- | ---- | -------- | -------- |
| S65-SIG-C01 | activity_preamble (+ aliases) | 5/26 | framing | **S2** |
| S65-SIG-C02 | study_orientation / intellectual_frame | 2/26 each | framing cues | **S2** |
| S65-SIG-C03 | intellectual_coherence_bridge | 2/26 | “Connection to previous activity” | **S2** |
| S65-SIG-C04 | reasoning_orientation (+ aliases) | 2/26 | framing | **S2** |
| S65-SIG-C05 | self_explanation_prompt | 3/26 | cognition / instructional path | **S2** |
| S65-SIG-C06 | transformation_activity | 0/26 | cognition pack | **S2** (absent in set) |
| S65-SIG-C07 | source_to_application_prompt | 0/26 | cognition pack | **S2** (absent) |
| S65-SIG-C08 | transfer_or_application_task | 1/26 | cognition / transfer section | **S2** |
| S65-SIG-C09 | support_note | 8/26 | support note block | **S2** / **S5** body |

## Task and Output Signals

| Signal ID | Field | Freq | L4 | Safe use |
| --------- | ----- | ---- | -- | -------- |
| S65-SIG-T01 | learner_task (+ aliases) | 26/26 | What to do / Your goal | **S1** |
| S65-SIG-T02 | expected_output (+ aliases) | 21/26 | Success looks like (± suppressed if checklist restatement) | **S1** with dedupe awareness |

## Verification Signals

| Signal ID | Field | Notes | Safe use |
| --------- | ----- | ----- | -------- |
| S65-SIG-V01 | checklist material | 14/87 materials type checklist (+ aliases); criteria promoted into Success | **S1** structure / **S5** criterion text |
| S65-SIG-V02 | sample_output | 2/87 | **S2** / **S5** |
| S65-SIG-V03 | worked_example | 8/87 | **S2** / **S5** |
| S65-SIG-V04 | assessment explanations/answers | companion + kitchen-sink patterns | **S3** (visibility depends on feedback display) |

## Sequence and Progression Signals

| Signal ID | Field | Notes | Safe use |
| --------- | ----- | ----- | -------- |
| S65-SIG-S01 | activity order | Array order drives journey | **S1** |
| S65-SIG-S02 | episode_plan.beats[].function | 11/26 activities; beat fn counts in frequency JSON | **S1** for phase labels when plan present |
| S65-SIG-S03 | `_render_sequence` | Authoritative residual order after beats | **S3** — can orphan materials |
| S65-SIG-S04 | beat-material registry match | Primary grouping mechanism | **S3** — incomplete type coverage |
| S65-SIG-S05 | coherence bridge | 2/26 | **S2** progression prose |

## Material Signals

| Signal ID | Field | Freq | Notes | Safe use |
| --------- | ----- | ---- | ----- | -------- |
| S65-SIG-M01 | material_type / map key | 87/87 typed or keyed | Drives heading + renderer family | **S1** structure / **S5** wording |
| S65-SIG-M02 | material title | 30/87 | May be fixture IDs | **S5**; filter fixture titles (partial `isFixtureTestMaterialTitle`) |
| S65-SIG-M03 | body | 87/87 | Content-owned | **S5** |
| S65-SIG-M04 | purpose | retained on titled payloads | Rarely shown as own chrome | **S2**/weak |
| S65-SIG-M05 | instructional_function | **0/87** | Code treats as meta-only; not in samples | **S3** — do not rely |
| S65-SIG-M06 | plan_beat_index | **0/87** | Same | **S3** — do not rely; validate before any use |

## Assessment Signals

| Signal ID | Notes | Safe use |
| --------- | ----- | -------- |
| S65-SIG-AS01 | assessment present 4/8 pages | **S2** page-level |
| S65-SIG-AS02 | item prompt/options | Learner-facing MCQ chrome | **S1** when present |
| S65-SIG-AS03 | answer/explanation | Conditional on feedback settings | **S3** |

## Diagnostics and Metadata

| Signal ID | Field | Visibility | Safe use |
| --------- | ----- | ---------- | -------- |
| S65-SIG-D01 | schema_version | 1/8; meta | **S4** |
| S65-SIG-D02 | assembly_state / enriched_by | 1/8; meta | **S4** |
| S65-SIG-D03 | PrismRenderNormalized | meta | **S4** |
| S65-SIG-D04 | generation_notes / diagnostics / source_artefacts | meta | **S4** |
| S65-SIG-D05 | beat-render console diagnostic | console only | **S4** |
| S65-SIG-D06 | fixture marker strings in bodies | learner-visible content | **S5**/F1 — not renderer diagnostics |

## Archetype Audit

| Archetype | Source | Count in 26 activities | Validation | Current render use | Visible label? | Structure change? |
| --------- | ------ | ---------------------- | ---------- | ------------------ | -------------- | ----------------- |
| understand | `episode_plan.archetype` | 3 | Generation contracts constrain enum | Not used as shell variant | No | No |
| analyse | same | 4 | same | No | No | No |
| apply | same | 1 | same | No | No | No |
| evaluate | same | 3 | same | No | No | No |
| (none) | — | 15 | Activities without episode_plan | Fallback: non-beat material order | — | Materials may still render |

**Answer:** Archetype is **descriptive metadata today**, not a reliable presentation signal. It is **safe later only as a bounded S3 presentation cue** when present on `episode_plan` — never as a licence to invent missing plan fields.

## Beat and Ordering Audit

1. **Survive:** `episode_plan.beats[].function` on 11/26 activities; functions seen: explanation, worked_thinking, guided_practice, verification, worked_judgement, transfer.
2. **Consumed:** `resolveBeatMaterialPlan` → beat sections + learner-facing labels.
3. **Ignored for ordering:** `instructional_function`, `plan_beat_index` (absent + meta-only).
4. **Conflict / gap:** Registry incomplete — **`planning_table` has no registry entry** → unassigned → residual after verification (BL-001 A3). Types with `episodeFunctions` that do not match any beat on the plan (e.g. `text`→explanation when plan has no explanation) stay unassigned (BL-001 A4 orphan Text). Types without `episodeFunctions` (e.g. `analysis_table`) rely on second-pass PRACTICE matching.
5. **Residual ordering (F09):** Unassigned keys then `_render_sequence` / leftover key iteration after beat groups → materials after “Check your work”.
6. **Safe Sprint 65 grouping?** Yes, **with constraints:** prefer beat plan when present; treat registry match as best-effort; expect residuals for unregistered types; do not invent beat membership from archetype alone.
7. **Constraints:** No new schema; no inferring hidden plan fields; residual path must be designed for explicitly.

## Material-Type Audit

Encountered types in sample set (counts = materials/87): checklist 14, text 9, worked_example 8, analysis_table 8, scenario 5, template 4, decision_table 3, transfer_prompt 3, task_cards 3, plus many one-offs (see frequency JSON).

| Type family | Dedicated path? | Learner label today | Role ambiguity | Notes |
| ----------- | --------------- | ------------------- | -------------- | ----- |
| text / reading_text / support_text | prose | “Text” | High | Generic |
| worked_example / modelling_note / sample_output | worked/prose | Worked Example / Modelling Note / Sample Output | Medium | Good role signal |
| checklist (+ evaluation_checklist) | checklist block | Checklist | Low | Duplicates Success promotion |
| tables (analysis/classification/decision/planning/…) | table render | Type heading | Medium | **planning_table unregistered** |
| scenario(s) | scenario cards | Scenarios + title | Medium | Fixture titles leak |
| template / analysis_template | template | Template | High | Implementation-facing |
| transfer_prompt | generic/beat | Transfer Prompt | High | Label leak |
| prompt_set / discussion_prompts | prompt set | Prompt set family | Medium | |
| unknown keys | titled Markdown fallback | Key-derived heading | High | Tested: material-completeness unknown type |

Empty/missing material: unknown type still renders fallback (test). Missing optional cognition: omit chrome (tests).

## Optionality and Fallback Behaviour

| Missing signal | Behaviour | Evidence |
| -------------- | --------- | -------- |
| Cognition / framing fields | Section omitted; no empty labels | kitchen-sink 30-1b/30-2r; cognition 29-2 |
| expected_output | Success may still show from checklist alone | `buildLearnerJourneyFrameHtml` |
| checklist | No checklist promotion; output may still show | code path |
| episode_plan | Non-beat ordering (role / sequence / keys) | app.js beat-first gate |
| overview / purpose / knowledge / tips | Section omitted | normalize empty skip + legacy fallback test when synthesis present |
| assessment | Section absent | 4/8 have assessment |
| Unknown material type | Titled markdown fallback — not silent loss | material-completeness test |
| Unregistered type under beat plan | Residual after beats | planning_table / orphan text |

## Semantic Overlap Analysis

| Signal A | Signal B | Shared learner function | Important distinction | Duplication risk | Later design implication |
| -------- | -------- | ----------------------- | --------------------- | ---------------- | ------------------------ |
| activity_preamble | reasoning_orientation | Orient thinking | Preamble = why/context; reasoning = how to think | Medium when both present | BL-003 contract slots |
| intellectual_coherence_bridge | journey nav | Progression | Bridge = why-next prose; nav = where | Low (complementary) | Prefer both roles |
| learner_task | transformation_activity | Action | Task = do now; transformation = convert source | Low (transf. rare) | Don’t merge blindly |
| expected_output | checklist | Success | Output = product; checklist = quality checks | **High** (promotion) | Deduplicate presentation |
| expected_output | sample_output | Product clarity | Expected = requirement; sample = model | Medium | Keep distinct |
| episode beats | material type | Sequencing | Beat = phase; type = artifact kind | Medium | Prefer beats for order |
| material type | material title | Identity | Type = kind; title = instance | High when title = type or fixture ID | Relabel policy |
| overview | learning journey intro | Session orientation | Same string often reused | **High** on RNA | Don’t double-print |

Do not lock composition here — **S65-BL-003**.

## Safe-Use Classification

| Class | Examples |
| ----- | -------- |
| **S1** | title; activity title; learner_task; journey nav; beat functions (when plan present); assessment prompts when present; checklist/table structure |
| **S2** | duration/grouping; overview/purpose/knowledge/tips; most cognition fields; transfer materials; sample/worked example bodies |
| **S3** | archetype as presentation cue; `_render_sequence` residuals; instructional_function / plan_beat_index **if ever present**; assessment answers |
| **S4** | schema_version, assembly_state, PrismRenderNormalized, diagnostics, generation_notes; learning_outcomes if only in meta |
| **S5** | material bodies; criterion wording; scenario prose; fixture marker text |
| **S6** | `required_links`, plan `stages`, `key_relationships`, `governing_constraint` |

## Explicit Unavailable Signal Register

| Field | Upstream | In raw required-material plans? | Retained in final materials? | Available to renderer? | Reconstructable? | Sprint 65 status |
| ----- | -------- | ------------------------------- | ---------------------------- | ---------------------- | ---------------- | ---------------- |
| `required_links` | archetype_plan | Upstream only | No as structure | No | No | **S6** — Known architecture ceiling — not a Sprint 65 renderer defect. |
| `stages` | archetype_plan | Upstream only | No as plan structure (nested scenario body stages ≠ plan stages) | No as plan signal | No | **S6** — Known architecture ceiling — not a Sprint 65 renderer defect. |
| `key_relationships` | archetype_plan | Upstream only | No | No | No | **S6** — Known architecture ceiling — not a Sprint 65 renderer defect. |
| `governing_constraint` | archetype_plan | Upstream only | No | No | No | **S6** — Known architecture ceiling — not a Sprint 65 renderer defect. |

## Findings

| ID | Finding | Evidence |
| -- | ------- | -------- |
| S65-F10 | Archetype is metadata, not shell-driving | A03; 11/26 plans; no mode badge in render path |
| S65-F11 | `planning_table` unregistered → residual after verification | Registry gap; BL-001 A3; S65-SIG-S04 |
| S65-F12 | Materials with unmatched `episodeFunctions` orphan after beats | Registry second-pass skip; A4 Text |
| S65-F13 | `instructional_function` / `plan_beat_index` unused in sample set and unsafe assumptions | 0/87; meta-only keys; normalize array conversion drop |
| S65-F14 | Cognition fields are safe optional signals with clean omission | C01–C08; kitchen-sink / cognition tests |
| S65-F15 | `learning_outcomes` folded to meta when present — not primary orientation | metadataKeys; 0/8 in sample set |
| S65-F16 | Success↔checklist duplication is renderer composition of two S1/S5 signals | T02+V01; `buildLearnerJourneyFrameHtml` |

## Implications for S65-BL-003

- Build activity contracts from **S1/S2** signals only; treat archetype as optional **S3** cue.
- Assume cognition packs often missing — contracts must omit cleanly.
- Address Success/checklist overlap explicitly without inventing new fields.
- Beat ordering designs must account for registry gaps and residual materials.
- Do not depend on `instructional_function` / `plan_beat_index` or Sprint 63 plan fields.

## Unknowns Requiring Later Validation

```text
Unknown — requires later cross-sample validation (S65-BL-008) or production corpus scan:
```

- Repository-wide frequency of cognition fields and learning_outcomes
- Whether live pages ever carry `instructional_function` / `plan_beat_index` post-GAM
- Full material-type enumeration beyond page-render fixtures
- Assessment feedback_display combinations on learner exports

## Conclusion

The renderer already has a usable signal surface for titles, tasks, outputs, beat phases (when planned), materials, optional cognition, page synthesis slots, journey nav, and assessment — with clean omission for many optionals. It does **not** safely expose deep archetype-plan structure. Several “available sounding” fields are unused or discarded (`instructional_function`, `plan_beat_index`; archetype as chrome; learning_outcomes as primary orientation). Sprint 65 design work must stay inside S1–S5 and treat S6 as architecture ceiling.

**Next:** S65-BL-003 — Learner activity contract comparison.
